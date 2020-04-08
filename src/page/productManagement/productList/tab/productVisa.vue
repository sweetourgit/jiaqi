<template>
  <div class="productvisa" style="width:1200px; ">
    <!--搜索框-->
    <div class="demo-input-suffix">
      <div class="mt20">
        <span class="search-title" style="margin:0 0 0 35px;">产品ID</span>
        <el-input placeholder="请输入" v-model="productID" class="group-no" style="width:200px;"></el-input> 
        <span class="search-title">产品名称</span>
        <el-input placeholder="请输入" v-model="productName" class="group-no" style="width:200px;"></el-input>
        <span class="search-title">价格</span>
        <el-input placeholder="请输入" v-model="minPrice" class="group-no" style="width:100px;"></el-input>
        <span class="ml10">——</span>
        <el-input placeholder="请输入" v-model="maxPrice" class="group-no" style="width:100px;"></el-input>
      </div>
      <br />
      <div>
        <span class="search-title" style="margin:0 0 0 22px;">国家地区</span>
        <el-autocomplete class="group-no" v-model="countriesArea" :fetch-suggestions="querySearch" placeholder="请输入" :trigger-on-focus="false" @select="departure" style="width:200px;"></el-autocomplete>
        <!-- <el-input placeholder="请输入" v-model="countriesArea" class="group-no" style="width:200px;"></el-input> -->
        <span class="search-title">签证类型</span>
        <el-select v-model="visaTypes" placeholder="请选择" class="group-no" style="width:200px">
          <el-option v-for="item in visaList" :key="item.value" :label="item.label":value="item.value" style="width:200px;"></el-option>
        </el-select>
        <span class="search-title">状态</span>
        <el-select v-model="state" placeholder="请选择" class="group-no" style="width:262px">
          <el-option v-for="item in statesType" :key="item.value" :label="item.label":value="item.value" style="width:200px;"></el-option>
        </el-select>
      </div>
      <br />
      <div class="mbt20">
        <span class="search-title" style="margin:0 0 0 22px;">操作人员</span>
        <el-input placeholder="请输入" v-model="op" class="group-no" style="width:200px;"></el-input>
        <el-button type="primary" class="search-but" @click="search()">搜索</el-button>
        <el-button type="primary" plain @click="reset()">重置</el-button>
      </div>      
    </div>
    <!--按钮-->
    <div class="productbut">
      <el-button type="primary" @click="addProducts()">添加</el-button>
      <el-button :disabled="forbidden" @click="editProducts()">编辑</el-button>
      <el-button :disabled="forbidden">预订</el-button>
      <el-button :disabled="forbidden" @click="visaInventory()">库存</el-button>
      <el-button :disabled="forbidden" @click="changeType()">更改状态</el-button>
      <el-button :disabled="forbidden" @click="copyProducts()">复制</el-button>
      <el-button :disabled="forbidden">退改政策</el-button>
      <el-button :disabled="forbidden" type="danger" plain @click="deleteProducts()">删除</el-button>
    </div>
    <!--列表表格-->
    <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass" @row-click="clickRow" @selection-change="changeFun" :row-style="rowClass">
      <el-table-column prop="id" label="产品ID" align="center" width="120"></el-table-column>
      <el-table-column prop="visaTitle" label="产品名称" align="center" width="278"></el-table-column>
      <el-table-column prop="country" label="国家地区" align="center" width="120"></el-table-column>
      <el-table-column prop="visaType" label="签证类型" align="center" width="120"></el-table-column>
      <el-table-column prop="price" label="价格" align="center" width="120"></el-table-column>
      <el-table-column prop="userName" label="操作人员" align="center" width="120"></el-table-column>
      <el-table-column prop="onlineType" label="线上状态" align="center" width="140"></el-table-column>
      <el-table-column prop="erpType" label="erp状态" align="center" width="140"></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination style="margin:0 0 60px 0;" v-if="pageshow" class="pagination" @size-change="handleSizeChange" background @current-change="handleCurrentChange"
      :current-page.sync="currentPage" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
    ></el-pagination>
    <!--更改状态弹窗-->
    <el-dialog title="更改状态" :visible.sync="changeTypeShow" custom-class="city_list" style="margin-top:-100px;" width="500px"
      @close="closeChangeType('changeTypeForm')">
        <div class="controlButton">
          <el-button @click="closeChangeType('changeTypeForm')">取消</el-button>
          <el-button @click="cancelChangeType('changeTypeForm')"type="primary">确定</el-button>
        </div>
        <el-form :model="changeTypeForm" :rules="rules" ref="changeTypeForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="订单来源：" prop="orderSource">
            <el-radio-group v-model="changeTypeForm.orderSource">
              <el-radio label="1">线上上线</el-radio>
              <el-radio label="2">仅erp上线</el-radio>
              <el-radio label="3">下线</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索框
      productID:'',//产品ID
      productName:'',//产品名称
      minPrice:'', // 最低价格
      maxPrice:'',// 最高价格
      countriesArea:'',// 国家地区
      visaTypes:'',// 签证类型
      state:'',// 状态
      op:'', // 操作
      statesType:[{ // 搜索框状态数据
        value:'1',
        label:'全部状态'
      },{
        value:'2',
        label:'线上上线'
      },{
        value:'3',
        label:'erp上线'
      },{
        value:'4',
        label:'仅erp上线'
      },{
        value:'5',
        label:'下线'
      }],
      visaList:[{ // 签证类型
        value:'1',
        label:'单次旅游签'
      },{
        value:'2',
        label:'5年旅游签'
      },{
        value:'3',
        label:'10年多次旅游签'
      },{
        value:'4',
        label:'探亲访友签'
      },{
        value:'5',
        label:'商务签证'
      }],
      tableDate:[],//表格
      pageshow: true,// 分页
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      total: 0,
      currentPage:1,
      multipleSelection: [], //选中的list
      forbidden:true, 
      pid:"",
      countriesID:'',
      changeTypeShow:false, // 更改状态弹窗
      changeTypeForm:{
        orderSource:''
      },
      rules:{
        orderSource: [
          { required: true, message: "请选择订单来源", trigger: "change" }
        ],
      },

    };

  },
  mounted () {
    this.pageList();
  },
  methods: {     
    search(){ // 搜索
      if(this.op == ''){
        this.currentPage = 1;
        this.pageList(this.pageIndex === 1 ? this.pageIndex : 1,this.pageSize);
      } else {
        this.currentPage = 1;
        this.pageIndex = 1;
        this.getUserCode();
      }
    },
    reset(curPage){ // 重置
      this.productID = '';//产品ID
      this.productName = '';//产品名称
      this.minPrice = ''; // 最低价格
      this.maxPrice = '';// 最高价格
      this.countriesArea = '';// 国家地区
      this.visaTypes = '';// 签证类型
      this.state = '';// 状态
      this.op = ''; // 操作
      this.countriesID = '';
      this.pageIndex = 1 ? 1 : 1;
      this.currentPage = curPage;
      this.pageList();
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    changeFun(val) {
      //保存选中项的数据
      this.multipleSelection = val;
      if(this.multipleSelection.length == 1){
         this.forbidden=false;
      }else{
         this.forbidden=true;
      }
    },
    clickRow(row) {
      //选中行复选框勾选
      this.$refs.multipleTable.clearSelection(); //清空用户的选择,注释掉可多选
      this.$refs.multipleTable.toggleRowSelection(row);
      this.pid = this.multipleSelection[0].id;
    },
    rowClass({row, rowIndex}){  //选中行样式改变
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].id==row.id){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    querySearch(queryString1, cb) { // 搜索国家地区模糊查询
      this.vague = [];
      this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist", {
        object: {
          areaName: queryString1
        }
      })
      .then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.vague.push({
            id: res.data.objects[i].id,
            value: res.data.objects[i].areaName
          });
        }
        var results = queryString1 ? this.vague.filter(this.createFilter(queryString1)): [];
        cb(results);
      })
      .catch(err => {
        console.log(err);
      });
    },
    departure(item) { // 搜索国家地区模糊查询获取ID
      this.countriesID = item.id;
    },
    createFilter(queryString1) {
      return restaurant => {
        return restaurant.value;
      };
    },
    pageList(pageIndex = this.pageIndex,pageSize = this.pageSize,id = this.productID,visaTitle = this.productName,floorPrice = this.minPrice,ceilingPrice = this.maxPrice,visaPod = this.countriesArea,visaType = this.visaTypes,onlineTypeAndErpType = this.state,userCode = this.op) {
      this.$http.post(this.GLOBAL.serverSrc + "/visa/visapro/api/pagevisadisplay",{
        "object": {
          "id":this.productID == "" ? 0 : this.productID,
          "visaTitle":this.productName,
          "floorPrice":this.minPrice == "" ? 0 : this.minPrice,
          "ceilingPrice":this.maxPrice == "" ? 0 : this.maxPrice,
          "visaPod":this.countriesID == "" ? 0 : this.countriesID,
          "visaType":this.visaTypes == ""  ? 0 : this.visaTypes,
          "onlineTypeAndErpType":this.state == ""  ? 0 : this.state,
          "userCode":userCode
        },
        "pageSize":this.pageSize,
        "pageIndex":this.currentPage,
      })
      .then(res =>{
        this.total = res.data.total;
        this.tableDate = res.data.objects;
        this.tableDate.forEach(function (v,k,arr) {
          if(arr[k]['erpType'] == 0){
            arr[k]['erpType'] = '上线'
          }else if(arr[k]['erpType'] == 1) {
            arr[k]['erpType'] = '下线'
          }
          if(arr[k]['onlineType'] == 0){
            arr[k]['onlineType'] = '上线'
          }else if(arr[k]['onlineType'] == 1) {
            arr[k]['onlineType'] = '下线'
          }
          if(arr[k]['visaType'] == 1){
            arr[k]['visaType'] = '单次旅游签'
          }else if(arr[k]['visaType'] == 2) {
            arr[k]['visaType'] = '5年旅游签'
          }else if(arr[k]['visaType'] == 3) {
            arr[k]['visaType'] = '10年多次旅游签'
          }else if(arr[k]['visaType'] == 4) {
            arr[k]['visaType'] = '探亲访友签'
          }else if(arr[k]['visaType'] == 5) {
            arr[k]['visaType'] = '商务签证'
          }
        })
      })
      .catch(res =>{

      })
    },
    getUserCode(){//op输入名字获取usercode
      var that = this
        this.$http.post(this.GLOBAL.serverSrc + "/org/api/userlist",{
          object: {
            name: this.op
          }
        }).then(res => {
            if (res.data.objects.length !=0) {
              var getUserCode='';
              getUserCode = res.data.objects[0].userCode;
              this.pageList(this.pageIndex,this.pageSize,this.productID,this.productName,this.minPrice,this.maxPrice,this.countriesArea,this.visaTypes,this.state,getUserCode);
            } else {
              that.tableDate = [];
            }
          }).catch(function(error) {
            console.log(error);
          })
        this.$nextTick(() => {
          this.pageshow = true;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      if(this.op == ""){
        this.pageList(this.pageIndex,val);
      }else{
        this.getUserCode();
      }
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      if(this.op == ""){
        this.pageList(val,this.pageSize);
      }else{
        this.getUserCode();
      }
    },
    addProducts(){
      this.$router.push({ path: "/visaProducts" });
    },
    editProducts(){
      sessionStorage.setItem('commodityID',this.pid);
      this.$router.push({ path: "/editVisaProducts" });
    },
    changeType(){ // 更改状态
      this.changeTypeShow = true;
    },
    closeChangeType(formName){
      this.changeTypeShow = false;
      this.$refs[formName].resetFields();
    },
    cancelChangeType(formName){ // 更改状态方法
      let onlineType = '';
      let erpType = '' ;
      if(this.changeTypeForm.orderSource == 1){
        onlineType = 0;
        erpType = 0;
      } else if(this.changeTypeForm.orderSource == 2) {
        onlineType = 1;
        erpType = 0;
      } else if(this.changeTypeForm.orderSource == 3){
        onlineType = 1;
        erpType = 1;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.GLOBAL.serverSrc + "/visa/visapro/api/savetype",
            {
              object: {
                "id": this.pid,
                "onlineType":onlineType,
                "erpType":erpType
              }
            })
            .then(res => {
              if(res.data.isSuccess == true){
                this.pageList();
                this.changeTypeShow = false;
                this.$refs[formName].resetFields();
              }
          })
        }
      })
    },
    copyProducts(){ // 复制产品方法
      this.$confirm("是否复制该产品?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      }).then(() => {
        this.$http.post(this.GLOBAL.serverSrc + '/visa/visapro/api/copyvisa',{
          "id": this.pid
        })
        .then(res => {
          if(res.data.isSuccess == true){
             this.$message.success("复制产品成功");
             this.pageList(this.pageIndex === 1 ? this.pageIndex : 1,this.pageSize);
            }
         })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      })
    },
    visaInventory(){ // 团期库存
      this.$router.push({ path: "/visaInventory?id="+this.pid });
    },
    deleteProducts(){ // 删除一条产品
      this.$confirm("是否删除该产品?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      })
      .then(() => {
        this.$http.post(this.GLOBAL.serverSrc + '/visa/visapro/api/delete',{
          "id": this.pid
        })
        .then(res => {
          if(res.data.isSuccess == true){
             this.$message.success("删除成功");
             this.pageList(this.pageIndex === 1 ? this.pageIndex : 1,this.pageSize);
            }
         })
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    },
  }
};
</script>

<style scoped>
.productvisa{
  max-width: 1160px; 
  overflow: hidden;
}
/*search*/
.demo-input-suffix {
  max-width: 1160px;
  background-color: #f7f7f7;
  
  overflow: hidden;
}
.mt20{
  margin-top:20px; 
}
.mbt20{
  margin-bottom: 20px; 
}
.ml10{
  margin-left:10px; 
}
.el-input {
  width: auto;
}
.group-no {
  margin-left: 10px;
}
.start-time {
  margin-left: 10px;
}
.date-line {
  width: 30px;
  border-bottom: 1px solid #e6e6e6;
  display: inline-block;
  margin: 0 3px 3px 0;
}
.search-title {
  font-size: 14px;
  margin-left: 100px;
  text-align:right;
}
.search-but {
  margin: 0 0 0 624px;
  overflow: hidden;
}
/*按钮*/
.productbut{
  margin: 20px 0 10px 0;
}
/*表格*/
.table {
  border: 1px solid #e6e6e6;
  border-bottom: 0;
  background-color: #f7f7f7;
  text-align: center;
  margin: 10px 0 10px 0;
  max-width: 1160px;
  padding-left: 1px;
}
.blue {
  color: #2e94f9;
}
.cursor {
  cursor: pointer;
}
/*分页*/
.pagination{float: right; margin: 10px 0 20px 0;}
.controlButton{position: absolute; top: 8px; right: 10px;}
</style>