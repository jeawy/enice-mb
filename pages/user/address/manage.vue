<template>
	<!-- 收货地址列表 -->
	<view class="address-manage rf-row-wrapper">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.receiver" @blur="handleRealNameChange" placeholder="收货人姓名"
			 placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码"
			 placeholder-class="placeholder" />
		</view>
 
		<view class="row b-b">
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.detail" @blur="bindAddressDetailsChange" placeholder="请输入详细地址"
			 placeholder-class="placeholder" />
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="true" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" :disabled="btnLoading" :loading="btnLoading" @tap="validateForm">提交</button>
		<!--加载动画-->
		<rf-loading v-if="loading"></rf-loading>
	</view>
</template>

<script>
	import { 
		addressDetail,
		addAddress,
	} from '@/api/userInfo';
	import rfPickRegions from '@/components/rf-pick-regions';
	export default {
		components: {
			rfPickRegions
		},
		data() {
			return {
				addressData: {
					default:1
				},
				btnLoading: false,
				loading: true
			}
		},
		onLoad(options) {
			this.initData(options);
		},
		methods: {
			// 获取选择的地区
			handleGetRegions(e) {
				this.addressData.province_id = e.province_id;
				this.addressData.city_id = e.city_id;
				this.addressData.area_id = e.area_id;
			},
			// 数据初始化
			async initData(options) {
				let title = '新增收货地址';
				if (options.type === 'edit') {
					title = '编辑收货地址'
					await this.getAddressDetail(options.id)
				} else {
					setTimeout(() => {
						this.loading = false;
					}, 1 * 1000);
				}
				this.manageType = options.type;
				uni.setNavigationBarTitle({
					title
				});
			},
			// 获取收货地址
			async getAddressDetail(id) {
				await this.$http.get(`${addressDetail}`, {
					id
				}).then(async r => {
					this.addressData = r.data;
					setTimeout(() => {
						this.loading = false;
					}, 1 * 1000);
				}).catch(() => {
					this.loading = false;
				})
			},
			handleRealNameChange(e) {
				this.addressData.realname = e.detail.value;
			},
			bindAddressDetailsChange(e) {
				this.addressData.address_details = e.detail.value;
			},
			handleMobileChange(e) {
				this.addressData.mobile = e.detail.value;
			},
			switchChange(e) {
				this.addressData.default = e.detail.value?1:0;
			},
			// 表单验证
			validateForm() {
				if (!this.addressData.receiver) {
					this.$mHelper.toast('请填写收货人姓名');
					return;
				} 
				this.btnLoading = true;
				
				if (this.manageType === 'edit') {
					this.handleAddressUpdate(data)
				} else {
					this.handleAddressCreate()
				}
				
				
			},
			handleAddressUpdate(data) {
				addAddress().then(() => {
					this.btnLoading = false;
					this.$mHelper.toast('收货地址修改成功！');
					this.$mRouter.back();
				}).catch(() => {
					this.btnLoading = false;
				});
			},
			handleAddressCreate() {
				addAddress(this.addressData).then(({status,msg}) => {
					this.$mHelper.toast(msg);
					if(status === 0){
						this.$mRouter.back();
					}
				}).finally(() => {
					this.btnLoading = false;
				});
			}
		}
	}
</script>

<style lang="scss">
	.address-manage {
		.rf-pick-regions {
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
		}
	}

	page {
		background: $page-color-base;
	}

	.address-manage {
		padding-top: 16upx;
	}
</style>
