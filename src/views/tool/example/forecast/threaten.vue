<template>
  <div>
    <el-dialog
      title="隐患因素"
      :visible="visible"
      width="800px"
      :destroy-on-close="true"
      :lock-scroll="false"
      @update:visible="updateVisible"
      append-to-body
    >
      <ele-pro-table
        v-loading="load"
        ref="table"
        :where="where"
        :columns="column"
        :datasource="data"
        :toolbar="false"
        :selection.sync="selection"
        height="calc(100vh - 420px)"
      >
        <!-- 表格数据 -->
        <template slot="score" slot-scope="{ row }">
          {{ row.score * 100 }}%
        </template>
         <template slot="score" slot-scope="{ row }">
          {{ row.score * 100 }}%
        </template>
       <template slot="danger" slot-scope="{ row }">
          <div>
            <div v-for="item in row.yinhuanTitle" :key="item.id">
              {{ item.name }}
            </div>
          </div>
        </template>
        <template slot="safe" slot-scope="{ row }">
          <div>
            <div v-for="item in row.ziyuanTitle" :key="item.id">
              {{ item.name }}
            </div>
          </div>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{ row }">
          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="openEdit(row)"
            >添加
          </el-link>
        </template>
      </ele-pro-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible(false)">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SafeStatus",
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    params: Number,
    forecast: Number,
    column: Array,
  },
  data() {
    return {
      // 选中数据
      selection: [],
      load: false,
      data: [],
      where: {},
      inner: "",
      isFore: [],
      isForeCast: "",
      disabled: false,
      num: 1,
      sums: 0,
      ziyuanData:[],
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.index();
      } else {
        this.data = [];
      }
    },
  },
  computed: {},
  mounted() {},
  methods: {
    // 弹框内数据
    async index() {
      this.load = true;
      const res = await this.$http.get("/risk/list?", {
        params: {
          forecast_id: this.forecast,
          itemcate_id: this.params,
          itemcate_cid: "",
        },
      });
      this.load = false;
      if (res.data.code == 0) {
        this.data = res.data.data;
        // console.log(this.data)
        for (let i = 0; i < this.data.length; i++) {
          const ele = this.data[i];
          if (ele.isForecast == 1) {
            this.data.splice(i, 1);
            i--;
          }
        //   const eleData = ele.ziyuanTitle
        //   for (let j = 0; j < eleData.length; j++) {
        //       const element = eleData[j];
        //       this.ziyuanData = element.name
        //   }
        //   console.log(this.ziyuanData)
          
        }
      }
    },
    // 点击添加触发
    async openEdit(row) {
      let param = row;
      Object.assign(param, {
        forecast_id: this.forecast,
        risk_id: row.id,
      });
      const res = await this.$http.post("/risklibrary/add", param);
      if (res.data.code == 0) {
        this.$emit("saveTableData", this.selection);
      }
      this.updateVisible(true);
      this.index();
    },
    // 保存
    async save() {
      let params = { data: this.selection };
      console.log(JSON.stringify(params));
      const res = await this.$http.post("/risklibrary/add", {
        forecast_id: this.forecast,
      });
      if (res.data.code == 0) {
        this.$emit("saveTableData", this.selection);
      }
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
  },
};
</script>
<style scoped>
.bgc {
  background-color: rgb(248, 188, 188);
}
</style>