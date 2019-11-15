<template>
  <el-dialog
    title="预览"
    :visible.sync="state"
    width="50%"
    :before-close="handleClose">
    <div style="width: 100%; line-height: 0;">
      <img :src="url" alt="">
    </div>
  </el-dialog>
</template>

<script>
export default {

  data(){
    return {
      state: false,
      url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    }
  },

  methods: {
    wakeup(item){
      this.url= item.picturePath;
      this.state= true;
    },

    handleClose(){
      this.url= 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      this.state= false;
    }
  }
}
</script>