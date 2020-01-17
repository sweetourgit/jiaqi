<template>
  <el-dialog title="编辑备注" width="650px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form
      label-width="120px" 
      ref="submitForm">

      <el-form-item label="订单号:">
        <div style="text-align: left;">{{ submitForm.orderCode }}</div>
      </el-form-item>

      <el-form-item label="来源:">
        <div style="text-align: left;">{{ submitForm.orderSource }}</div>
      </el-form-item>

      <el-form-item label="类型:">
        <div style="text-align: left;">{{ submitForm.orderChannelEX }}</div>
      </el-form-item>
      
      <el-form-item label="联团人:">
        <div style="text-align: left;">{{ submitForm.joinPeople }}</div>
      </el-form-item>

      <el-form-item label="订单收入:">
        <div style="text-align: left;">{{ submitForm.orderPrice | priceFilter }}元</div>
      </el-form-item>

      <el-form-item label="已收款:">
        <div style="text-align: left;">{{ submitForm.incomePrice | priceFilter }}元</div>
      </el-form-item>

      <el-form-item label="欠款:">
        <div style="text-align: left;">{{ submitForm.arrearsPrice | priceFilter }}元</div>
      </el-form-item>

      <el-form-item label="备注:">
        <el-input type="textarea" placeholder="备注" size="small" style="width: 450px;"
          v-model="submitForm.mark">
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" 
        @click="handleClose">
        取 消
      </el-button>
      <el-button type="primary" size="small" 
        @click="saveAction">
        保 存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {

  filters: {
    priceFilter(val, noZero){
      if(!val) return noZero? ' ': 0;
      return val.toFixed(2);
    }
  },

  data(){
    return Object.assign(
      {
        state: false
      },
      {
        submitForm: {
          orderCode: null,
          orderSource: null,
          orderChannelEX: null,
          joinPeople: null,
          orderPrice: null,
          incomePrice: null,
          arrearsPrice: null,
          mark: null
        },
        rules: {

        }
      }
    )
  },

  methods: {
    wakeup(payload){
      this.proto= payload;
      let { orderCode, orderSource, orderChannelEX, joinPeople, orderPrice, incomePrice, arrearsPrice, mark }= payload;
      Object.assign(this.submitForm, {
        orderCode, orderSource, orderChannelEX, joinPeople, orderPrice, incomePrice, arrearsPrice, mark
      });
      this.state= true;
    },

    handleClose(){
      this.proto= null;
      this.$refs.submitForm.resetFields();
      this.state= false;
    },

    saveAction(){
      this.proto.mark= this.submitForm.mark;
      this.handleClose();
    }
  }
}
</script>