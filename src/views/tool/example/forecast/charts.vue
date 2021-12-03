<template >
  <el-dialog
    title="软件预测一览表"
    :visible="visible"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <div id="pie" :style="{ width: '600px', height: '300px' }"></div>
    <div id="column" :style="{ width: '600px', height: '300px' }"></div>
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
    return {
      // 饼图数据
      pData: [],
      // 柱形图数据
      cData: [],
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.$nextTick(() => {
          this.drawPie();
          this.drawColumn();
          this.pieData();
        });
      }
    },
  },
  computed: {},
  mounted() {
    console.log(this.data.id);
  },
  methods: {
    drawPie() {
      let id = document.getElementById("pie");
      let Pie = echarts.init(id);
      Pie.setOption({
        title: {
          text: "软件预测（饼图）",
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
    drawColumn() {
      let id = document.getElementById("column");
      let Column = echarts.init(id);
      Column.setOption({
        title: {
          text: "软件预测（柱形图）",
          left: "center",
        },
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
      });
    },
    // 饼图接口数据
    pieData() {
      console.log(this.data.id);
      this.$http
        .get("/forecast/Infodata", {
          forecast_id: this.data.id,
        })
        .then((res) => {
          console.log(res);
        });
    },
    // // 柱形图接口数据
    //   columnData(){},
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
  },
};
</script>
<style scoped>
</style>