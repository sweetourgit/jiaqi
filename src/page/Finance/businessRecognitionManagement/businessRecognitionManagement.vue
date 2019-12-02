<template>
  <div class="all" id="trade">
    <!--业务待认款管理-->
    <div class="borders">
      <div class="search">
        <el-row>
          <el-col :span="7">
            <span class="search_style">收款单号：</span>
            <el-input v-model="orderNo" placeholder="请输入内容" class="search_input"></el-input>
          </el-col>
          <el-col :span="7">
            <span class="search_style">款项说明：</span>
            <el-input v-model="explain" placeholder="请输入内容" class="search_input"></el-input>
          </el-col>
          <el-col :span="9">
            <span class="search_style">收款日期：</span>
            <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time" :editable="disabled" :picker-options="startDatePicker"></el-date-picker>
            <div class="date-line"></div>
            <el-date-picker v-model="endTime" type="date" placeholder="结束日期" class="start-time" :editable="disabled" :picker-options="endDatePicker"></el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <span class="search_style">状态：</span>
            <el-select v-model="status" placeholder="请选择" class="search_input">
              <el-option key="" label="全部" value=""></el-option>
              <el-option key="10" label="未认款" value="10"></el-option>
              <el-option key="1,11" label="待认收款" value="1,11"></el-option>
              <el-option key="2,12" label="已认完" value="2,12"></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            <span class="search_style">金额：</span>
            <el-input v-model="money" placeholder="请输入内容" class="search_input"></el-input>
          </el-col>
          <el-col :span="9">
            <span class="search_style">认款方式：</span>
            <el-select v-model="rec_mode" placeholder="请选择" class="search_input">
              <el-option key="" label="全部" value=""></el-option>
              <el-option key="1" label="分销商预存款" value="1"></el-option>
              <el-option key="2" label="票付通余额支付" value="2"></el-option>
              <el-option key="3" label="订单收款" value="3"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <div>
              <el-button type="primary" @click="resetFun" plain style="float: right;margin-right: 20px;">重置</el-button>
              <el-button type="primary" @click="searchFun" style="float: right;margin-right: 20px;">搜索</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="table_style">
        <el-table :data="tableData" :header-cell-style="getRowClass" border style="width: 100%;">
          <el-table-column prop="rece_code" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status_rece=='1'" style="color: #00B83F" >待认收款</div>
              <div v-if="scope.row.status_rece=='2'" style="color: #FF4A3D" >已认完</div>
              <div v-if="scope.row.status_rece=='10'" style="color: #7F7F7F" >未认款</div>
              <div v-if="scope.row.status_rece=='11'" style="color: #00B83F" >待认收款</div>
              <div v-if="scope.row.status_rece=='12'" style="color: #FF4A3D" >已认完</div>
            </template>
          </el-table-column>
          <el-table-column prop="rec_mode" label="认款方式" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.rec_mode=='1'">分销商预存款({{scope.row.distributor_code}})</div>
              <div v-if="scope.row.rec_mode=='2'">票付通余额支付</div>
              <div v-if="scope.row.rec_mode=='3'">订单收款</div>
            </template>
          </el-table-column>
          <el-table-column prop="explain" label="款项说明" align="center"></el-table-column>
          <el-table-column prop="rece_money" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="leave_match_money" label="剩余确认金额" align="center"></el-table-column>
          <el-table-column prop="receivables_at" label="收款时间" width="120" align="center"></el-table-column>
          <el-table-column prop="remark" label="摘要" align="center"></el-table-column>
          <el-table-column prop="opinion" label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button @click="detailExternalOrder(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.rece_type == '1'">详情</el-button>
              <el-button @click="detailRecognition(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.status_rece!='10' && scope.row.rece_type == '2'">详情</el-button>
              <el-button @click="recogintion(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.rece_type == '2' && scope.row.status_rece == '10' && scope.row.rec_mode != '2'">去认款</el-button>
              <el-button @click="orderDetail(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.rece_type == '2' && scope.row.rec_mode == '3' && scope.row.can_match == '2'">导入订单明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size= pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total=pageCount
          background>
        </el-pagination>
      </div>
      <recognitionDo :dialogFormVisible="dialogFormVisible" :info="info" @close="closeAdd"></recognitionDo>
      <externalOrderDetail :dialogFormVisible1="dialogFormVisible1" :info="info" @close="closeAdd"></externalOrderDetail>
      <recognitionDetail :dialogFormVisible2="dialogFormVisible2" :info="info" @close="closeAdd"></recognitionDetail>
      <importOrder :dialogFormVisible3="dialogFormVisible3" :info="info" @close="closeAdd"></importOrder>
    </div>
  </div>
</template>

<script>
  import externalOrderDetail from '@/page/Finance/businessRecognitionManagement/externalOrderDetail.vue'
  import recognitionDetail from '@/page/Finance/businessRecognitionManagement/recognitionDetail.vue'
  import recognitionDo from '@/page/Finance/businessRecognitionManagement/recognitionDo.vue'
  import importOrder from '@/page/Finance/businessRecognitionManagement/importOrder.vue'
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "business",
    components:{
      externalOrderDetail,
      recognitionDo,
      recognitionDetail,
      importOrder
    },
    data() {
      return {
        disabled: false,

        orderNo: '',
        explain: '',
        startTime: '',
        endTime: '',
        status: '',
        money: '',
        rec_mode: '',

        pageSize: 10,
        currentPage: 1,
        pageCount: 2,

        //待审批table
        tableData: [{}],

        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        info: '',

        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
      };
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

      detailExternalOrder(row){
        this.info = row.id;
        this.dialogFormVisible1 = true;
      },
      detailRecognition(row){
        this.info = row.id;
        this.dialogFormVisible2 = true;
      },
      recogintion(row){
        this.info = row.id;
        this.dialogFormVisible = true;
      },
      orderDetail(row){
        this.info = row.id;
        this.dialogFormVisible3 = true;
      },
      closeAdd() {
        this.dialogFormVisible = false;
        this.dialogFormVisible1 = false;
        this.dialogFormVisible2 = false;
        this.dialogFormVisible3 = false;
        this.info = '';
        this.loadData();
      },

      searchFun(){
        this.currentPage = 1;
        this.loadData();
      },
      resetFun(){
        this.orderNo = '';
        this.explain = '';
        this.startTime = '';
        this.endTime = '';
        this.status = '';
        this.money = '';
        this.rec_mode = '';
        this.currentPage = 1;
        this.loadData();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.loadData()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadData();
      },

      loadData(){
        const that = this;

        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/oprecognition/op-recognition/listpage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "rece_code": this.orderNo,
          "explain": this.explain,
          "receivables_start": this.startTime,
          "receivables_end": this.endTime,
          "status_rece": this.status,
          "rece_money": this.money,
          "rec_mode": this.rec_mode
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('业务收款列表',response);
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
            that.tableData.forEach(function (item, index, arr) {
              item.receivables_at = formatDate(new Date(item.receivables_at*1000));
              item.receivables_at = item.receivables_at.split(" ")[0];
              item.created_at = formatDate(new Date(item.created_at*1000));
              item.rece_money = parseFloat(item.rece_money).toFixed(2);
              item.leave_match_money = parseFloat(item.leave_match_money).toFixed(2);
              // 根据分销商ID获取名称
              if(item.distributor_code){
                that.$http.post(that.GLOBAL.serverSrcZb + "/universal/localcomp/api/get", {
                  "id": item.distributor_code
                }).then(function(obj) {
                  // console.log('获取分销商',obj);
                  if(obj.data.isSuccess){
                    item.distributor_code = obj.data.object.name;
                  }else{
                    that.$message.warning("加载数据失败~");
                  }
                }).catch(function(obj) {
                  console.log(obj);
                });
              }
            })
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      beginDate(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.endTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.endTime).getTime() < time.getTime()
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
            if (that.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.startTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
    },
    created(){
      this.loadData();
    }
  }
</script>

<style scoped>
  #trade .el-tabs__header{
    margin-top: -14px!important;
  }
  #trade .borders{
    overflow: hidden;
    /*border: 1px solid #E6E6E6;*/
    margin-bottom: 30px;
  }
  #trade .search{
    width: 96%;
    min-width: 1079px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
    background-color: #f7f7f7;
    padding: 20px 10px;
    box-sizing: border-box;
  }
  #trade .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  #trade .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px;
    display: inline-block;
    width: 80px;
  }
  #trade .el-row{
    margin-bottom: 20px;
  }
  #trade .search_input{
    /*float: left;*/
    width: 65%;
  }
  #trade .start-time{
    width: 32.5%;
  }
  #trade .table_style{
    width: 96%;
    min-width: 1079px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  #trade .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
</style>
