<template>
  <div style="padding: 40px 0 40px 0; border-bottom: 1px solid #cecece;">
    <el-form label-width="120px">
      <el-form-item label="订单来源：">
        <el-radio-group v-model="order_channel">
          <el-radio :label="3">线下直客</el-radio>
          <el-radio :label="1">商户（同业、门店）</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <component
      :is="'child'+ order_channel">
    </component>
  </div>
</template>

<script>


export default {

  data(){
    return {
      order_channel: null
    }
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