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
      @click=
    ></el-button>
  </div>
</template>

<script>
import MaterialList from '@/common/Image'

export default {
  components: { MaterialList },
  
  props: {
    imgData: [String, Array],
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
      let proto= this.imgData;
      if(typeof proto=== 'string'){
        this.list.push(proto);
      } 
      if(proto && typeof proto=== 'object'){
        this.list.push(...proto);
      }
    }
  }

}
</script>