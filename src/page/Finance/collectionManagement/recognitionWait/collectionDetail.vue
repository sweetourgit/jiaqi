<template>
  <div class="vivo" style="position:relative" id="tradeDetail">
    <el-dialog :visible="dialogFormVisible1" @close="closeAdd" style="width: 100%">
      <div class="buttonDv" style="float: right;margin-right: 3%;">
        <el-button type="primary" @click="closeAdd" style="margin-right: 10px" plain>取消</el-button>
        <!--<el-button type="primary" @click="deleteDo" v-if="baseInfo.approved != 1">删除</el-button>-->
        <el-button type="primary" @click="editBtn">撤销</el-button>
      </div>
      <p class="stepTitle">基本信息</p>
      <el-button type="info" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 1">待认收款</el-button>
      <el-button type="success" round size="mini" style="margin-left: 4%;" v-if="baseInfo.status_rece == 2">已认完</el-button>
      <div class="stepDv">
        <p class="inputLabel"><span>收款单号：</span>{{baseInfo.ID}}</p>
        <p class="inputLabel"><span>申请人：</span>{{applicant}}</p>
        <p class="inputLabel"><span>申请时间：</span>{{baseInfo.creatTime}}</p>
        <p class="inputLabel"><span>收款时间：</span>{{baseInfo.creditTime}}</p>
        <p class="inputLabel"><span>收款账户：</span>{{baseInfo.payAccount}}</p>
        <p class="inputLabel"><span>收款金额：</span>{{baseInfo.payMoney}}</p>
        <p class="inputLabel"><span>剩余认款金额：</span>{{baseInfo.payMoney}}</p>
        <p class="inputLabel"><span>摘要：</span>{{baseInfo.payMoney}}</p>
        <p class="inputLabel"><span>款项说明：</span>{{baseInfo.mark}}</p>

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
      <p class="stepTitle">认款信息</p>
      <div class="stepDv">
        <p class="inputLabel"><span>认款方式：</span>{{baseInfo.ID}}</p>
        <p class="inputLabel"><span>认款人：</span>{{applicant}}</p>
        <p class="inputLabel"><span>认款时间：</span>{{baseInfo.creatTime}}</p>
        <p class="inputLabel"><span>分销商：</span>{{baseInfo.creditTime}}</p>
      </div>
      <p class="stepTitle">认款订单</p>
      <div class="stepDv" style="margin-bottom: 50px;">
        <el-table ref="singleTable" :data="tableDataXQ" border style="width: 96%;margin: 0 auto;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center" >
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="订单费用" align="center">
            <!--<template slot-scope="scope">-->
              <!--<span>收入:{{scope.row.income}}</span><br>-->
              <!--<span>单票成本:{{scope.row.single_cost}}</span><br>-->
              <!--<span>总成本:{{scope.row.cost}}</span>-->
            <!--</template>-->
          </el-table-column>
        </el-table>
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
          ID: '',
//          applicant: '',
          creatTime: '',
          creditTime: '',
          mark: '',
          payAccount: '',
          payAccountID: '',
          distributor: '',
          payMoney: '',
          startTime: '',
          endTime: '',
          toCollection: '',
          approved: '',
          status_rece: ''
        },
        applicant: '',
        fileList: [],
        tableDataSK: [],
        tableDataXQ: [],
        totalItem: '',
        totalMoney: '',
        startTime: '',
        endTime: '',
        tableDataDD: [],
        dialogFormVisible: false,

        showSK: true,
        showXQ: false,

        payList: {
          '1': '产品自销',
          '2': '授信支付',
          '3': '微信',
          '4': '易宝云企付',
          '5': '余额支付',
          '6': '支付宝',
          '7': '自采'
        }
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
          ID: '',
          creatTime: '',
          creditTime: '',
          mark: '',
          payAccount: '',
          payAccountID: '',
          distributor: '',
          payMoney: '',
          startTime: '',
          endTime: '',
          toCollection: '',
          approved: '',
          status_rece: ''
        };
        this.totalItem = '';
        this.totalMoney = '';
        this.startTime = '';
        this.endTime = '';
        this.fileList = [];
        this.tableDataSK = [];
        this.tableDataXQ = [];
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
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/predeposit/predeposit/viewbasic", {
          "id": this.info
        }, ).then(function(response) {
          console.log('详情',response);
          if (response.data.code == '200') {
            that.rece_codeEdit = response.data.data.rece_code;
            response.data.data.created_at = formatDate(new Date(response.data.data.created_at*1000));
            response.data.data.receivables_at = formatDate(new Date(response.data.data.receivables_at*1000));
            response.data.data.rece_start = formatDate(new Date(response.data.data.rece_start*1000));
            response.data.data.rece_end = formatDate(new Date(response.data.data.rece_end*1000));
            that.baseInfo = {
              ID: response.data.data.id,
              creatTime: response.data.data.created_at,
              creditTime: response.data.data.receivables_at,
              payAccount: response.data.data.account_id,
              payAccountID: response.data.data.account_id,
              mark: response.data.data.explain,
              distributor: response.data.data.distributor,
              payMoney: response.data.data.rece_money,
              startTime: response.data.data.rece_start,
              endTime: response.data.data.rece_end,
              toCollection: response.data.data.money_wait,
              approved: response.data.data.approved,
              status_rece: response.data.data.status_rece
            };
            that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
              "id": response.data.data.create_uid
            },{
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              }
            }).then(function(response) {
              console.log('名字',response.data.object.name);
              if (response.data.isSuccess) {
                that.applicant = response.data.object.name;
              } else {
                that.$message.warning("失败~");
              }
            }).catch(function(error) {
              console.log(error);
            });

            if(response.data.data.file != '' && response.data.data.type == 1){
              that.fileList = response.data.data.file;
              for(let i = 0; i < that.fileList.length; i++){
                that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
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
                that.fileList = response.data.data.file;
                for(let i = 0; i < that.fileList.length; i++){
                  that.fileList[i].url = that.GLOBAL.serverSrcPhp + that.fileList[i].url;
                }
              }
              that.tableDataSK = [];
              that.tableDataXQ = response.data.data.list;
              that.tableDataXQ.forEach(function (item, index, arr) {
                item.sale_at = formatDate(new Date(item.sale_at*1000));
                item.check_at = formatDate(new Date(item.check_at*1000));
                item.import_at = formatDate(new Date(item.import_at*1000));
                that.$http.post(that.GLOBAL.serverSrc + "/org/api/userget", {
                  "id": item.create_uid
                },{
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                  }
                }).then(function(response) {
                  console.log('名字',response.data.object.name);
                  if (response.data.isSuccess) {
                    item.create_uid = response.data.object.name;
                  } else {
                    that.$message.warning("失败~");
                  }
                }).catch(function(error) {
                  console.log(error);
                });
              });
              that.totalItem = '';
              that.totalMoney = '';
              that.startTime = '';
              that.endTime = '';
              that.showSK = false;
              that.showXQ = true;
            }else{
              that.tableDataSK = '';
              that.tableDataXQ = '';
              that.totalItem = '';
              that.totalMoney = '';
              that.showSK = true;
              that.showXQ = false;
            }
            that.$http.post(that.GLOBAL.serverSrc + "/finance/collectionaccount/api/get",
              {
                "id": response.data.data.account_id
              },{
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              }).then(function (obj) {
//                that.tableDataZH = obj.data.objects;
              console.log('账户查询',obj);
              if(obj.data.isSuccess){
                that.baseInfo.payAccount = obj.data.object.title;
              }
            }).catch(function (obj) {
              console.log(obj)
            });
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
