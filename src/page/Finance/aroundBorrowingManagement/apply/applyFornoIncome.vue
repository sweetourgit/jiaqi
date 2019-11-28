<template>
  <div class="vivo" style="position:relative" id="applyFor">
    <!--申请预付款-->
    <el-dialog title="无收入借款申请" :visible="dialogFormVisible" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="70%" @close="closeAdd">
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
          <el-form-item label="借款类型：" prop="type" label-width="140px">
            <el-select v-model="ruleForm.type" placeholder="请选择" class="inputWidth">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="借款金额：" prop="money" label-width="140px">
            <el-input v-model="ruleForm.money" placeholder="请输入借款金额" class="inputWidth"></el-input>
          </el-form-item>
          <el-form-item label="摘要：" prop="abstract" label-width="140px">
            <el-input v-model="ruleForm.abstract" class="inputWidth" placeholder="请输入摘要信息"></el-input>
          </el-form-item>
          <el-form-item label="汇款账户：" prop="payAccount" label-width="140px">
            <el-input v-model="ruleForm.payNumber" class="inputWidthS" placeholder="汇款账号"></el-input>
            <el-input v-model="ruleForm.payName" class="inputWidthS" placeholder="开户人姓名"></el-input>
            <el-input v-model="ruleForm.payAccount" class="inputWidthS" placeholder="开户行"></el-input>
            <el-button type="primary" @click="chooseFun" style="margin-left: 10px">选择</el-button>
          </el-form-item>
          <el-form-item label="对公/对私：" prop="account_type" label-width="140px">
            <el-radio-group v-model="ruleForm.account_type">
              <el-radio label="1">对公</el-radio>
              <el-radio label="2">对私</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="附件：" label-width="140px" required>
            <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <!--选择收款账户-->
      <el-dialog title="选择账户" :visible="dialogFormVisible1" width=60% @close="close" append-to-body>
        <div class="table_trip" style="width: 100%;">
          <el-table ref="singleTable" :data="tableDataZH" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass">
            <el-table-column prop="cardName" label="汇款户名" align="center">
            </el-table-column>
            <el-table-column prop="cardNumber" label="账号" align="center">
            </el-table-column>
            <el-table-column prop="bankName" label="开户行" align="center">
            </el-table-column>
            <el-table-column prop="memo" label="备注" align="center">
            </el-table-column>
            <el-table-column prop="option" label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button @click="chooseBtn(scope.row)" type="danger" size="small" class="table_details">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="footer" style="text-align: right;">
          <el-button class="el-button" type="warning" @click="close">取 消</el-button>
          <!--<el-button class="el-button" type="primary" @click="">确 认</el-button>-->
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "newTour",
    components: {},
    props: {
      dialogFormVisible: false
    },
    data() {
      return {
        readOnly: true,
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
          supplierID: '',// 选择的供应商ID
          number: '',
          buy_type: '',
          account_type: ''
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
          payAccount: [{ required: true, message: '收款账户不能为空!', trigger: 'change' }],
          account_type: [{ required: true, message: '账户类别不能为空!', trigger: 'change' }]
        },

        dialogFormVisible1: false,
        tableDataZH: [],

        fileList: [],

        supplierCode: ''
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
            this.loadSupplier();
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
          number: '',
          buy_type: '',
          account_type: ''
        };
        this.fileList = [];
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
      // 提交按钮
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

//            this.ruleForm.supplierID = 6;
            this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/loan/periphery-loan/add', {
              "supplier_code": this.ruleForm.supplierID,
              "supplier_name": this.ruleForm.supplierName,
              "periphery_type": 1,
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
              "buy_type": this.ruleForm.buy_type,
              "account_type": this.ruleForm.account_type,
              "oracle_supplier_code": this.supplierCode
            }).then(res => {
              console.log(res);
              if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                that.startWork(res.data.data);

//                that.$emit('loadData');
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

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 选择账户function
      chooseFun(){
        const that = this;

        if(this.ruleForm.supplierID === ''){
          this.$message.warning("请先选择供应商~");
        }else{
          this.dialogFormVisible1 = true;
//          this.ruleForm.supplierID = 6;//暂时替代，获取全部的接口没出
          this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/supplierget", {
            "id": this.ruleForm.supplierID
          },).then(function (obj) {
            console.log(obj);
            if(obj.data.isSuccess){
              that.tableDataZH = obj.data.object.banks;
            }else{
              if(obj.data.result.message){
                that.$message.warning(obj.data.result.message);
              }else{
                that.$message.warning("加载账户信息失败");
              }
            }
          }).catch(function (obj) {
            console.log(obj)
          })
        }

      },
      close(){
        this.dialogFormVisible1 = false;
      },
      chooseBtn(row){
        this.ruleForm.payNumber = row.cardNumber;
        this.ruleForm.payName = row.cardName;
        this.ruleForm.payAccount = row.bankName;
        this.ruleForm.payAccountID = row.id;
        this.close();
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
        let supplierList = this.supplierList;
        let results = queryString ? supplierList.filter(this.createFilter1(queryString)) : supplierList;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter1(queryString) {
        return (supplierList) => {
          return (supplierList.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelectD(item){
        console.log(item);
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
      },
      blurHand(){
        const that = this;
        let ida = '';
        if(that.ruleForm.supplier == ''){
          that.ruleForm.supplierID = '';
        }else{
          this.supplierList.forEach(function (item, index, arr) {
            if(that.ruleForm.supplier == item.value){
              ida = item.id;
              that.ruleForm.supplier = item.valueName;
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
              this.ruleForm.supplierName = nameStr;
            }
          });
          if(ida){
            that.ruleForm.supplierID = ida;
            this.getSupplierCode(ida);
          }else{
            that.ruleForm.dsupplierID = '';
          }
        }
      },

      // 加载供应商的
      getSupplierCode(id){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/supplierget",{
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
        this.$http.post(this.GLOBAL.serverSrc + "/alias/supplier/api/all").then(function(obj) {
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
          }
        }).catch(function(obj) {
          console.log(obj);
        });
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
          console.log('工作流',res);
          let result = JSON.parse(res.data);
//          let result = res.data;
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

      // 工作流启动失败，需要撤销此借款
      cancalLoan(id){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/loan/periphery-loan/cancleloan", {
          "id": id
        }, ).then(function(response) {
//            console.log('借款撤销操作',response);
          if (response.data.code == '200') {
//            that.$message.success("撤销成功~");
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
  .inputWidthS{
    width: 19%;
    margin-right: 10px;
  }
  #applyFor .el-upload-list__item{
    margin-top: 10px;
  }
  #applyFor .el-divider__text, #applyFor .el-link{
    font-size: 16px;
  }

</style>
