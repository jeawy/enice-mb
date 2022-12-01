<template>
	<view class="page">
		<view class="feedback-title">
			<text>回复办理情况</text>
			<text class="feedback-quick" @tap="chooseMsg">快速键入</text>
		</view>
		<view class="feedback-body">
			<textarea
				placeholder="回复办理情况..."
				v-model="sendDate.result"
				class="feedback-textare"
			/>
		</view>
		<view class="feedback-title">
			<text>图片(选填,提供完成时的现场图片,总大小10M以下)</text>
		</view>
		<view class="feedback-body feedback-uploader">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">点击预览图片</view>
					<view class="uni-uploader-info">{{ imageList.length }}/9</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image, index) in imageList" :key="index">
							<view class="uni-uploader__file" style="position: relative">
								<image
									class="uni-uploader__img"
									:src="image"
									@tap="previewImage"
								></image>
								<view class="close-view" @click="close(index)">x</view>
							</view>
						</block>
						<view class="uni-uploader__input-box" v-show="imageList.length < 9">
							<view class="uni-uploader__input" @tap="chooseImg"></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<button type="primary" class="feedback-submit" @tap="send">提交</button>
	</view>
</template>

<script>
import { ApiPostRepair, ApiLookRepair } from '@/api/repair.js'

export default {
	data() {
		return {
			msgContents: ['已完成维修'],
			imageList: [],
			sendDate: {
				method: 'put',
				result: '',
				communityuuid: '',
				uuid: '',
				status:1,//已完成
				manage:1,
			},
		}
	},
	onShow() {
		this.sendDate.communityuuid = uni.getStorageSync('communityuuid')
		this.queryDetail()
	},
	onLoad({ uuid }) {
		this.sendDate.uuid = uuid
	},
	methods: {
		queryDetail() {
			ApiLookRepair({
				uuid: this.sendDate.uuid,
				communityuuid: this.sendDate.communityuuid,
			}).then(({ msg, status }) => {
				if (status != 0) return
			})
		},
		close(e) {
			debugger
			this.imageList.splice(e, 1)
		},
		chooseMsg() {
			//快速输入
			uni.showActionSheet({
				itemList: this.msgContents,
				success: res => {
					this.sendDate.result = this.msgContents[res.tapIndex]
				},
			})
		},
		chooseImg() {
			//选择图片
			uni.chooseImage({
				sourceType: ['camera', 'album'],
				sizeType: 'compressed',
				count: 9 - this.imageList.length,
				success: res => {
					this.imageList = this.imageList.concat(res.tempFilePaths)
					debugger
				},
			})
		},
		previewImage() {
			//预览图片
			uni.previewImage({
				urls: this.imageList,
			})
		},
		send() {
			//发送反馈
			// let that = this

			uni.showLoading({
				mask: true,
				title: '请稍后...',
			})

			ApiPostRepair(this.sendDate)
				.then(data => {
					if (data.status !== 0) {
						//
						uni.showToast({
							icon:'error',
							title: data.msg,
						}) 
					}
					else{
						uni.showToast({
							title: '提交成功',
						}) 
					}
					
					if (!this.imageList.length) return
					const token =
						this.$mStore.state.accessToken || uni.getStorageSync('accessToken')

					const imgs = this.imageList.map((value, index) => {
						return {
							name: 'image' + index,
							uri: value,
						}
					})
					const uploadImages = imgs.map(ele => {
						return uni.uploadFile({
							url: this.$mStore.state.BaseUrl + 'api/prorepair/prorepair/',
							filePath: ele.uri,
							name: ele.name,
							header: {
								'Content-Type': 'multipart/form-data',
								Authorization: token,
							},
							formData: {
								uuid: this.sendDate.uuid,
								method: 'put',
								communityuuid: this.sendDate.communityuuid,
							},
						})
					})
					return Promise.allSettled(uploadImages)
				})
				.then(ress => {
					ress.forEach(element => {
						if (element.status === 'fulfilled') {
							element.value.forEach(el => {
								if (el.statusCode === 413) {
									uni.showToast({
										title: '图片太大.',
									})
								} else {
									console.log(res)
								}
							})
						} else {
							element.value.forEach(el => {
								uni.showToast({
									title: '失败',
									icon: 'none',
								})
								console.log(res)
							})
						}
					})
				})
				.finally(uni.hideLoading)
		},
	},
	beforeDestroy() {
		uni.hideLoading()
	},
	onNavigationBarButtonTap(val) {
		if (val.index == 0) {
			uni.navigateTo({
				url: '../repair/list',
			})
		}
	},
}
</script>

<style>
page {
	background-color: #efeff4;
}
view {
	font-size: 28upx;
}
.input-view {
	font-size: 28upx;
}
.close-view {
	text-align: center;
	line-height: 14px;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: #ff5053;
	color: #ffffff;
	position: absolute;
	top: -6px;
	right: -4px;
	font-size: 12px;
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
	color: #b2b2b2;
}
.uni-uploader-body {
	margin-top: 16upx;
}
.uni-uploader__files {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.uni-uploader__file {
	margin: 10upx;
	width: 210upx;
	height: 210upx;
}
.uni-uploader__img {
	display: block;
	width: 210upx;
	height: 210upx;
}
.uni-uploader__input-box {
	position: relative;
	margin: 10upx;
	width: 208upx;
	height: 208upx;
	border: 2upx solid #d9d9d9;
}
.uni-uploader__input-box:before,
.uni-uploader__input-box:after {
	content: ' ';
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	background-color: #d9d9d9;
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

/*问题反馈*/
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 20upx;
	color: #8f8f94;
	font-size: 28upx;
}
.feedback-star-view.feedback-title {
	justify-content: flex-start;
	margin: 0;
}
.feedback-quick {
	position: relative;
	padding-right: 40upx;
}
.feedback-quick:after {
	font-family: uniicons;
	font-size: 40upx;
	content: '\e581';
	position: absolute;
	right: 0;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.feedback-body {
	background: #fff;
}
.feedback-textare {
	height: 200upx;
	font-size: 34upx;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx 30upx 0;
}
.feedback-input {
	font-size: 34upx;
	height: 50upx;
	min-height: 50upx;
}
.feedback-uploader {
	padding: 22upx 20upx;
}

.feedback-submit {
	background-color: #df5000 !important;
	color: #ffffff;
	margin: 20upx;
}
.clearLog {
	background-color: #5052ce !important;
	color: #ffffff;
	margin: 20upx;
}
</style>
