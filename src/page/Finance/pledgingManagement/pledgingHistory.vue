<template>
  <div class="vivo" style="position:relative">
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
              <p>{{activity.info}}</p>
              <el-table ref="singleTable" :data="activity.info" border style="width: 100%">
                <el-table-column prop="id" label="收款编码" align="center">
                  <template slot-scope="scope">
                    {{scope.row}}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.approval_status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="details(scope.row)" size="small" class="table_details">详情</el-button>
                    <el-button @click="revoke(scope.row)" type="danger" size="small" class="table_details" v-if="scope.row.approval_status != 1 && noReimbursement">撤销</el-button>
                    <el-button @click="adopt(scope.row)" type="success" size="small" class="table_details" v-if="scope.row.approval_status == 1 && noReimbursement">通过</el-button>
                    <el-button @click="reject(scope.row)" type="warning" size="small" class="table_details" v-if="scope.row.approval_status == 1 && noReimbursement">驳回</el-button>
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
              <el-table ref="singleTable" :data="activity.info" border style="width: 100%">
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
                <el-table-column prop="status" label="审批状态" align="center">
                  <template slot-scope="scope">
                    {{status[scope.row.approval_status]}}
                  </template>
                </el-table-column>
                <el-table-column prop="approval_comments" label="审批意见" align="center">
                </el-table-column>
                <el-table-column prop="approval_money" label="审批金额" align="center">
                </el-table-column>
                <el-table-column prop="option" label="操作" align="center" width="300">
                  <template slot-scope="scope">
                    <el-button @click="details(scope.row)" size="small" class="table_details">详情</el-button>
                    <el-button @click="revoke(scope.row)" type="danger" size="small" class="table_details" v-if="scope.row.approval_status != 1 && noReimbursement">撤销</el-button>
                    <el-button @click="adopt(scope.row)" type="success" size="small" class="table_details" v-if="scope.row.approval_status == 1 && noReimbursement">通过</el-button>
                    <el-button @click="reject(scope.row)" type="warning" size="small" class="table_details" v-if="scope.row.approval_status == 1 && noReimbursement">驳回</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        activeName: 'one',
        activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15'
        }, {
          content: '通过审核',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }],
        activities1: [{
          content: '哈哈哈哈哈哈哈哈',
          timestamp: '2018-04-15'
        }, {
          content: '啊啊啊啊啊啊',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }],
        size: 'large',
        timestampHide: true
      }
    },
    methods: {
      cancel(){
        this.$router.go(-1);
      },
      loadData(apply_type){
        const that = this;
        this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/recognition/recognition/receiptlist", {
          "tour_no": this.$route.query.tour_no,
          "apply_type": apply_type
        }, ).then(function(response) {
          if (response.data.code == '200') {
            console.log(response);
            if(apply_type == 1){
//              that.activities = response.data.data.list;
//              that.activities.forEach(function (item, index, arr) {
//                item.
//              })
            }else if(apply_type == 2){
//              that.activities1 = response.data.data.list;
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
<style lang="scss" scoped>
  .buttonDv{
    text-align: right;
    .cancalBtn{
      margin-right: 50px;
    }
  }
  .mainContain{
    margin-top: 30px;
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
</style>
