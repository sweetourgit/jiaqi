import Vue from 'vue'
import Router from 'vue-router'
import userList from '@/page/account/userList/userList'
import userList1 from '@/page/account/userList/userList1'//临时文件
import organList from '@/page/account/organList/organList'
import role from '@/page/account/role/role'
import perList from '@/page/account/perList/perList'
import accountInfor from '@/page/perCenter/accountInfor/accountInfor'
import positionList from '@/page/account/positionList/positionList'
import login from '@/page/login/login'
import addRole from '@/page/account/role/addRole'
import addUser from '@/page/account/userList/addUser/addUser'
import cityList from '@/page/contentInfo/cityList/cityList'
import customArea from '@/page/contentInfo/customArea/customArea'
import scenicList from '@/page/contentInfo/scenicList/scenicList'
import labelList from '@/page/contentInfo/labelList/labelList'
import materialList from '@/page/contentInfo/materialList/materialList'
import hotelList from '@/page/contentInfo/hotelList/hotelList'
import supplierInfo from '@/page/contentInfo/supplierInfo/supplierInfo'
import productList from '@/page/productManagement/productList/productList'
import baseInfo from '@/page/productManagement/listInfo/listInfo'
import listInfoScenic from '@/page/productManagement/listInfoScenic/listInfoScenic'
import travelTemplate from '@/page/productManagement/travelTemplate/travelTemplate'
//团期计划
import regimentPlan from '@/page/productManagement/regimentPlan/regimentPlan'
import teamPlanList from '@/page/productManagement/regimentPlan/children/team/teamPlanList'
import scenicTicketingList from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingList'
import scenicTicketingDetails from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingDetails'
import scenicTicketingPledging from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingPledging'
import scenicTicketingBillReporting from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingBillReporting'
import sharedInventory from '@/page/productManagement/sharedInventory/sharedInventory'
import changePro from '@/page/productManagement/changePro/changePro'
import changeInfo from '@/page/productManagement/changeInfo/changeInfo'
import blacklist from '@/page/contentInfo/blacklist/blacklist'
import workFlowList from '@/page/contentInfo/workFlowList/workFlowList'//工作流接口查询管理
import merchantInfo from '@/page/contentInfo/merchantInfo/merchantInfo'
import merchantInfo1 from '@/page/contentInfo/merchantInfo/merchantInfo1'
import controlList from '@/page/contentInfo/priManagement/controlList'
import priList from '@/page/contentInfo/priManagement/priList'
import proList from '@/page/contentInfo/proList/proList'
import orderList from '@/page/orderManagement/orderList/orderList'
import externalOrderList from '@/page/orderManagement/externalOrderList/externalOrderList'
import canRecognition from '@/page/orderManagement/externalOrderList/canRecognition'
import noRecognition from '@/page/orderManagement/externalOrderList/noRecognition'
import noCost from '@/page/orderManagement/externalOrderList/noCost'
import recognitionMsg from '@/page/orderManagement/externalOrderList/recognitionMsg/recognitionMsg'
// import recognitionDo from '@/page/orderManagement/externalOrderList/recognitionMsg/recognitionDo'
import importHistory from '@/page/orderManagement/externalOrderList/importHistory'
import loanManagement from '@/page/Finance/loanManagement/loanManagement'
import advancePayment from '@/page/Finance/advancePayment/advancePayment'
import reimburseManagement from '@/page/Finance/reimburseManagement/reimburseManagement'
import arrearsManagement from '@/page/Finance/arrearsManagement/arrearsManagement'
import collectionManagement from '@/page/Finance/collectionManagement/collectionManagement'
import predepositManagement from '@/page/Finance/predepositManagement/predepositList'
import bankAccount from '@/page/Finance/bankAccount/bankAccount'
import pledgingManagement from '@/page/Finance/pledgingManagement/pledgingManagement'
import pledgingManagementApproval from '@/page/Finance/pledgingManagement/pledgingManagementApproval'
import pledgingManagementSee from '@/page/Finance/pledgingManagement/pledgingManagementSee'
import enrollTypeA from '@/page/contentInfo/enrollType/enrollTypeA'
import enrollTypeB from '@/page/contentInfo/enrollType/enrollTypeB'
import checkSheet from '@/page/Finance/checkSheet/checkSheet'
import packageTour from '@/page/productManagement/productList/tab/packageTour'
import scenicOrTicketList from '@/page/productManagement/productList/tab/scenicOrTicketList'
import listInfoEdit from '@/page/productManagement/listInfoScenic/listInfoEdit'
import balanceOrder from '@/page/Finance/balanceOrder/balanceOrder'
import distributorsInfo from'@/page/Finance/collectionManagement/distributorsInfo/distributorsInfo'
Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: 'login',
    }, {
      path: '/userList',
      component: userList,
      name: '用户列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/userList1',
      component: userList1,
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/organList',
      component: organList,
      name: '组织列表',
      meta: {
        keepAlive: true,
        title: '组织列表',
        auth: true
      }
    }, {
      path: '/role',
      component: role,
      name: '角色模板',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/addRole',
      component: addRole,
      name: "添加角色权限模板",
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
      component: accountInfor,
      name: '个人中心',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/login',
      component: login,
      meta: {
        keepAlive: false
      }
    }, {
      path: '/positionList',
      component: positionList,
      name: '职位列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/userList',
      component: userList,
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/userList/addUser',
      component: addUser,
      name: '用户添加',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/cityList',
      component: cityList,
      name: '区域列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/customArea',
      component: customArea,
      name: '自定义地区',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/scenicList',
      component: scenicList,
      name: '景点列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/labelList',
      component: labelList,
      name: '标签列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/materialList',
      component: materialList,
      name: '素材列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/hotelList',
      component: hotelList,
      name: '酒店列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/supplierInfo',
      component: supplierInfo,
      name: '供应商信息',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/merchantInfo',
      component: merchantInfo,
      name: '商户信息',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/merchantInfo1',
      component: merchantInfo1,
      name: '商户信息1',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/priList',
      component: priList,
      name: '功能列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/proList',
      component: proList,
      name: '权限列表',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/blacklist',
      component: blacklist,
      name: '黑名单',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/enrollTypeA',
      component: enrollTypeA,
      name: '报名类型A',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/enrollTypeB',
      component: enrollTypeB,
      name: '报名类型B',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/workFlowList',
      component: workFlowList,
      name: '工作流接口查询管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/controlList',
      component: controlList,
      name: '权限配置',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/productList',
      component: productList,
      name: '产品列表',
      children: [{
        path: 'packageTour',
        name: '跟团游',
        component: packageTour,
        meta: {
          keepAlive: true,
          auth: true
        },
      },
        {
          path: 'scenicOrTicketList',
          name: '景区/票务',
          component: scenicOrTicketList,
          meta: {
            keepAlive: true,
            auth: true
          },
        }
      ]
    }, {
      path: '/listInfo',
      component: baseInfo,
      name: '添加跟团游',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/listInfoScenic',
      component: listInfoScenic,
      name: '添加景区/票务',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/listInfoEdit',
      component: listInfoEdit,
      name: '编辑景区/票务',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/travelTemplate',
      component: travelTemplate,
      name: '出行模板',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/regimentPlan',
      component: regimentPlan,
      name: '团期计划',
      children: [{
          path: 'teamPlanList',
          name: '团期计划列表',
          component: teamPlanList,
          meta: {
            keepAlive: true,
            auth: true
          },
        },
        {
          path: 'scenicTicketingList',
          name: '景区/票务',
          component: scenicTicketingList,
          meta: {
            keepAlive: true,
            auth: true
          },
        }

      ]
    },
    {
      path: '/scenicTicketingDetails',
      name: '产品管理  /团期计划  /详情',
      component: scenicTicketingDetails,
      meta: {
        keepAlive: true,
        auth: true
      },
    }, {
      path: '/scenicTicketingPledging',
      name: '产品管理  /团期计划  /认款',
      component: scenicTicketingPledging,
      meta: {
        keepAlive: true,
        auth: true
      },
    }, {
      path: '/scenicTicketingBillReporting',
      name: '产品管理  /团期计划  /报账单',
      component: scenicTicketingBillReporting,
      meta: {
        keepAlive: true,
        auth: true
      },
    }, {
      path: '/orderList',
      component: orderList,
      name: '订单管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/externalOrderList',
      component: externalOrderList,
      name: '外部订单',
      children: [{
        path: 'canRecognition',
        name: '外部订单  /可认款报账',
        component: canRecognition,
        meta: {
          keepAlive: true,
          auth: true
        },
      }, {
          path: 'noRecognition',
          name: '外部订单  /未认收款',
          component: noRecognition,
          meta: {
            keepAlive: true,
            auth: true
          },
        }, {
          path: 'noCost',
          name: '外部订单  /无成本',
          component: noCost,
          meta: {
            keepAlive: true,
            auth: true
          },
        }
      ]
    }, {
      path: '/importHistory',
      component: importHistory,
      name: '外部订单管理/订单管理/导入历史',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/recognitionMsg',
      component: recognitionMsg,
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
      component: sharedInventory,
      name: '共享库存',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/changePro',
      component: changePro,
      name: '编辑产品',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/changeInfo',
      component: changeInfo,
      name: '行程信息',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/loanManagement',
      component: loanManagement,
      name: '无收入借款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/advancePayment',
      component: advancePayment,
      name: '预付款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/reimburseManagement',
      component: reimburseManagement,
      name: '报销管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/collectionManagement',
      component: collectionManagement,
      name: '收款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path:'distributorsInfo',
      component:distributorsInfo,
      name:'分销商收款',
      meta:{
        keepAlive:true,
        auth:true
      }
    },
    {
      path: '/arrearsManagement',
      component: arrearsManagement,
      name: '供应商欠款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/predepositManagement',
      component: predepositManagement,
      name: '客商预存款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: '/bankAccount',
      component: bankAccount,
      name: '银行账号管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/pledgingManagement',
      component: pledgingManagement,
      name: '财务认款管理',
      meta: {
        keepAlive: true,
        auth: true
      }
    },{
      path: '/balanceOrder',
      component: balanceOrder,
      name: '欠款订单管理',
      meta:{
        keepAlive:true,
        auth:true
      }
    },
    {
      path: '/pledgingManagementApproval',
      component: pledgingManagementApproval,
      name: '财务管理   / 财务认款管理   / 审批',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/pledgingManagementSee',
      component: pledgingManagementSee,
      name: '财务管理   / 财务认款管理   / 查看',
      meta: {
        keepAlive: true,
        auth: true
      }
    }, {
      path: '/checkSheet',
      component: checkSheet,
      name: '报账单',
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
