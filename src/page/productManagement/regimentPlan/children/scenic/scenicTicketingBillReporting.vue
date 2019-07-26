<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <el-row style="margin-bottom: 20px;">
        <el-col :span="8">
          <div class="status">
            <span class="header">基本信息</span><br><br>
            <el-button type="success" round size="mini">认款通过</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="button"></div>
        </el-col>
        <el-col :span="8">
          <div class="button">
            <el-button class="el-button" @click="closeAdd">取 消</el-button>
            <el-button class="el-button" type="primary" @click="toPreview">预览报账单</el-button>
            <el-button class="el-button" type="primary" @click="submitForm">保 存</el-button>
            <el-button class="el-button" type="primary" @click="delInfo">提交报账单</el-button>
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
            <p>报账日期：</p>2019-12-23 12:23:23
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>团队人数：</p>83人
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>全程天数：</p>0
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>总收入：</p>11072.94
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>总支出：</p>11039.00
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>毛利额：</p>33.94
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info">
            <p>毛利率：</p>0.31%
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="info">
            <p>成本项目：</p>门票
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
        <el-col :span="8">
          <div class="info"></div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;margin-bottom: 40px;">
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
      <div class="totalMoney"><i class="el-icon-info"></i>&nbsp;&nbsp;总计：{{totalMoney}}元 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;人数：{{number}}</div>
      <div class="footer">
        <div class="table_trip" style="width: 95%;">
          <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass" :cell-style="cellStyle">
            <el-table-column prop="code" label="收款编码/发票" align="center">
            </el-table-column>
            <el-table-column prop="income" label="收入来源" align="center">
            </el-table-column>
            <el-table-column prop="basics" label="基础信息" align="center">
            </el-table-column>
            <el-table-column prop="number" label="人数" align="center" style="color:red">
            </el-table-column>
            <el-table-column prop="money" label="金额" align="center">
            </el-table-column>
            <el-table-column prop="option" label="操作" align="center" width="220">
              <template slot-scope="scope">
                <el-button @click="toUpddateIncome(scope.row)" type="primary" size="small" class="table_details">更改人数</el-button>
                <el-button @click="toUpddateSource(scope.row)" type="primary" size="small" class="table_details">设置收入来源</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog title="提示" :visible.sync="saveDialogVisible" width="30%">
        <span><i class="el-icon-info"></i>是否保存后退出</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="saveDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDialogVisible = false">直接退出</el-button>
          <el-button type="primary" @click="saveExit">保存退出</el-button>
        </span>
      </el-dialog>
      <GetOrder :dialogFormVisible="dialogFormVisible" @close="close2" :info="info"></GetOrder>
      <ToUpddateSource :dialogFormVisible="dialogFormVisible2" @close="close2" :info="info"></ToUpddateSource>
      <ToUpddateIncome :dialogFormVisible="dialogFormVisible3" @close="close2" :info="info"></ToUpddateIncome>
      <ToPreview :dialogFormVisible="dialogFormVisible4" @close="close2" :info="info"></ToPreview>
    </div>
  </div>
</template>
<script type="text/javascript">
import GetOrder from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/getOrder'
import ToUpddateSource from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toUpddateSource'
import ToUpddateIncome from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toUpddateIncome'
import ToPreview from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/toPreview'
export default {
  name: "scenicTicketingBillReporting",
  components: {
    GetOrder,
    ToUpddateSource,
    ToUpddateIncome,
    ToPreview
  },
  data() {
    return {
      activeName: '1',
      currentRow: true,
      pid: '',
      info: '',
      totalMoney: '222.00',
      number: '166',
      transmit: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      saveDialogVisible: false,
      tableData: [{
        id: '1',
        code: '311123',
        income: '丹东百瀑峡门票（成人票）',
        basics: '开始时间：2019-01-09结束时间：2019-01-09',
        number: '83',
        money: '2019-01-09 09:37',
      }, {
        id: '1',
        code: '311123',
        income: '丹东百瀑峡门票（成人票）',
        basics: '开始时间：2019-01-09结束时间：2019-01-09',
        number: '84',
        money: '2019-01-09 09:37',
      }, ],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {

  },
  methods: {
    cellStyle(data) {
      if (data.columnIndex == 3) {
        return "background-color:#FFFF00;";
      }
    },
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

    delInfo() {
      this.saveDialogVisible = true
    },
    toUpddateSource(row) {
      this.dialogFormVisible2 = true
    },
    toUpddateIncome(row) {
      this.dialogFormVisible3 = true
    },
    toPreview() {
      this.dialogFormVisible4 = true
    },
    getOrder(row) {
      this.dialogFormVisible = true
    },
    close2() {
      this.dialogFormVisible = false
      this.dialogFormVisible2 = false
      this.dialogFormVisible3 = false
      this.dialogFormVisible4 = false
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['tour']
    },
    submitForm() {
      this.saveDialogVisible = true
    },
    saveExit() {
      this.$message({
        type: 'success',
        message: '保存成功!'
      });
      this.saveDialogVisible = false
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
  margin: 20px 0px 20px 30px;

}

.totalMoney {
  width: 95%;
  background-color: #E6F3FC;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
}

</style>
