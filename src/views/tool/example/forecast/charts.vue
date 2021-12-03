<template >
  <el-dialog
    title="概况一览表"
    :visible="visible"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <div id="pie" :style="{ width: '600px', height: '300px' }"></div>
    <div id="column" :style="{ width: '700px', height: '300px' }"></div>
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
      num: 0,
      num1: 0,
      num2: 0,
      num3: 0,
      num4: 0,
      num5: 0,
      num6: 0,
      num7: 0,
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.$nextTick(() => {
          this.drawPie();
          this.drawColumn();
          this.pieData();
          this.Mathnum();
        });
      }
    },
  },
  computed: {},
  mounted() {},
  methods: {
    drawPie() {
      let id = document.getElementById("pie");
      let Pie = echarts.init(id);
      Pie.setOption({
        title: {
          text: "安全风险隐患",
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
            type: "pie",
            radius: "50%",
            data: [
              { value: this.num, name: "地面安全事故（人员受损）" },
              { value: this.num1, name: "地面安全事故（装备受损）" },
              { value: this.num2, name: "保密安全风险" },
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
          text: "地面安全事故风险标准比照图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "right",
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: -10,
            show: true,
          },
          type: "category",
          data: [
            "发生一般事故风险值（参照）",
            "发生较大事故风险值（参照）",
            "发生重大事故风险值（参照）",
            "发生特大事故风险值（参照）",
            "本次任务实际风险值",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [this.num3, this.num4, this.num5, this.num6, this.num7],
            type: "bar",
          },
        ],
      });
    },
    // 饼图接口数据
    pieData() {
      this.$http
        .get("/forecast/infodata", {
          forecast_id: this.data.id,
        })
        .then((res) => {
          console.log(res.data.data);
        });
    },
    Mathnum() {
      this.num = Math.floor(Math.random() * (500 - 100)) + 100;
      this.num1 = Math.floor(Math.random() * (500 - 100)) + 100;
      this.num2 = Math.floor(Math.random() * (500 - 100)) + 100;
      this.num3 = Math.floor(Math.random() * (500 - 100)) + 100;
      this.num4 = Math.floor(Math.random() * (500 - 100)) + 100;
      this.num5 = Math.floor(Math.random() * (500 - 100)) + 100;
      this.num6 = Math.floor(Math.random() * (500 - 100)) + 100;
      this.num7 = Math.floor(Math.random() * (500 - 100)) + 100;
      console.log(this.num);
      console.log(this.num1);
      console.log(this.num2);
      console.log(this.num3);
      console.log(this.num4);
      console.log(this.num5);
      console.log(this.num6);
      console.log(this.num7);
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