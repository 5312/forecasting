<template>
  <el-dialog
    title="软件预测一览表"
    :visible="visible"
    width="460px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <div id="pie" :style="{ width: '300px', height: '300px' }"></div>
    <div id="column" :style="{ width: '300px', height: '300px' }"></div>
  </el-dialog>
</template>
<script>
import * as echarts from "echarts";
// 引入折线图组件
export default {
  name: "Charts",
  props: {
    // 弹窗是否打开
    visible: Boolean,
    data: Object,
  },
  data() {
    return {};
  },
  watch: {
    visible(e) {
      if (e) {
       this.$nextTick(()=>{
          this.drawPie();
          this.drawColumn()
       })
      }
    },
  },
  computed: {
    // pie() {
    //   return {};
    // },
    // column() {
    //   return {
       
    //   };
    // },
  },
  mounted() {},
  methods: {
    drawPie() {
      let id = document.getElementById('pie')
      // console.log(id);
      let Pie = echarts.init(id);
      Pie.setOption({
        title: {
          text: "Referer of a Website",
          subtext: "Fake Data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    drawColumn(){
      let id = document.getElementById('column')
      // console.log(id);
      let Column = echarts.init(id);
      Column.setOption({
         xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
          },
        ],
      })
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
  },
};
</script>