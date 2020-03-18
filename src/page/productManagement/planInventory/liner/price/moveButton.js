class MoveBtn {

  constructor(){
    this.store= [];
  }

  inserted(el, binding, vnode) {
    let parentNode= el.parentNode;
    if(!parentNode.watchers){
      this.store.push(parentNode);
    }
  }

  componentUpdated(el, binding, vnode) {
    console.log(el.parentNode.watchers)
    this.push(this.getStoreEl(el));
  }

  unbind(el, binding, vnode) {
    this.pop(el);
  }

}

export default MoveBtn