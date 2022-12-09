<!-- 主页 Enice -->
<template>
	<view class="car-home">
		<view class="car-home-header">
			<view class="car-home-logo">
				<image class="logo-top" src="/static/img/home/Vector.png" mode="aspectFit"></image>
				<image class="logo-text" src="/static/img/home/logo.png" mode="aspectFit"></image>
			</view>
			<uni-search-bar @focus="focus" :radius="30" bgColor="#FAFAFA" cancelButton="none" clearButton="none"
				placeholder="New Model S"></uni-search-bar>
		</view>

		<view class="car-home-swiper">
			<swiper class="swiper" circular indicator-dots :duration="500" autoplay>
				<swiper-item class="swiper-item">
					<image class="swiper-item-image" src="/static/img/home/1.png">A</image>
				</swiper-item> 
			</swiper>
		</view>

		<view class="sub-menu">
			<view class="custom-segmented">
				<view class="custom-segmented-item" v-for="(item,idx) of items" :key="idx"
					@click="onSegmentedChange(idx)">
					{{item}}
					<view class="underline" v-if="current===idx"></view>
				</view>
			</view>
			<uni-icons type="bottom" color="#333333" size="14"></uni-icons>
		</view>
		<base-card :data="card1"></base-card>
		<base-card :data="card2"></base-card>
	</view>
</template>

// <script>
	export default {
		data() {
			return {
				current: 0,
				items: ['Follow', 'Live', 'Popular', 'Latest', 'Nearby'],
				card1: {
					img: '/static/img/home/2.png',
					title: 'What’s the top 10 Electric car in 2022 ?',
					username: "Abbey",
					profile: '/static/img/home/touxiang.jpg',
					tagType: 0
				},
				card2: {
					img: '/static/img/home/2.png',
					title: 'What’s the top 10 Electric car in 2022 ?',
					username: "Abbey",
					profile: '/static/img/home/touxiang.jpg',
					tagType: 1
				}
			};
		},
		methods: {
			onClickItem() {

			},
			onSegmentedChange(idx) {
				this.current = idx
			},
			focus(e) {
				uni.navigateTo({
					url: '/pages/search-panel/search-panel'
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;

	}

	.car-home {
		padding: 0 40upx;
		padding-bottom: 210upx;

		.base-card+.base-card {
			margin-top: 30upx;
		}

		.car-home-header {
			display: flex;
			align-items: center;
			margin: 20upx 0 40upx;

			.car-home-logo {
				display: flex;
				flex-direction: column;
				align-items: center;

				.logo-top {
					width: 88upx;
					height: 7.08upx;
				}

				.logo-text {
					width: 116.56upx;
					height: 17.88upx;
					margin-top: 6.92upx;
				}
			}

			::v-deep .uni-searchbar {
				flex: 1 1 auto;
				padding: 0;
				margin-left: 24upx;

				.uni-searchbar__box-search-input {
					font-size: 24upx;
					line-height: 36upx;
				}

				.uni-searchbar__box {
					height: auto;
					justify-content: flex-start;
					flex-direction: row-reverse;
					border-color: #FAFAFA;
					backdrop-filter: blur(40px);
					padding: 14upx 40upx;

					.uni-searchbar__text-placeholder {
						flex: 1;
					}
				}
			}
		}

		uni-swiper {
			height: auto;
		}

		::v-deep .uni-swiper-wrapper {
			height: 752upx;

			.uni-swiper-dot {
				width: 8upx;
				height: 8upx;
				background-color: rgba(255, 255, 255, 0.2);

				&.uni-swiper-dot-active {
					background-color: #fff;
				}
			}
		}

		.sub-menu {
			display: flex;
			align-items: center;
			margin: 40upx auto 44upx;
			.custom-segmented {
				flex: 1;
				display: flex;
				justify-content: space-between;
				font-size: 24upx;
				color: #000;
				margin-right: 54upx;
				
				.custom-segmented-item {
					height: 36upx;
					position: relative;
					line-height: 36upx;
					font-weight: 500;

					.underline {
						height: 8upx;
						width: 64upx;
						border-radius: 4upx;
						background: linear-gradient(90deg, #91FFD4 0.77%, #87EBD5 57.12%, #9CFBF8 115.97%);
						position: absolute;
						bottom: -8upx;
						left: calc(50% - 32upx);
					}
				}
			}
		}

	}
</style>
