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

