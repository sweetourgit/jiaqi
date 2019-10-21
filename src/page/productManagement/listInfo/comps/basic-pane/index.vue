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
        <el-input v-model="submitForm.title" placeholder="产品名称" style="width: 300px;" size="small"></el-input>
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
        <!-- <image-input></image-input> -->
        <el-button type="primary" size="small" icon="el-icon-plus" circle></el-button>
      </el-form-item>
      <el-form-item label="视频：" prop="pictureID">
        <!-- <image-input></image-input> -->
        <el-button type="primary" size="small" icon="el-icon-plus" circle></el-button>
      </el-form-item>
      <el-form-item label="轮播图：" prop="pictureID">
        <!-- <image-input></image-input> -->
        <el-button type="primary" size="small" icon="el-icon-plus" circle></el-button>
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
import { 
  getFuzzyAction, 
  getGlabelfuzzyAction, 
  getCrowdlistAction, 
  getThemelistAction } from '../../api'

export default {
  mixins: [ValidateMsgMixin],

  components: { VueEditor, labelInput, imageInput },
  
  inject: ['PROVIDE_TEAM_ID'],

  props: {
    proto: Object,
  },

  created(){
    this.init();
  },

  data(){
    return {
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
          trigger: 'blur'
        },
        destinations: {
          required: true,
          validator: this.notNullArrayValidator, 
          message: '目的地不能为空', 
          trigger: 'blur'
        },
        confirmType: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '订单确认类型不能为空', 
          trigger: 'blur'
        },
        // 亮点词
        strengths: {
          required: true,
          validator: this.notNullArrayValidator, 
          message: '亮点词不能为空，且不能多于四个', 
          numLimit: 4,
          trigger: 'blur'
        },
        crowdID: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '出游人群不能为空', 
          trigger: 'blur'
        },
        themeID: { 
          required: true, 
          validator: this.simpleValidator, 
          message: '主题不能为空', 
          trigger: 'blur'
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
        // 选填
        // label:{}
        // pictureID: null,
        // vedioID: null,
        // pepeatpic: [],
        // mark: ''
      }
    }
  },

  methods: {
    init(){
      this.submitForm= this.$deepCopy(this.proto);
      // 人群
      this.initCrowdlist();
      // 主题
      this.initThemelist();
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
      let reg= /^\d+$|^\d+[.]?\d+$/;
      if(reg.test(val)) return cb();
      return cb(this.makeErrorQueueMsg(message));
    },
    notNullArrayValidator(rule, val, cb){
      let { message, numLimit }= rule;
      if(!val || val.length=== 0) return cb(this.makeErrorQueueMsg(message));
      if(numLimit && val.length> numLimit) return cb(this.makeErrorQueueMsg(message)); 
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
      let hasChange= false;
      hasChange= !this.$checkLooseEqual(this.submitForm, this.proto);
      hasChange && console.warn('basic-pane change');

      // bug 每次保存，destinations， pod，strengths 的id都会自增 
      // this.submitForm.destinations.forEach((el, i) => {
      //   Object.keys(this.submitForm.destinations[i]).forEach(attr => {
      //     console.log(attr, this.submitForm.destinations[i][attr], this.proto.destinations[i][attr]);
      //   })
      // })
      
      return hasChange;
    },

    getData(){
      let copy= this.$deepCopy(this.submitForm);
      copy.advanceDay= parseInt(copy.advanceDay);
      copy.day= parseInt(copy.day);
      copy.night= parseInt(copy.night);
      return copy
    },
  }
}
</script>