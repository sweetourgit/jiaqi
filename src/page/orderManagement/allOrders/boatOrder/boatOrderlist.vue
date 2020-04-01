<template>
  <div>
    <!-- 游轮列表搜索begin -->
    <div class="boatSearch">
      <span class="searchName">订单ID</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <span class="searchName">产品名称</span>
      <el-input v-model="name" class="searchInput" @blur="nameBlur()"></el-input>
      <span class="searchName">下单日期</span>
      <el-date-picker
        v-model="beginDate"
        type="date"
        placeholder="开始日期"
        class="startTime"
        @blur="beginDateBlur()"
        @change="endDateChange()"
      ></el-date-picker>
      <div class="dateLine"></div>
      <el-date-picker
        v-model="endDate"
        type="date"
        placeholder="终止日期"
        class="startTime"
        @blur="endDateBlur()"
        @change="endDateChange()"
      ></el-date-picker>
      <br />
      <span class="searchName">团期计划</span>
      <el-input v-model="groupCode" class="searchInput" @blur="groupCodeBlur()"></el-input>
      <span class="searchName">
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
      <span class="searchName">订单联系人</span>
      <el-input v-model="contact" class="searchInput" @blur="contactBlur()"></el-input>
      <br />
      <!-- <span class="searchName">出发地</span> 2020/3/17隐藏暂时用不到 唐爱妮
      <el-input v-model="orderCode" class="searchInput" ></el-input>
      <span class="searchName">目的地</span>
      <el-input v-model="orderCode" class="searchInput"></el-input>
      <span class="searchName">销售</span>
      <el-input v-model="orderCode" class="searchInput" ></el-input>
      <br /> -->
      <ul class="orderStatus">
        <span class="searchName poa">订单状态</span>
        <li
          v-for="(item,index) in orderStatusSearch"
          :key="index"
          @click="statusTab(item,index,item.status)"
          v-bind:class="{statusbg: orderNum==index}"
        >{{item.name}}</li>
      </ul>
      <br />
       <el-button type="primary" class="search-but" @click="orderPage(1,pageSize)">搜索</el-button>
      <el-button type="primary" class="search-but" @click="handleReset">重置</el-button>
    </div>
    
    <!-- 列表end -->
     <!-- 列表begin -->
    <div class="orderLists" v-for="(item,index) in orderpage" :key="index">
      <h3>{{item.product_name}}</h3>
      <!-- 固定的table begin -->
      <div class="contentHeader" @click="handleOpen(item,index)">
        <table>
          <tr>
            <td class="tr">订单ID&nbsp;&nbsp;</td>
            <td>{{item.order_code}}</td>
            <div class="tableCenter">
              <td class="tr">团期计划&nbsp;&nbsp;</td>
              <td>{{item.tour_no}}</td>
            </div>
            <td class="tr">下单时间&nbsp;&nbsp;</td>
            <td>{{formatDate(new Date(item.created_at))}}</td>
          </tr>
          <tr>
            <td class="tr">联系人&nbsp;&nbsp;</td>
            <td valign="top">{{item.contact_name}}</td>
            <div class="tableCenter">
              <td class="tr">电话&nbsp;&nbsp;</td>
              <td valign="top">{{item.contct_tel}}</td>
            </div>
          </tr>
        </table>
        <i
          :class="['contentHeaderIcon', isShowContent !== index ? 'el-icon-arrow-right': 'el-icon-arrow-down']"
        ></i>
      </div>
      <!-- 固定的table end -->
     <!-- 折叠开始 -->
        <transition name="el-fade-in">
          <div class="contentBody" v-show="isShowContent == index">
            <table>
              <tr  >
                <td class="tr">出发日期&nbsp;&nbsp;</td>
                <td class="longWeight" v-for="(item,index) in getListOneMessage.skuplan" :key="'set-'+index">{{momentDate(new Date(item.set_out_time))}}</td>
                <div class="BodyTableCenter">
                  <td class="tr">出发地&nbsp;&nbsp;</td>
                  <td class="longWeight" >
                    <span v-for="(item,index) in getListOneMessage.departure" :key="'departure-'+index">{{item.departure_name}}</span>
                  </td>
                </div>
                <td class="tr">目的地&nbsp;&nbsp;</td>
                <td class="longWeight"  v-for="(item,index) in getListOneMessage.destination" :key="'destination-'+index">
                  {{item.destination_name}}
                  </td>
              </tr>

              <tr>
                <td class="tr">产品类型&nbsp;&nbsp;</td>
                <td class="longWeight">邮轮游</td>
                <div class="BodyTableCenter">
                  <td class="tr">数量&nbsp;&nbsp;</td>
                  <td class="longWeight" valign="top">{{getListOneMessage.number}}</td>
                </div>
                  <td class="tr">整体优惠&nbsp;&nbsp;</td>
                  <td class="longWeight" valign="top">{{toDecimal2(getListOneMessage.entiretyFav)}}</td>
              </tr>

              <tr>
                  <td class="tr">其他费用</td>
                  <td class="longWeight" valign="top">
                    {{item.otherTitle}} &nbsp;
                    <span>{{toDecimal2(getListOneMessage. orderotherfee)}}</span>
                  </td>
                <div class="BodyTableCenter">
                   <td class="tr">优惠活动&nbsp;&nbsp;</td>
                   <td class="longWeight" valign="top">{{toDecimal2(getListOneMessage.entiretyFav)}}</td>
                </div>
                  <td class="tr">销售&nbsp;&nbsp;</td>
                  <td class="longWeight" valign="top" > {{getListOneMessage.replacesale}}</td>
              </tr>

              <tr>
                <td class="tr">订单来源&nbsp;&nbsp;</td>
                <td class="longWeight">{{getListOneMessage.order_status}}</td>
                <div class="BodyTableCenter">
                   <td class="tr">平台&nbsp;&nbsp;</td>
                   <td class="longWeight" valign="top">{{getListOneMessage.platform}}</td>
                </div>
                <td class="tr">操作&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top">{{getListOneMessage.create_uid}}</td>
              </tr>

              <tr>
                <td class="tr">同业销售&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top" >{{getListOneMessage.indirectsale}}</td>
                <div class="BodyTableCenter">
                   <td class="tr">整间/拼住&nbsp;&nbsp;</td>
                   <td class="longWeight">{{getListOneMessage.product_name}}</td>
                </div>
                  <td class="tr">支付方式&nbsp;&nbsp;</td>
                  <td class="longWeight"></td>
               </tr>

              <tr>
                 <td class="tr">订单总额&nbsp;&nbsp;</td>
                 <td class="longWeight" valign="top">{{toDecimal2(getListOneMessage.payable)}}</td>
                 <div class="BodyTableCenter">
                  <td class="tr">已付金额&nbsp;&nbsp;</td>
                  <td class="longWeight" valign="top">{{toDecimal2(getListOneMessage.paid_price)}}</td>
                 </div>
              </tr>
            </table>
            <el-breadcrumb separator="|" class="confirm-time">
              <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,0,item.orderCode)"
              >备注</el-breadcrumb-item>
              <el-breadcrumb-item 
              class="breadCrumbPointer"
              @click.native="operation(item,1,item.orderCode)"
              >收款</el-breadcrumb-item>
              <el-breadcrumb-item 
              class="breadCrumbPointer"
               @click.native="operation(item,2,item.orderCode)"
              >换仓</el-breadcrumb-item> 
              <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,7,item.orderCode)"
              >流程管理</el-breadcrumb-item>
              <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,3)"
              >退款</el-breadcrumb-item>
              <!-- v-if="getListOneMessage.paid > 0" -->
               <el-breadcrumb-item
                class="breadCrumbPointer"
                @click.native="operation(item,6,item.orderCode)"
              >发票申请</el-breadcrumb-item>
              <el-breadcrumb-item 
                class="breadCrumbPointer"
                @click.native="operation(item,4)"
              >出团通知书</el-breadcrumb-item>
              <el-breadcrumb-item
               class="breadCrumbPointer"
              @click.native="operation(item,5)"
               >客人信息</el-breadcrumb-item>
             
            </el-breadcrumb>
            <div class="but-row">
              <span class="dotFather">
                <span class="dot"></span>
                <span>{{item.order_status}}</span>
              </span>
              <!--  -->
              <span v-if="item.occupy_status == '预订不占' || item.occupy_status == '预订占位'">
                待确认剩余 &nbsp;
                <span class="moneyColor">1天22:33:33</span>
              </span>
              <!--退款状态-->
              <span class="dotFather01" v-if="getListOneMessage.refund_status !=0">
                <span class="dot"></span>
                <span>{{getrefundStatus(getListOneMessage.refund_status)}}</span>
              </span>
            </div>
          </div>
        </transition>

    </div>
     <!-- 订单end -->

    <!-- 分页begin -->
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
    <!-- 分页end -->

    <!-- 备注 -->
    <boatRemarksInfor
      :propsObj.sync="propsObj"
      :orderId="orderId"
     ></boatRemarksInfor>
    <!-- 收款 -->
    <boatReceipt :propsObj.sync="propsObj"></boatReceipt>
    <!-- 换舱 -->
    <boatExchangeShip :propsObj.sync="propsObj"></boatExchangeShip>
    <!-- 退款 -->
    <boatRefundMoney :propsObj.sync="propsObj"></boatRefundMoney>
    <!-- 发票申请 -->
    <boatInvoiceApply :propsObj.sync="propsObj"></boatInvoiceApply>
    <!-- 出团通知书 -->
    <boatAppearBook :propsObj.sync="propsObj"></boatAppearBook>
    <!-- 客人信息 -->
    <boatGuestsInfo 
    :propsObj.sync="propsObj"
    :orderId="orderId"
    ></boatGuestsInfo>
    <!-- 流程管理-->
    <boatProcessManage 
     :propsObj.sync="propsObj"
     :orderId="orderId"
     :orderCodeSon='orderCodeSon'
    ></boatProcessManage>
      
  </div>
</template>

<script>
import boatRemarksInfor from "./common/boatRemarksInfor";
import boatReceipt from "./common/boatReceipt";
import boatExchangeShip from "./common/boatExchangeShip";
import boatRefundMoney from "./common/boatRefundMoney";
import boatAppearBook from "./common/boatAppearBook";
import boatGuestsInfo from "./common/boatGuestsInfo";
import boatInvoiceApply from './common/boatInvoiceApply'; 
import boatProcessManage from "./common/boatProcessManage";
import moment from "moment";

export default {
  
  components: {
    boatRemarksInfor,
    boatReceipt,
    boatExchangeShip,
    boatRefundMoney,
    boatAppearBook,
    boatGuestsInfo,
    boatInvoiceApply,
    boatProcessManage,
  },

  data() {
    return {
      arrDemo: [1, 2],
      orderCode: "",
      orderNum: null,
      pageSize: 0, //分页每页显示的条数
      pageIndex: 1, //当前分页是第几页
      total: 0, //分页的总条数
      propsObj: { dialogType: -1 }, //传给组件的值
      orderStatusSearch: [
        { status: 0, name: "全部", type: 1 },
        { status: 7, name: "未确认", type: 1 },
        { status: 1, name: "补充资料", type: 1 },
        { status: 8, name: "签署合同", type: 1 },
        { status: 4, name: "出行中", type: 1 },
        { status: 5, name: "待点评", type: 1 },
        { status: 6, name: "完成订单", type: 1 },
        { status: 9, name: "作废订单", type: 1 },
        { status: 5, name: "申请退款", type: 2 },
        { status: 1, name: "退款中", type: 2 },
        { status: 6, name: "完成退款", type: 2 },
        { status: 2, name: "拒绝退款", type: 2 }
      ], //搜索的订单状态集合  联系客人先不做
      isShowContent: null, //折叠列表是否显示
      isToast: false, //商户名称模糊搜索 没有数据然后的提示语显示
      orderCode: "", // 搜索订单ID
      name: "", //搜索产品名称
      beginDate: "",//搜索开始时间
      endDate: "",//搜索结束时间
      groupCode: "", //搜索团期计划ID
      orgIDValue: "", //商户名称 搜索时显示的字段
      businessLists: [], //商户名称下拉列表展示
      contact:"",// 搜索订单联系人
      orderpage: [],//订单列表
      getListOneMessage: {},//订单列表下拉后详情
      orderId:0,
      orderCodeSon: null, //传给子组件
      order_status: 0,//订单状态

    };
  },

  created() {
     //this.handleBusinessGet();
     this.orderPage();
  },

  methods: {
    moment,
    // 分页 条数显示变动
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageIndex = 1;
      this.orderPage(1, size);
    },

    //分页 页数显示变动
    handleCurrentChange(index) {
      this.orderPage(index, this.pageSize);
      this.pageIndex = index;
    },

    // 折叠表格显示
   handleOpen(item, index) { // 点击list列表中的一个
       this.variable= 0; //退款
       this.a_variable=0;//设置一个变量展示弹窗
       this.variable_s=0;//发票申请
       this.dialogType= 0; //弹窗类型  1：流程管理  2：备注信息
      if (this.isShowContent != index) {
          this.isShowContent = index;
          this.tour = {};
          this.axiosListOneInfo(item.id,item.planID);
        } else {
          this.isShowContent = null;
        }
    }, 
    axiosListOneInfo(id,planID) { // 请求list中的一个数据
      this.orderId = id;
      this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/pageinfo", {
          id: id
        })
        .then(res => {
          //console.log("请求一条数据的",res)
          this.getListOneMessage = res.data.data; 
          this.orderCodeSon = res.data.data.order_code;
            // 下单平台
          if (this.getListOneMessage.platform == 1) { //订单来源
            this.getListOneMessage.platform = "ERP系统";
          }else if(this.getListOneMessage.platform == 2){
            this.getListOneMessage.platform = "同业系统";
          }else if(this.getListOneMessage.platform == 3){
            this.getListOneMessage.platform = "门户网站";
          }else if(this.getListOneMessage.platform == 4){
            this.getListOneMessage.platform = "H5";
          }else if(this.getListOneMessage.platform == 5){
            this.getListOneMessage.platform = "小程序";
          }else if(this.getListOneMessage.platform == 6){
            this.getListOneMessage.platform = "App";
          }
          //this.orderCodeSon = res.data.data.order_code;   
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 操作
    operation(val, index) {
      // console.log(val,'val');
      // console.log(index,'index');
      this.propsObj = {
        dialogType: index
      };
    },

    // 子组件关闭弹窗的时候重置propsObj.dialogType = -1
    resetDialogType() {
      this.propsObj.dialogType = -1;
    },

    // 重置按钮
    handleReset() {
      this.isShowContent = null;
      this.orderCode = ""; //订单ID
      this.name = ""; //产品名称
      this.groupCode = null; //团期计划ID
      this.beginDate = ""; //开始日期
      this.endDate = ""; //结束日期
      this.saler = ""; //销售
      this.orderPage(1, this.pageSize);
    },
    orderCodeBlur() { //搜索订单文本
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
    // destinationBlur() { //出发地
    //   if (this.destination == "") {
    //     this.orderPage(1, this.pageSize);
    //   }
    // },
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
    isToastFun() {  // 商户名称input失去焦点的时候隐藏提示语 没有数据
      this.isToast = false;
      this.orgIDValue = "";
      this.orgID = 0;
    },
    handleBusinessGet(queryString3, cb) {  //商户名称模糊查询
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
    handleChooseOrgID(item) {   // 搜索商户名称下拉选择事件
      this.orgID = item.id;
    },
    statusTab(num, index, status) { //   点击订单状态筛选
      if (num == 1) {
        this.refundNum = 7; //为7 只要不等于索引值不等于退款状态号就行
        this.refundStatus = 0;
        this.whichStateTab = num;
        this.orderNum = index;
        this.order_status = status;
        this.orderPage(1, this.pageSize);
      }
      if (num == 2) {
        this.whichStateTab = num;
        this.refundNum = index;
        this.refundStatus = status;
        this.orderNum = null;
        this.order_status = 0;
        this.orderPage(1, this.pageSize);
      }
    },
    orderPage( // 搜索订单
      pageIndex = this.pageIndex,
      pageSize = this.pageSize,
      orderCode = this.orderCode, //订单id
      name = this.name, //产品名称
      groupCode = this.groupCode, //团期计划
      beginDate = this.beginDate,
      endDate = this.endDate,
      saler = this.saler,
      orgID = this.orgID, //商户名称 搜索时的字段
      orderStatus = this.order_status,
      refundStatus = this.refundStatus,
      destinationID = this.destinationID, //目的地
      contact = this.contact, //订单联系人
      pod = this.pod,
      podID = this.podID //出发地
    ){
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
   
      if (endDate !== 0 && beginDate !== 0) {
        beginDate = moment(beginDate).format("YYYY-MM-DD");
        endDate = moment(endDate).format("YYYY-MM-DD");
      }
      this.$http
        .post(this.GLOBAL.serverSrcYL + "/linerapi/v1/order/order/listpage", {
          pageIndex: pageIndex,//多少页
          pageSize: pageSize,//多少内容
          order_code: orderCode,//订单id
          product_name: name,//产品名称
          create_at_begin:beginDate,//开始时间
          create_at_end:endDate,//结束时间
          tour_no: groupCode,//团期计划
          departure:"",//粗发地
          destination:'',//目的地
          sale:saler,//销售
          contact_name:'',//订单联系人
          order_status:this.orderStatus,//订单状态
          refund_status:this.refundStatus,//退款状态
       })
        .then(res => {
         this.total = res.data.data.total;
        
          if (res.data.code == 200) {
            this.orderpage = res.data.data.list;
            if (res.data.data.list.length !== 0) {
              this.orderStateAllNum = res.data.data.list[0];
              this.receiveDataJudgeShow(this.orderpage);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
     toDecimal2(x) { //周边信息 整数转浮点数
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
       // 接收数据 判断显示
    receiveDataJudgeShow(orderpage) {
      orderpage.forEach(item => {
        // 订单状态
        if (item.order_status == 0) {
          // 占位状态
          if (item.occupy_status == 3) {
            item.occupy_status = "确认占位";
          } else if (item.occupy_status == 2) {
            item.occupy_status = "预订占位";
          } else {
            item.occupy_status = "预订不占";
          }
          item.order_status = item.occupy_status;
        } else if (item.order_status == 1) {
          item.order_status = "补充资料";
        } else if (item.order_status == 2) {
          // item.orderStatus = "电子合同";
          item.order_status = "待出行";
        } else if (item.order_status == 3) {
          item.order_status = "待出行";
        } else if (item.order_status == 4) {
          item.order_status = "出行中";
        } else if (item.order_status == 5) {
          item.order_status = "待评价";
        } else if (item.order_status == 6) {
          item.order_status = "订单完成";
        } else if (item.order_status == 7) {
          item.order_status = "未确认";
        } else if (item.order_status == 8) {
          item.order_status = "签署合同";
        } else if (item.order_status == 9) {
          item.order_status = "作废订单";
        } else if (item.order_status == 10) {
           if (item.refundStatus != 0) {
              item.order_status = "确定占位";
           }else{
              item.order_status = "确认订单";
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
     formatDate(date) { //日期转换  
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
     momentDate(date) { //日期转换  
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
      return y + "-" + m + "-" + d;
    },
  }
};
</script>

<style lang="scss" scoped>
// 搜索begin
.boatSearch {
  .searchName {
    font-size: 14px;
    margin-left: 5px;
    display: inline-block;
    width: 75px;
    text-align: center;
  }

  .searchInput {
    margin: 10px 5px;
    width: 145px;
  }

  .startTime {
    margin-left: 10px;
    width: 135px !important;
  }

  .dateLine {
    width: 15px;
    border-bottom: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 -10px 3px 0;
  }

  .orderStatus {
    position: relative;
    list-style-type: none;
    margin: 13px 0 10px 0;
    display: inline-block;
    padding-left: 88px;
    font-size: 14px;
    line-height: 35px;
    overflow: hidden;
    text-align: center;
    width: 1088px;
    box-sizing: border-box;

    li {
      margin-top: 10px;
      float: left;
      width: 120px;
      border: 1px solid #eaeaea;
      border-left: 0;
      cursor: pointer;
    }

    :nth-child(2),
    :nth-child(10) {
      border-left: 1px solid #eaeaea;
    }

    // 订单状态title文字
    .poa {
      position: absolute;
      left: 0px;
      top: 8px;
    }

    // 订单状态tabs选中的样式
    .statusbg {
      background-color: #f6f6f6;
    }
  }
}
// 搜索end

// 列表begin
.orderLists {
  font-size: 14px;
  background-color: #e4e4e4;
  margin: 20px 30px 30px 10px;
  line-height: 25px;
  padding: 15px;
  width: 70%;
  min-width: 1120px;
  border-radius: 5px;

  .contentHeader {
    position: relative;
  }

  .contentHeaderIcon {
    position: absolute;
    right: 10px;
    top: 42%;
    transform: translateY(-50%);
  }

  .tr {
    font-weight: bold;
    vertical-align: top;
  }

  .longWeight {
    width: 160px;
    vertical-align: top;
  }

  .tableCenter {
    margin-left: 80px;
    margin-right: 80px;
  }

  .BodyTableCenter {
    margin: 0 60px 0 72px;
  }

  .butRow {
    margin: 40px 0 20px 10px;
  }

  .dotFather {
    margin-right: 16px;

    .dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      background-color: #7ec856;
      border-radius: 50%;
      margin-top: -2px;
      margin-right: 6px;
    }
  }
  .breadCrumbPointer {
      cursor: pointer;
  }
 .confirm-time {
  float: right;
  //margin-top: 46px;
  margin-right: 20px;
}
}
// 列表end

// 分页begin
.pagination {
  text-align: center;
  margin: 50px 0;
}
// 分页end
</style>