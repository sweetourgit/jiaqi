<template>
	<div>
      <div>
        <div class="user-title">用户列表</div>
      </div>
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
      		<el-input  placeholder="请输入内容"  clearable></el-input>
      	</div>
        <div class="button-search">
      	  <el-button type="primary" size="mini" >搜索</el-button>
        </div>
        <div class="button-recover">
      	  <el-button type="primary" size="mini">重置</el-button>
      	</div>
        <div class="add-user">
        <router-link to="/userlist/adduser"><el-button type="primary" >添加用户</el-button></router-link>
      </div>
      </div>
      <!--搜索end-->
      
    </div> 
       <!--表格-->
    <div class="user-table">
      <el-table
       :data="tableData3"
       border
       style="width: 100%"
        >
         <el-table-column
           prop="id"
           label="ID"
           width="110"
           align="center">
        </el-table-column>
        <el-table-column
           prop="name"
           label="姓名"
           width="86"
           align="center">
        </el-table-column>
        <el-table-column
           prop="type"
           label="用户类型"
           width="100"
           align="center">
        </el-table-column>
        <el-table-column
           prop="phone"
           label="手机号"
           width="150"
           align="center">
        </el-table-column>
        <el-table-column
           prop="mail"
           label="邮箱"
           width="150"
           align="center">
        </el-table-column>
        <el-table-column
           prop="sex"
           label="性别"
           width="60"
           align="center">
        </el-table-column>
        <el-table-column
           prop="otype"
           label="状态"
           width="100"
           align="center">
        </el-table-column>
        <el-table-column
           prop="organization"
           label="组织-部门-职务"
           width="185"
           align="center">
        </el-table-column>
        <el-table-column
           prop="createtime"
           label="创建时间"
           width="100"
           align="center">
        </el-table-column>
        <el-table-column
           prop="updatetime"
           label="修改时间"
           width="100"
           align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
           <template slot-scope="scope">
             <el-button type="text" size="small" @click="dialogFormVisible = true">查看</el-button>
             <el-button type="text" size="small">编辑</el-button>
           </template>
        </el-table-column>
      </el-table>
        <!--分页-->
    <div class="block">
       <el-pagination
        :page-sizes="[10]"
        background
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="490">
       </el-pagination>
    </div>
    <!--分页end-->
    </div>
    <!--表格end-->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
       <el-form ref="form" :model="form" label-width="110px">
	     <el-form-item label="状态:" class="form-la">
	       <el-input v-model="form.otype" disabled class="form-gz"></el-input>
	     </el-form-item>
	     <el-form-item label="手机号:" class="form-la">
	       <el-input v-model="form.phone" disabled class="form-gz"></el-input>
	     </el-form-item>
	     <el-form-item label="姓名:" class="form-la">
	       <el-input v-model="form.name" disabled class="form-gz"></el-input>
	     </el-form-item>
	     <el-form-item label="邮箱:" class="form-la">
	       <el-input v-model="form.mail" disabled class="form-gz"></el-input>
	     </el-form-item>
	     <el-form-item label="员工编号:" class="form-la">
	       <el-input v-model="form.number" disabled class="form-gz"></el-input>
	     </el-form-item>
	     <el-form-item label="身份证号:" class="form-la">
	       <el-input v-model="form.id" disabled class="form-gz"></el-input>
	     </el-form-item>
	     <el-form-item label="导游证号:" class="form-la">
	       <el-input v-model="form.trailId" disabled class="form-gz"></el-input>
	     </el-form-item>
	     <el-form-item label="性别:" class="form-sex" >
	     <template>
           <el-radio disabled v-model="form.radioSex" label="1" class="form-radios">男</el-radio>
           <el-radio disabled v-model="form.radioSex" label="2">女</el-radio>
         </template>
         </el-form-item>
         <el-form-item label="用户类型:" class="form-sex" >
	     <template>
           <el-radio disabled v-model="form.userType" label="1" class="form-radios">普通用户</el-radio>
           <el-radio disabled v-model="form.userType" label="2">管理员</el-radio>
         </template>
         </el-form-item>
         <el-form-item label="组织-部门-职务:" class="from-organize">
	       <el-input v-model="form.organization" disabled class="form-gz"></el-input>
	       <span  class="form-text">默认职位</span>
	     </el-form-item>
	     <el-form-item label="创建时间：" class="from-time" >
	       <span class="form-createtime">{{form.createtime}}</span>
	     </el-form-item>
	     <el-form-item label="修改时间：" class="from-time">
	       <span class="form-createtime">{{form.updatetime}}</span>
	     </el-form-item>
       </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
	  </div>
    </el-dialog>
  
    </div>
</template>

<script>
  export default {
   data() {
      return {	
        dialogFormVisible: false,
        form: {
          otype: '正常',
          phone: '15662458688',
          name: '张三',
          mail: 'slfkjsl@qq.com',
          number: '323213',
          id:'2116153183156146',
          trailId: '23213213213213',
          radioSex: '1',
          userType: '1',
          organization: '甜程旅行网-财务部-经理',
          createtime: '2018/05/04 10:23',
          updatetime: '2018/05/14 10:23',
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
      
      tableData3: [{
          id: '001',
          name: '张三',
          type: '普通用户',
          phone: '188888888888',
          mail: '36463148@qq.com',
          sex: '男',
          otype: '正常',
          organization: '辽宁大运通-销售部-主管 辽宁大运通-销售部-主管',
          createtime: '2018/05/04 10:23',
          updatetime: '2018/05/13 10:43',
          operation: '王小虎',
        },{
          id: '002',
          name: '李四',
          type: '管理员',
          phone: '177777777777',
          mail: '3644646148@qq.com',
          sex: '女',
          otype: '停用',
          organization: '吉林大运通-财务部-会计 辽宁大运通-销售部-销售',
          createtime: '2018/05/04 10:23',
          updatetime: '2018/05/13 10:43',
          operation: '王小虎',
        }]
      }
    }
}

   

</script>

<style scoped>
  .user-title{
  	width: 120px;
    height: 22px;
    font-size: 18px;
    position: absolute;
    left: 375px;
    top: 70px;}
  .search{
    height: 70px;
    margin-left: -30px;
  }
  .search-first{
  	 float: left;
  	 width: 160px;
  }
  .search-second{
    float: left;
    padding-left: 35px;
    width: 160px;
   } 
  .search-third{
  	float: left;
    padding-left: 35px;
    width: 160px;
  }
  .search-input{
  	float: left;
    padding-left: 35px;
    width: 300px;
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
    float: right;
  }
  .user-table{
  	
    margin-left: -30px;
  }
  .block{
    float: right;
    margin-top: 10px;
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
   .form-createtime{
   	padding-right:400px;
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

