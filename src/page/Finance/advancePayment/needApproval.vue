<template>
  <div class="distributor-content">
    <!-- 检索 -->
    <div class="plan">
      <!-- <div class="fl">
        <span class="emptyPlan">团期计划</span>
        <el-input v-model="empty_01" class="empty" clearable placeholder="请输入团期计划"></el-input>
      </div>
      <div class="fl">
        <span class="emptyPlan">申请人</span>
        <el-input v-model="people_01" class="empty" clearable placeholder="请输入申请人"></el-input>
      </div> -->
      <el-form :model="ruleFormSeach" ref="ruleFormSeach" label-width="80px" id="form-content">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item label="团期计划:" prop="groupCode_01">
              <el-input v-model="ruleFormSeach.groupCode_01" placeholder="请输入团期计划"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借款人:" prop="borrower">
              <el-input v-model="ruleFormSeach.borrower" placeholder="请输入借款人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="申请时间:">
              <el-col :span="11">
                <el-form-item prop="planTime_01">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSeach.planTime_01" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="planData_01">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSeach.planData_01" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="text-align: center">
            <el-form-item>
              <el-button @click="planSelect()" type="primary">搜索</el-button>
              <el-button @click="emptyButton_01('ruleFormSeach')" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 检索 END -->
    <!-- 需要审批表格 -->
    <el-table :data="tableData" ref="multipleTable" class="multipleTable" :header-cell-style="getRowClass" border @row-click="clickBanle" id="table-content">
      <el-table-column prop="paymentID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="createTime":formatter='dateFormat' label="发起时间" width="180" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
      <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="审批" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="checkIncome(scope.row)" type="text" size="small" class="table_details">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 需要审批表格 END-->
    <!--分页-->
    <!-- <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination> -->
    <!-- 借款申请详情 -->
    <el-dialog title="借款申请详情" :visible.sync="detailstShow" width="1100px" custom-class="city_list" :show-close='false'>
      <!-- <div style="line-height:30px; background:#d2d2d2;padding:0 10px; border-radius:5px; position:absolute; top:13px; left:100px;">审核中</div> -->
      <div style="position:absolute; top:8px; right:10px;">
        <!-- <el-button @click="CloseCheckIncomeShow()">取消</el-button>
        <el-button type="danger" @click="repeal()" v-if="status == '审批中'" plain>撤销借款</el-button> -->
        <el-button @click="closeDetailstShow()">取消</el-button>
        <el-button @click="through()" type="danger" plain>通过</el-button>
        <el-button @click="rejected()" type="danger" plain>驳回</el-button>
      </div>
<!--      <checkLoanManagement :paymentID="paymentID" :groupCode="groupCode"></checkLoanManagement>-->
    </el-dialog>
    <!-- 借款申请详情 END -->
    <!-- 通过、驳回弹框 -->
    <el-dialog :title="title" :visible.sync="transitShow" width="40%" custom-class="city_list" :show-close='false'>
      <div class="transit" @click="closeTransit()">×</div>
      <textarea rows="8" v-model="commentText" style="overflow: hidden; width:99%;margin:0 0 20px 0;"></textarea>
      <div style="float:right; margin:0 0 30px 0;">
        <el-button @click="closeTransit()">取消</el-button>
        <el-button @click="confirm()" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <!-- 通过、驳回弹框 END -->
  </div>
</template>

<script>
  // import checkLoanManagement from './checkLoanManagement/checkLoanManagement'
  import moment from 'moment'
  export default {
    name: "approvalToBorrow",
    components: {
      // checkLoanManagement,
    },
    data(){
      return {
        ruleFormSeach: {
          groupCode_01: '',
          borrower: '',
          startTime: '',
          endTime: ''
        },
        paymentID:0,
        groupCode:'', //表头切换
        empty_01:'',
        people_01:'',
        planTime_01:'',
        planData_01:'', //借款表格
        tableData:[], // 需要审批表格数据
        currentPage: 1,
        total:0,
        pagesize:10,
        detailstShow:false,// 查看详情弹窗
        fundamental:{}, // 查看详情基本信息数组
        tableMoney:[], // 无收入借款金额表格
        tablePayment:[], // 无收入借款弹窗预付款明细表格
        dialogFormVisible_paymenrt:false, // 无收入借款弹窗中预付款明细查看弹窗
        tableIncome:[], //无收入借款弹窗中无收入借款明细弹窗
        dialogFormVisible_Income:false, // 无收入借款弹窗中预付款明细查看弹窗
        tableEarning:[], // 无收入借款弹窗中收入明细表格
        checkIncomeShow:false, // 查看无收入借款弹窗
        tableCourse:[], // 查看无收入借款审批过程
        tour_id:0,
        multipleSelection: [],
        pid:'',
        arr1:[],
        guid:'',
        transitShow:false, // 通过驳回弹窗
        title:"",
        commentText:'',
      }
    },
    created(){
      this.pageList();
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
      // 重置
      emptyButton_01(){
        this.empty_01 = '';
        this.people_01 = '';
        this.planTime_01 = '';
        this.planData_01 = '';
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      // 检索
      planSelect(){
        let getJqId = []
        this.$http.post('http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=FlowModel')  // workflowCode获取FlowModel传递（工作流模型名称）
          .then(obj => {
            this.$http.post('http://test.dayuntong.com/h3wf/JQ/GettingUnfinishedTasksForJQ', {
              "userCode": sessionStorage.getItem('userCode'),
              "startTime": this.planTime_01 ? moment(this.planTime_01).format('YYYY-MM-DD') : '',
              "endTime": this.planData_01 ? moment(this.planData_01).format('YYYY-MM-DD') : '',
              "startIndex": this.currentPage,
              "endIndex": this.pagesize,
              "workflowCode": obj.data.objects[0].name
            }).then(res => {
              let keepRes = res.data
              keepRes.forEach(function (item) {
                getJqId.push(item.jq_ID)
              })
              this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/listforguid', { // 通过GUID查找无收入/预付款列表
                "guid": getJqId
              }).then(obj =>{
                this.tableData = obj.data.objects;
              })
            }).catch(err => {
              console.log(err);
            })
          }).catch(err => {
          console.log(err)
        })
      },
      // 分页
      handleSizeChange(page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.pageList();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.pageList();
      },
      // 启动工作流
      sendBPM(result) {
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/StartUpWorkFlowForJQ', {
          jQ_ID: result.guid,
          jQ_Type: result.flowModel,
          workflowCode: result.flowModelName,
          userCode: sessionStorage.getItem('account'), // 未指定呢
        }).then(res => {
          let result = JSON.parse(res.data);
          if (result.code == '0') {
            console.log('启动工作流成功');
          } else {
            console.log('启动工作流错误!');
            console.log(res.data);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 请求工作流接口获取未完成的任务
      pageList(){
        var that = this
        var arr = []
        this.$http.post('http://test.dayuntong.com/universal/supplier/api/dictionaryget?enumname=FlowModel')  // workflowCode获取FlowModel传递（工作流模型名称）
          .then(obj => {
            this.$http.post(this.GLOBAL.jqUrl + "/JQ/GettingUnfinishedTasksForJQ",{
              //"userCode": sessionStorage.getItem('userCode'),
              "userCode": sessionStorage.getItem('userCode'),
              "startTime": this.startTime?this.startTime:"1970-07-23T01:30:54.452Z",
              "endTime": this.endTime?this.endTime:new Date(),
              "startIndex": this.currentPage,  // 页码
              "endIndex": this.pagesize ,  // 每页条数
              "workflowCode": obj.data.objects[0].name
            }).then(obj => {
              obj.data.forEach(v=>{
                arr.push(v.jq_ID)
                that.arr1.push(v.workItemID)
              })
              this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/listforguid', { // 通过GUID查找无收入/预付款列表
                "guid": arr
              }).then(obj =>{
                that.total = obj.data.total;
                that.tableData = obj.data.objects;
                that.$emit('headCallBack',that.tableData.length)
              })
              // .then(obj =>{
              //   this.$http.post(this.GLOBAL.jqUrl + '/api/JQ/GetInstanceActityInfoForJQ',
              //     {
              //       "jQ_ID": "974fdbc7-2f1d-4e9c-8bf1-e910e3d4ac01",
              //       "jQ_Type":1
              //     }).then(obj =>{
              //       that.tableCourse = obj.data.objects;
              //     })
              // })
            })
          })
      },
      // 删除
      repeal(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/delete',
          {
            "id": this.paymentID
          })
          .then(res => {
            if(res.data.isSuccess == true){
              this.$message.success("撤销成功");
              this.pageList();
              this.detailstShow = false;
            }
          })
          .then(res =>() => {
            console.log(res)
          })
          .catch(res =>() => {
            console.log(res)
          });
      },
      // 通过
      through(){
        this.title="审批通过";
        this.transitShow = true;
      },
      rejected(){
        this.title="审批驳回";
        this.transitShow = true;
      },
      closeTransit(){
        this.transitShow = false;
      },
      confirm(formName){
        if(this.title == "审批通过"){
          this.transit(formName);
        }else{
          this.rejected_01(formName);
        }
      },
      transit(formName){
        var that = this;
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ',
          {
            //"userCode": "rbop01",
            "userCode":sessionStorage.getItem('userCode'),
            "workItemID": this.arr1[0],
            "commentText": this.commentText
          }).then(res =>{
          that.transitShow = false;
          that.detailstShow = false;
          that.pageList();
          //that.repeal();
        })
      },
      // 驳回
      rejected_01(formName){
        var that = this;
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ',
          {
            //"userCode": "rbop01",
            "userCode":sessionStorage.getItem('userCode'),
            "workItemID": this.arr1[0],
            "commentText": this.commentText
          }).then(res =>{
          that.transitShow = false;
          that.detailstShow = false;
          that.rejectedSuccess();
          that.pageList();
          //that.repeal();
        })
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/EndProcess',{
          "jq_id":this.guid,
          "jQ_Type": 2
        })
      },
      // 驳回成功通过guid将checktype修改成2
      rejectedSuccess(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/savechecktype',{
          /*"guid": this.guid,
          "checkType": 2*/
          "object": {
            "guid": this.guid,
            "checkType": 2
          }
        })
      },
      // 详情弹窗
      checkIncome(row){
        this.pid = row.paymentID;
        this.detailstShow = true;
        this.getLabel();
      },
      closeDetailstShow(){
        this.detailstShow = false;
      },
      // 获取一条详情
      getLabel(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
          "id":this.pid
        }).then(res => {
          if(res.data.isSuccess == true){
            this.guid = res.data.object.guid
            console.log(this.guid)
          }
        })
      },
      getTourByPlanId(val) {
        var that = this
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
      },
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
        //无收入借款明细
        that.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
          "object": {
            "paymentType": 1,
            "planID": val,
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.tableIncome = res.data.objects
          }
        }).catch(err => {
          console.log(err)
        })
        //根据计划ID获取订单总额,已收款总额,总人数,已审批借款总额，审批中借款总额/
        that.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
          "object": {
            "id": val,
          }
        }).then(res => {
          if (res.data.isSuccess == true) {
            that.tableMoney = []
            that.tableMoney.push(res.data.object)
          }
        }).catch(err => {
          console.log(err)
        })
        //收入明细
        that.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderlist', {
          "object": {
            "planID": val,
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
      //获取id
      clickBanle(row, event, column) {
        // this.pid = row['id'];
        this.reable = false;
        this.paymentID=row.paymentID;
        this.tour_id = row['planID'];
        this.id = row.id;
      },
    }
  }
</script>
<style lang="scss" scoped>
  .line{
    text-align: center;
  }
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .plan{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .emptyPlan{
        margin: 0 0 0 30px;
      }
      .planTime{
        width: 135px;
        line-height: 30px;
        margin: 0 0 0 10px;
      }
      .time{
        margin: 0 0 0 10px;
      }
      .fl{
        float:left;
        margin: 20px 0 20px 0;
      }
    }
    #table-content{
      width: 98%;
      margin: 40px auto 10px;
    }
  }

  /*分页*/
  .pageList{float:right; margin: 0 0 20px 0;}
  /*申请无收入借款弹窗*/
  .mask{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 100;}
  .noIncome{width:1100px; position:absolute; top:3%;left:50%; margin-left:-550px; background:#fff; z-index:1000; border-radius:3px;max-height: 95%;overflow:scroll;overflow-x:hidden;}
  .noIncomeTitle{margin: 30px; overflow: hidden;}
  .noIncomeTitle_l{float:left; font-size:13pt;line-height: 40px;}
  .noIncomeTitle_r{float:right;}
  .name_input{width: 200px;}
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

  /*关联欠款*/
  .associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc;width: 90%; margin: 0 0 0 25px; border-radius: 5px;overflow: hidden; }
  .associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
  .associatedItems{float:left; margin: 0 0 0 10px;}
  .associatedMoney{float:left; margin: 0 0 0 30px;}

  /*通过驳回弹窗*/
  .transit{position: absolute; top: 15px; right: 15px; font-size:20pt;cursor:pointer; }
  .el-dialog__wrapper>>>.el-dialog{overflow: hidden !important;}
</style>
