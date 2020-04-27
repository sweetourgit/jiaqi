<style lang="scss" scoped>
.schedule-form{
  main{
    padding-bottom: 20px;
  }
}
</style>

<template>
  <div class="schedule-form">
    <main>
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-form-item label="主题：" label-width="80px" prop="subject">
          <el-input v-model="submitForm.subject" placeholder="日程主题" style="width: 300px;" size="small" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="住宿：" label-width="80px" prop="ext_Hotel">
          <ext-hotel 
            ref="extHotelRef"
            v-model="submitForm.ext_Hotel"
            @input="emitInputExtHotel"
            @change-validate="validate"
          ></ext-hotel>
        </el-form-item>
        <el-form-item label="餐饮：" label-width="80px" prop="ext_Meals">
          <ext-meals-ground
            ref="extMealsGround"
            v-model="submitForm.ext_Meals"
            @input="emitInputExtMealsGround"
            @change-validate="validate"
          ></ext-meals-ground>
        </el-form-item>
        <el-form-item label="详情：" label-width="80px" prop="info">
          <div style="width: 600px; padding-top: 10px;">
            <vue-editor 
              v-model="submitForm.info">
            </vue-editor>
          </div>
        </el-form-item>
      </el-form>
    </main>
    <footer>
      <!-- <div v-html="proto" style="white-space:pre-wrap" @click="validate"></div> -->
      <activitys-ground
        ref="activitysGround"
        :id="submitForm.id"
        :proto="proto.activitys"
      ></activitys-ground>
    </footer>
  </div>
</template>

<script>
import ErrorHandlerMixin from '../../traffic-tab-pane/comps/mixins/ErrorHandlerMixin'
import extHotel from './comps/ext-hotel'
import extMealsGround from './comps/ext-meals-ground'
import activitysGround from './comps/activitys-ground'
import VueEditor from '@/components/tinymce'

export default {
  mixins: [ErrorHandlerMixin],

  components: { VueEditor, extHotel, extMealsGround, activitysGround },

  props: {
    proto: [Object],
  },

  provide: {
    SCHEDULES_DAY: 0,
  },

  mounted(){
    this.init();
  },

  data(){
    return {
      submitForm: {},
      rules: {
        subject: [{ required: true, validator: this.simpleValidator, message: '日程主题不能为空', trigger: 'blur' }],
        ext_Hotel: [{ required: true, validator: this.specialValidator, trigger: 'blur' }],
        ext_Meals: [{ required: true, validator: this.specialValidator, trigger: 'blur' }],
      }
    }
  },

  methods: {
    init(){
      let copy= this.$deepCopy(this.proto);
      Object.keys(copy).forEach(attr => {
        if(attr!== 'activitys') this.$set(this.submitForm, attr, copy[attr]);
      })
      this.checkProto= this.$deepCopy(this.submitForm);
      this._provided.SCHEDULES_DAY= this.errorPrefix;
    },


    validate(){
      let result= true;
      let bol= true;
      bol= this.$refs.extHotelRef.validate();
      !bol && (result= false);
      bol= this.$refs.extMealsGround.validate();
      !bol && (result= false);
      this.$refs.submitForm.validate(validate => {
        !validate && (result= false);
      });
      return result;
    },

   
    specialValidator(rule, value, cb){
      if(Object.prototype.toString.call(value)=== "[object Error]"){
        return cb(this.makeErrorQueueMsg(value.message));
      }
      cb();
    },

   
    emitInputExtHotel(payload){
      this.submitForm.ext_Hotel= payload;
    },
    emitInputExtMealsGround(payload){
      this.submitForm.ext_Meals= payload;
    },

    checkHasChange(){
      let bol= false;
      bol= this.$refs.activitysGround.checkHasChange();
      !bol && (bol= !this.$checkLooseEqual(this.submitForm, this.checkProto));
      bol && console.warn(`schedule-form checkHasChange: ${bol}`)
      return bol;
    },

    getData(){
      let data= this.$deepCopy(this.submitForm);
      let activitys= this.$refs.activitysGround.getData();
      data.activitys= activitys;
      return data;
    },
  }
}
</script>