<template>
  <div class="distributor-content">
    <el-row type="flex" class="row-bg">
      <el-col :span="4" :offset="19" class="btn-operator">
        <el-button @click="cancelHand()" type="primary" plain size="small">取消</el-button>
    <!--<el-button @click="emptyButton()" type="primary" size="small">撤销</el-button>-->
      </el-col>
    </el-row>
    <!-- 基本信息 -->
    <el-divider content-position="left">基本信息</el-divider>
    <div class="item-content">
      <div class="distributor-status status-bg">通过</div>
    </div>
    <!-- 第一行 -->
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color ">ID:</div></el-col>
        <el-col :span="20"><div class="grid-del ">{{ valId }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color ">申请人:</div></el-col>
        <el-col :span="20"><div class="grid-del ">{{ valProposer }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color">申请时间:</div></el-col>
        <el-col :span="20"><div class="grid-del ">{{ valCreateTime }}</div></el-col>
      </el-col>
    </el-row>
    <!-- 第一行 END -->
    <!-- 第二行 -->
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-col :span="5"><div class="grid-del label-color">分销商:</div></el-col>
        <el-col :span="19"><div class="grid-del">{{ valBusiness }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color">收款账户:</div></el-col>
        <el-col :span="20"><div class="grid-del ">{{ gathering }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color">收款金额:</div></el-col>
        <el-col :span="20"><div class="grid-del ">{{ valGatheringMoney }}</div></el-col>
      </el-col>
    </el-row>
    <!-- 第二行 END -->
    <!-- 第三行 -->
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color">收款时间:</div></el-col>
        <el-col :span="20"><div class="grid-del ">{{ valGatheringTime }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color">摘要:</div></el-col>
        <el-col :span="20"><div class="grid-del">{{ valAbstractContent }}</div></el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color">款项说明:</div></el-col>
        <el-col :span="20"><div class="grid-del ">{{ valIsInvoice }}</div></el-col>
      </el-col>
    </el-row>
    <!-- 第三行 END -->
    <!-- 第四行 -->
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-col :span="4"><div class="grid-del label-color">凭证:</div></el-col>
        <el-col :span="20">
          <div class="grid-del doc-mt-3" v-for="itemFiles in valFilesNum">
            {{ itemFiles.name }}
          </div>
        </el-col>
      </el-col>
      <el-col :span="6">
      </el-col>
      <el-col :span="6">
      </el-col>
    </el-row>
    <!-- 第四行 END -->
    <!-- 基本信息 END -->
    <!-- 审核结果 -->
    <el-divider content-position="left">审核结果</el-divider>
    <div class="item-content">
      <el-table :data="tableDataAuditRes" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
        <el-table-column prop="id" label="审批时间" align="center"></el-table-column>
        <el-table-column prop="checkTypeStatus" label="审批人" width="80" align="center"></el-table-column>
        <el-table-column prop="collectionTime" label="审批结果" align="center"></el-table-column>
        <el-table-column prop="groupCode" label="审批意见" align="center"></el-table-column>
      </el-table>
    </div>
    <el-divider content-position="left">关联欠款</el-divider>
    <!-- 审核结果 END -->
    <!-- 关联欠款表格 -->
    <el-tag class="total-price">已关联 {{ tableManyRow }} 项  |   总计：{{ getCollectionPriceTotal }} 元 </el-tag>
    <el-table :data="tableRelevanceData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
      <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="suppliers" label="分销商" width="80" align="center"></el-table-column>
      <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="arrearsPrice" label="欠款金额" align="center"></el-table-column>
      <el-table-column prop="repaidPrice" label="已还金额" align="center"></el-table-column>
      <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
      <el-table-column prop="matchingPrice" label="本次收款" align="center"></el-table-column>
    </el-table>
    <!-- 关联欠款表格 END -->
  </div>
</template>

<script>
  export default {
    name: "gatheringDel",
    data() {
      return {
        valId: '', // ID
        valProposer: '', // 申请人
        valCreateTime: '', // 申请时间
        valBusiness: '', // 分销商
        gathering: '', // 收款账户
        valGatheringMoney: '', // 收款金额
        valGatheringTime: '', // 收款时间
        valAbstractContent: '', // 摘要
        valIsInvoice: '', // 款项说明
        valFilesNum: '', // 文件数目
        tableRelevanceData: [], // 关联欠款表格
        tableManyRow: [], // 关联欠款表格共多少行
        getRowInfo: null, // 当前详情行信息
        getCollectionPriceTotal: 0, // 当前收款总额（合计）
        tableDataDebt: null,
        tableDataAuditRes: null,
        rowId: null,
        form: {
          name: '',
          distributor: '',
          payment: '',
          region: '',
          date1: '',
          date2: '',
        }
      }
    },
    created () {
      this.rowId = this.$route.query.rowId
      this.getRowInfo = this.$route.query.rowInfo
      this.getDelData()
    },
    methods: {
      // 行点击事件
      clickBanle () {

      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      // 取消事件
      cancelHand () {
        this.$router.push({name: '收款管理', params: {tabStatus: 'five'}})
      },
      // 获取详情数据
      getDelData () {
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/coll", {
          "id": this.rowId,
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
          .then(function (obj) {
            const resObj = obj.data.object
            const keepDebtItem = resObj.payarr
            _this.valId = resObj.id
            _this.valProposer = resObj.createUser
            _this.valCreateTime = resObj.createTime
            _this.valBusiness = resObj.distributor
            _this.gathering = resObj.collectionNumber
            _this.valGatheringMoney = resObj.price // 收款金额
            _this.valGatheringTime = resObj.collectionTime
            _this.valAbstractContent = resObj.abstract
            _this.valIsInvoice = resObj.moneyExplain
            if(resObj.files.length !== 0) {
              _this.valFilesNum = resObj.files
            }
            _this.tableRelevanceData = resObj.payarr
            _this.tableManyRow = resObj.payarr.length
            keepDebtItem.forEach( item => {
              _this.getCollectionPriceTotal += item.matchingPrice
            })
          })
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
    .total-price{
      margin: 10px;
    }
    .btn-operator{
      text-align: right;
      margin-top: 25px;
    }
    .item-content{
      margin-bottom: 20px;
    }
    .distributor-status{
      display: inline;
      padding: 0 5px;
      margin-left: 60px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      color: #fff;
    }
    .status-bg{
      background: red;
    }
    .el-divider__text{
      font-size: 17px;
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
