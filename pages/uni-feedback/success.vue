<template>
    <view class="page">
        <view class="highlight"> Thank you  </view> 
        <view class="title">  for your valuable feedback</view>
        <view class="content">We’re so happy to hear from you</view> 
         
        <button class="default-btn submit-btn"  @tap="sumit" >Done</button>
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
                uni.navigateTo({
                    url: '/pages/entry/index' 
                })  
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
        border: 1px solid white;
        padding-bottom: 140rpx;
        .submit-btn{
            width: 700rpx;
            margin-top: 400rpx; 
            padding-bottom: 25rpx;
            line-height:  70rpx;
            height:  70rpx;
            border-radius: 35rpx;
            margin-bottom: 140rpx;
        } 
        .highlight{
            margin-top: 325rpx;
            margin-left: 10rpx; 
            color:#6ADEC3 ;
            width: 750rpx;
            font-size: 30px;
            text-align: center;
            font-weight: 700;
        }
        .title{
            width: 750rpx;
            font-weight: 500;
            font-size:30px;
            line-height: 20px; 
            /* identical to box height, or 143% */

            text-align: center;

            color: #999999;
            
        }
        .content{
            text-align: center;
            margin: 25rpx;
            color: #999999;
        } 
    }
</style>
