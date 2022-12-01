<template>
	<view class="login-type">
		<view class="logo">
			<image :src="logo" class="logoimg" mode="widthFix"></image>
			<view class="sloganholder">
				<image :src="namepng" class="nameimg" mode="widthFix"></image>
				<view class="slogan">
					社区生活可以更舒适
				</view> 
			</view>
			
		</view>
		<view class="tips">
			<view class="title">
				<image :src="baseAppUrl + 'tishi.png'" class="tishi" />
				<text>温馨提示:</text>
			</view>  
			<view class="appraisetxt">1、注销后无法通过线上正常缴纳物业费等</view>
			<view class="appraisetxt">2、若需要再次使用，请重新注册以便恢复使用</view>
		</view>
		<view>  
			<button class="confirm-btn plain" plain @tap="logoff">继续注销</button>
		</view> 
	</view>
</template>

<script> 
	import {
		 memberUpdate
	} from '@/api/userInfo'; 
	export default { 
		data() {
			return {
				userInfo: null,
				baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
				btnLoading:false,
				isRfProtocolPopupShow: false, // 控制协议popup显示
				isLoginDisabled: true, // 是否允许点击登录按钮
				isAuthLoginShow: false,
				logo: this.$mAssetsPath.logo,
				namepng: this.$mAssetsPath.namepng
			}
		},
		onBackPress(event){ 
			let backUrl = uni.getStorageSync('backUrl') 
			if (backUrl != null)
			{
				uni.redirectTo({
					 url:backUrl
				 });
				 uni.setStorageSync('backUrl', null)
				return true;
			} 
		},  
		methods: {   
			// 通用跳转
			logoff(){
				uni.showModal({
					content:"确定要注销吗？",
					success:()=>{
						// 注销用户 
						this.userInfo = this.$mStore.state.userInfo
						this.$http.post(`${memberUpdate}?uuid=${this.userInfo.uuid}`, {
							uuid:this.userInfo.uuid,
							method : "put",
							isactive:0,//注销
						}).then((r) =>{ 
							this.$mStore.commit("logout"); 
							this.$mRouter.push({
								route:"/pages/index/index"
							});		
						}).catch((r) => {
							console.log(r) 
						});
					} 
				})
			} 
		}
	}
</script>

<style lang='scss' scoped>
    .tips{
		margin:  25rpx;
	}
	.login-type {
		padding-top: 80upx;
		background: #fff;
		height: 100vh;

		.logo {
			
			text-align: center;
			margin-bottom: 80upx; 
			display: flex; 
			.logoimg{
				width: 130rpx;
				height: 130rpx;
				border-radius: 28upx; 
				margin-left:180rpx;
				
			}
			
			.sloganholder{
				margin-left: 15rpx;
				margin-top: 10rpx;
				.nameimg{  
					width: 260rpx;
				}
				 .slogan{  
					color:$font-color-light;
				}
			}
		}

		.confirm-btn, .wx-btn {
			width: 600rpx; 
			height: 84upx;
			line-height: 84upx;
			border-radius: 12upx; 
			color: #fff;
			font-size: $font-lg;
		}

		.plain {
			background: none;
			color: $base-color;
			border: 1upx solid $base-color;
		}
       
		.footer {
			width: 100%;
			text-align: center;
			 
			margin-top: 440upx;
			font-size: $font-sm + 2upx; 
			.protocol {
				color: $base-color;
				margin: 0 10upx;
			}
		}
	}
</style>
