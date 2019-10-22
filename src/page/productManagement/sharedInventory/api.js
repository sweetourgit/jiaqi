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