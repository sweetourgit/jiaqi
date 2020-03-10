<style lang="scss" scoped>
.insure-ground{
  header {
    position: relative;
    .title{
      font-weight: bold;
      font-size: 24px;
      line-height: 40px;
    }
    .add-btn{
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>

<template>
  <div class="insure-ground">
    <header>
      <span class="title">保险</span>
      <el-button class="add-btn" type="primary">添加</el-button>
    </header>
    <main>
      <el-table border style="width: 100%"
      :data="tableData" 
      :highlight-current-row="false"
      header-row-class-name="row-header">
        <el-table-column label="ID" prop="id" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="团期计划" prop="sign" header-align="center" align="center"></el-table-column>
        <el-table-column label="清位时间" prop="uptoDay" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <span>前&nbsp;{{ scope.row.uptoDay }}&nbsp;天</span>
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
              v-show="SkuState >= SKU_STATUS.CAN_EDIT">
              价格
            </el-button>
            <el-button type="text"
              v-show="SkuState >= SKU_STATUS.CAN_LINE">
              上线
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer></footer>
  </div>
</template>

<script>
export default {

}
</script>