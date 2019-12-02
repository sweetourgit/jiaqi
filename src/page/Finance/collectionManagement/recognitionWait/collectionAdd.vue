<template>
  <div class="vivo" style="position:relative" id="collection_add">
    <!--申请预付款-->
    <el-dialog title="添加待认款收款" :visible="dialogFormVisible" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="70%" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv">
          <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
        </div>
        <div>
          <el-form-item label="收款时间：" prop="collectionTime" label-width="140px">
            <el-date-picker v-model="ruleForm.collectionTime" type="date" class="inputWidth" placeholder="收款时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="款项说明：" prop="explain" label-width="140px">
            <el-input v-model="ruleForm.explain" class="inputWidth" placeholder="请输入款项说明"></el-input>
          </el-form-item>
          <el-form-item label="收款账户：" prop="payAccount" label-width="140px">
            <el-input v-model="ruleForm.payAccount" placeholder="请选择" class="inputWidth" :readonly="readOnly"></el-input>
            <el-button type="primary" @click="chooseFun" style="margin-left: 10px">选择</el-button>
          </el-form-item>
          <el-form-item label="收款金额：" prop="money" label-width="140px">
            <el-input v-model="ruleForm.money" class="inputWidth" placeholder="请输入收款金额"></el-input>
          </el-form-item>
          <el-form-item label="摘要：" prop="abstract" label-width="140px">
            <el-input v-model="ruleForm.abstract" class="inputWidth" placeholder="请输入摘要"></el-input>
          </el-form-item>
          <el-form-item label="凭证：" label-width="140px">
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
            <el-table-column prop="cardType" label="类型" align="center" >
            </el-table-column>
            <el-table-column prop="title" label="账号名称" align="center">
            </el-table-column>
            <el-table-column prop="cardNum" label="卡号" align="center" width="70%">
            </el-table-column>
            <el-table-column prop="openingBank" label="开户行" align="center">
            </el-table-column>
            <el-table-column prop="openingName" label="开户人" align="center">
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
      dialogFormVisible: false,
      info: ''
    },
    data() {
      return {
        readOnly: true,
        ruleForm: {
          collectionTime: '',
          explain: '业务待认款',
          payAccount: '',
          payAccountID: '',
          money: '',
          abstract: ''
        },
        payAccountObj: {},
        rece_code: '',
        rules: {
          explain: [{ required: true, message: '款项说明不能为空!', trigger: 'blur' }],
          money: [{ required: true, message: '收款金额不能为空!', trigger: 'blur' }],
          abstract: [{ required: true, message: '摘要不能为空!', trigger: 'blur' }],
          payAccount: [{ required: true, message: '收款账户不能为空!', trigger: 'change' }],
          collectionTime: [{ required: true, message: '收款时间不能为空!', trigger: 'change' }],
        },

        dialogFormVisible1: false,
        tableDataZH: [],

        fileList: []
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
            this.getCode()
          }
        }
      }
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
      closeAdd() {
        this.ruleForm = {
          collectionTime: '',
          explain: '',
          payAccount: '',
          payAccountID: '',
          money: '',
          abstract: ''
        };
        this.payAccountObj = {};
        this.rece_code = '';
        this.fileList = [];
        this.$emit('close', false);
      },
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
            console.log(fileArr);
            this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/predeposit/predeposit/addpredeposit', {
              "rece_code": that.rece_code,
              "receivables_at": that.ruleForm.collectionTime,
              "explain": that.ruleForm.explain,
              "account_id": that.ruleForm.payAccountID,
              "rece_money": that.ruleForm.money,
              "remark": that.ruleForm.abstract,
              "file": fileArr,
              "create_uid": sessionStorage.getItem('id'),
              "org_id": sessionStorage.getItem('orgID'),
              "rec_account": this.payAccountObj
            }).then(res => {
              console.log(res.data);
              if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                that.closeAdd();
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
//      选择账户function
      chooseFun(){
        const that = this;
        this.dialogFormVisible1 = true;
        this.$http.post(
          this.GLOBAL.serverSrcZb + "/finance/collectionaccount/api/list",
          {
            "object": {
              "isDeleted": 0
            },
          },)
          .then(function (obj) {
            console.log(obj);
            if(obj.data.isSuccess){
              that.tableDataZH = obj.data.objects;
            }else{
              that.$message.warning("加载账户信息失败");
            }
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      close(){
        this.dialogFormVisible1 = false;
      },
      chooseBtn(row){
        this.ruleForm.payAccount = row.title;
        this.ruleForm.payAccountID = row.id;
        this.payAccountObj = {
          "account_id": row.id,
          "type": row.cardType,
          "account": row.title,
          "card": row.cardNum,
          "bank": row.openingBank,
          "user": row.openingName,
          "subject_value": row.subject,
          "service_charge": row.ratio
        };
        this.close();
      },
//      上传凭证function
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
//      获取收款编码
      getCode(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcZb + "/ong/api/receivable/get", {},
          {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }).then(function(obj) {
          console.log(obj);
          if(obj.data.isSuccess){
            that.rece_code = obj.data.object;
          }else{
            that.$message.warning("获取收款编码失败~");
          }
        }).catch(function(obj) {
          that.$message.warning("获取收款编码失败~");
          console.log(obj)
        });
      },
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #collection_add .inputWidth {
    min-width: 400px;
    width: 60%;
  }
  #collection_add .el-upload-list__item{
    margin-top: 10px;
  }
  #collection_add .el-divider__text, #collection_add .el-link{
    font-size: 16px;
  }

</style>
