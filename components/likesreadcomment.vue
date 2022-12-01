<template>
  <!-- 阅读量、赞、评论 -->
  <view class="vmain">
    <view class="vtitle">
      <view
        >阅读<text>{{ count | number }}次</text></view
      >
      <view class="right">
        <view class="like" @tap="updateLike"
          >赞({{ likes.length | number }})</view
        >
        <view class="comment" v-if="allowcomment" @tap="openPopup"
          >{{commenttxt}}({{ totalcomments | number }})</view
        >
      </view>
    </view>
    <view class="likes" v-if="likes.length > 0">
      <view class="tags">
        <image class="zanimg" :src="baseAppUrl + `zan.png`"></image>
        <view class="zantxt">赞</view>
      </view>
      <view class="holder">
        <view class="likeitem" v-for="(item, index) in likes" :key="index">
          <image class="likeimg" :src="item.image"></image>
          <view class="username">{{ item.user__username?item.user__username:item.user__phone }}</view>
        </view>
      </view>
    </view>
    <view class="comments" v-if="totalcomments > 0 && allowcomment">
      <view class="tags">
        <image class="zanimg" :src="baseAppUrl + `pinlun.png`"></image>
        <view class="zantxt">{{commenttxt}}</view>
      </view>
      <view class="holder">
        <view
          class="commentitem"
          v-for="(item, index) in comments"
          :key="index"
        >
          <view class="commentimg">
            <image class="userimg" :src="item.image"></image>
          </view>
          <view class="comment-content">
            <view class="line1">
              <view class="username">
                <text class="name">{{ item.user.username?item.user.username:item.user.phone }}</text>
                <text v-if="item.parent" class="txt">回复</text>
                <text v-if="item.parent" class="username parent">{{
                  item.parent
                }}</text>
              </view>
              <view class="date">{{ item.date | time }}</view>
            </view>
            <view class="line2">
              <view class="content">{{ item.content }}</view>
              <view class="topimageholder" v-if="item.newimages.length !== 0">
                <view
                  v-for="(imgitem, imgindex) in item.newimages"
                  :key="imgindex"
                >
                  <image
                    :src="imgitem"
                    class="picture"
                    mode="aspectFill"
                    @tap="previewCommentImage(item.newimages, imgindex)"
                  />
                </view>
              </view>
              <view class="actions">
                <view class="actionsholder">
                  <view
                    class="reply"
                    @tap="reply(item.uuid, item.user.username?item.user.username:item.user.phone)"
                    >回复</view
                  >
                  <view
                    class="delete"
                    v-if="deleteall || item.delete"
                    @tap="deleteComment(item.uuid, index)"
                    >删除</view
                  >
                </view>
              </view>
            </view>
          </view> </view
        ><!-- end comments -->
        <view v-if="more" class="getmore" @tap="getmoreComments"
          >点击加载更多...</view
        >
        <!--加载loadding-->
        <tui-loadmore :visible="loadding" :index="2"></tui-loadmore>
        <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
      </view>
    </view>
    <s-popup custom-class="popupCommunity" ref="popupCommunity" type="top">
      <view class="addcomment">
        <!-- 添加评论 -->
        <view class="comment-body">
          <textarea
            :placeholder="placeholder"
            v-model="content"
            class="comment-textare"
          />
        </view>
        <view class="comment-title">
          <text>图片(选填,总大小10M以下)</text>
        </view>
        <view class="comment-body comment-uploader">
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
                <view class="uni-uploader__input-box" v-show="showAddImage">
                  <view class="uni-uploader__input" @tap="chooseImg"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <button type="primary" class="comment-submit" @tap="send">提交</button>
        <view class="tips">
          <view class="title">
            <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
            <text>温馨提示:</text>
          </view>
          <view class="appraisetxt">构建和谐社区生活，请有爱{{commenttxt}}:</view>
          <view class="appraisetxt">1、遵守国家和当地相关法律</view>
          <view class="appraisetxt"
            >2、不得污蔑、诋毁、辱骂他人或者地域，一经发现立即禁言</view
          >
        </view>
      </view>
    </s-popup>
  </view>
</template> 
<script>
import {
		memberInfo,memberUpdate
	} from '@/api/userInfo'; 
import { updateLikeApi, getLikesApi, getCountApi } from "@/api/like"; 
import { addCommentApi, getCommentsApi, deleteCommentApi } from "@/api/comment";
import sPopup from "@/components/s-popup/index.vue";
import tuiLoadmore from "@/components/gift/loadmore";
import tuiNomore from "@/components/gift/nomore";
export default {
  props: { 
   entityuuid: {
		  type: String,
		  default: function () {
		  	return  ""
		  }
	 },
    allowcomment: {// 是否支持评论
		  type: String,
		  default: function () {
		  	return  ""
		  }
	 },
   entitytype: {
		  type: String,
		  default: function () {
		  	return  ""
		  }
	 },
   baseUrl: {
		  type: String,
		  default: function () {
		  	return  ""
		  }
	 },
   baseAppUrl: {
		  type: String,
		  default: function () {
		  	return  ""
		  }
	 },

     owneruuid: {// 点赞或者评论是否是自己的
		  type: String,
		  default: function () {
		  	return  ""
		  }
	 },
    orguuid: {
		  type: String,
		  default: function () {
		  	return  ""
		  }
	 },

    commenttxt: {
		  type: String,
		  default: function () {
		  	return  "评论"
		  }
	 },
  },
  components: {
    sPopup,
    tuiLoadmore,
    tuiNomore,
  },
  data() {
    return { 
      page: 1,
      showAddImage: true,
      pagenum: 5,
      more: false,
      nomore: false,
      loadding: false,
      count: 1, //阅读数
      likes: [],
      imageList: [],
      content: "",
      comments: [],
      url:"",
      totalcomments: 0,
      placeholder: "评论...",
      hasLogin: this.$mStore.getters.hasLogin,
      pid: "", // 回复评论的id ,
      deleteall: false, //删除所有评论的权限
      myuuid: "", //当前用户自己的uuid
    };
  }, 
  watch: {
    entityuuid() {
      this.getCount();
      this.getLikes();
    },
	allowcomment( ){ 
		if (this.allowcomment) {
		  this.getComments();
		}
	}
  },
  mounted() {
    this.initData(); 
    this.getCount();
    this.getLikes();
    if (this.allowcomment) { 
      this.getComments();
    } 
  },
  computed: {
			UserInfo() {
        console.log(this.$mStore.state.userInfo)
				return this.$mStore.state.userInfo
			},
  },
  methods: {
    getmoreComments() {
      this.loadding = true;
      this.page = this.page + 1;
      this.getComments();
    },
    initData() {
      if (this.hasLogin) {
        this.url = this.$mHelper.getCurrentPageUrl() 
        let userinfo = this.UserInfo;
        this.myuuid = userinfo.uuid;
        if (userinfo.superuser) {
          //超级用户可以删除所有的
          this.deleteall = true;
        } else if (this.owneruuid == this.myuuid) {
          //发布人可以删除所有的，
          this.deleteall = true;
        } else {
          this.deleteall = false;
        }
        if(this.commenttxt == null){
          this.commenttxt = "评论"
        }
      }
    },
    deleteComment(uuid, index) {
      // 删除评论，可以删除自己的，发布人可以删除所有的，超级用户可以删除所有的
      let _this = this;
      uni.showModal({
        title: "",
        content: "确定要删除该"+this.commenttxt+"吗？",
        confirmText: "删除",
        confirmColor: "#FD5000",
        success: function (res) {
          if (res.confirm) {
            let data = {
              method: "delete",
              uuid: uuid,
            };
            deleteCommentApi(data).then((deleteres) => {
              if (deleteres.status == 0) {
                uni.showToast({
                  icon: "success",
                  title: deleteres.msg,
                });
                _this.page = 1;
                _this.getComments();
              }
            });
          } else if (res.cancel) { 
          }
        },
      });
    },
    openPopup() {
      if (this.hasLogin == false) {
        //  如果未登录，提示登录
        this.$mHelper.backToLogin();
        return;
      }
      //弹出选择小区
      this.placeholder = this.commenttxt+"...";
      this.pid = "";
      this.$refs.popupCommunity.show("top");
    },
    reply(pid, username) {
      if (this.hasLogin == false) {
        //  如果未登录，提示登录
        this.$mHelper.backToLogin();
        return;
      }
      this.placeholder = "回复:" + username;
      this.pid = pid;
      this.$refs.popupCommunity.show("top");
    },
    getComments() {
      // 获得评论列表
      this.nomore = false;
      this.more = false;
      let params = {
        entity_uuid: this.entityuuid,
        entity_type: this.entitytype,
        page: this.page,
        pagenum: this.pagenum,
      };
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });

      getCommentsApi(params)
        .then((res) => { 
          if (res.status == 0) {
            let newlist = res.msg.list;
            this.totalcomments = res.msg.total; 
            newlist.forEach((item) => {
              if (item.user.thumbnail_portait == null || item.user.thumbnail_portait == "") {
                item.image = this.baseAppUrl + `icons/zhuce.png`;
              } else {
                item.image = this.baseUrl + "/" + item.user.thumbnail_portait;
              }
              item.newimages = []; 
              item.images.forEach((imgitem) => {
                item.newimages.push(this.baseUrl + imgitem[0]);
              });
              item.delete = false;
              if (this.deleteall == false) {
                if (this.myuuid == item.user.uuid) {
                  // 删除自己的
                  item.delete = true;
                }
              }
            });
            if (this.totalcomments > 0) {
              if (newlist.length < this.pagenum) {
                this.nomore = true;
              } else {
                this.more = true;
              }
            }
            if (this.page == 1) {
              this.comments = [...newlist];
            } else {
              this.comments = this.comments.concat([...newlist]);
            }
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
            });
          }
        })
        .finally((res) => {
          this.loadding = false;
          uni.hideLoading();
        });
    },
    send() {
      //提交评论
      if (!this.hasLogin) {
        // 提示登录
        this.$mHelper.backToLogin();
        return;
      }
      let imgs;
      if (this.imageList.length > 0) {
        imgs = this.imageList.map((value, index) => {
          return {
            name: "image" + index,
            uri: value,
          };
        });
      } else {
        imgs = [];
      }
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      let sendData = {
        entity_uuid: this.entityuuid,
        entity_type: this.entitytype,
        content: this.content,
        url:this.url
      }; 
      if (this.pid != "") { 
        sendData.puuid = this.pid;
      } 
      addCommentApi(sendData)
        .then((data) => { 
          if (data.status === 0) {
            if (imgs.length > 0) {
              let token =
                this.$mStore.state.accessToken ||
                uni.getStorageSync("accessToken"); 
              // 上传图片，微信小程序不支持批量上传
              imgs.forEach((ele) => {
                uni.uploadFile({
                  url: this.$mStore.state.BaseUrl + "api/comment/comment/",
                  filePath: ele.uri,
                  name: ele.name,
                  header: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token,
                  },
                  formData: { uuid: data.uuid, method: "put" },
                  success: (res) => { 
                  },
                  fail: (res) => {
                    uni.showToast({
                      title: "失败",
                      icon: "none",
                    }); 
                  },
                });
              });
            }
            uni.showToast({
              title: this.commenttxt+"成功!",
            });
            this.$refs.popupCommunity.hide();
            this.getUserProfile()
            setTimeout(() => {
              this.getComments();
            }, 2500);
            this.content = "";
            this.imageList = [];
            this.showAddImage = true; 
          }
        })
        .catch(function (err) {
          uni.hideLoading();
        });
    },
    getUserProfile(){
      // 获取微信头像及名称
       // #ifdef MP-WEIXIN 
				let _this = this
        if(_this.UserInfo.username == ''|| _this.UserInfo.username == null){
             
          uni.getUserProfile({
            desc:"Wexin",
            success: function(infoRes) {  
              _this.$http.post(`${memberUpdate}?uuid=${_this.UserInfo.uuid}`, {
              wxusername:infoRes.userInfo.nickName, 
              wximage:infoRes.userInfo.avatarUrl, 
              method : "put"
            }).then((r) =>{   
              setTimeout(() => {
                _this.$mStore.state.userInfo.username = infoRes.userInfo.nickName
                _this.$mStore.state.userInfo.thumbnail_portait = infoRes.userInfo.avatarUrl
                _this.getComments();
                _this.getLikes();
              }, 1500);
            }).catch((r) => {
              console.log(r) 
            });
            },fail:(res)=>{    
              console.log(res)  
            } 
          })
        }
        // #endif
			},
    addComment(content){
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      let sendData = {
        entity_uuid: this.entityuuid,
        entity_type: this.entitytype,
        content: content,
        url:this.url
      }; 
      console.log(sendData)
      addCommentApi(sendData)
        .then((data) => { 
          if (data.status === 0) { 
            uni.showToast({
              title: this.commenttxt+"成功!",
            }); 
            this.getUserProfile()
            setTimeout(() => {
              this.getComments(); 
            }, 2500);
            this.content = "";
            this.imageList = [];
            this.showAddImage = true; 
          }
        })
        .catch(function (err) {
          uni.hideLoading();
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
          if (this.imageList.length >= 9) {
            this.showAddImage = false;
          }
        },
      });
    },
    close(e) {
      this.imageList.splice(e, 1);
      if (this.imageList.length < 9) {
        this.showAddImage = true;
      }
    },
    previewCommentImage(imgs, index) {
      uni.previewImage({
        urls: imgs,
        current: imgs[index],
      });
    },
    previewImage() {
      //预览图片
      uni.previewImage({
        urls: this.imageList,
      });
    },
    updateLike() {
      if(this.hasLogin == false){
        this.$mHelper.backToLogin() 
      }
      else{
        // 点赞或者取消赞
        let currentpath = this.$mHelper.getCurrentPageUrl() 
        let data = {
          entity_uuid: this.entityuuid,
          entity_type: this.entitytype,
          orguuid: this.orguuid,
          url:currentpath
        };

        updateLikeApi(data).then((res) => { 
          if (res.status == 0) {
            this.likes = res.msg;
            this.getUserProfile()
            this.getLikes();
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
            });
          }
        });

      }
       
     
    },
    getLikes() {
      // 获得赞列表
      let params = {
        entity_uuid: this.entityuuid,
        entity_type: this.entitytype,
      };

      getLikesApi(params).then((res) => {
        if (res.status == 0) {
          this.likes = res.msg; 
          this.likes.forEach((item) => {
            if (item.user__thumbnail_portait == null || item.user__thumbnail_portait == "") {
              item.image = this.baseAppUrl + `icons/zhuce.png`;
            } else {
              item.image = this.baseUrl + "/" + item.user__thumbnail_portait;
            }
            
          });
        } else {
          uni.showToast({
            icon: "error",
            title: res.msg,
          });
        }
      });
    },
    getCount() {
      // 获得阅读数
      let params = {
        entity_uuid: this.entityuuid,
        entity_type: this.entitytype,
      }; 
      getCountApi(params).then((res) => {
        if (res.status == 0) {
          this.count = res.msg;
        } else {
          uni.showToast({
            icon: "error",
            title: res.msg,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vmain {
  margin-bottom: 60rpx;
  .popupCommunity {
    padding: 25rpx;
  }
  .addcomment {
    .tips {
      padding: 25rpx;
    }
    /* 上传 */
    .uni-uploader {
      flex: 1;
      flex-direction: column;
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
    .comment-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20upx;
      color: #8f8f94;
      font-size: 28upx;
    }
    .comment-star-view.comment-title {
      justify-content: flex-start;
      margin: 0;
    }
    .comment-quick {
      position: relative;
      padding-right: 40upx;
    }
    .comment-quick:after {
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
    .comment-body {
      background: #fff;
    }
    .comment-textare {
      height: 200upx;
      font-size: 34upx;
      line-height: 50upx;
      width: 100%;
      box-sizing: border-box;
      padding: 20upx 30upx 0;
      border: 1px solid $border-color-light;
    }
    .comment-input {
      font-size: 34upx;
      height: 50upx;
      min-height: 50upx;
    }
    .comment-uploader {
      padding: 22upx 20upx;
    }

    .comment-submit {
      background-color: #df5000 !important;
      color: #ffffff;
      margin: 20upx;
    }
  }
  .vtitle {
    display: flex;
    color: $font-color-light;
    .right {
      display: flex;
      position: absolute;
      right: 25rpx;
      .like {
        width: 220rpx;
        text-align: center;
        background-color: #2c2c2c;
        color: white;
        border-right: 1px solid white;
      }
      .comment {
        text-align: center;
        width: 220rpx;
        background-color: #2c2c2c;
        color: white;
      }
    }
  }
  .comments {
    display: flex;
    margin-top: 25rpx;
    padding-bottom: 25rpx;
    .tags {
      margin-right: 10rpx;
      border-right: 1px solid $border-color-light;
      padding-right: 10rpx;
      .zanimg {
        width: 40rpx;
        height: 40rpx;
      }
      .zantxt {
        text-align: center;
        color: $base-color;
        font-weight: bold;
      }
    }
    .holder {
      .commentitem:not(:first-child) {
        margin-top: 15rpx;
      }
      .commentitem {
        padding-right: 8rpx;
        display: flex;
        width: 650rpx;
        border-bottom: 1px solid $border-color-light;
        .commentimg {
          width: 100rpx;
          margin-right: 10rpx;
          .userimg {
            width: 100rpx;
            height: 100rpx;
            border-radius: 15rpx;
            border: 1px solid $border-color-base;
            box-shadow: 0px 0px 5px $border-color-base;
          }
        }
        .comment-content {
          .line1 {
            display: flex;
            .username {
              display: flex;
              .txt {
                margin-left: 10rpx;
                margin-right: 10rpx;
                color: #1296db;
              }
            }
            .date {
              position: absolute;
              right: 25rpx;
              color: $font-color-light;
            }
          }
          .line2 {
            .content {
              max-height: 120rpx;
              overflow-x: scroll;
            }
            .topimageholder {
              display: flex;
              flex-wrap: wrap;
              .picture {
                width: 160rpx;
                height: 160rpx;
                padding: 10rpx;
                margin-right: 10rpx;
                border: 1px solid $border-color-base;
                box-shadow: 0px 0px 5px $border-color-base;
              }
            }
            .actions {
              width: 530rpx;

              text-align: right;
              font-weight: bold;
              .actionsholder {
                display: flex;
                justify-content: flex-end;
                .delete {
                  color: $uni-color-error;
                  width: 100rpx;
                  text-align: center;
                }
                .reply {
                  width: 100rpx;
                  text-align: center;
                  color: #1296db;
                }
              }
            }
          }
        }

        .username {
          text-align: center;
          color: #ff8000;
          font-weight: bold;
        }
      }
    }
  }
  .likes {
    display: flex;
    border-bottom: 1px solid $base-color;
    margin-top: 25rpx;
    padding-bottom: 25rpx;
    .tags {
      margin-right: 10rpx;
      border-right: 1px solid $border-color-light;
      padding-right: 10rpx;
      .zanimg {
        width: 40rpx;
        height: 40rpx;
      }
      .zantxt {
        text-align: center;
        color: $base-color;
        font-weight: bold;
      }
    }
    .holder {
      display: flex;
      flex-flow: row wrap;

      .likeitem {
        padding-right: 8rpx;
        text-align: center;
        .likeimg {
          width: 100rpx;
          height: 100rpx;
          border-radius: 15rpx;
          border: 1px solid $border-color-base;
          box-shadow: 0px 0px 5px $border-color-base;
        }
        .username {
          text-align: center;
          color: $font-color-light;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
