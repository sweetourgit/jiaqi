// /linerapi/v1/product/product-deliver/saveprice 邮轮产品接送设置售卖价格

import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

// 获取产品下所有sku
export const skuListAllAction= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku/listall", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('查询产品下SKU列表失败'+ (message || ''));
      resolve(data.list);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// 保存SKU属性
export const saveSkuAttributeAction= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku/saveskuattribute", payload)
    .then(res => {
      let { code, message }= res.data;
      if(code!== 200) throw ('修改SKU属性失败'+ (message || ''));
      resolve();
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// SKU上下线
export const skuOnlineOfflineAction= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku/onlineoffline", payload)
    .then(res => {
      let { code, message }= res.data;
      if(code!== 200) throw ('操作失败'+ (message || ''));
      resolve();
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// 判断SKU团号是否存在
export const getTourAroundAction= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/gettouraround", payload)
    .then(res => {
      let { code }= res.data;
      if(code!== 200) return reject();
      resolve();
    })
  })
}

// 获取产品下保险李彪
export const insureListAllAction= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product-insure/listall", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('查询产品下保险列表失败'+ (message || ''));
      resolve(data.list);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

export const deliverListAllAction= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product-deliver/listall", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('查询产品下接送列表失败'+ (message || ''));
      resolve(data.list);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

export const getLinerId= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product/getproductbasic", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('查询产品下接送列表失败'+ (message || ''));
      resolve(data.list);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}