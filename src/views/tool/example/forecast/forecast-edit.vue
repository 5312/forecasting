<!-- 安全分析预测编辑弹窗 -->
<template>
  <el-dialog
    :title="isUpdate ? '修改安全资源' : '添加安全分析预测'"
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
            {{ x.name }}<i class="header-icon el-icon-info"></i>
            <p id="score">{{score}}</p>
          </template>
          <ele-pro-table
            v-if="x.show"
            :ref="'table' + y"
            :where="x.where"
            :columns="temp(x.temptlate)"
            :datasource="x.url"
            :toolbar="true"
            height="calc(100vh -800px)"
            :page-size="100"
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
                >添加</el-button
              >
              <el-button
                icon="el-icon-plus"
                class="ele-btn-icon"
                style="float: right; padding: 3px 0"
                type="primary"
                @click.stop="manualAdd()"
                >手动添加</el-button
              >
            </template>
            <!-- 操作列 -->
            <template slot="action" slot-scope="{ row }">
              <el-popconfirm
                class="ele-action"
                title="确定要删除此安全资源吗？"
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
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" @click="save" :loading="loading"
        >保存
      </el-button>
    </div>
    <SafeStatus
      :visible.sync="twoshow"
      :params="params_id"
      :forecast="form.id"
      @saveTableData="saveTableData"
    ></SafeStatus>
    <Manual :visible.sync="man"></Manual>
  </el-dialog>
</template>

<script>
import SafeStatus from "./safeStatus-edit.vue";
import Manual from "./manuals.vue";
export default {
  name: "ForecastEdit",
  components: {
    SafeStatus,
    Manual,
  },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
  },
  data() {
    return {
      defaultColumns: [
        {
          columnKey: "selection",
          type: "selection",
          width: 45,
          align: "center",
          fixed: "left",
        },
        {
          prop: "id",
          label: "ID",
          width: 60,
          align: "center",
          fixed: "left",
        },
        {
          prop: "title",
          label: "名称",
          align: "center",
          minWidth: 200,
        },
        {
          prop: "sums",
          label: "数量",
          width: 60,
          align: "center",
        },
        {
          prop: "scoreTitle",
          label: "评价标准",
          width: 300,
          align: "center",
        },
        {
          prop: "Score",
          label: "资源赋值(R)",
          align: "center",
          minWidth: 120,
        },
        {
          prop: "Scoresum",
          label: "总赋值",
          align: "center",
        },
        {
          columnKey: "action",
          label: "操作",
          width: 150,
          align: "center",
          resizable: false,
          slot: "action",
          fixed: "right",
        },
      ],
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        title: [
          {
            required: true,
            message: "请输入安全分析预测标题",
            trigger: "blur",
          },
        ],

        forecastStime: [
          { required: true, message: "请输入任务开始时间", trigger: "blur" },
        ],

        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
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
      score:"8.0分"
    };
  },
  mounted() {},
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
    visible(val) {
      if (val) {
        this.index();
      } else {
        this.typeData = [];
      }
    },
  },
  computed: {
    // 初始化富文本
    initEditor() {
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
          let file = blobInfo.blob();
          // 使用axios上传
          const formData = new FormData();
          formData.append("file", file, file.name);
          this.$http
            .post("/upload/uploadImage", formData)
            .then((res) => {
              if (res.data.code == 0) {
                success(res.data.data.fileUrl);
              } else {
                error(res.data.msg);
              }
            })
            .catch((e) => {
              // console.error(e);
              error(e.message);
            });
        },
        file_picker_types: "media",
        file_picker_callback: () => {},
      };
    },
  },
  methods: {
    temp(arr) {
      let array = arr;
      if (!arr) return {};
      const col = this.defaultColumns;
      let col_arr = [];
      for (let index = 0; index < col.length; index++) {
        const element = col[index];
        col_arr.push(element);
      }
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        element.prop = element.code;
        element.label = element.title;
        element.align = "center";
        col_arr.push(element);
      }
      return col_arr;
    },
    parseData_left(res) {
      // console.log(res)
      let parse = res.data;
      for (let i = 0; i < parse.length; i++) {
        const element = parse[i];
        var ele = element.assets_json
          ? JSON.parse(element.assets_json)
          : { data: [] };

        let data = ele.data;
        for (let j = 0; j < data.length; j++) {
          const obj = data[j];
          Object.assign(element, obj);
        }
      }
      return {
        btype: 0,
        code: 0,
        count: 0,
        data: parse,
        msg: "操作成功",
      };
    },
    reload(i) {
      let table = `table${i}`;

      this.$refs[table][0].reload({ page: 1 });
    },
    addSafeStatus(x, y) {
      this.tableIndex = x;
      // 添加安全资源
      if (this.tableIndex !== null) {
        this.twoshow = true;
      }
      this.params_id = y;
    },
    manualAdd(x) {
      // 展开项 下表标
      this.tableIndex = x;

      this.man = true;
    },
    saveTableData(array) {
      console.log(array);
      // 添加时，选中的表格数据
      let i = this.tableIndex;
      this.reload(i);
      this.twoshow = false;
      this.tableIndex = null;
    },

    async remove(row, index) {
      this.tableIndex = index;
      // 删除
      const res = await this.$http.delete("/assetslibrary/delete/" + row.id);
      if (res.data.code == 0) {
        this.reload(index);
      }
    },
    // 编辑的数据
    async index() {
      const res = await this.$http.get("/itemcate/list", {
        params: {
          item_id: 1,
        },
      });
      if (res.data.code == 0) {
        let array = res.data.data;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element.pid == 0) {
            element.where = {
              forecast_id: this.form.id,
              itemcateid: element.id,
              itemcatecid: null,
            };
            // 模板接口
            const d = await this.$http.get("/configdata/list", {
              params: {
                configId: element.id,
                forecast_id:this.form.id
              },
            });
            element.temptlate = d.data.data;
            // 模板数据接口
            const g = await this.$http.get("/assetslibrary/list/", {
              params: element.where,
            });
            element.eleData = g.data.data;
            // 数据接口
            // const z = await this.$http.get("/assets/list", {
            //   params: {
            //     forecast_id:this.form.id,
            //     itemcateid: element.id,
            //     itemcatecid: null,
            //   },
            // });
            // element.assData = z.data.data;
            // console.log(element.assData);
            element.url = "/assetslibrary/list";
            element.show = true;
            this.typeData.push(element);
          }
        }
      }
    },
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
    removeBatch() {},
  },
};
</script>

<style lang="scss" scoped>
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
</style>
