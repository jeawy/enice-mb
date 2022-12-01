<template>
	<view class="address-list">
		<view class="rf-list" v-if="addressList.length > 0">
			<view class="rf-list-item" v-for="(item, index) in addressList" :key="index" @tap="checkAddress(item)">
				<view class="mid" @longtap="goTouchStart(item.id)">
					<view class="address-box">
						<text v-if="parseInt(item.default, 10) === 1" class="tag">默认</text>
						<text class="address in1line">{{item.detail}}</text>
					</view>
					<view class="u-box">
						<text class="name">{{item.receiver}}</text>
						<text class="mobile">{{item.phone}}</text>
					</view>
				</view>
				<!-- <view class="right">
					<text class="iconfont iconbianji" @tap.stop="addAddress('edit', item.id)"></text>
				</view> -->
			</view>
			<text v-if="addressList.length > 0" class="tips">
				提示：长按可删除当前收货地址。最多只能存在一个默认地址。
			</text>
			<rf-load-more v-if="addressList.length > 0" :status="loadingType" />
		</view>
		<view class="add-btn-wrapper">
			<button class="add-btn" @tap="addAddress('add')">新增地址</button>
		</view>
		<rf-empty :info="`暂无收货地址，请添加地址`" v-if="addressList.length === 0 && !loading"></rf-empty>
		<!--加载动画-->
		<rf-loading v-if="loading"></rf-loading>
	</view>
</template>

<script> 
	import {
		addressDelete,
		queryAddressList,
		deleteAddress
	} from "@/api/userInfo";

	import rfLoadMore from '@/components/rf-load-more/rf-load-more';

	export default {
		components: {
			rfLoadMore
		},
		data() {
			return {
				timeOutEvent: 0,
				source: 0,
				page: 1,
				addressList: [],
				loadingType: 'more',
				loading: true
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.addressList = [];
			this.getAddressList('refresh');
		},
		//加载更多
		onReachBottom() {
			this.page++;
			this.getAddressList();
		},
		onLoad(option) {
			this.source = option.source;
		},
		onShow() {
			this.initData()
		},
		methods: {
			goTouchStart(id) {
				uni.showModal({
					content: '确定要删除该收货地址吗',
					success: (e) => {
						if (e.confirm) {
							this.handleAddressDelete(id);
						}
					}
				});
			},
			// 删除地址
			handleAddressDelete(id) {
				deleteAddress({ids:id}).then(({status,msg}) => {
					this.$mHelper.toast(msg);
					if(status===0){
						this.page = 1
						this.addressList = []
						this.getAddressList()
					}
				})
			},
			// 数据初始化
			initData() {
				this.page = 1;
				this.addressList.length = 0;
				this.getAddressList();
			},
			// 获取收货地址列表
			getAddressList(type) {
				this.loading = true;
				queryAddressList().then(({
					status,
					msg
				}) => {

					if (status === 0) {
						this.loading = false;
						if (type === 'refresh') {
							uni.stopPullDownRefresh();
						}
						this.loadingType = msg === 10 ? 'more' : 'nomore';
						this.addressList = [...this.addressList, ...msg];
					}
				}).catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
			},
			// 选择地址
			checkAddress(item) {
				if (parseInt(this.source, 10) === 1) {
					//this.$mHelper.prePage()获取上一页实例，在App.vue定义
					this.$mHelper.prePage().addressData = item;
					this.$mRouter.back();
				}
			},
			// 跳转添加地址页面
			addAddress(type, id) {
				this.$mRouter.push({
					route: `/pages/user/address/manage?type=${type}&id=${id}`
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: $page-color-base;
	}

	.address-list {
		position: relative;

		.address-box {
			display: flex;
			align-items: center;

			.tag {
				font-size: 20upx;
				color: $base-color;
				background: #fffafb;
				border: 1px solid #ffb4c7;
				border-radius: 4upx;
				padding: 4upx 6upx;
				line-height: 1;
			}

			.address {
				font-size: 30upx;
				color: $font-color-dark;
				display: block;
				width: 600rpx; 
				overflow: hidden;
				text-overflow:ellipsis;
			}
		} 
		.u-box {
			font-size: 28upx;
			color: $font-color-light;
			margin-top: 16upx;

			.name {
				margin-right: 30upx;
				display: block;
				width: 600rpx; 
				overflow: hidden;
				text-overflow:ellipsis;
			}
		}
	}
</style>
