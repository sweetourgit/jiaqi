import Vue from 'vue'
import { storageLocal } from '@/js/libs/storage.js'
let { $http, GLOBAL, $message, $isArray }= Vue.prototype;


export const getDicOptions= function(enumname){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/dictionaryget?enumname=${enumname}`)
    .then(res => {
      let { isSuccess, objects, result }= res.data;
      if(!isSuccess) throw ('供应商查询失败'+ (result.message || '') );
      resolve(objects);
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

export const getSupplierList= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/supplierpage`, {
      ...object
    })
    .then(res => {
      let { isSuccess, objects, result, total }= res.data;
      if(!isSuccess) {
        return reject();
      }
      resolve({ objects, total });
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

export const getSupplierById= function(id){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/supplierget`, {
      id
    })
    .then(res => {
      let { isSuccess, object, result }= res.data;
      if(!isSuccess) throw ('供应商查询失败'+ (result.message || '') );
      resolve(object);
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

export const checkSupplierCode= function(supplierCode){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/isexistsuppliercode`, {
      supplierCode
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject();
      resolve();
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

export const checkSupplierName= function(name){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/isexistsuppliername`, {
      name
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) return reject();
      resolve();
    })
    .catch(err => {
      console.error(err);
      err && $message.error(err.toString());
    })
  })
}

export const postSupplier= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/supplierinsert`, {
      object
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) throw ('新增供应商失败');
      resolve($message.success('新增供应商成功'));
    })
    .catch(err => {
      console.log(err);
      $message.error('新增供应商失败');
    })
  })
}

export const putSupplier= function(object){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrc + `/universal/supplier/api/suppliersave`, {
      object
    })
    .then(res => {
      let { isSuccess }= res.data;
      if(!isSuccess) throw ('修改供应商失败');
      resolve($message.success('修改供应商成功'));
    })
    .catch(err => {
      console.log(err);
      $message.error('修改供应商失败');
    })
  })
}

class OrgMaker {
  constructor(){
    this._count= 3;  
    this._queue= []; 
  }

  make(){
    this.test= 100;
    let result= { id: 204, children: [] };
    let cache= storageLocal.get('organList');
    if(cache) return Promise.resolve(cache);
    return this.getOrg(result).then(res => {
      storageLocal.set('organList', res);
      return Promise.resolve(res);
    })
  }

  getOrg(parent){
    let { id: ParentID }= parent;
    return new Promise((resolve, reject) => {
      $http.post(GLOBAL.serverSrc + `/org/api/deptlist`, {
        object: { ParentID }
      })
      .then(res => {
        let { isSuccess, objects }= res.data;
        if(!isSuccess) throw ('修改供应商失败');
        this.backCount();
        if(objects.length) parent.children= objects;
        this._queue.forEach(item => item.func());
        Promise.all([
          ...objects.map((object) => this.mapCb(object))
        ]).then(resolve.bind(this, parent))
      })
      .catch(err => {
        console.log(err);
        $message.error('修改供应商失败');
        resolve();
      })
    })
  }

  mapCb(org){
    if(this._count> 0){
      this._count--;
      return this.getOrg(org);
    }
    return new Promise((resolve, reject) => {
      if(org.isLeaf=== 1) return resolve();
      let func= this.delay.bind(this, org, resolve)
      this._queue.push({ id: org.id, func });
    })
  }

  delay(org, resolve){
    if(this._count<= 0) return;
    this._count--;
    this.queueRemove(org.id);
    this.getOrg(org).then(resolve);
  }

  backCount(){
    if(this._count>= 3) return;
    this._count++;
  }

  queueRemove(id){
    let index= this._queue.findIndex(el => el.id=== id);
    if(index=== -1) return console.error('queueRemove find none');
    this._queue.splice(index, 1);
  }
}

export const orgMaker= new OrgMaker();