<template>
  <div>
    <div class="borders">
      <div>
        <div class="search">
          <span class="search_style">报销单号：</span> <el-input v-model="number" placeholder="请输入内容" class="search_input"></el-input>
          <span class="search_style">团期计划：</span> <el-input v-model="plan" placeholder="请输入内容" class="search_input"></el-input>
          <span class="search_style">申请人：</span> <el-input v-model="accepter" placeholder="请输入内容" class="search_input"></el-input>
          <span class="search_style">发起时间：</span> <el-input v-model="createtime1" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
          <span class="search__">—</span> <el-input v-model="createtime2" placeholder="请输入内容" style="float: left; width: 100px"></el-input>
        </div>
        <div class="reform">
          <el-button type="primary">重置</el-button>
        </div>
        <div class="reform">
          <el-button type="primary" plain style="width: 90px;">审批</el-button>
        </div>
      </div>
      <div class="table_style">
        <el-table
          :data="tableData"
          border
          style="width: 100%;">
          <el-table-column
            prop="number"
            label="报销单号"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="发起时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="plan"
            label="团期计划"
            width="250"
            align="center">
          </el-table-column>
          <el-table-column
            prop="monkey"
            label="报销金额"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orinaze"
            label="申请组织"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="accpter"
            label="申请人"
            width="180"
            align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          background>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "needApproval",
      data() {
        return {
          currentPage4:4,
          activeName: 'first',
          number: '',
          plan: '',
          accepter: '',
          createtime1: '',
          createtime2:'',
          tableData: [{
            number: '1',
            type: '申请中',
            createtime: '2016-05-02',
            plan: 'TC-GTY-1001-01-180806-01',
            monkey: '国旅',
            orinaze: '辽宁大运通-国内部',
            accpter: '阳阳',
            info: '',
          }, {
            number: '1',
            type: '驳回',
            createtime: '2016-05-02',
            plan: 'TC-GTY-1001-01-180806-01',
            monkey: '国旅',
            orinaze: '辽宁大运通-国内部',
            accpter: '阳阳',
            info: '郑总：信息补全',
          }, {
            number: '1',
            type: '通过',
            createtime: '2016-05-02',
            plan: 'TC-GTY-1001-01-180806-01',
            monkey: '国旅',
            orinaze: '辽宁大运通-国内部',
            accpter: '阳阳',
            info: '',
          },]

        };
      },
      methods: {
        handleClick(tab, event) {
          console.log(tab, event);
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        }
      }
    }

</script>

<style scoped>
  .borders{
    height: 900px;
    border: 1px solid #E6E6E6;
  }
  .search{
    float: left;
    margin-top: 30px;
  }
  .search_style{
    float: left;
    margin-top: 10px;
    margin-left: 20px;
    font-size: 14px
  }
  .search_input{
    float: left;
    width: 200px
  }
  .search__{
    float: left;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .reform{
    float: left;
    width: 1550px;
    margin-left: 20px;
    margin-top: 20px;
  }
  .table_style{
    width: 1080px;
    margin-left: 20px;
    margin-top: 20px;
    float: left;
  }
  .block{
    float: left;
    margin-left: 600px;
    margin-top: 70px;
    margin-bottom: 30px;
  }
</style>
