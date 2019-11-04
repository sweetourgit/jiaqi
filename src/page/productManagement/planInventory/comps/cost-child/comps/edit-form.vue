<template>
  <el-dialog :title="vm.isAdd? '新增成本': '编辑成本'" width="650px"
    ref="dialogRef" 
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
        <el-form-item label="供应商：" prop="name">
          <el-input placeholder="请输入供应商名称" size="small"
            v-model="submitForm.name">
          </el-input>
        </el-form-item>
        <el-form-item label="成本类型：" prop="suppliertype">
          <el-select v-model="submitForm.suppliertype" placeholder="成本类型" size="small" style="width: 100%;">
            <el-option
              v-for="item in SUPPLIER_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="金额：" prop="money">
          <el-input placeholder="请输入金额" size="small"
            v-model="submitForm.money">
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
import { SUPPLIER_TYPE_OPTIONS } from '../../../dictionary'

export default {

  data(){
    return Object.assign({
      vm: {
        state: false,
        // 是否是新增
        isAdd: false
      },
      submitForm: {
        name: '',
        suppliertype: null,
        money: null
      },
      rules: {
        name: [
          { required: true, message: '供应商不能为空', trigger: ['blur']},
        ],
        suppliertype: [
          { required: true, message: '成本类型不能为空', trigger: ['blur']},
        ],
        money: [
          { required: true, message: '金额不能为空', trigger: ['blur']},
          { required: true, validator: this.moneyValidator, trigger: ['blur']},
        ]
      }
    }, { SUPPLIER_TYPE_OPTIONS })
  },

  methods: {

    editInit(pac){
      let { supplierType, name, money }= pac;
      Object.assign(this.submitForm, { suppliertype: supplierType, name, money });
      this.checkProto= pac;
      this.vm.isAdd= false;
      this.vm.state= true;
    },

    addInit(packageID){
      this.packageID= packageID;
      this.vm.isAdd= true;
      this.vm.state= true;
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.vm.state= false;
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
      return new Promise((resolve, reject) => {
        this.$refs.submitForm.validate(validate => {
          if(!validate) reject();
          let copy= this.$deepCopy(this.submitForm);
          if(this.vm.isAdd){
            let newCost= this.getCostDTO(this.packageID);
            Object.assign(newCost, copy);
            //newCost.money= parseFloat(newCost.money);
            copy= newCost;
          }
          if(!this.vm.isAdd){
            let { id, supplierType, name, money }= this.checkProto;
            // 查看数据是否发生了变化
            if(this.$checkLooseEqual(this.submitForm, { suppliertype: supplierType, name, money })) reject();
            //copy.money= parseFloat(copy.money);
            copy.id= id;
          }
          resolve(copy);
        })
      })
    },

    getCostDTO(packageID){
      return {
        id: 0,
        code: 'string',
        createTime: 0,
        createUser: 'string',
        packageID,
        supplierID: 0
      }
    },

    addAction(){
      this.getSubmitDate().then(object => {
        this.vm.isAdd? 
          this.$emit('add-action', object): this.$emit('edit-action', object);
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