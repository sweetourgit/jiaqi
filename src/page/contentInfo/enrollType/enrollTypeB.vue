<template>
  <div class="enrollType">
    <el-row class="button">
       <el-button @click="addEnroll()">新增</el-button>
       <el-button @click="editEnroll()" :disabled="forbidden">编辑</el-button>
       <el-button @click="deleteEnroll()" :disabled="forbidden">删除</el-button>
    </el-row>
    <el-table :data="groupList" class="tableType" ref="multipleTable" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
       <el-table-column prop="id" fixed label="" type="selection" width="50" align="center"></el-table-column>
       <el-table-column label="ID"type="index" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="name" label="报名类型名称" min-width="120" align="center"></el-table-column>
     </el-table>
     <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
     <!--弹窗-->
     <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="500px" @close="cancel">
      <div style="float:left; line-height:40px; margin:0 10px 0 70px;">报名类型名称：</div>
      <el-form :model="rformA" ref="rformA" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="labelList">
         <el-input style="width:180px;" maxlength=40 v-model="rformA.name" placeholder="40个字以内"></el-input>
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
export default {
  data() {
    return {
      forbidden:true,  
      groupList:[],
      multipleSelection: [],
      currentPage: 1,
      total:0,
      pagesize:10,
      title:"",
      dialogFormVisible:false,
      rformA: {//编辑添加列表input
        name: ""
      },
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
    handleSizeChange(page) {
      this.currentPage = 1;
      this.pagesize = page;
      this.pageList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.pageList();
    },
    addEnroll(){
      this.title="添加报名类型";
      this.dialogFormVisible = true;
    },
    editEnroll(){
      this.getEnroll();
      this.title="编辑报名类型";
      this.dialogFormVisible = true;
    },
    cancel(){
      this.dialogFormVisible = false;
      this.$refs["rformA"].resetFields();4
    },
    saveModule(formName){ //判断显示编辑或者添加弹窗
       if(this.title == "添加报名类型"){
          this.addEnrollType(formName);
       }else{
          this.editEnrollType(formName);
       }
    },
    getEnroll(){//获取一条信息
      this.$http.post(this.GLOBAL.serverSrc + '/universal/enrollb/api/get',{
         "id":this.multipleSelection[0].id
        }).then(res => {
            if(res.data.isSuccess == true){
               let data = res.data.object;
               this.rformA.name=data.name;
            }
      }) 
    },
    addEnrollType(formName){//添加一条报名类型
      this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/enrollb/api/insert",
              {
                object: {
                  "id": 0,
                  "isDeleted": 0,
                  "name": this.rformA.name,
                  "createTime": 0
                }
              })
              .then(res => {
                if(res.data.isSuccess == true){
                   this.pageList();
                   this.dialogFormVisible = false
                   this.$refs[formName].resetFields();
                }else{
                   this.$message.success("添加失败");
                }
            })
          } else {
            return false;
          }
        });
    },
    editEnrollType(formName){//编辑一条报名类型
      var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/enrollb/api/save",
          {
            "object": {
              "id": this.multipleSelection[0].id,
              "isDeleted": 0,
              "name": this.rformA.name,
              "createTime": 0
            }
          },
        )
        .then(res => {
          if(res.data.isSuccess == true){                
            this.pageList();
            this.dialogFormVisible = false
            this.$refs[formName].resetFields();
          }else{
            this.$message.success(res.data.result.message);
          }
        })
        .catch(function (obj) {
          console.log(obj)
        })
    },
    deleteEnroll(){//删除一条报名信息
      this.$confirm("确认删除?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      })
      .then(() => {
        this.$http.post(this.GLOBAL.serverSrc + '/universal/enrollb/api/delete',{
          "id": this.multipleSelection[0].id
        })
        .then(res => {
          if(res.data.isSuccess == true){
             this.$message.success("删除成功");
             this.pageList();
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
    pageList() {//查询表格
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/universal/enrollb/api/page",
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
.enrollType{ margin: 0 0 60px 0; }
.tableType{width: 500px; margin: 20px 0 20px 0;}
       
</style>
</style>
