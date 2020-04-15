<template>
  <div>
    <div class="visalist">
      <div class="button">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="nextMessage('ruleForm')">下一步</el-button>
      </div>
      <div class="bother">
        <div class="left">
          <div class="one">
            <div class="correct"><i class="el-icon-check"></i></div>
            <div class="fl">基础信息</div>
          </div>
          <div class="line"></div>
          <div class="one">
            <div class="border">2</div>
            <div class="fl">签证信息</div>
          </div>
          <div class="line"></div>
          <div class="one">
            <div class="border">3</div>
            <div class="fl">重要提示</div>
          </div>
        </div>
        <div class="right">
          <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="handleClick">
            <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title" :name="index + ''" ></el-tab-pane>
          </el-tabs>
          <div class="labelBorder" v-if="this.editableTabs.length > 0">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm mt30">
              <el-form-item label="标题：" prop="caption">
                <el-input v-model="ruleForm.caption" class="messagename" placeholder="请输入重要提示" @change="stateTitle('ruleForm')"></el-input>
                <span class="numbers">{{ruleForm.caption.length}}/30字</span>
              </el-form-item>
              <el-button type="primary" class="addline" @click="addLine()" :disabled="forbidden">新增一行</el-button>
              <div style="clear:both;">
                <el-radio-group v-model="tabPosition" style="margin:0 0 0 30px;" @change="tabPositionClick">
                  <el-radio-button label="1">在职</el-radio-button>
                  <el-radio-button label="2">自由职业</el-radio-button>
                  <el-radio-button label="3">在校学生</el-radio-button>
                  <el-radio-button label="4">退休</el-radio-button>
                  <el-radio-button label="5">学龄前儿童</el-radio-button>
                </el-radio-group>
              </div>
              <el-tabs :tab-position="tabPosition">
                <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass" :row-style="rowClass" @selection-change="changeFun" @row-click="clickRow">
                  <el-table-column prop="type" label="类型" align="center" width="120"></el-table-column>
                  <el-table-column prop="name" label="名称" align="center" width="180"></el-table-column>
                  <el-table-column prop="description" label="描述" align="center" width="180"></el-table-column>
                  <el-table-column prop="must" label="必须" align="center" width="60"></el-table-column>
                  <el-table-column label="附件" align="center" width="180">
                    <template slot-scope="scope">
                      <span v-for="(item,index) in scope.row.crowdFile">
                        <el-link>
                          <a style="text-decoration:none;" :href="scope.row.crowdFile[0].path" target='_blank'>{{item.name}}</a>
                        </el-link>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                      <span class="cursor blue" @click="editLine(scope.row.id)">修改</span>
                      <span class="mr5">|</span>
                      <span class="cursor blue" @click="deleteRow(scope.row.id)">删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tabs>
            </el-form>
          </div>
        </div>
      </div>
      <!--增加签证信息弹窗-->
      <el-dialog title="新增签证信息" :visible.sync="addVisaMessageShow" custom-class="city_list" style="margin-top:-100px;" width="500px"
      @close="closeVisaMessage('ruleForm')">
        <div class="controlButton">
          <el-button @click="closeVisaMessage()">取消</el-button>
          <el-button type="primary" @click="addVisaMessage('ruleForm')">添加</el-button>
        </div>
        <el-form :model="addVisa" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="复制：" prop="copy">
            <el-select v-model="addVisa.copy" placeholder="请选择" style="width:260px;">
              <el-option :label="item.title" :value="item.id" :key="item.id" v-for="(item,index) of copyList" style="margin-left:10px" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--增加一行弹窗-->
      <el-dialog :title="title" :visible.sync="addVisaWindows" custom-class="city_list" style="margin-top:-100px;" width="800px"
      @close="cancelOrder('ruleForm')">
        <div class="controlButton">
          <el-button @click="cancelOrder('ruleForm')">取消</el-button>
          <el-button type="primary" @click="ensureRow('ruleForm')">添加</el-button>
        </div>
        <el-form :model="addVisa" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="类型：" prop="type">
            <el-input v-model="addVisa.type" class="append" placeholder="请输入类型"></el-input>
          </el-form-item>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="addVisa.name" class="append" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="describe">
            <el-input v-model="addVisa.describe" class="append" placeholder="请输入描述" type="textarea":rows="5"></el-input>
          </el-form-item>
          <el-form-item label="人群：" prop="throng">
            <el-checkbox-group v-model="addVisa.throng">
              <el-checkbox v-for="(throng,index) in throngData" :label="throng.crowdType" :key="throng.crowdType" style="float:left;margin:0 15px 0 0;">{{throng.crowdTypeEX}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="必须：" prop="must">
            <el-radio-group v-model="addVisa.must">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="附件：" prop="attachment">
            <el-upload
              class="upload-demo"
              name="files"
              ref="upload"
              multiple
              v-model="addVisa.attachment"
              :limit="1"
              :action="this.upload_url"
              :file-list="fileList"
              :on-error="handleError"
              :on-success="handleSuccess"
              :before-remove="beforeRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
  
<script>

export default {
  props: {
   
  },
  data() {
    return {
      editableTabsValue: '0',
      editableTabs: [],
      tabIndex: 0,
      addVisaMessageShow:false, // 增加签证信息弹窗
      ruleForm:{
        caption:'',
      },
      rules: {
        caption: [
          { required: true, message: '请输入标题', trigger: 'change' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'change' },
          { min: 1, max:50, message: '长度在 1 到 50 个字符', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change' }
        ],
        describe: [
          { required: true, message: '请输入描述', trigger: 'change' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
        ],
        throng: [
          { required: true, message: '请选择人群', trigger: 'change' }
        ],
        must: [
          { required: true, message: '请选择必须', trigger: 'change' }
        ],
      },
      addVisa:{
        type:'', // 类型
        name:'', // 名称
        describe:'', // 描述
        throng:[], // 人群
        must:'1', // 必须
        attachment:'', // 附件
        copy:'',
      },
      tableDate:[],//表格
      addVisaWindows:false,
      title:'',
      fileList:[],
      upload_url: this.GLOBAL.serverSrc + '/upload/obs/api/file', // 图片上传
      uid:'',
      tabPosition:'1',
      copyList:[],// 签证说明添加列表
      messageID:0,
      messageTitle:'',
      sid:'',
      a:0,
      throngData:[{
        crowdType:'1',
        crowdTypeEX:'在职'
      },{
        crowdType:'2',
        crowdTypeEX:'自由职业'
      },{
        crowdType:'3',
        crowdTypeEX:'在校学生'
      },{
        crowdType:'4',
        crowdTypeEX:'退休'
      },{
        crowdType:'5',
        crowdTypeEX:'学龄前儿童'
      }],
      img_Url:"", // 上传图片的URL
      img_Name:'', // 上传图片的名字
      name_Suffix:'', // 上传图片的后缀
      multipleSelection: [],   //选中的list
      lineID:0,
      crowdFile:[],
      forbidden:false,
    };
  },
  watch: {
    
  },
  created() {
    this.pageList();
  },
  methods: {
    changeFun(val) {  //保存选中项的数据
      this.multipleSelection=val;
    },
    clickRow(row){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    rowClass({row, rowIndex}){  //选中行样式改变
     for(var i=0;i<this.multipleSelection.length;i++){
        if(this.multipleSelection[i].id==row.id){
           return { "background-color": "#ecf5ff" }
        }
      }
    },
    editVisaMessaage(formName){
      for(var i =0; i<this.editableTabs.length; i++){
        if(i== this.editableTabsValue){
          this.sid = this.editableTabs[i].id
        }
      }
      this.$http.post(this.GLOBAL.serverSrc + "/visa/info/api/update",{
        object: {
          id:this.sid,
          title: this.ruleForm.caption,
          visaID:sessionStorage.getItem('productID')
        }
      }).then(res => {
          
      })
    },
    pageList(){
      this.$http.post(this.GLOBAL.serverSrc + "/visa/info/api/list", {
        id:sessionStorage.getItem('productID')
      }).then(res =>{
        if(res.data.isSuccess == true){
          if(res.data.objects){
            this.editableTabs = res.data.objects;
            this.ruleForm.caption = this.editableTabs[this.editableTabsValue].title;
          }
        }else{
          this.editableTabs = []
        }
        this.tabIndex = this.editableTabs.length;
        this.rowList();
      })
    },
    handleClick(tab, event){
      this.ruleForm.caption = tab.label;
      this.tableDate=[];
      this.rowList();
    },
    stateTitle(formName){
      this.editableTabs[this.editableTabsValue].title = this.ruleForm.caption;
      if(this.a == 1){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post(this.GLOBAL.serverSrc + "/visa/info/api/insert",{
              object: {
                title: this.ruleForm.caption,
                visaID:sessionStorage.getItem('productID')
              }
            }).then(res => {
                if(res.data.isSuccess == true){
                   this.addVisaMessageShow = false;
                   this.forbidden = false;
                   this.pageList();
                   this.a = 0;
                }else{
                   this.$message.success(res.data.result.message);
                }
            })
          } else {
            return false;
          }
        });
      }else if(this.a == 0){
        this.editVisaMessaage();
      } 
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
    // 签证说明添加列表
    instructionsList(){
      //this.copyList = [];
      this.$http.post(this.GLOBAL.serverSrc + "/visa/info/api/list", {
        id:sessionStorage.getItem('productID')
      })
      .then(res =>{
        this.copyList = res.data.objects;
        if(this.copyList == null){
          this.copyList = [];
        }
        this.copyList.unshift({id: '1',title: '无'});
      }).catch(function(error){
        console.log(error);
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.instructionsList();
        if(this.addVisaMessageShow==false){
          this.addVisaMessageShow=true;
          return false;
        }else{
        let newTabName = ++this.tabIndex + '';
        if(this.addVisa.copy ==1){
          this.editableTabs.push({
            id:0,
            title: '签证信息' + (this.editableTabs.length + 1),
            content: 'New Tab content',
          });
          this.tableDate = [] ;
          for(let i = 0; i < this.editableTabs.length; i++){
            if(this.editableTabs[i].id == 0){
              this.forbidden=true;
            } else {
              this.forbidden = false;
            }
          }
        }else{
          this.editableTabs.push({
            title: this.messageTitle,
            content: 'New Tab content'
          });
        }
        this.editableTabsValue = (newTabName-1).toString();
        }
      }
      if (action === 'remove') {
        this.editableTabsValue = targetName;
        console.log(this.editableTabs)
        this.$confirm("是否删除该签证说明?", "提示", {
           confirmButtonText: "删除",
           cancelButtonText: "取消",
           type: "warning"
        })
        .then(() => {
          var allow = [];
          if(this.editableTabs[this.editableTabsValue].id == 0){
            allow = [];
          } else {
            allow = this.editableTabs[this.editableTabsValue].crowdType
          }
          if(allow.length > 0){
            this.$message.success("该主题存在签证信息人群，不允许删除");
          } else{
            if(this.editableTabs[this.editableTabsValue].id == 0){
              this.editableTabs = [];
              this.pageList();
              let tabs = this.editableTabs;
              let activeName = this.editableTabsValue;
              if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                  if (tab.name === targetName) {
                    let nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                      activeName = nextTab.name;
                    }
                  }
                });
              }
              this.editableTabsValue = String(this.editableTabs.length);
              this.$message.success("删除成功");
              return;
            }else {
              this.$http.post(this.GLOBAL.serverSrc + '/visa/info/api/delete',{
                "id": this.editableTabs[this.editableTabsValue].id
              })
              .then(res => {
                if(res.data.isSuccess == true){
                  this.editableTabs = [];
                  this.pageList();
                  let tabs = this.editableTabs;
                  let activeName = this.editableTabsValue;
                  if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                      if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                          activeName = nextTab.name;
                        }
                      }
                    });
                  }       
                  this.editableTabsValue = String(this.editableTabs.length);
                  this.$message.success("删除成功");
                } else {
                  this.$message.success("该主题存在签证信息人群，不允许删除");
                }
               })
            }
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });       
      } 
    },
    addVisaMessage(formName){ // 新增签证信息
      if(this.addVisa.copy == 1){
        this.ruleForm.caption = '';
        this.handleTabsEdit(this.tabIndex, "add");
        this.addVisaMessageShow = false;
        this.$refs[formName].resetFields();
        this.a = 1;
      }else {
        for(let i = 0; i < this.copyList.length; i++){
          if(this.addVisa.copy == this.copyList[i].id){
            this.messageTitle = this.copyList[i].title
          }
        }
        this.$http.post(this.GLOBAL.serverSrc + "/visa/info/api/insert",{
          object: {
            id: this.addVisa.copy,
          }
        }).then(res => {
            if(res.data.isSuccess == true){
               this.ruleForm.caption = this.messageTitle;
               this.handleTabsEdit(this.tabIndex, "add");
               this.addVisaMessageShow = false
               this.$refs[formName].resetFields();
               this.pageList();
            }else{
               this.$message.success(res.data.result.message);
            }
        })
      }
    },
    closeVisaMessage(formName){ // 关闭签证信息弹窗
      this.addVisaMessageShow = false;
      this.$refs[formName].resetFields();
    },
    handleError(err, file) {
      this.fileList = []
      console.log(file.id)
    },
    handleSuccess(res, file, fileList) {
      var paths = [];
      this.fileList = fileList;
      for (var i = 0; i < fileList.length; i++) {
        this.fileLength = fileList.length;
        paths = JSON.parse(fileList[i].response).paths[0];
        this.img_Url = this.$set(this.fileList[i], "url", paths.Url);
        this.img_Name = this.$set(this.fileList[i], "name", paths.Name);
        this.name_Suffix = file.raw.name; 
        this.type = '';
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`是否删除 ${ file.name } ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(res => {
        this.uid = file.id;
        this.type = "del";
        this.img_Url = '';
        this.img_Name = '';
      })
    },
    addLine(){ // 点击添加一行显示弹窗
      this.title = '新增';
      this.addVisaWindows = true;
    },
    editLine(status){
      this.lineID = status
      this.$http.post(this.GLOBAL.serverSrc + '/visa/crowd/api/get',{
        id:status
      }).then(res => {
          if(res.data.isSuccess == true){
             let data = res.data.object;
             this.addVisa.type=data.type; // 类型
             this.addVisa.name=data.name; // 名称
             this.addVisa.describe= data.description; // 描述
             this.addVisa.throng = []; // 人群
             for(let i=0; i<data.crowdType.length;i++){
              this.addVisa.throng.push(data.crowdType[i].crowdType + '')
             }
             this.addVisa.must=data.must + ''; // 必须
             this.fileList = [],// 附件
             this.fileList.push({'url':data.crowdFile[0].path,'name':data.crowdFile[0].name})
             // data.crowdFile.forEach(v =>{
             //   this.fileList.push({'url':v.path,'name':v.name})
             // })
             
          }
      })
      this.title = '修改';
      this.addVisaWindows = true;
    },
    ensureRow(formName){
      if(this.title == '新增'){
        this.addRow(formName);
      }else if(this.title == '修改'){
        this.editRow(formName);
      }
    },
    addRow(formName){ // 新增一行方法
      let throngType = []; // 人群类型
      for(let i = 0; i < this.addVisa.throng.length; i++){
        throngType.push({
          crowdType:this.addVisa.throng[i]
        })
      }
      let pathUrl = []; // 附件
      for(let i = 0; i < this.fileList.length; i++){
        for(let j = 0; j < this.addVisa.throng.length; j++){
          pathUrl.push({
            crowdType:this.addVisa.throng[j],
            name:this.name_Suffix,
            path:this.img_Url,
          })
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.GLOBAL.serverSrc + "/visa/crowd/api/insert",
            {
              object: {
                "id": 0,
                "crowdType": throngType, // 人群类型
                "name": this.addVisa.name, // 名称
                "type": this.addVisa.type, // 类型
                "description": this.addVisa.describe, // 描述
                "must": this.addVisa.must, // 必须
                "crowdFile":pathUrl,// 附件
                "visaInfoID": this.editableTabs[this.editableTabsValue].id, // 签证说明ID
              }
            })
            .then(res => {
              if(res.data.isSuccess == true){
                 this.rowList();
                 this.addVisaWindows = false
                 this.$refs[formName].resetFields();
              }else{
                 this.$message.success("添加失败");
              }
          })
        } else {
          return false;
        }
      });
    },
    editRow(formName){ // 编辑一行方法
      let throngType = []; // 人群类型
      for(let i = 0; i < this.addVisa.throng.length; i++){
        throngType.push({
          crowdType:this.addVisa.throng[i]
        })
      }
      let pathUrl = []; // 附件
      for(let i = 0; i < this.fileList.length; i++){
        for(let j = 0; j < this.addVisa.throng.length; j++){
          pathUrl.push({
            crowdType:this.addVisa.throng[j],
            name:this.name_Suffix,
            path:this.img_Url,
          })
        }
      }
      console.log(pathUrl)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.GLOBAL.serverSrc + "/visa/crowd/api/update",
            {
              object: {
                "id": this.lineID,
                "crowdType": throngType, // 人群类型
                "name": this.addVisa.name, // 名称
                "type": this.addVisa.type, // 类型
                "description": this.addVisa.describe, // 描述
                "must": this.addVisa.must, // 必须
                "crowdFile":pathUrl,// 附件
                "visaInfoID": this.sid, // 签证说明ID
              }
            })
            .then(res => {
              if(res.data.isSuccess == true){
                 this.rowList();
                 this.addVisaWindows = false
                 this.$refs[formName].resetFields();
              }else{
                 this.$message.success("添加失败");
              }
          })
        } else {
          return false;
        }
      });
    },
    deleteRow(status){
      this.$confirm("是否删除?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      }).then(res => {
        this.$http.post(this.GLOBAL.serverSrc + "/visa/crowd/api/delete",{
          id:status
        }).then(res => {
            if(res.data.isSuccess == true){
              this.tableDate = [];
              this.rowList();
              this.$message.success("删除成功");
            }
        })
        
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    },
    cancelOrder(formName){ // 取消添加弹窗
      this.addVisaWindows = false;
      this.$refs[formName].resetFields();
      this.fileList = [];
    },
    rowList(){
      for(var i =0; i<this.editableTabs.length; i++){
        if(i== this.editableTabsValue){
          this.sid = this.editableTabs[i].id
        }
      }
      this.$http.post(this.GLOBAL.serverSrc + "/visa/crowd/api/list", {
        crowdType:this.tabPosition,
        id:this.sid
      }).then(res =>{
        if(res.data.isSuccess == true){
          this.tableDate = res.data.objects;
          // this.crowdFile = [];
          // for(var i =0; i<this.tableDate.length; i++){
          //   crowdFile = this.tableDate[i].crowdFile
          // }
          // let crowdName = '';
          // for(var i =0; i< crowdFile.length; i++){
          //   crowdName = crowdFile[i].name
          // }
          this.tableDate.forEach(function (v,k,arr) {
            if(arr[k]['must'] == 1){
              arr[k]['must'] = '是'
            }else if(arr[k]['must'] == 2) {
              arr[k]['must'] = '否'
            }
          })
          
        }
      })
    },
    tabPositionClick(){
      this.tableDate = [];
      this.rowList();
    },
    nextMessage(formName){ // 点击下一步进入签证信息页面
      this.$router.push({ path: "/visaImportant" }); // 基本信息添加完跳转到重要信息页面
    },
    cancel(){
      this.$confirm("是否取消本次添加产品?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      })
      .then(res => {
         this.$message.success("本次添加产品取消成功");
         this.$router.push({ path: "/productList/productVisa" });
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

<style scoped lang="scss">
ul,li{ padding:0;margin:0;list-style:none}
.visalist{max-width: 1200px; overflow: hidden;margin:0 0 50px 0;}
.button{float:right;}
.bother{clear:both;}
.left{float:left;width:150px;}
.correct{
  width:40px;
  height:40px;
  border:2px solid #409eff;
  background:#409eff;
  line-height:40px;
  text-align:center;
  border-radius:50%;
  float:left;
  margin:10px 0 10px 0;
  color:#fff;
  font-weight: bold;
}
.border{
  width:40px;
  height:40px;
  border:2px solid #e6e6e6;
  line-height:40px;
  text-align:center;
  border-radius:50%;
  float:left;
  margin:10px 0 10px 0;
}
.fl{
  float:left;
  line-height:40px;
  margin:10px 0 0 10px;
}
.line{
  clear:both;
  width:3px;
  height:40px;
  background:#e6e6e6;
  margin:0 0 0 19px;
}
.right{
  float:left;
  margin:15px 0 0 30px;
  width:900px;
  overflow:hidden;
  position:relative;
}
.blue {
  color: #2e94f9;
}
.cursor {
  cursor: pointer;
}
.mt30{margin:30px 0 0 0;}
.labelBorder{border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6; margin:-20px 0 20px 0; overflow: hidden; clear: both;}
.messagename{width:300px; float:left;}
.numbers{float:left; margin:0 0 0 10px;}
.addline{margin:0 0 20px 30px;}
.table{margin:0 0 20px 30px;width:841px;}
.mr5{margin:0 5px 0 5px;}
.fl{float:left;}
.controlButton{position: absolute; top: 8px; right: 10px;}
.append{width:400px; float:left;}
</style>


