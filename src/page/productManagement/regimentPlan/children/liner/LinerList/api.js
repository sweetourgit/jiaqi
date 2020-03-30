import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

// 保存sku库存价格多个
export const getSkuPlanListPage= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/listpage", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) return reject('查询团期计划列表失败');
      resolve(data);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// 保存sku库存价格多个
export const updateSkuPlanSaleStatus= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/updstatus", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) return reject('查询团期计划列表失败');
      resolve(data);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}