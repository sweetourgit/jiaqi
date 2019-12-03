<template>
  <div class="bankStatement">
    <el-tabs v-model="activeName" @tab-click="handleClick">
     <el-tab-pane label="中国银行" name="first">
        <bankOfChina></bankOfChina>
      </el-tab-pane>
      <el-tab-pane label="兴业银行" name="second">
        <industrialBank></industrialBank>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import bankOfChina from '@/page/Finance/bankStatement/bankOfChina.vue'
import industrialBank from '@/page/Finance/bankStatement/industrialBank.vue'
export default {
  name: "bankStatement",
  components: {
    bankOfChina, // 中国银行
    industrialBank // 兴业银行
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
      
    }
  },
  created() {

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
