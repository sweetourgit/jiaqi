<template>
  <div class="visalist">
    <div>
      <div class="button">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="nextMessage('ruleForm')">下一步</el-button>
      </div>
      <div class="bother">
        <div class="left">
          <div class="one">
            <div class="border">1</div>
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
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="ruleForm.name" class="messagename" placeholder="请输入产品名称"></el-input>
              <span class="Numbers">{{ruleForm.name.length}}/30字</span>
            </el-form-item>
             <el-form-item label="亮点词" prop="highlightWords">
              <span class="redStar">*</span>
              <el-input v-model="ruleForm.highlightWords" class="Words" placeholder="请输入产品亮点词" @blur="highlightWords()"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords.length}}/8字</span>
              <div class="cognate" v-show="cognateShow">亮点词不能为空</div>
            </el-form-item>
            <el-form-item prop="highlightWords1" class="Words1">
              <el-input v-model="ruleForm.highlightWords1" class="Words" placeholder="请输入产品亮点词" @blur="highlightWords()"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords1.length}}/8字</span>
            </el-form-item>
            <el-form-item prop="highlightWords2" class="Words2">
              <el-input v-model="ruleForm.highlightWords2" class="Words" placeholder="请输入产品亮点词" @blur="highlightWords()"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords2.length}}/8字</span>
            </el-form-item>
            <el-form-item prop="highlightWords3" class="Words3">
              <el-input v-model="ruleForm.highlightWords3" class="Words" placeholder="请输入产品亮点词" @blur="highlightWords()"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords3.length}}/8字</span>
            </el-form-item>
            <el-form-item label="签证国家地区" prop="region" class="mt80">
              <el-autocomplete class="group-no messagename" v-model="ruleForm.region" :fetch-suggestions="querySearch" placeholder="请输入" :trigger-on-focus="false" @select="departure"></el-autocomplete>
            </el-form-item>
            <!--头图上传-->
            <el-form-item label="头图" ref="avatarImages" prop="avatarImages">
              <span class="redStar_01">*</span>
              <div class="img_upload">
                <template v-for="(item, index) in ruleForm.avatarImages">
                  <img class="img_list" :key="item.id" src="item.url" alt="" @click="imgClickShow(item)">
                  <div class="img_div" :key="index" @click="imgDelete(item)">x</div>
                </template>
              </div>
              <div class="figure" @click="addFigure()">
                <span>+</span>
                <div>上传</div>
              </div>
              <div v-show="isImgUrlShow" class="show_div">
                <img class="show_img" :src="imgUrlShow" alt="">
              </div>
              <span v-if="isInfoImg" style="position: absolute; top: 70px; left: 10px; font-size: 12px; color: #f56c6c;">请选择1张图片</span>
            </el-form-item>
            <el-dialog width='1300px' top='5vh' append-to-body title="图片选择" :visible.sync="imgUpload" custom-class="city_list">
              <MaterialList :imgData="imgData" :isImg="true" v-on:checkList="checkList" v-on:closeButton="imgUpload = false" v-on:isInfoImg="firstFigure"></MaterialList>
            </el-dialog>
            <!--头图上传END-->
            <!--轮播图上传-->
            <el-form-item label="轮播图" ref="shuffling" prop="shuffling">
              <span class="redStar_02">*</span>
              <div class="img_upload_slideshow">
                <template v-for="(item, index) in ruleForm.shuffling">
                  <img class="img_list" id="showDiv" :key="item.pictureID" src="item.picturePath" alt="" @click="imgClickShowAvatar(item)">
                  <div class="img_div" :key="index" @click="imgDeleteAvatar(item)">x</div>
                </template>
              </div>
              <div class="figure" @click="handleImgUploadAvatar()">
                <span>+</span>
                <div>上传</div>
              </div>
              <div v-show="isImgUrlShowAvatar" class="show_div">
                <img class="show_img" :src="imgUrlShowAvatar" alt="">
              </div>
              <span v-if="isInfo" style="position: absolute; top: 70px; left: 10px; font-size: 12px; color: #f56c6c;">请选择3-6张图片</span>
            </el-form-item>
            <!--轮播图弹窗-->
            <el-dialog width='1300px' top='5vh' append-to-body title="图片选择" :visible.sync="imgUploadAvatar" custom-class="city_list">
              <MaterialList :imgData="imgDataAvatar" :isType="true" v-on:isInfo="isInfoAvatar" v-on:checkList="checkListAvatar" v-on:closeButton="imgUploadAvatar = false"></MaterialList>
            </el-dialog>
            <!--轮播图上传END-->
            <el-form-item label="送签地" prop="sendVisa">
	          <el-radio-group v-model="ruleForm.sendVisa">
	            <el-radio v-for="(sendVisa,index) in authData" class="sendArea" :label="sendVisa.id" :key="sendVisa.id" name="type">{{sendVisa.areaName}}</el-radio>
	          </el-radio-group>
            </el-form-item>
            <el-form-item label="签证受理地区" prop="visaRegion">
              <el-checkbox-group v-model="ruleForm.visaRegion">
                <el-checkbox v-for="(visaRegion,index) in regionData" :label="visaRegion.id" :key="visaRegion.id" name="type" class="regionList">{{visaRegion.areaName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="签证类型" prop="visaType">
              <el-radio-group v-model="ruleForm.visaType">
                <el-radio label="1">单次旅游签</el-radio>
                <el-radio label="2">5年旅游签</el-radio>
                <el-radio label="3">10年多次旅游签</el-radio>
                <el-radio label="4">探亲访友签</el-radio>
                <el-radio label="5">商务签证</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="签证流程类型" prop="visaProcessType">
              <el-radio-group v-model="ruleForm.visaProcessType">
                <el-radio label="1">贴纸签</el-radio>
                <el-radio label="2">电子签</el-radio>
                <el-radio label="3">另纸签</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否面试" prop="interview">
              <el-radio-group v-model="ruleForm.interview">
                <el-radio label="1">否</el-radio>
                <el-radio label="2">是</el-radio>
                <el-radio label="3">使馆签证面试</el-radio>
                <el-radio label="4">录指纹</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="签证有效期" prop="visaDate">
              <el-input v-model="ruleForm.visaDate" class="messagename" placeholder="请输入签证有效期"></el-input>
            </el-form-item>
            <el-form-item label="入境次数" prop="entryNumber">
              <el-input v-model="ruleForm.entryNumber" class="messagename" placeholder="请输入入境次数"></el-input>
            </el-form-item>
            <el-form-item label="停留天数" prop="stayDays">
              <el-input v-model="ruleForm.stayDays" class="messagename" placeholder="请输入停留次数"></el-input>
            </el-form-item>
            <el-form-item label="产品概括" prop="content">
              <div class="cost_content">
                <vue-editor v-model="ruleForm.content"></vue-editor>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- <visa-message :teamID="teamID" :variable="variable"></visa-message> -->
  </div>
</template>
  
<script>
import {VueEditor} from 'vue2-editor' // 引用富文本编辑器组件
import MaterialList from '@/common/visaImage' // 头图图片库组件
//import visaMessage from './visaMessage' // 签证信息组件
export default {
  name: "visaProducts",
    components: {
      VueEditor, // 富文本编辑器
      MaterialList, // 图片库
      //"visa-message":visaMessage, // 签证信息组件
    },
  data() {
    return {
      //basisShow:true, // 父组件  点击下一步显示子组件，隐藏父组件
      ruleForm: {
        name: '',//产品名称
        highlightWords:'',//亮点词
        highlightWords1:'',//亮点词
        highlightWords2:'',//亮点词
        highlightWords3:'',//亮点词
        region: '', //签证国家地区
        avatarImages: [], //头图
        shuffling:[],//轮播图
        sendVisa: [],//送签地
        visaRegion: [],//签证受理地区
        visaType:'',//签证类型
        visaProcessType:'',//签证流程类型
        interview:'',// 是否面试
        visaDate:'',// 签证有效期
        entryNumber:'',//入境次数
        stayDays:'',//停留天数
        content:'',//产品概况
      },
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'change' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'change' }
        ],
        highlightWords: [
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
        ],
        highlightWords1: [
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
        ],
        highlightWords2: [
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
        ],
        highlightWords3: [
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
        ],
        region: [
          { required: true, message: '请输入签证国家地区', trigger: 'change' }
        ],
        visaRegion: [
          { type: 'array', required: true, message: '请至少选择一个签证受理地区', trigger: 'change' }
        ],
        sendVisa: [
          { required: true, message: '请选择送签地区', trigger: 'change' }
        ],
        visaType: [
          { required: true, message: '请选择签证类型', trigger: 'change' }
        ],
        visaProcessType: [
          { required: true, message: '请选择签证流程类型', trigger: 'change' }
        ],
        interview: [
          { required: true, message: '请选择是否面试', trigger: 'change' }
        ],
        visaDate: [
          { required: true, message: '请输入签证有效期', trigger: 'change' }
        ],
        entryNumber: [
          { required: true, message: '请输入入境次数', trigger: 'change' }
        ],
        stayDays: [
          { required: true, message: '请输入停留天数', trigger: 'change' }
        ],
      },
      areaID:0, // 国家地区ID
      authData:[], // 送签地数组
      regionData:[], // 受理地区数组
      //头图上传 ========
      isImgUrlShow: false,
      imgUrlShow: '', // 点击查看图片
      imgUpload: false,     // 上传弹窗
      imgData: [],
      isInfoImg:false,
      pictureID:0, // 选择头图获取ID
      //END==================
      // 轮播图上传 =======
      isImgUrlShowAvatar: false,
      imgUrlShowAvatar: '', // 点击查看图片
      imgUploadAvatar: false,     // 上传弹窗
      imgDataAvatar: [],
      isInfo: false, // 验证
      // 轮播图END =======
      pid:'',
      teamID:0, // 进入签证信息传值teamID
      variable: 0, //设置一个变量展示弹窗
      visaID:0, // 添加成功后获取的产品ID
      region:'',
      cognateShow:false,
    };
  },
  created() {
  	this.getSendVisa();
  	this.getVisaRegion();
    setTimeout(() => {
      this.getProduct();
    }, 200);
  },
  methods: {
    highlightWords(){
      if(this.ruleForm.highlightWords !== '' || this.ruleForm.highlightWords1 !== '' || this.ruleForm.highlightWords2 !== '' || this.ruleForm.highlightWords3 !== ''){
            this.cognateShow = false;
        }
    },
    getProduct(){ // 获取一条产品信息
      this.$http.post(this.GLOBAL.serverSrc + "/visa/visapro/api/get",{
        id:sessionStorage.getItem('commodityID')
      }).then(res => {
          if (res.data.isSuccess == true) {
            let data = res.data.object;
            this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforget",{
              id:data.visaPod
            }).then(res => {
              if(res.data.isSuccess == true){
                this.region = res.data.object.areaName;
                this.areaID = res.data.object.id 
                this.ruleForm.region = this.region; // 签证国家地区
              }
            })
            this.$http.post(this.GLOBAL.serverSrc + "/tpk/picture/api/get",{ // 获取头图
              id:data.pictureID
            }).then(res => {
              if(res.data.isSuccess == true){
                this.ruleForm.avatarImages.push(res.data.object);
              }
            })
            this.ruleForm.name = data.visaTitle; // 产品名称
            this.ruleForm.highlightWords = data.strengths[0].strength; // 亮点词
            this.ruleForm.highlightWords1 = data.strengths[1].strength; // 亮点词
            this.ruleForm.highlightWords2 = data.strengths[2].strength; // 亮点词
            this.ruleForm.highlightWords3 = data.strengths[3].strength; // 亮点词
            this.pictureID = data.pictureID; // 初始获取头图ID
            this.ruleForm.shuffling = data.pepeatpic; // 轮播图
            this.ruleForm.sendVisa = data.signature[0].visaHandleID; // 送签地
            this.ruleForm.visaRegion = []; // 受理地区
            for(let i=0; i < data.reception.length;i++){
             this.ruleForm.visaRegion.push(data.reception[i].visaHandleID)
            }
            this.ruleForm.visaType =data.visaType + ''; // 签证类型
            this.ruleForm.visaProcessType = data.technologicalType + ''; // 签证流程类型
            this.ruleForm.interview = data.interview + '' ; // 是否面试
            this.ruleForm.visaDate = data.validity; // 签证有效期
            this.ruleForm.entryNumber = data.entry; // 入境次数
            this.ruleForm.stayDays = data.staydays; // 停留天数
            this.ruleForm.content = data.overview; // 产品概括


          }
      })
    },
    querySearch(queryString1, cb) { // 搜索国家地区模糊查询
      this.vague = [];
      this.$http.post(this.GLOBAL.serverSrc + "/universal/area/api/areainforlist", {
        object: {
          areaName: queryString1
        }
      })
      .then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.vague.push({
            id: res.data.objects[i].id,
            value: res.data.objects[i].areaName
          });
        }
        var results = queryString1 ? this.vague.filter(this.createFilter(queryString1)): [];
        cb(results);
      })
      .catch(err => {
        console.log(err);
      });
    },
    departure(item) { // 搜索国家地区模糊查询获取ID
      this.areaID = item.id;
    },
    createFilter(queryString1) {
      return restaurant => {
        return restaurant.value;
      };
    },
  	getSendVisa(){ // 获取送签地内容
	   this.$http.post(this.GLOBAL.serverSrc + '/visa/visapro/api/visahandlelist',{
	   	"object":{
		   "type":1
	   	}
	   }).then(res => {
   			this.authData=res.data.objects;
		 }) 
  	},
  	getVisaRegion(){ // 获取受理地区内容
  	   this.$http.post(this.GLOBAL.serverSrc + '/visa/visapro/api/visahandlelist',{
	   	"object":{
		   "type":2
	   	}
	   }).then(res => {
   			this.regionData=res.data.objects;
		 }) 
  	},
    addFigure(){ // 点击头图上传按钮，显示图片弹窗
      this.imgData = this.ruleForm.avatarImages.map(v => v.pictureID);
      this.imgUpload = true;
    },
    // 图片添加
    checkList(data) {
      this.ruleForm.avatarImages = data.map(v => {
        this.pictureID = data[0].id // 选择头图获取ID
        return {
          pictureID: v.id,
        }
      })
      //this.pictureID = this.ruleForm.avatarImages[0].img_ID // 选择头图获取ID
    },
    imgClickShow(data){ // 点击图片查看预览 
      // this.$http.post('http://test.dayuntong.com' + '/picture/api/get',{
      //     "id": data.img_ID,
      // }).then(res => {
      //   this.isImgUrlShow = true;
      //   this.imgUrlShow = "http://192.168.2.65:3009/upload" + res.data.object.url;
      // })
    },
    imgDelete(data){ // 删除单张图片
      this.ruleForm.avatarImages.splice(this.ruleForm.avatarImages.indexOf(data), 1);
        if(this.ruleForm.avatarImages.length === 1){
          this.isInfoImg = false;
        }else{
          this.isInfoImg = true;
        }
    },
    firstFigure(data){
      this.isInfoImg = data;
      if(!data) {
        this.$refs.avatarImages.clearValidate();
      }
    },
    // 轮播图上传=================
    // 点击图片查看
    imgClickShowAvatar(data) {
      // this.$http.post('http://test.dayuntong.com' + '/picture/api/get',{
      //     "id": data.img_ID,
      // }).then(res => {
      //   this.isImgUrlShowAvatar = true;
      //   this.imgUrlShowAvatar = "http://192.168.2.65:3009/upload" + res.data.object.url;
      // })
    },
    // 上传按钮
    handleImgUploadAvatar() {
      this.imgDataAvatar = this.ruleForm.shuffling.map(v => v.pictureID);
      this.imgUploadAvatar = true;
    },
    // 点击删除图片
    imgDeleteAvatar(data) {
      this.ruleForm.shuffling.splice(this.ruleForm.shuffling.indexOf(data), 1);
      if(this.ruleForm.shuffling.length >= 3 && this.ruleForm.shuffling.length <= 6){
        this.isInfo = false;
      }else{
        this.isInfo = true;
      }
    },
    // 图片添加
    checkListAvatar(data) {
      data.forEach( v => {
        this.ruleForm.shuffling.push({
          pictureID:v.id,
          picturePath:v.url,
        })
      })
      // this.ruleForm.shuffling = data.map(v => {
      //   return {
      //     pictureID:v.id,
      //     picturePath:v.url,
      //   }
      // })
    },
    isInfoAvatar(data) {
      this.isInfo = data;
      if(!data) {
        this.$refs.shuffling.clearValidate();
      }
    },
    nextMessage(formName){
      if(this.ruleForm.highlightWords.length == 0 && this.ruleForm.highlightWords1.length == 0 &&this.ruleForm.highlightWords2.length == 0 &&this.ruleForm.highlightWords3.length == 0 ){
        this.cognateShow = true;
        return;
      }else {
        this.cognateShow = false;
      }
       // 送签地
      let visaSend=[];
      for(let i=0;i<this.authData.length;i++){
       if(this.ruleForm.sendVisa==this.authData[i].id){
         visaSend.push({
           podName : this.authData[i].areaName,
           visaHandleID:this.authData[i].id
         })
       }
      }
      // 受理地区
      let acceptRegion = [] ;  
      for(let i = 0; i < this.ruleForm.visaRegion.length; i++){
        for(let j=0;j<this.regionData.length;j++){        
           if(this.ruleForm.visaRegion[i]==this.regionData[j].id){
            acceptRegion.push({
              podName:this.regionData[j].areaName,
              visaHandleID:this.regionData[j].id,
            })
          }
        }
      }
      // let shuffling = [] ;  // 轮播图
      // for(let i = 0; i < this.ruleForm.shuffling.length; i++){
      //   shuffling.push({
      //     pictureID:this.ruleForm.shuffling[i].img_ID,
      //     picturePath:this.ruleForm.shuffling[i].img_url,
      //   })
      // }
      if(this.ruleForm.avatarImages.length !== 1){
        this.isInfoImg = true;
      }
      if(this.ruleForm.shuffling.length < 3 || this.ruleForm.shuffling.length > 6){
        this.isInfo = true;
        return;
      }
      let strengths=[]; // 亮点词
      if(this.ruleForm.highlightWords!=""){
          strengths.push({"strength":this.ruleForm.highlightWords})
      }
      if(this.ruleForm.highlightWords1!=""){
          strengths.push({"strength":this.ruleForm.highlightWords1})
      }
      if(this.ruleForm.highlightWords2!=""){
          strengths.push({"strength":this.ruleForm.highlightWords2})
      }
      if(this.ruleForm.highlightWords3!=""){
          strengths.push({"strength":this.ruleForm.highlightWords3})
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let basis = [{ 
            name:this.ruleForm.name
          },{
            highlightWords:strengths
          },{
            region:this.areaID
          },{
            pictureID:this.pictureID
          },{
            shuffling:this.ruleForm.shuffling
          },{
            signature:visaSend
          },{
            reception:acceptRegion
          },{
            visaType:this.ruleForm.visaType
          },{
            technologicalType:this.ruleForm.visaProcessType
          },{
            interview:this.ruleForm.interview
          },{
            validity:this.ruleForm.visaDate
          },{
            entry:this.ruleForm.entryNumber
          },{
            staydays:this.ruleForm.stayDays
          },{
            overview:this.ruleForm.content
          }];
          console.log(basis)
          let basisInformation = JSON.stringify(basis)
          sessionStorage.setItem('message',basisInformation);
          this.$router.push({ path: "/editVisaMessage" }); // 基本信息添加完跳转到签证信息页面
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
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
.visalist{max-width: 1200px; overflow: hidden;margin:0 0 50px 0;}
.button{float:right;}
.bother{clear:both;}
.left{float:left;width:150px;}
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
.messagename{
  float:left;
  width:472px;
}
.Numbers{
  float:left;
  margin:0 10px 0 20px;
}
.Words{
  float:left;
  width:200px;
  margin:0 0 0 0;
}
.Words1{
  position:absolute;
  top:62px;
  right:240px;
}
.Words2{
  position:absolute;
  top:122px;
  left:0px;
}
.Words3{
  position:absolute;
  top:122px;
  right:240px;
}
.mt80{
  margin-top:80px;
}
.cost_content{
  width:780px;
  overflow: hidden;
  text-align: left;
  background: #FFFFFF
}
.img_upload{
  float:left;
}
.img_list {
  float: left;
  margin: 5px 0 0 10px;
  width: 80px;
  height: 80px;
  user-select:none;
}
.img_list:hover {
  cursor:pointer;
}
.img_div {
  float: left;
  margin: 9px 0 0 0;
  width: 10px;
  height: 18px;
  text-align: center;
  line-height: 16px;
  font-size: 18px;
  background: #FFFFFF;
  user-select:none;
}
.img_div:hover {
  cursor:pointer;
}
.figure{
  width:80px ;
  height:80px;
  border:1px soild #d9d9d9;
  background:#f2f2f2;
  text-align:center;
  line-height:20px;
  cursor:pointer;
  float:left;
}
.img_upload_slideshow {
  float: left;
}
.figure span{
  font-size:24pt;
  line-height:50px;
}
.sendArea{
	margin:0 15px 0 0;
}
.regionList{
	float:left;
	margin:0 15px 0 0;
}
.redStar_01{ color: #f56c6c; float: left; margin-left:-50px;}
.redStar_02{ color: #f56c6c; float: left; margin-left:-65px;}
.cognate{ color:red;position:absolute;left:0px;top:30px;font-size: 12px;}
.redStar{ color: #f56c6c; float: left; margin-left:-64px;}
</style>


