<template>
	<view class="swiper-item">
		<scroll-view class="list-scroll-content" scroll-y>
			<view class="order-list" v-if="orderList.length > 0">
				<view
					class="order-item"
					v-for="(item, index) in orderList"
					:key="index"
					@tap="navTo('/pages/cart/detail?id='+item.no)"
				>
					<image
						class="order-item-img"
						:src="imgsrc + item.rules[0].thumbnail_portait"
					></image>
					<view class="order-item-name">{{
						item.rules[0].username
					}}</view>
					<view class="order-item-time">{{
						dateTimeFormat(item.date)
					}}</view>
					<view class="order-item-content"
						>{{ item.rules[0].rule_title }}*{{
							item.rules[0].num
						}}</view
					>
					<!--
                    <view class="order-item-ispay" 
                        :class="{activeColor: productList[index].order_status==0}">
                        {{orderStatus[index]}}
                    </view>
					-->
					<view class="order-item-money"
						>${{ item.rules[0].price }}</view
					>
					<view class="order-item-num">x{{ item.rules[0].num }}</view>
					<view class="order-item-price">
						总价
						<span style="color: #ff8d0e; font-size: 20rpx"
							>${{
								item.rules[0].price * item.rules[0].num
							}}</span
						>
					</view>

					<view class="order-item-side">
						<view class="order-no">订单号 {{ item.no }}</view>
						<view class="order-btns">
							<view class="btn" 
								  @tap.stop="() => openReview(item.no)" 
								  v-if="item.status===1">评价</view>
							<view
								class="btn"
								v-if="item.status == 0"
								@tap.stop="
									navTo(
										`/pages/user/money/pay?id=${item.id}&no=${item.no}`
									)
								"
								>支付</view
							>
							<view class="btn" @tap.stop="deleteOrder(item.id)"
								>删除订单</view
							>
						</view>
						<!--
						<view @tap="navTo('/pages/order/evaluation/evaluation')">
							<view v-if="item.is_evaluate==0">
								<view class="btn">发表评论</view>
							</view>
							<view v-else>
								<view class="btn">已评论</view>
							</view>
						</view>
						-->
					</view>
				</view>
			</view>
			<view class="process-order" v-else>
				<image
					class="process-img"
					src="/static/order/order.svg"
				></image>
				<view class="process-text">您还没有相关的订单哦</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { orderDelete } from "@/api/userInfo";
import dayjs from "dayjs";
export default { 
	props: ["orderList"],
	data() {
		return {
			imgsrc: this.$mStore.state.BaseUrl,
			hasLogin: true,
		};
	},
	 
	methods: {
		dateTimeFormat(date) {
			if (date) {
				date *= 1000;
				return dayjs(date).format("YYYY/MM/DD HH:mm:ss");
			} else {
				return "";
			}
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
		openReview(no) { 
		}
	},
};
</script>

<style lang="scss" scoped>
.uni-swiper-item {
	height: auto;
}

.list-scroll-content {
	height: 100vh;
	padding-top: 178rpx; //设置距离顶部的距离
}

/*订单列表*/
.order-list {
	// margin-top:4rpx;
	// margin-top:216rpx;
	margin-left: 30rpx;

	.order-item {
		margin-bottom: 20rpx;
		height: 280rpx;
		width: 690rpx;
		background-color: #ffffff;
		border-radius: 8rpx;
		font-family: Tensentype MingSongJ-W4;
		font-style: normal;
		font-weight: normal;

		.order-item-img {
			position: absolute;
			border-radius: 8rpx;
			width: 120rpx;
			height: 120rpx;
			margin-top: 24rpx;
			margin-left: 10rpx;
		}

		.order-item-name {
			position: absolute;
			margin-left: 150rpx;
			margin-top: 24rpx;
			height: 28rpx;
			font-size: 24rpx;
			color: #515151;
		}

		.order-item-time {
			position: absolute;
			margin-top: 24rpx;
			right: 44rpx;
			height: 28rpx;
			font-size: 24rpx;
			color: #515151;
		}

		.order-item-content {
			position: absolute;
			height: 24rpx;
			margin-left: 150rpx;
			margin-top: 72rpx;
			font-size: 20rpx;
			color: #888888;
		}

		.order-item-ispay {
			position: absolute;
			height: 22rpx;
			// right: 38rpx;
			right: 44rpx;
			margin-top: 30rpx;
			font-size: 18rpx;
			color: #ff8d0e;
		}

		.activeColor {
			color: #ff480e;
		}

		.order-item-money {
			position: absolute;
			height: 24rpx;
			right: 44rpx;
			margin-top: 72rpx;
			font-size: 20rpx;
			color: #515151;
		}

		.order-item-num {
			position: absolute;
			width: 26rpx;
			height: 24rpx;
			right: 38rpx;
			margin-top: 96rpx;
			font-size: 20rpx;
			color: #888888;
		}

		.order-item-price {
			position: absolute;
			height: 28rpx;
			right: 40rpx;
			margin-top: 140rpx;
			font-size: 24rpx;
			color: #515151;
		}

		.order-item-side {
			width: 100%;
			position: absolute;
			color: #ff8d0e;
			display: flex;
			// flex-wrap: wrap;
			margin-top: 188rpx;
			padding: 0 10rpx;
			// padding-left: 258rpx;
			// right: 40rpx;
			align-content: center;

			.order-no {
				font-size: 24rpx;
				margin-top: 10rpx;
			}

			.order-btns {
				position: absolute;
				right: 70rpx;

				.btn {
					font-size: 20rpx;
					margin-left: 20rpx;
					// float: right;
					display: inline-block;
					padding: 8rpx 22rpx;
					border: 2rpx solid #ff8d0e;
					box-sizing: border-box;
					border-radius: 4rpx;
				}
			}
		}
	}
}

/*进行中列表*/
.process-order {
	.process-img {
		width: 232rpx;
		height: 284rpx;
		margin-left: 34.67%;
		margin-top: 100rpx;
	}

	.process-text {
		margin-left: 36.8%;
		margin-top: 28rpx;
		font-size: 20rpx;
		line-height: 24rpx;
		color: #888888;
	}

	.process-tip {
		margin-left: 36.8%;
		margin-top: 100rpx;
		margin-bottom: 20rpx;
		font-size: 20rpx;
		line-height: 24rpx;
		color: #363636;
	}
}
</style>
