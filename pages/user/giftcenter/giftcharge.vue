<template>
	<!--确认订单-->
	<view class="container">
		<view class="tui-box">
			<tui-list-cell :arrow="true" :last="true" :radius="true" @tap="chooseAddr">
				<view class="tui-address">
					<view v-if="show">
						<view class="tui-userinfo">
							<text class="tui-name">{{(username!='')?username:defaultName}} {{(mobile!='')?mobile:defaultMobile}}</text>
						</view>
						<view class="tui-addr">
							<text>{{(address!='')?address:defaultAddress}}</text>
						</view>
					</view>
					<view class="tui-none-addr" v-else>
						<text>选择收货地址</text>
					</view>
				</view>
				<view class="tui-bg-img"></view>
			</tui-list-cell>
			<view class="tui-top tui-goods-info">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						商品信息
					</view>
				</tui-list-cell>
				<block>
					<tui-list-cell :hover="false" padding="0">
						<view class="tui-goods-item">
							<image :src="imageUrl + picture" class="tui-goods-img" @tap="previewImage()"></image>
							<view class="tui-goods-center">
								<view class="tui-goods-name">{{giftname}}</view>
								<view class="tui-goods-attr">{{content}}</view>
							</view>
							<view class="tui-price-right">
								<image class="icon" src="/static/icons/jifen.png"></image>
								<view class="coin">{{price}}</view>
								<view class="tui-scale">
									<tui-numberbox :value="number" :height="40" :width="74" :min="1"  @change="changeNum"></tui-numberbox>
								</view>
							</view>
						</view>
					</tui-list-cell>
				</block>
				<tui-list-cell :hover="false" :last="true">
					<view class="tui-padding tui-flex tui-total-flex">
						<view class="tui-flex-end tui-color-red">
							<view class="tui-black">合计： </view>
							<image class="icon3" src="/static/icons/jifen.png"></image>
							<view class="tui-price-large">{{allprice}}</view>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :last="true">
					<view class="tui-padding tui-flex">
						<view class="coinnum">积分余额</view>
						<image class="icon2" src="/static/icons/jifen.png"></image>
						<view class="tui-price1">{{allicon}}</view>
					</view>
				</tui-list-cell>
			</view>
		</view>
		<view class="tui-safe-area"></view>
		<view class="tui-tabbar">
			<view class="tui-flex-end tui-color-red tui-pr-20">
				<view class="tui-black">实付积分: </view>
				<image class="icon" src="/static/icons/jifen.png"></image>
				<view class="tui-price-large">{{allprice}}</view>
			</view>
			<view class="tui-pay">
				<view class="tui-btnpay">
					<view class="tui-flex-1">
						<tui-button type="warning" shape="circle" size="mini" @click="CreateOrder">确认支付</tui-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tuiButton from "@/components/gift/button"
	import tuiListCell from "@/components/gift/list-cell"
	import tuiBottomPopup from "@/components/gift/bottom-popup"
	import tuiNumberbox from "@/components/gift/numberbox"
	import {
		Look_Address
	} from "@/api/receiptAddress"
	import {
		ApiCreate_Pay
	} from "@/api/pay"
	import {
		Create_Order
	} from "@/api/giftcenter"
	import {
		Add_Coin,Look_Coin
	} from "@/api/currency"
	export default {
		components: {
			tuiButton,
			tuiListCell,
			tuiBottomPopup,
			tuiNumberbox,
		},
		data() {
			return {
				hasCoupon: true,
				insufficient: false,
				username: '',
				mobile: '',
				address: '',
				defaultName: '',
				defaultMobile: '',
				defaultAddress: '',
				giftId: '',
				show: false,
				userInfo: [],
				price: '',
				allprice:'',
				giftname: '',
				content: '',
				picture: '',
				imageUrl: '',
				defaultAddrId: '',
				addrId: '',
				way: 2,
				type: 1,
				number: 1,
				giftList: '',
				storedGiftInfo: '',
				orderId: '',
				orderAddressId: '',
				allicon:'',
				id:'',
				Image:[],
				giftpicture:'',
			}
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			}
		},
		methods: {
			changeNum: function(e) {
				this.number=e.value;
				this.allprice = this.price*this.number;
				console.log(this.allprice);
			},
			//选择收货地址
			chooseAddr() {
				uni.navigateTo({
					url: "../giftcenter/address?id=" + this.id
				})
			},
			//显示默认地址
			lookDefaultAddress() {
				Look_Address().then(({
					data
				}) => {
					if (data.status == 0) {
						[...data.msg].map((item, index) => {
							if (item.default == 1) {
								this.show = true,
									this.defaultName = item.receiver,
									this.defaultMobile = item.phone,
									this.defaultAddress = item.address,
									this.defaultAddrId = item.id
							}
						})
					}
				})
			},
			//获取用户总积分
			getallicon(){
				Look_Coin({
					mine: ''
				}).then(({
					data
				}) => {
					if (data.status == 0) {
						this.allicon = data.msg
						console.log(this.allicon);
						if (this.allicon === 0) {
							this.allicon = "0"
						}
					}
				})
			},
			//添加订单
			CreateOrder() {
				let that = this
				uni.showModal({
					content: '确认是否支付？',
					confirmColor: "#DF5000",
					success: function(res) { 
						if (res.confirm) {
							if (that.address != '') {
								that.orderAddressId = that.addrId
							} else {
								that.orderAddressId = that.defaultAddrId
							}
								let data = {
									goods_id: that.giftId,
									number: that.number,
									address_id: that.orderAddressId,
									purchase_way:1
								}
								Create_Order(data).then(({
									data
								}) => {
									if (data.status == 0) {
										that.orderId = data.bill_id;
										console.log(that.orderId)
										let res = {
											bill_id: that.orderId,
											purchase_way: 1,
											instance:that.allprice,
										}
										ApiCreate_Pay(res).then(({
											data
										}) => { 
											if (data.status == 0) {
												uni.showToast({
													title: '支付成功',
													duration: 3000
												});
												uni.navigateTo({
													url: "../giftcenter/paySuccess?id=" + that.orderId
												})
											} else {
												uni.showToast({
													title: data.msg,
													icon: "none",
												})
											}
										})
									} else {
										console.log(data.msg)
									}
								})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// //礼品支付
			// btnPay() {
			// 	let that = this
			// 	uni.showModal({
			// 		content: '确认是否支付？',
			// 		confirmColor: "#DF5000",
			// 		success: function(res) { 
			// 			if (res.confirm) {
			// 				let data = {
			// 					bill_id: that.orderId,
			// 					purchase_way: 1,
			// 					instance:that.allprice,
			// 				}
			// 				ApiCreate_Pay(data).then(({
			// 					data
			// 				}) => { 
			// 					if (data.status == 0) {
			// 						uni.showToast({
			// 							title: '支付成功',
			// 							duration: 3000
			// 						});
			// 						uni.navigateTo({
			// 							url: "../giftcenter/paySuccess?id=" + that.orderId
			// 						})
			// 					} else {
			// 						uni.showToast({
			// 							title: data.msg,
			// 							icon: "none",
			// 						})
			// 					}
			// 				})
			// 			} else if (res.cancel) {
			// 				console.log('用户点击取消');
			// 			}
			// 		}
			// 	})
			// },
			//接收礼品详情页面传递的礼品信息
			getGiftInfo(e) {
				this.giftList = e;
				//跳转到收货地址页面来获取收货地址的时候，将礼品详情页传递给该页面的礼品信息存储起来
				try {
					uni.setStorageSync('key', this.giftList);
				} catch (e) {}
			},
			//接收收货地址页面传递的收货地址信息
			AddressInfo(e) {
				this.addrId = e.id;
				this.username = e.username;
				this.address = e.address;
				this.mobile = e.mobile;
			},
			//获取存储的礼品信息
			getStoredGiftInfo() {
				//取出之前存储的礼品信息将其展示出来
				try {
					this.storedGiftInfo = uni.getStorageSync('key');
				} catch (e) {
					// error
				}
				this.giftId = this.storedGiftInfo.id;
				this.price = this.storedGiftInfo.price;
				this.content = this.storedGiftInfo.content;
				this.picture = this.storedGiftInfo.picture;
				this.giftname = this.storedGiftInfo.name;
				this.allprice = this.price;
			},
			searchimage(){
				//取出之前存储的礼品信息将其展示出来
				try {
					this.storedGiftInfo = uni.getStorageSync('key');
				} catch (e) {
					// error
				}
				this.giftpicture = this.storedGiftInfo.picture;
				this.Image.push(this.imageUrl + this.giftpicture)
			},
			//点击查看头像大图
			previewImage: function() {
					uni.previewImage({
						current: this.Image[0],
						urls: this.Image,
					})
			},
		},
		onLoad: function(options) { //option为object类型，会序列化上个页面传递的参数 
			this.id = options.id;
			if (options.hasOwnProperty('price') == true) {
				this.getGiftInfo(options);
			} else {
				this.AddressInfo(options);
			}
			this.lookDefaultAddress();
			this.imageUrl = this.$mStore.state.BaseUrl;
			this.searchimage();
		},
		onShow() {
			this.getStoredGiftInfo();
			this.getallicon();
		}
	}
</script>

<style scoped>
	.container {
		padding-bottom: 98rpx;
	}

	.tui-box {
		padding: 20rpx 0 118rpx;
		box-sizing: border-box;
	}

	.tui-address {
		min-height: 80rpx;
		padding: 10rpx 0;
		box-sizing: border-box;
		position: relative;
	}

	.tui-userinfo {
		font-size: 30rpx;
		font-weight: 500;
		line-height: 30rpx;
		padding-bottom: 12rpx;
	}

	.tui-name {
		padding-right: 40rpx;
	}

	.tui-addr {
		font-size: 24rpx;
		word-break: break-all;
		padding-right: 25rpx;
	}

	.tui-addr-tag {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #EB0909;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: 0 center;
		border-radius: 6rpx;
	}

	.tui-bg-img {
		position: absolute;
		width: 100%;
		height: 8rpx;
		left: 0;
		bottom: 0;
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAMAAADszM6/AAAAOVBMVEUAAAAVqfH/fp//vWH/vWEVqfH/fp8VqfH/fp//vWEVqfH/fp8VqfH/fp//vWH/vWEVqfH/fp//vWHpE7b6AAAAEHRSTlMA6urqqlVVFRUVq6upqVZUDT4vVAAAAEZJREFUKM/t0CcOACAQRFF6r3v/w6IQJGwyDsPT882IQzQE0E3chToByjG5LwMgLZN3TQATmdypCciBya0cgOT3/h//9PgF49kd+6lTSIIAAAAASUVORK5CYII=") repeat;
	}

	.tui-top {
		margin-top: 20rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.tui-padding {
		box-sizing: border-box;
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
		border-radius: 24rpx;
		margin-top: 13rpx;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx 20rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		max-width: 325rpx;
		/* word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; */
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		max-width: 325rpx;
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
		text-align: center;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 20rpx;
	}
	.coin{
		position:relative;
	}
	.tui-scale {
		transform: scale(0.8);
		transform-origin: 100% 100%;
		position:relative;
		margin-top:10rpx;
		margin-left:-30rpx;
	}
	.icon {
		width: 32.5rpx;
		height: 32.5rpx;
		display: inline-block;
	}
	.tui-flex {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
	}
	.coinnum{
		position:relative;
		top:6rpx;
	}
    .icon1{
		width: 32.5rpx;
		height: 32.5rpx;
		position:relative;
		left:232rpx;
	}
	.icon2{
		width: 32.5rpx;
		height: 32.5rpx;
		position:relative;
		left:242rpx;
	}
	.icon3{
		width: 32.5rpx;
		height: 32.5rpx;
		display: inline-block;
		position:relative;
		left:-5rpx;
	}
	.tui-price1{
		position:relative;
		left:12rpx;
	}
	.tui-price{
		position:relative;
	}
	.tui-total-flex {
		justify-content: flex-end;
	}

	.tui-color-red,
	.tui-invoice-text {
		color: #DF5000;
		padding-right: 30rpx;
	}

	.tui-black {
		color: #222;
		line-height: 30rpx;
		position:relative;
		left:-5rpx;
	}

	.tui-size-26 {
		font-size: 26rpx;
		line-height: 26rpx;
	}

	.tui-price-large {
		font-size: 34rpx;
		line-height: 32rpx;
		font-weight: 600;
		position:relative;
		left:5rpx;
	}

	.tui-flex-end {
		display: flex;
		align-items: flex-end;
		padding-right: 0;
	}

	.tui-tabbar {
		width: 100%;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		font-size: 26rpx;
		box-shadow: 0 0 1px rgba(0, 0, 0, .3);
		padding-top: 18rpx;
		padding-bottom: 10rpx;
	    padding-bottom: env(safe-area-inset-bottom); 
		z-index: 999;
	}

	.tui-pr-20 {
		padding-right: 20rpx;
	}

	.tui-none-addr {
		height: 80rpx;
		padding-left: 5rpx;
		display: flex;
		align-items: center;
	}

	.tui-pay {
		padding-right: 25rpx;
	}

	.tui-btnpay {
		width: 100%;
		display: block !important;
		font-size: 28rpx !important;
		padding-bottom:10rpx;
	}

	.tui-flex-1 {
		flex: 1;
	}

	.tui-safe-area {
		height: 1rpx;
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
