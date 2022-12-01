<template>
	<view class="publishmain"  >
		<qrcode-poster ref="poster"   
		        :headerImg="goods.image"
		         ></qrcode-poster>
		 <view class="recordtitle" > {{title}} </view>
         <view>
			 <text class="date">{{date | time}}   {{username}}</text>
			 <!-- #ifdef  APP-PLUS -->
				<image
					class="shareimg shareimg-top"
					@click="uniShare"
					:src="baseAppUrl + `share1.png`"
				></image>
				<!-- #endif    -->
		 </view>
		 <view class="content">
			  <text    >{{content}}</text>
		  </view>
		 <view class="recordtags">
			 <view class="tag show_userinfo" v-if="show_userinfo == 0">隐藏登记人信息</view>
			 <view class="tag limits" v-if="limits > 0">限制登记人数{{limits}}</view>
			 <view class="tag needLogin" v-if="needLogin">登记需要先登录</view>
		 </view>
		 <view class="label" >
			 <view class="promote-detail" v-if="show_userinfo == 1 || owner == true">已登记({{count}})人</view>
			 <view class="promote-detail" v-if="show_userinfo == 0 && owner == false">发起人已隐藏登记情况</view>
			 <checkbox-group @change="checkboxOnlyMine" class="properties" >
						<label  >
						<checkbox
							value="1"
							color="#FF8000" 
							style="transform: scale(0.7)"
						/>显示我的登记
						</label> 
	        </checkbox-group>
			<view class="userinfo" v-if="show_userinfo == 1 || owner == true">
			   <view class="userinfotext">登记通知</view>
			   <selectSwitch
				@change="changeSwitch"
				:defaultSwitch="defaultSwitch"
				:switchList="switchList"
				checked_bj_color="#FF8000"
			/></view>
	     </view>
		 <!-- 表格 -->
		 <view class="table" ref="table" > 
			<view class="headers" v-for="(extra, index) in extras" :key="index"   >
				<view class="headeritem tbheader">{{extra.label}}</view>
				<view class="headeritem tbcontent" v-for="(user, userindex) in users" :key="user.uuid" >
					<view v-if="onlyShowMine  && index == 0 && status !=2 && allow_delete == 1 " 
					@tap="deleteMine(user.uuid)" class="deleteMine">删除行 </view>
					<view v-if="onlyShowMine  && index == 0 && status !=2 && allow_modify == 1 " 
					@tap="modifyMine(user.uuid, user, userindex)" class="deleteMine">修改 </view>
					<view v-else>
						<text v-if="  index < user.values.length"> {{user.values[index]}}</text>
					</view> 
				 </view>
			</view>  
			<view class="headers"  v-if="owner" >
				<view class="headeritem tbheader tbactions">操作</view>
				<view class="headeritem tbcontent" v-for="(user, userindex) in users" :key="user.uuid" >
					<view  	@tap="deleteMine(user.uuid)" class="deleteMine">删除 </view> 
				</view>
			</view> 
		</view> 
		<view class="bottom-btn">
			<button class="draft-btn" 
			:disabled="status==2 || (count >= limits && limits > 0)" @tap="tablePopup()">{{btnname}} </button> 
		</view> 
		<view class="bottom-holder">
		  <view class="goview" @tap="download" v-if="owner || (only_owner_export==0 && show_userinfo == 1) ">
		 	<image class="excel" :src="baseAppUrl+`excel1.png`"></image>
		 	<view><text class="gorecord">导出xls</text></view>
		 </view>
		 <view class="goview"  v-else >
		 	<image class="excel" :src="baseAppUrl+`excelhui.png`"></image>
		 	<view><text class="gorecord">无权限导出</text></view>
		 </view>
		 <view class="erweima" @tap="sharePoster">
		 	<image class="excel" :src="baseAppUrl+`erweima.png`"></image>
		 	<view><text class="gorecord">扫码登记</text></view>
		 </view>
		</view>
		 <view class="tips">
			<view class="title">
				<image :src="baseAppUrl + 'tishi.png'" class="tishi" />
				<text>温馨提示:</text>
			</view>
			<view class="appraisetxt">1、用户登记后，可导出为excel</view>
			<view class="appraisetxt"
				>2、如果预测登记量很大时，建议隐藏登记情况，否则登记页面加载可能出现卡顿现象，可通过excel导出登记结果。</view
			>
			<view class="appraisetxt"
				>3、请注意保护用户隐私，公开用户登记时，有泄露用户隐私的可能。</view
			>
			<view class="appraisetxt" 
				>4、自增列只有在导出excel或者结束登记时，才会进行排序</view
			>
			</view>
		<s-popup custom-class="popupColumns" ref="popup" type="top">
		<view class="popup-holder"> 
			<image :src="baseAppUrl+`close.png`" class="close" @tap="close" />
			<view class="v-title">
				<text class="pop-title">{{title}}</text>
			</view>
			<view class="requiredtips">带红色星号*为必填项，自增列仅在导出数据时或结束登记时按照登记时间进行编号</view>
			<view class="fill" v-for="(extra, index) in extras" :key="index"   >
				<label class="fileitemname   ">
						<text class="red" v-if="extra.required == 1 && extra.action[1]!='autoincrease'">*</text>
					{{extra.label}}
				</label>
				<input  ref="excelvalue"  
				@focus="InputFocus($event, index)"
				@blur="blur(extra.value)"
				v-model="extra.value" 
				:type="extra.type=='string'?'text':'digit'" 
				:disabled="extra.action[1]=='autoincrease'?true:false"
				:class="extra.action[1]=='autoincrease'?'fileitemvalue-disabled fileitemvalue':'fileitemvalue' "  
				:value="extra.value"/>  
			</view>  
			<button class="btn-add-new" @tap="fillup">确定</button>
			<view class="tags">
				<view class="tagstitle">快速登记:</view>
				<view class="tagmain"> 
					<view @tap="fastAdded(item.label)" class="tag" v-for="(item, index) in tags" :key="index">
						<text  >{{item.label}}</text>
					</view> 
				</view>
			</view>
			<view class="tags" v-if="usedwords.length > 0">
				<view class="tagstitle">最近使用:</view>
				<view class="tagmain"> 
					<view @tap="fastAdded(item.label)" class="tag" v-for="(item, index) in usedwords" :key="index">
						<text   >{{item.label}} | {{item.usedtimes}}</text>
					</view> 
				</view>
			</view>
		</view> 
		</s-popup>   
	</view>
</template>

<script> 
// #ifdef  APP-PLUS
import UniShare from "uni_modules/uni-share/js_sdk/uni-share.js";
const uniShare = new UniShare();
//#endif  
import QrcodePoster from '@/components/zhangyu-qrcode-poster/zhangyu-qrcode-poster.vue'
    import {
		getRecord , 
		fillupRecord,
		getExcel,
		getUserInfos} from '@/api/record'; 
	import sPopup from "@/components/s-popup/index.vue";
	import selectSwitch from "@/components/xuan-switch/xuan-switch.vue";
	import moment from '@/common/moment';
	import Vue from 'vue'
	export default {
		components: {   
			sPopup,
			QrcodePoster,
			selectSwitch
		},
		data() { 
			return { 
				defaultSwitch: false,
				switchList: ["打开", "关闭"],
				goods:{
					price:0,
					title:"扫码",
					image:""
				},
				usedwords:[],//常用词
				btnname:"我要登记",
				baseurl:this.$mStore.state.BaseUrl,
				baseAppUrl:this.$mStore.state.BaseAppStaticUrl, 
				content:"",
				title:"",
				owner:false,
				is_show_model:false,
				username:"",
				extras:[],
				users:[],
				status:0,
				values:[],// 用户登记的值
				loading:false,
				show_userinfo:1,
				newColumn:"",//新列名 
				hasLogin:false,
				uuid:"",
				date:null,
				count:0, //已登记人数
				limits:0,// 登记人数上限
				needLogin:0,
				showLoginPage: true,
				only_owner_export:0,
				allow_delete:false,
				allow_modify:false,
				modifyindex:-1,//修改登记记录的标记
				current_input_index:0,// 当前输入内容的索引
				onlyShowMine:false,
				infouuid:"",//修改登记记录的uuid
				method:"",
				tags: [
					{
					label: "序号(自增)",
					} 
				], 
				timer:null,
				pagepath:"",
				way:"click"// 点击进来的
			};
		},  
		 onLoad(options){   
			  const q = decodeURIComponent(options.q) 
			  if (q.indexOf("property.chidict") != -1 ){
				  //来自微信小程序扫码进入
				  // 定时登记薄通过扫码只能进入最新的登记薄
				  //     (为的是不更换二维码的前提下可以更换登记薄,
				  // 应用场景：门卫门口贴二维码登记，每天更换新登记薄, 但不需要更换二维码)
				  // 非定时登记薄扫码进入的就是二维码本身指向的登记薄
				  this.uuid = q.substring(q.lastIndexOf("/")+1);
				  this.way = "weixin"
			  }
			  else{
				  if (options.way == "scan"){
						// 扫码进来的 
						this.way = "scan"
				  }
				  this.uuid = options.uuid 
			  }  
			this.hasLogin = this.$mStore.getters.hasLogin; 
			this.getDetail() 
			this.usedwords = uni.getStorageSync("usedwords")
			if (!this.usedwords){
				this.usedwords = []
			}
			this.pagepath = `/pages/record/detail?uuid=${this.uuid}`
		 },
		 onReady() { 
		 	this.hasLogin = this.$mStore.getters.hasLogin;  
		 }, 
		 onBackPress({ from }) {
				if (from == "backbutton") {
				this.$nextTick(function () {
					if(uniShare){
					  uniShare.hide();

					}
				
				});
				return uniShare.isShow;
				} 
				return true;
			},
		 onShareAppMessage() {
			return {
				title: this.title,
				desc: this.content,
				path: this.pagepath
			}
		},
		methods: {
			// #ifdef  APP-PLUS
			uniShare() {
			let href = this.$mStore.state.BaseShareUrl+"?entity_type=3&"+"entity_uuid="+this.uuid
			uniShare.show(
				{
				content: {
					//公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
					type: 0,
					href: href,
					title: "【登记薄】" + this.title,
					summary: this.content,
					imageUrl: this.goods.image, //  logo大小不能超过32kb，否则不会显示
				},
				menus: [
					{
					img: this.baseAppUrl + "app-plus/sharemenu/wechatfriend.png",
					text: "微信好友",
					share: {
						provider: 'weixin',
						scene: "WXSceneSession",
						type: 5, 
						title:  "【登记薄】" + this.title,
						summary: this.content,
						imageUrl: this.goods.image, 
						miniProgram: {
							id: this.$mStore.state.WX_XIAOCHENGXU_ID,
							path: this.pagepath,
							type: 0,
							webUrl: href
						},
						success: ret => {
							console.log(JSON.stringify(ret));
						}
					},
					},
					{
					img: this.baseAppUrl + "app-plus/sharemenu/wechatmoments.png",
					text: "微信朋友圈",
					share: {
						provider: "weixin",
						scene: "WXSceneTimeline",
					},
					},
					{
					img: this.baseAppUrl + "app-plus/sharemenu/copyurl.png",
					text: "复制",
					share: "copyurl",
					},
					{
					img: this.baseAppUrl + "app-plus/sharemenu/more.png",
					text: "更多",
					share: "shareSystem",
					},
				],
				cancelText: "取消分享",
				},
				(e) => {
				//callback
				console.log(uniShare.isShow);
				console.log(e);
				}
			);
			}, 
			//#endif
			startTimer(){
				// 目前只要是公开登记，所有人都可以开启本通知
				var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
				
				if(_this.status == 1)
				{ 
					// 正在登记的登记薄 
					_this.timer = setInterval(function() {
					let param = {
						uuid:_this.uuid,
						userlength:_this.count
					}
					getUserInfos(param).then(({status, msg})=>{
						if (status === 0) {
							if(msg.length > 0){  
								_this.users.unshift(...msg) ;
								_this.count = _this.users.length; 
								uni.showToast({
									title: msg.length + "条新登记"
								}) 
								_this.playmusic() 
							} 
						}
					   })
					}, 5000);

					this.$once('hook:beforeDestroy',()=>{
					    clearInterval(_this.timer);
					    _this.timer= null
					}) 
				}
			},
			initmusic(){
				if (this.innerAudioContext == null){ 
					this.innerAudioContext = uni.createInnerAudioContext();
				    this.innerAudioContext.autoplay = true;
				    this.innerAudioContext.src = this.baseAppUrl+'tishiyin.mp3';
				} 
			},
			playmusic(){
				this.initmusic()
				
				this.innerAudioContext.play();
				this.innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				}); 
			},
			changeSwitch(isSwitch) { 
				if (isSwitch) {
					// 开启接收新登记及通知声音
					this.startTimer() 
				} else {
					// 停止接收新通知及登记
					clearInterval(this.timer);
					this.timer= null
				}
			},
			getNewRerords(){
				//拉取新登记
			},
			blur(word){
				if(word != undefined){ 
					this.updateUsedWords(word) 
				} 
			},
			updateUsedWords(word){
				if (word == ""){
					return
				}
				for (let i = 0; i < this.tags.length;i++){
					if (this.tags[i].label == word){
						return//在快速填报标签中
					}
				}
               // 更新常用词
			   let intable = false  
			   let length = this.usedwords.length 
			   
				// 弹出最少使用的常用词
				let index = 0
				let usedtimes = 0
				
				for (let i = 0; i < length; i++ ){
					if (this.usedwords[i].label == word){ 
						this.usedwords[i].usedtimes += 1
						intable = true 
					}
					if (length > 10)
					{
						if (i == 0){
							usedtimes = this.usedwords[i].usedtimes 
						}
						else{
							if (usedtimes > this.usedwords[i].usedtimes){
								index = i
								usedtimes = this.usedwords[i].usedtimes
							}
							else{
								this.usedwords[i].usedtimes -= 1
							}
						} 
					} 
					 
				}
				if (length > 10){
					this.usedwords.splice(index, 1)  
				} 
                if(!intable){
				   this.usedwords.push({
					label:word,
					usedtimes:1//使用次数
			    	}) 
			    } 
			    uni.setStorageSync("usedwords", this.usedwords)
			},
			modifyMine(uuid, userinfo, userindex) 
			{
				// 修改 
				let edititem = {} 
			    this.modifyindex = userindex
				for(var i =0; i < this.extras.length; i ++){
					edititem = this.extras[i]
					edititem.value = userinfo.values[i]
					Vue.set(this.extras,i, edititem)  
				}  
				this.infouuid = uuid
				this.method = "put"
				this.getFastItems()
				this.$refs.popup.show("top") 
			},
			deleteMine(uuid){
				// 删除已登记的记录 
				let _this = this
				uni.showModal({
					content: "确认删除?",
					cancelText:"取消",
					confirmText:"确认",
					success: (confirmRes) => {
						if (confirmRes.confirm) { 	
							let data={
								uuids:uuid,
								method:"delete"
							}
							fillupRecord(data, this.hasLogin).then(res=>{
								if(res.status == 0){
									uni.showToast({
										icon:"success",
										title:"已删除"
									})
									_this.getDetail()
								}
								else{
									uni.showToast({
										icon:"error",
										title:res.msg
									})
								}
							}) 
						} 
					},
				});
			} ,
			checkboxOnlyMine(){
				// 仅展示我的登记，需登录
				if(this.hasLogin == false){
					// 先登录
					this.$mHelper.backToLogin(true)
					return
				}
				this.onlyShowMine = !this.onlyShowMine
				this.getDetail()

			},
			isNumber(checkVal) {
				let reg = /^-?[1-9][0-9]?.?[0-9]*$/;
				return reg.test(checkVal);
			},
			time(val) { 
			// 日期格式化
				return moment(val ).format('YYYY-MM-DD HH:mm:ss')
			} , 
			datetostring(val) { 
			// 日期格式化
				return moment(val ).format('YYYY-MM-DD')
			} ,
			download(){
				this.loading = true
				let that = this
				getExcel({uuid:this.uuid}).then(({status, msg})=>{
					if(status == 0 )
					{ 
						 let excelpath = that.baseurl + msg
						// 文件下载并展示
						// 获得excel路径
						// excel 文件下载并打开
						// #ifdef APP-PLUS
						    // 未测试
							const downloadTask = uni.downloadFile({
								url: excelpath, // 文件下载路径
								success: (res) => {
									if (res.statusCode === 200) {
										//保存成功并打开文件 
										uni.openDocument({
											filePath: res.tempFilePath,
											success:(res) => console.log('成功打开文件')
										}) 
									}
									that.loading = false
								}, fail(err) { 
										uni.showToast({
											title:"下载失败" ,
											icon:"error",
											duration: 3000
										})
										that.loading = false
								}
							}); 
						// #endif 
						
						// #ifdef MP-WEIXIN
						wx.downloadFile({
							url:excelpath,
							success(res){
								 that.loading = false
								// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
								if (res.statusCode == 200){ 
									let filepath = res.tempFilePath;
									uni.showModal({
										content: that.title+".xlsx",
										cancelText:"打开",
										confirmText:"转发",
										success: (confirmRes) => {
											if (confirmRes.confirm) {
												wx.shareFileMessage({
													filePath:filepath,
													fileName:that.title+".xlsx",
													success(res) {
														uni.showToast({
															title:"分享成功" ,
															icon:"success",
															duration: 3000
														})
													},
													fail(res) {
														console.log(res)
													}
												}) 
											}
											else{
												// 打开
												wx.openDocument({
													filePath:filepath,
													success:function(res){
														that.loading = false
													}
												}) 
											}
										},
									});
									 
								}
								
							}, fail(err) { 
									uni.showToast({
										title:"下载失败" ,
										icon:"error",
										duration: 3000
									})
									that.loading = false
							 }
						})
						// #endif
					}
					else{
						uni.showToast({
							title:msg,
							icon:"error",
							duration:2000
						})
						that.loading = false
					}
				})
				
				
			},
			InputFocus(e, index){ 
				this.current_input_index = index 
			},
			fastAdded(label){   
				if (label == ""){
					return 
				}
				if (this.extras[this.current_input_index].action[1] == "autoincrease"){
					// 自增加的项，不需要填写，索引自动+1
					if (this.current_input_index < this.values.length -1){
						this.current_input_index = this.current_input_index +1
					}  
				} 
				else if (this.extras[this.current_input_index].type=="number"){
					//验证数字是否正确
					if(!this.isNumber(label)){
						uni.showToast({
							icon:'error',
							title:'请输入数字'
						}) 
						return
					}
				} 
				let edititem = this.extras[this.current_input_index]
				edititem.value = label 
				Vue.set(this.values,this.current_input_index, label) 
				Vue.set(this.extras,this.current_input_index, edititem) 
				if (this.current_input_index < this.values.length -1){
					this.current_input_index = this.current_input_index +1
				} 
			}, 
			clearExtras(){
				// 重置之前的填表
				this.current_input_index = 0
				for(let i = 0; i < this.extras.length; i ++){
					let edititem = this.extras[i]
					edititem.value = ""
					Vue.set(this.extras, i, edititem) 
				} 
				this.method = ""
			},
			fillup(){ 
				// 登记 
				this.values = []
				// 进行必填项验证 
				for(let i = 0; i < this.extras.length; i ++){
					let empty = this.extras[i].value == "" || this.extras[i].value == null;
					if (this.extras[i].required == 1 && 
					this.extras[i].action[1] !="autoincrease"  && empty){
						//
						uni.showToast({
							icon:"error",
							title:"请填写"+this.extras[i].label
						})
						return
					}
					this.values.push(this.extras[i].value) 
				}  
				let params = {
				    uuid:this.uuid, 
				    values: this.values,  
				} 
				if (this.method == "put"){
					params['method'] = this.method
					params['record_info_uuid'] = this.infouuid
				}
				this.loading = true
				let that = this
				fillupRecord(params, this.hasLogin).then(({status, msg})=>{
					that.loading = false
					if (status == 0){
						let title = "已登记" 
						
						if (that.method == "put"){
							//修改
							title= "已保存"
							let useitem = that.users[that.modifyindex]
							useitem.values = this.values
							Vue.set(that.users, that.modifyindex, useitem)
						}
						else{
							//新增
							that.users.unshift({
								uuid:msg.uuid,
								username:"",
								values:that.values 
							})  
							that.count = that.count + 1 
						}
						uni.showToast({
							title:title ,
							icon:"success",
							duration: 3000
						}) 
						
						that.$refs.popup.hide(); 
						that.clearExtras() 
					}
					else{
						uni.showToast({
							title:msg ,
							icon:"error",
							duration: 3000
						})
					}
					  
				}).catch((res)=>{ 
					that.loading = false
					uni.showToast({
						title:"系统繁忙" ,
						icon:"error",
						duration: 3000
					}) 
				})
				/*
				
				 */
				
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
			getFastItems(){
				//获得快捷输入内容
				let userinfo = uni.getStorageSync("userInfo")
				console.log(userinfo)
				this.tags = [] 
				if (userinfo != ""){
					// 用户已登录 
					this.tags.push({
						label:userinfo.phone
					})
					if (userinfo.username){
						this.tags.push({
							label:userinfo.username
						}) 
					}
					if (userinfo.sex){
						this.tags.push({
							label:userinfo.sex
						})
					}
					
				}
			 
				let rooms = uni.getStorageSync("rooms")
				if (rooms != ""){
					// 房号
					rooms.forEach(item=>{
						this.tags.push({
						  label:item
					  })
					}) 
				}
				let now = new Date().getTime(); 
				this.tags.push({
						  label:this.datetostring(now)
				 })
				this.tags.push({
						  label:this.time(now)
				 })
				  
			},
			tablePopup(e){
				if (this.limits>0 && this.count >= this.limits){
					// 登记人数已满
					uni.showToast(
						{
							icon:"error",
							title:"登记人数已满"
						}
					)
                    return ;
				}
				if (this.needLogin && !this.hasLogin){
					//
					this.$mHelper.backToLogin(true) 
					return
				}
				else{
					// 添加快捷输入内容
					this.getFastItems()
					if(!this.hasLogin   ){
						// 跳转登录 
						if(this.showLoginPage){
							uni.showModal({
								content: "你暂未登陆，是否跳转登录页面？",
								success: (confirmRes) => {
									if (confirmRes.confirm) {
										this.$mRouter.push({
											route: "/pages/public/logintype",
										});
									}
									else{
										this.showLoginPage = false
										this.btnname = "匿名登记"
										this.$refs.popup.show("top") 
									}
								},
							});  
						}
						else{
							this.btnname = "匿名登记"
							this.$refs.popup.show("top") 
						}
						
					} 
					else{ 
						this.$refs.popup.show("top")
					}
				}
				 
			},
			sharePoster(){
			        //获取带参数二维码
			        this.is_show_model = false 
			        this.$refs.poster.showCanvas('https://property.chidict.com/app/xiaoxia.png')
			    },
			getDetail( ){
				// 获得登记详情
				this.loading = true
				let that = this 
				getRecord({uuid:this.uuid, onlyShowMine:this.onlyShowMine}, this.hasLogin)
				.then(({status, msg})=>{ 
					if(status == 0 ){ 
						that.needLogin = msg.need_login 
						that.limits = msg.limits 
						that.title = msg.title
						that.content = msg.content
						that.date = msg.date
						that.extras = msg.extra
						that.status = msg.status
						that.owner = msg.owner
						that.allow_delete = msg.allow_delete
						that.allow_modify = msg.allow_modify
						that.goods.image = that.baseurl+ 'images'+msg.qrcode
						that.only_owner_export = msg.only_owner_export
						that.extras.forEach(item =>{
							item.value=""
						})
						that.show_userinfo = msg.show_userinfo
						if (msg.username){
							that.username = msg.username 
						}
						else{
							that.username = ""
						} 
						that.users = msg.users 
						that.count = msg.users.length 
						that.values = new Array(that.extras.length)// 初始化输入值数组  
						if (msg.need_login == 1 && that.hasLogin == false){
							that.btnname = "请先登录"
							// 必须登录才可以进行登记
							that.$mHelper.backToLogin(true)
							that.loading = false
							return 
						}
						uni.setNavigationBarTitle({
							title:that.title
						})
						if (that.status == 2){
							that.btnname = "登记已结束"
						}
						else if (that.count >= that.limits && that.limits > 0){
							that.btnname = "登记人数已满" 
						}
						else{
							if (that.way == "scan" || that.way == "weixin"){
								// 来自微信扫码或者app扫码登记，直接弹出登记框
								this.$refs.popup.show("top") 
							}
							
						}
						
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
			userRecord(recordstatus){
				// 用户登记  
				const data = {
					status:recordstatus,
					title:this.title,
					content:this.content,
					show_userinfo:this.show_userinfo,
					extra: JSON.stringify(this.headers)
				}
				postRecord(data).then(({status, msg})=>{
					if (status == 0 ){
						this.$mHelper.toast(msg) 
					}
				}).catch((res)=>{
					console.log(res)
				});
			},
			// 跳转页面
			navTo (route) {
				this.$mRouter.push({route});
			} ,
			close(){
				this.$refs.popup.hide();
			}
		}
	}
</script>

<style lang="scss"> 
	@import  'table.scss';
	.shareimg-top {
		position: absolute;
		right: 25rpx;
		top: 0rpx;
		text-align: right;
	}
	.shareimg {
		width: 60rpx;
		height: 60rpx;
		border-radius: 10rpx;
		border: 1px solid $background-color-gray;
	}
	.bottom-holder{
		display: flex;
		justify-content:space-between ;
		.goview{ 
			text-align: center; 
		}
		.erweima{ 
			text-align: center;   
		}
	}
	
	.table{
		overflow: scroll;
		height: 900rpx;
		.tbcontent{
			display: flex;
		}
		.tbheader{
			background-color:#8a8a8a ;
			line-height: 80rpx;
			color:white;
		}
		.headeritem{ 
			min-width: 90rpx; 
			white-space:nowrap;
			.deleteMine{
				font-weight: bold;
				margin:0 15rpx;
				color:$uni-color-error;
			}
		}
	}
	.excel{ 
		width: 70rpx;
		height: 70rpx;
	}
	.gorecord{
		color:$font-color-light;
		font-size: $font-sm;
	}
	
	.pop-title{
		font-size: 20px; 
	}
	
	.userinfo{
		padding-top:15rpx;
		display: flex;
	}
	.userinfotext{
		margin-right:10rpx;
		padding-top:10rpx;
	}
	.headeraddnew{
		color:$base-color;
	}
	
	 .date{
		font-size:14px;
		color: $font-color-light;
	}
	.i-top-title{
		text-align: left;
		line-height: 80rpx;
		border-bottom: 1px solid $background-color-gray;
	}
	.recordtitle{
		font-size: 20px;
		font-weight: bold;
		text-align: left;
		width: 700rpx;
		border-bottom: 2px solid $base-color;
	}
	
	.btn-add-new{
		height: 80rpx;
		width: 240rpx;
		border-radius: 20rpx;
		background-color: $base-color;
		color:$color-white;
		margin-top:20rpx;
	}
	.label{
		display: flex;
		justify-content:space-between;
		width: 700rpx; 
		line-height: 70rpx;;
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
	.promote-detail{
		line-height: 70rpx;
	}
	.properties{
		 margin-top: 8rpx;
		 color:$base-color;
		 width: 240rpx; 
	}
	.bottom-btn{ 
		width:710rpx;  
		text-align: center; 
	}
	.draft-btn {
		width: 280rpx; 
		background-color: $base-color;
		color:$color-white;
	} 
	.publishmain{
		background-color: $color-white; 
		min-height: 100vh;
		overflow-y:scroll;
		/* #ifdef APP-PLUS */
		padding: 15rpx $spacing-base;
		/* #endif */
        /* #ifdef MP-WEIXIN */
		padding: 0 $spacing-base;
		/* #endif */
		.popupColumns{
			.popup-holder{ 
				min-height:  400rpx; 
				margin-top: 30rpx;
				padding-bottom: 50rpx;
				background-color: $color-white; 
				.requiredtips{
					margin-left: 25rpx;
					color:$uni-color-error;
					margin-bottom: 15rpx;;
				}
				.v-title{
						text-align: center; 
						width: 700rpx;
						margin-bottom: 30rpx;
					}
				.fill{
					display: flex;
					margin-left:50rpx;
					margin-right:50rpx;
				} 
				width:700rpx; 
				.fileitemvalue-disabled{
					background-color: $font-color-base;
				}
				.fileitemname{
					width: 200rpx;
					border-bottom: 1rpx solid $border-color-dark; 
					border-right: 1rpx solid $border-color-dark; 
					text-align: center;
					.red{
						color:$uni-color-error;
					}
				} 
				.fileitemvalue{
					width: 400rpx;
					border-bottom: 1rpx solid $border-color-dark;
				}
				.tags { 
					margin: 25rpx; 
					.tagstitle{
						color:$base-color;
						font-size: 20px;
					}
					.tagmain{
						display: flex; 
						flex-flow: wrap; 
						
						.tag {
							margin: 5rpx 10rpx; 
							border: 1px solid $border-color-light;
							border-radius: 15rpx;
							text-align: center;
							padding: 0 10rpx;
							white-space: nowrap;
						}
					}
				} 
			}
			.close{
				position: absolute;
				top:10rpx;
				right:10rpx;
				height: 50rpx;
				width: 50rpx; 
			}

		}
		.recordtags{
			display: flex;
			margin-top:15rpx;
			.tag{
				padding-left:10rpx;
				padding-right:10rpx;
				border-radius: 40rpx;
				color:white;
			}
			.needLogin{
				background-color:$base-color ;
			}
			.show_userinfo{
				background-color:#1296db ;
				margin-right:10rpx;
			}
			.limits{
				margin-right:10rpx;
				background-color:#d81e06 ;
			}
		}
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
		max-height: 250rpx;
		overflow-y:scroll;
		border-bottom: 1rpx solid $border-color-base;
	} 
</style>
