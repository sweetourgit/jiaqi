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

Vue.prototype.$printDom= function(dom){
  let doc;
  let iframe;
  iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');
  document.body.appendChild(iframe)
  doc = iframe.contentWindow.document;
  doc.write(dom.outerHTML);
  var styleStr = `
  @media print {
    @page {
      size: 210mm 297mm;
      size: 297mm 420mm;
    }
  }
  *{
    font-weight: normal;
    box-sizing: border-box;
  }
  table{
    width: 100%;
  }
  .print-ground{
    font-size: 14px;
    line-height: normal;
    text-align: center;
    font-weight: normal;
  }
  .print-ground>header .title{
    font-size: 18px;
  }
  .print-ground>header .time{
    line-height: 2.5;
    text-align: right;
  }
  .cell{
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    min-height: 23px;
    line-height: 23px;
    padding-right: 5px;
    padding-left: 5px;
  }
  .base{
    width: 10%;
    padding: 5px 0;
    border-top: 1px solid #000;
    border-left: 1px solid #000;
  }
  .label{
    background-color: #ccc;
    color: #000;
  }
  .base:last-child{
    border-right: 1px solid #000;
  }`
  let style = document.createElement("style");
  style.innerText = styleStr;
  doc.getElementsByTagName("head")[0].appendChild(style)
	doc.close();
	iframe.contentWindow.focus();
	iframe.contentWindow.print();
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

Vue.prototype.$dateFormate= function (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}