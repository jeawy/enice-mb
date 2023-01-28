<template> 
	<view  id="setting">
		<view class="content" >
			<view>You have finished building your own website. You have introduced your company and presented your products and services. You have added propositions and promos to catch your target audience's attention. You think you are doing everything' "right", but all your promotions have failed to produce growth in your new internet business.</view> 
		</view>  
		<view class="contact">
			<image class="img"   src="/static/img/notice1.png"  mode=""></image>
			<view class="txt">
				<view class="name">Contact Us</view>
                <view class="name">Email: cooperation@enice.au.com</view>
                <view class="name">Phone: 02 9832 9213</view> 
			</view>
		</view>
		<view>
		   <image class="lineimg"   src="/static/img/line.png"  mode=""></image>
	    </view>
		<view class="contact contact2">
			<image class="img"   src="/static/img/notice1.png"  mode=""></image>
			<view class="txt">
				<view class="title">Contract</view>
                <view class="remark">You have finished building your own website. You have introduced your company and presented your products and services.</view>
			</view>
		</view>
		<image class="lineimg"   src="/static/img/line.png"  mode=""></image>

		<view class="contact contact2">
			<image class="img"   src="/static/img/notice3.png"  mode=""></image>
			<view class="txt">
				<view class="title">Customize</view>
                <view class="remark">You have finished building your own website. You have introduced your company and presented your products and services.</view>
               
			</view>
		</view>
		<image class="lineimg"   src="/static/img/line.png"  mode=""></image> 
        <view class="contact contact2">
			<image class="img"   src="/static/img/notice1.png"  mode=""></image>
			<view class="txt">
				<view class="title">Operation</view>
                <view class="remark">You have finished building your own website. You have introduced your company and presented your products and services.</view>
               
			</view>
		</view> 
	</view> 
	 
</template>

<script>  
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	export default {
		data() {
			return {
				thumbnail_portait: '',
				url:'',
				Image:[],
				portait:'',
				clickImage:false,
				ios: true,
				phone:""
			};
		},
		computed: {
			UserInfo() {
				return this.$mStore.state.UserInfo
			}
		},  
		components: {
			uniIcon,
		},
		methods: { 
			   
			target(url) {
				uni.navigateTo({
					url
				})
			}, 
		}, 
	};
</script>

<style lang="scss" scoped> 
	#setting {
		background: #FFFFFF;
		width:750rpx;
		color:#666666; 
		padding:25rpx 50rpx;   
		.contact{
			display: flex;
			margin-top: 50rpx;
			
			.txt{
				.name{
					margin-top: 10rpx;
					
				}
				.title{
					font-size: 18px;
                    color:#000000;
				}
			}
			.remark{
				width: 420rpx;
			}
		}
		.contact2{
			margin-top: 15rpx;
		}
		.img {
				width: 200rpx;
				height: 200rpx;
				margin-right: 25rpx;
		}
	 
		.lineimg{
			margin-left: 100rpx;
			width: 5rpx;
			height: 200rpx;
		}
	}
</style>
