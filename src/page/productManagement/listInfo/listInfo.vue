<style>
  .el-tabs__item{
    width: 144px ;
    margin-bottom: 10px;
    font-size: 16px;
  }
</style>
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first"><BaseInfo></BaseInfo></el-tab-pane>
      <el-tab-pane label="行程信息" name="second"><TripInfo></TripInfo></el-tab-pane>
      <el-tab-pane label="费用说明" name="third"><CostDescription></CostDescription></el-tab-pane>
      <el-tab-pane label="其他信息" name="fourth"><OtherInfo></OtherInfo></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import BaseInfo from '@/page/productManagement/baseInfo/baseInfo'
  import TripInfo from '@/page/productManagement/TripInfo/TripInfo'
  import CostDescription from '@/page/productManagement/CostDescription/CostDescription'
  import OtherInfo from '@/page/productManagement/OtherInfo/OtherInfo'
    export default {
        name: "baseInfo",
        components:{
          BaseInfo,
          TripInfo,
          CostDescription,
          OtherInfo
        },
        data() {
          return {
            activeName: 'first'
          };
        },
        methods: {
          handleClick(tab, event) {
            console.log(tab, event);
          }
        }
    }
</script>

<style scoped lang='stylus'>
  .el-tabs>>>.el-tabs__content{
    overflow visible!important
  }

</style>
