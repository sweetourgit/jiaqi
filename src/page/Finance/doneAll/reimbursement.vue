<template>
  <div>
    <!-- 检索 -->
    <div class="plan">
      <el-form :model="ruleFormSeachReimburse" ref="ruleFormSeachReimburse" label-width="80px" style="margin-top: 20px">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item label="报销单号" prop="createUserReimburse">
              <el-input v-model="ruleFormSeachReimburse.creater"  placeholder="请输入报销单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="createUserReimburse">
              <el-input v-model="ruleFormSeachReimburse.creater"  placeholder="请输入或者选择申请人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发起时间:">
              <el-col :span="11">
                <el-form-item prop="planTimeReimburse">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSeachReimburse.planTimeReimburse" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="planDataReimburse">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSeachReimburse.planDataReimburse" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item label="团期计划" prop="tourNoIn">
              <el-input v-model="ruleFormSeachReimburse.planReimburse"  placeholder="请输入或者选择团期计划"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: left">
            <el-form-item>
              <el-button @click="HandleSearchReiburse()" type="primary">搜索</el-button>
              <el-button @click="HandleResetReimburse('ruleFormSeachReimburse')" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 检索 END -->
    <!-- 表格 -->
    <el-table :data="reimburseTableData" ref="multipleTable" class="multipleTable" :header-cell-style="getRowClass" border id="table-content" v-loading="listLoading">
      <el-table-column prop="expenseID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="expenseID" label="状态" align="center"></el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="发起时间" width="180" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="报销金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column prop="price" label="审批意见" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="handleJumpDetail(scope.$index, scope.row)" type="primary" plain size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 需要审批表格 END-->
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: "reimbursement",
    data(){
      return {
        reimburseDataLength: null,
        listLoading: false, // 表格加载等待状态
        keepWorkItemID: [], // 保存workItemid
        ruleFormSeachReimburse: {
          creater: '',
          planTimeReimburse: '',
          planDataReimburse: '',
          planReimburse: '',
        },
        reimburseTableData: [], // 未审批业务表格
      }
    },
    created(){
      this.reimburseTableList();
    },
    computed: {
      reimburseDataNum:function () {
        return this.reimburseDataLength > 0 ? this.reimburseDataLength : 0
      }
    },
    methods: {
      moment,
      // 起始时间格式转换
      dateFormat: function(row, column) {
        let date = row[column.property];
        if(date == undefined) {
          return '';
        }
        return moment(date).format('YYYY-MM-DD')
      },
      // tab切换
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      // 重置
      HandleResetReimburse (paramsFrom){
        this.$refs[paramsFrom].resetFields()
      },
      // 搜索
      HandleSearchApprove () {
        this.reimburseTableList()
      },
      //  详情跳转
      handleJumpDetail(index, row){
        let getCurrentGuid = row.guid // 获取当前行的 guid
        let getWorkItemID = this.keepWorkItemID
        let getCurrentExpenseID = row.expenseID // 获取当前行的 guid
        this.$router.push({ path: "/approve/approveDetail", query: { approveDetailGuid: getCurrentGuid, queryApproveExpenseID: getCurrentExpenseID, queryWorkItemID: getWorkItemID } })
      },
      // 请求工作流接口获取未完成的任务
      reimburseTableList(){
        let that = this
        let arr = []
        this.listLoading = true
        that.reimburseTableData  = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=FlowModel')  // workflowCode获取FlowModel传递（工作流模型名称）
          .then(obj => {
            let getWorkflowCode
            if(this.presentRouter == '无收入借款管理') {
              getWorkflowCode = 'loan_noIncome4'
            } else if(this.presentRouter == '预付款管理') {
              getWorkflowCode = 'borrow_Moneys4'
            }else {
              getWorkflowCode = 'Reimbursement_noIncome4'
            }
            this.$http.post(this.GLOBAL.jqUrl + "/JQ/GettingUnfinishedTasksForJQ",{
              //"userCode": sessionStorage.getItem('userCode'),
              "userCode": sessionStorage.getItem('tel'),
              "startTime": this.ruleFormSeachReimburse.planTimeReimburse ?  moment(this.ruleFormSeachReimburse.planTimeReimburse).format('YYYY-MM-DD HH:mm:ss') : "1970-07-23T01:30:54.452Z",
              "endTime": this.ruleFormSeachReimburse.planDataReimburse ? moment(this.ruleFormSeachReimburse.planDataReimburse).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              "startIndex": -1,  // 页码
              "endIndex": -1 ,  // 每页条数
              "workflowCode": getWorkflowCode
            }).then(obj => {
              obj.data.forEach(v=>{
                arr.push(v.jq_ID)
                // that.arr1.push(v.workItemID)
                that.keepWorkItemID.push(v)
              })
              this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/listforguid', { // 通过GUID查找无收入/预付款列表
                "guid": arr
              }).then(obj =>{
                that.reimburseTableData = obj.data.objects;
                this.listLoading = false
                this.reimburseDataLength = that.reimburseTableData.length
              })
            })
          })
      },
      // 设置表格行颜色
      getRowClass ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .plan{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
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
</style>

}
</script>

<style scoped>

</style>
