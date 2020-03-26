<style lang="scss" scoped>
.insure-ground{
  header {
    position: relative;
    margin-bottom: 10px;
    .title{
      font-weight: bold;
      font-size: 24px;
      line-height: 40px;
    }
    .add-btn{
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>

<template>
  <div class="insure-ground">
    <header>
      <span class="title">保险</span>
      <el-button class="add-btn" type="primary" size="small"
        @click="openEditor()">
        添加
      </el-button>
    </header>
    <main>
      <el-table border style="width: 100%"
      :data="tableData" 
      :highlight-current-row="false"
      header-row-class-name="row-header">
        <el-table-column label="标题" prop="title" header-align="center" align="center"></el-table-column>
        <el-table-column label="售卖价格" prop="sale_price" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column label="操作" prop="quota" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text"
              @click="openEditor(scope.row)">
              修改
            </el-button>
            <el-button type="text">
              价格
            </el-button>
            <el-button type="text"
              v-show="scope.row.isPriced"
              @click="insureOnOffLineAction(scope.row)">
              {{ scope.row.line_status=== 1? '下线': '上线' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <insureEditor ref="editor"
        @add-insure="insureAddHandler">
      </insureEditor>
    </footer>
  </div>
</template>

<script>
import { insureListAll, insureOnOffLine } from '@/page/productManagement/planInventory/liner/api'
import insureEditor from './comps/InsureEditor'

export default {

  components: { insureEditor },

  mounted(){
    this.init();
  },

  data(){
    return {
      tableData: []
    }
  },

  methods: {
    init(){
      let { product_id }= this.$route.query;
      insureListAll({ product_id })
      .then(insureList => this.tableData= insureList.map(this.insureAdaptor));
    },

    insureAdaptor(insure){
      insure.isPriced= !!insure.sale_price;
      return insure;
    },

    openEditor(insure){
      this.$refs.editor.open(insure);
    },

    insureAddHandler(insure){
      this.tableData.push(this.insureAdaptor(insure));
    },

    insureOnOffLineAction(insure){
      let { id, line_status: oldStatus, isPriced }= insure;
      let line_status= oldStatus=== 2? 1: 2;
      if(line_status=== 1 && !isPriced) return this.$message.error('未设置价格不能上线');
      this.$confirm(`是否${line_status=== 1? '上线': '下线'}该保险信息?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        insureOnOffLine({ id, line_status }).then(() => insure.line_status= line_status);
      })
    }
  }

}
</script>