<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="导入订单详情" :visible="dialogFormVisible" width=90% @close="closeAdd">
      <div>
        <span class="search-title" style="margin-right: 40px;">订单号:</span>
        <!--<span>{{order}}</span>-->
        <el-input v-model="order" class="input" placeholder="请输入订单号" style="width: 300px;"></el-input>
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
      </div>
      <div class="table_trip" style="width: 100%;">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="true" @row-click="clickBanle" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center" >
            <template slot-scope="scope">
              <span v-if="scope.row.order_sn">{{scope.row.order_sn}}</span>
              <span v-else>{{scope.row.plat_order_sn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="type_name" label="类别" align="center" width="70%">
          </el-table-column>
          <el-table-column prop="sale_at" label="销售时间" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="费用" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.income">
                <span>收入:{{scope.row.income}}</span><br>
                <span>单票成本:{{scope.row.single_cost}}</span><br>
                <span>总成本:{{scope.row.cost}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="customer" label="客人信息" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.contact_name">
                <span>取票人:{{scope.row.contact_name}}</span><br>
                <span>手机:{{scope.row.contact_phone}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="import_at" label="导入时间" align="center">
          </el-table-column>
          <el-table-column prop="" label="关联产品" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.tour_no">
                <span>产品名称:{{scope.row.relate_pro_name}}</span><br>
                <span>团期计划:{{scope.row.tour_no}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="bill_status_name" label="报账状态" align="center">
          </el-table-column>
          <el-table-column prop="option" label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button @click="delOrder(scope.row)" type="danger" size="small" class="table_details">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[5, 10, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total='total'>
          </el-pagination>
        </div>
      </div>

      <div class="footer">
        <el-button class="el-button" type="warning" @click="closeAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
export default {
  name: "importOrderInfo",
  components: {},
  props: {
    dialogFormVisible: false,
    infoId: '',
  },
  data() {
    return {
      total: 10, //总条数
      currentPage: 1,
      pageIndex: 1, // 设定当前页数
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求

      order: '',
      tableData: [],
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {
    infoId: {
      handler:function(){
        if(this.infoId == ''){
          this.closeAdd();
        }else{
          this.loadData();
        }

      }
    }
  },
  methods: {
    // 表格头部背景颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    //获取id
    clickBanle(row, event, column) {},
    closeAdd() {
      this.order = '';
      this.$emit('close2', false);
    },
    delOrder(row) {
      console.log(row['id']);
      this.$confirm('是否删除此外部订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
//        alert(row['order_sn']);
        if(row.bill_status == 1 || row.bill_status == 2 || row.bill_status == 6){
          const that = this;
          if(row['order_sn']){
            this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/del", {
              "order_sn": row['order_sn']
            }, ).then(function(response) {
              console.log('删除',response);
              if (response.data.code == '200') {
                console.log(response);
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                that.loadData();
              } else {
                if(response.data.message){
                  that.$message.warning(response.data.message);
                }else{
                  that.$message.warning("失败~");
                }

              }
            }).catch(function(error) {
              console.log(error);
            });
          }else{
            this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/nocostdel", {
              "plat_order_sn": row['plat_order_sn']
            }, ).then(function(response) {
              console.log('删除',response);
              if (response.data.code == '200') {
                console.log(response);
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                that.loadData();
              } else {
                if(response.data.message){
                  that.$message.warning(response.data.message);
                }else{
                  that.$message.warning("失败~");
                }
              }
            }).catch(function(error) {
              console.log(error);
            })
          }
        }else{
          this.$message.warning("该订单不是未认款状态，不可删除");
        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadData();
    },

    handleCurrentChange(val) {
      this.pageIndex = val;
      this.loadData();
    },
    searchHand(){
      this.loadData();
    },
    resetHand(){
      this.order = '';
      this.loadData();
    },
    loadData(){
      console.log(this.infoId);
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/vieworders", {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize,
        "import_id": this.infoId,
        "order_sn": this.order
      }, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.tableData = response.data.data.list;
          that.total = response.data.data.total - 0;
          that.tableData.forEach(function (item, index, arr) {
            item.import_at = formatDate(new Date(item.import_at*1000));
            item.sale_at = formatDate(new Date(item.sale_at*1000));
//            item.import_at = formatDate(new Date(item.import_at*1000));
          })
        } else {
          that.tableData = [];
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {

  }
}

</script>
<style lang="scss" scoped>
.table_trip {
  margin-top: 30px;
  margin-bottom: 40px;
}

.footer {
  position: relative;
  width: 100%;
  height: 50px;
  float: right;
  margin-top: -20px;
}

.el-button {
  bottom: 1%;
  right: 1%;
  float: right;
  margin: 0 10px;
}

.inputWidth {
  width: 450px;
}

.upload-demo {
  width: 550px;
}
.el-dialog__body{
  overflow: hidden;
}
.block{
  text-align: center;
  margin: 18px auto;
}
</style>
