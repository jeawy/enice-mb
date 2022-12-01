<template>
	<view class="product">
		<view class="header">
			<image :src="$mAssetsPath.logoWhite" class="logo" mode="widthFix"></image>
			<image :src="$mAssetsPath.productBg" class="bg" mode="aspectFill"></image>
		</view>
		<view class="detail" v-if="productDetail.username">
			<!--阿姨头像-->
			<view class="carousel">
					<view class="image-wrapper">
						<image :src="baseurl+productDetail.thumbnail_portait" class="loaded" mode="aspectFill"></image>
					</view>
			</view>
			<!--底部商品详情-->
			<view class="detail-info">
				<view class="info-header">
					<text>个人介绍</text>
				</view>
				<view class="description">
					<view class="first-col">
						<view>
							<text class="name">{{productDetail.username}}</text>
							<text class="exp">{{productDetail.age}}岁 | {{productDetail.workyears}}年从业经验</text>
						</view>
						<view class="tags">{{productDetail.languages}}</view>
					</view>
					<rich-text :nodes="productDetail.detail | formatRichText" class="desc"></rich-text>
				</view>
			</view>
			<image :src="$mAssetsPath.productBottom" class="bottom-example"></image>
			<!-- 底部操作菜单 -->
			<view class="new_page-bottom">
				<view class="bottom_btn" :class="{active: favorite}" @tap="toFavorite(0)">
					<view><i class="iconfont iconshoucang"></i></view>
					<view class="love ">收藏</view>
					<view> </view>
				</view>
				<view class="action-btn" >
					<button type="primary" class="no-border buy-now-btn" @tap="toInterview('/pages/product/interview?id='+productDetail)">预约</button>
					<button type="primary" class=" no-border order-now-btn" @click="openPopup()">下单</button>
					 
				</view>
			</view>
		</view>
		<!-- 404页面 -->
		<view v-if="!productDetail.username && !loading">
			<rf-no-data :custom="true">
				<view class="no-data-title">
					{{ errorInfo || '暂无数据' }}
				</view>
				<view @tap="getProductDetail(productDetail.id)" slot="refresh" class="spec-color">重新加载</view>
			</rf-no-data>
		</view>
		<!-- 页面加载动画 -->
		<rf-loading v-if="loading"></rf-loading>
	</view>
</template>

<script> 
	import { 
		categoryList
	} from '@/api/product'; 
	 
	import {
		couponReceive
	} from '@/api/userInfo';
	import {productLikes} from '@/api/likes';
	import rfRate from '@/components/rf-rate/rf-rate';
	import rfBadge from '@/components/rf-badge/rf-badge'
	import rfNoData from '@/components/rf-no-data'
	import rfItemPopup from '@/components/rf-item-popup'
	export default {
		components: {
			rfItemPopup,
			rfBadge,
			rfRate, 
			rfNoData, 
		},
		filters: {
			/**
			 * 处理富文本里的图片宽度自适应
			 * 1.去掉img标签里的style、width、height属性
			 * 2.img标签添加style属性：max-width:100%;height:auto
			 * 3.修改所有style里的width属性为max-width:100%
			 * 4.去掉<br/>标签
			 * @param html
			 * @returns {void|string|*}
			 */
			formatRichText(html) { //控制小程序中图片大小
				if (html) {
					let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
						if (match.search(/style=/gi) == -1) {
							match = match.replace(/\<img/gi, '<img style=""');
						}
						return match;
					});
					newContent = newContent.replace(/style="/gi, '$& max-width:100% !important; ');
					newContent = newContent.replace(/<br[^>]*\/>/gi, '');
					return newContent;
				} else {
					return '暂无商品详情'
				}
			}, 
			discountFilter(val) {
				return (val * 10).toFixed(1);
			},
			pointExchangeTypeFilter(val) {
				const type = ['', '非积分兑换', '积分加现金', '积分兑换或直接购买', '只支持积分兑换'];
				return type[parseInt(val, 10)];
			},
			integralGiveTypeFilter(val) {
				const type = ['固定积分', '百分比'];
				return type[parseInt(val, 10)];
			},
			givePointFilter(val) {
				return parseInt(val.integral_give_type, 10) === 1 ?
					Math.round(parseInt(val.give_point, 10) / 100 * parseInt(val.minSkuPrice, 10)) :
					parseInt(val.give_point, 10);
			}
		},
		data() {
			return {
				likes :0,
				cbName:'',
				imgsrc:'',
				specifications: [
				  {
				    name: '雇佣方式',
				    id: null,
				    list: [],
				  }
				],
				combinations: [ ],
				baseurl:"",
				serviceClass: 'none', //服务弹窗css类，控制开关动画
				ladderPreferentialClass: 'none', //服务弹窗css类，控制开关动画
				attributeValueClass: 'none', //scss类，控制开关动画
				specClass: 'none',
				couponClass: 'none',
				cartType: null,
				maskState: 0, //优惠券面板显示状态
				couponList: [],
				productDetail: { },
				styleObject: {},
				showTypeImage: null,
				specSelected: [],
				favorite: false,
				shareList: [],
				currentStock: null,
				currentSkuPrice: null,
				specList: [],
				specChildList: [],
				cartCount: 1,
				product_id: null,
				evaluateList: [],
				hasLogin: null,
				cartNum: null,
				loading: true,
				errorInfo: '',
				headImg: this.$mAssetsPath.headImg,
				isPointExchange: false,
				loveTimes:0,//收藏次数
			};
		},
 
		async onLoad(options) {
			this.$http.get(`${productLikes}`, {
				likestype: 0, // 收藏固定传0
				entity: 1, // 阿姨固定传1
				instanceid: options.id
			}).then((r) => {
				console.log(r)
				 if (r.status == 0){
					 var length = r.msg.length
					 console.log(length)
					 if (length > 0){
						 this.favorite = true
					 }
					 else{
						 this.favorite = false
					 }
				 }
			}) 
			this.initData(options.id); 
			this.baseurl = this.$mStore.state.BaseUrl
			this.imgsrc = this.baseurl

			
			
			// //规格 默认选中第一条
			// this.specList.forEach(item => {
			// 	for (let cItem of this.specChildList) {
			// 		if (cItem.pid === item.id) {
			// 			this.$set(cItem, 'selected', true);
			// 			this.specSelected.push(cItem);
			// 			break; //forEach不能使用break
			// 		}
			// 	}
			// });
			// this.product_id = options.id;
		},
		onShareAppMessage() {
			// #ifdef MP-WEIXIN
			 
			// #endif
			// #ifdef MP-QQ
			return {
				title: this.productDetail.username,
				path: '/pages/product/product?id=' + this.product_id
			}
			// #endif
		},
		methods: {
			openPopup(){
					this.$refs.popup.open();
			},
			closePopup(){
				this.$refs.popup.close();
				uni.navigateTo({
					url:'./create_order'
				});
			},
			toInterview(route){
				uni.setStorageSync('product_detail',this.productDetail)
				this.$mRouter.push({
					route
				});
			},
			navTo(route) {
				if (!this.hasLogin) {
					this.$mHelper.backToLogin();
				} else {
					this.$mRouter.push({
						route
					});
				}
			},
			// 弹窗
			showPopupService(type, list) {
				if (list.length === 0) return;
				this[type] = 'show';
			},
			shareToH5() {
				this.$mHelper.toast('请复制连接进行分享');
			},
			//关闭服务弹窗
			hideService() {
				this.specClass = 'none';
				this.couponClass = 'none';
				this.serviceClass = 'none';
				this.ladderPreferentialClass = 'none';
				this.attributeValueClass = 'none';
			},
			// 获取优惠券
			async getCoupon(item) {
				if (!this.hasLogin) {
					this.maskState = 0;
					this.$mHelper.backToLogin();
					return;
				}
				await this.$http.post(`${couponReceive}`, {
					id: item.id
				}).then(() => {
					this.$mHelper.toast('领取成功');
					this.maskState = 0;
				}).catch(() => {
					this.maskState = 0;
				})
			},
			// 跳转至评价列表
			toEvaluateList() {
				if (!this.productDetail.evaluateStat || parseInt(this.productDetail.comment_num, 10) === 0) return;
				this.$mRouter.push({
					route: `/pages/order/evaluation/list?comment_num=${this.productDetail.comment_num}&evaluateStat=${JSON.stringify(this.productDetail.evaluateStat)}`
				});
			},
			numberChange(data) {
				this.cartCount = data.number;
			},
			// 数据初始化
			async initData(productid) {
				this.hasLogin = this.$mStore.getters.hasLogin;
				this.cartNum = uni.getStorageSync('cartNum');
				this.productDetail.id = productid;
				await this.getProductDetail(productid);
				this.toFavorite(1) // 足迹
			},
			// 获取产品详情
			async getProductDetail(productid) {
				await this.$http.get(`${categoryList}`, {
					productid
				}).then(async r => {
					this.loading = false; 
					this.productDetail = r.msg;
					this.productDetail.languages  = this.productDetail.languages.join(' ');
					this.cbName = r.msg.productname;
					this.cbProductImage = this.baseurl + r.msg.thumbnail_portait
					for(var i=0;i<r.msg.rules.length;i++){ 
						let data = {}
						data.value = r.msg.rules[i].name
						data.id = r.msg.rules[i].id;
						data.price = r.msg.rules[i].price; 
						this.combinations.push(data)
						this.specifications[0].list.push(data.value)
					}
					// console.log(r)
					// this.evaluateList = await r.data.evaluate;
					// this.favorite = this.productDetail.myCollect ? true : false;
					// this.specList = this.productDetail.base_attribute_format
					// this.specList.forEach(item => {
					// 	this.specChildList = [...this.specChildList, ...item.value]
					// });
					/**
					 * 修复选择规格存储错误
					 * 将这几行代码替换即可
					 * 选择的规格存放在specSelected中
					 */
					// this.specSelected = [];
					// r.data.base_attribute_format.forEach(item => {
					// 	item.value[0].selected = true
					// 	this.specSelected.push(item.value[0]);
					// });
					// let skuStr = [];
					// this.specSelected.forEach(item => {
					// 	skuStr.push(item.base_spec_value_id)
					// })
					// this.productDetail.sku.forEach(item => {
					// 	if (item.data === skuStr.join('-')) {
					// 		this.currentStock = item.stock;
					// 		this.currentSkuPrice = item.price;
					// 		return;
					// 	}
					// })
				}).catch(err => {
					this.loading = false;
					this.errorInfo = err;
				})
			},
			//规格弹窗开关
			toggleSpec() {
				if (!this.productDetail.id) return;
				if (this.specClass === 'show') {
					if (!this.hasLogin) {
						this.specClass = 'none';
						this.$mHelper.backToLogin();
						return;
					}
					if (this.specSelected.length < this.productDetail.base_attribute_format.length) {
						this.$mHelper.toast('请先选择规格');
						return;
					}
					const skuStr = [];
					let sku_id = '';
					this.specSelected.forEach(item => {
						skuStr.push(item.base_spec_value_id)
					})
					this.productDetail.sku.forEach(item => {
						if (item.data === skuStr.join('-')) {
							sku_id = item.id;
							this.currentStock = item.stock;
							this.currentSkuPrice = item.price;
						}
					});
					if (parseInt(this.currentStock, 10) === 0) {
						this.$mHelper.toast('库存不足');
						return;
					}
					if (this.cartType === 'cart') {
						 
					} else if (this.cartType === 'buy') {
						this.buy(sku_id);
					}
					this.cartType = null;
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			hideSpec() {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			},
			 
			//选择规格
			selectSpec(index, pid, type) {
				let list = this.specChildList;
				list.forEach(item => {
					if (item.base_spec_id === pid) {
						this.$set(item, 'selected', false);
					}
				})
				if (parseInt(type, 10) === 3) {
					this.showTypeImage = list[index].data;
				}
				if (parseInt(type, 10) === 2) {
					this.styleObject = {
						color: list[index].data
						// border: `1px solid ${list[index].data}`,
					};
				}
				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})
				let skuStr = []
				this.specSelected.forEach(item => {
					skuStr.push(item.base_spec_value_id)
				})
				this.productDetail.sku.forEach(item => {
					if (item.data === skuStr.join('-')) {
						this.currentStock = item.stock;
						this.currentSkuPrice = item.price;
						return;
					}
				});
			},
			// 收藏
			async toFavorite(liketype = 0) { 
				this.$http.post(`${productLikes}`, {
					liketype: liketype, // 收藏固定传0
					entity: 1, // 阿姨固定传1
					instanceid: this.productDetail.id 
				}).then((r) => {
					console.log(r)
					if (liketype == 0){
						// 收藏
						if (r.status == 0){
							var likeid = parseInt( r.id) 
							if (likeid > 0){
								this.favorite = true
							}
							else{
								this.favorite = false
							}
							
						}
					}
					else{
						// 足迹
					}
				})
				
			},
		  
			async buy(sku_id) {
				const list = {};
				const data = {};
				data.sku_id = sku_id;
				data.num = this.cartCount;
				if (this.productDetail.point_exchange_type == 2 || this.productDetail.point_exchange_type == 4 || (this.productDetail
						.point_exchange_type == 3 && this.isPointExchange)) {
					list.type = 'point_exchange';
				} else {
					list.type = 'buy_now';
				}
				list.data = JSON.stringify(data);
				this.$mRouter.push({
					route: `/pages/order/create/order?data=${JSON.stringify(list)}`
				});
			},
			addCart(type, isPointExchange) {
				if (!this.productDetail.id) return;
				this.specClass = 'show';
				this.cartType = type;
				this.isPointExchange = isPointExchange;
			},
			stopPrevent() {}
		}
	}
</script>

<style scoped lang='scss'>
	.header {
		.bg {
			width: 100%;
			min-height: 300px;
			position: relative;
		}
		.logo {
			width: 150px;
			position: absolute;
			left: 0;
			right: 0;
			margin: 0 auto;
			top: 20px;
			z-index: 2;
		}
	}
	page {
		background: #FFFFFF;
	}
	.product{
		background: #FFFFFF;
		height: 120vh;
	}
	.detail {
		/* padding-bottom: 160rpx; */
	}
	.bottom-example {
		position: absolute;
		display: block;
		left: 0;
		right: 0;
		top: 450px;
		margin: 0 auto;
	}
	.carousel {
		/* height: 722rpx; */
		position: absolute;
		top: 60px;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 2;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			background: transparent;
			width: 100%;
			padding: 24rpx 20rpx 0 18rpx;
			text-align: center;
			.loaded{
				border-radius: 50%;
				width: 306rpx;
				height: 306rpx;
			}
		}
		.card_text{
			margin-top: 20rpx;
			display: block;
			justify-content: center;
			width: 100%;
			.name{
				text-align: center;
				font-family: Tensentype MingSongJ-W8;
				font-size: 24rpx;
				font-style: normal;
				font-weight: 900;
				line-height: 28.8rpx;
				letter-spacing: 0em;
			}
			.text_middle{
				line-height: 24rpx;
				margin: 12rpx 0;
				text-align: center;
				width: 100%;
				.sex_img{
					width: 12rpx;
					height: 19.58rpx;
					align-items: center;
					margin: 0 4rpx;
				}
				
			}
			.line{
				margin: 0 8rpx;
				height: 24rpx;
				line-height: 20rpx;
			}
			.language{
				line-height: 24rpx;
				text-align: center;
			}
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: $font-lg;
			color: $font-color-dark;

			.tag {
				margin-left: 20upx;
			}
		}

		.data {
			display: flex;
			justify-content: space-between;
			margin: 5upx 15% 0;
			font-size: $font-base;
			color: $font-color-base;

			.item {
				height: 50upx;
				line-height: 50upx;
			}

			.iconfont {
				color: $font-color-light;
				margin-right: 10upx;
			}
		}

		.sketch {
			margin-top: 10upx;
			display: block;
			color: $font-color-light;
			font-size: $font-base;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $base-color;
		}

		.point-box {
			color: $font-color-base;

			.price {
				color: $base-color;
				margin-left: 10upx;
			}
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(to left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.iconxingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
			background: none;
		}

		.share-btn:after {
			border: none;
		}

		.iconyou {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;

			.buy-now {
				color: $uni-color-primary;
			}
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.con {
				padding: 0;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.iconyou {
				margin-left: 10upx;
			}
		}

		.eva-box {
			display: flex;
			padding: 20upx 0;

			.portrait {
				flex-shrink: 0;
				width: 80upx;
				height: 80upx;
				border-radius: 100px;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				font-size: $font-base;
				color: $font-color-base;
				padding-left: 26upx;

				.con {
					font-size: $font-base;
					color: $font-color-dark;
				}

				.bot {
					display: flex;
					justify-content: space-between;
					font-size: $font-sm;
					color: $font-color-light;
				}

				.name {
					align-items: center;
					display: flex;
					justify-content: space-between;
				}
			}
		}
	}

	/*  详情 */
	.detail-info{
		position: absolute;
		left: 0;
		right: 0;
		top: 230px;
		width: 90%;
		box-shadow: 1px 1px 5px rgba(0,0,0,.2);
		margin: 0 auto;
		
		.description {
			padding: 10px;
			.first-col {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 15px;
				
				.name {
					font-size: 20px;
					font-weight: 600;
				}
				.exp {
					margin-left: 10px;
				}
				.tags {
					color: #ff8400;
					font-weight: 600;
				}
			}
			.desc {
					font-size: 10px;
			}
		}
	}
	.detail-work{
		
	}
	.detail-desc ,.detail-info,.detail-work{
		background: #fff;
		margin-top: 16upx;

		.d-header,.info-header,work-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
			background: linear-gradient(to left top, #ec7131, #ee8044);

			text {
				padding: 0 20upx;
				color: #fff;
				position: relative;
				z-index: 1;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.select-count {
			padding: 30upx 0 10upx;
			margin: 20upx 0;
			border-top: 1px solid #ccc;
			display: flex;
			justify-content: space-between;
			overflow: hidden;
			position: relative;
			font-size: $font-base + 6upx;
			color: $font-color-base;
			line-height: 60upx;

			.step {
				position: absolute;
				left: 60vw;
				bottom: 10upx;
			}
		}

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 15upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 10upx 0 0;
			display: flex;
			flex-wrap: wrap;

			.tit {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;

				.img {
					width: 36upx;
					height: 24upx;
					margin: 0 4upx;
				}
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	.new_page-bottom{
		position: fixed;
		bottom: 0;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100rpx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		
		/* border-radius: 16upx; */
		.cart {
			position: relative;
		
			.badge {
				position: absolute;
				top: -8upx;
				right: 0upx;
			}
		}
		.bottom_btn{
			widows: 35%;
			padding-left: 20rpx;
			display: flex;
			align-items: center;			
			font-size: $font-sm;
			color: $font-color-base;			
			height: 80upx;
			display: flex;			
			align-items: center;
			justify-content: center;			
			.iconfont {
				font-size: 36upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			
			&.active,
			&.active .iconfont {
				color: $uni-color-primary;
			}
			
			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			
			.iconshoucang {
				font-size: 40upx;
			}
			
			.icondanseshixintubiao- {
				font-size: 46upx;
			}
			
			.red {
				color: $base-color;
			}
			.love{
				margin-left: 20rpx;
				margin-right: 20rpx;
			};
		}
		.action-btn{
			height:100%;
			width:65%;
			display: flex;			
			overflow: hidden;
			align-items: center;
			justify-content: center;
			.buy-now-btn,
			.order-now-btn{
				height:100%;
				width:50%;
				background: #FF8D0E;
				display: flex;			
				overflow: hidden;
				border-radius: 0px;
				align-items: center;
				justify-content: center;
			}
			.order-now-btn{
				border-left:1px solid white;
			}
		}
	}
	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.cart {
			position: relative;

			.badge {
				position: absolute;
				top: -8upx;
				right: 0upx;
			}
		}
		.p-b-btn{
			width: 96upx;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-base;			
			height: 80upx;
			display: flex;			
			align-items: center;
			justify-content: center;			
			.iconfont {
				font-size: 36upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .iconfont {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.iconshoucang {
				font-size: 40upx;
			}

			.icondanseshixintubiao- {
				font-size: 46upx;
			}

			.red {
				color: $base-color;
			}
		}
		.action-btn{
			height:100%;
			width: 65%;
			display: flex;			
			overflow: hidden;
			align-items: center;
			justify-content: center;
			background: #F56C6C;
			// box-shadow: 0 20upx 40upx -16upx #fa436a;
			// box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			// background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			// margin: 0 20upx;
			// position: relative;
		}
		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin: 0 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}

	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;

		.content {
			width: 100%;
			padding: 20upx 0;
		}

		.btn {
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			background: $uni-color-primary;
			font-size: $font-base + 2upx;
			color: #fff;
			margin: 30upx 30upx 20upx;
		}
	}

	.service {
		padding: $spacing-base $spacing-lg 0;

		.row {
			margin-bottom: $spacing-base;

			.title {
				font-size: $font-lg;
			}

			.description {
				font-size: $font-base;
			}
		}
	}

	.selected-text {
		margin-right: 4upx;
	}

	.sub-list {
		margin: 40upx 0 80upx;

		.row {
			width: 100%;
			margin-bottom: $spacing-lg;
		}
	}
</style>
