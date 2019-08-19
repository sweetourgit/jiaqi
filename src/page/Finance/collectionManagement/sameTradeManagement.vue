<template>
  <div class="all" style="position:relative">
    <el-tabs v-model="activeName">
      <div class="borders" style="margin-bottom:100px;">
        <div>
          <!--搜索框-->
          <div class="plan">
            <div style="width:1100px;">
              <div class="fl">
                <span class="emptyPlan">团期计划</span>
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
                 <el-cascader :options="settlement" v-model="settlement_01"  class="empty" clearable placeholder="请输入类型"></el-cascader>
              </div>
              <div style="float:right; margin: 0 10px 0 0;">
                <el-button @click="searchHand()" type="primary">搜索</el-button>
                <el-button @click="emptyButton()" type="primary">重置</el-button>
              </div>
            </div>
          </div>
          <div class="reform">
            <el-button type="primary" @click="dialogchange" plain>添加</el-button>
            <!-- <el-button type="primary" @click=dialogFind plain :disabled="reable">查看详情</el-button> -->
          </div>
        </div>
        <div class="table_style">
          <el-table :data="tableData" border style="width:100%;" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
            <el-table-column prop="collectionID" label="收款单号" align="center">
            </el-table-column>
            <el-table-column prop="" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.checkTypeStatus=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeStatus}}</div>
                <div v-if="scope.row.checkTypeStatus=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeStatus}}</div>
                <div v-if="scope.row.checkTypeStatus=='通过'" style="color: #33D174" >{{scope.row.checkTypeStatus}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="收款时间" align="center">
            </el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center">
            </el-table-column>
            <el-table-column prop="orderCode" label="订单号" align="center">
            </el-table-column>
            <el-table-column prop="productName" label="同业社名称" align="center">
            </el-table-column>
            <el-table-column prop="price" label="收款金额" align="center">
            </el-table-column>
            <el-table-column prop="createUser" label="申请人" align="center">
            </el-table-column>
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
        <SameTradeInfo :dialogFormVisible="dialogFormVisible" :find="find" :change="change" @close="closeAdd"></SameTradeInfo>
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
             <span class="basicspan_01">同业社名称:</span>
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
             <span class="basicspan_01">附件:</span>
             <span class="basicspan_02">{{fundamental.files}}</span>
           </td>
         </tr>
        </table>
        <div style="margin:30px 0 20px 25px; font-size:14pt;">审核结果</div>
        <el-table :data="tableAudit" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
           <el-table-column prop="auditTime" label="审批时间" align="center"></el-table-column>
           <el-table-column prop="auditPeople" label="审批人" align="center"></el-table-column>
           <el-table-column prop="auditResult" label="审批结果" align="center"></el-table-column>
           <el-table-column prop="auditIdea" label="审批意见" align="center"></el-table-column>
        </el-table>
        <div style="margin:30px 0 20px 25px; font-size:14pt;">发票</div>
        <el-table :data="tableInvoice" border style="width: 90%; margin:30px 0 20px 25px;":header-cell-style="getRowClass">
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
        <div class="associated">
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
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import SameTradeInfo from '@/page/Finance/collectionManagement/collectionInfo/sameTradeInfo'
export default {
  name: "sameTradeManagement",
  components: {
    SameTradeInfo,
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
      settlement:[{
        value: '审批中',
        label: '审批中'
       }, {
        value: '通过',
        label: '通过'
       }, {
        value: '驳回',
        label: '驳回'
       }],
      reable: true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      tableData: [],
      find: 0,
      change: false,
      dialogFormVisible: false,
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
      sid:1,
    }
  },
  computed: {
    // 计算属性的 getter
  },
  methods: {
    //重置
    emptyButton(){
      this.plan = '';
      this.accepter = '';
      this.startTime = '';
      this.endTime = '';
      this.settlement_01 = '';
    },
    closeAdd() {
      this.dialogFormVisible = false;
    },
    handleSizeChange(val) {
      this.pagesize = val
      var that = this
      this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamsearch", {
            "pageIndex": 1,
            "pageSize": val,
            "total": 0,
            "object": {
              "id": 0,
              "title": '',
              "createUser": '',
              "minPrice": 0,
              "maxPrice": 0,
              "podID": 0,
              "destinationID": 0
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
            arr[k]['number'] = arr[k]['id']
            arr[k]['status'] = "状态"
            arr[k]['createTime'] = '2016-05-03-收款时间'
            arr[k]['plan'] = '团期计划'
            arr[k]['orderNum'] = '订单号'
            arr[k]['sameTrade'] = '同业社名称'
            arr[k]['collectionAccount'] = "收款账户"
            arr[k]['money'] = "金额"
            arr[k]['orinaze'] = '申请组织:国内部'
            arr[k]['accpter'] = 'tester申请人'
            arr[k]['opinion'] = '同意'
            arr[k]['applyTime'] = '2016-05-03-申请时间'
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
          this.GLOBAL.serverSrc + "/team/api/teamsearch", {
            "pageIndex": val,
            "pageSize": this.pageSize,
            "total": 0,
            "object": {
              "id": 0,
              "title": '',
              "createUser": '',
              "minPrice": 0,
              "maxPrice": 0,
              "podID": 0,
              "destinationID": 0
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
            arr[k]['number'] = arr[k]['id']
            arr[k]['status'] = "状态"
            arr[k]['createTime'] = '2016-05-03-收款时间'
            arr[k]['plan'] = '团期计划'
            arr[k]['orderNum'] = '订单号'
            arr[k]['sameTrade'] = '同业社名称'
            arr[k]['collectionAccount'] = "收款账户"
            arr[k]['money'] = "金额"
            arr[k]['orinaze'] = '申请组织:国内部'
            arr[k]['accpter'] = 'tester申请人'
            arr[k]['opinion'] = '同意'
            arr[k]['applyTime'] = '2016-05-03-申请时间'
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
      this.detailstShow = true;
    },
    closeDetailstShow(){//取消关闭查看详情弹窗
      this.detailstShow = false;
    },
    //获取一条信息查看详情
    getLabel(){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/get',{
            "id":this.paymentID
        }).then(res => {
          if(res.data.isSuccess == true){
             this.fundamental=res.data.object;
             this.tour_id = res.data.object.planID;
             this.getTourByPlanId(res.data.object.planID);
             this.getPaymentdetails(res.data.object.planID);
             /*res.data.object.files.forEach(function(v, k, arr) {
                  that.fileList.push({
                    "url": that.GLOBAL.imgUrl + '/upload' + arr[k]['url'],
                    "name": arr[k]['name'],
                  });
                })*/
          }
       })
      },
    //添加收款
    dialogchange() {
      this.find = 0;
      this.change = false
      this.dialogFormVisible = true;
    },
    //重置搜索条件
    resetHand() {

    },
    //搜索按钮
    searchHand() {

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
    //查询列表
      pageList() {
        //let objectRequest = {}
        //objectRequest.paymentType = 1;
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page",
          {
            "pageSize":this.pagesize,
            "pageIndex":this.currentPage,
            "total": 0,
            "object": {
              "collectionType":2,//直客1.同业2
              "localCompID":this.sid,//直客0,同业变成同业社id
            },
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableData = obj.data.objects
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },

  },
  /*created() {
    var that = this
    this.$http.post(
        this.GLOBAL.serverSrc + "/team/api/teamsearch", {
          "pageIndex": 1,
          "pageSize": this.pageSize,
          "total": 0,
          "object": {
            "id": 0,
            "title": '',
            "createUser": '',
            "minPrice": 0,
            "maxPrice": 0,
            "podID": 0,
            "destinationID": 0
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
          arr[k]['number'] = arr[k]['id']
          arr[k]['status'] = "审批中"
          arr[k]['createTime'] = '2016-05-03-收款时间'
          arr[k]['plan'] = '团期计划'
          arr[k]['orderNum'] = '订单号'
          arr[k]['sameTrade'] = '同业社名称'
          arr[k]['collectionAccount'] = "收款账户"
          arr[k]['money'] = "金额"
          arr[k]['orinaze'] = '申请组织:国内部'
          arr[k]['accpter'] = 'tester申请人'
          arr[k]['opinion'] = '同意'
          arr[k]['applyTime'] = '2016-05-03-申请时间'
        })
      })
      .catch(function(obj) {
        console.log(obj)
      })
  },*/
  mounted(){
    this.pageList();
  },
}

</script>
<style>
.all {margin-bottom: 100px;}

  .borders {
    border: 0px solid #E6E6E6;}

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
      width: 1100px;
      margin-left: 20px;
      margin-top: 20px;
      float: left;
    }

    .bright {
      width: 220px;
    }

    .bright2 {
      width: 70%;
    }
 .el-date-editor.el-input, .el-date-editor.el-input__inner{width:135px;}
 /*搜索框*/
  .empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
  .fl{float:left; margin: 20px 0 20px 0;}
  .emptyPlan{margin: 0 0 0 30px; float:left; width:80px; text-align:right; line-height:40px;}
  .planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
  .time{margin: 0 0 0 10px;}
  /*基本信息*/
  .basictable{margin:0 0 0 25px;}
  .basictd{width:400px; padding:15px 0 0 0;}
  .basicspan_01{width:80px; text-align:right;}
  .basicspan_02{margin:0 0 0 10px;}
  .checkType{padding: 0 5px; width:50px; margin:10px 0 0 0; border-radius:5px; color:#fff; line-height:30px; text-align:center;}

  /*关联欠款*/
  .associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc;width: 90%; margin: 0 0 0 25px; border-radius: 5px;overflow: hidden; }
  .associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
  .associatedItems{float:left; margin: 0 0 0 10px;}
  .associatedMoney{float:left; margin: 0 0 0 30px;}

</style>
