<style lang="scss" scoped>
.bread-header{
  font-size: 24px;
  line-height: 60px;
  height: 72px;
  padding-bottom: 12px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  .split{
    color: #ddd;
    padding: 0 10px;
  }
  .name:hover{
    color: #ddd;
  }
}
</style>

<template>
  <div class="bread-header">
    <span v-for="(el, i) in list" :key="el.id">
      <span class="split" v-show="i">/</span>
      <span class="name"
        @click="$emit('node-click', list[i])"
      >{{ el.areaName }}</span>
    </span>
  </div>
</template>

<script>
export default {

  data(){
    return {
      list: [],
    }
  },

  methods: {
    init(nodeProto){
      this.list.splice(0);
      let result= [];
      let limit= 0;
      do{
        result.push(nodeProto);
        nodeProto= nodeProto.parent;
        limit++;
      }while(nodeProto && limit<= 100)
      if(limit>= 100) console.error('limited')
      this.list.push(...result.reverse());
    }
  }
}
</script>