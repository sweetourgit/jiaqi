<template>
  <div style="border:1px solid #e6e6e6; max-width:1420px; overflow:hidden;margin:0 0 80px 0;">
    <div class="demo-input-suffix">
      <div>
        <!-- <span class="search-title" style="margin:0 0 0 35px;">退款单号</span>
        <el-input placeholder="请输入" v-model="refundNumber" class="group-no" style="width:200px;"></el-input>
        <span class="search-title">申请人</span>
        <el-input placeholder="请输入" v-model="applicant" class="group-no" style="width:200px;"></el-input> -->
        <span class="search-title">申请日期</span>
        <el-date-picker v-model="applyForDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" class="group-no" style="width:380px;"></el-date-picker>
      </div>
      <div class="search-but">
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass" @row-click="clickRow" @selection-change="changeFun">
        <el-table-column prop="refundCode" label="退款单号" align="center"></el-table-column>
        <el-table-column prop="refundStateType" label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.refundStateType=='申请退款'" style="color: #7F7F7F" >{{scope.row.refundStateType}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column> -->
        <el-table-column prop="createTime" label="申请日期" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.createTime !='0'">{{formatDate(new Date(scope.row.createTime))}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="productType" label="类型" align="center"></el-table-column>
        <el-table-column prop="allRefundPrice" label="退款金额" align="center"></el-table-column>
        <el-table-column prop="realRefundPrice" label="实际退款金额" align="center"></el-table-column>
        <el-table-column prop="name" label="申请人" align="center"></el-table-column>
        <el-table-column prop="" label="审批意见" align="center"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <span class="cursor blue" @click="operation(2,scope.row.id,scope.row.instanceID)">审批</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination v-if="pageshow" class="pagination" @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page.sync="current" :page-sizes="[10, 30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"
      ></el-pagination> -->
      <refund-details :refundID="refundID" :variable="variable" :dialogType="dialogType" :workID="workID"></refund-details>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import refundDetails from "./refundDetails/refundDetails";
export default {
  name: "refundRecord",
  components: {
    refundDetails
  },
  data() {
    return {
      refundID:0,
      variable: 0,
      dialogType: 0, 
      workID:0,
      refundNumber:'',
      applicant:'',
      applyForDate:'', 
      states:'',
      orderID:'',
      statesType:[{ 
        value:'1',
        label:'全部'
      },{
        value:'2',
        label:'申请退款'
      },{
        value:'3',
        label:'拒绝退款'
      },{
        value:'4',
        label:'完成退款'
      }],
      tableDate:[],
      pageshow: true,
      pageSize: 10, 
      pageIndex: 1, 
      total: 0,
      current:1,
      multipleSelection: [], 
      flowModel:"",
      getJqId:[],
      workItemID:[], 
      instanceID:'',
    };

  },
  mounted () {
    this.getFlowModel();
  },
  methods: {
    moment,
    formatDate(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d;
    },
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    },
    search(){ 
      this.current = 1;
      //this.getFlowModel(this.pageIndex === 1 ? this.pageIndex : 1,this.pageSize);
      this.getFlowModel();
    },
    reset(curPage){ 
      this.refundNumber = '';
      this.applicant = '';
      this.applyForDate = ''; 
      this.pageIndex = 1 ? 1 : 1;
      this.current = curPage;
      this.getFlowModel();
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getFlowModel(this.pageIndex,val);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getFlowModel(val,this.pageSize);
    },
    changeFun(val) {
      this.multipleSelection = val;
    },
    clickRow(row) {
      this.$refs.multipleTable.clearSelection(); 
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    operation(i,id,instanceID) {
      this.variable++;
      this.dialogType = i;
      this.refundID = id;
      for(var i = 0; i < this.workItemID.length; i++){
        if(this.workItemID[i].instanceID == instanceID ){
           this.workID = this.workItemID[i].workItemID;
        }
      }
      //this.workID = String(this.workItemID); 
    },
    getFlowModel(){ 
      this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=FlowModel')
      .then(res => {
        let model = res.data.objects;
        for(var i = 0; i < model.length; i++){
          if(model[i].id == 6 ){
            this.flowModel = model[i].name;
          }
        }
        this.commission();
      })
    },
    commission(){
      this.$http.post(this.GLOBAL.jqUrl + '/JQ/GettingUnfinishedTasksForJQ', {
        //"userCode":18240316968,
        "userCode": sessionStorage.getItem('tel'),
        "startTime": this.applyForDate[0] ? moment(this.applyForDate[0]).format('YYYY-MM-DD HH:mm:ss') : "1970-07-23T01:30:54.452Z",
        "endTime": this.applyForDate[1] ? moment(this.applyForDate[1]).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        "startIndex": -1,
        "endIndex": -1,
        "workflowCode": this.flowModel
      }).then(res => {
        let keepRes = res.data
        let getJqId = [] ;
        let workItemID = [];
        let instanceID = [];
        keepRes.forEach(function (v) {
          getJqId.push(v.jq_ID)
          workItemID.push({'workItemID':v.workItemID,'instanceID':v.instanceID})
        })
        this.workItemID = workItemID;
        this.$http.post(this.GLOBAL.serverSrc + '/finance/refund/api/listforguid', { 
          "guid": getJqId,
          "type":0 
        }).then(obj =>{
          this.tableDate = obj.data.objects;
          this.total = obj.data.objects.length;
          this.$emit('headCallBack',obj.data.objects.length)
          this.tableDate.forEach(function (v,k,arr) {
            if(arr[k]['refundStateType'] == 0){
              arr[k]['refundStateType'] = '申请退款'
            }
            if(arr[k]['productType'] == 1){
              arr[k]['productType'] = '跟团游'
            }else if(arr[k]['productType'] == 2) {
              arr[k]['productType'] = '自由行'
            }else if(arr[k]['productType'] == 3) {
              arr[k]['productType'] = '签证'
            }
          })
        })
      })
    },
  }
};
</script>

<style scoped>
/*search*/
.demo-input-suffix {
  padding: 20px 0 10px 10px;
  max-width: 1390px;
  background-color: #f7f7f7;
  margin: 10px;
}
.el-input {
  width: auto;
}
.group-no {
  margin-left: 10px;
}
.search-title {
  font-size: 14px;
  margin-left: 30px;
  text-align:right;
}
.search-but {
  margin: 20px 0 0 930px;
  overflow: hidden;
}
.table {
  border: 1px solid #e6e6e6;
  border-bottom: 0;
  background-color: #f7f7f7;
  text-align: center;
  margin: 10px 10px 10px 10px;
  max-width: 1400px;
  padding: 1px;
}
.blue {
  color: #2e94f9;
}
.cursor {
  cursor: pointer;
}
.pagination{float: right; margin: 10px 10px 20px 0;}
</style>
