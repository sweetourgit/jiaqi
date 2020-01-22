<template>
  <div class="vivo" style="position:relative" id="collectionDetail">
    <el-dialog title="详情" :visible="dialogFormVisible" @close="closeAdd" custom-class="city_list" :show-close="false" style="margin:-80px 0 0 0;width: 100%;">
      <div class="buttonDv">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <el-button type="primary" @click="approvalPass" :disabled="passButtonDo">通过</el-button>
        <el-button type="primary" @click="approvalReject">驳回</el-button>
        <el-button @click="chooseAccount" type="warning" class="table_details" v-if="baseInfo.type != 3 && passButtonDo">选择付款账户</el-button>
        <el-button
          type="success"
          @click="touchPrint"
          plain
          v-if="isShowDY"
        >
          打印本页详情信息
        </el-button>
      </div>
      <!--<p class="stepTitle">基本信息</p>-->
      <el-divider content-position="left">基本信息</el-divider>
      <el-button type="warning" round size="mini" style="margin-left: 4%;" v-if="baseInfo.approval_status == 1">审批中</el-button>
      <el-button type="danger" round size="mini" style="margin-left: 4%;" v-if="baseInfo.approval_status == 2">驳回</el-button>
      <el-button type="success" round size="mini" style="margin-left: 4%;" v-if="baseInfo.approval_status == 3">通过</el-button>
      <div class="stepDv">
        <p class="inputLabel"><span>ID：</span>{{baseInfo.id}}</p>
        <p class="inputLabel"><span>申请人：</span>{{baseInfo.orgName}}--{{baseInfo.create_uid}}</p>
        <p class="inputLabel"><span>申请时间：</span>{{baseInfo.created_at}}</p>
        <p class="inputLabel"><span>供应商：</span>{{baseInfo.supplier}}</p>
        <p class="inputLabel"><span>借款类型：</span>{{periphery_type[baseInfo.type]}}</p>
        <p class="inputLabel"><span>借款金额：</span>{{baseInfo.money}}</p>
        <p class="inputLabel"><span>摘要：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>账号：</span>{{baseInfo.account}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>开户行：</span>{{baseInfo.accountBank}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>开户名：</span>{{baseInfo.accountName}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>支付账户：</span>{{baseInfo.accountCode}}</p>
        <p class="inputLabel"><span>已报销金额：</span>{{baseInfo.reimbursed_money}}</p>

        <div class="inputLabel">
          <span>附件：</span>
          <!--<el-upload ref="upload1" class="upload-demo" action="" :file-list="fileList" :disabled="disabled">-->
          <!--<el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>-->
          <!--</el-upload>-->

          <ul>
            <li v-for="item in fileList" :key="item.index">
              <a :href="item.url" target="_blank">{{item.name}}</a>
            </li>
          </ul>
        </div>
      </div>

      <el-divider content-position="left">审核结果</el-divider>
      <div class="stepDv bottomDis">
        <el-table ref="singleTable" :data="tableDataResult" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
          <el-table-column prop="approval_at" label="审批时间" align="center" >
          </el-table-column>
          <el-table-column prop="approval_uid" label="审批人" align="center" >
          </el-table-column>
          <el-table-column prop="approval_status" label="审批结果" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approval_status=='0'" style="color: #7F7F7F" >等待中</div>
              <div v-if="scope.row.approval_status=='1'" style="color: #7F7F7F" >审批中</div>
              <div v-if="scope.row.approval_status=='2'" style="color: #FF4A3D" >驳回</div>
              <div v-if="scope.row.approval_status=='3'" style="color: #00B83F" >通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="approval_comments" label="审批意见" align="center">
          </el-table-column>
        </el-table>
      </div>

      <div v-if="baseInfo.type != 1">
        <el-divider content-position="left">相关信息</el-divider>
        <div class="stepDv bottomDis">
          <el-table ref="singleTable" :data="tableDataRelated" border :header-cell-style="getRowClass" maxHeight="700">
            <el-table-column prop="order_sn" label="订单编号" align="center">
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称" align="center">
            </el-table-column>
            <el-table-column prop="contact_name" label="订单联系人" align="center">
            </el-table-column>
            <el-table-column prop="quantity" label="人数" align="center">
            </el-table-column>
            <el-table-column prop="cost" label="成本" align="center">
            </el-table-column>
            <el-table-column prop="income" label="订单金额" align="center">
            </el-table-column>
            <el-table-column prop="reimbursed_money" label="已报销金额" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!--审批弹窗-->
      <div>
        <el-dialog style="text-align: left;" :title="approvalTitle" :visible.sync="dialogVisibleApproval" width="30%" top="20vh" append-to-body>
          <div>
            <p class="areaP" v-if="approval_status == 3">通过说明：</p>
            <p class="areaP" v-if="approval_status == 2">驳回意见：</p>
            <el-input class="areaIn" type="textarea" :rows="3" placeholder="请输入内容(选填)" v-model="approvalMark"></el-input>
          </div>
          <div slot="footer" style="overflow: hidden;">
            <el-button @click="dialogVisibleApproval = false">取 消</el-button>
            <el-button type="primary" @click="approvalSubmitWorking()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!--审批结束-->
      <printPage ref="printHandle" :printMsg1='printMsg1' style='display:none;'></printPage>
      <chooseAccount :dialogFormVisible2="dialogFormVisible2" :info="info.id" @close="close"></chooseAccount>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  import chooseAccount from '@/page/Finance/aroundBorrowingManagement/chooseAccount.vue'// 选择付款账户
  import printPage from '@/page/Finance/aroundBorrowingManagement/printPage.vue'// 打印
  export default {
    name: "collectionDetail",
    components: {
      chooseAccount,
      printPage
    },
    props: {
      dialogFormVisible: false,
      info: ''
    },
    data() {
      return {
        isShowDY: false,
        printMsg1: {},
        passButtonDo: false,
        // 基础信息
        baseInfo: {
          id: '',
          create_uid: '',
          orgName: '',
          created_at: '',
          supplier: '',
          type: '',
          money: '',
          remark: '',
          account: '',
          accountBank: '',
          accountName: '',
          accountCode: '',
          reimbursed_money: ''
        },
        // 认款方式array
        periphery_type: {
          '1': '无收入借款',
          '2': '预付款',
          '3': '余额支付借款'
        },
        // 基础信息凭证
        fileList: [],
        // 审核结果，table数据
        tableDataResult: [],
        // 相关信息，table数据
        tableDataRelated: [],

        // 审批弹框数据
        approvalTitle: '',
        dialogVisibleApproval: false,
        approval_status: '',
        approvalMark: '',

        // 选择付款账户
        dialogFormVisible2: false,

        approval_s_n: {
          0: '等待中',
          1: '审批中',
          2: '驳回',
          3: '通过'
        }
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      dialogFormVisible: {
        handler:function(){
          if(this.info != '' && this.dialogFormVisible){
            if(sessionStorage.getItem('orgID') == '542' && sessionStorage.getItem('userCode') == 'dy10009862'){
              this.passButtonDo = true;
            }
            this.loadData();
          }
        }
      }
    },
    methods: {
      // 打印详情
      touchPrint(){
        const that = this;
        let printAuditingContent = '';
        if(this.tableDataResult.length > 0 ) {
          printAuditingContent = '<b>开始</b> -> '
          this.tableDataResult.forEach(function (item) {
            printAuditingContent += item.approval_uid + '( <b>' + that.approval_s_n[item.approval_status] + '</b> )'  + ' -> ';
          })
          printAuditingContent += '<b>结束</b>'
        }
        this.printMsg1 = {
          getTopName: sessionStorage.getItem('topName'),
          presentRouter: this.periphery_type[this.baseInfo.type],
          fundamental: this.baseInfo,
          checkType: 0,
          printContent: printAuditingContent
        };
        // console.log(this.printMsg1);
        this.$nextTick(() => this.$refs.printHandle.printDetails());
      },
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      chooseAccount(){
        this.dialogFormVisible2 = true;
      },
      close(str){
        this.dialogFormVisible2 = false;
        if(str == 'success'){
          this.passButtonDo = false;
          this.loadData();
        }
      },
      // 关闭弹窗
      closeAdd(){
        this.baseInfo = {
          id: '',
          create_uid: '',
          orgName: '',
          created_at: '',
          supplier: '',
          type: '',
          money: '',
          remark: '',
          account: '',
          accountBank: '',
          accountName: '',
          accountCode: '',
          reimbursed_money: ''
        };

        this.$emit('close', false);
      },

      // 通过按钮事件
      approvalPass(){
        this.dialogVisibleApproval = true;
        this.approvalTitle = '审批通过';
        this.approval_status = '3';
      },
      // 驳回按钮事件
      approvalReject(){
        this.dialogVisibleApproval = true;
        this.approvalTitle = '审批驳回';
        this.approval_status = '2';
      },

      // 工作流审批
      approvalSubmitWorking(){
        const that = this;
        if(this.approval_status == 2){// 驳回
          this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/RejectionOfWorkTasksForZB", {
            "userCode": sessionStorage.getItem('tel'),
            "workItemID": this.info.workItemID,
            "commentText": this.approvalMark
          }, ).then(function(response) {
            console.log('工作流驳回操作', response);
            const result = JSON.parse(response.data);
            if(result.code == 0){
              that.approvalSubmit();
            }

          }).catch(function(error) {
            console.log(error);
          });

          this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/EndProcessForZB", {
            "jq_id": this.info.id,
            "jQ_Type": this.baseInfo.type
          }, ).then(function(response) {
            console.log('工作流结束进程', response);
            const result = JSON.parse(response.data);
            if(result.code == 0){
              console.log("结束工作流");
            }
          }).catch(function(error) {
            console.log(error);
          });

        }else if(this.approval_status == 3){// 通过
          this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/SubmitWorkAssignmentsForZB", {
            "userCode": sessionStorage.getItem('tel'),
            "workItemID": this.info.workItemID,
            "commentText": this.approvalMark
          }, ).then(function(response) {
            const result = JSON.parse(response.data);
            if(result.code == 0){
              console.log('工作流提交通过', response);
              that.approvalSubmit();
            }
          }).catch(function(error) {
            console.log(error);
          });
        }

      },

      // 审批提交事件
      approvalSubmit(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/examine", {
          "id": this.info.id,
          "create_uid": sessionStorage.getItem('id'),
          "org_id": sessionStorage.getItem('orgID'),
          "approval_status": this.approval_status,
          "approval_comments": this.approvalMark
        }, ).then(function(response) {
          console.log('审批操作',response);
          if (response.data.code == '200') {
            that.$message.success("审批提交成功~");
            that.dialogVisibleApproval = false;
            that.approval_status = '';
            that.approvalMark = '';
            that.closeAdd();
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("撤销失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });

      },

      // 加载数据
      loadData(){
        const that = this;
        // 获取基本信息
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/info", {
          "id": this.info.id
        }, ).then(function(response) {
          // console.log('详情',response);
          if (response.data.code == '200') {
            response.data.data.info.created_at = formatDate(new Date(response.data.data.info.created_at*1000));

            that.baseInfo = {
              id: response.data.data.info.id,
              create_uid: response.data.data.info.create_uid,
              orgName: '',
              created_at: response.data.data.info.created_at,
              supplier: response.data.data.info.supplier_code,
              type: response.data.data.info.periphery_type,
              money: response.data.data.info.loan_money,
              remark: response.data.data.info.mark,
              accountCode: '',
              account: response.data.data.info.remittance_account,
              accountBank: response.data.data.info.opening_bank,
              accountName: response.data.data.info.account_name,
              reimbursed_money: response.data.data.info.reimbursed_money,
              approval_status: response.data.data.info.approval_status
            };

            if(response.data.data.info.periphery_type == 3){
              that.passButtonDo = false;
            }
            if(response.data.data.info.pay_type){
              const payType = JSON.parse(response.data.data.info.pay_type);
              that.baseInfo.accountCode = payType.account;
              that.passButtonDo = false;
            }

            // 根据ID获取人名
            that.getName(response.data.data.info.create_uid).then(res => {
              that.baseInfo.create_uid = res;
            });
            // 获取所属部门
            that.getOrgName(response.data.data.info.create_uid).then(res => {
              // console.log('部门',res);
              that.baseInfo.orgName = res;
            });

            // 获取供应商名称
            if(response.data.data.info.supplier_code){

              that.$http.post(that.GLOBAL.serverSrcZb + "/universal/supplier/api/supplierget", {
                "id": response.data.data.info.supplier_code
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {
                // console.log(response);
                if (response.data.isSuccess) {
                  that.baseInfo.supplier = response.data.object.name
                } else {
                  if(response.data.result.message){
                    that.$message.warning(response.data.result.message);
                  }else{
                    that.$message.warning("获取供应商名称失败~");
                  }
                }
              }).catch(function(error) {
                console.log(error);
              });
            }

            // 凭证
            that.fileList = JSON.parse(response.data.data.info.file);
            for(let i = 0; i < that.fileList.length; i++){
              that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
            }

            if(response.data.data.info.approval){
              that.tableDataResult = response.data.data.info.approval;
              that.tableDataResult.forEach(function (item, index, arr) {
                item.approval_at = formatDate(new Date(item.approval_at*1000));
                that.getName(item.approval_uid).then(res => {
                  item.approval_uid = res;
                });
              })
            }
            that.getApproval();

            if(response.data.data.info.rel_order){
              that.tableDataRelated = response.data.data.info.rel_order;
            }
          } else {
            that.$message.warning("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });

      },

      // 根据id获取操作人
      getName(id){
        const that = this;
        return that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
          "id": id
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          // console.log('名字',response.data.object.name);
          if (response.data.isSuccess) {
            return response.data.object.name;
          } else {
            that.$message.warning("失败~");
            return '';
          }
        }).catch(function(error) {
          console.log(error);
          return '';
        });
      },

      // 根据id获取所属部门
      getOrgName(ID){
        const that = this;
        return this.$http.post(this.GLOBAL.serverSrcZb + "/org/user/api/orgshort", {
          "id": ID
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          // console.log(ID,'组织名称',response);
          if (response.data.isSuccess) {
            return response.data.objects[0].name
          } else {
            return '';
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      // 获取审批节点
      getApproval(){
        const that = this;
        this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/GetInstanceActityInfoForZB", {
          "jq_id": this.info.id,
          "jQ_Type": this.baseInfo.type
        }, ).then(function(response) {
          // console.log('获取审批节点', response);
          // const result = JSON.parse(response.data);
          if(response.status == 200){
            // console.log("成功");
            response.data.extend.instanceLogInfo.forEach(function (item, index, arr) {
              if(item.finishedTime == '' && item.approvalName == '等待中'){
                const dataSingle = {
                  approval_at: '',
                  approval_uid: item.participantName,
                  approval_status: 0,
                  approval_comments: ''
                };
                that.tableDataResult.push(dataSingle);
              }
            })
          }
        }).catch(function(error) {
          console.log(error);
        });
      }

    },
    created() {
      if(sessionStorage.getItem('userCode') == 'TC900007' || sessionStorage.getItem('userCode') == 'TC900006') {
        this.isShowDY = true;
      } else {
        this.isShowDY = false;
      }
    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #collectionDetail .el-dialog{
    width: 90%;
  }
  #collectionDetail .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #collectionDetail .stepDv{
    width: 94%;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .inputLabel{
      width: 31%;
      font-size: 14px;
      line-height: 45px;
      margin: 0;
      vertical-align: top;
      span{
        display: inline-block;
        width: 120px;
        vertical-align: top;
      }
      ul{
        display: inline-block;
        width: 70%;
        list-style: none;
        padding: 0;
        margin: 0;
      }
    }
    .baseIn{
      width: 300px;
      vertical-align: top;
      margin: 10px auto;
    }
    .upload-demo{
      width: 80%;
      display: inline-block;
      margin: 10px auto;
    }
  }
  #collectionDetail .bottomDis{
    margin-bottom: 50px;
  }
  #collectionDetail .buttonDv{
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #collectionDetail .el-divider__text, #tradeAdd .el-link{
    font-size: 16px;
  }
  #collectionDetail .el-upload-list__item{
    margin-top: 10px !important;
  }
  #collectionDetail .el-upload-list__item{
    width: 100%!important;
  }
  .lineTitle{
    width: 100%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
</style>
