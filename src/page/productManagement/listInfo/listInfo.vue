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
      <el-button type="primary" size="small">保存</el-button>
      <el-button type="info" size="small">取消</el-button>
    </header>
    
    <main>
      <el-tabs 
        v-if="vm.inited" 
        v-loading="!vm.inited" 
        v-model="vm.currentTabName"
      >
        <el-tab-pane label="基本信息" name="basic">
          <basic-pane
            :proto="basic"
          ></basic-pane>
        </el-tab-pane>
        <el-tab-pane label="费用说明" name="instructions">
          <instructions-pane
            :proto="instructions"
          ></instructions-pane>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="others">其他信息</el-tab-pane>
      </el-tabs>
    </main>
      
  </div>
</template>

<script>
import { teamgetAction } from './api'
import { getTeamProDTO } from './dictionary'
import basicPane from './comps/basic-pane/index'

export default {
  components: { basicPane },

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
        inited: false
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
    }
  }
}
</script>