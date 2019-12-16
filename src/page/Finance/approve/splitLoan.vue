<template>
  <div class="loan-management">
    <el-row style="margin-top: 20px;">
      <el-col :span="6" :offset="18">
        <el-button type="warning" @click="handleCancel">取消</el-button>
        <el-button type="danger" @click="handleRevoke">撤销</el-button>
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
                <el-table-column prop="paymentMark" label="摘要" align="center"></el-table-column>
                <el-table-column prop="paymentPrice" label="借款金额" align="center"></el-table-column>
                <el-table-column prop="noPrice" label="未报销金额" align="center">
                  <template slot-scope="scope">
                    <div>{{ scope.row.paymentPrice - scope.row.price }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="报销金额" align="center"></el-table-column>
                <el-table-column prop="peopleCount" label="人数" align="center"></el-table-column>
                <el-table-column prop="splitOfLoan" label="还款/拆分" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.splitOfLoan == 1">还款</div>
                    <div v-if="scope.row.splitOfLoan == 2">拆分</div>
                  </template>
                </el-table-column>
                <el-table-column prop="peopleCount" label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button type="success" plain size="small" plain v-if="scope.row.splitOfLoan != '' || scope.row.splitOfLoan == null" @click="handleTableLook">查看</el-button>
                    <el-button type="primary" plain size="small" plain v-if="scope.row.price - (scope.row.paymentPrice - scope.row.price) != 0" @click="handleTableSplitLoan(scope.$index, scope.row)">拆分/还款</el-button>
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
      width="50%"
      :before-close="handleClose"
    >
      <!-- 查看 -->
      <div v-show="isShowLookOfSlit">
        <p><span>拆分/还款: <strong  style="margin-left: 10px;">拆分</strong ></span></p>
        <p style="margin-top: 10px;"><span>拆分/还款: <strong  style="margin-left: 10px;">拆分</strong ></span></p>
      </div>
      <!-- 查看 END -->
      <!-- 还款/拆分表单 -->
      <el-form :model="ruleFormSplitLoan" :rules="rules" ref="ruleFormSplitLoan" label-width="100px" v-show="!isShowLookOfSlit">
        <el-form-item label="还款/拆分" prop="formItemSplitLoan">
          <el-radio-group v-model="ruleFormSplitLoan.formItemSplitLoan" @change="handleChangeSplitLoan">
            <el-radio label="1">还款</el-radio>
            <el-radio label="2">拆分</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-table :data="bankAccountData" border :header-cell-style="getRowClass" :highlight-current-row="true" @row-click="handleAcountRow"  v-show="!isShowLookOfSlit && isShowAcountTable">
        <el-table-column prop="cardType" label="类型" align="center"></el-table-column>
        <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
        <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
        <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
        <el-table-column prop="openingName" label="开户人" align="center"></el-table-column>
      </el-table>
      <!-- 还款/拆分表单 END -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleTableDialogKeep('ruleFormSplitLoan')" v-show="!isShowLookOfSlit" :disabled="isDisabledKeepBtn">保 存</el-button>
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
        keepWhichRow: null, // 保存当前点击的拆分借款按钮是那一行的（实现设置 ‘拆分/还款’ 列的值）
        isShowAcountTable: true, // 是否显示表格
        isDisabledKeepBtn: true, // 拆分借款弹窗保存按钮没选银行账户之前是禁止点击的
        getAcountId: null, // 银行账户id
        isShowLookOfSlit: false, // 显示查看还是显示，拆分还款
        tabShowWhich: null, // 显示哪个tab
        isShowTableDialog: false, // 是否显示表格弹窗
        getApproveListGuid: null, // 获取列表页的的guid
        keepBackContent: null, // 保存详情内容
        reimbursementData: [
          /*{
            paymentID: 1,
            supplierTypeEX: '借款类型',
            supplierName: '供应商',
            supplierName: '申请人',
            paymentMark: '摘要',
            paymentPrice: 40,
            price: 20,
            noPrice: 0,
            peopleCount: '人数',
            splitOfLoan: 2
          },
          {
            paymentID: 12,
            supplierTypeEX: '借款类型',
            supplierName: '供应商',
            supplierName: '申请人',
            paymentMark: '摘要',
            paymentPrice: 60,
            price: 20,
            noPrice: 0,
            peopleCount: '人数',
            splitOfLoan: ''
          },
          {
            paymentID: 6,
            supplierTypeEX: '借款类型',
            supplierName: '供应商',
            supplierName: '申请人',
            paymentMark: '摘要',
            paymentPrice: 60,
            price: 20,
            noPrice: 0,
            peopleCount: '人数',
            splitOfLoan: 1
          }*/
        ], // 报销列表
        bankAccountData: [], // 银行账户表格
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
      this.getApproveListGuid = this.$route.query.approveDetailGuid
      this.getApproveDetail(this.getApproveListGuid)
      this.tabShowWhich = String(this.$route.query.approveDetailTab)
    },
    methods: {
      // 弹窗内的拆分和还款单选框切换时触发
      handleChangeSplitLoan(val){
        console.log(val)
        if(val == 2) {
          this.isDisabledKeepBtn = false
          this.isShowAcountTable = false
        }else {
          this.isDisabledKeepBtn = true
          this.isShowAcountTable = true
        }
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
      // 关闭银行账户弹窗前回调
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.isDisabledKeepBtn = true
            done();
          })
          .catch(_ => {});
      },
      // 拆分/还款弹窗，保存按钮
      handleTableDialogKeep(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.keepWhichRow.splitOfLoan = this.ruleFormSplitLoan.formItemSplitLoan
            this.isShowTableDialog = false
            // this.getAcountId
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 点击银行账户的行时触发
      handleAcountRow(row, event, column){
        this.isDisabledKeepBtn = false
        this.getAcountId = row.id
      },
      // 表格内的 ’拆分/还款’ 按钮
      handleTableSplitLoan(index, row){
        this.keepWhichRow = row
        // 获取银行账户数据
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",{
          "object": {
            "isDeleted": 0
          }
        }).then( obj =>  {
          this.bankAccountData = obj.data.objects
          this.isShowLookOfSlit = false
          this.isShowTableDialog = true
          this.ruleFormSplitLoan.formItemSplitLoan = '1'
        }).catch( err => {
          console.log(err)
        })
      },
      // 表格内的 ‘查看’ 按钮
      handleTableLook(){
        this.isShowLookOfSlit = true
        this.isShowTableDialog = true
      },
      // 取消
      handleCancel(){
        this.$router.push({ path: "/approve/approveDetail", query: { queryApproveExpenseID: this.tabShowWhich, approveListGuid: this.getApproveListGuid } })
      },
      // 撤销
      handleRevoke(){

      },
      // 通过
      handlePass(){
        // 能拿到 splitOfLoan 的值
        console.log(this.keepBackContent)
      },
      // 驳回
      handleReject(){

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
