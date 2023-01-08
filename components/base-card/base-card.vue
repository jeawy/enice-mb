<!-- 通用卡片 Enice -->
<template>
	<view class="base-card"  :style="{backgroundImage:`url(${data.img})`}">
		<view class="card__header" @tap="gotoArticle">
			{{data.title}}
		</view>
		<view @tap="gotoArticle" :class="['custom-tag',['type--live','type--record'][data.tagType]]">
			<view class="tag-icon"></view> {{['Live','Record'][data.tagType]}}
		</view>
		<view class="profile-wrap">
			<image @tap="gotoOthers" class="profile" :src="data.profile" mode=""></image>
			<view @tap="gotoOthers" class="username" >{{data.username}}</view>
			<image class="star" @tap="onChangeStar" src="/static/img/star.png" v-if="data.star == 0" mode=""></image>
			<image class="star" @tap="onChangeStar" src="/static/img/star-selected.png" v-if="data.star == 1" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		/* 通用卡片 */
		name: "base-card",
		props: {
			data: {
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {

			};
		},
		methods:{
			gotoArticle(){
				uni.navigateTo({
					url: '/pages/article-page/article-page'
				});
			},
			onChangeStar( ) { 
				this.data.star = this.data.star == 1?0:1;
				this.$emit('starChange')
			},
			gotoOthers(){
				uni.navigateTo({
					url: '/pages/profile/others'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.base-card {
		height: 674upx;
		background-size: cover;
		position: relative;
		border-radius: 30upx;

		.card__header {
			max-width: 75%;
			font-weight: 600;
			font-size: 32upx;
			line-height: 48upx;
			padding: 30upx 0 0 40upx;
			color: #FFFFFF;

		}

		.custom-tag {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0 16upx;
			height: 36upx;

			border-radius: 30upx;
			font-size: 20upx;
			font-weight: 400;
			margin-left: 40upx;
			line-height: 48upx;

			&.type--live {
				color: rgba(255, 255, 255, 0.87);
				background: #FF6464;

				.tag-icon {
					background-color: rgba(255, 255, 255, 0.87);
				}
			}

			&.type--record {
				background: #FAFAFA;
				color: #666666;
				.tag-icon {
					background-color: #666666;
				}
			}

			.tag-icon {
				width: 8upx;
				height: 8upx;
				border-radius: 8upx;
				margin-right: 8upx;

			}
		}

		.profile-wrap {
			position: absolute;
			bottom: 46rpx;
			left: 30rpx;
			width: 630rpx;
			color: rgba(255, 255, 255, 0.87);
			font-size: 40upx;
			font-weight: 600;
			display: flex;
			align-items: center;
			.username{
				font-size: 40upx;
			    font-weight: 600;
			}
            .star{
				position:absolute;
				right:25rpx;
				width: 50upx;
				height: 50upx;
			}
			.profile {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
				margin-right: 14upx;
			}
		}
	}
</style>
