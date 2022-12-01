<template>
	<!-- 我的首页 -->
	<view id="MyAccount">
		<view class="wall">
			<view class="header">
				<view class="milage">
					账户余额
				</view>
				<view class="header-level2">
					<view class="top-left">
						<view class="total">
							<view class="number">{{left | number}}</view>
							<view class="kilometers">￥</view>
						</view>
					</view>
					<view class="top-right">
						<view class="showrank"> 
							<view class="name">支出</view> 
							<view v-if="hasLogin" class="num">{{expend}}</view>
							<view v-else class="num">--</view>
						</view>
						<view class="look" @tap="target('/pages/collection/list')">
							<view v-if="hasLogin" class="num"><span>{{collectCount}}</span></view>
							<view v-else class="num">--</view>
							<view class="lookrank">
								<view class="collectex">我的收藏</view>
								<image class="shareimg" :src="baseAppUrl + `collected.png`"></image>
							</view>
						</view>
					</view>
				</view>
			</view> 
			
			<view class="wall-top">
				<image v-if="hasLogin" class="img" :src="thumbnail_portait" @tap="previewImage()"></image>
				<image v-else class="img" :src="baseAppUrl+`icons/zhuce.png`" @tap="previewnologinImage()"></image>
				<view class="top">
					<view class="information">
						<view v-if="sex == '女'">
							<image :src="baseAppUrl+`icons/women.png`"></image>
						</view>
						<view v-else>
							<image :src="baseAppUrl+`icons/men.png`"></image>
						</view>
						<template v-if="hasLogin">
							<view class="username" >
								<span>{{UserInfo.username||UserInfo.phone}}</span>
							</view>
							<!-- #ifdef MP-WEIXIN -->
							<text class="rolename" @click="getUserProfile" v-if="UserInfo.username == ''|| UserInfo.username == null"  >
							  获取头像
							</text>
							<!-- #endif -->
						</template>
						<navigator class="username" v-else url="/pages/public/logintype">登录 / 注册</navigator>
					</view>
					<view class="position">
						<image  :src="baseAppUrl+`icons/dingwei2.png`"></image>
						<view class="address">
							<view class="communityname"  >
								{{currentcrt.communityname}}
							</view>
							<text class="rolename" v-if="currentcrt.role" >
							  我是{{currentcrt.role}}
							</text> 
							<text class="rolename" v-else  >
							  未认证
							</text> 
						</view>
					</view> 
				</view>
				<view class="scan" @tap="scan">
					<image class="icon" :src="baseAppUrl+`saoyisao2.png`"></image>
					<view class="scantxt">扫一扫</view>
				</view>
			</view>
		</view>
		<!-- 分类列表 -->
			<view class="fct-center" v-if="is_staff == 1"> 
			  <view 
				v-for="(item, index) of commenUseList"
				:key="index"
				class="common-function__item"
				@tap="target(item.url, true, item.id)"
			  >  
			   <view class="item"> 
				   <uni-badge class="uni-badge-left-margin" 
				   type="error" :text="item.value" 
				   absolute="rightTop" size="small">
		           </uni-badge>
					<image 
					class="common-function__img"
					:src="baseAppUrl+`${item.src}.png`"
					/>  
					<view class="fct-content">{{ item.name }}</view> 
				</view> 
			  </view> 
			  <view class="title">物业工作台</view>
		</view>
		<view class="content">
			<view class="section" @tap="target('/pages/user/notice/notice')">
				<view>
					<image class="icon" :src="baseAppUrl+`xiaoxibk.png`"></image>
				</view>
				<text class="sectiontxt">消息中心</text> 
				<view  class="sectionnumber ">
					<view   class="leftmoney">
						<div class="backlog" v-if="unreadcount>0">{{unreadcount}}条未读</div>
					</view>
					<uniIcon type="arrowright"></uniIcon>
				</view> 
			</view>  
			<view class="section" @tap="target('/pages/user/incomes')">
				<view>
					<image class="icon" :src="baseAppUrl+`qianbao.png`"></image>
				</view>
				<text class="sectiontxt">我的收支</text>
				<view  class="sectionnumber ">
					<view v-if="hasLogin && left>0" class="leftmoney">账户余额:<text class="money">{{left}}</text>￥</view>
					<uniIcon type="arrowright"></uniIcon>
				</view> 
			</view>
			<!--
			<view class="section" @tap="target('/pages/user/giftcenter/giftcenter')">
				<view>
					<image class="icon" :src="baseAppUrl+`lipin.png`"></image> 
				</view>
				<text class="sectiontxt">积分好礼</text>
				<view  class="sectionnumber ">
					<view   class="leftmoney">
						<div class="backlog" v-if="newtag">新品上架</div></view>
					<uniIcon type="arrowright"></uniIcon>
				</view>  
			</view> -->
			<view class="section" @tap="target('/pages/user/currency/currencyRecord')">
				<view>
					<image class="icon" :src="baseAppUrl+`jifen.png`"></image> 
				</view>
				<text class="sectiontxt">积分明细</text>
				<view  class="sectionnumber "> 
					<uniIcon type="arrowright"></uniIcon>
				</view>  
			</view>
			<view class="section" @tap="target('/pages/record/myrecord')">
				<view>
					<image class="icon" :src="baseAppUrl+`excel1.png`"></image>
					
				</view>
				<text class="sectiontxt">我的登记薄</text>
				<view class="sectionnumber"> 
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>
		    <view class="section" @tap="target('/pages/backlog/list')">
				<view>
					<image class="icon" :src="baseAppUrl+`daiban1.png`"></image> 
				</view>
				<text class="sectiontxt">待办事项</text>
				<view  class="sectionnumber ">
					<view   class="leftmoney">
						<div class="backlog" v-if="unfinished_count>0">{{unfinished_count}}项待办</div></view>
					<uniIcon type="arrowright"></uniIcon>
				</view> 
			</view>
			<view class="section" @tap="target('/pages/repair/list')">
				<view>
					<image class="icon" :src="baseAppUrl+`wujin.png`"></image> 
				</view>
				<text class="sectiontxt">我的报修</text>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>
			<view class="section" @tap="target('/pages/exchanges/mylist')">
				<view>
					<image class="icon" :src="baseAppUrl+`exchanges1.png`"></image> 
				</view>
				<text class="sectiontxt">闲置租售</text>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>  
			<view class="section2" @tap="target('/pages/user/properties')">
				<view>
					<image class="icon" :src="baseAppUrl+`icons/fangwu1.png`"></image>
					 
				</view>
				<text class="sectiontxt">我的房产</text>
				<view>
					<view v-if="likecount" class="unreadnum">{{unlikecount}}</view>
				</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>
			<view class="section" @tap="target('/pages/user/crt')">
				<view>
					<image class="icon" :src="baseAppUrl+`renzheng.png`"></image> 
				</view>
				<text class="sectiontxt">我的认证</text> 
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>
			<view class="section" @tap="target('/pages/user/communities')">
				<view>
					<image class="icon" :src="baseAppUrl+`guanzhu.png`"></image>
				</view>
				<text class="sectiontxt">我的关注</text>
				<view  class="sectionnumber "> 
					<uniIcon type="arrowright"></uniIcon>
				</view> 
			</view>
			<view class="section" @tap="target('/pages/user/settings',true)">
				<view>
					<image class="icon" :src="baseAppUrl+`icons/setting.png`"></image>
					 
				</view>
				<text class="sectiontxt">设置</text>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>

			<view class="section2" @tap="target('/pages/uni-feedback/myfeedback', false)">
				<view>
					<image class="icon" :src="baseAppUrl+`icons/fankui.png`"></image> 
				</view>
				<text class="sectiontxt">意见反馈</text>
				<view>
					<view v-if="feedcount" class="unreadnum">{{unfeedcount}}</view>
				</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>

			<view class="section" @tap="target('/pages/user/potocol', false)">
				<view>
					<image class="icon" :src="baseAppUrl+`icons/yinsi1.png`"></image> 
				</view>
				<text class="sectiontxt">平台协议</text>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view>
		 
			 
		</view>

		<view class="foot">
			版本:{{versionName}} 
		</view>
		<view class="foot company"> 
			Copyright©2019-2022 西安字节音图电子科技有限公司 
		</view>  
		 <Contact    >   </Contact>
	</view>
</template>
<script> 
import Vue from 'vue'
	import {getNotices } from "@/api/notice";
	import { getCrtApi } from "@/api/crt";
	import { getRole } from "@/api/role";
	import { getIncomesApi } from "@/api/incomes";
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import {
		memberInfo,memberUpdate
	} from '@/api/userInfo'; 
	import {
		ApigetCollections 
	} from '@/api/collection';
	import Contact from "@/components/contact"
	import {ApiStatCount} from "@/api/statistic";
	export default {
		components: {
			uniIcon,
			Contact
		},
		data() {
			return {
				is_staff:0,// 是否是物业工作人员
				commenUseList: [ 
				  {
				    name: "报修结单",
				    id: 29,
				    src: "wujin",
				    url:"/pages/repair/managelist",
					value:0
				  },
				  {
				    name: "发通知公告",
				    id: 27,
				    src: "baishitong",
				    url:"/pages/notice/mynotice",
					value:0
				  }, 
				  {
				    name: "有偿服务结单",
				    id: 40,
				    src: "jiedan",
				    url:"/pages/paidservice/managelist",
					value:0
				  },
				  {
				    name: "物业消息",
				    id: 41,
				    src: "xiaoxibk",
				    url:"/pages/user/notice/managelist",
					value:0
				  }  
				],
				left:0,
				income:0,
				expend:0,
				recordcount:0,//登记薄统计
				baseImagesUrl : this.$mStore.state.BaseImagesUrl,
				baseAppUrl : this.$mStore.state.BaseAppStaticUrl,
				versionName: "1.0.0",
				versionCode: "1.0.1",
				thumbnail_portait: '', 
				username: '', 
				location: {},
				address: {}, 
				type: '',
				updated:false,
				speed: '',
				sex: '',   
				id: '', 
				longitude: '',
				latitude: '',
				record: [], 
				count: 0,
				add: 0,
				money: 0,
				coin: 0,
				index: '',   
				Image: [], 
				unreadcount: 0, 
				feedcount: false,
				unfeedcount: 0,
				unfinished_count:0,
				likecount: false,
				unlikecount: 0,
				newtag: false, 
				communityuuid:"",
				communityname:"",
				collectCount:0,
				currentcrt:{
						"uuid": "--",
						"communityname": "--",
						"role": ""
					}
			};
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.userInfo
			},
			hasLogin() {
				return this.$mStore.getters.hasLogin;
			},
			randomNumber() {
				return Math.floor(Math.random() * (10000 - 10 + 1) + 10)
			}
		}, 
		methods: {
			getCollectionCount(){ 
				let params = {
					count : 1, 
				}
				ApigetCollections(params).then((res)=>{
					if (res.status == 0){ 
						this.collectCount = res.msg 
					} 
				})
			}, 
			scan(){
				let _this = this
				// 扫一扫 https://uniapp.dcloud.io/api/system/barcode?id=scancode
				uni.scanCode({
				    success: function (res) {
				        console.log('条码类型：' + res.scanType);
						let qrresult = res.result.split("/")
						let length = qrresult.length
					 
						if (length > 2){
							 // 长度大于2的时候，数据才可能符合我们的要求
							 let uuid = qrresult[length-1]
							 let appname = qrresult[length-2]
							 console.log(uuid)
							 console.log(appname)
							 if (appname == "records"){
								 // 登记薄
								 _this.$mRouter.push({
									 route:"/pages/record/detail?way=scan&uuid="+uuid
								 })
							 }
						}
						else{
							uni.showToast({
								icon:'error',
								title:"不支持的二维码"
							})
						}
				        console.log('条码内容：' + res.result.split("/"));
				    }
				});
			},
			getMsgCount(){
				// 统计“我的”页面角标数字
				ApiStatCount().then((res)=>{
					let total = 0
						total += res.msg.unread_notice_count
						total += res.msg.unfinished_count
						total += res.msg.repaircount
						total += res.msg.paidservicecount
						total += res.msg.unreadcount 
					this.unreadcount = res.msg.unread_notice_count 
					this.unfinished_count = res.msg.unfinished_count
					let item = this.commenUseList[0]
					item.value = res.msg.repaircount
					Vue.set(this.commenUseList, 0, item)
				
				    item = this.commenUseList[2]
					item.value = res.msg.paidservicecount
					Vue.set(this.commenUseList, 2, item)

					item = this.commenUseList[3]
					item.value = res.msg.unreadcount
					Vue.set(this.commenUseList,3, item)

					if (total > 0)
					{
						uni.setTabBarBadge({
						    index:4,
						    text:total + ''
						}) 
					}
					else{
						uni.removeTabBarBadge(
							{
								index:4
							}
						)
					}
					if (this.unreadMsgCount > 0)
					{
						uni.setTabBarBadge({
							index: 0,
							text: res.msg.unread_notice_count+''
						}) 
					}
					else{
						uni.removeTabBarBadge({
							index:0, 
						}) 
					}  
				}) 
			}, 
			//点击查看头像大图
			previewImage: function() { 
				uni.previewImage({
					current: this.thumbnail_portait,
					urls: [this.thumbnail_portait],
				}) 
			},
			getCurrentCrt(){
				// 获取当前小区的业主认证信息
				let params = {
					communityuuid: this.communityuuid,
				} 

				getCrtApi(params).then((res)=>{ 
					if(res.status == 0){
						//
						if(res.msg.length == 0){
							//没有任何认证信息f
							this.currentcrt={
								uuid: "--",
								communityname: this.communityname,
								role: ""
							} 
						}
						else {
							this.currentcrt = res.msg[0] // 取第一个认证信息
							this.currentcrt={
								uuid: res.msg[0][0],
								communityname: res.msg[0][1],
								role: res.msg[0][2]
							} 
						} 
					}
					else{
						console.log(res)
					}
				})
			},
			async getIncomes(){
				await getIncomesApi().then(res=>{
					if (res.status == 0){
						this.income = res.msg.income_total
						this.expend = res.msg.expend_total
						this.left = res.msg.left 
					}
				}) 
			},
			 updateCid(){
				//更新客户端cid 
				// #ifdef APP-PLUS
				let _this = this 
				plus.push.getClientInfoAsync((info) => {
					let cid = info.clientid; 
				    _this.$http.post(`${memberUpdate}?uuid=${_this.UserInfo.uuid}`, {
						cid:cid, 
						uuid:_this.UserInfo.uuid,
						method : "put"
					}).then((r) =>{ 
					}).catch((r) => {
						console.log(r) 
					});
					}, err => {
						console.log(err)
				});
				// #endif 
			},
			getUserProfile(){
				let _this = this
                uni.getUserProfile({
					desc:"Wexin",
					success: function(infoRes) {  
						_this.$http.post(`${memberUpdate}?uuid=${_this.UserInfo.uuid}`, {
						wxusername:infoRes.userInfo.nickName, 
						wximage:infoRes.userInfo.avatarUrl, 
						method : "put"
					}).then((r) =>{   
						if (_this.UserInfo.username == "" || _this.UserInfo.username == null ){
							_this.UserInfo.username = infoRes.userInfo.nickName 
						} 
						_this.thumbnail_portait = infoRes.userInfo.avatarUrl
					}).catch((r) => {
						console.log(r) 
					});
					},fail:(res)=>{    
						console.log(res)  
					} 
				})
			},
			// 获取用户信息
			async getMemberInfo () {
				let _that = this
				await this.$http.get(memberInfo).then(r => {   
					if(r.msg.thumbnail_portait == null ||  r.msg.thumbnail_portait == ""){
						this.thumbnail_portait =  this.baseAppUrl+"icons/zhuce.png"; 
					}
					else{
						_that.thumbnail_portait = _that.baseImagesUrl+r.msg.thumbnail_portait;  
					} 
				}).catch(() => { 
				})
                // 获取用户角色：看是不是物业工作人员
				let params = {
					communityuuid: this.communityuuid,
					minerole:true,
				}  
				await getRole(params).then((res)=>{  
					if(res.status == 0){
					   _that.is_staff = res.is_staff	 
					}
					else{
						console.log(res)
					}
				})

			},
		  target(route, needLogin=true, id=-1) { 
              // #ifdef MP-WEIXIN
			  if (id == 29){
				   
					// 新报修请求通知 
					wx.requestSubscribeMessage(
						{
							tmplIds:['wIuRwDGKPBIY3mHZS1-8ICLNxeYqLkdaGLh4pfpMxVs'],
							success (res) { 
								console.log(res)
							}, 
							fail(error){
								console.log(error)
							}
						}
					)
					
			  }
			  else if(id == 40){
				  // 订阅有偿服务请求
				  wx.requestSubscribeMessage({
					  tmplIds:['Wclc73WuMP1M1zrcTF1RghocES6XY6pyzdYYMJK0W1A']
				  }) 
			  }
			  else if(id == 41){
				  // 新消息订阅
				  wx.requestSubscribeMessage({
					  tmplIds:['u01rJ4c5zbGZCwQOrNWJmWaVkn27nZiwv-zB-atEmX0']
				  }) 
			  }
			  // #endif
			  if (needLogin){
				  if (this.hasLogin) {
				  	this.$mRouter.push({route});
				  } else {
				  	//为了将来返回页面
				  	this.$mHelper.backToLogin(true)
				  }
			  }
			  else{
				  // 不需要login
				  this.$mRouter.push({route});
			  }
				
			},
		}, 
		onLoad(options) {    
			if(options.updated){ 
				// 头像更新之后在此处重新获取头像
				this.updated = true
			} 
			if (this.hasLogin){
				this.getMemberInfo() 
				this.getIncomes() 
				this.updateCid()
			} 
		},
		onShow: function() {
			this.communityuuid = uni.getStorageSync("communityuuid") 
			this.communityname = uni.getStorageSync("communityname")  
			if (this.communityuuid){
				this.currentcrt.communityname = this.communityname
				if (this.hasLogin){
					this.getCurrentCrt() 
				} 
			} 
			if(this.updated){
				if (this.hasLogin){
					this.getMemberInfo()
					this.updated = false
				}
			} 
			if(this.hasLogin){ 
				this.getMsgCount()
				this.getCollectionCount()
			}
		} 
	};
</script>
<style lang="scss" src="./user.scss" scoped>
</style>
