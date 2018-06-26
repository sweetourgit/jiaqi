<template>
  <div>
    <div class="search_dom">
      <el-select v-model="countryValue" placeholder="全部国家">
        <el-option
          v-for="country in countryArr"
          :key="country.value"
          :label="country.label"
          :value="country.value">
        </el-option>
      </el-select>
      <el-select v-model="provinceValue" placeholder="全部省份">
        <el-option
          v-for="province in provinceArr"
          :key="province.value"
          :label="province.label"
          :value="province.value"
        >
        </el-option>
      </el-select>
      <el-select v-model="cityValue" placeholder="全部城市">
        <el-option
          v-for="city in cityArr"
          :key="city.value"
          :label="city.label"
          :value="city.value"
        >
        </el-option>
      </el-select>
      <el-input v-model="keyword" placeholder="请输入景点名称（中文或英文）" clearable></el-input>
      <el-button type="primary" @click="subForm()" size="" class="sub_button" icon="el-icon-search"></el-button>
    </div>
    <div class="cl_both"></div>
    <div style="padding: 0 20px">
      <div style="text-align: left">
        <router-link to="/addScenic">
          <el-button type="primary" class="add_scenic">添加景点</el-button>
        </router-link>
      </div>
      <div class="labels">
        <div style="float: left;margin-right: 25px">景点标签：</div>
        <el-checkbox-group v-model="checkLabelList" style="float: left">
          <el-checkbox label="热门"></el-checkbox>
          <el-checkbox label="免签"></el-checkbox>
          <el-checkbox label="购物"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="cl_both"></div>
      <el-table
        :data="checkLabelList"
        :header-row-style="hrs"
        :cell-style="cs"
        border>
        <el-table-column
          prop="id"
          label="景点ID"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="scenicName"
          label="景点名称"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="area"
          label="所属地区"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="scenicUrl"
          label="景点链接"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          width=""
          header-align="center">
          <template slot-scope="scope">
            <el-button type="info" size="small" @click="changeState(scope.row.id,1)" class="bt-stop">查看</el-button>
            <el-button type="primary" size="small" @click="editRole(scope.row.id)" class="bt-edit">编辑</el-button>
            <el-button type="primary" size="small" @click="editRole(scope.row.id)" class="bt-edit">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        plain="false"
        prev-text="上一页"
        next-text="下一页"
        :page-sizes="[2,3,4,5]"
        :current-page.sync="pageIndex"
        layout="total, prev, pager, next, sizes, jumper, ->"
        :total="totalNum"
        style="float: right">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "scenicList",
    data() {
      return {
        countryArr: [
          {
            value: '1',
            label: '中国'
          },
          {
            value: '2',
            label: '印度'
          },
        ],
        countryValue: "",
        provinceArr: [
          {
            value: '1',
            label: '北京'
          },
          {
            value: '2',
            label: '上海'
          },
        ],
        provinceValue: "",
        cityArr: [
          {
            value: '1',
            label: '北京'
          },
          {
            value: '2',
            label: '上海'
          },
        ],
        cityValue: "",

        scenicData: [

        ],
        checkLabelList: [
          {
            id: '001',
            scenicName: '王小虎',
            scenicUrl: 'http'
          },
        ],
        keyword: "",
        hrs: {height: '60px'},
        cs: {padding: '0', height: '40px'},
        pageSize: 2,    // 设定默认分页每页显示数 todo 具体看需求
        pageIndex: 1,    // 设定当前页数
        totalNum: 6
      }
    },
    methods: {
      handleCurrentChange: function () {
        
      },
      handleSizeChange: function () {
        
      }
    }
  }
</script>

<style scoped lang="scss">
  .search_dom {
    padding-top: 22px;
    height: 40px;
    line-height: 40px;
    padding-left: 176px;
    border-bottom: 1px solid #F1F1F1;
    padding-bottom: 22px;
    .sub_button {
      float: left;
    }
    .el-select {
      width: 200px;
      float: left;
      margin-right: 15px;
    }
    .el-input {
      width: 350px;
      float: left;
      margin-right: 15px;
    }
    .bt-edit {
      font-size: 12px;
    }
  }

  .labels {
    text-align: left;
    margin-top: 20px;
    margin-left: 66px;
    font-size: 14px;
    color: #666;
  }

  .add_scenic {
    margin-top: 20px;
  }

  .el-table {
    margin: 20px 0 40px 0;

  }

  td {
    color: #666;
  }

  .cl_both {
    clear: both;
    width: 0;
    height: 0;
  }
</style>
