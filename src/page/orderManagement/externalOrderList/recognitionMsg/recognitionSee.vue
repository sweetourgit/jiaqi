<template>
  <div class="vivo" style="position:relative">
    <!--匹配信息查看-->
    <el-dialog title="查看" :visible="dialogFormVisible4" width=90% @close="closeAdd">
      <div class="table_trip" style="width: 100%;">
        <el-table ref="singleTable" :data="tableData" border style="width: 100%" :highlight-current-row="true" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center" >
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="sale_at" label="下单时间" align="center">
          </el-table-column>
          <el-table-column prop="money" label="费用" align="center">
            <template slot-scope="scope">
              <span>收入：{{scope.row.income}}</span><br/>
              <span>单票成本：{{scope.row.single_cost}}</span><br/>
              <span>总成本：{{scope.row.cost}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="customer" label="客人信息" align="center">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" round style="display: block;margin: 18px auto;float: none;">匹配</el-button>
        <div class="backgroundDv" v-if="type == 1">
          <div class="titleDv" style="width: 90%;margin: 10px auto;">
            <p class="textP">收款明细说明：{{instructions}}</p>
            <p class="textP">款项入账时间：{{data}}</p>
            <p class="textP">分销商：{{distributors}}</p>
          </div>
          <el-table ref="singleTable" :data="tableData1" border style="width: 90%;margin: 10px auto;" :highlight-current-row="true" :header-cell-style="getRowClass">
            <el-table-column prop="rece_at" label="入账时间" align="center" >
            </el-table-column>
            <el-table-column prop="plat_order_sn" label="订单号" align="center">
            </el-table-column>
            <el-table-column prop="guest_name" label="客人名称" align="center">
            </el-table-column>
            <el-table-column prop="rec_product_name" label="产品" align="center">
            </el-table-column>
            <el-table-column prop="rece_money" label="结算金额" align="center">
            </el-table-column>
            <!--暂时注释，不显示-->
            <!--<el-table-column prop="tour_no" label="团号" align="center">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="divide_connect_no" label="粉联号" align="center">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="invoice_no" label="发票号" align="center">-->
            <!--</el-table-column>-->
          </el-table>
        </div>
        <div class="backgroundDv" v-if="type == 2">
          <div class="titleDv">
            <p class="textP" v-if="distributor_code != '' && tableData[0].pay_type != 5">商户名称：{{distributor_code}}</p>
            <p class="textP">收款单号：{{rece_code}}</p>
          </div>
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
    name: "recognitionSee",
    components: {},
    props: {
      dialogFormVisible4: false,
      orderID: '',
    },
    data() {
      return {
        instructions: '', // 收款明细说明
        data: '', // 入账时间
        distributors: '', // 分销商
        tableData: [], // 订单数据
        tableData1: [], // 匹配数据
        type: 1,
        distributor_code: '',
        rece_code: ''
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
//        监听弹出层显示隐藏，弹出层显示&&orderID不为空时加载数据
      dialogFormVisible4: {
        handler:function(){
          if(this.orderID != '' && this.dialogFormVisible4){
            this.loadData()
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
//      关闭弹出层
      closeAdd() {
        this.$emit('close', false);
      },
//      加载页面数据
      loadData(){
//        alert(this.orderID);
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/recorderinfo", {
          "order_sn": this.orderID
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('基础信息',response);
            response.data.data.sale_at = formatDate(new Date(response.data.data.sale_at*1000));
            that.tableData = [];
            that.tableData.push(response.data.data);
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });

        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/ordermatchinfo", {
          "order_sn": this.orderID
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('匹配信息',response);
            that.type = response.data.data.type;
            if(response.data.data.type === 1){
              response.data.data.rece_at = formatDate(new Date(response.data.data.info.rece_at*1000));
              that.instructions = response.data.data.info.explain;
              if(response.data.data.info.rece_start == null) {
                const timeToday = new Date();
                const year = timeToday.getFullYear();
                const month = timeToday.getMonth() + 1;
                const day = timeToday.getDate();
                that.data = (year - 1) + '-' + month + '-' + day +'--'+(year + 1) + '-' + month + '-' + day;
              } else {
//                that.date = formatDate(new Date(response.data.data.info.rece_start*1000))+'--'+formatDate(new Date(response.data.data.info.rece_end*1000));
                that.data = formatDate(new Date(response.data.data.info.rece_start*1000)).split(" ")[0] + '--' + formatDate(new Date(response.data.data.info.rece_end*1000)).split(" ")[0];
              }
              that.distributors = response.data.data.info.rec_distributor;
              that.tableData1 = [];
              response.data.data.info.rece_at = formatDate(new Date(response.data.data.info.rece_at*1000));
              that.tableData1.push(response.data.data.info);
            }else if(response.data.data.type === 2){
              that.rece_code = response.data.data.rece_code;
              // 根据分销商ID获取名称
              if(response.data.data.distributor_code){
                that.$http.post(that.GLOBAL.serverSrcZb + "/universal/localcomp/api/get", {
                  "id": response.data.data.distributor_code
                }).then(function(obj) {
                  console.log('获取分销商',obj);
                  if(obj.data.isSuccess){
                    that.distributor_code = obj.data.object.name;
                  }else{
                    that.$message.warning("加载数据失败~");
                  }
                }).catch(function(obj) {
                  console.log(obj);
                });
              }else{
                that.distributor_code = '';
              }
            }

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
  .titleDv{
    width: 90%;
    margin: 10px auto;
    overflow: hidden;
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
