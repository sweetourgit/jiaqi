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
      label-width="120px" 
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

      <el-form-item label="出发地：" prop="destinations">
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
        <el-col style="width:220px;">
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

      <el-form-item label="订单确认：" prop="confirmType">
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
          :tag-label-attr="'labelName'"
          :tag-value-attr="'labelName'"
          :fetch-suggestions="getGlabelfuzzyAction"
        ></label-input>
      </el-form-item>

      <el-form-item label="头图：" prop="pictureID">
        <image-input></image-input>
      </el-form-item>         

    </el-form>
  </div>
</template>

<script>
import labelInput from '../label-input/index'
import imageInput from '../image-input'
import { getFuzzyAction, getGlabelfuzzyAction } from '../../api'

export default {
  components: { labelInput, imageInput },
  
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
        strengthsInputProps:{ 
          showWordLimit: true, 
          maxlength: 8,
          factory: this.strengthsFactory 
        }
      },
      submitForm: {

      },
      rules: {

      },
      attr: { maxlength: "10", 'show-word-limit': true }
    }
  },

  methods: {
    init(){
      this.submitForm= this.$deepCopy(this.proto);
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
        return { 
          teamID: parseInt(this.PROVIDE_TEAM_ID),
          [tagValueAttr]: el.id,
          [tagLabelAttr]: el.areaName  
        }
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
      let factory= (el) => {
        return { 
          teamID: parseInt(this.PROVIDE_TEAM_ID),
          [tagValueAttr]: el.id,
          [tagLabelAttr]: el.labelName,
          code: null,  
          createTime: Date.now(),
          isDeleted: 0,
          tagType: 0
        }
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
      return {
        teamID: parseInt(this.PROVIDE_TEAM_ID),
        strength
      }
    }
  }
}
</script>