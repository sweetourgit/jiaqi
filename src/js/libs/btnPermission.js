
import Vue from 'vue'
Vue.directive('has', {
  bind: function (el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
       if(el.parentNode!=null){
         el.parentNode.removeChild(el);        
       }
    }
  }
});
Vue.directive('readonly', {
  bind: function (el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
       if(el.getElementsByTagName('input')[0]){
         el.getElementsByTagName('input')[0].readOnly="readonly";
         el.getElementsByTagName('input')[0].style.backgroundColor='#eee';
       }
    }
  }
});
//权限检查方法
Vue.prototype.$_has = function (value) {
  let isExist = false;
  let buttonpermsStr = JSON.parse(sessionStorage.getItem('butPermission'));
  if (buttonpermsStr == undefined || buttonpermsStr == null) {
    return false;
  }
  for (let i = 0; i < buttonpermsStr.length; i++){
    if (value == buttonpermsStr[i]) {
      isExist = true;
      break;
    }
  }
 return isExist;
};