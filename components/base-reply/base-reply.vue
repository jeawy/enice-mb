<template>
	<cover-view :class="['base-reply',isDark?'dark--type':'']">
		<uni-easyinput type="text" :inputBorder="false" placeholder="Say something..."></uni-easyinput>
		<view class="btn-wrap">
			<view class="reply-btn">
				<image class="reply-btn-icon" src="/static/img/shareicon.svg" mode="aspectFit"></image>
				<view class="reply-btn-text">
					Share
				</view>
			</view>
			<view class="reply-btn">
				<image class="reply-btn-icon" src="/static/img/commonticon.svg" mode="aspectFit"></image>
				<view class="reply-btn-text">
					133
				</view>
			</view>
			<view class="reply-btn">
				<image class="reply-btn-icon" src="/static/img/likeicon.svg" mode="aspectFit"></image>
				<view class="reply-btn-text">
					2.9k
				</view>
			</view>
		</view>
	</cover-view>
</template>

<script>
	export default {
		name: "BaseReply",
		props: ['isDark'], // 暗色风格
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.base-reply {
		position: fixed;
		bottom: 0;
		width: 100%;
		left: 0;
		min-height: var(--replay-height);
		box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1), 0px -2px 4px -2px rgba(0, 0, 0, 0.15);
		display: flex;
		align-items: center;

		&.dark--type {
			background: rgba(255, 255, 255, 0.1);
			box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.1), 0px -2px 4px -2px rgba(0, 0, 0, 0.15);
		::v-deep .uni-easyinput {
			background-color: transparent;
			.uni-easyinput__content {
				background-color: #FAFAFA !important;
				backdrop-filter: blur(40px);
				border-radius: 40rpx;
				width: 360rpx;
				height: 80upx;
			}
		}
		
		}



		::v-deep .uni-easyinput {
			background-color: transparent;

			.uni-easyinput__content {
				background-color: #FAFAFA !important;
				backdrop-filter: blur(40px);
				border-radius: 40rpx;
				width: 360rpx;
				height: 80upx;
			}
		}

		padding: 20upx 40upx;
		background-color: #fff;

		.btn-wrap {
			margin-left: 52rpx;
			display: flex;
		}

		.reply-btn {
			display: flex;
			flex-direction: column;
			align-items: center;

			&+.reply-btn {
				margin-left: 50rpx;
			}

			.reply-btn-icon {
				width: 40upx;
				height: 40upx;
			}

			.reply-btn-text {
				letter-spacing: -0.03em;

				/* linear green */

				background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				text-fill-color: transparent;
			}

		}
	}
</style>
