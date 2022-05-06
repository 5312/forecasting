<!-- 站点编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '修改数据库' : '添加添加'"
    :visible="visible"
    width="750px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="数据库:" prop="name">
            <el-input clearable v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注:">
        <el-input
          :rows="3"
          clearable
          type="textarea"
          :maxlength="200"
          v-model="form.note"
          placeholder="请输入备注"
        />
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
//import uploadImage from '@/components/uploadImage'

export default {
  name: 'ItemEdit',
  //components: {uploadImage},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data () {
    return {
      // 表单数据
      form: Object.assign({ status: 1 }, this.data),
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]

      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    }
  },
  watch: {
    data () {
      if (this.data) {
        this.form = Object.assign({ status: 1, type: 1 }, this.data)
        this.isUpdate = true
      } else {
        this.form = {}
        this.isUpdate = false
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http[this.form.id ? 'put' : 'post'](this.isUpdate ? '/item/update' : '/item/add', this.form).then(res => {
            this.loading = false
            if (res.data.code === 0) {
              this.$message.success(res.data.msg)
              if (!this.isUpdate) {
                this.form = {}
              }
              this.updateVisible(false)
              this.$emit('done')
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(e => {
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
      this.$emit('update:visible', value)
    }
  }
}
</script>

<style scoped>
</style>
