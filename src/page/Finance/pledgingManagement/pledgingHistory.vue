<template>
  <div class="vivo" style="position:relative" id="pledgingHistory">
    <div class="buttonDv">
      <el-button type="primary" @click="cancel()" size="medium" plain class="cancalBtn">取消</el-button>
    </div>
    <div class="mainContain">
      <el-tabs v-model="activeName">
        <el-tab-pane label="收款编码" name="one">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :hide-timestamp="timestampHide"
              :size="size"
              placement="top">
              <p class="titleP">第{{index + 1}}次审批</p>
              <el-table ref="singleTable" :data="activity.info" border style="width: 100%" :header-cell-style="getRowClass">
                <el-table-column prop="rec_sn" label="收款编码" align="center">
                </el-table-column>
                <el-table-column prop="status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.approval_status == 1">审批中</span>
                    <span v-if="scope.row.approval_status == 2" style="color: red;">驳回</span>
                    <span v-if="scope.row.approval_status == 3" style="color: green;">通过</span>
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="detailsRece(scope.row.id)" size="small" class="table_details">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane label="发票" name="two">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities1"
              :key="index"
              :size="size"
              :hide-timestamp="timestampHide"
              placement="top">
              <p class="titleP">第{{index + 1}}次审批</p>
              <el-table ref="singleTable" :data="activity.info" border style="width: 100%" :header-cell-style="getRowClass">
                <el-table-column prop="rec_sn" label="发票" align="center">
                </el-table-column>
                <el-table-column prop="invoiceInfo" label="发票信息" align="center">
                  <template slot-scope="scope">
                    <span>发票抬头：{{scope.row.title}}</span><br>
                    <span>纳税人识别号：{{scope.row.pay_taxes_no}}</span><br>
                    <span>手机号：{{scope.row.phone}}</span><br>
                    <span>地址：{{scope.row.address}}</span><br>
                    <span>开户行：{{scope.row.bank}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="voucher" label="凭证" align="center">
                  <template slot-scope="scope">
                    <p v-for="item in scope.row.file">
                      <a :href="item.url" target="_blank">{{item.name}}</a>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column prop="approval_status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.approval_status == 1">审批中</span>
                    <span v-if="scope.row.approval_status == 2" style="color: red;">驳回</span>
                    <span v-if="scope.row.approval_status == 3" style="color: green;">通过</span>
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="300">
                  <template slot-scope="scope">
                    <el-button @click="detailsInvo(scope.row.id)" size="small" class="table_details">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="收款编码详情" :visible="dialogFormVisible" width=90% @close="close" id="dialogRece">
      <div class="table_trip" style="width: 100%;">
        <div class="approval">
          <el-row>
            <el-col :span="2.5">
              <div class="grid-content bg-purple">收款编码：</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">&nbsp;{{receiptCode}}</div>
            </el-col>
            <el-col :span="2.5">
              <div class="grid-content bg-purple">审批：</div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">&nbsp;{{approval}}</div>
            </el-col>
            <el-col :span="2.5">
              <div class="grid-content bg-purple">审批意见：</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">&nbsp;{{approvalOpinions}}</div>
            </el-col>
          </el-row>
        </div>
        <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney}}元 </div>
        <el-table ref="singleTable" :data="tableData" border style="width: 95%;margin: 0 30px 28px;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="成本" align="center">
          </el-table-column>
          <el-table-column prop="income" label="收入" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="客人信息" align="center">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.approval_money" :disabled="true" placeholder="申请金额"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="footer" style="text-align: right;">
        <el-button class="el-button" type="warning" @click="close">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="发票详情" :visible="dialogFormVisible1" width=90% @close="close" id="dialogInvo">
      <div class="approval">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="发票抬头" prop="title" label-width="120px">
                <el-input v-model="ruleForm.title" :disabled="true" class="inputWidth" maxlength="80" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="纳税人识别号：" prop="number" label-width="150px">
                <el-input v-model="ruleForm.number" :disabled="true" class="inputWidth" maxlength="80" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号:" prop="phone" label-width="150px">
                <el-input v-model="ruleForm.phone" :disabled="true" class="inputWidth" maxlength="11" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地址：" prop="address" label-width="120px">
                <el-input v-model="ruleForm.address" :disabled="true" class="inputWidth" maxlength="80" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="开户行：" prop="bank" label-width="150px">
                <el-input v-model="ruleForm.bank" :disabled="true" class="inputWidth" maxlength="80" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="凭证:" prop="voucher" label-width="120px">
                <el-upload class="upload-demo" :disabled="true" action="" :file-list="fileList">
                  <!--<el-button size="small" type="info" :disabled="true">点击上传</el-button>-->
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="totalMoney"><i class="el-icon-info"></i>总计：{{totalMoney1}}元 </div>
      <div class="table_trip">
        <el-table ref="singleTable" :data="tableData1" border style="width: 95%;margin: 0 30px 28px;" :header-cell-style="getRowClass">
          <el-table-column prop="order_sn" label="订单ID" align="center">
          </el-table-column>
          <el-table-column prop="product_name" label="产品名称" align="center">
          </el-table-column>
          <el-table-column prop="distributor" label="分销商" align="center">
          </el-table-column>
          <el-table-column prop="cost" label="成本" align="center">
          </el-table-column>
          <el-table-column prop="income" label="收入" align="center">
          </el-table-column>
          <el-table-column prop="guestInformation" label="客人信息" align="center">
            <template slot-scope="scope">
              <span>取票人:{{scope.row.contact_name}}</span><br>
              <span>手机:{{scope.row.contact_phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column prop="proce_amount" label="未处理金额" align="center">
          </el-table-column>
          <el-table-column prop="money" label="申请金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.approval_money" :disabled="true" placeholder="申请金额"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer" style="text-align: right;">
        <el-button class="el-button" type="warning" @click="close">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        activeName: 'one',
        activities: [],//收款编码列表数据
        activities1: [],//发票列表数据
        size: 'large',//时间轴size
        timestampHide: true,//是否隐藏时间
//        收款编码详情数据
        dialogFormVisible: false,
        receiptCode: '',
        approval: '',
        approvalOpinions: '',
        totalMoney: '',
        tableData: [],
//        发票详情数据
        ruleForm: {
          title: '',
          number: '',
          phone: '',
          address: '',
          bank: '',
          voucher: '',
        },
        totalMoney1: '',
        fileList: [],
        dialogFormVisible1: false,
        tableData1: []
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
//      返回上一页
      cancel(){
        this.$router.go(-1);
      },
//      获取收款编号详情
      detailsRece(id){
        const that = this;
        that.dialogFormVisible = true;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/recognition/recognition/recognitioninfo", {
          "id": id
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log('详情',response);
            if(response.data.data.approval_status == 1){
              that.approval = '审批中';
            }else if(response.data.data.approval_status == 2){
              that.approval = '驳回';
            }else if(response.data.data.approval_status == 3){
              that.approval = '通过';
            }
            that.receiptCode = response.data.data.rec_sn;
            that.approvalOpinions = response.data.data.approval_comments;
            that.tableData = response.data.data.order_list;
            let total = 0;
            response.data.data.order_list.forEach(function (item, index, arr) {
              total += parseFloat(item.approval_money);
            });
            that.totalMoney = total;
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("详情数据加载失败~");
            }
            that.dialogFormVisible = false;
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
//      获取发票详情
      detailsInvo(id){
        const that = this;
        that.dialogFormVisible1 = true;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/recognition/recognition/recognitioninfo", {
          "id": id
        }, ).then(function(response) {
          if (response.data.code == '200') {
//            console.log('详情',response);
            that.ruleForm = {
              title: response.data.data.title,
              number: response.data.data.pay_taxes_no,
              phone: response.data.data.phone,
              address: response.data.data.address,
              bank: response.data.data.bank,
            };
            that.approvalStatus = response.data.data.approval_status;
            that.fileList = response.data.data.file;
            that.tableData1 = response.data.data.order_list;
            let total = 0;
            response.data.data.order_list.forEach(function (item, index, arr) {
              total += parseFloat(item.approval_money);
            });
            that.totalMoney1 = total;
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("详情数据加载失败~");
            }
            that.dialogFormVisible1 = false;
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
//      关闭弹窗
      close(){
        this.dialogFormVisible = false;
        this.dialogFormVisible1 = false;
      },
//      加载数据
      loadData(apply_type){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/recognition/recognition/receiptlist", {
          "tour_no": this.$route.query.tour_no,
          "apply_type": apply_type
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            if(apply_type == 1){
              that.activities = response.data.data.list;
            }else if(apply_type == 2){
              that.activities1 = response.data.data.list;
              if(that.activities1.length != 0){
                that.activities1.forEach(function (item, index, arr) {
//                  console.log(item);
                  for(let i = 0; i < item.info.length; i++){
                    item.info[i].file = typeof item.info[i].file == 'string' ? JSON.parse(item.info[i].file) : item.info[i].file;
                    if(item.info[i].file.length != 0){
                      for(var j = 0; j < item.info[i].file.length; j++){
                        item.info[i].file[j].url = that.GLOBAL.serverSrcPhp + item.info[i].file[j].url;
                      }
                    }
                  }
                })
              }
            }
          } else {
            if(response.data.message){
              that.$message.warning(response.data.message);
            }else{
              that.$message.warning("数据加载失败~");
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
      }

    },
    created() {
      if(this.$route.query.tour_no){
//        加载收款编码
        this.loadData(1);
//        加载发票
        this.loadData(2);
      }else{
        this.cancel();
      }
    }
  }

</script>
<style lang="scss">
  #pledgingHistory .buttonDv{
    text-align: right;
    .cancalBtn{
      margin-right: 50px;
    }
  }
  #pledgingHistory .mainContain{
    margin-top: 30px;
    margin-bottom: 50px;
    .el-timeline{
      margin-top: 20px;
      .el-timeline-item__content{
        font-size: 20px;
      }
    }
    .titleP{
      font-size: 18px;
      font-weight: 700;
    }
  }
  #dialogRece .totalMoney, #dialogInvo .totalMoney{
    width: 95%;
    background-color: #E6F3FC;
    height: 30px;
    line-height: 30px;
    margin: 10px 30px;
  }
  #dialogRece .approval, #dialogInvo .approval{
    /*height: 30px;*/
    line-height: 30px;
    width: 95%;
    margin: -15px 30px 20px 30px;
  }
  #dialogInvo .el-upload-list__item {
    margin-top: 5px!important;
  }
</style>
