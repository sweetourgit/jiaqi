<template>
  <el-dialog title="详情" width="650px" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 550px; min-height: 486px;">
      <el-form  label-width="120px">
        <el-form-item label="标题：" prop="title">123123123</el-form-item>
        <el-form-item label="城市：" prop="city">123123123</el-form-item>
        <el-form-item label="集合地点：" prop="resort">123123123</el-form-item>
        <el-form-item label="价格说明：" prop="price">123123123</el-form-item>
        <el-form-item label="预定须知：" prop="reservation_notes">123123123</el-form-item>
        <el-form-item label="温馨提示：" prop="reminder">123123123</el-form-item>
        <el-form-item label="去程返程：" prop="tour_no_prefix">123123123</el-form-item>
        <el-form-item label="售卖价格：" prop="sale_price">123123123</el-form-item>
      </el-form> 
    </div>
  </el-dialog>
</template>

<script>
export default {

  data(){
    return {
      state: false,
    }
  },

  methods: {
    open(bus){
      this.state= true;
    },

    handleClose(){
      this.state= false;
    },
  }

}
</script>