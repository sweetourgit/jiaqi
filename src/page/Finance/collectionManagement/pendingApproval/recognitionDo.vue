<template>
  <div class="oppo" style="position:relative">
    <!--认收款-->
    <el-dialog
      title="认收款"
      :visible="dialogFormVisible2"
      width="90%"
      @close="closeAdd"
      append-to-body
    >
      <div class="recognitionCls">
        <!-- 报销还款begin -->
        <div class="topMsg" v-if="collectionType == 6">
          <p class="inputLabel">
            <span>收款账户：</span>
            {{baseInfo.collectionNumber}}
          </p>
          <p class="inputLabel">
            <span>借款单号：</span>
            {{baseInfo.loan}}
          </p>
          <p class="inputLabel">
            <span>报销单号：</span>
            {{baseInfo.reimbursement}}
          </p>
          <p class="inputLabel">
            <span>收款金额：</span>
            {{baseInfo.price}}
          </p>
        </div>
        <!-- 报销还款end -->

        <!-- 非报销还款显示的begin -->
        <div v-if="collectionType !== 6">
          <!-- 顶部基础信息 -->
          <div class="topMsg">
            <p class="inputLabel" v-if="collectionType == 2">
              <span>同业社名称：</span>
              {{baseInfo.localCompName}}
            </p>
            <p class="inputLabel" v-if="collectionType == 1">
              <span>交易流水号：</span>
              {{baseInfo.orderNumber}}
            </p>
            <p class="inputLabel" v-if="collectionType == 5">
              <span>分销商：</span>
              {{baseInfo.distributor}}
            </p>
            <p class="inputLabel">
              <span>收款账户：</span>
              {{baseInfo.collectionNumber}}
            </p>
            <p class="inputLabel">
              <span>收款金额：</span>
              {{baseInfo.price}}
            </p>
            <p class="inputLabel" v-if="collectionType == 1 || collectionType == 2">
              <span>收款时间：</span>
              {{baseInfo.collectionTime.split('T')[0]}}
            </p>
            <p class="inputLabel">
              <span>摘要：</span>
              {{baseInfo.abstract}}
            </p>
            <div class="inputLabel">
              <span>凭证：</span>
              <ul>
                <li v-for="item in fileList" :key="item.index">
                  <a :href="item.url" target="_blank">{{item.name}}</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- 订单信息table -->
          <el-table
            ref="multipleTable"
            :data="tableDataOrder"
            border
            style="width: 100%;"
            :header-cell-style="getRowClass"
          >
            <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
            <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="date" label=" 下单时间" align="center"></el-table-column>
            <el-table-column prop="matchingPrice" label="本次收款金额" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- 非报销还款显示的end -->

        <!-- 认款table -->
        <div class="recognition">
          <el-tabs :tab-position="tabPosition" v-model="activeName">
            <el-tab-pane label="中国银行" name="bankZH">
              <el-table
                :data="tableDataZH"
                border
                max-height="700"
                :highlight-current-row="true"
                :header-cell-style="getRowClass"
                :stripe="true"
                id="table-content"
              >
                <el-table-column label="操作" width="100" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button
                      @click="chooseRecognition(scope.row, 0)"
                      type="text"
                      size="small"
                      class="table_details"
                      :disabled="canClick"
                    >选择</el-button>
                    <!-- <el-button type="text" size="small" class="table_details" disabled>已选</el-button> -->
                  </template>
                </el-table-column>
                <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
                <el-table-column prop="transaction_reference_number" label="交易流水号" align="center"></el-table-column>
                <el-table-column prop="transaction_Date" label="交易日期" align="center"></el-table-column>
                <el-table-column prop="transaction_Time" label="交易时间" align="center"></el-table-column>
                <el-table-column prop="trade_Currency" label="交易货币" align="center"></el-table-column>
                <el-table-column prop="trade_Amount" label="交易金额" align="center"></el-table-column>
                <el-table-column prop="value_Date" label="起息日期" align="center"></el-table-column>
                <el-table-column prop="exchange_rate" label="汇率" align="center"></el-table-column>
                <el-table-column prop="record_ID" label="记录标识号" align="center"></el-table-column>
                <el-table-column prop="reference" label="摘要" align="center"></el-table-column>
                <el-table-column prop="purpose" label="用途" align="center"></el-table-column>
                <el-table-column prop="remark" label="交易附言" align="center"></el-table-column>
                <el-table-column prop="transaction_Type" label="交易类型" align="center"></el-table-column>
                <el-table-column prop="business_type" label="业务类型" align="center"></el-table-column>
                <el-table-column
                  prop="account_holding_bank_number_of_payer"
                  label="付款人开户行号"
                  align="center"
                ></el-table-column>
                <el-table-column prop="payer_account_bank" label="付款人开户行名" align="center"></el-table-column>
                <el-table-column prop="debit_Account_No" label="付款人账号" align="center"></el-table-column>
                <el-table-column prop="payer_s_Name" label="付款人姓名" align="center"></el-table-column>
                <el-table-column
                  prop="account_holding_bank_number_of_beneficiary"
                  label="收款人开户行号"
                  align="center"
                ></el-table-column>
                <el-table-column prop="beneficiary_account_bank" label="收款人开户行名" align="center"></el-table-column>
                <el-table-column prop="payee_s_Account_Number" label="收款人账号" align="center"></el-table-column>
                <el-table-column prop="payee_s_Name" label="收款人姓名" align="center"></el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChangeZH"
                  @current-change="handleCurrentChangeZH"
                  :current-page.sync="pageCurrentZH"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeZH"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalZH"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="兴业银行" name="bankXY">
              <el-table
                :data="tableDataXY"
                border
                max-height="700"
                :highlight-current-row="true"
                :header-cell-style="getRowClass"
                :stripe="true"
                id="table-content"
              >
                <el-table-column label="操作" width="140" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button
                      @click="chooseRecognition(scope.row, 1)"
                      type="text"
                      size="small"
                      class="table_details"
                      v-if="scope.row.reference != '收付直通车支付结算'"
                      :disabled="canClick"
                    >选择</el-button>
                    <el-button
                      @click="payDetail(scope.row)"
                      type="text"
                      size="small"
                      class="table_details"
                      v-if="scope.row.reference == '收付直通车支付结算'"
                    >查看微信支付宝明细</el-button>
                    <!-- <el-button @click="deleteFun(scope.row)" type="text" size="small" class="table_details" disabled>已选</el-button> -->
                  </template>
                </el-table-column>
                <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
                <el-table-column prop="purpose_fee" label="手续费" align="center"></el-table-column>
                <el-table-column prop="bank_serial_number" label="银行流水号" align="center"></el-table-column>
                <el-table-column prop="reference" label="摘要" align="center"></el-table-column>
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
                <el-table-column prop="purpose" label="用途" align="center"></el-table-column>
                <el-table-column prop="credit_amount" label="贷方金额" align="center"></el-table-column>
                <el-table-column prop="account_number" label="账号" align="center"></el-table-column>
                <el-table-column prop="account_name" label="户名" align="center"></el-table-column>
                <el-table-column prop="certificate_code" label="凭证代号" align="center"></el-table-column>
                <el-table-column prop="currency" label="币种" align="center"></el-table-column>
                <el-table-column prop="cash_or_transfer" label="现/转" align="center"></el-table-column>
                <el-table-column prop="debit_amount" label="借方金额" align="center"></el-table-column>
                <el-table-column prop="account_number_other" label="对方账号" align="center"></el-table-column>
                <el-table-column prop="account_name_other" label="对方户名" align="center"></el-table-column>
                <el-table-column prop="bank_other" label="对方银行" align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChangeXY"
                  @current-change="handleCurrentChangeXY"
                  :current-page.sync="pageCurrentXY"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeXY"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalXY"
                ></el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="所选明细" v-if="isShow" name="bankMX">
              <el-table
                :data="tableDataMX"
                border
                max-height="700"
                :highlight-current-row="true"
                :header-cell-style="getRowClass"
                :stripe="true"
                id="table-content"
              >
                <el-table-column label="操作" width="100" align="center" fixed>
                  <template slot-scope="scope">
                    <el-button
                      @click="chooseRecognition(scope.row, 2)"
                      type="text"
                      size="small"
                      class="table_details"
                      :disabled="canClick"
                    >选择</el-button>
                    <!-- <el-button type="text" size="small" class="table_details" disabled>已选</el-button> -->
                  </template>
                </el-table-column>
                <el-table-column prop="surplus_Amount" label="剩余金额" align="center"></el-table-column>
                <el-table-column prop="transaction_time" label="交易时间" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.transaction_time.split('T')[0] + ' ' + scope.row.transaction_time.split('T')[1]}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="transaction_amount" label="交易金额" align="center"></el-table-column>
                <el-table-column prop="preferential_amount" label="优惠金额" align="center"></el-table-column>
                <el-table-column prop="actual_amount" label="实收金额" align="center"></el-table-column>
                <el-table-column prop="refund_amount" label="退款金额" align="center"></el-table-column>
                <el-table-column prop="merchant_order_number" label="商户订单号" align="center"></el-table-column>
                <el-table-column prop="platform_order_number" label="平台订单号" align="center"></el-table-column>
                <el-table-column prop="channel" label="所属渠道" align="center"></el-table-column>
                <el-table-column prop="merchant_code" label="商户编号" align="center"></el-table-column>
                <el-table-column prop="merchant_name" label="商户名称" align="center"></el-table-column>
                <el-table-column prop="payment_type" label="支付类型" align="center"></el-table-column>
                <el-table-column prop="trading_status" label="交易状态" align="center"></el-table-column>
                <el-table-column prop="currency" label="币种" align="center"></el-table-column>
                <el-table-column prop="transaction_type" label="交易类型" align="center"></el-table-column>
                <el-table-column prop="transaction_issuer" label="交易发卡行" align="center"></el-table-column>
                <el-table-column prop="terminal_type" label="终端类型" align="center"></el-table-column>
                <el-table-column prop="trade_name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="operator_number" label="操作员编号" align="center"></el-table-column>
                <el-table-column prop="device_number" label="设备号" align="center"></el-table-column>
                <el-table-column prop="shop_number" label="门店编号" align="center"></el-table-column>
                <el-table-column prop="third_party_merchant_number" label="第三方商户号" align="center"></el-table-column>
                <el-table-column prop="apPid" label="appID" align="center"></el-table-column>
                <el-table-column prop="third_party_order_number" label="第三方订单号" align="center"></el-table-column>
                <el-table-column prop="remark" label="付款备注" align="center"></el-table-column>
              </el-table>
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChangeMX"
                  @current-change="handleCurrentChangeMX"
                  :current-page.sync="pageCurrentMX"
                  :page-sizes="[5, 10, 50, 100]"
                  :page-size="pageSizeMX"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalMX"
                ></el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="footer">
        <!-- <el-button class="el-button" type="primary" @click="submitFun">确 定</el-button> -->
        <el-button class="el-button" type="warning" @click="closeAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "recognitionDo",
  components: {},
  props: {
    dialogFormVisible2: false,
    msg: ""
  },
  data() {
    return {
      canClick: false,
      baseInfo: {}, // 基础信息
      fileList: [], // 基础信息，凭证信息

      collectionType: "", // 认款订单类型（同业，直客，内部收款）
      tableDataOrder: [], // 订单table
      tabPosition: "left", // tab位置
      activeName: "bankZH", // 当前选中tab

      tableDataZH: [], // 中行table(当前页数，每页条数，总条数)
      pageCurrentZH: 1,
      pageSizeZH: 10,
      totalZH: 0,

      tableDataXY: [], // 兴业银行table(当前页数，每页条数，总条数)
      pageCurrentXY: 1,
      pageSizeXY: 10,
      totalXY: 0,

      tableDataMX: [], // 微信支付宝明细table(当前页数，每页条数，总条数)
      pageCurrentMX: 1,
      pageSizeMX: 10,
      totalMX: 0,
      isShow: false // 微信支付宝明细显示隐藏
    };
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    dialogFormVisible2: {
      handler: function() {
        console.log(this.msg);
        if (this.msg == "") {
          this.closeAdd();
        } else {
          this.baseInfo = this.msg.baseInfo;
          let tableDataOrder = [];
          tableDataOrder[0] = this.msg.tableDataOrder;
          this.tableDataOrder = tableDataOrder;
          this.collectionType = this.msg.collectionType;
          this.fileList = this.msg.fileList;
          this.loadDataZH();
          this.loadDataXY();
          this.isShow = false;
          this.canClick = false;
          this.activeName = "bankZH";
        }
      }
    }
  },
  methods: {
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7;color:rgb(85, 85, 85);";
      } else {
        return "";
      }
    },
    // 关闭弹窗
    closeAdd() {
      this.$emit("close", "success");
    },
    payDetail(row) {
      this.isShow = true;
      this.loadDataMX(row);
      this.activeName = "bankMX";
    },

    // 选择，提交认款
    chooseRecognition(row, type) {
      // console.log(row);

      if (this.collectionType !== 6) {
        if (row.surplus_Amount < this.tableDataOrder[0].matchingPrice) {
          this.$message.warning("不能进行选择，剩余金额不足~");
        } else {
          this.canClick = true;
          this.commitAxios(row, type);
        }
      } else {
        if (row.surplus_Amount < this.baseInfo.price) {
          this.$message.warning("不能进行选择，剩余金额不足~");
        } else {
          this.canClick = true;
          this.commitAxios(row, type);
        }
      }
    },

    // 提交认款的请求
    commitAxios(row, type) {
      console.log(this.tableDataOrder, "提交请求");
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/CollectionBank/api/insert", {
          object: {
            arrID: that.tableDataOrder[0].id,
            price: that.tableDataOrder[0].matchingPrice,
            bangID: row.id,
            type: type
          }
        })
        .then(function(response) {
          console.log(response);
          if (response.data.isSuccess) {
            that.getColl();
          } else {
            if (response.data.message) {
              that.$message.warning(response.result.message);
            } else {
              that.$message.warning("认款提交失败~");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    //
    getColl() {
      const that = this;
      const date = this.getMoment();
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collection/api/getCollIDTG", {
          datetime: date,
          spname: sessionStorage.getItem("name"),
          spstate: "认款",
          spcontent: "",
          checktype: 3,
          id: that.tableDataOrder[0].id
        })
        .then(function(response) {
          if (response.data.isSuccess) {
            that.$message.success("认款提交成功~");
            that.closeAdd();
          } else {
            if (response.data.message) {
              that.$message.warning(response.data.message);
            } else {
              that.$message.warning("认款提交失败~");
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // 加载认款数据(中国银行) -- 当前页数减一查询，后台分页从零开始
    handleSizeChangeZH(val) {
      this.pageSizeZH = val;
      this.pageCurrentZH = 1;
      this.loadDataZH();
    },
    handleCurrentChangeZH(val) {
      this.pageCurrentZH = val;
      this.loadDataZH();
    },
    loadDataZH() {
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/Search", {
          pageIndex: this.pageCurrentZH - 1,
          pageSize: this.pageSizeZH,
          object: {
            matching_State: 2,
            transaction_reference_number: "",
            begin: "2000-05-16",
            end: "2099-05-16"
          }
        })
        .then(function(obj) {
          // console.log('中国银行',obj);
          if (obj.data.isSuccess) {
            that.totalZH = obj.data.total;
            that.tableDataZH = obj.data.objects;
          } else {
            that.tableDataZH = [];
          }
        });
    },

    // 加载认款数据(兴业银行) -- 当前页数减一查询，后台分页从零开始
    handleSizeChangeXY(val) {
      this.pageSizeXY = val;
      this.pageCurrentXY = 1;
      this.loadDataXY();
    },
    handleCurrentChangeXY(val) {
      this.pageCurrentXY = val;
      this.loadDataXY();
    },
    loadDataXY() {
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/Search", {
          pageIndex: this.pageCurrentXY - 1,
          pageSize: this.pageSizeXY,
          object: {
            matching_State: 2,
            transaction_reference_number: "",
            begin: "2000-05-16",
            end: "2099-05-16"
          }
        })
        .then(function(obj) {
          // console.log('兴业银行',obj);
          if (obj.data.isSuccess) {
            that.totalXY = obj.data.total;
            that.tableDataXY = obj.data.objects;
          } else {
            that.totalXY = 0;
            that.tableDataXY = [];
          }
        });
    },

    // 加载认款数据(微信支付宝明细)
    handleSizeChangeMX(val) {
      this.pageSizeMX = val;
      this.pageCurrentMX = 1;
      this.loadDataMX();
    },
    handleCurrentChangeMX(val) {
      this.pageCurrentMX = val;
      this.loadDataMX();
    },
    loadDataMX(row) {
      const that = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/wa_payment/api/Search", {
          pageIndex: this.pageCurrentMX,
          pageSize: this.pageSizeMX,
          object: {
            purpose_Merchant_code: row.purpose_Merchant_code,
            purpose_Date: row.purpose_Date
          }
        })
        .then(function(obj) {
          console.log("微信支付宝明细", obj);
          if (obj.data.isSuccess) {
            that.totalMX = obj.data.total;
            that.tableDataMX = obj.data.objects;
            // that.tableDataNBSK.forEach(function (item, index, arr) {
            //   item.collectionTime = item.collectionTime.split('T')[0];
            // });
            // that.loadingNBSK = false;
          } else {
            // that.loadingNBSK = false;
            that.totalMX = 0;
            that.tableDataMX = [];
          }
        });
    },

    submitFun() {},

    // 获取当前年月日 string
    getMoment() {
      const now = new Date();

      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString();
      const day = now.getDate().toString();

      return year + month + day;
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.recognitionCls {
  .topMsg {
    width: 96%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .inputLabel {
      width: 33.33%;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: inline-block;
      }
    }
  }
  .recognition {
    margin: 20px auto;
    .block {
      text-align: center;
      margin: 10px auto;
    }
  }
}
.footer {
  text-align: right;
  overflow: hidden;
  // .el-button{
  //   float: right;
  // }
}
</style>
