<template>
   <div  class="vivo" style="position:relative; width:100%;">
     <div label="商户欠款订单">
        <!--搜索框-->
        <div>
          <div class="fl">
            <span class="emptyPlan">订单单号</span>
            <el-input v-model="orderid" class="empty"   placeholder="订单ID"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">商户名称</span>
            <el-input v-model="ordertitle" class="empty"   placeholder="请输入商户名称"></el-input>
          </div>
          <div class="fl">
            <span class="emptyPlan">出团时间</span>
             <el-date-picker
                class="planTime"
                style="width:70%"
                v-model="planTime"
                @change="endDateChange()" 
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="终止日期"
                >
              </el-date-picker>
          </div>
        </div>
        <div style="width:1100px;clear:both; padding:0 0 50px 0;">
          <div style=" float:left">
               <span class="emptyPlan">欠款逾期</span>
             <el-select v-model="typeColl" placeholder="请选择逾期类型" class="empty">
                     <el-option :label="item.label" :value="item.value" v-for="item in settlements" :key="item.value" /> 
                   </el-select>
          </div>
           <div style=" float:left">
               <span class="emptyPlan">结款类型</span>
             <el-select v-model="settlement" placeholder="请选择结款类型" class="empty">
                     <el-option :label="item.label" :value="item.value" v-for="item in moneydata" :key="item.value" /> 
                   </el-select>
          </div>
          <div style="float:right; margin: 20px -50px 0 0;">
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
            <el-button type="primary" @click="emptyButton()" >重置</el-button>
          </div>
        </div>
      <!--搜索框-->
 
        <!--表格-->
         <el-table :data="tableData" class="labelTable" border style="width:100%" :row-class-name="tableRowClassName" >
            <el-table-column prop="ID" label="订单单号" width="195" align="center"></el-table-column>
            <el-table-column prop="name" label="商户名称" width="120" align="center"></el-table-column>
            <el-table-column prop="moneyType" label="结款方式" width="82" align="center"></el-table-column>
            <el-table-column prop="productName" label="产品名称" width="150" align="center"></el-table-column>
            <el-table-column prop="plan" label="团期计划" width="100" align="center"></el-table-column>
            <el-table-column prop="order" label="订单金额" width="82" align="center"></el-table-column>
            <el-table-column prop="arrears" label="欠款金额" width="82" align="center"></el-table-column>
            <el-table-column prop="also" label="已还金额" width="82" align="center"></el-table-column>
            <el-table-column prop="examine" label="待审批金额" width="82" align="center"></el-table-column>
            <el-table-column prop="arrearsDate" label="欠款日期" :formatter='dateFormat' width="120" align="center"></el-table-column>
            <el-table-column prop="alsoDate" label="应还日期" :formatter='dateFormat' width="120" align="center"></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="80"
              >
              <template slot-scope="scope">
                <el-button @click="dialogchange(scope)" type="text" size="small">修改时间</el-button>
             </template>
            </el-table-column>
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
         <el-dialog title="修改时间" :visible.sync="dialogFormVisible" width="40%" :show-close="false":close-on-click-modal="false" >
             <el-date-picker type="date" placeholder="选择日期" v-model="amendTime" style="width: 100%;"></el-date-picker>
             <div slot="footer" class="dialog-footer" style="position: absolute;top: 20px;right: 20px;">
                <el-button @click="chanceSubmit()">取 消</el-button>
                <el-button  type="primary" @click="submitForm(amendTime)" >确 定</el-button>
            </div>
            </el-dialog>
      </div>
      
       
  
   
  </div>
</template>
<style lang="stylus">
  /*搜索框*/
  .empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
  .fl{float:left; margin: 20px 0 20px 0;}
  .emptyPlan{margin: 0 0 0 30px; float:left; width:80px; text-align:right; line-height:40px;}
  .planTime{width: 135px; line-height: 30px;margin: 0 0 0 10px;}
  .time{margin: 0 0 0 10px;}
  /*表格*/
  .labelTable{margin: 20px 30px 100px 0;max-width: 90%;overflow: hidden;clear:both;}
  .pageList{float:right; margin: -70px 0 60px 0;}
  .el-table .warning-row { color: red;}
  
</style>
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
        planTime:"",//time
        amendTime:'',//修改时间
        typeColl:-1, //欠款逾期
        settlement:-1,//结款类型
        dialogFormVisible:false,//修改时间弹框
        moneydata:[{
          value:  -1,
          label: '全部'
         },{
          value:  1,
          label: '月结'
         }, {
          value:  2,
          label: '非月结'
         }],
        settlements:[{
          value:  -1,
          label: '全部'
         },{
          value:  1,
          label: '无逾期'
         }, {
          value:  0,
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
            typeColl=this.typeColl,//选择逾期
            settlement=this.settlement,//结款方式
        ){
            var that = this;
            let object={};
            //console.log(endDate);
            if(endDate == undefined && startDate == undefined ){
              endDate = 0
              startDate = 0
            }else{
              //  endDate = Date.parse(endDate);
              //  startDate = Date.parse(startDate);
            }
              orderCode !== "" ? (object.orderCode = orderCode) : orderCode,
              localComp !== "" ? (object.localComp = localComp) : localComp,
              typeColl !== ""? (object.typeColl = typeColl): typeColl;
              settlement !== ""? (object.settlement = settlement): settlement;
              startDate !== ""? (object.startDate = startDate): startDate;
              endDate !== ""? (object.endDate = endDate): endDate;
             
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
                        ID:obj.data.objects[j].orderCode,//id+
                        planid:obj.data.objects[j].id,//id+
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
          tableRowClassName({row, rowIndex}){
            let myDate = new Date();
            let arrearsDate = moment(row.alsoDate).format("YYYYMMDD");
            let mydatas = moment(myDate).format("YYYYMMDD");
            if (arrearsDate < mydatas) {
                rowIndex = rowIndex+1
             if(rowIndex){
                 return 'warning-row';
                }else{
                 return '';
                }
              } 
          },
      
    //重置
    emptyButton(){
      this.orderid ='',
      this.ordertitle ='',
      this.planTime = '';
      this.typeColl = -1;
      this.currentPage4 = 1;
      this.pageList(1, this.pageSize);
    },
    //判断结束时间不能在开始时间之前
    endDateChange() {
     if (this.planTime == null){
              this.planTime = "";
              this.pageList();
          }else{
            this.startDate = moment(this.planTime[0]).format("YYYYMMDD");
            this.endDate = moment(this.planTime[1]).format("YYYYMMDD");
            // if(endDate == startDate){
            //     this.planTime[1] = moment(this.planTime[1]).format("YYYY-MM-DD 23:59:00");
            // }
         }
    },
    handleSearch() {// 搜索
            this.pageIndex = 1;
            this.currentPage4 = 1;
            this.pageList(1, this.pageSize);
            
    },
    handleSizeChange(val) { //分页
    //console.log(val,'8585')
     this.pageSize = val;
            this.currentPage4 = 1
          this.pageList();
        },  
     handleCurrentChange(val) { // 换每页数量
      //console.log(val,'8787')
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
    dialogchange(id) {  // 修改时间弹窗
         this.planid = id.row.planid
         this.dialogFormVisible = true;
        },
    chanceSubmit() { // 取消按钮
            this.$confirm("是否取消修改时间", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                 this.dialogFormVisible = false;
                 this.amendTime = "";
             })
            .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
          
         
        },
    submitForm(amendTime){//提交修改时间
        let myDate = new Date();
        let amendTime_s = moment(amendTime).format("YYYYMMDD");
        let mydatas = moment(myDate).format("YYYYMMDD");
         
          if(amendTime_s <= mydatas){
              this.$message({
                      type: "warning",
                      message: "修改日期不能低于今天"
                    });
           
          }else{
             let amendTime_s = moment(amendTime).format("YYYY-MM-DD");
             this.$http
                .post(this.GLOBAL.serverSrc + "/orderquery/update/api/repaymentdate", {
                  id:this.planid,
                  repaymentDate:amendTime_s
                })
                .then(res => {
                  if (res.data.isSuccess == true) {
                         this.$message({
                              type: "success",
                              message: "修改成功!"
                            });
                            this.dialogFormVisible = false;
                            this.amendTime = "";
                            this.pageList();
                      }
                  
                })
                .catch(err => {
                  console.log(err);
                });

          }
          
           
        
    }
  
  },
};
</script>

