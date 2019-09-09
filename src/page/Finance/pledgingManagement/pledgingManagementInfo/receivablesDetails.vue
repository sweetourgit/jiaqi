<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="收款编码数据详情" :visible="dialogVisible" width=70% @close="closeAdd">
      <div class="approval">
        <el-row>
          <el-col :span="2.5">
            <div class="grid-content bg-purple">收款编码：</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{receiptCode}}</div>
          </el-col>
          <el-col :span="2.5">
            <div class="grid-content bg-purple">审批：</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">{{approval}}</div>
          </el-col>
          <el-col :span="2.5">
            <div class="grid-content bg-purple">审批意见：</div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">{{approvalOpinions}}</div>
          </el-col>
        </el-row>
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
          <el-table-column prop="money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.approval_money" :disabled="true" placeholder="申请金额"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="revoke" type="danger" size="small" class="table_details" v-if="approvalStatus != 1">撤销</el-button>
        <el-button @click="adopt" type="success" size="small" class="table_details" v-if="approvalStatus == 1">通过</el-button>
        <el-button @click="reject" type="warning" size="small" class="table_details" v-if="approvalStatus == 1">驳回</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批通过" :visible.sync="dialogVisible11" width="500px" height="100%" modal-append-to-body>
      <div class="header">
        <el-form>
          <el-form-item label="通过说明：" prop="explain" label-width="150px" style="margin-left: -60px;">
            <el-input type="textarea" v-model="explain" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" @click="passSubmit">确 定</el-button>
        <el-button @click="dialogVisible11 = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审批驳回" :visible.sync="dialogVisible12" width="500px" height="100%" modal-append-to-body>
      <div class="header">
        <el-form>
          <el-form-item label="驳回意见：" prop="content" label-width="150px" style="margin-left: -60px;">
            <el-input type="textarea" v-model="content" :autosize="{ minRows: 4, maxRows:6}" style="width:300px;" placeholder="选填"></el-input>
          </el-form-item><br /><br />
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" @click="rejectSubmit">确 定</el-button>
        <el-button @click="dialogVisible12 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "receivablesDetails",
  components: {},
  props: {
    dialogVisible: false,
    pid: '',
  },
  data() {
    return {
      totalMoney: '0',
      receiptCode: '', //收款编码
      approval: '', //审批
      approvalStatus: '',
      approvalOpinions: '',
      currentRow: true,
      tableData: [],
      dialogVisible11: false,
      dialogVisible12: false,
      explain: '',
      content: '',
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
              that.$message.warning(response.data.message)
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
      this.dialogVisible12 = true;
    },
    rejectSubmit(){
      const that = this;
//      alert(this.$parent.$parent.$parent.paramTour);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
        "id": this.$parent.pid,
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
    adopt(row) {
      this.dialogVisible11 = true;
    },
    passSubmit(){
      const that = this;
//      alert(this.$parent.$parent.$parent.paramTour);
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recstatus", {
        "id": this.$parent.pid,
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
    loadData(){
//      alert(this.$parent.pid);
//      alert(id);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitioninfo", {
        "id": this.$parent.pid
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.receiptCode = response.data.data.rec_sn;
//          that.approval = response.data.data.approval_status;
          if(response.data.data.approval_status == 1){
            that.approval = '审批中';
            that.approvalStatus = 1;
          }else if(response.data.data.approval_status == 2){
            that.approval = '驳回';
            that.approvalStatus == 2;
          }else if(response.data.data.approval_status == 3){
            that.approval = '通过';
            that.approvalStatus = 3;
          }
          that.approvalOpinions = response.data.data.approval_comments;
          that.tableData = response.data.data.order_list;
          let total = 0;
          response.data.data.order_list.forEach(function (item, index, arr) {
//            item.money = item.approval_money;
            total += parseFloat(item.approval_money);
          });
          that.totalMoney = total;
//          that.approvalStatus = false;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {},
  mounted() {}
}

</script>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -10px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 400px;
}

.totalMoney {
  width: 95%;
  background-color: #E6F3FC;
  height: 30px;
  line-height: 30px;
  margin: 0 30px;
}

.table_trip {
  width: 95%;
  margin: 30px 30px;
}

.approval {
  height: 30px;
  line-height: 30px;
  width: 95%;
  margin: -15px 30px 20px 30px;
}

.vivo {
  min-width: 1200px;
}

</style>
