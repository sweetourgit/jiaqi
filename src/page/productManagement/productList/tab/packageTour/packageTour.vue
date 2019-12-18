<style lang="scss" scoped>
.package-tour{
  padding-bottom: 100px;
  &>header{
    padding: 10px 0;
  }
}
</style>

<template>
  <div class="package-tour">
    <header>
      <search-conditions
        ref="searchConditions"
        @reset-pageinfo="resetPageInfo">
      </search-conditions>
    </header>
    <main>
      <div style="padding-bottom: 10px;">
        <!-- <el-button type="primary" size="small">复制</el-button>
        <el-button type="primary" size="small">到处行程</el-button>
        <el-button type="primary" size="small">退改</el-button> -->
        <el-button type="primary" size="small"
          :disabled="!currentRowId"
          @click="routeToPlanInventory">
          团期/库存
        </el-button>
        <el-button type="primary" size="small"
          :disabled="!currentRowId"
          @click="routeToChangeInfo">
          修改行程信息
        </el-button>
      </div>
      <el-table border style="width: 100%"
        ref="elTable"
        :data="tableData"
        :highlight-current-row="true"
        :header-cell-style="getRowClass"
        @row-click="rowClick">
        <el-table-column prop="id" label="产品编号" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" align="center"></el-table-column>
        <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
        <el-table-column label="目的地" align="center">
          <template slot-scope="scope">
            <span>{{ podsColumnMaker(scope.row.pods) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="操作人" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center"></el-table-column>
        <el-table-column prop="opers" label="推送平台" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text"
              @click="routeToChangepro(scope.row.id)">
              编辑
            </el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div style="display: flex; justify-content: center; padding-top: 20px;">
        <el-pagination background
          :current-page.sync="pageInfo.pageIndex"
          :page-sizes="[5, 10, 50, 100]"
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
import searchConditions from './childs/searchConditions'
import { getProductList } from './api'

const staticObj= {
  type: '跟团游',
  state: '已上架',
  opers: '携程、飞猪'
}
const getPageInfo= function(){
  return {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  }
}
export default {

  components: { searchConditions },

  mounted(){
    this.init();
  },

  data(){
    return Object.assign(
      // 视图
      {
        currentRowId: null,
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

  methods: {
    init(){
      this.getListAction()
    },

    resetPageInfo(){
      this.pageInfo= getPageInfo();
      this.getListAction();
    },

    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },

    sizeChangeFunc(num){
      this.pageInfo.pageSize= num;
      this.pageActionHandler();
    },

    pageActionHandler(){
      this.$nextTick(() => {
        this.getListAction()
      })
    },

    getListActionConditions(){
      let object= this.$refs.searchConditions.getConditions();
      console.log(object)
      this.$isNull(object.id) && (object.id= 0);
      this.$isNull(object.title) && (object.title= '');
      this.$isNull(object.createUser) && (object.createUser= '');
      this.$isNull(object.podID) && (object.podID= 0);
      this.$isNull(object.destinationID) && (object.destinationID= 0);
      object.minPrice= this.$isNull(object.minPrice)? 0: parseFloat(object.minPrice);
      object.maxPrice= this.$isNull(object.maxPrice)? 0: parseFloat(object.maxPrice);
      return Object.assign({ object }, this.pageInfo )
    },

    getListAction(){
      let conditions= this.getListActionConditions();
      getProductList(conditions)
      .then(res => {
        let { total, objects }= res;
        this.pageInfo.total= total;
        this.tableData.splice(0);
        this.tableData.push(...objects.map(obj => Object.assign(obj, staticObj)));
      })
      .catch(err => {
        this.tableData.splice(0);
      })
    },

    podsColumnMaker(pods){
      return pods.map(pod => pod.pod).join('、');
    },

    rowClick(row, column){
      let { id }= row;
      if(this.currentRowId && this.currentRowId=== id){
        this.currentRowId= null;
        return this.$refs.elTable.setCurrentRow();
      }
      this.currentRowId= id;
    },
    routeToPlanInventory(){
      this.currentRowId && this.$router.push({ path: '/planInventory', query: { id: this.currentRowId } });
    },
    routeToChangeInfo(){
      this.currentRowId && this.$router.push({ path: '/changeinfo', query: { id: this.currentRowId } });
    },
    routeToChangepro(id){
      this.$router.push({ path: '/changepro', query: { id } });
    }
  }

}
</script>