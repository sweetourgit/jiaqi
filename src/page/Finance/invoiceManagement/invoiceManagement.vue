<template>
  <div style="border:1px solid #e6e6e6; max-width:1420px; overflow:hidden">
    <!--搜索框-->
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
          <el-option v-for="item in statesType" :key="item.value" :label="item.label":value="item.value" style="width:200px;"></el-option>
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
          <el-option v-for="item in typeList" :key="item.value" :label="item.label":value="item.value" style="width:200px;"></el-option>
        </el-select>
        <el-button type="primary" class="search-but" @click="search()">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>
      
    </div>
    <div class="main">
      <!--列表表格-->
      <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="id" label="发票ID" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center"></el-table-column>
        <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
        <el-table-column prop="invoiceHeader" label="发票抬头" align="center"></el-table-column>
        <el-table-column prop="taxpayerIDNumber" label="纳税人识别号" align="center"></el-table-column>
        <el-table-column prop="collectionType" label="直客/商户" align="center"></el-table-column>
        <el-table-column prop="localCompName" label="商户名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="申请日期" align="center"></el-table-column>
        <el-table-column prop="endTime" label="开票日期" align="center"></el-table-column>
        <el-table-column prop="invoicePrice" label="发票金额" align="center"></el-table-column>
        <el-table-column prop="ordNum" label="关联订单数" align="center"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <span class="cursor blue">详情</span>
            <span class="em" v-if="scope.row.state =='待开票'">|</span>
            <span class="cursor blue" v-if="scope.row.state =='待开票'">开票</span>
            <span class="em" v-if="scope.row.state =='已开票'">|</span>
            <span class="cursor blue" v-if="scope.row.state =='已开票'">换发票</span>
            <span class="em" v-if="scope.row.state !='开票驳回'">|</span>
            <span class="cursor blue" v-if="scope.row.state !='开票驳回'">驳回</span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination v-if="pageshow" class="pagination" @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page.sync="current" :page-sizes="[10, 30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  
  data() {
    return {
      //搜索框
      invoiceNumber:'',//发票号码
      merchantsName:'',//商户名称
      applyForDate:'', // 申请日期
      states:'',// 状态
      invoiceTitle:'',// 发票抬头
      invoiceDate:'',// 开票日期
      types:'', // 直客/商户
      statesType:[{ // 搜索框状态数据
        value:'1',
        label:'待开票'
      },{
        value:'2',
        label:'已开票'
      },{
        value:'3',
        label:'开票驳回'
      }],
      typeList:[{ // 直客/商户
        value:'1',
        label:'直客'
      },{
        value:'2',
        label:'商户'
      }],
      tableDate:[],//表格
      pageshow: true,// 分页
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      total: 0,
      current:1,
    };

  },
  mounted () {
    this.pageList();
  },
  methods: {
    search(){ // 搜索

    },
    reset(){ // 重置

    },
    getRowClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    pageList(){
      var that = this
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/page",{
        "object": {
          "isDeleted": 0
        },
        "pageSize":this.pageSize,
        "pageIndex":this.pageIndex,
      })
        .then(function (obj) {
          console.log(obj)
          that.total = obj.data.total
          that.tableDate = obj.data.objects
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
        .catch(function (obj) {
          console.log(obj)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.pageList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.pageList();
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
/*表格*/
.table {
  border: 1px solid #e6e6e6;
  border-bottom: 0;
  background-color: #f7f7f7;
  text-align: center;
  margin: 10px 10px 10px 10px;
  max-width: 1400px;
}
.blue {
  color: #2e94f9;
}
.cursor {
  cursor: pointer;
}
/*分页*/
.pagination{float: right; margin: 10px 10px 20px 0;}
</style>