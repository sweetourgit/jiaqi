<template>
  <div class="banks-tab">
    <header style="padding-bottom: 10px;">
      <el-button type="primary" size="small"
        >
        新增
      </el-button>
    </header>
    <main>
      <el-table style="width: 100%" border
        :data="tableData"
        :highlight-current-row="false"
        :header-cell-style="getRowClass">
        <el-table-column align="center" prop="cardName" label="汇款户名" ></el-table-column>

        <el-table-column align="center" prop="bankName" label="开户行"></el-table-column>

        <el-table-column align="center" prop="groupCode" label="账号"></el-table-column>

        <el-table-column align="center" prop="memo" label="备注"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="wakeupEditForm(scope.row)">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>

    </footer>
  </div>
</template>

<script>
export default {

  data(){
    return Object.assign(
      {
        tableData: [],
      }
    )
  },

  methods: Object.assign(
    {
      wakeupEditForm(){},
    },
    
    // 
    {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
    }
  )

}
</script>