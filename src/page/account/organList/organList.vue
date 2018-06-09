<template>
    <div>
        <div class="small3"></div>
        <div class="title">组织列表</div>
        <div class="big">
            <div class="left">
               <div class="left-son">
                    <div class="left-tree">
                    <!-- 树形控件 -->
                    <el-tree :data="data" class="tree"></el-tree>
                </div>
                <div>
                    <el-button type="primary" class="addTopOrganization" @click="addTopOrganization = true">增加顶级组织</el-button>
                </div>
               </div>
            </div>
            <div class="right">
               <div class='right-son'>
                    <div>
                    <h4 class="asia">东南亚部</h4>
                    <el-button type="primary" class="editDepartment" @click="editDepartment = true">编辑</el-button>
                    <el-button type="primary" class="addSubdivision" @click="addSubdivision = true">添加子部门</el-button>
                    <span class="inheritanceRules">默认限制向上继承</span>
                    <el-switch v-model="switchs" active-text="开" inactive-text="关" class="switch"></el-switch>
                </div>
                <div>
                    <div class="small1"></div>
                    <span class="lowerTitle">下级部门</span>
                    <el-table :data="tableData" border class="divisionTable" max-height="163">
                        <el-table-column prop="division" label="部门" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                    <el-button type="primary" size="small">进入</el-button>
                                    <el-button type="danger" size="small" @click="remove(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <div class="small2"></div>
                    <span class="personnelTitle">部门人员</span>
                    <el-button type="primary" class="addPersonnel" @click="addPersonnel = true">添加成员</el-button>
                    <el-button type="danger" class="batchDelete" disabled v-if="kk[0] == undefined">批量删除</el-button>
                    <el-button type="danger" class="batchDelete" @click="open2" v-if="kk[0] !== undefined">批量删除</el-button>
                    <el-table :data="tableList" border class="tableList" @select="del" @select-all="del" max-height="163">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="position" label="职位" align="center"></el-table-column>
                        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
                        <el-table-column label="操作" align="center" width="180px">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="position = true">职位</el-button>
                                <el-button class="b" type="primary" size="small">权限</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
               </div>
            </div>
        </div>
        <!-- 增加顶级组织弹框 -->
        <el-dialog class="Popup" title="增加顶级组织" :visible.sync="addTopOrganization" style="width:800px;">
                <el-form :model="form">
                    <el-form-item :label-width="formLabelWidth">
                        <el-input v-model="form.organizationName" auto-complete="off" placeholder="请输入名称" class="organizationInput"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button type="primary" @click="addSave">保存</el-button>
                </div>
        </el-dialog>
        <!-- 编辑部门弹框 -->
        <el-dialog class="Popup" :visible.sync="editDepartment" style="width:800px;">
            <div class="boom">
                <el-form :model="updata">
                <el-form-item label="部门名称" :label-width="updataLabelWidth">
                    <el-input v-model="updata.departmentName" auto-complete="off"></el-input>
                </el-form-item>
                </el-form>
                <span class="cascaderTitle">上级部门</span>
                <el-cascader :options="options" change-on-select class="cascader"></el-cascader>
            </div>
            <div slot="footer">
                <el-button @click="editDepartment = false">取 消</el-button>
                <el-button type="primary" @click="editSave = false">保存</el-button>
                <el-button type="danger" @click="remove = false">删除</el-button>
            </div>
        </el-dialog>
        <!-- 添加子部门弹框 -->
        <el-dialog class="Popup" :visible.sync="addSubdivision" style="width:900px;">
            <el-form :model="addInput" :rules="rules" status-icon ref="addInput">
                <el-form-item label="部门名称" :label-width="Width" prop="departmentNames">
                    <el-input v-model="addInput.departmentNames" auto-complete="off" class="add-input"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" :label-width="Width" prop="topDepartment">
                    <el-input v-model="addInput.topDepartment" auto-complete="off" :disabled="true" class="add-input"></el-input>
                </el-form-item>
                <el-form-item label="虚拟部门" class="virtual" prop="radio">
                    <el-radio-group class="virtualDepartment" v-model="addInput.radio">
                    <el-radio label="是" value="0"></el-radio>
                    <el-radio label="否" value="1"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门编码" :label-width="Width" prop="departmentCode">
                    <el-input v-model="addInput.departmentCode" auto-complete="off" class="add-department"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="Width" prop="sort">
                    <el-input v-model="addInput.sort" auto-complete="off" class="add-department"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="Width" prop="phone">
                    <el-input v-model="addInput.phone" auto-complete="off" class="add-department"></el-input>
                </el-form-item>
                <el-form-item label="传真" :label-width="Width" prop="fax">
                    <el-input v-model="addInput.fax" auto-complete="off" class="add-department"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="Width" prop="note">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="addInput.note" class="add-department"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="button-footer">
                <el-button @click="addSubdivision1('addInput')">取 消</el-button>
                <el-button type="primary" @click="appendSave('addInput')">保存</el-button>
            </div>
        </el-dialog>
        <!-- 添加成员弹框 -->
        <el-dialog  class="Popup" :visible.sync="addPersonnel" style="width:88%">
            <div class="booms">
                <span class="addTitle">添加成员</span>
                <el-form :model="updata">
                    <el-form-item :label-width="LabelWidth">
                        <el-input v-model="person.search" auto-complete="off" class="searchInput" placeholder="输入名称检索"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" class="searchButton" @click="oo">搜索</el-button>
            </div>
            <el-table :data="members1" border class="members" max-height="250" v-show="jj" style="90%">
                <el-table-column type="selection" width="30%" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center" width="120%" fixed="left"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center" width="120%"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center" width="200%"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center" width="200%"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" width="120%"></el-table-column>
                <el-table-column prop="state" label="状态" align="center" width="120%"></el-table-column>
            </el-table>

            <el-table :data="members" border class="members" height="50%" v-show="!jj" style="90%">
                <el-table-column type="selection" width="30%" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"  width="120%" fixed="left"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"  width="120%"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"  width="200%"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"  width="200%"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"  width="120%"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"  width="120%"></el-table-column>
            </el-table>
            <div slot="footer" class="btn">
                <el-button @click="addPersonnel = false">取 消</el-button>
                <el-button type="primary" @click="personSave = true">添加</el-button>
            </div>
        </el-dialog>
        <!-- 设置职位弹框 -->
        <el-dialog class="Popup" title="设置职位" :visible.sync="position" style="width:800px;">
            <el-form :model="setPosition">
                <el-form-item label="姓名" :label-width="setLabelWidth" class="setinput">
                    <el-input v-model="setPosition.name" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <span>职位</span>
            <el-select v-model="values" placeholder="请选择" class="setSelect">
                <el-option v-for="item in option" :key="item.values" :label="item.label" :value="item.values"></el-option>
            </el-select>
            <div slot="footer" class="setBtn">
                <el-button @click="position = false">取 消</el-button>
                <el-button type="primary" @click="setSave = false">保存</el-button>
            </div>
        </el-dialog>
        <!-- 成员添加 -->
        <el-dialog title="添加成员" :visible.sync="personSave" width="400px">
            <el-form :model="addSaves" class="addUser">
                <el-form-item label="姓名">
                    <el-input v-model="addSaves.name" class="peoper"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="addSaves.phone" class="peoperPhone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="addSaves.email" class="peoper"></el-input>
                </el-form-item>
                <span class="sex">性别</span>
                <div class="radio">
                    <el-radio v-model="radio" label="1">男</el-radio>
                    <el-radio v-model="radio" label="2">女</el-radio>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="personSave = false">取 消</el-button>
                <el-button type="primary" @click="sss = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
  data () {
    return {
        // 添加成弹框
        radio: '1',
        personSave: false,
        addSaves: {
            name: '',
            phone: '',
            email: '',
        },
        data: [{
            label: '辽宁大运通（2000人）',
            children: [{
                label: '亚洲部（1000人）',
                children: [{
                    label: '东南亚部（500人）',
                    children: [{
                        label: '日本部（250人）',
                    },{
                        label:'韩国部（250人）',
                    }]
                },{
                    label: '北欧部（500人）',
                    children: [{
                        label: '瑞典部（250人）',
                    },{
                        label: '挪威部（250人）',
                    }]
                }]
            },{
                label: '客服部（1000人）',
            }]
        }],
        switchs: true,
        // 子部门临时数据
        tableData: [{
            division: '子部门1'
        },{
            division: '子部门2'
        },{
            division: '子部门3'
        },{
            division: '子部门4'
        }],
        //成员列表临时数据
        tableList: [{
            id: 0,
            name: '王民',
            position: '经理',
            phone: '13011111111',
            sex: '男',
        },{
            id: 1,
            name: '刘晓婷',
            position: '员工',
            phone: '13022222222',
            sex: '女',
        },{
            id: 1,
            name: '孙福贵',
            position: '继承人',
            phone: '0000000000',
            sex: '女',
        }
        ],
        // 增加顶级组织
        addTopOrganization: false,
        form: {
            organizationName: ''
        },

        formLabelWidth: '90px',
        // 编辑部门
        editDepartment: false,
        updata: {
            departmentName: '东南亚部'
        },
        updataLabelWidth: '90px',
        // 级联选择器
        options: [{
            value: 'tianchenglvxingwang',
            label: '甜程旅行网',
            children: [{
                value: 'xiaoshoubu',
                label: '销售部',
                children: [{
                    value: 'xiaoshou1bu',
                    label: '销售1部',
                }]
            },{
                value: 'caozuobu',
                label: '操作部',
            },{
                value: 'caiwubu',
                label: '财务部',
            },{
                value: 'yunying',
                label: '运营',
            },{
                value: 'lianguanzhongxin',
                label: '连管中心'
            }]
        }],
        // 添加子部门
        addSubdivision: false,
        addInput: {
            departmentNames: '',
            topDepartment: '东南亚部',
            radio: '',
            departmentCode: '',
            sort: '',
            phone: '',
            fax: '',
            note: '',
        },
        rules: {
            departmentNames: [
                {required: true, message: "请输入部门名称", trigger: "blur"}
            ],
            radio: [
                {required: true, trigger: "blur"}
            ],
            departmentCode: [
                {required: true, message: "请输入部门编码", trigger: "blur"}
            ],
            sort: [
                {required: true, message: "请输入排序方式", trigger: "blur"}
            ],
            phone: [
                {required: true, message: "请输入联系方式", trigger: "blur"}
            ],
            fax: [
                {required: true, message: "请输入传真号", trigger: "blur"}
            ],
        },
        Width: '90px',
        // 添加成员
        addPersonnel: false,
        person: {
            search: '',
        },
        LabelWidth: '87%',
        members: [{
            id: '001',
            name: '张三',
            phone: '188888888888',
            email: '453014568@qq.com',
            sex: '男',
            state: '启用',
        },{
            id: '002',
            name: '李四',
            phone: '17777777777',
            email: '66666@sina.com',
            sex: '女',
            state: '停用',
        }],
        members1: [

        ],
        // 设置成员
        position: false,
        setPosition: {
            name: '王民',
        },
        setLabelWidth: '90px',
        option: [{
            values: 'yuangong',
            label: '员工'
        },{
            values: 'zhuguan',
            label: '主管',
        },{
            values: 'jingli',
            label: '经理',
        },{
            values: 'zongjian',
            label: '总监',
        },{
            values: 'zongzhu',
            label: '总助',
        }],
        values: '',
        jj: [],
        kk: [],
        show: true,
        jj: false,
    }
  },
    // 添加上级部门取消清空数据
    beforeUpdate: function (){
        if(this.addTopOrganization == false){
            this.form.organizationName = ""
        }
    },
methods: {
    open2() {
        this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(this.kk[0] == undefined){
                this.$message.error('请先选中成员')
            } else {
                 for(let i=0;i<this.kk.length;i++){
                    this.tableList.splice(this.kk,this.kk.length)
                 }
                this.kk = []
                this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    del(selection, row) {
        this.kk = []
        for(let i=0;i<selection.length;i++){
            if(this.tableList.length == 1 && selection[i].id !== 0){
                this.kk[i] = selection[i]
            } else {
                this.kk[i] = selection[i].id
            }
        }
    },
    addSubdivision1(a) {
        this.addSubdivision = false
        this.$refs[a].resetFields();
    },
    appendSave() {
        if(this.addInput.departmentNames === ''){
            this.$message.warning('不能为空！')
        }else{
            this.tableData.push({
            division: this.addInput.departmentNames
            })
            this.addSubdivision =  false
            this.addInput.departmentNames = ""
            this.$message.success('添加成功')
            }
    },
    addSave() {
        if(this.form.organizationName === ''){
            this.$message.warning('不能为空！')
        }else{
            this.data.push({
            label: this.form.organizationName,
            children: [{

            }]
            })
            this.addTopOrganization = false
            this.form.organizationName = ""
            this.$message.success('添加成功')
        }
    },
    oo() {
        this.members1 = []
        this.jj = true
        for(let i=0;i<this.members.length;i++){
            if(this.person.search == this.members[i].name){
                this.members1.push({
                    id: this.members[i].id,
                    name: this.members[i].name,
                    phone: this.members[i].phone,
                    email: this.members[i].email,
                    sex: this.members[i].sex,
                    state: this.members[i].state
                })
            }
        }
        if(this.person.search == ""){
            this.jj = false
        }
    },
    remove(index, rows) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.tableData.splice(index,1)
            this.$message({
            type: 'success',
            message: '删除成功!'
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
}
</script>

<style scoped>
.big{
    position: absolute;
    width: 70%;
    height: 70%;
    border: 1px solid #CCCCCC;
    top: 12%;
    margin-left: 3%;
}
.title{
    float: left;
}

.left-tree{
    position: absolute;
    top: 3%;
    left: 6%;
    width: 87%;
    height: 80%;
    border: 1px solid #797979;
}
.addTopOrganization{
    position: absolute;
    bottom: 16.8%;
    left: 6.3%;
    width: 87%;
    border-radius: 0;
}
.organizationInput{
    right: 17%
}
.tree{
    float: left;
    left: 6%;
    margin-top: 7%;
}
.asia{
    position: absolute;
    left: 3%;
    font-weight: bold;
}
.editDepartment{
    position: absolute;
    left: 3%;
    top: 9%;
    padding: 0.8% 0.8%;
}
.addSubdivision{
    position: absolute;
    padding: 0.8% 0.8%;
    left: 10%;
    top: 9%;
    font-weight: bold;
}
.inheritanceRules{
    position: absolute;
    left: 30%;
    top: 9%;
    font-size: 1em;
}
.switch{
    position: absolute;
    left: 54%;
    top: 9%;
}
.small1{
    position: absolute;
    left: 3%;
    top: 20%;
    width: 0.5%;
    height: 3.5%;
    background: inherit;
    background-color: rgba(215, 215, 215, 1);
    border: none;
    border-radius: 0px;
    box-shadow: none;
    line-height:0
}
.lowerTitle{
    position: absolute;
    left: 5%;
    top: 20.5%;
    font-size: 15px;
    font-weight: bold;
}
.divisionTable{
    position: absolute;
    top: 27%;
    left: 5%;
    width: 70%;
    height: 25%;
}
.small2{
    position: absolute;
    left: 3%;
    top: 57%;
    width: 0.5%;
    height: 3.5%;
    background: inherit;
    background-color: rgba(215, 215, 215, 1);
    border: none;
    border-radius: 0px;
    box-shadow: none;
    line-height:0
}
.personnelTitle{
    position: absolute;
    left: 5%;
    top: 57.5%;
    font-size: 15px;
    font-weight: bold;
}
.addPersonnel{
    position: absolute;
    padding: 0.8% 0.8%;
    left: 5%;
    top: 63%;
}
.batchDelete{
    position: absolute;
    padding: 0.8% 0.8%;
    left: 15%;
    top: 63%;
}
.tableList{
    position: absolute;
    left: 5%;
    top: 72%;
    width: 88%;
    height: 25%;
}
.cascader{
    position: relative;
    left: 15px;
    width: 269px;
}
.cascaderTitle{
    position: relative;
    left: 6px;
}
.boom{
    position: relative;
    right: 20px;
    margin-top: -10px;
    margin-bottom: 200px;
}
.searchInput{
    position: absolute;
    right: 510%;
    width: 250%;
}
.searchButton{
    position: absolute;
    top: 16.5%;
    left: 39%;
    padding: 11px 11px;
}
.booms{
    margin-bottom: 250px;
}
.members{
    position: absolute;
    top: 30%;
    left: 3.5%;
    width: 90%;
}
.btn{
    position: absolute;
    top: 85%;
    left: 3.5%;

}
.setinput{
    position: relative;
    right: 20px;
}
.setSelect{
    margin-bottom: 200px;
    left: 10px;
    width: 270px;
}
.setBtn{
    position: relative;
    right: 130px;
}
.Popup{
    margin: 0 auto;
}
.addTitle{
    position: absolute;
    top: 2%;
    left: 3%;
    font-size: 1.5em;
    font-weight: bold;
}
.b{
    margin-left: 5%;
}
.peoper{
    width: 200px;
    right:25px;
}
.addUser{
    margin-left:30px;
}
.peoperPhone{
    width: 200px;
    right: 32px;
}
.sex{
    float: left;
}
.radio{
    position:relative;
    margin-right: 125px;
}
.right{
    float: right;
    width: 100%;
}
.left{
    float:left;
}
.left,.right{
    height:100%;
}
.right-son{
    position: relative;
    left: 260px;
    bottom:100%;
    width:75.7%;
    height:100%;
}
.left-son{
    position: relative;
    width: 260px;
    height: 100%;
    border: 1px solid #CCCCCC;
}
.virtualDepartment{
    position: relative;
    float: left;
    left: 15px;
    margin-top: 13px;
}
.add-input{
    width: 250px;
    margin-right: 70px;
}
.add-department{
    margin-right: 115px;
    width: 200px;
}
.virtual{
    margin-left: 22px;
}
.button-footer{
    margin-right: 157px;
    margin-top: -40px;
}
.small3{
  float: left;
  margin-right: 7px;
  width: 5px;
  height: 22px;
  background: inherit;
  background-color: rgb(10, 10, 10);
  border: none;
  border-radius: 0px;
  box-shadow: none;
  line-height:0
}
</style>
