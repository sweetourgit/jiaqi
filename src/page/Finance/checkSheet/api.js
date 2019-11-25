import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

export const getCheckSheetList= function(conditions){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcPhp + "/api/v1/checksheet/bill/listpage", conditions)
    .then(res => {
      console.log(res)
    })
  })
}

// 模糊查询报账人
export const getOperByName= function(){
  return new Promise((resolve, reject) => {

  })
}

// 获取操作人员列表
export const getOperList= function(){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/org/api/userlist", {
      "object": {
        "id": 0,
        "createTime": '2019-08-23T03:03:10.386Z',
        "isDeleted": 0,
        "code": "",
        "mobile": "",
        "name": "",
        "email": "",
        "userCode": "",
        "passWord": "",
        "iDcard": "",
        "tourGuide": "",
        "sex": 0,
        "userType": 0,
        "userState": 0,
        "orgID": 0,
        "orgName": "",
        "user_Position": [
          {
            "id": 0,
            "userID": 0,
            "positionID": 0,
            "positionName": "",
            "isDefault": 0,
            "orgID": 0,
            "orgName": ""
          }
        ]
      }
    },{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    })
    .then(res => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取操作人列表失败');
      resolve(objects);
    })
    .catch(err => {
      if(typeof err=== 'string') return $message.error(err);
      console.error(err);      
    })
  })
}