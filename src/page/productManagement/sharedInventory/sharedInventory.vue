<style lang="scss" scoped>
.shared-inventory{
  height: calc(100% - 58px);
  padding-bottom: 50px;
  &>header{
    display: flex;
    justify-content: space-between;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
  }
  &>main{
    display: flex;
    height: calc(100% - 47px);
    &>.slider{
      flex-grow: 0;
      width: 300px;
      height: 100%;
      overflow: auto;
      border-right: 1px solid #ddd;
      .name-menu{
        .bar{
          user-select: none;
          padding: 2px 2px 2px 0;
          .content{
            padding: 20px;
            background-color: rgba(0,0,0,0.1);
          }
          .select{
            background-color: #FFF;
          }
        }
        .blank{
          padding: 20px;
          text-align: center;
        }
      }
    }
    &>.main{
      width: 100%;
      height: 100%;
      overflow: auto;
      padding-left: 20px;
      padding-top: 15px; 
      &>header{
        .title{
          display: flex; 
          justify-content: space-between; 
          align-items: center;
        }
      }
      &>main{
        .table-bar{
          padding-top: 20px;
          .table-header{
            background-color: red;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="shared-inventory">
    <header>
      <shared-header
        @in-async="emitInAsync"
        @submit-inventory="emitSubmitInventory"
      ></shared-header>
      <el-button type="primary" size="small">添加库存</el-button>
    </header>
    <main 
      v-loading="vm.mainAsync"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="slider">
        <div class="name-menu">
          <div class="bar blank" 
            v-show="!Inventorys.length"
          >（无库存信息）</div>
          <div class="bar" 
            v-for="(item, i) in Inventorys"
            :key="item.id"
          >
            <div 
              @click="selectInventory(i)"
              :class="['content', i=== vm.index? 'select': '']"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="main" v-if="vm.index!== null">
        <header>
          <div class="title">
            <span>
              <span>库存名称：</span>
              <span>{{ current.name }}</span>
            </span>
            <el-button type="primary" size="small">编辑</el-button>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; background: rgba(0,0,0,0.1)">
            <el-form label-width="100px">
              <el-row>
                <el-col style="width: 250px;">
                  <el-form-item label="总库存：" prop="podCity">
                    {{ current.count }}
                  </el-form-item>
                </el-col>
                <el-col style="width: 250px;">
                  <el-form-item label="剩余库存：" prop="podTime">
                    {{ current.relaInventory }}
                  </el-form-item>
                </el-col>
                <el-col style="width: 250px;">
                  <el-form-item label="人均成本：" prop="podPlace">
                    {{ parseDouble(current.averageCost) }}
                  </el-form-item>
                </el-col>
                <el-col style="width: 250px;">
                  <el-form-item label="操作：" prop="podTime">
                    {{ current.createUser }}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            
          </div>
        </header>
        <main>
          <!-- <div v-html="plans" style="white-space:pre-wrap"></div> -->
          <div class="table-bar"
            v-for="(plan, i) in plans"
            :key="i" 
          >
            <el-table border style="width: 100%"
              header-row-class-name="table-header"
              :data="plan.planEnroll" 
              :highlight-current-row="false"
            >
              <el-table-column label="报名类型" prop="enrollName" header-align="center" align="center"></el-table-column>
              <el-table-column label="销售价" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ parseDouble(scope.row.price_01) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="同业价" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ parseDouble(scope.row.price_02) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结算价" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ parseDouble(scope.row.price_03) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="配额" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ parseDouble(scope.row.quota) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="已售" header-align="center" align="center">
                <template slot-scope="scope">
                  <span>{{ parseDouble(scope.row.price_01) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </main>
      </div>
    </main>
  </div>
</template>

<script>
import { inventoryAction } from './api'
import sharedHeader from './comps/shared-header/shared-header.vue'

export default {
  components: { sharedHeader },

  mounted(){
    document.querySelector(".content-body1").style.height= "100%";
  },

  data(){
    return {
      vm: {
        mainAsync: false,
        index: null,
      },
      Inventorys: [],
      // 当前选择的库存
      current: {},
      plans: []
    }
  },

  methods: {
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    emitSubmitInventory(day){
      console.log(day)
      let { children }= day;
      this.Inventorys.splice(0);
      this.vm.index= null;
      children && this.Inventorys.push(...children);
    },

    /**
     * @description: 面板收起则将异步loading显示在main上
     */
    emitInAsync(bol){
      this.vm.mainAsync= bol;
    },

    selectInventory(i){
      if(this.vm.index=== i) return;
      let inventory= this.Inventorys[i];
      this.vm.index= i;
      this.vm.inventoryAsync= true;
      this.current= inventory;
      inventoryAction.bind(this)(inventory.id).then(res => {
        this.plans.splice(0);
        if(res && res.length) this.plans= res;
      }).finally(() => {
        this.vm.inventoryAsync= false;
      })
    },

    parseDouble(val){
      val= parseFloat(val);
      return val.toFixed(2)
    }
  }
}
</script>