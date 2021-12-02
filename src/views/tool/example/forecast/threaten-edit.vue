<!-- 添加威胁调查编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '添加威胁调查' : '修改威胁调查'"
    :visible="visible"
    width="1900px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
    class="dialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <div class="title">{{ form.title }}</div>
      <!--  -->
      <ele-pro-table
        :ref="'table'"
        :where="where"
        :columns="defaultColumns"
        datasource="/risklibrary/list"
        :toolbar="true"
        height="calc(100vh -800px)"
        :page-size="150"
      >
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            icon="el-icon-plus"
            class="ele-btn-icon"
            style="float: right; padding: 3px 0; margin-left: 10px"
            type="primary"
            @click.stop="addSafeStatus()"
            >添加</el-button
          >
          <el-button
            icon="el-icon-plus"
            class="ele-btn-icon"
            style="float: right; padding: 3px 0"
            type="primary"
            @click.stop="manualAdd()"
            v-if="showheader"
            >手动添加</el-button
          >
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
          <el-popconfirm
            class="ele-action"
            title="确定要删除此威胁吗？"
            @confirm="remove(row)"
          >
            <el-link
              type="danger"
              slot="reference"
              :underline="false"
              icon="el-icon-delete"
              >删除
            </el-link>
          </el-popconfirm>
        </template>
      </ele-pro-table>
      <!--  -->
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="updateVisible(false)" :loading="loading"
        >保存
      </el-button>
    </div>
    <Threaten
      :visible.sync="twoshow"
      :params="params_id"
      :forecast="form.id"
      @saveTableData="saveTableData"
      :column="colnums_all"
    ></Threaten>
    <Manual :visible.sync="man"></Manual>
  </el-dialog>
</template>

<script>
import Threaten from "./threaten.vue";
import Manual from "./manuals.vue";
export default {
  name: "ForecastEdit",
  components: {
    Threaten,
    Manual,
  },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
  },
  data() {
    return {
      defaultColumns: [
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
          label: "标题",
          align: "center",
          minWidth: 200,
        },
        {
          prop: "scoreTitle",
          label: "频率",
          width: 300,
          align: "center",
        },
        {
          prop: "Score",
          label: "分值(V)",
          align: "center",
          minWidth: 120,
          slot: "score",
        },
        {
          prop: "yinhuan_ids",
          label: "引发隐患",
          align: "center",
          minWidth: 120,
            slot:"danger"
        },
        {
          prop: "ziyuan_ids",
          label: "威胁安全资源",
          align: "center",
          minWidth: 120,
            slot:"safe"
        },
        {
          prop: "riskdataTitle",
          label: "造成安全风险",
          align: "center",
          minWidth: 120,
        },
        {
          prop: "sort",
          label: "排序",
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
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        title: [
          {
            required: true,
            message: "请输入隐患因素",
            trigger: "blur",
          },
        ],

        forecastStime: [
          { required: true, message: "请输入任务开始时间", trigger: "blur" },
        ],

        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 分类数据
      where: {},
      twoshow: false,
      man: false,
      // 默认展开
      activeNames: [0],
      params_id: null,
      // 当前打开的项
      tableIndex: null,
      // 评分
      score: 0,
      // 完成 cols
      colnums_all: [],
      showheader:false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    },
    visible() {
    //   if (val) {
    //   } else {
    //   }
    },
  },
  methods: {
    reload() {
      let table = `table`;
      this.$refs[table].reload({ page: 1 });
    },
    addSafeStatus() {
      // 添加隐患因素
      let array = this.defaultColumns;

      this.colnums_all = array;
      this.twoshow = true;
      //   this.params_id = y;
    },
    manualAdd(x) {
      // 展开项 下表标
      this.tableIndex = x;

      this.man = true;
    },
    saveTableData() {
      // 添加时，选中的表格数据
      this.reload();
      this.twoshow = false;
    },

    async remove(row, index) {
      this.tableIndex = index;
      // 删除
      const res = await this.$http.delete("/risklibrary/delete/" + row.id);
      if (res.data.code == 0) {
        this.reload(index);
      }
    },
    // 编辑的数据
    async index() {},
    /* 保存编辑 */
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http[this.form.id ? "put" : "post"](
            this.isUpdate ? "/risklibrary/update" : "/risklibrary/add",
            this.form
          )
            .then((res) => {
              this.loading = false;
              if (res.data.code === 0) {
                this.$message.success(res.data.msg);
                if (!this.isUpdate) {
                  this.form = {};
                }
                this.updateVisible(false);
                this.$emit("done");
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((e) => {
              this.loading = false;
              this.$message.error(e.message);
            });
        } else {
          return false;
        }
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
    removeBatch() {},
  },
};
</script>

<style lang="scss" scoped>
#score {
  float: right;
}
.title {
  text-align: center;
  font-size: 20px;
  margin: 10px;
}
.ele-btn-icon {
  width: 80px;
  height: 40px;
}
.score {
  font-size: 20px;
}
.tit {
  font-size: 8px;
  position: relative;
  right: 5px;
}
.fen {
  font-size: 20px;
  font-style: italic;
}
.scor {
  font-size: 14px;
  position: relative;
  left: 3px;
}
</style>
