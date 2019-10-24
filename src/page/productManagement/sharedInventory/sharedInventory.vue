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
            background-color: #FFF;
          }
          .select{
            background-color: rgba(0,0,0,0.1);
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
        padding-bottom: 20px;
        .table-bar{
          padding-top: 20px;
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
        ref="dateControllerRef"
        @in-async="emitInAsync"
        @submit-inventory="emitSubmitInventory"
      ></shared-header>
      <el-button type="primary" size="small" @click="wakeAddForm">添加库存</el-button>
    </header>
    <main 
      v-loading="vm.mainAsync"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
    >
      <div class="slider">
        <div class="name-menu">
          <div class="bar blank" 
            v-show="!inventorys.length"
          >（无库存信息）</div>
          <div class="bar" 
            v-for="(item, i) in inventorys"
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
            <span>
              <el-button type="primary" size="small" @click="wakeAddForm">编辑</el-button>
              <el-button type="info" size="small" @click="deleteAction">删除</el-button>
            </span>
            
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
            <div style="margin-top: 20px; padding-top: 20px; background: rgba(0,0,0,0.1)">
              <el-form label-width="100px">
                <el-row>
                  <el-col style="width: 250px;">
                    <el-form-item label="团期计划：">
                      {{ plan.groupCode }}
                    </el-form-item>
                  </el-col>
                  <el-col style="width: 250px;">
                    <el-form-item label="产品：">
                      {{ current.relaInventory }}
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <el-table border style="width: 100%"
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
    <footer>
      
      <!-- 添加表单 -->
      <add-inventory-form
        ref="addRef"
        @add-callback="emitAddCallback"
      ></add-inventory-form>
      
      <!-- 编辑表单 -->
      <edit-inventory-form
        ref="editRef"
        @add-callback="emitAddCallback"
      ></edit-inventory-form>
    </footer>
  </div>
</template>

<script>
import { inventoryAction, inventorydeleteAction } from './api'
import sharedHeader from './comps/shared-header/shared-header'
import addInventoryForm from './comps/add-inventory-form'
import editInventoryForm from './comps/edit-inventory-form'

export default {
  components: { sharedHeader, addInventoryForm, editInventoryForm },

  mounted(){
    // 修改页面高度问题
    document.querySelector(".content-body1").style.height= "100%";
  },

  beforeDestroy(){
    // 修改页面高度问题
    document.querySelector(".content-body1").style.height= null;
  },

  data(){
    return {
      vm: {
        mainAsync: false,
        index: null,
        currentDate: new Date(),
      },
      inventorys: [],
      // 当前选择的库存
      current: {},
      plans: []
    }
  },

  methods: {
    // 唤醒新增界面
    wakeAddForm(){
      this.$refs.addRef.handleOpen(this.vm.currentDate);
    },

    // 唤醒编辑界面
    wakeAddForm(){
      this.$refs.editRef.handleOpen();
    },

    /**
     * @description: $refs.addRef添加动作成功后提交
     */
    emitAddCallback(payload){
      let { date, id }= payload;
      this.$refs.dateControllerRef.init(date);
    },

    /**
     * @description: $refs.dateControllerRef时间改变时提交
     */
    emitSubmitInventory(day){
      let { children, date }= day;
      this.vm.index= null;
      this.vm.currentDate= date;
      this.inventorys.splice(0);
      children && this.inventorys.push(...children);
    },

    /**
     * @description: 面板收起则将异步loading显示在main上
     */
    emitInAsync(bol){
      this.vm.mainAsync= bol;
    },

    // slider中选中一条库存
    selectInventory(i){
      if(this.vm.index=== i) return;
      let inventory= this.inventorys[i];
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

    // 删除
    deleteAction(){
      this.$confirm(`确定要删除当前库存吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { id, relaInventory }= this.inventorys[this.vm.index];
        if(relaInventory) return this.$message.error('解绑关联团期，才能删除该库存');
        inventorydeleteAction.bind(this)(id).then(res => {
          this.$message.success('库存删除成功');
          return this.$refs.dateControllerRef.init(this.vm.currentDate);
        })
      })
    },

    // 将数字解析成双位小数
    parseDouble(val){
      val= parseFloat(val);
      return val.toFixed(2)
    }
  }
}
</script>