import Vue from 'vue'
import App from './App'
import router from './router'
import global from './components/tools/global'
import store from '@/store'
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'


// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

//axios
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$http = axios
Vue.prototype.qs = qs
import '@/style/main.css'
//global variable
Vue.prototype.GLOBAL = global
Vue.config.productionTip = false

// import '!style-loader!css-loader!less-loader!./style/libs/iconfont/iconfont.css'
//http request 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if(token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
 });
 // http response 拦截器,接口请求失败，重新登录
axios.interceptors.response.use(
  response => {
      return response;
  },
  error => {
      switch (error.response.status) {
             case 401:
              // 返回 401 清除token信息并跳转到登录页面
              localStorage.removeItem('token');
              router.replace({
                 path: 'login',
                 query: {redirect: router.currentRoute.fullPath}
         })
      }
      return Promise.reject(error.response)   // 返回接口返回的错误信息
  });


/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

if(sessionStorage.getItem('id')){
    vm.$router.beforeEach((to,from,next) => {
      if(to.matched.some( m => m.meta.auth)){
        // 对路由进行验证
        if(sessionStorage.getItem('id')) {  // 已经登陆
          next()        // 正常跳转到你设置好的页面
        }else{
          // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
          next({path:'/login',query:{ Rurl: to.fullPath} })
          localStorage.clear()
        }
      }else{
        next()
      }
    })
  }else{
    vm.$router.push({ path: '/login' })
  }
