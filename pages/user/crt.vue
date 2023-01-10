<template>
  <view class="selectcommunitylist">
      for google map
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
