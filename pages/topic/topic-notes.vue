<!-- Topic Notes  Enice  -->
<template>
	<view class="topic-notes">
		<base-card :data="card1"></base-card>
		<base-card :data="card2"></base-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
			};
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.topic-notes{
		padding:30upx 40upx;
		.base-card+.base-card{
			margin-top: 30upx;
		}
	}
</style>
