<template>
  <view class="recordmain">
    <uni-search-bar
      :radius="100"
      v-model="keyword"
      placeholder="搜索"
      @clear="clearKeyword"
      @confirm="confirm"
    ></uni-search-bar>
    <view class="navbar">
      <view
        v-for="(item, index) in navList"
        :key="index"
        class="nav-item"
        :class="{ current: tabCurrentIndex === item.state }"
        @tap="tabClick(item.state)"
      >
        {{ item.text }}
      </view> 
    </view>

    <scroll-view
      class="list-scroll-content"
      scroll-y
      @scrolltolower="getMoreList"
    >
      <view
        v-for="(item, index) in recordList"
        :key="index"
        class="rf-order-item"
      >
        <view
          class="i-top-title"
          @tap="navTo(`/pages/record/detail?uuid=` + item.uuid)"
        >
          <text class="title">{{ item.title }}</text>
        </view>
         
        <view
          class="userinfo"
          @tap="navTo(`/pages/record/detail?uuid=` + item.uuid)"
        >
          <text class="time"
            >{{ item.username ? item.username : "" }} {{ item.date | time(item.date) }} </text
          >
        </view>

        <view
          class="record-content"
          @tap="navTo(`/pages/record/detail?uuid=` + item.uuid)"
        >
          <text class="context-text">{{ item.content }}</text>
          <view class="goview">
            <view>
              <image class="excel" :src="baseAppUrl + `excel1.png`"></image>
            </view>
            <view> <text class="gorecord">去登记</text></view>
          </view>
        </view>
        <view class="action-box b-t">
           <view class="tag show_userinfo" v-if="item.show_userinfo == 0">隐藏登记人信息</view>
           <view class="tag limits" v-if="item.limits > 0">限制登记人数{{item.limits}}</view>
           <view class="tag needLogin" v-if="item.need_login ">登记需要先登录</view>

        </view>
      </view>
    </scroll-view>
    <view v-if="more" class="getmore" @tap="getMore">点击加载更多...</view>
    <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>

    <!-- 底部按钮 -->
    <uni-fab
      :pattern="pattern"
      :content="content"
      :horizontal="horizontal"
      :vertical="vertical"
      @trigger="trigger"
    ></uni-fab>
  </view>
</template>

<script>
import mConstData from "@/config/constData.config";
import { getAnonymousRecord, getRecord } from "@/api/record";
import { getWeixinPhoneNumber } from "@/api/basic";
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
      tabCurrentIndex: 1,
      navList: this.$mConstDataConfig.recordNavList, // 导航
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
      content: [
        {
          iconPath: "/static/record/publish-grey.png",
          selectedIconPath: "/static/record/publish.png",
          text: "发起登记",
          active: false,
        },
        {
          iconPath: "/static/record/join-gray.png",
          selectedIconPath: "/static/record/join.png",
          text: "我发起的",
          active: false,
        },
        {
          iconPath: "/static/record/my-gray.png",
          selectedIconPath: "/static/record/mine.png",
          text: "我参与的",
          active: false,
        },
      ],
      code: "",
      loadingType: "more",
      orderList: [],
      page: 1,
      loading: false,
      keyword: "",
      more: false,
      nomore: false,
      status: 1, //默认获取published记录
      pagenum: 5, 
      hasLogin: false,
      communityuuid:""
    };
  },  
  onShow() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    this.communityuuid = uni.getStorageSync("communityuuid")
    this.status = this.tabCurrentIndex;
    this.search();
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
    
  },
  //下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.orderList.length = 0;
  },
  //加载更多
  onReachBottom() {
    console.log(this.page);
    //this.page ++;
  },
  methods: {
    clearKeyword(e){ 
      this.keyword = ""
      this.search()
    },
    getMore() {
      this.page = this.page + 1;
      this.search();
    },
    //顶部tab点击
    tabClick(index) {
      this.page = 1;
      this.recordList.length = 0;
      this.tabCurrentIndex = index;
      if(this.keyword.value != undefined){
        this.keyword = this.keyword.value 
      }
      this.status = index;
      console.log(this.keyword)
      this.search();
    },
    getMoreList() {},
    changeTab() {},
    confirm(e) {
      this.keyword = e.value;
      this.search();
    },
    search() {
      this.nomore = false;
      this.more = false;
      let params = {
        keyword: this.keyword,
        status: this.status,
        page: this.page,
        pagenum: this.pagenum, 
        communityuuid:this.communityuuid
      };
      this.loading = true;
       
        getAnonymousRecord(params).then(({ status, msg }) => {
          if (status == 0) {
            
            if (msg.length < this.pagenum) {
              this.nomore = true;
            } else {
              this.more = true;
            }
            if (this.page == 1) {
              this.recordList = [...msg];
            } else {
              this.recordList = this.recordList.concat([...msg]);
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
      for (var i = 0; i < this.content.length; i++) {
        this.content[i].active = false;
      }
      this.content[e.index].active = !e.item.active;
      if (e.index == 0) {
        this.navTo("/pages/record/publish");
      }
      else{
        this.navTo("/pages/record/myrecord?index="+(e.index-1));
      }
    },
    // 跳转页面
    navTo(route) {
      this.$mRouter.push({ route });
    },
  },
};
</script>

<style lang="scss">
.v-edit {
  position: absolute;
  right: 35rpx;
  top: 35rpx;
  color: $base-color;
}
.recordmain {
  flex: 1;
}
.goview {
}
.excel {
  width: 70rpx;
  height: 70rpx;
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
  width: 600rpx;
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
      justify-content: flex-start !important;
			margin-top:15rpx;
			.tag{
				padding-left:10rpx;
				padding-right:10rpx;
				border-radius: 40rpx;
				color:white;
			}
			.needLogin{
				background-color:$base-color ;
			}
			.show_userinfo{
				background-color:#1296db ;
				margin-right:10rpx;
			}
			.limits{
				margin-right:10rpx;
				background-color:#d81e06 ;
			}
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
}
.title {
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  color:$base-color;
}
.swiper-box {
  flex: 1;
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
