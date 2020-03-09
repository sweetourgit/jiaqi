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

  // 对外方法，获得tableInputer实例
  getVm(table, column, index){
    return this.store[table+ '_'+ column][index]
  }
}

const manager= new TableInputerManager();
const TableInputer= TableInputerFactory(manager)

export {
  TableInputer, manager
}