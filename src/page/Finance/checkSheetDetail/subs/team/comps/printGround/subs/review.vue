/*
 * @Author: WZJ 
 * @Date: 2020-03-27 09:11:22 
 * @Last Modified by: WZJ
 * @Last Modified time: 2020-03-30 09:48:04
 */
<template>
  <div class="review-collection">
    <!-- 审核结果 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
      <el-table :data="reviewList" border >
      <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
      <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
      <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
      </el-table>
    <!-- 审核结果 END -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed:{
    ...mapState('review',{reviewList:'reviewList'})
  }
};
</script>

<style>
</style>