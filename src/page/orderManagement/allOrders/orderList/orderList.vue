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
      <el-date-picker
        v-model="beginDate"
        type="date"
        placeholder="开始日期"
        class="start-time"
        @blur="beginDateBlur()"
        @change="endDateChange()"
      ></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker
        v-model="endDate"
        type="date"
        placeholder="终止日期"
        class="start-time"
        @blur="endDateBlur()"
        @change="endDateChange()"
      ></el-date-picker>
      <br />
      <span class="search-title">团期计划</span>
      <el-input v-model="groupCode" class="input" @blur="groupCodeBlur()"></el-input>
      <!-- <span class="search-title">出发地</span>
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
      ></el-autocomplete>-->
      <!-- <br /> -->
      <span class="search-title por">
        商户名称
        <span v-if="isToast" class="poa">没有该商户名称</span>
      </span>
      <el-autocomplete
        class="input"
        v-model="orgIDValue"
        :fetch-suggestions="handleBusinessGet"
        :trigger-on-focus="false"
        @select="handleChooseOrgID"
        ref="orgIDValue"
        @blur="isToastFun"
      ></el-autocomplete>

      <!-- <span class="search-title">销售</span>
      <el-input v-model="saler" class="input" @blur="salerBlur()"></el-input>-->
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
        <li
          v-for="(item,index) in orderStatusSearch"
          :key="index"
          @click="statusTab(1,index,item.status)"
          v-bind:class="{statusbg: orderNum==index}"
        >{{item.name}}</li>
        <!-- <li @click="statusTab(1,0,0)" v-bind:class="{statusbg: orderNum==0}"> -->
        <!-- 全部 -->
        <!-- (
        <span>{{ orderStateAllNum.allNumber }}</span>)-->
        <!-- </li> -->
        <!-- <li @click="statusTab(1,1,7)" v-bind:class="{statusbg: orderNum==1}"> -->
        <!-- 未确认 -->
        <!-- (
        <span>{{orderStateAllNum.unconfirmedNumber}}</span>)-->
        <!-- </li> -->
        <!-- <li @click="statusTab(1,2,1)" v-bind:class="{statusbg: orderNum==2}"> -->
        <!-- 补充资料 -->
        <!-- (
        <span>{{orderStateAllNum.materialNumber}}</span>)-->
        <!-- </li> -->
        <!-- <li @click="statusTab(1,3,8)" v-bind:class="{statusbg: orderNum==3}"> -->
        <!-- 签署合同 -->
        <!-- (
        <span>{{orderStateAllNum.signContractNumber }}</span>)-->
        <!-- </li> -->
        <!-- <li @click="statusTab(1,4,4)" v-bind:class="{statusbg: orderNum==4}"> -->
        <!-- 出行中 -->
        <!-- (
        <span>{{orderStateAllNum.travelingNumber}}</span>)-->
        <!-- </li> -->
        <!-- <li @click="statusTab(1,5,5)" v-bind:class="{statusbg: orderNum==5}"> -->
        <!-- 待点评 -->
        <!-- (
        <span>{{orderStateAllNum.evaluationNumber}}</span>)-->
        <!-- </li>
        <li @click="statusTab(1,6,6)" v-bind:class="{statusbg: orderNum==6}">完成订单</li>
        <li @click="statusTab(1,7,9)" v-bind:class="{statusbg: orderNum==7}">作废订单</li>-->
      </ul>
      <br />
      <!--退款状态-->
      <!-- <div class="status-title">退款状态</div> -->
      <ul class="order-status" style="margin-left:90px">
        <li
          v-for="(item,index) in refundStatusSearch"
          :key="index"
          @click="statusTab(2,index,item.status)"
          v-bind:class="{statusbg: refundNum==index}"
        >{{item.name}}</li>
        <!-- <li @click="statusTab(2,0,5)" v-bind:class="{statusbg: refundNum==0}">
        申请退款-->
        <!-- (
        <span>{{orderStateAllNum.applyNumber}}</span>)-->
        <!-- </li>
        <li @click="statusTab(2,1,1)" v-bind:class="{statusbg: refundNum==1}">-->
        <!-- 退款中 -->
        <!-- (
        <span>{{orderStateAllNum.refundingNumber}}</span>)-->
        <!-- </li>
        <li @click="statusTab(2,2,6)" v-bind:class="{statusbg: refundNum==2}">完成退款</li>
        <li @click="statusTab(2,3,2)" v-bind:class="{statusbg: refundNum==3}">拒绝退款</li>-->
      </ul>
      <br />
      <el-button type="primary" class="search-but" @click="orderPage(1,pageSize)">搜索</el-button>
      <el-button type="primary" class="search-but" @click="handleReset">重置</el-button>
      <!--订单列表-->
      <div class="pro-info" v-for="(item,index) in orderpage" :key="index">
        <!-- 后加的折叠begin -->
        <h3>{{item.name}}</h3>
        <!-- <p class="tr moneyColor">
          订单总额&nbsp;&nbsp;
          <span class="normal">{{toDecimal2(item.payable)}}</span>
          已付金额 &nbsp;&nbsp;
          <span class="normal">{{toDecimal2(item.paid)}}</span>
        </p>-->
        <div class="contentHeader" @click="handleContentHeader(item,index)">
          <table>
            <tr>
              <td class="tr">订单ID&nbsp;&nbsp;</td>
              <td>{{item.orderCode}}</td>
              <div class="tableCenter">
                <td class="tr">团期计划&nbsp;&nbsp;</td>
                <td>{{item.groupCode}}</td>
              </div>
              <td class="tr">订单时间&nbsp;&nbsp;</td>
              <td>{{formatDate(new Date(item.createTime))}}</td>
            </tr>
            <tr>
              <td class="tr">联系人&nbsp;&nbsp;</td>
              <td valign="top">{{item.contactName}}</td>
              <div class="tableCenter">
                <td class="tr">电话&nbsp;&nbsp;</td>
                <td valign="top">{{item.contactTel}}</td>
              </div>
            </tr>
          </table>
          <!-- 点击一个其余不折叠 -->
          <!-- <i
            :class="['contentHeaderIcon', item.showContent == false ? 'el-icon-arrow-right': 'el-icon-arrow-down']"
          ></i>-->
          <!-- 点击一个其余折叠 -->
          <i
            :class="['contentHeaderIcon', showContent !== index ? 'el-icon-arrow-right': 'el-icon-arrow-down']"
          ></i>
        </div>

        <transition name="el-fade-in">
          <!-- 点击一个其余不折叠 -->
          <!-- <div class="contentBody" v-show="item.showContent"> -->
          <!-- 点击一个其余折叠 -->
          <div class="contentBody" v-show="showContent == index">
            <table>
              <tr>
                <td class="tr">套餐名称&nbsp;&nbsp;</td>
                <td class="longWeight">{{getListOneMessage.package}}</td>
                <div class="BodyTableCenter">
                  <td class="tr">出发地&nbsp;&nbsp;</td>
                  <td class="longWeight">{{getListOneMessage.pod}}</td>
                </div>
                <td class="tr">目的地&nbsp;&nbsp;</td>
                <td class="longWeight">{{getListOneMessage.destination}}</td>
              </tr>
              <tr>
                <td class="tr">出发日期&nbsp;&nbsp;</td>
                <td class="longWeight">{{getListOneMessage.date}}</td>
                <div class="BodyTableCenter">
                  <td class="tr">数量&nbsp;&nbsp;</td>
                  <td class="longWeight" valign="top">{{getListOneMessage.enrollDetail}}</td>
                </div>
                <td class="tr">产品类型&nbsp;&nbsp;</td>
                <td class="longWeight">跟团游</td>
              </tr>
              <tr>
                <td class="tr">整体优惠&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top">{{toDecimal2(getListOneMessage.entiretyFav)}}</td>
                <div class="BodyTableCenter">
                  <td class="tr">其他费用</td>
                  <td class="longWeight" valign="top">
                    {{item.otherTitle}} &nbsp;
                    <span>{{toDecimal2(getListOneMessage.otherPrice)}}</span>
                  </td>
                </div>
                <td class="tr">订单来源&nbsp;&nbsp;</td>
                <td class="longWeight">{{getListOneMessage.orderChannels}}</td>
              </tr>
              <tr>
                <td class="tr">支付方式&nbsp;&nbsp;</td>
                <td class="longWeight"></td>
                <div class="BodyTableCenter">
                  <td class="tr">操作&nbsp;&nbsp;</td>
                  <td class="longWeight" valign="top">{{getListOneMessage.op}}</td>
                </div>
                <td class="tr">商户销售&nbsp;&nbsp;</td>
                <td
                  class="longWeight"
                  valign="top"
                  v-if="getListOneMessage.orderChannel == 1"
                >{{getListOneMessage.saler}}</td>
                <td class="longWeight" valign="top" v-if="getListOneMessage.orderChannel !== 1"></td>
              </tr>
              <tr>
                <td class="tr">平台&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top">{{getListOneMessage.platform}}</td>
                <div class="BodyTableCenter">
                  <td class="tr">销售&nbsp;&nbsp;</td>
                  <td
                    class="longWeight"
                    valign="top"
                    v-html="getListOneMessage.orderChannel !== 1 ? getListOneMessage.saler : getListOneMessage.indirectSale"
                  ></td>
                  <td class="longWeight" valign="top" v-if="getListOneMessage.orderChannel == 1"></td>
                </div>
                <td class="tr">订单总额&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top">{{toDecimal2(getListOneMessage.payable)}}</td>
              </tr>
              <tr>
                <td class="tr">已付金额&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top">{{toDecimal2(getListOneMessage.paid)}}</td>
              </tr>
            </table>
            <el-breadcrumb separator="|" class="confirm-time">
              <!-- <el-breadcrumb-item class="breadCrumbPointer">联系客人</el-breadcrumb-item> -->
              <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,2)"
              >备注</el-breadcrumb-item>
              <!-- <el-breadcrumb-item class="breadCrumbPointer">收款</el-breadcrumb-item> -->
              <!-- <el-breadcrumb-item class="breadCrumbPointer" @click.native="operation(item.id,4)">转团</el-breadcrumb-item> -->
              <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,1)"
              >流程管理</el-breadcrumb-item>
              <!-- <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,3)"
              >出团通知书</el-breadcrumb-item> -->
              <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,5)"
              >退款</el-breadcrumb-item>
              <!-- <el-breadcrumb-item class="breadCrumbPointer">活动详情</el-breadcrumb-item> -->
              <!-- <el-breadcrumb-item class="breadCrumbPointer">未申请退款</el-breadcrumb-item> -->
            </el-breadcrumb>
            <div class="but-row">
              <span class="dotFather">
                <span class="dot"></span>
                <span>{{item.orderStatus}}</span>
              </span>
              <!--  -->
              <span v-if="item.occupyStatus == '预订不占' || item.occupyStatus == '预订占位'">
                待确认剩余 &nbsp;
                <span class="moneyColor">1天22:33:33</span>
              </span>
              <!--退款状态-->
              <span class="dotFather01" v-if="getListOneMessage.refundStatus !=0">
                <span class="dot"></span>
                <span>{{getrefundStatus(getListOneMessage.refundStatus)}}</span>
              </span>
            </div>
          </div>
        </transition>
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

      <!--出团通知书弹窗begin-->
      <el-dialog
        title="出团通知书"
        :visible.sync="dialogAdviceNote"
        :close-on-click-modal="false"
        width="780px"
        @open="getActiceNote"
        @close="closeActiceNote"
      >
        <div class="adviceNote">
          <el-upload
            class="uploadDemo"
            action
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            multiple
            :disabled="true"
            :file-list="fileList"
          >
            <span>出团通知书 :</span>
          </el-upload>
          <div class="adviceNoteBtn">
            <el-button type="info" @click="dialogAdviceNote = false">取消</el-button>
            <el-button type="primary" @click="$picDownloader(fileList[0].url,fileList[0].name)">下载</el-button>
            <!-- <el-button type="primary" @click="adviceNoteSend">发送</el-button> -->
          </div>
        </div>
      </el-dialog>
      <!--出团通知书弹窗end-->

      <process-manage
        :orderId="orderId"
        :variable="variable"
        :dialogType="dialogType"
        :orderCode="orderCode"
        :paid="getListOneMessage.paid"
        :priceType="priceType"
        :settlementType="getListOneMessage.settlementType"
        :balance="getListOneMessage.balance"
        :deposit="getListOneMessage.deposit"
        @orderPage="orderPage"
        @childByValue="childByValue"
      ></process-manage>
      <remarks-infor
        :orderId="orderId"
        :variable="variable"
        :dialogType="dialogType"
        :orderCodeSon="orderCodeSon"
      ></remarks-infor>
      <order-transfer :orderId="orderId" :variable="variable" :dialogType="dialogType"></order-transfer>
      <orderRefund :orderRefundID="orderId" :orderRefund="variable" :dialogType="dialogType" :orderRefundDialog="orderRefundDialog"></orderRefund>
    </div>
  </div>
</template>

<script>
import processManage from "./common/processManage";
import remarksInfor from "./common/remarksInfor";
import orderTransfer from "./common/orderTransfer";
import orderRefund from "@/page/Finance/refundManagement/refundDetails/orderInformation/orderRefund/orderRefund"
import moment from "moment";
export default {
  components: {
    "process-manage": processManage,
    "remarks-infor": remarksInfor,
    "order-transfer": orderTransfer,
    orderRefund
  },
  data() {
    return {
      orderRefundDialog: 0,//退款控制显示隐藏的 
      fileList: [], //出团通知书的图片
      defaultProps: {
        children: "children",
        label: "label"
      },
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
      orderNum: null,
      orderStatus: 0,
      refundStatusSearch: [
        // { status: 0, name: "全部" },
        { status: 5, name: "申请退款" },
        { status: 1, name: "退款中" },
        { status: 6, name: "完成退款" },
        { status: 2, name: "拒绝退款" }
      ],
      refundStatus: 0,
      refundNum: null,
      orderCode: "", //订单ID
      orderCodeSon: null, //传给子组件
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
      priceType: null, //价格类型  1直客  2同业价格
      // localCompName: "", //商户名称
      // orderChannels: "", //商户名称
      orgID: null, //商户名称搜索传给后台的id
      orgIDValue: "", //商户名称 搜索时显示的字段
      contact: "", //订单联系人
      orderChannel: null, //订单来源
      whichStateTab: null, //判断tab是从1 还是2 过来的
      enrollDetail: "", //报名信息传给后台的格式
      salePrice:[],//拼接空数组
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
        }
      ],
      //订单列表
      pageSize: 10, // 设定默认分页每页显示数 todo 具体看需求
      pageIndex: 1, // 设定当前页数
      total: 0,
      orderpage: [],
      orderId: 0,
      variable: 0, //设置一个变量展示弹窗
      dialogType: 0, //弹窗类型  1：流程管理  2：备注信息 3出团通知书
      orderCode: "", //订单编号
      orderStateAllNum: {}, //订单状态 每个按钮的数量下标
      getListOneMessage: {},
      showContent: null, //list折叠展示的
      businessLists: [], //商户名称下拉列表展示
      isToast: false, //商户名称模糊搜索 没有数据然后的提示语显示
      enrollDetailShow: "", //报名信息的数量
      dialogAdviceNote: false //出团通知书
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
    this.handleBusinessGet();
  },
  methods: {
    moment,
    // adviceNoteDown() {
    //   let a = document.createElement("a");
    //   a.download = this.fileList[0].name || "pic"; // 设置图片地址
    //   a.href = this.fileList[0].url;
    //   document.body.append(a);
    //   this.$nextTick(() => {
    //     a.click();
    //   });
    // },
   

    // adviceNoteDown() {
    //   let url = this.fileList[0].url;
    //   window.open(url);
    // },
    // 出团通知书的发送
    adviceNoteSend() {},
    handleRemove(file, fileList) {},
    handlePreview(file, fileList) {},
    //目的地
    querySearch(queryString, cb) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/area/api/fuzzy", {
          object: {
            areaName: queryString
          }
        })
        .then(res => {
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

    //商户名称模糊查询
    handleBusinessGet(queryString3, cb) {
      this.businessLists = [];
      this.$http
        .post(this.GLOBAL.serverSrc + "/universal/localcomp/api/list", {
          object: {
            name: queryString3,
            isDeleted: 0
          }
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            this.isToast = false;
            for (let i = 0; i < res.data.objects.length; i++) {
              this.businessLists.push({
                value: res.data.objects[i].name,
                id: res.data.objects[i].id
              });
            }
            let results = queryString3
              ? this.businessLists.filter(this.createFilter(queryString3))
              : [];

            cb && cb(results);
          } else {
            // this.orgIDValue = "";
            this.isToast = true;
            cb && cb([]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    createFilter(queryString1) {
      return restaurant => {
        return restaurant.value;
      };
    },
    // 搜索商户名称下拉选择事件
    handleChooseOrgID(item) {
      this.orgID = item.id;
    },
    // 商户名称input失去焦点的时候隐藏提示语 没有数据
    isToastFun() {
      this.isToast = false;
      this.orgIDValue = "";
      this.orgID = 0;
    },

    // 点击list列表中的一个
    handleContentHeader(item, index) {
      // let temp = this.orderpage;
      // temp[index].showContent = !temp[index].showContent;
      // this.orderpage = temp;
      if (this.showContent != index) {
        this.showContent = index;
        this.tour = {};
        this.axiosListOneInfo(item.id,item.planID);
      } else {
        this.showContent = null;
      }
    },
     // 请求list中的一个数据
    axiosListOneInfo(id,planID) {
      this.$http
        .post(this.GLOBAL.serverSrc + "/order/all/api/pageinfo", {
          id: id
        })
        .then(res => {
          // console.log("请求一条数据的",res)
          let enrolls=[];//标题
          let guest;//全部数据
          this.enrollDetailShow = "";
          this.getListOneMessage = res.data.object;
         // let enrollDetail = this.getListOneMessage.enrollDetail;
          // this.formatData(enrollDetail);
          // console.log(enrollDetail);
          // if (enrollDetail.substr(enrollDetail.length - 1, 1) == ",") {
          //   this.getListOneMessage.enrollDetail = enrollDetail.substring(
          //     0,
          //     enrollDetail.length - 1
          //   );
          // enrollDetail = enrollDetail.replace(/\s*/g, "");
          // let _arr = enrollDetail.split(",");
          // _arr.splice(_arr.length - 1, 1);
          // // console.log(_arr)
          // let _res = [];
          // _arr.sort();
          // for (let i = 0; i < _arr.length; ) {
          //   let count = 0;
          //   for (let j = i; j < _arr.length; j++) {
          //     if (_arr[i] == _arr[j]) {
          //       count++;
          //     }
          //   }
          //   _res.push([_arr[i], count]);
          //   i += count;
          // }
          // // console.log(_res)
          // //_res 二维数维中保存了 值和值的重复数
          // let _newArr = [];
          // for (let i = 0; i < _res.length; i++) {
          //   let a = _res[i][0].split("*");
          //   _newArr.push(a[0] + "x" + _res[i][1] + ")");
          // }
          // this.getListOneMessage.enrollDetail = _newArr.toString();
          // }

          let date = res.data.object.date.toString();
          this.getListOneMessage.date = moment(date).format("YYYY-MM-DD");
          this.orderCodeSon = res.data.object.orderCode;
          this.priceType = res.data.object.priceType;
          //订单来源
          // if (this.getListOneMessage.orderChannel == 1) {
          //   this.getListOneMessage.orderChannel = "同业";
          // } else if (this.getListOneMessage.orderChannel == 2) {
          //   this.getListOneMessage.orderChannel = "线上直客";
          // } else {
          //   this.getListOneMessage.orderChannel = "线下直客";
          // }

          // 下单平台
          if (this.getListOneMessage.platform == 1) {
            this.getListOneMessage.platform = "ERP系统";
          } else {
            this.getListOneMessage.platform = "同业系统";
          }
           //获取报名类型列表数据
          this.$http
            .post(this.GLOBAL.serverSrc + "/teamquery/get/api/enrolls", {
              id: planID
            })
            .then(res => {
              if (res.data.isSuccess == true) {
                    enrolls = res.data.objects;
                    guest= this.getListOneMessage.guests;
                    this.sourceMaker(enrolls,guest);
                    this.enrollDetailMaker();
                  }
              
            });
           
         })
        .catch(err => {
          console.log(err);
        });
    },
  
   sourceMaker(enrolls, guests){
        let salePriceReflect= this.salePriceReflect={};
        this.salePrice.splice(0);
        this.salePrice.push(
          ...enrolls.map((enroll, index) => {
            let result= [];
            result.enroll= enroll;
            // 收集所有相同报名类型的实例，只有当前存在的报名类型需要这个属性，不存在的报名类型肯定不可以新增实例了
            enroll.children= [];
            salePriceReflect[this.enrollKeyMaker(enroll)]= result;
            return result;
          })
        )
        guests.forEach(guest => {
          let { enrollName, singlePrice }= guest;
          let key= `${enrollName}_${singlePrice}`;
          // 不知道存不存在这个情况，过去有一个报名类型，但是现在没有了，这个时候hitEnroll为undefined
          // guest的报名类型不存在于当前enrolls
          salePriceReflect[key].push(guest); 
        })
        // 这里的el就是上边的salePriceReflect[key]
        this.salePrice.forEach(el => {
          el.enroll && el.enroll.children.push(el);
        });
      },
      //根据报名类型和价格类型返回key
      enrollKeyMaker(enroll){
         let { enrollName, price_01, price_02 }= enroll;
        return `${enrollName}_${price_01}`
      },
        // 报名信息
      enrollDetailMaker(){
        let str= '';
        let singlePrice;
        let count= 0;
        let price= 0;
        this.salePrice.forEach(el => {
          let { enrollName, price_01 }= el.enroll;
          singlePrice= price_01;
          str+= el.length? `[ ${enrollName} ${this.toDecimal2(singlePrice)} ] x ${el.length}\n`: '';
          price+= singlePrice* el.length;
          count+= el.length;
        })
        this.guestTotal= count;
        this.getListOneMessage.enrollDetail= str;
        //console.log( this.getListOneMessage.enrollDetail,'最后结果')
        return price;
      },
      
    // 整理数据报名信息的格式显示
    // formatData(origindata) {
    //   let data = JSON.parse(origindata);
    //   let keys = Object.keys(data);
    //   let [result, tempresult] = [[], []];
    //   keys.forEach(key => {
    //     let values = data[key];
    //     values.forEach(value => {
    //       tempresult.push({
    //         type: key,
    //         price: value[0],
    //         number: value[1]
    //       });
    //       result.push({
    //         type: key,
    //         price: value[0],
    //         number: 0
    //       });
    //     });
    //   });
    // this.tempresult = tempresult;
    //   result.forEach(res => {
    //     tempresult.forEach(tempres => {
    //       if (tempres.type == res.type && tempres.price == res.price) {
    //         res.number += tempres.number;
    //       }
    //     });
    //   });
    //   let [_resultstring, splitstring] = [[], "?*&"];
    //   result.forEach(res => {
    //     let resstring = [res.type, res.price, res.number].join(splitstring);
    //     if (_resultstring.indexOf(resstring) < 0) {
    //       _resultstring.push(resstring);
    //     }
    //   });

    //   result = _resultstring.map(res => {
    //     return res.split(splitstring);
    //   });
    //   result.forEach(item => {
    //     this.enrollDetailShow += `${item[0]}(${item[1]}*${
    //       item[2]
    //     })`;
    //   });
    //   return result;
    // },

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
      this.pod = item.value;
    },
    // statusTab(num, index, status) {
    //   if (num == 1) {
    //     this.whichStateTab = num;
    //     this.orderNum = index;
    //     this.orderStatus = status;
    //     this.orderPage(1, this.pageSize);
    //   }
    //   if (num == 2) {
    //     this.whichStateTab = num;
    //     this.refundNum = index;
    //     this.refundStatus = status;
    //     this.orderPage(1, this.pageSize);
    //   }
    // },
    statusTab(num, index, status) {
      if (num == 1) {
        this.refundNum = 7; //为7 只要不等于索引值不等于退款状态号就行
        this.refundStatus = 0;
        this.whichStateTab = num;
        this.orderNum = index;
        this.orderStatus = status;
        this.orderPage(1, this.pageSize);
      }
      if (num == 2) {
        this.whichStateTab = num;
        this.refundNum = index;
        this.refundStatus = status;
        this.orderNum = null;
        this.orderStatus = 0;
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
      this.beginDate = ""; //开始日期
      this.endDate = ""; //结束日期
      this.name = ""; //产品名称
      this.pod = ""; //出发地
      this.podID = ""; //出发地
      this.destinationID = ""; //目的地
      this.destination = ""; //目的地
      this.saler = ""; //销售
      (this.otherPrice = ""), //其他费用名称
        (this.platform = null), //平台
        (this.productType = ""); //产品类型
      this.orgIDValue = ""; //商户名称
      (this.orgID = 0), //商户名称搜索的id
        (this.contact = ""); //订单联系人
      // this.orderChannel = null; //订单来源
      this.showContent = null; //折叠按钮
      this.isSeach = null; //是否点击
      // this.statusTab(1,0,0)
      // this.statusTab(2,0,5)
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
      // localCompName = this.localCompName, //商户名称
      // orderChannels = this.orderChannels, //商户名称
      orgID = this.orgID, //商户名称 搜索时的字段
      // productType = this.productType,
      orderStatus = this.orderStatus,
      refundStatus = this.refundStatus,
      destinationID = this.destinationID, //目的地
      contact = this.contact, //订单联系人
      pod = this.pod,
      podID = this.podID //出发地
    ) {
      // 每次搜索都折叠 要不折叠的数据显示不对 因为点击折叠的位置需要调取另一个接口
      this.showContent = null;
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
      this.orderpage = [];
      let object = {
        orderCode: orderCode,
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
        // localCompName: localCompName //商户名称
        // orderChannels: orderChannels //商户名称
        orgID: orgID ? orgID : 0 //商户名称搜索时的字段
      };
      if (endDate !== 0 && beginDate !== 0) {
        // object.beginDate = beginDate
        // object.endDate = endDate
        object.beginDate = moment(beginDate).format("YYYY-MM-DD");
        object.endDate = moment(endDate).format("YYYY-MM-DD");
      }
      this.$http
        .post(this.GLOBAL.serverSrc + "/order/all/api/orderpage", {
          pageIndex: pageIndex,
          pageSize: pageSize,
          object: object
        })
        .then(res => {
          // console.log("orderpage",res)
          this.total = res.data.total;
          if (res.data.isSuccess == true) {
            this.orderpage = res.data.objects;
            // 折叠面板最开始都为隐藏false
            // this.orderpage.forEach((item,index) => {
            //   item.showContent = false;
            // });
            if (res.data.objects.length !== 0) {
              this.orderStateAllNum = res.data.objects[0];
              this.receiveDataJudgeShow(this.orderpage);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 接收数据 判断显示
    receiveDataJudgeShow(orderpage) {
      orderpage.forEach(item => {
        // 订单状态
        if (item.orderStatus == 0) {
          // 占位状态
          if (item.occupyStatus == 3) {
            item.occupyStatus = "确认占位";
          } else if (item.occupyStatus == 2) {
            item.occupyStatus = "预订占位";
          } else {
            item.occupyStatus = "预订不占";
          }
          item.orderStatus = item.occupyStatus;
        } else if (item.orderStatus == 1) {
          item.orderStatus = "补充资料";
        } else if (item.orderStatus == 2) {
          // item.orderStatus = "电子合同";
          item.orderStatus = "待出行";
        } else if (item.orderStatus == 3) {
          item.orderStatus = "待出行";
        } else if (item.orderStatus == 4) {
          item.orderStatus = "出行中";
        } else if (item.orderStatus == 5) {
          item.orderStatus = "待评价";
        } else if (item.orderStatus == 6) {
          item.orderStatus = "订单完成";
        } else if (item.orderStatus == 7) {
          item.orderStatus = "未确认";
        } else if (item.orderStatus == 8) {
          item.orderStatus = "签署合同";
        } else if (item.orderStatus == 9) {
          item.orderStatus = "作废订单";
        } else if (item.orderStatus == 10) {
           if (item.refundStatus != 0) {
              item.orderStatus = "确定占位";
           }else{
              item.orderStatus = "确认订单";
           }

        }
        if (item.refundStatus == 1) {
          item.refundStatus = "退款中";
        }else if (item.refundStatus == 2) {
          item.refundStatus = "拒绝退款";
        }else if (item.refundStatus == 3) {
          item.refundStatus = "已退款";
        }else if (item.refundStatus == 4) {
          item.refundStatus = "无退款";
        }else if (item.refundStatus == 5) {
          item.refundStatus = "申请退款";
        }else if (item.refundStatus == 6) {
          item.refundStatus = "完成退款";
        }
        //产品类型
        // if (item.productType == 1) {
        //   item.productType = "跟团游";
        // } else {
        //   item.productType = "自由行";
        // }
      });
    },
    orderCodeBlur() {
      if (this.orderCode == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    nameBlur() {
      if (this.name == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    beginDateBlur() {
      if (this.beginDate == "" && this.endDate == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    endDateBlur() {
      if (this.beginDate == "" && this.endDate == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    //判断结束时间不能在开始时间之前
    endDateChange() {
      let beginTime = moment(this.beginDate).format("YYYYMMDD");
      let entTime = moment(this.endDate).format("YYYYMMDD");
      if (this.beginDate !== "") {
        if (entTime < beginTime) {
          this.$message.error("结束时间不能早于开始时间");
          this.endDate = "";
        }
      }
    },
    groupCodeBlur() {
      if (this.groupCode == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    podBlur() {
      if (this.cdestination == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    destinationBlur() {
      if (this.destination == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    localCompNameBlur() {
      if (this.orgIDValue == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    salerBlur() {
      if (this.saler == "") {
        this.orderPage(1, this.pageSize);
      }
    },
    contactBlur() {
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
    operation(item, i) {
      this.orderId = item.id;
      this.variable++;
      this.dialogType = i;
      this.planID = item.planID;
      if (i == 3) {
        this.dialogAdviceNote = true;
      }
      if(i == 5) {
         this.variable = 0;
         this.$http
        .post(this.GLOBAL.serverSrc + "/finance/checksheet/api/isexistchecksheetfororder", {
         id: this.orderId
         })
        .then(res => {
          if (res.data.isExist == true) {
              this.$message.error("该订单下有报账申请或报账通过记录，无法申请退款");
              return false;
           }else{
               this.variable++;
           }
        })
        .catch(err => {
          console.log(err);
        });
          
       //this.orderRefundDialog = 1
      }
    },
    // 出团通知书获取
    getActiceNote() {
      this.$http
        .post(this.GLOBAL.serverSrc + "/teamquery/get/api/get", {
          id: this.planID
        })
        .then(res => {
          if (res.data.isSuccess == true) {
            let { name, url } = res.data.object;
            let obj = {
              name,
              url
            }
            this.fileList.push(obj);
          }
        })
        .catch(err => {});
    },
    // 关闭出团通知书的弹窗
    closeActiceNote() {
      this.fileList = [];
    },

    // 出发日期转换格式显示
    // goDataChangeFun (data) {
    //   console.log(data)
    //   return moment(data).format('YYYY-MM-DD')
    // },
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
    childByValue(childByValue) {
      this.showContent = childByValue;
    }
  }
};
</script>

<style scoped>
/* 商户名称模糊查询显示 */
.por {
  position: relative;
}
.poa {
  position: absolute;
  left: 76px;
  top: 30px;
  width: 100px;
  color: red;
  font-size: 12px;
}
/* 折叠面板 */
.contentHeader {
  position: relative;
}

.contentHeaderIcon {
  position: absolute;
  right: 10px;
  top: 42%;
  transform: translateY(-50%);
}

.BodyTableCenter {
  margin: 0 60px 0 73px;
}

.longWeight {
  width: 160px;
  vertical-align: top;
}

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
  padding: 15px;
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
  vertical-align: top;
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
.dotFather01 {
  margin-left: 25px;
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
/* 出团通知书 */
.adviceNote {
  height: 300px;
  position: relative;
}
.adviceNoteBtn {
  position: absolute;
  right: 20px;
  bottom: 10px;
}

.uploadDemo {
  position: relative;
  margin-top: -10px;
  margin-left: 100px;
}

.uploadDemo span {
  position: absolute;
  top: 30px;
  left: -80px;
}
</style>
