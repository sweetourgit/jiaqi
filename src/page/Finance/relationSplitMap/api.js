import Vue from 'vue'
let { $http, GLOBAL }= Vue.prototype;

export const getRoot= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + '/finance/payment/api/gettopid',
      { id }
    ).then((res) => {
      let { isSuccess, object }= res.data;
      if(!isSuccess) return reject();
      object.trees && object.trees.sort((a, b) => a.paymentType- b.paymentType);
      resolve(object);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const getNode= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + '/finance/payment/api/gettree',
      { id }
    ).then((res) => {
      let { isSuccess, object }= res.data;
      if(!isSuccess) return reject();
      console.log(object)
      object.trees && object.trees.sort((a, b) => a.paymentType- b.paymentType);
      resolve(object);
    }).catch((err) => {
      reject(err);
    })
  })
}