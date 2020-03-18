class MoveBtn {
  constructor(){
    this.store= [];
    this.contaier= null;
    this.scrollCbBind= null;
    this.init();
  }

  bind(el, binding, vnode) {
    console.log('bind');
    console.log(el.getBoundingClientRect().left)
    let { top, bottom, right, left, position }= window.getComputedStyle(el);
    console.log(top, bottom, right, left, position)
    this.push(el);
  }

  inserted(el, binding, vnode) {
    console.log('inserted');
    console.log(el.getBoundingClientRect().left)
    let { top, bottom, right, left, position }= window.getComputedStyle(el);
    console.log(top, bottom, right, left, position)
    this.push(el);
  }

  componentUpdated(el, binding, vnode) {
    console.log(el.getBoundingClientRect().left)
    this.push(el);
  }

  unbind(el, binding, vnode) {
    this.pop(el);
  }

  init(){
    this.contaier= document.querySelector('.el-main');
    this.scrollCbBind= this.scrollCb.bind(this);
    // this.contaier.addEventListener('scroll', ); 
  }

  destroy(){
    this.store= [];
  }

  scrollCb(){
    let scrollTop= this.contaier.scrollTop;
    this.store.forEach(el => {
      let { dom, top, left, height, width, hidden }= el;
      if(scrollTop>= top+ height && !hidden){
        dom.style.position= 'fixed';
        dom.style.top= top+ 'px';
        dom.style.left= left+ 'px';       
        el.hidden= true;
        return;
      }
      if(scrollTop< top+ height && hidden){
        dom.style.position= 'relative';
        dom.style.top= null;
        dom.style.left= null;       
        el.hidden= false;
        return;
      }
    })
  }

  getStoreEl(el){
    let { top, left, height, width }= el.getBoundingClientRect();
    let { top: styleTop, bottom:styleBottom, right:styleRight, left:styleLeft, position }= window.getComputedStyle(el);
    return { dom: el, top, left, height, width, inFixed: false, styleTop, styleBottom, styleRight, styleLeft, position };
  }

  push(el){
    let index= this.store.findIndex(storeEl => storeEl.dom=== el);
    let storeEl= this.getStoreEl(el);
    if(index=== -1) return this.store.push(storeEl);
    this.store.splice(index, 1, storeEl);
  }

  pop(el){
    let index= this.store.findIndex(storeEl => storeEl.dom=== el);
    this.store.splice(index, 1);
  }
}

export default MoveBtn
