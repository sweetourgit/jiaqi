<template>
    <div>
        <div class="left">
            <div class="hh">
          <el-tree ref="oppo" @node-click="treeClick" :props="props1" node-key="id" :load="loadNode" class="tree" @dblclick.native="treeDblclick()" :render-content="renderContent" lazy :expand-on-click-node="isexpand" :default-expanded-keys="treeKey"></el-tree>
          </div>
        </div>
        <div class="right">
          <div class="right-top">
            <span class="rightTitle">{{addInput.topDepartment}}</span>
          </div>
          <div class="right-btn">
            <div class="btn-top">
              <el-button plain class="editDepartment" @click="editDepartment1(addInput.ParentID)">编辑</el-button>
              <el-button type="primary" class="addSubdivision" @click="addSubdivisionOpen">+ &nbsp;子部门</el-button>
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
                        <el-button type="primary" size="small" @click="treeClick(scope.row)">进入</el-button>
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
        <!-- 编辑部门弹框 -->
        <el-dialog class="updataPopup" :visible.sync="editDepartment">
          <div class="boom">
            <el-form :model="updata" :rules="rules">
              <el-form-item label="部门名称" :label-width="updataLabelWidth">
                <el-input v-model="updata.orgName" auto-complete="off"></el-input>
              </el-form-item>
              <!-- <span class="cascaderTitle">上级部门</span>
              <el-cascader @active-item-change="department" :props="props" :options="options" filterable change-on-select class="cascader"></el-cascader> -->


                        <el-form-item label="父级部门:" class="form-la">
                         <el-select v-model="value" placeholder="请选择" @change="HandChange()" class="form-xi">
                           <el-option
                             v-for="item in options"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                       <el-form-item label="子部门1:" class="form-la">
                         <el-select v-model="value1" placeholder="请选择"   @change="HandChange1()" class="form-xi">
                           <el-option
                             v-for="item in options1"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                       <el-form-item label="子部门2:" class="form-la" v-if="bumen2">
                         <el-select v-model="value2" placeholder="请选择"   @change="HandChange2()" class="form-xi">
                           <el-option
                             v-for="item in options2"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>

                       <el-form-item label="子部门3:" class="form-la" v-if="bumen1">
                         <el-select v-model="value3" placeholder="请选择" class="form-xi">
                           <el-option
                             v-for="item in options3"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                           </el-option>
                         </el-select>
                       </el-form-item>




              <el-form-item label="虚拟部门" class="eidt-virtual" prop="radio">
                <el-radio-group class="virtualDepartment" v-model="updata.radio">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="末级部门" class="updata-virtual" prop="lastStage">
                <el-radio-group class="virtualDepartment" v-model="updata.lastStage">
                 <el-radio label="1">是</el-radio>
                 <el-radio label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="部门编码" :label-width="Width" prop="departmentCode">
                <el-input v-model="updata.departmentCode" auto-complete="off" class="F"></el-input>
              </el-form-item>
              <el-form-item label="排序" :label-width="Width" prop="sort">
                <el-input v-model="updata.sort" auto-complete="off" class="add-department"></el-input>
              </el-form-item>
              <el-form-item label="电话" :label-width="Width" prop="phone">
               <el-input v-model="updata.phone" auto-complete="off" class="add-department"></el-input>
              </el-form-item>
              <el-form-item label="传真" :label-width="Width" prop="fax">
               <el-input v-model="updata.fax" auto-complete="off" class="add-department"></el-input>
              </el-form-item>
              <el-form-item label="备注" :label-width="Width" prop="note">
                <el-input style="resize:none" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="updata.note" class="add-department"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="operation">
          <el-button class="btn_foot" @click="editDepartment = false">取 消</el-button>
          <el-button class="btn_foot" type="primary" @click="updataEditSave(updata)">保存</el-button>
          <el-button class="btn_foot" type="danger" @click="remove = false">删除</el-button>
          </div>
        </el-dialog>
        <!-- 添加子部门弹框 -->
        <el-dialog class="Popup" :visible.sync="addSubdivision">
            <el-form :model="addInput" :rules="rules" status-icon ref="addInput">
                <el-form-item label="部门名称" :label-width="Width" prop="name">
                    <el-input v-model="addInput.name" auto-complete="off" class="add-input"></el-input>
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
                    <el-input v-model="addInput.departmentCode" auto-complete="off" class="F"></el-input>
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
        <el-dialog  class="popup" :visible.sync="addPersonnel">
            <div class="kk">
            <div class="booms">
                <span class="addTitle">添加成员</span>
                <el-form class="from-content" :model="updata">
                    <el-form-item :label-width="LabelWidth">
                        <el-input v-model="person.search" auto-complete="off" class="searchInput" placeholder="输入名称检索"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" class="searchButton">搜索</el-button>
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
              <el-pagination :page-sizes="[1]" background @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
            <div slot="footer" class="btn">
                <el-button @click="addPersonnel2">取 消</el-button>
                <el-button type="primary" @click="qqq">添加</el-button>
            </div>
            </div>
        </el-dialog>
        <!-- 设置职位弹框 -->
        <el-dialog class="Popup" title="设置职位" :visible.sync="position">
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
        data: [],
        data1: [],
        data2:[],
        switchs: true,
        // 子部门临时数据
        tableData: [],
        // 编辑部门
        editDepartment: false,
        updata: {
          radio: '1',
          lastStage: ''
        },
        updataLabelWidth: '90px',
        // 级联选择器
        options: [],
        value: '',
        options1: [],
        value1: '',
        options2: [],
        value2: '',
        options3: [],
        value3: '',
        arr: [],
        arr1: [],
        arr2: [],
        bumen2: false,
        bumen1: false,
        // 添加子部门
        addSubdivision: false,
        addInput: {
            name: '',
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
            name: [
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
        pagesize:1,
        //默认开始页面
        currentPage:1,
        total: 1,
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
        flag: true, // 调用数组第一个
        props: {
          value: 'value',
          children: 'cities',
        },
        props1: {
          label: 'label',
          isLeaf: 'leaf'
        },
        keyID: [],
        deleteNum:[]
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
    // 添加部门
    appendSave() {
      console.log(this.tableData)
      console.log(this.addInput)
        if(this.addInput.departmentNames === '' || this.addInput.departmentCode === '' || this.addInput.radio === '' || this.addInput.sort === '' || this.addInput.phone === '' || this.addInput.fax === ''){
            this.$message.warning('红☆为必填选项，请认真填写！')
        }else{
          var _this = this
          this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptinsert',{
            "object": {
                "id": 0,
                "orgName": this.addInput.name,
                "isDeleted": 0,
                "code": "string",
                "parentID": this.addInput.ParentID,
                "physical": 0,
                "orgCode": 0,
                "rank": this.addInput.sort,
                "officeTel": this.addInput.phone,
                "officeFax": this.addInput.fax,
                "mark": this.addInput.note,
                "isLeaf": this.addInput.lastStage,
            }
          }).then(function(response){
            _this.addSubdivision =  false
            let num = Object();
            num.id = _this.addInput.ParentID
            num.isLeaf = _this.addInput.lastStage
            num.key = 0
            num.label = _this.addInput.topDepartment
            _this.treeClick(num)
            _this.addInput.departmentNames = ""
            _this.$refs['addInput'].resetFields()
            _this.$message.success('添加成功')
            }).catch(function(error){
              console.log(error);
            });
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
        let _this = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove1(this.tableData[index].id, index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 删除当前部门的子级部门
      remove1(id, index){
        var _this = this
        this.deleteNum.push(id)
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptdelete',{
                "id" : id
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


        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "object":{
              "parentID" : id
            }
          }).then((res) => {
            // console.log(res.data.objects)
            if(res.data.objects !== ''){
              for(var i=0;i<res.data.objects.length;i++){
                this.remove1(res.data.objects[i].id)
              }
            }

          }).catch((err) => {

          })
      },
      addPersonnel1(){
        this.members = []
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/userpage',{
        "object": {
          "isDeleted": 0,
        },
        "pageSize":_this.pagesize,
        "pageIndex": _this.currentPage,
        "isGetAll": true,
        "id": 0
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
          }).catch(function(error){
            console.log(error);
          });
      },
      addPersonnel2() {
        this.addPersonnel = false
        this.dataNum = [];
      },
      // 单击tree节点
      treeClick(a,b,c) {
        this.data = []
        this.tableData = []
        this.addInput.ParentID = a.id
        this.addInput.topDepartment = a.label
        this.Parents = a
        var _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "Object": {
              "ParentID" : a.id
            }
        }).then((response) =>{
            for(let i=0;i<response.data.objects.length;i++){
              if(response.data.objects[i].isDeleted !== 1){
               _this.tableData.push({
                  label: response.data.objects[i].orgName,
                  id: response.data.objects[i].id,
                  key: i,
                  value: response.data.objects[i].id,
                  })
              }
            }
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
                _this.options.push({
                  label: response.data.objects[i].orgName,
                  value: response.data.objects[i].id + '-' + response.data.objects[i].orgName
                })
                resolve([{
                  label: response.data.objects[i].orgName,
                  key: i,
                  id: response.data.objects[i].id,
                  isLeaf: response.data.objects[i].isLeaf,
                }])
              }
            }
            let num = Array();
            num.push({
                id:response.data.objects[0].id,
                isLeaf:response.data.objects[0].isLeaf,
                key:0,
                label:response.data.objects[0].orgName
            })
            if(this.flag){
                _this.treeClick(num[0])
                this.flag = false;
            }

          }).catch(function(error){
            console.log(error);
          });
        if(node.level >= 1){
             this.getUser(node.data.key, node.data.label, node.data.id, node.data.isLeaf, resolve);
        }
      },
      getUser(key,label,id,isLeaf,resolve) {
        this.data1 = []
        let _this = this
        this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptlist',{
            "Object": {
                "ParentID" : id
            }
        }).then((response) =>{
                for(let i=0;i<response.data.objects.length;i++){
                  if(response.data.objects[i].isDeleted !== 1){
                      if(response.data.objects[i].isLeaf == 1){
                      _this.data1.push({
                              label: response.data.objects[i].orgName,
                              id: response.data.objects[i].id,
                              key: i,
                              cities: [],
                              isLeaf: response.data.objects[i].isLeaf,
                              leaf: true
                          })
                    } else if(response.data.objects[i].isLeaf == 2){
                      _this.data1.push({
                              label: response.data.objects[i].orgName,
                              id: response.data.objects[i].id,
                              key: i,
                              cities: [],
                              isLeaf: response.data.objects[i].isLeaf,
                              leaf: false
                          })
                    }
                  }

                }
                setTimeout(() => {
                let data = _this.data1
                resolve(data)
            },200)
          }).catch(function(error){
            console.log(error);
          });
      },
      addSubdivisionOpen(){
        if(this.addInput.ParentID == ''){
            this.$message.warning('请先选择父级部门！')
        } else {
            this.addSubdivision = true
        }
      },
      // 双击展开
      treeDblclick(){
        this.treeKey = []
        if(this.Parents.isLeaf == 2){
          this.treeKey.push(this.Parents.id)
        }
        let _this = this
      },
      // 编辑部门
      editDepartment1(id){
        this.editDepartment = true
         this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptget',{
            "object": {
              "id": id
            }
         }).then((res) => {
          //  console.log(res)
          this.updata.orgName = res.data.object.orgName
          this.updata.departmentCode = res.data.object.orgCode
          this.updata.sort = res.data.object.rank
          this.updata.phone = res.data.object.officeTel
          this.updata.fax = res.data.object.officeFax
          this.updata.note = res.data.object.mark
          this.updata.lastStage = String(res.data.object.isLeaf);
         }).catch((err) => {

         })
        // this.options = this.data
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.addPersonnel1()
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

      },



     HandChange () {
          this.arr = this.value.split('-')
          this.options1 = []
          this.value1 = ''
          this.value2 = ''
          this.value3 = ''
          var that = this
          // 获取顶级，第一级城市beg
          this.$http.post(
            this.GLOBAL.serverSrc + "/api/org/deptlist",
            {
              'order': 'string',
              'object': {
                'isDeleted': 0,
                'parentID': this.arr[0]
              }
            }
          )
            .then(function (obj) {
              if(obj.data.objects.length ==0){
                that.bumen2 = false
                that.bumen1 = false
              }
              console.log(obj)
              var i = ''
              for (i = 0; i < obj.data.objects.length; i++) {
                that.options1.push({
                  label: obj.data.objects[i].orgName,
                  value: obj.data.objects[i].id + '-' + obj.data.objects[i].orgName
                })
              }
            })
            .catch(function (obj) {
            })
        },
        // 编辑部门弹窗
        updataEditSave(updata){
          console.log(updata)
          let _this = this;
            this.$http.post(this.GLOBAL.serverSrc+'/api/org/deptsave',{
              "object": {
                        "id": this.updata.id,
                        "orgName": this.updata.orgName,
                        "isDeleted": 0,
                        "code": "string",
                        "parentID": this.updata.parentID,
                        "physical": 0,
                        "orgCode": 0,
                        "rank": this.updata.rank,
                        "officeTel": this.updata.officeTel,
                        "officeFax": this.updata.officeFax,
                        "mark": this.updata.mark,
                        "isLeaf": this.updata.isLeaf,
                        "loadLeader": true,
                        "createUser": "string",
                        "createTime": "2018-07-16T01:23:50.963Z"
                    },
                    "id": 0
            }).then(function(response){
              console.log(response)
                _this.$message.success('修改成功！')
                _this.editDepartment = false
            }).catch(function(error){
            console.log(error);
            });
          // this.editDepartment = false
        },
        HandChange1: function () {
          this.arr1 = this.value1.split('-')
          this.options2 = []
          this.value2 = ''
          this.value3 = ''
          var that = this
          // 获取顶级，第一级城市beg
          this.$http.post(
            this.GLOBAL.serverSrc + "/api/org/deptlist",
            {
              'order': 'string',
              'object': {
                'isDeleted': 0,
                'parentID': this.arr1[0]
              }
            }
          )
            .then(function (obj) {
              if(obj.data.objects.length ==0){
                that.bumen2 = false
                that.bumen1 = false
              }
              if (obj.data.objects.length !== 0) {
                that.bumen2 = true
              }
              // console.log(obj)
              var i = ''
              for (i = 0; i < obj.data.objects.length; i++) {
                that.options2.push({
                  label: obj.data.objects[i].orgName,
                  value: obj.data.objects[i].id + '-' + obj.data.objects[i].orgName
                })
              }
            })
            .catch(function (obj) {
            })
          // 获取顶级，第一级城市end
        },
        HandChange2 () {
          this.arr2 = this.value2.split('-')
          this.options3 = []
          this.value3 = ''
          console.log(this.arr2[0])
          var that = this
          // 获取顶级，第一级城市beg
          this.$http.post(
            this.GLOBAL.serverSrc + "/api/org/deptlist",
            {
              'order': 'string',
              'object': {
                'isDeleted': 0,
                'parentID': this.arr2[0]
              }
            }
          )
            .then(function (obj) {
              if(obj.data.objects.length ==0){
                that.bumen2 = true
                that.bumen1 = false
              }
              if (obj.data.objects.length !== 0) {
                that.bumen1 = true
              }
              var i = ''
              for (i = 0; i < obj.data.objects.length; i++) {
                that.options3.push({
                  label: obj.data.objects[i].orgName,
                  value: obj.data.objects[i].id + '-' + obj.data.objects[i].orgName
                })
              }
            })
            .catch(function (obj) {
            })
          // 获取顶级，第一级城市end
        },







    }
}
</script>

<style scoped lang='stylus'>
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
.eidt-virtual{
 margin-top:25px;
  margin-left: 21.5px;
}
.updata-virtual{
  position: relative;
  bottom: 5px;
  margin-left: 21.5px;
}
.operation{
  overflow: hidden;
}
.operation .btn_foot{
  float: left;
  margin-left: 33px
}
.updataPopup{
  margin: 0 auto;
}
.form-la{
  margin-left: 20px;
}
.form-xi{
  margin-right: 37px;
}
.el-dialog__wrapper>>>.el-dialog
  width: 400px;
.popup>>>.el-dialog
  width 850px

</style>
