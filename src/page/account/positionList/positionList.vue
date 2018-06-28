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
					<el-button type="danger" size="small" @click="del(scope.$index, scope.row)">删除</el-button>
				</template>
            </el-table-column>
        </el-table>

        <!-- 添加职位弹框界面 -->
        <el-dialog class="Popup" title="添加职位" :visible.sync="addPosition" style="width:800px;">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="职位名称：" :label-width="formLabelWidth" prop="positionName">
                    <el-input v-model="form.positionName" auto-complete="off" placeholder="请输入职位"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPosition = false">取 消</el-button>
                <el-button type="primary" @click="addSave('form')">保存</el-button>
            </div>
        </el-dialog>

        <!-- 编辑职位弹框界面 -->
        <el-dialog class="Popup" title="编辑职位" :visible.sync="editPosition" style="width:800px;">
            <el-form :model="updata" :rules="rules1" ref="updata">
                <el-form-item label="职位名称：" :label-width="updataLabelWidth" prop="positionName">
                    <el-input v-model="updata.positionName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editPosition = false">取 消</el-button>
                <el-button type="primary" @click="addSave('updata')">保存</el-button>
            </div>
        </el-dialog>
    </div>
    <!-- 分页 -->
      <!-- <div class="page">
          <span class="page-count">共{{this.tableData.length}}条数据，每页8条</span>
          <el-pagination @current-change="handleCurrentChange" :page-size="this.pagesize" layout="prev, pager, next, jumper" :total="this.tableData.length"></el-pagination>
      </div> -->
      <div class="page">
       <el-pagination :page-sizes="[2,4,8]" background @current-change="handleCurrentChange" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
       </el-pagination>
      </div>
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
        // 删除
        del(aa, bb) {
            var oo = ((this.currentPage-1)*this.pagesize)+aa
            this.$confirm('是否删除该职位？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'primary'
            }).then(() => {
                this.tableData.splice(oo,1)
                this.hh.splice(oo,1)
                        console.log(this.hh)
                this.bb--
                var ff = this.tableData.length
                for(let i=0;i<=ff;i++){
                    if(typeof this.tableData[i] == "object"){
                        for(let key in this.tableData[i]){
                            if(this.tableData[i].id < 10){
                                this.tableData[i].id = '00' + (i + 1)
                            }else if(this.tableData[i].id >= 10){
                                this.tableData[i].id = '0' + (i + 1)
                            }
                        }
                    }
                }
                if(this.tableData.length <= this.currentPage*this.pagesize-this.pagesize){
                    this.currentPage = this.tableData.length/this.pagesize;
                }
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 添加和修改
        addSave(formName) {
            let _this = this
            this.$refs[formName].validate(valid =>{
                if(valid){
                    if(formName == 'form'){
                        var fff = this.tableData.length + 1
                        for(let i=0;i<this.tableData.length;i++){
                            this.hh[i] = this.tableData[i].positionName
                        }
                        if(this.hh.indexOf(this.form.positionName) == '-1'){
                            if(fff < 10){
                                this.tableData.push({
                                    id:this.aa + (this.bb++),
                                    positionName:this.form.positionName
                                })
                            }else if(fff >= 10){
                                this.tableData.push({
                                    id:this.rr + (this.bb++),
                                    positionName:this.form.positionName
                                })
                            }
                            this.hh[this.tableData.length-1] = this.form.positionName
                            this.$message.success('添加成功！')
                            this.form.positionName = "";
                            this.addPosition = false
                        }else{
                            this.$message.error('该职位已存在')
                            this.form.positionName = "";
                        }
                    }else if(formName == 'updata'){
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
                    }
                }
            })
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
                console.log(response)
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
        }
    }
}
</script>

<style scoped>
.big{
    position: absolute;
    width: 47%;
    height: 75%;
    margin-left: 3%;
}
.list{
    float: left;
}
.table{
    position: absolute;
    top: 11%;
    left: 2%;
}
.page{
    position: absolute;
    margin-top: 640px;
    left: 41%;
}
.page-count{
    position: absolute;
    margin-left: -128%;
    top: 8%;
    font-size: 18px;
}
.Popup{
    margin:auto;
}
.addButton{
    position: absolute;
    margin-top: 2%;
    left: -4%;
    width: 100px;
    height: 40px;
}
</style>


