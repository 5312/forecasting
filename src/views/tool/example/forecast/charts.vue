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
              <el-tag  class="name" v-if="i.show">{{ i.name }}:</el-tag>
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
            <li>
              <el-tag type="danger" class="name">人因隐患</el-tag>
              <div class="data">
                <div class="data">
                  <span v-for="(q, w) in arr1" :key="w">
                    {{ q.tit }}&nbsp;&nbsp;{{ q.tit1 }}&nbsp;&nbsp;{{ q.tit2 }},
                  </span>
                </div>
                <div class="data">
                  <p v-for="(a, s) in arr7" :key="s">
                    <span>{{ a.arr1 }}</span>
                    <span>{{ a.arr2 }}</span>
                  </p>
                </div>
              </div>
            </li>
            <li>
              <el-tag type="danger" class="name">物因隐患</el-tag>
              <div class="data">
                <div class="data">
                  <span v-for="(q, w) in arr2" :key="w">
                    {{ q.tit }}&nbsp;&nbsp;{{ q.tit1 }}&nbsp;&nbsp;{{ q.tit2 }},
                  </span>
                </div>
                <div class="data">
                <p v-for="(a,s) in arr5" :key="s">
                  <span>{{a.arr1}}</span>
                  <span>{{a.arr2}}</span>
                </p>
              </div>
              </div>
            </li>
            <li>
              <el-tag type="danger" class="name">环境隐患</el-tag>
              <div class="data">
                <div class="data">
                  <span v-for="(q, w) in arr3" :key="w">
                    {{ q.tit }}&nbsp;&nbsp;{{ q.tit1 }}&nbsp;&nbsp;{{ q.tit2 }},
                  </span>
                </div>
                <div class="data">
                <p v-for="(a,s) in arr6" :key="s">
                  <span>{{a.arr1}}</span>
                  <span>{{a.arr2}}</span>
                </p>
              </div>
              </div>
            </li>
            <li>
              <el-tag type="danger" class="name">管理隐患</el-tag>
              <div class="data">
                <div class="data">
                  <span v-for="(q, w) in arr4" :key="w">
                    {{ q.tit }}&nbsp;&nbsp;{{ q.tit1 }}&nbsp;&nbsp;{{ q.tit2 }},
                  </span>
                </div>
                <div class="data">
                <p v-for="(a,s) in arr8" :key="s">
                  <span>{{a.arr1}}</span>
                  <span>{{a.arr2}}</span>
                </p>
              </div>
              </div>
            </li>
          </ul>
          <!-- <ul>
            <li v-for="(i, j) in typeData1" :key="j">
              <div class="name">{{ i.name }}:</div>
              <div class="data">
                <p v-for="(x, y) in i.daData" :key="y">
                  <span>名称：{{ x.title }}</span>
                  <span>数量：{{ x.sums }}</span>
                  <span>{{ x.scoreTitle }}</span>
                  <span>扣分：{{ x.Scoresum * 100 + "%" }}</span>
                </p>
              </div>
            </li>
          </ul> -->
        </div>
        <div class="secur">
          <p class="p">威胁因素</p>
          <hr />
          <div class="data1">个别人员近期出现异常&nbsp;&nbsp;&nbsp;&nbsp;极频繁&nbsp;&nbsp;&nbsp;&nbsp;人因隐患&nbsp;&nbsp;&nbsp;&nbsp;作战战备领域重大风险</div>
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

      arr: [
        {
          name: "人因隐患",
        },
        {
          name: "物因隐患",
        },
        {
          name: "环境隐患",
        },
        {
          name: "管理隐患",
        },
      ],
      arr1: [
        {
          tit: "思想状态",
          tit1: "隐患严重扣20%",
          tit2: "20%",
        },
        {
          tit: "健康状态",
          tit1: "隐患一般扣10%",
          tit2: "10%",
        },
        {
          tit: "安全观念",
          tit1: "隐患严重扣15%",
          tit2: "15%",
        },
        {
          tit: "责任观念",
          tit1: "隐患严重扣15%",
          tit2: "15%",
        },
        {
          tit: "能力素质",
          tit1: "隐患一般扣5%",
          tit2: "5%",
        },
      ],
      arr2: [
        {
          tit: "质量技术状态",
          tit1: "隐患严重扣25%",
          tit2: "25%",
        },
        {
          tit: "检查维护状态",
          tit1: "隐患一般扣10%",
          tit2: "10%",
        },
      ],
      arr3: [
        {
          tit: "社会环境",
          tit1: "隐患严重扣20%",
          tit2: "20%",
        },
        {
          tit: "地质环境",
          tit1: "隐患一般扣10%",
          tit2: "10%",
        },
        {
          tit: "气候环境",
          tit1: "隐患严重扣15%",
          tit2: "15%",
        },
      ],
      arr4: [
        {
          tit: "组织机构",
          tit1: "隐患严重扣30%",
          tit2: "30%",
        },
        {
          tit: "指挥管理能力",
          tit1: "隐患一般扣20%",
          tit2: "20%",
        },
      ],
      arr5: [
        {
          arr1: "质量技术存在重大缺陷",
          arr2: 5,
        },
      ],
      arr6: [
        {
          arr1: "存在赌博隐患",
          arr2: 1,
        },
        {
          arr1: "存在道路交通隐患",
          arr2: 3,
        },
        {
          arr1: "存在涉黄隐患",
          arr2: 1,
        },
      ],
      arr7: [
        {
          arr1: "思想不稳定",
          arr2: 3,
        },
        {
          arr1: "思想松懈",
          arr2: 5,
        },
        {
          arr1: "安全意识弱化",
          arr2: 8,
        },
      ],
      arr8: [
        {
          arr1: "管理体系不健全",
          arr2: 3,
        },
        {
          arr1: "各级责任分工不明确",
          arr2: 5,
        },
      ],
      arr9: [],
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
                value: 23.4,
                // value: this.pData.map((d) => d.Pa),
                name: "人因安全事故（人员受损）",
              },
              {
                value: 12.5,
                // value: this.pData.map((d) => d.Pb),
                name: "物因安全事故（装备受损）",
              },
              { value: 15.3, name: "环境安全风险" },
              { value: 18.5, name: "管理安全风险" },
              // { value: this.pData.map((d) => d.Pc), name: "环境安全风险" },
              // { value: this.pData.map((d) => d.Pd), name: "管理安全风险" },
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
        // console.log(array1);
        for (let index = 0; index < array1.length; index++) {
          const element = array1[index];
          if (element.pid == 0) {
            element.daData = [];
            element.children = [];
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
            // let num = children_score.data.data || [];
            // element.children_score = num;
            // 1.id == c.pid 当前节点的子节点
            // for (let i = 0; i < array.length; i++) {
            //   const ele = array[i];
            //   if (element.id == ele.pid) {
            //     element.children.push(ele);
            //     console.log(element.children);
            //   }
            // }
            // console.log(element.daData)
            this.typeData1.push(element);
            // console.log(this.typeData1);
          }
        }
      }
      // loading.close();
    },
    async formate(data) {
      let array = data;
      // 生成手风琴 栏目项
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        // 表格 数据 接口
        element.daData = [];
        const a = await this.$http.get("/hiddendangerlibrary/list", {
          params: {
            forecast_id: this.$route.query.data.id,
            itemcate_id: element.id,
          },
        });
        console.log(a.data.data);
        // element.url = "/hiddendangerlibrary/list";
        element.show = true;
        // 总分
        element.score = 0;
        element.children = [];
        /*********/

        const children_score = await this.$http.get(
          "/hiddendangerscorelibrary/list",
          {
            params: {
              forecast_id: this.data.id, // 当前行id
              itemcate_id: element.id, // 栏目id
            },
          }
        );
        let num = children_score.data.data || [];
        element.children_score = num;
        // 1.id == c.pid 当前节点的子节点
        for (let i = 0; i < array.length; i++) {
          const ele = array[i];
          if (element.id == ele.pid) {
            element.children.push(ele);
            this.primData.push(ele);
          }
        }
        /***********/
        this.typeData1.push(element);
        console.log(this.typeData1);
        // }
      }
    },
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
</style>
