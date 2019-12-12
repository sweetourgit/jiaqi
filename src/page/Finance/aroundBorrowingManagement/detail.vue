<template>
  <div class="vivo" style="position:relative" id="collectionDetail">
    <el-dialog title="详情" :visible="dialogFormVisible1" @close="closeAdd" custom-class="city_list" :show-close="false" style="margin:-80px 0 0 0;width: 100%;">
      <div class="buttonDv">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <el-button type="primary" @click="backoutBtn" v-if="baseInfo.approval_status == 1 && showBack == true">撤销</el-button>
        <!-- 选择付款账户需求更改，改到审批时选择 -->
        <!-- <el-button @click="chooseAccount" type="warning" class="table_details" v-if="baseInfo.type != 3 && baseInfo.pay_type == null">选择付款账户</el-button> -->
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
        <p class="inputLabel" v-if="baseInfo.type != '1'"><span>借款金额：</span>{{baseInfo.money}}（{{baseInfo.number}}人）</p>
        <p class="inputLabel" v-if="baseInfo.type == '1'"><span>借款金额：</span>{{baseInfo.money}}</p>
        <!-- <p class="inputLabel"><span>借款金额：</span>{{baseInfo.money}}</p> -->
        <p class="inputLabel"><span>摘要：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>账号：</span>{{baseInfo.account}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>开户行：</span>{{baseInfo.accountBank}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>开户名：</span>{{baseInfo.accountName}}</p>
        <p class="inputLabel" v-if="baseInfo.type != 3"><span>支付账户：</span>{{baseInfo.accountPay}}</p>
        <p class="inputLabel"><span>已报销金额：</span>{{baseInfo.reimbursed_money}}</p>

        <div class="inputLabel">
          <span>附件：</span>
          <ul>
            <li v-for="item in fileList" :key="item.index">
              <a :href="item.url" target="_blank">{{item.name}}</a>
            </li>
          </ul>
        </div>
      </div>

      <el-divider content-position="left">审核结果</el-divider>
      <div class="stepDv bottomDis">
        <el-table ref="singleTable" :data="tableDataResult" border :header-cell-style="getRowClass">
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
      <chooseAccount :dialogFormVisible2="dialogFormVisible2" :info="info" @close="close"></chooseAccount>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  import chooseAccount from '@/page/Finance/aroundBorrowingManagement/chooseAccount.vue'// 选择付款账户
  export default {
    name: "collectionDetail",
    components: {
      chooseAccount
    },
    props: {
      dialogFormVisible1: false,
      info: ''
    },
    data() {
      return {
        disabled: true,
        // 基础信息
        baseInfo: {
          id: '',
          create_uid: '',
          orgName: '',
          created_at: '',
          supplier: '',
          type: '',
          money: '',
          number: '',
          remark: '',
          account: '',
          accountBank: '',
          accountName: '',
          accountPay: '',
          reimbursed_money: '',
          approval_status: '',
          pay_type: ''
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

        showBack: true, // 是否显示撤销按钮(当前状态为审批中，并且登录人和申请人相同时，显示按钮，可以撤销)

        dialogFormVisible2: false
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler:function(){
//          alert(this.info);
          if(this.info != '' && this.dialogFormVisible1){
            this.loadData();
          }
        }
      }
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
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
          number: '',
          remark: '',
          account: '',
          accountBank: '',
          accountName: '',
          accountPay: '',
          reimbursed_money: '',
          approval_status: '',
          pay_type: ''
        };

        this.$emit('close', 'detail');
      },
      // 选择付款账户
      chooseAccount(row){
        this.dialogFormVisible2 = true;
      },

      close(){
        this.dialogFormVisible2 = false;
        this.closeAdd();
      },

      // 撤销操作
      backoutBtn(){
        const that = this;
        this.$confirm("是否撤销此借款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/cancleloan", {
            "id": this.info
          }, ).then(function(response) {
//            console.log('借款撤销操作',response);
            if (response.data.code == '200') {
              that.$message.success("撤销成功~");
              that.endWorking();
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
        }).catch(() => {
          that.$message.success("已取消此操作~");
        });

      },

      // 结束工作流
      endWorking(){
        this.$http.post(this.GLOBAL.jqUrlZB + "/ZB/EndProcessForZB", {
          "jq_id": this.info,
          "jQ_Type": this.baseInfo.type
        }, ).then(function(response) {
          // console.log('工作流结束进程', response);

        }).catch(function(error) {
          console.log(error);
        });
      },

      // 加载数据
      loadData(){
        const that = this;
        // 获取基本信息
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/info", {
          "id": this.info
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
              number: response.data.data.info.number,
              remark: response.data.data.info.mark,
              account: response.data.data.info.remittance_account,
              accountBank: response.data.data.info.opening_bank,
              accountName: response.data.data.info.account_name,
              accountPay: '',
              reimbursed_money: response.data.data.info.reimbursed_money,
              approval_status: response.data.data.info.approval_status,
              pay_type: response.data.data.info.pay_type
            };

            if(response.data.data.info.pay_type){
              const payType = JSON.parse(response.data.data.info.pay_type);
              that.baseInfo.accountPay = payType.account;
            }

            if(response.data.data.info.create_uid != sessionStorage.getItem('id')){
              that.showBack = false;
            }
//            alert(that.baseInfo.approval_status == 1 && that.showBack == true);

            // 根据ID获取人名
            that.getName(response.data.data.info.create_uid).then(res => {
//              console.log(res);
              that.baseInfo.create_uid = res;
            });
            // 获取所属部门
            that.getOrgName(response.data.data.info.create_uid).then(res => {
//              console.log(res);
              that.baseInfo.orgName = res;
            });


            if(response.data.data.info.supplier_code){

              // 获取供应商名称
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

            // 根据账户ID获取账户名称
//            that.$http.post(that.GLOBAL.serverSrcZb + "/finance/collectionaccount/api/get",
//              {
//                "id": response.data.data.account_id
//              },{
//                headers: {
//                  'Authorization': 'Bearer ' + localStorage.getItem('token')
//                }
//              }).then(function (obj) {
////              console.log('账户查询',obj);
//              if(obj.data.isSuccess){
//                that.baseInfo.account = obj.data.object.title;
//              }
//            }).catch(function (obj) {
//              console.log(obj)
//            });
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
                  // console.log(res);
                  item.approval_uid = res;
                });
              })
            }
            that.getApproval();

            if(response.data.data.info.rel_order){
              that.tableDataRelated = response.data.data.info.rel_order;
            }

          } else {
            that.$message.success("加载数据失败~");
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
//        console.log(ID,'组织名称',response);
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
          "jq_id": this.info,
          "jQ_Type": this.baseInfo.type
        }, ).then(function(response) {
//          console.log('获取审批节点', response);
          if(response.status == 200){
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
    .el-table{
      width: 96%;
      margin: 0 auto;
    }
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
