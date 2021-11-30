<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="where"
        label-width="77px"
        class="ele-form-search"
        @keyup.enter.native="reload"
        @submit.native.prevent>
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="用户账号:">
              <el-input
                clearable
                v-model="where.username"
                placeholder="请输入用户账号"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="操作模块:">
              <el-input
                clearable
                v-model="where.model"
                placeholder="请输入操作模块"/>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button
                type="primary"
                icon="el-icon-search"
                class="ele-btn-icon"
                @click="reload">查询
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
        height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            size="small"
            type="primary"
            class="ele-btn-icon"
            icon="el-icon-download"
            @click="exportData"
            v-if="permission.includes('sys:operlog:export')">导出
          </el-button>
        </template>
        <!-- 日志状态列 -->
        <template slot="status" slot-scope="{row}">
          <ele-dot :type="['success', 'warning'][row.status]" :ripple="row.status===0"
                   :text="['操作日志','错误日志'][row.status]"/>
        </template>
        <!-- 操作类型列 -->
        <template slot="operType" slot-scope="{row}">
          <el-tag v-if="row.operType === 0" type="warning" size="small">其他</el-tag>
          <el-tag v-if="row.operType === 1" type="success" size="small">新增</el-tag>
          <el-tag v-if="row.operType === 2" type="warning" size="small">修改</el-tag>
          <el-tag v-if="row.operType === 3" type="danger" size="small">删除</el-tag>
          <el-tag v-if="row.operType === 4" type="info" size="small">查询</el-tag>
          <el-tag v-if="row.operType === 5" type="success" size="small">设置状态</el-tag>
          <el-tag v-if="row.operType === 6" type="warning" size="small">导入</el-tag>
          <el-tag v-if="row.operType === 7" type="danger" size="small">导出</el-tag>
          <el-tag v-if="row.operType === 8" type="info" size="small">设置权限</el-tag>
          <el-tag v-if="row.operType === 9" type="success" size="small">设置密码</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-view"
            @click="openDetail(row)"
            v-if="permission.includes('sys:operlog:detail')">详情
          </el-link>
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 详情弹窗 -->
    <oper-log-detail :visible.sync="showInfo" :data="current||{}"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import XLSX from 'xlsx';
import OperLogDetail from './operlog-detail';

export default {
  name: 'SystemOperLog',
  components: {OperLogDetail},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/operlog/list',
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: "left"
        },
        {
          prop: 'id',
          label: 'ID',
          width: 60,
          align: 'center',
          showOverflowTooltip: true,
          fixed: "left"
        },
        {
          prop: 'model',
          label: '操作模块',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'operType',
          label: '操作类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'operType',
        },
        {
          prop: 'operMethod',
          label: '请求方法',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'operUrl',
          label: '请求地址',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'operIp',
          label: '请求IP',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'operLocation',
          label: 'IP所属地',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'operName',
          label: '操作用户',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'username',
          label: '操作账号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'status',
          label: '日志状态',
          align: 'center',
          showOverflowTooltip: true,
          slot: 'status',
          minWidth: 100
        },
        {
          prop: 'createTime',
          label: '操作时间',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 160,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 90,
          align: 'center',
          resizable: false,
          slot: 'action',
          fixed: "right"
        }
      ],
      // 表格搜索条件
      where: {},
      // 当前选中数据
      current: null,
      // 是否显示查看弹窗
      showInfo: false,
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({page: 1, where: this.where});
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.daterange = null;
      this.reload();
    },
    /* 日期选择改变回调 */
    onDateRangeChoose() {
      if (this.daterange && this.daterange.length === 2) {
        this.where.createTimeStart = this.daterange[0];
        this.where.createTimeEnd = this.daterange[1];
      } else {
        this.where.createTimeStart = null;
        this.where.createTimeEnd = null;
      }
    },
    /* 详情 */
    openDetail(row) {
      this.current = row;
      this.showInfo = true;
    },
    /* 导出数据 */
    exportData() {
      let array = [['ID编号', '操作模块', '操作类型', '请求方法', '请求地址', '请求IP', 'IP区域', '操作用户', '操作账号', '日志状态', '操作时间']];
      const loading = this.$loading({lock: true});
      this.$http.get('/operlog/list?page=1&limit=2000').then(res => {
        loading.close();
        if (res.data.code === 0) {
          res.data.data.forEach(d => {
            array.push([
              d.id,
              d.model,
              ['其它', '新增', '修改', '删除', '查询', '设置状态', '导入', '导出', '设置权限', '设置密码'][d.operType],
              d.operMethod,
              d.operUrl,
              d.operIp,
              d.operLocation,
              d.operName,
              d.username,
              ['操作日志', '错误日志'][d.status],
              this.$util.toDateString(d.createTime)
            ]);
          });
          this.$util.exportSheet(XLSX, array, '操作日志');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
