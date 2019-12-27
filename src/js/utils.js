import Vue from 'vue'
import axios from 'axios'

/**
 * @description: 简易版深拷贝，不可拷贝循环引用结构
 */
Vue.prototype.$deepCopy= function(obj){
  return JSON.parse(JSON.stringify(obj))
}

Vue.prototype.$isNull= function(val){
  val+= '';
  return !val || val=== 'undefined' || val=== 'null' || val=== 'false';
}

/**
 * @description: 防抖函数
 */
Vue.prototype.$debounce = function(func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  var later = function() {
    var last = new Date().getTime() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function() {
    context = this;
    args = arguments;
    timestamp = new Date().getTime();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
function isArray (obj) {
  return Object.prototype.toString.call(obj)=== '[object Array]'
}
Vue.prototype.$isObject= isObject;
Vue.prototype.$isArray= isArray;



/**
 * @description: 比较两个对象是否宽松相等(不同指针，相同属性)
 */
Vue.prototype.$checkLooseEqual= function (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return Vue.prototype.$checkLooseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return Vue.prototype.$checkLooseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

Vue.prototype.$picDownloader= function(url, name){
  if(!url || !name) return console.error('param url and name is required');
  this.$message.info('文件下载中...');
  axios({
    method: 'post',
    url: 'http://118.25.222.233:9001/download',
    // url: 'http://127.0.0.1:9001/download',
    data: { url },
    responseType: 'blob'
  })
  .then(res => {
    let type = 'application/octet-stream';
    let URL = window.URL || window.webkitURL;
    console.log(URL,"ahhah")
    let blob = new Blob([ res.data ], { type });
    let src = URL.createObjectURL(blob);
    let element = document.createElement('a');
    element.href = src;
    element.download = name;
    document.body.appendChild(element)
    element.click()
    element.remove();
    this.$message.success('文件下载完成');
  })
}