<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogFormOrder" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"
      @close="cancelInfoOrder()">
      <div class="controlButton">
  	    <div class="floatL">
  	      <el-button class="ml13" @click="cancelInfoOrder()">取 消</el-button>
          <el-button class="ml13" type="primary" @click="stamp()" v-has="'print_refund'">打 印</el-button>
  	      <el-button class="ml13" type="primary" @click="undoRefund()" v-if="title == '详情' && refundList.refundStateType !='1'">撤 销</el-button>
  	    </div>
        <div class="floatL" v-if="title == '审批'">
    	    <el-button class="ml13" type="primary" @click="payAccount()" v-if="ifDY100068">支付账户</el-button>
          <!-- <el-button class="ml13" type="primary">转 办</el-button> -->
          <el-button class="ml13" type="primary" :disabled="forbidden" @click="through()">通 过</el-button>
          <el-button class="ml13" type="primary" @click="rejected()">驳 回</el-button>
        </div>
      </div>
      <div class="planBorder">
        <div>
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
                <div width="80" class="floatL fb">退款单号:</div>
                <div class="floatL ml13">{{refundList.refundCode}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">申请人:</div>
                <div class="floatL ml13">{{refundList.name}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">申请时间:</div>
                <div class="floatL ml13">{{refundList.createTime | formatDate}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="floatL fb">退款方式:</div>
                <div>
                  <div v-if="refundList.refundType=='1'" class="floatL ml13">部分退</div>
                  <div v-if="refundList.refundType=='2'" class="floatL ml13">全退</div>
                </div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">总退款:</div>
                <div class="floatL ml13">{{refundList.allRefundPrice}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">实际退款金额:</div>
                <div class="floatL ml13">{{refundList.realRefundPrice}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="floatL fb">汇款账号:</div>
                <div class="floatL ml13">{{refundList.remittanceCode}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">汇款开户行:</div>
                <div class="floatL ml13">{{refundList.remittanceBank}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">汇款开户人:</div>
                <div class="floatL ml13">{{refundList.remittancePerson}}</div>
              </td>
            <tr>
              <td width="33%">
                <div width="80" class="floatL fb">退款原由:</div>
                <div class="floatL ml13">{{refundList.reason}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">支付账户:</div>
                <div class="floatL ml13">{{payName}}</div>
              </td>
            </tr>
          </table>
        </div>
        </div>
        <div class="order-title"><span>订单详情</span></div>
        <div class="pro-info">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="floatL fb">订单ID:</div>
                <div class="floatL ml13 cursor" @click="orderDetails(1)"><u>{{refundList.orderCode}}</u></div>
              </td>
              <!-- <td width="33%">
                <div width="80" class="floatL fb">团期计划:</div>
                <div class="floatL ml13 cursor">{{refundList.groupcode}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">订单来源:</div>
                <div class="floatL ml13 cursor">{{refundList.orderChannel}}</div>
              </td> -->
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="floatL fb">订单金额:</div>
                <div class="floatL ml13">{{refundList.payable}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">已付金额:</div>
                <div class="floatL ml13">{{refundList.paid}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">未付金额:</div>
                <div class="floatL ml13">{{nonPayment}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="floatL fb">其他费用:</div>
                <div class="floatL ml13">{{refundList.otherPrice}}</div>
              </td>
              <td width="33%">
                <div width="80" class="floatL fb">整体优惠:</div>
                <div class="floatL ml13">{{refundList.entiretyFav}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="order-title"><span>部分退信息</span></div>
        <div>还需退款: {{refundList.needRefundPrice}}</div>
        <el-table :data="mark" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
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
        <!-- <div class="order-title"><span>财务信息</span></div> -->
        <div>
          <!-- <el-tabs v-model="activeName">
            <el-tab-pane label="借款" name="first">
              <el-table :data="tableBorrowing" ref="multipleTable" class="table" border>
                <el-table-column prop="paymentID" label="ID" min-width="80" align="center"></el-table-column>
                <el-table-column prop="checkType" label="审批状态" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.checkType=='审批中'" style="color: #7F7F7F">{{scope.row.checkType}}</div>
                    <div v-if="scope.row.checkType=='驳回'"style="color: #FF4A3D">{{scope.row.checkType}}</div>
                    <div v-if="scope.row.checkType=='通过'"style="color: #33D174">{{scope.row.checkType}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="paymentType" label="借款类型" min-width="120" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" min-width="80" align="center"></el-table-column>
                <el-table-column prop="price" label="金额" min-width="120" align="center"></el-table-column>
                <el-table-column prop="expensePrice" label="已报销金额" min-width="120" align="center"></el-table-column>
                <el-table-column prop="createUser" label="申请人" min-width="70" align="center"></el-table-column>
                <el-table-column label="审批过程" min-width="70" align="center">
                  <template slot-scope="scope">
                    <span class="cursor blue" @click="approvalPay(scope.row)">查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="报销" name="second">
              <el-table :data="tableAccountt" ref="multipleTable" class="table" border >
                <el-table-column prop="id" label="报销单号" min-width="120" align="center"></el-table-column>
                <el-table-column prop="checkType" label="状态" min-width="120" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.checkType=='审批中'" style="color: #7F7F7F">{{scope.row.checkType}}</div>
                    <div v-if="scope.row.checkType=='驳回'" style="color: #FF4A3D">{{scope.row.checkType}}</div>
                    <div v-if="scope.row.checkType=='通过'" style="color: #33D174">{{scope.row.checkType}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="发起时间" min-width="150"align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.createTime !='0'">{{formatDate01(new Date(scope.row.createTime))}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="该团期的报销金额" min-width="150" align="center"></el-table-column>
                <el-table-column prop="createUser" label="申请人" min-width="80" align="center"></el-table-column>
                <el-table-column label="审批过程" min-width="70" align="center">
                  <template slot-scope="scope">
                    <span class="cursor blue" @click="expense(scope.row)">查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="发票" name="third">
              <el-table :data="tableIncoice" ref="multipleTable" class="table" border >
                <el-table-column prop="id" label="发票ID" align="center"></el-table-column>
                <el-table-column prop="state" label="状态" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.state=='待开票'" style="color: #7F7F7F" >{{scope.row.state}}</div>
                    <div v-if="scope.row.state=='开票驳回'" style="color: #FF4A3D" >{{scope.row.state}}</div>
                    <div v-if="scope.row.state=='已开票'" style="color: #33D174" >{{scope.row.state}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="invoiceNumber" label="发票号码"align="center"></el-table-column>
                <el-table-column prop="invoiceHeader" label="发票抬头" align="center"></el-table-column>
                <el-table-column prop="taxpayerIDNumber" label="纳税人识别号" align="center"></el-table-column>
                <el-table-column prop="collectionType" label="直客/商户" align="center"></el-table-column>
                <el-table-column prop="localCompName" label="商户名称" align="center"></el-table-column>
                <el-table-column prop="createTime" :formatter='dateFormat' label="申请日期" align="center"></el-table-column>
                <el-table-column prop="endTime" label="开票日期" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.endTime !='0'">{{formatDate01(new Date(scope.row.endTime))}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="invoicePrice" label="发票金额" align="center">
                  <template slot-scope="scope">
                    <div>{{scope.row.invoicePrice}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="kpPrice" label="该订单开票金额" align="center"></el-table-column>
                <el-table-column prop="num" label="关联订单数" align="center"></el-table-column>
                <el-table-column prop="userName" label="申请人" align="center"></el-table-column>
                <el-table-column label="审批过程" align="center">
                  <template slot-scope="scope">
                    <span class="cursor blue" @click="checkInvoice(scope.row.id)">查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane> -->
          </el-tabs>
        </div>
        <div class="order-title"><span>审核结果</span></div>
        <el-table :data="tableAudit" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
          <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="审批过程" :visible.sync="approvalShow" width="800px" @close="closeApprova()">
      <el-table :data="approvalTable" border>
        <el-table-column prop="finishedTime" label="审批时间" min-width="180" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.approvalName !=='等待中'" style="color: #7F7F7F">{{scope.row.finishedTime}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="participantName" label="审批人" min-width="120" align="center"></el-table-column>
        <el-table-column prop="approvalName" label="审批结果" min-width="120" align="center"></el-table-column>
        <el-table-column prop="No" label="审批意见" min-width="180" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="审批过程" :visible.sync="invoiceShow" width="800px" @close="closeInvoice()">
      <el-table :data="invoiceTable" border>
        <el-table-column prop="endTime" label="审批时间" min-width="180" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.endTime !='0'">{{formatDate01(new Date(scope.row.endTime))}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="approvalUserCodeName" label="审批人" min-width="120" align="center"></el-table-column>
        <el-table-column label="审批结果" min-width="120" align="center">
          <template slot-scope="scope">
            <span>通过</span>
          </template>
        </el-table-column>
        <el-table-column label="审批意见" min-width="180" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <order-information :orderID="orderID" :orderVariable="orderVariable" :orderDialogType="orderDialogType"></order-information>
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
    <el-dialog title="退款手续费" :visible.sync="refundChargeShow" custom-class="city_list dialogOrder" style="margin-top:-100px" width="500px"
      @close="cancelRefundCharge()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelRefundCharge()">取 消</el-button>
        <el-button class="ml13" @click="paymentRefundCharge()"type="primary">确 认</el-button>
      </div>
      <div class="oh">
        <div class="floatL" style="margin:10px 0 0 0;">退款手续费:</div>
        <el-input class="refundChargeClass" placeholder="0.00" v-model="refundCharge"> </el-input>
      </div>
    </el-dialog>
    <el-dialog :title="approval" :visible.sync="dialogApproval" custom-class="city_list" style="margin-top:-100px;" width="800px"
      @close="cancelApproval()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelApproval()">取 消</el-button>
        <el-button class="ml13" @click="determine()" type="primary">确 认</el-button>
      </div>
      <div class="oh">
        <div class="floatL" v-if="approval === '审批通过'">通过说明:</div>
        <div class="floatL" v-if="approval === '审批驳回'">驳回意见:</div>
        <el-input class="opinions" type="textarea" :rows="5" placeholder="请输入内容" v-model="opinion"> </el-input>
      </div>
    </el-dialog>
    <el-dialog title="打印" :visible.sync="printShow" custom-class="city_list" style="margin-top:-100px;" width="800px"
      @close="cancelPrint()">
        <div class="controlButton">
          <el-button class="ml13" @click="cancelPrint()">取 消</el-button>
          <el-button class="ml13" type="primary" @click="print()">打印</el-button>
        </div>
        <div ref="print" class="print"> 
          <h2 class="tc">退款单</h2> 
          <div class="titlePrint">基本信息</div> 
          <table border="1" cellpadding="0" cellspacing="0" width="100%"> 
            <tr> 
              <td width="33%"> 
                <div width="80" class="floatL fb">退款单号:</div> 
                <div class="floatL ml13">{{refundList.refundCode}}</div> 
              </td> 
              <td width="33%"> 
                <div width="80" class="floatL fb">申请人:</div> 
                <div class="floatL ml13">{{refundList.name}}</div> 
              </td> 
              <td width="33%"> 
                <div width="80" class="floatL fb">申请时间:</div> 
                <div class="floatL ml13">{{refundList.createTime | formatDate}}</div> 
              </td> 
            </tr> 
            <tr> 
              <td width="33%"> 
                <div width="80" class="floatL fb">订单ID:</div> 
                <div class="floatL ml13">{{refundList.orderCode}}</div> 
              </td> 
              <td width="33%"> 
                <div width="80" class="floatL fb">总退款:</div> 
                <div class="floatL ml13">{{refundList.allRefundPrice}}</div> 
              </td> 
              <td width="33%"> 
                <div width="80" class="floatL fb">实际退款金额:</div> 
                <div class="floatL ml13">{{refundList.realRefundPrice}}</div> 
              </td> 
            </tr> 
            <tr> 
              <td width="33%"> 
                <div width="80" class="floatL fb">汇款账号:</div> 
                <div class="floatL ml13">{{refundList.remittanceCode}}</div> 
              </td> 
              <td width="33%"> 
                <div width="80" class="floatL fb">汇款开户行:</div> 
                <div class="floatL ml13">{{refundList.remittanceBank}}</div> 
              </td> 
              <td width="33%"> 
                <div width="80" class="floatL fb">汇款开户人:</div> 
                <div class="floatL ml13">{{refundList.remittancePerson}}</div> 
              </td> 
            </tr>
            <tr> 
              <td width="33%"> 
                <div width="80" class="floatL fb">支付账户:</div> 
                <div class="floatL ml13">{{payName}}</div> 
              </td> 
              <td width="33%"> 
                <div width="80" class="floatL fb">手续费:</div> 
                <div class="floatL ml13">{{refundList.refundCharge}}</div> 
              </td> 
              <!-- <td width="33%"> 
                <div width="80" class="floatL fb">团期计划:</div> 
                <div class="floatL ml13">{{refundList.groupcode}}</div> 
              </td>  -->
            </tr> 
          <!-- <tr> 
            <td width="33%"> 
              <div width="80" class="floatL fb">订单来源:</div> 
              <div class="floatL ml13">{{refundList.orderChannel}}</div> 
            </td> 
          </tr> -->
        </table>
        <div class="titlePrint">审核结果</div>
        <span v-for="(item,index) in auidtName">{{item}}<span v-if="item != ''">>></span></span>
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
      dialogFormOrder:false,
      title:"",
      refundList:{},
      tableDate:[],
      tableAudit:[],
      dialogAccount:false, 
      tableAccount:[], 
      dialogApproval:false, 
      approval:"",
      opinion:'', 
      orderCode:'',
      indentID:0,
      multipleSelection: [], 
      payID:0, 
      accountID:0,
      disbursementID:0, 
      forbidden: false,
      ifDY100068:false,
      payName:'', 
      nonPayment:0,
      mark:[],
      instanceID:0,
      refundCharge:'' ,
      refundChargeShow:false, 
      activeName: "first", 
      tableBorrowing:[], 
      tableAccountt:[], 
      tableIncoice:[], 
      planId:0,
      approvalShow:false,
      approvalTable:[],
      pid:0,
      invoiceShow:false,
      invoiceTable:[],
      auidtName:[],
      printShow:false,
    };

  },
  filters: {
    numFilter (value) {
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD')
    }
  },
  mounted () {
  },
  watch: {
    variable: function() {
      if (this.dialogType == 1) { 
        setTimeout(() => {
          this.getInvoice(this.refundID);
        },200);
        this.dialogFormOrder = true;
        this.title = "详情"
      } else if(this.dialogType == 2){  
        setTimeout(() => {
          this.getInvoice(this.refundID,this.workID);
        },200);
        this.dialogFormOrder = true;
        this.title = "审批"
      }
     setTimeout(() => {
      this.getOrder(this.refundList.orderID);
     },500);
      if(sessionStorage.getItem('userCode') == 'DY100068'){
        this.ifDY100068 = true;
      }else{
        this.ifDY100068 = false;
      }
    },
  },
  methods: {
    formatDate01(date) {
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
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
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
      this.multipleSelection = val;
    },
    clickRow(row) {
      this.$refs.multipleTable.clearSelection(); 
      this.$refs.multipleTable.toggleRowSelection(row);
      this.payID = this.multipleSelection[0].id;
      console.log(this.payID)
    },
    rowClass({row, rowIndex}){  
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].id==row.id){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    cancelInfoOrder(){ 
      this.dialogFormOrder = false;
      this.tableDate = [];
      this.tableAudit = [];
      this.orderCode = '';
      this.payName = '';
      this.tableBorrowing = [];
      this.tableAccountt = [];
      this.activeName = 'first';
      this.auidtName = [];
      //document.getElementsByClassName("print")[0].style.display="none";
    },
    getJqId(result){ 
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ_BY_InstanceID',{
        "instanceId":this.instanceID,
        // "jq_id":result,
        // "jQ_Type":6,
      }).then(obj => {
        this.tableAudit = [];
        this.tableAudit = obj.data.extend.instanceLogInfo;
        for(var i=0;i<obj.data.extend.instanceLogInfo.length;i++){
          this.auidtName.push(obj.data.extend.instanceLogInfo[i].participantName)
        }
        console.log(this.auidtName)
        console.log(this.tableAudit)
      })
    },
    getOrder(ID){ 
      this.$http.post(this.GLOBAL.serverSrc + "/order/refund/api/get", {
          id:ID,
      }).then(res => {
        if (res.data.isSuccess == true){
          let orderInfo = res.data.object;
          if(this.refundList.refundStateType==1){
             this.nonPayment = this.refundList.payable - (this.refundList.paid - this.refundList.realRefundPrice);
          }else{
             this.nonPayment = this.refundList.payable - this.refundList.paid;
          }
          this.nonPayment=this.nonPayment>0?this.nonPayment:0;
        }
      })
    },
    getInvoice(ID){
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/get", {
        id: ID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.refundList = res.data.object;
          this.orderCode = res.data.object.orderCode;
          this.indentID = res.data.object.orderID;
          this.instanceID = res.data.object.instanceID;
          this.getJqId(this.orderCode);
          this.tableDate = res.data.object.guests;
          this.mark = res.data.object.mark==""?[]:JSON.parse(res.data.object.mark);
          this.accountID = res.data.object.id;
          console.log(this.accountID)
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
          this.planId = res.data.object.planID;
          this.getBorrowing(ID)
        }
      });
    },
    orderDetails(i){ 
      this.orderVariable++;
      this.orderDialogType = i;
      this.orderID = this.indentID;
      this.dialogFormOrder = false;
    },
    cancelAccount(){ 
      this.dialogAccount = false;
      this.tableAccount = [];
      this.dialogFormOrder = true;
    },
    payAccount(){ 
      this.dialogAccount = true;
      this.dialogFormOrder = false;
      this.accountList();
    },
    accountList() { 
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
    payment(){
      this.refundChargeShow = true;
    },
    cancelRefundCharge(){ 
      this.refundChargeShow = false;
      this.refundCharge = '';
    },
    paymentRefundCharge(){
      // let paymentAccount = this.refundList;
      // paymentAccount.payID = this.payID;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/save",{
        object:{
          id:this.accountID,
          payID:this.payID,
          refundCharge:this.refundCharge == '' ? 0 : this.refundCharge,
        }
      })
      .then(res => {
        if(res.data.isSuccess == true){
           this.dialogAccount = false;
           this.forbidden = false;
           this.cancelRefundCharge();
           this.getInvoice(this.accountID)
        }else{
           this.$message.success("申请失败");
        }
    })
    },
    cancelApproval(){ 
      this.dialogApproval = false ;
      this.opinion = '';
    },
    through(){ 
      this.dialogApproval = true ;
      this.approval = '审批通过';
      if(this.disbursementID == 0 && this.ifDY100068 == true){
        this.forbidden = true;
        this.$message.error("请先选择支付账户")
      } else{
        this.forbidden = false;
      }
    },
    insertEBS(){ 
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/insertebs",{
        refundID:this.accountID,
        accountID:this.payID,
      })
    },
    rejected(){ 
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
    passRefund(){ 
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
            if(this.ifDY100068 == true){ // 通过后推送EBS
              this.insertEBS(this.accountID);
            }
            this.$message.success("退款申请通过");
          }else if(code == 1){
            this.$message.success("退款申请失败");
          }
      })
    },
    reject(){ 
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
            //this.EndProcessForJQ();
            this.EndProcess(); 
            this.updateReject();
            this.$message.success("退款驳回成功");
          }else {
            this.$message.success("退款驳回失败");
          }

        })
    },
    EndProcessForJQ(){
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/EndProcessForJQ', {
        "jQ_id":this.orderCode,
        "jQ_Type":6,
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
          guests:this.tableDate,
          refundStatus:2
        }
      })
    },
    updateUndo(){ 
      if(this.tableDate.length>0){
        for(var i= 0 ; i < this.tableDate.length ; i ++){
          this.tableDate[i].refundStatus = 0;
        }
        this.$http.post(this.GLOBAL.serverSrc + "/order/guest/refundstat/update",{
          objects:this.tableDate
        }).then(res => {

        })
      }
    },
    updateCode(){
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/code",{
        ordercode:this.orderCode
      }).then(res => {

        })
    },
    delRefund(){
      this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/delete",{
        id:this.accountID
      }).then(res => {
          if(res.data.isSuccess == false){
            this.$message.success("退款完成后,不允许撤销");
          }
        })
    },
    undoRefund(){ 
      this.$confirm("是否需要撤销该笔退款?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      }).then(() => {
          this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/get", {
            id: this.accountID
          }).then(res => {
            if (res.data.isSuccess == true) {
              var refundStateType = res.data.object.refundStateType;
              if(refundStateType == 1){
                this.$message.success("该订单已退款成功,不允许撤销");
              } else {
                this.dialogFormOrder = false;
                this.EndProcessForJQ();
                if(this.tableDate.length > 0){
                  this.updateUndo();
                  this.updateCode();
                }else {
                  this.updateCode();
                }
                this.delRefund();
              }
            }
          });

          //this.$parent.pageList(1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    getBorrowing(val) {
        var that = this;
        that.$http
          .post(this.GLOBAL.serverSrc + "/finance/payment/api/list", {
            object: {
              planID: this.planId,
              checkType:-1
            }
          })
          .then(res => {
            if (res.data.isSuccess == true) {
              that.tableBorrowing = res.data.objects;
              that.tableBorrowing.forEach(function(v, k, arr) {
                if (arr[k]["checkType"] == 0) {
                  arr[k]["checkType"] = "审批中";
                } else if (arr[k]["checkType"] == 1) {
                  arr[k]["checkType"] = "通过";
                } else if (arr[k]["checkType"] == 2) {
                  arr[k]["checkType"] = "驳回";
                }
                if (arr[k]["supplierType"] == 1) {
                  arr[k]["supplierType"] = "地接";
                } else if (arr[k]["supplierType"] == 2) {
                  arr[k]["supplierType"] = "机票（本公司）";
                } else if (arr[k]["supplierType"] == 3) {
                  arr[k]["supplierType"] = "机票（非本公司）";
                } else if (arr[k]["supplierType"] == 4) {
                  arr[k]["supplierType"] = "小费";
                } else if (arr[k]["supplierType"] == 5) {
                  arr[k]["supplierType"] = "地接（其他）";
                } else if (arr[k]["supplierType"] == 6) {
                  arr[k]["supplierType"] = "火车票";
                } else if (arr[k]["supplierType"] == 7) {
                  arr[k]["supplierType"] = "汽车票";
                } else if (arr[k]["supplierType"] == 8) {
                  arr[k]["supplierType"] = "船票";
                } else if (arr[k]["supplierType"] == 9) {
                  arr[k]["supplierType"] = "其他";
                } else if (arr[k]["supplierType"] == 10) {
                  arr[k]["supplierType"] = "机票押金";
                } else if (arr[k]["supplierType"] == 11) {
                  arr[k]["supplierType"] = "火车票押金";
                }
                if (arr[k]["paymentType"] == 1) {
                  arr[k]["paymentType"] = "无收入借款";
                } else if (arr[k]["paymentType"] == 2) {
                  arr[k]["paymentType"] = "预付款";
                }
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
        that.$http.post(this.GLOBAL.serverSrc + "/finance/expense/api/list", {
          object: {
            planID: this.planId,
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.tableAccountt = res.data.objects;
            that.tableAccountt.forEach(function(v, k, arr) {
              if (arr[k]["checkType"] == 0) {
                arr[k]["checkType"] = "审批中";
              } else if (arr[k]["checkType"] == 1) {
                arr[k]["checkType"] = "通过";
              } else if (arr[k]["checkType"] == 2) {
                arr[k]["checkType"] = "驳回";
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
        that.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/listbyordercode", {
          //orderCode: "15841608842413527016"
          orderCode: this.orderCode
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.tableIncoice = res.data.objects;
            that.tableIncoice.forEach(function(v, k, arr) {
              if(arr[k]['state'] == 1){
                arr[k]['state'] = '待开票'
              }else if(arr[k]['state'] == 2) {
                arr[k]['state'] = '已开票'
              }else if(arr[k]['state'] == 3) {
                arr[k]['state'] = '开票驳回'
              }
              if(arr[k]['collectionType'] == 1){
                arr[k]['collectionType'] = '商户'
              }else if(arr[k]['collectionType'] == 2) {
                arr[k]['collectionType'] = '直客'
              };
            })
          }
        })
    },
    checkInvoice(status){ 
      this.invoiceShow = true;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/get",{
        id:status
      }).then (res => {
        if(res.data.isSuccess == true){
          this.invoiceTable.push(res.data.object);
        }
      })
    },
    closeInvoice(){
      this.invoiceShow = false;
      this.invoiceTable = [];
    },
    approvalPay(row) {
      this.pid = row.guid; //
      this.paymentType = row.paymentType;
      this.infoForJQ();
      this.approvalShow = true;
    },
    infoForJQ() {
      var that = this;
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/GetInstanceActityInfoForJQ", {
          jQ_ID: this.pid,
          jQ_Type: this.paymentType == "无收入借款" ? 1 : 2
        })
        .then(obj => {
          that.approvalTable = obj.data.extend.instanceLogInfo;
        })
        .catch(obj => {});
    },
    expense(row) {
      this.pid = row.guid;
      this.expenserJQ();
      this.approvalShow = true;
    },
    expenserJQ() {
      var that = this;
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/GetInstanceActityInfoForJQ", {
          jQ_ID: this.pid,
          jQ_Type: 3
        })
        .then(obj => {
          that.approvalTable = obj.data.extend.instanceLogInfo;
        })
        .catch(obj => {});
    },
    closeApprova() {
      this.approvalTable = [];
    },
    stamp(){
      this.printShow = true;
    },
    print(formName) {
      // document.getElementsByClassName("print")[0].style.display="block";
      this.printShow = false;
      this.$print(this.$refs.print);
      // setTimeout(() => {
      //   this.$print(this.$refs.print)
      // },200);
    },
    cancelPrint(){
      this.printShow = false;
      this.auidtName = [];
    },

  }
};
</script>

<style scoped>
.planBorder{width: 95%;margin: 0 30px 10px 0;font-size: 14px;line-height: 25px;}
.order-title{font-size: 14pt; color:#000;line-height: 40px;}
.controlButton{position: absolute; top: 8px; right: 10px;}
.floatL{float: left;}
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
.refundChargeClass{float: left;margin: 0 0 0 13px; width: 200px;}
.print{ width: 99%; color: black; margin: 0 auto 20px; overflow: hidden; line-height: 30px;}
.titlePrint{line-height: 40px;}
.tc{text-align: center;}
</style>
