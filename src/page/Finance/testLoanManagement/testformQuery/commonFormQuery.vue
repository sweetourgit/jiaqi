//无收入借款管理 预付款公用首页 引用mixins混入对象 common.js文件
<template>
  <div style="padding-bottom:80px" class="distributor-content">    
    <!-- 表单搜索 预付款和无收入的借款人不同-->
    <el-form ref="ruleFormSeach" :model="ruleFormSeach" label-width="80px" id="form-content">            
        <el-row type="flex" class="row-bg">
            <el-col :span="8">
                <el-form-item label="团期计划" prop="groupCode_01">
                    <el-input v-model="ruleFormSeach.groupCode_01"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">  
              <!-- 1无收入 2预付款 -->
                <el-form-item label="借款人" prop="borrower" v-if="paymentType===1">
                  <el-autocomplete v-model="ruleFormSeach.borrower"  :fetch-suggestions="querySearchBorrower" placeholder="请输入借款人" :trigger-on-focus="false"
                    @select="departureBorrower" @blur="departureBorrowerBlur" @focus="departureBorrowerFocus"></el-autocomplete>
                </el-form-item> 
                <el-form-item label="申请人:" prop="user" v-if="paymentType===2">
                  <el-autocomplete v-model="ruleFormSeach.user"  :fetch-suggestions="querySearchBorrower" :disabled="ifShowProposer" placeholder="请输入申请人" :trigger-on-focus="false"
                    @select="departureBorrower" @blur="departureBorrowerBlur" @focus="departureBorrowerFocus"></el-autocomplete>
                  <!-- <el-input v-model="ruleFormSeach.user" placeholder="请输入申请人" :disabled="ifShowProposer"></el-input> -->
                </el-form-item>              
            </el-col>
            <el-col :span="8">
                <el-form-item label="状态" prop="checkType">
                  <el-select v-model="ruleFormSeach.checkType" placeholder="请选择类型" >
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) of settlement" :key="item.value" />  
                  </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">         
            <el-col :span="8">
              <el-form-item label="申请时间:">
                <el-col :span="11">
                  <el-form-item prop="beginTime">
                    <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleFormSeach.beginTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="endTime">
                    <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleFormSeach.endTime" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">                 
              <el-form-item>
                <el-button @click="search()" type="primary" :disabled="ifShowsearch"  >搜索</el-button>
                <el-button @click="emptyButton('ruleFormSeach')" type="primary">重置</el-button>
              </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <!-- 表单搜索 end-->
    <!-- 表单申请按钮 -->
    <el-button type="primary"  @click="dialogchange()" class="add-style">申请</el-button>
  <!-- 表单申请按钮end -->

  <!-- table表格渲染 -->
    <!-- 借款列表 -->
    <el-table :data="tableData" ref="multipleTable" :header-cell-style="getRowClass" :highlight-current-row="true" border :row-style="rowClass" :stripe="true" @row-click="clickRow" id="table-content" v-loading="listLoading">
      <el-table-column prop="paymentID" label="借款单号" align="center"></el-table-column>
      <el-table-column prop="checkTypeEX" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >{{scope.row.checkTypeEX}}</div>
          <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >{{scope.row.checkTypeEX}}</div>
          <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >{{scope.row.checkTypeEX}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发起时间" :formatter='dateFormat' align="center"></el-table-column>
      <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
      <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
      <el-table-column prop="price" label="借款金额" align="center"></el-table-column>
      <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
      <el-table-column prop="createUser" label="申请人" align="center"></el-table-column>
     
      <el-table-column prop="opinion" label="审批意见" align="center" v-show="paymentType===2"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="checkIncome(scope.row)" type="text" size="small" class="table_details">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 借款列表 END -->
    <!-- 分页 -->
    <el-row type="flex" class="paging">
      <el-col :span="8" :offset="8">
        <pagination  v-show="total>0" :total="total"  :page.sync="ruleFormSeach.page"  :limit.sync="ruleFormSeach.limit" @pagination="getList()"/>
      </el-col>
    </el-row>
    <!-- 分页 END -->
    <!-- 点击申请按钮弹框 -->
    <borrow-apply ref="borrowApply"  @close="closeAdd" @searchHandList="getList" :paymentType='paymentType' :dialogFormVisible="dialogFormVisible"></borrow-apply>
    <!-- 点击申请按钮弹框end -->
  </div>
</template>

<script>
  import moment from 'moment'
  import {common} from "../mixins/common.js";
  import borrowApply from '@/page/Finance/testLoanManagement/testformQuery/borrowApply' //点击申请按钮弹框内容
  import Pagination from '@/components/Pagination'
  export default {
    data() {
      return {
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
        paymentID:0,//table借款单号
        groupCode:0,//table团期计划
        tableDataBorrower:[],//借款人
        keepBorrowerUserCode: null, // 模糊查询之后选中事件获得 借款人对应的 usercode
        ifShowsearch: false,
        dialogFormVisible: false, //申请弹框
        multipleSelection: [],
        //预付款数据
        ifShowProposer: false, // 当职位为收纳额时候禁止使用申请人检索     
        infoStatus: '',
      }
    },
    props:{
      paymentType:{
        type:Number,
        Default:1,
      }
    },
    mixins: [common], //混入对象
    components:{
       borrowApply,
       Pagination
    },  
    created(){
     //预付款的判断
      if (!sessionStorage.getItem('hasCashierInfo')) { // 只有是出纳的时候才显示申请人检索
        this.ifShowProposer = true
      }
       this.getList()
    }, 
    mounted(){
    },
    computed:{
      countTest:function () {//预付款
        return this.$store.state.updatAdvancePaymentData
      },
      
    },
    watch: {
    // 如果审批状态被驳回那么刷新预付款列表
    countTest: function (newV, oldV) {
      console.log('aaa')
      console.log(newV)
      let _this = this
      if (newV != oldV) {
        setTimeout(function () {
          _this.getList()
        }, 500)
      }
    }
  },
     
    methods: {    
      moment,  
     // 跳转详情页面
      checkIncome(row){
          let acoutInfo = row;
          this.$router.push({path:'applyDetail',query: { acoutInfo: acoutInfo}}) 
      },  
    
     //点击申请按钮显示弹框  
      dialogchange(){
        this.dialogFormVisible = true;
      },
      closeAdd() {
       this.dialogFormVisible = false;
      },   
     
      // 借款人模糊检索
      querySearchBorrower(queryBorrowerString, cb) {
        this.tableDataBorrower = []
        this.$http.post(this.GLOBAL.serverSrc + '/org/api/userlist', {
          "object": {
            name: queryBorrowerString
          }
        }).then(res => {
          let keepRes = res.data.objects;
          for (let i = 0; i < keepRes.length; i++) {
            this.tableDataBorrower.push({
              "value": keepRes[i].name,
              "userCode": keepRes[i].userCode
            })
          }
          let results = queryBorrowerString ? this.tableDataBorrower.filter(this.createFilteBorrowerr(queryBorrowerString)) : [];
          cb(results)
        }).catch(err => {
          console.log( err )
        })
      },

        // 模糊查询返回下拉选中项 - 查询返回userCode的（借款人）
      createFilteBorrowerr(queryString1){
        return (restaurant) => {
          return (restaurant.userCode);
        }
      },

      // 借款人选中
      departureBorrower (item) {       
        if(this.paymentType==1){
          this.keepBorrowerUserCode = item.userCode;
           this.ifShowsearch = false
        }
        else if(this.paymentType==2){
           this.keepApplyUserCode = item.userCode;
            this.ifShowsearch = false
        }
      },
      // 借款人 失焦
      departureBorrowerBlur(){        
        if(this.paymentType==1){//无收入       
          if(this.ruleFormSeach.borrower === ''){
            this.ifShowsearch = false
          }
          else {
            if(this.keepBorrowerUserCode == null){
              this.ifShowsearch = false
              this.ruleFormSeach.borrower = ''
              // this.$message.success("无相关借款人");
            }            
            // else {
            //   this.ifShowsearch = true;
            // }
          }        
        }
        else if(this.paymentType==2){//预付款
          if(this.ruleFormSeach.user === ''){
            this.ifShowsearch = false
          }else {
            if(this.keepApplyUserCode == null){
              this.ifShowsearch = false
              this.ruleFormSeach.user = ''
              // this.$message.success("无相关借款人");
            } 
            // else {
            //   this.ifShowsearch = true
            // }
          }
        }
        
      },
      // 借款人 获得焦点
      departureBorrowerFocus(){
        this.keepBorrowerUserCode = null;
        this.ruleFormSeach.borrower="";
        this.keepApplyUserCode = null;
        this.ruleFormSeach.user="";
        this.ifShowsearch = true;
      },
      // 选中行复选框勾选
      clickRow(row){
        this.$refs.multipleTable.clearSelection(); // 清空用户的选择
        this.$refs.multipleTable.toggleRowSelection(row);
        this.paymentID=row.paymentID;
        this.guid=row.guid;
        this.groupCode=row.groupCode;
        this.infoStatus = row['checkTypeEX'];
      },
    
      changeFun(val) {
            this.multipleSelection=val;
            if(this.multipleSelection.length==1){
              this.forbidden=false;
            }else{
              this.forbidden=true;
            };
            //event.cancelBubble = true;//row-click和selection-change耦合事件
      },
    }
  };
</script>

<style scoped lang="scss">
  .distributor-content {
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content {
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .line{
        text-align: center;
      }
      .status-length{
        width: 100% !important;
      }
    }
    .add-style{
      margin-left: 1%;
      margin-top: 30px;
    }
    #table-content{
      width: 98%;
      margin: 10px auto 10px;
    }
    .paging{
      margin:20px 0 10px 0;
    }
    .title-margin{
      margin-bottom: 30px;
    }
    .title-margin-t{
      margin-top: 45px;
    }
    .el-divider__text{
      font-size: 17px !important
    }
  }
  .upload-demo>>>.el-upload-list__item:first-child {
    margin-top: 5px;
  }




	/*分页*/
	.name_input{width: 200px;}
	.name_input01{width: 700px;}
	.name_button{margin-left:-5px; background:#eaeaea;color:#a4a4a4;}
	.name_button:hover{color:#a4a4a4;}
	.plan_button{margin-top:1px; background:#eaeaea;color:#a4a4a4;}
	.plan_button:hover{color:#a4a4a4;}
	
</style>