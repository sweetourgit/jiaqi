import Vue from 'vue'

import {
  formatDate
} from '@/js/libs/formatDate.js'
export default {
  data() {
    return {
      getCollectionPriceTotal: 0,
      tableManyRow: null,
      ifShowApply: false,
      fileCheckVal: 0,
      reable: false,
      dialogVisibleInvoice: false,
      dialogFormVisibleAssist: false,
      dialogFormVisibleReject: false,
      invoiceProject: [{
        value: '1',
        label: '旅游费'
      }],
      arrearsList: [], // 关联欠款列表
      invoiceTypeData: [{
        value: '1',
        label: '纸质发票'
      }],
      fileList: [],
      accountTable: [], // 收款账户列表
      accountShow: false, // 选择账户弹窗
      planID: '',
      accountCredited: null, // 收款账户选择
      TY: {
        refundOrder: [], // 退款中的订单
        userId: '',
        userName: '',
        applyUserInput: '',
        total: 0,
        pageNum: 1,
        pageSize: 5,
        currentPage: 1,
        imgBigName: '',
        imgBig: '',
        sameTradeData: [], // 同业社名称模糊查询
        supplierId: 0, // 同业社名称ID
        tourNamePre: '',
        uploadUrl: Vue.prototype.GLOBAL.serverSrc + '/upload/obs/api/file', // 上传凭证
        ruleForm: { // 同业收款表单
          indent: '', //关联欠款订单号搜索
          voucher: [], // 凭证
          collectionTime: '', // 收款时间
          createTime: '', // 申请日期
          collectionAccount: '', // 收款账户
          sameTrade: '', // 同业社
          money: '', // 收款金额
          price: '',
          abstract: '', // 摘要
          isInvoice: '0', // 发票
          collectionNumber: '', // 收款账户
          invoiceList: [{ // 发票相关
            invoiceID: '',
            invoiceType: '',
            taxesNumber: '',
            titleOrMobile: '',
            invoiceItem: '',
            invoicemoney: '',
            account: '',
            bank: '',
            address: '',
            mobile: '',
          }],
        },
        upload: {
          accessory: '',
        },
        rules: {
          invoiceID: [{
            required: true,
            message: '请选择发票类型',
            trigger: 'blur'
          }],
          invoiceType: [{
            required: true,
            message: '请选择个人或者单位',
            trigger: 'blur'
          }],
          titleOrMobile: [{
            required: true,
            message: '请填写发票抬头',
            trigger: 'blur'
          }],
          invoicemoney: [{
            required: true,
            message: '请填写发票金额',
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请填写联系电话',
            trigger: 'blur'
          }],
          invoiceItem: [{
            required: true,
            message: '请选择发票项目',
            trigger: 'blur'
          }],
          // voucher: [{ required: true, trigger: 'change', validator: validateVoucher}],
          collectionTime: [{
            required: true,
            message: '收款时间不能为空',
            trigger: 'blur'
          }],
          createTime: [{
            required: true,
            message: '收款时间不能为空',
            trigger: 'blur'
          }],
          sameTrade: [{
            required: true,
            message: '同业社不能为空',
            trigger: 'change'
          }],
          money: [{
              required: true,
              message: '收款金额不能为空',
              trigger: 'blur'
            },
            {
              pattern: /(?!0\.00)(\d+\.\d{2}$)/,
              message: '收款金额需为正数,最多两位小数'
            }
          ],
          price: [{
              required: true,
              message: '收款金额不能为空',
              trigger: 'blur'
            },
            {
              pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
              message: '收款金额需为正数,最多两位小数'
            }
          ],
          abstract: [{
            required: true,
            message: '摘要不能为空',
            trigger: 'blur'
          }],
          taxesNumber: [{
              required: true,
              message: '纳税人识别号不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^[+]{0,1}(\d+)$/,
              message: '纳税人识别号需为正整数'
            }
          ],
          isInvoice: [{
            required: true,
            message: '是否开发票不能为空',
            trigger: 'blur'
          }],
          collectionNumber: [{
            required: true,
            message: '收款账户不能为空',
            trigger: 'change'
          }]
        },
        approveCourseData: [],
        assistTransactionData: [],
        arrearsRelation: '8822.66',
      },
      ZK: {
        user_id: '',
        user_name: '',
        dialogFormVisible2: '',
        upload_url: Vue.prototype.GLOBAL.serverSrc + '/upload/obs/api/file', // 上传凭证
        time: 0,
        len: 0,
        uid: 0, //上传图片缩略图选中项
        tableData1: [],
        collectedMoney: 0,
        uncollectedMoney: 0, // 未收金额
        examineMoney: 0, // 待审批金额
        indentPeople: '', //订单关联订单联系人搜索
        tour_name_pre: '',
        null11: false,
        ruleForm: {
          indent: '', //关联欠款订单号搜索
          voucher: [], // 凭证
          collectionTime: '',
          groupCode: '',
          planID: '',
          orderID: '',
          orderNumber: '',
          collectionNumber: '',
          // price: '',
          dept: '',
          createUser: '',
          serialNumber: '',
          abstract: '',
          isInvoice: '0',
          invoiceList: [{
            invoiceID: '', //发票类型
            invoiceType: '', //个人/单位
            taxesNumber: '', //纳税识别人编号
            titleOrMobile: '', //发票抬头/手机号
            invoiceItem: '', //发票项目-旅游费
            invoicemoney: '', //金额
            account: '', //帐号
            bank: '', //开户行
            address: '', //地址
            mobile: '', //电话
            createTime: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          }]
        },
        rules: {
          invoiceID: [{
            required: true,
            message: '请选择发票类型',
            trigger: 'blur'
          }],
          invoiceType: [{
            required: true,
            message: '请选择个人或者单位',
            trigger: 'blur'
          }],
          titleOrMobile: [{
            required: true,
            message: '请填写发票抬头',
            trigger: 'blur'
          }],
          invoicemoney: [{
            required: true,
            message: '请填写发票金额',
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请填写联系电话',
            trigger: 'blur'
          }],
          invoiceItem: [{
            required: true,
            message: '请选择发票项目',
            trigger: 'blur'
          }],
          isInvoice: [{
            required: true,
            message: '是否开发票不能为空',
            trigger: 'blur'
          }],
          // voucher: [{ required: true, trigger: 'change', validator: validateVoucher}],
          collectionTime: [{
            required: true,
            message: '收款时间不能为空',
            trigger: 'blur'
          }],
          collectionNumber: [{
            required: true,
            message: '收款账户不能为空',
            trigger: 'change'
          }],
          abstract: [{
              required: true,
              message: '请输入摘要',
              trigger: 'blur'
            },
            {
              min: 0,
              max: 30,
              message: '摘要字数不能超过80字',
              trigger: 'change'
            },
          ],
          orderNumber: [{
            required: true,
            message: '订单号不能为空',
            trigger: 'blur'
          }],
          // invoiceID: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
        },
      },

    }
  },
  mounted() {

  },
  methods: {
    //转换arrearsList格式 同业与直客的匹配金额列表字段都一样 但是字段名称不一样
    handleConvert(obj) {
      return {
        orderCode: obj.orderCode,
        proName: obj.title,
        groupCode: obj.groupCode,
        departure: obj.date,
        payable: obj.payable,
        arrears_Amount: obj.uncollectedMoney,
        audited_Amount: obj.audited,
        repayment_Amount: obj.collPrice,
      }
    },
    getTitle(mode) {
      switch(mode) {
        case 'ZK':
        return '申请直客收款';
        case 'TY':
        return '申请同业收款';
      }
    }
  }
}
