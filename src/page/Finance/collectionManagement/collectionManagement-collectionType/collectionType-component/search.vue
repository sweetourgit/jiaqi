<template>
     <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" id="form-content">
      <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="团期计划:" prop="plan">
            <el-input v-model="ruleForm.plan" placeholder="请输入团期计划"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人:" prop="proposer">
            <el-autocomplete style="width: 100%" class="name_input" v-model="ruleForm.proposer" :fetch-suggestions="querySearchBorrower"
              placeholder="请输入申请人" :trigger-on-focus="false" @select="departureBorrower" @blur="departureBorrowerBlur"
              @focus="departureBorrowerFocus"></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:" class="status-length" prop="checkType">
            <el-select v-model="ruleForm.checkType" placeholder="请选择状态">
              <el-option label="驳回" value="2"></el-option>
              <el-option label="通过" value="1"></el-option>
              <el-option label="审批中" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="订单:" prop="order">
            <el-input v-model="ruleForm.order " placeholder="请输入订单"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款时间:">
            <el-col :span="11">
              <el-form-item prop="dateStart">
                <el-date-picker type="date" placeholder="收款时间" v-model="ruleForm.dateStart" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="dateEnd">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateEnd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="searchHandInside()" type="primary" icon="el-icon-search" :disabled="ifShowsearch">搜索</el-button>
            <el-button icon="el-icon-s-open" @click="emptyButtonInside('ruleForm')" type="primary" plain>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
</template>

<script>
export default {

}
</script>

<style>

</style>