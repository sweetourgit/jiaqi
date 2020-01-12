<template>
  <div class="distributor-content">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" id="form-content">
      <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="申请人:" prop="proposer">
            <el-autocomplete
              style="width: 100%"
              class="name_input"
              v-model="ruleForm.proposer"
              :fetch-suggestions="querySearchBorrower"
              placeholder="请输入申请人"
              :trigger-on-focus="false"
              @select="departureBorrower"
              @blur="departureBorrowerBlur"
              @focus="departureBorrowerFocus"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报销单号:" prop="order">
            <el-input v-model="ruleForm.order " placeholder="请输入报销单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款时间:">
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
          <el-form-item>
            <el-button @click="searchHandInside()" type="primary" :disabled="ifShowsearch">搜索</el-button>
            <el-button @click="emptyButtonInside('ruleForm')" type="primary">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
    <!-- 列表 -->
    <el-table :data="tableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass" id="table-content" v-loading="listLoading" >
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeStatus" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F" >审批中</div>
          <div v-else-if="scope.row.checkType=='2'" style="color: #FF4A3D" >驳回</div>
          <div v-else-if="scope.row.checkType=='3'" style="color: #FF4A3D" >已认款</div>
          <div v-else="scope.row.checkType=='1'" style="color: #33D174" >通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="reimbursement" label="报销单号" align="center"></el-table-column>
      <el-table-column prop="loan" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
      <el-table-column prop="collectionTime" :formatter='dateFormat' label="申请时间" align="center"></el-table-column>
      <el-table-column prop="dept" label="申请人部门" align="center"></el-table-column>
      <!--<el-table-column prop="groupCode" label="团期计划" align="center">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.arrears" :key="index">{{item.groupCode}} <i v-if="index != scope.row.arrears.length-1">，</i> </span>
        </template>
      </el-table-column>-->
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="dialogFind(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表 END -->
    <!-- 翻页 -->
    <div class="block">
      <el-row type="flex" class="paging">
        <el-col :span="8" :offset="12">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="ruleForm.page"
            :limit.sync="ruleForm.limit"
            @pagination="getList"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 翻页 END -->
    <el-dialog title="报销详情" :visible.sync="detailstShow" width="80%" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close='false'>
      <div style="position:absolute; top:8px; right:10px;">
        <el-button @click="closeDetailstShow()">取消</el-button>
      </div>
      <div class="item-content">
        <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
        <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
        <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
        <el-tag type="success" v-if="fundamental.checkType=='3'" class="distributor-status">已认款</el-tag>
      </div>
      <div>
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">收款单号:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.id }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color ">申请人:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createUser }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">申请时间:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.createTime | formatDate }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">报销单号:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.reimbursement }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">借款单号:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.loan }}</div></el-col>
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
            <el-col :span="6"><div class="grid-del label-color">汇款/现金:</div></el-col>
            <el-col :span="18">
              <div class="grid-del">{{ fundamental.accountID == 13 ? '现金' : '汇款' }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">收款账户:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.collectionNumber }}</div></el-col>
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
        <!-- 第三行 END -->
        <!-- 基本信息 -->
      </div>
      <!--<el-divider content-position="left" class='title-margin title-margin-t'>报销信息</el-divider>-->
      <el-table :data="tableDataZH" border :highlight-current-row="true"  :header-cell-style="getRowClass" id="table-content" v-loading="listLoading" style="width: 100%" v-if="isShowZH">
        <el-table-column prop="transaction_reference_number" label="交易流水号" align="center" fixed="left" width="180"></el-table-column>
        <el-table-column prop="transaction_Date" label="交易日期" align="center" width="100"></el-table-column>
        <el-table-column prop="transaction_Time" label="交易时间" align="center" width="100"></el-table-column>
        <el-table-column prop="trade_Currency" label="交易货币" align="center" width="80"></el-table-column>
        <el-table-column prop="trade_Amount" label="交易金额" align="center" width="100"></el-table-column>
        <el-table-column prop="value_Date" label="起息日期" align="center" width="100"></el-table-column>
        <el-table-column prop="exchange_rate" label="汇率" align="center" width="80"></el-table-column>
        <el-table-column prop="record_ID" label="记录标识号" align="center" width="200"></el-table-column>
        <el-table-column prop="reference" label="摘要" align="center" width="200"></el-table-column>
        <el-table-column prop="purpose" label="用途" align="center" width="200"></el-table-column>
        <el-table-column prop="remark" label="交易附言" align="center" width="90"></el-table-column>
        <el-table-column prop="transaction_Type" label="交易类型" align="center" width="90"></el-table-column>
        <el-table-column prop="business_type" label="业务类型" align="center" width="90"></el-table-column>
        <el-table-column prop="account_holding_bank_number_of_payer" label="付款人开户行号" align="center" width="200"></el-table-column>
        <el-table-column prop="payer_account_bank" label="付款人开户行名" align="center" width="200"></el-table-column>
        <el-table-column prop="debit_Account_No" label="付款人账号" align="center" width="200"></el-table-column>
        <el-table-column prop="payer_s_Name" label="付款人姓名" align="center" width="180"></el-table-column>
        <el-table-column prop="account_holding_bank_number_of_beneficiary" label="收款人开户行号" align="center" width="200"></el-table-column>
        <el-table-column prop="beneficiary_account_bank" label="收款人开户行名" align="center" width="200"></el-table-column>
        <el-table-column prop="payee_s_Account_Number" label="收款人账号" align="center" width="200"></el-table-column>
        <el-table-column prop="payee_s_Name" label="收款人姓名" align="center" fixed="right" width="200"></el-table-column>
      </el-table>
      <el-table v-if="isShowXY" :data="tableDataXY" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content2">
        <el-table-column prop="bank_serial_number" label="银行流水号" align="center">
        </el-table-column>
        <el-table-column prop="reference" label="摘要" align="center">
        </el-table-column>
        <el-table-column prop="transaction_Date" label="交易日期" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.transaction_Date.split('T')[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transaction_Date" label="交易时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.transaction_Date.split('T')[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purpose" label="用途" align="center">
        </el-table-column>
        <el-table-column prop="credit_amount" label="贷方金额" align="center">
        </el-table-column>
        <el-table-column prop="account_number" label="账号" align="center">
        </el-table-column>
        <el-table-column prop="account_name" label="户名" align="center">
        </el-table-column>
        <el-table-column prop="certificate_code" label="凭证代号" align="center">
        </el-table-column>
        <el-table-column prop="currency" label="币种" align="center">
        </el-table-column>
        <el-table-column prop="cash_or_transfer" label="现/转" align="center">
        </el-table-column>
        <el-table-column prop="debit_amount" label="借方金额" align="center">
        </el-table-column>
        <el-table-column prop="account_number_other" label="对方账号" align="center">
        </el-table-column>
        <el-table-column prop="account_name_other" label="对方户名" align="center">
        </el-table-column>
        <el-table-column prop="bank_other" label="对方银行" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
        </el-table-column>
      </el-table>
      <!-- 微信支付宝明细认款信息 -->
      <el-table v-if="isShowMX" :data="tableDataMX" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content3">
        <el-table-column prop="transaction_time" label="交易时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.transaction_time.split('T')[0] + ' ' + scope.row.transaction_time.split('T')[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transaction_amount" label="交易金额" align="center">
        </el-table-column>
        <el-table-column prop="preferential_amount" label="优惠金额" align="center">
        </el-table-column>
        <el-table-column prop="actual_amount" label="实收金额" align="center">
        </el-table-column>
        <el-table-column prop="refund_amount" label="退款金额" align="center">
        </el-table-column>
        <el-table-column prop="merchant_order_number" label="商户订单号" align="center">
        </el-table-column>
        <el-table-column prop="platform_order_number" label="平台订单号" align="center">
        </el-table-column>
        <el-table-column prop="channel" label="所属渠道" align="center">
        </el-table-column>
        <el-table-column prop="merchant_code" label="商户编号" align="center">
        </el-table-column>
        <el-table-column prop="merchant_name" label="商户名称" align="center">
        </el-table-column>
        <el-table-column prop="payment_type" label="支付类型" align="center">
        </el-table-column>
        <el-table-column prop="trading_status" label="交易状态" align="center">
        </el-table-column>
        <el-table-column prop="currency" label="币种" align="center">
        </el-table-column>
        <el-table-column prop="transaction_type" label="交易类型" align="center">
        </el-table-column>
        <el-table-column prop="transaction_issuer" label="交易发卡行" align="center">
        </el-table-column>
        <el-table-column prop="terminal_type" label="终端类型" align="center">
        </el-table-column>
        <el-table-column prop="trade_name" label="商品名称" align="center">
        </el-table-column>
        <el-table-column prop="operator_number" label="操作员编号" align="center">
        </el-table-column>
        <el-table-column prop="device_number" label="设备号" align="center">
        </el-table-column>
        <el-table-column prop="shop_number" label="门店编号" align="center">
        </el-table-column>
        <el-table-column prop="third_party_merchant_number" label="第三方商户号" align="center">
        </el-table-column>
        <el-table-column prop="apPid" label="appID" align="center">
        </el-table-column>
        <el-table-column prop="third_party_order_number" label="第三方订单号" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="付款备注" align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import Pagination from '@/components/Pagination'
  export default {
    name: "Reimbursement",
    components: {
      Pagination
    },
    data() {
      return {
        tableDataBorrower:[],
        ruleForm: {
          proposer: '', // 申请人
          order: '', // 订单
          dateStart: '', // 收款开始时间
          dateEnd: '', // 收款结束时间
          page: 1,
          limit: 10
        },
        total: 0,
        pageSize: 10, // 当前页item数量
        pageNum: 1, // 当前第几页
        keepBorrowerUserCode: null, // 模糊查询之后选中事件获得 借款人对应的 usercode
        ifShowsearch: false,
        tableData: [
          /*{
            id: 22223434, // 收款单号
            checkType: 2, // 状态
            reimbursement: 21, // 报销单号
            loan: 218920, // 借款单号
            price: 500, // 收款金额
            collectionTime: 2019, // 收款时间
            dept: '日韩', // 收款部门
            createUser: '洋洋', // 申请人
          }*/
        ],
        tableDataZH: [],
        isShowZH: false,
        tableDataXY: [],
        isShowXY: false,
        tableDataMX: [],
        isShowMX: false,
        listLoading: false,
        detailstShow: false,
        fundamental: {
          /*'checkType': 2,
          'id': 33,
          'createUser': '洋洋',
          'createTime': 2019,
          'reimbursement': 'w00',
          'loan': 22214,
          'price': 333,
          'accountID': 312,
          'collectionNumber': 22334*/
        },
        tableAssociatedId: null
      }
    },
    created(){
      this.getList()
      // this.getOrgID = sessionStorage.getItem('orgID')
      // this.getUserName = sessionStorage.getItem('name')
    },
    filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      searchHandInside(){
        this.listLoading = true
        let _this = this
        /*this.page = 1
        this.limit = 10*/
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          "pageIndex": 1,
          "pageSize": this.pageSize,
          "total": 0,
          "object": {
            "id": 0,
            // "collectionTime": "2019-11-18",
            "groupCode": _this.ruleForm.plan ? _this.ruleForm.plan : '',
            "orderNumber": _this.ruleForm.order ? _this.ruleForm.order : '',
            "startTime": _this.ruleForm.dateStart ? moment(_this.ruleForm.dateStart).format('YYYY-MM-DD'): "2000-01-01",
            "endTime":  _this.ruleForm.dateEnd ? moment(_this.ruleForm.dateEnd) .format('YYYY-MM-DD'): "2019-09-26",
            'createUser': _this.keepBorrowerUserCode ? _this.keepBorrowerUserCode : "",
            'checkType': _this.ruleForm.checkType ? _this.ruleForm.checkType : -1,
            "collectionType": 6,
          }
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }})
          .then(function(obj) {
            _this.tableData = obj.data.objects;
            _this.listLoading = false
            _this.total = obj.data.total
          }).catch(function(obj) {})
      },
      // 取消关闭查看详情弹窗
      closeDetailstShow(){
        this.detailstShow = false;
      },
      // 详情
      dialogFind(row){
        this.getLabel(row.id)
        this.detailstShow = true
      },
      // 获取一条信息查看详情
      getLabel(paramsPaymentID){
        this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/coll',{
          "id":paramsPaymentID
        }).then(res => {
          if(res.data.isSuccess == true){
            this.fundamental=res.data.object;
            this.tableAssociatedId = res.data.object.arrears[0].id
          }
        }).then( () => {
          this.listLoading = true
          let _this = this
          this.$http.post(this.GLOBAL.serverSrc + '/finance/bankofchina/api/FindFlow',{
            "id":_this.tableAssociatedId
          }).then(res => {
            console.log(res.data.object.data)
            if(res.data.object.data[0] === null){
              this.isShowZH = false
              this.isShowXY = false
              this.isShowMX = false
            } else {
              if(res.data.object.type === 0){
                this.tableDataZH.length = 0
                this.tableDataZH.push(res.data.object.data);
                this.isShowZH = true;
              }else if(res.data.object.type === 1){
                this.tableDataXY.length = 0
                this.tableDataXY.push(res.data.object.data);
                this.isShowXY = true;
              }else if(res.data.object.type === 2){
                this.tableDataMX.length = 0
                this.tableDataMX.push(res.data.object.data);
                this.isShowMX = true;
              }
            }
            this.listLoading = false
          }).catch( err => {
            _this.isShowZH = false
            _this.isShowXY = false
            _this.isShowMX = false
            _this.tableDataZH.push({})
            _this.tableDataXY.push({})
            _this.tableDataMX.push({})
            _this.listLoading = false
          })
        })
      },
      // 获取同业关联列表
      getList() {
        this.listLoading = true
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": _this.ruleForm.page,
            "pageSize": _this.ruleForm.limit,
            "total": 0,
            "object": {
              "id": 0,
              "checkType": _this.ruleForm.checkType ? _this.ruleForm.checkType : -1,
              "collectionTime": "2019-05-16",
              "startTime": _this.ruleForm.dateStart ? moment(_this.ruleForm.dateStart).format('YYYY-MM-DD') : "2000-05-16",
              "endTime": _this.ruleForm.dateEnd ? moment(_this.ruleForm.dateEnd).format('YYYY-MM-DD') : "2099-05-16",
              "groupCode": _this.ruleForm.plan ? _this.ruleForm.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber":  _this.ruleForm.order ? _this.ruleForm.order : '',
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": _this.keepBorrowerUserCode ? _this.keepBorrowerUserCode : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
              "collectionType":6,
              "localCompID":_this.sid,
            }
          }
        ).then(function(obj) {
          _this.total = obj.data.total;
          _this.tableData = obj.data.objects;
          _this.listLoading = false
        /*  _this.tableData.forEach(function(v, k, arr) {
            arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
            arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
            arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
            arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
          })*/
        }).catch(function(obj) {})
      },
      moment,
      // 重置
      emptyButtonInside () {
        this.$refs['ruleForm'].resetFields()
      },
      // 借款人模糊检索
      querySearchBorrower(queryBorrowerString, cb) {
        this.tableDataBorrower = []
        this.$http.post(this.GLOBAL.serverSrc + '/org/api/userlist', {
          "object": {
            name: queryBorrowerString
          }
        }).then(res => {
          for (let i = 0; i < res.data.objects.length; i++) {
            this.tableDataBorrower.push({
              "value": res.data.objects[i].name,
              "userCode": res.data.objects[i].userCode
            })
          }
          var results = queryBorrowerString ? this.tableDataBorrower.filter(this.createFilteBorrowerr(queryBorrowerString)) : [];
          cb(results)
        }).catch(err => {})
      },
      // 借款人 获得焦点
      departureBorrowerFocus(){
        this.ifShowsearch = true
      },
      // 借款人 失焦
      departureBorrowerBlur(){
        if(this.ruleForm.proposer == ''){
          this.ifShowsearch = false
        }else {
          if(this.keepBorrowerUserCode == null){
            this.ifShowsearch = false
            this.ruleForm.proposer = ''
            // this.$message.success("无相关借款人");
          } else {
            this.ifShowsearch = true
          }
        }
      },
      // 借款人选中
      departureBorrower (item) {
        this.keepBorrowerUserCode = item.userCode
      },
      clickBanle(){

      },
      // 起始时间格式转换
      dateFormat: function(row, column) {
        let date = row[column.property];
        if(date == undefined) {
          return '';
        }
        return moment(date).format('YYYY-MM-DD')
      },
      // 模糊查询返回下拉选中项 - 查询返回userCode的（借款人）
      createFilteBorrowerr(queryString1){
        return (restaurant) => {
          return (restaurant.userCode);
        }
      },
      getRowClass ({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      }
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
    .print-content{
      display: none;
      width: 100%;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .item-content{
      margin-bottom: 20px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
    .distributor-status{
      margin-left: 40px;
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
    .add-style{
      margin-left: 1%;
      margin-top: 30px;
    }
    #table-content{
      width: 98%;
      margin: 10px auto 20px;
    }
    .block {
      margin-top: 30px;
    }
  }
</style>
