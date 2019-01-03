<template>
  <div>
    <!--搜索heard-->
    <div>
      <div class="search">
        搜索
        <el-input v-model="input" placeholder="请输入商户名称" class="search_input"></el-input>
      </div>
    </div>
    <!--end-->
    <!--功能button-->
    <div class="button_style">
      <el-button type="primary" @click="add_info">添加</el-button>
      <el-button type="primary"  >编辑</el-button>
      <el-button type="danger" plain>删除</el-button>
    </div>
    <!--end-->
    <!--商户信息-->
    <div class="info_table">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        highlight-current-row = true;
      >
        <el-table-column
          prop="id"
          label="ID"
          width="50"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          align="center"
          >
          <template slot-scope="scope">
            <template v-if="scope.row.state == '停用'">
              <div style="color: red" >{{scope.row.state}}</div>
            </template>
            <template v-else>
              <div>{{scope.row.state}}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="商户类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="people"
          label="联系人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="department"
          label="所属部门"
          align="center">
        </el-table-column>
        <el-table-column
          prop="manager"
          label="区域经理"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="settlement"
          label="结算方式"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="额度"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="剩余额度"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="total"
          label="总欠款"
          width="150"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <!--end-->
    <!--弹窗-->
    <el-dialog title="商户信息" :visible.sync="dialogFormVisible" :show-close="false">
      <div class="ButtonCls">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </div>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input  v-model="ruleForm.name" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type" >
            <el-select v-model="ruleForm.type" placeholder="请选择类型" style="width: 250px;">
              <el-option label="门店" value="1"></el-option>
              <el-option label="同业" value="2"></el-option>
              <el-option label="翻盘门店" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="ruleForm.state">
              <el-radio label="停用"></el-radio>
              <el-radio label="正常"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动时间" required>
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 250px;""></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item label="结算方式" prop="settlement">
            <el-radio-group v-model="ruleForm.settlement">
              <el-radio label="月结"></el-radio>
              <el-radio label="非月结"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="额度" prop="quota">
            <el-input  v-model="ruleForm.quota" style="width: 250px;"></el-input>
          </el-form-item>
            <el-form-item label="部们-管理" prop="department">
              <el-select v-model="ruleForm.department" placeholder="请选择部门" style="width: 250px;">
                <el-option label="门店" value="1"></el-option>
                <el-option label="同业" value="2"></el-option>
                <el-option label="翻盘门店" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="people" >
            <el-select v-model="ruleForm.people" placeholder="请选择人员" style="width: 250px;">
              <el-option label="门店" value="1"></el-option>
              <el-option label="同业" value="2"></el-option>
              <el-option label="翻盘门店" value="3"></el-option>
            </el-select>
            </el-form-item>
          <el-form-item label="经营范围" prop="range">
            <el-checkbox-group v-model="ruleForm.range">
              <el-checkbox label="出境" name="range"></el-checkbox>
              <el-checkbox label="入境" name="range"></el-checkbox>
              <el-checkbox label="国内" name="range"></el-checkbox>
              <el-checkbox label="赴台游" name="range"></el-checkbox>
              <el-checkbox label="住宿" name="range"></el-checkbox>
              <el-checkbox label="票务" name="range"></el-checkbox>
              <el-checkbox label="邮轮" name="range"></el-checkbox>
              <el-checkbox label="汽车租赁" name="range"></el-checkbox>
              <el-checkbox label="保险" name="range"></el-checkbox>
              <el-checkbox label="其他" name="range"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="地址">
            <el-input  v-model="ruleForm.address" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="lx_name">
            <el-input  v-model="ruleForm.lx_name" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="lx_phone">
            <el-input  v-model="ruleForm.lx_phone" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="对公户名" prop="account">
            <el-input  v-model="ruleForm.account" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="bank">
            <el-input  v-model="ruleForm.bank" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="对公账号" prop="dx_name">
            <el-input  v-model="ruleForm.dx_name" style="width: 250px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
    export default {
        name: "merchantInfo",
        data() {
          return {
            ruleForm: {
              name: '',
              type: '',
              state:'',
              date1: '',
              settlement:'',
              quota:'',
              department:'',
              people:'',
              range: [],
              address:'',
              lx_name:'',
              lx_phone:'',
              account:'',
              bank:'',
              dx_name:''
            },
            rules: {
              name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                { max: 40, message: '不要超过40个字符', trigger: 'blur' }
              ],
              type: [
                { required: true, message: '请选择类型', trigger: 'change' }
              ],
              state: [
                { required: true, message: '请选择状态', trigger: 'change' }
              ],
              date1: [
                { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
              ],
              settlement: [
                { required: true, message: '请选择结算方式', trigger: 'change' }
              ],
              quota: [
                { required: true, message: '请输入额度', trigger: 'blur' },
                { pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入自然数' }
              ],
              department: [
                { required: true, message: '请选择类型', trigger: 'change' }
              ],
              people: [
                { required: true, message: '请选择类型', trigger: 'change' }
              ],
              range: [
                { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
              ],
              resource: [
                { required: true, message: '请选择活动资源', trigger: 'change' }
              ],
              desc: [
                { required: true, message: '请填写活动形式', trigger: 'blur' }
              ],
              lx_name: [
                { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                { max: 4, message: '不要超过4个字符', trigger: 'blur' }
              ],
              lx_phone: [
                { required: true, message: '请输入联系人电话', trigger: 'blur' },
                { min: 11,max: 11, message: '请输入11位数字', trigger: 'blur' },
                { pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' }
              ],
              account: [
                { required: true, message: '请输入对公户名', trigger: 'blur' },
                { max: 40, message: '不要超过40个字符', trigger: 'blur' }
              ],
              bank: [
                { required: true, message: '请输入开户行', trigger: 'blur' },
                { max: 80, message: '不要超过80个字符', trigger: 'blur' }
              ],
              dx_name: [
                { required: true, message: '请输入对公账户', trigger: 'blur' },
                { max: 30, message: '不要超过30个字符', trigger: 'blur' }
              ],
            },
            dialogFormVisible:false,
            input: '',
            tableData: [{
              id: '1',
              state: '停用',
              type: '门店',
              name: '国旅',
              people: '阳阳',
              phone: '13888888888',
              department: 'xxx',
              manager: '阳阳',
              settlement: '月结',
              quota: '30000.00',
              amount: '30000.00',
              total: '0',
            }, {
              id: '2',
              state: '正常',
              type: '同业',
              name: '青旅',
              people: '阳阳',
              phone: '13888888888',
              department: 'xxx',
              manager: '阳阳',
              settlement: '非月结',
              quota: '0',
              amount: '0',
              total: '10000.00',
            },{
              id: '3',
              state: '正常',
              type: '翻盘门店',
              name: 'xx旅',
              people: '阳阳',
              phone: '13888888888',
              department: 'xxx',
              manager: '阳阳',
              settlement: '月结',
              quota: '30000.00',
              amount: '20000.00',
              total: '10000.00',
            }]
          }
        },
      methods:{
        add_info(){
          this.dialogFormVisible = true;
          },
        submitForm(formName) {
          /*this.ruleForm.quota = parseInt(this.ruleForm.quota);*/
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
              this.dialogFormVisible = false;
            } else {
              console.log('error submit!!');
              console.log(this.ruleForm);
              return false;
            }
          });
        },
        resetForm(formName) {
          //this.$refs[formName].resetFields();
          this.dialogFormVisible = false;
        }
      },
     
    }
</script>

<style scoped>
  .search{
  }
  .search_input{
    width: 170px;
    margin-left: 20px;
  }
  .button_style{
    margin-top:10px ;
  }
  .info_table{
    margin-top:20px ;
  }
  .ButtonCls{
    float: right;
    margin-top: -35px;
  }
  .el-checkbox+.el-checkbox{
    margin-left: 10px;
  }
</style>
