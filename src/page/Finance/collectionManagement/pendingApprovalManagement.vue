<template>
  <div class="distributor-content">
     <el-tabs :tab-position="tabPosition" class="tabsPosition" v-model="activeName">
       <!-- 直客模块 -->
       <el-tab-pane :label="examine + '('+total+')'" name="first">
         <!-- 直客表格 -->
         <el-table :data="tableData" border :header-cell-style="getRowClass" id="table-content">
          <el-table-column prop="date" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="date" label="状态" align="center"></el-table-column>
          <el-table-column prop="date" label="收款时间" align="center"></el-table-column>
          <el-table-column prop="date" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="date" label="订单号" align="center"></el-table-column>
          <el-table-column prop="date" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="date" label="申请人" align="center"></el-table-column>
          <el-table-column prop="date" label="审批意见" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogFind(scope.row)" size="small" class="table_details">审批</el-button>
            </template>
          </el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
         <!-- 直客表格 END -->
       </el-tab-pane>
       <!-- 直客模块 END -->
       <!-- 同业模块 -->
       <el-tab-pane label="同业(2)" name="second">
         <!-- 同业表格 -->
         <el-table :data="tableData" border :header-cell-style="getRowClass" id="table-content-together">
          <el-table-column prop="date" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="date" label="状态" align="center"></el-table-column>
          <el-table-column prop="date" label="收款时间" align="center"></el-table-column>
          <el-table-column prop="date" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="date" label="订单号" align="center"></el-table-column>
          <el-table-column prop="date" label="同业社名称" align="center"></el-table-column>
          <el-table-column prop="date" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="date" label="申请人" align="center"></el-table-column>
          <el-table-column prop="date" label="审批意见" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogFind(scope.row)" size="small" class="table_details">审批</el-button>
            </template>
          </el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
         <!-- 同业表格 END -->
         <!-- 同业审批弹窗 -->
         <el-dialog width="80%" :title="title" :visible.sync="customerApproval" style="margin:-80px 0 0 0;" append-to-body custom-class="city_list" >
            <div style="position:absolute; top:8px; right:10px;">
              <el-button @click="closeApprove()">取消</el-button>
              <el-button type="primary">通过</el-button>
              <el-button type="danger">驳回</el-button>
            </div>
            <div>
              <div style="margin:10px 0 20px 25px; font-size:14pt;">基本信息</div>
              <table class="basictable">
               <tr>
                <td>
                   <!-- <div>
                     <div class="checkType" v-if="fundamental.checkType=='0'" style="background: #ffa200" >审批中</div>
                     <div class="checkType" v-if="fundamental.checkType=='2'" style="background: #ff0000" >驳回</div>
                     <div class="checkType" v-if="fundamental.checkType=='1'" style="background: #007500" >通过</div>
                   </div> -->
                   <div class="checkType" style="background: #ffa200">审批中</div>
                </td>
               </tr>
               <tr>
                 <td class="basictd">
                   <span class="basicspan_01">ID:</span>
                   <span class="basicspan_02">{{fundamental.id}}</span>
                 </td>
                 <td class="basictd">
                   <span class="basicspan_01">申请人:</span>
                   <span class="basicspan_02">{{fundamental.createUser}}</span>
                 </td>
                 <td class="basictd">
                   <span class="basicspan_01">创建时间:</span>
                   <span class="basicspan_02">{{fundamental.createTime}}</span>
                 </td>
               </tr>
               <tr>
                 <td class="basictd">
                   <span class="basicspan_01" v-if="activeName == 'second'">同业社名称:</span>
                   <span class="basicspan_01" v-if="activeName == 'first'">交易流水号:</span>
                   <span class="basicspan_02">{{fundamental.groupCode}}</span>
                 </td>
                 <td class="basictd">
                   <span class="basicspan_01">收款账户:</span>
                   <span class="basicspan_02">{{fundamental.plan_01}}</span>
                 </td>
                 <td class="basictd">
                   <span class="basicspan_01">收款金额:</span>
                   <span class="basicspan_02">{{fundamental.supplierName}}</span>
                 </td>
               </tr>
               <tr>
                 <td class="basictd">
                   <span class="basicspan_01">凭证:</span>
                   <span class="basicspan_02">{{fundamental.files}}</span>
                 </td>
                 <td class="basictd">
                   <span class="basicspan_01">摘要:</span>
                   <span class="basicspan_02">{{fundamental.price}}</span>
                 </td>
                 <td class="basictd">
                   <span class="basicspan_01">开发票:</span>
                   <span class="basicspan_02">{{fundamental.mark}}</span>
                 </td>
               </tr>
              </table>
              <!-- 弹窗-审核结果 -->
              <div style="margin:30px 0 20px 25px; font-size:14pt;">审核结果</div>
              <el-table :data="tableAudit" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
                 <el-table-column prop="auditTime" label="审批时间" align="center"></el-table-column>
                 <el-table-column prop="auditPeople" label="审批人" align="center"></el-table-column>
                 <el-table-column prop="auditResult" label="审批结果" align="center"></el-table-column>
                 <el-table-column prop="auditIdea" label="审批意见" align="center"></el-table-column>
              </el-table>
              <!-- 弹窗-审核结果 END -->
              <!-- 弹窗-发票表格 -->
              <div style="margin:30px 0 20px 25px; font-size:14pt;">发票</div>
              <el-table :data="tableInvoice" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
                 <el-table-column prop="invoiceType" label="发票类型" align="center"></el-table-column>
                 <el-table-column prop="invoiceUnit" label="个人/单位" align="center"></el-table-column>
                 <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
                 <el-table-column prop="invoiceTitle" label="发票抬头" align="center"></el-table-column>
                 <el-table-column prop="invoiceProject" label="发票项目" align="center"></el-table-column>
                 <el-table-column prop="invoiceMoney" label="金额" align="center"></el-table-column>
                 <el-table-column prop="invoiceAccount" label="账号" align="center"></el-table-column>
                 <el-table-column prop="invoiceBank" label="开户行" align="center"></el-table-column>
                 <el-table-column prop="invoiceAddress" label="地址" align="center"></el-table-column>
                 <el-table-column prop="invoicePhone" label="手机号" align="center"></el-table-column>
              </el-table>
              <!-- 弹窗-发票表格 END -->
              <!-- 弹窗-关联欠款表格 -->
              <div style="margin:30px 0 20px 25px; font-size:14pt;">关联欠款</div>
              <div class="associated" v-if="activeName == 'second'">
                <div class="associatedIcon"><i class="el-icon-warning"></i></div>
                <div class="associatedItems">已关联<span style="margin:0 5px; font-weight: bold;">1</span>项</div>
                <div class="associatedMoney">总计：1200.00元</div>
              </div>
              <el-table :data="tableAssociated" border style="width: 90%; margin:10px 0 20px 25px;":header-cell-style="getRowClass">
                 <el-table-column prop="productID" label="订单编号" align="center"></el-table-column>
                 <el-table-column prop="productPlan" label="产品名称" align="center"></el-table-column>
                 <el-table-column prop="planID" label="团期计划" align="center"></el-table-column>
                 <el-table-column prop="departTime" label="出发日期" align="center"></el-table-column>
                 <el-table-column prop="orderMoney" label="订单金额" align="center"></el-table-column>
                 <el-table-column prop="arrearsMoney" label="欠款金额" align="center"></el-table-column>
                 <el-table-column prop="alsoMoney" label="已还金额" align="center"></el-table-column>
                 <el-table-column prop="auditMoney" label="待审核金额" align="center"></el-table-column>
                 <el-table-column prop="collectionMoney" label="本次收款金额" align="center"></el-table-column>
              </el-table>
              <!-- 弹窗-关联欠款表格 END -->
          </div>
         </el-dialog>
         <!-- 同业审批弹窗 END -->
       </el-tab-pane>
       <!-- 同业模块 END -->
     </el-tabs>
  </div>
</template>
<script type="text/javascript">

export default {
  data() {
    return {
       tabPosition: 'left',//左侧导航
       activeName:'first',
       examine:'直客',
       msg:'',
       tableData:[{
        date:'123'
       },{
        date:'123'
       },{
        date:'123'
       },],
       pagesize: 10, // 设定默认分页每页显示数
       pageIndex: 1, // 设定当前页数
       total: 0,
       currentPage: 1,
       customerApproval:false,//直客审批弹窗
       fundamental:{},//查看详情基本信息数组
       tableAudit:[{//审核结果表格
        auditTime: '2019-01-14 18:00:00',
        auditPeople:'洋洋',
        auditResult:'通过',
        auditIdea:''
        }],
        tableInvoice:[{//发票表格
          invoiceType:'纸质发票',
          invoiceUnit:'个人',
          invoiceNumber:'1234566',
          invoiceTitle:'15785452546',
          invoiceProject:'旅游费',
          invoiceMoney:'1200.00',
          invoiceAccount:'1234 1234 1234 1234 123',
          invoiceBank:'建行',
          invoiceAddress:'和平区',
          invoicePhone:'15785452546',
        }],
        tableAssociated:[{//发票关联表格
          productID:'123',
          productPlan:'泰国游',
          planID:'1234556',
          departTime:'2019-07-07',
          orderMoney:'1200.00',
          arrearsMoney:'1200.00',
          alsoMoney:'0.00',
          auditMoney:'1200.00',
          collectionMoney:'1200.00',
        }],
        title:"",
    }
  },
  computed: {

  },
  methods: {
    //表格表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
    headCall: function (msg) { //回调方法，接收子组件传的参数
      this.msg = '(' + msg + ')';
    },
    //分页
    handleSizeChange(page) {
      //this.currentPage = 1;
      //this.pagesize = page;
      //this.pageList();
    },
    handleCurrentChange(currentPage) {
      //this.currentPage = currentPage;
      //this.pageList();
    },
    dialogFind(){
      if(this.activeName == 'first'){
        this.title="直客审批";
      }
      else{
        this.title="同业审批";
      }
      this.customerApproval = true;
    },
    saveModule(formName){ //判断显示编辑或者添加弹窗
       if(this.title == "直客审批"){
          this.addLabelTheme(formName);
       }else{
          this.editLabelTheme(formName);
       }
    },
    closeApprove(){
      this.customerApproval = false;//审批弹窗取消
    },


  },
  created() {

  }
}
</script>

<style lang="scss" scoped>
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .tabsPosition{
      margin: 20px 0;
    }
    #table-content, #table-content-together {
      width: 98%;
      margin: 0 auto 20px;
    }
  }
/*关联欠款*/
  .associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc;width: 90%; margin: 0 0 0 25px; border-radius: 5px;overflow: hidden; }
  .associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
  .associatedItems{float:left; margin: 0 0 0 10px;}
  .associatedMoney{float:left; margin: 0 0 0 30px;}

</style>
