<template>
	<!-- 积分好礼 -->
	<view class="container">
		<!--header-->
		<view class="tui-header">
			<!-- <view class="tui-category" hover-class="opcity" :hover-stay-time="150" @tap="classify">
				<tui-icon name="manage-fill" color="#fff" :size="22"></tui-icon>
				<view class="tui-category-scale">分类</view>
			</view> -->
			<view class="tui-rolling-search">
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="search" :size='13' color='#999'></icon>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view>
					<tui-icon name="search" :size='16' color='#999'></tui-icon>
				</view>
				<!-- #endif -->
					<swiper vertical autoplay circular interval="8000" class="tui-swiper" v-if="first" @tap="or">
						<swiper-item v-for="(item,index) in GiftList" :key="index" class="tui-swiper-item">
							<view class="tui-hot-item">{{item.title}}</view>
						</swiper-item>
					</swiper>
				    <view v-if="!first"> 
					 <input  type="text"  @input="search"  class="tui-hot-item"  />
				    </view>
			</view>
		</view> 
		<mescroll-uni bottom="5" top="20" @down="downCallback" @up="upCallback" @init="mescrollInit">
			<view class="tui-new-box">
				<view class="tui-container">
				<view class="background" v-for="(item,index) in GiftList" :key="index" @tap="detail(item.uuid)">
					<image  :src="imageUrl + item.picture" class="tui-new-img" mode="widthFix"></image>
					<view class="tui-title-box">
						<view  class="title-box">
						<view v-if="newtag"  :class="{'tag-view':pickerUserIndex == index,'tag-active':pickerUserIndex !== index}" >
							<image class="tagpicture" src="/static/new2.png"></image>
						</view>
						<view v-if="othertag" :class="{'othertag-view':pickerUserIndex == index,'tag-active':pickerUserIndex !== index}" >
							<uni-tag :text="tag" type="primary" :circle="true" size="small"/>
						</view>
						</view>
						<view class="tui-new-title">{{item.title}}</view>
						<view>
							<view class="tui-new-price">
								<image class="icon" :src="baseAppUrl+'jifen.png'"></image>
								<text class="tui-new-present-coin">积分:</text>
								<text class="tui-new-present">{{item.specifications[0].coin}}</text>
							</view>
							<view class="tui-number">库存: {{item.specifications[0].number}}</view>
						</view>
					</view>
				</view>
			   </view>
			</view>
		</mescroll-uni>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		<view class="tui-safearea-bottom"></view>
	</view>
</template>
<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import tuiLoadmore from "@/components/gift/loadmore"
	import tuiNomore from "@/components/gift/nomore"
	import {
		getGifts,
		look_GiftSpecifications,
		ApiPutPurchase
	} from '@/api/giftcenter';
	export default {
		components: { 
			tuiLoadmore,
			tuiNomore,
			MescrollUni,
		},
		data() {
			return {
				baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
				id: '',
				current: 0,
				tabbar: [{
					icon: "home",
					text: "首页",
					size: 21
				}, {
					icon: "people",
					text: "我的",
					size: 24
				}],
				banner: [
					"1.jpg",
					"2.jpg",
					"3.jpg",
					"4.jpg",
					"5.jpg"
				],
				GiftList: [],
				giftlist: [],
				imageUrl : '',
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				mescroll: null, //mescroll实例对象
				inputValue:'',
				giftid:[],
				first:true,
				newtag:false,
				tag:'',
				othertag:false,
				pickerUserIndex:-1, 
				communityuuid:""
			}
		},
		onShow(){
			this.communityuuid = uni.getStorageSync("communityuuid")
			 
		},
		methods: {
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			downCallback(mescroll) {
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.endSuccess()
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				//联网加载数据
				this.getListDataFromNet(mescroll.num, mescroll.size, (curPageData) => {
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					// console.log("mescroll.num=" + mescroll.num + ", mescroll.size=" + mescroll.size + ", curPageData.length=" +
					// 	curPageData.length);
					mescroll.endSuccess(curPageData.length);
					if (mescroll.num == 1) this.GiftList = [];
					//追加新数据
					this.GiftList = this.GiftList.concat(curPageData);
				}, () => {
					//联网失败的回调,隐藏下拉刷新的状态
					mescroll.endErr();
				})
			},
			getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
				getGifts(
					{
						communityuuid:this.communityuuid
					}
				).then(({ status, msg }) => {
					if (status == 0) {
						this.giftlist = msg.list;
						let length = this.giftlist.length;
						for(let i=0;i<length;i++){
							let gift = this.giftlist[i];
						    if(gift.tags.length !== 0){
								this.pickerUserIndex = i;
								let j = gift.tags.length;
								for(let m=0;m<j;m++){
									if(gift.tags[m][2] == "new"){
										this.newtag = true;
									}else{
										this.newtag = false;
										this.othertag = true;
										this.tag = gift.tags[m][1];
									}
								}
							}
						}
						this.imageUrl = this.$mStore.state.BaseUrl;
						var Data = this.giftlist;
						//模拟分页数据
						var listData = [];
						for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
							if (i == Data.length) break;
							listData.push(Data[i]);
						}
					}
					//联网成功的回调
					successCallback && successCallback(listData);
				})
			},
			or(){
				this.first=false;
			},
			search: function(event) {
				this.inputValue = event.target.value
				let data = {
					title:this.inputValue,
					communityuuid:this.communityuuid
				}
				getGifts(data).then(({ status, msg }) => {
					// console.log(data)
					if ( status == 0) {
						console.log( msg)
						if( msg.length == 0){
							uni.showLoading({
								title: '没有搜索到哦'
							});
						}else{
							uni.hideLoading();
							this.GiftList = [...msg];	
						}
					}
				})
			},
			detail: function(uuid) { 
				console.log(1111)
				this.$mRouter.push({ 
					route:'/pages/user/giftcenter/giftDetail?uuid=' + uuid
				 }); 
			},
			monthList() {
				console.log("这是本月礼品榜")
			},
			yearList() {
				console.log("这是本年度礼品榜")
			},
			// more: function(e) {
			// 	let key = e.currentTarget.dataset.key || "";
			// 	console.log(e);
			// 	uni.navigateTo({
			// 		url: '../productList/productList?searchKey=' + key
			// 	})

			// },
		},
		onLoad() {
			 
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			}
		},

	}
</script>

<style scoped>
	page {
		background: #f7f7f7;
	}
    .icon
	{
		    position:absolute;
			margin-top:6rpx;
			width: 32.5rpx;
			height: 32.5rpx;
			display: inline-block; 
		}
	.container {
		padding-bottom: 100rpx;
		color: #333;
	}

	/*tabbar*/

	.tui-tabbar {
		width: 100%;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 99999;
		background: #fff;
		height: 100rpx;
		left: 0;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-tabbar-item {
		flex: 1;
		width: 25%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666;
		height: 80rpx;
	}

	.tui-ptop-4 {
		padding-top: 4rpx;
	}

	.tui-scale {
		font-weight: bold;
		transform: scale(0.8);
		transform-origin: center 100%;
		line-height: 30rpx;
	}

	.tui-item-active {
		color: #DF5000 !important;
	}

	/*tabbar*/

	.tui-header {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx 0 30rpx;
		box-sizing: border-box;
		background: #DF5000;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		z-index: 999;
	}

	.tui-rolling-search {
		width: 100%;
		height: 60rpx;
		border-radius: 35rpx;
		padding: 0 40rpx 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		color: #999;
	}

	.tui-category {
		font-size: 24rpx;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin: 0;
		margin-right: 22rpx;
		flex-shrink: 0;
	}

	.tui-category-scale {
		transform: scale(0.7);
		line-height: 24rpx;
	}

	.tui-icon-category {
		line-height: 20px !important;
		margin-bottom: 0 !important;
	}

	.tui-swiper {
		font-size: 26rpx;
		height: 60rpx;
		flex: 1;
		padding-left: 12rpx;
	}

	.tui-swiper-item {
		display: flex;
		align-items: center;
	}

	.tui-hot-item {
		/* line-height: 26rpx; */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width:100%;
	}

	.tui-header-banner {
		padding-top: 100rpx;
		box-sizing: border-box;
		background: #DF5000;
	}

	.tui-hot-search {
		color: #fff;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.tui-hot-tag {
		background: rgba(255, 255, 255, 0.15);
		padding: 10rpx 24rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 24rpx;
		/* margin-left: 20rpx; */
	}

	.tui-banner-bg {
		display: flex;
		height: 180rpx;
		background: #DF5000;
		position: relative;
	}

	.tui-primary-bg {
		width: 50%;
		display: inline-block;
		height: 224rpx;
		border: 1px solid transparent;
		position: relative;
		z-index: 1;
		background: #DF5000;
	}

	.tui-route-left {
		transform: skewY(8deg);
	}

	.tui-route-right {
		transform: skewY(-8deg);
	}

	.tui-banner-box {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: absolute;
		/* overflow: hidden; */
		z-index: 99;
		bottom: -80rpx;
		left: 0;
	}

	.tui-banner-swiper {
		width: 100%;
		height: 240rpx;
		border-radius: 12rpx;
		overflow: hidden;
		transform: translateY(0);
	}

	.tui-slide-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}

	/* #ifdef APP-PLUS || MP */
	.tui-banner-swiper .wx-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.tui-banner-swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-banner-swiper .wx-swiper-dot-active::before {
		background: #fff;
	}

	.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	/* #ifdef H5 */
	.tui-banner-swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.tui-banner-swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.tui-banner-swiper .uni-swiper-dot-active::before {
		background: #fff;
	}

	.tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.tui-product-category {
		background: #fff;
		padding: 80rpx 20rpx 30rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 34upx;
		color: #555;
		margin-bottom: 20rpx;
	}

	.tui-category-item {
		width: 40%;
		height: 118rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		padding-top: 30rpx;
	}

	.tui-category-img {
		height: 80rpx;
		width: 120rpx;
		display: block;
	}

	.tui-category-name {
		display: flex;
		align-items: center;
		text-align: center;
		padding-top: 10upx;
		justify-content: space-between;
		flex-direction: column;
		line-height: 24rpx;
	}


	.tui-pb-20 {
		padding-bottom: 20rpx;
	}

	.tui-bg-white {
		background: #fff;
	}

	/* .tui-group-name {
		margin-top:65rpx;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		padding: 24rpx 0;
	} */
	.tui-activity-box {
		display: flex;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-activity-img {
		width: 50%;
		display: block;
	}

	.tui-new-box {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		border-top:100rpx solid #f7f7f7;
	}
    .tui-container{
		flex: 1;
		margin-right: 10rpx;
		margin-left:15rpx;
	}
	.background {
		width: 100%;
		background: #fff;
		box-sizing: border-box; 
		transition: all 0.15s ease-in-out;
		display: flex; 
		border-bottom: 1px solid #f5f9f7; 
		padding: 15rpx;
	}

	/* .tui-new-item {
		position: relative;
		display:inline-block;
		 width: 45%;
		height: 200rpx;
		padding-bottom:20rpx;
		padding-left:20rpx;
		margin-bottom:40rpx;
		margin-top:115rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: relative;
		border-radius: 12rpx; 
	} */

	.tui-new-mtop {
		margin-top: 2%;
	}

	.tui-title-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		/* padding: 20rpx; */
		padding-left:20rpx;
	}
    .tag-view{
		position: relative;
		justify-content: center;
		/* width:44px; */
		display:flex;
	}
	.othertag-view{
		position: relative;
		justify-content: center;
		display:flex;
		top:35rpx; 
	}
	.tagpicture{
		width:50px;
		height:50px; 
		position:relative;
	}
	.tag-active{
		position: relative;
		justify-content: center;
		opacity:0;
		width:0rpx;
		height:0rpx;
	}
	.title-box{
		position:absolute;
		display:flex;
		right:20rpx;
	}
	.tui-new-title {
		color: #2e2e2e;
		font-size: 26rpx;
		/* word-break: break-all; */
		/* overflow: hidden; */
		/* text-overflow: ellipsis; */
		/* display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; */
	}
    .tui-new-price{
		padding-top: 18rpx;
		padding-bottom: 18rpx;
		display:flex;
	}
	.tui-new-present {
		color: #DF5000; 
		font-weight: 500;
		position:relative;
		left:35rpx;
	}
	.tui-new-present-coin{ 
		color: #DF5000;
		position:relative;
		left:35rpx;
	}

	.tui-number {
		/* padding-top: 5rpx; */
		font-size: 24rpx;
		color: #848689;
	}

	.tui-new-original {
		display: inline-block;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
		transform: scale(0.8);
		transform-origin: center center;
	}

	.tui-right {
		position: absolute;
		z-index: 99;
		left: 70%;
	}

	.tui-new-img {
		display: block;
		width: 215rpx;
		height: 215rpx !important;
		flex-shrink: 0;
		border-radius: 12rpx;
	}

	.tui-new-label {
		width: 56rpx;
		height: 56rpx;
		border-top-left-radius: 12rpx;
		position: absolute;
		left: 0;
		top: 0;
	}

	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		padding-top: 20rpx;
	}

	.tui-product-container {
		flex: 1;
		margin-right: 2%;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 4%;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	}

	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #DF5000;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}
</style>
