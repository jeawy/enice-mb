<!-- 通用顶部tab按钮组 Enice -->
<template>
	<view class="tab-btns">
		<view v-for="(item,idx) of tabs" :key="idx" :class="['tab-btn',active===idx && 'type--active']"
			@tap="onToggle(idx)">
			<uni-icons v-if="!!item.icon" :type="item.icon" size="14" />
			{{item.label}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "tab-btns",
		props: {
			active: {
				type: Number,
				default: 0
			},
			tabs: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {

			};
		},
		methods: {
			onToggle(key) {
				this.$emit('update:active', key)
			}
		}
	}
</script>

<style lang="scss">
	// tab按钮组
	.tab-btns {
		width: 392upx;
		margin: 24upx auto 32upx;
		border-radius: 20upx;
		overflow: hidden;
		display: flex;
		box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.14);

		.tab-btn {
			flex: 1;
			height: 72upx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 500;
			font-size: 28upx;
			color: #333333;

			.uni-icons {
				margin-right: 18upx;
				color: #333333 !important;
			}

			&.type--active {
				background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
				color: #fff;

				.uni-icons {
					margin-right: 18upx;
					color: #fff !important;
				}
			}
		}
	}
</style>
