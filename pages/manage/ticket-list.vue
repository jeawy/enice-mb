<template>
	<view class="ticket-list">
		<view v-for="(item,index) in ticketList" :key="index" class="ticket-item">
			<image class="ticket-icon" :src="require('@/static/image/youhuiquan.svg')" mode=""></image>
			<view class="ticket-name ticket-item__item">
				{{item.name}}
			</view>
			<view class="ticket-item__item native-link">
				暂停发放
			</view>
			<view class="ticket-item__item native-link">
				删除
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ticketList: [{
					name: "5元洗车券"
				}, {
					name: "15元洗车券"
				}, ]
			}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.ticket-list {
		.native-link {
			color: #007aff;
		}

		.ticket-item {
			display: flex;
			align-items: center;
			background-color: #fff;
			padding: 16upx 30upx;
			margin-top: 2upx;

			.ticket-item__item {
				margin-left: 16upx;
			}

			.ticket-icon {
				width: 50upx;
				height: 50upx;
				margin-right: 16upx;
			}

			.ticket-name {
				font-weight: 600;
				font-size: 28upx;
				flex: 1 1 auto;
			}
		}
	}
</style>
