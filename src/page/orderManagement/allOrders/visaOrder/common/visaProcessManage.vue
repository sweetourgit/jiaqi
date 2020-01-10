<template>
  <div>
       <!--流程管理弹窗-->
       <el-dialog title="流程管理" :visible.sync="dialogFormProcess" class="city_list" width="850px" style="margin-top:-50px" @close="cancle">
          <div class="main-left">
             <div>
               <el-button type="primary" circle size="medium">&nbsp;1&nbsp;</el-button>
               <span class="sta-title">下单成功</span>
             </div>
             <div class="line">
                 <div></div>
             </div>
             <div>
               <el-button type="primary" plain icon="el-icon-check" circle size="medium"></el-button>
               <span class="sta-title">下单成功</span>
             </div>
             





          </div>
          <div class="main-right"></div>
          <div slot="footer" class="footer">
            <el-button class="fl">取消订单</el-button>
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary">保存更改</el-button>
          </div>
       </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    orderId:0,
    variable:0,
    dialogType:0
  },
  data() {
    return {
       //流程管理弹窗
       dialogFormProcess:true,
       orderget:{},//保存单个订单信息
       orderStatus:[
         {name:"下单成功"},
         {name:"收到材料"},
         {name:"材料审核",list:
          [{title:"1",content:"2019-09-21"},
          {title:"1",content:"3天"},
          {title:"1",content:"缺少材料"}]
         },
         {name:"材料补交中",list:
          [{title:"1",content:"2019-09-21"},
          {title:"1",content:"3天"},
          {title:"1",content:"缺少材料"}]
         },
         {name:"材料制作中",date:"2019-09-21",time:"3天",problem:"缺少材料"},
         {name:"成功预约时间",attention:"2019-09-21"},
         {name:"送签",issuedate:"2019-09-21"},
         {name:"面签"},
         {name:"使馆审核中"},
       ],
       rules:{      

       }
    }
  },
  watch: {
      variable:function(){      
        if(this.dialogType==2){
          this.getOrder(this.orderId);   
          this.dialogFormProcess=true;    
        }    
     }
  },
  methods: {
      //流程管理
      getOrder(orderId){
        //查询一条订单信息
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderget',{
             "id": orderId
          }).then(res => {
            if(res.data.isSuccess == true){
               this.orderget = res.data.object;      
            }
          }).catch(err => {
            console.log(err)
        })
      },
      cancle(){   
        this.dialogFormProcess=false;
      }
    }
}
</script>

<style scoped>
  .fl{float:left}
  .footer{clear:both;padding-top:20px}
  .main-left{float:left;width:250px}
  .main-right{float:left}
  .line{display: inline-block;margin: 5px 0 5px 17px;min-height:25px;border-left:2px solid #eee}
</style>