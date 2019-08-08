<template>
  <div class="all" style="position:relative">
    <el-tabs v-model="activeName">
      <div class="borders" style="margin-bottom:100px;">
        <div>
          <!-- <div class="search">
            <span class="search_style">团期计划：</span>
            <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">申请人：</span>
            <el-input v-model="accepter" placeholder="请输入内容" class="search_input"></el-input>
            <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
            <div class="date-line"></div>
            <el-date-picker v-model="endTime" type="date" placeholder="终止日期" class="start-time"></el-date-picker>
          </div>
          <div class="reform">
            <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
            <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
          </div> -->
          <div class="plan">
            <div style="width:1100px;">
              <div class="fl">
                <span class="emptyPlan">订单</span>
                <el-input v-model="plan" class="empty" clearable placeholder="请输入团期计划"></el-input>
              </div>
              <div class="fl">
                <span class="emptyPlan">申请人</span>
                <el-input v-model="accepter" class="empty" clearable placeholder="请输入申请人"></el-input>
              </div>
              <div class="fl">
                <span class="emptyPlan">收款时间</span>
                <el-date-picker v-model="startTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
                <span class="time">——</span>
                <el-date-picker v-model="endTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
              </div>
            </div>
            <div style="width:1100px;clear:both;">
              <div style=" float:left">
               <span class="emptyPlan">类型</span>
               <el-select v-model="settlement_01" placeholder="请选择"  class="empty">
                 <el-option  key="0" label="审批中" value="0"></el-option>
                 <el-option  key="1" label="通过" value="1"></el-option>
                 <el-option  key="2" label="驳回" value="2"></el-option>
               </el-select>
              </div>
              
              <div style="float:right; margin: 0 10px 0 0;">
                <el-button @click="searchHand()" type="primary">搜索</el-button>
                <el-button @click="resetHand()" type="primary">重置</el-button>
              </div>
            </div>
          </div>
          <div class="reform">
            <el-button type="primary" @click="dialogchange" plain>添加</el-button>
            <!-- <el-button type="primary" @click=dialogFind plain :disabled="reable">查看详情</el-button> -->
          </div>
        </div>
        <div class="table_style">
          <el-table :data="tableData" border style="width:70%;" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
            <el-table-column prop="id" label="收款单号" align="center">
            </el-table-column>
            <el-table-column prop="checkTypeStatus" label="状态" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.checkTypeStatus=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeStatus}}</div>
                <div v-if="scope.row.checkTypeStatus=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeStatus}}</div>
                <div v-if="scope.row.checkTypeStatus=='通过'" style="color: #33D174" >{{scope.row.checkTypeStatus}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="collectionTime" label="收款时间" align="center">
            </el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center">
            </el-table-column>
            <el-table-column prop="orderNumber" label="订单号" align="center">
            </el-table-column>
            <!-- <el-table-column prop="collectionNumber" label="收款账户" align="center">
            </el-table-column> -->
            <el-table-column prop="price" label="收款金额" align="center">
            </el-table-column>
            <!-- <el-table-column prop="dept" label="申请组织" align="center">
            </el-table-column> -->
            <el-table-column prop="createUser" label="申请人" align="center">
            </el-table-column>
            <!-- <el-table-column prop="createTime" label="申请时间" align="center">
            </el-table-column> -->
            <el-table-column prop="" label="审批意见" align="center">
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button @click="dialogFind(scope.row)" type="text" size="small" class="table_details">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total background>
            </el-pagination>
          </div>
        </div>
        <StraightGuestInfo :dialogFormVisible="dialogFormVisible" :find="find" :pid="pid" :change="change" :org="org" @searchHand="searchHand" :collectionAccountList="collectionAccountList" :accountList="accountList" @close="closeAdd" :dept="dept"></StraightGuestInfo>
      </div>
    </el-tabs>
    <!--查看详情-->
    <el-dialog title="详情" :visible.sync="detailstShow" width="80%" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close='false'>
      <div style="position:absolute; top:8px; right:10px;">
        <el-button @click="closeDetailstShow()">取消</el-button>
        <el-button type="danger" plain>撤销</el-button>
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
             <span class="basicspan_01">交易流水号:</span>
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
             <span class="basicspan_01">收款时间:</span>
             <span class="basicspan_02">{{fundamental.paymentType}}</span>
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
         <tr>
           <td class="basictd">
             <span class="basicspan_01">凭证:</span>
             <span class="basicspan_02">{{fundamental.files}}</span>
           </td>
         </tr>
        </table>
        <div style="margin:30px 0 20px 25px; font-size:14pt;">审核结果</div>
        <el-table :data="tableAudit" border style="width: 1080px; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="auditTime" label="审批时间" align="center"></el-table-column>
           <el-table-column prop="auditPeople" label="审批人" align="center"></el-table-column>
           <el-table-column prop="auditResult" label="审批结果" align="center"></el-table-column>
           <el-table-column prop="auditIdea" label="审批意见" align="center"></el-table-column>
        </el-table>
        <div style="margin:30px 0 20px 25px; font-size:14pt;">发票</div>
        <el-table :data="tableInvoice" border style="width: 1080px; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="invoiceType" label="发票类型" align="center"></el-table-column>
           <el-table-column prop="invoiceUnit" label="个人/单位" align="center"></el-table-column>
           <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
           <el-table-column prop="invoiceTitle" label="发票抬头/手机号" align="center"></el-table-column>
           <el-table-column prop="invoiceProject" label="发票项目" align="center"></el-table-column>
           <el-table-column prop="invoiceMoney" label="金额" align="center"></el-table-column>
           <el-table-column prop="invoiceAccount" label="账号" align="center"></el-table-column>
           <el-table-column prop="invoiceBank" label="开户行" align="center"></el-table-column>
           <el-table-column prop="invoiceAddress" label="地址" align="center"></el-table-column>
           <el-table-column prop="invoicePhone" label="手机号" align="center"></el-table-column>
        </el-table>
        <div style="margin:30px 0 20px 25px; font-size:14pt;">关联欠款</div>
        <!-- <div class="associated">
          <div class="associatedIcon"><i class="el-icon-warning"></i></div>
          <div class="associatedItems">已关联<span style="margin:0 5px; font-weight: bold;">1</span>项</div>
          <div class="associatedMoney">总计：1200.00元</div>
        </div> -->
        <el-table :data="tableAssociated" border style="width: 1080px; margin:10px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="productID" label="订单编号" align="center"></el-table-column>
           <el-table-column prop="productPlan" label="产品名称" align="center"></el-table-column>
           <el-table-column prop="planID" label="团期计划" align="center"></el-table-column>
           <el-table-column prop="departTime" label="出团日期" align="center"></el-table-column>
           <el-table-column prop="orderMoney" label="订单金额" align="center"></el-table-column>
           <el-table-column prop="arrearsMoney" label="未收金额" align="center"></el-table-column>
           <el-table-column prop="alsoMoney" label="已收金额" align="center"></el-table-column>
           <el-table-column prop="auditMoney" label="待审核金额" align="center"></el-table-column>
           <el-table-column prop="collectionMoney" label="本次收款金额" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import StraightGuestInfo from '@/page/Finance/collectionManagement/collectionInfo/straightGuestInfo'
export default {
  name: "straightGuestManagement",
  components: {
    StraightGuestInfo,
  },
  data() {
    return {
      activeName: 'first',
      activeName2: 'three',
      plan: '',
      accepter: '',
      startTime: '',
      endTime: '',
      settlement_01:'',
      tableData: [],
      reable: true,
      dialogFormVisible: false,
      change: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      find: 0,
      org: '',
      pid: '',
      collectionAccountList: [],
      accountList: {},
      checkTypeList: {
        '0': '审批中',
        '1': '通过',
        '2': '驳回',
      },
      dept: '',
      detailstShow:false,//查看详情弹窗
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
    }
  },
  computed: {
    // 计算属性的 getter
    invoiceListCount() {
      return this.ruleForm.invoiceList.length - 1;
    }
  },
  methods: {
    closeAdd() {
      this.dialogFormVisible = false;
    },
    changeInvoice() {
      this.ruleForm.invoiceList.forEach(function(v, k, arr) {
        console.log(arr[k]['date'])
      })
    },
    handleEdit(index, row) {
      this.ruleForm.invoiceList.push({})
    },
    handleDelete(index, row) {
      this.ruleForm.invoiceList.splice(index, 1)
      if (this.ruleForm.invoiceList.length == 0) {
        this.ruleForm.invoiceList.push({})
      }
    },
    handleSizeChange(val) {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": 1,
            "pageSize": val,
            "object": {
              "id": 0,
              "checkType": this.settlement_01,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2000-05-16 01:02:40",
              "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss') : "2099-05-16 01:02:40",
              "groupCode": this.plan ? this.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": this.accepter ? this.accepter : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
            }

          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    handleCurrentChange(val) {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": val,
            "pageSize": this.pageSize,
            "object": {
              "id": 0,
              "checkType": this.settlement_01,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2000-05-16 01:02:40",
              "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss') : "2099-05-16 01:02:40",
              "groupCode": this.plan ? this.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": this.accepter ? this.accepter : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
            }

          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    //查询详情
    dialogFind() {
      //this.find = 1;
      //this.change = true
      //this.dialogFormVisible = true;
      this.detailstShow = true;
    },
    closeDetailstShow(){//取消关闭查看详情弹窗
      this.detailstShow = false;
    },
    //添加收款
    dialogchange() {
      this.find = 0;
      this.change = false
      this.dialogFormVisible = true;
    },
    //重置搜索条件
    resetHand() {
      this.plan = '';
      this.accepter = '';
      this.startTime = '';
      this.endTime = '';
      this.settlement_01 = '';
    },
    //搜索按钮
    searchHand() {
      this.getStraightGuestManagement()
    },
    //获取id
    clickBanle(row, event, column) {
      this.pid = row['id'];
      this.reable = false;

    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    getCollectionAccount() {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
            "object": {
              "id": 0,
              "title": 'string',
              "mark": 'string',
              "isDeleted": 0,
            }
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.collectionAccountList = [];
          obj.data.objects.forEach(function(v, k, arr) {
            that.accountList[arr[k]['id']] = arr[k]['title']
            that.collectionAccountList.push({ "value": arr[k]['id'], "label": arr[k]['title'] });
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    getStraightGuestManagement() {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": 1,
            "pageSize": that.pageSize,
            "object": {
              "id": 0,
              "checkType": this.settlement_01?this.settlement_01:-1,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2000-05-16 01:02:40",
              "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd hh:mm:ss') : "2099-05-16 01:02:40",
              "groupCode": this.plan ? this.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": this.accepter ? this.accepter : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
            }

          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          that.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
    getDept() { //通过用户ID,获取部门名称
      var that = this
      that.$http.post(
          that.GLOBAL.serverSrc + "/org/user/api/orgshort", {
            id: sessionStorage.getItem('id'),
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
        .then(function(obj) {
          that.dept = obj.data.isSuccess == true ? obj.data.objects[0].name : ''
        })
        .catch(function(obj) {
          console.log(obj)
        })
    },
  },
  created() {
    this.getCollectionAccount()
    this.getStraightGuestManagement()
    this.getDept()
  }
}

</script>
<style lang="scss" scoped>
.all {
  margin-bottom: 100px;

  .borders {
    border: 0px solid #E6E6E6;

    .sh_style {
      background: #eaeaea;
      position: absolute;
      width: 50px;
      height: 23px;
      text-align: center;
      line-height: 26px;
      top: 20px;
      left: 116px;
    }

    .search {

      .search_input {
        float: left;
        width: 200px
      }

      .search_style {
        float: left;
        margin-top: 10px;
        margin-left: 20px;
        font-size: 14px
      }

      .date-line {
        width: 10px;
        border-bottom: 1px solid #e6e6e6;
        display: inline-block;
        margin: 0 3px 3px 0
      }

      .start-time {
        margin-left: 25px
      }

    }

    .reform {
      float: left;
      width: 1550px;
      margin-left: 20px;
      margin-top: 20px;
    }

    .table_style {
      width: 1500px;
      margin-left: 20px;
      margin-top: 20px;
      float: left;
    }



  }
}
/*搜索框*/
  .empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
  .fl{float:left; margin: 20px 0 20px 0;}
  .emptyPlan{margin: 0 0 0 30px; float:left; width:80px; text-align:right; line-height:40px;}
  .planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
  .time{margin: 0 0 0 10px;}
</style>
