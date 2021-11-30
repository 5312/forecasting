<template>
  <div class="container">
    <div v-if="value == 'number'">
      <el-input-number
        v-model="text"
        :min="0"
        placeholder="请输入资源数据库"
        controls-position="right"
        class="ele-fluid ele-text-left"
      />
    </div>
    <div v-if="value == 'text'">
      <el-input type="text" v-model="text" placeholder="请输入内容"> </el-input>
    </div>
    <div v-if="value == 'textarea'">
      <el-input type="textarea" v-model="text" row="2" placeholder="请输入内容">
      </el-input>
    </div>
    <div v-if="value == 'select'">
      <el-select v-model="text" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <div v-if="value == 'radio'">
      <el-radio-group v-model="text">
        <el-radio :label="x" v-for="(x, y) in options" :key="y">{{
          x
        }}</el-radio>
      </el-radio-group>
    </div>
    <div v-if="value == 'checkbox'">
      <el-checkbox-group v-model="text">
        <el-checkbox
          v-for="(x, y) in options"
          :key="y"
          :label="x"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-if="value == 'datetime'">
      <el-date-picker
        v-model="text"
        value-format="yyyy 年 MM 月 dd 日"
        type="date"
        placeholder="选择日期"
      >
      </el-date-picker>
    </div>
  </div>
</template>
<script>
export default {
  name: "Formtype",
  model: {
    prop: "vdata",
    event: "change"
  },
  props: {
    data: String,
    vdata: [String, Number, Array, Boolean],
    opts: [String, Object]
  },
  watch: {
    text(e) {
      this.$emit("change", e);
    }
  },
  data() {
    return {
      text: this.vdata,
      value: this.data
    };
  },
  computed: {
    options() {
      let array = [];
      if (this.opts != "") {
        try {
          array = JSON.parse(this.opts).data;
        } catch (e) {
          array = this.opts.split(",");
        }
      }

      if (array.length) {
        return array;
      } else {
        return [];
      }
    }
  }
};
</script>
