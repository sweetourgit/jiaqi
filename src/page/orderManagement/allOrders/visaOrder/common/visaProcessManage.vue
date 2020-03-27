<template>
  <div>
       <!--流程管理弹窗-->
       <el-dialog title="流程管理" :visible.sync="dialogFormProcess"  custom-class="city_list" class="abow_dialog" width="940px" @close="cancle">
         <div :style="authDiocss"> 
          <div class="main-left">
             <div v-for="(item,index) in orderStatusInfo"> 
               <div>
                 <el-button type="primary" plain circle size="medium" v-if="index!==orderStatusInfo.length-1">
                    <span v-if="index<9">&nbsp;</span>{{index+1}}<span v-if="index<9">&nbsp;</span>
                  </el-button>
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
                 <el-table-column  prop="cnName" label="姓名" width="80" align="center"></el-table-column>
                 <el-table-column  prop="mobile" label="电话" width="110" align="center"></el-table-column>
                 <el-table-column  prop="idCard" label="身份证" width="170" align="center"></el-table-column>
                 <el-table-column  prop="credCode" label="护照号" width="130" align="center"></el-table-column>
                 <el-table-column  label="操作" align="center">
                    <template slot-scope="scope">
                      <span class="breadCrumbPointer" @click="editGuests(scope.row.id,scope.$index)">编辑</span>
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
            <el-form :model="contentFrom" :rules="rules" ref="contentFrom" label-width="20px" class="demo-ruleForm">
              <el-form-item prop="auditDate" v-if="processFrom.orderStatu == 3">
                  <div class="required"><span>*</span>开始审核日期</div>
                  <el-date-picker v-model="contentFrom.auditDate" type="date" placeholder="选择日期"></el-date-picker>
               </el-form-item>
               <el-form-item prop="duration" v-if="processFrom.orderStatu == 3">
                  <div class="required"><span>*</span>预计审核时长</div>
                  <el-input v-model="contentFrom.duration"></el-input>
               </el-form-item>
               <el-form-item prop="question" v-if="processFrom.orderStatu == 3">
                  <div class="required">审核问题</div>
                  <el-input v-model="contentFrom.question"></el-input>
               </el-form-item>
               <el-form-item prop="material" v-if="processFrom.orderStatu == 4">
                  <div class="required"><span>*</span>需补交材料</div>
                  <el-input v-model="contentFrom.material"></el-input>
               </el-form-item>
               <el-form-item prop="makeDate" v-if="processFrom.orderStatu == 5">
                  <div class="required"><span>*</span>开始制作日期</div>
                  <el-date-picker v-model="contentFrom.makeDate" type="date" placeholder="选择日期"></el-date-picker>
               </el-form-item>
               <el-form-item prop="makeDuration" v-if="processFrom.orderStatu == 5">
                  <div class="required"><span>*</span>预计制作时长</div>
                  <el-input v-model="contentFrom.makeDuration"></el-input>
               </el-form-item>
               <el-form-item prop="makeQuestion" v-if="processFrom.orderStatu == 5">
                  <div class="required">制作中发现问题</div>
                  <el-input v-model="contentFrom.makeQuestion"></el-input>
               </el-form-item>
               <el-form-item v-if="processFrom.orderStatu == 6">
                  <div class="required"><span>*</span>预约时间、护照号、预约号和地点</div>
                  <table>
                    <tr>
                      <td><el-date-picker style="width:120px;" v-model="contentFrom.subscribeDate" type="date" placeholder="选择日期"></el-date-picker></td>
                      <td><el-input style="width:120px;" v-model="contentFrom.passportNumber" placeholder="护照号"></el-input></td>
                      <td><el-input style="width:120px;" v-model="contentFrom.subscribeNumber" placeholder="预约号"></el-input></td>
                      <td><el-input style="width:120px;" v-model="contentFrom.address" placeholder="地点"></el-input></td>
                    </tr>
                  </table>
               </el-form-item>
               <el-form-item prop="attention" v-if="processFrom.orderStatu == 6">
                  <div class="required">注意事项</div>
                  <el-input v-model="contentFrom.attention"></el-input>
               </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="footer">
            <el-button class="cancel-order">取消订单</el-button>     
            <el-button class="fr save" type="primary" @click="saveOrder('contentFrom')">保存更改</el-button>
            <el-button class="fr" @click="cancle">取 消</el-button>
          </div>
         </div>
       </el-dialog>
       <el-dialog title="出行人信息" :visible.sync="visitorsShow"  custom-class="city_list" class="abow_dialog" width="600px" @close="cancleVisitors('ruleForm')">
         <div class="cancel">
            <el-button class="ml13" @click="cancleVisitors()">取 消</el-button>
            <el-button class="ml13" @click="addVisitors()"type="primary">确定</el-button>
         </div>
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
             <el-form-item label="中文姓名：" prop="cnName">
               <el-input v-model="ruleForm.cnName" placeholder="请输入中文姓名"></el-input>
             </el-form-item>
             <el-form-item label="英文姓名：" prop="enName">
               <el-input v-model="ruleForm.enName" placeholder="请输入英文姓名"></el-input>
             </el-form-item>
             <el-form-item label="性别：" prop="sex">
               <el-radio-group v-model="ruleForm.sex">
                 <el-radio :label="0">男</el-radio>
                 <el-radio :label="1">女</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="电话：" prop="mobile">
               <el-input v-model="ruleForm.mobile" placeholder="请输入电话"></el-input>
             </el-form-item>
             <el-form-item label="身份证：" prop="idCard">
               <el-input v-model="ruleForm.idCard" placeholder="请输入电话"></el-input>
             </el-form-item>
             <el-form-item label="出生日期：" prop="bornDate">
               <el-date-picker v-model="ruleForm.bornDate" type="date" placeholder="选择日期"></el-date-picker>
             </el-form-item> 
             <el-form-item label="证件类型：" prop="credType">
               <el-select v-model="ruleForm.credType" placeholder="请选择证件类型">
                 <el-option label="请选择" :value="0" />
                 <el-option label="护照" :value="1" />
                 <el-option label="港澳通行证" :value="2" />
                 <el-option label="军官证" :value="3" />
               </el-select>
             </el-form-item>
             <el-form-item label="证件号码：" prop="credCode">
               <el-input v-model="ruleForm.credCode" placeholder="请输入证件号码"></el-input>
             </el-form-item>
         </el-form>
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
           {label:"收到材料",id:"2"},
           {label:"材料审核",id:"3"},
           {label:"材料补交中",id:"4"},
           {label:"材料制作中",id:"5"},
           {label:"成功预约时间",id:"6"},
           {label:"送签",id:"7"},
           {label:"面签",id:"8"},
           {label:"使馆审核中",id:"9"},
           {label:"使馆审理完毕",id:"10"},
           {label:"过签",id:"11"},
           {label:"拒签",id:"12"},
           {label:"邮寄中",id:"13"},
           {label:"待评价",id:"14"},
           {label:"订单完成",id:"15"},
         ],
       },
       contentFrom:{
         auditDate:"", // 开始审核日期
         duration:"", // 预计审核时长
         question:"", // 审核问题
         material:"", // 需补交材料
         makeDate:"", // 开始制作日期
         makeDuration:"", // 预计制作时长
         makeQuestion:"", // 制作中发现问题
         subscribeDate:"", // 预约时间
         passportNumber:"", // 护照号
         subscribeNumber:"", // 预约号
         address:"", // 地点
         attention:"", // 注意事项
       },
       tourList:[],
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
        CNname: [
          { required: true, message: "中文姓名不能为空", trigger: "blur" }
        ],
        ENname: [
          { required: true, message: "英文姓名不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
        auditDate:[
          { required: true, message: "开始审核日期不能为空", trigger: "blur" }
        ],
        duration:[
          { required: true, message: "预计审核时长不能为空", trigger: "blur" }
        ],
        material:[
          { required: true, message: "需补交材料不能为空", trigger: "blur" }
        ],
        makeDate:[
          { required: true, message: "开始制作日期不能为空", trigger: "blur" }
        ],
        makeDuration:[
          { required: true, message: "预计制作时长不能为空", trigger: "blur" }
        ],
        subscribeDate:[
          { required: true, message: "预约时间不能为空", trigger: "blur" }
        ],
        passportNumber:[
          { required: true, message: "护照号不能为空", trigger: "blur" }
        ],
        subscribeNumber:[
          { required: true, message: "预约号不能为空", trigger: "blur" }
        ],
        address:[
          { required: true, message: "地点不能为空", trigger: "blur" }
        ],
       },
       visitorsShow:false, // 出行人信息弹窗
       ruleForm:{},
       cardTypeList:[{
        id:'1',
        label:'请选择'
       },{
        id:'2',
        label:'护照'
       },{
        id:'3',
        label:'港澳通行证'
       },{
        id:'4',
        label:'军官证'
       },],
       indexes:'',
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
        this.$http.post(this.GLOBAL.serverSrc + '/order/visa/api/orderget',{
             "id": orderId
          }).then(res => {
            if(res.data.isSuccess == true){
               this.orderget = res.data.object;    
               let {id, guests}= res.data.object;
               this.tourList = res.data.object.guests;
               this.orderStatusInfo.length = res.data.object.visaOrderStatus; // 左侧进度条进程
               let contact = JSON.parse(res.data.object.contact)
               this.processFrom.contactName = contact.Name;
               this.processFrom.contactPhone = contact.Tel;
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
      },
      editGuests(ID,index){ // 点击编辑按钮，显示编辑弹窗
        this.visitorsShow = true;
        this.ruleForm = this.tourList[index];
        this.indexes = index;
      },
      cancleVisitors(){ // 关闭出行人信息弹窗
        this.visitorsShow = false;
        this.$refs["ruleForm"].resetFields();
      },
      addVisitors(index){
        this.$set(this.tourList,this.indexes,JSON.parse(JSON.stringify(this.ruleForm)))
        this.visitorsShow = false;
      },
      saveOrder(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {

          }
        })
      },
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
  .breadCrumbPointer{cursor:pointer;color:#2e94f9; text-align: center;}
  .cancel{float:right; position: absolute; right: 10px; top:8px;}
  .Words{width: 200px;}
</style>