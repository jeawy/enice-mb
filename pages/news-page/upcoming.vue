<template>
	<view class="upcoming">
		<view class="date-tabs">
			<view v-for="(item,idx) of tabs" :key="idx" @click="clickTab(idx)" :class="['date-tabs-item',active===idx?'type--active':'']">
				{{item.name}}
			</view>
		</view>
		<view class="base-card" @tap="gotoArticle" v-for="(item, index) of cards" :key="index" :style="{backgroundImage:`url(${item.img})`}">
			<view class="card__header">
				{{item.brand}}
			</view>
			<view class="releaseDate">
				Release date: {{item.date}}
			</view>
			<view class="pricetitle">
				Price from
			</view>
			<view class="price">
				{{item.pricerange}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cards: [{
					img: '/static/img/home/2.png',
					brand: 'Tesla Model Y',  
					date:"23/01/2023",
					pricerange: "$90,000 - 120,000"
				},
				  {
					img: '/static/img/home/image25.png',
					brand: 'BMW i8',  
					date:"23/01/2023",
					pricerange: "$190,000 - 320,000"
				},
				  {
					img: '/static/img/home/1.png',
					brand: 'Tesla Model Y',  
					date:"23/01/2023",
					pricerange: "$90,000 - 120,000"
				}],
				active:0,
				tabs: [{
						name: "Recent"
					}, {
						name: "Dec"
					},
					{
						name: "Jan"
					},
					{
						name: "Feb"
					},
					{
						name: "Mar"
					},
					{
						name: "Apr"
					},
				]
			};
		},
		methods:{
			gotoArticle(){
				uni.navigateTo({
					url: '/pages/article-page/upcoming-page'
				});
			},
			clickTab(idx){
				this.active = idx
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.upcoming {
		padding: 0 40upx;
		.date-tabs {
			display: flex;
			.date-tabs-item {
				font-size: 20upx;
				padding: 16upx 0;
				border-radius: 30upx;
				background: #FAFAFA;
				color: #666666;
				min-width: 72upx;
				height: 36upx;
				display: flex;
				align-items: center;justify-content: center;
				
				&+.date-tabs-item {
					margin-left: 20upx;
				}
				&.type--active{
					color: #fff;
					background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
				}
			}
		}
	}

	.base-card {
		height: 674upx;
		background-size: cover;
		position: relative;
		border-radius: 30upx;
		margin-top: 25rpx;
		padding: 25rpx;

		.card__header {
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 600;
			font-size: 32px; 
			/* identical to box height, or 50% */


			color: #FFFFFF;

		}
		.releaseDate{
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 600;
			font-size: 15px;
			line-height: 16px;
			/* identical to box height, or 107% */


			color: #FFFFFF;
		}
		.pricetitle{
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 500;
			font-size: 14px;
			line-height: 20px;
			/* identical to box height, or 143% */


			color: #FFFFFF;
		}
		.price{
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 600;
			font-size: 20px;
			line-height: 30px;
			/* identical to box height, or 150% */


			background: linear-gradient(90deg, #8FF9D0 0%, #92F3F0 102.78%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			text-fill-color: transparent;
		} 
	}
</style>
