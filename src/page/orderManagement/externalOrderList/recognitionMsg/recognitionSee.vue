<template>
  <div class="vivo" style="position:relative">
    <!--申请预付款-->
    <el-dialog title="查看" :visible="dialogFormVisible" width=90% @close="closeAdd">
      <div class="table_trip" style="width: 100%;">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="true" :header-cell-style="getRowClass">
          <el-table-column prop="oid" label="订单ID" align="center" >
          </el-table-column>
          <el-table-column prop="title" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="type" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="time" label="下单时间" align="center">
          </el-table-column>
          <el-table-column prop="money" label="费用" align="center">
          </el-table-column>
          <el-table-column prop="number" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="customer" label="客人信息" align="center">
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="matchBtn" round style="display: block;margin: 18px auto;float: none;">匹配</el-button>
        <div class="backgroundDv">
          <div class="titleDv" style="width: 90%;margin: 10px auto;">
            <p class="textP">收款明细说明：{{instructions}}</p>
            <p class="textP">新款入账时间：{{data}}</p>
            <p class="textP">分销商：{{distributors}}</p>
          </div>
          <el-table ref="singleTable" :data="tableData1" border style="width: 90%;margin: 10px auto;" :highlight-current-row="true" :header-cell-style="getRowClass">
            <el-table-column prop="oid" label="入账时间" align="center" >
            </el-table-column>
            <el-table-column prop="title" label="订单号" align="center">
            </el-table-column>
            <el-table-column prop="type" label="客人名称" align="center">
            </el-table-column>
            <el-table-column prop="time" label="产品" align="center">
            </el-table-column>
            <el-table-column prop="money" label="结算金额" align="center">
            </el-table-column>
            <el-table-column prop="number" label="团号" align="center">
            </el-table-column>
            <el-table-column prop="customer" label="粉联号" align="center">
            </el-table-column>
            <el-table-column prop="customer" label="发票号" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer">
        <el-button class="el-button" type="warning" @click="closeAdd">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "recognitionSee",
    components: {},
    props: {
      dialogFormVisible: false,
      infoId: '',
    },
    data() {
      return {
        instructions: '2019年快钱对账明细(7.31-8.1)',
        data: '2019-8-1 到 2019-8-1',
        distributors: '无',
        tableData: [],
        tableData1: []
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
//      infoId: {
//        handler:function(){
//          this.loadData()
//        }
//      }
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
        this.$emit('close', false);
      },
      matchBtn(){

      },
      loadData(){
        console.log(this.infoId);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/importlist", {
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize,
          "start_time": this.activeForm.startTime,
          "end_time": this.activeForm.endTime,
          "create_account": this.activeForm.user
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            that.tableData = response.data.data.list;
            that.total = response.data.data.total - 0;
            that.tableData.forEach(function (item, index, arr) {
              item.import_at = formatDate(new Date(item.import_at*1000));
            })
          } else {
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
  .backgroundDv{
    background-color: #f7f7f7;
    padding: 20px 0;
  }
  .table_trip {
    margin-top: 30px;
    margin-bottom: 40px;
  }
  .textP{
    width: 33.33%;
    float: left;
    text-align: center;
    overflow: hidden;
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
