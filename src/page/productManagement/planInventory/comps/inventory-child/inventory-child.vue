<style lang="scss" scoped>
$backgroundColor: #F7F7F7;

.inventory-child{
  &>>>.row-header{
    background-color: $backgroundColor;
    th{
      background-color: $backgroundColor;
    } 
  }
  .btns-ground{
    display: flex;
    .sub-ground{
      display: flex;
      flex-direction: column;
    }
    .sub-ground:nth-child(2){
      margin-left: 5px;
      padding-left: 5px;
      border-left: 1px dashed #aeaeae;
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
      <el-table-column label="操作" prop="quota" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.inited" class="btns-ground">
            <div class="sub-ground">
              <el-button type="primary" size="mini" @click="toCostChild(scope.row)">成本</el-button>
              <el-button type="primary" size="mini" style="margin: 5px 0 0 0;">价格</el-button>
            </div>
            <div class="sub-ground">
              <el-button type="primary" size="mini" @click="wakeSignForm(scope.row)">团号</el-button>
              <el-button type="primary" size="mini" style="margin: 5px 0 0 0;" disabled>上线</el-button>
            </div>
          </div>
          <div v-else>
            <el-button type="primary" size="mini" @click="wakeSignForm(scope.row)">设置团号</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <sign-form
        ref="signFormRef"
        @action-callback="emitSaveShortCallback"
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

  data(){
    return {
      tableData: [],
    }
  },

  methods: {

    init(){
      let id= this.$route.query.id;
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

    // 唤醒团号表单
    wakeSignForm(pac){
      this.$refs.signFormRef.handleOpen(pac);
    },

    // 设置团号后的回调
    emitSaveShortCallback(){
      this.init();
    },

    // 去成本
    toCostChild(pac){
      this.$emit('emit-handler', { func: 'toCostChild', payload: pac });
    }
  }

}
</script>