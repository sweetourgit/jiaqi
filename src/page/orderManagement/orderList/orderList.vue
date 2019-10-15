<template>
  <div>
    <div class="demo-input-suffix">
      <!--搜索-->
      <span class="search-title">订单ID</span>
      <el-input v-model="orderCode" class="input" @blur="orderCodeBlur()"></el-input>
      <!-- <span class="search-title">产品ID</span>
      <el-input v-model="teamID" class="input"></el-input>-->
      <span class="search-title">产品名称</span>
      <el-input v-model="name" class="input" @blur="nameBlur()"></el-input>
      <span class="search-title">下单日期</span>
      <el-date-picker v-model="beginDate" type="date" placeholder="开始日期" class="start-time" @blur="beginDateBlur()" @change="endDateChange()"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="endDate" type="date" placeholder="终止日期" class="start-time" @blur="endDateBlur()" @change="endDateChange()"></el-date-picker>
      <br />
      <span class="search-title">团期计划</span>
      <el-input v-model="groupCode" class="input" @blur="groupCodeBlur()"></el-input>
      <span class="search-title">出发地</span>
      <el-autocomplete
        class="input"
        v-model="pod"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        @select="handlePod"
        @blur="podBlur()"
      ></el-autocomplete>
      <span class="search-title">目的地</span>
      <el-autocomplete
        class="input"
        v-model="destination"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        @select="departure"
        @blur="destinationBlur()"
      ></el-autocomplete>
      <br />
      <span class="search-title">商户名称</span>
      <el-input v-model="localCompName" class="input" @blur="localCompNameBlur()"></el-input>
      <span class="search-title">销售</span>
      <el-input v-model="saler" class="input" @blur="salerBlur()"></el-input>
      <span class="search-title">订单联系人</span>
      <el-input v-model="contact" class="input" @blur="contactBlur()"></el-input>
      <!-- <span class="search-title">产品类型</span>
          <el-select v-model="productType" placeholder="请选择"  class="sec-type">
             <el-option v-for="item in proType" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select><br>-->
      <!--订单状态-->
      <br />
      <div class="status-title">订单状态</div>
      <ul class="order-status">
        <!-- <li
          v-for="(item,index) in orderStatusSearch"
          :key="index"
          @click="statusTab(1,index,item.status)"
          v-bind:class="{statusbg: orderNum==index}"
        >{{item.name}}</li>-->
        <li @click="statusTab(1,0,0)" v-bind:class="{statusbg: orderNum==0}">
          全部
          (<span>{{ orderStateAllNum.allNumber }}</span>)
        </li>
        <li @click="statusTab(1,1,7)" v-bind:class="{statusbg: orderNum==1}">
          未确认
          (<span>{{orderStateAllNum.unconfirmedNumber}}</span>)
        </li>
        <li @click="statusTab(1,2,1)" v-bind:class="{statusbg: orderNum==2}">
          补充资料
          (<span>{{orderStateAllNum.materialNumber}}</span>)
        </li>
        <li @click="statusTab(1,3,8)" v-bind:class="{statusbg: orderNum==3}">
          签署合同
          (<span>{{orderStateAllNum.signContractNumber }}</span>)
        </li>
        <li @click="statusTab(1,4,4)" v-bind:class="{statusbg: orderNum==4}">
          出行中
          (<span>{{orderStateAllNum.travelingNumber}}</span>)
        </li>
        <li @click="statusTab(1,5,5)" v-bind:class="{statusbg: orderNum==5}">
          待点评
          (<span>{{orderStateAllNum.evaluationNumber}}</span>)
        </li>
        <li @click="statusTab(1,6,6)" v-bind:class="{statusbg: orderNum==6}">完成订单</li>
        <li @click="statusTab(1,7,9)" v-bind:class="{statusbg: orderNum==7}">作废订单</li>
      </ul>
      <br />
      <!--退款状态-->
      <!-- <div class="status-title">退款状态</div> -->
      <ul class="order-status" style="margin-left:90px">
        <!-- <li
          v-for="(item,index) in refundStatusSearch"
          :key="index"
          @click="statusTab(2,index,item.status)"
          v-bind:class="{statusbg: refundNum==index}"
        >{{item.name}}</li> -->
        <li @click="statusTab(2,0,5)" v-bind:class="{statusbg: refundNum==0}">
          申请退款
          (<span>{{orderStateAllNum.applyNumber}}</span>)
        </li>
        <li @click="statusTab(2,1,1)" v-bind:class="{statusbg: refundNum==1}">
          退款中
          (<span>{{orderStateAllNum.refundingNumber}}</span>)
        </li>
        <li @click="statusTab(2,2,6)" v-bind:class="{statusbg: refundNum==2}">完成退款</li>
        <li @click="statusTab(2,3,2)" v-bind:class="{statusbg: refundNum==3}">拒绝退款</li> 
      </ul>
      <br />
      <el-button type="primary" class="search-but" @click="orderPage(1,pageSize)">搜索</el-button>
      <el-button type="primary" class="search-but" @click="handleReset">重置</el-button>
      <!--订单列表-->
      <div class="pro-info" v-for="(item,index) in orderpage" :key="index">
        <h3>{{item.name}}</h3>
        <table cellpadding="5">
          <!-- <tr>
            <td width="60" class="tr">订单ID</td>
            <td>{{item.orderCode}}</td>
            <td width="60" class="tr">产品ID</td>
            <td width="220">{{item.teamID}}</td>
            <td width="85" class="tr">订单状态</td>
            <td width="90">{{getOrderStatus(item.orderStatus)}}</td>
            <td width="60" class="tr">退款状态</td>
            <td width="60">{{getrefundStatus(item.refundStatus)}}</td>
            <td width="60" class="tr">订单时间</td>
            <td>{{formatDate(new Date(item.createTime))}}</td>
          </tr>
          <tr>
            <td width="60" class="tr">产品名</td>
            <td colspan="9">{{item.name}}</td>
          </tr>
          <tr>
            <td width="60" class="tr">套餐名称</td>
            <td colspan="3">{{item.package}}</td>
            <td width="60" class="tr">团号</td>
            <td colspan="5">{{item.groupCode}}</td>
          </tr>
          <tr>
            <td width="60" class="tr">应付</td>
            <td>{{item.payable}}</td>
            <td width="60" class="tr">电话</td>
            <td rowspan="2" valign="top">{{item.contactTel}}</td>
            <td width="60" class="tr">优惠</td>
            <td colspan="4" rowspan="2" valign="top">{{item.favTitle}}</td>
            <td rowspan="2">&nbsp;</td>
          </tr>
          <tr>
            <td width="60" class="tr">已付</td>
            <td>{{item.paid}}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td width="60" class="tr">平台</td>
            <td>苹果</td>
            <td width="60" class="tr">支付方式</td>
            <td>微信支付</td>
            <td width="60" class="tr">订单来源</td>
            <td colspan="3">xxx旅行社</td>
            <td width="60" class="tr">销售</td>
            <td>{{item.saler}}</td>
          </tr>
          <tr>
            <td width="60" class="tr">用户姓名</td>
            <td>{{item.contactName}}</td>
            <td width="60" class="tr"></td>
            <td></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>-->
          <tr>
            <td class="tr moneyColor">
              订单总额&nbsp;&nbsp;
              <span class="normal">{{toDecimal2(item.payable)}}</span>
            </td>
            <td class="tr moneyColor">
              已付金额 &nbsp;&nbsp;
              <span class="normal">{{toDecimal2(item.paid)}}</span>
            </td>
          </tr>
          <tr>
            <td class="tr">订单ID</td>
            <td>{{item.orderCode}}</td>
            <div class="tableCenter">
              <td class="tr">团期计划</td>
              <td>{{item.groupCode}}</td>
            </div>
            <td class="tr">订单时间</td>
            <td>{{formatDate(new Date(item.createTime))}}</td>
          </tr>
          <tr>
            <td class="tr">套餐名称</td>
            <td>{{item.package}}</td>
            <div class="tableCenter">
              <td class="tr">出发地</td>
              <td>{{item.pod}}</td>
            </div>
            <td class="tr">目的地</td>
            <td>{{item.destination}}</td>
          </tr>
          <tr>
            <td class="tr">出发日期</td>
            <td>{{formatDate(new Date(item.createTime))}}</td>
            <div class="tableCenter">
              <td class="tr">电话</td>
              <td valign="top">{{item.contactTel}}</td>
            </div>
            <td class="tr">产品类型</td>
            <!-- <td valign="top">{{item.productType}}</td> -->
            <td valign="top">跟团游</td>
          </tr>
          <tr>
            <td class="tr">联系人</td>
            <td valign="top">{{item.contactName}}</td>
            <div class="tableCenter">
              <td class="tr">数量</td>
              <td valign="top">{{item.enrollDetail}}</td>
              <!-- <td valign="top">{{item.number}}</td> -->
            </div>
            <td class="tr">其他费用</td>
            <td valign="top">{{item.otherTitle}} (<span>{{toDecimal2(item.otherPrice)}}</span>) </td>
          </tr>
          <tr>
            <td class="tr">优惠</td>
            <td valign="top">{{toDecimal2(item.entiretyFav)}}</td>
            <div class="tableCenter">
              <td class="tr">销售</td>
              <td valign="top">{{item.saler}}</td>
            </div>
            <td class="tr">订单来源</td>
            <td>{{item.orderChannel}}</td>
          </tr>
          <tr>
            <!-- <td class="tr">优惠活动</td>
            <td valign="top">{{item.favTitle}}</td> -->
            <td class="tr">支付方式</td>
              <td>微信支付</td>
            <div class="tableCenter">
              <td class="tr">操作</td>
              <td valign="top">{{item.op}}</td>
            </div>
            <td class="tr">商户销售</td>
            <td valign="top"></td>
          </tr>
          <tr>
            <td class="tr">平台</td>
            <td valign="top">{{item.platform}}</td>
          </tr>
        </table>
        <!-- <div class="confirm-time">
          待确认剩余
          <span>1天22:33:33</span>
        </div>-->
        <!-- <el-row class="but-row">
          <el-button>联系客人</el-button>
          <el-button @click="operation(item.id,1)">流程管理</el-button>
          <el-button @click="operation(item.id,2)">备注信息</el-button>
          <el-button>未申请退款</el-button>
          <el-button @click="operation(item.id,4)">转团</el-button>
        </el-row>-->
        <el-breadcrumb separator="|" class="confirm-time">
          <el-breadcrumb-item class="breadCrumbPointer">联系客人</el-breadcrumb-item>
          <el-breadcrumb-item class="breadCrumbPointer" @click.native="operation(item.id,2,item.orderCode)">备注</el-breadcrumb-item>
          <el-breadcrumb-item class="breadCrumbPointer">收款</el-breadcrumb-item>
          <!-- <el-breadcrumb-item class="breadCrumbPointer" @click.native="operation(item.id,4)">转团</el-breadcrumb-item> -->
          <el-breadcrumb-item class="breadCrumbPointer" @click.native="operation(item.id,1,item.orderCode)">流程管理</el-breadcrumb-item>
          <el-breadcrumb-item class="breadCrumbPointer">活动详情</el-breadcrumb-item>
          <el-breadcrumb-item class="breadCrumbPointer">未申请退款</el-breadcrumb-item>
          <!-- <el-breadcrumb-item class="breadCrumbPointer">
            <el-select v-model="breadcrumbSelectValue">
              <el-option
                v-for="item in breadcrumbOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-breadcrumb-item>-->
        </el-breadcrumb>
        <div class="but-row">
          <span class="dotFather">
            <span class="dot"></span>
            <span>{{item.occupyStatus}}</span>
          </span>
          <!--  -->
          <span v-if="item.occupyStatus !== '确认占位'">
            待确认剩余 &nbsp;
            <span class="moneyColor">1天22:33:33</span>
          </span>
        </div>
      </div>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        background
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <process-manage
        :orderId="orderId"
        :variable="variable"
        :dialogType="dialogType"
        :orderCode="orderCode"
        @orderPage="orderPage"
      ></process-manage>
      <remarks-infor :orderId="orderId" :variable="variable" :dialogType="dialogType" :orderCode="orderCode"></remarks-infor>
      <order-transfer :orderId="orderId" :variable="variable" :dialogType="dialogType"></order-transfer>
    </div>
  </div>
</template>

<script>
import processManage from "./common/processManage";
import remarksInfor from "./common/remarksInfor";
import orderTransfer from "./common/orderTransfer";
import moment from "moment"
export default {
  components: {
    "process-manage": processManage,
    "remarks-infor": remarksInfor,
    "order-transfer": orderTransfer
  },
  data() {
    return {
      orderStatusSearch: [
        { status: 0, name: "全部" },
        { status: 7, name: "未确认" },
        { status: 1, name: "补充资料" },
        { status: 8, name: "签署合同" },
        { status: 4, name: "出行中" },
        { status: 5, name: "待点评" },
        { status: 6, name: "完成订单" },
        { status: 9, name: "作废订单" }
      ],
      orderNum: "0",
      orderStatus: 0,
      refundStatusSearch: [
        // { status: 0, name: "全部" },
        { status: 5, name: "申请退款" },
        { status: 1, name: "退款中" },
        { status: 6, name: "完成退款" },
        { status: 2, name: "拒绝退款" }
      ],
      refundStatus: 0,
      refundNum: "0",
      orderCode: "", //订单ID
      teamID: "", //产品ID
      groupCode: "", //团期计划ID
      beginDate: "",
      endDate: "",
      groupCode: null, //团期计划
      name: "", //产品名称
      podID: "", //出发地
      pod: "", //出发地
      destinationID: "", //目的地
      destination: "", //目的地
      saler: "", //销售
      otherPrice: "", //其他费用名称
      platform: null, //平台 1 ERP系统  2 同业系统
      productType: "", //产品类型  Team = 1 跟团游 Free = 2 自由行
      localCompName: "", //商户名称
      contact: "", //订单联系人
      orderChannel: null, //订单来源  1 线上直客 2 线下直客 3 同业系统
      whichStateTab: null, //判断tab是从1 还是2 过来的
      // breadcrumbSelectValue: "更多", //面包屑更多默认
      // breadcrumbOptions: [
      //   {
      //     value: "0",
      //     label: "活动详情"
      //   },
      //   {
      //     value: "1",
      //     label: "未申请退款"
      //   }
      // ],
      proType: [
        {
          value: "0",
          label: "跟团游"
        } /*, {
          value: '1',
          label: '自由行'
        }, {
          value: '2',
          label: '签证'
        }, {
          value: '3',
          label: '邮轮'
        }, {
          value: '4',
          label: '周边游'
       }*/
      ],
      //订单列表
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      total: 0,
      orderpage: [],
      orderId: 0,
      variable: 0, //设置一个变量展示弹窗
      dialogType: 0, //弹窗类型  1：流程管理  2：备注信息
      orderCode:"",//订单编号
      orderStateAllNum: {} //订单状态 每个按钮的数量下标
    };
  },
  watch: {
    destination: function(val) {
      if (this.destination == "") {
        this.destinationID = 0;
      }
    }
  },
  created() {
    this.orderPage();
  },
  methods: {
    moment,
    //目的地
    querySearch(queryString, cb) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/area/api/fuzzy", {
          object: {
            areaName: queryString
          }
        })
        .then(res => {
          // console.log("出发地目的地", res);
          let tableData = [];
          for (let i = 0; i < res.data.objects.length; i++) {
            tableData.push({
              value: res.data.objects[i].areaName,
              id: res.data.objects[i].id
            });
          }
          var results = queryString
            ? tableData.filter(this.createFilter(queryString))
            : [];
          cb(results);
        })
        .catch(err => {
          console.log(err);
        });
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value;
      };
    },
    departure(item) {
      this.destinationID = item.id;
      this.destination = item.value;
    },
    handlePod(item) {
      this.podID = item.id;
      console.log(this.podID);
      this.pod = item.value;
    },
    statusTab(num, index, status) {
      console.log(num,"statusTab", status);
      if (num == 1) {
        this.whichStateTab = num;
        this.orderNum = index;
        this.orderStatus = status;
        this.orderPage(1, this.pageSize);
      }
      if (num == 2) {
        console.log("kkkk")
        this.whichStateTab = num;
        this.refundNum = index;
        this.refundStatus = status;
        this.orderPage(1, this.pageSize);
      }
    },
    //订单列表
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.orderPage(1, val);
    },
    handleCurrentChange(val) {
      this.orderPage(val, this.pageSize);
      this.pageIndex = val;
    },
    // 重置
    handleReset() {
      this.orderCode = ""; //订单ID
      this.teamID = ""; //产品ID
      this.groupCode = null; //团期计划ID
      this.beginDate = "";
      this.endDate = "";
      this.name = ""; //产品名称
      this.pod = ""; //出发地
      this.podID = ""; //出发地
      this.destinationID = ""; //目的地
      this.destination = ""; //目的地
      this.saler = ""; //销售
      this.otherPrice = "", //其他费用名称
      this.platform = null, //平台
      this.productType = ""; //产品类型
      this.localCompName = ""; //商户名称
      this.contact = ""; //订单联系人
      this.orderChannel = null; //订单来源
      this.orderPage(1, this.pageSize);
    },
    orderPage(
      pageIndex = this.pageIndex,
      pageSize = this.pageSize,
      orderCode = this.orderCode, //订单id
      name = this.name, //产品名称
      // teamID = this.teamID,
      // groupCode = this.groupCode, //团号
      groupCode = this.groupCode, //团期计划
      beginDate = this.beginDate,
      endDate = this.endDate,
      saler = this.saler, 
      localCompName = this.localCompName, //商户名称
      // productType = this.productType,
      orderStatus = this.orderStatus,
      refundStatus = this.refundStatus,
      destinationID = this.destinationID, //目的地
      contact = this.contact, //订单联系人
      podID = this.podID //出发地
    ) {
      if (beginDate) {
        let y = beginDate.getFullYear();
        let m =
          beginDate.getMonth() + 1 > 9
            ? beginDate.getMonth() + 1
            : "0" + (beginDate.getMonth() + 1);
        let d =
          beginDate.getDate() > 9
            ? beginDate.getDate()
            : "0" + beginDate.getDate();
        beginDate = "" + y + m + d;
      } else {
        beginDate = 0;
      }
      if (endDate) {
        let y = endDate.getFullYear();
        let m =
          endDate.getMonth() + 1 > 9
            ? endDate.getMonth() + 1
            : "0" + (endDate.getMonth() + 1);
        let d =
          endDate.getDate() > 9 ? endDate.getDate() : "0" + endDate.getDate();
        endDate = "" + y + m + d;
      } else {
        endDate = 0;
      }
      // console.log(beginDate,endDate)
      // if (this.whichStateTab == 1) {
      //   this.refundStatus =
      // } else {
      //   this.orderStatus = 11
      // }
      // console.log(orderStatus,refundStatus)
          this.orderpage = [];
      let object = {orderCode: orderCode,
            // teamID: teamID ? teamID : 0,
            // groupCode: groupCode,
            groupCode: groupCode,
            // beginDate: beginDate,
            // endDate: endDate,
            name: name,
            destinationID: destinationID ? destinationID : 0,
            saler: saler,
            // productType: productType ? productType : 0,
            orderStatus: this.orderStatus,
            refundStatus: this.refundStatus,
            contact: contact,
            podID: podID ? podID : 0,
            localCompName : localCompName, //商户名称
        }
      if (endDate !== 0 && beginDate !== 0) {
        // object.beginDate = beginDate
        // object.endDate = endDate
        object.beginDate = moment(beginDate).format('YYYY-MM-DD')
        object.endDate = moment(endDate).format('YYYY-MM-DD')
      }
      this.$http
        .post(this.GLOBAL.serverSrc + "/order/all/api/orderpage", {
          pageIndex: pageIndex,
          pageSize: pageSize,
          object: object
        })
        .then(res => {
          console.log("判断是否是 页面初始", res);
          // this.orderpage = [];
       
          this.total = res.data.total;
          if (res.data.isSuccess == true) {
            this.orderpage = res.data.objects;
            // console.log(this.orderpage,"doubao")
            if(res.data.objects !== null) {
              this.orderStateAllNum = res.data.objects[0];
              this.receiveDataJudgeShow();
            }
            
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 接收数据 判断显示
    receiveDataJudgeShow() {
        this.orderpage.forEach(item => {
          //占位状态
          if (item.occupyStatus == 1) {
            item.occupyStatus = "确认占位";
          } else if (item.occupyStatus == 2) {
            item.occupyStatus = "预订占位";
          } else {
            item.occupyStatus = "预订不占";
          }
          //订单来源
          if (item.orderChannel == 1) {
            item.orderChannel = "线上直客";
          } else if (item.orderChannel == 2) {
            item.orderChannel = "线下直客";
          } else {
            item.orderChannel = "同业系统";
          }
          //产品类型
          // if (item.productType == 1) {
          //   item.productType = "跟团游";
          // } else {
          //   item.productType = "自由行";
          // }

          // 下单平台
          if (item.platform == 1) {
            item.platform = "ERP系统";
          } else {
            item.platform = "同业系统";
          }
        });
    },
    orderCodeBlur () {
      if (this.orderCode == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    nameBlur () {
      if (this.name == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    beginDateBlur () {
      if (this.beginDate == "" && this.endDate == "" ) {
        this.orderPage(1, this.pageSize);
      }
    },
    endDateBlur () {
      if (this.beginDate == "" && this.endDate == "" ) {
        this.orderPage(1, this.pageSize);
      }
    },
    //判断结束时间不能在开始时间之前
    endDateChange () {
      let beginTime = moment(this.beginDate).format("YYYYMMDD")
      let entTime = moment(this.endDate).format("YYYYMMDD")
      if (this.beginDate !== "") {
          if (entTime < beginTime) {
          this.$message.error("结束时间不能早于开始时间")
          this.endDate = ""
        }
      }
    },
    groupCodeBlur () {
      if (this.groupCode == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    podBlur () {
      if (this.cdestination == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    destinationBlur () {
      if (this.destination == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    localCompNameBlur () {
      if (this.localCompName == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    salerBlur () {
      if (this.saler == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    contactBlur () {
      if (this.contact == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    //列表订单状态显示
    getOrderStatus(status) {
      switch (status) {
        case 1:
          return "补充游客材料";
          break;
        case 2:
          return "签订电子合同";
          break;
        case 3:
          return "待出行";
          break;
        case 4:
          return "旅行中";
          break;
        case 5:
          return "待评价";
          break;
        case 6:
          return "已完成";
          break;
        case 7:
          return "未确认";
          break;
        case 8:
          return "签署合同"; //？
          break;
        case 9:
          return "订单作废";
          break;
        case 10:
          return "订单确认";
          break;
      }
    },
    //列表退款状态显示
    getrefundStatus(status) {
      switch (status) {
        case 1:
          return "退款中";
          break;
        case 2:
          return "拒绝退款";
          break;
        case 3:
          return "已退款";
          break;
        case 4:
          return "无退款";
          break;
        case 5:
          return "申请退款";
          break;
        case 6:
          return "完成退款";
          break;
      }
    },
    formatDate(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    operation(orderId, i, orderCode) {
      this.orderId = orderId;
      console.log(orderId,orderCode)
      this.variable++;
      this.dialogType = i;
      this.orderCode = orderCode
    },
    //周边信息 整数转浮点数
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
  }
};
</script>

<style scoped>
.demo-input-suffix {
  width: 1150px;
}
.input {
  margin: 10px 5px;
  width: 145px;
}
.search-title {
  font-size: 14px;
  margin-left: 5px;
  display: inline-block;
  width: 75px;
  text-align: center;
}
.start-time {
  margin-left: 10px;
  width: 135px !important;
}
.date-line {
  width: 15px;
  border-bottom: 1px solid #e6e6e6;
  display: inline-block;
  margin: 0 -10px 3px 0;
}
.sec-type {
  margin-left: 10px;
}
.status-title {
  float: left;
  font-size: 14px;
  margin: 22px 0 0 15px;
  width: 75px;
}
.order-status {
  list-style-type: none;
  margin: 13px 0 0 0;
  display: inline-block;
  padding: 0;
  font-size: 14px;
  border: 1px solid #eaeaea;
  border-right: 0;
  line-height: 35px;
  overflow: hidden;
  text-align: center;
}
.order-status li {
  float: left;
  width: 120px;
  border-right: 1px solid #eaeaea;
  cursor: pointer;
}
.order-status li:first-child {
  width: 80px;
}
.search-but {
  margin: 20px 0 15px 10px;
}
.statusbg {
  background-color: #f6f6f6;
}
/*订单列表*/
.pro-info {
  font-size: 14px;
  background-color: #e4e4e4;
  margin: 0 30px 30px 10px;
  line-height: 25px;
  padding: 10px;
  width: 70%;
  min-width: 1120px;
}
.moneyColor {
  color: #ff0000;
}
.orderMoney {
  margin: 0;
  margin-left: 2px;
}
.normal {
  font-weight: normal;
}
.breadCrumbPointer {
  cursor: pointer;
}
.tableCenter {
  margin-left: 80px;
  margin-right: 80px;
}
.tr {
  /* text-align: right; */
  font-weight: bold;
}
.but-row {
  margin: 40px 0 20px 10px;
}
.but-row .el-button {
  border: 1px solid #2f95f9;
}
.confirm-time {
  float: right;
  margin-top: 46px;
  margin-right: 20px;
}

.pagination {
  text-align: center;
  margin: 50px 0;
}
.dotFather {
  margin-right: 16px;
}
.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  background-color: #7ec856;
  border-radius: 50%;
  margin-top: -2px;
  margin-right: 6px;
}
</style>