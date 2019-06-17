<template>
  <div class="supplierInfo">
    <!-- 搜索 -->
    <el-form>
      <el-form-item class="top">
        <span>名称</span>
        <el-input placeholder="输入供应商信息" v-model="supplier.search" clearable class="supplier_search"></el-input>
      </el-form-item>
    </el-form>
    <!-- 导航按钮 -->
    <div class="button" style="text-align:left; clear:both;">
      <el-button plain @click="add_test">添加</el-button>
      <el-button plain :disabled="forbidden1" @click="test">编辑</el-button>
      <el-button plain :disabled="forbidden1" @click="contactPeoele">联系人</el-button>
      <el-button plain :disabled="forbidden1" @click="contactBank">银行账号</el-button>
      <el-button plain :disabled="forbidden1" @click="attachment = true">附件</el-button>
      <!--<el-button plain>关联销售</el-button>-->
      <el-button plain :disabled="forbidden" @click="deletion(index)" class="delete_button">删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :row-style="rowClass" @row-click="clickRow"@selection-change="changeFun">
      <el-table-column prop="number" fixed label="" type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="id" label="ID" min-width="60" align="center"></el-table-column>
      <el-table-column prop="userState" label="状态" min-width="80" align="center"></el-table-column>
      <el-table-column prop="expireTime" label="到期日期" min-width="150" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" min-width="150" align="center"></el-table-column>
      <el-table-column prop="types1" label="类型" min-width="150" align="center">
      </el-table-column>
      <el-table-column prop="productDirection" label="产品方向" min-width="130" align="center"></el-table-column>
      <el-table-column prop="isMonthly" label="借款方式" min-width="110" align="center"></el-table-column>
      <el-table-column prop="address" label="地址" min-width="220" align="center"></el-table-column>
      <el-table-column prop="destinationID" label="区域" min-width="100" align="center"></el-table-column>
      <el-table-column prop="leader" label="法人" min-width="80" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="120" align="center"></el-table-column>
      <el-table-column prop="memo" label="备注" min-width="80" align="center"></el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination class="paging" :page-sizes="[10,20,30,50]" background @size-change="handleSizeChange" :page-size="pagesize" :current-page.sync="currentPage" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 供应商信息添加弹框 -->
    <el-dialog title="供应商信息" style="position:absolute;" :visible.sync="add_supplierInfo" width="900px" custom-class="city_list" :show-close='false'>
      <div slot="footer" style="position:absolute; top:8px; right:10px;">
        <el-button @click="addSupplierInfoCancel('addSupplierInfo')">取 消</el-button>
        <el-button type="primary" @click="addSupplier">保 存</el-button>
      </div>
      <el-form :model="addSupplierInfo" :label-position="labelPosition" label-width="80px" :rules="rules" ref="addSupplierInfo">
        <div class="supplierInfo_left">
          <el-form-item label="名称" :label-width="Width" prop="name" class="addContact_span">
            <el-input v-model="addSupplierInfo.name" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="Width" prop="address" class="addContact_span">
            <el-input v-model="addSupplierInfo.address" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="负责人" :label-width="Width" prop="leader" class="addContact_span">
            <el-input v-model="addSupplierInfo.leader" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入负责人"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="Width" prop="phone" class="addContact_span">
            <el-input v-model="addSupplierInfo.phone" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="区域" :label-width="Width" prop="destinationID" class="addContact_span">
            <el-input v-model="addSupplierInfo.destinationID" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入区域"></el-input>
          </el-form-item>
          <el-form-item label="产品方向" :label-width="Width" prop="productDirection" class="addContact_span">
            <el-input v-model="addSupplierInfo.productDirection" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入产品方向"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="userState" class="addContact_span">
            <el-radio-group v-model="addSupplierInfo.userState" class="addSupplierInfo_state">
              <el-radio label="0" value="0">停用</el-radio>
              <el-radio label="1" value="1">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="supplierInfo_right">
          <el-form-item label="到期时间" prop="expireTime">
            <el-date-picker v-model="addSupplierInfo.expireTime" type="datetime" placeholder="选择到期时间" style="width:200px;" class="addSupplierInfo_name"></el-date-picker>
          </el-form-item>
          <el-form-item label="结算方式" prop="isMonthly">
            <el-select v-model="addSupplierInfo.isMonthly" placeholder="请选择结算方式" class="addSupplierInfo_name">
              <el-option label="现金" value="0"></el-option>
              <el-option label="微信" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="addSupplierInfo.memo" auto-complete="off" class="addSupplierInfo_textarea" :autosize="{ minRows: 10, maxRows: 15}"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="类型" prop="supplierType" class="addContact_span">
          <el-checkbox-group v-model="addSupplierInfo.supplierType" style="width:700px;">
            <el-checkbox v-for="itemList in companyList" :label="itemList.id" :key="itemList.id">{{itemList.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
    </el-dialog>
    <!-- 供应商信息编辑弹框 -->
    <el-dialog title="供应商信息" :visible.sync="edit_supplierInfo" width="900px" custom-class="city_list" :show-close='false'>
      <div slot="footer" style="position:absolute; top:8px; right:10px;">
        <el-button @click="editSupplierInfoCancel('editSupplierInfo')">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible('editSupplierInfo')">保 存</el-button>
      </div>
      <el-form :model="editSupplierInfo" :label-position="labelPosition" label-width="80px" :rules="rules" ref="editSupplierInfo">
        <div class="supplierInfo_left">
          <el-form-item label="名称" :label-width="Width" prop="name" class="addContact_span">
            <el-input v-model="editSupplierInfo.name" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="Width" prop="address" class="addContact_span">
            <el-input v-model="editSupplierInfo.address" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="负责人" :label-width="Width" prop="leader" class="addContact_span">
            <el-input v-model="editSupplierInfo.leader" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入负责人"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="Width" prop="phone" class="addContact_span">
            <el-input v-model="editSupplierInfo.phone" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="区域" :label-width="Width" prop="destinationID" class="addContact_span">
            <el-input v-model="editSupplierInfo.destinationID" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入区域"></el-input>
          </el-form-item>
          <el-form-item label="产品方向" :label-width="Width" prop="productDirection" class="addContact_span">
            <el-input v-model="editSupplierInfo.productDirection" auto-complete="off" class="addSupplierInfo_name" placeholder="请输入产品方向"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="userState" class="addContact_span">
            <el-radio-group v-model="editSupplierInfo.userState" class="addSupplierInfo_state">
              <el-radio label="0" value="0">停用</el-radio>
              <el-radio label="1" value="1">正常</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="supplierInfo_right">
          <el-form-item label="到期时间" prop="expireTime">
            <el-date-picker v-model="editSupplierInfo.expireTime" type="datetime" placeholder="选择到期时间" style="width:200px;" class="addSupplierInfo_name"></el-date-picker>
          </el-form-item>
          <el-form-item label="结算方式" prop="isMonthly">
            <el-select v-model="editSupplierInfo.isMonthly" placeholder="请选择结算方式" class="addSupplierInfo_name">
              <el-option label="现金" value="0"></el-option>
              <el-option label="微信" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="editSupplierInfo.memo" auto-complete="off" class="addSupplierInfo_textarea" :autosize="{ minRows: 10, maxRows: 15}"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="类型" class="addContact_span" prop="supplierType_edit">
          <el-checkbox-group v-model="editSupplierInfo.supplierType_edit" style="width:700px;">
            <el-checkbox v-for="itemList in companyList" :label="itemList.id" :key="itemList.id">{{itemList.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      
    </el-dialog>
    <!-- 联系人信息列表弹框 -->
    <el-dialog title="联系人信息" :visible.sync="contact" width="690px" custom-class="city_list" :show-close='false'>
      <el-button plain style="position:absolute; right:20px; top:8px;" @click="contact_close">关闭</el-button>
      <div style="text-align:left;margin-left:20px;">
        <el-button plain @click="add_contact = true">添加</el-button>
        <el-button plain :disabled="forbidden2" @click="tests">编辑</el-button>
        <el-button plain :disabled="forbidden3" @click="deleteContact(index)" style="border:1px solid red;color:#FE1312">删除</el-button>
      </div>
      <div class="bankAccount_data">
        <el-table :data="contactData" border ref="contactTable" :header-cell-style="getRowClass" style="width:611px"@row-click="clickContact" @selection-change="changeContact":row-style="rowStyle" >
          <el-table-column prop="number" fixed label="" type="selection" width="50" align="center"></el-table-column>
          <el-table-column prop="id" label="ID" min-width="60" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" width="80" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机" width="140" align="center"></el-table-column>
          <el-table-column prop="weChat" label="微信" width="140" align="center"></el-table-column>
          <el-table-column prop="qq" label="QQ" width="140" align="center"></el-table-column>
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
        <el-button type="primary" @click="addContactPeople">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑联系人弹框 -->
    <el-dialog title="联系人" :visible.sync="edit_contact" width="440px" center custom-class="city_list" >
      <el-form :model="editContact" :rules="rules" ref="editContact" class="contact_form">
        <el-form-item label="姓名" :label-width="Width" prop="contactName" class="addContact_span">
          <el-input v-model="editContact.contactName" auto-complete="off" class="addContact_name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="Width" prop="contactPhone" class="addContact_span">
          <el-input v-model="editContact.contactPhone" auto-complete="off" class="addContact_phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="微信" :label-width="Width" prop="weChat" class="addContact_span2">
          <el-input v-model="editContact.weChat" auto-complete="off" class="addContact_weChat" placeholder="请输入微信号"></el-input>
        </el-form-item>
        <el-form-item label="QQ" :label-width="Width" prop="qq" class="addContact_span1">
          <el-input v-model="editContact.qq" auto-complete="off" class="addContact_qq" placeholder="请输入QQ号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="edit_contactCancel('editContact')">取 消</el-button>
        <el-button type="primary" @click="editContactPeople('editContact')">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 银行账列表弹框 -->
    <el-dialog title="银行账号信息" :visible.sync="bankAccount" width="740px" custom-class="city_list" :show-close='false'>
      <el-button plain  style="position:absolute; right:20px; top:8px;" @click="bankAccount_close">关闭</el-button>
      <div style="text-align:left;margin-left:20px;">
        <el-button plain @click="add_bankAccount = true">添加</el-button>
        <el-button plain :disabled="forbidden4" @click="editBank">编辑</el-button>
        <el-button plain :disabled="forbidden5" @click="deleteBank(index)" style="border:1px solid red;color:#FE1312">删除</el-button>
      </div>
      <div class="bankAccount_data">
        <el-table :data="bankData" border ref="bankTable" :header-cell-style="getRowClass" style="width:661px"@row-click="clickBank" @selection-change="changeBank":row-style="rowStyleBank">
          <el-table-column prop="number" fixed label="" type="selection" width="50" align="center"></el-table-column>
          <el-table-column prop="cardName" label="开户名" width="100" align="center"></el-table-column>
          <el-table-column prop="cardNumber" label="卡号" width="210" align="center"></el-table-column>
          <el-table-column prop="bankName" label="银行" width="160" align="center"></el-table-column>
          <el-table-column prop="memo" label="备注" width="140" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 添加银行账号弹框 -->
    <el-dialog title="银行账号" :visible.sync="add_bankAccount" width="440px" center custom-class="city_list">
      <el-form :model="addBankAccount" label-width="65px" :rules="rules" ref="addBankAccount" class="bankAccount_form">
        <el-form-item label="开户名" :label-width="Width" prop="cardName" class="addContact_span">
          <el-input v-model="addBankAccount.cardName" auto-complete="off" class="addContact_name" placeholder="请输入开户名"></el-input>
        </el-form-item>
        <el-form-item label="卡号" :label-width="Width" prop="cardNumber" class="addContact_span">
          <el-input v-model="addBankAccount.cardNumber" auto-complete="off" class="addContact_name" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="银行" :label-width="Width" prop="bankName" class="addContact_span">
          <el-input v-model="addBankAccount.bankName" auto-complete="off" class="addContact_name" placeholder="请输入银行名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="55px" class="bankAccount_span" prop="memo">
          <el-input type="textarea" v-model="addBankAccount.memo" auto-complete="off" class="addBankAccount_textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addBankAccountCancel('addBankAccount')">取 消</el-button>
        <el-button type="primary" @click="addBank">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑银行账号弹框 -->
    <el-dialog title="银行账号" :visible.sync="edit_bankAccount" width="440px" center custom-class="city_list">
      <el-form :model="editBankAccount" label-width="65px" :rules="rules" ref="editBankAccount" class="bankAccount_form">
        <el-form-item label="开户名" :label-width="Width" prop="cardName" class="addContact_span">
          <el-input v-model="editBankAccount.cardName" auto-complete="off" class="addContact_name" placeholder="请输入开户名"></el-input>
        </el-form-item>
        <el-form-item label="卡号" :label-width="Width" prop="cardNumber" class="addContact_span">
          <el-input v-model="editBankAccount.cardNumber" auto-complete="off" class="addContact_name" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="银行" :label-width="Width" prop="bankName" class="addContact_span">
          <el-input v-model="editBankAccount.bankName" auto-complete="off" class="addContact_name" placeholder="请输入银行名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="55px" class="bankAccount_span" prop="memo">
          <el-input type="textarea" v-model="editBankAccount.memo" auto-complete="off" class="addBankAccount_textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editBankAccountCancel('editBankAccount')">取 消</el-button>
        <el-button type="primary" @click="editBankCancel('editBankAccount')">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 附件弹框 -->
    <el-dialog title="附件" :visible.sync="attachment" width="660px" custom-class="city_list" :show-close='false'>
      <el-button plain style="position:absolute; right:20px; top:8px;" @click="attachment_close">关闭</el-button>
      <div style="text-align:left;margin-left:20px; overflow:hidden; position:relative;">
        <el-upload ref="my-upload" class="upload-demo" action="http://192.168.1.186:3017/universal/supplier/api/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="files" name="files" :headers="aaa" multiple list-type="picture" accept=".jpg,.png,.gif,.txt,.doc,.hlp,.wps,.html,.pdf">
          <el-button plain>添加</el-button>
        </el-upload>
        <div style="position:absolute; top:0px;left:85px;">
          <el-button plain>下载</el-button>
          <el-button plain @click="clearFiles" style="border:1px solid red;color:#FE1312">删除</el-button>
        </div>
      </div>
      <!--<div style="width:200px;height:150px; background-color:#000; margin:20px 0 0 20px; "><img style="width:  100%; height:100%;" alt=""></div>-->
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        companyList:[],
        sid:0,
        a:[],
        b:[],
        c: [{
          name: '',
          url: '',
        }],
        files:[],
        // 银行账号信息列表
        bankAccount: false,
        // 添加银行账号
        add_bankAccount: false,
        edit_bankAccount:false,
        addBankAccount: {
          cardNumber: '',
          cardName:'',
          bankName: '',
          memo: ''
        },
        editBankAccount: {
          cardNumber: '',
          cardName:'',
          bankName: '',
          memo: ''
        },
        BankSelection:[],
        bankid:0,
        forbidden4:true,
        forbidden5:true,
        // 搜索
        supplier: {
          search: ""
        },
        // 供应商信息添加
        add_supplierInfo: false,
        addSupplierInfo: {
          name: "",
          address: "",
          leader: "",
          phone: "",
          destinationID: "",
          productDirection: "",
          userState: "",
          supplierType: [],
          expireTime: "",
          isMonthly: "",
          memo: ""
        },
        //供应商信息编辑
        edit_supplierInfo: false,
        editSupplierInfo:{
          name: "",
          address: "",
          leader: "",
          phone: "",
          destinationID: "",
          productDirection: "",
          userState: "",
          expireTime: "",
          isMonthly: "",
          memo: "",
          supplierType_edit:[]
        },
        // 附件
        attachment: false,
        labelPosition: 'right',
        aaa: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        //上传文件
        files: [],
        // 验证规则
        rules: {
          contactName: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z]{0,4}$/,message:'请输入4个字以内的中文或英文名称'}],
          contactPhone: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^1(3|4|5|7|8)\d{9}$/,message:'请输入11位正确的手机号码' }],
          cardNumber: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[0-9]{0,20}$/,message:'请输入20个数字以内的正确卡号' }],
          cardName: [{ required: true, message: '不能为空', trigger: 'blur' }],
          bankName: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5]{0,10}$/,message:'请输入10个汉字以内银行名称' }],
          name: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{0,40}$/,message:'请输入40字以内的正确名称,含汉字、字母和数字' }],
          address: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]{0,80}$/,message:'请输入80字以内正确地址，含汉字、字母、数字下划线' }],
          leader: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z]{0,4}$/,message:'请输入4个字以内的中文或英文' }],
          phone: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^1(3|4|5|7|8)\d{9}$/,message:'请输入11位正确的手机号码' }],
          destinationID: [{ required: true, message: '不能为空', trigger: 'blur' }],
          productDirection: [{ required: true, message: '不能为空', trigger: 'blur' }],
          userState: [{ required: true, message: '不能为空', trigger: 'change' }],
          supplierType: [{ required: true, message: '不能为空', trigger: 'change' }],
          expireTime: [{ required: true, message: '不能为空', trigger: 'change' }],
          isMonthly: [{ required: true, message: '不能为空', trigger: 'change' }],
          supplierType_edit: [{ required: true, message: '不能为空', trigger: 'change' }],
        },
        // 表格数据
        tableData: [],
        multipleSelection: [],
        forbidden1:true,
        forbidden:true,
        // 银行账号信息表格数据
        bankData: [],
        // 添加联系人
        Width: '',
        add_contact: false,
        addContact:{
          contactName: '',
          contactPhone: '',
          weChat: '',
          qq: '',
        },
        //编辑联系人
        edit_contact:false,
        editContact:{
          contactName: '',
          contactPhone: '',
          weChat: '',
          qq: '',
        },
        contactData:[],
        contactSelection:[],
        forbidden2:true,
        forbidden3:true,
        ssid:0,//获取当前id
        contact: false,// 联系人信息列表
        //分页
        currentPage: 1,
        total:1,
        pagesize:10,
        //删除
        index:'',
      }
    },
    methods:{
      

      //表格标题样式
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7'
        } else {
          return ''
        }
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
      handleSuccess(response, file, fileList){
        /* console.log(response);console.log(file);*/
        this.a =  JSON.parse(response);
        this.b.push(this.a[0]);
        if(fileList.length == this.b.length) {
          this.ppp();
        }
      },
      ppp() {
        for(var i=0;i<this.b.length;i++){
          this.b[i].supplierID = this.sid
        }
        let file = [];
        this.b.forEach(item => {
          file.push({
            "name": item.Name,
            "url": item.Url,
            "supplierID": item.supplierID
          })
        })
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/savefd",
          {
            "file" : file
          })
          .then(function (obj) {

          })
          .catch(function (obj) {
            console.log(obj)
          })
        console.log(file)
      },
      clearFiles () {
        this.$refs['my-upload'].clearFiles();
      },


      //表格勾选
      rowClass({row, rowIndex}){  //选中行样式改变
        for(var i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].id==row.id){
            return { "background-color": "#ecf5ff" }
          }
        }
      },
      //保存选中项的数据
      changeFun(val) {
        //获取id
        if(this.sid ===0){
          this.sid = val[0].id
        }else{
          this.sid = 0
        }
        console.log(val)
        console.log(this.sid)
        this.multipleSelection=val;
        if(this.multipleSelection.length==1){
          this.forbidden1=false;
        }else{
          this.forbidden1=true;
        };
        if(this.multipleSelection.length>=1){
          this.forbidden=false;
        }else{
          this.forbidden=true;
        }
        //event.cancelBubble = true;//row-click和selection-change耦合事件
      },
      //选中行复选框勾选
      clickRow(row){
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      //点击添加显示弹窗
      add_test(){
        this.add_supplierInfo = true;
        this.getCompany();
      },
      //获取类型
      getCompany(){
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/suppliertype/api/get",
        )
        .then(res => {

            this.companyList=res.data.objects;           
        })
      },
      // 供应商信息弹框添加和取消
      addSupplier(addSupplierInfo){
        let types=[];
        for(let i=0;i<this.addSupplierInfo.supplierType.length;i++){
           types.push({
            "id": 0,
            "supplierType": this.addSupplierInfo.supplierType[i],
            "supplierID": 0
           })
        }
        this.$refs.addSupplierInfo.validate((valid) => {
          if (valid) {
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/supplierinsert",
              {
                object: {
                  name: this.addSupplierInfo.name,
                  userState:this.addSupplierInfo.userState,
                  types:types,
                  address:this.addSupplierInfo.address,
                  destinationID:this.addSupplierInfo.destinationID,
                  productDirection:this.addSupplierInfo.productDirection,
                  isMonthly:this.addSupplierInfo.isMonthly,
                  leader:this.addSupplierInfo.leader,
                  phone:this.addSupplierInfo.phone,
                  expireTime:this.addSupplierInfo.expireTime,
                  memo:this.addSupplierInfo.memo,
                  id: 0,
                  createTime: "2018-12-25T02:23:15.735Z",
                  code: "string",
                  isDeleted: 0,
                  billName: "string",
                  taxNumber: "string",
                  createUser: "string"
                }
              })
              .then(function(response) {
                if(response.data.isSuccess == false){
                  _this.$message.error("添加失败,该供应商已存在");
                } else {
                  _this.addSupplierInfo.name = "";
                  _this.addSupplierInfo.userState = "";
                  _this.addSupplierInfo.supplierType = "";
                  _this.addSupplierInfo.address = "";
                  _this.addSupplierInfo.destinationID = "";
                  _this.addSupplierInfo.productDirection = "";
                  _this.addSupplierInfo.isMonthly = "";
                  _this.addSupplierInfo.leader = "";
                  _this.addSupplierInfo.phone = "";
                  _this.addSupplierInfo.expireTime = "";
                  _this.addSupplierInfo.memo = "";
                  _this.$message.success("添加成功");
                  _this.pageList();
                  _this.add_supplierInfo = false;

                }
              })
          } else {
            return false;
          }
        });
      },
      addSupplierInfoCancel(a){
        this.add_supplierInfo = false;
        this.$refs[a].resetFields();
      },
      //获取一条供应商数据
      obtain(num){
        var _this = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/supplierget",
          {
            id: this.sid
          })
          .then(res => {
            if(num == 1){//获取一个供应商信息编辑
              /*_this.editSupplierInfo.id = res.data.object.id;
              _this.editSupplierInfo.name = res.data.object.name;
              _this.editSupplierInfo.userState = res.data.object.userState;
              _this.editSupplierInfo.supplierType = res.data.object.supplierType;
              _this.editSupplierInfo.address = res.data.object.address;
              _this.editSupplierInfo.destinationID = res.data.object.destinationID;
              _this.editSupplierInfo.productDirection = res.data.object.productDirection;
              _this.editSupplierInfo.isMonthly = res.data.object.isMonthly;
              _this.editSupplierInfo.leader = res.data.object.leader;
              _this.editSupplierInfo.phone = res.data.object.phone;
              _this.editSupplierInfo.expireTime = res.data.object.expireTime;
              _this.editSupplierInfo.memo = res.data.object.memo;*/
              this.editSupplierInfo = res.data.object;
              this.$set(this.editSupplierInfo,"supplierType_edit",[]);
              for(let i=0;i<this.editSupplierInfo.types.length;i++){
                this.editSupplierInfo.supplierType_edit.push(
                  this.editSupplierInfo.types[i].supplierType
                )
              }
            }else if(num == 2){//获取一个供应商信息联系人
              /* _this.contactData.push({
                 name:res.data.object.leader,
                 phone:res.data.object.phone
               })*/
              /*console.log(res.data.object)
              console.log(_this.contactData)*/
            }else if(num == 3){//获取一个供应商信息银行账号

            }
          })
          .catch(err => {});
      },

      //供应商信息弹框编辑和取消
      test(){
        this.edit_supplierInfo = true;
        this.obtain(1);
        this.getCompany();
      },
      editDialogVisible(editSupplierInfo){
        let types=[];
        for(let i=0; i<this.editSupplierInfo.supplierType_edit.length;i++){
          types.push({
            "id":0,
            "supplierType":this.editSupplierInfo.supplierType_edit[i],
            "supplierID":this.sid
          })
        }
        this.edit_supplierInfo = false;
        this.$refs[editSupplierInfo].validate((valid) => {
          if(valid){
            let _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/suppliersave", {
              object: {
                name: this.editSupplierInfo.name,
                userState:this.editSupplierInfo.userState,
                types:types,
                address:this.editSupplierInfo.address,
                destinationID:this.editSupplierInfo.destinationID,
                productDirection:this.editSupplierInfo.productDirection,
                isMonthly:this.editSupplierInfo.isMonthly,
                leader:this.editSupplierInfo.leader,
                phone:this.editSupplierInfo.phone,
                expireTime:this.editSupplierInfo.expireTime,
                memo:this.editSupplierInfo.memo,
                id: this.sid,
                createTime: "2018-12-25T02:23:15.735Z",
                code: "string",
                isDeleted: 0,
                billName: "string",
                taxNumber: "string",
                createUser: "string"
              }
            })
              .then(function(response) {
                _this.total = obj.data.total
                _this.tableData = obj.data.objects
                _this.tableData.forEach(function (v,k,arr) {
                  if(arr[k]['userState'] == 0){
                    arr[k]['userState'] = '停用'
                  }else if(arr[k]['userState'] == 1) {
                    arr[k]['userState'] = '正常'
                  }
                  if(arr[k]['supplierType'] == 0){
                    arr[k]['supplierType'] = '签证，机票'
                  }else if(arr[k]['supplierType'] == 1) {
                    arr[k]['supplierType'] = '地接'
                  }else if(arr[k]['supplierType'] == 2) {
                    arr[k]['supplierType'] = '订车'
                  }
                  if(arr[k]['isMonthly'] == 0){
                    arr[k]['isMonthly'] = '现金'
                  }else if(arr[k]['isMonthly'] == 1) {
                    arr[k]['isMonthly'] = '微信'
                  }else if(arr[k]['isMonthly'] == 2) {
                    arr[k]['isMonthly'] = '支付宝'
                  }
                })
                console.log(obj.data.objects)
                _this.$message.success("修改成功！");
                _this.edit_supplierInfo = false;
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })
        this.pageList();
      },
      editSupplierInfoCancel(a){
        this.edit_supplierInfo = false;
        this.$refs[a].resetFields();
      },
      // 联系人弹框取消、联系人信息表格关闭、联系人信息添加
      add_contactCancel(a){//联系人弹框取消
        this.add_contact = false;
        this.$refs[a].resetFields();
      },
      contactPeoele(){
        this.contact = true;
        this.link_people();
        //this.peoeleObtain();
      },
      link_people(){
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/contactlist",
          {
            "object": {
              "supplierID": this.sid
            }
          },
        )
          .then(function (obj) {
            that.contactData = obj.data.objects
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      contact_close(){//联系人信息表格关闭
        this.contact = false;
      },
      addContactPeople(addContact){//联系人信息添加
        this.$refs.addContact.validate((valid) => {
          if (valid) {
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/contactinsert",
              {
                object: {
                  id: 0,
                  createTime: "2019-01-08T11:00:54.570Z",
                  code: "string",
                  isDeleted: 0,
                  name: this.addContact.contactName,
                  phone: this.addContact.contactPhone,
                  weChat: this.addContact.weChat,
                  qq: this.addContact.qq,
                  supplierID: this.sid
                }
              })
              .then(function(response) {
                if(response.data.isSuccess == false){
                  _this.$message.error("添加失败,该供应商已存在");
                } else {
                  _this.addContact.contactName = "";
                  _this.addContact.contactPhone = "";
                  _this.addContact.weChat = "";
                  _this.addContact.qq = "";
                  _this.$message.success("添加成功");
                  _this.link_people();
                }
              })
            this.add_contact= false;
          } else {
            return false;
          }
        });
      },
      clickContact(row){//联系人弹窗表格勾选
        this.$refs.contactTable.toggleRowSelection(row)
      },
      changeContact(val) {
        //获取id
        if(this.ssid ===0){
          this.ssid = val[0].id
        }else{
          this.ssid = 0
        }
        console.log(this.ssid)
        this.contactSelection=val;
        if(this.contactSelection.length==1){
          this.forbidden2=false;
        }else{
          this.forbidden2=true;
        };
        if(this.contactSelection.length>=1){
          this.forbidden3=false;
        }else{
          this.forbidden3=true;
        }
      },
      rowStyle({row, rowIndex}){  //选中行样式改变
        for(var i=0;i<this.contactSelection.length;i++){
          if(this.contactSelection[i].id==row.id){
            return { "background-color": "#ecf5ff" }
          }
        }
      },
      peoeleObtain(){
        var _this = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/contactget",
          {
            id: this.ssid
          })
          .then(res => {//获取一个联系人信息
            console.log(res.data.object)
            _this.editContact.id = res.data.object.id;
            _this.editContact.contactName = res.data.object.name;
            _this.editContact.contactPhone = res.data.object.phone;
            _this.editContact.weChat = res.data.object.weChat;
            _this.editContact.qq = res.data.object.qq;

          })
          .catch(err => {});//获取一条联系人数据
      },
      tests(){//联系人编辑
        this.edit_contact = true;
        this.peoeleObtain();
      },
      editContactPeople(editContact){//编辑联系人
        this.edit_contact = false;
        this.$refs[editContact].validate((valid) => {
          if(valid){
            let _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/contactsave", {
              object: {
                id: this.ssid,
                createTime: "2019-01-11T06:52:05.349Z",
                code: "string",
                isDeleted: 0,
                name: this.editContact.contactName,
                phone: this.editContact.contactPhone,
                weChat: this.editContact.weChat,
                qq: this.editContact.qq,
                supplierID:  this.sid,
              }
            })
              .then(function(response) {
                _this.$message.success("修改成功！");
                _this.edit_contact = false;
                _this.link_people();
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })

      },
      edit_contactCancel(a){//联系人弹框取消
        this.edit_contact = false;
        this.$refs[a].resetFields();
      },
      deleteContact(index){//删除一条联系人信息
        let _this = this;
        this.$confirm("是否删除该联系人？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/contactdelete", {
              id: this.ssid
            })
              .then(function(response) {
                _this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _this.link_people();
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //银行账号
      contactBank(){//点击银行账号按钮显示弹窗
        this.bankAccount = true;
        this.link_bank();
      },
      link_bank(){//带条件供应商银行账号信息列表
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/banklist",
          {
            "object": {
              "supplierID": this.sid
            }
          },
        )
          .then(function (obj) {
            that.bankData = obj.data.objects
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      bankAccount_close(){// 银行账号信息表格关闭
        this.bankAccount = false;
      },
      addBankAccountCancel(a){// 添加银行账号弹框取消
        this.add_bankAccount = false;
        this.$refs[a].resetFields();
      },
      editBank(){//编辑按钮出弹窗
        this.edit_bankAccount=true;
        this.BankObtain();
      },
      editBankAccountCancel(a){
        this.edit_bankAccount = false;
        this.$refs[a].resetFields();
      },
      BankObtain(){//编辑显示
        var _this = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/bankget",
          {
            id: this.bankid
          })
          .then(res => {//获取一个联系人信息
            console.log(res.data.object)
            _this.editBankAccount.id = res.data.object.id;
            _this.editBankAccount.cardNumber = res.data.object.cardNumber;
            _this.editBankAccount.cardName = res.data.object.cardName;
            _this.editBankAccount.bankName = res.data.object.bankName;
            _this.editBankAccount.memo = res.data.object.memo;

          })
          .catch(err => {});//获取一条联系人数据
      },
      clickBank(row){//联系人弹窗表格勾选
        this.$refs.bankTable.toggleRowSelection(row)
      },
      changeBank(val) {
        //获取id
        if(this.bankid ===0){
          this.bankid = val[0].id
        }else{
          this.bankid = 0
        }
        console.log(this.bankid)
        this.BankSelection=val;
        if(this.BankSelection.length==1){
          this.forbidden4=false;
        }else{
          this.forbidden4=true;
        };
        if(this.BankSelection.length>=1){
          this.forbidden5=false;
        }else{
          this.forbidden5=true;
        }
      },
      rowStyleBank({row, rowIndex}){  //选中行样式改变
        for(var i=0;i<this.BankSelection.length;i++){
          if(this.BankSelection[i].id==row.id){
            return { "background-color": "#ecf5ff" }
          }
        }
      },
      // 银行账号信息添加
      addBank(addBankAccount){
        this.$refs.addBankAccount.validate((valid) => {
          if (valid) {
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/bankinsert",
              {
                object: {
                  id: 0,
                  createTime: "2019-01-08T11:00:54.570Z",
                  code: "string",
                  isDeleted: 0,
                  cardNumber: this.addBankAccount.cardNumber,
                  cardName:this.addBankAccount.cardName,
                  bankName: this.addBankAccount.bankName,
                  memo: this.addBankAccount.memo,
                  supplierID: this.sid,
                }
              })
              .then(function(response) {
                if(response.data.isSuccess == false){
                  _this.$message.error("添加失败,该供应商已存在");
                } else {
                  _this.addBankAccount.cardNumber = "";
                  _this.addBankAccount.cardName = "";
                  _this.addBankAccount.bankName = "";
                  _this.addBankAccount.memo = "";
                  _this.$message.success("添加成功");
                  _this.link_bank();
                }
              })
            this.add_bankAccount= false;
          } else {
            return false;
          }
        });
      },
      // 银行账号信息编辑
      editBankCancel(editBankAccount){//编辑联系人
        this.$refs.editBankAccount.validate((valid) => {
          if(valid){
            let _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/banksave", {
              object: {
                  id: this.bankid,
                  createTime: "2019-01-08T11:00:54.570Z",
                  code: "string",
                  isDeleted: 0,
                  cardNumber: this.editBankAccount.cardNumber,
                  cardName:this.editBankAccount.cardName,
                  bankName: this.editBankAccount.bankName,
                  memo: this.editBankAccount.memo,
                  supplierID: this.sid,
              }
            })
              .then(function(response) {
                _this.$message.success("修改成功！");
                _this.edit_contact = false;
                _this.link_bank();
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })
        this.edit_bankAccount = false;
      },
      deleteBank(index){//删除一条银行账号信息
        let _this = this;
        this.$confirm("是否删除该银行账号？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/bankdelete", {
              id: this.bankid
            })
              .then(function(response) {
                _this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _this.link_bank();
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //删除一条供应商信息
      deletion(index){
        let _this = this;
        this.$confirm("是否删除该供应商？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http.post(this.GLOBAL.serverSrc + "/universal/supplier/api/supplierdelete", {
              id: this.sid
            })
              .then(function(response) {
                _this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _this.pageList();
              })
              .catch(function(error) {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //分页
      handleSizeChange(page) {
        this.currentPage = 1;
        this.pagesize = page;
        this.pageList();
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
        this.pageList();
      },
      //供应商列表
      pageList() {
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/universal/supplier/api/supplierpage",
          {
            "object": {
              "isDeleted": 0,
            },
            "pageSize":this.pagesize,
            "pageIndex": this.currentPage,
            "isGetAll": true,
            "id": 0
          },)
          .then(function (obj) {
            that.total = obj.data.total
            that.tableData = obj.data.objects
            that.tableData.forEach(function (v,k,arr) {
              let types='';
              for(let i=0;i< arr[k].types.length;i++){
                 types+=arr[k].types[i].supplierTypeEX;
                 if(i!=arr[k].types.length-1){
                  types+=','
                 }
              }
              arr[k]['types1']=types;

              if(arr[k]['userState'] == 0){
                arr[k]['userState'] = '停用'
              }else if(arr[k]['userState'] == 1) {
                arr[k]['userState'] = '正常'
              }
              if(arr[k]['isMonthly'] == 0){
                arr[k]['isMonthly'] = '现金'
              }else if(arr[k]['isMonthly'] == 1) {
                arr[k]['isMonthly'] = '微信'
              }else if(arr[k]['isMonthly'] == 2) {
                arr[k]['isMonthly'] = '支付宝'
              }
              
            })
            console.log(obj.data.objects)
          })
          .catch(function (obj) {
            console.log(obj)
          })

      },
      //联系人列表


    },
    //供应商列表显示
    mounted(){
      this.pageList();
    },
 
  }
</script>

<style scoped lang='stylus'>
  .supplierInfo{ font-family: '微软雅黑'; font-size: 11pt; margin: 0 0 80px 0;overflow: hidden; }
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
  .addSupplierInfo_btn{ position:fixed; margin-left:709px; margin-top:-620px; }
  .attachment_btn{ position:absolute; margin-left:82px; }
  .upload-demo{float:left;}
  .upload-demo>>>.el-upload-list--picture .el-upload-list__item{ width:141px; display: inline-block; margin: 10px 4px 0 0px; }
  .upload-demo>>>.el-upload-list--picture .el-upload-list__item-thumbnail{ width:110px; height:80px; }
  .bankAccount_form>>>.el-form-item__error{ left: 49px; }
  .contact_form>>>.el-form-item__error{ left: 49px; }
  .bankAccount_span{ margin-left:24px; }

  .table{border:1px solid #e6e6e6;border-bottom: 0;background-color: #F7F7F7;text-align: center;margin:22px 0 0 0;}
  .el-table tr{background: #f6f6f6 !important}
  .button .el-button{width:80px;padding: 0;line-height: 35px}
  .el-button.is-disabled{color: #606266;background-color: #fff;border-color: #dcdfe6}
  .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: #f5f7fa !important}
  .el-button.is-disabled:hover{color: #606266; border:1px solid #dcdfe6;}
  .delete_button{color:#fe1212; border:1px solid #fe1212;}
  .delete_button:hover{color:#fe1212; border:1px solid #fe1212;}

  .el-form-item>>>.el-form-item__error{left:0;}

  /*分页*/
  .paging{float: right; margin:20px 0 0 0;}

  .el-checkbox.el-checkbox { margin-left: 0 !important; margin-right: 30px !important;}
</style>
