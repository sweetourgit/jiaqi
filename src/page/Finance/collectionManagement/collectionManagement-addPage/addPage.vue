<!-- 2020-3-31 -->
<template>
  <!-- 申请填写同业收款表单-弹窗 -->
  <article class="content">
    <el-drawer  :show-close="false" :visible="dialogFormVisible"   @close="canelHandle">
      <header class="header">
        <section style="position:relative">
          <!-- <el-button @click="canelHandle">取 消</el-button> -->
          <el-button type="primary" @click="submitForm('ruleForm')" style="position:fixed;right:10px;top:1%;" :disabled="ifShowApply">申 请</el-button>
        </section>
      </header>
      <main>
        <el-form label-position="right" :model="this[`${mode}`]['ruleForm']" id="ruleForm" :rules="this[`${mode}`]['rules']" ref="ruleForm">
          <!-- 表单基本信息 -->
          <el-divider content-position="left" class='title-margin'>基本信息</el-divider>
          <!-- 同业 -->
          <sameTradeFrom ref="sameTradeFrom" :travelMode="travelMode" @getOriginPlace="getOriginPlace" v-if="mode=='TY'"
            ::fileList="fileList" :ruleForm="this[`${mode}`]['ruleForm']" @updateArrearsList="updateArrearsList"
            @isInvoiceHandle="isInvoiceHandle"></sameTradeFrom>
          <!-- 直客 -->
          <straightGuestForm v-else :ruleForm="this[`${mode}`]['ruleForm']" @updateArrearsList="updateArrearsList"
            @isInvoiceHandle="isInvoiceHandle"></straightGuestForm>
          <!-- <straightGuestForm :ruleForm="ruleForm" @updateArrearsList="updateArrearsList" @isInvoiceHandle="isInvoiceHandle"></straightGuestForm> -->
          <!-- invoiceProject:发票项目列表 invoiceTypeData:发票类型列表 dialogVisibleInvoice:是否显示发表表格 rules:校验规则 -->
          <InvoiceList :invoiceProject="invoiceProject" :invoiceTypeData="invoiceTypeData" :ruleForm="this[`${mode}`]['ruleForm']"
            :dialogVisibleInvoice="dialogVisibleInvoice" :rules="this[`${mode}`]['rules']"></InvoiceList>
          <el-divider content-position="left" class='title-margin title-margin-t'>关联欠款</el-divider>
          <div class="associated" v-if="mode=='TY'">
            <div class="associatedIcon"><i class="el-icon-warning"></i></div>
            <div class="associatedItems">已关联<span style="font-weight: bold;">{{ tableManyRow }}</span>项</div>
            <div class="associatedMoney">总计：{{ getCollectionPriceTotal }}元</div>
          </div>
          <el-tabs v-model="travelMode" @tab-click="travelModeChange" type="border-card">
            <el-tab-pane v-for="(item,index) in travelTabPanes" :key="index" :label="item.label" :name="item.name">
              <el-form-item label="订单：" v-if="mode=='ZK'" prop="indent" label-width="80px" style="float:left; margin:0 30px 20px 0;">
                <!-- 这里是重点 -->
                <!-- 这里为什么不直接用ruleForm里的 indent 因为加载顺序问题 貌似
                 v-model会比props先执行所以在组件 定义一个indent
                 但是为什么上面的 this[`${mode}`]['ruleForm'] 这么写就没问题
                 element-ui 貌似会比props晚一步 所有用el-的组件 使用这种写法都OK
                 原生的v-model则不可以
                 -->
                <el-input placeholder="请输入" v-model="indent"></el-input>
              </el-form-item>
              <el-button v-if="mode=='ZK'" type="primary" @click="receiptorder">搜索</el-button>
              <el-button v-if="mode=='ZK'" type="primary" @click="()=>{indent=''}">重置</el-button>
              <relatedArrears :arrearsList="arrearsList" @handleCollectionPrice="handleCollectionPrice"></relatedArrears>
            </el-tab-pane>
          </el-tabs>
          <!-- 关联欠款表格 -->
        </el-form>
        <accountsReceivable @clickPlan="clickPlan" @chooseAccount="chooseAccount"></accountsReceivable>
      </main>
    </el-drawer>
  </article>
  <!-- 申请同业收款 END -->
</template>

<script type="text/javascript">
  import moment from 'moment'
  import sameTradeFrom from './addPage-component/component-formList/sameTradeForm.vue'
  import straightGuestForm from './addPage-component/component-formList/straightGuestForm.vue'
  import accountsReceivable from './addPage-component/component-public/accountsReceivable.vue'
  // import sameTradeData from './addPage-obejct/sameTradeObject.js'
  // import straightGuestData from './addPage-obejct/straightGuestObject.js'
  import InvoiceList from './addPage-component/component-public/InvoiceList.vue'
  import relatedArrears from './addPage-component/component-public/relatedArrears.vue'
  import utils from './utils.js'
  import mixin from './mixin.js'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'

  export default {
    mixins: [mixin],
    components: {
      sameTradeFrom,
      accountsReceivable,
      straightGuestForm,
      InvoiceList,
      relatedArrears
    },
    props: {
      dialogFormVisible: false, // 是否显示弹窗
      find: 0,
      mode: ''
    },
    data() {
      return {
        travelMode: 'GroupTour',
        travelTabPanes: [{
          label: '跟团游',
          name: 'GroupTour'
        }, {
          label: '游轮',
          name: 'CruiseShip'
        }],
        indent: '',
      }
    },
    computed: {
      ...mapGetters('collectionManagement', {
        getArrearsList: 'getArrearsList'
      }),
      title() {
        return (this.find == 1 || this.find == 2) ? "查看同业收款" : "申请同业收款"
      },
    },
    methods: {
      // 时间插件
      moment,
      // 表格头部背景颜色
      ...mapMutations('collectionManagement', {
        getRowClass: 'getRowClass'
      }),
      // 计算匹配金额的总价
      handleCollectionPrice(val) {
        let filterCount = null
        let filterPriceCount = 0
        filterCount = this.arrearsList.filter(function(item) {
          return (typeof item.matchingMoney == 'number' && item.matchingMoney > 0)
        })
        filterCount.forEach(function(item) {
          filterPriceCount += item.matchingMoney
        })
        this.tableManyRow = filterCount.length
        this.getCollectionPriceTotal = filterPriceCount
      },
      // 是否选择发票，复选框改变事件
      isInvoiceHandle(value) {
        this.dialogVisibleInvoice = value == '1' ? true : false
      },
      //修改关联欠款表 ++++++++++++++++++++++++
      updateArrearsList() {
        let obj = this.getArrearsList

        if (obj.data.objects == null) {
          this.ifShowApply = true
          this.$message.success('该同业社下无关联欠款，无法申请同业收款');
          this.arrearsList = []
        } else {
          this.arrearsList = obj.data.objects;
           console.log('arrearsList',this.arrearsList)
          this.ifShowApply = false
        }
      },
      //收款账户选择 ++++++++++++++++++++
      chooseAccount(index, row) {
        this.accountCredited = row.id
        setTimeout(v => {
          this[`${this.mode}`].ruleForm.collectionNumber = this[`${this.mode}`].tourNamePre
          this.accountShow = false
        }, 200)
      },
      // 收款账户选择弹窗列表-行被点击时的事件 planID tour_id都为undefined +++++++++++++++++++++++
      clickPlan(row) {
        this[`${this.mode}`].tourNamePre = row['title'];
        this.planID = row['planID'];
        this.tour_id = row['planID']
      },
      // 文件上传失败时的钩子
      handleError(err, file) {
        this.fileList = []
      },
      // 文件上传成功时的钩子
      handleSuccess(res, file, fileList) {
        console.log('上传成功')
        this.fileList = fileList
        this.fileCheckVal = fileList.length; // 成功时凭证的条数（校验用）
        // this.$refs.voucher.clearValidate(); // 移除校验文字
      },

      //这里没设计好 直客查询管理订单函数 应放在ZKform里 暂时放在父组件 以后再改

      //通过订单号获取直客收款订单详情
      receiptorder() {
        var that = this
        this.getRefundList(this.indent).then(obj => {
          if (obj.data.objects.length == 0) {
            that[`${that.mode}getArrearsList`]()
          } else {
            that.$message({
              type: "info",
              message: "该笔订单正在退款中，不能进行收款操作"
            });
          }
        }).catch(function(obj) {
          console.log(obj)
        })
      },
      //这里这么起名的原因是为了以后 增加新功能 逻辑与当前方法无差时方便调用
      ZKgetArrearsList() {
        let that = this
        if (that.travelMode == 'GroupTour') {
          that.$http.post(
              that.GLOBAL.serverSrc + "/teamquery/get/api/receiptorder", {
                orderCode: that.indent,
                ProeuctType: 1
              })
            .then(function(obj) {
              that.ZKsetArrearsLis()
            })
            .catch(function(obj) {
              console.log(obj)
            })
        } else if (that.travelMode == 'CruiseShip') {
          that.$http.post(
              that.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/directarrearorder", {
                order_code: that.indent,
              }).then(function(obj) {
              that.ZKsetArrearsLis()
            })
            .catch(function(obj) {
              console.log(obj)
            })
        }

      },
      ZKsetArrearsLis(obj) {
        obj.data.object.uncollectedMoney = obj.data.object.payable - obj.data.object.collPrice // 订单金额 - 已收金额
        obj.data.object.matchingPrice = 0
        let changedData = []
        if (this.mode == 'GroupTour') changedData = utils.convertArrearsListForGroupTour(obj.data.object)
        if (this.mode == 'CruiseShip') changedData = utils.convertArrearsListForCruiseShip(obj.data.object)
        //若当前列表中包含此订单标号的数据 则不重复添加 并跟新此条数据
        for (let i = 0; i < that.arrearsList.length; i++) {
          if (that.arrearsList[i].orderCode == that.indent) {
            that.$set(that.arrearsList, i, changedData)
            return
          }
        }
        that.arrearsList.push(changedData)
        that[`${that.mode}`].ruleForm.planID = obj.data.object.planID
        that[`${that.mode}`].ruleForm.orderID = obj.data.object.id
        that[`${that.mode}`].ruleForm.groupCode = obj.data.object.groupCode
      },
      // 申请-提交表单
      submitForm(formName) {
        let _this = this
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let pictureList = _this.getPictureList()
            let newDate = moment(new Date(), 'yyyy-MM-dd hh:mm:ss')
            switch (_this.mode) {
              case 'TY':
                for (let i = 0; i < _this.arrearsList.length; i++) {
                  //判断列表是否含有退款状态的数据
                  let hasRefund = await this.TYsubmit(_this.arrearsList[i], i, pictureList)
                  //若有退款状态的数据则 停止循环结束函数
                  if (hasRefund == false) return
                }
                break;
              case 'ZK':
                this.ZKsubmit(pictureList)
                break;
            }

          }
        })
      },
      //同业提交的逻辑
      TYsubmit(item, index, pictureList) {
        console.log('执行同业收款')
        let _this = this
        return new Promise((res, rej) => {
          //校验匹配金额
          let flag = _this.checkMatchingMoney()
          if (flag) {
            this.getRefundList(item.orderCode).then(obj => {
              if (obj.data.objects.length == 0) {
                //检验所有arrearsList中的数据是否含有退款状态
                //if判断当前是是否是循环的最后一条数据 若是最后一条 且不含有退款状态则正常提交
                if (index == _this.arrearsList.length - 1) {
                  let objectRequest = {}
                  let {
                    needArrearData,
                    getMatchingMoney
                  } = _this.getNeedArrearData()
                  objectRequest = this.getObjectRequest(getMatchingMoney, pictureList, needArrearData)
                  let needInvoiceData = this.getInvoiceForm()
                  objectRequest.invoiceTable = needInvoiceData
                  this.handleApplication(objectRequest)
                } else {
                  res()
                }
              } else {
                _this[`${this.mode}`].refundOrder.push(item.orderCode)
                // 添加 isDisabled 属性用来给其置灰
                _this.$nextTick(function() {
                  item.isDisabled = true
                  item.matchingMoney = undefined
                  // delete item.matchingMoney
                })
                _this.$message({
                  type: "info",
                  message: "该笔订单正在退款中，不能进行收款操作"
                });
                //返回false 代表当前列表数据中含有退款状态的数据
                res(false)
              }
            })
          } else {}
        })
      },
      //直客提交的逻辑 大部分与同业相同 细节不同 单独拉出来写一个 调的函数都一样
      ZKsubmit(pictureList) {
        let _this = this
        let flag = _this.checkMatchingMoney()
        if (flag) {
          let {
            needArrearData,
            getMatchingMoney
          } = _this.getNeedArrearData()
          let objectRequest = _this.getObjectRequest(getMatchingMoney, pictureList, needArrearData)
          objectRequest.localName = ''
          objectRequest.collectionType = 1
          objectRequest.localCompID = 0
          objectRequest.LocalCompName = ''
          objectRequest.serialNumber = _this[`${this.mode}`].ruleForm.serialNumber
          let needInvoiceData = _this.getInvoiceForm()
          objectRequest.invoiceTable = needInvoiceData

          this.handleApplication(objectRequest)
        }
      },
      //获取图片列表
      getPictureList() {
        let pictureList = [];
        let newDate = moment(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.fileList.forEach(function(item) {
          pictureList.push({
            url: JSON.parse(item.response).paths[0].Url,
            name: item.name
          })
        })
        return pictureList
      },
      //获取退款列表
      getRefundList(orderCode) {
        let _this = this
        let refundList = this.$http.post(_this.GLOBAL.serverSrc + "/finance/refund/api/list", {
          object: {
            orderCode: orderCode
          },
        })
        return refundList
      },
      //校验匹配规则
      checkMatchingMoney() {
        let _this = this
        let matchingMoneyAll = 0
        let n = 0
        for (let index = 0; index < this.arrearsList.length; index++) {
          if (!(this.arrearsList[index].matchingMoney != undefined && this.arrearsList[index].matchingMoney != '' &&
              Number(this.arrearsList[index].matchingMoney) >
              0)) {
            _this.$message({
              type: 'info',
              message: '请填写匹配收款金额，并且匹配收款金额应大于0'
            });
            return false
          } else if (this.arrearsList[index].matchingMoney != undefined) {
            if (!(this.arrearsList[index].arrears_Amount - this.arrearsList[index].audited_Amount >= this.arrearsList[
                index].matchingMoney)) {
              // showMessgeTime = false
              _this.$message({
                type: 'info',
                message: '需遵循此公式：未收金额 - 待审批金额 >=  匹配收款金额'
              });
              return false
            }
          }
          if (typeof this.arrearsList[index].matchingMoney == "number") {
            matchingMoneyAll += this.arrearsList[index].matchingMoney
          }
        }
        // 只有同业需要判断这个
        if (matchingMoneyAll != Number(this[`${this.mode}`].ruleForm.price) && _this.mode == 'TY') {
          _this.$message({
            type: 'info',
            message: '收款金额要与匹配收款金额相等'
          });
          return false
        }
        return true
      },
      // 转换关联欠款表格数据结构
      getNeedArrearData() {
        let needArrearData = []
        let getMatchingMoney = 0
        let _this = this
        _this.arrearsList.forEach(function(item) { // 转换关联欠款表格数据结构
          if (item.matchingMoney != '' && item.matchingMoney > 0) {
            getMatchingMoney += Number(item.matchingMoney)
            needArrearData.push({
              "id": 0,
              'planID': item.planID,
              "collectionID": 0, // 收款id
              "orderCode": item.orderCode,
              "productName": item.proName,
              "groupCode": item.groupCode,
              "date": item.departure,
              "payablePrice": item.payable, // 订单金额
              "arrearsPrice": item.arrears_Amount, // 欠款金额
              "repaidPrice": item.repayment_Amount, // 已还金额
              "amountPrice": item.audited_Amount, // 待审核金额
              "matchingPrice": item.matchingMoney // 匹配收款金额
            })
          }
        })
        return {
          needArrearData,
          getMatchingMoney
        }
      },
      //通过子组件获取同业社信息
      getOriginPlace(id, value) {
        this.productPos = id;
        this.originPlace = value;
      },
      //同样为转化数据
      getObjectRequest(getMatchingMoney, pictureList, needArrearData) {
        let _this = this
        return {
          "GroupCode": "",
          "OrderNumber": "",
          "Dept": sessionStorage.getItem('orgName'),
          "LocalCompName": _this.originPlace,
          "ProductName": "暂无",
          "checkType": 0, // 审批状态
          "collectionTime": moment(_this[`${this.mode}`].ruleForm.collectionTime).format('YYYY-MM-DD'), // 收款时间,
          "groupCode": _this[`${this.mode}`].ruleForm.groupCode, // 团号,
          "orderID": 0, // 订单ID,
          "planID": 0, // 计划id,
          "orderNumber": _this.indent, // 订单号
          "collectionNumber": _this[`${this.mode}`].ruleForm.collectionNumber, // 收款账户
          "price": getMatchingMoney, // 金额,
          // "dept": _this.org, // 组织部门 _this.dept
          "createUser": sessionStorage.getItem('userCode'), // 创建者
          "createTime": moment(new Date(), 'yyyy-MM-dd hh:mm:ss'), // 申请时间
          "code": "",
          "serialNumber": 0, // 流水号
          "abstract": _this[`${this.mode}`].ruleForm.abstract, // 摘要
          "files": pictureList, // 文件
          "invoice": _this[`${this.mode}`].ruleForm.isInvoice, // 是否发票,
          "isDeleted": 0,
          "collectionType": 2, // 直客1.同业2
          "localCompID": _this.productPos, // 直客0，同业变成同业社id
          "arrears": needArrearData, // 收款 - 关联欠款列表
          "isEBS": 0,
          "accountID": _this.accountCredited == null ? 0 : _this.accountCredited, // 银行账号ID
          "moneyExplain": "string", // 款项说明
          "distributor": "string", // 分销商
          "payarr": [], // 付款 欠款关联订单
        }
      },
      //获取发票列表信息
      getInvoiceForm() {
        let _this = this
        //重点 _this[`${this.mode}`].ruleForm.isInvoice写if里不认得
        let isInvoice = _this[`${this.mode}`].ruleForm.isInvoice
        //同上 不认得
        let invoiceList = _this[`${this.mode}`].ruleForm.invoiceList
        if (isInvoice == 1) { // 发票列表，如果选择发票则添加该对象
          let needInvoiceData = []
          invoiceList.forEach(function(item) {
            needInvoiceData.push({
              "id": 0,
              "createTime": "2019-11-11T02:43:05.258Z",
              "code": "string",
              "invoiceID": item.invoiceID, // 发票类型 – 纸质发票
              "invoiceType": item.invoiceType, // 个人/单位
              "invoiceNumber": item.taxesNumber, // 纳税人识别号
              "invoiceHeaderOrTel": item.titleOrMobile, // 发票抬头/手机号
              "invoiceItem": item.invoiceItem, // 发票项目–旅游费
              "invoicePrice": item.invoicemoney, // 金额
              "cardNumber": item.account, // 账号
              "bankName": item.bank, // 开户行
              "address": item.address, // 地址
              "tel": item.mobile, // 电话
              "collectionID": 0
            })
          })
          return needInvoiceData
        } else {
          return []
        }
      },
      //执行申请
      handleApplication(objectRequest) {
        let _this = this
        let flag = ''
        _this.$http.post(_this.GLOBAL.serverSrc + '/finance/collection/api/insert', {
          "object": objectRequest
        }).then(res => {
          // console.log(res.data);
          if (res.data.isSuccess == true) {
            console.log('mode', _this.mode)
            this.$refs['ruleForm'].resetFields();
            _this[`${_this.mode}resetFields`]()
            // _this.a = false;
            _this.$emit(`getListFor${_this.mode}`)
            _this.$emit('searchHand', '')
            _this.$message({
              type: 'success',
              message: '创建成功!'
            });
            _this.closeAdd(true)
            //这里保险起见还是给个return
          } else {}
        }).catch(err => {
          console.log('err', err)
        })
      },
      //重置同业数据
      TYresetFields() {
        let _this = this
        _this.tableManyRow = 0
        _this.fileList = []
        _this.getCollectionPriceTotal = 0
        _this.arrearsList = [];
        _this.indent = '';
        _this.dialogVisibleInvoice = false;
        this.$refs.sameTradeFrom.sameTradeId = 1
      },
      ZKresetFields() {
        this.arrearsList = [];
        this.indent = '';
        this.dialogVisibleInvoice = false;
      },
      // 子组件触发事件
      closeAdd(addSuc) {
        if (addSuc) {
          this.$emit('close', addSuc);
        } else {
          this.$emit('close', false);
        }
      },
      // 取消事件（顶部）
      canelHandle() {
        this.$confirm("是否取消本次收款申请?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$message.success("收款申请已取消");
            this.$refs["ruleForm"].resetFields();
            this[`${this.mode}resetFields`]()
            this.closeAdd();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      },
      travelModeChange(tab, event) {
        this.travelMode = tab.name
        switch (this.mode) {
          case 'TY':
            this.$refs.sameTradeFrom.getArrearsList(undefined, this.travelMode);
            break;
          case 'ZK':
              if(this.indent!=''){
                this.receiptorder()
              }
              break;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    position: relative;

    .el-divider__text {
      font-size: 17px !important
    }

    .title-margin {
      margin-bottom: 30px;
    }

    .title-margin-t {
      margin-top: 45px;
    }

    .invoice {
      margin-left: 30px;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  .sh_style {
    background: #eaeaea;
    position: absolute;
    width: 50px;
    height: 23px;
    text-align: center;
    line-height: 26px;
    top: 20px;
    left: 140px;
  }

  .collection {
    background: #eaeaea;
    color: #a4a4a4;
  }

  .button_select {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
  }

  .el-input {
    width: auto
  }

  .upload-demo>>>.el-upload-list__item:first-child {
    margin-top: 5px;
  }

  .upload-demo {
    width: 400px;
  }

  .upload-demo>>>.el-upload-list__item {
    width: 300px;
  }

  .accountButton {
    float: right;
    margin: 20px 0 0 0;
    overflow: hidden;
  }

  .associated {
    line-height: 40px;
    background: #e3f2fc;
    border: 1px solid #cfeefc;
    border-radius: 5px;
    overflow: hidden;
  }

  .associatedIcon {
    font-size: 14pt;
    color: #0b84e6;
    margin: 0 0 0 15px;
    float: left;
  }

  .associatedItems {
    float: left;
    margin: 0 0 0 10px;
  }

  .associatedMoney {
    float: left;
    margin: 0 0 0 30px;
  }
</style>
