//无收入借款管理 引用mixins混入对象 testTableData.js文件
<template>
  <div style="padding-bottom:80px">    
    <!-- 表单搜索 -->
      <el-form ref="formquery" :model="formquery" label-width="80px" >            
          <el-row type="flex" class="row-bg">
              <el-col :span="8">
                  <el-form-item label="团期计划" prop="teamPlan">
                      <el-input v-model="formquery.teamPlan"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8">              
                  <el-form-item label="借款人" prop="borrower">
                    <el-autocomplete v-model="formquery.borrower"  :fetch-suggestions="querySearchBorrower" placeholder="请输入借款人" :trigger-on-focus="false"
                      @select="departureBorrower" @blur="departureBorrowerBlur" @focus="departureBorrowerFocus"></el-autocomplete>
                  </el-form-item>               
              </el-col>
              <el-col :span="8">
                  <el-form-item label="状态" prop="checkType">
                    <el-select v-model="formquery.checkType" placeholder="请选择类型" >
                      <el-option value="0" label="审批中"></el-option> 
                      <el-option value="1" label="通过"></el-option> 
                      <el-option value="2" label="驳回"></el-option>            
                    </el-select>
                  </el-form-item>
              </el-col>
          </el-row>
          <el-row type="flex" class="row-bg">         
              <el-col :span="8">
                  <el-form-item label="申请时间" >
                      <el-col :span="11">
                          <el-form-item prop="applyBeginTime">
                              <el-date-picker type="date" placeholder="选择日期" v-model="formquery.applyBeginTime" style="width: 100%;"></el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col class="line" :span="2">-</el-col>
                      <el-col :span="11">
                          <el-form-item prop="applyLastTime">
                              <el-date-picker type="date" placeholder="选择日期" v-model="formquery.applyLastTime" style="width: 100%;"></el-date-picker> 
                          </el-form-item>
                      </el-col>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item>
                      <el-button type="primary" @click="onSubmit" :disabled="ifShowsearch">搜索</el-button>
                      <el-button @click="resetForm('formquery')" type="primary">重置</el-button>
                  </el-form-item>
              </el-col>
          </el-row>
      </el-form>
  <!-- 表单搜索 end-->

  <el-button type="primary" @click="borrowApplyClick">申请</el-button>
<!-- tab切换表格渲染 -->
  <!-- 自由行table表格 -->
      <el-table v-loading="listLoading" :data="freetableData" border stripe :header-cell-style="getRowClass" v-show="childChangedTab==='freeITour'" style="width: 100%">
          <el-table-column prop="paymentID"  label="借款单号"></el-table-column>
          <el-table-column  prop="checkTypeEX" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.checkTypeEX=='通过'" style="color:green">通过</span>
              <span v-if="scope.row.checkTypeEX=='驳回'" style="color:red">驳回</span>
              <span v-if="scope.row.checkTypeEX=='审批中'" >审批中</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime"  label="发起时间" :formatter='dateFormat'></el-table-column>
          <el-table-column prop="groupCode"  label="团期计划"></el-table-column>
          <el-table-column prop="supplierName"  label="供应商名称"></el-table-column>
          <el-table-column prop="supplierTypeEX" label="类型"></el-table-column>
          <el-table-column prop="price" label="借款金额"></el-table-column>
          <el-table-column prop="expensePrice"   label="已核销金额"></el-table-column>
          <el-table-column prop="createUser" label="申请人"></el-table-column>
          <el-table-column label="操作"> 
            <template slot-scope="scope">
              <el-button @click="showDetailDialog(scope.row,childChangedTab)" type="text" size="small">详情</el-button>       
            </template>
          </el-table-column>
      </el-table>
  <!-- table表格 end-->
   <!-- 游轮table表格 -->
      <el-table v-loading="listLoading" :data="shiptableData" border stripe :header-cell-style="getRowClass" v-show="childChangedTab==='shipITour'" style="width: 100%">
          <el-table-column prop="paymentID"  label="借款单号"></el-table-column>
          <el-table-column  prop="checkTypeEX" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.checkTypeEX=='通过'" style="color:green">通过</span>
              <span v-if="scope.row.checkTypeEX=='驳回'" style="color:red">驳回</span>
              <span v-if="scope.row.checkTypeEX=='审批中'" >审批中</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime"  label="发起时间" :formatter='dateFormat'></el-table-column>
          <el-table-column prop="groupCode"  label="团期计划"></el-table-column>
          <el-table-column prop="supplierName"  label="供应商名称"></el-table-column>
          <el-table-column prop="supplierTypeEX" label="类型"></el-table-column>
          <el-table-column prop="price" label="借款金额"></el-table-column>
          <el-table-column prop="expensePrice"   label="已核销金额"></el-table-column>
          <el-table-column prop="createUser" label="申请人"></el-table-column>
          <el-table-column label="操作"> 
            <template slot-scope="scope">
              <el-button @click="showDetailDialog(scope.row,childChangedTab)" type="text" size="small">详情</el-button>       
            </template>
          </el-table-column>
      </el-table>
  <!-- 游轮table表格 end-->
   <!-- 跟团table表格 -->
      <el-table v-loading="listLoading" :data="grouptableData" border stripe :header-cell-style="getRowClass" v-show="childChangedTab==='groupITour'" style="width: 100%">
          <el-table-column prop="paymentID"  label="借款单号"></el-table-column>
          <el-table-column  prop="checkTypeEX" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.checkTypeEX=='通过'" style="color:green">通过</span>
              <span v-if="scope.row.checkTypeEX=='驳回'" style="color:red">驳回</span>
              <span v-if="scope.row.checkTypeEX=='审批中'" >审批中</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime"  label="发起时间" :formatter='dateFormat'></el-table-column>
          <el-table-column prop="groupCode"  label="团期计划"></el-table-column>
          <el-table-column prop="supplierName"  label="供应商名称"></el-table-column>
          <el-table-column prop="supplierTypeEX" label="类型"></el-table-column>
          <el-table-column prop="price" label="借款金额"></el-table-column>
          <el-table-column prop="expensePrice"   label="已核销金额"></el-table-column>
          <el-table-column prop="createUser" label="申请人"></el-table-column>
          <el-table-column label="操作"> 
            <template slot-scope="scope">
              <el-button @click="showDetailDialog(scope.row,childChangedTab)" type="text" size="small">详情</el-button>       
            </template>
          </el-table-column>
      </el-table>
  <!-- 跟团table表格 end-->
<!-- tab切换表格渲染 end-->  
  <!-- 分页 -->
      <div class="block">
        <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page.sync="pageIndex" 
          :page-sizes="[10, 20, 30, 40]" :page-size=pageSize :total=total  layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
  <!-- 分页 end-->
 
    <!-- 列表详情弹框 -->
    <el-dialog :title="'借款申请详情'+childChangedTab" width="1100px" :visible.sync="detailDialogVisible" :show-close="false" class="city_list">
        <span slot="footer" class="dialog-footer">
          <el-button @click="detailDialogVisible = false">取 消</el-button>
          <el-button type="danger" @click="repeal()"  v-if="alertInfo.checkTypeEX==='审批中'">撤销借款</el-button>
        </span> 
      <!-- 组件弹框详情 -->     
       <childdetaildialog :alertInfo="alertInfo" :paymentID="paymentID"></childdetaildialog> 
    </el-dialog>
    <!-- 列表详情弹框 end-->
    <!-- 点击申请按钮弹框 -->
    <el-dialog :title="'借款申请'+childChangedTab" width="1100px" :visible.sync="applyDialogVisible" :show-close="false" class="city_list">
        <span slot="footer" class="dialog-footer">
          <el-button @click="applyDialogVisible = false">取 消</el-button>
          <el-button type="primary">申请</el-button>
        </span> 
      <!-- 组件弹框详情 -->     
        <borrow-apply></borrow-apply>
    </el-dialog>
   
    <!-- 点击申请按钮弹框end -->
  </div>
</template>

<script>
  import moment from 'moment'
  import {testTableData} from "../mixins/testTableData.js";    // 导入混合对象
  import childdetaildialog from '@/page/Finance/testLoanManagement/testformQuery/childDetailDialog'
  import borrowApply from '@/page/Finance/testLoanManagement/testformQuery/borrowApply'
  
  export default {
   
    data() {
      return {
        formquery: {
          teamPlan: '',
          borrower: '',
          checkType: '',
          applyBeginTime: '',
          applyLastTime: '',  
        },
       

        tableDataBorrower:[],//借款人
        keepBorrowerUserCode: null, // 模糊查询之后选中事件获得 借款人对应的 usercode
        ifShowsearch: false,
        applyDialogVisible: false, //申请弹框
        detailDialogVisible: false, //详情弹框
        // checkTypeEX:'',
        // paymentID:'',
        childChangedTab:this.changedTab,//把从父组件传过来的值重新赋值给一个变量，方便修改此变量
        alertInfo:{},//table的row信息通过props传值给子组件
        paymentID:null,
      }
    },
    props:{
      changedTab:{
        type:String,
        default:'freeITour'//默认是自由行tab
      }
    },
    mixins: [testTableData], //混入对象
    components:{
      childdetaildialog,borrowApply
    },
    mounted(){
     
    },
     
    methods: {    
     moment,
     //点击申请按钮显示弹框  
    borrowApplyClick(){
      this.applyDialogVisible=true;
    },
    //点击详情按钮显示弹框
    showDetailDialog(row,tableType){
      this.detailDialogVisible=true;
      this.alertInfo=row;
      this.paymentID=row.paymentID;
      this.tableType=tableType;
      //this.getBasicInfo(row.paymentID);
    },
    cancelDetailDialog(){ 
       this.detailDialogVisible=false;
    },
    
   //点击撤销按钮
    // repeal(guid,tabType){ 
    //     console.log(this.alertInfo)
    //       console.log(guid+','+tabType);               
        // this.$confirm("是否需要撤销该笔借款?", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning"
        // })
        // .then(() => {
        //     console.log(guid+','+tabType);
        //     this.$http.post(this.GLOBAL.jqUrl + "/JQ/EndProcessForJQ",{
        //     "jq_id": guid,
        //     "jQ_Type": tablePayment
        //     }).then(res => {
        //     this.$message.success("撤销成功");
        //     this.checkIncomeShow = false;
        //     this.deleteBorrow();
        //     this.history.go(0); // 刷新页面
        //     })
        // })
        // .catch(() => {
        //     this.$message({
        //     type: "info",
        //     message: "撤销借款已取消"
        //     });
        // });
    //},
   
  
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
        var results = queryBorrowerString ? this.tableDataBorrower.filter(this.createFilteBorrowerr(queryBorrowerString)) : [];
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
      this.keepBorrowerUserCode = item.userCode
    },
    // 借款人 失焦
    departureBorrowerBlur(){
      if(this.formquery.borrower === ''){
        this.ifShowsearch = false
      }else {
        if(this.keepBorrowerUserCode == null){
          this.ifShowsearch = false
          this.formquery.borrower = ''
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
   
    applyBtn(){

    },
    handleClick(row) {
      
    },
   
   

   
    }
  };
</script>
