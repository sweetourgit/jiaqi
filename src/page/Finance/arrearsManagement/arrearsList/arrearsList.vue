<template>
  <div>
    <div class="demo-input-suffix">
      <!--供应商-->
      <span class="search-title">供应商</span>
      <el-input placeholder="请输入" v-model="supplierName" class="group-no"></el-input>
      <!--团期计划-->
      <span class="search-title">团期计划</span>
      <el-input placeholder="请输入" v-model="groupCode" class="group-no"></el-input>
      <!--操作-->
      <span class="search-title">操作</span>
      <el-input placeholder="请输入" v-model="op" class="group-no"></el-input>
      <!--出行日期-->
      <span class="search-title">起始时间</span>
      <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                      align="right" class="group-no" style="width:260px;"></el-date-picker>
      <br />
      <!--搜索-->
      <el-button type="primary" class="search-but" @click="search">搜索</el-button>
      <el-button type="primary" plain @click="reset">重置</el-button>
    </div>
    </br></br>
    <el-button type="primary" :disabled="forbidden" @click="operation">查看关联单据</el-button>
    <!--list-->
    <el-table :data="arrearsList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" :cell-style="getCellClass" @selection-change="changeFun" @row-click="clickRow">
      <el-table-column prop="id" label="欠款单号" min-width="60" header-align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" min-width="140" header-align="center"></el-table-column>
      <el-table-column prop="title" label="产品名称" min-width="180" header-align="center"></el-table-column>
      <el-table-column label="发起时间" min-width="110" header-align="center">
        <template slot-scope="scope">{{formatDate(new Date(scope.row.createTime))}}</template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" min-width="140" header-align="center"></el-table-column>
      <el-table-column prop="supplierType" label="类型" min-width="60" header-align="center"></el-table-column>
      <el-table-column prop="orgName" label="申请组织" min-width="90" header-align="center"></el-table-column>
      <el-table-column prop="name" label="申请人" min-width="50" header-align="center"></el-table-column>
      <el-table-column prop="price" label="欠款金额" min-width="60" header-align="center"></el-table-column>
      <el-table-column prop="id" label="关联单据号" min-width="70" header-align="center"></el-table-column>
    </el-table>
    <el-pagination v-if="pageshow" class="pagination"
                   @size-change="handleSizeChange"
                   background
                   @current-change="handleCurrentChange"
                   :current-page="1"
                   :page-sizes="[10, 30, 50, 100]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <arrears-detail :paymentID="paymentID" :variable="variable"></arrears-detail>





  </div>
</template>

<script>
  import arrearsDetail from './comp/arrearsDetail';
  export default{
    components:{
      "arrears-detail":arrearsDetail
    },
    data(){
      return {
        supplierName:"",
        groupCode:"",
        op:"",
        date:[],
        pageshow:true,
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        arrearsList: [],
        multipleSelection: [],
        forbidden:true,
        paymentID:0,
        variable:0,
      }
    },
    watch: {
      date:function(){
        if(this.date==null){
          this.date = [];
        }
      }
    },
    mounted(){
      this.paymentpage();
    },
    methods:{
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      getCellClass(){
        return 'textAlign:center'
      },
      changeFun(val) {  //保存选中项的数据
        this.multipleSelection=val;
        if(this.multipleSelection.length>0){
          this.forbidden=false;
        }else{
          this.forbidden=true;
        }
      },
      clickRow(row){    //选中行复选框勾选
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      rowClass({row, rowIndex}){  //选中行样式改变
        for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
            return { "background-color": "#ecf5ff" }
          }
        }
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.paymentpage(1,val);
      },
      handleCurrentChange(val){
        this.paymentpage(val,this.pageSize);
      },
      search(){
        this.pageIndex = 1;
        this.pageshow = false;
        this.paymentpage();
        this.$nextTick(() => {
          this.pageshow = true;
        })
      },
      reset(){
        this.supplierName = "";
        this.groupCode = "";
        this.op = "";
        this.date = [];
      },
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
        return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
      },
      paymentpage(pageIndex=this.pageIndex,pageSize=this.pageSize,supplierName=this.supplierName,groupCode=this.groupCode,startDate=this.date[0],endDate=this.date[1],op=this.op){
        if(startDate){
          let y=startDate.getFullYear();
          let m=(startDate.getMonth()+1)>9?startDate.getMonth()+1:'0'+(startDate.getMonth()+1);
          let d=startDate.getDate()>9?startDate.getDate():'0'+startDate.getDate();
          startDate=''+ y +"-" + m + "-" + d;
        }else{
          startDate = "0001-01-01";
        }
        if(endDate){
          let y=endDate.getFullYear();
          let m=(endDate.getMonth()+1)>9?endDate.getMonth()+1:'0'+(endDate.getMonth()+1);
          let d=endDate.getDate()>9?endDate.getDate():'0'+endDate.getDate();
          endDate=''+ y +"-" + m + "-" + d;
        }else{
          endDate = "0001-01-01";
        }
        this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentpage',{
          "pageIndex": pageIndex,
          "pageSize": pageSize,
          "object":{
            "supplierName":supplierName,
            "groupCode": groupCode,
            "beginTime": startDate,
            "endTime": endDate,
            "name":op,
          }
        }).then(res => {
          this.arrearsList=[];
          this.total=res.data.total;
          if(res.data.isSuccess == true){
            this.arrearsList=res.data.objects;
            this.arrearsList.forEach(function(v,k,arr){
              switch(arr[k]['supplierType']){
                case 1:
                  arr[k]['supplierType'] = '地接'
                  break;
                case 2:
                  arr[k]['supplierType'] = '机票（本公司）'
                  break;
                case 3:
                  arr[k]['supplierType'] = '机票（非本公司）'
                  break;
                case 4:
                  arr[k]['supplierType'] = '小费'
                  break;
                case 5:
                  arr[k]['supplierType'] = '地接（其他）'
                  break;
                case 6:
                  arr[k]['supplierType'] = '火车票'
                  break;
                case 7:
                  arr[k]['supplierType'] = '汽车票'
                  break;
                case 8:
                  arr[k]['supplierType'] = '船票'
                  break;
                case 9:
                  arr[k]['supplierType'] = '其他'
                  break;
                case 10:
                  arr[k]['supplierType'] = '机票押金'
                  break;
                case 11:
                  arr[k]['supplierType'] = '火车票押金'
                  break;
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      operation(){
        this.paymentID = this.multipleSelection[0].id;
        this.variable++;
      },
    }
  };
</script>

<style scoped>
  .demo-input-suffix {
    padding: 20px 0 0px 20px;
    width: 1390px;
    background-color: #f7f7f7;
  }
  .el-input {
    width: auto;
    margin-right: 15px;
  }
  .group-no {
    margin-left: 10px;
  }
  .search-title {
    font-size: 14px;
    text-align:right;
  }
  .search-but {
    margin: 20px 0 15px 0;
    overflow: hidden;
  }
  /*list*/
  .table{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 0;width:1400px;}
  .pagination{text-align:center;margin:30px 0 50px 0;}
</style>
