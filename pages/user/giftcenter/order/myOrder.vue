<template>
	<!--积分好礼“我的”页面-->
	<view>
		<!--header-->
		<view class="tui-header-box" :style="{height:height+'px',background:'rgba(255,255,255,'+opcity+')'}">
		</view>
		<!--header-->
		<view class="tui-mybg-box">
			<image src="/static/image/mall/currency/background.png" class="tui-my-bg" ></image>
		</view>
		<view class="tui-content-box">
			<view class="tui-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @tap="lookallorder">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的订单</view>
						<view class="tui-cell-sub">查看全部订单</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-list">
					<view class="tui-order-item" @tap="lookallorder">
						<view class="tui-icon-box">
							<image src="/static/image/mall/my/icon_daifukuan.png" class="tui-order-icon"></image>
							<view v-if="zero"></view>
							<view v-else class="tui-badge tui-badge-red">{{allnum}}</view>
						</view>
						<view class="tui-order-text">全部</view>
					</view>
					<view class="tui-order-item" @tap="looknopayorder">
						<view class="tui-icon-box">
							<image src="/static/image/mall/my/icon_daifahuo.png" class="tui-order-icon"></image>
							<view v-if="zero1"></view>
							<view v-else class="tui-badge tui-badge-red">{{nopaynum}}</view>
						</view>
						<view class="tui-order-text">未支付</view>
					</view>
					<view class="tui-order-item" @tap="looknobringorder">
						<view class="tui-icon-box">
							<image src="/static/image/mall/my/icon_daifahuo.png" class="tui-order-icon"></image>
							<view v-if="zero2"></view>
							<view v-else class="tui-badge tui-badge-red">{{nobringnum}}</view>
						</view>
						<view class="tui-order-text">未发货</view>
					</view>
					<view class="tui-order-item" @tap="looknogetorder">
						<view class="tui-icon-box">
							<image src="/static/image/mall/my/icon_daishouhuo.png" class="tui-order-icon"></image>
							<view v-if="zero3"></view>
							<view v-else class="tui-badge tui-badge-red">{{nogetnum}}</view>
						</view>
						<view class="tui-order-text">未收货</view>
					</view>
				</view>
			</view>
			<!-- <view class="tui-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="PayRecord">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的消费记录</view>
						<view class="tui-cell-sub">查看全部消费记录</view>
					</view>
				</tui-list-cell>
			</view> -->
			<view class="tui-box">
				<tui-list-cell :arrow="true" padding="0" :lineLeft="false" @click="lookAddress">
					<view class="tui-cell-header">
						<view class="tui-cell-title">我的收货地址</view>
						<view class="tui-cell-sub">查看全部地址</view>
					</view>
				</tui-list-cell>
			</view>
			<!--加载loadding-->
			<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		</view>
		<!--footer-->
		<view class="footer">
			<image src="/static/image/mall/currency/footer.png" class="footer-center"></image>
		</view>
	</view>
</template>

<script> 
	import tuiListCell from "@/components/gift/list-cell"
	import tuiLoadmore from "@/components/gift/loadmore"
	import {
		search_users
	} from '@/api/usercenter'
	import {
		ApiGetOrderNum
	} from "@/api/giftcenter"
	export default {
		components: { 
			tuiListCell,
			tuiLoadmore
		},
		data() {
			return {
				height: 64, //header高度
				top: 0, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				picture: '',
				username: '',
				imageUrl: '',
				allnum: '',
				nopaynum: '',
				nobringnum:'',
				nogetnum:'',
				id:'',
				zero:false,
				zero1:false,
				zero2:false,
				zero3:false,
			}
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			},
			isLogin() {
				return this.$mStore.state.estateToken || uni.getStorageSync('estateToken')
			}
		},
		methods: {
			lookallorder() {
				uni.navigateTo({
					url: '../order/orderList?id='+ 0
				})
			},
			looknopayorder() {
				uni.navigateTo({
					url: '../order/orderList?id='+ 1
				})
			},
			looknobringorder() {
				uni.navigateTo({
					url: '../order/orderList?id='+ 2
				})
			},
			looknogetorder() {
				uni.navigateTo({
					url: '../order/orderList?id='+ 3
				})
			},
			lookAddress() {
				uni.navigateTo({
					url: '../address'
				})
			},
			search() {
				if (this.isLogin) {
					this.user_id = this.$mStore.state.UserInfo.id;
					let data = this.user_id;
					search_users({
						userid: data
					}).then(({
						data
					}) => {
						if (data.status == 0) {
							[...data.msg].map((item, index) => {
								this.picture = item.thumbnail_portait;
								this.username = item.username;
								this.imageUrl = this.$mStore.state.BaseUrl;
							})
						}
					})
					ApiGetOrderNum({
						status_num: '3'
					}).then(({
						data
					}) => {
						if (data.msg == undefined) {
							this.allnum = "0";
							this.nopaynum = "0";
							this.nobringnum = "0";
							this.nogetnum = "0";
							this.zero = true;
							this.zero1 = true;
							this.zero2 = true;
							this.zero3 = true;
						} else {
							this.allnum = data.msg[0] + data.msg[1] + data.msg[2] + data.msg[3] + data.msg[4];
							if (data.msg[0] === 0) {
								data.msg[0] = "0"
							}
							if (data.msg[1] === 0) {
								data.msg[1] = "0"
							}
							if (data.msg[2] === 0) {
								data.msg[2] = "0"
							}
							this.nopaynum = data.msg[0];
							this.nobringnum = data.msg[1];
							this.nogetnum = data.msg[2];
							if(this.allnum == "0"){
								this.zero = true;
							}else{
								this.zero = false;
							}
							if(this.nopaynum == "0"){
								this.zero1 = true;
							}else{
								this.zero1 = false;
							}
							if(this.nobringnum == "0"){
								this.zero2 = true;
							}else{
								this.zero2 = false;
							}
							if(this.nogetnum == "0"){
								this.zero3 = true;
							}else{
								this.zero3 = false;
							}
							if (data.msg[4] === 0) {
								data.msg[4] = 0
							}
						}
					})
				}
			},
		},
		onLoad: function(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.scrollH = res.windowWidth * 0.6
				}
			})
		},
		onShow() {
			this.search();
		},
		//下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200)
		},
		onReachBottom: function() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.pageIndex == 4) {
				this.loadding = false;
				this.pullUpOn = false
			} else {
				let loadData = JSON.parse(JSON.stringify(this.productList));
				loadData = loadData.splice(0, 10)
				if (this.pageIndex == 1) {
					loadData = loadData.reverse();
				}
				this.productList = this.productList.concat(loadData);
				this.pageIndex = this.pageIndex + 1;
				this.loadding = false
			}
		}
	}
</script>

<style scoped>
	.tui-header-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9998;
	}

	.tui-header {
		width: 100%;
		font-size: 18px;
		line-height: 18px;
		font-weight: 500;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* #ifndef MP */
	.tui-header-icon {
		position: fixed;
		top: 0;
		right: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 32px;
		transform: translateZ(0);
		z-index: 99999;
	}

	/* #endif */
	/* #ifdef MP */
	.tui-set-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* #endif */
	.tui-icon-box {
		position: relative;
	}
	.tui-badge {
		position: absolute;
		font-size: 22rpx;
		min-height: 35rpx;
		min-width: 35rpx;
		padding: 0 6rpx;
		border-radius:50rpx;
		right: 10rpx;
		top: -5rpx;
		transform: scale(0.8) translateX(60%);
		transform-origin: center center;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.tui-badge-red {
		background: #F74D54;
		color: #fff;
	}

	.tui-badge-white {
		background: #fff;
		color: #F74D54;
	}

	.tui-badge-dot {
		position: absolute;
		height: 12rpx;
		width: 12rpx;
		border-radius: 50%;
		right: -12rpx;
		top: 0;
		background: #F74D54;
	}

	.tui-mybg-box {
		width: 100%;
		height: 450rpx;
		position: relative;
	}

	.tui-my-bg {
		width: 100%;
		height: 450rpx;
		display: block;
	}

	.tui-header-center {
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 120rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-avatar {
		flex-shrink: 0;
		width: 128rpx;
		height: 128rpx;
		display: block;
	}

	.tui-info {
		width: 60%;
		padding-left: 30rpx;

	}

	.tui-nickname {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
		display: flex;
		align-items: center;
	}
	.tui-img-vip {
		width: 56rpx;
		height: 24rpx;
		margin-left: 18rpx;
	}
	.tui-content-box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		top: -70rpx;
		z-index: 10;
		margin-top: 20rpx;
	}

	.tui-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-cell-header {
		width: 100%;
		height: 100rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}

	.tui-cell-sub {
		font-size: 26rpx;
		font-weight: 400;
		color: #999;
		padding-right: 28rpx;
	}

	.tui-order-list {
		width: 100%;
		height: 134rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;

	}

	.tui-order-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tui-order-text,
	.tui-tool-text {
		font-size: 26rpx;
		font-weight: 400;
		color: #666;
		padding-top: 4rpx;
	}
	.tui-tool-text {
		font-size: 24rpx;
	}
	.tui-order-icon {
		width: 56rpx;
		height: 56rpx;
		display: block;
	}
	.footer{
		width: 100%;
		position: fixed;
		z-index: 100;
		bottom: 0;
		left: 0;
	}
	.footer-center{
		width: 100%;
		display: block;
		height:250rpx; 
	}
</style>
