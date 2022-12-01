<template>
  <!-- 选择小区 -->
   <view>
    <s-popup  class="popupCommunity" ref="popupCommunity" type="top">
      <view class="popupholder">
        <view class="title">请选择小区</view>
        <image :src="baseAppUrl+`close.png`" class="close" @tap="close" />
        <view>
          <text v-if="nearbycommunities.length > 0">附近小区</text>
          <text v-if="nearbycommunities.length > 0" class="reload"
             @tap="getNearbyCommunities(true)">重新获取</text>
        </view> 
        <view class="mycommunities">
          <view
            v-for="(item, index) in nearbycommunities"
            :key="index"
            @click="nearbyCommunity(item, index)"
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
        <view class="mycommunities">
          <view
            v-for="(item, index) in mycommunities"
            :key="index"
            @click="selectGuanzhuCommunity(item, index)"
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
        <view class="bottom-btn" v-if="mycommunities.length + nearbycommunities.length > 0">
          <button
            class="guanzhu-btn"
            @tap="close" 
          >
            确定 
          </button>
        </view>
        <uni-search-bar
          placeholder="搜索小区"
          clearButton="none"
          @confirm="getCommunities"
        ></uni-search-bar>

        <radio-group  >
          <view class="communitylist"
            v-for="(item, index) in communitylist" :key="index"
          >
            <view class="left"> 
              <view class="top">
                {{item.letter}}
              </view>
              <view class="items" > 
                <view class="item" v-for="(communityitem, communityindex) in item.data" :key="communityindex">
                 <radio class="itemradio"  
                 :color="`#ff8000`" 
                 @tap="radioTap(communityitem[1], communityitem[2],communityitem[0])"
                 :checked="communityitem[2] === currentcommunity"
                 :value="communityitem[1]"   />
                 <view class="communityname"
                  @tap="radioTap(communityitem[1], communityitem[2],communityitem[0])" >{{communityitem[0]}}</view>
                </view>
              </view>
            </view>
            <view class="right">
              {{item.letter}}
              </view>
          </view>
        </radio-group>

        <view class="bottom-btn">
          <button
            class="guanzhu-btn"
            @tap="close" 
          >
            确定 
          </button>
        </view>
         <view class="tips">
          <view class="title">
            <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
            <text>温馨提示:</text>
          </view>
          <view class="appraisetxt">
            关注小区可更快选择小区，更快获取小区信息, <text class="txtclick" @tap="target('/pages/user/communities')">去关注小区</text>
          </view> 
        </view>
      </view> 
    </s-popup>
  </view>
</template> 
<script> 
import {
  getAnonymousCommunities,
  getProprietorCommunities,
  manageProprietorCommunities,
  getNearbyCommunitiesApi
} from "@/api/community"; 
import permision from "@/components/js_sdk/wa-permission/permission.js"
import sPopup from "@/components/s-popup/index.vue"; 
import Vue from 'vue'
export default {
  props: [
    "communityuuid", 
    "communityname",  
    "baseAppUrl" ,
    
  ],
  components: {
    sPopup
  },
  data() {
    return { 
      communitylist:[],
      mycommunities: [], // 我关注的小区
      nearbycommunities: [], //附近小区 
      currentcommunity:"",
      selectCommunities: [], 
      position: {},
      hasLogin: this.$mStore.getters.hasLogin  
    };
  },   
  methods: { 
    async requestAndroidPermission() {
				var androidlocation = permision.checkSystemEnableLocation();
				var result = await permision.requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION');
				if (androidlocation == false && result == 1) {
					uni.showModal({
						title: '',
						content: '开启定位可快速定位附件小区，请您打开定位服务功能',
						confirmText: '去设置',
						showCancel: false, // 不显示取消按钮
						success: function(res) {
							if (res.confirm) {
								var main = plus.android.runtimeMainActivity(); //获取activity
								var Intent = plus.android.importClass('android.content.Intent');
								var Settings = plus.android.importClass('android.provider.Settings');
								var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
								main.startActivity(intent);
							}
						}
					});
				}  
			},
    switchCommunity() {
      this.getNearbyCommunities();
      this.getCommunities();
      this.proprietorCommunities();
      this.openPopup();
    },
    setNearbyList(communities){ 
       this.nearbycommunities = []; // 附近小区
        for (let i = 0; i < communities.length; i++) {
          var communityuuid = communities[i][1]; 
          if ( (this.communityuuid == "" || this.communityuuid == "undefined") && i == 0  )
           {
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
    getCommunities(result="") { 
	    let name = ""
      if (result){
        name = result.value
      } 
      getAnonymousCommunities({ 
		    name:name
      }).then((res) => {
          if (res.status == 0) { 
            this.communitylist = res.msg;  
          }
        }); 
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
          if (this.communityuuid == "" || this.communityuuid == "undefined") {
            this.getNearbyCommunities();
            this.getCommunities();
            this.proprietorCommunities();
            setTimeout(() => {
              this.openPopup();
            }, 2000);
          }
        },
        fail:(res)=>{
           console.log(res) 
           if (this.communityuuid == "" || this.communityuuid == "undefined") {
            
            this.getCommunities();
            this.proprietorCommunities();
            setTimeout(() => {
              this.openPopup();
            }, 2000);
          }
        },
      });
    },
    radioTap(communityuuid,communityindex, communityname ){ 
       this.currentcommunity = communityindex
       for (let i = 0; i < this.mycommunities.length; i++) { 
          Vue.set(this.mycommunities[i], 2, false)   
        }
        for (let i = 0; i < this.nearbycommunities.length; i++) { 
          Vue.set(this.nearbycommunities[i], 4, false)   
        } 
       this.setDefaultCommunity(communityuuid,communityname)
    },
    getNearbyCommunities(refresh = false){
      // refresh = true时，强制刷新附近小区 
        this.nearbycommunities = uni.getStorageSync("nearbycommunities");  
        if(this.nearbycommunities.length > 0 && refresh == false){
          //有缓存数据 
          this.setNearbyList(this.nearbycommunities) 
        }
        else{  
          if (this.position.longitude == undefined){ 
            // 提示没有设置定位权限
            if(uni.getSystemInfoSync().platform === 'android'){
              this.requestAndroidPermission()
            } 
            return 
          } 
           getNearbyCommunitiesApi({
              longitude: this.position.longitude,
              latitude: this.position.latitude, 
            }).then((res) => {
              if (res.status == 0) {
                uni.setStorageSync("nearbycommunities", res.msg)
                this.setNearbyList(res.msg)
                if(refresh){
                  uni.showToast({
                    icon:"success",
                    title:"已更新"
                  })
                }
              }
            })  
        } 
    },
    selectGuanzhuCommunity(item, index) {
      // 从关注中选择默认的小区
      /**
		  item= ["当代宏府MOMΛ", "3409b7a2-0a6b-4949-ba20-e2cdc4e56110", "34.25567", "108.871415", false]
		 */ 
      for (let i = 0; i < this.nearbycommunities.length; i++) { 
        Vue.set(this.nearbycommunities[i], 4, false)   
      } 
      for (let i = 0; i < this.mycommunities.length; i++) {
        if (i == index) {
          Vue.set(this.mycommunities[i], 2, true) 
        } else {
          Vue.set(this.mycommunities[i], 2, false) 
        }
      } 
      this.setDefaultCommunity(item[0], item[1]);
    }, 
    nearbyCommunity(item, index) {
      /**
		  item= ["当代宏府MOMΛ", "3409b7a2-0a6b-4949-ba20-e2cdc4e56110", "34.25567", "108.871415", false]
		 */ 
      for (let i = 0; i < this.mycommunities.length; i++) { 
        Vue.set(this.mycommunities[i], 2, false)   
      }
      for (let i = 0; i < this.nearbycommunities.length; i++) {
        if (i == index) {
          Vue.set(this.nearbycommunities[i], 4, true)  
        } else {
          Vue.set(this.nearbycommunities[i], 4, false)  
        }
      }
      this.setDefaultCommunity(item[1], item[0]);
    },
    setDefaultCommunity(communityuuid, name) {
      // 设置默认的小区  
        uni.setStorageSync("communityuuid", communityuuid);
        uni.setStorageSync("communityname", name);
        // 触发事件 
        this.$parent.setDefaultCommunity( 
           communityuuid,
           name
         );
    }, 
    openPopup() { 
      this.$refs.popupCommunity.show("top");
    }, 
    close(){
      // #ifdef MP-WEIXIN
      //订阅微信物业通知 
      wx.requestSubscribeMessage({
        tmplIds:['u01rJ4c5zbGZCwQOrNWJmWaVkn27nZiwv-zB-atEmX0'],
        success (res) { 
             console.log(res)
           },
           fail(res){
             console.log(res)
           }
      }) 
      // #endif
      this.$refs.popupCommunity.hide()
    }, 
    proprietorCommunities() {
	  // 获取我的关注列表
      if (this.hasLogin) {
        getProprietorCommunities().then((res) => { 
          this.mycommunities = []; 
          for (let i = 0; i < res.msg.length; i++) {
            
            var communityuuid = res.msg[i][0]; 
            if (this.communityuuid == communityuuid) {
              res.msg[i].push(true);
              this.mycommunities.push(res.msg[i]);
            } else {
              res.msg[i].push(false);
              this.mycommunities.push(res.msg[i]);
            }
          }
          console.log(res.msg)
        });
      }
    }, 
    deletenearbyCommunity(uuid) {
	  // 取消关注
      let data = {
        uuids: uuid,
        method: "delete",
      };
      manageProprietorCommunities(data)
        .then((res) => {
          if (res.status == 0) {
            uni.showToast({
              title: res.msg,
              icon: "success",
              duration: 3000,
            });
          } else {
            uni.showToast({
              title: "系统繁忙",
              icon: "error",
              duration: 3000,
            });
          }
        })
        .finally(() => {
          this.proprietorCommunities();
        });
    },
  },
};
</script>

<style lang="scss" scoped> 
.communitylist{
    width: 750rpx;
    display: flex;
    .left{
        width: 700rpx;
        .top{
            padding-left:25rpx;
            width: 700rpx;
            font-weight: bold;
            line-height: 70rpx;
            color:$base-color;
            font-size: 20px;
            background-color: rgba(138,138,138, 0.1);
            border-bottom: 1px solid $border-color-light;
        }
        .items{
            
            .item{
                display: flex;
                color:$font-color-base;
                line-height: 80rpx;
                border-bottom: 1px solid $border-color-light;
                .itemradio{
                    margin-left: 25rpx;
                    margin-right:25rpx;
                }
                .communityname{
                    line-height: 80rpx;
                    width:600rpx;
                }
            }
        }
    }
    .right{
        width: 50rpx;
        background-color: $background-color-gray;
        color:white;
        font-size: 20px;
        display: flex;
        font-weight: bold;
        flex-direction: row;
        align-items: center;
        text-align: center;
        padding-left:10rpx;
    }
}
 .popupCommunity{
    width: 750rpx; 
    border-radius: 20rpx;  
    .close {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        height: 50rpx;
        width: 50rpx;
    }
   
    .popupholder{
        background-color: #FFFFFF;
        display: block;
        margin-top:50rpx;
        width: 750rpx;
        height: 1300rpx !important;
        overflow: auto;
        .tips{
          margin :15rpx;
          padding-bottom:  200rpx;
        }
        .title{
           font-size:20px; 
           text-align: center;
           color:$font-color-base;
           border-bottom: 2px solid $base-color;
        }        
        .reload:after {
            font-family: uniicons;
            font-size: 40upx;
            content: "\e462";
            color:$base-color;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }

        .reload{
            margin-left: 15rpx;
            color:$base-color;
        } 
        .mycommunities{
            display: flex;
            justify-content: space-between;
            flex-flow: wrap;
            text-align: center;  
            .nearcommunityholder{
                margin:15rpx;
                padding:0 15rpx;
                border-radius: 40rpx;
                border-style: solid;
                border-width: 1px;
                border-color: $uni-border-color;
                display: flex;
                .nearcommunitylabel{ 
                    margin-top:15rpx;
                }
            }
        }
        
        .bottom-btn{
            margin-top:25rpx;
            width:750rpx;
            text-align: center;
        }
        .guanzhu-btn {
            width: 280rpx; 
            background-color: $base-color;
            color:$color-white;
        } 
        .s-popup-wrap {
            height: 900rpx;
            width: 750rpx;
        } 
    } 
}
</style>
