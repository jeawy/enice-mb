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
    <view v-if="score !== ''" class="star">
      <uni-rate :readonly="true" :value="score" />
    </view>

    <view
      :class="result !== null ? 'picturebox' : 'picture_active'"
      v-if="images.length !== 0"
    >
      <view v-for="(item, index) in images" :key="index">
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
  </view>
</template>

<script>
import { ApiLookFeedback, ApiPutFeedback } from "@/api/feedback.js";
export default {
  data() {
    return {
      id: "",
      content: "",
      status: "",
      date: "",
      score: "",
      contact: "",
      images: [],
      imgurl: "",
      result: "",
      Image: [],
    };
  },
  onLoad: function (option) {
    this.imgurl = this.$mStore.state.BaseUrl + "images/";
    console.log(option.id);
    this.id = option.id;
    this.getdetail();
  },
  methods: {
    getdetail() {
      let param = {
        id: this.id,
      };
      ApiLookFeedback(param).then((data) => {
        if (data.status == 0) {
          this.content = data.msg.content;
          this.status = data.msg.status;
          this.date = data.msg.date;
          this.score = data.msg.score;
          this.contact = data.msg.contact;
          this.images = data.msg.images;
          this.result = data.msg.result;
        }
      });
      let feeddata = {
        method: "put",
        ids: this.id,
        read: 1,
      };
      ApiPutFeedback(feeddata).then(({ data }) => {
        if (data.status == 0) {
          console.log(data);
        }
      });
    },
    previewImage(e) {
      this.Image = []; 
      for(let i = 0; i < this.images.length; i ++){
        let image = this.imgurl + this.images[i].filepath;
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

<style scoped>
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
</style>
