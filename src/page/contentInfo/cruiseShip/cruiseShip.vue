<template>
  <div class="curiseShip">
    <p>邮轮管理</p>
    <el-button @click="routerTo" type="warning">详情</el-button>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "curiseShip",
  components: {
    
  },
  data() {
    return {
      
    }
  },
  computed: {},
  methods: {
    routerTo(){
      this.$router.push({
        path: '/cruiseShip/cruiseShipDetail',
        name: '邮轮管理/详情'
      });
    },
  },
  created() {
    
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  
</style>
