<template>
  <view class="noticemain">
    <view class="v-title">
      <image
        class="exceltop"
        :src="
          product_type == 1
            ? baseAppUrl + `home/tongzhi.png`
            : baseAppUrl + `home/gonggao.png`
        "
      ></image>
      <text class="title">{{ title }}</text>
      <text class="producttype">{{ product_type == 1 ? "通知" : "公告" }}</text>
    </view>
    <view>
      <text class="date">{{org.name}} {{ username }} {{ date | time }} </text>
      <!-- #ifdef  APP-PLUS -->
      <image
        class="shareimg shareimg-top"
        @click="uniShare"
        :src="baseAppUrl + `share1.png`"
      ></image>
      <!-- #endif    -->
    </view>
    <view class="content" v-if="content">{{ content }}</view>
     <view class="detail" > 
    <rich-text :nodes="detail" ></rich-text></view>
    <view class="label">
     
      <!-- #ifdef  APP-PLUS -->
      <image
        class="shareimg"
        @click="uniShare"
        :src="baseAppUrl + `share1.png`"
      ></image>
      <!-- #endif    -->
      <text class="communityname">{{ communityname }}</text>
    </view>
    <likeCountCommentComm 
    :entityuuid="uuid"
    :entitytype="entitytype"
    :baseUrl="baseImageUrl"
    :baseAppUrl="baseAppUrl"
    :owneruuid="owneruuid"
    :orguuid="orguuid"
    :allowcomment="allow_comment"
    />
    <rf-loading v-if="loading"></rf-loading>
  </view>
</template>

<script>
import { getNoticesApi } from "@/api/product";
import likeCountCommentComm from "@/components/likesreadcomment"
// #ifdef  APP-PLUS
import UniShare from "uni_modules/uni-share/js_sdk/uni-share.js";
const uniShare = new UniShare();
//#endif
export default {
  components:{
    likeCountCommentComm,
  },
  data() {
    return {
      entitytype:9,
      orguuid:"",
      baseurl: this.$mStore.state.BaseUrl,
      baseImageUrl: this.$mStore.state.BaseImagesUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      content: "",
      title: "",
      username: "",
      communityname: "",
      loading: false,
      uuid: "",
      date: null,
      product_type: 1, 
      orgname:"",
      picture:"",
      detail:"",
      allow_comment:false,
      org: {
        logo: "",
        name: "",
      },
      owneruuid:'',
      pagepath:""
    };
  },
  onLoad(options) {
    this.uuid = options.uuid;
    this.getDetail(this.uuid);
    this.pagepath = `/pages/notice/detail?uuid=${this.uuid}`
  },
  onBackPress({ from }) {
    if (from == "backbutton") {
      this.$nextTick(function () {
        if (uniShare){ 
          uniShare.hide(); 
        } 
      });
      return uniShare.isShow;
    }
    uni.redirectTo({
      url: "/pages/notice/index",
    });
    return true;
  },
  onShareAppMessage() {
    return {
      title: "【" + this.communityname + "】" + this.title,
      desc: this.content,
      path: this.pagepath,
    };
  },
  methods: {
    // #ifdef  APP-PLUS
    uniShare() {
      let href = this.$mStore.state.BaseShareUrl+"?entity_type=9&"+"entity_uuid="+this.uuid
      uniShare.show(
        {
          content: {
            //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
            type: 0,
            href: href,
            title: "【" + this.communityname + "】" + this.title,
            summary: this.content,
            imageUrl: this.baseurl + this.org.logo, //  logo大小不能超过32kb，否则不会显示
          },
          menus: [
            {
              img: this.baseAppUrl + "app-plus/sharemenu/wechatfriend.png",
              text: "微信好友",
              share: {
                provider: 'weixin',
                scene: "WXSceneSession",
                type: 5, 
                title: "【" + this.communityname + "】" + this.title,
                summary: this.content,
                imageUrl:  this.baseurl + this.org.logo, 
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
          console.log(e);
        }
      );
    }, 
    //#endif
    getContent(e, index) {
      this.values[index] = e.detail.value;
    },
    getDetail(noticeuuid) {
      this.loading = true;
      let that = this;
      let communityuuid = uni.getStorageSync("communityuuid");
      getNoticesApi({ uuid: noticeuuid, communityuuid: communityuuid }).then(
        ({ status, msg }) => {  
          if (status == 0) {
            that.title = msg.title;
            that.content = msg.content;
            that.detail = msg.detail;
            that.date = msg.date;
            that.product_type = msg.product_type; 
            that.communityname = msg.communityname;
            that.org = msg.org;
            that.orguuid = msg.org.uuid;
            that.owneruuid = msg.creator_info.uuid
            that.username = msg.creator_info.username
            that.allow_comment = msg.allow_comment;
            uni.setNavigationBarTitle({
              title: that.title,
            });
            if (that.detail == null){
              that.detail = ""
            } 
          } else {
            uni.showToast({
              title: msg,
              icon: "error",
              duration: 3000,
            });
          }

          that.loading = false;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.shareimg-top {
  position: absolute;
  right: 25rpx;
  margin-top: 10rpx;
  text-align: right;
}
.date {
  line-height: 80rpx;
}
.noticemain {
  width: 750rpx;
  padding: 25rpx 25rpx;
  background-color: white;
}
.v-title {
  display: flex;
  line-height: 80rpx;
  border-bottom: 1px solid $background-color-gray;
}
.exceltop {
  position: absolute;
  margin-top: 5rpx;
  width: 70rpx;
  height: 70rpx;
}
.label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 80rpx;
}

.producttype {
  position: absolute;
  right: 30rpx;
  color: $font-color-light;
}
.promote-detail,
.date,
.communityname {
  color: $font-color-light;
}
.shareimg {
  width: 60rpx;
  height: 60rpx;
  border-radius: 10rpx;
  border: 1px solid $background-color-gray;
}
.content {
  margin-top: 15rpx; 
}
.detail{
    width: 700rpx;
    min-height: 700rpx;
	word-wrap:break-word;
	word-break:break-all; 
    .rdetail{
      width: 700rpx !important;
      overflow: hidden;
    }
  }
.title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  margin-left: 80rpx;
} 
</style>
