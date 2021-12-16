<template >
  <el-dialog
    title="概况一览表"
    :visible="visible"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <div class="secur">
      <p class="p">安全资源</p>
      <hr />
      <ul>
        <li v-for="(i, j) in typeData" :key="j">
          <div class="name" v-if="i.show">{{ i.name }}:</div>
          <div class="data" v-if="i.show">
            <p v-for="(x, y) in i.seData" :key="y">
              <span>名称：{{ x.title }}</span>
              <span>数量：{{ x.sums }}</span>
              <span></span>
              <span>总赋值：{{ x.Scoresum }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="secur">
      <p class="p">隐患因素</p>
      <hr />
    </div>
    <div class="secur">
      <p class="p">威胁因素</p>
      <hr />
    </div>
    <div id="pie" :style="{ width: '700px', height: '300px' }"></div>
    <!-- <div id="column" :style="{ width: '700px', height: '300px' }"></div> -->
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
      // cData: [],
      // 安全资源数据
      typeData: [],
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.$nextTick(() => {
          this.pieData().then(() => {
            this.drawPie();
          });
          this.securData();
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
              {
                value: this.pData.map((d) => d.Pa),
                name: "人因安全事故（人员受损）",
              },
              {
                value: this.pData.map((d) => d.Pb),
                name: "物因安全事故（装备受损）",
              },
              { value: this.pData.map((d) => d.Pc), name: "环境安全风险" },
              { value: this.pData.map((d) => d.Pd), name: "管理安全风险" },
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
    // drawColumn() {
    //   let id = document.getElementById("column");
    //   let Column = echarts.init(id);
    //   Column.setOption({
    //     title: {
    //       text: "地面安全事故风险标准比照图",
    //       left: "center",
    //     },
    //     tooltip: {
    //       trigger: "item",
    //     },
    //     legend: {
    //       orient: "vertical",
    //       left: "right",
    //     },
    //     xAxis: {
    //       axisLabel: {
    //         interval: 0,
    //         rotate: -10,
    //         show: true,
    //       },
    //       type: "category",
    //       data: [
    //         "发生一般事故风险值（参照）",
    //         "发生较大事故风险值（参照）",
    //         "发生重大事故风险值（参照）",
    //         "发生特大事故风险值（参照）",
    //         "本次任务实际风险值",
    //       ],
    //     },
    //     yAxis: {
    //       type: "value",
    //     },
    //     series: [
    //       {
    //         data: [this.num3, this.num4, this.num5, this.num6, this.num7],
    //         type: "bar",
    //       },
    //     ],
    //   });
    // },
    // 饼图接口数据
    async pieData() {
      await this.$http
        .get("/forecast/infodata", {
          forecast_id: this.data.id,
        })
        .then((res) => {
          this.pData = res.data.data;
        });
    },
    //安全资源数据
    async securData() {
      this.typeData=[]
      const res = await this.$http.get("/itemcate/list", {
        params: {
          item_id: 1,
        },
      });
      if (res.data.code == 0) {
        let array = res.data.data;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element.pid == 0) {
            // 模板数据接口
            element.seData = []
            element.show = false
            const d = await this.$http.get("/assetslibrary/list", {
              params: {
                forecast_id: this.data.id,
                itemcate_id: element.id
              },
            });
            if(d.data.data){
              element.show = true
              element.seData = d.data.data
            }else{
              element.show = false
            }
            this.typeData.push(element);
          }
        }
      }
      console.log(this.typeData);
    },
    // 隐患因素数据
    dangerData() {},
    // 隐患因素数据2
    dangerDataTwo() {},
    // 威胁因素数据
    riskData() {},
    // Mathnum() {
    //   this.num3 = Math.floor(Math.random() * (500 - 100)) + 100;
    //   this.num4 = Math.floor(Math.random() * (500 - 100)) + 100;
    //   this.num5 = Math.floor(Math.random() * (500 - 100)) + 100;
    //   this.num6 = Math.floor(Math.random() * (500 - 100)) + 100;
    //   this.num7 = Math.floor(Math.random() * (500 - 100)) + 100;
    // },
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
.secur {
  border: 1px solid #aaa;
}
.secur .p {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
}
#pie {
  margin-top: 20px;
}
ul {
  padding: 10px 20px;
  list-style: none;
}
ul li {
  display: flex;
  justify-content: space-between;
}
.data {
  width: 640px;
  margin-bottom: 30px;
}
.data p {
  border-bottom: 1px dashed #aaa;
  height: 30px;
  line-height: 40px;
}
.data p span {
  margin-left: 30px;
}
</style>