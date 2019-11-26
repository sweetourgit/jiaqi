<style lang="scss" scoped>

</style>

<template>
  <el-form
    :model="submitForm"
    ref="submitForm"
    label-width="100px"
    style="width: 100%;"
    size="mini">
    <el-row :gutter="0">

      <el-col :span="4">
        <el-form-item label="团期计划：" prop="groupCode">
          <el-input size="small" v-model="submitForm.groupCode" placeholder="团期计划"></el-input>
        </el-form-item>
      </el-col> 

      <el-col :span="4">
        <el-form-item label="报账人：" prop="userName">
          <el-input size="small" v-model="submitForm.userName" placeholder="报账人"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-form-item label="产品名称：" prop="teamProTitle">
          <el-input size="small" v-model="submitForm.teamProTitle" placeholder="产品名称"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8"> 
        <div style="display: flex;">
          <el-form-item label="发起时间：" prop="beginTime" :span="11">
            <el-date-picker
              v-model="submitForm.beginTime"
              type="date"
              placeholder="起始时间">
            </el-date-picker>
          </el-form-item>
          <el-col :span="2" style="height: 32px;width: 18px;text-align:center;line-height: 32px;">
            <div>-</div>
          </el-col>
          <el-form-item label-width="0" prop="endTime" :span="11">
            <el-date-picker
              v-model="submitForm.endTime"
              type="date"
              placeholder="截止时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-col>  

      <el-col :span="4">
        <el-form-item label-width="30px">
          <el-button size="small" type="primary" 
            @click="$emit('reset-pageinfo')">
            搜索
          </el-button>
          <el-button size="small" type="info" 
            @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {

  mounted(){
    this.init();
  },

  data(){
    return Object.assign(
      // 数据
      {
        submitForm: {
          groupCode: null, 
          userName: null, 
          teamProTitle: null, 
          beginTime: null, 
          endTime: null,
        }
      },
    )
  },

  methods: {
    init(conditions){
      this.reappearConditions(conditions);
    },

    reappearConditions(conditions){
      Object.assign(this.submitForm, conditions);
    },

    getConditions(){
      return this.$deepCopy(this.submitForm);
    },

    reset(){
      this.$refs.submitForm.resetFields();
      this.$emit('reset-pageinfo');
    }
  }
}
</script>