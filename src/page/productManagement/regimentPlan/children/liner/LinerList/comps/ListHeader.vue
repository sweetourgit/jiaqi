<style lang="scss" scoped>

</style>

<template>
  <header>
    <div class="form-ground">
      <el-form label-width="120px" style="width: 100%;"
        ref="submitForm"
        :model="submitForm">
        <el-row >
          <el-col style="width: 320px;">
            <el-form-item label="团期计划：" prop="groupCode">
              <el-input placeholder="团期计划" size="small"
                v-model="submitForm.groupCode">
              </el-input>
            </el-form-item>
          </el-col> 

          <el-col style="width: 320px;">
            <el-form-item label="报账人：" prop="userName">
              <el-input placeholder="报账人" size="small"
                v-model="submitForm.userName">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col style="width: 320px;">
            <el-form-item label="产品名称：" prop="teamProTitle">
              <el-input v-model="submitForm.teamProTitle" placeholder="产品名称" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col style="width: 320px;">
            <el-form-item label="发起时间：" prop="beginTime">
              <el-date-picker size="small" type="date" style="width: 200px;"
                v-model="submitForm.beginTime"
                @change="beginTimeValidate"
                placeholder="起始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style="width: 320px;">
            <el-form-item label="截止时间：" prop="endTime">
              <el-date-picker size="small" type="date" style="width: 200px;"
                v-model="submitForm.endTime"
                @change="endTimeValidate"
                placeholder="截止时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="btn-ground">
      <el-button size="small" type="primary" 
        @click="$emit('reset-pageinfo')">
        搜索
      </el-button>
      <el-button size="small" type="info" 
        @click="reset">
        重置
      </el-button>
    </div>
  </header>
</template>

<script>
export default {

}
</script>