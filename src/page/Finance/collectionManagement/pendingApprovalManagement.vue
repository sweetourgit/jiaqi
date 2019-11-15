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
              <el-button type="text" @click="dialogFind(scope.$index, scope.row)" size="small" class="table_details">详情</el-button>
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
              <el-button type="text" @click="dialogFind(scope.$index, scope.row)" size="small" class="table_details">审批</el-button>
            </template>
          </el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
         <!-- 同业表格 END -->
         <!-- 同业审批弹窗 -->
         <el-dialog width="80%" :title="title" :visible.sync="customerApproval" style="margin:-80px 0 0 0;" append-to-body custom-class="city_list" >
            <div style="position:absolute; top:8px; right:10px;">
              <el-button @click="closeApprove()">取消</el-button>
              <el-button type="primary" @click="passHandle">通过</el-button>
              <el-button type="danger" @click="rejectHandle">驳回</el-button>
            </div>
            <div>
              <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
              <!-- 基本信息 -->
              <div class="item-content">
                <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
                <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
                <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
              </div>
              <!-- 第一行 -->
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color ">ID:</div></el-col>
                  <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
                </el-col>
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
                  <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
                </el-col>
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color">创建时间:</div></el-col>
                  <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
                </el-col>
              </el-row>
              <!-- 第一行 END -->
              <!-- 第二行 -->
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="6">
                  <el-col :span="6">
                    <div class="grid-del label-color" v-if="activeName == 'second'">同业社名称:</div>
                    <div class="grid-del label-color" v-if="activeName == 'first'">同业社名称:</div>
                  </el-col>
                  <el-col :span="18"><div class="grid-del">{{ fundamental.groupCode }}</div></el-col>
                </el-col>
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
                  <el-col :span="18"><div class="grid-del ">{{ fundamental.collectionNumber }}</div></el-col>
                </el-col>
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color">收款金额:</div></el-col>
                  <el-col :span="18"><div class="grid-del ">{{ fundamental.price }}</div></el-col>
                </el-col>
              </el-row>
              <!-- 第二行 END -->
              <!-- 第三行 -->
              <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
                  <el-col :span="18">
                    <div class="grid-del">{{ fundamental.files }}</div>
                  </el-col>
                </el-col>
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
                  <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
                </el-col>
                <el-col :span="6">
                  <el-col :span="6"><div class="grid-del label-color">开发票:</div></el-col>
                  <el-col :span="18"><div class="grid-del ">{{ fundamental.invoice }}</div></el-col>
                </el-col>
              </el-row>
              <!-- 第三行 END -->
              <!-- 弹窗-审核结果 -->
              <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
              <el-table :data="tableAudit" border :header-cell-style="getRowClass">
                 <el-table-column prop="auditTime | formatDate" label="审批时间" align="center"></el-table-column>
                 <el-table-column prop="auditPeople" label="审批人" align="center"></el-table-column>
                 <el-table-column prop="auditResult" label="审批结果" align="center"></el-table-column>
                 <el-table-column prop="auditIdea" label="审批意见" align="center"></el-table-column>
              </el-table>
              <!-- 弹窗-审核结果 END -->
              <!-- 弹窗-发票表格 -->
              <el-divider content-position="left" class='title-margin title-margin-t'>发票</el-divider>
              <el-table :data="tableInvoice" border :header-cell-style="getRowClass">
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
              <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
              <div class="associated" v-if="activeName == 'second'">
                <div class="associatedIcon"><i class="el-icon-warning"></i></div>
                <div class="associatedItems">已关联<span style="font-weight: bold;">{{ tableManyRow }}</span>项</div>
                <div class="associatedMoney">总计：{{ getCollectionPriceTotal }}元</div>
              </div>
              <el-table :data="tableAssociated" border :header-cell-style="getRowClass">
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
    <!-- 驳回意见弹窗 -->
    <el-dialog title="审批驳回" :visible.sync="dialogFormVisibleReject" width="30%">
      <textarea style="width: 90%; height: 132px; resize:none;margin-left: 13px; "></textarea>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="rejectHandle2()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 驳回意见弹窗 END -->
    <!-- 通过弹窗 -->
    <el-dialog title="审批通过" :visible.sync="dialogFormVisiblePass" width="30%">
      <textarea style="width: 90%; height: 132px; resize:none;margin-left: 13px;"></textarea>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="passHandle2()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 通过弹窗 END -->
  </div>
</template>
<script type="text/javascript">
import moment from 'moment'
export default {
  data() {
    return {
      tableManyRow: null, // 关联欠款表格共多少行
      getCollectionPriceTotal: 0, // 当前收款总额（合计）
      selId: 0, // 所选id
      dialogFormVisibleReject: false, // 驳回意见弹窗
      dialogFormVisiblePass: false, // 通过意见弹窗
     tabPosition: 'left',//左侧导航
     activeName:'first',
     examine:'直客',
     msg:'',
     tableData:[], // 同业，直客表格
     pagesize: 10, // 设定默认分页每页显示数
     pageIndex: 1, // 设定当前页数
     total: 0,
     currentPage: 1,
     customerApproval:false,//直客审批弹窗
     fundamental:{},//查看详情基本信息数组
     tableAudit:[], // 审核结果表格
      tableInvoice:[], // 发票表格
      tableAssociated:[], // 发票关联表格
      title:"",
    }
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    moment,
    // 渲染列表数据
    getTableData () {
      let _this = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          "pageIndex": 1,
          "pageSize": 10,
          "object": {
            "id": 0,
            "checkType": this.settlement_01 ? this.settlement_01 : -1,
            "collectionTime": "2019-05-16",
            "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd') : "2000-05-16",
            "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd') : "2099-05-16",
            "groupCode": this.plan ? this.plan : '',
            "planID": 0,
            "orderID": 0,
            "orderNumber": "",
            "collectionNumber": "",
            "price": 0,
            "dept": 0,
            "createUser": this.accepter ? this.accepter : '',
            "createTime": "2010-05-16 01:02:40",
            "code": "",
            "serialNumber": "",
            "abstract": "",
            "isDeleted": 0,
            "collectionType":1, // 直客1.同业2
            "localCompID":0, // 直客0,同业变成同业社id
            //"localCompName":""
          }
        }
      )
        .then(function(obj) {
          _this.tableData = obj.data.objects;
          _this.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })
        })
        .catch(function(obj) {})
    },
    // 通过
    passHandle(){
      this.dialogFormVisiblePass = true
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/getCollIDTG', {
        "object": {
          "datetime": 20191112,
          "spname": sessionStorage.getItem('name'),
          "spstate": "通过",
          "spcontent": "审批意见",
          "id": this.selId
        }
      }).then(res => {
        console.log(res,'通过res')
      }).catch(err => {
        console.log(err)
      })
    },
    // 驳回
    rejectHandle(){
      this.dialogFormVisibleReject = true
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/getCollIDBH', {
        "object": {
          "datetime": 20191112,
          "spname": sessionStorage.getItem('name'),
          "spstate": "驳回",
          "spcontent": "审批意见",
          "id": this.selId
        }
      }).then(res => {
        console.log(res,'通过res')
      }).catch(err => {
        console.log(err)
      })
    },
    //表格表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },
    headCall: function (msg) { // 回调方法，接收子组件传的参数
      this.msg = '(' + msg + ')';
    },
    // 分页
    handleSizeChange(page) {
      //this.currentPage = 1;
      //this.pagesize = page;
      //this.pageList();
    },
    handleCurrentChange(currentPage) {
      //this.currentPage = currentPage;
      //this.pageList();
    },
    // 点击详情事件
    dialogFind(index,row){
      this.selId = row.id
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
    }
  },
  created(){
    this.getTableData();
  }
}
</script>

<style lang="scss" scoped>
  .el-divider__text{
    font-size: 17px !important
  }
  .title-margin-t{
    margin-top: 45px;
  }
  .row-bg {
    padding: 13px 0;
    .grid-del{
      text-align: left;
      font-size: 14px;
    }
    .label-color{
      color: #909399;
    }
    .doc-mt-3{
      margin-top: 3px;
    }
  }
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .el-select{
        width: 100% !important;
      }
      .line{
        text-align: center;
      }
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .item-content{
      margin-bottom: 20px;
    }

    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 40px;
    }
    .add-style{
      margin-left: 1%;
      margin-top: 30px;
    }
    #table-content,#table-content-together{
      width: 98%;
      margin: 10px auto 20px;
    }
    .block {
      margin-top: 30px;
      margin-left:-30%;
      text-align:center;
    }
  }
/*关联欠款*/
  .associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc;width: 90%; margin: 0 0 0 25px; border-radius: 5px;overflow: hidden; }
  .associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
  .associatedItems{float:left; margin: 0 0 0 10px;}
  .associatedMoney{float:left; margin: 0 0 0 30px;}

</style>
