 <!-- 查看无收入借款详情弹窗子组件-->
<template>
    <div>       
    <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>     
        <el-tag v-if="alertInfo.checkTypeEX==='通过'">通过</el-tag>
        <el-tag v-if="alertInfo.checkTypeEX==='驳回'" type="warning">驳回</el-tag>
        <el-tag v-if="alertInfo.checkTypeEX==='审批中'" type="info">审批中</el-tag>
        <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
                <el-col :span="6"><div>ID:</div></el-col>
                <el-col :span="18"><div>{{basicInfo.id}}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="7"><div>申请人:</div></el-col>
                <el-col :span="17"><div>{{basicInfo.createUser}}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="8"><div>创建时间:</div></el-col>
                <el-col :span="16"><div>{{basicInfo.createTime}}</div></el-col>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
                <el-col :span="6"><div>团期计划:</div></el-col>
                <el-col :span="18"><div>{{ basicInfo.groupCode }}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="7"><div>产品名称:</div></el-col>
                <el-col :span="17"><div>{{ basicInfo.productName }}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="8"><div>供应商:</div></el-col>
                <el-col :span="16"><div >{{ basicInfo.supplierName }}</div></el-col>
            </el-col>
        </el-row> 
        <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="6">
                <el-col :span="6"><div>借款类型:</div></el-col>
                <el-col :span="18"><div>{{ basicInfo.supplierTypeEX }}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="7"><div>借款金额:</div></el-col>
                <el-col :span="17"><div >{{ basicInfo.price }}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="8" ><div>摘要:</div></el-col>
                <el-col :span="16"><div>{{ basicInfo.mark }}</div></el-col>
            </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
            <el-col :span="6">
                <el-col :span="6"><div>账号:</div></el-col>
                <el-col :span="18"><div>{{ basicInfo.cardNumber }}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="7"><div>开户行:</div></el-col>
                <el-col :span="17"><div>{{ basicInfo.bankName }}</div></el-col>
            </el-col>
            <el-col :span="7">
                <el-col :span="8"><div>开户名:</div></el-col>
                <el-col :span="16"><div>{{ basicInfo.cardName }}</div></el-col>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" >
            <el-col :span="8">
                <el-col :span="7" ><div>支付账户:</div></el-col>
                <el-col :span="12"><div>{{ basicInfo.accountsName }}</div> </el-col>
            </el-col>
            <el-col :span="14">
                <el-col :span="7"><div>附件:</div></el-col>
                <el-col :span="17">
                    <el-upload name="files" :file-list="fileList"  :show-file-list=true  action="test" :disabled=true  :on-preview="handlePreview"></el-upload>
                </el-col>
            </el-col>
        </el-row>
    <!-- 基本信息 end-->
    <!-- 审核结果 -->
        <el-divider content-position="left">审核结果</el-divider> 
        <el-table  :data="checkResultTableData" border stripe :header-cell-style="getRowClass" style="width: 100%">
          <el-table-column prop="participantName"  label="审批人"></el-table-column>
          <el-table-column  prop="approvalName" label="审批结果"></el-table-column>        
          <el-table-column prop="No"  label="审批意见"></el-table-column>
          <el-table-column prop="finishedTime"  label="审批时间"></el-table-column> 
        </el-table>    
    <!-- 审核结果 end-->
    <!-- 相关信息 -->
        <!-- 金额部分 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>相关信息</el-divider>
        <el-table :data="moneyTableData" border :header-cell-style="getRowClass">
            <el-table-column prop="payable" label="订单总额" align="center"></el-table-column>
            <el-table-column prop="paymentChecking" label="审批中借款总额" align="center"></el-table-column>
            <el-table-column prop="payment" label="已审批借款总额" align="center"></el-table-column>
            <el-table-column prop="expenseChecking" label="报销中总额" align="center"></el-table-column>
            <el-table-column prop="expense" label="已报销总额" align="center"></el-table-column>
            <el-table-column prop="price" label="已收总额" align="center"></el-table-column>
            <el-table-column label="供应商欠款总额" align="center">
                <!-- 供应商欠款总额:订单总额-已收总额 -->
                <template slot-scope="scope">
                    <div>{{ scope.row.payable - scope.row.price}}</div>
                </template>
            </el-table-column>
            </el-table>
        <!-- 金额部分 end-->
        <!-- 无收入借款明细 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>无收入借款明细</el-divider>
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
        </el-table>
        <!-- 无收入借款明细 end-->
         <!-- 预付款明细 -->
        <el-divider content-position="" class='title-margin title-margin-t'>预付款明细</el-divider>
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
        </el-table>
        <!-- 预付款明细 END -->
        <!-- 收入明细 -->
        <el-divider content-position="left" class='title-margin title-margin-t'>收入明细</el-divider>
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
        </el-table>
        <!-- 收入明细 END -->
    <!-- 相关信息 END -->
   
    </div>                  
</template>
<script>
    import {testTableData} from "../mixins/testTableData.js";    // 导入混合对象
    export default {
        data() {
            return {
                
                fileList: [
                   {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
                   {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
                   ],
              
            }
        },
        props:{
            alertInfo:{},
            paymentID:Number,
            tableType:'',
        },
        mixins: [testTableData], //混入对象
        watch:{    
        //点击详情时监测 paymentID的变化 加载对应的弹出框   
       paymentID: {
        handler(newValue, oldValue) {
            console.log('jiantingchild');
            console.log(newValue, oldValue);
            this.getBasicInfo(newValue);
        },
        // 立即执行handler函数
        immediate: true
        },
    },
        methods:{
            handlePreview(file) {
                console.log('文件')
                console.log(file);
               // window.open(file.url);

            },
            //基本信息内容
         async getBasicInfo(ID){
            let res=await this.$http.post( this.GLOBAL.serverSrc + "/finance/payment/api/get",{
                "id": ID                
            });
            this.basicInfo={};
            this.basicInfo= res.data.object;//基本信息
            console.log(res.data.object)
            console.log( this.basicInfo)
            console.log('ziyeid:'+ ID)
            console.log('基本信息paymentType'+res.data.object.guid+','+ res.data.object.paymentType)
            console.log('审核结果guid'+res.data.object.guid);
             
            console.log('审核结果planID'+res.data.object.planID);
            this.auditResult(res.data.object.guid, res.data.object.paymentType);//审核结果函数
            this.relatedInfo(res.data.object.planID)//相关信息函数
        },
         //审核结果内容
        async auditResult(guid,paymentType){
            let res=await this.$http.post(this.GLOBAL.jqUrl + '/JQ/GetInstanceActityInfoForJQ',{
                jQ_ID: guid,
                jQ_Type: paymentType, // 借款类型 无收入1 预付款2 基本信息返回的paymentType
            });
            this.checkResultTableData=[];
            this.checkResultTableData=res.data.extend.instanceLogInfo;
            console.log('审核结果');
             console.log(res.data.extend.instanceLogInfo);
            console.log(this.checkResultTableData.length);
        },
         //相关信息
        async relatedInfo(planID){
        //表格1:获取金额信息
            let resMoney = await this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/fivetotal', {
                "id": planID 
            });
            console.log('相关信息金额'+planID);
            if (resMoney.data.isSuccess == true) {
                 this.moneyTableData=[];
                 //res.data.object 是一个对象不能直接赋值给table，需要push
                 this.moneyTableData.push(resMoney.data.object);
                 console.log( this.moneyTableData.length)
            };
        //表格2:无收入借款明细
            let resNocome = await this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
                object: {paymentType: 1, planID: planID} //1 无收入 2 预付款
            });
             if (resNocome.data.isSuccess == true) {
                this.tableNoIncome=[];
                this.tableNoIncome=resNocome.data.objects;
                console.log('无收入借款明细');
                console.log(resNocome.data.objects)
            }
        //表格3:预付款明细
            let resprePay = await this.$http.post(this.GLOBAL.serverSrc + '/financequery/get/api/paymentdetails', {
                object: {paymentType: 2, planID: planID} //1 无收入 2 预付款
            });
             if (resprePay.data.isSuccess == true) {
                this.tablePayment=[];
                this.tablePayment=resprePay.data.objects;
                console.log('预付款明细');
                console.log(resprePay.data.objects)
            }
        //表格4:收入明细
            let resIncome = await this.$http.post(this.GLOBAL.serverSrc + '/orderquery/api/income/detail', {
                id: planID
            });
            
            if (resIncome.data.isSuccess == true) {
                this.tableIncome=[];
                this.tableIncome=resIncome.data.objects;
                    console.log('收入明细');
                    console.log(resIncome.data.objects)
            }
                
        },
        }

    }
</script>
<style scoped>
.row-bg{margin: 15px  auto}
</style>>