<template>
  <div class="vivo" style="position:relative" id="invoiceDetails">
    <!--申请预付款-->
    <el-dialog title="发票" :visible="dialogVisible" width=70% @close="closeAdd">
      <div class="approval">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="发票抬头" prop="title" label-width="120px">
                <el-input v-model="ruleForm.title" :disabled="true" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纳税人识别号：" prop="number" label-width="150px">
                <el-input v-model="ruleForm.number" :disabled="true" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号:" prop="phone" label-width="150px">
                <el-input v-model="ruleForm.phone" :disabled="true" class="inputWidth" maxlength="11" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地址：" prop="address" label-width="120px">
                <el-input v-model="ruleForm.address" :disabled="true" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行：" prop="bank" label-width="150px">
                <el-input v-model="ruleForm.bank" :disabled="true" class="inputWidth" maxlength="80" show-word-limit placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="凭证:" prop="voucher" label-width="120px">
                <el-upload class="upload-demo" :disabled="true" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="fileList">
                  <!--<el-button size="small" type="info" :disabled="true">点击上传</el-button>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center" width="80%">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="成本" align="center">
          </el-table-column>
          <el-table-column prop="income" label="收入" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="客人信息" align="center">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="proce_amount" label="未处理金额" align="center">
          </el-table-column>
          <el-table-column prop="money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.approval_money" :disabled="true" placeholder="申请金额"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="revoke" type="danger" size="small" class="table_details" v-if="approvalStatus != 1 && noReimbursement">撤销</el-button>
        <el-button @click="adopt" type="success" size="small" class="table_details" v-if="approvalStatus == 1 && noReimbursement">通过</el-button>
        <el-button @click="reject" type="warning" size="small" class="table_details" v-if="approvalStatus == 1 && noReimbursement">驳回</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批通过" :visible.sync="dialogVisible11" width="500px" height="100%" modal-append-to-body>
      <div class="header" style="overflow: hidden">
        <el-form>
          <el-form-item label="通过说明：" prop="explain" label-width="150px" style="float:left;margin-left: -70px;">
            <el-input type="textarea" v-model="explain" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer" style="padding-bottom: 30px">
        <el-button type="primary" @click="passSubmit">确 定</el-button>
        <el-button @click="dialogVisible11 = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批驳回" :visible.sync="dialogVisible12" width="500px" height="100%" modal-append-to-body>
      <div class="header" style="overflow: hidden">
        <el-form>
          <el-form-item label="驳回意见：" prop="content" label-width="150px" style="float:left;margin-left: -70px;">
            <el-input type="textarea" v-model="content" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer" style="padding-bottom: 30px">
        <el-button type="primary" @click="rejectSubmit">确 定</el-button>
        <el-button @click="dialogVisible12 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "invoiceDetails",
  components: {},
  props: {
    dialogVisible: false,
    pid: '',
  },
  data() {
    return {
      totalMoney: '0',
      currentRow: true,
      approvalStatus: '',
      ruleForm: {
        title: '',
        number: '',
        phone: '',
        address: '',
        bank: '',
        voucher: '',
      },
      rules: {
        title: [{ required: true, message: '发票抬头不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^[1][345789]\d{9}$/, message: '手机号码不符合规范' }
        ],
      },
      fileList: [],
      tableData: [],
      dialogVisible11: false,
      dialogVisible12: false,
      explain: '',
      content: '',

      noReimbursement: true
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    pid: {
      handler:function(){
        if(this.pid != ''){
          this.loadData();
          console.log(this.$parent.$route.query.bill_status);
          if(this.$parent.$route.query.bill_status == 5 || this.$parent.$route.query.bill_status == 6 || this.$parent.$route.query.bill_status == 7){
            this.noReimbursement = false;
          }
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
    closeAdd() {
      this.$emit('close', false);
    },
    revoke() {
      const that = this;
      this.$confirm('是否撤销审批?', '提示', {
        confirmButtonText: '撤销',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
          "id": this.$parent.pid,
          "approval_uid": sessionStorage.getItem('id'),
          "status": "1",
          "approval_comments": ''
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
//        console.log(response);
            that.$message.success("已撤销~");
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
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });
      });
    },
    reject() {
      this.pid = this.$parent.pid;
      this.dialogVisible12 = true;
    },
    rejectSubmit(){
      const that = this;
//      alert(this.$parent.$parent.$parent.paramTour);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
        "id": that.pid,
        "approval_uid": sessionStorage.getItem('id'),
        "status": "2",
        "approval_comments": this.content
      }, ).then(function(response) {
        if (response.data.code == '200') {
//        console.log(response);
          that.$message.success("已驳回~");
          that.dialogVisible12 = false;
          that.closeAdd();
          that.content = '';
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("驳回失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    adopt() {
      this.pid = this.$parent.pid;
      this.dialogVisible11 = true;
    },
    passSubmit(){
      const that = this;
//      alert(this.$parent.$parent.$parent.paramTour);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
        "id": that.pid,
        "approval_uid": sessionStorage.getItem('id'),
        "status": "3",
        "approval_comments": this.explain
      }, ).then(function(response) {
//        console.log(response);
        if (response.data.code == '200') {
//        console.log(response);
          that.$message.success("审核通过~");
          that.dialogVisible11 = false;
          that.closeAdd();
          that.explain = '';
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("审核失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    loadData(){
//      alert(this.$parent.pid);
//      alert(id);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitioninfo", {
        "id": this.$parent.pid,
        "is_temp": 1
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.ruleForm = {
            title: response.data.data.title,
            number: response.data.data.pay_taxes_no,
            phone: response.data.data.phone,
            address: response.data.data.address,
            bank: response.data.data.bank,
          };
          that.approvalStatus = response.data.data.approval_status;
          that.fileList = response.data.data.file;
          that.tableData = response.data.data.order_list;
          let total = 0;
          response.data.data.order_list.forEach(function (item, index, arr) {
            total += parseFloat(item.approval_money);
          });
          that.totalMoney = total;
//          that.approvalStatus = false;
        } else {
          that.$message.warning("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {

  },
  mounted() {}
}

</script>
<style lang="scss">
#invoiceDetails .footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -10px;
}

#invoiceDetails .el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

#invoiceDetails .inputWidth {
  width: 100%;
}

#invoiceDetails .totalMoney {
  width: 95%;
  background-color: #E6F3FC;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
}

#invoiceDetails .approval {
  /*height: 150px;*/
  line-height: 30px;
  width: 95%;
  margin: -15px 30px 30px 30px;
  overflow: hidden;
}

#invoiceDetails .table_trip {
  width: 95%;
  margin: 30px 30px;
}
#invoiceDetails .upload-demo {
  width: 1000px;
}
#invoiceDetails .el-upload{
  display: none;
}
#invoiceDetails .el-upload-list__item {
  margin-top: 5px!important;
}
.vivo#invoiceDetails  {
  min-width: 1200px;
}

</style>
