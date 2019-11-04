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

// 获取人均结算价
export const getAverage= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/cost/api/getaverage",{
      id
    }).then((res) => {
      let { average }= res.data;
      return resolve(average);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 获取成本列表
export const getCostList= function(packageID){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/cost/api/list",{
      object: { packageID }
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取成本列表失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 修改毛利率
export const saveRate= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/cost/api/saverate",{
      object
    }).then((res) => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject('毛利率修改失败');
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

// 新增成本
export const addCost= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/cost/api/insert",{
      object
    }).then((res) => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject('新增成本失败');
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

// 修改成本
export const editCost= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/cost/api/save",{
      object
    }).then((res) => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject('修改成本失败');
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

// 删除成本
export const deleteCost= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/cost/api/delete",{
      id
    }).then((res) => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject('删除成本失败');
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

// 新增计划
export const addPlan= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/plan/api/insert",{
      "object": {
        'createTime': 0,
        "inventoryID": res.data.id,
        "packageID": item.data.person.packageID,
        "date": item.data.person.date,
        "groupCode": this.msgFather[0].codePrefix + '-' + item.data.person.date + '-' + this.msgFather[0].codeSuffix,
        "planEnroll": planEnroll,
        "regimentType": 1,
        'dateHous': item.data.person.dateHous
      }
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取月份计划失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}


// 获取指定月份所有计划
export const getCalendar= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/calendar/api/get",{
      object
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取月份计划失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 获取指定计划
export const getPlan= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/plan/api/get", {
      id
    }).then((res) => {
      let { isSuccess, object }= res.data;
      if(!isSuccess) return reject('获取指定计划失败');
      return resolve(object);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 新增非共享库存
export const addInventory= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/api/inventoryinsert", {
      object
    }).then((res) => {
      let { isSuccess, id }= res.data;
      if(!isSuccess) return reject('新增库存失败');
      return resolve(id);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 获取指定库存
export const getInventory= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/api/inventoryget", {
      id
    }).then((res) => {
      let { isSuccess, object }= res.data;
      if(!isSuccess) return reject('获取库存失败');
      return resolve(object);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 获取指定天库存
export const getInventoryList= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/api/inventorylist", {
      object
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取库存列表失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

// 合成报名类型
export const getEnrollTypeDictionary= function(){
  return new Promise((resolve, reject) => {
    // 先读缓存
    let ENROLL_TYPE_DIC= sessionStorage.getItem('ENROLL_TYPE_DIC');
    if(ENROLL_TYPE_DIC) return resolve(JSON.parse(ENROLL_TYPE_DIC));
    // 无缓存走api
    $http.post(GLOBAL.serverSrc + "/universal/enrolla/api/list", {
      object: {}
    }).then((resa) => {
      let { isSuccess, objects }= resa.data;
      if(!isSuccess) return reject('获取报名类型失败');
      let enrolla= objects;
      $http.post(GLOBAL.serverSrc + "/universal/enrollb/api/list", {
        object: {}
      }).then((resb) => {
        let { isSuccess, objects }= resb.data;
        if(!isSuccess) return reject('获取报名类型失败');
        let enrollb= objects;
        let result= [];
        enrolla.forEach(itema => {
          enrollb.forEach(itemb => {
            result.push({
              id: itema.id,
              name: itema.name+ itemb.name
            })
          })
        })
        sessionStorage.setItem('ENROLL_TYPE_DIC', JSON.stringify(result));
        return resolve(result);
      })
    }).catch((err) => {
      reject(err);
    })
  })
}
// 报名类型的逻辑，以enrolla的id为报名类型id，选项用a与b作迪塞尔积，a leftjoin b，用许a有b空的情况
// this.$http.post(this.GLOBAL.serverSrc + '/universal/enrolla/api/list', {
// this.$http.post(this.GLOBAL.serverSrc + '/universal/enrollb/api/list', {