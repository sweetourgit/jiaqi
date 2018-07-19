<template>
  <div>
    <div class="big">
        <!-- 工具条 -->
        <el-row>
            <el-button type="primary" class="addButton" @click="addPosition = true">添加职位</el-button>
        </el-row>
        <!-- 列表 -->
        <el-table :data="tableData" border style="width:900px;" class="table" >
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <el-table-column prop="positionName" label="职位名称" align="center"></el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
                <template slot-scope="scope">
					<el-button type="primary" size="small" @click="editPosition1(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="remove(scope.$index, scope.row)">删除</el-button>
				</template>
            </el-table-column>
        </el-table>
        <!-- 添加职位弹框界面 -->
        <el-dialog class="Popup" title="添加职位" :visible.sync="addPosition">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="职位名称：" :label-width="formLabelWidth" prop="positionName">
                    <el-input v-model="form.positionName" auto-complete="off" placeholder="请输入职位"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="ceils('form')">取 消</el-button>
                <el-button type="primary" @click="addSave('form')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 编辑职位弹框界面 -->
        <el-dialog class="Popup" title="编辑职位" :visible.sync="editPosition">
            <el-form :model="updata" :rules="rules1" ref="updata">
                <el-form-item label="职位名称：" :label-width="updataLabelWidth" prop="positionName">
                    <el-input v-model="updata.positionName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editPosition = false">取 消</el-button>
                <el-button type="primary" @click="editSave('updata')">保存</el-button>
            </div>
        </el-dialog>
        <div class="page">
          <el-pagination :page-sizes="[2,4,8]" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
    </div>
    <!-- 分页 -->
      <!-- <div class="page">
          <span class="page-count">共{{this.tableData.length}}条数据，每页8条</span>
          <el-pagination @current-change="handleCurrentChange" :page-size="this.pagesize" layout="prev, pager, next, jumper" :total="this.tableData.length"></el-pagination>
      </div> -->

  </div>

</template>

<script>
  export default {
  data () {
    var validatepass = (rule, value, callback) => {
        let m = this.form.positionName
        let n = /^[\u4e00-\u9fa5]{2,10}$/
        if (value === ''){
            callback(new Error('请输入职位'));
        }else if(m.match(n)){
            callback();
        }else{
            callback(new Error('请输入2-10位汉字'))
        }
    };
    var validatepass1 = (rule, value, callback) => {
        let m = this.updata.positionName
        let n = /^[\u4e00-\u9fa5]{2,10}$/
        if (value === ''){
            callback(new Error('请输入职位'));
        }else if(m.match(n)){
            callback();
        }else{
            callback(new Error('请输入2-10位汉字'))
        }
    }
    return {
        tableData:[],
        aa: '00',
        rr: '0',
        bb: 9,
        total: 0,
        //每页的数据条数
        pagesize:2,
        //默认开始页面
        currentPage:1,
        jj: '',
        hh: [],
        // 添加职位
        addPosition: false,
        form: {
            positionName: ''
        },
        formLabelWidth: '90px',
        rules: {
            positionName: [
                { validator: validatepass }
            ]
        },
        rules1: {
            positionName: [
                { validator: validatepass1 }
            ]
        },
        // 编辑职位
        editPosition: false,
        updata: {
            positionName: ''
        },
        updataLabelWidth: '90px'
    }
    },
    created() {
        this.pageList();
    },
    methods: {
        // 添加职位
        addSave() {
            var _this = this;
            if(this.form.positionName === ''){
                this.$message.warning('请填写职位名称！')
            }else{
                var _this = this
                this.$http.post(this.GLOBAL.serverSrc+'/api/org/positioninsert',{
                    "Object": {
                    "name": this.form.positionName
                 },
                }
                ).then(function(response){
                // console.log(response);
                  _this.addPosition = false
                  _this.form.positionName = ""
                  _this.$message.success('添加成功')
                }).catch(function(error){
                console.log(error);
                });

            }

        },
        editSave(updata){
            let _this = this;
            this.$http.post(this.GLOBAL.serverSrc+'/api/org/positionsave',{
                "object": {
                    "id": this.jj.id,
                    "name": this.updata.positionName,
                    "createTime": "2018-06-28T08:01:41.772Z",
                    "isDeleted": 0,
                    "code": "string",
                    "rank": 0,
                    "createUser": "string"
                },
                "id": 0
            }).then(function(response){
                _this.pageList();
                _this.$message.success('修改成功！')
                _this.jj = ''
                _this.editPosition = false
            }).catch(function(error){
            console.log(error);
            });

        },
       // 删除
        remove(index, rows) {
            let _this = this
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.$http.post(this.GLOBAL.serverSrc+'/api/org/positiondelete',{
                "id" : this.tableData[index].id
            })
            .then(function(response){
                _this.tableData.splice(index, 1)
                _this.$message({
                type: 'success',
                message: '删除成功!'
             });
            })
            .catch(function(error){
             console.log(error);
            })

            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });
            });
        },
        editPosition1(aa, bb) {
            this.editPosition = true
            this.jj = bb
            this.updata.positionName = bb.positionName
            // let oo = ((this.currentPage-1)*this.pagesize)+aa
            // this.updata.positionName = this.tableData[oo].positionName
            // this.jj = aa
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.pageList();
        },
        pageList() {
            this.tableData = [];
            let _this = this
            this.$http.post(this.GLOBAL.serverSrc+'/api/org/positionpage',{
                "object": {
                    "isDeleted": 0,
                },
                "pageSize":_this.pagesize,
                "pageIndex": _this.currentPage,
                "id": 0
            }).then(function(response){
                _this.total = response.data.total
                for(let i=0;i<response.data.objects.length;i++){
                 if(response.data.objects[i].isDeleted !== 1){
                     _this.tableData.push({
                      id : response.data.objects[i].id,
                      positionName : response.data.objects[i].name
                     })
                 }
                }
            }).catch(function(error){
            console.log(error);
            });
        },
        handleSizeChange(page){
            this.pagesize = page;
            console.log(this.pagesize)
        },
        ceils(a){
          this.addPosition = false;
          this.$refs[a].resetFields();
        }
    }
}
</script>

<style scoped lang='stylus'>
.big{
   width:1600px;
   height:750px!important;
}
.list{
    float: left;
}
.table{
    margin-left:40px;
    margin-top: 40px;
}
.page{
    margin-top: 30px;
    float: left;
    margin-left: 200px;
}
.Popup{
    margin:auto;
}
.addButton{
    float: left;
    margin-left:40px;
}
.el-dialog__wrapper>>>.el-dialog
  width: 400px;
</style>


