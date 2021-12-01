<template>
  <div>
    <el-dialog
      title="安全资源"
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
        :parse-data="parseData_left"
      >
        <!-- 表格数据 -->
        <template slot="scortNum" slot-scope="{ row }">
          {{row.sums}}
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
      <el-input type="textarea" placeholder="请输入" v-model="inner"></el-input>
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
      sums:0
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
      const res = await this.$http.get("assets/list?", {
        params: {
          forecast_id: this.forecast,
          itemcate_id: this.params,
          itemcate_cid: "",
        },
      });
      this.load = false;
      if (res.data.code == 0) {
        this.data = res.data.data;
        for (let i = 0; i < this.data.length; i++) {
          const ele = this.data[i];
          if (ele.isForecast == 1) {
            this.data.splice(i, 1);
            i--;
          }
        }
        this.parseData_left()
      }
    },
    parseData_left() {
      if (!this.data) return { code: 0, data: [] };
      let parse = this.data;
      for (let i = 0; i < parse.length; i++) {
        const element = parse[i];
        var ele = element.assets_json
          ? JSON.parse(element.assets_json)
          : { data: [] };
        let data = ele.data;
        for (let j = 0; j < data.length; j++) {
          const obj = data[j];
          Object.assign(element, obj);
        }
      }
        return {
          btype: 0,
          code: 0,
          count: 0,
          data: parse,
          msg: "操作成功",
        };
    },
    // 点击添加触发
    async openEdit(row) {
      let param = row;
      Object.assign(param, {
        forecast_id: this.forecast,
        assets_id: row.id,
      });
      const res = await this.$http.post("/assetslibrary/add", param);
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
      const inn = await this.$http.post("/assetslibrary/addall", {
        inner: this.inner,
      });
      console.log(inn);
      const res = await this.$http.post("/assetslibrary/add", {
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