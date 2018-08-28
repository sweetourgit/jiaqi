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
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input v-model="keyword" placeholder="请输入关键字" clearable></el-input>
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
        border>
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
          prop="state"
          label="状态"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          width="400"
          header-align="center">
          <template slot-scope="scope">
            <el-button style="margin:10px;"  type="primary" size="small" @click="editRole(scope.row.id)" class="bt-edit">编辑</el-button>
            <!--<router-link to="/addRole?id=scope.row.id&type=view"><el-button type="primary" size="small" class="bt-edit">编辑</el-button></router-link>-->
            <el-button type="info" size="small" @click="changeState(scope.row.id,1)" class="bt-stop"
                       v-if="scope.row.state === '禁用'">启用
            </el-button>
            <el-button v-else type="danger" size="small" @click="changeState(scope.row.id,2)" class="bt-stop"
                       >停用
                       <!-- v-else="scope.row.state === '启用'" -->
            </el-button>
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
          label: "禁用"
        },
        {
          value: "1",
          label: "正常"
        }
      ],
      typeValue: "",
      statusValue: "",
      keyword: "",
      hrs: { height: "60px" },
      cs: { padding: "0", height: "40px" },
      roleData: [],
      pageSize: 2, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      totalNum: 6
    };
  },
  created() {
    // 获取权限列表
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
    getRoleList(
      PageIndex = this.pageIndex,
      PageSize = this.pageSize,
      type = "",
      status = "",
      keyword = ""
    ) {
      let _this = this;

      this.$http
        .post(this.GLOBAL.serverSrc + "/api/org/rolepage", {
          Object: {
            IsDeleted: 0,
            title: keyword
          },
          PageIndex: PageIndex,
          PageSize: PageSize
        })
        .then(obj => {
          console.log(obj);
          var _data = obj.data.objects;

          _data.forEach(function(v, k, arr) {
            arr[k]["author"] = "管理员"; // TODO 后台无返回，前端定死
            if (v["state"] == 1) {
              arr[k]["state"] = "启动";
            } else if (v["state"] == 2) {
              arr[k]["state"] = "禁用";
            }
          });

          _this.roleData = _data;
          // _this.totalNum = _data.total    // todo 线上使用此行
          _this.totalNum = 6;
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
    changeState: function(obj, flag) {
      let that = this;
      var mess = "";
      if (flag == 1) {
        mess = "启用";
      } else if (flag == 2) {
        mess = "停用";
      }

      this.$confirm(mess + obj + "角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .post(this.GLOBAL.serverSrc + "/api/org/rolesave", {
              object: {
                id: obj,
                createTime: "2018-06-21T11:24:35.785Z",
                isDeleted: 0,
                code: "string",
                title: "string",
                mark: "string",
                count: 0,
                state: flag
              },
              id: obj
            })
            .then(obj => {
              console.log(obj);
              this.$message({
                type: "success",
                message: mess + "成功"
              });
              this.$router.go(0);
              // 修改数据
              vm.msg = "Hello";
              // DOM 还没有更新
              Vue.nextTick(function() {
                // DOM 更新了
              });

              // 作为一个 Promise 使用 (2.1.0 起新增，详见接下来的提示)
              Vue.nextTick().then(function() {
                // DOM 更新了
              });
            })
            .catch();
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
      this.getRoleList(1, val);
    },
    // 当前页变化事件
    handleCurrentChange(val) {
      this.getRoleList(
        val,
        this.pageSize,
        this.typeValue,
        this.statusValue,
        this.keyword
      );
    },
    // 表单提交事件
    subForm() {
      // console.log('提交参数为' + this.typeValue + this.statusValue + this.keyword)
      this.getRoleList(
        1,
        this.pageSize,
        this.typeValue,
        this.statusValue,
        this.keyword
      );
      this.pageIndex = 1;
    }
  }
};
</script>

<style scoped lang="scss">
.search_dom {
  padding-top: 22px;
  height: 40px;
  line-height: 40px;
  padding-left: 176px;
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
</style>


