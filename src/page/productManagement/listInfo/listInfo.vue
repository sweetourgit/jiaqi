<style lang="scss" scoped>
@import './index.scss';  
.listinfo{
  padding-bottom: 80px;
  header{
    display: flex;
    width: $width;
    justify-content: flex-end;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
}
</style>

<template>
  <div class="listinfo">
    <header>
      <el-button type="primary" size="small" @click="preAction">保存</el-button>
      <el-button type="info" size="small" @click="leavePage">取消</el-button>
    </header>
    
    <main v-if="vm.inited">
      <el-tabs v-model="vm.currentTabName">
        <el-tab-pane label="基本信息" name="basic">
          <basic-pane
            ref="basicRef"
            :proto="basic"
          ></basic-pane>
        </el-tab-pane>
        <el-tab-pane label="费用说明" name="instructions">
          <instructions-pane
            ref="instructionsRef"
            :proto="instructions"
          ></instructions-pane>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="others">
          <others-pane
            ref="othersRef"
            :proto="others"
          ></others-pane>
        </el-tab-pane>
      </el-tabs>
    </main>
      
  </div>
</template>

<script>
import { teamgetAction, getGuidAction, insertAction, saveAction } from './api'
import { getTeamProDTO } from './dictionary'
import basicPane from './comps/basic-pane/index'
import instructionsPane from './comps/instructions-pane/index'
import othersPane from './comps/others-pane/index'

export default {
  components: { basicPane, instructionsPane, othersPane },

  provide: {
    // 如果是修改，则透传teamID
    PROVIDE_TEAM_ID: null,
    // 透传错误收集队列
    ERROR_QUEUE: []
  },

  mounted(){
    let isSave= this.$route.query.id || false;
    this.init(isSave);
  },

  data(){
    return {
      vm: {
        currentTabName: 'basic',
        inited: false,
        // 保存按钮的锁
        saveActionLock: false,
      },
      basic: {},
      instructions: [],
      others: []
    }
  },

  methods: {
    /**
     * @description: 初始化
     * @param {type} id 修改时为id，新增为undefined
     */
    init(id){
      let proto= this.getProto(id);
      proto.then(res => {
        // 拆分数据
        this.splitProto(res);
        // 修改需要透传id
        id && (this._provided.PROVIDE_TEAM_ID= id);
        // 通知$el数据初始化完成
        this.vm.inited= true;
        this.vm.saveActionLock= false;
      }).catch(err => {
        console.error(err);
        this.$message.error(err || "初始化失败");
      })
    },

    // 获取数据原型
    getProto(id){
      if(!id) return Promise.resolve(getTeamProDTO());
      return teamgetAction.call(this, id)
    },

    // 拆分原型数据到不同的模块
    splitProto(proto){
      let basic= {}
      Object.keys(proto).forEach(attr => {
        attr!== 'instructions' 
          && attr!== 'others'
            && (basic[attr]= proto[attr]);
      });
      this.basic= basic;
      this.instructions.splice(0);
      this.others.splice(0);
      this.instructions.push(...proto.instructions);
      this.others.push(...proto.others);
    },

    preAction(){
      if(this.vm.saveActionLock) return this.$message.info('数据保存中，请稍后再试');
      let hasChange= this.checkHasChange();
      if(!hasChange) return this.$message.info('数据无改动');
      let validate= this.validate();
      if(!validate) return this.showValidateError();
      let data= this.getData();
      let isSave= this.$route.query.id || false;
      isSave? this.saveAction(data): this.addAction(data);
    },

    /**
     * @description: 保存动作的锁在init方法中重置
     */
    saveAction(object){
      this.vm.saveActionLock= true;
      let { id }= this.$route.query;
      saveAction.bind(this)(object).then(res => {
        this.$message.success('产品信息保存成功');
        this.inited= false;
        this.$nextTick(() => {
          this.init(id);
        })
      }).catch(err => {
        this.vm.saveActionLock= false;
        this.$message.error(err);
        console.error(err);
      })
    },

    /**
     * @description: 添加动作的锁只有失败会重置，成功跳转页面，再进来走init重置
     */
    addAction(object){
      this.vm.saveActionLock= true;
      getGuidAction.bind(this)().then(res => {
        object.guid= res;
        insertAction.bind(this)(object).then(res => {
          let { id }= res;
          this.$message.success('产品新增成功，请完善套餐信息');
          this.$router.replace({ path: '/changeinfo', query:{ id } });
        })
      }).catch(err => {
        this.vm.saveActionLock= false;
        this.$message.error(err);
        console.error(err);
      })
    },

    getData(){
      let basic= this.$refs.basicRef.getData();
      let instructions= this.$refs.instructionsRef.getData();
      let others= this.$refs.othersRef.getData();
      basic.others= others;
      basic.instructions= instructions;
      return basic;
    },

    checkHasChange(){
      let bol= false;
      bol= this.$refs.basicRef.checkHasChange();
      !bol && (bol= this.$refs.instructionsRef.checkHasChange());
      !bol && (bol= this.$refs.othersRef.checkHasChange());
      return bol;
    },

    validate(){
      // 先重置错误队列
      this._provided.ERROR_QUEUE.splice(0);
      let validate= true;
      validate= this.$refs.basicRef.validate();
      validate && (validate= this.$refs.instructionsRef.validate());
      validate && (validate= this.$refs.othersRef.validate());
      return validate;
    },

    showValidateError(){
      let ERROR_QUEUE= this._provided.ERROR_QUEUE;
      const h = this.$createElement;
      let errors= ERROR_QUEUE[0] && ERROR_QUEUE[0].msgs.map(error => h('div', null, error))
      this.$msgbox({
        title: '表单验证结果',
        message: h('p', null, errors),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).finally(() => {
        ERROR_QUEUE.splice(0);
      })
    },

    leavePage(){
      let hasChange= this.checkHasChange();
      if(!hasChange) return this.$router.push('/productList/packageTour');
      this.$confirm(`当前页面有数据未保存，是否要离开?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.$router.push('/productList/packageTour');
      })
    },
  }
}
</script>