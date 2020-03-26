<template>
  <el-dialog title="编辑挂账成本" width="1120px"
    ref="dialogRef" 
    :visible="state"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <div style="text-align: left; margin-bottom: 10px;">
      <el-button size="small" type="primary"
        @click="wakeupEditForm()">
        新增
      </el-button>
    </div>
    <el-table style="width: 100%" border
        :data="tableData"
        :highlight-current-row="false"
        :header-cell-style="getRowClass">
        <el-table-column align="center" prop="supplier" label="供应商名称" ></el-table-column>

        <el-table-column align="center" label="借款类型">地接款</el-table-column>

        <el-table-column align="center" prop="arrearsPrice" label="借款金额"></el-table-column>

        <el-table-column align="center" prop="peopleCount" label="人数"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" 
              @click="wakeupEditForm(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger"
              @click="$emit('remove', scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  </el-dialog>
</template>

<script>
export default {

  data(){
    return Object.assign(
      {
        state: false,
      },
      {
        expenses: []
      }
    )
  },

  computed: {
    tableData(){
      return this.expenses.filter(expense => expense.expenseType=== 1);
    }
  },

  methods: {
     //(groupCode)用于拼接生成储存草稿的唯一标识
    wakeup(expenses){
      this.expenses= expenses;
      this.state= true;
    },

    handleClose(){
      this.state= false;
    },

    wakeupEditForm(expense){
      this.$emit('wakeup-edit', expense);
    },

    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
  }

}
</script>