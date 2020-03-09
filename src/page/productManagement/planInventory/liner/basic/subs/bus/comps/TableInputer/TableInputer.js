const TableInputerFactory= function($){
  return {
    props: {
      value: [String, Number],
      // 所属表格
      table: String,
      column: String, 
      options: {
        type: Object,
        default: function(){
          return {
            placeholder: '',  // String
            pattern: null, // RegExp
            validator: null, // Function
            adaptor: null, //Function格式化
            message: null, // String 提示
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
            onClick={ () => this.inEdit = false }>
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
      console.log(this)
      if($.inited) return $.push(this.block, this);
      let { name }= this.$route;
      if($.route!== name) $.reset();
      $.init(name);
      if(this.block) $.push(this.block, this);
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
        let { pattern, validator, adaptor, message }= this.options;
        let val= this.val;
        if(pattern && !pattern.test(val)) return this.$message.error(message || '格式错误');
        if(adaptor) val= adaptor(val);
        if(validator && !validator(val)) return this.$message.error(message || '验证失败');
        this.$emit('input', val);
        this.inEdit= false;
      },

      focus(){
        this.inEdit= true;
        this.$nextTick(() => this.$refs.inputRef.focus());
      }
    }
  }
}

export default TableInputerFactory