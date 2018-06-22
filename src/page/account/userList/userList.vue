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
    <div class="user-table">
      <el-table
       :data="tableData3"
       border
       fit
       style="width: 100%"
        >
         <el-table-column
           prop="id"
           label="ID"
           width="60"
           align="center">
        </el-table-column>
        <el-table-column
           prop="name"
           label="姓名"
           width="100"
           align="center">
        </el-table-column>
        <el-table-column
           prop="userType"
           label="用户类型"
           width="100"
           align="center">
        </el-table-column>
        <el-table-column
           prop="mobile"
           label="手机号"
           width="150"
           align="center">
        </el-table-column>
        <el-table-column
           prop="email"
           label="邮箱"
           width="160"
           align="center">
        </el-table-column>
        <el-table-column
           prop="sex"
           label="性别"
           width="65"
           align="center">
        </el-table-column>
        <el-table-column
           prop="otype"
           label="状态"
           width="86"
           align="center">
        </el-table-column>
        <el-table-column
           prop="organization"
           label="组织-部门-职务"
           width="210"
           align="center">
        </el-table-column>
        <el-table-column
           prop="createTime"
           label="创建时间"
           width="230"
           align="center">
        </el-table-column>
        <el-table-column
           prop="updatetime"
           label="修改时间"
           width="210"
           align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="200">
           <template slot-scope="scope">
             <el-button  size="small" @click="find(scope.$index, scope.row)">查看</el-button>
             <el-button type="primary" size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
           </template>
        </el-table-column>
      </el-table>
        <!--分页-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 200, 300, 400]"
        :page-size=pagesize
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--分页end-->
    </div>
    <!--表格end-->

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <div class="4343">
       <el-form ref="form" :model="form" label-width="110px">
	     <el-form-item label="状态:" class="form-la">
	       <el-input v-model="form.otype" disabled class="form-gz"></el-input>
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
           <el-radio disabled v-model="form.sex" label="1" class="form-radios">男</el-radio>
           <el-radio disabled v-model="form.sex" label="2">女</el-radio>
           </div>
         </template>
        </el-form-item>
         <el-form-item label="用户类型:" class="form-sex" >
	     <template>
          <div class="form-size1">
           <el-radio disabled v-model="form.userType" label="1" class="form-radios">普通用户</el-radio>
           <el-radio disabled v-model="form.userType" label="2">管理员</el-radio>
          </div>
         </template>
         </el-form-item>
         <el-form-item label="组织-部门-职务:" class="from-organize">
          <div class="form-size2">
	       <el-input v-model="form.organization" disabled class="form-gz"></el-input>
	       <span  class="form-text">默认职位</span>
         </div>
	     </el-form-item>
	     <el-form-item label="创建时间：" class="from-time" >
        <div class="form-size3">
	       <span class="form-createtime">{{form.updatetime}}</span>
         </div>
	     </el-form-item>
	     <el-form-item label="修改时间：" class="from-time">
        <div class="form-size3">
	       <span class="form-createtime">{{form.updatetime}}</span>
       </div>
	     </el-form-item>
       </el-form>
	  <div slot="footer" class="dialog-footer">
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
      handleSizeChange(val) {
        var that = this
        this.pagesize = val
        this.currentPage = 1
        this.$http.post(
          "http://api.dayuntong.com:3009/api/org/userpage",
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
          }
        )
          .then(function (obj) {
            // console.log(obj.data.objects)
            that.tableData3 = obj.data.objects
            that.tableData3.forEach(function (v,k,arr) {
              arr[k]['otype'] = '正常'
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
          "http://api.dayuntong.com:3009/api/org/userpage",
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
          }
        )
          .then(function (obj) {
            // console.log(obj.data.objects)
            that.tableData3 = obj.data.objects
            that.tableData3.forEach(function (v,k,arr) {
              arr[k]['otype'] = '正常'
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
         "http://api.dayuntong.com:3009/api/org/userpage",
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
         }
       )
         .then(function (obj) {
           // console.log(obj.data.objects)
           that.tableData3 = obj.data.objects
           that.tableData3.forEach(function (v,k,arr) {
             arr[k]['otype'] = '正常'
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
        if(this.form.sex == 1){
          this.form.sex = "1"
        }
        this.form.userType = "1"

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
        "http://api.dayuntong.com:3009/api/org/userpage",
       {
         "object": {
           "isDeleted": 0,

         },
         "pageSize":this.pagesize,
         "pageIndex": 1,
         "isGetAll": true,
         "id": 0
       }
      )
        .then(function (obj) {
          // console.log(obj.data.objects)
          that.tableData3 = obj.data.objects
          that.tableData3.forEach(function (v,k,arr) {
              arr[k]['otype'] = '正常'
              arr[k]['organization'] = '吉林大运通-财务部-会计'
              arr[k]['updatetime'] = '2018/05/13 10:43'

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
    width: 1572px;
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
  .border_size{
    width: 1602px;
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
    float: right;
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
  	margin-left: -350px;
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

