<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="8">
          <div class="status">
            <span class="header">基本信息</span>
            <el-button type="warning" round size="mini">未认款</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="button"></div>
        </el-col>
        <el-col :span="8">
          <div class="button">
            <el-button class="el-button" @click="closeAdd">取 消</el-button>
            <el-button class="el-button" type="primary" @click="toUpdate">修 改</el-button>
            <el-button class="el-button" type="primary" @click="pledging">认 款</el-button>
            <el-button class="el-button" type="danger" @click="delInfo">删 除</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>报账团期 :</p>123456
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>操作人：</p> 大运通-财务部-阳阳
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>创建时间：</p>2019-12-23 12:23:23
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>产品名称：</p>方特
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>开始时间：</p>2019-01-01
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>结束时间：</p>2019-01-31
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>关联订单：</p>32个
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>收入：</p>18900.00
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>支出：</p>12322.00
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>毛利率：</p>0.03%
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-col :span="8">
          <div class="header">
            认款信息
          </div>
        </el-col>
        <el-col :span="8">
          <div class="button"></div>
        </el-col>
        <el-col :span="8">
          <div class="button">
          </div>
        </el-col>
      </el-row>
      <div class="footer">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单" name="1">
            <div class="table_trip" style="width: 80%;">
              <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
                <el-table-column prop="oid" label="订单ID" align="center" width="80%">
                </el-table-column>
                <el-table-column prop="title" label="产品名称" align="center">
                </el-table-column>
                <el-table-column prop="time" label="开始时间/结束时间" align="center">
                </el-table-column>
                <el-table-column prop="status" label="报账状态" align="center">
                </el-table-column>
                <el-table-column prop="createTime" label="开始时间/结束时间" align="center">
                </el-table-column>
                <el-table-column prop="user" label="操作人员" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button @click="unbinding(scope.row)" type="danger" size="small" class="table_details">解绑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收款编码" name="2">
            <div class="table_trip" style="width: 80%;">
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
                <el-table-column prop="option" label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button @click="getOrder(scope.row)" type="primary" size="small" class="table_details">查看订单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发票" name="3">
            <div class="table_trip" style="width: 80%;">
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
                <el-table-column prop="option" label="操作" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button @click="getOrder(scope.row)" type="primary" size="small" class="table_details">查看订单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ToUpdate :dialogFormVisible="dialogFormVisible2" @close="close2" :info="info"></ToUpdate>
      <GetOrder :dialogFormVisible="dialogFormVisible" @close="close2" :info="info"></GetOrder>
    </div>
  </div>
</template>
<script type="text/javascript">
import GetOrder from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrder'
import ToUpdate from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toUpdate'
export default {
  name: "scenicTicketingDetails",
  components: {
    GetOrder,
    ToUpdate
  },
  data() {
    return {
      activeName: '1',
      currentRow: true,
      pid: '',
      info: '',
      transmit: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      status: {
        0: '审核中',
        1: '通过',
        2: '驳回',
      },
      tableData: [{
        oid: '311123',
        title: '丹东百瀑峡门票（成人票）',
        time: '开始时间：2019-01-09结束时间：2019-01-09',
        status: '未报账',
        createTime: '2019-01-09 09:37',
        user: '阳阳',
      }, {
        oid: '311124',
        title: '丹东百瀑峡门票（成人票）',
        time: '开始时间：2019-01-09结束时间：2019-01-09',
        status: '未报账',
        createTime: '2019-01-09 09:37',
        user: '阳阳',
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
    //认款
    pledging(row) {
      this.$router.push({ path: "/scenicTicketingPledging?id=" + this.$route.query.id });
    },
    closeAdd() {
      this.$router.push({ path: "/regimentPlan/scenicTicketingList" });
    },
    toUpdate() {
      this.dialogFormVisible2 = true
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
      this.$confirm('是否删除此订单?', '提示', {
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
    getOrder(row) {
      this.dialogFormVisible = true
    },
    close2() {
      this.dialogFormVisible = false
      this.dialogFormVisible2 = false
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['tour']
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

  },
  created() {

  },
  mounted() {}
}

</script>
<style lang="scss" scoped>
.button {
  float: right;
  margin-right: -90%;
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
