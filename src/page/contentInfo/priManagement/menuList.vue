<template>
  <div>
     <div class="ztree-bg">
       <ul id="tree" class="ztree"></ul>
     </div>
     <div class="tree-list">
     <div v-if="showList" style="padding-bottom:50px">
     <el-row class="button">
       <el-button @click="openMenu(1,'添加菜单')">新增</el-button>
       <el-button :disabled="forbidden" @click="delMenu">删除</el-button>
       <el-button :disabled="forbidden" @click="openMenu(2,'编辑菜单')">编辑</el-button>
       <el-button :disabled="forbidden" @click="operation(1)">页面权限</el-button>
       <el-button :disabled="forbidden" @click="operation(2)">数据权限</el-button>
     </el-row>
    <!--list-->
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
       <el-table-column  prop="id" label="ID" min-width="60" align="center"></el-table-column>
       <el-table-column  prop="name" label="功能名称" min-width="150" align="center"></el-table-column>
       <el-table-column  prop="uri" label="页面地址" min-width="280" align="center"></el-table-column>
       <!--<el-table-column  prop="guid" label="唯一标识" min-width="250" align="center"></el-table-column>-->
       <el-table-column  prop="isLeaf" label="是否末级" min-width="150" align="center">
           <template slot-scope="scope">
              <div v-if="scope.row.isLeaf == '1'">是</div>
              <div v-else>否</div>
           </template>
       </el-table-column> 
     </el-table>
     </div>
      <!-- 新增、编辑弹框界面 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="500px" @close="cancel">
          <el-form :model="rformA" :rules="rules" ref="rformA" label-width="100px" class="demo-ruleForm">
             <el-form-item label="名称" prop="name">
                 <el-input v-model="rformA.name"></el-input>
             </el-form-item>
             <el-form-item label="地址" prop="uri">
                 <el-input v-model="rformA.uri"></el-input>
             </el-form-item>
             <el-form-item label="排序" prop="sort">
                 <el-input v-model="rformA.sort"></el-input>
             </el-form-item>
             <el-form-item label="公开" prop="overt">
                 <el-radio-group v-model="rformA.overt">
                   <el-radio label="1">是</el-radio>
                   <el-radio label="2">否</el-radio>
                 </el-radio-group>
             </el-form-item>
             <el-form-item label="是否显示" prop="inmenu">
                 <el-radio-group v-model="rformA.inmenu">
                   <el-radio label="1">是</el-radio>
                   <el-radio label="2">否</el-radio>
                 </el-radio-group>
             </el-form-item>
             <el-form-item label="末级" prop="isLeaf">
                 <el-radio-group v-model="rformA.isLeaf">
                   <el-radio label="1">是</el-radio>
                   <el-radio label="2">否</el-radio>
                 </el-radio-group>
             </el-form-item>
             <el-form-item label="备注" prop="remarks">
                 <el-input v-model="rformA.remarks"></el-input>
             </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="saveMenu('rformA')" class="confirm">确 定</el-button>
          </div>
      </el-dialog>
      <act-list :menuId="menuId" :variable="variable" :dialogType="dialogType"></act-list>
      <data-list :menuId="menuId" :variable="variable" :dialogType="dialogType"></data-list>
      </div>
   </div>
</template>

<script>
import {formatDate} from '../../../js/libs/publicMethod.js'
import '../../../../static/ztree/zTreeStyle/zTreeStyle.css'
import '../../../../static/ztree/jquery-1.4.4.min.js'
import '../../../../static/ztree/jquery.ztree.core.js'
import actList from './actList'
import dataList from './dataList'
export default {
  components:{
    "act-list":actList,
    "data-list":dataList,
  }, 
  data() { 
    return {
        dialogType:0,
        menuId:0,
        variable:0,
        setting: {
          async: {
              enable: true,
              url: this.GLOBAL.serverSrc + "/org/menu/api/ztreelist",
              autoParam: ["id", "name=n", "level=lv"],
              type: 'get',
              checkable: true,
              dataFilter: this.filter()
          },
          callback: {
            onClick: this.onNodeClick,
          }
        },
        zNodes: [],
        groupList: [],
        multipleSelection: [],   
        forbidden:true,         
        title:"",
        dialogFormVisible:false,
        showList:false,
        parentID:0,
        rformA: {
          id:0,
          name: "",
          uri: "",
          overt: "2",
          sort: "0",
          isLeaf: "2",
          remarks: "",
          inmenu:"1"
        },
        rules: {
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          uri: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
          overt: [{ required: true, message: '公开不能为空', trigger: 'blur' }],
          sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
          isLeaf: [{ required: true, message: '末级不能为空', trigger: 'blur' }],
        }
    }
  },
  mounted(){
    this.zTreeInit();
  },
  methods: {
      zTreeInit(){
          var ztree = $.fn.zTree.init($("#tree"), this.setting);
      },
      filter(treeId, parentNode, childNodes) {
          if (!childNodes) return null;
          for (var i = 0, l = childNodes.length; i < l; i++) {
              childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
          }
          return childNodes;
      },
      // 单击选中目录
      onNodeClick(e, treeId, treeNode) {
        if(treeNode.isParent === true){
          this.parentID = treeNode.id;
        }else{
          this.parentID = treeNode.parentID;       
        }
        this.menuList();         
      },
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
        this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.multipleTable.toggleRowSelection(row);
        this.menuId = this.multipleSelection[0].id;
      },
      rowClass({row, rowIndex}){ 
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      operation(i){
          this.variable++;
          this.dialogType = i;     
      },
      menuList(type){  
        this.$http.post(this.GLOBAL.serverSrc + '/org/menu/api/list',{
             "object": {
               "id": this.parentID,
              }
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.groupList=res.data.objects;
                   this.showList=true;
                   if(type==="add"){
                      var treeObj = $.fn.zTree.getZTreeObj("tree");
                      var selectedNode = treeObj.getSelectedNodes();
                      var newNode = this.groupList[this.groupList.length-1];
                      if(selectedNode.length > 0){
                        newNode = treeObj.addNodes(selectedNode[0], newNode);
                      }
                   }
                }else{
                   this.groupList=[];
                }
        })
      },
      delMenu(){ 
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
              this.$http.post(this.GLOBAL.serverSrc + '/org/menu/api/delete',{
                    "id": this.multipleSelection[0].id
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.$message.success("删除成功");
                         this.menuList();
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
      openMenu(index,title){  
        this.title=title;
        this.dialogFormVisible = true;
        if(index===2){
          this.getMenu(); 
        }
      },
      saveMenu(formName){ 
         if(this.title == "添加菜单"){
            this.insertMenu(formName,'/org/menu/api/insert','add');
         }else{
            this.insertMenu(formName,'/org/menu/api/save');
         }
      },
      getMenu(){  
        this.$http.post(this.GLOBAL.serverSrc + '/org/menu/api/get',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.rformA = data;
                 this.rformA.isLeaf += '';
                 this.rformA.overt += '';
              }
        }) 
      },
      insertMenu(formName,url,type){  
        this.$refs[formName].validate((valid) => {
          if(valid){
                   this.$http.post(this.GLOBAL.serverSrc + url,{
                     "object": {
                      "id": this.rformA.id,
                      "name": this.rformA.name,
                      "uri": this.rformA.uri,
                      "guid": "",
                      "createTime": 0,
                      "parentID": this.parentID,
                      "sort": this.rformA.sort,
                      "overt": this.rformA.overt,
                      "remarks": this.rformA.remarks,
                      "isLeaf": this.rformA.isLeaf,
                      "inmenu":this.rformA.inmenu
                    }
                  }).then(res => {
                      if(res.data.isSuccess == true){
                         this.menuList(type);
                         this.dialogFormVisible = false
                         this.$refs[formName].resetFields();
                      }else{
                         this.$message.success(res.data.result.message);
                         this.rformA.id=0;
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
$(document).ajaxSend(function(event, jqxhr, settings){
    jqxhr.setRequestHeader("Authorization",'Bearer ' + localStorage.getItem('token'));
})
</script>

<style scoped>
       .tree-list{float: left;margin-left: 20px}
       .table{border:1px solid #e6e6e6;width:800px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px;padding-bottom:30px}
       .el-table tr{background: #f6f6f6 !important}
       .button{margin:20px 0 0 8px}
       .button .el-button{border:1px solid #3095fa;color:#3095fa;width:80px;padding: 0;line-height: 35px}
       .el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
       .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: #f5f7fa !important}
       .confirm{margin:0 140px 0 20px}
       .demo-ruleForm{margin:20px}
       .demo-ruleForm .el-input{width:300px}
       /*ztree*/
       .ztree-bg{float: left;width: 220px;height:600px;margin-top: 20px;padding: 10px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;}
</style>
</style>
