<template>
	<view class="rf-create-order">
		<view class="order" >
			<!--选择地址-->
			<navigator url="/pages/user/address/address?source=1" class="rf-address-section">
				<view class="order-content">
					<i class="iconfont iconshouhuodizhi"></i>
					<view v-if="addressData" class="cen">
						<view class="top">
							<text class="name">{{addressData.receiver}}</text>
							<text class="mobile">{{addressData.phone}}</text>
						</view>
						<text class="address">{{ addressData.detail}}</text>
					</view>
					<view class="no-default-address" v-else>
						请选择服务地址
					</view>
					<i class="iconfont iconyou"></i>
				</view>
				<image class="a-bg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"></image>
			</navigator>
			<!--商品列表-->
			<view class="rf-goods-section">
				<view class="g-header b-b">
					<!--<image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image>-->
					<text class="name">阿姨信息</text>
				</view>
				<!-- 商品列表 -->
				<view class="g-item" v-for="(item, index) in products" :key="index" @tap="navTo(`/pages/product/product?id=${item.product_id}`)">
					<rf-image :src="item.product_picture"></rf-image>
					<view class="right">
						<text class="title clamp in2line">{{ item.product_name }}</text>
						<text class="spec">{{ item.rulename  }} * {{ item.num }}</text>
						<view class="price-box">
							<text class="price base-color">$ {{item.product_money}}</text>
							<text class="number"></text>
						</view>
					</view>
				</view>
			</view>
		 
			<!-- 金额明细 -->
			<view class="yt-list">
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">总金额</text>
					<text class="cell-tip red">${{ totalmoney }}</text>
				</view>
				  
				<view class="yt-list-cell desc-cell">
					<text class="cell-tit clamp">备注</text>
					<input class="desc" type="text" v-model="remark" placeholder="请填写备注信息" placeholder-class="placeholder" />
				</view>
			</view>
			<!-- 底部 -->
			<view class="footer">
				<view class="price-content in1line">
					<text>实付款</text>
					<text class="price-tip">$</text>
					<text class="price">{{totalmoney}}</text>
				</view>
	<!--			orderDetail.preview.point-->
				<button class="submit" @tap="submit" :disabled="btnLoading" :loading="btnLoading" >
					提交订单
				</button>
				 
			</view>
		</view>
	 
		<!--页面加载动画-->
    <rf-loading v-if="loading"></rf-loading>
		  
	</view>
</template>

<script>
	import {cartItemCount, orderCreate, orderFreightFee, orderPreview} from '@/api/product';
	import rfPicker from '@/components/rf-picker';
	import moment from '@/common/moment';
	import rfNoData from '@/components/rf-no-data'
	export default {
		components: {
			rfPicker,
			rfNoData
		},
		data() {
			return {
				totalmoney: 0, //总金额
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				orderDetail: {"realname":"张阿姨"},
				pointExchangeType: [],
				loadingType: 'more', //加载更多状态
				pickerShippingType: [
					{ label: '物流配送', value: 1 },
					{ label: '买家自提', value: 2 }
				],
				btnLoading: false,
				currentShippingType: {},
				currentCompany: {},
				currentPickupPoint: {},
				cartIds: null,
				addressData: null,
				couponItem: {},
				pointConfig: {},
				product: null, 
				isUsePoint: false,
				isUsePointDisabled: false,
				data: {},
				userInfo: {},
				use_point: 0,
				invoiceContent: null,
				loading: true,
				errorInfo: '',
				buyerMessage: '',
				remark : "",
				products : [ ]
			}
		},
		computed: {
	    // 计算商品金额
			amountGoods(){
				return 2000;
				let amount = 0;
				this.orderDetail.products && this.orderDetail.products.forEach(item => {
					amount += parseInt(item.num, 10) * parseFloat(item.price)
				});
				return this.floor(amount);
			},
	     
	    // 计算实付金额
			realAmount(){
				return 100;
				const realAmount = this.amountGoods - this.discountAmount  - (this.isUsePoint ? this.maxUsePointFee : 0)
				return (this.floor(   realAmount) || 0).toFixed(2);
			},
	    
	    // 计算可用积分
			maxUsePoint() {
				return 0;
				return this.orderDetail.max_use_point > uni.getStorageSync('userInfo').account.user_integral
						? uni.getStorageSync('userInfo').account.user_integral : this.orderDetail.max_use_point;
			},
	    // 计算最大积分可抵扣金额
			maxUsePointFee() {
				return 30;
				return this.maxUsePoint * this.pointConfig.convert_rate;
			}
		},
		 
		onShow() {
			 
		},
		onLoad(options){ 
			this.initData(options);
		},
		methods: {
	    handleInvoiceChange (val) {
        this.invoiceContent = val;
	    },
	    navTo(route) {
        this.$mRouter.push({route});
	    },
			 
			// 向下取整
			floor(val) {
				return Math.floor(val * 100) / 100;
			},
			// 是否使用积分抵扣
			handleIsUsePoint () {
				if (this.isUsePoint) {
			    this.isUsePoint = false;
          this.use_point = 0;
				} else {
			    this.isUsePoint = true;
          this.use_point = this.maxUsePoint;
				}
			}, 
			// 确定选择自提点
			async onPickupPointConfirm(e) {
				e.value = e.value[0]
					this.currentPickupPoint = e;
							if (this.currentPickupPoint) {
								this.shippingMoney = parseFloat(this.orderDetail.pickup_point_config.pickup_point_fee) || 0;
								return;
							}
				},
			 
			// 数据初始化
			async initData(options) {
				
				this.data = await JSON.parse(options.data);
				this.products = []
				this.products.push(
					{
						"product_picture":this.data.product_picture,
						"product_name" :this.data.product_name,
						"rulename" : this.data.rulename,
						"ruleid" :this.data.ruleid,
						"num" : this.data.num,
						"product_money" : this.data.product_money,
				})
                this.userInfo = uni.getStorageSync('userInfo');
				this.loading = false;
				this.totalmoney =  this.data.num * this.data.product_money
			}, 
			// 显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type){
				this.payType = type;
			},
			async submit() {
				const params = {};
				params.buyer_message = this.buyerMessage;
				if (this.addressData && this.addressData.id) {
					params.address_id = this.addressData.id;
				} else {
			    this.$mHelper.toast('请选择服务地址');
					return;
				}
				params.address_id = this.addressData.id
				params.remark =  this.remark 
				params.items = []
				params.items.push(
					{"ruleid":this.data.ruleid,"num":this.data.num 	}
				)
				params.items = JSON.stringify(params.items)
				console.log(JSON.stringify(params))
				this.btnLoading = true;
				await this.$http.post(`${orderCreate}`, {
					address_id:params.address_id,
					remark:params.remark, 
					items: JSON.stringify([{"ruleid":this.data.ruleid,"num":this.data.num 	}])
				}).then(r => {
						const data = {}
						if (parseInt(r.status, 10) === 1) {
							uni.redirectTo({
								url: '/pages/user/money/success'
								});
							} 
						else {
							uni.redirectTo({
								url: `/pages/user/money/pay?id=${r.id}`
							})
						}
					}).catch((r) => { 
						this.btnLoading = false;
					})
				},
     
			stopPrevent(){
			},
			selectCoupon(item){
				if (this.amountGoods < item.at_least) {
			    this.$mHelper.toast('不满足优惠券使用条件~');
					return;
				}
				this.maskState = 0;
				this.couponItem = item;
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}
	.order {
		padding-bottom: 100upx;
		 
	}
	.top{
		.name{
			display: block;
			width: 600rpx; 
			overflow: hidden;
			text-overflow:ellipsis;
		}
	}
	.address
	{
		display: block;
		width: 600rpx; 
		overflow: hidden;
		text-overflow:ellipsis;
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

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
			max-width: 70%;
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
			.invoice {
				display: flex;
				justify-content: space-between;
				.iconshanchu4 {
					font-size: $font-base;
					color: $base-color;
					margin-left: 4upx;
				}
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

	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 98;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8upx;
		}
		.price{
			font-size: $font-lg;
			color: $base-color;
		}
		.disabled {
			background-color: $border-color-dark;
		}
	}

	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 99;
		transition: .3s;
		.mask-content{
			width: 100%;
			max-height: 70vh;
			min-height: 16vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
      .no-coupon {
        display: flex;
 	      justify-content: center;	/* 水平居中 */
        line-height: 16vh;
      }
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);

			.mask-content{
				transform: translateY(0);
			}
		}
	}

	.rf-no-data {
		height: calc(100vh - 90upx);
	}
</style>
