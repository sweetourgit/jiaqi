<!-- 周边借款tab下的子tab -->
<template>
  <div>
    <el-tabs v-model="tabCollectionShowWhich" :tab-position="tabPosition" @tab-click="handleClick">
      <el-tab-pane :label="'无收入借款(' + noIncomeNum +')'" name="noIncomeBorrowing">
        <noIncomeBorrowing ref="noIncomeBorrowing" :whereSheetTab="whereSheetTab" @handlePassVal="noIncomeNumGet"></noIncomeBorrowing>
      </el-tab-pane>
      <el-tab-pane :label="'预付款管理(' + advanceNum +')'" name="advancePayment">
        <advancePayment ref="advancePayment" :whereSheetTab="whereSheetTab" @handlePassVal="advanceNumGet"></advancePayment>
      </el-tab-pane>
      <el-tab-pane :label="'余额支付借款(' + balanceNum +')'" name="balancePayment">
        <balancePayment ref="balancePayment" :whereSheetTab="whereSheetTab" @handlePassVal="balanceNumGet"></balancePayment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import noIncomeBorrowing from "./noIncomeBorrowing";
  import advancePayment from "./advancePayment";
  import balancePayment from "./balancePayment";
  export default {
    name: "borrowing",
    components: {
      noIncomeBorrowing,
      advancePayment,
      balancePayment
    },
    data() {
      return {
        noIncomeNum: 0,
        advanceNum: 0,
        balanceNum: 0,
        tabCollectionShowWhich: 'noIncomeBorrowing',
        tabPosition: 'left',
        whereSheetTab:'noIncomeBorrowing',
      }
    },
    props:{
      whereTab: String
    },
    created() {
      // this.tabCollectionShowWhich = this.$store.state.doneAll.collectionWhichTab
    },
    mounted() {
      // this.$refs.collectionDirect.getTableData()
    },
    watch: {
      tabChange: function(val, oldVal){
        if(val === 'borrowing'){
          Promise.all([
            this.$refs.noIncomeBorrowing.loadFinished(this.$refs.noIncomeBorrowing.ruleForm, 'NoIncomeLoan_ZB'),
            this.$refs.advancePayment.loadFinished(this.$refs.advancePayment.ruleForm, 'IncomeLoan_ZB'),
            this.$refs.balancePayment.loadFinished(this.$refs.balancePayment.ruleForm, 'BalancePayment_ZB')
          ]).then((result) => {
            let totalCount = 0
            result.forEach((item) => {
              totalCount += item
            })
            this.$emit('handlePassVal', totalCount)
          }).catch((error) => {
            console.log(error)
          })
        }
      }
    },
    computed: {
      tabChange: function () {
        return this.whereTab
      }
    },
    methods: {
      handleClick(tab, event) {
        // let keepTabName = tab.name
        // this.whereSheetTab = keepTabName
        // if( keepTabName == 'noIncomeBorrowing'){
        //   this.$refs.noIncomeBorrowing.loadFinished('NoIncomeLoan_ZB')
        // }else if (keepTabName == 'advancePayment'){
        //   this.$refs.advancePayment.loadFinished('IncomeLoan_ZB')
        // } else if(keepTabName == 'balancePayment') {
        //   this.$refs.balancePayment.loadFinished('BalancePayment_ZB')
        // } else {}
      },
      noIncomeNumGet(paramsPassCount){
        if(paramsPassCount > this.noIncomeNum){
          this.noIncomeNum = paramsPassCount
        }
      },
      advanceNumGet(paramsPassCount){
        if(paramsPassCount > this.advanceNum){
          this.advanceNum = paramsPassCount
        }
      },
      balanceNumGet(paramsPassCount){
        if(paramsPassCount > this.balanceNum){
          this.balanceNum = paramsPassCount
        }
      }
    }
  }
</script>

<style scoped>

</style>
