<template>
  <el-card shadow="never">
    <div slot="header">
      <span>团期信息</span>
    </div>
    <el-form  label-width="120px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="团期计划：">
            <div class="no-wrap" :title="submitForm.tour_no">
              {{ submitForm.tour_no }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出发地：">
            <div class="no-wrap" :title="submitForm.departure">
              {{ submitForm.departure }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地：">
            <div class="no-wrap" :title="submitForm.destination">
              {{ submitForm.destination }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品名称：" style="margin:0;">
            <div class="no-wrap" :title="submitForm.product_name">
              {{ submitForm.product_name }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出发日期：" style="margin:0;">
            <div class="no-wrap" :title="submitForm.set_out_time">
              {{ submitForm.set_out_time }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预留时长：" style="margin:0;">
            <div class="no-wrap" :title="submitForm.reserved_time">
              {{ submitForm.reserved_time }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> 
  </el-card>
</template>

<script>
export default {

  data(){
    return {
      submitForm: {
        departure: '', destination: '', tour_no: '', product_name: '', set_out_time: '', reserved_time: ''
      }
    }
  },

  methods: {
    init(skuPlan){
      console.log(skuPlan)
      let { departure, destination, tour_no, set_out_year, set_out_day, set_out_month, reserved_time, product }= skuPlan;
      let set_out_time= `${set_out_year}年${set_out_month}月${set_out_day}`;
      reserved_time= `${reserved_time}小时`;
      departure= departure.map(el => el.departure_name).join('、');
      destination= destination.map(el => el.destination_name).join('、');
      Object.assign(
        this.submitForm, 
        { departure, destination, tour_no, set_out_time, reserved_time, product_name: product.product_name }
      )
    }
  }

}
</script>