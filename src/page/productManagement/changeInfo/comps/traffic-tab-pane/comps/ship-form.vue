<style lang="scss" scoped>
.ship-form{
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
  <div class="ship-form">
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
            <el-form-item :label="text.theNumber+ '：'" label-width="120px" prop="theNumber">
              <el-input v-model="submitForm.theNumber" :placeholder="text.theNumber" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 330px;">
            <el-form-item :label="text.company+ '：'" label-width="140px" prop="company">
              <el-input v-model="submitForm.company" :placeholder="text.company" style="width: 100%;" size="small"></el-input>
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
            <el-form-item :label="text.podPlace+ '：'" label-width="140px" prop="podPlace">
              <el-input v-model="submitForm.podPlace" :placeholder="text.podPlace" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 310px;">
            <el-form-item label="出发时间：" label-width="120px" prop="podTime">
              <el-time-picker style="width: 100%;" size="small" placeholder="出发时间"
                v-model="submitForm.podTime"
                value-format="HH:mm:ss"
              >
              </el-time-picker>
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
            <el-form-item :label="text.arrivePlace+ '：'" label-width="140px" prop="arrivePlace">
              <el-input v-model="submitForm.arrivePlace" :placeholder="text.arrivePlace" style="width: 100%;" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="width: 310px;">
            <el-form-item label="到达时间：" label-width="120px" prop="arriveTime">
              <el-time-picker style="width: 100%;" size="small" placeholder="出发时间"
                v-model="submitForm.arriveTime"
                value-format="HH:mm:ss"
              >
              </el-time-picker>
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
      <el-button v-if="!goOrBackSign" type="info" size="small"
        @click="$emit('remove-traffic')"
      >删除中转</el-button>
    </footer>  
  </div>  
</template>

<script>
// 混入
import TrafficFormMixin from './mixins/TrafficFormMixin'
import ErrorHandlerMixin from './mixins/ErrorHandlerMixin'
// 字典

export default {
  name: 'ship-form',

  mixins:[TrafficFormMixin, ErrorHandlerMixin],

  data(){
    return {
      vm: {
        flightNo: '',
      },
      text: {
        company: '游轮公司', 
        theNumber: '游轮号', 
        podPlace: '出发码头', 
        arrivePlace: '到达码头'
      }
    }
  }
}
</script>