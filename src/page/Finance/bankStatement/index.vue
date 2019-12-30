<template>
  <div class="bankStatement">
    <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="中国银行" name="first">
        <!-- <bankOfChinaSK></bankOfChinaSK> -->
        <el-tabs type="border-card">
          <el-tab-pane label="收款">
            <bankOfChinaSK></bankOfChinaSK>
          </el-tab-pane>
          <el-tab-pane label="手续费">
            <bankOfChinaSXF></bankOfChinaSXF>
          </el-tab-pane>
          <el-tab-pane label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="兴业银行" name="second">
        <!-- <industrialBankSK></industrialBankSK> -->
        <el-tabs type="border-card">
          <el-tab-pane label="收款">
            <industrialBankSK></industrialBankSK>
          </el-tab-pane>
          <el-tab-pane label="手续费">
            <industrialBankSXF></industrialBankSXF>
          </el-tab-pane>
          <el-tab-pane label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import bankOfChinaSK from '@/page/Finance/bankStatement/bankOfChinaSK.vue'
import bankOfChinaSXF from '@/page/Finance/bankStatement/bankOfChinaSXF.vue'
import industrialBankSK from '@/page/Finance/bankStatement/industrialBankSK.vue'
import industrialBankSXF from '@/page/Finance/bankStatement/industrialBankSXF.vue'
export default {
  name: "bankStatement",
  components: {
    bankOfChinaSK, // 中国银行
    bankOfChinaSXF,
    industrialBankSK, // 兴业银行
    industrialBankSXF
  },
  data() {
    return {
      activeName: 'first', // 当前tab选项卡默认状态
      clickTab:'' // 点击切换获取当前值
    }
  },
  computed: {},
  methods: {
    // 获取当前项的标题
    handleClick(tab, event) {// 点击切换获取当前值
      
    },

    routerTo1(){
      this.$router.push({
        path: '/cruiseShip',
        name: '邮轮管理'
      });
    },

    routerTo2(){
      this.$router.push({
        path: '/curiseShipCabin',
        name: '游轮舱房管理'
      });
    }
  },
  created() {
    if(this.$route.params.tabStatus){
      this.activeName = this.$route.params.tabStatus
    }
  },
  mounted() {

  }
}

</script>
<style lang="scss" scoped>
  .bankStatement{
    position: relative;
  }
</style>
