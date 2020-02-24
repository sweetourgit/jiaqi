<template>
  <div>
    <el-dialog title="申请发票管理" :visible="dialogFormVisible"style="margin:-80px 0 0 0;"width=1100px :show-close="false" custom-class="city_list" class="addReceivables"@close="closeAdd()">
      <div class="cancel">
        <el-button class="ml13" @click="closeAdd()">取 消</el-button>
        <el-button class="ml13" type="primary">申 请</el-button>
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
          <el-form-item label="发票类型：" prop="invoiceProject">
            <el-select v-model="ruleForm.invoiceProject" placeholder="请输入发票类型" :disabled="forbidden">
              <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-button class="addorderbutton" type="primary" @click="addOrder()">添加订单</el-button>
        <div class="associated">
          <div class="warning"><i class="el-icon-warning"></i></div>
          <div class="fl ml13">已关联<span class="relateditems">{{tableDate.length}}</span>项</div>
          <div class="aggregate">总计:<span class="mr5">{{ 100 | numFilter}}</span>元</div>
          <!-- <div class="aggregate">总计:<span class="ml13">{{ sum_01 | numFilter}}</span>元</div> -->
        </div>
        <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="" label="订单ID" align="center"></el-table-column>
          <el-table-column prop="" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="" label="订单来源" align="center"></el-table-column>
          <el-table-column prop="" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="" label="下单日期" align="center"></el-table-column>
          <el-table-column prop="" label="已付金额" align="center"></el-table-column>
          <el-table-column prop="" label="剩余开票金额" align="center"></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
    <!--添加订单弹窗-->
    <el-dialog title="添加订单" :visible="addOrderShow"style="margin:-80px 0 0 0;"width=1100px :show-close="false" custom-class="city_list" class="addReceivables"@close="closeOrderShow()">
      <div class="cancel">
        <el-button class="ml13" @click="closeOrderShow()">取 消</el-button>
        <el-button class="ml13" type="primary">添 加</el-button>
      </div>
      <div class="search">
        <div style="margin:15px 0 15px 0;">
          <span class="search-title">订单ID</span>
          <el-input placeholder="请输入" v-model="orderID" class="group-no" style="width:200px;"></el-input> 
          <span class="search-title">商户名称</span>
          <el-input placeholder="请输入" v-model="merchantsName" class="group-no" style="width:200px;"></el-input>
          <span class="search-title">收款单号</span>
          <el-input placeholder="请输入" v-model="collectionNumber" class="group-no" style="width:200px;"></el-input>
          <el-button class="ml13" type="primary">搜 索</el-button>
          <el-button class="ml13" type="primary">重 置</el-button>
        </div>
      </div>
      <div class="addassociated">
        <div class="warning"><i class="el-icon-warning"></i></div>
        <div class="fl ml13">已关联<span class="relateditems">{{tableDate.length}}</span>项</div>
        <div class="aggregate">剩余开票金额:<span class="ml13">{{ 100 | numFilter}}</span>元</div>
      </div>
      <el-table :data="addOrderTable" ref="multipleTable" class="ordertable" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="" label="订单ID" align="center"></el-table-column>
        <el-table-column prop="" label="产品名称" align="center"></el-table-column>
        <el-table-column prop="" label="订单来源" align="center"></el-table-column>
        <el-table-column prop="" label="团期计划" align="center"></el-table-column>
        <el-table-column prop="" label="下单日期" align="center"></el-table-column>
        <el-table-column prop="" label="已付金额" align="center"></el-table-column>
        <el-table-column prop="" label="剩余开票金额" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
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
      addOrderShow:false, // 添加订单弹窗
      orderID:'', // 添加订单中订单ID
      merchantsName:'', // 添加订单中商户名称
      collectionNumber:'', // 添加订单中收款单号
      addOrderTable:[],
    };
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    formatDate: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD')
    }
  },
  watch: {
    variableInvoice:function(){        
      this.dialogFormVisible=true; 
   }
  },
  created() {
  },
  methods: {
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
    closeAdd(){
      this.dialogFormVisible = false;
    },
    addOrder(){
      this.addOrderShow = true;
    },
    closeOrderShow(){
      this.addOrderShow = false;
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
</style>


