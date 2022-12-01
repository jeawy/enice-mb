<template>
  <view class="page">
    <view class="feedback-title">
      <text>标题及分类[闲置、租售等]</text>
    </view>
    <view class="feedback-body">
      <text class="feedback-quick" v-model="sendData.type" @tap="chooseMsg">{{sendData.typetxt}}</text>
      <input
        :focus="titlefocus"
        :class="titleerror ? 'uni-error feedback-input' : 'feedback-input'"
        v-model="sendData.title"
        placeholder="标题(限32个字)"
      />
    </view>
    <view class="feedback-title">
      <text>文字描述</text>
    </view>
    <view class="feedback-body">
      <textarea
        placeholder="文字描述..."
        v-model="sendData.content"
        class="feedback-textare"
      />
    </view>
    <view class="feedback-title">
      <text>相关图片(选填,总大小10M以下)</text>
    </view>
    <view class="feedback-body feedback-uploader">
      <view class="uni-uploader">
        <view class="uni-uploader-head">
          <view class="uni-uploader-title">点击预览图片</view>
          <view class="uni-uploader-info">{{ imageList.length }}/9</view>
        </view>
        <view class="uni-uploader-body">
          <view class="uni-uploader__files">
            <block v-for="(image, index) in imageList" :key="index">
              <view class="uni-uploader__file" style="position: relative">
                <image
                  class="uni-uploader__img"
                  :src="image.uri"
                  @tap="previewImage"
                ></image>
                <view class="close-view" @click="close(index)">x</view>
              </view>
            </block>
            <view class="uni-uploader__input-box" v-show="showAddImage">
              <view class="uni-uploader__input" @tap="chooseImg"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
   
    <view class="v-switch">
      <text class="userinfotext">公开自己的手机号码？</text>
      <selectSwitch
        @change="changePhoneSwitch"
        :switchList="switchList"
        :defaultSwitch="defaultShowSwitch"
        checked_bj_color="#FF8000"
      />
    </view>
    
    <view class="feedback-title">
      <text>预期金额:</text>
    </view>
    <view class="feedback-body"> 
      <input
        type="number"
        class="feedback-input"
        @blur="otherMoney"
        v-model="sendData.money"
        placeholder=">5元"
      />
    </view>
    <view class="v-btns">
      <button type="primary" class="feedback-submit" @tap="send(0)">
        存草稿
      </button>
      <button
        type="primary"
        class="feedback-submit"
        v-if="payed == 0"
        @tap="send(1)"
      >
        发布
      </button>
      <button
        type="primary"
        class="feedback-submit"
        v-if="payed == 1"
        @tap="send(1)"
      >
        保存
      </button>
    </view>
    <view class="v-switch">
      <view>
        <view class="userinfotext explain">注意： </view>
        <view class="userinfotext" >1、不得发布黄赌毒信息,一经发现将永久禁用该功能，情节严重报警处理。</view >
        <view class="userinfotext">2、平台只提供信息发布,无法确保信息的真实性，请用户自行判断。</view>
        <view class="userinfotext">3、为了保证用户的最大利益，对于明显的失实信息，平台有权删除。</view>
        <view  class="userinfotext">4、请珍惜和睦的互联网环境。</view> 
      </view> 
    </view>
    <switchCommunities 
    :setDefaultCommunity=setDefaultCommunity
    :communityuuid=communityuuid
    :baseAppUrl=baseAppUrl
    :communityname=communityname
     ref="communities">
     </switchCommunities>
  </view>
</template>

<script>
import store from "@/store";
import selectSwitch from "@/components/xuan-switch/xuan-switch.vue";
import {
	 memberUpdate
	} from '@/api/userInfo'; 
import moment from "@/common/moment";
import { subNotice } from "@/api/notice";
import { updateExchanges, getExchanges } from "@/api/exchanges.js";
import sPopup from "@/components/s-popup/index.vue";
import Vue from "vue";
import {
  getNearbyCommunitiesApi,
  getProprietorCommunities,
} from "@/api/community";
import switchCommunities from "@/components/communities"
export default {
  components: {
    selectSwitch,
    sPopup,
    switchCommunities
  },
  data() { 
    return {
      showSelectCommunity: false,
      selectedCommunityList: [], // 选择的小区
      confirmLoading: false,
      confirmDisabled: false,
      mycommunities: [],
      nearbycommunities: [],
      communityname:"",
      titlefocus: true,
      titleerror: false,
      position: {},
      showAddImage: true,
      defaultShowSwitch: true,
      defaultShowCrtSwitch: false,
      msgContents: [
        {
          id:1,
          txt:"闲置"
        },
        {
          id:4,
          txt:"求购"
        },
        {
          id:3,
          txt:"出租"
        },
        {
          id:2,
          txt:"求租"
        },
        {
          id:5,
          txt:"出售"
        } 
         ],
      switchList: ["是", "否"],
      imageList: [],
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      BaseUrlImage: this.$mStore.state.BaseUrl,
      exchangeuuid: "",
      payed: 0,
      sendData: {
        title: "",
        content: "",
        typetxt:"闲置",
        exchangetype:1,//默认闲置
        secretinfo: "", // 机密信息
        need_propertior: 1, //是否要求必须是认证业主接单，默认是1 
        publich_myinfo: 1, //是否公开自己的电话、房号
        money: 5, 
      },
      current: 5,
      deletedImagesIds: [],
      items: [
        { value: 5, name: "5", checked: true },
        { value: 50, name: "50" },
        { value: 100, name: "100" },
      ],
      communityuuid: "",
      hasLogin: this.$mStore.getters.hasLogin,
    };
  },
  onShow() { 
    
    let exchangetype = uni.getStorageSync("exchangetype");
    
    if(exchangetype){ 
      this.sendData.exchangetype = exchangetype
      this.sendData.typetxt = this.getExchangesText(exchangetype);
    }
    else{ 
      this.sendData.exchangetype = 1
      uni.setStorageSync("exchangetype", 1);
    }
  },
  onLoad(option) {
    this.exchangeuuid = option.uuid;
    if (this.exchangeuuid && this.hasLogin) {
      this.getDetail();
    }
    this.communityuuid = uni.getStorageSync("communityuuid");
    if (!this.hasLogin){ 
        this.$mHelper.backToLogin(); 
    }
    else{
      
      console.log(this.communityuuid )
      if(this.communityuuid == "" || this.communityuuid == "undefined") 
      { 
        setTimeout(() => {
              this.$refs.communities.switchCommunity()
        }, 2000); 
      } 
    }
    
  }, 
  computed: {
			UserInfo() { 
        console.log(this.$mStore.state.userInfo)
				return this.$mStore.state.userInfo
			},
  },
  methods: {
    setDefaultCommunity(communityuuid, name) {
		// 设置默认的小区 
    this.communityuuid = communityuuid 
    },  
    getExchangesText(id_index){
      for(var i = 0; i <this.msgContents.length; i++ ){
        if(this.msgContents[i].id == parseInt(id_index))
        {
          return this.msgContents[i].txt
        }
      }
    },
    deleteItem(index) {
      // 长按删除列
      this.selectedCommunityList.splice(index, 1);
    },
    openPopup() {
      //弹出选择小区
      this.$refs.popupCommunity.show("top");
    },
    selectCommunity(item, index, communitytype) {
      //选择小区
      if (communitytype == 1) {
        // 附近小区
        let mark = this.nearbycommunities[index][4];
        if (this.selectedCommunityList.length >= 3 && mark == false) {
          uni.showToast({
            icon: "error",
            title: "最多选择三个",
          });
          return;
        }
        Vue.set(this.nearbycommunities[index], 4, !mark);
      } else {
        // 我关注的小区
        let mark = this.mycommunities[index][2];
        if (this.selectedCommunityList.length >= 3 && mark == false) {
          uni.showToast({
            icon: "error",
            title: "最多选择三个",
          });
          return;
        }
        Vue.set(this.mycommunities[index], 2, !mark);
      }
      this.updateCommunityList();
    },
    btnGuanzhu() {
      this.$refs.popupCommunity.hide();
    },
    updateCommunityList() {
      this.selectedCommunityList = [];
      this.mycommunities.forEach((item) => {
        let inList = false;
        for (let i = 0; i < this.selectedCommunityList.length; i++) {
          if (
            item[0] == this.selectedCommunityList[i].uuid &&
            item[2] == true
          ) {
            inList = true;
            break;
          }
        }
        if (inList == false && item[2] == true) {
          this.selectedCommunityList.push({
            name: item[1],
            uuid: item[0],
          });
        }
      });
      this.nearbycommunities.forEach((item) => {
        let inList = false;
        for (let i = 0; i < this.selectedCommunityList.length; i++) {
          if (
            item[1] == this.selectedCommunityList[i].uuid &&
            item[4] == true
          ) {
            inList = true;
            break;
          }
        }
        if (inList == false && item[4] == true) {
          this.selectedCommunityList.push({
            name: item[0],
            uuid: item[1],
          });
        }
      });
    },
    getMoreCommunity() {
      this.$mRouter.push({
        route: "/pages/user/properties",
      });
    },
    date(val) {
      // 日期格式化
      return moment(val * 1000).format("YYYY-MM-DD");
    },
    getDetail() {
      // 获取详情
      let params = {
        uuid: this.exchangeuuid,
      };
      getExchanges(params).then((res) => {
        if (res.status == 0) {
          this.sendData = res.msg; 
          if (this.sendData.publich_myinfo == 1){
            this.defaultShowSwitch = true
          }
          else{
            this.defaultShowSwitch = false
          }
          this.items.forEach((item) => {
            if (item.value == res.msg.money) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
          if (res.msg.need_propertior == 1) {
            this.defaultShowCrtSwitch = true;
          }
          res.msg.images.forEach((item) => {
            this.imageList = this.imageList.concat({
              uuid: item.id,
              uri: this.BaseUrlImage + "/images/" + item.filepath,
            });
          });
          this.payed = res.msg.payed;
          for (let i = 0; i < res.msg.communities.length; i++) {
            this.selectedCommunityList.push({
              uuid: res.msg.communities[i].community__uuid,
              name: res.msg.communities[i].community__name,
            });
          }
        }
      });
    },
    changeCertificateSwitch(isSwitch) {
      //
      if (isSwitch) {
        this.sendData.need_propertior = 1;
        this.showSelectCommunity = true;
        this.getNearbyCommunities();
        this.proprietorCommunities();
        this.$refs.popupCommunity.show("top");
      } else {
        this.sendData.need_propertior = 0;
        this.showSelectCommunity = false;
      }
    },
    changePhoneSwitch(isSwitch) {
      //
      console.log(isSwitch)
      if (isSwitch) {
        this.sendData.publich_myinfo = 1;
      } else {
        this.sendData.publich_myinfo = 0;
      }
    },  
    otherMoney() {
      this.items.forEach((item) => {
        item.checked = false;
      });
      if (this.sendData.money > 5000) {
        uni.showToast({
          icon: "error",
          title: "金额别超过5000",
        });
        this.sendData.money = 5000;
      }
    }, 
    changeSwitch(isSwitch) {
      //
      if (isSwitch) {
        this.show_userinfo = 1;
      } else {
        this.show_userinfo = 0;
      }
    }, 
    close(e) {
      this.deletedImagesIds = this.deletedImagesIds.concat(
        this.imageList[e].uuid
      );
      this.imageList.splice(e, 1);
      if (this.imageList.length < 9) {
        this.showAddImage = true;
      }
    },
    chooseMsg() {
      //快速输入
      let txtlist = []
      for(let i = 0; i < this.msgContents.length; i++){
          txtlist.push(this.msgContents[i].txt)
      }
      uni.showActionSheet({
        itemList: txtlist,
        success: (res) => {
          this.sendData.exchangetype = this.msgContents[res.tapIndex].id;
          this.sendData.typetxt = this.msgContents[res.tapIndex].txt;
          uni.setStorageSync("exchangetype", this.sendData.exchangetype);
        },
      });
    },
    chooseImg() {
      //选择图片
      uni.chooseImage({
        sourceType: ["camera", "album"],
        sizeType: "compressed",
        count: 9 - this.imageList.length,
        success: (res) => {
          res.tempFilePaths.forEach((item) => {
            this.imageList = this.imageList.concat({
              uuid: -1,
              uri: item,
            });
            if (this.imageList.length >= 9) {
              this.showAddImage = false;
            }
          });
        },
      });
    },
    chooseStar(e) {
      //点击评星
      this.sendData.score = e;
    },
    previewImage() {
      //预览图片
      let preimages = this.imageList.map((value, index) => {
        return {
          name: "image" + index,
          uri: value.uri,
        };
      });
      uni.previewImage({
        urls: preimages,
      });
    },
    send(status) {
      if(this.communityuuid == "" || this.communityuuid == "undefined") 
      { 
        uni.showToast({
          icon:"error",
          title:"请选择小区"
        })
        this.$refs.communities.switchCommunity()
        return 
        
      }
      if (!this.hasLogin){ 
        this.$mHelper.backToLogin(); 
        return
      }
      //发送反馈
      if (status == 1 && this.sendData.title == "") {
        this.titleerror = true;
        this.titlefocus = true;
        uni.showToast({
          icon: "error",
          title: "输入标题",
        });
        // #ifdef MP-WEIXIN
        let scrollTop = 0;
        // #endif

        // #ifdef APP-PLUS
        let scrollTop = 60;
        // #endif
        uni.pageScrollTo({
          scrollTop: scrollTop,
          duration: 300,
        });
        return;
      }
      let imgs = [];
      if (this.imageList.length > 0) {
        this.imageList.forEach((value, index) => {
          if (value.uuid == -1) {
            imgs = imgs.concat({
              name: "image" + index,
              uri: value.uri,
            });
          }
        });
      }
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      if (this.exchangeuuid) {
        this.sendData["method"] = "put";
        this.sendData["uuid"] = this.exchangeuuid;
        // 已经删除的图片id
        this.sendData["deletedImagesIds"] = JSON.stringify(
          this.deletedImagesIds
        );
      }
      this.$delete(this.sendData, "reason")
      updateExchanges({
        ...this.sendData,
        communityuuid: this.communityuuid,
        status: status, 
      })
        .then((data) => { 
          if (data.status === 0) {
            if (imgs.length > 0) {
              uni.showLoading({
                mask: true,
                title: "请稍后...",
              });
              let token = store.state.accessToken || uni.getStorageSync("accessToken");
              // 上传图片，微信小程序不支持批量上传
              let updateuuid = "";
              if (this.exchangeuuid) {
                updateuuid = this.exchangeuuid;
              } else {
                updateuuid = data.msg.uuid;
              }
              let index = 1;
              imgs.forEach((ele) => {
                console.log(ele)
                uni.uploadFile({
                  url: store.state.BaseUrl + "api/exchanges/exchanges/",
                  filePath: ele.uri,
                  name: ele.name,
                  header: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token, 
                  },
                  formData: { uuid: updateuuid, method: "put" },
                  success: (res) => {
                    if (index == imgs.length){
                      // 发布之后跳转支付
                      let uuid = data.msg.uuid;
                      this.$mRouter.push({
                        route: "/pages/exchanges/detail?uuid=" + uuid  ,
                      });
                      uni.hideLoading();
                    } 
                    else{
                      index += 1
                    }
                  },
                  fail: (res) => {
                    uni.showToast({
                      title: "失败",
                      icon: "none",
                    });
                  },
                });
              });
            }
            //#ifdef MP-WEIXIN 
            this.getUserProfile()
            // 订阅消息
            wx.requestSubscribeMessage({
              // 评论回复通知
              tmplIds:['29tuw3KtIKitYrbjLxm7bAPkd7NmdubNKNb_OC7-4wc'],
              success (res) { 
                console.log(res) 
                let moIdState = res['29tuw3KtIKitYrbjLxm7bAPkd7NmdubNKNb_OC7-4wc'];  // 用户同意的消息模板id
                if(moIdState === 'accept'){     
                    let subdata = {
                      subtype : 7,
                    }
                    subNotice(subdata).then((subres)=>{  }) 
                } 
                else{

                }
              },
                fail(res){
                  console.log(res)
              }
            }) 
            //#endif 
            if(imgs.length == 0){
              // 发布之后跳转 
              let uuid = data.msg.uuid;
              this.$mRouter.push({
                route: "/pages/exchanges/detail?uuid=" + uuid  ,
              });  
            } 
          }
          else{
            uni.showToast({
              icon:"error",
              title:data.msg
            })
            console.log(data.msg)
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .finally((res) => {
          uni.hideLoading();
        });
    },
    getUserProfile(){
      // 获取微信头像及名称
       // #ifdef MP-WEIXIN 
				let _this = this
        if(_this.UserInfo.username == ''|| _this.UserInfo.username == null){
             
          uni.getUserProfile({
            desc:"Wexin",
            success: function(infoRes) {  
              _this.$http.post(`${memberUpdate}?uuid=${_this.UserInfo.uuid}`, {
              wxusername:infoRes.userInfo.nickName, 
              wximage:infoRes.userInfo.avatarUrl, 
              method : "put"
            }).then((r) =>{   
              setTimeout(() => {
                _this.$mStore.state.userInfo.username = infoRes.userInfo.nickName
                _this.$mStore.state.userInfo.thumbnail_portait = infoRes.userInfo.avatarUrl
                
              }, 1500);
            }).catch((r) => {
              console.log(r) 
            });
            },fail:(res)=>{    
              console.log(res)  
            } 
          })
        }
        // #endif
			},
    proprietorCommunities() {
      // 获取我的关注列表
      if (this.hasLogin) {
        getProprietorCommunities().then((res) => {
          if (res.status == 0) {
            this.mycommunities = res.msg;
            for (let i = 0; i < this.mycommunities.length; i++) {
              this.mycommunities[i].push(false);
              for (let j = 0; j < this.selectedCommunityList.length; j++) {
                if (
                  this.selectedCommunityList[j].uuid == this.mycommunities[i][0]
                ) {
                  Vue.set(this.mycommunities[i], 2, true);
                }
              }
            }
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
            });
          }
        });
      }
      else{
        this.$mHelper.backToLogin();
      }
    },
    getNearbyCommunities(refresh = false) {
      // refresh = true时，强制刷新附近小区
      uni.showLoading({
        mask: true,
      });
      this.nearbycommunities = uni.getStorageSync("nearbycommunities");
      if (this.nearbycommunities && refresh == false) {
        //有缓存数据
        this.setNearbyList(this.nearbycommunities);
        uni.hideLoading();
      } else {
        if (this.position.longitude == undefined) {
          // 提示没有设置定位权限
          uni.hideLoading();
          return;
        }
        getNearbyCommunitiesApi({
          longitude: this.position.longitude,
          latitude: this.position.latitude,
        })
          .then((res) => {
            if (res.status == 0) {
              uni.setStorageSync("nearbycommunities", res.msg);
              this.setNearbyList(res.msg);
            }
          })
          .finally((res) => {
            uni.hideLoading();
          });
      }
    },
    setNearbyList(communities) {
      this.nearbycommunities = []; // 附近小区
      for (var i = 0; i < communities.length; i++) {
        var communityuuid = communities[i][1];
        if (
          (this.communityuuid == "" || this.communityuuid == "undefined") &&
          i == 0
        ) {
          communities[i].push(true);
          this.nearbycommunities.push(communities[i]);
          // 之前没有设置过小区，首次进行设置
          this.setDefaultCommunity(communities[i][1], communities[i][0]);
        } else if (this.communityuuid == communityuuid) {
          communities[i].push(true);
          this.nearbycommunities.push(communities[i]);
        } else {
          communities[i].push(false);
          this.nearbycommunities.push(communities[i]);
        }
      }
    },
    //获取当前的位置
    doGetLocation() {
      uni.getLocation({
        type: "wgs84",
        success: (res) => {
          this.position = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },
  },
  beforeDestroy() {
    uni.hideLoading();
  },
  onNavigationBarButtonTap(val) {
    if (val.index == 0) {
      uni.navigateTo({
        url: "../exchanges/list",
      });
    }
  },
};
</script>

<style lang="scss" src="./publish.scss" scoped>
</style>
