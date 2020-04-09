<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="收款编码数据详情" :visible="dialogFormVisible" width=70% @close="closeAdd">
      <div class="approval">
        <el-row>
          <el-col :span="2">
            <div class="grid-content ">收款编码：</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content ">{{receiptCode}}</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content ">审批：</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content ">{{approval}}</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content ">审批意见：</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content ">{{approvalOpinions}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="distributor_remark" label="分销商备注" align="center">
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
          <el-table-column prop="approval_money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.approval_money" :disabled="approvalStatus" placeholder="申请金额" @blur="addMoney"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="submitForm" type="primary" size="small" class="table_details" v-if="!approvalStatus">修改</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "getOrderInvoice",
  components: {},
  props: {
    dialogFormVisible: false,
    info: '',
  },
  data() {
    return {
      totalMoney: '0',
      receiptCode: '', //收款编码
      approval: '', //审批
      approvalOpinions: '',
      currentRow: true,
      tableData: [],
      moneyList: [],
      approvalStatus: true
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    info: {
      handler:function(){
        this.loadData()
      }
    }
  },
  methods: {
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id']
    },
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
    addMoney(){
      let total = 0;
      this.tableData.forEach(function (item, index, arr) {
        console.log(item.approval_money);
        if(item.approval_money){
          total += parseFloat(item.approval_money);
        }
      });
//      alert(total);
      this.totalMoney = total;
    },
    submitForm(formName) {

      const that = this;
      let canSave = true;
      let num = 0;
      this.tableData.forEach(function (item, index, arr) {
        if(item.approval_money){
          num++;
        }
        if(parseFloat(item.approval_money) <= 0){
          that.$message({
            type: 'warning',
            message: item.order_sn + '订单，申请金额必须大于零！'
          });
          canSave = false;
        }
      });
      if(num == 0){
        that.$message({
          type: 'warning',
          message: '所有订单申请金额均为空！'
        });
        canSave = false;
      }
      if(canSave){
        let orderList = [];
        this.tableData.forEach(function (item, index, arr) {
          let itemOrder = {
            "order_no": item.order_sn,
            "money": item.approval_money
          };
          orderList.push(itemOrder);
        });
//        alert(JSON.stringify(orderList));
//        alert(this.$parent.param);
        if(num == this.tableData.length){
          that.postData(orderList);
        }else{
          this.$confirm('存在订单未填写申请金额 , 点击保存则自动移除以上订单。', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.postData(orderList)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            });
          });
        }
      }
    },
    postData(orderList){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/addreceiptcode", {
        "id": this.info.id,
        "tour_no": this.$parent.param,
        "create_uid": sessionStorage.getItem("id"),
        "order_list": orderList,
        "org_id": sessionStorage.getItem('orgID')
      }, ).then(function(response) {
        console.log(response);
        if (response.data.code == '200') {
          console.log(response.data);
          if(response.data.data.list){
            that.$message({
              type: 'success',
              message: '修改成功！'
            });
          }else{
            that.$message({
              type: 'warning',
              message: response.data.data
            });
          }
          that.$emit('close', false);
        } else {
          if(response.data.message){
            that.$message.success(response.data.message);
          }else{
            that.$message.success("保存失败~");
          }

        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    loadData(){
        console.log("info",this.info);
      const id = this.info.id;
//      alert(id);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/groupplan/group-plan/recognitioninfo", {
        "id": id
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.receiptCode = response.data.data.rec_sn;
//          that.approval = response.data.data.approval_status;
          if(response.data.data.approval_status == 1 && response.data.data.bill_status == 1){
            that.approval = '未审批';
            that.approvalStatus = false;
          }else if(response.data.data.approval_status == 1){
            that.approval = '审批中';
            that.approvalStatus = true;
          }else if(response.data.data.approval_status == 2){
            that.approval = '驳回';
            that.approvalStatus = false;
          }else if(response.data.data.approval_status == 3){
            that.approval = '通过';
            that.approvalStatus = true;
          }
          that.approvalOpinions = response.data.data.approval_comments;
          that.tableData = response.data.data.order_list;
          let total = 0;
          response.data.data.order_list.forEach(function (item, index, arr) {
//            item.money = item.approval_money;
            total += parseFloat(item.approval_money);
            that.moneyList.push(item.approval_money);
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

</style>
