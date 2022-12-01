<template>
  <view class="page">
    <view class="feedback-title">
      <text>待办标题</text>
    </view>
    <view class="feedback-body">
      <input
        class="feedback-input"
        v-model="sendData.title"
        placeholder="待办标题"
      />
    </view>
    <view class="feedback-title">
      <text>待办事项内容</text> 
    </view>
    <view class="feedback-body">
      <textarea
        placeholder="可以详细描述待办内容..."
        v-model="sendData.detail"
        class="feedback-textare"
      />
    </view>  
    <button type="primary" class="feedback-submit" @tap="send">提交</button>
  </view>
</template>

<script> 
import { ApiPostBacklogs } from "@/api/backlog.js";
export default {
  data() {
    return { 
      imageList: [],
      log: "",
      cid: "",
      showAddImage:true,
      sendData: {
        score: 3,
        content: "",
        contact: "",
        communityuuid: "",
      },
    };
  },
  onLoad() {
    this.sendData.communityuuid = uni.getStorageSync("communityuuid");
    this.log = uni.getStorageSync("log");
    // #ifdef APP-PLUS
    this.cid = plus.push.getClientInfo().clientid;
    let deviceInfo = {
      appid: plus.runtime.appid,
      imei: plus.device.imei, //设备标识
      p: plus.os.name === "Android" ? "a" : "i", //平台类型，i表示iOS平台，a表示Android平台。
      md: plus.device.model, //设备型号
      app_version: plus.runtime.version,
      plus_version: plus.runtime.innerVersion, //基座版本号
      os: plus.os.version,
      net: "" + plus.networkinfo.getCurrentType(),
    };
    this.sendData = Object.assign(deviceInfo, this.sendData);
    // #endif
  },
  methods: { 
    send() {
      //发送 
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      }); 
      ApiPostBacklogs(this.sendData)
        .then((data) => {
          uni.hideLoading();
          if (data.status === 0) { 
            uni.showToast({
              title: "提交成功!",
            });
             
            uni.hideLoading();
            this.$mRouter.push({
              route:"/pages/backlog/list" 
            })
          }
        })
        .catch(function (err) {
          console.log(err);
          uni.hideLoading();
        });
    },
  },
  beforeDestroy() {
    uni.hideLoading();
  },
  onNavigationBarButtonTap(val) {
    if (val.index == 0) {
      uni.navigateTo({
        url: "../backlog/list",
      });
    }
  },
};
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
  content: " ";
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
  content: "\e581";
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
  height: 700upx;
  font-size: 34upx;
  line-height: 50upx;
  width: 100%;
  box-sizing: border-box;
  padding: 20upx 30upx 0;
}
.feedback-input {
  font-size: 34upx;
  height: 70upx;
  min-height: 70upx;
  padding-left:15rpx;
}
.feedback-uploader {
  padding: 22upx 20upx;
}

.feedback-submit {
  background-color: #df5000 !important;
  color: #ffffff;
  margin: 20upx;
} 
</style>
