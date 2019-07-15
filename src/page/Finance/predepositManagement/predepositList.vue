<template>
  <div>
     <div class="demo-input-suffix">
         <span class="search-title">客商名称</span>
         <el-input placeholder="请输入" v-model="customerName" class="el-input"></el-input>
         <span class="search-title">销售</span>
         <el-input placeholder="请输入" v-model="saler" class="el-input"></el-input>
         <el-button type="primary">搜索</el-button>
         <el-button type="primary">重置</el-button>
     </div>
     <el-button type="primary" class="add" plain @click="predepositSave(1)">添加</el-button>
     <!--list-->
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border>
       <el-table-column  prop="id" label="ID" min-width="60" align="center"></el-table-column>
       <el-table-column  prop="name" label="客商名称" min-width="220" align="center"></el-table-column>
       <el-table-column  prop="saler" label="销售" min-width="90" align="center"></el-table-column>
       <el-table-column  prop="card" label="储值卡卡号" min-width="200" align="center"></el-table-column>
       <el-table-column  prop="price" label="金额" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="price1" label="剩余金额" min-width="100" align="center"></el-table-column>
       <el-table-column  prop="time" label="创建时间" min-width="180" align="center"></el-table-column>
       <el-table-column  label="操作" min-width="130" align="center">
           <template slot-scope="scope">
              <span @click="predepositDetail(scope.row)" class="cursor">详情</span>
              <span>|</span>
              <span @click="predepositSave(2,scope.row)" class="cursor blue">编辑</span>
           </template> 
       </el-table-column>
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
          <el-form :model="depositForm" :rules="rules" ref="depositForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="功能名称" prop="name">
                 <el-input v-model="depositForm.name"></el-input>
             </el-form-item>
             <el-form-item label="销售" prop="uri">
                 <el-input v-model="depositForm.uri"></el-input>
             </el-form-item>
             <el-form-item label="所属上级" prop="parentID">
                 <el-input v-model="depositForm.parentID"></el-input>
             </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="save('depositForm')" class="confirm">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>

export default {
  components:{

  },
  data() {
    return {
      customerName:'',
      saler:'',
      //list
      groupList: [{
         id:1,
         name:'国旅',
         saler:'阳阳',
         card:'6225 7785 0274 8956',
         price:'123.00',
         price1:'123.00',
         time:'2019-12-12 12:23:23'
      }],
      pageSize: 10, // 设定默认分页每页显示数
      pageIndex: 1, // 设定当前页数
      total: 0,
      title:"",
      dialogFormVisible:false,
      depositForm: {
        name: "",
        uri: "",
        parentID: ""
      },
      type:1, //1添加，2编辑
      rules: {
          name: [{ required: true, message: '功能名称不能为空', trigger: 'blur' }],
          uri: [{ required: true, message: '页面地址不能为空', trigger: 'blur' }],
          parentID: [{ required: true, message: '唯一标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created(){

  },
  methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
       // this.getPage(1,val);
      },
      handleCurrentChange(val){
       // this.getPage(val,this.pageSize);
        this.pageIndex=val;
      },
      //添加编辑
      predepositSave(type,item){
        this.type=type;
        if(type==1){
          this.title="添加";
          this.dialogFormVisible = true;        
        }else{
          //查询数据

          this.title="编辑";
          this.dialogFormVisible = true;        
        }
      },
      cancel(){
        this.dialogFormVisible = false
        this.$refs["depositForm"].resetFields();
      },
      save(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            if(this.type==1){
               //添加保存方法
            }else{
               //编辑保存方法
            }
          }
        })
      }
   }
}
</script>

<style scoped>
    .demo-input-suffix{width: 900px}
    .el-input{width:250px;margin-right: 10px}
    .search-title{font-size: 14px;margin:0 10px}
    .search-but{margin:20px 10px;}
    .add{margin:35px 10px 20px 10px}
    /*list*/
    .table{border:1px solid #e6e6e6;width:1100px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin-left:10px}
    .pagination{text-align:center;margin:50px 0}
    .cursor{cursor: pointer}
    .blue{color: #2e94f9}
    .confirm{margin:0 140px 0 20px}
</style>