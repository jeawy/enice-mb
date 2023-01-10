<template>
  <!-- 设置界面 -->
  <view>
    <view id="setting">
      <view class="password-form">
        <view>Mobile Number</view>
      </view>
      <view class="settingList">
        <view>
			<view class="phones" @tap="ShowList">
				<view class="selectedphone">
					<image class="img" :src="currentphone.img"></image>
					<view >+{{ currentphone.number }}</view>
					<uniIcon type="arrowdown"></uniIcon>
				</view>
				<view class="phoneslist" v-if="showlist" >
					<view class="phoneitem" @tap="selectphone(item.img, item.number)" v-for="(item, index) of phones" :key="index" >
						<image class="img" :src="item.img"></image>
						<view >+{{item.number }}</view>
				    </view>
				</view>
			</view>
          <input type="text" class="password default-input" v-model="phone" />
        </view>
        <view
          ><button class="verify-btn default-btn" @tap="Done">
            Verify
          </button></view
        >
      </view>
      <view class="password-form">
        <view>Vertification Code</view>
        <view>
          <input type="text" class="password default-input" v-model="code" />
        </view>
      </view>
    </view>
    <button class="done-btn default-btn" @tap="Done">Done</button>
  </view>
</template>

<script>
import uniIcon from "@/components/uni-icon/uni-icon.vue";
export default {
  data() {
    return {
      phone: "",
      code: "",
	  showlist:false,
	  currentphone:{
		img:"/static/img/guoqi.png",
		number:61
	  },
	  phones:[
		{
			img:"/static/img/zhongguo1.png",
			number:86,
		},
		{
			img:"/static/img/guoqi.png",
			number:61,
		},
	  ]
    };
  },
  components: {
    uniIcon,
  },
  methods: {
	selectphone(img , number){ 
		this.currentphone.img = img
		this.currentphone.number = number
		this.showlist = false
		
	},
	ShowList(){
		this.showlist = !this.showlist;
	},
    Done(url) {
		if(this.phone == ""){
			uni.showModal({
				content: "Please input phone number!",
				confirmText: "OK",
				showCancel: false,
				success: (confirmRes) => {
				 
				},
			});
			return
		}
		if(this.code == ""){
			uni.showModal({
				content: "Please input code!",
				confirmText: "OK",
				showCancel: false,
				success: (confirmRes) => {
				 
				},
			});
			return
		}
      uni.showModal({
        content: "Phone number has been changed!",
        confirmText: "Done",
        showCancel: false,
        success: (confirmRes) => {
          this.$mRouter.push({
            route: "/pages/entry/index",
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.verify-btn {
	font-size: 14px;
}
.done-btn {
  width: 700rpx;
  margin-left: 25rpx;
  margin-top: 50rpx;
  font-size: 20px;
  line-height: 90rpx;
  height: 90rpx;
  position: fixed;
  bottom: 120rpx;
  border-radius: 45rpx;
}
#setting {
  background: #ffffff;
  width: 700rpx;
  color: #666666;
  height: 700rpx;
  padding: 25rpx 50rpx;
  margin-top: 25rpx;
  margin-left: 25rpx;
  box-shadow: 0px 32px 64px rgba(217, 217, 217, 0.36);
  border-radius: 40rpx;
  .title {
    color: #000000;
    font-weight: 700;
  }
  .password-form {
    margin-top: 35rpx;
  }

  .settingList {
    background-color: #ffffff;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
	.phones{
		position:absolute;
		left: 25rpx;
	}
	.password{
		width: 450rpx;
		padding-left: 145rpx;
	}
	.selectedphone{
		display: flex; 
		padding: 10rpx;
		margin-left: 50rpx;
		z-index: 1000;
		.img{
				width: 40rpx;
				height: 40rpx;
				border-radius: 20rpx;
				margin-right: 15rpx;
			}
	}
	.phoneslist{
		position:absolute;
		left: 40rpx;
		width: 150rpx;
		padding: 10rpx;
		background-color: white;
		box-shadow: 0px 32px 64px rgba(217, 217, 217, 0.36);
		.phoneitem{
			display: flex;
			border-bottom: 1px solid $font-color-light; 
			padding: 10rpx; 
			.img{
				width: 40rpx;
				height: 40rpx;
				border-radius: 20rpx;
				margin-right: 15rpx;
			}

		}
	}
    & > view:nth-child(1) {
      display: flex;
      align-items: center;
    }

    & > view:nth-child(2) {
      color: #c8c8cc;
      display: flex;
      align-items: center;
    }
  }
}
</style>
