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
          <!-- 隐患行为 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="隐患行为:">
              <el-input
                clearable
                v-model="where.title"
                placeholder="请输入隐患行为"
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
            >修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此隐患行为库吗？"
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
    <!-- 编辑弹窗 -->
    <hiddendangeraction-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"
    />
  </div>
</template>

<script>
import HiddendangeractionEdit from "./hiddendangeraction-edit"

export default {
  name: "SystemHiddendangeraction",
  components: { HiddendangeractionEdit },
  data () {
    return {
      // 表格数据接口
      url: "/hiddendangeraction/list",
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
          prop: "ItemcateName",
          label: "类别",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center"
        },

        {
          prop: "ItemcatecName",
          label: "栏目",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center"
        },

        {
          prop: "title",
          label: "隐患行为",
          showOverflowTooltip: true,
          minWidth: 400,
          align: "center"
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
            return this.$util.toDateString(cellValue)
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
            return this.$util.toDateString(cellValue)
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
    }
  },
  methods: {
    /* 刷新表格 */
    reload () {
      this.$refs.table.reload({ page: 1, where: this.where })
    },
    /* 重置搜索 */
    reset () {
      this.where = {}
      this.reload()
    },
    /* 显示编辑 */
    openEdit (row) {
      this.current = row
      this.showEdit = true
    },
    /* 删除 */
    remove (row) {
      const loading = this.$loading({ lock: true })
      this.$http
        .delete("/hiddendangeraction/delete/" + row.id)
        .then(res => {
          loading.close()
          if (res.data.code === 0) {
            this.$message.success(res.data.msg)
            this.reload()
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(e => {
          loading.close()
          this.$message.error(e.message)
        })
    },
    /* 批量删除 */
    removeBatch () {
      if (!this.selection.length) {
        this.$message.error("请至少选择一条数据")
        return
      }
      this.$confirm("确定要删除选中的隐患行为库吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          const loading = this.$loading({ lock: true })
          this.$http
            .delete(
              "/hiddendangeraction/delete/" +
              this.selection.map(d => d.id).join(",")
            )
            .then(res => {
              loading.close()
              if (res.data.code === 0) {
                this.$message.success(res.data.msg)
                this.reload()
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(e => {
              loading.close()
              this.$message.error(e.message)
            })
        })
        .catch(() => { })
    }
  }
};
</script>

<style scoped></style>
