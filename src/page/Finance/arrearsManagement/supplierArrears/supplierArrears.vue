<template>
  <div>
    <div class="search">
      <!--供应商-->
      <span class="search-title">供应商</span>
      <el-input placeholder="请输入" v-model="name" class="group-no"></el-input>
      <!--搜索-->
      <el-button type="primary" class="search-but" @click="search">搜索</el-button>
      <el-button type="primary" plain @click="reset">重置</el-button>
    
      </br></br>
      <el-button type="primary" :disabled="forbidden" @click="operation">查看</el-button>
      <!--list-->
      <el-table :data="arrearsList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" :cell-style="getCellClass" @selection-change="changeFun" @row-click="clickRow">     
          <el-table-column prop="name" label="供应商名称" min-width="140" header-align="center"></el-table-column>
          <el-table-column prop="price" label="欠款金额" min-width="60" header-align="center"></el-table-column>
      </el-table>
      <el-pagination v-if="pageshow" class="pagination"
              @size-change="handleSizeChange"
              background
              @current-change="handleCurrentChange"
              :current-page="1"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
      <supplier-detail :supplierID="supplierID" :variable="variable"></supplier-detail>
    </div>
  </div> 
</template>

<script>
import supplierDetail from './comp/supplierDetail';
export default{
  components:{
    "supplier-detail":supplierDetail
  },
  data(){
    return {
      name:"",
      pageshow:true,
      pageSize: 10, 
      pageIndex: 1,
      total: 0,
      arrearsList: [],
      multipleSelection: [],
      forbidden:true,
      supplierID:0,
      variable:0,



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
      this.name="";
    },
    paymentpage(pageIndex=this.pageIndex,pageSize=this.pageSize,name=this.name){
        this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/supplierpage',{
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "object":{            
              "name":name,
             }
          }).then(res => {
            this.arrearsList=[];
            this.total=res.data.total;
            if(res.data.isSuccess == true){
               this.arrearsList=res.data.objects;              
            }
          }).catch(err => {
            console.log(err)
          })
    },
    operation(){
        this.supplierID = this.multipleSelection[0].id;
        this.variable++;       
    },
  }
};
</script>
 
<style lang="scss" scoped>
/*search*/
.search{
  padding-left: 20px;
  width:800px;
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
.table{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 0;}
.pagination{text-align:center;margin:30px 0 50px 0;}
</style>