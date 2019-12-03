<style lang="scss" scoped>
.supplier-list{
  padding-bottom: 100px;
  &>header{
    padding: 10px 0;
  }
}
</style>

<template>
  <div class="supplier-list">
    <header>
      <search-conditions
        ref="searchConditions"
        @reset-pageinfo="resetPageInfo">
        <el-button size="small" type="primary"
          @click="routerToAdd">
          新增
        </el-button>
      </search-conditions>
    </header>
    <main>
      <el-table style="width: 100%" border
        :data="tableData"
        :highlight-current-row="false"
        :header-cell-style="getRowClass">
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="name" label="供应商名称" align="center"></el-table-column>
        <el-table-column prop="userState" label="状态" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.userState=='1'" style="color: #7F7F7F">正常</div>
            <div v-if="scope.row.userState=='2'" style="color: #FF4A3D">停用</div>
            <div v-if="scope.row.userState=='0'" style="color: #33D174">等待审核</div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierTypeEX" label="类型" align="center"></el-table-column>
        <el-table-column prop="isMonthlyEX" label="结算方式" align="center"></el-table-column>
        <el-table-column prop="orgName" label="所属部门" align="center"></el-table-column>
        <el-table-column label="操作" width="159" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text"
              @click="routerToDetail(scope.row.id)">
              详情
            </el-button>
            <el-button size="small" type="text"
              @click="routerToEdit(scope.row.id)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div style="display: flex; justify-content: center; padding-top: 20px;">
        <el-pagination background
          :current-page.sync="pageInfo.pageIndex"
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
import { getSupplierList } from '../api'
import searchConditions from './subs/searchConditions'

const getPageInfo= function(total){
  return {
    pageIndex: 1,
    pageSize: 10,
    total: total || 0
  }
}
export default {
  components: { searchConditions },

  mounted(){
    this.init();
  },

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
    {
      init(){
        let payload= this.routeQueryHandler();
        this.reappearConditions(payload);
        this.getListAction()
      },

      routeQueryHandler(){
        let result= {};
        let { conditions, pageInfo }= this.$route.query;
        this.$router.replace({ path: this.$route.path });
        if(conditions) result.conditions= JSON.parse(conditions);
        if(pageInfo) result.pageInfo= JSON.parse(pageInfo);
        return result;
      },

      // 重现条件和页数
      reappearConditions(payload){
        let { conditions, pageInfo }= payload;
        this.$refs.searchConditions.init(conditions);
        Object.assign(this.pageInfo, pageInfo);
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
        // adaptor
        object.isDeleted= 0;
        this.$isNull(object.name) && (object.name= '');
        this.$isNull(object.isMonthly) && (object.isMonthly= 0);
        this.$isNull(object.supplierType) && (object.supplierType= -1);
        this.$isNull(object.UserState) && (object.UserState= -1);
        return { 
          object, 
          isGetAll: true,
          id: 0,
          ...this.pageInfo 
        }
      },

      getListAction(){
        let conditions= this.getListActionConditions();
        getSupplierList(conditions)
        .then(res => {
          let { total, objects }= res;
          this.pageInfo.total= total;
          this.tableData.splice(0);
          this.tableData.push(...objects);
        })
      },

      // 导向新增，携带本页当前状态
      routerToAdd(){
        let conditions= JSON.stringify( this.$refs.searchConditions.getConditions() );
        let pageInfo= JSON.stringify( this.pageInfo );
        this.$router.push({ path: '/supplierAdd', query: { conditions, pageInfo } });
      },
      routerToEdit(id){
        let conditions= JSON.stringify( this.$refs.searchConditions.getConditions() );
        let pageInfo= JSON.stringify( this.pageInfo );
        this.$router.push({ path: '/supplierEdit', query: { conditions, pageInfo, id } });
      },
      routerToDetail(id){
        let conditions= JSON.stringify( this.$refs.searchConditions.getConditions() );
        let pageInfo= JSON.stringify( this.pageInfo );
        this.$router.push({ path: '/supplierDetails', query: { conditions, pageInfo, id } });
      }
    }
  )

}
</script>