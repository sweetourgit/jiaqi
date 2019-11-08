<template>
  <div>
       <!--备注信息弹窗-->
       <el-dialog title="详情" :visible.sync="dialogFormDetail" class="city_list" width="950px">
           <div class="button">
             <el-button size="medium" @click="dialogFormDetail=false">取消</el-button>
             <el-button type="primary" size="medium">撤销</el-button>
             <!-- <el-button type="primary" size="medium">编辑</el-button> -->
           </div>
           <h1 class="title">基本信息</h1>
           <table class="essinfo">
             <tr>
               <td width="85">ID：</td>
               <td width="250">{{formDate.id}}</td>
               <td width="85">创建人：</td>
               <td width="250">{{formDate.createUser}}</td>
               <td width="85">创建时间：</td>
               <td width="250">{{formDate.createTime}}</td>
             </tr>
             <tr>
               <td>客商名称：</td>
               <td>{{formDate.name}}</td>
               <td>销售：</td>
               <td>{{formDate.saler}}</td>
               <td>收款方式：</td>
               <td v-show="formDate.collectionTypeEX == 1">账号收款</td>
               <td v-show="formDate.collectionTypeEX == 2">现金收款</td>
             </tr>
             <tr>             
               <td>收款账号：</td>
               <td>{{formDate.accounts.cardNum}}</td>
               <td>开户名：</td>
               <td>{{formDate.accounts.openingName}}</td>
               <td>开户行：</td>
               <td>{{formDate.accounts.openingBank}}</td>
             </tr>
             <tr>
               <td>金额：</td>
               <td>{{formDate.cardNum}}</td>
               <td>剩余金额：</td>
               <td></td>
               <td>储值卡：</td>
               <td>{{formDate.cardYesOrNo}}</td>
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
       formDate: {
         accounts: {
           cardNum: ''
         }
       },
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
         this.$http.post(this.GLOBAL.serverSrc + '/finance/introducingbroker/api/get', {
            "id": predepositId
         }).then(res => {
           this.formDate = res.data.object;
         })
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