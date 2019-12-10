<style lang="scss" scoped>

</style>

<template>
  <div class="child-list">
    <searchCondition
      @search="emitSearch"
    >
      <el-button type="primary" size="small" @click="$emit('change-child')">添加</el-button>
    </searchCondition>
    <main>
      <div>{{ test }}</div>
      <el-table border style="width: 100%"
        :data="tabelData"
      >
        <el-table-column label="ID" prop="enrollName" header-align="center" align="center"></el-table-column>
        <el-table-column label="销售价" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ parseDouble(scope.row.price_01) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="同业价" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ parseDouble(scope.row.price_02) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算价" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ parseDouble(scope.row.price_03) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配额" prop="quota" header-align="center" align="center"></el-table-column>
      </el-table>
    </main>
    <footer>
      
    </footer>
  </div>
</template>

<script>
import searchCondition from './comps/search-condition'

export default {

  components: { searchCondition },

  data(){
    return {
      test: null,
      tabelData: null,
    }
  },

  methods: {
    emitSearch(payload){
      console.log(payload)
      this.test= payload;
    }
  }
}
</script>