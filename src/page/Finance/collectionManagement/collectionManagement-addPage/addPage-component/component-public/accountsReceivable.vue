<template>
  <el-dialog title="选择账户" :append-to-body="true" :visible.sync="getCollection.accountShow" width="70%" custom-class="city_list">
    <div style="overflow:hidden;">
      <el-table :data="getCollection.accountTable" border style="width: 100%" :header-cell-style="getRowClass" @row-click="clickPlan">
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="cardType" label="类型" align="center"></el-table-column>
        <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
        <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
        <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
        <el-table-column prop="openingName" label="开户人" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="chooseAccount(scope.$index, scope.row)"  class="table_details">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  export default{
    data(){
      return {

      }
    },
    computed:{
      //获取收款人列表
      ...mapGetters('collectionManagement',{getCollection:'getCollection'}),
    },
    methods:{
      //获取背景表头颜色
      ...mapMutations('collectionManagement',{getRowClass:'getRowClass'}),
      //在这里主要是用于关闭模态框
       ...mapMutations('collectionManagement',{setCollection:'setCollection'}),
       //获取点击列表数据
      clickPlan(row){
        this.$emit('clickPlan',row)
      },
      // 收款账户列表 点击选择
      chooseAccount(index, row) {
        this.$emit('chooseAccount',index,row)
         this.handleClose()
      },
      handleClose(){
        let collection={
          accountShow:false,
          accountTable:[]
        }
        this.setCollection(collection)
      }
    }
  }
</script>

<style>
</style>
