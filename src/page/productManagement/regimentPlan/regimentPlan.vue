<template>
  <div>
      <div class="demo-input-suffix">
         <span class="search-title">团号计划</span>
         <el-input placeholder="输入团号" v-model="groupNo" class="group-no"></el-input>
         <el-date-picker v-model="startTime" type="date" placeholder="开始日期" class="start-time"></el-date-picker>
         <div class="date-line"></div>
         <el-date-picker v-model="endTime" type="date" placeholder="终止日期"></el-date-picker>
     </div>
     <div class="line"></div>
     <div class="main">
     <el-table :data="tableData3" class="table" :header-cell-style="getRowClass" border>
       <el-table-column fixed prop="date" label="日期" width="180"></el-table-column>
       <el-table-column prop="name" label="姓名" width="180"></el-table-column>
       <el-table-column prop="province" label="省份" width="180"></el-table-column>
       <el-table-column prop="city" label="市区" width="180"></el-table-column>
       <el-table-columnprop="address" label="地址"></el-table-column>
       <el-table-column prop="zip" label="邮编"></el-table-column></el-table>
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
       tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
    }
  },
  methods: {
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
      }
  }
}
</script>

<style scoped>
       .el-input{width:auto}
       .group-no{margin-left:10px}
       .start-time{margin-left:25px}
       .date-line{width:30px;border-bottom:1px solid #e6e6e6;display:inline-block;margin:0 3px 3px 0;}
       .search-title{font-size: 14px;margin-left: 10px}
       .line{width:80%;min-width:800px;border-bottom:1px solid #e6e6e6;margin:25px 0 0 -20px;}
       /*.main{border:1px solid #e6e6e6;padding: 15px;height:100%;}*/
       .table{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:30px 0 0 8px;}
       .el-table tr{background: #f6f6f6 !important;}
</style>