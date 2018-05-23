import Vue from 'vue'
import Router from 'vue-router'
import userList from '@/page/account/userList/userList'
import organList from '@/page/account/organList/organList'
import role from '@/page/account/role/role'
import addRole from '@/page/account/role/addRole'
import perList from '@/page/account/perList/perList'
import accountInfor from '@/page/perCenter/accountInfor/accountInfor'
import pwModifi from '@/page/perCenter/pwModifi/pwModifi'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', redirect: '/userList',
    },{
      path: '/userList',
      component: userList
    },{
      path: '/organList',
      component: organList
    },{
      path: '/role',
      component: role
    },{
      path: '/addRole',
      component: addRole
    },{
      path: '/perList',
      component: perList
    },{
      path: '/accountInfor',
      component: accountInfor
    },{
      path: '/pwModifi',
      component: pwModifi
    }
  ]
})
