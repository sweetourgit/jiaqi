<template>
    <div>
        <div class="title">组织列表</div>
        <div class="big">
            <div class="left">
                <div class="left-tree">
                    <!-- 树形控件 -->
                    <el-tree :data="data" class="tree"></el-tree>
                </div>
                <div>
                    <el-button type="primary" class="addTopOrganization" @click="addTopOrganization = true">增加顶级组织</el-button>
                </div>
            </div>
            <div class="right">
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
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                    <el-button type="primary" size="small" @click="position = true">职位</el-button>
                                    <el-button type="primary" size="small">权限</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
        <el-dialog class="Popup" :visible.sync="addSubdivision" style="width:800px;">
            <el-form :model="addInput">
                <el-form-item label="部门名称" :label-width="Width">
                    <el-input v-model="addInput.departmentNames" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" :label-width="Width">
                    <el-input v-model="addInput.topDepartment" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="addSubdivision = false">取 消</el-button>
                <el-button type="primary" @click="appendSave">保存</el-button>
            </div>
        </el-dialog>
        <!-- 添加成员弹框 -->
        <el-dialog :visible.sync="addPersonnel" style="width:1700px;margin:0 auto;">
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
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center" width="120" fixed="left"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center" width="120"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center" width="120"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center" width="200"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" width="120"></el-table-column>
                <el-table-column prop="state" label="状态" align="center" width="120"></el-table-column>
            </el-table>

            <el-table :data="members" border class="members" height="250" v-show="!jj" style="90%">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"  width="120" fixed="left"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"  width="120"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"  width="120"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"  width="200"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"  width="120"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"  width="120"></el-table-column>
            </el-table>
            <div slot="footer" class="btn">
                <el-button @click="addPersonnel = false">取 消</el-button>
                <el-button type="primary" @click="personSave = false">保存</el-button>
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
    </div>
</template>

<script>
  export default {
  data () {
    return {
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
        },
        Width: '90px',
        // 添加成员
        addPersonnel: false,
        person: {
            search: '',
        },
        LabelWidth: '700px',
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
  beforeUpdate: function (){
    console.log(this.form.organizationName)
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
    appendSave() {
        this.tableData.push({
            division: this.addInput.departmentNames
        })
        this.addSubdivision =  false
        this.addInput.departmentNames = ""
        this.$message.success('添加成功')
    },
    addSave() {
        this.data.push({
            label: this.form.organizationName,
            children: [{

            }]
        })
        this.addTopOrganization = false
        this.form.organizationName = ""
        this.$message.success('添加成功')
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
    }




    }
}
</script>

<style scoped>
.big{
    position: relative;
    float: left;
    width: 1200px;
    height: 666px;
    border: 1px solid #CCCCCC;
    margin-top: 70px;
    margin-left: -80px;
}
.title{
    position: relative;
    float: left;
}
.left{
    width: 300px;
    height: 665px;
    border: 1px solid #CCCCCC;
}
.left-tree{
    position: relative;
    float: left;
    margin-top: 16px;
    margin-left: 18px;
    width: 260px;
    height: 612px;
    border: 1px solid #797979;
}
.addTopOrganization{
    position: relative;
    float: left;
    width: 260px;
    height: 39px;
    margin-top: -40px;
    margin-left: 19px;
}
.organizationInput{
    position: absolute;
    right: 40px;
}
.tree{
    position: relative;
    float: left;
    left: 19px;
    margin-top: 25px;
}
.asia{
    position: relative;
    float: left;
    margin-top: -650px;
    margin-left: 335px;
}
.editDepartment{
    position: relative;
    float: left;
    padding: 10px 10px;
    margin-top: -605px;
    margin-left: 347px;
}
.addSubdivision{
    position: relative;
    float: left;
    padding: 10px 10px;
    margin-top: -605px;
    left: 433px;
    font-weight: bold;
}
.inheritanceRules{
    position: relative;
    float: left;
    margin-top: -598px;
    margin-left: 580px;
    font-size: 16px;
}
.switch{
    position: relative;
    float: left;
    margin-top: -596px;
    margin-left: 730px;
}
.small1{
    position: absolute;
    left: 350px;
    top: 140px;
    width: 7px;
    height: 22px;
    background: inherit;
    background-color: rgba(215, 215, 215, 1);
    border: none;
    border-radius: 0px;
    box-shadow: none;
    line-height:0
}
.lowerTitle{
    position: absolute;
    left: 370px;
    top: 143px;
    font-size: 10px;
    font-weight: bold;
}
.divisionTable{
    position: absolute;
    top: 180px;
    left: 370px;
    width: 600px;
}
.small2{
    position: absolute;
    left: 350px;
    top: 370px;
    width: 7px;
    height: 22px;
    background: inherit;
    background-color: rgba(215, 215, 215, 1);
    border: none;
    border-radius: 0px;
    box-shadow: none;
    line-height:0
}
.personnelTitle{
    position: absolute;
    left: 370px;
    top: 373px;
    font-size: 10px;
    font-weight: bold;
}
.addPersonnel{
    position: absolute;
    padding: 10px 10px;
    left: 370px;
    top: 410px;
}
.batchDelete{
    position: absolute;
    padding: 10px 10px;
    left: 490px;
    top: 410px;
}
.tableList{
    position: absolute;
    left: 370px;
    top: 480px;
    width: 808px;
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
    position: relative;
    right: 690px;
    top: -30px;
    width: 262px;
}
.searchButton{
    position: absolute;
    left: 310px;
    top: 66px;
    line-height: 0
}
.booms{
    margin-bottom: 250px;
}
.members{
    position: absolute;
    top: 120px;
    left: 30px;
    width: 770px;
}
.btn{
    position: relative;
    right: 635px;
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
    position: absolute;
    left: 600px;
    top: 100px;
}
.addTitle{
    position: relative;
    right: 353px;
    bottom: 45px;
    font-size: 21px;
    font-weight: bold;
}
</style>
