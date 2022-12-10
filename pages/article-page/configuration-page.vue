<template>
	<view class="article-page"> 
		 
		<view class="article"> 
			<image class="topimg" src="/static/img/home/volvo.png"  ></image> 
			<view class="content"> 
				<view class="features" v-for="(feature, index) of features" :key="index" >
					<view class="title">{{feature.title}}</view>
					<view class="items" v-for="(item, itemindex) of feature.items" :key="itemindex">
						<view class="item" >
							<view class="name">{{item.name}}</view> 
						</view>
						<view class="item" >
							<view class="value">{{item.value}}</view> 
						</view>
					</view>
				</view>
				
		    </view>
	    </view>  
	</view>
</template>

<script>
	export default {
		data() {
			return {   
				features:[
					{
						title:"Electronical",
						items:[
							{
								name:"Drive Type",
								value:"Auto"
							},
							{
								name:"Engine Voltage",
								value:"320V"
							},
							{
								name:"Normal Charge Voltage",
								value:"240V"
							},
							{
								name:"Quick Charge Time",
								value:"40min"
							},
						]
					},
					{
						title:"Engine",
						items:[
							{
								name:"Power to weight ratio",
								value:"204.4kW/t"
							},
							{
								name:"Acceleration 0-100km/h",
								value:"3.3s"
							},
							{
								name:"Maxium speed",
								value:"261"
							} 
						]
					},
					{
						title:"Transmissiion & Drivetrain",
						items:[
							{
								name:"Gears",
								value:"1"
							},
							{
								name:"Gear Type",
								value:"Reduction Gear"
							},
							{
								name:"Gear Location",
								value:"Column"
							},
							{
								name:"Drive",
								value:"All Wheel Drive"
							},
						]
					},
					{
						title:"Dimensions & Weights",
						items:[
							{
								name:"Length",
								value:"4694 mm"
							},
							{
								name:"Width",
								value:"1933 mm"
							},
							{
								name:"Height",
								value:"1443 mm"
							},
							{
								name:"Tare Mass",
								value:"1844 kg"
							},
						]
					},
					{
						title:"Other",
						items:[
							{
								name:"Badge",
								value:"Performance"
							},
							{
								name:"Doors",
								value:"4"
							},
							{
								name:"Seat Capacity",
								value:"5"
							} 
						]
					},
				]
			};
		},
		methods: { 
		   
			clickItem(e) {
				this.swiperDotIndex = e
			},
		}
	}
</script>

<style lang="scss" scoped>
	 

	.article-page {  
		background-color: #FFFFFF; 
	 
		.article{ 
			width: 750rpx;   
			.topimg{ 
					margin-top: 25rpx; 
					margin-left:25rpx;
					width:700rpx;
					height: 450rpx
			}
			.content{
				font-family: 'Montserrat';
				padding-bottom: 160rpx;
				.features{ 
				    padding:25rpx 25rpx;
					border-top: 1px solid #F3F3F3;
					.title{
						font-weight: 500;
						font-size: 18px;
						line-height: 20px; 
						color: #333333;
						margin-bottom: 15rpx;
					}
					.items{
						display: flex;
						justify-content: space-between;  
						font-weight: 400; 
						.item{
							display: block;
							padding:15rpx 0;
						}
						.name{
							font-weight: 400; 
							line-height: 16px;   
						} 
						.value{
							color: #999999;
						}
					}
					
				} 
			}
			
			
		}    
	}
</style>
