<!--

  收款详情，所有收款类型通用同一个组件

-->
<template>
  <div class="loan-management">
    <div style="text-align: right; margin: 25px 20px 0 0;">
      <el-button type="warning" plain @click="handleCancel">取消</el-button>
      <el-button type="primary" plain @click="handlePass">通过</el-button>
      <el-button type="danger" plain @click="handleRejected">驳回</el-button>
      <el-button type="success" plain @click="handleTouchPrint" plain v-if="getOrgID === 491">打印本页</el-button>
    </div>
    <div>
      <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
      <div class="item-content">
        <el-tag type="warning" v-if="fundamental.checkType === '0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType === '2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType === '1'" class="distributor-status">通过</el-tag>
      </div>
      <div v-if="keepComponentName === 'nameIIICollectionTeamDirect'">
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
      <div v-else-if="keepComponentName === 'nameIIICollectionTeamSame'">
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
      <div v-else-if="keepComponentName === 'nameIIICollectionTeamInner'">
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
      <div v-else-if="keepComponentName === 'nameIIICollectionTeamReimburse'">
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
      <div v-else></div>
      <div v-if="keepComponentName !== 'nameIIICollectionTeamReimburse'">
        <!-- 审核结果 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
        <el-table :data="tableAuditResults" border :header-cell-style="getRowClass">
          <el-table-column prop="createTime" :formatter='dateFormatDetails' label="审批时间" align="center"></el-table-column>
          <el-table-column prop="spName" label="审批人" align="center"></el-table-column>
          <el-table-column prop="spState" label="审批结果" align="center"></el-table-column>
          <el-table-column prop="spContent" label="审批意见" align="center"></el-table-column>
        </el-table>
        <!-- 审核结果 END -->
        <!-- 发票 -->
        <div v-if="paramsInvoiceTable.length !== 0">
          <el-divider content-position="left" class='title-margin title-margin-t'>发票</el-divider>
          <el-table :data="tableInvoice" border :header-cell-style="getRowClass">
            <el-table-column prop="invoiceID" label="发票类型" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.invoiceID === 1">纸质发票</div>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceType" label="个人/单位" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.invoiceType === 1">个人</div>
                <div v-if="scope.row.invoiceType === 2">单位</div>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
            <el-table-column prop="invoiceHeaderOrTel" label="发票抬头" align="center"></el-table-column>
            <el-table-column prop="invoiceItem" label="发票项目" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.invoiceItem === 1">旅游费</div>
              </template>
            </el-table-column>
            <el-table-column prop="invoicePrice" label="金额" align="center"></el-table-column>
            <el-table-column prop="cardNumber" label="账号" align="center"></el-table-column>
            <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
            <el-table-column prop="address" label="地址" align="center"></el-table-column>
            <el-table-column prop="tel" label="电话" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 关联欠款 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
        <!-- 同业/直客关联欠款 -->
        <div v-if="paramsCollectionType === 2 || paramsCollectionType === 1">
          <div v-if="paramsCollectionType === 2">
            <div class="associatedIcon">
              <i class="el-icon-warning"></i>
            </div>
            <div class="associatedItems">
              已关联
              <span style="font-weight: bold;">{{ tableManyRow }}</span>项
            </div>
            <div class="associatedMoney">总计：{{ getCollectionPriceTotal }}元</div>
          </div>
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
            <el-table-column prop="prop" label="操作" align="center" v-if="collCheckout">
              <template slot-scope="scope">
                <el-button type="primary" plain size="small" @click="handleRecognitionDetail(scope.row)">去认款</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 同业/直客关联欠款 END -->
        <!-- 内部收款，关联欠款 -->
        <div class="stepDv bottomDis" v-else-if="paramsCollectionType === 5">
          <el-table :data="tableAssociated" border :header-cell-style="getRowClass">
            <el-table-column prop="id" label="订单编号" align="center"></el-table-column>
            <!--没有这个字段 suppliers 待解决-->
            <el-table-column prop="suppliers" label="分销商" width="80" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
            <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
            <el-table-column prop="arrearsPrice" label="欠款金额" align="center"></el-table-column>
            <el-table-column prop="repaidPrice" label="已还金额" align="center"></el-table-column>
            <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
            <el-table-column prop="matchingPrice" label="本次收款" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 通过、驳回弹框 -->
        <el-dialog :title="approveDialogTitle" :visible.sync="ifShowApproveDialog" width="40%" custom-class="city_list">
          <textarea rows="8" v-model="approvalOpinion" style="width: 100%; margin: 0 auto; resize: none"></textarea>
          <el-row type="flex" class="row-bg">
            <el-col :span="8" :offset="18">
              <el-button @click="handleApproveDialogCancel">取消</el-button>
              <el-button @click="handleApproveDialogConfirm" type="primary">确定</el-button>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- 通过、驳回弹框 END -->
        <!-- 内部收款，关联欠款 END -->
        <recognitionDetail :dialogFormVisible="dialogFormVisible" :msg="msg" @close="recognitionClose"></recognitionDetail>
      </div>
    </div>
  </div>
</template>
<script>
  import recognitionDetail from './recognitionDetail';
  import collectTeamDetails from '../mixins/collectTeamDetails';

  export default {
    name: "collectionTeamDetails",
    components: {
      recognitionDetail
    },
    data() {
      return {
        orderID:0,
        refundList:{},
        dialogFormVisible: false,
        msg: "",
        tableManyRow: 0,
        getCollectionPriceTotal: 0
      };
    },
    mixins: [ collectTeamDetails ],
    created () {
      //    this.getOrder(this.refundList.orderID);
    },
    methods: {
      // 点击图片钩子
      handlePreview (file) {
        window.open(file.url);
      },
      recognitionClose (str) {
        this.dialogFormVisible = false;
      },
      // 查看认款详情
      handleRecognitionDetail (row) {
        this.msg = {
          id: row.id
        };
        this.dialogFormVisible = true;
      },
    }
  }
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
