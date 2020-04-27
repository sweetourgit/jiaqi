<template>
  <el-dialog title="添加共享库存" width="650px" 
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
        <el-form-item label="日期：" prop="date">
          <el-date-picker type="date" placeholder="选择日期" size="small" style="width: 100%;"
            v-model="submitForm.date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="库存名称：" prop="name">
          <el-input placeholder="库存名称" size="small" maxlength="20" show-word-limit
            v-model="submitForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="库存：" prop="count">
          <el-input placeholder="库存" size="small"
            v-model="submitForm.count">
          </el-input>
        </el-form-item>
        <el-form-item label="人均成本：" prop="averageCost">
          <el-input placeholder="人均成本，精确到小数点后两位" size="small"
            v-model="submitForm.averageCost">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addAction">添 加</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { inventoryinsertAction } from '../api'

export default {

  data(){
    return {
      vm: {
        state: false
      },
      submitForm: {
        date: null,
        name: '',
        count: '',
        averageCost: ''
      },
      rules: {
        date: { required: true, validator: this.dateValidator, trigger: ['blur', 'change']},
        name: { required: true, message: '请填写库存名称', trigger: ['blur']},
        count: [
          { required: true, message: '请填写库存', trigger: ['blur']},
          { required: true, validator: this.positiveIntegerValidator, trigger: ['blur']},
        ],
        averageCost: [
          { required: true, message: '请填写人均成本', trigger: ['blur']},
          { required: true, validator: this.moneyValidator, trigger: ['blur']},
        ]
      }
    }
  },

  methods: {
    handleOpen(date){
      this.submitForm.date= date;
      this.vm.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.vm.state= false;
    },

    dateValidator(rule, value, cb){
      if(!value) return cb(new Error('请选择日期'));
      let now= new Date();
      now= new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if(value< now) return cb(new Error('选择日期已过时'));
      cb()
    },

    positiveIntegerValidator(rule, value, cb){
      let reg= /^(0|[1-9][0-9]*)$/;
      if(reg.test(value)) return cb();
      cb(new Error('库存必须为正整数'));
    },

    moneyValidator(rule, value, cb){
      let reg= /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if(reg.test(value)) return cb();
      cb(new Error('请输入正确的价格格式，最多两位小数'));
    },


    getSubmitDate(){
      let copy;
      this.$refs.submitForm.validate(validate => {
        if(!validate) return;
        let staticObj= { share: 1, orgID: 0 };
        let { date }= this.submitForm;
        let dateInt= date.getFullYear()* 10000+ 
                      (date.getMonth()+ 1)* 100+
                        date.getDate();
        copy= Object.assign(this.$deepCopy(this.submitForm), staticObj);
        copy.date= dateInt;
        copy.count= parseFloat(copy.count);
        copy.averageCost= parseFloat(copy.averageCost);
      })
      return copy;
    },

    addAction(){
      let object= this.getSubmitDate();
      if(!object) return;
      inventoryinsertAction.bind(this)(object).then(res => {
        this.$message.success('库存新增成功');
        return this.afterAddAction(res);
      }).catch(err => {
        this.$message.error(err);
      })    
    },

    afterAddAction(id){
      let date= this.submitForm.date;
      this.handleClose();
      this.$nextTick(() => {
        this.$emit('add-callback', { date, id });
      })
    },
  }
}
</script>