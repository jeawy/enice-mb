<template>
	<view class="container">
		<view class="tui-order-header">
			<image :src="webURL+'img_detail_bg.png'" class="tui-img-bg"></image>
			<view class="tui-header-content">
				<view>
					<view class="tui-status-text">{{getStatusText(status)}}</view>
					<view class="tui-reason"><text class="tui-reason-text">{{getReason(status)}}</text>
						<tui-countdown :time="1800" color="rgba(254,254,254,0.75)" colonColor="rgba(254,254,254,0.75)" bcolor="transparent"
						 bgcolor="transparent" v-if="status===1"></tui-countdown>
					</view>
				</view>
				<image :src="getImg(status)" class="tui-status-img"></image>
			</view>
		</view>
		<tui-list-cell :hover="false" bgcolor="#fefefe" v-if="status===3||status===4">
			<view class="tui-flex-box">
				<image :src="webURL+'img_order_logistics3x.png'" class="tui-icon-img"></image>
				<view class="tui-logistics">
					<view v-if="express_company!=null" class="tui-logistics-text">快递公司：{{express_company}}</view>
					<view v-else class="tui-logistics-text">快递公司：中通快递</view>
					<view v-if="express_number!=null" class="tui-logistics-time">快递单号：{{express_number}}</view>
					<view v-else class="tui-logistics-time">快递单号：73127445518987</view>
				</view>
			</view>
		</tui-list-cell>
		<tui-list-cell :last="false" :hover="false">
			<view class="tui-flex-box">
				<image :src="webURL+'img_order_address3x.png'" class="tui-icon-img1"></image>
				<view class="tui-addr">
					<view class="tui-addr-userinfo">{{receiver}}<text class="tui-addr-tel">{{phone}}</text></view>
					<view class="tui-addr-text">{{address}}</view>
				</view>
			</view>
		</tui-list-cell>

		<view class="tui-order-item">
			<tui-list-cell :hover="false" :lineLeft="false">
				<view class="tui-goods-title">
					商品信息
				</view>
			</tui-list-cell>
			<tui-list-cell padding="0">
				<view class="tui-goods-item">
					<image :src="imageUrl + picture" class="tui-goods-img" @tap="previewImage()"></image>
					<view class="tui-goods-center">
						<view class="tui-goods-name">{{specifications}}</view>
						<view class="tui-goods-attr">{{content}}</view>
					</view>
					<view class="tui-price-right">
						<view class="pricecontainer">
							<image class="icon" src="/static/icons/jifen.png"></image>
							<view class="price-right">{{coin}}</view>
						</view>
						<view class="pricecontainer">
							<image class="price-img" src="/static/image/mall/currency/close.png"></image>
							<view class="price-num">{{number}}</view>
						</view>
					</view>
				</view>
			</tui-list-cell>
			<view class="tui-goods-info">
				<view class="tui-price-flex tui-size32 tui-pbtm20">
					<view class="tui-flex-shrink">合计</view>
					<view class="tui-goods-price">
						<image class="icon" src="/static/icons/jifen.png"></image>
						<view>{{coin}}</view>
					</view>
				</view>
				<view class="tui-price-flex tui-size32">
					<view class="tui-flex-shrink">实付款</view>
					<view class="tui-goods-price">
						<image class="icon" src="/static/icons/jifen.png"></image>
						<view class="tui-primary-color">{{coin}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="tui-order-info" v-for="(item,index) in orderlist" :key="index">
			<tui-list-cell :hover="false">
				<view class="tui-order-title">
					订单信息
				</view>
			</tui-list-cell>
			<view class="tui-order-content">
				<view class="tui-order-flex">
					<view class="tui-item-title">订单号:</view>
					<view class="tui-item-content">{{item.order_number}}</view>
				</view>
				<!-- <view class="tui-order-flex">
					<view class="tui-item-title">物流单号:</view>
					<view class="tui-item-content">{{item.express_number}}</view>
				</view> -->
				<view class="tui-order-flex">
					<view class="tui-item-title">创建时间:</view>
					<view class="tui-item-content">{{item.create_date| dateTimeFormat}}</view>
				</view>
				<view class="tui-order-flex">
					<view class="tui-item-title">付款时间:</view>
					<view class="tui-item-content">{{item.create_date| dateTimeFormat}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dayjs from "dayjs" 
	import tuiButton from "@/components/gift/button"
	import tuiCountdown from "@/components/gift/countdown"
	import tuiListCell from "@/components/gift/list-cell"
	import {
		ApiLookOrder,
		ApiGetOrder
	} from "@/api/giftcenter"
	export default {
		components: { 
			tuiButton,
			tuiCountdown,
			tuiListCell
		},
		data() {
			return {
				webURL: "https://www.thorui.cn/wx/static/images/mall/order/",
				//1-待付款 2-付款成功 3-待收货 4-订单已完成 5-交易关闭
				status: '',
				id: '',
				orderlist: [],
				imageUrl: '',
				current: '',
				express_company:'',
				express_number:'',
				receiver:'',
				phone:'',
				address:'',
				picture:'',
				specifications:'',
				content:'',
				coin:'',
				number:'',
				Image:[],
			}
		},
		onLoad: function(options) {
			this.id = options.id;
			this.current = options.currentTab;
			ApiLookOrder({
				id: this.id
			}).then(({
				data
			}) => {
				if (data.status == 0) {
					this.orderlist = [data.msg];
					this.imageUrl = this.$mStore.state.BaseUrl;
					this.express_company = this.orderlist[0].express_company;
					this.express_number = this.orderlist[0].express_number;
					this.receiver = this.orderlist[0].address.receiver;
					this.phone = this.orderlist[0].address.phone;
					this.address = this.orderlist[0].address.address;
					this.picture = this.orderlist[0].product.picture;
					this.specifications = this.orderlist[0].product.specifications;
					this.content = this.orderlist[0].product.content;
					this.coin = this.orderlist[0].coin;
					this.number = this.orderlist[0].number;
					this.Image.push(this.imageUrl + this.picture)
				}
			})
			if (this.current == 0) {
				ApiLookOrder({
					id: this.id
				}).then(({
					data
				}) => {
					if (data.status == 0) {
						this.status = data.msg.status + 1
					}
				})
			} else {
				ApiGetOrder({
					status_id: this.current - 1
				}).then(({
					data
				}) => {
					if (data.status == 0) {
						this.status = data.msg[0].status + 1
					}
				})
			}
		},
		methods: {
			getImg: function(status) {
				return this.webURL + ["img_order_payment3x.png", "img_order_send3x.png", "img_order_received3x.png",
					"img_order_signed3x.png", "img_order_closed3x.png"
				][status - 1]
			},
			getStatusText: function(status) {
				return ["等待您付款", "付款成功", "未收货", "订单已完成", "交易关闭"][status - 1]
			},
			getReason: function(status) {
				return ["剩余时间", "等待发货", "等待收货", "", "超时未付款，订单自动取消"][status - 1]
			},
			//点击查看订单大图
			previewImage: function() {
					uni.previewImage({
						current: this.Image[0],
						urls: this.Image,
					})
			},
		}
	} 
</script>

<style scoped>
	.container {
		padding: 0rpx;
	}

	.tui-order-header {
		width: 100%;
		height: 200rpx;
		position: relative;
	}

	.icon {
		width: 32.5rpx;
		height: 32.5rpx;
		display: inline-block;
		position:relative;
		left:-10rpx;
	}

	.tui-img-bg {
		width: 100%;
		height: 200rpx;
	}

	.tui-header-content {
		width: 100%;
		height: 200rpx;
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 70rpx;
		box-sizing: border-box;
	}

	.tui-status-text {
		font-size: 36rpx;
		line-height: 36rpx;
		color: #FEFEFE;
	}

	.tui-reason {
		font-size: 24rpx;
		line-height: 24rpx;
		color: rgba(254, 254, 254, 0.75);
		padding-top: 15rpx;
		display: flex;
		align-items: center;
	}

	.tui-reason-text {
		padding-right: 12rpx;
	}

	.tui-status-img {
		width: 80rpx;
		height: 80rpx;
		display: block;
	}

	.tui-flex-box {
		width: 100%;
		display: flex;
		align-items: center;
		height: 120rpx;
		position:relative;
	}

	.tui-icon-img {
		width: 28rpx;
		height: 28rpx;
		flex-shrink: 0;
		position:absolute;
		left:-3rpx;
		top:29rpx;
	}
    .tui-icon-img1{
		width: 28rpx;
		height: 28rpx;
		flex-shrink: 0;
		position:absolute;
		left:-3rpx;
		top:24rpx;
	}
	.tui-logistics {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 24rpx 0 35rpx;
		box-sizing: border-box;
	}

	.tui-logistics-text {
		font-size: 28rpx;
		line-height: 30rpx;
	}

	.tui-logistics-time {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 16rpx;
	}

	.tui-addr {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 35rpx;
		box-sizing: border-box;
	}

	.tui-addr-userinfo {
		font-size: 28rpx;
		line-height: 30rpx;
	}

	.tui-addr-text {
		font-size: 24rpx;
		line-height: 30rpx;
		padding-top: 16rpx;
	}

	.tui-addr-tel {
		padding-left: 40rpx;
	}

	.tui-order-item {
		margin-top: 10rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		line-height: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}


	.tui-goods-item {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		max-width: 310rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 20rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-price-right {
		text-align: right;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 15rpx;
	}

	.pricecontainer {
		position: relative;
		white-space: nowrap;
	}

	.price-right {
		display: inline-block;
		position: relative;
		top: 5rpx;
	}

	.price-icon {
		position: relative;
		top: -5rpx;
	}

	.price-num {
		position: relative;
		top: 20rpx;
		display: inline-block;
	}

	.price-img {
		width: 28rpx;
		height: 28rpx;
		display: inline-block;
		position: relative;
		top: 20rpx;
		left:-8rpx;
	}

	.tui-color-red {
		color: #DF5000;
		padding-right: 30rpx;
	}

	.tui-goods-price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 24rpx;
	}

	.tui-size-24 {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-price-large {
		font-size: 32rpx;
		line-height: 30rpx;
	}

	.tui-goods-info {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-price-flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-size24 {
		padding-bottom: 20rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #888;
	}

	.tui-size32 {
		font-size: 32rpx;
		line-height: 32rpx;
		font-weight: 500;
	}

	.tui-pbtm20 {
		padding-bottom: 20rpx;
	}

	.tui-flex-shrink {
		flex-shrink: 0;
		position:relative;
		top:2rpx;
	}

	.tui-primary-color {
		color: #FD5000;
	}

	.tui-order-info {
		margin-top: 20rpx;
	}

	.tui-order-title {
		position: relative;
		font-size: 28rpx;
		line-height: 28rpx;
		padding-left: 12rpx;
		box-sizing: border-box;
	}

	.tui-order-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		border-left: 4rpx solid #DF5000;
		height: 100%;
	}

	.tui-order-content {
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		background: #fff;
		font-size: 24rpx;
		line-height: 30rpx;
	}

	.tui-order-flex {
		display: flex;
		padding-top: 18rpx;
	}

	.tui-order-flex:first-child {
		padding-top: 0
	}

	.tui-item-title {
		width: 132rpx;
		flex-shrink: 0;
	}

	.tui-item-content {
		color: #666;
	}
</style>
