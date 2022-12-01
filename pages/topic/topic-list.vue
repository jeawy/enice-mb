<!-- Home-Topic  Enice  -->
<template>
	<view class="topic-list">
		<view v-for="item of list" :key="item.id" class="topic-list__item">

			<view class="item__title">
				{{item.title}}
			</view>
			{{item.count}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					title: "#Top 10 Car testing from Teslaesting from Tesla",
					count: 161234,
					id: 1
				}]
			};
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.topic-list {
		padding: 40upx;
		.topic-list__item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-weight: 500;
			padding: 30upx 40upx;
			font-family: 'Montserrat';
			font-size: 20upx;
			color: #999;
			border-bottom: 2upx solid #F3F3F3;
			.item__title {
				font-size: 24upx;
				letter-spacing: -0.03em;
				color: #333333;
				flex: 1;
				min-width: 0%;
				margin-right: 40upx;
				overflow:hidden;//超出的隐藏
				text-overflow:ellipsis;//省略号
				white-space:nowrap;//强制一行显示
			}
		}
	}
</style>
