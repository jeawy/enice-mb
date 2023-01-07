<template>
    <view class="page"> 
		<view class=" feedback-uploader">
            <view class="uni-uploader">
                <view class="uni-uploader-head"> 
                    <view class="uni-uploader-info" v-if="articletype == 0">{{imageList.length}}/9</view>
                </view>
                <view class="uni-uploader-body">
                    <view class="uni-uploader__files" v-if="articletype == 0">
                        <block v-for="(image,index) in imageList" :key="index" >
                            <view class="uni-uploader__file" style="position: relative;">
                                <image class="uni-uploader__img" :src="image" @tap="previewImage"></image>
                            
                            </view>
                        </block> 
                    </view>
					<view class="uni-uploader__files" v-else > 
						<block   >
                            <view class="uni-uploader__file-video" style="position: relative;">
								<video id="myVideo"  
												class="uni-uploader__img-video"
												:src="videopath"
								   controls>
								</video> 
                            </view>
                        </block> 
                    </view>
                </view>
            </view>
        </view>
        <view class="feedback-body">
            <view class="feedback-input"   >Title:{{ sendDate.title }}</view>
        </view> 
        
        <view class="feedback-body">
            <view  class="feedback-textare" >Content: {{ sendDate.content }}</view>
			<view class="content-flex"> 
				<view class="topics">
					<view class="topic" v-for="(item, index) of topics" :key="index">
						<view class="title">#{{ item.title }} </view> 
					</view>
				</view>
			</view> 
        </view> 

        <button type="primary" class="post-btn default-btn" @tap="send">Post</button>
		 
    </view>
</template>

<script> 
    export default {
        data() {
            return {
				showAddImage:true,
                imageList: [
					"/static/img/home/1.png",
					"/static/img/home/2.png",
					"/static/img/home/car2.png",
					"/static/img/home/image25.png",
					"/static/img/home/image26.png",
					"/static/img/home/s2.png",
				], 
				videopath:"",
				controls:true,
				videoList:[],
                sendDate: {
					title:"", 
                    content: "",
                    contact: ""
                },
				articletype:0,//default is picture article
				topics:[
					{
						title:"Tesla Sydney",
						 
					},
					{
						title:"Tesla Model 3",
						 
					},
					{
						title:"Tesla Model S",
					 
					},
				]
            }
        },
        onLoad(options) {
			this.articletype = options.type
			this.sendDate.title = options.title;  
			this.sendDate.content = options.content;  
			this.videopath = options.videopath
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
				
				display: flex;

				.topic{  
					padding:15rpx  ;
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
		color:#999999;
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
