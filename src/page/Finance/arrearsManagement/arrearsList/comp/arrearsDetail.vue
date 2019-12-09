<template>
  <div>
       <!--备注信息弹窗-->
       <el-dialog title="详情" :visible.sync="dialogForm" class="city_list" width="1200px">
            <div class="loan-management">
            <!-- 查看无收入借款弹窗 -->
            <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
            <!-- 基本信息 -->
            <div class="item-content">
              <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
              <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
              <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
            </div>
            <!-- 第一行 -->
            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6">
                  <div class="grid-del label-color ">
                    <span v-if="keepPaymentType==1">申请人</span>
                    <span v-if="keepPaymentType==2">借款人</span>:
                  </div> 
                </el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">创建时间:</div></el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime  | formatDate  }}</div></el-col>
              </el-col>
            </el-row>
            <!-- 第一行 END -->
            <!-- 第二行 -->
            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">团期计划:</div></el-col>
                <el-col :span="18"><div class="grid-del">{{ fundamental.groupCode }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">产品名称:</div></el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.productName }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">供应商:</div></el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.supplierName }}</div></el-col>
              </el-col>
            </el-row>
            <!-- 第二行 END -->
            <!-- 第三行 -->
            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="6">
                <el-col :span="6">
                  <div class="grid-del label-color">借款类型:</div>
                </el-col>
                <el-col :span="18">
                  <div class="grid-del">{{ fundamental.supplierTypeEX }}</div>
                </el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6">
                  <div class="grid-del label-color" v-if="keepPaymentType==1">付款金额:</div>
                  <div class="grid-del label-color" v-if="keepPaymentType==2">借款金额:</div>
                </el-col>
                <el-col :span="18"><div class="grid-del">{{ fundamental.price }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.mark }}</div></el-col>
              </el-col>
            </el-row>
            <!-- 第三行 END -->
            <!-- 第四行 -->
            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">账号:</div></el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.cardNumber }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">开户行:</div></el-col>
                <el-col :span="18"><div class="grid-del">{{ fundamental.bankName }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">开户名:</div></el-col>
                <el-col :span="18"><div class="grid-del ">{{ fundamental.cardName }}</div></el-col>
              </el-col>
            </el-row>
            <!-- 第四行 END -->
            <!-- 第五行 -->
            <el-row type="flex" class="row-bg" justify="space-around" style="height:80px">
              <el-col :span="6">
                <el-col :span="6"><div class="grid-del label-color">付款方式:</div></el-col>
                <el-col :span="12">
                  <div class="grid-del">{{ fundamental.paywayEX }}</div>
                </el-col>
              </el-col>
              <el-col :span="14">
                <el-col :span="2"><div class="grid-del label-color">附件:</div></el-col>
                <el-col :span="18">
                  <el-upload
                    class="upload-demo"
                    name="files"
                    :file-list="fundamental.files"
                    :show-file-list="true"
                    action="test"
                    :disabled="true"
                    :on-preview="handlePreview"
                  >
                  </el-upload>
                </el-col>
              </el-col>
            </el-row>
            <!-- 第五行 END -->
            <!-- 基本信息 END -->
            <!-- 审核结果 -->
            <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
            <el-table :data="tableCourse" border :header-cell-style="getRowClass">
              <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
              <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
              <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
              <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
            </el-table>
            <!-- 审核结果 END -->
            <!-- 相关信息 -->
            <el-divider content-position="left" class='title-margin title-margin-t'>相关信息</el-divider>
            <el-table :data="tableMoney" border :header-cell-style="getRowClass">
              <el-table-column prop="payable" label="订单总额" align="center"></el-table-column>
              <el-table-column prop="payment" label="已审批总额" align="center"></el-table-column>
              <el-table-column prop="paymentChecking" label="审批中总额" align="center"></el-table-column>
              <el-table-column prop="expenseChecking" label="报销中总额" align="center"></el-table-column>
              <el-table-column prop="expense" label="已报销总额" align="center"></el-table-column>
              <el-table-column prop="price" label="已收总额" align="center"></el-table-column>
              <el-table-column prop="paymentChecking" label="欠款总额" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.payable - scope.row.price}}</div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 相关信息 END -->
            <!-- 无收入借款明细 -->
            <el-divider content-position="left" class='title-margin title-margin-t'>无收入借款明细</el-divider>
            <el-table :data="tableIncome" border :header-cell-style="getRowClass">
              <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
              <el-table-column prop="checkType" label="审批状态" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.checkType=='审批中'" style="color: #7F7F7F" >{{scope.row.checkType}}</div>
                  <div v-if="scope.row.checkType=='驳回'" style="color: #FF4A3D" >{{scope.row.checkType}}</div>
                  <div v-if="scope.row.checkType=='通过'" style="color: #33D174" >{{scope.row.checkType}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="supplierType" label="借款类型" align="center"></el-table-column>
              <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
              <el-table-column prop="price" label="金额" align="center"></el-table-column>
              <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
              <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
              <el-table-column prop="process" label="审批过程" align="center">
                <template slot-scope="scope">
                  <div @click="processIncome(scope.$index, scope.row,1)">查看</div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 无收入借款明细 END -->
            <!-- 预付款明细 -->
            <el-divider content-position="left" class='title-margin title-margin-t'>预付款明细</el-divider>
            <el-table :data="tablePayment" border :header-cell-style="getRowClass">
              <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
              <el-table-column prop="checkTypeEX" label="审批状态" align="center">
              </el-table-column>
              <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
              <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
              <el-table-column prop="price" label="金额" align="center"></el-table-column>
              <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
              <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
              <el-table-column prop="process" label="审批过程" align="center">
                <template slot-scope="scope">
                  <div @click="processIncome(scope.$index, scope.row,2)">查看</div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 预付款明细 END -->
            <!-- 收入明细 -->
            <el-divider content-position="left" class='title-margin title-margin-t'>收入明细</el-divider>
            <el-table :data="tableEarning" border :header-cell-style="getRowClass">
              <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
              <el-table-column prop="channel" label="订单来源" align="center"></el-table-column>
              <el-table-column prop="person" label="订单联系人" align="center"></el-table-column>
              <el-table-column prop="number" label="人数" align="center"></el-table-column>
              <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
              <el-table-column prop="priceSum" label="已收金额" align="center"></el-table-column>
              <!-- <el-table-column prop="Number(payable)-Number(paid)" label="欠款金额" align="center"></el-table-column> -->
              <el-table-column label="欠款金额" align="center" prop="arrears"></el-table-column>
              <el-table-column prop="arrearsDate" label="欠款日期" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.arrearsDate | formatDateDetails }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="repaymentDate" label="应还日期" align="center">
                <template slot-scope="scope">
                  <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.repaymentDate | formatDateDetails }}</div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 收入明细 END -->
            <!-- 审批过程-查看弹窗 -->
            <el-dialog width="45%" title="审批过程" :visible.sync="dialogFormVisible_Income" append-to-body>
              <div class="indialog">
                <el-table :data="tableIncomeCheck" border style=" width:90%;margin:30px 0 20px 25px;" :header-cell-style="getRowClass">
                  <el-table-column prop="finishedTime" label="审批时间" width="150" align="center"></el-table-column>
                  <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
                  <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
                  <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
                </el-table>
              </div>
            </el-dialog>
            <!-- 审批过程-查看弹窗 END -->
          </div>
       </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props:{
    paymentID:0,
    variable:0
  },
  data() {
    return {
      dialogForm:false,
      fundamental:{},
      tableMoney:[], // 相关信息表格
      tableEarning:[], // 收入明细表格
      tableCourse:[], // 审核结果表格
      tablePayment:[], // 预付款明细表格
      tableIncome:[], // 无收入借款明细表格
      dialogFormVisible_Income:false, // 预付款无收入借款明细查看弹窗            
      planID:'',
      keepPaymentType: null, // 弹窗中调用获取一条详情，保存paymentType类型
      tableIncomeCheck: null, // 审批过程-查看弹窗-数据
    }
  },
  // 关于时间的过滤
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    formatDateDetails:function (value) {
      if(typeof value == 'string'){
        return ''
      } else {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  },
  watch: {
      variable:function(){        
        this.dialogForm=true;    
        this.getLabel();
     }
  },
  methods: {
      moment,
    //起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined || date == '') {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    },
    // 点击图片钩子
    handlePreview(file) {
      window.open(file.url);
    },
    // 表格表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
    // 审批过程-查看
    processIncome(index,row, type){
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
        jQ_ID: row.guid,
        jQ_Type: type,
      }).then(obj => {
        this.tableIncomeCheck = obj.data.extend.instanceLogInfo;
        this.dialogFormVisible_Income = true;
      }).catch(obj => {})
    },
    // 审核结果
    auditResult(result, paramJqType) {
      var that =this
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
        jQ_ID: result,
        jQ_Type: paramJqType, // 无收入1 预付款2
      }).then(obj => {
        that.tableCourse = []
        that.tableCourse = obj.data.extend.instanceLogInfo;
      }).catch(obj => {})
    },
    // 获取一条信息
    getLabel(){
      this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
          "id":this.paymentID
      }).then(res => {
        if(res.data.isSuccess == true){
          this.tablePayment = []
          this.tableIncome = []
          this.tableMoney = []
          this.tableEarning = []
          let createUserCode = res.data.object.creatUserCode;
          let getPaymentType = res.data.object.paymentType;
          this.keepPaymentType = getPaymentType;
          this.fundamental=res.data.object;
          this.auditResult(res.data.object.guid, getPaymentType);
          if(res.data.object.planID>0){
            this.getPaymentdetails(res.data.object.planID);
          }else{
            this.bbb(createUserCode);
          }
        }
     })
    },
    // 无收入没有订单号根据登录人员查询无收入借款明细
    bbb(params){
      console.log(params)
      var that = this
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 1, // 1 无收入 2 预付款
          "createUser": params, 
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableIncome = res.data.objects
          that.tableIncome.forEach(function (v,k,arr) {
            if(arr[k]['checkType'] == 0){
              arr[k]['checkType'] = '审批中'
            }else if(arr[k]['checkType'] == 1) {
              arr[k]['checkType'] = '通过'
            }else if(arr[k]['checkType'] == 2) {
              arr[k]['checkType'] = '驳回'
            }
            if(arr[k]['supplierType'] == 1){
              arr[k]['supplierType'] = '地接'
            }else if(arr[k]['supplierType'] == 2) {
              arr[k]['supplierType'] = '机票（本公司）'
            }else if(arr[k]['supplierType'] == 3) {
              arr[k]['supplierType'] = '机票（非本公司）'
            }else if(arr[k]['supplierType'] == 4) {
              arr[k]['supplierType'] = '小费'
            }else if(arr[k]['supplierType'] == 5) {
              arr[k]['supplierType'] = '地接（其他）'
            }else if(arr[k]['supplierType'] == 6) {
              arr[k]['supplierType'] = '火车票'
            }else if(arr[k]['supplierType'] == 7) {
              arr[k]['supplierType'] = '汽车票'
            }else if(arr[k]['supplierType'] == 8) {
              arr[k]['supplierType'] = '船票'
            }else if(arr[k]['supplierType'] == 9) {
              arr[k]['supplierType'] = '其他'
            }else if(arr[k]['supplierType'] == 10) {
              arr[k]['supplierType'] = '机票押金'
            }else if(arr[k]['supplierType'] == 11) {
              arr[k]['supplierType'] = '火车票押金'
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取相关表格信息
    getPaymentdetails(val) {
      var that = this
      //预付付款明细
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 2,
          "planID": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tablePayment = res.data.objects
        }
      }).catch(err => {
        console.log(err)
      })
      // 无收入借款明细
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 1,
          "planID": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableIncome = res.data.objects
          that.tableIncome.forEach(function (v,k,arr) {
            if(arr[k]['checkType'] == 0){
              arr[k]['checkType'] = '审批中'
            }else if(arr[k]['checkType'] == 1) {
              arr[k]['checkType'] = '通过'
            }else if(arr[k]['checkType'] == 2) {
              arr[k]['checkType'] = '驳回'
            }
            if(arr[k]['supplierType'] == 1){
              arr[k]['supplierType'] = '地接'
            }else if(arr[k]['supplierType'] == 2) {
              arr[k]['supplierType'] = '机票（本公司）'
            }else if(arr[k]['supplierType'] == 3) {
              arr[k]['supplierType'] = '机票（非本公司）'
            }else if(arr[k]['supplierType'] == 4) {
              arr[k]['supplierType'] = '小费'
            }else if(arr[k]['supplierType'] == 5) {
              arr[k]['supplierType'] = '地接（其他）'
            }else if(arr[k]['supplierType'] == 6) {
              arr[k]['supplierType'] = '火车票'
            }else if(arr[k]['supplierType'] == 7) {
              arr[k]['supplierType'] = '汽车票'
            }else if(arr[k]['supplierType'] == 8) {
              arr[k]['supplierType'] = '船票'
            }else if(arr[k]['supplierType'] == 9) {
              arr[k]['supplierType'] = '其他'
            }else if(arr[k]['supplierType'] == 10) {
              arr[k]['supplierType'] = '机票押金'
            }else if(arr[k]['supplierType'] == 11) {
              arr[k]['supplierType'] = '火车票押金'
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
      //根据计划ID获取订单总额,已收款总额,总人数,已审批借款总额，审批中借款总额/
      that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
        "id": val
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableMoney = []
          that.tableMoney.push(res.data.object)
        }
      }).catch(err => {
        console.log(err)
      })
      // 收入明细
      that.$http.post(this.GLOBAL.serverSrc + '/orderquery/api/income/detail', {
        "id": val,
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableEarning = res.data.objects
        }
      }).catch(err => {
        console.log(err)
      })
    },
     




    }
}
</script>

<style scoped lang="scss">
  .el-divider__text{
      font-size: 17px !important
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .item-content{
      margin-bottom: 20px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    
    .distributor-status{
      margin-left: 40px;
    }
    .row-bg {
      padding: 13px 0;
      .grid-del{
        text-align: left;
        font-size: 14px;
      }
      .label-color{
        color: #909399;
      }
      .doc-mt-3{
        margin-top: 3px;
      }
    }
    /*表格*/
  .labelTable{margin: 0 30px 20px 30px; text-align: center;max-width: 1581px;}
  .multipleTable{margin: 0 30px 20px 30px; text-align: center;width: 1161px;}

  /*申请无收入借款弹窗*/
  .mask{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 100;}
  .noIncome{width:1100px; position:absolute; top:3%;left:50%; margin-left:-550px; background:#fff; z-index:1000; border-radius:3px;max-height: 95%;overflow:scroll;overflow-x:hidden;}
  .noIncomeTitle{margin: 30px; overflow: hidden;}
  .noIncomeTitle_l{float:left; font-size:13pt;line-height: 40px;}
  .noIncomeTitle_r{float:right;}
  .name_input{width: 200px; border:none;}
  .name_input01{width: 700px;}
  .name_button{margin-left:-5px; background:#eaeaea;color:#a4a4a4;}
  .name_button:hover{color:#a4a4a4;}
  /*申请无收入借款中借款人弹窗*/
  .indialog{min-height: 300px; overflow: hidden;}
  .mask_name{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 101;}
  .number_button{float:right; margin: 0 0 20px 0;}
  /*申请无收入借款中团期计划弹窗*/
  .plan_indialog{float:left; line-height: 40px;}
  .indialog_plan{float:left; margin: 0 10px 0 10px;}
  .indialog_input{float:left; width: 150px;}
  .indialog_input01{float:left; width: 80px;}
  .plan_indialog span{float:left; margin: 0 10px 0 10px;}
  .indialog_button{margin: 0 0 0 10px;}
  /*申请无收入借款中附件*/
  .upload-demo{width: 400px;margin-top:-30px}
  .upload-demo>>>.el-upload-list__item{ width: 300px;}

  .el-dialog__wrapper{top:-10%;}
  .upload-demo>>>.el-upload-list__item:first-child {
    margin-top: 5px;
  }
  /*基本信息*/
  .basictable{margin:0 0 0 25px;}
  .basictd{width:400px; padding:15px 0 0 0;}
  .basicspan_01{width:80px; text-align:right;}
  .basicspan_02{margin:0 0 0 10px;}
  .checkType{padding: 0 5px; width:50px; margin:10px 0 0 0; border-radius:5px; color:#fff; line-height:30px; text-align:center;}
</style>