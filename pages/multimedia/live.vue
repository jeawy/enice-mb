<template>
	<view class="live-page">
		<!-- 这里是顶部状态栏 -->
		<!-- <view class="status_bar" /> -->
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
		<cover-view class="join-people">
			<view class="user-profile-wrap">
				<image class="user-profile" :src="profile" mode="aspectFit"></image>
			</view>
			<view class="user-profile-wrap">
				<image class="user-profile" :src="profile" mode="aspectFit"></image>
			</view>
			<view class="user-profile-wrap">
				<image class="user-profile" :src="profile" mode="aspectFit"></image>
			</view>
			<view class="people-count">
				+2,349
			</view>
		</cover-view>
		<live-player src="https://domain/pull_stream" class="live-player" autoplay @statechange="statechange"
			@error="error" />
		<base-reply isDark />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: 'https://ts1.cn.mm.bing.net/th/id/R-C.5961f13c1c8c3b09c0ad702a7094dc6c?rik=a4l5Ss31eNoXow&riu=http%3a%2f%2fimg.crcz.com%2fallimg%2f201907%2f23%2f1563882699417666.jpg&ehk=hvM%2bq7ZrtSwhXpwGa3hlcCuFmJdcH2SOpoB6whfimEY%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1',
			};
		},
		methods: {
			statechange(e) {
				console.log('live-player code:', e.detail.code)
			},
			error(e) {
				console.error('live-player error:', e.detail.errMsg)
			}
		}
	}
</script>

<style lang="scss">
	.live-page {
		position: relative;
		height: 100vh;

		.join-people {
			position: fixed;
			bottom: 152upx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 11;
			display: flex;
			align-items: center;

			.user-profile-wrap {
				height: 80upx;
				margin-right: -28upx;

				.user-profile {
					width: 80upx;
					height: 80upx;
					border-radius: 40upx;
					display: block;
				}
			}

			.people-count {
				flex: 0 0 auto;
				background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
				height: 76upx;
				border-radius: 39upx;
				line-height: 76upx;
				font-size: 24upx;
				z-index: 2;
				color: #fff;
				padding: 0 16upx;
				font-weight: 600;
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



		.live-player {
			width: 100%;
			height: 100%;
		}
	}
</style>
