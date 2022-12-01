<template>
  <view class="rf-index">
    <!-- 顶部信息 -->
    <view class="header">
      <view class="header-top">
        <view class="city_search" @tap="switchCommunity">
          <view class="location">
            <image
              class="location_img"
              :src="baseAppUrl + `home/xiaoqu.svg`"
            ></image>
          </view>
          <view class="communityholder">
            <text class="location_text">{{ communityname }}</text>
            <image
              class="select-down"
              :src="baseAppUrl + `home/sanjiao.svg`"
            ></image>
          </view>
        </view>
        <view class="logo">
          <image class="logo_img" :src="baseAppUrl + `home/logo1.png`"></image>
        </view>
      </view>
    </view> 
    <view class="main_content">
      <!-- 轮播图 -->

      <view class="swiperview">
        <swiper
          @change="handleDotChange"
          :Lautoplay="true"
          :current="swiperCurrent"
          :circular="true"
          class="swiper"
        >
          <swiper-item v-for="(item, index) in swiperImg" :key="index" @click="gotoUrl(item.url)">
            <view class="swiper-item">
              <image :src="item.image" mode="aspectFill" class="swiperimage" />
            </view>
          </swiper-item>
          <view class="dots">
            <block v-for="(item, index) in swiperImg.length" :key="item">
              <view
                class="dot"
                :class="index == swiperCurrent ? ' active' : ''"
              ></view>
            </block>
          </view>
        </swiper>

        <!-- 轮播指示点样式修改 -->
      </view>
      <!-- 分类列表 -->
			<view class="fct-center"> 
			  <view
			    v-for="(item, index) of commenUseList"
			    :key="index"
			    class="common-function__item"
			    @tap="target(item.url)"
			  > 
         <view class="item"> 
				    <uni-badge class="uni-badge-margin" type="error" :text="item.value" absolute="rightTop" size="small">
		        </uni-badge>
            <image 
              class="common-function__img"
              :src="baseAppUrl+`${item.src}.png`"
            /> 
            <view class="fct-content">{{ item.name }}</view> 
         </view>
			  </view> 
			</view>
      
      <view class="new_bottom" v-if="unreadMsgCount > 0">
        <view class="new_top">
		    	<view class="msgtitle">您有<view class="badge">{{unreadMsgCount}}</view>条新消息</view>
		   	</view>
        <uni-list>
          <uni-list-item 
                v-for="(item, index) in newsList"
                :key="index"
                :title="item.title" 
                link="navigateTo"
                @click="readMsg(item.appurl, item.id)"
                :note="item.date | time(item.date)" 
                :thumb="item.entity_type| entity_type_img( baseAppUrl)"
                thumb-size="lg" 
                :rightText="item.entity_type | entity_type_txt">
          </uni-list-item> 
        </uni-list>
        <view class="bottom"> </view>
      </view>
      <view v-if="unreadMsgCount > 0" class="search" @tap="target('/pages/user/notice/notice')">
        <view class="search_more">查看更多</view>
      </view>

      <view class="new_bottom">
        <view class="new_top">
		    	<text class="bottom_text">通知公告</text>
		   	</view>
        <uni-list  v-if="noticesList.length > 0">
          <uni-list-item 
                v-for="(item, index) in noticesList"
                :key="index"
                :title="item.title" 
                link="navigateTo"
                :to="`/pages/notice/detail?uuid=`+item.uuid"
                :note="item.date | time(item.date)" 
                :thumb="item.product_type==1?baseAppUrl+`home/tongzhiy.png`:baseAppUrl+`home/gonggaoy.png`"
                thumb-size="lg" 
                :rightText="item.product_type==1?'通知':'公告'">
          </uni-list-item> 
        </uni-list>
        <view v-else class="bottom">本小区无通知公告</view>
      </view>
      <view class="search" @tap="target('/pages/notice/index')">
        <view class="search_more">查看更多</view>
      </view>
     
     <view class="aunt_bottom">
        <view class="aunt_top"><text class="bottom_text">正在登记</text></view>
		 <uni-list v-if="recordList.length > 0">
			<uni-list-item 
            v-for="(item, index) in recordList"
			:key="index"
			:title="item.title" 
      link="navigateTo"
      :to="`/pages/record/detail?uuid=`+item.uuid" 
			:note="item.date | time(item.date)" 
			:thumb="baseAppUrl+`excely.png`"
			thumb-size="lg" 
			rightText="去登记"></uni-list-item>
			 
		</uni-list>
        <view v-else class="bottom">本小区无公开登记薄</view>
      </view>
      <view class="search" @tap="target('/pages/record/record')">
        <view class="search_more">查看更多</view>
      </view>

      <!--广告-->
      <view class="ads">
        <view class="ads_left">
          <image :src="baseAppUrl + `ads/bottom.png`" />
        </view> 
      </view>

      <view class="bottom_assure">
        <view class="assure_one">
          <view class="assure_text">平台用户业主认证</view>
          <image
            style="width: 28rpx; height: 28rpx"
            class="bottom_img"
            :src="baseAppUrl + `home/correct.svg`"
          ></image>
        </view>
        <view class="assure_one">
          <view class="assure_text">信息化物业</view>
          <image
            style="width: 28rpx; height: 28rpx"
            class="bottom_img"
            :src="baseAppUrl + `home/correct.svg`"
          ></image>
        </view>
        <view class="assure_one">
          <view class="assure_text">管家式平台服务</view>
          <image
            style="width: 28rpx; height: 28rpx"
            class="bottom_img"
            :src="baseAppUrl + `home/correct.svg`"
          ></image>
        </view>
      </view>
    </view>
    <switchCommunities
    :setDefaultCommunity=setDefaultCommunity
    :communityuuid=communityuuid
    :baseAppUrl=baseAppUrl
    :communityname=communityname
     ref="communities"></switchCommunities>
      <Contact    > </Contact>
    <rf-protocol-popup ref="mapState" @popupState="popupState" protocolPath='/pages/set/about/detail?field=protocol_register&title=服务协议'
		 policyPath='/pages/set/about/detail?field=protocol_privacy&title=隐私协议' v-if="isRfProtocolPopupShow"></rf-protocol-popup>
  </view>
</template>
<script>

import {getNotices, updateNotice} from "@/api/notice";
import { speadList } from "@/api/spread";
import rfProtocolPopup from '@/components/rf-protocol-popup'

import {  getNoticesApi } from "@/api/product"; 
import {getAnonymousRecord} from '@/api/record'; 
import { getCrtApi } from "@/api/crt";
import sPopup from "@/components/s-popup/index.vue"; 
import switchCommunities from "@/components/communities"
import Contact from "@/components/contact"
import {ApiStatCount, ApiStatIconsCount} from "@/api/statistic";
import Vue from 'vue'
export default {
  data() {
    return {
      isRfProtocolPopupShow:false,
      isLoginDisabled:false,
      newsList:"",//新消息
      unreadMsgCount:0,// 未读消息数 
      city: "", //当前所在的城市名称
      //cityVisiable:false,
      swiperImg: [
        // 轮播图图片
      ], 
      communitycount :0,  
      communityuuid: "",
      recordList:[],
      noticesList:[], // 通知公告
      communityname: "请选择小区",
      baseurl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      swiperCurrent: 0, // 轮播图index
      infolst: [],
      newbee_infolst: [],
      commenUseList: [
        /*
        {
          name: "投票",
          id: 38,
          src: "toupiao",
          url:"/pages/repair/list"
        },*/
        {
          name: "社区见闻",
          id: 29,
          src: "xinwen",
          url:"/pages/news/index",
          value:0
        },
        {
          name: "百事通",
          id: 27,
          src: "baishitong",
          url:"/pages/usefulinfo/index",
          value:0
        },
         {
          name: "消息中心",
          id: 40,
          src: "xiaoxibk",
          url:"/pages/user/notice/notice",
          value:0
        },
        {
          name: "有偿服务",
          id: 40,
          src: "jiedan",
          url:"/pages/paidservice/list",
          value:0
        },
       
        {
          name: "报修服务",
          id: 41,
          src: "wujin",
          url:"/pages/repair/list",
          value:0
        },
        //第二行 
        /*{
          name: "便民生活",
          id: 42,
          src: "ws2",
          url:"/pages/lifes/index",
          value:0
        }, */
        {
          name: "积分好礼",
          id: 44,
          src: "lipin",
          url:"/pages/user/giftcenter/giftcenter",
          value:0
        },
         {
          name: "历史账单",
          id: 45,
          src: "zhangdan3",
          url:"/pages/cart/cart?tabCurrentIndex=2&status=2",
          value:0
        },
         {
          name: "物业缴费",
          id: 45,
          src: "jiaofei3",
          url:"/pages/cart/cart",
          value:0
        }, 
        {
          name: "闲置+租售",
          id: 47,
          src: "exchanges1",
          url:"/pages/exchanges/list",
          value:0
        },
       {
          name: "车牌找人",
          id: 43,
          src: "chepaizhaor",
          url:"/pages/user/cars",
          value:0
        },
        
      ],  
      hasLogin: this.$mStore.getters.hasLogin,

      // config: {}, // 商户配置
      // announceList: [], // 公告列表
      // loading: true,
      // hotSearchDefault: '请输入关键字',
      // newsBg: this.$mAssetsPath.newsBg,
      // errorImage: this.$mAssetsPath.errorImage
    };
  },
  components: {
    sPopup,
    rfProtocolPopup,
    switchCommunities,
    Contact
  },
  onShow() { 
    // #ifdef APP-PLUS
    plus.navigator.setFullscreen(true);
    // #endif 
    this.communityuuid = uni.getStorageSync("communityuuid");
    this.communityname = uni.getStorageSync("communityname");
    if (this.communityname == "") {
      this.communityname = "请选择小区";
    }
    if (this.hasLogin){
      // 已经登录获取最新未读通知
      this.getNewsList()
      this.getMsgCount()
    }
  	this.getCommunityContent() 
  },
  //如果不加这句，会导致跳转到别的页面后也是全屏
  onHide() {
    // #ifdef APP-PLUS
    plus.navigator.setFullscreen(false);
    // #endif
  },
  onLoad() { 
    if(uni.getSystemInfoSync().platform === 'android'){ 
      this.isLoginDisabled = uni.getStorageSync('notFirstTimeLogin');
      if (this.isLoginDisabled == undefined || this.isLoginDisabled == ""){
        this.isRfProtocolPopupShow = true 
      }
    }
    this.baseurl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl; 
    
    this.initData();
    this.communityuuid = uni.getStorageSync("communityuuid");
    this.communityname = uni.getStorageSync("communityname");
    if (this.communityname == "") {
      this.communityname = "请选择小区";
       setTimeout(() => {
              this.doGetLocation();
            }, 2000);
      
    } 
    
  },
  onShareAppMessage() {
    return {
      title: "欢迎来到社区互通",
      path: "/pages/index/index",
    };
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getIndexList("refresh");
  },
  methods: {
    gotoUrl(url) { 
				if (url != ""){
						this.$mRouter.push({
						route: url
					}) 
				} 
			},
    doGetLocation(){
      console.log(this.$refs.communities)
      this.$refs.communities.doGetLocation()
    },
    switchCommunity(){
      this.$refs.communities.switchCommunity()
    },
    // 监听是否同意协议
    popupState(e) {
      if(uni.getSystemInfoSync().platform === 'android'){ 
          if (e) {
            this.isLoginDisabled = false;
            uni.setStorageSync('notFirstTimeLogin', true);
            this.isRfProtocolPopupShow = false;
          } else {
            this.isLoginDisabled = true;
            uni.setStorageSync('notFirstTimeLogin', false);
            this.isRfProtocolPopupShow = false;
          } 
        }  
    }, 
    readMsg(route, id){
      console.log(route)
      this.$mRouter.push({route})
      //标记消息为已读
      let data={
        ids:id,
        read:1
      }
      updateNotice(data).then((res)=>{
        console.log(res)
        this.getNewsList()
      }) 
    },
    getMsgCount(){
      // 统计“我的”页面角标数字
      ApiStatCount().then((res)=>{
        let total = 0
          total += res.msg.unread_notice_count
          total += res.msg.unfinished_count
          total += res.msg.repaircount
          total += res.msg.paidservicecount
          total += res.msg.unreadcount 
        if (total > 0)
        { 
          uni.setTabBarBadge({
            index:4,
            text:  ''+total
          }) 
        }
        else{
          uni.removeTabBarBadge({
            index:4, 
          }) 
        }
        
      }) 
    },
    getNewsList(){
      // 获取最新未读的通知信息
      let params = {
					page : 1,
					pagenum : 2,
          read:0,// 未读消息 
				}
				getNotices(params).then(res=>{ 
          
					if(res.status == 0){ 
            console.log(res.msg)
            this.newsList = res.msg.list
						this.unreadMsgCount = res.msg.unreadcount 
            let item = this.commenUseList[2]
              item.value = this.unreadMsgCount
              Vue.set(this.commenUseList, 2, item)
            // 设置底部菜单角标
            if (this.unreadMsgCount > 0)
            {
              uni.setTabBarBadge({
                index: 0,
                text: this.unreadMsgCount+''
              }) 
              
            }
            else{
              uni.removeTabBarBadge({
                index:0, 
              }) 
            }  
					}else {
						uni.showToast({
              title: res.msg,
              icon: "error",
              duration: 3000,
						});
					}
				})
    }, 
    
    getCrts( ) {
      let params = {};
      if(!this.hasLogin){
        // 未登录无法获取
        return
      }
      getCrtApi(params)
        .then(({ status, msg }) => {
          if (status == 0) {
            let communityList = msg; 
            uni.setStorageSync("crt", msg) // 存储用户认证信息  
            let rolename = ""
            let cuuid = ""
            for(let i = 0; i < communityList.length; i++){
              if(this.communityuuid == communityList[i][0]){
                rolename = communityList[i][2]
                cuuid = communityList[i][0]
                break
              }
            } 
             uni.setStorageSync("curent-crt", {
                uuid : cuuid,
                communityname: this.communityname,
                role:rolename
              }) // 存储用户认证信息   
          }  
        })
        .finally((res) => {});
    },
	  getLatestRecords(){
		  let	params={ 
				status:1,
				page: 1,
				pagenum: 2, 
        communityuuid:this.communityuuid
			}
		  //获得最新的登记记录
		  getAnonymousRecord(params).then(({status, msg})=>{ 
			if(status == 0 ){
				this.recordList = msg;
			}
			else{
				uni.showToast({
					title:msg ,
					icon:"error",
					duration: 3000
				})
			} 
			 
		});

	  },
	  getLatestNotices(){ 
		  let	params={ 
			    communityuuid:this.communityuuid,
          latest:1,//按照最新方式排序
          product_types:"2,1", //通知、公告
          page: 1,
          pagenum: 2, 
        }
        //获得最新的登记记录
        getNoticesApi(params, this.hasLogin).then(({status, msg})=>{
      
        if(status == 0 ){
          this.noticesList = msg.list;
        }
        else{
          uni.showToast({
            title:msg ,
            icon:"error",
            duration: 3000
          })
        } 
        
      });
	  },
    getAnonymouseIconCount(){
      //获得功能图片角标统计
      let	params={ 
			    communityuuid:this.communityuuid, 
        } 
        ApiStatIconsCount(params, this.hasLogin).then(({status, msg})=>{  
			if(status == 0 ){
			  let item = this.commenUseList[0]
			  item.value = msg.newscount
			  Vue.set(this.commenUseList, 0, item)// 社区见闻角标

			  item = this.commenUseList[8]
			  item.value = msg.exchangecount
			  Vue.set(this.commenUseList, 8, item)// 邻里互助角标

			  item = this.commenUseList[5]
			  item.value = msg.giftcount
			  Vue.set(this.commenUseList, 5, item)// 最新好礼角标
			}
			else{
			  uni.showToast({
				title:msg ,
				icon:"error",
				duration: 3000
			  })
			}  
      }); 
    },
    
    
	getCommunityContent(){
		//获得小区的相关信息：登记、通知
		this.getLatestRecords()
		this.getLatestNotices()
    this.getAnonymouseIconCount()
	},
  setDefaultCommunity(communityuuid, name) {
		// 设置默认的小区 
    this.communityuuid = communityuuid
    this.communityname = name 
    this.getCommunityContent()
    this.getCrts()
  },    
    target(route) {
      this.$mRouter.push({route});
    }, 
    
    navTo(route) { 
      this.$mRouter.push({
        route,
      });
    },
    // 定位搜索
    positionSearch() {
      this.cityVisiable = !this.cityVisiable;
    },
    async initData() {
      await this.$http
        .get(`${speadList}`, {})
        .then((r) => {
          if (r.status == 0) {
            if (r.msg.length > 0) {
              this.swiperImg = [];
              for (let i = 0; i < r.msg.length; i++) {
                this.swiperImg.push(
                  {image:this.baseurl + r.msg[i].image,
                  url:r.msg[i].url});
              }
            }
          }
        })
        .catch((r) => {
          console.log(r);
        });
    },
    // 监听轮播图切换
    handleDotChange(e) {
      this.swiperCurrent = e.detail.current;
    },
  },
};
</script>

<style lang="scss" scoped src="./index.scss">
</style>
