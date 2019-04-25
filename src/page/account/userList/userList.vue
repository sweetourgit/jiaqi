<template>
  <div class="border_size">

    <div>
      <!--搜索框 -->
      <div class="search">
        <div class="search-first">
          <el-select v-model="value" placeholder="全部组织">
            <el-option
              v-for="item in searchListOne"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-second">
          <el-select v-model="type" placeholder="名字">
            <el-option
              v-for="item in searchListTwo"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-third">
          <el-select v-model="user" placeholder="状态">
            <el-option
              v-for="item in searchListThird"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="search-input">
          <el-input v-model="input" placeholder="请输入内容"  clearable></el-input>
        </div>
        <div class="button-search">
          <el-button  size="medium" type="primary" icon="el-icon-search" @click="searchSubmit"></el-button>
        </div>


      </div>
      <!--搜索end-->
      <div class="add-user">
        <router-link to="/userlist/adduser"><el-button type="primary" >添加用户</el-button></router-link>
      </div>
    </div>
    <!--表格-->
    <div class="user-table" style="width: 1031px">
      <el-table
        :data="tableData3"
        border
        :header-row-style="tableHead"
        :cell-style="tableHeight"
        :header-cell-style="getRowClass"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          align="center"
          width="50%">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="100%">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          align="center"
          width="120%">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="180%"
         >
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
          width="50%">
        </el-table-column>
        <el-table-column
          prop="userState"
          label="状态"
          align="center"
          width="80%">
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="部门"
          align="center"
          width="150%"
         >
        </el-table-column>
        <el-table-column
          prop="createTimeFormat"
          label="创建时间"
          align="center"
          width="150%">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150%"
      >
          <template slot-scope="scope">
            <el-button  size="small" @click="find(scope.$index, scope.row)">查看</el-button>
            <el-button type="primary" size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5,10, 300, 400]"
          :page-size=pagesize
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <!--分页end-->
    </div>
    <!--表格end-->

    <el-dialog title="用户信息" custom-class="city_list" :visible.sync="dialogFormVisible" width="490px">
      <div class="bord">
        <el-form ref="form" :model="form" label-width="110px" style="width: 500px;
    margin-left: -270px;">
          <el-form-item label="状态:" class="form-la">
            <el-input v-model="form.userState" disabled class="form-gz"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" class="form-la">
            <el-input v-model="form.mobile" disabled class="form-gz"></el-input>
          </el-form-item>
          <el-form-item label="姓名:" class="form-la">
            <el-input v-model="form.name" disabled class="form-gz"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" class="form-la">
            <el-input v-model="form.email" disabled class="form-gz"></el-input>
          </el-form-item>
          <el-form-item label="员工编号:" class="form-la">
            <el-input v-model="form.userCode" disabled class="form-gz"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" class="form-la">
            <el-input v-model="form.iDcard" disabled class="form-gz"></el-input>
          </el-form-item>
          <el-form-item label="导游证号:" class="form-la">
            <el-input v-model="form.tourGuide" disabled class="form-gz"></el-input>
          </el-form-item>
          <el-form-item label="性别:" class="form-sex" >
            <template>
              <div class="form-size">
                <el-radio disabled v-model="form.sex" label="男" class="form-radios">男</el-radio>
                <el-radio disabled v-model="form.sex" label="女">女</el-radio>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="用户类型:" class="form-sex" >
            <template>
              <div class="form-size1">
                <el-radio disabled v-model="form.userType" label="普通用户" class="form-radios">普通用户</el-radio>
                <el-radio disabled v-model="form.userType" label="管理员">管理员</el-radio>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="组织-部门:" class="from-organize">
            <div class="form-size2">
              <el-input v-model="form.organization" disabled class="form-gz"></el-input>
              <span  class="form-text">默认职位</span>
            </div>
          </el-form-item>
          <el-form-item label="创建时间：" class="from-time" >
            <div class="form-size3">
              <span class="form-createtime">{{form.createTimeFormat}}</span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableHead: {height: '60px', color: '#555555'}, // 表格头部高度
        tableHeight: {padding: '0', height: '34px'},
        pagesize:10,
        qqq: [],
        total:600,
        currentPage:1,
        input:"",
        dialogFormVisible: false,
        form: {
        },
        formLabelWidth: '120px',

        searchListOne: [{
          value: '1',
          label: '辽宁大运通'
        }, {
          value: '2',
          label: '吉林大运通'
        }, {
          value: '3',
          label: '黑龙江大运通'
        }, {
          value: '4',
          label: '大连大运通'
        }, {
          value: '5',
          label: '甜程旅行网'
        }],
        value: '',
        searchListTwo: [{
          value: '1',
          label: 'ID'
        }, {
          value: '2',
          label: '账号'
        }, {
          value: '3',
          label: '名字'
        }, {
          value: '4',
          label: '手机号'
        }],
        type: '',
        searchListThird: [{
          value: '1',
          label: '启用'
        }, {
          value: '2',
          label: '停用'
        }],
        user: '',

        tableData3: [],

      }
    },
    methods:{
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7'
        } else {
          return ''
        }
      },
      handleSizeChange(val) {
        var that = this
        this.pagesize = val
        this.currentPage = 1
        this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage",
          // "http://api.dayuntong.com:3009/api/org/userpage",
          {
            "object": {
              "isDeleted": 0,
              "value":this.value,
              "type":this.type,
              "user":this.user,
              "input":this.input,

            },
            "pageSize":val,
            "pageIndex": 1,
            "isGetAll": true,
            "id": 0
          },
          {
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
          .then(function (obj) {
            // console.log(obj.data.objects)
            that.tableData3 = obj.data.objects
            that.tableData3.forEach(function (v,k,arr) {
              if(arr[k]['userState'] == 0){
                arr[k]['userState'] = '未选择'
              }else if (arr[k]['userState'] == 1) {
                arr[k]['userState'] = '等待审核'
              }else if(arr[k]['userState'] == 2){
                arr[k]['userState'] = '正常'
              }else{
                arr[k]['userState'] = '停用'
              }

              if(arr[k]['sex'] == 1){
                arr[k]['sex'] = '男'
              }else {
                arr[k]['sex'] = '女'
              }
              if(arr[k]['userType'] == 1){
                arr[k]['userType'] = '普通用户'
              }else {
                arr[k]['userType'] = '管理员'
              }
              arr[k]['organization'] = '吉林大运通-财务部-会计'
              arr[k]['updatetime'] = '2018/05/13 10:43'

            })
          })
          .catch(function (obj) {
            console.log(obj)
          })

      },
      handleCurrentChange(val) {
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage",
          // "http://api.dayuntong.com:3009/api/org/userpage",
          {
            "object": {
              "isDeleted": 0,
              "value":this.value,
              "type":this.type,
              "user":this.user,
              "input":this.input,

            },
            "pageSize":this.pagesize,
            "pageIndex": val,
            "isGetAll": true,
            "id": 0
          },{
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
          .then(function (obj) {
            // console.log(obj.data.objects)
            that.tableData3 = obj.data.objects
            that.tableData3.forEach(function (v,k,arr) {
              if(arr[k]['userState'] == 0){
                arr[k]['userState'] = '未选择'
              }else if (arr[k]['userState'] == 1) {
                arr[k]['userState'] = '等待审核'
              }else if(arr[k]['userState'] == 2){
                arr[k]['userState'] = '正常'
              }else{
                arr[k]['userState'] = '停用'
              }
              if(arr[k]['sex'] == 1){
                arr[k]['sex'] = '男'
              }else {
                arr[k]['sex'] = '女'
              }
              if(arr[k]['userType'] == 1){
                arr[k]['userType'] = '普通用户'
              }else {
                arr[k]['userType'] = '管理员'
              }
              arr[k]['organization'] = '吉林大运通-财务部-会计'
              arr[k]['updatetime'] = '2018/05/13 10:43'

            })
          })
          .catch(function (obj) {
            console.log(obj)
          })


      },
      searchSubmit(){
        //搜索
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/org/api/userpage",
          // "http://api.dayuntong.com:3009/api/org/userpage",
          {
            "object": {
              "isDeleted": 0,
              "value":this.value,
              "type":this.type,
              "user":this.user,
              "input":this.input,

            },
            "pageSize":this.pagesize,
            "pageIndex": 1,
            "isGetAll": true,
            "id": 0
          },{
            headers:{
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        )
          .then(function (obj) {
            // console.log(obj.data.objects)
            that.tableData3 = obj.data.objects
            that.tableData3.forEach(function (v,k,arr) {
              if(arr[k]['userState'] == 0){
                arr[k]['userState'] = '未选择'
              }else if (arr[k]['userState'] == 1) {
                arr[k]['userState'] = '等待审核'
              }else if(arr[k]['userState'] == 2){
                arr[k]['userState'] = '正常'
              }else{
                arr[k]['userState'] = '停用'
              }
              if(arr[k]['sex'] == 1){
                arr[k]['sex'] = '男'
              }else {
                arr[k]['sex'] = '女'
              }
              if(arr[k]['userType'] == 1){
                arr[k]['userType'] = '普通用户'
              }else {
                arr[k]['userType'] = '管理员'
              }
              arr[k]['organization'] = '吉林大运通-财务部-会计'
              arr[k]['updatetime'] = '2018/05/13 10:43'

            })
          })
          .catch(function (obj) {
            console.log(obj)
          })

      },
      //查看
      find(index, row){
        this.dialogFormVisible = true
        this.form = row
        console.log(row)
        // if(this.form.sex == 1){
        //   this.form.sex = "1"
        // }
        // this.form.userType = "1"

        console.log(row);
      },
      edit(index, row){

        this.$router.push({
          path: '/userlist/adduser',
          query: {
            id: row.id
          }
        })

        console.log();

      }

    },
    created(){
      //用户列表
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/org/api/userpage",
        {
          "object": {
            "isDeleted": 0,

          },
          "pageSize":this.pagesize,
          "pageIndex": 1,
          "isGetAll": true,
          "id": 0
        },
        {
         headers:{
           'Authorization': 'Bearer ' + localStorage.getItem('token')
         }
        }
      )
        .then(function (obj) {
          console.log(obj.data.objects)
          that.total = obj.data.total
          that.tableData3 = obj.data.objects
          that.tableData3.forEach(function (v,k,arr) {
            if(arr[k]['userState'] == 0){
              arr[k]['userState'] = '未选择'
            }else if (arr[k]['userState'] == 1) {
              arr[k]['userState'] = '等待审核'
            }else if(arr[k]['userState'] == 2){
              arr[k]['userState'] = '正常'
            }else{
              arr[k]['userState'] = '停用'
            }
            if(arr[k]['sex'] == 1){
              arr[k]['sex'] = '男'
            }else {
              arr[k]['sex'] = '女'
            }
            if(arr[k]['userType'] == 1){
              arr[k]['userType'] = '普通用户'
            }else {
              arr[k]['userType'] = '管理员'
            }


          })
        })
        .catch(function (obj) {
          console.log(obj)
        })


    }
  }



</script>

<style scoped>

  .user-table{
    margin-left:26px;
    margin-top: 70px;
  }
  .search{
    height: 70px;
    margin-left:25px;
    padding-top: 20px;
    padding-left: 157px;
    border-bottom: 1px solid #F3F3F3;
  }
  .search-first{
    float: left;
    width: 160px;
  }
  .search-second{
    float: left;
    padding-left: 25px;
    width: 200px;
  }
  .search-third{
    float: left;
    padding-left: 25px;
    width: 200px;
  }
  .search-input{
    float: left;
    padding-left: 25px;
    width: 348px;
  }
  .button-search{
    float: left;
    padding-left: 20px;
    width: 50px;
    height: 50px;
  }
  .button-recover{
    float: left;
    padding-left: 20px;
    width: 50px;
    height: 50px;
  }
  .add-user{
    float: left;
    margin-top: 10px;
    margin-left: 25px;
    width: 100%;
    text-align: left;
  }
  .form-size{
    width: 500px;
  }
  .form-size1{
    width: 562px;
  }
  .form-size2{
    width: 200;
  }
  .form-size3{
    width: 125px;
  }
  .block{
    text-align: right;
    margin-top: 50px;
    margin-bottom: 80px;
  }
  .form-gz{
    width: 215px;
  }
  .form-la{
    padding-left: 299px;
    width: 90px;
  }
  .form-radios{
  }
  .form-sex{
    margin-left: 290px;
  }
  .from-organize{
    width: 80px;
    padding-left: 290px;
  }
  .from-time{
    padding-left: 290px;
  }
  .form-text{
    width: 60px;
    position: absolute;
    padding-right: 4px;
    left: 242px;
    top: 2px;
  }

</style>

