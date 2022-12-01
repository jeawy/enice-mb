<template>
  <view class="recordmain">
    <view class="header">
			
				<view class="header-level1"> 
          <view class="showrank"> 
            <view class="name">支出</view> 
            <view v-if="hasLogin" class="num">{{expend}}</view>
            <view v-else class="num">--</view>
          </view>
          <view class="look" @tap="target('/pages/user-center/currency/getcurrency')">
            <view v-if="hasLogin" class="num">{{income}}</view>
            <view v-else class="num">--</view>
            <view class="lookrank">收入</view>
          </view>
          <view class="withdraw" @tap="target('/pages/user-center/currency/getcurrency')">
            <view v-if="hasLogin" class="num">{{left}}</view>
            <view v-else class="num">--</view>
            <view class="lookrank">已提现</view> 
          </view> 
				</view>
        <view class="milage">
          账户余额
        </view>
        <view class="top-left">
          <view class="total">
            <view class="number">{{left | number}}</view>
            <view class="kilometers">￥</view>
          </view>
        </view>
			</view> 

     <view class="topsearch">
        <nx-search
          :selectList="selectCategoryList" 
          class="sn-earch-input-box"
          button="inside"
          placeholder="搜索" 
          :listChanged="listChanged"
          @search="confirm()"
          @select="selectCategory"
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

    <view
      class="list-scroll-content" 
    > 
    <!-- 物业费支出 -->
      <view
        v-for="(item, index) in expandFeeList"
        :key="index"
        class="rf-order-item"
      >
        <view
          class="i-top-title" 
        >
          <text class="title">{{ item.feename }}</text>
          <text class="money">【支付{{item.money}}元】</text> 
        </view> 
        <view class="userinfo"   >
          <text class="time" > {{ item.date | time(item.date) }} </text>
        </view> 
        <view  class="record-content"   >
          <text class="context-text">{{ item.detail }}</text> 
        </view>
        <view class="action-box b-t"></view>
      </view>
       <!-- 有偿服务支出 -->
      <view
        v-for="(item, index) in expandPaidserviceList"
        :key="index"
        class="rf-order-item"
      >
        <view
          class="i-top-title" 
        >
          <text class="title">{{ item.subject }}</text>
          <text class="money">【支付{{item.money}}元】</text> 
        </view> 
        <view class="userinfo"   >
          <text class="time" > {{ item.date | time(item.date) }} </text>
        </view> 
        <view  class="record-content"   >
          <text class="context-text">{{ item.community__name }}</text> 
        </view>
        <view class="action-box b-t"></view>
      </view>
      <!-- 互助支出 -->
      <view
        v-for="(item, index) in expandAidList"
        :key="index"
        class="rf-order-item"
      >
        <view
          class="i-top-title" 
        >
          <text class="title">{{ item.aid__title }}</text>
          <text class="money">【支付{{item.money}}元】</text> 
        </view> 
        <view class="userinfo"   >
          <text class="time" > {{ item.date | time(item.date) }} </text>
        </view> 
        <view  class="record-content"   >
          <text class="context-text">{{ item.community__name }}</text> 
        </view>
        <view class="action-box b-t"></view>
      </view>

       <!-- 互助收入 -->
      <view
        v-for="(item, index) in incomesList"
        :key="index"
        class="rf-order-item"
      >
        <view
          class="i-top-title" 
        >
          <text class="title">{{ item.aid__title }}</text>
          <text class="money">【收入{{item.mymoney}}元】</text> 
        </view> 
        <view class="userinfo"   >
          <text class="time" > {{ item.date | time(item.date) }} </text>
        </view> 
        <view    >
          <view >明细：</view>
          <view >总佣金：{{item.money}}元</view>
          <view >平台抽成:{{item.aid__community__aid_commission_rate * 100}}%</view>
          <view >您的收入:{{item.mymoney}}元</view> 
        </view>
        <view class="action-box b-t"></view>
      </view>
       <!-- 提现记录 -->
      <view
        v-for="(item, index) in withdrawList"
        :key="index"
        class="rf-order-item" >
        <view  class="i-top-title"  >
          <text class="title">提现金额：{{ item.money }}元</text>
          <text class="money">{{item.status | withdrawstatus}}</text> 
        </view> 
        <view class="userinfo"   >
          <text class="time" >申请日期:{{ item.date | time(item.date) }} </text>
        </view> 
        <view>
          <view v-if="item.status == 0" >提现申请已提交，请耐心等待，我们会在{{workday}}个工作日处理完毕。</view>
          <view v-if="item.status == 1">提现金额{{item.money}}已支付至您绑定的银行卡内，请及时查看。</view>
          <view v-if="item.status == 2">提现申请已被拒绝，拒绝原因:{{item.remark}}</view>
          <view class="topimageholder" v-if="item.newimages.length !== 0">
                <view
              v-for="(imgitem, imgindex) in item.newimages"
              :key="imgindex"
            >
              <image
                :src="imgitem.filepath"
                class="picture"
                mode="aspectFill"
                @tap="previewCommentImage(item.newimages, imgindex)"
              />
            </view>
          </view> 
        </view>
        <view class="action-box b-t"></view>
      </view>
       <view class="tips" v-if="withdrawList.length == 0 && tabCurrentIndex == 2">
        <view class="title">
          <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
          <text>温馨提示:</text>
        </view> 
        <view class="appraisetxt">1、您的账户余额为{{left}}元,超过{{MINMONEY}}元即可申请提现。</view>
        <view class="appraisetxt">2、我们将在{{workday}}个工作日内处理您的提现申请。</view>
        <view class="appraisetxt">3、我们将打款到您绑定的银行卡中，请确保您的银行信息正确
          <text class="txtclick" @tap="target('/pages/user/bank/bankinfo')">点击绑卡</text>
        <text class="txtclick" @tap="openWithdraw">申请提现</text> </view>
      </view>
    </view>
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
    <s-popup custom-class="popupColumns" ref="popup" type="top">
			<view class="popup-holder"> 
				<image :src="baseAppUrl+`close.png`" class="close" @tap="close" />
				<view class="v-title">
					<text class="pop-title">申请提现</text>
				</view>
				<view class="tips" >
        <view class="title">
          <image :src="baseAppUrl + 'tishi.png'" class="tishi" /> 
        </view> 
        <view class="appraisetxt">1、您的账户余额为{{left}}元。</view>
        <view class="appraisetxt" v-if="left>=MINMONEY">2、申请提现金额为{{left}}元。</view>
        <view class="appraisetxt" v-if="left<MINMONEY">2、余额不足{{MINMONEY}}元无法申请提现。</view>
      </view> 
				<button class="disabledbtn" :disabled="left<MINMONEY"  v-if="left<MINMONEY" >余额不足，无法申请提现</button>
        <button  :loading="loading" v-else class="btn-submit" @tap="sendRequest">申请提现</button> 
			</view> 
		 </s-popup> 
  </view>
</template>

<script> 
import { requestWithdraw, getWithdraws } from "@/api/withdraw";
import { getIncomesApi, getIncomesListApi } from "@/api/incomes";
import tuiNomore from "@/components/gift/nomore"; 
import sPopup from "@/components/s-popup/index.vue";
export default {
  components: { 
    tuiNomore, 
    sPopup
  },
  data() {
    return { 
      workday:10,
      left:0,
			income:0,
			expend:0,
      listChanged:0, // 监测是否修改了selectlist数组
      MINMONEY:100,// 超过次金额才可以申请提现
      withdraw:0,//提现金额
      incomesList: [],
      tabCurrentIndex: 0,
      selectCategoryList:[
        {
          id: 15,
          name: "物业费",
        },
        {
          id: 14,
          name: "物业有偿服务",
        },
        {
          id: 12,
          name: "邻里求助",
        }
      ],
      navList:   [ 
          {state: 0, text: '支出明细'},
          {state: 1, text: '收入明细'} , 
          {state: 2, text: '提现明细'} , 
      ] ,  
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
          text: "申请提现",
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
      entity_type: this.$mConstDataConfig.FEE, 
      expandFeeList:[],
      expandAidList:[],
      expandPaidserviceList:[],
      withdrawList:[],//提现列表
      selectedCategory:{
        id:this.$mConstDataConfig.FEE,
        name:""
      }
    };
  },
  onPullDownRefresh(){ 
    this.page = 1
    
    this.getList();
    uni.stopPullDownRefresh();

  }, 
  onShow() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    if(this.hasLogin == false){
      this.$mHelper.backToLogin(true)
    }
    else{
      this.status = this.tabCurrentIndex;  
    } 
  },
  filters:{
    withdrawstatus(status){
      let statustxt = "申请中"
      if (status == 1){
        statustxt = "已支付"
      }
      else if (status == 2){
        statustxt = "已拒绝"
      }
      return statustxt
    }
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
    this.getIncomesTotal()
    this.getExpends()
  },
   
  //加载更多
  onReachBottom() {
    console.log(this.page);
    //this.page ++;
  },
  methods: { 
    sendRequest(){
      //提交提现申请
      this.loading = true
      let _this = this;
      requestWithdraw().then((res)=>{  
          uni.showModal({
            content:res.msg,
            showCancel:false,
            buttonText:"确定" 
          }) 
          if (res.status == 0){
            this.$refs.popup.hide();
            setTimeout(() => {
              _this.page = 1
              _this.getwithdrawList();
            }, 2500); 
          }  
      }).finally((res)=>{
        this.loading = false
        
      })
    },
    close(){
      this.$refs.popup.hide();
    },
    openWithdraw(){
      //申请提现
      this.$refs.popup.show('top');
    },
    target(route) { 
		this.$mRouter.push({route});
    }, 
    previewCommentImage(imgs, index) {
      uni.previewImage({
        urls: imgs,
        current: imgs[index],
      });
    },
    getAidIncomes(){ 
      // 获得互助的收入列表
      this.expandFeeList = []
      this.expandAidList = []
      this.expandPaidserviceList = []
      this.withdrawList = []
      this.nomore = false;
      this.more = false;
      let params = {
        keyword: this.keyword, 
        page: this.page,
        incomes:1,// 收入
        entity_type:this.entity_type,
        pagenum: this.pagenum,
      };
      getIncomesListApi(params).then(res => { 
        if (res.status == 0){
          //
          if (res.msg.length < this.pagenum) {
            this.nomore = true;
          } else {
            this.more = true;
          } 
          if (this.page == 1) {
            this.incomesList = [...res.msg];
          } else {
            this.incomesList = this.incomesList.concat([...res.msg]);
          }  
        }
        else{ 
          uni.showToast(
            {
              icon:"error",
              title:res.msg
            }
          )
        }
      })
    },
    
    getExpends(){
      // 获得物业费的支出列表
      this.incomesList = []
      this.withdrawList = []
      this.nomore = false;
      this.more = false; 
      let params = {
        keyword: this.keyword, 
        page: this.page,
        incomes:0,// 支出
        entity_type:this.entity_type,
        pagenum: this.pagenum,
      };
      getIncomesListApi(params).then(res => { 
        if (res.status == 0){
          //
          if (res.msg.length < this.pagenum) {
            this.nomore = true;
          } else {
            this.more = true;
          }
          
          if (this.entity_type == this.$mConstDataConfig.FEE){
            //物业费支出
            this.expandAidList = []
            this.expandPaidserviceList = []
            if (this.page == 1) {
              this.expandFeeList = [...res.msg];
            } else {
              this.expandFeeList = this.expandFeeList.concat([...res.msg]);
            } 
          }
          else if (this.entity_type == this.$mConstDataConfig.AID){
            //互助类支出
            this.expandFeeList = []
            this.expandPaidserviceList = [] 
            if (this.page == 1) {
              this.expandAidList = [...res.msg];
            } else {
              this.expandAidList = this.expandAidList.concat([...res.msg]);
            } 
          }
          else {
            //有偿服务支出
            this.expandAidList = []
            this.expandFeeList = [] 
            if (this.page == 1) {
              this.expandPaidserviceList = [...res.msg];
            } else {
              this.expandPaidserviceList = this.expandPaidserviceList.concat([...res.msg]);
            } 
          }
          
        }
        else{ 
          uni.showToast(
            {
              icon:"error",
              title:res.msg
            }
          )
        }
      })

    },
    getPaidServiceExpends(){
      // 获得有偿服务的支出列表
      this.entity_type = this.$mConstDataConfig.PAIDSERVICE;
    },
    async getIncomesTotal(){
      // 获取收支统计
				await getIncomesApi().then(res=>{
					if (res.status == 0){
						this.income = res.msg.income_total
						this.expend = res.msg.expend_total
						this.left = res.msg.left 
					}
				}) 
			},
    selectCategory(index) {
      // 切换收费类型之后
      this.page = 1 
      this.selectedCategory = this.selectCategoryList[index];
      this.entity_type = this.selectedCategory.id 
      this.getList()
    },
    clearKeyword(e){ 
      this.keyword = ""
      this.getList()
    },
    getMore() {
      this.page = this.page + 1;
      this.getList() 
    },
    //顶部tab点击
    tabClick(index) {
      this.page = 1;   
      this.tabCurrentIndex = index;
      if(this.keyword.value != undefined){
        this.keyword = this.keyword.value 
      }
      this.listChanged = this.listChanged == 1?0:1
      if (this.tabCurrentIndex == 0){
        this.entity_type = 15
      }
      this.getList()
    }, 
    confirm() { 
      console.log(this.keyword)
      this.getList();
    },
    getwithdrawList(){
      //提现列表
      this.nomore = false;
      this.more = false;
      this.incomesList = []
      this.expandFeeList=[]
      this.expandAidList=[]
      this.expandPaidserviceList=[]
      let params = { 
        page: this.page, 
        pagenum: this.pagenum,
      };
      getWithdraws(params).then((res) =>{ 
        console.log(res)
        if (res.status == 0){
          //
          if (res.msg.list.length < this.pagenum) {
            this.nomore = true;
          } else {
            this.more = true;
          } 
          let newlist = res.msg.list
          newlist.forEach((item) => {
            item.newimages = [];
            item.images.forEach((imgitem) => {
                item.newimages.push(this.baseUrl + imgitem[0]);
            });
          })
          
          this.workday = res.msg.workday
          this.MINMONEY = res.msg.minmoney
          if (this.page == 1) {
            this.withdrawList = [...res.msg.list];
          } else {
            this.withdrawList = this.withdrawList.concat([...res.msg]);
          }  
         }
        else{ 
          uni.showModal({
            content:res.msg,
            showCancel:false,
            buttonText:"确定" 
           } 
          )
        }
      })
    },
    getList() {
       if (this.tabCurrentIndex == 0){
        this.selectCategoryList=[
        {
          id: 15,
          name: "物业费",
        },
        {
          id: 14,
          name: "物业有偿服务",
        },
        {
          id: 12,
          name: "邻里求助",
        }
      ]
        //支出
        this.getExpends();
      }
      else  if(this.tabCurrentIndex == 1){ 
        this.selectCategoryList= [ 
          {
            id: 12,
            name: "邻里求助",
          }
        ]
        this.entity_type = 12 
        //收入
        this.getAidIncomes(); 
      }
      else   {
        //提现 
        this.selectCategoryList=[
          {
            id: 12,
            name: "全部",
          }
        ]
        this.getwithdrawList(); 
      }
    },
    trigger(e) { 
       this.$refs.popup.show("top") 
    },
    // 跳转页面
    navTo(route) {
      this.$mRouter.push({ route });
    },
  },
};
</script>

<style lang="scss" scoped>
.v-edit {
  position: absolute;
  right: 35rpx;
  top: 35rpx;
  color: $base-color;
}
.recordmain {
  flex: 1;
  .popupColumns{
			.popup-holder{ 
				min-height:  500rpx; 
				margin-top: 30rpx;
				padding-bottom: 150rpx;
        padding: 25rpx;
				background-color: $color-white; 
				.requiredtips{
					margin-left: 25rpx;
					color:$uni-color-error;
					margin-bottom: 15rpx;;
				}
				.v-title{
						text-align: center; 
						width: 700rpx;
						margin-bottom: 30rpx;
					}
			 
				width:700rpx;   
        .disabledbtn{
          margin-top: 35rpx;
        } 
				.btn-submit{
          background-color:$base-color;
          color:white;
          margin-top: 25rpx; 
        }
			}
			.close{
				position: absolute;
				top:10rpx;
				right:10rpx;
				height: 50rpx;
				width: 50rpx; 
			}

		}
  .tips{
    margin: 0 25rpx;
    .txtclick{
      color:$font-color-spec;
      font-weight: bold; 
      margin-left: 15rpx;
    }
  }
  .process-order{
        width:750rpx;
        text-align: center;
        .process-img{
            width: 200rpx;
            height: 200rpx; 
        }
        .process-text{
            color:$font-color-base
        }
    } 
  .header {
				padding-left: 25rpx; 
        background-color:#FFFFFF;
				.milage {
					text-align: center;
					font-size: 30upx;
					border-bottom: 10upx solid #DF5000;
					width: 230rpx;
          margin-left:235rpx;
          justify-content: center;
				}
        .top-left {  
						.total {
              width: 700rpx;
							display: flex; 
							padding-top: 16rpx; 
              align-items:bottom;
              justify-content: center;
							.number {
								font-size: 44px;
								letter-spacing: -10upx;
								line-height: 100rpx;
                color:$base-color;

							}

							.kilometers {
                margin-top: 40rpx;
								font-size: 16px; 
								color:$font-color-light;
							}
						}
					}

				.header-level1 {
					display: flex;  
          height: 110rpx; 
          .showrank {
            padding: 0 10upx;
            padding-top: 8upx;
            margin-right: 5rpx;
            background-color: #4D4D4D;
            width: 230rpx;
            height: 110upx;
            color: #FFFFFF;
            text-align: center; 
            .name {
              display: inline-block;
              position: relative;
              padding-top: 10rpx; 
            } 
            .num {
              line-height: 40rpx; 
              font-weight: bold;
            }
          }

          .look {
            padding: 0 10upx;
            display: flex;
            flex-direction: column;
            margin-right: 5rpx;
            background-color: #DF5000;
            height: 110upx;
            width: 230rpx;
            text-align: center;
            color: #FFFFFF;

            .num {
              line-height: 40rpx;
              padding-top: 15rpx;
              font-weight: bold;
              margin-bottom: 5rpx;
            }

            .lookrank {
              color: #FFFFFF;  
            }
          }
          .withdraw{
            background-color: #00A973;
            height: 110upx;
            width: 230rpx;
            text-align: center;
            color: #FFFFFF;
            .num{
              margin-top: 15rpx;
            }
          }
					 
				}

			}

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
  display: flex;
  line-height: 80rpx;
  border-bottom: 1px solid $base-color;
  justify-content:space-between;
  .money{
     color:$base-color;
  }
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
  z-index: 1;
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
