import Vue from 'vue'
let { $http, GLOBAL, $message, $isArray }= Vue.prototype;

// 获取未报账的报账单
export const getPreCheckSheetByPlanID= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/getforother", { id })
    .then(res => {
      let { isSuccess, object, result }= res.data;
      if(!isSuccess) return reject('获取报账信息失败'+ (result.message || ''));
      resolve(object);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
    })
  })
}

// 获取已报账的报账单
export const getCheckSheetByPlanID= function(id){
  console.log('getCheckSheetByPlanID')
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/getforplan", { id })
    .then(res => {
      let { isSuccess, object, result }= res.data;
      if(!isSuccess) return reject('获取报账信息失败'+ (result.message || ''));
      resolve(object);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
    })
  })
}

export const getCheckSheetByID= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/get", { id })
    .then(res => {
      let { isSuccess, object, result }= res.data;
      if(!isSuccess) return reject('获取报账信息失败'+ (result.message || ''));
      resolve(object);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
    })
  })
}

export const postCheckSheet= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/insert", { 
      object
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) throw '新增报账信息失败';
      resolve(object);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
    })
  })
}


// 模糊查询供应商
export const getSupplierlist= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/universal/supplier/api/supplierlist",{
      object
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('模糊查询供应商失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

