<template>
  <div>
    <el-dialog title="申请发票管理" :visible="dialogFormVisible"    style="margin:-80px 0 0 0;" width=1100px :show-close="false" custom-class="city_list" class="addReceivables" @close="closeAdd()">
      <div class="cancel">
        <el-button class="ml13" @click="closeAdd()">取 消</el-button>
        <el-button class="ml13" type="primary" @click="closeApply(ruleForm)" :loading="loadingbut">{{loadingbuttext}}</el-button>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm invoice">
        <div class="fl w500">
          <el-form-item label="单位/个人：" prop="unitPersonal">
            <el-radio v-model="ruleForm.unitPersonal" label="1">个人</el-radio>
            <el-radio v-model="ruleForm.unitPersonal" label="2">单位</el-radio>
          </el-form-item>
          <el-form-item label="发票抬头：" prop="invoiceTitle">
            <el-input v-model="ruleForm.invoiceTitle" class="Words" placeholder="请输入发票抬头"></el-input>
            <span class="Numbers">{{ruleForm.invoiceTitle.length}}/80字</span>
          </el-form-item>
          <el-form-item label="纳税人识别号：" prop="taxpayerNumber">
            <el-input v-model="ruleForm.taxpayerNumber" class="Words" placeholder="请输入发票抬头"></el-input>
            <span class="Numbers">{{ruleForm.taxpayerNumber.length}}/40字</span>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="ruleForm.phone" class="Words" placeholder="请输入发票抬头"></el-input>
            <span class="Numbers">{{ruleForm.phone.length}}/20字</span>
          </el-form-item>
          <el-form-item label="账号：" prop="account">
            <el-input v-model="ruleForm.account" class="Words" placeholder="请输入发票抬头"></el-input>
            <span class="Numbers">{{ruleForm.account.length}}/40字</span>
          </el-form-item>
        </div>
        <div class="fl w500">
          <el-form-item label="开户行：" prop="partCardBank">
            <el-input v-model="ruleForm.partCardBank" class="Words" placeholder="请输入开户行"></el-input>
            <span class="Numbers">{{ruleForm.partCardBank.length}}/80字</span>
          </el-form-item>
          <el-form-item label="地址：" prop="address">
            <el-input v-model="ruleForm.address" class="Words" placeholder="请输入地址"></el-input>
            <span class="Numbers">{{ruleForm.address.length}}/80字</span>
          </el-form-item>
          <el-form-item label="开票金额：" prop="invoicePrice">
            <el-input v-model="ruleForm.invoicePrice" class="Words" placeholder="请输入开票金额"></el-input>
          </el-form-item>
          <el-form-item label="发票类型：" prop="invoiceType">
            <el-select v-model="ruleForm.invoiceType" placeholder="请输入发票类型" :disabled="forbidden">
              <el-option v-for="item in invoiceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票项目：" prop="invoiceProject">
            <el-select v-model="ruleForm.invoiceProject" placeholder="请输入发票项目" :disabled="forbidden">
              <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-button class="addorderbutton" type="primary" @click="addOrderopen()">添加订单</el-button>
        <div class="associated">
          <div class="warning"><i class="el-icon-warning"></i></div>
          <div class="fl ml13">已关联<span class="relateditems">{{tableDate.length}}</span>项</div>
          <div class="aggregate">总计:<span class="mr5">{{ residuePD | numFilter}}</span>元</div>
        </div>
        <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="orderCode" label="订单ID" align="center"></el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="source" label="订单来源" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="createTime" label="下单日期" align="center">
             <template slot-scope="scope">
                <div v-if="scope.row.createTime !='0'">{{formatDate(new Date(scope.row.createTime))}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="yfje" label="已付金额" align="center"></el-table-column>
          <el-table-column prop="syje" label="剩余开票金额" align="center"></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
    <!--添加订单弹窗-->
    <el-dialog title="添加订单" :visible="addOrderShow" style="margin:-80px 0 0 0;" width=1100px :show-close="false" custom-class="city_list" class="addReceivables" @close="closeOrderShow()">
      <div class="cancel">
        <el-button class="ml13" @click="closeOrderShow()">取 消</el-button>
        <el-button class="ml13" @click="closeOrderadd()" type="primary">添 加</el-button>
      </div>
      <div class="search">
        <div style="margin:15px 0 15px 0;">
          <span class="search-title">订单ID</span>
          <el-input placeholder="请输入" v-model="orderID" class="group-no" style="width:200px;"></el-input> 
          <span class="search-title">商户名称</span>
          <el-input placeholder="请输入" v-model="merchantsName" class="group-no" style="width:200px;"></el-input>
          <span class="search-title">收款单号</span>
          <el-input placeholder="请输入" v-model="collectionNumber" class="group-no" style="width:200px;"></el-input>
          <el-button class="ml13" type="primary" @click="orderSearch()">搜 索</el-button>
          <el-button class="ml13" type="primary" @click="orderReset()">重 置</el-button>
        </div>
      </div>
      <div v-if="find==1" class="one">
          <el-button class="mt10" type="primary" @click="allChoose()">全 选</el-button>
          <el-button class="mt10" @click="cancelChoose()">清除选择</el-button>
          <div class="addassociated">
            <div class="warning"><i class="el-icon-warning"></i></div>
            <div class="fl ml13">已关联<span class="relateditems">{{nape}}</span>项</div>
            <div class="aggregate">剩余开票金额:<span class="mr5">{{ residuePrice | numFilter}}</span>元</div>
          </div>
          <el-table :data="addOrderTable" ref="multipleTable" class="ordertable" :header-cell-style="getRowClass" border :cell-style="getCellClass" @row-click="clickRow" @selection-change="changeFun" :row-style="rowClass">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="orderCode" label="订单ID" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="source" label="订单来源" align="center"></el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
            <el-table-column prop="createTime" label="下单日期" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.createTime !='0'">{{formatDate(new Date(scope.row.createTime))}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="yfje" label="已付金额" align="center"></el-table-column>
            <el-table-column prop="syje" label="剩余开票金额" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="choose(scope.$index)" v-if="scope.row.choose ==false">选择</el-button>
                <span v-if="scope.row.choose ==true">
                  <span class="blue">已选</span>
                  <span class="em">|</span>
                  <el-button type="text" @click="undo(scope.$index)">撤销</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
   name: "addInvoiceApply",
   components: {},
   props: {
      variableInvoice:0,
   },
  data() {
    return {
      dialogFormVisible :false,
      ruleForm:{
        unitPersonal:'1', // 单位/个人
        invoiceTitle:'', //发票抬头
        taxpayerNumber:'', // 纳税人识别号
        phone:'', // 手机号
        account:'', // 账号
        partCardBank:'', // 开户行
        address:'', // 地址
        invoicePrice:'', // 开票金额
        invoiceType:'1', // 发票类型
        invoiceProject:'1', // 发票项目
      },
      invoiceTypeList:[{ // 发票类型
        value: '1',
        label: '纸质发票'
      }],
      projectList:[{ // 发票项目
        value: '1',
        label: '旅游费'
      }],
      rules:{
        invoiceTitle:[
          { required: true, message: '请输入发票抬头', trigger: 'change' },
          { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        taxpayerNumber:[
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        phone:[
          { min: 1, max: 20, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        account:[
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        partCardBank:[
          { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        address:[
          { min: 1, max: 80, message: '长度在 1 到 80 个字符', trigger: 'change' }
        ],
        invoicePrice:[
          { required: true, message: '请输入开票金额', trigger: 'change' },
        ],
      },
      forbidden: true,
      tableDate:[],
      tableDatebox:[],
      addOrderShow:false, // 添加订单弹窗
      find:0,//没内容隐藏
      orderID:'', // 添加订单中订单ID
      merchantsName:'', // 添加订单中商户名称
      collectionNumber:'', // 添加订单中收款单号
      multipleSelection: [],   //选中的list
      addOrderTable:[],
      newtabledate:[],
      collectionID:'',
      nape:0,
      residuePrice:0, // 获取添加订单剩余开票金额总和
      residuePD:0,//选择后的总价格
      loadingbut:false,//审核提交加载中
	    loadingbuttext:'申 请',
    };
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    formatDate01: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD')
    }
  },
  watch: {
    variableInvoice:function(){        
      this.dialogFormVisible=true; 
    },
  },
  created() {
  },
  methods: {
    formatDate(date) {//时间转化
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();  
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    rowClass({row, rowIndex}){  //选中行样式改变
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].collectionID==row.collectionID){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    changeFun(val) {
      //保存选中项的数据
      this.multipleSelection = val;
    },
    clickRow(row) {//选中行复选框勾选
      this.$refs.multipleTable.toggleRowSelection(row);
      let arr = {} ;
      
      },
    closeAdd(){
      this.dialogFormVisible = false;
      this.residuePrice = 0 ;
      this.residuePD = 0 ;
      this.tableDate = [];
      this.ruleNull();
      this.$parent.pageList();
       
    },
    ruleNull(){ // 清空内容
            this.ruleForm= {
                  unitPersonal:'1', // 单位/个人
                  invoiceTitle:'', //发票抬头
                  taxpayerNumber:'', // 纳税人识别号
                  phone:'', // 手机号
                  account:'', // 账号
                  partCardBank:'', // 开户行
                  address:'', // 地址
                  invoicePrice:'', // 开票金额
                  invoiceType:'1', // 发票类型
                  invoiceProject:'1', // 发票项目
                  }
    },
    closeApply(ruleForm){
        let myDate = new Date();
        let mydatas = moment(myDate).format("YYYY-MM-DD HH:mm:ss");
       for(let i in this.tableDate){
         // let cTime = moment(this.tableDate[i].createTime).format("YYYY-MM-DD HH:mm:ss");
        //  this.tableDate[i].createTime = cTime
         this.newtabledate.push({
            "orid":this.tableDate[i].orid,
            "orderCode": this.tableDate[i].orderCode,
            "collectionID": this.tableDate[i].collectionID,
            "productName": this.tableDate[i].productName,
            "source": this.tableDate[i].source,
            "planID": this.tableDate[i].planID,
            "createTime": this.tableDate[i].createTime,
            "yfje": this.tableDate[i].yfje,
            "syje": this.tableDate[i].syje,
            "collectionType": this.tableDate[i].collectionType
          })
         }
          if(ruleForm.invoicePrice > this.residuePD ){
                    this.$message({
                      type: "warning",
                      message: "申请开发票金额大于剩余金额 重新填写开票金额"
                      }); 
                      return;
            }
            this.loadingbut = true;
				    this.loadingbuttext = '申请中...';
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/insertapplicationreceipt",{
        "object": {
          "receipt":{
                "createTime":mydatas,
                "invoiceType":ruleForm.unitPersonal,//单位个人
                "invoiceID":ruleForm.invoiceType,//发票类型
                "taxpayerIDNumber":ruleForm.taxpayerNumber,//纳税人识别号
                "invoiceHeader":ruleForm.invoiceTitle,//发票抬头
                "tel":ruleForm.phone,//手机号
                "invoiceItem":ruleForm.invoiceProject,//发票项目
                "invoicePrice":ruleForm.invoicePrice,//发票金额
                "cardNumber":ruleForm.account,//账号
                "bankName":ruleForm.partCardBank,//开户行
                "address":ruleForm.address,//地址
                "userCode":sessionStorage.getItem('userCode'),//申请人
                "cosList":this.newtabledate,//关联订单
                "receiptType":2,//发票申请
                },
            "cosList":this.newtabledate
         
        },
      }).then(res => {
            if(res.data.isSuccess == true){
                   this.$message.success("申请成功");
                    this.dialogFormVisible = false;
                    this.residuePrice = 0 ;
                    this.residuePD = 0 ;
                    this.tableDate = [];
                    this.newtabledate = [];
                    this.ruleNull();
                    this.$parent.pageList();
                    this.loadingbut = false;
				            this.loadingbuttext = '申 请';

              }else if(res.data.isSuccess == false){
                  this.$message({
                        type: "warning",
                        message: res.data.result.message
                        }); 
              }
         
        })
        .catch(function (res) {
          console.log(res)
        })
    },
    addOrder(orderCode = this.orderID , localCompName = this.merchantsName,collectionID = this.collectionNumber){
     
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/collection_orderRoot_search",{
        "object": {
          "orderCode":this.orderID,
          "localCompName":this.merchantsName,
          "collectionID":this.collectionNumber == "" ? 0 : this.collectionNumber,
        },
      }).then(res => {
          this.addOrderTable = res.data.objects;
          for( var i = 0 ; i < this.addOrderTable.length ; i ++){
             this.addOrderTable[i].choose=false
          }
        })
        .catch(function (res) {
          console.log(res)
        })
    },
    addOrderopen(){
      this.addOrderShow = true;
   },
    orderSearch(){ // 添加订单搜索
      this.addOrder();
       this.find = 1;
    },
    orderReset(){ // 添加订单重置
      this.orderID = '';
      this.merchantsName = '';
      this.collectionNumber = '';
      this.addOrder();
      this.find = 0;
    },
    allChoose(row){ // 添加订单全选
      let arr = [...this.addOrderTable];
      for( var i = 0 ; i < arr.length ; i ++){
        arr[i].choose=true;
      }
      this.addOrderTable = arr ;
      this.nape = arr.length;
      this.price();
    },
    cancelChoose(){ // 添加订单取消全选
      let arr = [...this.addOrderTable];
      for( var i = 0 ; i < arr.length ; i ++){
        arr[i].choose=false;
      }
      this.addOrderTable = arr ;
      this.nape = 0;
      this.price();
    },
    napeNumber(){ // 添加订单选择获取几项数据
      let count = 0;
      for( var i = 0 ; i < this.addOrderTable.length ; i ++){
        if(this.addOrderTable[i].choose==true){
          count ++;
        }
      }
      this.nape = count;
    },
    price(){ // 添加订单获取剩余开票金额总和
      this.residuePrice = 0 ;
      for( var i = 0 ; i < this.addOrderTable.length ; i ++){
        if(this.addOrderTable[i].choose==true){
          this.residuePrice += Number(this.addOrderTable[i].syje);
        }
      }
    },
    choose(index){
      this.addOrderTable[index].choose=true;
      this.napeNumber();
      this.price();
      this.tableDatebox=[];
      for( var i in this.addOrderTable){
        if(this.addOrderTable[i].choose == true){
          this.tableDatebox.push(this.addOrderTable[i]);
         }
       }
          
          
    },
    undo(index){
      this.tableDatebox=[];
      this.addOrderTable[index].choose=false;
      this.napeNumber();
      this.price();
       for( var i in this.addOrderTable){
          if(this.addOrderTable[i].choose == true){
             this.tableDatebox.push(this.addOrderTable[i]);
           }
       }
      
    },
    price_ed(){ // 添加订单获取剩余开票金额总和
      this.residuePD = 0 ;
      for( var i = 0 ; i < this.tableDate.length ; i ++){
           this.residuePD += Number(this.tableDate[i].syje);
      }
    },
    closeOrderShow(){ // 关闭添加订单弹窗
      this.addOrderShow = false;
      this.residuePrice = 0 ;
      this.newtabledate = [];
      this.orderID = '';
      this.merchantsName = '';
      this.collectionNumber = '';
      this.addOrderTable = [] ;
      this.nape= 0 ;
    },
    closeOrderadd(){// 确认添加订单
    if(this.tableDate.length == 0 ){
       this.tableDate =  this.tableDatebox;
        this.addOrderShow = false;
        this.orderID = '';
        this.merchantsName = '';
        this.collectionNumber = '';
        this.addOrderTable = [] ;
        this.price_ed();
     }else{
       for(let j in this.tableDate){
             for(let i in this.tableDatebox){
              if(this.tableDate[j].orid == this.tableDatebox[i].orid){
                 this.tableDatebox=[];
                 this.$message({
                      type: "warning",
                      message: "存在以添加的订单，请重新选择"
                      }); 
                     return false;
              }else if(this.tableDatebox[i].syje == 0){
                 this.tableDatebox=[];
                 this.$message({
                        type: "warning",
                        message: "选择订单剩余开票金额为0，请重新选择"
                        }); 
                      return false;
              } 
         
          }
      }
                  for(let i in this.tableDatebox){
                    this.tableDate.push(this.tableDatebox[i]);
                        this.$message({
                                  type: "success",
                                  message: "添加成功"
                                  });
                  }
                   
                  this.addOrderShow = false;
                  this.orderID = '';
                  this.merchantsName = '';
                  this.collectionNumber = '';
                  this.addOrderTable = [] ;
                  this.price_ed();
    }
     
      
       

    },
    
  }
};
</script>

<style scoped lang="scss">
.fl{float:left}
.cancel{float:right; margin: -77px 0 0 0;}
.ml13{margin:0 0 0 13px;}
.mr5{margin:0 5px 0 5px;}
.invoice{overflow: hidden;}
.w500{width:500px}
.mt10{margin:10px 15px 0 0;}
.Words{width:200px;}
.Numbers{margin:0 0 0 10px;}
.addorderbutton{margin:10px 0 0 13px;}
.associated{background: #e6f3fc;border: 1px solid #d5f0fc; line-height: 30px; border-radius: 5px;overflow: hidden;margin: 15px 0 0 13px;width:1039px}
.warning{float: left;color: #108ee9;margin: 0 0 0 15px;font-size: 16px;}
.aggregate{margin: 0 0 0 15px;float: left;}
.relateditems{color: #108ee9; margin: 0 5px 0 5px;}
.table{margin:15px 0 0 13px;width:1039px}
.search{width:1060px; background:#f7f7f7;overflow:hidden;}
.search-title {font-size: 14px;text-align:right; margin:0 0 0 20px;}
.group-no {margin-left: 10px;}
.addassociated{background: #e6f3fc;border: 1px solid #d5f0fc; line-height: 30px; border-radius: 5px;overflow: hidden;margin: 15px 0 0 0;width:1060px}
.ordertable{margin:15px 0 0 0;width:1060px}
.blue {color: #2e94f9;}
</style>


