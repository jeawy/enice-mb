<template>
	<view>
		<scroll-view class="ranktype" :scroll="false" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view style="flex-direction: column;">
				<view style="flex-direction: row;" class="uni-tab">
					<view class="uni-tab-item" v-for="(tab,index) in tabList" :key="index" :ref="'tabitem'+index" :data-id="index"
					 :data-current="index" @click="switchTab(index)" :class="tabIndex==index ? 'uni-tab-item-active' : ''">
						<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''" :id="'tab'+index">{{tab.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<swiper class="rankcontainer" :style="{height:screenHeight+'rpx'}" @change="swiperChange" :current="swipercurrent">
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<view class="tui-order-item" v-for="(item,index) in orderList" :key="index" v-if="allorder">
						<view class="tui-goods-title" @tap="detail(item.id)">
							<view>订单号：{{item.order_number}}</view>
							<view class="tui-order-status">{{ item.status | statusformat }}</view>
						</view>
						<view class="tui-goods-item">
							<image :src="imageUrl + item.product.picture" class="tui-goods-img" @tap="detail(item.id)"></image>
							<view class="tui-goods-center" @tap="detail(item.id)">
								<view class="tui-goods-name">{{item.product.specifications}}</view>
								<view class="tui-goods-attr">{{item.product.content}}</view>
							</view>
							<view class="tui-price-right" @tap="detail(item.id)">
								<image class="icon" src="/static/icons/jifen.png"></image>
								<view class="price-coin">{{item.coin}}</view>
							</view>
							<view class="tui-item-content"  @tap="detail(item.id)">下单时间：{{item.create_date| dateTimeFormat}}</view>
							<view class="delete-icon" @tap="deleteOrder(index,item.id)">
								<image class="delete-image" src="/static/image/mall/close.png"></image>
							</view>
						</view>
						<view class="tui-goods-price" @tap="detail(item.id)">
							<view>共{{item.number}}件商品 合计：</view>
							<image class="icon" src="/static/icons/jifen.png"></image>
							<view>{{item.coin}}</view>
						</view>
					</view>
					<view v-if="empty" class="emptycontainer">
						<image class="empty-img" src="http://www.mescroll.com/img/mescroll-empty.png?v=1"></image>
						<view class="empty-text">暂无相关数据</view>
					</view>
					<view v-if="more"  class="getmore"  @tap="getmoreorder">加载更多...</view>
					<!--加载loadding-->
					<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
					<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
				</scroll-view>
			</swiper-item>
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<!--未支付-->
					<view class="tui-order-item" v-for="(item,index) in orderList" v-if="nopayorder" :key="index">
						<view class="tui-goods-title"  @tap="detail(item.id)">
							<view>订单号：{{item.order_number}}</view>
							<view class="tui-order-status">未支付</view>
						</view>
						<view class="tui-goods-item">
							<image :src="imageUrl + item.product.picture" class="tui-goods-img"  @tap="detail(item.id)"></image>
							<view class="tui-goods-center"  @tap="detail(item.id)">
								<view class="tui-goods-name">{{item.product.specifications}}</view>
								<view class="tui-goods-attr">{{item.product.content}}</view>
							</view>
							<view class="tui-price-right"  @tap="detail(item.id)">
								<image class="icon" src="/static/icons/jifen.png"></image>
								<view class="price-coin">{{item.coin}}</view>
							</view>
							<view class="tui-item-content"  @tap="detail(item.id)">下单时间：{{item.create_date| dateTimeFormat}}</view>
							<view class="delete-icon" @tap="deleteOrder(index,item.id)">
								<image class="delete-image" src="/static/image/mall/close.png"></image>
							</view>
						</view>
						<view class="tui-goods-price"  @tap="detail(item.id)">
							<view>共{{item.number}}件商品 合计：</view>
							<image class="icon" src="/static/icons/jifen.png"></image>
							<view>{{item.coin}}</view>
						</view>
					</view>
					<view v-if="empty" class="emptycontainer">
						<image class="empty-img" src="http://www.mescroll.com/img/mescroll-empty.png?v=1"></image>
						<view class="empty-text">暂无相关数据</view>
					</view>
					<view  v-if="more" class="getmore"  @tap="getmoreorder">加载更多...</view>
					<!--加载loadding-->
					<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
					<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
				</scroll-view>
			</swiper-item>
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<!--未发货-->
					<view class="tui-order-item" v-for="(item,index) in orderList" v-if="nobringorder" :key="index" >
						<view class="tui-goods-title"  @tap="detail(item.id)">
							<view>订单号：{{item.order_number}}</view>
							<view class="tui-order-status">未发货</view>
						</view>
						<view class="tui-goods-item">
							<image :src="imageUrl + item.product.picture" class="tui-goods-img"  @tap="detail(item.id)"></image>
							<view class="tui-goods-center"  @tap="detail(item.id)">
								<view class="tui-goods-name">{{item.product.specifications}}</view>
								<view class="tui-goods-attr">{{item.product.content}}</view>
							</view>
							<view class="tui-price-right"  @tap="detail(item.id)">
								<image class="icon" src="/static/icons/jifen.png"></image>
								<view class="price-coin">{{item.coin}}</view>
							</view>
							<view class="tui-item-content"  @tap="detail(item.id)">下单时间：{{item.create_date| dateTimeFormat}}</view>
							<view class="delete-icon" @tap="deleteOrder(index,item.id)">
								<image class="delete-image" src="/static/image/mall/close.png"></image>
							</view>
						</view>
						<view class="tui-goods-price"  @tap="detail(item.id)">
							<view>共{{item.number}}件商品 合计：</view>
							<image class="icon" src="/static/icons/jifen.png"></image>
							<view>{{item.coin}}</view>
						</view>
					</view>
					<view v-if="empty" class="emptycontainer">
						<image class="empty-img" src="http://www.mescroll.com/img/mescroll-empty.png?v=1"></image>
						<view class="empty-text">暂无相关数据</view>
					</view>
					<view  v-if="more" class="getmore"  @tap="getmoreorder">加载更多...</view>
					<!--加载loadding-->
					<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
					<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
				</scroll-view>
			</swiper-item>
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<!--未收货-->
					<view class="tui-order-item" v-for="(item,index) in orderList" v-if="nogetorder" :key="index" >
						<view class="tui-goods-title"  @tap="detail(item.id)">
							<view>订单号：{{item.order_number}}</view>
							<view class="tui-order-status">未收货</view>
						</view>
						<view class="tui-goods-item" >
							<image :src="imageUrl + item.product.picture" class="tui-goods-img"  @tap="detail(item.id)"></image>
							<view class="tui-goods-center"  @tap="detail(item.id)">
								<view class="tui-goods-name">{{item.product.specifications}}</view>
								<view class="tui-goods-attr">{{item.product.content}}</view>
							</view>
							<view class="tui-price-right"  @tap="detail(item.id)">
								<image class="icon" src="/static/icons/jifen.png"></image>
								<view class="price-coin">{{item.coin}}</view>
							</view>
							<view class="tui-item-content"  @tap="detail(item.id)">下单时间：{{item.create_date| dateTimeFormat}}</view>
							<view class="delete-icon" @tap="deleteOrder(index,item.id)">
								<image class="delete-image" src="/static/image/mall/close.png"></image>
							</view>
						</view>
						<view class="tui-goods-price"  @tap="detail(item.id)">
							<view>共{{item.number}}件商品 合计：</view>
							<image class="icon" src="/static/icons/jifen.png"></image>
							<view>{{item.coin}}</view>
						</view>
					</view>
					<view v-if="empty" class="emptycontainer">
						<image class="empty-img" src="http://www.mescroll.com/img/mescroll-empty.png?v=1"></image>
						<view class="empty-text">暂无相关数据</view>
					</view>
					<view v-if="more"  class="getmore"  @tap="getmoreorder">加载更多...</view>
					<!--加载loadding-->
					<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
					<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
				</scroll-view>
			</swiper-item> 
		</swiper>
	</view>
</template>
<script>
	import tuiLoadmore from "@/components/gift/loadmore"
	import tuiNomore from "@/components/gift/nomore"
	import {
		ApiLookOrder,
		ApiDeleteOrder,
		ApiGetOrder
	} from "@/api/giftcenter"

	export default {
		components: {
			tuiLoadmore,
			tuiNomore,
		},
		data() {
			return {
				tabList: [{
					name: '全部'
				}, {
					name: '未支付'
				}, {
					name: '未发货'
				}, {
					name: '未收货'
				}],
				swipercurrent: 0,
				tabIndex: 0,
				scrollInto: "",
				orderList: [],
				oldorderList:[],
				currentTab: 0,
				allorder: true,
				nopayorder: false,
				nobringorder: false,
				nogetorder: false,
				empty: false,
				imageUrl: '',
				status: '',
				screenHeight: 0,
				orderpage:1,
				pagenum:5,
				loadding:false,
				more:false,
				nomore:false,
			}
		},
		methods: {
			swiperChange(e) {
				let index = e.detail.current || e.target.current;
				this.switchTab(index)
			},
			switchTab(current) {
				if (this.tabIndex == current) {
					console.log(this.tabIndex)
				} else {
					this.tabIndex = current;
				}
				if (this.tabIndex == 0) {
					console.log("加载全部")
					this.allorder = true;
					this.nopayorder = false;
					this.nobringorder = false;
					this.nogetorder = false;
				} else if (this.tabIndex == 1) {
					console.log("加载未支付")
					this.status = '0'
					this.nopayorder = true;
					this.allorder = false;
					this.nobringorder = false;
					this.nogetorder = false;
				} else if (this.tabIndex == 2) {
					console.log("加载未发货")
					this.status = '1'
					this.nobringorder = true;
					this.allorder = false;
					this.nopayorder = false;
					this.nogetorder = false;
				} else {
					console.log("加载未收货")
					this.nogetorder = true;
					this.nobringorder = false;
					this.allorder = false;
					this.nopayorder = false;
				}
				this.currentTab = current;
				this.swipercurrent = current;
				this.getList();
			},
			getList() {
				if (this.currentTab == 0) {
					this.status = ''
					this.nomore = false;
					this.more = false;
					this.orderpage = 1;
					let param = {
						page:this.orderpage,
						pagenum:this.pagenum,
					}
					ApiGetOrder(param).then(({
						data
					}) => {
						if (data.status == 0) {
							this.orderList = [...data.msg];
							if (data.count == 0) {
								this.empty = true;
							}else{
								this.empty = false;
								if(this.orderList.length < this.pagenum){
									this.nomore = true;
								}else{
									this.more = true;
								}
							}
							this.imageUrl = this.$mStore.state.BaseUrl;
						}
					})
					this.empty = false;
				} else if (this.currentTab == 1) {
					this.tabIndex = 1
					this.status = '0'
				} else if (this.currentTab == 2) {
					this.status = '1'
					this.tabIndex = 2
				} else {
					this.status = '2'
					this.tabIndex = 3
				}
				if (this.status !== '') {
					this.nomore = false;
					this.more = false;
					this.orderpage = 1;
					let param = {
						status_id: this.status,
						page:this.orderpage,
						pagenum:this.pagenum,
					}
					ApiGetOrder(param).then(({
						data
					}) => {
						if (data.status == 0) {
							this.orderList = [...data.msg];
							if (data.count == 0) {
								this.empty = true;
							}else{
								this.empty = false;
								if(this.orderList.length < this.pagenum){
									this.nomore = true;
								}else{
									this.more = true;
								}
							}
							this.imageUrl = this.$mStore.state.BaseUrl;
						}
					})
					this.empty = false;
				}
			},
			getmoreorder(){
				this.loadding = true;
				this.orderpage = this.orderpage + 1;
				if (this.status !== '') {
					let param = {
						status_id: this.status,
						page:this.orderpage,
						pagenum:this.pagenum,
					}
					ApiGetOrder(param).then(({
						data
					}) => {
						if (data.status == 0) {
							this.loadding = false;
							this.oldorderList = [...data.msg];
							if(this.oldorderList.length < this.pagenum){
								this.nomore = true;
								this.more = false;
							}else{
								this.more = true;
							}
							this.orderList  = this.orderList.concat([...data.msg]); 
						}
					})
				}else{
					let param = {
						page:this.orderpage,
						pagenum:this.pagenum,
					}
					ApiGetOrder(param).then(({
						data
					}) => {
						if (data.status == 0) {
							this.loadding = false;
							this.oldorderList = [...data.msg];
							if(this.oldorderList.length < this.pagenum){
								this.nomore = true;
								this.more = false;
							}else{
								this.more = true;
							}
							this.orderList  = this.orderList.concat([...data.msg]); 
						}
					})
				}
			},
			detail(id) {
				uni.navigateTo({
					url: '../order/orderDetail?id=' + id + "&currentTab=" + this.currentTab
				})
			},
			deleteOrder(index,id) {
				var that = this;
				uni.showModal({
					title: '',
					content: '您好，确定要删除该订单吗？',
					confirmText: '删除',
					confirmColor: '#FD5000',
					success: function(res) {
						if (res.confirm) {
							const data = {
								method: 'delete',
								bill_ids: id
							}
							ApiDeleteOrder(data).then((res) => {
								if (res.data.status == 0) {
									uni.showToast({
										icon: "success",
										title: '删除成功!',
										duration: 3000
									});
									that.orderList.splice(index, 1);
								} else {
									console.log(res)
								}

							});
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				});
			}
		},
		onLoad: function(options) {
			this.imageUrl = this.$mStore.state.BaseUrl
			this.currentTab = Number(options.id)
			// this.getList();
			this.switchTab(this.currentTab);
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					that.screenHeight = res.screenHeight + 450
				}
			});
		},
	}
</script>
<style scoped>
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	.uni-tab {
		display: flex;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10rpx;
		height: 80rpx;
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		width: 25%;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 5rpx;
	}

	.uni-tab-item-title {
		font-size: 30rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-active {
		border-bottom: 10rpx solid #DF5000;
	}

	.uni-tab-item-title-active {
		color: #DF5000;
	}

	.swiper-item {
		flex: 1;
		flex-direction: column;
	}

	.tabIndex {
		width: 100%;
	}

	.listview {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
	}

	.icon {
		width: 32.5rpx;
		height: 32.5rpx;
		display: inline-block;
		position: relative;
		left: -8rpx;
	}

	.tui-order-item {
		border: 2upx solid #ececec;
		border-radius: 30upx;
		margin-top: 20rpx;
		/* border-radius: 10rpx; */
		overflow: hidden;
		padding:20rpx;
		position:relative;
	}

	.emptycontainer {
		position: absolute;
		padding: 20rpx;
		left: 200rpx;
	}

	.empty-img {
		width: 300rpx;
		height: 300rpx;
		position: relative;
	}

	.empty-text {
		position: absolute;
		left: 25%;
	}
    .getmore{
		position:relative;
		left:45%;
		margin-top:20rpx;
		font-size:24rpx;
		color:#666;
	}
	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-order-status {
		color: #888;
		font-size: 26rpx;
	}

	.tui-goods-item {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		padding: 20rpx 30rpx
	}

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx;
		display: block;
		flex-shrink: 0;
		position:relative;
		left:-25rpx;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx 8rpx;
		margin-left: -10rpx;
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
		width: 310rpx;
		position: absolute;
	}

	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 50rpx;
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
		padding-top: 40rpx;
		position: relative;
		left: 67rpx;
	}

	.tui-item-content {
		position: absolute;
		color: #666;
		font-size: 24rpx;
		top: 218rpx;
		left: 225rpx;
	}

	.delete-icon {
		position: relative;
		top: 137rpx;
		left: 15.5rpx;
	}

	.delete-image {
		position: absolute;
		width: 31rpx;
		height: 31rpx;
		display: inline-block;
		top:8rpx;
		left:-1rpx;
	}

	.price-coin {
		position: relative;
		top: 5rpx;
		display: inline-block;
	}

	.tui-goods-price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 24rpx;
	}
</style>
