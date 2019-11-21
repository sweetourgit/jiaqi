import Vue from 'vue'
let { $http, GLOBAL }= Vue.prototype;
let baseUrl= GLOBAL.serverSrc;

// 根据父id获取子树所有节点
export const getSonTreeByPidAction= function(parentID){
  return new Promise((resolve, reject) => {
    $http.post(baseUrl + "/universal/area/api/areainforlist",{
      object: {
        parentID
      }
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return resolve([]);
      return resolve(objects);
    }).catch((err) => {
      console.error(err);
      reject('获取子节点失败');
    })
  })
}

// 获取下级的分页数据
export const getSonListAction= function(object, pageIndex, pageSize){
  return new Promise((resolve, reject) => {
    $http.post(baseUrl + "/universal/area/api/areainforpage",{
      object, pageIndex, pageSize
    }).then((res) => {
      let { isSuccess, objects, total }= res.data;
      if(!isSuccess) return resolve({ objects, total });
      return resolve({ objects, total });
    }).catch((err) => {
      console.error(err);
      reject('获取子节点失败');
    })
  })
}