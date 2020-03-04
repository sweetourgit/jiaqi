<template>
  <div class="loan-management">
    <div style="text-align: right; margin:25px 20px 0 0;">
      <el-button type="warning" plain  @click="handleCancel('collection', keepComponentName)">取消</el-button>
    </div>
    <div>
      <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
      <div class="item-content">
        <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
      </div>
      <div v-if="keepComponentName == 'direct'">
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">创建时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">交易流水号:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.serialNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第三行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款时间:</div></el-col>
            <el-col :span="18">
              <div class="grid-del">{{ fundamental.collectionTime | formatDate }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">开发票:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.invoice == 1 ?  '是' : '否' }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第三行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
            <el-col :span="18">
              <el-upload

                class="upload-demo"
                name="files"
                :file-list="fundamental.files"
                :show-file-list=true
                action="test"
                :disabled=true
                :on-preview="handlePreview"
              >
              </el-upload>
            </el-col>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <!-- 第四行 END -->
      </div>
      <div v-else-if="keepComponentName == 'same'">
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">创建时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">同业社名称:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.localCompName }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">开发票:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.invoice == 1 ?  '是' : '否' }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
            <el-col :span="18">
              <el-upload
                class="upload-demo"
                name="files"
                :file-list="fundamental.files"
                :show-file-list=true
                action="test"
                :disabled=true
                :on-preview="handlePreview"
              >
              </el-upload>
            </el-col>
          </el-col>
        </el-row>
        <!-- 第四行 END -->
      </div>
      <div v-else-if="keepComponentName == 'inner'">
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款单号:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">申请时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">分销商:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.distributor }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionTime | formatDate }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">款项说明:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.moneyExplain }}</div></el-col>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
            <el-col :span="18">
              <el-upload

                class="upload-demo"
                name="files"
                :file-list="fundamental.files"
                :show-file-list=true
                action="test"
                :disabled=true
                :on-preview="handlePreview"
              >
              </el-upload>
            </el-col>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <!-- 第四行 END -->
      </div>
      <div v-else="keepComponentName == 'reimburse'">
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">申请时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">报销单号:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.reimbursement }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">借款单号:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.loan }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">汇款/现金:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{fundamental.accountID == 13 ? "现金" : "汇款"}}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
        <!-- 第四行 END -->
      </div>
      <div v-if="keepComponentName !== 'collectionReimburse'">
        <!-- 审核结果 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
        <el-table :data="tableAudit" border :header-cell-style="getRowClass">
          <el-table-column prop="createTime" label="审批时间" align="center"></el-table-column>
          <el-table-column prop="spName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="spState" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="spContent" label="审批意见" align="center"></el-table-column>
        </el-table>
        <!-- 审核结果 END -->
        <!-- 发票 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>发票</el-divider>
        <el-table :data="tableInvoice" border :header-cell-style="getRowClass">
          <el-table-column prop="invoiceID" label="发票类型" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceID == 1">纸质发票</div>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceType" label="个人/单位" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceType == 1">个人</div>
              <div v-if="scope.row.invoiceType == 2">单位</div>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
          <el-table-column prop="invoiceHeaderOrTel" label="发票抬头" align="center"></el-table-column>
          <el-table-column prop="invoiceItem" label="发票项目" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceItem == 1">旅游费</div>
            </template>
          </el-table-column>
          <el-table-column prop="invoicePrice" label="金额" align="center"></el-table-column>
          <el-table-column prop="cardNumber" label="账号" align="center"></el-table-column>
          <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
          <el-table-column prop="address" label="地址" align="center"></el-table-column>
          <el-table-column prop="tel" label="电话" align="center"></el-table-column>
        </el-table>
        <!-- 关联欠款 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
        <div class="associatedIcon">
          <i class="el-icon-warning"></i>
        </div>
        <div class="associatedItems">
          已关联
          <span style="font-weight: bold;">{{ tableManyRow }}</span>项
        </div>
        <div class="associatedMoney">总计：{{ getCollectionPriceTotal }}元</div>
        <el-table :data="tableAssociated" border :header-cell-style="getRowClass">
          <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="date" label="出发日期" align="center"></el-table-column>
          <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
          <el-table-column prop="arrearsPrice" label="未收金额" align="center"></el-table-column>
          <el-table-column prop="repaidPrice" label="已收金额" align="center"></el-table-column>
          <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
          <el-table-column prop="matchingPrice" label="本次收款金额" align="center"></el-table-column>
          <el-table-column prop="prop" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRecognitionDetail(scope.row)">查看认款信息</el-button>
            </template>
          </el-table-column>
        </el-table>
        <recognitionDetail :dialogFormVisible="dialogFormVisible" :msg="msg" @close="recognitionClose"></recognitionDetail>
      </div>
    </div>
  </div>
</template>
<script>
  import recognitionDetail from './recognitionDetail';
  import common from './common';

  export default {
    name: "refundDetails",
    components: {
      recognitionDetail
    },
    data() {
      return {
        orderID:0,
        refundList:{},
        dialogFormVisible: false,
        fundamental:{},//查看详情基本信息数组
        tableAudit:[], //审核结果表格
        tableInvoice:[],//发票表格
        tableAssociated:[],//发票关联表
        keepComponentName: null,
        keepPaymentId: null,
        msg: "",
        tableManyRow: 0,
        getCollectionPriceTotal: 0
      };
    },
    mixins: [common],
    created(){
      let passPaymentID = this.$route.query.doneDetailPaymentID
      this.keepComponentName = this.$route.query.componentName
      this.keepPaymentId = passPaymentID
      this.getLabel(passPaymentID);
      //    this.getOrder(this.refundList.orderID);
    },
    methods: {
      // 点击图片钩子
      handlePreview(file) {
        window.open(file.url);
      },
      recognitionClose(str) {
        this.dialogFormVisible = false;
      },
      // 查看认款详情
      handleRecognitionDetail(row) {
        this.msg = {
          id: row.id
        };
        this.dialogFormVisible = true;
      },
      getLabel(id) {
        this.tableAssociated = [];
        var that = this
        this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/coll', {
          "id": id
        }).then(res => {
          //console.log(res.data.object.invoiceTable)
          if (res.data.isSuccess == true) {
            this.tableAssociated = res.data.object.arrears
            this.fundamental = res.data.object;
            this.tableInvoice = res.data.object.invoiceTable;
            this.tableAudit = res.data.object.spw
            this.tour_id = res.data.object.planID;
            this.tableManyRow = that.tableAssociated.length;
            this.tableAssociated.forEach(item => {
              that.getCollectionPriceTotal += item.matchingPrice;
            })
          }
        }).catch(function(res) {
          console.log(res)
        })
      }
    }
  };
</script>

<style scoped lang="scss">
  .loan-management{
    width: 99%;
    margin: 25px auto 50px;
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
      margin: 10px 0;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 4%;
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
    .associatedIcon {
      font-size: 14pt;
      color: #0b84e6;
      margin: 0 0 0 15px;
      float: left;
    }
    .associatedItems {
      float: left;
      margin: 0 0 0 10px;
    }
  }
</style>
