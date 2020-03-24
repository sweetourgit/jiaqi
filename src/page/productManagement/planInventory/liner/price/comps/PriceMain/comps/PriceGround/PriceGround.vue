<style lang="scss" scoped>
.price-ground{
  margin-top: 50px;
  &>header{
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
}
</style>

<template>
  <div class="price-ground">
    <header>
      <el-button-group>
        <el-button size="mini" type="info"
          v-for="el in priceMapKeys" 
          :key="el"
          @click="title= el">
          {{ el }}
        </el-button>
      </el-button-group>
      <el-button type="primary" size="mini"
        :disabled="parentState=== 'readonly'"
        @click="awakeEditor(null)">
        新增报名类型
      </el-button>
    </header>
    <main>
      <el-table border size="mini" style="width: 100%"
        :data="tableData" 
        :highlight-current-row="false"
        header-row-class-name="row-header">
        <el-table-column label="标题" prop="title" header-align="center" align="center"></el-table-column>
        <el-table-column label="房型" header-align="center" align="center">
          <template slot-scope="scope">{{ getCabinName(scope.row.cabin_id) }}</template>
        </el-table-column>
        <el-table-column label="最少入住" prop="min_stay" header-align="center" align="center"></el-table-column>
        <el-table-column label="同业价" prop="adult_same_price" header-align="center" align="center"></el-table-column>
        <el-table-column label="销售价" prop="adult_straight_price" header-align="center" align="center"></el-table-column>
        <el-table-column label="库存" prop="stock" header-align="center" align="center"></el-table-column>
        <el-table-column label="上线/下线" prop="line_status" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small"
              :disabled="parentState=== 'readonly'"
              @click="awakeEditor(scope.row)">
              编辑
            </el-button>
            <el-button type="text" size="small"
              :disabled="parentState=== 'readonly'"
              @click="removePrice(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <PriceEditor ref="editor"
      :cabin-type-options="cabinTypeOptions"
      @submit="emitPrice">
    </PriceEditor>
  </div>
</template>

<script>
import PriceEditor from './comps/PriceEditor'
import { getLinerCabinType } from '@/page/productManagement/planInventory/liner/api'

let priceArrCache= null;
export default {
  components: { PriceEditor },

  props: ['parentState'],

  mounted(){
    this.makeCabinTypeOptions();
  },

  computed: {
    priceMapKeys(){
      return this.priceMap && Object.keys(this.priceMap);
    }
  },

  data(){
    return {
      cabinTypePromise: null,
      cabinTypeOptions: [],
      priceMap: null,
      tableData: [],
      title: null
    }
  },

  methods: {
    init(priceArr, cabin_name){
      this.cabinTypePromise.then(() => {
        priceArrCache= priceArr;
        this.priceMap= this.makePriceMap(this.$deepCopy(priceArr));
        this.changeTableData(cabin_name || this.priceMapKeys[0]);
      })
    },

    changeTableData(title){
      this.title= title;
      this.tableData= this.priceMap[title];
    },

    makeCabinTypeOptions(){
      this.cabinTypePromise= getLinerCabinType({ liner_id: 1, limit: 100 }).then(res => {
        this.cabinTypeOptions= res
        return Promise.resolve();
      });
    },

    getCabinName(cabin_id){
      let { name }= this.$refs.editor.findCabin(cabin_id);
      return name;
    },

    // 分类price， price的title是自己的title，而分类用的title，是price.cabin_id对应的title
    makePriceMap(priceArr){
      let result= {};
      priceArr.forEach(price => {
        let { cabin_id }= price;
        let { name }= this.$refs.editor.findCabin(cabin_id);
        if(!(name in result)) result[name]= [];
        result[name].push(price);
      })
      return result;
    },

    awakeEditor(price){
      this.$refs.editor.init(price, { title: this.title });
    },

    removePrice(price){
      let { name }= this.$refs.editor.findCabin(price.cabin_id);
      let index= priceArrCache.find(el => el=== price);
      priceArrCache.splice(index, 1);
      this.init(priceArrCache, name);
    },

    /**
     * @description: 修改新增通用
     */
    emitPrice({ price, isAdd }){
      let { name }= this.$refs.editor.findCabin(price.cabin_id);
      if(isAdd) priceArrCache.push(price);
      this.init(priceArrCache, name);
    },

    notChange(originData){
      let bol= true;
      bol= (priceArrCache.length=== originData.length);
      if(bol) bol= this.$checkLooseEqual(priceArrCache, originData);
      return bol;
    },

    getData(){
      return [...priceArrCache];
    }
  }

}
</script>