<template>
	<view class="edit-profile">
		<view class="edit-profile__header">
			<view class="profile__header__title">
				<uni-icons @tap="goBack" color="#000000" type="back" size="16"></uni-icons>
				<image class="profile-img" src="/static/img/enice.png" mode=""></image>
				 
			</view> 
		</view> 
		<view class="content">
			<view class="title">Our Story</view>
			<view class="item">
				We had a chance to test the Atto3 over the course of a day, driving it for a few hours in Sydney's CBD and into the suburbs, so this review only serves as a first impression. Soon we'll have an Atto3 for a longer stretch and we’ll be able to get to know it better.

Still, this review covers everything you need to know about the Atto 3. From the prices and features, and the range you can travel on a full charge, to how long it takes to charge and where you can service it. Of course we’ll also give you our first impression on what it’s like to drive.

			</view>
			<image class="ecar-img" src="/static/img/home/ecar.png" mode=""></image>
			<view class="item">
				We had a chance to test the Atto3 over the course of a day, driving it for a few hours in Sydney's CBD and into the suburbs, so this review only serves as a first impression. Soon we'll have an Atto3 for a longer stretch and we’ll be able to get to know it better.

Still, this review covers everything you need to know about the Atto 3. From the prices and features, and the range you can travel on a full charge, to how long it takes to charge and where you can service it. Of course we’ll also give you our first impression on what it’s like to drive.

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					gender: 'Male',
					birthDay: "",
					name:"Suzi"
				}
			};
		},
		methods: {
			Save(){
				uni.showToast({
					icon:"success",
					title:"Saved!"
				})
			},
			goBack() {
				uni.navigateBack()
			},
			setGender() {

				const itemList = ['Male', 'Female']

				uni.showActionSheet({
					itemList,
					success: ({
						tapIndex
					}) => {
						this.form.gender = itemList[tapIndex]
					}
				})
			}
		}
	}
</script>
<style>
page{
    background:#FFFFFF;
}
</style>
<style lang="scss" scoped >
	// var(--status-bar-height)
	 
	.edit-profile {
		background-color: #fff;
		.edit-profile__header {  
			.profile__header__title {
				display: flex; 
				padding: 0 20px;
				.profile-img {
					width: 450rpx;
					height: 40rpx;
					margin-left: 80rpx;
					object-fit: fill; 
				} 

				uni-button {
					flex: 0 0 80upx;
					margin: 0;
					box-shadow: 0px 1px 2px rgba(38, 51, 49, 0.1);
					border-radius: 5px;
					padding: 0;
					height: 48upx;
					line-height: 48upx;
					font-weight: 500;
					font-size: 20upx;
					color:#000000;
					text-align: center;
				}
			}

			position: relative; 
			background-size: 100% 100%;
			padding-top: calc(var(--status-bar-height) + 40upx); 
		} 
		.content{
			margin: 25rpx;
			padding: 15rpx;
			background: #F3F3F3;
            border-radius: 5px;
			.title{
				font-size:  20px;
				font-weight: 700;
				margin: 25rpx 0;
			}
			.ecar-img{
				width: 100%;
			}
		}
	}
</style>
