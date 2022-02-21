<template>
  <div class="wrap">
    <el-card>
      <div id="pie" :style="{ width: '700px', height: '300px' }"></div>
      <!-- </el-card>
    <el-card> -->
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
              <div class="data margin-left">
                <el-table :data="i.daData" style="width: 100%" border>
                  <el-table-column label="排查内容" width="180">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{
                        getName(scope.row.itemcate_cid)
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="扣分项目" width="180">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{
                        scope.row.scoreTitle
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="扣分">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{
                        scope.row.Scoresum * 100 + "%"
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="table_box" v-if="i.show">
                  <el-table :data="i.chData" border style="width: 100%">
                    <!--  :show-header="false" -->
                    <el-table-column label="隐患内容" align="center">
                      <el-table-column label="排查内容">
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{
                            scope.row.title
                          }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="name" label="扣分项目">
                        <template slot-scope="scope">
                          <span style="margin-left: 10px">{{
                            scope.row.sums
                          }}</span>
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="secur">
          <p class="p">威胁因素</p>
          <hr />
          <div class="data">
            <p class="seData" v-for="(i, j) in typeData2" :key="j">
              <span>威胁行为：{{ i.title }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp; <span>频率： {{ i.scoreTitle }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <span>安全风险：{{ i.riskdataTitle }}</span>
            </p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from "echarts";
// import { constants } from 'http';
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
  mounted() {
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
    // 饼图数据
    drawPie() {
      let id = document.getElementById("pie");
      let Pie = echarts.init(id);
      Pie.setOption({
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
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              {
                value: this.pData.map(d => d.Pa),
                name: "人因安全事故（人员受损）"
              },
              {
                value: this.pData.map(d => d.Pb),
                name: "物因安全事故（装备受损）"
              },
              { value: this.pData.map(d => d.Pc), name: "环境安全风险" },
              { value: this.pData.map(d => d.Pd), name: "管理安全风险" }
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
      });
    },
    // 饼图接口数据
    async pieData() {
      await this.$http
        .get("/forecast/infodata", {
          forecast_id: this.$route.query.data.id
        })
        .then(res => {
          this.pData = res.data.data;
        });
    },
    //安全资源数据
    async securData() {
      this.typeData = [];
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
                forecast_id: this.$route.query.data.id,
                itemcate_id: element.id
              }
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
    // 隐患因素数据获取name
    getName(cid) {
      console.log(cid);
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
          .table_box {
            margin: 10px 0;
          }
        }
      }
    }
  }
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
