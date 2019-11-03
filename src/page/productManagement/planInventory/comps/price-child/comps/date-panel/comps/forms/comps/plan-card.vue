<style lang="scss" scoped>

</style>

<template>
  <el-card style="width: 380px;flex-shrink: 0; margin-right: 20px; background-color: #f6f6f6;"
    shadow="never">
    <div slot="header">
      <span>卡片名称</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">保存</el-button> -->
    </div>
    <div>
      <el-form
        label-width="130px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-form-item label="报名类型：" prop="night" style="width: 320px;">
          <el-select v-model="submitForm.crowdID" placeholder="最高" size="small">
            <el-option
              v-for="item in 24"
              :key="item"
              :label="item+ '小时'"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价：" prop="price_01" style="width: 320px">
          <el-input placeholder="销售价" size="small"
            v-model="submitForm.price_01">
          </el-input>
        </el-form-item>
        <el-form-item label="同业价：" prop="price_02" style="width: 320px">
          <el-input placeholder="同业价" size="small"
            v-model="submitForm.price_02">
          </el-input>
        </el-form-item>
        <el-form-item label="甜橙结算价：" prop="price_03" style="width: 320px">
          <el-input placeholder="甜橙结算价" size="small"
            v-model="submitForm.price_03">
          </el-input>
        </el-form-item>
        <el-form-item label="甜橙线上售价：" prop="price_04" style="width: 320px">
          <el-input placeholder="甜橙线上售价" size="small"
            v-model="submitForm.price_04">
          </el-input>
        </el-form-item>
        <el-form-item label="配额：" prop="quota" style="width: 320px">
          <el-input placeholder="配额" size="small"
            v-model="submitForm.quota">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      vm: {},
      submitForm: {},
      rules: {}
    }
  },
}
</script>