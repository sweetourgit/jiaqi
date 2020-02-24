<template>
  <div>
    <div class="plan">
      <el-form :model="ruleFormSearch" ref="ruleFormSearch" label-width="80px" style="margin-top: 20px">
        <el-row type="flex" class="row-bg">
          <el-col :span="9">
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
          <el-col :span="11" style="text-align: left">
            <el-form-item>
              <el-button @click="HandleSearchApprove('refund')" type="primary">搜索</el-button>
              <el-button @click="HandleResetApprove('ruleFormSearch', 'refund')" type="primary">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="approveTableDataRefund" ref="multipleTable" class="multipleTable" :header-cell-style="getRowClass" border id="table-content" v-loading="listLoading">
      <el-table-column prop="refundCode" label="退款单号" align="center"></el-table-column>
      <el-table-column prop="refundStateType" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.refundStateType=='0'" style="color: #7F7F7F" >申请退款</div>
          <div v-if="scope.row.refundStateType=='1'" style="color: #7F7F7F" >退款完成</div>
          <div v-if="scope.row.refundStateType=='2'" style="color: #7F7F7F" >拒绝退款</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="申请时间" width="180" align="center"></el-table-column>
      <el-table-column prop="productType" label="类型" align="center"></el-table-column>
      <el-table-column prop="allRefundPrice" label="退款金额" align="center"></el-table-column>
      <el-table-column prop="realRefundPrice" label="实际退款金额" align="center"></el-table-column>
      <el-table-column prop="name" label="申请人" align="center"></el-table-column>
      <el-table-column prop="mark" label="审批意见" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="handleJumpDetail(scope.$index, scope.row)" type="primary" plain size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import done from './done'
  export default {
    name: "refund",
    props:{
      whereTab: String
    },
    data(){
      return {
        ruleFormSearch: {
          endTime:'',
          startTime: '',
        },
        approveTableDataRefund: [],
      }
    },
    mixins: [done],
    created(){
      this.approveTableList('refund');
    },
    computed: {
      tabChange: function () {
        return this.whereTab
      }
    },
    watch:{
      tabChange: function(val, oldVal){
        if(val === 'refund'){
          this.approveTableList(val)
        }
      }
    },
    methods: {
      handleJumpDetail(index, row){
        let getCurrentPaymentID = row.id
        this.$router.push({ path: "/doneAll/refundDetails", query: {doneDetailPaymentID: getCurrentPaymentID, componentName: 'refund'} })
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
