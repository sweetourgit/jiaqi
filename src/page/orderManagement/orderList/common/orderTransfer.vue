<template>
  <div>
       <!--订单转团弹窗-->
       <el-dialog title="转团" :visible.sync="dialogFormTransfer" class="city_list" width="780px">
          <el-form :model="markForm" ref="markForm" label-width="80px" class="demo-ruleForm">
            123
          </el-form>
       </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    orderId:0,
    variable:0,
    dialogType:0
  },
  data() {
    return {
       //备注信息弹窗
       dialogFormTransfer:false,     
       markForm:{

       }
    }
  },
  created(){
  },
  watch: {
      variable:function(){        
        if(this.dialogType==4){
          this.dialogFormTransfer=true;    
        }
     }
  },
  methods: {

    }
}
</script>

<style scoped>
   .demo-ruleForm{margin-top: 20px}
</style>