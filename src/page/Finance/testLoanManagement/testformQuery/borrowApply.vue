 <!-- 借款申请弹窗子组件-->
<template>
    <div>     
       <el-divider content-position="left" class='title-margin title-margin-t'>基本信息</el-divider>   
    <!-- 表单申请 -->
      <el-form ref="applyForm" :model="applyForm" label-width="110px" >            
          <el-row type="flex" class="row-bg">
            <el-form-item label="团期计划" prop="teamPlan">
                <el-autocomplete v-model="applyForm.teamPlan"  :fetch-suggestions="querySearch" placeholder="请输入团期计划" :trigger-on-focus="false"
                @select="departureSelect" @blur="departureBlur" ></el-autocomplete>
            </el-form-item>  
            <el-form-item  prop="productName" style="width:300px" label-width="10px">
                <el-input v-model="applyForm.productName" placeholder="通过输入团期计划自动补充团期名称" :disabled="true"></el-input>
               
            </el-form-item> 
            <el-form-item label-width="10px"> <el-button type="info" plain>选择</el-button></el-form-item>   
          </el-row>
          <el-row type="flex" class="row-bg">  
             <el-form-item label="供应商名称" prop="suppliers">
                <el-autocomplete v-model="applyForm.suppliers"  :fetch-suggestions="querySearchSuppliers" placeholder="请输入供应商名称" :trigger-on-focus="false"
                      @select="departureSelectSupplier" @blur="departureSuppliers"></el-autocomplete>
             </el-form-item>
          </el-row>
         
          <el-row type="flex" class="row-bg">         
             <el-form-item label="借款类型" prop="paymentType">
                <el-select v-model="applyForm.paymentType" placeholder="请选择借款类型">
                <el-option v-for="item in paymentTypeData"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                
                </el-select>
             </el-form-item>
          </el-row>
           <el-row type="flex" class="row-bg">         
            <el-form-item label="借款金额" prop="paymentPrice" >
                <el-input v-model="applyForm.paymentPrice"></el-input>
             </el-form-item>
          </el-row>
          <el-row type="flex" class="row-bg">         
            <el-form-item label="摘要" prop="summary">
                <el-input v-model="applyForm.summary"></el-input>
             </el-form-item>
          </el-row>
          <el-row type="flex" class="row-bg">         
            <el-form-item label="汇款账户" prop="account">
                <el-input v-model="applyForm.name"></el-input>
            </el-form-item>
            <el-form-item label="" prop="accountOpenName"  label-width="10px">
                <el-input v-model="applyForm.name"></el-input>
            </el-form-item>
            <el-form-item label="" prop="accountBank"  label-width="10px">
                <el-input v-model="applyForm.name"></el-input>
            </el-form-item>
            <el-button type="info" plain >选择</el-button>
          </el-row>
          
          <el-row type="flex" class="row-bg">         
            <el-form-item label="附件" prop="name"> 
                <el-upload class="upload-demo" name="files" ref="upload" multiple :action="this.upload_url" :file-list="fileList" :on-change="handleChange" :on-error="handleError" :on-success="handleSuccess" :on-remove="handleRemove" :on-preview="handlePreview">
                    <el-button size="small" type="primary">点击上传</el-button>      
                </el-upload>         
            </el-form-item>
          </el-row>
      </el-form>
  <!-- 表单搜索 end-->
    <!-- 相关信息 -->
        <!-- 金额部分 -->
        <!-- <el-divider content-position="left" class='title-margin title-margin-t'>相关信息</el-divider>
        <el-table :data="moneyTableData" border :header-cell-style="getRowClass">
            <el-table-column prop="payable" label="订单总额" align="center"></el-table-column>
            <el-table-column prop="paymentChecking" label="审批中借款总额" align="center"></el-table-column>
            <el-table-column prop="payment" label="已审批借款总额" align="center"></el-table-column>
            <el-table-column prop="expenseChecking" label="报销中总额" align="center"></el-table-column>
            <el-table-column prop="expense" label="已报销总额" align="center"></el-table-column>
            <el-table-column prop="price" label="已收总额" align="center"></el-table-column>
            <el-table-column label="供应商欠款总额" align="center"> -->
                <!-- 供应商欠款总额:订单总额-已收总额 -->
                <!-- <template slot-scope="scope">
                    <div>{{ scope.row.payable - scope.row.price}}</div>
                </template>
            </el-table-column>
            </el-table> -->
        <!-- 金额部分 end-->
        <!-- 无收入借款明细 -->
        <!-- <el-divider content-position="left" class='title-margin title-margin-t'>无收入借款明细</el-divider>
        <el-table :data="tableNoIncome" border :header-cell-style="getRowClass">
            <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
            <el-table-column label="审批状态" align="center">
                <template slot-scope="scope">
                <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >审批中</div>
                <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >驳回</div>
                <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >通过</div>
                </template>
            </el-table-column>
            <el-table-column prop="supplierType" label="借款类型" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.supplierType=='0'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='1'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='2'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='3'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='4'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='5'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='6'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='7'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='8'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='9'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='10'">{{scope.row.supplierTypeEX}}</div>
                    <div v-if="scope.row.supplierType=='11'">{{scope.row.supplierTypeEX}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
            <el-table-column prop="price" label="金额" align="center"></el-table-column>
            <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
            <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
            <el-table-column prop="process" label="审批过程" align="center">
                <template slot-scope="scope">
                <div @click="processIncome(scope.$index, scope.row,1)">查看</div>
                </template>
            </el-table-column>
        </el-table> -->
        <!-- 无收入借款明细 end-->
         <!-- 预付款明细 -->
        <!-- <el-divider content-position="" class='title-margin title-margin-t'>预付款明细</el-divider>
        <el-table :data="tablePayment" border :header-cell-style="getRowClass">
        <el-table-column prop="paymentID" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="checkTypeEX" label="审批状态" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.checkTypeEX=='审批中'" style="color: #7F7F7F" >审批中</div>
                <div v-if="scope.row.checkTypeEX=='驳回'" style="color: #FF4A3D" >驳回</div>
                <div v-if="scope.row.checkTypeEX=='通过'" style="color: #33D174" >通过</div>
            </template>
        </el-table-column>
        <el-table-column prop="supplierTypeEX" label="借款类型" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.supplierType=='0'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='1'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='2'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='3'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='4'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='5'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='6'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='7'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='8'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='9'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='10'">{{scope.row.supplierTypeEX}}</div>
                <div v-if="scope.row.supplierType=='11'">{{scope.row.supplierTypeEX}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
        <el-table-column prop="price" label="金额" align="center"></el-table-column>
        <el-table-column prop="expensePrice" label="已核销金额" align="center"></el-table-column>
        <el-table-column prop="createName" label="申请人" align="center"></el-table-column>
        <el-table-column prop="process" label="审批过程" align="center">
            <template slot-scope="scope">
            <div @click="processIncome(scope.$index, scope.row,2)">查看</div>
            </template>
        </el-table-column>
        </el-table> -->
        <!-- 预付款明细 END -->
        <!-- 收入明细 -->
        <!-- <el-divider content-position="left" class='title-margin title-margin-t'>收入明细</el-divider>
        <el-table :data="tableIncome" border :header-cell-style="getRowClass">
        <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="channel" label="订单来源" align="center"></el-table-column>
        <el-table-column prop="person" label="订单联系人" align="center"></el-table-column>
        <el-table-column prop="number" label="人数" align="center"></el-table-column>
        <el-table-column prop="payable" label="订单金额" align="center"></el-table-column>
        <el-table-column prop="priceSum" label="已收金额" align="center"></el-table-column>
        <el-table-column label="欠款金额" align="center" prop="arrears"></el-table-column>
        <el-table-column prop="arrearsDate" label="欠款日期" align="center" >            
            <template slot-scope="scope">
            <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.arrearsDate | formatDateDetails }}</div>
            </template>
        </el-table-column>
        <el-table-column prop="repaymentDate" label="应还日期" align="center">
            <template slot-scope="scope">
            <div>{{ scope.row.orderChannel !== 1 ? '暂无' : scope.row.repaymentDate | formatDateDetails }}</div>
            </template>
        </el-table-column>
        </el-table> -->
        <!-- 收入明细 END -->
    <!-- 相关信息 END -->
   
    </div>                  
</template>
<script>
    // import {testTableData} from "../mixins/testTableData.js";    // 导入混合对象
    export default {
        data() {
            return {
                applyForm:{
                    teamPlan:'',
                    productName:'',
                    suppliers:'',//供应商
                    selectplanID: null, // 模糊查询之后选中事件获得
                    paymentType:'',//借款类型
                },
               teamPlanData:[],//团期计划输入提示数据
               SuppliersData:[],//供应商输入提示数据
               paymentTypeData:[],//借款类型options
               
               fileList:[],
               upload_url:this.GLOBAL.serverSrc + '/upload/obs/api/file', // 图片上传
            }
        },
        props:{
           
        },
        created(){
            this.getpaymentTypeData();//获取借款table

        },
        methods:{
            //获取借款table       
            async getpaymentTypeData(){
                this.paymentTypeData=[];
                let res= await this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/dictionaryget?enumname=PaymentType')
                let newTable=res.data.objects;
                for(let item of newTable){
                    this.paymentTypeData.push({label:item.name,value:item.id})
                }         
            },  

//文件上传
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      //this.fileList = fileList.slice(-3);
    },
    //文件上传失败时的钩子
    handleError(err, file) {
      this.fileList = []
    },
    //文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.fileCheckVal = fileList.length; // 成功时凭证的条数（校验用）
      // 多次添加图片判断，如果是第一次添加修改全部图片数据，否则修改新添加项数据
      if (this.time != fileList.length) { // 多张图片情况只在第一次执行数组操作
        this.time = fileList.length;
        if (this.fileList.length == 0) {
          this.fileList = fileList;
        } else {
          this.len = this.fileList.length;
          for (let i = this.len; i < fileList.length; i++) {
            this.fileList.push(fileList[i]);
          }
        }
      }
    var paths = null;
    for (let i = this.len; i < fileList.length; i++) {
      paths = JSON.parse(fileList[i].response).paths[0];
      this.$set(this.fileList[i], "width", paths.Width);
      this.$set(this.fileList[i], "height", paths.Height);
      this.$set(this.fileList[i], "url1", paths.Url);
      this.$set(this.fileList[i], "length", paths.Length);
      this.$set(this.fileList[i], "name", paths.Name);
    }
    this.uid = fileList[0].uid;
  },
  //文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.uid = fileList[0].uid;
      this.fileList = fileList
      this.fileCheckVal = fileList.length
    },
    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      // this.dialogVisible4 = true
      let getUrl = JSON.parse(file.response)
      this.uid = file.uid
      window.open(getUrl.paths[0].Url);
      this.imgBigName = file.name
      // this.imgBig = getUrl.paths[0].Url

    },







            //团期计划选择
            querySearch(queryString, cb) {
                this.teamPlanData = [];
                this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
                "object": {
                    "groupCode": this.applyForm.teamPlan, // 团号
                    "title": '', // 产品名称
                    "beginDate": 0, // 搜索用开始日期
                    "endDate": 0, // 搜索用结束日期
                    }
            }).then(res => {
                for (let i = 0; i < res.data.objects.length; i++) {
                    this.teamPlanData.push({
                        "value": res.data.objects[i].groupCode,//输入框显示的值value
                        "planID": res.data.objects[i].planID,
                    })
                };
                console.log('this.teamPlanData');
                console.log( this.teamPlanData);
                console.log('shuru:'+this.applyForm.teamPlan)
                var results = queryString ? this.teamPlanData.filter(this.createFilter(queryString)) : [];
                cb(results)
            }).catch(err => {})
            },
            // 模糊查询返回下拉选中项的输入框value
            createFilter(queryString1){
                return (restaurant) => { 
                    return (restaurant.value);//返回输入框的值
                }
             },

                // @select改变选中值
            departureSelect(item) {
                this.selectplanID = item.planID
                console.log('select:'+item.value)
            },
                //  失焦
            departureBlur(){               
                if(this.applyForm.teamPlan !== ''){
                  this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/planfinancelist', {
                    "pageIndex": 1,
                    "pageSize": 1,
                    "object": {
                        "groupCode": this.applyForm.teamPlan, // 团号
                        "title": '', // 产品名称
                        "beginDate": 0, // 搜索用开始日期
                        "endDate": 0, // 搜索用结束日期
                    }
                     }).then(res => {
                        if (res.data.isSuccess == true) {
                            //this.product_name_pre = res.data.objects[0].title
                            this.applyForm.productName = res.data.objects[0].title
                            this.selectplanID = res.data.objects[0].planID;
                            console.log('this.applyForm.productName'+ this.applyForm.productName)
                            //this.getPaymentdetails(res.data.objects[0].planID)
                        }
                        }).catch(err => {
                        console.log(err)
                        //this.product_name_pre = ''
                        this.applyForm.plan_01 = ''
                        })
                }
            },


            //供应商选择
             querySearchSuppliers(queryString, cb) {
                this.SuppliersData = [];
                this.$http.post(this.GLOBAL.serverSrc + '/universal/supplier/api/supplierlist', {
                    "object": {
                        name: this.applyForm.suppliers,
                        UserState:-1,
                        SupplierType:-1,
                        }
                }).then(res => {
                for (let i = 0; i < res.data.objects.length; i++) {
                    this.SuppliersData.push({
                        "value": res.data.objects[i].name,
                        "id": res.data.objects[i].id,
                        "supplierType": res.data.objects[i].supplierType
                    })
                };
                var results = queryString ? this.SuppliersData.filter(this.createFilter(queryString)) : [];
                cb(results)
                }).catch(err => {})
            },
            // @select改变选中值
            departureSelectSupplier(item) {
               
            },
            //失焦点
            departureSuppliers(){

            }
            
        }

    }
</script>
<style scoped>
.row-bg{margin: 15px  auto}
.el-form-item{margin-bottom: 0}
</style>>