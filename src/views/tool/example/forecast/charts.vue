<template>
  <div>
    <div id="pie" :style="{ width: '700px', height: '300px' }"></div>
    <el-card>
      <div class="tit">
        <div class="secur">
          <p class="p">安全资源</p>
          <hr />
          <ul>
            <li v-for="(i, j) in typeData" :key="j">
              <el-tag class="name" v-if="i.show">{{ i.name }}:</el-tag>
              <div class="data" v-if="i.show">
                <p v-for="(x, y) in i.seData" :key="y">
                  <span>名称：{{ x.title }}</span>
                  <span>数量：{{ x.sums }}</span>
                  <span>{{ x.scoreTitle }}</span>
                  <span>总赋值：{{ x.Scoresum }}</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="secur">
          <p class="p">隐患因素</p>
          <hr />
          <ul>
            <li v-for="(i, j) in typeData1" :key="j">
              <el-tag type="danger" class="name">{{ i.name }}:</el-tag>
              <div class="data">
                <div class="data">
                  <span v-for="(x, y) in i.daData" :key="y">
                    &nbsp;&nbsp;{{ x.title }}&nbsp;&nbsp;{{
                      x.scoreTitle
                    }}&nbsp;&nbsp;扣分：{{ x.Scoresum * 100 + "%" }}
                  </span>
                </div>
                <div class="data" v-if="i.show">
                  <p v-for="(y, z) in i.chData" :key="z">
                    <span>隐患行为：{{ y.title }}</span>
                    <span>数量：{{ y.sums }}</span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="secur">
          <p class="p">威胁因素</p>
          <hr />
          <div class="data">
            <p class="seData" v-for="(i,j) in typeData2" :key="j">
              <span>威胁行为：{{i.title}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span>频率： {{i.scoreTitle}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{{i.yinhuanTitle.name}}</span> &nbsp;&nbsp;&nbsp;&nbsp;
              <span>安全风险：{{i.riskdataTitle}}</span>
            </p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from "echarts";
// 引入折线图组件
export default {
  name: "Charts",

  data() {
    return {
      // 饼图数据
      pData: [],
      // 柱形图数据
      // cData: [],
      // 安全资源数据
      typeData: [],
      // 隐患因素数据
      typeData1: [],
      // 威胁因素数据
      typeData2:[]
    };
  },
  watch: {},
  mounted() {
    console.log(this.$route.query.data);
    this.$nextTick(() => {
      this.pieData().then(() => {
        this.drawPie();
      });
      this.securData();
      this.dangerData();
      this.riskData()
    });
  },
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
                // value: 23.4,
                value: this.pData.map((d) => d.Pa),
                name: "人因安全事故（人员受损）",
              },
              {
                // value: 12.5,
                value: this.pData.map((d) => d.Pb),
                name: "物因安全事故（装备受损）",
              },
              // { value: 15.3, name: "环境安全风险" },
              // { value: 18.5, name: "管理安全风险" },
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
          forecast_id: this.$route.query.data.id,
        })
        .then((res) => {
          this.pData = res.data.data;
        });
    },
    //安全资源数据
    async securData() {
      this.typeData = [];
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
            element.seData = [];
            element.show = false;
            const d = await this.$http.get("/assetslibrary/list", {
              params: {
                forecast_id: this.$route.query.data.id,
                itemcate_id: element.id,
              },
            });
            if (d.data.data) {
              element.show = true;
              element.seData = d.data.data;
            } else {
              element.show = false;
            }
            this.typeData.push(element);
          }
        }
      }
    },
    // 隐患因素数据
    async dangerData() {
      this.typeData1 = [];
      const res = await this.$http.get("/itemcate/list", {
        params: {
          item_id: 2,
        },
      });
      if (res.data.code == 0) {
        let array1 = res.data.data;
        for (let index = 0; index < array1.length; index++) {
          const element = array1[index];
          if (element.pid == 0) {
            element.daData = [];
            element.children = [];
            element.chData = [];
            element.show = false;
            const children_score = await this.$http.get(
              "/hiddendangerscorelibrary/list",
              {
                params: {
                  forecast_id: this.$route.query.id, // 当前行id
                  itemcate_id: element.id, // 栏目id
                },
              }
            );
            element.daData = children_score.data.data;

            const childData = await this.$http.get(
              "/hiddendangerlibrary/list",
              {
                params: {
                  forecast_id: this.$route.query.id, // 当前行id
                  itemcate_id: element.id, // 栏目id
                },
              }
            );
            if (childData.data.data) {
              element.show = true;
              element.chData = childData.data.data;
            } else {
              element.show = false;
            }
            this.typeData1.push(element);
          }
        }
      }
    },
    // 威胁因素数据
    async riskData() {
      const riData = await this.$http.get("/risklibrary/list",{
        params:{
          forecast_id: this.$route.query.id
        }
      })
      this.typeData2 = riData.data.data
      // for (let index = 0; index < this.typeData2.length; index++) {
      //   const element = this.typeData2[index];
      //   let ele = element.yinhuanTitle
      //   for (let i = 0; i < ele.length; i++) {
      //     const ele1 = ele[i];
      //     console.log(ele1.name)
      //   }
      // }
    },
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
  width: 80%;
  margin-bottom: 30px;
  margin-right: 20px;
  margin-left: 10%;
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
  margin: 0 auto;
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
  width: 93%;
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
.data1 {
  width: 100%;
  height: 50px;
  position: relative;
  top: 10px;
  left: 20px;
  margin-bottom: 20px;
}
.seData {
  margin-left: 30px;
}
</style>
