<template>
  <el-dialog :title="isSave? '编辑报账信息':'新增报账信息' " width="650px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules">

      <el-form-item label="供应商：" prop="supplier" ref="supplierRef">
        <el-autocomplete class="inline-input" size="small" style="width: 450px;" placeholder="输入供应商名称"
          v-model="submitForm.supplier"
          :fetch-suggestions="getSupplierAction"
          :trigger-on-focus="false"
          @select="selectSupplier">
        </el-autocomplete>
      </el-form-item>

      <el-form-item label="借款类型：">
        <el-input placeholder="请输入" size="small" style="width: 450px;" disabled
          v-model="type">
        </el-input>
      </el-form-item>

      <el-form-item label="借款金额：" prop="arrearsPrice">
        <el-input placeholder="请输入" size="small" style="width: 450px;"
          v-model="submitForm.arrearsPrice">
        </el-input>
      </el-form-item>

      <el-form-item label="人数：" prop="peopleCount">
        <el-input placeholder="请输入" size="small" style="width: 450px;"
          v-model="submitForm.peopleCount">
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" 
        @click="handleClose">
        取 消
      </el-button>
      <el-button type="primary" size="small" 
        @click="saveAction">
        保 存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getSupplierlist } from '../../../api'

export default {

  data(){
    return Object.assign(
      {
        state: false,
        isSave: false,
        supplierSelected: false,
      },
      {
        type: '地接',
        submitForm: {
          supplier: null,
          arrearsPrice: null,
          peopleCount: null
        },
        rules: {
          supplier: { required: true, validator: this.supplierValidator, message: '不存在或未选择供应商', trigger: 'change' },
          arrearsPrice: { required: true, pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格格式', trigger: 'blur' },
          peopleCount: { required: true, pattern: /^(0|[1-9][0-9]*)$/, message: '请输入正确的人数', trigger: 'blur' },
        }
      }
    )
  },

  methods: {
    
    wakeup(expense){
      this.isSave= !!expense;
      this.state= true;
      this.expenseCache= this.isSave? expense: this.getExpenseDTO();
      Object.keys(this.submitForm).forEach(attr => this.submitForm[attr]= this.expenseCache[attr]);
    },

    temporaryVariable(){
      this.expenseCache= null;
    },

    saveAction(){
      this.$refs.submitForm.validate(result => {
        if(!result) return;
        Object.keys(this.submitForm).forEach(attr => this.expenseCache[attr]= this.submitForm[attr]);
        this.expenseCache.arrearsPrice= parseFloat(this.expenseCache.arrearsPrice);
        this.expenseCache.price= this.expenseCache.arrearsPrice;
        this.$emit('save-action', {
          expense: this.expenseCache,
          isSave: this.isSave
        });
        this.handleClose();
      })
    },

    handleClose(){
      this.$refs.submitForm.resetFields();
      this.temporaryVariable();
      this.state= false;
    },

    getExpenseDTO(){
      return {
        title: '地接款',
        supplier: null,
        peopleCount: null,
        price: null,
        payPrice: 0,
        arrearsPrice: null,
        mark: null,
        expenseType: 1
      }
    },

    getSupplierAction(name, cb){
      this.supplierSelected= false;
      let payload= {
        name,
        UserState: -1,
        SupplierType: -1
      }
      getSupplierlist(payload)
      .then(suppliers => {
        cb(
          suppliers.filter(supplier => supplier.userState=== 1)
          .map(supplier => {
            return { 
              id:supplier.id, 
              value: supplier.name 
            }
          })
        )
      })
      .catch(err => {
        console.log(err);
        cb([]);
      })
    },

    selectSupplier(){
      this.supplierSelected= true;
    },

    supplierValidator(rule, value, cb){
      if(this.supplierSelected && this.submitForm.supplier) return cb();
      cb(new Error(rule.message));
    },
  }
}
</script>