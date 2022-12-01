<template>
	<!-- 设置界面 -->
	<view id="setting">
		<view>
			<view class="settingList" @tap="target('/pages/user/privacy-agreement/privacy-agreement')">
				<view>隐私协议</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
			</view> 
			<view class="settingList" @tap="target('/pages/user/user-agreement/user-agreement')">
				<view>用户服务协议</view>
				<view>
					<uniIcon type="arrowright"></uniIcon>
				</view>
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

<style lang="scss">
	svg.open-btn.svg-icon {
	    width: 2em;
	    height: 2em;
	}
	#setting {
		.settingList {
			background-color: #FFFFFF;
			padding: 0 41.666rpx;
			height: 130rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #f5f9f7;

			&>view:nth-child(1) {
				display: flex;
				align-items: center;
			}

			&>view:nth-child(2) {
				color: #c8c8cc;
				display: flex;
				align-items: center;
			}
			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 10px;
				box-shadow: 1px 1px 2px #F2F2F2;
				border: 1.5px solid #F2F2F2;
				left:30%;
				position:relative;
			}
			.ico{
				color: #c8c8cc;
				display: flex;
				align-items: center;
			}
		}

		.settingList1 { 
			line-height: 118rpx;
			background-color: white;
			border-bottom: 1px solid #f5f9f7;
			text-align: center; 
			align-items: center;
			justify-content: center;
		}

		.uni-logout {
			background: #fff;

			 &>view{
				padding: 0 41.666rpx;
				height: 130rpx;
				border-bottom: 2.083rpx solid #c8c8cc;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
