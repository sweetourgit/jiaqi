<template>
  <div>
       <!--流程管理弹窗-->
       <el-dialog title="流程管理" :visible.sync="dialogFormProcess" class="city_list" width="850px" style="margin-top:-50px" @close="cancle">
          <div class="main-left">
             <div v-for="(item,index) in orderStatusInfo"> 
               <div>
                 <el-button type="primary" plain circle size="medium" v-if="index!==orderStatusInfo.length-1"><span v-if="index<9">&nbsp;</span>{{index+1}}<span v-if="index<9">&nbsp;</span></el-button>
                 <el-button type="primary" icon="el-icon-check" circle size="medium" v-if="index===orderStatusInfo.length-1"></el-button>
                 <span class="sta-title">{{item.name}}</span>
               </div>
               <div class="line" v-bind:class="{line1:index!==orderStatusInfo.length-1}">
                   <div v-for="list in item.lists">{{list.title}}:{{list.content}}</div>
               </div>
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
       orderStatus:11,
       orderStatusInfo:[
         {name:"下单成功"},
         {name:"收到材料"},
         {name:"材料审核",lists:
          [{title:"开始审核日期",content:"2019-09-21"},
          {title:"预计审核时长",content:"3天"},
          {title:"审核问题",content:"缺少材料"}]
         },
         {name:"材料补交中",lists:
          [{title:"需补交材料",content:"身份证复印件"}]
         },
         {name:"材料制作中",lists:
          [{title:"开始制作日期",content:"2019-09-21"},
          {title:"预计制作时长",content:"3天"},
          {title:"制作中发现问题",content:"缺少材料"}]
         },
         {name:"成功预约时间",lists:
          [{title:"注意事项",content:"身份证复印件"}]
         },
         {name:"送签",lists:
          [{title:"预计出签日期",content:"2019-09-21"}]
         },
         {name:"面签"},
         {name:"使馆审核中",lists:
          [{title:"预计出签日期",content:"2019-09-21"}]
         },
         {name:"使馆审理完毕"},
         {name:"过签"},
         {name:"邮寄中",lists:
          [{title:"快递公司",content:"中通"},
          {title:"快递单号",content:"12345467"}]
         },
         {name:"待评价",lists:
          [{title:"评价",content:"非常好"}]
         },
         {name:"订单完成"}
       ],
       rules:{      

       }
    }
  },
  mounted(){

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
  .sta-title{color:#191818}
  .line{display: inline-block;margin: 5px 0 5px 17px;padding:3px 0 3px 23px;min-height:18px;line-height: 20px}
  .line1{border-left:3px solid #eee}
</style>