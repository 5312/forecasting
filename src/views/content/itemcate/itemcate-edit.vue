<!-- 编辑弹窗 -->
<template>
  <el-dialog
    width="750px"
    :visible="visible"
    :lock-scroll="false"
    :destroy-on-close="true"
    custom-class="ele-dialog-form"
    :title="isUpdate?'修改栏目':'添加栏目'"
    @update:visible="updateVisible"
     >

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="92px"
      @keyup.enter.native="save"
      @submit.native.prevent>
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="栏目名称:" prop="name">
            <el-input
              clearable
              v-model="form.name"
              placeholder="请输入栏目名称"/>
          </el-form-item>
          <el-form-item label="类别:" prop="code">
            <el-select
              filterable
              clearable
              v-model="form.code"
              placeholder="请输入类别"
            >
              <el-option v-for="item in code" :key="item.id" :label="item.cate" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item label="数据库:" prop="itemId" v-if="database">
            <el-select
              filterable
              clearable
              v-model="form.itemId"
              size="small"
              placeholder="-请选择所属数据库-"
              class="ele-block">
              <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item label="栏目状态:" prop="status">
            <el-radio-group
              v-model="form.status">
              <el-radio :label="1">在用</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="上级栏目:">
            <treeselect
              :options="cateList"
              v-model="form.pid"
              :defaultExpandLevel="3"
              :normalizer="normalizer"
              placeholder="请选择上级栏目"/>
          </el-form-item>
          <el-form-item label="排序号:" prop="sort">
            <el-input-number
              :min="0"
              v-model="form.sort"
              placeholder="请输入排序号"
              controls-position="right"
              class="ele-fluid ele-text-left"/>
          </el-form-item>
          <!-- <el-form-item label="是否评分:" prop="isCover">
            <el-radio-group
              v-model="form.isCover"
              @change="onIsCoverChange">
              <el-radio :label="1">有评分</el-radio>
              <el-radio :label="2">无评分</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-col>
      </el-row>
      <el-form-item
        label="栏目评分:"
        v-if="form.isCover === 1">
        <el-input-number
          :min="0"
          v-model="form.cover"
          placeholder="请输入分值（1-3）"
          controls-position="right"
          class="ele-fluid ele-text-left"/>
      </el-form-item>

      <el-form-item label="备注:">
        <el-input
          :rows="4"
          clearable
          type="textarea"
          :maxlength="200"
          v-model="form.note"
          placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="save">保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'DeptEdit',
  components: {Treeselect},
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部栏目数据
    cateList: Array,
    itemId:[String,Number]
  },
  data() {
    return {
      database:false,
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入栏目名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入类别', trigger: 'blur'}
        ],
        itemId: [
          {required: true, message: '请选择所属数据库', trigger: 'blur'}
        ],
        isCover: [
          {required: true, message: '请选择是否评分', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 站点列表
      itemList: [],
      code:[
        {
          cate:"一级分类",
          id:1
        },
        {
          cate:"二级分类",
          id:2
        }
      ],
      categroy:''
    };
  },
  watch: {
    data() {
      this.isUpdate = !!(this.data && this.data.id);
      this.form = this.initFormData(this.data);
      
      this.code.forEach((i)=>{
        if(this.data.code == i.id){
          this.form.code = i.cate
        }
      })
      // console.log(this.form.code)
    }
  },
  mounted() {
    // console.log(this.data)
    // 获取站点列表
    this.getItemList();
  },
  methods: {
    /* 下拉树格式化 */
    normalizer(d) {
      return {
        id: d.id,
        label: d.name,
        children: d.children || undefined
      };
    },
    /* 保存编辑 */
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/itemcate/update' : '/itemcate/add',
            Object.assign({}, this.form, {
              pid: this.form.pid || 0
            })
          ).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
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
      this.$emit('update:visible', value);
    },
    /* 初始化form数据 */
    initFormData(data) {
      // 初始化默认值
      let form = {status: 1, isCover: 2,itemId: this.itemId,sort:1};
      if (data) {
        Object.assign(form, data, {
          pid: data.pid === 0 ? null : data.pid,
        });
      }
      return form;
    },
    /* isCover选择改变 */
    onIsCoverChange() {
      if (this.form.isCover === 1) {
        this.form.isCover = 1;
      } else {
        this.form.isCover = 2;
      }
    },
    /**
     * 获取站点列表
     */
    getItemList() {
      this.$http.get('/item/getItemList').then(res => {
        if (res.data.code === 0) {
          this.itemList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  }
}
</script>

<style scoped>
</style>
