<script>
    import Vue from 'vue'
    export default {
        async onLaunch() {
            this.initData();
			//plus.navigator.setFullscreen(true);
        },
		onShow: function() {  
            // #ifdef APP-PLUS
		    setTimeout(function(){   
		    var args= plus.runtime.arguments;  
                if(args){  
                    args = args.replace("map2family://","")
                    let params = JSON.parse('{"' + decodeURI(args.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}')
                    // 处理args参数，如直达到某新页面等  
                    if (params.entity_type){
                        let url = "/pages/index/index"
                        if (params.entity_type == 9){
                            // 通知、公告、百事通、社区见闻
                            url = '/pages/notice/detail?uuid='+params.entity_uuid
                            
                        }
                        else if (params.entity_type == 12){
                            // 互助
                            url = '/pages/aid/detail?uuid='+params.entity_uuid
                             
                        }
                        else if (params.entity_type == 3){
                            // 互助
                            url = '/pages/record/detail?uuid='+params.entity_uuid
                             
                        }
                        uni.navigateTo({
                            url: url,
                        });
                    }
                }  
            },10);   
            // #endif
		},
        onHide() {
        },
        methods: {
            // 数据初始化
            async initData() {
                const token = uni.getStorageSync('accessToken');
                if (token) {  
                    await this.initSystemInfo();
                    // #ifdef H5
                    this.$mPayment.wxConfigH5();
                    // #endif
                }
            },
		        // 初始化系统信息
            initSystemInfo() {
                uni.getSystemInfo({
                    success(e) {
                        // #ifndef MP
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        if (e.platform == 'android') {
                            Vue.prototype.CustomBar = e.statusBarHeight + 50;
                        } else {
                            Vue.prototype.CustomBar = e.statusBarHeight + 45;
                        }

                        // #endif
                        // #ifdef MP-WEIXIN
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        let custom = wx.getMenuButtonBoundingClientRect();
                        Vue.prototype.Custom = custom;
                        Vue.prototype.CustomBar = custom.top - e.statusBarHeight;
                        // #endif
                        // #ifdef MP-ALIPAY
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
                        // #endif
                    }
                });
            },
		    
        }
    }
</script>

<style lang='scss'>
	// 导入colorUI
	//#ifndef APP-PLUS-NVUE
	@import '/static/css/colorui/main.css';
	@import '/static/css/colorui/icon.css';
	@import '/static/css/colorui/animation.css';
	// 导入阿里巴巴矢量图标库
	@import './static/css/iconfont/iconfont.css';
	@import './static/css/reset.scss';
	@import './static/css/uni.scss';
	//#endif  
</style>
