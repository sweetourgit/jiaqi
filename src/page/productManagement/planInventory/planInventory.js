import Vue from 'vue'
let { $http, GLOBAL }= Vue.prototype;

// 获取产品套餐列表
export const getTeamListPackages= function(teamID){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/api/teampackagelist",{
      object: {
        teamID
      }
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取产品套餐失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 保存团号和清位时间
export const saveShort= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/package/saveshort",{
      object
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('设置团号失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 查看团号是否重复
export const codeIsExist= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/package/codeisexist",{
      object
    }).then((res) => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject();
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}