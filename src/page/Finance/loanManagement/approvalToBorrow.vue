<template>
  <div class="loanBorder">
        <div class="plan">
          <!-- <div class="fl">
            <span class="emptyPlan">团期计划</span>
            <el-input v-model="empty_01" class="empty" clearable placeholder="请输入团期计划"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">申请人</span>
            <el-input v-model="people_01" class="empty" clearable placeholder="请输入申请人"></el-input>
          </div> -->
          <div class="fl">
            <span class="emptyPlan">发起时间</span>
            <el-date-picker v-model="planTime_01" type="date" class="planTime" placeholder="开始天数"></el-date-picker>
            <span class="time">——</span>
            <el-date-picker v-model="planData_01" type="date" class="planTime" placeholder="结束天数"></el-date-picker>
          </div>
        </div>
        <div class="primary">
          <el-button type="primary">搜索</el-button>
          <el-button @click="emptyButton_01()" type="primary">重置</el-button>
        </div>
        <div style="width:1130px;">
          <el-table :data="tableData" ref="multipleTable" class="multipleTable" :header-cell-style="getRowClass" border>
            <el-table-column prop="paymentID" label="借款单号" width="100" align="center"></el-table-column>
            <el-table-column prop="beginTime" label="发起时间" width="180" align="center"></el-table-column>
            <el-table-column prop="groupCode" label="团期计划" width="219" align="center"></el-table-column>
            <el-table-column prop="supplierName" label="供应商名称" width="150" align="center"></el-table-column>
            <el-table-column prop="supplierTypeEX" label="类型" width="80" align="center"></el-table-column>
            <el-table-column prop="price" label="借款金额" width="120" align="center"></el-table-column>
            <el-table-column prop="createUser" label="申请人" width="100" align="center"></el-table-column>
            <el-table-column label="审批" width="150" align="center">
              <template slot-scope="scope">
                <el-button @click="checkIncome(scope.row)" type="text" size="small" class="table_details">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
</template>




<script>

  export default {
    data(){
      return {
        //表头切换
        empty_01:'',
        people_01:'',
        planTime_01:'',
        planData_01:'',
        //借款表格
        tableData:[],
        //分页
        currentPage: 1,
        total:0,
        pagesize:10,

      }
    },
    methods: {
      //重置
      emptyButton_01(){
        this.empty_01 = '';
        this.people_01 = '';
        this.planTime_01 = '';
        this.planData_01 = '';
      }, 
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      //分页
      handleSizeChange(page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.pageList();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.pageList();
      },
      //查询列表
      pageList() {
        /*let objectRequest = {}
        objectRequest.paymentType = 1;
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/payment/api/page",
          {
            "pageSize":this.pagesize,
            "pageIndex":this.currentPage,
            "total": 0,
            "object": objectRequest,
            "checkType":0,
          },)
          .then(function (obj) {
            
            that.total = obj.data.total
            that.tableData = obj.data.objects
            console.log(obj.data.objects)
            that.$emit('headCallBack', obj.data.total);
          })
          .catch(function (obj) {
            console.log(obj)
          })*/
          var that = this
          this.$http.post(
          this.GLOBAL.jqUrl + "/api/JQ/GettingUnfinishedTasksForJQ",{
              "userCode": sessionStorage.getItem('userCode'),
              "startTime": "2018-07-18T05:30:17.471Z",
              "endTime": "2019-07-18T05:30:17.471Z",
            }
          )
          .then(function(obj) {
            //that.total = obj.data.total;
            //that.tableData = obj.data.objects;
            that.total = obj.data.total
            that.tableData = obj.data.objects
            console.log(obj.data.objects)
            that.$emit('headCallBack', obj.data.total);
          })
          .catch(function(obj) {
            console.log(obj)
          })
      },
      /*工作流
      var that = this
      this.$http.post(
          this.GLOBAL.jqUrl + "/api/JQ/GettingUnfinishedTasksForJQ",{
              "userCode": sessionStorage.getItem('userCode'),
              "startTime": "2018-07-18T05:30:17.471Z",
              "endTime": "2019-07-18T05:30:17.471Z",
            }
        )
        .then(function(obj) {
          //that.total = obj.data.total;
          //that.tableData = obj.data.objects;
        })
        .catch(function(obj) {
          console.log(obj)
        })*/

    },
    mounted(){
      this.pageList();
    },
  }
</script>
<style scoped>
	.loanManagement{text-align: center; font-family: '微软雅黑'; font-size: 11pt;overflow: hidden; text-align: left; margin: -15px 0 100px 0;}
  .loanBorder{border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6; margin:0 0 20px 0; overflow: hidden; clear: both;}
  /*搜索框*/
  .empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
  .fl{float:left; margin: 20px 0 20px 0;}
  .emptyPlan{margin: 0 0 0 30px; }
  .planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
  .time{margin: 0 0 0 10px;}
  /*重置*/
  .primary{clear: both;overflow: hidden;margin: 0 0 20px 30px;}
  /*表格*/
  .multipleTable{margin: 0 30px 20px 30px; text-align: center;width: 1100px;}
  /*分页*/
  .pageList{float:right; margin: 0 0 20px 0;}
  /*申请无收入借款弹窗*/
  .mask{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 100;}
  .noIncome{width:1100px; position:absolute; top:3%;left:50%; margin-left:-550px; background:#fff; z-index:1000; border-radius:3px;max-height: 95%;overflow:scroll;overflow-x:hidden;}
  .noIncomeTitle{margin: 30px; overflow: hidden;}
  .noIncomeTitle_l{float:left; font-size:13pt;line-height: 40px;}
  .noIncomeTitle_r{float:right;}
  .name_input{width: 200px;}
  .name_input01{width: 700px;}
  .name_button{margin-left:-5px; background:#eaeaea;color:#a4a4a4;}
  .name_button:hover{color:#a4a4a4;}
  /*申请无收入借款中借款人弹窗*/
  .indialog{min-height: 300px; overflow: hidden;}
  .mask_name{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 101;}
  .number_button{float:right; margin: 0 0 20px 0;}
  /*申请无收入借款中团期计划弹窗*/
  .plan_indialog{float:left; line-height: 40px;}
  .indialog_plan{float:left; margin: 0 10px 0 10px;}
  .indialog_input{float:left; width: 150px;}
  .indialog_input01{float:left; width: 80px;}
  .plan_indialog span{float:left; margin: 0 10px 0 10px;}
  .indialog_button{margin: 0 0 0 10px;}
  /*申请无收入借款中附件*/
  .upload-demo{width: 400px;}
  .upload-demo>>>.el-upload-list__item{ width: 300px; }

  .el-dialog__wrapper{top:-10%;}
</style>
