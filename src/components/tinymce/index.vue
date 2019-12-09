<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }
  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }
  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }
  .editor-upload-btn {
    display: inline-block;
  }
}
</style>

<template>
  <div class="tinymce-container">
    <textarea class="tinymce-textarea" 
      :id="$vnode.tag" />
    <div class="editor-custom-btn-container" @click="imageSuccessCBK">
      <editorImage color="#1890ff" class="editor-upload-btn" 
        @successCBK="imageSuccessCBK" />
    </div>
    <button @click="imageSuccessCBK">asdfasdf</button>
  </div>
</template>

<script>
import editorImage from './comps/EditorImage'

export default {

  components: { editorImage },

  props: {
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return ['formatselect bold alignleft aligncenter alignright outdent indent undo redo removeformat subscript superscript code', 'hr bullist numlist link image charmap preview insertdatetime media forecolor backcolor fullscreen']
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: '360'
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },

  mounted() {
    this.init(this.$vnode.tag)
  },
  beforeDestroy() {
    this.destroy()
  },

  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.$vnode.tag).setContent(val || ''))
      }
    }
  },

  data(){
    return Object.assign(
      // 状态
      {
        hasChange: false,
        hasInit: false
      },
      // 配置
      {
        plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
      }
    )
  },

  methods: {
    init(domId){
      const _this = this
      let id= this.$vnode.tag;
      window.tinymce.init({
        selector: `#${id}`,
        language: 'zh_CN',
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: this.plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          _this.hasInit = true;
          _this.editor= editor;
          _this.value && editor.setContent(_this.value);
          
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroy(){
      this.editor.destroy();
    },

    imageSuccessCBK2(arr) {
      const _this = this
      // arr.forEach(v => {
      //   window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      // })
      window.tinymce.get(this.$vnode.tag).insertContent(
        `
        <img class="wscnph" src="http://img4.imgtn.bdimg.com/it/u=1540229220,2046462304&fm=26&gp=0.jpg" />
        <img class="wscnph" src="http://img2.imgtn.bdimg.com/it/u=3105436742,112301016&fm=26&gp=0.jpg" />
        <img class="wscnph" src="http://img5.imgtn.bdimg.com/it/u=2525202780,1252778177&fm=26&gp=0.jpg />
        <img class="wscnph" src="http://img5.imgtn.bdimg.com/it/u=2525202780,1252778177&fm=26&gp=0.jpg" />
        `
      )
      // this.$emit('input', window.tinymce.get(this.$vnode.tag).getContent());
    },

    imageSuccessCBK(arr) {
      let result= "";
      arr.forEach(image => {
        let { src, dataSrc }= image;
        // result+= `img src="${src} data-src="${dataSrc}" />
        result+= `img src="${dataSrc} />
        `;
      })
      window.tinymce.get(this.$vnode.tag).insertContent(result);
    }
  }
}
</script>