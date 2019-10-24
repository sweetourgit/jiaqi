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

export const inventorydeleteAction= function(id){
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

export const inventorysaveAction= function(object){
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




// this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorysave', {
//   'object': {
//     'id': this.addStocks.id,
//     'name': this.addStocks.name,
//     'count': this.addStocks.count,
//     'averageCost': this.addStocks.averageCost == '' ? 0 : this.addStocks.averageCost,
//     "date": this.addStocks.date,
//     "share": 1,
//     "orgID": 0,
//   }
// }).then(res => {
//   this.dialogStock = false;
//   this.handList();
//   this.$message({
//     message: '更改成功',
//     type: 'success'
//   });
// })