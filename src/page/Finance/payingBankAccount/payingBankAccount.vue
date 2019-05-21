<template>
  <div class="payingBankAccount">
    <el-button class="button" type="primary" @click="handleEdit">编辑</el-button>
    <el-table
      :data="dataList"
      class="table-class"
      border
      highlight-current-row
      @current-change="handleChange"
      :header-cell-style="getRowClass">
      <el-table-column prop="subjectValue" label="科目值" header-align="center" width="180"></el-table-column>
      <el-table-column prop="name" label="账号名称" width="180" header-align="center"></el-table-column>
      <el-table-column prop="cardNumber" label="卡号" min-width="220" header-align="center"></el-table-column>
      <el-table-column prop="openingBank" label="开户行" width="140" header-align="center"></el-table-column>
      <el-table-column prop="openingPeople" label="开户人" width="140" header-align="center"></el-table-column>
    </el-table>
    <div class="pages">
      <el-pagination class="page" background @size-change="pagesizes" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 8, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <!-- 编辑弹窗 -->
    <el-dialog width='500px' top='10vh' title="收款账号" :visible.sync="dialogSupplierVisible" :show-close="false">
      <el-form ref="Form" :model="handleForm" :rules="rules" label-width="100px">
        <el-form-item label="科目值:" prop="subjectValue">
          <span style="margin-left: 15px;">{{handleForm.subjectValue}}</span>
        </el-form-item>
        <el-form-item label="账户名称" prop="name">
          <el-input class="item_input" v-model="handleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="cardNumber">
          <el-input class="item_input" v-model="handleForm.cardNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="openingBank">
          <el-input class="item_input" v-model="handleForm.openingBank" clearable></el-input>
        </el-form-item>
        <el-form-item label="开户人" prop="openingPeople">
          <el-input class="item_input" v-model="handleForm.openingPeople" clearable></el-input>
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
      currentPage: 1,      // 默认开始页数
      pagesize:10,         // 每页的数据条数
      total: 100,          // 分页总条数
      dialogSupplierVisible: false,
      currentRow: '',   // 表格选中的值

      dataList: [{
        subjectValue: 134123124,
        name: '甜程对公账号',
        cardNumber: '123 3212 123 123',
        openingBank: '建行',
        openingPeople: '旧故里'
      },{
        subjectValue: 134123124,
        name: '甜程对公账号',
        cardNumber: '123 3212 123 123',
        openingBank: '建行',
        openingPeople: '旧故里'
      },{
        subjectValue: 134123124,
        name: '甜程对公账号',
        cardNumber: '123 3212 123 123',
        openingBank: '建行',
        openingPeople: '旧故里'
      },{
        subjectValue: 134123124,
        name: '甜程对公账号',
        cardNumber: '123 3212 123 123',
        openingBank: '建行',
        openingPeople: '旧故里'
      }],
      handleForm: {
        id: '',
        subjectValue: '',
        name: '',
        cardNumber: '',
        openingBank: '',
        openingPeople: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', message: '字数超过限制' }
        ],
        cardNumber: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', message: '字数超过限制' }
        ],
        openingBank: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 80, message: '长度在 0 到 40 个字符', message: '字数超过限制' }
        ],
        openingPeople: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', message: '字数超过限制' }
        ]
      }
    }
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7'
      } else {
        return ''
      }
    },
    // 编辑弹窗
    handleEdit() {
      this.handleForm.subjectValue = this.currentRow.subjectValue;
      this.handleForm.name = this.currentRow.name;
      this.handleForm.cardNumber = this.currentRow.cardNumber;
      this.handleForm.openingBank = this.currentRow.openingBank;
      this.handleForm.openingPeople = this.currentRow.openingPeople;
      this.dialogSupplierVisible = true;
    },
    // 保存
    handleSave() {
      this.$refs['Form'].validate(valid => {
        if(valid) {
          
        }
      })
    },
    handleChange(val) {
      if (val) this.currentRow = val;
    },
    pagesizes() {

    },
    handleCurrentChange() {

    }
  }
}
</script>

<style scoped>
.payingBankAccount>>>.el-form-item__error {
  margin-left: 15px;
}
.button {
  width: 90px;
}
.table-class {
  text-align: center;
  margin-top: 20px;
  width: 900px;
}
.item_input {
  width: 250px;
  margin-left: 15px;
}
.dialog-footer {
  text-align: center;
}
.pages {
  width: 900px;
  margin-top: 50px;
}
.page {
  float: right;
}
</style>
