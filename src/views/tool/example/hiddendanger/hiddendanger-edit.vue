<!-- 隐患调查编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '修改隐患调查' : '添加隐患调查'"
    :visible="visible"
    width="660px"
    :destroy-on-close="true"
    :lock-scroll="false"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <!-- <el-form-item label="单位ID:" prop="dept_id">
        <el-input-number
          :min="0"
          v-model="form.dept_id"
          placeholder="请输入单位ID"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </el-form-item>

      <el-form-item label="类别:" prop="itemcate_id">
        <el-input-number
          disabled
          :min="0"
          v-model="form.itemcate_id"
          placeholder="请输入类别"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </el-form-item>

      <el-form-item label="栏目:" prop="itemcate_cid">
        <el-input-number
          disabled
          :min="0"
          v-model="form.itemcate_cid"
          placeholder="请输入栏目"
          controls-position="right"
          class="ele-fluid ele-text-left"
        />
      </el-form-item> -->

      <el-form-item label="隐患行为:" prop="title">
        <el-input
          :maxlength="20"
          v-model="form.title"
          placeholder="请输入隐患标题"
          clearable
        />
      </el-form-item>

      <el-form-item label="评价标准:" prop="score_id">
        <el-popover
          placement="bottom"
          width="450"
          trigger="click"
          v-model="show"
        >
          <ele-pro-table
            v-if="visible"
            ref="table"
            placement="top"
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
            <template slot="percentage" slot-scope="{ row }">
              {{ Number(row.score) * 100 + "%" }}
            </template>
          </ele-pro-table>
          <!--   -->
          <el-input
            v-loading="popover"
            slot="reference"
            :maxlength="20"
            readonly=""
            v-model="setId"
            placeholder="请选择评价标准"
            clearable
          />
        </el-popover>
        <!-- <el-input
          :maxlength="20"
          v-model="form.score_id"
          placeholder="请输入评价标准"
          clearable
        /> -->
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
  name: "HiddendangerEdit",
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
      form: Object.assign(
        {
          score_id: ""
        },
        this.data
      ),
      // 表单验证规则
      rules: {
        deptId: [{ required: true, message: "请输入单位ID", trigger: "blur" }],

        itemcateId: [
          { required: true, message: "请输入类别", trigger: "blur" }
        ],

        itemcateCid: [
          { required: true, message: "请输入栏目", trigger: "blur" }
        ],

        title: [{ required: true, message: "请输入隐患标题", trigger: "blur" }],

        scoreId: [
          { required: true, message: "请输入评价标准", trigger: "blur" }
        ],

        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      show: false,
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      //
      url: "/score/list",
      columns: [
        {
          prop: "title",
          label: "评价标准"
        },
        {
          prop: "score",
          label: "扣分比例(%)",
          width: 100,
          slot: "percentage"
        }
      ],
      current: null,
      popover: false
    };
  },
  watch: {
    current(n) {
      this.form.score_id = n.id;
    },
    data() {
      // console.log(this.data);
      let sort = this.data.sort ? this.data.sort : 0;
      if (this.data.isUpdate) {
        this.form = Object.assign({ score_id: "", sort: sort }, this.data);
        this.isUpdate = true;
      } else {
        this.form = Object.assign({ score_id: "", sort: sort }, this.data);
        this.isUpdate = false;
      }
    }
  },
  computed: {
    where() {
      let obj = {
        itemcate_id: "",
        itemcate_cid: ""
      };
      if (this.data) {
        obj.itemcate_id = this.data.itemcate_id;
        obj.itemcate_cid = this.data.itemcate_cid;
      }
      return obj;
    },
    // 赋值ID显示
    setId() {
      let val = this.form.score_id * 1;
      let title = "";
      if (!this.table_data) return;
      if (typeof val == "number") {
        if (!this.table_data) return "";
        this.table_data.forEach(obj => {
          if (Number(obj.id) == val) {
            title = obj.title;
          }
        });
      }
      return title;
    }
  },
  methods: {
    done(res) {
      this.table_data = res.data;
      this.popover = false;
    },
    /* 保存编辑 */
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http[this.form.id ? "put" : "post"](
            this.isUpdate ? "/hiddendanger/update" : "/hiddendanger/add",
            this.form
          )
            .then(res => {
              this.loading = false;
              if (res.data.code === 0) {
                this.$message.success(res.data.msg);
                if (!this.isUpdate) {
                  this.form = { score_id: "" };
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
