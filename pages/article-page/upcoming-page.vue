<template>
	<view class="article-page"> 
		<view class="article-page__user">
			<view class="user-name">Release Date: 02/01/2023</view>
			<image class="user-profile" src="/static/img/star.png" mode="aspectFit"></image> 
		</view>
		<view class="article">
			<image class="topimg" src="/static/img/home/image26.png"  ></image>
			<view class="content">
				<view class="article-page__title">
					Lexus EC
				</view>
				<view class="article-page__body">
					The Lexus E Series is the first purely electric Volvo E Automobile in the performance segment of the Sports Activity Vehicle. 
				</view>

			    <view class="price">$ 98,000 - 130,000</view>
				<view class="article-page__date">
					 
				</view>
				<view class="features">
					<view class="title">Features</view>
					<view class="items">
						<view class="item" v-for="(item, index) of features" :key="index">
							<image class="itemimg" :src="item.src"  ></image>
							<view class="name">{{item.name}}</view>
						</view>
					</view>
				</view>
				
		    </view>
	    </view>

		<view class="article article-compare">
			<view class="topline">
				<view class="linetitle">Lexus EC</view>
				<image class="lineicon" src="/static/img/home/right.png"  > </image> 
			</view>
			<view class="reply-item"  >
				<image class="reply-item-profile" src="/static/img/home/car2.png" mode="aspectFit" ></image>

				<view class="reply-item-user">
					<view class="reply-user-name">
						Lexus EC200 235Kw Comfort
					</view>
					<view class="price">
						$ 98,000
					</view>
					<view class="range">
						Range: 550 km
					</view>
				</view>
				<view class="reply-info"> 
					<button class="follow-btn"  >Compare</button>
				</view>
			</view>
			<view class="reply-item"  >
				<image class="reply-item-profile" src="/static/img/home/car2.png" mode="aspectFit" ></image>

				<view class="reply-item-user">
					<view class="reply-user-name">
						Lexus EC200 300Kw Sport
					</view>
					<view class="price">
						$ 118,000
					</view>
					<view class="range">
						Range: 500 km
					</view>
				</view>
				<view class="reply-info"> 
					<button class="follow-btn"  >Compare</button>
				</view>
			</view>
		</view>
        <view class="article article-compare article-review">
			<view class="title">Test Drive Review</view>
			<image class="img" src="/static/img/home/car3.png"   ></image>
			<view class="b-txt">2023 Lexus EC200 Sport Edition Review</view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				features:[
					{
						src:"/static/img/home/meter2.png",
						name:"550km"
					},
					{
						src:"/static/img/home/car-engine1.png",
						name:"AC300Kw"
					},
					{
						src:"/static/img/home/battery-charge1.png",
						name:"50km/10min"
					}
				],
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
		padding:0 25rpx;
		color: #333;
		position: relative;
		background-color: #FFFFFF; 
		.article-review{
			padding:25rpx 90rpx;
			.title{
				font-weight: 500;
				font-size: 14px;
				line-height: 90rpx;
				/* identical to box height, or 129% */

				letter-spacing: -0.03em;

				color: #000000;
				 
			}
			.img{
				width: 700rpx;
				height: 300rpx;
			}
			.b-txt{ 
				font-weight: 600;
				font-size: 15px;
				margin-top: 30rpx;
				padding-bottom: 30rpx;
				/* identical to box height, or 160% */

				text-align: center;

				color: #333333;
			}
		}
		.article-compare{
			margin-top: 50rpx;
			padding:0 25rpx;
			.topline{
				display: flex;
				justify-content:space-between;
				padding-top: 25rpx;
				.linetitle{
					font-weight: 500;
					font-size: 14px;
					line-height: 18px;
					/* identical to box height, or 129% */ 
					letter-spacing: -0.03em; 
					color: #000000;
				}
				.lineicon{
					width:70rpx;
					height: 40rpx;
				}

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
					width: 130rpx;
					height: 130rpx;
					border-radius:20rpx;
					margin-right: 32rpx;
				}
				.price{
					color: #52977D;
					font-weight: 500;
					font-size: 12px;
					line-height: 18px;
				}
				.range{
					font-weight: 400;
					font-size: 10px;
					line-height: 16px; 

					color: #999999;
				}

				.reply-info {
					position: absolute;
					right: 50rpx;
					margin-top:50rpx;

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
		}
		.article{
			
			width: 700rpx; 
			background: #FFFFFF;  
			box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.15);;
			border-radius: 30px;
			.topimg{
				width:700rpx;
				height: 600rpx
			}
			.content{
				padding:0 25rpx;
				.price{
					width: 650rpx;
					text-align: right;
					color: #52977D; 
				}
				.features{
					padding-bottom:  25rpx;
					.title{
						font-weight: 500;
						line-height: 50rpx;
					}
					.items{
						display: flex;
						justify-content: space-between;
						
						.item{
							text-align: center;
							.itemimg{
								width:70rpx;
								height: 70rpx;
							}

						}

					}
					
				}
			}
			
			
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
			padding-bottom: 20rpx;
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

		.article-page__date {
			color: #999999;
			font-size: 20rpx;
			font-weight: 400;
			line-height: 32upx;
			padding-bottom: 30rpx;
			border-bottom: 2upx solid #F3F3F3;
		}
 
		.article-page__body {  
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

			

		}
	}
</style>
