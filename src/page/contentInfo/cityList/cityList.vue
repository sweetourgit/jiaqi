<template>
  <div class="cityList">
      <div class="cascade">
       <el-tree :props="props1" :load="loadNode1" class="treeDemo" lazy @node-click="treeClick" :expand-on-click-node="false" node-key="id" ref="refTree"></el-tree>
      </div>
      <div class="search">
        <span class="keyword">输入关键字:</span>
        <el-autocomplete class="inputBox" clearable placeholder="请输入关键字" :fetch-suggestions="querySearch" @select="handleSelect" suffix-icon="el-icon-search" v-model="input" :trigger-on-focus="false"></el-autocomplete>
        <el-button class="searchButton" type="primary" icon="el-icon-search" @click="searchClick"></el-button>
      </div>
      <!-- 区域列表 -->
      <template v-if="geography == 1">
      <template v-if="data.isLeaf == 2">
        <el-button class="add_country" type="primary" @click="addState = true">添加</el-button>
      </template>
        <el-table class="table_list" :data="tableData" border :header-row-style="tableHead" :cell-style="tableHeight" :header-cell-style="getRowClass" style="width: 70%;">
          <el-table-column :key="Math.random()" prop="id" label="ID" align="center" width="60%"></el-table-column>
          <el-table-column :key="Math.random()" label="名称" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.isLeaf == 2">
                <el-tooltip placement="right" effect="light">
                  <div slot="content">点击查看<br/>下级分类</div>
                  <el-button @click="subordinate(scope.row)" type="text">{{ scope.row.country }}</el-button>
                </el-tooltip>
              </template>
              <template v-else-if="scope.row.isLeaf == 1">
                <span type="text">{{ scope.row.country }}</span>                
              </template>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" prop="continent" label="所属大洲" align="center" width="80%"></el-table-column>
          <el-table-column :key="Math.random()" prop="englishName" label="英文名" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="pinyin" label="中文全拼" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="initials" label="首字母" align="center" width="70%"></el-table-column>
          <el-table-column :key="Math.random()" prop="initial" label="首拼" align="center"></el-table-column>
          <el-table-column :key="Math.random()" prop="code" label="代码" align="center" width="80%"></el-table-column>
          <el-table-column :key="Math.random()" label="操作" align="center" width="230%">
          <template slot-scope="scope">
            <div class="table_button_left">
              <el-button class="table_button" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button class="table_button" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <template v-if="scope.row.isLeaf == 2">
              <el-button class="table_button1" type="success" @click="addStates(scope.$index, scope.row)">添加</el-button>
              </template>
            </div>
          </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <el-pagination class="page" background @size-change="pagesizes" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

      </template>
      <!-- 区域列表END -->

      <!-- 添加区域弹框 -->
      <el-dialog class="add_country_popup" custom-class="city_list" title="添加国家" :visible.sync="addState" width="600px">
        <el-form :model="countryPopup" status-icon :rules="countryRules" ref="countryPopup">
          <el-form-item label="所属地区:" :label-width="formLabelWidth">
            <span class="country_span">{{countryPopup.select}}</span>
          </el-form-item>
          <el-form-item label="地区名称:" :label-width="formLabelWidth" prop="countryName">
            <el-input class="country_input" v-model="countryPopup.countryName" clearable></el-input>
          </el-form-item>
          <el-form-item label="末级区域:" :label-width="formLabelWidth">
            <el-radio-group class="virtualDepartment" v-model="countryPopup.isLeaf">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="countryPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="countryPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="countryPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="首拼:" :label-width="formLabelWidth">
            <el-input class="country_input" v-model="countryPopup.initial" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="countryPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="addState = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="countryForm('countryPopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加区域END -->

      <!-- 编辑区域弹框 -->
      <el-dialog class="edit_country_popup" custom-class="city_list" title="国家编辑" :visible.sync="editState" width="600px">
        <el-form :model="editCountryPopup" status-icon :rules="editCountryRules" ref="editCountryPopup">
          <el-form-item label="ID:" :label-width="formLabelWidth" prop="id">
            <span class="country_span">{{editCountryPopup.id}}</span>
          </el-form-item>
          <el-form-item label="所属地区:" :label-width="formLabelWidth">
            <span class="country_span">{{editCountryPopup.select}}</span>
          </el-form-item>
          <el-form-item label="地区名称:" :label-width="formLabelWidth" prop="countryName">
            <el-input class="country_input" v-model="editCountryPopup.countryName" clearable></el-input>
          </el-form-item>
          <el-form-item label="末级区域:" :label-width="formLabelWidth">
            <el-radio-group class="virtualDepartment" v-model="editCountryPopup.isLeaf">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="英文名:" :label-width="formLabelWidth" prop="englishName">
            <el-input class="country_input" v-model="editCountryPopup.englishName" clearable></el-input>
          </el-form-item>
          <el-form-item label="中文全拼:" :label-width="formLabelWidth" prop="pinyin">
            <el-input class="country_input" v-model="editCountryPopup.pinyin" clearable></el-input>
          </el-form-item>
          <el-form-item label="首字母:" :label-width="formLabelWidth" prop="initials">
            <el-input class="country_input" v-model="editCountryPopup.initials" clearable></el-input>
          </el-form-item>
          <el-form-item label="首拼:" :label-width="formLabelWidth">
            <el-input class="country_input" v-model="editCountryPopup.initial" clearable></el-input>
          </el-form-item>
          <el-form-item label="代码:" :label-width="formLabelWidth" prop="code">
            <el-input class="country_input" v-model="editCountryPopup.code" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="Determine" @click="editState = false">取 消</el-button>
          <el-button class="Determine" type="primary" @click="countryForm('editCountryPopup')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑区域END -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchInput: '', // 搜索
        list:[],
        lists: [], //子级
        vague: [], // 模糊搜索数组
        props1: {
          label: 'name',
          isLeaf: 'leaf'
        },
        data: '', // 存单击数据
        total: 1, // 分页总条数
        theContinent: '', // 所属地区id
        node: '', // 获取tree子级数据
        resolve: '', // 获取tree子级方法
        level: '', // 层级数据
        // 数据表格
        tableData: [],
        // 添加区域数据
        countryPopup: {
          countryName: '',
          englishName: '',
          pinyin: '',
          initials: '',
          initial: '',
          code: '',
          select: '',
          parentID: '',
          isLeaf: '2',
        },
        // 编辑区域数据
        editCountryPopup: {
          id: '',
          countryName: '',
          englishName: '',
          pinyin: '',
          initials: '',
          initial: '',
          code: '',
          select: '',
          isLeaf: '',
          parentID: ''
        },
        // 添加区域正则判断
        countryRules: {
          countryName: [
            { required: true, message: '请填写国家名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2-10位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-zA-Z]+$/, message: '请输入字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        // 编辑区域正则判断
        editCountryRules: {
          countryName: [
            { required: true, message: '请填写国家名称', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2-10位汉字'}
          ],
          pinyin: [
            {pattern: /^[a-zA-Z]+$/, message: '请输入字母,不能有空格'}
          ],
          initials: [
            {pattern: /^[A-Z]+$/, message: '请输入大写字母,不能有空格'}
          ]
        },
        input: '',// 搜索框
        tableHead: {height: '60px', color: '#555555'}, // 表格头部高度
        tableHeight: {padding: '0', height: '34px'}, // 各表格高度
        pagesize:10, // 每页的数据条数
        currentPage:1, // 默认开始页面
        geography: '', // 判断国家 省份 城市
        addState: false, // 添加国家弹框
        formLabelWidth: '160px', // 弹窗item宽度
        editState: false, // 编辑国家弹框
        clickId: ''
      }
    },
    methods: {
      loadNode1(node, resolve) {
        this.node = node.data
        this.resolve = resolve
        this.level = node.level
        /*添加第一级*/
        if (node.level === 0) {
          this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist",{
              "object": {
                "parentID": -1,
              }
            },{
              headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            }).then(obj => {
              for (let i = 0; i < obj.data.objects.length; i++) {
                this.list.push({
                  name:obj.data.objects[i].areaName,
                  key: i,
                  id: obj.data.objects[i].id,
                  isLeaf: obj.data.objects[i].isLeaf, // 是否是末级
                  Hierarchy: 0 // 层级
                })
              }
              resolve(this.list);
            }).catch(obj => {
              console.log(obj)
            })
        }
        if (node.level >= 1) {
          this.getSon(
            node.data.key,
            node.data.label,
            node.data.id,
            node.data.isLeaf,
            resolve,
            node.level
          );
        }
      },
      /*获取子集的方法*/
      getSon(key, label, id, isLeaf, resolve, level){
        this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist",
          {
            "object": {
              "parentID": id,
            }
          },
          {
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        ).then(res => {
          this.lists = []
          if (res.data.isSuccess == true) {
            for (let i = 0; i < res.data.objects.length; i++) {
              if (res.data.objects[i].isDeleted == 0) {
                if (res.data.objects[i].isLeaf == 2) {
                  this.lists.push({
                    name:res.data.objects[i].areaName,
                    key: i,
                    id: res.data.objects[i].id,
                    isLeaf: res.data.objects[i].isLeaf,
                    leaf: false,
                    Hierarchy: level
                  })
                } else {
                  this.lists.push({
                    name:res.data.objects[i].areaName,
                    key: i,
                    id: res.data.objects[i].id,
                    isLeaf: res.data.objects[i].isLeaf,
                    leaf: true,
                    Hierarchy: level
                  })
                }
              }
            }
          }
          setTimeout(() => {
            resolve(this.lists);
          }, 200);
        }).catch(error => {
          console.log(error);
        });
      },
      // 单击tree节点
      treeClick(data,node){
        // this.tableData = [];
        this.geography = 1
        this.data = data
        this.countryPopup.select = data.name
        this.countryPopup.parentID = data.id
        this.editCountryPopup.parentID = data.id
        if (data.Hierarchy == 0) {
          // 所属地区
          this.theContinent = data.id
        }
        if (data.isLeaf == 1) {
        this.tableData = [];
          this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforget',{
            id: data.id
          },{
          headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }).then(res => {
            this.tableData.push({
              id: res.data.object.id,
              country: res.data.object.areaName,
              continent: res.data.object.earth,
              englishName: res.data.object.englishName,
              pinyin: res.data.object.chineseFull,
              initials: res.data.object.firstChar,
              code: res.data.object.areaCode,
              value: res.data.object.areaName,
              isLeaf: res.data.object.isLeaf,
              initial: res.data.object.initial,
              parentID: res.data.object.parentID
            })
            this.geography = 1
            this.currentPage = 1
            this.total = 1
          }).catch(err => {
            console.log(err)
          })
        } else {
          if (this.clickId != data.id) {
              this.currentPage = 1
            }
          this.clickId = data.id
          this.$http.post(this.GLOBAL.serverSrc +'/universal/area/api/areainforpage',{
            "object": {
                "parentID": data.id,
              },
            pageIndex: this.currentPage,
            pageSize:this.pagesize,
          },{
            headers:{
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
          }).then(res => {
            if (res.data.isSuccess == false) {
              this.tableData = [];
              if (this.currentPage != 1) {
                this.currentPage = 1
                this.treeClick(data)
              }
            } else {
              this.tableData = res.data.objects
              this.total = res.data.total
              this.geography = 1
              this.tableData.forEach((item, i) => {
                  item.id = res.data.objects[i].id,
                  item.country = res.data.objects[i].areaName,
                  item.continent = res.data.objects[i].earth,
                  item.englishName = res.data.objects[i].englishName,
                  item.pinyin = res.data.objects[i].chineseFull,
                  item.initials = res.data.objects[i].firstChar,
                  item.code = res.data.objects[i].areaCode,
                  item.value = res.data.objects[i].areaName,
                  item.isLeaf = res.data.objects[i].isLeaf,
                  item.initial = res.data.objects[i].initial,
                  item.parentID = res.data.objects[i].parentID
              })
              // for (let i = 0; i < res.data.objects.length; i++) {
              //   this.tableData.push({
              //     id: res.data.objects[i].id,
              //     country: res.data.objects[i].areaName,
              //     continent: res.data.objects[i].earth,
              //     englishName: res.data.objects[i].englishName,
              //     pinyin: res.data.objects[i].chineseFull,
              //     initials: res.data.objects[i].firstChar,
              //     code: res.data.objects[i].areaCode,
              //     value: res.data.objects[i].areaName,
              //     isLeaf: res.data.objects[i].isLeaf,
              //     initial: res.data.objects[i].initial,
              //     parentID: res.data.objects[i].parentID
              //   })
              // }
            }
          }).catch(err => {
            console.log(err)
          })
        }
      },
      // 搜索方法
      querySearch(queryString, cb) {
        this.vague = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString
          }
        },{
          headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }).then(res => {
            for (let i = 0; i < res.data.objects.length; i++) {
              this.vague.push({
                "id" : res.data.objects[i].id,
                "value" : res.data.objects[i].areaName
              })
            }
            var results = queryString ? this.vague.filter(this.createFilter(queryString)) : [];
            cb(results)
          }).catch(err => {
            console.log(err);
          })
      },
      // 搜索方法
      createFilter(queryString){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      handleSelect(item) {
        this.searchInput = item;
      },
      searchClick() {
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforget', {
          id: this.searchInput.id
        }).then(res => {
          this.tableData = [];
          this.tableData.push({
            id: res.data.object.id,
            country: res.data.object.areaName,
            continent: res.data.object.earth,
            englishName: res.data.object.englishName,
            pinyin: res.data.object.chineseFull,
            initials: res.data.object.firstChar,
            code: res.data.object.areaCode,
            value: res.data.object.areaName,
            isLeaf: res.data.object.isLeaf,
            initial: res.data.object.initial,
          })
          this.geography = 1
          this.currentPage = 1
          this.total = 1
        })
      },
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
          if (rowIndex == 0) {
            return 'background:#F7F7F7'
          } else {
            return ''
          }
      },
      // 添加 编辑 地区保存成功
      countryForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (formName == 'countryPopup') {
              this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforinsert', {
                object: {
                  areaName: this.countryPopup.countryName,
                  englishName: this.countryPopup.englishName,
                  chineseFull: this.countryPopup.pinyin,
                  firstChar: this.countryPopup.initials,
                  areaCode: this.countryPopup.code,
                  parentID: this.countryPopup.parentID,
                  isLeaf: Number(this.countryPopup.isLeaf),
                  initial: this.countryPopup.initial,
                  createTime: "2018-09-11T07:32:14.737Z",
                  earth: '-1'
                }
              },{
                headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
                }).then(res => {
                  if (res.data.isSuccess == false) {
                    this.$message.error('该名称以存在');
                  } else {
                    this.treeClick(this.data);
                    this.addState = false;
                    this.$message.success('添加成功！');


                    // let arr = {}
                    // arr.id = -2;
                    // arr.Hierarchy = this.data.Hierarchy + 1;
                    // arr.isLeaf = Number(this.countryPopup.isLeaf);
                    // arr.key = this.tableData.length;
                    // if (arr.isLeaf == 1) {
                    //   arr.leaf = true
                    // } else {
                    //   arr.leaf = false
                    // }
                    // arr.name = this.countryPopup.countryName;
                    // this.$refs.refTree.append(arr, this.data)



                    this.getSon(
                      this.node.key,
                      this.node.label,
                      this.node.id,
                      this.node.isLeaf,
                      this.resolve,
                      this.level
                    );
                    this.$refs['countryPopup'].resetFields();
                    this.countryPopup.initial = '';
                  }
                }).catch(err => {
                  console.log(err)
                })
            } else if (formName == 'editCountryPopup') {
              this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainforsave', {
                object: {
                  id: this.editCountryPopup.id,
                  areaName: this.editCountryPopup.countryName,
                  englishName: this.editCountryPopup.englishName,
                  chineseFull: this.editCountryPopup.pinyin,
                  firstChar: this.editCountryPopup.initials,
                  areaCode: this.editCountryPopup.code,
                  isLeaf: Number(this.editCountryPopup.isLeaf),
                  initial: this.editCountryPopup.initial,
                  parentID: this.editCountryPopup.parentID,
                  earth: '-1',
                }
              },{
                headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
                }).then(res => {
                  this.treeClick(this.data)
                  this.editState = false;
                  this.$message.success('修改成功！');
                  this.getSon(
                    this.node.key,
                    this.node.label,
                    this.node.id,
                    this.node.isLeaf,
                    this.resolve,
                    this.level
                  );
                  // this.$refs['editCountryPopup'].resetFields()
                }).catch(err => {
                  console.log(err)
                })
            }
          }
        })
      },
      // 添加国家弹窗
      addStates(key, data){
        this.countryPopup.select = data.country
        this.countryPopup.parentID = data.id
        this.editCountryPopup.parentID = data.id

        this.addState = true
      },
      // 编辑国家
      handleEdit(key, data){
        this.editState = true;
        this.countryPopup.parentID = data.parentID
        this.editCountryPopup.id = data.id;
        this.editCountryPopup.code = data.code;
        this.editCountryPopup.countryName = data.country;
        this.editCountryPopup.englishName = data.englishName;
        this.editCountryPopup.initials = data.initials;
        this.editCountryPopup.initial = data.initial;
        this.editCountryPopup.pinyin = data.pinyin;
        this.editCountryPopup.select = this.theContinent;
        this.editCountryPopup.isLeaf = String(data.isLeaf);
      },
      // 删除国家
      handleDelete(key, data){
        this.$confirm('是否删除该国家', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete_country',
          confirmButtonClass: 'delete_country_determine',
          cancelButtonClass: 'delete_country_determine1'
        }).then(() => {
          if (data.isLeaf == 0) {
            this.$http.post(this.GLOBAL.serverSrc +'/universal/area/api/areainforlist',{
              object: {
                parentID: data.id
              }
            },{
              headers:{
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
              if (res.data.isSuccess == false) {
                this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainfordelete',{
                  id: data.id
                },{
                  headers:{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                  this.tableData.splice(key, 1)
                  this.$refs.refTree.remove(data)
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }).catch(err => {
                  console.log(err)
                })
              } else {
                this.$alert('<p>该地区下存在城市或省份 , 不能删除 ;</p><p>请清空城市或省份在删除 !</p>', '信息', {
                  confirmButtonText: '确定',
                  customClass: 'delete_country',
                  dangerouslyUseHTMLString: true,
                  confirmButtonClass: 'delete_country_determine',
                })
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/areainfordelete',{
              id: data.id
            },{
              headers:{
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
              this.tableData.splice(key, 1)
              this.$refs.refTree.remove(data)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(err => {
              console.log(err)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 点击按钮查看下级
      subordinate(data){
        let table = {}
        table.name = data.country
        table.id = data.id
        table.isLeaf = data.isLeaf
        this.treeClick(table)
      },
      // 分页显示条数的改变
      pagesizes(page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.treeClick(this.data)
      },
      // 分页当前页的改变
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.treeClick(this.data)
      },
    }
  }
</script>

<style scoped>
.cascade{
  float: left;
  margin-top:72px;
  user-select: none;
  border: solid 2px #e6e6e6;
  position: absolute;
  width: 240px;
  height: 60%;
  overflow: auto;
  box-shadow:1px 1px 1px #EDEDED,1px -1px 1px #EDEDED,-1px 1px 1px #EDEDED,-1px -1px 1px #EDEDED;
}
.treeDemo{
  margin-top: 20px;
}
.popper__arrow{ background: red !important;}
.inputBox{ width: 300px;left:16px;}
.searchButton{ margin-left:22px; }
.search{float: left; margin-top:72px;margin-left:405px;}
.table_list{ top: 10px;margin-bottom: 150px;left:261px;}
.table_button{float: left; width: 50px; height: 22px; padding: 0;}
.table_button_right{ float: right; margin: 0 20px 0 0;}
.table_button1{float: left;  width: 70px; height: 22px; padding: 0;}
.add_country{width:100px;float: left;margin-left:-615px;margin-top:72px;}
.page{ float: right;}
.pages{ height: 50px;margin-bottom: 50px;margin-top:-120px;width:1400px;}
.country_input{ width: 300px; margin: 0 95px 0 0;}
.country_select{ width: 300px; margin: 0 95px 0 0;}
.dialog-footer{ text-align: center;}
.Determine{ margin: 20px; width: 100px;}
.country_span{ float: left; margin: 0 0 0 30px;}
.edit_city_popup{ margin: -90px 0 0 0;}
.cityList>>>.el-tree-node__label{ font-size: 16px;}
.virtualDepartment { position: relative; float: left; left: 20px; margin-top: 13px; }
</style>
