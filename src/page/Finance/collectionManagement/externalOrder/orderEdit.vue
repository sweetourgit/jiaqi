<template>
  <div class="vivo" style="position:relative" id="tradeAdd">
    <el-dialog :visible="dialogFormVisible" @close="closeAdd" style="width: 100%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <div class="buttonDv" style="float: right;margin-right: 3%;" v-if="info == ''">
          <el-button type="primary" @click="cancelBtnTJ" style="margin-right: 10px" plain>取消</el-button>
          <el-button type="primary" @click="submitBtnTJ('ruleForm')" style="margin: 0">添加</el-button>
        </div>
        <div class="buttonDv" style="float: right;margin-right: 3%;" v-if="info != ''">
          <el-button type="primary" @click="cancelBtnXG" style="margin-right: 10px" plain>取消</el-button>
          <el-button type="primary" @click="submitBtnXG('ruleForm')" style="margin: 0">保存</el-button>
        </div>
        <p class="stepTitle">基本信息</p>
        <div class="stepDv">
          <el-form-item label="收款详细说明：" prop="mark" label-width="140px">
            <el-input v-model="ruleForm.mark" placeholder="请输入" class="baseIn" maxlength="80" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="收款时间：" prop="creditTime" label-width="140px">
            <el-date-picker v-model="ruleForm.creditTime" type="date" placeholder="请选择日期" class="start-time baseIn" :editable="disabled"></el-date-picker>
          </el-form-item>
          <el-form-item label="分销商：" prop="distributor" label-width="140px">
            <el-radio v-model="ruleForm.distributor" label="美团(团购直连)">美团(团购直连)</el-radio>
            <el-radio v-model="ruleForm.distributor" label="马蜂窝自由行">马蜂窝自由行</el-radio>
            <el-radio v-model="ruleForm.distributor" label="去哪">去哪</el-radio>
            <el-radio v-model="ruleForm.distributor" label="无">无</el-radio>
          </el-form-item>
          <el-form-item label="收款账户：" prop="payAccount" label-width="140px">
            <el-input v-model="ruleForm.payAccount" placeholder="请选择" class="baseIn" :readonly="readOnly"></el-input>
            <el-button type="primary" @click="chooseFun" style="margin-left: 10px">选择</el-button>
          </el-form-item>
          <el-form-item label="收款金额：" prop="payMoney" label-width="140px">
            <el-input v-model="ruleForm.payMoney" placeholder="请输入" class="baseIn"></el-input>
            <p style="margin: 0;color: #999;line-height: 22px;">收款金额可通过附件文档自动生成</p>
          </el-form-item>
          <el-form-item label="款项入账时间段：" prop="startTime" label-width="140px">
            <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="开始日期" class="start-time baseIn" :editable="disabled"></el-date-picker>
            <span style="display: inline-block;line-height: 32px;margin:0;">--</span>
            <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="结束日期" class="start-time baseIn" :editable="disabled"></el-date-picker>
            <p style="margin: 0;color: #999;line-height: 22px;">款项入账时间段可通过附件文档自动生成</p>
          </el-form-item>
          <el-form-item label="附件：" label-width="140px">
            <el-upload ref="upload1" class="upload-demo" :action="UploadUrl()" :on-success="handleSuccess" :on-error="handleError" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed" :limit="1" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <p class="stepTitle">收款明细</p>
        <div class="stepDv" style="margin-bottom: 50px;">
          <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTime}}--{{endTime}}</div>
          <el-table ref="singleTable" :data="tableDataQK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
            <el-table-column prop="1" label="入账时间" align="center">
            </el-table-column>
            <el-table-column prop="2" label="订单编号" align="center">
            </el-table-column>
            <el-table-column prop="3" label="客人名称" align="center">
            </el-table-column>
            <el-table-column prop="4" label="产品" align="center">
            </el-table-column>
            <el-table-column prop="5" label="结算金额" align="center">
            </el-table-column>
            <el-table-column prop="6" label="团号" align="center">
            </el-table-column>
            <el-table-column prop="7" label="粉联号" align="center">
            </el-table-column>
            <el-table-column prop="8" label="发票号" align="center">
            </el-table-column>
            <el-table-column prop="money" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="text" style="color: red;" @click="deleteBtn(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
            <el-button class="el-button" type="primary" @click="">确 认</el-button>
          </div>
        </el-dialog>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "orderEdit",
    props: {
      dialogFormVisible: false,
      info: ''
    },
    data() {
      return {
        disabled: false,
        readOnly: true,
//       基本信息
        rece_code: '',
        ruleForm: {
          creditTime: '',
          payAccount: '',
          payAccountID: '',
          mark: '',
          distributor: '无',
          payMoney: '',
          startTime: '',
          endTime: ''
        },
        rules:{
          creditTime: [{ required: true, message: '收款时间不能为空', trigger: 'blur' }],
          payAccount: [{ required: true, message: '收款账户不能为空', trigger: 'blur' }],
          mark: [{ required: true, message: '收款详细说明不能为空', trigger: 'blur' }],
          payMoney: [
            { required: true, message: '收款金额不能为空', trigger: 'blur' },
            { pattern: /^\d+(\.\d+)?$/, message: '收款金额需为正数' }
          ],
          startTime: [{ required: true, message: '款项入账时间段不能为空', trigger: 'blur' }],
          endTime: [{ required: true, message: '款项入账时间段不能为空', trigger: 'blur' }],
        },
        fileList: [],

//        收款账户选择
        dialogFormVisible1: false,
        tableDataZH: [],
        deleteStr: '',

//        收款明细
        tableDataQK: [],
        totalItem: '0',
        totalMoney: '',
        startTime: '',
        endTime: ''
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler:function(){
          console.log(this.info);
//          this.loadData();
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
//      关闭添加/编辑弹窗
      closeAdd(){
        this.$emit('close', false);
      },
//      添加
      cancelBtnTJ(){
        this.$confirm("是否取消本次添加?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message.success("已取消添加");
          this.closeAdd();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      submitBtnTJ(formName){
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
//            alert(this.totalMoney != '');
            if(this.totalMoney == '' && this.startTime == ''){
              alert("均为空");
              that.subFun();
            }else if(this.totalMoney != '' && this.startTime != ''){
              alert("均不为空");
              if(this.ruleForm.payMoney != this.totalMoney) {
                alert('金额不等');
                this.$confirm("收款金额和全部收款明细结算金额总计不符是否继续添加?", "提示", {
                  confirmButtonText: "添加",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  let start = this.ruleForm.startTime, end = this.ruleForm.endTime;
                  const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
                  if (!reg.test(start)) {
                    start = formatDate(this.ruleForm.startTime);
                  }
                  if (!reg.test(end)) {
                    end = formatDate(this.ruleForm.endTime);
                  }
                  if (start != this.startTime || end != this.endTime) {
                    this.$confirm("款项入账时间段和全部收款明细入账时间区间不符，是否继续添加?", "提示", {
                      confirmButtonText: "添加",
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      that.subFun();
                    }).catch(() => {

                    });
                  }
                }).catch(() => {

                });
              }else{
                alert('金额相等');
                let start = this.ruleForm.startTime, end = this.ruleForm.endTime;
                const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})/;
                if (!reg.test(start)) {
                  start = formatDate(this.ruleForm.startTime);
                }
                if (!reg.test(end)) {
                  end = formatDate(this.ruleForm.endTime);
                }
                if (start != this.startTime || end != this.endTime) {
                  this.$confirm("款项入账时间段和全部收款明细入账时间区间不符，是否继续添加?", "提示", {
                    confirmButtonText: "添加",
                    cancelButtonText: "取消",
                    type: "warning"
                  }).then(() => {
                    that.subFun();
                  }).catch(() => {

                  });
                }else{
                  that.subFun();
                }
              }
            }
          }
        });
      },
      subFun(){
        alert("执行");
//        console.log(this.fileList);
        let fileUrl = '';
        if(this.fileList.length != 0){
          fileUrl = this.fileList[0].response.data.file_url;
        }
        console.log(this.ruleForm.creditTime);
        console.log(this.ruleForm.startTime+"--"+this.ruleForm.endTime);
        const creditTime = formatDate(this.ruleForm.creditTime);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/addrece", {
          "rece_code": this.rece_code,
          "explain": this.ruleForm.mark,
          "receivables_at": this.ruleForm.creditTime,
          "distributor": this.ruleForm.distributor,
          "account_id": this.ruleForm.payAccountID,
          "rece_money": this.ruleForm.payMoney,
          "rece_start": this.ruleForm.startTime,
          "rece_end": this.ruleForm.endTime,
          "file": fileUrl,
          "org_id": sessionStorage.getItem('orgID'),
          "create_uid": sessionStorage.getItem('id'),
          "del_order": this.deleteStr
        }, ).then(function(response) {
          console.log(response);
          if (response.data.code == '200') {
            that.$message({
              type: 'success',
              message: '添加成功!'
            });
            that.closeAdd();
          } else {
//                that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
//      修改
      cancelBtnXG(){
        this.$confirm("是否取消本次编辑?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message.success("已取消编辑");
          this.closeAdd();
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      submitBtnXG(){

      },
//      选择收款账户
      chooseFun(){
        const that = this;
        this.dialogFormVisible1 = true;
        this.$http.post(
          this.GLOBAL.serverSrc + "/finance/collectionaccount/api/list",
          {
            "object": {
              "isDeleted": 0
            },
          },)
          .then(function (obj) {
            that.tableDataZH = obj.data.objects;
            console.log(obj)
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
        this.close();
      },
//      上传凭证
      UploadUrl(){
        return this.GLOBAL.serverSrcPhp + '/api/v1/receivables/receivables/files';
      },
      handleSuccess(response, file, fileList){
        console.log(file);
        console.log(fileList);
        if(response.code == 200){
          this.fileList = fileList;
          this.tableDataQK = file.response.data.list;
          this.totalItem = file.response.data.list.length;
          this.totalMoney = file.response.data.money;
          this.ruleForm.payMoney = file.response.data.money;
          this.startTime = formatDate(new Date(file.response.data.start*1000));
          this.endTime = formatDate(new Date(file.response.data.end*1000));
          this.ruleForm.startTime = formatDate(new Date(file.response.data.start*1000));
          this.ruleForm.endTime = formatDate(new Date(file.response.data.end*1000));
          this.tableDataQK.forEach(function (item, index, arr) {
            item[1] = formatDate(new Date(item[1]*1000));
          })
        }else{
          this.$message.warning(response.data.message);
          this.fileList = {};
//        clearFiles();
          this.$refs.upload.clearFiles();
        }
      },
      handleError(err, file, fileList){
        this.$message.warning(`文件上传失败，请重新上传！`);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.tableDataQK = [];
        this.totalItem = '';
        this.totalMoney = '';
        this.ruleForm.payMoney = '';
        this.startTime = '';
        this.endTime = '';
        this.ruleForm.startTime = '';
        this.ruleForm.endTime = '';
      },
      handleExceed(files, fileList) {
        this.$message.warning(`平台订单只支持一个附件上传！`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
//      明细删除
      deleteBtn(row){
        const that = this;
        alert(row[0]);
        this.$confirm("是否删除此明细?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/deldetails", {
            "id": row[0]
          }, ).then(function(response) {
            console.log(response);
            if (response.data.code == '200') {
              that.deleteStr += row[0] + ',';
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              that.$message.success("加载数据失败~");
            }
          }).catch(function(error) {
            console.log(error);
          });
          this.$message.success("已删除");

        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      getCode(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrc + "/ong/api/receivable/get", {},
          {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }).then(function(obj) {
          console.log(obj);
          if(obj.data.isSuccess){
            that.rece_code = obj.data.object;
          }
        }).catch(function(obj) {
          console.log(obj)
        });
      }
    },
    created() {
      this.getCode();
    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #tradeAdd .el-dialog{
    width: 90%;
  }
  #tradeAdd .el-form-item{
    /*margin: 0;*/
  }
  #tradeAdd .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #tradeAdd .stepDv{
    width: 94%;
    margin: 0 auto;
    background-color: #f7f7f7;
    padding: 10px;
    box-sizing: border-box;
    .el-radio{
      /*margin: 10px 15px;*/
      line-height: 32px;
    }
    .baseIn{
      width: 300px;
      /*vertical-align: top;*/
      /*margin: 10px auto;*/
    }
    .upload-demo{
      width: 80%;
      display: inline-block;
    }
  }
  #tradeAdd .el-upload-list__item{
    margin-top: 10px !important;
  }
  .lineTitle{
    width: 96%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
</style>
