const TableInputerFactory= function(_){
  return {
    props: {
      value: [String, Number],
      options: {
        type: Object,
        default: function(){
          return {
            placeholder: '',  // String
            pattern: null, // RegExp
            validator: null, // Function
            message: null, // String 提示
          }
        }
      },
    },
    
    /*
    <div class="table-input">
    <div class="table-input-outer"
      v-if="inEdit">
      <el-input size="mini"
        v-model="val"
        :placeholder="options.placeholder">
      </el-input>
      <el-button size="mini" type="success" icon="el-icon-check" style="padding: 7px 7px;"
        @click="submitVal"></el-button>
      <el-button size="mini" type="info" icon="el-icon-close" style="margin: 0;padding: 7px 7px;"
        @click="inEdit= false">
      </el-button>
    </div>
    <div @click="inEdit= true"
      v-else>
      <slot></slot>
    </div>
  </div>
  */


    render: function (h) {
      const self= this;
      const show= this.inEdit? 
        <div style="display: flex;padding: 0 20px;">
          {
            h('el-input', {
              props: {
                value: self.val,
                size: 'mini'
              },
              on: {
                input:(event) => {
                  self.val= event
                }
              }
            })
          }
          <el-button size="mini" type="success" icon="el-icon-check" style="padding: 7px 7px;"
            onClick={ self.submitVal }>
          </el-button>
          <el-button size="mini" type="info" icon="el-icon-close" style="margin: 0;padding: 7px 7px;">
          </el-button>
        </div>
          : h('div', 
              {
                on: {
                  click:() => { this.inEdit= true }
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

    data: function(){
      return {
        inEdit: false,
        val: this.value
      }
    },

    methods: {
      submitVal(){},
    }
  }
}

export default TableInputerFactory