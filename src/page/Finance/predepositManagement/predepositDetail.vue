<template>
  <div>
       <!--备注信息弹窗-->
       <el-dialog title="详情" :visible.sync="dialogFormDetail" class="city_list" width="950px">
           <div class="button">
             <el-button size="medium" @click="dialogFormDetail=false">取消</el-button>
             <el-button type="primary" size="medium">撤销</el-button>
             <el-button type="primary" size="medium">编辑</el-button>
           </div>
           <h1 class="title">基本信息</h1>
           <table class="essinfo">
             <tr>
               <td width="85">ID：</td>
               <td width="250">123456</td>
               <td width="85">创建人：</td>
               <td width="250">阳阳</td>
               <td width="85">创建时间：</td>
               <td width="250">2019-12-23 12:23:23</td>
             </tr>
             <tr>
               <td>客商名称：</td>
               <td>竹园</td>
               <td>销售：</td>
               <td>阳阳</td>
               <td>收款方式：</td>
               <td>账号收款</td>
             </tr>
             <tr>             
               <td>收款账号：</td>
               <td>54651</td>
               <td>开户名：</td>
               <td>大运通</td>
               <td>开户行：</td>
               <td>中国银行</td>
             </tr>
             <tr>
               <td>金额：</td>
               <td>123.12</td>
               <td>剩余金额：</td>
               <td>123.12</td>
               <td>储值卡：</td>
               <td>12312</td>
             </tr>
           </table>
           <h1 class="title">收款信息</h1>
           <el-table :data="preList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border>
              <el-table-column  prop="orderId" label="收款订单" min-width="150" align="center"></el-table-column>
              <el-table-column  prop="orderCode" label="收款团期" min-width="150" align="center"></el-table-column>
              <el-table-column  prop="price" label="收款确认金额" min-width="150" align="center"></el-table-column>
              <el-table-column  prop="time" label="确认时间" min-width="150" align="center"></el-table-column>
           </el-table>
       </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    predepositId:0,
    variable:0
  },
  data() {
    return {
       dialogFormDetail:false,
       preList:[{
        "orderId":15151651,
        "orderCode":"asv-19990202-123",
        "price":"50.00",
        "time":"2019-12-23 12:23:23"
       }
       ]
    }
  },
  created(){
  },
  watch: {
      variable:function(){        
          this.getDetail(this.predepositId);   
          this.dialogFormDetail=true;    
      }
  },
  methods: {
      close(){
        this.dialogFormDetail=false;
      },
      getDetail(predepositId){
        console.log("查询...");
      },
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
    }
}
</script>

<style scoped>
  .essinfo{margin:20px 0 50px 10px;line-height: 30px}
  .title{margin:10px;font-size: 16px}
  .button{margin-right: 10px;text-align: right}
  .table{border:1px solid #e6e6e6;width:880px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 10px}
</style>