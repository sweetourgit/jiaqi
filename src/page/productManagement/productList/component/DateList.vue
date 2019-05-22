<template>
  <div>
    
    <div class="leftSku" >
      <div style="font-size:20px;margin-left:40px;">Sku</div>
      <el-button style="margin-top:10px;margin-left:40px;width:220px;height: 64px;" :class="{'selectSku': ccc.includes(data.id)}" plain v-for="(data,index) in msgFather" :key="index"  @click="setMeal(data)">{{data.ddd}}</el-button>
      <!-- <div style="font-size:20px;margin-top:20px">附加增值服务</div>
      <el-button class="selectSku" plain v-for="(item,index) in Addprice" :key="item.id">{{item.name}}</el-button> -->
    </div>
    <div id="calendar" >
      <!-- 年份 月份 -->
      <div class="month">
        <ul class="date">
          <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
          <li class="arrow" @click="pickPre(currentYear,currentMonth)"><</li>
          <li class="year-month" >
            {{currentYear}}-{{currentMonth}}月
          </li>
          <li class="arrow" @click="pickNext(currentYear,currentMonth)">></li>
        </ul>
        <div class="all-month">
          <span @click="handleallclick" style="float:left;padding:10px 20px;margin-left:18px;cursor: pointer;">全月</span>
          <span @click="handleTwoClick" style="float:left;padding:10px 20px;margin-left:8px;cursor: pointer;">周六、日</span>
          <span @click="handleWeekClick" style="float:left;padding:10px 20px;margin-left:8px;cursor: pointer;">周一 ~ 周五</span>
          <span @click="clearchecked" style="float:left;padding:10px 20px;margin-left:8px;cursor: pointer;">全部清除</span>
          <template v-if="rightTable">
            <i style="float:left;padding:10px 10px;margin-left:25px;font-size:15px;font-style: normal;">已选{{n.length}}天</i>            
          </template>
        </div>
      </div>

      <!-- 星期 -->
      <ul class="weekdays">
        <li style="color:red"><el-checkbox v-model="sun" class="checkbox"></el-checkbox>日</li>
        <li><el-checkbox v-model="monday" class="checkbox"></el-checkbox>一</li>
        <li><el-checkbox v-model="tue" class="checkbox"></el-checkbox>二</li>
        <li><el-checkbox v-model="wed" class="checkbox"></el-checkbox>三</li>
        <li><el-checkbox v-model="tur" class="checkbox"></el-checkbox>四</li>
        <li><el-checkbox v-model="fri" class="checkbox"></el-checkbox>五</li>
        <li style="color:red"><el-checkbox v-model="sat" class="checkbox"></el-checkbox>六</li>
      </ul>

      <!-- 日期 -->
      <ul class="days">
        <!-- v-for循环 每一次循环用<li>标签创建一天 -->
        <template v-for="(dayobject,index) in days">
          <template v-if="dayobject.day.getMonth()+1 != currentMonth || dayobject.day.getTime() < today.getTime() - 24 * 60 * 60 * 1000">
            <li style="background: #F6F6F6;border: solid 1px #E7E7E7;border-left:none;border-top:none;cursor:not-allowed" :key="index" >
              <span class="isShare" v-if="dayobject.data.person.share == 1">共享</span>
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <div v-else>
                <!--今天  同年同月同日-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>
                
                <div class='person' v-for="(data, index) in dayobject.data.person.planEnroll" :key="index">
                  <p class='old'>{{data.name}}</p>
                  <p>销售价：{{data.salePrice}}</p>
                  <p>同业价：{{data.traderPrice}}</p>
                  <p>已售/库存：0/0</p>
                </div>
              </div>
              <!--显示剩余多少数量-->
              <!---->
            </li>
          </template>
          <template v-else>
            <li style="border: solid 1px #E7E7E7;border-left:none;border-top:none;"  :class="{'checked': n.includes(dayobject)}" @click="handleitemclick(dayobject, index)" :key="index" >
              <span class="isShare" v-if="dayobject.data.person.share == 1">共享</span>
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <div v-else>
                <!--今天  同年同月同日-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>
                <!--  -->
                  <div class='person' v-for="(data, index) in dayobject.data.person.planEnroll" :key="index">
                    <p class='old'>{{data.name}}</p>
                    <p>销售价：{{data.salePrice}}</p>
                    <p>同业价：{{data.traderPrice}}</p>
                    <p>已售/库存：0/0</p>
                  </div>
              </div>
              <!--显示剩余多少数量-->
            </li>
          </template>
        </template>
      </ul>

      <div class="ButtonCls">
        <el-button style="width:100px;" @click="BandCancel">取消</el-button>
        <el-button style="width:100px;" type="primary" @click="BandSave">保存</el-button>
      </div>

    </div>

    <!-- 右侧的表单 -->
    <div class="rightForm" v-show="rightTable">
      <!-- 表单 -->
      <el-form :model="Rform" :rules="RformRuler" ref="Rform">
        <el-form-item label="报名类型:">
          <el-select v-model="Rform.region" filterable placeholder="请选择" style="width:180px">
            <el-option
              v-for="(item, index) in typeSelect"
              :label="item.name"
              :value="item.id + '-' + item.name"
              :key="index">
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" @click="AddType">添加</el-button>
        </el-form-item>
        <el-form-item label="库存类型:" prop="resource">
          <el-radio-group v-model="Rform.resource" @change="xuanze('2')">
            <el-radio :disabled="forbidden" label="1">共享</el-radio>
            <el-radio  label="2">非共享</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 共享库存 -->
        <template  v-if='Rform.resource == "1"'>
          <el-form-item label="共享库存:" prop="shareId" style="margin-top:-15px;">
            <el-select v-model="Rform.shareId" placeholder="请选择" @change="shareSelect" style="width:180px">
              <el-option v-for="(item, index) in signUptypeSelect" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="Rform.shareId">
            <div><span>当前剩余:</span><span style="color:blue;margin-left:22px">{{Rform.shareNum}}</span></div>
          </template>
        </template>
        <!-- 非共享库存 -->
        <el-form-item label="总库存:" v-show='Rform.resource == "2"' prop="sumNum" style="margin-top:-15px;" >
          <el-input v-model="Rform.sumNum" style="width:200px;" ></el-input>
        </el-form-item>
        <el-form-item label="订单保留:" style="margin-top:20px">
          <el-select v-model="Rform.orderRetain" placeholder="请选择" style="width:180px">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 卡片 -->
      <template>
        <el-card class="box-card"  v-for="(item,index) in arr" :key="item.key">
          <div  slot="header" class="clearfix">
            <div class="fontName">
              <span>{{item.name}}</span>
            </div>
            <div style="float:right;margin-top: -25px;">
              <template v-if="arr[index].quota == false">
                <el-button @click="AddQuotas(index)"  type="primary" size="mini">添加配额</el-button>
              </template>
              <template v-else>
                <el-button @click="DelectQuota(index)"  type="primary" size="mini">删除配额</el-button>
              </template>
              <el-button type="primary" size="mini" @click="addQuota(item, index)">保存</el-button>
              <el-button @click="delect(item, index)"  type="danger" size="mini">删除</el-button>
            </div>
          </div>
          <div class="divform">
            <el-form ref="form" :model="item" :rules="formRuler"  label-width="80px">
              <el-form-item label="销售价" prop="salePrice">
                <el-input :maxlength='6' type='tel' v-model="item.salePrice"></el-input>
              </el-form-item>
              <el-form-item label="同业价" prop="traderPrice">
                <el-input :maxlength='6' v-model="item.traderPrice"></el-input>
              </el-form-item>
              <el-form-item label="配额" v-if="arr[index].quota == true">
                <el-input :maxlength='6' v-model="item.quotaPrice"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </template>
    </div>
  </div>

</template>

<script>
  export default {
    name:'DateList',
    props: ['msgFather', 'piapia'],
    mounted() {
      console.log("渲染");
    },
    updated() {},
    data() {
      return {
        today: new Date(),
        // 大表单
        Rform:{
          id: '',          // 计划id
          date: '',        // 日历时间
          region:'',       // 报名类型
          resource:'',     // 库存类型
          shareId:'',      // 共享库存id
          sumId: '',       // 非共享库存id
          shareNum: '',    // 共享库存数量
          sumNum:'',       // 总库存数量
          orderRetain: '', // 订单保留
        },
        form: {
          price: "",
          number: "",
          top: "",
          down: ""
        },
        monday: false,
        tue: false,
        wed: false,
        tur: false,
        fri: false,
        sat: false,
        sun: false,
        n: [], // 当前选择的日期
        share:false, // 共享或非公享第一次选择
        currentDay: 1,
        currentMonth: 1, // 当前月的月份
        currentYear: 1970, // 当前月的年份
        currentWeek: 1, // 当前月1号的星期
        rightTable:false, // 右侧的表单显示开关
        forbidden:false, // 多日期共享禁用
        days: [], // 日历上每日日期
        arr:[], // 右侧报名类型表单
        ccc: [], // sku套餐选择
        clickData: '', // 当前点击的日期
        // 非共享库存验证 
        RformRuler: {
          sumNum: [
            { required: true, message: '请填写库存'}
          ],
          shareId: [
            { required: true, message: '共享库存不能为空'}
          ],
          resource: [
            { required: true, message: '请选择库存类型'}
          ]
        },
        formRuler: {
          salePrice: [
            { required: true, message: '不能为空'}
          ],
          traderPrice: [
            { required: true, message: '不能为空'}
          ]
        },
        // 附加增值服务
        // Addprice:[{
        //   name:"保险",
        //   priceSelect:"非日历价格",
        //   explain:"保护安全",
        //   type:false,
        // }],
        typeSelect: [], // 报名类型选择
        signUptypeSelect:[] // 共享库存数据
      };
    },
    watch: {
      msgFather() {
        if (this.msgFather != '') {
          this.clearchecked();
          setTimeout(res => {
              // this.days.forEach(item => {
              //   item.data.person = {}
              // });
              this.ccc = [];
              this.ccc.push(this.msgFather[0].id);
              this.calendarList(this.ccc[0]);
            }, 100);
          }
      },
      // 筛选周一
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
              if(item.data.person.id == undefined){
                item.name = item.day.getDay();
                this.n.push(item);
              }
              // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
              //   this.n = [];
              //   this.forbidden = false;
              //   item.name = item.day.getDay();
              //   this.n.push(item);
              // }
              // item.name = 1
              // this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "2";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 1)
          this.n = name;
          if(this.n.length ==0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
          }
        }
        let ischecked = this.days
          .filter(item => item.day.getDay() === 1)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.day >= new Date());
      },
      // 筛选周二
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
              if(item.data.person.id == undefined){
                item.name = item.day.getDay();
                this.n.push(item);
              }
              // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
              //   this.n = [];
              //   this.forbidden = false;
              //   item.name = item.day.getDay();
              //   this.n.push(item);
              // }
              // item.name = 2
              // this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "2";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 2)
          this.n = name;
          if(this.n.length ==0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
          }
        }
      },
      // 筛选周三
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
              if(item.data.person.id == undefined){
                item.name = item.day.getDay();
                this.n.push(item);
              }
              // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
              //   this.n = [];
              //   this.forbidden = false;
              //   item.name = item.day.getDay();
              //   this.n.push(item);
              // }
              // item.name = 3
              // this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "2";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 3)
          this.n = name;
          if(this.n.length ==0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
          }
        }
      },
      // 筛选周四
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
              if(item.data.person.id == undefined){
                item.name = item.day.getDay();
                this.n.push(item);
              }
              // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
              //   this.n = [];
              //   this.forbidden = false;
              //   item.name = item.day.getDay();
              //   this.n.push(item);
              // }
              // item.name = 4
              // this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "2";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 4)
          this.n = name;
          if(this.n.length ==0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
          }
        }
      },
      // 筛选周五
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
              if(item.data.person.id == undefined){
                item.name = item.day.getDay();
                this.n.push(item);
              }
              // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
              //   this.n = [];
              //   this.forbidden = false;
              //   item.name = item.day.getDay();
              //   this.n.push(item);
              // }
              // item.name = 5
              // this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "2";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 5)
          this.n = name;
          if(this.n.length ==0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
          }
        }
      },
      // 筛选周六
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
              if(item.data.person.id == undefined){
                item.name = item.day.getDay();
                this.n.push(item);
              }
              // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
              //   this.n = [];
              //   this.forbidden = false;
              //   item.name = item.day.getDay();
              //   this.n.push(item);
              // }
              // item.name = 6
              // this.n.push(item);
              if(this.n.length != 0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "2";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 6)
          this.n = name;
          if(this.n.length == 0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
          }
        }
      },
      // 筛选周天
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
              if(item.data.person.id == undefined){
              item.name = item.day.getDay();
              this.n.push(item);
            }
            // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
            //   this.n = [];
            //   this.forbidden = false;
            //   item.name = item.day.getDay();
            //   this.n.push(item);
            // }
              // item.name = 0
              // this.n.push(item);
              if(this.n.length != 0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "2";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 0)
          this.n = name;
          if(this.n.length == 0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
          }
        }
      }
    },
    created: function() {
      // 在vue初始化时调用
      this.initData(null);
      
      // 判断是否点击套餐
      if (this.piapia == '') {
        this.ccc = [];
        this.ccc.push(this.msgFather[0].id);
      } else {
        this.ccc = [];
        this.ccc.push(this.piapia);
      }
      this.calendarList(this.ccc[0]);
      // 获取报名类型数据
      this.initTypeSelect();
    },
    methods: {
      // 按套餐获取计划
      calendarList(id) {
        this.clearNull();
        let currentMonth = this.currentMonth;
        if (currentMonth < 10) currentMonth = "0" + currentMonth;
        this.$http.post(this.GLOBAL.serverSrc + '/team/calendar/api/get', {
          "object": {
            "year": this.currentYear,
            "month": currentMonth,
            "packageID": id
          }
        }).then(res => {
          this.days.forEach(item => {
            let str = this.formatDates(
              item.day.getFullYear(),
              item.day.getMonth() + 1,
              item.day.getDate()
            )
            // 清空日历里报名类型
            item.data.person = {};
            res.data.objects.forEach(items => {
              if (str == items.date) {
                let plan_Enrolls = [];
                if (items.plan_Enrolls != '') {
                  items.plan_Enrolls.forEach(list => {
                    plan_Enrolls.push({
                      'id': list.id,
                      'enrollID': list.enrollID,
                      'name': list.enrollName,
                      'salePrice': list.price_01,
                      'traderPrice': list.price_02,
                      'quotaPrice': list.quota
                    })
                  })
                }
                item.data.person = {
                  'id': items.planID,
                  'packageID': items.packageID,
                  'share': items.share,
                  'date': str,
                  'planEnroll': plan_Enrolls
                }
              }
            })
          })
          this.n = [];
        })
        // this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/list', {
        //   "object": {
        //     "loadPlan_Enroll": true,
        //     "packageID": id
        //   }
        // }).then(res => {
        //   this.days.forEach(item => {
        //     // if(item.day.getTime() > new Date().getTime() || item.day.getDate() == new Date().getDate()){
        //     //   if(item.day.getMonth() + 1 == this.currentMonth){
                
        //     //   }
        //     // }
        //     let str = this.formatDates(
        //           item.day.getFullYear(),
        //           item.day.getMonth() + 1,
        //           item.day.getDate()
        //         )
        //     item.data.person = {};
        //     res.data.objects.forEach(items => {
        //       if (str == items.date) {
        //         let planEnroll = [];
        //         items.planEnroll.forEach(list => {
        //         planEnroll.push({
        //           'id': list.id,
        //           'enrollID': list.enrollID,
        //           'name': list.enrollName,
        //           'salePrice': list.price_01,
        //           'traderPrice': list.price_02,
        //           'quotaPrice': list.quota
        //         })
        //       })
        //         item.data.person = {
        //           'id': items.id,
        //           'inventoryID': items.inventoryID,
        //           'packageID': items.packageID,
        //           'planEnroll': planEnroll
        //         }
        //       }
        //     })



        //     // let str = this.formatDates(
        //     //       item.day.getFullYear(),
        //     //       item.day.getMonth() + 1,
        //     //       item.day.getDate()
        //     //     )
        //     //     item.data.person = {};
        //     //     res.data.objects.forEach(items => {
        //     //       if(str == items.date){
        //     //         let planEnroll = [];
        //     //         items.planEnroll.forEach(list => {
        //     //           planEnroll.push({
        //     //             'id': list.id,
        //     //             'enrollID': list.enrollID,
        //     //             'name': list.enrollName,
        //     //             'salePrice': list.price_01,
        //     //             'traderPrice': list.price_02,
        //     //             'quotaPrice': list.quota
        //     //           })
        //     //         })
        //     //         // 查找库存信息
        //     //         this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryget', {
        //     //           "id": items.inventoryID
        //     //         }).then(resList => {
        //     //           item.data.person = {
        //     //             'id': items.id,
        //     //             'inventoryID': items.inventoryID,
        //     //             'share': resList.data.object.share,
        //     //             'count': resList.data.object.count,
        //     //             'packageID': items.packageID,
        //     //             'planEnroll': planEnroll
        //     //           }
        //     //           this.n = [];
        //     //         }).catch(errList => {
        //     //           console.log('查找库存信息失败');
        //     //         })
        //     //       }
        //     //     })
        //   })
        //   this.n = [];
        // })
      },
      // 非共享库存修改
      saveQuota(list, data, inventoryID, row, sumId) {
        let planEnroll = [];
        let isSave = true; // 是否编辑判断
        if (list.data.person.planEnroll.length != 0 ) {
          list.data.person.planEnroll.forEach(item => {
            let quotaPrice = '';
            if (item.enrollID == data.id && item.name == data.name){
              if (data.quotaPrice == '') {
                quotaPrice = 0;
              } else {
                quotaPrice = data.quotaPrice;
              }
              planEnroll.push({
                'enrollID': data.id,
                'enrollName': data.name,
                'price_01': data.salePrice,
                'price_02': data.traderPrice,
                'quota': quotaPrice
              })
              isSave = false;
            } else {
              if (item.quotaPrice == '') {
                quotaPrice = 0;
              } else {
                quotaPrice = item.quotaPrice;
              }
              planEnroll.push({
                'enrollID': item.enrollID,
                'enrollName': item.name,
                'price_01': item.salePrice,
                'price_02': item.traderPrice,
                'quota': item.quotaPrice
              })
            }
          })
        }
        let quotaPrice = '';
        if (data.quotaPrice == '') {
          quotaPrice = 0;
        } else {
          quotaPrice = data.quotaPrice;
        }
        if (isSave) {
          planEnroll.push({
            'enrollID': data.id,
            'enrollName': data.name,
            'price_01': data.salePrice,
            'price_02': data.traderPrice,
            'quota': quotaPrice
          })
        }
        // 查到非共享库存后执行修改计划
        this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/save', {
          "object": {
            "id": this.Rform.id,
            "inventoryID": inventoryID,
            "packageID": this.ccc[0],
            "planEnroll": planEnroll,
            "date": this.Rform.date,
            "groupCode": this.msgFather[0].codePrefix + '-' + list.data.person.date + '-' + this.msgFather[0].codeSuffix,
          }
        }).then(resSave => {
          let planEnrolls = [];
          planEnroll.forEach(delid => {
            planEnrolls.push({
              'enrollID': delid.enrollID,
              'name': delid.enrollName,
              'salePrice': delid.price_01,
              'traderPrice': delid.price_02,
              'quotaPrice': delid.quota
            })
          })
          this.days[list.index].data.person = {
            "id": this.Rform.id,
            "inventoryID": inventoryID,
            "packageID": this.ccc[0],
            "share": this.Rform.resource,
            "planEnroll": planEnrolls,
            "date": this.Rform.date
          }
          let n = [];
          n = this.days[list.index];
          this.n = [];
          this.n.push(n);
          this.$message.success('修改成功');
          if (row) {
            // 修改成功后删除非共享库存
            this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorydelete', {
              "id": sumId
            }).then(resDelete => {
              
            }).catch(errDelete => {
              console.log('删除非共享库存失败');
            })
          }
        }).catch(errSave => {
          console.log('修改非共享库存失败');
        })
      },
      // 报名类型保存之后
      addQuota(data, index) {
        // 有值执行修改操作
        if (this.Rform.id) {
          if (this.Rform.resource == '2') { // 2为非共享库存
            // 验证是否填写总库存
            if (this.Rform.sumNum != '') {
              this.$refs['form'][index].validate(valid => {
                if (valid) {
                  if (this.Rform.sumId) {
                    this.saveQuota(this.n[0], data, this.Rform.sumId);
                  } else {
                    // 添加非共享库存
                    this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryinsert', {
                      "object": {
                        "name": '',
                        "count": this.Rform.sumNum,
                        "share": 2,
                        "date": this.Rform.date
                      }
                    }).then(res => {
                      // 添加完成后传入添加后的id
                      this.saveQuota(this.n[0], data, res.data.id);
                    }).catch(err => {
                      console.log('添加非共享库存失败');
                    })
                  }
                }
              })
            } else {
              this.$refs['Rform'].validateField('sumNum');
            }
          } else if (this.Rform.resource == '1') { // 1为共享库存
            // 验证是否选择共享库存
            if (this.Rform.shareId != '') {
              this.$refs['form'][index].validate(valid => {
                if(valid) {
                  if (!this.Rform.sumId) { // 原数据为非共享库存时则删除原非共享库存
                    this.saveQuota(this.n[0], data, this.Rform.shareId);
                  } else {
                    this.saveQuota(this.n[0], data, this.Rform.shareId, 'delete', this.Rform.sumId);
                  }
                }
              })
            } else {
              this.$refs['Rform'].validateField('shareId');
            }
          }
        } else { // 没值执行添加操作
          // 验证库存类型是否选择
          if (this.Rform.resource != '') {
            // 选择的是非共享库存
            if (this.Rform.resource == '2') {
              // 验证是否填写总库存
              if (this.Rform.sumNum != '') {
                 this.$refs['form'][index].validate(valid => {
                   if (valid) {
                      let n = [];
                      this.n.forEach(item => {
                        // 第一次添加时
                        if (this.days[item.index].data.person.planEnroll == undefined) {
                          let planEnroll = [];
                          planEnroll.push({
                            'enrollID': data.id,
                            'name': data.name,
                            'salePrice': data.salePrice,
                            'traderPrice': data.traderPrice,
                            'quotaPrice': data.quotaPrice
                          })
                          let date = this.formatDates(
                            item.day.getFullYear(),
                            item.day.getMonth() + 1,
                            item.day.getDate()
                          )
                          this.days[item.index].data.person = {
                              'inventoryID': '',
                              'packageID': this.ccc[0],
                              'date': date,
                              'count': this.Rform.sumNum,
                              'share': this.Rform.resource,
                              'planEnroll': planEnroll
                            }
                            n.push(this.days[item.index]);
                        } else {
                          let date = this.formatDates(
                            item.day.getFullYear(),
                            item.day.getMonth() + 1,
                            item.day.getDate()
                          )
                          let planEnroll = [];
                          let isSave = true; // 是否编辑判断
                          this.days[item.index].data.person.planEnroll.forEach(list => {
                            if (list.enrollID == data.id && list.name == data.name) {
                              planEnroll.push({
                                'enrollID': data.id,
                                'name': data.name,
                                'salePrice': data.salePrice,
                                'traderPrice': data.traderPrice,
                                'quotaPrice': data.quotaPrice
                              })
                              isSave = false;
                            } else {
                              planEnroll.push({
                                'enrollID': list.enrollID,
                                'name': list.name,
                                'salePrice': list.salePrice,
                                'traderPrice': list.traderPrice,
                                'quotaPrice': list.quotaPrice
                              })
                            }
                          })
                          if (isSave) {
                            planEnroll.push({
                              'enrollID': data.id,
                              'name': data.name,
                              'salePrice': data.salePrice,
                              'traderPrice': data.traderPrice,
                              'quotaPrice': data.quotaPrice
                            })
                          }
                          this.days[item.index].data.person = {
                            'inventoryID': this.Rform.shareId,
                            'packageID': this.ccc[0],
                            'date': date,
                            'share': this.Rform.resource,
                            'count': this.Rform.sumNum,
                            'planEnroll': planEnroll
                          }
                          n.push(this.days[item.index]);
                        }
                      })
                      this.n = [];
                      this.n = n;
                   }
                 })
              } else {
                this.$refs['Rform'].validateField('sumNum');
              }
            } else if (this.Rform.resource == '1') {  // 选择的是共享库存
              // 验证是否选择共享库存
              if (this.Rform.shareId != '') {
                this.$refs['form'][index].validate(valid => {
                  if (valid) {
                    let planEnroll = [];
                    let date = this.formatDates(
                          this.n[0].day.getFullYear(),
                          this.n[0].day.getMonth() + 1,
                          this.n[0].day.getDate()
                        )
                    if (this.days[this.n[0].index].data.person.planEnroll == undefined) {
                      planEnroll.push({
                        'enrollID': data.id,
                        'name': data.name,
                        'salePrice': data.salePrice,
                        'traderPrice': data.traderPrice,
                        'quotaPrice': data.quotaPrice
                      })
                    } else {
                      let isSave = true; // 是否编辑判断
                      this.days[this.n[0].index].data.person.planEnroll.forEach(item => {
                        if (item.enrollID == data.id && item.name == data.name) {
                          planEnroll.push({
                            'enrollID': data.id,
                            'name': data.name,
                            'salePrice': data.salePrice,
                            'traderPrice': data.traderPrice,
                            'quotaPrice': data.quotaPrice
                          })
                          isSave = false;
                        } else {
                          planEnroll.push({
                            'enrollID': item.enrollID,
                            'name': item.name,
                            'salePrice': item.salePrice,
                            'traderPrice': item.traderPrice,
                            'quotaPrice': item.quotaPrice
                          })
                        }
                      })
                      if (isSave) {
                        planEnroll.push({
                          'enrollID': data.id,
                          'name': data.name,
                          'salePrice': data.salePrice,
                          'traderPrice': data.traderPrice,
                          'quotaPrice': data.quotaPrice
                        })
                      }
                    }
                    this.days[this.n[0].index].data.person = {
                      'inventoryID': this.Rform.shareId,
                      'share': this.Rform.resource,
                      'packageID': this.ccc[0],
                      'count': this.Rform.shareNum,
                      'date': date,
                      'planEnroll': planEnroll
                    }
                    let n = [];
                    n = this.days[this.n[0].index];
                    this.n = [];
                    this.n.push(n);
                  }
                })
              } else {
                this.$refs['Rform'].validateField('shareId');
              }
            }
          } else {
            this.$refs['Rform'].validateField('resource');
          }
        }
        // // 删除右侧表单
        // this.arr.splice(index,1);
      },
      // 筛选周六周日按钮
      handleTwoClick() {
        this.n = [];
        this.clearNull();
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
            if (item.data.person.id == undefined) {
              item.name = item.day.getDay();
              this.n.push(item);
            }
            // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
            //   this.n = [];
            //   this.forbidden = false;
            //   item.name = item.day.getDay();
            //   this.n.push(item);
            // }
            if (this.n.length == 0) {
              this.rightTable = false;
            }
            if (this.n.length != 0) {
              this.rightTable = true;
            }
            // 当选中的日期大于一天的时候默认为"非公享"
            if (this.n.length > 1) {
              this.forbidden = true;
              this.Rform.resource = "2";
            }
          }
        });
      },
      // 筛选周一至周五
      handleWeekClick() {
        this.n = [];
        this.clearNull();
        const now = new Date().getTime();
        const today = new Date().getDate();
        const week = this.days
          .filter(item => item.day.getDay() != 6 && item.day.getDay() != 0)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(
            item => item.day.getTime() > now || item.day.getDate() == today
          );
        week.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            if (item.data.person.id == undefined) {
              item.name = item.day.getDay();
              this.n.push(item);
            }
            // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
            //   this.n = [];
            //   this.forbidden = false;
            //   item.name = item.day.getDay();
            //   this.n.push(item);
            // }
            if (this.n.length == 0) {
              this.rightTable = false;
            }
            if (this.n.length != 0) {
              this.rightTable = true;
            }
            // 当选中的日期大于一天的时候默认为"非公享"
            if (this.n.length > 1) {
              this.forbidden = true;
              this.Rform.resource = "2";
            }
          }
        });
      },
      // 筛选全月
      handleallclick() {
        this.n = [];
        this.clearNull();
        const now = new Date().getTime();
        const today = new Date().getDate();
        const newAll = this.days
          .filter(item => item.day.getTime() > now || item.day.getDate() == today)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth);
        newAll.forEach(item => {
          if (this.n.includes(item)) {
            return;
          } else {
            if (item.data.person.id == undefined) {
              item.name = item.day.getDay();
              this.n.push(item);
            }
            // if(item.data.person.id !== undefined || this.n[0].data.person.id !== undefined){
            //   this.n = [];
            //   this.forbidden = false;
            //   item.name = item.day.getDay();
            //   this.n.push(item);
            // }
            if (this.n.length == 0) {
              this.rightTable = false;
            }
            if (this.n.length != 0) {
              this.rightTable = true;
            }
            // 当选中的日期大于一天的时候默认为"非公享"
            if (this.n.length > 1) {
              this.forbidden = true;
              this.Rform.resource = "2";
            }
          }
        });
      },
      // 全部清除
      clearchecked() {
        this.clearNull();
        this.n = [];
        this.monday = false;
        this.tue = false;
        this.fri = false;
        this.tur = false;
        this.sun = false;
        this.wed = false;
        this.sat = false;
        if(this.n.length == 0){
          this.rightTable = false;
        }
      },
      // 清空表单里的值(计划)
      clearNull() {
        this.arr = [];
        this.Rform = {
          id: '',       // 计划id
          date: '',     // 日历时间
          region:'',    // 报名类型
          resource:'',  // 库存类型
          sumId: '',    // 非共享库存id
          shareNum: '', // 共享库存数量
          shareId:'',   // 共享库存
          sumNum:'',    // 总库存
        };
        // 清空表单验证样式
        if (this.$refs['Rform'] != undefined) {
          this.$refs['Rform'].resetFields();
        }
      },
      // 点击日期的时候
      handleitemclick(day, index) {
        // 取消选择时
        if (this.n.includes(day)) {
          this.n = this.n.filter(v => v != day);
          if (this.n.length == 0) {
            this.share = false;
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if (this.n.length < 2) {
            this.forbidden = false;
            this.Rform.resource = "";
          }
          // 当前点击一个日期时
          if (this.n.length == 1) {
            this.clickData = this.formatDates(
              this.n[0].day.getFullYear(),
              this.n[0].day.getMonth() + 1,
              this.n[0].day.getDate()
            )
          }
        // 选择时
        } else {
          this.clearNull();
          if (this.n.length == 0 || day.data.person.id == undefined) {
            this.forbidden = false;
            day.name = day.day.getDay();
            day.index = index;
            this.n.push(day);
          }
          if (day.data.person.id != undefined || this.n[0].data.person.id != undefined) {
            this.n = [];
            this.forbidden = false;
            day.name = day.day.getDay();
            this.n.push(day);
          }
          if (this.n.length != 0) {
            this.rightTable = true;
          }
          // 当选中的日期大于一天的时候默认为"非公享"
          if (this.n.length > 1) {
            this.forbidden = true;
            this.Rform.resource = "2";
          } else {
            // 当前点击一个日期时
            this.clickData = this.formatDates(
              day.day.getFullYear(),
              day.day.getMonth() + 1,
              day.day.getDate()
            )
          }
          // 选中的日期有类型时进行赋值
          if (day.data.person.id != undefined) {
            this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/get', {
              "id": day.data.person.id
            }).then(res => {
              day.data.person.inventoryID = res.data.object.inventoryID;
              this.$http.post(this.GLOBAL.serverSrc +  '/team/api/inventoryget', {
                "id": res.data.object.inventoryID
              }).then(inventoryRes => {
                day.data.person.count = inventoryRes.data.object.count;
                this.Rform.resource = String(day.data.person.share);
                this.xuanze(this.Rform.resource);
                if (this.Rform.resource == 1) {
                  // 共享库存数量
                  this.Rform.shareNum = day.data.person.count;
                  // 共享库存ID
                  this.Rform.shareId = res.data.object.inventoryID;
                } else {
                  // 非共享库存数量
                  this.Rform.sumNum = day.data.person.count;
                  // 非共享库存ID
                  this.Rform.sumId = res.data.object.inventoryID;
                }
                this.Rform.id = day.data.person.id;
                this.Rform.date = this.formatDates(
                  day.day.getFullYear(),
                  day.day.getMonth() + 1,
                  day.day.getDate()
                )
                // 给选中类型赋值
                this.selectType(day);
              })
            })
          } else if (day.data.person.packageID != undefined) {
            this.Rform.resource = day.data.person.share;
            this.xuanze(this.Rform.resource);
            if (this.Rform.resource == 1) {
              // 共享库存数量
              this.Rform.shareNum = day.data.person.count;
              // 共享库存ID
              this.Rform.shareId = day.data.person.inventoryID;
            } else {
              // 非共享库存数量
              this.Rform.sumNum = day.data.person.count;
              // 非共享库存ID
              this.Rform.sumId = day.data.person.inventoryID;
            }
            // 给选中类型赋值
            this.selectType(day);
          }
        }
      },
      // 单击日历赋值调用
      selectType(day) {
        // 给选中类型赋值
        let _planEnroll = day.data.person.planEnroll; 
        for (let i = 0; i < _planEnroll.length; i++) {
          this.Rform.region = _planEnroll[i].enrollID + '-' + _planEnroll[i].name;
          this.AddType();
          if (this.arr[i].id == _planEnroll[i].enrollID && this.arr[i].name == _planEnroll[i].name) {
            this.arr[i].isModify = true;
            this.arr[i].salePrice = _planEnroll[i].salePrice;
            this.arr[i].traderPrice = _planEnroll[i].traderPrice;
            if (_planEnroll[i].quotaPrice == null || _planEnroll[i].quotaPrice == 0) {
              this.arr[i].quota = false;
              this.arr[i].quotaPrice = '';
            } else {
              this.arr[i].quota = true;
              this.arr[i].quotaPrice = _planEnroll[i].quotaPrice;
            }
            
          }
        }
      },
      initData(cur) {
        var leftcount = 0; //存放剩余数量
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
          // var now = new Date();
          // var d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1));
          // d.setDate(35);
          // date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
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
        // 初始化本周
        for (var i = this.currentWeek; i >= 0; i--) {
          var d = new Date(str);
          d.setDate(d.getDate() - i);
          var dayobject = {};
          dayobject.day = d;
          dayobject.index = this.days.length;
          this.days.push(dayobject); // 将日期放入data 中的days数组 供页面渲染使用
          // console.log(this.days)
        }
        // 其他周
        for (var i = 1; i <= 41 - this.currentWeek; i++) {
          var d = new Date(str);
          d.setDate(d.getDate() + i);
          var dayobject = {};
          dayobject.day = d;
          dayobject.index = this.days.length;
          this.days.push(dayobject);
          this.days.map(item => (item.data = { person: {}, children: {} }));
        }
      },
      // 点击上个月
      pickPre(year, month) {
        // setDate(0); 上月最后一天
        // setDate(-1); 上月倒数第二天
        // setDate(dx) 参数dx为 上月最后一天的前后dx天
        if (
          this.today.getMonth() + 1 < this.currentMonth ||
          this.today.getFullYear() < this.currentYear
        ) {
          this.clearchecked();
          var d = new Date(this.formatDate(year, month, 1));
          d.setDate(0);
          this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
          this.calendarList(this.ccc[0]);
          this.n = [];
        } else {
          // alert("不能选择以前的");
          this.$message({
            message: '不能选择以前的',
            type: 'warning'
          });
        }
      },
      // 点击下个月
      pickNext(year, month) {
        this.clearchecked();
        var d = new Date(this.formatDate(year, month, 1));
        d.setDate(35);
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        this.calendarList(this.ccc[0]);
        this.n = [];
      },
      // 返回 类似 2016-01-02 格式的字符串
      formatDate(year, month, day) {
        var y = year;
        var m = month;
        if (m < 10) m = "0" + m;
        var d = day;
        if (d < 10) d = "0" + d;
        return y + "-" + m + "-" + d;
      },
      // 返回 20180102 格式的字符串
      formatDates(y, m, d) {
        if (m < 10) m = "0" + m;
        if (d < 10) d = "0" + d;
        return y + '' + m + '' + d;
      },
      // 获取共享库存
      listData() {
        this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorylist', {
          "object": {
            "share": 1,
            "date": this.clickData
          }
        }).then(res => {
          this.signUptypeSelect = [];
          res.data.objects.forEach(item => {
            this.signUptypeSelect.push({
              "id": item.id,
              "name": item.name,
              "count": item.count
            })
          })
        }).catch(err => {
          console.log('共享库存获取失败');
        })
      },
      // 选择库存类型
      xuanze(z) {
        if (this.Rform.resource == '1') {
          this.listData();
        }
        // 传入的值
        if (z == '1') {
          if (this.Rform.resource == '1') {
            this.listData();
          }
        // 手动选择的值
        } else if (z == '2' && this.Rform.shareId != '' || this.Rform.sumNum != '') {
          this.$confirm('当前类型数据将重置，是否更改?', '更改库存类型', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(this.Rform.resource == '1'){
              this.listData();
              this.Rform.sumNum = '';
            } else {
              this.Rform.shareId = '';
              this.Rform.shareNum = '';
            }
          }).catch(() => {
            if (this.Rform.resource == '1') {
              this.Rform.resource = '2'
            } else {
              this.Rform.resource = '1'
            }
          })
        }
      },
      // 选择共享库存时获取该库存下的剩余库存数量
      shareSelect() {
        let shareID = this.signUptypeSelect.filter(item => item.id == this.Rform.shareId);
        this.Rform.shareNum = shareID[0].count;
      },
      // 添加报名类型
      AddType(type) {
        if (this.Rform.region) {
          let mon = true;
          if (this.arr.length !== 0) {
            this.arr.forEach(item => {
              if (item.id + '-' + item.name == this.Rform.region) {
                mon = false;
              }
            })
          }
          if (mon) {
            let id = this.Rform.region.substring(0, this.Rform.region.indexOf('-'));
            let name = this.Rform.region.substring(this.Rform.region.lastIndexOf('-') + 1, this.Rform.region.length);
            this.arr.push({
              'id': id,
              'name': name,
              'isModify': false, // 计划id
              'salePrice': '',   // 销售价
              'traderPrice': '', // 同业价
              'quota': false,    // 配额开关
              'quotaPrice': ''   // 配额
            })
          } else {
            this.$message({
              message: '已存在该报名类型',
              type: 'warning'
            });
          }
        } else {
          this.$message({
            message: '请先选择报名类型',
            type: 'warning'
          });
        }
        
      },
      // 删除卡片
      delect(item, index) {
        let _n = this.n[0];
        if (item.isModify) {
          if (_n.data.person.planEnroll.length <= 1) {
            console.log('剩一个类型时');
            // 删除最后一个类型时删除该计划
            this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/delete', {
                "id": this.Rform.id
            }).then(res => {
              console.log(res);
            })
          } else {
            this.arr.splice(index,1);
            let planEnroll = [];
            this.arr.forEach(data => {
              planEnroll.push({
                'enrollID': data.id,
                'enrollName': data.name,
                'price_01': data.salePrice,
                'price_02': data.traderPrice,
                'quota': data.quotaPrice
              })
            })
            // 有两个及以上的值删除调用修改接口
            this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/save', {
              "object": {
                "id": this.Rform.id,
                "inventoryID": _n.data.person.inventoryID,
                "packageID": this.ccc[0],
                "date": this.Rform.date,
                "planEnroll": planEnroll
              }
            }).then(res => {
              this.days[_n.index].data.person.planEnroll.splice(index,1);
              let n = [];
              n = this.days[_n.index];
              this.n = [];
              this.n.push(n);
              this.$message.success('删除成功');
            }).catch(err => {
              console.log('删除(修改)计划失败');
            })
          }
        } else {
          this.arr.splice(index,1);
          this.days[_n.index].data.person.planEnroll.splice(index,1);
          let n = [];
          n = this.days[_n.index]
          this.n = [];
          this.n.push(n);
          if (_n.data.person.planEnroll.length <= 1) {
            this.days[_n.index].data.person.share = '';
          }
        }
        // this.arr.splice(index,1);
      },
      // 添加配额
      AddQuotas(index){
        this.arr[index].quota = true;
      },
      // 删除配额
      DelectQuota(index){
        this.arr[index].quota = false;
        this.arr[index].quotaPrice = '';
      },
      // 价格弹窗取消
      BandCancel() {
        this.$emit("merchandises", false);
      },
      // 计划(价格)弹窗保存
      BandSave() {
        let now = new Date().getTime();
        let today = new Date().getDate();
        let newAll = this.days
          .filter(item => item.day.getTime() > now || item.day.getDate() == today)
          .filter(item => item.day.getMonth() + 1 == this.currentMonth)
          .filter(item => item.data.person.inventoryID != undefined && item.data.person.id == undefined);
        if (newAll.length == 0) {
          this.$message({
            message: '没有可供保存的计划',
            type: 'warning'
          });
        } else {
          newAll.forEach(item => {
            let planEnroll = [];
            if (item.data.person.planEnroll.length != 0 ) {
              item.data.person.planEnroll.forEach(list => {
                let quotaPrice = '';
                // 判断是否填写配额
                if (list.quotaPrice == '') {
                  quotaPrice = 0;
                } else {
                  quotaPrice = list.quotaPrice;
                }
                planEnroll.push({
                  'enrollID': list.enrollID,
                  'enrollName': list.name,
                  'price_01': list.salePrice,
                  'price_02': list.traderPrice,
                  'quota': quotaPrice
                })
              })
            }
            if (item.data.person.inventoryID == '') {
              // 添加非共享库存
              this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryinsert', {
                "object": {
                  "name": '',
                  "count": item.data.person.count,
                  "share": 2,
                  "date": item.data.person.date
                }
              }).then(res => {
                this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/insert', {
                  "object": {
                    "inventoryID": res.data.id,
                    "packageID": item.data.person.packageID,
                    "date": item.data.person.date,
                    "groupCode": this.msgFather[0].codePrefix + '-' + item.data.person.date + '-' + this.msgFather[0].codeSuffix,
                    "planEnroll": planEnroll
                  }
                }).then(resAdd => {
                  // 添加成功后从新查找
                  this.calendarList(this.ccc[0]);
                }).catch(errAdd => {
                  console.log('添加计划失败');
                })
              }).catch(err => {
                console.log('共享库存添加失败');
              })
            } else {
              this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/insert', {
                "object": {
                  "inventoryID": item.data.person.inventoryID,
                  "packageID": item.data.person.packageID,
                  "date": item.data.person.date,
                  "groupCode": this.msgFather[0].codePrefix + '-' + item.data.person.date + '-' + this.msgFather[0].codeSuffix,
                  "planEnroll": planEnroll
                }
              }).then(res => {
                // 添加成功后从新查找
                this.calendarList(this.ccc[0]);
              }).catch(err => {
                console.log('添加计划失败');
              })
            }
          })
          this.clearNull();
          this.n = [];
          this.rightTable = false;
          this.$message.success('添加成功');
        }
      },
      // 点击套餐Sku
      setMeal(data){
        if (data.codePrefix != '' && data.codeSuffix != '') {
          let id = '';
          if (data.id == undefined) {
            id = data;
          } else {
            id = data.id;
          }
          // 多日期共享禁用
          this.forbidden = false;
          // 右侧表单显示
          this.rightTable = false;
          this.Rform = {
            id: '',       // 计划id
            date: '',     // 日历时间
            region:'',    // 报名类型
            resource:'',  // 库存类型
            sumId: '',    // 非共享库存id
            shareNum: '', // 共享库存数量
            shareId:'',   // 共享库存
            sumNum:'',    // 总库存
          };
          this.arr = [];
          this.ccc = [];
          this.ccc.push(id);
          this.calendarList(this.ccc[0]);
        } else {
          this.$message({
            message: '该计划没有团号',
            type: 'warning'
          });
        }
        
      },
      // 获取报名类型
      initTypeSelect() {
        // 获取类型A
        this.$http.post(this.GLOBAL.serverSrc + '/universal/enrolla/api/list', {
           "object": {}
        }).then(resa => {
          // 获取类型B
          this.$http.post(this.GLOBAL.serverSrc + '/universal/enrollb/api/list', {
            "object": {}
          }).then(resb => {
            resa.data.objects.forEach(itema => {
              resb.data.objects.forEach(itemb => {
                this.typeSelect.push({
                  "id": itema.id,
                  "name": itema.name + itemb.name
                })
              })
            })
          }).catch(errb => {
            console.log(errb);
          })
        }).catch(erra => {
          console.log(erra);
        })
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .person {
    width:100px;
    margin-top: 10px;
    background: #f6f6f6; 
  }
  .person p {
    color: #2c3e50;
    font-size: 12px;
    line-height: 20px;
  }
  .person .old {
    border-bottom: 1px solid #3096fb;
    color: #e6e6e6;
    height: 24px;
    background:#3096fb;
  }
  .days li {
    min-height: 135px;
    text-align: left !important;
    padding: 5px;
    color: #666666;
    cursor: pointer;
  }
  p {
    margin: 0;
  }
  .checked {
    border: 1px solid red !important;
    box-sizing: border-box;
  }
  .all-month {
    flex: 1;
  }
  .all-month span:hover {
    /* background: rgba(150, 2, 12, 0.1); */
    border: solid 1px #409EFF;
    color: #409EFF;
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
    float: left;
    margin: 37px auto 20px 273px;
    width: 764px;
    /* box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.1), */
    /* 0 1px 5px 0 rgba(0, 0, 0, 0.12); */
    /* padding: 10px; */
  }
  .box-card {
    /* position: absolute; */
    /* right: -340px; */
    width: 339px;
    /* top: 170px; */
    margin-top: 10px;
  }
  .box-card2 {
    position: absolute;
    right: -340px;
    width: 339px;
    top: 400px;
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
  .all-month span {
    border: solid 1px #e6e6e6;
  }
  .year-month:hover {
    /* background: rgba(150, 2, 12, 0.1); */
    border: solid 1px #409EFF;
    color: #409EFF;
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
    height: 40px;
    padding: 5px 10px;
    border: solid 1px #e6e6e6;
    cursor: pointer;
    font-size: 20px;
    /* margin-top: 10px; */
  }
  .arrow:hover {
    /* background: rgba(100, 2, 12, 0.1); */
    border: solid 1px #409EFF;
    color: #409EFF;
  }
  .month ul li {
    text-transform: uppercase;
    letter-spacing: 3px;
  }
  .weekdays{
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
  }
  .days {
    padding: 0;
    background: #ffffff;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    user-select:none;
    border-left: solid 1px #E7E7E7;
  }
  .days li {
    list-style-type: none;
    display: inline-block;
    width: 14.28%;
    text-align: center;
    padding-bottom: 15px;
    padding-top: 15px;
    font-size: 1rem;
    color: #858585;
  }
  .days li .active {
    /* padding: 6px 10px; */
    /* border-radius: 50%; */
    /* background: #00b8ec; */
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
  .leftSku{
    position: absolute;
    width:300px;
    height:500px;
    margin-top:125px;
    margin-left:-25px;
  }
  .selectSku{
    background: #409EFF !important;
    color: #fff !important;
    /* border: solid 1px #409EFF; */
    /* color: #409EFF; */
  }
  .rightForm{
    float: left;
    margin-top: 35px;
    margin-left: 35px;
    /* right: -360px; */
    width: 339px;
  }
  .clearfix{
    width:310px;
    text-align: left;
    font-size: 17px;
    /* font-weight:bold; */
  }
  .ButtonCls{
    margin: 30px 0 0 50%;
    /* float: right; */
    /* margin-top: -35px; */
  }
  .divform{
    margin-left: -10px;
  }
  .fontName{
    width: 70px;
    word-wrap:break-word
  }
  .isShare{
    float: right;
    background: red;
    padding: 1px 6px;
    font-size: 14px;
    color: #000;
  }
</style>
