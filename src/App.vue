<template>
  <div id="app">
    <page-header></page-header>
    <div class="nav-left"><nav-left></nav-left></div>
    <div class="router"><router-view></router-view></div>
  </div>
</template>

<script>
import pageHeader from './components/header/header'
import navLeft from './components/navLeft/navLeft'
export default {
  name: 'App',
  components:{pageHeader,navLeft},
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
.router{float:left;margin:50px;font-size:25px;}
.nav-left{float:left;height:100%;}
</style>
