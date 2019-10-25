<template>
  <el-dialog
    title="编辑"
    :visible="vm.state"
    width="800px"
    :before-close="handleClose">
    <div style="width: 700px;">
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-form-item label="库存名称：" prop="name" style="width: 550px">
          <el-input placeholder="库存名称" size="small"
            v-model="submitForm.name">
          </el-input>
        </el-form-item>
        <el-row>
          <el-col style="width: 550px">
            <el-form-item label="库存：" prop="count">
              <el-input placeholder="库存" size="small"
                v-model="submitForm.count">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 150px">
            <el-form-item label="已售：" label-width="100px">{{ vm.saled }}</el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="人均成本：" prop="averageCost" style="width: 550px">
          <el-input placeholder="人均成本，精确到小数点后两位" size="small"
            v-model="submitForm.averageCost">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addAction">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateInventoryAction } from '../api'

export default {

  props: {
    proto: Object
  },

  data(){
    return {
      vm: {
        state: false,
        saled: 0
      },
      submitForm: {
        id: null,
        date: null,
        name: '',
        count: '',
        averageCost: ''
      },
      rules: {
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
      console.log(this.proto)
      Object.keys(this.submitForm).forEach(attr => this.submitForm[attr]= this.proto[attr]);
      this.vm.saled= this.proto.count- this.proto.left;
      this.submitForm.date= date;
      this.vm.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.vm.state= false;
    },

    positiveIntegerValidator(rule, value, cb){
      let reg= /^[1-9]\d*|0$/;
      if(!reg.test(value)) return cb(new Error('库存必须为正整数'));
      if(parseInt(value)< this.vm.saled) return cb(new Error('库存不能小于已售数量'));
      cb();
    },

    moneyValidator(rule, value, cb){
      let reg= /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if(reg.test(value)) return cb();
      cb(new Error('请输入正确的价格格式，最多两位小数'));
    },

    /**
     * @description: 先验证，不通过返回false，通过则将submit变形成提交的格式 
     */
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
      return Object.assign(this.$deepCopy(this.proto), copy);
    },

    addAction(){
      let object= this.getSubmitDate();
      if(!object) return;
      updateInventoryAction.bind(this)(object).then(res => {
        this.$message.success('库存修改成功');
        return this.afterAddAction(res);
      }).catch(err => {
        this.$message.error(err);
      })    
    },

    afterAddAction(id){
      let date= this.submitForm.date;
      this.vm.state= false;
      this.$nextTick(() => {
        this.$emit('add-callback', { date: this.submitForm.date, id });
      })
    },
  }
}
</script>