<template>
  <view class="selectcommunitylist">
    <view
      v-for="(item, index) in communityList"
      :key="index"
      class="selectitem"
    >
      <view class="title">{{ item[1] }}</view>
      <view class="right">
        <text class="righttxt">我是{{ item[2] }}</text>
      </view>
    </view>
    <view class="reload" @tap="getCrts(true)">获取最新认证</view>
    <view class="emptycontainer" v-if="communityList.length == 0">
      <image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
      <view class="empty-text">无任何认证信息</view>
    </view>
    <view class="tips">
      <view class="title">
        <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
        <text>温馨提示:</text>
      </view>
      <view class="appraisetxt">身份认证的两个方式:</view>
      <view class="appraisetxt">1、身份认证由小区物业认证</view>
      <view class="appraisetxt">2、由已认证为业主的业主协助认证</view>
    </view>
  </view>
</template>

<script>
import { getCrtApi } from "@/api/crt";
export default {
  data() {
    return {
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      communityList: [],
      hasLogin: false,
      communityuuid:""
    };
  },
  onShow() {
    this.communityuuid = uni.getStorageSync("communityuuid")
    this.hasLogin = this.$mStore.getters.hasLogin;
    if (!this.hasLogin) {
      this.$mRouter.push({
        route: "/pages/public/logintype",
      });
    } else {
      this.getCrts();
    }
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
  },
  methods: {
    getCrts(click = false) {
      let params = {};
      uni.showLoading({
        title: "请稍后",
      });
      getCrtApi(params)
        .then(({ status, msg }) => {
          if (status == 0) {
            this.communityList = msg; 
            uni.setStorageSync("crt", msg) // 存储用户认证信息 
            let rolename = ""
            let cuuid = ""
            let communityname = ""
            console.log(this.communityList)
            for(let i = 0; i < this.communityList.length; i++){
              if(this.communityuuid == this.communityList[i][0]){
                 rolename = this.communityList[i][2]
                 cuuid = this.communityList[i][0] 
                 communityname = this.communityList[i][1] 
                 break
              }
            } 
             uni.setStorageSync("curent-crt", {
                uuid : cuuid,
                communityname: communityname,
                role:rolename
              }) // 存储用户认证信息 
            console.log(communityname)
            if (click) { 
              uni.showToast({
                title: "已更新",
                icon: "success",
                duration: 3000,
              });
            }
          } else {
            uni.showToast({
              title: msg,
              icon: "error",
              duration: 3000,
            });
          }
        })
        .finally((res) => {
          uni.hideLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped>

.selectcommunitylist {
  min-height: 1000rpx;
  padding-left: 25rpx;
  padding-right: 25rpx;
  background-color: white;
  
  .reload:after {
    font-family: uniicons;
    font-size: 40upx;
    content: "\e462";
    color: $base-color;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .reload {
    text-align: center;
    width: 700rpx;
    color: $base-color;
  }
  .selectitem {
    border-bottom: 1px solid $border-color-base;
    display: flex;

    .title {
      line-height: 80rpx;
    }
    .right {
      display: flex;
      position: absolute;
      margin-top: 20rpx;
      right: 25rpx;
      color: $uni-color-error;
      .image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
</style>
