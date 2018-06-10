<template>
  <div>
    <div class="top_tip">角色模板</div>
    <div class="search_dom">
      <el-select v-model="typeValue" placeholder="搜索类型" class="options1">
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
      <el-input v-model="input" placeholder="请输入关键字"></el-input>
      <el-button type="primary" @click="subForm()" size="small" class="sub_button">搜索</el-button>
      <router-link to="/addRole" class="add_role">
        <el-button type="primary">添加模板</el-button>
      </router-link>
    </div>
    <div class="cl_both"></div>
    <el-table
      :data="tableData"
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
          <router-link to="/addRole?id=1&type=view"><el-button type="primary" size="small">查看</el-button></router-link>
          <router-link to="/addRole?id=1"><el-button type="primary" size="small">编辑</el-button></router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrev"
      :current-page="1"
      :page-size="1"
      layout="prev, pager, next,  jumper, ->, total"
      :total="totalNum">
    </el-pagination>
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
        totalNum: 6
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
  .top_tip {
    border-left: 5px solid grey;
    text-align: left;
    padding-left: 5px;
    font-size: 15px;
    margin-bottom: 15px;
  }

  .search_dom {
    height: 40px;
    line-height: 40px;

    .sub_button {
      float: left;
      display: table-cell;
      height: 40px;
      vertical-align: middle;
    }
    .el-select {
      width: 120px;
      float: left;
      margin-right: 15px;
    }
    .el-input {
      width: 200px;
      float: left;
      margin-right: 15px;
    }
  }

  .cl_both {
    clear: both
  }

  .add_role {
    float: right;
  }

  .el-table {
    margin: 40px 0;
  }
</style>


