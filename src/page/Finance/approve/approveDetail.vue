<!-- 审批详情 -->
<template>
  <div class="loan-management">
    <el-row style="margin-top: 20px;">
      <el-col :span="6" :offset="18">
        <el-button type="warning" @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSplitRepaymentJump">拆分/还款</el-button>
        <el-button type="success" @click="handlePass">通过</el-button>
        <el-button type="danger" @click="handleReject">驳回</el-button>
      </el-col>
    </el-row>
    <!-- 报销信息 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>报销信息</el-divider>
    <el-row class="row-content">
      <el-col :span="24">
        <el-tabs v-model="tabShowWhich" @tab-click="handleClick">
          <el-tab-pane v-for="tabItem in keepBackContent" :key="tabItem.id" :label="'报销 - '+String(tabItem.id)" :name="String(tabItem.id)">
            <el-row class="item-content">
                <el-tag type="warning" v-if="tabItem.checkType=='0'" class="distributor-status">审批中</el-tag>
                <el-tag type="danger" v-if="tabItem.checkType=='2'" class="distributor-status">驳回</el-tag>
                <el-tag type="success" v-if="tabItem.checkType=='1'" class="distributor-status">通过</el-tag>
            </el-row>
            <el-row type="flex" class="row-bg row-content" justify="space-between">
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">ID:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.planID }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.createUser }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="9"><div class="grid-del label-color">创建时间:</div></el-col>
                <el-col :span="15"><div class="grid-del">{{ tabItem.createTime }}</div></el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg row-content" justify="space-between">
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">团期计划:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.groupCode }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">产品名称:</div></el-col>
                <el-col :span="17"><div class="grid-del ">{{ tabItem.productName }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="9"><div class="grid-del label-color">摘要:</div></el-col>
                <el-col :span="15"><div class="grid-del ">{{ tabItem.mark }}</div></el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg row-content" justify="space-between">
              <el-col :span="14">
                <el-col :span="6"><div class="grid-del label-color print-hidden">附件:</div></el-col>
                <el-col :span="18">
                  <!--<el-upload
                    class="upload-demo print-hidden"
                    name="files"
                    :file-list="fundamental.files"
                    :show-file-list=true
                    action="test"
                    :disabled=true
                    :on-preview="handlePreview"
                  >
                  </el-upload>-->
                </el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg reimbursement-mt" justify="space-between">
              <el-table :data="tabItem.payments" border :header-cell-style="getRowClass">
                <el-table-column prop="paymentID" label="无收入借款或预付款ID" align="center"></el-table-column>
                <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
                <!--<el-table-column prop=" " label="申请人" align="center"></el-table-column>-->
                <el-table-column prop="paymentMark" label="摘要" align="center"></el-table-column>
                <el-table-column prop="paymentPrice" label="借款金额" align="center"></el-table-column>
                <el-table-column prop="noPrice" label="未报销金额" align="center">
                  <template slot-scope="scope">
                    <div>{{ scope.row.paymentPrice - scope.row.price }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="报销金额" align="center"></el-table-column>
                <el-table-column prop="peopleCount" label="人数" align="center"></el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 报销信息 END -->
    <!-- 审核结果 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <el-row type="flex" class="row-bg row-content" justify="space-between">
      <el-table :data="examineData" border :header-cell-style="getRowClass">
        <el-table-column prop="createTime" label="审批时间" align="center"></el-table-column>
        <el-table-column prop="spName" label="审批人" align="center"></el-table-column>
        <el-table-column prop="spState" label="审批结果" align="center"></el-table-column>
        <el-table-column prop="spContent" label="审批意见" align="center"></el-table-column>
      </el-table>
    </el-row>
    <!-- 审核结果 END -->
  </div>
</template>

<script>
  export default {
    name: "approveDetail",
    data(){
      return {
        tabShowWhich: null, // 显示哪个tab
        examineData: [ // 审核
          {
            createTime: '2010',
            spName: '审批人',
            spState: '审批结果',
            spContent: '审批意见',
          }
        ],
        getApproveListGuid: null, // 获取列表页的的guid
        dialogVisible: false,
        keepBackContent: null // 保存详情内容
      }
    },
    created(){
      this.getApproveListGuid = this.$route.query.approveListGuid
      this.getApproveDetail(this.getApproveListGuid)
      this.tabShowWhich = String(this.$route.query.queryApproveExpenseID)
      this.auditResult(this.getApproveListGuid)
    },
    methods: {
      // 获取审核结果
      auditResult(paramsGuid) {
        var that =this
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
          jQ_ID: paramsGuid,
          jQ_Type: 3,
        }).then(obj => {
          that.examineData = []
          that.examineData = obj.data.extend.instanceLogInfo;
        }).catch(obj => {})
      },
      // 获取详情
      getApproveDetail(guidParams){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/list',{
          "object": {
            guid: guidParams
          }
        })
        .then(obj => {
          let keepData = obj.data.objects
          this.keepBackContent = keepData
        }).catch(err => {
          console.log(err)
        })
      },
      // 通过
      handlePass(formName){
        var that = this;
        // this.$http.post(this.GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ',
        let getWorkflowCode
        if(this.presentRouter == '无收入借款管理') {
          // getWorkflowCode = 'loan_noIncome2'
          getWorkflowCode = 1
        } else if(this.presentRouter == '预付款管理') {
          // getWorkflowCode = 'borrow_Moneys2'
          getWorkflowCode = 2
        }else {}
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ_InsertOpinion',
          {
            "jQ_ID":that.guid,
            "jQ_Type": getWorkflowCode,
            "userCode":sessionStorage.getItem('tel'),
            "workItemID": that.getWorkItemId,
            "commentText": that.commentText
          }).then(res =>{
          that.transitShow = false;
          that.detailstShow = false;
          that.pageList();
          //that.repeal();
        })
      },
      // 驳回
      handleReject(formName){
        var that = this;
        let getWorkflowCode
        if(this.presentRouter == '无收入借款管理') {
          getWorkflowCode = 1
        } else if(this.presentRouter == '预付款管理') {
          getWorkflowCode = 2
        }else {}
        // this.$http.post(this.GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ',
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ_InsertOpinion',
          {
            "jQ_ID": that.guid,
            "jQ_Type": getWorkflowCode,
            "userCode":sessionStorage.getItem('tel'),
            "workItemID": that.getWorkItemId,
            "commentText": that.commentText
          }).then(res =>{
          that.transitShow = false;
          that.detailstShow = false;
          that.rejectedSuccess();
          //that.repeal();
          let getWorkflowCode
          if(this.presentRouter == '无收入借款管理') {
            getWorkflowCode = 1
          } else if(this.presentRouter == '预付款管理') {
            getWorkflowCode = 2
          }else {}
          // 结束工作流
          this.$http.post(this.GLOBAL.jqUrl + '/JQ/EndProcess',{
            "jq_id":this.guid,
            "jQ_Type": getWorkflowCode
          }).then(res => {
            that.pageList();
            that.$store.commit('changeAparoveState')
          })
        })
      },
      // 弹窗保存
      handleDialogKeep(){

      },
      // 取消
      handleCancel(){
        this.$router.go(-1)
      },
      // 通过
      handlePass(){

      },
      // 驳回
      handleReject(){

      },
      // 拆分/还款
      handleSplitRepaymentJump(){
        this.$router.push({ path: "/approve/splitLoan", query: { approveDetailTab: this.tabShowWhich} })
      },
      handleClick(){},
      // 表格表头颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f5f7fa;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .loan-management{
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .row-content{
      width: 95%;
      margin: 0 auto;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .reimbursement-mt{
      margin: 20px 0;
    }
    .item-content{
      margin: 10px 0;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 27px;
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
</style>
