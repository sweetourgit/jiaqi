import Vue from 'vue'
let { $http, GLOBAL }= Vue.prototype;

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

export const getCostList= function(packageID){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/cost/api/list",{
      object: { packageID }
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return resolve([]);
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

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

export const getSupplierlist= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/universal/supplier/api/supplierlist",{
      object
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('模糊查询供应商失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

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

export const addPlan= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/plan/api/insert",{
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

export const savePlan= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/plan/api/save", {
      object
    }).then((res) => {
      let { isSuccess, object }= res.data;
      if(!isSuccess) return reject('获取指定计划失败');
      return resolve(object);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const deletePlan= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/plan/api/delete", {
      id
    }).then((res) => {
      let { isSuccess, result }= res.data;
      if(!isSuccess) return reject(result.message || '删除指定计划失败');
      return resolve();
    }).catch((err) => {
      reject(err.toString());
    })
  })
}

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

export const saveInventory= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/api/inventorysave", {
      object
    }).then((res) => {
      let { isSuccess, id }= res.data;
      if(!isSuccess) return reject('修改库存失败');
      return resolve(id);
    }).catch((err) => {
      reject(err);
    })
  })
}

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

export const deleteInventory= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + "/team/api/inventorydelete", {
      id
    }).then((res) => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject('删除库存失败');
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const getEnrollTypeDictionary= function(){
  return new Promise((resolve, reject) => {
    let ENROLL_TYPE_DIC= sessionStorage.getItem('ENROLL_TYPE_DIC');
    if(ENROLL_TYPE_DIC) return resolve(JSON.parse(ENROLL_TYPE_DIC));
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