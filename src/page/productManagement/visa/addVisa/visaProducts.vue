<template>
  <!-- <div class="visalist">
    <div v-show="basisShow">
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
              <el-input v-model="ruleForm.highlightWords" class="Words" placeholder="请输入产品亮点词"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords.length}}/8字</span>
            </el-form-item>
            <el-form-item prop="highlightWords1" class="Words1">
              <el-input v-model="ruleForm.highlightWords1" class="Words" placeholder="请输入产品亮点词"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords1.length}}/8字</span>
            </el-form-item>
            <el-form-item prop="highlightWords2" class="Words2">
              <el-input v-model="ruleForm.highlightWords2" class="Words" placeholder="请输入产品亮点词"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords2.length}}/8字</span>
            </el-form-item>
            <el-form-item prop="highlightWords3" class="Words3">
              <el-input v-model="ruleForm.highlightWords3" class="Words" placeholder="请输入产品亮点词"></el-input>
              <span class="Numbers">{{ruleForm.highlightWords3.length}}/8字</span>
            </el-form-item>
            <el-form-item label="签证国家地区" prop="region" class="mt80">
              <el-input v-model="ruleForm.region" class="messagename" placeholder="请输入签证国家地区"></el-input>
            </el-form-item>
            <el-form-item label="头图" prop="avatarImages">
              <div class="img_upload">
                <template v-for="(item, index) in ruleForm.avatarImages">
                  <img class="img_list" :key="item.img_ID" src="@/assets/image/pic.png" alt="" @click="imgClickShow(item)">
                  <div class="img_div" :key="index" @click="imgDelete(item)">x</div>
                </template>
              </div>
              <div class="figure" @click="addFigure()">
                <span>+</span>
                <div>上传</div>
              </div>
              <span v-if="isInfoImg" style="position: absolute; top: 35px; left: 10px; font-size: 12px; color: #f56c6c;">请选择1张图片</span>
            </el-form-item>
            <el-dialog width='1300px' top='5vh' append-to-body title="图片选择" :visible.sync="imgUpload" custom-class="city_list">
              <MaterialList :imgData="imgData" :isImg="true" v-on:checkList="checkList" v-on:closeButton="imgUpload = false" v-on:isInfoImg="firstFigure"></MaterialList>
            </el-dialog>
            <el-form-item label="轮播图" prop="shuffling">
              <div class="figure">
                <span>+</span>
                <div>上传</div>
              </div>
            </el-form-item>
            <el-form-item label="送签地" prop="sendVisa">
              <el-radio-group v-model="ruleForm.sendVisa">
                <el-radio label="1">北京</el-radio>
                <el-radio label="2">沈阳</el-radio>
                <el-radio label="3">上海</el-radio>
                <el-radio label="4">广州</el-radio>
                <el-radio label="5">青岛</el-radio>
                <el-radio label="6">成都</el-radio>
                <el-radio label="7">武汉</el-radio>
                <el-radio label="8">大连</el-radio>
                <el-radio label="9">西安</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="签证受理地区" prop="visaRegion">
              <el-checkbox-group v-model="ruleForm.visaRegion">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
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
    <visa-message :teamID="teamID" :variable="variable"></visa-message>
  </div> -->
</template>
  
<script>
import {VueEditor} from 'vue2-editor' // 引用富文本编辑器组件
import MaterialList from '@/common/Image' // 图片库组件
import visaMessage from './visaMessage' // 签证信息组件
export default {
  name: "visaProducts",
    components: {
      VueEditor, // 富文本编辑器
      MaterialList, // 图片库
      "visa-message":visaMessage, // 签证信息组件
    },
  data() {
    return {
      basisShow:true, // 父组件  点击下一步显示子组件，隐藏父组件
      ruleForm: {
        name: '',//产品名称
        highlightWords:'',//亮点词
        highlightWords1:'',//亮点词
        highlightWords2:'',//亮点词
        highlightWords3:'',//亮点词
        region: '', //签证国家地区
        avatarImages: [], //头图
        shuffling:'',//轮播图
        sendVisa:'',//送签地
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
          { required: true, message: '请输入亮点词', trigger: 'change' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
        ],
        highlightWords1: [
          { required: true, message: '请输入亮点词', trigger: 'change' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
        ],
        highlightWords2: [
          { required: true, message: '请输入亮点词', trigger: 'change' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'change' }
        ],
        highlightWords3: [
          { required: true, message: '请输入亮点词', trigger: 'change' },
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
      imgUpload: false, // 上传弹窗
      imgData: [],
      isInfoImg:false,//头图验证
      pid:'',
      teamID:0, // 进入签证信息传值teamID
      variable: 0, //设置一个变量展示弹窗
    };
  },
  created() {
  },
  methods: {
    addFigure(){ // 点击头图上传按钮，显示图片弹窗
      this.imgData = this.ruleForm.avatarImages.map(v => v.img_ID);
      this.imgUpload = true;
    },
    // 图片添加
    checkList(data) {
      this.ruleForm.avatarImages = data.map(v => {
        return {
          img_ID: v,
        }
      })
    },
    imgClickShow(){ // 点击图片查看预览 

    },
    imgDelete(){ // 删除单张图片

    },
    firstFigure(data){
      this.isInfoImg = data;
      if(!data) {
        //this.$refs.avatarImages.clearValidate();
      }
    },
    nextMessage(formName){ // 点击下一步进入签证信息页面
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.variable++;
          this.basisShow = false;
        } else {
          console.log('error submit!!');
          return false;
        }
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
  width:470px;
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
.figure span{
  font-size:24pt;
  line-height:50px;
}
</style>


