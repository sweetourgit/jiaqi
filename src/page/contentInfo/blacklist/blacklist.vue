<template>
  <div>
     <el-row class="button">
       <el-button>新增</el-button>
       <el-button :disabled="forbidden">删除</el-button>
       <el-button :disabled="forbidden">编辑</el-button>
     </el-row>
    <!--list-->
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
       <!-- <el-table-column  prop="id" label="ID" min-width="50" align="center"></el-table-column> -->
       <el-table-column prop="number" fixed label="" type="selection" width="50" align="center"></el-table-column>
       <el-table-column  prop="name" label="黑名单名称" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="mobile" label="联系电话" min-width="120" align="center"></el-table-column>
       <el-table-column  prop="idCard" label="身份证号" min-width="180" align="center"></el-table-column>
       <el-table-column  prop="passport" label="护照" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="source" label="来源" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="sex" label="性别" min-width="60" align="center"></el-table-column>
       <el-table-column  prop="reason" label="原因" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="cityID" label="城市" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="mark" label="黑名单备注信息" min-width="180" align="center"></el-table-column>
       
     </el-table>
     <el-pagination class="pagination" :page-sizes="[10,20,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
     </el-pagination>
   </div>
</template>

<script>
export default {
  data() {
    return {
        guid:"",
        groupList: [],
        multipleSelection: [],   //选中的list
        forbidden:true,         //按钮是否禁用
        currentPage: 1,
        pagesize: 10, // 设定默认分页每页显示数
        pageIndex: 1, // 设定当前页数
        total: 0,
        title:"",
        
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
      changeFun(val) {  //保存选中项的数据
        this.multipleSelection=val;
        if(this.multipleSelection.length == 1){
           this.forbidden=false;
        }else{
           this.forbidden=true;
        }
      },
      clickRow(row){
        this.$refs.multipleTable.toggleRowSelection(row)
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
        //this.moduleList();
      },
      handleCurrentChange(val){
        this.pageIndex = val;
        //this.moduleList();
      },
      //供应商列表
      pageList() {
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/order/blacklist/api/page",
          {
            "object": {
              "isDeleted": 0
            },
            "pageSize":this.pagesize,
            "pageIndex":this.currentPage,
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.groupList = obj.data.objects
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
  },
  mounted(){
    this.pageList();
  },
}
</script>

<style scoped>
       .table{border:1px solid #e6e6e6;width:1100px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px}
       .el-table tr{background: #f6f6f6 !important}
       .button{margin:25px 0 0 8px}
       .button .el-button{border:1px solid #3095fa;color:#3095fa;width:80px;padding: 0;line-height: 35px}
       .el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
       .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: #f5f7fa !important}
       .pagination{text-align:center;margin:70px 0 50px 0}
       .confirm{margin:0 140px 0 20px}
       .demo-ruleForm{margin:20px}
       .demo-ruleForm .el-input{width:300px}
</style>
</style>
