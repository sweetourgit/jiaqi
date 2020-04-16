<template>
<el-dialog title="编辑" width="600px"
  ref="dialogRef" 
  :visible="state"
  :close-on-click-modal="false"
  :before-close="handleClose">
  <div style="width: 480px;">
    <el-form
      size="small"
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules"
      @validate="hasChanged= true">

      <el-form-item label="姓名：" prop="name">
        <el-input placeholder="请输入姓名" style="width: 360px;"
          v-model="submitForm.name">
        </el-input>
      </el-form-item>

      <el-form-item label="护照：" prop="passport">
        <el-input placeholder="请输入护照" style="width: 360px;"
          v-model="submitForm.passport">
        </el-input>
      </el-form-item>

      <el-form-item label="电话：" prop="tel">
        <el-input placeholder="请输入电话" style="width: 360px;"
          v-model="submitForm.tel">
        </el-input>
      </el-form-item>

      <el-form-item label="身份证：" prop="id_card">
        <el-input placeholder="请输入身份证" style="width: 360px;"
          v-model="submitForm.id_card">
        </el-input>
      </el-form-item>

      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="submitForm.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" style="display: flex; justify-content: flex-end; padding-top: 20px;">
      <el-button size="small" 
        @click="handleClose">
        取 消
      </el-button>
      <el-button size="small" type="primary"
        @click="submitHandler">
        保 存
      </el-button>
    </div>
  </div>
</el-dialog>
</template>

<script>
import { getCabinGuestDTO } from '../../dictionary'

let cache;
export default {

  data(){
    return {
      state: false,
      hasChanged: false,
      submitForm: getCabinGuestDTO(),
      rules: {
        name: { pattern: /\S/, message:'请输入10字以内的正确名称,含汉字、字母和数字', trigger: 'blur' },
        passport: { pattern: /\S/, message:'护照格式不正确', trigger: 'blur' },
        tel: { pattern: /\S/, message:'护照格式不正确', trigger: 'blur' },
        id_card: { pattern: /\S/, message:'护照格式不正确', trigger: 'blur' },
        sex: { pattern: /\S/, message:'护照格式不正确', trigger: ['blur', 'change'] },
      }
    }
  },

  methods: {
    
    awake(guest){
      this.state= true;
      this.$assign(this.submitForm, guest);
      cache= guest;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.$refs.submitForm.clearValidate();
      cache= null;
      this.state= false;
      this.hasChanged= false;
    },

    submitHandler(){
      this.$refs.submitForm.validate(bol => {
        if(!bol) return;
        if(this.hasChanged) this.$assign(cache, this.submitForm, true);
        this.handleClose();
      })
    }
  }
}
</script>