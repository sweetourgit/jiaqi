<style lang="scss" scoped>
.all-pane{
  &>header{
    padding: 10px 0;
  }
}
</style>

<template>
  <div class="all-pane">
    <header>
      <all-pane-conditions 
        ref="allPaneConditionsRef"
        @reset-pageinfo="resetPageInfo">
      </all-pane-conditions>
    </header>
    <main>
      <el-table style="width: 100%" border
        :data="tableData"
        :highlight-current-row="false">
        <el-table-column align="center" prop="groupCode" label="团期计划" ></el-table-column>

        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-button type="text"
              v-if="scope.row.isLeaf == 2"
              @click="$emit('node-click', scope.row)" 
            >{{ scope.row.areaName }}</el-button>
            <span type="text"
              v-else
            >{{ scope.row.areaName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="groupCode" align="center" label="产品名称"></el-table-column>

        <el-table-column prop="userName" label="申请人" align="center"></el-table-column>

        <el-table-column prop="createTime" label="申请时间" align="center"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="wakeupEditForm(scope.row)">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div style="display: flex; justify-content: center; padding-top: 20px;">
        <el-pagination background
          :current-page.sync="pageInfo.pageNo"
          :page-sizes="[2, 4, 8, 10]"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          @current-change="pageActionHandler"
          @prev-click="pageActionHandler"
          @next-click="pageActionHandler"
          @size-change="sizeChangeFunc"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </footer>  
  </div>
</template>

<script>
import allPaneConditions from './comps/allPaneConditions'
import { getCheckSheetList } from '../../api'

const getPageInfo= function(total){
  return {
    pageIndex: 1,
    pageSize: 10,
    total: total || 0
  }
}
export default {
  components: { allPaneConditions },

  data(){
    return Object.assign(
      // 分页信息
      {
        pageInfo: getPageInfo(),
      },
      // 数据
      {
        tableData: [],
      }
    )
  },

  methods: Object.assign(
    // 常规方法
    {
      init(payload){
        payload && this.reappearConditions(payload);
        this.getCheckSheetListAction()
      },

      // 重现条件和页数
      reappearConditions(payload){
        let { conditions, pageInfo }= payload;
        this.$refs.allPaneConditionsRef.init(conditions);
        Object.assign(this.pageInfo, pageInfo);
      },

      // 获取getCheckSheetListAction用到的参数
      getCheckSheetListData(){
        let object= this.$refs.allPaneConditionsRef.getConditions();
        return { object, ...this.pageInfo }
      },

      sizeChangeFunc(num){
        this.pageInfo.pageSize= num;
        this.pageActionHandler();
      },

      pageActionHandler(){
        this.$nextTick(() => {
          this.getCheckSheetListAction()
        })
      },
    },

    // 子组件emit触发
    {
      resetPageInfo(){
        this.pageInfo= getPageInfo();
        this.getCheckSheetListAction();
      }
    },

    // actions
    {
      // 获取列表
      getCheckSheetListAction(){
        let { object, pageIndex, pageSize, total }= this.getCheckSheetListData();
        console.log(object, pageIndex, pageSize, total)
        getCheckSheetList( object, pageIndex, pageSize, total )
        .then(res => {
          
        })
      },
    }
  )
}
</script>