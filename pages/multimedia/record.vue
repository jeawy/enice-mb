<template>
	<view class="record-page">
		<cover-view class="user-bar">
			<view class="user-profile-wrap">
				<cover-image class="user-profile" :src="profile" mode="aspectFit"></cover-image>
			</view>

			<view class="user-name">Abbey
				<view class="follower">45k followers</view>
			</view>
			<button class="follow-btn">Follow</button>
			<view class="empty">
			</view>
			<image class="start-icon" src="/static/img/Star.svg" mode=""></image>
		</cover-view>
		<video class="video-player" show-center-play-btn :controls="false"
			src="https://edgefrecdn.azureedge.net/shared/cms/lrs1c69a1j/section-videos/8d7abb1fd4fe47f1890b2df3c936c61a.mp4"></video>

		<cover-view class="video-info">
			<view class="video-info-title">
				What’s the top 10 Electric car in 2022 ?
			</view>
			<view class="video-info-content">
				Model 3 comes with the option of dual motor and all-wheel drive, 20” Überturbine Wheels...
				<text class="more-link">More>></text>
			</view>

		</cover-view>

		<base-reply isDark />
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.record-page {
		position: relative;
		height: 100vh;

		.video-info {
			position: fixed;
			z-index: 9;
			width: 100%;
			bottom: 184upx;
			padding: 0 40upx;
			color: #F5F5F5;

			.video-info-title {

				font-weight: 600;
				font-size: 32upx;
				line-height: 48upx;
				margin-bottom: 10upx;

			}

			.video-info-content {
				letter-spacing: -0.03em;
				font-size: 24upx;
				font-weight: 400;
				line-height: 36upx;

				.more-link {
					background: linear-gradient(90deg, #91FFD4 0.77%, #87EBD5 57.12%, #9CFBF8 115.97%);
					background-clip: text;
					text-fill-color: transparent;
					font-weight: 500;
					font-size: 20upx;
					line-height: 32upx;
				}
			}
		}


		.user-bar {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 10;
			display: flex;
			align-items: center;
			padding: 0 40upx;

			.start-icon {
				width: 56upx;
				height: 56upx;
			}

			.empty {
				flex: 1;
			}


			.user-name {
				color: #FFFFFF;
				font-weight: 500;
				font-size: 28upx;
				line-height: 40upx;
				margin: 0 14upx;

				.follower {
					color: #CCCCCC;
					font-size: 10px;
					line-height: 32upx;

				}
			}

			.follow-btn {
				height: 38upx;
				padding: 0 7upx;
				text-align: center;
				line-height: 38upx;
				color: #fff;
				background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
				box-shadow: 0px 2upx 6upx rgba(38, 51, 49, 0.14);
				border-radius: 10upx;
				letter-spacing: -0.03em;
				font-weight: 500;
				font-size: 20upx;
				margin: 0;
			}

			.user-profile-wrap {
				box-sizing: border-box;

				height: 94upx;
				width: 94upx;
				background-image: linear-gradient(180deg, #4B9A87, #6ADEC3);


				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				overflow: hidden;


				.user-profile {
					width: 100%;
					height: 100%;
					display: block;
					border-radius: 50%;
					width: 82upx;
					height: 82upx;
					border: 6upx solid rgb(36, 46, 71);
				}
			}
		}



		.video-player {
			width: 100%;
			height: 100%;
		}
	}
</style>
