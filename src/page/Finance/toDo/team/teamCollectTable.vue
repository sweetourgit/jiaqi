<!--
  跟团收款的（直客，同业，内部收款，报销还款）table;
  因为收款是不走工作流的，单独维护这个组件;
  原型上内部收款，报销还款是没有搜索模块的;
  通过点击其父组件传组件名称来显示对应的表格;
-->
<template>
  <div>
    <!-- 检索 -->
    <div class="plan">
      <el-form :model="ruleFormSearch" ref="ruleFormSearch" label-width="80px" style="margin-top: 20px">
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item label="收款时间:">
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
            <el-form-item label="团期计划:" prop="plan">
              <el-input placeholder="请输入团期计划" v-model="ruleFormSearch.plan" class="group-no" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态:" prop="checkType">
              <el-select v-model="ruleFormSearch.checkType" placeholder="请选择状态" style="width: 100%;">
                <el-option label="驳回" value="6"></el-option>
                <el-option label="通过" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="申请人:" prop="create">
              <el-autocomplete
                v-model="ruleFormSearch.create"
                :fetch-suggestions="queryCreate"
                placeholder="请输入内容"
                @select="handleSelect"
                class="searchInput"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align: left">
            <el-form-item>
              <el-button @click="HandleSearchApproveCollect()" type="primary">搜索</el-button>
              <el-button type="primary" plain @click="HandleResetApprovalCollect()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收款账户:" prop="collectionAccountSel">
              <el-checkbox-group
                v-model="ruleFormSearch.collectionAccountSel"
                @change="handleCheckbox"
              >
                <el-checkbox :label="item.id" v-for="(item,index) in collectionAccountInfos" :key="index"> {{item.value}} </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 检索 END -->
    <!-- 直客表格 -->
    <el-table :data="approvalTeamDirectData" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" v-loading="listLoading" v-show="whichCollectTeamTab === 'nameIIICollectionTeamDirect'">
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeStatus" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
          <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
          <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="collectionTime" label="收款时间" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center">
        <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.groupCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="collectionNumber" label="收款账户" align="center"></el-table-column>
      <el-table-column prop="orderNumber" label="订单号" align="center">
        <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.orderCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="handleJumpDetail(scope.$index, scope.row)" type="primary" plain size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 直客表格 END -->
    <!-- 同业表格 -->
    <el-table :data="approvalTeamSameData" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" v-loading="listLoading" v-show="whichCollectTeamTab === 'nameIIICollectionTeamSame'">
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeStatus" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
          <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
          <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="collectionTime" label="收款时间" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center">
        <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.groupCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="collectionNumber" label="收款账户" align="center"></el-table-column>
      <el-table-column prop="orderNumber" label="订单号" align="center">
        <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.orderCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="handleJumpDetail(scope.$index, scope.row)" type="primary" plain size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 同业表格 END -->
    <!-- 内部收款 -->
    <el-table :data="approvalTeamInnerData" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" v-loading="listLoading" v-show="whichCollectTeamTab === 'nameIIICollectionTeamInner'">
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeStatus" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
          <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
          <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="collectionTime" label="收款时间" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center">
        <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.groupCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNumber" label="订单号" align="center">
        <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.orderCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="localCompName" label="同业社名称" align="center"></el-table-column>
      <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="handleJumpDetail(scope.$index, scope.row)" type="primary" plain size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 内部收款 END -->
    <!-- 报销还款 -->
    <el-table :data="approvalTeamReimburseData" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" v-loading="listLoading" v-show="whichCollectTeamTab === 'nameIIICollectionTeamReimburse'">
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeStatus" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
          <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
          <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="reimbursement" label="报销单号" align="center"></el-table-column>
      <el-table-column prop="loan" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
      <el-table-column prop="dept" label="申请人部门" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="approvalBXHK(scope.row)" type="text" size="small">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 报销还款 END -->
    <!-- 分页 -->
    <div class="el-pagination">
      <el-pagination
        style="margin: 10px auto"
        :page-sizes="[10,20,30,50]"
        background
        @size-change="handleSizeChange"
        :page-size="pageSize"
        :current-page.sync="pageIndex"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>
    <!-- 分页 END -->
  </div>
</template>

<script>
  import requestCollectTeamTableData from '../mixins/requestCollectTeamTableData'

  export default {
    name: "teamCollectTable",
    props: {
      whichCollectTeamTab: {
        type: String,
        default: 'nameIIICollectionTeamDirect'
      }
    },
    mixins: [requestCollectTeamTableData],
    data () {
      return {
        ruleFormSearch: {
          endTime:'',
          startTime: '',
          plan: '',
          create: '',
          collectionAccountSel: [] // 哪个银行
        },
        approvalTeamDirectData: [],
        approvalTeamSameData  : [],
        approvalTeamInnerData: [],
        approvalTeamReimburseData: [],
        collectionAccountInfos: [], // 账户信息（筛选用）
      }
    },
    created () {
      this.getCollectionAccount()
    },
    computed: {
      getWhichTab: function(){
        return this.whichTab
      }
    },
    watch: {
      getWhichTab: function (newVal, oldValue) {
        console.log(newVal)
      }
    },
    methods: {
      handleCheckbox () {

      },
      handleDetails (row) {
        let getCurrentPaymentID = row.id
        this.$router.push({ path: "/doneAll/collectionDetails", query: {doneDetailPaymentID: getCurrentPaymentID, componentName: 'direct'} })
      },
      // 直客同业的搜索 收款账户显示的集合
      getCollectionAccount () {
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
          object: {
            cardType: 0,
            subject: ""
          }
        })
        .then(res => {
          let { objects } = res.data;
          objects.forEach((item, index) => {
            this.collectionAccountInfos.push({
              id: item.id,
              value: item.title
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
      },
    }
  }
</script>

<style scoped lang="scss">
  .el-pagination {
    margin-top: 30px;
    margin-left: -30%;
    text-align: center;
    margin-bottom: 20px;
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
