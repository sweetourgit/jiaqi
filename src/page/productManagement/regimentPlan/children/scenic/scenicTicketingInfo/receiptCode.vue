<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="收款编码数据详情" :visible="dialogFormVisible2" width=70% @close="closeAdd">
      <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableDataCode" border style="width: 100%" :highlight-current-row="currentRow" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
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
              <el-input v-model="scope.row.money" placeholder="申请金额" @blur="addMoney"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button @click="submitForm" type="primary" size="small" class="table_details">保存</el-button>
        <el-button @click="closeAdd" size="small" class="table_details">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "receiptCode",
  components: {},
  props: {
    dialogFormVisible2: false,
    info: '',
  },
  data() {
    return {
      totalMoney: '0', //总计
      currentRow: true,
      tableDataCode: [],
    }
  },
  computed: {

  },
  watch: {
    dialogFormVisible2: {
      handler:function(){
        if(this.dialogFormVisible2){
          this.loadData()
        }
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
      this.totalMoney = 0;
      this.$emit('close', false);
    },
    submitForm(formName) {
      const that = this;
      let canSave = true;
      let num = 0;
      this.tableDataCode.forEach(function (item, index, arr) {
        if(item.money){
          num++;
        }
        if(parseFloat(item.money) > parseFloat(item.proce_amount)){
          that.$message({
            type: 'warning',
            message: item.order_sn + '订单，申请金额大于未处理金额'
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
        this.tableDataCode.forEach(function (item, index, arr) {
          if(item.money){
            let itemOrder = {
              "order_no": item.order_sn,
              "money": item.money
            };
            orderList.push(itemOrder);
          }
        });
//        alert(this.$parent.param);
        if(num == this.tableDataCode.length){
          that.postData(orderList);
        }else{
          this.$confirm('存在订单未填写申请金额 , 点击保存则自动移除以上订单。', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.postData(orderList);
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
        "tour_no": this.$parent.param,
        "create_uid": sessionStorage.getItem("id"),
        "org_id": sessionStorage.getItem('orgID'),
        "order_list": orderList
      }, ).then(function(response) {
        if (response.data.code == '200') {
          that.$message({
            type: 'success',
            message: '保存成功!'
          });
          that.totalMoney = 0;
          that.$emit('close', false);
        } else {
          if(response.data.message){
            that.$message.success(response.data.message);
          }else {
            that.$message.success("保存失败~");
          }

        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    loadData(){
      this.tableDataCode = this.info;
      console.log(this.info);
      this.tableDataCode.forEach(function(item, index, arr){
        item.money = item.proce_amount;
      })
      this.addMoney();
    },
    addMoney(){
      let total = 0;
      this.tableDataCode.forEach(function (item, index, arr) {
        console.log(item.money);
        if(item.money){
          total += parseFloat(item.money);
        }
      });
//      alert(total);
      this.totalMoney = total.toFixed(2);
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

</style>
