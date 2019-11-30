<template>
  <div>
    <!--搜索框-->
    <div class="demo-input-suffix">
      <span class="search-title" style="margin:0 0 0 35px;">产品ID</span>
      <el-input placeholder="请输入" v-model="teamID" class="group-no"></el-input>
      <span class="search-title">产品名称</span>
      <el-input placeholder="请输入" v-model="title" class="group-no"></el-input>
      <span class="search-title">出行日期</span>
      <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        align="right" class="group-no" style="width:380px;"></el-date-picker>
      <br />
      <span class="search-title" style="margin:0 0 0 50px;">团号</span>
      <el-input placeholder="请输入" v-model="groupCode" class="group-no"></el-input>
      <span class="search-title">操作人员</span>
      <el-input placeholder="请输入" v-model="op" class="group-no"></el-input>
      <span class="search-title">报账状态</span>
      <el-select v-model="financeState" placeholder="请选择" class="group-no" style="width:200px">
        <el-option v-for="item in financeType" :key="item.value" :label="item.label":value="item.value"></el-option>
      </el-select>
      <el-button type="primary" class="search-but" @click="search">搜索</el-button>
      <el-button type="primary" plain @click="reset">重置</el-button>
    </div>
    <div class="main">
      <el-row class="button">
        <!--
        <el-button :disabled="forbidden2" @click="dialogCost = true">报账单</el-button>-->
      </el-row>
      <!--list-->
      <!--列表表格-->
      <el-table :data="teamqueryList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass"
        :cell-style="getCellClass" @selection-change="changeFun" @row-click="clickRow">
        <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
        <el-table-column prop="groupCode" label="团期计划" width="220"></el-table-column>
        <el-table-column prop="regimentType" label="状态" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.regimentType=='1'">正常</div>
            <div v-if="scope.row.regimentType=='2'">停售</div>
            <div v-if="scope.row.regimentType=='3'">封团</div>
            <div v-if="scope.row.regimentType=='4'">暂满</div>
            <div v-if="scope.row.regimentType=='5'">满员</div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="产品名称" min-width="200"></el-table-column>
        <el-table-column prop="dateFormat" label="出行日期" width="100"></el-table-column>
        <el-table-column prop="accountStatus" label="报账状态" width="100">
          <template slot-scope="scope">
            <div>报账中</div>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="计划位" width="70"></el-table-column>
        <el-table-column prop="remaining" label="余位" width="70"></el-table-column>
        <el-table-column prop="occupancy" label="确定占位" width="70"></el-table-column>
        <el-table-column prop="scheduled" label="预订占位" width="70"></el-table-column>
        <el-table-column prop="occupy" label="预订不占" width="70"></el-table-column>
        <!-- <el-table-column prop="week" label="周" width="70"></el-table-column>
        <el-table-column prop="day" label="天数" width="70"></el-table-column>
        <el-table-column prop="refPrice" label="参考价" width="80"></el-table-column>
        <el-table-column prop="count" label="计划位" width="70"></el-table-column>
        <el-table-column prop="remaining" label="余位" width="70"></el-table-column>
        <el-table-column prop="shareCN" label="是否共享" width="85"></el-table-column> -->
        <el-table-column prop="op" label="操作人员" width="80"></el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <span v-show="show1">
              <span class="cursor blue" v-if="scope.row.regimentType=='1'" @click="haltSales(scope.row.id)">停售</span>
              <span class="em" v-if="scope.row.regimentType=='1'">|</span>
              <span class="cursor blue" v-if="scope.row.regimentType=='2'" @click="haltSales_01(scope.row.id)">恢复售卖</span>
            </span>
            <!-- <span v-show="show2" class="em" v-if="scope.row.regimentType=='2'">|</span> -->
            <span v-show="show2"><span class="cursor blue" v-if="scope.row.regimentType=='1'" @click="operation(1)">下单</span></span>
            <!-- <span v-show="show2" class="em" v-if="scope.row.regimentType=='1'">|</span> -->
            <span v-show="show1">
              <span class="cursor blue" @click="operation(2)">详情</span>
              <span class="em" v-if="scope.row.regimentType=='3'">|</span>
              <span class="cursor blue" v-if="scope.row.regimentType=='3'">报账单</span>
              <span class="em" v-if="scope.row.regimentType=='1'">|</span>
              <span class="cursor blue" v-if="scope.row.regimentType=='1'" @click="haltSales_02(scope.row.id)">封团</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination v-if="pageshow" class="pagination" @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page.sync="current" :page-sizes="[10, 30, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"
      ></el-pagination>
      <!--报账单弹窗-->
      <el-dialog title="报账单" :visible.sync="dialogCost" class="city_list" width="60%">
        <el-table :data="costList" ref="costTable" class="costTable" :header-cell-style="getCostClass" border :row-style="costrowClass"
          :cell-style="getCellClass" @selection-change="changeFunCost" @row-click="clickRowCost">
          <el-table-column prop="id" label fixed type="selection"></el-table-column>
          <el-table-column prop="serno" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="state" label="审核状态" min-width="90"></el-table-column>
          <el-table-column prop="type" label="费用类型" min-width="90"></el-table-column>
          <el-table-column prop="costType" label="成本类型" min-width="90"></el-table-column>
          <el-table-column prop="abstract" label="摘要" min-width="100"></el-table-column>
          <el-table-column prop="supplierInfo" label="供应商" min-width="180"></el-table-column>
          <el-table-column prop="price" label="金额" min-width="70"></el-table-column>
          <el-table-column prop="num" label="数量" min-width="70"></el-table-column>
          <el-table-column prop="enclosure" label="附件" min-width="70"></el-table-column>
        </el-table>
      </el-dialog>
      <teamOrder-insert :planId="planId" :variable="variable" :dialogType="dialogType"></teamOrder-insert>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import teamOrderInsert from "./teamOrderInsert";
export default {
  name: "teamqueryList",
  components: {
    teamOrderInsert
    // "teamOrder-insert":teamOrderInsert,
  },
  data() {
    return {
      userCodeList: null, // 获取UserList列表
      pageshow: true,
      planId: 0,
      variable: 0, //设置一个变量展示弹窗
      dialogType: 0, //弹窗类型  1：下单
      title: "", //产品名称
      groupCode: "", //团号
      date: "", //日期
      op: "", //操作人员
      changedUserCode: '', // 用户名转变
      financeState: "", //报账状态
      teamID:"",//产品ID
      financeType: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "未报账"
        },
        {
          value: "2",
          label: "已报账"
        }
      ],
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      total: 0,
      current:1,
      teamqueryList: [],
      multipleSelection: [], //选中的list
      //成本
      costList: [
        {
          id: 1,
          serno: 1,
          state: "已审",
          type: "公摊",
          costType: "机票",
          abstract: "升级套房",
          supplierInfo: "大运通国际旅行社",
          price: "2000",
          num: "20",
          enclosure: "查看"
        },
        {
          id: 2,
          serno: 1,
          state: "已审",
          type: "公摊",
          costType: "机票",
          abstract: "升级套房",
          supplierInfo: "大运通国际旅行社",
          price: "2000",
          num: "20",
          enclosure: "查看"
        }
      ],
      dialogCost: false, //成本弹窗
      show1:false,
      show2:false,
      // costSelection: [], //选中的list
      // searchParams: 2 // 2 为翻页，控制名字转code
    };
  },
  created() {
    this.teamQueryList();  
    this.permission();  
  },
  mounted () {
  },
  methods: {
    permission(){
      let orgID = sessionStorage.getItem('orgID');
      let arr = ['492','493','494','545','501'];
      if(arr.indexOf(orgID)==-1){     
        this.show1 = true ;
      }else{
        this.show2 = true;
      }
      
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    changeFun(val) {
      //保存选中项的数据
      this.multipleSelection = val;
    },
    clickRow(row) {
      //选中行复选框勾选
      this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
      this.$refs.multipleTable.toggleRowSelection(row);
      this.planId = this.multipleSelection[0].id;
    },
    rowClass({ row, rowIndex }) {
      //选中行样式改变
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].id == row.id) {
          return { "background-color": "#ecf5ff" };
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.teamQueryList(this.pageIndex,val);
      this.getUserCode();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.teamQueryList(val,this.pageSize);
    },
    //计划list
    teamQueryList(pageIndex = this.pageIndex,pageSize = this.pageSize,title = this.title,groupCode = this.groupCode,startDate = this.date == null ? 0 : this.date[0],endDate = this.date == null ? 0 : this.date[1],op = this.op,teamID = this.teamID) {
      if (startDate) {
        let y = startDate.getFullYear();
        let m = startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : "0" + (startDate.getMonth() + 1);
        let d = startDate.getDate() > 9 ? startDate.getDate() : "0" + startDate.getDate();
        startDate = "" + y + m + d;
      } else {
        startDate = 0;
      }
      if (endDate) {
        let y = endDate.getFullYear();
        let m = endDate.getMonth() + 1 > 9 ? endDate.getMonth() + 1 : "0" + (endDate.getMonth() + 1);
        let d = endDate.getDate() > 9 ? endDate.getDate() : "0" + endDate.getDate();
        endDate = "" + y + m + d;
      } else {
        endDate = 0;
      }
      this.$http.post(this.GLOBAL.serverSrc + "/teamquery/get/api/page", {
        pageIndex:pageIndex,
        pageSize: pageSize,
        object: {
          title: title,
          groupCode: groupCode,
          startDate: startDate,
          endDate: endDate,
          op: op,
          teamID: this.teamID == "" ? 0 : teamID,
        }
      })
        .then(res => {
          this.teamqueryList = [];
          this.total = res.data.total;
          if (res.data.isSuccess == true) {
            this.teamqueryList = res.data.objects;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //成本方法
    getCostClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f6f6f6;height:25px;textAlign:center;fontSize:15px";
      } else {
        return "";
      }
    },
    costrowClass({ row, rowIndex }) {
      //选中行样式改变
      for (var i = 0; i < this.costSelection.length; i++) {
        if (this.costSelection[i].id == row.id) {
          return { "background-color": "#ecf5ff" };
        }
      }
    },
    changeFunCost(val) {
      //保存选中项的数据
      this.costSelection = val;
      if (this.costSelection.length == 1) {
        // this.forbidden1=false;
      } else {
        //  this.forbidden1=true;
      }
    },
    clickRowCost(row) {
      //选中行复选框勾选
      //this.$refs.multipleTable.clearSelection(); //清空用户的选择
      this.$refs.costTable.toggleRowSelection(row);
    },
    operation(i) {
      if(i === 1){
        if(new Date().getTime() > new Date(this.teamqueryList[0].dateFormat).getTime()+24*24*60*1000*2){
          this.$message.error('该团期出行日期已过,不能再进行下单');
          return;
        }
      }
      this.variable++;
      this.dialogType = i;
    },
    search() {
      if(this.op == ''){
        this.current = 1;
        this.teamQueryList(this.pageIndex === 1 ? this.pageIndex : 1,this.pageSize);
      } else {
        this.current = 1;
        this.getUserCode();
      }
      
    },
    getUserCode(){//op输入名字获取usercode
      var that = this
        this.$http.post(this.GLOBAL.serverSrc + "/org/api/userlist",{
          object: {
            id: 0,
            createTime: "2019-08-23T03:03:10.386Z",
            isDeleted: 0,
            code: "",
            mobile: "",
            name: this.op,
            email: "",
            userCode: "",
            passWord: "",
            iDcard: "",
            tourGuide: "",
            sex: 0,
            userType: 0,
            userState: 0,
            orgID: 0,
            orgName: "",
            user_Position: [
              {
                id: 0,
                userID: 0,
                positionID: 0,
                positionName: "",
                isDefault: 0,
                orgID: 0,
                orgName: ""
              }
            ]
          }
        }).then(res => {
            if (res.data.objects.length !=0) {
              var getUserCode='';
              getUserCode = res.data.objects[0].userCode;
              this.teamQueryList(this.pageIndex === 1 ? this.pageIndex : 1,this.pageSize,this.title,this.groupCode,this.date == null ? 0 : this.date[0],this.date == null ? 0 : this.date[1],getUserCode,this.teamID);
            } else {
              that.teamqueryList = [];
            }
          }).catch(function(error) {
            console.log(error);
          })
        this.$nextTick(() => {
          this.pageshow = true;
        });
    },
    reset(curPage) {
      console.log(this.pageIndex)
      this.title = "";
      this.groupCode = "";
      this.date = "";
      this.op = "";
      this.financeState = "";
      this.teamID = "";
      this.pageIndex = 1 ? 1 : 1;
      this.current = curPage;
      this.teamQueryList();
    },
    //停售
    haltSales(status) {
      this.$confirm("该团期是否停售?", "提示", {
        confirmButtonText: "停售",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
          this.$http.post(this.GLOBAL.serverSrc + "/teamquery/get/api/GetPlanType",{
            "id": status,
            "num":2
          }).then(res => {
              if(res.data.isSuccess == true){
                //console.log(this.current,'jack')
                this.teamQueryList();
              }
           })
        })
        .catch(res => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //恢复售卖
    haltSales_01(status) {
      this.$confirm("该团期是否正常售卖?", "提示", {
        confirmButtonText: "恢复售卖",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
          this.$http.post(this.GLOBAL.serverSrc + "/teamquery/get/api/GetPlanType",{
            "id": status,
            "num":1
          }).then(res => {
            if(res.data.isSuccess == true){
               this.teamQueryList();
              }
           })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    //封团
    haltSales_02(status) {
      this.$confirm("该团期是否封团?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
          this.$http.post(this.GLOBAL.serverSrc + "/teamquery/get/api/GetPlanType",{
            "id": status,
            "num":3
          }).then(res => {
            if(res.data.isSuccess == true){
               this.teamQueryList();
              }
           })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
  }
};
</script>

<style scoped>
/*search*/
.demo-input-suffix {
  padding: 20px 0 10px 10px;
  width: 1390px;
  background-color: #f7f7f7;
}
.el-input {
  width: auto;
}
.group-no {
  margin-left: 10px;
}
.start-time {
  margin-left: 10px;
}
.date-line {
  width: 30px;
  border-bottom: 1px solid #e6e6e6;
  display: inline-block;
  margin: 0 3px 3px 0;
}
.search-title {
  font-size: 14px;
  margin-left: 30px;
  text-align:right;
}
.search-but {
  margin: 20px 0 15px 20px;
  overflow: hidden;
}
/*list*/
.table {
  border: 1px solid #e6e6e6;
  border-bottom: 0;
  background-color: #f7f7f7;
  text-align: center;
  margin: 20px 0 0 0;
  width: 1400px;
}
.costTable {
  border: 1px solid #e6e6e6;
  border-bottom: 0;
  background-color: #f7f7f7;
  text-align: center;
  margin: 20px 0 0 0;
  
}
.el-table tr {
  background: #f6f6f6 !important;
}
.button {
  margin: 25px 0 0 8px;
}
.button .el-button {
  border: 1px solid #3095fa;
  color: #3095fa;
  width: 80px;
  padding: 0;
  line-height: 35px;
}
.el-button.is-disabled {
  color: #606266;
  background-color: #fff;
  border-color: #dcdfe6;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #f5f7fa !important;
}
.city_list {
  text-align: center;
}
.pagination {
  text-align: center;
  margin: 30px 0 50px 0;
}
.dialog-footer {
  text-align: left;
  margin: 20px 0 20px 108px;
}
.blue {
  color: #2e94f9;
}
.cursor {
  cursor: pointer;
}
</style>