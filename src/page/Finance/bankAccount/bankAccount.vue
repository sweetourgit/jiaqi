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
    <el-table
      :data="dataList"
      ref="multipleTable"
      class="table-class"
      :header-cell-style="getRowClass"
      border
      :row-style="rowClass"
      @selection-change="changeFun"
      @row-click="clickRow"
    >
      <el-table-column prop="orgName" label="公司名称" width="200" align="center"></el-table-column>
      <el-table-column prop="subject" label="科目值" width="150" align="center"></el-table-column>
      <el-table-column label="类型" width="100" prop="cardType" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.cardType===1">收款</span>
          <span v-if="scope.row.cardType===2">付款</span>
          <span v-if="scope.row.cardType===3">应收</span>
          <span v-if="scope.row.cardType===4">应付</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="账号名称" align="center"></el-table-column>
      <el-table-column prop="cardNum" label="卡号" align="center"></el-table-column>
      <el-table-column prop="openingBank" label="开户行" align="center"></el-table-column>
      <el-table-column prop="openingName" label="开户人" width="150" align="center"></el-table-column>
      <el-table-column prop="ratio" label="手续费比率" width="120" align="center"></el-table-column>
      <!-- <el-table-column prop="ratio" label="创建时间" align="center"></el-table-column> -->
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.row)"
            type="text"
            size="small"
            class="table_details"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages">
      <el-pagination
        class="page"
        background
        @size-change="pagesizes"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[2, 4, 8, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      width="500px"
      top="10vh"
      title="收款账号"
      :visible.sync="dialogSupplierVisible"
      :show-close="false"
      @close="editDialog"
    >
      <el-form ref="Form" :model="handleForm" :rules="rules" label-width="100px">
        <el-form-item label="科目值:" prop="subject">
          <span style="margin-left: 15px;">{{handleForm.subject}}</span>
        </el-form-item>
        <el-form-item label="公司" prop="title">
          <el-select
            class="item_input"
            v-model="handleForm.orgName"
            placeholder="请选择"
            @change="currentSel"
          >
            <el-option
              v-for="item in orgNameOptions"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户名称" prop="title">
          <el-input class="item_input" v-model="handleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="cardNum">
          <el-input class="item_input" v-model="handleForm.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="openingBank">
          <el-input class="item_input" v-model="handleForm.openingBank"></el-input>
        </el-form-item>
        <el-form-item label="开户人" prop="openingName">
          <el-input class="item_input" v-model="handleForm.openingName"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="cardType">
          <el-select class="item_input" v-model="handleForm.cardType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手续费比率" prop="ratio">
          <el-input class="item_input" v-model="handleForm.ratio"></el-input>%
        </el-form-item>
        <el-form-item class="dialog-footer">
          <el-button @click="dialogSupplierVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave('Form')">保 存</el-button>
        </el-form-item>
      </el-form>
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
      subject: "", // 搜索科目值
      cardType: "", //搜索状态
      currentPage: 1, // 默认开始页数
      pagesize: 10, // 每页的数据条数
      total: 100, // 分页总条数
      dialogSupplierVisible: false,
      currentRow: "", // 表格选中的值
      isRow: true,
      dataList: [], //接收初始请求的数据
      orgNameOptions: [], //接收公司名称的
      handleForm: {
        id: "",
        orgName: "", //公司名称
        orgNameId: null, //选中的公司名称的id
        subject: "", //科目值
        title: "", //账户名称
        cardNum: "", //卡号
        openingBank: "", //开户行
        openingName: "", //开户人
        cardType: "", //类型
        ratio: "" //手续费比率
      },
      rules: {
        orgName: [{ required: true, message: "不能为空", trigger: "blur"}],
        title: [
          { required: true, message: "不能为空", trigger: "blur"},
          {
            min: 0,
            max: 40,
            message: "长度在 0 到 40 个字符",
            message: "字数超过限制",
            trigger: "blur"
          }
        ],
        cardNum: [
          // { required: true, message: '不能为空' },
          {
            min: 0,
            max: 40,
            message: "长度在 0 到 40 个字符",
            message: "字数超过限制",
            trigger: "blur"
          }
        ],
        openingBank: [
          // { required: true, message: '不能为空' },
          {
            min: 0,
            max: 80,
            message: "长度在 0 到 80 个字符",
            message: "字数超过限制",
            trigger: "blur"
          }
        ],
        openingName: [
          // { required: true, message: '不能为空' },
          {
            min: 0,
            max: 40,
            message: "长度在 0 到 40 个字符",
            message: "字数超过限制",
            trigger: "blur"
          }
        ],
        cardType: [
          { required: true, message: "至少选择一个", trigger: "blur" }
        ],
        ratio: [
          {
            pattern: /^\d+(\.\d{0,2})?$/,
            message: "只可输入整数或者小数点后两位",
            trigger: "change"
          }
        ]
      },
      options: [
        {
          id: 1,
          name: "收款"
        },
        {
          id: 2,
          name: "付款"
        },
        {
          id: 3,
          name: "应收"
        },
        {
          id: 4,
          name: "应付"
        }
      ],
      multipleSelection: [] //选中list
    };
  },
  created() {
    this.getData();
    this.getorgID();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F7F7F7";
      } else {
        return "";
      }
    },
    //重置
    emptySearch() {
      console.log(1);
      // this.searchType = '';
      // this.searchName = '';
      this.subject = "";
      this.cardType = "";
      this.getData();
    },
    searchButton() {
      this.getData();
    },
    // 账号列表
    getData(subject = this.subject, cardType = this.cardType) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/page", {
          pageIndex: this.currentPage,
          pageSize: this.pagesize,
          object: {
            subject: subject,
            cardType: cardType == "" ? 0 : cardType
          }
        })
        .then(res => {
          console.log(res);
          this.dataList = res.data.objects;
          this.total = res.data.total;
        });
    },
    // 编辑弹窗
    handleEdit(row) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collectionaccount/api/get", {
          id: row.id
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            let data = res.data.object;
            this.handleForm.subject = data.subject;
            this.handleForm.title = data.title;
            this.handleForm.cardNum = data.cardNum;
            this.handleForm.openingBank = data.openingBank;
            this.handleForm.openingName = data.openingName;
            this.handleForm.cardType = data.cardType;
            this.handleForm.ratio = data.ratio;
            this.handleForm.orgNameId = data.orgID;
            this.getOrgName()
          }
        });
      this.dialogSupplierVisible = true;
    },
    //根据orgID获取公司的名字
    getOrgName() {
      let index = this.orgNameOptions.findIndex(item => item.id == this.handleForm.orgNameId)
      this.handleForm.orgName = this.orgNameOptions[index].orgName
    },
    rowClass({ row, rowIndex }) {
      //选中行样式改变
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].id == row.id) {
          return { "background-color": "#ecf5ff" };
        }
      }
    },
    clickRow(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    changeFun(val) {
      //保存选中项的数据
      this.multipleSelection = val;
    },
    // 编辑弹窗关闭
    editDialog () {
      this.multipleSelection = []
    },
    // 保存
    handleSave(Form) {
      this.$refs[Form].validate(valid => {
        if (valid) {
          this.$http
            .post(
              this.GLOBAL.serverSrc + "/finance/collectionaccount/api/save",
              {
                object: {
                  id: this.multipleSelection[0].id,
                  cardType: this.handleForm.cardType,
                  subject: this.handleForm.subject,
                  title: this.handleForm.title,
                  cardNum: this.handleForm.cardNum,
                  openingBank: this.handleForm.openingBank,
                  openingName: this.handleForm.openingName,
                  ratio: this.handleForm.ratio,
                  orgID: this.handleForm.orgNameId,
                  mark: ""
                }
              }
            )
            .then(res => {
              if (res.data.isSuccess == true) {
                this.getData();
                this.dialogSupplierVisible = false;
                //this.$refs[formName].resetFields();
              } else {
                this.$message.success(res.data.result.message);
              }
            })
            .catch(obj => {
              console.log(obj);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 请求公司的组织名字
    getorgID() {
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/deptpage", {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          object: {
            parentID: 204
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.orgNameOptions = res.data.objects;
          } else {
          }
        })
        .catch(obj => {
          console.log(obj);
        });
    },
    // 弹窗选中的公司名称
    currentSel(item) {
      this.handleForm.orgNameId = item;
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
};
</script>

<style scoped>
.bankAccount >>> .el-form-item__error {
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
  margin-top: 50px;
}
.item_input {
  width: 250px;
  margin-left: 15px;
}
.dialog-footer {
  text-align: center;
}
.pages {
  margin-top: 20px;
  padding: 50px;
  text-align: right;
}
</style>
