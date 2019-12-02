<template>
  <div class="vivo" style="position:relative">
    <!--认收款-->
    <el-dialog title="认收款" :visible="dialogFormVisible2" width=90% @close="closeAdd">
      <div class="tableDv">
        <!--订单信息-->
      <div class="table_trip" style="width: 100%;">
        <el-table ref="multipleTable1" :data="tableData" border style="width: 100%;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="sale_at" label=" 下单时间" align="center">
          </el-table-column>
          <el-table-column prop="" label="费用" align="center" width="160">
            <template slot-scope="scope">
              <span>收入:{{scope.row.income}}</span><br>
              <span>单票成本:{{scope.row.single_cost}}</span><br>
              <span>总成本:{{scope.row.cost}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center" width="50">
          </el-table-column>
          <el-table-column prop="" label="客人信息" align="center" width="145">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <!--订单信息  end-->

        <!--匹配信息-->
      <div class="bottom">
        <!--收款列表-->
        <ul class="leftNav" style="max-height: 700px;overflow-y: auto;overflow-x: hidden;">
          <li v-for="(item, index) in navData" :key="index" :data-val="item.id" @click="clickNavHandle(item, index)" :class="{'active':activeIndex==index}">{{item.explain}} -- {{item.rece_money}}</li>
        </ul>
        <!--收款列表  end-->

        <!--收款明细-->
        <div class="table_trip" style="width: 76%;">
          <div class="topTitle">
            <p>款项入账时间：{{date}}</p>
            <p>分销商：{{distributor}}</p>
            <p v-if="!hasAttachment">待认收款：{{tableDataMX[0].rece_money}}</p>
          </div>
          <div style="text-align: right" v-if="!hasAttachment">
            <el-button @click="doSubmit(tableDataMX[0])" type="primary">认收款</el-button>
          </div>
          <div class="searchDv" v-if="hasAttachment">
            <span class="search-title">产品名称:</span>
            <el-input v-model="activeForm.title" class="input"></el-input>
            <span class="search-title">订单ID:</span>
            <el-input v-model="activeForm.oid" class="input"></el-input>
            <span class="search-title">入账时间:</span>
            <el-date-picker v-model="activeForm.enterTime" type="date" placeholder="开始天数" class="input"></el-date-picker>
            <span class="search-title">客人名称:</span>
            <el-input v-model="activeForm.name" class="input"></el-input>
            <span class="search-title">结算金额:</span>
            <el-input v-model="activeForm.num1" class="inputShort" placeholder="最小金额"></el-input>
            <span>--</span>
            <el-input v-model="activeForm.num2" class="inputShort" placeholder="最大金额"></el-input>
            <span class="search-title"></span>
            <div class="button_select">
              <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
              <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
            </div>
          </div>
          <el-table ref="multipleTable" :data="tableDataMX" border style="width: 100%;margin-top: 20px;" height="650" :header-cell-style="getRowClass" v-if="hasAttachment">
            <el-table-column prop="" label="" align="center" width="40">
              <template slot-scope="scope">
                <p v-if="tableData[0].sale_at.split(' ')[0] == scope.row.rece_at && tableData[0].income == scope.row.rece_money" style="color: red;">建议匹配</p>
              </template>
            </el-table-column>
            <el-table-column prop="rece_at" label="入账时间" align="center">
            </el-table-column>
            <el-table-column prop="order_sn" label="订单编号" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.order_sn">{{scope.row.order_sn}}</span>
                <span v-else>{{scope.row.plat_order_sn}}</span>
              </template>
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
            <el-table-column prop="money" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="text" style="color: red;" @click="doSubmit(scope.row)">认收款</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--收款明细  end-->
      </div>
        <!--匹配信息  end-->
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
    name: "recognitionDo",
    components: {
    },
    props: {
      dialogFormVisible2: false,
      info: '',
    },
    data() {
      return {
        activeForm: {
          title: '',
          oid: '',
          enterTime: '',
          name: '',
          num1: '',
          num2: ''
        },// 收款明细查询筛选项
        tableData: [],// 订单信息table
        navData: [],// 左侧收款明细列表
        tableDataMX: [],// 收款明细列表
        activeIndex: 0,// 当前收款明细列表index
        date: '',// 款项入账时间
        distributor: '',// 分销商
        item: '',// 收款列表选中项信息
        hasAttachment: true// 是否有收款明细
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler: function () {
          console.log('this.info',this.info);
          if(this.info == ''){
            this.closeAdd();
          }else{
            this.loadData();
          }

        }
      }
    },
    created(){
      this.loadData();
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
      // 收款明细侧边栏点击事件
      clickNavHandle(item, index){
        this.activeIndex = index;
//        console.log(item);
        this.item = item;
        this.getReceiptDetail();
      },
      // 关闭此弹窗
      closeAdd() {
        this.$emit('close', false);
      },
      // 加载基础数据
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/recorderinfo", {
          "order_sn": this.info
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            response.data.data.sale_at = formatDate(new Date(response.data.data.sale_at*1000));
            that.tableData = [];
            that.tableData.push(response.data.data);
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/receiptlist", {
          "limit": 0
        }, ).then(function(response) {
          if (response.data.code == '200') {
            // console.log('=======这里看金额',response);
            that.navData = response.data.data;
            that.item = that.navData[0];
            that.activeIndex = 0;
            that.getReceiptDetail();
          } else {
            that.$message.warning("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      // 搜索
      searchHand(){
        this.getReceiptDetail();
      },
      // 重置
      resetHand(){
        this.activeForm = {
          title: '',
          oid: '',
          enterTime: '',
          name: '',
          num1: '',
          num2: ''
        };
        this.getReceiptDetail();
      },
      // 获取收款明细
      getReceiptDetail(){
        const that = this;
//        console.log(this.$refs.multipleTable);
//        console.log(this.$refs.multipleTable1);
//        console.log(this.item.rece_start);
//        console.log(this.item.rece_end);
        if(this.item.rece_start == null) {
          const timeToday = new Date();
          const year = timeToday.getFullYear();
          const month = timeToday.getMonth() + 1;
          const day = timeToday.getDate();
          this.date = (year - 1) + '-' + month + '-' + day +'--'+(year + 1) + '-' + month + '-' + day;
        } else {
          this.date = formatDate(new Date(this.item.rece_start*1000))+'--'+formatDate(new Date(this.item.rece_end*1000));
        }

        this.distributor = this.item.distributor;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/receiptdetail", {
          "rec_id": this.item.id,
          "product_name": this.activeForm.title,
          "plat_order_sn": this.activeForm.oid,
          "rece_at": this.activeForm.enterTime,
          "guest_name": this.activeForm.name,
          "min_rece_money": this.activeForm.num1,
          "max_rece_money": this.activeForm.num2
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('明细信息',response);
            that.tableDataMX = response.data.data.info;
            that.hasAttachment = response.data.data.flag;
            if(that.tableDataMX.length != 0){
              that.tableDataMX.forEach(function (item, index, arr) {
                item.rece_at = formatDate(new Date(item.rece_at*1000));
                item.rece_at = item.rece_at.split(" ")[0];
              })
            }
            console.log(that.$refs.multipleTable);
//            that.$refs.multipleTableMX.scrollTop = 200;
          } else {
            that.$message.warning("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      // 提交认款
      doSubmit(row){
        console.log('1',row);
        const that = this;
//        alert('收入：'+that.tableData[0].income);
//        alert('待认收款金额：'+row.rece_money);
//        alert(parseFloat(that.tableData[0].income) > parseFloat(row.rece_money));
//        if(parseFloat(that.tableData[0].income) > parseFloat(row.rece_money)){
//          that.$message.warning("待认收款金额小于收入，不能提交认款");
//        }else {
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/submitrec", {
            "order_sn": this.tableData[0].order_sn,
            "rec_detail_id": row.id,
            "create_uid": sessionStorage.getItem('id')
          }, ).then(function(response) {
            if (response.data.code == '200') {
              console.log('提交认款',response);
              that.$message.success("认款成功~");
              that.closeAdd();
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning("认款失败~");
              }

            }
          }).catch(function(error) {
            console.log(error);
          });
//        }
      }

    },
    created(){

    }
  }

</script>
<style lang="scss" scoped>
  .tableDv{
    padding-bottom: 20px;
  }
  .bottom{
    width: 100%;
    display: flex;
    margin: 20px auto;
    justify-content: space-between;
  }
  .leftNav{
    width: 20%;
    list-style: none;
    padding: 0;
    margin: 0;
    li{
      width: 100%;
      line-height: 22px;
      font-size: 16px;
      padding: 10px;
      cursor: pointer;
      box-sizing: border-box;
    }
    li.active{
      /*color: #ffffff;*/
      background-color: #f7f7f7;
    }
  }
  .leftNav::-webkit-scrollbar {
    display: none;
  }
  .searchDv{
    width: 100%;
    background-color: #f7f7f7;
    padding: 20px 0;
    .search-title {
      font-size: 14px;
      margin-left: 10px;
      margin-top: 10px;
      margin-right: 20px;
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    .input{
      width: 20%;
      margin-bottom: 10px;
    }
    .inputShort{
      width: 8%;
      margin-bottom: 10px;
    }
    .button_select{
      display: inline-block;
      width: 20%;
      text-align: right;
    }
  }
  .topTitle{
    width: 100%;
    margin: 0 auto;
    display: flex;
    height: 45px;
    line-height: 45px;
    background-color: #f7f7f7;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
  }
  .topTitle p{
    margin: 0;
    width: 50%;
    height: 45px;
    line-height: 45px;
  }
  .footer{
    position: relative;
    width: 100%;
    height: 50px;
    float: right;
    margin-top: -20px;
    .el-button {
      bottom: 1%;
      right: 1%;
      float: right;
      margin: 0 10px;
    }
  }
</style>
