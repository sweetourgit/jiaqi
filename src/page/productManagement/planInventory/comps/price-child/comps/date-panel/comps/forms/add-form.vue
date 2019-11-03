<template>
  <el-dialog title="新增库存" width="1260px"
    :visible="vm.state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="width: 100%;">
      <div>
        <el-form
          label-width="120px" 
          ref="submitForm"
          :model="submitForm"
          :rules="rules"
        >
          <el-form-item label="库存类型：" prop="share">
            <el-radio-group v-model="submitForm.share" size="small">
              <el-radio :label="2">非共享</el-radio>
              <el-radio :label="1">共享</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="共享库存：" prop="night">
            <el-select v-model="submitForm.crowdID" type="date" placeholder="最高" style="width: 400px;" size="small">
              <el-option
                v-for="item in 24"
                :key="item"
                :label="item+ '小时'"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总库存：" prop="count">
            <el-input size="small" style="width: 400px;" placeholder="请输入总库存"
              v-model="submitForm.count"
            ></el-input>        
          </el-form-item>
          <el-form-item label="预留时长：" prop="night">
            <el-select v-model="submitForm.crowdID" type="date" placeholder="最高" style="width: 400px;" size="small">
              <el-option
                v-for="item in 24"
                :key="item"
                :label="item+ '小时'"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="padding:0 20px;">
        <el-button type="primary" size="small">新增</el-button>
      </div>
      <div style="width: 100%; overflow: auto; padding: 20px; box-sizing: border-box;">
        <div style="display: flex;">
          <plan-card></plan-card>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addAction">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import planCard from './comps/plan-card'

export default {
  components: { planCard },

  props: {
    proto: Object
  },

  data(){
    return {
      vm: {
        state: true,
        share: 2
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

      this.vm.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.vm.state= false;
    },

    positiveIntegerValidator(rule, value, cb){
      let reg= /^(0|[1-9][0-9]*)$/;
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
      return copy? Object.assign(this.$deepCopy(this.proto), copy): copy;
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