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

import '!style-loader!css-loader!less-loader!./style/libs/iconfont/iconfont.css'

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

vm.$router.beforeEach((to,from,next) => {
    if(to.matched.some( m => m.meta.auth)){
        // 对路由进行验证
        if(sessionStorage.getItem('userId')) {  // 已经登陆
            next()     // 正常跳转到你设置好的页面
        }else{
            // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
　　 　　　　next({path:'/login',query:{ Rurl: to.fullPath} })
 　　　　　}
　　　　}else{
　　　　　　next()
　　}
})

