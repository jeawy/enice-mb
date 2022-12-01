<template>
  <view class="v-main">
    <scroll-view
      class="ranktype"
      :scroll="false"
      :scroll-x="true"
      :show-scrollbar="false"
    > 
    </scroll-view>
    <view class="filter">
      <view
	  @tap="sort('new')"
        :class="
          filter_new_up
            ? 'filter-new filter-active filter-new-up'
            : 'filter-new  filter-new-up'
        "
        >最新</view
      >
      <view
	  @tap="sort('money')"
        :class="
          filter_money_up
            ? 'filter-money filter-active filter-money-up'
            : 'filter-money filter-money-up'
        "
        >佣金</view
      >
    </view>
    <view
      class="rankcontainer" 
      @change="swiperChange"
      :current="swipercurrent"
    >
      <view class=" ">
        
          <view
            class="feedback-box"
            v-for="(item, index) in allList"
            :key="index"
            v-if="allfeedback"
          >
            <view  >
              <view   @tap="detail(item.uuid)">
                <view class="title">{{ item.title }}</view> 
              </view> 
              <image 
                v-if="item.mode == 1"
                class="delete-image"
                :src="baseAppUrl + `qiangdan.png`"
                @tap="detail( item.uuid)"
              ></image>
               <image 
                v-if="item.mode == 0"
                class="delete-image"
                :src="baseAppUrl + `baoming.png`"
                @tap="detail( item.uuid)"
              ></image>
            </view>
			<view class="second-title" @tap="detail(item.uuid)"> 
				<view class="time">【{{item.communityname }}】{{ item.user.username }} |  {{ item.date | time }}</view>   
            </view>
				<view class="content" @tap="detail(item.uuid)"> 
				 {{ item.content }}   
            </view>
			<view class="v-money moneytxt1" @tap="detail(item.uuid)">
					<view class="money-holder">
					  <view class="moneytxt " >佣金:</view>
					<view class="money"  >{{
						item.money
					}}</view>
					<view class="moneytxt" >元</view>
				 </view> 
			</view>
			<view class="tags" @tap="detail(item.uuid)">
        <view class="" v-if="item.end_date"
          >截止日期：{{ item.end_date | date }}</view
        >
        <view class="" v-if="item.need_propertior == 1"
          >限以下小区的认证业主：</view
        >
        <view class="tagitems-holders" v-if="item.need_propertior == 1">
          <view class="tagitems" v-for="(communitieyitem, communitieyindex) in item.communities" :key="communitieyindex">
            {{communitieyitem.community__name}}
          </view>
        </view>
      </view>
            <view class="picturebox">
              <view
                v-if="item.images.length !== 0"
                v-for="(it, ind) in item.images"
                :key="ind"
              >
                <image
                  :src="imgurl + it.filepath"
                  class="picture"
                  mode="aspectFill"
                  @tap="previewImage(index, ind)"
                />
              </view>
            </view>
			 
          </view>
          <view v-if="empty" class="emptycontainer">
            <image
              class="empty-img"
              :src="baseAppUrl + `kong.png`"
            ></image>
            <view class="empty-text">暂无相关数据</view>
          </view>
          <view v-if="more" class="getmore" @tap="getmoreAids"
            >点击加载更多...</view
          >
          <!--加载loadding-->
          <tui-loadmore :visible="loadding" :index="2"></tui-loadmore>
          <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>
   
      </view>
    </view>
    <!-- 底部按钮 -->
    <uni-fab
      :pattern="pattern"
      :content="content"
      :horizontal="horizontal"
      :vertical="vertical"
      @trigger="trigger"
    ></uni-fab>
  </view>
</template>

<script>
import tuiLoadmore from "@/components/gift/loadmore";
import tuiNomore from "@/components/gift/nomore";
import { getAnonymousAids } from "@/api/aid.js";
export default {
  components: {
    tuiLoadmore,
    tuiNomore,
  },
  data() {
    return {
      filter_money_up: false,
      filter_new_up: true,
      aidtype: 1, //求助(需要别人帮忙)
      horizontal: "left",
      vertical: "bottom",
      direction: "horizontal",
     
      tabIndex: 0,
      
      screenHeight: 0,
      swipercurrent: 0,
      empty: false,
      more: false,
      nomore: false,
      loadding: false,
      allfeedback: true,
      newfeedback: false,
      noagreefeedback: false,
      agreefeedback: false,
      status: "",
      page: 1,
      pagenum: 5,
      allList: [],
      oldList: [],
      imgurl: "",
      Image: [],
	  sorttype:"date",
      baseurl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      pattern: {
        color: "#7A7E83",
        backgroundColor: "#fff",
        iconColor: "#fff",
        selectedColor: "#FF8000",
      },
       content: [
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl+"woshou1.png",
          selectedIconPath:this.$mStore.state.BaseAppStaticUrl+"woshou1.png",
          text: "我要求助",
          active: true,
        },
        
		{
          iconPath:  this.$mStore.state.BaseAppStaticUrl+"jiedan.png",
          selectedIconPath: this.$mStore.state.BaseAppStaticUrl+"jiedan.png",
          text: "我的接单",
          active: true,
        },
		{
          iconPath: "/static/aid/wode.png",
          selectedIconPath: "/static/aid/wode.png",
          text: "我的互助",
          active: true,
        },
      ],
    };
  },
  onLoad() {
    this.imgurl = this.$mStore.state.BaseImagesUrl;
	this.page = 1;
    this.getList();
    var that = this;
    uni.getSystemInfo({
      success: function (res) {
        that.screenHeight = res.screenHeight + 450;
      },
    }); 
  },
  methods: {
	  sort(sorttype){
		  // 排序
		  this.sorttype = sorttype
		  if (sorttype == "new"){
			  this.filter_new_up = true
			  this.filter_money_up = false
		  }
		  else{
			  this.filter_new_up = false
			  this.filter_money_up = true
		  }
		  this.page = 1
		  this.getList()

	  },
    trigger(e) { 
      let route = "";
      if (e.index == 0) {
        // 发布求助
        route = "/pages/aid/needhelp";
      }  else if (e.index == 1){
        route = "/pages/aid/list";
      }
	  else if (e.index == 2){
        route = "/pages/aid/mylist";
      }

      this.$mRouter.push({ route });
    },
    swiperChange(e) {
      let index = e.detail.current || e.target.current;
      this.switchTab(index);
    },
    switchTab(current) {
      if (this.tabIndex == current) { 
      } else {
        this.tabIndex = current;
      }
	    this.page = 1;
      this.getList();
    },
    getList() {
      if (this.tabIndex == 0) {
        this.aidtype = 1;
      } else if (this.tabIndex == 1) {
        this.aidtype = 2; //2 提供帮助（主动发布的帮助别人的帖子）
      }
      uni.showLoading({
		  mask:true,
		  title:"请稍后..."}
	  )
      this.nomore = false;
      this.more = false; 
      let param = {
        page: this.page,
        pagenum: this.pagenum,
        aidtype: this.aidtype,
		    sort: this.sorttype, 
      };
      getAnonymousAids(param).then((data) => {
        if (data.status == 0) { 
          if (data.msg.total == 0) {
            this.empty = true;
          } else {
            this.empty = false;
            if (data.msg.list.length < this.pagenum) {
              this.nomore = true;
            } else {
              this.more = true;
            }
          }
          if (this.page == 1){
            this.allList = [...data.msg.list];
          }
          else{
            this.allList = this.allList.concat([...data.msg.list]);
          } 
        }
      }).finally((res)=>{
		  this.loadding = false;
		  uni.hideLoading()
	  });
      this.empty = false;
    },
    getmoreAids() {
      this.loadding = true;
      this.page = this.page + 1;
	    this.getList()   
    },
    deletefeedback(index, id) {
      var that = this;
      uni.showModal({
        title: "",
        content: "您好，确定要删除该意见吗？",
        confirmText: "删除",
        confirmColor: "#FD5000",
        success: function (res) {
          if (res.confirm) {
            const data = {
              method: "delete",
              ids: id,
            };
            ApiDeleteFeedback(data).then((res) => {
              if (res.status == 0) {
                uni.showToast({
                  icon: "success",
                  title: "删除成功!",
                  duration: 3000,
                });
                that.allList.splice(index, 1);
              } else {
                console.log(res);
              }
            });
          } else if (res.cancel) { 
          }
        },
      });
    },
    detail(uuid) {
      uni.navigateTo({
        url: "../aid/detail?uuid=" + uuid,
      });
    },
    //点击查看图片大图
    previewImage: function (index, e) {
      this.Image = [];
      let image = this.imgurl + this.allList[index].images[e].filepath;
      this.Image.push(image);
      uni.previewImage({
        current: this.Image[0],
        urls: this.Image,
      });
    },
  },
};
</script>

<style lang="scss" src="./list.scss" scoped>

</style>
