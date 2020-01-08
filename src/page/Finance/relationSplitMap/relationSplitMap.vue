<style lang="scss" scoped>
  .relation-split{
    padding-bottom: 80px;
    &>header{
      display: flex;
      justify-content: flex-end;
      padding: 0 0 20px 0;
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
    <main>
      <relation-bar
        ref="relationBarRef"
        v-if="relations"
        v-bind.sync="relations"
        :is-root="true"
        :proto="relations">
      </relation-bar>
    </main>
  </div>
</template>

<script>
import { getRoot } from './api'
import { RelationBar } from './dictionary'
import relationBar from './comps/relationBar'

export default {

  components: { relationBar },

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
      getRoot().then(res => {
        this.relations= new RelationBar({ isRoot: true });
        RelationBar.root= this.relations;
      })
    }
  }

}
</script>