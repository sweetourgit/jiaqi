import Vue from 'vue'
import Router from 'vue-router'
import userList from '@/page/account/userList/userList'
import organList from '@/page/account/organList/organList'
import role from '@/page/account/role/role'
import perList from '@/page/account/perList/perList'
import accountInfor from '@/page/perCenter/accountInfor/accountInfor'
import pwModifi from '@/page/perCenter/pwModifi/pwModifi'
import positionList from '@/page/account/positionList/positionList'
import login from '@/page/login/login'
import addRole from'@/page/account/role/addRole'

Vue.use(Router);

export default new Router({
  routes: [
    {
<<<<<<< HEAD
        path: '/', redirect: 'login',
      },{
        path: '/userList',
        component: userList,
        meta: {keepAlive: true}
      },{
        path: '/organList',
        component: organList,
        meta: {keepAlive: true}
      },{
        path: '/role',
        component: role,
        meta: {keepAlive: true}
      },{
          path: '/addRole',
          component: addRole,
          meta: {keepAlive: true}
      },
      {
        path: '/perList',
        component: perList,
        meta: {keepAlive: true}
      },{
        path: '/accountInfor',
        component: accountInfor,
        meta: {keepAlive: true}
      },{
        path: '/pwModifi',
        component: pwModifi,
        meta: {keepAlive: true}
      },{
        path: '/login',
        component: login,
        meta: {keepAlive: false}
      },{
        path: '/positionList',
        component: positionList,
        meta: {keepAlive: true}
      },{
        path: '/userList',
        component: userList,
        meta:{keepAlive:true}
      }
=======
      path: '/', redirect: 'login',
    },{
      path: '/userList',
      component: userList,
      meta: {keepAlive: true}
    },{
      path: '/organList',
      component: organList,
      meta: {keepAlive: true}
    },{
      path: '/role',
      component: role,
      meta: {keepAlive: true}
    },{
      path: '/addRole',
      component: addRole,
      meta: {keepAlive: true}
    },
    {
      path: '/perList',
      component: perList,
      meta: {keepAlive: true}
    },{
      path: '/accountInfor',
      component: accountInfor,
      meta: {keepAlive: true}
    },{
      path: '/pwModifi',
      component: pwModifi,
      meta: {keepAlive: true}
    },{
      path: '/login',
      component: login,
      meta: {keepAlive: false}
    },{
      path: '/positionList',
      component: positionList,
      meta: {keepAlive: true}
    },{
      path: '/userList',
      component: userList,
      meta:{keepAlive:true}
    }
>>>>>>> 5dcd0b1cffe502994f93dc75e340503766a9bca6
  ]
})
