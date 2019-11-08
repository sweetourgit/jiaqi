<template>
  <div class="loan-management">
    <!-- 查看无收入借款弹窗 -->
    <el-divider content-position="left" class='title-margin'>基本信息{{paymentID}}</el-divider>
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
        <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
        <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="6"><div class="grid-del label-color">创建时间:</div></el-col>
        <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
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
        <el-col :span="18"><div class="grid-del ">{{ fundamental.plan_01 }}</div></el-col>
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
        <el-col :span="6"><div class="grid-del label-color">借款类型:</div></el-col>
        <el-col :span="18">
          <div class="grid-del" v-if="fundamental.paymentType == 1">无收入借款</div>
          <div class="grid-del" v-if="fundamental.paymentType == 2">预付款</div>
        </el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="6"><div class="grid-del label-color">借款金额:</div></el-col>
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
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-col :span="6"><div class="grid-del label-color">附件:</div></el-col>
        <el-col :span="18"><div class="grid-del ">{{ fundamental.files }}</div></el-col>
      </el-col>
      <el-col :span="6" v-if="fundamental.checkType=='1'">
        <el-col :span="6"><div class="grid-del label-color">支付账户:</div></el-col>
        <el-col :span="18"><div class="grid-del">{{ fundamental.cardName }}</div></el-col>
      </el-col>
      <el-col :span="6" v-if="fundamental.checkType!=='1'"></el-col>
<!--      <el-col :span="6"></el-col>-->
    </el-row>
    <!-- 第五行 END -->
    <!-- 基本信息 END -->
    <!-- 审核结果 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <el-table :data="tableCourse" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
      <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
      <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
      <el-table-column prop="No" label="审批意见" align="center"></el-table-column>
      <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
    </el-table>
    <!-- 审核结果 END -->
    <!-- 相关信息 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>相关信息</el-divider>
    <el-table :data="tableMoney" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
      <el-table-column prop="payable" label="订单总额" align="center"></el-table-column>
      <el-table-column prop="paymentChecking" label="审批中借款总额" align="center"></el-table-column>
      <el-table-column prop="payment" label="已审批借款总额" align="center"></el-table-column>
      <el-table-column prop="expenseChecking" label="报销中总额" align="center"></el-table-column>
      <el-table-column prop="expense" label="已报销总额" align="center"></el-table-column>
      <el-table-column prop="price" label="已收总额" align="center"></el-table-column>
      <el-table-column prop="supTotal" label="供应商欠款总额" align="center"></el-table-column>
    </el-table>
    <!-- 相关信息 END -->
    <!-- 无收入借款明细 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>审批过程</el-divider>
    <el-table :data="tableIncome" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
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
          <div @click="processIncome(scope.row)">查看</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 无收入借款明细 END -->
    <!-- 预付款明细 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>预付款明细</el-divider>
    <el-table :data="tablePayment" border style="width: 95%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
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
          <div @click="processIncome(scope.row)">查看</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 预付款明细 END -->
    <!-- 收入明细 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>收入明细</el-divider>
    <el-table :data="tableEarning" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
      <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="source" label="订单来源" align="center"></el-table-column>
      <el-table-column prop="contactName" label="订单联系人" align="center"></el-table-column>
      <el-table-column prop="number" label="人数" align="center"></el-table-column>
      <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="paid" label="已收金额" align="center"></el-table-column>
      <!-- <el-table-column prop="Number(payable)-Number(paid)" label="欠款金额" align="center"></el-table-column> -->
      <el-table-column label="欠款金额" align="center">
        <template slot-scope="scope">{{scope.row.payable-scope.row.paid}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="欠款日期" align="center"></el-table-column>
      <el-table-column prop="shouldAlso" label="应还日期" align="center"></el-table-column>
    </el-table>
    <!-- 收入明细 END -->
  </div>
</template>

<script>
import moment from 'moment'
  export default {
    props: {
     paymentID:0,
     groupCode:'',
     title:'',
    },
    data(){
      return {
      	 //表头切换
         empty:'',
         people:'',
         planTime:'',
         planData:'',
         //借款表格
         forbidden:true,
		    multipleSelection: [],
         tableData:[],
         fundamental:{},
         //分页
         pagesize: 10, // 设定默认分页每页显示数
         pageIndex: 1, // 设定当前页数
         total: 0,
         currentPage: 1,
         //无收入借款弹窗
         noIncomeShow:false,
         /*ruleForm: {
          name: '',
          plan:'',
          plan_01:'',
          supplier:'',
          planType:'',
          planAmount:'',
          abstract:'',
          account:'',
          accountBank:'',
          accountOpenName:'',
          payment:'',
          accessory:'',
         },*/
         ruleForm:{
         	 createUser:'',
             groupCode:'',
             plan_01:'',
             supplierName:'',
             supplierTypeEX:'',
             price:'',
             mark:'',
             cardNumber:'',
             bankName:'',
             cardName:'',
             payway:'',
             files:'',
         },
         borrowingType: [{//无收入借款类型选择器
          value: '选项1',
          label: '地接'
         }, {
          value: '选项2',
          label: '机票（本公司）'
         }, {
          value: '选项3',
          label: '机票（非本公司）'
         }, {
          value: '选项4',
          label: '小费'
         }, {
          value: '选项5',
          label: '签证'
         }],
         payment_01:[{//无收入借款支付方式选择器
          value: '选项1',
          label: '网银'
         }, {
          value: '选项2',
          label: '现金'
         }, {
          value: '选项3',
          label: '支付宝'
         }, {
          value: '选项4',
          label: '微信'
         }],
         rules: {
          name: [{ required: true, message: '请输入借款人名字', trigger: 'blur' }],
          plan: [{ required: true, message: '请输入团期计划', trigger: 'blur' }],
          plan_01: [{ required: true, message: '请输入团期计划', trigger: 'blur' }],
          supplier:[{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
          planType:[{ required: true, message: '请选择付款方式', trigger: 'blur' }],
          planAmount:[{ required: true, message: '请输入类型', trigger: 'blur' }],
          abstract:[{ required: true, message: '请输入摘要', trigger: 'blur' }],
          account:[{ required: true, message: '请输入账号', trigger: 'blur' }],
          accountBank:[{ required: true, message: '请输入开户行', trigger: 'blur' }],
          accountOpenName:[{ required: true, message: '请输入开户名', trigger: 'blur' }],
          payment:[{ required: true, message: '请选择付款方式', trigger: 'blur' }],
         },
         fileList: [],//申请无收入借款中附件信息
         //无收入借款中借款人弹窗
         dialogFormVisible1:false,
         number_name:'',
         tableName: [],//申请无收入借款中借款人选择弹窗表格
          //无收入借款中团期计划弹窗
          dialogFormVisible_plan:false,
          plan_stage:'',
          plan_name:'',
          plan_data:'',
          plan_data01:'',
          tablePlan:[],//申请无收入借款中团期计划选择弹窗表格
          //无收入借款中账户弹窗
          dialogFormVisible_account:false,
          tableAccount:[],//无收入借款中账户弹窗表格
          tableMoney:[],//无收入借款金额表格
          //无收入借款弹窗预付款明细表格
          tablePayment:[],
          //无收入借款弹窗中预付款明细查看弹窗
          dialogFormVisible_paymenrt:false,
          tableApprove:[],
          tableIncome:[], //无收入借款弹窗中无收入借款明细弹窗
          //无收入借款弹窗中预付款明细查看弹窗
          dialogFormVisible_Income:false,
          tableIncomeCheck:[{
          	times:' 2019-1-14 19:00:00',
            people:'洋洋1',
            result:'通过',
            opinion:'不同意'
          }],
          //无收入借款弹窗中收入明细表格
          tableEarning:[],
		   //查看无收入借款审批过程
		   tableCourse:[],
       planID:'',
       tour_id:0,
      }
    },
    filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    },
    methods: {

    // submit() {
    //     console.log(moment(this.createTime).format('YYYY-MM-DD'))
    // },
	  //表格表头颜色
	  getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      changeFun(val) {
        this.multipleSelection=val;
        if(this.multipleSelection.length==1){
          this.forbidden=false;
        }else{
          this.forbidden=true;
        };
        //event.cancelBubble = true;//row-click和selection-change耦合事件
      },
      clickRow(row){    //选中行复选框勾选
      	this.$refs.multipleTable.clearSelection(); //清空用户的选择
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].paymentID==row.paymentID){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      planStage(){
      	this.plan_stage = '';
      	this.plan_name = '';
      	this.plan_data = '';
      	this.plan_data01 = '';
      },
      //无收入借款中账户弹窗
      IncomeAccount(){
      	this.dialogFormVisible_account = true;
      },
      accountCancel(){
      	this.dialogFormVisible_account = false;
      },
      //无收入借款中预付款明细查看
      processPaymenrt(scope,row){
      	this.dialogFormVisible_paymenrt = true;
      },
      processIncome(scope,row){
      	this.dialogFormVisible_Income = true;
      },
      //查看无收入借款弹窗
      checkIncome(){
      	this.checkIncomeShow = true;
      },
      CloseCheckIncomeShow(){
      	this.checkIncomeShow = false;
      },
      auditResult(result) {
        var that =this
          this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
            jQ_ID: result,
            jQ_Type: 1,
          }).then(obj => {
            // var json = JSON.parse(obj.data);
            // console.log(json);
            that.tableCourse = obj.data.extend.instanceLogInfo;
          }).catch(obj => {
          })
        },
      //获取一条信息
      getLabel(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
            "id":this.paymentID
        }).then(res => {
          if(res.data.isSuccess == true){
             this.fundamental=res.data.object;
             //this.tour_id = res.data.object.planID;
             if(res.data.object.planID>0){
               this.getPaymentdetails(res.data.object.planID);
             }
             else{
              this.bbb();
             }
             this.auditResult(res.data.object.guid);
             /*res.data.object.files.forEach(function(v, k, arr) {
                  that.fileList.push({
                    "url": that.GLOBAL.imgUrl + '/upload' + arr[k]['url'],
                    "name": arr[k]['name'],
                  });
                })*/
          }
       })
      },
      /*getLabel(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
           "id":this.paymentID
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.ruleForm.createUser=data.createUser;
                 this.ruleForm.groupCode=data.groupCode;
                 this.ruleForm.plan_01=data.plan_01;
                 this.ruleForm.supplierName=data.supplierName;
                 this.ruleForm.supplierTypeEX=data.supplierTypeEX;
                 this.ruleForm.price=data.price;
                 this.ruleForm.mark=data.mark;
                 this.ruleForm.cardNumber=data.cardNumber;
                 this.ruleForm.bankName=data.bankName;
                 this.ruleForm.cardName=data.cardName;
                 this.ruleForm.payway=data.payway;
                 this.ruleForm.files=data.files;
                 this.tour_id = data.planID;
                 this.getTourByPlanId(res.data.object.planID);
                 this.getPaymentdetails(res.data.object.planID);
                 res.data.object.files.forEach(function(v, k, arr) {
                  that.fileList.push({
                    "url": that.GLOBAL.imgUrl + '/upload' + arr[k]['url'],
                    "name": arr[k]['name'],
                  });
                })

              }
        }) .catch(err => {});
      },*/
    bbb(){//无收入没有订单号根据登录人员查询无收入借款明细
      var that = this
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 1,
          "createUser": sessionStorage.getItem('userCode'),
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
    getPaymentdetails(val) {
      var that = this
      //相关信息
        that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
          "object": {
            planID: val, //团期计划ID
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.fundamental.groupCode = res.data.objects[0].groupCode
            that.fundamental.plan_01 = res.data.objects[0].title
          }
        }).catch(err => {
          console.log(err)
        })
      //预付付款明细
      that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
        "object": {
          "paymentType": 2,
          "planID": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tablePayment = res.data.objects
/*          that.tablePayment.forEach(function (v,k,arr) {
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
          })*/
        }
      }).catch(err => {
        console.log(err)
      })
      //无收入借款明细
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
        "object": {
          "id": val,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableEarning = res.data.objects
          //that.tableEarning.push(res.data.object)
        }
      }).catch(err => {
        console.log(err)
      })
    },

	    },
    watch: {
      // 如果 `dialogFormVisible` 发生改变，这个函数就会运行
      paymentID: {
        // immediate:true,
         handler:function(){
           this.getLabel();
          // this.getTourByPlanId();
         }
      }
    },
    mounted(){

    },

  }
</script>
<style scoped lang="scss">
  .loan-management{
    /*text-align: center; font-family: '微软雅黑'; font-size: 11pt;overflow: hidden; text-align: left; margin: -15px 0 100px 0;*/
    .title-margin{
      margin-bottom: 30px;
    }
    .item-content{
      margin-bottom: 20px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
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
  }

	/*搜索框*/
	.empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
	.fl{float:left; margin: 20px 0 20px 0;}
	.emptyPlan{margin: 0 0 0 30px; }
	.planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
	.time{margin: 0 0 0 10px;}
	/*重置*/
	.primary{clear: both;overflow: hidden;margin: 0 0 20px 30px;}
	/*表格*/
	.labelTable{margin: 0 30px 20px 30px; text-align: center;max-width: 1581px;}
	.multipleTable{margin: 0 30px 20px 30px; text-align: center;width: 1161px;}
	/*分页*/
	.pageList{float:right; margin: 0 30px 20px 0;}
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
	.upload-demo{width: 400px;}
	.upload-demo>>>.el-upload-list__item{ width: 300px; }

	.el-dialog__wrapper{top:-10%;}

  /*基本信息*/
  .basictable{margin:0 0 0 25px;}
  .basictd{width:400px; padding:15px 0 0 0;}
  .basicspan_01{width:80px; text-align:right;}
  .basicspan_02{margin:0 0 0 10px;}
  .checkType{padding: 0 5px; width:50px; margin:10px 0 0 0; border-radius:5px; color:#fff; line-height:30px; text-align:center;}

</style>
