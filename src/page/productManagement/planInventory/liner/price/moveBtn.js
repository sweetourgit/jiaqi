import Vue from 'vue'

Vue.directive('move-btn', {
  inserted(el, binding, vnode) {
    let { top, left }= el.getBoundingClientRect();
    el.style.position= 'fixed';
    el.style.top= top+ 'px';
    el.style.left= left+ 'px';
    el.style.zIndex= 3000;
  }
})
