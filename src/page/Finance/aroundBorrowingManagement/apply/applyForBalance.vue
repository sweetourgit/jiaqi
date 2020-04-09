<template>
  <div class="vivo" style="position:relative" id="applyFor">
    <!--申请预付款-->
    <el-dialog title="余额支付借款申请" :visible="dialogFormVisible" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="70%" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv">
          <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">申 请</el-button>
          <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
        </div>
        <el-divider content-position="left">基本信息</el-divider>
        <div>
          <el-form-item label="供应商名称：" prop="supplier" label-width="140px">
            <el-autocomplete class="inputWidth" v-model="ruleForm.supplier" :fetch-suggestions="querySearchD" placeholder="请输入供应商" @select="handleSelectD" @blur="blurHand">
              <template slot-scope="{ item }">
                <div>{{ item.valueName }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="回冲供应商：" prop="supplier" label-width="140px">
            <el-autocomplete class="inputWidth" v-model="ruleForm.supplierHC" :fetch-suggestions="querySearchHC" placeholder="请输入供应商" @select="handleSelectHC" @blur="blurHandHC">
              <template slot-scope="{ item }">
                <div>{{ item.valueName }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="借款类型：" prop="type" label-width="140px">
            <el-select v-model="ruleForm.type" placeholder="请选择" class="inputWidth">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="借款金额：" prop="money" label-width="140px">
            <el-input v-model="ruleForm.money" placeholder="请输入借款金额" class="inputWidthHalf" :disabled="readOnly"></el-input>
            <el-input v-model="ruleForm.number" placeholder="请输入人数" class="inputWidthHalf" :disabled="readOnly"></el-input>
          </el-form-item>
          <el-form-item label="摘要：" prop="abstract" label-width="140px">
            <el-input v-model="ruleForm.abstract" class="inputWidth" placeholder="请输入摘要信息"></el-input>
          </el-form-item>
          <el-form-item label="附件：" label-width="140px" required>
            <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div>
          <el-divider content-position="left">相关信息</el-divider>
          <div class="timeDv">
            <el-button @click="addMsg()" type="primary">添加</el-button>
          </div>
          <el-table ref="singleTable" v-loading="loading" :data="tableDataChoose" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass" maxHeight="700">
            <el-table-column prop="order_sn" label="订单编号" align="center">
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称" align="center">
            </el-table-column>
            <el-table-column prop="contact_name" label="订单联系人" align="center">
            </el-table-column>
            <el-table-column prop="check_at" label="验证时间" align="center">
            </el-table-column>
            <el-table-column prop="quantity" label="人数" align="center">
            </el-table-column>
            <el-table-column prop="cost" label="成本" align="center">
            </el-table-column>
            <el-table-column prop="income" label="订单金额" align="center">
            </el-table-column>
            <el-table-column prop="reimbursed_money" label="已报销金额" align="center">
              <template>
                <span>0.00</span>
              </template>
            </el-table-column>
            <el-table-column prop="reimbursed_money" label="已报销金额" align="center">
              <template slot-scope="scope">
                <el-button @click="deleteBtn(scope)" type="text" class="table_details">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <!-- 选择相关订单 -->
      <el-dialog title="选择相关订单" :visible="dialogFormVisible2" width=80% @close="closeFun2" append-to-body id="chooseDD">
        <div class="timeDv">
          <span>验证时间：</span>
          <el-date-picker v-model="ruleForm.timeStart" type="date" placeholder="开始日期" :picker-options="startDatePicker"></el-date-picker>
          <span>--</span>
          <el-date-picker v-model="ruleForm.timeEnd" type="date" placeholder="结束日期" :picker-options="endDatePicker"></el-date-picker>
          <span>产品名称：</span>
          <el-input v-model="ruleForm.productName" placeholder="请输入"></el-input>
          <el-button @click="loadRelatedData()" type="primary" class="rightBtn">搜索</el-button>
          <el-button @click="emptyButtonInside()" type="primary" plain class="rightBtn">重置</el-button>
        </div>
        <el-table ref="singleTable" v-loading="loading" :data="tableDataXG" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass" maxHeight="700" @selection-change="selectionChange">
          <el-table-column prop="id" label="" fixed type="selection" :selectable="selectInit">
          </el-table-column>
          <el-table-column prop="order_sn" label="订单编号" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="contact_name" label="订单联系人" align="center">
          </el-table-column>
          <el-table-column prop="check_at" label="验证时间" align="center">
          </el-table-column>
          <el-table-column prop="quantity" label="人数" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="成本" align="center">
          </el-table-column>
          <el-table-column prop="income" label="订单金额" align="center">
          </el-table-column>
          <el-table-column prop="reimbursed_money" label="已报销金额" align="center">
            <template>
              <span>0.00</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="footer" style="text-align: right;">
          <el-button class="el-button" type="warning" @click="closeFun2">取 消</el-button>
          <el-button class="el-button" type="primary" @click="saveBtn">确 认</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  import { storageLocal } from '@/js/libs/storage'
  export default {
    name: "newTour",
    components: {},
    props: {
      dialogFormVisible: false,
      type: ''
    },
    data() {
      return {
        readOnly: true,
        loading: false,
//        rece_code: '',
        ruleForm: {
          type: '',
          payNumber: '',
          payName: '',
          payAccount: '',
          payAccountID: '',
          money: '',
          abstract: '',
          supplier: '',// 选择的供应商
          supplierName: '',
          supplierID: '',
          supplierHC: '',
          supplierNameHC: '',
          supplierIDHC: '',
          number: '',
          buy_type: '',
          timeStart: '',
          timeEnd: '',
          productName: ''
        },

        postForm: {
          timeStart: '',
          timeEnd: '',
          productName: ''
        },

        typeList: [
          {
            value: 1,
            label: '门票'
          },
          {
            value: 2,
            label: '酒店'
          },
          {
            value: 3,
            label: '地接'
          },
          {
            value: 4,
            label: '定制游(跟团游)'
          }
        ],

        supplierList: [],// 供应商列表
        rules: {
          supplier: [{ required: true, message: '供应商不能为空!', trigger: 'change' }],
          type: [{ required: true, message: '类型不能为空!', trigger: 'change' }],
          money: [{ required: true, message: '借款金额不能为空!', trigger: 'blur' }],
          abstract: [{ required: true, message: '摘要不能为空!', trigger: 'blur' }],
          payAccount: [{ required: true, message: '收款账户不能为空!', trigger: 'change' }]
        },

        fileList: [],

        tableDataXG: [],
        dialogFormVisible2: false,
        multipleSelection: [],
        tableDataChoose: [],

        // 时间限制
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate()
      }
    },
    computed: {
      // 计算属性的 getter
      headers(){
        return {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    },
    watch: {
      dialogFormVisible: {
        handler: function () {
          if(this.dialogFormVisible){
            // this.loadSupplier();
            this.tableDataChoose = [];
            if(storageLocal.get("supplier")){
              this.supplierList = storageLocal.get("supplier");
            }else{
              this.loadSupplier();
            }
            //            this.getCode();
            //            alert(this.type);
          }
        }
      }
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
      // 关闭弹框
      closeAdd() {
        this.ruleForm = {
          type: '',
          payNumber: '',
          payName: '',
          payAccount: '',
          payAccountID: '',
          money: '',
          abstract: '',
          supplier: '',// 选择的供应商
          supplierName: '',
          supplierID: '',// 选择的供应商ID
          supplierHC: '',
          supplierNameHC: '',
          supplierIDHC: '',
          number: '',
          buy_type: '',
          timeStart: '',
          timeEnd: ''
        };
        this.postForm = {
          timeStart: '',
          timeEnd: '',
          productName: ''
        },
        this.fileList = [];
        this.tableDataXG = [];
        this.$emit('close', false);
      },
      // 取消按钮事件
      cancalBtn(){
        if(this.ruleForm.collectionTime != '' || this.ruleForm.explain != '' || this.ruleForm.payAccount != '' || this.ruleForm.money != '' || this.ruleForm.abstract != '' || this.fileList.length != 0){
          this.$confirm("是否取消本次添加?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$message.success("已取消添加");
            this.closeAdd();
          }).catch(() => {

          });
        }else{
          this.closeAdd();
        }
      },
      // 提交事件
      submitForm(formName) {
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let fileArr = [];
            console.log(that.fileList);
            if(that.fileList.length != 0){
              that.fileList.forEach(function (item, index, arr) {
                fileArr.push({
                  name: item.name,
                  url: item.response.data.url
                });
              })
            }else{
              fileArr = [];
            }
            if(that.ruleForm.money == 0){
              that.$message({
                type: 'warning',
                message: '借款金额需大于零'
              });
              return;
            }
            if(that.ruleForm.number == 0){
              that.$message({
                type: 'warning',
                message: '人数需大于零'
              });
              return;
            }
//            this.ruleForm.supplierID = 6;
//            this.ruleForm.supplierName = 3;
            let ids = '';
            if(this.tableDataChoose.length == 0){

            }else{
              this.tableDataChoose.forEach(function(item, index, arr){
                ids += item.id + ','
              })
              ids = ids.substring(0, ids.length - 1)
            }
            this.getCode().then(code => {
              if(code !== ''){
                this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/loan/periphery-loan/add', {
                  "supplier_code": this.ruleForm.supplierID,
                  "recoil_supplier_code": this.ruleForm.supplierIDHC,
                  "supplier_name": this.ruleForm.supplierNameHC,
                  // "supplier_name": this.ruleForm.supplierName,
                  "periphery_type": 3,
                  "loan_type": this.ruleForm.type,
                  "loan_money": this.ruleForm.money,
                  "mark": this.ruleForm.abstract,
                  "remittance_account": this.ruleForm.payNumber,
                  "account_name": this.ruleForm.payName,
                  "opening_bank": this.ruleForm.payAccount,
                  "number": this.ruleForm.number,
                  "file": fileArr,
                  "create_uid": sessionStorage.getItem('id'),
                  "org_id": sessionStorage.getItem('orgID'),
                  "buy_type": 1,
                  "rece_code": code,
                  "time_start": this.ruleForm.timeStart,
                  "time_end": this.ruleForm.timeEnd,
                  "oracle_supplier_code": this.supplierCode,
                  "product_name": this.ruleForm.productName,
                  "order_ids": ids
                }).then(res => {
                  console.log(res);
                  if (res.data.code == 200) {
                    that.$message({
                      type: 'success',
                      message: '创建成功!'
                    });
                    that.startWork(res.data.data);

                  } else {
                    if(res.data.message){
                      that.$message({
                        type: 'warning',
                        message: res.data.message
                      });
                    }else{
                      that.$message({
                        type: 'warning',
                        message: '创建失败'
                      });
                    }
                  }
                }).catch(err => {
                  console.log(err)
                })
              }
            });


          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 上传凭证function
      UploadUrl(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
      },
      handleSuccess(response, file, fileList){
        //        console.log(file);
        //        console.log(fileList);
        //        console.log('response',response);
        if(response.code == 200){
          this.fileList = fileList;
        }else{
          if(response.message){
            this.$message.warning(response.message);
          }else{
            this.$message.warning('文件上传失败');
          }
          //          this.fileList = fileList;
          //          console.log(fileList);
          //          this.fileList = fileList.splice(-1, 1);
          //          for(let i = 0; i < fileList.length; i++){
          //            console.log(i);
          //          }

          //          console.log(this.fileList);
          //          this.fileList = {};
          //          this.$refs.upload1.clearFiles();
        }
      },
      handleError(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = fileList;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },


      // 供应商选择
      querySearchD(queryString, cb){
        const supplierList = this.supplierList;
        var results = queryString ? supplierList.filter(this.createFilter1(queryString)) : supplierList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter1(queryString) {
        return (supplierList) => {
          return (supplierList.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelectD(item){
        // console.log(item);
        this.ruleForm.supplierID = item.id;
        this.getSupplierCode(item.id);
        this.ruleForm.supplier = item.valueName;
        let nameArr = item.value.split(',');
        let nameStr = '';
        nameArr.forEach(function (item, index, arr) {
          if(index > 0){
            nameStr += item + ',';
          }
        });
        if(nameStr.substr(nameStr.length-1,1) === ','){
          nameStr = nameStr.substr(0, nameStr.length - 1);
        }
//        const name = 2;
        this.ruleForm.supplierName = nameStr;
        // this.loadRelatedData();
      },
      blurHand(){
        const that = this;
        let ida = '', namea = '';
        if(that.ruleForm.supplier == ''){
          that.ruleForm.supplierID = '';
          // that.tableDataXG = [];
        }else{
          this.supplierList.forEach(function (item, index, arr) {
            if(that.ruleForm.supplier == item.value){
              ida = item.id;
              namea = item.value;
              that.ruleForm.supplier = item.valueName;
            }
          });
          if(ida){
            that.ruleForm.supplierID = ida;
            that.getSupplierCode(ida);
            let nameArr = namea.split(',');
            let nameStr = '';
            nameArr.forEach(function (item, index, arr) {
              if(index > 0){
                nameStr += item + ',';
              }
            });
            if(nameStr.substr(nameStr.length-1,1) === ','){
              nameStr = nameStr.substr(0, nameStr.length - 1);
            }
            that.ruleForm.supplierName = nameStr;
            // this.loadRelatedData();
          }else{
            that.ruleForm.dsupplierID = '';
            // that.tableDataXG = [];
          }
        }
      },

      querySearchHC(queryString, cb){
        const supplierList = this.supplierList;
        var results = queryString ? supplierList.filter(this.createFilterHC(queryString)) : supplierList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilterHC(queryString) {
        return (supplierList) => {
          return (supplierList.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelectHC(item){
        console.log(item);
        this.ruleForm.supplierIDHC = item.id;
        // this.getSupplierCode(item.id);
        this.ruleForm.supplierHC = item.valueName;
        let nameArr = item.value.split(',');
        let nameStr = '';
        nameArr.forEach(function (item, index, arr) {
          if(index > 0){
            nameStr += item + ',';
          }
        });
        if(nameStr.substr(nameStr.length-1,1) === ','){
          nameStr = nameStr.substr(0, nameStr.length - 1);
        }
        this.ruleForm.supplierNameHC = nameStr;
        this.loadRelatedData();
      },
      blurHandHC(){
        const that = this;
        let ida = '', namea = '';
        if(that.ruleForm.supplierHC == ''){
          that.ruleForm.supplierIDHC = '';
          that.tableDataXG = [];
        }else{
          this.supplierList.forEach(function (item, index, arr) {
            if(that.ruleForm.supplierHC == item.value){
              ida = item.id;
              namea = item.value;
              that.ruleForm.supplierHC = item.valueName;
            }
          });
          if(ida){
            that.ruleForm.supplierIDHC = ida;
            // that.getSupplierCode(ida);
            let nameArr = namea.split(',');
            let nameStr = '';
            nameArr.forEach(function (item, index, arr) {
              if(index > 0){
                nameStr += item + ',';
              }
            });
            if(nameStr.substr(nameStr.length-1,1) === ','){
              nameStr = nameStr.substr(0, nameStr.length - 1);
            }
            that.ruleForm.supplierNameHC = nameStr;
            // this.loadRelatedData();
          }else{
            that.ruleForm.supplierIDHC = '';
            that.tableDataXG = [];
          }
        }
      },

      // 加载供应商编码
      getSupplierCode(id){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcZb + "/universal/supplier/api/supplierget",{
          id: id
        }).then(function(obj) {
          console.log('获取供应商编码',obj);
          if(obj.data.isSuccess){

            if(obj.data.object.supplierCode && obj.data.object.supplierCode != '-1'){
              that.supplierCode = obj.data.object.supplierCode;
            }else{
              that.$message.warning("获取供应商编码失败~");
            }
          }else{
            that.$message.warning("获取供应商编码失败~");
          }
        }).catch(function(obj) {
          console.log(obj);
          that.$message.warning("供应商编码接口请求失败~");
        });
      },

      // 加载供应商信息
      loadSupplier(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcZb + "/alias/supplier/api/all").then(function(obj) {
          console.log('获取供应商',obj);
          if(obj.data.isSuccess){
            let supplierObj = [];
            obj.data.objects.forEach(function (item, index, arr) {
              const valName = item.allName.split(',')[0];
              const supplier = {
                'value' : item.allName,
                'id' : item.id,
                'valueName': valName
              };
              supplierObj.push(supplier);
            });
            that.supplierList = supplierObj;
            // const dataSup = JSON.stringfy(supplierObj);
            storageLocal.set("supplier", supplierObj, '5m');
          }
        }).catch(function(obj) {
          console.log(obj);
        });
      },

      //相关信息
      addMsg(){
        this.dialogFormVisible2 = true;
        this.loadRelatedData();
      },
      closeFun2(){
        this.dialogFormVisible2 = false;
      },
      // 加载相关信息
      loadRelatedData(){
        const that = this;
        this.loading = true;
        this.postForm = {
          timeStart: this.ruleForm.timeStart,
          timeEnd: this.ruleForm.timeEnd,
          productName: this.ruleForm.productName
        },
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/getorder", {
          "supplier_name": this.ruleForm.supplierNameHC,
          "buy_type": 1,
          "time_start": this.ruleForm.timeStart,
          "time_end": this.ruleForm.timeEnd,
          "product_name": this.ruleForm.productName
        }).then(function(res) {
          console.log('获取相关信息',res);
          if(res.data.code == 200){
            that.tableDataXG = res.data.data.list;
            // let totalMoney = 0, totalNum = 0;

            that.tableDataXG.forEach(function (item, index, arr) {
              item.check_at = formatDate(new Date(item.check_at * 1000));
              // totalMoney += parseFloat(item.cost);
              // totalNum += parseInt(item.quantity);
            });

            // that.ruleForm.money = totalMoney.toFixed(2);
            // that.ruleForm.number = totalNum;
            that.loading = false;
          }else{
            that.loading = false;
            that.tableDataXG = [];
            that.totalMoney = 0;
            that.totalNum = 0;
          }
        }).catch(function(obj) {
          that.loading = false;
          console.log(obj);
        });
      },

      // 加载相关信息--重置
      emptyButtonInside(){
        const that = this;
        this.ruleForm.timeStart = '';
        this.ruleForm.timeEnd = '';
        // this.$set(this.ruleForm.productName, '');
        this.$set(that.ruleForm, 'productName', '');
        this.loadRelatedData();
      },
      selectInit(row, index){
        if(row.order_sn){
          let flagItem = true;
          this.tableDataChoose.forEach(function(item, index, arr){
            if(row.order_sn == item.order_sn){
              flagItem = false;
            }
          })
          // console.log(flagItem);
          return flagItem;
        }
      },
      // 所选项改变触发
      selectionChange(val){
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      saveBtn(){
        this.tableDataChoose = this.tableDataChoose.concat(this.multipleSelection);
        let totalMoney = 0, totalNum = 0;
        this.tableDataChoose.forEach(function (item, index, arr) {
          totalMoney += parseFloat(item.cost);
          totalNum += parseInt(item.quantity);
        });

        this.ruleForm.money = totalMoney.toFixed(2);
        this.ruleForm.number = totalNum;
        this.closeFun2();
      },
      deleteBtn(scope){
        this.tableDataChoose.splice(scope.$index, 1);
        let totalMoney = 0, totalNum = 0;
        this.tableDataChoose.forEach(function (item, index, arr) {
          totalMoney += parseFloat(item.cost);
          totalNum += parseInt(item.quantity);
        });

        this.ruleForm.money = totalMoney.toFixed(2);
        this.ruleForm.number = totalNum;
      },

      // 开始工作流
      startWork(obj){
//        alert('执行工作流function！');
        const that = this;
        this.$http.post(this.GLOBAL.jqUrlZB + '/ZB/StartUpWorkFlowForZB_V2', {
          "jQ_ID": obj.id,
          "jQ_Type": obj.periphery_type,
          "workflowCode": obj.workflowCode,
          "userCode": sessionStorage.getItem('tel'),
//          "userCode": "zb1",// 测试
          "finishStart": "true",
          "paramValues": [{
            "itemName": "amount",
            "itemValue": this.ruleForm.money
          }, {
            "itemName": "supplierName",
            "itemValue": this.ruleForm.supplierName
          }, {
            "itemName": "loanId",
            "itemValue": obj.id
          }, {
            "itemName": "accountType",
            "itemValue": this.ruleForm.account_type
          }]
        }).then(res => {
//          console.log('工作流',res);
          let result = JSON.parse(res.data);
          if (result.code == '0') {
            console.log('启动工作流成功');
            that.closeAdd();
          } else {
            console.log('启动工作流错误!');
            if(result.msg){
              that.$message.warning(result.msg);
            }else{
              that.$message.warning('启动工作流错误!');
            }
            that.cancalLoan(obj.id);
            console.log(res.data);
          }
        }).catch(err => {
          that.cancalLoan(obj.id);
          that.$message.warning('启动工作流错误!');
          console.log(err);
        })
      },

      // 时间限制（开始时间小于结束时间）
      beginDate(){
//      alert(begin);
        const that = this;
        return {
          disabledDate(time){
            if (that.ruleForm.timeEnd) {  //如果结束时间不为空，则小于结束时间
              return new Date(that.ruleForm.timeEnd).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate(){
//      alert(process);
        const that = this;
        return {
          disabledDate(time) {
            if (that.ruleForm.timeStart) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(that.ruleForm.timeStart).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },

      // 获取收款编码
      getCode(){
        const that = this;
        return this.$http.post(this.GLOBAL.serverSrcZb + "/ong/api/receivable/get", {},
          {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }).then(function(obj) {
          console.log(obj);
          if(obj.data.isSuccess){
            return obj.data.object;
          }else{
            if(obj.data.result.message){
              that.$message.warning(obj.data.result.message);
            }else{
              that.$message.warning("获取收款编码失败~");
            }
            return '';
          }
        }).catch(function(obj) {
          that.$message.warning("获取收款编码失败~");
          console.log(obj);
          return '';
        });
      },

      // 启动工作流失败，需要撤销此借款
      cancalLoan(id){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/cancleloan", {
          "id": id
        }, ).then(function(response) {
//            console.log('借款撤销操作',response);
          if (response.data.code == '200') {
//            that.$message.success("撤销成功~");
//            that.endWorking();
//            that.closeAdd();
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("撤销失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #applyFor .buttonDv {
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #applyFor .inputWidth {
    min-width: 400px;
    width: 60%;
  }
  #applyFor .inputWidthHalf{
    min-width: 200px;
    width: 28.5%;
    margin-right: 2%;
  }
  #applyFor .inputWidthS{
    width: 19%;
    margin-right: 10px;
  }
  #applyFor .el-upload-list__item{
    margin-top: 10px;
  }
  #applyFor .el-divider__text, #applyFor .el-link{
    font-size: 16px;
  }

  #applyFor .timeDv{
    width: 98%;
    padding: 10px;
    margin: 10px auto;
    background-color: #f7f7f7;
  }
  #chooseDD .timeDv{
    width: 98%;
    padding: 10px;
    margin: 10px auto;
    background-color: #f7f7f7;
    .el-input{
      width: 220px;
    }
    .rightBtn{
      float: right;
      margin-right: 10px;
    }
  }

</style>
