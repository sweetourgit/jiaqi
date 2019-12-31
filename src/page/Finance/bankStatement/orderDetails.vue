<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="查看订单" :visible="dialogFormVisible" width=70% @close="closeAdd">
      <div class="totalMoney"><i class="el-icon-info"></i>总收款金额：{{totalMoney}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="orderCode" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="proName" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="number" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="payable" label="订单总额" align="center">
          </el-table-column>
          <el-table-column prop="contactName" label="联系人" align="center">
          </el-table-column>
          <el-table-column prop="contactTel" label="电话" align="center">
          </el-table-column>
          <el-table-column prop="createTime_dt" label="下单时间" align="center">
          </el-table-column>
          <el-table-column prop="price" label="收款金额" align="center">
          </el-table-column>
          <!-- 解绑暂时不需要做 -->
          <!-- <el-table-column prop="guestInformation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="unbind(scope.row)" type="text">解绑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'>
          </el-pagination>
        </div>
      </div>
      <div class="footer">
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "getOrderInvoice",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      totalMoney: 0,
      currentRow: true,

      pageCurrent: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    info: {
      handler:function(){
        if(this.dialogFormVisible){
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
    closeAdd() {
      this.total = 0;
      this.pageCurrent = 1;
      this.totalMoney = 0;
      this.$emit('close', false);
    },
    // unbind(row) {
    //   alert("解绑~未绑定接口！");
    // },
    handleSizeChange(val){
      this.pageSize = val;
      this.pageCurrent = 1;
      this.loadData();
    },
    handleCurrentChange(val){
      this.pageCurrent = val;
      this.loadData();
    },
    loadData(){
      // console.log(this.info);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/FindAssociatedOrders", {
        "pageIndex": this.pageCurrent,
        "pageSize": this.pageSize,
        "object": {
          "bankID": this.info.id,
          "type": this.info.type // 0 中国银行；1 兴业银行；2 微信支付宝明细；
        }
      }).then(function (obj) {
        // console.log('关联订单',obj);
        if(obj.data.isSuccess){
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          let totalM = 0;
          that.tableData.forEach(function (item, index, arr) {
            item.createTime_dt = item.createTime_dt.split('T')[0] +' '+ item.createTime_dt.split('T')[1].split('.')[0];
            totalM += parseFloat(item.price);
          });
          that.totalMoney = totalM;
        }else{
          // that.loadingNBSK = false;
          that.total = 0;
          that.tableData = [];
        }
      })
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
.block{
  margin: 10px auto;
  text-align: center;
}

</style>
