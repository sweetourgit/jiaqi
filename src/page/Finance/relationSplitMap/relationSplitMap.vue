<style lang="scss" scoped>
  .relation-split{
    padding-bottom: 80px;
    &>header{
      display: flex;
      justify-content: flex-end;
      padding: 0 0 20px 0;
    }
    &>.main{
      display: flex;
      height: 500px;
      width: 100%;
      &>aside{
        padding: 0 10px;
        width: 360px;
      }
      &>main{
        flex-grow: 1;
        padding: 0 10px;
        border-left: 1px solid #d3d3d3;
      }
    }
  }
</style>

<template>
  <div class="relation-split">
    <header>
      <el-button size="small" type="info"
        @click="$router.go(-1)">
        取消
      </el-button>
    </header>
    <div class="main">
      <aside>
        <relation-bar
          ref="relationBarRef"
          v-if="relations"
          v-bind.sync="relations"
          :is-root="true"
          :proto="relations"
          @wake-up="wakeUpDisplay">
        </relation-bar>
      </aside>
      <main>
        <display-bar ref="displayBar"></display-bar>
      </main>
    </div>
  </div>
</template>

<script>
import { getRoot } from './api'
import { relationBarMaker } from './dictionary'
import relationBar from './comps/relationBar'
import displayBar from './comps/displayBar'

export default {

  components: { relationBar, displayBar },

  mounted(){
    this.init();
  },

  data(){
    return {
      relations: null,
    }
  },

  methods: {
    init(){
      let { id }= this.$route.query;
      getRoot(id).then(res => {
        this.relations= relationBarMaker(res, true);
      })
    },

    wakeUpDisplay(payload){
      if(!payload) this.$refs.displayBar.wakeup();
      let { info, child }= payload;
      this.$refs.displayBar.wakeup({ borrow: info, lend: child && child.info });
    }
  }

}
</script>