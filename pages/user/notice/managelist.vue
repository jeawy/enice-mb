<template>
	<view class="notice">
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
		<view class="listitem" 
			v-for="(item, index) in noticelst" 
			:key="index"  
			 :style="{transform:'translate3d('+item.slide_x+'px, 0, 0)'}">
			<view class="detail" :style="{minWidth: screenWidth+'px'}">
				<view class="left">  
					<image class="icon_dian"   :src="item.entity_type| entity_type_img( baseAppUrl)"></image>
					<view class="noticetype" >{{item.entity_type|entity_type_txt}}</view>
				</view>
				<view class="right">
					<view class="right_top"  @tap="target(item.appurl)">
						<view class="title">{{item.title}}</view> 
					</view> 
					<view class="time">{{item.date | time}}</view>
					<view class="content"  @tap="target(item.appurl)">{{item.content}}</view> 
					 
					<view class="group-btn">
						<view class="removeM btn-div" @tap="removeM(index, item.id)">
							删除
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view v-if="more" class="getmore" @tap="getMore">点击加载更多...</view>
		 <view class="process-order" v-if="noticelst.length == 0">
			<image class="process-img" :src="baseAppUrl + `kong.png`"></image>
			<view class="process-text">您没有新的消息</view>
			</view>
    <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
	</view>
</template>

<script>
import {getNotices, updateNotice} from "@/api/notice";
import tuiNomore from "@/components/gift/nomore";
	export default {
		components: {
			tuiNomore 
		},
		data() {
			return {
				tabList: [ 
				{
					name: '未读消息',
				},
				{
					name: '已读消息',
				},
			],
				screenWidth: '',
				more: false,
                nomore: false,
				noticelst: [],
				start_slide_x: 0,
				btnWidth: 0,
				startX: 0,
				LastX: 0,
				startTime: 0,
				baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
				page:1,
				pagenum: 10,
				tabIndex:0,
			};
		},
		onShow(){
			this.getDetail()
		},
		methods: { 
			switchTab(current) { 
				if (this.tabIndex != current) { 
					this.tabIndex = current
				} 
				this.page = 1
				this.getDetail()
			},
			target(appurl){ 
              this.$mRouter.push({route:appurl})
			},
			getMore() {
				this.page = this.page + 1;
				this.getDetail();
			},
			getDetail(){
				this.nomore = false;
                this.more = false; 
				let params = {
					page : this.page,
					pagenum : this.pagenum,
					pc:1,
					 
				}
				if (this.tabIndex == 0){
					params['read'] = 0
				}
				else{
					params['read'] = 1
				}
				getNotices(params).then(res=>{ 
					if(res.status == 0){ 
						if (res.msg.list.length < this.pagenum) {
						    this.nomore = true;
						} else {
						    this.more = true;
						}
						if (this.page == 1) {
						    this.noticelst = res.msg.list;
						} else {
						    this.noticelst = this.noticelst.concat(res.msg.list);
						}
					}else {
						uni.showToast({
						title: res.msg,
						icon: "error",
						duration: 3000,
						});
					}
				})
			},
			 
			// 删除
			removeM(index, id) {
				let _this = this
				uni.showModal({
					title: '',
					content: '确定要删除该信息吗？',
					confirmText: '删除',
					confirmColor: '#ff3b32',
					success: function(res) {
						if (res.confirm) { 
							const data = {  
							method: 'delete',
							ids : id,
							}
							 updateNotice(data).then((noticeres)=>{
								if (noticeres.status == 0){
									
								    uni.showToast({
										icon: "success",
										title: '删除成功!',
										duration: 3000
									});
									_this.noticelst.splice(index, 1)
							 	}
								 else{
									 uni.showToast({
										icon: "error",
										title:noticeres.msg,
										duration: 3000
									});
								 }
								 

							 });
							 
						} else if (res.cancel) {
							
						}
					}
				});
			},
		}, 
		onReady() {
			let system_info = uni.getSystemInfoSync();
			this.screenWidth = system_info.screenWidth-30
		},
		computed: {

		},
	};
</script>
<style lang="scss" scoped>
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
	width: 50%;
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
	 .notice{
		 min-height: 100vh;
		 background-color: white;
		 padding: 25rpx;
		 .process-order{
				width:700rpx;
				text-align: center;
				.process-img{
					width: 200rpx;
					height: 200rpx; 
				}
				.process-text{
					color:$font-color-base
				}
			}  
		 .listitem{
			 .detail{
				 display: flex;
				 margin-top:15rpx;
				 border-bottom: 1px solid  $border-color-light;
				 .left{
					 width: 120rpx;
					 text-align: center;
					 .icon_dian{
						 margin-top:50rpx;
						width: 100rpx;
						height: 100rpx;
						padding:15rpx;
						border-radius: 50rpx;
						border: 1px solid $border-color-base;
						box-shadow: 0px 0px 5px $border-color-base;
					 }
					 .noticetype{ 
						color: #1296db;
						font-weight: bold; 
					 }
				 }
				 .time{
							margin-top:15rpx;
							color: $font-color-light;
						 } 
				 .right{
					 .right_top{
						 display: flex;
						 .title{
							 color:$base-color;
							 font-weight: bold;
						 }
						 
					 }
					 .content{
						 margin-top:15rpx;
						 height: 100rpx;
						 color:$font-color-base;
					 }
					 .group-btn{
							 text-align: right; 
							 width: 580rpx;
							 margin-bottom: 10rpx;
							 .removeM {
								 
								color: $uni-color-error;
								font-weight: bold; 
							 }
							
						 }
				 }
			 } 
		 }
	 }
</style>
