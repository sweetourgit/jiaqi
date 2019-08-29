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
        <p class="inputLabel"><span>申请人：</span>{{baseInfo.applicant}}</p>
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
      <p class="stepTitle">收款明细</p>
      <div class="stepDv" style="margin-bottom: 50px;">
        <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{baseInfo.startTime}}--{{baseInfo.endTime}}</div>
        <el-table ref="singleTable" :data="tableDataSK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="入账时间" align="center">
          </el-table-column>
          <el-table-column prop="order_sn" label="订单编号" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="客人名称" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="产品" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="结算金额" align="center">
          </el-table-column>
          <el-table-column prop="income" label="团号" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="粉联号" align="center">
          </el-table-column>
          <el-table-column prop="quantity" label="发票号" align="center">
          </el-table-column>
          <el-table-column prop="money" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="text" @click="detailBtn(scope.row)">绑定订单详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--绑定订单详情-->
      <el-dialog title="绑定订单详情" :visible="dialogFormVisible" width=90% @close="close" append-to-body>
        <div class="table_trip" style="width: 100%;">
          <el-table ref="singleTable" :data="tableDataDD" border style="width: 100%;margin-bottom: 28px;" :highlight-current-row="true" :header-cell-style="getRowClass">
            <el-table-column prop="oid" label="订单ID" align="center" >
            </el-table-column>
            <el-table-column prop="title" label="分销商" align="center">
            </el-table-column>
            <el-table-column prop="type" label="产品名称" align="center" width="70%">
            </el-table-column>
            <el-table-column prop="time" label="类别" align="center">
            </el-table-column>
            <el-table-column prop="money" label="下单时间" align="center">
            </el-table-column>
            <el-table-column prop="option" label="费用" align="center" width="100">
            </el-table-column>
            <el-table-column prop="time" label="数量" align="center">
            </el-table-column>
            <el-table-column prop="money" label="客人信息" align="center">
            </el-table-column>
            <el-table-column prop="option" label="验证时间" align="center" width="100">
            </el-table-column>
            <el-table-column prop="option" label="卖出支付方式" align="center" width="100">
            </el-table-column>
            <el-table-column prop="time" label="导入时间" align="center">
            </el-table-column>
            <el-table-column prop="money" label="关联产品" align="center">
            </el-table-column>
            <el-table-column prop="option" label="操作人" align="center" width="100">
            </el-table-column>
          </el-table>
        </div>

        <div class="footer" style="text-align: right;">
          <el-button class="el-button" type="warning" @click="close">取 消</el-button>
          <el-button class="el-button" type="primary" @click="">确 认</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
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
          ID: '15321',
          applicant: '大运通-财务部-阳阳',
          creatTime: '2019-07-26',
          creditTime: '2019-08-26',
          mark: '收款明细说明',
          payAccount: '622210219843214819',
          distributor: '马蜂窝',
          payMoney: '220.00',
          startTime: '2019-08-11',
          endTime: '2019-09-11',
          toCollection: '110.00'
        },
        fileList: [
          {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
          {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
        ],
        tableDataSK: [{}],
        totalItem: '2',
        totalMoney: '234.00',
        tableDataDD: [],
        dialogFormVisible: false,
      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler:function(){
          console.log(this.info);
//          this.loadData();
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

      },
//
      editBtn(){
        this.$emit('close', 'success');
      },
      detailBtn(){
        this.dialogFormVisible = true;
      },
//      关闭订单详情
      close(){
        this.dialogFormVisible = false;
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
