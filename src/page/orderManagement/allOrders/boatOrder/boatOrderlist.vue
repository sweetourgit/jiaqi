<template>
  <div>
    <!-- 搜索begin -->
    <div class="boatSearch">
      <span class="searchName">订单ID</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <span class="searchName">产品名称</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <span class="searchName">下单日期</span>
      <el-date-picker
        v-model="orderCode"
        type="date"
        placeholder="开始日期"
        class="startTime"
        @blur="beginDateBlur()"
        @change="endDateChange()"
      ></el-date-picker>
      <div class="dateLine"></div>
      <el-date-picker
        v-model="orderCode"
        type="date"
        placeholder="终止日期"
        class="startTime"
        @blur="endDateBlur()"
        @change="endDateChange()"
      ></el-date-picker>
      <br />
      <span class="searchName">团期计划</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <span class="searchName">出发地</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <span class="searchName">目的地</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <br />
      <span class="searchName">商户名称</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <span class="searchName">销售</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <span class="searchName">订单联系人</span>
      <el-input v-model="orderCode" class="searchInput" @blur="orderCodeBlur()"></el-input>
      <br />
      <ul class="orderStatus">
        <span class="searchName poa">订单状态</span>
        <li
          v-for="(item,index) in orderStatusSearch"
          :key="index"
          @click="statusTab(item,index)"
          v-bind:class="{statusbg: orderNum==index}"
        >{{item.name}}</li>
      </ul>
      <br />
      <el-button type="primary" style="margin-left: 16px;">搜索</el-button>
      <el-button type="primary" @click="handleReset">重置</el-button>
    </div>
    <!-- 搜索end -->
    <!-- 列表begin -->
    <div class="orderLists" v-for="(item,index) in arrDemo" :key="index">
      <h3>游轮游轮游轮</h3>
      <!-- 固定的table begin -->
      <div class="contentHeader" @click="handleOpen(index)">
        <table>
          <tr>
            <td class="tr">订单ID&nbsp;&nbsp;</td>
            <td>15770783028823700467</td>
            <div class="tableCenter">
              <td class="tr">团期计划&nbsp;&nbsp;</td>
              <td>212-20200501-1212</td>
            </div>
            <td class="tr">下单时间&nbsp;&nbsp;</td>
            <td></td>
          </tr>
          <tr>
            <td class="tr">联系人&nbsp;&nbsp;</td>
            <td valign="top"></td>
            <div class="tableCenter">
              <td class="tr">电话&nbsp;&nbsp;</td>
              <td valign="top"></td>
            </div>
          </tr>
        </table>
        <i
          :class="['contentHeaderIcon', isShowContent !== index ? 'el-icon-arrow-right': 'el-icon-arrow-down']"
        ></i>
      </div>
      <!-- 固定的table end -->

      <!-- 列表折叠begin -->
      <transition name="el-fade-in" v-if="isShowContent == index">
        <div class="contentBody">
          <table>
            <tr>
              <td class="tr">舱房&nbsp;&nbsp;</td>
              <td class="longWeight">未命名套餐1</td>
              <div class="BodyTableCenter">
                <td class="tr">出发地&nbsp;&nbsp;</td>
                <td class="longWeight"></td>
              </div>
              <td class="tr">目的地&nbsp;&nbsp;</td>
              <td class="longWeight"></td>
            </tr>
            <tr>
              <td class="tr">出发日期&nbsp;&nbsp;</td>
              <td class="longWeight"></td>
              <div class="BodyTableCenter">
                <td class="tr">数量&nbsp;&nbsp;</td>
                <td
                  class="longWeight"
                  valign="top"
                >[成人中铺1009.00]*2,[成人中铺1009.00]*2[成人中铺1009.00]*2[成人中铺1009.00]*2</td>
              </div>
              <td class="tr">产品类型&nbsp;&nbsp;</td>
              <td class="longWeight">跟团游</td>
            </tr>
            <tr>
              <td class="tr">整体优惠&nbsp;&nbsp;</td>
              <td class="longWeight" valign="top"></td>
              <div class="BodyTableCenter">
                <td class="tr">其他费用</td>
                <td class="longWeight" valign="top">
                  &nbsp;
                  <span></span>
                </td>
              </div>
              <td class="tr">订单来源&nbsp;&nbsp;</td>
              <td class="longWeight"></td>
            </tr>
            <tr>
              <td class="tr">支付方式&nbsp;&nbsp;</td>
              <td class="longWeight"></td>
              <div class="BodyTableCenter">
                <td class="tr">操作&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top"></td>
              </div>
              <td class="tr">商户销售&nbsp;&nbsp;</td>
              <td class="longWeight" valign="top"></td>
              <td class="longWeight" valign="top"></td>
            </tr>
            <tr>
              <td class="tr">平台&nbsp;&nbsp;</td>
              <td class="longWeight" valign="top"></td>
              <div class="BodyTableCenter">
                <td class="tr">销售&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top"></td>
              </div>
              <td class="tr">整间/拼住&nbsp;&nbsp;</td>
              <td class="longWeight" valign="top"></td>
            </tr>
            <tr>
              <td class="tr">订单总价&nbsp;&nbsp;</td>
              <td class="longWeight" valign="top"></td>
              <div class="BodyTableCenter">
                <td class="tr">已付金额&nbsp;&nbsp;</td>
                <td class="longWeight" valign="top"></td>
              </div>
            </tr>
          </table>

          <!-- 操作菜单begin -->
          <el-breadcrumb separator="|" class="confirmTime">
            <el-breadcrumb-item
              v-for="(item,index) in breadCrumbs"
              :key="index"
              class="breadCrumbPointer"
              @click.native="operation(item,index)"
            >{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 操作菜单end -->

          <!-- 订单状态begin -->
          <div class="butRow">
            <span class="dotFather">
              <span class="dot"></span>
              <span></span>
            </span>
            <span>
              待确认剩余 &nbsp;
              <span class="moneyColor">1天22:33:33</span>
            </span>
          </div>
          <!-- 订单状态end -->
        </div>
      </transition>
      <!-- 列表折叠end -->
    </div>
    <!-- 列表end -->

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
    <boatRemarksInfor :propsObj="propsObj"></boatRemarksInfor>
    <!-- 收款 -->
    <boatReceipt></boatReceipt>
    <!-- 流程管理 -->
    <boatProcessManage></boatProcessManage>
    <!-- 分房信息 -->
    <boatDivideRoomInfo></boatDivideRoomInfo>

  </div>
</template>

<script>
import boatRemarksInfor from "./common/boatRemarksInfor";
import boatReceipt from "./common/boatReceipt";
import boatProcessManage from "./common/boatProcessManage";
import boatDivideRoomInfo from "./common/boatDivideRoomInfo";

export default {
  components: { divideRoomInfo, processManage, receipt, remarksInfor },
  data() {
    return {
      arrDemo: [1, 2],
      orderCode: "",
      orderNum: null,
      pageSize: 0, //分页每页显示的条数
      pageIndex: 1, //当前分页是第几页
      total: 0, //分页的总条数
      propsObj: {},//传给组件的值
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
      breadCrumbs: ["备注", "收款", "流程管理", "分房信息"], //折叠列表里面的操作集合
      isShowContent: null //折叠列表是否显示
    };
  },
  created() {},
  methods: {
    //   点击订单状态筛选
    statusTab(item, index) {
      this.orderNum = index;
    },

    // 分页 条数显示变动
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.orderPage(1, val);
    },

    //分页 页数显示变动
    handleCurrentChange(val) {
      this.orderPage(val, this.pageSize);
      this.pageIndex = val;
    },

    // 折叠表格显示
    handleOpen(index) {
      this.isShowContent == index
        ? (this.isShowContent = -1)
        : (this.isShowContent = index);
    },

    // 操作
    operation (val,index) {
      this.propsObj.dialogType = index
    },

    // 重置按钮
    handleReset() {
      this.isShowContent = null;
    }
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

  .confirmTime {
    float: right;
    margin-top: 46px;
    margin-right: 20px;

    .breadCrumbPointer {
      cursor: pointer;
    }
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