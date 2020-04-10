<!--
  无收入，预付款，退款，报销，报账 共用组件
  依据父组件tab触发传入当前tab的name来控制组件的显示
 -->
<template>
  <div class="distributor-content">
    <!-- 检索 -->
    <div class="plan">
      <el-row type="flex" class="row-bg">
        <el-form :model="ruleFormSearch" ref="ruleFormSearch" label-width="80px" style="margin-top: 20px">
          <el-row type="flex" class="row-bg">
            <el-col :span="15">
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
            <el-col :span="8" style="text-align: right">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="HandleSearchPendingApprove(getWhichTab)">搜索</el-button>
                <el-button type="primary" icon="el-icon-s-open" plain @click="HandleResetPendingApproval('ruleFormSearch', getWhichTab)">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </div>
    <!-- 检索 END -->
    <!-- 需要审批表格-无收入款 -->
    <el-table
      border
      stripe
      :data="approvalNoInData"
      :header-cell-style="getRowClass"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      v-show="getWhichTab === 'nameINoIn'"
      class="table-content"
    >
      <el-table-column prop="paymentID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="发起时间" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
      <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="审批" width="150" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="handleJumpDetail(scope.$index, scope.row, 'nameINoIn')" type="primary" plain size="small">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 需要审批表格-预付款 END -->
    <el-table
      border
      stripe
      :data="approvalAdvanceData"
      :header-cell-style="getRowClass"
      v-loading="listLoading"
      v-show="getWhichTab === 'nameIAdvance'"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      class="table-content"
    >
      <el-table-column prop="paymentID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="发起时间" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
      <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="审批" width="150" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="handleJumpDetail(scope.$index, scope.row, 'nameIAdvance')" type="primary" plain size="small">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 需要审批表格-预付款 END -->
    <!-- 需要审批表格-报销管理 -->
    <el-table
      border
      stripe
      :data="approvalReimburseData"
      :header-cell-style="getRowClass"
      v-loading="listLoading"
      v-show="getWhichTab === 'nameIReimburse'"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      class="table-content"
    >
      <el-table-column prop="expenseID" label="报销单号" align="center"></el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="发起时间" width="180" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="price" label="报销金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="审批" width="150" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="handleJumpDetail(scope.$index, scope.row, 'nameIReimburse')" type="primary" plain size="small">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 需要审批表格-报销管理 END -->
    <!-- 需要审批表格-退款 -->
    <el-table
      :data="approvalRefundData"
      :header-cell-style="getRowClass"
      class="table-content"
      v-loading="listLoading"
      border
      stripe
      v-show="getWhichTab === 'nameIRefund'"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column prop="refundCode" label="退款单号" align="center"></el-table-column>
      <el-table-column prop="refundStateType" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.refundStateType === 0" style="color: #7F7F7F" >申请退款</div>
          <div v-if="scope.row.refundStateType === 1" style="color: #33D174" >退款完成</div>
          <div v-if="scope.row.refundStateType === 2" style="color: #FF4A3D" >拒绝退款</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="申请日期" align="center"></el-table-column>
      <el-table-column prop="productType" label="类型" align="center"></el-table-column>
      <el-table-column prop="allRefundPrice" label="退款金额" align="center"></el-table-column>
      <el-table-column prop="realRefundPrice" label="实际退款金额" align="center"></el-table-column>
      <el-table-column prop="name" label="申请人" align="center"></el-table-column>
      <el-table-column label="审批" width="150" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="handleJumpDetail(scope.$index, scope.row, 'nameIRefund')" type="primary" plain size="small">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 需要审批表格-退款 END -->
    <!-- 需要审批表格-报账单 -->
    <el-table
      border
      stripe
      :data="approvalSheetData"
      :header-cell-style="getRowClass"
      class="table-content"
      v-loading="listLoading"
      v-show="getWhichTab === 'nameISheet'"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="checkTypeEX" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkTypeEX ==='审批中'" style="color: #7F7F7F">{{ scope.row.checkTypeEX }}</div>
          <div v-if="scope.row.checkTypeEX === '驳回'" style="color: #FF4A3D">{{ scope.row.checkTypeEX }}</div>
          <div v-if="scope.row.checkTypeEX === '通过'" style="color: #33D174">{{ scope.row.checkTypeEX }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="teamProTitle" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="userName" label="申请人" align="center"></el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="申请时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" @click="handleJumpDetail(scope.$index, scope.row, 'nameISheet')" type="primary" plain size="small">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 需要审批表格-报账单 END -->
  </div>
</template>

<script>
  import requestTeamTableData from '../mixins/requestTeamTableData'

  // 详情跳转时依据传参进行跳转到匹配的路由
  let sourceMapJump = {
    nameINoIn: '/borrow/borrowDetails',
    nameIAdvance: '/borrow/borrowDetails',
    nameIReimburse: '/reimburse/reimburseTeamDetails',
    nameIRefund: '/refund/refundDetails',
    nameISheet: '/checkSheetDetail/team',
  };

  export default {
    name: "borrowList",
    data () {
      return {
        ruleFormSearch: {
          startTime:'',
          endTime:'',
        },
        approvalReimburseData: [], // 报销
        approvalNoInData: [], // 无收入
        approvalAdvanceData: [], // 预付款
        approvalRefundData: [], // 退款
        approvalSheetData: [], // 报账单
        noTaskArr: [], // 未完成的任务返回的数据，缓存返回来Json
      }
    },
    props: {
      // 通过tabName来控制组件显示，数据加载
      whichTab: {
        type: String,
        default: 'nameINoIn'
      }
    },
    mixins: [ requestTeamTableData ],
    mounted () {

    },
    created (){

    },
    computed: {
      getWhichTab: function () {
        return this.whichTab;
      }
    },
    watch: {
      getWhichTab: function (val, oldValue) {
        // console.log(val);
      }
    },
    methods: {
      // 详情方法
      handleJumpDetail (index, row, source) {
        let { id, paymentID, guid, instanceID, expenseID } = row; // 基本上都是给接口传参用
        let keepWorkItemId = null;

        // 取出当前选中的 workItemID 与后端返回的做比较
        this.noTaskArr.forEach(item => {
          if (row.guid === item.jq_ID) {
            keepWorkItemId = item.workItemID
          }
        });

        // 退款详情接口定义的 paymentID 为 id，没有进行统一。
        if (source === 'nameIRefund') {
          paymentID = row.id;
          this.noTaskArr.forEach(item => {
            if (row.instanceID === item.instanceID) {
              keepWorkItemId = item.workItemID
            }
          });
        }

        this.$router.push({
          path: sourceMapJump[source],
          query: {
            pendingDetailPaymentId: paymentID,
            componentName: this.getWhichTab,
            guid: guid, // 报账单定义为 guid
            id: id, // 报账单用
            instanceID: instanceID,
            workItemID: keepWorkItemId,
            whichTabName: this.whichTab,
            queryApproveExpenseID: expenseID // 报销用
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
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
    .table-content{
      width: 98%;
      margin: 40px auto 10px;
    }
  }
</style>
