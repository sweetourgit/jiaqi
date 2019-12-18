import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

/**
 * @description: 字典接口
 */
export const getOrderAction= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/order/all/api/orderget`, {
      id
    })
    .then(res => {
      let { isSuccess, object, result }= res.data;
      if(!isSuccess) throw ('订单获取失败'+ (result.message || '') );
      resolve(object);
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

export const getEnrollsAction= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/teamquery/get/api/enrolls`, {
      id
    })
    .then(res => {
      let { isSuccess, objects, result }= res.data;
      if(!isSuccess) throw ('报名类型获取失败'+ (result.message || '') );
      resolve(objects);
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

export const getTeampreviewAction= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/teamquery/get/api/teampreview`, {
      id
    })
    .then(res => {
      let { isSuccess, object, result }= res.data;
      if(!isSuccess) throw ('跟团游信息获取失败'+ (result.message || '') );
      resolve(object);
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}