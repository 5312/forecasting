<template>
  <div class="ele-body">
    <el-card class="card"  body-style="padding-bottom: 0;">
      <el-row :gutter="5">
        <el-col :span="6"  style="margin-bottom: 15px;">
          <!-- 数据表格 -->
          <ele-pro-table
            ref="table"
            :datasource="url1"
            :columns="columns1"
            height="calc(100vh - 261px)"
            :need-page="false"
            :toolkit="[]"
            :current.sync="current1"
            highlight-current-row
            class="dict-table"
            tool-class="ele-toolbar-actions"
            @done="done">
          </ele-pro-table>
        </el-col>
        <el-col :span="18" style="margin-bottom: 15px;">
          <!-- 数据字典项列表 -->
          <item-cate-data v-if="current1" :item-id="current1.id"/>
        </el-col>
      </el-row>
    </el-card>
   
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ItemCateData from './itemcate-data';

export default {
  name: 'ContentItemCate',
  components: {ItemCateData},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 左侧数据接口
      url1:'/item/list',
      // 表格列配置
      columns1: [
        {
          prop: 'name',
          label: '所属数据库',
          showOverflowTooltip: true,
          // align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      // current: null,
      current1: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 全部栏目数据
      cateList: []
    };
  },
  methods: {
    /* 表格渲染完成回调 */
    done(res) {
      // console.log(res.data)
      if (res.data.length > 0) {
        this.$refs.table.setCurrentRow(res.data[0]);
      }
    },
    /* 解析接口返回数据 */
    parseData(res) {
      res.data = this.$util.toTreeData(res.data, 'id', 'pid');
      this.cateList = res.data;
      return res;
    },
  }
}
</script>

<style scoped>
.dict-table {
  width: 97%;
  height: 100%;
}
.dict-table ::v-deep .el-table__row {
  cursor: pointer;
}

.dict-table ::v-deep .el-table__row > td:last-child:after {
  content: "\e6e0";
  font-family: element-icons !important;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1;
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -7px;
}

.dict-table ::v-deep .el-table__row > td:last-child .cell {
  padding-right: 20px;
}
</style>
