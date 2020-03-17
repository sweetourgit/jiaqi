import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: 'login',
    },  {
      path: '/blankPages',
      component: () => import('@/page/blank/blankPages/blankPages'),
      name: '空白页',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/userList',
      component: () => import('@/page/account/userList/userList'),
      name: '用户列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/userList1',
      component: () => import('@/page/account/userList/userList1'),
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/organList',
      component: () => import('@/page/account/organList/organList'),
      name: '组织列表',
      meta: {
        keepAlive: true,
        title: '组织列表',
        auth: true
      }
    }, {
      path: '/role',
      component: () => import('@/page/account/role/role'),
      name: '角色模板',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    /* {
       path: '/perList',
       component: perList,
       name: '权限列表',
       meta: {
         keepAlive: true,
         auth:true}
     }*/
    , {
      path: '/accountInfor',
      component: () => import('@/page/perCenter/accountInfor/accountInfor'),
      name: '个人中心',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/login',
      component: () => import('@/page/login/login'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/positionList',
      component: () => import('@/page/account/positionList/positionList'),
      name: '职位列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/userList',
      component: () => import('@/page/account/userList/userList'),
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/userList/addUser',
      component: () => import('@/page/account/userList/addUser/addUser'),
      name: '用户添加',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/cityList',
      component: () => import('@/page/contentInfo/cityList/cityList1'),
      name: '区域列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/customArea',
      component: () => import('@/page/contentInfo/customArea/customArea'),
      name: '自定义地区',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/scenicList',
      component: () => import('@/page/contentInfo/scenicList/scenicList'),
      name: '景点列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/labelList',
      component: () => import('@/page/contentInfo/labelList/labelList'),
      name: '标签列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/materialList',
      component: () => import('@/page/contentInfo/materialList/materialList'),
      name: '素材列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/hotelList',
      component: () => import('@/page/contentInfo/hotelList/hotelList'),
      name: '酒店列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/supplierInfo',
      component: () => import('@/page/contentInfo/supplierInfo/supplierList/supplierList.vue'),
      name: '供应商信息',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/supplierAdd',
      component: () => import('@/page/contentInfo/supplierInfo/supplierEdit/supplierEdit.vue'),
      name: '新增供应商',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/supplierEdit',
      component: () => import('@/page/contentInfo/supplierInfo/supplierEdit/supplierEdit.vue'),
      name: '编辑供应商',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/supplierDetails',
      component: () => import('@/page/contentInfo/supplierInfo/supplierDetails/supplierDetails'),
      name: '供应商详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/merchantInfo',
      component: () => import('@/page/contentInfo/merchantInfo/merchantInfo1'),
      name: '商户信息',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/actList',
      component: () => import('@/page/contentInfo/priManagement/actList'),
      name: '功能列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, /*{
      path: '/proList',
      //component: proList,
      name: '权限列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    },*/ {
      path: '/blacklist',
      component: () => import('@/page/contentInfo/blacklist/blacklist'),
      name: '黑名单',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/enrollTypeA',
      component: () => import('@/page/contentInfo/enrollType/enrollTypeA'),
      name: '报名类型A',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/enrollTypeB',
      component: () => import('@/page/contentInfo/enrollType/enrollTypeB'),
      name: '报名类型B',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/workFlowList',
      component: () => import('@/page/contentInfo/workFlowList/workFlowList'),
      name: '工作流接口查询管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/menuList',
      component: () => import('@/page/contentInfo/priManagement/menuList'),
      name: '权限配置',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/cruiseShip',
      component: () => import('@/page/contentInfo/cruiseShip/cruiseShip.vue'),
      name: '邮轮管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/cruiseShip/cruiseShipDetail',
      component: () => import('@/page/contentInfo/cruiseShip/cruiseShipDetail.vue'),
      name: '邮轮管理/详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/cruiseShip/shipDetailAdd',
      component: () => import('@/page/contentInfo/cruiseShip/shipDetailAdd.vue'),
      name: '邮轮管理/详情/添加游轮',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/curiseShipCabin',
      component: () => import('@/page/contentInfo/cruiseShipCabin/curiseShipCabin.vue'),
      name: '邮轮舱房管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/productList',
      component: () => import('@/page/productManagement/productList/productList'),
      name: '产品列表',
      children: [{
        path: 'packageTour',
        name: '跟团游',
        component: () => import('@/page/productManagement/productList/tab/packageTour'),
        meta: {
          keepAlive: true,
          auth: true
        },
      },
        {
          path: 'scenicOrTicketList',
          name: '景区/票务',
          component: () => import('@/page/productManagement/productList/tab/scenicOrTicketList'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'productVisa',
          name: '签证',
          component: () => import('@/page/productManagement/productList/tab/productVisa'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'productLiner',
          name: '邮轮',
          component: () => import('@/page/productManagement/productList/tab/productLiner'),
          meta: {
            keepAlive: true,
            auth: true
          },
        }
      ]
    }, {
      path: '/productLinerDo',
      component: () => import('@/page/productManagement/liner/linerAdd'),
      name: '邮轮/ 添加',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/listInfo',
      component: () => import('@/page/productManagement/listInfo/listInfo'),
      name: '添加跟团游',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/listInfoScenic',
      component: () => import('@/page/productManagement/listInfoScenic/listInfoScenic'),
      name: '添加景区/票务',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/listInfoEdit',
      component: () => import('@/page/productManagement/listInfoScenic/listInfoEdit'),
      name: '编辑景区/票务',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/visaProducts',
      component: () => import('@/page/productManagement/visa/addVisa/visaProducts'),
      name: '添加签证',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/visaMessage', // 添加签证信息
      component: () => import('@/page/productManagement/visa/addVisa/visaMessage'),
      name: '添加签证',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/visaImportant', // 添加重要信息
      component: () => import('@/page/productManagement/visa/addVisa/visaImportant'),
      name: '添加签证',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/visaInventory',
      component: () => import('@/page/productManagement/visa/visaInventory/visaInventory'),
      name: '团期/签证库存',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/travelTemplate',
      component: () => import('@/page/productManagement/travelTemplate/travelTemplate'),
      name: '出行模板',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/regimentPlan',
      component: () => import('@/page/productManagement/regimentPlan/regimentPlan'),
      name: '团期计划',
      children: [{
          path: 'teamPlanList',
          name: '团期计划列表',
          component: () => import('@/page/productManagement/regimentPlan/children/team/teamPlanList'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'scenicTicketingList',
          name: '景区/票务',
          component: () => import('@/page/productManagement/regimentPlan/children/scenic/scenicTicketingList'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'visaOrderList',
          name: '签证',
          component: () => import('@/page/productManagement/regimentPlan/children/visaOrder/visaOrderList'),
          meta: {
            keepAlive: true,
            auth: true
          },
        //   children: [{
        //     path: 'visaCheck',
        //     name: '签证/报账',
        //     component: () => import('@/page/productManagement/regimentPlan/children/visaOrder/VisaCheck/VisaCheck'),
        //     meta: {
        //       keepAlive: true,
        //       auth: true
        //     },
        //   },
        //   {
        //     path: 'visaDetails',
        //     name: '签证/sku详情',
        //     component: () => import('@/page/productManagement/regimentPlan/children/visaOrder/VisaDetails/visaDetails'),
        //     meta: {
        //       keepAlive: true,
        //       auth: true
        //     },
        //   },
        // ]
        },



      ]
    },
    {
      path: '/VisaContent',
      name: '产品管理  /团期计划  /签证  /详情',
      component: () => import('@/page/productManagement/regimentPlan/children/visaOrder/VisaDetails/VisaContent'),
      meta: {
        keepAlive: true,
        auth: true
      },
    },
    {
      path: '/NewOrder',
      name: '产品管理  /团期计划  /签证  /下单',
      component: () => import('@/page/productManagement/regimentPlan/children/visaOrder/VisaDetails/NewOrder'),
      meta: {
        keepAlive: true,
        auth: true
      },
    },

    {
      path: '/orderManagement',
      component: () => import('@/page/orderManagement/allOrders/orderManagement'),
      name: '订单管理',
      children: [{
          path: 'orderList',
          name: '订单管理-跟团游',
          component: () => import('@/page/orderManagement/allOrders/orderList/orderList'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'visaOrderlist',
          name: '订单管理-签证',
          component: () => import('@/page/orderManagement/allOrders/visaOrder/visaOrderlist'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'boatOrderlist',
          name: '订单管理-邮轮游',
          component: () => import('@/page/orderManagement/allOrders/boatOrder/boatOrderlist'),
          meta: {
            keepAlive: true,
            auth: true
          },
        }
      ]
    },
    {
      path: '/merchantsOrder',
      component: () => import('@/page/orderManagement/merchantsOrder/businessOrder'),
      name: '商户订单',
      meta: {
        keepAlive: true,
        auth: true
      },
    },
    {
      path: '/scenicTicketingDetails',
      name: '产品管理  /团期计划  /详情',
      component: () => import('@/page/productManagement/regimentPlan/children/scenic/scenicTicketingDetails'),
      meta: {
        keepAlive: true,
        auth: true
      },
    }, {
      path: '/scenicTicketingPledging',
      name: '产品管理  /团期计划  /认款',
      component: () => import('@/page/productManagement/regimentPlan/children/scenic/scenicTicketingPledging'),
      meta: {
        keepAlive: true,
        auth: true
      },
    }, {
      path: '/scenicTicketingBillReporting',
      name: '产品管理  /团期计划  /报账单',
      component: () => import('@/page/productManagement/regimentPlan/children/scenic/scenicTicketingBillReporting'),
      meta: {
        keepAlive: true,
        auth: true
      },
    }, {
      path: '/externalOrderList',
      component: () => import('@/page/orderManagement/externalOrderList/externalOrderList'),
      name: '外部订单',
      children: [{
        path: 'canRecognition',
        name: '外部订单  /可认款报账',
        component: () => import('@/page/orderManagement/externalOrderList/canRecognition'),
        meta: {
          keepAlive: true,
          auth: true
        },
      }, {
          path: 'noRecognition',
          name: '外部订单  /未认收款',
          component: () => import('@/page/orderManagement/externalOrderList/noRecognition'),
          meta: {
            keepAlive: true,
            auth: true
          },
        }
      ]
    }, {
      path: '/importHistory',
      component: () => import('@/page/orderManagement/externalOrderList/importHistory'),
      name: '外部订单管理/订单管理/导入历史',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/recognitionMsg',
      component: () => import('@/page/orderManagement/externalOrderList/recognitionMsg/recognitionMsg'),
      name: '订单管理/外部订单/认收款信息',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, /*{
      path: '/recognitionDo',
      component: recognitionDo,
      name: '订单管理/外部订单/认收款信息/认收款',
      meta: {
        keepAlive: true,
        auth: true
      }
    },*/ {
      path: '/sharedInventory',
      component: () => import('@/page/productManagement/sharedInventory/sharedInventory'),
      name: '共享库存',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/changePro',
      component: () => import('@/page/productManagement/listInfo/listInfo'),
      name: '编辑产品',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/changeInfo',
      component: () => import('@/page/productManagement/changeInfo/changeInfo'),
      name: '行程信息',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/planInventory',
      component: () => import('@/page/productManagement/planInventory/index'),
      name: '团期/库存',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/doneAll/list',
      component: () => import('@/page/Finance/doneAll/list'),
      name: '已办',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/doneAll/advanceAndNoInDetails',
      component: () => import('@/page/Finance/doneAll/advanceAndNoInDetails'),
      name: '已办/借款详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/doneAll/reimbursementDetails',
      component: () => import('@/page/Finance/doneAll/reimbursementDetails'),
      name: '已办/报销详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/doneAll/refundDetails',
      component: () => import('@/page/Finance/doneAll/refundDetails'),
      name: '已办/退款详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/doneAll/collectionDetails',
      component: () => import('@/page/Finance/doneAll/collectionDetails'),
      name: '已办/收款详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/toDo/ILabel',
      component: () => import('@/page/Finance/toDo/ILabel'),
      name: '待办',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/approve/approveList',
      component: () => import('@/page/Finance/approve/approveList'),
      name: '需要您审批',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/approve/approveDetail',
      component: () => import('@/page/Finance/approve/approveDetail'),
      name: '审批详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/approve/splitLoan',
      component: () => import('@/page/Finance/approve/splitLoan'),
      name: '拆分借款单',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/loanManagement',
      component: () => import('@/page/Finance/loanManagement/loanManagement'),
      name: '无收入借款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/relationSplitMap',
      component: () => import('@/page/Finance/relationSplitMap/relationSplitMap'),
      name: '拆分关系表',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/advancePayment',
      component: () => import('@/page/Finance/advancePayment/advancePayment'),
      name: '预付款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/reimburseManagement',
      component: () => import('@/page/Finance/reimburseManagement/reimburseManagement'),
      name: '报销管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/invoiceManagement',
      component: () => import('@/page/Finance/invoiceManagement/invoiceManagement'),
      name: '发票管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/invoiceApply',
      component: () => import('@/page/Finance/invoiceApply/invoiceApply'),
      name: '发票申请管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/refundManagement',
      component: () => import('@/page/Finance/refundManagement/refundManagement'),
      name: '退款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/collectionManagement',
      component: () => import('@/page/Finance/collectionManagement/collectionManagement'),
      name: '收款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/gatheringDel',
      component: () => import('@/page/Finance/collectionManagement/distributorsInfo/gatheringDel'),
      name: ' 收款管理/详情',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path:'distributorsInfo',
      component:　() => import('@/page/Finance/collectionManagement/distributorsInfo/distributorsInfo'),
      name:'分销商收款',
      meta:{
        keepAlive:true,
        auth:true
      }
    },
    {
      path: '/arrearsManagement',
      component: () => import('@/page/Finance/arrearsManagement/arrearsManagement'),
      name: '供应商欠款管理',
      children: [{
          path: 'arrearsList',
          name: '欠款列表',
          component: () => import('@/page/Finance/arrearsManagement/arrearsList/arrearsList'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'supplierArrears',
          name: '供应商欠款',
          component: () => import('@/page/Finance/arrearsManagement/supplierArrears/supplierArrears'),
          meta: {
            keepAlive: true,
            auth: true
          },
        }
      ]
    },
    {
      path: '/predepositManagement',
      component: () => import('@/page/Finance/predepositManagement/predepositList'),
      name: '客商预存款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/bankAccount',
      component: () => import('@/page/Finance/bankAccount/bankAccount'),
      name: '银行账号管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/pledgingManagement',
      component: () => import('@/page/Finance/pledgingManagement/pledgingManagement'),
      name: '财务认款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    // {
    //   path: '/balanceOrder',
    //   component: () => import('@/page/Finance/balanceOrder/balanceOrder'),
    //   name: '欠款订单管理',
    //   meta:{
    //     keepAlive:true,
    //     auth:true
    //   }
    // },
    {
      path: '/balanceOrder',
      component: () => import('@/page/Finance/balanceOrder/balanceOrder'),
      name: '欠款订单管理',
      children: [{
          path: 'commercia',
          name: '商户欠款订单',
          component: () => import('@/page/Finance/balanceOrder/commercia/commercia'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'distribution',
          name: '分销商欠款订单',
          component: () => import('@/page/Finance/balanceOrder/distribution/distribution'),
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'supplier',
          name: '供应商欠款订单',
          component: () => import('@/page/Finance/balanceOrder/supplier/supplier'),
          meta: {
            keepAlive: true,
            auth: true
          },
        }

      ]
    },
    {
      path: '/pledgingManagementApproval',
      component: () => import('@/page/Finance/pledgingManagement/pledgingManagementApproval'),
      name: '财务管理   / 财务认款管理   / 审批',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/pledgingManagementSee',
      component: () => import('@/page/Finance/pledgingManagement/pledgingManagementSee'),
      name: '财务管理   / 财务认款管理   / 查看',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/pledgingHistory',
      component: () => import('@/page/Finance/pledgingManagement/pledgingHistory'),
      name: '财务管理   / 财务认款管理   / 审批历史',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/checkSheet',
      component: () => import('@/page/Finance/checkSheet/checkSheet'),
      name: '报账单',
      meta: {
        keepAlive: true,
        auth: true
      },
      children: [
        {
          path: 'around',
          component: () => import('@/page/Finance/checkSheet/around/around'),
          name: '报账单-周边游',
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'team',
          component: () => import('@/page/Finance/checkSheet/team/team'),
          name: '报账单-跟团游',
          meta: {
            keepAlive: true,
            auth: true
          },
        }
      ]
    }, {
      path: '/checkSheetDetail',
      component: () => import('@/page/Finance/checkSheetDetail/checkSheetDetail'),
      name: '报账单详情',
      meta: {
        keepAlive: true,
        auth: true
      },
      children: [
        {
          path: 'team',
          component: () => import('@/page/Finance/checkSheetDetail/subs/team/team'),
          name: '报账单详情-跟团游',
          meta: {
            keepAlive: true,
            auth: true,
          },
        }
      ]
    }, {
      path: '/addCheckSheet',
      component: () => import('@/page/Finance/checkSheetDetail/checkSheetDetail'),
      name: '新建报账单',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/businessRecognitionManagement',
      component: () => import('@/page/Finance/businessRecognitionManagement/businessRecognitionManagement.vue'),
      name: '业务待认款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/aroundBorrowingManagement',
      component: () => import('@/page/Finance/aroundBorrowingManagement/aroundBorrowingManagement.vue'),
      name: '周边借款管理',
      children: [{
        path: 'noIncomeBorrowing',
        component: () => import('@/page/Finance/aroundBorrowingManagement/noIncomeBorrowing.vue'),
        name: '周边借款管理   /无收入借款',
        meta: {
          keepAlive: true,
          auth: true
        }
      }, {
        path: 'advancePaymentAround',
        component: () => import('@/page/Finance/aroundBorrowingManagement/advancePayment.vue'),
        name: '周边借款管理   /预付款管理',
        meta: {
          keepAlive: true,
          auth: true
        }
      }, {
        path: 'balancePaymentBorrowing',
        component: () => import('@/page/Finance/aroundBorrowingManagement/balancePaymentBorrowing.vue'),
        name: '周边借款管理   /余额支付借款',
        meta: {
          keepAlive: true,
          auth: true
        }
      }, {
        path: 'pendingApproval',
        component: () => import('@/page/Finance/aroundBorrowingManagement/pendingApproval.vue'),
        name: '周边借款管理   /待审批',
        meta: {
          keepAlive: true,
          auth: true
        }
      }]
    }, {
      path: '/bankStatement',
      component: () => import('@/page/Finance/bankStatement/index.vue'),
      name: '银行流水单管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/bankStatement/payDetails',
      component: () => import('@/page/Finance/bankStatement/payDetails.vue'),
      name: '银行流水单管理  /微信支付宝明细',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    // 建设银行单独微信支付宝明细(建行的微信支付宝明细与其他微信支付宝明细字段不同)
    {
      path: '/bankStatement/constructionPayDetails',
      component: () => import('@/page/Finance/bankStatement/constructionPayDetails.vue'),
      name: '建设银行流水单管理  /微信支付宝明细',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/bankStatement/bankZCK',
      component: () => import('@/page/Finance/bankStatement/bankZCK.vue'),
      name: '银行流水单管理  /设置暂存款',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '*',
      redirect: '/userList'
    }
  ],
})
