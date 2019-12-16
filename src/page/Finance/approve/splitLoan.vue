<template>
  <div class="loan-management">
    <el-row style="margin-top: 20px;">
      <el-col :span="6" :offset="21">
        <el-button type="warning" @click="handleCancel">取消</el-button>
        <el-button type="danger" @click="handleRevoke">撤销</el-button>
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
<!--              <el-table :data="tabItem.payments" border :header-cell-style="getRowClass">-->
              <el-table :data="reimbursementData" border :header-cell-style="getRowClass">
                <el-table-column prop="paymentID" label="无收入借款或预付款ID" align="center"></el-table-column>
                <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
                <el-table-column prop="paymentMark" label="摘要" align="center"></el-table-column>
                <el-table-column prop="paymentPrice" label="借款金额" align="center"></el-table-column>
                <el-table-column prop="noPrice" label="未报销金额" align="center">
                  <template slot-scope="scope">
                    <div>{{ scope.row.paymentPrice - scope.row.price }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="报销金额" align="center"></el-table-column>
                <el-table-column prop="peopleCount" label="人数" align="center"></el-table-column>
                <el-table-column prop="hkOfCf" label="还款/拆分" align="center"></el-table-column>
                <el-table-column prop="peopleCount" label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button type="success" plain size="small" plain v-if="scope.row.hkOfCf != '' || scope.row.hkOfCf == null" @click="handleTableLook">查看</el-button>
                    <el-button type="primary" plain size="small" plain v-if="scope.row.price - (scope.row.paymentPrice - scope.row.price) != 0" @click="handleTableSplitLoan">拆分/还款</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 报销信息 END -->
    <!-- 拆分/还款(弹窗) -->
    <el-dialog
      title="拆分/还款"
      :visible.sync="isShowTableDialog"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="ruleFormSplitLoan" :rules="rules" ref="ruleFormSplitLoan" label-width="100px">
        <el-form-item label="还款/拆分" prop="formItemSplitLoan">
          <el-radio-group v-model="ruleFormSplitLoan.formItemSplitLoan">
            <el-radio label="还款"></el-radio>
            <el-radio label="拆分"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-table :data="reimbursementData" border :header-cell-style="getRowClass">
        <el-table-column prop="paymentID" label="类型" align="center"></el-table-column>
        <el-table-column prop="supplierTypeEX" label="账号名称" align="center"></el-table-column>
        <el-table-column prop="supplierName" label="卡号" align="center"></el-table-column>
        <el-table-column prop="paymentMark" label="开户行" align="center"></el-table-column>
        <el-table-column prop="paymentPrice" label="开户人" align="center"></el-table-column>
        <el-table-column prop="paymentPrice" label="操作" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleTableDialogCanel">取 消</el-button>
        <el-button type="primary" @click="handleTableDialogKeep">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 拆分/还款(弹窗)  END -->
  </div>
</template>

<script>
  export default {
    name: "splitLoan",
    data(){
      return {
        tabShowWhich: null, // 显示哪个tab
        isShowTableDialog: false, // 是否显示表格弹窗
        getApproveListGuid: null, // 获取列表页的的guid
        keepBackContent: null, // 保存详情内容
        reimbursementData: [ // 报销列表
          {
            paymentID: 1,
            supplierTypeEX: '借款类型',
            supplierName: '供应商',
            supplierName: '申请人',
            paymentMark: '摘要',
            paymentPrice: 40,
            price: 20,
            noPrice: 0,
            peopleCount: '人数',
            hkOfCf: '还款'
          },
          {
            paymentID: 1,
            supplierTypeEX: '借款类型',
            supplierName: '供应商',
            supplierName: '申请人',
            paymentMark: '摘要',
            paymentPrice: 60,
            price: 20,
            noPrice: 0,
            peopleCount: '人数',
            hkOfCf: ''
          },
          {
            paymentID: 1,
            supplierTypeEX: '借款类型',
            supplierName: '供应商',
            supplierName: '申请人',
            paymentMark: '摘要',
            paymentPrice: 60,
            price: 20,
            noPrice: 0,
            peopleCount: '人数',
            hkOfCf: '拆分'
          }
        ],
        ruleFormSplitLoan:{
          formItemSplitLoan: '',
        },
        rules: {
          formItemSplitLoan: [
            { required: true, message: '请选择还款/拆分', trigger: 'change' }
          ]
        }
      }
    },
    created(){
      this.getApproveListGuid = this.$route.query.approveListGuid
      this.getApproveDetail(this.getApproveListGuid)
      this.tabShowWhich = String(this.$route.query.approveDetailTab)
    },
    methods: {
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
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      // 拆分/还款弹窗关闭
      handleTableDialogCanel(){
        this.isShowTableDialog = false
      },
      // 拆分/还款弹窗保存
      handleTableDialogKeep(){

      },
      // 表格内的拆分/还款按钮
      handleTableSplitLoan(){
        this.isShowTableDialog = true
      },
      // 表格内的查看事件
      handleTableLook(){

      },
      // 取消
      handleCancel(){
        this.$router.push({ path: "/approve/approveDetail", query: { queryApproveExpenseID: this.tabShowWhich} })
      },
      // 撤销
      handleRevoke(){

      },
      handleClick(){},
      // 表格表头颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
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
</style>
