<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      :model="where"
      label-width="77px"
      class="dict-table"
      @keyup.enter.native="reload"
      @submit.native.prevent
    >
      <el-row :gutter="15">
        <el-col :lg="6" :md="12">
          <el-form-item label="栏目名称:">
            <el-input
              clearable
              v-model="where.name"
              placeholder="请输入栏目名称"
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
      row-key="id"
      :datasource="url"
      :columns="columns"
      default-expand-all
      :need-page="true"
      :parse-data="parseData"
      height="calc(100vh - 350px)"
    >
      <!-- 表头工具栏 -->
      <template slot="toolbar">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          class="ele-btn-icon"
          @click="openEdit(null)"
          v-if="permission.includes('sys:itemcate:add')"
          >添加
        </el-button>
        <el-button
          @click="expandAll"
          class="ele-btn-icon"
          size="small"
          v-if="permission.includes('sys:itemcate:expand')"
          >展开全部
        </el-button>
        <el-button
          @click="foldAll"
          class="ele-btn-icon"
          size="small"
          v-if="permission.includes('sys:itemcate:collapse')"
          >折叠全部
        </el-button>
      </template>
      <!-- 标题列 -->
      <template slot="name" slot-scope="{ row }">
        <i :class="row.icon"></i> {{ row.name }}
      </template>
      <!-- 类型列 -->
      <template slot="isCover" slot-scope="{ row }">
        <el-tag :type="['success', 'primary'][row.isCover - 1]" size="mini">
          {{ ["有评分", "无评分"][row.isCover - 1] }}
        </el-tag>
      </template>
      <!-- 封面 -->
      <template slot="cover" slot-scope="{ row }">
        <el-avatar shape="square" :size="25" :src="row.cover" />
      </template>
      <!-- 类别  -->
      <template slot="categray" slot-scope="{ row }">
        <div>
          {{ code(row.code) }}
        </div>
      </template>
      <!-- 操作列 -->
      <template slot="action" slot-scope="{ row }">
        <el-link
          type="primary"
          :underline="false"
          icon="el-icon-plus"
          @click="openEdit(null, row.id)"
          v-if="permission.includes('sys:itemcate:addz')"
          >添加
        </el-link>
        <el-link
          type="primary"
          :underline="false"
          icon="el-icon-edit"
          @click="openEdit(row)"
          v-if="permission.includes('sys:itemcate:update')"
          >修改
        </el-link>
        <el-popconfirm
          class="ele-action"
          title="确定要删除吗？"
          @confirm="remove(row)"
        >
          <el-link
            type="danger"
            slot="reference"
            :underline="false"
            icon="el-icon-delete"
            v-if="permission.includes('sys:itemcate:delete')"
            >删除
          </el-link>
        </el-popconfirm>
      </template>
    </ele-pro-table>
    <!-- 编辑弹窗 -->
    <dept-edit
      :data="current"
      :item-id="itemId"
      :cate-list="cateList"
      :visible.sync="showEdit"
      @done="reload"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import DeptEdit from "./itemcate-edit";

export default {
  name: "ItemCateEdit",
  components: { DeptEdit },
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    // 配置id
    itemId: Number,
  },
  data() {
    return {
      // 表格数据接口
      url: "/itemcate/list",
      // 表格列配置
      columns: [
        {
          columnKey: "index",
          type: "index",
          width: 45,
          align: "center",
          showOverflowTooltip: true,
          fixed: "left",
        },
        {
          prop: "name",
          label: "栏目名称",
          showOverflowTooltip: true,
          minWidth: 150,
          slot: "name",
        },
        // {
        //   prop: 'itemName',
        //   label: '所属数据库',
        //   showOverflowTooltip: true,
        //   align: 'center',
        //   minWidth: 200
        // },

        {
          prop: "code",
          label: "类别",
          showOverflowTooltip: true,
          align: "center",
          minWidth: 100,
          slot: "categray",
        },
        // {
        //   prop: "isCover",
        //   label: "是否有评分",
        //   align: "center",
        //   showOverflowTooltip: true,
        //   width: 100,
        //   slot: "isCover",
        // },
        // {
        //   prop: "cover",
        //   label: "分值",
        //   align: "center",
        //   showOverflowTooltip: true,
        //   minWidth: 100,
        // },

        // {
        //   prop: "note",
        //   label: "备注",
        //   align: "center",
        //   showOverflowTooltip: true,
        //   width: 200,
        // },
        {
          prop: "sort",
          label: "排序",
          align: "center",
          showOverflowTooltip: true,
          width: 60,
        },
        // {
        //   prop: "createTime",
        //   label: "创建时间",
        //   showOverflowTooltip: true,
        //   minWidth: 160,
        //   formatter: (row, column, cellValue) => {
        //     return this.$util.toDateString(cellValue);
        //   },
        // },
        {
          prop: "updateTime",
          label: "更新时间",
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          },
        },
        {
          columnKey: "action",
          label: "操作",
          width: 190,
          align: "center",
          resizable: false,
          slot: "action",
          fixed: "right",
        },
      ],
      // 表格搜索条件
      where: {
        itemId: this.itemId,
      },
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 全部栏目数据
      cateList: [],
      code1: [
        {
          cate: "一级分类",
          id: 1,
        },
        {
          cate: "二级分类",
          id: 2,
        },
      ],
    };
  },
  methods: {
    /* 解析接口返回数据 */
    parseData(res) {
      // console.log(res.data)
      res.data = this.$util.toTreeData(res.data, "id", "pid");
      this.cateList = res.data;
      return res;
    },

    code(row) {
      let type = null;
      this.code1.forEach((i) => {
        if (row == i.id) {
          type = i.cate;
          return;
        }
      });
      return type;
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({ where: this.where });
    },
    /* 显示编辑 */
    openEdit(row, parentId = null) {
      this.current = Object.assign(
        {
          type: 0,
          pid: parentId,
        },
        row
      );
      this.showEdit = true;
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 删除 */
    remove(row) {
      if (row.children && row.children.length > 0) {
        this.$message.error("请先删除子节点");
        return;
      }
      const loading = this.$loading({ lock: true });
      this.$http
        .delete("/itemcate/delete/" + row.id)
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
    /* 展开全部 */
    expandAll() {
      this.$refs.table.data.forEach((d) => {
        this.$refs.table.toggleRowExpansion(d, true);
      });
    },
    /* 折叠全部 */
    foldAll() {
      this.$refs.table.data.forEach((d) => {
        this.$refs.table.toggleRowExpansion(d, false);
      });
    },
  },
  watch: {
    // 监听配置id变化
    itemId() {
      this.where.itemId = this.itemId;
      this.reload();
    },
  },
};
</script>
<style scoped>
</style>