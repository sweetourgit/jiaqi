<template>
  <div>
      <div class="demo-input-suffix">
         <span class="search-title">团号计划</span>
         <el-input placeholder="输入团号" v-model="groupNo" class="group-no"></el-input>
         <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
         <div class="date-line"></div>
         <el-date-picker v-model="endTime" type="date" placeholder="终止日期"></el-date-picker>
         <el-button type="primary" icon="el-icon-search" class="search"></el-button>
     </div>
     <div class="line"></div>
     <div class="main">
     <el-row class="button">
       <el-button :disabled="forbidden1" @click="dialogFormVisible = true">更改状态</el-button>
       <el-button :disabled="forbidden2" @click="dialogCost = true">成本</el-button>
       <el-button :disabled="forbidden2">订单</el-button>
       <el-button :disabled="forbidden2" @click="placeOrder">下单</el-button>
     </el-row>
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
    <!--成本弹窗-->
    <el-dialog title="成本" :visible.sync="dialogCost" class="city_list" width="60%">
        
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






    <!--list-->
     <el-table :data="groupList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
       <el-table-column  prop="id" label="" fixed type="selection"></el-table-column>
       <el-table-column  prop="serno" label="序号" min-width="60"></el-table-column>
       <el-table-column  prop="state" label="状态" min-width="90"></el-table-column>
       <el-table-column  prop="date" label="出行日期" min-width="110"></el-table-column>
       <el-table-column  prop="groupSer" label="团期计划" min-width="240"></el-table-column>
       <el-table-column  prop="price" label="成人价" min-width="75"></el-table-column>
       <el-table-column  prop="plan" label="计划位" min-width="75"></el-table-column>
       <el-table-column  prop="surplus" label="余位" min-width="75"></el-table-column>
       <el-table-column  prop="conPt" label="确认占位" min-width="85"></el-table-column>
       <el-table-column  prop="resPt" label="预定占位" min-width="85"></el-table-column>
       <el-table-column  prop="resNpt" label="预定不占" min-width="85"></el-table-column>
       <el-table-column  prop="operation" label="操作" min-width="80"></el-table-column>
       <el-table-column  prop="name" label="产品名称" fixed="right" min-width="250"></el-table-column>
     </el-table>
     <el-pagination class="pagination"
        @size-change="handleSizeChange"
        background
        @current-change="handleCurrentChange"
        :current-page="4"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
     </div>
     </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
       groupNo:'',
       startTime: '',
       endTime: '',
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
       costSelection: [],   //选中的list
       groupList: [{
          id:1,
          serno: 1,
          date: '2016-05-03',
          state: '正常',
          groupSer:'TC-GTY-1001-01-180806-01',
          price:'200',
          plan:'20',
          surplus:'20',
          conPt:'20',
          resPt:'20',
          resNpt:'20',
          operation:'阳阳',
          name: '泰国曼谷+芭提雅+沙美岛+清迈小镇7日游'
        },
        {
          id:2,
          serno: 1,
          date: '2016-05-03',
          state: '正常',
          groupSer:'TC-GTY-1001-01-180806-01',
          price:'200',
          plan:'20',
          surplus:'20',
          conPt:'20',
          resPt:'20',
          resNpt:'20',
          operation:'阳阳',
          name: '泰国曼谷+芭提雅+沙美岛+清迈小镇7日游'
        }],
        multipleSelection: [],   //选中的list
        dialogFormVisible: false, //更改状态弹窗
        dialogCost: false, //成本弹窗
        form: {
          radio: '',
        },
        formLabelWidth: '120px',
        forbidden1:true,         //按钮是否禁用
        forbidden2:true
    }
  },
  mounted(){

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
        //this.$refs.multipleTable.clearSelection(); //清空用户的选择  
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      rowClass({row, rowIndex}){  //选中行样式改变
       for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
             return { "background-color": "#ecf5ff" }
          }
        }
      },
      placeOrder(){
        this.$router.push({path: "/regimentPlan/placeOrder"});
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      },
      //成本方法
      getCostClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#666;height:25px;textAlign:center;color:#fff;fontSize:15px'
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
        this.$refs.costTable.toggleRowSelection(row)
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
       .line{width:80%;min-width:800px;border-bottom:1px solid #e6e6e6;margin:25px 0 0 -20px;}
       .table{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:20px 0 0 8px}
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
       .pagination{text-align:center;margin:70px 0 50px 0;}
       .dialog-footer{text-align: left;margin:20px 0 20px 108px;padding-top: 20px}
</style>