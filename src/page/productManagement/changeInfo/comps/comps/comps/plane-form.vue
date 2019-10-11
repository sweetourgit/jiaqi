<style lang="scss" scoped>
.plane-form{
  main{
    padding: 10px;
    background-color: #eee;
  }
}
</style>

<template>
  <div class="plane-form">
    <slot></slot>
    <main>
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-row style="width: 60%;">
          123
        </el-row>
      </el-form>
    </main>  
  </div>  
</template>

<script>
import { TRAFFIC_MODE_OPTIONS } from '../../../dictionary'

export default {
  name: 'plane-form',
  
  props: {
    proto: {
      type: Object
    },
  },

  data(){
    return Object.assign({
      submitForm: {
        trafficMode: '1',
      },
      rules: {

      }
    }, { TRAFFIC_MODE_OPTIONS })
  }
}
</script>