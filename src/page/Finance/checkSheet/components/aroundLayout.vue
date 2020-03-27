/*
 * @Author: WZJ 
 * @Date: 2020-03-26 16:43:51 
 * @Last Modified by: WZJ
 * @Last Modified time: 2020-03-26 17:15:30
 */

<template>
  <el-container :style="{'minHeight':parentHeight+'px'}">
    <el-aside width="10%">
      <el-tabs tab-position="left" style="height: 100%;text-align:center;width:100%">
        <el-tab-pane style="text-align:center" label="报账单"></el-tab-pane>
        <el-tab-pane :label="`需要您审批(${height})`"></el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    parentHeight: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      height: "100px"
    };
  },
  mounted() {}
};
</script>

<style>
#tab-0 {
  text-align: center;
}
#tab-1 {
  text-align: center;
}
</style>