<template>
    <view class="page">
        <view class='feedback-title'>
            <text>问题、意见或者你想要的新功能</text>
            <text class="feedback-quick" @tap="chooseMsg">快速键入</text>
        </view>
        <view class="feedback-body">
            <textarea placeholder="请详细描述你的问题和意见..." v-model="sendDate.content" class="feedback-textare" />
            </view>
        <view class='feedback-title'>
            <text>图片(选填,提供问题截图,总大小10M以下)</text>
        </view>
        <view class="feedback-body feedback-uploader">
            <view class="uni-uploader">
                <view class="uni-uploader-head">
                    <view class="uni-uploader-title">点击预览图片</view>
                    <view class="uni-uploader-info">{{imageList.length}}/9</view>
                </view>
                <view class="uni-uploader-body">
                    <view class="uni-uploader__files">
                        <block v-for="(image,index) in imageList" :key="index">
                            <view class="uni-uploader__file" style="position: relative;">
                                <image class="uni-uploader__img" :src="image" @tap="previewImage"></image>
                                <view class="close-view" @click="close(index)">x</view>
                            </view>
                        </block>
                        <view class="uni-uploader__input-box" v-show="showAddImage">
                        	<view class="uni-uploader__input" @tap="chooseImg"></view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class='feedback-title'>
            <text>邮箱/手机号码</text>
        </view>
        <view class="feedback-body">
            <input class="feedback-input" v-model="sendDate.contact" placeholder="(选填,方便我们联系你 )" />
        </view>
        <view class='feedback-title feedback-star-view'>
            <text>应用评分</text>
            <view class="feedback-star-view">
               <uni-rate  v-model="sendDate.score" :is-fill="false" @tap="chooseStar(value)"/>
            </view>
        </view>
        <button type="primary" class="feedback-submit" @tap="send">提交</button>
		 
    </view>
</template>

<script>
import store from '@/store'
import {ApiPostFeedback } from '@/api/feedback.js'
    export default {
        data() {
            return {
                msgContents: ["界面显示错乱", "启动缓慢，卡出翔了", "UI无法直视，丑哭了", "偶发性崩溃"],
                showAddImage:true,
                imageList: [],
				"log":"",
				"cid" : "",
                sendDate: {
                    score: 3,
                    content: "",
                    contact: ""
                }
            }
        },
        onLoad() {
			this.log =  uni.getStorageSync("log")
            // #ifdef APP-PLUS
            this.cid = plus.push.getClientInfo().clientid   
            let deviceInfo = {
                appid: plus.runtime.appid,
                imei: plus.device.imei, //设备标识
                p: plus.os.name === "Android" ? "a" : "i", //平台类型，i表示iOS平台，a表示Android平台。
                md: plus.device.model, //设备型号
                app_version: plus.runtime.version,
                plus_version: plus.runtime.innerVersion, //基座版本号
                os: plus.os.version,
                net: "" + plus.networkinfo.getCurrentType()
            }
            this.sendDate = Object.assign(deviceInfo, this.sendDate);
            // #endif
        },
        methods: {
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
            chooseMsg() { //快速输入
                uni.showActionSheet({
                    itemList: this.msgContents,
                    success: (res) => {
                        this.sendDate.content = this.msgContents[res.tapIndex];
                    }
                })
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
            send() { //发送反馈
                console.log(JSON.stringify(this.sendDate));
                console.log(this.imageList);
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
                uni.showLoading({
					mask: true,
					title:"请稍后..."
				});
				// #ifdef MP-WEIXIN
				wx.requestSubscribeMessage(
				  {
				    //订阅【反馈通知】
				    tmplIds:["FUqWKmIsPyYPT9Mrf-x_dqGLkmNhYveZaQyAPh9K7yk"],
				     success (res) { 
				       console.log(res)
				     }
				  }
				
				)
				// #endif
                   
                ApiPostFeedback( this.sendDate).then((data) => {
                    console.log(data)
                    uni.hideLoading();
                    if (data.status === 0) {
                        if (imgs.length > 0){
                            let token = store.state.accessToken || uni.getStorageSync('accessToken')
                            // 上传图片，微信小程序不支持批量上传
                            imgs.forEach(ele=>{ 
                                uni.uploadFile({
                                    url: store.state.BaseUrl +'api/feedback/feedback/',
                                    filePath: ele.uri,
                                    name:ele.name,
                                    header: {  
                                        "Content-Type": "multipart/form-data",
                                        'Authorization': token,  
                                        // 'content-type': 'application/json'  
                                    },
                                    formData: {id:data.msg,method:"put"},
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
                            title: "反馈成功!"
                        });
                        this.imageList = [];
                        this.sendDate = {
                            score: 0,
                            content: "",
                            contact: ""
                        }
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
			};
		}
    }
</script>

<style> 
    page {
        background-color: #EFEFF4;
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
    	height: 200upx;
    	font-size: 34upx;
    	line-height: 50upx;
    	width: 100%;
    	box-sizing: border-box;
    	padding: 20upx 30upx 0;
    }
    .feedback-input {
    	font-size: 34upx;
    	height: 50upx;
    	min-height: 50upx; 
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
