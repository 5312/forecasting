<template>
  <div class="wrap">
    <el-card>
      <h1 class="title">{{ this.$route.query.name }}</h1>
      <div
        id="pie"
        :style="{ width: '100%', height: '300px', marginTop: '60px' }"
      ></div>
      <!-- </el-card>
    <el-card> -->
      <div class="tit">
        <div class="secur">
          <p class="p">安全资源</p>
          <hr />
          <ul>
            <li v-for="(i, j) in typeData" :key="j">
              <el-tag class="name" v-if="i.show">{{ i.name }}</el-tag>
              <div class="data" v-if="i.show">
                <el-table :data="i.seData" border style="width: 100%">
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px;">{{
                        scope.row.title
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="数量" width="80">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{
                        scope.row.sums
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="内容">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{
                        scope.row.scoreTitle
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="总赋值" width="80">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{
                        scope.row.Scoresum
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </li>
            <li class="j-end">
              <div class="left">
                得分(R):<span class="score">{{ all_anquanziyuan() }} </span>
              </div>
            </li>
          </ul>
        </div>
        <div class="secur">
          <p class="p">隐患因素</p>
          <hr />
          <ul id="table">
            <li v-for="(i, j) in typeData1" :key="j">
              <el-tag type="danger" class="name">{{ i.name }}</el-tag>
              <div class="data margin-left">
                <el-table
                  class="el-table"
                  :data="i.daData"
                  style="width: 100%"
                  border
                  show-summary
                  :summary-method="getSummaries"
                  :row-style="{ background: '#fff' }"
                  :cell-style="needStyle"
                >
                  <el-table-column
                    prop="itemcate_cid"
                    label="排查内容"
                    width="180"
                    align="center"
                    class-name="cols"
                  >
                    <template slot-scope="scope">
                      <span style="margin-left: 10px;margin:auto;">{{
                        getName(scope.row.itemcate_cid)
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="scoreTitle"
                    label="扣分项目"
                    width="180"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{
                        scope.row.scoreTitle
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Scoresum" label="扣分" align="center">
                    <template slot-scope="scope">
                      <span
                        style="margin-left: 10px;color:red;text-align:cener;"
                        >{{ "-" + scope.row.Scoresum * 100 + "%" }}</span
                      >
                    </template>
                  </el-table-column>
                </el-table>

                <div class="table_box" v-if="i.show">
                  <el-table :data="i.chData" border style="width: 100%">
                    <el-table-column label="隐患行为">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px;color:red;">{{
                          scope.row.title
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="数量" width="80">
                      <template slot-scope="scope">
                        <span style="margin-left: 10px">{{
                          scope.row.sums
                        }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="secur">
          <el-table
            :data="typeData2"
            border
            style="width: 100%;"
            show-summary
            :summary-method="getSummaries_weixie"
          >
            <el-table-column label="威胁因素" align="center">
              <el-table-column label="威胁行为" align="center">
                <template slot-scope="scope">
                  <span style="margin-left: 10px;color:red;">{{
                    scope.row.title
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="频率" align="center">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{
                    scope.row.scoreTitle
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="安全风险">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{
                    scope.row.riskdataTitle
                  }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
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
      typeData2: []
    };
  },
  watch: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.pieData().then(() => {
        vm.drawPie();
      });
      vm.securData();
      vm.dangerData();
      vm.riskData();
    });
  },
  mounted() {
    // console.log("11");
    this.$nextTick(() => {
      this.pieData().then(() => {
        this.drawPie();
      });
      this.securData();
      this.dangerData();
      this.riskData();
    });
  },
  methods: {
    // 行样式
    needStyle(column) {
      let cellStyle;
      switch (column.column.property) {
        default:
          cellStyle = { background: "#fff" };

          break;
      }
      return cellStyle;
    },
    // 威胁因素 合计计算
    getSummaries_weixie(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "得分(V)";
          return;
        }
        if (index === 1) {
          column.colSpan = 2;
          // 防止data未null
          if (!data) return;
          const values = data.map(item => Number(item["score"]));
          if (!values.every(value => isNaN(value))) {
            let array = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            });
            sums[index] = array;
          } else {
            sums[index] = "";
          }
        }
      });
      return sums;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          let str = ` 得分(  A  ) `;

          sums[index] = str;
          column.colSpan = 2;
          return;
        }
        if (!data) return (sums[index] = "x");
        const values = data.map(item => Number(item[column.property]));

        if (!values.every(value => isNaN(value))) {
          let sum_math = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);

          sum_math = 1 - sum_math;
          if (sum_math >= 0.9) {
            sums[index] = 1;
          }
          if (sum_math < 0.9 && sum_math >= 0.8) {
            sums[index] = 2;
          }
          if (sum_math < 0.8 && sum_math >= 0.7) {
            sums[index] = 3;
          }
          if (sum_math < 0.7 && sum_math >= 0.6) {
            sums[index] = 4;
          }
          if (sum_math < 0.6 && sum_math >= 0.5) {
            sums[index] = 5;
          }
          if (sum_math < 0.5) {
            sums[index] = 5;
          }
        } else {
          sums[index] = "x";
        }
      });
      sums[1] = sums[2];
      return sums;
    },
    // 饼图数据
    drawPie() {
      let Pie = echarts.getInstanceByDom(document.getElementById("pie"));
      if (Pie == null) {
        // 如果不存在，就进行初始化。
        Pie = echarts.init(document.getElementById("pie"));
      } else {
        Pie.dispose();
        Pie = echarts.init(document.getElementById("pie"));
      }
      // let Pie = echarts.init(id);
      let type = {
        0: "pie",
        1: "bar"
      };
      const charts_data = this.pData;
      const t = type[this.pData[0].mongxing];
      let bar_x = {};
      if (t == "bar") {
        bar_x = {
          xAxis: {
            type: "category",
            data: [
              "发生特大事故风险值(参照)",
              "发生重大事故风险值(参照)",
              "发生较大事故风险值(参照)",
              "发生一般事故风险值(参照)",
              "本次任务实际风险值"
            ]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              data: [
                {
                  value: charts_data[0].Pa,
                  itemStyle: {
                    color: "#990000"
                  }
                },
                {
                  value: charts_data[0].Pb,
                  itemStyle: {
                    color: "#CC0000"
                  }
                },
                {
                  value: charts_data[0].Pc,
                  itemStyle: {
                    color: "#FF6600"
                  }
                },
                {
                  value: charts_data[0].Pd,
                  itemStyle: {
                    color: "#FFCC00"
                  }
                },
                charts_data[0].Pe
              ],
              type: "bar",
              showBackground: true,
              backgroundStyle: {
                color: "rgba(180, 180, 180, 0.2)"
              }
            }
          ]
        };
      } else {
        bar_x = {
          series: [
            {
              type: t,
              radius: "50%",
              data: [
                {
                  value: charts_data.map(d => d.Pa),
                  name: "人因安全事故（人员受损）"
                },
                {
                  value: charts_data.map(d => d.Pb),
                  name: "物因安全事故（装备受损）"
                },
                { value: charts_data.map(d => d.Pc), name: "环境安全风险" },
                { value: charts_data.map(d => d.Pd), name: "管理安全风险" }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
      }
      Pie.setOption({
        ...bar_x,
        title: {
          text: "安全风险隐患",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          left: "left"
        }
      });
    },
    // 饼图接口数据
    async pieData() {
      const res = await this.$http.get("/forecast/infodata", {
        params: {
          forecast_id: this.$route.query.id
        }
      });
      this.pData = res.data.data;
    },
    //安全资源数据
    async securData() {
      const array_data = [];
      const res = await this.$http.get("/itemcate/list", {
        params: {
          item_id: 1
        }
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
                forecast_id: this.$route.query.id,
                itemcate_id: element.id
              }
            });
            if (d.data.data) {
              element.show = true;
              element.seData = d.data.data;
            } else {
              element.show = false;
            }
            array_data.push(element);
          }
        }
      }
      this.typeData = array_data;
    },
    all_anquanziyuan() {
      let arr = this.typeData;
      let r = 0;
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element.seData.length > 0) {
          let child = element.seData;
          for (let x = 0; x < child.length; x++) {
            const children = child[x];
            r += children.Score * children.sums;
          }
        }
      }
      return r;
    },
    // 隐患因素数据获取name
    getName(cid) {
      let array1 = this.alldanger;
      for (let index = 0; index < array1.length; index++) {
        const obj = array1[index];
        if (cid == obj.id) {
          return obj.name;
        }
      }
    },
    // 隐患因素数据
    async dangerData() {
      this.typeData1 = [];
      const res = await this.$http.get("/itemcate/list", {
        params: {
          item_id: 2
        }
      });
      if (res.data.code == 0) {
        let array1 = res.data.data;
        // 隐患因素
        this.alldanger = array1;
        const newdata = [];
        for (let index = 0; index < array1.length; index++) {
          const element = array1[index];
          if (element.pid == 0) {
            element.daData = [];
            element.children = [];
            element.chData = [];
            element.show = false;
            // 取扣分
            const children_score = await this.$http.get(
              "/hiddendangerscorelibrary/list",
              {
                params: {
                  forecast_id: this.$route.query.id, // 当前行id
                  itemcate_id: element.id // 栏目id
                }
              }
            );
            element.daData = children_score.data.data;

            // 取隐患行为
            const childData = await this.$http.get(
              "/hiddendangerlibrary/list",
              {
                params: {
                  forecast_id: this.$route.query.id, // 当前行id
                  itemcate_id: element.id // 栏目id
                }
              }
            );
            let num = childData.data.data || [];
            element.childData = num;
            if (childData.data.data) {
              element.show = true;
              element.chData = childData.data.data;
            } else {
              element.show = false;
            }
            newdata.push(element);
          }
        }
        this.typeData1 = newdata;
      }
    },
    // 威胁因素数据
    async riskData() {
      const riData = await this.$http.get("/risklibrary/list", {
        params: {
          forecast_id: this.$route.query.id
        }
      });
      this.typeData2 = riData.data.data;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  padding: 15px;
  .title {
    margin: auto;
    text-align: center;
  }
  #pie {
    margin-top: 20px;
    margin: 0 auto;
  }

  .tit {
    .secur {
      border: 1px solid #aaa;
      width: 80%;
      margin: auto;
      margin-bottom: 30px;
      .p {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        height: 50px;
        line-height: 50px;
      }
      ul {
        padding: 10px 20px;
        list-style: none;
        li {
          display: flex;
          justify-content: space-between;
        }
        .j-end {
          justify-content: flex-end;
          .score {
            font-size: 20px;
            margin-left: 10px;
            color: rgb(84 112 198);
            font-weight: 800;
          }
        }
      }
    }
  }
}
::v-deep .el-table .el-table__footer-wrapper tbody td {
  background: #fff !important;
}
::v-deep .el-table .el-table__footer-wrapper tbody td:nth-child(2) .cell {
  font-size: 20px !important;
  color: red;
  font-weight: 800;
}
.margin-left {
  margin-left: 15px;
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
.da {
  margin-left: 20px;
}
.danger {
  padding: 10px 10px 10px 0;
}
.tag {
  margin-right: 10px;
}
</style>
