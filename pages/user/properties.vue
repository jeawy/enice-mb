<template>
  <view class="recordmain">
    <view class="list-scroll-content">
      <view v-for="(item, index) in myrooms" :key="index" class="rf-order-item">
        <view
          class="i-top-title"
          @tap="navTo(`/pages/notice/detail?uuid=` + item.uuid)"
        >
          <image
            class="exceltop"
            :src="baseAppUrl + `icons/fangwu1.png`"
          ></image>
          <text class="communitytitle">{{ item.community__name }}</text>
          <text class="producttype"
            >{{ item.unit__building__name }}{{ item.unit__name }}{{ item.name }}
          </text>
        </view>

        <view class="v-logo">
          <image
            class="logo"
            :src="baseUrl + item.community__organize__logo"
          ></image>

          <view class="orgname">
            <view>房屋面积：{{ item.area }}平米</view>
            <view>小区物业：{{ item.community__organize__alias }}</view>
            <view>物业电话：{{ item.community__tel }}</view>
          </view>
        </view>

        <view v-if="item.community__shequ" class="shequ">
          <text>社区:{{ item.community__shequ }}</text>
        </view>
        <view v-if="item.community__jiedaoban" class="jiedaoban">
          <text>街道办:{{ item.community__jiedaoban }}</text>
        </view>
        <view class="record-content">
          <view
            class="v-notice"
            @tap="navTo(`/pages/notice/index?uuid=` + item.community__uuid)"
          >
            <image class="noticeicon" src="/static/tabbar/xiaoxia.png"></image>
            <view class="niticetxt">小区通知公告</view>
            <uni-badge
              size="small"
              :text="100"
              offset="[10,10]"
              absolute="rightTop"
              type="error"
            >
            </uni-badge>
          </view>
          <view
            class="v-fee"
            @tap="navTo(`/pages/cart/cart?uuid=` + item.community__uuid)"
          >
            <image class="noticeicon" :src="baseAppUrl + `jiaofei.png`"></image>
            <view class="feetxt">物业费交纳</view>
          </view>
        </view>

        <view class="action-box b-t"></view>
      </view>
      <view class="emptycontainer" v-if="myrooms.length == 0">
        <image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
        <view class="empty-text">无任何房产信息</view>
      </view>
      
    </view>
    <view class="tips">
        <view class="title">
          <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
          <text>温馨提示:</text>
        </view>
        <view class="appraisetxt">房产信息获取的条件:</view>
        <view class="appraisetxt">1、物业处留存的业主手机号码与本人手机号码相匹配</view> 
      </view> 
  </view>
</template>

<script>
import { getMyRooms } from "@/api/buildings";
export default {
  data() {
    return {
      myrooms: [],
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      loading: false,
      hasLogin: false,
    };
  },

  onShow() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    if (!this.hasLogin) {
      this.$mRouter.push({
        route: "/pages/public/logintype",
      });
    } else {
      this.getRooms();
    }
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
  },
  methods: {
    navTo(route) {
      if (!route) {
        return;
      }
      this.$mRouter.push({
        route: route,
      });
    },
    getRooms() {
      let params = {};
      this.loading = true;
      getMyRooms(params)
        .then(({ status, msg }) => {
          if (status == 0) {
            this.myrooms = msg;
            let rooms = [] //缓存房号
            this.myrooms.forEach(item =>{
              rooms.push( item.unit__building__name +  item.unit__name + item.name )
            })
            uni.setStorageSync("rooms", rooms)
          } else {
            uni.showToast({
              title: msg,
              icon: "error",
              duration: 3000,
            });
          }
        })
        .finally((res) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips{
  margin: 25rpx;
}
.orgname {
  margin-top: 60rpx;
  color: $font-color-base;
}
.shequ,
.jiedaoban {
  color: $font-color-base;
  margin: 15rpx 0;
}
.niticetxt,
.feetxt {
  color: $font-color-base;
}
.noticeicon {
  width: 40rpx;
  height: 40rpx;
}
.logo {
  width: 200rpx;
  height: 200rpx;
  margin-right: 15rpx;
  border-radius: 15rpx;
}
.v-logo,
.v-fee {
  display: flex;
}
.v-fee {
  margin-left: 200rpx;
}
.goview {
  text-align: right;
  color: $font-color-light;
}
.producttype {
  position: absolute;
  right: 30rpx;
  color: $font-color-light;
}
.recordmain {
  flex: 1;
}
.exceltop {
  position: absolute;
  margin-top: 15rpx;
  width: 60rpx;
  height: 60rpx;
}

.gorecord {
  color: $font-color-light;
  font-size: $font-sm;
  text-align: center;
}
.record-content,
.v-notice {
  display: flex;
}
.record-content {
  margin: 25rpx 0;
}

.context-text {
  height: 120rpx;
}
.action-btn {
  margin-top: 10rpx;
  margin-bottom: 10rpx;
}
.action-box {
  height: 50rpx !important;
}
.userinfo .time,
.userinfo .username {
  font-size: 12px;
  color: $font-color-light;
}
.i-top-title {
  text-align: left;
  line-height: 80rpx;
  border-bottom: 1px solid $background-color-gray;
}
.communitytitle {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  margin-left: 80rpx;
}

.list-scroll-content {
  flex: 1;
}
.navbar {
  flex-direction: row;
}
.bottom-btn-view {
  position: fixed;
  bottom: 0rpx;
  width: 750rpx;
  height: 120rpx;
  background-color: $color-white;
  border-top-left-radius: 75rpx;
  border-top-right-radius: 75rpx;
  text-align: center;
}
.bottom-btn-view-text {
  color: $base-color;
  font-size: $font-lg;
  line-height: 150rpx;
}
.publish-img {
  height: 150rpx;
  width: 150rpx;
  position: fixed;
  bottom: 0rpx;
  left: 300rpx;
}
.list-scroll-content {
  height: 100%;
}
.uni-swiper-item {
  height: auto;
}
</style>
