<template>
  <div> 
      <el-dialog title="数据权限列表" :visible.sync="dialogDate" class="city_list" width="1000px" @close="close">
         <el-row class="button">
           <el-button @click="openJurisdiction(1,'新增')">新增</el-button>
           <el-button :disabled="forbidden" @click="delJurisdiction">删除</el-button>
           <el-button :disabled="forbidden" @click="openJurisdiction(2,'编辑')">编辑</el-button>
         </el-row>
         <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
           <el-table-column  prop="symbol" label="标识" min-width="210" align="center"></el-table-column>   
           <el-table-column  prop="name" label="名称" min-width="200" align="center"></el-table-column>
           <el-table-column  prop="match" label="匹配" min-width="150" align="center"></el-table-column>
           <el-table-column  prop="mark" label="备注" min-width="150" align="center"></el-table-column>
         </el-table>
         
      </el-dialog> 
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="500px" @close="cancel">
          <el-form :model="rformB" :rules="rules" ref="rformB" label-width="100px" class="demo-ruleForm">
             <el-form-item label="名称" prop="name">
                 <el-input v-model="rformB.name"></el-input>
             </el-form-item>
             <el-form-item label="标识" prop="symbol">
                 <el-input v-model="rformB.symbol"></el-input>
             </el-form-item>
             <el-form-item label="匹配" prop="match">
                 <el-input v-model="rformB.match"></el-input>
             </el-form-item>
             <el-form-item label="备注" prop="mark">
                 <el-input v-model="rformB.mark"></el-input>
             </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveJurisdiction('rformB')" class="confirm">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    menuId:0,
    variable:0,
    dialogType:0
  },
  data() {
    return {
        dialogDate:false,
        guid:"",
        groupList: [],
        multipleSelection: [],   
        forbidden:true,        
        title:"",
        dialogFormVisible:false,
        rformB: {
          id:0,
          symbol:"",
          match: "",
          name: "",
          mark: ""
        },
        rules: {
          symbol: [{ required: true, message: '标识不能为空', trigger: 'blur' }],
          match: [{ required: true, message: '匹配不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        }
    }
  },
  watch: {
      variable:function(){           
        if(this.dialogType == 2){
          this.dialogDate = true;
          this.jurisdictionList();   
        }
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
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      rowClass({row, rowIndex}){ 
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      close(){
        this.dialogDate=false;
      },
      jurisdictionList(){  
        this.groupList=[];
        this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/data/list',{
             "object": {
               "menuId": this.menuId
              }
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.groupList=res.data.objects;
                }
        })
      },
      delJurisdiction(){ 
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
              this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/data/unbind',{
                    "id": this.multipleSelection[0].id
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("删除成功");
                         this.jurisdictionList();
                  }
               })
          }) 
          .catch(() => {
            this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      saveJurisdiction(formName){
         if(this.title == "新增"){
            this.insertJurisdiction(formName,'/org/jurisdiction/data/bind');
         }else{
            this.insertJurisdiction(formName,'/org/jurisdiction/data/save');
         }
      },
      openJurisdiction(index,title){  
        this.title=title;
        this.dialogFormVisible = true;
        if(index===2){
          this.getJurisdiction();
        }
      },
      getJurisdiction(){   
        this.$http.post(this.GLOBAL.serverSrc + '/org/jurisdiction/data/get',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.rformB=data;
              }
        }) 
      },
      insertJurisdiction(formName,url) {  
        this.$refs[formName].validate((valid) => {
          if(valid){
                   this.$http.post(this.GLOBAL.serverSrc + url,{
                     "object": {
                        "id": this.rformB.id,
                        "symbol": this.rformB.symbol,
                        "match": this.rformB.match,
                        "name": this.rformB.name,
                        "createTime": 0,
                        "menuId": this.menuId,
                        "mark": this.rformB.mark
                    }
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.jurisdictionList();
                         this.dialogFormVisible = false
                         this.$refs[formName].resetFields();
                         this.rformB.id=0;
                      }else{
                         this.$message.success(res.data.result.message);
                      }
                  })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      cancel(){
        this.dialogFormVisible = false
        this.$refs["rformB"].resetFields();
      }
  }
}
</script>

<style scoped>
       .table{border:1px solid #e6e6e6;width:1100px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px}
       .el-table tr{background: #f6f6f6 !important}
       .button{margin:-5px 0 0 8px}
       .button .el-button{border:1px solid #3095fa;color:#3095fa;width:80px;padding: 0;line-height: 35px}
       .el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
       .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: #f5f7fa !important}
       .pagination{text-align:center;margin:70px 0 50px 0}
       .confirm{margin:0 140px 0 20px}
       .demo-ruleForm{margin:20px}
       .demo-ruleForm .el-input{width:300px}
       .w270{width:300px}
</style>