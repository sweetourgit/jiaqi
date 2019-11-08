<template>
  <div>
    <div class="search_dom">
      <el-input v-model="keyword" placeholder="请输入关键字"></el-input>
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
        :headerRowStyle="tableHead" :cellStyle="tableHeight" :header-cell-style="getRowClass"
        :data="roleData"
        :header-row-style="hrs"
        :cell-style="cs"
        border
        class="table">
        <el-table-column
          prop="id"
          label="ID"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="title"
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
          prop="mark"
          label="模板描述"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="count"
          label="人数"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          width="400"
          header-align="center">
          <template slot-scope="scope">
            <el-button style="margin:10px;"  type="primary" size="small" @click="editRole(scope.row.id)" class="bt-edit">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteRole(scope.row.id)" class="bt-stop">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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
      <!--分页end-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHead:{height: '60px', color: '#555555'},
      tableHeight:{padding: '0', height: '34px'},
      typeArr: [
        {
          value: "temp_id",
          label: "模板ID"
        },
        {
          value: "temp_name",
          label: "模板名称"
        }
      ],
      statusArr: [
        {
          value: "2",
          label: "停用"
        },
        {
          value: "1",
          label: "正常"
        }
      ],
      keyword: "",
      hrs: { height: "60px" },
      cs: { padding: "0", height: "40px" },
      roleData: [],
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      total: 0
    };
  },
  created() {
    // 获取角色模板列表
    this.getRoleList();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7'
          } else {
            return ''
          }
      },
    getRoleList(PageIndex = this.pageIndex,PageSize = this.pageSize,keyword = ""){
      let _this = this;
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/rolepage", {
          Object: {
            IsDeleted: 0,
            title: keyword,
          },
          PageIndex: PageIndex,
          PageSize: PageSize
        })
        .then(obj => {
          var _data = obj.data.objects;
          _data.forEach(function(v, k, arr) {
            arr[k]["author"] = "管理员"; // TODO 后台无返回，前端定死
          });
          _this.roleData = _data;
          _this.total = obj.data.total  
        })
        .catch(function(obj) {
          console.log(obj);
        });
    },
    // 编辑权限
    editRole: function(id) {
      this.$router.push({
        path: "/addRole",
        query: {
          id: id
        }
      });
    },
    // 启停用账户
    deleteRole: function(id) {

      this.$confirm("删除" + id + "角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(this.GLOBAL.serverSrc + "/org/api/roledelete", {
                id: id
            })
            .then(obj => {
              if(obj.data.isSuccess==true){
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.getRoleList();
              }
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 每页显示数变化事件
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getRoleList(1,val,this.keyword);
    },
    // 当前页变化事件
    handleCurrentChange(val) {
      this.getRoleList(
        val,
        this.pageSize,
        this.keyword
      );
    },
    // 表单提交事件
    subForm() {
      // console.log('提交参数为' + this.typeValue + this.statusValue + this.keyword)
      this.getRoleList(
        1,
        this.pageSize,
        this.keyword
      );
      this.pageIndex = 1;
    }
  }
};
</script>

<style scoped lang="scss">
.table{
  text-align: center;
  max-width:1200px
}
.search_dom {
  padding-top: 22px;
  height: 40px;
  line-height: 40px;
  padding-left: 22px;
  border-bottom: 1px solid #f1f1f1;
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

td {
  color: #666;
}

.cl_both {
  clear: both;
}
.pagination{
  text-align:center;
  margin:30px 0 50px 0
}
</style>


