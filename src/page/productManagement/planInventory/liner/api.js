// /linerapi/v1/product/product-deliver/saveprice 邮轮产品接送设置售卖价格
import mock from 'mockjs'
import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

// 保存sku库存价格多个
export const saveSkuStocks= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-stock/saveskustock", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('保存计划失败'+ (message || ''));
      resolve(data.list);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

export const singleSkuInfo= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-stock/info", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('保存计划失败'+ (message || ''));
      resolve(data);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// 获取产品下所有sku
export const skuListAll= function(payload){
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
export const saveSkuAttribute= function(payload){
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
export const skuOnlineOffline= function(payload){
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
export const getTourAround= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/gettouraround", payload)
    .then(res => {
      let { code }= res.data;
      if(code!== 200) return reject();
      resolve();
    })
  })
}

// 获取日历信息
export const getCalendar= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-stock/listall", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('查询团期库存日历失败'+ (message || ''));
      resolve(data.list);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// 保存保险
export const saveInsure= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product-insure/saveinsure", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('保存保险失败'+ (message || ''));
      resolve(data.insure_id);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

export const insureOnOffLine= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product-insure/onlineoffline", payload)
    .then(res => {
      let { code, message }= res.data;
      if(code!== 200) throw ('更改保险上/下线状态失败'+ (message || ''));
      resolve();
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

// 获取产品下保险李彪
export const insureListAll= function(payload){
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

export const deliverListAll= function(payload){
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

export const deliverOnOffLine= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product-deliver/onlineoffline", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('更改接送上/下线状态失败'+ (message || ''));
      resolve();
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

export const saveDeliverPrice= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/product/product-deliver/saveprice", payload)
    .then(res => {
      let { code, message }= res.data;
      if(code!== 200) return reject();
      resolve();
    })
  })
}

// 删
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

export const getLinerCabinType= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-cabin/listall", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('查询产品下接送列表失败'+ (message || ''));
      resolve(data.list);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
  // console.warn('fake getLinerCabinType');
  // return Promise.resolve({

  // });
}