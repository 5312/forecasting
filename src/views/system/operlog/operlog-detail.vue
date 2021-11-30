<!-- 详情弹窗 -->
<template>
  <el-dialog
    title="详情"
    width="640px"
    :visible="visible"
    :lock-scroll="false"
    :destroy-on-close="true"
    @update:visible="updateVisible">
    <el-form
      size="mini"
      label-width="82px"
      class="ele-form-detail">
      <el-row :gutter="15">
        <el-col :sm="12">
          <el-form-item label="操作模块:">
            <div class="ele-text-secondary">
              {{ data.model }}
            </div>
          </el-form-item>
          <el-form-item label="IP地址:">
            <div class="ele-text-secondary">
              {{ data.operIp }}
            </div>
          </el-form-item>
          <el-form-item label="操作时间:">
            <div class="ele-text-secondary">
              {{ data.createTime | toDateString }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="操作人:">
            <div class="ele-text-secondary">
              {{ data.operName }}({{ data.username }})
            </div>
          </el-form-item>
          <el-form-item label="IP区域:">
            <div class="ele-text-secondary">
              {{ data.operLocation }}
            </div>
          </el-form-item>
          <el-form-item label="日志状态:">
            <el-tag
              :type="['success','danger'][data.status]"
              size="mini">
              {{ ['操作日志', '错误日志'][data.status] }}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin: 12px 0;">
        <el-divider/>
      </div>
      <el-form-item label="请求地址:">
        <div class="ele-text-secondary">
          {{ data.operUrl }}
        </div>
      </el-form-item>
      <el-form-item label="调用方法:">
        <div class="ele-text-secondary">
          {{ data.operMethod }}
        </div>
      </el-form-item>
      <el-form-item label="用户代理:">
        <div class="ele-text-secondary">
          {{ data.userAgent }}
        </div>
      </el-form-item>
      <el-form-item label="请求参数:">
        <div class="ele-text-secondary">
          {{ data.requestParam }}
        </div>
      </el-form-item>
      <el-form-item label="返回结果:">
        <div class="ele-text-secondary">
          {{ data.result }}
        </div>
      </el-form-item>
      <el-form-item label="备注:">
        <div class="ele-text-secondary">
          {{ data.note }}
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'OperRecordDetail',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 数据
    data: Object
  },
  methods: {
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
