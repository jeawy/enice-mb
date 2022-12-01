<template>
  <!-- 行政区划选择器 -->
  <picker
    mode="multiSelector"
    @columnchange="columnChangeHandler"
    @change="valueChangeHandler"
    :value="multiIndex"
    range-key="short_name"
    :range="multiArray"
  >
    {{ pickerLabel }}
  </picker>
</template>

<script> 
import {
  queryProvinceList,
  queryCityList,
  queryCountyList,
} from "@/api/userInfo.js";
export default {
  // 地区id（区县） 双向绑定
  props: ["areaCode"],
  data() {
    return {
      multiArray: [],
      multiIndex: [],
      pickerLabel: "",
    };
  },
  created() {
    this.getProvinceList();
  },
  methods: {
    // 初始化请求省市区
    async getProvinceList() {
      await queryProvinceList().then((list) => {
        this.multiArray.splice(0, 1, list);
        this.multiIndex.splice(0, 1, 0);
      });
      this.getCityCounty(0, 0);
    },
    valueChangeHandler({ detail: { value } }) {
      this.pickerLabel = `${this.multiArray[0][value[0]].short_name} / ${
        this.multiArray[1][value[1]].short_name
      } / ${this.multiArray[2][value[2]].short_name}`;
      this.$emit("update:area-code", this.multiArray[2][value[2]].id);
    },
    columnChangeHandler({ detail: { column, value } }) {
      this.multiIndex.splice(column, 1, value);
      // 区县change 不请求后台
      if (column === 2) {
        return false;
      }
      // 省change由省ID请求市
      if (column === 0) {
        this.getCityCounty(column, value);
        return false;
      }
      // 否则市ID请求县区 column === 1
      queryCountyList({
        cityid: this.multiArray[column][value].id,
      }).then((list) => {
        this.multiArray.splice(2, 1, list);
      });
    },
    // 省切换时请求市和区县并改变multiIndex
    async getCityCounty(column, row) {
      await queryCityList({
        provinceid: this.multiArray[column][row].id,
      })
        .then((list) => {
          this.multiArray.splice(1, 1, list);
          return queryCountyList({
            cityid: list[0].id,
          });
        })
        .then((list) => {
          this.multiArray.splice(2, 1, list);
        });
      this.multiIndex.splice(1, 2, 0, 0);
    },
  },
};
</script>
