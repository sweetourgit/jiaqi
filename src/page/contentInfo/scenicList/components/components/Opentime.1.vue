<template>
  <div class="opentime">
  
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
       <el-button @click="submit" class="button" type="primary">确认</el-button>
    </div>
  </div>
</template>

<script>
{


  
}
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
    submit () {
      if (this.type=='时期选择') {
          let weeked = document.querySelectorAll('.weeked'),
  submitbtn  = document.querySelector('.submitbtn');
  console.log(weeked.offsetTop)
      } else {
        if (this.desc===''){
           this.$message.error('内容不能为空');
        }else{
          
      this.$emit('postinner',this.desc);this.desc = '';this.$emit('close')
        }
        
      }
    },
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

