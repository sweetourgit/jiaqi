<style lang="scss" scoped>
.city-list{
  height: 100%;
  box-sizing: border-box;
  &>main{
    position: relative;
    width: 1400px;
    padding-left: 244px; 
    .tree-slider{
      position: absolute;
      top: 0;
      left: 0;
      width: 244px;
      height: 540px;
    }
    .table-ground{
      box-sizing: border-box;
      width: 1156px;
    }
  }
}
</style>

<template>
  <div class="city-list">
    <header>
      <bread-header ref="breadHeaderRef"
        @node-click="nodeClickHandler"
      ></bread-header>
    </header>
    <main>
      <div class="tree-slider">
        <tree-slider ref="treeSliderRef"
          @node-click="nodeClickHandler"
        ></tree-slider>
      </div>
      <div class="table-ground">
        <table-ground ref="tableGroundRef"
          @node-click="nodeClickHandler"
          @wakeup-add-form="wakeupAddForm"
          @wakeup-edit-form="wakeupEditForm"
        ></table-ground>
      </div>
    </main>
    <footer>
      <edit-form ref="editFormRef"
        @refresh="refresh"
      ></edit-form>
      <add-form ref="addFormRef"
        @refresh="refresh"
      ></add-form>
    </footer>
  </div>
</template>

<script>
import breadHeader from './comps/breadHeader'
import treeSlider from './comps/treeSlider'
import tableGround from './comps/tableGround/tableGround'
import editForm from './comps/editForm.vue'

export default {

  components: { breadHeader, treeSlider, tableGround, editForm },

  mounted(){
    this.init();
  },

  data(){
    return {

    }
  },

  methods: {
    init(){
      this.$refs.treeSliderRef.init();
    },

    refresh(parent){
      this.$refs.tableGroundRef.refresh(parent);
    },

    nodeClickHandler(nodeProto){
      this.$refs.breadHeaderRef.init(nodeProto);
      this.$refs.tableGroundRef.init(nodeProto);
    },

    wakeupAddForm(payload){
      let { id, level, areaName }= payload;
      this.$refs.addFormRef.wakeup(
        this.getAreaDTO(id), 
        Object.assign(this.getFormShow(level), { parent: payload})
      );
    },
    wakeupEditForm(payload){
      let { id, level, parent }= payload;
      let dto= this.getAreaDTO(parent.id);
      Object.keys(dto).forEach(attr => dto[attr]= payload[attr]);
      dto.id= id;
      console.log(this.$refs.editFormRef)
      this.$refs.editFormRef.wakeup(
        dto, 
        Object.assign(this.getFormShow(level- 1), { parent })
      )
    },
    
    // 得到form表现层数据
    getFormShow(level){
      switch (level) {
        case 1: return { belongLabel: '所属大洲', nameLabel: '国家名称' }; break;
        case 2: return { belongLabel: '所属国家', nameLabel: '区域名称' }; break;
        default: return { belongLabel: '所属区域', nameLabel: '区域名称' }; break;
      }
    },

    getAreaDTO(parentID){
      return {
        areaName: null,
        englishName: null,
        chineseFull: null,
        firstChar: null,
        areaCode: null,
        parentID,
        isLeaf: 2,
        initial: null,  // 首拼
        earth: '-1',
        markName: null, // 备用名
        url: null,
      }
    },

    test(){}
  }
}
</script>