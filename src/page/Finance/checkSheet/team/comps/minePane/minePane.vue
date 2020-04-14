<style lang="scss" scoped>
.mine-pane{
  &>header{
    padding: 10px 0;
  }
  &>main{
    .check-type-0{
      color: #909399;
    }
    .check-type-1{
      color: #67C23A;
    }
    .check-type-2{
      color: #F56C6C;
    }
  }
}
</style>

<template>
  <div class="mine-pane">
    <header>
      <mine-pane-conditions
        ref="minePaneConditions"
        @reset-pageinfo="resetPageInfo">
      </mine-pane-conditions>
    </header>
    <main>
      <el-table style="width: 100%" border
        :data="tableData"
        :highlight-current-row="false"
        :header-cell-style="getRowClass">
        <el-table-column align="center" prop="groupCode" label="团期计划" ></el-table-column>

        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span :class="'check-type-'+ scope.row.checkType">{{ scope.row.checkTypeEX }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="teamProTitle" align="center" label="产品名称"></el-table-column>

        <el-table-column prop="userName" label="申请人" align="center"></el-table-column>

        <el-table-column prop="createTime" label="申请时间" align="center">
          <template slot-scope="scope">
            {{ dateFormator(scope.row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="toDetailPage(scope.row)">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import { getFlowName, getFlowList, getMineCheckSheetList } from '../../api'
import minePaneConditions from './comps/minePaneConditions'

const getPageInfo= function(total){
  return {
    pageIndex: 1,
    pageSize: 10,
    total: total || 0
  }
}
export default {
  components: { minePaneConditions },

  data(){
    return Object.assign(
      // 数据
      {
        tableData: [],
        workflowCode: null
      },
      // 分页信息
      {
        pageInfo: getPageInfo(),
      },
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
        this.$refs.minePaneConditions.init(conditions);
        Object.assign(this.pageInfo, pageInfo);
      },

      // 获取getCheckSheetListAction用到的参数
      getCheckSheetListData(){
        let object= this.$refs.minePaneConditions.getConditions();
        let result= { startIndex: -1, endIndex: -1, workflowCode: this.workflowCode, userCode: sessionStorage.getItem('tel') }
        // getFlowList的起始时间字段是startTime
        result.startTime= object.beginTime? object.beginTime.toISOString(): "1970-01-01T00:00:00.000Z";
        result.endTime= object.endTime? object.endTime.toISOString(): new Date().toISOString();
        return result;
      },

      toDetailPage(row){

        let tab= 'mine';
        let { id, workItemID, guid,productType,planID }= row;
          console.log('productType',productType)
            console.log('planID',planID)
        this.$router.push({ path: '/checkSheetDetail/team', query: {
          id, workItemID, guid, tab,productType,planID
        }})
      },

      mixHandler(checkList, jqList){
        if(checkList.length!== jqList.length) console.error('checkList, jqList长度不匹配');
        let hit;
        checkList.forEach(el => {
          hit= jqList.find(jqEl => jqEl.jq_ID=== el.guid);
          Object.assign(el, hit);
        })
        return checkList;
      },

      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },

      dateFormator(dateStr){
        return this.$dateFormate(new Date(dateStr), 'yyyy-MM-dd hh:mm:ss')
      }
    },

    // 子组件emit触发
    {
      resetPageInfo(){
        this.pageInfo= getPageInfo();
        this.getMineCheckSheetListAction();
      }
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
          .then(jqList => {
            let guid= jqList.map(el => el.jq_ID);
            getMineCheckSheetList(guid)
            .then(res => {
              this.tableData= this.mixHandler(res, jqList);
              this.$emit('mine-count', (res && res.length || 0));
            })
            .catch(err => {
              this.tableData= [];
              this.$emit('mine-count', 0);
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
