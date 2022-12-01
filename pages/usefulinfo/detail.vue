<template>
  <view class="noticemain">
    <view class="v-title">
		 <image class="exceltop" :src="product_type==1?baseAppUrl+`home/tongzhi.png`:baseAppUrl+`home/gonggao.png`"></image>
      <text class="title">{{ title }}</text>
	  
    </view>
    <view>
      <text class="date">{{ date | time }} {{ username }}</text>
        <!-- #ifdef  APP-PLUS -->
       <image class="shareimg shareimg-top"  @click="uniShare" :src="baseAppUrl+`share1.png`"></image>
    <!-- #endif    -->
    </view>
    <view class="content">{{ content }}</view>
	<view class="detail" >
	<rich-text :nodes="detail"  
	  ></rich-text></view>
    <view class="label"> 
       <!-- #ifdef  APP-PLUS -->
       <image class="shareimg"  @click="uniShare" :src="baseAppUrl+`share1.png`"></image>
  <!-- #endif    -->
	  <text class="communityname">{{ communityname }}</text>
    </view>
       
     <likeCountCommentComm 
    :entityuuid="uuid"
    :entitytype="entitytype"
    :baseUrl="baseImageUrl"
    :baseAppUrl="baseAppUrl"
    :owneruuid="owneruuid"
    :orguuid="orguuid"
    :allowcomment="allow_comment"
    /> 
    <rf-loading v-if="loading"></rf-loading>
  </view>
</template>

<script>
import { getNoticesApi } from "@/api/product";
import likeCountCommentComm from "@/components/likesreadcomment"
// #ifdef  APP-PLUS 
import UniShare from 'uni_modules/uni-share/js_sdk/uni-share.js';
    const uniShare = new UniShare();
    //#endif  
export default {
  components:{
    likeCountCommentComm,
  },
  data() {
    return {
      orguuid:"",
	  detail:"", 
	  nodes:[],
      entitytype:9,
      owneruuid:'',
      baseImageUrl: this.$mStore.state.BaseImagesUrl,
      baseurl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      content: "",
      title: "",
      username: "",
	    communityname:"",
      loading: false,
      uuid: "",
      date: null,
	    product_type:1,
      count: 0, //已登记人数
      allow_comment:false,
      org:{
        logo:"",
        name:""
      },
      pagepath:"", 
    };
  },
  onLoad(options) {
    this.uuid = options.uuid;
    this.getDetail(this.uuid);
    this.pagepath = `/pages/usefulinfo/detail?uuid=${this.uuid}`
  },
  onBackPress({from}) {
    if(from=='backbutton'){
        this.$nextTick(function(){
          console.log(uniShare)
            uniShare.hide()
        })
        return uniShare.isShow;
    }
    uni.redirectTo({
      url: "/pages/notice/index",
    });
    return true;
  },
  onShareAppMessage() {
    return {
      title: "【"+this.communityname +"】"+ this.title,
      desc: this.content,
      path:this.pagepath ,
    };
  },
  methods: {
    // #ifdef  APP-PLUS
    uniShare() {
      let href = this.$mStore.state.BaseShareUrl+"?entity_type=9&"+"entity_uuid="+this.uuid
      uniShare.show(
        {
          content: {
            //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
            type: 0,
            href: href,
            title: "【" + this.communityname + "】" + this.title,
            summary: this.content,
            imageUrl: this.baseurl + this.org.logo, //  logo大小不能超过32kb，否则不会显示
          },
          menus: [
            {
              img: this.baseAppUrl + "app-plus/sharemenu/wechatfriend.png",
              text: "微信好友",
              share: {
                provider: 'weixin',
                scene: "WXSceneSession",
                type: 5, 
                title: "【" + this.communityname + "】" + this.title,
                summary: this.content,
                imageUrl:  this.baseurl + this.org.logo, 
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
    }, 
    //#endif 
    getContent(e, index) {
      this.values[index] = e.detail.value;
    },
    getDetail(noticeuuid) {
      this.loading = true;
      let that = this;
	  let communityuuid = uni.getStorageSync("communityuuid")
      getNoticesApi({ uuid: noticeuuid,communityuuid:communityuuid }).then(({ status, msg }) => {
        if (status == 0) {
          that.title = msg.title;
          that.content = msg.content;
          that.detail = msg.detail;
          that.date = msg.date;
          that.product_type = msg.product_type;
          that.owneruuid = msg.creator_info.uuid
          that.username = msg.creator_info.username 
          that.count = msg.count;
          that.allow_comment = msg.allow_comment;
          that.org = msg.org;
          
          that.orguuid = msg.org.uuid;
		      that.communityname = msg.communityname
          if (that.detail == null){
              that.detail = ""
            } 
			else{
				that.nodes = [{
                name: 'div',
                attrs: {
                    class: 'rdetail',
                    style: 'line-height: 60px; color: red; text-align:center;'
                },
                children: [{
                    type: 'text',
                    text: that.detail
                }]
            }]
			}
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
  },
};
</script>

<style lang="scss" scoped>
.shareimg-top{
  position: absolute;
  right:25rpx;
  margin-top:10rpx;
  text-align: right;
}
	
.rdetail{
	max-width: 100%;
	border: 1px solid red;
}
.date{
  line-height: 80rpx;
}
   .noticemain{
	   width:750rpx;
	   padding:25rpx 25rpx;
	   background-color: white;
   }
   .v-title{
	   display: flex;
	   line-height: 80rpx;
	   border-bottom: 1px solid $background-color-gray;
   }
   .exceltop{  
		position: absolute;
		margin-top: 5rpx;;
		width: 70rpx;
		height:70rpx; 
	}
	.label{
		display: flex;
       justify-content:space-between;
	}
.shareimg{
  width: 60rpx;
		height:60rpx; 
    border-radius: 10rpx;;
    border: 1px solid $background-color-gray;
}
	.producttype{
	position: absolute;
	right:30rpx;
	color:$font-color-light;
}
.promote-detail, .date, .communityname{
	color:$font-color-light;
}
.content{
	margin-top:5rpx; 
	margin-bottom:5rpx; 
}
.detail{
	min-height: 900rpx;
	word-wrap:break-word; 
	word-break:break-all; 
}
	.title{
		font-size: 20px;
		font-weight: bold;
		text-align: left;
		margin-left:80rpx;
	}
</style>
