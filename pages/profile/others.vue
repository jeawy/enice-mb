<template>
	<view class="profile">
		<view class="profile-card"> 
			<uni-icons class="setting-icon" type="chat" size="24" color="#fff"></uni-icons>
			
            <button class="followed">Followed</button>
			<view class="user-info">
				<image class="user-info-img" src="/static/img/logo.png" mode="aspectFill"></image>
				<view class="user-info-msg">
					<view class="user-name">
						Enice
					</view>
					<view class="user-id">
						User id: 1234567
					</view>
					 
				</view>
			</view>

			<view class="statistics-items">
				<view v-for="(item,idx) of statistics" :key="idx" class="statistics__item">
					<view class="item-num">
						{{item.num}}
					</view>
					<view class="item-label">
						{{item.label}}
					</view> 
				</view>
			</view>



		</view>
		<view class="notes">Notes:34</view>
		<view class="cards">
			<base-card :data="card1"></base-card> 
		</view>
		<view class="cards">
		<base-card :data="card2" ></base-card>
	</view>
		<view class="cards">
        <base-card :data="card3" ></base-card>
	</view>

		 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				card1: {
					img: '/static/img/home/image25.png',
					title: 'Review Test Drive Taycan?',
				 
				},
				card2: {
					img: '/static/img/home/image29.png',
					title: 'What’s the top 10 Electric car in 2022?',
					 
				},
				card3: {
					img: '/static/img/home/image25.png',
					title: 'Review Test Drive Taycan?',
					 
				},
				statistics: [{
						label: "Following",
						num: 32,
						icon: ''
					},
					{
						label: "Followers",
						num: 160,
						icon: '/static/img/profile/Star.svg'
					},
					{
						label: "Posts",
						num: 30,
						icon: ''
					},
					{
						label: "Likes & Cols",
						num: 300,
						icon: ''
					}
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
	.profile {
		background-color: white;
		padding: 25rpx;
		font-family: 'Montserrat';
		.notes{
			margin-top: 25rpx;
			color: #999999;
			font-size: 16px;
			line-height: 40rpx;;
		}
		.cards{
			margin: 25rpx 0;
		}

		.profile-card {
			padding-top: 25rpx;
			.followed{
				position: absolute;
				top: 65upx;
				right: 35upx;
				width: 140upx;
				height: 48upx;
				line-height: 48upx;
				font-size: 12px;
				background: #FFFFFF;
				/* xs */

				box-shadow: 0px 1px 2px rgba(38, 51, 49, 0.1);
				border-radius: 5px;
			}
			.setting-icon{
				position: absolute;
				top: 60upx;
				right: 180upx;
				width: 48upx;
				height: 48upx;
			}
			/* linear green */
			position: relative;
			background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
			border-radius: 60upx;
			color: #FFFFFF;

			.profile-card-title {
				color: rgba(255, 255, 255, 0.87);
				font-weight: 600;
				padding-top: 24upx;
				font-size: 36upx;
				line-height: 56upx;
				text-align: center;
			}

			.user-info {
				margin-top: 12upx;
				margin-left: 46upx;
				display: flex;
				align-items: center;

				.user-info-img {
					width: 140upx;
					height: 140upx;
					border-radius: 50%;
					display: block;
					border: 6upx solid #fff;
					margin-right: 18upx;
				}

				.user-info-msg {
					.user-name {
						font-size: 48upx;
						font-weight: 600;
						line-height: 64upx;
						color: #fff;
					}

					font-size: 20upx;

					.user-id {
						color: rgba(255, 255, 255, 0.6);

						line-height: 30upx;
						font-weight: 400;
					}

					.info-edit {
						line-height: 30upx;
						color: #F5F5F5;
						font-weight: 500;
						opacity: 0.6;
					}

				}
			}

			.statistics-items {
				display: flex;
				justify-content: space-between;
				padding: 20upx 40rpx 64upx;

				.statistics__item {
					font-weight: 600;
					text-align: center;

					.item-num {
						font-size: 36upx;
						line-height: 56upx;
					}

					.item-label {
						font-size: 26upx;
						line-height: 32upx;
						margin-bottom: 34upx;
					}

					.item-icon-wrap {
						display: inline-flex;
						justify-content: center;
						align-items: center;
						width: 96upx;
						height: 96upx;
						border-radius: 50%;
						background-color: #fff;
						
						.item-icon{
							// 有间距的图标是64
							width: 56upx;
							height: 56upx;
						}
					}
				}
			}
		}


		.list-card {
			box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.1), 0px 0px 8px -2px rgba(0, 0, 0, 0.08);
			border-radius: 10px;
			padding: 0 30upx;
			margin-top: 60upx;
			min-height: 500upx;

			.list-card__item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 34upx 0;
				font-size: 28rpx;
				&+.list-card__item{
					border-top: 1px solid #F3F3F3;
				}
			}

			.item-icon {
				width: 28upx;
				height: 28upx;
				display: inline-block;
				margin-right: 16upx;
			}
		}


	}
</style>
