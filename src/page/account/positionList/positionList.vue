<template>
  <div>
    <div class="big">
      <!-- 工具条 -->
      <el-row>
        <el-button type="primary" class="addButton" @click="addPosition = true">添加职位</el-button>
      </el-row>
      <!-- 列表 -->
      <el-table :data="tableData" border style="width:600px;" class="table" :header-cell-style="getRowClass">
        <el-table-column prop="id" label="ID" align="center" width="70%"></el-table-column>
        <el-table-column prop="positionName" label="职位名称" align="center" width="150%"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editPosition1(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="remove(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加职位弹框界面 -->
      <el-dialog class="Popup" title="添加职位" :visible.sync="addPosition" custom-class="city_list" width="545px">
        <el-form style="padding-left:79px" :model="form" :rules="rules" ref="form">
          <el-form-item label="职位名称：" :label-width="formLabelWidth" prop="positionName">
            <el-input v-model="form.positionName" auto-complete="off" placeholder="请输入职位" class="addPosition-input"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="oppp" @click="ceils('form')">取 消</el-button>
          <el-button class="oppp" type="primary" @click="addSave('form')">保存</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职位弹框界面 -->
      <el-dialog class="Popup" title="编辑职位" :visible.sync="editPosition" custom-class="city_list" width="545px">
        <el-form style="padding-left:79px" :model="updata" :rules="rules1" ref="updata">
          <el-form-item label="职位名称：" :label-width="updataLabelWidth" prop="positionName">
            <el-input v-model="updata.positionName" auto-complete="off" class="addPosition-input"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="oppp" @click="editPosition = false">取 消</el-button>
          <el-button class="oppp" type="primary" @click="editSave('updata')">保存</el-button>
        </div>
      </el-dialog>
      <div class="page">
        <el-pagination :page-sizes="[2,4,6,8,10]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      aa: "00",
      rr: "0",
      bb: 9,
      //每页的数据条数
      pagesize: 10,
      //默认开始页面
      currentPage: 1,
      total: 1,
      jj: "",
      hh: [],
      // 添加职位
      addPosition: false,
      form: {
        positionName: ""
      },
      formLabelWidth: "92px",
      rules: {
        positionName: [{ required: true, message: '不能为空', trigger: 'blur' },
                      { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{0,10}$/,message:'请输入10字以内的正确名称,含汉字、字母和数字' }]
      },
      rules1: {
        positionName: [{ required: true, message: '不能为空', trigger: 'blur' },
                      { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{0,10}$/,message:'请输入10字以内的正确名称,含汉字、字母和数字' }]
      },
      // 编辑职位
      editPosition: false,
      updata: {
        positionName: ""
      },
      updataLabelWidth: "92px"
    };
  },
  created() {
    this.pageList();
  },
  methods: {
    // 添加职位
    addSave(form) {
      this.$refs[form].validate((valid) => {
        if(valid){
          var _this = this;
          this.$http.post(this.GLOBAL.serverSrc + "/org/api/positioninsert", {
            object: {
              name: this.form.positionName
            }
          },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }}).then(function(response) {
            if(response.data.isSuccess == false){
              _this.$message.error("添加失败,该职位已存在");
            } else {
              _this.addPosition = false;
              _this.form.positionName = "";
              _this.$message.success("添加成功");
              // _this.currentPage = Math.ceil((_this.total+1)/(_this.pagesize));
              _this.pageList();
            }
          }).catch(function(error) {
            console.log(error);
          });
        }
      })
    },
    editSave(updata) {
      this.$refs[updata].validate((valid) => {
        if(valid){
          let _this = this;
          this.$http.post(this.GLOBAL.serverSrc + "/org/api/positionsave", {
            object: {
              id: this.jj.id,
              name: this.updata.positionName,
              createTime: "2018-06-28T08:01:41.772Z",
              isDeleted: 0,
              code: "string",
              rank: 0,
              createUser: "string"
            },
            id: 0
          },{
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
          }).then(function(response) {
            _this.pageList();
            _this.$message.success("修改成功！");
            _this.jj = "";
            _this.editPosition = false;
          }).catch(function(error) {
            console.log(error);
          });
        }
      })
    },
    // 删除
    remove(index, rows) {
      let _this = this;
      this.$confirm("是否删除该职位？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrc + "/org/api/positiondelete", {
          id: this.tableData[index].id
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          _this.tableData.splice(index, 1);
          _this.$message({
            type: "success",
            message: "删除成功!"
          });
        }).catch(function(error) {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    editPosition1(aa, bb) {
      this.editPosition = true;
      this.jj = bb;
      this.updata.positionName = bb.positionName;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.pageList();
    },
    pageList() {
      this.tableData = [];
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/positionpage", {
        object: {
          isDeleted: 0
        },
        pageSize: _this.pagesize,
        pageIndex: _this.currentPage, 
        id: 0
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function(response) {
        _this.total = response.data.total;
        for (let i = 0; i < response.data.objects.length; i++) {
          if (response.data.objects[i].isDeleted !== 1) {
            _this.tableData.push({
              id: response.data.objects[i].id,
              positionName: response.data.objects[i].name
            });
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    handleSizeChange(page) {
      this.currentPage = 1;
      this.pagesize = page;
      this.pageList();
    },
    ceils(a) {
      this.addPosition = false;
      this.$refs[a].resetFields();
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7'
      } else {
        return ''
      }
    },
  }
};
</script>

<style scoped lang='stylus'>
.big { width: 1600px; height: 750px !important; }
.list { float: left; }
.table { margin-left: 40px; margin-top: 40px; }
.page { margin-top: 30px; float: left; margin-left: 35px; }
.Popup { margin: auto; }
.addButton { float: left; margin-left: 40px; }
.el-dialog__wrapper>>>.el-dialog { width: 400px; }
.dialog-footer{ text-align :center; }
.oppp{ margin: 20px; width:100px; }
.addPosition-input{ width:220px; margin-right:100px; }
</style>
