<template>
  <!-- <div style="padding-left:80px"> -->
  <div>
    <div class="operation">
      <el-button style="border:1px solid #3095fa;color:#3095fa;" @click="$emit('closeButton', false)">取消</el-button>
      <el-button type="primary" @click="addsave">保存</el-button>
    </div>
   <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
    <el-form-item ref="chineseName" class="form-item" prop="chineseName" :label-width='formLabelWidth' label="中文名称:">
      <span class="redStar">*</span>
      <el-input class="form-input" v-model="form.chineseName" clearable placeholder="请输入中文名称"></el-input>
    </el-form-item>
     <el-form-item ref="englishName" class="form-item" prop="englishName" :label-width='formLabelWidth' label="英文名称:">
      <span class="redStar">*</span>
      <el-input class="form-input" v-model="form.englishName" clearable placeholder="请输入英文名称"></el-input>
    </el-form-item>
    <el-form-item class="form-item" prop="city" :label-width='formLabelWidth'  label="所属地区:">
      <el-autocomplete class="form-input" clearable placeholder="请输入地区名称" :fetch-suggestions="querySearch" @select="handleSelect" v-model="form.city" :trigger-on-focus="false"></el-autocomplete>
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
    <el-form-item class="form-item" prop="lat" :label-width='formLabelWidth' label="地理坐标:">
      <el-input class="form-input" v-model="form.lat" clearable placeholder="请输入经度"></el-input>
    </el-form-item>
    <el-form-item class="form-item form-error" prop="lng">
      <el-input style="width: 250px; margin-left:270px;margin-top: -62px;" class="form-input" v-model="form.lng" clearable placeholder="请输入纬度"></el-input>
    </el-form-item>
    <el-form-item style="margin-top: -20px;" class="form-item" prop="referenceTime" :label-width='formLabelWidth' label="参考用时:">
      <el-radio-group v-model="form.referenceTime">
        <el-radio label="1"><1小时</el-radio>
        <el-radio label="2">1-3小时</el-radio>
        <el-radio label="3">3-5小时</el-radio>
        <el-radio label="4">>5小时</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="form-item" :label-width='formLabelWidth' label="适宜季节:">
      <el-checkbox-group style="float:left" v-model="form.seasons">
        <el-checkbox label="1">春天</el-checkbox>
        <el-checkbox label="2">夏天</el-checkbox>
        <el-checkbox label="3">秋天</el-checkbox>
        <el-checkbox label="4">冬天</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="form-item" :label-width='formLabelWidth' label="适宜人群:">
      <el-checkbox-group style="float:left" v-model="form.crowds">
        <el-checkbox label="1">家庭</el-checkbox>
        <el-checkbox label="2">夫妻</el-checkbox>
        <el-checkbox label="3">独自旅行</el-checkbox>
        <el-checkbox label="4">商务</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="form-item" prop="openingHours" :label-width='formLabelWidth' label="开放时间:">
      <span class="redStar">*</span>
      <el-button style="border:1px solid #3095fa;color:#3095fa;" size="small" @click="showtime = true">编辑</el-button>
    </el-form-item>
    <!-- 信息展示预留 -->
     <div style="width: 1200px; float: left">
    <div v-if="isDataTime" style="margin-left:90px;width: 700px;background: #F7F7F7; padding: 20px;margin-bottom: 20px;float: left;">
      <!-- 周一 -->
      <div v-if="dateTime.one.length != 0" style="margin-top: -5px;float: left; width: 900px">
        <span style="float: left">周一</span>
        <div v-if="dateTime.one.alltime" style="margin-left:84px">
          <div v-for="(item, index) in dateTime.one" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.one.length > 1 && index != dateTime.one.length - 1">;</span>
          </div>
        </div>
        <div v-else style="margin-left:84px">
          <span>全天营业</span>
        </div>
      </div>
      <!-- 周二 -->
      <div v-if="dateTime.tue.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周二</span>
        <div style="margin-left:84px">
          <div v-for="(item, index) in dateTime.tue" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.tue.length > 1 && index != dateTime.tue.length - 1">;</span>
          </div>
        </div>
      </div>
      <!-- 周三 -->
      <div v-if="dateTime.wed.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周三</span>
        <div style="margin-left:84px">
          <div v-for="(item, index) in dateTime.wed" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.wed.length > 1 && index != dateTime.wed.length - 1">;</span>
          </div>
        </div>
      </div>
      <!-- 周四 -->
      <div v-if="dateTime.thur.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周四</span>
        <div style="margin-left:84px">
          <div v-for="(item, index) in dateTime.thur" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.thur.length > 1 && index != dateTime.thur.length - 1">;</span>
          </div>
        </div>
      </div>
      <!-- 周五 -->
      <div v-if="dateTime.fir.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周五</span>
        <div style="margin-left:84px">
          <div v-for="(item, index) in dateTime.fir" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.fir.length > 1 && index != dateTime.fir.length - 1">;</span>
          </div>
        </div>
      </div>
      <!-- 周六 -->
      <div v-if="dateTime.sat.length != 0" style="margin-top: -5px;float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周六</span>
        <div style="margin-left:84px">
          <div v-for="(item, index) in dateTime.sat" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.sat.length > 1 && index != dateTime.sat.length - 1">;</span>
          </div>
        </div>
      </div>
      <!-- 周日 -->
      <div v-if="dateTime.sun.length != 0" style="margin-top: -5px; float: left;width: 900px; margin-top: 10px">
        <span style="float: left">周日</span>
        <div style="margin-left:84px">
          <div v-for="(item, index) in dateTime.sun" :key="index" style="float: left; padding-left:10px">
            <span>{{item.start}}</span> - <span>{{item.end}}</span><span v-if="dateTime.sun.length > 1 && index != dateTime.sun.length - 1">;</span>
          </div>
        </div>
      </div>
      <!-- 其他说明 -->
      <div v-if="dateTime.desc != ''" style="float: left;margin-top: 10px;">
        <span style="float: left">{{dateTime.desc}}</span>
      </div>
    </div>
     </div>
    <!-- 信息展示预留END -->
    <el-form-item class="form-item" :label-width='formLabelWidth' label="图片:">
      <el-input v-model="form.imgs" disabled style="float:left;width:250px;">
      </el-input>
      <el-upload :on-preview="handleImgClick" class="upload-demo uploadimage" action="https://jsonplaceholder.typicode.com/posts/" list-type="picture" :limit='1' accept=".jpg,.png,.gif" :on-remove="handleRemove">
        <el-button type="info" class="upload-btn">
          <div v-show="isShowImg" style="">
            <img style="display:block;width:100%;height:100%;" :src="imgUrl" alt="">
          </div>
          上传
        </el-button>
      </el-upload>
    </el-form-item>
    <el-form-item class="form-item" :label-width='formLabelWidth' label="产品概述:">
      <el-input style="width: 705px;" :rows="13" type="textarea" v-model="form.introduction"></el-input>
    </el-form-item>

   </el-form>

  <!-- 编辑 -->

<el-dialog width='30%' top='20vh' append-to-body title="标签选择" :visible.sync="showEdit" custom-class="city_list">
  <LabelSelection></LabelSelection>
</el-dialog>
<!-- 开放时间 -->
<el-dialog width='1100px' top='10vh' append-to-body title="添加开放时间" :visible.sync="showtime" :show-close="false">
  <OpenTime v-on:timeList="timeList" v-on:closeButton="showtime = false"></OpenTime>
</el-dialog>
  </div>
</template>

<script>
import LabelSelection from './components/Labelselection'
import OpenTime from './components/Opentime'
export default {
  components:{
    LabelSelection,
    OpenTime
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
      isShowImg: '',
      imgUrl: '',
      weeklist:{
        0:'9:00-12:00 和 15:00-18:00',
        1:'9:00-12:00 和 15:00-18:00',
        2:'9:00-12:00 和 15:00-18:00',
        3:'9:00-12:00 和 15:00-18:00',
        4:'9:00-12:00 和 15:00-18:00',
        5:'9:00-12:00 和 15:00-18:00',
        6:'9:00-12:00 和 15:00-18:00',
      },
      showtime: false,
      showEdit: false,
      fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      vague: [],            // 模糊搜索数组
      placeholderValue: '请输入标签',
      destinationInput: 'destination-input', // 标签class
      isTag: false,
      isBlur: true,         // 标签失去焦点判断
      inputTag: '',         // 标签input框
      isDataTime: false,    // 开放时间详情开关
      dateTime: [],         // 开放时间数据
      form: {
        chineseName: '',    // 中文名称
        englishName:'',     // 英文名称
        city: '',           // 所属区域
        tags: [],           // 标签
        lat: '',            // 经度
        lng: '',            // 纬度
        referenceTime: '',  // 参考用时
        seasons: '',        // 适宜季节
        crowds: '',         // 适宜人群
        openingHours: '',   // 开放时间
        imgs: '',           // 图片
        introduction: "",   // 产品概述
      },
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
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
          city: [
            { required: true, message: '请选择所属地区', trigger: 'blur' }
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
    this.dateTime.one = [];
    this.dateTime.tue = [];
    this.dateTime.wed = [];
    this.dateTime.thur = [];
    this.dateTime.fir = [];
    this.dateTime.sat = [];
    this.dateTime.sun = [];
  },
  methods:{
    handleChange(e){
      console.log(e)
    },
    handleclose(){
      this.$emit('close')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 区域选择
    handleSelect(item) {
      // this.form.city = item;
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
    handleImgClick() {

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
          alert(12);
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
              start: item.sun.start,
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
    width 250px!important
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
  min-width: 250px;
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
  min-width: 250px;
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
  min-width: 250px;
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
  float: right;
  margin-top: -65px;
}
.input_tag>>>.el-input__inner {
  border: none;
}
.form-error>>>.el-form-item__error {
  margin-left: 270px;
  margin-top: -22px;
}
.redStar{ color: #f56c6c; float: left; margin-left:-82px;}

</style>
