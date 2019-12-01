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
    },

    // 获取数据原型
    getProto(){
      let id= this.$route.query.id;
      if(!id) return Promise.resolve(getSupplierDTO());
      return getSupplierById(id)
    },
  }

}
</script>