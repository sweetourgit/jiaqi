<template>
  <div class="others-pane"
    v-if="vm.inited"  
  >
    <others-bar
      ref="reserveRef"
      :proto="reserve"
      :title="'预定须知'"
      :type="MENU_TYPE.RESERVE"
    ></others-bar>
    <others-bar
      ref="introduceRef"
      :proto="introduce"
      :title="'使用说明'"
      :type="MENU_TYPE.INTRODUCE"
    ></others-bar>
  </div>
</template>

<script>
import othersBar from './comps/others-bar'
import { MENU_TYPE } from '../../dictionary'

export default {
  components: { othersBar },

  props: {
    proto: Array,
  },
  
  created(){
    this.init();
  },

  data(){
    return Object.assign({
      vm: { inited: false },
      reserve: [],
      introduce: []
    }, { MENU_TYPE })
  },

  methods: {
    init(){
      this.proto.forEach(el => {
        el.menuType=== MENU_TYPE.RESERVE &&
          this.reserve.push(el);
        el.menuType=== MENU_TYPE.INTRODUCE &&
          this.introduce.push(el);
      });
      this.vm.inited= true;
    },

    checkHasChange(){
      let bol= false;
      bol= this.$refs.reserveRef.checkHasChange();
      !bol && (bol= this.$refs.introduceRef.checkHasChange());
      return bol;
    },

    validate(){
      let bol= true;
      bol= this.$refs.reserveRef.validate();
      bol && (bol= this.$refs.introduceRef.validate());
      return bol;
    },

    getData(){
      let reserve= this.$refs.reserveRef.getData();
      let introduce= this.$refs.introduceRef.getData();
      return [...reserve, ...introduce];
    }
  }
}
</script>