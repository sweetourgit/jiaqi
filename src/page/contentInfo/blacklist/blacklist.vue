<template>
  <div>
     <el-row class="button">
       <el-button @click="addBlackList()">新增</el-button>
       <el-button :disabled="forbidden" @click="editBlackList()">编辑</el-button>
       <el-button :disabled="forbidden" @click="deleteLabel">删除</el-button>
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
     <!--添加、编辑黑名单弹窗-->
      <el-dialog :title="title"  :visible.sync="dialogFormVisible" width="500px" center custom-class="city_list" @close="cancel">
        <el-form :model="rformA" label-width="100px" :rules="rules" ref="rformA">
          <el-form-item label="黑名单名称"  prop="name" class="addContact_span">
            <el-input v-model="rformA.name" auto-complete="off" class="addContact_name" placeholder="请输入黑名单名称"></el-input>
          </el-form-item>
          <el-form-item label="联系电话"  prop="mobile" class="addContact_span">
            <el-input v-model="rformA.mobile" auto-complete="off" class="addContact_name" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="身份证号"  prop="idCard" class="addContact_span">
            <el-input v-model="rformA.idCard" auto-complete="off" class="addContact_name" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="护照"  prop="passport" class="addContact_span">
            <el-input v-model="rformA.passport" auto-complete="off" class="addContact_name" placeholder="请输入护照"></el-input>
          </el-form-item>
          <el-form-item label="来源"  prop="source" class="addContact_span">
            <el-input v-model="rformA.source" auto-complete="off" class="addContact_name" placeholder="请输入来源"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" class="addContact_span">
            <el-select v-model="rformA.sex" placeholder="请选择性别" class="addContact_name">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原因"  prop="reason" class="addContact_span">
            <el-select v-model="rformA.reason" placeholder="请选择原因" class="addContact_name">
              <el-option label="未选择" value="0"></el-option>
              <el-option label="游客恶意报名" value="1"></el-option>
              <el-option label="同业恶意下单" value="2"></el-option>
              <el-option label="同业恶意占位" value="3"></el-option>
              <el-option label="游客黑名单" value="4"></el-option>
              <el-option label="同业黑名单" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市"  prop="cityID" class="addContact_span">
            <el-input v-model="rformA.cityID" auto-complete="off" class="addContact_name" placeholder="请输入城市"></el-input>
          </el-form-item>
          <el-form-item label="备注"  prop="mark" class="addContact_span">
            <el-input v-model="rformA.mark" auto-complete="off" class="addContact_name" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="saveModule('rformA')">保 存</el-button>
        </span>
      </el-dialog>

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
        dialogFormVisible:false,
        rformA: {//编辑添加列表input
          name: "",
          mobile:"",
          idCard:"",
          passport:"",
          source:"",
          sex:"",
          reason:"",
          cityID:"",
          mark:""
        },
        rules:{
          name:[{ required: true, message: '不能为空', trigger: 'blur' }],
          mobile:[{ required: true, message: '不能为空', trigger: 'blur' },
                  { pattern: /^1(3|4|5|7|8)\d{9}$/,message:'请输入11位正确的手机号码' }],
          idCard:[{ required: true, message: '不能为空', trigger: 'blur' }],
          passport:[{ required: true, message: '不能为空', trigger: 'blur' }],
          source:[{ required: true, message: '不能为空', trigger: 'blur' }],
          sex:[{ required: true, message: '不能为空', trigger: 'blur' }],
          reason:[{ required: true, message: '不能为空', trigger: 'blur' }],
          cityID:[{ required: true, message: '不能为空', trigger: 'blur' }],
          //mark:[{ required: true, message: '不能为空', trigger: 'blur' }]
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
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        //this.moduleList();
      },
      handleCurrentChange(val){
        this.pageIndex = val;
        //this.moduleList();
      },
      //添加、编辑列表弹窗
      saveModule(formName){ //判断显示编辑或者添加弹窗
         if(this.title == "添加黑名单"){
            this.addLabelTheme(formName);
         }else{
            this.editLabelTheme(formName);
         }
      },
      addBlackList(){//点击添加列表按钮
        this.title="添加黑名单";
        this.dialogFormVisible = true;
      },
      editBlackList(){//点击编辑列表按钮
        this.getLabel();
        this.title="编辑黑名单";
        this.dialogFormVisible = true;
      },
      cancel(){
        this.dialogFormVisible = false;
        this.$refs["rformA"].resetFields();4
      },
      getLabel(){//获取一条信息
        this.$http.post(this.GLOBAL.serverSrc + '/order/blacklist/api/get',{
           "id":this.multipleSelection[0].id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 this.rformA.name=data.name;
                 this.rformA.mobile=data.mobile;
                 this.rformA.idCard=data.idCard;
                 this.rformA.passport=data.passport;
                 this.rformA.source=data.source;
                 this.rformA.sex=data.sex;
                 this.rformA.reason=data.reason;
                 this.rformA.cityID=data.cityID;
                 this.rformA.mark=data.mark;
              }
        }) 
      },
      //添加黑名单
      addLabelTheme(formName){//添加一条列表
         this.$refs[formName].validate((valid) => {
          if (valid) {
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/order/blacklist/api/insert",
              {
                object: {
                  "id": 0,
                  "isDeleted": 0,
                  "name": this.rformA.name,
                  "mobile": this.rformA.mobile,
                  "idCard": this.rformA.idCard,
                  "passport": this.rformA.passport,
                  "source": this.rformA.source,
                  "sex": this.rformA.sex,
                  "reason": this.rformA.reason,
                  "cityID": this.rformA.cityID,
                  "mark": this.rformA.mark,
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
      //编辑黑名单
      editLabelTheme(formName){
        var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/order/blacklist/api/save",
            {
              "object": {
                "id": this.multipleSelection[0].id,
                "isDeleted": 0,
                "name": this.rformA.name,
                "mobile": this.rformA.mobile,
                "idCard": this.rformA.idCard,
                "passport": this.rformA.passport,
                "source": this.rformA.source,
                "sex": this.rformA.sex,
                "reason": this.rformA.reason,
                "cityID": this.rformA.cityID,
                "mark": this.rformA.mark,
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
      //删除黑名单
      deleteLabel(){
        this.$confirm("确认删除?", "提示", {
           confirmButtonText: "确定",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
          this.$http.post(this.GLOBAL.serverSrc + '/order/blacklist/api/delete',{
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
            that.groupList.forEach(function (v,k,arr) {
              if(arr[k]['sex'] == 0){
                arr[k]['sex'] = '男'
              }else if(arr[k]['sex'] == 1) {
                arr[k]['sex'] = '女'
              }
              if(arr[k]['reason'] == 0){
                arr[k]['reason'] = '未选择'
              }else if(arr[k]['reason'] == 1) {
                arr[k]['reason'] = '游客恶意报名'
              }else if(arr[k]['reason'] == 2) {
                arr[k]['reason'] = '同业恶意下单'
              }else if(arr[k]['reason'] == 3) {
                arr[k]['reason'] = '同业恶意占位'
              }else if(arr[k]['reason'] == 4) {
                arr[k]['reason'] = '游客黑名单'
              }else if(arr[k]['reason'] == 5) {
                arr[k]['reason'] = '同业黑名单'
              }
              
            })
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
       .addBlackList{width: 200px; float:left;}
       .addContact_span{ margin-left:15px; }
       .addContact_name{ width:200px; }
</style>
</style>
