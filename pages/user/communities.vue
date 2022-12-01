<template>
  <view class="main"> 
     <checkbox-group @change="selectedCommunities">
    <view class="communitylist"
            v-for="(item, index) in mycommunities" :key="index"
          >
            <view class="left"> 
              <view class="top">
                {{item.letter}}
              </view>
              <view class="items" > 
                <view class="item" v-for="(communityitem, communityindex) in item.data" :key="communityindex">
                 <checkbox  class="itemradio"  
                 :color="`#ff8000`"  
                 :value="communityitem[1]"   />
                 <view class="communityname"  >{{communityitem[0]}}</view>
                </view>
              </view>
            </view>
            <view class="right">
              {{item.letter}}
              </view>
          </view>  
     </checkbox-group> 
          <view class="btns">
          <button
            class="btn"
            @tap="cancelCommuntiesBtn" 
          >
            取消关注 
          </button>
          <button
            class="btn"
            @tap="openPopup" 
          >
            关注更多小区 
          </button>
        </view> 
       <s-popup custom-class="popupCommunity" ref="popupCommunity" type="top">
      <view class="popupholder">
        <view class="title">关注小区</view>
        <image :src="baseAppUrl+`close.png`" class="close" @tap="close" />
          
        <uni-search-bar
          placeholder="搜索小区"
          clearButton="none"
          @confirm="getCommunities"
        ></uni-search-bar>

      <checkbox-group @change="selectedNewCommunities">
          <view class="communitylist"
            v-for="(item, index) in communitylist" :key="index"
          >
            <view class="left"> 
              <view class="top">
                {{item.letter}}
              </view>
              <view class="items" > 
                <view class="item" v-for="(communityitem, communityindex) in item.data" :key="communityindex">
                 <checkbox class="itemradio"  
                 :color="`#ff8000`"  
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
      </checkbox-group>

        <view class="bottom-btn">
          <button
            class="guanzhu-btn"
            @tap="btnGuanzhu" 
          >
            关注 
          </button>
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
import sPopup from "@/components/s-popup/index.vue"; 
export default {
  components: {
    sPopup
  },
  data() {
    return {
      addCommunties:"",
      selectCommunities:[],
      nearbycommunities:[], 
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      loading: false,
      hasLogin: false,
      cancelCommunties:"",// 取消关注的列表
      communitylist:[],
      mycommunities:[]
    };
  },

  onShow() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    if (!this.hasLogin) { 
      this.$mHelper.backToLogin();
    } else {
       this.getCommunities()
       this.proprietorCommunities()
    }
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl; 
  },
  methods: {
    cancelCommuntiesBtn(){
      if (!this.hasLogin) {
        uni.showModal({
          content: "关注小区需要先登录，是否跳转登录页面？",
          success: (confirmRes) => {
            if (confirmRes.confirm) {
              this.$mRouter.push({
                route: "/pages/public/logintype",
              });
            }
          },
        });
      }
      else{
        //取消关注
       let data = {
          uuids: this.cancelCommunties,
          method:"delete"
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
      this.proprietorCommunities() 

      }  
      
    },
    selectedCommunities(e){
      // 取消关注
      this.cancelCommunties = e.detail.value+""
    },
    selectedNewCommunities(e){
      // 取消关注
      this.addCommunties = e.detail.value+""
    },
    proprietorCommunities() {
	  // 获取我的关注列表
      if (this.hasLogin) {
        getProprietorCommunities({sort:1}).then((res) => { 
          console.log(res)
          this.mycommunities =res.msg;  
        });
      }
    },
    getNearbyCommunities(refresh = false){
      // refresh = true时，强制刷新附近小区
       
        this.nearbycommunities = uni.getStorageSync("nearbycommunities"); 
        if(this.nearbycommunities && refresh == false){
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
    openPopup(){
      if (!this.hasLogin) {
        uni.showModal({
          content: "关注小区需要先登录，是否跳转登录页面？",
          success: (confirmRes) => {
            if (confirmRes.confirm) {
              this.$mRouter.push({
                route: "/pages/public/logintype",
              });
            }
          },
        });
      }
      else{
         this.$refs.popupCommunity.show("top") 
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
     close(){
      this.$refs.popupCommunity.hide()
    },
    selectCommunity(res) {
      /**
		 * {
			"item": {
				"key": "D",
				"name": "当代宏府MOMΛ",
				"itemIndex": "3409b7a2-0a6b-4949-ba20-e2cdc4e56110",
				"checked": false
			},
			"select": []
		}
		 */
    console.log(res.select)
      this.selectCommunities = res.select;
      if (this.selectCommunities.length > 0) {
        this.guanzhuDisabled = false;
      } else {
        this.guanzhuDisabled = true;
      }
      console.log(this.selectCommunities);
    },
    btnGuanzhu() {
      // 关注小区按钮点击事件
       
         
        let data = {
          communityuuids: this.addCommunties,
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
              console.log(res.msg);
              uni.showToast({
                title: "系统繁忙",
                icon: "error",
                duration: 3000,
              });
            }
          })
          .finally(() => { 
            this.proprietorCommunities();
            this.close()
          });
      
    },
    navTo(route) {
      if (!route) {
        return;
      }
      this.$mRouter.push({
        route: route,
      });
    },
     
  },
};
</script>

<style lang="scss" scoped>
.communitylist{
  background-color: white;
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
        .title{
           font-size:20px; 
           text-align: center;
           color:#8a8a8a;
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
