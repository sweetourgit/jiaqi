<template>
  <div class="bankAccount">
    <div class="search_dom">
      <span>科目值</span>
      <el-input class="search_input" v-model="subject" clearable></el-input>
      <span style="margin:0 0 0 20px;">类型</span>
      <el-select class="search_input" v-model="cardType" clearable placeholder="请选择">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button style="margin-left: 10px;" type="primary" @click="searchButton()">搜索</el-button>
      <el-button style="margin-left: 10px;" type="primary" @click="emptySearch()">重置</el-button>
    </div>
    <!-- <el-button class="button" type="primary" :disabled="isRow" @click="handleEdit">编辑</el-button> -->
    <!-- <el-table :data="dataList" class="table-class" border highlight-current-row :header-cell-style="getRowClass" ref="multipleTable"selection-change="changeFun"> -->
    <el-table :data="dataList" ref="multipleTable" class="table-class" :header-cell-style="getRowClass" border :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
      <el-table-column prop="subject" label="科目值" align="center" width="140"></el-table-column>
      <el-table-column label="类型" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.cardType===1">收款</span>
          <span v-if="scope.row.cardType===2">付款</span>
          <span v-if="scope.row.cardType===3">应收</span>
          <span v-if="scope.row.cardType===4">应付</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="账号名称" width="180" align="center"></el-table-column>
      <el-table-column prop="cardNum" label="卡号" min-width="200" align="center"></el-table-column>
      <el-table-column prop="openingBank" label="开户行" width="140" align="center"></el-table-column>
      <el-table-column prop="openingName" label="开户人" width="140" align="center"></el-table-column>
      <el-table-column prop="ratio" label="手续费比率" width="140" align="center"></el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small" class="table_details">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages">
      <el-pagination class="page" background @size-change="pagesizes" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!-- 编辑弹窗 -->
    <el-dialog width='500px' top='10vh' title="收款账号" :visible.sync="dialogSupplierVisible" :show-close="false">
      <el-form ref="Form" :model="handleForm" :rules="rules" label-width="100px">
        <el-form-item label="科目值:" prop="subject">
          <span style="margin-left: 15px;" v-model="handleForm.subject">{{handleForm.subject}}</span>
        </el-form-item>
        <el-form-item label="账户名称" prop="title">
          <el-input class="item_input" v-model="handleForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="cardNum">
          <el-input class="item_input" v-model="handleForm.cardNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="openingBank">
          <el-input class="item_input" v-model="handleForm.openingBank" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户人" prop="openingName">
          <el-input class="item_input" v-model="handleForm.openingName" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select class="item_input" v-model="handleForm.cardType" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手续费比率" prop="ratio">
          <el-input class="item_input" v-model="handleForm.ratio" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 100px" @click="dialogSupplierVisible = false">取 消</el-button>
        <el-button style="width: 100px" type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹窗END -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      //tableHeight:{padding: '0', height: '40px'},
      //tableHead:{color: '#555555'},
      subject: '', // 搜索科目值
      cardType:0,//搜索状态
      currentPage: 1,      // 默认开始页数
      pagesize:10,         // 每页的数据条数
      total: 100,          // 分页总条数
      dialogSupplierVisible: false,
      currentRow: '',   // 表格选中的值
      isRow: true,

      dataList: [],
      handleForm: {
        id: '',
        subject: '',
        title: '',
        cardNum: '',
        openingBank: '',
        openingName: '',
        cardType: '',
        ratio:''
      },
      rules: {
        title: [
          { required: true, message: '不能为空' },
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', message: '字数超过限制' }
        ],/*
        cardNum: [
          { required: true, message: '不能为空' },
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', message: '字数超过限制' }
        ],
        openingBank: [
          { required: true, message: '不能为空' },
          { min: 0, max: 80, message: '长度在 0 到 80 个字符', message: '字数超过限制' }
        ],
        openingName: [
          { required: true, message: '不能为空' },
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', message: '字数超过限制' }
        ],
        type: [
          { required: true, message: '至少选择一个',trigger: 'blur'  }
        ]*/
      },
      options: [{
        id: 1,
        name: '收款'
      },{
        id: 2,
        name: '付款'
      },{
        id: 3,
        name: '应收'
      },{
        id: 4,
        name: '应付'
      }],
      multipleSelection: [],//选中list
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7'
      } else {
        return ''
      }
    },
    //重置
    emptySearch(){
      this.searchType = '';
      this.searchName = '';
    },
    searchButton(){
      this.getData();
    },
    // 账号列表
    getData(subject=this.subject,cardType=this.cardType) {
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collectionaccount/api/page', {
        "pageIndex": this.currentPage,
        "pageSize": this.pagesize,
        "object": {
          "subject":subject,
          "cardType":cardType,
        }
      }).then(res => {
        console.log(res)
        this.dataList = res.data.objects;
        this.total = res.data.total;
      })
    },
    // 编辑弹窗
    /*handleEdit(row) {
      setTimeout(v => {
        this.handleForm.subject = this.currentRow.subject;
        this.handleForm.title = this.currentRow.title;
        this.handleForm.cardNum = this.currentRow.cardNum;
        this.handleForm.openingBank = this.currentRow.openingBank;
        this.handleForm.openingName = this.currentRow.openingName;
        this.handleForm.cardType = this.currentRow.cardType;
        this.handleForm.ratio = this.currentRow.ratio;
        this.dialogSupplierVisible = true;
      },200)
    },*/
    handleEdit(row){
      this.dialogSupplierVisible = true;
      this.$http.post(this.GLOBAL.serverSrc + '/finance/collectionaccount/api/get',{
         "id":this.multipleSelection[0].id
        }).then(res => {
            if(res.data.isSuccess == true){
               this.handleForm=res.data.object;
               let data = res.data.object;
               this.handleForm.subject=data.subject;
               this.handleForm.title = data.title;
               this.handleForm.cardNum = data.cardNum;
               this.handleForm.openingBank = data.openingBank;
               this.handleForm.openingName = data.openingName;
               this.handleForm.cardType = data.cardType;
               this.handleForm.ratio = data.ratio;
            }
      })  
    },
    rowClass({row, rowIndex}){  //选中行样式改变
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].id==row.id){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    clickRow(row){
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    changeFun(val) {  //保存选中项的数据
      this.multipleSelection=val;
    },
    // 保存
    handleSave() {
      this.$refs['Form'].validate(valid => {
        if(valid) {
          
        }
      })
    },
    /*// 表格选中
    handleChange(val) {
      if (val) this.currentRow = val;
      this.isRow = false;
    },*/
    // 每页显示条数
    pagesizes(page) {
      this.currentPage = 1;
      this.pagesize = page;
      this.getData();
    },
    // 改变当前页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    }
  }
}
</script>

<style scoped>
.bankAccount>>>.el-form-item__error {
  margin-left: 15px;
}
.search_dom {
  font-size: 14px;
}
.search_input {
  width: 200px;
  margin-left: 20px;
}
.button {
  width: 90px;
  margin-top: 30px;
}
.table-class {
  text-align: center;
  margin-top: 20px;
  width: 1200px;
}
.item_input {
  width: 250px;
  margin-left: 15px;
}
.dialog-footer {
  text-align: center;
}
.pages {
  width: 1000px;
  margin-top: 50px;
}
.page {
  float: right;
}
</style>
