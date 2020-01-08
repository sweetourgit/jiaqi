<template>
  <div class="distributor-content">
    <el-tabs :tab-position="tabPosition" class="tabsPosition" v-model="activeName">
      <!-- 直客模块 -->
      <el-tab-pane :label="'直客(' + numZK + ')'" name="first">
        <!-- 直客表格 -->
        <!-- 直客搜索begin -->
        <div class="search">
          <span class="searchName">团期计划</span>
          <el-input v-model="groupCodeZK" class="searchInput"></el-input>
          <span class="searchName">申请人</span>
          <!-- <el-input v-model="createUserZK" class="searchInput"></el-input> -->
          <el-autocomplete
            v-model="createUserZK"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
          <span class="searchName">收款时间</span>
          <el-date-picker
            v-model="startTimeZK"
            type="date"
            placeholder="开始日期"
            class="startTime"
            @change="endDateChange(startTimeZK,endTimeZK)"
          ></el-date-picker>
          <div class="dateLine"></div>
          <el-date-picker
            v-model="endTimeZK"
            type="date"
            placeholder="终止日期"
            class="startTime"
            @change="endDateChange(startTimeZK,endTimeZK,)"
          ></el-date-picker>
          <br />
          <span class="searchName">状态</span>
          <el-select v-model="checkTypeStatusZK" placeholder="请选择" style="width: 150px;">
            <el-option
              label="审批中" value="0"
            ></el-option>
          </el-select>
          <span class="searchName">收款账户</span>
          <el-input v-model="collectionNumberZK" class="searchInput"></el-input>
          <el-button type="primary" class="searchBtn" @click="handleSearchBtnZK">搜索</el-button>
          <el-button type="primary" class="searchBtn" @click="handleResetBtnZK">重置</el-button>
        </div>
        <!-- 直客搜索end -->

        <el-table
          :data="tableDataZK"
          border
          class="tableData"
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          id="table-content1"
          v-loading="loadingZK"
        >
          <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="checkTypeStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
              <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
              <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime" label="收款时间" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.groupCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" label="订单号" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.orderCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="collectionNumber" label="收款账户" align="center">
          </el-table-column>-->
          <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
          <!-- <el-table-column prop="dept" label="申请组织" align="center">
          </el-table-column>-->
          <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          <!-- <el-table-column prop="createTime" label="申请时间" align="center">
          </el-table-column>-->
          <!--<el-table-column prop="" label="审批意见" align="center">-->
          <!--</el-table-column>-->
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                @click="approvalZK(scope.row)"
                type="text"
                size="small"
                class="table_details"
              >审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            class="pageList"
            :page-sizes="[10,20,30,50]"
            background
            @size-change="handleSizeChangeZK"
            :page-size="pagesizeZK"
            :current-page.sync="currentPageZK"
            @current-change="handleCurrentChangeZK"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalZK"
          ></el-pagination>
        </div>
        <!-- 直客表格 END -->
      </el-tab-pane>
      <!-- 直客模块 END -->
      <!-- 同业模块 -->

      <el-tab-pane :label="'同业(' + numTY + ')'" name="second">
        <!-- 同业搜索begin -->
        <div class="search">
          <span class="searchName">团期计划</span>
          <el-input v-model="groupCodeTY" class="searchInput"></el-input>
          <span class="searchName">申请人</span>
          <el-autocomplete
            v-model="createUserTY"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
          <span class="searchName">收款时间</span>
          <el-date-picker
            v-model="startTimeTY"
            type="date"
            placeholder="开始日期"
            class="startTime"
            @change="endDateChange(startTimeTY,endTimeTY)"
          ></el-date-picker>
          <div class="dateLine"></div>
          <el-date-picker
            v-model="endTimeTY"
            type="date"
            placeholder="终止日期"
            class="startTime"
            @change="endDateChange(startTimeTY,endTimeTY)"
          ></el-date-picker>
          <br />
          <span class="searchName">状态</span>
          <el-select v-model="checkTypeStatusTY" placeholder="请选择" style="width: 150px;">
            <el-option
              label="审批中" value="0"
            ></el-option>
          </el-select>
          <span class="searchName">收款账户</span>
          <el-input v-model="collectionNumberTY" class="searchInput"></el-input>
          <el-button type="primary" class="searchBtn" @click="handleSearchBtnTY">搜索</el-button>
          <el-button type="primary" class="searchBtn" @click="handleResetBtnTY">重置</el-button>
        </div>
        <!-- 同业搜索end -->
        <!-- 同业表格 -->
        <el-table
          :data="tableDataTY"
          border
          class="tableData"
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          id="table-content2"
          v-loading="loadingTY"
        >
          <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="checkTypeStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
              <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
              <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime" label="收款时间" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.groupCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" label="订单号" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.orderCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="localCompName" label="同业社名称" align="center"></el-table-column>
          <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          <!--<el-table-column prop="" label="审批意见" align="center"></el-table-column>-->
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="approvalTY(scope.row)" type="text" size="small">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            class="pageList"
            :page-sizes="[10,20,30,50]"
            background
            @size-change="handleSizeChangeTY"
            :page-size="pagesizeTY"
            :current-page.sync="currentPageTY"
            @current-change="handleCurrentChangeTY"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalTY"
          ></el-pagination>
        </div>
        <!-- 同业表格 END -->
      </el-tab-pane>
      <!-- 同业模块 END -->
      <!-- 内部收款模块 -->
      <el-tab-pane :label="'内部收款(' + numNBSK + ')'" name="third">
        <!-- 内部收款表格 -->
        <el-table
          :data="tableDataNBSK"
          border
          class="tableData"
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          id="table-content3"
          v-loading="loadingNBSK"
        >
          <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="checkTypeStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
              <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
              <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime" label="收款时间" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.groupCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" label="订单号" align="center">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.arrears" :key="index">
                {{item.orderCode}}
                <i v-if="index != scope.row.arrears.length-1">，</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="localCompName" label="同业社名称" align="center"></el-table-column>
          <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          <!--<el-table-column prop="" label="审批意见" align="center"></el-table-column>-->
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="approvalNBSK(scope.row)" type="text" size="small">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            class="pageList"
            :page-sizes="[10,20,30,50]"
            background
            @size-change="handleSizeChangeNBSK"
            :page-size="pagesizeNBSK"
            :current-page.sync="currentPageNBSK"
            @current-change="handleCurrentChangeNBSK"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNBSK"
          ></el-pagination>
        </div>
        <!-- 内部收款表格 END -->
      </el-tab-pane>
      <!-- 内部收款模块 END -->

      <!-- 报销还款模块 -->
      <el-tab-pane :label="'报销还款(' + numBXHK + ')'" name="four">
        <!-- 报销还款表格 -->
        <el-table
          :data="tableDataBXHK"
          border
          class="tableData"
          :highlight-current-row="true"
          :header-cell-style="getRowClass"
          id="table-content3"
          v-loading="loadingBXHK"
        >
          <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="checkTypeStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
              <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
              <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="reimbursement" label="报销单号" align="center"></el-table-column>
          <el-table-column prop="loan" label="借款单号" align="center"></el-table-column>
          <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>
          <el-table-column prop="dept" label="申请人部门" align="center"></el-table-column>
          <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="approvalBXHK(scope.row)" type="text" size="small">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            class="pageList"
            :page-sizes="[10,20,30,50]"
            background
            @size-change="handleSizeChangeBXHK"
            :page-size="pagesizeBXHK"
            :current-page.sync="currentPageBXHK"
            @current-change="handleCurrentChangeBXHK"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalBXHK"
          ></el-pagination>
        </div>
        <!-- 报销还款表格 END -->
      </el-tab-pane>
      <!-- 报销还款模块 END -->
    </el-tabs>
    <approval :dialogFormVisible="dialogFormVisible" :info="info" @close="closeAdd"></approval>
  </div>
</template>
<script type="text/javascript">
import moment from "moment";
import approval from "@/page/Finance/collectionManagement/pendingApproval/approval.vue";
export default {
  name: "PendingApprovalManagement",
  components: {
    approval
  },
  data() {
    return {
      applyPeopleIpt: [], //申请人搜索下拉的集合
      applyPeopleChoose: {}, //选择搜索的申请人
      tabPosition: "left", // 左侧导航
      activeName: "first", // 当前tab项
      // 审批页面显示隐藏
      dialogFormVisible: false,
      info: "",

      // 直客
      numZK: 0, // 直客待审批
      tableDataZK: [], // 直客待审批列表
      loadingZK: true, // 直客列表loading
      pagesizeZK: 10, // 分页，每页条数
      currentPageZK: 1, // 分页，当前页数
      totalZK: 0, // 分页，总条数

      // 同业
      numTY: 0, // 同业待审批
      tableDataTY: [], // 同业待审批列表
      loadingTY: true, // 同业列表loading
      pagesizeTY: 10, // 分页，每页条数
      currentPageTY: 1, // 分页，当前页数
      totalTY: 0, // 分页，总条数
      sid: 0,

      // 内部收款
      numNBSK: 0, // 内部收款待审批
      tableDataNBSK: [], // 内部收款待审批列表
      loadingNBSK: true, // 内部收款列表loading
      pagesizeNBSK: 10, // 分页，每页条数
      currentPageNBSK: 1, // 分页，当前页数
      totalNBSK: 0, // 分页，总条数

      // 报销还款
      numBXHK: 0, // 内部收款待审批
      tableDataBXHK: [], // 内部收款待审批列表
      loadingBXHK: true, // 内部收款列表loading
      pagesizeBXHK: 10, // 分页，每页条数
      currentPageBXHK: 1, // 分页，当前页数
      totalBXHK: 0, // 分页，总条数

      // 直客搜索
      groupCodeZK: "", //团期计划
      createUserZK: "", //申请人
      startTimeZK: "", //开始时间
      endTimeZK: "", //结束时间
      checkTypeStatusZK: "", //状态
      collectionNumberZK: "", //收款账户

      // 同业搜索
      groupCodeTY: "", //团期计划
      createUserTY: "", //申请人
      startTimeTY: "", //开始时间
      endTimeTY: "", //结束时间
      checkTypeStatusTY: "", //状态
      collectionNumberTY: "" //收款账户
    };
  },
  filters: {
    formatDate: function(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    numZK: {
      handler: function() {
        this.$parent.$parent.$parent.totalNum =
          this.numZK + this.numTY + this.numNBSK + this.numBXHK;
      }
    },
    numTY: {
      handler: function() {
        this.$parent.$parent.$parent.totalNum =
          this.numZK + this.numTY + this.numNBSK + this.numBXHK;
      }
    },
    numNBSK: {
      handler: function() {
        this.$parent.$parent.$parent.totalNum =
          this.numZK + this.numTY + this.numNBSK + this.numBXHK;
      }
    },
    numBXHK: {
      handler: function() {
        this.$parent.$parent.$parent.totalNum =
          this.numZK + this.numTY + this.numNBSK + this.numBXHK;
      }
    }
  },
  methods: {
    moment,
    // 表格表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    // 直客审批
    approvalZK(row) {
      this.info = row;
      this.dialogFormVisible = true;
    },
    // 同业审批
    approvalTY(row) {
      this.info = row;
      this.dialogFormVisible = true;
    },
    // 内部收款审批
    approvalNBSK(row) {
      this.info = row;
      this.dialogFormVisible = true;
    },
    // 报销还款的审批
    approvalBXHK(row) {
      this.info = row;
      this.info.collectionType = 6;
      this.dialogFormVisible = true;
    },
    // 关闭弹框
    closeAdd() {
      this.dialogFormVisible = false;
      this.loadDataZK();
      this.loadDataTY();
      this.loadDataNBSK();
      this.loadDataBXHK();
      this.$parent.$parent.$parent.$refs.SameTradeManagement.getList();
      this.$parent.$parent.$parent.$refs.StraightGuestManagement.getStraightGuestManagement();
      this.$parent.$parent.$parent.$refs.distributorsInfo.getDataInside();
      this.$parent.$parent.$parent.$refs.reimbursement.getList();
    },
    // 加载直客信息及处理分页
    handleSizeChangeZK(val) {
      this.pagesizeZK = val;
      this.loadingZK = true;
      this.loadDataZK();
    },
    handleCurrentChangeZK(val) {
      this.currentPageZK = val;
      this.loadingZK = true;
      this.loadDataZK();
    },
    loadDataZK() {
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          pageIndex: this.currentPageZK,
          pageSize: this.pagesizeZK,
          object: {
            id: 0,
            checkType: 0,
            collectionTime: "2019-05-16",
            startTime: this.startTimeZK
              ? moment(this.startTimeZK).format("YYYY-MM-DD")
              : "2000-05-16",
            endTime: this.endTimeZK
              ? moment(this.endTimeZK).format("YYYY-MM-DD")
              : "2099-05-16",
            groupCode: this.groupCodeZK !== "" ? this.groupCodeZK : "",
            planID: 0,
            orderID: 0,
            orderNumber: "",
            collectionNumber: "",
            price: 0,
            dept: 0,
            createUser:
              this.applyPeopleChoose.userCode !== ""
                ? this.applyPeopleChoose.userCode
                : "",
            createTime: "2019-05-16 01:02:40",
            code: "",
            serialNumber: "",
            abstract: "",
            isDeleted: 0,
            collectionType: 1, // 直客1.同业2
            localCompID: 0 // 直客0,同业变成同业社id
            //"localCompName":""
          }
        })
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.totalZK = obj.data.total;
            that.numZK = obj.data.total;
            that.tableDataZK = obj.data.objects;
            that.tableDataZK.forEach(function(item, index, arr) {
              item.collectionTime = item.collectionTime.split("T")[0];
            });
            that.loadingZK = false;
          } else {
            that.totalZK = 0;
            that.numZK = 0;
            that.tableDataZK = [];
            that.loadingZK = false;
          }
        })
        .catch(function(obj) {});
    },

    // 直客搜索
    handleSearchBtnZK() {
      this.currentPageZK = 1;
      this.loadingZK = true;
      this.loadDataZK();
    },

    // 直客重置
    handleResetBtnZK() {
      this.groupCodeZK = "";
      this.createUserZK = "";
      this.startTimeZK = "";
      this.endTimeZK = "";
      this.checkTypeStatusZK = "";
      this.collectionNumberZK = "";
      // this.statusChange("审批中");
      this.loadingZK = true;
      this.applyPeopleChoose = [];
      this.loadDataZK();
    },

    // 加载同业信息及处理分页
    handleSizeChangeTY(val) {
      this.pagesizeTY = val;
      this.loadingTY = true;
      this.loadDataTY();
    },
    handleCurrentChangeTY(val) {
      this.currentPageTY = val;
      this.loadingTY = true;
      this.loadDataTY();
    },
    loadDataTY() {
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          pageIndex: this.currentPageTY,
          pageSize: this.pagesizeTY,
          object: {
            id: 0,
            checkType: 0,
            collectionTime: "2019-05-16",
            startTime:
              this.startTimeTY !== ""
                ? moment(this.startTimeTY).format("YYYY-MM-DD")
                : "2000-05-16",
            endTime:
              this.endTimeTY !== ""
                ? moment(this.endTimeTY).format("YYYY-MM-DD")
                : "2099-05-16",
            groupCode: this.groupCodeTY !== "" ? this.groupCodeTY : "",
            planID: 0,
            orderID: 0,
            orderNumber: "",
            collectionNumber: "",
            price: 0,
            dept: 0,
            createUser:
              this.applyPeopleChoose.userCode !== ""
                ? this.applyPeopleChoose.userCode
                : "",
            createTime: "2019-05-16 01:02:40",
            code: "",
            serialNumber: "",
            abstract: "",
            isDeleted: 0,
            collectionType: 2, // 直客1.同业2
            localCompID: this.sid // 直客0,同业变成同业社id
            //"localCompName":""
          }
        })
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.totalTY = obj.data.total;
            that.numTY = obj.data.total;
            that.tableDataTY = obj.data.objects;
            that.tableDataTY.forEach(function(item, index, arr) {
              item.collectionTime = item.collectionTime.split("T")[0];
            });
            that.loadingTY = false;
          } else {
            that.totalTY = 0;
            that.numTY = 0;
            that.tableDataTY = [];
            that.loadingTY = false;
          }
        })
        .catch(function(obj) {});
    },

    // 同业搜索
    handleSearchBtnTY() {
      this.currentPageTY = 1;
      this.loadingTY = true;
      this.loadDataTY();
    },

    // 同业重置
    handleResetBtnTY() {
      this.groupCodeTY = "";
      this.createUserTY = "";
      this.startTimeTY = "";
      this.endTimeTY = "";
      this.checkTypeStatusTY = "";
      this.collectionNumberTY = "";
      // this.statusChange("审批中");
      this.loadingTY = true;
      this.applyPeopleChoose = [];
      this.loadDataTY();
    },

    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },

    // 加载内部收款信息及处理分页
    handleSizeChangeNBSK(val) {
      this.pagesizeNBSK = val;
      this.loadingNBSK = true;
      this.loadDataNBSK();
    },
    handleCurrentChangeNBSK(val) {
      this.currentPageNBSK = val;
      this.loadingNBSK = true;
      this.loadDataNBSK();
    },
    loadDataNBSK() {
      const that = this;
      this.$http
        .post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page",
          {
            pageIndex: this.currentPageNBSK,
            pageSize: this.pagesizeNBSK,
            object: {
              startTime: this.startTime
                ? formatDate(this.startTime, "YYYY-MM-DD HH:mm:ss")
                : "2000-05-16",
              endTime: this.endTime
                ? formatDate(this.endTime, "YYYY-MM-DD HH:mm:ss")
                : "2099-05-16",
              collectionType: 5,
              checkType: 0
            }
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(function(obj) {
          if (obj.data.isSuccess) {
            that.totalNBSK = obj.data.total;
            that.numNBSK = obj.data.total;
            that.tableDataNBSK = obj.data.objects;
            that.tableDataNBSK.forEach(function(item, index, arr) {
              item.collectionTime = item.collectionTime.split("T")[0];
            });
            that.loadingNBSK = false;
          } else {
            that.totalNBSK = 0;
            that.numNBSK = 0;
            that.tableDataNBSK = [];
            that.loadingNBSK = false;
          }
        });
    },

    // 加载内部收款信息及处理分页
    handleSizeChangeBXHK(val) {
      this.pagesizeBXHK = val;
      this.loadingBXHK = true;
      this.loadDataBXHK();
    },
    handleCurrentChangeBXHK(val) {
      this.currentPageBXHK = val;
      this.loadingBXHK = true;
      this.loadDataBXHK();
    },
    loadDataBXHK() {
      const that = this;
      this.$http
        .post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page",
          {
            pageIndex: this.currentPageBXHK,
            pageSize: this.pagesizeBXHK,
            object: {
              // startTime: this.startTime
              //   ? formatDate(this.startTime, "YYYY-MM-DD HH:mm:ss")
              //   : "2000-05-16",
              // endTime: this.endTime
              //   ? formatDate(this.endTime, "YYYY-MM-DD HH:mm:ss")
              //   : "2099-05-16",
              // collectionType: 6,
              // checkType: 0

              // 仿直客请求begin
              id: 0,
              checkType: 0,
              collectionTime: "2019-05-16",
              startTime: "2000-05-16",
              endTime: "2099-05-16",
              groupCode: "",
              planID: 0,
              orderID: 0,
              orderNumber: "",
              collectionNumber: "",
              price: 0,
              dept: 0,
              createUser: "",
              createTime: "2019-05-16 01:02:40",
              code: "",
              serialNumber: "",
              abstract: "",
              isDeleted: 0,
              collectionType: 6, // 直客1.同业2
              localCompID: this.sid // 直客0,同业变成同业社id
              //"localCompName":""
              // 仿直客请求end
            }
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
        .then(function(obj) {
          // console.log(obj,1111)
          if (obj.data.isSuccess) {
            that.totalBXHK = obj.data.total;
            that.numBXHK = obj.data.total;
            that.tableDataBXHK = obj.data.objects;
            that.tableDataBXHK.forEach(function(item, index, arr) {
              item.createTime = moment(item.createTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            that.loadingBXHK = false;
          } else {
            that.totalBXHK = 0;
            that.numBXHK = 0;
            that.tableDataBXHK = [];
            // that.tableDataBXHK = [
            //   {
            //     id: 1314,
            //     checkType: 0,
            //     reimbursement: 0,
            //     loan: 0,
            //     price: 1,
            //     createTime: "2019-12-22T10:48:39.893",
            //     dept: "大客户销售部",
            //     createUser: "自己造的"
            //   }
            // ];
            // that.tableDataBXHK.forEach(function(item, index, arr) {
            //   item.createTime = moment(item.createTime).format(
            //     "YYYY-MM-DD HH:mm:ss"
            //   );
            // });
            that.loadingBXHK = false;
          }
        });
    },

    //判断搜索输入框的结束时间不能在开始时间之前
    endDateChange(beginDate, endDate) {
      let beginTime = moment(beginDate).format("YYYYMMDD");
      let entTime = moment(endDate).format("YYYYMMDD");
      if (this.beginDate !== "") {
        if (entTime < beginTime) {
          this.$message.error("结束时间不能早于开始时间");
          this.endDate = "";
        }
      }
    },

    // 直客同业搜索  状态输入框的转换
    // statusChange(checkType) {
    //   if (checkType == "审批中") {
    //     checkType = 0;
    //   } else if (checkType == "通过") {
    //     checkType = 1;
    //   } else if (checkType == "驳回") {
    //     checkType = 2;
    //   } else {
    //     checkType = 0;
    //   }
    //   return checkType;
    // },

    // 直客同业的搜索框  申请人的搜索请求数据
    querySearchAsync(queryString, cb) {
      this.applyPeopleIpt = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/userlist", {
          object: {
            name: queryString
          }
        })
        .then(res => {
          let { objects } = res.data;
          for (let i = 0; i < objects.length; i++) {
            this.applyPeopleIpt.push({
              value: objects[i].name,
              userCode: objects[i].userCode
            });
          }
          let results = queryString
            ? this.applyPeopleIpt.filter(this.createStateFilter(queryString))
            : [];
          cb(results);
        })
        .catch(err => {
          console.log(err);
        });
    },
    createStateFilter(queryString) {
      return state => {
        return state.value; //后台已做筛选  无需再过滤
      };
    },
    handleSelect(item) {
      this.applyPeopleChoose = item;
    }
  },

  created() {
    this.loadDataZK();
    this.loadDataTY();
    this.loadDataNBSK();
    this.loadDataBXHK();
  }
};
</script>

<style lang="scss" scoped>
.el-divider__text {
  font-size: 17px !important;
}
.title-margin-t {
  margin-top: 45px;
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
  .title-margin {
    margin-bottom: 30px;
  }
  .item-content {
    margin-bottom: 20px;
  }

  .el-divider__text {
    font-size: 17px !important;
  }
  .distributor-status {
    margin-left: 40px;
  }
  .add-style {
    margin-left: 1%;
    margin-top: 30px;
  }
  #table-content,
  #table-content-together {
    width: 98%;
    margin: 10px auto 20px;
  }
  .tableData {
    width: 98%;
    margin: 10px auto 20px;
  }
  .block {
    margin-top: 30px;
    margin-left: -30%;
    text-align: center;
    margin-bottom: 20px;
  }
}
/*关联欠款*/
.associated {
  line-height: 40px;
  background: #e3f2fc;
  border: 1px solid #cfeefc;
  width: 90%;
  margin: 0 0 0 25px;
  border-radius: 5px;
  overflow: hidden;
}
.associatedIcon {
  font-size: 14pt;
  color: #0b84e6;
  margin: 0 0 0 15px;
  float: left;
}
.associatedItems {
  float: left;
  margin: 0 0 0 10px;
}
.associatedMoney {
  float: left;
  margin: 0 0 0 30px;
}

// 搜索begin
.search {
  .searchName {
    font-size: 14px;
    margin-left: 5px;
    display: inline-block;
    width: 75px;
    text-align: center;
  }

  .searchInput {
    margin: 10px 5px;
    width: 145px;
  }

  .startTime {
    margin-left: 10px;
    width: 135px !important;
  }

  .dateLine {
    width: 15px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 -10px 3px 0;
  }

  .searchBtn {
    margin: 20px 0 15px 10px;
  }
}
</style>
