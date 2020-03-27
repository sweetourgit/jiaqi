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
          <el-input v-model="ruleForm.name" placeholder="请输入" class="inputWidth" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="亮点词：" prop="word" label-width="140px">
          <el-input v-model="ruleForm.word1" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
          <el-input v-model="ruleForm.word2" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
          <el-input v-model="ruleForm.word3" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
          <el-input v-model="ruleForm.word4" class="inputWidth marginBtm" placeholder="请输入" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="邮轮：" prop="liner_id" label-width="140px">
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
            {{tag.departure_name}}
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
            {{tag.destination_name}}
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
            {{tag.returnplace_name}}
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
          <image-input
            :list="ruleForm.logoPic"
            :numLimit="1"
            @wakeup-material="logoSelectHandler"
            @remove-handler="removeLogoHandler"
          ></image-input>
        </el-form-item>
        <el-form-item label="轮播图：" prop="width" label-width="140px">
          <image-input
            :list="ruleForm.pic"
            :numLimit="6"
            @wakeup-material="picSelectHandler"
            @remove-handler="removePicHandler"
          ></image-input>
          <span>轮播图3-6张</span>
        </el-form-item>
        <el-form-item label="出游人群：" prop="person" label-width="140px">
          <el-checkbox-group v-model="ruleForm.person">
            <el-checkbox v-for="item in personList" :key="item.id" :label="item.id" :value="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
          
        </el-form-item>
        <el-form-item label="主题：" prop="theme" label-width="140px">
          <el-checkbox-group v-model="ruleForm.theme">
            <el-checkbox v-for="item in themeList" :key="item.id" :label="item.id" :value="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
          
        </el-form-item>
        <el-form-item label="提前报名天数：" prop="days" label-width="140px">
          <el-input v-model="ruleForm.days" placeholder="请输入" class="inputWidth" ></el-input>
        </el-form-item>
        <el-form-item label="产品概况：" prop="introduce" label-width="140px">
          <el-input v-model="ruleForm.introduce" placeholder="请输入" class="inputWidth" type="textarea"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <material-list
      ref="materialListRef">
    </material-list>
  </div>
</template>
<script type="text/javascript">
import imageInput from '@/page/contentInfo/cruiseShip/comp/image-input'
import materialList from '@/page/contentInfo/cruiseShip/comp/material-list'
import { getPictureAction } from '@/page/productManagement/listInfo/api.js'
export default {
  name: "curiseShipBaseMsg",
  components: { imageInput, materialList },
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
        introduce: '',
        logoPic: [],
        pic: []
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
        this.originTag.push({
          "departure_id": item.id,
          "departure_name": item.value
        });
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
        this.destinationTag.push({
          "destination_id": item.id,
          "destination_name": item.value
        });
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
        this.returnDesTag.push({
          "returnplace_id": item.id,
          "returnplace_name": item.value
        });
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
    // 头图选择
    logoSelectHandler(idList){
      let cb= (list) => {
        if(list.length > 1){
          this.$message.error(`头图数量限制为1张，当前选择${list.length}张，将截取第一张`);
          list= list.splice(0, 1);
        }
        console.log(list);
        this.getPictureFun(this.ruleForm.logoPic, list);
        console.log(this.ruleForm.logoPic);
      }
      this.$refs.materialListRef.wakeup(idList, cb);
    },
    
    // 头图删除
    removeLogoHandler(){
      alert("删除！");
      this.ruleForm.logoPic = [];
    },

    // 轮播图选择
    picSelectHandler(idList){
      let cb= (list) => {
        // console.log(list);
        if((this.ruleForm.pic.length + list.length) > 6){
          this.$message.warning("最多支持六张图片上传！");
          list = list.splice(0, (6 - this.ruleForm.pic.length));
        }
        this.getPictureFun(this.ruleForm.pic, list);
      }
      this.$refs.materialListRef.wakeup(idList, cb);
    },

    // 轮播图删除
    removePicHandler(i){
      console.log(this.ruleForm.pic, i);
      this.ruleForm.pic.splice(i, 1);
      console.log(this.ruleForm.pic);
    },

    getPictureFun(obj, list){
      // console.log(list);
      // let imgArr = [];
      list.forEach(el => {
        // console.log(el);
        getPictureAction.bind(this)(el).then(res => {
          console.log(res);
          const item = {
            id: el,
            url: res.url
          }
          obj.push(item);
        }).catch(err => {
          const item = {
            id: el,
            url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
          }
          obj.push(item);
        })
      })
      
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
            let filePic = [];
            if(that.ruleForm.logoPic.length == 0){
              that.$message.warning("头图不能为空！");
              return;
            }else{
              that.ruleForm.logoPic.forEach(function (item, index, arr) {
                filePic.push({
                  pic_id: item.id,
                  pic_url: item.url
                });
              })
            }
            let fileArr = [];
            if(that.ruleForm.pic.length < 3){
              that.$message.warning("轮播图最少上传3张！");
              return;
            }else{
              that.ruleForm.pic.forEach(function (item, index, arr) {
                fileArr.push({
                  pic_id: item.id,
                  pic_url: item.url
                });
              })
            }

            // console.log(this.ruleForm.person);
            let personArr = [];
            this.ruleForm.person.forEach(function(item, index, arr){
              personArr.push({
                crowd_id: item
              })
            })
            // console.log(this.ruleForm.theme);
            let themeArr = [];
            this.ruleForm.theme.forEach(function(item, index, arr){
              themeArr.push({
                theme_id: item
              })
            })

            let labelArr = [];
            this.labelTag.forEach(function(item, index, arr){
              labelArr.push({
                "lable_name": item
              })
            })
            this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/saveproductbasic", {
              "product_id": this.$route.query.id,
              "button_type": type,
              "product_name": this.ruleForm.name,
              "strength": strengthArr,
              "company_id": this.ruleForm.company_id,
              "liner_id": this.ruleForm.liner_id,
              "departure": this.originTag,
              "destination": this.destinationTag,
              "returnplace": this.returnDesTag,
              "confirm_type": this.ruleForm.orderType,
              "lable": labelArr,
              "head_image": filePic,
              "carousel_image": fileArr,
              "crowd": personArr,
              "theme": themeArr,
              "advance_enroll_day": this.ruleForm.days,
              "product_overview": this.ruleForm.introduce,
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
                  // localStorage.removeItem('liner_id');
                  that.$router.push({
                    path: '/productList/productLiner',
                    name: '邮轮'
                  });
                }else if(type == '2'){
                  // alert('下一步');
                  // console.log(that.$parent);
                  // localStorage.setItem('liner_id', res.data.data.liner_id);
                  // that.$router.query.id = res.data.data.id
                  that.$router.push({
                    query:{'id': res.data.data.id}
                  })
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
          that.$router.push({
            path: '/productList/productLiner',
            name: '邮轮'
          });
        }
        
      });
      
    },

    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcYL + "/linerapi/v1/product/product/getproductbasic", {
        "product_id": this.$route.query.id
      }, ).then(function(response) {
        // console.log('基础信息',response);
        if (response.data.code == '200') {
          that.ruleForm = {
            name: response.data.data.info.product_name,
            word1: response.data.data.info.strength[0] ? response.data.data.info.strength[0].strength : '',
            word2: response.data.data.info.strength[1] ? response.data.data.info.strength[1].strength : '',
            word3: response.data.data.info.strength[2] ? response.data.data.info.strength[2].strength : '',
            word4: response.data.data.info.strength[3] ? response.data.data.info.strength[3].strength : '',
            company_id: response.data.data.info.company_id,
            liner_id: response.data.data.info.liner_id,
            orderType: response.data.data.info.confirm_type.toString(),
            operationLabel: '',
            person: [],
            theme: [],
            days: response.data.data.info.advance_enroll_day,
            introduce: response.data.data.info.product_overview,
            pic: [],
            logoPic: []
          };
          response.data.data.info.lable.forEach(function(item, index, arr){
            that.labelTag.push(item.lable_name);
          })
          // console.log(that.ruleForm.operationLabel)
          response.data.data.info.crowd.forEach(function(item, index, arr){
            that.ruleForm.person.push(item.crowd_id.toString());
          })
          // console.log(that.ruleForm.person)
          response.data.data.info.theme.forEach(function(item, index, arr){
            that.ruleForm.theme.push(item.theme_id.toString());
          })
          // console.log(that.ruleForm.theme)
          that.originTag = response.data.data.info.departure;
          that.destinationTag = response.data.data.info.destination;
          that.returnDesTag = response.data.data.info.returnplace;
          that.ruleForm.logoPic = response.data.data.info.head_image;
          that.ruleForm.logoPic.forEach(function(item, index, arr){
            item.url = item.pic_url;
            item.id = item.pic_id;
          })
          that.ruleForm.pic = response.data.data.info.carousel_image;
          that.ruleForm.pic.forEach(function(item, index, arr){
            item.url = item.pic_url;
            item.id = item.pic_id;
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
          if(that.$route.query.id){
            that.loadLiner()
          }
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
      if(this.$route.query.id){
        this.linerList = [];
        this.ruleForm.liner_id = '';
      }
      
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
    if(this.$route.query.id){
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
