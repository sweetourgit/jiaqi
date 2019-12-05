<template>
  <div>
       <!--备注信息弹窗-->
       <el-dialog title="详情" :visible.sync="dialogForm" class="city_list" width="1000px" @close="close">

       </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    payId:0,
    variable:0
  },
  data() {
    return {
       dialogForm:false,     
    }
  },
  created(){
  },
  watch: {
      variable:function(){        
        this.dialogForm=true;    


     }
  },
  methods: {
      close(){
        this.dialogForm=false;
      },
      orderGet(orderId){
        //查询一条订单信息
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderget',{
             "id": orderId
          }).then(res => {
            if(res.data.isSuccess == true){
               
            }
          }).catch(err => {
            console.log(err)
        })
      },





    }
}
</script>

<style scoped>
   .demo-ruleForm{margin-top: 20px}
   .remark{width: 600px}
   .time{margin-right: 60px;text-align: right;color: #999}
   .submitMark{float: right;margin-right: 60px}
   .colse{margin-left: 230px;width: 100px}
</style>