<template>
	<view class="publishmain"  >
		 <input ref="title" placeholder="登记事项标题" maxlength="128" focus="ture" 
		 <!-- #ifdef  MP-WEIXIN --> 
		  @blur="getTitle"
		   <!-- #endif -->
		  v-model="title" class="title"/>
		 <textarea placeholder="详细描述登记事项" class="content" 
		  <!-- #ifdef  MP-WEIXIN -->
		  @blur="getContent"
		  <!-- #endif -->
		 v-model="content"></textarea>
		 <view class="label" ><text class="promote">制表：</text><text class="promote-detail">(在列中长按可删除列)</text></view>
		 <!-- 表格 -->
		 <view class="table" ref="table" > 
			<view class="headers" v-for="(header, index) in headers" :key="header.index" @longpress="deleteItem(index)" >
				<view class="headeritem tbheader">{{header.label}}</view>
				<view class="headeritem tbcontent">- </view>
				<view class="headeritem tbcontent">- </view>
				<view class="headeritem tbcontent">- </view>
				<view class="headeritem tbcontent">- </view>
				<view class="headeritem tbcontent">- </view>
				<view class="headeritem tbcontent">- </view>
			</view>
			<view class="headers" @tap="addColumn"  >
				<view class="headeritem tbheader headeraddnew">点击添加新列+</view>
				<view class="headeritem tbcontent headeraddnew">- </view>
				<view class="headeritem tbcontent headeraddnew">- </view>
				<view class="headeritem tbcontent headeraddnew">- </view>
				<view class="headeritem tbcontent headeraddnew">- </view>
				<view class="headeritem tbcontent headeraddnew">- </view>
				<view class="headeritem tbcontent headeraddnew">- </view>
			</view>
		 </view>
		 <view class="userinfo"><text class="userinfotext">公开用户登记情况：</text>
		 <selectSwitch @change="changeSwitch" :switchList="switchList" :defaultSwitch="defaultShowSwitch" checked_bj_color="#FF8000" /></view>
		 <view class="userinfo"><text class="userinfotext">要求用户先登录？</text>
		 <selectSwitch @change="changeLoginSwitch" :switchList="switchLoginList" :defaultSwitch="defaultLoginSwitch" checked_bj_color="#FF8000" /></view>
		 <view class="userinfo" v-if="isNeedLogin"><text class="userinfotext">允许登录用户重复登记？</text>
		 <selectSwitch @change="changeDuplicateSwitch" :defaultSwitch="defaultDupSwitch" :switchList="switchDuplicateList"  checked_bj_color="#FF8000" /></view>
		 <view class="tips">提示：用户登记后，可导出excel，方便打印</view>
		 <view class="bottom-btn">
			 <button class="draft-btn" @tap="creaeRecord(0)">存草稿<image :src="baseAppUrl+`record/draft-white.png`" /></button>
			 <button class="publish-btn"  @tap="creaeRecord(1)">发布<image :src="baseAppUrl+`record/publish-white.png`"/></button>
			 <button class="remove-btn" v-if="uuid"  @tap="removeRecord()">删除<image :src="baseAppUrl+`record/delete.png`"/></button>
		 </view>
		 
		 <uni-popup ref="popup" type="bottom" > 
			 <view class="popup-holder"> 
			        <image :src="baseAppUrl+`close.png`" class="close" @tap="close" />
				 <!-- #ifdef  APP-PLUS -->
					<input  placeholder="新列名" maxlength="128" focus="ture" v-model="newColumn" class="newname" @confirm="addNewName"> </input>
				 <!-- #endif -->
				 <!-- #ifdef  MP-WEIXIN --> 
						<input ref="newValue"
						  type="text" 
						  class="newname"
						  placeholder="新列名" 
						  maxlength="128" 
						  v-model="newColumn"  
						  @blur="getNewColumn"
					   /> 
				  <!-- #endif -->
				     <button class="btn-add-new" @tap="addNewName">添加<image :src="baseAppUrl+`record/add.png`"/></button>
			 </view> 
		 </uni-popup>
	</view>
</template>

<script>  
	import moment from '@/common/moment';
    import {postRecord, getRecord } from '@/api/record';  
    import selectSwitch from "@/components/xuan-switch/xuan-switch.vue";
	export default {
		components: {  
			selectSwitch
		},
		data() { 
			return {
				defaultDupSwitch:true,
				defaultLoginSwitch:true,
				defaultShowSwitch:true,
				baseurl:this.$mStore.state.BaseUrl,
				baseAppUrl:this.$mStore.state.BaseAppStaticUrl,
				switchList : ['公开','隐藏'],
				switchLoginList : ['否','是'],
				switchDuplicateList:['否', '是'],
				content:"",
				title:"",
				show_userinfo:1,
				newColumn:"",//新列名
				headers: [{
					label: '房号',
					key: 'name'
				} ],  
				hasLogin:false,
				isNeedLogin:0,
				isAllowDuplicateRecord:0,
				uuid:"",
			};
		},
		computed: {
			// 计算倒计时时间
			second() {
				return function (val) {
					return Math.floor(15 * 60 - (new Date() / 1000 - val))
				}
			}
		}, 
		 onLoad(options){
			 if(options.uuid){
				 // 编辑
				 this.uuid = options.uuid
				 this.getDetail(this.uuid)
			 }
			 
			 this.baseUrl = this.$mStore.state.BaseUrl;
			 this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl; 
		 },
		 onReady() {
		 	this.hasLogin = this.$mStore.getters.hasLogin;
			if(!this.hasLogin){
				// 跳转登录
				// #ifdef APP-PLUS
				uni.showModal({
					content: "你暂未登陆，是否跳转登录页面？",
					success: (confirmRes) => {
						if (confirmRes.confirm) {
							this.$mRouter.push({
								route: "/pages/public/logintype",
							});
						}
					},
				});
				// #endif
				// #ifdef MP-WEIXIN
				// 微信小程序，直接登录
				uni.showModal({
					content: "你暂未登陆，是否跳转登录页面？",
					success: (confirmRes) => {
						if (confirmRes.confirm) {
							this.$mRouter.push({
								route: "/pages/public/logintype",
							});
						}
					},
				});
				// #endif
			}
		 },
		methods: {
			changeSwitch(isSwitch){
				// 
				if (isSwitch)
				{
					this.show_userinfo =1;
				}
				else{
					this.show_userinfo =0;
				} 
			}, 
			changeDuplicateSwitch(isSwitch){
				console.log(isSwitch)
				if (isSwitch)
				{
					this.isAllowDuplicateRecord =0;
				}
				else{
					this.isAllowDuplicateRecord =1;
				}  
			}, 
			changeLoginSwitch(isSwitch){
				console.log(isSwitch)
				if (isSwitch)
				{
					this.isNeedLogin =0;
				}
				else{
					this.isNeedLogin =1;
				} 
			},
			getDetail(recorduuid){
				// 获得登记详情 
				let that = this
				getRecord({uuid:recorduuid,owner:1}).then(({status, msg})=>{ 
					if(status == 0 ){  
						console.log(msg)
						that.isNeedLogin = msg.need_login
						
						that.title = msg.title
						that.content = msg.content
						that.date = msg.date
						that.extras = msg.extra
						that.headers = []
						for(let i = 0; i < that.extras.length; i++){
							console.log(that.extras[i])
							that.headers.push({
								label:that.extras[i],
								name: ""
							})
						}
						that.defaultDupSwitch = !msg.duplicate
						that.defaultLoginSwitch = !msg.need_login 
						that.defaultShowSwitch = msg.show_userinfo 
						 
						that.show_userinfo = msg.show_userinfo
						 
						that.users = msg.users
						that.count = msg.users.length
						that.values = new Array(that.extras.length)// 初始化输入值数组  
						
					}
					else{
						uni.showToast({
							title:msg,
							icon:'error',
							duration:2000
						})
					}
					
					that.loading = false
				});
			},
			getTitle(e){
				this.title = e.detail.value;
			},
			getContent(e){
				console.log(e.detail)
				this.content = e.detail.value;
			},
			getNewColumn(e){ 
				console.log(e.detail)
				this.newColumn = e.detail.value;
			},
			addNewName(){ 
				this.headers.push({
					label: this.newColumn,
					key: 'speed'
				})
				this.newColumn = ""
				uni.showToast({
					title:"已添加" ,
					icon:"success",
					duration: 3000
				})
			},
			deleteItem(index){
				// 长按删除列 
                this.$delete(this.headers, index); 
				uni.showToast({
					title:"已删除" ,
					icon:"success",
					duration: 3000
				})
			}, 
			addColumn(e){
				this.$refs.popup.open("top")
				 
			},
			removeRecord(){
				uni.showModal({
					content: '删除？',
					success: (confirmRes) => {
						if (confirmRes.confirm) {
							//
							let data= {
								method:"delete",
								uuids: this.uuid
							}
							postRecord(data).then(({status, msg})=>{
								//
								if(status == 0)
								{
									uni.showToast({
										title:"已删除" ,
										icon:"success",
										duration: 3000
									}) 
									this.$mRouter.push({route: '/pages/record/record?mine=1'});
									return
								}
							});
						}
					}
				});
			},
			creaeRecord(recordstatus){
				// 发布或者草稿 status= 0 草稿；status=1 已发布
				// 验证数据
				if (this.title.trim() == ""){
					uni.showToast({
						title:"请输入标题" ,
						icon:"error",
						duration: 3000
					}) 
					return
				}
				if (this.headers.length == 0){
					uni.showToast({
						title:"请制表" ,
						icon:"error",
						duration: 3000
					}) 
					return
				}
				const data = {
					status:recordstatus,
					title:this.title,
					content:this.content,
					show_userinfo:this.show_userinfo,
					extra: JSON.stringify(this.headers),
					duplicate: this.isAllowDuplicateRecord,
					need_login: this.isNeedLogin
				}
				if(this.uuid != ""){
					data['method'] = 'put'
					data['uuid'] = this.uuid
				}
				console.log(data)
				postRecord(data).then((res)=>{
					if (res.status == 0 ){
						this.$mHelper.toast(res.msg)
						this.$mRouter.push({route: '/pages/record/detail?uuid='+res.uuid});
					}
					else{
						this.$mHelper.toast(res.msg)
					}
				});
			},
			// 跳转页面
			navTo (route) {
				this.$mRouter.push({route});
			} ,
			close(){
				this.$refs.popup.close();
			}
		}
	}
</script>

<style lang="scss">
	
	@import  'table.scss';
	.userinfo{
		margin-top:10rpx;
		display: flex;
	}
	.userinfotext{
		line-height: 80rpx;
		width: 330rpx;
	}
	.headeraddnew{
		color:$base-color;
	}
	.popup-holder{
		display: flex;
		height:  400rpx;
		background-color: $color-white; 
		padding:175rpx;
		width:750rpx;
		position: fixed;
		bottom: 0;
		right :0;
	}
	.close{
		position: absolute;
		top:0rpx;
		right:0rpx;
		height: 60rpx;
		width: 60rpx; 
	}
	.newname{
		border-bottom: 2rpx solid $base-color;
		height: 80rpx;
		width: 200rpx;
		font-size:$font-lg;
	} 
	.btn-add-new{
		height: 80rpx;
		width: 180rpx;
		display: flex;
		border-radius: 20rpx;
		background-color: $base-color;
		color:$color-white;
	}
	.btn-add-new image{
		height: 60rpx;
		width: 60rpx;
		margin-top:10rpx;
		position: absolute;
		right:10rpx;
	}
	
	.label{
		display: flex;
	}
	.promote{
		font-size: $font-lg;
		color:$base-color;
		font-weight: bold;
	}
	.promote-detail, .tips{
		margin-top: 10rpx;
		color:$font-color-light;
	}
	.bottom-btn{
		display: flex; 
		position: fixed;
		text-align: center;
		bottom: 20rpx;
		padding: 20rpx 50rpx;
		justify-content: center;
		width:710rpx; 
	}
	.publish-btn{
	}
	
	.draft-btn, .publish-btn,.remove-btn{
		width: 200rpx;
		display: flex;
		background-color: $base-color;
		color:$color-white;
	}
	.remove-btn{
		background-color: #DF5000;
	}
	.draft-btn image, .publish-btn image, .remove-btn image{
		height: 60rpx;
		width: 60rpx;
		margin-top:10rpx;
		position: absolute;
		right:10rpx;
	}
	.publishmain{
		background-color: $color-white; 
		height: 100vh;
		/* #ifdef APP-PLUS */
		padding: $margin-app-top $spacing-base;
		/* #endif */
        /* #ifdef MP-WEIXIN */
		padding: 0 $spacing-base;
		/* #endif */
	}
	.title{
		width: 710rpx;
		border-bottom: 1rpx solid $border-color-base;
		font-size:$font-lg;
		margin-bottom: 10rpx;
		margin-top:10rpx;
	}
	.content{
		width: 710rpx;
		border-bottom: 1rpx solid $border-color-base;
	} 
</style>
