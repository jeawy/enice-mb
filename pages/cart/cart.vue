<template>
  <view class="content">
    <!--导航栏-->
    <view class="top">
      <!-- #ifdef APP-PLUS -->
      <view class="navbar-top">
        <view class="navbar-top-text">我的订单</view>
      </view>
      <!-- #endif  -->
      <view class="topsearch">
        <nx-search
          :selectList="selectCategoryList" 
          class="sn-earch-input-box"
          button="inside"
          placeholder="按订单号搜索"
          @search="confirm()"
          @select="selectCategory"
          v-model="keyword"
        />
      </view>
      <view class="navbar-bottom"  v-if="selectedCategory.id == 1">
        <view 
          v-for="(item, index) in paidServiceMenuList"
          :key="index"
          class="nav-item"
          :class="{ current: tabCurrentIndex === item.value }"
          @tap="tabPaidServiceClick(item.value)"
        >
          {{ item.text }}
        </view>
      </view>
      <view class="navbar-bottom"  v-if="selectedCategory.id == 2">
        <view 
          v-for="(item, index) in feeMenuList"
          :key="index"
          class="nav-item"
          :class="{ current: tabCurrentIndex === item.value }"
          @tap="tabFeeClick(item.value)"
        >
          {{ item.text }}
        </view>
      </view>
    </view>
    <paidserviceOrderCard
      :paidserviceOrderList="paidserviceOrderList"
      :baseAppUrl="baseAppUrl"
      @getOrderList="getOrderList"
    />
    <feeOrderCard
      :feeOrderList="feeOrderList"
      :baseAppUrl="baseAppUrl"
      :feePayedOrderList="feePayedOrderList"
      @getList="getAllFeeList"
      @getFeeOrderList="getFeeOrderList"
    />
    <view class="process-order" v-if="billslength == 0">
      <image class="process-img" :src="baseAppUrl + `kong.png`"></image>
      <view class="process-text">您还没有相关的账单</view>
      
    </view>
    <view class="tips" v-if="billslength == 0">
      <view class="title">
        <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
        <text>温馨提示:</text>
      </view>
      <view class="appraisetxt">您没有相关账单的原因可能是:</view>
      <view class="appraisetxt">1、您在本小区不是业主或者租户。</view>
      <view class="appraisetxt">2、物业未将您的手机号码与房产进行绑定，请联系物业修改。</view> 
      <view class="appraisetxt">3、历史缴费只有在您缴费之后才会有账单出现。</view> 
    </view>
    <view v-if="more" class="getmore" @tap="getMore">加载更多...</view>

    <tui-nomore :visible="!more" bgcolor="#fafafa"></tui-nomore>
    <rf-loading v-if="loading"></rf-loading>
  </view>
</template> 
<script>
import tuiLoadmore from "@/components/gift/loadmore";
import tuiNomore from "@/components/gift/nomore";
import feeOrderCard from "@/components/order-card-fee.vue";
import paidserviceOrderCard from "@/components/order-card-paidservice.vue";
import { getPaidMoney } from "@/api/paidservice";
import { getFeeBills } from "@/api/fee";
import { orderList } from "@/api/userInfo";

export default {
  components: {
    feeOrderCard,
    paidserviceOrderCard,
    tuiLoadmore,
    tuiNomore,
  },
  data() {
    return {
      more: false,
      nomore: false,
      billslength: 0, // 订单长度
      showSearchBar: false, 
      paidserviceOrderList: [], // 有偿服务订单
      searchParams: {
        status: -1, // 全部
        tag: 0,
        keyword: "",
      },
      selectCategoryList: [
        {
          id: 2,
          name: "物业费账单",
        },
        {
          id: 1,
          name: "有偿服务账单",
        },
      ],
      allOrdersListCopy: [],
      search: "",
      tabCurrentIndex: -1,
      loadingType: "more",
      paidServiceMenuList: [
        {
          text: "全部",
          value: -1,
        },
        {
          text: "未支付",
          value: 0,
        }, 
        {
          text: "已支付",
          value: 2,
        },
      ],
      feeMenuList: [ 
        {
          text: "待缴费",
          value: -1,
        },
        {
          text: "历史缴费",
          value: 2,
        },
      ],
      loading: false,
      hasLogin: false,
      orderList: [],
      productList: [],
      page: 1,
      orderStatus: [],
      feeOrderList:[],// 物业费账单
      feePayedOrderList:[],
      selectedCategory: {
        id: 2,
        currentcategoryname: "物业费账单",
      },
      keyword: "",
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      pagenum: 5,
      communityuuid:""
    };
  },
  onShow() {
    this.communityuuid = uni.getStorageSync("communityuuid") 
    this.hasLogin = this.$mStore.getters.hasLogin;
    if (!this.hasLogin) {
      uni.showModal({
        content: "你暂未登陆，是否跳转登录页面？",
        success: (confirmRes) => {
          if (confirmRes.confirm) {
            this.$mRouter.push({
              route: "/pages/public/logintype",
            });
          }
        },
      });
    }
    // #ifdef H5 || APP-PLUS
    if (uni.getStorageSync("tab")) {
      this.tabCurrentIndex = uni.getStorageSync("tab");
      uni.removeStorageSync("tab");
    }
    this.page = 1;
    this.orderList.length = 0;

    plus.navigator.setFullscreen(true);
    // #endif
    this.initData();
  },
  onHide() {
    // #ifdef H5 || APP-PLUS
    plus.navigator.setFullscreen(false);
    // #endif
  },
  onLoad(options) { 
    console.log(options)
    if (options.tabCurrentIndex){
      this.tabCurrentIndex = parseInt( options.tabCurrentIndex)
    }
    if (options.status){
      this.searchParams.status =parseInt( options.status)
    }
  },
  methods: {
    getAllFeeList(){
       // 重新获取待缴费的物业费列表
       this.reset(true)// 全部重置
       this.getList()
    },
    getMore() {
      // 点击加载更多
      this.page = this.page + 1;
      // 根据category类型获得列表
      this.getList();
    },
    getList() { 
      this.loading = true
      if (this.selectedCategory.id == 1) {
        // 获得有偿服务订单
        this.getPaidServiceList();
      } else if (this.selectedCategory.id == 2) { 
        this.getFeeList()
      }
      this.loading = false
    },
    selectCategory(index) {
      // 切换收费类型之后
      this.selectedCategory = this.selectCategoryList[index];
      this.reset();
      this.resetPage();
      this.getList();
    },
    resetPage() {
      this.page = 1;
    },
    reset(resetAll = false) {
      if (resetAll) {
        this.paidserviceOrderList = [];
        this.feeOrderList = [] //物业费
        this.feePayedOrderList = [] //物业费历史账单
      } else {
        // 重置所有订单的列表
        if (this.selectedCategory.id == 1) {
          // 重置除了有偿服务之外的所有订单
          this.feeOrderList = [] //物业费
          this.feePayedOrderList = [] //物业费历史账单
        } else  if (this.selectedCategory.id == 2) {
          // 物业费
          this.paidserviceOrderList = [];
        }
      }
    },
    confirm(e) {
      // 搜索
      this.reset(true);
      this.resetPage();
      this.resetList();
      this.searchParams["keyword"] = this.keyword;
      this.getFeeList();
    },
    // 监听swiper切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
      this.loading = true;
      this.getOrderList(); 
      this.loading = false;
    },
    // 顶部tab点击
    tabPaidServiceClick(value) {
      // 点击有偿服务tab
      this.resetPage();
      this.resetList();
      this.tabCurrentIndex = value;
      this.searchParams.status = value;
      this.getPaidServiceList();
    },
    resetList(){
      // 切换tab之后重置所有订单
      this.paidserviceOrderList = [];
      this.feeOrderList = []; 
      this.feePayedOrderList = []
    },
    tabFeeClick(value) {
      // 点击物业费服务tab
      this.resetPage();
      this.resetList();
      this.tabCurrentIndex = value;
      this.searchParams.status = value; 
      this.getFeeList();
    },
    getFeeList() {
      // 物业费相关账单
      this.loading = true;
      this.reset(); 
      this.searchParams["page"] = this.page;
      this.searchParams["pagenum"] = this.pagenum;  
      getFeeBills({
        ...this.searchParams,
        communityuuid: this.communityuuid}
        )
        .then((res) => { 
          if (res.status == 0) { 
            if (this.tabCurrentIndex == -1){
              // 待支付的账单 
              this.feeOrderList = this.feeOrderList.concat([
                ...res.msg,
              ]);
              if (res.msg.length < this.pagenum) {
                this.more = false;
              } else {
                this.more = true;
              }
              this.billslength = this.feeOrderList.length; 
            }
            else{
              // 已支付的订单
              this.feePayedOrderList = this.feePayedOrderList.concat([
                ...res.msg.orders,
              ]);
              if (res.msg.orders.length < this.pagenum) {
                this.more = false;
              } else {
                this.more = true;
              }
              this.billslength = this.feePayedOrderList.length; 
            }
            
          } else {
            uni.showToast({
              title: res.msg,
              icon: "error",
            });
          }
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    getPaidServiceList() {
      // 有偿服务订单
      this.loading = true;
      this.reset();
      this.searchParams["page"] = this.page;
      this.searchParams["pagenum"] = this.pagenum;
     ;
      getPaidMoney(this.searchParams)
        .then((res) => { 
          if (res.status == 0) {
            this.paidserviceOrderList = this.paidserviceOrderList.concat([
              ...res.msg.orders,
            ]);
            if (res.msg.orders.length < this.pagenum) {
              this.more = false;
            } else {
              this.more = true;
            }
            this.billslength = this.paidserviceOrderList.length;
          } else {
            uni.showToast({
              title: res.msg,
              icon: "error",
            });
          }
        })
        .finally((res) => {
          this.loading = false;
        });
    },
    navTo(route) {
      if (!route) {
        return;
      } 
      this.$mRouter.push({
        route,
      }); 
    },
    // 数据初始化
    initData() { 
      this.feeOrderList = []
      this.paidserviceOrderList = []
      this.getList()
    },

    searchInput() {
      let searchStr = this.search.trim();
      if (searchStr !== "") {
        const foundOrders = this.allOrdersListCopy.filter(
          (order) => order.rules[0].username.indexOf(this.search) > -1
        );
        this.orderList = foundOrders;
      } else {
        this.orderList = this.allOrdersListCopy;
      }
    },
    getFeeOrderList(){},
    // 获取订单列表
    async getOrderList(type) {
      this.loading = true;
      let params = {};
      let index = this.tabCurrentIndex;
      if (this.tabCurrentIndex) {
        if (this.tabCurrentIndex === 3 || this.tabCurrentIndex === 4) {
          params.status = 3;
        } else {
          params.status = index - 1;
        }
      }
      params.page = this.page;
      await this.$http
        .get(`${orderList}`, params)
        .then(async (r) => {
          if (type === "refresh") {
            uni.stopPullDownRefresh();
          }

          //this.loadingType  = r.data.length === 10 ? 'more' : 'nomore';
          this.orderList = [...r.msg];
          this.allOrdersListCopy = [...r.msg];
          /*
					this.orderList.map(item=>{
						this.productList.push(item.rules.thumbnail_portait);
						this.orderStatus.push(this.statusformat(item.status));
					})*/
          // if (this.orderList.length === 0) {
          // await this.getGuessYouLikeList();
          // }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          if (type === "refresh") {
            uni.stopPullDownRefresh();
          }
        });
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped src="./cart.scss">
</style>
