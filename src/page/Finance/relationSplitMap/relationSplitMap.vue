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
        :is-root="true">
      </relation-bar>
    </main>
  </div>
</template>

<script>
import relationBar from './comps/relationBar'

export default {
  components: { relationBar },

  methods: {
    
  }

}
</script>