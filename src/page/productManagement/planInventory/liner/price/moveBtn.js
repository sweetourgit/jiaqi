class MoveBtn {
  constructor(){
    this.store= [];
    this.contaier= null;
    this.init();
  }

  inserted(el, binding, vnode) {
    this.push.call(this, (this.getStoreEl(el)))
  }

  componentUpdated(el, binding, vnode) {
    console.log(el)
    this.push(this.getStoreEl(el));
  }

  unbind(el, binding, vnode) {
    this.pop(el);
  }

  init(){
    this.contaier= document.querySelector('.el-main');
    this.contaier.addEventListener('scroll', this.scrollCb.bind(this)); 
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
    return { dom: el, top, left, height, width, hidden: false };
  }

  push(storeEl){
    let index= this.store.findIndex(el => el.dom=== storeEl.dom);
    if(index=== -1) return this.store.push(storeEl);
    this.store.splice(index, 1, storeEl);
  }

  pop(dom){
    let index= this.store.findIndex(el => el.dom=== dom);
    this.store.splice(index, 1);
  }
}

export default MoveBtn
