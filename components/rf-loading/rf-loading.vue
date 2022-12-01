<template>
  <!--加载动画-->
  <view class="cu-load load-modal"> 
    <view class="gray-text">{{ content }}</view>
  </view>
</template>

<script> 
  import $mAssetsPath from '@/config/assets.config.js'
	export default {
		name: 'rf-loading',
    props: {
      src: {
      	type: String,
        default: $mAssetsPath.logo
      },
      content: {
      	type: String,
        default: '正在加载...'
      }
    }
	}
</script>

<style scoped>

</style>
