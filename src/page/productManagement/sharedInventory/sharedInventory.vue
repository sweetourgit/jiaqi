<template>
  <div>
    <div id="calendar" >
    <!-- 年份 月份 -->
    <div class="month">
        <ul class="date">
            <!--点击会触发pickpre函数，重新刷新当前日期 @click -->
            <li class="arrow" @click="pickPre(currentYear,currentMonth)"><</li>
            <li class="year-month" >
               {{currentYear}}-{{currentMonth}}月
            </li>
            <li class="arrow" @click="pickNext(currentYear,currentMonth)">></li>
        </ul>
        <el-button class="all-month" plain @click="clickStock">添加共享库存</el-button>
    </div>
      <!-- 星期 -->
      <ul class="weekdays">
          <li style="color:red">日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li style="color:red">六</li>
      </ul>
      <!-- 日期 -->
      <ul class="days">
          <!-- v-for循环 每一次循环用<li>标签创建一天 -->
        <template v-for="(dayobject,index) in days">
          <template v-if="dayobject.day.getMonth()+1 != currentMonth || dayobject.day.getTime() < today.getTime() - 24 * 60 * 60 * 1000">
            <li style="background: #F6F6F6;border: solid 1px #E7E7E7;border-left:none;border-top:none;cursor:not-allowed" :key="index" >
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <div v-else>
            <!--今天  同年同月同日-->     
                  <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                  <span v-else>{{ dayobject.day.getDate() }}</span>
                  
                  <div class='person' v-for="(data,index) in dayobject.data.person" :key="index">  
                    <p>{{data.name}}</p>
                    <p style="width:113px">库存余位:{{data.count}}/100</p>
                    <p>关联团期: 1</p>
                  </div>  
              </div>
              <!--显示剩余多少数量-->
              <!---->
          </li>
          </template>
          <template v-else>
            <li style="border: solid 1px #E7E7E7;border-left:none;border-top:none;"  :class="{'checked': n.includes(dayobject)}" @click="handleitemclick(dayobject)" :key="index" >
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <div v-else>
            <!--今天  同年同月同日-->     
                  <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                  <span v-else>{{ dayobject.day.getDate() }}</span>
                  <!-- {{dayobject}} -->
                  <!--  -->
                  <div class='person persons' v-for="(data,index) in dayobject.data.person" :key="index" @click="countClick(dayobject.data.person[index])">  
                      <!-- v-show="dayobject.data.person.price" -->
                    <p>{{data.name}}</p>
                    <p style="width:113px">库存余位:{{data.count}}/100</p>
                    <p>关联团期: 1</p>
                    <!-- <p>同业价：{{dayobject.data.person[index].traderPrice}}</p> -->
                    <!-- <p>已售/库存：0/{{dayobject.data.person.number}}</p> -->
                    <!-- <p>上下限:{{dayobject.data.person.top}}/{{dayobject.data.person.down}}</p> -->
                  </div>  
              </div>
              <!--显示剩余多少数量-->
              <!---->
          </li>
          </template>
        </template>
      </ul>
    </div>
    
    <!-- 添加共享库存弹窗 -->
    <el-dialog title="新增共享库存" :visible.sync="dialogVisible" width="578px">
      <el-form :model="addStock" :rules="rules" ref="addStock">
        <el-form-item label="库存名称" prop="name" :label-width="formLabelWidth">
          <el-input class="addStorkInput" v-model="addStock.name" maxlength=20></el-input>
          <span class="addStock-number">{{addStock.name.length}}/20字</span>
        </el-form-item>
        <el-form-item label="库存" prop="count" :label-width="formLabelWidth">
          <el-input class="addStorkInput" v-model="addStock.count"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleallclick('addStock')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加共享库存弹窗ENG -->

    <!-- 共享库存信息展示 -->
    <el-dialog :visible.sync="dialogStock" :show-close="false" width="1270px">
      <div class="countStock">
        <el-form :model="addStocks" :rules="rules1" ref="listStock">
          <el-form-item label="库存名称" prop="name" class="editStock" :label-width="formLabelWidth">
            <el-input class="addStorkInputs" v-model="addStocks.name" :disabled="true" maxlength=20></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="count" class="editStock" :label-width="formLabelWidth">
            <el-input class="addStorkInputs" v-model="addStocks.count"></el-input>
          </el-form-item>
          <div class="surplus">
            <span class="surplus1">剩余</span>
            <span class="surplus2">50</span>
          </div>
          <div class="operation">
            <span class="surplus1">操作</span>
            <span class="operation2">杨阳</span>
          </div>
        </el-form>
      </div>



      <!-- 计划信息 -->
      <div class="proList" >
        <div class="proListHeight">
          <span style="font-weight: 700;">团期</span>
          <span style="margin-left: 20px;">24093932018091010185273</span>
          <span style="font-weight: 700;margin-left: 50px;">产品</span>
          <span style="margin-left: 20px;">扬州直飞普吉7/8天往返含税特价机票（往返各15kg行李+赠送电子地图攻略）</span>
        </div>
        <!-- 报名类型信息 -->
        <div class="stockList">
          <div style="margin-left: 30px;">
            <span style="color: red;">成人</span>
            <span style="margin-left:10px;">已售</span>
            <span style="margin-left:10px;">25</span>
          </div>
          <div style="margin-left: 38px;">
            <span style="margin-left: -10px;">库存</span>
            <el-input style="width: 120px;margin-left:30px" v-model="input" disabled></el-input>
            <el-checkbox style="margin-left:30px;" v-model="checked" disabled>配额</el-checkbox>
          </div>
          <div>
            <span>销售价格</span>
            <el-input style="width: 120px;margin-left:20px" v-model="input" disabled></el-input>
          </div>
          <div>
            <span>同业价格</span>
            <el-input style="width: 120px;margin-left:20px" v-model="input" disabled></el-input>
          </div>
        </div>
        <!-- 报名类型信息ENG -->
      </div>
      <!-- 计划信息ENG -->




      <div class="frameBottom">
        <el-button class="frameBottom-delete" type="danger" plain>删除库存</el-button>
        <div class="frameBottom-right ">
          <el-button plain @click="dialogStock = false">取消</el-button>
          <el-button plain>保存</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 共享库存信息展示ENG -->
  </div>
</template>

<script>
export default {
  created: function() {
    //在vue初始化时调用
    this.initData(null);
  },
  data() {
    return {
      input: '',
      checked: '',
      today: new Date(),
      days: [],
      n: [],
      arr: [],
      formLabelWidth: '100px',
      // 日期信息
      currentYear: 1970,
      currentMonth: 1,
      currentDay: 1,
      currentWeek: 1,
      // 添加共享库存弹窗
      dialogVisible: false,
      // 浏览共享库存弹窗
      dialogStock: false,
      planningInfo: [], // 计划信息
      // 添加共享库存
      addStock: {
        name: '',
        count: ''
      },
      // 修改共享库存
      addStocks: {
        name: '',
        count: ''
      },
      // 浏览共享库存
      listStock: {

      },
      // 添加共享库存验证
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 20, message: '字数超过8汉字限制'}
        ],
        count: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }
        ]
      },
      // 修改共享库存验证
      rules1: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 0, max: 20, message: '字数超过8汉字限制'}
        ],
        count: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }
        ]
      }
    }
  },
  methods: {
    pickPre: function(year, month) {
      // setDate(0); 上月最后一天
      // setDate(-1); 上月倒数第二天
      // setDate(dx) 参数dx为 上月最后一天的前后dx天
      if (
        this.today.getMonth() + 1 < this.currentMonth ||
        this.today.getFullYear() < this.currentYear
      ) {
        var d = new Date(this.formatDate(year, month, 1));
        d.setDate(0);
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        this.n = [];
      } else {
        // alert("不能选择以前的");
        this.$message({
          message: '不能选择以前的',
          type: 'warning'
        });
      }
    },
    pickNext: function(year, month) {
      var d = new Date(this.formatDate(year, month, 1));
      d.setDate(35);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      this.n = [];
    },
    initData: function(cur) {
      var date;
      var index = 0;
      //控制显示预定的天数 ，比如下面设置只能预定三天的
      //this.initleftcount(); 每次初始化更新数量
      //有两种方案  一种是每次翻页 ajax获取数据初始化   http请求过多会导致资源浪费
      // 一种是每次请求 ajax获取数据初始化    数据更新过慢会导致缺少实时性
      //还可以setTimeout 定时请求更新数据  实现数据刷新（可能会更好）
      if (cur) {
        date = new Date(cur);
      } else {
        // date = new Date();
        var now = new Date();
        var d = new Date(this.formatDate(now.getFullYear(), now.getMonth() + 1, 1));
        d.setDate(35);
        date = new Date(this.formatDate(d.getFullYear(), d.getMonth(), 1));
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
      for (var i = this.currentWeek; i >= 0; i--) {
        var d = new Date(str);
        d.setDate(d.getDate() - i);
        var dayobject = {};
        dayobject.day = d;
        // var now = new Date();
        // if (
        //   d.getDate() === now.getDate() &&
        //   d.getMonth() === now.getMonth() &&
        //   d.getFullYear() === now.getFullYear()
        // ) {
        //   dayobject.index = index++; //从今天开始显示供预定的数量
        // } else if (index != 0 && index < 3) dayobject.index = index++; //从今天开始3天内显示供预定的数量
        dayobject.index = this.days.length;
        this.days.push(dayobject); //将日期放入data 中的days数组 供页面渲染使用
      }
      //其他周
      for (var i = 1; i <= 41 - this.currentWeek; i++) {
        var d = new Date(str);
        d.setDate(d.getDate() + i);
        var dayobject = {};
        dayobject.day = d;
        // var now = new Date();
        // if (
        //   d.getDate() === now.getDate() &&
        //   d.getMonth() === now.getMonth() &&
        //   d.getFullYear() === now.getFullYear()
        // ) {
        //   dayobject.index = index++;
        // } else if (index != 0 && index < 3) dayobject.index = index++;
        dayobject.index = this.days.length;
        this.days.push(dayobject);
        this.days.map(item => (item.data = { person: [], children: {} }));
      }
      // 共享库存数据
      this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorylist', {
        "object": {
          "share": 1,
        }
      }).then(res => {
        this.days.forEach(item => {
          // if(item.day.getTime() > new Date().getTime() || item.day.getDate() == new Date().getDate()){
          //   if(item.day.getMonth() + 1 == this.currentMonth){
              
          //   }
          // }
          let str = this.formatDates(
            item.day.getFullYear(),
            item.day.getMonth() + 1,
            item.day.getDate()
          )
          this.arr = [];
          res.data.objects.forEach(items => {
            if (str == items.date) {
              this.arr.push({
                id: items.id,
                name: items.name,
                count: items.count
              })
              item.data.person = this.arr
            }
          })
        })
        this.n = [];
      }).catch(err => {
        console.log(err);
      })
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate: function(year, month, day) {
      var y = year;
      var m = month;
      if (m < 10) m = "0" + m;
      var d = day;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    },
    formatDates: function(y, m, d){
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      return y + '' + m + '' + d;
    },
    // 增加共享库存
    handleallclick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let str = this.formatDates(
            this.n[0].day.getFullYear(),
            this.n[0].day.getMonth() + 1,
            this.n[0].day.getDate()
          )
          this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryinsert', {
            "object": {
              "name": this.addStock.name,
              "count": this.addStock.count,
              "date": str,
              "share": 1
            }
          }).then(res => {
            if (this.days[this.n[0].index].data.person.length == 0) {
              this.days[this.n[0].index].data.person.push({
                'name': this.addStock.name,
                'count': this.addStock.count 
              })
            } else {
              let person = [];
              this.days[this.n[0].index].data.person.forEach(list => {
                person.push({
                  'name': list.name,
                  'count': list.count
                })
              })
              person.push({
                'name': this.addStock.name,
                'count': this.addStock.count 
              })
              this.days[this.n[0].index].data.person = person;
            }
            this.$message.success('添加成功');
            this.n = [];
            this.dialogVisible = false
            this.addStock.name = '';
            this.addStock.count = '';
            this.$refs['addStock'].resetFields();
          }).catch(err => {
            console.log(err);
          })
        }
      })
    },
    clickStock(){
      if (this.n.length != 0) {
        this.dialogVisible = true
      } else {
        this.$message({
          message: '请先选择日期',
          type: 'warning'
        });
      }
    },
    // 点击日期的时候
    handleitemclick(day) {
      if (this.n.includes(day)) {
        this.n = this.n.filter(v => v != day);
      } else {
        this.n = [];
        day.name = day.day.getDay()
        this.n.push(day);
        if(this.dialogStock){
          this.n = [];
        }
      }
    },
    // 点击库存的时候
    countClick(data){
      this.dialogStock = true;
      this.addStocks.name = data.name;
      this.addStocks.count = data.count;
      this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/list', {
        "object": {
          "inventoryID": data.id,
          "loadPlan_Enroll": true
        }
      }).then(res => {
        console.log(res);
        this.planningInfo = [];
        this.planningInfo.push({
          
        })
      })
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
ul {
  list-style-type: none;
}
body {
  font-family: Verdana, sans-serif;
  background: #e8f0f3;
}
#calendar {
  /* margin: 37px auto 20px 340px; */
  /* width: 764px; */
  width: 600px;
  /* box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.1), */
    /* 0 1px 5px 0 rgba(0, 0, 0, 0.12); */
  /* padding: 10px; */
}
.clearfix:after{
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfix{
  zoom:1;
}
.month ul li {
  text-transform: uppercase;
  letter-spacing: 3px;
}
.month {
  width: 100%;
  color: #666;
  overflow: hidden;
  display: flex;
  margin-bottom: 20px;
  user-select:none;
}
.month ul {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}
.date {
  float: left;
}
.arrow {
  height: 40px;
  padding: 9px 10px;
  border: solid 1px #e6e6e6;
  cursor: pointer;
  font-size: 20px; 
  /* margin-top: 10px; */
}
.arrow:hover {
  border: solid 1px #409EFF;
  color: #409EFF;
}
.year-month {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 135px;
  border: solid 1px #e6e6e6;
  margin-left: 5px;
  margin-right: 5px;
}
.year-month:hover {
  /* background: rgba(150, 2, 12, 0.1); */
  border: solid 1px #409EFF;
  color: #409EFF;
}

.all-month{
  margin-left: 27px;
}
.checked {
  border: 1px solid red !important;
  box-sizing: border-box;
}
.days {
  width:730px;
  padding: 0;
  background: #ffffff;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-around; */
  user-select:none;
  border-left: solid 1px #E7E7E7;
}
.days li {
  min-height: 110px;
  text-align: left !important;
  padding: 5px;
  color: #666666;
  cursor: pointer;
}
.days li {
  list-style-type: none;
  display: inline-block;
  width: 104.14px;
  text-align: center;
  padding-bottom: 15px;
  padding-top: 15px;
  font-size: 1rem;
  color: #858585;
}
.days li .active {
  /* padding: 6px 10px;
  border-radius: 50%;
  background: #00b8ec;
  color: #fff; */
  color: #409EFF;
  font-weight:800
}
.days li .other-month {
  padding: 5px;
  color: gainsboro;
  display: none;
}
.days li:hover {
  background: #e1e1e1;
}
.weekdays{
  /* width:841px; */
  width: 730px;
  border-right: solid 1px #E7E7E7;
  margin: 0;
  /* padding: 10px 0; */
  padding: 0;
  height: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  user-select:none;  
}
.weekdays li .checkbox{
  margin-right: 10px;
  margin-top: 7px;
}
.weekdays li {
  border: solid 1px #E7E7E7;
  border-right: none;
  flex: 1;
  text-align: center;
  padding-top: 9px;
}
.addStorkInput{
  width: 300px;
}
.addStorkInputs{
  width: 240px;
}
.addStock-number{
  /* float: left; */
  margin: 0 0 0 10px;
}
.person {
  width:93px;
  height: 60px;
  margin-top: 10px;
  /* margin-left: 5px; */
  /* background: #f6f6f6;  */
}
.persons:hover{
  /* border: solid 1px red; */
  background: #fff;
}
.person p {
  color: #2c3e50;
  font-size: 12px;
  line-height: 8px;
}
.editStock{
  float: left;
}
.countStock{
  min-height: 60px;
  margin: -20px 0 0 -10px;
}
.surplus{
  float: left;
  margin: 10px 0 0 30px;
}
.surplus1{
  color: #CBCBCB;
}
.surplus2{
  margin-left: 10px;
  color: red;
}
.operation{
  float: left;
  margin: 10px 0 0 50px;
}
.operation2{
  margin-left: 10px;
}
.frameBottom{
  height: 40px;
  margin-top: 50px;
}
.frameBottom-delete{
  margin-left: 10px;
}
.frameBottom-right{
  float: right;
  margin-right: 10px;
}
.frameBottom-right button{
  width: 100px;
  margin-left: 20px;
}
.proList{
  background-color: #F6F6F6;
  margin: 5px 70px 0 12px;
  min-height: 265px;
  line-height: 45px;
}
.proListHeight{
  padding: 10px 0 0 30px;
}
.stockList{
  line-height: 60px;
}
.stockList div{
  margin-left: 10px;
}
</style>