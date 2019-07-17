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
     <el-table :data="groupList" ref="multipleTable1" class="table" :header-cell-style="getRowClass" border>
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
      <el-dialog :title="title" :visible.sync="dialogFormVisible" class="city_list" width="850px" @close="cancel">
          <el-form :model="depositForm" :rules="rules" ref="depositForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="客商名称" prop="name">
                 <el-input v-model="depositForm.name" placeholder="请输入"></el-input>
             </el-form-item>
             <el-form-item label="销售" prop="saler">
                 <el-input v-model="depositForm.saler" placeholder="请输入"></el-input>
             </el-form-item>
             <el-form-item label="金额" prop="price">
                 <el-input v-model="depositForm.price" placeholder="请输入"></el-input>
             </el-form-item>
             <el-form-item label="收款方式" prop="recType">
                 <el-radio-group v-model="depositForm.recType">
                   <el-radio label="1" class="radiomar">账号收款</el-radio>
                   <el-radio label="2" class="radiomar">现金收款</el-radio>
                 </el-radio-group>
             </el-form-item>
             <el-form-item label="收款账户" prop="account" v-if="depositForm.recType==1">
                 <el-input v-model="accountNo" placeholder="请输入收款账号" class="w190" :disabled="true"></el-input>
                 <el-input v-model="accountName" placeholder="请输入开户名" class="w190" :disabled="true"></el-input>
                 <el-input v-model="accountBank" placeholder="请输入开户行" class="w190" :disabled="true"></el-input>
                 <el-button type="primary" @click="choose">选择</el-button><br/>
                 <span class="card-tips" v-show="accountTips">请选择收款账户</span>
             </el-form-item>
             <el-form-item label="储值卡" prop="cardType">
                 <el-radio-group v-model="depositForm.cardType">
                   <el-radio label="1" class="radiomar">无</el-radio>
                   <el-radio label="2" class="radiomar">有</el-radio>
                 </el-radio-group>
                 <el-input v-model="depositForm.cardNo" :disabled="depositForm.cardType==1" placeholder="请输入储值卡号" class="w190" style="margin-left:10px"></el-input>
                 <span class="card-tips" v-show="cardTips">请填写储值卡号</span>
             </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="save('depositForm')" class="confirm">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 银行账户弹窗 -->
      <el-dialog title="选择收款账户" :visible.sync="accountFormVisible" class="city_list" width="850px" @close="cancelChoose">
         <el-table :data="collectionaccount" ref="multipleTable" class="tableAccount" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
           <el-table-column label="类型" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.cardType===1">收款</span>
                <span v-if="scope.row.cardType===2">付款</span>
                <span v-if="scope.row.cardType===3">应收</span>
                <span v-if="scope.row.cardType===4">应付</span>
              </template>
           </el-table-column>
           <el-table-column  prop="title" label="账号名称" min-width="150" align="center"></el-table-column>
           <el-table-column  prop="cardNum" label="卡号" min-width="150" align="center"></el-table-column>
           <el-table-column  prop="openingBank" label="开户行" min-width="150" align="center"></el-table-column>
           <el-table-column  prop="openingName" label="开户人" min-width="80" align="center"></el-table-column>
         </el-table>
         <div class="footer">
            <el-button @click="cancelChoose">取 消</el-button>
            <el-button type="primary" @click="chooseAccount" class="confirm">确 定</el-button>
         </div>
      </el-dialog>
      <predeposit-detail :predepositId="predepositId" :variable="variable"></predeposit-detail>
  </div>
</template>

<script>
import predepositDetail from './predepositDetail';
export default {
  components:{
      "predeposit-detail":predepositDetail
  },
  data() {
    return {
      predepositId:0,
      variable:0, //设置一个变量展示弹窗
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
      //编辑添加弹窗
      accountTips:false,
      title:"",
      dialogFormVisible:false,
      accountNo:'',
      accountName:'',
      accountBank:'',
      cardTips:false,
      depositForm: {
        name: '',
        saler: '',
        price: '',
        recType:'1',
        account:0,
        cardType:'1',
        cardNo:'',
      },
      type:1, //1添加，2编辑
      //银行账户弹窗
      accountFormVisible:false,
      collectionaccount:[],
      multipleSelection:[],
      rules: {
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          saler: [{ required: true, message: '不能为空', trigger: 'blur' }],
          price: [{ required: true, message: '不能为空', trigger: 'blur' }],
          recType: [{ required: true, message: '收款方式不能为空', trigger: 'blur' }],
          account: [{ required: true, message: '请选择收款账户', trigger: 'change' }],
          cardType: [{ required: true, message: '请填写储值卡号', trigger: 'blur' }],
      }
    }
  },
  created(){ 
  },
  methods: {
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
          this.accountNo='';
          this.accountName='';
          this.accountBank='';
          this.depositForm.account=0;
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
      },
      choose(){
        this.accountFormVisible=true;
        this.getData();
      },
      //银行账户弹窗
      cancelChoose(){
        this.multipleSelection=[];
        this.accountFormVisible=false;
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
      getData(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/collectionaccount/api/list',{
        "object": {}
      }).then(res => {
          this.collectionaccount = res.data.objects;
      })
    },
    chooseAccount(){
      this.accountNo=this.multipleSelection[0].title;
      this.accountName=this.multipleSelection[0].openingName;
      this.accountBank=this.multipleSelection[0].openingBank;
      this.depositForm.account=this.multipleSelection[0].id;
      this.accountFormVisible=false;
    },
    predepositDetail(item){
      this.predepositId = item.id;
      this.variable++;
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
    /*添加弹窗*/
    .w190{width: 190px}
    .card-tips{position:absolute;font-size: 12px;color: red}
    .dialog-footer{text-align: left;margin:20px 0 20px 310px}
    .footer{text-align: right;margin:20px -130px 0px 10px}
    .tableAccount{border:1px solid #e6e6e6;width:790px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin-left:10px}
</style>