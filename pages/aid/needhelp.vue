<template>
  <view class="page">
    <view class="feedback-title">
      <text>求助标题</text>
    </view>
    <view class="feedback-body">
      <text class="feedback-quick" @tap="chooseMsg">快速键入</text>
      <input
        :focus="titlefocus"
        :class="titleerror ? 'uni-error feedback-input' : 'feedback-input'"
        v-model="sendData.title"
        placeholder="简要说明求助内容(限32个字)"
      />
    </view>
    <view class="feedback-title">
      <text>可详细说明求助内容</text>
    </view>
    <view class="feedback-body">
      <textarea
        placeholder="请详细描述你的问题和意见..."
        v-model="sendData.content"
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
                  :src="image.uri"
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

    <view class="feedback-title">
      <text>机密信息，仅接单人可见，完成后自动清除...</text>
    </view>
    <view class="feedback-body">
      <textarea
        placeholder="机密信息，仅接单人可见，完成后自动清除..."
        v-model="sendData.secretinfo"
        class="feedback-textare"
      />
    </view>
    <view class="feedback-title">
      <text>其他要求：</text>
    </view>
    <view class="v-switch">
      <text class="userinfotext">接单必须是认证业主：</text>
      <selectSwitch
        @change="changeCertificateSwitch"
        :switchList="switchList"
        :defaultSwitch="defaultShowCrtSwitch"
        checked_bj_color="#FF8000"
      />
      <text
        class="reselect-community"
        v-if="selectedCommunityList.length > 0"
        @tap="openPopup"
        >重新选择小区</text
      >
    </view>
    <view class="selectcommunitylist" v-if="selectedCommunityList.length > 0">
      <view
        v-for="(item, index) in selectedCommunityList"
        :key="index"
        @longpress="deleteItem(index)"
        class="selectitem"
      >
        <view class="title">{{ item.name }}</view>
        <view class="right">
          <image :src="baseAppUrl + `dianji.png`" class="image" />
          <text class="righttxt">长按删除</text>
        </view>
      </view>
    </view>

    <view class="v-switch">
      <text class="userinfotext">向接单人公开自己的手机号码和房号？</text>
      <selectSwitch
        @change="changePhoneSwitch"
        :switchList="switchList"
        :defaultSwitch="defaultShowSwitch"
        checked_bj_color="#FF8000"
      />
    </view>
    <view class="v-switch">
      <text class="userinfotext">截止日期:</text>
      <picker
        @change="changeDate"
        class="enddate"
        :value="sendData.end_date"
        :start="startDate"
        :end="endDate"
        mode="date"
      >
        <view class="uni-input">{{ sendData.end_date }}</view>
      </picker>
      <image class="rili-img" :src="baseAppUrl + `rili.png`"></image>
    </view>
    <view class="v-switch">
      <text class="userinfotext">接单模式：</text>
      <selectSwitch
        @change="changeModeSwitch"
        :switchList="switchModeList"
        :defaultSwitch="defaultShowSwitch"
        checked_bj_color="#FF8000"
      />
    </view>
    <view class="v-switch">
      <view>
        <view class="userinfotext explain">接单模式说明： </view>
        <view class="userinfotext">
          【抢单】采用先来先得模式，即谁先接单，这个互助单就由谁完成。</view
        >
        <view class="userinfotext">
          【备选】则是接单人采用报名方式，由求助人选择由谁来完成。</view
        >
      </view>
    </view>

    <view class="feedback-title">
      <text>佣金(元)，一份付出应有一份收获：</text>
    </view>
    <view class="v-money">
      <label v-for="(item, index) in items" :key="item.value">
        <text class="moneyname">{{ item.name }}</text>
        <label class="radio">
          <uni-icons
            :type="item.checked ? 'checkbox-filled' : 'circle'"
            :color="item.checked ? '#dd524d' : '#aaa'"
            size="24"
            @tap="radioMoney(item.value)"
          ></uni-icons>
        </label>
      </label>
      <text class="moneyname">其他金额:</text>
      <input
        type="number"
        class="money-input"
        @blur="otherMoney"
        v-model="sendData.money"
        placeholder=">5元"
      />
    </view>
    <view class="v-btns">
      <button type="primary" class="feedback-submit" @tap="send(0)">
        存为草稿
      </button>
      <button
        type="primary"
        class="feedback-submit"
        v-if="payed == 0"
        @tap="send(1)"
      >
        发布,并支付{{ sendData.money }}元
      </button>
      <button
        type="primary"
        class="feedback-submit"
        v-if="payed == 1"
        @tap="send(1)"
      >
        保存
      </button>
    </view>
    <view class="v-switch">
      <view>
        <view class="userinfotext explain">注意： </view>
        <view class="userinfotext"
          >1、不得发布黄赌毒信息,一经发现将永久禁用该功能，情节严重报警处理。</view
        >
        <view class="userinfotext">2、修改求助单时，不支持修改已支付的佣金。</view>
        <view class="userinfotext">3、接单后无法修改求助单的任何信息。</view>
        <view class="userinfotext"
          >4、长时间无人接单可申请退款，接单后无法申请退款。</view
        >
        <view class="userinfotext"
          >5、实名认证业主完成求助单时，造成求助人财产损失，双方可先自行协商，协商不成，平台可先行赔付，待责任认定清楚后，再由平台向相关责任人索赔。</view
        >
      </view>
    </view>
    <s-popup custom-class="popupCommunity" ref="popupCommunity" type="top">
      <view class="popupholder">
        <view>
          <view class="title">仅限以下小区的认证业主接单</view>
        </view>
        <view>
          <text v-if="nearbycommunities.length > 0">附近小区(1公里内)</text>
          <text
            v-if="nearbycommunities.length > 0"
            class="reload"
            @tap="getNearbyCommunities(true)"
            >重新获取</text
          >
        </view>
        <view class="mycommunities">
          <view
            v-for="(item, index) in nearbycommunities"
            :key="index"
            @click="selectCommunity(item, index, 1)"
            class="nearcommunityholder"
          >
            <uni-icons
              :type="item[4] ? 'checkbox-filled' : 'circle'"
              :color="item[4] ? '#dd524d' : '#aaa'"
              size="24"
            ></uni-icons>
            <view class="nearcommunitylabel">{{ item[0] }}</view>
          </view>
        </view>
        <text v-if="mycommunities.length > 0">我的关注</text>
        <text
          v-if="nearbycommunities.length > 0"
          class="reload"
          @tap="getNearbyCommunities(true)"
          >刷新</text
        >
        <view class="mycommunities">
          <view
            v-for="(item, index) in mycommunities"
            :key="index"
            @click="selectCommunity(item, index, 2)"
            class="nearcommunityholder"
          >
            <uni-icons
              :type="item[2] ? 'checkbox-filled' : 'circle'"
              :color="item[2] ? '#dd524d' : '#aaa'"
              size="24"
            ></uni-icons>
            <view class="nearcommunitylabel">{{ item[1] }}</view>
          </view>
        </view>
        <view class="bottom-btn">
          <button
            class="guanzhu-btn"
            @tap="btnGuanzhu"
            :loading="confirmLoading"
            :disabled="confirmDisabled"
          >
            确定
          </button>
        </view>
        <view class="bottom-msg" @tap="getMoreCommunity">
          <image :src="baseAppUrl + `dianji.png`" class="image" />
          <text class="msg"> 点击获取此处更多小区(关注小区后，重新选取)</text>
        </view>
      </view>
    </s-popup>
  </view>
</template>

<script>
import store from "@/store";
import selectSwitch from "@/components/xuan-switch/xuan-switch.vue";
import moment from "@/common/moment";
import { updateAid, getAids } from "@/api/aid.js";
import sPopup from "@/components/s-popup/index.vue";
import Vue from 'vue'
import {
  getNearbyCommunitiesApi,
  getProprietorCommunities,
} from "@/api/community";
export default {
  components: {
    selectSwitch,
    sPopup,
  },
  data() {
    const currentDate = this.getDate({
      format: true,
    });
    return {
      showSelectCommunity: false,
      selectedCommunityList: [], // 选择的小区
      confirmLoading: false,
      confirmDisabled: false,
      mycommunities: [],
      nearbycommunities: [],
      titlefocus: true,
      titleerror: false,
      position: {},
      showAddImage:true,
      defaultShowSwitch: true,
      defaultShowCrtSwitch: false,
      msgContents: ["取快递", "接人", "看孩子", "求一碗饭"],
      switchList: ["是", "否"],
      switchModeList: ["抢单", "备选"],
      imageList: [],
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      BaseUrlImage: this.$mStore.state.BaseUrl,
      aiduuid: "",
      payed: 0,
      sendData: {
        title: "",
        content: "",
        secretinfo: "", // 机密信息
        need_propertior: 1, //是否要求必须是认证业主接单，默认是1
        end_date: currentDate,
        publich_myinfo: 0, //是否公开自己的电话、房号
        money: 5,
        mode: 1, //抢单模式
      },
      current: 5,
      deletedImagesIds: [],
      items: [
        { value: 5, name: "5", checked: true },
        { value: 50, name: "50" },
        { value: 100, name: "100" },
      ],
      communityuuid: "",
      hasLogin: this.$mStore.getters.hasLogin,
    };
  },
  onShow() {
    this.communityuuid = uni.getStorageSync("communityuuid");
  },
  onLoad(option) {
    this.aiduuid = option.uuid;
    if (this.aiduuid) {
      this.getDetail();
    }
    this.doGetLocation();
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    },
  },
  methods: {
    deleteItem(index) {
      // 长按删除列
      this.selectedCommunityList.splice(index, 1);
    },
    openPopup() {
        //弹出选择小区
      this.$refs.popupCommunity.show("top");
    },
    selectCommunity(item, index, communitytype) {
        //选择小区
      if (communitytype == 1) {
        // 附近小区
        let mark = this.nearbycommunities[index][4];
        if (this.selectedCommunityList.length >= 3 && mark == false) {
          uni.showToast({
            icon: "error",
            title: "最多选择三个",
          });
          return;
        }
        Vue.set(this.nearbycommunities[index], 4, !mark);
      } else {
        // 我关注的小区
        let mark = this.mycommunities[index][2];
        if (this.selectedCommunityList.length >= 3 && mark == false) {
          uni.showToast({
            icon: "error",
            title: "最多选择三个",
          });
          return;
        }
        Vue.set(this.mycommunities[index], 2, !mark);
      }
      this.updateCommunityList();
    },
    btnGuanzhu() {
      this.$refs.popupCommunity.hide();
    },
    updateCommunityList() {
      this.selectedCommunityList = [];
      this.mycommunities.forEach((item) => {
        let inList = false;
        for (let i = 0; i < this.selectedCommunityList.length; i++) {
          if (
            item[0] == this.selectedCommunityList[i].uuid &&
            item[2] == true
          ) {
            inList = true;
            break;
          }
        }
        if (inList == false && item[2] == true) {
          this.selectedCommunityList.push({
            name: item[1],
            uuid: item[0],
          });
        }
      });
      this.nearbycommunities.forEach((item) => {
        let inList = false;
        for (let i = 0; i < this.selectedCommunityList.length; i++) {
          if (
            item[1] == this.selectedCommunityList[i].uuid &&
            item[4] == true
          ) {
            inList = true;
            break;
          }
        }
        if (inList == false && item[4] == true) {
          this.selectedCommunityList.push({
            name: item[0],
            uuid: item[1],
          });
        }
      });
    },
    getMoreCommunity() {
      this.$mRouter.push({
        route: "/pages/user/properties",
      });
    },
    date(val) {
      // 日期格式化
      return moment(val * 1000).format("YYYY-MM-DD");
    },
    getDetail() {
      // 获取详情
      let params = {
        uuid: this.aiduuid,
      };
      getAids(params).then((res) => {
        if (res.status == 0) {
          this.sendData = res.msg;
          this.sendData.end_date = this.date(this.sendData.end_date);

          this.items.forEach((item) => {
            if (item.value == res.msg.money) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
          if (res.msg.need_propertior == 1) {
            this.defaultShowCrtSwitch = true;
          }
          res.msg.images.forEach((item) => {
            this.imageList = this.imageList.concat({
              uuid: item.id,
              uri: this.BaseUrlImage + "/images/" + item.filepath,
            });
          });
          this.payed = res.msg.payed;
          for (let i = 0; i < res.msg.communities.length; i++) {
            this.selectedCommunityList.push({
              uuid: res.msg.communities[i].community__uuid,
              name: res.msg.communities[i].community__name,
            });
          }
        }
      });
    },
    changeCertificateSwitch(isSwitch) {
      //
      if (isSwitch) {
        this.sendData.need_propertior = 1;
        this.showSelectCommunity = true;
        this.getNearbyCommunities();
        this.proprietorCommunities();
        this.$refs.popupCommunity.show("top");
      } else {
        this.sendData.need_propertior = 0;
        this.showSelectCommunity = false;
      }
    },
    changePhoneSwitch(isSwitch) {
      //
      if (isSwitch) {
        this.sendData.publich_myinfo = 1;
      } else {
        this.sendData.publich_myinfo = 0;
      }
    },
    changeModeSwitch(isSwitch) {
      //
      if (isSwitch) {
        this.sendData.mode = 1;
      } else {
        this.sendData.mode = 0;
      }
    },
    changeDate(event) {
      this.sendData.end_date = event.detail.value;
    },
    radioMoney(value) {
      this.items.forEach((item) => {
        item.checked = false;
      });
      this.current = value;
      this.sendData.money = value;
      this.items.forEach((item) => {
        if (item.value == value) {
          item.checked = true;
        }
      });
    },
    otherMoney() {
      this.items.forEach((item) => {
        item.checked = false;
      });
      if (this.sendData.money > 500) {
        uni.showToast({
          icon: "error",
          title: "金额别超过500",
        });
        this.sendData.money = 500;
      }
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === "start") {
        year = year;
      } else if (type === "end") {
        year = year + 2;
      } else {
        day = day + 3;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    changeSwitch(isSwitch) {
      //
      if (isSwitch) {
        this.show_userinfo = 1;
      } else {
        this.show_userinfo = 0;
      }
    },

    close(e) {
      this.deletedImagesIds = this.deletedImagesIds.concat(
        this.imageList[e].uuid
      );
      this.imageList.splice(e, 1);
       if (this.imageList.length < 9 ){
          this.showAddImage = true
        }
    },
    chooseMsg() {
      //快速输入
      uni.showActionSheet({
        itemList: this.msgContents,
        success: (res) => {
          this.sendData.title = this.msgContents[res.tapIndex];
        },
      });
    },
    chooseImg() {
      //选择图片
      uni.chooseImage({
        sourceType: ["camera", "album"],
        sizeType: "compressed",
        count: 9 - this.imageList.length,
        success: (res) => {
          res.tempFilePaths.forEach((item) => {
            this.imageList = this.imageList.concat({
              uuid: -1,
              uri: item,
            });
            if (this.imageList.length >= 9 ){
              this.showAddImage = false
            }
          });
        },
      });
    },
    chooseStar(e) {
      //点击评星
      this.sendData.score = e;
    },
    previewImage() {
      //预览图片
      let preimages = this.imageList.map((value, index) => {
        return {
          name: "image" + index,
          uri: value.uri,
        };
      });
      uni.previewImage({
        urls: preimages,
      });
    },
    send(status) {
      //发送反馈
      if (status == 1 && this.sendData.title == "") {
        this.titleerror = true;
        this.titlefocus = true;
        uni.showToast({
          icon: "error",
          title: "输入标题",
        });
        // #ifdef MP-WEIXIN
        let scrollTop = 0;
        // #endif

        // #ifdef APP-PLUS
        let scrollTop = 60;
        // #endif
        uni.pageScrollTo({
          scrollTop: scrollTop,
          duration: 300,
        });
        return;
      }
      let imgs = [];
      if (this.imageList.length > 0) {
        this.imageList.forEach((value, index) => {
          if (value.uuid == -1) {
            imgs = imgs.concat({
              name: "image" + index,
              uri: value.uri,
            });
          }
        });
      }
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      if (this.aiduuid) {
        this.sendData["method"] = "put";
        this.sendData["uuid"] = this.aiduuid;
        // 已经删除的图片id
        this.sendData["deletedImagesIds"] = JSON.stringify(
          this.deletedImagesIds
        );
      }
      updateAid({
        ...this.sendData,
        communityuuid: this.communityuuid,
        status: status,
        comminities: JSON.stringify(this.selectedCommunityList),
      })
        .then((data) => {
          uni.showLoading({
            mask: true,
            title: "请稍后...",
          });
          if (data.status === 0) {
            if (imgs.length > 0) {
              let token =
                store.state.accessToken || uni.getStorageSync("accessToken");
              // 上传图片，微信小程序不支持批量上传
              let updateuuid = "";
              if (this.aiduuid) {
                updateuuid = this.aiduuid;
              } else {
                updateuuid = data.msg.uuid;
              }
              imgs.forEach((ele) => {
                uni.uploadFile({
                  url: store.state.BaseUrl + "api/aid/aid/",
                  filePath: ele.uri,
                  name: ele.name,
                  header: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token,
                    // 'content-type': 'application/json'
                  },
                  formData: { uuid: updateuuid, method: "put" },
                  success: (res) => {},
                  fail: (res) => {
                    uni.showToast({
                      title: "失败",
                      icon: "none",
                    });
                  },
                });
              });
            }
            if (data.msg.order_status == 1 && data.msg.payed == 0) {
              // 发布之后跳转支付
              let billno = data.msg.billno;
              this.$mRouter.push({
                route: "/pages/user/money/pay?bill=" + billno + "&billtype=3",
              });
            } else {
              uni.showToast({
                title: "已保存",
              });
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .finally((res) => {
          uni.hideLoading();
        });
    },
    proprietorCommunities() {
      // 获取我的关注列表
      if (this.hasLogin) {
        getProprietorCommunities().then((res) => {
          if (res.status == 0) {
            this.mycommunities = res.msg;
            for (let i = 0; i < this.mycommunities.length; i++) {
              this.mycommunities[i].push(false);
              for (let j = 0; j < this.selectedCommunityList.length; j++) {
                if (
                  this.selectedCommunityList[j].uuid == this.mycommunities[i][0]
                ) {
                  Vue.set(this.mycommunities[i], 2, true);
                }
              }
            }
          } else {
            uni.showToast({
              icon: "error",
              title: res.msg,
            });
          }
        });
      }
    },
    getNearbyCommunities(refresh = false) {
      // refresh = true时，强制刷新附近小区
      uni.showLoading({
        mask: true,
      });
      this.nearbycommunities = uni.getStorageSync("nearbycommunities");
      if (this.nearbycommunities && refresh == false) {
        //有缓存数据
        this.setNearbyList(this.nearbycommunities);
        uni.hideLoading();
      } else {
        if (this.position.longitude == undefined) {
          // 提示没有设置定位权限
          uni.hideLoading();
          return;
        }
        getNearbyCommunitiesApi({
          longitude: this.position.longitude,
          latitude: this.position.latitude,
        })
          .then((res) => {
            if (res.status == 0) {
              uni.setStorageSync("nearbycommunities", res.msg);
              this.setNearbyList(res.msg);
            }
          })
          .finally((res) => {
            uni.hideLoading();
          });
      }
    },
    setNearbyList(communities) {
      this.nearbycommunities = []; // 附近小区
      for (var i = 0; i < communities.length; i++) {
        var communityuuid = communities[i][1];
        if (
          (this.communityuuid == "" || this.communityuuid == "undefined") &&
          i == 0
        ) {
          communities[i].push(true);
          this.nearbycommunities.push(communities[i]);
          // 之前没有设置过小区，首次进行设置
          this.setDefaultCommunity(communities[i][1], communities[i][0]);
        } else if (this.communityuuid == communityuuid) {
          communities[i].push(true);
          this.nearbycommunities.push(communities[i]);
        } else {
          communities[i].push(false);
          this.nearbycommunities.push(communities[i]);
        }
      }
    },
    //获取当前的位置
    doGetLocation() {
      uni.getLocation({
        type: "wgs84",
        success: (res) => {
          this.position = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },
  },
  beforeDestroy() {
    uni.hideLoading();
  },
  onNavigationBarButtonTap(val) {
    if (val.index == 0) {
      uni.navigateTo({
        url: "../aid/list",
      });
    }
  },
};
</script>

<style lang="scss" src="./needhelp.scss" scoped>
</style>
