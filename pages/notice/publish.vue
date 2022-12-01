<template>
    <view class="page">
        <view class='feedback-title'>
            <text>通知公告标题</text> 
        </view>
		<view class="feedback-body">
		   <input class="feedback-input" v-model="sendDate.title" placeholder="输入标题..." />
		</view>
        <view class="feedback-body">
            <male-editor :uploadFile="upFile" v-model="sendDate.detail" placeholder="通知公告内容,APP端或者小程序端只能输入文字通知,如果想发布样式丰富的通知公告,请至PC端发布..."  > </male-editor>
        </view> 
        <button type="primary" class="feedback-submit" @tap="send">发布</button> 
		<view class="tips">
		  <view class="title">
		    <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
		    <text>温馨提示:</text>
		  </view> 
		  <view class="appraisetxt">1、内容更加丰富的通知，请移步至PC端发布</view> 
		</view>
    </view>
</template>

<script>
import store from '@/store'
import {publishNotice } from '@/api/notice.js'
import {getNoticesApi} from '@/api/product'

    export default {
        data() {
            return { 
                showAddImage:true,
                imageList: [],
				"log":"",
				"cid" : "",
				uuid:"",
				baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
                sendDate: {
                    score: 3,
                    detail: "",
                    contact: "",
					content:"",
					communityuuid:"",
					product_type:1,//通知
                },
                
            }
        },
        onLoad(options) {
			if(options.uuid){
				//修改
				this.uuid = options.uuid
				this.getDetail()
			}
            this.sendDate.communityuuid = uni.getStorageSync("communityuuid")
        },
        methods: {
            upFile(callback) {
                let fileServer = {
					url: store.state.BaseUrl +'api/appfile/appfile/',
					name: "imgFile",
					header: {
                        "Content-Type": "multipart/form-data",
						Authorization:  store.state.accessToken || uni.getStorageSync('accessToken') 
					},
					formData: { },
					fileNum: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					inImgData: true //返回信息是否插入图片标签data中
				} 
				uni.chooseImage({
					count:  fileServer.fileNum, // 2.2.0 版本起插入图片时支持多张（修改图片链接时仅限一张）
					sizeType:  fileServer.sizeType,
					sourceType:  fileServer.sourceType,
                    success: res => {
						if (! fileServer.url) {
							uni.showModal({
								content: "设置文件服务器URL",
								showCancel: false
							})
							return false;
						}
						uni.showLoading({
							title: '上传中'
						});
						for (let item of res.tempFilePaths) { 
							uni.uploadFile({
								url:  fileServer.url,
								name: 'file',
								formData: fileServer.formData,
								header:  fileServer.header,
								filePath: item,
								success: (rs) => { 
                                    let res = JSON.parse (rs.data)
                                    console.log(res)
									let imgobj = {
										src:store.state.BaseUrl+ res.msg,
										data: res.msg
									}
									callback(imgobj)
								},
								fail(rs) {
									uni.showModal({
										content: '网络错误，请检查你的网络',
										showCancel: false
									}); 
								}
							})

						}

						uni.hideLoading();
					}
				})
			},
			getDetail(){
				let params = {
					uuid:this.uuid
				}
				getNoticesApi(params, true).then(res=>{ 
					if (res.status == 0){
                        this.sendDate = res.msg  
                    }
				})
			},
			clearLog(){
				// 清除日志信息
				this.log = ''
				this.cid = ''
				uni.setStorageSync('log', "")
			},
            close(e){
                this.imageList.splice(e,1);
                if (this.imageList.length < 9 ){
                   this.showAddImage = true
                }
            }, 
            chooseImg() { //选择图片
                uni.chooseImage({
                    sourceType: ["camera", "album"],
                    sizeType: "compressed",
                    count: 9 - this.imageList.length,
                    success: (res) => { 
                        this.imageList = this.imageList.concat(res.tempFilePaths);
                        if (this.imageList.length >= 9 ){
                            this.showAddImage = false
                            }
                    }
                })
            },
            chooseStar(e) { //点击评星
                this.sendDate.score = e;
            },
            previewImage() { //预览图片
                uni.previewImage({
                    urls: this.imageList
                });
            },
            send() {  
                let imgs
                if (this.imageList.length > 0){
                      imgs = this.imageList.map((value, index) => {
                        return {
                            name: "image" + index,
                            uri: value
                        }
                    })
                }
                else{
                      imgs = [];
                } 
                if( this.sendDate.detail){
                    this.sendDate.detail = this.sendDate.detail.replace('<img src=','<img style="max-width:100%" src=')
                }
				let that = this
                uni.showLoading({
					mask: true,
					title:"请稍后..."
				}); 
                if (this.uuid != ""){
                    this.sendDate.method =  "put"
                    this.sendDate.uuid =  this.uuid 
                }
                publishNotice( this.sendDate).then((data) => { 
                    uni.hideLoading();
                    if (data.status === 0) {
                        if (imgs.length > 0){
                            
                            // 上传图片，微信小程序不支持批量上传
                            imgs.forEach(ele=>{ 
                                uni.uploadFile({
                                    url: store.state.BaseUrl +'api/product/products/',
                                    filePath: ele.uri,
                                    name:ele.name,
                                    header: {  
                                        "Content-Type": "multipart/form-data",
                                        'Authorization': token,  
                                        // 'content-type': 'application/json'  
                                    },
                                    formData: {uuid:data.uuid,method:"put", communityuuid:that.sendDate.communityuuid},
                                    success: (res) => { 
                                        console.log(res) 
                                    },
                                    fail: (res) => {
                                        uni.showToast({
                                            title: "失败",
                                            icon:"none"
                                        });
                                        console.log(res)
                                    }
                                }); 
                            })
                        }
                        uni.showToast({
                            title: "已发布!"
                        });
                        this.imageList = [];
                        this.sendDate = {
                            score: 0,
                            content: "",
                            contact: ""
                        }
						this.$mRouter.push({
							route:"/pages/notice/mynotice" 
						});	
                    }
                }).catch(function(err) {
                    console.log(err);
                    uni.hideLoading();
                }) 
            }
        },
        beforeDestroy(){
            uni.hideLoading();
        },
		onNavigationBarButtonTap(val) {
			if (val.index == 0) {
				uni.navigateTo({
					url: '../uni-feedback/myfeedback' 
				})
			}
		}
    }
</script>

<style lang="scss" scoped> 
    page {
        background-color: #EFEFF4;
    }
	.tips{
		margin:25rpx  ;
		padding-bottom: 180rpx;;
	}
    view{
        font-size: 28upx;
    }
    .input-view {
        font-size: 28upx;
    }
    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
    /* 上传 */
    .uni-uploader {
    	flex: 1;
    	flex-direction: column;
    }
    .uni-uploader-head {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    }
    .uni-uploader-info {
    	color: #B2B2B2;
    }
    .uni-uploader-body {
    	margin-top: 16upx;
    }
    .uni-uploader__files {
    	display: flex;
    	flex-direction: row;
    	flex-wrap: wrap;
    }
    .uni-uploader__file {
    	margin: 10upx;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__img {
    	display: block;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__input-box {
    	position: relative;
    	margin:10upx;
    	width: 208upx;
    	height: 208upx;
    	border: 2upx solid #D9D9D9;
    }
    .uni-uploader__input-box:before,
    .uni-uploader__input-box:after {
    	content: " ";
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	-webkit-transform: translate(-50%, -50%);
    	transform: translate(-50%, -50%);
    	background-color: #D9D9D9;
    }
    .uni-uploader__input-box:before {
    	width: 4upx;
    	height: 79upx;
    }
    .uni-uploader__input-box:after {
    	width: 79upx;
    	height: 4upx;
    }
    .uni-uploader__input-box:active {
    	border-color: #999999;
    }
    .uni-uploader__input-box:active:before,
    .uni-uploader__input-box:active:after {
    	background-color: #999999;
    }
    .uni-uploader__input {
    	position: absolute;
    	z-index: 1;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	opacity: 0;
    }
    
    /*问题反馈*/
    .feedback-title {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    	align-items: center;
    	padding: 20upx;
    	color: #8f8f94;
    	font-size: 28upx;
    }
    .feedback-star-view.feedback-title {
    	justify-content: flex-start;
    	margin: 0;
    }
    .feedback-quick {
    	position: relative;
    	padding-right: 40upx;
    }
    .feedback-quick:after {
    	font-family: uniicons;
    	font-size: 40upx;
    	content: '\e581';
    	position: absolute;
    	right: 0;
    	top: 50%;
    	color: #bbb;
    	-webkit-transform: translateY(-50%);
    	transform: translateY(-50%);
    }
    .feedback-body {
    	background: #fff;
    }
    .feedback-textare {
    	height: 600upx;
    	font-size: 34upx;
    	line-height: 50upx;
    	width: 100%;
    	box-sizing: border-box;
    	padding: 20upx 30upx 0;
    }
    .feedback-input {
    	font-size: 50rpx;
    	height: 80rpx;
    	min-height: 80rpx; 
		border-bottom: 1px solid $base-color;
    }
    .feedback-uploader {
    	padding: 22upx 20upx;
    }
    
    .feedback-submit {
    	background-color: #df5000 !important;
    	color: #FFFFFF;
    	margin: 20upx;
    }
	.clearLog{
		background-color: #5052ce !important;
		color: #FFFFFF;
		margin: 20upx;
	}
</style>
