<template>
  <div class="opentime">
    <div class="title">添加开放时间
      <span class="iconfont">
        <span
        @click="close"
        class="el-icon-close"
        style="cursor:pointer"
        ></span>
      </span>
    </div>
    <div class="content">
        <div class="type">
      <span class="type-name">选择类型</span>
       <el-select 
        class="date"
        v-model="type" 
        placeholder="请选择">
        <el-option
          class="data"
          v-for="item of seenictype"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div v-if="this.type=='时期选择'" class="weeked">
    <div class="date-select">
      <div class="hours">
        <span style="float:left">星期一</span>
      <div
      class="time"
       v-for="(item,index) of mondayList" :key="index">
            <el-time-select
        placeholder="起始时间"
        v-model="mondayStartTime"
        :picker-options="{
          start: '08:00',
          step: '00:15',
          end: '23:00'
        }">
        </el-time-select>
        
        <span style="float:left;margin-top:5px;margin-left:10px;margin-right:10px">至</span>
        
      <el-time-select
        placeholder="结束时间"
        v-model="mondayEndTime"
        :picker-options="{
          start: '08:00',
          step: '00:15',
          end: '23:30',
          minTime: mondayStartTime
        }">
      </el-time-select>
        <span @click="closeMonday(item)" class="el-icon-circle-close"></span>
      </div>
       <el-button ref="addtime" v-show="!businesshours && this.num.length<2" @click="handleAddMonday" style="background:#3095fa;color:#fff;float:left;margin-left:20px" size="small">+添加营业时间</el-button>
       <el-checkbox v-show="this.num.length<1" class="checkbox" v-model="businesshours">24小时营业</el-checkbox>
    </div>
     
    
    
    </div>
    <div style="clear:both"></div>
    </div>

    
    <div v-if="this.type=='时期选择'" class="weeked">
    <div class="date-select">
      <div class="hours">
        <span style="float:left">星期二</span>
      <div
      class="time"
       v-for="(item,index) of num" :key="index">
            <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }">
        </el-time-select>
        
        <span style="float:left;margin-top:5px;margin-left:10px;margin-right:10px">至</span>
        
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
          minTime: startTime
        }">
      </el-time-select>
        <span @click="closeitem(item)" class="el-icon-circle-close"></span>
      </div>
       <el-button ref="addtime" v-show="!businesshours && this.num.length<2" @click="handleAddtime" style="background:#3095fa;color:#fff;float:left;margin-left:20px" size="small">+添加营业时间</el-button>
       <el-checkbox v-show="this.num.length<1" class="checkbox" v-model="businesshours">24小时营业</el-checkbox>
    </div>
     
    
    
    </div>
    <div style="clear:both"></div>
    </div>
    
    <div v-if="this.type=='时期选择'" class="weeked">
    <div class="date-select">
      <div class="hours">
        <span style="float:left">星期三</span>
      <div
      class="time"
       v-for="(item,index) of num" :key="index">
            <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }">
        </el-time-select>
        
        <span style="float:left;margin-top:5px;margin-left:10px;margin-right:10px">至</span>
        
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
          minTime: startTime
        }">
      </el-time-select>
        <span @click="closeitem(item)" class="el-icon-circle-close"></span>
      </div>
       <el-button ref="addtime" v-show="!businesshours && this.num.length<2" @click="handleAddtime" style="background:#3095fa;color:#fff;float:left;margin-left:20px" size="small">+添加营业时间</el-button>
       <el-checkbox v-show="this.num.length<1" class="checkbox" v-model="businesshours">24小时营业</el-checkbox>
    </div>
     
    
    
    </div>
    <div style="clear:both"></div>
    </div>

    <div v-if="this.type=='时期选择'" class="weeked">
    <div class="date-select">
      <div class="hours">
        <span style="float:left">星期四</span>
      <div
      class="time"
       v-for="(item,index) of num" :key="index">
            <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }">
        </el-time-select>
        
        <span style="float:left;margin-top:5px;margin-left:10px;margin-right:10px">至</span>
        
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
          minTime: startTime
        }">
      </el-time-select>
        <span @click="closeitem(item)" class="el-icon-circle-close"></span>
      </div>
       <el-button ref="addtime" v-show="!businesshours && this.num.length<2" @click="handleAddtime" style="background:#3095fa;color:#fff;float:left;margin-left:20px" size="small">+添加营业时间</el-button>
       <el-checkbox v-show="this.num.length<1" class="checkbox" v-model="businesshours">24小时营业</el-checkbox>
    </div>
     
    
    
    </div>
    <div style="clear:both"></div>
    </div>

    <div v-if="this.type=='时期选择'" class="weeked">
    <div class="date-select">
      <div class="hours">
        <span style="float:left">星期五</span>
      <div
      class="time"
       v-for="(item,index) of num" :key="index">
            <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }">
        </el-time-select>
        
        <span style="float:left;margin-top:5px;margin-left:10px;margin-right:10px">至</span>
        
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
          minTime: startTime
        }">
      </el-time-select>
        <span @click="closeitem(item)" class="el-icon-circle-close"></span>
      </div>
       <el-button ref="addtime" v-show="!businesshours && this.num.length<2" @click="handleAddtime" style="background:#3095fa;color:#fff;float:left;margin-left:20px" size="small">+添加营业时间</el-button>
       <el-checkbox v-show="this.num.length<1" class="checkbox" v-model="businesshours">24小时营业</el-checkbox>
    </div>
     
    
    
    </div>
    <div style="clear:both"></div>
    </div>

    <div v-if="this.type=='时期选择'" class="weeked">
    <div class="date-select">
      <div class="hours">
        <span style="float:left">星期六</span>
      <div
      class="time"
       v-for="(item,index) of num" :key="index">
            <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }">
        </el-time-select>
        
        <span style="float:left;margin-top:5px;margin-left:10px;margin-right:10px">至</span>
        
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
          minTime: startTime
        }">
      </el-time-select>
        <span @click="closeitem(item)" class="el-icon-circle-close"></span>
      </div>
       <el-button ref="addtime" v-show="!businesshours && this.num.length<2" @click="handleAddtime" style="background:#3095fa;color:#fff;float:left;margin-left:20px" size="small">+添加营业时间</el-button>
       <el-checkbox v-show="this.num.length<1" class="checkbox" v-model="businesshours">24小时营业</el-checkbox>
    </div>
     
    
    
    </div>
    <div style="clear:both"></div>
    </div>

    <div v-if="this.type=='时期选择'" class="weeked">
    <div class="date-select">
      <div class="hours">
        <span style="float:left">星期日</span>
      <div
      class="time"
       v-for="(item,index) of num" :key="index">
            <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }">
        </el-time-select>
        
        <span style="float:left;margin-top:5px;margin-left:10px;margin-right:10px">至</span>
        
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
          minTime: startTime
        }">
      </el-time-select>
        <span @click="closeitem(item)" class="el-icon-circle-close"></span>
      </div>
       <el-button ref="addtime" v-show="!businesshours && this.num.length<2" @click="handleAddtime" style="background:#3095fa;color:#fff;float:left;margin-left:20px" size="small">+添加营业时间</el-button>
       <el-checkbox v-show="this.num.length<1" class="checkbox" v-model="businesshours">24小时营业</el-checkbox>
    </div>
     
    
    
    </div>
    <div style="clear:both"></div>
    </div>
    <div v-else class="desc">
      <div class="desc-title">文字描述</div>
      <el-input resize="none" size="small" class="desc-content"  type="textarea" v-model="desc"></el-input>
    </div>
    </div>
    <div class="submit">
       <el-button @click="submitCancel" class="button">取消</el-button>
       <el-button class="button" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OpenTime',
 
  data () {
    return {
      mondayStartTime: '',
      mondayEndTime: '',
      desc: '',
      startTime: '',
      endTime: '',
      type: '时期选择',
      businesshours: false,
      seenictype: ['时期选择','文字描述'],
      num: [],
      mondayList: []
    }
  },
  computed :{
    isShow () {
      return this.businesshours = 'true'
    }
  },
  methods: {
    handleAddMonday () {
      if(this.mondayList.length < 2){
        this.mondayList.push(
          {
            
          }
          )
      }
    },
    closeMonday (item) {
      this.mondayList.pop(item)
    },
    submitCancel () {
      this.$emit('close')
    },
    close () {
      this.$emit('close')
    },
    handleAddtime () {
      if(this.num.length < 2){
        this.num.push(1)
      }
    },
    closeitem (index) {
      this.num.pop(index)
    }
  }

}
</script>

<style lang='stylus' scoped>
.opentime
  border-radius 5px
  position absolute
  width 100%
  height 180%
  background #fff
  left 0
  top 0
  bottom 0
  .title
    height 78px
    line-height 78px
    margin-bottom 10px
    color #666666
    font-size 16px
    border-bottom solid 1px #f2f2f2
    .iconfont
      position absolute
      right 20px
      span
        text-decoration none
        font-size 18px
        color #3095fa
  .type
    overflow hidden
    height 50px
    line-height 50px
    .type-name
      float left
      margin-left 20px
      font-size 14px
      color #666666
    .date
      margin-left -660px
  .state
    text-align left
    margin-left 20px
    color #666666
    font-size 14px
    margin-top 28px
  .weeked
    text-align left
    height 30px
    line-height 30px
    margin-left 32px
    margin-top 20px
    height 70px
    overflow hidden
    .time
      overflow visible
      float left
      border 1px solid #c3cdc9
      padding 5px
      border-radius 5px
      position relative
      margin 10px
      margin-left 20px
      
      .el-icon-circle-close
        position absolute
        right -8px
        top -8px
        cursor pointer
    .checkbox
      margin-left 20px
  .hours
    width 700px
  .desc
    overflow hidden
    margin-top 20px

    .desc-title
      text-align left
      font-size 14px
      color #333333
      margin-left 20px
      float left
    .desc-content
      float left
      width 607px
      margin-left 20px
      box-sizing border-box
      textarea
        height 100%
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 120px;
    float left
}
.submit
  margin-top 80px
  .button
    padding 12px 60px
</style>
