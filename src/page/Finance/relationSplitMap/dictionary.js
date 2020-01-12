import { getNode } from './api'

export class RelationBar {

  static root= null;
  static currentSelect= null;
  
  constructor({ isRoot, info= {}, child, brother, subChild }= {}){
    this.state= !!isRoot;
    this.expended= false;
    this.hoverd= false;
    this.selected= {
      up: false,
      down: false
    };
    this.isLoading= false;

    this.info= info;
    this.child= child;
    this.brother= brother;
    this.subChild= subChild;
    this.vm= null;

    if(isRoot) RelationBar.root= this;
  }

  unselect(sign){
    this.setSelected(sign, false);
    RelationBar.currentSelect= null;
  }

  select(sign){
    RelationBar.currentSelect && RelationBar.currentSelect.resetSelected();
    this.setSelected(sign, true);
    RelationBar.currentSelect= this;
  }

  resetSelected(){
    this.selected.up= false;
    this.selected.down= false;
  }

  setSelected(sign, bol){
    this.selected[sign]= bol;
    this.wakeUpDisplay(sign, bol);
  }

  /**
   * @description: 根节点和上节点点击会都显示,下节点只显示借款信息
   */
  wakeUpDisplay(sign, bol){
    let vm= RelationBar.root.vm;
    let isShowAll= RelationBar.root=== this || sign=== 'up';
    let data= isShowAll? this.info: this.brother;
    vm.$emit('wake-up', { data: bol && data, isShowAll });
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
      child= relationBarMaker(trees[0], trees[1]);
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
}

export const relationBarMaker= function(self, brother, isRoot){
  if(!self) return null;
  let { trees, ...info }= self;
  return new RelationBar({
    isRoot,
    info,
    child: relationBarMaker(trees[0], trees[1]),
    brother,
    subChild: trees[1]
  })
}