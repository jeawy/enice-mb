<template>
	<view class="article-page">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="article-page__user">
			<uni-icons type="back" size="14"></uni-icons>
			<image class="user-profile" :src="profile" mode="aspectFit"></image>
			<view class="user-name">Abbey</view>
			<button class="follow-btn">Follow</button>
		</view>


		<!-- 正文轮播 -->
		<view class="article-page-swiper">
			<uni-swiper-dot @clickItem=clickItem :info="info" :current="current" mode="dot" :dots-styles="dotsStyles"
				field="content">

				<swiper circular :indicator-dots="false" :duration="500" @change="change" :current="swiperDotIndex">
					<swiper-item class="swiper-item">
						<image class="swiper-item-image"
							src="https://ts1.cn.mm.bing.net/th/id/R-C.0a5cdd8ac9bf732699799386c01629e5?rik=FwEWrFARh4PQYg&riu=http%3a%2f%2fwww.tongyuauto.com%2fu%2f56a96cfe-fa23-43a1-a20e-e4e87675e5fa%2fimage%2f636746286797744140.jpg&ehk=CBG3cv8K1cL3TSC79doUSrVo79K2DBDjD%2fXjUYBaauI%3d&risl=&pid=ImgRaw&r=0">
							A</image>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-bg-green">B</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-bg-blue">C</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>


		<view class="article-page__title">
			What’s the top 10 Electric car in 2022 ?
		</view>
		<view class="article-page__body">
			Model 3 comes with the option of dual motor and all-wheel drive, 20” Überturbine Wheels and Performance
			Brakes for total control in all weather conditions.
		</view>

		<view class="article-page__tags">
			<view class="tags-item">
				# Top 10 Car testing from Tesla
			</view>
		</view>

		<view class="article-page__date">
			Edit 09 / 15
		</view>

		<view class="group-title">
			Comments
		</view>

		<view class="reply-item">
			<image class="reply-item-profile" :src="profile" mode="aspectFit"></image>

			<view class="reply-item-user">
				<view class="reply-user-name">
					Margaret
				</view>
				<view class="reply-content">
					The bed was nice and comfortable, the service was on point. Good job!
				</view>
			</view>
			<view class="reply-info">
				<view class="reply-date">
					11 May 21
				</view>
				<image class="like-icon" src="/static/img/likeicon.svg" mode="aspectFit"></image>
			</view>
		</view>
		<view class="reply-item">
			<image class="reply-item-profile" :src="profile" mode="aspectFit"></image>

			<view class="reply-item-user">
				<view class="reply-user-name">
					Margaret
				</view>
				<view class="reply-content">
					The bed was nice and comfortable, the service was on point. Good job!
				</view>
			</view>
			<view class="reply-info">
				<view class="reply-date">
					11 May 21
				</view>
				<image class="like-icon" src="/static/img/likeicon.svg" mode="aspectFit"></image>
			</view>
		</view>
		<view class="view-more">
			See more reviews...
		</view>

		<view class="group-title">
			Recommend
		</view>
		<view class="car-home-swiper">
			<swiper class="swiper" circular indicator-dots :duration="500" autoplay>
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
		<base-reply />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: 'https://ts1.cn.mm.bing.net/th/id/R-C.5961f13c1c8c3b09c0ad702a7094dc6c?rik=a4l5Ss31eNoXow&riu=http%3a%2f%2fimg.crcz.com%2fallimg%2f201907%2f23%2f1563882699417666.jpg&ehk=hvM%2bq7ZrtSwhXpwGa3hlcCuFmJdcH2SOpoB6whfimEY%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
				current: 0,
				mode: 'default',
				dotsStyles: {
					backgroundColor: '#EAEAEA',
					border: '0',
					color: '#fff',
					selectedBackgroundColor: '#CCC',
					selectedBorder: '0'
				},
				swiperDotIndex: 0,
				info: [{
						colorClass: 'uni-bg-red',
						url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/094a9dc0-50c0-11eb-b680-7980c8a877b8.jpg',
						content: '内容 A'
					},
					{
						colorClass: 'uni-bg-green',
						url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/094a9dc0-50c0-11eb-b680-7980c8a877b8.jpg',
						content: '内容 B'
					},
					{
						colorClass: 'uni-bg-blue',
						url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/094a9dc0-50c0-11eb-b680-7980c8a877b8.jpg',
						content: '内容 C'
					}
				],
			};
		},
		methods: {
			change(e) {
				this.current = e.detail.current
			},
			clickItem(e) {
				this.swiperDotIndex = e
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff;
	}

	.article-page {
		--replay-height: 112rpx;
		padding: 40rpx 40rpx var(--replay-height);
		color: #333;
		position: relative;

		.group-title {
			margin: 20rpx 0;
			font-size: 32rpx;
			font-weight: 600;
			line-height: 48rpx;
		}

		.view-more {
			font-size: 32rpx;
			font-weight: 600;
			line-height: 48rpx;
			padding-bottom: 20rpx;
			border-bottom: 2upx solid #F3F3F3;
		}

		.reply-item {
			display: flex;
			justify-content: space-evenly;
			padding: 28upx 0 34upx;

			&+.reply-item {
				border-top: 2rpx solid #F4F2F6;
			}

			.reply-item-user {
				flex: 1 1 0%;
				margin-right: 32upx;

				.reply-user-name {
					color: #121212;
					font-weight: 600;
					font-size: 32rpx;
					line-height: 24px;
				}

				.reply-content {
					letter-spacing: -0.03em;
					margin-top: 10rpx;
					color: #3D3A45;
					font-weight: 500;
					font-size: 24rpx;
					line-height: 36rpx;
				}
			}

			.reply-item-profile {
				flex: 0 0 108rpx;
				box-shadow: 0px 64upx 128rpx rgba(140, 136, 150, 0.13);
				width: 108rpx;
				height: 108rpx;
				border-radius: 50%;
				margin-right: 32rpx;
			}

			.reply-info {
				flex: 0 0 auto;
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				.reply-date {
					margin-bottom: 20rpx;
				}

				.like-icon {
					width: 40rpx;
					height: 35.6upx;
					margin-right: 20rpx;
				}
			}
		}

		.article-page__date {
			color: #999999;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 32upx;
			padding-bottom: 30rpx;
			border-bottom: 2upx solid #F3F3F3;
		}

		.article-page__tags {
			display: flex;

			.tags-item {
				color: #52977D;
				letter-spacing: -0.03em;
				font-size: 24rpx;
				line-height: 36rpx;
				font-weight: 500;
				margin-right: 20rpx;
			}
		}

		.article-page__body {
			font-size: 24upx;
			color: #333;
			font-weight: 400;
			line-height: 36rpx;
			letter-spacing: -0.03em;
			margin-bottom: 10rpx;
			color: #999999;
		}

		.article-page__title {
			font-size: 32rpx;
			margin-bottom: 10rpx;
			color: #333;
			line-height: 48rpx;
			font-weight: 600;
		}

		uni-swiper {
			height: auto;
		}

		.car-home-swiper {
			::v-deep .uni-swiper__dots-box {
				bottom: -36upx !important;

			}

			::v-deep .uni-swiper__warp {
				overflow: unset;
			}

			::v-deep .uni-swiper-wrapper {
				height: 264rpx;
				border-radius: 30rpx;

				.uni-swiper-dot {
					width: 8upx;
					height: 8upx;
					background-color: #EAEAEA;

					&.uni-swiper-dot-active {
						background-color: #CCCCCC;
					}
				}
			}
		}

		.article-page-swiper {
			margin-top: 36rpx;
			padding-bottom: 48rpx;

			::v-deep .uni-swiper__dots-box {
				bottom: -36upx !important;

			}

			::v-deep .uni-swiper__warp {
				overflow: unset;
			}

			::v-deep .uni-swiper-wrapper {
				height: 460rpx;
				border-radius: 40rpx;
			}
		}


		.article-page__user {
			display: flex;
			align-items: center;

			.user-profile {
				width: 48upx;
				height: 48upx;
				border-radius: 50%;
			}

			.user-name {
				color: #333333;
				font-size: 28upx;
				font-weight: 400;
				margin-left: 16upx;
				flex: 1;
			}

			.uni-icons {
				margin-right: 42rpx;
			}

			.follow-btn {
				background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
				box-shadow: 0px 1px 2px rgba(38, 51, 49, 0.1);
				border-radius: 5px;
				color: #fff;
				height: 48rpx;
				border: 0;
				line-height: 48rpx;
				padding: 0 16rpx;
				font-size: 20rpx;
				font-weight: 500;
			}

		}
	}
</style>
