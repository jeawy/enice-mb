<template>
	<view id="editProfile">
		<!-- 编辑资料 -->
		<view class="header">

			<!-- <image @tap="target('/pages/user-center/personalCenter/portrait')"   class="i" :src="'https://tl.map2family.com'+'/'+thumbnail_portait"></image> -->
			<!-- <image @tap="target('/pages/user-center/personalCenter/portrait?image='+encodeURIComponent(JSON.stringify(this.thumbnail_portait)))"
			 class="i" :src="'https://tl.map2family.com'+'/'+thumbnail_portait"></image> -->
			<image class="img" :src="url+thumbnail_portait" @tap="previewImage()"></image>
		</view>

		<view class="body">
			<view class="bodyList">
				<view class="name">昵称：</view>
				<view v-if="username == ''">
					<input class="input-text" type="text" @tap="change" @input="onKeyInput" />
				</view>
				<view else>
					<input class="input-text" disabled="true" v-model="username" />
				</view>
			</view>

			<view class="bodyList">
				<view class="name">性别：</view>
				<view>
					<radio-group @change="radioChange">
						<label >
							<radio style="transform:scale(0.7)" color="#DF5000" value="男" :checked="checked" />男</label>
						<label>
							<radio style="transform:scale(0.7)" color="#DF5000" value="女" :checked="checked1" />女</label>
					</radio-group>
				</view> 
			</view>
			<view class="bodyList">
				<view class="name">参与里程排行榜：</view>
				<view>
					<radio-group @change="radioChangeDistance">
						<label >
							<radio style="transform:scale(0.7)" color="#DF5000" value="1" :checked="checkedDistance" />是</label>
						<label>
							<radio style="transform:scale(0.7)" color="#DF5000" value="0" :checked="uncheckedDistance" />否</label>
					</radio-group>
				</view> 
			</view>
			<view class="bodyList">
				<view class="name">参与积分排行榜：</view>
				<view>
					<radio-group @change="radioChangeCoin">
						<label >
							<radio style="transform:scale(0.7)" color="#DF5000" value="1" :checked="checkedCoin" />是</label>
						<label>
							<radio style="transform:scale(0.7)" color="#DF5000" value="0" :checked="uncheckedCoin" />否</label>
					</radio-group>
				</view> 
			</view>
			<view class="bodyList">
				<view class="name">车牌：</view>
				<view>
					<input  disabled="true" @tap="plateShow=true" v-model.trim="plateNo"/>
					<plate-input v-if="plateShow" :plate="plateNo" @export="setPlate" @close="plateShow=false"></plate-input>
				</view>
			</view>

			<view class="bodyList">
				<view class="name">签名：</view>
				<view>
					<input  type="text" v-model="signature" />
				</view>
			</view>
		</view>
		<view class="footer">
			<button class="save" type="primary" @tap="save">保存</button>

		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import {
		search_users,
		update_users
	} from '@/api/usercenter';
	import cropper from "@/components/cropper.vue";
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
	export default {
		data() {

			return {
				checked: false,
				checked1: false,
				checkedCoin : false,
				uncheckedCoin : false,
				checkedDistance : false,
				uncheckedDistance : false,
				username: '',
				name: '',
				sex: '',
				signature: '',
				birth: '',
				method: 'put',
				showUpImg: false,
				thumbnail_portait: '',
				portait:'',
				car_number: null,
				plateNo: '',
				plateShow: false,
                id:'',
				url:'',
				distance_rank: 1,
				score_rank : 1,
				Image:[],
			};
		},
		components: {
			cropper,
			plateInput
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			},
			isLogin() {
				return this.$mStore.state.estateToken || uni.getStorageSync('estateToken')
			},
		},
		onLoad(option) {
			this.searchimage();	
            this.url = this.$mStore.state.BaseUrl + '/'
		},
		onShow() {
			this.search();
		},
		methods: {
			onKeyInput: function(event) {
				console.log(event.target.value)
				this.name = event.target.value;
			},
			change() {
				uni.showToast({
					title: '昵称只可以修改一次哦',
					icon: "none",
				});
			},
			radioChange(e) {
				this.sex = e.detail.value;
			},
			radioChangeDistance(e) {
				this.distance_rank = e.detail.value;
			},
			radioChangeCoin(e) {
				this.score_rank = e.detail.value;
			},
			setPlate(plate) {
				if (plate.length >= 7) this.plateNo = plate
				this.plateShow = false
				this.car_number = this.plateNo;
			},
			//查看用户信息
			search() {
				if(this.isLogin){
					this.id = this.$mStore.state.UserInfo.id;
						let data = '';
						data = this.id;
						search_users({
							userid: data
						}).then(({
							data
						}) => {
							console.log(data)
							this.thumbnail_portait = data.msg[0].thumbnail_portait;
							this.plateNo = data.msg[0].car_number;
							this.signature = data.msg[0].signature;
							this.sex = data.msg[0].sex;
							if (this.sex == '男') {
								this.checked = true;
							} else {
								this.checked1 = true;
							}

							if (data.msg[0].score_rank ==  true) {
								this.checkedCoin = true;
								this.uncheckedCoin = false;
								this.score_rank = 1
							} else {
								this.checkedCoin = false;
								this.uncheckedCoin = true;
								this.score_rank = 0
							} 
 
							if (data.msg[0].distance_rank ==  true) {
								this.checkedDistance = true;
								this.uncheckedDistance = false;
								this.distance_rank = 1
								
							} else {
								this.checkedDistance = false;
								this.uncheckedDistance = true;
								this.distance_rank = 0
							}
  
							if (data.msg[0].username == '') {
								console.log(data.msg[0].username);
							} else {
								this.username = data.msg[0].username;
							}
						})
				}
			},
			searchimage() {
				if(this.isLogin){
					this.id = this.$mStore.state.UserInfo.id;
						let data = '';
						data = this.id;
						search_users({
							userid: data
						}).then(({
							data
						}) => {
							this.portait = data.msg[0].thumbnail_portait;
							this.Image.push(this.url + this.portait)
						})
				}
			},
			target(url) {
				uni.navigateTo({
					url
				})
			},
            //点击查看头像大图
            previewImage: function() {
            		uni.previewImage({
            			current: this.Image[0],
            			urls: this.Image,
            		})
            },
			//保存
			save(val) { 
				let data = {
					userid: this.UserInfo.id,
					sex: this.sex,
					signature: this.signature,
					carnum: this.plateNo,
					distance_rank: this.distance_rank,
					score_rank: this.score_rank,
					method: 'put',
				};
				if (this.name != ''){
					data.username = this.name
				}
				console.log(data)
				update_users(data).then(res => {
					uni.showToast({
						title: res.data.msg,
						icon: "none",
					});
					if (res.data.status == 0) {
						uni.showToast({
							title: res.data.msg,
							icon: "none",
						});
						uni.switchTab({
							url: '/pages/user-center/my-account',
							animationDuration: 200
						});

					}
				}) 
			},

		},


	}
</script>

<style lang="scss" scoped>
	#editProfile {
		.header {
			padding-top: 45upx;
			padding-bottom: 45upx;
			text-align: center;
			border-bottom: 2.083upx solid #f5f9f7;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.img {
				width: 185rpx;
				height: 185rpx;
				border-radius: 50%;
				box-shadow: 1px 1px 2px #F2F2F2;
				border: 1.5px solid #F2F2F2;
			}
		}

		.body {
			.bodyList {
				display: flex;
				align-items: center;
				padding: 50.25upx 41.666upx;
				border-bottom: 2.083upx solid #f5f9f7;

             label{
				 position:relative;
				 padding-right:1rem;
				 
			 }
			    .footer{
				 padding: 15upx;
			    }
				.name {
					
					width: 240rpx; 
					position: relative;
				}
				.input-text{
					position:relative;
					height:5%;
					
				}

			}
		}

		.save {
			background-color: #DF5000;
			border-radius: 50upx;
			margin-top:7%;
			position:relative;
			width: 250rpx;
		}

		.uni-changeimage {

			// background: #fff;
			// background: #f5f9f7;
			&>view {
				background: #fff;
				padding: 0 41.666upx;
				height: 118upx;
				border-bottom: 2.083upx solid #f5f9f7;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
