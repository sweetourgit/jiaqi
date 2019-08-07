<template>
  <div class="all">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--报账单-->
      <el-tab-pane label="报账单" name="first">
        <div class="borders">
          <div class="search">
            <span class="search_style">团期计划：</span> <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">报账人：</span> <el-input v-model="reimbursementPer" placeholder="请输入内容" class="search_input"></el-input>
            <span class="search_style">发起时间：</span>
            <el-date-picker v-model="startTime" type="date" placeholder="请选择日期" class="start-time"></el-date-picker>
            <div class="date-line"></div>
            <el-date-picker v-model="endTime" type="date" placeholder="请选择日期" class="start-time"></el-date-picker>
            <div style="margin-top: 20px;"></div>
            <span class="search_style">产品名称：</span> <el-input v-model="productName" placeholder="请输入内容" class="search_input"></el-input>
            <el-button type="primary" @click="searchFun" style="float: right;margin-right: 20px;">搜索</el-button>
            <el-button type="primary" @click="resetFun" plain style="float: right;margin-right: 20px;">重置</el-button>
          </div>
          <div class="table_style">
            <el-table :data="tableData" border :header-cell-style="getRowClass" style="width: 100%;">
              <el-table-column prop="expenseID" label="团期计划" width="180" align="center"></el-table-column>
              <el-table-column prop="checkTypeEX" label="状态" width="120" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
                  <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
                  <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="产品名称" align="center"></el-table-column>
              <el-table-column prop="groupCode" label="申请人" width="120" align="center"></el-table-column>
              <el-table-column prop="price" label="申请时间" width="180" align="center"></el-table-column>
              <el-table-column prop="orgName" label="审批意见" width="250" align="center"></el-table-column>
              <el-table-column prop="opinion" label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <div v-if="scope.row.checkTypeEX=='审批中'">
                    <el-button @click="approve(scope.row)" type="text" size="small" class="table_details">审批</el-button>
                  </div>
                  <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >
                    <el-button @click="detail(scope.row)" type="text" size="small" class="table_details">详情</el-button>
                  </div>
                  <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" ></div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size= pageSize
              layout="total, sizes, prev, pager, next, jumper"
              :total=pageCount
              background>
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!--报账单end-->

      <!--需要你审批-->
      <el-tab-pane :label="'需要您审批 ('+number+')'" name="second">
        <NeedApproval></NeedApproval>
      </el-tab-pane>
      <!--审批end-->
    </el-tabs>
    <checkSheetPreview :dialogFormVisible="dialogFormVisible" @close="closeFun" :info="info"></checkSheetPreview>
  </div>
</template>

<script>
    import NeedApproval from '@/page/Finance/checkSheet/needApproval';
    import checkSheetPreview from '@/page/Finance/checkSheet/checkSheetPreview';
    import { formatDate } from '@/js/libs/formatDate.js';
    export default {
      name: "checkSheet",
      components:{
        NeedApproval,
        checkSheetPreview
      },
      data() {
        return {
//        报账单需要审批数量
          number: '12',
//        搜索字段
          plan: '',
          reimbursementPer: '',
          productName: '',
          startTime: '',
          endTime: '',
//        切换字段
          activeName: 'first',
//        分页字段
          pageSize: 10,
          currentPage: 1,
          pageCount: 0,
//        弹出层字段
          dialogFormVisible: false,
          info: '',
//        报账单table
          tableData: [{
            number: '1',
            type: '申请中',
            checkType: '0',
            createtime: '2016-05-02',
            plan: 'TC-GTY-1001-01-180806-01',
            monkey: '国旅',
            orinaze: '辽宁大运通-国内部',
            accpter: '阳阳',
            info: '',
          }, {
            number: '1',
            type: '驳回',
            checkType: '-1',
            createtime: '2016-05-02',
            plan: 'TC-GTY-1001-01-180806-01',
            monkey: '国旅',
            orinaze: '辽宁大运通-国内部',
            accpter: '阳阳',
            info: '郑总：信息补全',
          }, {
              number: '1',
              type: '通过',
              checkType: '1',
              createtime: '2016-05-02',
              plan: 'TC-GTY-1001-01-180806-01',
              monkey: '国旅',
              orinaze: '辽宁大运通-国内部',
              accpter: '阳阳',
              info: '',
            }]
        };
      },
      methods: {
        // 表格头部背景颜色
        getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7;color:rgb(85, 85, 85);'
          } else {
            return ''
          }
        },
        searchFun(){

        },
        resetFun(){
          this.plan = '';
          this.reimbursementPer = '';
          this.productName = '';
          this.startTime = '';
          this.endTime = '';
        },
        handleClick(tab, event) {
//          console.log(tab, event);
        },
        handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          this.reimList()
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.reimList()
        },
//        获取报账单列表数据
        reimList(){
          var that = this;
          this.$http.post(
            this.GLOBAL.serverSrc + "/finance/expense/api/page",
            {
              "pageIndex": that.currentPage,
              "pageSize": that.pageSize,
              "total": 0,
              "object": {
              }
            },
          ).then(function (obj) {
            that.pageCount = obj.data.total;
//            console.log(obj.data.objects);
            that.tableData = obj.data.objects;
          })
          .catch(function (obj) {
            console.log(obj);
          })
        },
//        审批报账单
        approve(res){
          console.log(res);
          this.info = res;
          this.dialogFormVisible = true;
//          name: "Result",
//          query: { name: 'name' },
//          params: { usersitelist: 'userlist' }
        },
        detail(res){
          console.log(res);
          this.info = res;
          this.dialogFormVisible = true;
        },
        closeFun() {
          this.dialogFormVisible = false;
        },
      },
      created(){
          this.reimList();
      }

    }
</script>

<style scoped>
  .borders{
    overflow: hidden;
    border: 1px solid #E6E6E6;
    margin-bottom: 30px;
  }
  .search{
    float: left;
    margin-top: 30px;
  }
  .date-line {
    width: 10px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 3px 3px 0
  }
  .search_style{
    /*float: left;*/
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px
  }
  .search_input{
    /*float: left;*/
    width: 200px
  }
  .table_style{
    width: 1500px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }

</style>
