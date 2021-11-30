<template>
  <div class="ele-body">
    <el-card class="card" body-style="padding-bottom: 0;">
      <el-row :gutter="5">
        <!-- 所属数据库 -->
        <el-col :span="6" style="margin-bottom: 15px">
          <!-- 数据表格 -->
          <ele-pro-table
            ref="table"
            :datasource="url"
            :columns="columns"
            height="calc(100vh - 220px)"
            :need-page="false"
            :toolkit="[]"
            :current.sync="select_item"
            highlight-current-row
            class="dict-table"
            @done="done"
          >
          </ele-pro-table>
        </el-col>
        <!-- 栏目名称 -->
        <el-col :span="18" class="center" style="margin-bottom: 15px">
          <score-data v-if="select_item" :item-id="select_item.id"   />
        </el-col>
  
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ScoreData from "./score-data";

export default {
  name: "ContentItemCate",
  components: { ScoreData,  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 左侧数据接口
      url: "/item/list",
      // 表格列配置
      columns: [
        {
          prop: "name",
          label: "所属数据库",
          showOverflowTooltip: true,
        },
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 所属数据库
      select_item:null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 全部栏目数据
      cateList: [],
      
    };
  },
  methods: {
    /* 表格渲染完成回调 */
    done(res) {
      if (res.data.length > 0) {
        this.$refs.table.setCurrentRow(res.data[0]);
      }
    },
    /* 解析接口返回数据 */
    parseData(res) {
      res.data = this.$util.toTreeData(res.data, "id", "pid");
      this.cateList = res.data;
      return res;
    },
  },
};
</script>

<style scoped>
.dict-table {
  width: 70%;
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
.center {
  position: relative;
  right: 7%;
}
.right {
  position: relative;
  right: 16%;
}
.ele-toolbar-actions {
    margin-bottom: 0;
    padding: 0px 0px;
    box-sizing: border-box;
    background: #fff;
    border-top: none;
    border-left: none;
    border-right: none;
}
</style>
