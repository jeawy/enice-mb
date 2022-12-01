<template>
	<view class="content">
		<!-- 地图 -->
       <web-view id="mapContainer" :src="url"  ></web-view>
	</view>
</template>

<script>
	 
	// 发送给后端位置信息的接口
	
	export default {
		data() {
			return {
				baseurl: 'https://tl.chidict.com/',
				height: 0,
				width: 0,
				url:'https://video-7792-rzpczv.twil.io/index.html',
				id:'',
				uuid:'',
				images:''
			};
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			}
		},
		methods: {
			layerShow(){
				if(this.enable_satellite == false){
					uni.showModal({
					content: "是否打开卫星地图？",
					success: (e) => {
						if (e.confirm) {
							this.enable_satellite = true
						} else {
						}
					},
					fail: () => {
						res(false)
					}
				})
				}else{
					uni.showModal({
						content: "是否关闭卫星地图？",
						success: (e) => {
							if (e.confirm) {
								this.enable_satellite = false
							} else {
							}
						},
						fail: () => {
							res(false)
						}
					})
				}
				
			},
		  
		},
		onReady() {
		},
		onNavigationBarButtonTap(val) {
			if (val.index == 0) {
				// console.log("第一个按钮");
				this.shareIcon()
			};
		},
		onLoad(res) {
			 
		},
	};
</script>
<style lang="scss" scoped>
	.cover-image {
		position: absolute;
		width: 50px;
		height: 50px;
		bottom:135rpx;
		left:15rpx;
	}
	.layer-image{
		position: absolute;
		width: 50px;
		height: 50px;
		bottom:35rpx; 
		left:15rpx;
	}
</style>
