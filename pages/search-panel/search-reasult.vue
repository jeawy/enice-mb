<!-- 搜索结果页 Enice -->
<template>
	<view class="search-reasult">
		
		<tab-btns :tabs="btnsData" :active.sync="activeKey"></tab-btns>
		<template v-if="activeKey===0">
			<view class="notes-content">
				<base-card :data="card1"></base-card>
				<base-card :data="card2"></base-card>
			</view>
		</template>
		<template v-else>
			<view class="people-content">
				<PeopleItem />
				<view class="people-title">
					Related accounts
				</view>
				<PeopleItem />
				<PeopleItem />
			</view>
		</template>
	</view>
</template>

<script>
	import PeopleItem from'./components/PeopleItem.vue'
	export default {
		components:{
			PeopleItem
		},
		data() {
			return {
				activeKey: 1,
				btnsData: [{
						label: "Notes",
						icon: "map",
					},
					{
						label: "People",
						icon: "settings-filled",
					}
				],
				card1: {
					img: '/static/img/home/2.png',
					title: 'What’s the top 10 Electric car in 2022 ?',
					username: "Abbey",
					profile: '/static/img/home/touxiang.jpg',
					tagType: 0
				},
				card2: {
					img: '/static/img/home/2.png',
					title: 'What’s the top 10 Electric car in 2022 ?',
					username: "Abbey",
					profile: '/static/img/home/touxiang.jpg',
					tagType: 1
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.search-reasult {
		.notes-content {
			padding: 0 40upx 40upx;

			.base-card+.base-card {
				margin-top: 30upx;
			}
		}
		.people-content{
			padding: 0 40upx;
			.people-title{
				padding:24upx 0 8upx;
				border-top: 2upx solid #F5F5F5;
				color: #333333;
				font-weight: 600;
				font-size: 32upx;
				line-height: 48upx;
			}
		}


	}
</style>
