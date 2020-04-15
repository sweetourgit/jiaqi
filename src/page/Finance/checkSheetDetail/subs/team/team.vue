/*
* @Author: WZJ
* @Last Modified by: WZJ
*/
<!-- 2020-3-31 -->
<style lang="scss" scoped>
  .check-sheet-detail {
  padding-bottom: 80px;
  & > header {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
</style>

<template>
  <div class="check-sheet-detail">
    <header style="overflow :visible;position:relative">
      <div>
        <el-button type="primary" size="small" v-show="type=== 'add'" @click="awakeBasicForm">编辑</el-button>
        <el-button type="primary" size="small" v-show="type=== 'add'" @click="awakeExpenseForm">编辑挂账信息</el-button>
      </div>

      <div class="button-ground" style="position:fixed;right:5%;" v-show="type=== 'add'">
        <el-button type="primary" size="small" @click="postCheckSheetAction">提交</el-button>
        <el-button type="primary" size="small" @click="printHandler">打印</el-button>
        <el-button type="info" size="small" @click="backPage">取消</el-button>
      </div>
      <div class="button-ground" style="position:fixed;right:5%;" v-show="type=== 'normal'">
        <el-button type="primary" size="small" @click="printHandler">打印</el-button>
        <el-button type="info" size="small" @click="backPage">取消</el-button>
      </div>
      <div class="button-ground" style="position:fixed;right:5%;" v-show="type=== 'mine'">
        <el-button type="danger" size="small" @click="approvalHandler()">驳回</el-button>
        <el-button type="primary" size="small" @click="approvalHandler(true)">通过</el-button>
        <el-button type="primary" size="small" @click="printHandler">打印</el-button>
        <el-button type="info" size="small" @click="backPage">取消</el-button>
      </div>
    </header>
    <main>
      <print-ground ref="printGround" :class="type"></print-ground>
    </main>
    <footer>
      <approval-form ref="approvalForm" @save-action="approvalSaveHandler"></approval-form>
    </footer>
  </div>
</template>

<script>
  /**
   * 有两个地方可以进入本页 1. 团期计划中的新增报账单或者查看报账单（isCheckSheet来判断） 2. 财务报账单中的查看报账单详情
   * 1. 通过 /addCheckSheet 进入，携带planID和isCheckSheet两个参数 isCheckSheet? finance/checksheet/api/getforplan: finance/checksheet/api/getforother
   * 2. 通过 /checkSheetDetail 进入，携带有财务报账单进入此页面时的tab和搜索条件等状态
   */

  import {
    getPreCheckSheetByPlanID,
    getCheckSheetByPlanID,
    getCheckSheetByID,
    postCheckSheet,
    rejectForJQ,
    agreeForJQ,
    endForJQ,
    saveChcektype,
    getFlowFinishedList,
    getBatchplaninfos,
    updplanstatus
  } from "./api";
  import printGround from "./comps/printGround/printGround";
  import approvalForm from "./comps/approvalForm";
  import BackupMixin from "./BackupMixin.js";
  import {
    mapMutations
  } from "vuex";
  export default {
    mixins: [BackupMixin()],

    components: {
      printGround,
      approvalForm
    },
    created() {

    },
    // 创建和唤醒都要从新执行init
    mounted() {
      this.init();
      this.auditResult(this.$route.query.guid, 5);
    },

    data() {
      return Object.assign(
        // 状态
        {
          type: "", // 类型 add, mine, normal
          isFromCheckSheet: false // 是否来自报账单
        },
        // 数据
        {
          printData: null
        }, {
          cacheConditions: null // 用来还原上个页面的条件
        }
      );
    },

    methods: {
      ...mapMutations("review", {
        setReviewList: "setReviewList"
      }),
      // 审核结果
      auditResult(result, paramJqType) {
        let _this = this;
        this.$http
          .post(
            this.GLOBAL.jqUrl +
            "/JQ/GetInstanceActityInfoForJQ", {
              jq_id: result,
              jQ_Type: paramJqType // 无收入1 预付款2,
            }
          )
          .then(obj => {
            if (obj.data.code == -1) {
              this.$message.error(obj.data.msg)
            } else {
              this.setReviewList(obj.data.extend.instanceLogInfo)
            }
            // 裡面的具提屬性沒有調試
            // _this.tableCourse = [];
            // _this.tableCourse = obj.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      },
      init() {
        this.type = this.choosePageType();
        this[this.type + "Init"]();
      },
      // 新增
      async addInit() {
        let {
          planID,
          productType
        } = this.$route.query;
        //测试 记得删
        // productType = 4
        let response = await getBatchplaninfos(planID)
        if (productType == 4) {

          if (response == false) return
          response = response[0][0]
        }

        getPreCheckSheetByPlanID(planID, productType).then(res => {
          this.getCacheCheckSheet(planID, res);
          if (productType == 4) {
            res.teamProTitle = response.product_name
            res.groupCode = response.tour_no
            res.date = response.set_out_time
          }
          this.groupCode = res.groupCode; // 作为草稿唯一标识
          this.$refs.printGround.init(res, this.type);
        });
      },

      // 需要我审批
      mineInit() {
        let {
          id,
          productType
        } = this.$route.query;
        let payload;
        getCheckSheetByID(id, productType)
          .then(res => {
            payload = res;
            let {
              guid
            } = res;
            return getFlowFinishedList(guid);
          })
          .then(res => {
            Object.assign(payload, {
              finishedList: res
            });
            this.$refs.printGround.init(payload, this.type);
          });
      },

      // 普通
      normalInit() {

        let {
          id,
          planID,
          productType
        } = this.$route.query;
        let payload;
        new Promise((resolve, reject) => {
            if (id) return resolve(getCheckSheetByID(id, productType));
            if (planID) return resolve(getCheckSheetByPlanID(planID, productType));
          })
          .then(res => {
            payload = res;
            let {
              guid
            } = res;
            return getFlowFinishedList(guid);
          })
          .then(res => {
            Object.assign(payload, {
              finishedList: res
            });
            this.$refs.printGround.init(payload, this.type);

          });
      },

      /**
       * @type1 : 来自团期计划，会携带 planID 和 isCheckSheet
       * @type2 : 来自报账单，会携带 id:报账单id / tab:来自报账单的all还是mine / conditions:报账单的搜索条件
       * @type3 : 来自已办，会携带comeFrom
       */
      choosePageType() {
        let {
          path,
          query
        } = this.$route;
        let {
          id,
          planID,
          isCheckSheet,
          tab,
          conditions,
          workItemID,
          guid,
          comeFrom,
          productType
        } = query;

        this.cacheConditions = conditions;
        this.isFromCheckSheet = tab ? true : false;
        let name = ''
        if (productType == 1) {
          name = '报账单详情-跟团游'
        } else if (productType == 4) {
          name = '报账单详情-邮轮'
        }
        this.$router.replace({
          path,
          name,
          query: {
            id,
            planID,
            isCheckSheet,
            tab,
            workItemID,
            guid,
            comeFrom,
            productType
          }
        });
        if (isCheckSheet === "0") return "add";
        // 如果[ isCheckSheet 不为 undefined ]或者[ tab 是 all ] 只能查看
        if (!this.$isNull(isCheckSheet) || tab === "all" || comeFrom)
          return "normal";
        return "mine";
      },

      postCheckSheetAction() {
        let object = this.$refs.printGround.getData();
        //上线记得替换
        object.productType=this.$route.query.productType
        // object.productType = 4
        if (!object) return;
        this.cacheCheckSheet(object);
        this.createTimeMaker(object.expenses);
        postCheckSheet(object).then(async res => {
          let flag = true
          //上线记得删
          // this.$route.query.productType = 4
          let name = null

          if (this.$route.query.productType == 4) {
            flag = await updplanstatus(this.$route.query.planID, 2)
            name = '报账单详情-邮轮'
          }
          if (flag == false) return
          let {
            path,
            query
          } = this.$route;
          let {
            planID
          } = query;
          this.$router.replace({
            path,
            query: {
              planID,
              name,
              isCheckSheet: 1,
              productType: this.$route.query.productType
            }
          });
          this.init();
        });
      },

      createTimeMaker(expenses) {
        let createTime = new Date().toISOString();
        expenses.forEach(expense => {
          if (!expense.createTime) expense.createTime = createTime;
        });
        return expenses;
      },

      awakeBasicForm() {
        this.$refs.printGround.awakeBasicForm();
      },

      awakeExpenseForm() {
        this.$refs.printGround.awakeExpenseForm();
      },

      printHandler() {
        let dom = this.$refs.printGround.$el;
        dom = dom.cloneNode(true);
        let removeDom = [
          ...dom.querySelectorAll(".editable-cell"),
          ...dom.querySelectorAll(".review-collection")
        ];
        Array.from(removeDom).forEach(dom => {
          dom.remove();
        });
        this.$printDom(dom);
      },

      backPage() {
        let {
          tab,
          comeFrom
        } = this.$route.query;

        // 来自已办的逻辑
        if (comeFrom) {
          this.$store.commit("doneAll/referDoneAllShowWhichTab", "sheet");
          this.$store.commit("doneAll/showSheetTab", "sheetTeam");
          return this.$router.replace({
            path: "/doneAll/list"
          });
        }
        let isFromToDO = false
        if (this.$route.sourceToDo != undefined) {
          isFromToDO = true
        }
        if (isFromToDO) {
          this.$router.replace({
            path: "/toDo/ILabel"
          })
        } else {
          this.isFromCheckSheet ?
            this.$router.replace({
              path: "/checkSheet/team",
              query: {
                tab,
                conditions: this.cacheConditions
              }
            }) :
            this.$router.replace({
              path: "/regimentPlan/teamPlanList"
            });
        }

      },

      approvalHandler(isAgree) {
        this.$refs.approvalForm.wakeup({
          isAgree
        });
      },

      /**
       * @description:
       * @bug 1587: 驳回由驳回到上一步，变为驳回的最开始
       */
      approvalSaveHandler(payload) {
        let {
          commentText,
          isAgree
        } = payload;
        let {
          guid,
          workItemID
        } = this.$route.query;
        // 1587
        let rejectWorkItemID = this.$refs.printGround.finishedList[0].objectId;
        let userCode = sessionStorage.getItem("tel");
        let action;
        action = isAgree ?
          agreeForJQ({
            commentText,
            workItemID,
            userCode
          }) :
          rejectForJQ({
            commentText,
            workItemID,
            userCode
          })
          .then(() => endForJQ({
            jQ_ID: guid,
            jQ_Type: 5
          }))
          .then(() => saveChcektype({
            guid,
            checkType: 2
          }));
        action
          .then(async () => {
            let status = isAgree ? 4 : 3
            if (this.$route.query.productType == 4) {
              await updplanstatus(this.$route.query.planID, status) // 重置页面按钮 防止点击 审批页面planID 为id
            }
            this.type = "normal";
            this.$message.success(isAgree ? "审批完成" : "驳回完成");
            this.backPage();
          })
          .catch(err => {
            this.$message.error(isAgree ? "审批通过失败" : "驳回失败");
          });
      }
    }
  };
</script>
