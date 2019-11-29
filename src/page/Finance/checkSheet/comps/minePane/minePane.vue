<style lang="scss" scoped>
.mine-pane{
  &>header{
    padding: 10px 0;
  }
}
</style>

<template>
  <div class="mine-pane">
    <header>
      <mine-pane-conditions></mine-pane-conditions>
    </header>
    <main>
      <el-table style="width: 100%" border
        :data="tableData"
        :highlight-current-row="false"
        :header-cell-style="getRowClass">
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
  </div>
</template>

<script>
import { getFlowName, getFlowList, getMineCheckSheetList } from '../../api'
import minePaneConditions from './comps/minePaneConditions'

export default {
  components: { minePaneConditions },

  data(){
    return Object.assign(
      // 数据
      {
        tableData: [],
        workflowCode: null
      }
    )
  },

  methods: Object.assign(
    // 常规方法
    {
      init(payload){
        payload && this.reappearConditions(payload);
        this.getMineCheckSheetListAction()
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
        let result= { startIndex: -1, endIndex: -1, workflowCode: this.workflowCode }
        // getFlowList的起始时间字段是startTime
        if(object.beginTime) result.startTime= object.beginTime;
        if(object.endTime) result.endTime= object.endTime;
        return result;
      },

      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
    },

    // actions
    {
      // 获取列表
      getMineCheckSheetListAction(){
        this.getFlowNameAction()
        .then(workflowCode => {

          this.workflowCode= workflowCode;
          let payload= this.getCheckSheetListData();
          getFlowList(payload)
          .then(guid => {

            getMineCheckSheetList(guid)
            .then(res => {

            })
          })
        })
      },

      getFlowNameAction(){
        if(this.workflowCode) return Promise.resolve(this.workflowCode);
        return getFlowName()
      }
    }
  )
}
</script>