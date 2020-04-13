<!-- 退款-详情 -->
<template>
  <div class="loan-management">
    <!-- 按钮组 -->
    <div style="text-align: right; margin: 25px 20px 0 0;position: sticky;top: 0;right: 0;z-index: 100;">
      <el-button icon="el-icon-remove" @click="handleCancel" plain>取消</el-button>
      <el-button icon="el-icon-circle-check" @click="handlePass" type="success" plain>通过</el-button>
      <el-button icon="el-icon-circle-close" @click="handleRejected" type="danger" plain>驳回</el-button>
    </div>
    <!-- 按钮组 END -->
    <!-- 基本信息 -->
    <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
    <div style="margin-bottom: 30px;">
      <div class="item-content">
        <el-tag type="warning" v-if="refundList.refundStateType === '0'" class="distributor-status">申请退款</el-tag>
        <el-tag type="danger" v-if="refundList.refundStateType === '1'" class="distributor-status">退款完成</el-tag>
        <el-tag type="success" v-if="refundList.refundStateType === '2'" class="distributor-status">拒绝退款</el-tag>
      </div>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">退款单号:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del">{{ refundList.refundCode }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">申请人:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.name }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">申请时间:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.createTime | formatDate  }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">退款方式:</div></el-col>
          <el-col :span="17" v-if="refundList.refundType === 1" class="base-value"><div class="grid-del">部分退</div></el-col>
          <el-col :span="17" v-if="refundList.refundType === 2" class="base-value"><div class="grid-del">全退</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">总退款:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.allRefundPrice }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">实际退款金额:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.realRefundPrice }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">汇款账号:</div></el-col>
          <el-col :span="17" class="base-value">
            <div class="grid-del">{{ refundList.remittanceCode }}</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">汇款开户行:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del">{{ refundList.remittanceBank }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">汇款开户人:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.remittancePerson }}</div></el-col>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">退款原由:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.reason }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">支付账户:</div></el-col>
          <el-col :span="17" class="base-value"><div class="grid-del">{{ payName }}</div></el-col>
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>
    <!-- 基本信息 END -->
    <el-collapse v-model="collapseName">
      <!-- 订单详情 -->
      <el-collapse-item class="collapse-m" name="collapseOrderDel">
        <template slot="title">
          <el-divider content-position="left">订单详情</el-divider>
        </template>
        <div>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
              <el-col :span="6"><div class="grid-del label-color">订单ID:</div></el-col>
              <el-col :span="17" class="base-value"><div class="grid-del" @click="orderDetails(1)"><a href="#" type="info">{{ refundList.orderCode }}</a></div></el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6"><div class="grid-del label-color">订单金额:</div></el-col>
              <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.payable }}</div></el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6"><div class="grid-del label-color">已付金额:</div></el-col>
              <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.paid }}</div></el-col>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
              <el-col :span="6"><div class="grid-del label-color">未付金额:</div></el-col>
              <el-col :span="17" class="base-value"><div class="grid-del">{{ nonPayment }}</div></el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6"><div class="grid-del label-color">其他费用:</div></el-col>
              <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.otherPrice }}</div></el-col>
            </el-col>
            <el-col :span="6">
              <el-col :span="6"><div class="grid-del label-color">整体优惠:</div></el-col>
              <el-col :span="17" class="base-value"><div class="grid-del ">{{ refundList.entiretyFav }}</div></el-col>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <!-- 订单详情 END -->
      <!-- 部分退款信息 -->
      <el-collapse-item class="collapse-m" name="collapsePartial">
        <template slot="title">
          <el-divider content-position="left">部分退信息</el-divider>
        </template>
        <div class="item-content">
          <el-tag type="success">还需退款: {{ refundList.needRefundPrice }}</el-tag>
        </div>
        <el-table :data="tablePartial" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="enrollName" label="报名类型" align="center"></el-table-column>
          <el-table-column prop="singlePrice" label="价钱" align="center"></el-table-column>
          <el-table-column prop="cnName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
          <el-table-column prop="idCard" label="身份证" align="center"></el-table-column>
          <el-table-column label="性别" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 0">男</span>
              <span v-if="scope.row.sex === 1">女</span>
              <span v-if="scope.row.sex === 3">未选择</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 部分退款信息 END -->
      <!-- 审核结果 -->
      <el-collapse-item class="collapse-m" name="collapseApprove">
        <template slot="title">
          <el-divider content-position="left">审核结果</el-divider>
        </template>
        <el-table :data="tableCourse" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="createdTime" :formatter='dateFormatDetails' label="审批时间" align="center"></el-table-column>
          <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
          <el-table-column label="审批结果" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalName === '审批中'" style="color: #7F7F7F" >{{ scope.row.approvalName }}</div>
              <div v-if="scope.row.approvalName === '驳回'" style="color: #FF4A3D" >{{ scope.row.approvalName }}</div>
              <div v-if="scope.row.approvalName === '通过'" style="color: #33D174" >{{ scope.row.approvalName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="comments" label="审批意见" align="center"></el-table-column>
        </el-table>
      </el-collapse-item>
      <!-- 审核结果 END -->
    </el-collapse>

    <!-- 通过、驳回弹框 -->
    <el-drawer direction="rtl" size="30%" :show-close="false" :visible.sync="ifShowApproveDialog">
      <el-divider class="mb-40">{{ approveDialogTitle }}</el-divider>
      <div class="el-drawer-content">
        <el-input type="textarea" v-model="approvalOpinion"></el-input>
      </div>
      <div style="display: flex; justify-content: flex-end;margin:30px 2% 0 0;">
        <el-button icon="el-icon-close" size="small" plain @click="handleApproveDialogCancel">取消</el-button>
        <el-button icon="el-icon-check" size="small" type="primary" plain @click="handleApproveDialogConfirm">确定</el-button>
      </div>
    </el-drawer>
    <!-- 通过、驳回弹框 END -->
    <!-- 订单信息 -->
    <order-info :orderID="orderID" :orderVariable="orderVariable" :orderDialogType="orderDialogType"></order-info>
    <!-- 订单信息 END -->
  </div>
</template>
<script>
  import orderInfo from "./orderDetails";
  import common from "../mixins/common";

  export default {
    name: "refundDetails",
    components: {
      orderInfo
    },
    data () {
      return {
        collapseName: ['collapseOrderDel'], // 控制折叠面板是否折叠
        orderID: 0,
        orderVariable: 0,
        orderDialogType: 0,
        refundList: {}, // 详情数据
        tableDate: [], // 详情弹窗部分退信息表格
        tableCourse: [], // 详情页面审核结果表格
        indentID: 0,
        approveDialogTitle: '', // 审批弹窗标题设置
        approvalOpinion: '', // 审批意见
        multipleSelection: [], // 选中的list
        disbursementID: 0, // 获取详情时支付账户的id
        payName: '', // 选择支付账户，通过ID获取名字
        nonPayment: 0, // 未付金额
        tablePartial: [],
        guid: '', // 接口用的guid
        getWorkItemId: '', // 保存匹配的 workItemId
      };
    },
    mixins: [ common ],
    created () {
      this.getWorkItemId = this.$route.query.workItemID; // 工作流接口用
      this.keepPaymentId = this.$route.query.pendingDetailPaymentId; // PaymentId 接口用
      this.apiGetDetail(this.keepPaymentId);
    //    this.getOrder(this.refundList.orderID);
    },
    methods: {
      getCellClass () {
        return "textAlign:center";
      },
      changeFun (val) {
        //保存选中项的数据
        this.multipleSelection = val;
      },
      clickRow (row) {
        //选中行复选框勾选
        this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      rowClass ({row, rowIndex}) {  // 选中行样式改变
        for(let i=0; i<this.multipleSelection.length; i++) {
          if(this.multipleSelection[i].id === row.id){
            return { "background-color": "#ecf5ff" };
          }
        }
      },
      // 获取审批结果tableAudit
      getJqId ( paramsInstanceID) {
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ_BY_InstanceID', {
          "instanceId":paramsInstanceID,
        }).then(obj => {
          let keepApproveData = obj.data.extend.instanceLogInfo
          this.tableCourse = [];
          this.tableCourse = keepApproveData;
          // 依据有无数据控制折叠面板显示
          if (keepApproveData.length > 0) {
            this.collapseName.push('collapseApprove')
          }
        })
      },
      // 点击退款获取详情信息
      getOrder (paramsId) {
        this.$http.post(this.GLOBAL.serverSrc + "/order/refund/api/get", {
          id: paramsId,
        }).then(res => {
          if (res.data.isSuccess === true) {
            let orderInfo = res.data.object;
            if (this.refundList.refundStateType === 1) {
              this.nonPayment = this.refundList.payable - (this.refundList.paid - this.refundList.realRefundPrice);
            } else {
              this.nonPayment = this.refundList.payable - this.refundList.paid;
            }
            this.nonPayment = this.nonPayment>0?this.nonPayment:0;
          }
        })
      },
      // 获取详情
      apiGetDetail (paramsId) {
        this.$http.post(this.GLOBAL.serverSrc + "/finance/refund/api/get", {
          id: paramsId
        }).then(res => {
          if (res.data.isSuccess === true) {
            let keepRes = res.data.object;
            this.refundList = keepRes;
            this.guid = keepRes.orderCode;
            this.indentID = keepRes.orderID;
            this.tableDate = keepRes.guests;
            this.getJqId(keepRes.instanceID);
            this.tablePartial = keepRes.mark === "" ? [] : JSON.parse(keepRes.mark);

            if (keepRes.mark.length > 0) {
              this.collapseName.push('collapsePartial')
            }

            this.disbursementID = keepRes.payID;
            this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/get", {
              id: this.disbursementID,
            }).then(res => {
              if (res.data.isSuccess === true) {
                this.payName = keepRes.title;
              }
            })
          }
        }).catch(err => {
          console.log( err )
        });
      },
      orderDetails (i) {
        this.orderVariable++;
        this.orderDialogType = i;
        this.orderID = this.indentID;
      },
    }
  };
</script>

<style  lang="scss">
  .el-divider__text{
    font-size: 16px !important
  }
</style>

<style scoped lang="scss">
  .el-drawer-content{
    width: 96%;
    margin: 0 auto;
  }
  .loan-management{
    width: 99%;
    margin: 25px auto 50px;
    height: auto;
    border: 1px solid #e6e6e6;
    .collapse-m{
      margin: 30px 0;
    }
    .row-content{
      width: 95%;
      margin: 0 auto;
    }
    .base-value{
      color: #000;
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
  }
</style>
