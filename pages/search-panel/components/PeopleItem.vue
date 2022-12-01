<!-- 用户item组件 Enice -->
<template>
	<view class="people-item">
		<image class="people-profile" src="/static/img/home/2.png" mode=""></image>
		<view class="people-data">
			<view class="people-data__name">
				Enice
			</view>
			<view class="people-data__msg">
				Enice official account Australia
				Enice official account Australia
			</view>
		</view>
		<view class="follow-people">
			Follow
		</view>
	</view>

</template>

<script>
</script>

<style lang="scss" scoped>
	.people-item {
		padding: 30upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.people-profile {
			width: 90upx;
			height: 90upx;
			border-radius: 50%;
			margin-right: 28upx;
			flex: 0 0 auto;
			display: block;
		}

		.people-data {
			flex: 1;
			min-width: 0%;
			margin-right: 60upx;
			.people-data__name{
				color: #333333;
				font-weight: 600;
				font-size: 32upx;line-height: 46upx;
			}
			.people-data__msg {
				width: 100%;
				color: #666666;
				font-size: 24upx;
				line-height: 34upx;
				overflow: hidden; //超出的隐藏
				text-overflow: ellipsis; //省略号
				white-space: nowrap; //强制一行显示
				letter-spacing: -0.03em;
			}

		}

		.follow-people {
			height: 60upx;
			padding: 0 24upx;
			text-align: center;
			line-height: 60upx;
			color: #fff;
			background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
			box-shadow: 0px 1px 3px rgba(38, 51, 49, 0.14);
			border-radius: 48upx;
			letter-spacing: -0.03em;
			font-weight: 500;
			font-size: 24upx;
			flex: 0 0 auto;
		}
	}
</style>
