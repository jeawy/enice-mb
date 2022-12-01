<template>
	<view class="v-main">
		<scroll-view
			class="ranktype"
			:scroll="false"
			:scroll-x="true"
			:show-scrollbar="false"
		>
		
			<view style="flex-direction: column">
				<view style="flex-direction: row" class="uni-tab">
					<view
						class="uni-tab-item"
						v-for="(tab, index) in tabList"
						:key="index"
						:ref="'tabitem' + index"
						:data-id="index"
						:data-current="index"
						@click="switchTab(index)"
						:class="tabIndex == index ? 'uni-tab-item-active' : ''"
					>
						<text
							class="uni-tab-item-title"
							:class="tabIndex == index ? 'uni-tab-item-title-active' : ''"
							:id="'tab' + index"
							>{{ tab.name }}</text
						>
					</view>
				</view>
			</view>
		</scroll-view>
		 
	<scroll-view class="listview" scroll-y>
		<view
			class="servicelist-box"
			v-for="(item, index) in allList"
			:key="index"
		>
			<view class="middle">
				<view class="header">
					<view class="servicelist-content"  @tap="detail(item.uuid)">{{ item.subject }}</view>
					<view class="time"> 
						<view class="primary-link" v-if="item.status===2" @tap="targatFinish(item, index)">
							点击结单
						</view> 
					</view>
				</view>
				<view class="info"  @tap="detail(item.uuid)">
					<view class="timess">{{item.communityname}} | 申请时间:{{ item.date | time }}</view>
					 
				</view>
				<view class="info">
					<view class="timess"  @tap="detail(item.uuid)">业主:{{ item.username}}</view>
					<view class="phones" @tap="call(item.phone)">电话:{{
						item.phone
					}}</view>  
				</view>
				<view class="info"  @tap="detail(item.uuid)">
					<view class="billno">订单号:{{ item.billno }}</view>
					<view class="serviceliststatuss">{{
						item.status | paidserviceStatusformat
					}}</view>  
				</view>
				  
			</view>
			  
		</view>
		<view v-if="empty" class="emptycontainer">
			<image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
			<view class="empty-text">暂无相关数据</view>
		</view>
		<view v-if="more" class="getmore" @tap="getMoreList"
			>加载更多...</view
		>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="2"></tui-loadmore>
		<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
	</scroll-view> 
	</view>
</template>

<script> 
import tuiLoadmore from '@/components/gift/loadmore'
import tuiNomore from '@/components/gift/nomore'
import { getPaidMoney, postPaidOrder  } from '@/api/paidservice.js'
export default {
	components: {
		tuiLoadmore,
		tuiNomore, 
	},
	data() {
		return {
			communityuuid: '',
			pattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				iconColor: '#fff',
				selectedColor: '#FF8000',
			},
			horizontal: 'left',
			vertical: 'bottom',
			direction: 'horizontal',
			content: [
				{
					iconPath: '/static/record/publish-grey.png',
					selectedIconPath: '/static/record/publish.png',
					text: '提维修单',
					active: true,
				},
			],
			tabIndex: 0,
			tabList: [
				{
					name: '全部',
				},
				{
					name: '待处理',
				},
				{
					name: '已办结',
				},
			],
			screenHeight: 0, 
			empty: false,
			more: false,
			nomore: false,
			loadding: false,
			allservicelist: true,
			newservicelist: false,
			noagreeservicelist: false,
			agreeservicelist: false,
			status: '',
			page: 1,
			pagenum: 5,
			allList: [],
			oldList: [],
			imgurl: '',
			Image: [],
			baseurl: this.$mStore.state.BaseUrl,
			baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
		}
	},
	onShow() {
		this.communityuuid = uni.getStorageSync('communityuuid')
		this.getList()
	},
	onLoad() {
		this.imgurl = this.$mStore.state.BaseUrl + '/images/' 
		var that = this
		this.tabIndex = 1
		uni.getSystemInfo({
			success: function (res) {
				that.screenHeight = res.screenHeight + 450
			},
		})
	},
	filters:{
		  paidserviceStatusformat(status) {
			switch (status) {
				case 0:
					return "未支付";
				case 2:
					return "已支付";
				case 3:
					return "已完成";
				case 4:
					return "异常订单";
			}
		}
	},
	methods: {
		call(phone){
			uni.makePhoneCall({
				phoneNumber:phone
			})
		}, 
		swiperChange(e) {
			let index = e.detail.current || e.target.current
			this.switchTab(index)
		},
		switchTab(current) { 
			if (this.tabIndex != current) { 
				this.tabIndex = current
			} 
			this.page = 1
			this.getList()
		},
		getList() { 
			if (this.tabIndex == 0) {
				this.status = -1
			} else if (this.tabIndex == 1) {
				this.status = 2 //  已支付，待完成
			} else if (this.tabIndex == 2) {
				this.status = 3 //  已完成
			} else {
				this.status = -1
			}
			this.nomore = false
			this.more = false
			this.page = 1
			let param = {
				page: this.page,
				pagenum: this.pagenum, 
				communityuuids: uni.getStorageSync('communityuuid'),
			} 
			if (this.status == 2 || this.status == 3 || this.status == -1) { 
				param['status'] = this.status
			}
			getPaidMoney(param).then(data => {
				if (data.status == 0) { 
					console.log(data.msg.orders)
					this.allList = [...data.msg.orders]
					if (data.count == 0) {
						this.empty = true
					} else {
						this.empty = false
						if (this.allList.length < this.pagenum) {
							this.nomore = true
						} else {
							this.more = true
						}
					}
				}
			})
			this.empty = false
		},
		getMoreList() {
			this.nomore = false
			this.more = false
			this.loadding = true
			this.page = this.page + 1
			let param = {
				page: this.page,
				pagenum: this.pagenum, 
				communityuuids: uni.getStorageSync('communityuuid'),
			}
			if (this.status == 2 || this.status == 3 || this.status == -1) { 
				param['status'] = this.status
			}
			getPaidMoney(param).then(data => {
				if (data.status == 0) {
					this.loadding = false
					this.oldList = [...data.msg.orders]
					if (this.oldList.length < this.pagenum) {
						this.nomore = true
						this.more = false
					} else {
						this.more = true
					}
					this.allList = this.allList.concat([...data.msg.orders])
				}
			})
		},
		 
		detail(id) {
			uni.navigateTo({
				url: '../repair/detail?uuid=' + id,
			})
		},
		targatFinish(item, index) {
			let _this = this
			uni.showModal({
				title:item.subject,
				content:"该有偿服务已完成，确定结单",
				success:function(res){
					if(res.confirm){
						let data = {
							method: "put",
							uuid: item.uuid,
							status: 2,
							communityuuid: item.communityuuid,
						};
						postPaidOrder(data).then(res => {
							console.log(res)
							if (res.status === 0) {
								uni.showToast({
								   icon:"success",
								   title:res.msg
							   })
							    _this.allList.splice(index, 1)
							} else {
							   uni.showToast({
								   icon:"error",
								   title:res.msg
							   })
							}
						});
					}
				}
			})
		}, 
	},
}
</script>

<style scoped lang="scss">
.primary-link{
	color: white;
	width:180rpx;
	text-align: center;
	background-color:$base-color;
	&:active{
		color:rgba($color: $base-color, $alpha: 0.8)
	}
}
.uni-tab {
	display: flex;
	text-align: center;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 10rpx;
	height: 80rpx;
}
.uni-tab-item {
	/* #ifndef APP-PLUS */
	display: inline-block;
	/* #endif */
	flex-wrap: nowrap;
	width: 33.33%;
	padding-left: 20rpx;
	padding-right: 20rpx;
	padding-bottom: 5rpx;
}
.uni-tab-item-title {
	font-size: 30rpx;
	line-height: 80rpx;
	flex-wrap: nowrap;
	/* #ifndef APP-PLUS */
	white-space: nowrap;
	/* #endif */
}
.uni-tab-item-active {
	border-bottom: 10rpx solid #df5000;
}
.uni-tab-item-title-active {
	color: #df5000;
}
.listview { 
	 .info{
		 display: flex;
		 justify-content: space-between;
		 margin-top: 25rpx;
		 margin-bottom: 25rpx;;
		 .phones{
			 border-bottom: 1px solid $base-color;
		 }
		 .billno, .serviceliststatuss{
			 color:$base-color;
			 font-weight: bold;
		 }
	 }
}
.servicelist-box {
	border-bottom: 1px solid #f5f9f7;
	position: relative;
	padding: 30rpx;
}
.feedbox {
	border-bottom: 1px solid #f5f9f7;
	position: relative;
	padding: 50rpx 30rpx;
}
.picturebox {
	position: relative;
	display: flex;
	margin-top: 10rpx;
}
.picture {
	position: relative;
	width: 180rpx;
	height: 180rpx;
	margin-bottom: 10rpx;
	margin-right: 20rpx;
}
.middle {
	position: relative;
}
.header {
	position: relative;
	display: flex;
	border-bottom: 2px solid $base-color;
}
.serviceliststatus {
	color: #666;
	font-size: 25rpx;
	position: absolute;
	right: 25rpx;
	top: 50rpx;
}
.delete-image {
	position: absolute;
	width: 50rpx;
	height: 50rpx;
	right: 10rpx;
	top: 72rpx;
}
.result {
	position: relative;
	font-size: 25rpx;
	color: #666;
	margin-bottom: 30rpx;
	max-width: 300rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.emptycontainer {
	position: absolute;
	padding: 20rpx;
	left: 200rpx;
}
.empty-img {
	width: 300rpx;
	height: 300rpx;
	position: relative;
}

.empty-text {
	position: absolute;
	left: 25%;
}

.servicelist-content {
	position: relative;
	font-size: 30rpx;
	dispaly: inline-block; 
	max-width: 300rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.content {
	position: relative;
	font-size: 30rpx;
	dispaly: inline-block;
	top: 10rpx;
}
.time {
	position: absolute;
	right: 25rpx;
	font-size: 25rpx;
	color: #8c8c8c;
}
.contact {
	position: relative;
	margin-bottom: 30rpx;
}
.star {
	position: relative;
	margin-bottom: 35rpx;
}
.starbox {
	position: relative;
	margin-bottom: -15rpx;
}

.v-main {
	background-color: white;
	min-height: 900rpx;
}
</style>
