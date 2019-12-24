<template>
   <div  class="vivo" style="position:relative; width:100%;">
     <div label="商户欠款订单">
        <!--搜索框-->
        <div style="width:1100px;">
          <div class="fl">
            <span class="emptyPlan">订单ID</span>
            <el-input v-model="orderid" class="empty"   placeholder="订单ID"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">商户名称</span>
            <el-input v-model="ordertitle" class="empty"   placeholder="请输入商户名称"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">欠款时间</span>
            <el-date-picker v-model="startDate" type="date" class="planTime" placeholder="日期" @change="endDateChange()"></el-date-picker>
            <span class="time">——</span>
            <el-date-picker v-model="endDate" type="date" class="planTime" placeholder="日期" @change="endDateChange()"></el-date-picker>
          </div>
        </div>
        <div style="width:1100px;clear:both; padding:0 0 50px 0;">
          <div style=" float:left">
               <span class="emptyPlan">欠款逾期</span>
             <el-select v-model="typeColl" placeholder="请选择逾期类型" class="empty">
                     <el-option :label="item.label" :value="item.value" v-for="item in settlement" :key="item.value" /> 
                   </el-select>
          </div>
          <div style="float:right; margin: 0 10px 0 0;">
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
            <el-button type="primary" @click="emptyButton()" >重置</el-button>
          </div>
        </div>
      <!--搜索框-->
 
        <!--表格-->
         <el-table :data="tableData" class="labelTable" border style="width:100%">
            <el-table-column prop="ID" label="订单ID" width="80" align="center"></el-table-column>
            <el-table-column prop="name" label="商户名称" width="140" align="center"></el-table-column>
            <el-table-column prop="moneyType" label="结款方式" width="80" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" width="160" align="center"></el-table-column>
            <el-table-column prop="plan" label="团期计划" width="140" align="center"></el-table-column>
            <el-table-column prop="order" label="订单金额" width="120" align="center"></el-table-column>
            <el-table-column prop="arrears" label="欠款金额" width="120" align="center"></el-table-column>
            <el-table-column prop="also" label="已还金额" width="120" align="center"></el-table-column>
            <el-table-column prop="examine" label="待审批金额" width="120" align="center"></el-table-column>
            <el-table-column prop="arrearsDate" label="欠款日期" :formatter='dateFormat' width="120" align="center"></el-table-column>
            <el-table-column prop="alsoDate" label="应还日期" :formatter='dateFormat' width="120" align="center"></el-table-column>
         </el-table>
         <!-- <el-pagination 
         class="pageList" 
         :page-sizes="[10,1,30,50]" 
         background @size-change="handleSizeChange" 
         :page-size="pageSize" 
         :current-page.sync="currentPage" 
         @current-change="handleCurrentChange" 
         layout="total, sizes, prev, pager, next, jumper" 
         :total="total">
         </el-pagination> -->
         <el-pagination
          class="pageList" 
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage4"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
      
       
  
   
  </div>
</template>

<script>
import commercia from "./commercia";
import moment from "moment";
export default {
  name: "commercia",
  components: {
    commercia
   
  },
  data() {
     return {
       activeName: 'first',
       //搜索栏
        orderid:"",//订单id
        ordertitle:'',//商户名称
        startDate:"", // 开始时间
        endDate:"", // 结束时间
        typeColl:'', //欠款逾期
        settlement:[{
          value:  0,
          label: '无逾期'
         }, {
          value:  1,
          label: '有逾期'
         }],
        tableData:[],//列表数据
        //分页
        pageSize:10, // 设定默认分页每页显示数
        pageIndex: 1, // 设定当前页数
        total: 0,
        currentPage4:1,
    }
  },
  created() {
     this.pageList();
  },
  mounted () {
  },
  filters: {// 时间过滤
      formatDate: function (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  methods: {
        moment,
      //查询列表
       pageList(
            pageIndex = this.pageIndex,
            pageSize = this.pageSize,
            orderCode = this.orderid,//订单id
            localComp = this.ordertitle,//商户名称
            startDate= this.startDate,//开始时间
            endDate = this.endDate,//结束时间
            typeColl=this.typeColl//选择逾期
        ){
            var that = this;
            let object={};
            
            if(endDate !== "" && startDate !== ""){
              endDate = Date.parse(endDate);
              startDate = Date.parse(startDate);
            }else{
              endDate = ""
              startDate = ""
            }
           
            
             
          
           
              orderCode !== "" ? (object.orderCode = orderCode) : orderCode,
              localComp !== "" ? (object.localComp = localComp) : localComp,
              typeColl !== ""? (object.typeColl = typeColl): typeColl;
              startDate !== ""? (object.startDate = startDate): startDate;
              endDate !== ""? (object.endDate = endDate): endDate;
            
          
              console.log(object,'8ee')
            that.$http
              .post(that.GLOBAL.serverSrc + "/orderquery/get/api/SIArreaPage", {
                total: 0,
                object: object,
                pageSize: this.pageSize,
                pageIndex: this.currentPage4,
              })
              .then(function(obj) {
                that.tableData=[];
                that.total = obj.data.total;
                let moneyType;
                for(let j in obj.data.objects){
                  if(obj.data.objects[j].settlement == 1){
                      moneyType = "月结"
                  }else if(obj.data.objects[j].settlement == 2){
                      moneyType = "非月结"
                  }
                  that.tableData.push({
                        ID:obj.data.objects[j].id,//id+
                        name:obj.data.objects[j].localComp,//商户名称+
                        moneyType:moneyType,//结款方式+
                        productName:obj.data.objects[j].title, //产品名称+
                        plan:obj.data.objects[j].groupCode,//团期计划
                        order:obj.data.objects[j].orderPrice,//订单金额+
                        arrears: obj.data.objects[j].orderPrice - obj.data.objects[j].collectionPrice, //欠款金额
                        also:obj.data.objects[j].collectionPrice, //已还金额
                        examine:obj.data.objects[j].approvedPrice,//待审批金额
                        arrearsDate:obj.data.objects[j].createDate,//欠款日期
                        alsoDate:obj.data.objects[j].arrearsDate,//应还日期
                  })
                }
              })
              .catch(function(obj) {
                console.log(obj);
              });
        },
  
    //重置
    emptyButton(){
      this.orderid ='',
      this.ordertitle ='',
      this.startDate = '';
      this.endDate = '';
      this.typeColl = '';
      this.currentPage4 = 1;
      this.pageList(1, this.pageSize);
    },
    //判断结束时间不能在开始时间之前
    endDateChange() {
      let startDate = moment(this.startDate).format("YYYYMMDD");
      let endDate = moment(this.endDate).format("YYYYMMDD");
      if (this.startDate !== "") {
        if (endDate < startDate) {
          this.$message.error("结束时间不能早于开始时间");
          this.endDate = "";
        }
      }
    },
    handleSearch() {// 搜索
            this.pageIndex = 1;
            this.currentPage4 = 1;
            this.pageList(1, this.pageSize);
            
    },
    handleSizeChange(val) { //分页
    console.log(val,'8585')
     this.pageSize = val;
            this.currentPage4 = 1
          this.pageList();
        },  
     handleCurrentChange(val) { // 换每页数量
      console.log(val,'8787')
          this.currentPage4 = val;
          this.pageList();
        },
     dateFormat: function(row, column) { // 起始时间格式转换
          let date = row[column.property];
          if(date == undefined || date == '') {
            return '';
          }
          return moment(date).format('YYYY-MM-DD')
        },
  
  },
};
</script>

<style lang="scss" scoped>
  /*搜索框*/
  .empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
  .fl{float:left; margin: 20px 0 20px 0;}
  .emptyPlan{margin: 0 0 0 30px; float:left; width:80px; text-align:right; line-height:40px;}
  .planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
  .time{margin: 0 0 0 10px;}
  /*表格*/
  .labelTable{margin: 20px 30px 20px 0;max-width: 90%;overflow: hidden;clear:both;}
  .pageList{float:right; margin: 0 0 60px 0;}
</style>