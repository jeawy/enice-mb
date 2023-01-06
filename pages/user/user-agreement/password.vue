<template>
	<!-- 设置界面 -->
	<view>
		<view  id="setting">
			<view class="settingList" @tap="target('/pages/user/user-agreement/account')">
				<view>Moblie</view>
				<view>61-452323423</view>
			</view> 
			<view  class="password-form"  >
				<view>Old Password</view>
				<view>
					<input
					    type="password"
						class="password default-input"
						v-model="Info.oldpassword" 
					/>
				</view>
			</view>  
			<view   class="password-form"  >
				<view>New Password</view>
				<view>
					<input
					    type="password"
						class="password default-input"
						v-model="Info.newpassword" 
					/>
				</view>
			</view>  
			<view   class="password-form"  >
				<view>Confirm Password</view>
				<view>
					<input
					    type="password"
						class="password default-input"
						v-model="Info.newpassword1" 
					/>
				</view>
			</view>  
		</view>
		<button class="done-btn default-btn"  @tap="Done" >Done</button>
	</view>
</template>

<script>  
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	export default {
		data() {
			return {
			 
				Info:{
					oldpassword:"",
					newpassword:"",
					newpassword1:""
				},
			 
				 
			};
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			}
		},  
		components: {
			uniIcon,
		},
		methods: { 
			   
			Done(url) {
				if(this.Info.oldpassword == ""){
					uni.showModal({
						content: "Please input old password",
						confirmText:"OK",
						showCancel:false,
						success: (confirmRes) => {
						
						},
					});
				}
				else if(this.Info.newpassword == ""){
					uni.showModal({
						content: "Please input new password",
						confirmText:"OK",
						showCancel:false,
						success: (confirmRes) => {
						
						},
					});
				}
				else if(this.Info.newpassword != this.Info.newpassword1 ){
					uni.showModal({
						content: "new passwords not the same",
						confirmText:"OK",
						showCancel:false,
						success: (confirmRes) => {
						
						},
					});
				}

				uni.showModal({
						content: "Password has been changed!",
						confirmText:"Done",
						showCancel:false,
						success: (confirmRes) => {
						    this.$mRouter.push({
								route: "/pages/user/user"  
							});
						},
					});
				
			}, 
		}, 
	};
</script>

<style lang="scss" scoped>
	 
	.done-btn{
        width: 700rpx;
		margin-left: 25rpx;
		margin-top: 50rpx;
		font-size: 20px;
		line-height:  90rpx;
		height: 90rpx;
		position: fixed;
		bottom: 120rpx;;
		border-radius: 45rpx;
	}
	#setting {
		background: #FFFFFF;
		width:700rpx;
		color:#666666;
		height: 700rpx;
		padding:25rpx 50rpx;
		margin-top: 25rpx;
		margin-left: 25rpx;
		box-shadow: 0px 32px 64px rgba(217, 217, 217, 0.36);
		border-radius: 40rpx;
		.password-form{
			margin-top: 35rpx; 
		}
	
		.settingList {
			background-color: #FFFFFF;
			height: 130rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #CCCCCC; 
			&>view:nth-child(1) {
				display: flex;
				align-items: center;
			}

			&>view:nth-child(2) {
				color: #c8c8cc;
				display: flex;
				align-items: center;
			} 
		} 
	}
</style>
