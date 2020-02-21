<template>
  <div>
    <!-- 检索 -->
    <div class="plan">
      <el-form :model="ruleFormSearch" ref="ruleFormSearch" label-width="80px" style="margin-top: 20px">
        <el-row type="flex" class="row-bg">
          <el-col :span="6">
            <el-form-item label="团期计划" prop="tour">
              <el-input v-model="ruleFormSearch.tour"  placeholder="请输入或者选择团期计划"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人" prop="create">
              <el-input v-model="ruleFormSearch.create"  placeholder="请输入申请人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请时间:">
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSearch.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSearch.endTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="statusNoIn">
              <el-select v-model="ruleFormSearch.status" placeholder="请选择状态" style="width: 100%;">
                <el-option label="审批中" value="0"></el-option>
                <el-option label="驳回" value="1"></el-option>
                <el-option label="通过" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="摘要" prop="remark">
              <el-input v-model="ruleFormSearch.remark"  placeholder="请输入摘要内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="借款金额" prop="borrow">
              <el-input v-model="ruleFormSearch.borrow"  placeholder="请输入借款金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: left">
            <el-form-item>
              <el-button @click="HandleSearchApprove()" type="primary">搜索</el-button>
              <el-button @click="HandleResetApprove('ruleFormSearch')" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 检索 END -->
    <!-- 表格 -->
    <el-table :data="approveTableDataNoIn" ref="multipleTable" class="multipleTable" :header-cell-style="getRowClass" border id="table-content" v-loading="listLoading">
      <el-table-column prop="paymentID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeEX" label="状态" align="center"></el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="申请时间" width="180" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
      <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已报销金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column prop="mark" label="审批意见" align="center"></el-table-column>
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
  import done from './done'
  export default {
    name: "noIn",
    props:{
      whereTab: String
    },
    data(){
      return {
        ruleFormSearch: {
          endTime:'',
          status: '',
          creator: '',
          remark: '',
          borrow: '',
          startTime: '',
          plan: '',
        },
        approveTableDataNoIn: [],
      }
    },
    mixins: [done],
    created(){
     this.approveTableList('borrow');
    },
    computed: {
      tabChange: function () {
        return this.whereTab
      }
    },
    watch:{
      tabChange: function(val, oldVal){
        if(val === 'borrow'){
          this.approveTableList(val)
        }
      }
    },
    methods: {
      HandleResetApprove (paramsFrom){
        this.$refs[paramsFrom].resetFields()
        this.approveTableList('borrow');
      },
      HandleSearchApprove () {
        this.approveTableList()
      },
      handleJumpDetail(index, row){
        let getCurrentPaymentID = row.paymentID
        this.$router.push({ path: "/doneAll/advanceAndNoInDetails", query: {doneDetailPaymentID: getCurrentPaymentID } })
      },
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
