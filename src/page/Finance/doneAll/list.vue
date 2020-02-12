<!-- 已办列表页 -->
<template>
  <div class="distributor-content">
    <el-tabs v-model="tabShowWhich" @tab-click="handleClick" style="width: 98%;margin: 20px auto;">
      <el-tab-pane :label="'无收入借款管理(' + approveDataNum +')'" name="reimburse">

      </el-tab-pane>
      <el-tab-pane label="预付款管理" name="advance">

      </el-tab-pane>
      <el-tab-pane label="报销管理管理" name="borrow"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import noIn from './noIn'
  export default {
    name: "approveList",
    components: {
      noIn
    },
    data(){
      return {
        approveDataNum:2,
        tabShowWhich: 'reimburse', // 显示哪一个tab
      }
    },
    created(){

    },
    computed: {

    },
    methods: {
      // tab切换
      handleClick(tab, event) {
        // console.log(tab, event);
      },
    }
  }
</script>

<style scoped lang="scss">
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .plan{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .time{
        margin: 0 0 0 10px;
      }
      .fl{
        float:left;
        margin: 20px 0 20px 0;
      }
    }
    #table-content{
      width: 98%;
      margin: 40px auto 10px;
    }
  }
</style>
