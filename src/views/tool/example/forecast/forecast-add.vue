<!-- 安全分析预测编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '修改安全资源分析' : '添加安全资源分析'"
    :visible="visible"
    width="460px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-form-item label="标题:" prop="title">
        <el-input
          :min="0"
          v-model="form.title"
          placeholder="请输入标题"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </el-form-item>
      <el-form-item label="开始时间:" prop="time">
        <el-date-picker v-model="form.forecast_stime" type="date" placeholder="请选择任务开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input
          :maxlength="20"
          v-model="form.sort"
          placeholder="请输入排序号"
          clearable
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
export default {
  name: "forcastAdd",
  props: {
    visible: Boolean,
    data: Object,
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
    };
  },
  mounted(){
    console.log(this.data)
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    },
  },
  computed: {},
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http[this.form.id ? "put" : "post"](
            this.isUpdate ? "/forecast/update" : "/forecast/add",
            this.form
          )
            .then((res) => {
              this.loading = false;
              if (res.data.code === 0) {
                this.$message.success(res.data.msg);
                if (!this.isUpdate) {
                  this.form = {};
                }
                this.updateVisible(false);
                this.$emit("done");
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch((e) => {
              this.loading = false;
              this.$message.error(e.message);
            });
        } else {
          return false;
        }
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    },
  },
};
</script>

<style scoped>
</style>
