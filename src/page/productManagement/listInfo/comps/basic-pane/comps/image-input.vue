<style lang="scss" scoped>
$ground-width: 460px;
$radius: 4px;
$image-size: 100px;
$image-margin: 15px;
.image-input{
  display: flex; 
  align-items: flex-end;
  .image-ground{
    display: flex;
    flex-wrap: wrap;
    max-width: $ground-width;
    .img-outer {
      position: relative;
      width: $image-size;
      height: $image-size;
      margin-top: $image-margin;
      margin-right: $image-margin;
      border-radius: $radius;
      img {
        width: 100%;
        height: 100%;
        border-radius: $radius;
      }
      .interceptor {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        color: transparent;
        background-color: transparent;
        border-radius: $radius;
        ol, ul {
          list-style: none;
        }
        ul, li{
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
        }
      }
      .interceptor:hover {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>

<template>
  <div class="image-input" style="display: flex; align-items: flex-end;">
    <div class="image-ground">
      <div class="img-outer"
        v-for="(item, i) in list"
        :key="i"
      >
        <img :src="item" alt="">
        <div class="interceptor">
          <ul>
            <!-- 关闭 -->
            <li>
              <i class="el-icon-view" style="font-size: 18px;"></i>
            </li>
            <li>
              <i class="el-icon-delete" style="font-size: 18px;"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-button type="primary" size="small" icon="el-icon-plus" circle
      @click="wakeupMaterialList"
    ></el-button>
    <material-list
      ref="materialListRef"
      :proto="list"
      @submit-list="emitSubmitList"
    ></material-list>
  </div>
</template>

<script>
import MaterialList from './material-list'

export default {
  components: { MaterialList },
  
  props: {
    // 初始化数据
    proto: [String, Array],
    // 最大数量限制, -1为不限制数量
    numLimit: {
      type: Number,
      default: -1
    },
  },

  created(){
    this.init();
  },

  data(){
    return {
      list: [],
    }
  },

  methods: {
    init(){
      this.list.splice(0);
      let proto= this.proto;
      if(typeof proto=== 'string'){
        this.list.push(proto);
      } 
      if(proto && typeof proto=== 'object'){
        this.list.push(...proto);
      }
    },

    // 唤醒图片选择组件
    wakeupMaterialList(){
      this.$refs.materialListRef.vm.state= true;
    },

    // 提交数据
    emitSubmitList(list){
      // 检查数量
      if(this.numLimit> 0 && list.length> this.numLimit) 
        return this.$message.error(`最多选择${this.numLimit}张图片`);
       
    }
  }

}
</script>