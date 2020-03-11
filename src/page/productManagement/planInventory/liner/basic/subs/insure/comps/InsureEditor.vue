<style>

</style>

<template>
  <el-dialog width="750px" 
    :title="isSave?'修改':'添加'"
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 650px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules">
        <el-form-item label="标题：" prop="codePrefix">
          <el-input placeholder="标题" size="small" maxlength="40" show-word-limit
            v-model="submitForm.codePrefix">
          </el-input>
        </el-form-item>
        <el-form-item label="售卖价格：" prop="codePrefix">
          <el-input placeholder="售卖价格" size="small"
            v-model="submitForm.codePrefix">
          </el-input>
        </el-form-item>
        <el-form-item label="保险说明：" prop="codePrefix">
          <el-input type="textarea" rows="10" placeholder="保险说明" maxlength="1000" show-word-limit
            v-model="submitForm.textarea">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {

  data(){
    return {
      state: false,
      isSave: false,
      submitForm: {},
      rules: {}
    }
  },

  methods: {
    open(insure){
      this.state= true;
      if(insure) this.isSave= true;
    },
    handleClose(){
      this.state= false;
      this.isSave= false;
    },
  }

}
</script>