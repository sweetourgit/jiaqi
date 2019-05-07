<template>
  <div class="vivo" style="position:relative">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <div class="btn" style="width:200px;position:absolute;z-index:99;top:0px;left:50%;">
        <el-button plain class="btn-button" @click="cancel()">取消</el-button>
        <el-button class="btn-button" style="background:#3095fa;color:#fff" @click="addsave('ruleForm')">保存</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="first">
          <div>
            <!--产品名称-->
            <el-form-item label="产品名称" prop="productNamel" label-width="120px">
              <el-input v-model="ruleForm.productNamel" @input="myInput" class="productName" placeholder="请输入正确产品名称"></el-input>
              <span class="Numbers"><span v-bind:class="{ active: isActive }">{{ruleForm.productNamel.length}}</span>/30字</span>
            </el-form-item>
            <!--出游类型-->
            <el-form-item label="出游类型" prop="travelType" label-width="120px">
              <el-radio-group v-model="ruleForm.travelType" class="travelType">
                <el-radio label="1" value="1">境外</el-radio>
                <el-radio label="2" value="2">国内</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--出发地-->
            <el-form-item label="出发地" ref="placeDeparture" style="clear:both;" label-width="120px">
              <span class="redStar">*</span>
              <div class="destination-input">
                <el-tag :key="tag3.pod" v-for="tag3 in dynamicTags3" closable :disable-transitions="false" @close="handleClose3(tag3)">
                  {{tag3.pod}}
                </el-tag>
                <el-autocomplete id="ddd" class="input-new-tags" v-model="ruleForm.placeDeparture" v-if="inputVisible3" ref="saveTagInput" :fetch-suggestions="querySearch3" size="small" @keyup.enter.native="handleInputConfirm3" placeholder="请输入出发地" :trigger-on-focus="false" @select="departure" @blur="handleInputConfirm3"></el-autocomplete>
                <el-button v-else class="input-new-tag" size="small" @click="showInput3">请输入出发地</el-button>
              </div>
              <span id="isNull" v-show="noNull">不能为空</span>
            </el-form-item>
            <!-- 目的地 -->
            <el-form-item label="目的地" ref="destinations" style="clear:both;" label-width="120px">
              <span class="redStar">*</span>
              <div class="destination-input">
                <el-tag :key="tag4.destination" v-for="tag4 in dynamicTags4" closable :disable-transitions="false" @close="handleClose4(tag4)">
                  {{tag4.destination}}
                </el-tag>
                <el-autocomplete id="input-error" class="input-new-tags" v-if="inputVisible4" v-model="ruleForm.destinations" ref="saveTagInput" size="small" placeholder="请输入目的地" @keyup.enter.native="handleInputConfirm4" :fetch-suggestions="querySearch2" :trigger-on-focus="false" @select="dest" @blur="handleInputConfirm4">
                </el-autocomplete>
                <el-button v-else class="input-new-tag" size="small" @click="showInput4">请输入目的地</el-button>
              </div>
              <span id="zero" v-show="errorNull">不能为空</span>
            </el-form-item>
            <!-- 行程天數 -->
            <div style="overflow:hidden">
              <el-form-item style="width:300px; float:left;" label='行程天数' prop="travelDays" label-width="120px">
                <el-input style="width:105px;margin-left:-25px;" v-model="ruleForm.travelDays" placeholder="请输入天数" ref="travelDays"></el-input>
                <span class="travelDays-span" style="margin-left:10px;color: #333;">天</span>
              </el-form-item>
              <el-form-item class="number-day" style="float:left; margin-left:-25px;" prop="travelNight">
                <el-input style="width:105px;float:left; margin-right:10px;" v-model="ruleForm.travelNight" placeholder="请输入晚数"></el-input>
                <span class="travelNight">晚</span>
              </el-form-item>
            </div>
            <!-- 订单确认类型 -->
            <el-form-item label="订单确认类型" prop="orderConfirmationType" label-width="120px">
              <el-radio-group v-model="ruleForm.orderConfirmationType" class="indent">
                <el-radio label="1" value="1">及时确认</el-radio>
                <el-radio label="2" value="2">二次确认</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 亮点词1 -->
            <el-form-item label="亮点词" prop="highlightWords1" label-width="120px">
              <el-input maxlength=8 v-model="ruleForm.highlightWords1" class="bright" placeholder="8个字以内"></el-input>
              <span class="bright-number">{{ruleForm.highlightWords1.length}}/8字</span>
            </el-form-item>
            <!-- 亮点词2 -->
            <el-form-item prop="highlightWords2" class="bright_b" label-width="120px" style="float:left;">
              <el-input maxlength=8 v-model="ruleForm.highlightWords2" class="lightspot" placeholder="8个字以内"></el-input>
              <span class="lightspot-span">{{ruleForm.highlightWords2.length}}/8字</span>
            </el-form-item>
            <!-- 亮点词3 -->
            <el-form-item prop="highlightWords3" style="clear:both;" label-width="120px">
              <el-input maxlength=8 v-model="ruleForm.highlightWords3" style="width:210px; float:left; margin:0 0 0 10px;" placeholder="8个字以内"></el-input>
              <span class="lightspot-span">{{ruleForm.highlightWords3.length}}/8字</span>
            </el-form-item>
            <!-- 亮点词4 -->
            <el-form-item prop="highlightWords4" class="bright_b" label-width="120px">
              <el-input maxlength=8 v-model="ruleForm.highlightWords4" class="lightspot" placeholder="8个字以内"></el-input>
              <span class="lightspot-span">{{ruleForm.highlightWords4.length}}/8字</span>
            </el-form-item>
            <!-- 运营标签 -->
            <el-form-item label="运营标签" ref="operationLabel" style="clear:both;" label-width="120px">
              <div class="destination-input">
                <el-tag :key="tag2.id" v-for="tag2 in dynamicTags2" closable :disable-transitions="false" @close="handleClose2(tag2)">
                  {{tag2.label}}
                </el-tag>
                <el-autocomplete id="input-error" class="lable_input" v-if="inputVisible2" v-model="ruleForm.operationLabel" ref="saveTagInput" size="small" placeholder="请输入运营标签" @keyup.enter.native="handleInputConfirm2" :fetch-suggestions="querySearch5" :trigger-on-focus="false" @select="dest_01" @blur="handleInputConfirm2">
                </el-autocomplete>
                <el-button v-else class="operation_Label" size="small" @click="showInput2">请输入运营标签</el-button>
              </div>
              <span id="empty" v-show="empty">不能为空</span>
            </el-form-item>            <!-- 头图 -->
            <el-form-item label="头图" prop="avatarImages" label-width="120px">
              <el-input v-model="ruleForm.avatarImages" disabled style="width:110px;float:left;margin-left:10px;position:relative">
              </el-input>
              <el-upload :on-preview="handleImgClick" class="upload-demo uploadimage" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture" :limit='1' accept=".jpg,.png,.gif" :on-remove="handleRemove">
                <el-button type="info" class="upload-btn">
                  <div v-show="isShowImg" style="height:215px;width:330px;position:absolute;z-index:9999;top:50px;left:-111px;border:10px solid #D7D7D7;background:#fdfdfd;">
                    <img style="display:block;width:100%;height:100%;" :src="this.imgUrl" alt="">
                  </div>
                  上传
                </el-button>
              </el-upload>
            </el-form-item>
            <!-- 视频 -->
            <el-form-item label="视频" prop="video" label-width="120px">
              <el-input v-model="ruleForm.video" disabled style="width:110px;float:left;margin-left:10px;position:relative">
              </el-input>
              <el-upload class="upload-demo uploadimage" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture" :limit='1' :on-remove="handleRemoves1" :before-upload="beforeUploadVideo" :on-progress="uploadVideoProcess">
                <el-button type="info" class="upload-btn">上传</el-button>
              </el-upload>
            </el-form-item>
            <!-- 轮播图 -->
            <el-form-item label="轮播图" prop="slideshow" label-width="120px">
              <el-input v-model="ruleForm.slideshow" disabled class="banner" placeholder="3-6张图片">
              </el-input>
              <el-upload :on-preview="slideshowClick" style="float:left;" method="post" action="http://192.168.1.168:6012/universal/supplier/api/upload" list-type="picture" :limit='6' accept=".jpg,.png,.gif" :on-remove="handleRemove2" :multiple="true">
                <el-button type="info">
                  <div v-show="isSlideshow" class="upload_div">
                    <img class="upload_img" :src="this.slideshowUrl" alt="">
                  </div>
                  上传</el-button>
              </el-upload>
              <input id="fileItem" type="file" multiple style="float:left; margin-left:10px;">
            </el-form-item>
            <!-- 出游人群 -->
            <el-form-item label="出游人群" prop="Excursion" label-width="120px">
              <el-select v-model="ruleForm.Excursion" placeholder="请选择" class="Excursion-select">
                <el-option :label="theme" :value="indexs" v-for="(theme,indexs) of excurList" :key="indexs" />
              </el-select>
            </el-form-item>
            <!-- 主题 -->
            <el-form-item label="主题" prop="theme" label-width="120px">
              <el-select v-model="ruleForm.theme" placeholder="请选择" class="Excursion-select">
                <el-option :label="item" :value="index" v-for="(item,index) of list" :key="index" />
              </el-select>
            </el-form-item>
            <!-- 提前报名天数 -->
            <el-form-item label="提前报名天数" prop="advanceRegistrationDays" label-width="120px">
              <el-input v-model="ruleForm.advanceRegistrationDays" class="applyDay" placeholder="请输入天数"></el-input>
              <span class="apply_day">天</span>
            </el-form-item>
            <!-- 最晚收客时间 -->
            <div class="latest">
              <!-- 时 -->
              <el-form-item style="width:300px; float:left;" label='最晚收客时间' prop="timeHour" label-width="120px">
                <el-input style="width:50px; float:left; margin-left:10px;" v-model="ruleForm.timeHour"></el-input>
                <span style="float:left;color: #333; margin-left:10px;">时</span>
              </el-form-item>
              <!-- 分 -->
              <el-form-item style="float:left; margin-left:-85px;" prop="timeMinute" class="err_span">
                <el-input style="width:50px;float:left;" v-model="ruleForm.timeMinute" class="err_span"></el-input>
                <span style="float:left;color: #333; margin-left:10px;">分</span>
              </el-form-item>
            </div>
            <!-- 产品概括 -->
            <!--<el-form-item label="产品概括" prop="productSummary" label-width="120px">
              <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 8}" v-model="ruleForm.productSummary" class="Summary"></el-input>
            </el-form-item>-->
            <el-form-item label="产品概括" prop="productSummary" label-width="120px">
              <div class="cost_content" style="background: #FFFFFF">
                <vue-editor v-model="content_01"></vue-editor>
              </div>
            </el-form-item>


          </div>
        </el-tab-pane>
        <el-tab-pane label="费用说明" name="third">
          <div class="cost">费用说明</div>
          <div class="cost_button">
            <el-button type="primary" @click="getUEContent()">添加说明</el-button>
            <!-- <el-button type="primary" @click="getSaveContent()">获取值</el-button>-->
          </div>
          <div class="cost_bg" v-for="item in explain">
            <div class="cost_title">{{ item.title }}</div>
            <div class="cost_content">
              <vue-editor class="content_explain" v-model="item.content"></vue-editor>
            </div>
          </div>
          <!--隐藏添加说明-->
          <div class="cost_bg"  v-for="(domain, index) in domains">
            <div class="cost_title">
              <span>名称：</span><el-input  placeholder="请输入内容" style="width: 750px;" v-model="domain.title"></el-input>
            </div>
            <div class="cost_content" style="background: #FFFFFF">
              <vue-editor v-model="domain.content"></vue-editor>
            </div>
            <div class="delete_button"><el-button @click="deleteState_01(index)" plain>删除信息</el-button></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="fourth">

          <div class="cost">预订须知</div>
          <div>
            <div class="cost_button">
              <el-button type="primary" @click="getUEContent0()">添加说明</el-button>
              <!--  <el-button type="primary" @click="getSaveContent()">获取值</el-button>-->
            </div>
            <div class="cost_bg" v-for="(note, index) in notes">
              <div class="cost_title">
                <span>名称：</span><el-input  placeholder="请输入内容" style="width: 750px;" v-model="note.title"></el-input>
              </div>
              <div class="cost_content" style="background: #FFFFFF">
                <vue-editor v-model="note.content"></vue-editor>
              </div>
              <div class="delete_button"><el-button @click="deleteNotice(index)" plain>删除信息</el-button></div>
            </div>
          </div>

          <div style="margin-top: 50px">
            <div class="cost">使用说明</div>
            <div>
              <div class="cost_button">
                <el-button type="primary" @click="getUEContent1()">添加说明</el-button>
                <!-- <el-button type="primary" @click="getSaveContent1()">获取值</el-button>-->
              </div>
              <div class="cost_bg" v-for="(instruction, index) in instructions">
                <div class="cost_title">
                  <span>名称：</span><el-input  placeholder="请输入内容" style="width: 750px;" v-model="instruction.title"></el-input>
                </div>
                <div class="cost_content" style="background: #FFFFFF">
                  <vue-editor v-model="instruction.content"></vue-editor>
                </div>
                <div class="delete_button"><el-button @click="deleteState(index)" plain>删除信息</el-button></div>
              </div>
            </div>
          </div>

        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
  // import BaseInfo from '@/page/productManagement/baseInfo/baseInfo'
  import {VueEditor} from 'vue2-editor'
  export default {
    name: "listInfo",
    components: {
      // BaseInfo,
      VueEditor
    },
    data() {
      return {
        qqq:[],
        activeID:[],//日程信息id
        schedulsLeng:'',//几天日程信息
        mealID:'',//mealId
        tabInformation:"traffic",
        isActive: false,//基本信息字数要求
        content_01:'',//基本信息产品概况文本编辑器
        content_02:'',//行程信息详情
        tabIndex: 2,
        notes:[{
          title:'',
          content:''
        }],
        instructions:[{
          title:'',
          content:''
        }],
        explain:[{
          title:'费用包含',
          content:''
        },{
          title:'费用不包含',
          content:''
        },{
          title:'温馨提示',
          content:''
        },{
          title:'儿童政策',
          content:''
        },{
          title:'购物场所',
          content:''
        },{
          title:'自费项目',
          content:''
        }],
        domains:[],//费用说明隐藏
        //基本信息
        isShowImg: false,
        imgUrl: '',
        isSlideshow: false,
        slideshowUrl: '',
        vague: [],
        tableData1: [],
        list: [],
        excurList: [],
        //目的地
        dynamicTags1: [],
        inputVisible1: false,
        inputValue1: '',
        //简要说明
        content: '',
        content1: '<h1>Some initial content111</h1>',
        //切换主题
        editableTabsValue: '1',
        editableTabs: [{
          title: '行程套餐',
          name: '1',
          content: 'Tab 1 content'
        }],
        //限制字数
        number: '0/10',
        items: {
          text: ''
        },
        //去程交通工具切换
        goRoad: [{
          value: '1',
          label: '飞机'
        }, {
          value: '2',
          label: '火车',
        }, {
          value: '3',
          label: '汽车',
        }, {
          value: '4',
          label: '轮船',
        }],
        selectedOptions: ['2'],
        //去程天数
        goDate: [],
        //返程交通工具切换
        returnRoad: [{
          value: '1',
          label: '飞机'
        }, {
          value: '2',
          label: '火车',
        }, {
          value: '3',
          label: '汽车',
        }, {
          value: '4',
          label: '轮船',
        }],
        selectedOptions_01: ['1'],
        //去程、返程当日选择
        goDay: [{
          value: '选项1',
          label: '当日'
        }, {
          value: '选项2',
          label: '第一天'
        }, {
          value: '选项3',
          label: '第一天'
        }, {
          value: '选项4',
          label: '第一天'
        }],
        //酒店星级
        hotelStars: [{
          value: '选项1',
          label: '三星'
        }, {
          value: '选项2',
          label: '四星'
        }, {
          value: '选项3',
          label: '五星'
        }],
        //酒店入住晚数
        hotelDays: [{
          value: '选项1',
          label: '一宿'
        }, {
          value: '选项2',
          label: '两宿'
        }, {
          value: '选项3',
          label: '三宿'
        }],
        //酒店房型
        hotelRoom: [{
          value: '选项1',
          label: '单人间'
        }, {
          value: '选项2',
          label: '双人间'
        }, {
          value: '选项3',
          label: '三人间'
        }],
        //酒店床型
        hotelType: [{
          value: '选项1',
          label: '双人床'
        }, {
          value: '选项2',
          label: '双人床'
        }, {
          value: '选项3',
          label: '双人床'
        }],
        //文本框
        restaurants: [],
        //日程信息详细说明
        info: '',
        ruleForm: {
          mudidi:"",
          chufadi:"",
          productNamel: '',
          destinations:'',
          travelType: '1',
          placeDeparture: '',
          travelDays: '',
          travelNight: '',
          orderConfirmationType:'',
          operationLabel: '',
          Excursion: '',
          excurList: '',
          advanceRegistrationDays: '',
          timeHour: '',
          timeMinute: '',
          highlightWords1: '',
          highlightWords2: '',
          highlightWords3: '',
          highlightWords4: '',
          avatarImages: '',
          slideshow: '',
          hotelAuto: '',
          hotelChinese: '',
          hotelEnglish: '',
          hotelAddress: '',
          hotelStar: '',
          hotelDay: '',
          hotelHouse: '',
          hotelBed: '',
          pod: '',
          company: '',
          theNumber: '',
          pod: '',
          podPlace: '',
          podTime: '',
          arriveCity: '',
          arrivePlace: '',
          arriveTime: '',
          planeDay: '',
          trafficMode: '1',
          day: '',
          typeExt: '',
          time: '',
          name: '',
          details: '',
          memo: '',
          pictureID: '',
          highlightWords: '',
          theme: '',
          subject:'',
          origin:'',
          podID:'',
          destinationID:'',
          bourn:'',
          //交通工具
          //去程
          plane: [{
            pod: '',
            id: 0,
            goOrBack:1,
            company: '',
            theNumber: '',
            podCity: '',
            podPlace: '',
            podTime: '',
            arriveCity: '',
            arrivePlace: '',
            arriveTime: '',
            planeDay: '',
            trafficMode: '1',
            day: '1',
            ext_Stopover: [],
            www:['2']
          }],
          //返程
          nackPlane: [{
            pod: '',  //套餐id
            id: 0,
            goOrBack:2,   //1去程 2返程
            company: '',  //航空公司
            theNumber: '',   //航班号
            podCity: '',           //出发城市
            podPlace: '',   //出发机场
            podTime: '',    //出发时间
            arriveCity: '',    //到达城市
            arrivePlace: '',     //到达机场
            arriveTime: '',      //到达时间
            planeDay: '',       //到达天数
            trafficMode: '1',  //出行方式
            day: '1',      //第几天
            ext_Stopover: [],
            www: ['2']
          }],
          //行程信息大表
          schedules: []
        },
        rules: {
          productNamel: [{ required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 30, message: '字数超过30汉字限制', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9【】，+/（]{1,29}([\u4e00-\u9fa5a-zA-Z0-9【】，+/）]{0,1})$/, message: '请输入正确产品名称，含中括号【】中文逗号，英文+/可用，中文小括号（）仅能用在句尾' , trigger: 'blur'}],
          travelType: [{ required: true, message: '不能为空', trigger: 'blur' }],
          orderConfirmationType: [{ required: true, message: '不能为空', trigger: 'change' }],
          advanceRegistrationDays: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          highlightWords1: [{ required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          highlightWords2: [{ min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          highlightWords3: [{ min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          highlightWords4: [{ min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          travelDays: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          travelNight: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数'}],
          timeHour: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          timeMinute: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          operationLabel: [{ pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,300}$/, message: '不能有标点符号' }],
          highlightWords: [{ required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' }],
          origin: [{ required: true, message: '不能为空', trigger: 'change' }],
          bourn: [{ required: true, message: '不能为空', trigger: 'change' }],
          hotelAuto: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelChinese: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelEnglish: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelAddress: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelStar: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelDay: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelHouse: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelBed: [{ required: true, message: '不能为空', trigger: 'blur' }],
          pod: [{ required: true, message: '不能为空', trigger: 'blur' }],
          company: [{ required: true, message: '不能为空', trigger: 'blur' }],
          theNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
          podCity:[{ required: true, message: '不能为空', trigger: 'blur' }],
          pod: [{ required: true, message: '不能为空', trigger: 'blur' }],
          podPlace: [{ required: true, message: '不能为空', trigger: 'blur' }],
          podTime: [{ required: true, message: '不能为空', trigger: 'blur' }],
          arriveCity: [{ required: true, message: '不能为空', trigger: 'blur' }],
          arrivePlace: [{ required: true, message: '不能为空', trigger: 'blur' }],
          arriveTime: [{ required: true, message: '不能为空', trigger: 'blur' }],
          planeDay: [{ required: true, message: '不能为空', trigger: 'blur' }],
          trafficMode: [{ required: true, message: '不能为空', trigger: 'blur' }],
          day: [{ required: true, message: '不能为空', trigger: 'blur' }],
          typeExt: [{ required: true, message: '不能为空', trigger: 'blur' }],
          time: [{ required: true, message: '不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          details: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // slideshow:[{ required: true, message: '不能为空', trigger: 'blur' }],
          memo: [{ required: true, message: '不能为空', trigger: 'blur' }],
          details: [{ required: true, message: '不能为空', trigger: 'blur' }],
          pictureID: [{ required: true, message: '不能为空', trigger: 'blur' }],
          subject: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        //上传图片
        fileList2: [],
        //radio选择器
        radio: '1',
        radio1: '1',
        radio2: '1',
        radio3: '1',
        radio4: '1',
        //日程详情住宿选择
        tabContents: [{'id':0,'name':'酒店1'},{'id':1,'name':'酒店2'}],
        num: 0,
        num1: 0,
        param: '1',
        tabPosition: 'right',
        comboshow: false,
        aindex: 0,
        editableTabsValue3: '2',
        editableTabs3: [{
          content: ''
        }],
        //行程信息切换
        describe: ["详细说明", "简要说明"],
        pattern: ["", ""],
        matter_radio: '0',
        form: [],
        form1: [],
        lineshow: false,
        Stopline: false,
        transit: ['1'],
        deleteTransit: true, //删除中转按钮
        //出发地
        place: [{
          value: '选项1',
          id: '1'
        }, {
          value: '选项2',
          id: '2'
        }, {
          value: '选项3',
          id: '3'
        }],
        //目的地
        destination: [{
          value: '选项1',
          id: '1'
        }, {
          value: '选项2',
          id: '2'
        }, {
          value: '选项3',
          id: '3'
        }],
        //景点，购物，自费
        information: ['1'], //添加酒店
        hotelshow: false, //酒店弹窗
        hotel: [{
          hotelAuto: '',
          hotelChinese: '',
          hotelEnglish: '',
          hotelAddress: '',
          hotelStar: '',
          hotelDay: '',
          hotelHouse: '',
          hotelBed: ''
        }],
        details: [{
          value: '1',
          label: '景点'
        }, {
          value: '2',
          label: '购物',
        }, {
          value: '3',
          label: '自费项目',
        }],
        teturnBack: [],
        Returnline: false,
        //日程信息酒店切换
        num6: 0,
        schedule_radio: '0',
        //信息详情切换
        num7: 0,
        details_radio: '0',
        schedule_details: ["", "", ""],
        //切换变量行程day的
        mynumber: 0,
        //行程日期
        mydate: '2',
        //日期切换
        myTravelDay: [],
        //添加详情
        myxiangnumber: 0,
        hotell: true,
        otherl: false,
        myradio:[],
        activeName: 'first',
        travelDays: '',
        //运营标签
        dynamicTags2: [],
        inputVisible2: false,
        inputVal: '',
        empty:'',
        // 出发地
        dynamicTags3: [],
        inputVisible3: false,
        inputVal3: '',
        noNull: false,
        //目的地
        dynamicTags4: [],
        inputVisible4: false,
        inputVal4: '',
        errorNull: ''
      }
    },
    watch:{ //watch()监听某个值（双向绑定）的变化，从而达到change事件监听的效果
      items: {
        handler: function() {
          var _this = this;
          var _sum = 10; //字体限制为10个
          _this.$refs.count.setAttribute("maxlength", _sum);
          _this.number = _sum - _this.$refs.count.value.length;
        },
        deep: false
      },
      'ruleForm.travelDays': {
        handler: function(newValue, oldValue) {
          //右侧导航day
          this.myTravelDay=[];
          for (let i = 0; i < newValue; i++) {
            this.myTravelDay.push(i)
          }
          //日常信息数据
          if(newValue>oldValue){
            this.mydate = newValue-oldValue;
            for (let i = 0; i < this.mydate; i++) {
              this.ruleForm.schedules.push({
                day:i+1,
                subject: '',
                info: '',
                createTime: this.formatDate(new Date()),
                ext_Meals: [{
                  label: '早餐',
                  Myself: '0',
                  Detail: ''
                }, {
                  label: '午餐',
                  Myself: '0',
                  Detail: ''
                }, {
                  label: '晚餐',
                  Myself: '0',
                  Detail: ''
                }],
                activitys: [{
                  typeExt: '',
                  time: '',
                  name: '',
                  details: '',
                  memo: '',
                  pictureID: '',
                  activityType:'1',
                  createTime: this.formatDate(new Date())
                }],
                ext_Hotel: [
                  {IsHotel:0,Details:""}
                ]
              });
              this.myradio.push({'lable':'1'});   //保存行程里面酒店信息单选值
            }
          }else{
            this.ruleForm.schedules.splice(newValue,oldValue-newValue);
            this.myradio.splice(newValue,oldValue-newValue)
          }
        }
      }
    } ,
    mounted() {
      this.guid();
      this.restaurants = this.loadAll();
    },
    created() {
      this.themeList();
      this.itemList();
      this.oneInfo();
    },
    methods: {
      oneInfo(){
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teamget",
          {
              "id": this.$route.query.id,
          }
        )
          .then(function (obj) {
            console.log(obj.data.object);
            that.schedulsLeng = obj.data.object.package[0].schedules.length
            for(let u = 0; u <that.schedulsLeng; u++ ){
                that.activeID.push(obj.data.object.package[0].schedules[u].id)
            }
            that.mealID  =  obj.data.object.package[0].id //模板id
            that.ruleForm.productNamel = obj.data.object.title; //产品名称
            that.ruleForm.travelType = String(obj.data.object.isForeign); //出游类型
            that.dynamicTags3 = obj.data.object.pods//出发地
            that.dynamicTags4 = obj.data.object.destinations//目的地
            that.ruleForm.travelDays = obj.data.object.day//行程天数
            that.ruleForm.travelNight = obj.data.object.night//行程晚数
            that.ruleForm.orderConfirmationType = String(obj.data.object.confirmType)//  订单确认类型
            if(obj.data.object.strengths[0] !== ""){
              that.ruleForm.highlightWords1 = obj.data.object.strengths[0].strength
            }
            if (obj.data.object.strengths[1]){
              that.ruleForm.highlightWords2 = obj.data.object.strengths[1].strength
            }
            if (obj.data.object.strengths[2]){
              that.ruleForm.highlightWords3 = obj.data.object.strengths[2].strength
            }
            if (obj.data.object.strengths[3]){
              that.ruleForm.highlightWords4 = obj.data.object.strengths[3].strength    //亮点词
            }
            that.dynamicTags2 = obj.data.object.label  //TODO 运营标签暂时不好使
            that.ruleForm.avatarImages = obj.data.object.pictureID //TODO 基本信息头图不好使
            that.ruleForm.video = obj.data.object.vedioID    //TODO 基本信息视频不好使
            that.ruleForm.slideshow = "" //TODO 基本信息轮播不好使obj.data.object.pepeatpic
            that.ruleForm.Excursion = obj.data.object.crowdID,//基本信息出游人群
            that.ruleForm.theme  =obj.data.object.themeID,//基本信息主题
            that.content_01 = obj.data.object.mark,
             /* 出游人群，主题，产品概括目前没有传*/
            that.ruleForm.advanceRegistrationDays = obj.data.object.advanceDay
            that.ruleForm.timeHour = obj.data.object.advanceHour
            that.ruleForm.timeMinute = obj.data.object.advanceMinute
            that.ruleForm.highlightWords = obj.data.object.package[0].name //行程信息套餐名
            that.ruleForm.origin = obj.data.object.package[0].pod //行程信息出发地
            that.ruleForm.bourn = obj.data.object.package[0].destination //行程信息目的地
            that.ruleForm.podID = obj.data.object.package[0].podID //行程信息出发地ID
            that.ruleForm.destinationID = obj.data.object.package[0].destinationID//行程信息目的地ID
            that.ruleForm.plane = []
            that.ruleForm.nackPlane = []
            for (var i =0; i < obj.data.object.package[0].traffic.length; i++ ){
              let arr = [];
              if(obj.data.object.package[0].traffic[i].goOrBack == 1){
                obj.data.object.package[0].traffic[i].ext_Stopover = [];//TODO 经停
                that.ruleForm.plane.push(obj.data.object.package[0].traffic[i]);
                arr.push(String(obj.data.object.package[0].traffic[i].trafficMode));
                that.ruleForm.plane[i].www = arr;
              }else{
                obj.data.object.package[0].traffic[i].ext_Stopover = [];//TODO 经停
                arr.push(String(obj.data.object.package[0].traffic[i].trafficMode));
                obj.data.object.package[0].traffic[i].www = arr;
                that.ruleForm.nackPlane.push(obj.data.object.package[0].traffic[i]);

              }

            }

            //日程信息
            for (let j = 0; j < obj.data.object.package[0].schedules.length; j++) {
              setTimeout(arr => {
               that.ruleForm.schedules[j].subject =  obj.data.object.package[0].schedules[j].subject //主题
              /* that.ruleForm.schedules[j].ext_Hotel.Details =  obj.data.object.package[0].schedules[j].info //主题*/
                that.content_02 =  obj.data.object.package[0].schedules[j].info //详情
                //早餐
                if( JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].label == "早餐" && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].Myself == "0"){
                    that.ruleForm.schedules[j].ext_Meals[0].Myself = "0"
                }else if(JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].label == "早餐"  && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].Myself == "1"){
                  that.ruleForm.schedules[j].ext_Meals[0].Myself = "1"
                  that.ruleForm.schedules[j].ext_Meals[0].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].Detail
                }
                //午餐
                if( JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].label == "午餐" && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Myself == "0"){
                  that.ruleForm.schedules[j].ext_Meals[1].Myself = "0"
                }else if(JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].label == "午餐"  && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Myself == "1"){
                  that.ruleForm.schedules[j].ext_Meals[1].Myself = "1"
                  that.ruleForm.schedules[j].ext_Meals[1].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Detail
                }
                // 晚餐
                if( JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].label == "晚餐" && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].Myself == "0"){
                  that.ruleForm.schedules[j].ext_Meals[2].Myself = "0"
                }else if(JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].label == "晚餐"  && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].Myself == "1"){
                  that.ruleForm.schedules[j].ext_Meals[2].Myself = "1"
                  that.ruleForm.schedules[j].ext_Meals[2].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].Detail
                }
                that.ruleForm.schedules[j].activitys = []
                  for (let k = 0; k < obj.data.object.package[0].schedules[j].activitys.length; k++) {
                        that.ruleForm.schedules[j].activitys.push(obj.data.object.package[0].schedules[j].activitys[k])
                    that.ruleForm.schedules[j].activitys[k].activityType = String(that.ruleForm.schedules[j].activitys[k].activityType)

                  }

                console.log( )
              }, 100)
            }

            that.explain = []
            for (let t = 0; t < obj.data.object.instructions.length; t++ ){
              that.explain.push(obj.data.object.instructions[t])
            }
          })
          .catch(function (obj) {
            console.log(obj)
          })

      },
      handClick(tab, event){
        console.log(tab, event);
      },
      myInput(){//基本信息文字限制30个字颜色变红
        if(this.ruleForm.productNamel.length>30){
          this.isActive=true;
        }else{
          this.isActive=false;
        }
      },
      getUEContent0(){
        this.notes.push({
          title: '',
          content:''
        });
      },
      getUEContent1(){
        this.instructions.push({
          title: '',
          content:''
        });
      },
      //删除预订须知
      deleteNotice(index){
        this.notes.splice(index, 1)
      },
      //删除使用说明
      deleteState(index){
        this.instructions.splice(index, 1)
      },
      //费用说明删除
      deleteState_01(index){
        this.domains.splice(index, 1)
      },
      //添加
      getUEContent(){
        this.domains.push({
          title: '',
          content: ''
        });
      },
      //保存
      addsave(formName) {
        //基本信息亮点词
        let strengths=[];
        if(this.ruleForm.highlightWords1!=""){
          strengths.push({"strength":this.ruleForm.highlightWords1})
        }
        if(this.ruleForm.highlightWords2!=""){
          strengths.push({"strength":this.ruleForm.highlightWords2})
        }
        if(this.ruleForm.highlightWords3!=""){
          strengths.push({"strength":this.ruleForm.highlightWords3})
        }
        if(this.ruleForm.highlightWords4!=""){
          strengths.push({"strength":this.ruleForm.highlightWords4})
        };
        //运营标签
        let dynamicTagsc=[];
        for(var i=0;i<this.dynamicTags2.length;i++){
          dynamicTagsc.push({"label":this.dynamicTags2[i]})
        };
        //经停信息转字符串
        let traff1=JSON.stringify(this.ruleForm.plane.concat(this.ruleForm.nackPlane));
        let traff=JSON.parse(traff1);
        for(var i=0;i<traff.length;i++){
          traff[i].ext_Stopover=JSON.stringify(traff[i].ext_Stopover);
        }
        //行程餐食信息转字符串
        let sche1=JSON.stringify(this.ruleForm.schedules);
        let sche=JSON.parse(sche1);
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Meals=JSON.stringify(sche[i].ext_Meals);
        }
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Hotel=JSON.stringify(sche[i].ext_Hotel);
        }
        //行程信息
        var object={
          //基本信息接口数据
          id:this.$route.query.id,
          createTime:Date.parse(new Date()),
          title:this.ruleForm.productNamel,//基本信息产品名称
          isForeign:this.ruleForm.travelType,//基本信息产品类型
          day:this.ruleForm.travelDays,//基本信息行程天数
          night:this.ruleForm.travelNight,//基本信息行程晚数
          pods:this.dynamicTags3,//基本信息出发地
          destinations:this.dynamicTags4,//基本信息目的地
          isDeleted:0,
          confirmType:this.ruleForm.orderConfirmationType,//基本信息订单确认类型
          strengths:strengths,//基本信息亮点词
          label:this.dynamicTags2,
          pictureID:0,//基本信息头图?
          vedioID:0,//基本信息视频?
          pepeatpic:"",//基本信息轮播图?
          advanceDay:this.ruleForm.advanceRegistrationDays,
          advanceHour:this.ruleForm.timeHour,
          advanceMinute:this.ruleForm.timeMinute,
          createUser:sessionStorage.getItem('id'),
          proStat:1,
          crowdID:this.ruleForm.Excursion,//基本信息出游人群
          themeID:this.ruleForm.theme,//基本信息主题
          mark:this.content_01,
          guid:localStorage.getItem("guid"),
         /* //行程信息接口数据
          package: [
            {
              name: this.ruleForm.highlightWords,//行程信息套餐名
              podID: this.ruleForm.origin.podID,//行程信息出发地
              destinationID: this.ruleForm.bourn.destinationID,//行程信息目的地
              pod: this.ruleForm.origin.pod,
              destination: this.ruleForm.bourn.destination,
              isDeleted: 0,
              createTime:this.formatDate(new Date()),
              traffic: traff,//交通方式,
              schedules: sche,//行程信息
              briefMark: this.content,//简要说明
              loadPlan: false
            }
          ],*/
          instructions:this.explain.concat(this.domains), //费用说明
          instructions1:this.notes, //预订须知,预留接口无字段？
          instructions2:this.instructions, //使用说明,预留接口无字段？
          loadPackage: true
        }

        this.$refs[formName].validate((valid) => {
          if(valid){
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/team/api/teamsave", {
                object: object
              },
            ).then(function(response) {
              if(response.data.isSuccess==true){
                _this.$message.success("修改成功");
                _this.$router.push({path: "productList"});
              }else{
                _this.$message.success("修改失败");
              }


            }).catch(function(error) {
              console.log(error);
            });

          }
        })
      },
      //保存套餐信息
      handleSetMeal(formName){

        //经停信息转字符串
        let traff1=JSON.stringify(this.ruleForm.plane.concat(this.ruleForm.nackPlane));
        let traff=JSON.parse(traff1);
        for(var i=0;i<traff.length;i++){
          traff[i].ext_Stopover=JSON.stringify(traff[i].ext_Stopover);
        }
        //行程餐食信息转字符串
        let sche1=JSON.stringify(this.ruleForm.schedules);
        let sche=JSON.parse(sche1);
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Meals=JSON.stringify(sche[i].ext_Meals);
        }
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Hotel=JSON.stringify(sche[i].ext_Hotel);
        }
      if(this.ruleForm.bourn.destination == undefined){

        this.ruleForm.mudidi = this.ruleForm.bourn
      }else{
        this.ruleForm.mudidi = this.ruleForm.bourn.destination
      }
        if(this.ruleForm.origin.pod == undefined){

          this.ruleForm.chufadi = this.ruleForm.origin
        }else{
          this.ruleForm.chufadi = this.ruleForm.origin.pod
        }
        //行程信息
        var object={
          //基本信息接口数据
          id:this.mealID,
          name: this.ruleForm.highlightWords,
          podID: this.ruleForm.podID,
          destinationID: this.ruleForm.destinationID,
          pod: this.ruleForm.chufadi,
          destination: this.ruleForm.mudidi,
          createTime:this.formatDate(new Date()),
          traffic: traff,
          loadPackage: true,
          briefMark: "string",
          loadPlan: true,
          codePrefix: "string",
          codeSuffix: "string"
        }
        this.$refs[formName].validate((valid) => {
          if(valid){
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/team/api/teampackagesave", {
                object: object
              },
            ).then(function(response) {
              if(response.data.isSuccess==true){
                _this.$message.success("修改成功");
              }else{
                _this.$message.success("修改失败");
              }
            }).catch(function(error) {
              console.log(error);
            });
          }
        })
      },
      //修改日程信息
      handleNote(formName){
        //行程餐食信息转字符串
        let sche1=JSON.stringify(this.ruleForm.schedules);
        let sche=JSON.parse(sche1);
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Meals=JSON.stringify(sche[i].ext_Meals);
        }
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Hotel=JSON.stringify(sche[i].ext_Hotel);
        }
        for(let i=0; i < this.schedulsLeng; i++){
          var object={
            //基本信息接口数据
            id:this.activeID[i],
            packageID:this.mealID,
            day:this.ruleForm.schedules[i].day,
            subject:this.ruleForm.schedules[i].subject,
            ext_Meals:JSON.stringify(this.ruleForm.schedules[i].ext_Meals),
            info:this.ruleForm.schedules[i].info,
            ext_Hotel:JSON.stringify(this.ruleForm.schedules[i].ext_Hotel),
            activitys: this.ruleForm.schedules[i].activitys,//行程信息
            createTime:this.formatDate(new Date()),
            loadPlan: false,
            code: "string"
          }
           this.$refs[formName].validate((valid) => {
         if(valid){
           var _this = this;
           this.$http.post(this.GLOBAL.serverSrc + "/team/api/teamschedulesave", {
               object: object
             },
           ).then(function(response) {
             if(response.data.isSuccess==true){
               _this.$message.success("修改成功");
             }else{
               _this.$message.success("修改失败");
             }


           }).catch(function(error) {
             console.log(error);
           });

         }
       })

        }
        //行程信息



      },
      // 取消
      cancel(){
        this.$router.push({path: "productList"});
      },
      handleClick(tab, event) {
        if(event.target.getAttribute('id')=='tab-second'){
          //this.goDate.length = this.ruleForm.travelDays;
          this.goDate=[];
          for(let i = 0; i < this.ruleForm.travelDays; i++){
            this.goDate.push({
              value : i+1,
              label : i+1
            })
          };
        }
      },

      childByValue: function(childValue) {
        // childValue就是子组件传过来的值
        this.travelDays = childValue;
      },
      otherNumber() {
        this.hotell = false;
        this.otherl = true;
      },
      //日程信息切换
      tabTravel(myindex) {
        this.mynumber = myindex;
      },
      //去程添加经停、删除经停
      stopping(index) {
        {
          this.ruleForm.plane[index].ext_Stopover.push({
            stopCity: '',
            stopDate: ''
          })
        }
      },
      deleteItem(p, index) {
        this.ruleForm.plane[index].ext_Stopover.splice(p, 1)
      },
      deletePanel(index) {
        this.ruleForm.plane.splice(index, 1)
      },
      //返程添加经停、删除经停
      reDeleteItem(p, index) {
        this.ruleForm.nackPlane[index].ext_Stopover.splice(p, 1)
      },
      reDeletePanel(index) {
        this.ruleForm.nackPlane.splice(index, 1)
      },
      reStopping(index) {
        {
          this.ruleForm.nackPlane[index].ext_Stopover.push({
            stopCity: '',
            stopDate: ''
          })
        }
      },
      //交通信息添加中转
      addTransit(index) {
        this.ruleForm.plane.push({
          pod: '',  //套餐id
          id: 0,
          goOrBack:1,   //1去程 2返程
          company: '',  //航空公司
          theNumber: '',   //航班号
          podCity: '',           //出发城市
          podPlace: '',   //出发机场
          podTime: '',    //出发时间
          arriveCity: '',    //到达城市
          arrivePlace: '',     //到达机场
          arriveTime: '',      //到达时间
          planeDay: '',       //到达天数
          trafficMode: '1',  //出行方式
          day: '1',      //第几天
          ext_Stopover: []
        })
      },
      addRTransit(index) {
        this.ruleForm.nackPlane.push({
          pod: '',  //套餐id
          id: 0,
          goOrBack:2,   //1去程 2返程
          company: '',  //航空公司
          theNumber: '',   //航班号
          podCity: '',           //出发城市
          podPlace: '',   //出发机场
          podTime: '',    //出发时间
          arriveCity: '',    //到达城市
          arrivePlace: '',     //到达机场
          arriveTime: '',      //到达时间
          planeDay: '',       //到达天数
          trafficMode: '1',  //出行方式
          day: '',      //第几天
          ext_Stopover: []
        })
      },
      //添加、删除酒店
      addHotel() {
        this.hotel.push({
          hotelAuto: '',
          hotelChinese: '',
          hotelEnglish: '',
          hotelAddress: '',
          hotelStar: '',
          hotelDay: '',
          hotelHouse: '',
          hotelBed: '',
          hotelAbstract: '',
          hotelPicture: ''
        })
      },
      deleteHotel(index) {
        this.hotelshow = true;
      },
      shutHotel(index) {
        this.hotel.splice(index, 1)
        this.hotelshow = false;
      },
      //酒店关闭取消按钮
      cloceHotel() {
        this.hotelshow = false;
      },
      //日程信息酒店切换
      tabHotel(index) {
        this.num6 = index;
      },
      //信息详情切换
      tabDetails(p, k, index) {
        // this.num7 = index;
      },
      handleClose2(tag2) {
        this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
      },
      showInput2() {
        this.inputVisible2 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleImgClick(file) {
        this.isShowImg = !this.isShowImg
        this.imgUrl = file.url
      },
      handleRemove(file, fileList) {
        this.isShowImg = false;
      },
      //轮播图预览
      slideshowClick(file) {
        this.isSlideshow = true;
        if (this.slideshowUrl == file.url) {
          this.isSlideshow = false;
          this.slideshowUrl = ''
        } else {
          this.slideshowUrl = file.url
        }
      },
      handleRemove2(file, fileList) {
        this.isSlideshow = false;
      },
      //视频删除
      handleRemoves(file, fileList) {
        // console.log(file);
      },
      //轮播图删除
      handleRemoves1(file, fileList) {
        // console.log(file);
      },
      //自动填充数据
      loadAll() {
        return [{
          "value": "三全鲜食（北新泾店）",
          "id": "1"
        },
          {
            "value": "Hot honey 首尔炸鸡（仙霞路）",
            "id": "2"
          },
          {
            "value": "新旺角茶餐厅",
            "id": "3"
          },
          {
            "value": "泷千家(天山西路店)",
            "id": "4"
          },
          {
            "value": "胖仙女纸杯蛋糕（上海凌空店）",
            "id": "5"
          }
        ];
      },
      //添加、删除详情
      addDetails(index) {
        this.ruleForm.schedules[index].activitys.push({
          typeExt: '',
          time: '',
          name: '',
          details: '',
          memo: '',
          pictureID: 0,
          activityType: '1',
          createTime: this.formatDate(new Date())
        })
      },
      deleteDetails(k, index) {
        this.ruleForm.schedules[index].activitys.splice(k, 1)
      },
      diaoyong(v,k,index){
        this.ruleForm.schedules[index].activitys[k].activityType = v;
      },
      baocun(p, index) {
        this.ruleForm.schedules[index].ext_Hotel[0].Details = p;
        this.ruleForm.schedules[index].ext_Hotel[0].IsHotel = 0;
      },
      close() {
        this.comboshow = false;
      },
      confirm() {
        this.handleTabsEdit(this.aindex, "remove");
        this.comboshow = false;
      },
      tab(index) {
        this.num = index;
      },
      tab1(index) {
        this.num1 = index;
      },
      //主题标题添加删除
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          if (this.comboshow == false) {
            this.comboshow = true;
            this.aindex = targetName;
            return false;
          } else {
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
              this.editableTabsValue = activeName;
              this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            }
          }
        }
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 搜索方法(出发地)
      querySearch1(queryString1, cb1) {
        var results1 = queryString1 ? this.tableData1.filter(this.createFilter(queryString1)) : [];
        cb1(results1);
      },
      // 搜索方法（出发地）
      // createFilter1(queryString1) {
      //   return (restaurant1) => {
      //     return (restaurant1.country.toLowerCase().indexOf(queryString1.toLowerCase()) === 0);
      //   }
      // },
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
        // const seconds = file.duration % 60;
        //  if (!seconds) {
        //     this.$message.error('上传视频时长不能超过20秒哦!');
        //     return false;
        // }
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
        // console.log(file);
      },
      //轮播图删除
      handleRemoves1(file, fileList) {
        // console.log(file);
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
        if(this.ruleForm.operationLabel !== ''){
          setTimeout(res =>{
            let inputVal4 = this.ruleForm.operationLabel;
            // if (inputVal4) {
            //   this.dynamicTags4.push(inputVal4);
            //  }
            this.inputVisible2 = false;
            this.ruleForm.operationLabel= '';
            this.empty = false;
          },200)
        }else{
          if(this.dynamicTags2.length == 0){
            this.empty = true;
            document.getElementById('input-error').style.border="solid 1px red";
          }else{
            this.inputVisible2 = false;
          }
        }
      },
      querySearch5(queryString5, cb) {
        this.tableData2 = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/olabel/api/olabelfuzzy', {
          "object": {
            labelName: queryString5
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.tableData2.push({
              "value" : res.data.objects[i].labelName,
              "id":res.data.objects[i].id
            })
          }
          var results = queryString5 ? this.tableData2.filter(this.createFilter(queryString5)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      dest_01(item){
        this.dynamicTags2.push({"labelID": item.id,"label": item.value,"teamID":0});
        this.ruleForm.operationLabel = "";
        this.inputVisible2 = false;
      },
      // 出发地
      querySearch3(queryString1, cb) {
        this.vague = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString1
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.vague.push({
              "id":res.data.objects[i].id,
              "value" : res.data.objects[i].areaName
            })
          }
          var results = queryString1 ? this.vague.filter(this.createFilter(queryString1)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      createFilter(queryString1){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      //目的地
      querySearch2(queryString2, cb) {
        this.tableData1 = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString2
          }
        },{
          headers:{
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.tableData1.push({
              "value" : res.data.objects[i].areaName,
              "id":res.data.objects[i].id
            })
          }
          var results = queryString2 ? this.tableData1.filter(this.createFilter(queryString2)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      createFilter(queryString2){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      //出游人群
      themeList(){
        this.excurList = [];
        this.$http.post(this.GLOBAL.serverSrc + "/universal/crowd/api/crowdlist", {
          object: {
            isDeleted: 0
          }
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(res =>{
          for(let i = 0; i < res.data.objects.length; i++){
            this.excurList.push(
              res.data.objects[i].name
            );
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      //主题
      itemList(){
        this.list = [];
        var _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/theme/api/themelist", {
          object: {
            isDeleted: 0
          }
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          for(let i = 0; i < response.data.objects.length; i++){
            _this.list.push(
              response.data.objects[i].name
            );
          }
        }).catch(function(error){
          console.log(error);
        })
      },
      // 生成guid
      guid(){
        var _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/utinity/api/getguid", {
          "object":true
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(res){
          // console.log(res)
          localStorage.setItem("guid",res.data.object)
        }).catch(function(err){
          console.log(err);
        })
      },
      // 出发地
      handleClose3(tag3) {
        if(tag3.id==this.ruleForm.origin.id){
          this.ruleForm.origin=[];
        }
        this.dynamicTags3.splice(this.dynamicTags3.indexOf(tag3), 1);
      },
      showInput3() {
        this.inputVisible3 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      departure(item){
        this.dynamicTags3.push({"podID": item.id,"pod": item.value});
        this.ruleForm.placeDeparture = "";
        this.inputVisible3 = false;
      },
      //aa
      handleInputConfirm3() {
        this.$refs['placeDeparture'].validate()
        if(this.ruleForm.placeDeparture !== ''){
          setTimeout(res =>{
            // for(let i=0;i<this.dynamicTags3.length;i++){
            // if(this.dynamicTags3[i].indexOf(this.ruleForm.placeDeparture) !== -1){
            // this.dynamicTags3.splice(this.dynamicTags3[i].indexOf(this.ruleForm.placeDeparture), 1)
            // }
            // }
            let inputVal3 = this.ruleForm.placeDeparture;
            //  if (inputVal3) {
            //   this.dynamicTags3.push(inputVal3);
            //    }
            this.inputVisible3 = false;
            this.ruleForm.placeDeparture= '';
            this.noNull = false
          },200)
        } else {
          if(this.dynamicTags3.length == 0){
            this.noNull = true
            document.getElementById('ddd').style.border="solid 1px red";
          } else {
            this.inputVisible3 = false;
          }
        }
      },
      // 目的地
      handleClose4(tag4) {
        if(tag4.id==this.ruleForm.bourn.id){
          this.ruleForm.bourn=[];
        }
        this.dynamicTags4.splice(this.dynamicTags4.indexOf(tag4), 1);
      },
      showInput4() {
        this.inputVisible4 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      dest(item){
        this.dynamicTags4.push({"destinationID": item.id,"destination": item.value});
        this.ruleForm.destinations = "";
        this.inputVisible4 = false;
      },
      handleInputConfirm4() {
        this.$refs['destinations'].validate()
        if(this.ruleForm.destinations !== ''){
          setTimeout(res =>{
            let inputVal4 = this.ruleForm.destinations;
            // if (inputVal4) {
            //   this.dynamicTags4.push(inputVal4);
            //  }
            this.inputVisible4 = false;
            this.ruleForm.destinations= '';
            this.errorNull = false;
          },200)
        }else{
          if(this.dynamicTags4.length == 0){
            this.errorNull = true;
            document.getElementById('input-error').style.border="solid 1px red";
          }else{
            this.inputVisible4 = false;
          }
        }
      },
      formatDate(date){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h=h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second=date.getSeconds();
        second=second < 10 ? ('0' + second) : second;
        //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        return y + '-' + m + '-' + d+' '+h+':'+minute;
      }
    }
  }
</script>

<style scoped>
  .change_save{ position: absolute;top: 70px;right: 206px;}
  .aid_address{float: left; }
  .set_meal_name{float: left;margin-left: 150px;margin-top: 5px;}
  .border_side{border: 1px solid #f2f2f2; width:100%; margin-left: 30px; float: left; padding-top: 10px;}
  .span2{ float:left; margin-left:16px; }
  .tripInfo { font-family: '微软雅黑'; font-size: 14px; margin: 0 0 100px 0; }
  .warp { position: relative; padding-bottom: 100px; }
  .btn { width: 160px; height: 44px; left: 68%; top: -64px; position: absolute; }
  .el-tabs--card>>>.el-tabs__item { margin-bottom: 0px!important; }
  .outline { border: 1px solid #f2f2f2; overflow: hidden; margin: 0 0 100px 0; }
  .highlightWords-input1 { width: 200px; float: left; }
  .span1 { float: left; margin: 0 0 0 10px; }
  .package { text-align: left; line-height: 40px; margin: 20px 0 0 30px; }
  .package_text { float: left; margin: 0 15px 0 0; }
  .package_input { float: left; width: 200px; margin: 0 15px 0 0; }
  .traffic { margin: 20px 0 0 30px; text-align: left; clear: both; }
  .traffic_title { font-size: 14pt; font-weight: bold; line-height: 60px; }
  .traffic_border { border: 1px solid #f2f2f2; width: 84%; overflow: hidden; margin: 0 0 20px 0; clear: both; }
  .traffic_button { float: left; margin: 10px 0 20px 30px; line-height: 40px; font-size: 20px; }
  .plane { width: 98%; overflow: hidden; background-color: #fafafa; margin-left: 1%; margin-bottom: 20px; margin-top: 20px; }
  .plane_type { width: 80px; margin: 20px 0 0 20px; }
  .plane_text { margin: 0 0 0 15px; }
  .aviation { padding: 0 0 0 0; clear: both; width: 100%; }
  .aviation_first { margin: 0 0 0 0; float: left; }
  .aviation_text { width: 85px; text-align: right; margin: 0 15px 0 0; float: left; line-height: 40px; }
  .aviation_input { width: 200px; float: left; }
  .day { width: 85px; float: left; margin: 0 0 0 25px; }
  .stop { clear: both; padding: 20px 0 20px 20px; }
  .stop_button { border: 1px solid #ff4b3a; }
  .hotel_button { line-height: 40px; margin: 10px 0 20px 15px; }
  .inline-input { float: left; width: 200px !important; }
  .upload-demo { position: absolute; top: 0; left: 200px; height: 40px; }
  .textarea { float: left; width: 60%; }
  .date { padding: 20px 0 0 30px; font-size: 18px; font-weight: bold; clear: both; }
  .radio_input { float: left; margin: 10px 0 0 0; }
  .food_text { width: 85px; text-align: right; margin: 0 15px 0 0; line-height: 40px; }
  .food_radio { margin: 0 0 0 100px; float: left; }
  .repast { float: left; width: 60px; }
  .state { margin: 0 0 0 20px; }
  .text_input { padding: 0 0 20px 0; overflow: hidden; width: 100%; }
  .type_radio { float: left; }
  ul { padding: 0px; margin: 10px 0 0 0; margin: 0 0 0 0; }
  ul .type_list { float: left; list-style-type: none; margin: 0 10px 0 0; text-align: left; }
  .tabCon { clear: both; padding: 20px 0 0 0; }
  .active { color: #ff5a3a }
  .schedule_border { border: 1px solid #f2f2f2; width: 85%; overflow: hidden; margin: 0 0 20px 0; }
  .schedule { overflow: hidden; background-color: #f9f9f9; margin-left: 0; margin-bottom: 20px; margin-top: 0px; }
  .schedule_tab { margin: 20px 0 0 15px; }
  .schedule_first { margin: 0 0 0 0; float: left; }
  .city { margin: 0 0 0 0; overflow: hidden; }
  .city_input { float: left; }
  .minutes { float: left; line-height: 40px; margin: 0 0 0 15px; }
  .textarea1 { float: left; width: 100%; }
  .dashed { border-bottom: 1px dashed #e5e5e5; overflow: hidden; height: 1px; width: 98%; margin-right: auto; margin-left: auto; margin-bottom: 20px; }
  .add { width: 450px; height: 250px; margin: auto; position: fixed; top: 50%; left: 50%; margin-top: -125px; margin-left: -225px; background: #fff; overflow: hidden; border: 1px solid #eeeeee; border-radius: 3px; z-index: 1000; }
  .label { background: #f6f6f6; border-bottom: 1px solid #eee; height: 57px; line-height: 40px; width: 450px; }
  .left { float: left; margin: 10px 0 0 20px; }
  .right { float: right; margin: 0 20px 0 0; font-size: 16pt; cursor: pointer; line-height: 57px; }
  .content { width: 310px; overflow: hidden; margin-left: auto; margin-right: auto; }
  .text { float: left; line-height: 40px; margin: 50px 0 0 0; }
  .input { float: left; width: 180px; margin: 0 0 0 15px; }
  .judge { padding: 30px 0 0 0; clear: both; }
  .mask { background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0; filter: alpha(opacity=50); opacity: 0.5; z-index: 100; }
  .inputBox { width: 200px; }
  .abc { height: 40px; width: 200px; line-height: 40px; text-align: center; margin: 10px 0 0 0; width: 100%; clear: both; }
  .transit { clear: both; padding: 0 0 0 20px; }
  .transit_border { border: 1px dashed #e5e5e5; width: 98%; margin-left: 1%; overflow: hidden; }
  .delete { float: left; line-height: 40px; margin: 0 0 0 40px; color: #2e96f9; cursor: pointer; }
  .addTab { padding: 0 0 20px 20px; float: left; }
  .describe_way { float: left; }
  .description { overflow: hidden; float: left; }
  .description li { list-style: none; float: left; margin: 0 0 20px 15px; text-align: left; }
  /*.cost_bg { margin: 12px; }*/
  .setmeal { float: left; }
  .depart { float: left; width: 140px; }
  .setout { float: left; line-height: 40px; margin: 0 10px 0 30px; }
  .setout span { color: red; margin: 0 5px 0 0; }
  /*日程信息*/
  .type_radio li { list-style: none; float: left; margin: 0 30px 0 0; }
  .details_ul { margin: 0 0 0 60px; }
  .explain { clear: both; padding: 15px 0 0 0; width: 100%; }
  .details_border { border: 1px solid #f2f2f2; width: 80%; margin: 0 0 20px 0; clear: both; position: relative; }
  .DAY { width: 40px; line-height: 40px; text-align: center; width: 100px; position: absolute; top: 55px; right: -120px; z-index: 10000 }
  .DAY_one { border-bottom: 1px solid #fff; }
  .DAY_two { background-color: #f7f7f7; border-bottom: 1px solid #fff; }
  .myactive { background-color: #c2c2c2; }
  .mybuttonac { background-color: #ecf5ff; border: 1px solid #c6e2ff }
  /*基本信息*/
  .productName{ width: 548px; float: left; margin-left: 10px; }
  .Numbers{ float: left; margin: 0 0 0 20px; }
  .travelType{ float: left; margin:13px 0 0 10px; }
  .startOff{ width:548px; float:left; margin-left:10px;}
  .route{overflow:hidden}
  .routeDay{width:300px; float:left}
  .routeDay-input{width:105px;right:30px}
  .routeDay-span{ margin-left:-19px; color:#333; }
  .routeNight{width:300px; float:left; margin: 0 0 0 -30px;}
  .routeNight-input{width:105px; float: left;}
  .routeNight-span{ margin-left:-100px; color:#333; float: left; }
  .indent{ float: left; margin-left: 10px; margin-top: 13px; }
  .bright{ width: 210px; float: left; margin-left: 10px; }
  .bright_b{float:left;margin-left:295px;margin-top:-62px;}
  .lightspot{ width: 210px; float: left; margin-left: 30px; }
  .lightspot-span{float: left; margin-left:16px; }
  .destination-input{width: 548px; float: left; margin-left: 10px; padding-bottom:-0.5px; border: 1px solid #dcdfe6; border-radius: 4px;}
  .operating_input{background:red;width:100px;height:200px}
  .firstFigure{width:200px;float:left;margin-left:10px;position:relative}
  .upload-demo{float:left;}
  .upload_div{height:215px;width:330px;position:absolute;z-index:9999;top:50px;left:30px;border:10px solid #D7D7D7;background:#fdfdfd;}
  .upload_img{display:block;width:100%;height:100%;}
  .banner{width:540px;float:left;margin-left:10px;position:relative}
  .Excursion-select{ width:166px; float: left; margin-left: 10px; }
  .applyDay{ width: 105px; float: left; margin-left: 10px; }
  .apply_day{ float: left; margin-left: 10px; color:#333;}
  .latest{overflow:hidden;}
  .minute_input{width:50px;float:left;margin-left:-95px;}
  .minute_span{ float:left; margin-left:-30px; color:#333; }
  .Summary{ width:544px; float:left; margin-left:8px; }
  .bright-number{float: left; margin: 0 0 0 17px;}
  .el-form-item>>>.el-form-item__error{left: 10px;}
  .vivo{text-align: center; margin: 0 0 50px 0;}
  .vivo>>>.el-tabs__item { width: 144px ; margin-bottom: 10px; font-size: 16px; }
  .el-tag { height:36px; float: left; margin-top: 1px; margin-left: 5px; background-color: #d7d7d7; color: #666666; }
  .input-new-tag { width:100px; float: left; margin-left: 5px; height: 36px; line-height: 30px; padding-top: 2px;margin-top:1px; margin-bottom:1px;}
  .el-autocomplete>>>.el-input--small .el-input__inner{ height: 35px!important; }
  .input-new-tags{ width:200px; float: left; margin-left: 5px; height: 30px; line-height: 30px; padding-top: 1px;margin-top:1px; margin-bottom:4px; padding-bottom: 2px}
  .operation_Label{ width:120px; float: left; margin-left: 5px; height: 36px; line-height: 30px; padding-top: 2px;margin-top:1px; margin-bottom:1px; }
  #isNull,#zero{ position: relative; float: left; top:30px; left:-550px ; color: #f56c6c; font-size: 12px;}
  .redStar{ color: #f56c6c; float: left; margin-left:-64px;}
  .number-day>>>.el-form-item__error{ left:0px; }
  .err_span>>>.el-form-item__error{ left:0px; }
  .lable_input{ width:200px; float: left; margin-left: 5px; height: 34px; line-height: 30px; padding-top: 1px;margin-top:1px; margin-bottom:0px; padding-bottom: 2px }
  .upload-btn{ position: absolute;left:-80px;top:0px; }
  .upload-demo>>>.el-upload-list__item{ top: -45px;
    left: -183px; background-color:#d7d7d7; float: left; width: 90px; height: 30px; padding: 0; background-size: 44%; background-repeat: no-repeat; background-position: 2px; background-image: url('../../../assets/image/pic.png') }
  .destination-input>>>.el-input--small .el-input__inner{ height: 35px!important; }
  /*费用说明*/
  .cost{
    font-weight: bold;
    font-size: 18px;
    height: 23px;
    margin: 6px 0 0 0;
    text-align: left;
  }
  .cost_button{
    margin: 10px 0 10px 0;
    text-align: left;
  }
  .cost_title{
    margin: 20px 0 0 10px;
    padding-top: 20px;
    text-align: left;
    font-family: 黑体;
    color: #333333;
  }
  .cost_content{
    width: 850px;
    margin: 15px 0 15px 10px;
    overflow: hidden;
    text-align: left;
  }
  .cost_bg{
    background: #e6e6e6;
    width: 870px;
    margin: 0 0 50px 0;
    overflow: hidden;

  }
  .content_explain{
    margin: 0 0 20px 0;
    background-color: #fff;
  }

  .other{margin: 0 0 50px 0; overflow: hidden;}

  .border{border: 1px solid #e7e7e7; width: 1070px; margin: 10px 0 10px 0;padding-bottom: 10px}

  .delete_button{float: left;margin: 0 0 0 10px; overflow: hidden;}

  .delete_button button{border: 1px solid #f56c6c;margin-bottom: 30px}

  .delete_button button:hover{color:#f56c6c; border: 1px solid #f56c6c;}
  .tab_size>>>.el-tabs__item{
    font-size: 25px;
  }
</style>
