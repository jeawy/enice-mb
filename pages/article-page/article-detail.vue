<template>
    <view class="page"> 
		<view class=" feedback-uploader">
            <view class="uni-uploader">
                <view class="uni-uploader-head"> 
                    <view class="uni-uploader-info" v-if="articletype == 0">{{imageList.length}}/9</view>
                </view>
                <view class="uni-uploader-body">
                    <view class="uni-uploader__files">
                        <block v-for="(image,index) in imageList" :key="index" >
                            <view class="uni-uploader__file" style="position: relative;">
                                <image class="uni-uploader__img" :src="image" @tap="previewImage"></image>
                                <view class="close-view" @click="close(index)">x</view>
                            </view>
                        </block>
                        <view class="uni-uploader__input-box" v-show="showAddImage  && articletype == 0">
                        	<view class="uni-uploader__input" @tap="chooseImg"></view>
                        </view>
						<block v-for="(image,index) in videoList" :key="index"  >
                            <view class="uni-uploader__file-video" style="position: relative;">
                                <image class="uni-uploader__img-video" :src="image" @tap="previewImage"></image>
                                <view class="close-view" @click="close(index)">x</view>
                            </view>
                        </block>
						<view class=" uni-uploader__input-box-video" v-show="showAddImage  && articletype == 1">
                        	<view class="uni-uploader__input-video" @tap="chooseImg">
								<image src="/static/img/play1.png" class="imgplay"></image>
							</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="feedback-body">
            <input class="feedback-input" placeholder="Title:" v-model="sendDate.title"   />
        </view> 
        
        <view class="feedback-body">
            <textarea placeholder="Content:"  v-model="sendDate.content" 
			class="feedback-textare" />
        </view> 

		<view class="content-flex">
			<view class="btns">
				<button  class="default-btn topic-btn" @tap="send">#topic</button>
				<button  class="default-btn topic-btn" @tap="send">@user</button>
		    </view>
			<view class="topics">
				<view class="topic" v-for="(item, index) of topics" :key="index">
                    <view class="title">#{{ item.title }} </view>
					<view class="view">{{ item.view }} views</view>
				</view>
			</view>
        </view> 
 

        <button type="primary" class="post-btn default-btn" @tap="send">Post</button>
		 
    </view>
</template>

<script>
import store from '@/store'
import {ApiPostFeedback } from '@/api/feedback.js'
    export default {
        data() {
            return {
				showAddImage:true,
                imageList: [], 
				videoList:[],
                sendDate: {
					title:"",
                    score: 3,
                    content: "",
                    contact: ""
                },
				articletype:0,//default is picture article
				topics:[
					{
						title:"Tesla Sydney",
						view:"1.3m"
					},
					{
						title:"Tesla Model 3",
						view:"1.1m"
					},
					{
						title:"Tesla Model S",
						view:"0.8m"
					},
				]
            }
        },
        onLoad(options) {
			this.articletype = options.type;
			/*
			if(options.type == 0){
				uni.chooseImage({
					sourceType: [  "album"],
					sizeType: "compressed",
					count: 9 - this.imageList.length,
					success: (res) => { 
						this.imageList = this.imageList.concat(res.tempFilePaths);
						if (this.imageList.length >= 9 ){
							this.showAddImage = false
							}
					}
				})
			}
			else{
				uni.chooseVideo({
					sourceType: [  "album"],
					sizeType: "compressed",
					count:1,
					success: (res) => { 
						this.videoList = this.videoList.concat(res.tempFilePath);
						if (this.videoList.length >= 1 ){
							this.showAddImage = false
						}
					}
				})
		    }*/
        },
        methods: { 
            close(e){
                this.imageList.splice(e,1);
                if (this.imageList.length < 9 ){
                   this.showAddImage = true
                }
            }, 
            chooseImg( ) { //选择图片
				if(this.articletype == 0){
					uni.chooseImage({
						sourceType: [ "album"],
						sizeType: "compressed",
						count: 9 - this.imageList.length,
						success: (res) => { 
							this.imageList = this.imageList.concat(res.tempFilePaths);
							if (this.imageList.length >= 9 ){
								this.showAddImage = false
								}
						}
					}) 
				}
				else{
					uni.chooseVideo({
						sourceType: [  "album"],
						sizeType: "compressed",
						count: 1,
						success: (res) => { 
							this.videoList = this.videoList.concat(res.tempFilePath);
							if (this.videoList.length >= 1 ){
								this.showAddImage = false
							}
						}
					})
				}
                
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
				if(this.sendDate.title == ""){
					uni.showModal({
						content: "Please input title",
						confirmText:"OK",
						showCancel:false,
						success: (confirmRes) => {
						
						},
					});
					return;
				}
                uni.showLoading({
					mask: true,
					title:"请稍后..."
				});
			  
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

<style lang="scss" scoped> 
    .page {
        background-color: white;
		padding: 25rpx;
		padding-bottom:  120rpx; 
		.topic-btn{
			font-size: 14px;
		}
		.post-btn{
			margin-top: 50rpx;
			border-radius: 35rpx;
			line-height:  70rpx;
			height:  70rpx;
		}
		.content-flex{
			.topics{ 
				padding: 15rpx;
				.topic{
					display: flex;
					justify-content: space-between; 
					padding:15rpx  0;
					.title{
						color:#666666;
					}
					.view{
						color:#999999;
					}
				}
			}
			.btns{
				display: flex;
				width: 250rpx;
				margin-top: 35rpx;
			    text-align: left; 
				flex-direction: row;
				margin-bottom: 15rpx;
			} 
		}
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
	.uni-uploader__file-video {
    	margin: 10rpx;
    	width: 650rpx;
    	height:650rpx;
    }
	.uni-uploader__img-video {
    	display: block;
    	width: 680rpx;
    	height:650rpx;
    }
    .uni-uploader__file {
    	margin: 10upx;
    	width: 200upx;
    	height: 200upx;
    }
    .uni-uploader__img {
    	display: block;
    	width: 200upx;
    	height: 200upx;
    }
    .uni-uploader__input-box {
    	position: relative; 
    	width: 208upx;
    	height: 208upx;
		background-color:#2A2A2A ;
		border-radius: 20rpx;
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
	.imgplay{
		position:absolute;
		left: 280rpx;
		top: 310rpx;
		width: 180rpx;
		height: 180rpx;
	}
	.uni-uploader__input-box-video:before,  
	.uni-uploader__input-box-video:after{
		width: 0upx;
    	height: 0upx;
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
	.uni-uploader__input-video{
		position: absolute;
    	z-index: 1;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%; 
	}
	.uni-uploader__input-box-video{
		width: 700rpx;
		height: 650rpx; 
		background-color:#2A2A2A ;
		border-radius:  20rpx;
	}
	  
    .feedback-body {
    	background: #fff;
		padding: 25rpx;
    }
    .feedback-textare {
    	height: 250upx;
    	font-size: 34upx;
    	line-height: 50upx; 
		width: 650rpx;
    	box-sizing: border-box;
    	border-bottom:1px solid #CCCCCC ; 
    }
    .feedback-input {
		width: 650rpx;
    	font-size: 34upx;
    	height: 50upx;
    	min-height: 50upx; 
		border-bottom:1px solid #CCCCCC ;
    }
    .feedback-uploader {
    	padding: 22upx 20upx;
    } 
</style>
