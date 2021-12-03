<template>
  <div class="ele-body">
    <el-row :gutter="5">
      <el-col :span="6">
        <!-- 数据字典项列表 -->
        <!-- 栏目名称 -->
        <ele-pro-table
          ref="table_left"
          :where="where_left"
          :row-key="getrowkeys"
          :datasource="url_left"
          :columns="columns_left"
          highlight-current-row
          :current.sync="current_left"
          :need-page="false"
          class="dict-table"
          :parse-data="parseData_left"
          height="calc(100vh -  133px)"
          @done="done_left"
          :toolbar="false"
          @row-click="rowclick"
          stripe
          :expand-row-keys="expand"
        >
          <!-- 标题列 -->
          <template slot="name" slot-scope="{ row }">
            <i :class="row.icon"></i> {{ row.name }}
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="18">
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
              <!-- 隐患标题 -->
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
            <el-row>
              <div class="margin-bottom">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item v-for="(x, y) in titlelist" :key="y">{{
                    x
                  }}</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
            </el-row>
          </el-form>
          <!-- 数据表格 -->
          <ele-pro-table
            v-if="current_left"
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
                :disabled="disabled"
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
            <!-- 扣分比例 -->
            <template slot="percentage" slot-scope="{ row }">
              {{ Number(row.Score) * 100 + "%" }}
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
                title="确定要删除此隐患调查吗？"
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
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <hiddendanger-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"
    />
  </div>
</template>

<script>
import HiddendangerEdit from "./hiddendanger-edit";

export default {
  name: "SystemHiddendanger",
  components: { HiddendangerEdit },
  data() {
    return {
      getrowkeys(row) {
        return row.id;
      },
      // 面包屑
      titlelist: [],
      // 表格数据接口
      url: "/hiddendanger/list",
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

        // {
        //   prop: "dept_id",
        //   label: "单位ID",
        //   showOverflowTooltip: true,
        //   minWidth: 100,
        //   align: "center"
        // },

        // {
        //   prop: "itemcate_id",
        //   label: "类别",
        //   showOverflowTooltip: true,
        //   minWidth: 100,
        //   align: "center"
        // },

        // {
        //   prop: "itemcate_cid",
        //   label: "栏目",
        //   showOverflowTooltip: true,
        //   minWidth: 100,
        //   align: "center"
        // },

        {
          prop: "title",
          label: "隐患行为",
          showOverflowTooltip: true,
          minWidth: 200,
          align: "center"
        },

        {
          prop: "scoreTitle",
          label: "评价标准",
          showOverflowTooltip: true,
          minWidth: 200,
          align: "center"
        },
        {
          prop: "Score",
          label: "扣分比例(%)",
          showOverflowTooltip: true,
          minWidth: 100,
          align: "center",
          slot: "percentage"
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

      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 左侧
      where_left: {
        itemId: 2
      },
      url_left: "/itemcate/list",
      columns_left: [
        {
          prop: "name",
          label: "栏目名称",
          showOverflowTooltip: true,
          className: "cur"
        }
      ],
      current_left: null,
      disabled: true,
      expand: [] //展开
    };
  },
  watch: {
    current_left(obj) {
      if (obj.pid == 0) {
        this.disabled = true;

        // 面包屑
        const array = this.left_data;
        this.titlelist = [];
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element.id == this.where.itemcate_id) {
            this.titlelist.push(element.name);
          }
        }
      } else {
        this.disabled = false;

        // 面包屑
        const array = this.left_data;
        this.titlelist = [obj.name];
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element.id == obj.pid) {
            this.titlelist.unshift(element.name);
          }
        }
      }
      this.reload();
    }
  },
  computed: {
    where() {
      let where = {
        itemcate_id: ""
      };
      if (this.current_left) {
        if (this.current_left.pid == 0) {
          where.itemcate_id = this.current_left.id;
        } else {
          where.itemcate_id = this.current_left.pid;
          where.itemcate_cid = this.current_left.id;
        }
      }
      return where;
    }
  },
  methods: {
    rowclick(row) {
      if (this.expand.includes(row.id)) {
        this.expand = this.expand.filter(val => val !== row.id);
      } else {
        this.expand.push(row.id);
      }
    },
    parseData_left(res) {
      this.left_data = res.data;
      res.data = this.$util.toTreeData(res.data, "id", "pid");
      this.cateList = res.data;
      return res;
    },
    done_left(res) {
      if (res.data.length > 0) {
        this.$refs.table_left.setCurrentRow(res.data[0]);
      }
    },
    /* 刷新表格 */
    reload() {
      if (this.$refs.table) {
        this.$refs.table.reload({ page: 1, where: this.where });
      }
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 显示编辑 */
    openEdit(row) {
      let obj = Object.assign({}, row);

      if (!row) {
        // 新建
        obj.isUpdate = false;
        if (this.current_left) {
          obj.itemcate_id = this.current_left.pid;

          obj.itemcate_cid = this.current_left.id;
        }
      } else {
        obj.isUpdate = true;
      }
      this.current = obj;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      this.$http
        .delete("/hiddendanger/delete/" + row.id)
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
      this.$confirm("确定要删除选中的隐患调查吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          this.$http
            .delete(
              "/hiddendanger/delete/" + this.selection.map(d => d.id).join(",")
            )
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
    }
  }
};
</script>

<style scoped>
.dict-table ::v-deep .el-table__row {
  cursor: pointer;
}
.margin-bottom {
  margin-bottom: 10px;
}
</style>
