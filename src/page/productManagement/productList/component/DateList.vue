<template>
  <div id="calendar">
    <!-- 年份 月份 -->
    <div class="month">
        <ul class="date">
            <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
            <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
            <li class="year-month" >
              <!-- @click="pickYear(currentYear,currentMonth)" -->
               {{currentYear}}-{{currentMonth}}月
            </li>
            <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
        </ul>
        <div class="all-month">
          <span @click="handleallclick" style="float:left;padding:14px 20px;margin-left:10px;cursor: pointer;">全月</span>
          <span @click="handleTwoClick" style="float:left;padding:14px 20px;margin-left:10px;cursor: pointer;">周六、日</span>
          <span @click="handleWeekClick" style="float:left;padding:14px 20px;margin-left:10px;cursor: pointer;">周一 ~ 周五</span>
          <span @click="clearchecked" style="float:left;padding:14px 20px;margin-left:10px;cursor: pointer;">全部清除</span>
          <i style="float:left;padding:14px 10px;margin-left:10px;font-size:15px;font-style: normal;">已选{{n.length}}天</i>
        </div>
    </div>
    <!-- 星期 -->

    <ul class="weekdays">
        <li><el-checkbox v-model="monday" class="checkbox"></el-checkbox>一</li>
        <li><el-checkbox v-model="tue" class="checkbox"></el-checkbox>二</li>
        <li><el-checkbox v-model="wed" class="checkbox"></el-checkbox>三</li>
        <li><el-checkbox v-model="tur" class="checkbox"></el-checkbox>四</li>
        <li><el-checkbox v-model="fri" class="checkbox"></el-checkbox>五</li>
        <li style="color:red"><el-checkbox v-model="sat" class="checkbox"></el-checkbox>六</li>
        <li style="color:red"><el-checkbox v-model="sun" class="checkbox"></el-checkbox>日</li>
    </ul>
    <!-- 日期 -->
    <ul class="days">
        <!-- v-for循环 每一次循环用<li>标签创建一天 -->
        <li  :class="{'checked': n.includes(dayobject)}" @click="handleitemclick(dayobject)" :key="index" v-for="(dayobject,index) in days" style="height: 130px">
            <!--本月-->
            <!--如果不是本月  改变类名加灰色-->

            <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>

            <!--如果是本月  还需要判断是不是这一天-->
            <span v-else>
          <!--今天  同年同月同日-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>
            </span>
            <!--显示剩余多少数量-->
            <p></p>
            <!---->
        </li>
    </ul>
    <el-card class="box-card" v-show="n.length">
  <div style="text-align: left;" slot="header" class="clearfix">
    成人
    
    <el-button style="float:right" type="danger" size="mini">删除</el-button>
    <el-button @click="handlesaveclick" style="float:right;margin-right:5px" type="primary" size="mini">保存</el-button>
  </div>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="结算价">
        <el-input v-model.number="form.price"></el-input>
      </el-form-item>
      <el-form-item label="剩余量">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
       <el-form-item label="购买下限">
        <el-input v-model="form.down"></el-input>
      </el-form-item>
       <el-form-item label="购买上限">
        <el-input v-model="form.top"></el-input>
      </el-form-item>
    </el-form>
  </div>
</el-card>
  <el-card class="box-card2" v-show="n.length">
  <div style="text-align: left;" slot="header" class="clearfix">
    单价房
    
    <el-button style="float:right" type="danger" size="mini">删除</el-button>
    <el-button style="float:right;margin-right:5px" type="primary" size="mini">保存</el-button>
  </div>
  <div>
    <el-form ref="form" :model="form2" label-width="80px">
      <el-form-item label="结算价">
        <el-input v-model.number="form2.price"></el-input>
      </el-form-item>
      <el-form-item label="剩余量">
        <el-input v-model="form2.number"></el-input>
      </el-form-item>
      
    </el-form>
  </div>
</el-card>
</div>
</template>

<script>
export default {
  name: "HelloWorld",
  computed:{
    isShow(){
      return false
    }
  },
  data() {
    return {
      showCard:false,
      form:{
        price:'',
        number:'',
        top:'',
        down:''
      },
      form2:{
        price:'',
        number:'',
      },
      monday: false,
      tue: false,
      wed: false,
      tur: false,
      fri: false,
      sat: false,
      sun: false,
      n: [],
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: [],
      leftobj: [
        //存放剩余数量
        { count: 1 },
        { count: 2 },
        { count: 3 },
        { count: 4 },
        { count: 5 }
      ]
    };
  },
  watch: {
    monday() {
      if (this.monday) {
        var mon = this.days
          .filter(item => item.day.getDay() === 1)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
        mon.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            this.n.push(item);
          }
        });
      } else {
        let del = this.n.filter(item => item.day.getDay() == 1);
        console.log(del);
      }
      let ischecked = this.days
        .filter(item => item.day.getDay() === 1)
        .filter(item => item.day.getMonth() + 1 == this.currentMonth)
        .filter(item => item.day >= new Date());
    },
    tue() {
      if (this.tue) {
        var mon = this.days
          .filter(item => item.day.getDay() === 2)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
        mon.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            this.n.push(item);
          }
        });
      } else {
        let del = this.n.filter(item => item.day.getDay() == 1);
        console.log(del);
      }
    },
    wed() {
      if (this.wed) {
        var mon = this.days
          .filter(item => item.day.getDay() === 3)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
        mon.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            this.n.push(item);
          }
        });
      } else {
        let del = this.n.filter(item => item.day.getDay() == 1);
        console.log(del);
      }
    },
    tur() {
      if (this.tur) {
        var mon = this.days
          .filter(item => item.day.getDay() === 4)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
        mon.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            this.n.push(item);
          }
        });
      } else {
        let del = this.n.filter(item => item.day.getDay() == 1);
        console.log(del);
      }
    },
    fri() {
      if (this.fri) {
        var mon = this.days
          .filter(item => item.day.getDay() === 5)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
        mon.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            this.n.push(item);
          }
        });
      } else {
        let del = this.n.filter(item => item.day.getDay() == 1);
        console.log(del);
      }
    },
    sat() {
      if (this.sat) {
        var mon = this.days
          .filter(item => item.day.getDay() === 6)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
        mon.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            this.n.push(item);
          }
        });
      } else {
        let del = this.n.filter(item => item.day.getDay() == 1);
        console.log(del);
      }
    },
    sun() {
      if (this.sun) {
        var mon = this.days
          .filter(item => item.day.getDay() === 0)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
        mon.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            this.n.push(item);
          }
        });
      } else {
        let del = this.n.filter(item => item.day.getDay() == 1);
        console.log(del);
      }
    }
  },
  created: function() {
    //在vue初始化时调用
    this.initData(null);
  },
  methods: {
    handlesaveclick(){
      if(this.n.includes(this.days)){
        
      }
    },
    handleTwoClick() {
      const now = new Date().getTime();
      const today = new Date().getDate();
      const weeks = this.days.filter(item => item.day.getDay() == 0);
      const sun = this.days.filter(item => item.day.getDay() == 6);
      const sat = [...[...weeks], ...[...sun]]
        .filter(item => item.day.getMonth() + 1 == this.currentMonth)
        .filter(
          item => item.day.getTime() > now || item.day.getDate() == today
        );
      sat.forEach(item => {
        if (this.n.includes(item)) {
          return;
        } else {
          this.n.push(item);
        }
      });
    },
    handleWeekClick() {
      const now = new Date().getTime();
      const today = new Date().getDate();
      const week = this.days
        .filter(item => item.day.getDay() !== 6 && item.day.getDay() !== 0)
        .filter(item => item.day.getMonth() + 1 == this.currentMonth)
        .filter(
          item => item.day.getTime() > now || item.day.getDate() == today
        );
      week.forEach(item => {
        if (this.n.includes(item)) {
          return;
        } else {
          this.n.push(item);
        }
      });
    },
    handleallclick() {
      const now = new Date().getTime();
      const today = new Date().getDate();
      const newAll = this.days
        .filter(item => item.day.getTime() > now || item.day.getDate() == today)
        .filter(item => item.day.getMonth() + 1 == this.currentMonth);
      newAll.forEach(item => {
        if (this.n.includes(item)) {
          return;
        } else {
          this.n.push(item);
        }
      });
    },
    clearchecked() {
      this.n = [];
      this.monday = false;
      this.tue = false;
      this.fri = false;
      this.tur = false;
      this.sun = false;
      this.wed = false;
      this.sat = false;
    },
    handleitemclick(day) {
      // 当前index是否已经在n中存在了
      // 判断当前的index是否在n中存在，如果存在则删除，不存在则添加

      // if (!e.target.innerText) {
      //   return;
      // } else {
      //   if (this.n.includes(index)) {
      //     // 删除
      //     this.n = this.n.filter(v => v != index);
      //   } else {
      //     // 添加
      //     this.n.push(index);
      //   }
      // }
      console.log(day);
      const now = new Date().getTime();
      const mon = new Date().getMonth();
      if (day.day.getMonth() == this.currentMonth) {
        return
      } else {
        if (day.day.getTime() < now) {
        this.$message({
          message: '请选择今天以后的时期',
          type: 'warning'
        });
        } else {
          if (this.n.includes(day)) {
            // 删除
            this.n = this.n.filter(v => v != day);
          } else {
            // 添加
            this.n.push(day);
          }
        }
      }
    },
    handledaysclcikc(days, index) {
      console.log(days, index);
    },
    order: function(day) {
      //预定函数
      if (this.leftobj[day.index].count >= 1) this.leftobj[day.index].count--;
      else alert("已经没有位置了");
    },
    initData: function(cur) {
      var leftcount = 0; //存放剩余数量
      var date;
      var index = 0; //控制显示预定的天数 ，比如下面设置只能预定三天的
      //this.initleftcount(); 每次初始化更新数量
      //有两种方案  一种是每次翻页 ajax获取数据初始化   http请求过多会导致资源浪费
      // 一种是每次请求 ajax获取数据初始化    数据更新过慢会导致缺少实时性
      //还可以setTimeout 定时请求更新数据  实现数据刷新（可能会更好）
      if (cur) {
        date = new Date(cur);
      } else {
        var now = new Date();
        var d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1));
        d.setDate(35);
        date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      }
      this.currentDay = date.getDate();
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
      this.currentWeek = date.getDay(); // 1...6,0
      if (this.currentWeek == 0) {
        this.currentWeek = 7;
      }
      var str = this.formatDate(
        this.currentYear,
        this.currentMonth,
        this.currentDay
      );
      this.days.length = 0;
      // 今天是周日，放在第一行第7个位置，前面6个
      //初始化本周
      for (var i = this.currentWeek - 1; i >= 0; i--) {
        var d = new Date(str);
        d.setDate(d.getDate() - i);
        var dayobject = {};
        dayobject.day = d;
        var now = new Date();
        if (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        ) {
          dayobject.index = index++; //从今天开始显示供预定的数量
        } else if (index != 0 && index < 3) dayobject.index = index++; //从今天开始3天内显示供预定的数量
        this.days.push(dayobject); //将日期放入data 中的days数组 供页面渲染使用
      }
      //其他周
      for (var i = 1; i <= 35 - this.currentWeek; i++) {
        var d = new Date(str);
        d.setDate(d.getDate() + i);
        var dayobject = {};
        dayobject.day = d;
        var now = new Date();
        if (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        ) {
          dayobject.index = index++;
        } else if (index != 0 && index < 3) dayobject.index = index++;
        this.days.push(dayobject);
      }
    },
    pickPre: function(year, month) {
      // setDate(0); 上月最后一天
      // setDate(-1); 上月倒数第二天
      // setDate(dx) 参数dx为 上月最后一天的前后dx天

        var d = new Date(this.formatDate(year, month, 1));
        d.setDate(0);
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        this.n = [];

    },
    pickNext: function(year, month) {
      var d = new Date(this.formatDate(year, month, 1));
      d.setDate(35);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      this.n = [];
    },
    pickYear: function(year, month) {
      alert(year + "," + month);
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate: function(year, month, day) {
      var y = year;
      var m = month;
      if (m < 10) m = "0" + m;
      var d = day;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.checked {
  border: 1px solid red !important;
  box-sizing: border-box;
}
.all-month {
  flex: 1;
}
.all-month span:hover {
  background: rgba(150, 2, 12, 0.1);
}
* {
  box-sizing: border-box;
}
.date {
  float: left;
}
ul {
  list-style-type: none;
}
body {
  font-family: Verdana, sans-serif;
  background: #e8f0f3;
}
#calendar {
  margin: 37px auto 20px auto;
  width: 764px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  padding: 10px;
}
.box-card {
  position: absolute;
  right: -340px;
  width: 339px;
  top: 0;
}
.box-card2 {
  position: absolute;
  right: -340px;
  width: 339px;
  bottom: 0;
}
.month {
  width: 100%;
  color: #666;
  overflow: hidden;
  display: flex;
  margin-bottom: 20px;
}
.month ul {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}
.year-month {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 135px;
  border: solid 1px #e6e6e6;
  margin-left:5px;
  margin-right: 5px;
}
.all-month span{
  border: solid 1px #e6e6e6
}
.weekdays li .checkbox {
  margin-right: 10px;
}
.year-month:hover {
  background: rgba(150, 2, 12, 0.1);
}
.choose-year {
  padding-left: 20px;
  padding-right: 20px;
}
.choose-month {
  text-align: center;
  font-size: 1.5rem;
}
.arrow {
  padding: 10px;
  border: solid 1px #e6e6e6;
  cursor: pointer;
}
.arrow:hover {
  background: rgba(100, 2, 12, 0.1);
}
.month ul li {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
}
.weekdays {
  margin: 0;
  padding: 10px 0;
  background-color: #00b8ec;
  display: flex;
  flex-wrap: wrap;
  color: #ffffff;
  justify-content: space-around;
}
.weekdays li {
  display: inline-block;
  width: 13.6%;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
}
.days {
  padding: 0;
  background: #ffffff;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.days li {
  list-style-type: none;
  display: inline-block;
  width: 14.2%;
  text-align: center;
  padding-bottom: 15px;
  padding-top: 15px;
  font-size: 1rem;
  color: #000;
}
.days li .active {
  padding: 6px 10px;
  border-radius: 50%;
  background: #00b8ec;
  color: #fff;
}
.days li .other-month {
  padding: 5px;
  color: gainsboro;
  display: none;
}
.days li:hover {
  background: #e1e1e1;
}
</style>
