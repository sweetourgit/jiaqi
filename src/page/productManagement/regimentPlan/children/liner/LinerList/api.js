import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;
import { storageSession } from '@/js/libs/storage'

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

const userListFinder= function(){
  let cache= [];
  return function(id, source){
    let finder= cache.find(el => el.id=== id);
    if(finder) return finder;
    finder= source.find(el => el.id=== id);
    cache.push(finder);
    return finder;
  }
}()
// 根据uid查询用户
export const getUserlist= function(id){
  let list= storageSession.get('USER_LIST_CACHE');
  return list? Promise.resolve(userListFinder(id, list)): new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/org/api/userlist", {
      object: { id }
    })
    .then(res => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('查询用户列表失败');
      storageSession.set('USER_LIST_CACHE', objects);
      resolve(userListFinder(id, objects));
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}