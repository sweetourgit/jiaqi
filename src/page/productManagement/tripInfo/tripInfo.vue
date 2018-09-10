<template style="position: relative;">
    <div class="tripInfo">
      <div class="btn">
        <el-button plain>取消</el-button>
        <el-button type="primary" @click="addsave('ruleForm')">保存</el-button>
      </div>
      <!--外边框-->
      <div class="outline">
        <!--套餐-->
      <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
        <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title" :name="item.name">
          <!--套餐名-->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item class="setmeal" label="套餐名" prop="highlightWords">
              <el-input maxlength=10 v-model="ruleForm.highlightWords" class="highlightWords-input1" placeholder="10个字以内"></el-input>
              <span class="span1">{{ruleForm.highlightWords.length}}/10字</span>
            </el-form-item>
            <!--出发地-->
            <div class="setout"><span>*</span>出发地</div>
            <el-select  class="depart" v-model="origin" placeholder="出发地">
              <el-option v-for="item in place" :key="item.value" :label="item.label":value="item.value"></el-option>
            </el-select>
            <!--目的地-->
            <div class="setout"><span>*</span>目的地</div>
            <el-select  class="depart" v-model="bourn" placeholder="目的地">
              <el-option v-for="item in destination" :key="item.value" :label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form>
            
          <!--套餐名结束-->
          <!--交通信息-->
          <div class="traffic">
            <div class="traffic_title">交通信息</div>
            <!--描述方式-->
            <div class="describe_way">描述方式</div>
            <ul class="description">
              <li v-for="(item,index) in describe" :class="{active:index == num5}" @click="tab(index)">
                <span v-if="index=='0'">
                  <el-radio  label="0" v-model="matter_radio" checked>{{item}}</el-radio>
                </span>
                <span v-if="index=='1'">
                  <el-radio label="1" v-model="matter_radio">{{item}}</el-radio>
                </span>
                <span v-if="index=='2'">
                  <el-radio label="2" v-model="matter_radio">{{item}}</el-radio>
                </span>
              </li>
            </ul>

            <!--描述方式结束-->
            <div v-for="(itemCon,index) in pattern" v-show="index == num5">
              <!--详细说明-->
              <div v-if="index ==0"  class="traffic_border">
                <div>
                  <div class="traffic_button">去程</div>
                  <div class="traffic_button"><el-button @click="addTransit" type="primary">添加中转</el-button></div>
                </div>
                <!--去程-->
                <div class="plane" v-for="(item, index) in plane" :key="item.index">
                  <div class="" style=" clear:both; margin:0 0 0 0;">
                    <!--v-modal="item.planeVehicle" -->
                    <el-cascader class="plane_type" :options="goRoad" @change="(v)=>{item.planeVehicle=v[0]}" placeholder="飞机"></el-cascader>
                    <span class="plane_text">第</span>
                    <el-select class="plane_type" v-model="item.planeDays" collapse-tags style="margin-left: 20px;" placeholder="1">
                      <el-option v-for="item in goDate" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="plane_text">天</span>
                  </div>
                  <div v-if="item.planeVehicle == '1'">
                      <!--第一行-->
                      <div class="aviation" style="margin-top:20px; position:relative;">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="航空公司" prop="planeCompany">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCompany" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="航班号" prop="planeNumber">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeNumber" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>

                        <!--航班号自动填充-->
                        <div class="aviation" style="position:absolute; top:-60px; left:300px;">
                          <el-form :model="item" label-width="100px" style="float:left;">
                            <el-form-item label="自动填充" prop="planeAuto">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAuto" :trigger-on-focus="false"@select="handleSelect">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                        </div> 

                      </div>
                      <!--第一行结束-->
                      <!--第二行-->
                      <div class="aviation">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发城市" prop="planeCity">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发机场" prop="planeAirport">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">出发时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                      </div>
                      <!--第二行结束-->
                      <!--第三行-->
                      <div class="aviation">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达城市" prop="planeArrive">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达机场" prop="planeReach">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeReach" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">到达时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                        <el-select class="day" v-model="item.planeDay" placeholder="当日">
                          <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                        </el-select>
                      </div>
                      <!--第三行结束-->
                      <!--添加经停-->
                      <div closable>
                        <div class="transit_border" v-show="lineshow"></div>
                        <div class="abc"  v-for="(iteml, p) in item.stop" :key="p"  type="text">
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停城市" prop="stopCity">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停时间" prop="stopDate">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <div class="minutes">分钟</div>
                          <div class="delete" @click="deleteItem(p,index)">删除</div>
                        </div>
                      </div>
                      <!--添加经停结束-->
                      <div class="transit"><el-button style="float:left; margin-bottom:10px;" @click="stopping(index)">添加经停</el-button></div>
                      <div class="addTab"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                  </div>
                  <div v-if="item.planeVehicle == '2'">
                    <!--第一行-->
                    <div class="aviation" style="margin-top:20px;">
                      <!--第一个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="车次" prop="planeNumber">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeNumber" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                    </div>
                    <!--第一行结束-->
                    <!--第二行-->
                    <div class="aviation">
                      <!--第一个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发城市" prop="planeCity">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发车站" prop="planeAirport">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">出发时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                    </div>
                    <!--第二行结束-->
                    <!--第三行-->
                    <div class="aviation">
                      <!--第一个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达城市" prop="planeArrive">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达车站" prop="planeReach">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeReach" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">到达时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                      <el-select class="day" v-model="item.planeDay" placeholder="当日">
                        <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                    <!--第三行结束-->
                    <!--第三行结束-->
                    <div class="stop"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                  </div>
                  <div v-if="item.planeVehicle == '3'">
                    <!--第二行-->
                    <div class="aviation" style="margin-top:20px;">
                      <!--第一个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发城市" prop="planeCity">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="出发车站" prop="planeAirport">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">出发时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                    </div>
                    <!--第二行结束-->
                    <!--第三行-->
                    <div class="aviation">
                      <!--第一个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达城市" prop="planeArrive">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      
                      <!--第二个-->
                      <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                        <el-form-item label="到达车站" prop="planeAirport">
                            <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                            </el-autocomplete>
                        </el-form-item>
                      </el-form>
                      <!--第三个-->
                      <div class="aviation_first">
                        <div class="aviation_text">到达时间</div>
                        <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                      </div>
                      <el-select class="day" v-model="item.planeDay" placeholder="当日">
                        <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                    <!--第三行结束-->
                    <!--第三行结束-->
                    <div class="stop"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                  </div>
                  <div v-if="item.planeVehicle == '4'">
                      <!--第一行-->
                      <div class="aviation" style="margin-top:20px; position:relative;">
                        <!--第一个-->
                        <el-form :model="item"  :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="游轮公司" prop="planeCompany">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCompany" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="游轮号" prop="planeNumber">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeNumber" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>

                      </div>
                      <!--第一行结束-->
                      <!--第二行-->
                      <div class="aviation">
                        <!--第一个-->
                        <el-form :model="item"  :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发城市" prop="planeCity">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发码头" prop="planeAirport">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">出发时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                      </div>
                      <!--第二行结束-->
                      <!--第三行-->
                      <div class="aviation">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达城市" prop="planeArrive">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达码头" prop="planeReach">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeReach" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">到达时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                        <el-select class="day" v-model="item.planeDay" placeholder="当日">
                          <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                        </el-select>
                      </div>
                      <!--第三行结束-->
                      <!--添加经停-->
                      <div closable>
                        <div class="transit_border" v-show="lineshow"></div>
                        <div class="abc"  v-for="(iteml, p) in item.stop" :key="p"  type="text">
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停城市" prop="stopCity">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停时间" prop="stopDate">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <div class="minutes">分钟</div>
                          <div class="delete" @click="deleteItem(p,index)">删除</div>


                        </div>
                      </div>
                      <!--添加经停结束-->
                      <div class="transit"><el-button style="float:left; margin-bottom:10px;" @click="stopping(index)">添加经停</el-button></div>
                      <div class="addTab" v-show="deleteTransit"><el-button class="stop_button" @click="deletePanel(index)">删除中转</el-button></div>
                  </div>
                </div>
                <!--返程-->
                 <div>
                  <div class="traffic_button">返程</div>
                  <div class="traffic_button"><el-button @click="addRTransit" type="primary">添加中转</el-button></div>
                </div>
                <div class="plane" v-for="(item, index) in nackPlane" :key="item.index">
                  <div class="" style=" clear:both; margin:0 0 0 0;">
                      <!--v-modal="item.planeVehicle" -->
                      <el-cascader class="plane_type" :options="goRoad" @change="(v)=>{item.planeVehicle=v[0]}" placeholder="飞机"></el-cascader>
                      <span class="plane_text">第</span>
                      <el-select class="plane_type" v-model="item.planeDays" collapse-tags style="margin-left: 20px;" placeholder="1">
                        <el-option v-for="item in goDate" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                      <span class="plane_text">天</span>
                  </div>
                  <!--飞机-->
                    <div v-if="item.planeVehicle == '1'">
                        <!--第一行-->
                        <div class="aviation" style="margin-top:20px; position:relative;">
                          <!--第一个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="航空公司" prop="planeCompany">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCompany" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <!--第二个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="航班号" prop="planeNumber">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeNumber" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>

                          <!--航班号自动填充-->
                          <div class="aviation" style="position:absolute; top:-60px; left:300px;">
                            <el-form :model="item" label-width="100px" style="float:left;">
                              <el-form-item label="自动填充" prop="planeAuto">
                                  <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAuto" :trigger-on-focus="false"@select="handleSelect">
                                  </el-autocomplete>
                              </el-form-item>
                            </el-form>
                          </div> 

                        </div>
                        <!--第一行结束-->
                        <!--第二行-->
                        <div class="aviation">
                          <!--第一个-->
                          <el-form  :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="出发城市" prop="planeCity">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          
                          <!--第二个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="出发机场" prop="planeAirport">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <!--第三个-->
                          <div class="aviation_first">
                            <div class="aviation_text">出发时间</div>
                            <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                          </div>
                        </div>
                        <!--第二行结束-->
                        <!--第三行-->
                        <div class="aviation">
                          <!--第一个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="到达城市" prop="planeArrive">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          
                          <!--第二个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="到达机场" prop="planeReach">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeReach" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <!--第三个-->
                          <div class="aviation_first">
                            <div class="aviation_text">到达时间</div>
                            <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                          </div>
                          <el-select class="day" v-model="item.planeDay" placeholder="当日">
                            <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                          </el-select>
                        </div>
                        <!--第三行结束-->
                        <!--添加经停-->
                        <div v-model="form" type="card" closable>
                          <div class="transit_border" v-show="Returnline"></div>
                           <div class="abc"  v-for="(iteml, p) in item.stop" :key="p"  type="text">
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停城市" prop="stopCity">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停时间" prop="stopDate">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <div class="minutes">分钟</div>
                          <div class="delete" @click="reDeleteItem(p,index)">删除</div>
                        </div>
                        </div>
                        <!--添加经停结束-->
                         <div class="transit"><el-button style="float:left; margin-bottom:10px;" @click="reStopping(index)">添加经停</el-button></div>
                        <div class="addTab" v-show="deleteTransit"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                    </div>
                    <div v-if="item.planeVehicle == '2'">
                      <!--第一行-->
                      <div class="aviation" style="margin-top:20px;">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="车次" prop="planeNumber">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeNumber" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                      </div>
                      <!--第一行结束-->
                      <!--第二行-->
                      <div class="aviation">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发城市" prop="planeCity">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发车站" prop="planeAirport">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">出发时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                      </div>
                      <!--第二行结束-->
                      <!--第三行-->
                      <div class="aviation">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达城市" prop="planeArrive">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达车站" prop="planeReach">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeReach" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">到达时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                        <el-select class="day" v-model="item.planeDay" placeholder="当日">
                          <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                        </el-select>
                      </div>
                      <!--第三行结束-->
                      <!--第三行结束-->
                      <div class="stop"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                    </div>
                    <div v-if="item.planeVehicle == '3'">
                      <!--第二行-->
                      <div class="aviation" style="margin-top:20px;">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发城市" prop="planeCity">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="出发车站" prop="planeAirport">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">出发时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                      </div>
                      <!--第二行结束-->
                      <!--第三行-->
                      <div class="aviation">
                        <!--第一个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达城市" prop="planeArrive">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        
                        <!--第二个-->
                        <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                          <el-form-item label="到达车站" prop="planeAirport">
                              <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                              </el-autocomplete>
                          </el-form-item>
                        </el-form>
                        <!--第三个-->
                        <div class="aviation_first">
                          <div class="aviation_text">到达时间</div>
                          <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                        </div>
                        <el-select class="day" v-model="item.planeDay" placeholder="当日">
                          <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                        </el-select>
                      </div>
                      <!--第三行结束-->
                      <!--第三行结束-->
                      <div class="stop"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                    </div>
                    <div v-if="item.planeVehicle == '4'">
                        <!--第一行-->
                        <div class="aviation" style="margin-top:20px; position:relative;">
                          <!--第一个-->
                          <el-form :model="item"  :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="游轮公司" prop="planeCompany">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCompany" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          
                          <!--第二个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="游轮号" prop="planeNumber">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeNumber" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>

                        </div>
                        <!--第一行结束-->
                        <!--第二行-->
                        <div class="aviation">
                          <!--第一个-->
                          <el-form  :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="出发城市" prop="planeCity">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeCity" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          
                          <!--第二个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="出发码头" prop="planeAirport">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeAirport" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <!--第三个-->
                          <div class="aviation_first">
                            <div class="aviation_text">出发时间</div>
                            <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDepart" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                          </div>
                        </div>
                        <!--第二行结束-->
                        <!--第三行-->
                        <div class="aviation">
                          <!--第一个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="到达城市" prop="planeArrive">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeArrive" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          
                          <!--第二个-->
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="到达码头" prop="planeReach">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.planeReach" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <!--第三个-->
                          <div class="aviation_first">
                            <div class="aviation_text">到达时间</div>
                            <div class="aviation_input"><el-date-picker style="width:200px;" v-model="item.planeDate" type="datetime" placeholder="选择出发时间"></el-date-picker></div>
                          </div>
                          <el-select class="day" v-model="item.planeDay" placeholder="当日">
                            <el-option v-for="item in goDay" :key="item.value" :label="item.label":value="item.value"></el-option>
                          </el-select>
                        </div>
                        <!--第三行结束-->
                        <!--添加经停-->
                        <div v-model="form" type="card" closable>
                          <div class="transit_border" v-show="lineshow"></div>
                             <div class="abc"  v-for="(iteml, p) in item.stop" :key="p"  type="text">
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停城市" prop="stopCity">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopCity" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                            <el-form-item label="经停时间" prop="stopDate">
                                <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="iteml.stopDate" :trigger-on-focus="false">
                                </el-autocomplete>
                            </el-form-item>
                          </el-form>
                          <div class="minutes">分钟</div>
                          <div class="delete" @click="reDeleteItem(p,index)">删除</div>
                        </div>
                        </div>
                        <!--添加经停结束-->
                        <div class="transit"><el-button style="float:left; margin-bottom:10px;" @click="reStopping(index)">添加经停</el-button></div>
                        <div class="addTab" v-show="deleteTransit"><el-button class="stop_button" @click="reDeletePanel(index)">删除中转</el-button></div>
                    </div>
                </div>
            </div>
              <!--详细说明结束-->

              <!--简要说明-->
              <div class="traffic_border" v-if="index ==1" >
                <div class="plane">
                  <div class="cost_bg">
                    <div class="cost_content" style="background: #FFFFFF">
                      <vue-editor v-model="content"></vue-editor>
                    </div>
                  </div>
                </div>
              </div>
              <!--简要说明结束-->
            </div>
          </div>
          <!--交通信息结束-->

          <!--酒店信息-->
          <div class="traffic">
            <div class="traffic_title">酒店信息</div>
            <div class="traffic_border">
              <div class="hotel_button"><el-button @click="addHotel" type="primary">添加酒店</el-button></div>
              <!--酒店-->
              <div type="card" closable v-for="(item, index) in hotel" :key="index">
                <div class="plane">
                  <!--第一行-->
                  <div class="aviation" style="margin-top:20px;">
                    <!--第一个-->
                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="自动填充" prop="hotelAuto">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.hotelAuto" :trigger-on-focus="false"@select="handleSelect">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                    
                  </div>  

                  <!--第一行结束-->
                  <!--第二行-->
                  <div class="aviation">
                    <!--第一个-->
                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="酒店中文" prop="hotelChinese">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.hotelChinese" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                    <!--第二个-->
                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="酒店英文" prop="hotelEnglish">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.hotelEnglish" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                  </div>
                  <!--第二行结束-->
                  <!--第三行-->
                  <div class="aviation">
                    <!--第一个-->
                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="酒店地址" prop="hotelAddress">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.hotelAddress" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                    <!--第二个-->
                    <div class="aviation_first">
                      <div class="aviation_text">酒店星级</div>
                      <el-select class="aviation_input" v-model="item.hotelStar" placeholder="三星">
                        <el-option v-for="item in hotelStars" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <!--第三行结束-->
                  <!--第四行-->
                  <div class="aviation">
                    <!--第一个-->
                    <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left;">
                      <el-form-item label="所在城市" prop="hotelCity">
                          <el-autocomplete class="inputBox" clearable placeholder="输入出发地名称" :fetch-suggestions="querySearch" v-model="item.hotelCity" :trigger-on-focus="false">
                          </el-autocomplete>
                      </el-form-item>
                    </el-form>
                    <!--第二个-->
                    <div class="aviation_first">
                      <div class="aviation_text">入住晚数</div>
                      <el-select class="aviation_input" v-model="item.hotelDay" placeholder="一天">
                        <el-option v-for="item in hotelDays" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <!--第四行结束-->
                  <!--第五行-->
                  <div class="aviation">
                    <!--第一个-->
                    <div class="aviation_first">
                      <div class="aviation_text">房型</div>
                      <el-select class="aviation_input" v-model="item.hotelHouse" placeholder="单人间">
                        <el-option v-for="item in hotelRoom" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                    <!--第二个-->
                    <div class="aviation_first">
                      <div class="aviation_text">床型</div>
                      <el-select class="aviation_input" v-model="item.hotelBed" placeholder="双人床">
                        <el-option v-for="item in hotelType" :key="item.value" :label="item.label":value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <!--第五行结束-->
                  <!--第六行-->
                  <div class="aviation" style="padding-top:20px;">
                    <div class="aviation_first">
                      <div class="aviation_text">图片</div>
                      <div class="aviation_input" style="position: relative;">
                        <el-input placeholder="请输入内容"></el-input>
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
                  <div class="aviation" style="padding-top:20px;">
                    <div class="aviation_text">简介</div>
                    <div class="textarea"><el-input type="textarea":rows="10" placeholder="请输入内容"v-model="item.hotelAbstract"></el-input></div>
                  </div>
                  <!--第七行结束-->
                  <div class="stop"><el-button @click="deleteHotel" class="stop_button" plain>删除酒店</el-button></div>
                </div>
              </div>
              <!--酒店结束-->





            </div>
          </div>
          <!--酒店信息结束-->

          <!--活动详情-->
          <div class="traffic">
            <div class="traffic_title">日程信息</div>
            <div class="details_border">
              <!--日程信息-->
              <div class="date">DAY1</div>
              <div class="plane">
                <!--第一行-->
                <div class="aviation">
                  <!--第一个-->
                  <el-form :model="item" :rules="rules" ref="ruleForm" label-width="100px" style="float:left; margin:30px 0 0 0;">
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
                        <li v-for="(item,index) in schedule" :class="{active:index == num6}" @click="tabHotel(index)">
                          <span v-if="index=='0'">
                            <el-radio  label="0" v-model="schedule_radio" checked>{{item}}</el-radio>
                          </span>
                          <span v-if="index=='1'">
                            <el-radio label="1" v-model="schedule_radio">{{item}}</el-radio>
                          </span>
                        </li>
                      </ul>
                      <div class="explain">
                        <div v-for="(itemCon,index) in schedule_hotel" v-show="index == num6">
                         <div v-if="index ==0" >
                           <el-button>酒店一</el-button>
                           <el-button>酒店二</el-button>
                           <el-button>酒店三</el-button>
                         </div>
                         <div v-if="index ==1" >
                           <el-button>其他一</el-button>
                           <el-button>其他二</el-button>
                           <el-button>其他三</el-button>
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
                <div class="aviation" style="padding-top:20px;">
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
                <div class="aviation" style="padding-top:20px;">
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
                <div class="aviation" style="padding-top:20px;">
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
                 <div class="aviation" style="padding-top:20px;">
                  <!--第一个-->
                  <div class="aviation_first">
                    <div class="food_radio"><el-input class="state" placeholder="餐饮说明"></el-input></div>
                  </div>
                </div>
                <!--第五行结束-->
                <!--第六行-->
                <div class="aviation" style="padding-top:20px;">
                  <div class="aviation_text">详情</div>
                  <div class="textarea"><el-input class="text_input" type="textarea":rows="10" placeholder="请输入内容"v-model="scheduleDetails"></el-input></div>
                </div>
                <!--第六行结束-->
                <!--活动详情-->
                <div class="date">活动详情</div>
                <div class="hotel_button"><el-button style="margin: 20px 0 0 20px;" @click="addDetails" type="primary">添加详情</el-button></div>
                <div class="aviation">
                  <!--第一个-->
                  <div class="" style="width:100%;" v-for="(item, index) in particulars" :key="index">
                    <div class="type_radio" style=" width:100%;">
                      <ul class="details_ul">
                        <li v-for="(item,index) in details" :class="{active:index == num7}" @click="tabDetails(index)">
                          <span v-if="index=='0'">
                            <el-radio  label="0" v-model="details_radio" checked>{{item}}</el-radio>
                          </span>
                          <span v-if="index=='1'">
                            <el-radio label="1" v-model="details_radio">{{item}}</el-radio>
                          </span>
                          <span v-if="index=='2'">
                            <el-radio label="2" v-model="details_radio">{{item}}</el-radio>
                          </span>
                        </li>
                      </ul>
                      <div class="explain">
                        <div v-for="(itemCon,index) in schedule_details" v-show="index == num7">
                         <div v-if="index ==0" >
                           <div class="aviation" style="padding:20px 0 0 0;">
                             <div class="aviation_text">城市</div>
                             <div class="aviation_input"><el-input v-model="item.attractionsCity" placeholder="请输入内容"></el-input></div>
                             <div class="aviation_text">活动时间</div>
                             <div class="city_input"><el-input v-model="item.attractionsDate" placeholder=""></el-input></div>
                             <div class="minutes">分钟</div>
                           </div>
                           <div class="aviation" style="padding:20px 0 0 0;">
                             <div class="aviation_text">景点名称</div>
                             <div class="aviation_input"><el-input v-model="item.attractionsName" placeholder="请输入内容"></el-input></div>
                           </div>
                           <div class="aviation" style="padding-top:20px;">
                            <div class="aviation_text">详细说明</div>
                            <div class="textarea"><el-input class="text_input" type="textarea":rows="3" placeholder="请输入内容"v-model="item.attractionsExplain"></el-input></div>
                            </div>
                            <div class="dashed">&nbsp;</div>
                            <div class="aviation_first">
                              <div class="aviation_text">图片</div>
                              <div class="aviation_input" style="position: relative;">
                                <el-input v-model="item.attractionsPicture" placeholder="请输入内容"></el-input>
                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/":on-preview="handlePreview":on-remove="handleRemove":file-list="fileList2"list-type="picture">
                                  <el-button type="primary">上传</el-button>
                                </el-upload>
                              </div>
                            </div>
                            <div class="aviation" style="padding-top:20px;">
                              <div class="aviation_text">简介</div>
                              <div class="textarea"><el-input class="text_input" type="textarea":rows="3" placeholder="请输入内容"v-model="item.attractionsAbstract"></el-input></div>
                            </div>
                            <div class="stop"><el-button class="stop_button" plain>删除详情</el-button></div>
                         </div>
                         <div v-if="index ==1" >
                           <div class="aviation" style="padding:20px 0 0 0;">
                             <div class="aviation_text">名称</div>
                             <div class="aviation_input"><el-input v-model="item.shoppingName" placeholder="请输入内容"></el-input></div>
                             <div class="aviation_text">营业产品</div>
                             <div class="city_input"><el-input v-model="item.shoppingDate" placeholder=""></el-input></div>
                             <div class="minutes">分钟</div>
                           </div>
                           <div class="aviation" style="padding:20px 0 0 0;">
                             <div class="aviation_text">景点名称</div>
                             <div class="aviation_input"><el-input v-model="item.shoppingProduct" placeholder="请输入内容"></el-input></div>
                           </div>
                           <div class="aviation" style="padding-top:20px;">
                            <div class="aviation_text">详细说明</div>
                            <div class="textarea"><el-input class="text_input" type="textarea":rows="3" placeholder="请输入内容"v-model="item.shoppingExplain"></el-input></div>
                            </div>
                            <div class="dashed">&nbsp;</div>
                            <div class="aviation_first">
                              <div class="aviation_text">图片</div>
                              <div class="aviation_input" style="position: relative;">
                                <el-input v-model="item.shoppingProduct" placeholder="请输入内容"></el-input>
                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/":on-preview="handlePreview":on-remove="handleRemove":file-list="fileList2"list-type="picture">
                                  <el-button type="primary">上传</el-button>
                                </el-upload>
                              </div>
                            </div>
                            <div class="aviation" style="padding-top:20px;">
                              <div class="aviation_text">简介</div>
                              <div class="textarea"><el-input class="text_input" type="textarea":rows="3" placeholder="请输入内容"v-model="item.shoppingAbstract"></el-input></div>
                            </div>
                            <div class="stop"><el-button class="stop_button" plain>删除详情</el-button></div>
                         </div>
                         <div v-if="index ==2" >
                           <div class="aviation" style="padding:20px 0 0 0;">
                             <div class="aviation_text">名称</div>
                             <div class="aviation_input"><el-input v-model="item.chargeableName" placeholder="请输入内容"></el-input></div>
                             <div class="aviation_text">活动时间</div>
                             <div class="city_input"><el-input v-model="item.chargeableDate" placeholder=""></el-input></div>
                             <div class="minutes">分钟</div>
                           </div>
                           <div class="aviation" style="padding:20px 0 0 0;">
                             <div class="aviation_text">参考价格</div>
                             <div class="aviation_input"><el-input v-model="item.chargeableProduct" placeholder="请输入内容"></el-input></div>
                             <div class="minutes">元/人</div>
                           </div>
                           <div class="aviation" style="padding-top:20px;">
                            <div class="aviation_text">详细说明</div>
                            <div class="textarea"><el-input class="text_input" type="textarea":rows="3" placeholder="请输入内容"v-model="item.chargeableExplain"></el-input></div>
                            </div>
                            <div class="dashed">&nbsp;</div>
                            <div class="aviation_first">
                              <div class="aviation_text">图片</div>
                              <div class="aviation_input" style="position: relative;">
                                <el-input v-model="item.chargeablePicture" placeholder="请输入内容"></el-input>
                                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/":on-preview="handlePreview":on-remove="handleRemove":file-list="fileList2"list-type="picture">
                                  <el-button type="primary">上传</el-button>
                                </el-upload>
                              </div>
                            </div>
                            <div class="aviation" style="padding-top:20px;">
                              <div class="aviation_text">简介</div>
                              <div class="textarea"><el-input class="text_input" type="textarea":rows="3" placeholder="请输入内容"v-model="item.chargeableAbstract"></el-input></div>
                            </div>
                            <div class="stop"><el-button class="stop_button" plain>删除详情</el-button></div>
                         </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--DAY切换-->
                <div class="DAY">
                  <div class="DAY_one">DAY1</div>
                  <div class="DAY_two">DAY2</div>
                  <div class="DAY_two">DAY3</div>
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

</template>

<script>
  import { VueEditor } from 'vue2-editor'
  export default {
    name: "otherInfo",
      components: {
        VueEditor
      },
    data() {
      return {
        //简要说明
        content: '<h1>Some initial content</h1>',
        content1: '<h1>Some initial content111</h1>',
        //切换主题
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
        //限制字数
        number: '0/10',
        items: {
           text:''
        },
        //去程交通工具切换
        goRoad: [{
          value: '1',
          label: '飞机'
        },{
          value:'2',
          label:'火车',
        },{
          value:'3',
          label:'汽车',
        },{
          value:'4',
          label:'轮船',
        }],
        //去程天数
        goDate: [{
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
        //返程交通工具切换
        returnRoad: [{
          value: '1',
          label: '飞机'
        },{
          value:'2',
          label:'火车',
        },{
          value:'3',
          label:'汽车',
        },{
          value:'4',
          label:'轮船',
        }],
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
        scheduleDetails:'',
        //
        ruleForm:{
          hotelAuto:'',
          hotelChinese:'',
          hotelEnglish:'',
          hotelAddress:'',
          hotelStar:'',
          hotelDay:'',
          hotelHouse:'',
          hotelBed:'',
          planeAuto:'',
          planeCompany:'',
          planeNumber:'',
          planeCity:'',
          planeAirport:'',
          planeDepart:'',
          planeArrive:'',
          planeReach:'',
          planeDate:'',
          planeDay:'',
          planeVehicle:'1',
          planeDAys:'',
          attractionsCity:'',
          attractionsDate:'',
          attractionsName:'',
          attractionsExplain:'',
          attractionsPicture:'',
          attractionsAbstract:'',
          shoppingName:'',
          shoppingDate:'',
          shoppingProduct:'',
          shoppingExplain:'',
          shoppingPicture:'',
          shoppingAbstract:'',
          chargeableName:'',
          chargeableDate:'',
          chargeableProduct:'',
          chargeableExplain:'',
          chargeablePicture:'',
          chargeableAbstract:'',
          attractions:'',
          shopping:'',
          chargeable:'',
          highlightWords: '',
          theme:'',
        },
        rules:{
          highlightWords:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 0, max: 10, message: '字数超过10汉字限制', trigger: 'blur' },
          ],
          hotelAuto:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          hotelChinese:[
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          hotelEnglish:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelAddress:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelStar:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelDay:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelHouse:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          hotelBed:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeAuto:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeCompany:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeNumber:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeCity:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeAirport:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeDepart:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeArrive:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeReach:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeDate:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeDay:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeVehicle:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          planeDAys:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          attractionsCity:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          attractionsDate:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          attractionsName:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          attractionsExplain:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          attractionsPicture:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          attractionsAbstract:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          shoppingName:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          shoppingDate:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          shoppingProduct:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          shoppingExplain:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          shoppingPicture:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          shoppingAbstract:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          chargeableName:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          chargeableDate:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          chargeableProduct:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          chargeableExplain:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          chargeablePicture:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          chargeableAbstract:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          attractions:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          shopping:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          chargeable:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
          theme:[
            { required: true, message: '不能为空', trigger: 'blur'}
          ],
        },
        //上传图片
        fileList2:[],
        //radio选择器
        radio: '1',
        radio1:'1',
        radio2:'1',
        radio3:'1',
        radio4:'1',
        //日程详情住宿选择
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
        editableTabsValue3: '2',
        editableTabs3: [{
          content: ''
        }],
        //行程信息切换
         describe: ["详细说明", "简要说明"],
         pattern: ["",""],
         num5: 0,
         matter_radio:'0',
         form: [],
         form1: [],
         lineshow:false,
         Stopline:false,
         transit:['1'],
         deleteTransit:false,//删除中转按钮
         //出发地
         place: [{
            value: '选项1',
            label: '1'
          }, {
            value: '选项2',
            label: '2'
          }, {
            value: '选项3',
            label: '3'
          }],
          origin:'',
          //目的地
          destination: [{
            value: '选项1',
            label: '4'
          }, {
            value: '选项2',
            label: '5'
          }, {
            value: '选项3',
            label: '6'
          }],
          bourn:'',
          information:['1'],//添加酒店
          hotelshow:false,//酒店弹窗
          hotel:[{
            hotelAuto:'',
            hotelChinese:'',
            hotelEnglish:'',
            hotelAddress:'',
            hotelStar:'',
            hotelDay:'',
            hotelHouse:'',
            hotelBed:''
          }],
          //交通工具
          //去程
          plane:[
            {
            planeAuto:'',
            planeCompany:'',
            planeNumber:'',
            planeCity:'',
            planeAirport:'',
            planeDepart:'',
            planeArrive:'',
            planeReach:'',
            planeDate:'',
            planeDay:'',
            planeVehicle:'1',
            planeDAys:'',
            stop:[]
          }],
          //返程
          nackPlane:[{
            planeAuto:'',
            planeCompany:'',
            planeNumber:'',
            planeCity:'',
            planeAirport:'',
            planeDepart:'',
            planeArrive:'',
            planeReach:'',
            planeDate:'',
            planeDay:'',
            planeVehicle:'1',
            planeDAys:'',
            stop:[]
          }],
          teturnBack:[],
          Returnline:false,
          //日程信息酒店切换
          schedule: ["酒店", "其他"],
          num6:0,
          schedule_hotel: ["",""],
          schedule_radio:'0',
          //信息详情切换
          details:["景点","购物","自费项目"],
          num7:0,
          details_radio:'0',
          schedule_details:["","",""],
          //添加详情
          particulars:[
            /*{days:1,[{zhjuti:'',zhushu:'',[
            {jingdian:'1',jingdia22:'2',}
            ]
          },{days:2,[{zhjuti:'',zhushu:'',[
            {jingdian:'1',jingdia22:'2',}
            ]
          }]}*/


          {
            attractionsCity:'',
            attractionsDate:'',
            attractionsName:'',
            attractionsExplain:'',
            attractionsPicture:'',
            attractionsAbstract:'',
            shoppingName:'',
            shoppingDate:'',
            shoppingProduct:'',
            shoppingExplain:'',
            shoppingPicture:'',
            shoppingAbstract:'',
            chargeableName:'',
            chargeableDate:'',
            chargeableProduct:'',
            chargeableExplain:'',
            chargeablePicture:'',
            chargeableAbstract:'',
            attractions:'',
            shopping:'',
            chargeable:''
          }],

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
      //去程添加经停、删除经停
      stopping(index) {
         {this.plane[index].stop.push ({ stopCity:'',
            stopDate:''
             })
         }
      },

      deleteItem(p,index) {
        this.plane[index].stop.splice(p, 1)
      },

      deletePanel(index) {
        this.plane.splice(index, 1)
      },

      //返程添加经停、删除经停
      reDeleteItem(p,index) {
       this.nackPlane[index].stop.splice(p, 1)
      },

      reDeletePanel(index) {
         this.plane.splice(index, 1)
      },

      reStopping(index) {
       {this.nackPlane[index].stop.push ({ stopCity:'',
        stopDate:''
         })
       }
      },
      //交通信息添加中转
      addTransit(index) {
        this.plane.push({
            planeAuto:'',
            planeCompany:'',
            planeNumber:'',
            planeCity:'',
            planeAirport:'',
            planeDepart:'',
            planeArrive:'',
            planeReach:'',
            planeDate:'',
            planeDay:'',
            planeVehicle:'1',
            planeDAys:'',
            stop:[]
        })
      },

     addRTransit(index) {
        this.nackPlane.push({
            planeAuto:'',
            planeCompany:'',
            planeNumber:'',
            planeCity:'',
            planeAirport:'',
            planeDepart:'',
            planeArrive:'',
            planeReach:'',
            planeDate:'',
            planeDay:'',
            planeVehicle:'1',
            planeDAys:'',
            stop:[]
        })
      },



      //添加、删除酒店
      addHotel() {
        console.log('addHotel')
        this.hotel.push({
            hotelAuto:'',
            hotelChinese:'',
            hotelEnglish:'',
            hotelAddress:'',
            hotelStar:'',
            hotelDay:'',
            hotelHouse:'',
            hotelBed:'',
            hotelAbstract:'',
            hotelPicture:''
          })
      },
      deleteHotel(index) {
        this.hotelshow=true;
      },
      shutHotel(index){
        this.hotel.splice(index, 1)
        console.log(index)
        this.hotelshow=false;
      },
      //酒店关闭取消按钮
      cloceHotel(){
        this.hotelshow=false;
      },
      //日程信息酒店切换
      tabHotel(index){
        this.num6 = index;
      },
      //信息详情切换
      tabDetails(index){
        this.num7 = index;
      },

      //自动填充数据
      loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" }
        ];
      },
      //添加、删除详情
      addDetails() {
        console.log('addDetails')
        this.particulars.push(
            {
            attractionsCity:'',
            attractionsDate:'',
            attractionsName:'',
            attractionsExplain:'',
            attractionsPicture:'',
            attractionsAbstract:'',
            shoppingName:'',
            shoppingDate:'',
            shoppingProduct:'',
            shoppingExplain:'',
            shoppingPicture:'',
            shoppingAbstract:'',
            chargeableName:'',
            chargeableDate:'',
            chargeableProduct:'',
            chargeableExplain:'',
            chargeablePicture:'',
            chargeableAbstract:'',
            attractions:'',
            shopping:'',
            chargeable:''
          }
          )
      },
      deleteDetails(index) {
        this.particulars.splice(index, 1)
        console.log(index)
      },
       //保存
  
      addsave(ruleForm) {

        // console.log(this.ruleForm)
        // this.$refs[ruleForm].validate((valid) => {
  
        //   if (valid) {
        //    console.log(this.$refs[ruleForm])
        //     this.$message.success("保存成功");
  
        //   //  location.reload();
           
  
        //   } else {
  
        //     return false;
  
        //   }
  
        // });
  
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
      //主题标题添加删除
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
      handleSelect(item) {
        console.log(item);
      },
       handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
       tab(index) {
        this.num5 = index;
      }
    },
    mounted() {
      this.restaurants = this.loadAll();
      //console.log(this.plane);
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
  .traffic{margin: 20px 0 0 30px; text-align: left; clear: both;}
  .traffic_title{font-size: 14pt; font-weight: bold; line-height: 60px;}
  .traffic_border{ border:1px solid #f2f2f2; width: 80%; overflow: hidden; margin: 0 0 20px 0; clear: both;}
  .traffic_button{float: left; margin: 10px 0 20px 30px; line-height: 40px; font-size: 20px;}
  .plane{width: 98%; overflow: hidden;background-color: #fafafa; margin-left:1%; margin-bottom:20px; margin-top:20px;}
  .plane_type{ width: 80px; margin: 20px 0 0 20px;}
  .plane_text{ margin: 0 0 0 15px; }
  .aviation{padding: 0 0 0 0; clear: both; width: 100%;}
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

  .date{padding: 20px 0 0 30px; font-size: 18px; font-weight: bold; clear: both;}
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
  .textarea1{float: left; width: 100%;}
  .dashed{border-bottom: 1px dashed #e5e5e5; overflow:hidden; height: 1px; width: 98%; margin-right: auto; margin-left: auto; margin-bottom:20px;}


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
  .transit_border{border: 1px dashed #e5e5e5; width: 98%;margin-left:1%; overflow: hidden;}
  .delete{float: left; line-height: 40px; margin: 0 0 0 40px; color:#2e96f9;cursor:pointer;}
  .addTab{padding: 0 0 20px 20px; float: left;}

  .describe_way{float: left;}
  .description{ overflow: hidden; float: left;}
  .description li{list-style: none; float: left; margin: 0 0 20px 15px; text-align: left;}
  .cost_bg{ margin: 12px; }

  .setmeal{float: left;}
  .depart{float: left; width: 140px;}
  .setout{float: left; line-height: 40px;margin: 0 10px 0 30px;}
  .setout span{ color:red; margin: 0 5px 0 0; }

  /*日程信息*/
  .type_radio li{list-style: none; float: left; margin: 0 30px 0 0;}
  .details_ul{margin: 0 0 0 60px;}
  .explain{ clear: both; padding: 15px 0 0 0; width: 100%; }
  .details_border{ border:1px solid #f2f2f2; width: 80%; margin: 0 0 20px 0; clear: both; position: relative;}
  .DAY{ width: 40px; line-height: 40px; text-align: center;width: 100px; position: absolute; top: 55px; right: -120px; z-index: 10000 }
  .DAY_one{background-color: #c2c2c2; border-bottom:1px solid #fff; }
  .DAY_two{background-color: #f7f7f7; border-bottom:1px solid #fff;}
      
</style>