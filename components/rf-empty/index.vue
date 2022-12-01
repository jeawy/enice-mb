<template>
	<view class="empty">
		<view class="empty-content" :class="{ emptyOnly: !isRecommendShow}">
			<image class="emptyimage" :src="baseAppUrl+`record/join.png`" ></image>
			<text class="empty-content-info">{{info}}</text>
		</view>
		<rf-recommend v-if="isRecommendShow" :list="list" class="recommend" />
	</view>
</template>

<script>
	import rfRecommend from '@/components/rf-recommend/rf-recommend'
	export default {
		components: {
				rfRecommend
		},
		props: {
			src: {
				type: String,
				default: 'empty'
			},
			isRecommendShow: {
				type: Boolean,
				default: true
			},
			info: {
				type: String,
				default: ''
			},
		  list: {
	      type: Array,
	      default () {
	        return []
	      }
	    }
		},

		data() {
			return {
				baseAppUrl:this.$mStore.state.BaseAppStaticUrl,
			}
		},
		computed: {
		}
	}
</script>

<style lang="scss">
		
	.emptyimage{
		margin-top:140rpx;
		width:120rpx;
		height: 120rpx;;
	}
	.empty {
		background-color: $color-white;
		height: 400rpx;
		.empty-content {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			padding: 20upx 0 80upx;
			.empty-content-info {
				color: $font-color-disabled;
				font-size: $font-base - 2upx;
			}
			.iconfont {
				font-size: 240upx;
				color: $base-color;
			}
			&-image {
				width: 200upx;
				height: 200upx;
			}
		}
		.emptyOnly {
			position: fixed;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
		}
	}
</style>
