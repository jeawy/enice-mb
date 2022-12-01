<template>
  <view class="v-main">
    <scroll-view
      class="ranktype"
      :scroll="false"
      :scroll-x="true"
      :show-scrollbar="false"
    >
      <view style="flex-direction: column">
        <view
          style="
            width: 700rpx;
            flex-direction: row;
            justify-content: space-between;
          "
          class="uni-tab"
        >
          <view
            class="uni-tab-item"
            v-for="(tab, index) in tabList"
            :key="index"
            :ref="'tabitem' + index"
            :data-id="index"
            :data-current="index"
            @click="switchTab(index)"
            :class="tabIndex == index ? 'uni-tab-item-active' : ''"
          >
            <text
              class="uni-tab-item-title"
              :class="tabIndex == index ? 'uni-tab-item-title-active' : ''"
              :id="'tab' + index"
              >{{ tab.name }}</text
            >
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="filter">
      <nx-search
        :selectList="selectCategoryList"
        class="sn-earch-input-box"
        button="inside"
        placeholder="搜索"
        @search="confirm()"
        @select="selectCategory"
        v-model="title"
      />
    </view>

    <view
      class="aid-box"
      v-for="(item, index) in allList"
      :key="index" 
    >
      <view>
        <view :class=" item.payed == 0 && item.status == 1 ?'status statusdisabled':'status'">{{ item.status | statusFilter }}</view>
        <view @tap="detail(item.uuid)">
          <view class="title">{{ item.title }}</view>
        </view>
      </view>
      <view class="second-title" @tap="detail(item.uuid)">
        <view class="time"
          >【{{ item.communityname }}】{{ item.user.username }} |
          {{ item.date | time }}</view
        >
      </view>
      <view class="content" @tap="detail(item.uuid)">
        {{ item.content }}
      </view>
      <view class="v-money moneytxt1" @tap="detail(item.uuid)">
        <view class="money-holder">
          <view class="moneytxt">佣金:</view>
          <view class="money">{{ item.money }}</view>
          <view class="moneytxt"><view v-if="item.payed == 0 && item.status == 1">元[未支付，请尽快支付.]</view> </view>
        </view>
      </view>
      <view class="tags" @tap="detail(item.uuid)">
        <view class="" v-if="item.end_date"
          >截止日期：{{ item.end_date | date }}</view
        >
        <view class="" v-if="item.need_propertior == 1"
          >限以下小区的认证业主：</view
        >
        <view class="tagitems-holders" v-if="item.need_propertior == 1">
          <view class="tagitems" v-for="(communitieyitem, communitieyindex) in item.communities" :key="communitieyindex">
            {{communitieyitem.community__name}}
          </view>
        </view>
      </view>
      <view class="picturebox">
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
      <view class="btns">
        <view class="btns-holder">
         <view class="enddate needpropertior needpropertiorbtn-edit" 
         v-if="item.status == 0 || item.status == 1"  @tap="modifyAid( item.uuid)"
          >  修改 </view >
           <!-- 暂存且未支付的可以删除 -->
          <view class="enddate needpropertior needpropertiorbtn btn-delete" 
         v-if="item.payed == 0  "  @tap="deleteAid(index, item.uuid)" 
          >  删除 </view >
          <!-- 已支付、且等待接单的可以申请退款，每月最多三次 -->
          <view class="enddate needpropertior needpropertiorbtn btn-refund" v-if="item.payed == 1 && item.status == 1"
          >  申请退款 </view >
          <view class="enddate needpropertior needpropertiorbtn btn-refund" v-if="item.payed == 0 && item.status == 1"
         @tap="pay(item.billno)"  >  支付佣金 </view >
        </view>
      </view>
    </view>
    <view v-if="empty" class="emptycontainer">
      <image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
      <view class="empty-text">暂无相关数据</view>
    </view>
    <view v-if="more" class="getmore" @tap="getmoreAids">点击加载更多...</view>
    <!--加载loadding-->
    <tui-loadmore :visible="loadding" :index="2"></tui-loadmore>
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
import tuiLoadmore from "@/components/gift/loadmore";
import tuiNomore from "@/components/gift/nomore";
import { getAids, updateAid } from "@/api/aid.js";
export default {
  components: {
    tuiLoadmore,
    tuiNomore,
  },
  data() {
    return {
      selectCategoryList: [
        {
          id: -1,
          name: "全部状态",
        },
        {
          id: 0,
          name: "暂存",
        },
        {
          id: 1,
          name: "等待接单",
        },
        {
          id: 2,
          name: "已关闭",
        },
        {
          id: 3,
          name: "已接单",
        },
        {
          id: 4,
          name: "已完成",
        },
        {
          id: 5,
          name: "已评价",
        },
      ],
      filter_money_up: false,
      filter_new_up: true,
      aidtype: 1, //求助(需要别人帮忙)
      horizontal: "left",
      vertical: "bottom",
      direction: "horizontal",
      content: [
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl+"woshou1.png",
          selectedIconPath: this.$mStore.state.BaseAppStaticUrl+"woshou1.png",
          text: "我要求助",
          active: true,
        }, 
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl+"jiedan.png",
          selectedIconPath: this.$mStore.state.BaseAppStaticUrl+"jiedan.png",
          text: "我的接单",
          active: true,
        },
        {
          iconPath: "/static/aid/wode.png",
          selectedIconPath: "/static/aid/wode.png",
          text: "我的互助",
          active: true,
        },
      ],
      tabIndex: 0,
      tabList: [
        {
          name: "我的求助",
        },
        {
          name: "我提供的帮助",
        },
        {
          name: "我的接单",
        },
      ],
      screenHeight: 0, 
      empty: false,
      more: false,
      nomore: false,
      loadding: false,    
      status: "",
      page: 1,
      pagenum: 5,
      allList: [],
      oldList: [],
      imgurl: "",
      Image: [],
      title: "",
      selectedCategory: "",
      sorttype: "date",
      baseurl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      pattern: {
        color: "#7A7E83",
        backgroundColor: "#fff",
        iconColor: "#fff",
        selectedColor: "#FF8000",
      },
    };
  },
  onLoad() {
    this.imgurl = this.$mStore.state.BaseImagesUrl;
    this.page = 1;
    this.getList();
    var that = this;
    uni.getSystemInfo({
      success: function (res) {
        that.screenHeight = res.screenHeight + 450;
      },
    });
  },
  filters: {
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
      } else if (status == 5) {
        statustxt = "已评价";
      }

      return statustxt;
    },
  },
  methods: {
    modifyAid(uuid){
      this.$mRouter.push({
          route:'/pages/aid/needhelp?uuid='+uuid
      }) 
    },
    pay(billno){ 
      this.$mRouter.push({
          route:'/pages/user/money/pay?bill='+billno+'&billtype=3'
      }) 
    },
    confirm(e) {
      // 搜索
      this.searchParams["title"] = this.title;
    },
    selectCategory(index) {
      // 切换收费类型之后
      this.selectedCategory = this.selectCategoryList[index];
    },
    sort(sorttype) {
      // 排序
      this.sorttype = sorttype;
      if (sorttype == "new") {
        this.filter_new_up = true;
        this.filter_money_up = false;
      } else {
        this.filter_new_up = false;
        this.filter_money_up = true;
      }
      this.page = 1;
      this.getList();
    },
    trigger(e) { 
      let route = "";
      if (e.index == 0) {
        // 发布求助
        route = "/pages/aid/needhelp";
      } else {
        route = "/pages/aid/afford";
      }

      this.$mRouter.push({ route });
    },
    swiperChange(e) {
      let index = e.detail.current || e.target.current;
      this.switchTab(index);
    },
    switchTab(current) {
      if (this.tabIndex == current) {
        console.log(this.tabIndex);
      } else {
        this.tabIndex = current;
      }
      this.page = 1;
      this.getList();
    },
    getList() {
      if (this.tabIndex == 0) {
        this.aidtype = 1;
      } else if (this.tabIndex == 1) {
        this.aidtype = 2; //2 提供帮助（主动发布的帮助别人的帖子）
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
        aidtype: this.aidtype,
        sort: this.sorttype,
      };
      if (this.tabIndex == 0) {
        param["action"] = "mine"; // 获取我的
      }
      else if  (this.tabIndex == 2) {
        param["action"] = "answer"; // 获取我的接单
      }
      getAids(param)
        .then((data) => {
          console.log(data.msg.list);
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
    deleteAid(index, uuid) {
      var that = this;
      uni.showModal({
        title: "",
        content: "您好，确定要删除这求助吗？",
        confirmText: "删除",
        confirmColor: "#FD5000",
        success: function (res) {
          if (res.confirm) {
            const data = {
              method: "delete",
              uuids: uuid,
            };
            updateAid(data).then((res) => {
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
        url: "../aid/detail?uuid=" + uuid,
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

<style lang="scss" src="./mylist.scss" scoped>
</style>
