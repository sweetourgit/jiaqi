<template>
  <div class="vivo" style="position:relative" id="collection_add">
    <!--申请预付款-->
    <el-dialog title="批量添加待认款收款" :visible="dialogFormVisible2" style="margin:-80px 0 0 0;" custom-class="city_list" :show-close="false" width="70%" @close="closeAdd">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv">
          <el-button class="el-button" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
        </div>
        <div>
          <!--<p class="stepTitle">基本信息</p>-->
          <el-divider content-position="left">基本信息</el-divider>
          <div class="stepDv">
            <el-form-item label="收款明细说明：" prop="explain" label-width="140px">
              <el-input v-model="ruleForm.explain" class="inputWidth" placeholder="请输入款项说明"></el-input>
            </el-form-item>
            <el-form-item label="收款账户：" prop="payAccount" label-width="140px">
              <el-input v-model="ruleForm.payAccount" placeholder="请选择" class="inputWidth" :readonly="readOnly"></el-input>
              <el-button type="primary" @click="chooseFun" style="margin-left: 10px">选择</el-button>
            </el-form-item>
            <el-form-item label="批量导入：" label-width="140px" required>
              <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :headers="headers" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </div>
          <!--<p class="stepTitle">认款订单</p>-->
          <el-divider content-position="left">认款订单</el-divider>
          <div class="stepDv">
            <el-table ref="singleTable" :data="tableDataDD" border style="width: 96%;margin: 0 auto;" height="700" :header-cell-style="getRowClass">
              <el-table-column prop="receivables_at" label="收款时间" align="center" >
              </el-table-column>
              <el-table-column prop="rece_money" label="收款金额" align="center">
              </el-table-column>
              <el-table-column prop="option" label="操作" align="center">
                <template slot-scope="scope">
                  <p v-if="scope.row.key == '已删除'">已删除</p>
                  <el-button class="el-button" type="text" @click="deleteFun(scope)" v-else>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "collection_add",
    components: {},
    props: {
      dialogFormVisible2: false,
      info: ''
    },
    data() {
      return {
        readOnly: true,
        ruleForm: {
          explain: '',
          payAccount: '',
          payAccountID: '',
        },
        payAccountObj: {},
        rece_code: [],
        rules: {
          explain: [{ required: true, message: '款项说明不能为空!', trigger: 'blur' }],
          payAccount: [{ required: true, message: '收款账户不能为空!', trigger: 'change' }],
        },

        dialogFormVisible1: false,
        tableDataDD: [],
        deleteStr: '',

        fileList: [],
        tableDataZH: []
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
      dialogFormVisible2: {
        handler: function () {
          if(this.dialogFormVisible2){
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
      // 关闭当前弹窗
      closeAdd() {
        this.ruleForm = {
          explain: '',
          payAccount: '',
          payAccountID: '',
        };
        this.payAccountObj = {};
        this.rece_code = '';
        this.fileList = [];
        this.tableDataDD = [];
        this.deleteStr = '';
        this.$emit('close', false);
      },
      // 取消按钮事件
      cancalBtn(){
        if(this.ruleForm.explain != '' || this.ruleForm.payAccount != '' || this.fileList.length != 0){
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
      // 删除认款订单明细
      deleteFun(scope){
//        console.log(scope);
        const that = this;
        this.$confirm("是否删除此收款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const deleteArr = that.deleteStr.split(",");
          // 剩下最后一个时提示，但是根据,切分时最后会产生一个空元素，所以判断长度相等时提示
          if(deleteArr.length === that.tableDataDD.length){
            this.$confirm("删除此收款最后一项，批量导入文件将被删除", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.fileList = [];
              this.tableDataDD = [];
              this.deleteStr = '';
            }).catch(() => {

            });
          }else{

            if(that.deleteStr.substr(that.deleteStr.length-1,1) === ',' || that.deleteStr === ''){
              that.deleteStr += scope.row.key + ',';
            }else{
              that.deleteStr += ',' + scope.row.key + ',';
            }
            that.$set(that.tableDataDD[scope.$index],'key','已删除');
          }

        }).catch(() => {

        });

      },
      // 提交事件（加载收款编码code）
      submitForm(formName) {
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let code_arr = [];
            let codeNum = 0;
            if(that.tableDataDD.length != 0){
              that.tableDataDD.forEach(function (item, index, arr) {
                if(item.key !== '已删除'){
                  codeNum++;
                  that.getCode().then(res => {
//                  console.log(res);
                    if(res){
                      code_arr.push(res);
                      that.canSubmit(code_arr, codeNum);
                    }
                  });
                }
              });
            }else{
              that.$message({
                type: 'warning',
                message: '认款订单不能为空'
              });
              return;
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 提交
      canSubmit(arr, num){
        const that = this;
        if(arr.length === num){
          // 收款编码排序
          arr.sort(function(a,b){
            return a - b
          });
          console.log(arr);
          that.rece_code = arr;
          let fileArr = [];
//          console.log(that.fileList);
          if(that.fileList.length != 0){
            that.fileList.forEach(function (item, index, arr) {
              fileArr.push({
                name: item.name,
                url: item.response.data.file_url
              });
            })
          }else{
//            fileArr = [];
            that.$message({
              type: 'warning',
              message: '批量导入文件不能为空'
            });
            return;
          }
          if(that.deleteStr.substr(that.deleteStr.length-1,1) === ','){
            that.deleteStr = that.deleteStr.substr(0, that.deleteStr.length - 1);
          }

          let data;
          if(that.deleteStr == ''){
            data = {
              "rece_code": that.rece_code,
              "explain": that.ruleForm.explain,
              "account_id": that.ruleForm.payAccountID,
              "file": fileArr,
              "create_uid": sessionStorage.getItem('id'),
              "org_id": sessionStorage.getItem('orgID'),
              "rec_account": this.payAccountObj
            }
          }else{
            data = {
              "rece_code": that.rece_code,
              "explain": that.ruleForm.explain,
              "account_id": that.ruleForm.payAccountID,
              "file": fileArr,
              "del_rec": that.deleteStr,
              "create_uid": sessionStorage.getItem('id'),
              "org_id": sessionStorage.getItem('orgID'),
              "rec_account": this.payAccountObj
            }
          }
          this.$http.post(this.GLOBAL.serverSrcPhp + '/api/v1/predeposit/predeposit/batchaddrec', data).then(res => {
            if (res.data.code == 200) {
              that.$message({
                type: 'success',
                message: '创建成功!'
              });
              that.closeAdd();
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
      },
      // 选择账户function
      chooseFun(){
        const that = this;
        this.dialogFormVisible1 = true;
        this.$http.post(
          this.GLOBAL.serverSrcZb + "/finance/collectionaccount/api/list",
          {
            "object": {
              "isDeleted": 0,
              'orgID': sessionStorage.getItem('topID')
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
      // 上传凭证function
      UploadUrl(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/predeposit/predeposit/files';
      },
      handleSuccess(response, file, fileList){
//        console.log(file);
//        console.log(fileList);
//        console.log('response',response);
        if(response.code == 200){
          this.fileList = fileList;
          this.tableDataDD = response.data.list;
          this.tableDataDD.forEach(function (item, index, arr) {
            item.receivables_at = formatDate(new Date(item.receivables_at*1000)).split(" ")[0];
          })
        }else{
          if(response.message){
            this.$message.warning(response.message);
          }else{
            this.$message.warning('文件上传失败');
          }
//          this.fileList = {};
          this.$refs.upload1.clearFiles();
        }
      },
      handleError(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = [];
        this.tableDataDD = [];
        this.deleteStr = '';
      },
      handleExceed(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
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
//          console.log(obj);
          if(obj.data.isSuccess){
            return obj.data.object;
          }else{
            that.$message.warning("获取收款编码失败~");
            return false;
          }
        }).catch(function(obj) {
          that.$message.warning("获取收款编码失败~");
          return false;
          console.log(obj);
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
  #collection_add .buttonDv {
    position: absolute;
    top: 8px;
    right: 3%;
  }
  #collection_add .inputWidth {
    min-width: 400px;
    width: 60%;
  }
  #collection_add .el-upload-list__item {
    margin-top: 10px;
  }
  #collection_add .stepDv{
    background-color: #f7f7f7;
    margin-bottom: 50px;
    padding: 20px;
  }

</style>
