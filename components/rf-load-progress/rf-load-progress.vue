<template>
  <!--进度条加载-->
  <view class="load-progress" :class="progress!=0?'show':'hide'" :style="[{top:height+'px'}]">
    <view class="load-progress-bar bg-base-color" :style="[{transform: 'translate3d(-' + (100-progress) + '%, 0px, 0px)'}]"></view>
    <view class="load-progress-spinner text-base-color"></view>
  </view>
</template>

<script> 
	export default {
		name: 'rf-loading',
    props: {
      progress: {
      	type: Number,
        default: 0,
      },
      height: {
      	type: Number,
        default: 0,
      }
    }
	}
</script>

<style scoped>

</style>
