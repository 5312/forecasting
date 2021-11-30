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


          <!-- 测试名称 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="测试名称:">
              <el-input
                clearable
                v-model="where.name"
                placeholder="请输入测试名称"/>
            </el-form-item>
          </el-col>


          <!-- 状态：1正常 2停用 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="状态:">
              <el-select
                clearable
                v-model="where.status"
                placeholder="请选择状态"
                class="ele-fluid">

                <el-option label="正常" value="1"/>

                <el-option label="停用" value="2"/>

              </el-select>
            </el-form-item>
          </el-col>


          <!-- 类型：1京东 2淘宝 3拼多多 4唯品会 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="类型:">
              <el-select
                clearable
                v-model="where.type"
                placeholder="请选择类型"
                class="ele-fluid">

                <el-option label="京东" value="1"/>

                <el-option label="淘宝" value="2"/>

                <el-option label="拼多多" value="3"/>

                <el-option label="唯品会" value="4"/>

              </el-select>
            </el-form-item>
          </el-col>


          <!-- 是否VIP：1是 2否 -->
          <el-col :lg="6" :md="12">
            <el-form-item label="是否VIP:">
              <el-select
                clearable
                v-model="where.is_vip"
                placeholder="请选择是否VIP"
                class="ele-fluid">

                <el-option label="是" value="1"/>

                <el-option label="否" value="2"/>

              </el-select>
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
        :selection.sync="selection"
        height="calc(100vh - 315px)">
        <!-- 表头工具栏 -->
        <template slot="toolbar">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            class="ele-btn-icon"
            @click="openEdit(null)">添加
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="el-icon-delete"
            class="ele-btn-icon"
            @click="removeBatch">删除
          </el-button>
        </template>
        <!-- 操作列 -->
        <template slot="action" slot-scope="{row}">
          <el-link
            type="primary"
            :underline="false"
            icon="el-icon-edit"
            @click="openEdit(row)">修改
          </el-link>
          <el-popconfirm
            class="ele-action"
            title="确定要删除此演示一吗？"
            @confirm="remove(row)">
            <el-link
              type="danger"
              slot="reference"
              :underline="false"
              icon="el-icon-delete">删除
            </el-link>
          </el-popconfirm>
        </template>


        <!-- 头像列 -->
        <template slot="avatar" slot-scope="{row}">
          <el-avatar shape="square" :size="25" :src="row.avatar"/>
        </template>


        <!-- 状态列 -->
        <template slot="status" slot-scope="{row}">
          <el-switch
            v-model="row.status"
            @change="editStatus(row)"
            :active-value="1"
            :inactive-value="2"/>
        </template>


        <!-- 类型列 -->
        <template slot="type" slot-scope="{row}">

          <el-tag v-if="row.type === 1" type="success" size="small">京东</el-tag>

          <el-tag v-if="row.type === 2" type="warning" size="small">淘宝</el-tag>

          <el-tag v-if="row.type === 3" type="danger" size="small">拼多多</el-tag>

          <el-tag v-if="row.type === 4" type="info" size="small">唯品会</el-tag>

        </template>


        <!-- 是否VIP列 -->
        <template slot="isVip" slot-scope="{row}">
          <el-switch
            v-model="row.isVip"
            @change="editIsVip(row)"
            :active-value="1"
            :inactive-value="2"/>
        </template>


      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <example-edit
      :data="current"
      :visible.sync="showEdit"
      @done="reload"/>
  </div>
</template>

<script>
import ExampleEdit from './example-edit';

export default {
  name: 'SystemExample',
  components: {ExampleEdit},
  data() {
    return {
      // 表格数据接口
      url: '/example/list',
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
          prop: 'name',
          label: '测试名称',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },


        {
          columnKey: 'avatar',
          label: '头像',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100,
          slot: 'avatar'
        },


        {
          prop: 'content',
          label: '内容',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },


        {
          prop: 'status',
          label: '状态',
          sortable: 'custom',
          align: 'center',
          width: 100,
          resizable: false,
          slot: 'status',
        },


        {
          prop: 'type',
          label: '类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          slot: 'type',
        },


        {
          prop: 'isVip',
          label: '是否VIP',
          sortable: 'custom',
          align: 'center',
          width: 100,
          resizable: false,
          slot: 'isVip',
        },


        {
          prop: 'sort',
          label: '排序号',
          showOverflowTooltip: true,
          minWidth: 100,
          align: 'center',
        },


        {
          prop: 'createTime',
          label: '创建时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 160,
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 150,
          align: 'center',
          resizable: false,
          slot: 'action',
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
      showEdit: false,
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
      this.reload();
    },
    /* 显示编辑 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({lock: true});
      this.$http.delete('/example/delete/' + row.id).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm('确定要删除选中的演示一吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({lock: true});
        this.$http.delete('/example/delete/' + this.selection.map(d => d.id).join(",")).then(res => {
          loading.close();
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            this.reload();
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          loading.close();
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },


    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({lock: true});
      let params = Object.assign({
        "id": row.id,
        "status": row.status
      })
      this.$http.put('/example/status', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
        } else {
          row.status = !row.status ? 1 : 2;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },


    /* 更改是否VIP */
    editIsVip(row) {
      const loading = this.$loading({lock: true});
      let params = new FormData();
      params.append("id", row.id);
      params.append('is_vip', row.isVip);
      this.$http.put('/example/isVip', params).then(res => {
        loading.close();
        if (res.data.code === 0) {
          this.$message({type: 'success', message: res.data.msg});
        } else {
          row.isVip = !row.isVip ? 1 : 2;
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        loading.close();
        this.$message.error(e.message);
      });
    },


  }
}
</script>

<style scoped>
</style>
