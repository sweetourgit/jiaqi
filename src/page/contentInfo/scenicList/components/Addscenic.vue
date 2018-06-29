<template>
  <div class="addscenice">
    <div class="content">
      <div class="title">
        添加景点
        <span 
          @click="handleclose"
          class="iconfont">
            <a style="cursor:pointer" class="el-icon-close"></a>
          </span>
      </div>
      <div class="name">
        <span class="name-title">中文名称</span>
        <span class="name-input">
          <el-input v-model="name" placeholder="请输入内容">
          </el-input>
        </span>
      </div>
       <div class="name">
        <span class="name-title">英文名称</span>
        <span class="name-input">
          <el-input v-model="enname" placeholder="请输入内容">
          </el-input>
        </span>
      </div>
      <div class="name">
        <span class="name-title">所属区域</span>
        <span class="name-input">
            <el-cascader
              :options="options"
              v-model="city"
              @change="handleChange">
            </el-cascader>
        </span>
      </div>
      <div class="name">
        <span class="name-title">景点标签</span>
        <span class="name-input">
            <a
             class="edit"
             @click="handleshowlabel"
            >编辑
            </a>
        </span>
      </div>
      <div class="name">
        <span class="name-title">地理位置</span>
        <span class="position">
          lat(纬度):
          <el-input style="width:200px;margin-left:6px" v-model="lat" placeholder="请输入内容"></el-input>
        </span>
      </div>
      <div class="name">
        <span class="name-title"></span>
        <span style="margin-left:96px" class="position">
          lng(经度):
          <el-input style="width:200px" v-model="lng" placeholder="请输入内容"></el-input>
        </span>
      </div>
      <div class="name">
        <span class="name-title">参考用时</span>
        <el-checkbox> ＜1小时</el-checkbox>
        <el-checkbox>1~3小时</el-checkbox>
        <el-checkbox>3~5小时</el-checkbox>
        <el-checkbox>>5小时</el-checkbox>
      </div>
      <div class="name">
        <span class="name-title">开放时间</span>
        <span class="name-input">
          <el-button
            @click="showopentime"
            type="primary"
          >
          添加开放时间
          </el-button>
        </span>
      </div>
      <div class="name">
        <span class="name-title">适宜季节</span>
        <span class="name-input">
          <el-checkbox>春</el-checkbox>
          <el-checkbox>夏</el-checkbox>
          <el-checkbox>秋</el-checkbox>
          <el-checkbox>冬</el-checkbox>
        </span>
      </div>
      <div class="name">
        <span class="name-title">适宜人群</span>
        <span class="name-input">
          <el-checkbox>老人</el-checkbox>
          <el-checkbox>儿童</el-checkbox>
          <el-checkbox>成人</el-checkbox>
        </span>
      </div>
      <div class="name">
        <span class="name-title">景点图片</span>
      
      </div>
      <el-upload
          class="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList2"
          list-type="picture">
          <el-button
            size="small"
            type="primary"
            style="margin-left:-400px;padding: 12px 20px;"
          >
          选择上传文件
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div class="name">
        <span class="name-title">景点简介</span>
        
      </div>
      <textarea class="textarea" v-model="text"></textarea>
      <div class="center">
        <el-button
          @click="handleclose"
          style="padding:12px 30px" 
          plain>取消</el-button>
        <el-button 
          style="padding:12px 30px" 
          type="primary">确定</el-button>
      </div>
    <fade-animation>
      <label-selection
        @close='handleshowlabel'
        v-show="showlabel"
      />
    </fade-animation>
    <fade-animation>
      <open-time
        @close='showopentime'
        class="opentime"
        v-show="showtime"
      />
    </fade-animation>
    </div>
  </div>
</template>

<script>
import OpenTime from './components/Opentime'
import FadeAnimation from '@/common/FadeAnimation'
import LabelSelection from './components/Labelselection'
export default {
  components: {
    LabelSelection,
    OpenTime,
    FadeAnimation
  },
  data() {
    return {
        showtime: false,
        text:'111',
        fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        lng: '',
        lat: '',
        showlabel:false,
        name: "",
        enname: "",
        city: [],
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
   }
  },
  methods: {
    handleChange (v) {
      console.log(v)
    },
    handleshowlabel () {
      this.showlabel = !this.showlabel
    },
    handleclose () {
      this.$emit('closelable')
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    handlePreview(file) {
        console.log(file);
    },
    showopentime () {
      this.showtime = !this.showtime
    }
  }
};
</script>

<style lang='stylus' scoped>
.opentime
  position fixed
  top 0
  left 0
  bottom 0
  right 0
  background rgba(0,0,0,.4)
  z-index 21
.addscenice 
  position: fixed
  left: 0
  top: 0
  bottom: 0
  right: 0
  background: rgba(0, 0, 0, 0.6)
  z-index: 6

  .content 
    position: absolute
    width: 1014px
    height: 80%
    background: #fff
    left: calc(50% - 500px)
    top: calc(50% - 40%)
    overflow-y scroll
    .title 
      height: 78px
      background: #fff
      line-height: 78px
      margin-bottom: 50px
      color #666
      border-bottom solid 1px #f2f2f2
      .iconfont
        position absolute
        right 20px
    .name
      width: 500px
      margin: 0 auto
      height: 50px
      line-height: 50px
      color: rgb(153, 153, 153)
      overflow: hidden
      .position
        float left
      .name-title 
        float: left
        margin-right: 30px
      .name-input 
        float: left
        .edit
          color #3095fa
          cursor pointer
    .upload
      width 500px
      margin 0 auto
      margin-left 350px
      
    .textarea
      resize none
      display block
      width 500px
      height 120px
      margin-left 350px
      border-radius 5px
      padding 5px
      color #606266
      font-size 14px
      text-indent 28px
    .center
      margin 50px 
</style>
