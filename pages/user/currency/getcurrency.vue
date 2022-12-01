<template>
	<!--赚积分-->
	<view>
		<!--header-->
		<view class="tui-mybg-box">
			<image src="/static/image/mall/currency/dowork1.png" class="tui-my-bg"></image>
		</view>
		<view class="middle">
			<view class="middle-box">
				<view class="tui-cell-header">
					<view class="tui-cell-title">完成以下任务就会获得积分哦</view>
				</view>
				<scroll-view class="scroll-Y" scroll-y="true">
				<view class="middle-content">
					<view class="section" @tap="target1('/pages/track/main')">
						<image class="popimage" src="/static/image/mall/currency/opentrack.jpg"></image>
						<view class="section_middle">
							<view class="section_title">开启车迹</view>
							<view class="section_content">开启车迹可以获得1积分,车迹里程每超过10km可以获得5积分</view>
						</view>
						<view class="section_right">
							<tui-button type="red" shape="circle" :plain="true" size="mini">去完成</tui-button>
						</view>
					</view>
					<view class="section1" @tap="target('/pages/track/list')">
						<image class="popimage1" src="/static/image/mall/currency/sharetrack.png"></image>
						<view class="section_middle1">
							<view class="section_title">分享车迹</view>
							<view class="section_content">每分享一次可以获得10积分，每天可以享受一次机会</view>
						</view>
						<view class="section_right">
							<tui-button type="warning" shape="circle" :plain="true" size="mini">去完成</tui-button>
						</view>
					</view>
					<view class="section2" @tap="target('/pages/login/login-page')">
						<image class="popimage1" src="/static/image/mall/currency/login.png"></image>
						<view class="section_middle2">
							<view class="section_title">注册账户</view>
							<view class="section_content2">注册新账户可以获得50积分</view>
						</view>
						<view class="section_right">
							<tui-button type="danger" shape="circle" :plain="true" size="mini">去注册</tui-button>
						</view>
					</view>
					<view class="section3" @tap="target('/pages/user-center/invite/inviteJump')">
						<image class="popimage1" src="/static/image/mall/currency/sharefriends.png"></image>
						<view class="section_middle">
							<view class="section_title">一起赚积分</view>
							<view class="section_content">每邀请一位好友奖励50积分，被邀请者填写邀请码获得50积分</view>
						</view>
						<view class="section_right">
							<tui-button type="green" shape="circle" :plain="true" size="mini">去完成</tui-button>
						</view>
					</view>
					<view class="section4" @tap="target('/pages/uni-feedback/uni-feedback')">
						<image class="popimage1" src="/static/image/mall/currency/feedback.png"></image>
						<view class="section_middle3">
							<view class="section_title">提交建议</view>
							<view class="section_content">每次提交建议可以获得10积分，一天最多可以提交5次建议，被采纳还可以获得100分哦</view>
						</view>
						<view class="section_right">
							<tui-button type="white" shape="circle" :plain="true" size="mini">去完成</tui-button>
						</view>
					</view>
					<view class="section5" @tap="target1('/pages/track/main')">
						<image class="popimage1" src="/static/image/mall/currency/city.png"></image>
						<view class="section_middle4">
							<view class="section_title">解锁新城市</view>
							<view class="section_content">开启车迹去到新城市奖励10积分</view>
						</view>
						<view class="section_right">
							<tui-button type="primary" shape="circle" :plain="true" size="mini">去完成</tui-button>
						</view>
					</view>
				</view>
				</scroll-view>
			</view>
		</view>
		<!--footer-->
		<view class="footer">
			<image src="/static/image/mall/currency/dowork2.png" class="footer-center"></image>
		</view>
	</view>
</template>

<script>
	import tuiButton from "@/components/gift/btn"
	export default {
		data() {
			return {

			}
		},
		components: {
			tuiButton,
		},
		methods: {
			target(url) {
				uni.navigateTo({
					url
				})
			},
			target1(url) {
				uni.switchTab({
					url
				})
			},
		},
		onLoad() {

		},
	}
</script>

<style scoped>
	.tui-mybg-box {
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 100;
	}
	.tui-my-bg {
		width: 100%;
		display: block;
		height:650rpx;
	}
	.middle { 
		width: 100%;
		padding: 0 45rpx;
		box-sizing: border-box;
		position: relative;
		top: 280rpx;
		z-index: 200;
		margin-top: 20rpx;
	}

	.middle-box {
		width: 100%;
		background: #fff;
		box-shadow: 0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-cell-header {
		width: 100%;
		height: 100rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-cell-title {
		position: relative;
		margin:0 auto;
		border-bottom: 1px solid rgba(132, 134, 137, 0.3);
		padding-bottom: 10rpx;
	}
    .scroll-Y{
		height:810rpx;
	}
	.middle-content {
		padding: 10rpx 20rpx 20rpx 20rpx;
	}

	.section {
		padding: 25rpx 20rpx;
		background: #FD5000;
		box-shadow: 0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;
		white-space: nowrap;
		margin-bottom: 20rpx;
		height: 200rpx;
		position: relative;
	}

	.popimage {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		display: inline-block;
		top: 40rpx;
		position: absolute;
	}
	.popimage1 {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background:#fff;
		display: inline-block;
		top: 40rpx;
		position: absolute;
	}
	.section_middle {
		display: inline-block;
		left: 150rpx;
		position: relative;
		height: 180rpx;
		line-height: 35rpx;
		padding: 10rpx 0rpx;
	}
	.section_middle1 {
		display: inline-block;
		left: 150rpx;
		position: relative;
		height: 180rpx;
		line-height: 35rpx;
		padding: 28rpx 0rpx;
	}
	.section_middle2{
		display: inline-block;
		left: 150rpx;
		position: relative;
		height: 180rpx;
		line-height: 35rpx;
		padding: 40rpx 0rpx;
	}
	.section_middle3{
		display: inline-block;
		left: 150rpx;
		position: relative;
		height: 180rpx;
		line-height: 35rpx;
		top:-6rpx;
	}
	.section_middle4{
		display: inline-block;
		left: 150rpx;
		position: relative;
		height: 180rpx;
		line-height: 35rpx;
		padding: 30rpx 0rpx;
	}
	.section_title {
		color: #fff;
		font-size: 27rpx;
		position: relative;
	}
	.section_content {
		color: #fff;
		font-size: 25rpx;
		position: relative;
		white-space: normal;
		max-width: 300rpx;
	}
    .section_content2 {
    	color: #fff;
    	font-size: 25rpx;
    	position: relative;
    	top: 5rpx;
    	white-space: normal;
    	max-width:310rpx;
    }
	.section_right {
		display: inline-block;
		left: 480rpx;
		position: absolute;
		top: 80rpx;
	}

	.section1 {
		padding: 20rpx 20rpx;
		background: #589bad;
		box-shadow: 0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;
		white-space: nowrap;
		margin-bottom: 20rpx;
		height: 200rpx;
		position: relative;
	}

	.section2 {
		padding: 20rpx 20rpx;
		background: #fc833c;
		box-shadow: 0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;
		white-space: nowrap;
		margin-bottom: 20rpx;
		height: 200rpx;
		position: relative;
	}

	.section3 {
		padding: 22rpx 20rpx;
		background: #16b971;
		box-shadow: 0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;
		white-space: nowrap;
		margin-bottom: 20rpx;
		height: 200rpx;
		position: relative;
	}
	.section4 {
		padding: 22rpx 20rpx;
		background: #db639b;
		box-shadow: 0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;
		white-space: nowrap;
		margin-bottom: 20rpx;
		height: 200rpx;
		position: relative;
	}
	.section5{
		padding: 22rpx 20rpx;
		background: #3dbbd2;
		box-shadow: 0px 8rpx 17rpx 1rpx rgba(0, 0, 0, 0.1);
		border-radius: 15rpx;
		white-space: nowrap;
		margin-bottom: 20rpx;
		height: 200rpx;
		position: relative;
	}
	.footer{
		width: 100%;
		position: fixed;
		z-index: 100;
		bottom: 0;
		left: 0;
	}
	.footer-center{
		width: 100%;
		display: block;
		height:250rpx; 
	}
</style>
