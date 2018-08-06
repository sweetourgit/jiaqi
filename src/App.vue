<template>
  <div id="app" >
    <el-header class="page-header"><page-header v-if="$route.meta.keepAlive"></page-header></el-header>
    <el-container class="container">
       <el-aside class="navigation" v-if="$route.meta.keepAlive"><nav-left></nav-left></el-aside>
       <el-main class="content-body">
        <div class="content-position">{{this.$route.name}}</div>
          <el-main class="content-body1">
            <router-view></router-view>
          </el-main>
         </el-main>
    </el-container>
  </div>
</template>


<script>
import pageHeader from './components/header/header'
import navLeft from './components/navLeft/navLeft'
export default {
  name: 'App',
  components: {
    pageHeader,
    navLeft
    },
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100%;
}
body{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-y:hidden;
}
html{
  height: 100%;
}
.router{float:left;margin:50px;font-size:25px;}
.page-header{height:auto !important;padding:0px !important}
.container{height: 100%;}
.navigation{width:222px !important;}
.content-body{margin-left: -22px; background: #F7F7F7; line-height: 100%; }
.content-body1{margin-top: 15px; background: #FFF; line-height: 100%; min-height: 94%;}
.content-position{border-left: 3px solid #F38F00; text-align: left; padding-left: 20px; font-size: 17px;height: 23px;line-height: 23px;}
.el-cascader-menus.el-popper.popper__arrow .el-cascader-menu :nth-child(1){background: #F6F6F6; color:#409EFF !important;} /* 城市列表下拉框 */
.el-cascader-menus.el-popper.popper__arrow .el-cascader-menu__item.is-active{color:#1ABC9C;} /* 城市列表下拉框选中 */
.el-message-box.delete_country p{margin: 0 0 0 50px;}  /* 城市列表删除 */
.el-message-box.delete_country .delete_country_determine{margin: 20px 100px 20px 0; width: 80px;}
.el-message-box.delete_country .delete_country_determine1{margin: 20px 20px 20px 0; width: 80px;}
.city_list .el-dialog__header{background: #F6F6F6; height: 25px;} /* 弹框样式 */
.city_list .el-dialog__title{float: left;}
.el-menu-vertical-demo .el-menu-item.is-active{background: #0C1C40 !important;} /* 导航选中 */
.content_pass .el-form-item__error{ position: absolute; left: 220px; top: 12px;} /* 修改密码error */
.content_pass .el-form-item__content{ width:340px;}
body .el-table th.gutter{ display: table-cell!important;} /* 表格头部固定 */
</style>
