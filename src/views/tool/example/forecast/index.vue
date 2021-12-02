<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="77px"
        class="ele-form-search"
        @keyup.enter.native="reload"
        @submit.native.prevent
      >
        <el-row :gutter="15">
          <!-- 安全分析预测标题 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="预测标题:">
              <el-input
                clearable
                v-model="where.title"
                placeholder="请输入安全分析预测标题"
              />
            </el-form-item>
          </el-col>

          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                type="primary"
                icon="el-icon-search"
                class="ele-btn-icon"
                @click="reload"
                >查询
              </el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :where="where"
        :datasource="url"
        :columns="columns"
        :selection.sync="selection"
        height="calc(100vh - 315px)"
      >
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="openEdit(null)"
            >添加
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            class="ele-btn-icon"
            @click="removeBatch"
            >删除
          </el-button>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{ row }">
          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="openEdit(row)"
            >添加安全资源
          </el-link>

          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="danger(row)"
            >添加隐患因素
          </el-link>

          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="threaten(row)"
            >添加威胁因素
          </el-link>

          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="openEdit(row)"
            >修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此安全分析预测吗？"
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
    </el-card>
    <!-- 安全分析编辑弹窗 -->
    <forecast-edit
      class="forecast"
      :data="current"
      :visible.sync="showEdit"
      @done="reload"
    />
    <!-- 隐患编辑弹窗 -->
    <danger-edit
      class="danger"
      :data="current"
      :visible.sync="showDanger"
      @done="reload"
    />
  </div>
</template>

<script>
import ForecastEdit from "./forecast-edit";
import DangerEdit from "./danger-edit"

export default {
  name: "SystemForecast",
  components: { ForecastEdit,DangerEdit },
  data() {
    return {
      // 表格数据接口
      url: "/forecast/list",
      // 表格列配置
      columns: [
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
          showOverflowTooltip: true,
          fixed: "left",
        },

        {
          prop: "title",
          label: "安全分析预测标题",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center",
        },

        {
          prop: "forecast_stime",
          label: "任务开始时间",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center",
        },

        {
          prop: "sort",
          label: "排序",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center",
        },

        {
          prop: "createTime",
          label: "创建时间",
          sortable: "custom",
          showOverflowTooltip: true,
          minWidth: 160,
          align: "center",
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          },
        },

        {
          columnKey: "action",
          label: "操作",
          width: 400,
          align: "center",
          resizable: false,
          slot: "action",
          fixed: "right",
        },
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示安全编辑弹窗
      showEdit: false,
      // 是否显示隐患编辑弹窗
      showDanger:false,
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({ page: 1, where: this.where });
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 安全分析显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    // 添加隐患显示编辑
    danger(row) {
      this.current = row;
      this.showDanger = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      this.$http
        .delete("/forecast/delete/" + row.id)
        .then((res) => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e.message);
        });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      this.$confirm("确定要删除选中的安全分析预测吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          this.$http
            .delete(
              "/forecast/delete/" + this.selection.map((d) => d.id).join(",")
            )
            .then((res) => {
              loading.close();
              if (res.data.code === 0) {
                this.$message.success(res.data.msg);
                this.reload();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.forecast {
  width: 100%;
  height: 1000px;
  margin-top: none;
}
.danger {
  width: 100%;
  height: 1000px;
  margin-top: none;
}
</style>
