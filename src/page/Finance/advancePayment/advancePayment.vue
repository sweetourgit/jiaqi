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
                  <el-button @click="searchHandBtn()" type="primary">搜索</el-button>
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
               </template>
            </el-table-column>
          </el-table>
          <!-- 表格 END -->
          <!-- 分页 -->
          <el-row type="flex" class="paging">
            <el-col :span="8" :offset="8">
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="ruleFormSeach.page"
                :limit.sync="ruleFormSeach.limit"
                @pagination="searchHand"
              />
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
          <el-button @click="splitRelTable()">拆分关系表</el-button>
          <el-button @click="repeal()" type="danger" plain v-if="getRowCheckType == 0">撤销</el-button>
          <el-button
            type="success"
            @click="touchPrint"
            plain
            v-if="(ifDY100009 && (presentRouter == '无收入借款管理' || presentRouter == '预付款管理') && creatUserOrgID == 490) || ( ifDY100042 && (presentRouter == '无收入借款管理' || presentRouter == '预付款管理') && creatUserOrgID != 490)"
          >
            打印本页详情信息
          </el-button>
        </div>
      <!-- 好像是和无收入借款共用一个 -->
      <checkLoanManagement :paymentID="paymentID" :groupCode="groupCode" ref="printHandle" v-if="checkIncomeShow"></checkLoanManagement>
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
import Pagination from '@/components/Pagination'
export default {
  name: "advancePayment",
  components: {
    Pagination,
    approvalToBorrow,
    AdvanceInfo,
    checkLoanManagement,
  },
  data() {
    return {
      creatUserOrgID: null, // 用来判断付款账户是否显示
      presentRouter: null, // 当前路由
      ifDY100009: false,
      ifDY100042: false,
      listLoading: true,
      tableSelect:[], // 选择弹窗表格
      SelectAccount:false, // 选择账户弹窗
      ifShowProposer: false, // 当职位为收纳额时候禁止使用申请人检索
      ruleFormSeach: {
        page: 1,
        limit: 10
      },
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
      guid: null,
    }
  },
  computed: {
    // 计算属性的 getter
    approval: function() {
      // `this` 指向 vm 实例
      return this.approvalTotal > 0 ? '您需要审批(' + this.approvalTotal + ')' : '您需要审批'
    },
    countTest:function () {
      return this.$store.state.updatAdvancePaymentData
    }
  },
  watch: {
    // 如果审批状态被驳回那么刷新预付款列表
    countTest: function (newV, oldV) {
      let _this = this
      if (newV != oldV) {
        setTimeout(function () {
          _this.searchHand()
        }, 500)
      }
    }
  },
  created () {
    if(sessionStorage.getItem('userCode') == 'DY100009') {
      this.ifDY100009 = true
    }else {
      this.ifDY100009 = false
    }
    if(sessionStorage.getItem('userCode') == 'DY100042') {
      this.ifDY100042 = true
    } else {
      this.ifDY100042 = false
    }
    this.presentRouter = this.$route.name
    this.querySearch6()
    this.querySearch7()
    this.searchHand()
    if (!sessionStorage.getItem('hasCashierInfo')) { // 只有是出纳的时候才显示申请人检索
      this.ifShowProposer = true
    }
  },
  methods: {
    // 打印详情
    touchPrint(){
      this.$refs.printHandle.printDetails()
    },
    // 搜索
    searchHandBtn(){
      this.ruleFormSeach.page = 1
      this.ruleFormSeach.limit = 10
      this.searchHand()
    },
    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    },
    moment,
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
            "isDeleted": 0,
            'orgID': sessionStorage.getItem('topID'),
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
        this.pageIndex = this.firstIndex;
        this.currentPage4 = this.firstIndex;
      }
      if (tab.name == 'second') {
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
    // 渲染列表
    searchHand(params) {
      this.listLoading = true
      if(typeof params == 'boolean'){
        this.dialogFormVisible = params
      }
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
          "pageIndex": this.ruleFormSeach.page,
          "pageSize": this.ruleFormSeach.limit,
          "object": objectRequest,
        }
      ).then(function (obj) {
        that.total = obj.data.total;
        that.tableData = obj.data.objects;
        this.listLoading = false
      }).catch(function (obj) {
        // console.log(obj)
      })
      this.$nextTick(() => {
        this.pageshow = true
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
      console.log(row,'row 预付款')
      this.guid=row.guid;
      this.getRowCheckType = row.checkType
      this.paymentID = row.paymentID // 设置 paymentID 给子组件，子组件会根据这个值的变化进行页面渲染。子组件目前设置的是0，本页的也是0
      this.checkIncomeShow = true;
      this.getLabel(row.paymentID)
    },
    // 获取一条详情（控制打印按钮）
    getLabel(paramsPaymentID){
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
        "id": paramsPaymentID
      }).then(res => {
        if(res.data.isSuccess == true){
          this.creatUserOrgID = res.data.object.creatUserOrgID
        }
      })
    },
    // 撤销该笔借款
    repeal() {
      this.$confirm("是否需要撤销该笔借款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/delete',{
        "id": this.paymentID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.$http.post(this.GLOBAL.jqUrl + "/JQ/EndProcessForJQ",{
            "jq_id": this.guid,
            "jQ_Type": 2
          }).then(res => {
            this.$message.success("撤销成功");
            this.checkIncomeShow = false;
            this.deleteBorrow();
            // this.history.go(0); // 刷新页面
          })
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
    },
    splitRelTable(){
      this.$router.push({ path: "/relationSplitMap", query: { id: this.paymentID } })
    },
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
