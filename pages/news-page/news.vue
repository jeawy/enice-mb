<!-- 主页 Enice -->
<template>
	<view class="news-container">
		<uni-search-bar @focus="focus" :radius="30" bgColor="#FAFAFA" cancelButton="none" clearButton="none"
			placeholder="New Model S"></uni-search-bar>
		<view class="news-message">
			<image class="news-message-icon" src="/static/img/msg.svg" mode=""></image>
			<text class="news-message-text">New Telsa Model S will be released in 08/09/2022dsadsadsadsa</text>
		</view>
		<view class="car-home-swiper">
			<swiper class="swiper" circular indicator-dots :duration="500">
				<swiper-item class="swiper-item">
					<image class="swiper-item-image" src="/static/img/home/1.png">A</image>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-green">B</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-blue">C</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="card-group">
			<view class="child-card-group">
				<view class="upcoming-card" @click="toUpcoming">
					<view class="card-text">
						Upcoming
					</view>
				</view>
				<view class="brand-card">
					<view class="card-text">
						Brand
					</view>
				</view>
			</view>
			<view class="hot-card">
				<view class="card-text">
					Hot
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				items: ['Follow', 'Live', 'Popular', 'Latest', 'Nearby']
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
			toUpcoming(){
				uni.navigateTo({
					url:'/pages/news-page/upcoming'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
		
	}

	.news-container {
		padding: 0 40upx;
		padding-bottom: 210upx;
		$radius:30upx;
		
		.card-group{
			display:flex;
			align-items: stretch;
			justify-content: space-between;
			color:#fff;
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 700;
			%after-line{
				position: relative;
				&::after{
					content: ' ';
					position: absolute;
					bottom: 6upx;
					left: 0;
					width: 100%;
					height:2upx;
					background-color: #fff;
				}
			}
			.child-card-group{
				width: 320upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.upcoming-card{
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(315.5deg, #359BBB 7.63%, #98C5D3 96.88%);
					height:142upx;
					border-radius: $radius;
					.card-text{
						font-size: 40upx;
						@extend %after-line;
					}
				}
				.brand-card{
					border-radius: $radius;
					height: 156upx;
					background: linear-gradient(273.66deg, #E9C98D 5.8%, #FBD488 99.38%);
					/* inner */
					box-shadow: 0px 4px 8px -2px rgba(0, 0, 0, 0.08), inset 0px 11px 16px -4px rgba(0, 0, 0, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					.card-text{
						font-size: 40upx;
						@extend %after-line;
					}
				}
			}
			.hot-card{
				border-radius: $radius;
				background: linear-gradient(180deg, #BC3D35 0.66%, #F39691 100%);
				padding: 40upx;
				width: 320upx;
				height:320upx;
				.card-text{
					font-size: 48upx;
					display: inline-block;
					@extend %after-line;
				}
			}
		}

		.news-message{
			margin: 30upx 0 20upx;
			display: flex;
			align-items: center;
			.news-message-icon{
				flex: 0 0 auto;
				margin-right:13upx;
				width: 25upx;
				height: 25upx;
			}
			.news-message-text{
				min-width: 0%;
				flex: 1;
				overflow:hidden;//超出的隐藏
				text-overflow:ellipsis;//省略号
				white-space:nowrap;//强制一行显示
				color: #999999;
				font-size: 20upx;
			}
		}

		::v-deep .uni-searchbar {
			padding: 0;

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

		uni-swiper {
			height: auto;
			margin-bottom: 48upx;
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

	}
</style>
