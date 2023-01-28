<template>
	<view class="profile">
		<view class="profile-card">
			
			<view class="profile-card-title">
				Me
			</view>
			
			<uni-icons class="setting-icon" @tap="goto('/pages/user/potocol')"  type="gear-filled" size="24" color="#fff"></uni-icons>
			

			<view class="user-info">
				<image class="user-info-img" src="/static/img/logo.png" mode="aspectFill"></image>
				<view class="user-info-msg">
					<view class="user-name">
						Enice
					</view>
					<view class="user-id">
						User id: 1234567
					</view>
					<view class="info-edit" @tap="toEditPage">
						Edit profile >>
					</view>
				</view>
			</view>

			<view class="statistics-items">
				<view v-for="(item,idx) of statistics" :key="idx" class="statistics__item">
					<view class="item-num" @tap="goto(item.url1)">
						{{item.num}}
					</view>
					<view class="item-label" @tap="goto(item.url1)">
						{{item.label}}
					</view>
					<view class="item-icon-wrap" @tap="iconTarget(item.url,idx)">
						<image class="item-icon" :src="item.icon" mode=""></image>
					</view>
				</view>
			</view>
			
		</view>

		<view class="list-card">
			<view class="list-card__item" @tap="goto('/pages/user/cooperation')" >
				<view class="card__item__label"  >
					<image class="item-icon" src="/static/img/profile/ren.svg" mode=""></image>
					Cooperation
				</view>
				<uni-icons type="forward"  size="12"></uni-icons>
			</view>
			<view class="list-card__item" @tap="goto('/pages/uni-feedback/uni-feedback')"   >
				<view class="card__item__label">
					<image class="item-icon" src="/static/img/profile/dianzan.svg" mode=""></image>
					Feedback
				</view>
				<uni-icons type="forward"  size="12"></uni-icons>
			</view>
			<view class="list-card__item"  @tap="goto('/pages/user/aboutus')">
				<view class="card__item__label">
					<image class="item-icon" src="/static/img/profile/gantan.svg" mode=""></image>
					About us
				</view>
				<uni-icons type="forward"  size="12"></uni-icons>
			</view>
			<view class="list-card__item" @tap="goto('/pages/article-page/preference')">
				<view class="card__item__label">
					<image class="item-icon" src="/static/img/profile/gantan.svg" mode=""></image>
					Preference
				</view>
				<uni-icons type="forward"  size="12"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statistics: [{
					    url1:"",
					    url:"/pages/profile/edit-profile",
						label: "Following",
						num: 32,
						icon: '/static/img/pencel.png'
					},
					{
						url1:"/pages/user/followers",
						url:"/pages/user/communities",
						label: "Followers",
						num: 160,
						icon: '/static/img/profile/Star.svg'
					},
					{
						url1:"",
						url:"/pages/entry/index?key=1",
						label: "Posts",
						num: 30,
						icon: '/static/img/car.png'
					},
					{
						url1:"/pages/user/communities",
						url:"/pages/user/notices",
						label: "Likes & Cols",
						num: 300,
						icon:'/static/img/chat.png'
					}
				]
			};
		},
		methods:{
			iconTarget(url,idx){
				idx===2?this.$emit('changeTab',1):this.goto(url)
			},
			goto(url){
				/*
				uni.navigateTo({
					url:url
				})
				*/
				this.$mRouter.push(
					{route:url}
				)
			},
			toEditPage(){
				uni.navigateTo({
					url:'/pages/profile/edit-profile'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.profile {
		padding: var(--status-bar-height) 40upx 210upx;
		font-family: 'Montserrat';

		.profile-card {
			.setting-icon{
				position: absolute;
				top: 60upx;
				right: 54upx;
				width: 58upx;
				height: 58upx;
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
					border-top: 1px solid #CCCCCC;
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
