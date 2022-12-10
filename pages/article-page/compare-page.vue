<template>
	<view class="article-page">  
		<button class="follow-btn"  >+ Add Car</button>
		<view class="article"> 
			<view class="content">
				<image class="topimg" src="/static/img/home/volvo.png"  ></image> 
				<image class="checkimg" src="/static/img/home/checkbox.png"  ></image> 
				<view class="features">
					<view class="title">Lexus EC200 300Kw Sport</view> 
				</view> 
		    </view>
	    </view>  
		<view class="recentlist">
			<view class="title">Recent viewed</view>
			<view class="viewlist article-compare reply-item" v-for="(item, index) of reviewlist" :key="index">
				<checkbox class="checkbox" value="cb" color="#FFCC33" style="transform:scale(0.7)" /> 
				<image class="reply-item-profile" :src="item.img" mode="aspectFit" ></image> 
				<view class="reply-item-user">
					<view class="reply-user-name">
						{{item.title}}
					</view>
					<view class="price">
						${{item.price}}
					</view>
					<view class="range">
						{{item.range}}
					</view>
				</view> 
			</view>
		</view>

		<view class="recentlist recentlist-recommend">
			<view class="title">Recommend</view>
			<view class="viewlist article-compare reply-item" v-for="(item, index) of recommendlist" :key="index">
				<checkbox class="checkbox" value="cb" color="#FFCC33" style="transform:scale(0.7)" /> 
				<image class="reply-item-profile" :src="item.img" mode="aspectFit" ></image> 
				<view class="reply-item-user">
					<view class="reply-user-name">
						{{item.title}}
					</view>
					<view class="price">
						${{item.price}}
					</view>
					<view class="range">
						{{item.range}}
					</view>
				</view> 
			</view>
		</view>

		<button class=" follow-btn-disabled"  >Compare</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {   
				reviewlist:[
			         {
						title:"Volvo EC200 235Kw Comfort",
						price:"98,000",
						range:"Range: 550 km",
						img:"/static/img/home/s1.png"
					 },
					 {
						title:"Volvo EC200 300Kw Sport",
						price:"118,000",
						range:"Range: 500 km",
						img:"/static/img/home/s2.png"
					 },
					 {
						title:"Volvo EC200 235Kw Comfort",
						price:"138,000",
						range:"Range: 450 km",
						img:"/static/img/home/s3.png"
					 },
				],
				recommendlist:[
			         {
						title:"Volvo EC200 235Kw Comfort",
						price:"98,000",
						range:"Range: 550 km",
						img:"/static/img/home/s1.png"
					 } 
				]
			};
		},
		methods: { 
		   
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
		padding:25rpx  25rpx;
		
		color: #333;
		position: relative;
		background-color: #FFFFFF; 
		.article:nth-child(n+2) {
			margin-top: 35rpx;
		}
		.recentlist-recommend{
			border-top: 1px solid #F3F3F3;
			padding-top:25rpx;
		}
		.checkbox{
			margin-top: 20rpx;
			margin-right: 20rpx;
		}
		.recentlist{
			margin-top: 25rpx;
			.title{
				font-family: 'Montserrat';
				font-style: normal;
				font-weight: 500;
				font-size: 20px;
				line-height: 18px; 
				letter-spacing: -0.03em; 
				color: #333333;
			}
			.reply-item {
				display: flex;
				justify-content: space-evenly;
				padding: 28upx 0 34upx;

				&+.reply-item {
					border-top: 1px solid #F4F2F6;
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

					 
					
				}
			}
		}
		.follow-btn {
			background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
			box-shadow: 0px 1px 2px rgba(38, 51, 49, 0.1); 
			color: #fff; 
			border: 0;
			line-height: 48px;
			padding: 0 16rpx;
			font-size: 18px;
			font-weight: 500;
			border-radius: 24px;
		}
		.follow-btn-disabled{
			background-color: #CCCCCC !important;
			/* sm */ 
			box-shadow: 0px 1px 3px rgba(38, 51, 49, 0.14); 
			border: 0;
			line-height: 48px;
			padding: 0 16rpx;
			font-size: 18px;
			font-weight: 500;
			border-radius: 24px;
		}
  
		.article{ 
			width: 700rpx; 
			background: #FFFFFF;  
			box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.15);;
			border-radius: 30px;
			.checkimg{
				position: absolute;
				right: 65rpx;
				margin-top: 40rpx;
				width: 60rpx;
				height: 60rpx; 
			}
			.topimg{
				margin-top: 25rpx;
				width:700rpx;
				height: 450rpx
			}
			.items{
				display: flex;
				justify-content: space-between; 
			}
			.content{
				padding:25rpx 25rpx;
				.features{
					.title{
						font-weight: 500;
						font-size: 16px;
						line-height: 20px; 
						color: #333333;
						margin-bottom: 15rpx;
					}
					.name{
						font-weight: 400; 
						line-height: 16px;  
						color: #999999;
					}
					
				}
				.price{ 
					color: #52977D; 
				} 
			}
			
			
		}    
	}
</style>
