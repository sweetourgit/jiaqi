<template>
  <div class="distributor-content">
    <el-tabs :tab-position="tabPosition" class="tabsPosition" v-model="activeName">
      <!-- 直客模块 -->
      <el-tab-pane :label="'直客(' + numZK + ')'" name="first">
        <!-- 直客表格 -->
        <el-table :data="tableDataZK" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" id="table-content1" v-loading="loadingZK">
          <el-table-column prop="id" label="收款单号" align="center">
          </el-table-column>
          <el-table-column prop="checkTypeStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F">审批中</div>
              <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D">驳回</div>
              <div v-if="scope.row.checkType=='1'" style="color: #33D174">通过</div>
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
          <!--<el-table-column prop="" label="审批意见" align="center">-->
          <!--</el-table-column>-->
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="approvalZK(scope.row.id)" type="text" size="small" class="table_details">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination class="pageList" :page-sizes="[10,20,30,50]" background @size-change="handleSizeChangeZK" :page-size="pagesizeZK" :current-page.sync="currentPageZK" @current-change="handleCurrentChangeZK" layout="total, sizes, prev, pager, next, jumper" :total="totalZK"></el-pagination>
        </div>
        <!-- 直客表格 END -->
      </el-tab-pane>
      <!-- 直客模块 END -->
      <!-- 同业模块 -->
      <el-tab-pane :label="'同业(' + numTY + ')'" name="second">
        <!-- 同业表格 -->
        <el-table :data="tableDataTY" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" id="table-content2" v-loading="loadingTY" >
          <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="checkTypeStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F" >审批中</div>
              <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D" >驳回</div>
              <div v-if="scope.row.checkType=='1'" style="color: #33D174" >通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime" :formatter='dateFormat' label="收款时间" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="订单号" align="center"></el-table-column>
          <el-table-column prop="localCompName" label="同业社名称" align="center"></el-table-column>
          <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          <!--<el-table-column prop="" label="审批意见" align="center"></el-table-column>-->
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="approvalTY(scope.row.id)" type="text" size="small">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination class="pageList" :page-sizes="[10,20,30,50]" background @size-change="handleSizeChangeTY" :page-size="pagesizeTY" :current-page.sync="currentPageTY" @current-change="handleCurrentChangeTY" layout="total, sizes, prev, pager, next, jumper" :total="totalTY"></el-pagination>
        </div>
        <!-- 同业表格 END -->
      </el-tab-pane>
      <!-- 同业模块 END -->
      <!-- 内部收款模块 -->
      <el-tab-pane :label="'内部收款(' + numNBSK + ')'" name="third">
        <!-- 内部收款表格 -->
        <el-table :data="tableDataNBSK" border class="tableData" :highlight-current-row="true" :header-cell-style="getRowClass" id="table-content3" v-loading="loadingNBSK" >
          <el-table-column prop="id" label="收款单号" align="center"></el-table-column>
          <el-table-column prop="checkTypeStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.checkType=='0'" style="color: #7F7F7F" >审批中</div>
              <div v-if="scope.row.checkType=='2'" style="color: #FF4A3D" >驳回</div>
              <div v-if="scope.row.checkType=='1'" style="color: #33D174" >通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="collectionTime" :formatter='dateFormat' label="收款时间" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="orderNumber" label="订单号" align="center"></el-table-column>
          <el-table-column prop="localCompName" label="同业社名称" align="center"></el-table-column>
          <el-table-column prop="price" label="收款金额" align="center"></el-table-column>
          <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
          <!--<el-table-column prop="" label="审批意见" align="center"></el-table-column>-->
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="approvalNBSK(scope.row.id)" type="text" size="small">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination class="pageList" :page-sizes="[10,20,30,50]" background @size-change="handleSizeChangeNBSK" :page-size="pagesizeNBSK" :current-page.sync="currentPageNBSK" @current-change="handleCurrentChangeNBSK" layout="total, sizes, prev, pager, next, jumper" :total="totalNBSK"></el-pagination>
        </div>
        <!-- 内部收款表格 END -->
      </el-tab-pane>
      <!-- 内部收款模块 END -->
    </el-tabs>
    <approval :dialogFormVisible="dialogFormVisible" :info="info" @close="closeAdd"></approval>
  </div>
</template>
<script type="text/javascript">
  import moment from 'moment'
  import approval from '@/page/Finance/collectionManagement/pendingApproval/approval.vue'
  export default {
    components:{
      approval
    },
    data() {
      return {
        tabPosition:  'left',//左侧导航
        activeName: 'first',//当前tab项
        // 审批页面显示隐藏
        dialogFormVisible: false,
        info: '',

        // 直客
        numZK: 0, // 直客待审批
        tableDataZK: [], // 直客待审批列表
        loadingZK: true, // 直客列表loading
        pagesizeZK: 10,// 分页，每页条数
        currentPageZK: 1,// 分页，当前页数
        totalZK: 0,// 分页，总条数

        // 同业
        numTY: 0,// 同业待审批
        tableDataTY: [],// 同业待审批列表
        loadingTY: true,// 同业列表loading
        pagesizeTY: 10,// 分页，每页条数
        currentPageTY: 1,// 分页，当前页数
        totalTY: 0,// 分页，总条数
        sid: 0,

        // 内部收款
        numNBSK: 0,// 内部收款待审批
        tableDataNBSK: [],// 内部收款待审批列表
        loadingNBSK: true,// 内部收款列表loading
        pagesizeNBSK: 10,// 分页，每页条数
        currentPageNBSK: 1,// 分页，当前页数
        totalNBSK: 0,// 分页，总条数
      }
    },
    filters: {
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    watch: {
      numZK: {
        handler:function(){
          this.$parent.totalNum = this.numZK + this.numTY + this.numNBSK;
//          this.$parent.label = "需要您审批("+this.$parent.totalNum+")";
        }
      },
      numTY: {
        handler:function(){
          this.$parent.totalNum = this.numZK + this.numTY + this.numNBSK;
//          this.$parent.label = "需要您审批("+this.$parent.totalNum+")";
        }
      },
      numNBSK: {
        handler:function(){
          this.$parent.totalNum = this.numZK + this.numTY + this.numNBSK;
//          this.$parent.label = "需要您审批("+this.$parent.totalNum+")";
        }
      },
    },
    methods: {
      moment,
      // 表格表头颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      // 直客审批
      approvalZK(id){
        this.info = id;
        this.dialogFormVisible = true;
      },
      // 同业审批
      approvalTY(id){
        this.info = id;
        this.dialogFormVisible = true;
      },
      // 内部收款审批
      approvalNBSK(id){
        this.info = id;
        this.dialogFormVisible = true;
      },
      // 关闭弹框
      closeAdd(str){
        this.dialogFormVisible = false;
        this.loadDataZK();
        this.loadDataTY();
        this.loadDataNBSK();

      },
      // 加载直客信息及处理分页
      handleSizeChangeZK(val){
        this.pagesizeZK = val;
        this.loadingZK = true;
        this.loadDataZK();
      },
      handleCurrentChangeZK(val){
        this.currentPageZK = val;
        this.loadingZK = true;
        this.loadDataZK();
      },
      loadDataZK(){
        const that = this;
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": this.currentPageZK,
            "pageSize": this.pagesizeZK,
            "object": {
              "id": 0,
              "checkType": 0,
              "collectionTime": "2019-05-16",
              "startTime": this.startTime ? formatDate(this.startTime, 'YYYY-MM-DD HH:mm:ss') : "2000-05-16",
              "endTime": this.endTime ? formatDate(this.endTime, 'YYYY-MM-DD HH:mm:ss') : "2099-05-16",
              "groupCode": '',
              "planID": 0,
              "orderID": 0,
              "orderNumber": "",
              "collectionNumber": "",
              "price": 0,
              "dept": 0,
              "createUser": '',
              "createTime": "2019-05-16 01:02:40",
              "code": "",
              "serialNumber": "",
              "abstract": "",
              "isDeleted": 0,
              "collectionType":1, // 直客1.同业2
              "localCompID":0, // 直客0,同业变成同业社id
              //"localCompName":""
            }
          }
        ).then(function(obj) {
          console.log('ZK',obj);
          if(obj.data.isSuccess){
            that.totalZK = obj.data.total;
            that.numZK = obj.data.total;
            that.tableDataZK = obj.data.objects;
            that.loadingZK = false;
          }
        }).catch(function(obj) {

        })
      },

      // 加载同业信息及处理分页
      handleSizeChangeTY(val){
        this.pagesizeTY = val;
        this.loadingTY = true;
        this.loadDataTY();
      },
      handleCurrentChangeTY(val){
        this.currentPageTY = val;
        this.loadingTY = true;
        this.loadDataTY();
      },
      loadDataTY(){
        const that = this;
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collection/api/page", {
            "pageIndex": this.currentPageTY,
            "pageSize": this.pagesizeTY,
            "object": {
              "id": 0,
              "checkType": 0,
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
              "createUser": '',
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
          console.log('TY',obj);
          if(obj.data.isSuccess){
            that.totalTY = obj.data.total;
            that.numTY = obj.data.total;
            that.tableDataTY = obj.data.objects;
            that.loadingTY = false;
          }
        }).catch(function(obj) {

        })
      },
      // 起始时间格式转换
      dateFormat: function(row, column) {
        let date = row[column.property];
        if(date == undefined) {
          return '';
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },

      // 加载内部收款信息及处理分页
      handleSizeChangeNBSK(val){
        this.pagesizeNBSK = val;
        this.loadingNBSK = true;
        this.loadDataNBSK();
      },
      handleCurrentChangeNBSK(val){
        this.currentPageNBSK = val;
        this.loadingNBSK = true;
        this.loadDataNBSK();
      },
      loadDataNBSK(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          "pageIndex": this.currentPageNBSK,
          "pageSize": this.pagesizeNBSK,
          "object": {
            "startTime": this.startTime ? formatDate(this.startTime, 'YYYY-MM-DD HH:mm:ss') : "2000-05-16",
            "endTime": this.endTime ? formatDate(this.endTime, 'YYYY-MM-DD HH:mm:ss') : "2099-05-16",
            "collectionType": 5,
            "checkType": 0
          }
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(function (obj) {
          console.log('NBSK',obj);
          if(obj.data.isSuccess){
            that.totalNBSK = obj.data.total;
            that.numNBSK = obj.data.total;
            that.tableDataNBSK = obj.data.objects;
            that.loadingNBSK = false;
          }
        })
      },
    },
    created() {
      this.loadDataZK();
      this.loadDataTY();
      this.loadDataNBSK();
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
    .tableData{
      width: 98%;
      margin: 10px auto 20px;
    }
    .block {
      margin-top: 30px;
      margin-left:-30%;
      text-align:center;
      margin-bottom: 20px;
    }
  }
  /*关联欠款*/
  .associated{ line-height: 40px; background: #e3f2fc; border: 1px solid #cfeefc;width: 90%; margin: 0 0 0 25px; border-radius: 5px;overflow: hidden; }
  .associatedIcon{font-size:14pt; color: #0b84e6; margin: 0 0 0 15px; float:left;}
  .associatedItems{float:left; margin: 0 0 0 10px;}
  .associatedMoney{float:left; margin: 0 0 0 30px;}

</style>
