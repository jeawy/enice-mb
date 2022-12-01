<template>
	<!-- 查看头像 -->
	<view id="lookPortrait">
		<cropper selWidth="750rpx" selHeight="700rpx" @upload="myUpload" :avatarSrc="imageurl" avatarStyle="width:100%;height: 700rpx;position:relative;margin-top:38%;">
		</cropper>
		 
	</view>
</template>

<script>
import store from '@/store'
import {
	search_users
} from '@/api/usercenter'
import cropper from "@/components/cropper.vue";
export default {
		data() {
			return {
				imageurl: null,
				thumbnail_portait:''
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
		onShow() {
			this.search();
		},
		onLoad(option) {
			 
			const item = JSON.parse(decodeURIComponent(option.image));
			this.imageurl = this.$mStore.state.BaseUrl + '/' + item
		},
		methods: {
			myUpload(rsp) {
				console.log("in myupload");
				const self = this; 
				self.imageurl = rsp.path; //更新头像方式一	
				console.log(self.imageurl);
				uni.uploadFile({
					url: this.$mStore.state.BaseUrl+'/users/portrait_backimage/',
					filePath: rsp.path,
					name: 'portrait_file',
					header: {
						"Content-Type": "multipart/form-data",
						'Authorization': uni.getStorageSync('estateToken') || this.$mStore.state.estateToken,
					},
					success: (res) => {
						// let data = JSON.parse(res.data)
						// this.msg = data.msg
						uni.showToast({
							title: '修改成功',
							icon: "none",
						});
						uni.switchTab({
							url: '/pages/user-center/my-account',
							animationDuration: 200
						});
					},
					fail: () => {
						uni.showToast({
							title: '修改失败'
						});
					}
				});

				//	rsp.avatar.imgSrc = rsp.path; //更新头像方式二
			},
			search() {
				if (this.UserInfo){
					let data = '';
					data = this.UserInfo.id;
					search_users({
						userid: data
					}).then(({
						data
					}) => {
						this.thumbnail_portait = data.msg[0].thumbnail_portait;
					})
				}
			},
			imgtarget() {
				uni.navigateTo({
					url:'/pages/user-center/personalCenter/portrait?image='+encodeURIComponent(JSON.stringify(this.thumbnail_portait))
				})
			}
		}

	}
</script>

<style lang="scss">
#lookPortrait {
	background-color: #000000;
	overflow-x: hidden;
	width: 100%;
	height: 100vh;
	.text {
		color: #fff;
		position: relative;
		font-size: 15px;
		top: 5%;
		width: 100%;
		text-align: center;
	}
}
</style>
