<style lang="scss" scoped>

</style>

<template>
  <el-form ref="submitForm" label-width="120px" style="width: 100%; padding-top: 15px;"
    :model="submitForm"
    :rules="rules">

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="供应商名称：" prop="name">
          <el-input size="small" placeholder="供应商名称" style="width: 100%;" maxlength="40" show-word-limit
            v-model="submitForm.name">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="法人代表：" prop="legalPerson">
          <el-input size="small" placeholder="法人代表" style="width: 100%;" maxlength="20" show-word-limit
            v-model="submitForm.legalPerson">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="供应商编码：" prop="supplierCode">
          <el-input size="small" placeholder="供应商编码" style="width: 100%;" maxlength="40" show-word-limit
            v-model="submitForm.supplierCode"
            :disabled="isSave">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="合同编号：" prop="taxNumber">
          <el-input size="small" placeholder="合同编号" style="width: 100%;" maxlength="20" show-word-limit
            v-model="submitForm.taxNumber">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="公司可见性：" prop="companyArea">
          <el-select size="small" placeholder="公司可见性" style="width: 100%;"
            v-model="submitForm.companyArea">
            <el-option
              v-for="item in CompanyAreaOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="经手人：" prop="handPerson">
          <el-input size="small" placeholder="经手人" style="width: 100%;" maxlength="20" show-word-limit
            v-model="submitForm.handPerson">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="状态：" prop="userState">
          <el-select size="small" placeholder="状态" style="width: 100%;"
            v-model="submitForm.userState">
            <el-option
              v-for="item in ConditionTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="经手人电话：" prop="handPhone">
          <el-input size="small" placeholder="经手人电话" style="width: 100%;" maxlength="20" show-word-limit
            v-model="submitForm.handPhone">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="线路：" prop="productArea">
          <el-select size="small" placeholder="线路" style="width: 100%;"
            v-model="submitForm.productArea">
            <el-option
              v-for="item in ProductAreaOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="负责人：" prop="leader">
          <el-input size="small" placeholder="负责人" style="width: 100%;" maxlength="20" show-word-limit
            v-model="submitForm.leader">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
       <el-col :span="12">
        <el-form-item label="类别：" prop="types">
          <el-select size="small" placeholder="类别" style="width: 100%;"
            v-model="submitForm.types">
            <el-option
              v-for="item in SupplierTypeOptions"
              :key="item.supplierType"
              :label="item.supplierTypeEX"
              :value="item.supplierType">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="负责人电话：" prop="phone">
          <el-input size="small" placeholder="负责人电话" style="width: 100%;" maxlength="20" show-word-limit
            v-model="submitForm.phone">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="结算方式：" prop="isMonthly">
          <el-select size="small" placeholder="结算方式" style="width: 100%;"
            v-model="submitForm.isMonthly">
            <el-option
              v-for="item in IsMonthlyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="操作负责人：" prop="billName">
          <el-input size="small" placeholder="操作负责人" style="width: 100%;" maxlength="20" show-word-limit
            v-model="submitForm.billName">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="使用部门：">
          <el-cascader size="small" clearable style="width: 100%;"
            v-model="orgsData"
            :options="orgOptions"
            :props="orgProps"
            @change="orgChange">
          </el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品主要方向：" prop="productDirection">
          <el-input size="small" placeholder="产品主要方向" maxlength="80" show-word-limit style="width: 100%;"
            v-model="submitForm.productDirection">
          </el-input>
        </el-form-item>
        <el-form-item label="供应商协议：" prop="isAgree">
          <el-select size="small" placeholder="供应商协议" style="width: 100%;"
            v-model="submitForm.isAgree">
            <el-option :value="1" label="是"></el-option>
            <el-option :value="2" label="否"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="到期日期：" prop="expireTime">
          <el-date-picker type="datetime" placeholder="选择日期时间" style="width: 100%;" size="small"
            v-model="submitForm.expireTime"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="备注：" prop="memo">
          <el-input size="small" placeholder="备注" style="width: 100%;" maxlength="100" show-word-limit
            v-model="submitForm.memo">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="100" class="common-row">
      <el-col :span="12">
        <el-form-item label="附件：" prop="files">
          <el-upload name="files" ref="upload"
            :action="GLOBAL.serverSrc+ '/upload/obs/api/file'"
            :file-list="filesList"
            :on-error="uploadErrorHandler"
            :on-success="uploadSuccessHandler"
            :before-remove="uploadBeforeRemoveHandler"
            :on-remove="uploadRemoveHandler"
            :on-preview="uploadPreviewHandler">
            <el-button type="primary" size="small" icon="el-icon-plus">上传文件</el-button>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="供应商别名：" prop="alias">
          <labels-input placeholder="供应商别名"
            v-model="submitForm.alias"
            :tag-label-attr="'name'"
            :tag-value-attr="'id'"
            :input-props="aliasInputProps">
          </labels-input>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>
// this.GLOBAL.serverSrc + '/upload/obs/api/file' 上传路径
import labelsInput from '../../comps/labelsInput'
import { getDicOptions, checkSupplierCode, checkSupplierName, orgMaker } from '../../../api'
import { ConditionTypeOptions, CompanyAreaOptions, TreeNamer } from '../../../dictionary'

export default {
  components: { labelsInput },

  created(){
    this.checkProto= null; // 原始数据
    this.treeNamer= null; // 部门树数据处理对象
    this.reactKey= null; // 同步钥匙
    this.reactLock= new Promise((resolve, reject) => this.reactKey= resolve)  // 同步锁
  },

  mounted(){
    this.makeOptions();
  },

  data(){
    return Object.assign(
      // org
      {
        orgsData: [],
        orgProps: { multiple: true, value: 'id', label: 'orgName' },
        orgOptions: []
      },
      {
        isSave: false,
      },
      {
        submitForm: {
          id: 0,
          createTime: null,	// integer($int64)
          name: null,
          types: [],
          productDirection: null,
          isMonthly: null,
          productArea: null,
          leader: null,
          phone: null,
          legalPerson: null,
          handPerson: null,
          handPhone: null,
          billName:	null,
          taxNumber: null,
          expireTime: null,	// string($date-time)
          memo: null,
          files: [],
          createUser: null,
          supplierCode: null,
          alias: [],
          orgs: [],
// 几个给定的常量
          companyArea: 1,
          isDeleted: 0,
          isAgree: 2,
          userState: 1, // 角色的数据状态 0等待审核 1正常 2停用
          manageType: 1
        },
        rules: {
          name: [
            { 
              required: true, 
              validator: this.simpleValidator, 
              message: '供应商名称不能为空', 
              trigger: ['blur', 'change']
            },
            {
              validator: this.nameValidator, 
              message: '供应商名称重复', 
              trigger: 'blur'
            }
          ],
          supplierCode: [
            { 
              required: true, 
              validator: this.simpleValidator, 
              message: '供应商编码不能为空', 
              trigger: ['blur', 'change']
            },
            {
              validator: this.supplierCodeValidator, 
              message: '供应商编码重复', 
              trigger: 'blur'
            }
          ],
          userState: { 
            required: true, 
            validator: this.simpleValidator, 
            message: '状态不能为空', 
            trigger: 'blur'
          },
          productArea: { 
            required: true, 
            validator: this.simpleValidator, 
            message: '线路不能为空', 
            trigger: 'blur'
          },
          types: { 
            required: true, 
            validator: this.simpleValidator, 
            message: '类别不能为空', 
            trigger: 'change'
          },
          isMonthly: { 
            required: true, 
            validator: this.simpleValidator, 
            message: '结算方式不能为空', 
            trigger: 'blur'
          },
          expireTime: { 
            required: true, 
            validator: this.simpleValidator, 
            message: '结算方式不能为空', 
            trigger: 'blur'
          },
        },
      },
      // options
      {
        SupplierTypeOptions: [],
        IsMonthlyOptions: [],
        ProductAreaOptions: [],
        CompanyAreaOptions,
        ConditionTypeOptions
      },
      {
        filesList: [],
        pickerOptions: {
          disabledDate: (date) =>  date<= Date.now(),
        },
        // 别名组件配置
        aliasInputProps: {
          factory: (name) => {
            if(!name) return;
            if(this.submitForm.alias.find(alia => alia.name=== name)){
              this.$message.error(`别名 ${name} 已存在`);
              return;
            }
            let supplierID= this.submitForm.id;
            return Object.assign(
              { name }, (supplierID? { supplierID }: {})
            )
          },
        }
      }
    )
  },

  methods: Object.assign(
    {
      init(payload){
        this.reactLock
        .then(() => {
          this.isSave= !!(payload.id || false);
          this.initSubmitForm(payload);
          this.proto= payload;
          this.checkProto= this.$deepCopy(this.submitForm);
        })
      },

      hasChanged(){
        return !this.$checkLooseEqual(this.checkProto, this.submitForm);
      },

      validate(){
        return new Promise((resolve, reject) => {
          this.$refs.submitForm.validate(validate => {
            validate? resolve(): reject();
          })
        })
      },

      getData(){
        let data= this.$deepCopy(this.submitForm);
        // 适配types在数据库中的存储格式
        this.typesAdaptor(data);
        this.expireTimeAdaptor(data);
        this.orgsAdaptor(data);
        data.createTime= Date.now();
        return data;
      },

      uploadErrorHandler(){},
      uploadSuccessHandler(response, file, fileList){
        this.submitForm.files.push(this.fileAdaptor(file));
        this.filesList.push(this.fileAdaptor(file));
      },
      
      uploadBeforeRemoveHandler(file, fileList){
        return new Promise((resolve, reject) => {
          this.$confirm(`确定删除附件吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(resolve)
          .catch(reject)
        })
      },

      uploadRemoveHandler(file, fileList){
        let index= this.filesList.findIndex(f => f.name=== file.name);
        this.submitForm.files.splice(index, 1);
        this.filesList.splice(index, 1);
      },
      uploadPreviewHandler(file){
        window.open(file.url);
        // let win = window.open();  //打开新的空白窗口
        // win.document.write ("<h1>这是新打开的窗口</h1>");
      },
    },

    // 数据加工
    {
      initSubmitForm(payload){
        Object.keys(this.submitForm).forEach(attr => {
          if(this.$isArray(this.submitForm[attr])){
            this.submitForm[attr].splice(0);
            this.submitForm[attr].push(...payload[attr]);
            return;
          }
          this.submitForm[attr]= payload[attr];
        })
        // 类型需要特殊处理
        // 类型多选
        // this.submitForm.types= this.submitForm.types.map(type => type.supplierType);
      
        // 类型单选
        this.submitForm.types= 
          this.submitForm.types[0]? 
            this.submitForm.types[0].supplierType: null;
        // 类型单选结束

        // 用filesList来绑定上传组件的file-list，因为上传组件会给file-list的元素添加status属性
        this.filesList.splice(0);
        this.filesList.push(...this.$deepCopy(this.submitForm.files));

        // 纠正时间
        this.submitForm.expireTime= new Date(this.submitForm.expireTime).getTime()+ 8* 3600* 1000;

        // org
        this.orgsData= this.treeNamer.getData(this.submitForm.orgs);
        this.$nextTick(() => this.$refs.submitForm.clearValidate());
      },

      makeOptions(){
        let orgTree;
        Promise.all([
          getDicOptions('SupplierType'),
          getDicOptions('IsMonthly'),
          getDicOptions('ProductArea'),
          orgMaker.make()
        ]).then(res => {
          this.SupplierTypeOptions.push(
            ...res[0].map(el => {
              return {
                supplierType: el.id,
                supplierTypeEX: el.name
              }
            })
          );
          this.IsMonthlyOptions.push(...res[1]);
          this.ProductAreaOptions.push(...res[2]);
          orgTree= res[3].children;
          this.orgOptions.push(...orgTree);
          this.treeNamer= new TreeNamer(orgTree);
          this.reactKey();
        })
      },

      orgChange(orgs){
        let newOrgs= orgs.map(this.treeNamer.family.bind(this.treeNamer)); 
        this.treeNamer.diff(this.submitForm.orgs, newOrgs);
      },
      
      // 后台目前是保存一次，那么所有类别重新建立一次联系（删除所有旧的，再插入新的）
      // 多选的typesAdaptor
      // typesAdaptor(types){
      //   let assignObj= this.isSave? { supplierID: this.submitForm.id }: {};
      //   let oldTypes= this.proto.types;
      //   types.forEach((type, index) => {
      //     if(this.$isObject(type)) return;
      //     let hit= oldTypes.find(el => el.supplierType=== type)
      //     // 看看是否已经保存过
      //     if(!hit) hit= this.SupplierTypeOptions.find(el => el.supplierType=== type);
      //     if(!hit) console.error('data error');
      //     types[index]= Object.assign({}, hit, assignObj);
      //   })
      // },

      // 单选的typesAdaptor
      typesAdaptor(data){
        let { types }= data;
        let assignObj= this.isSave? { supplierID: this.submitForm.id }: {};
        if(this.$isObject(types)) return;
        let hit= this.SupplierTypeOptions.find(el => el.supplierType=== types);
        data.types= [Object.assign({}, hit, assignObj)]
      },

      expireTimeAdaptor(data){
        data.expireTime= new Date(new Date(data.expireTime).getTime()+ 8* 3600* 1000).toISOString();
      },

      fileAdaptor(file){
        let { name, response }= file;
        let { Url }= JSON.parse(response).paths[0];
        let newFile= {
          createTime: Date.now(),
          isDeleted: 0,
          url: Url,
          name
        }
        if(this.isSave) newFile.supplierID= this.submitForm.id;
        return newFile;
      },

      orgsAdaptor(data){
        let { orgs }= data;
        orgs.forEach(org => {
          org.parent= JSON.stringify(org.parent);
        })
      }
    },

    // 校验
    {
      simpleValidator(rule, value, cb){
        let { message }= rule;
        let isArray= this.$isArray(value);
        if(isArray && value.length=== 0) return cb(new Error(message));
        if(!isArray && this.$isNull(value)) return cb(new Error(message));
        cb();
      },

      supplierCodeValidator(rule, value, cb){
        if(this.isSave) return cb();
        checkSupplierCode(value)
        .then(cb)
        .catch(cb.bind(null, new Error('供应商编码重复')));
      },

      // 先利用分页查找接口来验证供应商名字重复
      nameValidator(rule, value, cb){
        if(this.isSave) return cb();
        checkSupplierName(value)
        .then(cb)
        .catch(cb.bind(null, new Error('供应商名称重复')));
      }
    }
  )

}
</script>