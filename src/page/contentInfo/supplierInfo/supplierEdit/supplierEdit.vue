<style lang="scss" scoped>
.listinfo{
  padding-bottom: 80px;
  header{
    display: flex;
    width: 100%;
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
      <el-button type="info" size="small"
        @click="$router.go(-1)">
        取消
      </el-button>
    </header>
    
    <main>
      <el-tabs v-model="currentTabName" >
        <el-tab-pane label="基本信息" name="first">用户管理</el-tab-pane>
        <el-tab-pane label="账户信息" name="second">配置管理</el-tab-pane>
      </el-tabs>
    </main>
      
  </div>
</template>

<script>
import { getSupplierById } from '../api'
import { getSupplierDTO } from '../dictionary'

export default {

  mounted(){
    this.preHandler();
    this.init();
  },

  data(){
    return Object.assign(
      // 状态
      {
        isSave: false, // 是新增还是编辑
        currentTabName: null,
      },

    )
  },

  methods: {
    // 进入页面后的预处理
    preHandler(){
      this.isSave= this.$route.path=== '/supplierAdd';
      let { conditions, pageInfo, id }= this.$route.query;
      this.backQuery= { conditions, pageInfo };
      this.$router.replace({ path: this.$route.path, query: { id } });
    },

    init(){
      let protoPromise= this.getProto();
      protoPromise
      .then(proto => {
        let { baseProto, banksProto }= this.protoSplitHandler(proto);
      })
    },

    // 获取数据原型
    getProto(){
      let id= this.$route.query.id;
      if(!id) return Promise.resolve(getSupplierDTO());
      return getSupplierById(id)
    },

    // 拆分数据原型
    protoSplitHandler(proto){
      let id= this.$route.query.id;
      let baseProto= {}; 
      let banksProto= { id };
      Object.keys(proto).forEach((attr) => {
        if(attr=== 'banks') return banksProto[attr]= proto[attr];
        baseProto[attr]= proto[attr];
      })
      return { baseProto, banksProto };
    }
  }

}
</script>