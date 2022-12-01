<template>
	<!-- 修改头像 -->
	<view id="portrait"> 
		<view class="text">点击可以修改头像</view>
		<cropper selWidth="750rpx" selHeight="700rpx" @upload="myUpload" 
		:avatarSrc="imageurl" 
		avatarStyle="width:95%;height: 700rpx;position:relative;margin-top:25%;left:2.5%;border: 1px solid #F2F2F2;">
		</cropper>
	</view>
</template>

<script>
	 
	import cropper from "@/components/cropper.vue";
	export default {
		data() {
			return {
				imageurl: null,
			};
		},
		components: {
			cropper
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			}
		},
		onLoad(option) {
			const item = JSON.parse(decodeURIComponent(option.image));
			this.imageurl = this.$mStore.state.BaseImagesUrl + '/' + item
		},
		methods: {
			myUpload(rsp) {
				const self = this;
				self.imageurl = rsp.path; //更新头像方式一	
				let token = this.$mStore.state.accessToken || uni.getStorageSync('accessToken')
				uni.uploadFile({
					url: this.$mStore.state.BaseUrl+'api/users/portrait_backimage/',
					filePath: rsp.path,
					name: 'portrait_file',
					header: {
						"Content-Type": "multipart/form-data",
						'Authorization': token,
					},
					success: (res) => { 
						uni.showToast({
							title: '修改成功',
							icon: "success",
						});
						this.$mRouter.push({
							route:'/pages/user/user?updated=1'
						})
						  
					},
					fail: () => {
						uni.showToast({
							title: '修改失败'
						});
					}
				});

				//	rsp.avatar.imgSrc = rsp.path; //更新头像方式二
			},
		}

	}
</script>

<style lang="scss">
	#portrait {
		background-color: #3B4144;
		overflow-x: hidden;
		width: 100%;
		height: 100vh; 
		.text {
			color: #fff;
			position: relative;
			left: 2.5%;
			font-size: 15px;
			top: 5%;
			text-align: center;
		}
	}
</style>
