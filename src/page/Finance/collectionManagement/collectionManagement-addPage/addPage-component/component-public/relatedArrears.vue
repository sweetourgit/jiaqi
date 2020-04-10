<template>
  <div>
    <el-table :data="arrearsList" border :header-cell-style="getRowClass">
      <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="proName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="departure" label="出发日期" align="center"></el-table-column>
      <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="arrears_Amount" label="欠款金额" align="center"></el-table-column>
      <el-table-column prop="audited_Amount" label="待审金额" align="center"></el-table-column>
      <el-table-column prop="repayment_Amount" label="已还金额" align="center"></el-table-column>
      <el-table-column label="匹配收款金额" align="center" width="180">
        <template slot-scope="scope">
          <el-input-number :controls="false" size="small" v-model="scope.row.matchingMoney" :disabled="scope.row.isDisabled"
            placeholder="匹配收款金额" @blur="handleCollectionPrice"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  export default {
    props:['arrearsList'],
    computed: {
      ...mapGetters('collectionManagement', {
        getArrearsList: 'getArrearsList'
      }),
    },
    methods:{
      ...mapMutations('collectionManagement',{getRowClass:'getRowClass'}),
      //匹配收款金额 失去焦点计算总计
      handleCollectionPrice(){
        this.$emit('handleCollectionPrice')
      }
    }
  }
</script>

<style>
</style>
