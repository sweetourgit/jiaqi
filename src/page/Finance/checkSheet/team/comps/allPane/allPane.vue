<style lang="scss" scoped>
.all-pane{
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
            <el-button size="small" type="primary" @click="toDetailPage(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div style="display: flex; justify-content: center; padding-top: 20px;">
        <el-pagination background
          ref="pagination"
          v-if="inited"
          :current-page.sync="pageInfo.pageIndex"
          :page-sizes="[2, 4, 8, 10]"
          :page-size.sync="pageInfo.pageSize"
          :total="pageInfo.total"
          @current-change="pageActionHandler"
          @prev-click="pageActionHandler"
          @next-click="pageActionHandler"
          @size-change="sizeChangeFunc"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
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
      {
        inited: false,
      },
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
        this.getCheckSheetListAction();
        this.inited= true;
      },

      // 重现条件和页数
      reappearConditions(payload){
        let { object, pageInfo }= payload;
        Object.assign(this.pageInfo, pageInfo);
        this.$refs.allPaneConditionsRef.init(object);
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
toDetailPage(row) {
        let tab = "all";
        let { id,guid } = row;
        let { object, ...pageInfo } = this.getCheckSheetListData();
        this.$router.push({
          path: "/checkSheetDetail/team",
          query: {
            id,
            tab,
            conditions: JSON.stringify({ object, pageInfo }),
            guid
          }
        });
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
        this.getCheckSheetListAction();
      }
    },

    // actions
    {
      // 获取列表
      getCheckSheetListAction(){
        let { object, pageIndex, pageSize }= this.getCheckSheetListData();
        getCheckSheetList({ object, pageIndex, pageSize })
        .then(res => {
          let { objects, total }= res;
          this.tableData.splice(0);
          this.tableData.push(...objects);
          this.pageInfo.total= total;
        })
        .catch(res => {
          this.tableData.splice(0);
        })
      },
    }
  )
}
</script>