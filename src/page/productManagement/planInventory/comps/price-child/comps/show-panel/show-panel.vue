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
        <div class="edit-btns">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="primary" size="small" v-if="vm.share=== 2">删除</el-button>
        </div>
      </header>
      <main>
        <div class="bar">
          库存类型：{{ vm.share=== 1? '共享': '非共享' }}
        </div>
        <div class="bar" v-if="vm.share=== 1">
          共享库存：{{ vm.name}}
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
            <div class="bar">
              同业价：{{ enroll.price_02 }}
            </div>
            <div class="bar">
              甜橙结算价：{{ enroll.price_03 }}
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
import { getPlan, getInventory } from '../../../../planInventory'
import { DAY_STATE } from '../../../../dictionary'

export default {

  inject: ['poolManager'],

  data(){
    return {
      vm: {
        state: false,
        previous: false,
        dateText: '',
        share: '',
        name: '',
        regimentType: '',
        dateHous: '',
        count: 0,
      },
      enrolls: [],
    }
  },

  methods: {
    init(payload){
      let { date, id }= payload;
      if(id) this.packageID= id;
      this.poolManager.initShowVM({ vm: this });
    },

    setState(state, day){
      if(state=== DAY_STATE.MULTIPLE || state=== DAY_STATE.UNDO) return this.vm.state= false;
      this.vm.state= true;
      let computedDay= this.dayFactory(day); 
    },

    dayFactory(day){
      let { after, dayInt, vm }= day;
      this.getInventoryAction(vm.planID);
      this.vm.previous= !after;
      this.vm.dateText= this.dayIntToText(dayInt);
      // 均价
      this.vm.average= this.poolManager.getAverage();
      this.enrolls.splice(0);
      this.enrolls.push(...vm.plan_Enrolls);
    },

    getInventoryAction(id){
      getPlan(id).then(res => {
        let { inventoryID, dateHous, regimentType }= res;
        this.vm.dateHous= dateHous;
        this.vm.regimentType= regimentType;
        getInventory(inventoryID).then(res2 => {
          let { share, name, count }= res2;
          this.vm.share= share;
          this.vm.name= name;
          this.vm.count= count;
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
    }
  }
}
</script>