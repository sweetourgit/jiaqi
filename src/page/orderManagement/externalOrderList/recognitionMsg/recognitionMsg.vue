<template>
  <div class="vivo" style="position:relative">
    <div class="main" style="width: 88%;text-align: right;">
      <el-button type="primary" @click="cancalBtn" plain>取消</el-button>
      <el-button type="primary"  @click="submitBtn">确认</el-button>
    </div>
    <div class="tableDv">
      <div class="table_trip" style="width: 88%;">
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="type_name" label="类别" align="center" width="60">
          </el-table-column>
          <el-table-column prop="sale_at" label=" 下单时间" align="center">
          </el-table-column>
          <el-table-column prop="" label="费用" align="center" width="160">
            <template slot-scope="scope">
              <span>收入:{{scope.row.income}}</span><br>
              <span>单票成本:{{scope.row.single_cost}}</span><br>
              <span>总成本:{{scope.row.cost}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center" width="50">
          </el-table-column>
          <el-table-column prop="" label="客人信息" align="center" width="145">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="check_at" label="验证时间" align="center">
          </el-table-column>
          <el-table-column prop="pay_type" label="卖出支付方式" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.pay_type == 1">产品自销</p>
              <p v-if="scope.row.pay_type == 2">授信支付</p>
              <p v-if="scope.row.pay_type == 3">微信支付</p>
              <p v-if="scope.row.pay_type == 4">易宝云企付</p>
              <p v-if="scope.row.pay_type == 5">余额支付</p>
              <p v-if="scope.row.pay_type == 6">支付宝</p>
              <p v-if="scope.row.pay_type == 7">自采</p>
            </template>
          </el-table-column>
          <el-table-column prop="import_at" label="导入时间" align="center">
          </el-table-column>
          <el-table-column prop="is_relate_pro" label="关联产品" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.is_relate_pro == 1">未关联产品</p>
              <p v-if="scope.row.is_relate_pro == 2">{{scope.row.relate_pro_name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="bill_status" label="报账状态" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.bill_status == 1">未报账</p>
              <p v-if="scope.row.bill_status == 2">报账中</p>
              <p v-if="scope.row.bill_status == 3">已报账</p>
            </template>
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="showBtn">查看</el-button>
              <el-button type="text" @click="undoBtn">撤销</el-button>
              <el-button type="text" @click="recognitionBtn(scope.row)">认收款</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <recognitionSee :dialogFormVisible="dialogFormVisible" @close="close"></recognitionSee>
    <recognitionDo :dialogFormVisible2="dialogFormVisible2" @close="close" :info="info"></recognitionDo>
  </div>
</template>
<script type="text/javascript">
  import recognitionSee from '@/page/orderManagement/externalOrderList/recognitionMsg/recognitionSee'
  import recognitionDo from '@/page/orderManagement/externalOrderList/recognitionMsg/recognitionDo'
  import {formatDate} from '@/js/libs/publicMethod.js'

  export default {
    name: "externalOrderList",
    components: {
      recognitionSee,
      recognitionDo
    },
    data() {
      return {
        pid: '',
        transmit: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        info: '',

        tableData: [],
        multipleSelection: [],
        currentRow: true,
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {},
    created(){
      this.loadData();
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      cancalBtn(){
        this.$router.push({ path: "/externalOrderList/noRecognition" });
      },
      submitBtn(){
        //...
      },
      handleClick() {
        this.reable = true;
        this.transmit = !this.transmit;
        this.pid = ''
      },
//      查看
      showBtn(){
        this.dialogFormVisible = true;
      },
      close(){
        this.dialogFormVisible = false;
        this.dialogFormVisible2 = false;
      },
//      撤销
      undoBtn(){
        this.$confirm('是否撤销该笔认款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '撤销成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        });
      },
//      认收款
      recognitionBtn(row){
        this.info = row;
        this.dialogFormVisible2 = true;
      }
    },
    created(){
//      console.log(this.$route.params);
//      console.log(this.$route.query);
      this.tableData = this.$route.query;
    }
  }

</script>
<style lang="scss" scoped>
  .vivo {
    .demo-input-suffix {
      width: auto;
      background-color: #F7F7F7;
      padding: 20px;
      min-width: 1350px;

      .search-title {
        font-size: 14px;
        margin-left: 10px;
        margin-top: 10px;
        margin-right: 20px;
        display: inline-block;
        width: 100px;
        text-align: right;
      }

      .el-input {
        width: auto;
      }

      .el-input__inner {
        width: 10%;
      }

      .demo-input-suffix {
        width: 900px
      }

      .date-line {
        width: 10px;
        border-bottom: 1px solid #e6e6e6;
        display: inline-block;
        margin: 0 3px 3px 0
      }

      .button_select {
        /*width: 1300px;*/
        display: inline-block;
        float: right;
        margin-right: 265px;
        overflow: hidden;
        padding: 10px;
        box-sizing: border-box;
      }
      .button_select button{
        float: right;
        margin-left: 20px;
      }

    }

    .main {
      margin-top: 20px;
      margin-bottom: 20px;
      text-align: left;
      //margin-left: 50px;

      .select_button {
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e9eaea;
        text-align: left;
        padding-left: 50px;
      }
    }
    .tableDv{
      width: 100%;
      overflow: hidden;
      position: relative;
      margin-bottom: 40px;
    }
  }



  .el-tabs__nav>>>.el-tabs__item {
    font-size: 30px !important;
  }

  .el-autocomplete>>>.el-input--small .el-input__inner {
    height: 35px !important;
  }

</style>
