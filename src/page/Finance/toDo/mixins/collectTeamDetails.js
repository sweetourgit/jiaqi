/*
*
* 收款（跟团游）详情；
* 通过，驳回（收款的审批没有工作流环节）；
*
* */

import moment from 'moment'

export default {
  data () {
    return {
      getOrgID: null,
      getUserName: null,
      getUserCode: null,
      fundamental: {}, // 查看详情基本信息数组
      keepPaymentId: null, // PaymentId 接口传值用
      keepComponentName: null,
      paramsCollectionType: null, // 收款类型（区分关联欠款）

      dialogVisibleDo: false, // 认款详情显示隐藏
      dialogVisibleDel: false, // 认款详情显示隐藏

      tableAuditResults: [], // 去认款显示隐藏
      tableInvoice: [], // 发票表格
      tableAssociated: [], // 发票关联表
      paramsInvoiceTable: null, // 是否显示发票列表
      approveDialogTitle: '', // 审批弹窗标题
      ifShowApproveDialog: false, // 是否展示审批弹窗
      approvalOpinion: '', // 审批意见
      approveDialogState: '', // 通过1，驳回2
      paramsChangeDate: null, // 数字相连的时间格式，接口传参用
      hasSubject: false, // 科目值
      tableManyRow: 0,
      getCollectionPriceTotal: 0,
      msg: "",
      // 基础信息
      baseInfo: {
        id: "",
        createUser: "",
        createTime: "",
        collectionType: "",
        distributor: "",
        orderNumber: "",
        localCompName: "",
        price: "",
        abstract: "",
        invoice: "",
        collectionTime: "",
        moneyExplain: "",
        collectionNumber: ""
      },
    }
  },
  created () {
    let paramsPaymentID = this.$route.query.id; // id 详情接口用
    this.paramsCollectionType = this.$route.query.collectionType; // 收款类型
    this.keepComponentName = this.$route.query.componentName; // 被点击的表格（属于哪个收款类型）
    this.keepAccountID = this.$route.query.accountID; // 账户id
    this.paramsInvoiceTable = this.$route.query.invoiceTable; // 发票数据字段（数组），若长度等于0，隐藏发票模块
    this.keepPaymentId = paramsPaymentID;
    this.getLabel(paramsPaymentID);
    this.getOrgID = sessionStorage.getItem("orgID"); // 打印用
    this.getUserName = sessionStorage.getItem("name");
    this.getUserCode = sessionStorage.getItem('userCode');
    this.getArrearsId = sessionStorage.getItem('arrearsID');
    this.paramsChangeDate = this.getMoment();
  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      return  parseFloat(value).toFixed(2);
    },
    formatDate: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD');
    },
    formatDateCreateAn: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDateDetailsAn:function (value) {
      if(typeof value == 'string'){
        return '';
      } else {
        return moment(value).format('YYYY-MM-DD');
      }
    }
  },
  methods: {
    moment,
    // 点击图片钩子
    handlePreview (file) {
      window.open(file.url);
    },
    // 取消
    handleCancel () {
      this.handleGoBack();
    },
    getStatus() {
      let _this = this;
      // 获取基本信息
      return this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/coll", {
        id: this.keepPaymentId
      })
      .then(res => {
        if (res.data.isSuccess) {
          return res.data.object;
        } else {
          _this.$message.warning("获取收款信息审批状态失败~");
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    // 通过弹窗显示
    handlePass () {
      this.approveDialogTitle = "审批通过";
      this.approveDialogState = 1;
      this.ifShowApproveDialog = true;
    },
    // 驳回弹窗显示
    handleRejected () {
      this.approveDialogTitle = "审批驳回";
      this.approveDialogState = 2;
      this.ifShowApproveDialog = true;
    },
    // 审批弹窗取消
    handleApproveDialogCancel () {
      this.ifShowApproveDialog = false;
    },
    // 审批弹窗确定回调
    /*approvalSubmit () {
      if (this.approveDialogTitle === '审批通过') {
        this.apiAuditApproved();
      } else {
        this.apiReject();
      }
    },*/
    // 审批提交事件
    handleApproveDialogConfirm () {
      let _this = this;
      if (_this.paramsCollectionType === 6) {
        // 报销还款
        if (this.approveDialogState === 1) {
          if (_this.keepAccountID !== 13) {
            if (_this.hasSubject) {
              _this.tableAssociated.forEach(function(item, index, arr) {
                let dataLocal = JSON.parse(localStorage.getItem(item.id));
                // console.log(dataLocal);
                if (dataLocal.hasCharge) {
                  _this.chargeSubmit(
                    item,
                    dataLocal.row,
                    dataLocal.type,
                    dataLocal.charge
                  );
                } else {
                  // 提交认款的请求
                  _this.commitAxios(item, dataLocal.row, dataLocal.type);
                }
              });
            } else {
              _this.approvalSubmit();
            }
          } else {
            _this.approvalSubmit();
          }
        } else if (this.approveDialogState === 2) {
          _this.approvalSubmit();
        }
      } else {
        // 其他
        if (this.approveDialogState === 1) {
          if (this.hasSubject) {
            this.tableAssociated.forEach(function(item, index, arr) {
              let dataLocal = JSON.parse(localStorage.getItem(item.id));
              console.log(dataLocal);
              if (dataLocal.hasCharge) {
                _this.chargeSubmit(
                  item,
                  dataLocal.row,
                  dataLocal.type,
                  dataLocal.charge
                );
              } else {
                _this.commitAxios(item, dataLocal.row, dataLocal.type);
              }
            });
          } else {
            _this.approvalSubmit();
          }
        } else if (this.approveDialogState === 2) {
          _this.approvalSubmit();
        }
      }
    },
    // 审批弹窗确定
    // 通过驳回同一个接口
    approvalSubmit () {
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/getCollIDTG", {
        datetime: this.paramsChangeDate,
        spname: this.getUserName,
        spstate: this.approveDialogState,
        spcontent: this.approvalOpinion,
        checktype: this.approveDialogState,
        id: this.keepPaymentId,
        SpCode: this.getUserCode
      }).then(res => {
        if (res.data.isSuccess) {
          this.handleApproveDialogSel();
        } else {
          if (res.data.message) {
            _this.$message.warning(res.data.message);
          } else {
            _this.$message.warning("审批提交失败~");
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    // 依据审批状态调用不同的函数
    handleApproveDialogSel () {
      if (this.approveDialogState === 1) {
        this.handleAuditApproved();
      } else if (this.approveDialogState === 2) {
        this.handleApprovedReject();
      } else {}
      this.dialogVisibleApproval = false;
    },
    // 通过动作
    handleAuditApproved () {
      // 报销还款不需要发票  _this.info.collectionType == 6则不走insert 直接走ebs接口
      if (this.paramsCollectionType !== 6) {
        // 插入发票
        this.insert();
        this.tbEBS();
      } else {
        this.tbEBS()
      }
    },
    // 驳回动作
    handleApprovedReject () {
      this.$message.success("已驳回");
    },
    // 获取详情
    getLabel (id) {
      this.tableAssociated = [];
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collection/api/coll', {
        "id": id
      }).then(res => {
        //console.log(res.data.object.invoiceTable)
        if (res.data.isSuccess) {
          let keepRes = res.data.object;
          this.tableAssociated = keepRes.arrears;
          this.fundamental = keepRes;
          this.tableInvoice = keepRes.invoiceTable;
          this.tableAuditResults = keepRes.spw;
          // 控制折叠面板折叠
          if (keepRes.spw.length > 0) {
            this.collapseName.push('collapseApprove')
          }
          if (keepRes.invoiceTable.length > 0) {
            this.collapseName.push('collapseInvoice')
          }
          if (keepRes.arrears.length > 0) {
            this.collapseName.push('collapseAssociated')
          }
          this.tour_id = keepRes.planID;
          this.tableManyRow = this.tableAssociated.length;
          this.tableAssociated.forEach(item => {
            _this.getCollectionPriceTotal += item.matchingPrice;
          });
          _this.printMatchingPrice = keepRes.arrears[0].matchingPrice;
          _this.printPayablePrice = keepRes.arrears[0].payablePrice;
          _this.printOrderCode = keepRes.arrears[0].orderCode;
          _this.printGroupCode = keepRes.arrears[0].groupCode;
          _this.getAccount(keepRes.accountID, keepRes.arrears[0].id);

          const hasInvoice = keepRes.invoiceTable.length > 0 ? "有" : "无";
          let createTimeStr = "";
          if (keepRes.createTime) {
            createTimeStr = keepRes.createTime.split("T")[0];
            if (keepRes.createTime.split("T")[1]) {
              createTimeStr +=  " " + keepRes.createTime.split("T")[1].split(".")[0];
            }
          }
          _this.baseInfo = {
            id: keepRes.id,
            createUser: keepRes.createUser,
            createTime: createTimeStr ? createTimeStr : keepRes.createTime,
            collectionType: keepRes.collectionType,
            distributor: keepRes.distributor,
            orderNumber: keepRes.serialNumber,
            collectionNumber: keepRes.collectionNumber,
            price: keepRes.price,
            abstract: keepRes.abstract,
            invoice: hasInvoice,
            collectionTime: keepRes.collectionTime,
            moneyExplain: keepRes.moneyExplain,
            localCompName: keepRes.localCompName,
            reimbursement: keepRes.reimbursement,
            loan: keepRes.loan,
            accountID: keepRes.accountID
          };
          // 打印相关
          if (keepRes.spw.length > 0) {
            _this.printSureTime = keepRes.spw[0].createTime;
            _this.printSureState = keepRes.spw[ keepRes.spw.length - 1 ].spState;
          }
        }
      }).catch(err => {
        console.log( err )
      })
    },
    getAccount (id, arrearsID) {
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/get", {
        id: id
      })
      .then(res => {
        if (res.data.isSuccess) {
          if (res.data.object.subject) {
            _this.hasSubject = true; // 有科目值 对公的
          }
        } else {
          _this.hasSubject = false;
        }
        _this.getCollectionPriceTotal = 0;
        if (!_this.hasSubject) {
          // alert("没有科目值");
          _this.tableAssociated.forEach(item => {
            _this.getCollectionPriceTotal += item.matchingPrice;
          });
        } else {
          // alert("有科目值");
          // console.log(_this.tableAssociated)
          _this.tableAssociated.forEach(item => {
            _this.getCollectionPriceTotal += item.matchingPrice;
            // console.log("submitData", localStorage.getItem(item.id));
            if (localStorage.getItem(item.id) == null) {
              // alert('true');
              // item.hasSubmitData = true;
              _this.$set(item, "hasSubmitData", true);
            } else {
              // item.hasSubmitData = false;
              _this.$set(item, "hasSubmitData", false);
            }
            if (_this.collectionType !== 6) {
              if (localStorage.getItem(item.id) == null) {
                _this.passDisabled = true;
              }
            }
          });
        }
        // 豆包加begin
        // 如果是报销还款进来的并且获取的accountID 13为现金 则可以直接通过 此时没有去认款的按钮 不等于13都是汇款
        // 等于汇款 还分为对公账户和对私账户   对公账户才有去认款的按钮 hasSubject为true则有科目值对公  _this.tableAssociated[0].checkType != 3 代表没认过款的
        // 查看按钮的显示与隐藏的判断
        // _this.isLookBtn = _this.tableAssociated[0].checkType;
        // console.log("hasSubject",_this.hasSubject)
        _this.isLookBtn = _this.getArrearsId ? true : false;
        if (_this.collectionType === 6) {
          if (id === 13) {
            _this.passDisabled = false;
          } else {
            // 是否有科目值
            _this.hasSubject ? (_this.passDisabled = true) : (_this.passDisabled = false);
          }
          if (_this.isLookBtn === true) {
            _this.passDisabled = false;
          }
        }
      })
      .catch(err => {
        console.log( err );
      });
    },
    // 认款接口 -- 将关联欠款的状态改成3(认款)
    getColl (item) {
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/getCollIDTG", {
        datetime: this.paramsChangeDate,
        spname: this.getUserName,
        spstate: "认款",
        spcontent: "",
        checktype: 1,
        id: item.id,
        'SpCode': this.getUserCode
      })
      .then(res => {
        if (res.data.isSuccess) {
          _this.$message.success("认款提交成功~");
          _this.approvalSubmit();
        } else {
          if (res.data.message) {
            _this.$message.warning(res.data.message);
          } else {
            _this.$message.warning("认款提交失败~");
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    // 报销发票的接口
    insert () {
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/insert", {
        object: {
          collectionID: this.keepPaymentId,
          userCode: this.getUserCode
        }
      })
      .then(res => {
        // 暂时去掉判断，后期需要和郭哥联调
        if (res.data.isSuccess) {
          // _this.tbEBS();
          _this.$message.success("提交发票成功~");
          // _this.closeAdd();
        } else {
          if (res.data.message) {
            _this.$message.warning(res.result.message);
          } else {
            _this.$message.warning("提交发票失败~");
          }
        }
      })
      .catch(err => {
        console.log( err );
      });
    },
    // 收款同步EBS
    tbEBS () {
      this.$http.post(this.GLOBAL.serverSrc + "/finance/collection/api/insertebs", {
        collectionID: this.keepPaymentId,
        accountID: this.keepAccountID
      })
      .then(res => {
        this.$message.success("审批提交成功~");
        this.closeAdd();
      })
      .catch(err => {
        console.log(err);
      });
    },
    // 插入一条手续费 插入手续费（审批通过，有科目值，剩余金额少于收款金额产生手续费）
    chargeSubmit (item, row, type, charge) {
      let _this = this;
      if (type === 0) {
        this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/insert", {
          object: {
            id: row.id,
            transaction_Date: row.transaction_Date,
            transaction_Time: row.transaction_Time,
            transaction_DateTime: row.transaction_DateTime,
            trade_Currency: row.trade_Currency,
            trade_Amount: 0 - parseFloat(charge),
            value_Date: row.value_Date,
            exchange_rate: row.exchange_rate,
            transaction_reference_number: row.transaction_reference_number + "-" + new Date().getTime(),
            record_ID: row.record_ID,
            reference: row.reference,
            purpose: row.purpose,
            remark: row.remark,
            transaction_Type: row.transaction_Type,
            business_type: row.business_type,
            account_holding_bank_number_of_payer: row.account_holding_bank_number_of_payer,
            payer_account_bank: row.payer_account_bank,
            debit_Account_No: row.debit_Account_No,
            payer_s_Name: row.payer_s_Name,
            account_holding_bank_number_of_beneficiary: row.account_holding_bank_number_of_beneficiary,
            beneficiary_account_bank: row.beneficiary_account_bank,
            payee_s_Account_Number: row.payee_s_Account_Number,
            payee_s_Name: row.payee_s_Name,
            surplus_Amount: row.surplus_Amount,
            createTime: row.createTime,
            isDeleted: 0,
            is_ZCK: 0,
            is_EBS: 0,
            purpose_fee: charge
          }
        })
        .then(function(res){
          // console.log('中国银行',res);
          if (res.data.isSuccess) {
            _this.$message.success("添加手续费成功！");
            _this.dialogVisibleSXF = false;
            _this.canClick = true;
            _this.commitAxios(item, row, type);
          } else {
            _this.tableDataZH = [];
          }
        });

        this.$http.post(this.GLOBAL.serverSrc + "/finance/bankofchina/api/save", {
          object: {
            id: row.id,
            transaction_Date: row.transaction_Date,
            transaction_Time: row.transaction_Time,
            transaction_DateTime: row.transaction_DateTime,
            trade_Currency: row.trade_Currency,
            trade_Amount: 0 - parseFloat(charge),
            value_Date: row.value_Date,
            exchange_rate: row.exchange_rate,
            transaction_reference_number: row.transaction_reference_number, // + "_" + new Date().getTime()
            record_ID: row.record_ID,
            reference: row.reference,
            purpose: row.purpose,
            remark: row.remark,
            transaction_Type: row.transaction_Type,
            business_type: row.business_type,
            account_holding_bank_number_of_payer: row.account_holding_bank_number_of_payer,
            payer_account_bank: row.payer_account_bank,
            debit_Account_No: row.debit_Account_No,
            payer_s_Name: row.payer_s_Name,
            account_holding_bank_number_of_beneficiary: row.account_holding_bank_number_of_beneficiary,
            beneficiary_account_bank: row.beneficiary_account_bank,
            payee_s_Account_Number: row.payee_s_Account_Number,
            payee_s_Name: row.payee_s_Name,
            surplus_Amount: row.surplus_Amount,
            createTime: row.createTime,
            isDeleted: 0,
            is_ZCK: 0,
            is_EBS: 0,
            purpose_fee: charge
          }
        })
        .then(function(res){
          // console.log('中国银行',res);
          if (res.data.isSuccess) {
            _this.$message.success("更新手续费成功！");
            _this.dialogVisibleSXF = false;
            _this.canClick = true;
            // _this.commitAxios(item, row, type);
          } else {
            _this.tableDataZH = [];
          }
        });
      } else if (type === 1) {

        this.$http.post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/insert", {
          object: {
            id: row.id,
            bank_serial_number:  row.bank_serial_number + "-" + new Date().getTime(),
            account_number: row.account_number,
            account_name: row.account_name,
            certificate_code: row.certificate_code,
            currency: row.currency,
            cash_or_transfer: row.cash_or_transfer,
            debit_amount: charge,
            credit_amount: 0,
            account_balance: row.account_balance,
            reference: row.reference,
            account_number_other: row.account_number_other,
            account_name_other: row.account_name_other,
            bank_other: row.bank_other,
            bank_Code_other: row.bank_Code_other,
            transaction_Date: row.transaction_Date,
            purpose: row.purpose,
            remark: row.remark,
            purpose_Date: row.purpose_Date,
            purpose_Merchant_code: row.purpose_Merchant_code,
            purpose_fee: charge,
            createTime: row.createTime,
            isDeleted: 0,
            surplus_Amount: row.surplus_Amount,
            is_ZCK: 0,
            is_EBS: 0
          }
        })
        .then(function(res){
          // console.log('兴业银行',res);
          if (res.data.isSuccess) {
            _this.$message.success("添加手续费成功！");
            _this.dialogVisibleSXF = false;
            _this.canClick = true;
            _this.commitAxios(item, row, type);
          } else {
            _this.tableDataZH = [];
          }
        });

        this.$http.post(this.GLOBAL.serverSrc + "/finance/industrialbank/api/save", {
          object: {
            id: row.id,
            bank_serial_number: row.bank_serial_number, //  + "_" + new Date().getTime()
            account_number: row.account_number,
            account_name: row.account_name,
            certificate_code: row.certificate_code,
            currency: row.currency,
            cash_or_transfer: row.cash_or_transfer,
            debit_amount: charge,
            credit_amount: 0,
            account_balance: row.account_balance,
            reference: row.reference,
            account_number_other: row.account_number_other,
            account_name_other: row.account_name_other,
            bank_other: row.bank_other,
            bank_Code_other: row.bank_Code_other,
            transaction_Date: row.transaction_Date,
            purpose: row.purpose,
            remark: row.remark,
            purpose_Date: row.purpose_Date,
            purpose_Merchant_code: row.purpose_Merchant_code,
            purpose_fee: charge,
            createTime: row.createTime,
            isDeleted: 0,
            surplus_Amount: row.surplus_Amount,
            is_ZCK: 0,
            is_EBS: 0
          }
        })
        .then(function(res) {
          // console.log('兴业银行',res);
          if (res.data.isSuccess) {
            _this.$message.success("更新手续费成功！");
            _this.dialogVisibleSXF = false;
            _this.canClick = true;
            // _this.commitAxios(item, row, type);
          } else {
            _this.tableDataZH = [];
          }
        });

      }
    },
    // 提交认款的请求（提交认款请求（申请通过，有科目值））
    commitAxios (item, row, type) {
      // console.log(this.tableDataOrder, "提交请求");
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/finance/CollectionBank/api/insert", {
        object: {
          arrID: item.id,
          price: item.matchingPrice,
          bangID: row.id,
          type: type
        }
      })
      .then(res => {
        if (res.data.isSuccess) {
          _this.getColl(item);
        } else {
          if (res.data.message) {
            _this.$message.warning(res.result.message);
          } else {
            _this.$message.warning("认款提交失败~");
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
    },
    /* 待整理 包括相关的 HTML */
    // 去认款
    recognitionDo (row) {
      this.dialogVisibleDo = true;
      this.msg = {
        collectionType: this.paramsCollectionType,
        baseInfo: this.baseInfo,
        tableDataOrder: row,
        fileList: this.fileList
      };
    },
    // 查看认款详情
    handleRecognitionDel (row) {
      this.msg = {
        id: row.id
      };
      this.dialogVisibleDel = true;
    },
    // 关闭认款弹窗
    recognitionClose (str) {
      console.log(str, '详情里面的取消按钮')
      this.getLabel(this.keepPaymentId);
      this.dialogVisibleDo = false;
      this.dialogVisibleDel = false;
      this.msg = "";
      if (str === "success") {
        this.passDisabled = false;
      }
    },
    // 查看认款详情
    handleRecognitionDetail (row) {
      this.msg = {
        id: row.id
      };
      this.dialogFormVisible = true;
    },
    // 转换为数字连接的时间格式，接口传值用
    getMoment () {
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString();
      const day = now.getDate().toString();
      return year + month + day;
    },
    dateFormatDetails (row, column) {
      let date = row[column.property];
      if (date === undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    handleGoBack () {
      console.log('详情页的取消事件')
      this.baseInfo = {
        id: "",
        createUser: "",
        createTime: "",
        collectionType: "",
        distributor: "",
        orderNumber: "",
        localCompName: "",
        price: "",
        abstract: "",
        invoice: "",
        collectionNumber: ""
      };

      this.$emit("close", false);
      // this.$router.go(-1);
    },
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px';
      } else {
        return '';
      }
    },
  }
}
