<template>
	<!-- 设置界面 -->
	<view>
		<view  id="setting">
			<view class="settingList"  >
				<view class="title">After changing, you can log in with the new number. Current Number:</view> 
			</view> 
			<view class="settingList"  >
				<view>+61 452323423</view>
				<view><button class="verify-btn default-btn"  @tap="Done" >Verify</button></view>
			</view> 
			<view  class="password-form"  >
				<view>Vertification Code</view>
				<view>
					<input
					    type="text"
						class="password default-input"
						v-model="Info.oldpassword" 
					/>
				</view>
			</view>  
			 
		</view>
		<button class="done-btn default-btn"  @tap="Done('/pages/user/user-agreement/new-phone')" >Next</button>
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
				uni.navigateTo({
					url
				})  
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
		.title{
			color: #000000;
			font-weight: 700;
		}
		.password-form{
			margin-top: 35rpx; 
		}
	
		.settingList {
			background-color: #FFFFFF;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between; 
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
