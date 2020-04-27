<template>
  <div>
    <el-dialog
      title="下单"
      :visible.sync="dialogFormOrder"
      custom-class="city_list dialogOrder"
      style="margin-top:-100px"
      width="1200px"
      @close="cancelInfoOrder('ruleForm')"
    >
      <div class="dialog-footer">
        <el-button class="ml13" @click="cancelInfoOrder('ruleForm')">取 消</el-button>
        <!-- <el-button class="ml13" @click="submitForm('ruleForm',1)"  type="primary">预订不占</el-button> -->
        <el-button class="ml13" type="primary">预订不占</el-button>
        <el-button type="primary" @click="submitForm('ruleForm',3)" class="ml13">确定占位</el-button>
      </div>
      <div class="main1">
        <div class="planBorder">
          <div class="order-title">
            <span>团期信息</span>
          </div>
          <div class="pro-info">
            <table width="100%">
              <tr>
                <td width="33%">
                  <div width="80" class="fl">团期计划:</div>
                  <div class="fl ml13">{{teampreviewData.groupCode}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl">出发地:</div>
                  <div class="fl ml13">{{teampreviewData.pod}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl">目的地:</div>
                  <div class="fl ml13">{{teampreviewData.destination}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl">产品名称:</div>
                  <div class="fl ml13">{{teampreviewData.title}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl">套餐:</div>
                  <div class="fl ml13">{{teampreviewData.package}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl">出发日期:</div>
                  <div class="fl ml13">{{teampreviewData.date}}</div>
                </td>
              </tr>
              <tr>
                <td width="33%">
                  <div width="80" class="fl">余位:</div>
                  <div class="fl ml13">{{teampreviewData.remaining}}</div>
                </td>
                <!-- <td width="33%">
                  <div width="80" class="fl">参考结算:</div>
                  <div class="fl ml13">{{average | numFilter}}</div>
                </td>-->
                <td width="33%">
                  <div width="80" class="fl">订单预留时长:</div>
                  <div class="fl ml13">{{teampreviewData.dateHous}}小时</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="订单来源" prop="orderRadio">
            <div @change="changeTab()">
              <el-radio label="1" class="radiomar" v-model="ruleForm.orderRadio">线下直客</el-radio>
              <el-radio label="2" class="radiomar" v-model="ruleForm.orderRadio">商户(同业、门店)</el-radio>
            </div>
          </el-form-item>
          <div v-if="ruleForm.orderRadio==1">
            <el-form-item label="销售" prop="market">
              <el-autocomplete
                class="optionw"
                @blur="travelGuest()"
                v-model="ruleForm.market"
                :fetch-suggestions="querySearch1"
                placeholder="请输入销售名称"
                :trigger-on-focus="false"
                @select="departure1"
              ></el-autocomplete>
              <div v-show="nullShowGuest" style="color:red">请输入有效的直客销售</div>
            </el-form-item>
          </div>
          <div v-if="ruleForm.orderRadio==2">
            <el-form-item label="商户名称" prop="travel">
              <el-autocomplete
                class="optionw"
                v-model="ruleForm.travel"
                @blur="travelName()"
                :fetch-suggestions="querySearch3"
                placeholder="请输入商户名称"
                :trigger-on-focus="false"
                popper-class="select-option"
                @select="departure"
              ></el-autocomplete>
              <div v-show="nullShowName" style="color:red;">请输入有效的商户名称</div>
            </el-form-item>
            <el-form-item label="同业销售" prop="travelSales">
              <el-autocomplete
                class="optionw"
                :disabled="forbidden"
                v-model="ruleForm.travelSales"
                @blur="travelOp()"
                :fetch-suggestions="querySearch2"
                placeholder="请输入销售名称"
                :trigger-on-focus="true"
                @select="departure2"
              ></el-autocomplete>
              <div v-show="nullShowOp" style="color:red;">请输入有效的同业销售</div>
            </el-form-item>
            <el-form-item label="商户销售" prop="merchantsSell">
              <el-autocomplete
                class="optionw"
                :disabled="forbidden"
                @blur="merchants()"
                v-model="ruleForm.merchantsSell"
                :fetch-suggestions="querySearch4"
                placeholder="请输入商户销售"
                :trigger-on-focus="true"
                @select="departure4"
              ></el-autocomplete>
              <div v-if="nullShow" style="color:red;">请输入有效的商户销售</div>
            </el-form-item>
          </div>
          <el-form-item label="价格选择" prop="price" class="cb price">
            <!-- <el-radio-group v-model="ruleForm.price" class="salesPrice"> -->
            <!-- <span v-for="(item,index) in salePrice" :key="index" style="margin:14px 18px 0 13px">{{item.enrollName}}：￥{{item.price_01}}</span>
            <br />-->
            <el-radio label="1" v-model="ruleForm.price" class="radiomar">
              直客价格：
              <span v-for="(item,index) in salePrice" :key="index">{{item.enrollName}}（￥{{item.price_01}}）</span>
            </el-radio>
            <el-radio label="2" v-model="ruleForm.price" class="radiomar">
              商户价格(同业、门店)：
              <span v-for="(item,index) in salePrice" :key="index">{{item.enrollName}}（￥{{item.price_02}}）</span>
            </el-radio>
            <!-- <el-radio label="自定义" class="radiomar">自定义：
                   成人<el-form-item prop="price1" class="disib"><el-input v-model="ruleForm.price1" class="pricew"></el-input></el-form-item>
                   儿童<el-form-item prop="price2" class="disib"><el-input v-model="ruleForm.price2" class="pricew"></el-input></el-form-item>
                   老人<el-form-item prop="price3" class="disib"><el-input v-model="ruleForm.price3" class="pricew"></el-input></el-form-item>
                   单房差<el-form-item prop="price4" class="disib"><el-input v-model="ruleForm.price4" class="pricew"></el-input></el-form-item>
            </el-radio>-->
            <!-- </el-radio-group> -->
          </el-form-item>
          <el-form-item label="报名人数" class="fl">
            <div class="num-req">*</div>
          </el-form-item>
          <div class="fl">
            <div class="registration" v-for="(item,index) in salePrice" :key="index">
              {{item.enrollName}}￥
              <span
                v-show="ruleForm.price==1"
              >{{item.price_01}}*{{enrolNum[index]}}</span>
              <span v-show="ruleForm.price==2">{{item.price_02}}*{{enrolNum[index]}}</span>
              <div>
                <el-input-number
                  class="input-num"
                  v-model="enrolNum[index]"
                  @change="peoNum(index,item.enrollID,item.enrollName,item.price_01,item.price_02,enrolNum[index])"
                  :min="0"
                  :max="salePriceNum[index].quota"
                  size="medium"
                ></el-input-number>
              </div>
              <!-- <div v-bind:class="{red:quota[index]}">
                余位{{item.quota}}
                <span v-show="quota[index]">库存不足</span>
              </div>-->
            </div>
            <div class="red ml13" style="margin:0 0 10px 15px;" v-show="enrolNums">{{enrolNumsWarn}}</div>
          </div>
          <!--
            <el-form-item label="" prop="">
              <div class="ml13">单房差 ￥340</div>
            </el-form-item>
          -->
          <el-form-item label="其他费用" prop="otherCost" class="fl cb">
            <el-input v-model="ruleForm.otherCost" class="numw" type="number" :min="0"></el-input>
          </el-form-item>
          <div class="fl">
            <el-input v-model="ruleForm.otherCostRemark" class="cost-remark"></el-input>
          </div>
          <!-- <el-form-item label="整体优惠" prop="allDiscount" class="cb fl">
            <el-input v-model="ruleForm.allDiscount" class="numw" type="number" :min="0"></el-input>
          </el-form-item> -->
          <!-- <div class="fl">
            备注
            <el-input v-model="ruleForm.allDisRemark" class="cost-remark"></el-input>
          </div>-->
          <el-form-item label="总价" prop="totalPrice" class="cb">
            <div class="ml13">{{ruleForm.totalPrice}}</div>
            <div
              v-if="ruleForm.orderRadio == 2 && payment == 1"
              style="clear: both; margin:0 0 0 10px;"
            >剩余预存款和额度:￥{{amount}}</div>
            <div
              v-if="ruleForm.orderRadio == 2 && payment == 2 && deposit !==0 "
              style="clear: both; margin:0 0 0 10px;"
            >剩余预存款:￥{{deposit}}</div>
          </el-form-item>
          <!-- <el-form-item label="下单方式" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="1" class="radiomar">确认占位</el-radio>
              <br />
              <el-radio label="2" class="radiomar">预定占位 （订单保留24小时，到期提醒）</el-radio>
              <br />
              <el-radio label="3" class="radiomar">预定不占 （订单保留24小时，到期提醒）</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="ruleForm.contactName" class="numw" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="contactPhone">
            <el-input v-model="ruleForm.contactPhone" class="numw" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop>
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              class="remark"
              placeholder="请输入内容"
              v-model="ruleForm.remark"
            ></el-input>
          </el-form-item>
          <div class="travelMessage">出行人信息</div>
          <table
            class="costList"
            v-for="(item,indexPrice) in salePrice"
            :key="indexPrice"
            border="1"
            cellpadding="0"
            cellspacing="0"
          >
            <tr class="costList_01">
              <td width="120">姓名</td>
              <td width="100">报名类型</td>
              <td width="120">电话</td>
              <td width="180">身份证</td>
              <td width="80">性别</td>
              <td width="100">操作</td>
            </tr>
            <tr v-for="(item,index) in tour[indexPrice]" :key="index">
              <td>{{item.cnName}}</td>
              <td>{{item.enrollName}}</td>
              <td>{{item.mobile}}</td>
              <td>{{item.idCard}}</td>
              <td>
                <div v-if="item.sex=='0'">男</div>
                <div v-if="item.sex=='1'">女</div>
              </td>
              <td class="tc">
                <span
                  class="fl blue cursor"
                  style="margin:0 0 0 18px"
                  @click="fillTour(indexPrice,index)"
                >编辑</span>
                <span class="fl" style="margin:0 8px 0 8px;">|</span>
                <span class="fl blue cursor" @click="delTravel(index,indexPrice,item.enrollName)">删除</span>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      :title="'出行人信息（'+winTitle+'）'"
      :visible.sync="dialogFormTour"
      class="city_list"
      @close="cancelInfo('conForm')"
      width="700px"
    >
      <el-form :model="conForm" :rules="rules" ref="conForm" style="height:300px;">
        <el-form-item label="中文姓名" prop="cnName" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.cnName" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="英文姓名" prop="enName" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.enName" class="w200"></el-input>
        </el-form-item>
        <div style="clear:both;"></div>
        <el-form-item label="性别" prop="sex" label-width="110px" class="fl" style="width:310px;">
          <el-radio-group v-model="conForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.mobile" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idCard" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.idCard" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="bornDate" label-width="110px" class="fl">
          <el-date-picker
            v-model="conForm.bornDate"
            type="date"
            placeholder="选择日期"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="证件类型" prop="credType" label-width="110px" class="fl">
          <el-select v-model="conForm.credType" placeholder="请选择" style="width:200px;">
            <el-option label="请选择" :value="0" />
            <el-option label="护照" :value="1" />
            <el-option label="港澳通行证" :value="2" />
            <el-option label="军官证" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="credCode" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.credCode" class="w200"></el-input>
        </el-form-item>
        <!-- <el-form-item label="证件有效期" prop="credTOV" label-width="110px" class="fl cb">
          <el-date-picker v-model="conForm.credTOV" type="date" placeholder="选择日期" style="width:200px"></el-date-picker>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer cb">
        <el-button @click="cancelInfo('conForm')">取 消</el-button>
        <!-- <el-button type="primary" @click="subInfo('conForm')">确 定</el-button> -->
        <el-button type="primary" @click="subInfo('conForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="orderSuc" width="500px">
      <h3 class="ordersuc-title">下单成功</h3>
      <div class="text item">订单号：{{orderCode}}</div>
      <div class="text item">产品名称：{{teampreviewData.title}}</div>
      <div class="text item">团期计划：{{teampreviewData.groupCode}}</div>
      <el-button type="primary" style="margin:20px 0 10px 200px" @click="orderSuc = false">关闭</el-button>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="detailsDialog"
      custom-class="city_list dialogOrder"
      style="margin-top:-100px"
      width="1200px"
      @close="detailsCancel('ruleForm')"
    >
      <div class="detail">
        <el-button @click="detailsCancel('ruleForm')" class="ml13">取 消</el-button>
      </div>
      <div class="detailsTitle">基本信息</div>
      <div>
        <!-- <div class="checkType" style="background: #ffa200">报账中</div> -->
        <div class="checkType" v-if="teampreviewData.isCheckSheet=='0'" style="background: #ffa200" >未提交报账</div>
        <div class="checkType" v-if="teampreviewData.isCheckSheet=='1'" style="background: #007500">已提交报账</div>
      </div>
      <div class="pro-info">
        <table width="100%">
          <tr>
            <td width="33%">
              <div width="80" class="fl">团期计划:</div>
              <div class="fl ml13">{{teampreviewData.groupCode}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">操作人:</div>
              <div class="fl ml13">{{teampreviewData.op}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">出发日期:</div>
              <div class="fl ml13">{{teampreviewData.date}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="fl">产品名称:</div>
              <div class="fl ml13">{{teampreviewData.title}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">套餐:</div>
              <div class="fl ml13">{{teampreviewData.package}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">出发地:</div>
              <div class="fl ml13">{{teampreviewData.pod}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="fl">目的地:</div>
              <div class="fl ml13">{{teampreviewData.destination}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">状态:</div>
              <!-- <div class="fl ml13">{{teampreviewData.regimentType}}</div> -->
              <div class="fl ml13">
                <div v-if="teampreviewData.regimentType=='1'">正常</div>
                <div v-if="teampreviewData.regimentType=='2'">停售</div>
                <div v-if="teampreviewData.regimentType=='3'">封团</div>
                <div v-if="teampreviewData.regimentType=='4'">暂满</div>
                <div v-if="teampreviewData.regimentType=='5'">满员</div>
              </div>
            </td>
            <td width="33%">
              <div width="80" class="fl">关联订单:</div>
              <div class="fl ml13">{{teampreviewData.ordNum}}个</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="fl">计划位:</div>
              <div class="fl ml13">{{teampreviewData.count}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">余位:</div>
              <div class="fl ml13">{{teampreviewData.remaining}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">成本:</div>
              <div class="fl ml13">{{teampreviewData.cost}}</div>
            </td>
          </tr>
          <tr>
            <td width="33%">
              <div width="80" class="fl">收入:</div>
              <div class="fl ml13">{{teampreviewData.income}}</div>
            </td>
            <td width="33%">
              <div width="80" class="fl">毛利率:</div>
              <div class="fl ml13">{{rate | numFilter}}%</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="detailsTitle">财务信息</div>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="借款" name="first">
            <el-table :data="tableBorrowing" ref="multipleTable" class="table" border>
              <el-table-column prop="paymentID" label="ID" min-width="80" align="center"></el-table-column>
              <el-table-column prop="paymentType" label="借款类型" min-width="120" align="center"></el-table-column>
              <el-table-column prop="checkType" label="审批状态" align="center">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.checkType=='审批中'"
                    style="color: #7F7F7F"
                  >{{scope.row.checkType}}</div>
                  <div
                    v-if="scope.row.checkType=='驳回'"
                    style="color: #FF4A3D"
                  >{{scope.row.checkType}}</div>
                  <div
                    v-if="scope.row.checkType=='通过'"
                    style="color: #33D174"
                  >{{scope.row.checkType}}</div>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="supplierType" label="借款类型" min-width="80" align="center"></el-table-column> -->
              <el-table-column prop="supplierName" label="供应商" min-width="80" align="center"></el-table-column>
              <el-table-column prop="price" label="金额" min-width="120" align="center"></el-table-column>
              <el-table-column prop="expensePrice" label="已报销金额" min-width="120" align="center"></el-table-column>
              <el-table-column prop="createUser" label="申请人" min-width="70" align="center"></el-table-column>
              <el-table-column label="审批过程" min-width="70" align="center">
                <template slot-scope="scope">
                  <span class="cursor blue" @click="approval(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="报销" name="second">
            <el-table
              :data="tableAccount"
              style="margin:0 1px 0 1px"
              :header-cell-style="getCostClass"
              border
            >
              <el-table-column prop="id" label="报销单号" min-width="120" align="center"></el-table-column>
              <el-table-column prop="checkType" label="状态" min-width="120" align="center">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.checkType=='审批中'"
                    style="color: #7F7F7F"
                  >{{scope.row.checkType}}</div>
                  <div
                    v-if="scope.row.checkType=='驳回'"
                    style="color: #FF4A3D"
                  >{{scope.row.checkType}}</div>
                  <div
                    v-if="scope.row.checkType=='通过'"
                    style="color: #33D174"
                  >{{scope.row.checkType}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="发起时间"
                :formatter="dateFormat1"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column prop="price" label="该团期的报销金额" min-width="150" align="center"></el-table-column>
              <el-table-column prop="createUser" label="申请人" min-width="80" align="center"></el-table-column>
              <el-table-column label="审批过程" min-width="70" align="center">
                <template slot-scope="scope">
                  <span class="cursor blue" @click="expense(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="收款" name="third">
            <el-table :data="tableCollection" :header-cell-style="getCostClass" border>
              <el-table-column prop="id" label="收款单号" min-width="120" align="center"></el-table-column>
              <el-table-column prop="collectionType" label="收款类型" min-width="120" align="center"></el-table-column>
              <el-table-column prop="localCompName" label="同业社名称" min-width="100" align="center"></el-table-column>
              <el-table-column prop="checkType" label="状态" min-width="80" align="center">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.checkType=='审批中'"
                    style="color: #7F7F7F"
                  >{{scope.row.checkType}}</div>
                  <div
                    v-if="scope.row.checkType=='驳回'"
                    style="color: #FF4A3D"
                  >{{scope.row.checkType}}</div>
                  <div
                    v-if="scope.row.checkType=='通过'"
                    style="color: #33D174"
                  >{{scope.row.checkType}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="collectionTime"
                :formatter="dateFormat"
                label="收款时间"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column prop="groupCode" label="团期计划" min-width="150" align="center">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.arrears" :key="index">
                    {{item.groupCode}}
                    <i v-if="index != scope.row.arrears.length-1">，</i>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="orderCode" label="订单号" min-width="120" align="center">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.arrears" :key="index">
                    {{item.orderCode}}
                    <i v-if="index != scope.row.arrears.length-1">，</i>
                  </span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="orderNumber" label="订单号" min-width="120" align="center"></el-table-column> -->
              <el-table-column prop="price" label="收款金额" min-width="80" align="center"></el-table-column>
              <el-table-column prop="createUser" label="申请人" min-width="80" align="center"></el-table-column>
              <el-table-column label="审批过程" min-width="80" align="center">
                <template slot-scope="scope">
                  <span class="cursor blue" @click="collection(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="订单" name="fourth">
            <el-table :data="tableOrder" :header-cell-style="getCostClass" border>
              <el-table-column prop="orderCode" label="订单ID" min-width="120" align="center"></el-table-column>
              <el-table-column prop="contactName" label="联系人" min-width="120" align="center"></el-table-column>
              <el-table-column prop="number" label="数量" min-width="180" align="center"></el-table-column>
              <el-table-column prop="orderChannels" label="订单来源" min-width="100" align="center"></el-table-column>
              <el-table-column prop="orderStatus" label="状态" min-width="80" align="center"></el-table-column>
              <el-table-column prop="saler" label="销售" min-width="80" align="center"></el-table-column>
              <el-table-column prop="payable" label="订单金额" min-width="120" align="center"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <el-dialog title="审批过程" :visible.sync="approvalShow" width="800px" @close="closeApprova()">
      <el-table :data="approvalTable" :header-cell-style="getCostClass" border>
        <el-table-column prop="finishedTime" label="审批时间" min-width="180" align="center">
          <template slot-scope="scope">
            <div
              v-if="scope.row.approvalName !=='等待中'"
              style="color: #7F7F7F"
            >{{scope.row.finishedTime | formatDate01}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="participantName" label="审批人" min-width="120" align="center"></el-table-column>
        <el-table-column prop="approvalName" label="审批结果" min-width="120" align="center"></el-table-column>
        <el-table-column prop="No" label="审批意见" min-width="180" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="审批过程" :visible.sync="collectionShow" width="800px" @close="closeCollection()">
      <el-table :data="collectionTable" :header-cell-style="getCostClass" border>
        <el-table-column prop="createTime" label="审批时间" min-width="180" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="spName" label="审批人" min-width="120" align="center"></el-table-column>
        <el-table-column prop="spState" label="审批结果" min-width="120" align="center"></el-table-column>
        <el-table-column prop="spContent" label="审批意见" min-width="180" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="报账单"
      :visible.sync="checkSheetDialog"
      custom-class="city_list dialogOrder"
      style="margin-top:-100px"
      width="1200px"
      @close="closeCheckSheet()"
    >
      <div class="w1000 mau">
        <div class="chesktltle">黑龙江大运嘉国际旅行社有限公司旅游团队报账单</div>
        <div class="fr lh30">报账日期：2019年03月19日</div>
        <table class="checksheet-table" border="1" cellspacing="0">
          <tr>
            <td class="w80 bc_cc">部门</td>
            <td class="w100">1</td>
            <td class="w80 bc_cc">操作人</td>
            <td class="w100">2</td>
            <td class="w80 bc_cc">导陪</td>
            <td class="w100">3</td>
            <td class="w80 bc_cc">地接社</td>
            <td class="w320">4</td>
          </tr>
          <tr>
            <td class="w80 bc_cc">团号</td>
            <td colspan="3">1</td>
            <td class="w80 bc_cc">产品名称</td>
            <td colspan="3">2</td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/js/libs/publicMethod.js";
import moment from "moment";
export default {
  props: {
    planId: 0,
    variable: 0,
    dialogType: 0
  },
  data() {
    return {
      tableData2: [],
      tableData3: [],
      average: 0,
      dialogFormOrder: false,
      ruleForm: {
        orderRadio: "1",
        sale: "",
        travel: "",
        market: "", 
        travelSales: "", 
        merchantsSell: "", 
        price: "1",
        price1: "",
        price2: "",
        price3: "",
        price4: "",
        otherCost: 0,
        otherCostRemark: "",
        allDiscount: 0,
        allDisRemark: "",
        totalPrice: 0,
        type: "1",
        contactName: "",
        contactPhone: "",
        remark: ""
      },
      quota: [], 
      enrolNum: [], 
      enrolNums: false, 
      enrolNumsWarn: "",
      dialogFormTour: false,
      salePrice: [], 
      salePriceNum: [], 
      tourType: 0, 
      fillIndex: 0, 
      preLength: [], 
      tour: [], 
      winTitle: "", 
      conForm: {
        id: 0,
        isDeleted: 0,
        code: "",
        cnName: "",
        enName: "",
        sex: "",
        mobile: "",
        idCard: "", 
        bornDate: 0,
        credType: 0,
        credCode: "",
        //credTOV: "",
        orderID: 0,
        orderCode: "string",
        orgID: sessionStorage.getItem("id"),
        userID: sessionStorage.getItem("id")
      },
      orderSuc: false,
      teampreviewData: {},
      orderCode: "",
      ifOrderInsert: true,
      rules: {
        orderRadio: [
          { required: true, message: "请选择订单来源", trigger: "change" }
        ],
        sale: [{ required: true, message: "请选择销售", trigger: "change" }],
        travel: [
          { required: true, message: "请输入商户名称", trigger: "blur" }
        ],
        merchantsSell: [
          { required: true, message: "请输入商户销售", trigger: "blur" },
          { required: true, message: "请输入商户销售", trigger: "change" }
        ],
        // market: [
        //   { required: true, message: "请输入销售", trigger: "blur" }
        // ],
        travelSales: [
          { required: true, message: "请输入销售", trigger: "blur" },
          { required: true, message: "请输入销售", trigger: "change" }
        ],
        price: [{ required: true, message: "请选择价格", trigger: "change" }],
        price1: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        price2: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        price3: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        price4: [{ pattern: /^[+]{0,1}(\d+)$/, message: "价格必须为数字值" }],
        totalPrice: [{ required: true, message: "价格不能为空" }],
        otherCost: [
          { required: true, message: "请输入其他费用", trigger: "blur" },
          {
            pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/,
            message: "必须为数字值，并且不允许是负数"
          }
        ],
        allDiscount: [
          { required: true, message: "请输入整体优惠", trigger: "blur" },
          {
            pattern: /^(([+]?\d*$)|(^[+]?\d+(\.\d+)?$))/,
            message: "必须为数字值，并且不允许是负数"
          }
        ],
        num: [{ required: true, message: "请输入数量", trigger: "blur" }],
        type: [
          { required: true, message: "请选择下单方式", trigger: "change" }
        ],
        // contactName: [
        //   { required: true, message: "请输入联系人姓名", trigger: "blur" }
        // ],
        // contactPhone: [
        //   { required: true, message: "请输入联系人电话", trigger: "blur" }
        // ],
        cnName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        enName: [
          { required: true, message: "请输入姓（拼音）", trigger: "blur" },
          {
            pattern: /(a[io]?|ou?|e[inr]?|ang?|ng|[bmp](a[io]?|[aei]ng?|ei|ie?|ia[no]|o|u)|pou|me|m[io]u|[fw](a|[ae]ng?|ei|o|u)|fou|wai|[dt](a[io]?|an|e|[aeio]ng|ie?|ia[no]|ou|u[ino]?|uan)|dei|diu|[nl](a[io]?|ei?|[eio]ng|i[eu]?|i?ang?|iao|in|ou|u[eo]?|ve?|uan)|nen|lia|lun|[ghk](a[io]?|[ae]ng?|e|ong|ou|u[aino]?|uai|uang?)|[gh]ei|[jqx](i(ao?|ang?|e|ng?|ong|u)?|u[en]?|uan)|([csz]h?|r)([ae]ng?|ao|e|i|ou|u[ino]?|uan)|[csz](ai?|ong)|[csz]h(ai?|uai|uang)|zei|[sz]hua|([cz]h|r)ong|y(ao?|[ai]ng?|e|i|ong|ou|u[en]?|uan))/,
            message: "姓（拼音）格式不正确"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[5|7|9]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[0|1|2|3|5|6|7|8]|18[0-9]|19[8|9])\d{8}$/,
            message: "手机号格式不正确"
          }
        ],
        // idCard: [
        //   { required: true, message: "身份证号不能为空", trigger: "blur" },
        //   {
        //     pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        //     message: "身份证号格式不正确",
        //     trigger: "blur"
        //   }
        // ]
        //credTOV:[{ required: true, message: "请选择证件有效期", trigger: "blur" }],
      },
      costList: [],
      detailsDialog: false, 
      activeName: "first", 
      tableBorrowing: [], 
      tableAccount: [], 
      tableCollection: [], 
      tableOrder: [], 
      productPos: 0,
      ReplacesaleId: 0, 
      userID: 0, 
      lines: 0, 
      deposit: 0, 
      amount: 0, 
      payment: 0,
      tradeSales: 0, 
      approvalTable: [], 
      approvalShow: false, 
      guid: "",
      pid: "",
      paymentType: "",
      multipleSelection: [], 
      checkSheetDialog: false, 
      forbidden: true, 
      collectionShow: false, 
      collectionTable: [], 
      collectionID: "", 
      nullShow: false, 
      nullShowName: false, 
      nullShowOp: false, 
      nullShowGuest: false, 
      enrollDetail: "", 
      newEnrollDetail: "", 
      tradeID:0,
      rate:'', 
    };
  },
  filters: {
    numFilter(value) {
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },
    formatDate01: function(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  },
  created() {},
  watch: {
    variable: function() {
      if (this.dialogType == 1) {
        setTimeout(() => {
          this.teampreview(this.planId);
        }, 200);
        this.dialogFormOrder = true;
        this.enrolNums = false;
        this.ruleForm.remark = "";
        this.ruleForm.otherCostRemark = "";
        this.ruleForm.allDisRemark = "";
      } else if (this.dialogType == 2) {
        setTimeout(() => {
          this.teamGetDetails(this.planId);
        }, 200);
        this.detailsDialog = true;
      }
    },
    enrolNum: function(val) {
      this.changeQuota();
      this.compPrice();
    },
    "ruleForm.otherCost": function(val) {
      this.compPrice();
    },
    "ruleForm.allDiscount": function(val) {
      this.compPrice();
    },
    "ruleForm.type": function(val) {
      this.changeQuota();
    },
    "ruleForm.price": function(val) {
      this.compPrice();
    }
    // "ruleForm.index":function(val){
    //   this.changeQuota();
    // }
  },
  methods: {
    moment,
    dateFormat: function(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    dateFormat1: function(row, column) {
      let date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    detailsCancel() {
      this.detailsDialog = false;
      this.tableBorrowing = []; 
      this.tableAccount = []; 
      this.tableCollection = []; 
      this.tableOrder = []; 
    },
    getCostClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f6f6f6;height:25px;textAlign:center;fontSize:15px";
      } else {
        return "";
      }
    },
    changeQuota(index) {
      this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
      let salePriceType3 = JSON.parse(JSON.stringify(this.salePriceNum));
      let salePriceType = {};
      for (let i = 0; i < this.salePrice.length; i++) {
        // if (this.ruleForm.type == 3 || this.ruleForm.type == 1)
        // if (this.ruleForm.type == 1)
        if (this.ruleForm.index == 3) {
          this.salePrice[i].quota =
            parseInt(this.salePrice[i].quota) -
            parseInt(this.enrolNum[i] ? parseInt(this.enrolNum[i]) : 0);
          salePriceType = this.salePrice[i];
        } else {
          salePriceType3[i].quota =
            parseInt(salePriceType3[i].quota) -
            parseInt(this.enrolNum[i] ? parseInt(this.enrolNum[i]) : 0);
          salePriceType = salePriceType3[i];
        }
        if (salePriceType.quota < 0) {
          this.quota[i] = true;
        } else {
          this.quota[i] = false;
        }
      }
    },
    teamGetDetails(ID) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/teampreview", {
          id: ID
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.teampreviewData = res.data.object;
            this.rate = res.data.object.rate *100 ; 
            this.getBorrowing(this.planId);
            this.teamEnrolls(this.planId);
          }
        });
    },
    // getaverage(ID) {
    //   console.log(ID)
    //   this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/getaverage', {
    //     "id": ID
    //   }).then(res => {
    //     this.average = res.data.average;
    //   })
    // },
    teampreview(ID) {
      //this.getaverage(ID);
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/teampreview", {
          id: ID
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.teampreviewData = res.data.object;
            this.teamEnrolls(this.planId);
          }
        });
    },
    teamEnrolls(ID) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/enrolls", {
          id: ID
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.preLength = [];
            this.enrolNum = [];
            this.quota = [];
            this.tour = [];
            let data = res.data.objects;
            for (let i = 0; i < data.length; i++) {
              this.preLength.push("0");
              this.enrolNum.push(0);
              this.quota.push(false);
              this.tour.push([]);
              if (
                data[i].quota == 0 ||
                data[i].quota > this.teampreviewData.remaining
              ) {
                data[i].quota = this.teampreviewData.remaining;
              }
            }
            this.salePrice = data;
            this.salePriceNum = data;
          }
        });
    },
    peoNum(index, enrollID, enrollName, price_01, price_02, num) {
      let arrLength; 
      let preLength; 
      preLength = this.preLength[index]; 
      arrLength = this.enrolNum[index]; 
      if (arrLength > this.salePriceNum[index].quota) {
        this.enrolNum[index] = this.salePriceNum[index].quota;
        arrLength = this.salePriceNum[index].quota;
      }
      this.preLength[index] = this.enrolNum[index];

      if (arrLength > 0) {
        this.enrolNums = false;
      }
      var len;
      if (arrLength > preLength) {
        len = arrLength - preLength;
        for (var i = 0; i < len; i++) {
          this.tour[index].push({
            enrollID: enrollID,
            enrollName: enrollName,
            //enrollNum:enrolNum,
            id: 0,
            isDeleted: 0,
            code: "string",
            cnName: "",
            enName: "",
            sex: 3,
            idCard: "",
            singlePrice: 0,
            mobile: "",
            bornDate: 0,
            credType: 0,
            credCode: "",
            //credTOV: 0,
            orderID: 0,
            orderCode: "",
            orgID: 0,
            userID: 0
          });
        }
        // for (let i = 0; i < num - preLength; i++) {
        //   let price;
        //   this.ruleForm.price == 1 ? (price = price_01) : (price = price_02);
        //   price = this.toDecimal2(price);
        //   this.enrollDetail += `${enrollName}(${price} * 1),`;
        // }
      } else {
        for (var i = 0; i < this.tour[index].length; i++) {
          if (this.tour[index][i].cnName === "") {
            this.tour[index].splice(i, preLength - arrLength);
            break;
          }
        }
        // let _arr = this.enrollDetail.split(",");
        // for (let j = 0; j < preLength - num; j++) {
        //   for (let i = _arr.length - 1; i => 0; i--) {
        //     if (_arr[i].indexOf(enrollName) != -1) {
        //       _arr.splice(i, 1);
        //       this.enrollDetail = _arr.toString();
        //       break
        //     }
        //   }
        // }
      }
    },
    submitForm(formName, index) {
      this.$refs[formName].validate(valid => {
        var blooen = "0";
        for (let i = 0; i < this.quota.length; i++) {
          if (this.quota[i] == true) {
            blooen = "1";
          }
        }
        if (blooen == "1") {
          return false;
        }
        let number = 0;
        for (let i = 0; i < this.enrolNum.length; i++) {
          if (this.enrolNum[i]) {
            number += parseInt(this.enrolNum[i]);
          }
        }
        if (number == 0) {
          (this.enrolNumsWarn = "报名人数不能为空"), (this.enrolNums = true);
          return false;
        } else if (number > this.teampreviewData.remaining) {
          (this.enrolNumsWarn = "报名总人数不能超过余位"),
            (this.enrolNums = true);
          return false;
        } else {
          this.enrolNums = false;
        }
        let guestAll = []; 
        if (valid) {
          for (let i = 0; i < this.tour.length; i++) {
            for (let j = 0; j < this.tour[i].length; j++) {
              if (this.ruleForm.price == 1) {
                this.tour[i][j].singlePrice = this.salePrice[i].price_01;
              } else {
                this.tour[i][j].singlePrice = this.salePrice[i].price_02;
              }
              guestAll.push(this.tour[i][j]);
            }
          }
          // let guest = [];
          // for (let i = 0; i < guestAll.length; i++) {
          //   if (guestAll[i].cnName != "") {
          //     guest.push(guestAll[i]);
          //     guest[i].bornDate = new Date(guest[i].bornDate).getTime(); //时间格式转换
          //     //guest[i].credTOV = new Date(guest[i].credTOV).getTime();
          //   } else {
          //     guest.push(guestAll[i]);
          //   }
          // }
          if (this.ifOrderInsert == false) {
            return false;
          }
          // let enrollDetail = "";
          // console.log(this.salePrice)
          // this.salePrice.forEach((ele, idx) => {
          //   let price=0;
          //   if(this.ruleForm.price == 1){
          //     price = this.toDecimal2(ele.price_01);
          //   }else{
          //     price = this.toDecimal2(ele.price_02);
          //   }
          //   //let price = this.toDecimal2(ele.price_01);
          //   if(this.enrolNum[idx]!==0){
          //     enrollDetail += `${ele.enrollName}(${price}*${this.enrolNum[idx]})`;
          //   }
          //   // console.log(enrollDetail)
          // });

          this.ifOrderInsert = true;
          // for(let i = 0; i<guest.length;i++){
          //   if(guest[i].sex === ''){
          //     this.ifOrderInsert = false;
          //     this.$confirm("请完善出行人信息?", "提示", {
          //        confirmButtonText: "确定",
          //        cancelButtonText: "取消",
          //        type: "warning"
          //     }).then(res =>{
          //       this.ifOrderInsert = true;
          //     }).catch(() => {
          //       this.ifOrderInsert = true;
          //       this.$message({
          //         type: "info",
          //         message: "已取消"
          //       });
          //     });
          //   }
          // }
          if (this.ifOrderInsert === true) {
            let sum = 0; 
            this.enrolNum.forEach(function(item) {
              sum += item;
            });
            if (sum !== guestAll.length) {
              this.$confirm(
                "报名人数与出行人信息不符?请修改出行人信息",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(res => {
                  this.ifOrderInsert = true;
                })
                .catch(() => {
                  this.ifOrderInsert = true;
                  this.$message({
                    type: "info",
                    message: "已取消"
                  });
                });
            } else {
              this.regimentType(this.planId, index);
            }
          }
        } else {
          console.log("error submit!!");
          //this.ifOrderInsert = false;
          this.ifOrderInsert = true;
          return false;
        }
        // console.log(guestAll);
      });
    },
    getTypePrice() {
      let arr = this.enrollDetail.split(",")
      arr.pop()
      for(let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace(/\s*/g, '')
        for(let j = 0; j < this.salePrice.length; j++) {
          if(arr[i].indexOf(this.salePrice[j].enrollName) !== -1) {
            let first = arr[i].indexOf("(")
            let end = arr[i].indexOf("*")
            let str = arr[i].substring(first+1,end)
            let price = "";
            this.ruleForm.price == 1 ? price = this.toDecimal2(this.salePrice[j].price_01) : price = this.toDecimal2(this.salePrice[j].price_02)
            this.newEnrollDetail += (arr[i].replace(str,price).toString() + ',')
          }
        }
      }
    },
    regimentType(ID, index, formName) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/teampreview", {
          id: ID
        })
        .then(res => {
          let number = 0;
          for (let i = 0; i < this.enrolNum.length; i++) {
            if (this.enrolNum[i]) {
              number += parseInt(this.enrolNum[i]);
            }
          }
          let guestAll = [];
          for (let i = 0; i < this.tour.length; i++) {
            for (let j = 0; j < this.tour[i].length; j++) {
              if (this.ruleForm.price == 1) {
                this.tour[i][j].singlePrice = this.salePrice[i].price_01;
              } else {
                this.tour[i][j].singlePrice = this.salePrice[i].price_02;
              }
              guestAll.push(this.tour[i][j]);
              this.tour[i][j].bornDate = new Date(this.tour[i][j].bornDate).getTime();
            }
          }
          // let guest = [];
          // console.log(guest)
          // for (let i = 0; i < guestAll.length; i++) {
          //   if (guestAll[i].cnName != "") {
          //     guest.push(guestAll[i]);
          //     guest[i].bornDate = new Date(guest[i].bornDate).getTime(); //时间格式转换
          //     //guest[i].credTOV = new Date(guest[i].credTOV).getTime();
          //   } else {
          //     guest.push(guestAll[i]);
          //   }
          // }
          let enrollDetail = "";
          this.salePrice.forEach((ele, idx) => {
            let price=0;
            if(this.ruleForm.price == 1){
              price = this.toDecimal2(ele.price_01);
            }else{
              price = this.toDecimal2(ele.price_02);
            }
            //let price = this.toDecimal2(ele.price_01);
            if(this.enrolNum[idx]!==0){
              enrollDetail += `${ele.enrollName} ( ${price} * ${this.enrolNum[idx]} ),`;
            }
          });
          if (res.data.isSuccess == true) {
            this.teampreviewData.regimentType = res.data.object.regimentType;
            if (this.ifOrderInsert === true) {
              if (this.teampreviewData.regimentType === 1) {
                //this.getTypePrice();
                if (this.ruleForm.orderRadio === "1") {
                  this.ifOrderInsert = true;
                  this.$http
                    .post(
                      this.GLOBAL.serverSrc + "/order/all/api/orderinsert",
                      {
                        object: {
                          id: 0,
                          isDeleted: 0,
                          code: "",
                          orderCode: "",
                          proID: this.teampreviewData.teamID,
                          planID: this.planId,
                          orderStatus: 0, 
                          refundStatus: 0, 
                          occupyStatus: index, 
                          payable: this.ruleForm.totalPrice, 
                          platform: 1, 
                          favourable: [
                            {
                              id: 0,
                              orderID: 0,
                              price: this.ruleForm.otherCost,
                              title: "其他费用",
                              favMode: 1,
                              mark: this.ruleForm.otherCostRemark
                            },
                            {
                              id: 0,
                              orderID: 0,
                              price:0,
                              //price: this.ruleForm.allDiscount,
                              title: "整体优惠",
                              favMode: 2,
                              mark: this.ruleForm.allDisRemark
                            }
                          ],
                          contact:
                            '{"Name":"' +
                            this.ruleForm.contactName +
                            '","Tel":"' +
                            this.ruleForm.contactPhone +
                            '"}',
                          endTime:
                            index == 3
                              ? 0
                              : new Date().getTime() / 1000 + 24 * 60 * 60,
                          orderChannel: Number(this.ruleForm.orderRadio),
                          priceType: Number(this.ruleForm.price),
                          orgID: 0,
                          userID: sessionStorage.getItem("id"),
                          replacesale: (this.ruleForm.market = ""
                            ? 0
                            : this.ReplacesaleId), 
                          remark: JSON.stringify([
                            {
                              OrderCode: "",
                              Mark: this.ruleForm.remark,
                              CreateTime: formatDate(new Date())
                            }
                          ]),
                          guests: guestAll,
                          //guests: guest,
                          number: number,
                          enrollDetail: enrollDetail 
                        }
                      }
                    )
                    .then(res => {
                      if (res.data.isSuccess == true) {
                        this.$message.success("提交成功");
                        this.$parent.teamQueryList(
                          this.pageIndex == 1 ? this.pageIndex : 1
                        );
                        let data = JSON.parse(res.data.result.details);
                        this.orderCode = data.OrderCode;
                        this.addComment(this.orderCode);
                        this.orderSuc = true;
                        //this.$refs[formName].resetFields();
                        this.dialogFormOrder = false;
                        this.ifOrderInsert = true;
                        this.startUpWorkFlowForJQ(
                          data.OrderID,
                          data.FlowModel,
                          data.FlowModelName,
                          data.Usercode
                        );
                      } else if (res.data.isSuccess == false) {
                        this.$message.success(res.data.result.message + "");
                        this.ifOrderInsert = true;
                      }
                    });
                } else if (this.ruleForm.orderRadio === "2") {
                  if (this.payment == "1") {
                    if (
                      this.nullShow == false &&
                      this.nullShowName == false &&
                      this.nullShowOp == false &&
                      this.nullShowGuest == false
                    ) {
                      if (this.ruleForm.totalPrice <= this.amount) {
                        this.ifOrderInsert = true;
                        this.$http
                          .post(
                            this.GLOBAL.serverSrc +
                              "/order/all/api/siorderinsert",
                            {
                              object: {
                                id: 0,
                                isDeleted: 0,
                                code: "",
                                orderCode: "",
                                proID: this.teampreviewData.teamID,
                                planID: this.planId,
                                orderStatus: 0, 
                                refundStatus: 0, 
                                occupyStatus: index, 
                                payable: this.ruleForm.totalPrice, 
                                platform: 2, 
                                favourable: [
                                  {
                                    id: 0,
                                    orderID: 0,
                                    price: this.ruleForm.otherCost,
                                    title: "其他费用",
                                    favMode: 1,
                                    mark: this.ruleForm.otherCostRemark
                                  },
                                  {
                                    id: 0,
                                    orderID: 0,
                                    price:0,
                                    //price: this.ruleForm.allDiscount,
                                    title: "整体优惠",
                                    favMode: 2,
                                    mark: this.ruleForm.allDisRemark
                                  }
                                ],
                                contact:
                                  '{"Name":"' +
                                  this.ruleForm.contactName +
                                  '","Tel":"' +
                                  this.ruleForm.contactPhone +
                                  '"}',
                                endTime:
                                  index == 3
                                    ? 0
                                    : new Date().getTime() / 1000 +
                                      24 * 60 * 60,
                                orderChannel: Number(this.ruleForm.orderRadio),
                                priceType: Number(this.ruleForm.price),
                                orgID: this.productPos,
                                userID: this.userID,
                                indirectSale: this.tradeSales,
                                // orgID: sessionStorage.getItem("orgID"),
                                //userID: sessionStorage.getItem("id"),
                                remark: JSON.stringify([
                                  {
                                    OrderCode: "",
                                    Mark: this.ruleForm.remark,
                                    CreateTime: formatDate(new Date())
                                  }
                                ]),
                                guests: guestAll,
                                // guests: guest,
                                number: number,
                                enrollDetail: enrollDetail 
                              }
                            }
                          )
                          .then(res => {
                            if (res.data.isSuccess == true) {
                              this.$message.success("提交成功");
                              this.amount = 0;
                              this.ruleForm.orderRadio = 1;
                              this.payment = 0;
                              this.$parent.teamQueryList();
                              let data = JSON.parse(res.data.result.details);
                              this.orderCode = data.OrderCode;
                              this.addComment(this.orderCode);
                              this.orderSuc = true;
                              //this.$refs[formName].resetFields();
                              this.dialogFormOrder = false;
                              this.ifOrderInsert = true;
                              this.startUpWorkFlowForJQ(
                                data.OrderID,
                                data.FlowModel,
                                data.FlowModelName,
                                data.Usercode
                              );
                            } else {
                              this.$message.success(
                                res.data.result.message + ""
                              );
                              this.ifOrderInsert = true;
                            }
                          });
                      } else if (this.ruleForm.totalPrice >= this.amount) {
                        this.$confirm(
                          "该订单金额已经超过剩余预存款和额度?",
                          "提示",
                          {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                          }
                        )
                          .then(res => {
                            this.$parent.teamQueryList();
                          })
                          .catch(() => {
                            this.$message({
                              type: "info",
                              message: "已取消"
                            });
                          });
                      }
                    }
                  } else if (this.payment == "2") {
                    this.ifOrderInsert = true;
                    if (
                      this.nullShow == false &&
                      this.nullShowName == false &&
                      this.nullShowOp == false &&
                      this.nullShowGuest == false
                    ) {
                      this.$http
                        .post(
                          this.GLOBAL.serverSrc +
                            "/order/all/api/siorderinsert",
                          {
                            object: {
                              id: 0,
                              isDeleted: 0,
                              code: "",
                              orderCode: "",
                              proID: this.teampreviewData.teamID,
                              planID: this.planId,
                              orderStatus: 0, 
                              refundStatus: 0, 
                              occupyStatus: index, 
                              payable: this.ruleForm.totalPrice, 
                              platform: 2, 
                              favourable: [
                                {
                                  id: 0,
                                  orderID: 0,
                                  price: this.ruleForm.otherCost,
                                  title: "其他费用",
                                  favMode: 1,
                                  mark: this.ruleForm.otherCostRemark
                                },
                                {
                                  id: 0,
                                  orderID: 0,
                                  price:0,
                                  //price: this.ruleForm.allDiscount,
                                  title: "整体优惠",
                                  favMode: 2,
                                  mark: this.ruleForm.allDisRemark
                                }
                              ],
                              contact:
                                '{"Name":"' +
                                this.ruleForm.contactName +
                                '","Tel":"' +
                                this.ruleForm.contactPhone +
                                '"}',
                              endTime:
                                index == 3
                                  ? 0
                                  : new Date().getTime() / 1000 + 24 * 60 * 60,
                              orderChannel: Number(this.ruleForm.orderRadio),
                              priceType: Number(this.ruleForm.price),
                              orgID: this.productPos,
                              userID: this.userID,
                              indirectSale: this.tradeSales,
                              // orgID: sessionStorage.getItem("orgID"),
                              //userID: sessionStorage.getItem("id"),
                              remark: JSON.stringify([
                                {
                                  OrderCode: "",
                                  Mark: this.ruleForm.remark,
                                  CreateTime: formatDate(new Date())
                                }
                              ]),
                              guests: guestAll,
                              //guests: guest,
                              number: number,
                              enrollDetail: enrollDetail 
                            }
                          }
                        )
                        .then(res => {
                          if (res.data.isSuccess == true) {
                            this.$message.success("提交成功");
                            this.amount = 0;
                            this.ruleForm.orderRadio = 1;
                            this.payment = 0;
                            this.$parent.teamQueryList();
                            let data = JSON.parse(res.data.result.details);
                            this.orderCode = data.OrderCode;
                            this.addComment(this.orderCode);
                            this.orderSuc = true;
                            //this.$refs[formName].resetFields();
                            this.dialogFormOrder = false;
                            this.ifOrderInsert = true;
                            this.startUpWorkFlowForJQ(
                              data.OrderID,
                              data.FlowModel,
                              data.FlowModelName,
                              data.Usercode
                            );
                          } else {
                            this.$message.success(res.data.result.message + "");
                            this.ifOrderInsert = true;
                          }
                        });
                    }
                  }
                }
              } else if (this.teampreviewData.regimentType === 2) {
                this.$confirm("该团号已停售?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(res => {
                    //this.ifOrderInsert = true;
                    this.$parent.teamQueryList();
                  })
                  .catch(() => {
                    //this.ifOrderInsert = true;
                    this.$message({
                      type: "info",
                      message: "已取消"
                    });
                  });
              } else if (this.teampreviewData.regimentType === 3) {
                this.$confirm("该团号已封团?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(res => {
                    //this.ifOrderInsert = true;
                    this.$parent.teamQueryList();
                  })
                  .catch(() => {
                    //this.ifOrderInsert = true;
                    this.$message({
                      type: "info",
                      message: "已取消"
                    });
                  });
              }
            }
          }
        });
    },
    addComment(orderCode) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/orderquery/get/api/InserOrderComment", {
          object: {
            orderCode: orderCode,
            content: this.ruleForm.remark,
            createTime: moment()
              .format("YYYY-MM-DD HH:mm:ss")
              .toString()
          }
        })

        .then(res => {})
        .catch(err => {
          console.log(err);
        });
    },
    toDecimal2(x) {
      let f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 2) {
        s += "0";
      }
      return s;
    },
    delTravel(type, index, enrollName) {
      this.$confirm("是否删除该条出行人信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.tour[index].splice(type, 1); 
        this.enrolNum[index] = this.tour[index].length; 
        this.preLength[index] = this.enrolNum[index];
        this.applyEnrollDetail(enrollName);
        //console.log(this.enrolNum[index])
      });
    },
    applyEnrollDetail(enrollName) {
      let _arr = this.enrollDetail.split(",");
      for (let i = _arr.length - 1; i => 0; i--) {
        if (_arr[i].indexOf(enrollName) != -1) {
          _arr.splice(i, 1);
          this.enrollDetail = _arr.toString();
          break;
        }
      }
    },
    fillTour(type, index) {
      this.winTitle = this.salePrice[type].enrollName; 
      if (this.tour[type][index].enName != "") {
        this.conForm = JSON.parse(JSON.stringify(this.tour[type][index])); 
      }
      this.tourType = type;
      this.fillIndex = index;
      this.dialogFormTour = true;
    },
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let guest = JSON.parse(JSON.stringify(this.conForm));
          guest.enrollID = this.salePrice[this.tourType].enrollID; 
          guest.enrollName = this.salePrice[this.tourType].enrollName; 
          //guest.enrollNum = this.salePrice[this.tourType].enrolNum; 
          // guest.enrollNum = this.
          // guest.createTime = this.createTime
          if (this.ruleForm.price == 1) {
            guest.singlePrice = this.salePrice[this.tourType].price_01; 
          } else {
            guest.singlePrice = this.salePrice[this.tourType].price_02;
          }
          this.tour[this.tourType][this.fillIndex] = guest;
          this.dialogFormTour = false;
          this.$refs[formName].resetFields();
        }
      });
    },
    cancelInfo(formName) {
      this.dialogFormTour = false;
      this.$refs[formName].resetFields();
    },
    cancelInfoOrder(formName) {
      this.dialogFormOrder = false;
      this.$refs[formName].resetFields();
      this.costList = [];
      this.enrollDetail = ""
      this.newEnrollDetail= ""
    },
    compPrice() {
      this.ruleForm.totalPrice = 0;
      for (let i = 0; i < this.enrolNum.length; i++) {
        this.ruleForm.totalPrice +=
          (this.enrolNum[i] == undefined ? 0 : this.enrolNum[i]) *
          (this.ruleForm.price == 1
            ? this.salePrice[i].price_01
            : this.salePrice[i].price_02);
      }
      this.ruleForm.totalPrice += parseInt(
        this.ruleForm.otherCost ? this.ruleForm.otherCost : 0
      );
      this.ruleForm.totalPrice -= parseInt(
        this.ruleForm.allDiscount ? this.ruleForm.allDiscount : 0
      );
    },
    querySearch1(queryString1, cb) {
      this.marketList = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/org/api/userlist", {
          object: {
            name: queryString1,
            isDeleted: 0
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            for (let i = 0; i < res.data.objects.length; i++) {
              this.marketList.push({
                value: res.data.objects[i].name,
                id: res.data.objects[i].id
              });
              this.supplier_id = res.data.objects[i].id
                ? res.data.objects[i].id
                : 0;
            }
          }
          if (res.data.objects.length === 0) {
            this.nullShowGuest = true;
          } else {
            this.nullShowGuest = false;
          }
          var results = queryString1
            ? this.marketList.filter(this.createFilter(queryString1))
            : [];
          cb(results);
        })
        .catch(err => {
          //console.log(err);
        });
    },
    createFilter(queryString1) {
      return restaurant => {
        return restaurant.value;
      };
    },
    departure1(item) {
      this.ReplacesaleId = item.id;
    },
    querySearch2(queryString2, cb) {
      this.marketList = [];
      this.$http
        .post(
          this.GLOBAL.serverSrc + "/universal/localcomp/api/PeerUser_AdminList",
          {
            object: {
              localCompID: this.productPos,
              jqUserType: 2,
              state:2,
              isDeleted:0
            }
          }
        )
        .then(res => {
          if (res.data.isSuccess == true) {
            for (let i = 0; i < res.data.objects.length; i++) {
              if(this.ruleForm.travelSales==""){
                this.marketList.push({
                  value: res.data.objects[i].name,
                  id: res.data.objects[i].id,
                  userCode: res.data.objects[i].userCode
                });
                queryString2 = " ";
              }else{
                if (res.data.objects[i].name.indexOf(this.ruleForm.travelSales) != -1) {
                  this.marketList.push({
                    value: res.data.objects[i].name,
                    id: res.data.objects[i].id,
                    userCode: res.data.objects[i].userCode
                  });
                }
              }
            }
          }
          if (this.marketList.length > 0 ) {
            this.nullShowOp = false;
          } else {
            this.nullShowOp = true;
          }

          var results = queryString2
            ? this.marketList.filter(this.createFilter(queryString2))
            : [];
          cb(results);
        })
        .catch(err => {
          //console.log(err);
        });
    },
    createFilter(queryString2) {
      return restaurant => {
        return restaurant.value;
      };
    },
    departure2(item) {
      this.tradeSales = item.userCode;
      this.tradeID = item.id;
      //this.userID = item.id
    },
    querySearch3(queryString3, cb) {
      this.ruleForm.merchantsSell = ""; 
      this.tableData2 = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/list", {
          object: {
            selName: queryString3,
            isDeleted: 0,
            state: 2
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            for (let i = 0; i < res.data.objects.length; i++) {
              if(this.ruleForm.travel == ""){
                this.tableData2.push({
                  value: res.data.objects[i].selName,
                  id: res.data.objects[i].id,
                  supplierType: res.data.objects[i].supplierType,
                  balance: res.data.objects[i].balance,
                  deposit: res.data.objects[i].deposit,
                  settlementType: res.data.objects[i].settlementType
                });
                queryString3 = " "
              }else{
                if (res.data.objects[i].selName.indexOf(this.ruleForm.travel) != -1) {
                  this.tableData2.push({
                    value: res.data.objects[i].selName,
                    id: res.data.objects[i].id,
                    supplierType: res.data.objects[i].supplierType,
                    balance: res.data.objects[i].balance,
                    deposit: res.data.objects[i].deposit,
                    settlementType: res.data.objects[i].settlementType
                  });
                }
              }
            }
          }
          if (res.data.objects) {
            this.nullShowName = false;
            this.forbidden = false;
          } else {
            this.nullShowName = true;
            this.forbidden = true;
          }

          var results = queryString3
            ? this.tableData2.filter(this.createFilter(queryString3))
            : [];
          cb(results);
        })
        .catch(err => {
          //console.log(err);
        });
    },
    createFilter(queryString3) {
      return restaurant => {
        return restaurant.value;
      };
    },
    departure(item,useList) {
      this.productPos = item.id; 
      this.lines = item.balance; 
      this.deposit = item.deposit; 
      this.payment = item.settlementType; 
      this.amount = this.lines + this.deposit;
      this.originPlace = item.value;
      this.querySearch2();
      this.ruleForm.travelSales = "";
      this.tradeID = "";
      setTimeout(() =>{ 
      	this.ruleForm.travelSales = this.marketList[0].value;
      	this.tradeID = this.marketList[0].id;
        this.tradeSales = this.marketList[0].userCode;
      },300)
      this.querySearch4();
      setTimeout(() =>{ 
      	this.ruleForm.merchantsSell = this.useList[0].value;
      	this.userID = this.useList[0].id;
      },300)
    },
    travelGuest() {
      if (this.ruleForm.market == "") {
        this.nullShowGuest = false;
      }
    },
    travelOp() {
      if (this.ruleForm.travelSales == "") {
        this.nullShowOp = false;
      }
    },
    travelName() {
      if (this.ruleForm.travel == "") {
        this.nullShowName = false;
        this.ruleForm.travelSales = "" 
		    this.ruleForm.merchantsSell = ""  
      }
    },
    merchants() {
      if (this.ruleForm.merchantsSell == "") {
        this.nullShow = false;
      }
    },
    querySearch4(queryString4, cb) {
      this.useList = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/get", {
          id: this.productPos
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            for (let i = 0; i < res.data.object.useList.length; i++) {
              if(this.ruleForm.merchantsSell == ""){
                this.useList.push({
                  value: res.data.object.useList[i].name,
                  id: res.data.object.useList[i].id,
                  name: res.data.object.useList[i].name,
                });
                queryString4 = " "
              }else{
                if (res.data.object.useList[i].name.indexOf(this.ruleForm.merchantsSell) != -1) {
                  this.useList.push({
                    value: res.data.object.useList[i].name,
                    id: res.data.object.useList[i].id,
                    name: res.data.object.useList[i].name,
                  });
                }
              }
            }
          }
          if (this.useList.length === 0) {
            this.nullShow = true;
          } else {
            this.nullShow = false;
          }

          var results = queryString4
            ? this.useList.filter(this.createFilter(queryString4))
            : [];
          cb(results);
        })
        .catch(err => {
          //console.log(err);
        });
    },
    createFilter(queryString4) {
      return restaurant => {
        return restaurant.value;
      };
    },
    departure4(item) {
      this.userID = item.id;
      //this.userName = item.name;
    },
    changeTab() {
      if (this.ruleForm.orderRadio == 1) {
        this.ruleForm.travelSales = "";
        this.ruleForm.travel = "";
        this.ruleForm.merchantsSell = "";
      } else {
        this.ruleForm.market = "";
      }
    },
    getBorrowing(val) {
      var that = this;
      that.$http
        .post(this.GLOBAL.serverSrc + "/finance/payment/api/list", {
          object: {
            planID: this.planId
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            that.tableBorrowing = res.data.objects;
            that.tableBorrowing.forEach(function(v, k, arr) {
              if (arr[k]["checkType"] == 0) {
                arr[k]["checkType"] = "审批中";
              } else if (arr[k]["checkType"] == 1) {
                arr[k]["checkType"] = "通过";
              } else if (arr[k]["checkType"] == 2) {
                arr[k]["checkType"] = "驳回";
              }
              if (arr[k]["supplierType"] == 1) {
                arr[k]["supplierType"] = "地接";
              } else if (arr[k]["supplierType"] == 2) {
                arr[k]["supplierType"] = "机票（本公司）";
              } else if (arr[k]["supplierType"] == 3) {
                arr[k]["supplierType"] = "机票（非本公司）";
              } else if (arr[k]["supplierType"] == 4) {
                arr[k]["supplierType"] = "小费";
              } else if (arr[k]["supplierType"] == 5) {
                arr[k]["supplierType"] = "地接（其他）";
              } else if (arr[k]["supplierType"] == 6) {
                arr[k]["supplierType"] = "火车票";
              } else if (arr[k]["supplierType"] == 7) {
                arr[k]["supplierType"] = "汽车票";
              } else if (arr[k]["supplierType"] == 8) {
                arr[k]["supplierType"] = "船票";
              } else if (arr[k]["supplierType"] == 9) {
                arr[k]["supplierType"] = "其他";
              } else if (arr[k]["supplierType"] == 10) {
                arr[k]["supplierType"] = "机票押金";
              } else if (arr[k]["supplierType"] == 11) {
                arr[k]["supplierType"] = "火车票押金";
              }
              if (arr[k]["paymentType"] == 1) {
                arr[k]["paymentType"] = "无收入借款";
              } else if (arr[k]["paymentType"] == 2) {
                arr[k]["paymentType"] = "预付款";
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      that.$http
        .post(this.GLOBAL.serverSrc + "/finance/expense/api/list", {
          object: {
            planID: this.planId
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            that.tableAccount = res.data.objects;
            that.tableAccount.forEach(function(v, k, arr) {
              if (arr[k]["checkType"] == 0) {
                arr[k]["checkType"] = "审批中";
              } else if (arr[k]["checkType"] == 1) {
                arr[k]["checkType"] = "通过";
              } else if (arr[k]["checkType"] == 2) {
                arr[k]["checkType"] = "驳回";
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      that.$http
        .post(this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          pageIndex: 1,
          pageSize: 100,
          object: {
            id: 0,
            checkType: -1,
            startTime: "2000-01-01",
            endTime: "2019-10-21",
            planID: this.planId,
            collectionType: 0
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            that.tableCollection = res.data.objects;
            that.tableCollection.forEach(function(v, k, arr) {
              if (arr[k]["checkType"] == 0) {
                arr[k]["checkType"] = "审批中";
              } else if (arr[k]["checkType"] == 1) {
                arr[k]["checkType"] = "通过";
              } else if (arr[k]["checkType"] == 2) {
                arr[k]["checkType"] = "驳回";
              }
              if (arr[k]["collectionType"] == 1) {
                arr[k]["collectionType"] = "直客";
              } else if (arr[k]["collectionType"] == 2) {
                arr[k]["collectionType"] = "同业";
              } else if (arr[k]["collectionType"] == 3) {
                arr[k]["collectionType"] = "外部";
              } else if (arr[k]["collectionType"] == 4) {
                arr[k]["collectionType"] = "分销商收款";
              } else if (arr[k]["collectionType"] == 5) {
                arr[k]["collectionType"] = "付款";
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      that.$http
        .post(this.GLOBAL.serverSrc + "/order/all/api/planordlist", {
          object: {
            planID: this.planId,
            salerID: sessionStorage.getItem("id")
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            that.tableOrder = res.data.objects;
            that.tableOrder.forEach(function(v, k, arr) {
              if (arr[k]["orderStatus"] == 0 && arr[k]["occupyStatus"] == 1) {
                arr[k]["orderStatus"] = "预订不占";
              } else if (
                arr[k]["orderStatus"] == 0 &&
                arr[k]["occupyStatus"] == 2
              ) {
                arr[k]["orderStatus"] = "预订占位";
              } else if (
                arr[k]["orderStatus"] == 10 &&
                arr[k]["occupyStatus"] == 3
              ) {
                arr[k]["orderStatus"] = "确定占位";
              } else if (arr[k]["orderStatus"] == 1) {
                arr[k]["orderStatus"] = "补充游客材料";
              } else if (arr[k]["orderStatus"] == 2) {
                arr[k]["orderStatus"] = "电子合同";
              } else if (arr[k]["orderStatus"] == 3) {
                arr[k]["orderStatus"] = "待出行";
              } else if (arr[k]["orderStatus"] == 4) {
                arr[k]["orderStatus"] = "出行中";
              } else if (arr[k]["orderStatus"] == 5) {
                arr[k]["orderStatus"] = "待评价";
              } else if (arr[k]["orderStatus"] == 6) {
                arr[k]["orderStatus"] = "订单完成";
              } else if (arr[k]["orderStatus"] == 8) {
                arr[k]["orderStatus"] = "签署合同";
              } else if (arr[k]["orderStatus"] == 9) {
                arr[k]["orderStatus"] = "作废订单";
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    startUpWorkFlowForJQ(OrderID, FlowModel, FlowModelName, Usercode) {
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/StartUpWorkFlowForJQ", {
          jQ_ID: OrderID,
          jQ_Type: FlowModel,
          workflowCode: FlowModelName,
          userCode: Usercode
        })
        .then(res => {
          this.submitWAForJQ(Usercode, JSON.parse(res.data).data.workItemID);
        });
    },
    submitWAForJQ(Usercode, workItemID) {
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/SubmitWorkAssignmentsForJQ", {
          userCode: Usercode,
          workItemID: workItemID,
          commentText: "测试"
        })
        .then(res => {});
    },
    approval(row) {
      this.pid = row.guid; //
      this.paymentType = row.paymentType;
      this.infoForJQ();
      this.approvalShow = true;
    },
    infoForJQ() {
      var that = this;
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/GetInstanceActityInfoForJQ", {
          jQ_ID: this.pid,
          jQ_Type: this.paymentType == "无收入借款" ? 1 : 2
        })
        .then(obj => {
          that.approvalTable = obj.data.extend.instanceLogInfo;
        })
        .catch(obj => {});
    },
    expense(row) {
      this.pid = row.guid;
      this.expenserJQ();
      this.approvalShow = true;
    },
    expenserJQ() {
      var that = this;
      this.$http
        .post(this.GLOBAL.jqUrl + "/JQ/GetInstanceActityInfoForJQ", {
          jQ_ID: this.pid,
          jQ_Type: 3
        })
        .then(obj => {
          that.approvalTable = obj.data.extend.instanceLogInfo;
        })
        .catch(obj => {});
    },
    closeApprova() {
      this.approvalTable = [];
    },
    closeCollection() {
      this.collectionTable = [];
    },
    collection(row) {
      this.collectionID = row.id;
      this.gathering();
      this.collectionShow = true;
    },
    gathering() {
      this.$http
        .post(this.GLOBAL.serverSrc + "/finance/collection/api/coll", {
          id: this.collectionID
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.collectionTable = res.data.object.spw; 
            for (var i = 0; i < this.collectionTable.length; i++) {
              var str = this.collectionTable[i].createTime;
              var Y = str.toString().substring(0, 4);
              var M = str.toString().substring(4, 6);
              var D = str.toString().substring(6, 8);
              var Time = Y + "-" + M + "-" + D;
              this.collectionTable[i].createTime = Time;
            }
          }
        });
    },
    closeCheckSheet() {}
  }
};
</script>

<style scoped>
.planBorder {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  width: 95%;
  margin: 0 30px 10px 30px;
  font-size: 14px;
  line-height: 25px;
}
.order-title {
  overflow: hidden;
  background: #f3f3f3;
  width: 100%;
  line-height: 40px;
}
.order-title span {
  margin: 0 0 0 10px;
  font-size: 17px;
  color: #000;
}
.pro-info {
  font-size: 14px;
  margin: 20px 30px 10px 10px;
  line-height: 30px;
}
.dialog-footer {
  position: absolute;
  top: 8px;
  right: 15px;
}
.salesPrice {
  margin: -3px 0 0 0;
}
.travelMessage {
  line-height: 40px;
  margin: 0 0 0 10px;
  font-size: 17px;
}
.blue {
  color: #2e94f9;
}
.cursor {
  cursor: pointer;
}
.costTable {
  width: 800px;
  margin: 0 0 0 2px;
}
.costList {
  width: 800px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ebebeb;
  border-collapse: collapse;
  border-spacing: 0;
}
.costList_01 {
  background: #f3f3f3;
}
.tc {
  text-align: center;
}
.detail {
  position: absolute;
  right: 15px;
  top: 8px;
}
.detailsTitle {
  font-size: 18px;
  margin: 20px 0 20px 0;
}
.checkType {
  padding: 0 5px;
  width: 100px;
  border-radius: 5px;
  color: #fff;
  line-height: 30px;
  text-align: center;
}
* {
  font-size: 14px;
}
.main1 {
  overflow: hidden;
  width: 70%;
  min-width: 1100px;
  margin-top: -20px;
}

.optionw {
  width: 280px;
}

.demo-ruleForm {
  margin-left: 10px;
}
.fl {
  float: left;
}
.cb {
  clear: both;
}
.num-req {
  position: absolute;
  top: 2px;
  left: -77px;
  color: red;
}
.price .pricew {
  width: 90px;
  text-align: center;
  margin: -5px 15px;
}
.numw {
  width: 150px;
  text-align: center;
  margin: 0 15px;
}
.cost-remark {
  width: 300px;
  text-align: center;
  margin: 0 15px;
}
.radiomar {
  margin: 12px 13px;
}
.ml13 {
  margin-left: 13px;
}
.mb17 {
  margin-bottom: 17px;
}
.tourist {
  margin-left: 13px;
  float: left;
  width: 85%;
}
.tourist span {
  display: inline-block;
  width: 110px;
  background-color: #f6f6f6;
  text-align: center;
  border: 0;
  height: 40px;
  margin-left: 15px;
  margin: 1px 10px 10px 10px;
}
.tour-til {
  float: left;
  margin-left: 13px;
  margin-right: -8px;
  width: 80px;
}
.oh {
  overflow: hidden;
}
.disib {
  display: inline-block;
}
.remark {
  width: 70%;
  margin-left: 12px;
}
.w200 {
  width: 200px;
}
.text {
  font-size: 14px;
}
.item {
  margin: 0 20px 18px 20px;
}
.ordersuc-title {
  text-align: center;
  font-size: 16px;
  margin: 0 0 30px 0;
}
.red {
  color: red;
}

.registration {
  float: left;
  margin: 12px;
  text-align: center;
}
.el-input-number--medium {
  width: 170px;
}
.input-num {
  margin: 10px 0;
}
.w1000 {
  width: 1000px;
}
.mau {
  margin-left: auto;
  margin-right: auto;
}
.fr {
  float: right;
}
.lh30 {
  line-height: 30px;
  margin: 0 0 10px 0;
}
.chesktltle {
  text-align: center;
  line-height: 50px;
  font-size: 18pt;
  color: #000;
  font-weight: bold;
}
.checksheet-table {
  clear: both;
  width: 1000px;
  text-align: center;
  line-height: 30px;
}
.w80 {
  widows: 80px;
}
.w100 {
  width: 100px;
}
.w320 {
  width: 320px;
}
.bc_cc {
  background: #cccccc;
}
</style>
