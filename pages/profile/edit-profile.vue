<template>
	<view class="edit-profile">
		<view class="edit-profile__header">
			<view class="profile__header__title">
				<uni-icons @tap="goBack" color="#fff" type="back" size="16"></uni-icons>
				Quinn Zuo
				<button @tap="Save">Save</button>
			</view>
			<view class="profile-wrap">
				<image class="profile-img" src="../../static/img/logo.png" mode=""></image>
				<uni-icons type="camera-filled" size="24"></uni-icons>
			</view>
		</view>


		<view class="info-list">
			<view class="info-list__item">
				Name
				<view class="list__right">
					<input v-model="form.name" type="text">
					<uni-icons type="forward" size="18" color="#666"></uni-icons>
				</view>
			</view>
			<view class="info-list__item" @tap="setGender">
				Gender
				<view class="list__right">
					{{form.gender}}
					<uni-icons type="forward" size="18" color="#666"></uni-icons>
				</view>
			</view>
			<view class="info-list__item">
				Birth Day
				<view class="list__right">
					<uni-datetime-picker class="adddate" :clear-icon="false" type="date" placeholder="Add" v-model="form.birthDay"
						:border="false" />
					<uni-icons type="forward" size="18" color="#666"></uni-icons>
				</view>
			</view>
			<view class="info-list__item">
				Location
				<view class="list__right">
					Sydney
					<uni-icons type="forward" size="18" color="#666"></uni-icons>
				</view>
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


			.profile-wrap {
				position: absolute;
				width: 168upx;
				height: 168upx;
				border-radius: 50%;
				border: 8upx solid #fff;
				bottom: -84upx;
				left: 50%;
				transform: translateX(-50%);


				.profile-img {
					width: 100%;
					height: 100%;
					object-fit: fill;
					border-radius: 50%;
				}

				.uni-icons {
					position: absolute;
					right: -6upx;
					bottom: -6upx;
					width: 32px;
					height: 32px;
					background-color: #fff;
					z-index: 2;
					color: #000;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 50%;
				}


			}

			.profile__header__title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 20px;

				.uni-icons {
					flex: 0 0 80upx;
					display: inline-flex;
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
					text-align: center;
				}
			}

			position: relative;
			height: 300upx;
			background:url('/static/img/profile/bg.png') #fff no-repeat;
			background-size: 100% 100%;
			padding-top: calc(var(--status-bar-height) + 40upx);
			color: #fff;
			margin-bottom:104upx;

		}


		.info-list {
			padding: 0 40upx;

			.info-list__item {
				padding: 40upx 0 34upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #666666;
				font-size: 28upx;
				line-height: 40upx;
				border-bottom: 2upx solid #CCCCCC;

				.list__right {
					display: flex;
					align-items: center;
					justify-content: flex-end;

					.uni-date {
						::v-deep {
							.uni-date-single,.uni-date__x-input{
								padding: 0;
							}
							.uni-icons.uniui-calendar {
								display: none;
							}
							.input-placeholder{
								color: #CCC;
								text-align: right;
							}
							.uni-input-input{
								color: red;
								text-align: right;
							}
						}
					}

					uni-input {
						height: 40upx;
						line-height: 40upx;
						color: #666;
						text-align: right;
					}
				}
			}
		}
	}
</style>
