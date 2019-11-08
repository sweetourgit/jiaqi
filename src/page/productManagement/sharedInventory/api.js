// data采用20191010的int形式
export const inventorylistAction= function(date){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorylist', {
      object: {
        share: 1,
        date
      }
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取共享库存预览失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const inventoryAction= function(inventoryID){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/list', {
      object: {
        loadPlan_Enroll: true,
        inventoryID
      }
    }).then((res) => {
      let { isSuccess, objects }= res.data;
      if(!isSuccess) return reject('获取共享库存预览失败');
      return resolve(objects);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const inventoryinsertAction= function(object){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryinsert', {
      object
    }).then((res) => {
      let { isSuccess, id }= res.data;
      if(id == 0) return reject('添加库存失败，库存名重复');
      if(!isSuccess) return reject('添加库存失败');
      return resolve(id);
    }).catch((err) => {
      reject(err);
    })
  })
}

export const deleteInventoryAction= function(id){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorydelete', {
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

export const updateInventoryAction= function(object){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorysave', {
      object
    }).then((res) => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject('修改库存失败');
      return resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

export const getInventorydetailAction= function(id){
  return new Promise((resolve, reject) => {
    this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/inventorydetail', {
      id
    }).then((res) => {
      let { isSuccess, plans, object }= res.data;
      if(!isSuccess) return reject('获取库存详细信息失败');
      return resolve({ plans, object });
    }).catch((err) => {
      reject(err);
    })
  })
}