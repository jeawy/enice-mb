<template>
  <view class="main">
    <view class="feedbackbox">
      <view class="middle">
        <view>
          
          <view class="title">{{ exchange.title }}</view>
          <view
            @tap="goList"
            class="status"
            >{{ exchange.exchangetype | exchangeFilter }}</view
          >
        </view>
      </view>
      <view class="second-title">
        <view class="time" >{{ exchange.user.username? exchange.user.username:exchange.user.phone}} 发布在【{{ exchange.communityname }}】闲置租售市场
        </view
        >
      </view>
      
      <view class="v-money">
        <view class="money-holder">
          <view class="moneytxt">{{ exchange.exchangetype | exchangeTxtFilter }}</view>
          <view class="money">￥{{ exchange.money }}</view>
           <image
                v-if="exchange.reason == 1 && exchange.status == 2"
                :src="baseAppUrl + '/exchanges/'+ $options.filters.exchangeImgFilter(exchange.exchangetype ) +'.png'"
                class="picture_saled"
                mode="aspectFill" 
              />   
        </view>
        <view class="read">
          <view class="moneytxt" @tap="orgPhone(exchange.user.phone)" v-if="exchange.publich_myinfo == 1">联系电话:{{exchange.user.phone }} </view>  
          <view class="moneytxt" v-else>联系方式已隐藏 </view>  
          <view class="moneytxt">发布时间:{{exchange.date | time}} </view>  
        </view>
      </view>
      <view class="content-box" v-if="exchange.content !== ''">
        <view class="content">{{ exchange.content }}</view>
      </view>
      <view
        :class="result !== null ? 'picturebox' : 'picture_active'"
        v-if="exchange.images.length !== 0"
      >
        <view v-for="(item, index) in exchange.images" :key="index">
          <image
            :src="imgurl + item.filepath"
            class="picture"
            mode="aspectFill"
            @tap="previewImage(index)"
          />
        </view>
      </view>  
   
      <!-- 分享 -->
      <view class="tools" >
        <view class="share" @click="uniShare">
          <image class="shareimg" :src="baseAppUrl + `share1.png`"></image>
          <view class="sharetxt">分享</view>
        </view>
        <view class="share collect" @click="collectAct" v-if="collected">
          <image class="shareimg" :src="baseAppUrl + `collected.png`"></image>
          <view class="sharetxt">已收藏</view>
        </view>
         <view class="share collect" @click="collectAct" v-else>
          <image class="shareimg" :src="baseAppUrl + `uncollect.png`"></image>
          <view class="sharetxt">收藏</view>
        </view>
        <view class="v-iwantbtn"  v-if="exchange.status ==1">
           <button class="iwantbtn"  @tap="AcceptExchanges">我想要</button>
        </view>
      </view>
      <uni-popup ref="popupshare" class="popupshare" type="top">
        <view class="popupshare-holder">
          <view class="fillmsg">
            <image :src="baseAppUrl + `fxjt.png`" class="fxjt"></image>
            <view class="txt">点击这里进行分享</view>
          </view> 
          <image
            :src="baseAppUrl + `wzdl.png`"
            @tap="closeshare"
            class="wzdl"
          />
        </view>
      </uni-popup>
      <likeCountCommentComm 
         ref="comments"
        :entityuuid="uuid"
        :entitytype="entitytype"
        :baseUrl="baseImageUrl"
        :baseAppUrl="baseAppUrl"
        :owneruuid="owneruuid"
        :orguuid="orguuid"
        :allowcomment="allow_comment"
        :commenttxt="commenttxt"
        />
      </view>
      <view class="tips" v-if="exchange.status == 1">
        <view class="title">
          <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
          <text>温馨提示:</text>
        </view>
         <view class="appraisetxt" >1、不得发布黄赌毒信息,一经发现将永久禁用该功能，情节严重报警处理。</view >
        <view class="appraisetxt">2、平台只提供信息发布,无法确保信息的真实性，请用户自行判断。</view>
        <view class="appraisetxt">3、为了保证用户的最大利益，对于明显的失实信息，平台有权删除。</view>
        <view  class="appraisetxt">4、请珍惜和睦的互联网环境。</view> 
      </view>
    </view>
    
</template>

<script>
import store from "@/store"; 
import likeCountCommentComm from "@/components/likesreadcomment" 
import { getAnonymousExchanges, updateExchanges } from "@/api/exchanges.js";
import { ApigetCollections, ApiPostCollection } from "@/api/collection.js";
// #ifdef  APP-PLUS
import UniShare from "uni_modules/uni-share/js_sdk/uni-share.js";
const uniShare = new UniShare();
//#endif
export default {
  components: { 
    likeCountCommentComm
  },
  data() {
    return {
      entitytype:18,
      allow_comment:true,
      owneruuid:"",
      orguuid:"",
      commenttxt:"留言",
      baseImageUrl: this.$mStore.state.BaseImagesUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      exchange: {
        user: {},
        images: [],
        entries: [],
        date:"",
        title:"",
        content:"",
        money:9999
      },
      cb: "",
      comment: "",
      score: 1,
      imageList: [], 
      hasLogin: this.$mStore.getters.hasLogin,
      uuid: "",
      status: "",
      baseUrl: this.$mStore.state.BaseUrl, 
      imgurl: "",
      result: "",
      showAddImage:true,
      Image: [],
      checked: [],
      isAnswer: false, //当前用户是否是接单人
      error: false,
      useruuid: "",
      pagepath:"",
      imageUrl:"",
      collected : false,
      entity_type:18//闲置出租出售
    };
  },
  filters: {
    exchangeImgFilter(status) {
      //1 闲置、2 求租；3 出租、4 求购、5 出售
      let statustxt = "未知状态";
      if (status == 1) {
        statustxt = "yichushou";
      } else if (status == 2) {
        statustxt = "yizu";
      } else if (status == 3) {
        statustxt = "yichuzu";
      } else if (status == 4) {
        statustxt = "yigoumai";
      } else if (status == 5) {
        statustxt = "saled";
      }
      return statustxt;
    },
    statusFilter(status) {
      let statustxt = "未知状态";
      if (status == 0) {
        statustxt = "暂存";
      } else if (status == 1) {
        statustxt = "等待接单";
      } else if (status == 2) {
        statustxt = "已关闭";
      } else if (status == 3) {
        statustxt = "已接单 ";
      } else if (status == 4) {
        statustxt = "已完成";
      } 
      return statustxt;
    },
    exchangeTxtFilter(status) {
      //1 闲置、2 求租；3 出租、4 求购、5 出售
      let statustxt = "未知状态";
      if (status == 1) {
        statustxt = ""; //闲置
      } else if (status == 2) {
        statustxt = "预算:"; //求租
      } else if (status == 3) {
        statustxt = "租金"; //预算
      } else if (status == 4) {
        statustxt = "预算:"; //求购
      } else if (status == 5) {
        statustxt = "";
      }
      return statustxt; 
      },
    exchangeFilter(status) {
      //1 闲置、2 求租；3 出租、4 求购、5 出售
      let statustxt = "未知状态";
      if (status == 1) {
        statustxt = "闲置";
      } else if (status == 2) {
        statustxt = "求租";
      } else if (status == 3) {
        statustxt = "出租 ";
      } else if (status == 4) {
        statustxt = "求购";
      } else if (status == 5) {
        statustxt = "出售";
      }
      return statustxt; 
      }
  },
  onBackPress({ from }) {
    if (from == "backbutton") {
      this.$nextTick(function () {
        uniShare.hide();
      });
      return uniShare.isShow;
    }
    uni.redirectTo({
      url: "/pages/exchanges/index",
    });
    return true;
  },
  onShareAppMessage() {
    return {
      title: "【"+this.$options.filters.exchangeFilter(this.exchange.exchangetype)+"】"+ this.exchange.title,
      desc: this.exchange.content,
      path: this.pagepath,
      imageUrl:this.imageUrl
    };
  },
  onShareTimeline(res){
    // 分享到朋友圈 
    return {
      title: "【"+this.$options.filters.exchangeFilter(this.exchange.exchangetype)+"】"+ this.exchange.title,
      desc: this.exchange.content,
      path: this.pagepath,
      imageUrl:this.imageUrl
    }
  },
  onLoad: function (option) {
    this.imgurl = this.$mStore.state.BaseUrl + "images/";
    this.imageUrl = this.baseAppUrl + "xianzhi.png"
    this.uuid = option.uuid;
    this.getdetail();
    if (this.hasLogin) {
      let userInfo = uni.getStorageSync("userInfo");
      this.useruuid = userInfo.uuid; // 当前用户的uuid
    }  
    this.pagepath = `/pages/exchanges/detail?uuid=${this.uuid}`
  }, 
  methods: {
    goList(){
      console.log(1111)
      this.$mRouter.push({
        route: "/pages/exchanges/list?from=share" ,
      }); 
    },
    collectAct(){
       // 收藏或者取消收藏
       if (!this.hasLogin) {
        // 提示登录
        this.$mHelper.backToLogin();
        return;
      }
       let typename = this.$options.filters.exchangeFilter(this.exchange.exchangetype)
       let image = ""
       if(this.exchange.images.length > 0 ){
        image  = this.exchange.images[0].filepath
       }
       let data = {
          entity_uuid : this.uuid,
          entity_type : this.entity_type,
          title: "【"+typename+"】"+this.exchange.title,
          image:  image,
          content : this.exchange.content,
          url:this.pagepath
       }
       console.log(data)
       ApiPostCollection(data).then((res)=>{
          if(res.status == 0){
            console.log(res.msg)
            uni.showToast({
              icon:"success",
              title:res.msg
            })
            this.getCollectionStatus()
          }
          else{
            uni.showToast({
              icon:"error",
              title:res.msg
            })
          }
       }) 
    },
    getCollectionStatus(){
      if (!this.hasLogin) { 
        return;
      }
      let params = {
        entity_uuid : this.uuid,
        entity_type : this.entity_type
      }
      ApigetCollections(params).then((res)=>{
        if (res.status == 0){
          if (res.msg > 0){
            this.collected = true
          } 
          else{
            this.collected = false
          }
        }
        else{
          uni.showToast({
              icon:"error",
              title:"请稍后重试"
            })
        }
      })
    }, 
    handleScoreChange(e) {
      this.score = e.value;
    },
    openPop() {
      this.$refs.popup.open("top");
    },
    EnrollSelect(selectuuid) {
      uni.showModal({
        content: "选他做为接单人？此操作无法取消",
        confirmText: "确定",
        success: (e) => {
          if (e.confirm) {
            let data = {
              enrolluuid: selectuuid,
              uuid: this.uuid,
              method: "put",
            };
            updateExchanges(data).then((res) => {
              if (res.status == 0) {
                uni.showToast({
                  icon: "success",
                  title: "操作成功",
                });
                this.getdetail();
              } else {
                uni.showToast({
                  icon: "error",
                  title: res.msg,
                });
              }
            });
          }
        },
      });
    },
    orgPhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
      });
    },
    appraise() {
      // 评价c
      console.log(this.uuid);
      let data = {
        score: this.score,
        uuid: this.uuid,
        method: "put",
      };
      updateExchanges(data).then((res) => {
        if (res.status == 0) {
          console.log(res);
          uni.showToast({
            icon: "success",
            title: "评价成功",
          });
          this.getdetail();
          this.$refs.popup.close();
        } else {
          uni.showToast({
            icon: "error",
            title: res.msg,
          });
        }
      });
    },
    checkboxChange: function (e) {
      this.checked = e.detail.value;
      this.error = false;
    },
    sendComment() {
      if (this.checked.length == 0) {
        uni.showToast({
          icon: "error",
          title: "请勾选红色部分",
        });
        this.error = true;
        return;
      }
      let data = {
        uuid: this.uuid,
        finish: 1,
        comment: this.comment,
        method: "put",
      };
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      updateExchanges(data)
        .then((res) => {
          let icon = "error";
          if (res.status == 0) {
            let imgs = [];
            if (this.imageList.length > 0) {
              this.imageList.forEach((value, index) => {
                imgs = imgs.concat({
                  name: "image" + index,
                  uri: value,
                });
              });
            }
            let token =
              store.state.accessToken || uni.getStorageSync("accessToken");
            imgs.forEach((ele) => {
              uni.uploadFile({
                url: this.$mStore.state.BaseUrl + "api/exchange/exchange/",
                filePath: ele.uri,
                name: ele.name,
                header: {
                  "Content-Type": "multipart/form-data",
                  Authorization: token,
                  // 'content-type': 'application/json'
                },
                formData: { uuid: this.uuid, method: "put", finish: 1 },
                success: (res) => {},
                fail: (res) => {
                  uni.showToast({
                    title: "失败",
                    icon: "none",
                  });
                  console.log(res);
                },
              });
            });
            icon = "success";
          }
          uni.showToast({
            icon: icon,
            title: res.msg,
          });
        })
        .finally((res) => {
          uni.hideLoading();
          this.getdetail();
        });
    },
    chooseImg() {
      //选择图片
      uni.chooseImage({
        sourceType: ["camera", "album"],
        sizeType: "compressed",
        count: 9 - this.imageList.length,
        success: (res) => {
          this.imageList = this.imageList.concat(res.tempFilePaths);
          if (this.imageList.length >= 9 ){
              this.showAddImage = false
            }
        },
      });
    },
    AcceptExchanges() {
      // 报名或抢单
      if (!this.hasLogin) {
        this.$mHelper.backToLogin(true);
        return;
      }
     
      let content = "我想要..."
      this.$refs.comments.addComment(content)
    },
    appshare(msg) {
      uni.showModal({
        content: msg + ",分享给认证业主？",
        confirmText: "分享",
        success: (e) => {
          if (e.confirm) {
            this.uniShare();
          }
        },
      });
    },

    uniShare() {
      // #ifdef  MP-WEIXIN
      // 微信小程序分享提示，微信小程序无法直接调用api
      this.$refs.popupshare.open("top");
      // #endif
      // #ifdef  APP-PLUS
      let exchangetxt = this.$options.filters.exchangeFilter(this.exchange.exchangetype) 
      let href = this.$mStore.state.BaseShareUrl+"?entity_type=12&"+"entity_uuid="+this.uuid
      uniShare.show(
        {
          content: {
            //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
            type: 0,
            href: href,
            title: "【"+exchangetxt+"】" + this.exchange.title,
            summary: this.exchange.title,
            imageUrl: this.baseAppUrl + "xianzhi.png", //  logo大小不能超过32kb，否则不会显示
          },
          menus: [
            {
              img: this.baseAppUrl + "app-plus/sharemenu/wechatfriend.png",
              text: "微信好友",
              share: {
                provider: 'weixin',
                scene: "WXSceneSession",
                type: 5, 
                title: "【"+exchangetxt+"】" + this.exchange.title,
                summary: this.exchange.title,
                imageUrl:  this.baseAppUrl + "xianzhi.png", 
                miniProgram: {
                    id: this.$mStore.state.WX_XIAOCHENGXU_ID,
                    path: this.pagepath,
                    type: 0,
                    webUrl: href
                },
                success: ret => {
                    console.log(JSON.stringify(ret));
                }
              },
            },
            {
              img: this.baseAppUrl + "app-plus/sharemenu/wechatmoments.png",
              text: "微信朋友圈",
              share: {
                provider: "weixin",
                scene: "WXSceneTimeline",
              },
            },
            {
              img: this.baseAppUrl + "app-plus/sharemenu/copyurl.png",
              text: "复制",
              share: "copyurl",
            },
            {
              img: this.baseAppUrl + "app-plus/sharemenu/more.png",
              text: "更多",
              share: "shareSystem",
            },
          ],
          cancelText: "取消分享",
        },
        (e) => {
          //callback
          console.log(uniShare.isShow);
          console.log(e);
        }
      ); 
      //#endif
    },
    getdetail() {
      let param = {
        uuid: this.uuid,
      };
      getAnonymousExchanges(param).then((data) => { 
        let _that = this;
        if (data.status == 0) {
          this.exchange = data.msg;
          this.owneruuid = this.exchange.user.uuid
          if(this.exchange.images.length > 0){
            this.imageUrl = this.baseImageUrl + this.exchange.images[0].filepath
          }
          if (this.hasLogin) { 
            if (this.exchange.stutus == 4 && owneruuid) {
              setTimeout(() => {
                // 5秒之后自动弹出评价窗口
                _that.$refs.popup.open("top");
              }, 5000);
            }
          }
          uni.setNavigationBarTitle({
            title:this.exchange.title
          })
          this.getCollectionStatus() 
        }
      });
    },
    previewImageComment(e) {
      this.Image = [];
      for (let i = 0; i < this.imageList.length; i++) {
        let image = this.imageList[i];
        this.Image.push(image);
      }
      uni.previewImage({
        current: this.Image[e],
        urls: this.Image,
      });
    },
    previewImageCommentDetail(e) {
      this.Image = [];
      for (let i = 0; i < this.exchange.commentimages.length; i++) {
        let image = this.imgurl + this.exchange.commentimages[i].filepath;
        this.Image.push(image);
      }
      uni.previewImage({
        current: this.Image[e],
        urls: this.Image,
      });
    },
    close() {
      this.$refs.popup.close();
      if (this.imageList.length < 9 ){
          this.showAddImage = true
        }
    },
    closeshare() {
      this.$refs.popupshare.close();
    },
    previewImage(e) { 
      this.Image = [];
      for (let i = 0; i < this.exchange.images.length; i++) {
        let image = this.imgurl + this.exchange.images[i].filepath;
        this.Image.push(image);
      }
      console.log(this.Image)
      uni.previewImage({
        current: this.Image[e],
        urls: this.Image,
      });
    },
  },
};
</script>

<style lang="scss" src="./detail.scss" scoped>
</style>
