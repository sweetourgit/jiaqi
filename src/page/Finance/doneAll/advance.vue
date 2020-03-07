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
              <el-button @click="HandleSearchApprove('advance')" type="primary">搜索</el-button>
              <el-button type="primary" plain @click="HandleResetApprove('ruleFormSearch', 'advance')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="approveTableDataAdvance" ref="multipleTable" class="multipleTable" :header-cell-style="getRowClass" border id="table-content" v-loading="listLoading">
      <el-table-column prop="paymentID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeEX" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F">{{scope.row.checkTypeEX}}</div>
          <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D">{{scope.row.checkTypeEX}}</div>
          <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174">{{scope.row.checkTypeEX}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :formatter='dateFormat' label="申请时间" width="180" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
      <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已报销金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
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
    name: "advance",
    props:{
      whereTab: String
    },
    data(){
      return {
        ruleFormSearch: {
          endTime:'',
          startTime: '',
        },
        approveTableDataAdvance: [],
      }
    },
    mixins: [done],
    created(){
      this.approveTableList('advance');
    },
    computed: {
      tabChange: function () {
        return this.whereTab
      }
    },
    watch:{
      tabChange: function(val, oldVal){
        if(val === 'advance'){
          this.approveTableList(val)
        }
      }
    },
    methods: {
      handleJumpDetail(index, row){
        let getCurrentPaymentID = row.paymentID
        let getCurrentGuid = row.guid
        this.$router.push({ path: "/doneAll/advanceAndNoInDetails", query: {doneDetailPaymentID: getCurrentPaymentID, componentName: 'advance', optionsGuid: getCurrentGuid} })
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
