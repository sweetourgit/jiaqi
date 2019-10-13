<style lang="scss" scoped>
.train-form{
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
  <div class="train-form">
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
              <el-select v-model="submitForm.trafficMode" placeholder="出行方式" style="width: 100%;" size="small"
               @change="changeTrafficMode"  
              >
                <el-option
                  v-for="item in TRAFFIC_MODE_OPTIONS"
                  :key="item.value"
                  :label="(goOrBackSign?'':'中转')+ item.label"
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
            <el-form-item label-width="50px" prop="arriveDay">
              <el-select v-model="submitForm.arriveDay" placeholder="到达时间" size="small">
                <el-option
                  v-for="item in ARRIVE_DAY_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>   
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
      <el-button type="primary" size="small" 
        @click="addExtStopover"
      >添加经停</el-button>
      <el-button v-if="!goOrBackSign" type="info" size="small"
        @click="$emit('remove-traffic')"
      >删除中转</el-button>
    </footer>  
  </div>  
</template>

<script>
// 混入
import TrafficFormMixin from './TrafficFormMixin'
import ErrorHandlerMixin from './ErrorHandlerMixin'
// 字典
import { TRAFFIC_MODE_OPTIONS, ARRIVE_DAY_OPTIONS, GO_OR_BACK_SIGN } from '../../../dictionary'

export default {
  name: 'train-form',

  mixins:[TrafficFormMixin, ErrorHandlerMixin],

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
    }, { TRAFFIC_MODE_OPTIONS, ARRIVE_DAY_OPTIONS })
  },

  methods: {}
}
</script>