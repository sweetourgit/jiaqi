

<template>
<div style="padding-bottom:80px">
   <el-form ref="formquery" :model="formquery" label-width="80px" >
            
         <el-row type="flex" class="row-bg">
            <el-col :span="8">
                <el-form-item label="团期计划" prop="teamPlan">
                    <el-input v-model="formquery.teamPlan"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">              
                <el-form-item label="借款人" prop="borrower">
                   <el-autocomplete
                    style="width: 100%"
                    class="name_input"
                    v-model="formquery.borrower"
                    :fetch-suggestions="querySearchBorrower"
                    placeholder="请输入借款人"
                    :trigger-on-focus="false"
                    @select="departureBorrower"
                    @blur="departureBorrowerBlur"
                    @focus="departureBorrowerFocus"
                    ></el-autocomplete>
                </el-form-item>               
            </el-col>
            <el-col :span="8">
                <el-form-item label="状态" prop="checkType">
                  <el-select v-model="formquery.checkType" placeholder="请选择类型">
                    <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                 
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
                    <!-- <el-button @click="resetForm('formquery')">重置</el-button> -->
                     <el-button @click="resetForm('formquery')">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
</el-form>

 <el-button type="primary" @click="applyBtn()" class="add-style">申请</el-button>

<el-table
v-loading="listLoading"
    :data="tableData"
    border
     stripe
     :header-cell-style="getRowClass"
    style="width: 100%">
    <el-table-column
      fixed
      prop="paymentID"
      label="借款单号">
    </el-table-column>
    <el-table-column
      prop="checkTypeEX"
      label="状态">
     <template slot-scope="scope">
         <span v-if="scope.row.checkTypeEX=='通过'" style="color:green">通过</span>
         <span v-if="scope.row.checkTypeEX=='驳回'" style="color:red">驳回</span>
         <span v-if="scope.row.checkTypeEX=='审批中'" >审批中</span>

     </template>

    </el-table-column>
    <el-table-column
      prop="createTime"
      label="发起时间">
    </el-table-column>
    <el-table-column
      prop="groupCode"
      label="团期计划">
    </el-table-column>
    <el-table-column
      prop="supplierName"
      label="供应商名称">
    </el-table-column>
    <el-table-column
      prop="supplierTypeEX"
      label="类型">
    </el-table-column>
    <el-table-column
    prop="price"
      label="借款金额">
     
    </el-table-column>
      <el-table-column
     prop="expensePrice"
      label="已核销金额">    
    </el-table-column>
    <el-table-column
     prop="createUser"
      label="申请人">    
    </el-table-column>
     <el-table-column
      label="操作"> 
    <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
       
      </template>

    </el-table-column>
  </el-table>

    <div class="block">
   
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curpage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size=pageSize
     
      :total=total>
    </el-pagination>
  </div>
</div>



</template>

<script>
  export default {
    data() {
      return {
        formquery: {
          teamPlan: '',
          borrower: '',
          checkType: '',
          applyBeginTime: '',
          applyLastTime: false,       
       
        },
           options: [{
            value: '0',
            label: '审批中'
            }, {
             value: '1',
             label: '通过'
            }, {
             value: '2',
             label: '驳回'
            }],
         tableData: [{
          paymentID: '',
          checkTypeEX: '',
          province: '',
          createTime: '',
          groupCode: '',
          supplierName: '',
          type:'',
          borrowsPrice:'9',
          expensePrice:'',
          createUser:'',
        }],
        listLoading:true,
         curpage:1,
         total:0,
         pageSize:10,
         pageIndex:1,
         tableDataBorrower:[],//借款人
         keepBorrowerUserCode: null, // 模糊查询之后选中事件获得 借款人对应的 usercode
         ifShowsearch: false,
      };


      

    },
    created(){

        this.getPageList();//加载table页

      },
    
   
    methods: {
      onSubmit() {
        console.log('submit!');



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
      if(this.formquery.borrower == ''){
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
      resetForm(formName) {
          console.log(formName);
        this.$refs[formName].resetFields();
      },
      applyBtn(){

      },
       handleClick(row) {
       
      },
       handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize=val;
         this.getPageList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageIndex=val;
         this.getPageList();
      },
      // 表格表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
      } else {
        return ''
      }
    },

      //获取分页列表
        async getPageList(){   
             this.listLoading = true;
            let res=await this.$http.post( this.GLOBAL.serverSrc + "/finance/payment/api/page",{
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                total:this.total,
                object: {paymentType: 1, checkType: "-1"}
            });
            console.log(res.data);
            this.total=res.data.total;
            this.tableData=res.data.objects;   
            this.listLoading = false;        
        },

     //有条件获取分页列表
     async getFilterPageList(){ 
            let res=await this.$http.post( this.GLOBAL.serverSrc + "/finance/payment/api/page",{
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                total:this.total,
                object: {
                    paymentType: 1, //无收入借款
                    checkType: this.checkType, //状态                  
                    groupCode:this.groupCode,
                    beginTime: this.applyBeginTime,
                    endTime: this.applyLastTime,
                    createUser: this.createUser,
                   
 




                    }
            });
            console.log(res.data);
            this.total=res.data.total;
            this.tableData=res.data.objects;           
        }
    }
  };
</script>