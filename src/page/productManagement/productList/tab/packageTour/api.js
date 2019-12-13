import Vue from 'vue'
let { $http, GLOBAL, $message, $isArray }= Vue.prototype;

// 条件分页产品列表
export const getProductList= function(conditions){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/team/api/teamsearch`, 
      conditions
    )
    .then(res => {
      let { isSuccess, objects, total }= res.data;
      if(!isSuccess) throw '获取产品列表失败';
      resolve({ objects, total });
    })
    .catch(err => {
      console.log(err);
      $message.error('获取产品列表失败');
    })
  })
}

// 出发地目的地模糊查询
export const getFuzzyAction= function(areaName){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
      object: {
        areaName
      }
    }).then(res => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) throw '地址模糊查询失败';
      return resolve(objects);
    })
    .catch(err => {
      console.log(err);
      $message.error('地址模糊查询失败');
    })
  });
}