<style lang="scss" scoped>
.plane-form{
  margin-bottom: 10px;
  main{
    padding: 10px;
    padding-top: 25px;
    background-color: #eee;
  }
  footer{
    padding: 0 0 25px 35px;
    background-color: #eee;
  }
}
</style>

<template>
  <div class="plane-form">
    <slot></slot>
    <main>
      <el-form
        label-width="120px" 
        ref="submitForm"
        :model="submitForm"
        :rules="rules"
      >
        <el-row>
          <el-col style="width: 150px; padding-left: 30px;">
            <el-form-item label-width="0" prop="trafficMode">
              <el-select v-model="submitForm.trafficMode" placeholder="出行方式" style="width: 100%;" size="small">
                <el-option
                  v-for="item in TRAFFIC_MODE_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col style="width: 150px;">
            <el-form-item label="第" label-width="50px" prop="day">
              <el-select v-model="submitForm.day" placeholder="第几天" size="small" :disabled="!!goOrBackSign">
                <el-option
                  v-for="item in PROVIDE_DAY"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>         
            </el-form-item>
          </el-col>

          <el-col style="width: 50px;">
            <el-form-item label-width="0">
              <span style="padding-left: 12px;">天</span>
            </el-form-item>
          </el-col>

          <el-col style="width: 310px;">
            <el-form-item label="自动填充：">
              <el-autocomplete
                class="inline-input"
                size="small"
                v-model="vm.flightNo"
                :fetch-suggestions="getFlightAction"
                placeholder="输入航班ID"
                :trigger-on-focus="false"
                @select="selectFilght"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
                      
        </el-row>

        <el-row>
          <el-col style="width: 330px;">
            <el-form-item label="航空公司：" label-width="120px" prop="company">
              <el-input v-model="submitForm.company" placeholder="航空公司" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 330px;">
            <el-form-item label="航班号：" label-width="140px" prop="theNumber">
              <el-input v-model="submitForm.theNumber" placeholder="航班号" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col style="width: 330px;">
            <el-form-item label="出发城市：" label-width="120px" prop="podCity">
              <el-input v-model="submitForm.podCity" placeholder="出发城市" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 330px;">
            <el-form-item label="出发机场：" label-width="140px" prop="podPlace">
              <el-input v-model="submitForm.podPlace" placeholder="出发机场" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 310px;">
            <el-form-item label="出发时间：" label-width="120px" prop="podTime">
              <el-input v-model="submitForm.podTime" placeholder="出发时间" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col style="width: 330px;">
            <el-form-item label="到达城市：" label-width="120px" prop="arriveCity">
              <el-input v-model="submitForm.arriveCity" placeholder="到达城市" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 330px;">
            <el-form-item label="到达机场：" label-width="140px" prop="arrivePlace">
              <el-input v-model="submitForm.arrivePlace" placeholder="到达机场" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 310px;">
            <el-form-item label="到达时间：" label-width="120px" prop="arriveTime">
              <el-input v-model="submitForm.arriveTime" placeholder="到达时间" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 150px;">
            <el-form-item label-width="50px" prop="trafficMode">
              <el-input v-model="submitForm.trafficMode" placeholder="最大" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <ext-stopover
        ref="extStopoverRef"
        :proto="submitForm.ext_Stopover"
      ></ext-stopover>
    </main>

    <footer>
      <el-button type="primary" size="small" @click="addExtStopover">添加经停</el-button>
      <el-button v-if="!goOrBackSign" type="info" size="small">删除中转</el-button>
    </footer>  
  </div>  
</template>

<script>
import ErrorHandlerMixin from './ErrorHandlerMixin'
import { TRAFFIC_MODE_OPTIONS, GO_OR_BACK_SIGN } from '../../../dictionary'
import extStopover from './ext-stopover.vue'

export default {
  name: 'plane-form',

  mixins:[ErrorHandlerMixin],

  props: {
    proto: {
      type: Object
    },

    rank: [Number]
  },

  components: {
    extStopover,
  },
  
  inject: ['PROVIDE_DAY'],

  mounted(){
    this.init();
  },

  computed:{
    goOrBackSign(){
      if(this.rank=== 0) return GO_OR_BACK_SIGN.GO;
      if(this.submitForm.goOrBack=== 2) return GO_OR_BACK_SIGN.BACK;
      return GO_OR_BACK_SIGN.CENTER;
    }
  },

  data(){
    return Object.assign({
      vm: {
        flightNo: '',
        
      },
      submitForm: {},
      rules: {
        trafficMode: [{ required: true, trigger: 'blur' }],
        company: [{ validator: this.simpleValidator, message: '航空公司不能为空', trigger: 'blur' }],
        theNumber: [{ validator: this.simpleValidator, message: '航班号不能为空', trigger: 'blur' }],
        podCity:[{ validator: this.simpleValidator, message: '出发城市不能为空', trigger: 'blur' }],
        podPlace: [{ validator: this.simpleValidator, message: '出发机场不能为空', trigger: 'blur' }],
        podTime: [{ validator: this.simpleValidator, message: '出发时间不能为空', trigger: 'blur' }],
        arriveCity: [{ validator: this.simpleValidator, message: '到达城市不能为空', trigger: 'blur' }],
        arrivePlace: [{ validator: this.simpleValidator, message: '到达机场不能为空', trigger: 'blur' }],
        arriveTime: [{ validator: this.simpleValidator, message: '到达时间不能为空', trigger: 'blur' }],
        planeDay: [{ validator: this.simpleValidator, message: '不能为空', trigger: 'blur' }],
        trafficMode: [{ validator: this.simpleValidator, message: '不能为空', trigger: 'blur' }],
        day: [{ validator: this.simpleValidator, message: '请选择天数', trigger: 'blur'}],
      }
    }, { TRAFFIC_MODE_OPTIONS })
  },

  methods: {

    init(){
      this.submitForm= this.$deepCopy(this.proto);
      this.checkProto= this.$deepCopy(this.proto);
      if(this.goOrBackSign=== GO_OR_BACK_SIGN.BACK){
        this.submitForm.day= this.PROVIDE_DAY;
        this.checkProto.day= this.PROVIDE_DAY;
      }
    },


    checkHasChange(){
      let bol= false;
      bol= !this.$checkLooseEqual(this.submitForm, this.checkProto);
      !bol && (bol= this.$refs.extStopoverRef.checkHasChange());
      console.log(`plane-form checkHasChange: ${bol}`)
      return bol;
    },
    
 
    addExtStopover(){
      this.$refs.extStopoverRef.addExtStopover()
    },
    
  
    getFlightAction(queryString, cb){
      this.$http.post(
        this.GLOBAL.serverSrc + "/flight/api/get",
        {
          id: queryString,
        }
      ).then(res => {
        let { isSuccess, object }= res.data;
        if(!object) throw '未找到对应航班';
        this.flightOptions= [object];
        cb([{ value: object.id+ '' }]);
      }).catch(err => {
        let errMsg;
        if(err && err.status=== 400) errMsg= '自动填充请输入数字id，不得包含其他类型字符';
        if(err && err.status=== 500) errMsg= '500';
        cb();
        return errMsg? 
          this.$message.error(errMsg): this.$message.info(err);
      })
    },

  
    flightAdapter(flight){
      let { 
        number, departureTime, departureAirport, 
        departureCity, company, arrivalTime, arrivalAirport,
        reachingCity
      }= flight;
      return {
        arriveCity: reachingCity,
        arrivePlace: arrivalAirport,
        arriveTime: arrivalTime,
        company: company,
        ext_Stopover: "[]",
        podCity: departureCity,
        podPlace: departureAirport,
        podTime: departureTime,
        theNumber: number
      }
    },
    
    /**
     * @description: 
     */
    selectFilght(flight){
      let hit= this.flightOptions.find(el => el.id== flight.value);
      Object.assign(this.submitForm, this.flightAdapter(hit));
    },
  }
}
</script>