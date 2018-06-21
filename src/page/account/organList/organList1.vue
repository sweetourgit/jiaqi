<template>
    <div>
        <div class="left">
          <el-tree :data="data" class="tree" :render-content="renderContent"></el-tree>
          <el-button type="primary" class="addTopOrganization" @click="addTopOrganization = true">+ &nbsp;&nbsp;&nbsp;&nbsp;顶级组织</el-button>
        </div>
        <div class="right">
          <div class="right-top">
            <span class="rightTitle">东南亚部</span>
          </div>
          <div class="right-btn">
            <div class="btn-top">
              <el-button plain class="editDepartment" @click="editDepartment = true">编辑</el-button>
              <el-button type="primary" class="addSubdivision" @click="addSubdivision = true">+ &nbsp;子部门</el-button>
            </div>
            <!-- <span class="inheritanceRules">默认限制向上继承</span>
            <el-switch v-model="switchs" active-color="#13ce66" inactive-color="#ff4949" class="switch"></el-switch> -->
          </div>
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
          <div class="small2"></div>
          <span class="personnelTitle">部门人员</span>
          <div class="btn-boom">
            <el-button plain class="addPersonnel" @click="addPersonnel = true">添加成员</el-button>
            <el-button type="danger" class="batchDelete" disabled v-if="kk[0] == undefined">批量移除</el-button>
            <el-button type="danger" class="batchDelete" @click="open2" v-if="kk[0] !== undefined">批量移除</el-button>
          </div>
          <el-table :data="tableList" border class="tableList" @select="del" @select-all="del" max-height="163">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <el-table-column prop="position" label="职位" align="center"></el-table-column>
            <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="180px">
                <template slot-scope="scope">
                    <el-button class="b" plain size="small">进入</el-button>
                    <el-button type="primary" size="small" @click="position = true">编辑</el-button>
                </template>
            </el-table-column>
          </el-table>
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
        <el-dialog  class="Popup" :visible.sync="addPersonnel" style="width:90%;height:105%;">
            <div class="booms">
                <span class="addTitle">添加成员</span>
                <el-form :model="updata">
                    <el-form-item :label-width="LabelWidth">
                        <el-input v-model="person.search" auto-complete="off" class="searchInput" placeholder="输入名称检索"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" class="searchButton" @click="oo">搜索</el-button>
            </div>
            <el-table :data="members1" border class="members" v-show="jj">
                <el-table-column type="selection" width="30%" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center" width="60%" fixed="left"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center" width="120%" fixed="left"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center" width="200%"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center" width="200%"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" width="120%"></el-table-column>
                <el-table-column prop="state" label="状态" align="center" width="120%"></el-table-column>
            </el-table>

            <el-table ref="table" :data="members" border class="members" v-show="!jj" @selection-change="qq">
                <el-table-column type="selection" width="30%" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"  width="60%" fixed="left"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"  width="120%" fixed="left"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"  width="200%"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"  width="200%"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"  width="120%"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"  width="120%"></el-table-column>
            </el-table>
            <div class="black">
              <el-pagination :page-sizes="[8]" background  layout="total, sizes, prev, pager, next, jumper" :total="this.members.length">
              </el-pagination>
            </div>
            <div slot="footer" class="btn">
                <el-button @click="addPersonnel2">取 消</el-button>
                <el-button type="primary" @click="qqq">添加</el-button>
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
            name: '二狗',
            phone: '188888888888',
            email: '453014568@qq.com',
            sex: '男',
            state: '启用',
        },{
            id: '002',
            name: '狗蛋',
            phone: '17777777777',
            email: '66666@sina.com',
            sex: '女',
            state: '停用',
        },{
            id: '003',
            name: '孙福贵',
            phone: '0000000000',
            email: 'dadsaddsa.com',
            sex: '女',
            state: '停用',
        },{
            id: '004',
            name: '二柱子',
            phone: '4324235454',
            email: 'asdasd12312da.com',
            sex: '女',
            state: '停用',
        },{
            id: '005',
            name: '翠花',
            phone: '132312323',
            email: '发送到发送到a.com',
            sex: '男',
            state: '停用',
        },{
            id: '006',
            name: '钢蛋',
            phone: '321312325454',
            email: 'a而且为其da.com',
            sex: '女',
            state: '停用',
        },{
            id: '007',
            name: '谢大脚',
            phone: '142343',
            email: 'as发斯蒂芬a.com',
            sex: '男',
            state: '停用',
        },{
            id: '008',
            name: '铁西阿强',
            phone: '345435',
            email: 'a98da.com',
            sex: '女',
            state: '停用',
        }],
        //成员列表临时数据
        tableList: [{
            id: '001',
            name: '二狗',
            position: '经理',
            phone: '13011111111',
            sex: '男',
        },{
            id: '002',
            name: '狗蛋',
            position: '员工',
            phone: '13022222222',
            sex: '女',
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
        if(this.addPersonnel == true){
            for(let i=0;i<this.tableList.length;i++){
                let obj = this.tableList[i]
                let num = obj.id
                for(let j=0;j<this.members.length;j++){
                    let aj = this.members[j]
                    let n = aj.id
                    if(num == n){
                        setTimeout(() => {
                            this.$refs.table.toggleRowSelection(this.members.find(d => d.id == num),true)
                        },0)
                    }
                }
            }

        }
    },
    created: function(){
        this.$http.post('http://api.dayuntong.com:3009/api/orglist',{
            IsDeleted: '0',
        }).then(function(response){
            console.log(response);
        }).catch(function(error){
            console.log(error);
        });
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
                    for(let j=0;j<this.tableList.length;j++){
                        if(this.tableList[j].id.indexOf(this.kk[i].id) !== -1){
                            // this.tableList.splice(this.kk[i].id - 1,this.kk.length)
                            // console.log(this.tableList)
                            // console.log(this.kk)
                            console.log(this.tableList.indexOf(this.kk[i].id))
                            // console.log(this.kk.length)
                        }
                    }
                }
                // for(let i=0;i<this.dataNum.length;i++){
                //     for(let j=0;j<this.tableList.length;j++){
                //         if(this.tableList[j].id.indexOf(this.dataNum[i].id) !== -1){
                //             this.dataNum.splice(this.dataNum[i],i+1)
                //         }
                //     }
                // }
                 // for(let i=0;i<this.kk.length;i++){
                 //    this.tableList.splice(this.kk,this.kk.length)
                 // }
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
        console.log(row)
        this.kk = selection
        // this.kk = []
        // for(let i=0;i<selection.length;i++){
        //     if(this.tableList.length == 1 && selection[i].id !== 0){
        //         this.kk[i] = selection[i]
        //     } else {
        //         this.kk[i] = selection[i].id
        //     }
        // }
    },
    addSubdivision1(a) {
        this.addSubdivision = false
        this.$refs[a].resetFields();
    },
    appendSave() {
        if(this.addInput.departmentNames === '' || this.addInput.departmentCode === '' || this.addInput.radio === '' || this.addInput.sort === '' || this.addInput.phone === '' || this.addInput.fax === ''){
            this.$message.warning('红☆为必填选项，请认真填写！')

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
    qq(a){
        this.dataNum = a
      },
    qqq(){
        for(let i=0;i<this.dataNum.length;i++){
            for(let j=0;j<this.tableList.length;j++){
                if(this.tableList[j].id.indexOf(this.dataNum[i].id) !== -1){
                    this.dataNum.splice(this.dataNum[i],i+1)
                }
            }
        }
        if(this.dataNum.length < 1){
            this.$message.error("没有数据被添加")
        } else {
            for(let k=0;k<this.dataNum.length;k++){
                this.tableList.push({
                    id: this.dataNum[k].id,
                    name: this.dataNum[k].name,
                    position: "",
                    phone: this.dataNum[k].phone,
                    sex: this.dataNum[k].sex,
                })
            }
                this.$message.success("添加成功")
                this.addPersonnel = false
                this.dataNum = [];
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
      },
      addPersonnel1(){
        this.addPersonnel = true
      },
      addPersonnel2() {
        this.addPersonnel = false
        this.dataNum = [];
      },
      renderContent(h, { node, data, store }){
        return (
          <span>
            <img style="position:relative;bottom: -3px" width="20px" src="../static/organList-image/ewqdewq.png"></img>
            <span>{node.label}</span>
          </span>
        )
      }
    }
}
</script>

<style scoped>
.addTopOrganization{
    position: absolute; 
    bottom: 0%;
    left: 0%;
    width: 100%;
    height: 6.6%;
    border-radius: 0;
}
.organizationInput{
    right: 17%
}
.tree{
    float: left;
    left: 13%;
    margin-top: 12%;
}
.btn-top{
  position: absolute;
  width: 50%;
  height: 100%;
  margin-top: 4.2%;
}
.editDepartment{
    float: left;
    width: 100px;
    height: 40px;
    margin-left: 4%;
    top: 63%;
}
.addSubdivision{
    float: left;
    width: 100px;
    height: 40px;
    margin-left: 6.5%;
    top: 63%;
}
.inheritanceRules{
    position: absolute;
    right: 13%;
    top: 43%;
    color: #999999
}
.switch{
    position: absolute;
    margin-left: 40%;
    top: 43%;
}
.small1{
    position: absolute;
    left: 4%;
    top: 23.5%;
    width: 4px;
    height: 22px;
    background: inherit;
    background-color: #3095FA;
    border: none;
    border-radius: 0px;
    box-shadow: none;
    line-height:0
}
.lowerTitle{
    position: absolute;
    left: 6%;
    top: 23.2%;
    font-size: 20px;
}
.divisionTable{
    position: absolute;
    top: 29.2%;
    left: 4%;
    width: 70%;
    height: 25%;
}
.small2{
    position: absolute;
    left: 4%;
    top: 55%;
    width: 4px;
    height: 22px;
    background: inherit;
    background-color: #3095FA;
    border: none;
    border-radius: 0px;
    box-shadow: none;
    line-height:0
}
.personnelTitle{
    position: absolute;
    left: 6%;
    top: 54.7%;
    font-size: 20px;
}
.addPersonnel{
    float: left;
    width: 100px;
    height: 40px;
    margin-left: 4%;
    top: 63%;
}
.batchDelete{
    float: left;
    width: 100px;
    height: 40px;
    margin-left: 3%;
    top: 63%;
}
.btn-boom{
  position: absolute;
  width: 100%;
  height: 8%;
  top: 62.8%;
}
.tableList{
    position: absolute;
    left: 4%;
    top: 73.5%;
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
    top: 7.4%;
    left: 39%;
    padding: 11px 11px;
}
.booms{
    margin-bottom: 250px;
}
.members{
    margin-bottom: -120px;
    top: -200px;
    left: 1.3%;
    width: 90%;
}
.btn{
    position: absolute;
    top: 92%;
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
.right{
  position: absolute;
  width: 46.1%;
  height: 70%;
  margin-top: 1%;
  margin-left: 23.4%;
  border: 2px solid #E6E6E6;
}
.left{
  position: absolute;
  width: 21.1%;
  height: 70%;
  border: 2px solid #E6E6E6;
  margin-top: 1%;
  margin-left: 1%;
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
  background-color: #F38F00;
  border: none;
  border-radius: 0px;
  box-shadow: none;
  line-height:0
}
.son-title{
  position: absolute;
  float: right;
  width: 106.4%;
  height: 8%;
  left: 0.2%;
  background-color: #F6F6F6;
}
.right-top{
  position: absolute;
  width: 100%;
  height: 7.1%;
  background-color: #F6F6F6;
}
.rightTitle{
  position: absolute;
  left: 4.3%;
  top: 30%;
  font-size: 20px;
}
.right-btn{
  position: absolute;
  width: 100%;
  height: 12.4%;
  top: 7%;
}
.black{
  position: absolute;
  top: 85%;
  right: 10%;
}
.yy{
  position: relative;
  top: -5px
}
</style>
