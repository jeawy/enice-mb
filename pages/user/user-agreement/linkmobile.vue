<template>
	<!-- 设置界面 -->
	<view>
		<view  id="setting"> 
			<image class="img" src="/static/img/enicephone.png"></image> 
			<view class="settingList" >
				<view class="title">Moblie Number</view>
				<view class="phone">+61-452323423</view>
			</view> 
		</view>
		<button class="done-btn default-btn"  @tap="Done('/pages/user/user-agreement/change-phone')" >Change</button>
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
		height: 1700rpx;
		.img{
			margin-top:50rpx;
			width: 400rpx;
            height: 400rpx;
			margin-left: 175rpx;
			margin-bottom:100rpx;
		}
		.settingList {
			 text-align: center;
			 width:750rpx;
			 .title{
				color: #333333;
				font-weight: 700;
			 }
			 .phone{
				color: #666666;
			 }
		} 
	}
</style>
