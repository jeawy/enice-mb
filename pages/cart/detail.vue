<template>
	<view class="rf-order-detail">
		<!-- hm订单详情 -->
		<view class="order-detail" v-if="orderDetail">
			<view class="rf-goods-section">
				<view class="g-header b-b">
					<text class="name in1line"
						>订单号：{{ orderDetail.no }}</text
					>
					<text class="name red">{{
						orderDetail.status | orderStatusFilter
					}}</text>
				</view>
				<!-- 商品列表 -->
				<view
					class="g-item"
					v-for="(item, index) in orderDetail.rules"
					:key="index"
					@tap="navTo(`/pages/product/product?id=${item.aunty_id}`)"
				>
					<rf-image
						:src="
							'https://property.chidict.com' + item.thumbnail_portait
						"
					/>
					<view class="right">
						<text class="title clamp in2line">{{
							item.username
						}}</text>
						<text class="spec"
							>{{ item.rule_title }} * {{ item.num }}</text
						>
						<view class="price-box">
							<text class="price-wrapper">
								<text class="price base-color"
									>￥ {{ item.price }}</text
								>
							</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 金额明细 -->
			<view class="yt-list">
				<view class="yt-list-cell b-b" v-if="orderDetail.invoice">
					<text class="cell-tit clamp">开具发票</text>
					<text class="cell-tip red in1line">
						<text>
							{{
								`电子发票 -${
									parseInt(
										orderDetail.invoice &&
											orderDetail.invoice.type,
										10
									) === 1
										? "公司"
										: "个人"
								}-${
									orderDetail.invoice &&
									orderDetail.invoice.title
								} [ ${
									orderDetail.invoice &&
									orderDetail.invoice.content
								} ]`
							}}
						</text>
					</text>
				</view>
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">订单金额</text>
					<text class="cell-tip red"
						>￥ {{ orderDetail.money }}</text
					>
				</view>
			</view>
			<view class="yt-list" v-if="orderDetail.status">
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">支付方式</text>
					<text class="cell-tip">{{
						orderDetail.status | payWayFormmat
					}}</text>
				</view>
			</view>
			<view class="yt-list">
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">备注</text>
					<text class="cell-tip">{{ orderDetail.remark }}</text>
				</view>
			</view>
			<!-- 底部 -->
			<view class="footer" v-if="orderDetail.status != 1">
				<button
					class="action-btn recom"
					v-if="orderDetail.status == 2"
					@tap="handleOrderOperation(orderDetail, 'delivery')"
				>
					确认收货
				</button>
				<button
					class="action-btn recom"
					v-if="orderDetail.status == 3 || orderDetail.status == 4"
					@tap="handleOrderOperation(orderDetail, 'evaluation')"
				>
					批量评价
				</button>
				<button
					class="action-btn recom"
					v-if="orderDetail.status == 0"
					@tap="navTo(`/pages/user/money/pay?id=${orderDetail.id}`)"
				>
					立即支付
				</button>
				<button
					class="action-btn recom"
					v-if="orderDetail.status == -4"
					@tap="handleOrderOperation(orderDetail, 'delete')"
				>
					删除订单
				</button>
				<button
					class="action-btn"
					v-if="orderDetail.status == 0"
					@tap="handleOrderOperation(orderDetail, 'close')"
				>
					取消订单
				</button>
			</view>
		</view>

		<!-- 404页面 -->
		<view v-else-if="!loading">
			<rf-no-data class="rf-no-data" :custom="true">
				<view class="title" @tap="getOrderDetail">
					{{ errInfo || "订单不存在" }}
				</view>
				<view @tap="getOrderDetail" slot="refresh" class="spec-color"
					>重新加载</view
				>
			</rf-no-data>
		</view>
		<!--页面加载动画-->
		<rf-loading v-if="loading"></rf-loading>
	</view>
</template>

<script>
import moment from "@/common/moment";
import rfNoData from "@/components/rf-no-data";
import { orderClose } from "@/api/product";
import {
	orderDetail,
	closeOrderRefundApply,
	orderCustomerRefundClose,
	orderDelete,
	orderTakeDelivery,
} from "@/api/userInfo";

export default {
	components: {
		rfNoData,
	},
	data() {
		return {
			orderDetail: {},
			loading: true,
			errInfo: null,
			order_id: null,
		};
	},
	filters: {
		// 支付方式格式化
		payWayFormmat(key) {
			return { zhifubao: "支付宝", weixin: "微信" }[key] || null;
		}, 
		orderStatusFilter(orderStatus) {
			return ["已提交未支付", "已支付/进行中", "已完成", "已评价"][
				orderStatus
			];
		},
	},
	onLoad(options) {
		this.order_id = options.id;
	},
	onShow() {
		this.getOrderDetail();
	},
	methods: {
		// 获取订单详情
		getOrderDetail() {
			this.$http
				.get(`${orderDetail}`, {
					no: this.order_id,
				})
				.then(({ msg }) => {
					this.orderDetail = msg;
				})
				.catch((err) => {
					this.errInfo = err;
				})
				.finally(() => {
					this.loading = false;
				});
		},

		navTo(route) {
			this.$mRouter.push({ route });
		},
		navToEvaluation(item, type) {
			this.$mRouter.push({
				route: `/pages/order/evaluation/evaluation?data=${JSON.stringify(
					item
				)}&type=${type}`,
			});
		},
		navToRefund(item, type) {
			this.$mRouter.push({
				route: `/pages/order/refund/refund?data=${JSON.stringify(
					item
				)}&refundType=${type}`,
			});
		},
		navToShippingReturn(item) {
			this.$mRouter.push({
				route: `/pages/order/shipping/return?data=${JSON.stringify(
					item
				)}`,
			});
		},
		// 订单操作
		handleOrderOperation(item, type, refund_type) {
			switch (type) {
				case "detail": // 订单详情
					this.navTo(`/pages/order/detail?id=${item.id}`);
					break;
				case "evaluation": // 我要评价
					this.navTo(
						`/pages/order/evaluation/evaluation?order_id=${item.id}`
					);
					break;
				case "close": // 取消订单
					this.handleOrderClose(item.id);
					break;
				case "delete": // 删除订单
					this.handleOrderDelete(item.id);
					break;
				case "shipping": // 查看物流
					this.navTo(`/pages/order/shipping/shipping?id=${item.id}`);
					break;
				case "delivery": // 确认收货
					this.handleOrderTakeDelivery(item.id);
					break;
			}
		},
		// 取消订单
		async handleOrderClose(id) {
			await this.$http
				.get(`${orderClose}`, {
					id,
				})
				.then(() => {
					this.$mHelper.toast("订单取消成功");
					this.getOrderDetail();
				});
		},
		// 删除已关闭订单
		async handleOrderDelete(id) {
			await this.$http.delete(`${orderDelete}?id=${id}`, {}).then(() => {
				this.$mHelper.toast("订单删除成功");
				this.$mRouter.back();
			});
		},
		// 确认收货
		async handleOrderTakeDelivery(id) {
			await this.$http
				.get(`${orderTakeDelivery}`, {
					id,
				})
				.then(() => {
					this.$mHelper.toast("确认收货成功");
					this.getOrderDetail();
				});
		},
		// 产品退款/退货关闭申请
		async handleCloseOrderRefundApply(status, id) {
			let closeOrderApi = closeOrderRefundApply;
			if (parseInt(status, 10) === 4) {
				closeOrderApi = orderCustomerRefundClose;
			}
			await this.$http
				.post(`${closeOrderApi}`, {
					id,
				})
				.then((r) => {
					this.$mHelper.toast("取消成功");
					this.getOrderDetail();
				});
		},
	},
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}

.order-detail {
	padding-bottom: 100upx;
}

.rf-goods-section {
	.g-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.red {
			color: $base-color;
		}
	}

	.g-item {
		border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
	}

	.right {
		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $font-color-dark;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.05);

			.price-wrapper {
				margin-bottom: 10upx;
				flex: 1;

				.price {
					font-size: $font-sm;
					margin-bottom: 4upx;
				}

				.number {
					font-size: $font-sm;
					color: $font-color-base;
					margin-left: $font-sm;
				}
			}

			.status {
				font-size: 24upx;
				margin-left: $spacing-sm;
				color: $base-color;
			}

			.spec-color {
				color: $font-color-spec;
			}
		}
	}
}
.btn-box {
	.action-btn {
		font-size: $font-sm;
		padding: 0 $spacing-base;
		text-align: center;
		height: 48upx;
		line-height: 48upx;
	}
}
.yt-list {
	margin-top: 16upx;
	background: #fff;

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}
		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
}

.uni-timeline {
	padding: $spacing-lg;
	background-color: $color-white;
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 98;
	width: 100%;
	height: 100upx;
	background-color: $color-white;
	color: $font-color-base;
	padding-right: $spacing-sm;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}
.action-btn {
	margin: $spacing-base $spacing-sm;
	float: right;
	padding: 0 $spacing-lg;
	text-align: center;
	height: 60upx;
	line-height: 60upx;
	font-size: $font-sm;
	color: $font-color-dark;
	background: #fff;
	border-radius: 100px;
	border: 1px solid rgba(0, 0, 0, 0.05);
	&:after {
		border-radius: 100px;
	}
	&.recom {
		background: #fff9f9;
		color: $base-color;
		&:after {
			border-color: #f7bcc8;
		}
	}
}
.rf-no-data {
	height: calc(100vh - 90upx);
}
</style>
