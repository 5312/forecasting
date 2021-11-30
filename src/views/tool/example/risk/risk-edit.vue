<!-- 威胁库编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '修改威胁库' : '添加威胁库'"
    :visible="visible"
    width="460px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="标题:" prop="title">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="form.title"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <i class="el-icon-edit el-input__icon" slot="suffix">
            <!-- @click="handleIconClick" -->
          </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.title }}</div>
            <!-- <span class="addr">{{ item.id }}</span> -->
          </template>
        </el-autocomplete>
        <!-- <el-input
          :maxlength="20"
          v-model="form.title"
          placeholder="请输入标题"
          clearable
        /> -->
      </el-form-item>

      <el-form-item label="评分ID:" label-width="120px" prop="score_id">
        <el-input-number
          :min="0"
          v-model="form.score_id"
          placeholder="请输入评分ID"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </el-form-item>

      <el-form-item label="单位ID:" label-width="120px" prop="dept_id">
        <el-input-number
          :min="0"
          v-model="form.dept_id"
          placeholder="请输入单位ID"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </el-form-item>

      <el-form-item label="引发隐患:" label-width="120px" prop="yinhuan_ids">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="form.yinhuan_name"
          :fetch-suggestions="querySearch_danger"
          placeholder="请输入内容"
          @select="handleSelect_danger"
        >
          <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
          </template>
        </el-autocomplete>
        <!-- <el-input
          :maxlength="20"
          v-model="form.yinhuan_ids"
          placeholder="请输入引发隐患id"
          clearable
        /> -->
      </el-form-item>

      <el-form-item label="威胁安全资源:" label-width="120px" prop="ziyuan_ids">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="form.ziyuan_name"
          :fetch-suggestions="querySearch_thr"
          placeholder="请输入内容"
          @select="handleSelect_thr"
        >
          <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}</div>
          </template>
        </el-autocomplete>
        <!-- <el-input
          :maxlength="20"
          v-model="form.ziyuan_ids"
          placeholder="请输入威胁安全资源"
          clearable
        /> -->
      </el-form-item>

      <el-form-item
        label="造成安全风险:"
        label-width="120px"
        prop="riskdata_id"
      >
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="form.riskdata_name"
          :fetch-suggestions="querySearch_risk"
          placeholder="请输入内容"
          @select="handleSelect_risk"
        >
          <i class="el-icon-edit el-input__icon" slot="suffix"> </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.title }}</div>
          </template>
        </el-autocomplete>
        <!-- <el-input-number
          :min="0"
          v-model="form.riskdata_id"
          placeholder="请输入造成安全风险"
          controls-position="right"
          class="ele-fluid ele-text-left"
        /> -->
      </el-form-item>

      <el-form-item label="状态:" prop="status" label-width="120px">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">在用</el-radio>

          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序:" prop="sort">
        <el-input
          :maxlength="20"
          v-model="form.sort"
          placeholder="请输入排序"
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
  name: "RiskEdit",
  components: {},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],

        scoreId: [{ required: true, message: "请输入评分ID", trigger: "blur" }],

        deptId: [{ required: true, message: "请输入单位ID", trigger: "blur" }],

        yinhuanIds: [
          { required: true, message: "请输入引发隐患id", trigger: "change" }
        ],

        ziyuanIds: [
          { required: true, message: "请输入威胁安全资源id", trigger: "change" }
        ],

        riskdataId: [
          { required: true, message: "请输入造成安全风险id", trigger: "change" }
        ],

        status: [{ required: true, message: "请选择状态", trigger: "blur" }],

        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
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
    }
  },
  mounted() {},
  computed: {},
  methods: {
    /* 造成安全风险  */
    querySearch_risk(queryString, cb) {
      this.safe_risk().then(res => {
        cb(res);
      });
    },
    handleSelect_risk(item) {
      this.form.riskdata_id = item.id;
      this.form.riskdata_name = item.title;
    },
    async safe_risk() {
      const res = await this.$http.get("/riskdata/list", {
        params: {
          page: 1,
          limit: 10
        }
      });
      if (res.data.code != 0) return;
      let data = res.data.data;
      return data;
    },
    /* 威胁安全资源  */
    querySearch_thr(queryString, cb) {
      this.threat().then(res => {
        cb(res);
      });
    },
    handleSelect_thr(item) {
      this.form.ziyuan_ids = item.id;
      this.form.ziyuan_name = item.name;
    },
    async threat() {
      const res = await this.$http.get("/itemcate/list", {
        params: {
          itemId: 1
        }
      });
      if (res.data.code != 0) return;
      let data = res.data.data;
      return this.getRootPid(data);
    },
    /* 引发隐患  */
    querySearch_danger(queryString, cb) {
      this.danger().then(res => {
        cb(res);
      });
    },
    handleSelect_danger(item) {
      this.form.yinhuan_ids = item.id;
      this.form.yinhuan_name = item.name;
    },
    async danger() {
      const result = await this.$http.get("/itemcate/list", {
        params: {
          itemId: 2
        }
      });
      if (result.data.code != 0) return;
      let data = result.data.data;
      /* 只取顶级 pid = 0 */
      return this.getRootPid(data);
    },
    /* 标题 -- 威胁行为库 */
    querySearch(queryString, cb) {
      this.threat_do().then(res => {
        cb(res);
      });
    },
    handleSelect(item) {
      this.form.title = item.title;
    },
    async threat_do() {
      const res = await this.$http.get("/riskaction/list", {
        params: {
          page: "1",
          limit: "11"
        }
      });
      if (res.data.code != 0) return;
      let data = res.data.data;
      return data;
    },

    /* 通用方法 pid = 0  */
    getRootPid(list) {
      if (!list) return;
      let array = [];
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if (element.pid == 0) {
          array.push(element);
        }
      }
      return array;
    },
    /* 保存编辑 */
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http[this.form.id ? "put" : "post"](
            this.isUpdate ? "/risk/update" : "/risk/add",
            this.form
          )
            .then(res => {
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
            .catch(e => {
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
    }
  }
};
</script>

<style scoped></style>
