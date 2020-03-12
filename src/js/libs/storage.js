function isNull(val){
  val+= '';
  return !val || val=== 'undefined' || val=== 'null' || val=== 'false';
}

/**
 * @description: 
 * @param {type} 'session/local'
 * @return: 
 */
const Storage = function (type) {
  this._isVue= true;
  this._storage= (type=== 'local'? localStorage: sessionStorage);
}

/**
 * @param {payload}: { key, val, expire: 过期时间 }
 */
Storage.prototype.set= function(key, val, expire){
  if(isNull(key) || isNull(val)){
    console.error(`key:${key} or val:${val} can not be null!`);
    return;
  }
  let _expireType= typeof expire;
  if(expire && _expireType!== 'number' && _expireType!== 'string'){
    console.error(`expire must be String or Number!`)
    return;
  }
  let _assign;
  if(expire) _assign= { expire, begin: new Date().getTime() }
  this._storage.setItem(key, JSON.stringify(Object.assign({ val }, _assign)));
}

Storage.prototype.get= function(key){
  let storage= JSON.parse(this._storage.getItem(key));
  if(isNull(storage)) return void 0;
  if(isNull(storage.expire)) return storage.val;
  let bol= this.checkExpire(storage.expire, storage.begin);
  //如果过期
  if(!bol){
    this._storage.removeItem(key);
    return void 0;
  }
  return storage.val; 
}

Storage.prototype.remove= function(key){
  this._storage.removeItem(key);
}

/**
 * @description: 如果expire是数字，则认为存的是未来的到期时间，不需要再加date
 */
Storage.prototype.checkExpire= function(expire, begin){
  if(isNull(expire) || isNull(begin)) return true;
  let _current= new Date().getTime();
  //如果是数字
  if(typeof expire=== 'number') return _current< expire;
  let _rate;
  let _timeStr= expire.substr(expire.length- 1);
  if(_timeStr=== 'Y') _rate= 365* 24* 60* 60* 1000;
  if(_timeStr=== 'M') _rate= 30* 24* 60* 60* 1000;
  if(_timeStr=== 'D') _rate= 24* 60* 60* 1000;
  if(_timeStr=== 'h') _rate= 60* 60* 1000;
  if(_timeStr=== 'm') _rate= 60* 1000;
  if(_timeStr=== 's') _rate= 1000;
  if(isNull(_rate)) return false;
  let _timeReal= parseFloat(expire)* _rate+ begin;
  if(isNaN(_timeReal)) return false;
  return _current< _timeReal;
}

export const storageLocal= new Storage('local');
export const storageSession= new Storage('session');