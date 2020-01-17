import { storageLocal } from '@/js/libs/storage'

class BackupStorage {
  constructor(){
    this.storage= storageLocal;
    this.prefix= "CheckSheetDetail_";
    this.pool= this.storage.get(this.prefix+ 'Pool') || [];

    this.POOL_SIZE= 5;
  }

  preSet(planID){
    let key= this.prefix+ planID;
    let cache= this.get(planID);
    let removed;
    // 有缓存则替换
    if(cache){
      this.refresh(key);
      return key;
    }
    // 无缓存
    if(this.pool.length>= this.POOL_SIZE){
      removed= this.pool.pop();
      this.storage.remove(removed);
    }
    return key;
  }

  set(planID, val, expire= '1M'){
    let key= this.preSet(planID);
    this.pool.splice(0, 0, key);
    this.storage.set(key, val, expire);
    this.setPool();
  }

  get(planID){
    return this.storage.get(this.prefix+ planID);
  }

  refresh(key){
    let index= this.pool.findIndex(el => el=== key);
    if(index=== -1 || index=== 0) return;
    this.pool.splice(index, 1);
    this.pool.splice(index, 0, key);
    this.setPool();
  }

  setPool(){
    this.storage.set(this.prefix+ 'Pool', this.pool, '1M');
  }
}

/**
 * @description: @1377 创建后的提交被驳回, 应当保留报账单内容
 * 1. 只有type为'创建'时候会写入缓存(提交时),读取缓存
 * 2. 缓存有效期1个月, 最多存在3个缓存
 */
const BackupMixin= function(){

  let backupStorage= new BackupStorage();
  
  return {
    methods: {
      cacheCheckSheet(checkSheet){
        let { planID, guideName, localName, otherIncomes, expenses, incomes }= checkSheet;
        backupStorage.set(planID, { guideName, localName, otherIncomes, expenses, incomes: this.getIncomesCache(incomes) });
      },
      
      getCacheCheckSheet(planID, origin){
        let cache= backupStorage.get(planID);
        if(!cache) return origin;
        let { incomes, ...others }= cache;
        incomes && this.resetIncomesCache(origin.incomes, incomes);
        Object.assign(origin, others);
      },

      getIncomesCache(incomes){
        let result= [];
        for(let i= 0; i< incomes.length; i++){
          let { orderCode, mark }= incomes[i]
          mark && result.push({ orderCode, mark });
        }
        return result;
      },

      resetIncomesCache(origin, cache){
        cache.forEach(el => {
          let result= origin.find(item => item.orderCode=== el.orderCode);
          if(!result) return;
          Object.assign(result, el);
        })
      }
    }
  }
}

export default BackupMixin