<style lang="scss" scoped>
.listinfo{
  display: flex;
  position: relative;
  padding-bottom: 80px;
  &>main{
    width: 1080px;
  }
  &>aside{
    padding-left: 20px;
    .fixed-outer{
      position: fixed;
    }
  }
}
</style>

<template>
  <div class="listinfo">
    <main>
      <el-tabs v-model="currentTabName">
        <el-tab-pane label="基本信息" name="base">
          <base-tab ref="baseTab"></base-tab>
        </el-tab-pane>
        <el-tab-pane label="账户信息" name="banks">
          <banks-tab ref="banksTab"></banks-tab>
        </el-tab-pane>
      </el-tabs>
    </main>
    <aside>
      <div class="fixed-outer">
        <el-button type="primary" size="small"
          @click="getData">
          保存
        </el-button>
        <el-button type="info" size="small"
          >
          取消
        </el-button>
      </div>
    </aside>    
  </div>
</template>

<script>
import { getSupplierById } from '../api'
import { getSupplierDTO } from '../dictionary'
import baseTab from './subs/baseTab/baseTab'
import banksTab from './subs/banksTab/banksTab'

export default {

  components: { baseTab, banksTab },

  mounted(){
    this.preHandler();
    this.init();
  },

  data(){
    return Object.assign(
      // 状态
      {
        isSave: false, // 是新增还是编辑
        currentTabName: 'base',
      }
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
        this.$refs.baseTab.init(baseProto);
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
    },

    hasChanged(){
      let bol= false;
      bol= this.$refs.baseTab.hasChanged();
      return bol;
    },

    // 返回的是Promise
    validate(){
      return this.$refs.baseTab.validate();
    },

    getData(){
      let baseData= this.$refs.baseTab.getData();
      console.log(baseData);
    },
  }

}
</script>