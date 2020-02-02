<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="查看订单" :visible="dialogFormVisible1" width=70% @close="close" appendToBody>
      <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="成本" align="center">
          </el-table-column>
          <el-table-column prop="income" label="收入" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="客人信息" align="center">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="approval_money" label="申请金额" align="center">
            <!--<template slot-scope="scope">-->
            <!--<el-input v-model="scope.row.money" placeholder="申请金额"></el-input>-->
            <!--</template>-->
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <!--<el-button @click="submitForm" type="primary" size="small" class="table_details">确定</el-button>-->
        <el-button @click="close" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "getOrderInvoice",
    components: {},
    props: {
      dialogFormVisible1: false,
      sendID: '',
    },
    data() {
      return {
        totalMoney: '0',
        receiptCode: '收款编码1', // 收款编码
        approval: '未审批', // 审批
        approvalOpinions: '',
        currentRow: true,
        tableData: [],
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      dialogFormVisible1: {
        handler:function(){
          if(this.dialogFormVisible1){
            this.loadData()
          }
        }
      }
    },
    methods: {
      //获取id
      clickBanle(row, event, column) {
        this.pid = row['id']
      },
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      close() {
        this.$emit('close', false);
      },
      submitForm(formName) {
        this.$message({
          type: 'success',
          message: '提交成功!'
        });
      },
      loadData(){
//        console.log(this.sendID);
        const id = this.sendID;
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitioninfo", {
          "id": id
        }, ).then(function(response) {
//          console.log(response);
          if (response.data.code == '200') {
            console.log(response);
            that.tableData = response.data.data.order_list;
            let total = 0;
            response.data.data.order_list.forEach(function (item, index, arr) {
              total += parseFloat(item.approval_money);
            });
            that.totalMoney = total.toFixed(2);
          } else {
            that.$message.warning("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    created() {},
    mounted() {}
  }

</script>
<style lang="scss" scoped>
  .footer {
    position: relative;
    width: 100%;
    height: 50px;
    float: right;
    margin-top: -10px;
  }

  .el-button {
    bottom: 1%;
    right: 1%;
    float: right;
    margin: 0 10px;
  }

  .inputWidth {
    width: 400px;
  }

  .totalMoney {
    width: 95%;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    margin: 0 30px;
  }

  .table_trip {
    width: 95%;
    margin: 30px 30px;
  }

</style>
