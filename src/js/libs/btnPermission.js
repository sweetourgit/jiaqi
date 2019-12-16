
import Vue from 'vue'
/**权限指令**/
Vue.directive('has', {
  bind: function (el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
       if(el.parentNode!=null){
         el.parentNode.removeChild(el);        
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