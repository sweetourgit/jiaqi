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
      <el-button type="primary" v-if="tid <= 0" disabled>编辑</el-button>
      <el-button type="primary" v-else @click="edit_info" >编辑</el-button>
      <el-button type="danger"  v-if="tid <= 0" disabled @click="open7" plain>删除</el-button>
      <el-button type="danger" v-else @click="open7" plain>删除</el-button>
    </div>
    <!--end-->
    <!--商户信息-->
    <div class="info_table">
      <el-table
        :data="tableData"
        border
        style="width: 82%"
        :highlight-current-row="true"
        @row-click="handleClick"
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
          prop="localCompType"
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
          prop="linker"
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
          prop="settlementType"
          label="结算方式"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="quota"
          label="额度"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="arrears"
          label="剩余额度"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="总欠款"
          width="120"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <!--end-->
    <!--分页-->
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage4"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
    </el-pagination>
    </div>
    <!--end-->
    <!--弹窗-->
    <el-dialog title="商户信息" :visible.sync="dialogFormVisible" :show-close="false">
      <div style="height: 600px; width: 900px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <div class="saf" style="float: left">
          <el-form-item label="名称" prop="name">
            <el-input  v-model="ruleForm.name" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="localCompType" >
            <el-select v-model="ruleForm.localCompType" placeholder="请选择类型" style="width: 250px;">
              <el-option label="门店" value="0"></el-option>
              <el-option label="同业" value="1"></el-option>
              <el-option label="翻盘门店" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="ruleForm.state">
              <el-radio label="停用"></el-radio>
              <el-radio label="正常"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动时间" required>
              <el-form-item prop="expTime">
                <el-date-picker type="date" placeholder="选择日期" value-format="yyyyMMdd" format="yyyy-MM-dd" v-model="ruleForm.expTime" style="width: 250px;"></el-date-picker>
              </el-form-item>
          </el-form-item>
          <el-form-item label="结算方式" prop="settlementType">
            <el-radio-group v-model="ruleForm.settlementType">
              <el-radio label="月结"></el-radio>
              <el-radio label="非月结"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  v-if="ruleForm.settlementType == '月结'" label="额度" prop="quota" >
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
              <el-option label="门店" value="0"></el-option>
              <el-option label="同业" value="1"></el-option>
              <el-option label="翻盘门店" value="2"></el-option>
            </el-select>
            </el-form-item>
          </div>
         <div class="ty" style="float: left; margin-left: 100px">
          <el-form-item label="地址">
            <el-input  v-model="ruleForm.address" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="linker">
            <el-input  v-model="ruleForm.linker" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="phone">
            <el-input  v-model="ruleForm.phone" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="对公户名" prop="publicName">
            <el-input  v-model="ruleForm.publicName" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="bankName">
            <el-input  v-model="ruleForm.bankName" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="对公账号" prop="bankcardNo">
            <el-input  v-model="ruleForm.bankcardNo" style="width: 250px;"></el-input>
          </el-form-item>
       </div>
          <div class="rrr" style="float: left;" >
            <el-form-item label="经营范围" prop="scopeExt">
            <el-checkbox-group v-model="ruleForm.scopeExt" >
              <el-checkbox label="出境" name="scopeExt"></el-checkbox>
              <el-checkbox label="入境" name="scopeExt"></el-checkbox>
              <el-checkbox label="国内" name="scopeExt"></el-checkbox>
              <el-checkbox label="赴台游" name="scopeExt"></el-checkbox>
              <el-checkbox label="住宿" name="scopeExt"></el-checkbox>
              <el-checkbox label="票务" name="scopeExt"></el-checkbox>
              <el-checkbox label="邮轮" name="scopeExt"></el-checkbox>
              <el-checkbox label="汽车租赁" name="scopeExt"></el-checkbox>
              <el-checkbox label="保险" name="scopeExt"></el-checkbox>
              <el-checkbox label="其他" name="scopeExt"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          </div>
        </el-form>
        <div class="ButtonCls">
          <el-button type="primary" v-if="tid==0" @click="submitForm('ruleForm')">确定</el-button>
          <el-button type="primary" v-else @click="editorForm('ruleForm')">修改</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--end-->
  </div>
</template>

<script>
    import state from "../../../store/state";

    export default {
        name: "merchantInfo",
        data() {
          return {
            tid:0,
            pagesize:10,
            total:1,
            currentPage4: 4,
            ruleForm: {
              name: '',
              localCompType: '',
              state:'',
              expTime: '',
              settlementType:'',
              quota:'',
              department:'',
              people:'',
              scopeExt: [],
              address:'',
              linker:'',
              phone:'',
              publicName:'',
              bankName:'',
              bankcardNo:''
            },
            rules: {
              name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                { max: 40, message: '不要超过40个字符', trigger: 'blur' }
              ],
              localCompType: [
                { required: true, message: '请选择类型', trigger: 'change' }
              ],
              state: [
                { required: true, message: '请选择状态', trigger: 'change' }
              ],
              expTime: [
                { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
              ],
              settlementType: [
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
              scopeExt: [
                { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
              ],
              linker: [
                { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                { max: 4, message: '不要超过4个字符', trigger: 'blur' }
              ],
              phone: [
                { required: true, message: '请输入联系人电话', trigger: 'blur' },
                { min: 11,max: 11, message: '请输入11位数字', trigger: 'blur' },
                { pattern: /(^[\-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' }
              ],
              publicName: [
                { required: true, message: '请输入对公户名', trigger: 'blur' },
                { max: 40, message: '不要超过40个字符', trigger: 'blur' }
              ],
              bankName: [
                { required: true, message: '请输入开户行', trigger: 'blur' },
                { max: 80, message: '不要超过80个字符', trigger: 'blur' }
              ],
              bankcardNo: [
                { required: true, message: '请输入对公账户', trigger: 'blur' },
                { max: 30, message: '不要超过30个字符', trigger: 'blur' }
              ],
            },
            dialogFormVisible:false,
            input: '',
            tableData: []
          }
        },
      methods:{
        handleSizeChange(val) {
          this.pagesize = val
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/localcomp/api/page",
            {
              "pageIndex": 1,
              "pageSize": val,
              "total": 0,
              "object": {
              }
            },
          )
            .then(function (obj) {
              that.total= obj.data.total;
              that.tableData = obj.data.objects;
              that.tableData.forEach(function (v,k,arr) {
                arr[k]['department'] = 'XXX';
                arr[k]['manager'] = '阳阳';
                if(arr[k]['state'] == 0){
                  arr[k]['state'] = '正常'
                }else{
                  arr[k]['state'] = '停用'
                }
                if(arr[k]['localCompType'] == 0){
                  arr[k]['localCompType']='门店';
                }else if (arr[k]['localCompType'] == 1) {
                  arr[k]['localCompType']='同业';
                }else {
                  arr[k]['localCompType']='翻盘门店';
                }
                if(arr[k]['settlementType'] == 0 ){
                  arr[k]['settlementType'] = '非月结'
                }else{
                  arr[k]['settlementType'] = '月结'
                }
              })
              console.log(obj.data.total)
            })
            .catch(function (obj) {
              console.log(obj)
            })
        },
        handleCurrentChange(val) {
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/localcomp/api/page",
            {
              "pageIndex": val,
              "pageSize": this.pagesize,
              "total": 0,
              "object": {
              }
            },
          )
            .then(function (obj) {
              that.total= obj.data.total;
              that.tableData = obj.data.objects;
              that.tableData.forEach(function (v,k,arr) {
                arr[k]['department'] = 'XXX';
                arr[k]['manager'] = '阳阳';
                if(arr[k]['state'] == 0){
                  arr[k]['state'] = '正常'
                }else{
                  arr[k]['state'] = '停用'
                }
                if(arr[k]['localCompType'] == 0){
                  arr[k]['localCompType']='门店';
                }else if (arr[k]['localCompType'] == 1) {
                  arr[k]['localCompType']='同业';
                }else {
                  arr[k]['localCompType']='翻盘门店';
                }
                if(arr[k]['settlementType'] == 0 ){
                  arr[k]['settlementType'] = '非月结'
                }else{
                  arr[k]['settlementType'] = '月结'
                }
              })
              console.log(obj.data.total)
            })
            .catch(function (obj) {
              console.log(obj)
            })
          console.log(`当前页: ${val}`);
        },
        add_info(){
          this.tid = 0
           this.clear();
          this.dialogFormVisible = true;
          },
        edit_info(){
          this.getOneMess()
          this.dialogFormVisible = true;

        },
        //提交
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.addMerchan()
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
          this.ruleForm = {
            name: '',
            localCompType: '',
            state:'',
            expTime: '',
            settlementType:'',
            quota:'',
            department:'',
            people:'',
            scopeExt: [],
            address:'',
            linker:'',
            phone:'',
            publicName:'',
            bankName:'',
            bankcardNo:''
          }
          this.$refs['ruleForm'].resetFields()
          this.dialogFormVisible = false;
        },
        editorForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editMerchan()
          this.tid = 0
          this.dialogFormVisible = false;
        } else {
          console.log('error submit!!');
          console.log(this.ruleForm);
          return false;
        }
      });

    },
       //列表
        list(){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/localcomp/api/page",
            {
              "pageIndex": 1,
              "pageSize": this.pagesize,
              "object": {
              }
            },
          )
            .then(function (obj) {
              console.log(obj);
              that.total= obj.data.total;
              that.tableData = obj.data.objects;
              that.tableData.forEach(function (v,k,arr) {
                arr[k]['department'] = 'XXX';
                arr[k]['manager'] = '阳阳';
                if(arr[k]['state'] == 0){
                  arr[k]['state'] = '正常'
                }else{
                  arr[k]['state'] = '停用'
                }
                if(arr[k]['localCompType'] == 0){
                  arr[k]['localCompType']='门店';
                }else if (arr[k]['localCompType'] == 1) {
                  arr[k]['localCompType']='同业';
                }else {
                  arr[k]['localCompType']='翻盘门店';
                }
                if(arr[k]['settlementType'] == 0 ){
                  arr[k]['settlementType'] = '非月结'
                }else{
                  arr[k]['settlementType'] = '月结'
                }
              })
              console.log(obj.data.total)
            })
            .catch(function (obj) {
              console.log(obj)
            })
        },
        //添加
        addMerchan(){
          if(this.ruleForm.state == '停用'){
            this.ruleForm.state = 1;
          }else{
            this.ruleForm.state = 0;
          }
          if(this.ruleForm.settlementType == "非月结"){
            this.ruleForm.settlementType = 0
          }else{
            this.ruleForm.settlementType = 1
          }
          if(this.ruleForm.settlementType == 0){
            this.ruleForm.quota = 0
          }
          this.ruleForm.scopeExt = this.ruleForm.scopeExt.join(',')
          /*let name = [];
          this.ruleForm.scopeExt.forEach(item => {
            name.push(item);
          })
          this.ruleForm.scopeExt['name'] = [];
          this.ruleForm.scopeExt.name = name;*/
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/localcomp/api/insert",
            {
              "object": this.ruleForm
            },
          )
            .then(function (obj) {
              that.list()

            })
            .catch(function (obj) {
              console.log(obj)
            })
        },
        //修改
        editMerchan(){
          if(this.ruleForm.state == '停用'){
            this.ruleForm.state = 1;
          }else{
            this.ruleForm.state = 0;
          }
          if(this.ruleForm.settlementType == "非月结"){
            this.ruleForm.settlementType = 0
          }else{
            this.ruleForm.settlementType = 1
          }
          if(this.ruleForm.settlementType == 0){
            this.ruleForm.quota = 0
          }
          this.ruleForm.scopeExt = this.ruleForm.scopeExt.join(',')
          if(this.ruleForm.expTime.indexOf("-") > 0){
            let year = "";
            let month = "";
            let day = "";
            let pin = ""
            year = this.ruleForm.expTime.substring(0,4);
            month = this.ruleForm.expTime.substring(5,7);
            day = this.ruleForm.expTime.substring(8,10);
            pin = year+month+day
            this.ruleForm.expTime = pin
          }
          this.ruleForm.id = this.tid
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/localcomp/api/save",
            {
              "object": this.ruleForm
            },
          )
            .then(function (obj) {
              that.list()
            })
            .catch(function (obj) {
              console.log(obj)
            })
          console.log(this.ruleForm);

        },
        clear(){
          this.ruleForm = {
                      name: '',
                      localCompType: '',
                      state:'',
                      expTime: '',
                      settlementType:'',
                      quota:'',
                      department:'',
                      people:'',
                      scopeExt: [],
                      address:'',
                      linker:'',
                      phone:'',
                      publicName:'',
                      bankName:'',
                      bankcardNo:''
                    }
                    if (this.$refs['ruleForm'] !== undefined) {
                      this.$refs['ruleForm'].resetFields()
                    }
        },
        //获取一条信心
        getOneMess(){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/localcomp/api/get",
            {
              "id": this.tid
            },
          )
            .then(function (obj) {
                that.ruleForm.name = obj.data.object.name
                that.ruleForm.localCompType = String(obj.data.object.localCompType)
                if(obj.data.object.state == 0){
                  that.ruleForm.state ="正常"
                }else{
                  that.ruleForm.state ="停用"
                }
                let year = '';
                let month = '';
                let day = '';
                let pin = '';
                year = String(obj.data.object.expTime).substring(0,4);
                month = String(obj.data.object.expTime).substring(4,6);
                day = String(obj.data.object.expTime).substring(6,8);
                pin = year+'-'+month+'-'+day
              that.ruleForm.expTime = String(pin);
              if(obj.data.object.settlementType == 0){
                that.ruleForm.settlementType ="非月结"
              }else{
                that.ruleForm.settlementType ="月结"
              }
                that.ruleForm.quota = obj.data.object.quota
              //todo    部门和人员 预留
              that.ruleForm.department = '1'
              that.ruleForm.people = '2'
              that.ruleForm.scopeExt = obj.data.object.scopeExt.split(',')
              that.ruleForm.address = obj.data.object.address
              that.ruleForm.linker = obj.data.object.linker
              that.ruleForm.phone = obj.data.object.phone
              that.ruleForm.publicName = obj.data.object.publicName
              that.ruleForm.bankName = obj.data.object.bankName
              that.ruleForm.bankcardNo = obj.data.object.bankcardNo
            })
            .catch(function (obj) {
              console.log(obj)
            })
        },
        //删除
        rowDelete(){
          var that = this
          this.$http.post(
            this.GLOBAL.serverSrc + "/universal/localcomp/api/delete",
              {
                "id": this.tid
              }
          )
            .then(function (obj) {

            })
            .catch(function (obj) {
              console.log(obj)
            })
        },
        //删除弹框
        open7() {
          this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.rowDelete();
            this.list();
            this.tid = 0
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        handleClick(row, event, column){
           this.tid = row.id
        }
      },
      created(){
        this.list();
      }

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
    float:left;

    margin-left: 315px;
  }
  .el-checkbox+.el-checkbox{
    margin-left: 10px;
  }
  .block{
    float: right;
    margin-top: 50px;
    margin-bottom: 50px;
  }
</style>
