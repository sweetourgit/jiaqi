<template>
  <div class="vivo" style="position:relative">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <div class="btn" style="width:200px;position:absolute;z-index:99;top:0px;left:50%;">
        <el-button plain class="btn-button" @click="cancel()">取消</el-button>
        <el-button class="btn-button" style="background:#3095fa;color:#fff" @click="addsave('ruleForm')">保存</el-button>
      </div>
      {{changeobj}}
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 行程信息 -->
        <el-tab-pane label="行程信息" name="second">
          <!-- <TripInfo :inputravelDays="travelDays"></TripInfo> -->
          <div class="tripInfo">
            <!-- <div class="btn">
              <el-button plain>取消</el-button>
              <el-button type="primary" @click="addsave('ruleForm')">保存</el-button>
            </div> -->
            <!--外边框-->
            <div class="outline">
              <!--套餐-->
              <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="handlePoint" @tab-remove = "handledelete">
                <el-tab-pane :key="index" v-for="(item, index) in editableTabs" :label="item.title" :name="item.name">
                  <div  class="border_side">
                    <!--套餐名-->
                    <el-form-item class="setmeal" label="套餐名" label-width="100px">
                      <el-input maxlength=10 v-model="ruleForm.highlightWords" class="highlightWords-input1" placeholder="10个字以内"></el-input>
                      <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
                    </el-form-item>
                    <!--出发地-->
                    <div class="setout"><span>*</span>出发地</div>
                    <el-form-item prop="origin" style="float:left">
                      <el-select class="depart" v-model="ruleForm.origin" placeholder="出发地" value-key="id">
                        <el-option v-for="item in dynamicTags3" :key="item.pod" :label="item.pod" :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                    <!--目的地-->
                    <div class="aid_address" style="float: left;">
                      <div class="setout"><span>*</span>目的地</div>
                      <el-form-item prop="bourn" style="float:left">
                        <el-select class="depart" v-model="ruleForm.bourn" placeholder="目的地" value-key="id">
                          <el-option v-for="item in dynamicTags4" :key="item.destination" :label="item.destination" :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>

                    <!--套餐名结束-->
                  </div>
                  <!--切换-->
                  <div class="tab_size" style="float: left; width: 1262px; margin-top: 35px;margin-left: 35px;">
                    <el-tabs v-model="tabInformation" @tab-click="handClick">
                      <el-tab-pane label="交通信息"   name="traffic">
                        <!--交通信息-->
                        <div class="traffic">
                          <div class="traffic_title">交通信息</div>
                          <!--描述方式-->
                          <div class="describe_way">描述方式</div>
                          <ul class="description">
                            <li v-for="(item,index) in describe" :key="index" :class="{active:index == num}" @click="tab(index)">
                        <span v-if="index=='0'">
                          <el-radio  label="0" v-model="matter_radio" checked>{{item}}</el-radio>
                        </span>
                              <span v-if="index=='1'">
                          <el-radio label="1" v-model="matter_radio">{{item}}</el-radio>
                        </span>
                            </li>
                          </ul>
                          <!--描述方式结束-->
                          <div v-for="(itemCon,index) in pattern" :key="index" v-show="index == num">
                            <!--详细说明-->
                            <div v-if="index ==0" class="traffic_border">
                              <div>
                                <div class="traffic_button">去程</div>
                                <div class="traffic_button">
                                  <el-button @click="addTransit" type="primary">添加中转</el-button>
                                </div>
                              </div>
                              <!--去程-->
                              <div class="plane" v-for="(item, index) in ruleForm.plane" :key="item.index">
                                <div class="" style=" clear:both; margin:0 0 0 0; position:relative;">
                                  <el-cascader class="plane_type" v-model="selectedOptions" :options="goRoad" @change="(v)=>{item.trafficMode=v[0]}" placeholder="飞机" @blur="trafficClear(index)"></el-cascader>
                                  <span class="plane_text">第</span>
                                  <el-select class="plane_type" v-model="item.day" collapse-tags style="margin-left: 20px;" placeholder="1">
                                    <el-option v-for="(item,index) in goDate" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                  </el-select>
                                  <span class="plane_text">天</span>
                                  <!--航班号自动填充-->
                                  <div class="aviation" style="position:absolute; top:20px; left:300px;">
                                    <el-form :model="item" label-width="100px" style="float:left;">
                                      <el-form-item label="自动填充" prop="pod">
                                        <!-- <el-autocomplete class="inputBox" clearable placeholder="请输入航班号" :fetch-suggestions="querySearch" v-model="item.pod" :trigger-on-focus="false" @select="handleSelectPod">
                                         </el-autocomplete> -->
                                        <el-input class="inputBox" @clear="clearBle(index)" clearable placeholder="请输入航班号" :fetch-suggestions="querySearch" v-model="item.pod" :trigger-on-focus="false" @blur="handleSelectPod_01(index)">
                                        </el-input>
                                      </el-form-item>
                                    </el-form>
                                  </div>
                                </div>
                                <div v-if="item.trafficMode == '1'">
                                  <!--第一行-->
                                  <div class="aviation" style="margin-top:20px;">
                                    <!--第一个-->
                                    <el-form-item :prop="'plane.'+index+'.company'" :rules="rules.company" label="航空公司" label-width="100px" style="float:left;">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入航空公司" :fetch-suggestions="querySearch" v-model="item.company" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <div style="float:left;">
                                      <el-form-item label-width="100px" label="航班号" :prop="'plane.'+index+'.theNumber'" :rules="rules.theNumber" style="width:280px">
                                        <el-autocomplete class="inputBox" clearable placeholder="请输入航班号" :fetch-suggestions="querySearch" v-model="item.theNumber" :trigger-on-focus="false">
                                        </el-autocomplete>
                                      </el-form-item>
                                    </div>
                                  </div>
                                  <!--第一行结束-->

                                  <!--第二行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" label-width="100px" :prop="'plane.'+index+'.podCity'" :rules="rules.podCity" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发机场" label-width="100px" :prop="'plane.'+index+'.podPlace'" :rules="rules.podPlace" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发机场" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" :prop="'plane.'+index+'.arriveCity'" :rules="rules.arriveCity" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达机场" label-width="100px" :prop="'plane.'+index+'.arrivePlace'" :rules="rules.arrivePlace" style="float:left;">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达机场" :fetch-suggestions="querySearch" v-model="item.arrivePlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                      <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <!--添加经停-->
                                  <div closable>
                                    <div class="transit_border" v-show="lineshow"></div>
                                    <div class="abc" v-for="(iteml, p) in item.ext_Stopover" :key="p" type="text">
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停城市" prop="stopCity">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停城市" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停时间" prop="stopDate">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停时间" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <div class="minutes">分钟</div>
                                      <div class="delete" @click="deleteItem(p,index)">删除</div>
                                    </div>
                                  </div>
                                  <!--添加经停结束-->
                                  <div class="transit">
                                    <el-button style="float:left; margin-bottom:10px;" @click="stopping(index)">添加经停</el-button>
                                  </div>
                                  <div class="addTab">
                                    <div v-show="index != '0'"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                                <div v-if="item.trafficMode == '2'">
                                  <!--第一行-->
                                  <div class="aviation" style="margin-top:20px;">
                                    <!--第一个-->
                                    <el-form-item label="车次" label-width="100px" :prop="'plane.'+index+'.theNumber'" :rules="rules.theNumber">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发车次" :fetch-suggestions="querySearch" v-model="item.theNumber" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第一行结束-->
                                  <!--第二行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" label-width="100px" :prop="'plane.'+index+'.podCity'" :rules="rules.podCity" style="float:left;">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发车站" label-width="100px" :prop="'plane.'+index+'.podPlace'" :rules="rules.podPlace" style="float:left;">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发车站" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" :prop="'plane.'+index+'.arriveCity'" :rules="rules.arriveCity" style="float:left;">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达车站" label-width="100px" :prop="'plane.'+index+'.arrivePlace'" :rules="rules.arrivePlace" style="float:left;">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达车站" :fetch-suggestions="querySearch" v-model="item.arrivePlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                        <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                      </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <!--第三行结束-->
                                  <div class="stop">
                                    <div v-show="index != '0'"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                                <div v-if="item.trafficMode == '3'">
                                  <!--第二行-->
                                  <div class="aviation" style="margin-top:20px;">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" style="float:left;" label-width="100px" :prop="'plane.'+index+'.podCity'" :rules="rules.podCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发车站"  label-width="100px" style="float:left;" :prop="'plane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发车站" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" style="float:left;" :prop="'plane.'+index+'.arriveCity'" :rules="rules.arriveCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达车站" prop="podPlace" label-width="100px" style="float:left;" :prop="'plane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达车站" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                        <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                      </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <div class="stop">
                                    <div v-show="index != '0'"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                                <div v-if="item.trafficMode == '4'">
                                  <!--第一行-->
                                  <div class="aviation" style="margin-top:20px; position:relative;">
                                    <!--第一个-->
                                    <el-form-item label="游轮公司" :prop="'plane.'+index+'.company'" :rules="rules.company" label-width="100px" style="float:left;">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入游轮公司" :fetch-suggestions="querySearch" v-model="item.company" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="游轮号" label-width="100px" style="float:left;" :prop="'plane.'+index+'.theNumber'" :rules="rules.theNumber">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入游轮号" :fetch-suggestions="querySearch" v-model="item.theNumber" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第一行结束-->
                                  <!--第二行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" label-width="100px" style="float:left;" :prop="'plane.'+index+'.podCity'" :rules="rules.podCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发码头" label-width="100px" style="float:left;" :prop="'plane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发码头" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'plane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" style="float:left;" :prop="'plane.'+index+'.arriveCity'" :rules="rules.arriveCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达码头" label-width="100px" style="float:left;" :prop="'plane.'+index+'.arrivePlace'" :rules="rules.arrivePlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达码头" :fetch-suggestions="querySearch" v-model="item.arrivePlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                        <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                      </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'plane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <!--添加经停-->
                                  <div closable>
                                    <div class="transit_border" v-show="lineshow"></div>
                                    <div class="abc" v-for="(iteml, p) in item.ext_Stopover" :key="p" type="text">
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停城市" prop="stopCity">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停城市" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停时间" prop="stopDate">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停时间" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <div class="minutes">分钟</div>
                                      <div class="delete" @click="deleteItem(p,index)">删除</div>
                                    </div>
                                  </div>
                                  <!--添加经停结束-->
                                  <div class="transit">
                                    <el-button style="float:left; margin-bottom:10px;" @click="stopping(index)">添加经停</el-button>
                                  </div>
                                  <div class="addTab" v-show="deleteTransit">
                                    <div v-show="index !='0'"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                              </div>
                              <!--返程-->
                              <div style="clear:both;">
                                <div class="traffic_button">返程</div>
                                <div class="traffic_button">
                                  <el-button @click="addRTransit" type="primary">添加中转</el-button>
                                </div>
                              </div>
                              <div class="plane" v-for="(item, index) in ruleForm.nackPlane" :key="item.index">
                                <div class="" style=" clear:both; margin:0 0 0 0; position:relative;">
                                  <el-cascader class="plane_type" v-model="selectedOptions_01" :options="goRoad" @change="(v)=>{item.trafficMode=v[0]}" placeholder="飞机" @blur="trafficGoClear(index)"></el-cascader>
                                  <span class="plane_text">第</span>
                                  <el-select class="plane_type" v-model="item.day" collapse-tags style="margin-left: 20px;" placeholder="1">
                                    <el-option v-for="item in goDate" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                  </el-select>
                                  <span class="plane_text">天</span>
                                  <!--航班号自动填充-->
                                  <div class="aviation" style="position:absolute; top:20px; left:300px;">
                                    <el-form :model="item" label-width="100px" style="float:left;">
                                      <el-form-item label="自动填充" prop="pod">
                                        <!-- <el-autocomplete class="inputBox" clearable placeholder="请输入航班号" :fetch-suggestions="querySearch" v-model="item.pod" :trigger-on-focus="false" @select="handleSelectPod">
                                         </el-autocomplete> -->
                                        <el-input class="inputBox" clearable @clear="clearBle_01(index)" placeholder="请输入航班号" :fetch-suggestions="querySearch" v-model="item.pod" :trigger-on-focus="false" @blur="handleSelectPod_02(index)">
                                        </el-input>
                                      </el-form-item>
                                    </el-form>
                                  </div>
                                </div>
                                <!--飞机-->
                                <div v-if="item.trafficMode == '1'">
                                  <!--第一行-->
                                  <div class="aviation" style="margin-top:20px;">
                                    <!--第一个-->
                                    <el-form-item label="航空公司" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.company'" :rules="rules.company">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入航空公司" :fetch-suggestions="querySearch" v-model="item.company" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="航班号" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.theNumber'" :rules="rules.theNumber">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入航班号" :fetch-suggestions="querySearch" v-model="item.theNumber" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第一行结束-->
                                  <!--第二行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podCity'" :rules="rules.podCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发机场" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发机场" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.arriveCity'" :rules="rules.arriveCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达机场" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.arrivePlace'" :rules="rules.arrivePlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达机场" :fetch-suggestions="querySearch" v-model="item.arrivePlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                        <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                      </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <!--添加经停-->
                                  <div type="card" closable>
                                    <div class="transit_border" v-show="Returnline"></div>
                                    <div class="abc" v-for="(iteml, p) in item.ext_Stopover" :key="p" type="text">
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停城市" prop="stopCity">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停城市" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停时间" prop="stopDate">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停时间" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <div class="minutes">分钟</div>
                                      <div class="delete" @click="reDeleteItem(p,index)">删除</div>
                                    </div>
                                  </div>
                                  <!--添加经停结束-->
                                  <div class="transit">
                                    <el-button style="float:left; margin-bottom:10px;" @click="reStopping(index)">添加经停</el-button>
                                  </div>
                                  <div class="addTab" v-show="deleteTransit">
                                    <div v-show="index != '0'"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                                <div v-if="item.trafficMode == '2'">
                                  <!--第一行-->
                                  <div class="aviation" style="margin-top:20px;">
                                    <!--第一个-->
                                    <el-form-item label="车次" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.theNumber'" :rules="rules.theNumber">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入车次" :fetch-suggestions="querySearch" v-model="item.theNumber" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第一行结束-->
                                  <!--第二行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podCity'" :rules="rules.podCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发车站" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发车站" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.arriveCity'" :rules="rules.arriveCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达车站" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.arrivePlace'" :rules="rules.arrivePlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达车站" :fetch-suggestions="querySearch" v-model="item.arrivePlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                        <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                      </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <!--第三行结束-->
                                  <div class="stop">
                                    <div v-show="index != '0'"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                                <div v-if="item.trafficMode == '3'">
                                  <!--第二行-->
                                  <div class="aviation" style="margin-top:20px;">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podCity'" :rules="rules.podCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发车站" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发车站" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.arriveCity'" :rules="rules.arriveCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达车站" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达车站" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                        <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                      </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <!--第三行结束-->
                                  <div class="stop">
                                    <div v-show="index != '0'"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                                <div v-if="item.trafficMode == '4'">
                                  <!--第一行-->
                                  <div class="aviation" style="margin-top:20px; position:relative;">
                                    <!--第一个-->
                                    <el-form-item label="游轮公司" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.company'" :rules="rules.company">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入游轮公司" :fetch-suggestions="querySearch" v-model="item.company" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="游轮号" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.theNumber'" :rules="rules.theNumber">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入游轮号" :fetch-suggestions="querySearch" v-model="item.theNumber" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第一行结束-->
                                  <!--第二行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="出发城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podCity'" :rules="rules.podCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发城市" :fetch-suggestions="querySearch" v-model="item.podCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="出发码头" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.podPlace'" :rules="rules.podPlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发码头" :fetch-suggestions="querySearch" v-model="item.podPlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-date-picker style="width:200px;" v-model="item.podTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择出发时间"></el-date-picker>
                                    </el-form-item> -->
                                    <el-form-item label="出发时间" label-width="100px" :prop="'nackPlane.'+index+'.podTime'" :rules="rules.podTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入出发时间" :fetch-suggestions="querySearch" v-model="item.podTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                  </div>
                                  <!--第二行结束-->
                                  <!--第三行-->
                                  <div class="aviation">
                                    <!--第一个-->
                                    <el-form-item label="到达城市" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.arriveCity'" :rules="rules.arriveCity">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达城市" :fetch-suggestions="querySearch" v-model="item.arriveCity" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第二个-->
                                    <el-form-item label="到达码头" label-width="100px" style="float:left;" :prop="'nackPlane.'+index+'.arrivePlace'" :rules="rules.arrivePlace">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达码头" :fetch-suggestions="querySearch" v-model="item.arrivePlace" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <!--第三个-->
                                    <!-- <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left;">
                                        <el-date-picker style="width:200px;" v-model="item.arriveTime" value-format="yyyy-MM-dd HH-mm-ss" type="datetime" placeholder="选择到达时间"></el-date-picker>
                                      </el-form-item> -->
                                    <el-form-item label="到达时间" label-width="100px" :prop="'nackPlane.'+index+'.arriveTime'" :rules="rules.arriveTime" style="float:left">
                                      <el-autocomplete class="inputBox" clearable placeholder="请输入到达时间" :fetch-suggestions="querySearch" v-model="item.arriveTime" :trigger-on-focus="false">
                                      </el-autocomplete>
                                    </el-form-item>
                                    <el-select class="day" v-model="item.planeDay" placeholder="当日">
                                      <el-option v-for="item in goDay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                  </div>
                                  <!--第三行结束-->
                                  <!--添加经停-->
                                  <div type="card" closable>
                                    <div class="transit_border" v-show="lineshow"></div>
                                    <div class="abc" v-for="(iteml, p) in item.ext_Stopover" :key="p" type="text">
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停城市" prop="stopCity">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停城市" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <el-form label-width="100px" style="float:left;">
                                        <el-form-item label="经停时间" prop="stopDate">
                                          <el-autocomplete class="inputBox" clearable placeholder="请输入经停时间" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                          </el-autocomplete>
                                        </el-form-item>
                                      </el-form>
                                      <div class="minutes">分钟</div>
                                      <div class="delete" @click="reDeleteItem(p,index)">删除</div>
                                    </div>
                                  </div>
                                  <!--添加经停结束-->
                                  <div class="transit">
                                    <el-button style="float:left; margin-bottom:10px;" @click="reStopping(index)">添加经停</el-button>
                                  </div>
                                  <div class="addTab" v-show="deleteTransit">
                                    <div v-show="index !='0'"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--详细说明结束-->
                            <!--简要说明-->
                            <div class="traffic_border" v-if="index ==1">
                              <div class="cost_content" style="background: #FFFFFF">
                                <vue-editor v-model="content"></vue-editor>
                              </div>
                            </div>
                            <!--简要说明结束-->
                          </div>
                        </div>
                        <!--交通信息结束-->
                      </el-tab-pane>
                      <!--TODO 酒店暂时没有-->
                      <!--  <el-tab-pane label="酒店信息" name="hotle">
                          &lt;!&ndash;酒店信息&ndash;&gt;
                          <div class="traffic">
                            <div class="traffic_title">酒店信息</div>
                            <el-button type="primary" size="small" style="position: absolute;top: 40px;right: 200px;">修改保存</el-button>
                            <div class="traffic_border">
                              <div class="hotel_button">
                                <el-button @click="addHotel" type="primary">添加酒店</el-button>
                              </div>
                              &lt;!&ndash;酒店&ndash;&gt;
                              <div type="card" closable v-for="(item, index) in hotel" :key="index">
                                <div class="plane">
                                  &lt;!&ndash;第一行&ndash;&gt;
                                  <div class="aviation" style="margin-top:20px;">
                                    &lt;!&ndash;第一个&ndash;&gt;
                                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                                      <el-form-item label="自动填充" prop="hotelAuto">
                                        <el-autocomplete class="inputBox" clearable placeholder="输入酒店名称" :fetch-suggestions="querySearch" v-model="item.hotelAuto" :trigger-on-focus="false" @select="handleSelect">
                                        </el-autocomplete>
                                      </el-form-item>
                                    </el-form>
                                  </div>
                                  &lt;!&ndash;第一行结束&ndash;&gt;
                                  &lt;!&ndash;第二行&ndash;&gt;
                                  <div class="aviation">
                                    &lt;!&ndash;第一个&ndash;&gt;
                                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                                      <el-form-item label="酒店中文" prop="hotelChinese">
                                        <el-autocomplete class="inputBox" clearable placeholder="请输入酒店中文" :fetch-suggestions="querySearch" v-model="item.hotelChinese" :trigger-on-focus="false">
                                        </el-autocomplete>
                                      </el-form-item>
                                    </el-form>
                                    &lt;!&ndash;第二个&ndash;&gt;
                                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                                      <el-form-item label="酒店英文" prop="hotelEnglish">
                                        <el-autocomplete class="inputBox" clearable placeholder="请输入酒店英文" :fetch-suggestions="querySearch" v-model="item.hotelEnglish" :trigger-on-focus="false">
                                        </el-autocomplete>
                                      </el-form-item>
                                    </el-form>
                                  </div>
                                  &lt;!&ndash;第二行结束&ndash;&gt;
                                  &lt;!&ndash;第三行&ndash;&gt;
                                  <div class="aviation">
                                    &lt;!&ndash;第一个&ndash;&gt;
                                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                                      <el-form-item label="酒店地址" prop="hotelAddress">
                                        <el-autocomplete class="inputBox" clearable placeholder="请输入酒店地址" :fetch-suggestions="querySearch" v-model="item.hotelAddress" :trigger-on-focus="false">
                                        </el-autocomplete>
                                      </el-form-item>
                                    </el-form>
                                    &lt;!&ndash;第二个&ndash;&gt;
                                    <div class="aviation_first">
                                      <div class="aviation_text">酒店星级</div>
                                      <el-select class="aviation_input" v-model="item.hotelStar" placeholder="三星">
                                        <el-option v-for="item in hotelStars" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                  &lt;!&ndash;第三行结束&ndash;&gt;
                                  &lt;!&ndash;第四行&ndash;&gt;
                                  <div class="aviation">
                                    &lt;!&ndash;第一个&ndash;&gt;
                                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                                      <el-form-item label="所在城市" prop="hotelCity">
                                        <el-autocomplete class="inputBox" clearable placeholder="请输入所在城市" :fetch-suggestions="querySearch" v-model="item.hotelCity" :trigger-on-focus="false">
                                        </el-autocomplete>
                                      </el-form-item>
                                    </el-form>
                                    &lt;!&ndash;第二个&ndash;&gt;
                                    <div class="aviation_first">
                                      <div class="aviation_text">入住晚数</div>
                                      <el-select class="aviation_input" v-model="item.hotelDay" placeholder="一天">
                                        <el-option v-for="item in hotelDays" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                  &lt;!&ndash;第四行结束&ndash;&gt;
                                  &lt;!&ndash;第五行&ndash;&gt;
                                  <div class="aviation">
                                    &lt;!&ndash;第一个&ndash;&gt;
                                    <div class="aviation_first">
                                      <div class="aviation_text">房型</div>
                                      <el-select class="aviation_input" v-model="item.hotelHouse" placeholder="单人间">
                                        <el-option v-for="item in hotelRoom" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                      </el-select>
                                    </div>
                                    &lt;!&ndash;第二个&ndash;&gt;
                                    <div class="aviation_first">
                                      <div class="aviation_text">床型</div>
                                      <el-select class="aviation_input" v-model="item.hotelBed" placeholder="双人床">
                                        <el-option v-for="item in hotelType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                      </el-select>
                                    </div>
                                  </div>
                                  &lt;!&ndash;第五行结束&ndash;&gt;
                                  &lt;!&ndash;第六行&ndash;&gt;
                                  <div class="aviation" style="padding-top:20px;">
                                    <div class="aviation_first">
                                      <div class="aviation_text">图片</div>
                                      <div class="aviation_input" style="position: relative;">
                                        <el-input placeholder="请输入内容"></el-input>
                                        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
                                          <el-button type="primary">上传</el-button>
                                        </el-upload>
                                      </div>
                                    </div>
                                  </div>
                                  &lt;!&ndash;第六行结束&ndash;&gt;
                                  &lt;!&ndash;第七行&ndash;&gt;
                                  <div class="aviation" style="padding-top:20px;">
                                    <div class="aviation_text">简介</div>
                                    <div class="textarea">
                                      <el-input type="textarea" :rows="10" placeholder="请输入简介" v-model="item.hotelAbstract"></el-input>
                                    </div>
                                  </div>
                                  &lt;!&ndash;第七行结束&ndash;&gt;
                                  <div class="stop">
                                    <el-button @click="deleteHotel" class="stop_button" plain>删除酒店</el-button>
                                  </div>
                                </div>
                              </div>
                              &lt;!&ndash;酒店结束&ndash;&gt;
                            </div>
                          </div>
                          &lt;!&ndash;酒店信息结束&ndash;&gt;
                        </el-tab-pane>-->
                      <el-tab-pane label="日程信息" name="note">
                        <!--活动详情-->
                        <div class="traffic">
                          <div class="traffic_title">日程信息</div>
                          <div class="details_border">
                            <div v-for="(item,index) in ruleForm.schedules" v-show=" index == mynumber" :key="index">
                              <div class="date">DAY{{index+1}}</div>
                              <div class="plane">
                                <!--第一行-->
                                <div class="aviation">
                                  <!--第一个-->
                                  <el-form-item label="主题" label-width="100px" style="float:left; margin:30px 0 0 0;" :prop="'schedules.'+index+'.subject'" :rules="rules.subject">
                                    <!--<el-autocomplete class="inputBox" clearable placeholder="请输入主题" :fetch-suggestions="querySearch" v-model="item.subject" :trigger-on-focus="false">
                                    </el-autocomplete>-->
                                    <el-input class="inputBox" clearable placeholder="请输入主题" :fetch-suggestions="querySearch" v-model="item.subject" :trigger-on-focus="false">
                                    </el-input>
                                  </el-form-item>
                                </div>
                                <div class="aviation">
                                  <!--住宿-->
                                  <div class="aviation_first">
                                    <div class="aviation_text">住宿</div>
                                    <div class="type_radio" style="margin:10px 0 0 0;">
                                      <div>
                                        <span><el-radio v-model="myradio[index].lable" label="0">酒店</el-radio></span>
                                        <span><el-radio v-model="myradio[index].lable" label="1">其他</el-radio></span>
                                        <div class="explain">
                                          <!--    <div v-show="myradio[index].lable=='0'">
                                      <span v-for="(itemCon,p) in tabContents" style="margin-right:10px">
                                      <el-button @click="baocun(itemCon.id,index)" :class="{mybuttonac:itemCon.iu ==1}">{{itemCon.name}}</el-button>
                                      </span>
                                              </div>-->
                                          <div v-show="myradio[index].lable=='1'">
                                            <el-input class="text_input"  v-model="item.ext_Hotel.Details" type="textarea" :rows="5" placeholder="请输入内容"></el-input>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="aviation">
                                  <!--餐饮-->
                                  <div class="food_text">餐饮</div>
                                </div>
                                <!--餐饮循环-->
                                <div class="aviation" style="padding-top:20px;" v-for="(it,p) in item.ext_Meals" :key="p">
                                  <div class="aviation_first">
                                    <div class="food_radio" style="line-height:40px;">
                                      <div class="repast">{{it.label}}</div>
                                      <el-radio v-model="it.Myself" label="0">自理</el-radio>
                                      <el-radio v-model="it.Myself" label="1">详细说明</el-radio>
                                    </div>
                                    <div class="aviation_first">
                                      <div v-show="it.Myself=='1'">
                                        <el-input class="state" placeholder="餐饮说明" v-model="it.Detail"></el-input>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <!--餐饮循环-->
                                <!--第六行-->
                                <div class="aviation" style="padding-top:20px;">
                                  <div class="aviation_text">详情</div>
                                  <!--<div class="textarea">
                                    <el-input class="text_input" type="textarea" :rows="10" placeholder="请输入内容" v-model="item.info"></el-input>
                                  </div>-->
                                  <div class="cost_content" style="background: #FFFFFF">
                                    <vue-editor v-model="content_02"></vue-editor>
                                  </div>
                                </div>
                                <!--活动详情-->
                                <div class="date">活动详情</div>
                                <div class="hotel_button">
                                  <el-button style="margin: 20px 0 0 20px;" @click="addDetails(index)" type="primary">添加详情</el-button>
                                </div>
                                <div class="aviation">
                                  <!--景点、购物、自费项目切换-->
                                  <div class="" style="width:100%;" v-for="(item, k) in item.activitys" :key="k">
                                    <div class="explain">
                                      <div class="aviation" style="padding:20px 0 0 0;">
                                        <el-radio-group v-model="item.activityType" @change="diaoyong(item.activityType,k,index)" style="margin-left:55px">
                                          <el-radio v-for="(itx, x) in details" :label="itx.value" :key="x">{{itx.label}}</el-radio>
                                        </el-radio-group>
                                        <!-- <div class="aviation_text">类型</div> -->
                                        <!-- <div class="aviation_input">
                                          <el-cascader :options="details" @change="(v)=>{item.shuxing=v[0]}" placeholder="景点"></el-cascader>
                                        </div> -->
                                      </div>
                                      <div>
                                        <div class="explain">
                                          <div v-if="item.activityType==1">
                                            <div class="aviation" style="padding:20px 0 0 0;">
                                              <div class="aviation_text">城市</div>
                                              <div class="aviation_input">
                                                <el-input v-model="item.typeExt" placeholder="请输入城市"></el-input>
                                              </div>
                                              <div class="aviation_text">活动时间</div>
                                              <div class="city_input">
                                                <el-input v-model="item.time" placeholder=""></el-input>
                                              </div>
                                              <div class="minutes">分钟</div>
                                            </div>
                                            <div class="aviation" style="padding:20px 0 0 0;">
                                              <div class="aviation_text">景点名称</div>
                                              <div class="aviation_input">
                                                <el-input v-model="item.name" placeholder="请输入景点名称"></el-input>
                                              </div>
                                            </div>
                                            <div class="aviation" style="padding-top:20px;">
                                              <div class="aviation_text">详细说明</div>
                                              <div class="textarea">
                                                <el-input class="text_input" type="textarea" :rows="3" placeholder="请输入详细说明" v-model="item.details"></el-input>
                                              </div>
                                            </div>
                                            <div class="dashed">&nbsp;</div>
                                            <div class="aviation_first">
                                              <div class="aviation_text">图片</div>
                                              <div class="aviation_input" style="position: relative;">
                                                <el-input v-model="item.pictureID" placeholder="请输入图片内容"></el-input>
                                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
                                                  <el-button type="primary">上传</el-button>
                                                </el-upload>
                                              </div>
                                            </div>
                                            <div class="aviation" style="padding-top:20px;">
                                              <div class="aviation_text">简介</div>
                                              <div class="textarea">
                                                <el-input class="text_input" type="textarea" :rows="3" placeholder="请输入简介内容" v-model="item.memo"></el-input>
                                              </div>
                                            </div>
                                          </div>
                                          <div v-if="item.activityType==2">
                                            <div class="aviation" style="padding:20px 0 0 0;">
                                              <div class="aviation_text">名称</div>
                                              <div class="aviation_input">
                                                <el-input v-model="item.name" placeholder="请输入名称"></el-input>
                                              </div>
                                              <div class="aviation_text">活动时间</div>
                                              <div class="city_input">
                                                <el-input v-model="item.time" placeholder=""></el-input>
                                              </div>
                                              <div class="minutes">分钟</div>
                                            </div>
                                            <div class="aviation" style="padding:20px 0 0 0;">
                                              <div class="aviation_text">营业产品</div>
                                              <div class="aviation_input">
                                                <el-input v-model="item.typeExt" placeholder="请输入营业产品"></el-input>
                                              </div>
                                            </div>
                                            <div class="aviation" style="padding-top:20px;">
                                              <div class="aviation_text">详细说明</div>
                                              <div class="textarea">
                                                <el-input class="text_input" type="textarea" :rows="3" placeholder="请输入详细说明" v-model="item.details"></el-input>
                                              </div>
                                            </div>
                                            <div class="dashed">&nbsp;</div>
                                            <div class="aviation_first">
                                              <div class="aviation_text">图片</div>
                                              <div class="aviation_input" style="position: relative;">
                                                <el-input v-model="item.pictureID" placeholder="请输入图片内容"></el-input>
                                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
                                                  <el-button type="primary">上传</el-button>
                                                </el-upload>
                                              </div>
                                            </div>
                                            <div class="aviation" style="padding-top:20px;">
                                              <div class="aviation_text">简介</div>
                                              <div class="textarea">
                                                <el-input class="text_input" type="textarea" :rows="3" placeholder="请输入简介内容" v-model="item.memo"></el-input>
                                              </div>
                                            </div>
                                          </div>
                                          <div v-if="item.activityType==3">
                                            <div class="aviation" style="padding:20px 0 0 0;">
                                              <div class="aviation_text">名称</div>
                                              <div class="aviation_input">
                                                <el-input v-model="item.name" placeholder="请输入名称"></el-input>
                                              </div>
                                              <div class="aviation_text">活动时间</div>
                                              <div class="city_input">
                                                <el-input v-model="item.time" placeholder=""></el-input>
                                              </div>
                                              <div class="minutes">分钟</div>
                                            </div>
                                            <div class="aviation" style="padding:20px 0 0 0;">
                                              <div class="aviation_text">参考价格</div>
                                              <div class="aviation_input">
                                                <el-input v-model="item.typeExt" placeholder="请输入参考价格"></el-input>
                                              </div>
                                              <div class="minutes">元/人</div>
                                            </div>
                                            <div class="aviation" style="padding-top:20px;">
                                              <div class="aviation_text">详细说明</div>
                                              <div class="textarea">
                                                <el-input class="text_input" type="textarea" :rows="3" placeholder="请输入详细说明" v-model="item.details"></el-input>
                                              </div>
                                            </div>
                                            <div class="dashed">&nbsp;</div>
                                            <div class="aviation_first">
                                              <div class="aviation_text">图片</div>
                                              <div class="aviation_input" style="position: relative;">
                                                <el-input v-model="item.pictureID" placeholder="请输入图片内容"></el-input>
                                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture">
                                                  <el-button type="primary">上传</el-button>
                                                </el-upload>
                                              </div>
                                            </div>
                                            <div class="aviation" style="padding-top:20px;">
                                              <div class="aviation_text">简介</div>
                                              <div class="textarea">
                                                <el-input class="text_input" type="textarea" :rows="3" placeholder="请输入简介内容" v-model="item.memo"></el-input>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="stop">
                                            <el-button class="stop_button" @click="deleteDetails(k,index)">删除详情</el-button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--DAY切换-->
                            <div class="DAY">
                              <!-- <div class="DAY_one">DAY{{}}</div> -->
                              <div class="DAY_two" v-for="(myitem,myindex) in myTravelDay" :class="{myactive:myindex == mynumber}" @click="tabTravel(myindex)" :key="myindex">DAY{{myitem+1}}</div>
                            </div>
                          </div>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                  <!--切换end-->
                </el-tab-pane>
              </el-tabs>
              <!--套餐结束-->
            </div>
            <!--套餐弹窗-->
            <div class="popup" v-show="comboshow">
              <div class="mask"></div>
              <div class="add">
                <div class="label">
                  <div class="left">信息</div>
                  <div class="right" @click="close">×</div>
                </div>
                <div class="content">
                  <div class="text">是否删除该套餐</div>
                  <div class="judge">
                    <el-button @click="close">取消</el-button>
                    <el-button @click="confirm" type="primary">确定</el-button>
                  </div>
                </div>
              </div>
            </div>
            <!--套餐弹窗结束-->
            <!--酒店弹窗-->
            <div class="popup" v-show="hotelshow">
              <div class="mask"></div>
              <div class="add">
                <div class="label">
                  <div class="left">信息</div>
                  <div class="right" @click="cloceHotel">×</div>
                </div>
                <div class="content">
                  <div class="text">是否删除该酒店套餐</div>
                  <div class="judge">
                    <el-button @click="cloceHotel">取消</el-button>
                    <el-button @click="shutHotel" type="primary">确定</el-button>
                  </div>
                </div>
              </div>
            </div>
            <!--酒店弹窗结束-->
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
  // import BaseInfo from '@/page/productManagement/baseInfo/baseInfo'
  import {VueEditor} from 'vue2-editor'
  export default {
    name: "listInfo",
    components: {
      // BaseInfo,
      VueEditor
    },
    data() {
      return {
        changeobj:"",
        changeIndex:0,//默认第一个套餐
        changeAction:"",//判断是修改还是删除
        packLen:"",//套餐长度
        qqq:[],
        activeID:[],//日程信息id
        schedulsLeng:'',//几天日程信息
        mealID:'',//mealId
        tabInformation:"traffic",
        isActive: false,//基本信息字数要求
        content_01:'',//基本信息产品概况文本编辑器
        content_02:'',//行程信息详情
        tabIndex: 2,
        notes:[{
          title:'',
          content:''
        }],
        instructions:[{
          title:'',
          content:''
        }],
        explain:[{
          title:'费用包含',
          content:''
        },{
          title:'费用不包含',
          content:''
        },{
          title:'温馨提示',
          content:''
        },{
          title:'儿童政策',
          content:''
        },{
          title:'购物场所',
          content:''
        },{
          title:'自费项目',
          content:''
        }],
        domains:[],//费用说明隐藏
        //基本信息
        isShowImg: false,
        imgUrl: '',
        isSlideshow: false,
        slideshowUrl: '',
        vague: [],
        tableData1: [],
        list: [],
        excurList: [],
        //目的地
        dynamicTags1: [],
        inputVisible1: false,
        inputValue1: '',
        //简要说明
        content: '',
        content1: '<h1>Some initial content111</h1>',
        //切换主题
        editableTabsValue: '1',
        editableTabs: [],
        //限制字数
        number: '0/10',
        items: {
          text: ''
        },
        //去程交通工具切换
        goRoad: [{
          value: '1',
          label: '飞机'
        }, {
          value: '2',
          label: '火车',
        }, {
          value: '3',
          label: '汽车',
        }, {
          value: '4',
          label: '轮船',
        }],
        selectedOptions: ['2'],
        //去程天数
        goDate: [],
        //返程交通工具切换
        returnRoad: [{
          value: '1',
          label: '飞机'
        }, {
          value: '2',
          label: '火车',
        }, {
          value: '3',
          label: '汽车',
        }, {
          value: '4',
          label: '轮船',
        }],
        selectedOptions_01: ['1'],
        //去程、返程当日选择
        goDay: [{
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
        //酒店星级
        hotelStars: [{
          value: '选项1',
          label: '三星'
        }, {
          value: '选项2',
          label: '四星'
        }, {
          value: '选项3',
          label: '五星'
        }],
        //酒店入住晚数
        hotelDays: [{
          value: '选项1',
          label: '一宿'
        }, {
          value: '选项2',
          label: '两宿'
        }, {
          value: '选项3',
          label: '三宿'
        }],
        //酒店房型
        hotelRoom: [{
          value: '选项1',
          label: '单人间'
        }, {
          value: '选项2',
          label: '双人间'
        }, {
          value: '选项3',
          label: '三人间'
        }],
        //酒店床型
        hotelType: [{
          value: '选项1',
          label: '双人床'
        }, {
          value: '选项2',
          label: '双人床'
        }, {
          value: '选项3',
          label: '双人床'
        }],
        //文本框
        restaurants: [],
        //日程信息详细说明
        info: '',
        ruleForm: {
          mudidi:"",
          chufadi:"",
          productNamel: '',
          destinations:'',
          travelType: '1',
          placeDeparture: '',
          travelDays: '',
          travelNight: '',
          orderConfirmationType:'',
          operationLabel: '',
          Excursion: '',
          excurList: '',
          advanceRegistrationDays: '',
          timeHour: '',
          timeMinute: '',
          highlightWords1: '',
          highlightWords2: '',
          highlightWords3: '',
          highlightWords4: '',
          avatarImages: '',
          slideshow: '',
          hotelAuto: '',
          hotelChinese: '',
          hotelEnglish: '',
          hotelAddress: '',
          hotelStar: '',
          hotelDay: '',
          hotelHouse: '',
          hotelBed: '',
          pod: '',
          company: '',
          theNumber: '',
          pod: '',
          podPlace: '',
          podTime: '',
          arriveCity: '',
          arrivePlace: '',
          arriveTime: '',
          planeDay: '',
          trafficMode: '1',
          day: '',
          typeExt: '',
          time: '',
          name: '',
          details: '',
          memo: '',
          pictureID: '',
          highlightWords: '',
          theme: '',
          subject:'',
          origin:'',
          podID:'',
          destinationID:'',
          bourn:'',
          //交通工具
          //去程
          plane: [{
            pod: '',
            id: 0,
            goOrBack:1,
            company: '',
            theNumber: '',
            podCity: '',
            podPlace: '',
            podTime: '',
            arriveCity: '',
            arrivePlace: '',
            arriveTime: '',
            planeDay: '',
            trafficMode: '1',
            day: '1',
            ext_Stopover: [],
            www:['2']
          }],
          //返程
          nackPlane: [{
            pod: '',  //套餐id
            id: 0,
            goOrBack:2,   //1去程 2返程
            company: '',  //航空公司
            theNumber: '',   //航班号
            podCity: '',           //出发城市
            podPlace: '',   //出发机场
            podTime: '',    //出发时间
            arriveCity: '',    //到达城市
            arrivePlace: '',     //到达机场
            arriveTime: '',      //到达时间
            planeDay: '',       //到达天数
            trafficMode: '1',  //出行方式
            day: '1',      //第几天
            ext_Stopover: [],
            www: ['2']
          }],
          //行程信息大表
          schedules: []
        },
        rules: {
          productNamel: [{ required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 30, message: '字数超过30汉字限制', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9【】，+/（]{1,29}([\u4e00-\u9fa5a-zA-Z0-9【】，+/）]{0,1})$/, message: '请输入正确产品名称，含中括号【】中文逗号，英文+/可用，中文小括号（）仅能用在句尾' , trigger: 'blur'}],
          travelType: [{ required: true, message: '不能为空', trigger: 'blur' }],
          orderConfirmationType: [{ required: true, message: '不能为空', trigger: 'change' }],
          advanceRegistrationDays: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          highlightWords1: [{ required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          highlightWords2: [{ min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          highlightWords3: [{ min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          highlightWords4: [{ min: 0, max: 8, message: '字数超过8汉字限制', trigger: 'blur' }],
          travelDays: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          travelNight: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数'}],
          timeHour: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          timeMinute: [{ required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数' }],
          operationLabel: [{ pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,300}$/, message: '不能有标点符号' }],
          highlightWords: [{ required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' }],
          origin: [{ required: true, message: '不能为空', trigger: 'change' }],
          bourn: [{ required: true, message: '不能为空', trigger: 'change' }],
          hotelAuto: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelChinese: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelEnglish: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelAddress: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelStar: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelDay: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelHouse: [{ required: true, message: '不能为空', trigger: 'blur' }],
          hotelBed: [{ required: true, message: '不能为空', trigger: 'blur' }],
          pod: [{ required: true, message: '不能为空', trigger: 'blur' }],
          company: [{ required: true, message: '不能为空', trigger: 'blur' }],
          theNumber: [{ required: true, message: '不能为空', trigger: 'blur' }],
          podCity:[{ required: true, message: '不能为空', trigger: 'blur' }],
          pod: [{ required: true, message: '不能为空', trigger: 'blur' }],
          podPlace: [{ required: true, message: '不能为空', trigger: 'blur' }],
          podTime: [{ required: true, message: '不能为空', trigger: 'blur' }],
          arriveCity: [{ required: true, message: '不能为空', trigger: 'blur' }],
          arrivePlace: [{ required: true, message: '不能为空', trigger: 'blur' }],
          arriveTime: [{ required: true, message: '不能为空', trigger: 'blur' }],
          planeDay: [{ required: true, message: '不能为空', trigger: 'blur' }],
          trafficMode: [{ required: true, message: '不能为空', trigger: 'blur' }],
          day: [{ required: true, message: '不能为空', trigger: 'blur' }],
          typeExt: [{ required: true, message: '不能为空', trigger: 'blur' }],
          time: [{ required: true, message: '不能为空', trigger: 'blur' }],
          name: [{ required: true, message: '不能为空', trigger: 'blur' }],
          details: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // slideshow:[{ required: true, message: '不能为空', trigger: 'blur' }],
          memo: [{ required: true, message: '不能为空', trigger: 'blur' }],
          details: [{ required: true, message: '不能为空', trigger: 'blur' }],
          pictureID: [{ required: true, message: '不能为空', trigger: 'blur' }],
          subject: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        //上传图片
        fileList2: [],
        //radio选择器
        radio: '1',
        radio1: '1',
        radio2: '1',
        radio3: '1',
        radio4: '1',
        //日程详情住宿选择
        tabContents: [{'id':0,'name':'酒店1'},{'id':1,'name':'酒店2'}],
        num: 0,
        num1: 0,
        param: '1',
        tabPosition: 'right',
        comboshow: false,
        aindex: 0,
        editableTabsValue3: '2',
        editableTabs3: [{
          content: ''
        }],
        //行程信息切换
        describe: ["详细说明", "简要说明"],
        pattern: ["", ""],
        matter_radio: '0',
        form: [],
        form1: [],
        lineshow: false,
        Stopline: false,
        transit: ['1'],
        deleteTransit: true, //删除中转按钮
        //出发地
        place: [{
          value: '选项1',
          id: '1'
        }, {
          value: '选项2',
          id: '2'
        }, {
          value: '选项3',
          id: '3'
        }],
        //目的地
        destination: [{
          value: '选项1',
          id: '1'
        }, {
          value: '选项2',
          id: '2'
        }, {
          value: '选项3',
          id: '3'
        }],
        //景点，购物，自费
        information: ['1'], //添加酒店
        hotelshow: false, //酒店弹窗
        hotel: [{
          hotelAuto: '',
          hotelChinese: '',
          hotelEnglish: '',
          hotelAddress: '',
          hotelStar: '',
          hotelDay: '',
          hotelHouse: '',
          hotelBed: ''
        }],
        details: [{
          value: '1',
          label: '景点'
        }, {
          value: '2',
          label: '购物',
        }, {
          value: '3',
          label: '自费项目',
        }],
        teturnBack: [],
        Returnline: false,
        //日程信息酒店切换
        num6: 0,
        schedule_radio: '0',
        //信息详情切换
        num7: 0,
        details_radio: '0',
        schedule_details: ["", "", ""],
        //切换变量行程day的
        mynumber: 0,
        //行程日期
        mydate: '2',
        //日期切换
        myTravelDay: [],
        //添加详情
        myxiangnumber: 0,
        hotell: true,
        otherl: false,
        myradio:[],
        activeName: 'second',
        travelDays: '',
        //运营标签
        dynamicTags2: [],
        inputVisible2: false,
        inputVal: '',
        empty:'',
        // 出发地
        dynamicTags3: [],
        inputVisible3: false,
        inputVal3: '',
        noNull: false,
        //目的地
        dynamicTags4: [],
        inputVisible4: false,
        inputVal4: '',
        errorNull: ''
      }
    },
    watch:{ //watch()监听某个值（双向绑定）的变化，从而达到change事件监听的效果
      items: {
        handler: function() {
          var _this = this;
          var _sum = 10; //字体限制为10个
          _this.$refs.count.setAttribute("maxlength", _sum);
          _this.number = _sum - _this.$refs.count.value.length;
        },
        deep: false
      },
      'ruleForm.travelDays': {
        handler: function(newValue, oldValue) {
          //右侧导航day
          this.myTravelDay=[];
          for (let i = 0; i < newValue; i++) {
            this.myTravelDay.push(i)
          }
          //日常信息数据
          if(newValue>oldValue){
            this.mydate = newValue-oldValue;
            for (let i = 0; i < this.mydate; i++) {
              this.ruleForm.schedules.push({
                day:i+1,
                subject: '',
                info: '',
                createTime: this.formatDate(new Date()),
                ext_Meals: [{
                  label: '早餐',
                  Myself: '0',
                  Detail: ''
                }, {
                  label: '午餐',
                  Myself: '0',
                  Detail: ''
                }, {
                  label: '晚餐',
                  Myself: '0',
                  Detail: ''
                }],
                activitys: [{
                  typeExt: '',
                  time: '',
                  name: '',
                  details: '',
                  memo: '',
                  pictureID: '',
                  activityType:'1',
                  createTime: this.formatDate(new Date())
                }],
                ext_Hotel: [
                  {IsHotel:0,Details:""}
                ]
              });
              this.myradio.push({'lable':'1'});   //保存行程里面酒店信息单选值
            }
          }else{
            this.ruleForm.schedules.splice(newValue,oldValue-newValue);
            this.myradio.splice(newValue,oldValue-newValue)
          }
        }
      }
    } ,
    mounted() {
      this.guid();
      this.restaurants = this.loadAll();
    },
    created() {
      this.themeList();
      this.itemList();
      this.oneInfo();
    },
    methods: {

      oneInfo(){
        var that = this
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teaminfoget",
          {
            "object": {
              "id": this.$route.query.id,
              "loadPackage": true
            }

          }
        )
          .then(function (obj) {

            console.log(obj.data.object);
            that.ruleForm.travelDays = obj.data.object.day//行程天数
            that.ruleForm.travelNight = obj.data.object.night//行程晚数
            that.dynamicTags3 = obj.data.object.pods//出发地
            that.dynamicTags4 = obj.data.object.destinations//目的地
            that.ruleForm.highlightWords = obj.data.object.package[0].name //行程信息套餐名
            that.ruleForm.origin = obj.data.object.package[0].pod //行程信息出发地
            that.ruleForm.bourn = obj.data.object.package[0].destination //行程信息目的地
            that.ruleForm.podID = obj.data.object.package[0].podID //行程信息出发地ID
            that.ruleForm.destinationID = obj.data.object.package[0].destinationID//行程信息目的地ID
            that.packLen = obj.data.object.package.length
            for(let j = 0; j < obj.data.object.package.length; j++){
              let newTabName = ++that.tabIndex + '';
              that.editableTabs.push({
                title: "套餐"+j,
                name: newTabName,
                content: 'New Tab content',
              });
            }
            that.editableTabsValue = "3"
            that.ruleForm.plane = []
            that.ruleForm.nackPlane = []
            for (var i =0; i < obj.data.object.package[0].traffic.length; i++ ){
              let arr = [];
              if(obj.data.object.package[0].traffic[i].goOrBack == 1){
                obj.data.object.package[0].traffic[i].ext_Stopover = [];//TODO 经停
                that.ruleForm.plane.push(obj.data.object.package[0].traffic[i]);
                arr.push(String(obj.data.object.package[0].traffic[i].trafficMode));
                that.ruleForm.plane[i].www = arr;
              }else{
                obj.data.object.package[0].traffic[i].ext_Stopover = [];//TODO 经停
                arr.push(String(obj.data.object.package[0].traffic[i].trafficMode));
                obj.data.object.package[0].traffic[i].www = arr;
                that.ruleForm.nackPlane.push(obj.data.object.package[0].traffic[i]);

              }

            }

            //日程信息
            for (let j = 0; j < obj.data.object.package[0].schedules.length; j++) {
              setTimeout(arr => {
                that.ruleForm.schedules[j].subject =  obj.data.object.package[0].schedules[j].subject //主题
                /* that.ruleForm.schedules[j].ext_Hotel.Details =  obj.data.object.package[0].schedules[j].info //主题*/
                that.content_02 =  obj.data.object.package[0].schedules[j].info //详情
                //早餐
                if( JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].label == "早餐" && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].Myself == "0"){
                  that.ruleForm.schedules[j].ext_Meals[0].Myself = "0"
                }else if(JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].label == "早餐"  && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].Myself == "1"){
                  that.ruleForm.schedules[j].ext_Meals[0].Myself = "1"
                  that.ruleForm.schedules[j].ext_Meals[0].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[0].Detail
                }
                //午餐
                if( JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].label == "午餐" && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Myself == "0"){
                  that.ruleForm.schedules[j].ext_Meals[1].Myself = "0"
                }else if(JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].label == "午餐"  && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Myself == "1"){
                  that.ruleForm.schedules[j].ext_Meals[1].Myself = "1"
                  that.ruleForm.schedules[j].ext_Meals[1].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Detail
                }
                // 晚餐
                if( JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].label == "晚餐" && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].Myself == "0"){
                  that.ruleForm.schedules[j].ext_Meals[2].Myself = "0"
                }else if(JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].label == "晚餐"  && JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].Myself == "1"){
                  that.ruleForm.schedules[j].ext_Meals[2].Myself = "1"
                  that.ruleForm.schedules[j].ext_Meals[2].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[2].Detail
                }
                that.ruleForm.schedules[j].activitys = []
                for (let k = 0; k < obj.data.object.package[0].schedules[j].activitys.length; k++) {
                  that.ruleForm.schedules[j].activitys.push(obj.data.object.package[0].schedules[j].activitys[k])
                  that.ruleForm.schedules[j].activitys[k].activityType = String(that.ruleForm.schedules[j].activitys[k].activityType)
                }
                console.log( )
              }, 100)
            }
            that.mealID  =  obj.data.object.package[that.changeIndex].id //模板id
            that.ruleForm.productNamel = obj.data.object.title; //产品名称
            that.ruleForm.travelType = String(obj.data.object.isForeign); //出游类型

            that.explain = []
            for (let t = 0; t < obj.data.object.instructions.length; t++ ){
              that.explain.push(obj.data.object.instructions[t])
            }
          })
          .catch(function (obj) {
            console.log(obj)
          })
      },
      handClick(tab, event){
        console.log(tab, event);
      },
      myInput(){//基本信息文字限制30个字颜色变红
        if(this.ruleForm.productNamel.length>30){
          this.isActive=true;
        }else{
          this.isActive=false;
        }
      },
      getUEContent0(){
        this.notes.push({
          title: '',
          content:''
        });
      },
      getUEContent1(){
        this.instructions.push({
          title: '',
          content:''
        });
      },
      //删除预订须知
      deleteNotice(index){
        this.notes.splice(index, 1)
      },
      //删除使用说明
      deleteState(index){
        this.instructions.splice(index, 1)
      },
      //费用说明删除
      deleteState_01(index){
        this.domains.splice(index, 1)
      },
      //添加
      getUEContent(){
        this.domains.push({
          title: '',
          content: ''
        });
      },
      //保存
      addsave(formName) {
        if(this.changeIndex < this.packLen){
          this.changeAction = "update";
        }
        //添加套餐
        if(this.changeAction == "add"){
          //经停信息转字符串
          let traff1=JSON.stringify(this.ruleForm.plane.concat(this.ruleForm.nackPlane));
          let traff=JSON.parse(traff1);
          for(var i=0;i<traff.length;i++){
            traff[i].ext_Stopover=JSON.stringify(traff[i].ext_Stopover);
          }
          //行程餐食信息转字符串
          let sche1=JSON.stringify(this.ruleForm.schedules);
          let sche=JSON.parse(sche1);
          for(var i=0;i<sche.length;i++){
            sche[i].ext_Meals=JSON.stringify(sche[i].ext_Meals);
          }
          for(var i=0;i<sche.length;i++){
            sche[i].ext_Hotel=JSON.stringify(sche[i].ext_Hotel);
          }
          if(this.ruleForm.bourn.destination == undefined){

            this.ruleForm.mudidi = this.ruleForm.bourn
          }else{
            this.ruleForm.mudidi = this.ruleForm.bourn.destination
          }
          if(this.ruleForm.origin.pod == undefined){

            this.ruleForm.chufadi = this.ruleForm.origin
          }else{
            this.ruleForm.chufadi = this.ruleForm.origin.pod
          }
          //行程信息
          var object={
            //基本信息接口数据
            teamID:this.$route.query.id,
            name: this.ruleForm.highlightWords,
            podID: this.ruleForm.podID,
            destinationID: this.ruleForm.destinationID,
            pod: this.ruleForm.chufadi,
            destination: this.ruleForm.mudidi,
            createTime:this.formatDate(new Date()),
            traffic: traff,
            schedules:sche,
            loadPackage: true,
            briefMark: "string",
            loadPlan: true,
            codePrefix: "string",
            codeSuffix: "string"
          }
          this.$refs[formName].validate((valid) => {
            if(valid){
              var _this = this;
              this.$http.post(this.GLOBAL.serverSrc + "/team/api/teampackageinsert", {
                  object: object
                },
              ).then(function(response) {
                if(response.data.isSuccess==true){
                  _this.$message.success("添加成功");
                }else{
                  _this.$message.success("添加失败");
                }
              }).catch(function(error) {
                console.log(error);
              });
            }
          })
        }
        else {

          //修改套餐
          //经停信息转字符串
          let traff1=JSON.stringify(this.ruleForm.plane.concat(this.ruleForm.nackPlane));
          let traff=JSON.parse(traff1);
          for(var i=0;i<traff.length;i++){
            traff[i].ext_Stopover=JSON.stringify(traff[i].ext_Stopover);
          }
          //行程餐食信息转字符串
          let sche1=JSON.stringify(this.ruleForm.schedules);
          let sche=JSON.parse(sche1);
          for(var i=0;i<sche.length;i++){
            sche[i].ext_Meals=JSON.stringify(sche[i].ext_Meals);
          }
          for(var i=0;i<sche.length;i++){
            sche[i].ext_Hotel=JSON.stringify(sche[i].ext_Hotel);
          }
          if(this.ruleForm.bourn.destination == undefined){

            this.ruleForm.mudidi = this.ruleForm.bourn
          }else{
            this.ruleForm.mudidi = this.ruleForm.bourn.destination
          }
          if(this.ruleForm.origin.pod == undefined){

            this.ruleForm.chufadi = this.ruleForm.origin
          }else{
            this.ruleForm.chufadi = this.ruleForm.origin.pod
          }
          //行程信息
          var object={
            //基本信息接口数据
            id:this.mealID,
            teamID:this.$route.query.id,
            name: this.ruleForm.highlightWords,
            podID: this.ruleForm.podID,
            destinationID: this.ruleForm.destinationID,
            pod: this.ruleForm.chufadi,
            destination: this.ruleForm.mudidi,
            createTime:this.formatDate(new Date()),
            traffic: traff,
            schedules:sche,
            loadPackage: true,
            briefMark: "string",
            loadPlan: true,
            codePrefix: "string",
            codeSuffix: "string",

          }
          console.log(object)
          this.$refs[formName].validate((valid) => {
            if(valid){
              var _this = this;
              this.$http.post(this.GLOBAL.serverSrc + "/team/api/teampackagesave", {
                  object: object
                },
              ).then(function(response) {
                if(response.data.isSuccess==true){
                  _this.$message.success("修改成功");
                }else{
                  _this.$message.success("修改失败");
                }
              }).catch(function(error) {
                console.log(error);
              });
            }
          })

        }


      },
      //保存套餐信息
      handleSetMeal(formName){

        //经停信息转字符串
        let traff1=JSON.stringify(this.ruleForm.plane.concat(this.ruleForm.nackPlane));
        let traff=JSON.parse(traff1);
        for(var i=0;i<traff.length;i++){
          traff[i].ext_Stopover=JSON.stringify(traff[i].ext_Stopover);
        }
        //行程餐食信息转字符串
        let sche1=JSON.stringify(this.ruleForm.schedules);
        let sche=JSON.parse(sche1);
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Meals=JSON.stringify(sche[i].ext_Meals);
        }
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Hotel=JSON.stringify(sche[i].ext_Hotel);
        }
        if(this.ruleForm.bourn.destination == undefined){

          this.ruleForm.mudidi = this.ruleForm.bourn
        }else{
          this.ruleForm.mudidi = this.ruleForm.bourn.destination
        }
        if(this.ruleForm.origin.pod == undefined){

          this.ruleForm.chufadi = this.ruleForm.origin
        }else{
          this.ruleForm.chufadi = this.ruleForm.origin.pod
        }
        //行程信息
        var object={
          //基本信息接口数据
          id:this.mealID,
          name: this.ruleForm.highlightWords,
          podID: this.ruleForm.podID,
          destinationID: this.ruleForm.destinationID,
          pod: this.ruleForm.chufadi,
          destination: this.ruleForm.mudidi,
          createTime:this.formatDate(new Date()),
          traffic: traff,
          loadPackage: true,
          briefMark: "string",
          loadPlan: true,
          codePrefix: "string",
          codeSuffix: "string"
        }
        this.$refs[formName].validate((valid) => {
          if(valid){
            var _this = this;
            this.$http.post(this.GLOBAL.serverSrc + "/team/api/teampackagesave", {
                object: object
              },
            ).then(function(response) {
              if(response.data.isSuccess==true){
                _this.$message.success("修改成功");
              }else{
                _this.$message.success("修改失败");
              }
            }).catch(function(error) {
              console.log(error);
            });
          }
        })
      },
      //修改日程信息
      handleNote(formName){
        //行程餐食信息转字符串
        let sche1=JSON.stringify(this.ruleForm.schedules);
        let sche=JSON.parse(sche1);
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Meals=JSON.stringify(sche[i].ext_Meals);
        }
        for(var i=0;i<sche.length;i++){
          sche[i].ext_Hotel=JSON.stringify(sche[i].ext_Hotel);
        }
        for(let i=0; i < this.schedulsLeng; i++){
          var object={
            //基本信息接口数据
            id:this.activeID[i],
            packageID:this.mealID,
            day:this.ruleForm.schedules[i].day,
            subject:this.ruleForm.schedules[i].subject,
            ext_Meals:JSON.stringify(this.ruleForm.schedules[i].ext_Meals),
            info:this.ruleForm.schedules[i].info,
            ext_Hotel:JSON.stringify(this.ruleForm.schedules[i].ext_Hotel),
            activitys: this.ruleForm.schedules[i].activitys,//行程信息
            createTime:this.formatDate(new Date()),
            loadPlan: false,
            code: "string"
          }
          this.$refs[formName].validate((valid) => {
            if(valid){
              var _this = this;
              this.$http.post(this.GLOBAL.serverSrc + "/team/api/teamschedulesave", {
                  object: object
                },
              ).then(function(response) {
                if(response.data.isSuccess==true){
                  _this.$message.success("修改成功");
                }else{
                  _this.$message.success("修改失败");
                }


              }).catch(function(error) {
                console.log(error);
              });

            }
          })

        }
        //行程信息



      },
      // 取消
      cancel(){
        this.$router.push({path: "productList"});
      },
      handleClick(tab, event) {
        if(event.target.getAttribute('id')=='tab-second'){
          //this.goDate.length = this.ruleForm.travelDays;
          this.goDate=[];
          for(let i = 0; i < this.ruleForm.travelDays; i++){
            this.goDate.push({
              value : i+1,
              label : i+1
            })
          };
        }
      },

      childByValue: function(childValue) {
        // childValue就是子组件传过来的值
        this.travelDays = childValue;
      },
      otherNumber() {
        this.hotell = false;
        this.otherl = true;
      },
      //日程信息切换
      tabTravel(myindex) {
        this.mynumber = myindex;
      },
      //去程添加经停、删除经停
      stopping(index) {
        {
          this.ruleForm.plane[index].ext_Stopover.push({
            stopCity: '',
            stopDate: ''
          })
        }
      },
      deleteItem(p, index) {
        this.ruleForm.plane[index].ext_Stopover.splice(p, 1)
      },
      deletePanel(index) {
        this.ruleForm.plane.splice(index, 1)
      },
      //返程添加经停、删除经停
      reDeleteItem(p, index) {
        this.ruleForm.nackPlane[index].ext_Stopover.splice(p, 1)
      },
      reDeletePanel(index) {
        this.ruleForm.nackPlane.splice(index, 1)
      },
      reStopping(index) {
        {
          this.ruleForm.nackPlane[index].ext_Stopover.push({
            stopCity: '',
            stopDate: ''
          })
        }
      },
      //交通信息添加中转
      addTransit(index) {
        this.ruleForm.plane.push({
          pod: '',  //套餐id
          id: 0,
          goOrBack:1,   //1去程 2返程
          company: '',  //航空公司
          theNumber: '',   //航班号
          podCity: '',           //出发城市
          podPlace: '',   //出发机场
          podTime: '',    //出发时间
          arriveCity: '',    //到达城市
          arrivePlace: '',     //到达机场
          arriveTime: '',      //到达时间
          planeDay: '',       //到达天数
          trafficMode: '1',  //出行方式
          day: '1',      //第几天
          ext_Stopover: []
        })
      },
      trafficClear(index){//去程切换交通方式清空
        this.ruleForm.plane[index].pod = '';
        this.ruleForm.plane[index].company = '';
        this.ruleForm.plane[index].theNumber = '';
        this.ruleForm.plane[index].podCity = '';
        this.ruleForm.plane[index].podPlace = '';
        this.ruleForm.plane[index].podTime = '';
        this.ruleForm.plane[index].arriveCity = '';
        this.ruleForm.plane[index].arrivePlace = '';
        this.ruleForm.plane[index].arriveTime = '';
        this.ruleForm.plane[index].planeDay = '';
        this.ruleForm.plane[index].day = '';
      },
      clearBle(index){
        this.ruleForm.plane[index].company = '';
        this.ruleForm.plane[index].theNumber = '';
        this.ruleForm.plane[index].podCity = '';
        this.ruleForm.plane[index].podPlace = '';
        this.ruleForm.plane[index].podTime = '';
        this.ruleForm.plane[index].arriveCity = '';
        this.ruleForm.plane[index].arrivePlace = '';
        this.ruleForm.plane[index].arriveTime = '';
        this.ruleForm.plane[index].planeDay = '';
        this.ruleForm.plane[index].day = '';

      },
      clearBle_01(index){
        this.ruleForm.nackPlane[index].company = '';
        this.ruleForm.nackPlane[index].theNumber = '';
        this.ruleForm.nackPlane[index].podCity = '';
        this.ruleForm.nackPlane[index].podPlace = '';
        this.ruleForm.nackPlane[index].podTime = '';
        this.ruleForm.nackPlane[index].arriveCity = '';
        this.ruleForm.nackPlane[index].arrivePlace = '';
        this.ruleForm.nackPlane[index].arriveTime = '';
        this.ruleForm.nackPlane[index].planeDay = '';
        this.ruleForm.nackPlane[index].day = '';

      },
      trafficGoClear(index){//返程切换交通方式清空
        this.ruleForm.nackPlane[index].pod = '';
        this.ruleForm.nackPlane[index].company = '';
        this.ruleForm.nackPlane[index].theNumber = '';
        this.ruleForm.nackPlane[index].podCity = '';
        this.ruleForm.nackPlane[index].podPlace = '';
        this.ruleForm.nackPlane[index].podTime = '';
        this.ruleForm.nackPlane[index].arriveCity = '';
        this.ruleForm.nackPlane[index].arrivePlace = '';
        this.ruleForm.nackPlane[index].arriveTime = '';
        this.ruleForm.nackPlane[index].planeDay = '';
        this.ruleForm.nackPlane[index].day = '';
      },
      addRTransit(index) {
        this.ruleForm.nackPlane.push({
          pod: '',  //套餐id
          id: 0,
          goOrBack:2,   //1去程 2返程
          company: '',  //航空公司
          theNumber: '',   //航班号
          podCity: '',           //出发城市
          podPlace: '',   //出发机场
          podTime: '',    //出发时间
          arriveCity: '',    //到达城市
          arrivePlace: '',     //到达机场
          arriveTime: '',      //到达时间
          planeDay: '',       //到达天数
          trafficMode: '1',  //出行方式
          day: '',      //第几天
          ext_Stopover: []
        })
      },
      //添加、删除酒店
      addHotel() {
        this.hotel.push({
          hotelAuto: '',
          hotelChinese: '',
          hotelEnglish: '',
          hotelAddress: '',
          hotelStar: '',
          hotelDay: '',
          hotelHouse: '',
          hotelBed: '',
          hotelAbstract: '',
          hotelPicture: ''
        })
      },
      deleteHotel(index) {
        this.hotelshow = true;
      },
      shutHotel(index) {
        this.hotel.splice(index, 1)
        this.hotelshow = false;
      },
      //酒店关闭取消按钮
      cloceHotel() {
        this.hotelshow = false;
      },
      //日程信息酒店切换
      tabHotel(index) {
        this.num6 = index;
      },
      //信息详情切换
      tabDetails(p, k, index) {
        // this.num7 = index;
      },
      handleClose2(tag2) {
        this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
      },
      showInput2() {
        this.inputVisible2 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleImgClick(file) {
        this.isShowImg = !this.isShowImg
        this.imgUrl = file.url
      },
      handleRemove(file, fileList) {
        this.isShowImg = false;
      },
      //轮播图预览
      slideshowClick(file) {
        this.isSlideshow = true;
        if (this.slideshowUrl == file.url) {
          this.isSlideshow = false;
          this.slideshowUrl = ''
        } else {
          this.slideshowUrl = file.url
        }
      },
      handleRemove2(file, fileList) {
        this.isSlideshow = false;
      },
      //视频删除
      handleRemoves(file, fileList) {
        // console.log(file);
      },
      //轮播图删除
      handleRemoves1(file, fileList) {
        // console.log(file);
      },
      //自动填充数据
      loadAll() {
        return [{
          "value": "三全鲜食（北新泾店）",
          "id": "1"
        },
          {
            "value": "Hot honey 首尔炸鸡（仙霞路）",
            "id": "2"
          },
          {
            "value": "新旺角茶餐厅",
            "id": "3"
          },
          {
            "value": "泷千家(天山西路店)",
            "id": "4"
          },
          {
            "value": "胖仙女纸杯蛋糕（上海凌空店）",
            "id": "5"
          }
        ];
      },
      //添加、删除详情
      addDetails(index) {
        this.ruleForm.schedules[index].activitys.push({
          typeExt: '',
          time: '',
          name: '',
          details: '',
          memo: '',
          pictureID: 0,
          activityType: '1',
          createTime: this.formatDate(new Date())
        })
      },
      deleteDetails(k, index) {
        this.ruleForm.schedules[index].activitys.splice(k, 1)
      },
      diaoyong(v,k,index){
        this.ruleForm.schedules[index].activitys[k].activityType = v;
      },
      baocun(p, index) {
        this.ruleForm.schedules[index].ext_Hotel[0].Details = p;
        this.ruleForm.schedules[index].ext_Hotel[0].IsHotel = 0;
      },
      close() {
        this.comboshow = false;
      },
      confirm() {
        this.handleTabsEdit(this.aindex, "remove");
        var _this = this;
        this.$http.post(
          this.GLOBAL.serverSrc + "/team/api/teaminfoget",
          {
            "object": {
              "id": this.$route.query.id,
              "loadPackage": true
            }

          }
        )
          .then(function (obj) {
            _this.mealID =obj.data.object.package[_this.aindex-3].id
          })
          .catch(function (obj) {
            console.log(obj)
          })
        this.$http.post(this.GLOBAL.serverSrc + "/team/api/teampackagedelete", {
            id: _this.mealID
          },
        ).then(function(response) {
        }).catch(function(error) {
        });
        this.comboshow = false;
      },
      tab(index) {
        this.num = index;
      },
      tab1(index) {
        this.num1 = index;
      },
      //主题标题添加删除
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          this.changeIndex = this.packLen+1
          this.changeAction = action;
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
          //清空数据
          this.ruleForm.highlightWords = '' //行程信息套餐名
          //去程
          this.ruleForm.plane = [{
            pod: '',
            id: 0,
            goOrBack:1,
            company: '',
            theNumber: '',
            podCity: '',
            podPlace: '',
            podTime: '',
            arriveCity: '',
            arrivePlace: '',
            arriveTime: '',
            planeDay: '',
            trafficMode: '1',
            day: '1',
            ext_Stopover: [],
            www:['2']
          }],
            //返程
          this.ruleForm.nackPlane =  [{
            pod: '',  //套餐id
            id: 0,
            goOrBack:2,   //1去程 2返程
            company: '',  //航空公司
            theNumber: '',   //航班号
            podCity: '',           //出发城市
            podPlace: '',   //出发机场
            podTime: '',    //出发时间
            arriveCity: '',    //到达城市
            arrivePlace: '',     //到达机场
            arriveTime: '',      //到达时间
            planeDay: '',       //到达天数
            trafficMode: '1',  //出行方式
            day: '1',      //第几天
            ext_Stopover: [],
            www: ['2']
          }]
         // console.log(this.ruleForm)
          for (let j = 0; j < this.ruleForm.schedules.length; j++){

            //this.ruleForm.schedules[j].ext_Hotel =[]
            this.ruleForm.schedules[j].ext_Meals[0].Detail = ""
            this.ruleForm.schedules[j].ext_Meals[0].Myself = "0"
            this.ruleForm.schedules[j].ext_Meals[0].label = "早餐"
            this.ruleForm.schedules[j].ext_Meals[1].Detail = ""
            this.ruleForm.schedules[j].ext_Meals[1].Myself = "0"
            this.ruleForm.schedules[j].ext_Meals[1].label = "午餐"
            this.ruleForm.schedules[j].ext_Meals[2].Detail = ""
            this.ruleForm.schedules[j].ext_Meals[2].Myself = "0"
            this.ruleForm.schedules[j].ext_Meals[2].label = "晚餐"
            this.ruleForm.schedules[j].subject =''
            this.content_02 = ""
           this.ruleForm.schedules[j].activitys = []

          }
        }
        if (action === 'remove') {
          if (this.comboshow == false) {
            this.comboshow = true;
            this.aindex = targetName;
            return false;
          } else {
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
              this.editableTabsValue = activeName;
              this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            }
          }
        }
      },
      //获取一条Flights下拉点击获取id去程自动填充
      /*handleSelectPod(item){
        this.$http.post(this.GLOBAL.serverSrc + '/flight/api/get',{
           "id":item.id
          }).then(res => {
              if(res.data.isSuccess == true){
                 let data = res.data.object;
                 //this.rformA.labelList=data.labelName;
                 this.ruleForm.plane[0].company=data.company;//航空公司
                 this.ruleForm.plane[0].theNumber=data.number;//航班号
                 this.ruleForm.plane[0].podCity=data.departureCity;//出发城市
                 this.ruleForm.plane[0].podPlace=data.departureAirport;//出发机场
                 this.ruleForm.plane[0].podTime=data.departureTime;//出发时间
                 this.ruleForm.plane[0].arriveCity=data.reachingCity;//到达城市
                 this.ruleForm.plane[0].arrivePlace=data.arrivalAirport; //到达机场
                 this.ruleForm.plane[0].arriveTime=data.arrivalTime;//到达时间
                 this.ruleForm.plane[0].planeDay=data.day;//到达天数
                 this.ruleForm.plane[0].trafficMode=data.byType;//出行方式
              }
        })
      },*/
      //不带下拉框获取一条Flights
      handleSelectPod_01(index){//去程获取
        if(this.ruleForm.plane[index].pod == ''){
          this.clearBle(index);
          return false;
        }
        this.$http.post(this.GLOBAL.serverSrc + '/Flight/flighs/api/getnum',{
          "number":this.ruleForm.plane[index].pod
        }).then(res => {
          if(res.data.isSuccess == true){
            let data = res.data.object;
            this.ruleForm.plane[index].company=data.company;//航空公司
            this.ruleForm.plane[index].theNumber=data.number;//航班号
            this.ruleForm.plane[index].podCity=data.departureCity;//出发城市
            this.ruleForm.plane[index].podPlace=data.departureAirport;//出发机场
            this.ruleForm.plane[index].podTime=data.departureTime;//出发时间
            this.ruleForm.plane[index].arriveCity=data.reachingCity;//到达城市
            this.ruleForm.plane[index].arrivePlace=data.arrivalAirport; //到达机场
            this.ruleForm.plane[index].arriveTime=data.arrivalTime;//到达时间
            this.ruleForm.plane[index].planeDay=data.day;//到达天数
            this.ruleForm.plane[index].trafficMode=data.byType;//出行方式
          }
        })
      },
      handleSelectPod_02(index){//返程获取
        if(this.ruleForm.nackPlane[index].pod == ''){
          this.clearBle_01(index);
          return false;
        }
        this.$http.post(this.GLOBAL.serverSrc + '/Flight/flighs/api/getnum',{
          "number":this.ruleForm.nackPlane[index].pod
        }).then(res => {
          if(res.data.isSuccess == true){
            let data = res.data.object;
            this.ruleForm.nackPlane[index].company=data.company;//航空公司
            this.ruleForm.nackPlane[index].theNumber=data.number;//航班号
            this.ruleForm.nackPlane[index].podCity=data.departureCity;//出发城市
            this.ruleForm.nackPlane[index].podPlace=data.departureAirport;//出发机场
            this.ruleForm.nackPlane[index].podTime=data.departureTime;//出发时间
            this.ruleForm.nackPlane[index].arriveCity=data.reachingCity;//到达城市
            this.ruleForm.nackPlane[index].arrivePlace=data.arrivalAirport; //到达机场
            this.ruleForm.nackPlane[index].arriveTime=data.arrivalTime;//到达时间
            this.ruleForm.nackPlane[index].planeDay=data.day;//到达天数
            this.ruleForm.nackPlane[index].trafficMode=data.byType;//出行方式
          }
        })
      },
      querySearch(queryString, cb) {
        //this.flightsList =[]
        this.$http.post(this.GLOBAL.serverSrc + '/flight/api/list', {
          "object": {
            "id": 0,
            "byType": 0,
            "day": 0,
            "company": "",
            "number": "",
            "departureCity": "",
            "departureAirport": "",
            "departureTime": "",
            "reachingCity": "",
            "arrivalAirport": "",
            "arrivalTime": "",
            "createTime": "2019-03-21T01:58:24.499Z",
            "code": "",
            "isDeleted": 0,
            "isForeign": 0
          }
        }).then(res => {
          //console.log(res)
          for(let i=0;i<res.data.objects.length;i++){
            this.flightsList.push({
              "value" : res.data.objects[i].number + this.ruleForm.plane[i].company,
              "id":res.data.objects[i].id
            })
          }
          var results = queryString ? this.flightsList.filter(this.createFilter(queryString)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
        /*var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);*/
      },
      handledelete(name){

      },
      handlePoint(targetName){
        if(this.changeIndex >= this.packLen){
          this.$confirm('套餐未保存切换将丢失数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.changeIndex = targetName.index
            var that = this
            this.$http.post(
              this.GLOBAL.serverSrc + "/team/api/teaminfoget",
              {
                "object": {
                  "id": this.$route.query.id,
                  "loadPackage": true
                }

              }
            )
              .then(function (obj) {

                console.log(obj.data.object);
                that.ruleForm.travelDays = obj.data.object.day//行程天数
                that.ruleForm.travelNight = obj.data.object.night//行程晚数
                that.dynamicTags3 = obj.data.object.pods//出发地
                that.dynamicTags4 = obj.data.object.destinations//目的地
                that.ruleForm.highlightWords = obj.data.object.package[that.changeIndex].name //行程信息套餐名
                that.ruleForm.origin = obj.data.object.package[that.changeIndex].pod //行程信息出发地
                that.ruleForm.bourn = obj.data.object.package[that.changeIndex].destination //行程信息目的地
                that.ruleForm.podID = obj.data.object.package[that.changeIndex].podID //行程信息出发地ID
                that.ruleForm.destinationID = obj.data.object.package[that.changeIndex].destinationID//行程信息目的地ID
                that.packLen = obj.data.object.package.length
                that.ruleForm.plane = []
                that.ruleForm.nackPlane = []
                for (var i =0; i < obj.data.object.package[that.changeIndex].traffic.length; i++ ){
                  let arr = [];
                  if(obj.data.object.package[that.changeIndex].traffic[i].goOrBack == 1){
                    obj.data.object.package[that.changeIndex].traffic[i].ext_Stopover = [];//TODO 经停
                    that.ruleForm.plane.push(obj.data.object.package[that.changeIndex].traffic[i]);
                    arr.push(String(obj.data.object.package[that.changeIndex].traffic[i].trafficMode));
                    that.ruleForm.plane[i].www = arr;
                  }else{
                    obj.data.object.package[that.changeIndex].traffic[i].ext_Stopover = [];//TODO 经停
                    arr.push(String(obj.data.object.package[that.changeIndex].traffic[i].trafficMode));
                    obj.data.object.package[that.changeIndex].traffic[i].www = arr;
                    that.ruleForm.nackPlane.push(obj.data.object.package[that.changeIndex].traffic[i]);

                  }

                }

                //日程信息
                for (let j = 0; j < obj.data.object.package[that.changeIndex].schedules.length; j++) {
                  setTimeout(arr => {
                    that.ruleForm.schedules[j].subject =  obj.data.object.package[that.changeIndex].schedules[j].subject //主题
                    /* that.ruleForm.schedules[j].ext_Hotel.Details =  obj.data.object.package[0].schedules[j].info //主题*/
                    that.content_02 =  obj.data.object.package[that.changeIndex].schedules[j].info //详情
                    //早餐
                    if( JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].label == "早餐" && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].Myself == "0"){
                      that.ruleForm.schedules[j].ext_Meals[0].Myself = "0"
                    }else if(JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].label == "早餐"  && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].Myself == "1"){
                      that.ruleForm.schedules[j].ext_Meals[0].Myself = "1"
                      that.ruleForm.schedules[j].ext_Meals[0].Detail = JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].Detail
                    }
                    //午餐
                    if( JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].label == "午餐" && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].Myself == "0"){
                      that.ruleForm.schedules[j].ext_Meals[1].Myself = "0"
                    }else if(JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].label == "午餐"  && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].Myself == "1"){
                      that.ruleForm.schedules[j].ext_Meals[1].Myself = "1"
                      that.ruleForm.schedules[j].ext_Meals[1].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Detail
                    }
                    // 晚餐
                    if( JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].label == "晚餐" && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].Myself == "0"){
                      that.ruleForm.schedules[j].ext_Meals[2].Myself = "0"
                    }else if(JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].label == "晚餐"  && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].Myself == "1"){
                      that.ruleForm.schedules[j].ext_Meals[2].Myself = "1"
                      that.ruleForm.schedules[j].ext_Meals[2].Detail = JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].Detail
                    }
                    that.ruleForm.schedules[j].activitys = []
                    for (let k = 0; k < obj.data.object.package[that.changeIndex].schedules[j].activitys.length; k++) {
                      that.ruleForm.schedules[j].activitys.push(obj.data.object.package[that.changeIndex].schedules[j].activitys[k])
                      that.ruleForm.schedules[j].activitys[k].activityType = String(that.ruleForm.schedules[j].activitys[k].activityType)
                    }
                    console.log( )
                  }, 100)
                }
                that.mealID  =  obj.data.object.package[that.changeIndex].id //模板id
                that.ruleForm.productNamel = obj.data.object.title; //产品名称
                that.ruleForm.travelType = String(obj.data.object.isForeign); //出游类型

                that.explain = []
                for (let t = 0; t < obj.data.object.instructions.length; t++ ){
                  that.explain.push(obj.data.object.instructions[t])
                }
              })
              .catch(function (obj) {
                console.log(obj)
              })

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.editableTabsValue = String(parseInt(this.editableTabsValue)+1)
          });

        }else{
          this.changeIndex = targetName.index
            var that = this
            this.$http.post(
              this.GLOBAL.serverSrc + "/team/api/teaminfoget",
              {
                "object": {
                  "id": this.$route.query.id,
                  "loadPackage": true
                }

              }
            )
              .then(function (obj) {

                console.log(obj.data.object);
                that.ruleForm.travelDays = obj.data.object.day//行程天数
                that.ruleForm.travelNight = obj.data.object.night//行程晚数
                that.dynamicTags3 = obj.data.object.pods//出发地
                that.dynamicTags4 = obj.data.object.destinations//目的地
                that.ruleForm.highlightWords = obj.data.object.package[that.changeIndex].name //行程信息套餐名
                that.ruleForm.origin = obj.data.object.package[that.changeIndex].pod //行程信息出发地
                that.ruleForm.bourn = obj.data.object.package[that.changeIndex].destination //行程信息目的地
                that.ruleForm.podID = obj.data.object.package[that.changeIndex].podID //行程信息出发地ID
                that.ruleForm.destinationID = obj.data.object.package[that.changeIndex].destinationID//行程信息目的地ID
                that.packLen = obj.data.object.package.length
                that.ruleForm.plane = []
                that.ruleForm.nackPlane = []
                for (var i =0; i < obj.data.object.package[that.changeIndex].traffic.length; i++ ){
                  let arr = [];
                  if(obj.data.object.package[that.changeIndex].traffic[i].goOrBack == 1){
                    obj.data.object.package[that.changeIndex].traffic[i].ext_Stopover = [];//TODO 经停
                    that.ruleForm.plane.push(obj.data.object.package[that.changeIndex].traffic[i]);
                    arr.push(String(obj.data.object.package[that.changeIndex].traffic[i].trafficMode));
                    that.ruleForm.plane[i].www = arr;
                  }else{
                    obj.data.object.package[that.changeIndex].traffic[i].ext_Stopover = [];//TODO 经停
                    arr.push(String(obj.data.object.package[that.changeIndex].traffic[i].trafficMode));
                    obj.data.object.package[that.changeIndex].traffic[i].www = arr;
                    that.ruleForm.nackPlane.push(obj.data.object.package[that.changeIndex].traffic[i]);

                  }

                }

                //日程信息
                for (let j = 0; j < obj.data.object.package[that.changeIndex].schedules.length; j++) {
                  setTimeout(arr => {
                    that.ruleForm.schedules[j].subject =  obj.data.object.package[that.changeIndex].schedules[j].subject //主题
                    /* that.ruleForm.schedules[j].ext_Hotel.Details =  obj.data.object.package[0].schedules[j].info //主题*/
                    that.content_02 =  obj.data.object.package[that.changeIndex].schedules[j].info //详情
                    //早餐
                    if( JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].label == "早餐" && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].Myself == "0"){
                      that.ruleForm.schedules[j].ext_Meals[0].Myself = "0"
                    }else if(JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].label == "早餐"  && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].Myself == "1"){
                      that.ruleForm.schedules[j].ext_Meals[0].Myself = "1"
                      that.ruleForm.schedules[j].ext_Meals[0].Detail = JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[0].Detail
                    }
                    //午餐
                    if( JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].label == "午餐" && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].Myself == "0"){
                      that.ruleForm.schedules[j].ext_Meals[1].Myself = "0"
                    }else if(JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].label == "午餐"  && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[1].Myself == "1"){
                      that.ruleForm.schedules[j].ext_Meals[1].Myself = "1"
                      that.ruleForm.schedules[j].ext_Meals[1].Detail = JSON.parse(obj.data.object.package[0].schedules[j].ext_Meals)[1].Detail
                    }
                    // 晚餐
                    if( JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].label == "晚餐" && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].Myself == "0"){
                      that.ruleForm.schedules[j].ext_Meals[2].Myself = "0"
                    }else if(JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].label == "晚餐"  && JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].Myself == "1"){
                      that.ruleForm.schedules[j].ext_Meals[2].Myself = "1"
                      that.ruleForm.schedules[j].ext_Meals[2].Detail = JSON.parse(obj.data.object.package[that.changeIndex].schedules[j].ext_Meals)[2].Detail
                    }
                    that.ruleForm.schedules[j].activitys = []
                    for (let k = 0; k < obj.data.object.package[that.changeIndex].schedules[j].activitys.length; k++) {
                      that.ruleForm.schedules[j].activitys.push(obj.data.object.package[that.changeIndex].schedules[j].activitys[k])
                      that.ruleForm.schedules[j].activitys[k].activityType = String(that.ruleForm.schedules[j].activitys[k].activityType)
                    }
                    console.log( )
                  }, 100)
                }
                that.mealID  =  obj.data.object.package[that.changeIndex].id //模板id
                that.ruleForm.productNamel = obj.data.object.title; //产品名称
                that.ruleForm.travelType = String(obj.data.object.isForeign); //出游类型

                that.explain = []
                for (let t = 0; t < obj.data.object.instructions.length; t++ ){
                  that.explain.push(obj.data.object.instructions[t])
                }
              })
              .catch(function (obj) {
                console.log(obj)
              })


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
      handleSelect(item) {
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 搜索方法(出发地)
      querySearch1(queryString1, cb1) {
        var results1 = queryString1 ? this.tableData1.filter(this.createFilter(queryString1)) : [];
        cb1(results1);
      },
      // 搜索方法（出发地）
      // createFilter1(queryString1) {
      //   return (restaurant1) => {
      //     return (restaurant1.country.toLowerCase().indexOf(queryString1.toLowerCase()) === 0);
      //   }
      // },
      beforeUploadVideo(file) {
        const isLt20M = file.size / 1024 / 1024  < 20;
        if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
          this.$message.error('请上传正确的视频格式');
          return false;
        }
        if (!isLt20M) {
          this.$message.error('上传视频大小不能超过20MB哦!');
          return false;
        }
        // const seconds = file.duration % 60;
        //  if (!seconds) {
        //     this.$message.error('上传视频时长不能超过20秒哦!');
        //     return false;
        // }
      },
      uploadVideoProcess(event, file, fileList){
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0);
      },
      //图片预览
      handleImgClick(file){
        this.isShowImg = !this.isShowImg
        this.imgUrl = file.url
      },
      handleRemove(file, fileList) {
        this.isShowImg = false;
      },
      //轮播图预览
      slideshowClick(file){
        this.isSlideshow = true;
        if(this.slideshowUrl == file.url){
          this.isSlideshow = false;
          this.slideshowUrl = ''
        } else {
          this.slideshowUrl = file.url
        }
      },
      handleRemove2(file, fileList){
        this.isSlideshow = false;
      },
      //视频删除
      handleRemoves(file, fileList) {
        // console.log(file);
      },
      //轮播图删除
      handleRemoves1(file, fileList) {
        // console.log(file);
      },
      //运营标签
      handleClose2(tag2) {
        this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
      },
      showInput2() {
        this.inputVisible2 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm2() {
        this.$refs['operationLabel'].validate()
        if(this.ruleForm.operationLabel !== ''){
          setTimeout(res =>{
            let inputVal4 = this.ruleForm.operationLabel;
            // if (inputVal4) {
            //   this.dynamicTags4.push(inputVal4);
            //  }
            this.inputVisible2 = false;
            this.ruleForm.operationLabel= '';
            this.empty = false;
          },200)
        }else{
          if(this.dynamicTags2.length == 0){
            this.empty = true;
            document.getElementById('input-error').style.border="solid 1px red";
          }else{
            this.inputVisible2 = false;
          }
        }
      },
      querySearch5(queryString5, cb) {
        this.tableData2 = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/olabel/api/olabelfuzzy', {
          "object": {
            labelName: queryString5
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.tableData2.push({
              "value" : res.data.objects[i].labelName,
              "id":res.data.objects[i].id
            })
          }
          var results = queryString5 ? this.tableData2.filter(this.createFilter(queryString5)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      dest_01(item){
        this.dynamicTags2.push({"labelID": item.id,"label": item.value,"teamID":0});
        this.ruleForm.operationLabel = "";
        this.inputVisible2 = false;
      },
      // 出发地
      querySearch3(queryString1, cb) {
        this.vague = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString1
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.vague.push({
              "id":res.data.objects[i].id,
              "value" : res.data.objects[i].areaName
            })
          }
          var results = queryString1 ? this.vague.filter(this.createFilter(queryString1)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      createFilter(queryString1){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      //目的地
      querySearch2(queryString2, cb) {
        this.tableData1 = []
        this.$http.post(this.GLOBAL.serverSrc + '/universal/area/api/fuzzy', {
          "object": {
            areaName: queryString2
          }
        },{
          headers:{
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
          for(let i=0;i<res.data.objects.length;i++){
            this.tableData1.push({
              "value" : res.data.objects[i].areaName,
              "id":res.data.objects[i].id
            })
          }
          var results = queryString2 ? this.tableData1.filter(this.createFilter(queryString2)) : [];
          cb(results)
        }).catch(err => {
          console.log(err);
        })
      },
      createFilter(queryString2){
        return (restaurant) => {
          return (restaurant.value);
        }
      },
      //出游人群
      themeList(){
        this.excurList = [];
        this.$http.post(this.GLOBAL.serverSrc + "/universal/crowd/api/crowdlist", {
          object: {
            isDeleted: 0
          }
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(res =>{
          for(let i = 0; i < res.data.objects.length; i++){
            this.excurList.push(
              res.data.objects[i].name
            );
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      //主题
      itemList(){
        this.list = [];
        var _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/theme/api/themelist", {
          object: {
            isDeleted: 0
          }
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          for(let i = 0; i < response.data.objects.length; i++){
            _this.list.push(
              response.data.objects[i].name
            );
          }
        }).catch(function(error){
          console.log(error);
        })
      },
      // 生成guid
      guid(){
        var _this = this;
        this.$http.post(this.GLOBAL.serverSrc + "/universal/utinity/api/getguid", {
          "object":true
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(res){
          // console.log(res)
          localStorage.setItem("guid",res.data.object)
        }).catch(function(err){
          console.log(err);
        })
      },
      // 出发地
      handleClose3(tag3) {
        if(tag3.id==this.ruleForm.origin.id){
          this.ruleForm.origin=[];
        }
        this.dynamicTags3.splice(this.dynamicTags3.indexOf(tag3), 1);
      },
      showInput3() {
        this.inputVisible3 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      departure(item){
        this.dynamicTags3.push({"podID": item.id,"pod": item.value});
        this.ruleForm.placeDeparture = "";
        this.inputVisible3 = false;
      },
      //aa
      handleInputConfirm3() {
        this.$refs['placeDeparture'].validate()
        if(this.ruleForm.placeDeparture !== ''){
          setTimeout(res =>{
            // for(let i=0;i<this.dynamicTags3.length;i++){
            // if(this.dynamicTags3[i].indexOf(this.ruleForm.placeDeparture) !== -1){
            // this.dynamicTags3.splice(this.dynamicTags3[i].indexOf(this.ruleForm.placeDeparture), 1)
            // }
            // }
            let inputVal3 = this.ruleForm.placeDeparture;
            //  if (inputVal3) {
            //   this.dynamicTags3.push(inputVal3);
            //    }
            this.inputVisible3 = false;
            this.ruleForm.placeDeparture= '';
            this.noNull = false
          },200)
        } else {
          if(this.dynamicTags3.length == 0){
            this.noNull = true
            document.getElementById('ddd').style.border="solid 1px red";
          } else {
            this.inputVisible3 = false;
          }
        }
      },
      // 目的地
      handleClose4(tag4) {
        if(tag4.id==this.ruleForm.bourn.id){
          this.ruleForm.bourn=[];
        }
        this.dynamicTags4.splice(this.dynamicTags4.indexOf(tag4), 1);
      },
      showInput4() {
        this.inputVisible4 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      dest(item){
        this.dynamicTags4.push({"destinationID": item.id,"destination": item.value});
        this.ruleForm.destinations = "";
        this.inputVisible4 = false;
      },
      handleInputConfirm4() {
        this.$refs['destinations'].validate()
        if(this.ruleForm.destinations !== ''){
          setTimeout(res =>{
            let inputVal4 = this.ruleForm.destinations;
            // if (inputVal4) {
            //   this.dynamicTags4.push(inputVal4);
            //  }
            this.inputVisible4 = false;
            this.ruleForm.destinations= '';
            this.errorNull = false;
          },200)
        }else{
          if(this.dynamicTags4.length == 0){
            this.errorNull = true;
            document.getElementById('input-error').style.border="solid 1px red";
          }else{
            this.inputVisible4 = false;
          }
        }
      },
      formatDate(date){
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h=h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second=date.getSeconds();
        second=second < 10 ? ('0' + second) : second;
        //return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        return y + '-' + m + '-' + d+' '+h+':'+minute;
      }
    }
  }
</script>

<style scoped>
  .change_save{ position: absolute;top: 70px;right: 206px;}
  .aid_address{float: left; }
  .set_meal_name{float: left;margin-left: 150px;margin-top: 5px;}
  .border_side{border: 1px solid #f2f2f2; width:100%; margin-left: 30px; float: left; padding-top: 10px;}
  .span2{ float:left; margin-left:16px; }
  .tripInfo { font-family: '微软雅黑'; font-size: 14px; margin: 0 0 100px 0; }
  .warp { position: relative; padding-bottom: 100px; }
  .btn { width: 160px; height: 44px; left: 68%; top: -64px; position: absolute; }
  .el-tabs--card>>>.el-tabs__item { margin-bottom: 0px!important; }
  .outline { border: 1px solid #f2f2f2; overflow: hidden; margin: 0 0 100px 0; }
  .highlightWords-input1 { width: 200px; float: left; }
  .span1 { float: left; margin: 0 0 0 10px; }
  .package { text-align: left; line-height: 40px; margin: 20px 0 0 30px; }
  .package_text { float: left; margin: 0 15px 0 0; }
  .package_input { float: left; width: 200px; margin: 0 15px 0 0; }
  .traffic { margin: 20px 0 0 30px; text-align: left; clear: both; }
  .traffic_title { font-size: 14pt; font-weight: bold; line-height: 60px; }
  .traffic_border { border: 1px solid #f2f2f2; width: 84%; overflow: hidden; margin: 0 0 20px 0; clear: both; }
  .traffic_button { float: left; margin: 10px 0 20px 30px; line-height: 40px; font-size: 20px; }
  .plane { width: 98%; overflow: hidden; background-color: #fafafa; margin-left: 1%; margin-bottom: 20px; margin-top: 20px; }
  .plane_type { width: 80px; margin: 20px 0 0 20px; }
  .plane_text { margin: 0 0 0 15px; }
  .aviation { padding: 0 0 0 0; clear: both; width: 100%; }
  .aviation_first { margin: 0 0 0 0; float: left; }
  .aviation_text { width: 85px; text-align: right; margin: 0 15px 0 0; float: left; line-height: 40px; }
  .aviation_input { width: 200px; float: left; }
  .day { width: 85px; float: left; margin: 0 0 0 25px; }
  .stop { clear: both; padding: 20px 0 20px 20px; }
  .stop_button { border: 1px solid #ff4b3a; }
  .hotel_button { line-height: 40px; margin: 10px 0 20px 15px; }
  .inline-input { float: left; width: 200px !important; }
  .upload-demo { position: absolute; top: 0; left: 200px; height: 40px; }
  .textarea { float: left; width: 60%; }
  .date { padding: 20px 0 0 30px; font-size: 18px; font-weight: bold; clear: both; }
  .radio_input { float: left; margin: 10px 0 0 0; }
  .food_text { width: 85px; text-align: right; margin: 0 15px 0 0; line-height: 40px; }
  .food_radio { margin: 0 0 0 100px; float: left; }
  .repast { float: left; width: 60px; }
  .state { margin: 0 0 0 20px; }
  .text_input { padding: 0 0 20px 0; overflow: hidden; width: 100%; }
  .type_radio { float: left; }
  ul { padding: 0px; margin: 10px 0 0 0; margin: 0 0 0 0; }
  ul .type_list { float: left; list-style-type: none; margin: 0 10px 0 0; text-align: left; }
  .tabCon { clear: both; padding: 20px 0 0 0; }
  .active { color: #ff5a3a }
  .schedule_border { border: 1px solid #f2f2f2; width: 85%; overflow: hidden; margin: 0 0 20px 0; }
  .schedule { overflow: hidden; background-color: #f9f9f9; margin-left: 0; margin-bottom: 20px; margin-top: 0px; }
  .schedule_tab { margin: 20px 0 0 15px; }
  .schedule_first { margin: 0 0 0 0; float: left; }
  .city { margin: 0 0 0 0; overflow: hidden; }
  .city_input { float: left; }
  .minutes { float: left; line-height: 40px; margin: 0 0 0 15px; }
  .textarea1 { float: left; width: 100%; }
  .dashed { border-bottom: 1px dashed #e5e5e5; overflow: hidden; height: 1px; width: 98%; margin-right: auto; margin-left: auto; margin-bottom: 20px; }
  .add { width: 450px; height: 250px; margin: auto; position: fixed; top: 50%; left: 50%; margin-top: -125px; margin-left: -225px; background: #fff; overflow: hidden; border: 1px solid #eeeeee; border-radius: 3px; z-index: 1000; }
  .label { background: #f6f6f6; border-bottom: 1px solid #eee; height: 57px; line-height: 40px; width: 450px; }
  .left { float: left; margin: 10px 0 0 20px; }
  .right { float: right; margin: 0 20px 0 0; font-size: 16pt; cursor: pointer; line-height: 57px; }
  .content { width: 310px; overflow: hidden; margin-left: auto; margin-right: auto; }
  .text { float: left; line-height: 40px; margin: 50px 0 0 0; }
  .input { float: left; width: 180px; margin: 0 0 0 15px; }
  .judge { padding: 30px 0 0 0; clear: both; }
  .mask { background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0; filter: alpha(opacity=50); opacity: 0.5; z-index: 100; }
  .inputBox { width: 200px; }
  .abc { height: 40px; width: 200px; line-height: 40px; text-align: center; margin: 10px 0 0 0; width: 100%; clear: both; }
  .transit { clear: both; padding: 0 0 0 20px; }
  .transit_border { border: 1px dashed #e5e5e5; width: 98%; margin-left: 1%; overflow: hidden; }
  .delete { float: left; line-height: 40px; margin: 0 0 0 40px; color: #2e96f9; cursor: pointer; }
  .addTab { padding: 0 0 20px 20px; float: left; }
  .describe_way { float: left; }
  .description { overflow: hidden; float: left; }
  .description li { list-style: none; float: left; margin: 0 0 20px 15px; text-align: left; }
  /*.cost_bg { margin: 12px; }*/
  .setmeal { float: left; }
  .depart { float: left; width: 140px; }
  .setout { float: left; line-height: 40px; margin: 0 10px 0 30px; }
  .setout span { color: red; margin: 0 5px 0 0; }
  /*日程信息*/
  .type_radio li { list-style: none; float: left; margin: 0 30px 0 0; }
  .details_ul { margin: 0 0 0 60px; }
  .explain { clear: both; padding: 15px 0 0 0; width: 100%; }
  .details_border { border: 1px solid #f2f2f2; width: 80%; margin: 0 0 20px 0; clear: both; position: relative; }
  .DAY { width: 40px; line-height: 40px; text-align: center; width: 100px; position: absolute; top: 55px; right: -120px; z-index: 10000 }
  .DAY_one { border-bottom: 1px solid #fff; }
  .DAY_two { background-color: #f7f7f7; border-bottom: 1px solid #fff; }
  .myactive { background-color: #c2c2c2; }
  .mybuttonac { background-color: #ecf5ff; border: 1px solid #c6e2ff }
  /*基本信息*/
  .productName{ width: 548px; float: left; margin-left: 10px; }
  .Numbers{ float: left; margin: 0 0 0 20px; }
  .travelType{ float: left; margin:13px 0 0 10px; }
  .startOff{ width:548px; float:left; margin-left:10px;}
  .route{overflow:hidden}
  .routeDay{width:300px; float:left}
  .routeDay-input{width:105px;right:30px}
  .routeDay-span{ margin-left:-19px; color:#333; }
  .routeNight{width:300px; float:left; margin: 0 0 0 -30px;}
  .routeNight-input{width:105px; float: left;}
  .routeNight-span{ margin-left:-100px; color:#333; float: left; }
  .indent{ float: left; margin-left: 10px; margin-top: 13px; }
  .bright{ width: 210px; float: left; margin-left: 10px; }
  .bright_b{float:left;margin-left:295px;margin-top:-62px;}
  .lightspot{ width: 210px; float: left; margin-left: 30px; }
  .lightspot-span{float: left; margin-left:16px; }
  .destination-input{width: 548px; float: left; margin-left: 10px; padding-bottom:-0.5px; border: 1px solid #dcdfe6; border-radius: 4px;}
  .operating_input{background:red;width:100px;height:200px}
  .firstFigure{width:200px;float:left;margin-left:10px;position:relative}
  .upload-demo{float:left;}
  .upload_div{height:215px;width:330px;position:absolute;z-index:9999;top:50px;left:30px;border:10px solid #D7D7D7;background:#fdfdfd;}
  .upload_img{display:block;width:100%;height:100%;}
  .banner{width:540px;float:left;margin-left:10px;position:relative}
  .Excursion-select{ width:166px; float: left; margin-left: 10px; }
  .applyDay{ width: 105px; float: left; margin-left: 10px; }
  .apply_day{ float: left; margin-left: 10px; color:#333;}
  .latest{overflow:hidden;}
  .minute_input{width:50px;float:left;margin-left:-95px;}
  .minute_span{ float:left; margin-left:-30px; color:#333; }
  .Summary{ width:544px; float:left; margin-left:8px; }
  .bright-number{float: left; margin: 0 0 0 17px;}
  .el-form-item>>>.el-form-item__error{left: 10px;}
  .vivo{text-align: center; margin: 0 0 50px 0;}
  .vivo>>>.el-tabs__item { width: 144px ; margin-bottom: 10px; font-size: 16px; }
  .el-tag { height:36px; float: left; margin-top: 1px; margin-left: 5px; background-color: #d7d7d7; color: #666666; }
  .input-new-tag { width:100px; float: left; margin-left: 5px; height: 36px; line-height: 30px; padding-top: 2px;margin-top:1px; margin-bottom:1px;}
  .el-autocomplete>>>.el-input--small .el-input__inner{ height: 35px!important; }
  .input-new-tags{ width:200px; float: left; margin-left: 5px; height: 30px; line-height: 30px; padding-top: 1px;margin-top:1px; margin-bottom:4px; padding-bottom: 2px}
  .operation_Label{ width:120px; float: left; margin-left: 5px; height: 36px; line-height: 30px; padding-top: 2px;margin-top:1px; margin-bottom:1px; }
  #isNull,#zero{ position: relative; float: left; top:30px; left:-550px ; color: #f56c6c; font-size: 12px;}
  .redStar{ color: #f56c6c; float: left; margin-left:-64px;}
  .number-day>>>.el-form-item__error{ left:0px; }
  .err_span>>>.el-form-item__error{ left:0px; }
  .lable_input{ width:200px; float: left; margin-left: 5px; height: 34px; line-height: 30px; padding-top: 1px;margin-top:1px; margin-bottom:0px; padding-bottom: 2px }
  .upload-btn{ position: absolute;left:-80px;top:0px; }
  .upload-demo>>>.el-upload-list__item{ top: -45px;
    left: -183px; background-color:#d7d7d7; float: left; width: 90px; height: 30px; padding: 0; background-size: 44%; background-repeat: no-repeat; background-position: 2px; background-image: url('../../../assets/image/pic.png') }
  .destination-input>>>.el-input--small .el-input__inner{ height: 35px!important; }
  /*费用说明*/
  .cost{
    font-weight: bold;
    font-size: 18px;
    height: 23px;
    margin: 6px 0 0 0;
    text-align: left;
  }
  .cost_button{
    margin: 10px 0 10px 0;
    text-align: left;
  }
  .cost_title{
    margin: 20px 0 0 10px;
    padding-top: 20px;
    text-align: left;
    font-family: 黑体;
    color: #333333;
  }
  .cost_content{
    width: 850px;
    margin: 15px 0 15px 10px;
    overflow: hidden;
    text-align: left;
  }
  .cost_bg{
    background: #e6e6e6;
    width: 870px;
    margin: 0 0 50px 0;
    overflow: hidden;

  }
  .content_explain{
    margin: 0 0 20px 0;
    background-color: #fff;
  }

  .other{margin: 0 0 50px 0; overflow: hidden;}

  .border{border: 1px solid #e7e7e7; width: 1070px; margin: 10px 0 10px 0;padding-bottom: 10px}

  .delete_button{float: left;margin: 0 0 0 10px; overflow: hidden;}

  .delete_button button{border: 1px solid #f56c6c;margin-bottom: 30px}

  .delete_button button:hover{color:#f56c6c; border: 1px solid #f56c6c;}
  .tab_size>>>.el-tabs__item{
    font-size: 25px;
  }
</style>
