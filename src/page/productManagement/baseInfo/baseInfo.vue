<template>
    <div class="warp">
      <div class="btn">
        <el-button plain class="btn-button">取消</el-button>
        <el-button class="btn-button" style="background:#3095fa;color:#fff">保存</el-button>
      </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="padding-left:50px">
          <el-form-item label="产品名称" prop="productName">
            <el-input maxlength=30 v-model="ruleForm.productName" class="productName-input" placeholder="含.~+/_可用，（）仅能用在句尾，30个汉字以内"></el-input>
            <span class="length-span">{{ruleForm.productName.length}}/30字</span>
          </el-form-item>
          <el-form-item label="出游类型" prop="travelType">
            <el-radio-group v-model="ruleForm.travelType" class="travelType-radio">
              <el-radio label="1" value="1">国内</el-radio>
              <el-radio label="2" value="2">境外</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出发地" prop="placeDeparture">
              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
              </el-autocomplete>
          </el-form-item>
          <el-form-item label="目的地" prop="destination">
              <el-autocomplete class="inputBox" clearable placeholder="输入目的地名称" :fetch-suggestions="querySearch1" v-model="ruleForm.destination" :trigger-on-focus="false"></el-autocomplete>
          </el-form-item>
          <div style="overflow:hidden">
            <el-form-item style="width:300px; float:left" label='行程天数' prop="travelDays">
              <el-input style="width:150px;left:8px" v-model="ruleForm.travelDays" placeholder="请输入天数"></el-input><span class="travelDays-span">天</span>
            </el-form-item>
            <el-form-item class="number-day" style="width:300px; float:left;margin-left:-120px" prop="travelNight">
              <el-input style="width:150px;left:18px" v-model="ruleForm.travelNight" placeholder="请输入晚数"></el-input>
              <span class="travelNight">晚</span>
            </el-form-item>
          </div>
          <el-form-item label="订单确认类型" prop="orderConfirmationType">
            <el-radio-group v-model="ruleForm.orderConfirmationType" class="orderConfirmationType-radio">
              <el-radio label="1" value="1">及时确认</el-radio>
              <el-radio label="2" value="2">二次确认</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="亮点词" prop="highlightWords1">
            <el-input maxlength=8 v-model="ruleForm.highlightWords1" class="highlightWords-input1" placeholder="8个字以内"></el-input>
            <span class="span1">{{ruleForm.highlightWords1.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords2" style="width:378px;">
            <el-input maxlength=8 v-model="ruleForm.highlightWords2" class="highlightWords-input2" placeholder="8个字以内"></el-input><br>
            <span class="span">{{ruleForm.highlightWords2.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords3" style="width:378px;">
            <el-input maxlength=8 v-model="ruleForm.highlightWords3" class="highlightWords-input2" placeholder="8个字以内"></el-input><br>
            <span class="span">{{ruleForm.highlightWords3.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords4" style="width:378px;">
            <el-input maxlength=8 v-model="ruleForm.highlightWords4" class="highlightWords-input2" placeholder="8个字以内"></el-input><br>
            <span class="span">{{ruleForm.highlightWords4.length}}/8字</span>
          </el-form-item>
          <el-form-item label="运营标签" prop="operationLabel" ref="operationLabel">
            <div class="destination-input">
              <el-tag
                :key="tag2"
                v-for="tag2 in dynamicTags2"
                closable
                :disable-transitions="false"
                @close="handleClose2(tag2)">
                {{tag2}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible2"
                v-model="ruleForm.operationLabel"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm2"
                @blur="handleInputConfirm2">
                <input style="background:red;width:100px;height:200px" type="image" src="//static.huaweicloud.com/static/v2_resources/images/dev-index/slide3.jpg?sttl=20185293" alt="">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput2">请输入运营标签</el-button>
            </div>
          </el-form-item>

          <el-form-item label="头图" prop="avatarImages">
            <el-input v-model="ruleForm.avatarImages" disabled style="width:200px;float:left;margin-left:10px;position:relative">
            </el-input>
            <el-upload
            :on-preview="handleImgClick"
            class="upload-demo uploadimage"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
            :limit='1' accept=".jpg,.png,.gif"
            :on-remove="handleRemove">
            <el-button type="info">
              <div v-show="isShowImg" style="height:215px;width:330px;position:absolute;z-index:9999;top:50px;left:30px;border:10px solid #D7D7D7;background:#fdfdfd;">
                <img style="display:block;width:100%;height:100%;" :src="this.imgUrl" alt="">
              </div>
              上传</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="视频" prop="video">
            <el-input v-model="ruleForm.video" disabled style="width:200px;float:left;margin-left:10px;position:relative">
            </el-input>
            <el-upload
              class="upload-demo uploadimage"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture"
              :limit='1'
              :on-remove="handleRemoves1"
              :before-upload="beforeUploadVideo"
              :on-progress="uploadVideoProcess">
              <el-button type="info">上传</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="轮播图" prop="slideshow">
            <el-input v-model="ruleForm.slideshow" disabled style="width:540px;float:left;margin-left:10px;position:relative" placeholder="3-6个轮播图">
            </el-input>
            <el-upload
            :on-preview="slideshowClick"
            class="upload-demo uploadimage"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
            :limit='6' accept=".jpg,.png,.gif"
            :on-remove="handleRemove2"
            :multiple="true">
            <el-button type="info">
              <div v-show="isSlideshow" style="height:215px;width:330px;position:absolute;z-index:99;top:50px;left:30px;border:10px solid #D7D7D7;background:#fdfdfd;">
                <img style="display:block;width:100%;height:100%;" :src="this.slideshowUrl" alt="">
              </div>
              上传</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="出游人群" prop="Excursion">
            <el-select v-model="ruleForm.Excursion" placeholder="请选择" class="Excursion-select">
              <el-option :label="theme" :value="indexs" v-for="(theme,indexs) of theme" :key="indexs"/>
            </el-select>
          </el-form-item>
          <el-form-item label="主题" prop="theme">
            <el-select v-model="ruleForm.theme" placeholder="请选择" class="Excursion-select">
            <el-option :label="item" :value="index" v-for="(item,index) of list" :key="index"/>
            </el-select>
          </el-form-item>
          <el-form-item label="提前报名天数" prop="advanceRegistrationDays">
            <el-input v-model="ruleForm.advanceRegistrationDays" class="advanceRegistrationDays-input" placeholder="请输入天数"></el-input>
            <span class="day">天</span>
          </el-form-item>
          <div class="num-two" style="overflow:hidden">
            <el-form-item style="width:300px; float:left" label='最晚收客时间' prop="timeHour" class="num-three">
              <el-input style="width:80px;left:8px;float:left;" v-model="ruleForm.timeHour"></el-input>
              <span class="timeHour-span">时</span>
            </el-form-item>
            <el-form-item class="number-day" style="width:300px; float:left;margin-left:-120px" prop="timeMinute">
              <el-input style="width:80px;float:left;margin-left:-36px;" v-model="ruleForm.timeMinute"></el-input>
              <span class="timeMinute-span">分</span>
            </el-form-item>
          </div>
        </el-form>
    </div>
</template>

<script>
export default {
  name: "baseInfo",
  data(){
    return{
      isShowImg:false,
      imgUrl:'',
      isSlideshow:false,
      slideshowUrl:'',
      tableData: [{
          id: '001',
          country: '英国',
          value: '英国'
        },{
          id: '002',
          country: '英格兰',
          value: '英格兰'
        },{
          id: '003',
          country: '英吉利',
          value: '英吉利'
        }],
      tableData1: [{
          id: '001',
          country: '巴基斯坦',
          value: '巴基斯坦'
        },{
          id: '002',
          country: '巴林',
          value: '巴林'
        },{
          id: '003',
          country: '巴勒斯坦',
          value: '巴勒斯坦'
        }],
      list:["乐园/公园","人文/赏景","健康旅游","古镇游","度假村","户外","海岛游","温泉","游学","滑雪","禅修","自驾","都市游","酒店控","其他"],
      theme:["亲子","情侣","朋友/同事","父母"],
      //目的地
      dynamicTags1: [],
        inputVisible1: false,
        inputValue1: '',
      ruleForm:{
        productName: '',
        travelType: "1",
        placeDeparture: '',
        travelDays: '',
        travelNight: '',
        orderConfirmationType: "1",
        operationLabel: '',
        Excursion: '',
        theme: '',
        advanceRegistrationDays: '',
        timeHour: '',
        timeMinute: '',
        highlightWords1: '',
        highlightWords2: '',
        highlightWords3: '',
        highlightWords4: '',
        avatarImages: '',
        inputVal:''
        },
      //运营标签
      dynamicTags2: [],
        inputVisible2: false,
        inputVal: '',
      rules:{
        productName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 30, message: '字数超过30汉字限制', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_.~+]{1,30}$/, message: '含.~+/_可用，（）仅能用在句尾'}
        ],
        placeDeparture:[
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        destination:[
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        advanceRegistrationDays:[
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/,message: '请输入正整数'}
        ],
        highlightWords1:[
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' },
        ],
        highlightWords2:[
          { min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' },
        ],
        highlightWords3:[
          { min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' },
        ],
        highlightWords4:[
          { min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' },
        ],
        travelDays:[
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/,message: '请输入正整数'}
        ],
        travelNight:[
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/,message: '请输入正整数'}
        ],
        timeHour:[
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/,message: '请输入正整数'}
        ],
        timeMinute:[
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/,message: '请输入正整数'}
        ],
        operationLabel:[
           { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,300}$/, message: '不能有标点符号'}
        ],
      }
    };
  },
  methods: {
      beforeUploadVideo(file) {
        const isLt20M = file.size / 1024 / 1024  < 20;
        if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
            this.$message.error('请上传正确的视频格式');
            return false;
        }
        if (!isLt20M) {
            this.$message.error('上传视频大小不能超过20MB哦!');
            return false;
        }
      },
      uploadVideoProcess(event, file, fileList){
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0);
      },

      //图片预览
      handleImgClick(file){
        this.isShowImg = !this.isShowImg
        this.imgUrl = file.url
      },
      handleRemove(file, fileList) {
         this.isShowImg = false;
      },
      //轮播图预览
      slideshowClick(file){
        this.isSlideshow = true;
        if(this.slideshowUrl == file.url){
        this.isSlideshow = false;
        this.slideshowUrl = ''
        } else {
        this.slideshowUrl = file.url
        }
      },
      handleRemove2(file, fileList){
        this.isSlideshow = false;
      },
      //视频删除
      handleRemoves(file, fileList) {
        console.log(file);
      },
      //轮播图删除
      handleRemoves1(file, fileList) {
        console.log(file);
      },
      //运营标签
      handleClose2(tag2) {
        this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
      },

      showInput2() {
        this.inputVisible2 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm2() {
        this.$refs['operationLabel'].validate()
        var str = this.ruleForm.operationLabel;
        var pat =  /^[\u4e00-\u9fa5a-zA-Z0-9]{1,300}$/
        if(str.match(pat)){
          let inputVal = this.ruleForm.operationLabel;
            if (inputVal) {
              this.dynamicTags2.push(inputVal);
            }
            this.inputVisible2 = false;
            this.ruleForm.operationLabel= '';
        }
        
      },
       // 搜索方法(出发地)
      querySearch(queryString, cb) {
        var results = queryString ? this.tableData.filter(this.createFilter(queryString)) : [];
        cb(results);
      },
      // 搜索方法（出发地）
      createFilter(queryString){
        return (restaurant) => {
          return (restaurant.country.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        }
      },

       // 搜索方法(出发地)
      querySearch1(queryString1, cb1) {
        var results1 = queryString1 ? this.tableData1.filter(this.createFilter(queryString1)) : [];
        cb1(results1);
      },
      // 搜索方法（出发地）
      createFilter1(queryString1){
        return (restaurant1) => {
          return (restaurant1.country.toLowerCase().indexOf(queryString1.toLowerCase()) === 0);
        }
      },
    }
};


</script>

<style scoped lang='stylus'>
.warp {
  position: relative;
  padding-bottom:100px;
}
.btn {
  width: 160px;
  height: 44px;
  right: 0;
  top: -64px;
  position: absolute;
}
.productName-input {
  width: 548px;
  float: left;
  margin-left: 10px;
}
.travelType-radio {
  float: left;
  margin-left: 10px;
  margin-top: 13px;
}
.placeDeparture-input {
  width: 94%;
  float: left;
  margin-left: 10px;
}
.destination-input {
  width: 548px;
  float: left;
  margin-left: 10px;
  padding-bottom:2.5px
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.button-new-tag {
  float: left;
  margin-left: 5px;
  margin-top: 3px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width:116px;
  float: left;
  margin-left: 5px;
  margin-top: 3px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.el-tag {
  float: left;
  margin-top: 3px;
  margin-left: 5px;
  background-color: #3593EE;
  color: #fff;
}
.travelDays-input {
  width: 150px;
  float: left;
  margin-left: 10px;
}
.day {
  float: left;
  margin-left: 10px;
}
.orderConfirmationType-radio {
  float: left;
  margin-left: 10px;
  margin-top: 13px;
}
.highlightWords-input1 {
  width: 200px;
  float: left;
  margin-left: 10px;
}
.highlightWords-input2 {
  width: 200px;
  float: left;
  margin-left: 30px;
}
.span {
  float: right;
  margin-top:-40px;
  margin-right:5px;
}
.Excursion-select {
  float: left;
  margin-left: 10px;
}
.latestClosingTime-input {
  width: 5%;
  float: left;
  margin-left: 10px;
}
.advanceRegistrationDays-input {
  width: 15%;
  float: left;
  margin-left: 10px;
}
.el-form-item>>>.el-form-item__error{
  left: 30px;
}
.el-form-item>>>.el-form-item__label{
  width:120px !important;
}
.inputBox{
  width:548px;
  float left;
  margin-left:10px;
}
#el-autocomplete-2219>>>li{
  border 5px solid!important;
  color red;
}
.span1{
  float:left;
  margin-left:10px;
}
.travelNight-input{
  float:left;
  margin-left:215px;
  margin-top:-62px;
  width: 150px;
}
.night{
  float left;
  margin-left:375px;
  margin-top:-60px;
}
.number-day>>>.el-form-item__error{
  left 24px
}
.travelDays-span{
  margin-left:15px;
}
.travelNight{
  margin-left:22px;
}
.timeHour-span{
  float left;
  margin-left:20px;
}
.timeMinute-span{
  float left;
  margin-left:10px;
}
.num-two>>>.el-form-item__error{
  left:-36px;
}
.num-three>>>.el-form-item__error{
  left:27px;
}
.upload-demo{
float:left;
}
.upload-demo>>>.el-upload-list{
position:absolute;
top: -5px;
left: 30px;
}
.upload-demo>>>.el-upload-list__item{
float left;
width: 90px;
height: 30px;
padding: 0;
background-size: 44%;
background-repeat: no-repeat;
background-position: 2px;
background-image url('../../../assets/image/pic.png')
}
.length-span{
  float:left;
  margin-left:10px;
}
.btn-button{
  width:64px;
  height:40px;
}
.productName-input>>>.el-input__inner{
  height:30px;
}
</style>
