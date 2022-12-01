<template>
	<!-- 设置界面 -->
	<view id="setting">
		<view>
			<view class="settingList" @tap="imgtarget()">
				<view>头像</view>
				<image class="img" :src="url+thumbnail_portait" @tap="previewImage()"></image>
				<view>
					<uniIcon class="ico" type="arrowright"></uniIcon>
				</view>
			</view>  
			<view class="settingList" @tap="findpassword">
				<view>修改密码</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view> 
			<view class="settingList" @tap="bingBank">
				<view>绑定银行卡</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>  
			<!-- #ifdef APP-PLUS -->
			<view class="settingList" @tap="withdrawUser">
				<view>注销用户</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view> 
			<!-- #endif -->
			<!--
			<view class="settingList">
				<view>关于APP</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>
			-->
			<view class="settingList1" @tap="togglePopup()">
				<text>退出</text>
			</view>
		</view>
	</view>
</template>

<script> 
	import store from '@/store'
	import {
		memberInfo,
	} from '@/api/userInfo';
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
		onShow() {
			this.getMemberInfo();
		},
		onLoad(){
			  
			this.url = this.$mStore.state.BaseImagesUrl + '/'
		},
		components: {
			uniIcon,
		},
		methods: {  
			withdrawUser(){
				//注销用户
				this.target('/pages/public/logoff')
			},
			bingBank(){ 
				this.target('/pages/user/bank/bankinfo')
			},
			findpassword(){
				this.target('/pages/public/password?phone='+this.phone+"&type=1")
			},
			// 获取用户信息
			async getMemberInfo () {
				await this.$http.get(memberInfo).then(r => { 
					this.thumbnail_portait = r.msg.thumbnail_portait; 
					this.phone = r.msg.phone;
					this.$mStore.state.userInfo.thumbnail_portait = this.thumbnail_portait
				}).catch(() => {
			    this.loading = false;
				})
			},
		 
			//点击查看头像大图
			previewImage: function() {
				uni.previewImage({
					current: this.url+this.thumbnail_portait,
					urls: [this.url+this.thumbnail_portait],
				}) 
			},
			target(url) {
				uni.navigateTo({
					url
				})
			},
			imgtarget() {
				uni.navigateTo({
					url:'/pages/user/personalCenter/portrait?image='+encodeURIComponent(JSON.stringify(this.thumbnail_portait))
				})
			},
			LogOut() {
				this.$mStore.commit("logout"); 
			},
			//#ifdef APP-PLUS
			 onclick : function(){
			            
			        },
			//#endif	
			togglePopup() {
				uni.showActionSheet({
				    itemList: ['切换账号','退出登录'],
				    success: res=> {
				        if(res.tapIndex===0){
							this.LogOut()
							uni.reLaunch({
								url: "/pages/public/logintype"
							})
						}
						if(res.tapIndex===1){
							this.LogOut()
							uni.reLaunch({
								url: "/pages/user/user"
							})
						}
				    }
				});
			},

		}, 
	};
</script>

<style lang="scss">
	svg.open-btn.svg-icon {
	    width: 2em;
	    height: 2em;
	}
	#setting {
		.settingList {
			background-color: #FFFFFF;
			padding: 0 41.666rpx;
			height: 130rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #f5f9f7;

			&>view:nth-child(1) {
				display: flex;
				align-items: center;
			}

			&>view:nth-child(2) {
				color: #c8c8cc;
				display: flex;
				align-items: center;
			}
			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 10px;
				box-shadow: 1px 1px 2px #F2F2F2;
				border: 1.5px solid #F2F2F2;
				left:30%;
				position:relative;
			}
			.ico{
				color: #c8c8cc;
				display: flex;
				align-items: center;
			}
		}

		.settingList1 { 
			line-height: 118rpx;
			background-color: white;
			border-bottom: 1px solid #f5f9f7;
			text-align: center; 
			align-items: center;
			justify-content: center;
		}

		.uni-logout {
			background: #fff;

			 &>view{
				padding: 0 41.666rpx;
				height: 130rpx;
				border-bottom: 2.083rpx solid #c8c8cc;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
