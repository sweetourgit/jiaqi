<style>
.w200 {
  width: 200px;
}
</style>

<template>
  <!--填写游客信息-->
  <el-dialog class="city_list" width="700px" height="500px"
    title="出行人信息"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close">
    <el-form ref="submitForm"
      :model="submitForm"
      :rules="rules">
      <el-form-item label="姓名" prop="NGDName" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.NGDName" class="w200 fl"></el-input>
      </el-form-item>
       <el-form-item label="报名类型" prop="NGDType" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.NGDType" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="护照" prop="NGDPassport" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.NGDPassport" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="NGDCard" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.NGDCard" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="NGDTel" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.NGDTel" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="NGDSex" label-width="110px" class="fl" style="width:310px">
        <el-radio-group v-model="submitForm.NGDSex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
     
   
      
      
     
      <!-- <el-form-item label="证件有效期" prop="credTOV" label-width="110px" class="fl">
        <el-date-picker v-model="conForm.credTOV" type="date" placeholder="选择日期" class="w200"></el-date-picker>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer cb">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitFormData">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      title: null,
      visible: false,
      submitForm: {
        NGDName:null,//名字
        NGDType:null,//类型
        NGDPassport:0,//护照
        NGDCard:0,//身份证
        NGDTel:0,//电话
        NGDSex:0,//男女
      },
      rules: {
         
        //游客信息
        NGDName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        NGDPassport:[{required:true,message:'请输入护照号',trigger:'blur' }],
        NGDSex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        NGDTel: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        NGDCard: [
          // { required: true, message: "身份证号不能为空", trigger: "blur" },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "身份证号格式不正确",
            trigger: "blur"
          }
        ]
      }
    }
  },

  mounted(){
    window.currentForm= this.submitForm;
  },

  methods: {
    wakeup(guest){
      console.log(guest,'发发');
      Object.assign(this.submitForm, guest);
      // Object.assign(this.submitForm, {
      //   cnName: '丁丁',
      //   enName: 'dingding',
      //   sex: 1,
      //   mobile: 15710560343,
      //   idCard: 211403198904228211
      // })
      this.proto= guest;
      this.visible= true;
      this.title= guest.enrollName;
    },
    
    submitFormData(){
      this.$refs.submitForm.validate(validate => {
        if(!validate) return this.$message.error('请完善表单信息');
        this.$emit('save-guest', { guest: this.proto, formData: this.$deepCopy(this.submitForm) });
        this.close();
      })
    },

    close(){
      this.$refs.submitForm.resetFields();
      this.visible= false;
    },
  }
}
</script>