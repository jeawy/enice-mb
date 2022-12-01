<template>
  <view class="feedbackbox">
    <view
      :class="score !== '' ? 'content-box' : 'active'"
      v-if="content !== ''"
    >
      <view class="content">{{ content }}</view>
    </view>
    <view class="box">
      <view class="contact">{{ contact }}</view>
    </view>
    <view class="v-time">
      <view class="time">{{ date | time }}</view> 
      <view class="status">【{{ status | feedbackformat }}】</view>
    </view>
    <view
      :class="result !== null ? 'picturebox' : 'picture_active'"
      v-if="request_img_list.length !== 0"
    >
      <view v-for="(item, index) in request_img_list" :key="index">
        <image
          :src="imgurl + item.filepath"
          class="picture"
          mode="aspectFill"
          @tap="previewImage(index)"
        />
      </view>
    </view>
    <view v-if="result !== null" class="result">
      <view class="content">处理结果：{{ result }}</view>
    </view>

    <view class="star">
      <span>评价：</span>
      <uni-rate v-model="score" :value="score" />
    </view>
    <textarea
      placeholder="对维修服务进行评价..."
      v-model="estimate"
      class="feedback-textare"
    />
    <button class="publish-btn" @tap="publishEstimate">
      发布<image :src="baseAppUrl + `record/publish-white.png`" />
    </button>
  </view>
</template>

<script>
import { ApiLookRepair, ApiPutRepair } from "@/api/repair.js";
export default {
  data() {
    return {
      uuid: "",
      communityuuid: "",
      content: "",
      status: "",
      estimate: "",
      date: "",
      score: "",
      contact: "",
      request_img_list: [],
      imgurl: "",
      result: "",
      Image: [],
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
    };
  },
  onShow() {
    this.communityuuid = uni.getStorageSync("communityuuid");
    this.getdetail();
  },
  onLoad: function (option) {
    this.imgurl = this.$mStore.state.BaseUrl + "images/"; 
    this.uuid = option.uuid;
  },
  methods: {
    getdetail() { 
      let param = {
        uuid: this.uuid,
        communityuuid: this.communityuuid,
      };
      ApiLookRepair(param).then((data) => {
        if (data.status == 0) {
          this.content = data.msg.content;
          this.status = data.msg.status;
          this.date = data.msg.date;
          this.score = data.msg.score;
          this.contact = data.msg.contact;
          this.request_img_list = data.msg.request_img_list;
          this.result = data.msg.result;
          this.estimate = data.msg.estimate;
        }
      });
    },
    publishEstimate() {
      let feeddata = {
        method: "put",
        uuid: this.uuid,
        score: this.score,
        estimate: this.estimate,
        communityuuid: this.communityuuid,
      };
      ApiPutRepair(feeddata).then((data) => {
        if (data.status == 0) {
          uni.showToast({
            icon: "success",
            title: data.msg,
            duration: 3000,
          });
        } else {
          uni.showToast({
            icon: "error",
            title: data.msg,
            duration: 3000,
          });
        }
      });
    },
    previewImage(e) {
      this.Image = []; 
      for(let i = 0; i < this.request_img_list.length; i ++){
        let image = this.imgurl + this.request_img_list[i].filepath;
        this.Image.push(image); 
      } 
      uni.previewImage({
        current: this.Image[e],
        urls: this.Image,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.star {
  margin-top: 15rpx;
}
.feedbackbox {
  position: relative;
  padding: 30rpx;
  background-color: white;
  min-height: 1000rpx;
}

.contact {
  position: relative;
  color: #8c8c8c;
  font-size: 25rpx;
}
.status {
  color: #8c8c8c;
}
.v-time {
  border-top: 2px solid $base-color;
  display: flex;
}
.time {
  color: #8c8c8c;
  text-align: left;
}
.box {
  position: relative;
  display: flex;
  top: 30rpx;
}
.content-box {
  width: 100%;
}
.active {
  position: relative;
  padding: 20rpx 0rpx;
  width: 100%;
}
.content {
  white-space: normal;
  max-width: 100%;
}
.picturebox {
  display: flex;
  margin-top: 25rpx;
  flex-wrap: wrap;
}
.picture_active {
  display: flex;
  margin-top: 25rpx;
  flex-wrap: wrap;
}
.feedback-textare {
  height: 200upx;
  font-size: 34upx;
  line-height: 50upx;
  width: 100%;
  box-sizing: border-box;
  padding: 20upx 30upx 0;
  border: 1px solid #dbdbdb;
}
.picture {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-right: 20rpx;
}
.result {
  position: relative;
  padding: 20rpx;
  width: 100%;
}

.publish-btn {
  margin-top: 20rpx;
  display: flex;
  padding: 0 260rpx;
  background-color: $base-color;
  color: $color-white;
}
.publish-btn image {
  height: 60rpx;
  width: 60rpx;
  margin-top: 10rpx;
}
</style>
