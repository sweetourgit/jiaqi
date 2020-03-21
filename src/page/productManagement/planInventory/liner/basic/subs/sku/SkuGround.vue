<style lang="scss" scoped>
.sku-ground{
  margin-bottom: 75px;
  header {
    font-weight: bold;
    font-size: 24px;
    line-height: 2;
  }
}
</style>

<template>
  <div class="sku-ground">
    <header>SKU</header>
    <main>
      <el-table border style="width: 100%"
      :data="tableData" 
      :highlight-current-row="false"
      header-row-class-name="row-header">
        <el-table-column label="ID" prop="id" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="团期计划" header-align="center" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row | grounpCodeFilter }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="清位时间" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <span>
              {{ scope.row.clearance_time | clearanceTimeFilter }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="出行模板" prop="uptoDay" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <span>邮轮模板</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="quota" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text"
              @click="openEditor(scope.row)">
              修改
            </el-button>
            <el-button type="text"
              v-show="scope.row.sku_status >= SKU_PROCESS_STATUS.CAN_PRICE">
              价格
            </el-button>
            <el-button type="text"
              v-show="scope.row.sku_status >= SKU_PROCESS_STATUS.CAN_LINE"
              @click="changeSkuLineStatus(scope.row)">
              {{ scope.row.line_status=== SKU_LINI_STATUS.UP_LINE? '下线': '上线' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <SkuEditor ref="editor"></SkuEditor>
    </footer>
  </div>
</template>

<script>
import { SKU_PROCESS_STATUS, CLEARANCE_TIME_OPTIONS, SKU_LINI_STATUS } from '@/page/productManagement/planInventory/liner/dictionary'
import { skuOnlineOffline } from '@/page/productManagement/planInventory/liner/api'
import SkuEditor from './comps/SkuEditor'

export default {

  components: { SkuEditor },

  filters: {
    clearanceTimeFilter(clearanceTime){
      let result= CLEARANCE_TIME_OPTIONS.find(el => el.value=== clearanceTime);
      return result? result.label: '';
    },
    grounpCodeFilter(sku){
      let { tour_no_prefix, tour_no_suffix }= sku;
      if(!tour_no_prefix || !tour_no_suffix) return '';
      return `${tour_no_prefix} - { 时间戳 } - ${tour_no_suffix}`
    }
  },

  data(){
    return Object.assign(
      {
        tableData: []
      },
      { SKU_PROCESS_STATUS, SKU_LINI_STATUS }
    )
  },

  methods: Object.assign(
    {
      init(skuArr){
        this.tableData= skuArr.map(this.skuAdaptor);
      },

      openEditor(sku){
        this.$refs.editor.open(sku);
      },

      changeSkuLineStatus(sku){
        let { id, line_status }= sku;
        let find= SKU_LINI_STATUS.find(el => el.value!== line_status);
        this.$confirm(`是否${find.label}该SKU?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          skuOnlineOffline({ id, line_status: find.value }).then(() => {
            sku.line_status= find.value;
          })
        })
      }
    },
    // 工具函数
    {
      skuAdaptor(sku){
        let { tour_no_prefix, tour_no_suffix, is_price, ...others }= sku;
        let sku_status= SKU_PROCESS_STATUS.UN_INITED;
        if(is_price=== 1) sku_status= SKU_PROCESS_STATUS.CAN_LINE;
        if(tour_no_prefix && tour_no_suffix && is_price=== 0) sku_status= SKU_PROCESS_STATUS.CAN_PRICE;
        return { tour_no_prefix, tour_no_suffix, is_price, sku_status, ...others }
      }
    }
  )

}
</script>