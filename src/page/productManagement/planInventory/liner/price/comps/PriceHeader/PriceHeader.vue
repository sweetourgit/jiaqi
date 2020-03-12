<style>

</style>

<template>
  <Jdatepanel></Jdatepanel>
</template>

<script>
/**
 * @description: 分离业务与日历逻辑
 */
import Jdatepanel from './comps/Jdatepanel/Jdatepanel'

export default {

  components: { Jdatepanel },

  data(){
    return {
      calendarArr: [],  // 日历面板
    }
  },

  methods: {
    init(){

    }
  }

}
</script>