<template>
	<view class="article-page"> 
	 
		<image class="swiper-item-image"
		src="/static/img/home/1.png">
		</image>  
		<view class="article-page__title">
			2023 Volvo EX300 Sport Edition Review
		</view>
		<view class="article-page__body">
			We had a chance to test the Atto3 over the course of a day, driving it for a few hours in Sydney's CBD and into the suburbs, so this review only serves as a first impression. Soon we'll have an Atto3 for a longer stretch and we’ll be able to get to know it better.

Still, this review covers everything you need to know about the Atto 3. From the prices and features, and the range you can travel on a full charge, to how long it takes to charge and where you can service it. Of course we’ll also give you our first impression on what it’s like to drive.

Oh, and you don't have to call it a Build Your Dream Atto 3. BYD is the shortened version, thankfully.

Does it represent good value for the price? What features does it come with?   9/10

The Standard Range and the Extended Range have the same features. Standard on both cars are 18-inch alloys wheels, LED headlights and running lights, LED tail-lights, roof rails, proximity unlocking and an automatic tailgate.

 
What are the key stats for the engine and transmission?   7/10

Outputs are plenty at 150kW/310Nm. So much so, you’ll be able to accelerate from 0-100km/h in 7.3 seconds, which is better than many of the cars that’ll put up beside you at the traffic lights

Is there anything interesting about its design?   7/10

Premium and sporty looking on the outside, downright quirky inside. 

I like the Atto 3’s determined looking face with the angry-looking front bumper that makes the car seem wider and lower for a tough stance.

Verdict

Servicing costs are higher than what we'd expect and the warranty's duration doesn't match rival MG's seven-year/unlimited kilometre coverage.

But this is a practical, small SUV with unique and quirky styling that's going to appeal to many Australians.





		</view> 
		<view class="group-title">
			Comments
		</view> 
		<view class="reply-item" v-for="(item, index) of comments" :key="index">
			<image class="reply-item-profile" :src="profile" mode="aspectFit" ></image>

			<view class="reply-item-user">
				<view class="reply-user-name">
					{{item.username}}
				</view>
				<view class="reply-content">
					{{item.comments}}
				</view>
			</view>
			<view class="reply-info">
				<view class="reply-date">
					{{item.date}}
				</view>
				<image class="like-icon" src="/static/img/likeicon.svg" mode="aspectFit"></image>
			</view>
		</view>
		 
		<view class="view-more" @tap="AddMoreComments">
			See more reviews...
		</view> 
		<base-reply :isDark="false" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				follow:"follow",
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
				comments:[
					{
						username:"Margaret",
						comments:"The bed was nice and comfortable, the service was on point. Good job!",
						date:"11 May 21"
					},
					{
						username:"Margaret",
						comments:"The bed was nice and comfortable, the service was on point. Good job!",
						date:"11 May 21"
					}
				],
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
			gotoback(){
				uni.navigateBack();
			},
			actionFollow(){
				this.follow = "followed"
			},
			AddMoreComments(){
				let newitem = {
						username:"Margaret",
						comments:"The bed was nice and comfortable, the service was on point. Good job!",
						date:"11 May 21"
					}
					this.comments = this.comments.concat(newitem)

			},
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
		background-color: #ffffff;
		--replay-height: 112rpx;
		padding: 25rpx 25rpx  ;
		color: #333;
		position: relative;
		.swiper-item-image{
			width: 100%;
			border-radius: 30rpx;
		}

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
			padding-bottom: 120rpx;
			border-bottom: 2upx solid #F3F3F3;
		}

		.reply-item {
			display: flex;
			justify-content: space-evenly;
			padding: 28upx 0 34upx;

			&+.reply-item {
				border-top: 2px solid #F4F2F6;
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

	 
		.article-page__body {
			font-size: 24upx;
			color: #333;
			font-weight: 400;
			line-height: 36rpx;
			letter-spacing: -0.03em;
			margin-bottom: 10rpx; 
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
 
	}
</style>
