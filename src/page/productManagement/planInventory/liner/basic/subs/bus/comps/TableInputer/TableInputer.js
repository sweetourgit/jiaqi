const TableInputerFactory= function($){
  return {
    props: {
      value: [String, Number],
      table: String,  // 所属表格
      column: String, // 所属列 
      options: {
        type: Object,
        default: function(){
          return {
            placeholder: '',  // String
            pattern: null, // RegExp
            validator: null, // Function
            asyncValidator: null, // Function<Promise>
            adaptor: null, // Function 输入框内容类型适配
            message: null, // String 提示
            successCb: null, // Function
            cancelCb: null, // Function
          }
        }
      },
    },

    render: function (h) {
      const show= this.inEdit? 
        <div style="display: flex;padding: 0 20px;">
          { 
            h('el-input', {
              ref: 'inputRef',
              props: {
                value: this.val
              },
              attrs: {
                size: 'mini',
                placeholder: this.options.placeholder
              },
              on: {
                input: (event) => this.val= event,
              },
              nativeOn: {
                keydown: (event) => {
                  let { keyCode }= event;
                  if(keyCode && keyCode=== 13) this.submitVal();
                }
              }
            }) 
          }
          <el-button size="mini" type="success" icon="el-icon-check" style="padding: 7px 7px;"
            onClick={ this.submitVal }>
          </el-button>
          <el-button size="mini" type="info" icon="el-icon-close" style="margin: 0;padding: 7px 7px;"
            onClick={ this.close }>
          </el-button>
        </div>
          : 
        h('div', 
          {
            on: {
              click: this.focus
            }
          }, 
          this.$slots.default
        );

      return (
        <div class="table-input">
          { show }
        </div>
      )
    },

    created(){
      let block= this.block;
      if($.inited && block) return $.push(this.block, this);
      let { name }= this.$route;
      if($.route!== name) $.reset();
      $.init(name);
      if(block) $.push(block, this);
    },

    beforeDestroy(){
      if(this.block) $.pop(this.block, this);
    },

    computed: {
      block(){
        if(!this.table || !this.column) return null;
        return this.table+ '_'+ this.column;
      }
    },

    data: function(){
      return {
        inEdit: false,
        val: this.value
      }
    },

    methods: {
      submitVal(){
        let { pattern, validator, asyncValidator, adaptor, message, successCb }= this.options;
        let oldVal= this.value;
        let val= this.val;
        if(pattern && !pattern.test(val)){
          this.$message.error(message || '格式错误');
          return this.focus();
        }
        if(adaptor) val= adaptor(val);
        if(validator && !validator(val)){
          this.$message.error(message || '验证失败');
          return this.focus();
        }
        if(asyncValidator) return asyncValidator(val).then(() => {
          this.$emit('input', val);
          this.inEdit= false;
          if(successCb) successCb.call(null, { vm: this, index: $.getIndex(this.block, this), oldVal });
        })
        .catch((err) => {
          if(err) this.$message.error(err);
          return this.focus();
        })
        this.$emit('input', val);
        this.inEdit= false;
        if(successCb) successCb.call(null, { vm: this, index: $.getIndex(this.block, this), oldVal });
      },

      focus(){
        this.inEdit= true;
        this.$nextTick(() => this.$refs.inputRef.focus());
      },

      close(){
        let { cancelCb }= this.options;
        this.val= this.value;
        this.inEdit= false;
        if(cancelCb) cancelCb.call(null, { vm: this });
      }
    }
  }
}

export default TableInputerFactory