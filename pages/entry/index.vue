<!-- 首页包裹页面 Enice -->

<template>
	<scroll-view scroll-y class="entry-container">
		<!-- 底部tabbar -->
		<custum-tab-bar @tabChange="onTabChange" />

		<!-- 这里是顶部状态栏 -->
		<view class="status_bar" />
		<component :is="['HomePage','NewsPage'][active]" />

	</scroll-view>
</template>

<script>
	import HomePage from '../home/home.vue'
	import NewsPage from '@/pages/news-page/news.vue'
	export default {
		components: {
			HomePage,
			NewsPage
		},
		data() {
			return {
				active: 0
			};
		},
		methods:{
			onTabChange(key){
				this.active = key
			}
		}
	}
</script>

<style lang="scss" scoped>
	.entry-container {
		position: relative;
		height: 100vh;
		--tab-bar-height: 140upx; // 自定义tabbar高度
		// padding-bottom: var(--tab-bar-height);

		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}
	}
</style>
