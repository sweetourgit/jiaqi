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
        <el-table-column label="标题" prop="id" header-align="center" align="center" width="800"></el-table-column>
        <el-table-column label="售卖价格" prop="sign" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" prop="quota" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text"
              @click="openEditor(scope.row)">
              修改
            </el-button>
            <el-button type="text">
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
      <insureEditor ref="editor"></insureEditor>
    </footer>
  </div>
</template>

<script>
import { insureListAll } from '@/page/productManagement/planInventory/liner/api'
import insureEditor from './comps/InsureEditor'

export default {

  components: { insureEditor },

  mounted(){
    this.init();
  },

  data(){
    return {
      tableData: [
        {id: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十'}
      ]
    }
  },

  methods: {
    init(){
      let { product_id }= this.$route.query;
      insureListAll({ product_id })
      .then(insureList => this.tableData= insureList);
    },
    openEditor(insure){
      this.$refs.editor.open(insure);
    }
  }

}
</script>