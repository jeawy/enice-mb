<!-- 搜索面板 Enice -->
<template>
	<view class="search-panel"> 
		<view class="search-panel__header" v-for="(item, index) of brands" :key="index">
			<view class="title">{{item.title}}</view>
			<view class="brandcontainer">
				<view class="items" @tap="gotoBrand(brandindex)" v-for="(itembrand, brandindex) of item.items" :key="brandindex">
					<checkbox class="checkbox" value="cb" color="#FFCC33" style="transform:scale(0.7)" /> 
					<view class="item">{{itembrand.name}}</view>
				</view>
			</view>
		</view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
                brands:[
					{
						title:"Tesla",
						items:[
							{
								name:"Model3",
							},
							{
								name:"ModelS",
							},
							{
								name:"ModelX",
							},
							{
								name:"ModelY",
							},
							{
								name:"ModelZ",
							} 
						]
					} 
				]
			};
		},
		methods: {
			gotoBrand(brandindex){
				uni.navigateTo({
					url:'/pages/article-page/brand-model-page'
				})
			}
		}
	}
</script>

<style lang="scss" scoped> 
	.search-panel {
		padding: 14rpx 25rpx; 
		background-color: #fff;
		min-height:  1500rpx;
		.search-panel__header {  
			font-size: 24upx;
			font-weight: 500;
			line-height: 36upx;
			color: #000; 
			margin: 46upx auto 24upx;
			
			.brandcontainer{
				border-radius: 25rpx; 
				overflow: hidden;
			}
			.items{ 
				display: flex;
				background: #FAFAFA;
				width:100%;
				border-bottom: 1px solid  #F5F5F5; 
				.checkbox{
					margin-top: 15rpx;
				} 
				.item{ 
					margin-left: 10rpx;
					font-family: 'Montserrat';
					font-style: normal;
					font-weight: 500;
					font-size: 14px;
					padding-top:20rpx;
					padding-bottom:20rpx;
					color: #666666;
				}
			}
		} 
	}
</style>
