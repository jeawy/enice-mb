<template>
	<!-- 设置界面 -->
	<view>
		<view  id="setting">
			<view class="settingList" @tap="target('/pages/user/user-agreement/account')">
				<view>Account</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view> 
			<view class="settingList" @tap="target('/pages/user/user-agreement/user-agreement')">
				<view>Privacy</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>  
		</view>
		<button class="logout-btn default-btn"  >Log Out</button>
	</view>
</template>

<script>  
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	export default {
		data() {
			return {
				thumbnail_portait: '',
				url:'',
				Image:[],
				portait:'',
				clickImage:false,
				ios: true,
				phone:""
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
			   
			target(url) {
				uni.navigateTo({
					url
				})
			}, 
		}, 
	};
</script>

<style lang="scss" scoped>
	 
	.logout-btn{
        width: 700rpx;
		margin-left: 25rpx;
		margin-top: 50rpx;
		font-size: 20px;
		line-height:  90rpx;
		height: 90rpx;
		border-radius: 45rpx;
	}
	#setting {
		background: #FFFFFF;
		width:700rpx;
		color:#666666;
		height: 400rpx;
		padding:25rpx 50rpx;
		margin-top: 25rpx;
		margin-left: 25rpx;
		box-shadow: 0px 32px 64px rgba(217, 217, 217, 0.36);
		border-radius: 40rpx;
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

		.settingList1 { 
			font-weight: 500;
			line-height: 118rpx;
			background-color: white;
			border-bottom: 1px solid #CCCCCC;
			text-align: center; 
			align-items: center;
			justify-content: center;
		} 
	}
</style>
