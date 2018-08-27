<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动区域">
        <el-select v-model="form.type" placeholder="请选择活动区域">
          <el-option label="时期选择" value="time"></el-option>
          <el-option label="文字描述" value="text"></el-option>
        </el-select>
      </el-form-item>
      
      <div class="dateselect" v-if="form.type=='time'">
      <el-form-item label="星期一">
        <div v-show="alltime=true">
           <div
          class="time"
          v-for="(item,index) of mondayList" :key="index">
          <el-time-select
            class="select"
            placeholder="起始时间"
            v-model="item.start"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="item.end"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: item.start
            }">
         </el-time-select>
          <span @click="closeMonday(index)" class="el-icon-circle-close"></span>
          
        </div>
       
        <el-button v-show="this.mondayList.length<2 && form.alltime==false" @click="addlist" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!mondayList.length" v-model="form.alltime">24小时营业</el-checkbox>

      </el-form-item>

      <!-- 星期二 -->
        <el-form-item label="星期一">
        <div v-show="alltime2=true">
           <div
          class="time"
          v-for="(item,index) of tue" :key="index">
          <el-time-select
            class="select"
            placeholder="起始时间"
            v-model="item.start"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="item.end"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: item.start
            }">
         </el-time-select>
          <span @click="closeMonday2(index)" class="el-icon-circle-close"></span>
          
        </div>
       
        <el-button v-show="this.tue.length<2 && form.alltime2==false" @click="addlist2" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!tue.length" v-model="form.alltime2">24小时营业</el-checkbox>

      </el-form-item>
      <!-- 星期三 -->
        <el-form-item label="星期三">
        <div v-show="alltime3=true">
           <div
          class="time"
          v-for="(item,index) of wed" :key="index">
          <el-time-select
            class="select"
            placeholder="起始时间"
            v-model="item.start"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="item.end"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: item.start
            }">
         </el-time-select>
          <span @click="closeMonday3(index)" class="el-icon-circle-close"></span>
          
        </div>
       
        <el-button v-show="this.wed.length<2 && form.alltime3==false" @click="addlist3" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!wed.length" v-model="form.alltime3">24小时营业</el-checkbox>

      </el-form-item>
      <!-- 星期四 -->
        <el-form-item label="星期四">
        <div v-show="alltime4=true">
           <div
          class="time"
          v-for="(item,index) of thur" :key="index">
          <el-time-select
            class="select"
            placeholder="起始时间"
            v-model="item.start"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="item.end"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: item.start
            }">
         </el-time-select>
          <span @click="closeMonday4(index)" class="el-icon-circle-close"></span>
          
        </div>
       
        <el-button v-show="this.thur.length<2 && form.alltime4==false" @click="addlist4" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!thur.length" v-model="form.alltime4">24小时营业</el-checkbox>

      </el-form-item>
      <!-- 星期五 -->
        <el-form-item label="星期五">
        <div v-show="alltime=true">
           <div
          class="time"
          v-for="(item,index) of fir" :key="index">
          <el-time-select
            class="select"
            placeholder="起始时间"
            v-model="item.start"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="item.end"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: item.start
            }">
         </el-time-select>
          <span @click="closeMonday5(index)" class="el-icon-circle-close"></span>
          
        </div>
       
        <el-button v-show="this.fir.length<2 && form.alltime5==false" @click="addlist5" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!fir.length" v-model="form.alltime5">24小时营业</el-checkbox>

      </el-form-item>
      <!-- 星期六 -->
        <el-form-item label="星期六">
        <div v-show="alltime6=true">
           <div
          class="time"
          v-for="(item,index) of sat" :key="index">
          <el-time-select
            class="select"
            placeholder="起始时间"
            v-model="item.start"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="item.end"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: item.start
            }">
         </el-time-select>
          <span @click="closeMonday6(index)" class="el-icon-circle-close"></span>
          
        </div>
       
        <el-button v-show="this.sat.length<2 && form.alltime6==false" @click="addlist6" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!sat.length" v-model="form.alltime6">24小时营业</el-checkbox>

      </el-form-item>
      <!-- 星期天 -->
        <el-form-item label="星期天">
        <div v-show="alltime=true">
           <div
          class="time"
          v-for="(item,index) of sun" :key="index">
          <el-time-select
            class="select"
            placeholder="起始时间"
            v-model="item.start"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="item.end"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: item.start
            }">
         </el-time-select>
          <span @click="closeMonday7(index)" class="el-icon-circle-close"></span>
          
        </div>
       
        <el-button v-show="this.sun.length<2 && form.alltime7==false" @click="addlist7" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!sun.length" v-model="form.alltime7">24小时营业</el-checkbox>

      </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="文字描述">
         <el-input style="width:80%" resize="none" type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="btn">
      <el-button>取消</el-button>
      <el-button @click="handleSaveClick" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name:'OpenTime',
  data() {
    return{
      mondayStartTime:new Date(),
      mondayEndTime:'',
      mondayList:[],
      tue:[],
      wed:[],
      thur:[],
      fir:[],
      sat:[],
      sun:[],
      form:{
        type:'time',
        alltime:false,
        alltime2:false,
        alltime3:false,
        alltime4:false,
        alltime5:false,
        alltime6:false,
        alltime7:false,
        desc:''
      }
    }
  },
  methods:{
    handleSaveClick() {
      //如果是时期选择 吧时期传过去，如果是文字放在else分支
      if(this.form.type=='time'){
        let data = {}
        let mon = []
        this.mondayList.forEach(item=>{
         
          Object.assign({},item)

          // console.log( [{...item}])
          // for(let i in item.values()){
          //   mon.push(i)
          // }
        })

      }else{
        alert('文字')
      }
    },
    addlist() {
      this.mondayList.push({
        start:'',
        end:'',
        alltime:false,
      })
    },
    closeMonday(index){
      console.log(index)
      this.mondayList.splice(index,1)
    },
      addlist2() {
      this.tue.push({
        start:'',
        end:'',
        alltime: false
      })
    },
    closeMonday2(index){
      console.log(index)
      this.tue.splice(index,1)
    },
      addlist3() {
      this.wed.push({
        start:'',
        end:'',
        alltime: false
      })
    },
    closeMonday3(index){
      console.log(index)
      this.wed.splice(index,1)
    },
      addlist4() {
      this.thur.push({
        start:'',
        end:'',
        alltime: false
      })
    },
    closeMonday4(index){
      console.log(index)
      this.thur.splice(index,1)
    },
      addlist5() {
      this.fir.push({
        start:'',
        end:'',
        alltime: false
      })
    },
    closeMonday5(index){
      console.log(index)
      this.fir.splice(index,1)
    },
      addlist6() {
      this.sat.push({
        start:'',
        end:'',
        alltime: false
      })
    },
    closeMonday6(index){
      console.log(index)
      this.sat.splice(index,1)
    },
      addlist7() {
      this.sun.push({
        start:'',
        end:'',
        alltime: false
      })
    },
    closeMonday7(index){
      console.log(index)
      this.sun.splice(index,1)
    }
  },
}
</script>

<style lang='stylus' scoped>
 .time
      overflow visible
      float left
      border 1px solid #c3cdc9
      padding 5px
      border-radius 5px
      position relative
      margin 10px 10px 10px 0
      
      .el-icon-circle-close
        position absolute
        right -8px
        top -8px
        cursor pointer
      .select
        width 120px
  .btn
    margin 0 auto
    width 30%
</style>
