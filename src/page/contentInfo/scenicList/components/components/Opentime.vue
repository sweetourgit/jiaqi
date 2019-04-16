<template>
  <div>
    <div class="operation">
      <el-button style="border:1px solid #3095fa;color:#3095fa;" @click="$emit('closeButton', false)">取消</el-button>
      <el-button type="primary" @click="handSever">保存</el-button>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <!-- <el-form-item label="活动区域">
        <el-select v-model="form.type" placeholder="请选择活动区域">
          <el-option label="时期选择" value="time"></el-option>
          <el-option label="文字描述" value="text"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- 星期一 -->
      <el-form-item>
        <span class="formItem">星期一</span>
        <div class="formTime">
          <div :class="timeDiv + index" v-for="(item,index) of form.one" :key="index">
            <el-input class="form-input" v-model="item.start"></el-input>
            <span style="margin-left: 8px;">至</span>
            <el-input class="form-input" v-model="item.end"></el-input>
            <span @click="closeMondayOne(index)" class="el-icon-remove"></span>
          </div>

          <el-button v-if="isOne" plain :class="formButtonOne" @click="addlistOne">添加时间</el-button>
          <el-checkbox :class="formCheckOne" v-model="form.alltimeOne" @change="handChangeOne">全天营业</el-checkbox>
        </div>
      </el-form-item>

      <!-- 星期二 -->
      <el-form-item>
        <span class="formItem">星期二</span>
        <div class="formTime">
          <div :class="timeDiv + index" v-for="(item,index) of form.tue" :key="index">
            <el-input class="form-input" v-model="item.start"></el-input>
            <span style="margin-left: 8px;">至</span>
            <el-input class="form-input" v-model="item.end"></el-input>
            <span @click="closeMondayTue(index)" class="el-icon-remove"></span>
          </div>

          <el-button v-if="isTue" plain :class="formButtonTue" @click="addlistTue">添加时间</el-button>
          <el-checkbox :class="formCheckTue" v-model="form.alltimeTue" @change="handChangeTue">全天营业</el-checkbox>
        </div>
      </el-form-item>

      <!-- 星期三 -->
      <el-form-item>
        <span class="formItem">星期三</span>
        <div class="formTime">
          <div :class="timeDiv + index" v-for="(item,index) of form.wed" :key="index">
            <el-input class="form-input" v-model="item.start"></el-input>
            <span style="margin-left: 8px;">至</span>
            <el-input class="form-input" v-model="item.end"></el-input>
            <span @click="closeMondayWed(index)" class="el-icon-remove"></span>
          </div>

          <el-button v-if="isWed" plain :class="formButtonWed" @click="addlistWed">添加时间</el-button>
          <el-checkbox :class="formCheckWed" v-model="form.alltimeWed" @change="handChangeWed">全天营业</el-checkbox>
        </div>
      </el-form-item>
      
      <!-- 星期四 -->
      <el-form-item>
        <span class="formItem">星期四</span>
        <div class="formTime">
          <div :class="timeDiv + index" v-for="(item,index) of form.thur" :key="index">
            <el-input class="form-input" v-model="item.start"></el-input>
            <span style="margin-left: 8px;">至</span>
            <el-input class="form-input" v-model="item.end"></el-input>
            <span @click="closeMondayThur(index)" class="el-icon-remove"></span>
          </div>

          <el-button v-if="isThur" plain :class="formButtonThur" @click="addlistThur">添加时间</el-button>
          <el-checkbox :class="formCheckThur" v-model="form.alltimeThur" @change="handChangeThur">全天营业</el-checkbox>
        </div>
      </el-form-item>

      <!-- 星期五 -->
      <el-form-item>
        <span class="formItem">星期五</span>
        <div class="formTime">
          <div :class="timeDiv + index" v-for="(item,index) of form.fir" :key="index">
            <el-input class="form-input" v-model="item.start"></el-input>
            <span style="margin-left: 8px;">至</span>
            <el-input class="form-input" v-model="item.end"></el-input>
            <span @click="closeMondayFir(index)" class="el-icon-remove"></span>
          </div>

          <el-button v-if="isFir" plain :class="formButtonFir" @click="addlistFir">添加时间</el-button>
          <el-checkbox :class="formCheckFir" v-model="form.alltimeFir" @change="handChangeFir">全天营业</el-checkbox>
        </div>
      </el-form-item>

      <!-- 星期六 -->
      <el-form-item>
        <span class="formItem">星期六</span>
        <div class="formTime">
          <div :class="timeDiv + index" v-for="(item,index) of form.sat" :key="index">
            <el-input class="form-input" v-model="item.start"></el-input>
            <span style="margin-left: 8px;">至</span>
            <el-input class="form-input" v-model="item.end"></el-input>
            <span @click="closeMondaySat(index)" class="el-icon-remove"></span>
          </div>

          <el-button v-if="isSat" plain :class="formButtonSat" @click="addlistSat">添加时间</el-button>
          <el-checkbox :class="formCheckSat" v-model="form.alltimeSat" @change="handChangeSat">全天营业</el-checkbox>
        </div>
      </el-form-item>

      <!-- 星期日 -->
      <el-form-item>
        <span class="formItem">星期日</span>
        <div class="formTime">
          <div :class="timeDiv + index" v-for="(item,index) of form.sun" :key="index">
            <el-input class="form-input" v-model="item.start"></el-input>
            <span style="margin-left: 8px;">至</span>
            <el-input class="form-input" v-model="item.end"></el-input>
            <span @click="closeMondaySun(index)" class="el-icon-remove"></span>
          </div>

          <el-button v-if="isSun" plain :class="formButtonSun" @click="addlistSun">添加时间</el-button>
          <el-checkbox :class="formCheckSun" v-model="form.alltimeSun" @change="handChangeSun">全天营业</el-checkbox>
        </div>
      </el-form-item>

      <!-- 其他说明 -->
      <el-form-item style="margin-left: 10px;" label="其他说明:">
        <el-input style="width: 705px;" :rows="10" type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'OpenTime',
  props: ['dateTime', 'isWatch'],
  data() {
    return{
      timeDiv: 'timeDiv',            // 添加时间divclass
      formButtonOne: 'formButton1',  // (周一)添加时间按钮class
      formButtonTue: 'formButton1',  // (周二)添加时间按钮class
      formButtonWed: 'formButton1',  // (周三)添加时间按钮class
      formButtonThur: 'formButton1',  // (周四)添加时间按钮class
      formButtonFir: 'formButton1',  // (周五)添加时间按钮class
      formButtonSat: 'formButton1',  // (周六)添加时间按钮class
      formButtonSun: 'formButton1',  // (周日)添加时间按钮class
      formCheckOne: 'formCheck',    // (周一)添加时间checkBox
      formCheckTue: 'formCheck',    // (周二)添加时间checkBox
      formCheckWed: 'formCheck',    // (周三)添加时间checkBox
      formCheckThur: 'formCheck',    // (周四)添加时间checkBox
      formCheckFir: 'formCheck',    // (周五)添加时间checkBox
      formCheckSat: 'formCheck',    // (周六)添加时间checkBox
      formCheckSun: 'formCheck',    // (周日)添加时间checkBox

      isOne: true,                  // 星期一显示按钮
      isTue: true,                  // 星期二显示按钮
      isWed: true,                  // 星期三显示按钮
      isThur: true,                 // 星期四显示按钮
      isFir: true,                 // 星期五显示按钮
      isSat: true,                 // 星期六显示按钮
      isSun: true,                 // 星期日显示按钮
      mondayList:[],
      tue:[],
      wed:[],
      thur:[],
      fir:[],
      sat:[],
      sun:[],
      form:{
        one: [
        {
          start: '',
          end: ''
        }],
        tue: [
        {
          start: '',
          end: ''
        }],
        wed: [
        {
          start: '',
          end: ''
        }],
        thur: [
        {
          start: '',
          end: ''
        }],
        fir: [
        {
          start: '',
          end: ''
        }],
        sat: [
        {
          start: '',
          end: ''
        }],
        sun: [
        {
          start: '',
          end: ''
        }],
        alltimeOne:false,
        alltimeTue:false,
        alltimeWed:false,
        alltimeThur:false,
        alltimeFir:false,
        alltimeSat:false,
        alltimeSun:false,
        desc:''
      }
    }
  },
  created() {
    this.changeData();
  },
  methods:{
    changeData() {
      let data = this.dateTime;
      if (data.one.length != 0) {
        if (data.one[0].alltime) {
          this.form.alltimeOne = true;
          this.handChangeOne(true);
        } else {
          this.form.one = data.one
          this.listClassOne(this.form.one);
        }
      }
      if (data.tue.length != 0) {
        if (data.tue[0].alltime) {
          this.form.alltimeTue = true;
          this.handChangeTue(true);
        } else {
          this.form.tue = data.tue
          this.listClassTue(this.form.tue);
        }
      }
      if (data.wed.length != 0) {
        if (data.wed[0].alltime) {
          this.form.alltimeWed = true;
          this.handChangeWed(true);
        } else {
          this.form.wed = data.wed
          this.listClassWed(this.form.wed);
        }
      }
      if (data.thur.length != 0) {
        if (data.thur[0].alltime) {
          this.form.alltimeThur = true;
          this.handChangeThur(true);
        } else {
          this.form.thur = data.thur
          this.listClassThur(this.form.thur);
        }
      }
      if (data.fir.length != 0) {
        if (data.fir[0].alltime) {
          this.form.alltimeFir = true;
          this.handChangeFir(true);
        } else {
          this.form.fir = data.fir
          this.listClassFir(this.form.fir);
        }
      }
      if (data.sat.length != 0) {
        if (data.sat[0].alltime) {
          this.form.alltimeSat = true;
          this.handChangeSat(true);
        } else {
          this.form.sat = data.sat
          this.listClassSat(this.form.sat);
        }
      }
      if (data.sun.length != 0) {
        if (data.sun[0].alltime) {
          this.form.alltimeSun = true;
          this.handChangeSun(true);
        } else {
          this.form.sun = data.sun
          this.listClassSun(this.form.sun);
        }
      }
      this.form.desc = data.desc;
    },
    // 样式变换(周一)
    listClassOne(time) {
      if (time.length == 0) {
        this.formButtonOne = 'formButton0';
      }else if (time.length == 1) {
        this.formButtonOne = 'formButton1'
        this.formCheckOne = 'formCheck';
      }else if (time.length == 2) {
        this.formButtonOne  = 'formButton2';
      } else if (time.length == 3) {
        this.formButtonOne  = 'formButton3';
        this.formCheckOne = 'formCheck';
        this.isOne = true;
      } else if (time.length == 4) {
        this.isOne = false;
        this.formCheckOne = 'formCheck1';
      }
    },
    // 样式变换(周二)
    listClassTue(time) {
      if (time.length == 0) {
        this.formButtonTue = 'formButton0';
      }else if (time.length == 1) {
        this.formButtonTue = 'formButton1'
        this.formCheckTue = 'formCheck';
      }else if (time.length == 2) {
        this.formButtonTue  = 'formButton2';
      } else if (time.length == 3) {
        this.formButtonTue  = 'formButton3';
        this.formCheckTue = 'formCheck';
        this.isTue = true;
      } else if (time.length == 4) {
        this.isTue = false;
        this.formCheckTue = 'formCheck1';
      }
    },
    // 样式变换(周三)
    listClassWed(time) {
      if (time.length == 0) {
        this.formButtonWed = 'formButton0';
      }else if (time.length == 1) {
        this.formButtonWed = 'formButton1'
        this.formCheckWed = 'formCheck';
      }else if (time.length == 2) {
        this.formButtonWed  = 'formButton2';
      } else if (time.length == 3) {
        this.formButtonWed  = 'formButton3';
        this.formCheckWed = 'formCheck';
        this.isWed = true;
      } else if (time.length == 4) {
        this.isWed = false;
        this.formCheckWed = 'formCheck1';
      }
    },
    // 样式变换(周四)
    listClassThur(time) {
      if (time.length == 0) {
        this.formButtonThur = 'formButton0';
      }else if (time.length == 1) {
        this.formButtonThur = 'formButton1'
        this.formCheckThur = 'formCheck';
      }else if (time.length == 2) {
        this.formButtonThur  = 'formButton2';
      } else if (time.length == 3) {
        this.formButtonThur  = 'formButton3';
        this.formCheckThur = 'formCheck';
        this.isThur = true;
      } else if (time.length == 4) {
        this.isThur = false;
        this.formCheckThur = 'formCheck1';
      }
    },
    // 样式变换(周五)
    listClassFir(time) {
      if (time.length == 0) {
        this.formButtonFir = 'formButton0';
      }else if (time.length == 1) {
        this.formButtonFir = 'formButton1'
        this.formCheckFir = 'formCheck';
      }else if (time.length == 2) {
        this.formButtonFir  = 'formButton2';
      } else if (time.length == 3) {
        this.formButtonFir  = 'formButton3';
        this.formCheckFir = 'formCheck';
        this.isFir = true;
      } else if (time.length == 4) {
        this.isFir = false;
        this.formCheckFir = 'formCheck1';
      }
    },
    // 样式变换(周六)
    listClassSat(time) {
      if (time.length == 0) {
        this.formButtonSat = 'formButton0';
      }else if (time.length == 1) {
        this.formButtonSat = 'formButton1'
        this.formCheckSat = 'formCheck';
      }else if (time.length == 2) {
        this.formButtonSat  = 'formButton2';
      } else if (time.length == 3) {
        this.formButtonSat  = 'formButton3';
        this.formCheckSat = 'formCheck';
        this.isSat = true;
      } else if (time.length == 4) {
        this.isSat = false;
        this.formCheckSat = 'formCheck1';
      }
    },
    // 样式变换(周日)
    listClassSun(time) {
      if (time.length == 0) {
        this.formButtonSun = 'formButton0';
      }else if (time.length == 1) {
        this.formButtonSun = 'formButton1'
        this.formCheckSun = 'formCheck';
      }else if (time.length == 2) {
        this.formButtonSun  = 'formButton2';
      } else if (time.length == 3) {
        this.formButtonSun  = 'formButton3';
        this.formCheckSun = 'formCheck';
        this.isSun = true;
      } else if (time.length == 4) {
        this.isSun = false;
        this.formCheckSun = 'formCheck1';
      }
    },
    // 添加时间(周一)
    addlistOne() {
      this.form.one.push({
        start:'',
        end:'',
      })
      this.listClassOne(this.form.one);
    },
    // 删除时间(周一)
    closeMondayOne(index){
      this.form.one.splice(index,1)
      this.listClassOne(this.form.one);
    },
    // 全天营业(周一)
    handChangeOne(v) {
      if (v) {
        this.isOne = false;
        this.form.one = [];
        this.formCheckOne = 'formCheck1';
      } else {
        this.form.one.push({
          start:'',
          end:'',
        })
        this.isOne = true;
        this.formButtonOne = 'formButton1'
        this.formCheckOne = 'formCheck';
      }
    },
    // 添加时间(周二)
    addlistTue() {
      this.form.tue.push({
        start:'',
        end:'',
      })
      this.listClassTue(this.form.tue);
    },
    // 删除时间(周二)
    closeMondayTue(index) {
      this.form.tue.splice(index,1)
      this.listClassTue(this.form.tue);
    },
    // 全天营业(周二)
    handChangeTue(v) {
      if (v) {
        this.isTue = false;
        this.form.tue = [];
        this.formCheckTue = 'formCheck1';
      } else {
        this.form.tue.push({
          start:'',
          end:'',
        })
        this.isTue = true;
        this.formButtonTue = 'formButton1'
        this.formCheckTue = 'formCheck';
      }
    },
    // 添加时间(周三)
    addlistWed() {
      this.form.wed.push({
        start:'',
        end:'',
      })
      this.listClassWed(this.form.wed);
    },
    // 删除时间(周三)
    closeMondayWed(index) {
      this.form.wed.splice(index,1)
      this.listClassWed(this.form.wed);
    },
    // 全天营业(周三)
    handChangeWed(v) {
      if (v) {
        this.isWed = false;
        this.form.wed = [];
        this.formCheckWed = 'formCheck1';
      } else {
        this.form.wed.push({
          start:'',
          end:'',
        })
        this.isWed = true;
        this.formButtonWed = 'formButton1'
        this.formCheckWed = 'formCheck';
      }
    },
    // 添加时间(周四)
    addlistThur() {
      this.form.thur.push({
        start:'',
        end:'',
      })
      this.listClassThur(this.form.thur);
    },
    // 删除时间(周四)
    closeMondayThur(index) {
      this.form.thur.splice(index,1)
      this.listClassThur(this.form.thur);
    },
    // 全天营业(周四)
    handChangeThur(v) {
      if (v) {
        this.isThur = false;
        this.form.thur = [];
        this.formCheckThur = 'formCheck1';
      } else {
        this.form.thur.push({
          start:'',
          end:'',
        })
        this.isThur = true;
        this.formButtonThur = 'formButton1'
        this.formCheckThur = 'formCheck';
      }
    },
    // 添加时间(周五)
    addlistFir() {
      this.form.fir.push({
        start:'',
        end:'',
      })
      this.listClassFir(this.form.fir);
    },
    // 删除时间(周五)
    closeMondayFir(index) {
      this.form.fir.splice(index,1)
      this.listClassFir(this.form.fir);
    },
    // 全天营业(周五)
    handChangeFir(v) {
      if (v) {
        this.isFir = false;
        this.form.fir = [];
        this.formCheckFir = 'formCheck1';
      } else {
        this.form.fir.push({
          start:'',
          end:'',
        })
        this.isFir = true;
        this.formButtonFir = 'formButton1'
        this.formCheckFir = 'formCheck';
      }
    },
    // 添加时间(周六)
    addlistSat() {
      this.form.sat.push({
        start:'',
        end:'',
      })
      this.listClassSat(this.form.sat);
    },
    // 删除时间(周六)
    closeMondaySat(index) {
      this.form.sat.splice(index,1)
      this.listClassSat(this.form.sat);
    },
    // 全天营业(周六)
    handChangeSat(v) {
      if (v) {
        this.isSat = false;
        this.form.sat = [];
        this.formCheckSat = 'formCheck1';
      } else {
        this.form.sat.push({
          start:'',
          end:'',
        })
        this.isSat = true;
        this.formButtonSat = 'formButton1'
        this.formCheckSat = 'formCheck';
      }
    },
    // 添加时间(周日)
    addlistSun() {
      this.form.sun.push({
        start:'',
        end:'',
      })
      this.listClassSun(this.form.sun);
    },
    // 删除时间(周日)
    closeMondaySun(index) {
      this.form.sun.splice(index,1)
      this.listClassSun(this.form.sun);
    },
    // 全天营业(周日)
    handChangeSun(v) {
      if (v) {
        this.isSun = false;
        this.form.sun = [];
        this.formCheckSun = 'formCheck1';
      } else {
        this.form.sun.push({
          start:'',
          end:'',
        })
        this.isSun = true;
        this.formButtonSun = 'formButton1'
        this.formCheckSun = 'formCheck';
      }
    },
    // 保存
    handSever() {
      this.$emit("timeList", this.form);
    },
  }
}
</script>

<style lang='stylus' scoped>
 .time
      overflow visible
      float left
      border 1px solid #c3cdc9
      padding 10px
      border-radius 5px
      position relative
      margin 10px 10px 10px 0
      
      
      .select
        width 120px
  .btn
    margin 0 auto
    width 30%
.operation {
  float: right;
  margin-top: -65px;
}
.formTime {
  float: left;
  width: 615px;
}
.timeDiv0 {
  float: left;
  width: 280px;
  height: 72px;
  border: solid 1px #E6E6E6;
  margin-left: 10px;
}
.timeDiv1 {
  float: left;
  width: 280px;
  height: 72px;
  border: solid 1px #E6E6E6;
  margin-left: 40px;
}
.timeDiv2 {
  float: left;
  width: 280px;
  height: 72px;
  border: solid 1px #E6E6E6;
  margin-left: 10px;
  margin-top: 20px;
}
.timeDiv3 {
  float: left;
  width: 280px;
  height: 72px;
  border: solid 1px #E6E6E6;
  margin-left: 40px;
  margin-top: 20px;
}
.form-input {
  margin: 18px 0 0 11px;
  width: 108px;
}
.el-icon-remove {
  position absolute
  margin-top: -10px;
  cursor pointer
  font-size: 25px;
}

.formItem {
  float:left;
  margin-left: -50px;
  margin-top: 15px;
}
.formButton0 {
  margin-left: 10px;
}
.formButton1 {
  margin-left: 50px;
  margin-top: 18px;
}
.formButton2 {
  margin-left: 10px;
}
.formButton3 {
  margin-top: 36px;
  margin-left: 50px;
}
.formCheck {
  margin: 18px 0 0 30px;
}
.formCheck1 {
  margin: 18px 0 0 10px;
}
</style>
