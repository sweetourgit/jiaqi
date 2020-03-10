<template>
  <div class="bankStatement">
    <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="中国银行" name="first">
        <!-- <bankOfChinaSK></bankOfChinaSK> -->
        <el-tabs type="border-card">
          <el-tab-pane label="收款">
            <bankOfChinaSK></bankOfChinaSK>
          </el-tab-pane>
          <el-tab-pane  label="手续费">
            <bankOfChinaSXF></bankOfChinaSXF>
          </el-tab-pane>
          <el-tab-pane  label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="兴业银行" name="second">
        <!-- <industrialBankSK></industrialBankSK> -->
        <el-tabs type="border-card" @tab-click="handleClick">
          <el-tab-pane label="收款">
            <industrialBankSK></industrialBankSK>
          </el-tab-pane>
          <el-tab-pane  label="手续费">
            <industrialBankSXF></industrialBankSXF>
          </el-tab-pane>
          <el-tab-pane  label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
       <el-tab-pane label="农业银行" name="third">
        <!-- <industrialBankSK></industrialBankSK> -->
        <el-tabs type="border-card" @tab-click="handleClick">
          <el-tab-pane  label="收款">
            <agriculturalBankSK></agriculturalBankSK>
          </el-tab-pane>
          <el-tab-pane v-if="!OnlySK" label="手续费">
          </el-tab-pane>
          <el-tab-pane v-if="!OnlySK" label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
       <el-tab-pane label="招商银行" name="forth">
        <!-- <industrialBankSK></industrialBankSK> -->
        <el-tabs type="border-card" @tab-click="handleClick">
          <el-tab-pane label="收款">
           <merchantsBankSK></merchantsBankSK>
          </el-tab-pane>
          <el-tab-pane label="手续费">
            <merchantsBankSXF></merchantsBankSXF>
          </el-tab-pane>
          <el-tab-pane label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="建设银行" name="fivth">
        <!-- <industrialBankSK></industrialBankSK> -->
        <el-tabs type="border-card" @tab-click="handleClick">
          <el-tab-pane label="收款">
           <constructionBankSK></constructionBankSK>
          </el-tab-pane>
          <el-tab-pane label="手续费">
            <constructionBankSXF></constructionBankSXF>
          </el-tab-pane>
          <el-tab-pane label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="中信银行" name="sixth">
        <!-- <industrialBankSK></industrialBankSK> -->
        <el-tabs type="border-card" @tab-click="handleClick">
          <el-tab-pane label="收款">
           <citicBankSK></citicBankSK>
          </el-tab-pane>
          <el-tab-pane label="手续费">
            <merchantsBankSXF></merchantsBankSXF>
          </el-tab-pane>
          <el-tab-pane label="付款">暂时不写</el-tab-pane>
        </el-tabs>
      </el-tab-pane>
 <el-tab-pane label="吉林中信银行" name="seventh">
        <!-- <industrialBankSK></industrialBankSK> -->
        <el-tabs type="border-card" @tab-click="handleClick">
          <el-tab-pane label="收款">
           <jilinCiticBankSK></jilinCiticBankSK>
          </el-tab-pane>
          <el-tab-pane label="手续费">
            <merchantsBankSXF></merchantsBankSXF>
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
import agriculturalBankSK from '@/page/Finance/bankStatement/agriculturalBankSK.vue'
import merchantsBankSK from '@/page/Finance/bankStatement/merchantsBankSK.vue'
import merchantsBankSXF from '@/page/Finance/bankStatement/merchantsBankSXF.vue'
import constructionBankSK from '@/page/Finance/bankStatement/constructionBankSK.vue'
import constructionBankSXF from '@/page/Finance/bankStatement/constructionBankSXF.vue'

import citicBankSK from '@/page/Finance/bankStatement/citicBankSK.vue'
import jilinCiticBankSK from '@/page/Finance/bankStatement/jilinCiticBankSK.vue'

export default {
  name: "bankStatement",
  components: {
    bankOfChinaSK, // 中国银行
    bankOfChinaSXF,
    industrialBankSK, // 兴业银行
    industrialBankSXF,
    agriculturalBankSK,
    merchantsBankSK,
    merchantsBankSXF,
    citicBankSK,
    jilinCiticBankSK,
    constructionBankSK,
    constructionBankSXF
  },
  data() {
    return {
      activeName: 'first', // 当前tab选项卡默认状态
      clickTab:'', // 点击切换获取当前值
      OnlySK:false //控制是否只显示收款(例：农业银行无手续费、付款) 
    }
  },
  computed: {},
  methods: {
    // 获取当前项的标题
    handleClick(tab, event) {// 点击切换获取当前值
    // 暂时根据label匹配 若是后台接口能返回农业银行唯一标识 则根据唯一表示进行匹配
      if(tab.label.indexOf('农业')!=-1){
        this.OnlySK=true
      }
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
