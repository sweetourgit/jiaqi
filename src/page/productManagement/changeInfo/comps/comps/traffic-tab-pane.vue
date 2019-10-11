<style lang="scss" scoped>
.traffic-tab-pane{
  header{
    font-size: 14px;
    padding: 10px 0 20px 0;
    .label{
      padding:0 10px;
    }
  }
  main{
    width: 80%;
    .detail-ground{
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #ddd;
      .title{
        height: 50px;
        display: flex;
        align-items: center;
        span{
          line-height: 50px;
        }
      }
    }
  }
}
</style>

<template>
  <div class="traffic-tab-pane">
    <div>{{ proto }}</div>
    <header>
      <span class="label">描述方式：</span>
      <el-radio-group v-model="vm.description" @change="changeDescription">
        <el-radio label="1">详细说明</el-radio>
        <el-radio label="2">简要说明</el-radio>
      </el-radio-group>
    </header>
    <main>
      <div v-if="vm.description=== '1'" class="detail-ground">
        <component 
          v-for="(item, i) in proto" 
          :key="item.id"
          :proto="item"
          :rank="i"
          :is="'child'+ item.trafficMode"
        >
          <div class="title" v-if="i=== 0">
            <span style="margin-right: 20px;">去程</span>
            <el-button type="success" size="small" @click="$emit('add-traffic', proto)">添加中转</el-button>
          </div>
          <div class="title" v-if="i=== proto.length- 1">
            <span>返程</span>
          </div>
        </component>
      </div>
      <div v-else class="easy-ground">
        <el-col :span="12">
          <vue-editor v-model="vm.content"></vue-editor>
        </el-col>
      </div>
    </main>
  </div>
</template>

<script>
// 第三方组件
import { VueEditor } from 'vue2-editor'
// 组件
import planeForm from './comps/plane-form'
import busForm from './comps/bus-form'
import shipForm from './comps/ship-form'
import trainForm from './comps/train-form'
// 常量
import { DEFALUT_TRAFFIC_MODE } from '../../dictionary'

export default {
  components: {
    child1: planeForm, child3:busForm, child4:shipForm, child2:trainForm,
    VueEditor
  },

  inject: ['PROVIDE_DAY'],

  props: {
    proto: {
      type: Array,
      default(){
        return [
          { trafficMode: DEFALUT_TRAFFIC_MODE },
          { trafficMode: DEFALUT_TRAFFIC_MODE }
        ]
      }
    },
    briefMark: [String],
  },

  data(){
    return {
      vm: {
        //1：详细说明 2：简要说明
        description: "1",
        content: this.briefMark
      },
      submitForm: {

      }
    }
  },

  methods: {
    changeDescription(label){
      //if(label=== '2') return this.vm.description= "1";
    },

    /**
     * @description: 检查是否有数据变动
     */
    checkHasChange(){
      let bol= false;
      //检查简要说明
      bol= this.vm.content=== this.briefMark;
      return bol;
    }
  }
}
</script>