import TableInputerFactory from './TableInputer'

class TableInputerManager {
  constructor(){
    this.inited= false;
    this.route= ''
    this.store= {};
  }

  push(block, vm){
    if(!(block in this.store)) this.store[block]= [];
    this.store[block].push(vm);
  }

  pop(block, vm){
    let index;
    let store= this.store[block];
    index= store.findIndex(el => el=== vm);
    store.splice(index, 1);
  }
}

const manager= new TableInputerManager();
const TableInputer= TableInputerFactory(manager)

export {
  TableInputer, manager
}