<template>
  <div>
    <!--详情-->
    <el-dialog title="详情" :visible.sync="dialogFormOrder" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"
      @close="cancelInfoOrder()">
      <div class="controlButton">
        <el-button class="ml13" @click="cancelInfoOrder()">取 消</el-button>
        <el-button class="ml13" v-if="invoiceList.state!='3'" type="primary" @click="rejectedIncoice(invoiceID)">驳回</el-button>
        <el-button type="primary" v-if="invoiceList.state=='1'" @click="openInvoice(invoiceID)" class="ml13">开票</el-button>
        <el-button type="primary" v-if="invoiceList.state=='2'" @click="changeInvoice(invoiceID)" class="ml13">换发票</el-button>
      </div>
      <div class="planBorder">
        <div class="order-title"><span>基本信息</span></div>
        <div>
          <div v-if="invoiceList.state=='1'" class="state01">待开票</div>
          <div v-if="invoiceList.state=='2'">
            <div class="state02">已开票</div>
            <div class="state03">发票号码:{{originalBanks}}</div>
          </div>
          <div v-if="invoiceList.state=='3'" class="state04">开票驳回</div>
        </div>
        <div class="pro-info">
          <table width="100%">
            <tr>
              <td width="33%">
                <div width="80" class="fl">ID:</div>
                <div class="fl ml13">{{invoiceList.id}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">申请人:</div>
                <div class="fl ml13">{{invoiceList.userName}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">申请时间:</div>
                <div class="fl ml13">{{invoiceList.createTime | formatDate}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl">发票抬头:</div>
                <div class="fl ml13">{{invoiceList.invoiceHeader}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">纳税人识别号:</div>
                <div class="fl ml13">{{invoiceList.taxpayerIDNumber}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">手机号:</div>
                <div class="fl ml13">{{invoiceList.tel}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl">发票项目:</div>
                <div class="fl ml13">
                  <div v-if="invoiceList.invoiceItem=='1'">旅游费</div>
                </div>
              </td>
              <td width="33%">
                <div width="80" class="fl">发票金额:</div>
                <div class="fl ml13">{{invoicePrice}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">直客/商户:</div>
                <div class="fl ml13">
                  <div v-if="invoiceList.collectionType=='1'">商户</div>
                  <div v-if="invoiceList.collectionType=='2'">直客</div>
                </div>
              </td>
            <tr>
              <td width="33%">
                <div width="80" class="fl">账号:</div>
                <div class="fl ml13">{{invoiceList.cardNumber}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">开户行:</div>
                <div class="fl ml13">{{invoiceList.bankName}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">地址:</div>
                <div class="fl ml13">{{invoiceList.address}}</div>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl">发票类型:</div>
                <div class="fl ml13">
                  <div v-if="invoiceList.invoiceID=='1'">纸质发票</div>
                </div>
              </td>
              <td width="33%">
                <div width="80" class="fl">个人/单位:</div>
                <div class="fl ml13">
                  <div v-if="invoiceList.invoiceType=='1'">个人</div>
                  <div v-if="invoiceList.invoiceType=='2'">单位</div>
                </div>
              </td>
              <td width="33%">
                <div width="80" class="fl">开票日期:</div>
                <div class="fl ml13" v-if="invoiceList.endTime !='0' ">{{formatDate01(new Date(invoiceList.endTime))}}</div>
                <!-- <div class="fl ml13" v-if="invoiceList.selStartGrantTime !='0' ">{{invoiceList.selStartGrantTime}}</div> -->
              </td>
            </tr>
            <tr>
              <td width="33%">
                <div width="80" class="fl">收款单号:</div>
                <div class="fl ml13">{{invoiceList.collectionID}}</div>
              </td>
              <td width="33%">
                <div width="80" class="fl">报账团号:</div>
                <div class="fl ml13">{{invoiceList.accountGroupCode}}</div>
              </td>
            </tr>
          </table>
        </div>
        <div class="order-title"><span>关联订单</span></div>
        <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
          <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
          <el-table-column prop="orderCreateTime" :formatter='dateFormat' label="下单日期" align="center"></el-table-column>
          <el-table-column prop="coPrice" label="已付金额" align="center"></el-table-column>
          <el-table-column prop="skPrice" label="剩余开票金额" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--开票、换票弹窗-->
    <el-dialog :title="title" :visible.sync="openInvoiceShow" custom-class="city_list dialogOrder" style="margin-top:-100px" width="1200px"
      @close="closeOpenInvoice()">
      <div class="controlButton">
        <el-button class="ml13" @click="closeOpenInvoice()">取 消</el-button>
        <el-button type="primary" @click="invoiceOnly(invoiceID)" v-if="title == '开票'" class="ml13">开票</el-button>
        <el-button type="primary" @click="invoiceOnly(invoiceID)" v-if="title == '换票'" class="ml13">换票</el-button>
      </div>
      <el-form :model="ruleFormSeach" ref="ruleFormSeach" label-width="120px" v-if="title == '开票'">
        <el-form-item label="单张发票金额:" prop="invoicePrice">
          <el-input v-model="ruleFormSeach.invoicePrice" class="w200" placeholder="请输入发票金额"></el-input>
          <el-button type="primary" @click="split()">拆分发票</el-button>
        </el-form-item>
      </el-form>
      <div class="associated" v-if="title == '开票'">
        <div class="warning"><i class="el-icon-warning"></i></div>
        <div class="fl">已关联<span class="relateditems">{{invoiceDate.length}}</span>项</div>
        <div class="aggregate">总计:<span>{{sum | numFilter}}</span>元</div>
      </div>
      <el-table :data="invoiceDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column v-if="title == '换票'" label="原票号" align="center">
          <template slot-scope="scope">
            <span>{{originalBanks}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="oldInvoiceNumber" v-if="title == '换票'" label="原票号" align="center"></el-table-column> -->
        <el-table-column v-if="title == '开票'" label="发票抬头" align="center">
          <template slot-scope="scope">
            <span>{{invoiceHeader}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taxpayerIDNumber" v-if="title == '开票'" label="纳税人识别号" align="center"></el-table-column>
        <el-table-column prop="tel" label="电话" align="center"></el-table-column>
        <el-table-column prop="cardNumber" label="账号" align="center"></el-table-column>
        <el-table-column prop="address" label="地址" align="center"></el-table-column>
        <el-table-column prop="bankName" label="开户行" align="center"></el-table-column>
        <el-table-column prop="invoiceHeader" v-if="title == '换票'" label="发票抬头" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.invoiceHeader" class="w150"></el-input>
            <div class="validation" v-if="scope.row.invoiceHeader == '' && a == true">发票抬头不能为空</div>
          </template>
        </el-table-column>
        <el-table-column prop="taxpayerIDNumber" v-if="title == '换票'" label="纳税人识别号" align="center" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taxpayerIDNumber" class="w150"></el-input>
            <div class="validation" v-if="scope.row.taxpayerIDNumber == '' && a == true">纳税人识别号不能为空</div>
          </template>
        </el-table-column>
        <el-table-column prop="invoicePrice" label="发票金额" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.invoicePrice" class="w150" @blur="invoiceSum()" @input="clearNoNum(scope.$index,scope.row.invoicePrice)"></el-input>
            <div class="validation" v-if="scope.row.invoicePrice == '' && a == true">发票金额不能为空</div>
          </template>
        </el-table-column>
        <el-table-column label="发票号码" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.invoiceNumber" class="w150"></el-input>
            <div class="validation" v-if="scope.row.invoiceNumber == '' && a == true">发票号码不能为空</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="order-title"><span>关联订单</span></div>
      <div class="associated">
        <div class="warning"><i class="el-icon-warning"></i></div>
        <div class="fl">已关联<span class="relateditems">{{tableDate.length}}</span>项</div>
        <div class="aggregate">总计:<span>{{ sum_01 | numFilter}}</span>元</div>
      </div>
      <el-table :data="tableDate" ref="multipleTable" class="table" :header-cell-style="getRowClass" border :cell-style="getCellClass">
        <el-table-column prop="orderCode" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
        <el-table-column prop="groupCode" label="团期计划" align="center"></el-table-column>
        <el-table-column prop="orderCreateTime" :formatter='dateFormat' label="下单日期" align="center"></el-table-column>
        <!-- <el-table-column prop="kpPrice" label="已付金额" align="center"></el-table-column> -->
        <el-table-column prop="coPrice" label="已付金额" align="center"></el-table-column>
        <el-table-column prop="skPrice" label="剩余开票金额" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div> 
</template>

<script>
import moment from "moment";
export default {
  props: {
    invoiceID:0,
    variable: 0,
    dialogType: 0
  },
  data() {
    return {
      dialogFormOrder:false,// 详情弹窗
      invoiceList:{},// 基本信息数组
      tableDate:[],// 详情弹窗中关联订单表格
      title:"",//换票、开票标题
      openInvoiceShow:false,
      ruleFormSeach:{// 单张发票金额
        invoicePrice:'',
      },
      invoiceDate:[],//发票表格
      invoiceAmount:'',// 输入发票金额
      invoiceNumber:'',// 输入发票号
      invoiceHeader:'',
      taxpayerIDNumber:'',
      a:false,
      guest:'',
      online:0,
      ifOnly:true,
      originalBanks:'',
      invoicePrice:'',
      sum:0,//发票金额的总和
      sum_01:0,
      invoiceHeader:'',
    };

  },
  filters: {
    numFilter (value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    formatDate: function (value) {//截取详情时间格式
      return moment(value).format('YYYY-MM-DD')
    }
  },
  mounted () {
  },
  watch: {
    variable: function() {
      if (this.dialogType == 1) { // 详情
        setTimeout(() => {
          this.getInvoice(this.invoiceID);
        },200);
        this.dialogFormOrder = true;
      }else if(this.dialogType == 2){
        setTimeout(() => { // 驳回
          this.rejectedIncoice(this.invoiceID);
        }, 200);
      }else if(this.dialogType == 3){
        setTimeout(() => {
          this.getInvoice(this.invoiceID);
          this.openInvoiceShow = true;
          this.title = "开票"
        }, 200);
      }else if(this.dialogType == 4){
        setTimeout(() => {
          this.getInvoice(this.invoiceID);
          this.openInvoiceShow = true;
          this.title = "换票"
        }, 200);
      }
    },
  },
  methods: {
    clearNoNum(index,data){
      this.invoiceDate[index].invoicePrice = data.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');//只能输入两个小数
    },
    formatDate01(date) {//时间转化
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
    // 起始时间格式转换
    dateFormat: function(row, column) {
      let date = row[column.property];
      if(date == undefined) {
        return '';
      }
      return moment(date).format('YYYY-MM-DD')
    }, 

    getRowClass({ row, column, rowIndex, columnIndex }) {//表格头部颜色
      if (rowIndex == 0) {
        return "background:#f7f7f7;height:60px;textAlign:center;color:#333;fontSize:15px";
      } else {
        return "";
      }
    },
    getCellClass() {
      return "textAlign:center";
    },
    cancelInfoOrder(){ // 关闭详情弹窗
      this.dialogFormOrder = false;
      this.tableDate = [];
      this.invoiceDate = [];
    },
    getInvoice(ID){//详情弹窗
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/get", {
        id: ID
      }).then(res => {
        if (res.data.isSuccess == true) {
          this.invoiceList = res.data.object;
          this.guest = res.data.object.invoicePrice;
          this.invoicePrice = res.data.object.invoicePrice; // 点击详情获取开票金额
          this.tableDate = res.data.object.ordelist; // 点击详情获取关联订单表格
          this.invoiceDate.push(res.data.object);
          //this.invoiceDate[0].invoicePrice = "";
          this.originalBanks =  res.data.object.invoiceNumber; // 点击详情获取开票号
          this.invoiceDate[0].invoiceNumber = "";
          this.associated(); // 点击开票或者换票 显示关联订单总计金额
          if(this.invoiceList.invoicePrice !== ''){
            this.sum = this.guest
          }
          this.invoiceHeader = res.data.object.invoiceHeader;
        }
      });
    },
    rejectedIncoice(ID){// 驳回
      this.$confirm("是否驳回本次发票信息?", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
      })
      .then(res => {
        this.$http.post(this.GLOBAL.serverSrc + '/finance/Receipt/api/regression',{
          "object": {
            "id": ID,
          },
        }).then(res => {
          if(res.data.isSuccess == true){
             this.$message.success("驳回成功");
             this.$parent.pageList();
             this.dialogFormOrder = false;
            }
         })
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    },
    closeOpenInvoice(){// 关闭开票、换票弹窗
      this.sum = 0;
      this.sum_01 = 0;
      this.openInvoiceShow = false;
      this.invoiceDate = [];
      this.ruleFormSeach.invoicePrice = '';
      this.a = false;
    },
    openInvoice(ID){ // 在详情弹窗里点击开票按钮
      this.invoiceDate = [];
      this.getInvoice(ID);
      this.title = '开票';
      this.dialogFormOrder = false;
      this.openInvoiceShow = true;
    },
    changeInvoice(ID){
      this.invoiceDate = [];
      this.getInvoice(ID);
      this.title = '换票';
      this.dialogFormOrder = false;
      this.openInvoiceShow = true;
    },
    split(){// 拆分
      if(this.ruleFormSeach.invoicePrice <= 0){
        return;
      }
      let str = Math.ceil(this.sum/this.ruleFormSeach.invoicePrice)
      let remainder = Math.ceil((this.sum%this.ruleFormSeach.invoicePrice) * 1000)/1000 + "";
      remainder = remainder.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'); // 取余后保留小数点后两位
      let guestAll = this.invoiceDate[0];
      this.invoiceDate=[];
      for(let i=0; i < str; i++){
        guestAll.invoicePrice = this.ruleFormSeach.invoicePrice;
        this.invoiceDate.push(JSON.parse(JSON.stringify(guestAll)))
      }
      if(remainder > 0){
        this.invoiceDate[str-1].invoicePrice = remainder;
      }
    },
    invoiceOnly(ID){ // 验证发票号唯一性
      this.ifOnly = true ;
      for(let i = 0 ; i < this.invoiceDate.length ; i ++){
        this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/exisinvoicenumber", {
          id: ID,
          invoiceNumber:this.invoiceDate[i].invoiceNumber
        }).then(res => {
          if (res.data.isSuccess === false && this.invoiceDate[i].invoiceNumber !== '') {
            this.$message.success("第 "+(i+1)+" 条发票号码已存在");
            this.ifOnly = false;
          }
          if(i == this.invoiceDate.length - 1){
            this.openInvoicement(ID);
          }
        });
      }
    },
    invoiceSum(){//求发票金额的总和
      let sum = 0; 
      this.invoiceDate.forEach(function(item) {
        sum += Number(item.invoicePrice);
      });
      this.sum = sum;
      console.log(sum)
    },
    associated(){ //求关联订单剩余开票金额的总和
      let sum_01 = 0;
      this.tableDate.forEach(function(item) {
        sum_01 += Number(item.skPrice);
      });
      this.sum_01 = sum_01;
    },
    openInvoicement(ID){ // 点击开票按钮
      if(this.ifOnly == true){
        this.a = true;
        let sum = 0; //求发票金额的总和
        this.invoiceDate.forEach(function(item) {
          sum += Number(item.invoicePrice);
        });
        let sum_01 = 0; //求关联订单剩余开票金额的总和
        this.tableDate.forEach(function(item) {
          sum_01 += Number(item.skPrice);
        });
        let aaa = true;
        for(let i =0 ; i < this.invoiceDate.length; i++){
          if(this.invoiceDate[i].invoicePrice =='' || this.invoiceDate[i].invoiceNumber==''){
            aaa = false;
          }
        }
        if(aaa==false){
          this.$message.success("请填写发票号或者发票金额");
          return;
        }
        if(sum <= sum_01){
          if(this.title == '开票'){
            this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/confirm", {
              "object":{
                receiptList:this.invoiceDate,
                receiptID:ID
              }
            }).then(res => {
              this.$message.success("开票成功");
              this.openInvoiceShow = false ;
              this.$parent.pageList();
            })
          }
        }else if(this.invoiceDate[0].invoicePrice <= sum_01 + this.invoicePrice){
          this.changeTicket(ID);
        }else{
          this.$message.success("该发票金额已超过剩余开票金额");
        }
      }
    },
    changeTicket(ID){ // 换票
      this.$http.post(this.GLOBAL.serverSrc + "/finance/Receipt/api/replacereceipt", {
        object:this.invoiceDate[0]
      }).then(res => {
        this.$message.success("换票成功");
        this.openInvoiceShow = false ;
        this.$parent.pageList();
      })
    },

  }
};
</script>

<style scoped>
/*下单弹窗团期信息样式*/
.planBorder{width: 95%;margin: 0 30px 10px 0;font-size: 14px;line-height: 25px;}
.order-title{font-size: 14pt; color:#000;line-height: 40px;}
.controlButton{position: absolute; top: 8px; right: 10px;}
.fl{float: left;}
.ml13{margin: 0 0 0 13px;}
.state01{text-align: center; background: #ffaa00; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;}
.state02{text-align: center; background: #008000; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;float: left;}
.state03{color:#008000;float: left; line-height: 30px; margin: 10px 0 0 10px; font-weight: bold;}
.state04{text-align: center; background: #eb0000; border-radius: 5px; color: #fff;width:60px;padding: 2px; margin: 10px 0 0 0;}
.pro-info{margin: 15px 0 20px 0;line-height: 30px;}
.table{margin: 10px 0 0 0;padding:1px;}
.w200{width: 200px;}
.associated{background: #e6f3fc;border: 1px solid #d5f0fc; line-height: 30px;border-radius: 5px;overflow: hidden;}
.warning{float: left;color: #108ee9;margin: 0 0 0 15px;font-size: 16px;}
.relateditems{color: #108ee9; margin: 0 5px 0 5px;}
.aggregate{margin: 0 0 0 15px;float: left;}
.aggregate span{ margin: 0 0 0 15px;}
.w150{width: 100px;}
.validation{color: red;width: 140px;line-height: 30px;}
</style>