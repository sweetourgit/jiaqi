<template>
  <div>
    <div class="search_dom">
      <el-select v-model="typeValue" placeholder="搜索类型">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="statusValue" placeholder="状态">
        <el-option
          v-for="item in statusArr"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="input" placeholder="请输入关键字" clearable></el-input>
      <el-button type="primary" @click="subForm()" size="" class="sub_button" icon="el-icon-search"></el-button>
    </div>
    <div class="cl_both"></div>
    <div style="padding: 0 20px">
    <div style="text-align: left">
      <router-link to="/addRole">
        <el-button type="primary" class="add_role">添加模板</el-button>
      </router-link>
    </div>
      <el-table
        :data="tableData"
        header-row-style="height:60px"
        cell-style="padding:0;height:40px"
        border>
        <el-table-column
          prop="id"
          label="ID"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="template_name"
          label="模板名称"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="author"
          label="创建人"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="template_desc"
          label="模板描述"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="nums"
          label="人数"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          width="180"
          header-align="center">
          <template slot-scope="scope">
            <router-link to="/addRole?id=1&type=view"><el-button type="primary" size="small" class="bt-edit">编辑</el-button></router-link>
            <router-link to="/addRole?id=1"><el-button type="danger" size="small" class="bt-stop">停用</el-button></router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrev"
      plain="false"
      prev-text="上一页"
      next-text="下一页"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="1"
      layout="total, prev, pager, next, sizes, jumper, ->"
      :total="totalNum"
      style="float: right">
    </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        typeArr: [{
          value: 'temp_id',
          label: '模板ID'
        }, {
          value: 'temp_name',
          label: '模板名称'
        }],
        statusArr: [{
          value: 'disable',
          label: '禁用'
        }, {
          value: 'enable',
          label: '正常'
        }],
        typeValue: '',
        statusValue: '',
        input: '',
        tableData: [
          {
            "id": "001",
            "template_name": "财务",
            "author": "管理员",
            "template_desc": "财务",
            "nums": "22",
            "status": 1
          },
          {
            "id": "002",
            "template_name": "财务",
            "author": "管理员",
            "template_desc": "财务",
            "nums": "22",
            "status": 0
          },
          {
            "id": "003",
            "template_name": "财务",
            "author": "管理员",
            "template_desc": "财务",
            "nums": "22",
            "status": 0
          },
          {
            "id": "004",
            "template_name": "财务",
            "author": "管理员",
            "template_desc": "财务",
            "nums": "22",
            "status": 0
          },
          {
            "id": "005",
            "template_name": "财务",
            "author": "管理员",
            "template_desc": "财务",
            "nums": "22",
            "status": 0
          },
          {
            "id": "006",
            "template_name": "财务",
            "author": "管理员",
            "template_desc": "财务",
            "nums": "22",
            "status": 0
          }
        ],
        totalNum: 600
      }
    },
    created(){
      this.getRoleList()
    },
    methods: {
      getRoleList(currPage = '') {

        let _this = this
        currPage = currPage == '' ? 1 : currPage

        this.$http.post(
          "http://rap2api.taobao.org/app/mock/16117/role/getRoleList",     //todo 按实际接口URL
          {currPage: currPage, pageSize: 1}
        )
          .then(function (obj) {
            // _this.tableData = obj.data.list     //todo 按实际接口返回数据结构修改
            // _this.totalNum = obj.data.list.length
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      // 每页显示数变化事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      // 当前页变化事件
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      // 点击上一页按钮事件
      handlePrev: function() {
        console.log('点击了上一页按钮')
      },
      // 表单提交事件
      subForm() {
        this.getRoleList(2)
      }
    },
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

  .add_role {
    margin-top: 20px;
  }

  .el-table {
    margin: 20px 0 40px 0;

  }
  .cl_both {
    clear: both
  }
</style>


