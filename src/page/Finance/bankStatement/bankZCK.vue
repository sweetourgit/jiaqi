<template>
  <div class="distributor-content">
    <div class="buttonsDv">
      <el-button @click="submitBtn" type="primary">确认</el-button>
      <el-button @click="closeBtn" type="primary" plain>取消</el-button>
    </div>
    
  </div>
</template>

<script type="text/javascript">

export default {
  components: {
  },
  data() {
    return {
      activeName: 'first',
      tableData: [], // 表格数据

      pageCurrent: 1,
      pageSize: 10,
      total: 0,
    }
  },
  created () {
    this.loadData();
    this.activeName = this.$route.query.searchType;
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7;color:rgb(85, 85, 85);'
      } else {
        return ''
      }
    },
    // 关闭当前页面
    closeBtn(){
      this.$router.push({
        path: '/bankStatement',
        name: '银行流水单管理',
        params: {
          tabStatus: this.$route.query.searchType
        }
      });
    },
    // 提交暂存款选择项
    submitBtn(){

    },
    
    handleSizeChange(val){
      this.pageSize = val;
      this.pageCurrent = 1;
      this.loadData();
    },
    handleCurrentChange(val){
      this.pageCurrent = val;
      this.loadData();
    },
    loadData(){
      const that = this;
      // console.log(this.$route.query)
      this.$http.post(this.GLOBAL.serverSrc + "/finance/wa_payment/api/Search", {
        "pageIndex": this.pageCurrent,
        "pageSize": this.pageSize,
        "object": {
          "purpose_Merchant_code": this.$route.query.purpose_Merchant_code,
          "purpose_Date": this.$route.query.purpose_Date
        }
      }).then(function (obj) {
        // console.log('微信支付宝明细',obj);
        if(obj.data.isSuccess){
          that.total = obj.data.total;
          that.tableData = obj.data.objects;
          // that.tableDataNBSK.forEach(function (item, index, arr) {
          //   item.collectionTime = item.collectionTime.split('T')[0];
          // });
          // that.loadingNBSK = false;
        }else{
          // that.loadingNBSK = false;
          that.total = 0;
          that.tableData = [];
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .distributor-content{
    width: 99%;
    margin: 25px auto;
    height: auto;
    border: 1px solid #e6e6e6;
    #form-content{
      background: #f7f7f7;
      padding: 20px 10px;
      margin: 20px 10px;
      .buttonForm{
        text-align: end;
      }
      .el-select{
        width: 100% !important;
      }
      .line{
        text-align: center;
      }
    }
    .buttonsDv{
      width: 98%;
      margin-top: 10px;
      text-align: end;
    }
    #table-content{
      width: 98%;
      margin: 40px auto 20px;
      th, td{
        min-width: 60px;
      }
    }
    .block{
      width: 100%;
      text-align: center;
      margin: 30px auto;
    }
  }

</style>
