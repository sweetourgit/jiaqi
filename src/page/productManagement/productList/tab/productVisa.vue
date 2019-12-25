<template>
  <div class="productvisa" style="width:1200px; ">
    <!--搜索框-->
    <div class="demo-input-suffix">
      <div class="mt20">
        <span class="search-title" style="margin:0 0 0 35px;">产品ID</span>
        <el-input placeholder="请输入" v-model="productID" class="group-no" style="width:200px;"></el-input> 
        <span class="search-title">产品名称</span>
        <el-input placeholder="请输入" v-model="productName" class="group-no" style="width:200px;"></el-input>
        <span class="search-title">价格</span>
        <el-input placeholder="请输入" v-model="minPrice" class="group-no" style="width:100px;"></el-input>
        <span class="ml10">——</span>
        <el-input placeholder="请输入" v-model="maxPrice" class="group-no" style="width:100px;"></el-input>
      </div>
      <br />
      <div>
        <span class="search-title" style="margin:0 0 0 22px;">国家地区</span>
        <el-input placeholder="请输入" v-model="countriesArea" class="group-no" style="width:200px;"></el-input>
        <span class="search-title">签证类型</span>
        <el-select v-model="visaTypes" placeholder="请选择" class="group-no" style="width:200px">
          <el-option v-for="item in visaList" :key="item.value" :label="item.label":value="item.value" style="width:200px;"></el-option>
        </el-select>
        <span class="search-title">状态</span>
        <el-select v-model="state" placeholder="请选择" class="group-no" style="width:262px">
          <el-option v-for="item in statesType" :key="item.value" :label="item.label":value="item.value" style="width:200px;"></el-option>
        </el-select>
      </div>
      <br />
      <div class="mbt20">
        <span class="search-title" style="margin:0 0 0 22px;">操作人员</span>
        <el-input placeholder="请输入" v-model="op" class="group-no" style="width:200px;"></el-input>
        <el-button type="primary" class="search-but" @click="search()">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>      
    </div>
    <!--按钮-->
    <div class="productbut">
      <el-button type="primary" @click="addProducts">添加</el-button>
      <el-button :disabled="forbidden">编辑</el-button>
      <el-button :disabled="forbidden">预订</el-button>
      <el-button :disabled="forbidden" @click="visaInventory()">库存</el-button>
      <el-button :disabled="forbidden">更改状态</el-button>
      <el-button :disabled="forbidden">复制</el-button>
      <el-button :disabled="forbidden">退改政策</el-button>
      <el-button :disabled="forbidden" type="danger" plain>删除</el-button>
    </div>
    <!--列表表格-->
    <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass" @row-click="clickRow" @selection-change="changeFun" :row-style="rowClass">
      <el-table-column prop="productID" label="产品ID" align="center" width="120"></el-table-column>
      <el-table-column prop="productName" label="产品名称" align="center" width="278"></el-table-column>
      <el-table-column prop="countriesArea" label="国家地区" align="center" width="120"></el-table-column>
      <el-table-column prop="visaTypes" label="签证类型" align="center" width="120"></el-table-column>
      <el-table-column prop="minPrice" label="价格" align="center" width="120"></el-table-column>
      <el-table-column prop="op" label="操作人员" align="center" width="120"></el-table-column>
      <el-table-column prop="onlineType" label="线上状态" align="center" width="140"></el-table-column>
      <el-table-column prop="erpType" label="erp状态" align="center" width="140"></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination v-if="pageshow" class="pagination" @size-change="handleSizeChange" background @current-change="handleCurrentChange"
      :current-page.sync="current" :page-sizes="[10, 30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索框
      productID:'',//产品ID
      productName:'',//产品名称
      minPrice:'', // 最低价格
      maxPrice:'',// 最高价格
      countriesArea:'',// 国家地区
      visaTypes:'',// 签证类型
      state:'',// 状态
      op:'', // 操作
      statesType:[{ // 搜索框状态数据
        value:'1',
        label:'全部状态'
      },{
        value:'2',
        label:'线上上线'
      },{
        value:'3',
        label:'erp上线'
      },{
        value:'4',
        label:'仅erp上线'
      },{
        value:'5',
        label:'下线'
      }],
      visaList:[{ // 签证类型
        value:'1',
        label:'单次旅游签'
      },{
        value:'2',
        label:'5年旅游签'
      },{
        value:'3',
        label:'10年多次旅游签'
      },{
        value:'4',
        label:'探亲访友签'
      },{
        value:'5',
        label:'商务签证'
      }],
      tableDate:[{
        productID:'1'
      },{
        productID:'2'
      }],//表格
      pageshow: true,// 分页
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      total: 0,
      current:1,
      multipleSelection: [], //选中的list
      forbidden:true, 
      pid:"",
    };

  },
  mounted () {
    this.pageList();
  },
  methods: {     
    search(){ // 搜索
      this.pageList();
    },
    reset(){ // 重置
      this.productID = '';//产品ID
      this.productName = '';//产品名称
      this.minPrice = ''; // 最低价格
      this.maxPrice = '';// 最高价格
      this.countriesArea = '';// 国家地区
      this.visaTypes = '';// 签证类型
      this.state = '';// 状态
      this.op = ''; // 操作
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
    changeFun(val) {
      //保存选中项的数据
      this.multipleSelection = val;
      if(this.multipleSelection.length == 1){
         this.forbidden=false;
      }else{
         this.forbidden=true;
      }
    },
    clickRow(row) {
      //选中行复选框勾选
      this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
      this.$refs.multipleTable.toggleRowSelection(row);
      this.pid = row["productID"];
    },
    rowClass({row, rowIndex}){  //选中行样式改变
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].productID==row.productID){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    pageList(){

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
    addProducts(){
      this.$router.push({ path: "/visaProducts" });
    },
    visaInventory(){ // 团期库存
      this.$router.push({ path: "/visaInventory?id="+this.pid });
    },
  }
};
</script>

<style scoped>
.productvisa{
  max-width: 1160px; 
  overflow: hidden;
}
/*search*/
.demo-input-suffix {
  max-width: 1160px;
  background-color: #f7f7f7;
  
  overflow: hidden;
}
.mt20{
  margin-top:20px; 
}
.mbt20{
  margin-bottom: 20px; 
}
.ml10{
  margin-left:10px; 
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
  margin-left: 100px;
  text-align:right;
}
.search-but {
  margin: 0 0 0 624px;
  overflow: hidden;
}
/*按钮*/
.productbut{
  margin: 20px 0 10px 0;
}
/*表格*/
.table {
  border: 1px solid #e6e6e6;
  border-bottom: 0;
  background-color: #f7f7f7;
  text-align: center;
  margin: 10px 0 10px 0;
  max-width: 1160px;
  padding-left: 1px;
}
.blue {
  color: #2e94f9;
}
.cursor {
  cursor: pointer;
}
/*分页*/
.pagination{float: right; margin: 10px 0 20px 0;}
</style>