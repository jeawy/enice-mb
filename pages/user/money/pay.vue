<template>
  <view class="app">
    <view class="price-box">
      <text>支付金额</text>
      <text class="price">{{ money }}</text>
    </view>
    <view class="pay-type-list">
      <view class="type-item b-b" @tap="changePayType(1)">
        <i class="iconfont icon iconweixinzhifu"></i>
        <view class="con">
          <text class="tit">微信支付</text>
          <text>推荐使用微信支付</text>
        </view>
        <label class="radio">
          <radio value="" color="#fe8e2e" :checked="payType == 1" />
        </label>
      </view>
      <!-- #ifdef APP-PLUS -->
      <view class="type-item b-b" @tap="changePayType(2)">
        <i class="iconfont icon iconalipay"></i>
        <view class="con">
          <text class="tit">支付宝支付</text>
          <text>推荐使用支付宝支付</text>
        </view>
        <label class="radio">
          <radio value="" color="#fe8e2e" :checked="payType == 2" />
        </label>
      </view><!-- #endif -->
      <view
        class="type-item"
        @tap="changePayType(5)"
        v-if="parseInt(payTypeList.order_balance_pay, 10) === 1"
      >
        <i class="iconfont icon iconerjiye-yucunkuan"></i>
        <view class="con">
          <text class="tit">预存款支付</text>
          <text
            >可用余额
            {{
              userInfo && userInfo.account && userInfo.account.user_money
            }}</text
          >
        </view>
        <label class="radio">
          <radio value="" color="#fe8e2e" :checked="payType === 5" />
        </label>
      </view>
    </view>
    <!-- #ifdef MP-WEIXIN --> 
    <button
      v-if="openid.length > 0"
      class="confirm-btn"
      :disabled="btnDisabled"
      :loading="btnLoading"
      @tap="confirm"
    >
      确认支付
    </button>
    <!-- #endif -->
    <!-- #ifdef APP-PLUS -->
    <button
      class="confirm-btn"
      :disabled="btnDisabled"
      :loading="btnLoading"
      @tap="confirm"
    >
      确认支付
    </button>
    <!-- #endif -->
  </view>
</template>
//<script src="https://js.stripe.com/v3/"></script>
<script>
import store from "@/store";
import { orderPay } from "@/api/product";
import { orderDetail, paystripe } from "@/api/userInfo"; 
import {getWeixinPhoneNumber } from '@/api/basic'; 
import { getPaidMoney } from "@/api/paidservice";
import { getFeeBills } from "@/api/fee";
import { getAidBills } from "@/api/aid";
export default {
  data() {
    return {
      payType: 1,
      payTypeList: {},
      money: 0,
      userInfo: {},
      orderDetail: {},
      orderInfo: {},
      billinfo: {},
      btnLoading: false,
      btnDisabled:true,
      bills: "",
      openid: "",
	  userInfo:{}
    };
  },
  computed: {},
  onLoad(options) {
    this.initData(options);
	
  },
  onShow() { 
	  this.userInfo = uni.getStorageSync("userInfo") 
    // #ifdef MP-WEIXIN
    if (this.openid == "") {
      this.openid = uni.getStorageSync("openid"); 
    }
    // #endif
  },
  methods: {
	  login(event){
		  let encryptedData = event.detail.encryptedData;
          let iv = event.detail.iv;
		  let that = this
		  wx.login({
		    success: (res) => {
		      that.code = res.code;
		      const js_code = that.code;
		      const grant_type = "authorization_code";
		      var header = {
		        "Content-Type": "application/json",
		      };
			  console.log(that.userInfo.phone)
		      const params = {
		        encryptedData: encryptedData,
		        iv: iv,
		        js_code: js_code,
		        grantType: grant_type,
				bindphone:that.userInfo.phone
		      };
		      console.log(that.code);
		      console.log(encryptedData);
		      console.log(iv);
		  
		      getWeixinPhoneNumber(params)
		        .then((r) => {
		          console.log(r);
		          if (r.status === 0) {
		            uni.setStorageSync("openid", r.openid);
		            that.confirm();
		          }
		        })
		        .catch((res) => {
		          console.log(res);
		        })
		        .finally((res) => {
		          that.btnLoading = false;
		        });
		    },
		  });
	  },
    getPhoneNumber(event) {
      // 前端获取加密信息，后端解密后获得手机号码
      
      this.btnLoading = true;
      var that = this;
      wx.checkSession({
        success(res) {
          //session_key 未过期，并且在本生命周期一直有效
          console.log("session_key 未过期，并且在本生命周期一直有效 ");
          that.login(event)
		      that.confirm()
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
           that.login(event) 
		       that.confirm()
        },
        complete() {},
      });
    },
    // 数据初始化
    async initData(options) { 
      let billtype =  options.billtype ;
       
      let params = {};
      uni.showLoading({
        title: "请稍后",
      });
	  if ( billtype == "3" ) {
	    // 互助支付
	    params["billno"] = options.bill;
	    params["totalmoney"] = 1; // 获取总金额
	    params["billtype"] = 2; // 互助支付
	    params["communityuuid"] = uni.getStorageSync("communityuuid"); // 
	     
	    getAidBills(params)
	      .then((res) => {
	        if (res.status == 0) {
	          this.money = res.msg 
	          this.billinfo = {
	            billtype: 2,
	            bills: options.bill,
	            openid: uni.getStorageSync("openid"),
	            neworderno: options.bill, //临时交易号
	          };
            this.btnDisabled = false
	        } else {
	          uni.showToast({
	            title: res.msg,
	            icon: "error",
	          });
            this.btnDisabled = true
	        }
	      })
	      .finally((res) => {
	        uni.hideLoading();
	      });
	  }
      else if (billtype == "1" || billtype == "2" ) {
        // 物业非固定收费项订单
        params["billno"] = options.bill;
        params["totalmoney"] = 1; // 获取总金额
        params["billtype"] = 1; // 都是物业费：固定性、非固定性收费
        params["communityuuid"] = uni.getStorageSync("communityuuid"); // 
         
        getFeeBills(params)
          .then((res) => {
            if (res.status == 0) {
              this.money = res.msg 
              this.billinfo = {
                billtype: 1,
                bills: options.bill,
                openid: uni.getStorageSync("openid"),
                neworderno: options.bill, //临时交易号
              };
              this.btnDisabled = false
            } else {
              uni.showToast({
                title: res.msg,
                icon: "error",
              });
              this.btnDisabled = true
            }
          })
          .finally((res) => {
            uni.hideLoading();
          });
      }
      else if (billtype == "0") {
        // 有偿服务订单
        params["bills"] = options.bills;
        params["totalmoney"] = 1; // 获取总金额
        getPaidMoney(params)
          .then((res) => {
            if (res.status == 0) {
              this.money = res.msg.money__sum;
              this.billinfo = {
                billtype: billtype,
                bills: options.bills,
                openid: uni.getStorageSync("openid"),
                neworderno: res.neworderno, //临时交易号
              };
              this.btnDisabled = false
            } else {
              uni.showToast({
                title: "获取订单金额失败",
                icon: "error",
              });
              this.btnDisabled = true
            }
          })
          .finally((res) => {
            uni.hideLoading();
          });
      }

      this.userInfo = uni.getStorageSync("userInfo") || undefined;
    },
    //选择支付方式
    changePayType(type) {
      this.payType = type;
    },

    //确认支付
    confirm() {
      if (this.btnDisabled == true){
        return
      }
      this.btnLoading = true;
      switch (parseInt(this.payType)) {
        case 1:
          console.log(this.billinfo);
          this.$mPayment.weixinPay("order", JSON.stringify(this.billinfo));
          break;
        case 2:
          this.$mPayment.aliPay("order", JSON.stringify(this.billinfo));
          break;
        case 4:
          //信用卡支付
          var token =
            store.state.accessToken || uni.getStorageSync("accessToken");

          uni.navigateTo({
            //   url: 'stripe?id=' + this.orderInfo.order_id + '&isLogin='+token,
            url: "stripe?no=" + this.billinfo.no + "&isLogin=" + token,
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function (data) {
                console.log(data);
              },
              someEvent: function (data) {
                console.log(data);
              },
            },
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
              res.eventChannel.emit("acceptDataFromOpenerPage", {
                data: "test",
              });
            },
            fail: function (res) {
              console.log(res);
            },
          });
          break;
        case 5:
          this.$mPayment.balancePay(JSON.stringify(this.billinfo));
          break;
      }
      setTimeout(() => {
        this.btnLoading = false;
      }, 0.5 * 1000);
    },
  },
};
</script>

<style lang='scss'>
page {
  background-color: $color-white;
}

.app {
  width: 100%;
}

.price-box {
  background-color: #fff;
  height: 265upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28upx;
  color: #909399;

  .price {
    font-size: 58px;
    color: $base-color;
    margin-top: 12upx;

    &:before {
      content: "￥";
      font-size: 40upx;
    }
  }
}

.pay-type-list {
  margin-top: 20upx;
  background-color: #fff;
  padding-left: 60upx;

  .type-item {
    height: 120upx;
    padding: 20upx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 60upx;
    font-size: 30upx;
    position: relative;
  }

  .icon {
    width: 100upx;
    font-size: 52upx;
  }

  .iconerjiye-yucunkuan {
    color: #fe8e2e;
  }

  .iconweixinzhifu {
    color: #36cb59;
  }

  .iconalipay {
    color: #01aaef;
  }

  .tit {
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 4upx;
  }

  .con {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: $font-sm;
    color: $font-color-light;
  }
}
</style>
