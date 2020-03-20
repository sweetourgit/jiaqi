<style lang="scss" scoped>
.page{
  &>header{
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
  }
  & >>> .row-header{
    background-color: rgb(247, 247, 247);
  }
  & >>> th{
    background-color: transparent;
  }
}
</style>

<template>
  <div class="page">
    <header @click="test= !test">
      <PriceHeader ref="priceHeader"
        @plan-status="planStatus= $event">
      </PriceHeader>
      <div v-move-btn style="display:flex;justify-content: flex-end;width: 240px;">
        <el-button type="info" size="mini"
          v-show="planStatus> SKU_PLAN_STATUS.UNDO">
          保存
        </el-button>
        <el-button type="info" size="mini"
          v-show="planStatus=== SKU_PLAN_STATUS.MULTIPLE">
          提交
        </el-button>
        <el-button type="info" size="mini">返回</el-button>
      </div>
    </header>
    <PriceMain ref="priceMain"></PriceMain>
    
  </div>
</template>

<script>
import PriceHeader from './comps/PriceHeader/PriceHeader'
import PriceMain from './comps/PriceMain/PriceMain'
import { SKU_PLAN_STATUS } from '@/page/productManagement/planInventory/liner/dictionary'
import './moveBtn'

export default {

  components: { PriceHeader, PriceMain },

  data(){
    return {
      planStatus: 0,
      SKU_PLAN_STATUS
    }
  }

}
</script>