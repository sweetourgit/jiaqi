<template>
  <div class="demo-input-suffix"> 
         <el-row class="button">
           <el-button @click="openRole(1,'新增')">新增</el-button>
           <el-button :disabled="forbidden" @click="delRole">删除</el-button>
           <el-button :disabled="forbidden" @click="openRole(2,'编辑')">编辑</el-button>
           <el-button :disabled="forbidden" @click="operation(1,2)">授权</el-button>
           <el-button :disabled="forbidden" @click="operation(2)">选择用户</el-button>
         </el-row>
        <!--list-->
         <el-table :data="dataList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
           <el-table-column  prop="title" label="模板名称" min-width="210" align="center"></el-table-column>   
           <el-table-column  prop="count" label="人数" min-width="150" align="center"></el-table-column>
           <el-table-column  prop="mark" label="备注" min-width="150" align="center"></el-table-column>
         </el-table>
         <el-pagination class="pagination"
            @size-change="handleSizeChange"
            background
            @current-change="handleCurrentChange"
            :current-page="1" 
            :page-sizes="[10, 30, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
       <!-- 新增、编辑弹框界面 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="500px" @close="cancel">
          <el-form :model="rform" :rules="rules" ref="rform" label-width="100px" class="demo-ruleForm">
             <el-form-item label="模板名称" prop="title">
                 <el-input v-model="rform.title"></el-input>
             </el-form-item>
             <el-form-item label="备注" prop="mark">
                 <el-input v-model="rform.mark"></el-input>
             </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveRole('rform')" class="confirm">确 定</el-button>
          </div>
      </el-dialog>
      <grant-auth :id="id" :variable="variable" :dialogType="dialogType" :userType="userType"></grant-auth>
      <choose-user :id="id" :variable="variable" :dialogType="dialogType"></choose-user>
  </div>
</template>

<script>
import grantAuth from './grantAuth'
import chooseUser from './chooseUser'
export default {
  components:{
    "grant-auth":grantAuth,
    "choose-user":chooseUser,
  }, 
  data() {
    return {
        guid:"",
        dataList: [],
        pageSize: 10, 
        pageIndex: 1, 
        total: 0,
        variable:0,
        dialogType:0,
        userType:0,//用户1，角色2
        id:0,
        multipleSelection: [],   //选中的list
        forbidden:true,         //按钮是否禁用
        title:"",
        dialogFormVisible:false,
        rform: {
          title: "",
          count: "",
          mark: ""
        },
        rules: {
          title: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        }
    }
  },
  mounted(){
    this.roleList()
  },
  methods: {
      getRowClass({ row, column, rowIndex, columnIndex }){
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
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.roleList(1,val);
      },
      handleCurrentChange(val){
        this.roleList(val,this.pageSize);
        this.pageIndex=val;
      },
      roleList(pageIndex=this.pageIndex,pageSize=this.pageSize,){  
        this.$http.post(this.GLOBAL.serverSrc + '/org/api/rolepage',{
              "pageIndex": pageIndex,
              "pageSize": pageSize,
              "object": {
                "isDeleted": 0
              },
            }).then(res => {
              this.dataList=[];
              this.total=res.data.total;
              if(res.data.isSuccess == true){
                 this.dataList=res.data.objects;
              }
          })      
      },
      delRole(){ 
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
              this.$http.post(this.GLOBAL.serverSrc + '/org/api/roledelete',{
                    "id": this.multipleSelection[0].id
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("删除成功");
                         this.roleList();
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
      saveRole(formName){
         if(this.title == "新增"){
            this.insertRole(formName,'/org/api/roleinsert');
         }else{
            this.insertRole(formName,'/org/api/rolesave');
         }
      },
      openRole(index,title){  
        this.title=title;
        this.dialogFormVisible = true;
        if(index===2){
          this.getRole();
        }
      },
      getRole(){   
        this.$http.post(this.GLOBAL.serverSrc + '/org/api/roleget',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.rform=data;
              }
        }) 
      },
      insertRole(formName,url) {  
        this.$refs[formName].validate((valid) => {
          if(valid){
                   this.$http.post(this.GLOBAL.serverSrc + url,{
                     "object": {
                        "id": this.rform.id,
                        "title": this.rform.title,
                        "mark": this.rform.mark
                    }
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.roleList();
                         this.dialogFormVisible = false
                         this.$refs[formName].resetFields();
                         this.rform.id=0;
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
        this.dialogFormVisible = false;
        this.$refs["rform"].resetFields();
      },
      operation(i,type){
          this.id=this.multipleSelection[0].id;
          this.variable++;
          this.dialogType = i;
          this.userType=type;
      },
  }
}
</script>

<style scoped>
     .demo-input-suffix{width: 900px;}
     .table{border:1px solid #e6e6e6;width:1100px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px}
     .el-table tr{background: #f6f6f6 !important}
     .button{margin:20px 0 0 8px}
     .button .el-button{border:1px solid #3095fa;color:#3095fa;width:80px;padding: 0;line-height: 35px}
     .el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
     .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: #f5f7fa !important}
     .pagination{text-align:center;margin:40px 0 50px 0}
     .confirm{margin:0 140px 0 20px}
     .demo-ruleForm{margin:20px}
     .demo-ruleForm .el-input{width:300px}
     .w270{width:300px}
</style>