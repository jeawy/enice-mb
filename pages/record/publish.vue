<template>
  <view class="publishmain">
    <input
      ref="title"
      placeholder="登记事项标题"
      maxlength="128"
      class="recordtitle"
      <!-- #ifdef  MP-WEIXIN -->
    @blur="getTitle"
    <!-- #endif -->
    v-model="title" />
    <textarea
      placeholder="详细描述登记事项"
      class="content"
      <!-- #ifdef  MP-WEIXIN  -->
		  @blur="getContent"
		  <!-- #endif -->
		 v-model="content"></textarea
    >
    <view class="label"
      ><text class="promote">制表：</text
      ><text class="promote-detail">(在列中长按可删除列)</text></view
    >
    <!-- 表格 -->
    <view class="table" ref="table">
      <view
        class="headers"
        v-for="(header, index) in extras"
        :key="index"
        @longpress="deleteItem(index)"
      >
        <view class="headeritem tbheader">{{ header.label }}</view>
        <view class="headeritem tbcontent">- </view>
        <view class="headeritem tbcontent">- </view>
        <view class="headeritem tbcontent">- </view>
        <view class="headeritem tbcontent">- </view>
        <view class="headeritem tbcontent">- </view>
        <view class="headeritem tbcontent">- </view>
      </view>
      <view class="headers" @tap="addColumn">
        <view class="headeritem tbheader headeraddnew">点击添加新列+</view>
        <view class="headeritem tbcontent headeraddnew">- </view>
        <view class="headeritem tbcontent headeraddnew">- </view>
        <view class="headeritem tbcontent headeraddnew">- </view>
        <view class="headeritem tbcontent headeraddnew">- </view>
        <view class="headeritem tbcontent headeraddnew">- </view>
        <view class="headeritem tbcontent headeraddnew">- </view>
      </view>
    </view>
    <view class="userinfo"
      ><text class="userinfotext">是否公开用户登记情况？</text>
      <selectSwitch
        @change="changeSwitch"
        :switchList="switchList"
        :defaultSwitch="defaultShowSwitch"
        checked_bj_color="#FF8000"
    /></view>
    <view class="userinfo"
      ><text class="userinfotext">只有我可以导出登记结果？</text>
      <selectSwitch
        @change="changeExportSwitch"
        :switchList="switchLoginList"
        :defaultSwitch="defaultExportSwitch"
        checked_bj_color="#FF8000"
    /></view>
    <view class="userinfo"
      ><text class="userinfotext">展示在小区的登记薄列表中？</text>
      <selectSwitch
        @change="changeShowListSwitch"
        :switchList="switchShowList"
        :defaultSwitch="defaultShowListSwitch"
        checked_bj_color="#FF8000"
    /></view>
	<view class="userinfo"
	  ><text class="userinfotext">允许登记人员修改登记记录？</text>
	  <selectSwitch
	    @change="changeModifyAuthSwitch"
	    :switchList="switchShowList"
	    :defaultSwitch="switch_allow_modify"
	    checked_bj_color="#FF8000"
	/></view>
	<view class="userinfo"
	  ><text class="userinfotext">允许登记人员删除登记记录？</text>
	  <selectSwitch
	    @change="changeDeleteAuthSwitch"
	    :switchList="switchShowList"
	    :defaultSwitch="switch_allow_delete"
	    checked_bj_color="#FF8000"
	/></view>
    
     <view class="userinfo"  
      ><text class="userinfotext">限制登记人数？</text>
      <selectSwitch 
        @change="changeLimitSwitch"
        :defaultSwitch="defaultLimitSwitch"
        :switchList="switchlimitList"
        checked_bj_color="#FF8000"
    /></view>
     <view class="userinfo" v-if="defaultLimitSwitch == false" 
      ><text class="userinfotext">登记人数上限:</text>
       <input
        type="number"
        class="money-input"
        @blur="changeLimit"
        v-model="limits"
        placeholder="50"
      />
    </view>
	<view class="userinfo"
	  ><text class="userinfotext">要求用户先登录？</text>
	  <selectSwitch
	    @change="changeLoginSwitch"
	    :switchList="switchLoginList"
	    :defaultSwitch="defaultLoginSwitch"
	    checked_bj_color="#FF8000"
	/></view>
	<view class="userinfo" v-if="isNeedLogin == 1"
	  ><text class="userinfotext">允许登录用户重复登记？</text>
	  <selectSwitch
	    @change="changeDuplicateSwitch"
		:switchList="switchDuplicateList"
	    :defaultSwitch="defaultDupSwitch" 
	    checked_bj_color="#FF8000"
	/></view>
     <view class="bottom-btn">
      <button class="draft-btn" :loading="loading" @tap="creaeRecord(0)">存草稿</button>
      <button class="publish-btn" :loading="loading" @tap="creaeRecord(1)">发布</button>
      <button class="remove-btn" v-if="uuid" @tap="removeRecord()">删除</button>
    </view>
    <view class="tips">
      <view class="title">
        <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
        <text>温馨提示:</text>
      </view>
      <view class="appraisetxt">1、用户登记后，可导出为excel</view>
      <view class="appraisetxt"
        >2、如果预测登记量很大时，建议隐藏登记情况，否则登记页面加载可能出现卡顿现象，可通过excel导出登记结果。</view
      >
      <view class="appraisetxt"
        >3、请注意保护用户隐私，公开用户登记时，有泄露用户隐私的可能。</view
      >
       <view class="appraisetxt" 
        >4、自增列只有在导出excel或者结束登记时，才会进行排序</view
      >
      <view class="appraisetxt" v-if="uuid"
        >5、修改时，如果已经有登记记录，则要求修改之后的列数与修改之前的列数一致，否则会忽略掉对列的修改</view
      >
      <view class="appraisetxt" v-if="uuid"
        >6、"展示在小区的登记薄列表中?"选择"否"之后，登记薄不会出现在小区的登记薄列表中，但用户还是可以通过您的二维码或者页面分享进行登记。</view
      >
      
    </view>
   
    <s-popup custom-class="popupColumns" ref="popup" type="top">
      <view class="addcolumns">
        <image :src="baseAppUrl + `close.png`" class="close" @tap="close" />
        <!-- #ifdef  APP-PLUS -->
        <input
          placeholder="新列名"
          maxlength="128"
          focus="ture"
          v-model="current.label"
          class="newname"
          @confirm="addNewName"
        />
        <!-- #endif -->
        <!-- #ifdef  MP-WEIXIN -->
        <input
          ref="newValue"
          type="text"
          class="newname"
          placeholder="新列名"
          maxlength="128"
          v-model="current.label"
          @blur="getNewColumn"
        />
        <!-- #endif -->
        <checkbox-group @change="checkboxChange" class="properties">
          <label>
            <checkbox
              value="1"
              color="#FF8000"
              :checked="current.required == 1"
              style="transform: scale(0.7)"
            />必填
          </label>
          <label>
            <checkbox
              value="number"
              color="#FF8000"
              :checked="current.type == 'number'"
              style="transform: scale(0.7)"
            />数字类型
          </label>
          <label>
            <checkbox
              value="sum" 
              color="#FF8000" 
              :checked="current.action[0] == 'sum'"
              style="transform: scale(0.7)"
            />自动求和
          </label>
          <label>
            <checkbox
              value="autoincrease"
              color="#FF8000"
              
              :checked="current.action[1] == 'autoincrease'"
              style="transform: scale(0.7)"
            />自增(从1开始)
          </label>
        </checkbox-group>
        <button class="btn-add-new" @tap="addNewName">添加列</button>
        <view class="tags">
          <view class="tagstitle">已添加的列：</view>
          <view class="tagmain">
            <view class="addedtag" v-for="(item, index) in extras" :key="index">
              <text>{{ item.label }}</text>
              <image
                :src="baseAppUrl + `close.png`"
                class="tagclose"
                @tap="deleteColumns(index)"
              />
            </view>
          </view>
        </view>
        <view class="tags">
          <view class="tagstitle">快速添加列：</view>
          <view class="tagmain">
            <view
              @tap="fastAddNew(index)"
              class="tag"
              v-for="(item, index) in tags"
              :key="index"
            >
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>
        <view class="tips">
          <view class="title">
            <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
            <text>说明:</text>
          </view>
          <view class="appraisetxt">1、勾选必填后，登记时，该列为必填项。</view>
          <view class="appraisetxt">2、自动求和仅对数字类型的列有效。</view>
          <view class="appraisetxt"
            >3、自增列在结束登记时，按照登记时间进行编号。</view
          >
        </view>
        	<button class="btn-add-new" @tap="close">确定</button> 
      </view>
    </s-popup>
  </view>
</template>

<script>
import { postRecord, getRecord } from "@/api/record";
import selectSwitch from "@/components/xuan-switch/xuan-switch.vue";
import sPopup from "@/components/s-popup/index.vue";
export default {
  components: {
    selectSwitch,
    sPopup,
  },
  data() {
    return {
      limits:50,// 登记人数上限
      loading:false,
      defaultDupSwitch: true,
      defaultLoginSwitch: true,
	  defaultExportSwitch:false,
      defaultShowSwitch: true,
      defaultLimitSwitch:true,
      defaultShowListSwitch:false,
      baseurl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      switchList: ["公开", "隐藏"],
      switchShowList: ["否", "是"],
      switchLoginList: ["否", "是"],
      switchDuplicateList: ["否", "是"],
      switchlimitList: ["不限", "限制"],
      content: "",
      title: "",
      show_userinfo: 1,
      newColumn: "", //新列名
      only_owner_export: 0,
      show_in_list:1,
	  allow_modify:1,
	  allow_delete:1,
	  switch_allow_modify:true,
	  switch_allow_delete:true,
      extras: [
        {
          label: "序号(自增)",
          type: "string",
          required: 1,
          action: ["", "autoincrease"], // 从1开始自增
        },
      ],
      hasLogin: false,
      isNeedLogin: 0,
      isAllowDuplicateRecord: 0,
      uuid: "",
      current: {
        label: "序号(自增)",
        type: "string",
        required: 1,
        action: ["", "autoincrease"], // 从1开始自增
        index: 0,
      },
      tags: [
        {
          label: "序号(自增)",
          type: "string",
          required: 1,
          action: ["", "autoincrease"], // 从1开始自增
        },
        {
          label: "房号",
          type: "string",
          required: 1,
          action: ["", ""],
        },
        {
          label: "姓名",
          type: "string",
          required: 1,
          action: ["", ""],
        },
        {
          label: "联系电话",
          type: "string",
          required: 1,
          action: ["", ""],
        },
        {
          label: "金额",
          type: "number",
          required: 0,
          action: ["sum", ""],
        },
        {
          label: "日期",
          type: "string",
          required: 0,
          action: ["", ""],
        },
        {
          label: "备注",
          type: "string",
          required: 0,
          action: ["", ""],
        },
      ],
    };
  },
  computed: {
    // 计算倒计时时间
    second() {
      return function (val) {
        return Math.floor(15 * 60 - (new Date() / 1000 - val));
      };
    },
  },
  onLoad(options) {
    if (options.uuid) {
      // 编辑
      this.uuid = options.uuid;
      this.getDetail(this.uuid);
    }

    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
  },
  onReady() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    if (!this.hasLogin) {
      // 跳转登录
      // #ifdef APP-PLUS
      uni.showModal({
        content: "你暂未登陆，是否跳转登录页面？",
        success: (confirmRes) => {
          if (confirmRes.confirm) {
            this.$mRouter.push({
              route: "/pages/public/logintype",
            });
          }
        },
      });
      // #endif
      // #ifdef MP-WEIXIN
      // 微信小程序，直接登录
      uni.showModal({
        content: "你暂未登陆，是否跳转登录页面？",
        success: (confirmRes) => {
          if (confirmRes.confirm) {
            this.$mRouter.push({
              route: "/pages/public/logintype",
            });
          }
        },
      });
      // #endif
    }
  },
  methods: { 
    changeLimit(){ 
    },
    deleteColumns(index) {
      this.extras.splice(index, 1);
    },
    fastAddNew(index) {
      this.current.label = this.tags[index].label;
      this.current.type = this.tags[index].type;
      this.current.required = this.tags[index].required;
      this.current.action = this.tags[index].action;
    },
    initCurentRecord(){
      this.current = {
        label: "",
        type: "string",
        required: 1,
        action: ["", ""], //
        index: 0,
      }; 
    },
    checkboxChange(e) {
      let values = e.detail.value
      // 先初始化current
      this.current.action = ["", ""]
      this.current.required = 0 
      this.current.type = "string"


      values.forEach(item => {
        if (item == "autoincrease"){
          // 选择了自增
          this.current.action[1] = item
        }
        else if (item == "sum"){
          // 选择了求和
          this.current.action[0] = item
        }
        else if (item == "number"){
          // 选择了数字类型
          this.current.type = item
        }
        else if (item == 1){
          // 选择了必填
          this.current.required = item
        }
      }) 
    },
    changeSwitch(isSwitch) {
      //
      if (isSwitch) {
        this.show_userinfo = 1;
      } else {
        this.show_userinfo = 0;
      }
    },
    changeDuplicateSwitch(isSwitch) { 
      if (isSwitch) {
        this.isAllowDuplicateRecord = 0;
      } else {
        this.isAllowDuplicateRecord = 1;
      }
    },
    changeLimitSwitch(isSwitch) {
      this.defaultLimitSwitch = isSwitch; 
    },
    changeLoginSwitch(isSwitch) { 
      if (isSwitch) {
        this.isNeedLogin = 0;
      } else {
        this.isNeedLogin = 1;
      }
    },
    changeExportSwitch(isSwitch) { 
      if (isSwitch) {
        //否
        this.only_owner_export = 0;
      } else {
        //是
        this.only_owner_export = 1;
      }
    },
    changeShowListSwitch(isSwitch) { 
      if (isSwitch) {
        //否 
        this.show_in_list = 0;
      } else {
        //是
        this.show_in_list = 1;
      }
    },
	changeModifyAuthSwitch(isSwitch) {
	  if (isSwitch) {
	    //否 
	    this.allow_modify = 0;
	  } else {
	    //是
	    this.allow_modify = 1;
	  }
	},
	changeDeleteAuthSwitch(isSwitch) {
	  if (isSwitch) {
	    //否 
	    this.allow_delete = 0;
	  } else {
	    //是
	    this.allow_delete = 1;
	  }
	},
    getDetail(recorduuid) {
      // 获得登记详情
      let that = this;
      getRecord({ uuid: recorduuid, owner: 1 }).then(({ status, msg }) => {
        if (status == 0) { 
          that.isNeedLogin = msg.need_login; 
          that.title = msg.title;
		  
          that.content = msg.content;
          that.date = msg.date;
          that.extras = msg.extra; 
          
           
		if (msg.duplicate == 0) {
		  that.defaultDupSwitch = true;
		} else {
		  that.defaultDupSwitch = false;
		}
		
		if (msg.need_login == 0) {
		  that.defaultLoginSwitch = true;
		} else {
		  that.defaultLoginSwitch = false;
		}
		
          if (msg.show_userinfo == 1) {
            that.defaultShowSwitch = true;
          } else {
            that.defaultShowSwitch = false;
          }
		  
		  if (msg.only_owner_export == 1){ // 仅发起人自己可以导出结果
			  that.defaultExportSwitch = false
		  }
		  else{
			  that.defaultExportSwitch = true
		  }
		  
          that.limits = msg.limits
          if (that.limits > 0){
            that.defaultLimitSwitch = false
          } 
		  if (msg.show_in_list == 1){// 出现在小区中
			  that.defaultShowListSwitch = false
		  }
		  else{
			  that.defaultShowListSwitch = true
		  }
		  if (msg.allow_modify == 1){//  
		    that.switch_allow_modify = false
		  }
		  else{
		  	that.switch_allow_modify = true
		  }
		  if (msg.allow_delete == 1){//
		  	 that.switch_allow_delete = false
		  }
		  else{
		  	that.switch_allow_delete = true
		  } 
		  console.log(that.switch_allow_delete)
		  console.log(that.switch_allow_modify)
		  that.allow_modify = msg.allow_modify
		  that.allow_delete = msg.allow_delete
		  that.show_in_list  = msg.show_in_list  
          that.show_userinfo = msg.show_userinfo;  
          that.values = new Array(that.extras.length); // 初始化输入值数组
		  setTimeout(() => {
			// 调用父组件的方法 
		  }, 50);
        } else {
          uni.showToast({
            title: msg,
            icon: "error",
            duration: 3000,
          });
        }

        that.loading = false;
      });
    },
    getTitle(e) {
      this.title = e.detail.value;
    },
    getContent(e) { 
      this.content = e.detail.value;
    },
    getNewColumn(e) { 
      this.newColumn = e.detail.value;
    },
    addNewName() { 
      let tmp = this.current;
      this.extras.push(tmp);
      this.initCurentRecord()
    },
    deleteItem(index) {
      // 长按删除列
      this.$delete(this.extras, index);
      uni.showToast({
        title: "已删除",
        icon: "success",
        duration: 3000,
      });
    },
    addColumn(e) {
      this.$refs.popup.show("top");
    },
    removeRecord() {
      uni.showModal({
        content: "删除？",
        success: (confirmRes) => {
          if (confirmRes.confirm) {
            //
            let data = {
              method: "delete",
              uuids: this.uuid,
            };
            postRecord(data).then(({ status, msg }) => {
              //
              if (status == 0) {
                uni.showToast({
                  title: "已删除",
                  icon: "success",
                  duration: 3000,
                });
                this.$mRouter.push({ route: "/pages/record/myrecord?mine=1" });
                return;
              }
            });
          }
        },
      });
    },
    creaeRecord(recordstatus) {
      // 发布或者草稿 status= 0 草稿；status=1 已发布
      // 验证数据
      if (this.title.trim() == "") {
        uni.showToast({
          title: "请输入标题",
          icon: "error",
          duration: 3000,
        });
        return;
      }
      if (this.extras.length == 0) {
        uni.showToast({
          title: "请制表",
          icon: "error",
          duration: 3000,
        });
        return;
      }
      uni.showLoading({
        title:"请稍后"
      })
      const data = {
        communityuuid: uni.getStorageSync("communityuuid"),
        status: recordstatus,
        title: this.title,
        content: this.content,
        show_userinfo: this.show_userinfo,
        extra: JSON.stringify(this.extras), 
        need_login: this.isNeedLogin,
		allow_modify: this.allow_modify,
		allow_delete: this.allow_delete,
        only_owner_export: this.only_owner_export,
        show_in_list:this.show_in_list
      };
      if (this.isNeedLogin == 0){
        data.duplicate = 1
      }
      else{
        data.duplicate = this.isAllowDuplicateRecord
      }  
      if (this.defaultLimitSwitch == false){
        // 限制登记人数
        data.limits = this.limits
      }
      if (this.uuid != "") {
        data["method"] = "put";
        data["uuid"] = this.uuid;
        if (this.defaultLimitSwitch ){
          // 不限限制登记人数
          data.limits = 0
        }
      } 

      postRecord(data).then((res) => {
        if (res.status == 0) {
          this.$mHelper.toast(res.msg);
          this.$mRouter.push({
            route: "/pages/record/detail?uuid=" + res.uuid,
          });
        } else {
          this.$mHelper.toast(res.msg);
        }
      }).finally(()=>{
        uni.hideLoading()
      });
    },
    // 跳转页面
    navTo(route) {
      this.$mRouter.push({ route });
    },
    close() {
      this.$refs.popup.hide();
    },
  },
};
</script>

<style lang="scss">
@import "table.scss";
.userinfo {
  margin-top: 10rpx;
  display: flex;
}
.table {
  overflow: scroll;
  .headeritem {
    min-width: 90rpx;
    white-space: nowrap;
  }
}
.userinfotext {
  line-height: 80rpx;
  width: 400rpx;
}
.headeraddnew {
  color: $base-color;
}
.popupColumns {
  .addcolumns {
    width: 720rpx;
    padding: 25rpx;
    .properties {
      margin-top: 15rpx;
      margin-bottom: 15rpx;
    }
    .tags {
      margin-bottom: 30rpx;
      .tagstitle {
        color: $base-color;
        font-size: 20px;
      }
      .tagmain {
        display: flex;
        flex-flow: wrap;
        .tagclose {
          margin-left: 10rpx;
          margin-right: 15rpx;
          height: 20rpx;
          width: 20rpx;
        }
        .addedtag {
          margin: 5rpx 10rpx;
          border: 1px solid $border-color-light;
          border-radius: 15rpx;
          text-align: center;
        }
        .tag {
          margin: 5rpx 10rpx;
          width: 140rpx;
          border: 1px solid $border-color-light;
          border-radius: 15rpx;
          text-align: center;
        }
      }
    }
    .close {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      height: 50rpx;
      width: 50rpx;
    }
    .newname {
      border-bottom: 2px solid $base-color;
      height: 80rpx;
      width: 200rpx;
      font-size: $font-lg;
      margin-left: 260rpx;
      text-align: center;
    }
    .btn-add-new {
      height: 80rpx;
      width: 240rpx;
      border-radius: 20rpx;
      background-color: $base-color;
      color: $color-white;
    }
  }
}
.money-input{
  border-bottom: 2px solid $base-color;
  text-align: center;
  color:$base-color;
  font-size: 20px;
  width: 200rpx;
}
.label {
  display: flex;
}
.promote {
  font-size: $font-lg;
  color: $base-color;
  font-weight: bold;
}
.promote-detail,
.tips {
  margin-top: 10rpx;
  color: $font-color-light;
}
.bottom-btn {
  display: flex;
  text-align: center;
  padding: 20rpx 50rpx;
  justify-content: center;
  width: 710rpx;
}
 
.draft-btn,
.publish-btn,
.remove-btn {
  width: 200rpx;
  background-color: $base-color;
  color: $color-white;
}
.remove-btn {
  background-color: #df5000;
}

.publishmain {
  background-color: $color-white;
  min-height: 100vh;
  /* #ifdef MP-WEIXIN */
  padding: 0 $spacing-base;
  /* #endif */
  padding: 25rpx;
  padding-bottom: 120rpx;
  .recordtitle {
    width: 710rpx;
    border-bottom: 1rpx solid $border-color-base;
    font-size: $font-lg;
    margin-bottom: 10rpx;
  }
}

.content {
  width: 710rpx;
  border-bottom: 1rpx solid $border-color-base;
}
</style>
