/*
 * @Author: WZJ 
 * @Date: 2020-03-25 14:55:58 
 * @Last Modified by: WZJ
 * @Last Modified time: 2020-03-30 15:37:05
 */
<template>
  <div class="distributor-content" id="industrialBank">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="7">
          <el-form-item label="匹配状态:" class="status-length" prop="matchType">
            <el-select v-model="ruleForm.matchType" placeholder="请选择匹配状态">
              <el-option label="全部" value="0"></el-option>
              <el-option label="剩余金额为0" value="1"></el-option>
              <el-option label="剩余金额不为0" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="银行流水号:" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入交易流水号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="交易日期:" prop="dateStart">
            <el-col :span="11">
              <el-form-item prop="dateStart">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateStart" :picker-options="startDatePicker" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="dateEnd">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.dateEnd" :picker-options="endDatePicker" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8" :offset="16">
          <el-form-item class="buttonForm">
            <el-button @click="searchHandInside()" type="primary">搜索</el-button>
            <el-button @click="emptyButtonInside('ruleForm')" type="primary" plain>重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 搜索表单 END -->
    <div class="buttonsDv">
      <el-button @click="setZCK" type="warning">设置暂存款</el-button>
      <el-upload
        class="upload-demo"
        :action="UploadUrl1()"
        :headers="headers"
        :on-success="handleSuccess1"
        :on-error="handleError1"
        :on-remove="handleRemove1"
        :before-remove="beforeRemove1"
              :before-upload="beforeUpload"
        :data="File"
        name="excelfile">
        <el-button type="primary">添加兴业银行流水单</el-button>
      </el-upload>
      <el-upload
        class="upload-demo"
        :action="UploadUrl2()"
        :headers="headers"
        :on-success="handleSuccess2"
        :on-error="handleError2"
        :on-remove="handleRemove2"
        :before-remove="beforeRemove2"
              :before-upload="beforeUpload"
        :data="File"
        name="excelfile">
        <el-button type="primary" plain>添加微信支付宝明细</el-button>
      </el-upload>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border :highlight-current-row="true" :header-cell-style="getRowClass" :stripe="true" id="table-content">
      <el-table-column label="操作" width="140" align="center" fixed>
        <template slot-scope="scope">
         <!-- {{scope.row.surplus_Amount != scope.row.credit_amount + scope.row.purpose_fee}}
         {{scope.row.surplus_Amount}}
          {{scope.row.credit_amount}}
           {{scope.row.purpose_fee}} -->
          <el-button @click="payDetail(scope.row)" type="text" size="small" class="table_details" v-if="scope.row.reference == '收付直通车支付结算'">查看微信</br>支付宝明细</el-button>
           <el-button @click="orderDetail(scope.row)" type="text" size="small" class="table_details" v-else>查看订单</el-button>
          <el-button v-if="scope.row.surplus_Amount == scope.row.credit_amount + scope.row.purpose_fee&&scope.row.reference != '收付直通车支付结算'" @click="deleteFun(scope.row)" type="text" size="small" class="table_details">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="明细ID" align="center">
      </el-table-column>
      <el-table-column prop="surplus_Amount" label="剩余金额" align="center">
      </el-table-column>
      <el-table-column prop="is_ZCK" label="暂存款状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_ZCK == 0">未设置</span>
          <span v-if="scope.row.is_ZCK == 1">已设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="purpose_fee" label="手续费" align="center">
      </el-table-column>
      <el-table-column prop="bank_serial_number" label="银行流水号" align="center">
      </el-table-column>
      <el-table-column prop="reference" label="摘要" align="center">
      </el-table-column>
      <el-table-column prop="transaction_Date" label="交易日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transaction_Date.split('T')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transaction_Date" label="交易时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transaction_Date.split('T')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purpose" label="用途" align="center">
      </el-table-column>
      <el-table-column prop="credit_amount" label="贷方金额" align="center">
      </el-table-column>
      <el-table-column prop="account_number" label="账号" align="center">
      </el-table-column>
      <el-table-column prop="account_name" label="户名" align="center">
      </el-table-column>
      <el-table-column prop="certificate_code" label="凭证代号" align="center">
      </el-table-column>
      <el-table-column prop="currency" label="币种" align="center">
      </el-table-column>
      <el-table-column prop="cash_or_transfer" label="现/转" align="center">
      </el-table-column>
      <el-table-column prop="debit_amount" label="借方金额" align="center">
      </el-table-column>
      <el-table-column prop="account_number_other" label="对方账号" align="center">
      </el-table-column>
      <el-table-column prop="account_name_other" label="对方户名" align="center">
      </el-table-column>
      <el-table-column prop="bank_other" label="对方银行" align="center">
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="remark" label="所属公司" align="center">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageCurrent" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total='total'>
      </el-pagination>
    </div>
    <!-- 表格 END -->
    <orderDetail :dialogFormVisible="dialogFormVisible" @close="close" :info="info"></orderDetail>
  </div>
</template>
 
<script type="text/javascript">
import moment from 'moment'
import orderDetail from '@/page/Finance/bankStatement/orderDetails.vue'
import * as utils from './utils.js'
export default {
  components: {
    orderDetail
  },
  data() {
    return {
      tableData: [], // 表格数据
      ruleForm: {
        matchType: '', // 匹配状态
        code: '', // 交易流水号
        dateStart: '', // 开始时间
        dateEnd: '', // 结束时间
      },
      File:{},
      pageCurrent: 1,
      pageSize: 10,
      total: 0,

      info: '',
      dialogFormVisible: false,

      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate()
    }
  },
  created () {
    this.loadData()
  },
  computed: {
    // 计算属性的 getter
    headers(){
      return {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    },

    countTest:function () {
      return this.$store.state.bankDataUpdate
    }
  },
  watch: {
    countTest:function(newV, oldV){
      const that = this;
      if(newV.indexOf("industrialBankSK") != -1 && newV != oldV){
        setTimeout(function () {
          // alert('数据改变，执行loadDataSXF~')
          that.loadData()
        },500)
      }
    },
  },
  methods: {
      beforeUpload(event, file, filelist) {
      let data4D=utils.getSession4D()
      this.File.FileName = event.name;
      this.File.userid=data4D.userID
      this.File.orgid=data4D.orgID
      this.File.topid=data4D.topID
      this.File.company=data4D.company//测试 暂时写死
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    setZCK(){
      this.$router.push({
        path: '/bankStatement/bankZCK',
        name: '银行流水单管理  /设置暂存款',
        query: {
          "searchType": 'second'
        }
      });
    },
    UploadUrl1(){
      return this.GLOBAL.serverSrc + '/finance/industrialbank/api/ImportExcel';
    },
    handleSuccess1(response, file, fileList){
    
      if(response == true){
        this.$message.success("兴业银行流水单上传成功！");
        this.pageCurrent = 1;
        this.loadData();
        this.$store.commit('changeBankData', 'industrialBankSXF' + Math.random());
      }else{
        this.$message.warning("兴业银行流水单上传失败！");
      }
    },
    handleError1(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove1(file, fileList) {
      
    },
    beforeRemove1(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    UploadUrl2(){
      let upURL=''
      let data4D=utils.getSession4D();
      switch(data4D.company){
        case '辽宁大运通' :
          upURL=this.GLOBAL.serverSrc + '/finance/wa_payment/api/ImportExcel'
          break;
        case '吉林大运通' :
          upURL=this.GLOBAL.serverSrc + '/finance/wa_payment_jl/api/ImportExcel'
      }
    
      return upURL;
    },
    handleSuccess2(response, file, fileList){
      
      if(response == true){
        this.$message.success("微信支付宝明细上传成功！");
        this.pageCurrent = 1;
        this.loadData();
      }else{
        this.$message.warning("微信支付宝明细上传失败！");
      }
    },
    handleError2(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove2(file, fileList) {
     
    },
    beforeRemove2(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    searchHandInside(){
      this.pageCurrent = 1;
      this.loadData();
    },
    emptyButtonInside(){
      this.$refs['ruleForm'].resetFields();
      this.pageCurrent = 1;
      this.loadData();
    },
    orderDetail(row){
      this.dialogFormVisible = true;
      this.info = {
        id: row.id,
        type: 1
      };
    },
    close(){
      this.dialogFormVisible = false;
      this.info = '';
    },
    payDetail(row){
      let data4D=utils.getSession4D();
      this.$router.push({
        path: '/bankStatement/payDetails',
        name: '银行流水单管理  /微信支付宝明细',
        query: {
          id:row.id,
          type:2,
          creditAmount:row.credit_amount,
          company:data4D.company,
          "purpose_Merchant_code": row.purpose_Merchant_code,
          "purpose_Date": row.purpose_Date,
        }
      });
    },
    deleteFun(row){
      const that = this;
      this.$confirm('是否需要删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/delete", {
          "id": row.id,
        }).then(function(response) {
          if (response.data.isSuccess) {
            that.pageCurrent = 1;
            that.loadData();
            that.$store.commit('changeBankData', 'industrialBankSXF' + Math.random());
            that.$message({
              type: 'info',
              message: '已删除'
            });
          } else {
            if(response.data.message){
              that.$message.warning(response.data.result.message);
            }else{
              that.$message.warning("删除失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
          that.$message.warning("删除失败~");
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.pageCurrent = 1;
      this.loadData();
    },
    handleCurrentChange(val){
      this.pageCurrent = val;
      this.loadData();
    },
    loadData(){
      const that = this;
      let dateStart = '', dateEnd = '';
      let data4D=utils.getSession4D
      if(this.ruleForm.dateStart){
        dateStart = moment(this.ruleForm.dateStart).format('YYYY-MM-DD 00:00:00')
      }
      if(this.ruleForm.dateEnd){
        dateEnd = moment(this.ruleForm.dateEnd).format('YYYY-MM-DD 23:59:59')
      }
      
      this.$http.post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/Search", {
        "pageIndex": this.pageCurrent - 1,
        "pageSize": this.pageSize,
        "object": {
          "matching_State": this.ruleForm.matchType ? this.ruleForm.matchType : 0,
          "transaction_reference_number": this.ruleForm.code,
          "begin": dateStart ? dateStart : "2000-05-16",
          "end": dateEnd ? dateEnd : "2099-05-16",
          "seachType": 0,
             userid: data4D.userID, // 暂无数据 想看改成0,
            orgid: data4D.orgID, // 暂无数据 想看改成0,
            topid: data4D.topID, // 暂无数据 想看改成0,
            company: data4D.company,
        }
      }).then(function (obj) {
        // console.log('兴业银行',obj);
        if(obj.data.isSuccess){
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          // that.tableDataNBSK.forEach(function (item, index, arr) {
          //   item.collectionTime = item.collectionTime.split('T')[0];
          // });
          // that.loadingNBSK = false;
        }else{
          // that.loadingNBSK = false;
          that.total = 0;
          that.tableData = [];
        }
      })
    },
    beginDate(){
      const that = this;
      return {
        disabledDate(time){
          if (that.ruleForm.dateEnd) {  //如果结束时间不为空，则小于结束时间
            return new Date(that.ruleForm.dateEnd).getTime() < time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    processDate(){
      const that = this;
      return {
        disabledDate(time) {
          if (that.ruleForm.dateStart) {  //如果开始时间不为空，则结束时间大于开始时间
            return new Date(that.ruleForm.dateStart).getTime() > time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
  }
}

</script>
<style lang="scss">
  #industrialBank.distributor-content{
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    .form-content{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .buttonForm{
        text-align: end;
      }
      .el-select{
        width: 100% !important;
      }
      .line{
        text-align: center;
      }
    }
    .buttonsDv{
      width: 98%;
      margin: 5px auto;
      .el-button{
        margin-right: 10px;
      }
    }
    #table-content{
      width: 98%;
      margin: 40px auto 20px;
    }
    .block{
      width: 100%;
      text-align: center;
      margin: 30px auto;
    }
    .upload-demo{
      display: inline-block!important;
      .el-upload-list{
        display: none!important;
      }
    }
  }

</style>
