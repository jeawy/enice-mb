<template>
  <view class="main">
    <view class="feedbackbox">
      <view class="middle">
        <view>
          <view
            :class="
              aid.payed == 0 && aid.status == 1
                ? 'status statusdisabled'
                : 'status'
            "
            >{{ aid.status | statusFilter }}</view
          >
          <view class="title">{{ aid.title }}</view>
        </view>
      </view>
      <view class="second-title">
        <view class="time"
          >【{{ aid.communityname }}】{{ aid.user.username }} |
          {{ aid.date | time }}</view
        >
      </view>
      <view class="tags">
        <view class="" v-if="aid.end_date"
          >截止日期：{{ aid.end_date | date }}</view
        >
        <view class="" v-if="aid.need_propertior == 1"
          >限以下小区的认证业主：</view
        >
        <view class="tagitems-holders" v-if="aid.need_propertior == 1">
          <view
            class="tagitems"
            v-for="(communitieyitem, communitieyindex) in aid.communities"
            :key="communitieyindex"
          >
            {{ communitieyitem.community__name }}
          </view>
        </view>
      </view>
      <view class="v-money">
        <view class="money-holder">
          <view class="moneytxt">佣金:</view>
          <view class="money">{{ aid.money }}</view>
          <view class="moneytxt">元</view>
        </view>
      </view>
      <view class="content-box" v-if="aid.content !== ''">
        <view class="content">{{ aid.content }}</view>
      </view>
      <view
        :class="result !== null ? 'picturebox' : 'picture_active'"
        v-if="aid.images.length !== 0"
      >
        <view v-for="(item, index) in aid.images" :key="index">
          <image
            :src="imgurl + item.filepath"
            class="picture"
            mode="aspectFill"
            @tap="previewImage(index)"
          />
        </view>
      </view>

      <view class="secretinfo" v-if="showSecretInfo"
        >*机密信息：仅求助人和接单人可见(完成后删除).</view
      >
      <view class="secretinfo-content" v-if="showSecretInfo">{{
        aid.secretinfo
      }}</view>
      <image
        v-if="aid.status == 1 && aid.payed == 1 && aid.mode == 0"
        class="btnimage"
        :src="baseAppUrl + `baoming.png`"
        @tap="AcceptAid(aid.uuid)"
      ></image>
      <image
        v-if="aid.status == 1 && aid.payed == 1 && aid.mode == 1"
        class="btnimage"
        :src="baseAppUrl + `qiangdan.png`"
        @tap="AcceptAid(aid.uuid)"
      ></image>
      <!-- 接单人信息 -->
      <view class="tips" v-if="aid.status >= 3">
        <view class="title">
          <image :src="baseAppUrl + 'baomingbiao.png'" class="tishi" />
          <text>已接单:</text>
        </view>
        <view class="list">
          <image :src="baseUrl + aid.answer.image" class="headerimg" />
          <view class="info">
            <view class="line1">
              <text class="username">{{ aid.answer.username }}</text>
            </view>
            <view class="line2" v-if="aid.answer.extra">
              <text class="times"
                >接单次数:{{ aid.answer.extra.servicetimes }}</text
              >
              <text class="scpre"
                >评分:{{
                  aid.answer.extra.score > 0 ? aid.answer.extra.score : "暂无"
                }}</text
              >
            </view>
          </view>
          <view class="phone" @tap="orgPhone(aid.answer.phone)">
            <image :src="baseAppUrl + 'dianhua.png'" class="headerimg" />
          </view>
        </view>
      </view>
      <!-- 报名信息 -->
      <view class="tips" v-if="aid.entries.length > 0">
        <view class="title">
          <image :src="baseAppUrl + 'baomingbiao.png'" class="tishi" />
          <text>报名表(已有{{ aid.entries.length }}报名):</text>
        </view>
        <view class="list" v-for="(item, index) in aid.entries" :key="index">
          <image
            :src="baseUrl + item.user__thumbnail_portait"
            class="headerimg"
          />
          <view class="info">
            <view class="line1">
              <text class="username">{{ item.user__username }}</text>
              <text class="times">接单次数:{{ item.service_times }}</text>
              <text class="scpre"
                >评分:{{ item.score > 0 ? item.score : "暂无" }}</text
              >
            </view>
            <view class="line2">
              <text class="communityname">{{ item.communityname }}</text>
              <text class="crt">{{
                item.communityname ? "认证业主" : ""
              }}</text>
            </view>
          </view>
          <view class="btn" @tap="EnrollSelect(item.id)">
            <text class="txt">选他</text>
          </view>
        </view>
      </view>
      <!-- 分享 -->
      <view class="share" @click="uniShare">
        <image class="shareimg" :src="baseAppUrl + `share1.png`"></image>
        <view class="sharetxt">分享</view>
      </view>
      <uni-popup ref="popupshare" class="popupshare" type="top">
        <view class="popupshare-holder">
          <view class="fillmsg">
            <image :src="baseAppUrl + `fxjt.png`" class="fxjt"></image>
            <view class="txt">点击这里进行分享</view>
          </view>

          <image
            :src="baseAppUrl + `wzdl.png`"
            @tap="closeshare"
            class="wzdl"
          />
        </view>
      </uni-popup>
      <view class="tips" v-if="aid.status == 1">
        <view class="title">
          <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
          <text>温馨提示:</text>
        </view>
        <view class="appraisetxt">接单的两个方式:</view>
        <view class="appraisetxt">1、【抢单】先到先得，先抢到者为接单人</view>
        <view class="appraisetxt"
          >2、【报名】先报名，由求助人自己选择接单人</view
        >
      </view>
    </view>
    <view class="comment-main" v-if="aid.status > 2">
      <view class="comment-detail" v-if="aid.status == 4 || aid.status == 5">
        <view class="comment-title">
          <image :src="baseAppUrl + 'woshou1.png'" class="woshou" />
          <view class="txt">求助已完成</view>
        </view>
        <view class="time"
          >{{ aid.answer.username }}
          {{ aid.comment.finish_date | time }}完成了该求助</view
        >
        <view class="comment-content"> {{ aid.comment.content }} </view>
        <view
          :class="result !== null ? 'picturebox' : 'picture_active'"
          v-if="aid.commentimages.length !== 0"
        >
          <view v-for="(item, index) in aid.commentimages" :key="index">
            <image
              :src="imgurl + item.filepath"
              class="picture"
              mode="aspectFill"
              @tap="previewImageCommentDetail(index)"
            />
          </view>
        </view>
        <view class="star">
          <span v-if="(aid.status == 4 && isNeedHelper) || aid.status == 5"
            >服务评价</span
          >
          <view class="score">
            <uni-rate
              v-model="score"
              class="rate"
              :readonly="true"
              :value="aid.comment.score"
              v-if="aid.status == 5"
            />
            <view
              v-if="aid.status == 4 && isNeedHelper"
              @tap="openPop"
              class="btn-appraise"
              >发表评价</view
            >
          </view>
        </view>
        <uni-popup ref="popup" type="bottom">
          <view class="popup-holder">
            <image :src="baseAppUrl + `close.png`" class="close" @tap="close" />
            <view class="v-title"><text class="pop-title">服务评价</text></view>
            <view class="fill">
              <view class="appraisetxt"
                >请对{{ aid.answer.username }}的服务进行评价</view
              >
              <view class="v-rate">
                <rf-rate
                  :size="20"
                  :value="score"
                  @change="handleScoreChange"
                  class="rate"
                  active-color="#FF8000"
              /></view>
            </view>
            <button class="btn-add-new" @tap="appraise">提交评价</button>
            <view class="tips">
              <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
              <view class="appraisetxt">客观评价构筑良性互助社区</view>
            </view>
          </view>
        </uni-popup>
      </view>

      <view class="comment" v-if="aid.status == 3 && hasLogin && isAnswer"
        ><!--登录、状态为已接单,并且是接单本人 -->
        <view class="feedback-body">
          <textarea
            placeholder="完成情况说明..."
            v-model="comment"
            class="feedback-textare"
          />
        </view>
        <view class="feedback-title">
          <text>相关图片(选填,总大小10M以下)</text>
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
                      @tap="previewImageComment"
                    ></image>
                    <view class="close-view" @click="close(index)">x</view>
                  </view>
                </block>
                <view
                  class="uni-uploader__input-box"
                  v-show="showAddImage"
                >
                  <view class="uni-uploader__input" @tap="chooseImg"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="confirm">
          <checkbox-group @change="checkboxChange">
            <label :class="error ? 'uni-error checkbox' : 'checkbox'">
              <checkbox
                value="1"
                color="#FF8000"
                style="transform: scale(0.7)"
              />我已完成该求助单.
            </label>
          </checkbox-group>
        </view>
        <button type="primary" class="feedback-submit" @tap="sendComment">
          提交完成结果
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import store from "@/store";
import rfRate from "@/components/rf-rate/rf-rate";
import { getAnonymousAids, updateAid } from "@/api/aid.js";
import { getCrtApi } from "@/api/crt.js";
// #ifdef  APP-PLUS
import UniShare from "uni_modules/uni-share/js_sdk/uni-share.js";
const uniShare = new UniShare();
//#endif
export default {
  components: {
    rfRate,
  },
  data() {
    return {
      aid: {
        user: {},
        images: [],
        entries: [],
      },
      cb: "",
      comment: "",
      score: 1,
      imageList: [],
      showSecretInfo: false, //是否展示机密信息
      hasLogin: this.$mStore.getters.hasLogin,
      uuid: "",
      status: "",
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      imgurl: "",
      result: "",
      showAddImage:true,
      Image: [],
      checked: [],
      isAnswer: false, //当前用户是否是接单人
      isNeedHelper: false, //当前用户是否是求助人
      error: false,
      useruuid: "",
      pagepath:""
    };
  },
  filters: {
    statusFilter(status) {
      let statustxt = "未知状态";
      if (status == 0) {
        statustxt = "暂存";
      } else if (status == 1) {
        statustxt = "等待接单";
      } else if (status == 2) {
        statustxt = "已关闭";
      } else if (status == 3) {
        statustxt = "已接单 ";
      } else if (status == 4) {
        statustxt = "已完成";
      } else if (status == 5) {
        statustxt = "已评价";
      }

      return statustxt;
    },
  },
  onBackPress({ from }) {
    if (from == "backbutton") {
      this.$nextTick(function () {
        console.log(uniShare);
        uniShare.hide();
      });
      return uniShare.isShow;
    }
    uni.redirectTo({
      url: "/pages/aid/index",
    });
    return true;
  },
  onShareAppMessage() {
    return {
      title: "【有偿求助】" + this.aid.title,
      desc: this.content,
      path: this.pagepath,
    };
  },
  onLoad: function (option) {
    this.imgurl = this.$mStore.state.BaseUrl + "images/";
    this.uuid = option.uuid;
    this.getdetail();
    if (this.hasLogin) {
      let userInfo = uni.getStorageSync("userInfo");
      this.useruuid = userInfo.uuid; // 当前用户的uuid
    } else {
      this.showSecretInfo = false;
    }
    this.pagepath = `/pages/aid/detail?uuid=${this.uuid}`
  },
  methods: {
    handleScoreChange(e) {
      this.score = e.value;
    },
    openPop() {
      this.$refs.popup.open("top");
    },
    EnrollSelect(selectuuid) {
      uni.showModal({
        content: "选他做为接单人？此操作无法取消",
        confirmText: "确定",
        success: (e) => {
          if (e.confirm) {
            let data = {
              enrolluuid: selectuuid,
              uuid: this.uuid,
              method: "put",
            };
            updateAid(data).then((res) => {
              if (res.status == 0) {
                uni.showToast({
                  icon: "success",
                  title: "操作成功",
                });
                this.getdetail();
              } else {
                uni.showToast({
                  icon: "error",
                  title: res.msg,
                });
              }
            });
          }
        },
      });
    },
    orgPhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
      });
    },
    appraise() {
      // 评价c
      console.log(this.uuid);
      let data = {
        score: this.score,
        uuid: this.uuid,
        method: "put",
      };
      updateAid(data).then((res) => {
        if (res.status == 0) {
          console.log(res);
          uni.showToast({
            icon: "success",
            title: "评价成功",
          });
          this.getdetail();
          this.$refs.popup.close();
        } else {
          uni.showToast({
            icon: "error",
            title: res.msg,
          });
        }
      });
    },
    checkboxChange: function (e) {
      this.checked = e.detail.value;
      this.error = false;
    },
    sendComment() {
      if (this.checked.length == 0) {
        uni.showToast({
          icon: "error",
          title: "请勾选红色部分",
        });
        this.error = true;
        return;
      }
      let data = {
        uuid: this.uuid,
        finish: 1,
        comment: this.comment,
        method: "put",
      };
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      updateAid(data)
        .then((res) => {
          let icon = "error";
          if (res.status == 0) {
            let imgs = [];
            if (this.imageList.length > 0) {
              this.imageList.forEach((value, index) => {
                imgs = imgs.concat({
                  name: "image" + index,
                  uri: value,
                });
              });
            }
            let token =
              store.state.accessToken || uni.getStorageSync("accessToken");
            imgs.forEach((ele) => {
              uni.uploadFile({
                url: this.$mStore.state.BaseUrl + "api/aid/aid/",
                filePath: ele.uri,
                name: ele.name,
                header: {
                  "Content-Type": "multipart/form-data",
                  Authorization: token,
                  // 'content-type': 'application/json'
                },
                formData: { uuid: this.uuid, method: "put", finish: 1 },
                success: (res) => {},
                fail: (res) => {
                  uni.showToast({
                    title: "失败",
                    icon: "none",
                  });
                  console.log(res);
                },
              });
            });
            icon = "success";
          }
          uni.showToast({
            icon: icon,
            title: res.msg,
          });
        })
        .finally((res) => {
          uni.hideLoading();
          this.getdetail();
        });
    },
    chooseImg() {
      //选择图片
      uni.chooseImage({
        sourceType: ["camera", "album"],
        sizeType: "compressed",
        count: 9 - this.imageList.length,
        success: (res) => {
          this.imageList = this.imageList.concat(res.tempFilePaths);
          if (this.imageList.length >= 9 ){
              this.showAddImage = false
            }
        },
      });
    },
    AcceptAid() {
      // 报名或抢单
      if (!this.hasLogin) {
        this.$mHelper.backToLogin(true);
        return;
      }
      uni.showLoading({
        mask: true,
        title: "请稍后",
      });
      let data = {
        uuid: this.uuid,
        bill: 1,
        method: "put",
      };
      updateAid(data)
        .then((updateres) => {
          let icon = "error";
          if (updateres.status == 0) {
            icon = "success";
            uni.showToast({
              icon: icon,
              title: updateres.msg,
            });
          } else if (updateres.status == 2) {
            // 不是指定小区的业主，无法接单
            this.appshare(updateres.msg);
          }
        })
        .finally((updateres) => {
          uni.hideLoading();
        });
    },
    appshare(msg) {
      uni.showModal({
        content: msg + ",分享给认证业主？",
        confirmText: "分享",
        success: (e) => {
          if (e.confirm) {
            this.uniShare();
          }
        },
      });
    },

    uniShare() {
      // #ifdef  MP-WEIXIN
      // 微信小程序分享提示，微信小程序无法直接调用api
      this.$refs.popupshare.open("top");
      // #endif
      // #ifdef  APP-PLUS
      
      let href = this.$mStore.state.BaseShareUrl+"?entity_type=12&"+"entity_uuid="+this.uuid
      uniShare.show(
        {
          content: {
            //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
            type: 0,
            href: href,
            title: "【有偿求助】" + this.aid.title,
            summary: this.aid.title,
            imageUrl: this.baseAppUrl + "22sm.png", //  logo大小不能超过32kb，否则不会显示
          },
          menus: [
            {
              img: this.baseAppUrl + "app-plus/sharemenu/wechatfriend.png",
              text: "微信好友",
              share: {
                provider: 'weixin',
                scene: "WXSceneSession",
                type: 5, 
                title: "【有偿求助】" + this.aid.title,
                summary: this.aid.title,
                imageUrl:  this.baseAppUrl + "22sm.png", 
                miniProgram: {
                    id: this.$mStore.state.WX_XIAOCHENGXU_ID,
                    path: this.pagepath,
                    type: 0,
                    webUrl: href
                },
                success: ret => {
                    console.log(JSON.stringify(ret));
                }
              },
            },
            {
              img: this.baseAppUrl + "app-plus/sharemenu/wechatmoments.png",
              text: "微信朋友圈",
              share: {
                provider: "weixin",
                scene: "WXSceneTimeline",
              },
            },
            {
              img: this.baseAppUrl + "app-plus/sharemenu/copyurl.png",
              text: "复制",
              share: "copyurl",
            },
            {
              img: this.baseAppUrl + "app-plus/sharemenu/more.png",
              text: "更多",
              share: "shareSystem",
            },
          ],
          cancelText: "取消分享",
        },
        (e) => {
          //callback
          console.log(uniShare.isShow);
          console.log(e);
        }
      ); 
      //#endif
    },
    getdetail() {
      let param = {
        uuid: this.uuid,
      };
      getAnonymousAids(param).then((data) => {
        console.log(data);
        let _that = this;
        if (data.status == 0) {
          this.aid = data.msg;
          if (this.hasLogin) {
            if (this.useruuid == this.aid.user.uuid) {
              this.isNeedHelper = true; // 是求助人本人
            }
            if (this.useruuid == this.aid.answer.uuid) {
              this.isAnswer = true; // 是接单人
            }
            if (
              this.aid.status == 3 &&
              this.aid.secretinfo != "" &&
              this.isAnswer
            ) {
              // 状态为已接单，机密信息不为空，并且是求助人或者接单人，才展示机密信息
              this.showSecretInfo = true;
            } else {
              this.showSecretInfo = false;
            }
            if (this.aid.status <= 3 && this.isNeedHelper) {
              // 求助人，求助单处于完成前的状态时，都可见
              this.showSecretInfo = true;
            }
            if (this.aid.stutus == 4 && isNeedHelper) {
              setTimeout(() => {
                // 5秒之后自动弹出评价窗口
                _that.$refs.popup.open("top");
              }, 5000);
            }
          }
        }
      });
    },
    previewImageComment(e) {
      this.Image = [];
      for (let i = 0; i < this.imageList.length; i++) {
        let image = this.imageList[i];
        this.Image.push(image);
      }
      uni.previewImage({
        current: this.Image[e],
        urls: this.Image,
      });
    },
    previewImageCommentDetail(e) {
      this.Image = [];
      for (let i = 0; i < this.aid.commentimages.length; i++) {
        let image = this.imgurl + this.aid.commentimages[i].filepath;
        this.Image.push(image);
      }
      uni.previewImage({
        current: this.Image[e],
        urls: this.Image,
      });
    },
    close() {
      this.$refs.popup.close();
      if (this.imageList.length < 9 ){
          this.showAddImage = true
        }
    },
    closeshare() {
      this.$refs.popupshare.close();
    },
    previewImage(e) {
      this.Image = [];
      for (let i = 0; i < this.aid.images.length; i++) {
        let image = this.imgurl + this.aid.images[i].filepath;
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

<style lang="scss" src="./detail.scss" scoped>
</style>
