<template>
	<!--修改收货地址-->
	<view class="tui-addr-box">
		<form :report-submit="true">
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货人</view>
					<input type="text" v-model="name" placeholder-class="tui-phcolor" class="tui-input" name="name" placeholder="请输入收货人姓名" maxlength="15"/>
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">手机号码</view>
					<input  type="number" v-model="mobile" placeholder-class="tui-phcolor" class="tui-input" name="mobile" placeholder="请输入收货人手机号码" maxlength="11"
					 pattern="[0-9]*" oninput="value=value.replace(/[^\d.]/g,'')"/>
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-line-cell">
					<view class="tui-title">收货地址</view>
					<input  type="text" v-model="address" placeholder-class="tui-phcolor" class="tui-input" name="address" placeholder="请输入详细的收货地址" maxlength="50" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false" padding="0">
				<view class="tui-swipe-cell">
					<view class="tui-title">设为默认地址</view>
					<switch color="#30CC67" class="tui-switch-small" @change="switchChange"/>
				</view>
			</tui-list-cell>
			<!-- 保存和删除地址 -->
			<view class="tui-save">
				<view class="tui-addr-save" height="88rpx" @tap="putAddress">
					保存收货地址
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import tuiListCell from "@/components/gift/list-cell"
	import tuiListView from "@/components/gift/list-view"
	import { Put_Address,Delete_Address,Look_Address} from "@/api/receiptAddress"
	export default {
		components: {
			tuiListView,
			tuiListCell
		},
		data() {
			return {
				name:'',
				mobile:'',
				address:'',
				default:'',
				id:'',
				userInfo:[],
				giftid:'',
			}
		},
		methods: {
			lookAddress(){
				let data = {
					id:this.id
				}
				Look_Address(data).then(({ data }) =>{
					if(data.status == 0){
						this.userInfo = [...data.msg]
						this.userInfo.map((item,index)=>{
							this.default = item.default,
							this.name = item.receiver,
							this.mobile = item.phone,
							this.address = item.address
						})
					}
				})
			},
			switchChange(e){
				if(e.target.value == true){
					this.default = 1;
				} else{
					this.default = 0;
				}
			},
			putAddress(){
				let reg = /^1(3|4|5|7|8|9)\d{9}$/
				if (!reg.test(this.mobile)) {
					uni.showToast({
						title: "手机号格式错误",
						icon: "none",
					});
					return;
				}
				if (!this.address) {
					uni.showToast({
						title: "请输入收获地址",
						icon: "none"
					});
					return;
				}
				let data = {
					method:"put",
					id:this.id,
					address:this.address,
					receiver:this.name,
					phone:this.mobile,
					default:this.default
				}
				Put_Address(data).then(({ data }) =>{
					if(data.status == 0){
						uni.showToast({
							title: '地址修改成功',
							duration: 3000
						});
						uni.navigateTo({
							url: '../giftcenter/address?giftid='+this.giftid
						})
						
					} else{
						uni.showToast({
							title: data.msg,
							icon: "none",
						});
					}
				})
			},
			deleteAddress(){
				let data = {
					method:"delete",
					ids:this.id
				}
				Delete_Address(data).then(({ data }) =>{
					if(data.status == 0){
						uni.showToast({
							title: '地址删除成功',
							duration: 3000
						});
						uni.navigateTo({
							url: '../giftcenter/address?giftid='+this.giftid
						})
					}
				})
			},
		},
		onLoad: function (options) { //option为object类型，会序列化上个页面传递的参数
			console.log(options.id);//打印出上个页面传递的id。
			console.log(options.giftid)
			this.giftid = options.giftid;
			this.id = options.id;
			this.lookAddress();
		}
	}
</script>

<style scoped>
	.tui-addr-box {
		padding: 20rpx 0;
	}

	.tui-line-cell{
		width: 100%;
		padding: 24rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}
	.tui-title {
		width: 180rpx;
		font-size: 28rpx;
	}

	.tui-title-city-text {
		width: 180rpx;
		display: block;
		line-height: 46rpx;
		white-space: pre-line;
	}

	.tui-input {
		width: 500rpx;
	}

	.tui-input-city {
		flex: 1;
		height: 40rpx;
		font-size: 28rpx;
		padding-right: 30rpx;
	}

	.tui-phcolor {
		color: #ccc;
		font-size: 28rpx;
	}
	.tui-cell-title{
		font-size: 28rpx;
	}
	.tui-addr-label {
		margin-left: 70rpx;
	}

	.tui-label-item {
		width: 76rpx;
		height: 40rpx;
		border: 1rpx solid rgb(136, 136, 136);
		border-radius: 6rpx;
		font-size: 26rpx;
		text-align: center;
		line-height: 40rpx;
		margin-right: 20rpx;
		display: inline-block;
		transform: scale(0.9);
	}
	.tui-label-active{
		background: #E41F19;
		border-color:#E41F19;
		color: #fff;
	}
	.tui-swipe-cell {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 10rpx 24rpx;
		border-radius: 6rpx;
		overflow: hidden;
		font-size: 28rpx;
	}

	.tui-switch-small {
		transform: scale(0.8);
		transform-origin: 100% center;
	}

	/* #ifndef H5 */
	.tui-switch-small .wx-switch-input {
		margin: 10upx;
		margin-left:20upx;
	}

	/* #endif */
    .tui-save{
		display:flex;
		margin-top: 120upx;
		
	}
	.tui-addr-save {
		text-align: center;
		width:90%;
		padding: 20upx;
        border-radius: 20upx;
		color:#FFFFFF;
		font-weight: bold;
        margin-left:5%;
		background-color:#DF5000;
	}
</style>