<template>
  <div class="vivo" style="position:relative; width:1100px;">
     <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商户欠款订单" name="first">
        <!--搜索框-->
        <div style="width:1100px;">
          <div class="fl">
            <span class="emptyPlan">订单ID</span>
            <el-input v-model="groupCode_01" class="empty" clearable placeholder="请输入团期计划"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">商户名称</span>
            <el-input v-model="createUser" class="empty" clearable placeholder="请输入申请人"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">欠款时间</span>
            <el-date-picker v-model="beginTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
            <span class="time">——</span>
            <el-date-picker v-model="endTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
          </div>
        </div>
        <div style="width:1100px;clear:both; padding:0 0 50px 0;">
          <div style=" float:left">
               <span class="emptyPlan">欠款逾期</span>
             <el-select v-model="checkType" placeholder="请输入类型" class="empty">
                     <el-option :label="item.label" :value="item.value" v-for="(item,index) of settlement" :key="item.value" />
                   </el-select>
          </div>
          <div style="float:right; margin: 0 10px 0 0;">
            <el-button type="primary">搜索</el-button>
            <el-button @click="emptyButton()" type="primary">重置</el-button>
          </div>
        </div>
        <!--表格-->
         <el-table :data="tableData" class="labelTable" border style="width:100%">
            <el-table-column prop="ID" label="订单ID" width=""align="center"></el-table-column>
            <el-table-column prop="name" label="商户名称" width=""align="center"></el-table-column>
            <el-table-column prop="moneyType" label="结款方式" width=""align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" width=""align="center"></el-table-column>
            <el-table-column prop="plan" label="团期计划" width=""align="center"></el-table-column>
            <el-table-column prop="order" label="订单金额" width=""align="center"></el-table-column>
            <el-table-column prop="arrears" label="欠款金额" width=""align="center"></el-table-column>
            <el-table-column prop="also" label="已还金额" width=""align="center"></el-table-column>
            <el-table-column prop="examine" label="待审批金额" width=""align="center"></el-table-column>
            <el-table-column prop="arrearsDate" label="欠款日期" width=""align="center"></el-table-column>
            <el-table-column prop="alsoDate" label="应还日期" width=""align="center"></el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="分销商欠款订单" name="second">
        <div style="width:1100px;">
          <div class="fl">
            <span class="emptyPlan">订单ID</span>
            <el-input v-model="groupCode_01" class="empty" clearable placeholder="请输入团期计划"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">分销商</span>
            <el-input v-model="createUser" class="empty" clearable placeholder="请输入申请人"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">欠款时间</span>
            <el-date-picker v-model="beginTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
            <span class="time">——</span>
            <el-date-picker v-model="endTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
          </div>
        </div>
        <div style="width:1100px;clear:both; padding:0 0 50px 0;">
          <div style="float:right; margin: 0 10px 0 0;">
            <el-button type="primary">搜索</el-button>
            <el-button @click="emptyButton()" type="primary">重置</el-button>
          </div>
        </div>
        <!--表格-->
         <el-table :data="tableData" class="labelTable" border style="width:100%">
            <el-table-column prop="ID" label="订单ID" width=""align="center"></el-table-column>
            <el-table-column prop="name" label="分销商" width=""align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" width=""align="center"></el-table-column>
            <el-table-column prop="plan" label="团期计划" width=""align="center"></el-table-column>
            <el-table-column prop="order" label="订单金额" width=""align="center"></el-table-column>
            <el-table-column prop="arrears" label="欠款金额" width=""align="center"></el-table-column>
            <el-table-column prop="also" label="已还金额" width=""align="center"></el-table-column>
            <el-table-column prop="examine" label="待审批金额" width=""align="center"></el-table-column>
            <el-table-column prop="arrearsDate" label="欠款日期" width=""align="center"></el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="供应商欠款订单" name="third">
        <div style="width:1100px;">
          <div class="fl">
            <span class="emptyPlan">订单ID</span>
            <el-input v-model="groupCode_01" class="empty" clearable placeholder="请输入团期计划"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">供应商</span>
            <el-input v-model="createUser" class="empty" clearable placeholder="请输入申请人"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">欠款时间</span>
            <el-date-picker v-model="beginTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
            <span class="time">——</span>
            <el-date-picker v-model="endTime" type="date" class="planTime" placeholder="日期"></el-date-picker>
          </div>
        </div>
        <div style="width:1100px;clear:both; padding:0 0 50px 0;">
          <div style="float:right; margin: 0 10px 0 0;">
            <el-button type="primary">搜索</el-button>
            <el-button @click="emptyButton()" type="primary">重置</el-button>
          </div>
        </div>
        <!--表格-->
         <el-table :data="tableData" class="labelTable" border style="width:100%">
            <el-table-column prop="ID" label="订单ID" width=""align="center"></el-table-column>
            <el-table-column prop="name" label="供应商" width=""align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" width=""align="center"></el-table-column>
            <el-table-column prop="plan" label="团期计划" width=""align="center"></el-table-column>
            <el-table-column prop="order" label="订单金额" width=""align="center"></el-table-column>
            <el-table-column prop="arrears" label="欠款金额" width=""align="center"></el-table-column>
            <el-table-column prop="also" label="已还金额" width=""align="center"></el-table-column>
            <el-table-column prop="examine" label="待审批金额" width=""align="center"></el-table-column>
            <el-table-column prop="arrearsDate" label="欠款日期" width=""align="center"></el-table-column>
         </el-table>
         <el-pagination class="pageList" :page-sizes="[10,1,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
       activeName: 'first',
       //搜索栏
       groupCode_01:'',
        createUser:'',
        beginTime:'',
        endTime:'',
        checkType:'',
        settlement:[{
          value: '0',
          label: '审批中'
         }, {
          value: '1',
          label: '通过'
         }, {
          value: '2',
          label: '驳回'
        }],
        tableData:[{
          ID:'1',
          name:'常青藤',
          moneyType:'月结',
          productName:'泰国游',
          plan:'123456',
          order:'1200.00',
          arrears:'1200.00',
          also:'0.00',
          examine:'0.00',
          arrearsDate:'2019-07-02',
          alsoDate:'2019-08-07',
        }],
        //分页
        pagesize: 10, // 设定默认分页每页显示数
        pageIndex: 1, // 设定当前页数
        total: 0,
        currentPage: 1,
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //重置
    emptyButton(){
      this.groupCode_01 = '';
      this.createUser = '';
      this.beginTime = '';
      this.endTime = '';
      this.checkType = '';
    },
    //分页
    handleSizeChange(page) {
      /*this.currentPage = 1;
      this.pagesize = page;
      this.pageList();*/
    },
    handleCurrentChange(currentPage) {
      /*this.currentPage = currentPage;
      this.pageList();*/
    },
  },
  created() {
    
  }
}

</script>
<style lang="scss" scoped>
  /*搜索框*/
  .empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
  .fl{float:left; margin: 20px 0 20px 0;}
  .emptyPlan{margin: 0 0 0 30px; float:left; width:80px; text-align:right; line-height:40px;}
  .planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
  .time{margin: 0 0 0 10px;}
  /*表格*/
  .labelTable{margin: 20px 30px 20px 0;max-width: 1100px;overflow: hidden;clear:both;}
  .pageList{float:right; margin: 0 0 20px 0;}
</style>
