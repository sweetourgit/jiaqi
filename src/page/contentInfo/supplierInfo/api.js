import Vue from 'vue'
let { $http, GLOBAL, $message, $isArray }= Vue.prototype;

/**
 * @description: 字典接口
 */
export const getDicOptions= function(enumname){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/dictionaryget?enumname=${enumname}`)
    .then(res => {
      let { isSuccess, objects, result }= res.data;
      if(!isSuccess) throw ('供应商查询失败'+ (result.message || '') );
      resolve(objects);
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

// 供应商分页接口
export const getSupplierList= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/supplierpage`, {
      ...object
    })
    .then(res => {
      let { isSuccess, objects, result, total }= res.data;
      if(!isSuccess) throw ('供应商查询失败'+ (result.message || '') );
      resolve({ objects, total });
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

// 供应商单独查询
export const getSupplierById= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/supplierget`, {
      id
    })
    .then(res => {
      let { isSuccess, object, result }= res.data;
      if(!isSuccess) throw ('供应商查询失败'+ (result.message || '') );
      resolve(object);
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

// 供应商编码是否重复
export const checkSupplierCode= function(supplierCode){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/isexistsuppliercode`, {
      supplierCode
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject();
      resolve();
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

// 新增供应商
export const postSupplier= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/supplierinsert`, {
      object
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) throw ('新增供应商失败');
      resolve($message.success('新增供应商成功'));
    })
    .catch(err => {
      console.log(err);
      $message.error('新增供应商失败');
    })
  })
}

// 修改供应商
export const putSupplier= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/suppliersave`, {
      object
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) throw ('修改供应商失败');
      resolve($message.success('修改供应商成功'));
    })
    .catch(err => {
      console.log(err);
      $message.error('修改供应商失败');
    })
  })
}