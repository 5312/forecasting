<!-- 隐患行为库编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '修改隐患行为库' : '添加隐患行为库'"
    :visible="visible"
    width="460px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-form-item label="类别:" prop="itemcate_id">
        <el-select v-model="form.itemcate_id" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <!-- <el-input-number
          :min="0"
          v-model="form.itemcate_id"
          placeholder="请输入类别"
          controls-position="right"
          class="ele-fluid ele-text-left"
        /> -->
      </el-form-item>

      <el-form-item label="栏目:" prop="itemcate_cid">
        <el-select
          v-model="form.itemcate_cid"
          no-data-text="请选择类别"
          placeholder="请选择"
        >
          <el-option
            v-for="item in lanmu"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <!-- <el-input-number
          :min="0"
          v-model="form.itemcate_cid"
          placeholder="请输入栏目"
          controls-position="right"
          class="ele-fluid ele-text-left"
        /> -->
      </el-form-item>

      <el-form-item label="隐患行为:" prop="title">
        <el-input v-model="form.title" placeholder="请输入隐患行为" clearable />
      </el-form-item>

      <el-form-item label="排序:" prop="sort">
        <el-input v-model="form.sort" placeholder="请输入排序" clearable />
      </el-form-item>
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
export default {
  name: "HiddendangeractionEdit",
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data () {
    return {
      // 表单数据
      form: Object.assign(
        {
          sort: 0
        },
        this.data
      ),
      // 表单验证规则
      rules: {
        itemcateId: [
          { required: true, message: "请输入类别", trigger: "blur" }
        ],

        itemcateCid: [
          { required: true, message: "请输入栏目", trigger: "blur" }
        ],

        title: [{ required: true, message: "请输入隐患行为", trigger: "blur" }],

        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      options: [],
      lanmu: [],
      tow_row_arr: []
    }
  },
  watch: {
    "form.itemcate_id": {
      handler (e) {
        this.lanmufunc(e)
      }
    },
    data () {
      if (this.data) {
        let sort = this.data.sort ? this.data.sort : 0
        this.form = Object.assign({ sort: sort }, this.data)
        this.isUpdate = true
      } else {
        this.form = { sort: 0 }
        this.isUpdate = false
      }
    }
  },
  mounted () {
    this.leibie()
  },
  computed: {},
  methods: {
    async lanmufunc (index) {
      let array = this.tow_row_arr
      let arr = []
      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        if (element.pid == index) {
          arr.push(element)
        }
      }
      this.lanmu = arr
    },
    async leibie () {
      const res = await this.$http.get("/itemcate/list", {
        params: {
          itemId: 2
        }
      })
      if (res.data.code == 0) {
        let piddata = res.data.data
        let data = piddata ? piddata : []
        this.options = this.getRootPid(data)
        this.tow_row_arr = data
      }
    },
    /* 通用方法 pid = 0  */
    getRootPid (list) {
      if (!list) return
      let array = []
      for (let i = 0; i < list.length; i++) {
        const element = list[i]
        if (element.pid == 0) {
          array.push(element)
        }
      }
      return array
    },
    /* 保存编辑 */
    save () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true
          this.$http[this.form.id ? "put" : "post"](
            this.isUpdate
              ? "/hiddendangeraction/update"
              : "/hiddendangeraction/add",
            this.form
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
