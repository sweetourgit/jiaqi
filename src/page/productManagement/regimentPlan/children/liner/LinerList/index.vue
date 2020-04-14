<style lang="scss" scoped>
.list-page{
  height: 100%; 
  overflow: auto;
}
</style>

<template>
  <div class="list-page">
    <ListHeader ref="conditionGround"
      @reset-pageinfo="resetPageInfo">
    </ListHeader>
    <main>
      <div style="padding-top: 20px;">
        <el-table border style="width: 100%"
          :data="tableData" 
          :highlight-current-row="false"
          header-row-class-name="row-header">
          <el-table-column label="标题" prop="tour_no" header-align="center" align="center"></el-table-column>
          <el-table-column label="状态" prop="statusText" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column label="产品名称" prop="product_name" header-align="center" align="center"></el-table-column>
          <el-table-column label="出行日期" prop="time" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column label="报账状态" prop="bill_status" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column label="房间库存" prop="room_stock" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column label="剩余房间" prop="surplus_room_stock" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column label="人数库存" prop="number_stock" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column label="剩余人数" prop="surplus_room_num" header-align="center" align="center" width="80"></el-table-column>
          <el-table-column label="操作人员" header-align="center" align="center" width="120"></el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <div style="display:inline-block" v-show="scope.row.status=== PLAN_STATUS.NORMAL">
                <el-button type="text" size="mini"
                  @click="awakeEditor(scope.row)">
                  停售
                </el-button>
                <el-button type="text" size="mini"
                  @click="awakeEditor(scope.row)">
                  下单
                </el-button>
                <el-button type="text" size="mini"
                  @click="awakeEditor(scope.row)">
                  分房
                </el-button>
              </div>

              <div style="display:inline-block" v-show="scope.row.status=== PLAN_STATUS.PRE_FULL || scope.row.status=== PLAN_STATUS.FULL">
                <el-button type="text" size="mini"
                  @click="awakeEditor(scope.row)">
                  分房
                </el-button>
              </div>

              <div style="display:inline-block" v-show="scope.row.status=== PLAN_STATUS.CLOSE">
                <el-button type="text" size="mini"
                  @click="awakeEditor(scope.row)">
                  报账单
                </el-button>
              </div>

              <div style="display:inline-block;padding-left: 10px;">
                <el-button type="text" size="mini"
                  @click="awakeEditor(scope.row)">
                  详情
                </el-button>
                <el-button type="text" size="mini"
                  @click="awakeEditor(scope.row)">
                  出团通知书
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
    <footer>
      <div style="display: flex; justify-content: center; padding-top: 20px;">
        <el-pagination background
          :current-page.sync="pageInfo.pageIndex"
          :page-sizes="[5, 10]"
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
import { Random } from 'mockjs'
import ListHeader from './comps/ListHeader'
import { PLAN_STATUS, CHECK_STATUS } from './dictionary'
import { getSkuPlanListPage } from './api'

const getPageInfo= function(total){
  return {
    pageIndex: 1,
    pageSize: 10,
    total: total || 0
  }
}
export default {

  components: { ListHeader },

  mounted(){
    this.init();
  },

  data(){
    return {
      pageInfo: getPageInfo(),
      tableData: [],
      PLAN_STATUS
    }
  },

  methods: {

    init(){
      let payload= this.routeQueryHandler();
      if(payload) this.reappearConditions(payload);
      this.getListAction()
    },

    // 重现条件和页数
    reappearConditions(payload){
      let { conditions, pageInfo }= payload;
      this.$refs.searchConditions.init(conditions);
      Object.assign(this.pageInfo, pageInfo);
    },

    routeQueryHandler(){
      let result= {};
      let { conditions, pageInfo }= this.$route.query;
      if(!conditions && !pageInfo) return;
      this.$router.replace({ path: this.$route.path });
      if(conditions) result.conditions= JSON.parse(conditions);
      if(pageInfo) result.pageInfo= JSON.parse(pageInfo);
      return result;
    },

    resetPageInfo(){
      this.pageInfo= getPageInfo();
      this.getListAction();
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
      let conditions= this.$refs.conditionGround.getConditions();
      return { ...this.pageInfo, ...conditions };
    },

    getListAction(){
      let conditions= this.getListActionConditions();
      getSkuPlanListPage(conditions)
      .then(res => {
        let { total, list }= res;
        this.pageInfo.total= total;
        this.tableData= list.map(this.listAdaptor);
      })
      .catch(err => {
        console.log(err);
        this.tableData.splice(0);
      })
    },

    listAdaptor(item){
      let { set_out_year, set_out_month, set_out_day }= item;
      item.status= Random.integer(1, 5);
      item.statusText= PLAN_STATUS.getLabel(item.status);
      item.bill_status= CHECK_STATUS.getLabel(item.bill_status);
      item.time= set_out_year+ set_out_month.padStart(3, '-0')+ set_out_day.padStart(3, '-0');
      return item;
    }
  }

}
</script>