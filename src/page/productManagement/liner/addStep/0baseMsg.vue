<template>
  <div class="curiseShipBaseMsg">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <div class="buttonDv">
        <el-button class="el-button" type="primary" @click="saveFun('ruleForm', 1)">保 存</el-button>
        <el-button class="el-button" type="primary" @click="saveFun('ruleForm', 2)">下一步</el-button>
        <el-button class="el-button" type="danger" @click="cancalBtn">取 消</el-button>
      </div>
      <div>
        <el-form-item label="产品名称：" prop="name" label-width="140px">
          <el-input v-model="ruleForm.name" placeholder="请输入" class="inputWidth" maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="亮点词：" prop="word" label-width="140px">
          <el-input v-model="ruleForm.word1" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
          <el-input v-model="ruleForm.word2" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
          <el-input v-model="ruleForm.word3" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
          <el-input v-model="ruleForm.word4" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="邮轮：" prop="word" label-width="140px">
          <el-select v-model="ruleForm.company_id" class="search_input" placeholder="请选择邮轮公司" @change="loadLiner()">
            <el-option v-for="item in companyList" :key="item.id" :label="item.company_name" :value="item.id" :disabled="item.linernums == 0">{{item.company_name}}</el-option>
          </el-select>
          <el-select v-model="ruleForm.liner_id" class="search_input" placeholder="请选择邮轮">
            <el-option v-for="item in linerList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出发地：" prop="origin" label-width="140px">
          <el-autocomplete
            class="search_input"
            v-model="ruleForm.origin"
            :fetch-suggestions="querySearch"
            placeholder="请输入"
            :trigger-on-focus="false"
            @select="handleSelect1"
          ></el-autocomplete>
          <el-tag
            class="tagCls"
            v-for="tag in originTag"
            :key="tag.id"
            closable
            @close="tagClose1"
            type="info">
            {{tag.value}}
          </el-tag>
        </el-form-item>
        <el-form-item label="目的地：" prop="destination" label-width="140px">
          <el-autocomplete
            class="search_input"
            v-model="ruleForm.destination"
            :fetch-suggestions="querySearch"
            placeholder="请输入"
            :trigger-on-focus="false"
            @select="handleSelect2"
          ></el-autocomplete>
          <el-tag
            class="tagCls"
            v-for="tag in destinationTag"
            :key="tag.id"
            closable
            @close="tagClose2"
            type="info">
            {{tag.value}}
          </el-tag>
        </el-form-item>
        <el-form-item label="返回地：" prop="returnDes" label-width="140px">
          <el-autocomplete
            class="search_input"
            v-model="ruleForm.returnDes"
            :fetch-suggestions="querySearch"
            placeholder="请输入"
            :trigger-on-focus="false"
            @select="handleSelect3"
          ></el-autocomplete>
          <el-tag
            class="tagCls"
            v-for="tag in returnDesTag"
            :key="tag.id"
            closable
            @close="tagClose3"
            type="info">
            {{tag.value}}
          </el-tag>
        </el-form-item>
        <el-form-item label="订单确认类型：" prop="orderType" label-width="140px">
          <el-radio v-model="ruleForm.orderType" label="1">及时确认</el-radio>
          <el-radio v-model="ruleForm.orderType" label="2">二次确认</el-radio>
        </el-form-item>
        <el-form-item label="运营标签：" prop="operationLabel" label-width="140px">
          <el-tag
            class="tagCls"
            :key="tag"
            v-for="tag in labelTag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="ruleForm.operationLabel"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
        </el-form-item>
        <el-form-item label="头图：" prop="width" label-width="140px">
          <el-upload
            :file-list="fileListPic"
            :action="UploadUrl()"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError" 
            :on-remove="handleRemove" 
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :limit="1">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="轮播图：" prop="width" label-width="140px">
          <el-upload
            :file-list="fileListVideo"
            :action="UploadUrl1()"
            :headers="headers"
            :on-success="handleSuccess1" 
            :on-error="handleError1" 
            :on-remove="handleRemove1" 
            :before-remove="beforeRemove1" 
            :on-exceed="handleExceed1"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :limit="6">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <span>轮播图3-6张</span>
        </el-form-item>
        <el-form-item label="出游人群：" prop="person" label-width="140px">
          <el-checkbox v-model="ruleForm.person" v-for="item in personList" :key="item.id">{{item.name}}</el-checkbox>
        </el-form-item>
        <el-form-item label="主题：" prop="theme" label-width="140px">
          <el-checkbox v-model="ruleForm.theme" v-for="item in themeList" :key="item.id">{{item.name}}</el-checkbox>
        </el-form-item>
        <el-form-item label="提前报名天数：" prop="days" label-width="140px">
          <el-input v-model="ruleForm.days" placeholder="请输入" class="inputWidth" ></el-input>
        </el-form-item>
        <el-form-item label="产品概况：" prop="introduce" label-width="140px">
          <el-input v-model="ruleForm.introduce" placeholder="请输入" class="inputWidth" type="textarea"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "curiseShipBaseMsg",
  components: {
    
  },
  data() {
    const hasWord = (rule, value, callback) => {
      if (this.ruleForm.word1 == '' && this.ruleForm.word2 == '' && this.ruleForm.word3 == '' && this.ruleForm.word4 == '') {
        callback(new Error('至少输入一个亮点词'));
      } else {
        callback();
      }
    };
    const hasDes1 = (rule, value, callback) => {
      if(this.originTag.length == 0){
        callback(new Error('至少输入一个出发地'));
      } else {
        callback();
      }
    }
    const hasDes2 = (rule, value, callback) => {
      if(this.destinationTag.length == 0){
        callback(new Error('至少输入一个目的地'));
      } else {
        callback();
      }
    }
    const hasDes3 = (rule, value, callback) => {
      if(this.returnDesTag.length == 0){
        callback(new Error('至少输入一个返回地'));
      } else {
        callback();
      }
    }
    return {
      ruleForm: {
        name: '',
        word1: '',
        word2: '',
        word3: '',
        word4: '',
        company_id: '',
        liner_id: '',
        origin: '',
        destination: '',
        returnDes: '',
        orderType: '2',
        operationLabel: '',
        person: [],
        theme: [],
        days: '',
        introduce: ''
      },
      originTag: [],
      destinationTag: [],
      returnDesTag: [],
      labelTag: [],
      inputVisible: false,
      personList: [
        {id: "1", name: "亲子"},
        {id: "2", name: "情侣"},
        {id: "3", name: "朋友/同事"},
        {id: "4", name: "父母"}
      ],
      themeList: [
        {id: "1", name: "乐园/公园"},
        {id: "2", name: "人文/赏景"},
        {id: "3", name: "健康旅游"},
        {id: "4", name: "古镇游"},
        {id: "5", name: "度假村"},
        {id: "6", name: "户外"},
        {id: "7", name: "海岛游"},
        {id: "8", name: "温泉"},
        {id: "9", name: "游学"},
        {id: "10", name: "滑雪"},
        {id: "11", name: "禅修"},
        {id: "12", name: "自驾"},
        {id: "13", name: "都市游"},
        {id: "14", name: "酒店控"},
        {id: "15", name: "其他"}
      ],
      rules: {
        name: [{ required: true, message: '产品名称不能为空!', trigger: 'blur' }],
        liner_id: [{ required: true, message: '邮轮不能为空!', trigger: 'change' }],
        word: [{ validator: hasWord, trigger: 'blur' }],
        origin: [{ validator: hasDes1, trigger: 'blur' }],
        destination: [{ validator: hasDes2, trigger: 'blur' }],
        returnDes: [{ validator: hasDes3, trigger: 'blur' }],
        orderType: [{ required: true, message: '订单确认类型不能为空!', trigger: 'change' }],
        days: [{ required: true, message: '提前天数不能为空!', trigger: 'blur' }],
      },
      fileListPic: [],
      fileListVideo: [],
      // 上传图片查看大图功能
      dialogImageUrl: '',
      dialogVisible: false,

      companyList: [],
      linerList: [],
      destinationList: []
    }
  },
  computed: {
    // 计算属性的 getter
    headers(){
      return {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    }
  },
  methods: {
    // 出发地，目的地，返回地
    querySearch(queryString2, cb) {
      this.destinationList = [];
      this.$http.post(this.GLOBAL.serverSrcZb + '/universal/area/api/fuzzy', {
        "object": {
          areaName: queryString2
        }
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then(res => {
          console.log(res);
        for (let i = 0; i < res.data.objects.length; i++) {
          this.destinationList.push({
            "value": res.data.objects[i].areaName,
            "id": res.data.objects[i].id
          })
        }
        var results = queryString2 ? this.destinationList.filter(this.createFilter(queryString2)) : [];
        cb(results)
      }).catch(err => {
        console.log(err);
      })
    },
    createFilter(queryString5) {
      return (restaurant) => {
        return (restaurant.value);
      }
    },
    handleSelect1(item) {
      // this.ruleForm.originID = item.id;
      // this.ruleForm.origin = item.value;
      
      if(this.originTag.length > 10){
        this.$message.warning("最多添加10个地点")
      }else{
        this.destinationList = [];
        this.originTag.push(item);
        this.ruleForm.origin = '';
      }
    },
    tagClose1(tag){
      this.originTag.splice(this.originTag.indexOf(tag), 1);
    },
    handleSelect2(item) {
      // this.ruleForm.destinationID = item.id;
      // this.ruleForm.destination = item.value;

      if(this.destinationTag.length > 10){
        this.$message.warning("最多添加10个地点")
      }else{
        this.destinationList = [];
        this.destinationTag.push(item);
        this.ruleForm.destination = '';
      }
    },
    tagClose2(tag){
      this.destinationTag.splice(this.destinationTag.indexOf(tag), 1);
    },
    handleSelect3(item) {
      // this.returnDesID = item.id;
      // this.returnDes = item.value;

      if(this.returnDesTag.length > 10){
        this.$message.warning("最多添加10个地点")
      }else{
        this.destinationList = [];
        this.returnDesTag.push(item);
        this.ruleForm.returnDes = '';
      }
    },
    tagClose3(tag){
      this.returnDesTag.splice(this.returnDesTag.indexOf(tag), 1);
    },

    // 运营标签
    handleClose(tag) {
      this.labelTag.splice(this.labelTag.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.ruleForm.operationLabel;
      if (inputValue) {
        this.labelTag.push(inputValue);
      }
      this.inputVisible = false;
      this.ruleForm.operationLabel = '';
    },
    
    // 上传凭证 function 图片
    UploadUrl(){
      return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
    },
    handleSuccess(response, file, fileList){
      // console.log(fileList);
      // console.log(file);
      if(response.code == 200){
        this.fileListPic.push(response.data);
        this.fileListPic.forEach(function(item, index, arr){
          item.urlCopy = item.url;
          item.url = fileList[index].url;
        })
      }else{
        if(response.message){
          this.$message.warning(response.message);
        }else{
          this.$message.warning('文件上传失败');
        }
      }
    },
    handleError(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileListPic = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`平台仅支持上传一张头图！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    // 上传凭证 function 视频
    UploadUrl1(){
      return this.GLOBAL.serverSrcPhp + '/api/v1/upload/pzfiles';
    },
    handleSuccess1(response, file, fileList){
      // console.log(response);
      // console.log(file);
      if(response.code == 200){
        this.fileListVideo.push(response.data);
        this.fileListVideo.forEach(function(item, index, arr){
          item.urlCopy = item.url;
          item.url = fileList[index].url;
        })
      }else{
        if(response.message){
          this.$message.warning(response.message);
        }else{
          this.$message.warning('文件上传失败');
        }
      }
    },
    handleError1(err, file, fileList){
      this.$message.warning(`文件上传失败，请重新上传！`);
    },
    handleRemove1(file, fileList) {
      console.log(file, fileList);
      this.fileListVideo = fileList;
    },
    handleExceed1(files, fileList) {
      this.$message.warning(`平台支持最多上传六张图片！`);
    },
    beforeRemove1(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    // 保存方法
    saveFun(formName, type){
      const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let strengthArr = [];
            if(this.ruleForm.word1){
              strengthArr.push({
                "strength": this.ruleForm.word1
              })
            }
            if(this.ruleForm.word2){
              strengthArr.push({
                "strength": this.ruleForm.word2
              })
            }
            if(this.ruleForm.word3){
              strengthArr.push({
                "strength": this.ruleForm.word3
              })
            }
            if(this.ruleForm.word4){
              strengthArr.push({
                "strength": this.ruleForm.word4
              })
            }
            if(that.fileListVideo.length == 0){
              that.$message.warning("LOGO不能为空！");
            }
            let fileArr = [];
            if(that.fileListPic.length == 0){
              that.$message.warning("图片不能为空！");
            }else{
              that.fileListPic.forEach(function (item, index, arr) {
                fileArr.push({
                  pic_id: item.id,
                  pic_url: item.urlCopy
                });
              })
            }
            this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner/savelinerbasic", {
              "button_type": type,
              "company_id": this.$route.query.id,
              "id": localStorage.getItem('liner_id'),
              "name": this.ruleForm.name,
              "strengths": strengthArr,
              "tonnage": this.ruleForm.weight,
              "passenger": this.ruleForm.passenger,
              "maiden_voyage": this.ruleForm.firstDate,
              "floor": this.ruleForm.floor,
              "length": this.ruleForm.length,
              "width": this.ruleForm.width,
              "pics": fileArr,
              "videos": [
                {
                  "video_id": that.fileListVideo[0].id,
                  "video_url": that.fileListVideo[0].urlCopy
                }
              ],
              "create_uid": sessionStorage.getItem('id'),
              "org_id": sessionStorage.getItem('orgID')
            }).then(res => {
              // console.log(res);
              if (res.data.code == 200) {
                that.$message({
                  type: 'success',
                  message: '创建成功!'
                });
                if(type == '1'){
                  // alert('保存');
                  // that.$router.back();
                  localStorage.removeItem('liner_id');
                  that.$router.push({
                    path: '/cruiseShip/cruiseShipDetail',
                    name: '邮轮管理/详情',
                    query: {
                      "id": that.$route.query.id
                    }
                  });
                }else if(type == '2'){
                  // alert('下一步');
                  // console.log(that.$parent);
                  localStorage.setItem('liner_id', res.data.data.liner_id);
                  that.$parent.next();
                }
              } else {
                if(res.data.message){
                  that.$message({
                    type: 'warning',
                    message: res.data.message
                  });
                }else{
                  that.$message({
                    type: 'warning',
                    message: '创建失败'
                  });
                }
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
      
    },

    cancalBtn(){
      const that = this;
      this.$confirm("是否取消本次添加?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "退出并保存",
        cancelButtonText: "退出并删除",
        type: "warning"
      }).then(() => {
        that.saveFun('ruleForm', 1);
      }).catch( action => {
        // console.log(action)
        if(action === 'cancel'){
          this.$router.push({
            path: '/cruiseShip/cruiseShipDetail',
            name: '邮轮管理/详情',
            query: {
              "id": this.$route.query.id
            }
          });
          localStorage.removeItem('liner_id');
        }
        
      });
      
    },

    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = 'http://yl.dayuntong.com' + file.url;
      this.dialogVisible = true;
    },

    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner/viewlinerbasic", {
        "id": localStorage.getItem('liner_id')
      }, ).then(function(response) {
        console.log('基础信息',response);
        if (response.data.code == '200') {
          that.ruleForm = {
            name: response.data.data.name,
            word1: response.data.data.strength[0] ? response.data.data.strength[0].strength : '',
            word2: response.data.data.strength[1] ? response.data.data.strength[1].strength : '',
            word3: response.data.data.strength[2] ? response.data.data.strength[2].strength : '',
            word4: response.data.data.strength[3] ? response.data.data.strength[3].strength : '',
            weight: response.data.data.tonnage,
            passenger: response.data.data.passenger,
            firstDate: response.data.data.maiden_voyage,
            floor: response.data.data.floor,
            length: response.data.data.length,
            width: response.data.data.width
          };

          that.fileListPic = response.data.data.pics;
          that.fileListPic.forEach(function(item, index, arr){
            item.url = 'http://yl.dayuntong.com' + item.pic_url;
            item.urlCopy = item.pic_url;
          })
          that.fileListVideo = response.data.data.videos;
          that.fileListVideo.forEach(function(item, index, arr){
            item.url = 'http://yl.dayuntong.com' + item.pic_url;
            item.urlCopy = item.pic_url;
          })
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    loadCompany(){
      const that = this;
      
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner-company/listall", {
        "company_name": "",
        "limit": 0
      }, ).then(function(response) {
        console.log('邮轮公司',response);
        if (response.data.code == '200') {
          that.companyList = response.data.data.list;
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    loadLiner(){
      const that = this;
      this.linerList = [];
      this.ruleForm.liner_id = '';
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/liner/liner/listall", {
        "company_id": this.ruleForm.company_id,
        "name": "",
        "limit": 0
      }, ).then(function(response) {
        console.log('邮轮',response);
        if (response.data.code == '200') {
          that.linerList = response.data.data.list;
        } else {
          if(response.data.message){
            that.$message.warning(response.data.message);
          }else{
            that.$message.warning("加载数据失败~");
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    this.loadCompany();
    if(localStorage.getItem('liner_id')){
      this.loadData();
    }
  },
  mounted() {

  }
}

</script>
<style lang="scss">
  .curiseShipBaseMsg{
    .tagCls{
      margin-right: 12px;
    }
    .input-new-tag{
      width: 30%;
    }
    .buttonDv{
      overflow: hidden;
      margin: 12px auto;
      .el-button{
        float: right;
        margin-right: 18px;
      }
    }
    .el-upload-list__item{
      width: 148px !important;
    }
    padding-bottom: 50px;
    .shortItem{
      width: 30%;
      display: inline-block;
    }
    .inputWidth{
      width: 90%;
    }
    .marginBtm{
      margin-bottom: 18px;
    }
  }
</style>
