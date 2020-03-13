import TableInputerFactory from './TableInputer'

class TableInputerManager {
  constructor(){
    this.inited= false;
    this.route= ''
    this.store= {};
  }

  init(route){
    this.inited= true;
    this.route= route;
  }

  reset(){
    this.store= {};
    this.inited= false;
    this.route= '';
  }

  push(block, vm){
    if(!(block in this.store)) this.store[block]= [];
    this.store[block].push(vm);
    console.log(this.store)
  }

  pop(block, vm){
    let index;
    let store= this.store[block];
    index= store.findIndex(el => el=== vm);
    store.splice(index, 1);
  }

  // 根据table数组中的位置获得tableInputer实例
  getVm(table, column, index){
    return this.store[table+ '_'+ column][index]
  }

  // 根据tableInputer实例获得在table数组中的下标
  getIndex(block, vm){
    return this.store[block].findIndex(el => el=== vm);
  }
}

const manager= new TableInputerManager();
const TableInputer= TableInputerFactory(manager)

export {
  TableInputer, manager
}