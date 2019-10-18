<template>
  <div class="vivo" style="position:relative" id="tradeDetail">
    <el-dialog :visible="dialogFormVisible1" @close="closeAdd" style="width: 100%">
      <div class="buttonDv" style="float: right;margin-right: 3%;">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <el-button type="primary" @click="editBtn">撤销</el-button>
      </div>
      <p class="stepTitle">基本信息</p>
      <el-button type="warning" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 10">未认款</el-button>
      <el-button type="info" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 11">待认收款</el-button>
      <el-button type="success" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 12">已认完</el-button>
      <div class="stepDv">
        <p class="inputLabel"><span>收款单号：</span>{{baseInfo.rece_code}}</p>
        <p class="inputLabel"><span>申请人：</span>{{baseInfo.create_uid}}</p>
        <p class="inputLabel"><span>申请时间：</span>{{baseInfo.created_at}}</p>
        <p class="inputLabel"><span>收款时间：</span>{{baseInfo.receivables_at}}</p>
        <p class="inputLabel"><span>收款账户：</span>{{baseInfo.account}}</p>
        <p class="inputLabel"><span>收款金额：</span>{{baseInfo.rece_money}}</p>
        <p class="inputLabel"><span>剩余认款金额：</span>{{baseInfo.remain_money}}</p>
        <p class="inputLabel"><span>摘要：</span>{{baseInfo.remark}}</p>
        <p class="inputLabel"><span>款项说明：</span>{{baseInfo.explain}}</p>

        <div class="inputLabel">
          <span style="vertical-align: top;">凭证：</span>
          <!--<el-upload ref="upload1" class="upload-demo" action="" :file-list="fileList" :disabled="disabled">-->
          <!--<el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>-->
          <!--</el-upload>-->

          <ul style="display: inline-block;width: 70%;list-style: none;padding: 0;margin: 0;">
            <li v-for="item in fileList">
              <a :href="item.url" target="_blank">{{item.name}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="baseInfo.rec_mode == '分销商预存款'">
        <p class="stepTitle">认款信息</p>
        <div class="stepDv">
          <p class="inputLabel"><span>认款方式：</span>{{baseInfo.rec_mode}}</p>
          <p class="inputLabel"><span>认款人：</span>{{baseInfo.rec_uid}}</p>
          <p class="inputLabel"><span>认款时间：</span>{{baseInfo.rec_created_at}}</p>
          <p class="inputLabel"><span>分销商：</span>{{baseInfo.distributor_code}}</p>
        </div>
      </div>
      <div v-if="baseInfo.rec_mode == '订单收款'">
        <p class="stepTitle">认款信息</p>
        <div class="stepDv">
          <p class="inputLabel"><span>认款方式：</span>{{baseInfo.rec_mode}}</p>
          <p class="inputLabel"><span>认款人：</span>{{baseInfo.rec_uid}}</p>
          <p class="inputLabel"><span>认款时间：</span>{{baseInfo.rec_created_at}}</p>
          <p class="inputLabel"><span>分销商：</span>{{baseInfo.distributor}}</p>
          <p class="inputLabel"><span>款项入账时间：</span>{{baseInfo.distributor}}</p>
          <div class="inputLabel" v-if="fileListDD.length != 0">
            <span style="vertical-align: top;">凭证：</span>
            <!--<el-upload ref="upload1" class="upload-demo" action="" :file-list="fileList" :disabled="disabled">-->
            <!--<el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>-->
            <!--</el-upload>-->

            <ul style="display: inline-block;width: 70%;list-style: none;padding: 0;margin: 0;">
              <li v-for="item in fileListDD">
                <a :href="item.url" target="_blank">{{item.name}}</a>
              </li>
            </ul>
          </div>
          <div class="inputLabel" v-else>
          </div>
        </div>
      </div>

      <div v-if="baseInfo.status_rece == 12 && baseInfo.rec_mode == '分销商预存款'">
        <p class="stepTitle">认款订单</p>
        <div class="stepDv" style="margin-bottom: 50px;">
          <el-table ref="singleTable" :data="tableDataFXS" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
            <el-table-column prop="order_sn" label="订单ID" align="center" >
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称" align="center">
            </el-table-column>
            <el-table-column prop="income" label="订单费用" align="center">
              <!--<template slot-scope="scope">-->
              <!--<span>收入:{{scope.row.income}}</span><br>-->
              <!--<span>单票成本:{{scope.row.single_cost}}</span><br>-->
              <!--<span>总成本:{{scope.row.cost}}</span>-->
              <!--</template>-->
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-if="baseInfo.status_rece == 12 && baseInfo.rec_mode == '订单收款'">
        <p class="stepTitle" v-if="showSK">收款明细</p>
        <div class="stepDv" style="margin-bottom: 50px;" v-if="showSK">
          <div class="lineTitle"><i class="el-icon-info"></i>&nbsp;&nbsp;已关联&nbsp;{{totalItem}}&nbsp;项 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总计：{{totalMoney}}元  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款入账时间段：{{startTime}}--{{endTime}}</div>
          <el-table ref="singleTable" :data="tableDataSK" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" height="700">
            <el-table-column prop="rece_at" label="入账时间" align="center">
            </el-table-column>
            <el-table-column prop="order_sn" label="订单编号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.plat_order_sn}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="guest_name" label="客人名称" align="center">
            </el-table-column>
            <el-table-column prop="product_name" label="产品" align="center">
            </el-table-column>
            <el-table-column prop="rece_money" label="结算金额" align="center">
            </el-table-column>
            <el-table-column prop="charge" label="手续费" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.charge}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tour_no" label="团号" align="center">
            </el-table-column>
            <el-table-column prop="divide_connect_no" label="粉联号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.divide_connect_no}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoice_no" label="发票号" align="center">
            </el-table-column>
            <el-table-column prop="" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="detailBtn(scope.row)" v-if="scope.row.order_sn != '' && scope.row.import_status == 3">绑定订单详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p class="stepTitle" v-if="showXQ">订单详情</p>
        <div class="stepDv" style="margin-bottom: 50px;" v-if="showXQ">
          <el-table ref="singleTable" :data="tableDataXQ" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass" height="700">
            <el-table-column prop="order_sn" label="订单ID" align="center" >
            </el-table-column>
            <el-table-column prop="distributor" label="分销商" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.distributor}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="product_name" label="产品名称" align="center">
            </el-table-column>
            <el-table-column prop="type_name" label="类别" align="center">
            </el-table-column>
            <el-table-column prop="sale_at" label="下单时间" align="center" width="100">
            </el-table-column>
            <el-table-column prop="option" label="费用" align="center">
              <template slot-scope="scope">
                <span>收入:{{scope.row.income}}</span><br>
                <span>单票成本:{{scope.row.single_cost}}</span><br>
                <span>总成本:{{scope.row.cost}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center">
            </el-table-column>
            <el-table-column prop="money" label="客人信息" align="center">
              <template slot-scope="scope">
                <span>取票人:{{scope.row.contact_name}}</span><br>
                <span>手机:{{scope.row.contact_phone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="check_at" label="验证时间" align="center" width="100">
            </el-table-column>
            <el-table-column prop="pay_type" label="卖出支付方式" align="center" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.pay_type_name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="import_at" label="导入时间" align="center" width="100">
            </el-table-column>
            <el-table-column prop="tour_no" label="关联产品" align="center">
              <template slot-scope="scope">
                <p v-if="scope.row.tour_no == ''">未关联产品</p>
                <p v-else>产品名称：{{scope.row.relate_pro_name}}<br>团期计划：{{scope.row.tour_no}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="create_uid" label="操作人" align="center" width="100">
            </el-table-column>
          </el-table>
        </div>
      </div>

    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import {formatDate} from '@/js/libs/publicMethod.js'
  export default {
    name: "tradeAdd",
    components: {
    },
    props: {
      dialogFormVisible1: false,
      info: ''
    },
    data() {
      return {
        disabled: true,

        baseInfo: {
          status_rece: '',
          rece_code: '',
          create_uid: '',
          created_at: '',
          receivables_at: '',
          account_id: '',
          account: '',
          rece_money: '',
          remain_money: '',
          remark: '',
          explain: '',
          rec_mode: '',
          rec_uid: '',
          rec_created_at: '',
          distributor: '',
          distributor_code: ''
        },

        recModeList: {
          '1': '分销商预存款',
          '2': '票付通余额支付',
          '3': '订单收款'
        },

        fileList: [],
        tableDataFXS: [],

        totalItem: '',
        totalMoney: '',
        startTime: '',
        endTime: '',
        tableDataSK: [],
        tableDataXQ: [],
        showSK: true,
        showXQ: false,
        fileListDD: [],

      }
    },
    computed: {
      // 计算属性的 getter
    },
    watch: {
      info: {
        handler:function(){
//          alert(this.info);
          if(this.info != '' && this.dialogFormVisible1){
            this.loadData();
          }
        }
      }
    },
    methods: {
      // 表格头部背景颜色
      getRowClass({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return 'background:#F7F7F7;color:rgb(85, 85, 85);'
        } else {
          return ''
        }
      },
//      关闭弹窗
      closeAdd(){
        this.baseInfo = {
          status_rece: '',
          rece_code: '',
          create_uid: '',
          created_at: '',
          receivables_at: '',
          account_id: '',
          account: '',
          rece_money: '',
          remain_money: '',
          remark: '',
          explain: '',
          rec_mode: '',
          rec_uid: '',
          rec_created_at: '',
          distributor: '',
          distributor_code: ''
        };

        this.$emit('close', false);
      },
//      删除
      deleteDo(){
        this.$confirm("是否删除该笔收款?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const that = this;
          this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/delrece", {
            "id": this.info
          }, ).then(function(response) {
            console.log(response);
            if (response.data.code == '200') {
              that.$message.success("删除成功~");
              that.close();
            } else {
              if(response.data.message){
                that.$message.warning(response.data.message);
              }else{
                that.$message.warning('失败~');
              }
            }
          }).catch(function(error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
//
      editBtn(){
        this.$emit('close', 'success');
      },
      detailBtn(row){
        this.dialogFormVisible = true;
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/order", {
          "order_sn": row.order_sn
        }, ).then(function(response) {
          console.log('详情',response);
          if (response.data.code == '200') {
            that.tableDataDD = [];
            response.data.data.created_at = formatDate(new Date(response.data.data.created_at*1000));
            response.data.data.sale_at = formatDate(new Date(response.data.data.sale_at*1000));
            response.data.data.check_at = formatDate(new Date(response.data.data.check_at*1000));
            that.tableDataDD.push(response.data.data);
            that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
              "id": that.tableDataDD[0].create_uid
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              }
            }).then(function(response) {

              if (response.data.isSuccess) {
                that.tableDataDD[0].create_uid = response.data.object.name
              } else {
                that.$message.success("获取申请人失败~");
              }
            }).catch(function(error) {
              console.log(error);
            });

          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
//      关闭订单详情
      close(){
        this.dialogFormVisible = false;
      },
      loadData(){
        const that = this;
        // 获取基本信息
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/predeposit/predeposit/viewbasic", {
          "id": this.info
        }, ).then(function(response) {
          console.log('详情',response);
          if (response.data.code == '200') {
            response.data.data.created_at = formatDate(new Date(response.data.data.created_at*1000));
            response.data.data.receivables_at = formatDate(new Date(response.data.data.receivables_at*1000));
            if(response.data.data.rec_created_at){
              response.data.data.rec_created_at = formatDate(new Date(response.data.data.rec_created_at*1000));
            }
            that.baseInfo = {
              status_rece: response.data.data.status_rece,
              rece_code: response.data.data.rece_code,
              create_uid: response.data.data.create_uid,
              created_at: response.data.data.created_at,
              receivables_at: response.data.data.receivables_at,
              account_id: response.data.data.account_id,
              account: response.data.data.account_id,
              rece_money: response.data.data.rece_money,
              remain_money: response.data.data.rece_money,
              remark: response.data.data.remark,
              explain: response.data.data.explain,
              rec_mode: that.recModeList[response.data.data.rec_mode],
              rec_uid: response.data.data.rec_uid,
              rec_created_at: response.data.data.rec_created_at,
              distributor: response.data.data.distributor,
              distributor_code: response.data.data.distributor_code
            };
            // 获取订单信息
            if(response.data.data.rec_mode === '1'){
              that.getOrder();
            }else if(response.data.data.rec_mode === '3'){
              that.getReceive();
            }

            // 根据ID获取人名
            that.getName(response.data.data.create_uid).then(res => {
              console.log(res);
              that.baseInfo.create_uid = res;
            });
            if(response.data.data.rec_uid){
              that.getName(response.data.data.rec_uid).then(res => {
                console.log(res);
                that.baseInfo.rec_uid = res;
              });
            }

            // 根据分销商ID获取名称
            that.$http.post(that.GLOBAL.serverSrc + "/universal/localcomp/api/get", {
              "id": response.data.data.distributor_code
            }).then(function(obj) {
//              console.log('获取分销商',obj);
              if(obj.data.isSuccess){
                that.baseInfo.distributor_code = obj.data.object.name;
              }else{
                that.$message.warning("加载数据失败~");
              }
            }).catch(function(obj) {
              console.log(obj);
            });

            // 根据账户ID获取账户名称
            that.$http.post(that.GLOBAL.serverSrc + "/finance/collectionaccount/api/get",
              {
                "id": response.data.data.account_id
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }).then(function (obj) {
//              console.log('账户查询',obj);
              if(obj.data.isSuccess){
                that.baseInfo.account = obj.data.object.title;
              }
            }).catch(function (obj) {
              console.log(obj)
            });
            // 凭证
            that.fileList = response.data.data.file;
            for(let i = 0; i < that.fileList.length; i++){
              that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
            }
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });

      },
      getName(id){
        const that = this;
        return that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
          "id": id
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(function(response) {
          console.log('名字',response.data.object.name);
          if (response.data.isSuccess) {
            return response.data.object.name;
          } else {
            that.$message.warning("失败~");
            return '';
          }
        }).catch(function(error) {
          console.log(error);
          return '';
        });
      },
      // 获取认款订单
      getOrder(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/predeposit/predeposit/viewrecorder", {
          "id": this.info
        }, ).then(function(response) {
          console.log('获取认款订单111',response);
          if (response.data.code == '200') {
              that.tableDataFXS = response.data.data;
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      },

      getReceive(){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/receivables/receivables/receive", {
          "id": this.info
        }, ).then(function(response) {
          console.log('详情',response);
          if (response.data.code == '200') {

            if(response.data.data.file != '' && response.data.data.type == 1){
              that.fileListDD = response.data.data.file;
              for(let i = 0; i < that.fileListDD.length; i++){
                that.fileListDD[i].url = that.GLOBAL.serverSrcPhp + that.fileListDD[i].url;
              }
              that.tableDataXQ = [];
              that.tableDataSK = response.data.data.list;
              that.totalItem = response.data.data.list.length;
//              that.totalMoney = response.data.data.rece_money;
//              that.startTime = response.data.data.rece_start;
//              that.endTime = response.data.data.rece_end;
//              let start = that.tableDataSK[0].rece_at;
//              let end = that.tableDataSK[0].rece_at;
//              let totalMoney = 0;
              let start = formatDate(new Date(that.tableDataSK[0].rece_at*1000)).split(" ")[0];
              let end = formatDate(new Date(that.tableDataSK[0].rece_at*1000)).split(" ")[0];
              let totalMoney = 0;
              that.tableDataSK.forEach(function (item, index, arr) {
                item.rece_at = formatDate(new Date(item.rece_at*1000));
                item.rece_at = item.rece_at.split(" ")[0];
                if(new Date(Date.parse(start)) > new Date(Date.parse(item.rece_at))){
                  start = item.rece_at;
                }
                if(new Date(Date.parse(end)) < new Date(Date.parse(item.rece_at))){
                  end = item.rece_at;
                }

                totalMoney += parseFloat(item.rece_money);
//                console.log(totalMoney);
              });

              that.totalMoney = totalMoney.toFixed(2);
              that.startTime = start;
              that.endTime = end;
              that.showSK = true;
              that.showXQ = false;
            }else if(response.data.data.type == 2 && response.data.data.list.length != 0){
              if(response.data.data.distributor == '票付通余额'){
                that.fileListDD = response.data.data.file;
                for(let i = 0; i < that.fileList.length; i++){
                  that.fileListDD[i].url = that.GLOBAL.serverSrcPhp + that.fileListDD[i].url;
                }
              }
              that.tableDataSK = [];
              that.tableDataXQ = response.data.data.list;
              let userGetList = [];
              that.tableDataXQ.forEach(function (item, index, arr) {
                item.sale_at = formatDate(new Date(item.sale_at*1000));
                item.check_at = formatDate(new Date(item.check_at*1000));
                item.import_at = formatDate(new Date(item.import_at*1000));

                if(userGetList.length == 0){
                  const userItem = {
                    id: item.create_uid,
                    itemIndex : [index]
                  };
                  userGetList.push(userItem);
                }
                for(let i = 0; i < userGetList.length; i++){
                  if (userGetList[i].id === item.create_uid) {
                    userGetList[i].itemIndex.push(index);
                  } else {
                    const userItem = {
                      id: item.create_uid,
                      itemIndex : [index]
                    };
                    userGetList.push(userItem);
                  }
                }
              });
//              console.log(userGetList);
              that.getUser(userGetList);
              that.totalItem = '';
              that.totalMoney = '';
              that.startTime = '';
              that.endTime = '';
              that.showSK = false;
              that.showXQ = true;
            }else{
              that.tableDataSK = [];
              that.tableDataXQ = [];
              that.totalItem = '';
              that.totalMoney = '';
              that.showSK = true;
              that.showXQ = false;
            }
          } else {
            that.$message.success("加载数据失败~");
          }
        }).catch(function(error) {
          console.log(error);
        });
      }
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style lang="scss">
  #tradeDetail .el-dialog{
    width: 90%;
  }
  #tradeDetail .stepTitle{
    width: 94%;
    line-height: 45px;
    font-size: 18px;
    text-indent: 20px;
    margin: 0 auto;
  }
  #tradeDetail .stepDv{
    width: 94%;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    .inputLabel{
      width: 31%;
      font-size: 14px;
      line-height: 45px;
      margin: 0;
      vertical-align: top;
      span{
        display: inline-block;
        width: 120px;
      }
    }
    .baseIn{
      width: 300px;
      vertical-align: top;
      margin: 10px auto;
    }
    .upload-demo{
      width: 80%;
      display: inline-block;
      margin: 10px auto;
    }
  }
  #tradeDetail .el-upload-list__item{
    margin-top: 10px !important;
  }
  #tradeDetail .el-upload-list__item{
    width: 100%!important;
  }
  .lineTitle{
    width: 100%;
    margin: 10px auto;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 10px;
  }
</style>
