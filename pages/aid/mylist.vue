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
        placeholder="ๆ็ดข"
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
        <view :class=" item.payed == 0 && item.status == 1 ?'status statusdisabled':'status'">{{ item.status | statusFilter }}</view>
        <view @tap="detail(item.uuid)">
          <view class="title">{{ item.title }}</view>
        </view>
      </view>
      <view class="second-title" @tap="detail(item.uuid)">
        <view class="time"
          >ใ{{ item.communityname }}ใ{{ item.user.username }} |
          {{ item.date | time }}</view
        >
      </view>
      <view class="content" @tap="detail(item.uuid)">
        {{ item.content }}
      </view>
      <view class="v-money moneytxt1" @tap="detail(item.uuid)">
        <view class="money-holder">
          <view class="moneytxt">ไฝฃ้:</view>
          <view class="money">{{ item.money }}</view>
          <view class="moneytxt"><view v-if="item.payed == 0 && item.status == 1">ๅ[ๆชๆฏไป๏ผ่ฏทๅฐฝๅฟซๆฏไป.]</view> </view>
        </view>
      </view>
      <view class="tags" @tap="detail(item.uuid)">
        <view class="" v-if="item.end_date"
          >ๆชๆญขๆฅๆ๏ผ{{ item.end_date | date }}</view
        >
        <view class="" v-if="item.need_propertior == 1"
          >้ไปฅไธๅฐๅบ็่ฎค่ฏไธไธป๏ผ</view
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
      <view class="btns">
        <view class="btns-holder">
         <view class="enddate needpropertior needpropertiorbtn-edit" 
         v-if="item.status == 0 || item.status == 1"  @tap="modifyAid( item.uuid)"
          >  ไฟฎๆน </view >
           <!-- ๆๅญไธๆชๆฏไป็ๅฏไปฅๅ?้ค -->
          <view class="enddate needpropertior needpropertiorbtn btn-delete" 
         v-if="item.payed == 0  "  @tap="deleteAid(index, item.uuid)" 
          >  ๅ?้ค </view >
          <!-- ๅทฒๆฏไปใไธ็ญๅพๆฅๅ็ๅฏไปฅ็ณ่ฏท้ๆฌพ๏ผๆฏๆๆๅคไธๆฌก -->
          <view class="enddate needpropertior needpropertiorbtn btn-refund" v-if="item.payed == 1 && item.status == 1"
          >  ็ณ่ฏท้ๆฌพ </view >
          <view class="enddate needpropertior needpropertiorbtn btn-refund" v-if="item.payed == 0 && item.status == 1"
         @tap="pay(item.billno)"  >  ๆฏไปไฝฃ้ </view >
        </view>
      </view>
    </view>
    <view v-if="empty" class="emptycontainer">
      <image class="empty-img" :src="baseAppUrl + `kong.png`"></image>
      <view class="empty-text">ๆๆ?็ธๅณๆฐๆฎ</view>
    </view>
    <view v-if="more" class="getmore" @tap="getmoreAids">็นๅปๅ?่ฝฝๆดๅค...</view>
    <!--ๅ?่ฝฝloadding-->
    <tui-loadmore :visible="loadding" :index="2"></tui-loadmore>
    <tui-nomore :visible="nomore" bgcolor="#fafafa"></tui-nomore>

    <!-- ๅบ้จๆ้ฎ -->
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
import { getAids, updateAid } from "@/api/aid.js";
export default {
  components: {
    tuiLoadmore,
    tuiNomore,
  },
  data() {
    return {
      selectCategoryList: [
        {
          id: -1,
          name: "ๅจ้จ็ถๆ",
        },
        {
          id: 0,
          name: "ๆๅญ",
        },
        {
          id: 1,
          name: "็ญๅพๆฅๅ",
        },
        {
          id: 2,
          name: "ๅทฒๅณ้ญ",
        },
        {
          id: 3,
          name: "ๅทฒๆฅๅ",
        },
        {
          id: 4,
          name: "ๅทฒๅฎๆ",
        },
        {
          id: 5,
          name: "ๅทฒ่ฏไปท",
        },
      ],
      filter_money_up: false,
      filter_new_up: true,
      aidtype: 1, //ๆฑๅฉ(้่ฆๅซไบบๅธฎๅฟ)
      horizontal: "left",
      vertical: "bottom",
      direction: "horizontal",
      content: [
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl+"woshou1.png",
          selectedIconPath: this.$mStore.state.BaseAppStaticUrl+"woshou1.png",
          text: "ๆ่ฆๆฑๅฉ",
          active: true,
        }, 
        {
          iconPath: this.$mStore.state.BaseAppStaticUrl+"jiedan.png",
          selectedIconPath: this.$mStore.state.BaseAppStaticUrl+"jiedan.png",
          text: "ๆ็ๆฅๅ",
          active: true,
        },
        {
          iconPath: "/static/aid/wode.png",
          selectedIconPath: "/static/aid/wode.png",
          text: "ๆ็ไบๅฉ",
          active: true,
        },
      ],
      tabIndex: 0,
      tabList: [
        {
          name: "ๆ็ๆฑๅฉ",
        },
        {
          name: "ๆๆไพ็ๅธฎๅฉ",
        },
        {
          name: "ๆ็ๆฅๅ",
        },
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
      selectedCategory: "",
      sorttype: "date",
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
    statusFilter(status) {
      let statustxt = "ๆช็ฅ็ถๆ";
      if (status == 0) {
        statustxt = "ๆๅญ";
      } else if (status == 1) {
        statustxt = "็ญๅพๆฅๅ";
      } else if (status == 2) {
        statustxt = "ๅทฒๅณ้ญ";
      } else if (status == 3) {
        statustxt = "ๅทฒๆฅๅ ";
      } else if (status == 4) {
        statustxt = "ๅทฒๅฎๆ";
      } else if (status == 5) {
        statustxt = "ๅทฒ่ฏไปท";
      }

      return statustxt;
    },
  },
  methods: {
    modifyAid(uuid){
      this.$mRouter.push({
          route:'/pages/aid/needhelp?uuid='+uuid
      }) 
    },
    pay(billno){ 
      this.$mRouter.push({
          route:'/pages/user/money/pay?bill='+billno+'&billtype=3'
      }) 
    },
    confirm(e) {
      // ๆ็ดข
      this.searchParams["title"] = this.title;
    },
    selectCategory(index) {
      // ๅๆขๆถ่ดน็ฑปๅไนๅ
      this.selectedCategory = this.selectCategoryList[index];
    },
    sort(sorttype) {
      // ๆๅบ
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
        // ๅๅธๆฑๅฉ
        route = "/pages/aid/needhelp";
      } else {
        route = "/pages/aid/afford";
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
      if (this.tabIndex == 0) {
        this.aidtype = 1;
      } else if (this.tabIndex == 1) {
        this.aidtype = 2; //2 ๆไพๅธฎๅฉ๏ผไธปๅจๅๅธ็ๅธฎๅฉๅซไบบ็ๅธๅญ๏ผ
      }
      uni.showLoading({
        mask: true,
        title: "่ฏท็จๅ...",
      });
      this.nomore = false;
      this.more = false;
      let param = {
        page: this.page,
        pagenum: this.pagenum,
        aidtype: this.aidtype,
        sort: this.sorttype,
      };
      if (this.tabIndex == 0) {
        param["action"] = "mine"; // ่ทๅๆ็
      }
      else if  (this.tabIndex == 2) {
        param["action"] = "answer"; // ่ทๅๆ็ๆฅๅ
      }
      getAids(param)
        .then((data) => {
          console.log(data.msg.list);
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
    deleteAid(index, uuid) {
      var that = this;
      uni.showModal({
        title: "",
        content: "ๆจๅฅฝ๏ผ็กฎๅฎ่ฆๅ?้ค่ฟๆฑๅฉๅ๏ผ",
        confirmText: "ๅ?้ค",
        confirmColor: "#FD5000",
        success: function (res) {
          if (res.confirm) {
            const data = {
              method: "delete",
              uuids: uuid,
            };
            updateAid(data).then((res) => {
              if (res.status == 0) {
                uni.showToast({
                  icon: "success",
                  title: "ๅ?้คๆๅ!",
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
    //็นๅปๆฅ็ๅพ็ๅคงๅพ
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
