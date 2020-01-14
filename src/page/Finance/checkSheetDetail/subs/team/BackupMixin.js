import { storageLocal } from '@/js/libs/storage'

class BackupStorage {
  constructor(){
    this.storage= storageLocal;
    this.prefix= "CheckSheetDetail_";
    this.pool= this.storage.get(this.prefix+ 'Pool') || [];

    this.POOL_SIZE= 5;
  }

  /**
   * @description: 
   * @param { CheckSheet } checkSheet 
   */
  set(checkSheet, val, expire= '1M'){
    let { planID }= checkSheet;
    let key= this.prefix+ planID;
    let cache= this.get(planID);
    // 有缓存则替换
    if(cache){
      this.refresh(key);
      return this.storage.set(key, val, expire);
    }
    // 无缓存
    if(this.pool.length>= this.POOL_SIZE) this.pool.pop();
    this.pool.splice(0, 0, key);
    this.storage.set(key, val, expire);
  }

  get(planID){
    return this.storage.get(this.prefix+ planID);
  }

  refresh(key){
    let index= this.pool.findIndex(el => el=== key);
    if(index=== -1 || index=== 0) return;
    this.pool.splice(index, 1);
    this.pool.splice(index, 0, key);
  }
}

/**
 * @description: @1377 创建后的提交被驳回, 应当保留报账单内容
 * 1. 只有type为'创建'时候会写入缓存(提交时),读取缓存
 * 2. 缓存有效期1个月, 最多存在3个缓存
 */
const BackupMixin= function(){
  let storage= new BackupStorage();
  
  return {

  }
}

export default BackupMixin