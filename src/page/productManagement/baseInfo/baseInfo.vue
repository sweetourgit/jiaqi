<template>
    <div class="warp">
      <div class="btn">
        <el-button plain>取消</el-button>
        <el-button type="primary">保存</el-button>
      </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="padding-left:50px">
          <el-form-item label="产品名称" prop="productName">
            <el-input maxlength=30 v-model="ruleForm.productName" class="productName-input" placeholder="含.~+/_可用，（）仅能用在句尾，30个汉字以内"></el-input>
            <span>{{ruleForm.productName.length}}/30字</span>
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
          <el-form-item label="出发地" prop="destination">
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
          <el-form-item prop="highlightWords2">
            <el-input maxlength=8 v-model="ruleForm.highlightWords2" class="highlightWords-input2" placeholder="8个字以内"></el-input><br>
            <span class="span">{{ruleForm.highlightWords2.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords3">
            <el-input maxlength=8 v-model="ruleForm.highlightWords3" class="highlightWords-input2" placeholder="8个字以内"></el-input><br>
            <span class="span">{{ruleForm.highlightWords3.length}}/8字</span>
          </el-form-item>
          <el-form-item prop="highlightWords4">
            <el-input maxlength=8 v-model="ruleForm.highlightWords4" class="highlightWords-input2" placeholder="8个字以内"></el-input><br>
            <span class="span">{{ruleForm.highlightWords4.length}}/8字</span>
          </el-form-item>
          <el-form-item label="运营标签" prop="operationLabel">
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
                v-model="inputValue2"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm2"
                @blur="handleInputConfirm2">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput2">请输入运营标签</el-button>
            </div>
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
        highlightWords4: ''
        },
      //运营标签
      dynamicTags2: [],
        inputVisible2: false,
        inputValue2: '',
      rules:{
        productName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 30, message: '字数超过30汉字限制', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_.~+/]{1,30}$/, message: '含.~+/_可用，（）仅能用在句尾'}
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
      }
    };
  },
  methods: {
      //目的地标签
      handleClose1(tag1) {
        this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag1), 1);
      },

      showInput1() {
        this.inputVisible1 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm1() {
        let inputValue1 = this.inputValue1;
        if (inputValue1) {
          this.dynamicTags1.push(inputValue1);
        }
        this.inputVisible1 = false;
        this.inputValue1 = '';
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
        let inputValue2 = this.inputValue2;
        if (inputValue2) {
          this.dynamicTags2.push(inputValue2);
        }
        this.inputVisible2 = false;
        this.inputValue2 = '';
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
  width: 94%;
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
  width: 94%;
  height: 38px;
  float: left;
  margin-left: 10px;
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
  float: left;
  margin-top: -1px;
  width: 90px;
  margin-left: 5px;
  vertical-align: bottom;
}
.el-tag {
  float: left;
  margin-top: 3px;
  margin-left: 5px;
  background-color: #c2c2c2;
  color: #333333;
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
  width: 94%;
  float: left;
  margin-left: 10px;
}
.highlightWords-input2 {
  width: 94%;
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
  width:94%;
  float left;
  margin-left:10px;
}
#el-autocomplete-2219>>>li{
  border 5px solid!important;
  color red;
}
.span1{
  float:right;
  margin-right:5px;
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
</style>
