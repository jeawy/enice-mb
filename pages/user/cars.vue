<template>
  <view class="main">
      <view class="v-findphone">
        <input v-model="carnumber"  @input="changeCarnumber(0)" 
            placeholder="输入车牌" class="inputcarnumber"/>
        <view class="bottom-btn">
          <button class="draft-btn" @tap="findphone">获取手机号码</button> 
        </view>
        <view class="phones" v-if="phones.length > 0">
          <view class="items" v-for="(item, index) in phones" :key="index"> 
            <view class="phone" @tap="call(item.phone)">点击拨打电话:{{item.phone}}</view> 
          </view> 
        </view>
        <view class="tips">
          <view class="title">
            <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
            <text>温馨提示:</text>
          </view>
          <view class="appraisetxt">1、输入车牌查询车主手机号码</view>  
          <view class="appraisetxt">2、必须输入完整的车牌信息</view>
          <view class="appraisetxt">3、车牌找人方便您快速联系车主，进行挪车等操作，切勿进行违法活动。</view>  
        </view> 
      </view> 
      <view class="line"></view>
      <view class="v-mycars"><!--我绑定的车牌-->
      <view class="btn">
          <button class="draft-btn" @tap="bindphone">绑定新车牌</button>  
        </view>
        <view class="title">我的车</view> 
        <view class="items" v-for="(item, index) in mycars" :key="index">
          <view class="carnumber">{{item.carnumber}}</view>
          <view class="phone">{{item.phone}}</view>
          <view class="phone"><image :src="baseAppUrl+`close.png`" 
          class="close" @tap="removecar(item.id, index)" /></view>
        </view>
        <view class="items" v-if="mycars.length == 0">
          <view class="notbind">未绑定任何车牌</view> 
        </view>
        
      </view> 
       <view class="tips" v-if="hasLogin">
            <view class="title">
              <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
              <text>温馨提示:</text>
            </view>
            <view class="appraisetxt">绑定车牌即您认可其他用户可以通过车牌获取您绑定的手机号码</view>  
       </view>

      <s-popup custom-class="popupColumns" ref="popup" type="top">
        <view class="popup-holder"> 
          <image :src="baseAppUrl+`close.png`" class="close" @tap="close" />
          <view class="v-title">
            <input v-model="newcarnumber" 
             @input="changeCarnumber(1)" 
              placeholder="输入车牌" class="newcarnumber"/>
            <input v-model="newphone" 
            class="newcarnumber"
                placeholder="绑定的手机号码" /> 
          </view> 
          <button class="btn-add-new" @tap="bindnew">绑定</button> 
          <view class="tips">
            <view class="title">
              <image :src="baseAppUrl + 'tishi.png'" class="tishi" />
              <text>温馨提示:</text>
            </view>
            <view class="appraisetxt">绑定车牌即您认可其他用户可以通过车牌获取您绑定的手机号码</view>  

          </view>
        </view> 
		</s-popup>   
  </view>
</template>

<script>
import { getCarPhone, bindCars, unbindCars, getCars } from "@/api/cars";
import sPopup from "@/components/s-popup/index.vue";
export default {
  components: {   
			sPopup, 
		},
  data() {
    return {
      phones:[],
      carnumber:"",
      mycars: [],
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      loading: false,
      hasLogin: false,
      newcarnumber:"",
      newphone:""
    };
  },

  onShow() {
    this.hasLogin = this.$mStore.getters.hasLogin;
    if(this.hasLogin){
      this.getMyCars()
    } 
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
  },
  methods: {
    call(phone){
      uni.makePhoneCall({
        phoneNumber:phone
      })
    },
    getMyCars(){
      getCars({}).then(({ status, msg })=>{
        this.mycars = msg 
      })
    },
    removecar(id, index){ 
      let _this = this
				uni.showModal({
					title: '',
					content: '确定要解除车牌绑定吗？',
					confirmText: '解除',
					confirmColor: '#ff3b32',
					success: function(res) {
						if (res.confirm) { 
							const data = {  
							method: 'delete',
							ids : id,
							}
							 unbindCars(data).then((res)=>{
								if (res.status == 0){ 
								    uni.showToast({
										icon: "success",
										title: '删除成功!',
										duration: 3000
									});
									_this.mycars.splice(index, 1)
							 	}
								 else{
									 uni.showToast({
										icon: "error",
										title:res.msg,
										duration: 3000
									});
								 } 
							 });
							 
						} else if (res.cancel) {
							
						}
					}
				});
    },
    bindnew(){
      if (this.newcarnumber.length == 0){
        uni.showToast({
          icon:'error',
          title:"请输入车牌"
        })
        return
      }
      if (this.newphone.length == 0){
        uni.showToast({
          icon:'error',
          title:"请输入手机号码"
        })
        return
      }
      let data = {
        carnumber:this.newcarnumber,
        phone:this.newphone
      }; 
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      })
      bindCars(data)
        .then(({ status, msg }) => {
          console.log(msg)
          if (status == 0 ){
            uni.showToast({
              icon:"success",
              title:"绑定成功",
              duration:3000,
            })
            this.$refs.popup.hide()
            this.getMyCars()
          } 
          else{
            // 有多个车主绑定了该车牌
            uni.showToast({
              icon:"error",
              title:msg,
              duration:3000,
            })
          }
        })
        .finally((res) => {
          uni.hideLoading()// = false;
        }); 
    },
    bindphone(){
      if (this.hasLogin){
        this.$refs.popup.show("top") 
      }
      else{
        this.$mHelper.backToLogin()
      } 
    },
    close(){
      this.$refs.popup.hide()
    },
    changeCarnumber(type = 0 ){
      if (type == 0){
        this.carnumber = this.carnumber.toUpperCase()
        this.carnumber = this.carnumber.replace(/(^\s*)|(\s*$)/g,"")
      }
      else{
        this.newcarnumber = this.newcarnumber.toUpperCase()
        this.newcarnumber = this.newcarnumber.replace(/(^\s*)|(\s*$)/g,"")
      } 
    },
    findphone(){ 
      let params = {
        carnumber:this.carnumber
      }; 
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      })
      getCarPhone(params)
        .then(({ status, msg }) => {
          if (status == 1){
            uni.showToast({
              icon:"error",
              title:msg,
              duration:4000,
            })
            return
          }
          if (msg.length == 0 ){
            uni.showToast({
              icon:"error",
              title:"未找到车主号码",
              duration:4000,
            })
          }
          else if (msg.length == 1 ){
            // 直接拨打电话 
            uni.makePhoneCall({
              phoneNumber: msg[0].phone,
            });
          }
          else{
            // 有多个车主绑定了该车牌
            uni.showToast({ 
              title:"找到"+msg.length+"个号码",
              duration:3000,
            })
            this.phones = msg
          }
        })
        .finally((res) => {
          uni.hideLoading()// = false;
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
    getRooms() {
      let params = {};
      this.loading = true;
      getMyRooms(params)
        .then(({ status, msg }) => {
          if (status == 0) {
            this.myrooms = msg;
            let rooms = [] //缓存房号
            this.myrooms.forEach(item =>{
              rooms.push( item.unit__building__name +  item.unit__name + item.name )
            })
            uni.setStorageSync("rooms", rooms)
          } else {
            uni.showToast({
              title: msg,
              icon: "error",
              duration: 3000,
            });
          }
        })
        .finally((res) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.main{
  width:700rpx;
  margin-left: 25rpx;
  .line{
    border-bottom: 2px solid white;
    margin-bottom: 15rpx;
    box-shadow: 0px 0px 5px $border-color-base;
  }
  .v-mycars{
    .title{
      font-size: 30px;
      width: 220rpx;
      border-bottom: 4px solid $base-color;
    }
    .btn{
      width: 260rpx; 
      position: absolute;
      right: 15rpx;
      margin-top:0rpx;
      .draft-btn{
        color:white;
         background-color: $base-color ; 
      }
    }
    .items{
      width: 700rpx;
      justify-content: space-between;
      display: flex;
      padding-top: 15rpx;
      .carnumber{
        background-color:#13227a;
        color:white;
        padding-left:15rpx;
        padding-right:15rpx; 
        font-size: 25px;
      }
      .notbind{
        width: 700rpx;
        text-align: center;
        color:#bfbfbf;
        font-size: 18px;
        margin: 60rpx auto;
      }
      .phone{
        font-size: 25px;
      }
      .close{
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  .v-findphone{
    text-align: center;
    .phones{
      .items{
        .phone{
          font-size: 20px; 
          margin-top:5rpx;
        } 
      }
    } 
    .inputcarnumber{
      color:#13227a;
      margin-top: 40rpx;
      margin-left:100rpx;
      width: 500rpx;
      font-size: 40px;
      text-align: center;
      border:none;
      height: 40px;
      border-bottom: 4px solid  $base-color;
    }
    .draft-btn{
      margin-top: 40rpx;
      width: 500rpx;
      color:white;
      background-color: $base-color ;
    }
    .tips{
      text-align: left;
    }
  }
}
.tips{
  margin: 25rpx;
}
.popupColumns{
			.popup-holder{ 
				min-height:  400rpx;  
				padding: 50rpx;
				background-color: $color-white;  
				.v-title{ 
            margin-top: 60rpx;
						width: 700rpx;
						margin-bottom: 30rpx;
            .newcarnumber{
              font-size:20px;
              width: 600rpx;
              margin-top: 25rpx;
              line-height: 20px;
              border-bottom: 2px solid $base-color; 
            }
					}
          .btn-add-new{
            background-color: $base-color;
            color:white;
          }
			 
				width:700rpx;  
			}
			.close{
				position: absolute;
				top:10rpx;
				right:10rpx;
				height: 50rpx;
				width: 50rpx; 
			}

		}
 
 
</style>
