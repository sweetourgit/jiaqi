<template>
  <div class="distributor-content">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="110px" id="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="7">
          <el-form-item label="匹配状态:" class="status-length" prop="matchType">
            <el-select v-model="ruleForm.matchType" placeholder="请选择匹配状态">
              <el-option label="已匹配" value="2"></el-option>
              <el-option label="未匹配" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="交易流水号:" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入交易流水号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="交易日期:" prop="dateStart">
            <el-col :span="11">
              <el-form-item prop="dateStart">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateStart" :picker-options="startDatePicker" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="dateEnd">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateEnd" :picker-options="endDatePicker" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8" :offset="16">
          <el-form-item class="buttonForm">
            <el-button @click="searchHandInside()" type="primary">搜索</el-button>
            <el-button @click="emptyButtonInside('ruleForm')" type="primary" plain>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
    <div class="buttonsDv">
      <el-button @click="addStatement" type="primary">添加中国银行流水单</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass" :stripe="true" id="table-content">
      <el-table-column label="操作" width="100" align="center" fixed>
        <template slot-scope="scope">
          <el-button @click="orderDetail(scope.row)" type="text" size="small" class="table_details">查看订单</el-button>
          <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="剩余金额" align="center">
      </el-table-column>
      <el-table-column prop="checkType" label="交易流水号" align="center">
      </el-table-column>
      <el-table-column prop="distributor" label="交易日期" align="center">
      </el-table-column>
      <el-table-column prop="moneyExplain" label="交易时间" align="center">
      </el-table-column>
      <el-table-column prop="price" label="交易货币" align="center">
      </el-table-column>
      <el-table-column prop="collectionTime" label="交易金额" align="center" :formatter='handleCollectionTime'>
      </el-table-column>
      <el-table-column prop="createTime" label="起息日期" align="center" :formatter='handleCreateTime'>
      </el-table-column>
      <el-table-column prop="createUser" label="汇率" align="center">
      </el-table-column>
      <el-table-column prop="payarr.length" label="记录标识号" align="center">
      </el-table-column>
      <el-table-column prop="checkType" label="摘要" align="center">
      </el-table-column>
      <el-table-column prop="distributor" label="用途" align="center">
      </el-table-column>
      <el-table-column prop="moneyExplain" label="交易附言" align="center">
      </el-table-column>
      <el-table-column prop="price" label="交易类型" align="center">
      </el-table-column>
      <el-table-column prop="collectionTime" label="业务类型" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="付款人开户行号" align="center">
      </el-table-column>
      <el-table-column prop="createUser" label="付款人开户行名" align="center">
      </el-table-column>
      <el-table-column prop="payarr.length" label="付款人账号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="付款人姓名" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="收款人开户行号" align="center">
      </el-table-column>
      <el-table-column prop="createUser" label="收款人开户行名" align="center">
      </el-table-column>
      <el-table-column prop="payarr.length" label="收款人账号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="收款人姓名" align="center">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <!-- 表格 END -->
    <orderDetail :dialogFormVisible="dialogFormVisible" @close="close" :info="info"></orderDetail>
  </div>
</template>

<script type="text/javascript">
import orderDetail from '@/page/Finance/bankStatement/orderDetails.vue'

export default {
  components: {
    orderDetail
  },
  data() {
    return {
      tableData: [{}], // 表格数据
      ruleForm: {
        matchType: '', // 匹配状态
        code: '', // 交易流水号
        dateStart: '', // 开始时间
        dateEnd: '', // 结束时间
      },

      pageCurrent: 1,
      pageSize: 10,
      total: 0,

      info: '',
      dialogFormVisible: false,

      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate()
    }
  },
  created () {
    this.getDataInside()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    addStatement(){

    },
    searchHandInside(){

    },
    emptyButtonInside(){
      this.$refs['ruleForm'].resetFields()
    },
    orderDetail(row){
      this.dialogFormVisible = true;
      this.info = row.id;
    },
    close(){
      this.dialogFormVisible = false;
      this.info = '';
    },
    deleteFun(){

    },
    handleSizeChange(val){

    },
    handleCurrentChange(val){

    },
    loadData(){

    },
    beginDate(){
        const that = this;
        return {
          disabledDate(time){
            if (that.ruleForm.dateEnd) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.ruleForm.dateEnd).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate(){
        const that = this;
        return {
          disabledDate(time) {
            if (that.ruleForm.dateStart) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.ruleForm.dateStart).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
  }
}

</script>
<style lang="scss" scoped>
  .distributor-content{
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .buttonForm{
        text-align: end;
      }
      .el-select{
        width: 100% !important;
      }
      .line{
        text-align: center;
      }
    }
    .buttonsDv{
      width: 98%;
      margin: 5px auto;
    }
    #table-content{
      width: 98%;
      margin: 40px auto 20px;
      th, td{
        min-width: 60px;
      }
    }
    .block{
      width: 100%;
      text-align: center;
      margin: 30px auto;
    }
  }

</style>
