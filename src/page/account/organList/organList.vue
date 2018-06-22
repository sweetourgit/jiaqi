<template>
    <div>
        <div class="left">
            <div class="hh">
          <el-tree ref="oppo" @node-click="treeClick" :props="props1" node-key="orgID" :load="loadNode" class="tree" @dblclick.native="treeDblclick()" :render-content="renderContent" lazy :expand-on-click-node="isexpand" :default-expanded-keys="treeKey"></el-tree>
          </div>
          <el-button type="primary" class="addTopOrganization" @click="addTopOrganization = true">+ &nbsp;&nbsp;&nbsp;&nbsp;顶级组织</el-button>
        </div>
        <div class="right">
          <div class="right-top">
            <span class="rightTitle">{{addInput.topDepartment}}</span>
          </div>
          <div class="right-btn">
            <div class="btn-top">
              <el-button plain class="editDepartment" @click="editDepartment1">编辑</el-button>
              <el-button type="primary" class="addSubdivision" @click="addSubdivision1">+ &nbsp;子部门</el-button>
            </div>
            <!-- <span class="inheritanceRules">默认限制向上继承</span>
            <el-switch v-model="switchs" active-color="#13ce66" inactive-color="#ff4949" class="switch"></el-switch> -->
          </div>
          <div class="small1"></div>
          <span class="lowerTitle">下级部门</span>
          <el-table :data="tableData" border class="divisionTable" max-height="163">
            <el-table-column prop="label" label="部门" align="center"></el-table-column>
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
            <el-button plain class="addPersonnel" @click="addPersonnel1">添加成员</el-button>
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
                <el-cascader @active-item-change="department" :props="props" :options="options" class="cascader"></el-cascader>
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
                    <el-radio label="是" value="1"></el-radio>
                    <el-radio label="否" value="2"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="末级部门" class="virtual" prop="lastStage">
                    <el-radio-group class="virtualDepartment" v-model="addInput.lastStage">
                    <el-radio label="1" value="1">是</el-radio>
                    <el-radio label="2" value="2">否</el-radio>
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
            <div class="kk">
            <div class="booms">
                <span class="addTitle">添加成员</span>
                <el-form :model="updata">
                    <el-form-item :label-width="LabelWidth">
                        <el-input v-model="person.search" auto-complete="off" class="searchInput" placeholder="输入名称检索"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" class="searchButton" @click="oo">搜索</el-button>
            </div>
            <el-table ref="table" :data="members" border class="members" @selection-change="qq">
                <el-table-column type="selection" width="30%" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"  width="60%" fixed="left"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"  width="120%" fixed="left"></el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"  width="200%"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"  width="200%"></el-table-column>
                <el-table-column prop="sex" label="性别" align="center"  width="120%"></el-table-column>
                <el-table-column prop="state" label="状态" align="center"  width="120%"></el-table-column>
            </el-table>
            <div class="black">
              <el-pagination :page-sizes="[pagesize]" background @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
            <div slot="footer" class="btn">
                <el-button @click="addPersonnel2">取 消</el-button>
                <el-button type="primary" @click="qqq">添加</el-button>
            </div>
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
    created: function (){
      this.TreeData()
    },
  data () {
    return {
        // data3: [{
        //     label: '辽宁大运通（2000人）',
        //     children: [{
        //         label: '亚洲部（1000人）',
        //         children: [{
        //             label: '东南亚部（500人）',
        //             children: [{
        //                 label: '日本部（250人）',
        //             },{
        //                 label:'韩国部（250人）',
        //             }]
        //         },{
        //             label: '北欧部（500人）',
        //             children: [{
        //                 label: '瑞典部（250人）',
        //             },]
        //         }]
        //     },{
        //         label: '客服部（1000人）',
        //     }]
        // }],
        data: [],
        data1: [],
        data2:[],
        switchs: true,
        // 子部门临时数据
        tableData: [],
        // {
        //     division: '子部门1'
        
        // }
        // 增加顶级组织
        addTopOrganization: false,
        form: {
            organizationName: ''
        },
        organizationName: '',
        formLabelWidth: '90px',
        // 编辑部门
        editDepartment: false,
        updata: {
            departmentName: ''
        },
        updataLabelWidth: '90px',
        // 级联选择器
        options: [],
        // 添加子部门
        addSubdivision: false,
        addInput: {
            departmentNames: '',
            topDepartment: '',
            radio: '',
            lastStage:'2',
            departmentCode: '',
            sort: '',
            phone: '',
            fax: '',
            note: '',
            ParentID: ''
        },
        rules: {
            departmentNames: [
                {required: true, message: "请输入部门名称", trigger: "blur"}
            ],
            radio: [
                {required: true, trigger: "blur"}
            ],
            lastStage: [
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
        members: [],
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


        members1: [],
        //每页的数据条数
        pagesize:4,
        //默认开始页面
        currentPage:1,
        total: '',
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
        kk: [],
        show: true,
        isexpand: false,
        treeKey: [],
        Parents: [],
        key: -1,
        props: {
          value: 'orgID',
          children: 'cities',
        },
        props1: {
          label: 'label',
          isLeaf: 'leaf'
        },
        keyID: []
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
        if(this.addInput.departmentNames === '' || this.addInput.departmentCode === '' || this.addInput.radio === '' || this.addInput.sort === '' || this.addInput.phone === '' || this.addInput.fax === ''){
            this.$message.warning('红☆为必填选项，请认真填写！')

        }else{
                var _this = this
                this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptinsert',{
                    "Id": 11,
                    "Object": {
                        "OrgID": 1,
                        "OrgName": this.addInput.departmentNames,
                        "IsDeleted": 1,
                        "Code": "1",
                        "ParentID": this.addInput.ParentID,
                        "Physical": 1,
                        "isleaf": this.addInput.lastStage,
                        "OrgCode": this.addInput.departmentCode,
                        "Rank": this.addInput.sort,
                        "OfficeTel": this.addInput.phone,
                        "OfficeFax": this.addInput.fax,
                        "Mark": this.addInput.note,
                        "CreateUser": "admin",
                        "CreateTime": "2018-06-15 14:11:22"
                    }
                 }
                 ).then(function(response){
                    _this.TreeData()
                    // console.log(response);
                  }).catch(function(error){
                    console.log(error);
                  });
                this.addSubdivision =  false
                this.addInput.departmentNames = ""
                this.$message.success('添加成功')
            }
            // departmentNames: '',
            // topDepartment: '东南亚部',
            // radio: '',
            // departmentCode: '',
            // sort: '',
            // phone: '',
            // fax: '',
            // note: '',
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
        let _this = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptdelete',{
              "Object": {
                "id" : this.tableData[index].orgID
              }
            })
            .then(function(response){
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
      addPersonnel1(){
        // this.addPersonnel = true
        this.members = []
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/userpage',{
          "pageSize": _this.pagesize,
          "pageIndex": _this.currentPage,
        })
        .then(function(response){
          _this.total = response.data.total
            for(let i=0;i<response.data.objects.length;i++){
                _this.members.push({
                    id: response.data.objects[i].id,
                    name: response.data.objects[i].name,
                    phone: response.data.objects[i].mobile,
                    email: response.data.objects[i].email,
                    sex: response.data.objects[i].sex,
                    state: '启用',
                    key: i,
                })
            }
            _this.addPersonnel = true
            // console.log(response)
          }).catch(function(error){
            console.log(error);
          });
      },
      addPersonnel2() {
        this.addPersonnel = false
        this.dataNum = [];
      },
      treeClick(a,b,c) {
        this.addInput.ParentID = a.orgID
        this.addInput.topDepartment = a.label
        this.updata.departmentName = a.label
        // this.addInput.ParentID = a.ParentID
        this.Parents = a
        this.tableData = []
        // console.log(this.data1)
        // console.log(a)
        // console.log(this.$refs.oppo.store.setDefaultExpandedKeys)
        // alert(11111)
        // console.log(this.$refs.oppo.store)
        // for(var i=0;i<this.$refs.oppo.store._getAllNodes().length;i++){
        //    this.$refs.oppo.store.nodesMap[i].expanded=true;
        // }
        // console.log(a)
        // console.log(this.data2)
        var _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "Object": {
                "ParentID" : a.orgID
            }
        }).then((response) =>{
                for(let i=0;i<response.data.objects.length;i++){
                    _this.tableData.push({
                            label: response.data.objects[i].orgName,
                            orgID: response.data.objects[i].orgID,
                            key: i,
                            value: response.data.objects[i].orgID,
                        })
                    // for(let k=0;k<_this.data2.length;k++){
                    //   if(_this.data2[k].orgID == response.data.objects[i].orgID){
                    //     let pp = _this.data2.indexOf(_this.data2[k])
                    //     _this.data2.splice(pp,1)
                    //   }
                    // }
                }
                // console.log(_this.data2)
                // _this.data[a.key].children = _this.data[a.key].children.concat(_this.data1)
            // console.log(_this.data2)
          }).catch(function(error){
            console.log(error);
          });
      },
      //树形控件父级数据加载
      loadNode(node, resolve){
        this.data = []
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "Object": {
                "ParentID" : -1
            }
        }).then((response) =>{
            for(let i=0;i<response.data.objects.length;i++){
              if (node.level === 0) {
                resolve([{
                  label: response.data.objects[i].orgName,
                  key: i,
                  orgID: response.data.objects[i].orgID,
                  isLeaf: response.data.objects[i].isLeaf
                }])
              }
            }
            // _this.treeClick(response.data.objects[0])
          }).catch(function(error){
            console.log(error);
          });
        if(node.level >= 1){
             this.getUser(node.data.key, node.data.label, node.data.orgID, node.data.isLeaf, resolve);
        }
      },
      getUser(key,label,orgID,isLeaf,resolve) {
        // this.addInput.ParentID = a.orgID
        // console.log(this.Parents)
        this.data1 = []
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "Object": {
                "ParentID" : orgID
            }
        }).then((response) =>{
                for(let i=0;i<response.data.objects.length;i++){
                  if(response.data.objects[i].isLeaf == 1){
                    _this.data1.push({
                            label: response.data.objects[i].orgName,
                            orgID: response.data.objects[i].orgID,
                            key: i,
                            cities: [],
                            isLeaf: response.data.objects[i].isLeaf,
                            leaf: true
                        })
                  } else if(response.data.objects[i].isLeaf == 2){
                    _this.data1.push({
                            label: response.data.objects[i].orgName,
                            orgID: response.data.objects[i].orgID,
                            key: i,
                            cities: [],
                            isLeaf: response.data.objects[i].isLeaf,
                            leaf: false
                        })
                  }     
                }
                // console.log(response.data.objects[0].isLeaf)
                // console.log(_this.data1)
                // console.log(response)
                setTimeout(() => {
                let data = _this.data1
                resolve(data)
            },200)
                // _this.data[a.key].children = _this.data[a.key].children.concat(_this.data1)
          }).catch(function(error){
            console.log(error);
          });
      },




      TreeData(){
        this.data = []
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "Object": {
                "ParentID" : -1
            }
        }).then((response) =>{
            for(let i=0;i<response.data.objects.length;i++){
                _this.data.push({
                    label: response.data.objects[i].orgName,
                    orgID: response.data.objects[i].orgID,
                    key: i,
                    cities: [],
                    isLeaf: 'leaf'
                })
            }
            // _this.addInput.topDepartment = _this.data[0].label
            // _this.addInput.ParentID = _this.data[0].ParentID
            _this.treeClick(_this.data[0])
          }).catch(function(error){
            console.log(error);
          });
      },




      addSubdivision1(){
        if(this.addInput.ParentID == ''){
            this.$message.warning('请先选择父级部门！')
        } else {
            this.addSubdivision = true
            // this.addInput.topDepartment = 
        }
      },
      // 双击展开
      treeDblclick(){
        console.log(this.Parents)
        this.treeKey = []
        if(this.Parents.isLeaf == 2){
          this.treeKey.push(this.Parents.orgID)
        }
         // console.log(this.Parents)
        let _this = this
        // this.treeKey.in_array = function (element){
        //   for(let i=0;i<_this.treeKey.length;i++){
        //     if(_this.treeKey[i] == element){
        //       return true;
        //     }
        //   } return false;
        // }
        // if(this.treeKey.in_array(this.Parents.orgID) == true){
        //   this.key += 1
        //   for(let i=0;i<_this.treeKey.length;i++){
        //     if(_this.treeKey[i] == _this.Parents.orgID){
        //       let pp = _this.treeKey.indexOf(_this.treeKey[i])
        //       _this.treeKey.splice(pp,1)
        //       document.getElementsByClassName('el-tree-node__children')[pp].style.display = 'none';
        //       document.getElementsByClassName('expanded')[pp].style.webkitTransform = 'rotate(0deg)';
        //     }
        //   }
        // } else {
        //   _this.treeKey.push(this.Parents.orgID)
        // }
      },
      editDepartment1(){
        this.editDepartment = true
        this.options = this.data
        // for(let i=0;i<this.data.length;i++){
        //   this.
        // }
        // options: [{
        //     value: 'tianchenglvxingwang',
        //     label: '甜程旅行网',
        //     children: [{
        //         value: 'xiaoshoubu',
        //         label: '销售部',
        //         children: [{
        //             value: 'xiaoshou1bu',
        //             label: '销售1部',
        //         }]
        //     },{
        //         value: 'caozuobu',
        //         label: '操作部',
        //     },{
        //         value: 'caiwubu',
        //         label: '财务部',
        //     },{
        //         value: 'yunying',
        //         label: '运营',
        //     },{
        //         value: 'lianguanzhongxin',
        //         label: '连管中心'
        //     }]
        // }]

        // this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
        //     "Object": {
        //         "ParentID" : -1
        //     }
        // }).then((response) => {

        // }).catch((error) => {
        //   console.log(error)
        // })
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.addPersonnel1()
      },
      department(a, b) {
        this.keyID = []
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "Object": {
                "ParentID" : a[0]
            }
        }).then((response) => {
          for(let i=0;i<_this.options.length;i++){
            // _this.keyID.push(_this.options[i].orgID)
            
            // if(_this.keyID.indexOf(a[0]) !== -1){
            //   console.log(_this.keyID.indexOf(a[0]))
            //   for(let k=0;k<response.data.objects.length;k++){
            //     _this.options[_this.keyID.indexOf(a[0])].cities = [{
            //       label: response.data.objects[k].orgName,
            //       orgID: response.data.objects[k].orgID,
            //       key: k,
            //     }]
            //   }
            // }
            
            
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      renderContent(h, { node, data, store }){
        if(data.isLeaf == 1){
          return (
            <span>
              <img style="position:relative;bottom: -3px" width="20px" src="../static/organList-image/257785656210656304.png"/>
              <span>{node.label}</span>
            </span>
          )
        } else if(data.isLeaf == 2){
          return (
            <span>
              <img style="position:relative;bottom: -3px" width="20px" src="../static/organList-image/ewqdewq.png"/>
              <span>{node.label}</span>
            </span>
          )
        }
        
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
    user-select:none;
}
.hh{
    position:absolute;
    float: left;
    left: 13%;
    margin-top: 12%;
    width: 300px;
    height: 500px;
    overflow: auto;
}
.btn-top{
  position: absolute;
  width: 50%;
  height: 100%;
  left: 2%;
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
    top: 24%;
    font-size: 20px;
}
.divisionTable{
    position: absolute;
    top: 29.2%;
    left: 4%;
    width: 70%;
    height: 24%;
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
    top: 55.5%;
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
    top: 9%;
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
.kk{
    min-height: 700px;
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
  margin-left: 450px;
  border: 2px solid #E6E6E6;
}
.left{
  position: absolute;
  width: 400px;
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
  height: 50px;
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
