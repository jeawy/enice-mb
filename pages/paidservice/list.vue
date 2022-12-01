<template>
  <view class="v-main" :style="`min-height:`+screenHeight + `rpx`">
    <view class="line">
      <view
        class="category"
        v-for="(item, index) in categories"
        :key="item.id"
		@tap="getCategoryItems(index)"
        :style="`background-color:` + item.backgroundcolor"
      >
        <image :src="baseAppUrl + item.imageurl" class="categoryimg" />
        <br />
        <text class="categorytext">{{ item.text }}</text>
      </view>
    </view>
    <view class="itemtable">
      <view class="top">
        <view class="categoryholder"
		:style="`background-color:` + currentCategory.backgroundcolor"
		> 
          <image :src="baseAppUrl + currentCategory.imageurl" 
		  class="categoryimgactive" />
          <br />
          <text class="categorytext">{{currentCategory.text}}</text>
        </view>
      </view>
      <view class="table">
		<view class="empty" v-if="services.length == 0">
			<image :src="baseAppUrl + `empty.png`" 
		  class="serviceempty" />
          <br />
          <text class="emptytext">无数据</text>
		</view>
        <view class="row" v-for="(item, index) in services" :key="item.uuid">
          <view class="left">
            <view class="title">{{ item.title }}</view>
			<view class="bottom">
				<view class="money">{{ item.money }}</view>
				<view class="unit">元/{{ item.unit }}</view>
			 </view>
          </view> 
		  <yp-number-box  
		  class="number"
		  @change="numberChange" 
		  :index="index" 
		  :min="0" :max="9" />
          
        </view>
      </view>
      <view class="detail">
        <view>1、这是物业提供的职责范围之外的服务</view>
        <view>2、服务费用不包含材料费，请自备材料</view>
        <view>3、最终解释权归物业所有</view>
      </view>
      <button class="btn-add-new" @tap="pay" :disabled="btndisabled">支付</button>
    </view>
  </view>
</template>

<script>
import { postPaidOrder, getPaidservice } from "@/api/paidservice";
import ypNumberBox from "@/components/yp-number-box/yp-number-box.vue"
export default {
  data() {
	 
    return {
		newvalue:0,
		btndisabled:false,
      services: [],
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      currentCategory: {
        id: 0,
        imageurl: "wujin.png",
        backgroundcolor: "#2ED586",
        text: "五金类",
      },
      categories: [
		  {
        id: 0,
        imageurl: "wujin.png",
        backgroundcolor: "#2ED586",
        text: "五金类",
      },
        {
          id: 1,
          imageurl: "chufang.png",
          backgroundcolor: "#85bda6",
          text: "厨卫类",
        },
        {
          id: 2,
          imageurl: "jiadian.png",
          backgroundcolor: "#ff4b44",
          text: "电器类",
        },
        {
          id: 3,
          imageurl: "gongshui.png",
          backgroundcolor: "#91c0d2",
          text: "供排水",
        },
        {
          id: 4,
          imageurl: "shangmen.png",
          backgroundcolor: "#fd8a80",
          text: "上门服务",
        },
        {
          id: 5,
          imageurl: "qit.png",
          backgroundcolor: "#36909e",
          text: "其他",
        },
      ],
      communityuuid: "",
	  screenHeight:900
    };
  },
   components: {ypNumberBox},
  onShow() {
    this.communityuuid = uni.getStorageSync("communityuuid");
    this.getList();
  },
  onLoad() {
    var that = this;
    uni.getSystemInfo({
      success: function (res) {
        that.screenHeight = res.screenHeight + 450; 
      },
    });
  },
  methods: {
	  numberChange(  value ){   
		  this.services[value[0]].number = value[1] 
	  },
	  pay(){ 
		let data = {
			items : JSON.stringify(this.services)
		}
		uni.showLoading({
			title:"请稍后.." 
		})
		postPaidOrder(data).then((res)=>{
			if (res.status == 0){ 
				this.$mRouter.push({
					route:`/pages/user/money/pay?bills=${JSON.stringify(res.msg.bills)}&billtype=0`
				}) 
			}
			else{
                uni.showToast({
					title:""
				})
			}
		}).finally((res)=>{
			uni.hideLoading();
		})
	  },
	getCategoryItems(index){ 
		this.currentCategory = this.categories[index]
		this.getList() 
	},
    getList() {
      let params = {
        communityuuid: this.communityuuid,
        category: this.currentCategory.id,
      };
      getPaidservice(params).then((res) => { 
        if (res.status == 0) {
          this.services = res.msg;
		  if (this.services.length == 0 ){
			  this.btndisabled = true
		  }
		  else{
			  this.btndisabled = false 
		  }
        } else {
          uni.showToast({
            icon: "error",
            title: res.msg,
          });
        }
      });
    },
    detail(id) {
      uni.navigateTo({
        url: "../repair/detail?uuid=" + id,
      });
    },
  },
};
</script>

<style lang="scss" scoped src="./list.scss"> 
</style> 
