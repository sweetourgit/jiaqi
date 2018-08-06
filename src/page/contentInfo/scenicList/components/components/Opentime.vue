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
            v-model="mondayStartTime"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:00'
            }">
          </el-time-select>
          至
          <el-time-select
            class="select"
            placeholder="结束时间"
            v-model="mondayEndTime"
            :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '23:30',
              minTime: mondayStartTime
            }">
         </el-time-select>
          <span @click="closeMonday(index)" class="el-icon-circle-close"></span>
        </div>
        <el-button v-show="this.mondayList.length<2 && form.alltime==false" @click="addlist" type='primary' size="mini">+添加营业时间</el-button>
        </div>
        <el-checkbox v-show="!mondayList.length" v-model="form.alltime">24小时营业</el-checkbox>

      </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="文字描述">
         <el-input style="width:500px" resize="none" type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="btn">
      <el-button>取消</el-button>
      <el-button type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return{
      mondayStartTime:'',
      mondayEndTime:'',
      mondayList:[],
      form:{
        type:'time',
        alltime:false,
        desc:''
      }
    }
  },
  methods:{
    addlist() {
      this.mondayList.push(1)
    },
    closeMonday(index){
      console.log(index)
      this.mondayList.splice(index,1)
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
