<template>
  <div style="padding-top: 20px;">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules">
      <el-form-item label="订单来源：" prop="name" ref="supplierRef">
        <el-radio-group v-model="submitForm.line_status">
          <el-radio :label="1">线下直客</el-radio>
          <el-radio :label="2">商户（同业、门店）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="价格选择：" prop="name" ref="supplierRef">
        <el-radio-group v-model="submitForm.line_status">
          <el-radio :label="1">线下直客</el-radio>
          <el-radio :label="2">商户（同业、门店）</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {

  data(){
    return {
      submitForm: {}
    }
  }

}
</script>

<style>

</style>