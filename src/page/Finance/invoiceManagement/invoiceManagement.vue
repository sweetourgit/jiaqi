<template>
  <div class="management">
    <!--搜索框-->
    <div class="search">
      <el-form :model="ruleFormSeach" ref="ruleFormSeach" label-width="80px" class="search-form" id="form-content">
        <el-row type="flex">
          <el-col :span="6">
            <el-form-item label="发票号码:" class="mr30" prop="invoiceNumber">
              <el-input v-model="ruleFormSeach.invoiceNumber" placeholder="请输入发票号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称:" class="mr30" prop="merchantsName">
              <el-input v-model="ruleFormSeach.merchantsName" placeholder="请输入商户名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期:" prop="applyForDate">
              <el-date-picker v-model="ruleFormSeach.applyForDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        align="right" class="group-no" style="width:380px;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="6">
            <el-form-item label="状态:" class="mr30" prop="states">
              <el-select v-model="ruleFormSeach.states" placeholder="全部状态" style="width:230px">
                <el-option v-for="item in states" :key="item.value" :label="item.label":value="item.value"></el-option`>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发票抬头:" class="mr30" prop="invoiceTitle">
              <el-input v-model="ruleFormSeach.invoiceTitle" placeholder="请输入商户名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票日期:" prop="invoiceDate">
              <el-date-picker v-model="ruleFormSeach.invoiceDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        align="right" class="group-no" style="width:380px;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="6">
            <el-form-item label="直客/商户:" class="mr30" prop="types">
              <el-select v-model="ruleFormSeach.types" placeholder="全部" style="width:230px">
                <el-option v-for="item in types" :key="item.value" :label="item.label":value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item style="float:right;margin:0 -5px 0 0;">
              <el-button type="primary" class="search-but">搜索</el-button>
              <el-button type="primary" plain>重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--搜索框结束-->
    <!--表格-->
    <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass":cell-style="getCellClass">
      <el-table-column prop="" label="发票ID" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" align="center"></el-table-column>
      <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
      <el-table-column prop="invoiceHeader" label="发票抬头" align="center"></el-table-column>
      <el-table-column prop="taxpayerIDNumber" label="纳税人识别号" align="center"></el-table-column>
      <el-table-column prop="collectionType" label="直客/商户" align="center"></el-table-column>
      <el-table-column prop="localCompName" label="商户名称" align="center"></el-table-column>
      <el-table-column prop="startCreateTime" label="申请日期" align="center"></el-table-column>
      <el-table-column prop="grantTime" label="开票日期" align="center"></el-table-column>
      <el-table-column prop="invoicePrice" label="发票金额" align="center"></el-table-column>
      <el-table-column prop="ordNum" label="关联订单数" align="center"></el-table-column>
      <el-table-column label="操作" align="center"></el-table-column>
    </el-table>
    <!--表格结束-->
    <!--分页-->
    
  </div>
</template>

<script>

export default {
  data() {
    return {
      ruleFormSeach: { // 搜索框
        invoiceNumber:'', // 发票号码
        merchantsName:'', // 商户名称
        applyForDate:'', // 申请日期
        states:'', // 状态
        invoiceTitle:'', // 发票抬头
        invoiceDate:'', // 开票日期
        types:'', // 直客/商户
        page: 1,
        limit: 10,
      },
      total: 0,
      states:[{ // 搜索框状态数据
        value:'1',
        label:'待开票'
      },{
        value:'2',
        label:'已开票'
      },{
        value:'3',
        label:'开票驳回'
      }],
      types:[{ // 直客/商户
        value:'1',
        label:'直客'
      },{
        value:'2',
        label:'商户'
      }],
      tableDate:[],//表格
      
    }
  },
  mounted(){
    this.pageList();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) { // 表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    rowClass({ row, rowIndex }) { // 选中行样式改变
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].id == row.id) {
          return { "background-color": "#ecf5ff" };
        }
      }
    },
    pageList(){
      
    },
  }
}
</script>

<style lang="scss" scoped>
  .management{margin: 20px;width: 1400px;border:1px solid #e6e6e6;overflow: hidden;line-height: 30px;}
  .search{background-color: #f7f7f7;margin:10px;overflow: hidden;width:1380px;}
  .search-form{margin:10px 0 0 20px;}
  .mr30{margin-right:30px;}
  /*表格样式*/
  .table{width: 1380px;margin:0 10px 10px 10px;}
</style>
