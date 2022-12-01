<template>
	<view>  
	 
		<view class="list" >
			<sib-list class="listcontent" 
			:isNoList="isNoList" :noListText="noListText" 
			:floterText="floterText" ref="sibList" >
				<!-- 内部block可自定义 -->
				<block class="" slot="sibScrollList"> 
					<view class="listitem"
						v-for="(item, index) in addressList" :key="index"
						@touchstart="touchSlideStart($event,index)" 
						@touchend="touchSlideEnd($event,index)"
						@touchmove="touchSlideMove($event,index)" 
						:style="{transform:'translate3d('+item.slide_x+'px, 0, 0)'}"
						>
						<view v-if="charge" class="tui-address-container" @tap ="confirm(item.id,item.receiver,item.phone,item.address)">
							<view class="tui-address-container tui-address-container-user"> 
								<text class="username">{{item.receiver}}</text> <text  class="phone">{{item.phone}}</text> 
								<view class="tui-address-label" v-if="item.default == 1">默认地址</view>
							</view>
							<view class="tui-address-detail"> 
									<text>{{item.address}}</text>
							</view> 
						</view>
						<view v-else class="tui-address-container" >
							<view class="tui-address-container tui-address-container-user"> 
								<text class="username">{{item.receiver}}</text> <text  class="phone">{{item.phone}}</text> 
								<view class="tui-address-label" v-if="item.default == 1">默认地址</view>
							</view>
							<view class="tui-address-detail"> 
									<text>{{item.address}}</text>
							</view> 
						</view>
						<view class="group-btn">
							<view class="editM editbtn" @tap="editAddress(item.id)">
								编辑
							</view>
							<view class="removeM btn-div" @tap="deleteAddress(index, item.id)">
								删除
							</view>
						</view> 
					</view>  
				</block>
			</sib-list>
		</view>
		<!-- 新增地址 -->
		<view class="tui-address-new">
			<view height="88rpx" @tap="createAddr">+ 新增收货地址</view>
		</view> 
	</view>
</template>

<script>
	import dayjs from 'dayjs'  
import sibList from '@/components/sib-list/sib-list.vue'
import { Look_Address,Delete_Address,} from "@/api/receiptAddress"
export default {
	components: {
		sibList
	},
	data() { 
		return {  
			addressList: [],
			distance:1233,
			cities : [],
			tracks : [],
			page : 1, //默认第一页
			pagenum:5,//每页5条 
			floterText : "",
			noListText : "暂无数据",
			isNoList : false,
			allowPullup : true,
			visible: false,
			start_slide_x: 0,
			btnWidth: 0,
			startX: 0,
			LastX: 0,
			startTime: 0,
			charge:false,
			giftid:'',
		};
	},
	methods: { 
		/* 滑动删除事件 开始 */
		// 分享 
		// 滑动开始
		touchSlideStart(e, index) {
			  
			//记录手指放上去的时间
			this.startTime = e.timeStamp;
			//记录滑块的初始位置
			this.start_slide_x = this.addressList[index].slide_x;
			 
			// 按钮宽度
			uni.createSelectorQuery()
				.selectAll('.group-btn')
				.boundingClientRect()
				.exec(res => { 
					if (res[0] != null) { 
						this.btnWidth = res[0][index].width * -2;
					}
				});
			// 记录上一次开始时手指所处位置
			this.startX = e.touches[0].pageX;
			// 记录上一次手指位置
			this.lastX = this.startX;
			//初始化非当前滑动消息列的位置
			this.addressList.forEach((item, eq) => {
				if (eq !== index) {
					item.slide_x = 0;
				}
			});
			  
		},
		// 滑动中
		touchSlideMove(e, index) {
			 
			const endX = e.touches[0].pageX;
			const distance = endX - this.lastX; 
			// 预测滑块所处位置
			const duang = this.addressList[index].slide_x + distance;
			// 如果在可行区域内
			
			if (duang <= 0 && duang >= this.btnWidth) {
				this.addressList[index].slide_x = duang;
			}
			
			// 此处手指所处位置将成为下次手指移动时的上一次位置
			this.lastX = endX;
			 
			  
		},
		// 滑动结束
		touchSlideEnd(e, index) {
			  
			let distance = 10;
			const endTime = e.timeStamp;
			const x_end_distance = this.startX - this.lastX;
			if (Math.abs(endTime - this.startTime) > 200) {
				distance = this.btnWidth / -2;
			}
			// 判断手指最终位置与手指开始位置的位置差距
			if (x_end_distance > distance) {
				this.addressList[index].slide_x = this.btnWidth;
			} else if (x_end_distance < distance * -1) {
				this.addressList[index].slide_x = 0;
			} else {
				this.addressList[index].slide_x = this.start_slide_x;
			}
			  
		},
		// 点击回复原状
		recover(index) {
			this.addressList[index].slide_x = 0;
		}, 
		createAddr() {
				uni.navigateTo({
					url: "../giftcenter/createAddress?id="+this.giftid
				})
			},
			lookAddress(){
				Look_Address().then(({ data }) =>{ 
					if(data.status == 0){
						this.addressList = [...data.msg]
					}
				})
			},
			editAddress(id){
				uni.navigateTo({
					url: "../giftcenter/editAddress?id="+id + "&giftid=" + this.giftid
				})
			},
			deleteAddress(index, id){
				var that = this;
				uni.showModal({
					content: '确定删除此地址吗？',
					confirmColor: "#FF0000",
					success: function(res) {
						if (res.confirm) {
							Delete_Address({
								method: "delete",
								ids:id
							}).then(({
								data
							}) => {
								if (data.status == 0) {
									uni.showToast({
										title: '删除成功',
										duration: 3000
									});
									that.lookAddress();
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			confirm(id,receiver,phone,address){
				if(this.giftid !== ''){
					uni.navigateTo({
							url: "../giftcenter/giftcharge?id="+id+"&username="+receiver+"&mobile="+phone+"&address="+address
					})
				}
			},
	}, 
	onLoad: function(options) {
		if(options.id !== undefined){
			this.giftid = options.id
			console.log(this.giftid)
			this.charge = true;
		}
		if(options.giftid !== undefined){
			this.giftid = options.giftid
			console.log(this.giftid)
			this.charge = true;
		}
		this.lookAddress();
	}, 
	computed: { 
		isLogin() {
			return this.$mStore.state.estateToken || uni.getStorageSync('estateToken')
		},
	},
};
</script> 
<style lang="scss" scoped>
.list{
	width: 100%;
	overflow: hidden;
}
.listitem{
    display: flex;
	margin:2rpx auto;
	height: 180rpx;
	border-left:15rpx solid #DF5000;
	border-bottom: 1px solid #f5f9f7;
	 
} 
	.group-btn {
		float: left;
		display: flex;
		flex-direction: row; 
		min-width: 220rpx;
		align-items: center; 
	}

	.group-btn .btn-div {
		height: 180rpx;
		min-width: 220rpx;
		color: #fff;
		text-align: center; 
		font-size: 34upx;
		line-height: 180rpx;
	} 
	.group-btn .editbtn {
		height: 180rpx;
		min-width: 220rpx;
		color: #fff;
		text-align: center; 
		font-size: 34upx;
		line-height: 180rpx;
	} 
	.group-btn .removeM {
		background-color: #DF5000;
	}
	.group-btn .editM {
		background-color: #22bb9c;
	}
	.tui-address {
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 160rpx;
	}
	.tui-address-container{
		 width:750rpx; 
	}
	.tui-address-container-user{
		padding-top:40rpx;
		margin-bottom: 30rpx;
	}
	.username{
		margin-left:20rpx;
		margin-right: 20rpx; 
	}
	.phone{
		color:#848689;
	}

	.tui-address-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width:100%;
		white-space: pre-line;
		right:0;
	}
    .tui-address-item{
		right:0;
		padding-left:20upx;
		font-size:28upx;
		color: #bfbfbf;
	}
	.tui-address-main {
		width: 100%;
		height: 70upx;
		display: flex;
		font-size: 30upx;
		line-height: 80upx;
		padding-left: 25upx;
	}

	.tui-address-name {
		height: 60rpx;
	}

	.tui-address-tel {
		padding-left: 15upx;
		padding-top:2upx;
		font-size:28upx;
		color: #bfbfbf;
	}

	.tui-address-detail {
		font-size: 30upx;
		word-break: break-all;
		padding-bottom: 25rpx;
		padding-left: 25rpx;
	}

	.tui-address-label {
		padding: 5rpx 8rpx; 
		flex-shrink: 0;
		background: #e41f19;
		border-radius: 6rpx;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: center center;
		margin-right: 6rpx;
	}

	.tui-address-img {
		width: 36rpx;
		height: 36rpx;
	}

	.tui-address-new {
		width: 90%;
		position: fixed;
		bottom: 30upx;
		z-index: 9;
		box-sizing: border-box;
		text-align: center;
		padding: 20upx;
		border-radius: 20upx;
		color:#FFFFFF;
		font-weight: bold;
		margin-left:5%;
		background-color:#DF5000;
	}

	.tui-safe-area {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
