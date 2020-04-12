import mock from 'mockjs'
import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

// 查询团期计划详情
export const getSkuPlanInfo= function(id){
  return new Promise(resolve => {
    return resolve({
      product: {},
      departure: [],
      destination: [],
      deliver: [],
      insure: [],
      price: [
        {
          id: 1,
          cabin_id: 3,
          title: '拼住总统A',
          min_stay: 2,
          max_stay: 4,
          room_stock: 100,
          adult_same_price: 100,
          adult_straight_price: 200,
          line_status: 1
        },
        {
          id: 2,
          cabin_id: 2,
          title: '整间豪华大床房B',
          min_stay: 3,
          max_stay: 5,
          room_stock: 200,
          adult_same_price: 120,
          adult_straight_price: 300,
          line_status: 1
        },
      ]
    })
  })
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/info", { id })
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) return reject('查询团期计划详情失败');
      resolve(data);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// 查询产品
export const getProductInfo= function(product_id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product/listall", { product_id })
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) return reject('查询产品详情失败');
      resolve(data.list[0]);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

/*
// 直客销售补全
.post(this.GLOBAL.serverSrc + "/org/api/userlist", {
  object: {
    name: queryString1,
    isDeleted: 0
  }
})

// 商户销售
.post(
  this.GLOBAL.serverSrc + "/universal/localcomp/api/PeerUser_AdminList",
  {
    object: {
      localCompID: this.productPos,
      jqUserType: 2,
      state:2,
      isDeleted:0
    }
  }
)

 .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/get", {
            id: this.productPos
          })

// 商户模糊
.post(this.GLOBAL.serverSrc + "/universal/localcomp/api/listname", {
  object: {
    selName: queryString3,
    isDeleted: 0,
    state: 2
  }
})

*/

