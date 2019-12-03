<template>
  <div class="vivo" style="position:relative" id="tradeDetail">
    <el-dialog title="导入订单详情" :visible="dialogFormVisible1" @close="closeAdd" custom-class="city_list" :show-close="false" style="margin:-80px 0 0 0;width: 100%;">
      <div class="buttonDv">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <!--<el-button type="primary" @click="editBtn">修改</el-button>-->
        <!--<el-button type="primary" @click="editBtn" v-if="baseInfo.status_rece != 2">撤销</el-button>-->
      </div>
      <!--<p class="stepTitle">基本信息</p>-->
      <el-divider content-position="left">基本信息</el-divider>
      <el-button type="info" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 1">待认收款</el-button>
      <el-button type="success" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 2">已认完</el-button>
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
        <div class="inputLabel">
          <span style="vertical-align: top;">附件：</span>
          <!--<el-upload ref="upload1" class="upload-demo" action="" :file-list="fileList" :disabled="disabled">-->
          <!--<el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>-->
          <!--</el-upload>-->

          <ul style="display: inline-block;width: 70%;list-style: none;padding: 0;margin: 0;">
            <li v-for="item in fileList" :key="item.index">
              <a :href="item.url" target="_blank">{{item.name}}</a>
            </li>
          </ul>
        </div>
        <p class="inputLabel"><span>分销商：</span>{{baseInfo.distributor}}</p>
        <p class="inputLabel"></p>
      </div>
      <!--<p class="stepTitle" v-if="showSK">收款明细</p>-->
      <el-divider content-position="left" v-if="showSK">收款明细</el-divider>
      <div class="stepDv" style="margin-bottom: 50px;" v-if="showSK">
        <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTime}}--{{endTime}}</div>
        <el-table ref="singleTable" :data="tableDataSK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" maxHeight="700">
          <el-table-column prop="rece_at" label="入账时间" align="center">
          </el-table-column>
          <el-table-column prop="order_sn" label="订单编号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.plat_order_sn}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="guest_name" label="客人名称" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品" align="center">
          </el-table-column>
          <el-table-column prop="rece_money" label="结算金额" align="center">
          </el-table-column>
          <el-table-column prop="charge" label="手续费" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.charge}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="tour_no" label="团号" align="center">
          </el-table-column>
          <el-table-column prop="divide_connect_no" label="粉联号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.divide_connect_no}}</span>
            </template>
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
      <!--<p class="stepTitle" v-if="showXQ">订单详情</p>-->
      <el-divider content-position="left" v-if="showXQ">订单详情</el-divider>
      <div class="stepDv" style="margin-bottom: 50px;" v-if="showXQ">
        <el-table ref="singleTable" :data="tableDataXQ" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" maxHeight="700">
          <el-table-column prop="order_sn" label="订单ID" align="center" >
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.distributor}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="type_name" label="类别" align="center">
          </el-table-column>
          <el-table-column prop="sale_at" label="下单时间" align="center" width="100">
          </el-table-column>
          <el-table-column prop="option" label="费用" align="center">
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
              <span>{{scope.row.pay_type_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="import_at" label="导入时间" align="center" width="100">
          </el-table-column>
          <el-table-column prop="tour_no" label="关联产品" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.tour_no == ''">未关联产品</p>
              <p v-else>产品名称：{{scope.row.relate_pro_name}}<br>团期计划：{{scope.row.tour_no}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="create_uid" label="操作人" align="center" width="100">
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
                <div v-if="scope.row.tour_no">
                  <span>产品名称:{{scope.row.pro_product_name}}</span><br>
                  <span>团期计划:{{scope.row.tour_no}}</span>
                </div>
                <div v-else>未关联产品</div>
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
          toCollection: '',
          approved: '',
          status_rece: ''
        },
        applicant: '',
        fileList: [],
        tableDataSK: [],
        tableDataXQ: [],
        totalItem: '',
        totalMoney: '',
        startTime: '',
        endTime: '',
        tableDataDD: [],
        dialogFormVisible: false,

        showSK: true,
        showXQ: false,

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
//          alert(this.info);
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
        this.baseInfo = {
          ID: '',
          creatTime: '',
          creditTime: '',
          mark: '',
          payAccount: '',
          payAccountID: '',
          distributor: '',
          payMoney: '',
          startTime: '',
          endTime: '',
          toCollection: '',
          approved: '',
          status_rece: ''
        };
        this.totalItem = '';
        this.totalMoney = '';
        this.startTime = '';
        this.endTime = '';
        this.fileList = [];
        this.tableDataSK = [];
        this.tableDataXQ = [];
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
            that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
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
              approved: response.data.data.approved,
              status_rece: response.data.data.status_rece
            };
            that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
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
                that.$message.warning("失败~");
              }
            }).catch(function(error) {
              console.log(error);
            });

            if(response.data.data.file != '' && response.data.data.type == 1){
              that.fileList = response.data.data.file;
              for(let i = 0; i < that.fileList.length; i++){
                that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
              }
              that.tableDataXQ = [];
              that.tableDataSK = response.data.data.list;
              that.totalItem = response.data.data.list.length;
//              that.totalMoney = response.data.data.rece_money;
//              that.startTime = response.data.data.rece_start;
//              that.endTime = response.data.data.rece_end;
//              let start = that.tableDataSK[0].rece_at;
//              let end = that.tableDataSK[0].rece_at;
//              let totalMoney = 0;
              let start = formatDate(new Date(that.tableDataSK[0].rece_at*1000)).split(" ")[0];
              let end = formatDate(new Date(that.tableDataSK[0].rece_at*1000)).split(" ")[0];
              let totalMoney = 0;
              that.tableDataSK.forEach(function (item, index, arr) {
                item.rece_at = formatDate(new Date(item.rece_at*1000));
                item.rece_at = item.rece_at.split(" ")[0];
                if(new Date(Date.parse(start)) > new Date(Date.parse(item.rece_at))){
                  start = item.rece_at;
                }
                if(new Date(Date.parse(end)) < new Date(Date.parse(item.rece_at))){
                  end = item.rece_at;
                }

                totalMoney += parseFloat(item.rece_money);
//                console.log(totalMoney);
              });

              that.totalMoney = totalMoney.toFixed(2);
              that.startTime = start;
              that.endTime = end;
              that.showSK = true;
              that.showXQ = false;
            }else if(response.data.data.type == 2 && response.data.data.list.length != 0){
              if(response.data.data.distributor == '票付通余额'){
                that.fileList = response.data.data.file;
                for(let i = 0; i < that.fileList.length; i++){
                  that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
                }
              }
              that.tableDataSK = [];
              that.tableDataXQ = response.data.data.list;
              that.tableDataXQ.forEach(function (item, index, arr) {
                item.sale_at = formatDate(new Date(item.sale_at*1000));
                item.check_at = formatDate(new Date(item.check_at*1000));
                item.import_at = formatDate(new Date(item.import_at*1000));
                that.$http.post(that.GLOBAL.serverSrcZb + "/org/api/userget", {
                  "id": item.create_uid
                },{
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  }
                }).then(function(response) {
                  console.log('名字',response.data.object.name);
                  if (response.data.isSuccess) {
                    item.create_uid = response.data.object.name;
                  } else {
                    that.$message.warning("失败~");
                  }
                }).catch(function(error) {
                  console.log(error);
                });
              });
              that.totalItem = '';
              that.totalMoney = '';
              that.startTime = '';
              that.endTime = '';
              that.showSK = false;
              that.showXQ = true;
            }else{
              that.tableDataSK = '';
              that.tableDataXQ = '';
              that.totalItem = '';
              that.totalMoney = '';
              that.showSK = true;
              that.showXQ = false;
            }
            that.$http.post(that.GLOBAL.serverSrcZb + "/finance/collectionaccount/api/get",
              {
                "id": response.data.data.account_id
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }).then(function (obj) {
//                that.tableDataZH = obj.data.objects;
              console.log('账户查询',obj);
              if(obj.data.isSuccess){
                that.baseInfo.payAccount = obj.data.object.title;
              }
            }).catch(function (obj) {
              console.log(obj)
            });
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
  #tradeDetail .buttonDv{
    position: absolute;
    top: 8px;
    right: 3%;
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
  #tradeDetail .lineTitle{
    width: 100%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
</style>
