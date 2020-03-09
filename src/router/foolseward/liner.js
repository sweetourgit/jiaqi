/**
 * @description: 邮轮路由
 */

const liner= [

  /**
   * @description: 团期库存
   */
  {
    path: '/product/planInventory/liner/basic',
    component: () => import('@/page/productManagement/planInventory/liner/basic'),
    name: '产品管理  /团期库存/ 邮轮/ SKU',
    meta: {
      keepAlive: true,
      auth: true
    }
  },
  {
    path: '/product/planInventory/liner/price',
    component: () => import('@/page/productManagement/planInventory/liner/price'),
    name: '产品管理  /团期库存/ 邮轮/ SKU价格',
    meta: {
      keepAlive: true,
      auth: true
    }
  }
]

export default liner
