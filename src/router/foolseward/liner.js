import RedirectParent from './RedirectParent.vue'

/**
 * @description: 邮轮路由
 */

export const liner= [

  /**
   * @description: 团期库存
   */
  {
    path: '/product/planInventory/liner/basic',
    component: () => import('@/page/productManagement/planInventory/liner/basic'),
    name: '产品管理 / 团期库存/ 邮轮/ SKU',
    meta: {
      keepAlive: true,
      auth: true
    }
  },
  {
    path: '/product/planInventory/liner/price',
    component: () => import('@/page/productManagement/planInventory/liner/price'),
    name: '产品管理 /团期库存 / 邮轮/ SKU价格',
    meta: {
      keepAlive: true,
      auth: true
    }
  }  
]

export const linerRegimentPlan= {
  path: 'liner',
  // name: '产品管理/ 团期计划/ 游轮',
  component: RedirectParent,
  redirect: '/regimentPlan/liner/list',
  meta: {
    keepAlive: true,
    auth: true
  },
  children: [
    {
      path: 'list',
      name: '产品管理/ 团期计划/ 游轮/ 列表',
      component: () => import('@/page/productManagement/regimentPlan/children/liner/LinerList'),
      meta: {
        keepAlive: true,
        auth: true
      }
    },
    {
      path: 'order',
      name: '产品管理/ 团期计划/ 游轮/ 下单',
      component: () => import('@/page/productManagement/regimentPlan/children/liner/OrderMaker'),
      meta: {
        keepAlive: true,
        auth: true
      }
    }
  ]
}
