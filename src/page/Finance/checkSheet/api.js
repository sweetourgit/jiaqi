import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

export const getCheckSheetList= function(conditions){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/finance/checksheet/api/page", conditions)
    .then(res => {
      console.log(res)
    })
  })
}