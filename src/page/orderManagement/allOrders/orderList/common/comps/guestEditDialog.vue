<style scoped>
.w200 {
  width: 200px;
}
</style>

<template>
  <!--填写游客信息-->
  <el-dialog class="city_list" width="700px" height="500px"
    :title="'出行人信息（'+ title +'）'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close">
    <el-form ref="submitForm"
      :model="submitForm"
      :rules="rules">
      <el-form-item label="中文姓名" prop="cnName" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.cnName" class="w200 fl"></el-input>
      </el-form-item>
      <el-form-item label="英文姓名" prop="enName" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.enName" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex" label-width="110px" class="fl" style="width:310px">
        <el-radio-group v-model="submitForm.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="电话" prop="mobile" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.mobile" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="idCard" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.idCard" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="出生日期" prop="bornDate" label-width="110px" class="fl">
        <el-date-picker v-model="submitForm.bornDate" type="date" placeholder="选择日期" class="w200"></el-date-picker>
      </el-form-item>
      <el-form-item label="证件类型" prop="credType" label-width="110px" class="fl">
        <el-select v-model="submitForm.credType" placeholder="请选择">
          <el-option label="请选择" :value="0" />
          <el-option label="护照" :value="1" />
          <el-option label="港澳通行证" :value="2" />
          <el-option label="军官证" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="credCode" label-width="110px" class="fl">
        <el-input type="text" v-model="submitForm.credCode" class="w200"></el-input>
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
        cnName: null,
        enName: null,
        sex: 0,
        mobile: null,
        idCard: null,
        bornDate: 0,
        credType: 0,
        credCode: null,
      },
      rules: {
        //变更数量
        price: [{ required: true, message: "请选择价格", trigger: "change" }],
        contactName: [
          { message: "联系人不能为空", trigger: "blur" },
          { max: 20, message: "不能超过20位长度", trigger: "blur" }
        ],
        contactPhone: [
          { message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            message: "电话号格式不正确",
            trigger: "blur"
          },
          { max: 20, message: "不能超过20位长度", trigger: "blur" }
        ],
        otherCost: [
          {
            pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/,
            message: "必须为数字值，并且不允许是负数"
          }
        ],
        //游客信息
        cnName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        enName: [
          { required: true, message: "请输入姓（拼音）", trigger: "blur" },
          {
            pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/,
            message: "姓（拼音）格式不正确",
            trigger: "blur"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        idCard: [
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