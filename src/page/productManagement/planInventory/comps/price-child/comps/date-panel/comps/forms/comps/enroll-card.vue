<style lang="scss" scoped>
.red /deep/ input{
  color: red !important;
}
</style>

<template>
  <el-card style="width: 380px;flex-shrink: 0; margin: 0 20px 20px 0; background-color: #f6f6f6;"
    shadow="never">
    <div slot="header">
      <span>{{ submitForm.enrollName }}</span>
      <slot></slot>
      <el-button style="float: right; padding: 3px 0;margin-right: 10px;" type="text" @click="quotaHandler">
        {{ vm.hasQuota? '删除配额': '配额' }}
      </el-button>
    </div>
    <div>
      <el-form
        label-width="130px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-form-item label="销售价：" prop="price_01" style="width: 320px">
          <el-input size="small"
            :class="[ isRed(submitForm.price_01)?'red': '' ]"
            :placeholder="'成本均价:'+ average" 
            v-model="submitForm.price_01">
          </el-input>
        </el-form-item>
        <el-form-item label="同业价：" prop="price_02" style="width: 320px">
          <el-input size="small"
            :class="[ isRed(submitForm.price_02)?'red': '' ]"
            :placeholder="'成本均价:'+ average"
            v-model="submitForm.price_02">
          </el-input>
        </el-form-item>
        <el-form-item label="甜程结算价：" prop="price_03" style="width: 320px">
          <el-input placeholder="甜程结算价" size="small"
            v-model="submitForm.price_03">
          </el-input>
        </el-form-item>
        <el-form-item label="甜程线上售价：" prop="price_04" style="width: 320px">
          <el-input placeholder="甜程线上售价" size="small" disabled
            v-model="submitForm.price_04">
          </el-input>
        </el-form-item>
        <el-form-item label="配额：" prop="quota" style="width: 320px">
          <el-input placeholder="配额" size="small" :disabled="!vm.hasQuota"
            v-model="submitForm.quota">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {

  props: {
    proto: Object,
    average: [String, Number]
  },

  created(){
    this.init();
  },

  data(){
    return {
      vm: {
        hasQuota: false
      },
      submitForm: {},
      rules: {
        price_01: [
          { required: true, message: '销售价不能为空', trigger: ['change', 'blur']},
          { required: true, validator: this.moneyValidator, trigger: ['change', 'blur']},
        ],
        price_02: [
          { required: true, message: '同业价不能为空', trigger: ['change', 'blur']},
          { required: true, validator: this.moneyValidator, trigger: ['change', 'blur']},
        ],
        price_03: [
          { required: true, message: '甜程结算价不能为空', trigger: ['change', 'blur']},
          { required: true, validator: this.moneyValidator, trigger: ['change', 'blur']},
        ]
      }
    }
  },

  methods: {
    init(){
      this.submitForm= this.$deepCopy(this.proto);
      if(this.proto.quota) this.vm.hasQuota= true;
    },

    // 配额
    quotaHandler(){
      this.vm.hasQuota= !this.vm.hasQuota;
      if(!this.vm.hasQuota) this.submitForm.quota= void 0;
    },

    validate(){
      let bol= true;
      this.$refs.submitForm.validate(validate => {
        bol= validate;
      })
      return bol;
    },

    getData(){
      return this.$deepCopy(this.submitForm);
    },

    hasChange(){
      return !this.$checkLooseEqual(this.submitForm, this.proto);
    },

    moneyValidator(rule, value, cb){
      let reg= /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
      if(reg.test(value)) return cb();
      cb(new Error('请输入正确的价格格式，最多两位小数'));
    },

    // 根据均价和输入价判断是否标红
    isRed(val){
      val= parseFloat(val);
      if(val=== isNaN) return false;
      return val< parseFloat(this.average);
    },
  }
}
</script>