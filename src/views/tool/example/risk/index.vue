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
          <!-- 标题 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="标题:">
              <el-input
                clearable
                v-model="where.title"
                placeholder="请输入标题"
              />
            </el-form-item>
          </el-col>

          <!-- 状态：1在用 2停用 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="状态:">
              <el-select
                clearable
                v-model="where.status"
                placeholder="请选择状态"
                class="ele-fluid"
              >
                <el-option label="在用" value="1" />

                <el-option label="停用" value="2" />
              </el-select>
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
            >修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此威胁库吗？"
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
        <!-- 状态列 -->
        <template slot="status" slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            @change="editStatus(row)"
            :active-value="1"
            :inactive-value="2"
          />
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
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <risk-edit :data="current" :visible.sync="showEdit" @done="reload" />
  </div>
</template>

<script>
import RiskEdit from "./risk-edit";

export default {
  name: "SystemRisk",
  components: { RiskEdit },
  data() {
    return {
      // 表格数据接口
      url: "/risk/list",
      // 表格列配置
      columns: [
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
          showOverflowTooltip: true,
          fixed: "left"
        },

        {
          prop: "title",
          label: "标题",
          showOverflowTooltip: true,
          minWidth: 300,
          align: "center"
        },

        {
          prop: "scoreTitle",
          label: "频率",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center"
        },
        {
          prop: "score",
          label: "分值(V)",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center"
        },

        {
          prop: "yinhuan_ids",
          label: "引发隐患",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center",
          slot: "danger"
        },

        {
          prop: "ziyuan_ids",
          label: "威胁安全资源",
          showOverflowTooltip: true,
          minWidth: 200,
          align: "center",
          slot: "safe"
        },

        {
          prop: "riskdataTitle",
          label: "造成安全风险",
          showOverflowTooltip: true,
          minWidth: 200,
          align: "center"
        },

        {
          prop: "status",
          label: "状态",
          sortable: "custom",
          align: "center",
          width: 100,
          resizable: false,
          slot: "status"
        },

        {
          prop: "sort",
          label: "排序",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center"
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
          }
        },
        {
          prop: "updateTime",
          label: "更新时间",
          sortable: "custom",
          showOverflowTooltip: true,
          minWidth: 160,
          align: "center",
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: "action",
          label: "操作",
          width: 150,
          align: "center",
          resizable: false,
          slot: "action",
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
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
    /* 显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      this.$http
        .delete("/risk/delete/" + row.id)
        .then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(e => {
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
      this.$confirm("确定要删除选中的威胁库吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          this.$http
            .delete("/risk/delete/" + this.selection.map(d => d.id).join(","))
            .then(res => {
              loading.close();
              if (res.data.code === 0) {
                this.$message.success(res.data.msg);
                this.reload();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(e => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },

    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({ lock: true });
      let params = new FormData();
      params.append("id", row.id);
      params.append("status", row.status);
      this.$http
        .put("/risk/status", params)
        .then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message({ type: "success", message: res.data.msg });
          } else {
            row.status = !row.status ? 1 : 2;
            this.$message.error(res.data.msg);
          }
        })
        .catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
    }
  }
};
</script>

<style scoped></style>
