<style lang="scss" scoped>
.common-editor{
  padding-bottom: 50px;
  width: 850px;
  box-sizing: border-box;
  &>header{
    border: 1px solid #ccc;
    border-bottom: none;
    padding: 5px;
    .title{
      line-height: 32px;
    }
  }
  &>footer{
    border: 1px solid #ccc;
    border-top: none;
    padding: 5px;
  }
}
</style>

<template>
  <div class="common-editor">
    <header>
      <div v-if="hasDeleteBtn">
        <span>标题：</span>
        <el-input size="small" style="width: 300px;" maxlength="20" 
          v-model="editor.title"
          :show-word-limit="true"
        ></el-input>
      </div>
      <span v-else class="title">{{ editor.title }}</span>
    </header>
    <vue-editor 
      v-model="editor.content"
      :editorToolbar='$defaultToolbar'>
    </vue-editor>
    <footer>
      <slot name="delete"></slot>
      <!-- <el-button type="primary" size="small">删除说明</el-button> -->
    </footer>
  </div>
</template>

<script>
/**
 * @description: 未富文本编辑器包裹一层
 */
// 第三方组件
import { VueEditor } from 'vue2-editor'

import ValidateMsgMixin from '@/mixin/ValidateMsgMixin'

export default {
  mixins: [ValidateMsgMixin],

  components: { VueEditor },

  props: {
    proto: Object
  },
  
  created(){
    this.init();
  },

  watch: {
    proto(nval){
      console.log(this.editor)
    }
  },

  computed:{
    hasDeleteBtn(){
      if(this.$slots && 
          this.$slots.delete && 
            this.$slots.delete.length!== 0){
              return true;
            }
      return false;
    }
  },
  
  data(){
    return {
      editor: null,
    }
  },

  methods: {
    init(){
      this.editor= this.$deepCopy(this.proto);
    },

    checkHasChange(){
      return !(this.$checkLooseEqual(this.editor, this.proto));
    },

    validate(){
      if(this.hasDeleteBtn){
        if(this.editor.title && this.editor.content){
          return true;
        } else {
          this.makeErrorQueueMsg('标题和内容不能为空')
          return false;
        }  
      } else {
        return true;
      }
    },

    getData(){
      let data= {};
      Object.keys(this.editor).forEach(attr => 
        attr!== 'sign' && (data[attr]= this.editor[attr]) 
      )
      return data;
    },
  }
}
</script>