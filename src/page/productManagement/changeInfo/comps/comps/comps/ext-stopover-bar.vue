<style lang="scss" scoped>
.ext-stopver-bar{
  padding-top: 20px;
  border-top: 1px dashed #aaa;
}
</style>

<template>
  <div class="ext-stopver-bar">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules"
    >
      <el-row>
        <el-col style="width: 330px;">
          <el-form-item label="经停城市：" label-width="120px" prop="stopCity">
            <el-input v-model="submitForm.stopCity" placeholder="航空公司" style="width: 100%;" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width: 280px;">
          <el-form-item label="经停时间：" label-width="140px" prop="stopDate">
            <el-input v-model="submitForm.stopDate" placeholder="航班号" style="width: 100%;" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col style="width: 50px;">
          <el-form-item label-width="0">
            <span style="padding-left: 12px;">分钟</span>
          </el-form-item>
        </el-col>
        <el-col style="width: 330px;">
          <el-form-item label-width="25px">
            <slot></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import ErrorHandlerMixin from './ErrorHandlerMixin'

export default {
  props: {
    proto: {
      type: Object
    }
  },
  
  mixins:[ErrorHandlerMixin],

  mounted(){
    this.init();
  },

  data(){
    return {
      submitForm: {
        stopCity: '',
        stopDate: ''
      },
      rules: {
        stopCity: [{ 
          validator: this.simpleValidator, 
          message: '经停城市不能为空', trigger: 'blur' 
        }],
        stopDate: [{ 
          validator: this.simpleValidator,
          message: '经停时间不能为空', trigger: 'blur' 
        }],
      },
    }
  },

  methods: {

 
    init(){
      this.checkProto= this.$deepCopy(this.proto);
      Object.keys(this.proto).forEach(attr => this.submitForm[attr]= this.proto[attr]);
    },


    checkHasChange(){
      let bol= !this.$checkLooseEqual(this.submitForm, this.checkProto);
      console.log(`ext-stopover-bar checkHasChange: ${bol}`)
      return bol;
    },

 
    validate(){
      this.$refs.submitForm.validate((valid) => {
        return valid;
      })
    },

   
    getFormData(){
      return this.submitForm;
    }
  }
}
</script>