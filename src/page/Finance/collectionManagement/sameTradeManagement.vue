<template>
  <!--  收款管理 同业 -->
  <div class="distributor-content">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" id="form-content">
      <el-row type="flex">
        <el-col :span="8">
          <el-form-item label="团期计划:" prop="plan">
            <el-input v-model="ruleForm.plan" placeholder="请输入团期计划"></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item label="订单:" prop="order">
            <el-input v-model="ruleForm.order " placeholder="请输入订单"></el-input>
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
    <!-- 添加 -->
      <div class="reform">
        <el-button type="primary" @click="addSameGathering" class="add-style">添加</el-button>
      </div>
    <!-- 添加 END -->
    <!-- 同业数据列表 -->
    <el-table :data="tableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass" id="table-content" v-loading="listLoading" >
      <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeStatus" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F" >审批中</div>
          <div v-else-if="scope.row.checkType=='2'" style="color: #FF4A3D" >驳回</div>
          <div v-else-if="scope.row.checkType=='3'" style="color: #FF4A3D" >已认款</div>
          <div v-else="scope.row.checkType=='1'" style="color: #33D174" >通过</div>
        </template>
      </el-table-column>
      <el-table-column prop="collectionTime" :formatter='dateFormat' label="收款时间" align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.arrears" :key="index">{{item.groupCode}} <i v-if="index != scope.row.arrears.length-1">，</i> </span>
        </template>
      </el-table-column>
      <el-table-column prop="orderCode" label="订单号" align="center">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.arrears" :key="index">{{item.orderCode}} <i v-if="index != scope.row.arrears.length-1">，</i> </span>
        </template>
      </el-table-column>
      <el-table-column prop="localCompName" label="同业社名称" align="center"></el-table-column>
      <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
<!--      <el-table-column prop="" label="审批意见" align="center"></el-table-column>-->
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="dialogFind(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 同业数据列表 END -->
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
    <!-- 添加同业数据弹窗 -->
    <SameTradeInfo :dialogFormVisible="dialogFormVisible" :find="find" :change="change" @close="closeAdd"></SameTradeInfo>
    <!-- 添加同业数据弹窗 END -->
    <!-- 查看详情 弹窗 -->
    <el-dialog title="详情" :visible.sync="detailstShow" width="80%" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close='false'>
      <div style="position:absolute; top:8px; right:10px;">
        <el-button @click="closeDetailstShow()">取消</el-button>
        <el-button type="danger" @click="repealDetailstShow" plain v-if="getRowCheckType == 0 || getRowCheckType == 2 ">撤销</el-button>
      </div>
      <div>
        <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
        <!-- 基本信息 -->
        <div class="item-content">
          <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
          <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
          <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
          <el-tag type="success" v-if="fundamental.checkType=='3'" class="distributor-status">已认款</el-tag>
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
            <el-col :span="6"><div class="grid-del label-color">同业社名称:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.localCompName }}</div></el-col>
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
            <el-col :span="6"><div class="grid-del label-color">收款时间:</div></el-col>
            <el-col :span="18">
              <div class="grid-del">{{ fundamental.collectionTime | formatDate }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">摘要:</div></el-col>
            <el-col :span="18"><div class="grid-del">{{ fundamental.abstract }}</div></el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">开发票:</div></el-col>
            <el-col :span="18"><div class="grid-del ">{{ fundamental.invoice == 1 ?  '是' : '否' }}</div></el-col>
          </el-col>
        </el-row>
        <!-- 第三行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6"><div class="grid-del label-color">凭证:</div></el-col>
            <el-col :span="18">
              <el-upload
                class="upload-demo"
                name="files"
                ref="upload"
                :file-list="fundamental.files"
                :show-file-list=true
                action="test"
                :disabled=true
                :on-preview="handlePreview"
              >
              </el-upload>
            </el-col>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <!-- 第四行 END -->
        <!-- 基本信息 -->
        <!-- 审核结果 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>审核结果</el-divider>
        <el-table :data="tableAudit" border :header-cell-style="getRowClass">
           <el-table-column prop="createTime" label="审批时间" align="center"></el-table-column>
           <el-table-column prop="spName" label="审批人" align="center"></el-table-column>
           <el-table-column prop="spState" label="审批结果" align="center"></el-table-column>
           <el-table-column prop="spContent" label="审批意见" align="center"></el-table-column>
        </el-table>
        <!-- 审核结果 END -->
        <!-- 发票 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>发票</el-divider>
        <el-table :data="tableInvoice" border :header-cell-style="getRowClass">
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
        <!-- 发票 END -->
        <!-- 关联欠款 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
        <div class="associated">
          <div class="associatedIcon"><i class="el-icon-warning"></i></div>
          <div class="associatedItems">已关联<span style="font-weight: bold;">{{ tableManyRow }}</span>项</div>
          <div class="associatedMoney">总计：{{ getCollectionPriceTotal }}元</div>
        </div>
        <el-table :data="tableAssociated" border :header-cell-style="getRowClass">
           <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
           <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
           <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
           <el-table-column prop="date" label="出发日期" align="center"></el-table-column>
           <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
           <el-table-column prop="arrearsPrice" label="欠款金额" align="center"></el-table-column>
           <el-table-column prop="repaidPrice" label="已还金额" align="center"></el-table-column>
           <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
           <el-table-column prop="matchingPrice" label="本次收款金额" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 查看详情 END -->
  </div>
  <!--  收款管理 同业 END -->
</template>

<script type="text/javascript">
import SameTradeInfo from '@/page/Finance/collectionManagement/collectionInfo/sameTradeInfo'
import moment from 'moment'
import Pagination from '@/components/Pagination'

export default {
  name: "sameTradeManagement",
  components: {
    SameTradeInfo, // 添加同业信息弹窗
    Pagination
  },
  data() {
    return {
      tableDataBorrower:[],
      tableManyRow: null, // 关联欠款表格共多少行
      getCollectionPriceTotal: 0, // 当前收款总额（合计）
      getRowCheckType: null, // 获取当前审批状态
      ruleForm: {
        proposer: '', // 申请人
        plan: '', // 团期计划
        order: '', // 订单
        checkType: '', // 状态
        dateStart: '', // 收款开始时间
        dateEnd: '', // 收款结束时间
        page: 1,
        limit: 10
      },
      listLoading: true,
      reable: true,
      currentPage: 1,
      total: 0,
      pageSize: 10, // 当前页item数量
      pageNum: 1, // 当前第几页
      tableData: [], // 收款管理表格
      find: 0,
      change: false,
      dialogFormVisible: false, // 申请同业收款开关
      detailstShow:false, // 查看详情弹窗（是否显示）
      fundamental:{}, // 查看详情基本信息数组
      tableAudit:[], // 审核结果表格
      tableInvoice:[],  // 发票表格
      tableAssociated:[],  // 发票关联表格
      sid:0,
      currentRowId: null, // 当前行id
      keepBorrowerUserCode: null, // 模糊查询之后选中事件获得 借款人对应的 usercode
      ifShowsearch: false,
    }
  },
  created(){
    this.getList()
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    // 点击图片钩子
    handlePreview(file) {
      window.open(file.url);
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
    // 借款人选中
    departureBorrower (item) {
      this.keepBorrowerUserCode = item.userCode
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
    // 借款人 获得焦点
    departureBorrowerFocus(){
      this.ifShowsearch = true
    },
    // 模糊查询返回下拉选中项 - 查询返回userCode的（借款人）
    createFilteBorrowerr(queryString1){
      return (restaurant) => {
        return (restaurant.userCode);
      }
    },
    // 获取同业关联列表
    getList() {
      this.listLoading = true
      let _this = this
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          "pageIndex": this.ruleForm.page,
          "pageSize": this.ruleForm.limit,
          "total": 0,
          "object": {
            "id": 0,
            "checkType": this.settlement_01 ? this.settlement_01 : -1,
            "collectionTime": "2019-05-16",
            "startTime": this.startTime ? formatDate(this.startTime, 'YYYY-MM-DD HH:mm:ss') : "2000-05-16",
            "endTime": this.endTime ? formatDate(this.endTime, 'YYYY-MM-DD HH:mm:ss') : "2099-05-16",
            "groupCode": this.plan ? this.plan : '',
            "planID": 0,
            "orderID": 0,
            "orderNumber": "",
            "collectionNumber": "",
            "price": 0,
            "dept": 0,
            "createUser": this.keepBorrowerUserCode ? this.keepBorrowerUserCode : '',
            "createTime": "2019-05-16 01:02:40",
            "code": "",
            "serialNumber": "",
            "abstract": "",
            "isDeleted": 0,
            "collectionType":2, // 直客1.同业2
            "localCompID":this.sid, // 直客0,同业变成同业社id
            //"localCompName":""
          }
        }
      ).then(function(obj) {
        _this.total = obj.data.total;
        _this.tableData = obj.data.objects;
        _this.listLoading = false
        _this.tableData.forEach(function(v, k, arr) {
          arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
          arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
          arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
          arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
        })
      }).catch(function(obj) {})
    },
    moment,
    // 重置
    emptyButtonInside () {
      this.$refs['ruleForm'].resetFields()
    },
    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 表单搜索收款时间
    searchHandInside () {
      let _this = this
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
            "collectionType": 2,
          }
        }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }})
        .then(function(obj) {
          _this.tableData = obj.data.objects;
        }).catch(function(obj) {})
    },
    // 关闭申请同业收款弹窗
    closeAdd(data) {
      if(data){
        this.getList()
      }
      this.dialogFormVisible = false;
    },
    // 查询详情
    dialogFind(row) {
      this.getRowCheckType = row.checkType
      this.currentRowId = row.id
      this.getLabel(row.id)
      //this.find = 1;
      //this.change = true
      this.detailstShow = true;
    },
    // 取消关闭查看详情弹窗
    closeDetailstShow(){
      this.detailstShow = false;
    },
    // 撤销同业收款详情填写
    repealDetailstShow(){
      this.$confirm("是否需要撤销该笔收款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/delete',{
        "id":this.currentRowId
      }).then(res => {
        if(res.data.isSuccess == true){
          this.$message.success("撤销成功")
          this.tableData=res.data.object;
          this.detailstShow = false;
          this.getList()
          if(this.$parent.$parent.$parent.$refs.PendingApprovalManagement){
            this.$parent.$parent.$parent.$refs.PendingApprovalManagement.loadDataTY();
          };
        }
      })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "撤销收款已取消"
        });
      });
    },
    // 获取同业社列表
    /*getLcList (paramsLcID) {
      var that =this
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/getArrearsList', {
        lcID: paramsLcID
      }).then(obj => {
        that.tableAudit = obj.data.extend.instanceLogInfo;
      }).catch(obj => {})
    },*/
    // 获取一条信息查看详情
    getLabel(paramsPaymentID){
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/coll',{
          "id":paramsPaymentID
      }).then(res => {
        if(res.data.isSuccess == true){
          const resObj = res.data.object
           this.fundamental=res.data.object;
          const keepDebtItem = resObj.arrears
           // this.getLcList(res.data.object.id)
          this.tableAudit = res.data.object.spw
          this.tableInvoice = res.data.object.invoiceTable
          this.tableManyRow = resObj.arrears.length
          this.tableAssociated = res.data.object.arrears
          keepDebtItem.forEach( item => {
            this.getCollectionPriceTotal += item.matchingPrice
          })
        }
     })
    },
    // 添加申请同业收款
    addSameGathering () {
      this.find = 0;
      this.change = false
      this.dialogFormVisible = true;
    },
    // 获取id
    clickBanle(row, event, column) {
      this.pid = row['id'];
      this.reable = false;
    },
    // 为所有表头单元格设置一样的 Style
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

  .upload-demo{width: 400px;}
  .upload-demo>>>.el-upload-list__item{ width: 300px; }

  .el-dialog__wrapper{top:-10%;}
  .upload-demo>>>.el-upload-list__item:first-child {
    margin-top: 5px;
  }
  /*关联欠款*/
  .associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc; border-radius: 5px;overflow: hidden; }
  .associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
  .associatedItems{float:left; margin: 0 0 0 10px;}
</style>
