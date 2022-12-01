<template>
	<!-- 收藏 -->
	<view class="container">
		<!--header-->
		<view class="tui-header"> 
			<view class="tui-rolling-search">
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="search" :size='13' color='#999'></icon>
				<!-- #endif --> 
				    <view > 
					 <input  type="text"  @input="search"  class="tui-hot-item"  />
				    </view>
			</view>
		</view> 
		 
			<view class="tui-new-box">
				<view class="tui-container">
				<view class="background" v-for="(item,index) in collectionList" :key="index" @tap="detail(item.url)">
					<image  :src="imageUrl + item.image" class="tui-new-img" mode="widthFix"></image>
					<view class="tui-title-box"> 
						<view class="tui-new-title">{{item.title }}</view>
						<view> 
							<view class="tui-number">{{item.content }}</view>
							<view class="tui-new-price">  
								<view class="tui-new-present">{{item.entity_type|entity_type_txt}}</view>
								<view class="collect" @click="collectAct(item.entity_uuid, item.entity_type)"  >
									<image class="shareimg" :src="baseAppUrl + `collected.png`"></image>
									<view class="sharetxt">取消收藏</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			   </view>
			</view> 
		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		<view class="tui-safearea-bottom"></view>
	</view>
</template>
<script>
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import tuiLoadmore from "@/components/gift/loadmore"
	import tuiNomore from "@/components/gift/nomore"
	import {
		ApigetCollections,
		ApiPostCollection
	} from '@/api/collection';
	export default {
		components: { 
			tuiLoadmore,
			tuiNomore,
			MescrollUni,
		},
		data() {
			return {
				baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
				id: '',
				current: 0, 
				collectionList: [],
				imageUrl : this.$mStore.state.BaseImagesUrl,
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				mescroll: null, //mescroll实例对象
				inputValue:'',
				giftid:[],  
				tag:'',
				othertag:false,
				pickerUserIndex:-1,  
				hasLogin: this.$mStore.getters.hasLogin,
			}
		},
		onShow(){
			if(this.hasLogin){
				this.search() 
			}
			else{
				this.$mHelper.backToLogin();
			}
		},
		methods: {
			collectAct(uuid, entity_type){
				//  取消收藏 
				let data = {
					entity_uuid :  uuid,
					entity_type : entity_type 
				} 
				ApiPostCollection(data).then((res)=>{
					if(res.status == 0){
						console.log(res.msg)
						uni.showToast({
						icon:"success",
						title:res.msg
						})
						this.search()
					}
					else{
						uni.showToast({
						icon:"error",
						title:res.msg
						})
					}
				}) 
			},   
			search ( ) { 
				let data = {
					title:this.inputValue,
				}
				ApigetCollections(data).then(({ status, msg }) => { 
					if ( status == 0) {
						console.log( msg)
						if( msg.length == 0){
							 this.collectionList =  []
						}else{
							uni.hideLoading();
							this.collectionList = [...msg];	
						}
					}
				})
			},
			detail(url) { 
				console.log(url)
				this.$mRouter.push({ 
					route:url
				 }); 
			},
		}, 
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			}
		},

	}
</script>

<style lang="scss" scoped>
	page {
		background: #f7f7f7;
	}
    .icon
	{
		position:absolute;
		margin-top:6rpx;
		width: 32.5rpx;
		height: 32.5rpx;
		display: inline-block; 
	}
	.container {
		padding-bottom: 100rpx;
		color: #333;
	} 
	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}  
	.tui-item-active {
		color: #DF5000 !important;
	} 
	.tui-header {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx 0 30rpx;
		box-sizing: border-box;
		background: #DF5000;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		z-index: 999;
	}

	.tui-rolling-search {
		width: 100%;
		height: 60rpx;
		border-radius: 35rpx;
		padding: 0 40rpx 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		color: #999;
	} 
	.tui-hot-item {
		/* line-height: 26rpx; */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width:100%;
	}    
	.tui-new-box {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		border-top:100rpx solid #f7f7f7;
	}
    .tui-container{
		flex: 1;
		margin-right: 10rpx;
		margin-left:15rpx;
	}
	.background {
		width: 100%;
		background: #fff;
		box-sizing: border-box; 
		transition: all 0.15s ease-in-out;
		display: flex; 
		border-bottom: 1px solid #f5f9f7; 
		padding: 15rpx;
	} 
	.tui-title-box {
		display: flex;
		flex-direction: column;
		justify-content: space-between; 
		padding-left:20rpx;
		.tui-new-price{
			padding-top: 18rpx;
			padding-bottom: 18rpx;
			width:450rpx;
			display:flex; 
			flex-direction: row;
			justify-content:space-between;
			.collect{  
				display: flex;
				.shareimg{
					width: 50rpx;
					height: 50rpx; 
				}
				.sharetxt{
					margin-top:10rpx;
				}
			}
		}
	}   
	.title-box{
		position:absolute;
		display:flex;
		right:20rpx;
	}
	.tui-new-title {
		color: #2e2e2e;
		font-size: 26rpx; 
	} 
	.tui-new-present {
		color: #DF5000; 
		font-weight: 500;
		position:relative; 
		margin-top: 10rpx;
	} 
	.tui-number {
		/* padding-top: 5rpx; */
		font-size: 24rpx;
		color: #848689;
	}  
	.tui-new-img {
		display: block;
		width: 215rpx;
		height: 215rpx !important;
		flex-shrink: 0;
		border-radius: 12rpx;
	}   
</style>
