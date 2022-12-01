<template>
  <!-- 联系客服 -->
   <view>
    <!-- #ifdef MP-WEIXIN -->
		<view class="tools__item">
			<view class="item"> 
				<button open-type="contact" class="contact-btn">
					<view class="img">
					<image class="tool__img" :src="baseAppUrl + `customer-service.png`" />
					</view> 
					<view class="txt">联系客服</view>
				</button>
			</view>
		</view>
		<!-- #endif -->
  </view>
</template> 
<script>  
export default { 
  data() {
    return { baseAppUrl : this.$mStore.state.BaseAppStaticUrl, };
  },   
  methods: {    
  },
};
</script>

<style lang="scss" scoped> 
 .tools__item{ 
            margin-left: 265rpx; 
            margin-bottom: 100rpx;
            width:220rpx;
            text-align: center;
            border:none;
            
            .tool__img{
                width: 60rpx;
                height: 60rpx;
            }
            .fct-content{
               font-size:10px;
            } 
            .contact-btn{
                font-size:10px;
                border-top:1px solid white;
                border-bottom:1px solid white;
                text-align: center; 
                line-height: 18rpx;;
                border:none;
                height: 109rpx;
                background-color: transparent;
                padding:0px;
                .img{
                    width: 100%;
                }
                .txt{
                    font-size:10px;
                    text-align: center;
                }
                }
                .contact-btn::after{ border: none;}
        }
</style>
