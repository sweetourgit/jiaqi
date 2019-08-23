<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">报账团期：</span>
      <el-input v-model="activeForm.tour" class="input" placeholder="请输入"></el-input>
      <span class="search-title">操作人：</span>
      <!--<el-input v-model="activeForm.user" class="input" placeholder="请输入"></el-input>-->
      <el-autocomplete class="input" v-model="activeForm.user" :fetch-suggestions="querySearchOper" placeholder="请输入操作人员" @select="handleSelectOper"></el-autocomplete>
      <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium" plain>重置</el-button>
      </div>
    </div>
    <div class="main">
      <el-button type="primary" @click="startNumber('发票号','发票起始号:')" plain>发票起始号：{{invoiceStart}}</el-button>
      <el-button type="primary" @click="startNumber('收款编码号','收款编码起始号:')" plain>收款编码起始号：{{receivStart}}</el-button>
    </div>
    <StartNumber :dialogFormVisible="dialogFormVisible" @close="close" :frameTitle1="frameTitle1" :frameTitle2="frameTitle2"></StartNumber>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="认款记录" name="one">
        <Record ref="record" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Record>
      </el-tab-pane>
      <el-tab-pane :label="'需要您审批 ('+number+')'" name="two">
        <Approval ref="approval" @getNumber="getNumber" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Approval>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import Record from '@/page/Finance/pledgingManagement/pledgingManagementInfo/record'
import Approval from '@/page/Finance/pledgingManagement/pledgingManagementInfo/approval'
import StartNumber from '@/page/Finance/pledgingManagement/pledgingManagementInfo/startNumber'
export default {
  name: "pledgingManagement",
  components: {
    Record,
    Approval,
    StartNumber,
  },
  data() {
    return {
      activeName: 'one',
      activeForm: {
        user: '',
        userID: '',
        tour: ''
      },
      operatorList: [],
      reable: true,
      pid: '',
      frameTitle1: '',
      frameTitle2: '',
      transmit: false,
      dialogFormVisible: false,
      number: 10,
      invoiceStart: '12321',
      receivStart: '214321'
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    getNumber(number) {
      this.number = number;
    },
    handleClick() {
      this.reable = true;
      this.transmit = !this.transmit;
      this.pid = '';
    },
    startNumber(title, name) {
      this.frameTitle1 = title;
      this.frameTitle2 = name;
      this.dialogFormVisible = true;
    },
    close() {
      this.dialogFormVisible = false;
    },
    //搜索
    searchHand() {
      if(this.activeName == "one"){
        this.$refs.record.loadDataRecord();
      }else{
        this.$refs.approval.loadDataApproval();
      }
    },
    resetHand() {
      this.activeForm = {
        user: '',
        c: '',
        tour: '',
      };
      if(this.activeName == "one"){
        this.$refs.record.loadDataRecord();
      }else{
        this.$refs.approval.loadDataApproval();
      }
    },
    querySearchOper(queryString, cb){
      const operatorList = this.operatorList;
      var results = queryString ? operatorList.filter(this.createFilter1(queryString)) : operatorList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter1(queryString) {
      return (operatorList) => {
        return (operatorList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelectOper(item){
      console.log(item);
      this.activeForm.userID = item.id;
    },
    loadData(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/params/parameter/getinvoice", {}, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.invoiceStart = response.data.data.value;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
      this.$http.post(this.GLOBAL.serverSrcPhp + "/api/v1/params/parameter/getreceiv", {}, ).then(function(response) {
        if (response.data.code == '200') {
          console.log(response);
          that.receivStart = response.data.data.value;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    loadOper(){
      const that = this;
      this.$http.post(this.GLOBAL.serverSrc + "/org/api/userlist", {
        "object": {
          "id": 0,
          "createTime": '2019-08-23T03:03:10.386Z',
          "isDeleted": 0,
          "code": "",
          "mobile": "",
          "name": "",
          "email": "",
          "userCode": "",
          "passWord": "",
          "iDcard": "",
          "tourGuide": "",
          "sex": 0,
          "userType": 0,
          "userState": 0,
          "orgID": 0,
          "orgName": "",
          "user_Position": [
            {
              "id": 0,
              "userID": 0,
              "positionID": 0,
              "positionName": "",
              "isDefault": 0,
              "orgID": 0,
              "orgName": ""
            }
          ]
        }
      },{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function(response) {

        if (response.data.isSuccess) {
//            console.log('操作人员列表',response.data.objects);
          let operatorList = [];
          response.data.objects.forEach(function (item, index, arr) {
            const operator = {
              'value' : item.name,
              'id' : item.id
            };
            operatorList.push(operator);
          });
          that.operatorList = operatorList;
        } else {
          that.$message.success("加载数据失败~");
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  created() {
    this.loadData();
    this.loadOper();
  }

}

</script>
<style lang="scss" scoped>
.vivo {
  .demo-input-suffix {
    width: auto;
    background-color: #F7F7F7;
    padding: 40px;
    margin-top: 20px;

    .search-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .el-input {
      width: 20%;
    }

    .el-input__inner {
      width: 10%;
    }

    .demo-input-suffix {
      width: 900px
    }

    .date-line {
      width: 10px;
      border-bottom: 1px solid #e6e6e6;
      display: inline-block;
      margin: 0 3px 3px 0
    }

    .button_select {
      display: inline;
      margin-left: 15%;
    }

  }

  .main {
    margin-top: 40px;
    margin-bottom: 20px;
    text-align: left;
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
