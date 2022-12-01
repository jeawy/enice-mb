<template>
	<view class="v-main">
		<scroll-view class="ranktype" :scroll="false" :scroll-x="true" :show-scrollbar="false" >
			<view style="flex-direction: column;">
				<view style="flex-direction: row;" class="uni-tab">
					<view class="uni-tab-item" v-for="(tab,index) in tabList" :key="index" :ref="'tabitem'+index" :data-id="index"
					 :data-current="index" @click="switchTab(index)" :class="tabIndex==index ? 'uni-tab-item-active' : ''">
						<text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''" :id="'tab'+index">{{tab.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view> 
		<view class="feedback-box" v-for="(item,index) in allList" :key="index"  >
			 
			<view class=" header-top" >
				<view class="feedback-content"  >{{item.title}}</view>
				<view class="time">{{item.date|time}}</view>
			</view>
			<view class="header" >
				<rich-text :nodes="item.detail"
				class="rdetail"  
				width="700rpx"></rich-text> 
			</view> 
			<view class="action-box b-t"> 
				<view
					class="txtclick" 
					v-if="item.status == 0" 
					@tap="finishBacklogs(item.uuid, index)"
				>
						办结 
				</view>
					
				<view
					class="v-edit"  
					@tap="deleteBacklogs(item.uuid, index)"
				>
					删除 
				</view>
			</view> 
				  
			 
		</view> 
		<view v-if="empty" class="emptycontainer">
			<image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
			<view class="empty-text">暂无相关数据</view>
		</view>
		<view v-if="more"  class="getmore"  @tap="getmorefeedback">加载更多...</view>
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="2" ></tui-loadmore>
		<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
		
		 <!-- 底部按钮 --> 
		 <uni-fab 
		   :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			@trigger="trigger" ></uni-fab>
	</view>
</template>

<script> 
	import tuiLoadmore from "@/components/gift/loadmore"
	import tuiNomore from "@/components/gift/nomore"
	import {ApiLookBacklogs,ApiDeleteBacklogs, ApiPutBacklogs} from '@/api/backlog'
	export default {
		components: {
			tuiLoadmore,
			tuiNomore,
		},
		data() {
			return {
				communityuuid:"",
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					iconColor: '#fff', 
					selectedColor: '#FF8000', 
				},
				horizontal: 'left',
				vertical: 'bottom',
				direction: 'horizontal',
				content: [{
					iconPath: '/static/record/publish-grey.png',
					selectedIconPath: '/static/record/publish.png',
					text: '添加待办',
					active: true
				} ],
				tabIndex: 0,
				tabList: [ {
					name: '待办'
				}, {
					name: '已办结'
				} ],
				screenHeight: 0, 
				empty: false,
				more:false,
				nomore:false,
				loadding:false, 
				status: '',
				feedbackpage:1,
				pagenum:5,
				allList:[],
				oldList:[],
				imgurl:'',
				Image:[],
				baseurl: this.$mStore.state.BaseUrl,
                baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
			}
		},
		onShow(){ 
			this.communityuuid = uni.getStorageSync("communityuuid");
			this.getList();
		},
		onLoad() {
			this.imgurl = this.$mStore.state.BaseUrl + '/images/';  
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					that.screenHeight = res.screenHeight + 450
				}
			});
		},
		methods: {
			trigger(e){ 
				let route = '/pages/backlog/publish'
				this.$mRouter.push({route}); 
			}, 
			swiperChange(e) {
				let index = e.detail.current || e.target.current;
				this.switchTab(index)
			},
			switchTab(current) {
				if (this.tabIndex == current) {
					console.log(this.tabIndex)
				} else {
					this.tabIndex = current;
				}
				this.page = 1 
				this.getList();
			},
			getList() {
				if (this.tabIndex == 0) {
					this.status = 0
				} else if (this.tabIndex == 1) {
					this.status = 1
				}  
                this.nomore = false;
				this.more = false;
				this.feedbackpage = 1;
				let param = {
					page:this.feedbackpage,
					pagenum:this.pagenum,
					 status:this.status
				}
				  
				ApiLookBacklogs(param).then((data) => { 
					if (data.status == 0) { 
						this.allList = [...data.msg.list]; 
						if (data.count == 0) {
							this.empty = true;
						}else{
							this.empty = false;
							if(this.allList.length < this.pagenum){
								this.nomore = true;
							}else{
								this.more = true;
							}
						}
					}
				})
				this.empty = false;
				 
			},
			getmorefeedback(){
				this.nomore = false;
				this.more = false;
				this.loadding = true;
				this.feedbackpage = this.feedbackpage + 1;
				let param = {
						page:this.feedbackpage,
						pagenum:this.pagenum,
						tag:0,
						communityuuid:uni.getStorageSync("communityuuid")
					}
				if (this.status != '') {
					param['status'] = this.status 
				} 
				ApiLookBacklogs(param).then((data) => {
					if (data.status == 0) {
						this.loadding = false;
						this.oldList = [...data.msg.list];
						if(this.oldList.length < this.pagenum){
							this.nomore = true;
							this.more = false;
						}else{
							this.more = true;
						}
						this.allList  = this.allList.concat([...data.msg.list]); 
					}
				})
				 
			},
			finishBacklogs(uuid, index){
				var that = this;
				uni.showModal({
					title: '',
					content: '已办结该待办事项？',
					confirmText: '办结',
					confirmColor: '#FD5000',
					success: function(res) {
						if (res.confirm) { 
							const data = { 
								uuid: uuid, 
								status:1,
								method:"put"
							}
							ApiPutBacklogs(data).then((res) => {
								console.log(res)
								if (res.status == 0) {
									uni.showToast({
										icon: "success",
										title: '已办结!',
										duration: 3000
									});
									that.allList.splice(index, 1);
								} else {
									console.log(res)
								}
				
							});
						} else if (res.cancel) {
							
						}
					}
				});
			},
			deleteBacklogs(uuid, index){
				var that = this;
				uni.showModal({
					title: '',
					content: '您好，确定要删除该待办事项吗？',
					confirmText: '删除',
					confirmColor: '#FD5000',
					success: function(res) {
						if (res.confirm) { 
							const data = {
								method: 'delete',
								uuids: uuid, 
							}
							ApiDeleteBacklogs(data).then((res) => { 
								if (res.status == 0) {
									uni.showToast({
										icon: "success",
										title: '删除成功!',
										duration: 3000
									});
									that.allList.splice(index, 1);
								} else {
									console.log(res)
								}
				
							});
						} else if (res.cancel) {
							
						}
					}
				});
			},
			detail(id) {
				uni.navigateTo({
					url: '../backlog/detail?uuid=' + id 
				})
			}, 
		}
	}
</script>

<style scoped lang="scss">
	.action-box{
		width: 700rpx;  
		display: flex; 
		justify-content: space-between; 
		padding-top:15rpx; 
		.v-edit{
			font-size:30rpx; 
			color:$uni-color-error;
			font-weight: bold;
		}
		.txtclick{
			font-size:30rpx;
			margin-right: 35rpx;  
			font-weight: bold;
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
		border-bottom: 10rpx solid #DF5000;
	}
	.uni-tab-item-title-active {
		color: #DF5000;
	}
	.listview {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		/* #ifndef MP-ALIPAY */
		flex-direction: column;
		/* #endif */
	}
	.feedback-box{ 
	   position:relative;
	   padding:0 30rpx ;
	   padding-top:30rpx;
	}
	   
	.header{
		position:relative;
		display:flex;
	}
	.feedbackstatus{
		color: #666;
		font-size: 25rpx;
		position:absolute;
		right:75rpx;
		top:80rpx;
	}
	.delete-image{
		position:absolute;
		width:50rpx;
		height:50rpx;
		right:10rpx;
		top:72rpx;
	}
	.result{
		position:relative;
		font-size:25rpx;
		color:#666;
		margin-bottom:30rpx;
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
	 .header-top{
       border-bottom:2px solid #ff8000;
	   display: flex;
	 }
	.feedback-content{
		position:relative;
		font-size:20px; 
		color:$font-color-base; 
		width: 400rpx;
		white-space: nowrap; 
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.content{
		position:relative;
		font-size:30rpx;
		dispaly:inline-block;
		top:10rpx;
	}
	.time{ 
		position:absolute;
		right:25rpx;
		font-size:25rpx;
		color:#8c8c8c;
	}
	.contact{
		position:relative;
		margin-bottom:30rpx;
	}
	.star{
		position:relative;
		margin-bottom:35rpx;
	}
	.starbox{
		position:relative;
		margin-bottom:-15rpx;
	}

	.v-main{
		background-color: white;
		min-height: 900rpx;
	}
</style>
