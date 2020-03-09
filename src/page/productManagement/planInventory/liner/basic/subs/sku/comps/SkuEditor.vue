<template>
  <el-dialog title="修改" width="650px" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 550px; height: 186px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
        <el-row>
          <el-col style="width: 290px;">
            <el-form-item ref="prefixRef" label="团期计划：" prop="codePrefix">
              <el-input placeholder="团号前缀" size="small"
                v-model="submitForm.codePrefix">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 90px;">
            <el-form-item label-width="0" style="text-align: center; color: #aeaeae;">- 日期 -</el-form-item>
          </el-col>
          <el-col style="width: 170px;">
            <el-form-item ref="suffixRef" label-width="0" prop="codeSuffix">
              <el-input placeholder="团号后缀" size="small"
                v-model="submitForm.codeSuffix">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col style="width: 290px;"> 
          <el-form-item label="清位天数：" prop="uptoDay">
            <el-select placeholder="清位天数" size="small"
              v-model="submitForm.suppliertype">
              <el-option
                v-for="item in CLEAR_OPTIONS"
                :key="item.value"
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="width: 290px;"> 
          <el-form-item label="出行模板：" prop="uptoDay">
            <el-select placeholder="出行模板" size="small"
              v-model="submitForm.suppliertype">
              <el-option
                v-for="item in CLEAR_OPTIONS"
                :key="item.value"
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  
  data(){
    return {
      state: false,
      submitForm: {
        suppliertype: 1,
      },
      rules: {},
      CLEAR_OPTIONS: [{label: '出发前一天', value: 1}, {label: '出发当天', value: 2}, {label: '出发第二天', value: 3}]
    }
  },

  methods: {
    open(){
      this.state= true;
    },
    handleClose(){
      this.state= false;
    }
  }

}
</script>