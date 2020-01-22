<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">产品名称:</span>
      <el-input v-model="activeForm.title" placeholder="请输入" class="input"></el-input>
      <span class="search-title">计划编码:</span>
      <el-input v-model="activeForm.tour" placeholder="请输入" class="input"></el-input>
      <span class="search-title">操作人员:</span>
      <el-input  v-model="activeForm.user" placeholder="请输入" style="margin-right:60px;"></el-input>
      <div class="button_select ">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
      </div>
    </div>
    <div class="table_style">
            <el-table  :data="tableData" border style="width:100%;">
              <el-table-column prop="jh" label="计划编码" width="240" align="center"></el-table-column>
              <el-table-column prop="cp" label="产品名称" width="180" align="center"></el-table-column>
              <el-table-column prop="sku" label="sku名称" width="180" align="center"></el-table-column>
              <el-table-column prop="kc" label="库存" width="160" align="center"></el-table-column>
              <el-table-column prop="yw" label="余位" width="160" align="center"></el-table-column>
              <el-table-column prop="mc" label="卖出" width="160" align="center"></el-table-column>
              <el-table-column prop="ry" label="操作人员" width="160" align="center"></el-table-column>
              <el-table-column prop="cz" label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <span @click="dialogNew(scope)" style="color: #f5a142">下单</span>
                  <span @click="dialogFind(scope)" style="color: #f5a142">/ 详情</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage4"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageCount"
              background
            ></el-pagination>
          </div>
   
  </div>
</template>
<script type="text/javascript">
  //import NewTour from '@/page/productManagement/regimentPlan/children/scenic/scenicTicketingInfo/newTour'
 // import {formatDate} from '@/js/libs/publicMethod.js'

export default {
  name: "VisaDetails",
  components: {
   
  },
  data() {
    return {
        activeForm: {
          title: '',
          tour: '',
          user: '',
        },
       pageSize:10,
       currentPage:1,
       currentPage4:1,
       pageCount:1,
       tableData:[{
          jh :12154961651,
          cp : "发发",
          sku:8150165,
          kc:100,
          yw:10,
          mc:1999999,
          ry:"李大宝",
         }
       ],
       
   }
  },
  created() {
    
  },
  mounted () {
  },
  methods: {
       handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          
        },
       handleCurrentChange(val) {
          this.currentPage = val;
       },
       dialogFind(row){
        this.$router.push({
          path: "/VisaContent",
          name: "产品管理  /团期计划  /签证  /详情",
          query: {
            id: 10,
          }
        });
       },
       dialogNew(row){
        this.$router.push({
          path: "/NewOrder",
          name: "产品管理  /团期计划  /签证  /下单",
          query: {
            id: 10,
          }
        });
       },
  }



 
    



}

</script>
<style lang="scss" scoped>
.vivo {
   background-color: #F7F7F7;
  .demo-input-suffix {
    width: auto;
    padding: 20px;
    .search-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .el-input {
      width: auto;
    }

    .el-input__inner {
      width: 10%;
    }

    .demo-input-suffix {
      width: 900px
    }

    .date-line {
      width: 10px;
      border-bottom: 1px solid #e6e6e6;
      display: inline-block;
      margin: 0 3px 3px 0
    }

    

  }
.button_select {
      display: inline;
   }
.table_style {
  width: 98%;
  margin-left: 20px;
  margin-top: 20px;
  float: left;
}
.block {
  float: left;
  margin-left: 600px;
  margin-top: 30px;
  margin-bottom: 60px;
}
  .main {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
    //margin-left: 50px;

    .select_button {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9eaea;
      text-align: left;
      padding-left: 50px;
    }
  }

  .table_trip {
    .table_details {
      margin: 5px;
    }
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
