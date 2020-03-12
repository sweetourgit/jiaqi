<template>
  <div>
       <!-- 用户授权 -->
        <el-dialog title="用户授权" custom-class="city_list" :visible.sync="dialogFormUser" width="1000px" class="abow_dialog" @close="cenclePer">
        <div :style="authDiocss">
          <div class="ztree-bg">
             <ul id="tree" class="ztree"></ul>
          </div>
          <div class="tree-list">
            <div v-if="showList">
              <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
                 <el-table-column  type="selection" align="center"></el-table-column>
                 <el-table-column  prop="id" label="ID" min-width="100" align="center"></el-table-column>
                 <el-table-column  prop="name" label="姓名" min-width="120" align="center"></el-table-column>
                 <el-table-column  prop="uri" label="职位" min-width="200" align="center"></el-table-column>
                 <el-table-column  prop="sexCN" label="性别" min-width="100" align="center"></el-table-column> 
              </el-table>
              <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="cenclePer">取消</el-button>
                <el-button type="primary" @click="perSubmit">确 定</el-button>
              </div>
            </div>
          </div>
        </div> 
      </el-dialog>
  </div>
</template>

<script>
import {formatDate} from '../../../js/libs/publicMethod.js'
import '../../../../static/ztree/zTreeStyle/zTreeStyle.css'
import '../../../../static/ztree/jquery-1.4.4.min.js'
import '../../../../static/ztree/jquery.ztree.core.js'
export default {
  props:{
    roleId:0,
    variable:0,
    dialogType:0
  },
  data() {
    return {
       authDiocss:{
　　　　　　height:'',
            overflowY:'scroll'
　　　 },
       dialogFormUser:false,
       showList:false,
       setting: {
          async: {
              enable: true,
              url: this.GLOBAL.serverSrc + "/org/dept/api/ztreelist",
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
    }
  },
  watch: {
      variable:function(){        
        if(this.dialogType==2){
          this.getHeight();
          setTimeout(()=>{
            this.zTreeInit();
          })
          this.dialogFormUser=true;    
        }
     } 
  },
  methods: {
      cenclePer(){
         this.dialogFormUser = false;
      },
      getHeight(){
        this.authDiocss.height=document.body.clientHeight-200+"px";
      },
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
        if(!treeNode.isParent === true){
          this.parentID = treeNode.id;
          this.menuList();         
        } 
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      changeFun(val) {  //保存选中项的数据
        this.multipleSelection=val;
        console.log(val);
      },
      clickRow(row){    //选中行复选框勾选
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      menuList(type){  //获取菜单列表
        this.$http.post(this.GLOBAL.serverSrc + '/org/api/userlistwithorg',{
               "id": this.parentID,
            }).then(res => {
                this.groupList=[];
                if(res.data.isSuccess == true){
                   this.groupList=res.data.objects;
                   this.showList=true;
                }
        })
      },
      perSubmit(){

      }








    }
}
$(document).ajaxSend(function(event, jqxhr, settings){
    jqxhr.setRequestHeader("Authorization",'Bearer ' + localStorage.getItem('token'));
})
</script>

<style scoped>
     .abow_dialog {margin:-100px 0 0 0}
     .tree-list{float: left;margin-left: 20px}
     .table{border:1px solid #e6e6e6;width:630px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 30px 8px}
     .ztree-bg{float: left;width: 220px;height:600px;margin:20px 0 0 10px;padding: 10px;border:1px solid #fff;box-shadow:3px 3px 3px #EDEDED,3px -3px 3px #EDEDED,-3px 3px 3px #EDEDED,-3px -3px 3px #EDEDED;overflow:scroll;overflow-x:hidden}
</style>