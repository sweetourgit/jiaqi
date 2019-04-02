<template>
  <div id="app" >
    <el-header class="page-header"><page-header v-if="$route.meta.keepAlive"></page-header></el-header>
    <el-container class="container">
       <el-aside class="navigation" v-if="$route.meta.keepAlive"><nav-left></nav-left></el-aside>
       <el-main class="content-body">
        <div class="content-position">{{this.$route.name}}</div>
          <div class="el-mainl content-body1">
            <router-view></router-view>
          </div>
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
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 1440px;
  overflow-x:auto;
  overflow-y:hidden;
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
.el-mainl {
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px;
}
.router{float:left;margin:50px;font-size:25px;}
.page-header{height:auto !important;padding:0px !important}
.container{height: 100%;}
.navigation{width:222px !important;}
.content-body{margin-left: -22px; background: #F7F7F7; line-height: 100%; }
.content-body1{margin: 18px 0 0 3px; background: #FFF; line-height: 100%; min-height: 94%;width:99.6%;}
.content-position{border-left: 3px solid #F38F00; text-align: left; padding-left: 20px; font-size: 16px;height: 23px;line-height: 23px;margin: -3px 0 0 3px;}
.el-message-box.delete_country p{margin: 0 0 0 50px;}  /* 城市列表删除 */
.el-message-box.delete_country .delete_country_determine{margin: 20px 100px 20px 0; width: 80px;}
.el-message-box.delete_country .delete_country_determine1{margin: 20px 20px 20px 0; width: 80px;}
.city_list .el-dialog__header{background: #F6F6F6; height: 29px;padding-top: 16px} /* 弹框样式 */
.city_list .el-dialog__title{ float: left; }
.el-upload-list__item{width:30%;float:left;margin-left: 10px}
.el-menu-vertical-demo .el-menu-item.is-active{background: #3095FA !important;} /* 导航选中 */
body .el-table th.gutter{ display: table-cell!important; } /* 表格头部固定 */
</style>
