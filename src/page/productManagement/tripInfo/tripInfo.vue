<template style="position: relative;">
    <div class="tripInfo">
      <div class="btn">
        <el-button plain>取消</el-button>
        <el-button type="primary">保存</el-button>
      </div>
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
            <!--描述方式-->
            <div>26+5+6565</div>

            <!--描述方式结束-->

            <div class="traffic_border">
              <div>
                <div class="traffic_button">去程</div>
                <div class="traffic_button"><el-button @click="addTransit(editableTabsValue3)" type="primary">添加中转</el-button></div>
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
                    <div class="aviation" style="margin-top:20px;">
                      <!--第一个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="航空公司" prop="placeDeparture">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="航班号" prop="destination">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.destination" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                    </div>
                    <!--第一行结束-->
                    <!--第二行-->
                    <div class="aviation">
                      <!--第一个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发城市" prop="Departure">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.Departure" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发机场" prop="airport">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.airport" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">出发时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value1" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                    </div>
                    <!--第二行结束-->
                    <!--第三行-->
                    <div class="aviation">
                      <!--第一个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达城市" prop="arriveCity">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arriveCity" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达机场" prop="arrive">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arrive" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">到达时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value2" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                      <el-select class="day" v-model="value3" placeholder="当日">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                    <!--第三行结束-->
                    <!--添加经停-->
                    <div v-model="editableTabsValue2" type="card" closable v-show="isshow">
                      <div class="transit_border"></div>
                      <div class="abc" v-for="(item, index) in editableTabs2">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="经停城市" prop="placeDeparture">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="经停时间" prop="placeDeparture">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <div class="minutes">分钟</div>
                        <div class="delete" @click.prevent="removeDomain(item)">删除</div>
                      </div>
                    </div>
                    <!--添加经停结束-->
                    <div class="transit"><el-button style="float:left; margin-bottom:10px;" @click="addTab(editableTabsValue2)">添加经停</el-button></div>
                </div>
              <!--飞机结束-->

              <!--飞机-->
              <div v-model="editableTabsValue3" type="card" closable>
                <div class="plane"  v-for="(item, index) in editableTabs3">
                    <el-select class="plane_type" v-model="value5" placeholder="飞机">
                      <el-option v-for="item in options" :key="item.value" :label="item.label":value="item.value"></el-option>
                    </el-select>
                    <span class="plane_text">第</span>
                    <el-select class="plane_type" v-model="value11" collapse-tags style="margin-left: 20px;" placeholder="1">
                      <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="plane_text">天</span>
                    <!--第一行-->
                    <div class="aviation" style="margin-top:20px;">
                      <!--第一个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="航空公司" prop="placeDeparture">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="航班号" prop="destination">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.destination" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                    </div>
                    <!--第一行结束-->
                    <!--第二行-->
                    <div class="aviation">
                      <!--第一个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发城市" prop="Departure">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.Departure" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发机场" prop="airport">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.airport" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">出发时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value1" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                    </div>
                    <!--第二行结束-->
                    <!--第三行-->
                    <div class="aviation">
                      <!--第一个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达城市" prop="arriveCity">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arriveCity" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达机场" prop="arrive">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arrive" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">到达时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value2" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                      <el-select class="day" v-model="value3" placeholder="当日">
                        <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                    <!--第三行结束-->
                    <!--添加经停-->
                    <div v-model="editableTabsValue2" type="card" closable v-show="isshow">
                      <div class="transit_border"></div>
                      <div class="abc" v-for="(item, index) in editableTabs2">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="经停城市" prop="placeDeparture">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="经停时间" prop="placeDeparture">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <div class="minutes">分钟</div>
                        <div class="delete" @click.prevent="removeDomain(item)">删除</div>
                      </div>
                    </div>
                    <!--添加经停结束-->
                    <div style="width:100%;">
                      <div class="addTab"><el-button @click="addTab(editableTabsValue2)">添加经停</el-button></div>
                      <div class="addTab"><el-button class="stop_button" plain>删除中转</el-button></div>
                    </div>
                </div>
              </div>
              <!--飞机结束-->

              <!--火车-->
              <div class="plane" style="display:none;">
                <el-select class="plane_type" v-model="value7" placeholder="火车">
                  <el-option v-for="item in options" :key="item.value" :label="item.label":value="item.value"></el-option>
                </el-select>
                <span class="plane_text">第</span>
                <el-select class="plane_type" v-model="value8" collapse-tags style="margin-left: 20px;" placeholder="1">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="plane_text">天</span>
                <!--第一行-->
                <div class="aviation" style="margin-top:20px;">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="车次" prop="trains">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.trains" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="出发城市" prop="trainCity">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.trainCity" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  
                  <!--第二个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="出发车站" prop="station">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.station" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value1" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="到达城市" prop="arriveCity1">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arriveCity1" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  
                  <!--第二个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="到达车站" prop="arrivalTime">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arrivalTime" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value2" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                  <el-select class="day" v-model="value3" placeholder="当日">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                  </el-select>
                </div>
                <!--第三行结束-->
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
                <div class="aviation" style="margin-top:20px;">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="出发城市" prop="trainCity">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.trainCity" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  
                  <!--第二个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="出发车站" prop="station">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.station" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value1" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="到达城市" prop="arriveCity1">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arriveCity1" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  
                  <!--第二个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="到达车站" prop="arrivalTime">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arrivalTime" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value2" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                  <el-select class="day" v-model="value3" placeholder="当日">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label":value="item.value"></el-option>
                  </el-select>
                </div>
                <!--第三行结束-->
                <!--第三行结束-->
                <div class="stop"><el-button class="stop_button" plain>删除中转</el-button></div>
              </div>
              <!--汽车结束-->
              <!--轮船-->
              <div class="plane" style="display:none;">
                <el-select class="plane_type" v-model="value14" placeholder="轮船">
                  <el-option v-for="item in options" :key="item.value" :label="item.label":value="item.value"></el-option>
                </el-select>
                <span class="plane_text">第</span>
                <el-select class="plane_type" v-model="value15" collapse-tags style="margin-left: 20px;" placeholder="1">
                  <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="plane_text">天</span>
                <!--第一行-->
                <div class="aviation" style="margin-top:20px;">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="邮轮公司" prop="placeDeparture">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.placeDeparture" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  
                  <!--第二个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="邮轮号" prop="destination">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.destination" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="出发城市" prop="Departure">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.Departure" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  
                  <!--第二个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="出发码头" prop="airport">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.airport" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">出发时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value1" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="到达城市" prop="arriveCity">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arriveCity" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  
                  <!--第二个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="到达码头" prop="arrive">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.arrive" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                  <!--第三个-->
                  <div class="aviation_first">
                    <div class="aviation_text">到达时间</div>
                    <div class="aviation_input"><el-date-picker style="width:200px;" v-model="value2" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                  </div>
                  <el-select class="day" v-model="value3" placeholder="当日">
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
              <div class="hotel_button"><el-button @click="addHotel(editableTabsValue4)" type="primary">添加酒店</el-button></div>
              <!--酒店-->
              <div v-model="editableTabsValue4" type="card" closable v-show="information">
                <div class="plane" v-for="(item, index) in editableTabs4">
                  <!--第一行-->
                  <div class="aviation" style="margin-top:20px;">
                    <!--第一个-->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="自动填充" prop="arrivalTime">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.state2" :trigger-on-focus="false"@select="handleSelect">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                    
                  </div>  

                  <!--第一行结束-->
                  <!--第二行-->
                  <div class="aviation">
                    <!--第一个-->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="酒店中文" prop="hotelChinese">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.hotelChinese" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                    <!--第二个-->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="酒店英文" prop="hotelEnglish">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.hotelEnglish" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                  </div>
                  <!--第二行结束-->
                  <!--第三行-->
                  <div class="aviation">
                    <!--第一个-->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="酒店地址" prop="hotelAddress">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.hotelAddress" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
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
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="所在城市" prop="hotelCity">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.hotelCity" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                    <!--第二个-->
                    <div class="aviation_first">
                      <div class="aviation_text">入住晚数</div>
                      <el-select class="aviation_input" v-model="value21" placeholder="一天">
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
                  <div class="aviation" style="margin-top:20px;">
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
                  <div class="aviation" style="margin-top:20px;">
                    <div class="aviation_text">简介</div>
                    <div class="textarea"><el-input type="textarea":rows="10" placeholder="请输入内容"v-model="textarea3"></el-input></div>
                  </div>
                  <!--第七行结束-->
                  <div class="stop"><el-button @click="closeHotel" class="stop_button" plain>删除酒店</el-button></div>
                </div>
              </div>
              <!--酒店结束-->





            </div>
          </div>
          <!--酒店信息结束-->

          <!--活动详情-->
          <div class="traffic">
            <div class="traffic_title">日程信息</div>
            <div class="traffic_border">
              <!--酒店-->
              <div class="plane">
                <div class="date">DAY1</div>
                <!--第一行-->
                <div class="aviation">
                  <!--第一个-->
                  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                    <el-form-item label="主题" prop="theme">
                        <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="ruleForm.theme" :trigger-on-focus="false">
                        </el-autocomplete>
                    </el-form-item>
                  </el-form>
                </div>
                <!--第一行结束-->
                <!--第二行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="aviation_text">住宿</div>
                    <div class="type_radio" style="margin:10px 0 0 0;">
                      <ul>
                          <li class="type_list" 
                          v-for="(item,index) in tabs" 
                          :class="{active:index == num}"
                           @click="tab(index)"><input type="radio" name="radios">{{item}}</li>
                      </ul>
                      <!--<div class="tabCon">
                          <div 
                          v-for='(itemCon,index) in tabContents' 
                          v-show=" index == num">{{itemCon}}</div>
                      </div>-->
                      <div class="tabCon">
                          <div 
                          v-for='(itemCon,index) in tabContents' 
                          v-show=" index == num">
                            <div>
                              <el-button>{{itemCon}}</el-button>
                              <el-button>{{itemCon}}</el-button>
                            </div>
                          </div>
                      </div>
                  </div>
                </div>
                </div>
                <!--第二行结束-->
                <!--第三行-->
                <div class="aviation">
                  <!--第一个-->
                  <div class="food_text">餐饮</div>
                </div>
                <!--第三行结束-->
                <!--第四行-->
                <div class="aviation" style="margin-top:20px;">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="food_radio">
                      <div class="repast">早餐</div>
                      <el-radio v-model="radio1" label="1">自理</el-radio>
                      <el-radio v-model="radio1" label="2">详细说明</el-radio>
                    </div>
                  </div>
                </div>
                <!--第四行结束-->
                <!--第四行-->
                <div class="aviation" style="margin-top:20px;">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="food_radio">
                      <div class="repast">午餐</div>
                      <el-radio v-model="radio2" label="1">自理</el-radio>
                      <el-radio v-model="radio2" label="2">详细说明</el-radio>
                    </div>
                  </div>
                </div>
                <!--第四行结束-->
                <!--第四行-->
                <div class="aviation" style="margin-top:20px;">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="food_radio">
                      <div class="repast">晚餐</div>
                      <el-radio v-model="radio3" label="1">自理</el-radio>
                      <el-radio v-model="radio3" label="2">详细说明</el-radio>
                    </div>
                  </div>
                </div>
                <!--第四行结束-->
                <!--第五行-->
                 <div class="aviation" style="margin-top:20px;">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="food_radio"><el-input class="state" v-model="input27" placeholder="餐饮说明"></el-input></div>
                  </div>
                </div>
                <!--第五行结束-->
                <!--第六行-->
                <div class="aviation" style="margin-top:20px;">
                  <div class="aviation_text">详情</div>
                  <div class="textarea"><el-input class="text_input" type="textarea":rows="10" placeholder="请输入内容"v-model="textarea2"></el-input></div>
                </div>
                <!--第六行结束-->
              </div>
            </div>
          </div>
          <!--日程信息结束-->

          <!--日程信息-->
          <div class="traffic">
            <div class="traffic_title">活动详情</div>
            <div class="schedule_border">
              <!--酒店-->
              
              <div class="schedule_tab">
                <el-tabs :tab-position="tabPosition">
                  <el-tab-pane label="DAY1">
                    <div class="schedule">
                      <div class="date">DAY1</div>
                        <div class="aviation">
                          <!--第一个-->
                          <div class="schedule_first">
                            <div class="type_radio">
                              <ul style="margin:0 0 0 50px;">
                                  <li class="type_list" 
                                  v-for="(item,index) in tabs1" 
                                  :class="{active:index == num1}"
                                   @click="tab1(index)"><input type="radio" name="radios">{{item}}</li>
                              </ul>
                              <!--<div class="tabCon">
                                  <div 
                                  v-for='(itemCon,index) in tabContents' 
                                  v-show=" index == num">{{itemCon}}</div>
                              </div>-->
                              <div class="tabCon">
                                  <div 
                                  v-for='(itemCon,index) in tabContents1' 
                                  v-show=" index == num1">
                                    <div class="city">
                                      <div class="aviation">
                                        <div class="aviation_text">{{itemCon}}</div>
                                        <div class="aviation_input"><el-input v-model="input28" placeholder="请输入内容"></el-input></div>
                                        <div class="aviation_text">活动时间</div>
                                        <div class="city_input"><el-input v-model="input29" placeholder=""></el-input></div>
                                        <div class="minutes">分钟</div>
                                      </div>
                                      <div class="aviation" style="margin-top:20px;">
                                        <div class="aviation_text">{{itemCon}}</div>
                                        <div class="aviation_input"><el-input v-model="input30" placeholder="请输入内容"></el-input></div>
                                      </div>
                                      <div class="aviation" style="padding-top:20px;">
                                        <div class="aviation_text">详细说明</div>
                                        <div class="textarea1"><el-input class="text_input" type="textarea":rows="2" placeholder="请输入内容"v-model="textarea4"></el-input></div>
                                      </div>
                                      <div class="dashed">&nbsp;</div>
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

                                      <div class="aviation" style="padding-top:20px;">
                                        <div class="aviation_text">简介</div>
                                        <div class="textarea1"><el-input class="text_input" type="textarea":rows="10" placeholder="请输入内容"v-model="textarea5"></el-input></div>
                                      </div>
                                      <div class="stop"><el-button class="stop_button" plain>删除详情</el-button></div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="DAY2">
                    <div class="schedule">
                      <div class="date">DAY1</div>
                        <div class="aviation">
                          <!--第一个-->
                          <div class="schedule_first">
                            <div class="type_radio">
                              <ul style="margin:0 0 0 50px;">
                                  <li class="type_list" 
                                  v-for="(item,index) in tabs1" 
                                  :class="{active:index == num1}"
                                   @click="tab1(index)"><input type="radio" name="radios">{{item}}</li>
                              </ul>
                              <!--<div class="tabCon">
                                  <div 
                                  v-for='(itemCon,index) in tabContents' 
                                  v-show=" index == num">{{itemCon}}</div>
                              </div>-->
                              <div class="tabCon">
                                  <div 
                                  v-for='(itemCon,index) in tabContents1' 
                                  v-show=" index == num1">
                                    <div class="city">
                                      <div class="aviation">
                                        <div class="aviation_text">{{itemCon}}</div>
                                        <div class="aviation_input"><el-input v-model="input28" placeholder="请输入内容"></el-input></div>
                                        <div class="aviation_text">活动时间</div>
                                        <div class="city_input"><el-input v-model="input29" placeholder=""></el-input></div>
                                        <div class="minutes">分钟</div>
                                      </div>
                                      <div class="aviation" style="margin-top:20px;">
                                        <div class="aviation_text">{{itemCon}}</div>
                                        <div class="aviation_input"><el-input v-model="input30" placeholder="请输入内容"></el-input></div>
                                      </div>
                                      <div class="aviation" style="padding-top:20px;">
                                        <div class="aviation_text">详细说明</div>
                                        <div class="textarea1"><el-input class="text_input" type="textarea":rows="2" placeholder="请输入内容"v-model="textarea4"></el-input></div>
                                      </div>
                                      <div class="dashed">&nbsp;</div>
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

                                      <div class="aviation" style="padding-top:20px;">
                                        <div class="aviation_text">简介</div>
                                        <div class="textarea1"><el-input class="text_input" type="textarea":rows="10" placeholder="请输入内容"v-model="textarea5"></el-input></div>
                                      </div>
                                      <div class="stop"><el-button class="stop_button" plain>删除详情</el-button></div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="DAY3">
                    <div class="schedule">
                      <div class="date">DAY1</div>
                        <div class="aviation">
                          <!--第一个-->
                          <div class="schedule_first">
                            <div class="type_radio">
                              <ul style="margin:0 0 0 50px;">
                                  <li class="type_list" 
                                  v-for="(item,index) in tabs1" 
                                  :class="{active:index == num1}"
                                   @click="tab1(index)"><input type="radio" name="radios">{{item}}</li>
                              </ul>
                              <!--<div class="tabCon">
                                  <div 
                                  v-for='(itemCon,index) in tabContents' 
                                  v-show=" index == num">{{itemCon}}</div>
                              </div>-->
                              <div class="tabCon">
                                  <div 
                                  v-for='(itemCon,index) in tabContents1' 
                                  v-show=" index == num1">
                                    <div class="city">
                                      <div class="aviation">
                                        <div class="aviation_text">{{itemCon}}</div>
                                        <div class="aviation_input"><el-input v-model="input28" placeholder="请输入内容"></el-input></div>
                                        <div class="aviation_text">活动时间</div>
                                        <div class="city_input"><el-input v-model="input29" placeholder=""></el-input></div>
                                        <div class="minutes">分钟</div>
                                      </div>
                                      <div class="aviation" style="margin-top:20px;">
                                        <div class="aviation_text">{{itemCon}}</div>
                                        <div class="aviation_input"><el-input v-model="input30" placeholder="请输入内容"></el-input></div>
                                      </div>
                                      <div class="aviation" style="padding-top:20px;">
                                        <div class="aviation_text">详细说明</div>
                                        <div class="textarea1"><el-input class="text_input" type="textarea":rows="2" placeholder="请输入内容"v-model="textarea4"></el-input></div>
                                      </div>
                                      <div class="dashed">&nbsp;</div>
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

                                      <div class="aviation" style="padding-top:20px;">
                                        <div class="aviation_text">简介</div>
                                        <div class="textarea1"><el-input class="text_input" type="textarea":rows="10" placeholder="请输入内容"v-model="textarea5"></el-input></div>
                                      </div>
                                      <div class="stop"><el-button class="stop_button" plain>删除详情</el-button></div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="DAY4">
                    46456464565
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
          </div>
          <!--活动详情结束-->
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
            <div class="right" @click="shutHotel">×</div>
          </div>
          <div class="content">
            <div class="text">是否删除该套餐</div>
            <div class="judge">
              <el-button @click="shutHotel">取消</el-button>
              <el-button @click="downHotel" type="primary">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <!--酒店弹窗结束-->

      
      





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
        input27:'',
        input28:'',
        input29:'',
        input30:'',
        value1:'',
        value2:'',
        value3:'',
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
        textarea2:'',
        textarea4:'',
        textarea5:'',
        ruleForm:{
          productName: '',
          travelType: "1",
          placeDeparture: '',
          Departure:'',
          airport:'',
          arriveCity:'',
          arrive:'',
          trains:'',
          trainCity:'',
          station:'',
          arriveCity1:'',
          arrivalTime:'',
          state2:'',
          hotelChinese:'',
          hotelEnglish:'',
          hotelAddress:'',
          hotelCity:'',
          theme:'',
          highlightWords: ''
        },
        rules:{
          highlightWords:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' },
          ],
          placeDeparture:[
          { required: true, message: '不能为空', trigger: 'blur' }
          ],
          destination:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          Departure:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          airport:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          airport:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          arriveCity:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          arrive:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          trains:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          trainCity:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          station:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          arriveCity1:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          arrivalTime:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          state2:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelChinese:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelEnglish:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelAddress:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelCity:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          theme:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
        },
        fileList2:[],
        radio: '1',
        radio1:'1',
        radio2:'1',
        radio3:'1',
        radio4:'1',
        tabs: ["酒店", "其他"],
        tabContents: ["酒店一", "酒店二"],
        tabs1:["景点","购物","自费项目"],
        tabContents1: ["城市", "名称","名称"],
        num: 0, 
        num1:0,
        param:'1',
        tabPosition: 'right',
        comboshow:false,
        aindex:0,
        isshow:false,
        editableTabsValue2: '2',
        editableTabs2: [{
          content: '',
          item: [{
            ruleForm: ''
          }]
        }],
        editableTabsValue3: '2',
        editableTabs3: [{
          content: ''
        }],
        editableTabsValue4: '2',
        editableTabs4: [{
          content: ''
        }],
        hotelshow:false,
        information:true,
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
      removeDomain(item) {
        var index = this.editableTabs2.indexOf(item)
        if (index !== -1) {
          this.editableTabs2.splice(index, 1)
        }
      },
      close(){
        this.comboshow=false;
      },
      confirm(){
        this.handleTabsEdit(this.aindex, "remove");
        this.comboshow=false;
      },
      tab(index) {
        this.num = index;
      },
      tab1(index){
        this.num1 = index;
      },
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
          if(this.comboshow==false){
            this.comboshow=true;
            this.aindex=targetName;
            return false;
          }else{
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
      },
      addTab(targetName) {
        this.isshow=true;
        let newTabName = ++this.tabIndex + '';
        this.editableTabs2.push({
        });
        this.editableTabsValue2 = newTabName;
      },
      addTransit(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs3.push({
        });
        this.editableTabsValue3 = newTabName;
      },
      addHotel(targetName) {
        this.information=true;
        let newTabName = ++this.tabIndex + '';
        this.editableTabs4.push({
        });
        this.editableTabsValue4 = newTabName;
      },
      closeHotel(){
        this.hotelshow=true;
      },
      shutHotel(){
        this.hotelshow=false;
      },
      downHotel(){
        this.hotelshow=false;
        this.information=false;
      },
    },
    mounted() {
      this.restaurants = this.loadAll();
    }
    
  }
</script>

<style scoped>
  
  .tripInfo{ font-family: '微软雅黑'; font-size: 14px; margin: 0 0 100px 0;}
  .warp {position: relative;padding-bottom:100px;}
  .btn {width: 160px; height: 44px;right: 0;top: -64px;position: absolute;}

  .el-tabs--card>>>.el-tabs__item{margin-bottom: 0px!important;}

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
  .plane{width: 98%; overflow: hidden;background-color: #fafafa; margin-left:1%; margin-bottom:20px; margin-top:20px;}
  .plane_type{ width: 80px; margin: 20px 0 0 20px;}
  .plane_text{ margin: 0 0 0 15px; }
  .aviation{padding: 0 0 0 0; clear: both; width: 100%; overflow: hidden;}
  .aviation_first{margin: 0 0 0 0; float: left;}
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

  .food_text{width: 85px; text-align: right; margin: 0 15px 0 0; line-height: 40px;}
  .food_radio{ margin: 0 0 0 100px; }
  .repast{float: left; width: 60px;}
  .state{margin: 0 0 0 60px;}
  .text_input{padding: 0 0 20px 0; overflow: hidden; width: 100%;}
  
  .type_radio{float: left;}
  ul{padding: 0px;margin: 10px 0 0 0; margin: 0 0 0 0;}
  ul .type_list{ float: left; list-style-type: none; margin: 0 10px 0 0; text-align: left;}
  .tabCon{clear:both; padding: 20px 0 0 0;}
  .active{color:#ff5a3a}

  .schedule_border{border:1px solid #f2f2f2; width: 85%; overflow: hidden; margin: 0 0 20px 0;}
  .schedule{ overflow: hidden;background-color: #f9f9f9; margin-left:0; margin-bottom:20px; margin-top:0px;}
  .schedule_tab{margin: 20px 0 0 15px;}
  .schedule_first{ margin: 0 0 0 0; float: left; }

  .city{margin: 0 0 0 0; overflow: hidden;}
  .city_input{float: left;}
  .minutes{float: left; line-height: 40px; margin: 0 0 0 15px;}
  .textarea1{float: left; width: 80%;}
  .dashed{border-bottom: 1px dashed #e5e5e5; overflow:hidden; height: 1px; width: 90%; margin-right: auto; margin-left: auto; margin-bottom:20px;}


  .add{width: 450px; height: 250px;margin: auto;position: fixed; top:50%; left:50%; margin-top:-125px; margin-left:-225px; background: #fff; overflow: hidden; border:1px solid #eeeeee; border-radius: 3px; z-index: 1000;}
  .label{ background: #f6f6f6; border-bottom: 1px solid #eee;height: 57px; line-height: 40px; width: 450px;}
  .left{ float: left; margin: 10px 0 0 20px; }
  .right{float: right; margin: 0 20px 0 0;font-size: 16pt;cursor:pointer; line-height: 57px; }
  .content{ width: 310px; overflow: hidden;margin-left:auto;margin-right:auto;}
  .text{float: left; line-height: 40px;margin: 50px 0 0 0;}
  .input{float: left; width: 180px; margin: 0 0 0 15px;}
  .judge{padding: 30px 0 0 0; clear: both;}

  .popup{}
  .mask{background-color: #000; width: 100%; height: 100%; position: fixed; top: 0; left: 0;filter:alpha(opacity=50);opacity:0.5; z-index: 100;}
  .inputBox{width: 200px;}

  .abc{height: 40px; width: 200px; line-height: 40px; text-align: center; margin: 10px 0 0 0; width: 100%; clear: both;}
  .transit{clear: both; padding: 0 0 0 20px;}
  .transit_border{border: 1px dashed #e5e5e5; width: 98%;margin-left:1%; }
  .delete{float: left; line-height: 40px; margin: 0 0 0 40px; color:#2e96f9;cursor:pointer;}
  .addTab{padding: 0 0 20px 20px; float: left;}
      
</style>