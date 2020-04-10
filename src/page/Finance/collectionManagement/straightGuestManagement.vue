<template>
  <div class="distributor-content">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" id="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
          <el-form-item label="申请人:" prop="createUser">
            <el-autocomplete style="width: 100%" class="name_input" v-model="ruleForm.createUser" :fetch-suggestions="querySearchBorrower"
              placeholder="请输入申请人" :trigger-on-focus="false" @select="departureBorrower" @blur="departureBorrowerBlur"
              @focus="departureBorrowerFocus"></el-autocomplete>
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
            <el-button @click="searchHandInside()" type="primary" :disabled="ifShowsearch">搜索</el-button>
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
      <el-table :data="tableData" border :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass"
        id="table-content">
        <el-table-column prop="id" label="收款单号" align="center">
        </el-table-column>
        <el-table-column prop="checkTypeStatus" label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.checkTypeStatus=='审批中'" style="color: #7F7F7F">{{scope.row.checkTypeStatus}}</div>
            <div v-if="scope.row.checkTypeStatus=='驳回'" style="color: #FF4A3D">{{scope.row.checkTypeStatus}}</div>
            <div v-if="scope.row.checkTypeStatus=='通过'" style="color: #33D174">{{scope.row.checkTypeStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="collectionTime" :formatter='dateFormat' label="收款时间" align="center">
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
            <el-button @click="dialogFind(scope.row)" type="text" size="small" class="table_details">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 30px;margin-left:-30%;text-align:center;">
        <!-- 分页 -->
        <el-row type="flex" class="paging">
          <el-col :span="8" :offset="13">
            <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getListForZK" />
          </el-col>
        </el-row>
        <!-- 分页 END -->
      </div>
    </div>
    <!-- <StraightGuestInfo :dialogFormVisible="dialogFormVisible" :find="find" :pid="pid" :change="change" :org="org" @searchHand="searchHand" :collectionAccountList="collectionAccountList" :accountList="accountList" @close="closeAdd" :dept="dept"></StraightGuestInfo> -->
   <addPage @getListForZK="getListForZK" :mode="mode" :dialogFormVisible="dialogFormVisible" :find="find" :pid="pid"
      :change="change" :org="org" @searchHand="searchHand" :collectionAccountList="collectionAccountList" :accountList="accountList"
      @close="closeAdd" :dept="dept"></addPage>
    <!--查看详情-->
    <el-dialog title="详情" :visible.sync="detailstShow" width="80%" style="margin:-80px 0 0 0;" custom-class="city_list"
      :show-close='false'>
      <div style="position:absolute; top:8px; right:10px;">
        <el-button @click="closeDetailstShow()">取消</el-button>
        <el-button type="danger" @click="repealDetailstShow" plain v-if="getRowCheckType != 1">撤销</el-button>
        <el-button type="success" @click="touchPrint" plain v-if="getOrgID == 491">
          打印本页详情信息
        </el-button>
      </div>
      <!-- 打印 -->
      <div ref="print">
        <div class="print-content" style="border-bottom: 1px dashed #ccc;">
          <div style="width: 100%;height: 40px; line-height: 40px; margin: 10px 0;text-align: center; font-weight: 500;font-size: 24px;">大运通收款凭证</div>
          <div class="print-same-table">
            <!-- 确认日期 -->
            <div>
              <table width="100%">
                <thead>
                  <tr>
                    <th>确认日期</th>
                    <th>确认人</th>
                    <th>收款状态</th>
                    <th>收款单号</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ printSureTime }}</td>
                    <td>{{ getUserName }}</td>
                    <td>{{ printSureState }}</td>
                    <td>{{ fundamental.id }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 部门 -->
            <div>
              <table width="100%">
                <thead>
                  <tr>
                    <th>部门</th>
                    <th>申请人</th>
                    <th>订单数</th>
                    <th>团号</th>
                    <th>订单号</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{fundamental.dept}}</td>
                    <td>{{ fundamental.createUser }}</td>
                    <td>1</td>
                    <td>{{ printGroupCode }}</td>
                    <td>{{ printOrderCode }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 交易方式 -->
            <div>
              <table width="100%">
                <thead>
                  <tr>
                    <th>应收金额</th>
                    <th>交易方式</th>
                    <th>实收金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ printPayablePrice }}</td>
                    <td>{{ fundamental.collectionNumber }}</td>
                    <td>{{ printMatchingPrice }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style="display: flex;justify-content: space-between;">
            <p>合计人民币： <span>{{ printMatchingPrice }}</span></p>
            <p>第一联 业务联</p>
          </div>
        </div>
        <div class="print-content" style="border-bottom: 1px dashed #ccc;">
          <div style="width: 100%;height: 40px; line-height: 40px; margin: 10px 0;text-align: center; font-weight: 500;font-size: 24px;">大运通收款凭证</div>
          <div class="print-same-table" v-for="item in tableAssociated" :key="item.id">
            <!-- 确认日期 -->
            <div>
              <table width="100%">
                <thead>
                  <tr>
                    <th>确认日期</th>
                    <th>确认人</th>
                    <th>收款状态</th>
                    <th>收款单号</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ printSureTime }}</td>
                    <td>{{ getUserName }}</td>
                    <td>{{ printSureState }}</td>
                    <td>{{ fundamental.id }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 部门 -->
            <div>
              <table width="100%">
                <thead>
                  <tr>
                    <th>部门</th>
                    <th>申请人</th>
                    <th>订单数</th>
                    <th>团号</th>
                    <th>订单号</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{fundamental.dept}}</td>
                    <td>{{ fundamental.createUser }}</td>
                    <td>1</td>
                    <td>{{ printGroupCode }}</td>
                    <td>{{ printOrderCode }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 交易方式 -->
            <div>
              <table width="100%">
                <thead>
                  <tr>
                    <th>应收金额</th>
                    <th>交易方式</th>
                    <th>实收金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ printPayablePrice }}</td>
                    <td>{{ fundamental.collectionNumber }}</td>
                    <td>{{ printMatchingPrice }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 发票 -->
            <div>
              <table width="100%">
                <thead>
                  <tr>
                    <th>发票类型</th>
                    <th>个人/单位</th>
                    <th>纳税人识别号</th>
                    <th>发票抬头</th>
                    <th>发票项目</th>
                    <th>金额</th>
                    <th>账号</th>
                    <th>开户行</th>
                    <th>地址</th>
                    <th>手机号</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="itemInvoice in tableInvoice">
                    <!--<td>{{ itemInvoice.invoiceID }}纸质发票 = 1</td>-->
                    <td>纸质发票</td>
                    <td>{{ itemInvoice.invoiceType == 1 ? '个人' : '单位' }}</td>
                    <td>{{ itemInvoice.invoiceNumber }}</td>
                    <td>{{ itemInvoice.invoiceHeaderOrTel }}</td>
                    <!--<td>{{ itemInvoice.invoiceItem }} 1旅游费</td>-->
                    <td>旅游费</td>
                    <td>{{ itemInvoice.invoicePrice }}</td>
                    <td>{{ itemInvoice.cardNumber }}</td>
                    <td>{{ itemInvoice.bankName }}</td>
                    <td>{{ itemInvoice.address }}</td>
                    <td>{{ itemInvoice.tel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style="display: flex;justify-content: space-between;">
            <p>合计人民币： <span>{{ printMatchingPrice }}</span></p>
            <p>第二联 财务联</p>
          </div>
        </div>
      </div>
      <!-- 打印 END -->
      <div>
        <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
        <div class="item-content">
          <el-tag type="warning" v-if="fundamental.checkType=='0'" class="distributor-status">审批中</el-tag>
          <el-tag type="danger" v-if="fundamental.checkType=='2'" class="distributor-status">驳回</el-tag>
          <el-tag type="success" v-if="fundamental.checkType=='1'" class="distributor-status">通过</el-tag>
        </div>
        <!-- 第一行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color ">ID:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del ">{{ fundamental.id }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color ">申请人:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del ">{{ fundamental.createUser }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">创建时间:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del ">{{ fundamental.createTime | formatDate }}</div>
            </el-col>
          </el-col>
        </el-row>
        <!-- 第一行 END -->
        <!-- 第二行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">交易流水号:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del">{{ fundamental.serialNumber }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">收款账户:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del ">{{ fundamental.collectionNumber }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">收款金额:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del ">{{ fundamental.price }}</div>
            </el-col>
          </el-col>
        </el-row>
        <!-- 第二行 END -->
        <!-- 第三行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">收款时间:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del">{{ fundamental.collectionTime | formatDate }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">摘要:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del">{{ fundamental.abstract }}</div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">开发票:</div>
            </el-col>
            <el-col :span="18">
              <div class="grid-del ">{{ fundamental.invoice == 1 ?  '是' : '否' }}</div>
            </el-col>
          </el-col>
        </el-row>
        <!-- 第三行 END -->
        <!-- 第四行 -->
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <el-col :span="6">
              <div class="grid-del label-color">凭证:</div>
            </el-col>
            <el-col :span="18">
              <el-upload class="upload-demo" name="files" :file-list="fundamental.files" :show-file-list=true action="test"
                :disabled=true :on-preview="handlePreview">
              </el-upload>
            </el-col>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <!-- 第四行 END -->
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
          <el-table-column prop="invoiceID" label="发票类型" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceID == 1">纸质发票</div>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceType" label="个人/单位" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceType == 1">个人</div>
              <div v-if="scope.row.invoiceType == 2">单位</div>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceNumber" label="纳税人识别号" align="center"></el-table-column>
          <el-table-column prop="invoiceHeaderOrTel" label="发票抬头" align="center"></el-table-column>
          <el-table-column prop="invoiceItem" label="发票项目" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.invoiceItem == 1">旅游费</div>
            </template>
          </el-table-column>
          <el-table-column prop="invoicePrice" label="金额" align="center"></el-table-column>
          <el-table-column prop="cardNumber" label="账号" align="center"></el-table-column>
          <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
          <el-table-column prop="address" label="地址" align="center"></el-table-column>
          <el-table-column prop="tel" label="电话" align="center"></el-table-column>
        </el-table>
        <!-- 关联欠款 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
        <el-table :data="tableAssociated" border :header-cell-style="getRowClass">
          <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="date" label="出发日期" align="center"></el-table-column>
          <el-table-column prop="payablePrice" label="订单金额" align="center"></el-table-column>
          <el-table-column prop="arrearsPrice" label="未收金额" align="center"></el-table-column>
          <el-table-column prop="repaidPrice" label="已收金额" align="center"></el-table-column>
          <el-table-column prop="amountPrice" label="待审核金额" align="center"></el-table-column>
          <el-table-column prop="matchingPrice" label="本次收款金额" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import StraightGuestInfo from '@/page/Finance/collectionManagement/collectionInfo/straightGuestInfo'
  import Pagination from '@/components/Pagination'
  import moment from 'moment'
  import addPage from './collectionManagement-addPage/addPage.vue'
  export default {
    name: "straightGuestManagement",
    components: {
      moment,
      Pagination,
      StraightGuestInfo,
      addPage
    },
    data() {
      return {
        mode: 'ZK',
        printMatchingPrice: null,
        printPayablePrice: null,
        printOrderCode: null,
        printGroupCode: null,
        printSureTime: null, // 打印用 - 确认时间
        printSureState: null, // 状态
        getOrgID: null,
        getUserName: null,
        getRowCheckType: null, // 获取当前审批状态
        listLoading: true,
        page: 1,
        limit: 10,
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
        accepter: '',
        settlement_01: '',
        tableData: [],
        reable: true,
        dialogFormVisible: false,
        change: false,
        total: 0,
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
        detailstShow: false, //查看详情弹窗
        fundamental: {}, //查看详情基本信息数组
        tableAudit: [], //审核结果表格
        tableInvoice: [], //发票表格
        tableAssociated: [], //发票关联表
        paymentID: 0,
        tour_id: 0,
        currentRowId: null, // 当前行id
        tableDataBorrower: [],
        keepBorrowerUserCode: null, // 模糊查询之后选中事件获得 借款人对应的 usercode
        ifShowsearch: false,
      }
    },
    computed: {
      // 计算属性的 getter
      invoiceListCount() {
        return this.ruleForm.invoiceList.length - 1;
      }
    },
    filters: {
      formatDate: function(value) {
        return moment(value).format('YYYY-MM-DD')
      }
    },
    methods: {
      touchPrint() {
        this.$print(this.$refs.print)
      },
      // 起始时间格式转换
      dateFormat: function(row, column) {
        let date = row[column.property];
        if (date == undefined) {
          return '';
        }
        return moment(date).format('YYYY-MM-DD')
      },
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
          var results = queryBorrowerString ? this.tableDataBorrower.filter(this.createFilteBorrowerr(
            queryBorrowerString)) : [];
          cb(results)
        }).catch(err => {})
      },
      // 模糊查询返回下拉选中项 - 查询返回userCode的（借款人）
      createFilteBorrowerr(queryString1) {
        return (restaurant) => {
          return (restaurant.userCode);
        }
      },
      // 借款人选中
      departureBorrower(item) {
        this.keepBorrowerUserCode = item.userCode
      },
      // 借款人 失焦
      departureBorrowerBlur() {
        if (this.ruleForm.createUser == '') {
          this.ifShowsearch = false
        } else {
          if (this.keepBorrowerUserCode == null) {
            this.ifShowsearch = false
            this.ruleForm.createUser = ''
            // this.$message.success("无相关借款人");
          } else {
            this.ifShowsearch = true
          }
        }
      },
      // 借款人 获得焦点
      departureBorrowerFocus() {
        this.ifShowsearch = true
      },
      moment,
      // 重置
      emptyButtonInside() {
        this.$refs['ruleForm'].resetFields()
      },
      // 搜索
      searchHandInside() {
        var that = this
        that.page = 1
        that.limit = 10
        this.listLoading = true
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": that.page,
            "pageSize": that.limit,
            "total": 0,
            "object": {
              "id": 0,
              "checkType": that.ruleForm.checkType ? that.ruleForm.checkType : -1,
              // "collectionTime": "2019-05-16",
              "startTime": that.ruleForm.dateStart ? moment(that.ruleForm.dateStart).format('YYYY-MM-DD') : "2000-01-01",
              "endTime": that.ruleForm.dateEnd ? moment(that.ruleForm.dateEnd).format('YYYY-MM-DD') : "2099-05-16",
              // "groupCode": that.plan ? that.plan : '',
              "createUser": that.keepBorrowerUserCode ? that.keepBorrowerUserCode : '',
              "orderNumber": that.ruleForm.distributor ? that.ruleForm.distributor : '',
              "collectionType": 1, //直客1.同业2
              "localCompID": 0, //直客0,同业变成同业社id
            }
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          })
          .then(function(obj) {
            that.total = obj.data.total;
            that.tableData = obj.data.objects;
            that.tableData.forEach(function(v, k, arr) {
              arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
              arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
              arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
              arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
            })
            this.listLoading = false
          })
          .catch(function(obj) {})
      },
      closeAdd() {
        this.dialogFormVisible = false;
      },
      //查询详情
      dialogFind(row) {
        this.getRowCheckType = row.checkType
        this.currentRowId = row.id
        this.detailstShow = true;
        this.getLabel(row.id);
      },
      closeDetailstShow() { //取消关闭查看详情弹窗
        this.detailstShow = false;
        this.clearTableAssociated();
      },
      // 撤销直客收款详情填写
      repealDetailstShow() {
        this.$confirm("是否需要撤销该笔收款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/delete', {
            "id": this.currentRowId
          }).then(res => {
            if (res.data.isSuccess == true) {
              this.$message.success("撤销成功")
              this.tableData = res.data.object;
              this.detailstShow = false;
              this.getListForZK()
              if (this.$parent.$parent.$parent.$refs.PendingApprovalManagement) {
                this.$parent.$parent.$parent.$refs.PendingApprovalManagement.loadDataZK();
              }
              // 撤销通过同时工作流通过
              this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/getCollIDTG', {
                "datetime": moment(new Date().getTime()).format('YYYYMMDD'),
                "spname": sessionStorage.getItem('name'),
                "spstate": "通过",
                "spcontent": "",
                'checktype': 2,
                "id": this.pid,
                'SpCode': sessionStorage.getItem('userCode')
              }).then(res => {
                console.log(res, '通过res')
              }).catch(err => {
                console.log(err)
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "撤销收款已取消"
          });
        });
      },
      //添加收款
      dialogchange() {
        this.find = 0;
        this.change = false
        this.dialogFormVisible = true;
      },
      //搜索按钮
      searchHand() {
        this.getListForZK()
      },
      //获取id
      clickBanle(row, event, column) {
        this.pid = row['id'];
        this.reable = false;
        this.paymentID = row.paymentID;
        this.tour_id = row['planID']

      },
      getRowClass({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      getListForZK() {
        var that = this
        this.listLoading = true
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": that.page,
            "pageSize": that.limit,
            "object": {
              "id": 0,
              "checkType": that.ruleForm.checkType ? that.ruleForm.checkType : -1,
              "collectionTime": "2019-05-16",
              "startTime": that.ruleForm.dateStart ? moment(that.ruleForm.dateStart).format('YYYY-MM-DD') : "2000-01-01",
              "endTime": that.ruleForm.dateEnd ? moment(that.ruleForm.dateEnd).format('YYYY-MM-DD') : "2099-05-16",
              // "groupCode": this.plan ? this.plan : '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": that.keepBorrowerUserCode ? that.keepBorrowerUserCode : '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
              "collectionType": 1, //直客1.同业2
              "localCompID": 0, //直客0,同业变成同业社id
            }
          }, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          })
          .then(function(obj) {
            that.total = obj.data.total;
            that.tableData = obj.data.objects;
            that.tableData.forEach(function(v, k, arr) {
              arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
              arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
              arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
              arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
            })
            this.listLoading = false
          })
          .catch(function(obj) {})
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
          .catch(function(obj) {})
      },
      //获取一条信息
      clearTableAssociated() {
        this.tableAssociated = [];
      },
      // 获取直客收款的一条详情信息
      getLabel(id) {
        this.tableAssociated = [];
        var that = this
        this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/coll', {
          "id": id
        }).then(res => {
          //console.log(res.data.object.invoiceTable)
          if (res.data.isSuccess == true) {
            this.tableAssociated = res.data.object.arrears
            this.fundamental = res.data.object;
            this.tableInvoice = res.data.object.invoiceTable;
            this.tableAudit = res.data.object.spw
            this.tour_id = res.data.object.planID;

            this.printMatchingPrice = res.data.object.arrears[0].matchingPrice
            this.printPayablePrice = res.data.object.arrears[0].payablePrice
            this.printOrderCode = res.data.object.arrears[0].orderCode
            this.printGroupCode = res.data.object.arrears[0].groupCode

            if (res.data.object.spw.length > 0) {
              this.printSureTime = res.data.object.spw[0].createTime
              this.printSureState = res.data.object.spw[res.data.object.spw.length - 1].spState
            }
            if (this.tableData[0].orderNumber == res.data.object.orderNumber) {
              this.$http.post(
                  this.GLOBAL.serverSrc + "/finance/collection/api/getnumber", {
                    orderCode: res.data.object.orderNumber,
                    id: id
                  }
                )
                .then(res => {
                  //that.collectedMoney = res.data.isSuccess == true ? res.data.object.price : 0
                  that.collectedMoney = res.data.object.price
                })
                .catch(function(res) {
                  console.log(res)
                })
              this.$http.post(
                  this.GLOBAL.serverSrc + "/teamquery/get/api/receiptorder", {
                    orderCode: res.data.object.orderNumber,
                    ProeuctType: 1
                  }
                )
                .then(res => {
                  res.data.object.collectedMoney = that.collectedMoney
                  res.data.object.uncollectedMoney = res.data.object.payable - res.data.object.collectedMoney
                  //res.data.object.collectedMoney = that.examineMoney
                  // that.tableAssociated.push(res.data.object) 临时改动
                })
                .catch(function(res) {})
            }
          }
        })
      }
    },
    created() {
      this.getListForZK()
      this.getDept()
      this.getOrgID = sessionStorage.getItem('orgID')
      this.getUserName = sessionStorage.getItem('name')
    }
  }
</script>

<style lang="scss" scoped>
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;

    #form-content {
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;

      .el-select {
        width: 100% !important;
      }

      .line {
        text-align: center;
      }
    }

    .print-content {
      display: none;
      width: 100%;
    }

    .title-margin {
      margin-bottom: 30px;
    }

    .item-content {
      margin-bottom: 20px;
    }

    .title-margin-t {
      margin-top: 45px;
    }

    .el-divider__text {
      font-size: 17px !important
    }

    .distributor-status {
      margin-left: 40px;
    }

    .row-bg {
      padding: 13px 0;

      .grid-del {
        text-align: left;
        font-size: 14px;
      }

      .label-color {
        color: #909399;
      }

      .doc-mt-3 {
        margin-top: 3px;
      }
    }

    .add-style {
      margin-left: 1%;
      margin-top: 30px;
    }

    #table-content {
      width: 98%;
      margin: 10px auto 20px;
    }

    .block {
      margin-top: 30px;
    }
  }
</style>
