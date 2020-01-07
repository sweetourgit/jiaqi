export class RelationBar {

  static root= null;
  static currentSelect= null;
  
  constructor({ isRoot }= {}){
    this.state= true;
    this.expended= false;
    this.hoverd= false;
    this.selected= false;
    this.data= null;
    this.child= null;

    RelationBar.root= !!isRoot;
  }

}