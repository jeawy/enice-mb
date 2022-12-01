<template>
  <view class="recordmain">
    <view class="topsearch">
        <nx-search
          :selectList="selectStatusList" 
          class="sn-earch-input-box"
          button="inside"
          placeholder="搜索"
          @search="confirm"
          @select="selectStatus"
          v-model="keyword"
        />
      </view>
     
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
         <view class="status">{{item.status | statusFilter}}</view>
          <text class="title">{{ item.title }}</text>
         
        </view>
       
        <view
          class="userinfo"
          @tap="navTo(`/pages/record/detail?uuid=` + item.uuid)"
        >
          <text class="time"
            >{{ item.username ? item.username : "" }}{{ item.date | time(item.date) }}
            </text
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
           <view
            class="v-edit" 
            v-if="tabCurrentIndex==0"
            @tap="navTo(`/pages/record/publish?uuid=` + item.uuid)"
          >
            <text class="edit">编辑</text>
          </view>
           <view
            class="v-edit" 
            v-if="tabCurrentIndex==0 && item.status == 1"
            @tap="updateRecord(item.uuid, item.title, index, 2)"
          >
            <text class="stop">停止登记</text>
          </view>
           <view
            class="v-edit" 
            v-if="tabCurrentIndex==0 && item.status == 2"
            @tap="updateRecord(item.uuid, item.title, index, 1)"
          >
            <text class="stop">重启登记</text>
          </view>
           <view
            class="v-edit" 
            v-if="tabCurrentIndex==0"
            @tap="removeRecord(item.uuid, item.title, index)"
          >
            <text class="delete">删除</text>
          </view>
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
import { postRecord, getRecord } from "@/api/record";
import tuiNomore from "@/components/gift/nomore";
import selectSwitch from "@/components/xuan-switch/xuan-switch.vue";
import Vue from 'vue'
export default {
  components: {
    selectSwitch,
    tuiNomore,
  },
  data() {
    return {
      recordList: [],
      selectStatusList: [
        {
          id: -1,
          name: "全部",
        },
        {
          id: 1,
          name: "正在进行",
        },
        {
          id: 2,
          name: "已结束",
        },
        {
          id: 0,
          name: "草稿",
        },
      ],
      tabCurrentIndex: 0,
      navList:   [  
        {state: 0, text: '我发起'}, 
        {state: 1, text: '我参与'} 
	    ], // 导航
      selectedStatus: {
        id: -1,
        currentcategoryname: "全部",
      },
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
          text: "登记广场",
          active: false,
        } 
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
  onShow() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    if (this.hasLogin == false) {
      // 去登录
      this.$mHelper.backToLogin(true);
        
    } 
    else{
      this.search(); 
    } 
  },
  filters:{
    statusFilter(status){
      let statustxt = ""
      if (status == 0) {
        statustxt = "草稿";
      } else if (status == 1) {
        statustxt = "正在进行";
      } else if (status == 2) {
        statustxt = "已结束";
      } 
      return statustxt;
    }
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
    
    if (options.index != undefined) { 
      this.tabCurrentIndex = parseInt(options.index);
      this.search()
    }
    else{

    }
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
    updateRecord(uuid,title, index, recordstatus){
      let content = "结束【"+title+"】登记?"
      let prompt = "已停止登记"
      if (recordstatus == 1){
        content = "重启【"+title+"】登记?" 
        prompt = "已重启登记"
      }
      uni.showModal({
        content: content,
        success: (confirmRes) => {
          if (confirmRes.confirm) {
            //
            let data = {
              method: "put",
              uuid: uuid,
              status: recordstatus,
            };
            postRecord(data).then(({ status, msg }) => {
              //
              if (status == 0) {
                uni.showToast({
                  title:prompt ,
                  icon: "success",
                  duration: 3000,
                });
                let item = this.recordList[index] 
                item.status = recordstatus
                Vue.set(this.recordList, index, item)
              }
            });
          }
        },
      });
    },
    removeRecord(uuid, title, index){
      uni.showModal({
        content: "删除【"+title+"】?",
        success: (confirmRes) => {
          if (confirmRes.confirm) {
            //
            let data = {
              method: "delete",
              uuids: uuid,
            };
            postRecord(data).then(({ status, msg }) => {
              //
              if (status == 0) {
                uni.showToast({
                  title: "已删除",
                  icon: "success",
                  duration: 3000,
                });
                this.recordList.splice(index, 1)
              }
            });
          }
        },
      });
    },
    selectStatus(index){
      this.selectedStatus = this.selectStatusList[index];
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
      this.status = index;
      this.search();
    },
    getMoreList() {},
    changeTab() {},
    confirm(e) { 
      this.search();
      this.page = 1;
      this.recordList = []
    },
    search() {
      this.nomore = false;
      this.more = false;
      uni.showLoading({
        mark:true,
        title:"请稍后"
      })
      let params = {
        keyword: this.keyword,
        status: this.selectedStatus.id,
        mine: this.tabCurrentIndex,//我的登记薄：发起或者参与，0 发起， 1 参与
        page: this.page,
        pagenum: this.pagenum,
      };
      this.loading = true; 
      //登录用户调用授权接口
      getRecord(params).then(({ status, msg }) => {
        if (status == 0) {
          if (msg.length < this.pagenum) {
            this.nomore = true;
          } else {
            this.more = true;
          }
          if (this.page == 1) { 
            if (this.tabCurrentIndex == 1){
              //我参与的，要重新设置key值
               for(let i = 0; i < msg.length; i ++){
                 this.recordList.push({
                   username:msg[i]['record__owner__username'],
                   uuid:msg[i]['record__uuid'],
                   title:msg[i]['record__title'],
                   content:msg[i]['record__content'],
                   date:msg[i]['record__date'],
                   status:msg[i]['record__status']
                  }) 
                }  
            }
            else{
              this.recordList = [...msg]; 
            }
          } else {
            if (this.tabCurrentIndex == 1){ 
               for(let i = 0; i < msg.length; i ++){
                 this.recordList.push({
                   username:msg[i]['record__owner__username'],
                   uuid:msg[i]['record__uuid'],
                   title:msg[i]['record__title'],
                   content:msg[i]['record__content'],
                   date:msg[i]['record__date'],
                   status:msg[i]['record__status']
                  }) 
                }
            }
            else{
              this.recordList = this.recordList.concat([...msg]); 
            }
            
          }
        } else {
          uni.showToast({
            title: msg,
            icon: "error",
            duration: 3000,
          });
        } 
      }).finally(res=>{
        uni.hideLoading()
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
        this.navTo("/pages/record/record");
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
.topsearch{
  padding: 15rpx;
}
.nav-item{
  z-index:1;
}
.v-edit {  
  color: $base-color;
  font-weight: bold;
  .edit{
    color:$font-color-spec; 
    margin-right:25rpx;
  }
  .stop{ 
    margin-right:25rpx;
  }
  .delete{
    color:$uni-color-error;
  }
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
  .status{
      position: absolute;
      right: 25rpx;
      background-color: $base-color;
      color:white;
      border-radius:10rpx;
      width: 130rpx;
      text-align: center;
      margin-top:20rpx;
    }
    .title {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  color:$base-color;
}
}

.swiper-box {
  flex: 1;
}
.list-scroll-content {
  flex: 1;
}
.navbar {
  flex-direction: row;
  z-index: 0;
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
