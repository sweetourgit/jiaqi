<template>
  <div class="distributor-content">
    <div class="buttonsDv">
      <el-button @click="closeBtn" type="primary">关闭</el-button>
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
      <el-table-column prop="moneyExplain" label="交易时间" align="center">
      </el-table-column>
      <el-table-column prop="collectionTime" label="交易金额" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="优惠金额" align="center">
      </el-table-column>
      <el-table-column prop="createUser" label="实收金额" align="center">
      </el-table-column>
      <el-table-column prop="payarr.length" label="退款金额" align="center">
      </el-table-column>
      <el-table-column prop="checkType" label="商户订单号" align="center">
      </el-table-column>
      <el-table-column prop="distributor" label="平台订单号" align="center">
      </el-table-column>
      <el-table-column prop="moneyExplain" label="所属渠道" align="center">
      </el-table-column>
      <el-table-column prop="price" label="商户编号" align="center">
      </el-table-column>
      <el-table-column prop="collectionTime" label="商户名称" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="支付类型" align="center">
      </el-table-column>
      <el-table-column prop="createUser" label="交易状态" align="center">
      </el-table-column>
      <el-table-column prop="payarr.length" label="币种" align="center">
      </el-table-column>
      <el-table-column prop="price" label="交易类型" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="交易发卡行" align="center">
      </el-table-column>
      <el-table-column prop="createUser" label="终端类型" align="center">
      </el-table-column>
      <el-table-column prop="payarr.length" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="price" label="操作员编号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="设备号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="门店编号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="第三方商户号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="appID" align="center">
      </el-table-column>
      <el-table-column prop="price" label="第三方订单号" align="center">
      </el-table-column>
      <el-table-column prop="price" label="付款备注" align="center">
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
      tableData: [], // 表格数据

      pageCurrent: 1,
      pageSize: 10,
      total: 0,

      info: '',
      dialogFormVisible: false
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
    closeBtn(){
      this.$router.push({
        path: '/bankStatement',
        name: '银行流水单管理',
        params: {
          tabStatus: 'second'
        }
      });
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

    }
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
      margin-top: 10px;
      text-align: end;
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
