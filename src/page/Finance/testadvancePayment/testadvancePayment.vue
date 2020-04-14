<!-- 预付款借款记录 跟无收入共用一个申请详情页面和借款申请弹框-->
<template>
<div class="vivo">
    <el-tabs v-model="activeName" @tab-click="handleClick">   
        <el-tab-pane label="借款记录" name="loanRecords">
            <commonformquery ref="loanRecords" :paymentType='paymentType'></commonformquery>
        </el-tab-pane>
    </el-tabs>
</div>
</template>
<script>
  import commonformquery from '@/page/Finance/testLoanManagement/testformQuery/commonFormQuery'
  export default {
    data() {
      return {
        activeName: 'loanRecords',
        paymentType:2,
      };
    },
    mounted(){
      //初始化时加载页面的table数据
       this.$refs.loanRecords.getList() ;
         
    },
    methods: {
     handleClick(){},
    
    },
    components:{
        commonformquery
    }
  };
</script>
<style scoped="scoped">
 .vivo{margin-bottom: 50px;}
</style>
