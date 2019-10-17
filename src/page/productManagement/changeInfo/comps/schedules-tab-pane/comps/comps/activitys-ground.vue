<style lang="scss" scoped>
.activitys-ground{
  padding-top: 10px;
  header{
    display: flex;
    height: 50px;
    align-items: center;
  }
}
</style>

<template>
  <div class="activitys-ground">
    <header>
      <span style="margin: 0 15px 0 40px;">活动详情</span>
      <el-button type="primary" size="small" @click="addActivity">添加详情</el-button>
    </header>
    <main v-if="vm.refresh">
      <activitys-bar
        ref="children" 
        v-for="(item, i) in activitys"
        :key="i"
        :proto="item"
      >
        <el-button type="info" size="small" style="margin-left: 120px;"
          @click="removeActivity(i)"
        >删除</el-button>
      </activitys-bar>
    </main>
  </div>
</template>

<script>
import { getActivityDTO } from '../../../../dictionary'
import activitysBar from './activitys-bar'

export default {
  components: { activitysBar },

  props: {
    proto: Array,
    id: Number
  },

  mounted(){
    this.init();
  },

  data(){
    return {
      vm: {
        refresh: true,
      },
      activitys: [],
    }
  },

  methods: {
    init(){
      this.activitys.push(...this.$deepCopy(this.proto));
    },

    addActivity(){
      let newActivity= getActivityDTO(this.id);
      this.activitys.push(newActivity);
    },
    removeActivity(index){
      this.$confirm(`是否删除该活动信息?`, null, {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.activitys.splice(index, 1);
      })
    },
    refresh(){
      this.vm.refresh= false;
      this.$nextTick(() => this.vm.refresh= true);
    },

    //详情状态下检查
    checkHasChange(){
      let bol= false;
      let children= this.$refs.children || [];
      children.forEach(child => {
        !bol && (bol= child.checkHasChange());
      })
      !bol && (bol= !this.$checkLooseEqual(this.activitys, this.proto));
      bol && console.warn(`activitys-ground checkHasChange: ${bol}`)
      return bol;
    },

    getData(){
      let children= this.$refs.children || [];
      return children.map(child => child.getData());
    }
  }

}
</script>