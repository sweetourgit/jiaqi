<template>
  <div>
    <!--下单弹窗-->
    <el-dialog title="下单" :visible.sync="dialogFormOrder" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"
      @close="cancelInfoOrder('ruleForm')">
      <div class="dialog-footer">
        <el-button class="ml13" @click="cancelInfoOrder('ruleForm')">取 消</el-button>
        <el-button class="ml13" type="primary">预订不占</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" class="ml13">确定占位</el-button>
      </div>
      <div class="main1">
        <!--团期信息-->
        <div class="planBorder">
          <div class="order-title"><span>团期信息</span></div>
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
                <td width="33%">
                  <div width="80" class="fl">参考结算:</div>
                  <div class="fl ml13">{{average}}</div>
                </td>
                <td width="33%">
                  <div width="80" class="fl">订单预留时长:</div>
                  <div class="fl ml13">{{teampreviewData.dateHous}}小时</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="订单来源" prop="orderRadio">
            <div @change="changeTab()">
              <el-radio label="1" class="radiomar" v-model="ruleForm.orderRadio">线下直客</el-radio>
              <el-radio label="2" class="radiomar" v-model="ruleForm.orderRadio">商户(同业、门店)</el-radio>
            </div>
          </el-form-item>
          <!--选择商户按钮，显示商户名称文本框-->
          <div v-if="ruleForm.orderRadio==2">
              <el-form-item label="商户名称" prop="travel" class="fl">
                <el-autocomplete class="optionw" v-model="ruleForm.travel" :fetch-suggestions="querySearch3"placeholder="请输入商户名称" :trigger-on-focus="false"@select="departure"></el-autocomplete>
              </el-form-item>
          </div>
          <el-form-item label="价格选择" prop="price" class="cb price">
            <el-radio-group v-model="ruleForm.price" class="salesPrice">
              <!-- <span v-for="(item,index) in salePrice" :key="index" style="margin:14px 18px 0 13px">{{item.enrollName}}：￥{{item.price_01}}</span>
              <br /> -->
             <el-radio label="1" class="radiomar">直客价格：<span v-for="item in salePrice">{{item.enrollName}}（￥{{item.price_01}}）</span></el-radio>
             <el-radio label="2" class="radiomar">商户价格(同业、门店)：<span v-for="item in salePrice">{{item.enrollName}}（￥{{item.price_02}}）</span></el-radio>
             <!-- <el-radio label="自定义" class="radiomar">自定义： 
                   成人<el-form-item prop="price1" class="disib"><el-input v-model="ruleForm.price1" class="pricew"></el-input></el-form-item>
                   儿童<el-form-item prop="price2" class="disib"><el-input v-model="ruleForm.price2" class="pricew"></el-input></el-form-item>
                   老人<el-form-item prop="price3" class="disib"><el-input v-model="ruleForm.price3" class="pricew"></el-input></el-form-item>
                   单房差<el-form-item prop="price4" class="disib"><el-input v-model="ruleForm.price4" class="pricew"></el-input></el-form-item>
          </el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="报名人数" class="fl">
            <div class="num-req">*</div>
          </el-form-item>
          <div class="fl">
            <div class="registration" v-for="(item,index) in salePrice" :key="index">
              {{item.enrollName}}￥
              <span v-show="ruleForm.price==1">{{item.price_01}}*{{enrolNum[index]}}</span>
              <span v-show="ruleForm.price==2">{{item.price_02}}*{{enrolNum[index]}}</span>
              <div>
                <el-input-number class="input-num" v-model="enrolNum[index]" @change="peoNum(index,item.enrollID,item.enrollName)"
                  :min="0" :max="salePriceNum[index].quota" size="medium"></el-input-number>
              </div>
              <div v-bind:class="{red:quota[index]}">
                余位{{item.quota}}
                <span v-show="quota[index]">库存不足</span>
              </div>
            </div>
            <div class="red ml13" style="margin:0 0 10px 15px;" v-show="enrolNums">{{enrolNumsWarn}}</div>
          </div>
          <!--
            <el-form-item label="" prop="">            
              <div class="ml13">单房差 ￥340</div>
            </el-form-item>
          -->
          <!--其他费用-->
          <el-form-item label="其他费用" prop="otherCost" class="fl cb">
            <el-input v-model="ruleForm.otherCost" class="numw" type="number" :min="0"></el-input>
          </el-form-item>
          <div class="fl">
            <el-input v-model="ruleForm.otherCostRemark" class="cost-remark"></el-input>
          </div>
          <!--整体优惠-->
          <el-form-item label="整体优惠" prop="allDiscount" class="cb fl">
            <el-input v-model="ruleForm.allDiscount" class="numw" type="number" :min="0"></el-input>
          </el-form-item>
          <!-- <div class="fl">
            备注
            <el-input v-model="ruleForm.allDisRemark" class="cost-remark"></el-input>
          </div> -->
          <!--总计-->
          <el-form-item label="总价" prop="totalPrice" class="cb">
            <div class="ml13">{{ruleForm.totalPrice}}</div>
          </el-form-item>
          <!--下单方式-->
          <!-- <el-form-item label="下单方式" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="1" class="radiomar">确认占位</el-radio>
              <br />
              <el-radio label="2" class="radiomar">预定占位 （订单保留24小时，到期提醒）</el-radio>
              <br />
              <el-radio label="3" class="radiomar">预定不占 （订单保留24小时，到期提醒）</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <!--订单联系人-->
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="ruleForm.contactName" class="numw" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="contactPhone">
            <el-input v-model="ruleForm.contactPhone" class="numw" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop>
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" class="remark" placeholder="请输入内容"v-model="ruleForm.remark"
            ></el-input>
          </el-form-item>
          <!--出行人信息-->
          <el-form-item label="出行人信息" class="cb">
            <div class="oh" v-for="(item,indexPrice) in salePrice" :key="indexPrice">
              <div class="tour-til">{{item.enrollName}}</div>
              <div class="tourist">
                <span v-for="(item,index) in tour[indexPrice]" :key="index" placeholder="点击填写" @click="fillTour(indexPrice,index)"
                >{{item.cnName}}</span>
              </div>
            </div>
          </el-form-item>
          <div class="travelMessage">出行人信息</div>
          <el-table :data="costList" class="costTable" :header-cell-style="getCostClass" border width="551px" v-for="(item,indexPrice) in salePrice">
            <el-table-column prop="name" label="姓名" min-width="100" align="center"></el-table-column>
            <el-table-column prop="type" label="报名类型" min-width="100" align="center"></el-table-column>
            <el-table-column prop="phone" label="电话" min-width="120" align="center"></el-table-column>
            <el-table-column prop="IDcard" label="身份证" min-width="180" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" min-width="80" align="center"></el-table-column>
            <el-table-column label="操作" min-width="120" align="center">
              <template slot-scope="scope">
                <span class="cursor blue" @click="fillTravel()">编辑</span>
                <span class="em">|</span>
                <span class="cursor blue" @click="delTravel()">删除</span>
              </template>
            </el-table-column>
          </el-table>

        </el-form>
        
      </div>
    </el-dialog>
    <!--填写游客信息-->
    <el-dialog :title="'出行人信息（'+winTitle+'）'" :visible.sync="dialogFormTour" class="city_list" @close="cancelInfo('conForm')"
      width="700px">
      <el-form :model="conForm" :rules="rules" ref="conForm" style="height:300px;">
        <el-form-item label="中文姓名" prop="cnName" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.cnName" class="w200 fl"></el-input>
        </el-form-item>
        <el-form-item label="英文姓名" prop="enName" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.enName" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" label-width="110px" class="fl" style="width:310px">
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
          <el-date-picker v-model="conForm.bornDate" type="date" placeholder="选择日期" style="width:200px" ></el-date-picker>
        </el-form-item>
        <el-form-item label="证件类型" prop="credType" label-width="110px" class="fl">
          <el-select v-model="conForm.credType" placeholder="请选择">
            <el-option label="请选择" :value="0" />
            <el-option label="护照" :value="1" />
            <el-option label="港澳通行证" :value="2" />
            <el-option label="军官证" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" prop="credCode" label-width="110px" class="fl">
          <el-input type="text" v-model="conForm.credCode" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="证件有效期" prop="credTOV" label-width="110px" class="fl cb">
          <el-date-picker v-model="conForm.credTOV" type="date" placeholder="选择日期" style="width:200px"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer cb">
        <el-button @click="cancelInfo('conForm')">取 消</el-button>
        <!-- <el-button type="primary" @click="subInfo('conForm')">确 定</el-button> -->
        <el-button type="primary" @click="ensure('conForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--下单成功弹窗-->
    <el-dialog title="提示" :visible.sync="orderSuc" width="500px">
      <h3 class="ordersuc-title">下单成功</h3>
      <div class="text item">订单号：{{orderCode}}</div>
      <div class="text item">产品名称：{{teampreviewData.title}}</div>
      <div class="text item">团期计划：{{teampreviewData.groupCode}}</div>
      <el-button type="primary" style="margin:20px 0 10px 200px" @click="orderSuc = false">关闭</el-button>
    </el-dialog>
    <!--详情弹窗-->
    <el-dialog title="详情" :visible.sync="detailsDialog" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"@close="detailsCancel('ruleForm')">
      <div class="detail"><el-button @click="detailsCancel('ruleForm')" class="ml13">取 消</el-button></div>
      <div class="detailsTitle">基本信息</div>
      <div>
        <div class="checkType" style="background: #ffa200">报账中</div>
         <!-- <div class="checkType" v-if="fundamental.checkType=='0'" style="background: #ffa200" >审批中</div>
         <div class="checkType" v-if="fundamental.checkType=='2'" style="background: #ff0000" >驳回</div>
         <div class="checkType" v-if="fundamental.checkType=='1'" style="background: #007500">通过</div> -->
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
              <div class="fl ml13">{{teampreviewData.regimentType}}</div>
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
              <div class="fl ml13">{{teampreviewData.rate}}%</div>
            </td>
          </tr>
        </table>
      </div>
      <div class="detailsTitle">财务信息</div>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="借款" name="first">
            <el-table :data="tableBorrowing" class="" :header-cell-style="getCostClass" border>
              <el-table-column prop="id" label="ID" min-width="80" align="center"></el-table-column>
              <el-table-column prop="paymentType" label="借款类型" min-width="120" align="center"></el-table-column>
              <el-table-column prop="checkType" label="审批状态" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.checkType=='审批中'" style="color: #7F7F7F" >{{scope.row.checkType}}</div>
                  <div v-if="scope.row.checkType=='驳回'" style="color: #FF4A3D" >{{scope.row.checkType}}</div>
                  <div v-if="scope.row.checkType=='通过'" style="color: #33D174" >{{scope.row.checkType}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="supplierType" label="借款类型" min-width="80" align="center"></el-table-column>
              <el-table-column prop="supplierName" label="供应商" min-width="80" align="center"></el-table-column>
              <el-table-column prop="price" label="金额" min-width="120" align="center"></el-table-column>
              <el-table-column prop="expensePrice" label="已核销金额" min-width="120" align="center"></el-table-column>
              <el-table-column prop="createUser" label="申请人" min-width="70" align="center"></el-table-column>
              <el-table-column label="审批过程" min-width="70" align="center">
                <template slot-scope="scope">
                  <span class="cursor blue">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="报销" name="second">
            <el-table :data="tableAccount" class="" :header-cell-style="getCostClass" border>
              <el-table-column prop="" label="报销单号" min-width="120"></el-table-column>
              <el-table-column prop="" label="状态" min-width="120"></el-table-column>
              <el-table-column prop="" label="发起时间" min-width="150"></el-table-column>
              <el-table-column prop="" label="该团期的报销金额" min-width="150"></el-table-column>
              <el-table-column prop="" label="申请人" min-width="80"></el-table-column>
              <el-table-column prop="" label="审批过程" min-width="70">
                <template slot-scope="scope">
                  <span class="cursor blue">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="收款" name="third">
            <el-table :data="tableCollection" class="" :header-cell-style="getCostClass" border>
              <el-table-column prop="" label="收款单号" min-width="120"></el-table-column>
              <el-table-column prop="" label="收款类型" min-width="120"></el-table-column>
              <el-table-column prop="" label="同业社名称" min-width="100"></el-table-column>
              <el-table-column prop="" label="状态" min-width="80"></el-table-column>
              <el-table-column prop="" label="收款时间" min-width="150"></el-table-column>
              <el-table-column prop="" label="团期计划" min-width="150"></el-table-column>
              <el-table-column prop="" label="订单号" min-width="120"></el-table-column>
              <el-table-column prop="" label="收款金额" min-width="80"></el-table-column>
              <el-table-column prop="" label="申请人" min-width="80"></el-table-column>
              <el-table-column prop="" label="审批过程" min-width="80">
                <template slot-scope="scope">
                  <span class="cursor blue">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="订单" name="fourth">
            <el-table :data="tableOrder" class="" :header-cell-style="getCostClass" border>
              <el-table-column prop="" label="订单ID" min-width="120"></el-table-column>
              <el-table-column prop="" label="联系人" min-width="120"></el-table-column>
              <el-table-column prop="" label="数量" min-width="180"></el-table-column>
              <el-table-column prop="" label="订单来源" min-width="100"></el-table-column>
              <el-table-column prop="" label="状态" min-width="80"></el-table-column>
              <el-table-column prop="" label="销售" min-width="80"></el-table-column>
              <el-table-column prop="" label="订单金额" min-width="120"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- </div> -->
    <!-- </div> -->
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
      tableData2:[],
      //下单弹窗
      average:0,
      dialogFormOrder: false,
      ruleForm: {
        orderRadio: "1",
        sale: "",
        travel: "",
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
      //游客信息
      quota: [], //余位信息负数红色提示
      enrolNum: [], //报名人数[1,3]形式
      enrolNums: false, //报名人数是否为空提示
      enrolNumsWarn: "",
      dialogFormTour: false,
      salePrice: [], //报名类型价格列表数据
      salePriceNum: [], //报名类型价格列表数据副本,显示余位用
      tourType: 0, //报名类型索引
      fillIndex: 0, //报名类型下游客list索引
      preLength: [], //记录上一次报名人数[1,3]形式
      tour: [], //总游客信息,二维数组
      winTitle: "", //弹窗标题
      conForm: {
        id: 0,
        isDeleted: 0,
        code: "",
        cnName: "",
        enName: "",
        sex: "",
        mobile: "",
        idCard: "", //身份证
        bornDate: 0,
        credType: 0,
        credCode: "",
        credTOV: "",
        orderID: 0,
        orderCode: "string",
        orgID: sessionStorage.getItem("orgID"),
        userID: sessionStorage.getItem("id")
      },
      //下单成功弹窗
      orderSuc: false,
      //团期计划订单信息
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
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入联系人电话", trigger: "blur" }
        ],
        //游客信息
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
        idCard: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          {
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "身份证号格式不正确",
            trigger: "blur"
          }
        ],
        credTOV:[{ required: true, message: "请选择证件有效期", trigger: "blur" }],
        
      },
      //出行人信息表格
      costList:[],
      detailsDialog:false,//详情弹窗
      activeName:'first',//财务信息切换
      tableBorrowing:[],//借款表格
      tableAccount:[],//报销表格
      tableCollection:[],//收款表格
      tableOrder:[],//订单表格
    };
  },
  created() {
  },
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
      }else if(this.dialogType == 2){
        setTimeout(() => {
          console.log(this.planId)
          this.teamGetDetails(this.planId);
        }, 200);
        this.detailsDialog =true;
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
    }
  },
  methods: {
    moment,
    detailsCancel(){//详情取消弹窗
      this.detailsDialog = false;
      this.tableBorrowing = [];//借款表格
      this.tableAccount = [];//报销表格
      this.tableCollection = [];//收款表格
      this.tableOrder = [];//订单表格
    },
    getCostClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f6f6f6;height:25px;textAlign:center;fontSize:15px";
      } else {
        return "";
      }
    },
    changeQuota() {
      //余位变化方法
      this.salePrice = JSON.parse(JSON.stringify(this.salePriceNum));
      let salePriceType3 = JSON.parse(JSON.stringify(this.salePriceNum));
      let salePriceType = {};
      //下单方式选择确认占位和预定占位，实时减少相关余位信息，提示库存不足
      for (let i = 0; i < this.salePrice.length; i++) {
        //如果下单方式选择预定不占，则不需要同步余位信息，提示库存不足
        if (this.ruleForm.type == 1 || this.ruleForm.type == 2) {
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
          //判断是否显示库存不足
          this.quota[i] = true;
        } else {
          this.quota[i] = false;
        }
      }
    },
    //详情弹窗
    teamGetDetails(ID){
      //团期计划订单信息预览
      console.log(ID)
      this.$http.post(this.GLOBAL.serverSrc + "/teamquery/get/api/teampreview", {
        id: ID
      }).then(res => {
          if (res.data.isSuccess == true) {
            this.teampreviewData = res.data.object;
            this.getBorrowing(this.planId);
            this.teamEnrolls(this.planId);
          }
        });
    },
    //获取参考结算价
    getaverage(ID) {
      this.$http.post(this.GLOBAL.serverSrc + '/team/cost/api/getaverage', {
        "id": ID
      }).then(res => {
        this.average = res.data.average;
      })
    },
    teampreview(ID) {
      this.getaverage(ID);
      //团期计划订单信息预览
      console.log(ID)
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
      //获取报名类型列表数据
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
                //如果配额为0或者配额大于库存，余位显示总库存
                data[i].quota = this.teampreviewData.remaining;
              }
            }
            this.salePrice = data;
            this.salePriceNum = data;
          }
        });
    },
    peoNum(index, enrollID, enrollName) {
      //填写报名人数
      let arrLength; //报名人数
      let preLength; //记录上一次报名人数
      preLength = this.preLength[index]; //获取上一次报名人数
      arrLength = this.enrolNum[index]; //获取当前报名人数
      //如果填写数量大于余位，则显示余位数量
      if (arrLength > this.salePriceNum[index].quota) {
        this.enrolNum[index] = this.salePriceNum[index].quota;
        arrLength = this.salePriceNum[index].quota;
      }
      //记录上一次报名人数为当前报名人数
      this.preLength[index] = this.enrolNum[index];

      //去掉报名人数提示
      if (arrLength > 0) {
        this.enrolNums = false;
      } 
      var len;
      if (arrLength > preLength) {
        //修改数量时，如果增加数量，直接填充数组，否则从数组末尾减去多余对象
        len = arrLength - preLength;
        for (var i = 0; i < len; i++) {
          this.costList.push({
            enrollID: enrollID,
            enrollName: enrollName,
            name : '姓名',
            type : enrollName,
            phone : '',
            IDcard : '',
            sex : '',
            id: 0,
            isDeleted: 0,
            code: "string",
            idCard: "string",
            singlePrice: 0,
            mobile: "string",
            bornDate: 0,
            credType: 0,
            credCode: "string",
            credTOV: 0,
            orderID: 0,
            orderCode: "string",
            orgID: 0,
            userID: 0
          });
        }
      } else {
        this.costList.splice(arrLength - preLength, preLength - arrLength);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        //如果库存不足，不提交订单
        var blooen = "0";
        for (let i = 0; i < this.quota.length; i++) {
          if (this.quota[i] == true) {
            blooen = "1";
          }
        }
        if (blooen == "1") {
          return false;
        }
        //获取报名总人数
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
        let guestAll = []; //游客信息格式转换
        if (valid) {
          for (let i = 0; i < this.tour.length; i++) {
            for (let j = 0; j < this.tour[i].length; j++) {
              guestAll.push(this.tour[i][j]);
            }
          }
          let guest = [];
          for (let i = 0; i < guestAll.length; i++) {
            if (guestAll[i].cnName != "点击填写") {
              //过滤掉未填写人员信息
              guest.push(guestAll[i]);
              guest[i].bornDate = new Date(guest[i].bornDate).getTime(); //时间格式转换
              guest[i].credTOV = new Date(guest[i].credTOV).getTime();
            } else {
              guest.push(guestAll[i]);
            }
          }
          //防止重复提交订单判断
          if (this.ifOrderInsert == false) {
            return false;
          }
          // 拼接字段 enrollDetail报名类型详情
          let enrollDetail = "";
          this.salePrice.forEach((ele, idx) => {
            let price = this.toDecimal2(ele.price_01);
            enrollDetail = `${ele.enrollName} ( ${price} * ${this.enrolNum[idx]} )`;
          });
          this.ifOrderInsert = false;
          this.$http.post(this.GLOBAL.serverSrc + "/order/all/api/orderinsert", {
              object: {
                id: 0,
                isDeleted: 0,
                code: "",
                orderCode: "",
                proID: this.teampreviewData.teamID,
                planID: this.planId,
                orderStatus: 0, //订单状态  7未确认
                refundStatus: 0, //退款状态
                occupyStatus: this.ruleForm.type, //占位状态
                payable: this.ruleForm.totalPrice, //应付款
                platform: 1, //1是erp，2是同业
                favourable: [
                  //优惠
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
                    price: this.ruleForm.allDiscount,
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
                  this.ruleForm.type == 1
                    ? 0
                    : new Date().getTime() / 1000 + 24 * 60 * 60,
                orderChannel: Number(this.ruleForm.orderRadio),
                orgID: sessionStorage.getItem("orgID"),
                userID: sessionStorage.getItem("id"),
                remark: JSON.stringify([
                  {
                    OrderCode: "",
                    Mark: this.ruleForm.remark,
                    CreateTime: formatDate(new Date())
                  }
                ]),
                guests: guest,
                number: number,
                enrollDetail: enrollDetail //报名类型详情字段拼接  订单管理模块需要
              }
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                this.$message.success("提交成功");
                let data = JSON.parse(res.data.result.details);
                this.orderCode = data.OrderCode;
                //需再次存储备注信息
                this.addComment(this.orderCode);
                this.orderSuc = true;
                //清空表单
                this.$refs[formName].resetFields();
                this.dialogFormOrder = false;
                this.ifOrderInsert = true;
                this.startUpWorkFlowForJQ(
                  data.OrderID,
                  data.FlowModel,
                  data.FlowModelName,
                  data.Usercode
                );
              } else {
                //预留黑名单信息？？？
                this.$message.error("下单失败");
                this.ifOrderInsert = true;
              }
            });
        } else {
          console.log("error submit!!");
          this.ifOrderInsert = true;
          return false;
        }
      });
    },
    // 下单弹窗 的提交按钮成功后  需再把备注信息存到/orderquery/get/api/InserOrderComment
    addComment(orderCode) {
      this.$http.post(this.GLOBAL.serverSrc + "/orderquery/get/api/InserOrderComment", {
          object: {
            orderCode: orderCode,
            content: this.ruleForm.remark,
            createTime: moment()
              .format("YYYY-MM-DD hh:mm:ss")
              .toString()
          }
        })

        .then(res => {

        })
        .catch(err => {
          console.log(err);
        });
    },
    // 整数转浮点数
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
    //启动工作流
    startUpWorkFlowForJQ(OrderID, FlowModel, FlowModelName, Usercode) {
      this.$http
        .post(this.GLOBAL.jqUrl + "/api/JQ/StartUpWorkFlowForJQ", {
          jQ_ID: OrderID,
          jQ_Type: FlowModel,
          workflowCode: FlowModelName,
          userCode: Usercode
        })
        .then(res => {
          this.submitWAForJQ(Usercode, JSON.parse(res.data).data.workItemID);
        });
    },
    //提交工作任务
    submitWAForJQ(Usercode, workItemID) {
      this.$http
        .post(this.GLOBAL.jqUrl + "/api/JQ/SubmitWorkAssignmentsForJQ", {
          userCode: Usercode,
          workItemID: workItemID,
          commentText: "测试"
        })
        .then(res => {});
    },
    delTravel(type, index){//删除单条表格数据

    },
    fillTravel(type, index){//点击出行人信息表格编辑显示弹窗
      console.log(this.enrollName)
      this.winTitle = this.costList[0].enrollName; //编辑游客信息弹窗标题
      this.tourType = type;
      this.fillIndex = index;
      this.dialogFormTour = true;

    },
    // fillTour(type, index) {
    //   this.winTitle = this.salePrice[type].enrollName; //编辑游客信息弹窗标题

    //   if (this.tour[type][index].cnName != "点击填写") {
    //     this.conForm = JSON.parse(JSON.stringify(this.tour[type][index])); //如果已填完信息，把信息显示出来
    //   }
    //   this.tourType = type;
    //   this.fillIndex = index;
    //   this.dialogFormTour = true;
    // },
    ensure(formName){//出行人弹窗添加完保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.tourType)
          let guest = JSON.parse(JSON.stringify(this.conForm));
          if (this.ruleForm.price == 1) {
            guest.singlePrice = this.costList[this.tourType].price_01; //填充价格
          } else {
            guest.singlePrice = this.costList[this.tourType].price_02;
          }
          this.costList[this.tourType][this.fillIndex] = guest;
          this.dialogFormTour = false;
          this.$refs[formName].resetFields();
        }
      });
    },
    subInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let guest = JSON.parse(JSON.stringify(this.conForm));
          guest.enrollID = this.salePrice[this.tourType].enrollID; //填充报名类型
          guest.enrollName = this.salePrice[this.tourType].enrollName; //填充报名类型name
          // guest.enrollNum = this.
          // guest.createTime = this.createTime
          if (this.ruleForm.price == 1) {
            guest.singlePrice = this.salePrice[this.tourType].price_01; //填充价格
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
      this.costList = [] ;
    },
    compPrice() {
      //计算总价
      this.ruleForm.totalPrice = 0;
      for (let i = 0; i < this.enrolNum.length; i++) {
        console.log(this.enrolNum[i])
        this.ruleForm.totalPrice += (this.enrolNum[i] == undefined ? 0 : this.enrolNum[i]) * (this.ruleForm.price == 1 ? this.salePrice[i].price_01 : this.salePrice[i].price_02);
      }
      this.ruleForm.totalPrice += parseInt(
        this.ruleForm.otherCost ? this.ruleForm.otherCost : 0
      );
      this.ruleForm.totalPrice -= parseInt(
        this.ruleForm.allDiscount ? this.ruleForm.allDiscount : 0
      );
    },
    //商户名称模糊查询
    querySearch3(queryString3, cb) {
      this.tableData2 = []
      this.$http.post(this.GLOBAL.serverSrc + '/universal/localcomp/api/list', {
        "object": {
          name: queryString3,
          isDeleted: 0
        }
      }).then(res => {
        for (let i = 0; i < res.data.objects.length; i++) {
          this.tableData2.push({
            "value": res.data.objects[i].name,
            "id": res.data.objects[i].id,
            "supplierType": res.data.objects[i].supplierType
          })
          this.supplier_id = res.data.objects[i].id ? res.data.objects[i].id : 0;
        }
        var results = queryString3 ? this.tableData2.filter(this.createFilter(queryString3)) : [];
        cb(results)
      }).catch(err => {
        //console.log(err);
      })
    },
    createFilter(queryString1){
      return (restaurant) => {
        return (restaurant.value);
      }
    },
    departure(item){
      console.log(item)
      //this.ruleForm.planType = item.supplierType//供应商名称和借款类型关联
      /*this.productPos = item.id;
      this.originPlace = item.value;*/
      this.productPos = item.id;
      this.originPlace = item.value;
    },
    //订单来源切换清空相应下的文本框内容
    changeTab(){
      if(this.ruleForm.orderRadio==1){
        this.ruleForm.travel = '';
      }
    },
    //详情借款表格
    getBorrowing(val){
      var that = this
      console.log(this.planId)
      that.$http.post(this.GLOBAL.serverSrc + '/finance/payment/api/list', {
        "object": {
          "planID": this.planId,
        }
      }).then(res => {
        if (res.data.isSuccess == true) {
          that.tableBorrowing = res.data.objects
          that.tableBorrowing.forEach(function (v,k,arr) {
              if(arr[k]['checkType'] == 0){
                arr[k]['checkType'] = '审批中'
              }else if(arr[k]['checkType'] == 1) {
                arr[k]['checkType'] = '通过'
              }else if(arr[k]['checkType'] == 2) {
                arr[k]['checkType'] = '驳回'
              }
              if(arr[k]['supplierType'] == 1){
                arr[k]['supplierType'] = '地接'
              }else if(arr[k]['supplierType'] == 2) {
                arr[k]['supplierType'] = '机票（本公司）'
              }else if(arr[k]['supplierType'] == 3) {
                arr[k]['supplierType'] = '机票（非本公司）'
              }else if(arr[k]['supplierType'] == 4) {
                arr[k]['supplierType'] = '小费'
              }else if(arr[k]['supplierType'] == 5) {
                arr[k]['supplierType'] = '地接（其他）'
              }else if(arr[k]['supplierType'] == 6) {
                arr[k]['supplierType'] = '火车票'
              }else if(arr[k]['supplierType'] == 7) {
                arr[k]['supplierType'] = '汽车票'
              }else if(arr[k]['supplierType'] == 8) {
                arr[k]['supplierType'] = '船票'
              }else if(arr[k]['supplierType'] == 9) {
                arr[k]['supplierType'] = '其他'
              }else if(arr[k]['supplierType'] == 10) {
                arr[k]['supplierType'] = '机票押金'
              }else if(arr[k]['supplierType'] == 11) {
                arr[k]['supplierType'] = '火车票押金'
              }
          })
        }
      }).catch(err => {
        console.log(err)
      })

    },
  }
};
</script>

<style scoped>
/*下单弹窗团期信息样式*/
.planBorder{ border: 1px solid #ebebeb; border-radius: 5px; width: 95%;margin: 0 30px 10px 30px;font-size: 14px;line-height: 25px;}
.order-title {overflow: hidden;background: #f3f3f3; width: 100%; line-height: 40px;}
.order-title span{margin: 0 0 0 10px; font-size: 17px; color:#000;}
.pro-info {font-size: 14px;margin: 20px 30px 10px 10px;line-height: 30px;}
/*下单按钮*/
.dialog-footer {position:absolute;top: 8px; right:15px;}
/*下单弹窗价格选择样式*/
.salesPrice{margin: -3px 0 0 0;}
/*出行人信息表格样式*/
.travelMessage{ line-height: 40px; margin: 0 0 0 10px;font-size: 17px;}
.blue {color: #2e94f9;}
.cursor {cursor: pointer;}
.costTable{width:800px; margin: 0 0 0 2px;}
/*详情样式*/
.detail{ position: absolute;right: 15px; top: 8px; }
.detailsTitle{font-size: 18px; margin: 20px 0 20px 0;}
.checkType{padding: 0 5px; width:50px; border-radius:5px; color:#fff; line-height:30px; text-align:center;}
/*下单弹窗*/
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
</style>