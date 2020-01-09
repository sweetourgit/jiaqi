export class RelationBar {

  static root= null;
  static currentSelect= null;
  
  constructor({ isRoot, info= {}, child, subChild }= {}){
    this.state= !!isRoot;
    this.expended= false;
    this.hoverd= false;
    this.selected= false;
    this.info= info;
    this.child= child;
    this.subChild= subChild

    if(isRoot) RelationBar.root= this;
  }

  select(){
    let bol= this.selected;
    if(bol) return this.selected= false;
    if(RelationBar.currentSelect) RelationBar.currentSelect.selected= false;
    this.selected= true;
    RelationBar.currentSelect= this;
  }
}

export const relationBarMaker= function(source, isRoot){
  if(!source) return null;
  console.log(RelationBar.root)
  let { trees, ...info }= source;
  return new RelationBar({
    isRoot,
    info,
    child: relationBarMaker(trees[0]),
    subChild: trees[1]
  })
}