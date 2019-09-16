<template>
  <div class="vivo" style="position:relative" id="tradeDetail">
    <el-dialog :visible="dialogFormVisible1" @close="closeAdd" style="width: 100%">
      <div class="buttonDv" style="float: right;margin-right: 3%;">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <el-button type="primary" @click="deleteDo">删除</el-button>
        <el-button type="primary" @click="editBtn">修改</el-button>
      </div>
      <p class="stepTitle">基本信息</p>
      <el-button type="info" round size="mini" style="margin-left: 4%;">审核中</el-button>
      <div class="stepDv">
        <p class="inputLabel"><span>ID：</span>{{baseInfo.ID}}</p>
        <p class="inputLabel"><span>申请人：</span>{{applicant}}</p>
        <p class="inputLabel"><span>创建时间：</span>{{baseInfo.creatTime}}</p>
        <p class="inputLabel"><span>收款明细说明：</span>{{baseInfo.mark}}</p>
        <p class="inputLabel"><span>收款账户：</span>{{baseInfo.payAccount}}</p>
        <p class="inputLabel"><span>收款金额：</span>{{baseInfo.payMoney}}</p>
        <p class="inputLabel"><span>收款时间：</span>{{baseInfo.creditTime}}</p>
        <p class="inputLabel"><span>款项入账时间：</span>{{baseInfo.startTime}}--{{baseInfo.endTime}}</p>
        <p class="inputLabel"><span>待认收款：</span>{{baseInfo.toCollection}}</p>
        <p class="inputLabel">
          <span>附件：</span>
          <el-upload ref="upload1" class="upload-demo" action="" :file-list="fileList" :disabled="disabled">
            <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
          </el-upload>
        </p>
        <p class="inputLabel"><span>分销商：</span>{{baseInfo.distributor}}</p>
      </div>
      <p class="stepTitle" v-if="showSK">收款明细</p>
      <div class="stepDv" style="margin-bottom: 50px;">
        <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTime}}--{{endTime}}</div>
        <el-table ref="singleTable" :data="tableDataSK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
          <el-table-column prop="rece_at" label="入账时间" align="center">
          </el-table-column>
          <el-table-column prop="order_sn" label="订单编号" align="center">
          </el-table-column>
          <el-table-column prop="guest_name" label="客人名称" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品" align="center">
          </el-table-column>
          <el-table-column prop="rece_money" label="结算金额" align="center">
          </el-table-column>
          <el-table-column prop="charge" label="手续费" align="center">
          </el-table-column>
          <el-table-column prop="tour_no" label="团号" align="center">
          </el-table-column>
          <el-table-column prop="divide_connect_no" label="粉联号" align="center">
          </el-table-column>
          <el-table-column prop="invoice_no" label="发票号" align="center">
          </el-table-column>
          <el-table-column prop="" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="detailBtn(scope.row)" v-if="scope.row.order_sn != '' && scope.row.import_status == 3">绑定订单详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--绑定订单详情-->
      <el-dialog title="绑定订单详情" :visible="dialogFormVisible" width=90% @close="close" append-to-body>
        <div class="table_trip" style="width: 100%;">
          <el-table ref="singleTable" :data="tableDataDD" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass">
            <el-table-column prop="order_sn" label="订单ID" align="center" >
            </el-table-column>
            <el-table-column prop="distributor" label="分销商" align="center">
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称" align="center">
            </el-table-column>
            <el-table-column prop="type_name" label="类别" align="center">
            </el-table-column>
            <el-table-column prop="sale_at" label="下单时间" align="center">
            </el-table-column>
            <el-table-column prop="option" label="费用" align="center" width="100">
              <template slot-scope="scope">
                <span>收入:{{scope.row.income}}</span><br>
                <span>单票成本:{{scope.row.single_cost}}</span><br>
                <span>总成本:{{scope.row.cost}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center">
            </el-table-column>
            <el-table-column prop="money" label="客人信息" align="center">
              <template slot-scope="scope">
                <span>取票人:{{scope.row.contact_name}}</span><br>
                <span>手机:{{scope.row.contact_phone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="check_at" label="验证时间" align="center" width="100">
            </el-table-column>
            <el-table-column prop="pay_type" label="卖出支付方式" align="center" width="100">
              <template slot-scope="scope">
                <span>{{payList[scope.row.pay_type]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="导入时间" align="center">
            </el-table-column>
            <el-table-column prop="tour_no" label="关联产品" align="center">
              <template slot-scope="scope">
                <span>产品名称:{{scope.row.pro_product_name}}</span><br>
                <span>团期计划:{{scope.row.tour_no}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_uid" label="操作人" align="center" width="100">
            </el-table-column>
          </el-table>
        </div>

        <div class="footer" style="text-align: right;">
          <el-button class="el-button" type="warning" @click="close">取 消</el-button>
          <!--<el-button class="el-button" type="primary" @click="">确 认</el-button>-->
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "tradeAdd",
    components: {
    },
    props: {
      dialogFormVisible1: false,
      info: ''
    },
    data() {
      return {
        disabled: true,

        baseInfo: {
          ID: '',
//          applicant: '',
          creatTime: '',
          creditTime: '',
          mark: '',
          payAccount: '',
          payAccountID: '',
          distributor: '',
          payMoney: '',
          startTime: '',
          endTime: '',
          toCollection: ''
        },
        applicant: '',
        fileList: [],
        tableDataSK: [],
        totalItem: '',
        totalMoney: '',
        startTime: '',
        endTime: '',
        tableDataDD: [],
        dialogFormVisible: false,

        showSK: true,

        payList: {
          '1': '产品自销',
          '2': '授信支付',
          '3': '微信',
          '4': '易宝云企付',
          '5': '余额支付',
          '6': '支付宝',
          '7': '自采'
        }
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler:function(){
          console.log(this.info);
          if(this.info != '' && this.dialogFormVisible1){
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
//      关闭弹窗
      closeAdd(){
        this.$emit('close', false);
      },
//      删除
      deleteDo(){
        this.$confirm("是否删除该笔收款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const that = this;
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/delrece", {
            "id": this.info
          }, ).then(function(response) {
            console.log(response);
            if (response.data.code == '200') {
              that.$message.success("删除成功~");
              that.close();
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning('失败~');
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
//
      editBtn(){
        this.$emit('close', 'success');
      },
      detailBtn(row){
        this.dialogFormVisible = true;
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/order", {
          "order_sn": row.order_sn
        }, ).then(function(response) {
          console.log('详情',response);
          if (response.data.code == '200') {
            that.tableDataDD = [];
            response.data.data.created_at = formatDate(new Date(response.data.data.created_at*1000));
            response.data.data.sale_at = formatDate(new Date(response.data.data.sale_at*1000));
            response.data.data.check_at = formatDate(new Date(response.data.data.check_at*1000));
            that.tableDataDD.push(response.data.data);
            that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
              "id": that.tableDataDD[0].create_uid
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              }
            }).then(function(response) {

              if (response.data.isSuccess) {
                that.tableDataDD[0].create_uid = response.data.object.name
              } else {
                that.$message.success("获取申请人失败~");
              }
            }).catch(function(error) {
              console.log(error);
            });

          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
//      关闭订单详情
      close(){
        this.dialogFormVisible = false;
      },
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/receive", {
          "id": this.info
        }, ).then(function(response) {
          console.log('详情',response);
          if (response.data.code == '200') {
            that.rece_codeEdit = response.data.data.rece_code;
            response.data.data.created_at = formatDate(new Date(response.data.data.created_at*1000));
            response.data.data.receivables_at = formatDate(new Date(response.data.data.receivables_at*1000));
            response.data.data.rece_start = formatDate(new Date(response.data.data.rece_start*1000));
            response.data.data.rece_end = formatDate(new Date(response.data.data.rece_end*1000));
            that.baseInfo = {
              ID: response.data.data.id,
              creatTime: response.data.data.created_at,
              creditTime: response.data.data.receivables_at,
              payAccount: response.data.data.account_id,
              payAccountID: response.data.data.account_id,
              mark: response.data.data.explain,
              distributor: response.data.data.distributor,
              payMoney: response.data.data.rece_money,
              startTime: response.data.data.rece_start,
              endTime: response.data.data.rece_end,
              toCollection: response.data.data.money_wait,
            };
            that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
              "id": response.data.data.create_uid
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              }
            }).then(function(response) {
              console.log('名字',response.data.object.name);
              if (response.data.isSuccess) {
                that.applicant = response.data.object.name;
              } else {
                that.$message.success("失败~");
              }
            }).catch(function(error) {
              console.log(error);
            });

            if(response.data.data.file != ''){
              that.fileList = [];
              that.fileList.push({
                name: response.data.data.file.split('/')[6]
              });
              that.tableDataSK = response.data.data.list;
              that.tableDataSK.forEach(function (item, index, arr) {
                item.rece_at = formatDate(new Date(item.rece_at*1000));
                item.rece_at = item.rece_at.split(" ")[0];
              });
              that.totalItem = response.data.data.list.length;
              that.totalMoney = response.data.data.rece_money;
              that.startTime = response.data.data.rece_start;
              that.endTime = response.data.data.rece_end
            }else{
              that.tableDataQK = '';
              that.totalItem = '';
              that.totalMoney = '';
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

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #tradeDetail .el-dialog{
    width: 90%;
  }
  #tradeDetail .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #tradeDetail .stepDv{
    width: 94%;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .inputLabel{
      width: 31%;
      font-size: 14px;
      line-height: 45px;
      margin: 0;
      vertical-align: top;
      span{
        display: inline-block;
        width: 120px;
      }
    }
    .baseIn{
      width: 300px;
      vertical-align: top;
      margin: 10px auto;
    }
    .upload-demo{
      width: 80%;
      display: inline-block;
      margin: 10px auto;
    }
  }
  #tradeDetail .el-upload-list__item{
    margin-top: 10px !important;
  }
  #tradeDetail .el-upload-list__item{
    width: 100%!important;
  }
  .lineTitle{
    width: 100%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
</style>
