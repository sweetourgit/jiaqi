<template>
  <div class="demo-input-suffix" v-if="false">
     <el-button type="primary" @click="add(1)">添加</el-button>
     <el-table :data="dataList" ref="multipleTable" class="table" :header-cell-style="getRowClass" border>
       <el-table-column  prop="id" label="ID" min-width="80" align="center"></el-table-column>   
       <el-table-column  prop="name" label="名称" width="220" align="center"></el-table-column>
       <el-table-column  prop="groupCode" label="计划编码" width="250" align="center"></el-table-column>
       <el-table-column  prop="package" label="出行模板" width="220" align="center"></el-table-column>
       <el-table-column  prop="payable" label="价格" width="120" align="center"></el-table-column>
       <el-table-column  prop="mark" label="库存" width="100" align="center"></el-table-column>
       <el-table-column  label="操作" width="200" align="center">
            <template slot-scope="scope">
               <el-breadcrumb separator="|" class="breadCrumb">
                  <el-breadcrumb-item @click.native="add(2)"><span class="breadCrumbPointer">修改</span></el-breadcrumb-item>
                  <el-breadcrumb-item @click.native="online(scope.row.id)"><span class="breadCrumbPointer">上线</span></el-breadcrumb-item>
                  <el-breadcrumb-item @click.native="offline(scope.row.id)" v-if="false"><span class="breadCrumbPointer">下线</span></el-breadcrumb-item>
                  <el-breadcrumb-item @click.native="delInventory(scope.row.id)"><span class="breadCrumbPointer">删除</span></el-breadcrumb-item>
               </el-breadcrumb>
            </template>
       </el-table-column>
     </el-table>
     <!--添加SKU-->
     <el-dialog :title="title" :visible.sync="dialogForm" class="city_list" width="580px" @close="close">
          <el-form :model="skuForm" :rules="rules" ref="skuForm" label-width="80px" class="demo-ruleForm">
               <el-form-item label="名称" prop="name">
                  <el-input v-model="skuForm.name"></el-input>
               </el-form-item>
               <el-form-item label="计划编码" prop="name">
                  <el-input v-model="skuForm.name"></el-input>
               </el-form-item>
               <el-form-item label="出行模板" prop="name">
                  <el-select v-model="skuForm.name" placeholder="请选择">
                     <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
               </el-form-item>
               <el-form-item label="库存" prop="name">
                  <el-input v-model="skuForm.name"></el-input>
                  <el-checkbox v-model="skuForm.unlimited" class="unlimited">无限库存</el-checkbox>
               </el-form-item>
               <el-form-item label="销售价" prop="name">
                  <el-input v-model="skuForm.name"></el-input>
               </el-form-item>
               <el-form-item label="同业价" prop="name">
                  <el-input v-model="skuForm.name"></el-input>
               </el-form-item>
               <el-form-item label="结算价" prop="name">
                  <el-input v-model="skuForm.name"></el-input>
               </el-form-item>    
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="subInfo('conForm')">确 定</el-button>
          </div>
     </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList:[],
      dialogForm:false,
      title:"",
      skuForm:{
        name:'',
        unlimited:false,
      },
      options:[
        {label:"a",id:1},
        {label:"b",id:2},
      ],
      rules:{
        name:[{ required: true, message: '名称不能为空', trigger: 'blur' }],

      },
    }
  },
  mounted(){
    this.getDatalist()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }){
        if (rowIndex == 0) {
          return 'background:#f7f7f7;height:35px;textAlign:center;color:#333;fontSize:15px'
        } else {
          return ''
        }
    },
    getDatalist(){
        this.$http.post(this.GLOBAL.serverSrc + '/order/all/api/orderlist',{
              "object": {
                "teamID":0,
              },
            }).then(res => {
              this.dataList=[];
              if(res.data.isSuccess == true){
                 this.dataList=res.data.objects;
              }
        })
    },
    online(ID){
        this.$confirm("是否上线该SKU?", "提示", {
           confirmButtonText: "上线",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
            console.log("上线");
        }) 
        .catch(() => {
            this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    offline(ID){

    },
    delInventory(ID){
        this.$confirm("是否删除该SKU?", "提示", {
           confirmButtonText: "删除",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
            console.log("删除");
        }) 
        .catch(() => {
            this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    add(index){
      this.dialogForm=true;
      if(index==1){
        this.title = "添加SKU"
      }else{
        this.title = "修改SKU"
      }
    },
    close(){
      this.dialogForm=false;
      this.$refs["skuForm"].resetFields();
    }




    }
}
</script>

<style scoped>
 .demo-input-suffix{width: 1250px}
 .table{border:1px solid #e6e6e6;width:1200px;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin-top:20px}
 .breadCrumbPointer{cursor: pointer;color: #2e94f9}
 .breadCrumb{margin-left: 24px}
 .dialog-footer{text-align: center}
 .demo-ruleForm .el-input{width:350px}
 .demo-ruleForm .el-select{width:350px}
 .unlimited{margin-left: 20px}
</style>