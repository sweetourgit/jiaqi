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
          cursor: pointer;
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
        :key="item.ID"
      >
        <!-- onerror="javascript:this.src='images/logoError.png';" -->
        <img :src="item.picturePath" alt="">
        <div class="interceptor">
          <ul>
            <!-- 关闭 -->
            <li>
              <i class="el-icon-view" style="font-size: 18px;"
                @click="$emit('wakeup-preview', item)"
              ></i>
            </li>
            <li>
              <i class="el-icon-delete" style="font-size: 18px;"
                @click="$emit('remove-handler', i)"
              ></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-button type="primary" size="small" icon="el-icon-plus" circle
      v-show="list.length< numLimit || numLimit=== -1"
      @click="$emit('wakeup-material', getIdList())"
    ></el-button>
  </div>
</template>

<script>

export default {
  
  props: {
    proto: String,
    numLimit: {
      type: Number,
      default: -1
    },
  },

  watch:{
    proto: {
      handler(nval){
        console.log(nval)
        if(!nval) return this.list.splice(0);
        nval= this.$deepCopy(JSON.parse(nval));
        nval.forEach(el => {
          this.getPictureAction(el.ID).then(res => {
            el.picturePath= res.url;
            this.$forceUpdate();
          }).catch(err => {
            el.picturePath= this.ERROR_URL;
          })
        })
        this.list.splice(0);
        this.list.push(...nval);
      },
      immediate: true
    }
  },

  data(){
    return {
      list: [],
      ERROR_URL: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    }
  },

  methods: {
    getIdList(){
      return this.list.map(el => el.ID);
    },

    getPictureAction(id){
      return new Promise((resolve, reject) => {
        this.$http.post(this.GLOBAL.serverSrc + "/tpk/picture/api/get", {
          id
        },{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        }).then(res => {
          let { isSuccess, object }= res.data;
          if(!isSuccess) return reject('获取图片失败');
          return resolve(object);
        }).catch((err) => {
          reject(err);
        })
      })
    }
  }

}
</script>