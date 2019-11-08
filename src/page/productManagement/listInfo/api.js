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

// 添加team
export const insertAction= function(object){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + "/team/api/teaminsert", {
      object
    }).then((res) => {
      let { isSuccess, result }= res.data;
      if(!isSuccess) return reject('新增产品失败');
      return resolve(result);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const saveAction= function(object){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + "/team/api/teamsave", {
      object
    }).then((res) => {
      let { isSuccess, result }= res.data;
      if(!isSuccess) return reject('修改产品失败');
      return resolve();
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

// 获取地点
export const getFuzzyAction= function(areaName){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
      "object": {
        areaName
      }
    }).then(res => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取地点失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  });
}

// 获取运营标签
export const getGlabelfuzzyAction= function(labelName){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/universal/olabel/api/olabelfuzzy', {
      "object": {
        labelName
      }
    }).then(res => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取运营标签失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  });
}

// 出游人群
export const getCrowdlistAction= function(){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + "/universal/crowd/api/crowdlist", {
      object: {
        isDeleted: 0
      }
    },{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }).then(res => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取出游人群失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 主题
export const getThemelistAction= function(){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + "/universal/theme/api/themelist", {
      object: {
        isDeleted: 0
      }
    },{
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    }).then(res => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取主题失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}