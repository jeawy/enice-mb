<template>
	<view class="app">
		<web-view :src="url" ></web-view>
	</view>
</template> 
<script> 
import store from '@/store'
    export default {
        data() {
            return {
                url: 5, 
            };
        },
        computed: {},
        onLoad(options) {
			// 这里原来是 store.state.estateToken || uni.getStorageSync('estateToken')
			var token = store.state.accessToken || uni.getStorageSync('accessToken');
			this.url = '/hybrid/html/map.html?' +'no='+options.no+'&isLogin='+token
			// this.url = this.baseurl + 'appshare/map.html?id='+this.id+'&scale=11&from=singlemessage&isappinstalled=0'
			
			/* **********这个block的代码会导致map.html加载两次*********			
			let w = null;
			if (uni.getSystemInfoSync().platform =='ios'){
				// ios的全屏要特殊设置
				   w=plus.webview.create(this.url,'id',{
					  top:uni.getSystemInfoSync().statusBarHeight - 95,
					   height:uni.getSystemInfoSync().windowHeight + 65
				 },{preload:'preload webview'});
			}
			else{
				console.log('created webview')
				//    w=plus.webview.create(this.url,'id',{   },{preload:'preload webview'});
				w=plus.webview.create(this.url);
			}
			let currentWebview = this.$mp.page.$getAppWebview(); 
			console.log('appended web view')
			currentWebview.append(w);  
			*/

			this.$scope.$getAppWebview(); //获取当前web-view
        },
        methods: {
            // 数据初始化   
        }
    }
</script>

<style lang='scss'>
	  

</style>
