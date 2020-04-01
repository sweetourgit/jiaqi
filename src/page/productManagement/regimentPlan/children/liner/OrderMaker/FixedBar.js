import Vue from 'vue'
let uuid= Vue.prototype.$uuid;

const style = (el, prop) => {
  return typeof getComputedStyle !== 'undefined'
    ? getComputedStyle(el, null).getPropertyValue(prop)
    : el.style[prop]
}

const overflow = (el) => {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
}

const scrollParent = (el) => {
  if (!(el instanceof HTMLElement)) {
    return window
  }
  let parent = el
  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break
    }
    if (!parent.parentNode) {
      break
    }
    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent
    }
    parent = parent.parentNode
  }
  return window
}

let getScrollTop= (el) => {
  return 'scrollTop' in el ? el.scrollTop : el.pageYOffset;
}
let sonFunc= function(scrollTop){
  this.style.transform= `translateY(${scrollTop}px)`
}
let store= [];
Vue.directive('fixed-bar', {
  inserted(el, binding, vnode) {
    let parentNode;
    let pid;
    let sid;
    let queue;
    sid= el.dataset.fbid;
    if(sid) return;
    parentNode= scrollParent(el);
    pid= parentNode.dataset.fbid;
    if(!pid){
      pid= uuid();
      queue= [];
      parentNode.dataset.fbid= pid;
      parentNode.addEventListener('scroll', function(e){
        let value= getScrollTop(e.target);
        queue.forEach(el => el.func(value));
      })
      store.push({ fbid: pid, queue});
    }
    queue= store.find(el => el.fbid=== pid).queue;
    el.dataset.fbid= sid= uuid();
    el.dataset.fbpid= pid;
    queue.push({ fbid: sid, func: sonFunc.bind(el)}); 
  },
  unbind(el){
    let pid;
    let sid;
    let queue;
    let index;
    sid= el.dataset.fbid;
    pid= el.dataset.fbpid;
    queue= store.find(el => el.fbid=== pid).queue;
    index= queue.findIndex(el => el.fbid=== sid);
    queue[index]= null;
    queue.splice(index, 1);
  }
})