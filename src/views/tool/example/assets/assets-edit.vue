<!-- 安全资源编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '修改安全资源' : '添加安全资源'"
    :visible="visible"
    width="800px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="数量:" prop="sums">
        <el-input v-model="form.sums" placeholder="请输入数量" clearable />
      </el-form-item>

      <el-form-item label="评价标准:" prop="score_id">
        <el-popover
          placement="bottom"
          width="600"
          trigger="click"
          v-model="show"
        >
          <ele-pro-table
            v-if="visible"
            ref="table"
            highlight-current-row
            :current.sync="current"
            :datasource="url"
            :columns="columns"
            :where="where"
            height="350px"
            @done="done"
            :toolbar="false"
          >
            <template slot="toolbar"></template>
          </ele-pro-table>
          <el-input
            v-loading="popover"
            slot="reference"
            readonly=""
            v-model="setId"
            placeholder="请选择评价标准"
            clearable
          />
        </el-popover>
      </el-form-item>
      <!--  -->
      <el-form-item
        v-for="(x, y) in form.templateList"
        :key="y"
        :label="x.title + ':'"
        :prop="x.assets_json"
      >
        <!-- {{ templates }} -->
        <Formtype
          v-if="visible"
          v-model="templates[x.code]"
          :data="x.type"
          :opts="x.options"
        >
        </Formtype>
      </el-form-item>
      <!-- <el-form-item label="状态:" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">在用</el-radio>
          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item label="排序:" prop="sort">
        <el-input v-model="form.sort" placeholder="请输入排序" clearable />
      </el-form-item>
      <template slot="number" slot-scope="{}">
        <el-input-number
          :min="0"
          placeholder="请输入资源数据库"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </template>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="save" :loading="loading"
        >保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Formtype from "./Formtype/index"
export default {
  name: "AssetsEdit",
  components: {
    Formtype
  },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    keyData: Object
  },
  data () {
    return {
      // 下拉表 加载
      popover: false,
      // 表单数据
      form: Object.assign({}, this.data),
      gridData: [],
      url: "/score/list",
      where: {
        itemcate_id: "",
        itemcate_cid: ""
      },
      columns: [
        {
          prop: "title",
          label: "评价标准"
        },
        {
          prop: "score",
          label: "资源赋值(R)",
          width: 100
        }
      ],
      // 表单验证规则
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],

        itemId: [
          { required: true, message: "请输入资源数据库", trigger: "blur" }
        ],

        itemcateId: [
          { required: true, message: "请输入调查栏目", trigger: "blur" }
        ],

        itemcateCid: [
          { required: true, message: "请输入调查类别", trigger: "blur" }
        ],

        deptId: [{ required: true, message: "请输入单位ID", trigger: "blur" }],

        assetsJson: [
          { required: true, message: "请输入资源数据集", trigger: "blur" }
        ],

        // status: [{ required: true, message: "请选择状态", trigger: "blur" }],

        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      //  下拉表格数据
      table_data: [],
      // 单选
      current: null,
      show: false
    }
  },
  watch: {
    current (n) {
      this.form.score_id = n.id
    },
    data () {
      this.popover = true
      this.form = Object.assign(
        {
          sort: 0
        },
        this.data
      )

      if (this.data.id != "") {
        // 修改
        this.isUpdate = true
      } else {
        // 新建
        this.isUpdate = false
      }
      this.where.itemcate_id = this.form.itemcate_id
      this.where.itemcate_cid = this.form.itemcate_cid
    }
  },
  computed: {
    // 赋值ID显示
    setId () {
      let val = this.form.score_id
      console.log(val)
      let title = ""
      if (typeof this.form.score_id == "number") {
        this.table_data.forEach(obj => {
          if (Number(obj.id) == val) {
            title = obj.title
          }
        })
      }
      return title
    },
    // 字段
    templates () {
      let obj = {}
      if (this.form.templateList) {
        let array = this.form.templateList
        for (let index = 0; index < array.length; index++) {
          const element = array[index]
          // 数据字段 类型 判断
          let a = this.keyData[element.code]
          switch (element.type) {
            case "checkbox":
              if (typeof a == "string") {
                a = a.split(",")
              }
              Object.assign(obj, {
                [element.code]: a ? a : []
              })
              break
            default:
              Object.assign(obj, {
                [element.code]: a ? a : ""
              })
              break
          }
        }
      }
      return obj
    },
    // 初始化富文本
    initEditor () {
      return {
        height: 300,
        branding: false,
        skin_url: "/tinymce/skins/ui/oxide",
        content_css: "/tinymce/skins/content/default/content.css",
        language_url: "/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        plugins:
          "code print preview fullscreen paste searchreplace save autosave link autolink image imagetools media table codesample lists advlist hr charmap emoticons anchor directionality pagebreak quickbars nonbreaking visualblocks visualchars wordcount",
        toolbar:
          "fullscreen preview code | undo redo | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | formatselect fontselect fontsizeselect | link image media emoticons charmap anchor pagebreak codesample | ltr rtl",
        toolbar_drawer: "sliding",
        images_upload_handler: (blobInfo, success, error) => {
          let file = blobInfo.blob()
          // 使用axios上传
          const formData = new FormData()
          formData.append("file", file, file.name)
          this.$http
            .post("/upload/uploadImage", formData)
            .then(res => {
              if (res.data.code == 0) {
                success(res.data.data.fileUrl)
              } else {
                error(res.data.msg)
              }
            })
            .catch(e => {
              console.error(e)
              error(e.message)
            })
        },
        file_picker_types: "media",
        file_picker_callback: () => { }
      }
    }
  },
  methods: {
    done (res) {
      this.table_data = res.data
      this.popover = false
    },
    objKeyFor () {
      let object = this.templates
      let arr = []
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const element = object[key]
          let arrIndexObj = {}
          arrIndexObj[key] = element

          arr.push(arrIndexObj)
        }
      }
      let json = JSON.stringify({ data: arr })
      // 参数
      delete this.form.assets_json

      let obj = {
        assets_json: json
      }
      let params = Object.assign(obj, this.form)
      return params
    },
    /* 保存编辑 */
    save () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = this.objKeyFor()
          this.loading = true
          this.$http[params.id ? "put" : "post"](
            this.isUpdate ? "/assets/update" : "/assets/add",
            params
          )
            .then(res => {
              this.loading = false
              if (res.data.code === 0) {
                this.$message.success(res.data.msg)
                if (!this.isUpdate) {
                  this.form = {
                    sort: 0
                  }
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

<style scoped></style>
