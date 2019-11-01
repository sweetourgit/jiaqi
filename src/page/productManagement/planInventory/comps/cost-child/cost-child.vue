<style lang="scss" scoped>
.cost-child{
  height: 100%;
  position: relative;
  padding-left: 200px;
  .main{
    width: 100%;
    height: 100%;
    padding-left: 10px;
    border-left: 1px solid #ddd;
    &>header{
      position: relative;
      padding-bottom: 20px;
      .rate, .average{
        display: inline-block;
      }
      .average{
        margin-left: 50px;
      }
      .btn{
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
</style>

<template>
  <div class="cost-child">
    <common-slider style="position:absolute;width: 200px;left: 0; top: 0;"
      ref="sliderRef"
      @slider-select="init"
    ></common-slider>
    <div class="main">
      <header>
        <div class="rate">
          <span>毛利率：</span>
          <el-input size="small" placeholder="毛利率" style="width: 200px;"
            v-model="vm.rate"
            :disabled="!vm.inited"
            @blur="saveRateAction"
          >
            <template slot="append">%</template>
          </el-input>
        </div>
        <div class="average">
          <span>人均结算价：{{ vm.average }} 元</span>
        </div>
        <div class="btn">
          <el-button type="primary" size="small" 
            :disabled="!vm.inited"
          >添加成本</el-button>
        </div>
      </header>
      <main>
        <el-table border style="width: 100%"
          :data="tableData" 
          :highlight-current-row="false"
        >
          <el-table-column label="ID" prop="id" header-align="center" align="center"></el-table-column>
          <el-table-column label="成本类型" prop="supplierTypeEX" header-align="center" align="center"></el-table-column>
          <el-table-column label="供应商" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="金额（元）" prop="money" header-align="center" align="center"></el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </main>
    </div>
  </div>
</template>

<script>
import { getAverage, getCostList, saveRate } from '../../planInventory'
import commonSlider from '../common-slider'

export default {

  components: { commonSlider },

  data(){
    return {
      vm: {
        rate: null,
        average: 0,
        rateReg: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
      },
      tableData: []
    }
  },

  methods: {
    init(payload){
      let { id, rate }= payload;
      if(!id) return this.vm.inited= false;
      this.checkProto= payload;
      this.vm.inited= true;
      this.vm.rate= rate;
      this.$refs.sliderRef.init(id);
      this.getAverageAction(id);
      this.getCostListAction(id);
    },

    getAverageAction(id){
      getAverage(id).then(res => {
        this.vm.average= res;
      })
    },

    getCostListAction(id){
      getCostList(id).then(res => {
        this.tableData.splice(0);
        this.tableData.push(...res);
      })
    },

    saveRateAction(){
      let rate= this.vm.rate;
      // 未过验证
      if(!this.vm.rateReg.test(rate+ '')){
        this.vm.rate= this.checkProto.rate;
        return this.$message.error('请输入正确的毛利率格式');
      };
      // 未变化
      if(this.checkProto.rate=== parseFloat(rate)) return;
      let { id }= this.checkProto;
      saveRate({ id, rate }).then(() => {
        this.init(this.checkProto);
        this.$message.success('毛利率修改成功');
      });
    },
  }

}
</script>