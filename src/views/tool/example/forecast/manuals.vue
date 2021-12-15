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
        :columns="columns"
        :datasource="data"
        :toolbar="false"
        :selection.sync="selection"
        height="calc(100vh - 420px)"
      >
        <!--  -->
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
  name: "Manual",
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    params: Number,
    forecast: Number
  },
  data() {
    return {
      colDefault: [
        {
          columnKey: "selection",
          type: "selection",
          width: 45,
          align: "center",
          fixed: "left"
        },
        {
          prop: "id",
          label: "ID",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          prop: "title",
          label: "名称",
          align: "center",
          minWidth: 200
        },
        {
          prop: "sums",
          label: "数量",
          width: 60,
          align: "center"
        },
        {
          prop: "scoreTitle",
          label: "评价标准",
          width: 300,
          align: "center"
        },
        {
          prop: "Score",
          label: "资源赋值(R)",
          align: "center",
          minWidth: 120
        },
        {
          prop: "Scoresum",
          label: "总赋值",
          align: "center"
        }
      ],
      // 选中数据
      selection: [],
      load: false,
      data: [],
      where: {}
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.index();
      } else {
        this.data = [];
      }
    }
  },
  computed: {
    columns() {
      let array = this.colDefault;
      return array;
    }
  },
  methods: {
    async index() {
      this.load = true;
      const res = await this.$http.get("assets/list?", {
        params: {
          itemcate_id: this.params,
          itemcate_cid: ""
        }
      });
      this.load = false;
      if (res.data.code == 0) {
        this.data = res.data.data;
      }
    },
    async save() {
      let params = { data: this.selection };
      console.log(JSON.stringify(params));
      // return;
      const res = this.$http.post("/assetslibrary/add", {
        forecast_id: this.forecast
      });
      // return;
      if (res.data.code == 0) {
        this.$emit("saveTableData", this.selection);
      }
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    }
  }
};
</script>
