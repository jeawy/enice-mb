<template>
  <view class="v-main">
    <scroll-view
      class="ranktype"
      :scroll="false"
      :scroll-x="true"
      :show-scrollbar="false"
    >
      <view style="flex-direction: column">
        <view
          style="
            width: 700rpx;
            flex-direction: row;
            justify-content: space-between;
          "
          class="uni-tab"
        >
          <view
            class="uni-tab-item"
            v-for="(tab, index) in tabList"
            :key="index"
            :ref="'tabitem' + index"
            :data-id="index"
            :data-current="index"
            @click="switchTab(index)"
            :class="tabIndex == index ? 'uni-tab-item-active' : ''"
          >
            <text
              class="uni-tab-item-title"
              :class="tabIndex == index ? 'uni-tab-item-title-active' : ''"
              :id="'tab' + index"
              >{{ tab.name }}</text
            >
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="filter">
      <nx-search
        :selectList="selectCategoryList"
        class="sn-earch-input-box"
        button="inside"
        placeholder="搜索"
        @search="confirm()"
        @select="selectCategory"
        v-model="title"
      />
    </view> 
    <view
      class="aid-box"
      v-for="(item, index) in allList"
      :key="index" 
    >
      <view>
        <view class="status" >{{ item.status | statusFilter }} | {{ item.exchangetype | exchangeFilter }}</view>
        <view @tap="detail(item.uuid)">
          <view class="title">{{ item.title }}</view>
          <image
                v-if="item.reason == 1 && item.status == 2"
                :src="baseAppUrl + '/exchanges/'+ $options.filters.exchangeImgFilter(item.exchangetype ) +'.png'"
                class="picture_saled"
                mode="aspectFill" 
              />
        </view>
      </view>
      <view class="second-title" @tap="detail(item.uuid)"> 
        <view class="time">
          <view class="left"> {{ item.date | time }}发布在【{{ item.communityname }} </view>
          <view class="right" v-if="item.money">￥{{item.money}}</view>
        </view> 
      </view>
      <view class="content" @tap="detail(item.uuid)">
        {{ item.content }}
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
      <view class="btns" v-if="tabIndex == 0">
        <view class="btns-holder">
         <view class="enddate needpropertior needpropertiorbtn-edit" 
           @tap="modifyExchange( item.uuid)"
          >  修改 </view >
           <!-- 暂存且未支付的可以删除 -->
          <view class="enddate needpropertior needpropertiorbtn btn-delete" 
           @tap="deleteExchange(index, item.uuid)" 
          >  删除 </view > 
          <view class="enddate needpropertior needpropertiorbtn " 
           @tap="openPopup(item.uuid, 1 , item.exchangetype )"  v-if="item.status==1"
          >  {{item.exchangetype|exchangeBtnFilter}} </view >
          <view class="enddate needpropertior needpropertiorbtn " 
           @tap="openPopup(item.uuid, 0 , item.exchangetype)"  v-if="item.status==1"
          >  下架 </view >
          <view class="enddate needpropertior needpropertiorbtn " 
           @tap="publish(item.uuid )"  v-if="item.status==2"
          >  上架 </view >
        </view>
      </view>
    </view>
    <view v-if="allList.length == 0" class="emptycontainer">
      <image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
      <view class="empty-text">暂无相关数据</view>
    </view>
    <view v-if="more" class="getmore" @tap="getmoreAids">点击加载更多...</view>
    <!--加载loadding-->
    <tui-loadmore :visible="loadding" :index="2"></tui-loadmore>
    <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>

    <!-- 底部按钮 -->
    <uni-fab
      :pattern="pattern"
      :content="content"
      :horizontal="horizontal"
      :vertical="vertical"
      @trigger="trigger"
    ></uni-fab>
    <uni-popup ref="popupDown" class="popupDown" type="top">
        <view class="popupDown-holder">
          <view class="title">{{reason_title}}</view> 
          <view class="items">
            {{reason_content}}
          </view> 
          <view>
            <view class="btns">
              <view class="btns-holder">
                <view class="enddate needpropertior needpropertiorbtn-edit" 
                  @tap="closePopup"
                  >  取消 </view >
                
                <view class="enddate needpropertior needpropertiorbtn " 
                @tap="closeExchange(2)" 
                >  确定</view >
              </view>
            </view>
          </view> 
        </view>
      </uni-popup>
  </view>
</template>

<script>
import tuiLoadmore from "@/components/gift/loadmore";
import tuiNomore from "@/components/gift/nomore";
import { getExchanges, updateExchanges } from "@/api/exchanges.js";
export default {
  components: {
    tuiLoadmore,
    tuiNomore,
  },
  data() {
    return {
      reason_title:"",
      reason_content:"",
      selectCategoryList: [
        {
          id: -1,
          name: "全部状态",
        },
        {
          id: 0,
          name: "暂存",
        },
        {
          id: 1,
          name: "已发布",
        },
        {
          id: 2,
          name: "已下架",
        } 
      ],
      filter_money_up: false,
      filter_new_up: true,
      aidtype: 1, //求助(需要别人帮忙)
      horizontal: "left",
      vertical: "bottom",
      direction: "horizontal",
      currentuuid:"",
      content: [
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl + "exchanges.png",
          selectedIconPath: this.$mStore.state.BaseAppStaticUrl + "exchanges.png",
          text: "我要发布",
          active: true,
        },  
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl+"exchanges.png",
          selectedIconPath: this.$mStore.state.BaseAppStaticUrl+"exchanges.png",
          text: "闲置广场",
          active: true,
        } ,
          {
          iconPath: this.$mStore.state.BaseAppStaticUrl + "uncollect.png",
          selectedIconPath:
            this.$mStore.state.BaseAppStaticUrl + "collected.png",
          text: "我的收藏",
          active: true,
        },
      ],
      tabIndex: 0,
      tabList: [
        {
          name: "我发布的闲置租售",
        },
        {
          name: "我参与的闲置租售",
        } 
      ],
      screenHeight: 0, 
      empty: false,
      more: false,
      nomore: false,
      loadding: false,    
      status: "",
      page: 1,
      pagenum: 5,
      allList: [],
      oldList: [],
      imgurl: "",
      Image: [],
      title: "",
      selectedCategory: {
        id:-1
      },
      sorttype: "date",
      reason:0,
      baseurl: this.$mStore.state.BaseUrl,
      baseAppUrl: this.$mStore.state.BaseAppStaticUrl,
      pattern: {
        color: "#7A7E83",
        backgroundColor: "#fff",
        iconColor: "#fff",
        selectedColor: "#FF8000",
      },
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
  filters: {
    exchangeImgFilter(status) {
      //1 闲置、2 求租；3 出租、4 求购、5 出售
      let statustxt = "未知状态";
      if (status == 1) {
        statustxt = "yichushou";
      } else if (status == 2) {
        statustxt = "yizu";
      } else if (status == 3) {
        statustxt = "yichuzu";
      } else if (status == 4) {
        statustxt = "yigoumai";
      } else if (status == 5) {
        statustxt = "saled";
      }
      return statustxt;
    },
    statusFilter(status) {
      let statustxt = "未知状态";
      if (status == 0) {
        statustxt = "暂存";
      } else if (status == 1) {
        statustxt = "已发布";
      } else if (status == 2) {
        statustxt = "已下架";
      }  

      return statustxt;
    },
    exchangeFilter(status) {
      //1 闲置、2 求租；3 出租、4 求购、5 出售
      let statustxt = "未知状态";
      if (status == 1) {
        statustxt = "闲置";
      } else if (status == 2) {
        statustxt = "求租";
      } else if (status == 3) {
        statustxt = "出租";
      } else if (status == 4) {
        statustxt = "求购";
      } else if (status == 5) {
        statustxt = "出售";
      }
      return statustxt; 
    }
    ,
    exchangeBtnFilter(status) {
      //1 闲置、2 求租；3 出租、4 求购、5 出售
      let statustxt = "未知状态";
      if (status == 1) {
        statustxt = "已出手";
      } else if (status == 2) {
        statustxt = "已租到";
      } else if (status == 3) {
        statustxt = "已出租";
      } else if (status == 4) {
        statustxt = "已购买";
      } else if (status == 5) {
        statustxt = "已卖出";
      }
      return statustxt; 
    }
  },
  methods: {
    closePopup(){
      this.$refs.popupDown.close( ); 
    },
    change(e){
				console.log('e:',e);
			},
    openPopup(itemuuid, reason, exchangetype){
      let btntxt = this.$options.filters.exchangeBtnFilter( exchangetype)
      this.currentuuid = itemuuid
      this.reason = reason 
      this.reason_title = reason == 0?"下架":btntxt
      this.reason_content = reason == 0?"确定要下架吗?不再等等吗?":btntxt+",期待我们下次相遇" 
      this.$refs.popupDown.open("top");
    },
    modifyExchange(uuid){
      this.$mRouter.push({
          route:'/pages/exchanges/publish?uuid='+uuid
      }) 
    },
    pay(billno){ 
      this.$mRouter.push({
          route:'/pages/user/money/pay?bill='+billno+'&billtype=3'
      }) 
    },
    confirm(e) {
      // 搜索 
      this.getList()
    },
    selectCategory(index) {
      // 切换收费类型之后
      this.selectedCategory = this.selectCategoryList[index];
    },
    sort(sorttype) {
      // 排序
      this.sorttype = sorttype;
      if (sorttype == "new") {
        this.filter_new_up = true;
        this.filter_money_up = false;
      } else {
        this.filter_new_up = false;
        this.filter_money_up = true;
      }
      this.page = 1;
      this.getList();
    },
    trigger(e) { 
      let route = "";
      if (e.index == 0) { 
        route = "/pages/exchanges/publish";
      } else if (e.index == 1) { 
        route = "/pages/exchanges/list";
      } else {
        route = "/pages/collection/list";
      }

      this.$mRouter.push({ route });
    },
    swiperChange(e) {
      let index = e.detail.current || e.target.current;
      this.switchTab(index);
    },
    switchTab(current) {
      if (this.tabIndex == current) {
        console.log(this.tabIndex);
      } else {
        this.tabIndex = current;
      }
      this.page = 1;
      this.getList();
    },
    getList() {
       
      uni.showLoading({
        mask: true,
        title: "请稍后...",
      });
      this.nomore = false;
      this.more = false;
      let param = {
        page: this.page,
        pagenum: this.pagenum, 
        sort: this.sorttype,
        title:this.title,
         
      };
      if (this.tabIndex == 1) {
        param["concern"] = 1; // 我的关注
      } 
      if(this.selectedCategory.id> -1){
        param["status"] = this.selectedCategory.id;  
      }
      getExchanges(param)
        .then((data) => { 
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
            if (this.page == 1) {
              this.allList = [...data.msg.list];
            } else {
              this.allList = this.allList.concat([...data.msg.list]);
            }
          }
        })
        .finally((res) => {
          this.loadding = false;
          uni.hideLoading();
        });
      this.empty = false;
    },
    getmoreAids() {
      this.loadding = true;
      this.page = this.page + 1;
      this.getList();
    },
    deleteExchange(index, uuid) {
      var that = this;
      uni.showModal({
        title: "",
        content: "您好，确定要删除吗？",
        confirmText: "删除",
        confirmColor: "#FD5000",
        success: function (res) {
          if (res.confirm) {
            const data = {
              method: "delete",
              uuids: uuid,
            };
            uni.showLoading({
              mask: true,
              title: "请稍后...",
            })
            updateExchanges(data).then((res) => {
              if (res.status == 0) { 
                that.allList.splice(index, 1);
                uni.showToast({
                  icon: "success",
                  title: "删除成功!",
                  duration: 3000,
                });
              } else {
                uni.showToast({
                  icon: "error",
                  title: res.msg,
                  duration: 3000,
                });
              }
            }).finally(()=>{
              uni.hideLoading()
            });
          } 
          else if (res.cancel) { 
          }
        },
      });
    },
    publish(uuid){
      // 上架
      this.currentuuid  = uuid
       this.closeExchange(1)
    },
    closeExchange(status  ) { 
      this.closePopup()
      const data = {
        method: "put",
        uuid: this.currentuuid,
        status:status,
        reason:this.reason
      }; 
      updateExchanges(data).then((res) => {
        if (res.status == 0) {
          let title = "已下架"
          if (status == 1){
             title = "已上架"
          }
          this.getList()
          uni.showToast({
            icon: "success",
            title:title,
            duration: 3000,
          });
          
        } else {
          uni.showToast({
            icon: "error",
            title: res.msg,
            duration: 3000,
          });
        }
      }) 
    },
    detail(uuid) {
      uni.navigateTo({
        url: "../exchanges/detail?uuid=" + uuid,
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

<style lang="scss" src="./mylist.scss" scoped>
</style>
