export class RelationBar {

  static root= null;
  static currentSelect= null;
  
  constructor({ isRoot, info= {}, child }= {}){
    this.state= !!isRoot;
    this.expended= false;
    this.hoverd= false;
    this.selected= false;
    this.info= info;
    this.child= child;

    RelationBar.root= !!isRoot;
  }

}

export const relationBarMaker= function(source, isRoot){
  if(!source) return null;
  console.log(source)
  let { trees, ...info }= source;
  return new RelationBar({
    isRoot,
    info,
    child: relationBarMaker(trees[0])
  })
}