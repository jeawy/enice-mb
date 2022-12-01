<template>
  <view class="v-main">
    <scroll-view
      class="ranktype"
      :scroll="false"
      :scroll-x="true"
      :show-scrollbar="false"
    >
    </scroll-view>
    <view class="category">
      <view
        v-for="(item, index) of categories"
        :key="index"
        class="common-function__item"
        @tap="changeCategory(item.id)"
      >
        <view class="item">
          <image
            class="common-function__img"
            :src="baseAppUrl + `${item.icon}`"
          />
          <view
            v-if="currentCategory == item.id"
            class="fct-content fct-content-active"
            >{{ item.txt }}</view
          >
          <view v-else class="fct-content">{{ item.txt }}</view>
        </view>
      </view>
    </view>
    <view class="rankcontainer" @change="swiperChange" :current="swipercurrent">
      <view class="">
        <view
          class="feedback-box"
          v-for="(item, index) in allList"
          :key="index"
        >
          <view>
            <view @tap="detail(item.uuid)">
              <view class="title" ><text class="exchangetype">{{
                  item.exchangetype | exchangeFilter
                }}</text>:{{ item.title }}</view>
            </view>
             <image
                v-if="item.reason == 1 && item.status == 2"
                :src="baseAppUrl + '/exchanges/'+ $options.filters.exchangeImgFilter(item.exchangetype ) +'.png'"
                class="picture_saled"
                mode="aspectFill" 
              />
          </view>
          
          <view class="second-title" @tap="detail(item.uuid)">
            <view class="time">
              <view class="left">  {{ item.user.username? item.user.username:item.user.phone}} | {{ item.date | time }}</view  >
              <view class="right" v-if="item.money">￥{{ item.money }}</view>
            </view>
          </view>
          <view class="content" @tap="detail(item.uuid)">
            {{ item.content }}
          </view>
          <view class="picturebox" @tap="detail(item.uuid)">
            <view
              v-if="item.images.length !== 0"
              v-for="(it, ind) in item.images"
              :key="ind"
            >
              <image
                :src="imgurl + it.filepath"
                class="picture"
                mode="aspectFill"
                @tap="previewImage(index, ind)"
              />
            </view>
          </view>
        </view>
        <view v-if="allList.length == 0" class="emptycontainer">
          <image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
          <view class="empty-text">暂无相关数据</view>
        </view>
        <view v-if="more" class="getmore" @tap="getmoreAids"
          >点击加载更多...</view
        >
        <!--加载loadding-->
        <tui-loadmore :visible="loadding" :index="2"></tui-loadmore>
        <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
        <view class="tips">
          <view class="title">
            <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
            <text>温馨提示:</text>
          </view>
          <view class="appraisetxt"
            >1、不得发布黄赌毒信息,一经发现将永久禁用该功能，情节严重报警处理。</view
          >
          <view class="appraisetxt"
            >2、平台只提供信息发布,无法确保信息的真实性，请用户自行判断。</view
          >
          <view class="appraisetxt"
            >3、为了保证用户的最大利益，对于明显的失实信息，平台有权删除。</view
          >
          <view class="appraisetxt">4、请珍惜和睦的互联网环境。</view>
        </view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <uni-fab
      :pattern="pattern"
      :content="content"
      :horizontal="horizontal"
      :vertical="vertical"
      @trigger="trigger"
    ></uni-fab>
    <view class="tools">
      <!-- #ifdef MP-WEIXIN -->
      <view class="tools__item">
        <view class="item"> 
          <button open-type="contact" class="contact-btn">
            <view class="img">
              <image class="tool__img" :src="baseAppUrl + `customer-service.png`" />
            </view> 
             <view class="txt">联系客服</view>
          </button>
        </view>
      </view>
      <!-- #endif -->
      <view
        v-for="(item, index) of tools"
        :key="index"
        class="tools__item"
        @tap="toolAct(item.id)"
      >
        <view class="item">
          <image class="tool__img" :src="baseAppUrl + `${item.icon}`" />
          <view
            v-if="currentCategory == item.id"
            class="fct-content fct-content-active"
            >{{ item.txt }}</view
          >
          <view v-else class="fct-content">{{ item.txt }}</view>
        </view>
      </view>
    </view>
    <s-popup
      custom-class="popupNewCommunity"
      ref="popupNewCommunity"
      type="top"
    >
      <view class="popupholder">
        <view>
          <view class="title">联系客服帮助开通新小区的闲置租售市场</view>
        </view>

        <view class="bottom-msg">
          <image :src="baseAppUrl + `dianji.png`" class="image" />
          <button open-type="contact">点击联系客服开通</button>
        </view>
      </view>
    </s-popup>
    <uni-popup ref="popupshare" class="popupshare" type="top">
      <view class="popupshare-holder">
        <view class="fillmsg">
          <image :src="baseAppUrl + `fxjt.png`" class="fxjt"></image>
          <view class="txt">点击这里进行分享</view>
        </view>

        <image :src="baseAppUrl + `wzdl.png`" @tap="closeshare" class="wzdl" />
      </view>
    </uni-popup>
  </view>
</template>

<script>
import tuiLoadmore from "@/components/gift/loadmore";
import tuiNomore from "@/components/gift/nomore";
import { getAnonymousExchanges } from "@/api/exchanges.js";
// #ifdef  APP-PLUS
import UniShare from "uni_modules/uni-share/js_sdk/uni-share.js";
const uniShare = new UniShare();
//#endif
import sPopup from "@/components/s-popup/index.vue";
export default {
  components: {
    tuiLoadmore,
    tuiNomore,
    sPopup,
  },
  data() {
    return {
      currentCategory: 0,
      exchangetype: 1, //求助(需要别人帮忙)
      horizontal: "left",
      vertical: "bottom",
      direction: "horizontal",
      tabIndex: 0,
      screenHeight: 0,
      swipercurrent: 0,
      empty: false,
      more: false,
      nomore: false,
      loadding: false,
      newfeedback: false,
      noagreefeedback: false,
      agreefeedback: false,
      status: "",
      page: 1,
      pagenum: 5,
      allList: [],
      oldList: [],
      imgurl: "",
      Image: [],
      sorttype: "date",
      baseurl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      imageUrl: "",
      tools: [
        {
          id: 1,
          icon: "share1.png",
          txt: "分享",
        },
        {
          id: 2,
          icon: "xianzhi.png",
          txt: "申请开通",
        },
      ],
      categories: [
        {
          id: 0,
          icon: "all.png",
          txt: "全部",
        },
        {
          id: 1,
          icon: "xianzhi.png",
          txt: "闲置",
        },
        {
          id: 2,
          icon: "chushou.png",
          txt: "求租",
        },
        {
          id: 3,
          icon: "chuzu.png",
          txt: "出租",
        },
        {
          id: 4,
          icon: "qiugou.png",
          txt: "求购",
        },
        {
          id: 5,
          icon: "chushou.png",
          txt: "出售",
        },
      ],
      communityname: "",
      pattern: {
        color: "#7A7E83",
        backgroundColor: "#fff",
        iconColor: "#fff",
        selectedColor: "#FF8000",
      },
      content: [
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl + "exchanges.png",
          selectedIconPath:
            this.$mStore.state.BaseAppStaticUrl + "exchanges.png",
          text: "我要发布",
          active: true,
        },

        {
          iconPath: this.$mStore.state.BaseAppStaticUrl + "uncollect.png",
          selectedIconPath:
            this.$mStore.state.BaseAppStaticUrl + "collected.png",
          text: "我的收藏",
          active: true,
        },
        {
          iconPath: "/static/aid/wode.png",
          selectedIconPath: "/static/aid/wode.png",
          text: "我的闲置",
          active: true,
        },
      ],
    };
  },
  onLoad() {
    this.imgurl = this.$mStore.state.BaseImagesUrl;
    this.imageUrl = this.baseAppUrl + "xianzhi.png";
    this.communityname = uni.getStorageSync("communityname");
    this.page = 1;
    this.getList();
    let that = this;
    uni.getSystemInfo({
      success: function (res) {
        that.screenHeight = res.screenHeight + 450;
      },
    });
  },
  filters: {
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
    },
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
  },
  onShareAppMessage() {
    return {
      title: this.communityname + "的闲置、租售市场,有图有真相,明码标价更容易出,您想要的应有尽有.",
      desc: "小区闲置物品出售、房屋租赁、出售等信息发布,让小区的信息更好的流动起来",
      path: this.pagepath,
      imageUrl: this.imageUrl,
    };
  },
  onShareTimeline(res) {
    // 分享到朋友圈
    return {
      title: this.communityname + "的闲置、租售市场,有图有真相,明码标价更容易出,您想要的应有尽有.",
      desc: "小区闲置物品出售、房屋租赁、出售等信息发布,让小区的信息更好的流动起来",
      path: this.pagepath,
      imageUrl: this.imageUrl,
    };
  },
  onBackPress({ from }) {
    console.log(2222)
    if (from == "backbutton") {
      this.$nextTick(function () {
        if (uniShare){ 
          uniShare.hide(); 
        } 
      });
      return uniShare.isShow;
    }
    uni.switchTab({
      url: "/pages/index/index",
    });
    return true;
  },
  methods: {
    closeshare() {
      this.$refs.popupshare.close();
    },
    toolAct(actid) {
      if (actid == 0) {
        //联系客服
      } else if (actid == 1) {
        //分享
        this.uniShare();
      } else if (actid == 2) {
        //申请开通
        this.$refs.popupNewCommunity.show("top");
      }
    },
    uniShare() {
      let title =
        "来自【" + this.communityname + "】的闲置、租售市场,有图有真相,明码标价更容易出,您想要的应有尽有.";
      // #ifdef  MP-WEIXIN
      // 微信小程序分享提示，微信小程序无法直接调用api
      this.$refs.popupshare.open("top");
      // #endif
      // #ifdef  APP-PLUS

      let href = this.$mStore.state.BaseShareUrl;
      uniShare.show(
        {
          content: {
            //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
            type: 0,
            href: href,
            title: title,
            summary: title,
            imageUrl: this.baseAppUrl + "xianzhi.png", //  logo大小不能超过32kb，否则不会显示
          },
          menus: [
            {
              img: this.baseAppUrl + "app-plus/sharemenu/wechatfriend.png",
              text: "微信好友",
              share: {
                provider: "weixin",
                scene: "WXSceneSession",
                type: 5,
                title: title,
                summary: title,
                imageUrl: this.baseAppUrl + "xianzhi.png",
                miniProgram: {
                  id: this.$mStore.state.WX_XIAOCHENGXU_ID,
                  path: href,
                  type: 0,
                  webUrl: href,
                },
                success: (ret) => {
                  console.log(JSON.stringify(ret));
                },
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
    changeCategory(categoryid) {
      this.currentCategory = categoryid;
      this.getList();
    },
    trigger(e) {
      let route = "";
      if (e.index == 0) {
        // 发布
        route = "/pages/exchanges/publish";
      } else if (e.index == 1) {
        route = "/pages/collection/list";
      } else if (e.index == 2) {
        route = "/pages/exchanges/mylist";
      }
      this.$mRouter.push({ route });
    },
    swiperChange(e) {
      let index = e.detail.current || e.target.current;
      this.switchTab(index);
    },
    switchTab(current) {
      if (this.tabIndex == current) {
      } else {
        this.tabIndex = current;
      }
      this.page = 1;
      this.getList();
    },
    getList() {
      if (this.currentCategory != 0) {
        this.exchangetype = this.currentCategory;
      }
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      this.nomore = false;
      this.more = false;
      let param = {
        page: this.page,
        pagenum: this.pagenum,
      };
      if (this.currentCategory != 0) {
        param.exchangetype = this.currentCategory;
      }
      getAnonymousExchanges(param)
        .then((data) => {
          if (data.status == 0) {
            if (data.msg.total == 0) {
              this.empty = true;
            } else {
              this.empty = false;
              if (data.msg.list.length < this.pagenum) {
                this.nomore = true;
              } else {
                this.more = true;
              }
            }
            if (this.page == 1) {
              this.allList = [...data.msg.list];
            } else {
              this.allList = this.allList.concat([...data.msg.list]);
            }
          }
        })
        .finally((res) => {
          this.loadding = false;
          uni.hideLoading();
        });
      this.empty = false;
    },
    getmoreAids() {
      this.loadding = true;
      this.page = this.page + 1;
      this.getList();
    },
    deletefeedback(index, id) {
      var that = this;
      uni.showModal({
        title: "",
        content: "您好，确定要删除该意见吗？",
        confirmText: "删除",
        confirmColor: "#FD5000",
        success: function (res) {
          if (res.confirm) {
            const data = {
              method: "delete",
              ids: id,
            };
            ApiDeleteFeedback(data).then((res) => {
              if (res.status == 0) {
                uni.showToast({
                  icon: "success",
                  title: "删除成功!",
                  duration: 3000,
                });
                that.allList.splice(index, 1);
              } else {
                console.log(res);
              }
            });
          } else if (res.cancel) {
          }
        },
      });
    },
    detail(uuid) {
      uni.navigateTo({
        url: "../exchanges/detail?uuid=" + uuid,
      });
    },
    //点击查看图片大图
    previewImage: function (index, e) {
      this.Image = [];
      let image = this.imgurl + this.allList[index].images[e].filepath;
      this.Image.push(image);
      uni.previewImage({
        current: this.Image[0],
        urls: this.Image,
      });
    },
  },
};
</script>

<style lang="scss" src="./list.scss" scoped>
</style>
