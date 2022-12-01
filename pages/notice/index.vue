<template>
  <view class="recordmain">
    <uni-search-bar
      :radius="100"
      v-model="keyword"
      placeholder="搜索"
      @confirm="confirm"
    ></uni-search-bar> 
    <view class="list-scroll-content">
      <view
        v-for="(item, index) in noticesList"
        :key="index"
        class="rf-order-item"
      >
        <view
          class="i-top-title"
          @tap="navTo(`/pages/notice/detail?uuid=` + item.uuid + `&communityuuid=` + communityuuid)"
        >
          <image
            class="exceltop"
            :src="
              item.product_type == 1
                ? baseAppUrl + `home/tongzhi.png`
                : baseAppUrl + `home/gonggao.png`
            "
          ></image>
          <text  class="title">{{ item.title }}</text>
          <text class="producttype"><text  v-if="item.ontop == '1'" class="ontop"  >【置顶】</text>{{
            item.product_type == 1 ? "通知" : "公告"
          }}</text>
        </view>
        <view
          class="userinfo"
          @tap="navTo(`/pages/notice/detail?uuid=` + item.uuid + `&communityuuid=` + communityuuid)"
        >
          <text class="time">{{ item.date | time(item.date) }} </text>
        </view>

        <view
          class="record-content"
          @tap="navTo(`/pages/notice/detail?uuid=` + item.uuid+ `&communityuuid=` + communityuuid)"
        >
          <text class="context-text">{{ item.content }}</text>
        </view>
        <view class="goview">
          <text class="context-communityname">{{ item.communityname }}</text>
        </view>
        <view class="action-box b-t"></view>
      </view>
    </view>
    <view class="emptycontainer" v-if="noticesList.length == 0">
      <image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
      <view class="empty-text">本小区没有任何通知公告信息</view>
    </view>
    <view v-if="more" class="getmore" @tap="getMore">点击加载更多...</view>
    <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>

    <rf-loading v-if="loading"></rf-loading>
  </view>
</template>

<script> 
import { getNoticesApi } from "@/api/product";
import tuiNomore from "@/components/gift/nomore";
import selectSwitch from "@/components/xuan-switch/xuan-switch.vue";
export default {
  components: {
    selectSwitch,
    tuiNomore,
  },
  data() {
    return {
      recordList: [],
      communityuuid: "", 
      more: false,
      nomore: false,
      navList: this.$mConstDataConfig.noticeNavList, // 导航
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      horizontal: "left",
      vertical: "bottom",
      direction: "horizontal",
      pattern: {
        color: "#7A7E83",
        backgroundColor: "#fff",
        iconColor: "#fff",
        selectedColor: "#FF8000",
      },
      is_color_type: false,
      content: [],
      code: "",
      loadingType: "more",
      orderList: [],
      page: 1,
      loading: false,
      keyword: "",
      status: 1, //默认获取published记录
      pagenum: 10,
      hasLogin: false,
      noticesList: [],
    };
  },
  computed: {
    UserInfo() {
      return this.$mStore.state.userInfo;
    },

    randomNumber() {
      return Math.floor(Math.random() * (10000 - 10 + 1) + 10);
    },
  },
  onHide() {
    //
  },
  onShow() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    this.status = 1;
    
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
    if (options.communityuuid) {
      this.communityuuid = options.communityuuid;
      uni.setStorageSync("communityuuid");
    } else {
      this.communityuuid = uni.getStorageSync("communityuuid");
    }
	 
	this.search();
    
  },
  //下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.orderList.length = 0;
  },
  //加载更多
  onReachBottom() { 
    this.page++;
  },
  methods: {
    getMore() {
      this.page = this.page + 1;
      this.search();
    }, 
    getMoreList() { 
    },
    changeTab() {},
    confirm(e) {
      this.keyword = e.value;
      this.search();
    },
    search() {
      this.nomore = false;
      this.more = false;
      let params = {
        title: this.keyword,
        communityuuid: this.communityuuid,
        product_types: "2,1", //通知、公告
        page: this.page,
        pagenum: this.pagenum,
      };
      this.loading = true;
      getNoticesApi(params).then(({ status, msg }) => {
        if (status == 0) {
          if (msg.list.length < this.pagenum) {
            this.nomore = true;
          } else {
            this.more = true;
          }
          if (this.page == 1) {
            this.noticesList = [...msg.list];
          } else {
            this.noticesList = this.noticesList.concat([...msg.list]);
          }
        } else {
          uni.showToast({
            title: msg,
            icon: "error",
            duration: 3000,
          });
        }
        this.loading = false;
      });
    },
    trigger(e) {
      console.log(e);
      for (var i = 0; i < this.content.length; i++) {
        this.content[i].active = false;
      }
      this.content[e.index].active = !e.item.active;
      if (e.index == 0) {
        this.navTo("/pages/record/publish");
      }
    },
    // 跳转页面
    navTo(route) {
      // #ifdef MP-WEIXIN
    //订阅微信物业通知
    wx.requestSubscribeMessage({
      tmplIds:['u01rJ4c5zbGZCwQOrNWJmWaVkn27nZiwv-zB-atEmX0']
    }) 
    // #endif
      this.$mRouter.push({ route });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.record-content {
  display: flex;
  flex-direction: row;
}
.context-text {
  height: 120rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: normal !important;
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
  border-bottom: 1px solid $base-color;
  .ontop{
    color: $uni-color-error;
  }
}
.title {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  margin-left: 80rpx;
  color:$base-color;
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
.emptycontainer {
  padding: 20rpx;
  text-align: center;
  .empty-img {
    width: 300rpx;
    height: 300rpx;
    position: relative;
  }

  .empty-text {
    color: $font-color-light;
    text-align: center;
  }
}
</style>
