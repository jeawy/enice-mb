<template>
	<view class="article-page"> 
		 
		<view class="article"> 
			<view class="content">
				<image class="topimg" src="/static/img/home/volvo.png"  ></image> 
				<view class="features">
					<view class="title">Lexus EC200 235Kw Comfort</view>
					<view class="items">
						<view class="item" >
							<view class="name">Range: 480 - 600km</view>
							<view class="price">$ 68,000 - 93,000</view> 
						</view>
						<view class="item" >
							<button class="follow-btn"  >Compare</button>
						</view>
					</view>
				</view>
				
		    </view>
	    </view> 

		<view class="article"> 
			<view class="content">
				<image class="topimg" src="/static/img/home/volvo.png"  ></image> 
				<view class="features">
					<view class="title">Lexus EC200 300Kw Sport</view>
					<view class="items">
						<view class="item" >
							<view class="name">Range: 480 - 600km</view>
							<view class="price">$ 98,000 - 130,000</view> 
						</view>
						<view class="item" >
							<button class="follow-btn"  >Compare</button>
						</view>
					</view>
				</view>
				
		    </view>
	    </view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {   
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
  
		.article{ 
			width: 700rpx; 
			background: #FFFFFF;  
			box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.15);;
			border-radius: 30px;
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
					.follow-btn {
						background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
						box-shadow: 0px 1px 2px rgba(38, 51, 49, 0.1); 
						color: #fff;
						height: 48rpx;
						border: 0;
						line-height: 48rpx;
						padding: 0 16rpx;
						font-size: 20rpx;
						font-weight: 500;
						border-radius: 24rpx;
					}
				}
				.price{ 
					color: #52977D; 
				} 
			}
			
			
		}    
	}
</style>
