<template>
  <div class="distributor-content">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" id="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="申请人:" prop="createUser">
            <el-input v-model="ruleForm.createUser" placeholder="请输入申请人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款时间:" prop="dateStart">
            <el-col :span="11">
              <el-form-item prop="dateStart">
                <el-date-picker type="date" placeholder="收款时间" v-model="ruleForm.dateStart" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="dateEnd">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateEnd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态:" class="status-length" prop="checkType">
            <el-select v-model="ruleForm.checkType" placeholder="请选择状态">
              <el-option label="驳回" value="2"></el-option>
              <el-option label="通过" value="1"></el-option>
              <el-option label="审批中" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="订单:" prop="distributor">
            <el-input v-model="ruleForm.distributor" placeholder="请输入订单"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button @click="searchHandInside()" type="primary">搜索</el-button>
            <el-button @click="emptyButtonInside('ruleForm')" type="primary">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
    <!-- 添加按钮 -->
    <div class="reform">
      <el-button type="primary" @click="dialogchange" class="add-style">添加</el-button>
    </div>
    <!-- 添加按钮 END -->
    <div class="table_style">
      <el-table :data="tableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass" id="table-content">
        <el-table-column prop="id" label="收款单号" align="center">
        </el-table-column>
        <el-table-column prop="checkTypeStatus" label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.checkTypeStatus=='审批中'" style="color: #7F7F7F">{{scope.row.checkTypeStatus}}</div>
            <div v-if="scope.row.checkTypeStatus=='驳回'" style="color: #FF4A3D">{{scope.row.checkTypeStatus}}</div>
            <div v-if="scope.row.checkTypeStatus=='通过'" style="color: #33D174">{{scope.row.checkTypeStatus}}</div>
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
        <!-- <el-table-column prop="" label="审批意见" align="center">
        </el-table-column> -->
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="dialogFind(scope.row.id)" type="text" size="small" class="table_details">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total=total background>
        </el-pagination>
      </div>
    </div>
    <StraightGuestInfo :dialogFormVisible="dialogFormVisible" :find="find" :pid="pid" :change="change" :org="org" @searchHand="searchHand" :collectionAccountList="collectionAccountList" :accountList="accountList" @close="closeAdd" :dept="dept"></StraightGuestInfo>
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
              <div>
               <div class="checkType" v-if="fundamental.checkType=='0'" style="background: #ffa200" >审批中</div>
               <div class="checkType" v-if="fundamental.checkType=='2'" style="background: #ff0000" >驳回</div>
               <div class="checkType" v-if="fundamental.checkType=='1'" style="background: #007500" >通过</div>
             </div>
             <!-- <div class="checkType" style="background: #ffa200">审批中</div> -->
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
             <span class="basicspan_02">{{fundamental.collectionNumber}}</span>
           </td>
           <td class="basictd">
             <span class="basicspan_01">收款金额:</span>
             <span class="basicspan_02">{{fundamental.price}}</span>
           </td>
         </tr>
         <tr>
           <td class="basictd">
             <span class="basicspan_01">收款时间:</span>
             <span class="basicspan_02">{{fundamental.collectionTime}}</span>
           </td>
           <td class="basictd">
             <span class="basicspan_01">摘要:</span>
             <span class="basicspan_02">{{fundamental.price}}</span>
           </td>
           <td class="basictd">
             <span class="basicspan_01">开发票:</span>
             <!-- <span class="basicspan_02">{{fundamental.mark}}</span> -->
             <span class="basicspan_02">
               <div class="invoice" v-if="fundamental.invoice=='0'">否</div>
               <div class="invoice" v-if="fundamental.invoice=='1'">是</div>
             </span>
           </td>
         </tr>
         <tr>
           <td class="basictd">
             <span class="basicspan_01">凭证:</span>
             <span class="basicspan_02">{{fundamental.files}}</span>
           </td>
         </tr>
        </table>
        <!-- <div style="margin:30px 0 20px 25px; font-size:14pt;">审核结果</div>
        <el-table :data="tableAudit" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="auditTime" label="审批时间" align="center"></el-table-column>
           <el-table-column prop="auditPeople" label="审批人" align="center"></el-table-column>
           <el-table-column prop="auditResult" label="审批结果" align="center"></el-table-column>
           <el-table-column prop="auditIdea" label="审批意见" align="center"></el-table-column>
        </el-table> -->
        <div style="margin:30px 0 20px 25px; font-size:14pt;">发票</div>
        <el-table :data="tableInvoice" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="invoiceID" label="发票类型" align="center"></el-table-column>
           <el-table-column prop="invoiceType" label="个人/单位" align="center"></el-table-column>
           <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
           <el-table-column prop="invoiceHeaderOrTel" label="发票抬头" align="center"></el-table-column>
           <el-table-column prop="invoiceItem" label="发票项目" align="center"></el-table-column>
           <el-table-column prop="invoicePrice" label="金额" align="center"></el-table-column>
           <el-table-column prop="cardNumber" label="账号" align="center"></el-table-column>
           <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
           <el-table-column prop="address" label="地址" align="center"></el-table-column>
           <el-table-column prop="tel" label="手机号" align="center"></el-table-column>
        </el-table>
        <div style="margin:30px 0 20px 25px; font-size:14pt;">关联欠款</div>
        <!-- <div class="associated">
          <div class="associatedIcon"><i class="el-icon-warning"></i></div>
          <div class="associatedItems">已关联<span style="margin:0 5px; font-weight: bold;">1</span>项</div>
          <div class="associatedMoney">总计：1200.00元</div>
        </div> -->
        <el-table :data="tableAssociated" border style="width: 90%; margin:10px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
           <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
           <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
           <el-table-column prop="date" label="出团日期" align="center"></el-table-column>
           <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
           <el-table-column prop="uncollectedMoney" label="未收金额" align="center"></el-table-column>
           <el-table-column prop="collectedMoney" label="已收金额" align="center"></el-table-column>
           <el-table-column prop="examineMoney" label="待审批金额" align="center"></el-table-column>
           <el-table-column prop="repaymentMoney" label="本次收款金额" align="center"></el-table-column>
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
      ruleForm: {
        createUser: '',
        distributor: '',
        moneyExplain: '',
        checkType: '',
        dateStart: '',
        dateEnd: '',
      },
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
      tableInvoice:[],//发票表格
      tableAssociated:[],//发票关联表
      paymentID:0,
      tour_id:0,
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
      this.pageSize = val
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": 1,
            "pageSize": val,
            "object": {
              "id": 0,
              "checkType": this.settlement_01?this.settlement_01:-1,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2001-01-01 01:02:40",
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
      this.pageNum = val;
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": val,
            "pageSize": this.pageSize,
            "object": {
              "id": 0,
              "checkType": this.settlement_01?this.settlement_01:-1,
              "collectionTime": "2019-05-16T01:02:40.816Z",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd hh:mm:ss') : "2000-01-01 01:02:40",
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
    dialogFind(id) {
      //this.find = 1;
      //this.change = true
      //this.dialogFormVisible = true;
      this.detailstShow = true;
      this.getLabel(id);
    },
    closeDetailstShow(){//取消关闭查看详情弹窗
      this.detailstShow = false;
      this.clearTableAssociated();
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
      this.paymentID=row.paymentID;
      this.tour_id = row['planID']

    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    /*getCollectionAccount() {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list", {
            "object": {
              "id": 0,
              "title": 'string',
              "mark": 'string',
              "isDeleted": 0,
            }
          })
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
    },*/
    getStraightGuestManagement() {
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": 1,
            "pageSize": that.pageSize,
            "object": {
              "id": 0,
              "checkType": this.settlement_01?this.settlement_01:-1,
              "collectionTime": "2019-05-16",
              "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd') : "2001-01-01",
              "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd') : "2099-05-16",
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
              "collectionType":1,//直客1.同业2
              "localCompID":0,//直客0,同业变成同业社id
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
        })
    },
    //获取一条信息
    clearTableAssociated(){
      this.tableAssociated = [];
    },
    getLabel(id){
      var that = this
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/coll',{
          "id":id
      }).then(res => {
        //console.log(res.data.object.invoiceTable)
        if(res.data.isSuccess == true){
           this.fundamental=res.data.object;
           this.tableInvoice = res.data.object.invoiceTable;
           this.tour_id = res.data.object.planID;
           if(this.tableData[0].orderNumber == res.data.object.orderNumber){
            this.$http.post(
              this.GLOBAL.serverSrc + "/finance/collection/api/getnumber", {
                orderCode: res.data.object.orderNumber,
                id:id
              }
            )
            .then(res => {
              //that.collectedMoney = res.data.isSuccess == true ? res.data.object.price : 0
              that.collectedMoney =  res.data.object.price
            })
            .catch(function(res) {
              console.log(res)
            })
            this.$http.post(
              this.GLOBAL.serverSrc + "/teamquery/get/api/receiptorder", {
                orderCode: res.data.object.orderNumber,
              }
            )
            .then(res => {
               res.data.object.collectedMoney = that.collectedMoney
               res.data.object.uncollectedMoney = res.data.object.payable - res.data.object.collectedMoney
               //res.data.object.collectedMoney = that.examineMoney
               that.tableAssociated.push(res.data.object)
            })
            .catch(function(res) {
            })
           }
        }
     })
    },
    /*receiptorder() { //通过订单号获取直客收款订单详情
      this.arrearsList = []
      //this.ruleForm.planID = ''
      this.ruleForm.orderID = ''
      this.ruleForm.groupCode = ''
      this.getnumber()
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/teamquery/get/api/receiptorder", {
            orderCode: that.indent,
          }
        )
        .then(function(obj) {
          obj.data.object.collectedMoney = that.collectedMoney
          obj.data.object.uncollectedMoney = obj.data.object.payable - obj.data.object.collectedMoney
          obj.data.object.collectedMoney = that.examineMoney
          //obj.data.object.examineMoney = that.examineMoney
          that.arrearsList.push(obj.data.object)
          that.ruleForm.planID = obj.data.object.planID
          that.ruleForm.orderID = obj.data.object.id
          that.ruleForm.groupCode = obj.data.object.groupCode
        })
        .catch(function(obj) {
          console.log(obj)
        })

    },
    getnumber() { //通过订单号获取直客收款订单详情
      var that = this
      that.$http.post(
          that.GLOBAL.serverSrc + "/finance/collection/api/getnumber", {
            number: res.data.object.orderNumber,
          }
        )
        .then(function(res) {
          that.collectedMoney = res.data.isSuccess == true ? res.data.object.price : 0
        })
        .catch(function(res) {
          console.log(res)
        })
    },*/
  },
  created() {
    //this.getCollectionAccount()
    this.getStraightGuestManagement()
    this.getDept()
  }
}
</script>

<style lang="scss" scoped>
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
    .add-style{
      margin-left: 1%;
      margin-top: 30px;
    }
    #table-content{
      width: 98%;
      margin: 10px auto 20px;
    }
  }
</style>
