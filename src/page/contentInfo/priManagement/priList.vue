<template>
  <div>
     <el-row class="button">
       <el-button @click="insertModuleO">新增</el-button>
       <el-button :disabled="forbidden" @click="delModule">删除</el-button>
       <el-button :disabled="forbidden" @click="editModuleO">编辑</el-button>
       <el-button :disabled="forbidden" @click="controlList">权限配置</el-button>
     </el-row>
    <!--list-->
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
       <el-table-column  prop="id" label="ID" min-width="60"></el-table-column>
       <el-table-column  prop="name" label="功能名称" min-width="150"></el-table-column>
       <el-table-column  prop="uri" label="页面地址" min-width="280"></el-table-column>
       <el-table-column  prop="guid" label="唯一标识" min-width="250"></el-table-column>
       <el-table-column  prop="parentID" label="所属上级" min-width="150"></el-table-column>
     </el-table>
     <div style="width:1100px;overflow:hidden">
     <el-pagination class="pagination"
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
      <!-- 新增、编辑弹框界面 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="500px" @close="cancel">
          <el-form :model="rformA" :rules="rules" ref="rformA" label-width="100px" class="demo-ruleForm">
             <el-form-item label="功能名称" prop="name">
                 <el-input v-model="rformA.name"></el-input>
             </el-form-item>
             <el-form-item label="页面地址" prop="uri">
                 <el-input v-model="rformA.uri"></el-input>
             </el-form-item>
             <el-form-item label="所属上级" prop="parentID">
                 <el-input v-model="rformA.parentID"></el-input>
             </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveModule('rformA')" class="confirm">确 定</el-button>
          </div>
      </el-dialog>
   </div>
</template>

<script>
import {formatDate} from '../../../js/libs/publicMethod.js'
export default {
  data() {
    return {
        guid:"",
        groupList: [],
        multipleSelection: [],   //选中的list
        forbidden:true,         //按钮是否禁用
        pageSize: 10, // 设定默认分页每页显示数
        pageIndex: 1, // 设定当前页数
        total: 0,
        title:"",
        dialogFormVisible:false,
        rformA: {
          name: "",
          uri: "",
          parentID: ""
        },
        rules: {
          name: [{ required: true, message: '功能名称不能为空', trigger: 'blur' }],
          uri: [{ required: true, message: '页面地址不能为空', trigger: 'blur' }],
          parentID: [{ required: true, message: '唯一标识不能为空', trigger: 'blur' }]
        }
    }
  },
  created(){
    this.moduleList()
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
        if(this.multipleSelection.length>0){
           this.forbidden=false;
        }else{
           this.forbidden=true;
        }
      },
      clickRow(row){    //选中行复选框勾选
        this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      moduleList(){  //获取Module
        this.$http.post(this.GLOBAL.serverSrc + '/org/module/api/page',{
             "pageIndex": this.pageIndex,
             "pageSize": this.pageSize,
             "object": {
               "isDeleted": 0,
              }
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.groupList=res.data.objects;
                   this.total=res.data.total;
                }
        })
      },
      delModule(){ //删除Module
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
              this.$http.post(this.GLOBAL.serverSrc + '/org/module/api/delete',{
                    "id": this.multipleSelection[0].id
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("删除成功");
                         this.moduleList();
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
      controlList(){
        this.$router.push({path: "/controlList?guid="+this.multipleSelection[0].guid});
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.moduleList();
      },
      handleCurrentChange(val){
        this.pageIndex = val;
        this.moduleList();
      },
      saveModule(formName){ 
         if(this.title == "增加模块"){
            this.insertModule(formName);
         }else{
            this.editModule(formName);
         }
      },
      editModuleO(){   //编辑弹窗
        this.getModule();
        this.title="编辑模块";
        this.dialogFormVisible = true;        
      },
      getModule(){   //获取一条Module
        this.$http.post(this.GLOBAL.serverSrc + '/org/module/api/get',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.rformA = data;
              }
        }) 
      },
      editModule(formName){  //编辑保存
         this.$refs[formName].validate((valid) => {
          if(valid){
             this.$http.post(this.GLOBAL.serverSrc + '/org/module/api/save',{
               "object": {
                "id": this.multipleSelection[0].id,
                "createTime": formatDate(new Date()),
                "isDeleted": 0,
                "code": "string",
                "name": this.rformA.name,
                "uri": this.rformA.uri,
                "guid": this.multipleSelection[0].guid,
                "parentID": this.rformA.parentID,
                "leaf": 0
              }
            }).then(res => {
                if(res.data.isSuccess == true){                
                  this.moduleList();
                  this.dialogFormVisible = false
                  this.$refs[formName].resetFields();
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
      insertModuleO(){  //新增弹窗
        this.title="增加模块";
        this.dialogFormVisible = true;
      },
      insertModule(formName) {  //新增保存
        this.$refs[formName].validate((valid) => {
          if(valid){
             this.$http.post(this.GLOBAL.serverSrc + '/universal/utinity/api/getguid',{
               "object": true
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.guid = res.data.object;
                   this.$http.post(this.GLOBAL.serverSrc + '/org/module/api/insert',{
                     "object": {
                      "id": 0,
                      "createTime": formatDate(new Date()),
                      "isDeleted": 0,
                      "code": "string",
                      "name": this.rformA.name,
                      "uri": this.rformA.uri,
                      "guid": this.guid,
                      "parentID": this.rformA.parentID,
                      "leaf": 0
                    }
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.moduleList();
                         this.dialogFormVisible = false
                         this.$refs[formName].resetFields();
                      }else{
                         this.$message.success(res.data.result.message);
                      }
                  })  
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
        this.$refs["rformA"].resetFields();
      }
  }
}
</script>

<style scoped>
       .table{border:1px solid #e6e6e6;width:1100px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px}
       .el-table tr{background: #f6f6f6 !important}
       .button{margin:25px 0 0 8px}
       .button .el-button{border:1px solid #3095fa;color:#3095fa;width:80px;padding: 0;line-height: 35px}
       .el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
       .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: #f5f7fa !important}
       .pagination{float:right;margin:70px 0 50px 0}
       .confirm{margin:0 140px 0 20px}
       .demo-ruleForm{margin:20px}
       .demo-ruleForm .el-input{width:300px}
</style>
</style>
