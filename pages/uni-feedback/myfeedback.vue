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
		<swiper class="rankcontainer" :style="{height:screenHeight+'rpx'}" @change="swiperChange" :current="swipercurrent">
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<view class="feedback-box" v-for="(item,index) in allList" :key="index" v-if="allfeedback" >
						<view class="middle"> 
						  <view class="header" @tap="detail(item.id)">
						 <view class="feedback-content"  >{{item.content}}</view>
                         <view class="time">{{item.date|time}}</view>
						  </view>
						  <view class="feedbackstatus">{{ item.status | feedbackformat }}</view>
						  <image class="delete-image"  :src="baseAppUrl+`shanchu.png`" @tap="deletefeedback(index,item.id)"></image>
						 <view v-if="item.score!==''"  class="star"   >
							<uni-rate  :size="18" :value="item.score" />
						 </view>
						<view  class="contact" @tap="detail(item.id)">{{item.contact}}</view>
						</view> 
						<view v-if="item.result!==null" class="result" @tap="detail(item.id)">处理结果：{{item.result}}</view>
						<view class="picturebox" >
						   <view   v-if="item.images.length !== 0" v-for="(it,ind) in item.images" :key="ind">
								<image :src="imgurl+it.filepath" class="picture" mode="aspectFill" @tap="previewImage(index,ind)"/>
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
				</scroll-view>
			</swiper-item>
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<!--新建-->
					<view class="feedback-box" v-for="(item,index) in allList" :key="index" v-if="newfeedback" >
						<view class="middle"> 
						  <view class="header" @tap="detail(item.id)">
						 <view class="feedback-content"  >{{item.content}}</view>
					     <view class="time">{{item.date|time}}</view>
						  </view>
						  <view class="feedbackstatus">{{ item.status | feedbackformat }}</view>
						  <image class="delete-image"  :src="baseAppUrl+`shanchu.png`" @tap="deletefeedback(index,item.id)"></image>
						 <view v-if="item.score!==''"  class="star"    >
							<uni-rate  :size="18" :value="item.score" />
						 </view>
						<view  class="contact" @tap="detail(item.id)">{{item.contact}}</view>
						</view> 
						<view v-if="item.result!==null" class="result" @tap="detail(item.id)">处理结果：{{item.result}}</view>
						<view class="picturebox" >
						   <view   v-if="item.images.length !== 0" v-for="(it,ind) in item.images" :key="ind">
								<image :src="imgurl+it.filepath" class="picture" mode="aspectFill" @tap="previewImage(index,ind)"/>
						   </view>
						</view>
					</view> 
					<view v-if="empty" class="emptycontainer">
						<image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
						<view class="empty-text">暂无相关数据</view>
					</view>
					<view  v-if="more" class="getmore"  @tap="getmorefeedback">加载更多...</view>
					<!--加载loadding-->
					<tui-loadmore :visible="loadding" :index="2" ></tui-loadmore>
					<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
				</scroll-view>
			</swiper-item>
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<!--未采纳-->
					<view class="feedback-box" v-for="(item,index) in allList" :key="index" v-if="noagreefeedback" >
						<view class="middle"> 
						  <view class="header" @tap="detail(item.id)">
						 <view class="feedback-content"  >{{item.content}}</view>
					     <view class="time">{{item.date|time}}</view>
						  </view>
						  <view class="feedbackstatus">{{ item.status | feedbackformat }}</view>
						  <image class="delete-image"  :src="baseAppUrl+`shanchu.png`" @tap="deletefeedback(index,item.id)"></image>
						 <view v-if="item.score!==''"  class="star"    >
							<uni-rate  :size="18" :value="item.score" />
						 </view>
						<view  class="contact" @tap="detail(item.id)">{{item.contact}}</view>
						</view> 
						<view v-if="item.result!==null" class="result" @tap="detail(item.id)">处理结果：{{item.result}}</view>
						<view class="picturebox" >
						   <view   v-if="item.images.length !== 0" v-for="(it,ind) in item.images" :key="ind">
								<image :src="imgurl+it.filepath" class="picture" mode="aspectFill" @tap="previewImage(index,ind)"/>
						   </view>
						</view>
					</view> 
					<view v-if="empty" class="emptycontainer">
						<image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
						<view class="empty-text">暂无相关数据</view>
					</view>
					<view  v-if="more" class="getmore"  @tap="getmorefeedback">加载更多...</view>
					<!--加载loadding-->
					<tui-loadmore :visible="loadding" :index="2" ></tui-loadmore>
					<tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
				</scroll-view>
			</swiper-item>
			<swiper-item class="ranklist">
				<scroll-view class="listview" scroll-y>
					<!--采纳-->
					<view class="feedback-box" v-for="(item,index) in allList" :key="index" v-if="agreefeedback" >
						<view class="middle"> 
						  <view class="header" @tap="detail(item.id)">
						 <view class="feedback-content"  >{{item.content}}</view>
					     <view class="time">{{item.date|time}}</view>
						  </view>
						  <view class="feedbackstatus">{{ item.status | feedbackformat }}</view>
						  <image class="delete-image"  :src="baseAppUrl+`shanchu.png`" @tap="deletefeedback(index,item.id)"></image>
						 <view v-if="item.score!==''"  class="star"    >
							<uni-rate  :size="18" :value="item.score" />
						 </view>
						<view  class="contact" @tap="detail(item.id)">{{item.contact}}</view>
						</view> 
						<view v-if="item.result!==null" class="result" @tap="detail(item.id)">处理结果：{{item.result}}</view>
						<view class="picturebox"  >
						   <view   v-if="item.images.length !== 0" v-for="(it,ind) in item.images" :key="ind">
								<image :src="imgurl+it.filepath" class="picture" mode="aspectFill" @tap="previewImage(index,ind)"/>
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
				</scroll-view>
			</swiper-item> 
		 </swiper>
		 <!-- 底部按钮 --> 
		 <uni-fab 
		   :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			@trigger="trigger" ></uni-fab>
	</view>
</template>

<script> 
	import tuiLoadmore from "@/components/gift/loadmore"
	import tuiNomore from "@/components/gift/nomore"
	import {ApiLookFeedback,ApiDeleteFeedback} from '@/api/feedback.js'
	export default {
		components: {
			tuiLoadmore,
			tuiNomore,
		},
		data() {
			return {
				horizontal: 'left',
				vertical: 'bottom',
				direction: 'horizontal',
				content: [{
					iconPath: '/static/record/publish-grey.png',
					selectedIconPath: '/static/record/publish.png',
					text: '提交反馈',
					active: true
				} ],
				tabIndex: 0,
				tabList: [{
					name: '全部'
				}, {
					name: '已提交'
				}, {
					name: '未采纳'
				}, {
					name: '采纳'
				}],
				screenHeight: 0,
				swipercurrent: 0,
				empty: false,
				more:false,
				nomore:false,
				loadding:false,
				allfeedback: true,
				newfeedback: false,
				noagreefeedback: false,
				agreefeedback: false,
				status: '',
				feedbackpage:1,
				pagenum:5,
				allList:[],
				oldList:[],
				imgurl:'',
				Image:[],
				baseurl: this.$mStore.state.BaseUrl,
                baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					iconColor: '#fff', 
					selectedColor: '#FF8000', 
				},
			}
		},
		onLoad() {
			this.imgurl = this.$mStore.state.BaseUrl + '/images/'; 
			this.getList();
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					that.screenHeight = res.screenHeight + 450
				}
			});
		},
		methods: {
			trigger(e){ 
				let route = '/pages/uni-feedback/uni-feedback'
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
				if (this.tabIndex == 0) {
					console.log("加载全部")
					this.allfeedback = true;
					this.newfeedback = false;
					this.noagreefeedback = false;
					this.agreefeedback = false;
				} else if (this.tabIndex == 1) {
					console.log("加载新建")
					this.status = '0';
					this.allfeedback = false;
					this.newfeedback = true;
					this.noagreefeedback = false;
					this.agreefeedback = false;
				} else if (this.tabIndex == 2) {
					console.log("加载未采纳")
					this.status = '2';
					this.allfeedback = false;
					this.newfeedback = false;
					this.noagreefeedback = true;
					this.agreefeedback = false;
				} else {
					console.log("加载采纳")
					this.status = '1';
					this.allfeedback = false;
					this.newfeedback = false;
					this.noagreefeedback = false;
					this.agreefeedback = true;
				}
				this.swipercurrent = current;
				this.getList();
			},
			getList() {
				if (this.tabIndex == 0) {
					this.status = ''
				} else if (this.tabIndex == 1) {
					this.status = '0'
				} else if (this.tabIndex == 2) {
					this.status = '2'
				} else {
					this.status = '1'
				}

				if(this.status == ''){
					this.nomore = false;
					this.more = false;
					this.feedbackpage = 1;
					let param = {
						page:this.feedbackpage,
						pagenum:this.pagenum,
						tag:0
					}
					ApiLookFeedback(param).then((data) => { 
						if (data.status == 0) { 
							this.allList = [...data.msg];
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
				}else{
					this.nomore = false;
					this.more = false;
					this.feedbackpage = 1;
					let param = {
						page:this.feedbackpage,
						pagenum:this.pagenum,
						tag:0,
						status:this.status
					}
					ApiLookFeedback(param).then((data) => {
						if (data.status == 0) {
							this.allList = [...data.msg];
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
				}
			},
			getmorefeedback(){
				this.loadding = true;
				this.feedbackpage = this.feedbackpage + 1;
				if (this.status == '') {
					let param = {
						page:this.feedbackpage,
						pagenum:this.pagenum,
						tag:0
					}
					ApiLookFeedback(param).then((data) => {
						if (data.status == 0) {
							this.loadding = false;
							this.oldList = [...data.msg];
							if(this.oldList.length < this.pagenum){
								this.nomore = true;
								this.more = false;
							}else{
								this.more = true;
							}
							this.allList  = this.allList.concat([...data.msg]); 
						}
					})
				}else{
					let param = {
						page:this.feedbackpage,
						pagenum:this.pagenum,
						tag:0,
						status:this.status
					}
					ApiLookFeedback(param).then(({
						data
					}) => {
						if (data.status == 0) {
							this.loadding = false;
							this.oldList = [...data.msg];
							if(this.oldList.length < this.pagenum){
								this.nomore = true;
								this.more = false;
							}else{
								this.more = true;
							}
							this.allList  = this.allList.concat([...data.msg]); 
						}
					})
				}
			},
			deletefeedback(index,id){
				var that = this;
				uni.showModal({
					title: '',
					content: '您好，确定要删除该意见吗？',
					confirmText: '删除',
					confirmColor: '#FD5000',
					success: function(res) {
						if (res.confirm) {
							const data = {
								method: 'delete',
								ids: id
							}
							ApiDeleteFeedback(data).then((res) => {
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
					url: '../uni-feedback/feedbackdetail?id=' + id 
				})
			},
			//点击查看图片大图
			previewImage: function(index,e) {
				this.Image = [];
				let image = this.imgurl + this.allList[index].images[e].filepath;
				this.Image.push(image)
				uni.previewImage({
					current: this.Image[0],
					urls: this.Image,
				})
			},
		}
	}
</script>

<style scoped>
    .v-main{
		background-color: white;
		min-height: 900rpx;
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
		width: 25%;
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
	   border-bottom: 1px solid #f5f9f7;
	   position:relative;
	   padding:30rpx;
	}
	.feedbox{
		border-bottom: 1px solid #f5f9f7;
		position:relative;
		padding:50rpx 30rpx;
	}
	.picturebox{
		position:relative;
		display:flex;
		margin-top:10rpx;
	}
	.picture{
		position:relative;
		width:180rpx;
		height:180rpx;
		margin-bottom:10rpx;
		margin-right:20rpx;
	}
	.middle{
		position:relative;
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
 
	.feedback-content{
		position:relative;
		font-size:30rpx;
		dispaly:inline-block;
		margin-bottom:40rpx;
		max-width: 300rpx;
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
</style>
