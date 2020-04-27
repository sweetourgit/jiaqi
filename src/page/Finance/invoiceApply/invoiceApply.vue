<template>
  <div style="border:1px solid #e6e6e6; max-width:1420px; overflow:hidden;margin:0 0 80px 0;">
    <div class="demo-input-suffix">
      <div>
        <span class="search-title" style="margin:0 0 0 35px;">发票号码</span>
        <el-input placeholder="请输入" v-model="invoiceNumber" class="group-no" style="width:200px;"></el-input>
        <span class="search-title">商户名称</span>
        <el-input placeholder="请输入" v-model="merchantsName" class="group-no" style="width:200px;"></el-input>
        <span class="search-title">申请日期</span>
        <el-date-picker v-model="applyForDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" class="group-no" style="width:380px;"></el-date-picker>
      </div>
      <br />
      <div>
        <span class="search-title" style="margin:0 0 0 62px;">状态</span>
        <el-select v-model="states" placeholder="请选择" class="group-no" style="width:200px">
          <el-option v-for="item in statesType" :key="item.value" :label="item.label" :value="item.value" style="width:200px;"></el-option>
        </el-select>
        <span class="search-title">发票抬头</span>
        <el-input placeholder="请输入" v-model="invoiceTitle" class="group-no" style="width:200px;"></el-input>
        <span class="search-title">开票日期</span>
        <el-date-picker v-model="invoiceDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" class="group-no" style="width:380px;"></el-date-picker>
      </div>
      <br />
      <div>
        <span class="search-title" style="margin:0 0 0 27px;">直客/商户</span>
        <el-select v-model="types" placeholder="请选择" class="group-no" style="width:200px">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" style="width:200px;"></el-option>
        </el-select>
        <!--<span class="search-title">收款单号</span>
        <el-input placeholder="请输入" v-model="collectionNumber" class="group-no" style="width:200px;"></el-input>-->
        <el-button type="primary" class="search-but" @click="search()">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>

    </div>
    <div class="main">
      <el-button type="primary" class="apply" @click="addInvoiceApply(1)">申请</el-button>
      <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass" @row-click="clickRow" @selection-change="changeFun">
        <el-table-column prop="id" label="发票ID" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.state=='待开票'" style="color: #7F7F7F" >{{scope.row.state}}</div>
            <div v-if="scope.row.state=='开票驳回'" style="color: #FF4A3D" >{{scope.row.state}}</div>
            <div v-if="scope.row.state=='已开票'" style="color: #33D174" >{{scope.row.state}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
        <el-table-column prop="invoiceHeader" label="发票抬头" align="center"></el-table-column>
        <el-table-column prop="taxpayerIDNumber" label="纳税人识别号" align="center"></el-table-column>
        <el-table-column prop="collectionType" label="直客/商户" align="center"></el-table-column>
        <el-table-column prop="localCompName" label="商户名称" align="center"></el-table-column>
        <el-table-column prop="createTime" :formatter='dateFormat' label="申请日期" align="center"></el-table-column>
        <el-table-column prop="endTime" label="开票日期" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.endTime !='0'">{{formatDate(new Date(scope.row.endTime))}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="invoicePrice" label="发票金额" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.invoicePrice}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ordNum" label="关联订单数" align="center"></el-table-column>
        <el-table-column prop="userName" label="申请人" align="center"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <span class="cursor blue" @click="operation(1)">详情</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="pageshow" class="pagination" @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page.sync="current" :page-sizes="[10, 30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"
      ></el-pagination>
      <invoiceApply-details :invoiceID="invoiceID" :variable="variable" :dialogType="dialogType"></invoiceApply-details>
      <addInvoiceApply :variableInvoice="variableInvoice" ></addInvoiceApply>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import invoiceApplyDetails from "./invoiceApplyDetails";
import addInvoiceApply from "./addInvoiceApply";
export default {
  name: "invoiceApply",
  components: {
    invoiceApplyDetails,
    addInvoiceApply
  },
  data() {
    return {
      invoiceID:0,
      variable: 0, 
      dialogType: 0, 
      variableInvoice:0, 
      invoiceNumber:'',
      merchantsName:'',
      applyForDate:'', 
      states:'',
      invoiceTitle:'',
      invoiceDate:'',
      types:'', 
      collectionNumber: '',
      statesType:[{ 
        value:'1',
        label:'待开票'
      },{
        value:'2',
        label:'已开票'
      },{
        value:'3',
        label:'开票驳回'
      }],
      typeList:[{ 
        value:'1',
        label:'商户'
      },{
        value:'2',
        label:'直客'
      }],
      tableDate:[],
      pageshow: true,
      pageSize: 10,  
      pageIndex: 1, 
      total: 0,
      current:1,
      multipleSelection: [], 
    };

  },
  mounted () {
    this.pageList();
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
      this.pageList(this.pageIndex === 1 ? this.pageIndex : 1,this.pageSize);
    },
    reset(curPage){ 
      this.invoiceNumber = '';
      this.merchantsName = '';
      this.applyForDate = ''; 
      this.states = '';
      this.invoiceTitle = '';
      this.invoiceDate = '';
      this.types = ''; 
      this.collectionNumber = '' ;
      this.pageIndex = 1 ? 1 : 1;
      this.current = curPage;
      this.pageList();
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
    pageList(pageIndex = this.pageIndex,pageSize = this.pageSize,invoiceNumber = this.invoiceNumber, merchantsName = this.merchantsName,selStartCreateTime=this.applyForDate == null ? 0 : this.applyForDate[0],selEndCreateTime = this.applyForDate == null ? 0 : this.applyForDate[1],states = this.states, invoiceTitle = this.invoiceTitle,selStartGrantTime = this.invoiceDate == null ? 0 : this.invoiceDate[0],selEndGrantTime = this.invoiceDate == null ? 0 : this.invoiceDate[1],types = this.types,collectionNumber =this.collectionNumber){
      if(selStartCreateTime){ 
         selStartCreateTime = (new Date(selStartCreateTime)).getTime()
      }else{
        selStartCreateTime = 0 ;
      }if(selEndCreateTime){
        selEndCreateTime = (new Date(selEndCreateTime)).getTime() + 24*60*60*1000
      }else{
        selEndCreateTime = 0 ;
      }if(selStartGrantTime){
        selStartGrantTime = (new Date(selStartGrantTime)).getTime()
      }else{
        selStartGrantTime = 0 ;
      }if(selEndGrantTime){
        selEndGrantTime = (new Date(selEndGrantTime)).getTime() + 24*60*60*1000
      }else{
        selEndGrantTime = 0 ;
      }
      var that = this
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/page",{
        "object": {
          "invoiceNumber":invoiceNumber,
          "localCompName":merchantsName,
          "selStartCreateTime":selStartCreateTime,
          "selEndCreateTime":selEndCreateTime,
          "state":states == '' ? 0 : states,
          "invoiceHeader":invoiceTitle,
          "selStartGrantTime":selStartGrantTime,
          "selEndGrantTime":selEndGrantTime,
          "collectionType":types == '' ? 0 : types,
          "collectionID":this.collectionNumber == "" ? 0 : collectionNumber,
        },
        "pageSize":pageSize,
        "pageIndex":pageIndex,
      }).then(res => {
          that.total = res.data.total
          that.tableDate = res.data.objects
          that.tableDate.forEach(function (v,k,arr) {
            if(arr[k]['state'] == 1){
              arr[k]['state'] = '待开票'
            }else if(arr[k]['state'] == 2) {
              arr[k]['state'] = '已开票'
            }else if(arr[k]['state'] == 3) {
              arr[k]['state'] = '开票驳回'
            }if(arr[k]['collectionType'] == 1){
              arr[k]['collectionType'] = '商户'
            }else if(arr[k]['collectionType'] == 2) {
              arr[k]['collectionType'] = '直客'
            }
          })
        })
        .catch(function (res) {
          console.log(res)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.pageList(this.pageIndex,val);
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.pageList(val,this.pageSize);
    },
    operation(i) {
      this.variable++;
      this.dialogType = i;
    },
    addInvoiceApply(i){
      this.variableInvoice++;

    },
    changeFun(val) {
      this.multipleSelection = val;
    },
    clickRow(row) {
      this.$refs.multipleTable.clearSelection(); 
      this.$refs.multipleTable.toggleRowSelection(row);
      this.invoiceID = this.multipleSelection[0].id;
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
.start-time {
  margin-left: 10px;
}
.date-line {
  width: 30px;
  border-bottom: 1px solid #e6e6e6;
  display: inline-block;
  margin: 0 3px 3px 0;
}
.search-title {
  font-size: 14px;
  margin-left: 30px;
  text-align:right;
}
.search-but {
  margin: 0 0 0 630px;
  overflow: hidden;
}
.apply{
  margin:0 0 0 10px;
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
