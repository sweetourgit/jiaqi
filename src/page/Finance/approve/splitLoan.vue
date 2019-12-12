<template>
  <div class="loan-management">
    <el-row style="margin-top: 20px;">
      <el-col :span="6" :offset="21">
        <el-button type="warning" plain @click="handleCancel">取消</el-button>
        <el-button type="danger" plain @click="handleRevoke">撤销</el-button>
      </el-col>
    </el-row>
    <el-divider content-position="left" class='title-margin title-margin-t'>基本信息</el-divider>
    <el-row style="margin-top: 20px;">
      <div class="item-content print-hidden">
        <el-tag type="warning" class="distributor-status">审批中</el-tag>
        <!--<el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>-->
      </div>
    </el-row>
    <el-row type="flex" class="row-bg row-content" justify="space-between">
      <!--<el-col :span="6">
        <el-col :span="7"><div class="grid-del label-color">ID:</div></el-col>
        <el-col :span="17"><div class="grid-del">{{ fundamental.id }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
        <el-col :span="17"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="9"><div class="grid-del label-color">创建时间:</div></el-col>
        <el-col :span="15"><div class="grid-del ">{{ fundamental.createTime  | formatDate  }}</div></el-col>
      </el-col>-->
      <el-col :span="6">
        <el-col :span="7"><div class="grid-del label-color">ID:</div></el-col>
        <el-col :span="17"><div class="grid-del">ID</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
        <el-col :span="17"><div class="grid-del ">申请人</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="9"><div class="grid-del label-color">创建时间:</div></el-col>
        <el-col :span="15"><div class="grid-del ">创建时间</div></el-col>
      </el-col>
    </el-row>
    <el-divider content-position="left" class='title-margin title-margin-t'>报销信息</el-divider>
    <el-row class="row-content">
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">团期计划:</div></el-col>
                <el-col :span="17"><div class="grid-del">团期计划</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">产品名称:</div></el-col>
                <el-col :span="17"><div class="grid-del ">申请人</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="9"><div class="grid-del label-color">摘要:</div></el-col>
                <el-col :span="15"><div class="grid-del ">摘要</div></el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-between">
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
              <el-table :data="reimbursementData" border :header-cell-style="getRowClass">
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
                <el-table-column prop="hkOfCf" label="还款/拆分" align="center"></el-table-column>
                <el-table-column prop="peopleCount" label="操作" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button type="success" size="small" plain v-if="scope.row.hkOfCf != '' || scope.row.hkOfCf == null">查看</el-button>
                    <el-button type="primary" size="small" plain v-if="scope.row.price - (scope.row.paymentPrice - scope.row.price) != 0">拆分/还款</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="second">
            配置管理
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "splitLoan",
    created(){

    },
    data(){
      return {
        activeName: 'jack',
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
        ]
      }
    },
    methods: {
      // 取消
      handleCancel(){
        this.$router.go(-1)
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
