<template>
  <div class="vivo" style="position:relative">
    <el-dialog title="认收款" :visible="dialogFormVisible2" width=90% @close="closeAdd">
      <div class="tableDv">
      <div class="table_trip" style="width: 100%;">
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%;" :header-cell-style="getRowClass">
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
      <div class="bottom">
        <ul class="leftNav">
          <li v-for="(item, index) in navData" :data-val="item.id" @click="clickNavHandle(item, index)" :class="{'active':activeIndex==index}">{{item.name}}</li>
        </ul>
        <div class="table_trip" style="width: 76%;">
          <div class="topTitle">
            <p>新款入账时间：{{date}}</p>
            <p>分销商：{{distributor}}</p>
          </div>
          <div class="searchDv">
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
              <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
              <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
            </div>
          </div>
          <el-table ref="multipleTable" :data="tableData" border style="width: 100%;margin-top: 20px;" :header-cell-style="getRowClass">
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
    name: "recognitionDo",
    components: {
    },
    props: {
      dialogFormVisible2: false,
      info: '',
    },
    data() {
      return {
        pid: '',
        transmit: false,
        activeForm: {
          title: '',
          oid: '',
          enterTime: '',
          name: '',
          num1: '',
          num2: ''
        },
        tableData: [],
        multipleSelection: [],
        currentRow: true,
        navData: [{
          id: '123',
          name: '2019年快钱对账明细(7.31-8.1)'
        },{
          id: '124',
          name: '2019年快钱对账明细(7.31-8.1)'
        },{
          id: '125',
          name: '2019年快钱对账明细(7.31-8.1)'
        },{
          id: '126',
          name: '2019年快钱对账明细(7.31-8.1)'
        }],
        activeIndex: 0,
        date: '2019.8.21-2019.8.24',
        distributor: '美团'
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler: function () {
          console.log('this.info',this.info);
          this.loadData();
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
      submitBtn(){
        //...
      },
      handleClick() {
        this.reable = true;
        this.transmit = !this.transmit;
        this.pid = ''
      },
      clickNavHandle(item, index){
        this.activeIndex = index;
      },
      closeAdd() {
        this.$emit('close', false);
      },
      loadData(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/order/external-order/recorderinfo", {
          "order_sn": this.info
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            response.data.data.sale_at = formatDate(new Date(response.data.data.sale_at*1000));
            that.tableData.push(response.data.data);
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    created(){
//      console.log(this.$route.params);
//      console.log(this.$route.query);
//      this.tableData = this.$route.query;
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
    }
    li.active{
      /*color: #ffffff;*/
      background-color: #f7f7f7;
    }
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
