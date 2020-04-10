<template>
  <!-- 关于ruleForm 每个子组件都需要通过父组件传参定义 考虑是否用vuex来定义 -->
  <!-- 但是每个子组件的data定义的字段又不一样 故还是用父子组件传参来实现 -->
  <!-- 这里需要改 -->
  <div label="" label-width="30px" label-height="auto" style="margin-top: -21px;" v-if="dialogVisibleInvoice">
    <el-button style="margin: 5px 0 10px 0;" @click="handleEdit" type="primary">添加</el-button>
    <!-- 发票表格 -->
    <!-- 这里需要改 -->
    <el-table :data="ruleForm.invoiceList" border style="width: 100%;">
      <el-table-column label="发票类型" width="120" align="center">
        <template slot-scope="scope">
          <!-- 这里需要改 -->
          <el-form-item :prop="'invoiceList.' + scope.$index + '.invoiceID'" :rules="rules.invoiceID">
            <el-select v-model="scope.row.invoiceID" placeholder="请选择">
              <!-- 这里需要改 -->
              <el-option v-for="item in invoiceTypeData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="个人/单位" width="120" align="center">
        <template slot-scope="scope">
          <el-form-item :prop="'invoiceList.' + scope.$index + '.invoiceType'" :rules="rules.invoiceType">
            <el-select v-model="scope.row.invoiceType" placeholder="请选择">
              <el-option key="个人" label="个人" value="1">
              </el-option>
              <el-option key="单位" label="单位" value="2">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="纳税人识别号" align="center" width="200">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-model="scope.row.taxesNumber" required placeholder="纳税人识别号"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="发票抬头" align="center" width="200">
        <template slot-scope="scope">
          <el-form-item :prop="'invoiceList.' + scope.$index + '.titleOrMobile'" :rules="rules.titleOrMobile">
            <el-input v-model="scope.row.titleOrMobile" placeholder="发票抬头"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="发票项目" width="150" align="center">
        <template slot-scope="scope">
          <el-form-item :prop="'invoiceList.' + scope.$index + '.invoiceItem'" :rules="rules.invoiceItem">
            <el-select v-model="scope.row.invoiceItem" placeholder="发票项目">
              <el-option v-for="item in invoiceProject" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" width="120">
        <template slot-scope="scope">
          <el-form-item :prop="'invoiceList.' + scope.$index + '.invoicemoney'" :rules="rules.invoicemoney">
            <el-input v-model="scope.row.invoicemoney" placeholder="金额"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="帐号" align="center" width="220">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-model="scope.row.account" placeholder="帐号"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="开户行" align="center" width="220">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-model="scope.row.bank" placeholder="开户行"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" width="220">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-model="scope.row.address" placeholder="地址"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" width="150">
        <template slot-scope="scope">
          <el-form-item :prop="'invoiceList.' + scope.$index + '.mobile'" :rules="rules.mobile">
            <el-input v-model="scope.row.mobile" placeholder="电话"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- 这里需要改 -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <br />
          <!-- <el-button style="margin-top: 5px;" size="mini" type="primary" v-if="invoiceListCount==scope.$index" @click="handleEdit(scope.$index, scope.row)">添加</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 发票表格 END -->
  </div>
</template>

<script>
  export default {
    props: ['ruleForm','dialogVisibleInvoice','rules','invoiceTypeData','invoiceProject'],
    methods: {
      // 发票模块添加事件
      handleEdit(index, row) {
        this.ruleForm.invoiceList.push({})
      },
      handleDelete(index,row) {
        this.ruleForm.invoiceList.splice(index, 1)
        if (this.ruleForm.invoiceList.length == 0) {
          this.ruleForm.invoiceList.push({})
        }
      }
    }
  }
</script>

<style>
</style>
