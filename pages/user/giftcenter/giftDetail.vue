<template>
	<!-- 礼品详情页 -->
	<view class="container">
		<!--轮播图-->
		<view class="tui-banner-swiper" >
			<swiper :autoplay="true" :interval="5000" :duration="150" :circular="true" :style="{height:scrollH + 'px'}" @change="bannerChange">
				<!-- <view v-for="(it,ind) in turns" :key="ind"> -->
				<swiper-item  @tap.stop="previewImage">
						<image :src="imageUrl+ picture" class="tui-slide-image" :style="{height:scrollH+'px'}" />
					</swiper-item>
				<!-- </view> -->
			</swiper>
			<!--轮播图-->
			<!--礼品信息-->
			<view class="tui-pro-detail">
				<view class="tui-product-title tui-border-radius">
					<view class="tui-pro-pricebox tui-padding">
						<view class="tui-pro-price">
							<view  class="title-box">
							<view v-if="newtag"  class="tag-view" >
								<image class="tagpicture" src="/static/new2.png"></image>
							</view>
							<view v-if="othertag" class="othertag-view" >
								<uni-tag :text="tag" type="primary" :circle="true" size="small"/>
							</view>
							</view>
							<text class="tui-price">{{defaultName}}</text>
							<!-- <tui-tag class="tui-btn" size="small" :plain="true" type="high-green" shape="circle">新品</tui-tag> -->
						</view>
					</view>
					<view class="tui-pro-titbox">
						<view class="outner">
							<image class="icon" :src="baseAppUrl+'jifen.png'"></image>
							<view class="tui-pro-title">积分：{{!click?defaultCoin:coin}}</view>
						</view>
						<view class="tui-pro-title1">剩余库存：{{!click?defaultNum:num}}</view>
					</view>
				</view>
				<view class="tui-basic-info tui-mtop tui-radius-all">
					<view class="tui-list-cell">
						<view class="tui-bold tui-cell-title">已选</view>
						<view class="tui-selected-box">{{!click?defaultTitle:name}}</view>
						<tui-icon name="more-fill" :size="20" class="tui-right" color="#666" @tap="showPopup"></tui-icon>
					</view>
					<view class="tui-list-cell tui-last">
						<view class="tui-bold tui-cell-title">说明</view>
						<view class="tui-selected" v-html="!click?defaultContent:content"></view>
					</view>
				</view>
			</view>
		</view>
		<!--礼品信息-->
		<!--底部操作栏-->
		<view class="tui-operation">
			<view class="tui-operation-left  tui-btnbox-3">
				<!--<tui-button type="warning" shape="circle" size="mini" @click="showPopup">选择规格</tui-button>-->
			</view>
			<view class="tui-operation-right tui-right-flex  tui-btnbox-3">
				<view class="tui-flex-1">
					<tui-button type="danger" shape="circle" size="mini" @click="showPopup">选择规格</tui-button>
				</view>
				<view class="tui-flex-2">
					<!--<tui-button type="warning" shape="circle" size="mini" @click="submit">购买礼品</tui-button>-->
					<tui-button type="warning" shape="circle" size="mini" @click="charge">兑换礼品</tui-button>
				</view>
			</view>
		</view>
		<view class="rdetail"  >
		<rich-text :nodes="content" 
				width="700rpx"></rich-text> 
		</view>
		<!--底部操作栏-->
		<!--底部选择层-->
		<tui-bottom-popup :show="popupShow" @close="hidePopup">
			<view class="tui-popup-box">
				<view class="tui-product-box tui-padding">
					<image :src="imageUrl+picture" class="tui-popup-img"></image>
					<view class="tui-popup-price" v-for="(item,index) in Specifications" :key="index">
						<view v-if="index == dynamic">
							<view class="tui-detail">
								<image class="icon1" :src="baseAppUrl + 'jifen.png'"></image>
								<view class="tui-amount tui-bold">积分:{{!click?defaultCoin:coin}}</view>
							</view>
								<view class="tui-number">编号:{{!click?defaultid:giftid}}</view>
								<view class="tui-number">库存:{{!click?defaultNum:num}}</view>
						</view>
					</view>
				</view>
				<scroll-view scroll-y class="tui-popup-scroll">
					<view class="tui-scrollview-box">
						<view class="tui-text">
							<view class="tui-bold tui-attr-title">类型</view>
						</view>
						<view class="tui-attr-box" v-for="(item,index) in Specifications" :key="index">
							<view class="tui-attr-item" :class="{colorChange:index==dynamic}" @click="getType(index,item)">
								<view class="tui-title">
									{{item.name}}
								</view>
								<view class="tui-padding">
									<view class="tui-sub-title tui-size">{{item.content}}</view>
								</view>
							</view>
						</view>
						<!-- <view class="tui-number-box tui-bold tui-attr-title">
							<view class="tui-attr-title">数量</view>
							<tui-numberbox :max="10" :min="1" :value="value" @change="change"></tui-numberbox>
						</view> -->
					</view>
				</scroll-view>
				<view class="tui-left-flex ">
					<view class="tui-flex-2">
						<view class="giftbutton"  @click="hidePopup">确定</view>
					</view>
				</view>
				<view class="tui-icon tui-icon-close-fill tui-icon-close" style="color: #999;font-size:20px" @tap="hidePopup"></view>
			</view>
		</tui-bottom-popup>
		<!--底部选择层-->

	</view>
</template>

<script> 
	import tuiBadge from "@/components/gift/badge"
	import tuiNomore from "@/components/gift/nomore"
	import tuiButton from "@/components/gift/button"
	import tuiTopDropdown from "@/components/gift/top-dropdown"
	import tuiBottomPopup from "@/components/gift/bottom-popup"
	import tuiNumberbox from "@/components/gift/numberbox"
	import {
		getGifts,
		look_GiftSpecifications,
	} from '@/api/giftcenter';
	export default {
		components: { 
			tuiBadge,
			tuiNomore,
			tuiButton,
			tuiTopDropdown,
			tuiBottomPopup,
			tuiNumberbox
		},
		data() {
			return {
				baseAppUrl:this.$mStore.state.BaseAppStaticUrl, 
				height: 64, //header高度
				top: 0, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				popupShow: false,
				value: 1,
				collected: false,
				click: false,
				uuid: '',
				dynamic: 0,
				GiftList: [],
				Specifications: [],
				picture: [],
				price: '',
				coin: '',
				num: '',
				name: '',
				content: '',
				Image: [],
				imageUrl: '',
				defaultPrice: '',
				defaultNum: '',
				defaultCoin: '',
				defaultName: '',
				defaultContent: '',
				defaultTitle:'',
				defaultid:'',
				giftid:'',
				newtag:false,
				tag:'',
				othertag:false,
				hasLogin:false,
			}
		},
		onLoad: function(options) {
			let obj = {};
			this.uuid = options.uuid;
			setTimeout(() => {
				uni.getSystemInfo({
					success: (res) => {
						this.width = obj.left || res.windowWidth;
						this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
						this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
						this.scrollH = res.windowWidth

					}
				})
			}, 50)
			this.getGiftDetail(); 
			this.hasLogin = this.$mStore.getters.hasLogin;
		},
		 
		methods: {
			//获取礼品列表
			getGiftDetail() {
				getGifts({
					uuid: this.uuid
				}).then(({
					status, msg
				}) => {
					if ( status == 0) {
						console.log(msg)

						this.Specifications = msg.specifications; 
						this.giftid = this.Specifications[0].id;
						this.defaultTitle = this.Specifications[0].name;
						this.defaultNum = this.Specifications[0].number;
						this.defaultContent = this.Specifications[0].content;
						this.defaultCoin = this.Specifications[0].coin;
						this.defaultid = this.Specifications[0].id;
                        this.picture = msg.picture
						console.log(this.picture) 
						this.imageUrl = this.$mStore.state.BaseUrl
						this.content = msg.content
					}
				})
			},
			 
			//类型：点击添加字体颜色，其他的删除class名称
			getType: function(index, item) {
				this.click = true;
				this.dynamic = index;
				this.giftid = item.id;
				// this.price = item.price;
				this.coin = item.coin;
				this.num = item.number;
				this.name = item.name;
				this.content = item.content;
			},
			//轮播图切换
			bannerChange: function(e) {
				this.turnsIndex = e.detail.current
			},
			//点击查看轮播图图片
			previewImage: function(e) {
				let index = e.currentTarget.dataset.index;
				uni.previewImage({
					current: this.Image[index],
					urls: this.Image,
				})
			},
			//显示底部弹出框
			showPopup: function() {
				this.popupShow = true;
			},
			//隐藏底部弹出框
			hidePopup: function() {
				this.popupShow = false;
			},
			change: function(e) {
				this.value = e.value
			},
			// submit() {
			// 	this.popupShow = false;
			// 	if (this.click == true) {
			// 		uni.navigateTo({
			// 			url: "../giftcenter/submit?id=" + this.id + "&price=" + this.price + "&name=" + this.name +
			// 				"&content=" + this.content + "&picture=" + this.picture
			// 		})
			// 	} else {
			// 		uni.navigateTo({
			// 			url: "../giftcenter/submit?id=" + this.id + "&price=" + this.defaultPrice + "&name=" + this.defaultName +
			// 				"&content=" + this.defaultContent + "&picture=" + this.picture
			// 		})
			// 	}
			// },
			charge() {
				this.popupShow = false;
				if(this.hasLogin){
					if (this.click == true) {
						uni.navigateTo({
							url: "../giftcenter/giftcharge?id=" + this.giftid + "&price=" + this.coin + "&name=" + this.name +
								"&content=" + this.content + "&picture=" + this.picture
						})
					} else {
						uni.navigateTo({
							url: "../giftcenter/giftcharge?id=" + this.giftid + "&price=" + this.defaultCoin + "&name=" + this.defaultTitle +
								"&content=" + this.defaultContent + "&picture=" + this.picture
						})
					}
				}else{
					uni.navigateTo({
						url: "/pages/login/login-page"
					})
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	/* icon 也可以使用组件*/  
	page {
		background: #f7f7f7;
	}

	.container {
		padding-bottom: 110rpx;
	}
    .rdetail{ 
		margin-top:25rpx;
		border-radius: 30rpx;
		background-color: white;
		padding:25rpx;
		margin-bottom:45rpx;
	}
	.colorChange {
		background: #fcedea !important;
		color: #DF5000;
		font-weight: bold;
		position: relative;
		border-radius: 40rpx;
		border: 1rpx solid #DF5000;
	}

	.tui-icon {
		border-radius: 16px;
	}


	.tui-icon-back {
		height: 32px !important;
		width: 32px !important;
		display: block !important;
	}

	.tui-header-icon .tui-icon-more-fill {
		height: 20px !important;
		width: 20px !important;
		padding: 6px !important;
		display: block !important;
	}

	.tui-banner-swiper {
		position: relative;
	}

	.tui-banner-swiper .tui-tag-class {
		position: absolute;
		color: #fff;
		top: 10rpx;
		right: 0;

	}

	.tui-slide-image {
		width: 100%;
		display: block;
	}

	/*内容 部分*/

	.tui-padding {
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-size {
		font-size: 25rpx;
		line-height: 30rpx;
	}

	.tui-border-radius {
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
	}

	.tui-radius-all {
		border-radius: 24rpx;
		overflow: hidden;
	}

	.tui-mtop {
		margin-top: 26rpx;
	}

	.tui-pro-detail {
		box-sizing: border-box;
		color: #333;
	}

	.tui-product-title {
		background: #fff;
		padding: 30rpx 0;
	}

	.tui-pro-pricebox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* color: #ff201f; */
		font-size: 36rpx;
		/* font-weight: bold; */
		line-height: 44rpx;
	}

	.tui-pro-price {
		display: flex;
		align-items: center;
	}

	.tui-pro-price .tui-tag-class {
		transform: scale(0.7);
		/* transform-origin: center center; */
		line-height: 24rpx;
		font-weight: normal;
		margin-left: 10upx;
		margin-top: 500upx;
	}

	.tui-price {
		font-size: 36rpx;
	}

	.tui-pro-titbox {
		font-size: 28rpx;
		font-weight: 500;
		position: relative;
		padding: 0 150rpx 0 30rpx;
		box-sizing: border-box;
	}

	.outner {
		display:flex;
		position: relative;
		padding-top: 20rpx;
	}
    .title-box{
		position:absolute;
		display:flex;
		right:10rpx;
	}
	.tag-view{
		position: relative;
		justify-content: center;
		display:flex;
	}
	.tagpicture{
		width:50px;
		height:50px; 
		position:relative;
	}
	.othertag-view{
		position: relative;
		justify-content: center;
		display:flex;
		top:35rpx; 
	}
	.tag-active{
		position: relative;
		justify-content: center;
		opacity:0;
		width:0rpx;
		height:0rpx;
	}
	.icon {
		width: 32.5rpx;
		height: 32.5rpx;
		display: inline-block;
		position:relative;
		top:5rpx;
	}

	.icon1 {
		width: 32.5rpx;
		height: 32.5rpx;
		display: inline-block;
		position: relative;
		margin-bottom: 15rpx;
	}

	.tui-pro-title {
		display: inline-block;
		color: #DF5000;
		position: relative;
		top: 3rpx;
	}

	.tui-pro-title1 {
		padding-top: 20rpx;
		display: flex;
	}

	.tui-sub-title {
		position:relative;
		max-width:450rpx;
	}

	.tui-list-cell {
		position: relative;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		line-height: 26rpx;
		padding: 36rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-selected-box {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 60%;
	}
    .tui-selected {
		line-height: 35rpx;
	}
	.tui-right {
		position: absolute;
		right: 30rpx;
		top: 30rpx;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 126rpx;
	}

	.tui-last::after {
		border-bottom: 0 !important;
	}

	.tui-cell-title {
		width: 100rpx;
		padding-right: 30rpx;
		flex-shrink: 0;
	}

	.tui-basic-info {
		background: #fff;
	}

	/*底部操作栏*/
	.tui-operation {
		width: 100%;
		/* box-sizing: border-box; */
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 0; 
		left: 0;
		padding: 20rpx 15rpx 58rpx 0rpx;
	}

	.tui-operation::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-operation-left {
		display: flex;
		align-items: center;
	}

	.tui-operation-right {
		/* box-sizing: border-box; */
		padding-top: 0;
	}

	.tui-right-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-btnbox-3 .tui-btn-class {
		width: 100%;
		display: block !important;
		font-size: 28rpx !important;
	}

	.tui-operation .tui-badge-class {
		position: absolute;
		top: -6rpx;
		/* #ifdef H5 */
		transform: translateX(50%)
			/* #endif  */
	}

	.tui-flex-1 {
		flex: 1;
		margin-right: 50rpx;
	}

	.tui-flex-2 {
		flex: 1;
	}

	/*底部操作栏*/

	/*底部选择弹层*/

	.tui-popup-box {
		position: relative;
		padding: 30rpx 0 100rpx 0;
	}

	.tui-left-flex {
		width: 100%;
		/* box-sizing: border-box; */
		background: rgba(255, 255, 255, 0.98);
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
		bottom: 10;
		left: 0;
		padding-top: 15rpx;
		padding-bottom: 3rpx;
	}

	.tui-left-flex ::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-popup-btn .tui-btn-class {
		width: 90%;
		position: relative;
		display: block !important;
		font-size: 28rpx !important;
	}
    .giftbutton{
		position:relative;
		width:90%;
		padding:15rpx;
		color:#fff;
		background-color: #FD5000;
		height:70rpx;
		text-align:center;
		left:5%;
		border-radius:30rpx;
	}
	.tui-icon-close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	}

	.tui-product-box {
		display: flex;
		align-items: flex-end;
		font-size: 24rpx;
		padding-bottom: 30rpx;
	}

	.tui-popup-img {
		height: 200rpx;
		width: 200rpx;
		border-radius: 24rpx;
		display: block;
	}

	.tui-popup-price {
		padding-left: 20rpx;
		padding-bottom: 8rpx;
		position:absolute;
		left:240rpx;
		top:60rpx;	
	}

	.tui-detail {
		position: relative;
		white-space: nowrap;
	}

	.tui-amount {
		color: #DF5000;
		font-size: 36rpx;
		display: inline-block;
	}

	.tui-number {
		font-size: 24rpx;
		line-height: 24rpx;
		padding-top: 12rpx;
		color: #999;
	}

	.tui-popup-scroll {
		height: 600rpx;
		font-size: 26rpx;
	}

	.tui-scrollview-box {
		padding: 0 30rpx 60rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-attr-title {
		padding: 10rpx 0;
		color: #333;
	}

	.tui-attr-box {
		font-size: 0;
		padding: 20rpx 0;
	}

	.tui-attr-item {
		/* max-width: 100%;
		min-width: 200rpx; */
		height: 64rpx;
		align-items: center;
		justify-content: center;
		background: #f7f7f7;
		padding: 0 26rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		font-size: 26rpx;
		display:inline-flex;
	}
    .tui-title{
		position:relative;
	    max-width:300rpx;
		white-space: nowrap;
	}
	.tui-number-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 0 30rpx 0;
		box-sizing: border-box;
	}

	/*底部选择弹层*/
</style>
