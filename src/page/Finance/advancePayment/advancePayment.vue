<!-- 预付款管理 -> 借款记录 -->
<template>
  <div class="vivo">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 借款记录 -->
      <el-tab-pane label="借款记录" name="first">
        <div class="distributor-content">
          <!-- 搜索表单 -->
          <el-form :model="ruleForm" ref="ruleForm"  label-width="80px" id="form-content">
            <el-row type="flex" class="row-bg">
              <el-col :span="8">
                <el-form-item label="团期计划:" prop="planID">
                  <el-input v-model="ruleForm.planID" placeholder="请输入团期计划"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请人:" prop="user">
                  <el-input v-model="ruleForm.user" placeholder="请输入申请人" :disabled="ifShowProposer"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态:" prop="checkType">
                  <el-select v-model="ruleForm.checkType" placeholder="请选择类型" class="status-length">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) of settlement" :key="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="8">
                <el-form-item label="发起时间:">
                  <el-col :span="11">
                    <el-form-item prop="startTime">
                      <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleForm.startTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="endTime">
                      <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleForm.endTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button @click="searchHand()" type="primary">搜索</el-button>
                  <el-button @click="resetHand('ruleForm')" type="primary">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 搜索表单 END -->
          <!-- 申请按钮 -->
          <el-button type="primary" @click="dialogchange()" class="add-style">申请</el-button>
          <!-- 申请按钮 END -->
          <!-- 表格 -->
          <el-table :data="tableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass" id="table-content">
            <el-table-column prop="paymentID" label="借款单号" align="center" width="80%">
            </el-table-column>
            <el-table-column prop="checkTypeEX" label="状态" width="90" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
                <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
                <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
              </template>
            </el-table-column>
            <el-table-column label="发起时间" :formatter='dateFormat' align="center" width="190" prop="createTime">
            </el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center" width="180">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商名称" align="center" width="120">
            </el-table-column>
            <el-table-column prop="supplierTypeEX" label="类型" align="center" width="90">
            </el-table-column>
            <el-table-column cell-style prop="price" label="借款金额" align="center" width="90">
            </el-table-column>
            <el-table-column cell-style prop="expensePrice" label="已核销金额" align="center" width="95">
            </el-table-column>
            <el-table-column prop="createUser" label="申请人" align="center" width="90">
            </el-table-column>
            <el-table-column prop="opinion" label="审批意见" align="center">
            </el-table-column>
            <el-table-column prop="opinion" label="操作" align="center">
               <template slot-scope="scope">
                 <el-button @click="checkIncome(scope.row)" type="text" size="small" class="table_details">详情</el-button>
<!--                 <span v-if="scope.row.checkTypeEX=='通过' && scope.row.isEBS == 0 && ifAccountBtn">|</span>-->
<!--                 <el-button @click="bankAccount(scope.row)" v-if="scope.row.checkTypeEX=='通过' && scope.row.isEBS == 0 && ifAccountBtn" type="text" size="small" class="table_details">付款账户</el-button>-->
               </template>
            </el-table-column>
          </el-table>
          <!-- 表格 END -->
          <!-- 分页 -->
          <el-row type="flex" class="paging">
            <el-col :span="8" :offset="13">
              <el-pagination
                v-if="pageshow"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[5, 10, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total='total'
                background
              >
              </el-pagination>
            </el-col>
          </el-row>
          <!-- 分页 END -->
        </div>
      </el-tab-pane>
      <!-- 借款记录 END -->
      <!-- 需要您审批 -->
      <el-tab-pane :label="'需要您审批'+msg" name="second">
        <div class="distributor-content">
          <approvalToBorrow v-on:headCallBack="headCall"></approvalToBorrow>
        </div>
      </el-tab-pane>
      <!-- 需要您审批 END -->
    </el-tabs>
     <AdvanceInfo :dialogFormVisible="dialogFormVisible" :find="find" :change="change" :pid="pid" :typeList="typeList" :payModeList="payModeList" @close="closeAdd" :infoStatus="infoStatus" @searchHandList="searchHand"></AdvanceInfo>
    <!--查看借款详情弹窗-->
    <el-dialog title="借款申请详情" :visible.sync="checkIncomeShow" width="1100px" custom-class="city_list" :show-close='false'>
      <!-- <div style="line-height:30px; background:#d2d2d2;padding:0 10px; border-radius:5px; position:absolute; top:13px; left:100px;">审核中</div> -->
        <div style="position:absolute; top:8px; right:10px;">
          <el-button @click="CloseCheckIncomeShow()">取消</el-button>
          <el-button @click="repeal()" type="danger" plain v-if="getRowCheckType != 1">撤销</el-button>
        </div>
      <!-- 好像是和无收入借款共用一个 -->
      <checkLoanManagement :paymentID="paymentID" :groupCode="groupCode"></checkLoanManagement>
    </el-dialog>
    <!-- 付款账户弹窗 -->
    <el-dialog title="选择账户" :visible.sync="SelectAccount" width="1100px" custom-class="city_list" :show-close='false'>
      <div class="close" @click="closeAccount()">×</div>
      <el-table :data="tableSelect" border :header-cell-style="getRowClass">
        <el-table-column prop="cardType" label="类型" align="center"></el-table-column>
        <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
        <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
        <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
        <el-table-column prop="openingName" label="开户人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addAccount(scope.$index, scope.row)" class="table_details">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 付款账户弹窗 END -->
  </div>
</template>
<script>
import approvalToBorrow from '@/page/Finance/loanManagement/approvalToBorrow'
import AdvanceInfo from '@/page/Finance/advancePayment/advanceInfo/advanceInfo'
import moment from 'moment'
import checkLoanManagement from '@/page/Finance/loanManagement/checkLoanManagement/checkLoanManagement'
export default {
  name: "advancePayment",
  components: {
    approvalToBorrow,
    AdvanceInfo,
    checkLoanManagement,
  },
  data() {
    return {
      tableSelect:[], // 选择弹窗表格
      SelectAccount:false, // 选择账户弹窗
      // ifAccountBtn: false, // 只有出纳的时候才显示付款账户
      ifShowProposer: false, // 当职位为收纳额时候禁止使用申请人检索
      ruleForm: {
        planID: '', // 团期计划输入框
        user: '', // 申请人
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        checkType:'' // 状态
      },
      settlement:[{ // 状态切换
        value: '0',
        label: '审批中'
      }, {
        value: '1',
        label: '通过'
      }, {
        value: '2',
        label: '驳回'
      }],
      checkIncomeShow:false,//详情弹窗
      getRowCheckType: null, // 获取当前审批状态
      paymentID:0,
      groupCode:0,
      pageshow:true,
      activeName: 'first',
      reable: true,
      tableData: [],
      currentPage4: 1,
      total: 0,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      payModeList: [],
      typeList: [],
      find: 0,
      change: false,
      pid: '',
      infoStatus: '',
      dialogFormVisible: false,
      msg:'',
    }
  },
  computed: {
    // 计算属性的 getter
    approval: function() {
      // `this` 指向 vm 实例
      return this.approvalTotal > 0 ? '您需要审批(' + this.approvalTotal + ')' : '您需要审批'
    },
  },
  created () {
    // 只有是出纳的时候才显示申请人检索
    // if (sessionStorage.getItem('hasCashierInfo')) {
    //   this.ifAccountBtn = true
    // } else {
    //   this.ifAccountBtn = false
    // }
    this.querySearch6()
    this.querySearch7()
    this.searchHand()
    if (!sessionStorage.getItem('hasCashierInfo')) { // 只有是出纳的时候才显示申请人检索
      this.ifShowProposer = true
    }
  },
  methods: {
    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    },
    moment,
    // 选择账户弹窗
    bankAccount() {
      this.SelectAccount = true;
      this.selectList();
    },
    // 选择账户指定弹窗之后，选择指定的账户
    addAccount(index, row) {
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/payment/api/insertebs",
        {
          "paymentID": that.paymentID,
          "accountID": row.id
        }
      ).then(function (obj) {
        // 选择成功之后刷新当前列表,让不具备付款账户按钮进行重新判断
        that.searchHand()
      }).catch(function (obj) {
      })
      this.SelectAccount = false
    },
    // 选择账户表格查询
    selectList() {
      var that = this
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",
        {
          "object": {
            "isDeleted": 0
          }
        }).then(function (obj) {
        that.tableSelect = obj.data.objects
      }).catch(function (obj) {
      })
    },
    // 关闭选择账户弹窗
    closeAccount() {
      this.SelectAccount = false;
    },
    // 回调方法，接收子组件传的参数
    headCall: function (msg) {
      this.msg = '(' + msg + ')';
    },
    // 重置
    resetHand(formName) {
      this.$refs[formName].resetFields();
    },
    closeAdd() {
      this.dialogFormVisible = false;
    },
    //获取id
    clickBanle(row, event, column) {
      this.infoStatus = row['checkTypeEX'];
      this.paymentID = row['paymentID'];
      this.reable = false;
    },
    // 表格头部背景颜色
    getRowClass({row, column, rowIndex, columnIndex}) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    handleClick(tab, event) {
      if (tab.name == 'first') {
        this.firstTab = true
        this.secondTab = false
        this.pageIndex = this.firstIndex;
        this.currentPage4 = this.firstIndex;
      }
      if (tab.name == 'second') {
        this.firstTab = false
        this.secondTab = true
        this.pageIndex = this.secondIndex;
        this.currentPage4 = this.secondIndex;
        this.variable++;
      }
    },
    // 报销弹窗
    dialogchange() {
      this.find = 0;
      this.change = false
      this.dialogFormVisible = true;
    },
    //报销弹窗查看
    dialogFind() {
      this.find = 1;
      this.change = true
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      this.pageSize = val
      let objectRequest = {}
      objectRequest.paymentType = 2;
      if (this.planID) {
        objectRequest.planID = this.planID;
      }
      if (this.user) {
        objectRequest.createUser = this.user;
      }
      if (this.startTime) {
        objectRequest.beginTime = moment(this.startTime).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.endTime) {
        objectRequest.endTime = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.checkType) {
        objectRequest.checkType = this.checkType;
      } else {
        objectRequest.checkType = '-1'
      }
      var that = this
      this.$http.post(this.GLOBAL.serverSrc + "/finance/payment/api/page", {
        "pageIndex": 1,
        "pageSize": val,
        "object": objectRequest
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(function (obj) {
        // console.log(obj.data);
        that.total = obj.data.total;
        that.tableData = obj.data.objects;
      })
      .catch(function (obj) {
        // console.log(obj)
      })
    },
    //搜索
    searchHand(params) {
      this.dialogFormVisible = params
      console.log(params, '传过来的弹窗参数')
      this.pageNum = 1;
      this.pageshow = false
      let objectRequest = {}
      objectRequest.paymentType = 2;
      if (this.ruleForm.planID) {
        objectRequest.groupCode = this.ruleForm.planID;
      }
      if (this.ruleForm.user) {
        objectRequest.createUser = this.ruleForm.user;
      }
      if (this.ruleForm.startTime) {
        objectRequest.beginTime = moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.ruleForm.endTime) {
        objectRequest.endTime = moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.ruleForm.checkType) {
        objectRequest.checkType = this.ruleForm.checkType;
      } else {
        objectRequest.checkType = '-1'
      }

      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/payment/api/page", {
          "pageIndex": this.pageNum,
          "pageSize": this.pageSize,
          "object": objectRequest,
        }
      )
        .then(function (obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
        })
        .catch(function (obj) {
          // console.log(obj)
        })
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      if (this.firstTab) {
        this.firstIndex = val
      }
      if (this.secondTab) {
        this.secondIndex = val
      }
      let objectRequest = {}
      objectRequest.paymentType = 2;
      if (this.planID) {
        objectRequest.planID = this.planID;
      }
      if (this.user) {
        objectRequest.createUser = this.user;
      }
      if (this.startTime) {
        objectRequest.beginTime = this.startTime
      }
      if (this.endTime) {
        objectRequest.endTime = this.endTime
      }
      if (this.checkType) {
        objectRequest.checkType = this.checkType;
      } else {
        objectRequest.checkType = '-1'
      }
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/payment/api/page", {
          "pageIndex": val,
          "pageSize": this.pageSize,
          "total": 0,
          "object": objectRequest,
        }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
        })
      .then(function (obj) {
        that.total = obj.data.total;
        that.tableData = obj.data.objects;
      })
      .catch(function (obj) {
        console.log(obj)
      })
    },
    //获取供应商类型
    querySearch6() {
      this.typeList = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=PaymentType')
        .then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.typeList.push({
              "value": res.data.objects[i].id,
              "label": res.data.objects[i].name
            })
          }
        })
      /*this.$http.post(this.GLOBAL.serverSrc + '/universal/suppliertype/api/get', {}).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.typeList.push({
            "value": res.data.objects[i].id,
            "label": res.data.objects[i].name
          })
        }
      }).catch(err => {
        console.log(err);
      })*/
    },
    //付款方式
    querySearch7() {
      this.payModeList = []
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payway/api/get', {
        "object": {
          id: 1,
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.payModeList.push({
            "value": res.data.objects[i].id,
            "label": res.data.objects[i].name
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //查看无收入借款弹窗
    checkIncome(row) {
      this.getRowCheckType = row.checkType
      this.paymentID = row.paymentID // 设置 paymentID 给子组件，子组件会根据这个值的变化进行页面渲染。子组件目前设置的是0，本页的也是0
      console.log(this.paymentID)
      this.checkIncomeShow = true;
      // this.ruleForm = row;
      //this.getLabel();
    },
    repeal() {
      this.$confirm("是否需要撤销该笔借款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/delete',{
        "id": this.paymentID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.$message.success("撤销成功");
          this.searchHand();
          this.checkIncomeShow = false;
        }
      })
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "撤销借款已取消"
        });
      });
    },
    CloseCheckIncomeShow() {
      this.checkIncomeShow = false;
    }
  }
}

</script>
<style lang="scss" scoped>
  .vivo{margin-bottom: 50px;}
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content {
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .line{
        text-align: center;
      }
      .status-length{
        width: 100% !important;
      }
    }
    .add-style{
      margin-left: 1%;
      margin-top: 30px;
    }
    #table-content{
      width: 98%;
      margin: 10px auto 10px;
    }
    .paging{
      margin:20px 0 10px 0;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
  }
</style>
