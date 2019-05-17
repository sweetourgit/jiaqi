<template>
  <div>
     <el-row class="button">
       <el-button @click="insertControlO">新增</el-button>
       <el-button :disabled="forbidden" @click="delControl">删除</el-button>
       <el-button :disabled="forbidden" @click="editControlO">编辑</el-button>
     </el-row>
    <!--list-->
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
       <el-table-column  prop="id" label="ID" min-width="60"></el-table-column>
       <el-table-column  prop="name" label="名称" min-width="150"></el-table-column>
       <el-table-column  prop="route" label="路径" min-width="280"></el-table-column>
       <el-table-column  prop="key" label="控件ID" min-width="150"></el-table-column>
     </el-table>
      <!-- 新增、编辑弹框界面 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="500px" @close="cancel">
          <el-form :model="rformB" :rules="rules" ref="rformB" label-width="100px" class="demo-ruleForm">
             <el-form-item label="名称" prop="name">
                 <el-input v-model="rformB.name"></el-input>
             </el-form-item>
             <el-form-item label="路径" prop="route">
                 <el-input v-model="rformB.route"></el-input>
             </el-form-item>
             <el-form-item label="控件ID" prop="key">
                 <el-input v-model="rformB.key"></el-input>
             </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveControl('rformB')" class="confirm">确 定</el-button>
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
        title:"",
        dialogFormVisible:false,
        rformB: {
          name: "",
          route: "",
          key: ""
        },
        rules: {
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          route: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
          key: [{ required: true, message: '控件ID不能为空', trigger: 'blur' }]
        }
    }
  },
  created(){
    this.controlList();
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
      controlList(){  //获取control
        this.$http.post(this.GLOBAL.serverSrc + '/org/control/api/list',{
             "object": {
               "guid": this.$route.query.guid
              }
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.groupList=res.data.objects;
                }
        })
      },
      delControl(){ //删除control
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
              this.$http.post(this.GLOBAL.serverSrc + '/org/control/api/delete',{
                    "id": this.multipleSelection[0].id
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("删除成功");
                         this.controlList();
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
      saveControl(formName){ 
         if(this.title == "增加权限"){
            this.insertControl(formName);
         }else{
            this.editControl(formName);
         }
      },
      editControlO(){   //编辑弹窗
        this.getControl();
        this.title="编辑权限";
        this.dialogFormVisible = true;        
      },
      getControl(){   //获取一条control
        this.$http.post(this.GLOBAL.serverSrc + '/org/control/api/get',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.rformB=data;
              }
        }) 
      },
      editControl(formName){  //编辑保存
         this.$refs[formName].validate((valid) => {
          if(valid){
             this.$http.post(this.GLOBAL.serverSrc + '/org/control/api/save',{
               "object": {
                "id": this.multipleSelection[0].id,
                "createTime": formatDate(new Date()),
                "isDeleted": 0,
                "code": "string",
                "name": this.rformB.name,
                "route": this.rformB.route,
                "guid": this.multipleSelection[0].guid,
                "key": this.rformB.key,
                "leaf": 0
              }
            }).then(res => {
                if(res.data.isSuccess == true){                
                  this.controlList();
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
      insertControlO(){  //新增弹窗
        this.title="增加权限";
        this.dialogFormVisible = true;
      },
      insertControl(formName) {  //新增保存
        this.$refs[formName].validate((valid) => {
          if(valid){
                   this.$http.post(this.GLOBAL.serverSrc + '/org/control/api/insert',{
                     "object": {
                      "id": 0,
                      "name": this.rformB.name,
                      "route": this.rformB.route,                     
                      "key": this.rformB.key,
                      "guid": this.$route.query.guid
                    }
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.controlList();
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
