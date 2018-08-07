<template>
  <div style="padding-left:80px">
   <el-form ref="form" :model="form" label-width="80px">
    <el-form-item class="form-item" label-width='80px'  label="中文名称">
      <el-input class="form-input" v-model="form.chineseName"></el-input>
    </el-form-item>
     <el-form-item class="form-item" label-width='80px'  label="英文名称">
      <el-input class="form-input" v-model="form.englishName"></el-input>
    </el-form-item>
     <el-form-item class="form-item" label-width='80px'  label="英文名称">
      <el-cascader
        class="form-input"
        expand-trigger="hover"
        :options="options"
        v-model="form.selectedOptions"
        @change="handleChange">
      </el-cascader>
    </el-form-item>
    <el-form-item class="form-item" label-width='80px'  label="景点标签">
      <el-button @click="showEdit = true" class="form-btn" type="primary" size="mini">编辑</el-button>
    </el-form-item>
    <el-form-item class="form-item" label-width='80px'  label="地理位置">
      <div style="float:left">
        <div>
          lat(纬度)：<el-input v-model="form.lat" style="width:200px"/>
        </div>
        <div style="margin-top:5px">
          Int(经度)：<el-input v-model="form.int" style="width:200px"/>
        </div>
      </div>
    </el-form-item>
    <el-form-item class="form-item" label-width='80px'  label="参考用时">
      <el-checkbox-group style="float:left" v-model="form.timer">
        <el-checkbox label="<1小时"></el-checkbox>
        <el-checkbox label="1~3小时"></el-checkbox>
        <el-checkbox label="3~5小时"></el-checkbox>
        <el-checkbox label=">5小时" ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="form-item" label-width='80px'  label="开放时间">
      <el-button @click="showtime=true" style='float:left' type="primary">添加开放时间</el-button>
    </el-form-item>
    <el-form-item class="form-item" label-width='80px'  label="适宜季节">
      <el-checkbox-group style="float:left" v-model="form.season">
        <el-checkbox label="春"></el-checkbox>
        <el-checkbox label="夏"></el-checkbox>
        <el-checkbox label="秋"></el-checkbox>
        <el-checkbox label="冬" ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
     <el-form-item class="form-item" label-width='80px'  label="适宜人群">
      <el-checkbox-group style="float:left" v-model="form.person">
        <el-checkbox label="老人"></el-checkbox>
        <el-checkbox label="儿童"></el-checkbox>
        <el-checkbox label="成人"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="form-item" label-width='80px'  label="景点图片">
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList2"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>
     <el-form-item class="form-item" label-width='80px'  label="景点简介">
      <el-input class="text-area" resize="none" type="textarea" v-model="form.desc"></el-input>
    </el-form-item>
    <div style="margin-left:-80px">
        <el-button
          @click="handleclose"
          style="padding:12px 30px" 
          >取消
        </el-button>
        <el-button 
          @click="handleclose"
          style="padding:12px 30px" 
          type="primary">
          确认
        </el-button>
      </div>
   </el-form>

  <!-- 编辑 -->

<el-dialog width='30%' top='20vh' append-to-body title="标签选择" :visible.sync="showEdit" custom-class="city_list">
  <LabelSelection></LabelSelection>
</el-dialog>
<!-- 开放时间 -->
<el-dialog width='40%' top='20vh' append-to-body title="添加开放时间" :visible.sync="showtime" custom-class="city_list">
  <OpenTime></OpenTime>
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
    return{
      showtime: false,
      showEdit: false,
      fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      form: {
        chineseName: '',
        englishName:'',
        selectedOptions:[],
        lat:'',
        int:'',
        timer:[],
        season:[],
        person:[],
        desc:''
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
        }]
    }
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
      }
    
  }
}
</script>

<style lang='stylus' scoped>
.form-item
  overflow hidden
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
</style>
