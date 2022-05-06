<!-- 添加隐患因素编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '添加隐患因素' : '修改隐患因素'"
    :visible="visible"
    width="1900px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
    class="dialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <div class="title">{{ form.title }}</div>
      <!--  -->
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="(x, y) in typeData" :key="y" :name="y">
          <template slot="title">
            <div>
              <div class="score">
                A
                <span class="tit">{{ x.name }}</span>
                <span class="fen">{{ all_score(x.children_score) }}</span>
                <span class="scor">分</span>
              </div>
            </div>
          </template>
          <ul>
            <li v-for="(i, j) in x.children" :key="j" :name="j">
              <el-tag size="mini">{{ i.name }}</el-tag>
              <span>扣</span>
              <span class="child_score">{{
                com_score(x.children_score, i) * 100 + "%"
              }}</span>
              <el-link
                icon="el-icon-edit"
                class="ele-icons"
                style="padding: 2px 0; margin-left: 5px"
                type="primary"
                @click.stop="addPrim(i.pid, i.id)"
              >
                扣分
              </el-link>
            </li>
          </ul>
          <ele-pro-table
            v-if="x.show"
            :ref="'table' + y"
            :where="x.where"
            :columns="temp(x.temptlate)"
            :datasource="x.url"
            :toolbar="true"
            height="calc(100vh -800px)"
            :page-size="150"
            :parse-data="parseData_left"
          >
            <!-- 表头工具栏 -->
            <template slot="toolbar">
              <el-button
                icon="el-icon-plus"
                class="ele-btn-icon"
                style="float: right; padding: 3px 0; margin-left: 10px"
                type="primary"
                @click.stop="addSafeStatus(y, x.id)"
                >添加隐患</el-button
              >
              <el-button
                icon="el-icon-plus"
                class="ele-btn-icon"
                style="float: right; padding: 3px 0"
                type="primary"
                @click.stop="manualAdd()"
                v-if="showhead"
                >手动添加</el-button
              >
            </template>
            <template slot="scortNum" slot-scope="{ row }">
              <el-input-number
                size="mini"
                :min="0"
                v-model="row.sums"
                @change="add(row, y)"
              ></el-input-number>
            </template>
            <template slot="score" slot-scope="{ row }">
              {{ row.Score * 100 }}%
            </template>
            <!-- 操作列 -->
            <template slot="action" slot-scope="{ row }">
              <el-popconfirm
                class="ele-action"
                title="确定要删除此隐患吗？"
                @confirm="remove(row, y)"
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
        </el-collapse-item>
      </el-collapse>
      <!--  -->
    </el-form>
    <div slot="footer">
      <!-- <el-button @click="updateVisible(false)">取消</el-button> -->
      <el-button type="primary" @click="updateVisible(false)" :loading="loading"
        >保存
      </el-button>
    </div>
    <Danger
      :visible.sync="twoshow"
      :params="params_id"
      :forecast="form.id"
      @saveTableData="saveTableData"
      :column="colnums_all"
    ></Danger>
    <Prim
      :visible.sync="showPrim"
      :data="pData"
      :primI="primIndex"
      :primD="primID"
      @done="reload"
    ></Prim>
  </el-dialog>
</template>

<script>
import Danger from "./danger.vue"
import Prim from "./danger-prim.vue"
export default {
  name: "ForecastEdit",
  components: { Danger, Prim },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data () {
    return {
      defaultColumns: [
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
          label: "隐患行为",
          align: "center",
          minWidth: 150
        },
        {
          prop: "sums",
          label: "数量",
          width: 180,
          align: "center",
          slot: "scortNum"
        },
        {
          prop: "sort",
          label: "排序",
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
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        title: [
          {
            required: true,
            message: "请输入隐患因素",
            trigger: "blur"
          }
        ],

        forecastStime: [
          { required: true, message: "请输入任务开始时间", trigger: "blur" }
        ],

        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 分类数据
      typeData: [],
      twoshow: false,
      man: false,
      // 默认展开
      activeNames: [0],
      params_id: null,
      // 当前打开的项
      tableIndex: null,
      // 评分
      score: 0,
      // 完成 cols
      colnums_all: [],
      showhead: false,
      primData: [],
      showPrim: false,

      primIndex: null,
      primID: null,
      pData: {}
    }
  },
  mounted () { },
  watch: {
    data () {
      if (this.data) {
        this.form = Object.assign({}, this.data)
        this.isUpdate = true
      } else {
        this.form = {}
        this.isUpdate = false
      }
    },
    visible (val) {
      if (val) {
        this.index()
      } else {
        this.typeData = []
      }
    }
  },
  methods: {
    // 数量加减
    add (row, y) {
      this.$http
        .put("/hiddendangerlibrary/upsums", {
          id: row.id,
          sums: row.sums
        })
        .then(() => {
          this.reload(y)
        })
    },
    // 模板
    temp (arr) {
      let array = arr
      if (!arr) return {}
      const col = this.defaultColumns
      let col_arr = []
      for (let index = 0; index < col.length; index++) {
        const element = col[index]
        col_arr.push(element)
      }
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        element.prop = element.code
        element.label = element.title
        element.align = "center"
        element.width = 180
        col_arr.push(element)
      }
      return col_arr
    },
    parseData_left (res) {
      if (!res.data) {
        console.log()
        return { code: 0, data: [] }
      }
      let parse = res.data
      let num = 0
      for (let i = 0; i < parse.length; i++) {
        const element = parse[i]
        num += element.Scoresum * 1
      }
      let list_id = parse[0].itemcate_id
      for (let i = 0; i < this.typeData.length; i++) {
        const element = this.typeData[i]
        if (element.id == list_id) {
          let nums = Math.round(num * 100) / 100
          element.score = nums
        }
      }
      return {
        btype: 0,
        code: 0,
        count: 0,
        data: parse,
        msg: "操作成功"
      }
    },
    reload (i) {
      this.typeData = []
      this.index()
      let table = `table${i}`
      this.$refs[table][0].reload({ page: 1 })
    },
    addSafeStatus (x, y) {
      this.tableIndex = x
      // 添加隐患因素
      if (this.tableIndex !== null) {
        let arr = this.typeData[x].temptlate
        let array = this.defaultColumns
        // 深拷贝
        array = JSON.stringify(array)
        array = JSON.parse(array)
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i]
          array.push(element)
        }
        this.colnums_all = array
        this.twoshow = true
      }
      this.params_id = y
    },
    // 打开评分
    addPrim (i, j) {
      this.primIndex = i
      this.primID = j
      this.Portion()
    },
    Portion () {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
      //  改变data 要不多次点击可鞥不会改变
      this.pData = { isUpdate: false }
      this.$http
        .get("/hiddendangerscorelibrary/list", {
          params: {
            forecast_id: this.data.id, // 当前行id
            itemcate_id: this.primIndex, // 栏目id
            itemcate_cid: this.primID
          }
        })
        .then(res => {
          loading.close()
          let obj = this.form
          obj.tablerowid = this.data.id

          this.protion = res.data.data
          if (res.data.data) {
            obj.isUpdate = true
            obj.id = this.protion[0].id
          } else {
            obj.isUpdate = false
          }
          this.pData = obj
          console.log("--:", obj.isUpdate)
          this.showPrim = true
        })
    },
    manualAdd (x) {
      // 展开项 下表标
      this.tableIndex = x
      this.man = true
    },
    saveTableData (array) {
      console.log(array)
      // 添加时，选中的表格数据
      let i = this.tableIndex
      this.reload(i)
      this.twoshow = false
    },

    async remove (row, index) {
      this.tableIndex = index
      // 删除
      const res = await this.$http.delete(
        "/hiddendangerlibrary/delete/" + row.id
      )
      if (res.data.code == 0) {
        this.reload(index)
        const element = this.typeData[index]
        element.score = 0
      }
    },
    // 编辑的数据
    async index () {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
      const res = await this.$http.get("/itemcate/list", {
        params: {
          item_id: 2
        }
      })
      if (res.data.code == 0) {
        let table_item = res.data.data || []
        this.formate(table_item)
      }
      loading.close()
    },
    // 数据处理
    async formate (data) {
      let array = data
      // 生成手风琴 栏目项
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        // pid == 0 顶级节点
        if (element.pid == 0) {
          element.where = {
            forecast_id: this.form.id,
            itemcateid: element.id,
            itemcatecid: null
          }
          // 每个表格的 模板不一样
          const d = await this.$http.get("/configdata/list", {
            params: {
              configId: element.id,
              forecast_id: this.form.id
            }
          })
          let temp = d.data.data
          element.temptlate = temp || []
          // 表格 数据 接口
          element.url = "/hiddendangerlibrary/list"
          element.show = true
          // 总分
          element.score = 0
          element.children = []
          /*********/

          const children_score = await this.$http.get(
            "/hiddendangerscorelibrary/list",
            {
              params: {
                forecast_id: this.data.id, // 当前行id
                itemcate_id: element.id // 栏目id
              }
            }
          )
          let num = children_score.data.data || []
          element.children_score = num
          // 1.id == c.pid 当前节点的子节点
          for (let i = 0; i < array.length; i++) {
            const ele = array[i]
            if (element.id == ele.pid) {
              element.children.push(ele)
              this.primData.push(ele)
            }
          }
          /***********/
          this.typeData.push(element)
        }
      }
    },
    com_score (data, i) {
      // 计算当前项 分数;
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.itemcate_cid == i.id) {
          return element.Score
        }
      }
      return 0
    },
    all_score (array) {
      let num = 0
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        num += Number(element.Score)
      }
      let sum_math = 1 - Math.round(num * 100) / 100
      let r = 0
      if (sum_math >= 0.9) {
        r = 1
      }
      if (sum_math < 0.9 && sum_math >= 0.8) {
        r = 2
      }
      if (sum_math < 0.8 && sum_math >= 0.7) {
        r = 3
      }
      if (sum_math < 0.7 && sum_math >= 0.6) {
        r = 4
      }
      if (sum_math < 0.6 && sum_math >= 0.5) {
        r = 5
      }
      if (sum_math < 0.5) {
        r = 5
      }
      return r
    },
    /* 保存编辑 */
    save () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true
          this.$http[this.form.id ? "put" : "post"](
            this.isUpdate ? "/hiddendanger/update" : "/hiddendanger/add",
            this.form
          )
            .then(res => {
              this.loading = false
              if (res.data.code === 0) {
                this.$message.success(res.data.msg)
                if (!this.isUpdate) {
                  this.form = {}
                }
                this.updateVisible(false)
                this.$emit("done")
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(e => {
              this.loading = false
              this.$message.error(e.message)
            })
        } else {
          return false
        }
      })
    },
    /* 更新visible */
    updateVisible (value) {
      this.$emit("update:visible", value)
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  width: 98%;
  list-style: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  align-content: center;
  flex-wrap: wrap;
  li {
    text-align: center;
    line-height: 38px;
    white-space: nowrap;
    margin-right: 33px;
    .el-tag {
      margin: 0 5px;
    }
    span {
      vertical-align: middle;
    }
    button {
      vertical-align: middle;
    }
  }
}
.child_score {
  font-size: 18px;
  font-weight: 700;
  padding: 0 5px;
  color: #f00;
}
.score {
  min-width: 100px;
  white-space: nowrap;
}
#score {
  float: right;
}
.title {
  text-align: center;
  font-size: 20px;
  margin: 10px;
}
.ele-btn-icon {
  width: 80px;
  height: 40px;
}
.score {
  font-size: 20px;
}
.tit {
  font-size: 8px;
  position: relative;
  right: 5px;
}
.fen {
  font-size: 20px;
  font-style: italic;
}
.scor {
  font-size: 14px;
  position: relative;
  left: 3px;
}
</style>
