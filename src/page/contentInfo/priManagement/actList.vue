<template>
  <div> 
      <el-dialog title="功能列表" :visible.sync="dialogAct" class="city_list" width="1000px" @close="close">
         <el-row class="button">
           <el-button @click="openAct(1,'新增动作')">新增</el-button>
           <el-button :disabled="forbidden" @click="delAct">删除</el-button>
           <el-button :disabled="forbidden" @click="openAct(2,'编辑动作')">编辑</el-button>
         </el-row>
         <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
           <el-table-column  prop="characteristic" label="标识" min-width="60" align="center"></el-table-column>
           <el-table-column  prop="uri" label="地址" min-width="150" align="center"></el-table-column>
           <el-table-column  prop="name" label="名称" min-width="280" align="center"></el-table-column>
           <el-table-column  prop="overt" label="公开" min-width="150" align="center">
               <template slot-scope="scope">
                  <div v-if="scope.row.overt == '1'">是</div>
                  <div v-else>否</div>
               </template>
           </el-table-column>
           <el-table-column  prop="remarks" label="备注" min-width="150" align="center"></el-table-column>
         </el-table>
      </el-dialog> 
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="500px" @close="cancel">
          <el-form :model="rformB" :rules="rules" ref="rformB" label-width="100px" class="demo-ruleForm">
             <el-form-item label="标识" prop="characteristic">
                 <el-input v-model="rformB.characteristic"></el-input>
             </el-form-item>
             <el-form-item label="地址" prop="uri">
                 <el-input v-model="rformB.uri"></el-input>
             </el-form-item>
             <el-form-item label="名称" prop="name">
                 <el-input v-model="rformB.name"></el-input>
             </el-form-item>
             <el-form-item label="公开" prop="overt">
                 <el-radio-group v-model="rformB.overt">
                   <el-radio label="1">是</el-radio>
                   <el-radio label="2">否</el-radio>
                 </el-radio-group>
             </el-form-item>
             <el-form-item label="备注" prop="remarks">
                 <el-input v-model="rformB.remarks"></el-input>
             </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveAct('rformB')" class="confirm">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
        dialogAct: false,
        guid: "",
        groupList: [],
        multipleSelection: [],   
        forbidden: true,         
        title: "",
        dialogFormVisible: false,
        rformB: {
          id: 0,
          characteristic: "",
          uri: "",
          name: "",
          overt: "2",
          remarks: ""
        },
        rules: {
          characteristic: [{ required: true, message: '标识不能为空', trigger: 'blur' }],
          uri: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          overt: [{ required: true, message: '公开不能为空', trigger: 'blur' }],
        }
    }
  },
  props: {
    menuId: 0,
    variable: 0,
    dialogType: 0
  },
  watch: {
      variable: function () {        
        if (this.dialogType == 1) {
          this.actList();   
          this.dialogAct = true;  
        }  
     }
  },
  methods: {
      getRowClass ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      changeFun (val) { 
        this.multipleSelection = val;
        if (this.multipleSelection.length > 0) {
           this.forbidden = false;
        } else {
           this.forbidden = true;
        }
      },
      clickRow (row) {   
        this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      rowClass ({row, rowIndex}) {  
       for (var i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].id == row.id) {
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      close () {
        this.dialogAct = false;
      },
      actList () {  
        this.$http.post(this.GLOBAL.serverSrc + '/org/act/api/list', {
             "object": {
               "menuID": this.menuId
              }
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.groupList = res.data.objects;
                }
        })
      },
      delAct () { 
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
              this.$http.post(this.GLOBAL.serverSrc + '/org/act/api/delete',{
                    "id": this.multipleSelection[0].id
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("删除成功");
                         this.ActList();
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
      saveAct (formName) {
         if (this.title == "新增动作") {
            this.insertAct(formName, '/org/act/api/insert');
         }else{
            this.insertAct(formName, '/org/act/api/save');
         }
      },
      openAct (index,title) {  
        this.title = title;
        this.dialogFormVisible = true;
        if (index === 2) {
          this.getAct();
        }
      },
      getAct () {  
        this.$http.post(this.GLOBAL.serverSrc + '/org/act/api/get',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.rformB = data;
                 this.rformB.overt += '';
              }
        }) 
      },
      insertAct (formName, url) {  
        console.log()
        this.$refs[formName].validate((valid) => {
          if (valid) {
                   this.$http.post(this.GLOBAL.serverSrc + url,{
                     "object": {
                        "id": this.rformB.id,
                        "characteristic": this.rformB.characteristic,
                        "uri": this.rformB.uri,
                        "name": this.rformB.name,
                        "createTime": 0,
                        "menuID": this.menuId,
                        "overt": this.rformB.overt,
                        "guid": "",
                        "remarks": this.rformB.remarks
                    }
                  }).then(res => {
                      if (res.data.isSuccess == true) {
                         this.actList();
                         this.dialogFormVisible = false
                         this.$refs[formName].resetFields();
                         this.rformB.id = 0;
                      } else {
                         this.$message.success(res.data.result.message);
                      }
                  })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      cancel () {
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
</style>