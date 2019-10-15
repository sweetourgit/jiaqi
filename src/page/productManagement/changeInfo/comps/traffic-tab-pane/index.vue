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
          :key="item.goOrBack+ '-'+ i"
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
          <vue-editor v-model="vm.content"></vue-editor>
        </el-col>
      </div>
    </main>
  </div>
</template>

<script>
/**
 * @description: 交通（中转）组件
 */

// 第三方组件
import { VueEditor } from 'vue2-editor'
// 组件
import planeForm from './comps/plane-form'
import busForm from './comps/bus-form'
import shipForm from './comps/ship-form'
import trainForm from './comps/train-form'
// 常量
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
      }
    },
    briefMark: [String],
  },

  mounted(){
    //如果有简要说明，自动切换
    if(this.vm.content){
      this.vm.description= "2";
      this.vm.descriptionState= "easy";
    }
    this.init();
  },

  data(){
    return {
      vm: {
        //1：详细说明 2：简要说明
        description: "1",
        descriptionState: 'detail',
        content: this.briefMark+ ""
      },
      traffics: []
    }
  },

  methods: {
    /**
     * @description: 初始化
     */
    init(type){
      if(!type || type=== 'detail'){
        this.traffics.splice(0);
        this.traffics.push(...this.$deepCopy(this.proto));
      }
      (!type || type=== 'easy') && (this.vm.content= this.briefMark);
    },

    /**
     * @description: 切换说明类型
     */
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

    /**
     * @description: 添加删除交通（中转）信息
     */
    addTraffic(){
      this.traffics.splice(
        this.traffics.length- 1, 0, this.$deepCopy(TEAM_TRAFFIC_DTO_GO));
    },
    removeTrafficEmit(index){
      this.traffics.splice(index, 1);
    },

    /**
     * @description: 更换出行方式需要判断是否与原始数据中的出行方式一样，一样则以原始数据填充
     * @bug 1.新增加一个中转，由中转飞机改为中转火车，再改回中转飞机，这个对象的数据与返程数据会混淆
     */
    changeTrafficModeEmit(payload){
      let { index, trafficMode, goOrBackSign }= payload;
      // 只有返程会自动定位到最后一个
      index= goOrBackSign=== GO_OR_BACK_SIGN.BACK? 
        (this.proto.length- 1): index;
      // 默认数据，先切换组件形态
      this.traffics.splice(index, 1,
        this.$deepCopy(
          goOrBackSign=== GO_OR_BACK_SIGN.BACK?
            TEAM_TRAFFIC_DTO_BACK: TEAM_TRAFFIC_DTO_GO)
      );
      this.traffics[index].trafficMode= trafficMode;
      // 解决bug 1，如果切换方式的实例不是返程，但是它的下标却与原始数据中返程下标一致，也不重置数据
      let notRestore= 
        goOrBackSign!== GO_OR_BACK_SIGN.BACK && (index=== this.proto.length-1);
      // 如果是初始数据中的出行方式，则填充初始数据
      if(!notRestore && this.proto[index] 
        && this.proto[index].trafficMode===trafficMode){
        Object.assign(this.traffics[index], this.$deepCopy(this.proto[index]));
      }
      this.vm.descriptionState= false;
      this.$nextTick(() => this.vm.descriptionState= "detail");
    },

    /**
     * @description: 检查是否有数据变动
     */
    checkHasChange(param){
      let type= param || this.vm.descriptionState;
      return this[`${type}CheckHasChange`]();
    },
    //详情状态下检查
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
    //简易状态下检查
    easyCheckHasChange(){
      let bol= !(this.vm.content=== this.briefMark);
      console.log(`traffic-tab-pane easy checkHasChange: ${bol}`)
      return bol;
    },

    /**
     * @description: 获取数据
     */
    getData(){
      let children= this.$refs.children;
      // 如果是简单状态，先传回原始数据
      let traffic= 
        this.vm.descriptionState=== 'detail'?
          children.map(child => child.getData()): this.$deepCopy(this.proto);
      let briefMark= 
        this.vm.descriptionState=== 'detail'?
          this.briefMark: this.vm.content; 
      return { traffic, briefMark };
    },

    validate(){
      return this.vm.descriptionState=== 'detail'?
        this.detailValidate(): this.easyValidate();
    },
    easyValidate(){
      return !!this.vm.content;
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