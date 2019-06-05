<template>
  <div>
      <div class="demo-input-suffix">
         <span class="search-title">团号计划</span>
         <el-input placeholder="输入团号" v-model="groupCode" class="group-no"></el-input>
         <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
         <div class="date-line"></div>
         <el-date-picker v-model="endTime" type="date" placeholder="终止日期"></el-date-picker>
         <el-button type="primary" icon="el-icon-search" class="search" @click="teamQueryList(1,pageSize,groupCode)"></el-button>
     </div>
     <div class="main">
     <el-row class="button">
       <!--<el-button :disabled="forbidden1" @click="dialogFormVisible = true">更改状态</el-button>
       <el-button :disabled="forbidden2" @click="dialogCost = true">报账单</el-button>
       <el-button :disabled="forbidden2">订单</el-button>-->
       <el-button :disabled="forbidden2" @click="operation(1)">下单</el-button>
     </el-row>
     <!--list-->
     <el-table :data="teamqueryList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
       <el-table-column  prop="id" label="" fixed type="selection"></el-table-column>     
       <el-table-column  type="index" label="序号" width="60"></el-table-column>
       <el-table-column  prop="title" label="产品名称" min-width="340"></el-table-column>
       <el-table-column  prop="groupCode" label="团号" width="220"></el-table-column>
       <el-table-column  prop="dateFormat" label="出行日期" width="100"></el-table-column>
       <el-table-column  prop="week" label="周" width="70"></el-table-column>
       <el-table-column  prop="day" label="天数" width="70"></el-table-column>
       <el-table-column  prop="refPrice" label="参考价" width="80"></el-table-column>
       <el-table-column  prop="count" label="计划位" width="70"></el-table-column>
       <el-table-column  prop="remaining" label="余位" width="70"></el-table-column>
       <el-table-column  prop="shareCN" label="是否共享" width="85"></el-table-column>
       <el-table-column  prop="op" label="操作" width="80"></el-table-column>      
     </el-table>
     <el-pagination class="pagination"
            @size-change="handleSizeChange"
            background
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
     </el-pagination>
     <!--更改状态弹窗-->
     <el-dialog title="更改状态" :visible.sync="dialogFormVisible" class="city_list" width="500px">
      <el-form :model="form">
          <el-radio v-model="form.radio" label="1"><span class="fs">正常</span></el-radio>
          <el-radio v-model="form.radio" label="2"><span class="fs">停售</span></el-radio>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false" class="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!--报账单弹窗-->
    <el-dialog title="报账单" :visible.sync="dialogCost" class="city_list" width="60%">      
       <el-table :data="costList" ref="costTable" class="costTable" :header-cell-style="getCostClass" border :row-style="costrowClass" @selection-change="changeFunCost" @row-click="clickRowCost">
       <el-table-column  prop="id" label="" fixed type="selection"></el-table-column>
       <el-table-column  prop="serno" label="序号" min-width="50"></el-table-column>
       <el-table-column  prop="state" label="审核状态" min-width="90"></el-table-column>
       <el-table-column  prop="type" label="费用类型" min-width="90"></el-table-column>
       <el-table-column  prop="costType" label="成本类型" min-width="90"></el-table-column>
       <el-table-column  prop="abstract" label="摘要" min-width="100"></el-table-column>
       <el-table-column  prop="supplierInfo" label="供应商" min-width="180"></el-table-column>
       <el-table-column  prop="price" label="金额" min-width="70"></el-table-column>
       <el-table-column  prop="num" label="数量" min-width="70"></el-table-column>
       <el-table-column  prop="enclosure" label="附件" min-width="70"></el-table-column>
      </el-table>
    </el-dialog>
    <teamOrder-insert :planId="planId" :variable="variable" :dialogType="dialogType"></teamOrder-insert>
     </div>
     </div>
  </div>
</template>

<script>
import teamOrderInsert from './teamOrderInsert';
export default {
  components:{
    "teamOrder-insert":teamOrderInsert,
  },
  data() {
    return {
       planId:0,
       variable:0, //设置一个变量展示弹窗
       dialogType:0,//弹窗类型  1：下单
       groupCode:'',
       startTime: '',
       endTime: '',
       pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
       pageIndex: 1, // 设定当前页数
       total: 0,
       teamqueryList: [],
       multipleSelection: [],   //选中的list
       //成本
       costList:[{
          id:1,
          serno: 1,
          state: '已审',
          type:'公摊',
          costType:'机票',
          abstract:'升级套房',
          supplierInfo:'大运通国际旅行社',
          price:'2000',
          num:'20',
          enclosure:'查看'
       },
       {
          id:2,
          serno: 1,
          state: '已审',
          type:'公摊',
          costType:'机票',
          abstract:'升级套房',
          supplierInfo:'大运通国际旅行社',
          price:'2000',
          num:'20',
          enclosure:'查看'
       }],
        dialogCost: false, //成本弹窗
        costSelection: [],   //选中的list
        //更改状态   
        dialogFormVisible: false,   
        form: {
          radio: '',
        },
        formLabelWidth: '120px',
        forbidden1:true,         //按钮是否禁用
        forbidden2:true,
    }
  },
  created(){
    this.teamQueryList();
  },
  methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      },
      changeFun(val) {  //保存选中项的数据
        this.multipleSelection=val;
        if(this.multipleSelection.length==1){
           this.forbidden2=false;
        }else{
           this.forbidden2=true;
        }
        
        if(this.multipleSelection.length>0){
           this.forbidden1=false;
        }else{
           this.forbidden1=true;
        }
      },
      clickRow(row){    //选中行复选框勾选
        this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选 
        this.$refs.multipleTable.toggleRowSelection(row);        
        this.planId=this.multipleSelection[0].id;
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.teamQueryList(1,val,this.groupCode);
      },
      handleCurrentChange(val){
        this.teamQueryList(val,this.pageSize,this.groupCode);
      },
      //计划list
      teamQueryList(pageIndex=this.pageIndex,pageSize=this.pageSize,groupCode=this.groupCode){
        this.$http.post(this.GLOBAL.serverSrc + '/teamquery/get/api/page',{
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "object":{            
              "groupCode": groupCode
             }
          }).then(res => {
            this.teamqueryList=[];
            this.total=res.data.total;
            if(res.data.isSuccess == true){
               this.teamqueryList=res.data.objects;              
            }
          }).catch(err => {
            console.log(err)
          })
      },
      //成本方法
      getCostClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f6f6f6;height:25px;textAlign:center;fontSize:15px'
        } else {
          return ''
        }
      },
      costrowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.costSelection.length;i++){
          if(this.costSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      changeFunCost(val) {  //保存选中项的数据
        this.costSelection=val;
        if(this.costSelection.length==1){
          // this.forbidden1=false;
        }else{
         //  this.forbidden1=true;
        }
      },
      clickRowCost(row){    //选中行复选框勾选
        //this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.costTable.toggleRowSelection(row);
      },
      operation(i){
          this.variable++;
          if(i==1){
            this.dialogType=1; //下单弹窗
          }          
      }
  }
}
</script>

<style scoped>
       .demo-input-suffix{width: 900px}
       .el-input{width:auto}
       .group-no{margin-left:10px}
       .start-time{margin-left:25px}
       .date-line{width:30px;border-bottom:1px solid #e6e6e6;display:inline-block;margin:0 3px 3px 0}
       .search-title{font-size: 14px;margin-left: 10px}
       .table{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px;width:1400px;}
       .costTable{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 0}
       .el-table tr{background: #f6f6f6 !important}
       .button{margin:25px 0 0 8px}
       .button .el-button{border:1px solid #3095fa;color:#3095fa;width:80px;padding: 0;line-height: 35px}
       .el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
       .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: #f5f7fa !important}
       .search{margin-left: 15px}
       .city_list{text-align: center}
       .confirm{margin:0 140px 0 20px;}
       .el-form{line-height:50px}
       .fs{font-size: 16px}
       .pagination{text-align:center;margin:30px 0 50px 0;}
       .dialog-footer{text-align: left;margin:20px 0 20px 108px;}
</style>