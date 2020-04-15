<template>
  <div style="padding: 40px 0 40px 0; border-bottom: 1px solid #cecece;">
    <el-form
      label-width="120px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules">
      <el-form-item label="订单来源：" prop="orderChannel">
        <el-radio-group v-model="submitForm.orderChannel">
          <el-radio :label="3">线下直客</el-radio>
          <el-radio :label="1">商户（同业、门店）</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="submitForm.orderChannel=== 1">
        <el-form-item label="商户名称：" prop="merchant">
          <el-autocomplete size="small" style="width: 300px;" placeholder="输入商户名称"
            v-model="submitForm.merchant"
            :fetch-suggestions="getMerchantAction"
            :trigger-on-focus="false">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="销售：" prop="indirectSaler">
          <el-input size="small" style="width: 300px;" placeholder="输入销售名称"
            v-model="submitForm.indirectSaler">
          </el-input>
        </el-form-item>
        <el-form-item label="商户销售：" prop="replaceSaler">
          <el-autocomplete size="small" style="width: 300px;" placeholder="输入商户销售名称"
            v-model="submitForm.replaceSaler"
            :fetch-suggestions="getReplaceSalerAction"
            :trigger-on-focus="false"
            @select="selectSupplier">
          </el-autocomplete>
        </el-form-item>
      </template>
      <el-form-item label="销售：" prop="indirectSaler">
        <el-input size="small" style="width: 300px;" placeholder="输入销售名称"
          v-model="submitForm.indirectSaler">
        </el-input>
      </el-form-item>
      <el-form-item label="价格选择：" prop="priceType" style="margin:0;">
        <el-radio-group v-model="submitForm.priceType">
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
        submitForm: {
          // indirectSale: 0, // 同业(商户)销售 userCode
          // replacesale: 0, // 销售 id
          orderChannel: 3,
          merchant: null,
          indirectSaler: null,
          replaceSaler: null,
          priceType: 1
        },
        rules: {}
      },
      {
        merchantOptions: [],
        replaceSalerOptions: [],
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

      selectSupplier(){},

      getMerchantAction(selName, cb) {
        this.$http.post(this.GLOBAL.serverSrc + "/universal/localcomp/api/listname", {
          object: {
            selName,
            isDeleted: 0,
            state: 2
          }
        })
        .then(res => {
          let { objects, isSuccess }= res.data;
          if(!isSuccess){
            this.merchantOptions= [];
          } else {
            this.merchantOptions= objects.map(item => {
              return { 
                id: item.id, 
                value: item.name,
                settlementType: item.settlementType,  // 结算方式
                deposit: item.deposit, // 预存款
                balance: item.balance, // 剩余额度
              };
            });
          }
          cb(this.merchantOptions);
        })
      },

      getMerchant(){
        if(!this.submitForm.merchant || this.merchantOptions.length=== 0) {
          this.$message.warning('请先输入商户名称');
          return;
        }
        return this.merchantOptions.find(merchant => merchant.value=== this.submitForm.merchant);
      },

      getReplaceSalerAction(str, cb) {
        let merchant= this.getMerchant();
        if(!merchant) return cb([]);
        this.$http.post(this.GLOBAL.serverSrc + "/universal/localcomp/api/PeerUser_AdminList", {
          object: {
            localCompID: merchant.id,
            jqUserType: 2,
            state:2,
            isDeleted:0
          }
        })
        .then(res => {
          let { objects, isSuccess }= res.data;
          if(!isSuccess){
            this.replaceSalerOptions= [];
          } else {
            this.replaceSalerOptions= objects.map(item => {
              return { id: item.id, value: item.name, userCode: item.userCode };
            });
          }
          cb(this.replaceSalerOptions);
        })
      }
    }
  )

}
</script>