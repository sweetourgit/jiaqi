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
        <el-table-column label="操作" prop="adult_straight_price" header-align="center" align="center">
          <template>
            <el-button type="text" size="small"
              :disabled="parentState=== 'readonly'">
              编辑
            </el-button>
            <el-button type="text" size="small"
              :disabled="parentState=== 'readonly'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <PriceEditor ref="editor"
      :cabin-type-options="cabinTypeOptions">
    </PriceEditor>
  </div>
</template>

<script>
import PriceEditor from './comps/PriceEditor'
import { getLinerCabinType } from '@/page/productManagement/planInventory/liner/api'

/**
cabin_id: null,
    title: '',
    min_stay: null,
    max_stay: null,
    stock: null,
    adult_same_price: null,
    adult_straight_price: null,
    line_status: 1
 */
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
    init(priceArr){
      this.cabinTypePromise.then(() => {
        priceArrCache= priceArr;
        this.priceMap= this.makePriceMap(priceArr);
        this.title= this.priceMapKeys[0];
      })
    },

    makeCabinTypeOptions(){
      this.cabinTypePromise= getLinerCabinType({ liner_id: 1, limit: 100 }).then(res => {
        this.cabinTypeOptions= res
        return Promise.resolve();
      });
    },

    // 分类price
    makePriceMap(priceArr){
      priceArr= [
        {
          "cabin_id": 1,
          "title": "string",
          "min_stay": 0,
          "max_stay": 0,
          "stock": 0,
          "adult_same_price": 0,
          "adult_straight_price": 0,
          "line_status": 0
        }
      ]
      let result= {};
      priceArr.forEach(price => {
        let { title }= price;
        if(!(title in result)) result[title]= [];
        result[title].push(price);
      })
      return result;
    },

    awakeEditor(price){
      this.$refs.editor.init(price, { title: this.title });
    },
  }

}
</script>