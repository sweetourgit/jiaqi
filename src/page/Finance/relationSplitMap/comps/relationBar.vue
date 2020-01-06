<style lang="scss" scoped>
$ruler: 16px;

.relation-bar{
  *{
    box-sizing: border-box;
  }
  .icon-outer{
    display: inline-block;
    height: 1.5* $ruler;
    width: 1.5* $ruler;
    padding: 0.25* $ruler;
    cursor: pointer;
  }
  .label{
    display: inline-block;
    padding: 0 5px;
    font-size: $ruler;
    line-height: 1.5* $ruler;
  }
  &>header{
    
  }
  &>main{
    position: relative;
    padding-left:1.5* $ruler; 
  }
  &>main:before{
    content: ' ';
    position: absolute;
    height: 100%;
    width: 1.5* $ruler;
    border-right: 1px dashed #000;
    transform: translateX(-150%);
  }
}
</style>
<template>
  <div class="relation-bar"
    v-if="expended">
    <header>
      <div class="icon-outer"
        @click.exact="awakeChild"
        @click.ctrl.exact="awakeChildDeeply">
        <i :class="[expended? 'el-icon-minus': 'el-icon-plus']"></i>
      </div>
      <div class="label">[预]123</div>
    </header>
    <main>
      <relation-bar 
        ref="relationBar">
      </relation-bar>
    </main>
  </div>  
</template>

<script>
export default {

  name: 'RelationBar',

  data(){
    return Object.assign(
      {
        expended: false,
      }
    )
  },

  methods: {
    expend(){
      this.expended= true;
    },
    awakeChild(){
      console.log('awakeChild');
      this.$nextTick(() => {
        this.$refs.relationBar.expend();
      })
    },
    awakeChildDeeply(){
      console.log('awakeChildDeeply')
    }
  }

}
</script>