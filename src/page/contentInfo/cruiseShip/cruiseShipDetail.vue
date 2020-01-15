<template>
  <div class="curiseShipDetail">
    <el-button @click="cancal" type="primary">取消</el-button>
    <p>详情</p>
    <el-button @click="routerTo" type="warning">添加</el-button>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "curiseShipDetail",
  components: {
    
  },
  data() {
    return {
      
    }
  },
  computed: {},
  methods: {
    cancal(){
      this.$router.push({
        path: '/cruiseShip',
        name: '邮轮管理'
      });
    },
    routerTo(){
      this.$router.push({
        path: '/cruiseShip/shipDetailAdd',
        name: '邮轮管理/详情/添加游轮'
      });
    }
  },
  created() {
    
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  
</style>