<style lang="scss" scoped>
.list-page{
  height: 100%; 
  overflow: auto;
}
</style>

<template>
  <div class="list-page">
    <ListHeader ref="conditionGround"></ListHeader>
    <main>
      <div style="padding-top: 20px;">
        <el-table border size="small" style="width: 100%"
          :data="tableData" 
          :highlight-current-row="false"
          header-row-class-name="row-header">
          <el-table-column label="标题" prop="tour_no" header-align="center" align="center"></el-table-column>
          <el-table-column label="状态" header-align="center" align="center" width="80">
            <template slot-scope="scope">{{ PLAN_STATUS.getLabel(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column label="产品名称" prop="min_stay" header-align="center" align="center"></el-table-column>
          <el-table-column label="出行日期" header-align="center" align="center" width="240">
            <el-table-column label="状态" header-align="center" align="center">
              <span slot-scope="scope">{{ scope.row.set_out_year+ '-'+ scope.row.set_out_month+ '-'+ scope.row.set_out_day }}</span>
            </el-table-column>
          </el-table-column>
          <el-table-column label="报账状态" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column label="报账状态" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column label="报账状态" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column label="报账状态" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column label="报账状态" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small"
                :disabled="parentState=== 'readonly'"
                @click="awakeEditor(scope.row)">
                编辑
              </el-button>
              <el-button type="text" size="small"
                :disabled="parentState=== 'readonly'"
                @click="removePrice(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
  </div>  
</template>

<script>
import ListHeader from './comps/ListHeader'
import { PLAN_STATUS } from './dictionary'
import { getSkuPlanListPage } from './api'

export default {

  components: { ListHeader },

  mounted(){
    getSkuPlanListPage(this.$refs.conditionGround.getConditions())
    .then(res => {
      let { list, total }= res;
      this.tableData= list;
    })
  },

  data(){
    return {
      tableData: [],
      parentState: null,
      PLAN_STATUS
    }
  }

}
</script>