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
import addRole from '@/page/account/role/addRole'
import addUser from '@/page/account/userList/addUser/addUser'
import cityList from '@/page/contentInfo/cityList/cityList'
import customArea from '@/page/contentInfo/customArea/customArea'
import scenicList from '@/page/contentInfo/scenicList/scenicList'
import labelList from '@/page/contentInfo/labelList/labelList'
import materialList from '@/page/contentInfo/materialList/materialList'
import hotelList from '@/page/contentInfo/hotelList/hotelList'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/', redirect: 'login',
    }, {
      path: '/userList',
      component: userList,
      name: '用户列表',
      meta: {keepAlive: true}
    }, {
      path: '/organList',
      component: organList,
      name: '组织列表',
      meta: {keepAlive: true}
    }, {
      path: '/role',
      component: role,
      name: '角色权限模板',
      meta: {keepAlive: true}
    }, {
      path: '/addRole',
      component: addRole,
      name: "添加角色权限模板",
      meta: {keepAlive: true}
    },
    {
      path: '/perList',
      component: perList,
      name: '权限管理',
      meta: {keepAlive: true}
    }, {
      path: '/accountInfor',
      component: accountInfor,
      name: '账户信息',
      meta: {keepAlive: true}
    }, {
      path: '/pwModifi',
      component: pwModifi,
      name: '密码修改',
      meta: {keepAlive: true}
    }, {
      path: '/login',
      component: login,
      meta: {keepAlive: false}
    }, {
      path: '/positionList',
      component: positionList,
      name: '职位列表',
      meta: {keepAlive: true}
    }, {
      path: '/userList',
      component: userList,
      meta: {keepAlive: true}
    }, {
      path: '/userList/addUser',
      component: addUser,
      name: '用户添加',
      meta: {keepAlive: true}
    }, {
      path: '/cityList',
      component: cityList,
      name: '城市列表',
      meta: {keepAlive: true}
    }, {
      path: '/customArea',
      component: customArea,
      name: '自定义地区',
      meta: {keepAlive: true}
    }, {
      path: '/scenicList',
      component: scenicList,
      name: '景点列表',
      meta: {keepAlive: true}
    }, {
      path: '/labelList',
      component: labelList,
      name: '标签列表',
      meta: {keepAlive: true}
    }, {
      path: '/materialList',
      component: materialList,
      name: '素材列表',
      meta: {keepAlive: true}
    }, {
      path: '/hotelList',
      component: hotelList,
      name: '酒店列表',
      meta: {keepAlive: true}
    },
  ]
})
