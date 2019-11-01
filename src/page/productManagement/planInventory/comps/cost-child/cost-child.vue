<style lang="scss" scoped>
.cost-child{
  &>header{
    position: relative;
    padding-bottom: 20px;
    .rate, .average{
      display: inline-block;
    }
    .average{
      margin-left: 50px;
    }
    .btn{
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>

<template>
  <div class="cost-child">
    <header>
      <div class="rate">
        <span>毛利率：</span>
        <el-input size="small" placeholder="毛利率" style="width: 100px;" 
          v-model="vm.rate"
        ></el-input>
        <span>%</span>
      </div>
      <div class="average">
        <span>人均结算价：{{ vm.average }} 元</span>
      </div>
      <div class="btn">
        <el-button type="primary" size="small">添加成本</el-button>
      </div>
    </header>
    <main>
      <el-table border style="width: 100%"
        :data="tableData" 
        :highlight-current-row="false"
      >
        <el-table-column label="ID" prop="id" header-align="center" align="center"></el-table-column>
        <el-table-column label="成本类型" prop="supplierTypeEX" header-align="center" align="center"></el-table-column>
        <el-table-column label="供应商" prop="name" header-align="center" align="center"></el-table-column>
        <el-table-column label="金额（元）" prop="money" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import { getAverage, getCostList } from '../../planInventory'

export default {

  data(){
    return {
      vm: {
        rate: null,
        average: 0,
      },
      tableData: []
    }
  },

  methods: {
    init(payload){
      let { id, rate }= payload;
      this.vm.rate= rate;
      this.getAverageAction(id);
      this.getCostListAction(id);
    },

    getAverageAction(id){
      getAverage(id).then(res => {
        this.vm.average= res;
      })
    },

    getCostListAction(id){
      getCostList(id).then(res => {
        this.tableData.splice(0);
        this.tableData.push(...res);
      })
    }
  }

}
</script>