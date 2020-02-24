<template>
  <div class="curiseShip">
    <div class="buttonDv">
      <el-button type="info" class="topButton">添加顶级</el-button>
    </div>
    <div class="block">
      <!-- <p>使用 scoped slot</p> -->
      <el-tree
        :data="data"
        :node-key="data.id"
        render-after-expand
        :props="defaultProps"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.name }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
              添加
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => edit(node, data)">
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              style="color:red;"
              @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <cabinAdd :dialogFormVisible='dialogFormVisible' :info='info' @close="closeAdd"></cabinAdd>
  </div>
</template>
<script type="text/javascript">
import cabinAdd from '@/page/contentInfo/cruiseShipCabin/cabinAdd.vue'
export default {
  name: "curiseShip",
  components: {
    cabinAdd
  },
  data() {
    const data = [];
    return {
      data: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: 'child',
      },
      dialogFormVisible: false,
      info: ''
    }
  },
  computed: {},
  methods: {
    closeAdd(){
      this.dialogFormVisible = false;
      this.info = "";
      this.loadData();
    },
    append(data) {
      this.dialogFormVisible = true;
      this.info = data.id;
    },
    edit(node, data){
      this.dialogFormVisible = true;
      this.info = data.id;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/cabin-type/listall", {
        "id": 0
      }, ).then(function(response) {
        console.log('获取邮轮舱房',response);
        if (response.data.code == '200') {
          that.data = JSON.parse(JSON.stringify(response.data.data))
          // console.log(JSON.stringify(response.data.data))
          // that.data.forEach(function(item, index, arr){
          //   if(item.children)
          // })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    this.loadData();
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .buttonDv{
    overflow: hidden;
  }
  .topButton{
    float: right;
  }
  .custom-tree-node{
    span{
      margin-right: 20px;
    }
  }
</style>
