// 根据id获取team
export const teamgetAction= function(id){
  return new Promise((resolve, reject) => {
    this.$http.post(
      this.GLOBAL.serverSrc + "/team/api/teamget",
      {
        id
      }
    ).then((res) => {
      let { isSuccess, object }= res.data;
      if(!isSuccess) return reject('初始化失败');
      return resolve(object);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 获取guid
export const getGuidAction= function(){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + "/universal/utinity/api/getguid", {
      "object":true
    },{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }).then((res) => {
      let { isSuccess, object }= res.data;
      if(!isSuccess) return reject('获取GUID失败');
      return resolve(object);
    }).catch((err) => {
      reject(err);
    })
  })
}