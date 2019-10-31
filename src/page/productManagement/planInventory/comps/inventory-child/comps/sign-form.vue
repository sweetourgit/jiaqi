<template>
  <el-dialog title="设置团号" width="650px" 
    :visible="vm.state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 550px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-row>
          <el-col style="width: 290px;">
            <el-form-item ref="prefixRef" label="团号：" prop="codePrefix">
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
            <el-input placeholder="请输入清位天数" size="small"
              v-model="submitForm.uptoDay">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addAction">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveShort, codeIsExist } from '../../../planInventory'
import { reject } from 'q';


export default {

  data(){
    return {
      vm: {
        state: false
      },
      submitForm: {
        codePrefix: '',
        codeSuffix: '',
        uptoDay: 0
      },
      rules: {
        codePrefix: [
          { required: true, message: '请填写团号前缀', trigger: ['blur']},
          { required: true, validator: this.codeValidator, trigger: ['blur']},
        ],
        codeSuffix: [
          { required: true, message: '请填写团号后缀', trigger: ['blur']},
          { required: true, validator: this.codeValidator, trigger: ['blur']},
        ],
        uptoDay: { validator: this.positiveIntegerValidator, trigger: ['change']},
      }
    }
  },

  methods: {
    handleOpen(pac){
      let { id, codePrefix, codeSuffix, uptoDay }= pac;
      this.submitForm.id= id;
      this.submitForm.codePrefix= codePrefix;
      this.submitForm.codeSuffix= codeSuffix;
      this.submitForm.uptoDay= uptoDay;
      this.vm.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.vm.state= false;
    },

    codeValidator(rule, value, cb){
      let { id, codePrefix, codeSuffix }= this.submitForm;
      if(!codePrefix || !codeSuffix) return cb();
      this.$refs.prefixRef.clearValidate();
      this.$refs.suffixRef.clearValidate();
      codeIsExist({ id, codePrefix, codeSuffix }).then(() => {
        cb();
      }).catch((err) => {
        console.log(err)
        cb(new Error('团号重复'))
      })
    },

    positiveIntegerValidator(rule, value, cb){
      let reg= /^(0|[1-9][0-9]*)$/;
      if(reg.test(value)) return cb();
      cb(new Error('清位天数必须为正整数'));
    },

    /**
     * @description: 先验证，不通过返回false，通过则将submit变形成提交的格式 
     */
    getSubmitDate(){
      return new Promise((resolve, reject) => {
        this.$refs.submitForm.validate(validate => {
          if(!validate) reject();
          let copy= this.$deepCopy(this.submitForm);
          copy.uptoDay= parseInt(copy.uptoDay || 0);
          resolve(copy);
        })
      })
    },

    addAction(){
      this.getSubmitDate().then(object => {
        saveShort(object).then(res => {
          this.$message.success('库存新增成功');
          return this.afterAddAction();
        }).catch(err => {
          this.$message.error(err);
        }) 
      });
    },

    afterAddAction(){
      this.handleClose();
      this.$nextTick(() => {
        this.$emit('action-callback');
      })
    },
  }
}
</script>