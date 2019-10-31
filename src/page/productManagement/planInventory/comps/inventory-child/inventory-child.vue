<style lang="scss" scoped>
$backgroundColor: #F7F7F7;

.inventory-child{
  &>>>.row-header{
    background-color: $backgroundColor;
    th{
      background-color: $backgroundColor;
    } 
  }
}
</style>

<template>
  <div class="inventory-child">
    <el-table border style="width: 100%"
      :data="tableData" 
      :highlight-current-row="false"
      header-row-class-name="row-header"
    >
      <el-table-column label="ID" prop="id" header-align="center" align="center" width="150"></el-table-column>
      <el-table-column label="名称" prop="name" header-align="center" align="center"></el-table-column>
      <el-table-column label="前缀-团号-后缀" prop="sign" header-align="center" align="center"></el-table-column>
      <el-table-column label="清位时间" prop="uptoDay" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <span>前&nbsp;{{ scope.row.uptoDay }}&nbsp;天</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="quota" header-align="center" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.inited">
            <div>
              <el-button type="primary" size="mini">成本</el-button>
              <el-button type="primary" size="mini">价格</el-button>
            </div>
            <div>
              <el-button type="primary" size="mini">团号</el-button>
              <el-button type="primary" size="mini">上线</el-button>
            </div>
          </div>
          <div v-else>
            <el-button type="primary" size="mini" @click="wakeSignForm">设置团号</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <sign-form
        ref="signFormRef"
        @action-callback="emitAddCallback"
      ></sign-form>
    </footer>
  </div>
</template>

<script>
// api
import { getTeamListPackages } from '../../planInventory'
// 子组件
import signForm from './comps/sign-form'

export default {
  components: { signForm },

  mounted(){
    this.init();
  },

  data(){
    return {
      tableData: [],
    }
  },

  methods: {

    init(id){
      id= parseInt(id || this.$route.query.id);
      if(!id) return this.$message.error('页面初始参数出错');
      this.getTeamListPackagesAction(id).then(objects => {
        this.tableData.splice(0);
        this.tableData.push(...this.mixinFactory(objects));
      })
    },

    getTeamListPackagesAction(id){
      return new Promise((resolve, reject) => {
        getTeamListPackages(id).then(res => {
          resolve(res);
        }).catch(err => {
          console.error(err);
          this.$message.err(err);
          reject;
        })
      })
    },

    mixinFactory(objects){
      return objects.map(object => {
        object.sign= '未设置'
        if(object.codePrefix && object.codeSuffix){
          object.sign= `${object.codePrefix} - 日期 - ${object.codeSuffix}`;
          object.inited= true;
        }
        return object;
      })
    },

  }

}
</script>