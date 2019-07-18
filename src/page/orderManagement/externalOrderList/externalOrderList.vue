<template>
  <div class="vivo" style="position:relative">
    <div class="demo-input-suffix ">
      <span class="search-title">产品名称:</span>
      <el-input v-model="activeForm.title" class="input"></el-input>
      <span class="search-title" style="margin-right: 40px;">订单ID:</span>
      <el-input v-model="activeForm.oid" class="input"></el-input>
      <span class="search-title">销售时间:</span>
      <el-date-picker v-model="activeForm.startTime" type="date" placeholder="开始天数"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.endTime" type="date" placeholder="结束天数"></el-date-picker><br /><br />
      <span class="search-title">报账状态:</span>
      <el-select v-model="activeForm.status" placeholder="请选择" style="width:200px">
        <el-option key="0" label="审批中" value="0"></el-option>
        <el-option key="1" label="驳回" value="1"></el-option>
        <el-option key="2" label="通过" value="2"></el-option>
      </el-select>
      <span class="search-title">是否关联产品:</span>
      <el-select v-model="activeForm.proRelation" placeholder="请选择" style="width:200px">
        <el-option key="1" label="是" value="1"></el-option>
        <el-option key="2" label="否" value="2"></el-option>
      </el-select>
      <span class="search-title">导入时间:</span>
      <el-date-picker v-model="activeForm.importStartTime" type="date" placeholder="开始天数"></el-date-picker>
      <div class="date-line"></div>
      <el-date-picker v-model="activeForm.importEndTime" type="date" placeholder="结束天数"></el-date-picker><br /><br />
      <span class="search-title">关联团期:</span>
      <el-input v-model="activeForm.tour" class="input"></el-input>
      <div class="button_select">
        <el-button type="primary" @click="searchHand()" size="medium">搜索</el-button>
        <el-button type="primary" @click="resetHand()" size="medium">重置</el-button>
      </div>
    </div>
    <div class="main">
      <el-button type="primary" @click="importOrder" plain>导入订单</el-button>
      <el-button type="primary" :disabled="reable" @click="delOrder" plain>删除订单</el-button>
      <el-button type="primary" :disabled="reable" @click="relation" plain>关联</el-button>
      <el-button type="primary" :disabled="reable" @click="unbinding" plain>解绑</el-button>
    </div>
    <Relation :dialogFormVisible="dialogFormVisible" @close="close"></Relation>
    <ImportOrder :dialogFormVisible2="dialogFormVisible2" @close2="close2"></ImportOrder>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="'美团('+MtNumber+')'" name="one">
        <One @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></One>
      </el-tab-pane>
      <el-tab-pane :label="'途牛('+TnNumber+')'" name="two">
        <Two @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Two>
      </el-tab-pane>
      <el-tab-pane :label="'携程('+XcNumber+')'" name="three">
        <Three @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Three>
      </el-tab-pane>
      <el-tab-pane :label="'有赞('+YzNumber+')'" name="four">
        <Four @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Four>
      </el-tab-pane>
      <el-tab-pane :label="'去哪('+QnNumber+')'" name="five">
        <Five @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Five>
      </el-tab-pane>
      <el-tab-pane :label="'飞猪('+FzNumber+')'" name="six">
        <Six @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Six>
      </el-tab-pane>
      <el-tab-pane :label="'马蜂窝('+MfNumber+')'" name="seven">
        <Seven @getNumber="getNumber" @selection="selection" :activeForm="activeForm" :reable="reable" :pid="pid" :transmit="transmit"></Seven>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import One from '@/page/orderManagement/externalOrderList/externalChild/one'
import Two from '@/page/orderManagement/externalOrderList/externalChild/two'
import Three from '@/page/orderManagement/externalOrderList/externalChild/three'
import Four from '@/page/orderManagement/externalOrderList/externalChild/four'
import Five from '@/page/orderManagement/externalOrderList/externalChild/five'
import Six from '@/page/orderManagement/externalOrderList/externalChild/six'
import Seven from '@/page/orderManagement/externalOrderList/externalChild/seven'
import Relation from '@/page/orderManagement/externalOrderList/externalChild/relation'
import ImportOrder from '@/page/orderManagement/externalOrderList/externalChild/importOrder'
export default {
  name: "externalOrderList",
  components: {
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Relation,
    ImportOrder,
  },
  data() {
    return {
      activeName: 'one',
      activeForm: {
        title: '',
        oid: '',
        startTime: '',
        endTime: '',
        importStartTime: '',
        importEndTime: '',
        status: '',
        proRelation: '',
        tour: '',
      },
      reable: true,
      pid: '',
      transmit: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      MtNumber: 0,
      TnNumber: 0,
      XcNumber: 0,
      YzNumber: 0,
      QnNumber: 0,
      FzNumber: 0,
      MfNumber: 0,
    }
  },
  computed: {
    // 计算属性的 getter
  },
  watch: {},
  methods: {
    getNumber(type, number) {
      switch (type) {
        case 'Mt':
          this.MtNumber = number
          break;
        case 'Tn':
          this.TnNumber = number
          break;
        case 'Xc':
          this.XcNumber = number
          break;
        case 'Yz':
          this.YzNumber = number
          break;
        case 'Qn':
          this.QnNumber = number
          break;
        case 'Fz':
          this.FzNumber = number
          break;
        case 'Mf':
          this.MfNumber = number
          break;
        default:
      }
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
    importOrder() {
      this.dialogFormVisible2 = true
    },
    close2() {
      this.dialogFormVisible2 = false
    },
    delOrder() {
      console.log(this.pid)
      this.$confirm('是否删除此外部订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //关联
    relation() {
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    //解绑
    unbinding() {
      console.log(this.pid)
      this.$confirm('是否需要解绑选中订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '解绑成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解绑'
        });
      });
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
        title: '',
        oid: '',
        startTime: '',
        endTime: '',
        importStartTime: '',
        importEndTime: '',
        status: '',
        proRelation: '',
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
    padding: 20px;

    .search-title {
      font-size: 14px;
      margin-left: 20px;
      margin-top: 10px;
    }

    .el-input {
      width: auto;
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
      margin-left: 45%;
    }

  }

  .main {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: left;
    //margin-left: 50px;

    .select_button {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9eaea;
      text-align: left;
      padding-left: 50px;
    }
  }

}



.el-tabs__nav>>>.el-tabs__item {
  font-size: 30px !important;
}

.el-autocomplete>>>.el-input--small .el-input__inner {
  height: 35px !important;
}

</style>
