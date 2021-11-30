<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="6">
        <!-- 栏目名称 -->
        <ele-pro-table
          ref="table"
          :where="where"
          row-key="id"
          :datasource="url"
          :columns="columns"
          highlight-current-row
          :toolkit="[]"
          :current.sync="select_item"
          :need-page="false"
          class="dict-table"
          :parse-data="parseData"
          height="calc(100vh - 220px)"
          @done="done"
        >
          <!-- 标题列 -->
          <template slot="name" slot-scope="{ row }">
            <i :class="row.icon"></i> {{ row.name }}
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="18">
        <!-- 数据表格 -->
          <score-data-edit
            v-if="select_item"
            :item-id="itemId"
            :item-id1="itemId1"
            :item-id2="itemId2"
          />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ScoreDataEdit from "./score-data-edit";

export default {
  name: "ItemCateEdit",
  components:{ScoreDataEdit},
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
          prop: "name",
          label: "栏目名称",
          showOverflowTooltip: true,
          // align: 'center'
        },
      ],
      // 表格搜索条件
      where: {
        itemId: this.itemId,
      },
      // 表格选中数据
      selection: [],
      // 选中行
      select_item: null,

      // 是否显示编辑弹窗
      showEdit: false,
      // 全部栏目数据
      cateList: [],
    };
  },
  computed:{
    itemId1(){
      if(this.select_item.pid == 0){
         return this.select_item.id
      }else{
         return this.select_item.pid
      }
    },
    itemId2(){
      if(this.select_item.pid == 0){
        return null
      }else{
        return this.select_item.id
      }
    }
  },
  methods: {
    //   表格渲染完成回调
    done(res) {
      if (res.data.length > 0) {
        this.$refs.table.setCurrentRow(res.data[0]);
      }
    },
    // 刷新表格
    reload() {
      this.$refs.table.reload({ where: this.where });
    },
    /* 解析接口返回数据 */
    parseData(res) {
      //   console.log(res.data)
      res.data = this.$util.toTreeData(res.data, "id", "pid");
      this.cateList = res.data;
      return res;
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