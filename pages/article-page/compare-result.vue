<!-- 搜索结果页 Enice -->
<template>
	<view class="search-reasult">
		
		<tab-btns :tabs="btnsData" :active.sync="activeKey"></tab-btns>
		<template v-if="activeKey===0">
			<view class="notes-content">
				 <view class="items items1">
					<switch checked color="#cccccc" style="transform:scale(1)"/>
					<view class="txt">Hide Same</view>
				 </view>
				 <view class="items items2">
					<image class="topimg" src="/static/img/home/s1.png"  ></image> 
					<view class="title">Volvo EC200</view>
					<view class="params">235kW Comfort</view>
				 </view>
				 <view class="items items3">
					<image class="topimg" src="/static/img/home/s2.png"  ></image> 
					<view class="title">Volvo EX350 </view>
					<view class="params">350kW</view>
				 </view>
			</view>
			<view class="table" v-for="(item, index) of features" :key="index">
                 <view class="title">
					{{item.title}}
				 </view>
				 <view class="content" v-for="(contentitem, itemsindex) of item.items" :key="itemsindex"   >
					<view class="content-title" >{{contentitem.name}}</view>
					<view class="content-values" v-for="(contentvalue, valueindex) of contentitem.value" :key="valueindex">
						{{contentvalue}}
					</view>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="  notes-content-overall"> 
				 <view class="items items2">
					<image class="topimg" src="/static/img/home/s1.png"  ></image> 
					<view class="title">Volvo EC200</view>
					<view class="params">235kW Comfort</view>
				 </view>
				 <view class="items items3">
					<image class="topimg" src="/static/img/home/s2.png"  ></image> 
					<view class="title">Volvo EX350 </view>
					<view class="params">350kW</view>
				 </view>
			</view>
			<image class="overallimg" src="/static/img/home/overall.png"  ></image> 
		</template>
	</view>
</template>

<script>  
	export default {
		components:{ 
		},
		data() {
			return {
				defaultShowSwitch:false,
				activeKey: 0,
				btnsData: [{
						label: "Configuration",
						icon: "",
					},
					{
						label: "Overall",
						icon: "",
					}
				] ,
				features:[
					{
						title:"General",
						items:[
							{
								name:"price",
								value:["83000", "123000"],
								same:false
							},
							{
								name:"range",
								value:["600km", "550km"],
								same:false
							},
							{
								name:"Charge Time",
								value:["60min", "45min"],
								same:false
							},
							{
								name:"Transmission",
								value:["Auto", "Auto"],
								same:true
							},
							{
								name:"Drive",
								value:["Four Wheel Drive", "Four Wheel Drive"],
								same:true
							},
							{
								name:"Feul Type",
								value:["Electric", "Electric"],
								same:true
							},
							{
								name:"Body Type",
								value:["SUV", "Sedan"],
								same:false
							} 
						]
					},
					{
						title:"Dimmesion",
						items:[
							{
								name:"height",
								value:["1833mm", "1975mm"],
								same:false
							},
							{
								name:"width",
								value:["1933mm", "1953mm"],
								same:false
							},
							{
								name:"Length",
								value:["1743mm", "1433mm"],
								same:false
							},
							{
								name:"Tare Mass",
								value:["1960kg", "1844kg"],
								same:false
							},
							{
								name:"Track Front",
								value:["1580mm", "1680mm"],
								same:false
							},
							{
								name:"Feul Type",
								value:["Electric", "Electric"],
								same:true
							},
							{
								name:"Track Gear",
								value:["1580mm", "1680mm"],
								same:false
							} 
						]
					} 
				]
			}
		},
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #FFFFFF;
	}
	.search-reasult {
		background-color: #FFFFFF;
		.notes-content { 
            background: #FFFFFF;
			box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
			border-radius: 20px;
			display: flex;
			justify-content: space-between;
			text-align: center;
			height: 240rpx;
			margin-left: 25rpx;
			margin-right: 25rpx;
			.items{
				width:220rpx;
				padding-top: 40rpx;
			}
			.items1{
				background-color: #FAFAFA;
                border-radius: 18px;
				width:200rpx;
				padding-top: 80rpx;
			}
			.items2{
				border-right:  1px solid #F3F3F3;
			}
			.title, .txt, .params{ 
				font-family: 'Montserrat';
				font-style: normal;
				font-weight: 400;
				font-size: 10px;
				line-height: 16px;
				/* or 160% */

				text-align: center;

				color: #333333;
			}
			.topimg{
				width:88rpx;
				height: 88rpx;
			}
		}
		.overallimg{
			margin-top: 25rpx;
				width:100%;
				height: 1200rpx;
			}
		.notes-content-overall{
			background: #FFFFFF;
			  
			display: flex;
			justify-content: space-between;
			text-align: center; 
			margin-left: 25rpx;
			margin-right: 25rpx;
			border-top: 1px solid #F3F3F3;
			border-bottom: 1px solid #F3F3F3;
			
			.items2, .items3{
				width:350rpx;
			}
			.items2{
				border-right:  1px solid #F3F3F3;
			}
			.title, .txt, .params{ 
				font-family: 'Montserrat';
				font-style: normal;
				font-weight: 400;
				font-size: 10px;
				line-height: 16px;
				/* or 160% */

				text-align: center;

				color: #333333;
			}
			.topimg{
				width:148rpx;
				height:148rpx;
			}
		}
		 
		.table{
			font-family: 'Montserrat';
			font-style: normal;
			font-weight: 500; 
			text-align: center;
			letter-spacing: -0.03em;
            padding: 25rpx 0;
			color: #000000;
			.title{
				font-weight: 500;
				text-align: left; 
				padding-top:0; 
				padding-bottom:25rpx; 
			}
			.content{
				display: flex;
				justify-content: space-between;
				
				.content-title{
					padding-top:25rpx;
					border: 0.5px solid #F3F3F3;
					width: 250rpx;
					font-weight: 400;
					background-color: #F9F9F9
				}
				.content-values{
					padding-top:25rpx;
					width: 250rpx;
					font-weight: 400;
					text-align: center;
					border:0.5px solid #F3F3F3;
				}
				height:  90rpx;
			}
		}


	}
</style>
