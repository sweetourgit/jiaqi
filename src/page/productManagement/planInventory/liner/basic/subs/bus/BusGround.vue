<style lang="scss" scoped>
.bus-ground{
  margin-bottom: 75px;
  header {
    font-weight: bold;
    font-size: 24px;
    line-height: 2;
  }
}
</style>

<template>
  <div class="bus-ground">
    <header>
      大巴车
    </header>
    <main>
      <el-table border style="width: 100%"
      :data="tableData" 
      :highlight-current-row="false"
      header-row-class-name="row-header">
        <el-table-column label="标题" prop="id" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="城市" prop="sign" header-align="center" align="center"></el-table-column>
        <el-table-column label="集合地点" prop="uptoDay" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="价格说明" prop="uptoDay" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="售卖价格" prop="quota" header-align="center" align="center" width="300">
          <template slot-scope="scope">
            <TableInputer
              v-model="scope.row.name"
              :options="priceOptions"
              table="bus"
              column="price">
              {{ scope.row }}
            </TableInputer>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="quota" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text"
              @click="openDetailer(scope.row)">
              详情
            </el-button>
            <el-button type="text"
              @click="openPrice('bus', 'price', scope.$index)">
              价格
            </el-button>
            <el-button type="text">
              上线
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <BusDetailer ref="detailer"></BusDetailer>
    </footer>
  </div>
</template>

<script>
// import TableInputer from './comps/TableInputer'
import { TableInputer, manager as TableInputerManager } from './comps/TableInputer/index'
import BusDetailer from './comps/BusDetailer'

export default {

  components: { TableInputer, BusDetailer },

  data(){
    return {
      tableData: [{ id: 123, name: 32 }],
      priceOptions: {
        placeholder: '请输入价格',
        pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
        message: '价格格式输入错误',
        adaptor: (val) => parseFloat(val)
      }
    }
  },

  methods: {
    openPrice(table, column, index){
      let vm= TableInputerManager.getVm(table, column, index);
      vm.focus();
    }
  }

}
</script>
