<template>
  <div class="banks-tab">
    <header style="padding-bottom: 10px;">
      <el-button type="primary" size="small"
        @click="wakeupEditForm(null)">
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

        <el-table-column align="center" prop="cardNumber" label="账号"></el-table-column>

        <el-table-column align="center" prop="memo" label="备注"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" 
              @click="wakeupEditForm(scope.row, scope.$index)">
              编辑
            </el-button>
            <el-button size="small" type="danger"
              @click="removeBank(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <edit-form ref="editForm"
        @save-bank="saveBank">
      </edit-form>
    </footer>
  </div>
</template>

<script>
import editForm from './subs/editForm'

export default {

  components: { editForm },

  data(){
    return Object.assign(
      {
        isSave: false,
        tableData: [],
      }
    )
  },

  methods: Object.assign(
    {
      init(payload){
        let { id, banks }= payload;
        this.isSave= !!id;
        this.proto= payload;
        this.checkProto= banks;
        this.tableData.splice(0);
        this.tableData.push(...this.$deepCopy(banks));
      },

      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },

      hasChanged(){
        return !this.$checkLooseEqual(this.tableData, this.checkProto);
      },

      validate(){
        if(this.tableData.length=== 0){
          this.$message.error('至少添加一条账户信息');
          return false;
        }
        return true;
      },

      getData(){
        return this.tableData;
      }
    },

    // dialog相关方法
    {
      wakeupEditForm(payload, index){
        console.log(index)
        this.$refs.editForm.init(payload, index);
      },
    
      saveBank(payload){
        let { data, index }= payload;
        // 如果是编辑则添加供应商id
        if(this.isSave) data.supplierID= parseInt(this.proto.id);
        // 如果没有创建时间
        if(!data.createTime) data.createTime= Date.now();
        if(this.$isNull(index)) return this.tableData.push(data);
        Object.assign(this.tableData[index], data);
      },

      removeBank(index){
        this.$confirm(`确定删除这条账户信息吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.tableData.splice(index, 1);
        })
      }
    }
  )

}
</script>