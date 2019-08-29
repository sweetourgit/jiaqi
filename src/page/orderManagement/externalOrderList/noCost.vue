<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">产品名称:</span>
      <el-input v-model="activeForm.title" class="input"></el-input>
      <span class="search-title">订单ID:</span>
      <el-input v-model="activeForm.oid" class="input"></el-input>
      <span class="search-title">下单时间:</span>
      <el-date-picker v-model="activeForm.startTime" type="date" placeholder="开始天数" :picker-options="startDatePicker"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.endTime" type="date" placeholder="结束天数" :picker-options="endDatePicker"></el-date-picker><br /><br />
      <span class="search-title">报账状态:</span>
      <el-select v-model="activeForm.status" placeholder="请选择" style="width:200px">
        <el-option key="" label="全部" value=""></el-option>
        <el-option key="0" label="未报账" value="1"></el-option>
        <el-option key="1" label="报账中" value="2"></el-option>
        <el-option key="2" label="已报账" value="3"></el-option>
      </el-select>
      <span class="search-title">是否关联产品:</span>
      <el-select v-model="activeForm.proRelation" placeholder="请选择" style="width:200px">
        <el-option key="" label="全部" value=""></el-option>
        <el-option key="1" label="是" value="2"></el-option>
        <el-option key="2" label="否" value="1"></el-option>
      </el-select>
      <span class="search-title">导入时间:</span>
      <el-date-picker v-model="activeForm.importStartTime" type="date" placeholder="开始天数" :picker-options="importStartDatePicker"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.importEndTime" type="date" placeholder="结束天数" :picker-options="importEndDatePicker"></el-date-picker><br /><br />
      <span class="search-title">关联团期:</span>
      <el-input v-model="activeForm.tour" class="input"></el-input>
      <span class="search-title">类别:</span>
      <el-select v-model="activeForm.type" placeholder="请选择" style="width:200px">
        <el-option key="" label="全部" value=""></el-option>
        <el-option key="0" label="门票" value="门票"></el-option>
        <el-option key="1" label="酒店" value="酒店"></el-option>
      </el-select>
      <span class="search-title">验证时间:</span>
      <el-date-picker v-model="activeForm.validationStartTime" type="date" placeholder="开始天数" :picker-options="validationStartDatePicker"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.validationEndTime" type="date" placeholder="结束天数" :picker-options="validationEndDatePicker"></el-date-picker><br /><br />
      <span class="search-title">取票人:</span>
      <el-input v-model="activeForm.ticketPerson" class="input"></el-input>
      <span class="search-title">取票人手机:</span>
      <el-input v-model="activeForm.ticketPhone" class="input"></el-input>
      <span class="search-title">分销商:</span>
      <el-input v-model="activeForm.distributors" class="input" style="width: 485px;"></el-input><br /><br />
      <span class="search-title">卖出支付方式:</span>
      <el-select v-model="activeForm.typePay" placeholder="请选择" style="width:200px">
        <el-option key="" label="全部" value=""></el-option>
        <el-option key="1" label="产品自销" value="1"></el-option>
        <el-option key="2" label="授信支付" value="2"></el-option>
        <el-option key="3" label="微信支付" value="3"></el-option>
        <el-option key="4" label="易宝云企付" value="4"></el-option>
        <el-option key="5" label="余额支付" value="5"></el-option>
        <el-option key="6" label="支付宝" value="6"></el-option>
        <el-option key="7" label="自采" value="7"></el-option>
      </el-select>
      <div class="button_select">
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
      </div>
    </div>
    <div class="main">
      <el-button type="primary" @click="importOrder" plain>导入订单</el-button>
      <el-button type="primary" :disabled="reable" @click="delOrder" plain>删除订单</el-button>
      <el-button type="primary" @click="importHistory" plain>导入历史</el-button>
    </div>
    <div class="tableDv">
      <div class="table_trip" style="width: 88%;">
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%;" :header-cell-style="getRowClass" @selection-change="selectionChange" @row-click="handleRowClick">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit"></el-table-column>
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="type_name" label="类别" align="center" width="60">
          </el-table-column>
          <el-table-column prop="sale_at" label=" 下单时间" align="center">
          </el-table-column>
          <el-table-column prop="" label="费用" align="center" width="160">
            <template slot-scope="scope">
              <span>收入:{{scope.row.income}}</span><br>
              <span>单票成本:{{scope.row.single_cost}}</span><br>
              <span>总成本:{{scope.row.cost}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center" width="50">
          </el-table-column>
          <el-table-column prop="" label="客人信息" align="center" width="145">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="check_at" label="验证时间" align="center">
          </el-table-column>
          <el-table-column prop="pay_type" label="卖出支付方式" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.pay_type == 1">产品自销</p>
              <p v-if="scope.row.pay_type == 2">授信支付</p>
              <p v-if="scope.row.pay_type == 3">微信支付</p>
              <p v-if="scope.row.pay_type == 4">易宝云企付</p>
              <p v-if="scope.row.pay_type == 5">余额支付</p>
              <p v-if="scope.row.pay_type == 6">支付宝</p>
              <p v-if="scope.row.pay_type == 7">自采</p>
            </template>
          </el-table-column>
          <el-table-column prop="import_at" label="导入时间" align="center">
          </el-table-column>
          <el-table-column prop="is_relate_pro" label="关联产品" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.is_relate_pro == 1">未关联产品</p>
              <p v-if="scope.row.is_relate_pro == 2">{{scope.row.relate_pro_name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="bill_status" label="报账状态" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.bill_status == 1">未报账</p>
              <p v-if="scope.row.bill_status == 2">报账中</p>
              <p v-if="scope.row.bill_status == 3">已报账</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
        </el-pagination>
      </div>
    </div>
    <ImportOrder :dialogFormVisible2="dialogFormVisible2" @close2="close2"></ImportOrder>

  </div>
</template>
<script type="text/javascript">
  import ImportOrder from '@/page/orderManagement/externalOrderList/externalChild/importOrder'//导入订单弹窗
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "externalOrderList",
    components: {
      ImportOrder,
    },
    data() {
      return {
        activeName: 'one',
        activeForm: {
          title: '',
          oid: '',
          startTime: '',
          endTime: '',
          importStartTime: '',
          importEndTime: '',
          status: '',
          proRelation: '',
          tour: '',
          type: '',
          typePay: '',
          validationStartTime: '',
          validationEndTime: '',
          ticketPerson: '',
          ticketPhone: '',
          distributors: ''
        },
        reable: true,
        pid: '',
        transmit: false,
        dialogFormVisible: false,
        dialogFormVisible2: false,

//      表格数据
        total: 0, //总条数
        currentPage4: 1,
        pageIndex: 1, // 设定当前页数
        pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
        tableData: [],
        multipleSelection: [],
        currentRow: true,

        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        importStartDatePicker: this.beginDate1(),
        importEndDatePicker: this.processDate1(),
        validationStartDatePicker: this.beginDate2(),
        validationEndDatePicker: this.processDate2()
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {},
    created(){
      this.loadData();
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
      handleClick() {
        this.reable = true;
        this.transmit = !this.transmit;
        this.pid = ''
      },
      importOrder() {
        this.dialogFormVisible2 = true
      },
      close2() {
        this.dialogFormVisible2 = false
      },
      delOrder() {
        console.log(this.multipleSelection);
        this.$confirm('是否删除此外部订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //导入历史
      importHistory() {
        this.$router.push({ path: "/importHistory" });
      },
      //搜索
      searchHand() {
        this.loadData();
      },
      resetHand() {
        this.activeForm = {
          title: '',
          oid: '',
          startTime: '',
          endTime: '',
          importStartTime: '',
          importEndTime: '',
          status: '',
          proRelation: '',
          tour: '',
          type: '',
          validationStartTime: '',
          validationEndTime: '',
          ticketPerson: '',
          ticketPhone: '',
          distributors: ''
        };
        this.loadData();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.loadData();
      },

      handleCurrentChange(val) {
        this.pageIndex = val;
        this.loadData();
      },
      selectInit(row, index){
        if(row.bill_status == 0){
          return false  //不可勾选
        }else{
          return true  //可勾选
        }
      },
      selectionChange(val) {
        console.log(val);
        if(val.length > 0){
          this.reable = false;
        }else{
          this.reable = true;
        }
        this.multipleSelection = val;
      },
      handleRowClick(row, column, event){
        if(row.accountingStatus != '已报账'){
          this.$refs.multipleTable.toggleRowSelection(row);
        }
      },
      loadData(){
        //加载数据
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/listpage", {
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize,
          "product_name": this.activeForm.title,
          "order_sn": this.activeForm.oid,
          "sale_at_begin": this.activeForm.startTime,
          "sale_at_end": this.activeForm.endTime,
          "bill_status": this.activeForm.status,
          "is_relate_pro": this.activeForm.proRelation,
          "import_at_begin": this.activeForm.importStartTime,
          "import_at_end": this.activeForm.importEndTime,
          "tour_no": this.activeForm.tour,
          "order_type": this.activeForm.type,
          "check_at_begin": this.activeForm.validationStartTime,
          "check_at_end": this.activeForm.validationEndTime,
          "contact_name": this.activeForm.ticketPerson,
          "contact_phone": this.activeForm.ticketPhone,
          "distributor": this.activeForm.distributors,
          "pay_type": this.activeForm.typePay,
          "import_status": 1,
          "org_id": sessionStorage.getItem('orgID')
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
            console.log(response);
            that.tableData = response.data.data.list;
            that.total = response.data.data.total - 0;

            that.tableData.forEach(function (item, index, arr) {
//            console.log(v,k,arr);
//            console.log(item.sale_at);
              item.sale_at = formatDate(new Date(item.sale_at*1000));
              item.check_at = formatDate(new Date(item.check_at*1000));
              item.import_at = formatDate(new Date(item.import_at*1000));
            })
          } else {
            that.$message.warning("加载数据失败,请刷新重试~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
//    时间限制
      beginDate(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.activeForm.endTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.activeForm.endTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.activeForm.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.activeForm.startTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      beginDate1(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.activeForm.importEndTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.activeForm.importEndTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate1(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.activeForm.importStartTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.activeForm.importStartTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      beginDate2(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.activeForm.validationEndTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.activeForm.validationEndTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate2(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.activeForm.validationStartTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.activeForm.validationStartTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      }
    }

  }

</script>
<style lang="scss" scoped>
  .vivo {
    .demo-input-suffix {
      width: auto;
      background-color: #F7F7F7;
      padding: 20px;
      min-width: 1350px;

      .search-title {
        font-size: 14px;
        margin-left: 10px;
        margin-top: 10px;
        margin-right: 20px;
        display: inline-block;
        width: 100px;
        text-align: right;
      }

      .el-input {
        width: auto;
      }

      .el-input__inner {
        width: 10%;
      }

      .demo-input-suffix {
        width: 900px
      }

      .date-line {
        width: 10px;
        border-bottom: 1px solid #e6e6e6;
        display: inline-block;
        margin: 0 3px 3px 0
      }

      .button_select {
        /*width: 1300px;*/
        display: inline-block;
        float: right;
        margin-right: 265px;
        overflow: hidden;
        padding: 10px;
        box-sizing: border-box;
      }
      .button_select button{
        float: right;
        margin-left: 20px;
      }

    }

    .main {
      margin-top: 20px;
      margin-bottom: 20px;
      text-align: left;
      //margin-left: 50px;

      .select_button {
        padding-top: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e9eaea;
        text-align: left;
        padding-left: 50px;
      }
    }
    .tableDv{
      width: 100%;
      overflow: hidden;
      position: relative;
      margin-bottom: 40px;
    }
  }



  .el-tabs__nav>>>.el-tabs__item {
    font-size: 30px !important;
  }

  .el-autocomplete>>>.el-input--small .el-input__inner {
    height: 35px !important;
  }

</style>
