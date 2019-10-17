<style lang="scss" scoped>
@import '../../index.scss';  
.basic-pane{
  width: $width;
}
</style>

<template>
  <div class="basic-pane">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules"
    >
      <el-form-item label="产品名称：" prop="title">
        <el-input v-model="submitForm.title" placeholder="产品名称" style="width: 300px;" size="small"></el-input>
      </el-form-item>
      <el-form-item label="出游类型：" prop="isForeign">
        <el-radio-group v-model="submitForm.isForeign">
          <el-radio label="1">境外</el-radio>
          <el-radio label="2">国内</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出发地：" prop="pods">
        <label-input
          
        ></label-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  
  props: {
    proto: Object,
  },

  mounted(){
    this.init();
  },

  data(){
    return {
      submitForm: {

      },
      rules: {

      }
    }
  },

  methods: {
    init(){
      this.submitForm= this.$deepCopy(this.proto);
    },
  }
}
</script>