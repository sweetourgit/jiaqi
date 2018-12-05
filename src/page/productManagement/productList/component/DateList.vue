<template>
  <div>
    <div class="leftSku" >
      <div style="font-size:20px">Sku</div>
      <el-button class="selectSku" plain v-for="(data,index) in ccc" :key="index"  @click="setMeal()">{{data.ddd}}</el-button>
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
            <!-- @click="pickYear(currentYear,currentMonth)" -->
            {{currentYear}}-{{currentMonth}}月
          </li>
          <li class="arrow" @click="pickNext(currentYear,currentMonth)">></li>
        </ul>
        <div class="all-month">
          <span @click="handleallclick" style="float:left;padding:10px 20px;margin-left:18px;cursor: pointer;">全月</span>
          <span @click="handleTwoClick" style="float:left;padding:10px 20px;margin-left:8px;cursor: pointer;">周六、日</span>
          <span @click="handleWeekClick" style="float:left;padding:10px 20px;margin-left:8px;cursor: pointer;">周一 ~ 周五</span>
          <span @click="clearchecked" style="float:left;padding:10px 20px;margin-left:8px;cursor: pointer;">全部清除</span>
          <i style="float:left;padding:10px 10px;margin-left:25px;font-size:15px;font-style: normal;">已选{{n.length}}天</i>
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
            <li style="background: #F6F6F6;border: solid 1px #E7E7E7;border-left:none;border-top:none;"  :class="{'checked': n.includes(dayobject)}" @click="handleitemclick(dayobject)" :key="index" >
              <!--本月-->
              <!--如果不是本月  改变类名加灰色-->
              <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
              <!--如果是本月  还需要判断是不是这一天-->
              <div v-else>
                <!--今天  同年同月同日-->
                <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                <span v-else>{{ dayobject.day.getDate() }}</span>

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

                <!--  -->
                <div class='person' v-for="(data,index) in dayobject.data.person" :key="index">
                  <!-- v-show="dayobject.data.person.price" -->
                  <p class='old'>{{dayobject.data.person[index].name}}</p>
                  <p>销售价：{{dayobject.data.person[index].salePrice}}</p>
                  <p>同业价：{{dayobject.data.person[index].traderPrice}}</p>
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

    <!-- 右侧的表单 -->
    <div class="rightForm" v-show="rightTable">
      <!-- 表单 -->
      <el-form :model="Rform">
        <el-form-item label="报名类型:">
          <el-select v-model="Rform.region" placeholder="请选择" style="width:150px">
            <el-option v-for="item in typeSelect"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
          <el-button size="mini" type="primary" @click="AddType">添加</el-button>
        </el-form-item>
        <el-form-item label="库存类型:" prop="resource">
          <el-radio-group v-model="Rform.resource" @change="xuanze">
            <el-radio :disabled="forbidden" label="0">共享</el-radio>
            <el-radio  label="1">非共享</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 共享库存 -->
        <el-form-item label="共享库存:" v-if='repertorySelect == "share"'  style="margin-top:-15px;">
          <el-select v-model="Rform.shareRepertory" placeholder="请选择" style="width:150px">
            <el-option v-for="item in typeSelect"
                       :label="item.label"
                       :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
          <div><span>当前剩余:</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue">90</span></div>
        </el-form-item>
        <!-- 非共享库存 -->
        <el-form-item label="总库存:" v-if='repertorySelect == "sum"' style="margin-top:-15px;" >
          <el-input v-model="Rform.sumRepertory" style="width:200px;" ></el-input>
        </el-form-item>
      </el-form>
      <!-- 卡片 -->
      <template>
        <el-card class="box-card"  v-for="(item,index) in arr" :key="item.key">
          <!-- v-for="card in n[0].AddType"  -->
          <!-- v-if='n[0]!=Addtype'  -->
          <div  slot="header" class="clearfix">
            {{item.name}}
            <div style="float:right;margin-top: -3px;">
              <el-button type="primary" size="mini" @click="addQuota(index,item.name)">保存</el-button>
              <el-button @click="delect(index)"  type="danger" size="mini">删除</el-button>
              <template v-if="arr[index].quota == false">
                <el-button @click="AddQuota(index)"  type="primary" size="mini">添加配额</el-button>
              </template>
              <template v-else>
                <el-button @click="DelectQuota(index)"  type="primary" size="mini">删除配额</el-button>
              </template>
            </div>
          </div>
          <div>
            <el-form ref="form"  label-width="80px">
              <el-form-item label="销售价">
                <el-input :maxlength='6' type='tel' v-model="item.salePrice"></el-input>
              </el-form-item>
              <el-form-item label="同业价">
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
    mounted() {
      console.log("渲染");
    },
    updated() {},
    name: "HelloWorld",
    data() {
      return {
        today: new Date(),
        showCard: false,
        // 大表单
        Rform:{
          region:'',
          resource:'',
          // 共享库存
          shareRepertory:'',
          // 总库存
          sumRepertory:'',
        },
        form: {
          price: "",
          number: "",
          top: "",
          down: ""
        },
        form2: {
          price: "",
          number: ""
        },
        monday: false,
        tue: false,
        wed: false,
        tur: false,
        fri: false,
        sat: false,
        sun: false,
        n: [],
        // 配额
        quota:false,
        // 共享或非公享第一次选择
        share:false,
        // 日期信息
        // DayMessage:[],
        currentDay: 1,
        currentMonth: 1,
        currentYear: 1970,
        currentWeek: 1,
        // 库存选择
        repertorySelect:"",
        // 右侧的选择表格
        rightTable:false,
        // 多日期共享禁用
        forbidden:false,
        days: [],
        arr:[{
          id:0,
          name:'成人',
          // 销售价
          salePrice:'',
          // 同业价
          traderPrice:'',
          quota:false,
          quotaPrice:'',
        },{
          id:1,
          name:'儿童',
          // 销售价
          salePrice:'',
          // 同业价
          traderPrice:'',
          quota:false,
          quotaPrice:'',
        },{
          id:5,
          name:'单房差',
          // 销售价
          salePrice:'',
          // 同业价
          traderPrice:'',
          quota:false,
          quotaPrice:'',
        }],
        // 添加库存
        Addrepertory:[],
        leftobj: [
          //存放剩余数量
          { count: 1 },
          { count: 2 },
          { count: 3 },
          { count: 4 },
          { count: 5 }
        ],
        // 添加报名类型
        // addType:[],
        // 选择报名类型时候传的数值
        typeNum:'',
        radio:'',
        // sku选择
        ccc:[{
          ddd:"普吉岛情侣",
          type:false,
          // value:"1",
        },{
          ddd:"普吉岛亲子",
          type:false,
          // value:"2",
        },{

          ddd:"哈尔滨3天自由行",
          type:false,
          // value:"3",
        }],

        // 附加增值服务
        // Addprice:[{
        //   name:"保险",
        //   priceSelect:"非日历价格",
        //   explain:"保护安全",
        //   type:false,
        // },{
        //   name:"小费",
        //   priceSelect:"日历价格",
        //   explain:"给小费鼓励一下吧",
        //   type:false,
        // }],
        // 类型选择
        typeSelect: [{
          value: '0',
          label: '成人',
          name:'adult '
        }, {
          value: '1',
          label: '儿童',
          name:'child'
        }, {
          value: '2',
          label: '老人',
          name:'oldman'
        }, {
          value: '3',
          label: '婴儿',
          name:'infant'
        }, {
          value: '4',
          label: '特殊人群',
          name:'specialCrowd'
        },{
          value: '5',
          label: '单房差',
          name:'singleCavity'
        }],
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
              item.name = 1
              this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
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
            this.repertorySelect = "";
          }
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
              item.name = 2
              this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
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
            this.repertorySelect = "";
          }
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
              item.name = 3
              this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
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
            this.repertorySelect = "";
          }
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
              item.name = 4
              this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
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
            this.repertorySelect = "";
          }
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
              item.name = 5
              this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
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
            this.repertorySelect = "";
          }
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
              item.name = 6
              this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 6)
          this.n = name;
          if(this.n.length ==0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
            this.repertorySelect = "";
          }
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
              item.name = 0
              this.n.push(item);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length >1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
              }
            }
          });
        } else {
          let del = this.n.filter(item => item.day.getDay() == 1);
          let name = this.n.filter(item =>  item.name !== 0)
          this.n = name;
          if(this.n.length ==0){
            this.rightTable = false;
          }
          // 当选中的日期为一天的时候可以选择"共享"
          if(this.n.length < 2){
            this.forbidden = false;
            this.Rform.resource = "";
            this.repertorySelect = "";
          }
        }
      }
    },
    created: function() {
      //在vue初始化时调用
      this.initData(null);
    },
    methods: {
      handleChildrenSave() {
        console.log(this.n);
        console.log(this.n.length);
        this.n.forEach(item => {
          item.data.person = {
            price: this.form2.price,
            number: this.form2.number,
          };
        });
        //  this.clearchecked();
      },
      // 保存之后
      addQuota(index,name) {
        // salePrice traderPrice quotaPrice
        // 添加库存
        this.Addrepertory.push({
          name:name,
          // 销售价
          salePrice: this.arr[index].salePrice,
          // 同业价
          traderPrice: this.arr[index].traderPrice,
          // 配额
          quotaPrice: this.arr[index].quotaPrice
        })
        this.n.forEach(item => {
          console.log(item)
          // console.log(this.Addrepertory);
          item.data.person = this.Addrepertory;
        });
        // this.clearchecked();
        this.arr.splice(index,1);
      },
      // 点击日期
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
            if(this.n.length !=0){
              this.rightTable = true;
            }
            // 当选中的日期大于一天的时候默认为"非公享"
            if(this.n.length >1){
              this.forbidden = true;
              this.Rform.resource = "1";
              this.repertorySelect = "sum";
            }
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
            console.log("添加成功")
            if(this.n.length !=0){
              this.rightTable = true;
            }
            // 当选中的日期大于一天的时候默认为"非公享"
            if(this.n.length >1){
              this.forbidden = true;
              this.Rform.resource = "1";
              this.repertorySelect = "sum";
            }
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
            if(this.n.length !=0){
              this.rightTable = true;
            }
            // 当选中的日期大于一天的时候默认为"非公享"
            if(this.n.length >1){
              this.forbidden = true;
              this.Rform.resource = "1";
              this.repertorySelect = "sum";
            }
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
        if(this.n.length ==0){
          this.rightTable = false;
        }
      },
      // 点击日期的时候
      handleitemclick(day) {
        if (day.day.getMonth() + 1 === this.currentMonth) {
          if (day.day.getTime() < this.today.getTime() - 24 * 60 * 60 * 1000) {
            this.$message({
              message: '请选择今日以后的时期',
              type: 'warning'
            });
          } else {
            if (this.n.includes(day)) {
              this.n = this.n.filter(v => v != day);
              if(this.n.length == 0){
                this.share = false;
                this.rightTable = false;
              }
              // 当选中的日期为一天的时候可以选择"共享"
              if(this.n.length < 2){
                this.forbidden = false;
                this.Rform.resource = "";
                this.repertorySelect = "";
              }
            } else {
              day.name = day.day.getDay()
              this.n.push(day);
              if(this.n.length !=0){
                this.rightTable = true;
              }
              // 当选中的日期大于一天的时候默认为"非公享"
              if(this.n.length > 1){
                this.forbidden = true;
                this.Rform.resource = "1";
                this.repertorySelect = "sum";
              }
            }
          }
        } else {
          this.$message({
            message: '选择本月吧',
            type: 'warning'
          });
        }

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
        // console.log(day);
        // const now = new Date().getTime();
        // const mon = new Date().getMonth();
        // if (day.day.getMonth() == this.currentMonth) {
        //   alert("请选择本月");
        // } else {
        //   if (day.day.getTime() + 24000000 < now) {
        //     alert("不能选择比今天早的");
        //   } else {
        //     if (this.n.includes(day)) {
        //       // 删除
        //       this.n = this.n.filter(v => v != day);
        //     } else {
        //       // 添加
        //       this.n.push(day);
        //     }
        //   }
        // }
        // if(this.n.includes)
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
        var index = 0;
        //控制显示预定的天数 ，比如下面设置只能预定三天的
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
        for (var i = this.currentWeek; i >= 0; i--) {
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
        for (var i = 1; i <= 41 - this.currentWeek; i++) {
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
          this.days.map(item => (item.data = { person: {}, children: {} }));
        }
      },
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
      },
      // 选择库存类型
      xuanze(a){
        // 第一次点击的时候
        if(this.share == false){
          if(a == "0" ){
            this.repertorySelect = "share";
          }else if(a == "1" ){
            this.repertorySelect = "sum";
          }
          this.share = true;
        }else{
          this.$confirm('当前类型数据将重置，是否更改?', '更改库存类型', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(a == '0'){
              this.repertorySelect = "share";
              this.Rform.shareRepertory = '';
            } else {
              this.repertorySelect = "sum";
              this.Rform.sumRepertory = '';
            }
            this.$message({
              type: 'success',
              message: '更改成功!'
            });
          }).catch(() => {
            if(this.Rform.resource == "0"){
              this.Rform.resource = '1'
            } else {
              this.Rform.resource = '0'
            }
            this.$message({
              type: 'info',
              message: '已取消更改'
            });
          })
        }
      },
      // 添加报名类型
      AddType(type){
        let mon = true;
        this.arr.forEach(item => {
          if(item.id == this.Rform.region){
            mon = false;
          }
        })
        if(mon){
          this.arr.push({
            id:this.typeSelect[this.Rform.region].value,
            name:this.typeSelect[this.Rform.region].label,
            // 销售价
            salePrice:'',
            // 同业价
            traderPrice:'',
            quota:false,
            quotaPrice:'',
          })
        } else {
          this.$message({
            message: '已存在该报名类型',
            type: 'warning'
          });
        }
      },
      // 删除卡片
      delect(index){
        this.arr.splice(index,1);
        console.log(this.arr);
      },
      // 添加配额
      AddQuota(index){
        console.log(index);
        this.arr[index].quota = true;
      },
      // 删除配额
      DelectQuota(index){
        this.arr[index].quota = false;
      },
      // 点击套餐Sku
      setMeal(){

      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .person {
    width:100px;
    margin-top: 10px;
    /* background: #f6f6f6;  */
    border:1px solid red;
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
    margin: 37px auto 20px 340px;
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
  .leftSku{
    position: absolute;
    width:300px;
    height:500px;
    margin-top:40px;
    margin-left:40px;
  }
  .selectSku{
    margin-top:10px;
    margin-left:40px;
    width:220px;
    height: 64px;
    /* border: solid 1px #DCDFE6;
    color: #606266; */
  }
  .rightForm{
    float: right;
    margin-top: 35px;
    right: -360px;
    width: 339px;
  }
  .clearfix{
    width:310px;
    text-align: left;
    font-size: 17px;
    font-weight:bold;
  }
</style>
