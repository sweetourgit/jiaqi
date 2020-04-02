<template>
  <div style="padding-top: 42px;">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules">
      <el-form-item label="订单来源：" prop="name" ref="supplierRef">
        <el-radio-group v-model="submitForm.line_status">
          <el-radio :label="1">线下直客</el-radio>
          <el-radio :label="2">商户（同业、门店）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商户名称：" prop="name" ref="supplierRef">
        <el-autocomplete size="small" style="width: 300px;" placeholder="输入供应商名称"
          v-model="submitForm.name"
          :fetch-suggestions="getSupplierAction"
          :trigger-on-focus="false"
          @select="selectSupplier">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="商户名称：" prop="name" ref="supplierRef">
        <el-input size="small" style="width: 300px;" placeholder="输入供应商名称"
          v-model="submitForm.name">
        </el-input>
      </el-form-item>
      <el-form-item label="商户销售：" prop="name" ref="supplierRef">
        <el-autocomplete size="small" style="width: 300px;" placeholder="输入供应商名称"
          v-model="submitForm.name"
          :fetch-suggestions="getSupplierAction"
          :trigger-on-focus="false"
          @select="selectSupplier">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="价格选择：" prop="name" ref="supplierRef">
        <el-radio-group v-model="submitForm.line_status">
          <el-radio :label="1">线下直客</el-radio>
          <el-radio :label="2">商户（同业、门店）</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {

  data(){
    return Object.assign(
      {
        submitForm: {},
        rules: {}
      },
      {

      }
    )
  },

  methods: Object.assign(
    {

    },

    // 补全
    {
      getSupplierAction(name, cb){
        let payload= {
          name,
          UserState: -1,
          SupplierType: -1
        }
        getSupplierlist(payload)
        .then(suppliers => {
          this.suppliersOptions= suppliers;
          cb(suppliers.map(supplier => {
            return { 
              id:supplier.id, 
              value: supplier.name 
            }
          }));
        })
        .catch(err => {
          console.log(err);
          cb([]);
        })
      },

      selectSupplier(supplier){
        let { id }= supplier;
        this.submitForm.supplierID= id;
        this.$refs.supplierRef.validate();
      },
    }
  )

}
</script>