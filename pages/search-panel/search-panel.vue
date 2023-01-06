<!-- 搜索面板 Enice -->
<template>
	<view class="search-panel">
		<uni-search-bar :radius="30" @input="onSearch" bgColor="#FAFAFA" cancelButton="none" clearButton="none" placeholder="New Model S">
		</uni-search-bar>

		<view class="search-panel__header mt46">
			Search history
			<uni-icons class="del-icon" type="trash-filled" size="16" color="#999"></uni-icons>
		</view>
		<view class="tag-wrap tag-wrap1">
			<view class="tag-item" @tap="onSearch">
				Enice
			</view>
			<view class="tag-item"  @tap="onSearch">
				Tesla model 3 review
			</view>
			<view class="tag-item"  @tap="onSearch">
				Volvo
			</view>
			<view class="tag-item"  @tap="onSearch">
				Nissian new car release date
			</view>
		</view>
		<view class="search-panel__header mt34">
			Discover
		</view>
		<view class="tag-wrap">
			<view class="tag-item" @tap="onSearch">
				Enice
			</view>
			<view class="tag-item"  @tap="onSearch">
				Tesla model 3 review
			</view>
			<view class="tag-item"  @tap="onSearch">
				Volvo
			</view>
			<view class="tag-item"  @tap="onSearch">
				Nissian new car release date
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
			onSearch(){
				uni.navigateTo({
					url:'/pages/search-panel/search-reasult'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.search-panel {
		padding: 14upx 40upx;

		.search-panel__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 24upx;
			font-weight: 500;
			line-height: 36upx;
			color: #000;

			margin: 46upx auto 24upx;
		}

		.tag-wrap {
			color: #666;
			font-size: 24upx;
			font-weight: 500;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			&.tag-wrap1 {
				padding-bottom: 48upx;
				border-bottom: 2upx solid #F5F5F5;
			}

			.tag-item {
				background: #F5F5F5;
				border-radius: 30upx;
				margin-bottom: 28upx;
				height: 60upx;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: 0 32upx;
			}
		}

		::v-deep .uni-searchbar {
			padding: 0;
			height: 58upx;
			margin-top: 20upx;

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
				padding-left: 24upx;

				.uni-searchbar__text-placeholder {
					flex: 1;
				}
			}
		}

	}
</style>
