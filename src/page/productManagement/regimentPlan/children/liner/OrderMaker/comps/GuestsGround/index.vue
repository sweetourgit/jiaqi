<template>
  <div style="padding-bottom: 40px;">
    <div style="padding: 10px 0 22px 0;">
      <LinkTitleBar
        ref="titleBar"
        @select="selectCabin">
      </LinkTitleBar>
    </div>
    <main>
      <el-table border size="small" style="width: 100%"
        :data="currentCabin.guests" 
        :highlight-current-row="false"
        header-row-class-name="row-header">
        <el-table-column label="姓名" prop="name" header-align="center" align="center" width="150"></el-table-column>
        <el-table-column label="报名类型" header-align="center" align="center" width="100">成人</el-table-column>
        <el-table-column label="护照" prop="passport" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column label="电话" prop="tel" header-align="center" align="center" width="200"></el-table-column>
        <el-table-column label="身份证" prop="id_card" header-align="center" align="center" width="250"></el-table-column>
        <el-table-column label="性别" prop="sex" header-align="center" align="center" width="100"></el-table-column>
        <el-table-column label="操作" prop="sale_price" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text"
              @click="awakeEditor(scope.row)">
              编辑
            </el-button>
            <el-button type="text"
              @click="removeHandler(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <GuestEditor ref="editor"></GuestEditor>
    </footer>
  </div>
</template>

<script>
import {
  CABIN_SPLIT_TYPE,
  getCabinDTO 
} from '../../dictionary'
import LinkTitleBar from '../CabinGround/comps/LinkTitleBar/index'
import GuestEditor from './GuestEditor.vue'

export default {
  components: { LinkTitleBar, GuestEditor },
  
  computed: {
    cabinTitles(){
      return this.cabin.map((el, index) => {
        let skuPrice= el.sku_price;
        let { id, title }= skuPrice;
        return { key: id, label: title, selected: this.cabin.length=== index+ 1 };
      })
    },
  },

  data(){
    return {
      cabin: [],
      currentCabin: getCabinDTO()
    }
  },
  
  methods: {
    init(cabin){
      this.cabin= cabin;
    },
    
    selectCabin(index){
      if(index< 0) return;
      this.currentCabin= this.cabin[index];
    },

    awakeEditor(guest){
      this.$refs.editor.awake(guest);
    },

    removeHandler(index){
      let { cabin_type, sku_price, guests }= this.currentCabin;
      if(guests.length<= sku_price.min_stay) return this.$message.error(`${sku_price.title}最少报名${sku_price.min_stay}人`);
      this.currentCabin.guests.splice(index, 1);
    }
  }
}
</script>