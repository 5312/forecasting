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

      <el-form-item label="评分ID:" label-width="120px" prop="scoreId">
        <el-select v-model="form.scoreId" placeholder="请选择活动区域">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
            <span style="float: left">{{ item.title }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.id
            }}</span>
          </el-option>
        </el-select>
        <!-- <el-input-number
          :min="0"
          v-model="form.score_id"
          placeholder="请输入评分ID"
          controls-position="right"
          class="ele-fluid ele-text-left"
        /> -->
      </el-form-item>

      <!-- <el-form-item label="单位ID:" label-width="120px" prop="deptId">
        <el-input-number
          :min="0"
          v-model="form.deptId"
          placeholder="请输入单位ID"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </el-form-item> -->

      <el-form-item label="引发隐患:" label-width="120px" prop="yinhuanIds">
        <el-checkbox-group v-model="form.yinhuanIds">
          <el-checkbox
            v-for="(item, index) in danger_arr"
            name="yinhuanIds"
            :label="String(item.id)"
            :key="index"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="威胁安全资源:" label-width="120px" prop="ziyuanIds">
        <el-checkbox-group v-model="form.ziyuanIds">
          <el-checkbox
            v-for="(item, index) in threat_arr"
            name="ziyuanIds"
            :label="String(item.id)"
            :key="index"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        label="造成安全风险:"
        label-width="120px"
        prop="riskdata_id"
      >
        <el-select v-model="form.riskdata_id" placeholder="请选择活动区域">
          <el-option
            v-for="item in risk_arr"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
            <span style="float: left">{{ item.title }}</span>
          </el-option>
        </el-select>
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
      form: {
        yinhuanIds: [],
        ziyuanIds: []
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],

        scoreId: [
          { required: true, message: "请输入评分ID", trigger: "change" }
        ],

        deptId: [{ required: true, message: "请输入单位ID", trigger: "blur" }],

        yinhuanIds: [
          { required: true, message: "请输入引发隐患id", trigger: "change" }
        ],

        ziyuanIds: [
          { required: true, message: "请输入威胁安全资源id", trigger: "change" }
        ],

        riskdata_id: [
          { required: true, message: "请输入造成安全风险id", trigger: "change" }
        ],

        status: [
          { required: true, message: "请选择状态", trigger: ["blur", "change"] }
        ],

        sort: [
          { required: true, message: "请输入排序", trigger: ["blur", "change"] }
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      threat_arr: [],
      danger_arr: [],
      risk_arr: [],
      options: []
    };
  },
  watch: {
    data() {
      console.log(this.data);
      if (this.data) {
        let obj = this.data;
        let danger = this.data.yinhuanIds;
        let safe = this.data.ziyuanIds;
        let yinhuan_ids = danger ? danger.split(",") : [];
        let ziyuan_ids = safe ? safe.split(",") : [];

        obj.yinhuanIds = yinhuan_ids;
        obj.ziyuanIds = ziyuan_ids;

        this.form = Object.assign({}, obj);

        this.isUpdate = true;
      } else {
        this.form = {
          yinhuanIds: [],
          ziyuanIds: []
        };
        this.isUpdate = false;
      }
    }
  },
  mounted() {
    // 威胁安全资源
    this.threat();
    // 引发隐患
    this.danger();
    // 造成安全风险
    this.safe_risk();
    // 频次 -- 评分id
    this.frequency();
  },
  methods: {
    /* 频次 */
    async frequency() {
      const res = await this.$http.get("/score/list", {
        params: {
          itemId: 3,
          itemcate_id: 28,
          page: 1,
          limit: 100
        }
      });
      if (res.data.code != 0) return;
      this.options = res.data.data;
      return res.data.data;
    },
    /* 造成安全风险  */
    async safe_risk() {
      const res = await this.$http.get("/riskdata/list", {
        params: {
          page: 1,
          limit: 100
        }
      });
      if (res.data.code != 0) return;
      let data = res.data.data;
      this.risk_arr = data;
      return data;
    },

    async threat() {
      const res = await this.$http.get("/itemcate/list", {
        params: {
          itemId: 1
        }
      });
      if (res.data.code != 0) return;
      let data = res.data.data;
      this.threat_arr = this.getRootPid(data);
    },
    /* 引发隐患  */
    async danger() {
      const result = await this.$http.get("/itemcate/list", {
        params: {
          itemId: 2
        }
      });
      if (result.data.code != 0) return;
      let data = result.data.data;
      /* 只取顶级 pid = 0 */
      let arr = this.getRootPid(data);
      this.danger_arr = arr;
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
      let _this = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          const params = _this.params();
          this.$http[this.form.id ? "put" : "post"](
            this.isUpdate ? "/risk/update" : "/risk/add",
            params
          )
            .then(res => {
              this.loading = false;
              if (res.data.code === 0) {
                this.$message.success(res.data.msg);
                if (!this.isUpdate) {
                  this.form = {
                    yinhuanIds: [],
                    ziyuanIds: []
                  };
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
    /* 参数处理 */
    params() {
      let params = this.form;
      params.yinhuan_ids = params.yinhuanIds ? params.yinhuanIds.join(",") : "";
      params.ziyuan_ids = params.ziyuanIds ? params.ziyuanIds.join(",") : "";
      // for (const key in params) {
      //   if (Object.hasOwnProperty.call(params, key)) {
      //     const element = params[key];
      //     if (element && element.join) {
      //       params[key] = element.join(",");
      //     }
      //   }
      // }
      return params;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit("update:visible", value);
    }
  }
};
</script>

<style scoped></style>
