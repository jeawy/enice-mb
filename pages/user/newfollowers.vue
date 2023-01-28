<template>
  <view class="selectcommunitylist"> 
    <view class="follows"> 
       
            <view class="item" v-for="(item, index) in followings" :key="index" >
              <image class="profileimg"   :src="item.img"  mode=""></image>
              <view class="names">
                <view class="name">{{item.name }}</view>
                <view class="remark">{{item.remark }}</view> 
              </view>
              <view class="actions">
                <button class="default-btn following-btn"   >Friends</button>
              </view>
            </view>  
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
      
      followings:[
        {
          img:"/static/img/profile/1.png",
          name:"Margaret", 
          remark:"Labore nam dolorem ea prae...",
          rightimg:"/static/img/home/1.png" 
        },
        {
          img:"/static/img/profile/2.png",
          name:"Reyes", 
          remark:"omnis praesentium enim",
          rightimg:"/static/img/home/car2.png" 
        },
        {
          img:"/static/img/profile/3.png",
          name:"Marques", 
          remark:"iure quo sint",
          rightimg:"/static/img/home/image29.png"  
        },
        {
          img:"/static/img/profile/1.png",
          name:"Cynthia", 
          remark:"veritatis rerum sunt",
          rightimg:"/static/img/home/image25.png" 
        },
        {
          img:"/static/img/profile/2.png",
          name:"Waldo",
          remark:"voluptates exercitationem id",
          rightimg:"/static/img/home/image26.png" 
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
    padding-bottom: 15rpx;
    padding-top: 5rpx;
    border-bottom: 1px solid #F4F2F6;
    .profileimg{
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      margin-right: 25rpx;
      margin-top: 15rpx; 
    }
    .names{
      width: 400rpx;
      margin-top: 15rpx;
      .name{
        color: #333333;
        font-weight: 600;
        font-size: 16px;
 
      }
      .remark{
        margin-top:20rpx;
        color:#666666;
      }
    }
    .actions
    {
      .following-btn{
        margin-top: 55rpx;
        font-size: 14px;
      }
    }
  } 
</style>
