<template>
  <div :visible.sync="dialogForm">
  123
  </div>
</template>
  
<script>

export default {
  props: {
   teamID:0,
   variable: 0,
  },
  data() {
    return {
      dialogForm:false,
    };
  },
  watch: {
    variable:function(){        
      this.dialogForm=true; 
   }
  },
  created() {
  },
  methods: {
    
  }
};
</script>

<style scoped lang="scss">

</style>


