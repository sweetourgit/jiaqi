<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="自由行借款记录" name="first">
        <commonformquery></commonformquery>

    </el-tab-pane>
    <el-tab-pane label="游轮借款记录" name="second">游轮借款记录</el-tab-pane>

    <el-tab-pane label="签证借款记录" name="third">签证借款记录</el-tab-pane>


  </el-tabs>
</template>
<script>
  import commonformquery from '@/page/Finance/testLoanManagement/testformQuery/commonFormQuery'
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    components:{
        commonformquery
    }
  };
</script>
