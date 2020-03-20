<style lang="scss" scoped>
.check-sheet-detail{
  width: 1120px;
  padding-bottom: 80px;
  &>header{
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
</style>

<template>
  <div class="check-sheet-detail">
    <header>
      <div>
        <el-button type="primary" size="small"
          v-show="type=== 'add'"
          @click="awakeBasicForm">
          编辑
        </el-button>
        <el-button type="primary" size="small"
          v-show="type=== 'add'"
          @click="awakeExpenseForm">
          编辑挂账信息
        </el-button>
      </div>

      <div class="button-ground" 
        v-show="type=== 'add'">
        <el-button type="primary" size="small"
          @click="postCheckSheetAction">
          提交
        </el-button>
        <el-button type="primary" size="small"
          @click="printHandler">
          打印
        </el-button>
        <el-button type="info" size="small"
          @click="backPage">
          取消
        </el-button>
      </div>
      <div class="button-ground" 
        v-show="type=== 'normal'">
        <el-button type="primary" size="small"
          @click="printHandler">
          打印
        </el-button>
        <el-button type="info" size="small"
          @click="backPage">
          取消
        </el-button>
      </div>
      <div class="button-ground" 
        v-show="type=== 'mine'">
        <el-button type="danger" size="small"
          @click="approvalHandler()">
          驳回
        </el-button>
        <el-button type="primary" size="small"
          @click="approvalHandler(true)">
          通过
        </el-button>
        <el-button type="primary" size="small"
          @click="printHandler">
          打印
        </el-button>
        <el-button type="info" size="small"
          @click="backPage">
          取消
        </el-button>
      </div>
    </header>
    <main>
      <print-ground ref="printGround" :class="type"></print-ground>
    </main>
    <footer>
      <approval-form
        ref="approvalForm"
        @save-action="approvalSaveHandler">
      </approval-form>
    </footer>
  </div>
</template>

<script>
/**
 * 有两个地方可以进入本页 1. 团期计划中的新增报账单或者查看报账单（isCheckSheet来判断） 2. 财务报账单中的查看报账单详情
 * 1. 通过 /addCheckSheet 进入，携带planID和isCheckSheet两个参数 isCheckSheet? finance/checksheet/api/getforplan: finance/checksheet/api/getforother
 * 2. 通过 /checkSheetDetail 进入，携带有财务报账单进入此页面时的tab和搜索条件等状态
 */

import { getPreCheckSheetByPlanID, getCheckSheetByPlanID, getCheckSheetByID, postCheckSheet, rejectForJQ, agreeForJQ, endForJQ, saveChcektype, getFlowFinishedList } from './api'
import printGround from './comps/printGround/printGround'
import approvalForm from './comps/approvalForm'
import BackupMixin from './BackupMixin.js'

export default {
  mixins: [BackupMixin()],

  components: { printGround, approvalForm },

  // 创建和唤醒都要从新执行init
  mounted(){
    this.init();
  },

  data(){
    return Object.assign(
      // 状态
      {
        type: "", // 类型 add, mine, normal
        isFromCheckSheet: false,  // 是否来自报账单 
      },
      // 数据
      {
        printData: null,
      },
      {
        cacheConditions: null,  // 用来还原上个页面的条件
      }
    )
  },

  methods: {
    init(){
      this.type= this.choosePageType();
      this[this.type+ 'Init']();
    },

    // 新增
    addInit(){
      let { planID }= this.$route.query;
      getPreCheckSheetByPlanID(planID)
      .then(res => {
        this.getCacheCheckSheet(planID, res);
        this.$refs.printGround.init(res, this.type);
      })
    },

    // 需要我审批
    mineInit(){
      let { id }= this.$route.query;
      let payload;
      getCheckSheetByID(id)
      .then(res => {
        payload= res;
        let { guid }= res;
        return getFlowFinishedList(guid)
      })
      .then(res => {
        Object.assign(payload, { finishedList: res });
        this.$refs.printGround.init(payload, this.type)
      })
    },

    // 普通
    normalInit(){
      let { id, planID }= this.$route.query;
      let payload;
      new Promise((resolve, reject) => {
        if(id) return resolve(getCheckSheetByID(id));
        if(planID) return resolve(getCheckSheetByPlanID(planID));
      })
      .then(res => {
        payload= res;
        let { guid }= res;
        return getFlowFinishedList(guid)
      })
      .then(res => {
        Object.assign(payload, { finishedList: res });
        this.$refs.printGround.init(payload, this.type)
      })
    },

    /**
     * @type1 : 来自团期计划，会携带 planID 和 isCheckSheet
     * @type2 : 来自报账单，会携带 id:报账单id / tab:来自报账单的all还是mine / conditions:报账单的搜索条件
     * @type3 : 来自已办，会携带comeFrom
     */
    choosePageType(){
      let { path, query }= this.$route;
      let { id, planID, isCheckSheet, tab, conditions, workItemID, guid,
        comeFrom
      }= query;
      this.cacheConditions= conditions;
      this.isFromCheckSheet= tab? true: false;
      this.$router.replace({ path, query: { id, planID, isCheckSheet, tab, workItemID, guid, comeFrom } });
      if(isCheckSheet=== '0') return 'add';
      // 如果[ isCheckSheet 不为 undefined ]或者[ tab 是 all ] 只能查看
      if(!this.$isNull(isCheckSheet) || tab=== 'all' || comeFrom ) return 'normal';
      return 'mine';
    },

    postCheckSheetAction(){
      let object= this.$refs.printGround.getData();
      if(!object) return;
      this.cacheCheckSheet(object);
      this.createTimeMaker(object.expenses);
      postCheckSheet(object)
      .then(res => {
        let { path, query }= this.$route;
        let { planID }= query;
        this.$router.replace({ path, query: { planID, isCheckSheet: 1 } });
        this.init();
      })
    },

    createTimeMaker(expenses){
      let createTime= new Date().toISOString();
      expenses.forEach(expense => {
        if(!expense.createTime) expense.createTime= createTime;
      })
      return expenses;
    },

    awakeBasicForm(){
      this.$refs.printGround.awakeBasicForm();
    },

    awakeExpenseForm(){
      this.$refs.printGround.awakeExpenseForm();
    },

    printHandler(){
      let dom= this.$refs.printGround.$el;
      dom= dom.cloneNode(true);
      Array.from(dom.querySelectorAll('.editable-cell')).forEach(dom => {
        dom.remove();
      })
      this.$printDom(dom);
    },

    backPage(){
      let { 
        tab,
        comeFrom
      }= this.$route.query;
      
      // 来自已办的逻辑
      if(comeFrom){
        this.$store.commit('doneAll/referDoneAllShowWhichTab', 'sheet'); 
        this.$store.commit('doneAll/showSheetTab', 'sheetTeam');
        return this.$router.replace({ path: '/doneAll/list' });
      }
      
      this.isFromCheckSheet?
        this.$router.replace({ path: '/checkSheet/team', query: { tab, conditions: this.cacheConditions }})
          : this.$router.replace({ path: '/regimentPlan/teamPlanList' });  
    },

    approvalHandler(isAgree){
      this.$refs.approvalForm.wakeup({ isAgree });
    },

    /**
     * @description: 
     * @bug 1587: 驳回由驳回到上一步，变为驳回的最开始 
     */
    approvalSaveHandler(payload){
      let { commentText, isAgree }= payload;
      let { guid, workItemID }= this.$route.query;
      // 1587
      let rejectWorkItemID= this.$refs.printGround.finishedList[0].ObjectId;

      let userCode= sessionStorage.getItem('tel');
      let action;
      action= isAgree? 
        agreeForJQ({commentText, workItemID, userCode}): 
          rejectForJQ({commentText, workItemID: rejectWorkItemID, userCode})
          .then(() => {
            return endForJQ({ jQ_ID: guid, jQ_Type: 5 });
          })
          .then(() => {
            return saveChcektype({ guid, checkType: 2 })
          })
      action.then(() => {
        // 重置页面按钮 防止点击
        this.type= 'normal';
        this.$message.success(isAgree? '审批完成': '驳回完成');
        this.backPage();
      })
      .catch(err => {
        this.$message.error(isAgree? '审批通过失败': '驳回失败');
      })
    }
  }
}
</script>