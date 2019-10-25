<template>
  <div>
    <div class="leftSku">
      <div style="font-size:20px;margin-left:40px;">Sku</div>
      <el-button style="margin-top:10px;margin-left:40px;width:220px;height: 64px;" :class="{'selectSku': ccc.includes(data.id)}" plain v-for="(data,index) in msgFather" :key="index"  @click="setMeal(data)">{{data.ddd}}</el-button>
      <!-- <div style="font-size:20px;margin-top:20px">附加增值服务</div>
      <el-button class="selectSku" plain v-for="(item,index) in Addprice" :key="item.id">{{item.name}}</el-button> -->
    </div>
    <div id="calendar">
      <div style="margin-bottom: 10px;">
        <span>结算参考</span>
        <span style="margin-left: 5px;color: red;">{{average | numFilter}}</span>
      </div>
      <!-- 年份 月份 -->
      <div class="month">
        <ul class="date">
          <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
          <li class="arrow" @click="pickPre(currentYear,currentMonth)" v-text="'<'"></li>
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
              <span class="isShare" v-show="dayobject.data.person.share == 1">共享</span>
              <img class="isWarning" v-show="dayobject.data.person.cost" src="@/assets/image/warning.png" alt="">
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
                  <p>销售价：{{data.price_01}}</p>
                  <p>同业价：{{data.price_02}}</p>
                  <!-- <p>已售/库存：0/0</p> -->
                </div>
              </div>
              <!--显示剩余多少数量-->
              <!---->
            </li>
          </template>
          <template v-else>
            <li style="border: solid 1px #E7E7E7;border-left:none;border-top:none;" :class="{'checked': n.includes(dayobject)}" @click="handleitemclick(dayobject, index)" :key="index" >
              <span class="isShare" v-show="dayobject.data.person.share == 1">共享</span>
              <img class="isWarning" v-show="dayobject.data.person.cost" src="@/assets/image/warning.png" alt="">
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <div v-else>
                <!--今天  同年同月同日-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>
                <!--  -->
                  <div class='person' v-for="(data, index) in dayobject.data.person.planEnroll" :key="index" >
                    <template v-if="index<=2">
                    <p class='old'>{{data.name}}</p>
                    <p>销售价：{{data.price_01}}</p>
                    <p>同业价：{{data.price_02}}</p>
                    <!-- <p>已售/库存：0/0</p> -->
                    </template>
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
      <!-- 固定卡片表单 -->
      <el-form :model="Rform" :rules="RformRuler" ref="Rform">
        <el-form-item label="报名类型:">
          <el-select v-model="Rform.region" filterable placeholder="请选择" style="width:180px;margin:0 0 0 33px;">
            <el-option
              v-for="(item, index) in typeSelect"
              :label="item.name"
              :value="item.id + '-' + item.name"
              :key="index">
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" @click="AddType">添加</el-button>
        </el-form-item>
        <el-form-item ref="resource" label="库存类型:" prop="resource">
          <el-radio-group v-model="Rform.resource" @change="xuanze('2')" style="margin:0 0 0 22px;">
            <el-radio :disabled="forbidden" label="1">共享</el-radio>
            <el-radio  label="2">非共享</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="共享库存:" prop="shareId" style="margin-top:-15px;" v-if='Rform.resource == "1"'>
          <el-select v-model="Rform.shareId" placeholder="请选择" @change="shareSelect" style="width:180px">
            <el-option v-for="(item, index) in signUptypeSelect" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <div v-if="Rform.shareId"><span>当前剩余:</span><span style="color:blue;margin-left:22px">{{Rform.shareNum}}</span></div>
        </el-form-item>
        <el-form-item label="总库存:" v-show='Rform.resource == "2"' prop="sumNum" style="margin-top:-15px;" >
          <el-input v-model="Rform.sumNum" style="width:200px; margin:0 0 0 33px;" ></el-input>
        </el-form-item>
        <el-form-item label="订单预留时长:" style="margin-top:20px" prop="orderRetain">
          <el-select v-model="Rform.orderRetain" placeholder="请选择" style="width:200px" @change="$forceUpdate()">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in excurList" :key="item.index" />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 固定卡片表单 END -->
      <!-- 卡片（价格） -->
      <el-card class="box-card"  v-for="(item,index) in arr" :key="item.key">
        <div slot="header" class="clearfix">
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
            <el-button type="primary" size="mini" id="inventorysave" @click="addQuota(item, index)">保存</el-button>
            <el-button @click="delect(item, index)" type="danger" size="mini">删除</el-button>
          </div>
        </div>
        <div class="divform">
          <el-form ref="form" :model="item" :rules="formRuler"  label-width="110px">
            <el-form-item label="销售价" prop="price_01">
              <el-input v-if="Rform.resource == 1" :class="isAverage = item.salePrice < shareAverage && item.salePrice != '' ? 'isAverage' : ''" :maxlength='6' type='tel' v-model="item.price_01"></el-input>
              <el-input v-else :class="isAverage = item.salePrice < average && item.salePrice != '' ? 'isAverage' : ''" :maxlength='6' type='tel' v-model="item.price_01"></el-input>
            </el-form-item>
            <el-form-item label="同业价" prop="price_02">
              <el-input :maxlength='6' v-model="item.price_02"></el-input>
            </el-form-item>
            <el-form-item label="甜程结算价" prop="price_03">
              <el-input :maxlength='6' v-model="item.price_03"></el-input>
            </el-form-item>
            <el-form-item label="甜程线上售价" prop="price_04">
              <el-input :maxlength='6' v-model="item.price_04"></el-input>
            </el-form-item>
            <el-form-item label="配额" v-if="arr[index].quota == true">
              <el-input :maxlength='6' v-model="item.quotaPrice"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <!-- 卡片（价格） END -->
    </div>
  </div>
</template>

<script>
  /*
  * 通过 this.days 数据类控制日历 团期计划的更新
  *
  *
  * */
  export default {
    name:'DateList',
    props: ['msgFather', 'piapia'],
    data() {
      return {
        today: new Date(),
        isAverage: '',
        average: 0, // 结算参考价
        shareAverage: 0, // 共享库存结算参考
        Rform:{
          id: '',          // 计划id
          date: '',        // 日历时间
          region:'',       // 报名类型
          resource:'',     // 库存类型
          shareId:'',      // 共享库存id
          sumId: '',       // 非共享库存id
          shareNum: '',    // 共享库存数量
          sumNum:'',       // 总库存数量,
          orderRetain: ''  // 订单预留时长
        }, // 大表单
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
        rightTable: false, // 右侧的表单显示开关
        forbidden:false, // 多日期共享禁用
        days: [], // 日历上每日日期
        arr:[], // 右侧报名类型表单
        ccc: [], // sku套餐选择
        clickData: '', // 当前点击的日期
        RformRuler: {
          sumNum: [
            { required: true, message: '请填写库存'},
            { pattern: /^[1-9]\d*$/, message: '库存为正整数' }
          ],
          shareId: [
            { required: true, message: '共享库存不能为空'}
          ],
          resource: [
            { required: true, message: '请选择库存类型'}
          ],
          orderRetain: [
            { required: true, message: '不能为空'}
          ]
        }, // 非共享库存验证
        formRuler: {
          price_01: [
            { required: true, message: '不能为空'}
          ],
          price_02: [
            { required: true, message: '不能为空'}
          ],
          price_03: [
            { required: true, message: '不能为空'}
          ],
          price_04: [
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
        signUptypeSelect:[], // 共享库存数据
        excurList:[{
          value: '1',
          label: '1小时'
        }, {
          value: '2',
          label: '2小时',
        }, {
          value: '3',
          label: '3小时',
        }, {
          value: '4',
          label: '4小时',
        }, {
          value: '5',
          label: '5小时',
        }, {
          value: '6',
          label: '6小时',
        }, {
          value: '7',
          label: '7小时',
        }, {
          value: '8',
          label: '8小时',
        }, {
          value: '9',
          label: '9小时',
        }, {
          value: '10',
          label: '10小时',
        }, {
          value: '11',
          label: '11小时',
        }, {
          value: '12',
          label: '12小时',
        }, {
          value: '13',
          label: '13小时',
        }, {
          value: '14',
          label: '14小时',
        }, {
          value: '15',
          label: '15小时',
        }, {
          value: '16',
          label: '16小时',
        }, {
          value: '17',
          label: '17小时',
        }, {
          value: '18',
          label: '18小时',
        }, {
          value: '19',
          label: '19小时',
        }, {
          value: '20',
          label: '20小时',
        }, {
          value: '21',
          label: '21小时',
        }, {
          value: '22',
          label: '22小时',
        }, {
          value: '23',
          label: '23小时',
        }, {
          value: '24',
          label: '24小时',
        }]
      };
    },
    // 结算参考保留小数点后两位
    filters: {
      numFilter (value) {
        // 截取当前数据到小数点后两位
        let realVal = parseFloat(value).toFixed(2)
        return realVal
      }
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
      this.initData(null); // 在vue初始化时调用
      if (this.piapia == '') { // 判断是否点击套餐
        this.ccc = [];
        this.ccc.push(this.msgFather[0].id);
      } else {
        this.ccc = [];
        this.ccc.push(this.piapia);
      }
      this.calendarList(this.ccc[0]);
      this.initTypeSelect(); // 获取报名类型数据
    },
    methods: {
      // 获取结算参考价
      getaverage(id) {
        this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/getaverage', { // 通过套餐获取人均结算价
          "id": id
        }).then(res => {
          this.average = res.data.average;
        })
      },
     //  按套餐获取计划
      calendarList(id) {
        console.log(this.days)
        // this.days 是初始化时期渲染的（ this.initData() ），在这里通过sku获取的计划，两者日期比对（获取的计划在相应的日历上显示）显示在日历上。同时相应要显示的日期赋值 报名类型 person
        this.clearNull();
        this.getaverage(id);
        let currentMonth = this.currentMonth;
        if (currentMonth < 10) currentMonth = "0" + currentMonth;
        this.$http.post(this.GLOBAL.serverSrc + '/team/calendar/api/get', { // 通过sku套餐获取 有哪些计划
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
            // 清空日历里报名类型，重新赋值，值是从后台返回来的最新团期计划
            item.data.person = {}; // 把之前的后台返回来的团期计划，插入到data定义的 this.days 里
            res.data.objects.forEach(items => { // str 是渲染的日历， items.date 是从后台获取的有那几个团期计划
              if (str == items.date) {
                let plan_Enrolls = [];
                if (items.plan_Enrolls != '') {
                  items.plan_Enrolls.forEach(list => {
                    plan_Enrolls.push({
                      'id': list.id,
                      'enrollID': list.enrollID,
                      'name': list.enrollName,
                      'price_01': list.price_01,
                      'price_02': list.price_02,
                      'price_03': list.price_03,
                      'price_04': list.price_04,
                      'quota': list.quotaPrice
                    })
                  })
                }
                item.data.person = { // 重新给person赋值,重配 this.days 数据
                  'id': items.planID,
                  'packageID': items.packageID,
                  'share': items.share,
                  'cost': items.cost,
                  'date': str,
                  'planEnroll': plan_Enrolls,
                  'dateHous': items.dateHous  // 这个后期要迁到外层
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
        let cost = false;
        let isSave = true;
        // 是否编辑判断
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
                'price_01': data.price_01,
                'price_02': data.price_02,
                'price_03': data.price_03,
                'price_04': data.price_04,
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
                'price_01': item.price_01,
                'price_02': item.price_02,
                'price_03': item.price_03,
                'price_04': item.price_04,
                'quota': quotaPrice
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
            'price_01': data.price_01,
            'price_02': data.price_02,
            'price_03': data.price_03,
            'price_04': data.price_04,
            'quota': quotaPrice
          })
        }
        // 查到非共享库存后执行修改计划
        this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorysave', { // 库存修改
          "object": {
            'id': inventoryID, // 库存id
            "name": '',
            "count": this.Rform.sumNum,
            "share": 2,
            "date": this.Rform.date
          }
        })
        .then(resSave =>{
          this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/save', { // 计划修改
            "object": {
              "id": this.Rform.id, // 计划id
              "inventoryID": inventoryID,
              "packageID": this.ccc[0], // 应该是SKU套餐id
              "planEnroll": planEnroll,
              "date": this.Rform.date,
              "dateHous": this.Rform.orderRetain, // 调时长时新增
              "groupCode": this.msgFather[0].codePrefix + '-' + list.data.person.date + '-' + this.msgFather[0].codeSuffix,
              'regimentType': 1
            }
          })
        }).then(resSave => {
          let planEnrolls = [];
          planEnroll.forEach(delid => {
            planEnrolls.push({
              'enrollID': delid.enrollID,
              'name': delid.enrollName,
              'price_01': delid.price_01,
              'price_02': delid.price_02,
              'price_03': delid.price_03,
              'price_04': delid.price_04,
              'quota': delid.quota
            })
          })
          if(this.Rform.resource == '1') {
            planEnroll.forEach(v => {
              if(v.price_01 < this.shareAverage) {
                cost = true;
              }
            })
          } else {
            planEnroll.forEach(v => {
              if(v.price_01 < this.average) {
                cost = true;
              }
            })
          }
          this.days[list.index].data.person = {
            "id": this.Rform.id,
            "inventoryID": inventoryID,
            "packageID": this.ccc[0],
            "share": this.Rform.resource,
            "cost": cost,
            "planEnroll": planEnrolls,
            "date": this.Rform.date,
            'dateHous': this.Rform.dateHous
          }
          let n = [];
          n = this.days[list.index];
          this.n = [];
          this.n.push(n);
          this.$message.success('修改成功');
          if (row) {
            // 修改成功后删除非共享库存
            this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorydelete', { // 删除库存
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
      // 报名类型保存之后(右侧卡片的保存按钮)，这里的data应该是从方法里传过来的表单值
      addQuota(data, index) {
        // 这个data 参数就是要填加载日历上卡片相关信息
        // 有计划id，值执行修改操作
        if (this.Rform.id) {
          console.log('执行修改操作')
          // 2为非共享库存
          if (this.Rform.resource == '2') {
            // 验证是否填写总库存
            if (this.Rform.sumNum != '') {
              this.$refs['form'][index].validate(valid => {
                if (valid) {
                  // 当前销售价低于非共享库存的结算参考
                  if(data.salePrice < this.average) {
                    this.$confirm('当前销售价低于非共享库存的结算参考, 是否继续保存', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      if (this.Rform.sumId) { // 非共享库存id
                        this.saveQuota(this.n[0], data, this.Rform.sumId);
                      } else { // 添加非共享库存
                        this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryinsert', { // 新增库存
                          "object": {
                            "name": '',
                            "count": this.Rform.sumNum,
                            "share": 2,
                            "date": this.Rform.date
                          }
                        }).then(res => {
                          this.saveQuota(this.n[0], data, res.data.id); // 添加完成后传入添加后的id. 这块函数又执行了一遍 新增库存 和  新增计划 （感觉没什么意义），因为上面有一个新增库存接口
                        }).catch(err => {
                          console.log('添加非共享库存失败');
                        })
                      }
                    })
                  } else {
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
                }
              })
            } else {
              this.$refs['Rform'].validateField('sumNum');
            }
          // 1为共享库存
          } else if (this.Rform.resource == '1') {
            // 验证是否选择共享库存
            if (this.Rform.shareId != '') {
              this.$refs['form'][index].validate(valid => {
                if(valid) {
                  if(data.salePrice < this.shareAverage) {
                    this.$confirm('当前销售价低于共享库存的结算参考, 是否继续保存', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      if (!this.Rform.sumId) { // 原数据为非共享库存时则删除原非共享库存
                        this.saveQuota(this.n[0], data, this.Rform.shareId);
                      } else {
                        this.saveQuota(this.n[0], data, this.Rform.shareId, 'delete', this.Rform.sumId);
                      }
                    })
                  } else {
                    if (!this.Rform.sumId) { // 原数据为非共享库存时则删除原非共享库存
                      this.saveQuota(this.n[0], data, this.Rform.shareId);
                    } else {
                      this.saveQuota(this.n[0], data, this.Rform.shareId, 'delete', this.Rform.sumId);
                    }
                  }
                }
              })
            } else {
              this.$refs['Rform'].validateField('shareId');
            }
          }
        // 没，值执行添加操作
        } else {
          console.log('值执行添加操作')
          // 验证库存类型是否选择
          if (this.Rform.resource != '') {
            // 选择的是非共享库存
            if (this.Rform.resource == '2') {
              // 验证是否填写总库存
              if (this.Rform.sumNum != '') {
                 this.$refs['form'][index].validate(valid => {
                   if (valid) {
                    if(data.salePrice < this.average) {
                      this.$confirm('当前销售价低于结算参考, 是否继续保存', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        // 共享与非共享都是 先加库存返回库存id然后传给这个新增计划的接口 （因为都用唯一库存所以计划要用库存返回的唯一id，库存id）
                        this.sumInsert(data, index);
                      })
                    } else {
                      console.log('当前销售价高于结算参考。')
                      this.sumInsert(data, index);
                    }
                   }
                 })
              } else {
                this.$refs['Rform'].validateField('sumNum');
              }
              // 选择的是共享库存
            } else if (this.Rform.resource == '1') {
              // 验证是否选择共享库存
              if (this.Rform.shareId != '') {
                this.$refs['form'][index].validate(valid => {
                  if (valid) {
                    if(data.salePrice < this.shareAverage) {
                      this.$confirm('当前销售价低于共享库存的结算参考, 是否继续保存', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        this.shareInsert(data, index);
                      })
                    } else {
                      this.shareInsert(data, index);
                    }
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
        // 删除右侧表单
        // this.arr.splice(index,1);
      },
      // 非共享库存时的添加
      sumInsert(data, index) {
        console.log(data,'非共享库存时的添加')
        let n = [];
        this.n.forEach(item => { // 当前添加的计划（选中的日期）
          // 第一次添加时
          if (this.days[item.index].data.person.planEnroll == undefined) {
            let planEnroll = [];
            let cost = false;
            planEnroll.push({
              'enrollID': data.id,
              'name': data.name,
              'price_01': data.price_01, // 销售价
              'price_02': data.price_02, // 同业价
              'price_03': data.price_03, // 甜程结算价
              'price_04': data.price_04, // 甜程线上结算价
              'quota': data.quotaPrice // 配额
            })
            let date = this.formatDates(
              item.day.getFullYear(),
              item.day.getMonth() + 1,
              item.day.getDate()
            )
            planEnroll.forEach(v => { // 控制价格预警图片显示与否，当团期计划的价格低于结算参考的时候就会显示价格预警图片
              if(v.salePrice < this.average) {
                cost = true;
              }
            })
            this.days[item.index].data.person = { // 把新选中的计划 进行赋值
                'inventoryID': '',
                'packageID': this.ccc[0],
                'date': date,
                'count': this.Rform.sumNum,
                'share': this.Rform.resource,
                'cost': cost,
                'regimentType': 1,
                'planEnroll': planEnroll,
                "dateHous": this.Rform.orderRetain, // 调时长时新增
            }
            n.push(this.days[item.index]); // 向 n 里面添加值为后续在页面里回显准备
          } else {
            let date = this.formatDates(
              item.day.getFullYear(),
              item.day.getMonth() + 1,
              item.day.getDate()
            )
            let planEnroll = [];
            let cost = false;
            let isSave = true; // 是否编辑判断
            this.days[item.index].data.person.planEnroll.forEach(list => {
              console.log(list,'list')
              if (list.enrollID == data.id && list.name == data.name) {
                planEnroll.push({
                  'enrollID': data.id,
                  'name': data.name,
                  'price_01': data.price_01,
                  'price_02': data.price_02,
                  'price_03': data.price_03, // 甜程结算价
                  'price_04': data.price_04, // 甜程线上结算价
                  'quota': data.quotaPrice
                })
                isSave = false;
              } else {
                planEnroll.push({  // 这里暂时缺字段 因为是list 没敢参照data的写
                  'enrollID': list.enrollID,
                  'name': list.name,
                  'price_01': list.price_01,
                  'price_02': list.price_02,
                  'price_03': list.price_03,
                  'price_04': list.price_04,
                  'quota': list.quotaPrice
                })
              }
            })
            if (isSave) {
              planEnroll.push({
                'enrollID': data.id,
                'name': data.name,
                'price_01': data.price_01, // 销售价
                'price_02': data.price_02, // 同业价
                'price_03': data.price_03, // 甜程结算价
                'price_04': data.price_04, // 甜程线上结算价
                'quota': data.quotaPrice
              })
            }
            planEnroll.forEach(v => {
              if(v.salePrice < this.average) {
                cost = true;
              }
            })
            this.days[item.index].data.person = {
              'inventoryID': this.Rform.shareId,
              'packageID': this.ccc[0],
              'date': date,
              'share': this.Rform.resource,
              'cost': cost,
              'count': this.Rform.sumNum,
              'regimentType': 1,
              'planEnroll': planEnroll,
              "dateHous": this.Rform.orderRetain, // 调时长新增
            }
            n.push(this.days[item.index]);
          }
        })
        this.n = [];
        this.n = n;
        // 新增计划点击保存直接提交数据
        /*n.forEach(item => {
          this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryinsert', { // 新增库存
            "object": {
              "name": '', // 名称
              "count": item.data.person.count, // 库存
              "share": 2, // 是否共享库存 no-2
              "date": item.data.person.date // 日历上的日期
            }
          }).then(res => {
            this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/insert', { // 新增计划
              "object": {
                "inventoryID": res.data.id, // 所属库存
                "packageID": item.data.person.packageID, // 套餐
                "date": item.data.person.date, // 日历上的日期
                "groupCode": this.msgFather[0].codePrefix + '-' + item.data.person.date + '-' + this.msgFather[0].codeSuffix, // 团号
                "planEnroll": item.data.person.planEnroll, // 此团期中的所有报名类型
                'regimentType': 1 // 团期状态
              }
            }).then(resAdd => {
              // 添加成功后从新查找
              this.rightTable = false;
              this.calendarList(this.ccc[0]);
            }).catch(errAdd => {
              console.log('添加计划失败', errAdd);
            })
          }).catch(err => {
            console.log('共享库存添加失败', err);
          })
        })*/
      },
      // 共享库存时的添加
      shareInsert(data, index) {
        console.log(data,'共享库存时的添加')
        let planEnroll = [];
        let cost = false;
        let date = this.formatDates(
              this.n[0].day.getFullYear(),
              this.n[0].day.getMonth() + 1,
              this.n[0].day.getDate()
            )
        if (this.days[this.n[0].index].data.person.planEnroll == undefined) {
          planEnroll.push({
            'enrollID': data.id,
            'enrollName': data.name,
            'price_01': data.price_01,
            'price_02': data.price_02,
            'price_03': data.price_03, // 甜程结算价
            'price_04': data.price_04, // 甜程线上结算价
            'quota': data.quotaPrice // 配额
          })
        } else {
          let isSave = true; // 是否编辑判断
          this.days[this.n[0].index].data.person.planEnroll.forEach(item => {
            if (item.enrollID == data.id && item.name == data.name) {
              planEnroll.push({
                'enrollID': data.id,
                'enrollName': data.name,
                'price_01': data.price_01,
                'price_02': data.price_02,
                'price_03': data.price_03, // 甜程结算价
                'price_04': data.price_04, // 甜程线上结算价
                'quota': data.quotaPrice // 配额
              })
              isSave = false;
            } else {
              console.log(item,'isSave = false')
              planEnroll.push({
                'enrollID': item.enrollID,
                'enrollName': item.name,
                'price_01': item.price_01,
                'price_02': item.price_02,
                'price_03': item.price_03,
                'price_04': item.price_04,
                'quota': item.quotaPrice
              })
            }
          })
          if (isSave) {
            planEnroll.push({
              'enrollID': data.id,
              'enrollName': data.name,
              'price_01': data.price_01,
              'price_02': data.price_02,
              'price_03': data.price_03, // 甜程结算价
              'price_04': data.price_04, // 甜程线上结算价
              'quota': data.quotaPrice // 配额
            })
          }
        }
        planEnroll.forEach(v => {
          if(v.salePrice < this.shareAverage) {
            cost = true;
          }
        })
        this.days[this.n[0].index].data.person = {
          'inventoryID': this.Rform.shareId,
          'share': this.Rform.resource,
          'cost': cost,
          'packageID': this.ccc[0],
          'count': this.Rform.shareNum,
          'date': date,
          'planEnroll': planEnroll,
          'regimentType': 1,
          "dateHous": this.Rform.orderRetain, // 调时长时新增
        }
        console.log(this.days, 'this.days')
        let n = [];
        n = this.days[this.n[0].index];
        this.n = [];
        this.n.push(n);
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
        // this.shareAverage = 0;
        this.Rform = {
          id: '',       // 计划id
          date: '',     // 日历时间
          region:'',    // 报名类型
          resource:'',  // 库存类型
          sumId: '',    // 非共享库存id
          shareNum: '', // 共享库存数量
          shareId:'',   // 共享库存
          sumNum:'',    // 总库存
          regimentType:'',// 团期状态
        };
        // 清空表单验证样式
        if (this.$refs['Rform'] != undefined) {
          this.$refs['Rform'].resetFields();
        }
      },
      // 点击日期（日历上的日）的时候
      handleitemclick(day, index) {
        if (this.n.includes(day)) { // 取消选择时
          this.n = this.n.filter(v => v != day);
          if (this.n.length == 0) {
            this.share = false;
            this.rightTable = false;
          }
          if (this.n.length < 2) { // 当选中的日期为一天的时候可以选择"共享"
            this.forbidden = false;
            this.Rform.resource = "";
          }
          if (this.n.length == 1) { // 当前点击一个日期时
            this.clickData = this.formatDates(
              this.n[0].day.getFullYear(),
              this.n[0].day.getMonth() + 1,
              this.n[0].day.getDate()
            )
            this.clearNull()
          }
        } else { // 选择时
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
          if (this.n.length > 1) { // 当选中的日期大于一天的时候默认为"非公享"
            this.forbidden = true;
            this.Rform.resource = "2";
          } else {
            this.clickData = this.formatDates( // 当前点击一个日期时
              day.day.getFullYear(),
              day.day.getMonth() + 1,
              day.day.getDate()
            )
          }
          // 我发现个问题 当点击一个计划的时候person可能会为一个空对象此时无法对person进行赋值
          // 在保存事件里也就无法遍历除当前选中的是哪些计划，所以过滤this.days 的时候返回的是一个空数组
          // 下面两种情况是对 person 下 id 行判断， 还有一个是对 person 下的 packageID 进行判断（这两种情况有时都不满足）

          // 选中的日期有类型时进行赋值
          // 如果有计划 id
          if (day.data.person.id != undefined) {
            console.log('有计划 id')
            this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/get', { // 获取一个计划信息
              "id": day.data.person.id
            }).then(res => {
              day.data.person.inventoryID = res.data.object.inventoryID; // 所属库存
              this.$http.post(this.GLOBAL.serverSrc +  '/team/api/inventoryget', { // 获取一个库存信息
                "id": res.data.object.inventoryID // 所属库存（计划信息返回）
              }).then(inventoryRes => {
                day.data.person.count = inventoryRes.data.object.count; // 返回当前库存id 下，库存的数量
                this.Rform.resource = String(day.data.person.share); // 库存类型
                this.xuanze(this.Rform.resource);
                if (this.Rform.resource == 1) {
                  // 共享库存数量
                  this.Rform.shareNum = day.data.person.count;
                  // 共享库存ID
                  this.Rform.shareId = res.data.object.inventoryID;
                  // 共享库存订单预留时长
                  this.Rform.orderRetain = res.data.object.dateHous
                  setTimeout(() => {
                    this.shareSelect();
                  }, 100)
                } else {
                  // 非共享库存数量
                  this.Rform.sumNum = day.data.person.count;
                  // 非共享库存ID
                  this.Rform.sumId = res.data.object.inventoryID;
                  // 非共享库存订单预留时长
                  this.Rform.orderRetain = res.data.object.dateHous
                }
                this.Rform.id = day.data.person.id; // 计划id
                this.Rform.date = this.formatDates(
                  day.day.getFullYear(),
                  day.day.getMonth() + 1,
                  day.day.getDate()
                )
                this.selectType(day); // 给选中类型赋值
              })
            })
            // 所属套餐的id
          } else if (day.data.person.packageID != undefined) {
            this.Rform.resource = day.data.person.share; // 库存类型
            this.xuanze(this.Rform.resource);
            if (this.Rform.resource == 1) { // 库存类型（如果是共享库存）
              this.Rform.shareNum = day.data.person.count; // 共享库存数量
              this.Rform.shareId = day.data.person.inventoryID; // 共享库存ID
              setTimeout(() => {
                this.shareSelect(); // 获取该库存剩余的库存量
              }, 100)
            } else {
              this.Rform.sumNum = day.data.person.count; // 非共享库存数量
              this.Rform.sumId = day.data.person.inventoryID; // 非共享库存ID
              this.Rform.orderRetain = day.data.person.dateHous // 非共享库存订单预留时长
            }
            this.selectType(day); // 给选中类型赋值
          }
        }
      },
      // 在单击日历事件里调用此函数作为赋值用
      selectType(day) {
        // 给选中类型赋值,这个day是点击日历时，请求接口后，用后台接口组合的值
        let _planEnroll = day.data.person.planEnroll;
        for (let i = 0; i < _planEnroll.length; i++) {
          this.Rform.region = _planEnroll[i].enrollID + '-' + _planEnroll[i].name;
          this.AddType(); // 点击按钮添加卡片事件
          if (this.arr[i].id == _planEnroll[i].enrollID && this.arr[i].name == _planEnroll[i].name) {
            this.arr[i].isModify = true;
            this.arr[i].price_01 = _planEnroll[i].price_01;
            this.arr[i].price_03 = _planEnroll[i].price_03;
            this.arr[i].price_04 = _planEnroll[i].price_04;
            this.arr[i].regimentType = _planEnroll[i].regimentType; // 新增团期状态
            this.arr[i].price_02 = _planEnroll[i].price_02;
            if (_planEnroll[i].quotaPrice == null || _planEnroll[i].quotaPrice == 0) {   // quotaPrice  quota  字段里是 quota，这块估计还得会有问题，
              this.arr[i].quota = false;
              this.arr[i].quotaPrice = '';
            } else {
              this.arr[i].quota = true;
              this.arr[i].quotaPrice = _planEnroll[i].quotaPrice;
            }
          }
        }
      },
      // 数据初始化
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
        this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventorylist', { // 库存带条件列表无分页
          "object": {
            "share": 1,
            "date": this.clickData
          }
        }).then(res => {
          this.signUptypeSelect = []; // 共享库存数据
          res.data.objects.forEach(item => {
            this.signUptypeSelect.push({
              "id": item.id,
              "name": item.name,
              "count": item.count, // 数量
              "averageCost": item.averageCost //  人均机票成本
            })
            console.log('获取共享库存', this.signUptypeSelect)
          })
        }).catch(err => {
          console.log('共享库存获取失败');
        })
      },
      // 选择库存类型
      xuanze(z) {
        this.shareAverage = 0;
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
        this.getshareaverage(shareID[0].averageCost);
      },
      // 选择共享通过套餐和机票获取人均结算价
      getshareaverage(cost) {
        this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/getshareaverage', {
          "averageCost": cost,
          "id": this.ccc[0]
        }).then(res => {
          this.shareAverage = res.data.average;
        })
      },
      // 添加报名类型（点击按钮添加卡片事件）
      AddType(type) {
        console.log('添加报名类型')
        if (this.Rform.region) { // 如果有报名类型
          let mon = true;
          if (this.arr.length !== 0) {
            this.arr.forEach(item => {
              if (item.id + '-' + item.name == this.Rform.region) {
                mon = false;
              }
            })
          }
          if (mon) {
            /*
            * 这里给arr，配置一个已经设定默认值的空对象,然后在 this.selectType 这个方法里调用，
            * this.selectType 这个方法里 有一个传入的参数day（在点击某一个团期计划调用接口返回的数据组合成的当前计划最新值）通过 day 的值循环给 arr 数组赋值，
            * arr 数组是给报名类型的卡片模板用 v-for 遍历用的数据
            * */
            let id = this.Rform.region.substring(0, this.Rform.region.indexOf('-'));
            let name = this.Rform.region.substring(this.Rform.region.lastIndexOf('-') + 1, this.Rform.region.length);
            this.arr.push({
              'id': id,
              'name': name,
              'isModify': false, // 计划id
              'price_01': '',   // 销售价
              'price_02': '', // 同业价
              'price_03': '',     // 甜程结算价
              'price_04': '', // 甜程线上结算价
              'quota': false,    // 配额开关
              'quotaPrice': '',   // 配额
              'regimentType': 1,   // 团期状态
              'orderRetain': '',   // 订单预留时长
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
        console.log(this.n, '删除卡片 this.n')
        console.log(item, '删除卡片 item')
        console.log(index, '删除卡片 index')
        let _n = this.n[0];
        if (item.isModify) {
          if (_n.data.person.planEnroll.length <= 0) {
            console.log('剩一个类型时');
            // 删除最后一个类型时删除该计划
            this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/delete', {
                "id": this.Rform.id
            }).then(res => {})
          } else {
            console.log(this.arr)
            this.arr.splice(index,1);
            let planEnroll = [];
            this.arr.forEach(data => {
              console.log(data,'删除里面的data')
              let quotaPrice = '';
              // 判断是否填写配额
              if (data.quotaPrice == '') {
                quotaPrice = 0;
              } else {
                quotaPrice = data.quotaPrice;
              }
              planEnroll.push({
                'enrollID': data.id,
                'enrollName': data.name,
                'price_01': data.price_01,
                'price_02': data.price_02,
                'price_03': data.price_03,
                'price_04': data.price_04,
                'quota': quotaPrice
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
              console.log(this.days[_n.index].data.person.planEnroll, '有两个及以上的值删除调用修改接口')
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
      },
      // delect(item, index) {
      //   let _n = this.n[0];
      //   if (item.isModify) {
      //     if (_n.data.person.planEnroll.length <= 1) {
      //       console.log('剩一个类型时');
      //       // 删除最后一个类型时删除该计划
      //       this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/delete', {
      //           "id": this.Rform.id
      //       }).then(res => {
      //         console.log(res);
      //       })
      //     } else {
      //       this.arr.splice(index,1);
      //       let planEnroll = [];
      //       this.arr.forEach(data => {
      //         let quotaPrice = '';
      //         // 判断是否填写配额
      //         if (data.quotaPrice == '') {
      //           quotaPrice = 0;
      //         } else {
      //           quotaPrice = data.quotaPrice;
      //         }
      //         planEnroll.push({
      //           'enrollID': data.id,
      //           'enrollName': data.name,
      //           'price_01': data.salePrice,
      //           'price_02': data.traderPrice,
      //           'quota': quotaPrice
      //         })
      //       })
      //       // 有两个及以上的值删除调用修改接口
      //       this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/save', {
      //         "object": {
      //           "id": this.Rform.id,
      //           "inventoryID": _n.data.person.inventoryID,
      //           "packageID": this.ccc[0],
      //           "date": this.Rform.date,
      //           "planEnroll": planEnroll
      //         }
      //       }).then(res => {
      //         this.days[_n.index].data.person.planEnroll.splice(index,1);
      //         let n = [];
      //         n = this.days[_n.index];
      //         this.n = [];
      //         this.n.push(n);
      //         this.$message.success('删除成功');
      //       }).catch(err => {
      //         console.log('删除(修改)计划失败');
      //       })
      //     }
      //   } else {
      //     this.arr.splice(index,1);
      //     this.days[_n.index].data.person.planEnroll.splice(index,1);
      //     let n = [];
      //     n = this.days[_n.index]
      //     this.n = [];
      //     this.n.push(n);
      //     if (_n.data.person.planEnroll.length <= 1) {
      //       this.days[_n.index].data.person.share = '';
      //     }
      //   }
      //   // this.arr.splice(index,1);
      // },
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
          $("#inventorysave").click(); // 应该是没提交接口只是将数据显示在日历上
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
                  'price_01': list.price_01,
                  'price_02': list.price_02,
                  'price_03': list.price_02, // 甜橙结算价
                  'price_04': list.price_02, // 甜橙线上售价
                  'quota': quotaPrice
                })
              })
            }
            if (item.data.person.inventoryID == '') {
              // 添加非共享库存
              this.$http.post(this.GLOBAL.serverSrc + '/team/api/inventoryinsert', { // 新增库存
                "object": {
                  "name": '',
                  "count": item.data.person.count,
                  "share": 2,
                  "date": item.data.person.date
                }
              }).then(res => {
                this.$http.post(this.GLOBAL.serverSrc + '/team/plan/api/insert', { // 新增计划
                  "object": {
                    'createTime': 0,
                    "inventoryID": res.data.id,
                    "packageID": item.data.person.packageID,
                    "date": item.data.person.date,
                    "groupCode": this.msgFather[0].codePrefix + '-' + item.data.person.date + '-' + this.msgFather[0].codeSuffix,
                    "planEnroll": planEnroll,
                    "regimentType": 1,
                    'dateHous': item.data.person.dateHous
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
          this.$emit("merchandises", false);
        }
      },
      // 点击套餐Sku
      setMeal(data) {
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
    margin-left:-2%;
  }
  .selectSku{
    background: #409EFF !important;
    color: #fff !important;
    /* border: solid 1px #409EFF; */
    /* color: #409EFF; */
  }
  .rightForm{
    float: right;
    margin-top: 35px;
    width: 360px;
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
  .isWarning {
    float: right;
    width: 20px;
    height: 20px;
    margin-right: 3px;
  }
  .isAverage>>>.el-input__inner {
    color: red !important;
  }
</style>
