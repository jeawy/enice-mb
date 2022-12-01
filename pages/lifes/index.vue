<template>
  <view class="recordmain"> 
    <view class="emptycontainer"  >
      <image class="empty-img" :src="baseAppUrl + `qiugou.png`"></image>
      <view class="empty-text">敬请期待</view>
    </view>
     
  </view>
</template>

<script> 
export default {
 
  data() {
    return { 
      baseAppUrl:this.$mStore.state.BaseAppStaticUrl
    };
  },  
  onShow() {
   
  },
  onLoad(options) {
    
  }, 
  methods: {
     
  },
};
</script>

<style lang="scss" scoped> 
  .emptycontainer{
    margin-top: 200rpx;
    width:750rpx;
    text-align: center;
    .empty-img{
      width: 200rpx;
      height: 200rpx;
    }

  }
 
</style>
