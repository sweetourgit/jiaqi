<style lang="scss" scoped>
.traffic-tab-pane{
  header{
    font-size: 14px;
    padding: 15px 0 30px 0;
    .label{
      padding:0 10px;
      border-left: 3px solid #F38F00;
    }
  }
  main{
    width: 100%;
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
    <header>
      <span class="label">描述方式：</span>
      <el-radio-group v-model="vm.description" @change="changeDescription">
        <el-radio label="1">详细说明</el-radio>
        <el-radio label="2">简要说明</el-radio>
      </el-radio-group>
    </header>
    <main>
      <div v-if="vm.descriptionState=== 'detail'" class="detail-ground">
        <component 
          v-for="(item, i) in traffics" 
          ref="children"
          :key="item.goOrBack+ '-'+ Date.now()+ i"
          :rank="i"
          :proto="item"
          :is="'child'+ item.trafficMode"
          @remove-traffic="removeTrafficEmit(i)"
          @change-traffic-mode="changeTrafficModeEmit"
        >
          <div class="title" v-if="i=== 0">
            <span style="margin-right: 20px;">去程</span>
            <el-button type="primary" size="small" @click="addTraffic">添加中转</el-button>
          </div>
          <div class="title" v-if="i=== traffics.length- 1">
            <span>返程</span>
          </div>
        </component>
      </div>
      <div v-if="vm.descriptionState=== 'easy'" class="easy-ground">
        <el-col :span="18">
          <VueEditor
            v-model="vm.content">
          </VueEditor>
        </el-col>
      </div>
    </main>
  </div>
</template>

<script>

import VueEditor from '@/components/tinymce' 

import planeForm from './comps/plane-form'
import busForm from './comps/bus-form'
import shipForm from './comps/ship-form'
import trainForm from './comps/train-form'
import { DEFALUT_TRAFFIC_MODE, TEAM_TRAFFIC_DTO_GO, TEAM_TRAFFIC_DTO_BACK, GO_OR_BACK_SIGN } from '../../dictionary'

export default {
  components: {
    child1: planeForm, child3:busForm, child4:shipForm, child2:trainForm,
    VueEditor
  },

  props: {
    proto: {
      type: Array,
      default(){
        return [
          TEAM_TRAFFIC_DTO_GO,
          TEAM_TRAFFIC_DTO_BACK
        ]
      },
    },
    briefMark: [String],
  },

  mounted(){
    if(this.vm.content){
      this.vm.description= "2";
      this.vm.descriptionState= "easy";
    }
    this.init();
  },

  data(){
    return {
      vm: {
        description: "1",
        descriptionState: 'detail',
        content: this.briefMark+ ""
      },
      traffics: []
    }
  },

  methods: {

    init(type){
      if(!type || type=== 'detail'){
        this.traffics.splice(0);
        this.traffics.push(...this.$deepCopy(this.proto));
      }
      (!type || type=== 'easy') && (this.vm.content= this.briefMark);
    },

    changeDescription(label){
      if(label=== '2'){
        let hasChange= this.checkHasChange('detail');
        if(!hasChange) return this.vm.descriptionState= "easy";
        this.$confirm('详细说明中有未保存修改，切换后将取消修改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.init("detail");
          this.vm.descriptionState= "easy"; 
        }).catch(() => {
          this.vm.description= "1";         
        });
      }
      if(label=== '1'){
        let hasChange= this.checkHasChange('easy');
        if(!hasChange) return this.vm.descriptionState= "detail";
        if(hasChange) this.$confirm('简要说明中有未保存修改，切换后将取消修改，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.init("easy");
          this.vm.descriptionState= "detail"; 
        }).catch(() => {
          this.vm.description= "2";         
        });
      }
    },


    addTraffic(){
      let newTraffics= this.getData().traffic;
      newTraffics.splice(
        newTraffics.length- 1, 0, this.$deepCopy(TEAM_TRAFFIC_DTO_GO));
      this.traffics.splice(0);
      this.traffics.push(...newTraffics);
    },
    
    removeTrafficEmit(index){
      this.$confirm('是否删除该交通信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let newTraffics= this.getData().traffic;
        newTraffics.splice(index, 1);
        this.traffics.splice(0);
        this.traffics.push(...newTraffics);
      }).catch(() => {
      });
    },


    changeTrafficModeEmit(payload){
      let { index, trafficMode, goOrBackSign }= payload;
      let protoIndex= goOrBackSign=== GO_OR_BACK_SIGN.BACK? 
        (this.proto.length- 1): index;
      let newTraffics= this.getData().traffic;
      this.traffics.splice(0);
      this.traffics.push(...newTraffics);

      this.traffics.splice(index, 1,
        this.$deepCopy(
          goOrBackSign=== GO_OR_BACK_SIGN.BACK?
            TEAM_TRAFFIC_DTO_BACK: TEAM_TRAFFIC_DTO_GO)
      );
      this.traffics[index].trafficMode= trafficMode;
      let notRestore= 
        goOrBackSign!== GO_OR_BACK_SIGN.BACK && (index=== this.proto.length-1);
      if(!notRestore 
          && this.proto[index] 
            && this.proto[index].trafficMode===trafficMode){
        let copy= this.$deepCopy(this.proto[
          goOrBackSign=== GO_OR_BACK_SIGN.BACK? protoIndex: index
        ]);
        Object.assign(this.traffics[index], this.$deepCopy(this.proto[index]));
      }
      this.vm.descriptionState= false;
      this.$nextTick(() => this.vm.descriptionState= "detail");
    },


    checkHasChange(param){
      let type= param || this.vm.descriptionState;
      return this[`${type}CheckHasChange`]();
    },
    detailCheckHasChange(){
      let bol= false;
      let children= this.$refs.children || [];
      children.forEach(child => {
        !bol && (bol= child.checkHasChange());
      })
      !bol && (bol= !this.$checkLooseEqual(this.traffics, this.proto));
      console.log(`traffic-tab-pane detail checkHasChange: ${bol}`)
      return bol;
    },
    easyCheckHasChange(){
      let bol= !(this.vm.content=== this.briefMark);
      console.log(`traffic-tab-pane easy checkHasChange: ${bol}`)
      return bol;
    },


    getData(){
      let children= this.$refs.children;
      let traffic= 
        this.vm.descriptionState=== 'detail'?
          children.map(child => child.getData()): 
            this.$deepCopy([TEAM_TRAFFIC_DTO_GO, TEAM_TRAFFIC_DTO_BACK]);
      let briefMark= 
        this.vm.descriptionState=== 'detail'?
          "": this.vm.content; 
      return { traffic, briefMark };
    },

    validate(){
      return this.vm.descriptionState=== 'detail'?
        this.detailValidate(): this.easyValidate();
    },
    easyValidate(){
      //return !!this.vm.content;
      return true;
    },
    detailValidate(){
      let bol= true;
      let children= this.$refs.children;
      children.forEach(child => {
        bol && (bol= child.validate());
      })
      return bol;
    },
  }
}
</script>