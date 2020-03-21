<!--
  审批详情
  流程：先审批通过 -> 然后传入报销id，api/listforexpense -> 若不为空则进行打印，为空返回列表页 -> 关闭打印窗口返回列表页
  打印：打印时可能拿不到借款数据，因为后端返给我的也是通过调用工作流的接口拿到返回状态，异步，前端拿不到状态，加了获取状态的接口

-->
<template>
  <div class="loan-management">
    <el-row style="margin-top: 20px;">
      <el-col :span="6" :offset="18" style="text-align:center;">
        <el-button type="warning" @click="handleCancel">取消</el-button>
        <el-button type="success" @click="handlePassBtn">通过</el-button>
        <el-button type="danger" @click="handleRejectBtn">驳回</el-button>
      </el-col>
    </el-row>
    <!-- 报销信息 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>报销信息</el-divider>
    <el-row class="row-content">
      <el-col :span="24">
        <el-tabs>
          <el-tab-pane v-for="tabItem in keepBackContent" :key="tabItem.id" :label="'报销 - '+String(tabItem.id)" :name="String(tabItem.id)">
            <el-row class="item-content">
                <el-tag type="warning" v-if="tabItem.checkType=='0'" class="distributor-status">审批中</el-tag>
                <el-tag type="danger" v-if="tabItem.checkType=='2'" class="distributor-status">驳回</el-tag>
                <el-tag type="success" v-if="tabItem.checkType=='1'" class="distributor-status">通过</el-tag>
            </el-row>
            <el-row type="flex" class="row-bg row-content" justify="space-between">
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">ID:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.id }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="7"><div class="grid-del label-color">申请人:</div></el-col>
                <el-col :span="17"><div class="grid-del">{{ tabItem.createUser }}</div></el-col>
              </el-col>
              <el-col :span="6">
                <el-col :span="9"><div class="grid-del label-color">创建时间:</div></el-col>
                <el-col :span="15"><div class="grid-del">{{ tabItem.createTime | formatDate }}</div></el-col>
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
                  <el-upload
                    class="upload-demo"
                    name="files"
                    :file-list="tabItem.files"
                    :show-file-list=true
                    action="test"
                    :disabled=true
                    :on-preview="handlePreview"
                  >
                  </el-upload>
                </el-col>
              </el-col>
            </el-row>
            <el-row type="flex" class="row-bg reimbursement-mt" justify="space-between">
              <el-table :data="tabItem.payments" border :header-cell-style="getRowClass" v-loading="listLoading">
                <el-table-column prop="paymentID" label="无收入借款或预付款ID" align="center"></el-table-column>
                <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
                <!--<el-table-column prop=" " label="申请人" align="center"></el-table-column>-->
                <el-table-column prop="paymentMark" label="摘要" align="center"></el-table-column>
                <el-table-column prop="paymentPrice" label="借款金额" align="center"></el-table-column>
                <!--<el-table-column prop="noPrice" label="未报销金额" align="center">
                  <template slot-scope="scope">
                    <div>{{ scope.row.paymentPrice - scope.row.price }}</div>
                  </template>
                </el-table-column>-->
                <el-table-column prop="price" label="报销金额" align="center"></el-table-column>
                <el-table-column prop="peopleCount" label="人数" align="center"></el-table-column>
                <el-table-column prop="expenseType" label="还款/拆分" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.expenseType == 1">拆分</div>
                    <div v-if="scope.row.expenseType == 2">还款</div>
                  </template>
                </el-table-column>
                <!-- 1-拆分，2-还款 -->
                <el-table-column prop="expenseType" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleExpenseType(scope.$index, scope.row)" type="primary" plain size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 报销信息 END -->
    <!-- 审核结果 -->
    <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
    <el-row type="flex" class="row-bg row-content" justify="space-between">
      <el-table :data="examineData" border :header-cell-style="getRowClass" v-loading="listLoading">
        <el-table-column prop="finishedTime" label="审批时间" align="center"></el-table-column>
        <el-table-column prop="participantName" label="审批人" align="center"></el-table-column>
        <el-table-column prop="approvalName" label="审批结果" align="center"></el-table-column>
        <el-table-column prop="spContent" label="审批意见" align="center"></el-table-column>
      </el-table>
    </el-row>
    <!-- 审核结果 END -->
    <!-- 通过、驳回弹框 -->
    <el-dialog :title="title" :visible.sync="transitShow" width="40%" custom-class="city_list">
      <textarea rows="8" v-model="commentText" style="overflow: hidden; width:99%;margin:0 0 20px 0;"></textarea>
      <el-row>
        <el-col :span="2" :offset="21">
          <el-button @click="handlePassConfirm" type="primary" :loading="loadingBtn">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 通过、驳回弹框 END -->
    <el-dialog width="60%" title="打印" :visible="ifShowPrintTable" :before-close="handlePrintClose">
      <el-tabs>
        <el-tab-pane v-for="item in changeData" :key="item.id" :label="'报销 - ' + String(item.id)">
            <el-table :data="item.arr" border style=" width:90%; margin:30px 0 20px 25px;" :header-cell-style="getRowClass">
              <el-table-column prop="parentID" label="拆分前借款单ID" width="150" align="center"></el-table-column>
              <el-table-column prop="id" label="新无收入借款单ID" align="center"></el-table-column>
              <el-table-column prop="supplierTypeEX" label="借款类型" align="center"></el-table-column>
              <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
              <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
              <el-table-column prop="mark" label="摘要" align="center"></el-table-column>
              <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
              <el-table-column prop="opinion" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="handlePrint(scope.$index, scope.row)" type="primary" plain size="small">打印</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 打印信息 -->
    <div ref="print" v-if="isShowPrintContent">
<!--      <div class="print-title">{{ getTopName }} - {{ presentRouter == '无收入借款管理' ? '无收入借款' : '预付款' }} - 借款单 </div>-->
      <!-- 基本信息 -->
      <div class="item-content print-hidden">
        <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
      </div>
      <!-- 第一行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
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
        </el-col>
      </el-row>
      <!-- 第一行 END -->
      <!-- 第二行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">团期计划:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ fundamental.groupCode }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">产品名称:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ fundamental.productName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="7"><div class="grid-del label-color">供应商:</div></el-col>
          <el-col :span="17"><div class="grid-del ">{{ fundamental.supplierName }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第二行 END -->
      <!-- 第三行 -->
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">借款类型:</div></el-col>
          <el-col :span="15">
            <div class="grid-del">{{ fundamental.supplierTypeEX }}</div>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">借款金额:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ fundamental.price }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <!-- 摘要打印时隐藏 -->
          <el-col :span="6" class="print-hidden"><div class="grid-del label-color">摘要:</div></el-col>
          <el-col :span="17" class="print-hidden"><div class="grid-del ">{{ fundamental.mark }}</div></el-col>
        </el-col>
      </el-row>
      <!-- 第三行 END -->
      <!-- 支付账户 -->
      <el-row type="flex" class="row-bg print-acount" justify="start">
        <el-col :span="2" :offset="1"><div class="grid-del label-color">支付账户:</div></el-col>
        <el-col :span="18"><div class="grid-del">{{ fundamental.accountsName }}</div></el-col>
      </el-row>
      <!-- 支付账户 -->
      <!-- 审批人 打印时输出 -->
      <!--<el-row type="flex" class="row-bg print-approve" justify="start">
        <el-col :span="2" :offset="1"><div class="grid-del label-color">审批人:</div></el-col>
        <el-col :span="18"><div class="grid-del" v-html="printAuditingContent"></div></el-col>
      </el-row>-->
      <!-- 审批人 打印时输出 END -->
      <!-- 第四行 -->
      <el-row type="flex" class="row-bg print-acount-padding" justify="space-around">
        <el-col :span="6">
          <el-col :span="6"><div class="grid-del label-color">账号:</div></el-col>
          <el-col :span="18"><div class="grid-del ">{{ fundamental.cardNumber }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">开户行:</div></el-col>
          <el-col :span="15"><div class="grid-del">{{ fundamental.bankName }}</div></el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="9"><div class="grid-del label-color">开户名:</div></el-col>
          <el-col :span="15"><div class="grid-del ">{{ fundamental.cardName }}</div></el-col>
        </el-col>
      </el-row>
    </div>
    <!-- 参看拆分/还款弹窗 -->
    <el-dialog :title="title" :visible.sync="expenseType" width="40%" custom-class="city_list">
      <p v-show="this.showExpenseType == 1"><span>拆分/还款: <strong  style="margin-left: 10px;">拆分</strong ></span></p>
      <p v-show="this.showExpenseType == 0"><span>没有进行相关操作</span></p>
      <p style="margin-top: 10px;" v-show="this.showExpenseType == 2"><span>拆分/还款: <strong  style="margin-left: 10px;">还款</strong ></span></p>
      <p style="margin-top: 10px;" v-show="this.showExpenseType == 2"><span>汇款/现金: <strong  style="margin-left: 10px;">{{ showAccountName }}</strong ></span></p>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import moment from 'moment'

  export default {
    name: "approveDetail",
    data(){
      return {
        fundamental: {}, // 打印详情数据
        changeData: [], // 打印数据整合
        expenseType: false, // 显示拆分、还款弹窗
        showExpenseType: false,
        showAccountName: '', // 对公账户名称
        isShowPrintContent: false,
        ifShowPrintTable: false, // 打印弹窗显示开关
        listLoading: false,
        loadingBtn: false, // 审批、驳回，请求数据接口
        examineData: [], // 审核
        keepBackContent: [], // 保存tab列表页数据
        keepExpense: [], // 从详情获取到报销id
        getApproveListGuid: null, // 获取列表页的的guid
        workItemIDArr: null, // 保存匹配的WorkItemID 数组
        commentText: '', // 驳回通过内容
        transitShow: false, // 通过驳回弹窗
        title: '', // 通过驳回弹窗标题切换
        getParamsWorkItemId: null, // 工作流接口参数
        keepTabId: [],
        tabCount: [], // 计数开关
      }
    },
    // 关于时间的过滤
    filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    created () {
      this.getApproveListGuid = this.$route.query.approveDetailGuid;
      this.workItemIDArr = this.$route.query.queryWorkItemID;
      this.getApproveDetail(this.getApproveListGuid);
      this.auditResult(this.getApproveListGuid);
      if (this.workItemIDArr) {
        this.workItemIDArr.forEach((item) => {
          if (this.getApproveListGuid === item.jq_ID){
            this.getParamsWorkItemId = item.workItemID
          }
        })
      }
    },
    methods: {
      // 列表查看详情报销方式
      handleExpenseType (index, row) {
        let _this = this;
        this.showExpenseType = row.expenseType;
        let getAccountID = row.accountID;
        this.expenseType = true;
        if (this.showExpenseType === 2) {
          this.$http.post(this.GLOBAL.serverSrc + '/finance/collectionaccount/api/get', {
            "id": getAccountID
          }).then(res => {
            let keepRes = res.data;
            if (keepRes.isSuccess === true) {
              _this.showAccountName = keepRes.object.title;
            }
          })
        }
      },
      // 打印详情,当有拆分时会进行打印
      printDetails () {
        this.$nextTick(() => {
          this.$print(this.$refs.print)
        })
      },
      // 获取一条信息
      getLabel (paramPaymentID) {
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
          "id":paramPaymentID
        }).then(res => {
          if (res.data.isSuccess === true) {
            this.fundamental = {};
            this.isShowPrintContent = true;
            this.fundamental=res.data.object;
            this.printDetails();
          }
        })
      },
      // 弹窗关闭回调
      handlePrintClose () {
        this.$confirm('确认关闭？')
          .then(res => {
            this.ifShowPrintTable = false;
            this.backListPage();
          })
          .catch(res => {});
      },
      handlePrint (index, row) {
        this.getLabel(row.id);
      },
      // 点击图片钩子
      handlePreview (file) {
        window.open(file.url);
      },
      moment,
      // 获取审核结果
      auditResult (paramsGuid) {
        let that = this;
        this.listLoading = true;
        // GetOpinions;
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ', {
          jQ_ID: paramsGuid,
          jQ_Type: 3,
        }).then(obj => {
          that.examineData = [];
          that.examineData = obj.data.extend.instanceLogInfo;
          this.listLoading = false;
        }).catch(obj => {
          console.log(obj);
        })
      },
      // 获取详情
      getApproveDetail (guidParams) {
        this.listLoading = true;
        this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/list', {
          "object": {
            guid: guidParams
          }
        })
        .then(obj => {
          let keepData = obj.data.objects;
          this.keepBackContent = keepData;
          // 筛选出拆分的数据，筛选出expenseID并重组新数组
          this.keepExpense = keepData.map( item => {
            return item.id
          });
          this.listLoading = false
        }).catch(err => {
          console.log(err);
        })
      },
      // 通过审批/驳回，弹窗确定按钮
      handlePassConfirm () {
        this.loadingBtn = true;
        if (this.title === "审批通过") {
          this.handlePassApi();
        } else {
          this.handleRejectFn();
        }
      },
      // 工作流通过方法
      handlePassApi () {
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/SubmitWorkAssignmentsForJQ_InsertOpinion', {
          "jQ_ID": this.getApproveListGuid,
          "jQ_Type": 3,
          "userCode": sessionStorage.getItem('tel'),
          "workItemID": this.getParamsWorkItemId,
          "commentText": this.commentText
        }).then(res => {
          this.$message({
            message: '审批通过已完成',
            type: 'success'
          });
          this.handlePassFn();
          this.loadingBtn = false;
          this.transitShow = false;
        }).catch( err => {
          console.log(err);
          this.$message.warning("审批通过失败 ");
          this.loadingBtn = false;
        })
      },
      // 打印表格
      showPrintTable (paramsTabId) {
        this.$http.post(this.GLOBAL.serverSrc + "/finance/payment/api/listforexpense", {
          "id": paramsTabId
        }).then( obj =>  {
          let keepObjLength = obj.data.objects;
          // 如果没有需要打印的数据则返回列表页
          if (keepObjLength && keepObjLength.length > 0)  {
            // 组合数据 用来遍历tab组件 形成多个tab页
            this.changeData.push({ id: paramsTabId, arr: obj.data.objects });
            if (this.tabCount <= 0) {
              this.ifShowPrintTable = true;
            }
            console.log(this.changeData, '/api/listforexpense 进入打印方法')
          } else {
            // console.log(keepObjLength)
            // this.backListPage()
          }
        })
      },
      // 审批通过弹窗-确定
      handlePassFn () {
        if (this.keepExpense.length > 0) {
          this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/list', {
            "object": {
              guid: this.getApproveListGuid
            }
          })
          .then(obj => {
            let keepData = obj.data.objects;
            if (keepData !== null) {
              this.keepTabId.length = 0;
              this.keepExpense.forEach(item => {
                this.keepTabId.push(item);
              });
              this.tabCount = this.keepTabId.length; // 计数开关
              console.log(this.tabCount, '计数开关初始化');
              this.keepTabId.forEach(item => {
                // 获取一条审批状态 checkType = 1 方可打印
                this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/getchecktype', {
                  id: item // 报销ID
                })
                .then(obj => {
                  if  (obj.data.object.checkType === 1) {
                    this.tabCount--;
                    this.showPrintTable(item);
                    console.log(this.tabCount,'checkType 已经等于 1 了，/api/getchecktype')
                  } else {
                    this.handlePassFn();
                  }
                }).catch(obj => {
                  console.log(obj);
                })
              })
            } else {
              this.$message.warning("此报销不是待审批状态，无法进行审批操作");
            }
            this.listLoading = false;
          }).catch(err => {
          console.log(err);
        })
      } else {
        this.backListPage();
      }
      },
      // 驳回之后走工作流
      handleRejectFn () {
        this.$http.post(this.GLOBAL.jqUrl + '/JQ/RejectionOfWorkTasksForJQ_InsertOpinion', {
          "jQ_ID": this.getApproveListGuid,
          "jQ_Type": 3,
          "userCode": sessionStorage.getItem('tel'),
          "workItemID": this.getParamsWorkItemId,
          "commentText": this.commentText
        }).then(res => {
          // 结束工作流
          this.$http.post(this.GLOBAL.jqUrl + '/JQ/EndProcess', {
            "jq_id": this.getApproveListGuid,
            "jQ_Type": 3
          }).then(res => {
            this.$http.post(this.GLOBAL.serverSrc + '/finance/expense/api/savechecktype', {
              "object": {
                "guid": this.getApproveListGuid,
                "checkType": 2
              }
            }).then( res => {
              this.$message({
                message: '审批驳回已完成',
                type: 'success'
              });
              this.loadingBtn = false;
              this.transitShow = false;
              this.backListPage();
            }).catch(err => {
              this.loadingBtn = false;
              console.log(err);
            })
          }).catch(err => {
            console.log(err);
          })
        })
      },
      // 通过
      handlePassBtn () {
        this.title = "审批通过";
        this.transitShow = true;
      },
      // 驳回成功通过guid将checktype修改成2
      rejectedSuccess () {
        this.$http.post(this.GLOBAL.serverSrc + 'finance/expense/api/savechecktype', {
          "object": {
            "guid": this.getApproveListGuid,
            "checkType": 2
          }
        })
      },
      // 驳回
      handleRejectBtn () {
        this.title = "审批驳回";
        this.transitShow = true;
      },
      // 取消
      handleCancel () {
        this.backListPage();
      },
      // 返回到列表页
      backListPage () {
        this.$router.push({ path: "/approve/approveList" });
      },
      // 表格表头颜色
      getRowClass ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background:#f5f7fa;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return '';
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
      margin: 10px 0;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 27px;
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
