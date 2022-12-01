<!-- 自定义顶部tab菜单 Enice -->
<template>
	<view class="custum-tab-bar">
		<view>
			<image v-for="item of left" @tap="onChangeBar(item.key)" :class="['bar-icon',item.key===0?'bar-icon-mr':'']"
				:src="item.key===active?item.activeIcon:item.icon" mode="scaleToFill"></image>
		</view>
		<uni-fab class='uni-fab-custom' direction="vertical" vertical='bottom' :content="content" :pattern="pattern">
		</uni-fab>
		<view>
			<image v-for="item of right" @tap="onChangeBar(item.key)"
				:class="['bar-icon',item.key===2?'bar-icon-mr':'']" :src="item.key===active?item.activeIcon:item.icon"
				mode="scaleToFill"></image>
		</view>

	</view>
</template>

<script>
	export default {
		name: "custum-tab-bar",
		data() {
			return {
				pattern: {
					color: 'red',
					selectedColor: 'green',
					iconColor: '#fff'
				},
				content: [{
						text: '相册',
						active: false
					},
					{
						text: '首页',
						active: false
					},
					{
						text: '收藏',
						active: false
					}
				],
				active: 0,
				left: [{
					icon: '/static/img/home/mofang.png',
					activeIcon: '/static/img/home/mofang1.png',
					key: 0
				}, {
					icon: '/static/img/home/car.png',
					activeIcon: '/static/img/home/car1.png',
					key: 1
				}],
				right: [{
					icon: '/static/img/home/pingfeng.png',
					activeIcon: '/static/img/home/pingfeng1.png',
					key: 2
				}, {
					icon: '/static/img/home/user.png',
					activeIcon: '/static/img/home/user1.png',
					key: 3
				}, ]
			};
		},
		methods: {
			onChangeBar(key) {
				this.active = key
				this.$emit('tabChange',key)
			}
		}
	}
</script>

<style lang="scss">
	.custum-tab-bar {
		z-index: 999;
		position: fixed;
		bottom: 0;
		width: 100%;
		// background: linear-gradient(180deg, #1A1A1A 0%, #494747 100%);
		// box-shadow: inset 0px -3px 4px rgba(0, 0, 0, 0.25);
		
		height: var(--tab-bar-height);
		background: transparent url('/static/img/home/Rectangle47.png') no-repeat;
		background-size: cover;
		display: flex;
		justify-content: space-between;
		padding: 36upx 24upx 0;

		.bar-icon {
			height: 48upx;
			width: 48upx;

			&.bar-icon-mr {
				margin-right: 98upx;
			}
		}
		//  悬浮按钮样式重定义
		.uni-fab-custom {
			::v-deep {
				.uni-fab {
					left: 50%;
					transform: translateX(-50%);
					bottom: 90upx;
				}

				.uni-fab__content--other-platform {
					box-shadow: unset;
				}
				.uni-fab__circle--leftBottom {
					left: 50%;
					transform: translateX(-50%);
					bottom: 90upx;
					background: linear-gradient(90deg, #91FFD4 0.77%, #87EBD5 57.12%, #9CFBF8 115.97%);
					.fab-circle-v {
						height: 50upx;
						width: 10upx;
						border-radius: 5upx;
						top: calc(50% - 25upx);
						left: calc(50% - 5upx);
					}
					.fab-circle-h {
						width: 50upx;
						height: 10upx;
						border-radius: 5upx;
						left: calc(50% - 25upx);
						top: calc(50% - 5upx);
					}
				}
			}
		}
	}
</style>
