<!-- 搜索面板 Enice -->
<template>
	<view class="search-panel">
		<uni-search-bar :radius="30" bgColor="#FAFAFA" cancelButton="none" clearButton="none" placeholder="search cars">
		</uni-search-bar>

		<view class="search-panel__header" v-for="(item, index) of brands" :key="index">
			<view class="title">{{item.title}}</view>
			<view class="items" @tap="gotoDetail(brandindex)" v-for="(itembrand, brandindex) of item.items" :key="brandindex">
				<view class="item">{{itembrand.name}}</view>
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
						title:"A",
						items:[
							{
								name:"Abath",
							},
							{
								name:"AC",
							},
							{
								name:"Alfa",
							},
							{
								name:"Allard",
							},
							{
								name:"Alpina",
							},
							{
								name:"Alpin3",
							},
							{
								name:"Alvis",
							},
							{
								name:"AMC",
							},
							{
								name:"Audi",
							},
						]
					},
					{
						title:"B",
						items:[
							{
								name:"Bentley",
							},
							{
								name:"Bertone",
							},
							{
								name:"Bmw",
							},
							{
								name:"Builk",
							},
							{
								name:"BYD",
							} 
						]
					}
					,
					{
						title:"C",
						items:[
							{
								name:"Car",
							},
							{
								name:"Cartone",
							},
							{
								name:"Carmw",
							} 
						]
					}
				]
			};
		},
		methods: {
			gotoDetail(){
				uni.navigateTo({
					url:'/pages/search-panel/brand-search-result'
				})
			}
		}
	}
</script>

<style lang="scss" scoped> 
	.search-panel {
		padding: 14upx 40upx; 
		background-color: #fff;
		.search-panel__header {  
			font-size: 24upx;
			font-weight: 500;
			line-height: 36upx;
			color: #000; 
			margin: 46upx auto 24upx;
			border-radius: 25rpx;
			
			.items{ 
				background: #FAFAFA;
				.item {
					border-bottom: 1px solid  #F5F5F5;
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
