<template>
	<view class="upcoming">
		<view class="date-tabs">
			<view v-for="(item,idx) of tabs" :key="idx" @click="clickTab(idx)" :class="['date-tabs-item',active===idx?'type--active':'']">
				{{item.name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active:0,
				tabs: [{
						name: "Recent"
					}, {
						name: "Dec"
					},
					{
						name: "Jan"
					},
					{
						name: "Feb"
					},
					{
						name: "Mar"
					},
					{
						name: "Apr"
					},
				]
			};
		},
		methods:{
			clickTab(idx){
				this.active = idx
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.upcoming {
		padding: 0 40upx;
		.date-tabs {
			display: flex;
			.date-tabs-item {
				font-size: 20upx;
				padding: 16upx 0;
				border-radius: 30upx;
				background: #FAFAFA;
				color: #666666;
				min-width: 72upx;
				height: 36upx;
				display: flex;
				align-items: center;justify-content: center;
				
				&+.date-tabs-item {
					margin-left: 20upx;
				}
				&.type--active{
					color: #fff;
					background: linear-gradient(180deg, #4B9A87 0.66%, #6ADEC3 100%);
				}
			}
		}
	}
</style>
