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
		<view>
			<!-- #ifdef MP-WEIXIN -->
			<button type="primary"  
			class="wx-btn" 
			:loading="btnLoading"
			open-type="getPhoneNumber"
			 @getphonenumber="getPhoneNumber">微信快速登录</button> 
			 <!-- #endif -->
			<button class="confirm-btn plain" plain @tap="navTo('/pages/public/login')">登录</button>
			<button class="confirm-btn plain" plain @tap="navTo(`/pages/public/register`)">注册</button>
		</view>
		
		<view class="footer">
			使用即表示您同意
			<text class="protocol" @tap="handleRfProtocolPopupShow">社区互通 协议</text>
		</view>
		<Contact   > </Contact>
		<!--协议popup-->
		<rf-protocol-popup ref="mapState" @popupState="popupState" protocolPath='/pages/set/about/detail?field=protocol_register&title=服务协议'
		 policyPath='/pages/set/about/detail?field=protocol_privacy&title=隐私协议' v-if="isRfProtocolPopupShow"></rf-protocol-popup>
	</view>
</template>

<script> 
	import {
		mpWechatLogin,
		wechatH5Login
	} from '@/api/login';
	import {getWeixinPhoneNumber } from '@/api/basic'; 
	import Contact from "@/components/contact"
	import rfProtocolPopup from '@/components/rf-protocol-popup'
	export default {
		components: {
			rfProtocolPopup,
			Contact
		},
		data() {
			return {
				userInfo: null,
				btnLoading:false,
				isRfProtocolPopupShow: false, // 控制协议popup显示
				isLoginDisabled: true, // 是否允许点击登录按钮
				isAuthLoginShow: false,
				logo: this.$mAssetsPath.logo,
				baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
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
		onLoad(options) {
			/*  #ifdef H5  */
			if (this.$mPayment.isWechat()) {
				this.isAuthLoginShow = true;
			} 
			/*  #endif  */
			/*  #ifdef MP-WEIXIN */
			this.isAuthLoginShow = true;
			/*  #endif  */
			this.code = options.code; 
			// 如果不是第一次进来 就不需要强制阅读协议
			if (uni.getStorageSync('notFirstTimeLogin')) this.isLoginDisabled = false;
			const _this = this;
			if (this.code) { 
				this.$http.get(wechatH5Login, {
					code: this.code
				}).then(async r => {
					if (!r.data.login) {
						this.user_info = r.data.user_info.original;
						uni.showModal({
							content: '你尚未绑定账号，是否跳转登录页面？',
							success: (confirmRes) => {
								if (confirmRes.confirm) {
									uni.setStorageSync('wechatUserInfo', JSON.stringify(_this.user_info));
									_this.$mRouter.push({
										route: '/pages/public/login'
									});
								}
							}
						});
					} else {
						await this.$mStore.commit('login', r.data.user_info);
						// #ifdef H5
						await this.$mPayment.wxConfigH5();
						// #endif
						const backToPage = uni.getStorageSync('backToPage');
						if (backToPage) {
							if (('/pages/index/index' || '/pages/index/index' || '/pages/index/index' || '/pages/user/user').indexOf(
									backToPage) === -1) {
								this.$mRouter.reLaunch(JSON.parse(backToPage));
							} else {
								this.$mRouter.redirectTo(JSON.parse(backToPage));
							}
							uni.removeStorageSync('backToPage');
							uni.removeStorageSync('wechatUserInfo');
							return;
						} else {
							this.$mRouter.reLaunch({
								route: '/pages/user/user'
							});
						}
					}
				})
			}
		},
		methods: {
			wxlogin(event){
				let encryptedData = event.detail.encryptedData
				let iv = event.detail.iv 
				let that = this
			    wx.login({
				success: res => { 
					that.code = res.code;  
					const js_code = that.code;
					const grant_type = 'authorization_code';
					var header = {
					'Content-Type': 'application/json'
					}; 
					const params = {encryptedData:encryptedData,iv:iv,js_code:js_code,grantType:grant_type};
				 
					getWeixinPhoneNumber(params).then((r)=>{ 
						if (r.status === 0) {
							that.$mHelper.toast("登录成功！");
							that.$mStore.commit("login", r.msg); 
							uni.setStorageSync("openid", r.openid)
							const backToPage = uni.getStorageSync("backToPage"); 
							if (backToPage) {
								if (
									backToPage.indexOf("/pages/user/user") !== -1 ||
									backToPage.indexOf("/pages/cart/cart") !== -1 ||
									backToPage.indexOf("/pages/index/index") !== -1 ||
									backToPage.indexOf("/pages/category/category") !== -1
								) {
									that.$mRouter.reLaunch(JSON.parse(backToPage));
								} else {
									that.$mRouter.redirectTo(JSON.parse(backToPage));
								}
								uni.removeStorageSync("backToPage");
								uni.removeStorageSync("wechatUserInfo");
								return;
							} else {
								that.$mRouter.reLaunch({
									route: "/pages/user/user",
								});
							}
								
						}
						else{
							uni.showToast({
								title:r.msg,
								icon:"error"
							})
						}
					}).catch((res)=>{
						console.log(res)
					}).finally((res)=>{
						that.btnLoading = false;
					}); 
				}
			})
			},
			getUserProfile(e) {
			    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
			    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
			    wx.getUserProfile({
			      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			      success: (res) => {
					  console.log(res)
			        this.setData({
			          userInfo: res.userInfo,
			          hasUserInfo: true
			        })
			      }
			    })
			},
			getPhoneNumber(event) {
				// 前端获取加密信息，后端解密后获得手机号码
				
				this.btnLoading = true
				var that = this;
				wx.checkSession({
					  success(res) {
						//session_key 未过期，并且在本生命周期一直有效 
						console.log("session_key 未过期，并且在本生命周期一直有效 ")
						that.wxlogin(event)
					  },
					  fail() { 
						// session_key 已经失效，需要重新执行登录流程 
						 that.wxlogin(event)
					  },
					  complete() { 
						  
					  }
				})
			},
			// 通用跳转
			navTo(route) {
				if (this.isLoginDisabled) {
					this.$mHelper.toast('请阅读并同意协议', 1.5 * 1000);
					this.isRfProtocolPopupShow = true;
					return;
				} 
				this.$mRouter.redirectTo({
					route
				});
			},
			// 显示协议popup
			handleRfProtocolPopupShow() {
				this.isRfProtocolPopupShow = true;
			},
			// 监听是否同意协议
			popupState(e) {
				if (e) {
					this.isLoginDisabled = false;
					uni.setStorageSync('notFirstTimeLogin', true);
					this.isRfProtocolPopupShow = false;
				} else {
					this.isLoginDisabled = true;
					this.isRfProtocolPopupShow = false;
				}
			},  
		}
	}
</script>

<style lang='scss' scoped>
 
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
			margin-bottom: 50rpx;
			font-size: $font-sm + 2upx; 
			.protocol {
				color: $base-color;
				margin: 0 10upx;
			}
		}
	}
</style>
