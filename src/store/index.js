import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import modules from './modules'
Vue.use(Vuex)

let store = new Vuex.Store({
  state,
  mutations,
  modules
})

export default store