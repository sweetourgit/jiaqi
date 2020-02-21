<template>
  <div>
       <!--流程管理弹窗-->
       <el-dialog title="流程管理" :visible.sync="dialogFormProcess"  custom-class="city_list" class="abow_dialog" width="940px" @close="cancle">
         <div :style="authDiocss"> 
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
          <div class="main-right">
            <el-form :model="processFrom" :rules="rules" ref="processFrom" label-width="20px" class="demo-ruleForm">
               <el-form-item prop="contactName">
                  <div class="required"><span>*</span>订单联系人</div>
                  <el-input v-model="processFrom.contactName" maxlength="10"></el-input>
               </el-form-item>
               <el-form-item prop="contactPhone">
                  <div class="required"><span>*</span>联系电话</div>
                  <el-input v-model="processFrom.contactPhone" maxlength="20"></el-input>
               </el-form-item>
               <el-table :data="tourList" class="table" :header-cell-style="getRowClass" border> 
                 <el-table-column  prop="name" label="姓名" width="80" align="center"></el-table-column>
                 <el-table-column  prop="phone" label="电话" width="110" align="center"></el-table-column>
                 <el-table-column  prop="idCard" label="身份证" width="170" align="center"></el-table-column>
                 <el-table-column  prop="card" label="护照号" width="130" align="center"></el-table-column>
                 <el-table-column  label="操作">
                      <template slot-scope="scope">
                         <el-breadcrumb separator="|">
                            <el-breadcrumb-item><span class="breadCrumbPointer">编辑</span></el-breadcrumb-item>
                            <el-breadcrumb-item><span class="breadCrumbPointer">删除</span></el-breadcrumb-item>
                         </el-breadcrumb>
                      </template>
                 </el-table-column>
               </el-table>
               <el-form-item>
                  <div class="required"><span>*</span>更改状态</div>
                  <el-select v-model="processFrom.orderStatu" placeholder="请选择">
                     <el-option v-for="item in processFrom.orderStatus" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
               </el-form-item>




            </el-form>
          </div>
          <div slot="footer" class="footer">
            <el-button class="cancel-order">取消订单</el-button>     
            <el-button class="fr save" type="primary">保存更改</el-button>
            <el-button class="fr" @click="cancle">取 消</el-button>
          </div>
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
       processFrom:{
         contactName:"",
         contactPhone:"",
         orderStatu:"",
         orderStatus:[
           {label:"收到材料",id:"1"},
           {label:"收到材料",id:"2"},
         ],
       },
       
       tourList:[{
         name:"测试",
         phone:"15845263256",
         idCard:"210113198809233726",
         card:"1546213213",
       }],
       authDiocss:{
　　　　 height:'',
         overflowY:'scroll'
　　　 },
       //流程管理弹窗
       dialogFormProcess:false,
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
         contactName: [
          { required: true, message: "订单联系人不能为空", trigger: "blur" },
          { max: 10, message: "不能超过10位长度", trigger: "blur" }
         ],
         contactPhone: [
           { required: true, message: "联系电话不能为空", trigger: "blur" },
           {
             pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
             message: "电话号格式不正确",
             trigger: "blur"
           },
           { max: 20, message: "不能超过20位长度", trigger: "blur" }
        ],
       }
    }
  },
  mounted(){

  },
  watch: {
      variable:function(){      
        if(this.dialogType==2){
          this.getHeight();
          this.getOrder(this.orderId);   
          this.dialogFormProcess=true;    
        }    
     }
  },
  methods: {
      getRowClass({ row, column, rowIndex, columnIndex }){
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:35px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      //流程管理
      getOrder(orderId){
        //查询一条订单信息
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderget',{
             "id": orderId
          }).then(res => {
            if(res.data.isSuccess == true){
               this.orderget = res.data.object;    
               let {id, guests}= res.data.object;
               console.log(guests); 
            }
          }).catch(err => {
            console.log(err)
        })
      },
      cancle(){   
        this.dialogFormProcess=false;
        this.$refs["processFrom"].resetFields();
      },
      getHeight(){
        this.authDiocss.height=document.body.clientHeight-200+"px";
      }
    }
}
</script>

<style scoped>
  .abow_dialog{margin:-100px 0 0 0}
  .fl{float:left}
  .fr{float:right}
  .save{margin-right: 40px}
  .cancel-order{margin-left: 35px}
  .footer{clear:both;padding:20px 0;position: absolute;bottom: 0;left:0;width: 100%;background-color: #fff}
  .main-left{float:left;width:250px;margin-bottom: 30px}
  .main-right{float:left;margin-bottom: 30px}
  .sta-title{color:#191818}
  .line{display: inline-block;margin: 5px 0 5px 17px;padding:3px 0 3px 23px;min-height:18px;line-height: 20px}
  .line1{border-left:3px solid #eee}
  .demo-ruleForm{margin-top: 17px}
  .demo-ruleForm .el-input{width:340px} 
  .demo-ruleForm .el-select{width:340px}
  .required{margin-top: -17px}
  .required span{color: red}
  .table{border:1px solid #e6e6e6;width:593px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:50px 20px}
  .breadCrumbPointer{cursor:pointer;color:#2e94f9}
</style>