<style lang="scss" scoped>
@import '../../index.scss';  
.basic-pane{
  width: $width;
}
</style>

<template>
  <div class="basic-pane">
    <!-- <div v-html="submitForm" style="white-space: pre-wrap;"></div> -->
    <el-form
      label-width="140px" 
      ref="submitForm"
      :model="submitForm"
      :rules="rules"
    >
      <el-form-item label="产品名称：" prop="title">
        <el-input v-model="submitForm.title" placeholder="产品名称" style="width: 300px;" size="small" maxlength="20" show-word-limit></el-input>
      </el-form-item>

      <el-form-item label="出游类型：" prop="isForeign">
        <el-radio-group v-model="submitForm.isForeign">
          <el-radio :label="1">境外</el-radio>
          <el-radio :label="2">国内</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="出发地：" prop="pods">
        <label-input
          v-model="submitForm.pods"
          placeholder="添加出发地"
          :cb-label="'areaName'"
          :tag-label-attr="'pod'"
          :tag-value-attr="'podID'"
          :fetch-suggestions="getAreaSuggestions"
        ></label-input>
      </el-form-item>

      <el-form-item label="目的地：" prop="destinations">
        <label-input
          v-model="submitForm.destinations"
          placeholder="添加目的地"
          :cb-label="'areaName'"
          :tag-label-attr="'destination'"
          :tag-value-attr="'destinationID'"
          :fetch-suggestions="getAreaSuggestions"
        ></label-input>
      </el-form-item>
      
      <el-row>
        <el-col style="width:240px;">
          <el-form-item label="行程天数：" prop="day">
            <el-input size="small" style="width: 100px;" placeholder="请输入天数"
              v-model="submitForm.day"
            ></el-input>        
          </el-form-item>
        </el-col>

        <el-col style="width: 50px;">
          <el-form-item label-width="0">
            <span style="padding-left: 12px;">天</span>
          </el-form-item>
        </el-col>

        <el-col style="width:100px;">
          <el-form-item label-width="0" prop="night">
            <el-input size="small" style="width: 100px;" placeholder="请输入晚数"
              v-model="submitForm.night"
            ></el-input>        
          </el-form-item>
        </el-col>

        <el-col style="width: 50px;">
          <el-form-item label-width="0">
            <span style="padding-left: 12px;">晚</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="订单确认类型：" prop="confirmType">
        <el-radio-group v-model="submitForm.confirmType">
          <el-radio :label="1">及时确认</el-radio>
          <el-radio :label="2">二次确认</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="亮点词：" prop="strengths">
        <label-input
          v-model="submitForm.strengths"
          placeholder="添加亮点词"
          :tag-label-attr="'strength'"
          :tag-value-attr="'id'"
          :input-props="vm.strengthsInputProps"
        >
        </label-input>
      </el-form-item>

      <el-form-item label="运营标签：" prop="label">
        <label-input
          v-model="submitForm.label"
          placeholder="添加运营标签"
          :cb-label="'labelName'"
          :tag-label-attr="'label'"
          :tag-value-attr="'labelID'"
          :fetch-suggestions="getGlabelfuzzyAction"
        ></label-input>
      </el-form-item>

      <el-form-item label="头图：" prop="pictureID">
        <image-input
          :proto="submitForm.pictureID"
          :numLimit="1"
          @wakeup-material="pictureSelectHandler"
          @wakeup-preview="wakeupPreviewHandler"
          @remove-handler="removePictureHandler"
        ></image-input>
      </el-form-item>

      <!--
      <el-form-item label="视频：" prop="pictureID">
        <image-input></image-input> 
        <el-button type="primary" size="small" icon="el-icon-plus" circle></el-button>
      </el-form-item>
      -->

      <el-form-item label="轮播图：" prop="pepeatpic">
        <image-input
          :proto="submitForm.pepeatpic"
          :numLimit="PEPEAT_PIC_MAX"
          @wakeup-material="pepeatpicSelectHandler"
          @wakeup-preview="wakeupPreviewHandler"
          @remove-handler="removePepeatpicHandler"
        ></image-input>
      </el-form-item>

      <el-form-item label="出游人群：" prop="crowdID">
        <el-select v-model="submitForm.crowdID" type="date" placeholder="最高" style="width: 300px;" size="small">
          <el-option
            v-for="item in vm.crowdlistOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> 

      <el-form-item label="主题：" prop="themeID">
        <el-select v-model="submitForm.themeID" type="date" placeholder="最高" style="width: 300px;" size="small">
          <el-option
            v-for="item in vm.themelistOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="提前报名天数：" prop="advanceDay">
        <el-input v-model="submitForm.advanceDay" placeholder="提前报名天数" style="width: 300px;" size="small"></el-input>
      </el-form-item>

      <el-form-item label="产品概况：" prop="mark">
        <div style="width: 850px; padding-top: 10px;">
          <vue-editor v-model="submitForm.mark"></vue-editor>
        </div>
      </el-form-item>         

    </el-form>
    <footer>
      <material-list
        ref="materialListRef"
        :proto="list"
        @submit-list="emitSubmitList"
      ></material-list>
      <preview-dialog
        ref="previewDialogRef"
      ></preview-dialog>
    </footer>
  </div>
</template>

<script>
/**
 * @description: 基本信息表单
 */
import ValidateMsgMixin from '@/mixin/ValidateMsgMixin'

// 第三方组件
import { VueEditor } from 'vue2-editor'

import labelInput from './comps/label-input/index'
import imageInput from './comps/image-input'
import materialList from './comps/material-list'
import previewDialog from './comps/preview-dialog'

import { 
  getFuzzyAction, 
  getGlabelfuzzyAction, 
  getCrowdlistAction, 
  getThemelistAction } from '../../api'

export default {
  mixins: [ValidateMsgMixin],

  components: { VueEditor, labelInput, imageInput, materialList, previewDialog },
  
  inject: ['PROVIDE_TEAM_ID'],

  props: {
    proto: Object,
  },

  created(){
    this.init();
  },

  watch: {
    proto:{
      handler(){
        this.refresh();
      },
      deep: true
    }
  },

  data(){
    return Object.assign({
      vm: {
        // label-input中给普通输入框传入的props，和elementUI文档中的一样
        strengthsInputProps:{ 
          showWordLimit: true, 
          maxlength: 8,
          factory: this.strengthsFactory 
        },
        crowdlistOptions: [],
        themelistOptions: []
      },
      submitForm: {},
      rules: {
        title: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '产品名称不能为空', 
          trigger: 'blur'
        },
        isForeign: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '出游类型不能为空', 
          trigger: 'blur' 
        },
        day: [
          { 
            required: true, 
            validator: this.simpleValidator, 
            message: '行程天数不能为空', 
            trigger: 'blur' 
          },{
            validator: this.numberValidator, 
            message: '行程天数必须为正整数', 
            trigger: 'blur'
          }
        ],
        night: [
          { 
            required: true, 
            validator: this.simpleValidator, 
            message: '行程晚数不能为空', 
            trigger: 'blur' 
          },{
            validator: this.numberValidator, 
            message: '行程晚数必须为正整数', 
            trigger: 'blur'
          }
        ],
        pods: {
          required: true,
          validator: this.notNullArrayValidator, 
          message: '出发地不能为空', 
          trigger: ['blur', 'change']
        },
        destinations: {
          required: true,
          validator: this.notNullArrayValidator, 
          message: '目的地不能为空', 
          trigger: ['blur', 'change']
        },
        confirmType: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '订单确认类型不能为空', 
          trigger: ['blur', 'change']
        },
        // 亮点词
        strengths: {
          required: true,
          validator: this.notNullArrayValidator, 
          message: '亮点词不能为空，且不能多于四个', 
          numLimit: 4,
          trigger: ['blur', 'change']
        },
        crowdID: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '出游人群不能为空', 
          trigger: ['blur', 'change']
        },
        themeID: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '主题不能为空', 
          trigger: ['blur', 'change']
        },
        advanceDay: [
          { 
            required: true, 
            validator: this.simpleValidator, 
            message: '提前天数不能为空', 
            trigger: 'blur' 
          },{
            validator: this.numberValidator, 
            message: '提前天数须为正整数', 
            trigger: 'blur'
          }
        ],
        pictureID: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '头图不能为空', 
          trigger: 'change' 
        },
        pepeatpic: {
          required: true,
          validator: this.pepeatpicValidator,
          trigger: 'blur'
        }
        // 选填
        // label:{}
        // vedioID: null,
        // pepeatpic: [],
        // mark: ''
      }
    },
      // config
      {
        PEPEAT_PIC_MAX: 6, // 轮播图最大数
        PEPEAT_PIC_MIN: 3
      }
    )
  },

  methods: {
    init(){
      this.submitForm= this.$deepCopy(this.proto);
      // 人群
      this.initCrowdlist();
      // 主题
      this.initThemelist();
    },
    isArray(obj){
      return Object.prototype.toString.call(obj)=== '[object Array]';
    },
    refresh(){
      Object.keys(this.proto).forEach(attr => {
        if(this.isArray(this.proto[attr])){
          this.submitForm[attr].splice(0);
          this.submitForm[attr].push(...this.$deepCopy(this.proto[attr]));
        }
      })
    },
    initCrowdlist(){
      getCrowdlistAction.bind(this)().then(res => {
        this.vm.crowdlistOptions.splice(0);
        this.vm.crowdlistOptions.push(...res);
      }).catch(err => {
        console.error(err);
        this.$message.error(err);
      })
    },
    initThemelist(){
      getThemelistAction.bind(this)().then(res => {
        this.vm.themelistOptions.splice(0);
        this.vm.themelistOptions.push(...res);
      }).catch(err => {
        console.error(err);
        this.$message.error(err);
      })
    },

    /**
     * @description: 获取地点后加工成aotucomplte可用的形式
     * @param {type} val 搜索框的值
     * @param {type} cb autocomplete的回调
     * @param {type} cbLabel 以下都是数据转接用的
     * @param {type} tagValueAttr
     * @param {type} tagLabelAttr 
     */
    getAreaSuggestions(val, cb, cbLabel, tagValueAttr, tagLabelAttr){
      let factory= (el) => {
        let teamID= parseInt(this.PROVIDE_TEAM_ID);
        let object= teamID? { teamID }: {};
        return Object.assign({ 
          [tagValueAttr]: el.id,
          [tagLabelAttr]: el.areaName  
        }, object);
      }
      getFuzzyAction.call(this, val).then(res => {
        cb(
          res.map(el => {
            return { 
              value: el[cbLabel], 
              data: factory(el)
            }
          })
        );
      }).catch(() => {
        cb()
      })
    },

    // 获取运营标签
    getGlabelfuzzyAction(val, cb, cbLabel, tagValueAttr, tagLabelAttr){
      console.log(tagValueAttr, tagLabelAttr)
      let factory= (el) => {
        let teamID= parseInt(this.PROVIDE_TEAM_ID);
        let object= teamID? { teamID }: {};
        return Object.assign({
          [tagValueAttr]: el.id,
          [tagLabelAttr]: el.labelName
        }, object);
      }
      getGlabelfuzzyAction.call(this, val).then(res => {
        cb(
          res.map(el => {
            return { 
              value: el[cbLabel], 
              data: factory(el)
            }
          })
        );
      }).catch(() => {
        cb()
      })
    },
    
    // 将字符串加工成strengths对象
    strengthsFactory(strength){
      if(!strength) return null;
      let teamID= parseInt(this.PROVIDE_TEAM_ID);
      let object= teamID? { teamID }: {};
      return Object.assign({ strength }, object)
    },

    numberValidator(rule, val, cb){
      let { message }= rule; 
      let reg= /^([1-9][0-9]*)$/;
      if(reg.test(val)) return cb();
      return cb(this.makeErrorQueueMsg(message));
    },

    notNullArrayValidator(rule, val, cb){
      let { message, numLimit }= rule;
      if(!val || val.length=== 0) return cb(this.makeErrorQueueMsg(message));
      if(numLimit && val.length> numLimit) return cb(this.makeErrorQueueMsg(message)); 
      return cb();
    },

    pepeatpicValidator(rule, val, cb){
      if(!val || (val.length> this.PEPEAT_PIC_MAX || val.length< this.PEPEAT_PIC_MIN)) 
        return cb(this.makeErrorQueueMsg(`请选择${this.PEPEAT_PIC_MIN}到${this.PEPEAT_PIC_MAX}张轮播图`));
      return cb();
    },

    validate(){
      let bol= true;
      this.$refs.submitForm.validate(validate => {
        bol= validate;
      })
      return bol;
    },

    checkHasChange(){
      let bol= false;
      bol= !this.$checkLooseEqual(this.submitForm, this.proto);      
      bol && console.log('basic-pane has changed');
      return bol;
    },

    getData(){
      let copy= this.$deepCopy(this.submitForm);
      copy.advanceDay= parseInt(copy.advanceDay);
      copy.day= parseInt(copy.day);
      copy.night= parseInt(copy.night);
      return copy
    },

    // 头图选择
    pictureSelectHandler(idList){
      let cb= (list) => {
        if(list.length> 1){
          this.$message.error(`头图数量限制为1张，当前选择${list.length}张，将截取第一张`);
          list= list.splice(0, 1);
        }
        this.submitForm.pictureID= list[0];
        this.validate();
      }
      this.$refs.materialListRef.wakeup(idList, cb);
    },
    
    // 头图删除
    removePictureHandler(){
      this.submitForm.pictureID= null;
    },

    // 轮播图选择
    pepeatpicSelectHandler(idList){
      let cb= (list) => {
        if(list.length> this.PEPEAT_PIC_MAX){
          this.$message.error(`轮播图数量限制为${this.PEPEAT_PIC_MIN}到${this.PEPEAT_PIC_MAX}张，当前选择${list.length}张，将截取前${this.PEPEAT_PIC_MAX}张`);
          list= list.splice(0, this.PEPEAT_PIC_MAX);
        }
        this.submitForm.pepeatpic.splice(0)
        this.submitForm.pepeatpic.push(...this.$deepCopy(list.map(el => {
          return {
            pictureID: el,
            picturePath: ''
          }
        })));
        this.validate();
      }
      this.$refs.materialListRef.wakeup(idList, cb);
    },

    // 轮播图删除
    removePepeatpicHandler(i){
      console.log(i)
      this.submitForm.pepeatpic.splice(i, 1);
    },

    // 预览
    wakeupPreviewHandler(item){
      this.$refs.previewDialogRef.wakeup(item);
    }
  }
}
</script>