<template>
  <div class="border_size">
    <!--搜索框-->
    <div class="search">
      <div class="fl">
         <el-select v-model="organization" placeholder="全部组织" class="empty">
           <el-option :label="item.label" :value="item.value" v-for="(item,index) of texture" :key="item.value" />
         </el-select>
      </div>
      <div class="fl">
         <el-select v-model="name" placeholder="名字" class="empty">
           <el-option :label="item.label" :value="item.value" v-for="(item,index) of nameType" :key="item.value" />
         </el-select>
      </div>
      <div class="fl">
         <el-select v-model="state" placeholder="状态" class="empty">
           <el-option :label="item.label" :value="item.value" v-for="(item,index) of stateType" :key="item.value" />
         </el-select>
      </div>
      <div class="fl">
         <el-input v-model="groupCode" class="empty" clearable placeholder="请输入"></el-input>
      </div>
      <div class="fl">
        <el-button type="primary">搜索</el-button>
        <el-button type="primary">重置</el-button>
      </div>
    </div>
    <!--表格-->
    <el-table :data="tableData" class="tableData" border style="width: 1100px">
      <el-table-column prop="ID" label="ID" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="type" label="用户类型" width="80"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="mail" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="sex" label="性别" width="180"></el-table-column>
      <el-table-column prop="state" label="状态" width="180"></el-table-column>
      <el-table-column prop="department" label="组织-部门-职务" width="180"></el-table-column>
      <el-table-column prop="beginTime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="alterTime" label="修改时间" width="180"></el-table-column>
      <el-table-column label="操作" width="180"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //搜索栏
        organization:'',
        texture:[{
          value:'1',
          label:'全部组织'
        }],
        name:'',
        nameType:[{
          value:'1',
          label:'ID'
        },{
          value:'2',
          label:'名字'
        },{
          value:'3',
          label:'手机号'
        }],
        state:'',
        stateType:[{
          value:'1',
          label:'正常'
        },{
          value:'2',
          label:'停用'
        }],
        groupCode:'',
        //表格
        tableData:[{
          ID:'1',
          name:'李健',
          type:'普通用户',
          phone:'15242548542',
          mail:'454568@qq.com',
          sex:'男',
          state:'正常',
          department:'辽宁大运通-销售部-主管',
          beginTime:'2018-05-14 10:23',
          alterTime:'2018-05-14 10:23'
        }]
      }
    },
    methods:{

    },
    created(){


    }
  }



</script>

<style scoped>
/*搜索栏*/
.search{width:1100px; overflow:hidden;margin:0 0 30px 0;}
.fl{float:left;margin: 0 20px 0 0;}
.empty{ width: 200px; line-height: 30px;margin: 0 0 0 10px; }
/*表格*/
.tableData{width: 1100px; margin: 50px 0 0 0;overflow: hidden;}
</style>

