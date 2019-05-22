<template>
  <!-- <div style="padding-left:80px"> -->
  <div @click="handleList">
    
   <el-form style="margin-left: 130px;" ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
    <el-form-item ref="chineseName" class="form-item" prop="chineseName" :label-width='formLabelWidth' label="中文名称:">
      <span class="redStar">*</span>
      <el-input class="form-input" v-model="form.chineseName" clearable placeholder="请输入中文名称"></el-input>
    </el-form-item>
     <el-form-item ref="englishName" class="form-item" prop="englishName" :label-width='formLabelWidth' label="英文名称:">
      <span class="redStar">*</span>
      <el-input class="form-input" v-model="form.englishName" clearable placeholder="请输入英文名称"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="areaId" :label-width='formLabelWidth'  label="所属地区:">
      <el-autocomplete class="form-input" clearable placeholder="请输入地区名称" :fetch-suggestions="querySearch" @blur="handleBlur" @select="handleSelect" v-model="form.areaId.value" :trigger-on-focus="false"></el-autocomplete>
    </el-form-item>
    <el-form-item class="form-item" prop="tags" :label-width='formLabelWidth' label="标签:">
      <span style="margin-left: -53px;" class="redStar">*</span>
      <div :class="destinationInput">
        <el-tag style="float: left; margin: 4px 0 0 4px;" :key="index" v-for="(tag, index) in form.tags" closable :disable-transitions="false" @close="handleCancel(tag)">
          {{tag.name}}
        </el-tag>
        <div style="float: left">
          <el-input ref="saveTagInput" style="" class="input_tag" v-model="inputTag" @keyup.enter.native="handleInputConfirm(inputTag)" @blur="handleInputConfirm(inputTag)" :placeholder="placeholderValue"></el-input>
        </div>
      </div>
    </el-form-item>
    <el-form-item class="form-item" prop="lat" :label-width='formLabelWidth' label="经度:">
      <el-input class="form-input" v-model="form.lat" clearable placeholder="请输入经度"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="lng" label="纬度:">
      <el-input class="form-input" v-model="form.lng" clearable placeholder="请输入纬度"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="referenceTime" :label-width='formLabelWidth' label="参考用时:">
      <el-radio-group v-model="form.referenceTime">
        <el-radio v-for="(item, index) in referenceTime" :key="index" :label="item.id">{{item.dict_Name}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="form-item" :label-width='formLabelWidth' label="适宜季节:">
      <el-checkbox-group style="float:left" v-model="form.seasons">
        <el-checkbox v-for="(item, index) in seasons" :key="index" :label="item.id">{{item.dict_Name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="form-item" :label-width='formLabelWidth' label="适宜人群:">
      <el-checkbox-group style="float:left" v-model="form.crowds">
        <el-checkbox v-for="(item, index) in crowds" :key="index" :label="item.id">{{item.dict_Name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="form-item" prop="openingHours" :label-width='formLabelWidth' label="开放时间:">
      <span class="redStar">*</span>
      <el-button style="border:1px solid #3095fa;color:#3095fa;" size="small" @click="editBoo">编辑</el-button>
    </el-form-item>
    <!-- 信息展示预留 -->
    <div style="width: 1200px; float: left">
    <div v-if="isDataTime" style="margin-left:90px;width: 565px;background: #F7F7F7; padding: 20px;margin-bottom: 20px;float: left;">
      <!-- 周一 -->
      <div v-if="dateTime.one.length != 0" style="margin-top: -5px;float: left; width: 900px">
        <span style="float: left">周一</span>
        <div v-if="!dateTime.one[0].alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.one" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.one.length > 1 && index != dateTime.one.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:92px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 周二 -->
      <div v-if="dateTime.tue.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周二</span>
        <div v-if="!dateTime.tue[0].alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.tue" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.tue.length > 1 && index != dateTime.tue.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:92px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 周三 -->
      <div v-if="dateTime.wed.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周三</span>
        <div v-if="!dateTime.wed[0].alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.wed" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.wed.length > 1 && index != dateTime.wed.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:92px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 周四 -->
      <div v-if="dateTime.thur.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周四</span>
        <div v-if="!dateTime.thur[0].alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.thur" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.thur.length > 1 && index != dateTime.thur.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:92px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 周五 -->
      <div v-if="dateTime.fir.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周五</span>
        <div v-if="!dateTime.fir[0].alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.fir" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.fir.length > 1 && index != dateTime.fir.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:92px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 周六 -->
      <div v-if="dateTime.sat.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周六</span>
        <div v-if="!dateTime.sat[0].alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.sat" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.sat.length > 1 && index != dateTime.sat.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:92px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 周日 -->
      <div v-if="dateTime.sun.length != 0" style="margin-top: -5px; float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周日</span>
        <div v-if="!dateTime.sun[0].alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.sun" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.sun.length > 1 && index != dateTime.sun.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:92px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 其他说明 -->
      <div v-if="dateTime.desc != ''" style="float: left;margin-top: 10px;">
        <span style="float: left">{{dateTime.desc}}</span>
      </div>
    </div>
     </div>
    <!-- 信息展示预留END -->

    <!-- <el-form-item class="form-item" :label-width='formLabelWidth' label="图片:">
      <el-input v-model="form.imgs" disabled style="float:left;width:250px;"></el-input>
      <el-upload :on-preview="handleImgClick" class="upload-demo uploadimage" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture" :limit='1' accept=".jpg,.png,.gif" :on-remove="handleRemove">
        <el-button type="info" class="upload-btn">
          <div v-show="isShowImg" style="">
            <img style="display:block;width:100%;height:100%;" :src="imgUrl" alt="">
          </div>
          上传
        </el-button>
      </el-upload>
    </el-form-item> -->

    <el-form-item class="form-item" :label-width='formLabelWidth' label="图片:">
      <div class="img_upload">
        <template v-for="(item, index) in form.imgs">
          <img class="img_list" id="showDiv" :key="item.img_ID" src="@/assets/image/pic.png" alt="" @click="imgClickShow(item)">
          <div class="img_div" :key="index">x</div>
        </template>
      </div>
      <el-button class="img_button" type="info" @click="handleImgUpload">上传</el-button>
      <div v-show="isImgUrlShow" class="show_div">
        <img class="show_img" :src="imgUrlShow" alt="">
      </div>
    </el-form-item>

    <el-form-item class="form-item" :label-width='formLabelWidth' label="产品概述:">
      <el-input style="width: 605px;" :rows="13" type="textarea" v-model="form.introduction"></el-input>
    </el-form-item>

   </el-form>

    <div class="operation">
      <el-button style="width: 100px; border:1px solid #3095fa;color:#3095fa;" @click="$emit('closeButton', false)">取消</el-button>
      <el-button style="width: 100px;" type="primary" @click="addsave">保存</el-button>
    </div>

<!-- 编辑 -->
<el-dialog width='30%' top='20vh' append-to-body title="标签选择" :visible.sync="showEdit" custom-class="city_list">
  <LabelSelection></LabelSelection>
</el-dialog>
<!-- 开放时间 -->
<el-dialog width='1100px' top='10vh' append-to-body title="添加开放时间" :visible.sync="showtime" :show-close="false" @close="closeBoo">
  <OpenTime v-on:timeList="timeList" v-on:closeButton="showtime = false" :dateTime="dateTime" v-if="hackReset"></OpenTime>
</el-dialog>
<!-- 上传 -->
<el-dialog width='1300px' top='5vh' append-to-body title="图片选择" :visible.sync="imgUpload" custom-class="city_list">
  <MaterialList :imgData="imgData" :chineseName="form.chineseName" v-on:checkList="checkList" v-on:closeButton="imgUpload = false"></MaterialList>
</el-dialog>
</div>
</template>

<script>
import LabelSelection from './components/Labelselection'
import OpenTime from './components/Opentime'
import MaterialList from '@/common/Image'

export default {
  props: ['referenceTime', 'seasons', 'crowds', 'handleEditDate'],
  components:{
    LabelSelection,
    OpenTime,
    MaterialList
  },
  data() {
    var chineseNameRule = (rule, value, callback) => {
      if (!this.form.chineseName && !this.form.englishName) {
        return callback(new Error('中文名称、英文名称至少有一个'));
      } else {
        var patt = /[a-zA-Z]/
        if (this.form.englishName.match(patt)) {
          this.$refs.englishName.clearValidate();
        }
        callback();
      }
    };
    var englishNameRule = (rule, value, callback) => {
      if (!this.form.chineseName && !this.form.englishName) {
        return callback(new Error('中文名称、英文名称至少有一个'));
      } else {
        var patt = /[\u4e00-\u9fa5]/
        if (this.form.chineseName.match(patt)) {
          this.$refs.chineseName.clearValidate();
        }
        callback();
      }
    };
    var areaIdRule = (rule, value, callback) => {
      setTimeout(() => {
        if (!this.form.areaId.value) {
          return callback(new Error('请选择所属地区'));
        } else {
          callback();
        }
      }, 200)
    };
    var tagRule = (rule, value, callback) => {
      if (this.form.tags.length == 0) {
        this.destinationInput = 'destination-input1';
        return callback(new Error('输入至少一条标签数据'));
      } else {
        this.destinationInput = 'destination-input2';
        callback();
      }
    };
    var openingHoursRule = (rule, value, callback) => {
      if (this.dateTime.one.length == 0
       && this.dateTime.tue.length == 0
       && this.dateTime.wed.length == 0
       && this.dateTime.thur.length == 0
       && this.dateTime.fir.length == 0
       && this.dateTime.sat.length == 0
       && this.dateTime.sun.length == 0) {
        return callback(new Error('请补充开放用时'));
       } else {
        callback();
       }
    };
    return {
      formLabelWidth: '90px',
      isImgUrlShow: false,
      imgUrlShow: '', // 点击查看图片
      isShowImg: '',
      imgUrl: '',
      imgData: [],
      showtime: false,      // 开放时间弹窗
      showEdit: false,      // 编辑弹窗
      imgUpload: false,     // 上传弹窗
      hackReset: true,
      fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      vague: [],            // 模糊搜索数组
      placeholderValue: '请输入标签',
      destinationInput: 'destination-input', // 标签class
      isTag: false,
      isSelect: false,      // 判断是否进入select
      isBlur: true,         // 标签失去焦点判断
      inputTag: '',         // 标签input框
      isDataTime: false,    // 开放时间详情开关
      dateTime: [],         // 开放时间数据
      form: {
        chineseName: '',    // 中文名称
        englishName:'',     // 英文名称
        areaId: {           // 所属区域
          id: '',
          value: ''
        },         
        tags: [],           // 标签
        lat: '',            // 经度
        lng: '',            // 纬度
        referenceTime: '',  // 参考用时
        seasons: [],        // 适宜季节
        crowds: [],         // 适宜人群
        openingHours: '',   // 开放时间
        imgs: [],           // 图片
        introduction: "",   // 产品概述
      },
      // 表单验证
      rules: {
        chineseName: [
          { pattern: /[\u4e00-\u9fa5]/, message: '请输入中文' },
          { validator: chineseNameRule }
        ],
        englishName: [
          { pattern: /[a-zA-Z]/, message: '请输入英文' },
          { validator: englishNameRule }
        ],
        areaId: [
          { validator: areaIdRule, trigger: 'blur' }
          // { required: true, message: '请选择所属地区', trigger: 'blur' }
        ],
        tags: [
          { validator: tagRule, trigger: 'blur' }
        ],
        lat: [
          { required: true, message: '请填写地理坐标', trigger: 'blur' }
        ],
        lng: [
          { required: true, message: '请填写地理坐标', trigger: 'blur' }
        ],
        referenceTime: [
          { required: true, message: '请选择用时' }
        ],
        openingHours: [
          { validator: openingHoursRule }
        ]
      }
    }
  },
  created() {
    if (this.handleEditDate != '') {
      this.templateEmpty();
      this.changeData();
    } else {
      this.templateEmpty();
      if (this.$refs['form'] != undefined) {
        this.$refs['form'].resetFields();
      }
    }
  },
  watch: {
    handleEditDate() {
      if (this.handleEditDate != '') {
        this.templateEmpty();
        this.changeData();
      } else {
        this.templateEmpty();
        if (this.$refs['form'] != undefined) {
          this.$refs['form'].resetFields();
        }
      }
    },
  },
  methods:{
    handleList(a) {
      if (a.target.id != 'showDiv') {
        this.isImgUrlShow = false;
      }
    },
    // 点击图片查看
    imgClickShow(data) {
      this.$http.post('http://192.168.1.186:3024' + '/picture/api/get',{
          "id": data.img_ID,
      }).then(res => {
        this.isImgUrlShow = true;
        this.imgUrlShow = "http://192.168.1.186:3009/upload" + res.data.object.url;
      })
    },
    // 图片添加
    checkList(data) {
      this.form.imgs = data.map(v => {
        return {
          img_ID: v,
        }
      })
    },
    // 上传按钮
    handleImgUpload() {
      this.imgData = this.form.imgs.map(v => v.img_ID);
      this.imgUpload = true;
    },
    closeBoo(){
      this.showtime = false;
      setTimeout(() => {
        this.hackReset = false;
      },200)
    },
    editBoo(){
      this.showtime = true;
      this.hackReset = true;
    },
    templateEmpty() {
      this.isDataTime = false;
      this.dateTime.one = [];
      this.dateTime.tue = [];
      this.dateTime.wed = [];
      this.dateTime.thur = [];
      this.dateTime.fir = [];
      this.dateTime.sat = [];
      this.dateTime.sun = [];
      this.dateTime.desc = '';
      this.placeholderValue = '请输入标签';
      this.form = {
        chineseName: '',    // 中文名称
        englishName:'',     // 英文名称
        areaId: {           // 所属区域
          id: '',
          value: ''
        },         
        tags: [],           // 标签
        lat: '',            // 经度
        lng: '',            // 纬度
        referenceTime: '',  // 参考用时
        seasons: [],        // 适宜季节
        crowds: [],         // 适宜人群
        openingHours: '',   // 开放时间
        imgs: [],           // 图片
        introduction: "",   // 产品概述
      }
    },
    changeData() {
      let form = this.form;           // 表单数据
      let data = this.handleEditDate; // 接口获取的数据
      if (data.openingHours.length != 0 || data.openingHourExplain != '') {
        this.isDataTime = true;
        data.openingHours.forEach(item => {
          if (item.theWeek == 1) {
            if (item.beginDate == '00:00' && item.endDate == '24:00') {
              this.dateTime.one.push({
                'alltime': true
              })
            } else {
              this.dateTime.one.push({
                'start': item.beginDate,
                'end': item.endDate
              });
            }
          } else if (item.theWeek == 2) {
            if (item.beginDate == '00:00' && item.endDate == '24:00') {
              this.dateTime.tue.push({
                'alltime': true
              })
            } else {
              this.dateTime.tue.push({
                'start': item.beginDate,
                'end': item.endDate
              });
            }
          } else if (item.theWeek == 3) {
            if (item.beginDate == '00:00' && item.endDate == '24:00') {
              this.dateTime.wed.push({
                'alltime': true
              })
            } else {
              this.dateTime.wed.push({
                'start': item.beginDate,
                'end': item.endDate
              });
            }
          } else if (item.theWeek == 4) {
            if (item.beginDate == '00:00' && item.endDate == '24:00') {
              this.dateTime.thur.push({
                'alltime': true
              })
            } else {
              this.dateTime.thur.push({
                'start': item.beginDate,
                'end': item.endDate
              });
            }
          } else if (item.theWeek == 5) {
            if (item.beginDate == '00:00' && item.endDate == '24:00') {
              this.dateTime.fir.push({
                'alltime': true
              })
            } else {
              this.dateTime.fir.push({
                'start': item.beginDate,
                'end': item.endDate
              });
            }
          } else if (item.theWeek == 6) {
            if (item.beginDate == '00:00' && item.endDate == '24:00') {
              this.dateTime.sat.push({
                'alltime': true
              })
            } else {
              this.dateTime.sat.push({
                'start': item.beginDate,
                'end': item.endDate
              });
            }
          } else if (item.theWeek == 7) {
            if (item.beginDate == '00:00' && item.endDate == '24:00') {
              this.dateTime.sun.push({
                'alltime': true
              })
            } else {
              this.dateTime.sun.push({
                'start': item.beginDate,
                'end': item.endDate
              });
            }
          }
        })
      }
      form.id = data.id;
      form.chineseName = data.chineseName;
      form.englishName = data.name;
      form.areaId = {
        'id': data.areaID,
        'value': data.areaName
      };
      form.tags = data.labels.split(',').map(v => {
        return {'name': v};
      });
      if (form.tags != '') this.placeholderValue = '';
      form.lat = data.lat;
      form.lng = data.lng;
      form.referenceTime = data.referenceTime? data.referenceTime.dict_ID: '';
      form.seasons = data.seasons.map(v => v.dict_ID);
      form.crowds = data.crowds.map(v => v.dict_ID);
      form.introduction = data.introduction;
      form.imgs = data.imgs.map(v => {
        return {img_ID: v.img_ID}
      })
      this.dateTime.desc = data.openingHourExplain;
      console.log(data)
    },
    // 区域选择
    handleSelect(item) {
      this.form.areaId = item;
      this.isSelect = true;
    },
    // 区域选择失去焦点
    handleBlur() {
      setTimeout(() => {
        if(this.isSelect === false) {
          this.form.areaId = {
            'id': '',
            'value': ''
          };
        } else {
          this.isSelect = false;
        }
      }, 200)
    },
    // 区域联想
    querySearch(queryString, cb) {
      this.vague = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
        "object": {
            areaName: queryString
          }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.vague.push({
            "id" : res.data.objects[i].id,
            "value" : res.data.objects[i].areaName
          })
        }
        var results = queryString ? this.vague.filter(this.createFilter(queryString)) : [];
        cb(results)
      })
    },
    // 搜索方法
    createFilter(queryString){
      return (restaurant) => {
        return (restaurant.value);
      }
    },
    // 标签input回车事件
    handleInputConfirm(val) {
      if (val != '') { // 为空不可填
        this.form.tags = this.form.tags.filter(x => x.name != val);
          this.form.tags.push({
            name: val
          })
          this.placeholderValue = ''
          this.inputTag = '';
          // 退出焦点事件
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.blur();
          });
      }

    },
    // 标签删除事件
    handleCancel(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
      // 触发验证
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.blur();
      });
      if (this.form.tags.length == 0) {
          this.placeholderValue = '请输入标签';
      }
    },
    // 添加景点信息保存
    addsave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 标签
          let labels = this.form.tags.map(v => v.name).join();
          // 参考用时
          let referenceTime = {'dict_ID': this.form.referenceTime}
          // 适宜季节
          let seasons = this.form.seasons.map(v => {
            return {'dict_ID': v}
          })
          // 适宜人群
          let crowds = this.form.crowds.map(v => {
            return {'dict_ID': v}
          })
          let openingHours = this.dateTime.one.map(v => {
            if (v.alltime) {
              return {
                'theWeek':   1,
                'beginDate': '00:00',
                'endDate':   '24:00'
              }
            } else {
              return {
                'theWeek':   1,
                'beginDate': v.start,
                'endDate':   v.end
              }
            }
          }).concat(this.dateTime.tue.map(v => {
            if (v.alltime) {
              return {
                'theWeek':   2,
                'beginDate': '00:00',
                'endDate':   '24:00'
              }
            } else {
              return {
                'theWeek':   2,
                'beginDate': v.start,
                'endDate':   v.end
              }
            }
          })).concat(this.dateTime.wed.map(v => {
            if (v.alltime) {
              return {
                'theWeek':   3,
                'beginDate': '00:00',
                'endDate':   '24:00'
              }
            } else {
              return {
                'theWeek':   3,
                'beginDate': v.start,
                'endDate':   v.end
              }
            }
          })).concat(this.dateTime.thur.map(v => {
            if (v.alltime) {
              return {
                'theWeek':   4,
                'beginDate': '00:00',
                'endDate':   '24:00'
              }
            } else {
              return {
                'theWeek':   4,
                'beginDate': v.start,
                'endDate':   v.end
              }
            }
          })).concat(this.dateTime.fir.map(v => {
            if (v.alltime) {
              return {
                'theWeek':   5,
                'beginDate': '00:00',
                'endDate':   '24:00'
              }
            } else {
              return {
                'theWeek':   5,
                'beginDate': v.start,
                'endDate':   v.end
              }
            }
          })).concat(this.dateTime.sat.map(v => {
            if (v.alltime) {
              return {
                'theWeek':   6,
                'beginDate': '00:00',
                'endDate':   '24:00'
              }
            } else {
              return {
                'theWeek':   6,
                'beginDate': v.start,
                'endDate':   v.end
              }
            }
          })).concat(this.dateTime.sun.map(v => {
            if (v.alltime) {
              return {
                'theWeek':   7,
                'beginDate': '00:00',
                'endDate':   '24:00'
              }
            } else {
              return {
                'theWeek':   7,
                'beginDate': v.start,
                'endDate':   v.end
              }
            }
          }))

          // 添加操作
          if (this.handleEditDate == '') {
            this.$http.post(this.GLOBAL.serverSrc + '/scenicspot/api/insert', {
              "object": {
                'name':               this.form.englishName,
                'chineseName':        this.form.chineseName,
                'areaID':             this.form.areaId.id,
                'areaName':           this.form.areaId.value,
                'link':               '这是链接',
                'labels':             labels,
                'lat':                this.form.lat,
                'lng':                this.form.lng,
                'referenceTime':      referenceTime,
                'openingHours':       openingHours,
                'openingHourExplain': this.dateTime.desc,
                'seasons':            seasons,
                'crowds':             crowds,
                'introduction':       this.form.introduction,
                'imgs':               this.form.imgs,
                "createTime":         "2019-03-20T05:36:16.641Z",
              }
            }).then(res => {
              this.$message.success('添加成功！');
              this.$emit('closeButton', false);
              this.$emit('callInit', true);
            })
          } else { // 编辑操作
            this.$http.post(this.GLOBAL.serverSrc + '/scenicspot/api/save', {
              "object": {
                'id':                 this.form.id,
                'name':               this.form.englishName,
                'chineseName':        this.form.chineseName,
                'areaID':             this.form.areaId.id,
                'areaName':           this.form.areaId.value,
                'link':               '这是链接',
                'labels':             labels,
                'lat':                this.form.lat,
                'lng':                this.form.lng,
                'referenceTime':      referenceTime,
                'openingHours':       openingHours,
                'openingHourExplain': this.dateTime.desc,
                'seasons':            seasons,
                'crowds':             crowds,
                'introduction':       this.form.introduction,
                'imgs':               this.form.imgs,
                "createTime":         "2019-03-20T05:36:16.641Z",    
              }
            }).then(res => {
              this.$message.success('修改成功！');
              this.$emit('closeButton', false);
              this.$emit('callInit', true);
            })
          }
        }
      })
    },
    // 开放时间信息
    timeList(list) {
      this.dateTime.one = [];
      this.dateTime.tue = [];
      this.dateTime.wed = [];
      this.dateTime.thur = [];
      this.dateTime.fir = [];
      this.dateTime.sat = [];
      this.dateTime.sun = [];
      this.showtime = false;
      let data = list;

      // 周一
      if (data.alltimeOne) {
        this.dateTime.one.push({
          alltime: data.alltimeOne
        })
      } else {
        data.one.forEach(item => {
          if (item.start || item.end) {
            this.dateTime.one.push({
              start: item.start,
              end: item.end
            })
          }
        })
      }
      
      // 周二
      if (data.alltimeTue) {
        this.dateTime.tue.push({
          alltime: data.alltimeTue
        })
      } else {
        data.tue.forEach(item => {
          if (item.start || item.end) {
            this.dateTime.tue.push({
              start: item.start,
              end: item.end
            })
          }
        })
      }
      
      // 周三
      if (data.alltimeWed) {
        this.dateTime.wed.push({
          alltime: data.alltimeWed
        })
      } else {
        data.wed.forEach(item => {
          if (item.start || item.end) {
            this.dateTime.wed.push({
              start: item.start,
              end: item.end
            })
          }
        })
      }
      
      // 周四
      if (data.alltimeThur) {
        this.dateTime.thur.push({
          alltime: data.alltimeThur
        })
      } else {
        data.thur.forEach(item => {
          if (item.start || item.end) {
            this.dateTime.thur.push({
              start: item.start,
              end: item.end
            })
          }
        })
      }
      
      // 周五
      if (data.alltimeFir) {
        this.dateTime.fir.push({
          alltime: data.alltimeFir
        })
      } else {
        data.fir.forEach(item => {
          if (item.start || item.end) {
            this.dateTime.fir.push({
              start: item.start,
              end: item.end
            })
          }
        })
      }
      
      // 周六
      if (data.alltimeSat) {
        this.dateTime.sat.push({
          alltime: data.alltimeSat
        })
      } else {
        data.sat.forEach(item => {
          if (item.start || item.end) {
            this.dateTime.sat.push({
              start: item.start,
              end: item.end
            })
          }
        })
      }
      
      // 周日
      if (data.alltimeSun) {
        this.dateTime.sun.push({
          alltime: data.alltimeSun
        })
      } else {
        data.sun.forEach(item => {
          if (item.start || item.end) {
            this.dateTime.sun.push({
              start: item.start,
              end: item.end
            })
          }
        })
      }
      
      this.dateTime.desc = data.desc;

      if (this.dateTime.one.length != 0
       || this.dateTime.tue.length != 0
       || this.dateTime.wed.length != 0
       || this.dateTime.thur.length != 0
       || this.dateTime.fir.length != 0
       || this.dateTime.sat.length != 0
       || this.dateTime.sun.length != 0
       || this.dateTime.desc != ''
      ) {
        this.isDataTime = true;
        this.$refs['form'].clearValidate('openingHours');
      } else {
        this.isDataTime = false;
      }
    }

  }
}
</script>

<style lang='stylus' scoped>
.form-item
  .form-input
    float left
    width 300px!important
  .form-btn
    float left
    margin-top 5px
  .upload-demo
    width 60%
  .text-area
    float left
    width 60%
.weeklist
  padding-left 70px
  text-align left
  .weekitem
    list-style none
    margin 10px
.region_search {
  margin-left: 12px;
  .inputBox {
    margin-left: 7px;
    width: 250px;
  }
}
.destination-input {
  height: 40px;
  min-width: 300px;
  float: left;
  padding-bottom:-0.5px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  .input-new-tag {
    margin-left : 3px;
  }
}
.destination-input1 {
  height: 40px;
  min-width: 300px;
  float: left;
  padding-bottom:-0.5px;
  border: 1px solid red;
  border-radius: 4px;
  .input-new-tag {
    margin-left : 3px;
  }
}
.destination-input2 {
  height: 40px;
  min-width: 300px;
  float: left;
  padding-bottom:-0.5px;
  border: 1px solid #67C23A;
  border-radius: 4px;
  .input-new-tag {
    margin-left : 3px;
  }
}
.upload-btn {
  float: left;
}
.operation {
  // margin: 30px 0 0 50%;
  text-align: center;
}
.input_tag>>>.el-input__inner {
  border: none;
}
.form-error>>>.el-form-item__error {
  margin-left: 270px;
  margin-top: -22px;
}
.redStar{ color: #f56c6c; float: left; margin-left:-82px;}
.img_upload {
  float: left;
  width: 300px;
  height: 40px;
  // background:#F5F7FA;
  border: solid 1px #E4E7ED;
}
.img_list {
  float: left;
  margin: 5px 0 0 10px;
  width: 30px;
  height: 30px;
}
.img_list:hover {
  cursor:pointer;
}
.img_div {
  float: left;
  margin: 9px 0 0 0;
  border: solid 2px #717171;
  width: 10px;
  height: 18px;
  text-align: center;
  line-height: 16px;
  font-size: 18px;
  background: #FFFFFF;
}
.img_div:hover {
  cursor:pointer;
}
.img_button {
  float: left;
}
.show_div {
  width: 300px;
  margin-top: 40px;
  position: relative;
  top: 10px;
  z-index: 999;
}
.show_img {
  width: 100%;
  height: 200px;
}
</style>
