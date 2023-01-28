<template>
  <view class="selectcommunitylist">
    <view class="sub-menu">
			<view class="custom-segmented">
				<view class="custom-segmented-item" v-for="(item,idx) of items" :key="idx"
					@click="onSegmentedChange(idx)">
					{{item}}
					<view class="underline" v-if="current===idx"></view>
				</view>
			</view>
		</view>
    <uni-search-bar :radius="30" bgColor="#FAFAFA" cancelButton="none" clearButton="none"
				placeholder="Search people..."></uni-search-bar>
    <view class="follows">
      <view class="panel-following" v-if="current===0">
        <view class="item" v-for="(item, index) in followings" :key="index">
          <image class="profileimg"   :src="item.img"  mode=""></image>
          <view class="names">
            <view class="name">{{item.name }}</view>
            <view class="remark">{{item.remark }}</view>
          </view>
          <view class="actions">
            <button class="default-btn following-btn"   >Following</button>
          </view>
        </view>
      </view>
      <view class="panel-following" v-if="current===1">
        <view class="item" v-for="(item, index) in followingers" :key="index">
          <image class="profileimg"   :src="item.img"  mode=""></image>
          <view class="names">
            <view class="name">{{item.name }}</view>
            <view class="remark">{{item.remark }}</view>
          </view>
          <view class="actions">
            <button class="default-btn following-btn"   >Friends</button>
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
      current: 0,
      followingers:[ 
        {
          img:"/static/img/profile/1.png",
          name:"Yekslea",
          remark:"Yekslea",
        },
        {
          img:"/static/img/profile/2.png",
          name:"Yekslea",
          remark:"Yekslea",
        },
        {
          img:"/static/img/profile/3.png",
          name:"Yekslea",
          remark:"kdjansdkl",
        }
      ],
      followings:[
        {
          img:"/static/img/logo.png",
          name:"Enice",
          remark:"Enice official account",
        },
        {
          img:"/static/img/logo.png",
          name:"Enice Au",
          remark:"Enice official account Australia",
        },
        {
          img:"/static/img/logo.png",
          name:"Enice NZ",
          remark:"Enice official account New...",
        },
        {
          img:"/static/img/profile/1.png",
          name:"Yekslea",
          remark:"Yekslea",
        },
        {
          img:"/static/img/profile/2.png",
          name:"Yekslea",
          remark:"Yekslea",
        },
        {
          img:"/static/img/profile/3.png",
          name:"Yekslea",
          remark:"kdjansdkl",
        }
      ],
      items: [ '32 Following', '106 Followers'],
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl, 
      hasLogin: false, 
    };
  },
  onShow() { 
    this.hasLogin = this.$mStore.getters.hasLogin;
   
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
  },
  methods: {
    onSegmentedChange(idx) {
				this.current = idx
			},
  },
};
</script>

<style lang="scss" scoped>
page {
		background-color: #fff;

	}

  .selectcommunitylist{
    background-color: white;
    border: 1px solid white;
    min-height: 1400rpx;
  }
  .item{
    display: flex;
    margin: 25rpx;
    .profileimg{
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      margin-right: 15rpx;
    }
    .names{
      width: 400rpx;
      .name{
        color: #333333;
        font-weight: 600;
        font-size: 16px;
 
      }
      .remark{
        color:#666666;
      }
    }
    .actions
    {
      padding-top:20rpx;
      .following-btn{
        
        font-size: 14px;
      }
    }
  }
   .sub-menu {
			display: flex;
			align-items: center;
			margin: 20upx auto 20upx;
			.custom-segmented {
				flex: 1;
				display: flex; 
				
				font-size: 24upx;
				color: #000;
        justify-content: space-between;
        text-align: center;
				
				.custom-segmented-item { 
					height: 36upx;
					position: relative;
          width: 360rpx;
          text-align: center;
					line-height: 36upx;
					font-weight: 500; 

					.underline {
						height: 8upx;
						width: 120rpx;
						border-radius: 4upx;
						background: linear-gradient(90deg, #91FFD4 0.77%, #87EBD5 57.12%, #9CFBF8 115.97%);
						margin-left: 120rpx;
					}
				}
			}
		}
</style>
