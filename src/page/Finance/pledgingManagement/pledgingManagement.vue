<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">报账团期：</span>
      <el-input v-model="activeForm.tour" class="input" placeholder="请输入"></el-input>
      <span class="search-title">操作人：</span>
      <el-input v-model="activeForm.user" class="input" placeholder="请输入"></el-input>
      <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
      </div>
    </div>
    <div class="main">
      <el-button type="primary" @click="startNumber('发票号','发票起始号:')" plain>发票起始号：T123456</el-button>
      <el-button type="primary" @click="startNumber('收款编码号','收款编码起始号:')" plain>收款编码起始号：123456</el-button>
    </div>
    <StartNumber :dialogFormVisible="dialogFormVisible" @close="close" :frameTitle1="frameTitle1" :frameTitle2="frameTitle2"></StartNumber>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="认款记录" name="one">
        <Record @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Record>
      </el-tab-pane>
      <el-tab-pane :label="'需要您审批 ('+number+')'" name="two">
        <Approval @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Approval>
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
        tour: '',
      },
      reable: true,
      pid: '',
      frameTitle1: '',
      frameTitle2: '',
      transmit: false,
      dialogFormVisible: false,
      number: 10,
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    getNumber(number) {
      this.number = number
    },
    selection(reable, pid) {
      this.reable = reable
      this.pid = pid
    },
    handleClick() {
      this.reable = true
      this.transmit = !this.transmit
      this.pid = ''
    },
    startNumber(title, name) {
      this.frameTitle1 = title
      this.frameTitle2 = name
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    //搜索
    searchHand() {
      this.$message({
        type: 'success',
        message: '搜索成功!'
      });
    },
    resetHand() {
      this.activeForm = {
        user: '',
        tour: '',
      }
    }
  },
  created() {}

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
