<template>
    <view class="page">
        <image class="feedbackimg"   src="/static/img/feedback.png"  mode=""></image>
        <view class="title">We would love your feedback</view>
        <view class="content">Our goal is to make a platform that simplifies your workday.
You've been using PatientSky for a while now, and we'd love to
know what you think about it.
We really appreciate your feedback, Anders!</view>
        <view class="sectitle">Description</view>
        <view class="msg">
            <textarea class="txtmsg" v-model="description" placeholder="Enter description here..."></textarea>
        </view>
        <button class="default-btn submit-btn"  @tap="sumit" >Submit</button>
    </view>
</template>

<script> 
    export default {
        data() {
            return {
                description:"" 
            }
        },
        onLoad() {
			 
        },
        methods: {
            sumit(){
                if(this.description == ""){
                    uni.showModal({
						content: "Please input description",
						confirmText:"OK",
						showCancel:false,
						success: (confirmRes) => {
						
						},
					});
					return;

                }
                else{
                    uni.navigateTo({
                        url: '/pages/uni-feedback/success' 
                    }) 
                }
            }
			 
        },
        beforeDestroy(){
            uni.hideLoading();
        },
		onNavigationBarButtonTap(val) {
			if (val.index == 0) {
				uni.navigateTo({
					url: '../uni-feedback/success' 
				})
			};
		}
    }
</script>

<style lang="scss" scoped> 
    .page {
        background-color: white;
        padding-bottom: 60rpx;
        .submit-btn{
            width: 700rpx;
            margin-top: 400rpx; 
            padding-bottom: 25rpx;
            line-height:  70rpx;
            height:  70rpx;
            border-radius: 35rpx; 
        }
        .feedbackimg{
            margin-top:25rpx;
            margin-left: 315rpx;
            width: 120rpx;
            height: 120rpx;
        }
        .title{
            width: 750rpx;
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            margin-top: 25rpx;
            /* identical to box height, or 143% */

            text-align: center;

            color: #000000;
        }
        .content{
            margin: 25rpx;
        }
        .sectitle{
            margin-left: 25rpx;
            font-weight: 700;
        }
        .txtmsg{
            border: 1px solid #999999;
            border-radius: 20rpx;
            width: 700rpx;
            padding: 15rpx;
            margin-left: 25rpx;
        }
    }
    
</style>
