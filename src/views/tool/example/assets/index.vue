<template>
  <div class="ele-body">
    <el-card shadow="never">
      <el-row :gutter="5">
        <el-col :span="6">
          <!-- 数据字典项列表 -->
          <!-- 栏目名称 -->
          <ele-pro-table
            ref="table_left"
            :where="where_left"
            row-key="id"
            :datasource="url_left"
            :columns="columns_left"
            highlight-current-row
            :current.sync="current_left"
            :need-page="false"
            class="dict-table"
            :parse-data="parseData_left"
            height="calc(100vh -  292px)"
            @done="done_left"
            :toolbar="false"
          >
            <!-- 标题列 -->
            <template slot="name" slot-scope="{ row }">
              <i :class="row.icon"></i> {{ row.name }}
            </template>
          </ele-pro-table>
        </el-col>
        <el-col :span="18">
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
              <!--        <el-col :lg="6" :md="12">
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
              </el-col> -->

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
          <!-- :datasource="url" -->
          <ele-pro-table
            v-loading="load"
            v-if="columns.length > 0"
            ref="table"
            :where="where"
            :columns="columns"
            :datasource="data"
            :selection.sync="selection"
            height="calc(100vh - 420px)"
          >
            <!-- 表头工具栏 -->
            <template slot="toolbar">
              <el-button
                size="small"
                type="primary"
                icon="el-icon-plus"
                class="ele-btn-icon"
                :disabled="disabled"
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
                title="确定要删除此安全资源吗？"
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

            <template slot="text" slot-scope="{ row, column }">
              <div>{{ row[column.property] }}</div>
            </template>
            <template slot="number" slot-scope="{ row, column }">
              <div>{{ row[column.property] }}</div>
            </template>
            <template slot="select" slot-scope="{ row, column }">
              <el-select v-model="row[column.property]" placeholder="请选择">
                <el-option
                  v-for="item in row[column.property].split(',')"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
            <!--  -->
            <template slot="radio" slot-scope="{ row, column }">
              <el-radio-group
                v-if="row[column.property]"
                v-model="row[column.property]"
              >
                <el-radio
                  v-for="item in row[column.property].split(',')"
                  :key="item"
                  :label="item"
                  >{{ item }}</el-radio
                >
              </el-radio-group>
            </template>
            <!--  -->
            <template slot="checkbox" slot-scope="{ row, column }">
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="item in row[column.property].split(',')"
                  :key="item"
                  :label="item"
                ></el-checkbox>
              </el-checkbox-group>
            </template>
            <!--  -->
            <template slot="datetime" slot-scope="{ row, column }">
              <el-date-picker
                v-model="row[column.property]"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </template>
            <template slot="textarea" slot-scope="{ row, column }">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="row[column.property]"
              >
              </el-input>
            </template>
            <!--  -->
          </ele-pro-table>
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑弹窗 -->
    <assets-edit
      :data="current"
      :keyData="keyData"
      :visible.sync="showEdit"
      @done="reload"
    />
  </div>
</template>

<script>
import AssetsEdit from "./assets-edit"

export default {
  name: "SystemAssets",
  components: { AssetsEdit },
  data () {
    return {
      disabled: true,
      // 表格数据接口
      url_left: "/itemcate/list",
      // 表格列配置
      columns_left: [
        {
          prop: "name",
          label: "栏目名称",
          showOverflowTooltip: true,
          className: "cur"
        }
      ],
      // 表格搜索条件
      where_left: {
        item_id: 1
      },
      // 表格选中数据
      selection_left: [],
      current_left: null,
      // 表格数据接口
      // 表格列配置
      colDefault: [
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
          fixed: "left"
        },
        {
          prop: "title",
          label: "名称",
          align: "center",
          minWidth: 200
        },
        {
          prop: "sums",
          label: "数量",
          width: 60,
          align: "center"
        },
        {
          prop: "scoreTitle",
          label: "评价标准",
          width: 300,
          align: "center"
        },
        {
          prop: "Score",
          label: "资源赋值(R)",
          align: "center",
          minWidth: 120
        },
        {
          prop: "Scoresum",
          label: "总赋值",
          align: "center"
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
      columns: [],
      // 表格搜索条件
      where: {
        itemcate_id: null,
        itemcate_cid: null
      },
      // 面包屑
      titlelist: [],
      // 栏目名称数据
      left_data: [],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      result: [],
      templateList: [],
      load: false,
      keyData: {}
    }
  },
  watch: {
    current_left (obj) {
      if (obj.pid == 0) {
        this.where.itemcate_id = obj.id
        this.where.itemcate_cid = ""
        this.disabled = true
        // 面包屑
        const array = this.left_data
        this.titlelist = []
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          if (element.id == this.where.itemcate_id) {
            this.titlelist.push(element.name)
          }
        }
        //
      } else {
        this.where.itemcate_id = obj.pid

        this.where.itemcate_cid = obj.id
        this.disabled = false
        // 面包屑
        const array = this.left_data
        this.titlelist = [obj.name]
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          if (element.id == obj.pid) {
            this.titlelist.unshift(element.name)
          }
        }
        //
      }

      this.reload()
    }
  },
  mounted () {
    this.index()
  },
  computed: {
    data () {
      let array = this.result
      let endArray = []
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        let item_id = element.item_id
        let itemcate_cid = element.itemcate_cid
        let itemcate_id = element.itemcate_id
        // 公共 值
        let id = element.id
        let templateData = element.assets_json
        let title = element.title
        let scoreTitle = element.scoreTitle
        let scoresum = element.scoresum
        let sums = element.sums
        let score_id = element.score_id
        let sort = element.sort
        let Score = element.Score
        let Scoresum = element.Scoresum
        let create_time = element.create_time
        let update_time = element.update_time
        //
        let jsonData = JSON.parse(templateData)
        let listData = jsonData.data
        if (listData) {
          let columns = {}
          listData.forEach(obj => {
            Object.assign(columns, obj, {
              id,
              title,
              scoreTitle,
              scoresum,
              sums,
              score_id,
              sort,
              Score,
              Scoresum,
              create_time,
              update_time,
              item_id,
              itemcate_cid,
              itemcate_id
            })
          })
          endArray.push(columns)
        }
      }

      return endArray
    }
  },
  methods: {
    /* 初始化数据 */
    index () {
      this.load = true
      this.$http
        .get("/assets/list", {
          params: this.where
        })
        .then(res => {
          let result = res.data.data
          if (result) {
            this.load = false
            // 重要
            this.templateList = JSON.stringify(result[0])

            let columns = result[0].templateList
            this.templateFunc(columns)
            this.result = result
          } else {
            // 无数据时
            this.result = []
            this.tempAjax()
          }
        })
    },
    async tempAjax () {
      const res = await this.$http.get("/configdata/list", {
        params: {
          configId: this.where.itemcate_id
        }
      })
      this.load = false
      // 重要 新建时，添加公共值
      this.templateList = JSON.stringify({
        templateList: res.data.data,
        itemcate_id: this.where.itemcate_id,
        itemcate_cid: this.where.itemcate_cid,
        item_id: 1,
        score_id: null
      })
      let col = JSON.stringify(res.data.data)
      this.templateFunc(JSON.parse(col))
    },
    templateFunc (arr) {
      this.columns = [...this.colDefault]
      let columns = arr
      if (columns && columns.length > 0) {
        for (let index = 0; index < columns.length; index++) {
          const element = columns[index]
          let obj = {
            prop: element.code,
            label: element.title,
            type: element.type,
            showOverflowTooltip: true
          }
          Object.assign(element, obj)
        }
        columns.unshift(...this.columns)
        columns.push(
          {
            prop: "update_time",
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
            prop: "create_time",
            label: "创建时间",
            sortable: "custom",
            showOverflowTooltip: true,
            minWidth: 160,
            align: "center",
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(cellValue)
            }
          }
        )
        this.columns = [...columns]
      }
    },
    /* 刷新表格 */
    reload () {
      this.columns = []
      this.index()
    },
    /* 重置搜索 */
    reset () {
      this.where = {}
      this.reload()
    },
    /* 显示编辑 */
    openEdit (row) {
      if (row == null) {
        const form = JSON.parse(this.templateList)
        form.id = ""
        form.title = ""
        form.score_id = ""
        form.sums = ""

        this.current = form
        this.showEdit = true
      } else {
        const rowData = JSON.stringify(row)
        const form = JSON.parse(this.templateList)

        Object.assign(form, row)
        form.id = JSON.parse(rowData).id
        delete rowData.id
        this.keyData = JSON.parse(rowData)
        this.current = form

        this.showEdit = true
      }
    },
    objKeyFor (form, tem, isUpload = false) {
      let object = tem
      let arr = []
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const element = object[key]
          let arrIndexObj = {}
          if (isUpload) {
            arrIndexObj[key] = element
          }
          arr.push(arrIndexObj)
        }
      }
      let json = JSON.stringify({ data: arr })

      // 参数
      delete form.assets_json

      let obj = {
        assets_json: json
      }
      let params = Object.assign(obj, form)
      return params
    },
    /* 删除 */
    remove (row) {
      const loading = this.$loading({ lock: true })
      this.$http
        .delete("/assets/delete/" + row.id)
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
      this.$confirm("确定要删除选中的安全资源吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          const loading = this.$loading({ lock: true })
          this.$http
            .delete("/assets/delete/" + this.selection.map(d => d.id).join(","))
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
    },

    /* 更改状态 */
    editStatus (row) {
      const loading = this.$loading({ lock: true })
      let params = new FormData()
      params.append("id", row.id)
      params.append("status", row.status)
      this.$http
        .put("/assets/status", params)
        .then(res => {
          loading.close()
          if (res.data.code === 0) {
            this.$message({ type: "success", message: res.data.msg })
          } else {
            row.status = !row.status ? 1 : 2
            this.$message.error(res.data.msg)
          }
        })
        .catch(e => {
          loading.close()
          this.$message.error(e.message)
        })
    },
    /* 解析接口返回数据 */
    parseData_left (res) {
      this.left_data = res.data
      res.data = this.$util.toTreeData(res.data, "id", "pid")
      this.cateList = res.data
      return res
    },
    // 表格渲染完成回调
    done_left (res) {
      if (res.data.length > 0) {
        this.$refs.table_left.setCurrentRow(res.data[0])
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dict-table ::v-deep .el-table__row {
  cursor: pointer;
}
.margin-bottom {
  margin-bottom: 10px;
}
</style>
