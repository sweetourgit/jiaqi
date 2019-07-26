<template>
  <div class="vivo" style="position:relative">
    <div class="">
      <el-row style="margin-bottom: 0px;">
        <el-col :span="8">
          <div class="status"></div>
        </el-col>
        <el-col :span="8">
          <div class="button"></div>
        </el-col>
        <el-col :span="8">
          <div class="button">
            <el-button class="el-button" @click="closeAdd">取 消</el-button>
            <el-button class="el-button" type="primary" @click="save">保 存</el-button>
            <el-button class="el-button" type="primary" @click="submit">提交认款</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单" name="1">
            <div class="demo-input-suffix">
              <el-row>
                <el-col :span="1">
                  <span class="search-title">订单ID:</span>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="oid" class="input"></el-input>
                </el-col>
                <el-col :span="2">
                  <span class="search-title">产品名称:</span>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="title" class="input"></el-input>
                </el-col>
                <el-col :span="3">
                  <span class="search-title">有未处理金额订单:</span>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="isHandleOrder" placeholder="请选择">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option key="1" label="是" value="1"></el-option>
                    <el-option key="0" label="否" value="0"></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="1">
                  <span class="search-title">平台:</span>
                </el-col>
                <el-col :span="6">
                  <el-select style="float: left;" class="inputWidth" v-model="platform" placeholder="请选择">
                    <el-option v-for="item in platformList" :key="item.label" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="2">
                  <span class="search-title">取票人:</span>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="user" class="input"></el-input>
                </el-col>
                <el-col :span="8">
                  <div class="button_select">
                    <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
                    <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="main">
              <el-button type="primary" @click="receiptCode" plain :disabled="forbidden">收款编码</el-button>
              <el-button type="primary" @click="invoice" plain :disabled="forbidden">发票</el-button>
              <el-button type="primary" @click="unbinding" plain>解绑</el-button>
            </div>
            <div class="table_trip" style="width: 95%;">
              <el-table ref="multipleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass" @selection-change="selectionChange" @select-all="selectAll" @select="select">
                <el-table-column prop="id" label="" fixed type="selection"></el-table-column>
                <el-table-column prop="oid" label="订单ID" align="center" width="80%">
                </el-table-column>
                <el-table-column prop="title" label="产品名称" align="center">
                </el-table-column>
                <el-table-column prop="platform" label="平台" align="center">
                </el-table-column>
                <el-table-column prop="cost" label="成本" align="center">
                </el-table-column>
                <el-table-column prop="income" label="收入" align="center">
                </el-table-column>
                <el-table-column prop="untreatedMoney" label="未处理金额" align="center">
                </el-table-column>
                <el-table-column prop="receiptCode" label="收款编码" align="center">
                </el-table-column>
                <el-table-column prop="invoice" label="发票" align="center">
                </el-table-column>
                <el-table-column prop="customer" label="客人信息" align="center">
                </el-table-column>
                <el-table-column prop="number" label="数量" align="center">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收款编码" name="2">
            <div class="table_trip" style="width: 95%;">
              <el-table ref="singleTable" :data="tableData2" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
                <el-table-column prop="receiptCode" label="收款编码" align="center">
                </el-table-column>
                <el-table-column prop="status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approvalOpinions" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button @click="getOrderCode(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                    <el-button @click="delOrderCode(scope.row)" type="danger" size="small" class="table_details">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发票" name="3">
            <div class="table_trip" style="width: 95%;">
              <el-table ref="singleTable" :data="tableData3" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
                <el-table-column prop="invoice" label="发票" align="center">
                </el-table-column>
                <el-table-column prop="invoiceInfo" label="发票信息" align="center">
                </el-table-column>
                <el-table-column prop="voucher" label="凭证" align="center">
                </el-table-column>
                <el-table-column prop="status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approvalOpinions" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approvalAmount" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button @click="getOrderInvoice(scope.row)" type="primary" size="small" class="table_details">详情</el-button>
                    <el-button @click="delOrderInvoice(scope.row)" type="danger" size="small" class="table_details">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="提示" :visible.sync="saveDialogVisible" width="30%">
        <span><i class="el-icon-info"></i>是否保存后退出</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDialogVisible = false">直接退出</el-button>
          <el-button type="primary" @click="saveExit">保存退出</el-button>
        </span>
      </el-dialog>
      <GetOrderCode :dialogFormVisible="dialogFormVisible" @close="close2" :info="info"></GetOrderCode>
      <GetOrderInvoice :dialogFormVisible="dialogFormVisible4" @close="close2" :info="info"></GetOrderInvoice>
      <ReceiptCode :dialogFormVisible="dialogFormVisible2" @close="close2" :info="info"></ReceiptCode>
      <Invoice :dialogFormVisible="dialogFormVisible3" @close="close2" :info="info"></Invoice>
    </div>
  </div>
</template>
<script type="text/javascript">
import GetOrderCode from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrderCode'
import GetOrderInvoice from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrderInvoice'
import ReceiptCode from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/receiptCode'
import Invoice from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/invoice'
export default {
  name: "scenicTicketingPledging",
  components: {
    GetOrderCode,
    GetOrderInvoice,
    ReceiptCode,
    Invoice,
  },
  data() {
    return {
      activeName: '1',
      //搜索表单
      oid: '',
      title: '',
      isHandleOrder: '',
      platform: '',
      user: '',
      //搜索表单结束
      currentRow: true,
      pid: '',
      info: '',
      multipleSelection: [], //选中的list
      forbidden: true,
      transmit: false,
      isSelectAll: false,
      saveDialogVisible: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      status: {
        0: '审核中',
        1: '通过',
        2: '驳回',
      },
      platformList: [{
        "value": "1",
        "label": "美团"
      }, {
        "value": "2",
        "label": "途牛"
      }, {
        "value": "3",
        "label": "携程"
      }, {
        "value": "4",
        "label": "有赞"
      }, {
        "value": "5",
        "label": "去哪"
      }, {
        "value": "6",
        "label": "飞猪"
      }, {
        "value": "7",
        "label": "马蜂窝"
      }, ],
      tableData: [{
        id: '1',
        oid: '311123',
        title: '丹东百瀑峡门票（成人票）',
        platform: '途牛',
        cost: '111.00',
        income: '111.00',
        untreatedMoney: '11.00',
        receiptCode: '收款编码1 233333333',
        invoice: '',
        customer: '取票人：阳阳 手机：1388888883',
        number: '2',
      }, {
        id: '2',
        oid: '311123',
        title: '丹东百瀑峡门票（成人票）',
        platform: '途牛',
        cost: '111.00',
        income: '111',
        untreatedMoney: '0',
        receiptCode: '收款编码1 233333333',
        invoice: '',
        customer: '取票人：阳阳 手机：1388888883',
        number: '2',
      }, {
        id: '3',
        oid: '311123',
        title: '丹东百瀑峡门票（成人票）',
        platform: '途牛',
        cost: '111.00',
        income: '111.00',
        untreatedMoney: '11.00',
        receiptCode: '收款编码1 233333333',
        invoice: '',
        customer: '取票人：阳阳 手机：1388888883',
        number: '2',
      }, ],
      tableData2: [{
        receiptCode: '收款编码1',
        status: '2',
        approvalOpinions: '重新确认金额',
        money: '222.00',
      }, {
        receiptCode: '311234',
        status: '1',
        approvalOpinions: '',
        money: '222.00',
      }, ],
      tableData3: [{
        id: '1',
        invoice: '发票1',
        invoiceInfo: '发票抬头：国旅 纳税人识别号：123456 手机号：13988888888 地址：沈阳市和平区 开户行：建行',
        voucher: '凭证1 凭证2',
        status: '2',
        approvalOpinions: '重新确认金额',
        approvalAmount: '222.00',
      }, {
        id: '2',
        invoice: '311234',
        invoiceInfo: '发票抬头：国旅 纳税人识别号：123456 手机号：13988888888 地址：沈阳市和平区 开户行：建行',
        voucher: '凭证1 凭证2',
        status: '1',
        approvalOpinions: '重新确认金额',
        approvalAmount: '222.00',
      }, ],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {

  },
  methods: {
    handleClick() {
      this.transmit = !this.transmit
      this.pid = ''
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
      this.$router.push({ path: "/regimentPlan/scenicTicketingList" });
    },
    delInfo() {
      console.log(this.$route.query.id)
      this.$confirm('是否删除此团期计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    unbinding(row) {
      console.log(row['tour'])
      this.$confirm('是否解绑该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '解绑成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解绑'
        });
      });
    },
    getOrderCode(row) {
      this.dialogFormVisible = true
    },
    delOrderCode(row) {
      console.log(row)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getOrderInvoice(row) {
      this.dialogFormVisible4 = true
    },
    delOrderInvoice(row) {
      console.log(row)
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    close2() {
      this.dialogFormVisible = false
      this.dialogFormVisible2 = false
      this.dialogFormVisible3 = false
      this.dialogFormVisible4 = false
    },
    //获取id
    clickBanle(row, event, column) {
      if (row.untreatedMoney > 0) {
        this.$refs.multipleTable.clearSelection() //清空用户的选择,注释掉可多选 
        this.$refs.multipleTable.toggleRowSelection(row)
        this.pid = this.multipleSelection[0].id
      }
    },
    selectionChange(val) {
      let array = []
      var that = this
      if (val.length > 0) {
        val.forEach(function(v, k, arr) {
          if (arr[k]['untreatedMoney'] > 0) {
            array.push(arr[k])
          }
        })
        this.multipleSelection = array
        if (this.multipleSelection.length > 0) {
          this.forbidden = false
        } else {
          this.forbidden = true
        }
      }
    },
    select(selection, row) {
      var that = this
      let zeng = false
      let untreatedMoney = -1
      if (selection.length > 0) {
        selection.forEach(function(v, k, arr) {
          if (arr[k]['id'] == row['id']) {
            zeng = true
          }
          if (arr[k]['untreatedMoney'] <= 0) {
            untreatedMoney = k
          }
        })
      }
      if (zeng && untreatedMoney >= 0) {
        that.$refs.multipleTable.toggleRowSelection(selection[untreatedMoney]);
      }
    },
    selectAll(val) {
      var that = this
      if (!this.isSelectAll) {
        if (val.length > 0) {
          this.$refs.multipleTable.clearSelection() //清空用户的选择,注释掉可多选 
          val.forEach(function(v, k, arr) {
            if (arr[k]['untreatedMoney'] > 0) {
              that.$refs.multipleTable.toggleRowSelection(arr[k])
            }
          })
        } else {
          this.$refs.multipleTable.clearSelection() //清空用户的选择,注释掉可多选 
        }
      } else {
        this.$refs.multipleTable.clearSelection() //清空用户的选择,注释掉可多选 
      }
      this.isSelectAll = !this.isSelectAll
    },
    //发票
    invoice() {
      console.log(this.multipleSelection)
      this.dialogFormVisible3 = true
    },
    //收款编码
    receiptCode() {
      console.log(this.multipleSelection)
      this.dialogFormVisible2 = true
    },
    save() {
      this.saveDialogVisible = true
    },
    saveExit(done) {
      this.$message({
        type: 'success',
        message: '保存成功!'
      });
    },
    submit() {
      this.$message({
        type: 'success',
        message: '提交成功!'
      });
    },
    searchHand() {
      this.$message({
        type: 'success',
        message: '搜索成功!'
      });
    },
    resetHand() {
      this.oid = ""
      this.title = ""
      this.isHandleOrder = ""
      this.platform = ""
      this.user = ""
    },
    submitForm(formName) {
      // this.$refs[formName].validate((valid) => {
      // if (valid) {
      // this.$message({
      // type: 'success',
      // message: '提交成功!'
      // });
      // } else {
      // console.log('error submit!!');
      // return false;
      // }
      // });
    },

  },
  created() {

  },
  mounted() {}
}

</script>
<style lang="scss" scoped>
.demo-input-suffix {
  width: auto;
  background-color: #F7F7F7;
  padding: 20px;
  margin-bottom: 30px;
  margin-right: 50px;

  .search-title {
    height: 35px;
    line-height: 35px;
    float: right;
    padding-right: 10px;
  }

  .button_select {
    float: right;
    margin-right: 20%;
  }

  .input {
    width: 100%;
  }

  .el-row {
    margin: 5px;
  }
}

.main {
  margin-bottom: 15px;
}

.button {
  float: right;
  margin-right: -190%;
}

.info {
  p {
    width: 20%;
    margin-left: 5%;
    display: inline-block;
  }
}

.header {
  font-size: 22px;
  font-weight: 900;
}

.footer {
  margin: 10px 0px 10px 25px;

}

</style>
