<template>
<!-- 有偿服务订单 -->
	<view class="swiper-item">
		<scroll-view class="list-scroll-content" scroll-y>
			<view class="order-list" v-if="paidserviceOrderList.length > 0">
				<view
					class="order-item"
					v-for="(item, index) in paidserviceOrderList"
					:key="index" 
				>
					<image
							class="alipay-img"
							:src="item.status | statusImageFilter(baseAppUrl)"
						></image> 
					<view class="firstline" >
						<text class="billno">订单号:{{item.billno}}</text>
						
					</view> 
					<view class="twoline" >
						<view  class="servicename">{{item.subject}}</view>
						<view class="serviceprice">单价:{{item.servicenprice }}元/{{item.servicenunit }}</view>
						<view class="plus">x  </view>
						<view class="number"> 数量:{{item.number }}</view>
					</view> 
					<view class="threeline" >
						<view class="totalmoenytxt" >总金额: </view>
						<view class="totalmoeny" > {{    item.money }}</view>
						<view class="unit">元</view>  
						<button type="default" v-if="item.status == 0" class="paybtn" @tap="pay(item.billno)">支付</button>
					</view> 
					<view class="forthline" >
						<view class="date">{{item.date | time}}</view> 
						<uni-rate class="rate" :size="18" :value="item.score" @change="rateChange($event, item.uuid)" />
						<view class="v-deleteimg" @tap="deletePaidservice(index,item.uuid)">
						<image
							class="deleteimg"
							:src="baseAppUrl+`shanchu.png`"
							
						></image> 
						</view>
					</view> 
					
				
				</view>
			</view>
			
		</scroll-view>
	</view>
</template>

<script>
import { orderDelete } from "@/api/userInfo"; 
import { postPaidOrder } from "@/api/paidservice"; 

export default { 
	props: ["paidserviceOrderList", "baseAppUrl"],
	data() {
		return { 
			hasLogin: true, 
		};
	},
	filters:{
        statusFilter(status){
			let statustxt = "未支付"
			if(status == 2){
				statustxt = "已支付" 
			}
			else if (status == 4 ){
				statustxt = "异常订单" 
			}
			return statustxt 
		},
		statusImageFilter(status, baseAppUrl){ 
			let statusimsg = "pay/weizhifu.png"
			if(status == 2){
				statusimsg = "pay/yizhifu.png" 
			}
			else if (status == 4 ){
				statusimsg = "pay/yichang.png" 
			}
			return  baseAppUrl+ statusimsg 
		}
	}, 
	methods: {
		rateChange(e, orderuuid){ 
			let data ={
				method:"put",
				score:e.value,
				uuid:orderuuid
			}
			postPaidOrder(data).then((res)=>{
				if (res.status == 0 ){
					uni.showToast({
						title:"评价成功",
						icon:"success"
					})
				}
				else{
					uni.showToast({
						title:res.msg,
						icon:"error"
					})
				}
			})

		},
		pay(billno){  
	 let bills = [billno]
		this.$mRouter.push({
					route:`/pages/user/money/pay?bills=${JSON.stringify(bills)}&billtype=0`
				})  
	  },
		 deletePaidservice(index,uuid){ 
				var that = this;
				uni.showModal({
					title: '',
					content: '您好，确定要删除该服务订单吗？',
					confirmText: '删除',
					confirmColor: '#FD5000',
					success: function(res) {
						if (res.confirm) {
							const data = {
								method: 'delete',
								uuids: uuid
							}
							postPaidOrder(data).then((res) => {
								if (res.status == 0) {
									uni.showToast({
										icon: "success",
										title: '删除成功!',
										duration: 3000
									});
									that.paidserviceOrderList.splice(index, 1);
								} else { 
								} 
							});
						} else if (res.cancel) { 
						}
					}
				});
			},
		deleteOrder(id) {
			uni.showModal({
				content: "确定要删除该订单吗",
				success: (e) => {
					if (e.confirm) {
						this.$http
							.post(`${orderDelete}`, {
								ids: id,
								method: "delete",
							})
							.then((r) => {
								if (r.status === 0) {
									this.$mHelper.toast("订单删除成功");
									setTimeout(() => {
										// 调用父组件的方法
										this.$emit("getOrderList");
									}, 500);
								} else {
									this.$mHelper.toast("订单删除失败");
								}
							});
					}
				},
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
	},
};
</script>

<style lang="scss" scoped> 
  .swiper-item{
	  margin-top: 10rpx;
	  background-color:white;
	 
	  .order-list{
		  .order-item{
			  color:$font-color-light;
			  border-bottom: 1px solid $border-color-light;
			  margin:35rpx 25rpx;
				 
				.alipay-img{
					width:100rpx;
					height:100rpx;
					position: absolute; 
					right: 15rpx;
				}
				.firstline{
				 
					.billno{
						color:$base-color;
						font-size: $font-lg;
						
					}

				}
				
				
				.twoline{
					display: flex;
					.servicename{
						width: 260rpx;
					}
					.plus{
						margin:0rpx 15rpx;
						color:$base-color;
					}
					 
				}
				.threeline{
					display: flex; 
					.totalmoenytxt, .unit{
						margin-top:30rpx;
					}
					.totalmoeny{
					font-size: 30px;
					color:$base-color;
					margin:0 15rpx;
					
				    }
					.paybtn{
						border-radius: 40rpx;
						background-color:$base-color;
						color:white; 
					}
				}   
				.forthline{
					display: flex;
					justify-content:space-between;
					.date{
						margin-top:20rpx;
						color:$font-color-light;
					}
					.deleteimg{
						text-align: right; 
						margin-bottom: 5rpx;
						width:70rpx;
						height:70rpx; 
					}
					.rate{
						margin-top:20rpx;
					}
				} 
		  } 
	  }
	  .process-order{
		  .process-img{

		  }
	  }
  }
</style>
