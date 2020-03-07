<template>
  <div class="plan">
    <el-form :model="ruleFormSearch" ref="ruleFormSearch" label-width="80px" style="margin-top: 20px">
      <el-row type="flex" class="row-bg">
        <el-col :span="9">
          <el-form-item label="申请时间:">
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSearch.startTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSearch.endTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align: left">
          <el-form-item>
            <el-button @click="handleSearchCommon" type="primary">搜索</el-button>
            <el-button @click="this.$parent.HandleResetApprove('ruleFormSearch', 'borrow')" type="primary">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import done from './done'
  export default {
    name: "search",
    data() {
      return {
        ruleFormSearch: {
          endTime: '',
          startTime: '',
        },
      }
    },
    mixins: [done],
    methods: {
      handleSearchCommon(){
        this.$parent.HandleSearchApprove('borrow')
      }
    }
  }
</script>

<style scoped>

</style>
