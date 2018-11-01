<template>
  <div>
    <!-- 搜索 -->
    <div>
      <el-form>
        <el-form-item>
          <div class="top">
            <span>名称</span>
            <el-input placeholder="输入供应商信息" v-model="supplier.search" class="supplier_search"></el-input>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 导航按钮 -->
    <div style="text-align:left">
      <!-- <div class="body"> -->
        <el-button plain @click="add_supplierInfo = true">添加</el-button>
        <el-button plain>编辑</el-button>
        <el-button plain @click="contact = true">联系人</el-button>
        <el-button plain @click="bankAccount = true">银行账号</el-button>
        <el-button plain @click="attachment = true">附件</el-button>
        <el-button plain>关联销售</el-button>
        <el-button plain style="border:1px solid red;color:#FE1312">删除</el-button>
      <!-- </div> -->
    </div>
    <!-- 表格 -->
    <div style="margin-top:22px;">
      <el-table :data="tableData" border :header-cell-style="getRowClass" style="width:1497px">
        <el-table-column prop="id" label="ID" width="110" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" width="106" align="center"></el-table-column>
        <el-table-column prop="dueDate" label="到期日期" width="138" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" width="152" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="178" align="center"></el-table-column>
        <el-table-column prop="productDirection" label="产品方向" width="126" align="center"></el-table-column>
        <el-table-column prop="borrowing" label="借款方式" width="116" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" width="214" align="center"></el-table-column>
        <el-table-column prop="area" label="区域" width="66" align="center"></el-table-column>
        <el-table-column prop="legalPerson" label="法人" width="92" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="124" align="center"></el-table-column>
        <el-table-column prop="note" label="备注" width="74" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 联系人信息列表弹框 -->
    <el-dialog title="联系人信息" :visible.sync="contact" width="640px" custom-class="city_list" :show-close='false'>
      <el-button plain class="close" @click="contact_close">关闭</el-button>
      <div style="text-align:left;margin-left:20px;">
        <el-button plain @click="add_contact = true">添加</el-button>
        <el-button plain>编辑</el-button>
        <el-button plain style="border:1px solid red;color:#FE1312">删除</el-button>
      </div>
      <div class="bankAccount_data">
        <el-table :data="contactData" border :header-cell-style="getRowClass" style="width:549px">
          <el-table-column prop="name" label="姓名" width="110" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机" width="152" align="center"></el-table-column>
          <el-table-column prop="weChat" label="微信" width="140" align="center"></el-table-column>
          <el-table-column prop="qq" label="QQ" width="146" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 添加联系人弹框 -->
    <el-dialog title="联系人" :visible.sync="add_contact" width="440px" center custom-class="city_list">
      <el-form :model="addContact" :rules="rules" ref="addContact" class="contact_form">
        <el-form-item label="姓名" :label-width="Width" prop="contactName" class="addContact_span">
          <el-input v-model="addContact.contactName" auto-complete="off" class="addContact_name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="Width" prop="contactPhone" class="addContact_span">
          <el-input v-model="addContact.contactPhone" auto-complete="off" class="addContact_phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="微信" :label-width="Width" prop="weChat" class="addContact_span2">
          <el-input v-model="addContact.weChat" auto-complete="off" class="addContact_weChat" placeholder="请输入微信号"></el-input>
        </el-form-item>
        <el-form-item label="QQ" :label-width="Width" prop="qq" class="addContact_span1">
          <el-input v-model="addContact.qq" auto-complete="off" class="addContact_qq" placeholder="请输入QQ号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="add_contactCancel('addContact')">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 银行账列表弹框 -->
    <el-dialog title="银行账号信息" :visible.sync="bankAccount" width="640px" custom-class="city_list" :show-close='false'>
      <el-button plain class="close" @click="bankAccount_close">关闭</el-button>
      <div style="text-align:left;margin-left:20px;">
        <el-button plain @click="add_bankAccount = true">添加</el-button>
        <el-button plain>编辑</el-button>
        <el-button plain style="border:1px solid red;color:#FE1312">删除</el-button>
      </div>
      <div class="bankAccount_data">
        <el-table :data="bankData" border :header-cell-style="getRowClass" style="width:497px">
          <el-table-column prop="cardNumber" label="卡号" width="206" align="center"></el-table-column>
          <el-table-column prop="bank" label="银行" width="152" align="center"></el-table-column>
          <el-table-column prop="note" label="备注" width="138" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 添加银行账号弹框 -->
    <el-dialog title="银行账号" :visible.sync="add_bankAccount" width="440px" center custom-class="city_list">
      <el-form :model="addBankAccount" :rules="rules" ref="addBankAccount" class="bankAccount_form">
        <el-form-item label="卡号" :label-width="Width" prop="cardNumber" class="addContact_span">
          <el-input v-model="addBankAccount.cardNumber" auto-complete="off" class="addContact_name" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="银行" :label-width="Width" prop="bank" class="addContact_span">
          <el-input v-model="addBankAccount.bank" auto-complete="off" class="addContact_name" placeholder="请输入银行名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" class="bankAccount_span" prop="note">
          <el-input type="textarea" v-model="addBankAccount.note" auto-complete="off" class="addBankAccount_textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addBankAccountCancel('addBankAccount')">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 供应商信息添加弹框 -->
    <el-dialog title="供应商信息" :visible.sync="add_supplierInfo" width="900px" custom-class="city_list" :show-close='false'>
      <el-form :model="addSupplierInfo" :label-position="labelPosition" label-width="80px" :rules="rules" ref="addSupplierInfo">
        <div class="supplierInfo_left">
          <el-form-item label="名称" :label-width="Width" prop="name" class="addContact_span">
            <el-input v-model="addSupplierInfo.name" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="Width" prop="address" class="addContact_span">
            <el-input v-model="addSupplierInfo.address" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="负责人" :label-width="Width" prop="head" class="addContact_span">
            <el-input v-model="addSupplierInfo.head" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入负责人"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="Width" prop="phone" class="addContact_span">
            <el-input v-model="addSupplierInfo.phone" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="区域" :label-width="Width" prop="area" class="addContact_span">
            <el-input v-model="addSupplierInfo.area" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入区域"></el-input>
          </el-form-item>
          <el-form-item label="产品方向" :label-width="Width" prop="productDirection" class="addContact_span">
            <el-input v-model="addSupplierInfo.productDirection" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入产品方向"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state" class="addContact_span">
            <el-radio-group v-model="addSupplierInfo.state" class="addSupplierInfo_state">
              <el-radio label="1" value="1">停用</el-radio>
              <el-radio label="2" value="2">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="supplierInfo_right">
          <el-form-item label="类型" prop="type">
            <el-select v-model="addSupplierInfo.type" placeholder="请选择类型" class="addSupplierInfo_name">
              <el-option label="签证，机票" value="qianzheng"></el-option>
              <el-option label="地接" value="dijie"></el-option>
              <el-option label="订车" value="dingche"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="到期时间" prop="dueTime">
              <el-date-picker v-model="addSupplierInfo.dueTime" type="datetime" placeholder="选择到期时间" class="addSupplierInfo_name"></el-date-picker>
          </el-form-item>
          <el-form-item label="结算方式" prop="clearingForm">
            <el-select v-model="addSupplierInfo.clearingForm" placeholder="请选择结算方式" class="addSupplierInfo_name">
              <el-option label="现金" value="xianjian"></el-option>
              <el-option label="微信" value="weixin"></el-option>
              <el-option label="支付宝" value="zhifubao"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input type="textarea" v-model="addSupplierInfo.note" auto-complete="off" class="addSupplierInfo_textarea" :autosize="{ minRows: 10, maxRows: 15}"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="addSupplierInfo_btn">
        <el-button @click="addSupplierInfoCancel('addSupplierInfo')">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible('addSupplierInfo')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 附件弹框 -->
    <el-dialog title="银行账号信息" :visible.sync="attachment" width="660px" custom-class="city_list" :show-close='false'>
      <el-button plain class="close" @click="attachment_close">关闭</el-button>
      <div style="text-align:left;margin-left:20px;">
        <div class="attachment_btn">
          <el-button plain>下载</el-button>
          <el-button plain style="border:1px solid red;color:#FE1312">删除</el-button>
        </div>
        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture" accept=".jpg,.png,.gif,.txt,.doc,.hlp,.wps,.html,.pdf">
          <el-button plain>添加</el-button>
        </el-upload>

      </div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 添加联系人
      Width: '',
      add_contact: false,
      addContact:{
        contactName: '',
        contactPhone: '',
        weChat: '',
        qq: '',
      },
      // 联系人信息列表
      contact: false,
      // 银行账号信息列表
      bankAccount: false,
      // 添加银行账号
      add_bankAccount: false,
      addBankAccount: {
        cardNumber: '',
        bank: '',
        note: ''
      },
      // 搜索
      supplier: {
        search: ""
      },
      // 供应商信息添加
      add_supplierInfo: false,
      addSupplierInfo: {
        name: '',
        address: '',
        head: '',
        phone: '',
        area: '',
        productDirection: '',
        state: '1',
        type: '',
        dueTime: '',
        clearingForm: '',
        note: ''
      },
      // 附件
      attachment: false,
      labelPosition: 'right',
      //上传文件
      fileList: [],
      // 验证规则
      rules: {
        contactName: [{ required: true, message: '不能为空', trigger: 'blur' },
                      { pattern: /^[\u4e00-\u9fa5a-zA-Z]{0,4}$/,message:'请输入4个字以内的中文或英文名称'}],
        contactPhone: [{ required: true, message: '不能为空', trigger: 'blur' },
                       { pattern: /^1(3|4|5|7|8)\d{9}$/,message:'请输入11位正确的手机号码' }],
        cardNumber: [{ required: true, message: '不能为空', trigger: 'blur' },
                     { pattern: /^[0-9]{0,20}$/,message:'请输入20个数字以内的正确卡号' }],
        bank: [{ required: true, message: '不能为空', trigger: 'blur' },
               { pattern: /^[\u4e00-\u9fa5]{0,10}$/,message:'请输入10个汉字以内银行名称' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' },
               { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{0,40}$/,message:'请输入40字以内的正确名称,含汉字、字母和数字' }],
        address: [{ required: true, message: '不能为空', trigger: 'blur' },
                  { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{0,80}$/,message:'请输入80字以内正确地址，含汉字、字母、数字下划线' }],
        head: [{ required: true, message: '不能为空', trigger: 'blur' },
               { pattern: /^[\u4e00-\u9fa5a-zA-Z]{0,4}$/,message:'请输入4个字以内的中文或英文' }],
        phone: [{ required: true, message: '不能为空', trigger: 'blur' },
                { pattern: /^1(3|4|5|7|8)\d{9}$/,message:'请输入11位正确的手机号码' }],
        area: [{ required: true, message: '不能为空', trigger: 'blur' }],
        productDirection: [{ required: true, message: '不能为空', trigger: 'blur' }],
        state: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dueTime: [{ required: true, message: '不能为空', trigger: 'blur' }],
        clearingForm: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      // 表格数据
      tableData: [{
        id: '1',
        state: '停用',
        dueDate: '2018-08-06',
        name: '国旅',
        type: '签证，机票',
        productDirection: 'xxx',
        borrowing: '月结',
        address: '北京市东城区东直门南大街5号中青旅大厦一层',
        area: 'xx',
        legalPerson: '阳阳',
        phone: '13888888888',
        note: 'xx'
      },{
        id: '2',
        state: '正常',
        dueDate: '2018-08-06',
        name: '青旅',
        type: '地接',
        productDirection: 'xxx',
        borrowing: '非月结',
        address: '北京市海淀区远大路一号金源燕莎MALL,E15口1018k',
        area: 'xx',
        legalPerson: '阳阳',
        phone: '13888888888',
        note: 'xx'
      },{
        id: '3',
        state: '正常',
        dueDate: '2018-08-06',
        name: 'x旅',
        type: '订车',
        productDirection: 'xxx',
        borrowing: '月结',
        address: '北京市海淀区北大中关园501楼首层底商中段（中关村—桥往北500米路东）',
        area: 'xx',
        legalPerson: '阳阳',
        phone: '13888888888',
        note: 'xx'
      }],
      // 银行账号信息表格数据
      bankData: [{
        cardNumber: '1345 1234 1234 1234',
        bank: '建行',
        note: '对公账号'
      },{
        cardNumber: '1345 1234 1234 1234',
        bank: '建行',
        note: '对公账号'
      }],
      // 联系人信息列表数据
      contactData: [{
        name: '阳阳',
        phone: '13888888888',
        weChat: '13888888888',
        qq: '13888888888'
      },{
        name: '阳阳',
        phone: '13888888888',
        weChat: '13888888888',
        qq: '13888888888'
      }]
    }
  },
  methods:{
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F7F7F7'
      } else {
        return ''
      }
    },
    // 联系人弹框取消
    add_contactCancel(a){
      this.add_contact = false;
      this.$refs[a].resetFields();
    },
    // 联系人信息表格关闭
    contact_close(){
      this.contact = false;
    },
    // 银行账号信息表格关闭
    bankAccount_close(){
      this.bankAccount = false;
    },
    // 添加银行账号弹框取消
    addBankAccountCancel(a){
      this.add_bankAccount = false;
      this.$refs[a].resetFields();
    },
    // 供应商信息添加弹框取消
    addSupplierInfoCancel(a){
      this.add_supplierInfo = false;
      this.$refs[a].resetFields();
    },
    // 附件弹框关闭
    attachment_close(){
      this.attachment = false;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 供应商信息添加
    centerDialogVisible(addSupplierInfo){
      this.$refs[addSupplierInfo].validate((valid) => {
        if (valid) {
          this.$message.success("添加成功");
          this.add_supplierInfo= false;
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style scoped lang='stylus'>
  .top{ float:left; }
  .supplier_search{ width:200px; margin-left:16px; }
  .body{ float:left; }
  .addContact_name,.addContact_phone,.addContact_weChat,.addContact_qq{ width:200px; }
  .addContact_span{ margin-left:15px; }
  .addContact_span1{ margin-left:30px; }
  .addContact_span2{ margin-left:25px; }
  .bankAccount_data{ margin-top:20px; margin-left:20px; margin-bottom:70px;}
  .close{ position:absolute; margin-left:212px; margin-top:-77px; width:100px; height:40px; }
  .addBankAccount_textarea{ width:200px; }
  .addSupplierInfo_name{ width:200px; float:left; }
  .addSupplierInfo_state{ float:left; margin-top:14px; margin-left:20px; }
  .supplierInfo_left{ width:410px; }
  .supplierInfo_right{ width:295px; float:right; margin-top:-436px; margin-right:60px; }
  .addSupplierInfo_textarea{ width:200px; margin-right:14px; }
  .addSupplierInfo_btn{ position:absolute; margin-left:709px; margin-top:-551px; }
  .attachment_btn{ position:absolute; margin-left:82px; }
  .upload-demo>>>.el-upload-list--picture .el-upload-list__item{ width:141px; display: inline-block; margin: 10px 4px 0 0px; }
  .upload-demo>>>.el-upload-list--picture .el-upload-list__item-thumbnail{ width:110px; height:80px; }
  .bankAccount_form>>>.el-form-item__error{ left: 49px; }
  .contact_form>>>.el-form-item__error{ left: 49px; }
  .bankAccount_span{ margin-left:24px; }
</style>
