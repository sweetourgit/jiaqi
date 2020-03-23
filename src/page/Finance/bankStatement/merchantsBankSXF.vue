<template>
  <div class="distributor-content" id="merchantsBankSXF">
    <!-- 搜索表单 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="form-content">
      <el-row type="flex" class="row-bg">
        <el-col :span="7">
          <el-form-item label="状态:" class="status-length" prop="matchType">
            <el-select v-model="ruleForm.matchType" placeholder="请选择状态">
              <el-option label="全部" value="2"></el-option>
              <el-option label="未导入" value="0"></el-option>
              <el-option label="已导入" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <!-- <el-form-item label="银行流水号:" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入交易流水号"></el-input>
          </el-form-item> -->
        </el-col>
        <el-col :span="10">
          <el-form-item label="交易日期:" prop="dateStart">
            <el-col :span="11">
              <el-form-item prop="dateStart">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="ruleForm.dateStart"
                  :picker-options="startDatePicker"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="dateEnd">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="ruleForm.dateEnd"
                  :picker-options="endDatePicker"
                  style="width: 100%;"
                ></el-date-picker>
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
      <el-button @click="importFun" type="warning" :disabled="clickable">导入财务系统</el-button>
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
        name="excelfile"
      >
        <el-button type="primary">添加招商银行流水单</el-button>
      </el-upload>
      <!-- <el-upload
        class="upload-demo"
        :action="UploadUrl2()"
        :headers="headers"
        :on-success="handleSuccess2"
        :on-error="handleError2"
        :on-remove="handleRemove2"
        :before-remove="beforeRemove2"
        :before-upload="beforeUpload"
        :data="File"
        name="excelfile"
      >
        <el-button type="primary" plain>添加微信支付宝明细</el-button>
      </el-upload>-->
    </div>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      :highlight-current-row="true"
      :header-cell-style="getRowClass"
      :stripe="true"
      id="table-content"
      @row-click="handleRowClick"
      @selection-change="selectionChange"
    >
      <el-table-column prop="id" label fixed type="selection" :selectable="selectInit"></el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed>
        <template slot-scope="scope">
          <el-button @click="deleteFun(scope.row)" v-if="scope.row.surplusAmount == scope.row.creditAmount&&scope.row.is_EBS==0" type="text" size="small" class="table_details">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="is_EBS" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.is_EBS == 0">未导入</span>
          <span v-if="scope.row.is_EBS == 1">已导入</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="明细ID" align="center"></el-table-column>
      <el-table-column prop="creditAmount" label="手续费" align="center"></el-table-column>
      <el-table-column prop="referenceNumber" label="交易流水号" align="center"></el-table-column>
      <el-table-column prop label="交易日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transactionDateTime.split('T')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="交易时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.transactionDateTime.split('T')[1]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="valueDate" label="起息日" align="center"></el-table-column>
      <el-table-column prop="transactionType" label="交易类型" align="center"></el-table-column>
      <el-table-column prop="debitAmount" label="借方金额" align="center"></el-table-column>
      <el-table-column prop="creditAmount" label="贷方金额" align="center"></el-table-column>
      <el-table-column prop="balance" label="余额" align="center"></el-table-column>
      <el-table-column prop="purpose" label="用途" align="center"></el-table-column>
      <el-table-column prop="processInstanceNumber" label="流程实例号" align="center"></el-table-column>
      <el-table-column prop="businessName" label="业务名称" align="center"></el-table-column>
      <el-table-column prop="businessReferenceNumber" label="业务参考号" align="center"></el-table-column>
      <el-table-column prop="businessSummary" label="业务摘要" align="center"></el-table-column>
      <el-table-column prop="otherSummary" label="其他摘要" align="center"></el-table-column>
      <el-table-column prop="payerDebitBank" label="收(付)方分行名" align="center"></el-table-column>
      <el-table-column prop="payerDebitName" label="收(付)方名称" align="center"></el-table-column>
      <el-table-column prop="payerDebitAccount" label="收(付)方账号" align="center"></el-table-column>
      <el-table-column prop="payerDebitBankNumber" label="收(付)方开户行行号" align="center"></el-table-column>
      <el-table-column prop="payerDebitBankName" label="收(付)方开户行名" align="center"></el-table-column>
      <el-table-column prop="payerDebitBankAddress" label="收(付)方开户行地址" align="center"></el-table-column>
      <el-table-column prop="parentSubAccountBank" label="收(付)母(子)公司账号分行名" align="center"></el-table-column>
      <el-table-column prop="parentSubAccount" label="母(子)公司账号" align="center"></el-table-column>
      <el-table-column prop="parentSubName" label="母(子)公司名称" align="center"></el-table-column>
      <el-table-column prop="informationSign" label="信息标志" align="center"></el-table-column>
      <el-table-column prop="attachmentInformation" label="有否附件信息" align="center"></el-table-column>
      <el-table-column prop="rushMark" label="冲账标志" align="center"></el-table-column>
      <el-table-column prop="extendedAbstract" label="扩展摘要" align="center"></el-table-column>
      <el-table-column prop="transactionAnalysisCode" label="交易分析码" align="center"></el-table-column>
      <el-table-column prop="billNumber" label="票据号" align="center"></el-table-column>
      <el-table-column prop="businesPayOrderNum" label="商务支付订单号" align="center"></el-table-column>
      <el-table-column prop="internalNumber" label="内部编号" align="center"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageCurrent"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 表格 END -->
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import * as utils from './utils.js'
export default {
  components: {},
  data() {
    return {
      clickable: true,
      tableData: [], // 表格数据
      ruleForm: {
        matchType: "", // 匹配状态
        code: "", // 交易流水号
        dateStart: "", // 开始时间
        dateEnd: "" // 结束时间
      },
      File: {},
      multipleSelection: [], // 选择项

      pageCurrent: 1,
      pageSize: 10,
      total: 0,

      info: "",
      dialogFormVisible: false,

      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate()
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    // 计算属性的 getter
    headers() {
      return {
        Authorization: "Bearer " + localStorage.getItem("token")
      };
    },

    countTest: function() {
      return this.$store.state.bankDataUpdate;
    }
  },
  watch: {
    countTest: function(newV, oldV) {
      const that = this;
      if (newV.indexOf("industrialBankSXF") != -1 && newV != oldV) {
        setTimeout(function() {
          // alert('数据改变，执行loadDataSXF~')
          that.loadData();
        }, 500);
      }
    }
  },
  methods: {
    beforeUpload(event, file, filelist) {
      let data4D = utils.getSession4D();
      this.File.FileName = event.name;
      this.File.userid = data4D.userID;
      this.File.orgid = data4D.orgID;
      this.File.topid = data4D.topID;
      this.File.company = ""; //测试 暂时写死
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7;color:rgb(85, 85, 85);";
      } else {
        return "";
      }
    },
    // 导入财务系统
    importFun() {
      const that = this;
      this.$confirm("是否确认导入财务系统", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          let idArr = [];
          this.multipleSelection.forEach(function(item, index, arr) {
            idArr.push(item.id);
          });
          // console.log(idArr);
          this.$http
            .post(
              this.GLOBAL.serverSrc + "/finance/bankofchina/api/ImportEBS",
              {
                ids: idArr,
                type: 5
              }
            )
            .then(function(response) {
              // console.log(response)
              if (response.status == 200) {
                that.$message.success("导入成功！");
                that.loadData();
              } else {
                if (response.statusText) {
                  that.$message.warning(response.data.statusText);
                } else {
                  that.$message.warning("导入失败~");
                }
              }
            })
            .catch(function(error) {
              console.log(error);
              that.$message.warning("导入失败~");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消导入"
          });
        });
    },

    selectInit(row, index) {
      if (row.is_EBS == 1) {
        return false; //不可勾选
      } else {
        return true; //可勾选
      }
    },

    // 整行点击
    handleRowClick(row, column, event) {
      if (row.is_EBS == 0) {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
    },

    // 选择项更改
    selectionChange(val) {
      console.log(val);
      if (val.length > 0) {
        this.clickable = false;
      } else {
        this.clickable = true;
      }
      this.multipleSelection = val;
    },

    // 上传招商银行
    UploadUrl1() {
      return (
        this.GLOBAL.serverSrc + "/finance/chinamerchantsbank/api/importexcel"
      );
    },
    handleSuccess1(response, file, fileList) {
      console.log(response);
      if (response == true) {
        this.$message.success("招商银行流水单上传成功！");
        this.pageCurrent = 1;
        this.loadData();
        this.$store.commit(
          "changeBankData",
          "industrialBankSK" + Math.random()
        );
      } else {
        this.$message.warning("招商银行流水单上传失败！");
      }
    },
    handleError1(err, file, fileList) {
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove1(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove1(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传微信支付宝明细
    UploadUrl2() {
      return this.GLOBAL.serverSrc + "/finance/wa_payment/api/ImportExcel";
    },
    handleSuccess2(response, file, fileList) {
      console.log(response);
      if (response == true) {
        this.$message.success("微信支付宝明细上传成功！");
        this.pageCurrent = 1;
        this.loadData();
      } else {
        this.$message.warning("微信支付宝明细上传失败！");
      }
    },
    handleError2(err, file, fileList) {
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove2(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    // 删除
    deleteFun(row) {
      const that = this;
      this.$confirm("是否需要删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(
              this.GLOBAL.serverSrc + "/finance/chinamerchantsbank/api/delete",
              {
                id: row.id
              }
            )
            .then(function(response) {
              if (response.data.isSuccess) {
                that.pageCurrent = 1;
                that.loadData();
                that.$store.commit(
                  "changeBankData",
                  "merchantsBankSXF" + Math.random()
                );
                that.$message({
                  type: "info",
                  message: "已删除"
                });
              } else {
                if (response.data.message) {
                  that.$message.warning(response.data.result.message);
                } else {
                  that.$message.warning("删除失败~");
                }
              }
            })
            .catch(function(error) {
              console.log(error);
              that.$message.warning("删除失败~");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 搜索 重置
    searchHandInside() {
      this.pageCurrent = 1;
      this.loadData();
    },
    emptyButtonInside() {
      this.$refs["ruleForm"].resetFields();
      this.pageCurrent = 1;
      this.loadData();
    },
    // 加载数据
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageCurrent = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.loadData();
    },
    loadData() {
      const that = this;
      let data4D=utils.getSession4D
      // this.$http.post("mock/zhaohangSXF", {}).then(function(obj) {
      //   that.total = 100;
      //   that.tableData = obj.data.data;
      // });
      this.$http
        .post(
          this.GLOBAL.serverSrc + "/finance/chinamerchantsbank/api/search",
          {
            pageIndex: this.pageCurrent - 1,
            pageSize: this.pageSize,
            object: {
              transaction_reference_number: this.ruleForm.code,
              begin: this.ruleForm.dateStart
                ? moment(this.ruleForm.dateStart).format("YYYY-MM-DD 00:00:00")
                : "2000-05-16",
              end: this.ruleForm.dateEnd
                ? moment(this.ruleForm.dateEnd).format("YYYY-MM-DD 23:59:59")
                : "2099-05-16",
              seachType: 2,
              import_State: this.ruleForm.matchType
                ? this.ruleForm.matchType
                : 0,
                   //若传入4D则无数据 测试暂时先不传
              //   userid: data4D.userID, // 暂无数据 想看改成0,
              // orgid: data4D.orgID, // 暂无数据 想看改成0,
              // topid: data4D.topID, // 暂无数据 想看改成0,
              // company: "",
            }
          }
        )
        .then(function(obj) {
          // console.log('中国银行',obj);
          if (obj.data.isSuccess) {
            that.total = obj.data.total;
            that.tableData = obj.data.objects;
            // that.tableDataNBSK.forEach(function (item, index, arr) {
            //   item.collectionTime = item.collectionTime.split('T')[0];
            // });
            // that.loadingNBSK = false;
          } else {
            // that.loadingNBSK = false;
            that.total = 0;
            that.tableData = [];
          }
        });
    },
    // 时间限制
    beginDate() {
      const that = this;
      return {
        disabledDate(time) {
          if (that.ruleForm.dateEnd) {
            //如果结束时间不为空，则小于结束时间
            return new Date(that.ruleForm.dateEnd).getTime() < time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    processDate() {
      const that = this;
      return {
        disabledDate(time) {
          if (that.ruleForm.dateStart) {
            //如果开始时间不为空，则结束时间大于开始时间
            return new Date(that.ruleForm.dateStart).getTime() > time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    }
  }
};
</script>
<style lang="scss">
#merchantsBankSXF.distributor-content {
  width: 99%;
  margin: 25px auto;
  height: auto;
  border: 1px solid #e6e6e6;
  .form-content {
    background: #f7f7f7;
    padding: 20px 10px;
    margin: 20px 10px;
    .buttonForm {
      text-align: end;
    }
    .el-select {
      width: 100% !important;
    }
    .line {
      text-align: center;
    }
  }
  .buttonsDv {
    width: 98%;
    margin: 5px auto;
    .el-button {
      margin-right: 10px;
    }
  }
  #table-content {
    width: 98%;
    margin: 40px auto 20px;
  }
  .block {
    width: 100%;
    text-align: center;
    margin: 30px auto;
  }
  .upload-demo {
    display: inline-block !important;
    .el-upload-list {
      display: none !important;
    }
  }
}
</style>
