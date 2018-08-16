<template>
    <div>
    	<!--外边框-->
    	<div class="outline">
    		<!--套餐-->
			<el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
			  <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title" :name="item.name">
			    <!--套餐名-->
  				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="套餐名" prop="highlightWords">
              <el-input maxlength=10 v-model="ruleForm.highlightWords" class="highlightWords-input1" placeholder="10个字以内"></el-input>
              <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
            </el-form-item>
          </el-form>
			    <!--套餐名结束-->
          <!--交通信息-->
          <div class="traffic">
            <div class="traffic_title">交通信息</div>
            <div class="traffic_border">
              <div>
                <div class="traffic_button">去程</div>
                <div class="traffic_button"><el-button type="primary">添加中转</el-button></div>
              </div>
              <!--飞机-->
              <div class="plane">
                <el-select class="plane_type" v-model="value5" placeholder="飞机">
                  <el-option v-for="item in options" :key="item.value" :label="item.label":value="item.value"></el-option>
                </el-select>
                <span class="plane_text">第</span>
                <el-select class="plane_type" v-model="value11" collapse-tags style="margin-left: 20px;" placeholder="1">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="plane_text">天</span>
                <!--第一行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">航空公司</div>
                    <div class="aviation_input"><el-input v-model="input" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">航班号</div>
                    <div class="aviation_input"><el-input v-model="input1" placeholder="请输入内容"></el-input></div>
                  </div>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发城市</div>
                    <div class="aviation_input"><el-input v-model="input2" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发机场</div>
                    <div class="aviation_input"><el-input v-model="input3" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value1" type="date" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达城市</div>
                    <div class="aviation_input"><el-input v-model="input4" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达机场</div>
                    <div class="aviation_input"><el-input v-model="input5" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value2" type="date" placeholder="选择到达时间"></el-date-picker></div>
                  </div>
                  <el-select class="day" v-model="value3" placeholder="当日">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                  </el-select>
                </div>
                <!--第三行结束-->
                <div class="stop"><el-button plain>添加经停</el-button></div>
              </div>
              <!--飞机结束-->

              <!--火车-->
              <div class="plane">
                <el-select class="plane_type" v-model="value7" placeholder="火车">
                  <el-option v-for="item in options" :key="item.value" :label="item.label":value="item.value"></el-option>
                </el-select>
                <span class="plane_text">第</span>
                <el-select class="plane_type" v-model="value8" collapse-tags style="margin-left: 20px;" placeholder="1">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="plane_text">天</span>
                <!--第一行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">车次</div>
                    <div class="aviation_input"><el-input v-model="input6" placeholder="请输入内容"></el-input></div>
                  </div>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发城市</div>
                    <div class="aviation_input"><el-input v-model="input7" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发机场</div>
                    <div class="aviation_input"><el-input v-model="input8" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value4" type="date" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达城市</div>
                    <div class="aviation_input"><el-input v-model="input9" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达机场</div>
                    <div class="aviation_input"><el-input v-model="input10" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value6" type="date" placeholder="选择到达时间"></el-date-picker></div>
                  </div>
                  <el-select class="day" v-model="value9" placeholder="当日">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                  </el-select>
                </div>
                <!--第三行结束-->
                <div class="stop"><el-button class="stop_button" plain>删除中转</el-button></div>
              </div>
              <!--火车结束-->

              <div class="traffic_button">返程</div>
              <!--汽车-->
              <div class="plane">
                <el-select class="plane_type" v-model="value10" placeholder="汽车">
                  <el-option v-for="item in options" :key="item.value" :label="item.label":value="item.value"></el-option>
                </el-select>
                <span class="plane_text">第</span>
                <el-select class="plane_type" v-model="value11" collapse-tags style="margin-left: 20px;" placeholder="1">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="plane_text">天</span>
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发城市</div>
                    <div class="aviation_input"><el-input v-model="input11" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发机场</div>
                    <div class="aviation_input"><el-input v-model="input12" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value19" type="date" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达城市</div>
                    <div class="aviation_input"><el-input v-model="input13" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达机场</div>
                    <div class="aviation_input"><el-input v-model="input14" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value12" type="date" placeholder="选择到达时间"></el-date-picker></div>
                  </div>
                  <el-select class="day" v-model="value13" placeholder="当日">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                  </el-select>
                </div>
                <!--第三行结束-->
                <div class="stop"><el-button class="stop_button" plain>删除中转</el-button></div>
              </div>
              <!--汽车结束-->
              <!--轮船-->
              <div class="plane">
                <el-select class="plane_type" v-model="value14" placeholder="轮船">
                  <el-option v-for="item in options" :key="item.value" :label="item.label":value="item.value"></el-option>
                </el-select>
                <span class="plane_text">第</span>
                <el-select class="plane_type" v-model="value15" collapse-tags style="margin-left: 20px;" placeholder="1">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="plane_text">天</span>
                <!--第一行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">航空公司</div>
                    <div class="aviation_input"><el-input v-model="input15" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">航班号</div>
                    <div class="aviation_input"><el-input v-model="input16" placeholder="请输入内容"></el-input></div>
                  </div>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发城市</div>
                    <div class="aviation_input"><el-input v-model="input17" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发机场</div>
                    <div class="aviation_input"><el-input v-model="input18" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value16" type="date" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达城市</div>
                    <div class="aviation_input"><el-input v-model="input19" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达机场</div>
                    <div class="aviation_input"><el-input v-model="input20" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value17" type="date" placeholder="选择到达时间"></el-date-picker></div>
                  </div>
                  <el-select class="day" v-model="value18" placeholder="当日">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                  </el-select>
                </div>
                <!--第三行结束-->
                <div class="stop"><el-button class="stop_button" plain>删除中转</el-button></div>
              </div>
              <!--轮船结束-->




            </div>
          </div>
          <!--交通信息结束-->

          <!--酒店信息-->
          <div class="traffic">
            <div class="traffic_title">酒店信息</div>
            <div class="traffic_border">
              <div class="hotel_button"><el-button type="primary">添加酒店</el-button></div>
              <!--酒店-->
              <div class="plane">
                <!--第一行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">自动填充</div>
                      <el-col :span="12" class="inline-input">
                        <el-autocomplete  style="width:200px;" v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
                      </el-col>
                  </div>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">酒店中文</div>
                    <div class="aviation_input"><el-input v-model="input21" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">酒店英文</div>
                    <div class="aviation_input"><el-input v-model="input22" placeholder="请输入内容"></el-input></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">酒店地址</div>
                    <div class="aviation_input"><el-input v-model="input23" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">酒店星级</div>
                    <el-select class="aviation_input" v-model="value20" placeholder="三星">
                      <el-option v-for="item in options3" :key="item.value" :label="item.label":value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <!--第三行结束-->
                <!--第四行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">所在城市</div>
                    <div class="aviation_input"><el-input v-model="input24" placeholder="请输入内容"></el-input></div>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">入住晚数</div>
                    <el-select class="aviation_input" v-model="value21" placeholder="一宿">
                      <el-option v-for="item in options4" :key="item.value" :label="item.label":value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <!--第四行结束-->
                <!--第五行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">房型</div>
                    <el-select class="aviation_input" v-model="value22" placeholder="单人间">
                      <el-option v-for="item in options5" :key="item.value" :label="item.label":value="item.value"></el-option>
                    </el-select>
                  </div>
                  <!--第二个-->
                  <div class="aviation_first">
                    <div class="aviation_text">床型</div>
                    <el-select class="aviation_input" v-model="value23" placeholder="双人床">
                      <el-option v-for="item in options6" :key="item.value" :label="item.label":value="item.value"></el-option>
                    </el-select>
                  </div>
                </div>
                <!--第五行结束-->
                <!--第六行-->
                <div class="aviation">
                  <div class="aviation_first">
                    <div class="aviation_text">图片</div>
                    <div class="aviation_input" style="position: relative;">
                      <el-input v-model="input24" placeholder="请输入内容"></el-input>
                      <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/":on-preview="handlePreview":on-remove="handleRemove"
                        :file-list="fileList2"
                        list-type="picture">
                        <el-button type="primary">上传</el-button>
                      </el-upload>
                    </div>
                  </div>
                </div>
                <!--第六行结束-->
                <!--第七行-->
                <div class="aviation">
                  <div class="aviation_text">简介</div>
                  <div class="textarea"><el-input type="textarea":rows="10" placeholder="请输入内容"v-model="textarea3"></el-input></div>
                </div>
                <!--第七行结束-->
                <div class="stop"><el-button class="stop_button" plain>删除酒店</el-button></div>
              </div>
              <!--飞机结束-->





            </div>
          </div>
          <!--酒店信息结束-->

          <!--日程信息-->
          <div class="traffic">
            <div class="traffic_title">日程信息</div>
            <div class="traffic_border">
              <!--酒店-->
              <div class="plane">
                <div class="date">DAY1</div>
                <!--第一行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">主题</div>
                    <div class="aviation_input"><el-input v-model="input26" placeholder="请输入内容"></el-input></div>
                  </div>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">住宿</div>
                    <div class="radio_input">
                      <el-radio v-model="radio" label="1">酒店</el-radio>
                      <el-radio v-model="radio" label="2">其他</el-radio>
                    </div>
                  </div>
                </div>
                <!--第二行结束-->
                
                
              </div>
            </div>
          </div>
          <!--日程信息结束-->







			  </el-tab-pane>
			</el-tabs>
    		<!--套餐结束-->
    	</div> 
    </div>
</template>

<script>
  export default {
    data() {
      return {
        editableTabsValue: '1',
        editableTabs: [{
          title: '普吉蜜月',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: '默认套餐1',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2,
        number: '0/10',
        items: {
           text:''
        },
        options: [{
          value: '选项1',
          label: '飞机'
        }, {
          value: '选项2',
          label: '火车'
        }, {
          value: '选项3',
          label: '汽车'
        }, {
          value: '选项4',
          label: '轮船'
        }],
        value5: [],
        options1: [{
          value: '选项1',
          label: '1'
        }, {
          value: '选项2',
          label: '2'
        }, {
          value: '选项3',
          label: '3'
        }, {
          value: '选项4',
          label: '4'
        }],
        value11: [],
         options2: [{
          value: '选项1',
          label: '当日'
        }, {
          value: '选项2',
          label: '第一天'
        }, {
          value: '选项3',
          label: '第一天'
        }, {
          value: '选项4',
          label: '第一天'
        }],
        options3: [{
          value: '选项1',
          label: '三星'
        }, {
          value: '选项2',
          label: '四星'
        }, {
          value: '选项3',
          label: '五星'
        }],
        value20: [],
        options4: [{
          value: '选项1',
          label: '一宿'
        }, {
          value: '选项2',
          label: '两宿'
        }, {
          value: '选项3',
          label: '三宿'
        }],
        value21: [],
        options5: [{
          value: '选项1',
          label: '单人间'
        }, {
          value: '选项2',
          label: '双人间'
        }, {
          value: '选项3',
          label: '三人间'
        }],
        options6: [{
          value: '选项1',
          label: '双人床'
        }, {
          value: '选项2',
          label: '双人床'
        }, {
          value: '选项3',
          label: '双人床'
        }],
        input: '',
        input1:'',
        input2:'',
        input3:'',
        input4:'',
        input5:'',
        input6:'',
        input7:'',
        input8:'',
        input9:'',
        input10:'',
        input11:'',
        input12:'',
        input13:'',
        input14:'',
        input15:'',
        input16:'',
        input17:'',
        input18:'',
        input19:'',
        input20:'',
        input21:'',
        input22:'',
        input23:'',
        input24:'',
        input25:'',
        input26:'',
        value1:'',
        value2:'',
        value4:'',
        value6:'',
        value7:'',
        value8:'',
        value9:'',
        value10:'',
        value11:'',
        value12:'',
        value13:'',
        value14:'',
        value15:'',
        value16:'',
        value17:'',
        value18:'',
        value19:'',
        value20:'',
        value21:'',
        value22:'',
        value23:'',
        restaurants: [],
        state2: '',
        textarea3:'',
        ruleForm:{
          productName: '',
          travelType: "1",
          placeDeparture: '',
          travelDays: '',
          travelNight: '',
          orderConfirmationType: "1",
          operationLabel: '',
          Excursion: '',
          theme: '',
          advanceRegistrationDays: '',
          timeHour: '',
          timeMinute: '',
          highlightWords: ''
        },
        rules:{
          highlightWords:[
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' },
          ],
        },
        fileList2:[],
        radio: '1'
      }
    },
    watch:{   //watch()监听某个值（双向绑定）的变化，从而达到change事件监听的效果
        items:{
            handler:function(){
                var _this = this;
                var _sum = 10; //字体限制为10个
                _this.$refs.count.setAttribute("maxlength",_sum);
                _this.number= _sum- _this.$refs.count.value.length;
            },
            deep:false
        }
    },
    methods: {
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" }
        ];
      },
      handleSelect(item) {
        console.log(item);
      },
       handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    },
    mounted() {
      this.restaurants = this.loadAll();
    }
    
  }
</script>

<style scoped>
	.outline{border:1px solid #f2f2f2; overflow: hidden; margin: 0 0 100px 0;}

  .highlightWords-input1{width: 200px;float: left;}
  .span1{float: left; margin: 0 0 0 10px;}

	.package{text-align: left; line-height: 40px; margin: 20px 0 0 30px;}
	.package_text{float: left; margin: 0 15px 0 0;}
	.package_input{float: left; width: 200px; margin: 0 15px 0 0;}

  .traffic{margin: 20px 0 0 30px; text-align: left;}
  .traffic_title{font-size: 14pt; font-weight: bold; line-height: 60px;}
  .traffic_border{ border:1px solid #f2f2f2; width: 80%; overflow: hidden; margin: 0 0 20px 0;}
  .traffic_button{float: left; margin: 10px 0 20px 30px; line-height: 40px;}
  .plane{width: 98%; overflow: hidden;background-color: #f7f7f7; margin-left:1%; margin-bottom:20px; margin-top:20px;    }
  .plane_type{ width: 80px; margin: 20px 0 0 20px;}
  .plane_text{ margin: 0 0 0 15px; }
  .aviation{padding: 20px 0 0 0; clear: both; width: 100%;}
  .aviation_first{margin: 0 20px 0 0; float: left;}
  .aviation_text{width: 85px; text-align: right; margin: 0 15px 0 0; float: left; line-height: 40px;}
  .aviation_input{ width: 200px; float: left; }
  .day{ width: 85px; float: left; margin:0 0 0 25px;  }
  .stop{clear: both; padding: 20px 0 20px 20px;}
  .stop_button{border:1px solid #ff4b3a;}

  .hotel_button{ line-height: 40px; margin: 10px 0 20px 15px; }
  .inline-input{float: left;width: 200px !important;}
  .upload-demo{position: absolute; top: 0; left:200px; height: 40px;}
  .textarea{float: left;  width:60%;}

  .date{margin: 10px 0 0 30px; line-height: 40px;}
  .radio_input{float: left; margin: 10px 0 0 0;}

</style>
