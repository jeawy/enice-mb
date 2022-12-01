<template>
	<view class="userinfo"> 
		<view class="input-content"> 
				<view class="input-item">
					<text class="tit">银行</text>
					<label >{{profileInfo.bank_name==null?"":profileInfo.bank_name}} </label>
					<text class="feedback-quick" @tap="chooseMsg">选择银行</text>
				</view>
				<view class="input-item">
					<text class="tit">开户行</text>
					<input
						v-model="profileInfo.deposit_bank"
						placeholder="开户行"
					/>
				</view>
				<view class="input-item">
					<text class="tit">户名</text>
					<label >{{profileInfo.username}}</label>
				</view>
				<view class="input-item">
					<text class="tit">银行卡号</text>
					<input
					    type="number"
						v-model="profileInfo.bank_number"
						placeholder="银行卡号"
					/>
				</view>
				<button class="confirm-btn" :disabled="btnLoading" :loading="btnLoading" @tap="toUpdateInfo">绑定银行卡</button>
		</view> 
		<view class="tips">
			<view class="title">
				<image :src="baseAppUrl + 'tishi.png'" class="tishi" />
				<text>温馨提示:</text>
			</view>
			<view class="appraisetxt">银行卡信息仅用作您在本平台中获取的收益提现:</view>
			<view class="appraisetxt">1、您在本平台为其他业主提供帮助时，会获得相应的收益</view>
			<view class="appraisetxt">2、银行卡仅用作您提现的收款账号</view>
			<view class="appraisetxt">3、请正确填写银行信息，否则影响提现进度</view>
		</view>
	</view>
</template>

<script> 
	import {memberInfo, memberUpdate} from '@/api/userInfo'; 
    import uniIcon from "@/components/uni-icon/uni-icon.vue"
	export default { 
		components: { 
			uniIcon, 
		},
		data() {
			return { 
				profileInfo: {},
				banks:[
					"中国农业银行",
					"中国工商银行",
					"中国建设银行",
					"中国银行",
					"招商银行",
					"中国民生银行"
				],
				baseAppUrl: this.$mStore.state.BaseAppStaticUrl,  
				token: null,
				loading: true, 
				btnLoading: false, 
				userInfo : ""
			};
		},
		onLoad () {
			this.initData() 
		},
		methods: {
			chooseMsg(){
				let _this = this;
				uni.showActionSheet({
					itemList:this.banks,
					success:(res) => {
						_this.profileInfo.bank_name = this.banks[res.tapIndex] 
						console.log(_this.profileInfo.bank_name)
					}
				})
			},    
			// 数据初始化
			initData(){
		    this.token = uni.getStorageSync('accessToken') || undefined;
				this.getMemberInfo()
			},
			// 获取用户信息
			async getMemberInfo () {
				await this.$http.get(memberInfo).then(r => { 
			        this.loading = false;
					this.profileInfo = r.msg; 
				}).catch(() => {
			        this.loading = false;
				})
			},
			// 更新用户信息
			async toUpdateInfo(){
				this.handleUpdateInfo();
			},
			// 更新用户信息
			async handleUpdateInfo () {
				if(!(/(^[1-9]\d*$)/.test(this.profileInfo.bank_number))){
					this.$mHelper.toast('银行卡号只能是数字');
					return;
				} 
				this.btnLoading = true; 
				await this.$http.post(`${memberUpdate}?uuid=${this.profileInfo.uuid}`, {
					...this.profileInfo, 
					uuid:this.profileInfo.uuid,
					method : "put"
				}).then((r) =>{
					console.log(r)  
					if (r.status == 1){
						this.$mHelper.toast(r.msg); 
					}else{
						this.$mHelper.toast(r.msg);
						setTimeout(() => {
							this.$mRouter.back();
						}, 1 * 3000);
					} 
				    this.btnLoading = false;
				}).catch((r) => {
					console.log(r)
					this.btnLoading = false;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: $color-white;
	}
	.userinfo{
          .tips{
			  margin: 0 25rpx;
		  }
		  .feedback-quick {
				position: absolute;
				right: 60rpx;
				padding-right: 40upx;
			}
			.feedback-quick:after {
				font-family: uniicons;
				font-size: 40upx;
				content: '\e581';
				position: absolute;
				right: 0;
				top: 50%;
				color: #bbb;
				-webkit-transform: translateY(-50%);
				transform: translateY(-50%);
			}
		 
		.input-content{
			padding: 40rpx 60rpx;
			.input-item{
				display:flex;
				padding: 0 30upx;
				background: $page-color-light;
				height: 80upx;
				line-height: 80upx;
				border-radius: 4px;
				margin-bottom: 30upx;
				&:last-child{
					margin-bottom: 0;
				}
				.tit{
					width: 110upx;
					font-size: $font-sm+2upx;
					color: $font-color-base;
				}
				input {
					height: 80upx;
					line-height: 80upx;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					width: 300upx;
				} 
			}
		}
	}
</style>
