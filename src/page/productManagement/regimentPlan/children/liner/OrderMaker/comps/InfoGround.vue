<style>
.no-wrap{
  word-break:keep-all;/* 不换行 */
  white-space:nowrap;/* 不换行 */
  overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow:ellipsis;
}
</style>

<template>
  <el-card shadow="never">
    <div slot="header">
      <span>团期信息</span>
    </div>
    <el-form  label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="团期计划：" prop="title">
            <div class="no-wrap" :title="'123'">123</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出发地：" prop="title">
            <div class="no-wrap" :title="'123'">123</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目的地：" prop="title">
            <div class="no-wrap" :title="'123'">123</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品名称：" prop="title" style="margin:0;">
            <div class="no-wrap" :title="'123'">123</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出发日期：" prop="title" style="margin:0;">
            <div class="no-wrap" :title="'123'">123</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预留时长：" prop="title" style="margin:0;">
            <div class="no-wrap" :title="'123'">123</div>
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
      bus: {}
    }
  }

}
</script>