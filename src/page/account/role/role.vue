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
        label="状态">
      </el-table-column>
      <el-table-column
        prop="operate"
        label="操作"
        width="180"
        header-align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small">查看</el-button>
          <router-link to="/addRole?id=1"><el-button type="primary" size="small">编辑</el-button></router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="5"
      :page-size="30"
      layout="prev, pager, next,  jumper, ->, total"
      :total="100">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        typeArr: [{
          value: '选项1',
          label: '模板ID'
        }, {
          value: '选项2',
          label: '模板名称'
        }],
        statusArr: [{
          value: '选项1',
          label: '禁用'
        }, {
          value: '选项2',
          label: '正常'
        }],
        typeValue: '',
        statusValue: '',
        input: '',
        tableData: [{
          id: '001',
          template_name: '财务',
          author: '管理员',
          template_desc: '财务',
          nums: '22',
          status: 1
        }, {
          id: '002',
          template_name: '财务',
          author: '管理员',
          template_desc: '财务',
          nums: '22',
          status: 0
        }
        ]
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      subForm() {
        this.$message.info(this.typeValue + this.statusValue + this.input)
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


