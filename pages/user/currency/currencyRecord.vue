<template>
	<!-- 积分页面 -->
	<view class="currencyRecord">
		<view class="first">
			<text class="total_left">剩余积分：</text>
		   <view class="money_container">
			<view class="totalMoney">{{coinNumber}}</view>
			<image class="icon" :src="baseAppUrl+'jifen.png'"></image>
			<view class="giftcontainer" @tap="target('/pages/user/giftcenter/giftcenter')">
				<image class="iconpicture" :src="baseAppUrl+'mall/currency/gift.png'"></image>
				<view class="geticon">礼品兑换</view>
			</view>
			<view class="geticon_container" @tap="showPopup">
				<image class="iconpicture1" :src="baseAppUrl+'mall/currency/icon.png'"></image>
				<view class="geticon1">赚积分</view>
			</view>
		   </view> 
		</view>
		<view class="currencyList">
			<!-- 顶部固定 -->
			<view class="second">
				<ms-dropdown-menu class="menu">
					<ms-dropdown-item class="menuitem" v-model="selectValue" :list="list"></ms-dropdown-item>
				</ms-dropdown-menu>
				<view>
					<view class="getNumber" v-if="selectValue === 1">获取&nbsp;{{getNumber}}</view>
					<view class="useNumber" v-if="selectValue === -1">使用&nbsp;{{useNumber}}</view>
					<view class="totalNumber" v-if="selectValue === 0">
						<view class="totalGet coin">获取&nbsp;{{getNumber}}</view>
						<view class="coin1">使用&nbsp;{{useNumber}}</view>
					</view>
				</view>
			<view class="third"></view>
			</view>
			<!-- 中间数据 -->
			<view class="list" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"  >
				<sib-list ref="sibList" @isRefresh='isRefresh' @scrolltolowerFn="scrolltolowerFn"  :isNoList="isNoList" :noListText="noListText"
				 :floterText="floterText" :scrollHeight="'75vh'">
					<!-- 内部block可自定义 -->
					<block slot="sibScrollList">
						<view class="item" v-for="(item, index) of recordList" :key="index">
							<view class="detail">
								<view class="reason">{{(item.reason=="")?'无':item.reason}}</view>
								<view class="add" v-if="item.action > 0">
									+{{item.action}}
								</view>
								<view class="reduce" v-else>
									{{item.action}}
								</view>
								<view class="time">{{item.modify_date| date}}</view>
							</view>
						</view>
					</block>
				</sib-list>
			</view>
		</view>
		<!--底部选择层-->
		<tui-bottom-popup :show="popupShow" @close="hidePopup">
			<view class="geticon_box">
				<image class="iconimage" :src="baseAppUrl+'mall/currency/icon.png'"></image>
				<view class="top">获取积分</view>
				<image class="top-right" :src="baseAppUrl+'close.png'" @tap="hidePopup"></image>
				<scroll-view class="scroll-Y" scroll-y="true">
					<view class="middle">
						<view class="section" @tap="target1('/pages/cart/cart')">
							<image class="popimage" :src="baseAppUrl+'jiaofei.png'"></image>
							<view class="section_middle">
								<view class="section_title">物业缴费</view>
								<view class="section_content">每10元可获得1积分</view>
							</view>
							<view class="section_right">
								<tui-button type="red" shape="circle" :plain="true" size="mini">去缴费</tui-button>
							</view>
						</view>
						 
						<view class="bottom">完成任务后会获赠积分哦</view> 
					</view>
				</scroll-view>
			</view>
		</tui-bottom-popup>
		<!--底部选择层-->
	</view>
</template>
<script> 
	import sibList from '@/components/sib-list/sib-list.vue'
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import tuiBottomPopup from "@/components/gift/bottom-popup"
	import tuiButton from "@/components/gift/btn"
	import {
		Look_Coin
	} from '@/api/currency.js'
	export default {
		data() {
			return {
				baseAppUrl : this.$mStore.state.BaseAppStaticUrl, 
				coinNumber: '',
				getNumber: '',
				useNumber: '',
				page: 1, //默认第一页
				pagenum: 5, //每页5条 
				allowPullup: true,
				noListText: "暂无数据",
				isNoList: true,
				floterText: "上拉刷新...",
				tag: 0,
				recordList: [], 
				list: [{
						text: '全部',
						value: 0
					},
					{
						text: '获取',
						value: 1
					},
					{
						text: '使用',
						value: -1
					},
				],
				selectValue: 0,
				popupShow: false,
			}
		},
		components: {
			sibList,
			msDropdownMenu,
			msDropdownItem,
			tuiBottomPopup,
			tuiButton,
		}, 
		methods: {
			mine() {
				Look_Coin({
					mine: ''
				}).then((res) => {
					if (res.status == 0) {
						this.coinNumber = res.msg
						if (this.coinNumber === 0) {
							this.coinNumber = "0"
						}
					}
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
			numfilter(tag) {
				Look_Coin({
					number: '',
					tag: tag,
				}).then((res) => {
					if (res.data.status == 0) {
						if (tag == 1) {
							//tag==1,获取积分的数量
							this.getNumber = res.data.get
							if (this.getNumber === 0) {
								this.getNumber = "0"
							}
						} else if (tag == -1) {
							//tag==-1,使用积分的数量
							this.useNumber = res.data.use
							if (this.useNumber === 0) {
								this.useNumber = "0"
							}
						} else if (tag == 0) {
							//tag==0,使用和获取积分的数量
							this.getNumber = res.data.get
							this.useNumber = res.data.use
							if (this.getNumber === 0) {
								this.getNumber = "0"
							}
							if (this.useNumber === 0) {
								this.useNumber = "0"
							}
						}
					}
				})
			},
			target(url) {
				uni.navigateTo({
					url
				})
			},
			target1(url) {
				uni.switchTab({
					url
				})
			},
			// 刷新touch监听
			touchstart: function(e) {
				this.$refs.sibList.refreshStart(e);
			},
			touchmove: function(e) {
				this.$refs.sibList.refreshMove(e);
			},
			touchend: function(e) {
				this.$refs.sibList.refreshEnd(e);
			},
			//下拉刷新函数
			isRefresh: function() {
				//下拉刷新,下拉到顶部再刷新
				this.page = 1;
				this.pagenum = 5;
				//this.getRecords(this.page, this.pagenum, this.tag, true)
				this.getRecords(this.page, this.pagenum, this.selectValue, true)
				uni.showToast({
					icon: 'success',
					title: '刷新成功'
				})
				// 刷新结束调用
				this.$refs.sibList.endAfter()
			},
			//滚动触底函数
		    scrolltolowerFn: function() {
				if (this.allowPullup) {
					uni.showLoading({
						title: '加载中...',
						mask: true
					})
					this.page = this.page + 1;
					//this.getRecords(this.page, this.pagenum, this.tag, false)
					this.getRecords(this.page, this.pagenum, this.selectValue, false)           
					uni.hideLoading()
				}
			},
			getRecords(page, pagenum, tag, fresh = false) {
				Look_Coin({
					"page": page,
					"pagenum": pagenum,
					"tag": tag,
				}).then((
					res
				) => {
					if (res.status == 0) {
						if (fresh) {
							this.recordList = res.msg;
						} else {
							this.recordList = this.recordList.concat(res.msg);
						}
						if (res.msg.length < this.pagenum) {
							this.floterText = "已加载全部，共(" + this.recordList.length + ")条数据"
							this.allowPullup = false;
						} else {
							this.floterText = "上拉加载"
							this.allowPullup = true;
						}
						if (this.recordList.length == 0) {
							this.isNoList = true;
						} else {
							this.isNoList = false
						} 
					}
				});
			},
			onLoad() {
				this.mine();
				this.getRecords(this.page, this.pagenum, this.tag);
				this.numfilter(this.tag)
			}
		},
		watch: {
			selectValue: function() {
				console.log("selectValue：" + this.selectValue)
				this.page = 1;
				this.pagenum = 5;
				this.getRecords(this.page, this.pagenum, this.selectValue, true)
				this.numfilter(this.tag)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon {
		width: 30rpx;
		height: 30rpx;
		position: relative;
		bottom: 0rpx;
	}
	.total_left {
		margin-left: 30rpx;
		font-size: 23rpx;
		color: #bfbfbf;
	}
 
	.totalMoney {
		font-size: 76rpx;
	}

	.money_container {
		width: 700rpx;
		display: flex;
		margin: 0 auto;
		white-space: nowrap;

		.giftcontainer {
			display: inline-block;
			position: absolute;
			left: 500rpx;
			font-size: 32rpx;
			top: 25rpx; 
			width: 140rpx;
			text-align: center; 
			.iconpicture {
				width: 70rpx;
				height: 70rpx; 
			} 
			.geticon { 
				font-size:23rpx;
				color: #bfbfbf;
			}
		}

		.geticon_container {
			display: inline-block;
			position: absolute;
			left: 610rpx;
			font-size: 32rpx;
			top: 25rpx;  
			width: 140rpx;
			text-align: center; 
			.iconpicture1 {
				width: 70rpx;
				height: 70rpx;    
			}

			.geticon1 { 
				font-size:23rpx;
				color: #bfbfbf;
			}
		}

	}

	.third {
		width: 750rpx;
		border-bottom: 5px solid #DF5000;
		position:relative;
	}

	.menuitem {
		width: 120rpx !important;
	}

	.currencyRecord {
        background-color: white;
		.menu {
			float: right;

			.dropdown-item__content .list {
				max-height: 210px;
			}

			.dropdown-item__content .list__option {
				padding: 0rpx 28rpx;
			}
		}

		.getNumber {
			background: #fff;
			padding: 30rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #DF5000;
		}

		.useNumber {
			background: #fff;
			padding: 30rpx;
			font-size: 32rpx;
			font-weight: bold;
		}

		.totalNumber {
			display: flex;

			.coin {
				background: #fff;
				padding: 30rpx;
				font-size: 32rpx;
				font-weight: bold;
				width: 212rpx;
				position:relative;
				top:5rpx;
			}
            .coin1{
				background: #fff;
				padding: 10rpx;
				font-size: 32rpx;
				font-weight: bold;
				width: 212rpx;
				position:relative;
				top:25rpx;
			}
			.totalGet {
				color: #DF5000;
			}
		}

		.currencyList {
			.list {
				//height: 100%;
				text-align: left;	
				.item {
					margin: 5rpx auto;
					height: 180rpx;
					//box-shadow:0px 4rpx 1rpx 1rpx rgba(0, 0, 0, 0.04);
					border-bottom: 1px solid #f5f9f7;

					.detail {
						margin-left: 30rpx;
						margin-right: 30rpx;

						.reason {
							white-space: nowrap;
							font-weight: bold;
							font-size: 30rpx;
							line-height: 100rpx;
							width: 560rpx;

						}

						.add {
							position: absolute;
							right: 30rpx;
							line-height: 0rpx;
							color: #DF5000;
							font-size: 20px;
						}

						.reduce {
							position: absolute;
							right: 30rpx;
							line-height: 0rpx;
							font-size: 20px;
						}

						.time {
							color: #bfbfbf;
						}

					}

				}
			}
		}

		/*底部选择弹层*/
		.geticon_box {
			position: relative;
			padding: 30rpx 0 5rpx 0;
			.iconimage {
				width: 130rpx;
				height: 130rpx;
				top: -70rpx;
				left: 42%;
				border-radius: 50%;
				box-shadow: 2px 2px 2px rgba(132, 134, 137, 0.3);
				border: 1.5px solid #fff;
				position: absolute;
				background: #fff;
			}
            .top-right{
				width:45rpx;
				height:45rpx;
				position:absolute;
				top:25rpx;
				left:90%;
			}
			.top {
				font-size: 28rpx;
				padding-bottom: 10rpx;
				padding-left: 20rpx;
				border-bottom: 1px solid rgba(132, 134, 137, 0.3);
			}
			.scroll-Y{
				height:80vh;
				.middle {
					padding: 20rpx 15rpx;
					.section {
						padding: 20rpx 40rpx;
						background: #DF5000;
						box-shadow:0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
						// border: 1.5px solid #fff;
						border-radius: 15rpx;
						white-space: nowrap;
						margin-bottom:20rpx;
						height:200rpx;
						position:relative;
						.popimage {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
							display: inline-block;
							top:40rpx;
							position:absolute;
						}
						.section_middle {
							display: inline-block;
							left: 170rpx;
							position: relative;
							height:180rpx;
							line-height:35rpx;
							padding:10rpx 0 10rpx 0;
							.section_title {
								color: #fff;
								font-size: 20px;
								position: relative;
							}
							.section_content {
								color: #fff;
								font-size: 25rpx;
								position: relative;
								white-space: normal;
								margin-top:40rpx;
								max-width:300rpx;
							}
						}
						.section_right {
							display: inline-block;
							left: 560rpx;
							position: absolute;
							top: 80rpx;
						}
					}
					.section1 {
						padding: 20rpx 40rpx;
						background: #589bad;
						box-shadow:0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
						// border: 1.5px solid #fff;
						border-radius: 15rpx;
						white-space: nowrap;
						margin-bottom:20rpx;
						height:200rpx;
						position:relative;
						.popimage1 {
							width: 120rpx;
							height: 120rpx;
							background: #fff;
							border-radius: 50%;
							display: inline-block;
							top:40rpx;
							position:absolute;
						}
						.section_middle1 {
							display: inline-block;
							left: 170rpx;
							position: relative;
							height:180rpx;
							line-height:35rpx;
							padding:10rpx 0rpx;
							.section_title1 {
								color: #fff;
								font-size: 27rpx;
								position: absolute;
								top: 30rpx;
							}
							.section_content1 {
								color: #fff;
								font-size: 25rpx;
								position: relative;
								top: 55rpx;
								white-space: normal;
								max-width:310rpx;
							}
						}
						.section_right1 {
							display: inline-block;
							left: 560rpx;
							position: absolute;
							top:80rpx;
						}
					}
					.section2 {
						padding: 20rpx 40rpx;
						background: #fc833c;
						box-shadow:0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
						// border: 1.5px solid #fff;
						border-radius: 15rpx;
						white-space: nowrap;
						margin-bottom:20rpx;
						height:200rpx;
						position:relative;
						.popimage2 {
							width: 120rpx;
							height: 120rpx;
							background: #fff;
							border-radius: 50%;
							display: inline-block;
							top:40rpx;
							position:absolute;
						}
						.section_middle2 {
							display: inline-block;
							left: 170rpx;
							position: relative;
							height:180rpx;
							line-height:35rpx;
							padding:40rpx 0rpx;
							.section_title2 {
								color: #fff;
								font-size: 27rpx;
								position: absolute;
							}
							.section_content2 {
								color: #fff;
								font-size: 25rpx;
								position: relative;
								top: 35rpx;
								white-space: normal;
								max-width:310rpx;
							}
						}
						.section_right2 {
							display: inline-block;
							left: 560rpx;
							position: absolute;
							top:80rpx;
						}
					}
					.section3 {
						padding: 20rpx 40rpx;
						background: #16b971;
						box-shadow:0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
						// border: 1.5px solid #fff;
						border-radius: 15rpx;
						white-space: nowrap;
						margin-bottom:20rpx;
						height:200rpx;
						position:relative;
						.popimage3 {
							width: 120rpx;
							height: 120rpx;
							background: #fff;
							border-radius: 50%;
							display: inline-block;
							top:40rpx;
							position:absolute;
						}
						.section_middle3 {
							display: inline-block;
							left: 170rpx;
							position: relative;
							height:180rpx;
							line-height:35rpx;
							padding:10rpx 0rpx;
							.section_title3 {
								color: #fff;
								font-size: 27rpx;
								position: absolute;
							}
							.section_content3 {
								color: #fff;
								font-size: 25rpx;
								position: relative;
								top: 35rpx;
								white-space: normal;
								max-width:300rpx;
							}
						}
						.section_right3 {
							display: inline-block;
							left: 560rpx;
							position: absolute;
							top:80rpx;
						}
					}
					.section4 {
						padding: 20rpx 40rpx;
						background: #db639b;
						box-shadow:0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
						// border: 1.5px solid #fff;
						border-radius: 15rpx;
						white-space: nowrap;
						margin-bottom:20rpx;
						height:200rpx;
						position:relative;
						.popimage4 {
							width: 120rpx;
							height: 120rpx;
							background: #fff;
							border-radius: 50%;
							display: inline-block;
							top:40rpx;
							position:absolute;
						}
						.section_middle4 {
							display: inline-block;
							left: 170rpx;
							position: relative;
							height:180rpx;
							line-height:35rpx;
							top:-5rpx;
							.section_title4 {
								color: #fff;
								font-size: 27rpx;
								position: absolute;
							}
							.section_content4 {
								color: #fff;
								font-size: 25rpx;
								position: relative;
								top: 35rpx;
								white-space: normal;
								max-width:300rpx;
							}
						}
						.section_right4 {
							display: inline-block;
							left: 560rpx;
							position: absolute;
							top:80rpx;
						}
					}
					.section5 {
						padding: 20rpx 40rpx;
						background: #3dbbd2;
						box-shadow:0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
						// border: 1.5px solid #fff;
						border-radius: 15rpx;
						white-space: nowrap;
						margin-bottom:20rpx;
						height:200rpx;
						position:relative;
						.popimage5 {
							width: 120rpx;
							height: 120rpx;
							background: #fff;
							border-radius: 50%;
							display: inline-block;
							top:40rpx;
							position:absolute;
						}
						.section_middle5 {
							display: inline-block;
							left: 170rpx;
							position: relative;
							height:180rpx;
							line-height:35rpx;
							top:35rpx;
							.section_title5 {
								color: #fff;
								font-size: 27rpx;
								position: absolute;
							}
							.section_content5 {
								color: #fff;
								font-size: 25rpx;
								position: relative;
								top: 35rpx;
								white-space: normal;
								max-width:300rpx;
							}
						}
						.section_right5 {
							display: inline-block;
							left: 560rpx;
							position: absolute;
							top:80rpx;
						}
					}
					.bottom{
						font-size:25rpx;
						position:relative;
						color:rgba(132, 134, 137, 0.3);
						left:32%;
					}
				}
			}
			.tui-icon-close{
				position: absolute;
				top: 30rpx;
				right: 30rpx;
			}
			.tui-icon {
				border-radius: 16px;
			}
		}
		/*底部选择弹层*/
	}
</style>
