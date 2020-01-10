import { getNode } from './api'

export class RelationBar {

  static root= null;
  static currentSelect= null;
  
  constructor({ isRoot, info= {}, child, subChild }= {}){
    this.state= !!isRoot;
    this.expended= false;
    this.hoverd= false;
    this.selected= false;
    this.isLoading= false;

    this.info= info;
    this.child= child;
    this.subChild= subChild;
    this.vm= null;

    if(isRoot) RelationBar.root= this;
  }

  select(){
    let bol= this.selected;
    if(bol) return this.setSelected(false);
    if(RelationBar.currentSelect && RelationBar.currentSelect!== this) 
      RelationBar.currentSelect.setSelected(false);
    this.setSelected(true);
    RelationBar.currentSelect= this;
  }

  awakeChild(){
    let child;
    let { id }= this.info;
    if(this.child){
      console.log('child exsit')
      this.child.state= !this.child.state;
      return this.expended= this.child.state;
    }
    this.isLoading= true;
    getNode(id)
    .then(res => {
      let { trees }= res;
      child= relationBarMaker(trees[0]);
      if(!child){
        this.isLoading= false;
        return this.expended= !this.expended;
      }
      child.state= true;
      this.child= child;
      this.subChild= trees[1];
      this.expended= true;
      this.isLoading= false;
    })
    .catch(err => {
      this.isLoading= false;
    })
  }

  // 根bar挂载vm用来提交动作
  mountVm(vm){
    this.vm= vm;
  }

  setSelected(bol){
    this.selected= bol;
    this.wakeUpDisplay(bol);
  }

  wakeUpDisplay(bol){
    let vm= RelationBar.root.vm;
    vm.$emit('wake-up', bol && this);
  }
}

export const relationBarMaker= function(source, isRoot){
  if(!source) return null;
  let { trees, ...info }= source;
  return new RelationBar({
    isRoot,
    info,
    child: relationBarMaker(trees[0]),
    subChild: trees[1]
  })
}