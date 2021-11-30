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
        <!-- 操作列 -->
        <template slot="action" slot-scope="{ row }" :class="{
          'bgc' : isForeCast == 1 ? true : false
        }">
          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="openEdit(row)"
            :disabled="disabled"
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
  },
  data() {
    return {
      colDefault: [
        {
          columnKey: "selection",
          type: "selection",
          width: 45,
          align: "center",
          fixed: "left",
        },
        {
          prop: "id",
          label: "ID",
          width: 60,
          align: "center",
          fixed: "left",
        },
        {
          prop: "title",
          label: "名称",
          align: "center",
          minWidth: 120,
        },
        {
          prop: "sums",
          label: "数量",
          width: 180,
          align: "center"
        },
        {
          prop: "scoreTitle",
          label: "评价标准",
          width: 300,
          align: "center",
        },
        {
          prop: "Score",
          label: "资源赋值(R)",
          align: "center",
          minWidth: 120,
        },
        {
          prop: "Scoresum",
          label: "总赋值",
          align: "center",
        },
        {
          columnKey: "action",
          label: "操作",
          width: 150,
          align: "center",
          resizable: false,
          slot: "action",
          fixed: "right",
        },
      ],
      // 选中数据
      selection: [],
      load: false,
      data: [],
      where: {},
      inner:"",
      isFore:[],
      isForeCast:"",
      disabled:false,
      num:1
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
  computed: {
    columns() {
      let array = this.colDefault;
      return array;
    },
  },
  mounted(){
    // console.log(this.props)
  },
  methods: {
   
    async index() {
      this.load = true;
      console.log(this.forecast)
      const res = await this.$http.get("assets/list?", {
        params: {
          forecast_id: this.forecast,
          itemcate_id: this.params,
          itemcate_cid: "",
        },
      });
      // console.log(res.data.data.isForecast)
      this.load = false;
      if (res.data.code == 0) {
        this.data = res.data.data;
      }
      this.isFore = res.data.data
      for (let y = 0; y < this.isFore.length; y++) {
        const element = this.isFore[y];
        this.isForeCast = element.isForecast
        console.log(this.isForeCast)
        if(this.isForeCast == 1) {
          this.disabled = true
        }
      }
    },
    async openEdit(row) {
      let param = row;
      // console.log(this.forecast)
      Object.assign(param, {
        forecast_id: this.forecast,
        assets_id: row.id,
      });
      const res = await this.$http.post("/assetslibrary/add", param);
      if (res.data.code == 0) {
        // console.log(res.data.data);
        this.$emit("saveTableData", this.selection);
      }
    },
    async save() {
      let params = { data: this.selection };
      console.log(JSON.stringify(params));
      const inn = await this.$http.post("/assetslibrary/addall",{
        inner:this.inner
      })
      console.log(inn)
      // return;
      const res = await this.$http.post("/assetslibrary/add", {
        forecast_id: this.forecast,
      });
      // return;
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