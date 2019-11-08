<style lang="scss" scoped>
$height: 40px;

.show-panel{
  position: relative;
  height: 940px;
  padding-top: $height* 5 + 10px;
  &>header{
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    &>header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #ddd;
      .date-block{

      }
      .previous::after{
        content: '过期';
        border-radius: 4px;
        color:red;
        background-color: #ddd;
        padding: 0 2px;
      }
    }
    &>main{
      .bar{
        line-height: $height;
        height: $height;
        .icon-link-outer{
          padding: 0 5px;
        }
        .icon-link-outer:hover{
          color: red;
        }
      }
    }
  }
  &>main{
    height: 940px - $height* 5 - 10px;
    overflow: auto;
    .container{
      .card-ground{
        .bar{
          line-height: $height;
          height: $height;
        }
        .red{
          color: red;
        }
      }
    }
  }
  main::-webkit-scrollbar{
    z-index:11;
    width:6px;
  }
  main::-webkit-scrollbar:horizontal{
    height:6px
  }
  main::-webkit-scrollbar-thumb{
    border-radius:5px;width:6px;background:#b4bccc
  }
  main::-webkit-scrollbar-corner{
    background:#fff
  }
  main::-webkit-scrollbar-track{
    background:#fff
  }
  main::-webkit-scrollbar-track-piece{
    background:#fff;width:6px
  }
}
</style>

<template>
  <div class="show-panel" v-show="vm.state">
    <header>
      <header>
        <div :class="['date-block', vm.previous?'previous': '']">
          {{ vm.dateText }}
        </div>
        <div class="edit-btns" v-if="!vm.previous">
          <el-button type="primary" size="small"
            @click="awakeEditForm"
          >编辑</el-button>
          <el-button type="primary" size="small" v-if="vm.share=== 1" @click="deletePlanAction">删除计划</el-button>
          <el-button type="primary" size="small" v-if="vm.share=== 2" @click="deleteInventoryAction">删除</el-button>
        </div>
      </header>
      <main>
        <div class="bar">
          库存类型：{{ vm.share=== 1? '共享': '非共享' }}
        </div>
        <div class="bar" v-if="vm.share=== 1">
          <span>
            共享库存：{{ vm.name }}
          </span>
          <span class="icon-link-outer" title="查看该共享库存"
            @click="toSharedInventoryPage"
          >
            <i class="el-icon-link"></i>
          </span>
        </div>
        <div class="bar">
          {{ vm.share=== 1? '当前剩余': '总库存' }}：{{ vm.count }}
        </div>
        <div class="bar">
          预留时长：{{ vm.dateHous+ ' 小时' }}
        </div>
      </main>
    </header>
    <main>
      <div class="container">
        <el-card style="margin-bottom: 10px; background-color: #f6f6f6;"
          shadow="never"
          v-for="(enroll, i) in enrolls" 
          :key="i">
          <div slot="header" class="clearfix">
            <span>{{ enroll.enrollName }}</span>
          </div>
          <div class="card-ground">
            <div :class="['bar', isCost(enroll.price_01)?'red':'']">
              销售价：{{ enroll.price_01 }}
            </div>
            <div :class="['bar', isCost(enroll.price_02)?'red':'']">
              同业价：{{ enroll.price_02 }}
            </div>
            <div class="bar">
              甜程结算价：{{ enroll.price_03 }}
            </div>
            <div class="bar" v-show="enroll.quota">
              配额：{{ enroll.quota }}
            </div>
          </div>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script>
import { getPlan, getInventory, deleteInventory, deletePlan } from '../../../../planInventory'
import { DAY_STATE } from '../../../../dictionary'

export default {

  inject: ['poolManager'],

  data(){
    return {
      vm: {
        state: false,
        previous: false,  // 是否过期
        dateText: '',
        share: '',
        name: '',
        regimentType: '',
        dateHous: '',
        count: 0,
        inventoryID: null,
        planID: null,
      },
      enrolls: [],
    }
  },

  methods: {
    init(){
      // 再manager上挂载该实例
      this.poolManager.initShowVM({ vm: this });
    },

    // 实质上的初始化方法
    setState(state, day){
      if(state=== DAY_STATE.MULTIPLE || state=== DAY_STATE.UNDO) return this.vm.state= false;
      this.vm.state= true;
      this.dayFactory(day)
    },

    dayFactory(day){
      let { after, dayInt, vm }= day;
      this.vm.previous= !after;
      this.vm.dateText= this.dayIntToText(dayInt);
      // 均价
      this.vm.average= this.poolManager.getAverage();
      this.vm.planID= vm.planID;
      this.enrolls.splice(0);
      this.enrolls.push(...vm.plan_Enrolls);
      return this.getInventoryAction(vm.planID);
    },

    getInventoryAction(id){
      return getPlan(id).then(res => {
        let { inventoryID, dateHous, regimentType }= res;
        this.vm.dateHous= dateHous;
        this.vm.regimentType= regimentType;
        this.vm.inventoryID= inventoryID;
        return getInventory(inventoryID).then(res2 => {
          let { share, name, count }= res2;
          this.vm.share= share;
          this.vm.name= name;
          this.vm.count= count;
        })
      })
    },

    deleteInventoryAction(){
      this.$confirm(`确定要删除当前库存及计划吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteInventory(this.vm.inventoryID).then(res => {
          this.$message.success('计划删除成功');
          let day= this.poolManager.currentDay;
          this.$emit('refresh-date-panel', { sureDate: true, date: day.date });
        }).catch(err => {
          this.$message.error('计划删除失败');
        })
      })
    },

    deletePlanAction(){
      this.$confirm(`确定要删除当前计划吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePlan(this.vm.planID).then(res => {
          this.$message.success('计划删除成功');
          let day= this.poolManager.currentDay;
          this.$emit('refresh-date-panel', { sureDate: true, date: day.date });
        }).catch(err => {
          this.$message.error('计划删除失败');
        })
      })
    },

    // dayInt转字符串
    dayIntToText(dayInt){
      dayInt= (dayInt+ '').split('');
      dayInt.splice(4, 0, '年');
      dayInt.splice(7, 0, '月');
      return dayInt.join('')+ '日';
    },

    isCost(price){
      return parseFloat(price)< parseFloat(this.vm.average);
    },

    // 跳转到共享库存页
    toSharedInventoryPage(){
      let day= this.poolManager.currentDay;
      this.$router.push({ 
        path: '/sharedInventory', 
        query: { 
          team_id: parseInt(this.$route.query.id), 
          timestamp: day.date.getTime(), 
          inventory_id: this.vm.inventoryID
        } 
      });
    },

    getPlanData(){
      let { inventoryID, count, dateHous, name, regimentType }= this.vm;
      let planEnroll= this.$deepCopy(this.enrolls);
      return {
        inventoryID, name, count, dateHous, regimentType, planEnroll
      }
    },

    awakeEditForm(){
      let payload= this.getPlanData();
      payload.share= this.poolManager.state;
      payload.day= this.poolManager.currentDay;
      this.$emit('awake-edit-form', payload);
    },
  }
}
</script>