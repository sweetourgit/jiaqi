// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import global from './components/tools/global'
import store from '@/store'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//axios
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$http = axios
Vue.prototype.qs = qs

//global variable
Vue.prototype.GLOBAL = global
Vue.config.productionTip = false

import '!style-loader!css-loader!less-loader!./style/libs/iconfont/iconfont.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
