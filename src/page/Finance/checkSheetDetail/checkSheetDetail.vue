<style lang="scss" scoped>
.check-sheet-detail{
  width: 1124px;
  &>header{
    width: 100%;
    .button-ground{
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

<template>
  <div class="check-sheet-detail">
    <header>
      <div class="button-ground" 
        v-if="type=== 'add'">
        <el-button type="primary" size="small">提交</el-button>
        <el-button type="primary" size="small">打印</el-button>
        <el-button type="info" size="small">取消</el-button>
      </div>
      <div class="button-ground" 
        v-if="type=== 'normal'">
        <el-button type="primary" size="small">提交</el-button>
        <el-button type="primary" size="small">打印</el-button>
        <el-button type="info" size="small">取消</el-button>
      </div>
      <div class="button-ground" 
        v-if="type=== 'mine'">
        <el-button type="danger" size="small">驳回</el-button>
        <el-button type="primary" size="small">通过</el-button>
        <el-button type="primary" size="small">打印</el-button>
        <el-button type="info" size="small">取消</el-button>
      </div>
    </header>
    <main>
      <print-ground ref="printGround"
       :proto="printData">
      </print-ground>
    </main>
  </div>
</template>

<script>
/**
 * 有两个地方可以进入本页 1. 团期计划中的新增报账单或者查看报账单（isCheckSheet来判断） 2. 财务报账单中的查看报账单详情
 * 1. 通过 /addCheckSheet 进入，携带planID和isCheckSheet两个参数 isCheckSheet? finance/checksheet/api/getforplan: finance/checksheet/api/getforother
 * 2. 通过 /checkSheetDetail 进入，携带有财务报账单进入此页面时的tab和搜索条件等状态
 */

import { getPreCheckSheetByPlanID, getCheckSheetByPlanID, getCheckSheetByID } from './api'
import printGround from './comps/printGround/printGround'

export default {
  components: { printGround },

  // 创建和唤醒都要从新执行init
  mounted(){
    this.init();
  },
  activated(){
    this.init();
  },

  data(){
    return Object.assign(
      // 状态
      {
        type: null, // 类型 add, mine, normal 
      },
      // 数据
      {
        printData: null,
      }
    )
  },

  methods: {
    init(){
      this.type= this.choosePageType();
      console.log(this.$refs.printGround)
      this[this.type+ 'Init']();
    },

    addInit(){
      let { planID }= this.$route.query;
      getPreCheckSheetByPlanID(planID)
      .then(res => this.$refs.printGround.init(res))
    },

    mineInit(){
      let { id }= this.$route.query;
      getCheckSheetByID(id)
      .then(res => this.$refs.printGround.init(res))
    },

    normalInit(){
      let { id, planID }= this.$route.query;
      new Pormise((resolve, reject) => {
        if(id) resolve(getCheckSheetByID(id));
        if(planID) resolve(getCheckSheetByPlanID(planID));
      })
      .then(res => this.$refs.printGround.init(res))
    },

    choosePageType(){
      let { path, query }= this.$route;
      // 如果进的是checkSheetDetail，则以query中的type作为type
      if(path=== '/checkSheetDetail') return query.type;
      // 如果进的是addSheetDetail
      return query.isCheckSheet? 'normal': 'add';
    }
  }
}
</script>