<template>
  <div>
       <el-dialog title="供应商欠款详情" :visible.sync="dialogForm" class="city_list" width="1080px">
            <div class="search">
              <span class="search-title">团期</span>
              <el-input placeholder="请输入" v-model="name" class="group-no"></el-input>
              <el-button type="primary" class="search-but" @click="search">搜索</el-button>
              <el-button type="primary" plain @click="reset">重置</el-button>
              </br></br>
              <el-button type="primary" :disabled="forbidden">查看</el-button>
              <el-table :data="arrearsList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" :cell-style="getCellClass" @selection-change="changeFun" @row-click="clickRow">     
                  <el-table-column prop="name" label="团期" header-align="center"></el-table-column>
                  <el-table-column prop="price" label="总欠款" min-width="80" header-align="center"></el-table-column>
                  <el-table-column prop="price" label="订单总额" min-width="80" header-align="center"></el-table-column>
                  <el-table-column prop="price" label="已审批总额" min-width="80" header-align="center"></el-table-column>
                  <el-table-column prop="price" label="审批中总额" min-width="80" header-align="center"></el-table-column>
                  <el-table-column prop="price" label="已收总额" min-width="80" header-align="center"></el-table-column>
                  <el-table-column prop="price" label="供应商欠款总额" min-width="80" header-align="center"></el-table-column>
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
            </div>
       </el-dialog> 
  </div>
</template>

<script>
export default {
  props:{
    supplierID:0,
    variable:0
  },
  data() {
    return {
      dialogForm:false,
      name:"",
      pageshow:true,
      pageSize: 10, 
      pageIndex: 1,
      total: 0,
      arrearsList: [],
      multipleSelection: [],
      forbidden:true,
    }
  },
  watch: {
      variable:function(){        
        this.dialogForm=true;    
        this.paymentpage();
     }
  },
  methods: {
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
    changeFun(val) {  
      this.multipleSelection=val;
      if(this.multipleSelection.length>0){
         this.forbidden=false;
      }else{
         this.forbidden=true;
      }
    },
    clickRow(row){    
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row);        
    },
    rowClass({row, rowIndex}){  
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
              "id":this.supplierID,
             }
          }).then(res => {
           // this.arrearsList=[];
           // this.total=res.data.total;
           // if(res.data.isSuccess == true){
           //    this.arrearsList=res.data.objects;              
           // }
          }).catch(err => {
            console.log(err)
          })
    }
  }
};
</script>

<style lang="scss" scoped>
/*search*/
.search{
  padding-left: 20px;
  width:1000px;
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