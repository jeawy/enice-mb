<template>
  <view class="selectcommunitylist">
    
    <view class="header">
        <view class="headeritem" v-for="(item, index) in headers" :key="index">
          <view><image class="img"   :src="item.img"  mode=""></image></view>
          <view class="name">{{item.txt }}</view>
        </view>
    </view>
 
    <view class="follows"> 
      <uni-swipe-action>  
          <uni-swipe-action-item class="panel-following" 
          v-for="(item, index) in followings" :key="index" 
          :right-options="options"  @click="bindClick"
           @change="swipeChange($event, index)">
            <view class="item" >
              <image class="profileimg"   :src="item.img"  mode=""></image>
              <view class="names">
                <view class="name">{{item.name }}</view>
                <view class="remark">{{item.remark }}</view>
              </view>
              <view class="actions">
                <view class="name">{{item.date }}</view>
                <view class="remark">{{item.time }}</view>
              </view>
            </view>
          </uni-swipe-action-item> 
    </uni-swipe-action>
    </view>
  </view>
</template>

<script> 
export default {
  data() {
    return {
      current: 0,
      options:[
        {
            text: 'Delete',
            style: {
                backgroundColor: '#dd524d'
            }
        }
      ],
      headers:[
        {
          url:"",
          img:"/static/img/notice1.png",
          txt:"Likes & Col"
        },
        {
          url:"",
          img:"/static/img/notice2.png",
          txt:"New Followers",
          
        },
        {
          url:"",
          img:"/static/img/notice3.png",
          txt:"Comments",
          
        },
      ],
      followings:[
        {
          img:"/static/img/profile/1.png",
          name:"Margaret",
          remark:"Labore nam dolorem ea prae...",
          date:"11 May 21 ",
          time:"09:40 PM"
        },
        {
          img:"/static/img/profile/2.png",
          name:"Reyes",
          remark:"omnis praesentium enim",
          date:"12 May 21 ",
          time:"11:40 PM"
        },
        {
          img:"/static/img/profile/3.png",
          name:"Marques",
          remark:"iure quo sint",
          date:"14 May 21 ",
          time:"22:40 PM"
        },
        {
          img:"/static/img/profile/1.png",
          name:"Cynthia",
          remark:"veritatis rerum sunt",
          date:"14 May 21 ",
          time:"22:40 PM"
        },
        {
          img:"/static/img/profile/2.png",
          name:"Waldo",
          remark:"voluptates exercitationem id",
          date:"14 May 21 ",
          time:"22:40 PM"
        } 
      ],
      items: [ '32 Following', '106 Followers'],
      baseUrl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl, 
      hasLogin: false, 
    };
  },
  onShow() { 
    this.hasLogin = this.$mStore.getters.hasLogin;
   
  },
  onLoad(options) {
    this.baseUrl = this.$mStore.state.BaseUrl;
    this.baseAppUrl = this.$mStore.state.BaseAppStaticUrl;
  },
  methods: {
    bindClick(e){
      this.followings.splice(e.index, 1)
      console.log('点击了'+(e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
    },
    swipeChange(e,index){
      console.log('当前状态：'+ e +'，下标：' + index)
    },
    onSegmentedChange(idx) {
				this.current = idx
			},
  },
};
</script>

<style lang="scss" scoped>
page {
		background-color: #fff;

	}

  .selectcommunitylist{
    background-color: white;
    border: 1px solid white;
    min-height: 1400rpx;
  }
  .header{
    display: flex;
    margin: 25rpx 0;
    padding: 0 25rpx 25rpx 25rpx;
    justify-content: space-between;
    text-align: center;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
    .headeritem{
       .name{
        color: #666666;
        font-weight: 500;
       }
      .img{
        width: 110rpx;
        height: 110rpx;
        border-radius: 50rpx;
      } 
    }
    
  }
  .item{
    display: flex;
    margin: 0 25rpx;
    padding-bottom: 25rpx;
    padding-top: 25rpx;
    border-bottom: 1px solid #F4F2F6;
    .profileimg{
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      margin-right: 15rpx;
    }
    .names{
      width: 400rpx;
      .name{
        color: #333333;
        font-weight: 600;
        font-size: 16px;
 
      }
      .remark{
        margin-top:10rpx;
        color:#666666;
      }
    }
    .actions
    {
      padding-top:20rpx;
      .remark{ 
        font-size: 14px;
        color: #8C8896;
      }
    }
  } 
</style>
