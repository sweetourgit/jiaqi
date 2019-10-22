<style lang="scss" scoped>
.activity-bar{
  padding: 20px 0;
  border-top: 1px dashed #aeaeae;
}
</style>

<template>
  <div class="activity-bar">
    <main>
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
      >
        <el-form-item>
          <el-radio-group v-model="submitForm.activityType"
            @change="changeActivityType"
          >
            <el-radio :label="0">景点</el-radio>
            <el-radio :label="1">购物</el-radio>
            <el-radio :label="2">自费项目</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-row>
          <el-col style="width: 420px;">
            <el-form-item :label="text.name+ '：'" prop="name">
              <el-input v-model="submitForm.name" :placeholder="text.name" style="width: 300px;" size="small"></el-input>
            </el-form-item>
          </el-col>

          <el-col style="width: 200px;">
            <el-form-item label="活动时间：" prop="time">
              <el-input v-model="submitForm.time" placeholder="时间" size="small"></el-input>       
            </el-form-item>
          </el-col>

          <el-col style="width: 50px;">
            <el-form-item label-width="0">
              <span style="padding-left: 12px;">分钟</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col style="width: 420px;">
            <el-form-item :label="text.typeExt+ '：'" prop="typeExt">
              <el-input v-model="submitForm.typeExt" :placeholder="text.typeExt" size="small"></el-input>       
            </el-form-item>
          </el-col>
          <el-col style="width: 100px;">
            <el-form-item label-width="0">
              <span style="padding-left: 12px;">{{ text.suffix }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="详细说明：" prop="details" style="width: 670px;">
          <el-input type="textarea" placeholder="详细说明" size="small" :rows="5"
            v-model="submitForm.details" 
          ></el-input>       
        </el-form-item>

        <el-form-item label="图片：" prop="day" style="width: 670px;">
          <el-input type="textarea" placeholder="详细说明" size="small" :disabled="true"
            v-model="submitForm.subject" 
          ></el-input>       
        </el-form-item>

        <el-form-item label="详情：" prop="memo" style="width: 670px;">
          <div style="width: 100%; padding-top: 10px;">
            <vue-editor v-model="submitForm.memo"></vue-editor>
          </div>
        </el-form-item>

      </el-form>
    </main>
    <footer>
      <div>
        <slot></slot>
      </div>
    </footer>
  </div>
</template>

<script>
// 第三方组件
import { VueEditor } from 'vue2-editor'
import { getActivityDTO } from '../../../../dictionary'

export default {
  components: { VueEditor },

  props: {
    proto: Object
  },

  mounted(){
    this.init();
  },

  data(){
    return {
      submitForm: {},
    }
  },

  methods: {
    init(){
      this.submitForm= this.$deepCopy(this.proto);
    },

    checkHasChange(){
      return !this.$checkLooseEqual(this.submitForm, this.proto);
    },

    getData(){
      return this.submitForm;
    },

    changeActivityType(nval){
      let { activityType }= this.proto;
      if(nval=== activityType){
        Object.keys(this.proto).forEach(attr => {
          this.submitForm[attr]= this.proto[attr]
        })
      } else {
        let newActivity= getActivityDTO();
        newActivity.activityType= nval;
        Object.assign(this.submitForm, newActivity);
      }
    }
  },

  computed: {
    text(){
      switch(this.submitForm.activityType){
        case 0: 
          return {
            name: '城市',
            typeExt: '景点名称'
          };
          break;
        case 1: 
          return {
            name: '名称',
            typeExt: '营业产品'
          };
          break;
        case 2: 
          return {
            name: '名称',
            typeExt: '参考价格',
            suffix: '元/人'
          };
          break;
        default:
          return {
            name: '城市',
            typeExt: '景点名称'
          };
          break;
      }
    }
  }

}
</script>