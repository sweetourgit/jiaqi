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

// 上传出团通知书
export const uploadNotice= function(payload){
  let { plan_id, notice }= payload;
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/uploadnotice", {
      plan_id, notice
    })
    .then(res => {
      let { code, message }= res.data;
      if(code!== 200) return reject(`上传出团通知书失败${message}`);
      resolve(notice);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}

export const upload= function(formData){
  return new Promise((resolve, reject) => {
    $http({
      url: GLOBAL.serverSrc+ "/upload/obs/api/file", 
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData
    })
    .then(res => {
      return resolve(JSON.parse(res.data).paths[0]);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}