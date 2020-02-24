<template>
  <div class="vivo">
    <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="同业" name="first">
        <SameTradeManagement ref="SameTradeManagement"></SameTradeManagement>
      </el-tab-pane>
      <el-tab-pane label="直客" name="second">
        <StraightGuestManagement ref="StraightGuestManagement"></StraightGuestManagement>
      </el-tab-pane>
      <el-tab-pane label="外部订单收款" name="fourth">
        <externalOrder></externalOrder>
      </el-tab-pane>
      <el-tab-pane label="内部收款" name="five">
        <distributorsInfo ref="distributorsInfo"></distributorsInfo>
      </el-tab-pane>
      <el-tab-pane label="待认款收款" name="six">
        <recognitionWait></recognitionWait>
      </el-tab-pane>
      <el-tab-pane label="报销还款" name="seven">
        <reimbursement ref="reimbursement"></reimbursement>
      </el-tab-pane>
      <el-tab-pane :label="'需要您审批('+ totalNum +')'" name="third" v-if="showApproval">
        <PendingApprovalManagement ref="PendingApprovalManagement"></PendingApprovalManagement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import StraightGuestManagement from '@/page/Finance/collectionManagement/straightGuestManagement'
import SameTradeManagement from '@/page/Finance/collectionManagement/sameTradeManagement'
import PendingApprovalManagement from '@/page/Finance/collectionManagement/pendingApproval/pendingApprovalManagement.vue'
import externalOrder from '@/page/Finance/collectionManagement/externalOrder/externalOrderManagement.vue'
import reimbursement from '@/page/Finance/collectionManagement/Reimbursement/reimbursement.vue'
import distributorsInfo from '@/page/Finance/collectionManagement/distributorsInfo/distributorsInfo.vue'
import recognitionWait from '@/page/Finance/collectionManagement/recognitionWait/recognitionWait.vue'
export default {
  name: "collectionManagement",
  components: {
    SameTradeManagement, // 同业
    StraightGuestManagement, // 直客
    PendingApprovalManagement, // 需要您审批
    externalOrder,
    distributorsInfo, // 内部收款
    reimbursement,
    recognitionWait
  },
  data() {
    return {
      activeName: 'first', // 当前tab选项卡默认状态
      clickTab:'', // 点击切换获取当前值
      totalNum: 0,
      showApproval: false
    }
  },
  computed: {},
  methods: {
    appr(){
      alert("审批按钮！");
    },
    // 获取当前项的标题
    handleClick(tab, event) {// 点击切换获取当前值
      if(tab.label == "直客"){
        this.getStraightGuestManagement();
      } else if(tab.label == "报销还款"){
        this.$refs.reimbursement.searchHandInside()
      }else{
        this.pageList();
      }
      this.clickTab = tab.label;
    },
    // 直客查询列表
    getStraightGuestManagement() {
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/collection/api/page", {
          "pageIndex": 1,
          "pageSize": that.pageSize,
          "object": {
            "id": 0,
            "checkType": this.settlement_01?this.settlement_01:-1,
            "collectionTime": "2019-05-16",
            "startTime": this.startTime ? formatDate(this.startTime, 'yyyy-MM-dd') : "2000-05-16",
            "endTime": this.endTime ? formatDate(this.endTime, 'yyyy-MM-dd') : "2099-05-16",
            "groupCode": this.plan ? this.plan : '',
            "planID": 0,
            "orderID": 0,
            "orderNumber": "",
            "collectionNumber": "",
            "price": 0,
            "dept": 0,
            "createUser": this.accepter ? this.accepter : '',
            "createTime": "2019-05-16 01:02:40",
            "code": "",
            "serialNumber": "",
            "abstract": "",
            "isDeleted": 0,
            "collectionType":1,//直客1.同业2
            "localCompID":0,//直客0,同业变成同业社id
          }

        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      .then(function(obj) {
        that.total = obj.data.total;
        that.tableData = obj.data.objects;
        that.tableData.forEach(function(v, k, arr) {
          arr[k]['collectionNumber'] = that.accountList[arr[k]['collectionNumber']]
          arr[k]['checkTypeStatus'] = that.checkTypeList[arr[k]['checkType']]
          arr[k]['collectionTime'] = arr[k]['collectionTime'].replace('T', " ").split('.')[0]
          arr[k]['createTime'] = arr[k]['createTime'].replace('T', " ").split('.')[0]
        })
      })
      .catch(function(obj) {})
    },
    // 同业查询列表
    pageList() {
      var that = this
      this.$http.post(
        this.GLOBAL.serverSrc + "/finance/collection/api/page",
        {
          "pageSize":this.pagesize,
          "pageIndex":this.currentPage,
          "total": 0,
          "object": {
            "collectionType":2,//直客1.同业2
            "localCompID":this.sid,//直客0,同业变成同业社id
          }
        })
        .then(function (obj) {
          that.total = obj.data.total
          that.tableData = obj.data.objects
        })
        .catch(function (obj) {})
    }
  },
  created() {
    this.pageList();
    if(this.$route.params.tabStatus){
      this.activeName = this.$route.params.tabStatus
    }

    const buttonperms = JSON.parse(sessionStorage.getItem('butPermission'));
    // console.log(buttonperms)
    for (let i = 0; i < buttonperms.length; i++){
      if (buttonperms[i] == 'needyourapproval') {
        this.showApproval = true;
        break;
      }
    }
    // console.log(this.showApproval)
  },
  mounted(){
//    console.log(this.$refs.PendingApprovalManagement);
  }
}

</script>
<style lang="scss" scoped>
  .vivo{
    position: relative;
  }
</style>
