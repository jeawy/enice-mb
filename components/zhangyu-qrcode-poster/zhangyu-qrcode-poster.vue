<template>
	<view class="wxcontent" v-if="isShow" @click.stop="isShow=false">
		<canvas @click.stop="" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="my-canvas"></canvas>
		<view class="save-btn" @click.stop="saveImage">保存图片</view>
	</view>
</template>

<script>
	import permision from "@/components/js_sdk/wa-permission/permission.js"
	export default{
		props:{
			headerImg:{
				type: String,
				default: 'xiaoxia.png'
			} 
		},
		data(){
			return {
				baseAppUrl:this.$mStore.state.BaseAppStaticUrl,
				wxImg:'weixin.png',
				htImg:'icons/zhuce.png',
				canvasW: 0,
				canvasH: 0,
				ctx: null,
				isShow: false,
				qrcode: ''
			}
		},
		methods:{ 
			//显示
			showCanvas(qrcode){
				this.isShow = true
				this.qrcode = qrcode
				this.__init()
			},
			//初始化画布
			async __init(){ 
				uni.showLoading({
				    title: '加载中...',
					mask: true
				})  
			    let _this = this
				this.ctx = uni.createCanvasContext('my-canvas',this)
				this.canvasW = uni.upx2px(600); 
				this.canvasH = uni.upx2px(960); 
				//设置画布背景透明
				this.ctx.setFillStyle('rgba(255, 255, 255, 0)')
				//设置画布大小
				this.ctx.fillRect(0,0,this.canvasW,this.canvasH)
				//绘制圆角背景
				this.drawRoundRect(this.ctx, 0, 0, this.canvasW, this.canvasH,uni.upx2px(18),'#FFFFFF')
				//获取标题图片 
				let hW = uni.upx2px(500);
				let hH = uni.upx2px(500);
				//绘制标题图 
				// #ifdef APP-PLUS
				uni.downloadFile({
					url: this.headerImg,
					success: (res) => {
						if (res.statusCode === 200) {
							console.log('下载成功');
						} 
						_this.drawRoundImg(_this.ctx, res.tempFilePath,((_this.canvasW-hW) / 2),
						   ((_this.canvasW-hW) / 2),hW,hH,uni.upx2px(16))
							 
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.getImageInfo({
					src: this.headerImg,
					success: function (image) { 
						let imagepath =   image.path  
						_this.drawRoundImg(_this.ctx, imagepath,((_this.canvasW-hW) / 2),
						((_this.canvasW-hW) / 2),hW,hH,uni.upx2px(16))
					},
					fail: function (err) {
						console.log(err)
					},   
				});
				// #endif 
				//绘制微信或者社区互通APP
				this.ctx.setFontSize(18);
				this.ctx.setFillStyle('#8a8a8a');
				this.ctx.fillText('微信或者社区互通APP', uni.upx2px(120), hH  + uni.upx2px(90) )
				this.ctx.setFontSize(20);
				this.ctx.setFillStyle('#ff8000');
				this.ctx.fillText('扫一扫进行登记', uni.upx2px(150), hH  + uni.upx2px(150) )
				 
				//绘制虚线
				this.drawDashLine(this.ctx,uni.upx2px(20),(((this.canvasW-hW) / 2) + hH + uni.upx2px(160)),(this.canvasW-uni.upx2px(20)),(((this.canvasW-hW) / 2) + hH + uni.upx2px(160)),5)
				//左边实心圆
				this.drawEmptyRound(this.ctx,0,(((this.canvasW-hW) / 2) + hH + uni.upx2px(160)),uni.upx2px(20))
				//右边实心圆
				this.drawEmptyRound(this.ctx,this.canvasW,(((this.canvasW-hW) / 2) + hH + uni.upx2px(160)),uni.upx2px(20))
				 

				let timeout = 300
				// #ifdef APP-PLUS
				timeout = 2000 // APP端网络加载较慢
				// #endif
				//微信 
				// #ifdef APP-PLUS
				uni.downloadFile({
					url: this.baseAppUrl+this.wxImg,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('下载成功');
							}
							 
							_this.ctx.drawImage(res.tempFilePath,
							   (((_this.canvasW-hW) / 2)+ uni.upx2px(40)),
							   (((_this.canvasW-hW) / 2) + hH + uni.upx2px(190)),
							   uni.upx2px(140),
							   uni.upx2px(140))
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.getImageInfo({
					src: this.baseAppUrl+this.wxImg,
					success: function (image) { 
						let imagepath = image.path  
						_this.ctx.drawImage(imagepath,
							   (((_this.canvasW-hW) / 2)+ uni.upx2px(40)),
							   (((_this.canvasW-hW) / 2) + hH + uni.upx2px(190)),
							   uni.upx2px(140),
							   uni.upx2px(140))
					},
					fail: function (err) {
						console.log(err)
					},   
				});
				// #endif 
				  
				//APP logo
			    // #ifdef APP-PLUS
				uni.downloadFile({
					url: this.baseAppUrl+this.htImg,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log('下载成功');
							} 
							_this.ctx.drawImage(res.tempFilePath,
							   (((_this.canvasW-hW) / 2)+ uni.upx2px(320)),
							   (((_this.canvasW-hW) / 2) + hH + uni.upx2px(190)),
							   uni.upx2px(140),
							   uni.upx2px(140))
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.getImageInfo({
				           src: this.baseAppUrl+this.htImg,
				           success: function (image) {   
							   _this.ctx.drawImage(image.path,
							   (((_this.canvasW-hW) / 2)+ uni.upx2px(320)),
							   (((_this.canvasW-hW) / 2) + hH + uni.upx2px(190)),
							   uni.upx2px(140),
							   uni.upx2px(140))
							   
				           }
				});
				// #endif
				 
				this.ctx.setFontSize(14);
				this.ctx.setFillStyle('#8a8a8a');
				this.ctx.fillText('微信扫一扫', (((this.canvasW-hW) / 2)+ uni.upx2px(35)),
				(((this.canvasW-hW) / 2) + hH + uni.upx2px(380)) )
				
				this.ctx.setFontSize(14);
				this.ctx.setFillStyle('#8a8a8a');
				this.ctx.fillText('社区互通APP', (((this.canvasW-hW) / 2)+ uni.upx2px(310)),
				(((this.canvasW-hW) / 2) + hH + uni.upx2px(380)) )
				 
				//延迟渲染
				setTimeout(()=>{
					this.ctx.draw(true,()=>{
						uni.hideLoading()
					})
				},timeout)
			},
			//绘制实心圆
			drawEmptyRound(ctx,x,y,radius){
				ctx.save()
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 2 * Math.PI,true);
				ctx.setFillStyle('rgba(0, 0, 0, .35)') 
				ctx.setLineWidth(5)
				ctx.fill(); 
				ctx.restore()
				ctx.closePath()
			},
			//绘制虚线
			drawDashLine(ctx,x1,y1,x2,y2,dashLength){
				ctx.setStrokeStyle("#cccccc")//设置线条的颜色
				ctx.setLineWidth(1)//设置线条宽度
				var dashLen = dashLength,
				xpos = x2 - x1, //得到横向的宽度;
				ypos = y2 - y1, //得到纵向的高度;
				numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen); 
				//利用正切获取斜边的长度除以虚线长度，得到要分为多少段;
				for(var i=0; i<numDashes; i++){
				 if(i % 2 === 0){
					 ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i); 
					 //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
				  }else{
					  ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
				  }
				}
				ctx.stroke();
			},
			//带圆角图片
			drawRoundImg(ctx, img, x, y, width, height, radius){ 
				ctx.save() 
				ctx.drawImage(img, x, y, width, height); 
			},
			//圆角矩形
			drawRoundRect(ctx, x, y, width, height, radius, color){
				ctx.save();
				ctx.beginPath();
				ctx.setFillStyle(color); 
				ctx.setStrokeStyle(color)
				ctx.setLineJoin('round');  //交点设置成圆角
				ctx.setLineWidth(radius);
				ctx.strokeRect(x + radius/2 , y + radius/2, width - radius , height - radius );
				ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2);
				ctx.stroke();
				ctx.closePath();
			},
			//获取图片 
			async requestAndroidPermission(permisionID) {
			    var result = await permision.requestAndroidPermission(permisionID)
			    var strStatus
			    if (result != 1) { 
			        strStatus = "未获得授权"
					uni.showModal({
						title: '权限不足',
						content: '没有访问相册权限，现在设置？',
						confirmText: '设置',
						confirmColor: '#FD5000',
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppPermissionSetting()
							} 	 
						}
					});
			    }   
			},
			//保存图片到相册
			saveImage(){
				//判断用户授权
				let _this = this
				 // #ifdef APP-PLUS
				 uni.getSystemInfo({
				     success: function (res) { 
				         if (res.platform.toUpperCase() == 'IOS')
						 { 
							 let permphoto = permision.judgeIosPermission("photoLibrary")
							 if(!permphoto){
							 	//提示权限设置
								uni.showModal({
									title: '权限不足',
									content: '没有访问相册权限，现在设置？',
									confirmText: '设置',
									confirmColor: '#FD5000',
									success: function(res) {
										if (res.confirm) {
											permision.gotoAppPermissionSetting()
										} 	 
									}
								});
								
							 }
						 } 
						 else{
							 // 安卓
							 _this.requestAndroidPermission("android.permission.WRITE_EXTERNAL_STORAGE") 
						 }
				     }
				 });
				
				// #endif
				
				// #ifdef MP-WEIXIN
				uni.getSetting({
				   success(res) { 
					  if(Object.keys(res.authSetting).length>0){
						  //判断是否有相册权限
						  if(res.authSetting['scope.writePhotosAlbum']==undefined){
							  //打开设置权限
							  uni.openSetting({
							    success(res) {
							      console.log('设置权限',res.authSetting)
							    }
							  })
						  }else{
							  if(!res.authSetting['scope.writePhotosAlbum']){
								  //打开设置权限
								  uni.openSetting({
								    success(res) {
								      console.log('设置权限',res.authSetting)
								    }
								  })
							  }
						  }
					  }else{
						  return
					  }
				   }
				})
				// #endif 
				var that = this
				uni.canvasToTempFilePath({
					canvasId: 'my-canvas',
					quality: 1,
					complete: (res) => { 
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(res) {
								uni.showToast({
									title: '已保存到相册',
									icon: 'success',
									duration: 3000
								})
								setTimeout(()=>{
									that.isShow = false
								},2000)
							},
							fail: function(res) {
							  // 在H5平台下，tempFilePath 为 base64
							  console.log(res )
							} ,
						})
					}
				},this);
			}
		}
	}
</script>

<style scoped lang="scss">
.wxcontent{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0; 
	background: rgba(0,0,0,.4);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	.save-btn{
		margin-top: 35rpx;
		color: #FFFFFF;
		background-color: #ff8000;
		padding: 15rpx 40rpx;
		border-radius: 50rpx;
	}
}
</style>
