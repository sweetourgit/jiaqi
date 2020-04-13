<template>
  <div class="borders">
    <div class="search">
      <el-row>
        <el-col :span="7">
          <span class="search_style">团期计划：</span>
          <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
        </el-col>
        <el-col :span="7">
          <span class="search_style">报账人：</span>
          <!--<el-input v-model="reimbursementPer" placeholder="请输入内容" class="search_input"></el-input>-->
          <el-autocomplete class="search_input" v-model="reimbursementPer" :fetch-suggestions="querySearchOper" placeholder="请输入操作人员" @select="handleSelectOper" @blur="blurHand"></el-autocomplete>
        </el-col>
        <el-col :span="9">
          <span class="search_style">发起时间：</span>
          <el-date-picker v-model="startTime" type="date" placeholder="请选择日期" class="start-time" :editable="disabled"></el-date-picker>
          <div class="date-line"></div>
          <el-date-picker v-model="endTime" type="date" placeholder="请选择日期" class="start-time" :editable="disabled"></el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <span class="search_style">产品名称：</span>
          <el-input v-model="productName" placeholder="请输入内容" class="search_input"></el-input>
        </el-col>
        <el-col :span="7">
          <span class="search_style">状态：</span>
          <el-select v-model="billStatus" placeholder="请选择" class="search_input">
            <el-option key="" label="全部" value=""></el-option>
            <el-option key="6" label="报账驳回" value="6"></el-option>
            <el-option key="7" label="已报账" value="7"></el-option>
          </el-select>
        </el-col>
        <el-col :span="9">
          <el-button type="primary" @click="resetFun" plain class="buttonSearch">重置</el-button>
          <el-button type="primary" @click="searchFun" class="buttonSearch">搜索</el-button>
          <el-button type="primary" @click="exportFun" class="buttonSearch" :disabled="canExport">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table_style">
      <el-table :data="tableData" border :header-cell-style="getRowClass" v-loading="loading">
        <el-table-column prop="tour_no" label="团期计划" align="center"></el-table-column>
        <el-table-column prop="" label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.bill_status=='5'" style="color: #7F7F7F" >报账中</div>
            <div v-if="scope.row.bill_status=='6'" style="color: #FF4A3D" >报账驳回</div>
            <div v-if="scope.row.bill_status=='7'" style="color: #33D174" >已报账</div>
            <div v-if="scope.row.bill_status=='8'" style="color: #66b1ff" >已回冲</div>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品名称" align="center"></el-table-column>
        <el-table-column prop="orgName" label="申请人部门" align="center"></el-table-column>
        <el-table-column prop="info.total_income" label="收入" align="center"></el-table-column>
        <el-table-column prop="info.total_cost" label="成本" align="center"></el-table-column>
        <el-table-column prop="info.gross_profit" label="毛利" align="center"></el-table-column>
        <el-table-column prop="info.team_num" label="人数" align="center"></el-table-column>
        <el-table-column prop="info.gross_rate" label="人均毛利" align="center"></el-table-column>
        <el-table-column prop="create_uid" label="申请人" align="center"></el-table-column>
        <el-table-column prop="created_at" label="申请时间" align="center"></el-table-column>
        <el-table-column prop="mark" label="审批意见" align="center"></el-table-column>
        <el-table-column prop="approval_at" label="审批时间" align="center"></el-table-column>
        <el-table-column prop="opinion" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
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
    <checkSheetPreview :dialogFormVisible="dialogFormVisible" @close="closeFun" :info="info"></checkSheetPreview>
  </div>
</template>
<script>
  import checkSheetPreview from '@/page/Finance/checkSheet/around/checkSheetPreview';
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "checkSheetTableAround",
    props:{
      whereTab: String
    },
    components:{
      checkSheetPreview
    },
    data(){
      return {
        disabled: true,
        // 搜索字段
        plan: '',
        reimbursementPer: '',
        productName: '',
        startTime: '',
        endTime: '',
        reimbursementPerID: '',
        billStatus: '',
        operatorList: [],
        canExport: true, // 导出按钮是否禁用

        // 分页字段
        pageSize: 10,
        currentPage: 1,
        pageCount: 0,

        tableData: [],
        loading: true,

        // 弹出层字段
        dialogFormVisible: false,
        info: '',
      }
    },
    created(){
      // this.approveTableList('sheet');
      this.loadOper();
      this.loadData('created');
    },
    computed: {
      tabChange: function () {
        return this.whereTab
      }
    },
    watch:{
      tabChange: function(val, oldVal){
        if(val === 'sheet'){
          this.loadData();
        }
      }
    },
    methods: {
      // 导出方法
      exportFun(){
        let start = '', end = '';
          if(this.startTime){
            start = moment(this.startTime).format('YYYY-MM-DD');
          }
          if(this.endTime){
            end = moment(this.endTime).format('YYYY-MM-DD');
          }
          // this.$http.get(
          //   this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/exportbill?tour_no=" + this.plan + "&product_name=" + this.productName + "&create_uid=" + this.reimbursementPerID + "&start_time=" + start + "&end_time=" + end + "&bill_status=" + this.billStatus,
          // ).then(function (obj) {
          //   console.log(obj);
          // }).catch(function (response) {
          //   console.log(response);
          // });
          
          if(this.tableData.length == 0){
            this.$message.warning("无搜索数据导出，请重新搜索！");
          }else{
            window.location.href = this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/exportbill?tour_no=" + this.plan + "&product_name=" + this.productName + "&create_uid=" + this.reimbursementPerID + "&start_time=" + start + "&end_time=" + end + "&bill_status=" + this.billStatus;
          }
      },
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      // 选择操作人员
      querySearchOper(queryString, cb){
        const operatorList = this.operatorList;
        var results = queryString ? operatorList.filter(this.createFilter1(queryString)) : operatorList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter1(queryString) {
        return (operatorList) => {
          return (operatorList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelectOper(item){
        // console.log(item);
        this.reimbursementPerID = item.id;
      },
      blurHand(){
        const that = this;
        let ida = '';
        if(that.reimbursementPer == ''){
          that.reimbursementPerID = '';
        }else{
          this.operatorList.forEach(function (item, index, arr) {
            if(that.reimbursementPer == item.value){
              ida = item.id;
            }
          });
          if(ida){
            that.reimbursementPerID = ida;
          }else{
            that.reimbursementPerID = '';
          }
        }
      },
      loadOper(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcZb + "/org/api/userlist", {
          "object": {
            "id": 0,
            "createTime": '2019-08-23T03:03:10.386Z',
            "isDeleted": 0,
            "code": "",
            "mobile": "",
            "name": "",
            "email": "",
            "userCode": "",
            "passWord": "",
            "iDcard": "",
            "tourGuide": "",
            "sex": 0,
            "userType": 0,
            "userState": 0,
            "orgID": 0,
            "orgName": "",
            "user_Position": [
              {
                "id": 0,
                "userID": 0,
                "positionID": 0,
                "positionName": "",
                "isDefault": 0,
                "orgID": 0,
                "orgName": ""
              }
            ]
          }
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {

          if (response.data.isSuccess) {
            // console.log('操作人员列表',response.data.objects);
            let operatorList = [];
            response.data.objects.forEach(function (item, index, arr) {
              const operator = {
                'value' : item.name,
                'id' : item.id
              };
              operatorList.push(operator);
            });
            that.operatorList = operatorList;
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      // 搜索
      searchFun(){
        this.loading = true;
        this.loadData();
        if(this.plan != '' || this.reimbursementPer != '' || this.productName != '' || this.startTime != '' || this.endTime != '' || this.billStatus != ''){
          this.canExport = false;
        }else{
          this.canExport = true;
        }
      },
      // 重置
      resetFun(){
        this.loading = true;
        this.plan = '';
        this.reimbursementPer = '';
        this.productName = '';
        this.startTime = '';
        this.endTime = '';
        this.reimbursementPerID = '';
        this.billStatus = '';
        this.loadData();
        this.canExport = true;
      },
      handleSizeChange(val) {
        this.loading = true;
        this.pageSize = val;
        this.currentPage = 1;
        this.loadData()
      },
      handleCurrentChange(val) {
        this.loading = true;
        this.currentPage = val;
        this.loadData()
      },
      // 获取已办报账单列表数据
      loadData(str){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/listpage", {
          "pageIndex": this.currentPage,
          "pageSize": this.pageSize,
          "product_name": this.productName,
          "tour_no": this.plan,
          "start_time": this.startTime,
          "end_time": this.endTime,
          "create_uid": this.reimbursementPerID,
          "bill_status": this.billStatus == '' ? '6,7' : this.billStatus
        }, ).then(function(response) {
          // console.log(response);
          if (response.data.code == '200') {
            that.loading = false;
            that.tableData = response.data.data.list;
            that.pageCount = response.data.data.total - 0;
            if(str == 'created'){ // 只有created时定义报账单已办个数
              that.$emit('handlePassVal', that.pageCount);
              that.$store.commit('doneAll/aroundSheetCount', that.pageCount);
            }
            that.tableData.forEach(function (item, index, arr) {
              item.createName = item.create_uid;

              item.created_at = formatDate(new Date(item.created_at*1000));
              item.created_at = item.created_at.split(" ")[0];
              // approval_at
              if(item.approval_at){
                item.approval_at = formatDate(new Date(item.approval_at*1000));
                item.approval_at = item.approval_at.split(" ")[0];
              }
              // 根据id获取审批人姓名
              that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
                "id": item.create_uid
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {
                // console.log(response);
                if (response.data.isSuccess) {
                  item.create_uid = response.data.object.name;
                } else {
                  that.$message.warning("加载数据失败~");
                }
              }).catch(function(error) {
                console.log(error);
              });
              // 根据id获取审批人部门
              that.$http.post(that.GLOBAL.serverSrcZb + "/org/user/api/orgshort", {
                "id": item.create_uid
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
              }).then(function(response) {
                // console.log(ID,'组织名称',response);
                if (response.data.isSuccess) {
                  item.orgName = response.data.objects[0].name
                } else {
                  that.$message.success("加载数据失败~");
                }
              }).catch(function(error) {
                console.log(error);
              });
            })
          } else {
            that.$message.warning("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      // 详情
      detail(row){
        this.info = row;
        row.path = '/doneAll/list';
        this.dialogFormVisible = true;
      },
      // 关闭
      closeFun() {
        this.dialogFormVisible = false;
      },

    }
  }
</script>

<style scoped>
  .borders{
    overflow: hidden;
    /* border: 1px solid #E6E6E6; */
    width: 99%;
    margin: 25px auto;
    margin-bottom: 30px;
    /* margin-top: 11px; */
  }
  .search{
    float: left;
    /* margin-top: 30px; */
    width: 100%;
    background-color: #f7f7f7;
    padding: 20px 10px;
    margin: 20px 10px;
  }
  .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  .table_style{
    width: 100%;
    padding: 0 20px;
    float: left;
    box-sizing: border-box;
  }
  .el-row{
    margin-bottom: 20px;
  }
  .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px;
    display: inline-block;
    width: 100px;
  }
  .search_input{
    /*float: left;*/
    width: 65%;
  }
  .start-time{
    width: 32.5%;
  }
  .buttonSearch{
    float: right;
    margin-right: 20px;
  }
  .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }

</style>