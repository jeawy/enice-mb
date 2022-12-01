<template>
  <!-- 物业费账单 -->
  <view class="recordmain">
    <view class="unpayedbills" v-if="feeOrderList.length > 0">
      <view
        v-for="(item, index) in feeOrderList"
        :key="index"
        class="rf-order-item"
      >
        <view class="communityinfo firstline">
          <view class="v-logo">
            <image
              class="exceltop"
              :src="baseAppUrl + `icons/fangwu1.png`"
            ></image>
            <text class="title">{{ item.communityname }}</text>
          </view>
          <view class="roominfo">
            <text class="roomname"
              >{{ item.buildingname }}{{ item.unitname }}{{ item.name }}面积：{{
                item.area
              }}平米
            </text>
          </view>
        </view>
        <view class="v-promtion" v-if="item.arrearage_start_date == null">
          <!-- 物业费未设置起始计费日期 -->
          <image class="jinggao" :src="baseAppUrl + `jinggao.png`"></image>
          <view class="datetxt"
            >上次交费时间未确定，无法计算当前应交费，请联系物业:{{
              item.orgtel
            }}</view
          >
        </view>
        <view class="v-fee" v-else>
          <view class="normalstatus" v-if="item.fee_status == 1">
            您的物业费已缴清，感谢您对物业工作的支持.
          </view>
          <!-- 物业费 -->
          <view class="feedate">
            <view class="datestart"
              >计费周期: {{ item.arrearage_start_date | date }}至
              <view @tap="selectParent(index)">
                {{ item.arrearage_end_date | date }}
              </view>
            </view>
            <image
              @tap="selectParent(index)"
              class="xiasanjiao xiasanjiaofee"
              :src="baseAppUrl + `xiasanjiaohui.png`"
            ></image>
            <!-- 选择列表 -->
            <view
              :class="
                `select-item-list select-item-list-date select-item-list-date-` +
                item.uuid
              "
              ref="parent"
              :style="{ display: item.parent ? 'block' : 'none' }"
            >
              <text
                class="cuIcon-triangleupfill"
                style="
                  position: absolute;
                  top: -18px;
                  left: 60rpx;
                  font-size: 30rpx;
                  color: #ffffff;
                "
              ></text>
              <view
                :class="['select-item', dateindex > 0 ? 'item-border' : '']"
                v-for="(data, dateindex) in item.arrearage_end_date_pre"
                :key="dateindex"
                @click="selectParentItem(index, dateindex)"
                >缴费至:{{ data | date }}</view
              >
              <image class="process-img" src="/static/sanjiao.png"></image>
            </view>
          </view>
          <view class="totalfee">
            <view class="v-yufu" @tap="selectParent(index)">
              <image class="yufu" :src="baseAppUrl + `pay/yufu.png`"></image>
              <view class="yufutxt">预付物业费</view>
            </view>
            <view class="paytxt">物业费合计</view>
            <view class="money"
              >{{ item.bill.need_pay_money }}
              <text class="moneyunit">元</text>
            </view>
            <button
               v-if="item.money > 0"
              type="error"
              class="paybtn"
              @tap="payFixedFee(item.bill.billno)"
            >
              去缴费
            </button>
            <button
               v-else
              type="success"
              class="paybtn" 
            >
              已缴清
            </button>
          </view>
          <view class="detail">
            <view class="tips">缴费可获得积分，积分换好礼</view>
          </view>
          <view class="detail">
            <view
              >物业费明细( {{ item.arrearage_start_date | date }} 至
              {{ item.arrearage_end_date | date }})：</view
            >
          </view>
          <view class="detail-items">
            <view
              class="detail-item"
              v-for="(itemfixedfee, index) in item.fixedfees"
              :key="index"
            >
              <view class="items-name"
                >{{ itemfixedfee.feename }}:{{ itemfixedfee.money }}
                <text class="moneyunit">元</text></view
              >
            </view>
          </view>
          <view class="orginfo" @click="orgPhone(item.orgtel)">
            <view>物业客服电话:</view>
            <view class="phone">{{ item.orgtel }}</view>
          </view>
        </view>
        <!-- 非固定收费项:未支付的 -->
        <view
          class="dynamicfees"
          v-for="(dynamicitem, dynamicindex) in item.dynamicfees"
          :key="dynamicindex"
        >
          <!-- 非固定收费 -->
          <view class="top">
            <view class="dynamic-title">{{
              dynamicitem.dynamicfee_detail__dynamicfee__name
            }}</view>
            <view class="start_date_txt">到期时间</view>
            <view class="start_date">{{ dynamicitem.start_date | date }}</view>
          </view>
          <view class="dynamicfee_start_date"> 
          </view>
          <view class="top">
            <view class="dynamic-tips">可续费至</view>
            <view
              @tap="selectChildren(index, dynamicindex)"
              class="dynamic-tips"
              >{{ dynamicitem.end_date | date }}</view
            >
            <image
              @tap="selectChildren(index, dynamicindex)"
              class="xiasanjiao"
              :src="baseAppUrl + `xiasanjiaohui.png`"
            ></image>
            <!-- 选择列表 -->
            <view
              class="select-item-list select-item-list-fee"
              ref="children"
              :style="{ display: dynamicitem.children ? 'block' : 'none' }"
            >
              <text
                class="cuIcon-triangleupfill"
                style="
                  position: absolute;
                  top: -18px;
                  left: 60rpx;
                  font-size: 30rpx;
                  color: #ffffff;
                "
              ></text>
              <view
                :class="['select-item', datefeeindex > 0 ? 'item-border' : '']"
                v-for="(data, datefeeindex) in dynamicitem.end_date_pre"
                :key="datefeeindex"
                @click="selectDynamicItem(index, dynamicindex, datefeeindex)"
                >缴费至:{{ data | date }}</view
              >
              <image class="process-img" src="/static/sanjiao.png"></image>
            </view>
          </view>
          <view class="dynamicdetail"> {{ dynamicitem.detail }} </view>
          <view class="totalfee">
            <view class="money"
              >{{ dynamicitem.money }}<text class="moneyunit">元</text></view
            >
            <button
              type="error"
              class="paybtn"
              @tap="payDynamicFee(dynamicitem.billno)"
            >
              去续费
            </button>
          </view>
        </view>
        
        <view class="action-box"></view>
      </view>
    </view> <!-- end unpayedbills -->
    <view class="payedbills" v-if="feePayedOrderList.length > 0">
      <view
        v-for="(item, index) in feePayedOrderList"
        :key="index"
        class="rf-order-item unpayed-items"
      >
      <view class="firstline" >
						<text class="billno">订单号:{{item.billno}}</text> 
			</view>
      <view class="communityinfo">
          <view class="v-logo v-logo2">
            <image
              class="exceltop fangwu2"
              :src="baseAppUrl + `icons/fangwu1.png`"
            ></image> 
          </view>
          <view class="roominfo">
            <text class="roomname">
              {{ item.room__unit__building__name }}{{ item.room__unit__name }}{{ item.room__name }} 
            </text>
          </view>
      </view>
      
      <view class="v-fee" >
        <view class="feedate"> 
              <view class="dynamic-title">{{item.feename}}</view>
              <view  class="unpayed-daterange" v-if="item.start_date">
               计费周期: {{ item.start_date | date }}至 {{ item.end_date | date }}
              </view> 
        </view>
        <view class="totalfee">
            <view class="v-detail"  >  {{ item.detail }}  </view>
            <view class="paytxt">支付金额</view>
            <view class="money"  >{{ item.receipt_amount }} <text class="moneyunit">元</text>
            </view>  
            <view class="forthline" >
              <view class="billdate">订单日期:{{item.date | time}}</view>
              <view class="billdate" v-if="item.remark">{{item.remark }}</view>  
            </view> 
        </view>
      </view>
    </view><!-- end payedbills -->
  </view>
  </view>
</template>

<script>
import { updateFees } from "@/api/fee";

export default {
  props: [
    "feeOrderList",
   "baseAppUrl", 
   "feePayedOrderList"
   ],
  data() {
    return {
      hasLogin: true,
    };
  },
  filters: {
    statusFilter(status) {
      let statustxt = "未支付";
      if (status == 2) {
        statustxt = "已支付";
      } else if (status == 4) {
        statustxt = "异常订单";
      }
      return statustxt;
    },
    statusImageFilter(status, baseAppUrl) {
      let statusimsg = "pay/weizhifu.png";
      if (status == 2) {
        statusimsg = "pay/yizhifu.png";
      } else if (status == 4) {
        statusimsg = "pay/yichang.png";
      }
      return baseAppUrl + statusimsg;
    },
  },
  methods: {
    payFixedFee(billno) {
      // 支付固定收取的物业费
      let billtype = 2; //物业固定性收费
      // 去支付
      this.$mRouter.push({
        route: "/pages/user/money/pay?bill=" + billno + "&billtype=" + billtype,
      });
    },
    payDynamicFee(billno) {
      // 支付非固定收费项
      let billtype = 1; //物业非固定性收费
      this.$mRouter.push({
        route: "/pages/user/money/pay?bill=" + billno + "&billtype=1",
      });
    },
    selectParentItem(index, dateindex) {
      // 预付固定物业费
      let final_date =
        this.feeOrderList[index].arrearage_end_date_pre[dateindex];

      let data = {
        roomuuid: this.feeOrderList[index].uuid,
        final_date: final_date,
      };
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      updateFees(data)
        .then((res) => { 
          if (res.status == 0) {
            this.$emit("getList");
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    selectDynamicItem(index, dynamicindex, datefeeindex) {
      //预付非固定费，如停车费
      let final_date =
        this.feeOrderList[index].dynamicfees[dynamicindex].end_date_pre[
          datefeeindex
        ];

      let dynamicfeeuuid =
        this.feeOrderList[index].dynamicfees[dynamicindex]
          .dynamicfee_detail__uuid;
      let data = {
        dynamicfeeuuid: dynamicfeeuuid,
        final_date: final_date,
      };
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      updateFees(data)
        .then((res) => { 
          if (res.status == 0) {
            this.$emit("getList");
          }
        })
        .finally(() => {
          uni.hideLoading();
        });
    },

    change(e) { 
    },
    orgPhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
      });
    },
    rateChange(e, orderuuid) { 
      let data = {
        method: "put",
        score: e.value,
        uuid: orderuuid,
      };
      postPaidOrder(data).then((res) => {
        if (res.status == 0) {
          uni.showToast({
            title: "评价成功",
            icon: "success",
          });
        } else {
          uni.showToast({
            title: res.msg,
            icon: "error",
          });
        }
      });
    },
    pay(billno) {
      let bills = [billno];
      this.$mRouter.push({
        route: `/pages/user/money/pay?bills=${JSON.stringify(
          bills
        )}&billtype=0`,
      });
    },
    navTo(route) {
      if (!route) {
        return;
      }
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
      } else {
        this.$mRouter.push({
          route,
        });
      }
    },
    selectItem(index) {
      this.feeOrderList[index].parent = !this.feeOrderList[index].parent;
    }, 
    selectParent(index) {
      // 隐藏或显示日期面板
      this.feeOrderList[index].parent = !this.feeOrderList[index].parent;
    },
    selectChildren(index, childrenindex) {
      // 隐藏或显示日期面板
      let child = this.feeOrderList[index].dynamicfees[childrenindex].children;
      this.feeOrderList[index].dynamicfees[childrenindex].children = !child;
    },
  },
};
</script>

<style lang="scss" scoped>
.communityinfo {
  border-bottom: 1px solid $border-color-base;
  margin-bottom: 15rpx;
}
.dynamicfees {
  margin-top: 15rpx;
  border-top: 1px solid $border-color-base;
}
.totalfee {
  text-align: center;
  width: 100%;
}

.select-item-list {
  background-color: #ffffff;
  position: absolute;
  width: 250rpx;
  left: -20rpx;
  border-radius: 10rpx;
  z-index: 10;
  box-shadow: 0px 0px 5px #c9c9c9;
  .process-img {
    margin: 0 auto;
    border-radius: 10rpx;
    z-index: 9;
    position: absolute;
    top: -20rpx;
    left: 110rpx;
    height: 30rpx;
    width: 30rpx;
  }
  .select-item {
    z-index: 10;
    text-align: center;
    padding: 10rpx 0;
  }

  .item-border {
    border-top: 1rpx solid #eeeeee;
  }
}

.select-item-list-date {
  position: absolute;
  margin-top: 45rpx;
  left: 200rpx;
  width: 350rpx;
  .process-img {
    left: 160rpx;
  }
}

.select-item-list-fee {
  position: absolute;
  margin-top: 75rpx;
  left: 20rpx;
  width: 350rpx;
  .process-img {
    left: 160rpx;
  }
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin-right: 15rpx;
  border-radius: 15rpx;
}
.v-logo,
.feedate,
.v-promtion,
.top,
.dynamicfee_start_date {
  display: flex;
}
.v-logo2{
  height: 25rpx;
}
.dynamicfee_start_date {
  text-align: center;
  width: 100%;
}
.firstline{ 
  margin-top: 15rpx;
  .billno{
    color:$base-color;
    font-size: $font-lg;  
  } 
}

.dynamic-tips {
  line-height: 90rpx;
  margin-right: 15rpx;
}
.enddate {
  border-bottom: 1px solid $font-color-base;
}
.unpayed-daterange{
  color:$font-color-light;
  margin-top:25rpx;
  margin-left: 25rpx;
}
.billdate{
  text-align: left;
  color:$font-color-light;
}
.dynamic-title {
  margin-top: 15rpx;
  font-size: 20px;
  color: $base-color;
  border-bottom: 2px solid $base-color;
}
.start_date_txt {
  color: $font-color-light;
  margin-top: 35rpx;
  margin-left: 15rpx;
  margin-right: 15rpx;
  padding-top: 5rpx;
}
.start_date {
  color: $uni-color-success;
  font-size: 20px;
  margin-top: 30rpx;
}
.v-promtion {
  margin: 15rpx 0;
}
.xiasanjiao {
  width: 40rpx;
  height: 40rpx;
  margin-top: 25rpx;
}
.xiasanjiaofee {
  margin-top: 0rpx;
}

.goview {
  text-align: right;
  color: $font-color-light;
}

.recordmain {
  flex: 1;
  .normalstatus{
    color:white;
    width:100%;
    background-color:#01E076;
    border-radius: 10rpx;
    text-align: center;
  }
}
.exceltop {
  position: absolute;
  margin-top: 15rpx;
  width: 60rpx;
  height: 60rpx;
}
.fangwu2{
  margin-top: 0px;
}
.dynamicdetail {
  color: $font-color-light;
}
.datestart,
.dateend {
  color: $font-color-base;
}
.jinggao {
  width: 90rpx;
  height: 60rpx;
  margin-right: 15rpx;
}
.paytxt   {
  color:$font-color-light
}
.v-detail{
  margin: 15rpx 0;
}
.datetxt {
  color: $uni-color-error;
}
.detail-items,
.orginfo {
  display: flex;
}

.items-name {
  margin: 10rpx 0;
}

.detail-item {
  width: 370rpx;
  color: $font-color-light;
}
.datestart {
  display: flex;
}
.gorecord {
  color: $font-color-light;
  font-size: $font-sm;
  text-align: center;
}
.moneyunit {
  font-size: 14px;
  color: $font-color-light;
}
.record-content,
.v-notice {
  display: flex;
}
.tips {
  margin-top: 15rpx;
  color: $uni-color-error;
}
.money {
  font-size: 38px;
  margin: 20rpx;
  color: $base-color;
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
  height: 25rpx !important;
}
.userinfo .time,
.userinfo .username {
  font-size: 12px;
  color: $font-color-light;
}
.feedate {
  text-align: center;
}
.title {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  margin-left: 80rpx;
}
.v-yufu {
  text-align: center;
  position: absolute;
  right: 15rpx;
}
.paybtn {
  border-radius: 40rpx;
  background-color: $base-color;
  color: white;
}
.yufu {
  width: 100rpx;
  height: 100rpx;
}
.roomname {
  margin-left: 80rpx;
  color: $font-color-light;
}
.rf-order-item {
  height: 100%;
  flex: 1;  
}
.uni-swiper-item {
  height: auto;
}
.unpayed-items{
  margin-top: 15rpx ;
  padding-bottom: 15rpx;
}
</style>
