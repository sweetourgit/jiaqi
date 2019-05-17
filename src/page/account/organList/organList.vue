<template>
  <div>
    <div class="left">
      <div class="hh">
        <el-tree ref="oppo" @node-click="treeClick" :props="props1" node-key="id" :load="loadNode" class="tree" @dblclick.native="treeDblclick" :render-content="renderContent" lazy :expand-on-click-node="isexpand" :default-expanded-keys="treeKey" highlight-current></el-tree>
      </div>
    </div>
    <div class="right">
      <div class="right-top">
        <span class="rightTitle">{{addInput.topDepartment}}</span>
      </div>
      <div class="right-btn">
          <el-button plain class="editDepartment" @click="editDepartment1(addInput.ParentID)">编辑</el-button>
          <el-button type="primary" class="addSubdivision" @click="addSubdivisionOpen">+ &nbsp;子部门</el-button>
        <!-- <span class="inheritanceRules">默认限制向上继承</span>
        <el-switch v-model="switchs" active-color="#13ce66" inactive-color="#ff4949" class="switch"></el-switch> -->
      </div>
      <div class="small1"></div>
      <span class="lowerTitle">下级部门</span>
      <el-table :data="tableData" border class="divisionTable" max-height="220"  :header-cell-style="getRowClass">
        <el-table-column prop="label" label="部门" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="500%">
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
      </div>
      <el-table :data="tableList" border class="tableList" max-height="220" :header-cell-style="getRowClass">
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column prop="name" label="姓名" align="center" width="100%"></el-table-column>
        <el-table-column prop="position" label="职位" align="center" width="130%"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" ></el-table-column>
        <el-table-column prop="sex" label="性别" align="center" width="80%"></el-table-column>
        <el-table-column label="操作" align="center" width="320%">
          <template slot-scope="scope">
            <el-button class="enter" plain size="small">权限</el-button>
            <el-button type="primary" size="small" @click="editPosition(scope.$index, scope.row)">职位</el-button>
            <el-button type="danger" size="small" @click="del(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑部门弹框 -->
    <el-dialog class="updataPopup" title="编辑部门" :visible.sync="editDepartment" custom-class="city_list" width="550px">
      <div class="boom">
        <el-form style="padding-left:90px" :model="updata" :rules="rules">
          <el-form-item label="部门名称" :label-width="updataLabelWidth" prop="orgName">
            <el-input v-model="updata.orgName" auto-complete="off" class="updataLabelWidth-input"></el-input>
          </el-form-item>
          <el-form-item label="父级部门" :label-width="Width" prop="value" class="updataLabelWidth-input">
            <el-input v-model="updata.value" auto-complete="off" :disabled="true" class="add-input"></el-input>
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
            <el-input v-model="updata.departmentCode" auto-complete="off" class="updataLabelWidth-input"></el-input>
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
        <el-button class="btn_foot" type="danger" @click="deleted = false">删除</el-button>
      </div>
    </el-dialog>
    <!-- 添加子部门弹框 -->
    <el-dialog class="Popup" :visible.sync="addSubdivision" title="添加子部门" custom-class="city_list" width="570px">
      <el-form style="padding-left:95px" :model="addInput" :rules="rules" status-icon ref="addInput">
        <el-form-item label="部门名称" :label-width="Width" prop="name" class="add_title">
          <el-input v-model="addInput.name" auto-complete="off" class="add-input" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" :label-width="Width" prop="topDepartment" class="add_title">
          <el-input v-model="addInput.topDepartment" auto-complete="off" :disabled="true" class="add-input"></el-input>
        </el-form-item>
        <el-form-item label="虚拟部门" prop="radio" class="add_radio">
          <el-radio-group class="virtualDepartment" v-model="addInput.radio">
            <el-radio label="是" value="1"></el-radio>
            <el-radio label="否" value="2"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="末级部门" prop="lastStage" class="add_radio">
          <el-radio-group class="virtualDepartment" v-model="addInput.lastStage">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="2" value="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门编码" :label-width="Width" prop="departmentCode" class="add_title">
          <el-input v-model="addInput.departmentCode" auto-complete="off" class="updataLabelWidth-input"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="Width" prop="sort" class="add_title">
          <el-input v-model="addInput.sort" auto-complete="off" class="add-department"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="Width" prop="phone" class="add_title">
          <el-input v-model="addInput.phone" auto-complete="off" class="add-department"></el-input>
        </el-form-item>
        <el-form-item label="传真" :label-width="Width" prop="fax" class="add_title">
          <el-input v-model="addInput.fax" auto-complete="off" class="add-department"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="Width" prop="note" class="add_title">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="addInput.note" class="add-department"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="oppp" @click="addSubdivision1('addInput')">取 消</el-button>
        <el-button class="oppp" type="primary" @click="appendSave('addInput')">保存</el-button>
      </div>
    </el-dialog>
    <!-- 添加成员弹框 -->
    <el-dialog title="添加成员"  class="popup" :visible.sync="addPersonnel" custom-class="city_list" width="1000px" @close="addPersonnel2">
        <el-form class="booms" :model="updata1">
            <el-form-item>
              <el-input v-model="person.search" auto-complete="off" class="searchInput" placeholder="输入名称检索"></el-input>
              <el-button type="primary" class="searchButton" @click="addPersonnel1">搜索</el-button>
            </el-form-item>
        </el-form> 
        <el-table ref="table" :data="members" border class="members" @selection-change="chooseDate" :header-cell-style="getRowClass">
          <el-table-column type="selection" width="35%" align="center"></el-table-column>
          <el-table-column prop="id" label="ID" align="center"  width="60%"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"  width="120%"></el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"  width="180%"></el-table-column>
          <el-table-column prop="email" label="邮箱" align="center"  width="220%"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center"  width="90%"></el-table-column>
          <el-table-column prop="state" label="状态" align="center"  width="120%"></el-table-column>
        </el-table>
        <div class="pagination">
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
        </div>
        <div slot="footer" class="btn">
          <el-button class="oppp" @click="addPersonnel2">取 消</el-button>
          <el-button class="oppp" type="primary" @click="userInsert">添加</el-button>
        </div>
    </el-dialog>
    <!-- 设置职位弹框 -->
    <el-dialog class="Popup" title="设置职位" :visible.sync="position" custom-class="city_list" width="550px">
      <el-form style="padding-left:60px" :model="setPosition">
        <el-form-item label="姓名" :label-width="setLabelWidth" class="setinput">
          <el-input v-model="setPosition.name" auto-complete="off" :disabled="true" class="positionInput"></el-input>
        </el-form-item>
        <span style="margin-left:30px">职位</span>
        <el-select v-model="values" placeholder="请选择" class="setSelect">
          <el-option :key="item.value" :label="item" :value="index" v-for="(item,index) of option"></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="oppp" @click="position = false">取 消</el-button>
        <el-button class="oppp" type="primary" @click="setSave = false">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取组织的ID
      org:'',
      data: [],
      data1: [],
      data2: [],
      node: "",
      removes: "",
      option: "",
      switchs: true,
      // 子部门临时数据
      tableData: [],
      // 编辑部门
      editDepartment: false,
      updata: {
        radio: "1",
        lastStage: "2",
        value: ''
      },
      updata1: {},
      updataLabelWidth: "90px",
      // 级联选择器
      options: [],
      value: "",
      options1: [],
      value1: "",
      options2: [],
      value2: "",
      options3: [],
      value3: "",
      arr: [],
      arr1: [],
      arr2: [],
      bumen2: false,
      bumen1: false,
      // 添加子部门
      addSubdivision: false,
      addInput: {
        name: "",
        topDepartment: "",
        radio: "",
        lastStage: "2",
        departmentCode: "",
        sort: "",
        phone: "",
        fax: "",
        note: "",
        ParentID: ""
      },
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        radio: [{ required: true, message: "请选择虚拟部门", trigger: "blur" }],
        lastStage: [{ required: true, trigger: "blur" }],
        departmentCode: [{ required: true, message: "请输入部门编码", trigger: "blur" },
                        { pattern: /^[0-9]{0,30}$/, message: '请输入数字' }],
        sort: [{ required: true, message: "请输入排序方式", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        fax: [{ required: true, message: "请输入传真号", trigger: "blur" }],
        orgName:[{required: true, message: "请输入部门名称", trigger: "blur"}]
      },
      Width: "90px",
      // 添加成员
      addPersonnel: false,
      person: {
        search: ""
      },
      LabelWidth: "87%",
      members: [],
      oppo: [],
      //成员列表临时数据
      tableList: [],
      members1: [],
      //每页的数据条数
      pageSize: 10,
      //默认开始页面
      currentPage: 1,
      total: 1,
      // 设置成员
      position: false,
      setPosition: {},
      setLabelWidth: "90px",
      option: [],
      values: "",
      kk: [],
      show: true,
      isexpand: false,
      treeKey: [],
      Parents: [],
      key: -1,
      flag: true, // 调用数组第一个
      props: {
        value: "value",
        children: "cities"
      },
      props1: {
        label: "label",
        isLeaf: "leaf"
      },
      keyID: [],
      deleteNum: [],
      dbSave: ''
    };
  },
  created(){
    this.optionList();
  },
  methods: {
    //职位
    editPosition(index, row){
      this.position = true;
      this.setPosition = row;
    },
    addSubdivision1(a) {
      this.addSubdivision = false;
      this.$refs[a].resetFields();
    },
    // 添加部门
    appendSave(addInput) {
      this.$refs[addInput].validate((valid) => {
        if(valid){
          var _this = this;
          this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptinsert", {
            object: {
              Id: 0,
              OrgName: this.addInput.name,
              IsDeleted: 0,
              Code: "string",
              ParentID: this.addInput.ParentID,
              Physical: 0,
              OrgCode: this.addInput.departmentCode,
              Rank: this.addInput.sort,
              OfficeTel: this.addInput.phone,
              OfficeFax: this.addInput.fax,
              Mark: this.addInput.note,
              IsLeaf: this.addInput.lastStage
            }
          },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
          }).then(function(response) {
            if(response.data.isSuccess == false){
              _this.$message.error("添加失败,部门名称或部门编码已存在");
            } else {
              _this.addSubdivision = false;
              let num = Object();
              num.id = _this.addInput.ParentID;
              num.isLeaf = _this.addInput.lastStage;
              num.key = 0;
              num.label = _this.addInput.topDepartment;
              _this.treeClick(num);
              _this.addInput.departmentNames = "";
              _this.$refs["addInput"].resetFields();
              _this.$message.success("添加成功");
              _this.getUser(
                _this.node.key,
                _this.node.label,
                _this.node.id,
                _this.node.isLeaf,
                _this.removes
              );
            }
          }).catch(function(error) {
            console.log(error);
          });
        }
      })
    },
    chooseDate(a) {
      this.dataNum = a;
      console.log(this.dataNum);
    },
    userInsert() {
      for (let i = 0; i < this.dataNum.length; i++) {
        for (let j = 0; j < this.tableList.length; j++) {
          if (this.tableList[j].id.indexOf(this.dataNum[i].id) !== -1) {
            this.dataNum.splice(this.dataNum[i], i + 1);
          }
        }
      }
      if (this.dataNum.length < 1) {
        this.$message.error("没有数据被添加");
      } else {
        for (let k = 0; k < this.dataNum.length; k++) {
          this.tableList.push({
            id: this.dataNum[k].id,
            name: this.dataNum[k].name,
            position: "",
            phone: this.dataNum[k].phone,
            sex: this.dataNum[k].sex
          });
        }
        this.$message.success("添加成功");
        this.addPersonnel = false;
        this.person.search='';
        this.currentPage = 1;
        this.dataNum = [];
      }
    },
    //子部门删除
    remove(index, rows) {
      let _this = this;
      this.$confirm("是否删除该部门?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.remove1(this.tableData[index].id, index);
        this.$refs.oppo.remove(rows);
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    // 删除当前部门的子级部门
    remove1(id, index) {
      var _this = this;
      this.deleteNum.push(id);
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptdelete", {
        id: id
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
      //子部门列表
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptlist",{
        object: {
          parentID: id
        }
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(res => {
        if (res.data.objects !== "") {
          for (var i = 0; i < res.data.objects.length; i++) {
            this.remove1(res.data.objects[i].id);
          }
        }
      }).catch(err => {});
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7'
      } else {
        return ''
      }
    },
    del(index, rows){
      let _this = this;
      this.$confirm("是否删除此人员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        

      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    //添加成员
    addPersonnel1(){
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/userpage", {
        object: {
          name:this.person.search,
          isDeleted: 0
        },
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        isGetAll: true,
        id: 0
      }).then(response =>{
        this.members = [];
        this.total = response.data.total;
        for (let i = 0; i < response.data.objects.length; i++) {
          if(response.data.objects[i].sex == 1){
            response.data.objects[i].sex = '男'
          }else{
            response.data.objects[i].sex = '女'
          }
          if(response.data.objects[i].userState == 0){
            response.data.objects[i].userState = '未选择'
          }else if(response.data.objects[i].userState == 1){

            response.data.objects[i].userState = '等待审核'
          }else if(response.data.objects[i].userState == 2){
            response.data.objects[i].userState = '正常'
          }else{
            response.data.objects[i].userState = '停用'
          }
          this.members.push({
            id: response.data.objects[i].id,
            name: response.data.objects[i].name,
            phone: response.data.objects[i].mobile,
            email: response.data.objects[i].email,
            sex: response.data.objects[i].sex,
            state: response.data.objects[i].userState,
            key: i
          });
          this.addPersonnel = true;
        }        
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    addPersonnel2() {
      this.addPersonnel = false;
      this.person.search='';
      this.currentPage = 1;
      this.dataNum = [];
    },
    // 单击tree节点
    treeClick(a, b, c) {
      this.data = [];
      this.org = a.id;
      this.tableData = [];
      this.tableList = [];
      this.addInput.ParentID = a.id;
      this.addInput.topDepartment = a.label;
      this.dbSave = a;
      var _this = this;
      //下级部门
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptlist",{
        object: {
          ParentID: a.id
        }
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(response => {
        for (let i = 0; i < response.data.objects.length; i++) {
          if (response.data.objects[i].isDeleted !== 1) {
            _this.tableData.push({
              label: response.data.objects[i].orgName,
              id: response.data.objects[i].id,
              key: i,
              value: response.data.objects[i].id
            });
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
      //部门人员
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/userlistwithorg", {
        id:a.id
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(res => {
        for(let i = 0;i<res.data.objects.length;i++){
          if(res.data.objects[i].sex == 1){
            res.data.objects[i].sex = '男'
          }else{
            res.data.objects[i].sex = '女'
          }
          _this.tableList.push({
            id:res.data.objects[i].id,
            name:res.data.objects[i].name,
            phone:res.data.objects[i].mobile,
            sex:res.data.objects[i].sex
          })
        }
      }).catch(function(error){
        console.log(error)
      })
    },
    //树形控件父级数据加载
    loadNode(node, resolve) {
      this.node = node.data
      this.removes = resolve
      this.data = [];
      let _this = this;
      let obj=[{
          code:null,
          createTime:"2018-08-29T15:43:50",
          createUser:null,
          id:204,
          isDeleted:0,
          isDeletedCN:"未删除",
          isLeaf:2,
          isLeafCN:"不是末级",
          loadLeader:false,
          mark:"0",
          officeFax:"0",
          officeTel:"0",
          orgCode:10000000,
          orgName:"嘉麒集团",
          organizationLeader:[],
          parentID:-1,
          physical:1,
          rank:0
        }];
        for (let i = 0; i < obj.length; i++) {
          if (node.level === 0) {
            _this.options.push({
              label: obj[i].orgName,
              value: obj[i].id + "-" + obj[i].orgName
            });
            resolve([
              {
                label: obj[i].orgName,
                key: i,
                id: obj[i].id,
                isLeaf: obj[i].isLeaf
              }
            ]);
          }
        }
        let num = Array();
        num.push({
          id: obj[0].id,
          isLeaf: obj[0].isLeaf,
          key: 0,
          label: obj[0].orgName
        });
        if (this.flag) {
          _this.treeClick(num[0]);
          this.flag = false;
        }
        this.treeKey.push(204);

      if (node.level >= 1) {
        this.getUser(
          node.data.key,
          node.data.label,
          node.data.id,
          node.data.isLeaf,
          resolve
        );
      }
    },
    getUser(key, label, id, isLeaf, resolve) {
      this.data1 = [];
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptlist",{
        object: {
          ParentID: id
        }
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(response => {
        for (let i = 0; i < response.data.objects.length; i++) {
          if (response.data.objects[i].isDeleted !== 1) {
            if (response.data.objects[i].isLeaf == 1) {
              _this.data1.push({
                label: response.data.objects[i].orgName,
                id: response.data.objects[i].id,
                key: i,
                cities: [],
                isLeaf: response.data.objects[i].isLeaf,
                leaf: true
              });
            } else if (response.data.objects[i].isLeaf == 2) {
              _this.data1.push({
                label: response.data.objects[i].orgName,
                id: response.data.objects[i].id,
                key: i,
                cities: [],
                isLeaf: response.data.objects[i].isLeaf,
                leaf: false
              });
            }
          }
        }
        setTimeout(() => {
          let data = _this.data1;
          resolve(data);
        }, 200);
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    addSubdivisionOpen() {
      if (this.Parents.isLeaf == 1) {
        this.$message.warning("此部门是末级部门，不能添加");
      } else {
        this.addSubdivision = true;
      }
    },
    // 双击展开
    treeDblclick(a) {
      this.treeKey = [];
      if (this.dbSave.isLeaf == 2 || this.dbSave.isLeaf == 0) {
        this.treeKey.push(this.dbSave.id);
      }
      this.dbSave = ''
    },
    // 编辑部门
    editDepartment1(id) {
      this.updata = {
        radio: "1",
        lastStage: "2"
      }
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptget",{
        id: id
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(res => {
        this.updata.id = id;
        this.updata.orgName = res.data.object.orgName;
        this.updata.departmentCode = res.data.object.orgCode;
        this.updata.sort = res.data.object.rank;
        this.updata.phone = res.data.object.officeTel;
        this.updata.fax = res.data.object.officeFax;
        this.updata.note = res.data.object.mark;
        this.updata.lastStage = String(res.data.object.isLeaf);
        this.updata.parentID = res.data.object.parentID;
        this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptget",{
          id:res.data.object.parentID
        },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(res => {
        if(this.updata.parentID == -1){
          this.updata.value = '无'
        }else{
            this.updata.value = res.data.object.orgName
        }
        this.editDepartment = true;
      }).catch(err => {})
        console.log(err)
      }).catch(err => {});
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.addPersonnel1();
    },
    handleSizeChange(val){
        this.pageSize = val;
        this.currentPage = 1;
        this.addPersonnel1();
    },
    renderContent(h, { node, data, store }) {
      if (data.isLeaf == 1) {
        return (
          <span>
            <img style="position:relative;bottom: -3px" width="20px" src="../static/organList-image/257785656210656304.png"/>
            <span>{node.label}</span>
          </span>
        );
      } else if (data.isLeaf == 2 || data.isLeaf == 0) {
        return (
          <span>
            <img style="position:relative;bottom: -3px" width="20px" src="../static/organList-image/ewqdewq.png"/>
            <span>{node.label}</span>
          </span>
        );
      }
    },
    // 编辑部门弹窗
    updataEditSave(updata) {
      let _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/deptsave", {
        object: {
          id: this.updata.id,
          orgName: this.updata.orgName,
          parentID: this.updata.parentID,
          orgCode: this.updata.departmentCode,
          rank: this.updata.sort,
          officeTel: this.updata.phone,
          officeFax: this.updata.fax,
          mark: this.updata.note,
          isLeaf: this.updata.lastStage,
          physical: this.updata.radio,
        }
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function(response) {
        _this.$message.success("修改成功！");
        _this.getUser(
          _this.node.key,
          _this.node.label,
          _this.node.id,
          _this.node.isLeaf,
          _this.removes
        );
        _this.addInput.topDepartment = updata.orgName;
        _this.editDepartment = false;
      }).catch(function(error) {
        console.log(error);
      });
    },
    //职位列表
    optionList(){
      this.option = [];
      var _this = this;
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/positionlist", {
        object:{
          isDeleted: 0
        }
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function(res){
        for(let i =0;i<res.data.objects.length; i++){
          _this.option.push(
            res.data.objects[i].name
          );
        }
      }).catch(function(err){
        console.log(err)
      })
    }
  }
};
</script>

<style scoped>
.organizationInput { right: 17%; }
.tree { float: left; user-select: none; }
.hh { float: left; margin-left: 30px; margin-top: 20px; width: 300px; height: 94%; overflow: auto; }
.editDepartment { float: left; width: 100px; height: 40px; margin-left: 30px; margin-top:30px; }
.addSubdivision { float: left; width: 100px; height: 40px; margin-left: 30px; margin-top:30px; }
.inheritanceRules { position: absolute; right: 13%; top: 43%; color: #999999; }
.switch { position: absolute; margin-left: 40%; top: 43%; }
.small1 { float:left; margin-left:30px; margin-top:25px; width: 4px; height: 22px; background: inherit; background-color: #3095FA; border: none; border-radius: 0px; box-shadow: none; line-height: 0; }
.lowerTitle { float:left; margin-left:10px; margin-top:27px; font-size: 20px; }
.divisionTable { width:92%; margin-top:60px; margin-left:30px; margin-right:250px; }
.small2 { float:left; margin-left:30px; margin-top:20px; width: 4px; height: 22px; background: inherit; background-color: #3095FA; border: none; border-radius: 0px; box-shadow: none; line-height: 0; }
.personnelTitle { float:left; margin-left:15px; margin-top:22px; font-size: 20px; }
.addPersonnel { float: left; width: 100px; height: 40px; margin-left: 30px; }
.batchDelete { float: left; width: 100px; height: 40px; margin-left: 30px; }
.btn-boom { height: 50px; margin-top:65px; }
.tableList { width: 92%; margin-left:30px; margin-right:90px; margin-top:20px; }
.cascader { position: relative; left: 15px; width: 269px; }
.cascaderTitle { position: relative; left: 6px; }
.boom { position: relative; right: 20px; margin-top: -10px; }
.searchInput {float: left;width: 200px}
.searchButton {float: left;margin-left: 20px}
.booms {margin:0 0 30px 65px}
.members {margin: 30px 0 30px 65px;width: 826px; }
.btn {margin-top: -20px;text-align :center; }
.setinput { position: relative; right: 20px; }
.setSelect { margin-bottom: 200px;margin-left:8px; width: 280px; }
.Popup { margin: 0 auto; }
.addTitle { position: absolute; top: 2%; left: 3%; font-size: 1.5em; }
.enter { margin-left: 5%; }
.right { position:absolute; height:82%; width:45%; margin-left: 415px; border: 2px solid #E6E6E6; }
.left { position:absolute; width: 400px; height:82%; border: 2px solid #E6E6E6; }
.right-son { position: relative; left: 260px; bottom: 100%; width: 75.7%; height: 100%; }
.left-son { position: relative; width: 260px; height: 100%; border: 1px solid #CCCCCC; }
.virtualDepartment { position: relative; float: left; left: 20px; margin-top: 13px; }
.add-input { width: 250px; margin-right: 130px; }
.add-department {width: 250px; }
.button-footer { margin-right: 157px; margin-top: -40px; }
.small3 { float: left; margin-right: 7px; width: 5px; height: 22px; background: inherit; background-color: #F38F00; border: none; border-radius: 0px; box-shadow: none; line-height: 0; }
.son-title { position: absolute; float: right; width: 106.4%; height: 8%; left: 0.2%; background-color: #F6F6F6; }
.right-top { position:relative; width: 100%; height: 50px; background-color: #F6F6F6; }
.rightTitle { float:left; margin-left:30px; margin-top:15px; font-size: 20px; }
.right-btn { height: 80px; }
.pagination {text-align: center;}
.yy { position: relative; top: -5px; }
.eidt-virtual { margin-top: 25px; margin-left: 12px; }
.updata-virtual { position: relative; bottom: 5px; margin-left: 12px; }
.operation { overflow: hidden; text-align :center; }
.operation .btn_foot { margin: 20px; width:100px; }
.updataPopup { margin: 0 auto; }
.form-la { margin-left: 20px; }
.form-lala{ margin-left: 25px; }
.form-xi { margin-right: 108px; }
.el-dialog__wrapper>>>.el-dialog { width: 500px; }
.popup>>>.el-dialog { width: 1100px; }
.dialog-footer{ text-align :center; }
.oppp{ margin: 20px; width:100px; }
.add_title{ margin-left:-10px; }
.add_radio{ margin-left:4px; }
.positionInput{ width:250px;}
.updataLabelWidth-input{ width:250px;}
.add_radio>>>.el-form-item__error{ left:78px; }
.hh>>>.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{ background-color: #F6F7D7!important; }
</style>
