<template>
  <el-dialog title="详情" width="650px" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 550px; min-height: 486px;">
      <el-form  label-width="120px">
        <el-form-item label="标题：" prop="title">{{ bus.title }}</el-form-item>
        <el-form-item label="城市：" prop="city">{{ bus.city }}</el-form-item>
        <el-form-item label="集合地点：" prop="resort">{{ bus.resort }}</el-form-item>
        <el-form-item label="价格说明：" prop="price">{{ bus.price }}</el-form-item>
        <el-form-item label="预定须知：" prop="reservation_notes">{{ bus.reservation_notes }}</el-form-item>
        <el-form-item label="温馨提示：" prop="reminder">{{ bus.reminder }}</el-form-item>
        <el-form-item label="去程返程：" prop="tour_no_prefix">{{ bus.go_place_departure+ ' / '+ bus.return_place_departure }}</el-form-item>
        <el-form-item label="售卖价格：" prop="sale_price">{{ bus.sale_price }}</el-form-item>
      </el-form> 
    </div>
    <div slot="footer">
      <el-button type="info" size="small"
        @click="handleClose">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {

  data(){
    return {
      state: false,
      bus: {}
    }
  },

  methods: {
    open(bus){
      this.state= true;
      this.bus= bus;
    },

    handleClose(){
      this.state= false;
    },
  }

}
</script>