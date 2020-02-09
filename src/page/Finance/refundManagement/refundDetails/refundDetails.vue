<template>
  <div>
    <!--详情-->
    <el-dialog :title="title" :visible.sync="dialogFormOrder" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"
      @close="cancelInfoOrder()">
      <div class="controlButton">
  	    <div class="fl">
  	      <el-button class="ml13" @click="cancelInfoOrder()">取 消</el-button>
  	      <el-button class="ml13" type="primary" @click="undoRefund()" v-if="title == '详情' && refundList.refundStateType !='1'">撤 销</el-button>
  	    </div>
        <div class="fl" v-if="title == '审批'">
    	    <el-button class="ml13" type="primary" @click="payAccount()" v-if="ifDY100068">支付账户</el-button>
          <!-- <el-button class="ml13" type="primary">转 办</el-button> -->
          <el-button class="ml13" type="primary" :disabled="forbidden" @click="through()">通 过</el-button>
          <el-button class="ml13" type="primary" @click="rejected()">驳 回</el-button>
        </div>
      </div>
      <div class="planBorder">
        <div class="order-title"><span>基本信息</span></div>
        <div>
          <div v-if="refundList.refundStateType=='0'" class="state01">申请退款</div>
          <div v-if="refundList.refundStateType=='1'" class="state02">退款完成</div>
          <div v-if="refundList.refundStateType=='2'" class="state04">拒绝退款</div>
        </div>
        <div class="pro-info">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款单号:</div>
                <div class="fl ml13">{{refundList.refundCode}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">申请人:</div>
                <div class="fl ml13">{{refundList.name}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">申请时间:</div>
                <div class="fl ml13">{{refundList.createTime | formatDate}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款方式:</div>
                <div>
                  <div v-if="refundList.refundType=='1'" class="fl ml13">部分退</div>
                  <div v-if="refundList.refundType=='2'" class="fl ml13">全退</div>
                </div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">总退款:</div>
                <div class="fl ml13">{{refundList.allRefundPrice}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">实际退款金额:</div>
                <div class="fl ml13">{{refundList.realRefundPrice}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">汇款账号:</div>
                <div class="fl ml13">{{refundList.remittanceCode}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">汇款开户行:</div>
                <div class="fl ml13">{{refundList.remittanceBank}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">汇款开户人:</div>
                <div class="fl ml13">{{refundList.remittancePerson}}</div>
              </td>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">退款原由:</div>
                <div class="fl ml13">{{refundList.reason}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">支付账户:</div>
                <div class="fl ml13">{{payName}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="order-title"><span>订单详情</span></div>
        <div class="pro-info">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">订单ID:</div>
                <div class="fl ml13 cursor" @click="orderDetails(1)"><u>{{refundList.orderCode}}</u></div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">订单金额:</div>
                <div class="fl ml13">{{refundList.payable}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">已付金额:</div>
                <div class="fl ml13">{{refundList.paid}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl fb">未付金额:</div>
                <div class="fl ml13">{{refundList.payable - refundList.paid}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">其他费用:</div>
                <div class="fl ml13">{{refundList.otherPrice}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl fb">整体优惠:</div>
                <div class="fl ml13">{{refundList.entiretyFav}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="order-title"><span>部分退信息</span></div>
        <div>还需退款: {{refundList.needRefundPrice}}</div>
        <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="enrollName" label="报名类型" align="center"></el-table-column>
          <el-table-column prop="singlePrice" label="价钱" align="center"></el-table-column>
          <el-table-column prop="cnName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
          <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
          <el-table-column label="性别" align="center">
            <template slot-scope="scope">
               <span v-if="scope.row.sex===0">男</span>
               <span v-if="scope.row.sex===1">女</span>
               <span v-if="scope.row.sex===3">未选择</span>
          </template>
          </el-table-column>
        </el-table>
        <div class="order-title"><span>审核结果</span></div>
        <el-table :data="tableAudit" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
          <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <order-information :orderID="orderID" :orderVariable="orderVariable" :orderDialogType="orderDialogType"></order-information>
    <!--支付账户弹窗-->
    <el-dialog title="选择账户" :visible.sync="dialogAccount" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1000px"
      @close="cancelAccount()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelAccount()">取 消</el-button>
        <el-button class="ml13" @click="payment()"type="primary">确 认</el-button>
      </div>
      <el-table :data="tableAccount" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass"
        :cell-style="getCellClass" @selection-change="changeFun" @row-click="clickRow">
        <el-table-column label="类型" prop="cardType" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cardType===1">收款</span>
            <span v-if="scope.row.cardType===2">付款</span>
            <span v-if="scope.row.cardType===3">应收</span>
            <span v-if="scope.row.cardType===4">应付</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
        <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
        <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
        <el-table-column prop="openingName" label="开户人" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <!--通过、驳回弹窗-->
    <el-dialog :title="approval" :visible.sync="dialogApproval" custom-class="city_list" style="margin-top:-100px;" width="800px"
      @close="cancelApproval()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelApproval()">取 消</el-button>
        <el-button class="ml13" @click="determine()" type="primary">确 认</el-button>
      </div>
      <div class="oh">
        <div class="fl" v-if="approval === '审批通过'">通过说明:</div>
        <div class="fl" v-if="approval === '审批驳回'">驳回意见:</div>
        <el-input class="opinions" type="textarea" :rows="5" placeholder="请输入内容" v-model="opinion"> </el-input>
      </div>
    </el-dialog>
  </div> 
</template>
<script>
import moment from "moment";
import orderInformation from "./orderInformation/orderInformation";
export default {
  name: "refundDetails",
  components: {
    orderInformation
  },
  props: {
    refundID:0,
    variable: 0,
    dialogType: 0,
    workID:0,
  },
  data() {
    return {
      orderID:0,
      orderVariable:0,
      orderDialogType:0,
      dialogFormOrder:false,// 详情弹窗
      title:"",//退款记录和审批标题
      refundList:{},// 基本信息数组
      tableDate:[],// 详情弹窗部分退信息表格
      tableAudit:[],// 详情页面审核结果表格
      dialogAccount:false, // 支付账户弹窗
      tableAccount:[], // 支付账户表格
      dialogApproval:false, // 通过驳回弹窗
      approval:"",// 通过驳回标题
      opinion:'', // 通过驳回输入框
      orderCode:'',// 获取orderCode来获取审核结果
      indentID:0,
      multipleSelection: [], //选中的list
      payID:0, //选择支付账户获取账户ID
      accountID:0,
      disbursementID:0, // 获取详情时支付账户的id
      forbidden: false,
      ifDY100068:false,
      payName:'', // 选择支付账户，通过ID获取名字
    };

  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    formatDate: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD')
    }
  },
  mounted () {
  },
  watch: {
    variable: function() {
      if (this.dialogType == 1) { // 退款记录详情
        setTimeout(() => {
          this.getInvoice(this.refundID);
        },200);
        this.dialogFormOrder = true;
        this.title = "详情"
      } else if(this.dialogType == 2){  // 审批详情
        setTimeout(() => {
          this.getInvoice(this.refundID,this.workID);
          console.log(this.workID)
        },200);
        this.dialogFormOrder = true;
        this.title = "审批"
      }
      if(sessionStorage.getItem('userCode') == 'DY100068'){
        this.ifDY100068 = true;
      }else{
        this.ifDY100068 = false;
      }
    },
  },
  methods: {
    formatDate01(date) {//时间转化
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d;
    },
    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    }, 
    getRowClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    changeFun(val) {
      //保存选中项的数据
      this.multipleSelection = val;
    },
    clickRow(row) {
      //选中行复选框勾选
      this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
      this.$refs.multipleTable.toggleRowSelection(row);
      this.payID = this.multipleSelection[0].id;
      console.log(this.payID)
    },
    rowClass({row, rowIndex}){  //选中行样式改变
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].id==row.id){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    cancelInfoOrder(){ // 关闭详情弹窗
      this.dialogFormOrder = false;
      this.tableDate = [];
      this.tableAudit = [];
      this.orderCode = '';
      this.payName = '';
    },
    getJqId(result){ // 获取审批结果tableAudit
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ',{
        "jq_id":result,
        "jQ_Type":6,
      }).then(obj => {
        this.tableAudit = [];
        this.tableAudit = obj.data.extend.instanceLogInfo;
      })
    },
    getInvoice(ID){//详情弹窗
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/get", {
        id: ID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.refundList = res.data.object;
          this.orderCode = res.data.object.orderCode;
          this.indentID = res.data.object.orderID;
          this.getJqId(this.orderCode);
          this.tableDate = res.data.object.guests;
          this.accountID = res.data.object.id;
          this.disbursementID = res.data.object.payID;
          this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/get",{
              id:this.disbursementID,
           }).then(res => {
              if(res.data.isSuccess == true){
                this.payName = res.data.object.title;
              }
           })
          if(this.disbursementID == 0 && this.ifDY100068 == true){
            this.forbidden = true;
          }else{
            this.forbidden = false;
          }
        }
      });
    },
    orderDetails(i){ // 点击订单ID出现弹窗
      this.orderVariable++;
      this.orderDialogType = i;
      this.orderID = this.indentID;
      this.dialogFormOrder = false;
    },
    cancelAccount(){ // 支付账户点击取消弹窗隐藏
      this.dialogAccount = false;
      this.tableAccount = [];
      this.dialogFormOrder = true;
    },
    payAccount(){ // 支付账户点击支付账户弹窗显示
      this.dialogAccount = true;
      this.dialogFormOrder = false;
      this.accountList();
    },
    accountList() { // 点击支付账户查询列表
    console.log(sessionStorage.getItem("id"))
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",
        {
          "object": {
          	"orgID": sessionStorage.getItem('topID'),
            "isDeleted": 0
          },
        },)
        .then(function (obj) {
          that.tableAccount = obj.data.objects
        })
        .catch(function (obj) {
          console.log(obj)
        })
    },
    payment(){ // 选择支付账户
      // let paymentAccount = this.refundList;
      // paymentAccount.payID = this.payID;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/save",{
        object:{
          id:this.accountID,
          payID:this.payID,
        }
      })
      .then(res => {
        if(res.data.isSuccess == true){
           this.dialogAccount = false;
           this.forbidden = false;
           this.getInvoice(this.accountID)
        }else{
           this.$message.success("申请失败");
        }
    })
    },
    cancelApproval(){ // 通过、驳回弹窗取消
      this.dialogApproval = false ;
      this.opinion = '';
    },
    through(){ // 点击通过显示弹窗
      this.dialogApproval = true ;
      this.approval = '审批通过';
      if(this.disbursementID == 0 && this.ifDY100068 == true){
        this.forbidden = true;
        this.$message.error("请先选择支付账户")
      } else{
        this.forbidden = false;
      }
    },
    rejected(){ // 点击驳回显示弹窗
      this.dialogApproval = true ;
      this.approval = '审批驳回';
    },
    determine(){
      if(this.approval == '审批通过'){
        this.passRefund();
      } else {
        this.reject();
      }
      this.dialogApproval = false ;
    },
    passRefund(){ //通过方法
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ_InsertOpinion', {
        "jQ_ID":this.orderCode,
        "jQ_Type":6,
        "userCode":sessionStorage.getItem('tel'),
        "workItemID":this.workID,
        "commentText":this.opinion,
      }).then(res =>{
          var data = new Function('return ' + res.data)();
          let code = data.code;
          if(code == 0){
            this.dialogApproval = false;
            this.dialogFormOrder = false;
            this.$parent.commission();
            this.$message.success("退款申请通过");
          }else if(code == 1){
            this.$message.success("退款申请失败");
          }
      })
    },
    reject(){ // 驳回方法
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ_InsertOpinion', {
        "jQ_ID":this.orderCode,
        "jQ_Type":6,
        "userCode":sessionStorage.getItem('tel'),
        "workItemID":this.workID,
        "commentText":this.opinion,
      }).then(res =>{
          var data = new Function('return ' + res.data)();
          let code = data.code;
          if(code == 0){
            this.dialogApproval = false;
            this.dialogFormOrder = false;
            this.$parent.commission();
            this.EndProcess(); // 工作流结束
            this.updateReject();// 业务驳回
            this.$message.success("退款驳回成功");
          }else {
            this.$message.success("退款驳回失败");
          }
          
        })
    },
    EndProcess(){
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/EndProcess', { 
        "jQ_id":this.orderCode,
        "jQ_Type":6,
      })
    },
    updateReject(){
      for(var i= 0 ; i < this.tableDate.length ; i ++){
        this.tableDate[i].refundStatus = 2
      }
      this.$http.post(this.GLOBAL.serverSrc + "/order/refundstat/api/update",{
        object:{
          orderCode :this.orderCode,
          guests:this.tableDate
        }
      })
    },
    updateUndo(){ // 撤销业务接口
      if(this.tableDate.length>0){
      for(var i= 0 ; i < this.tableDate.length ; i ++){
        this.tableDate[i].refundStatus = 0;
        console.log(this.tableDate)
      }
      this.$http.post(this.GLOBAL.serverSrc + "/order/guest/refundstat/update",{
        objects:this.tableDate
      }).then(res => {
        
      })
      }
    },
    delRefund(){
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/delete",{
        id:this.accountID
      }).then(res => {

        })
    },
    undoRefund(){ // 撤销该条退款
      this.$confirm("是否需要撤销该笔退款?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      }).then(() => {
          this.dialogFormOrder = false;
          this.EndProcess();
          this.updateUndo();
          this.delRefund();
          this.$parent.pageList(1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
  }
};
</script>

<style scoped>
/*下单弹窗团期信息样式*/
.planBorder{width: 95%;margin: 0 30px 10px 0;font-size: 14px;line-height: 25px;}
.order-title{font-size: 14pt; color:#000;line-height: 40px;}
.controlButton{position: absolute; top: 8px; right: 10px;}
.fl{float: left;}
.fb{font-weight: bold;}
.ml13{margin: 0 0 0 13px;}
.state01{text-align: center; background: #ffaa00; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;}
.state02{text-align: center; background: #008000; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;float: left;}
.state03{color:#008000;float: left; line-height: 30px; margin: 10px 0 0 10px; font-weight: bold;}
.state04{text-align: center; background: #eb0000; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;}
.pro-info{margin: 15px 0 20px 0;line-height: 30px;}
.table{margin: 10px 0 10px 0;padding:1px;}
.w200{width: 200px;}
.associated{background: #e6f3fc;border: 1px solid #d5f0fc; line-height: 30px;border-radius: 5px;overflow: hidden;}
.warning{float: left;color: #108ee9;margin: 0 0 0 15px;font-size: 16px;}
.relateditems{color: #108ee9; margin: 0 5px 0 5px;}
.aggregate{margin: 0 0 0 15px;float: left;}
.aggregate span{ margin: 0 0 0 15px;}
.w150{width: 150px;}
.validation{color: red;width: 150px;line-height: 30px;}
.cursor {cursor: pointer;}
.oh{overflow: hidden;}
.opinions{float: left;margin: 0 0 0 13px; width: 500px;}
</style>